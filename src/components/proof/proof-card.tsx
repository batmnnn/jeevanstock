import type { ReactNode } from "react";
import { isAcknowledged } from "@/lib/domain";
import { blockToUnix } from "@/lib/views";
import type { EntityProof, Snapshot } from "@/lib/repo/types";
import { common, type Lang } from "@/lib/i18n";
import { entityUrl } from "@/lib/explorer";
import { isProofKey } from "@/lib/dashboard/keys";
import { proofFacts, type ProofFact } from "@/lib/dashboard/rows";
import { DASH, formatBlock, formatExpiry, formatHourBucket, formatUnixIst } from "@/lib/dashboard/time";
import { displayAddress, trustVerdict, type TrustCode } from "@/lib/dashboard/trust";
import { dashboard, proof, type ProofCopy } from "@/messages/dashboard";
import { cx, StatusChip } from "@/components/ui";
import { ChainAddress } from "./address";

function verdictText(code: TrustCode, t: ProofCopy): string {
  if (code === "stock-centre" || code === "report-payer" || code === "centre-admin") return t.trusted[code];
  return t.untrusted;
}

function FactValue({ fact, lang, source }: { fact: ProofFact; lang: Lang; source: "arkiv" | "memory" }) {
  const c = common[lang];
  const t = proof[lang];
  switch (fact.id) {
    case "centre":
      return fact.name;
    case "centreId":
      return <span className="font-mono">{fact.centreId}</span>;
    case "district":
    case "state":
      return fact.value;
    case "drug":
      return c.drug[fact.drug];
    case "vials":
      return c.vials(fact.vials);
    case "status":
      return <StatusChip status={fact.status} t={c} />;
    case "reason":
      return dashboard[lang].reason[fact.reason];
    case "posted":
      return formatUnixIst(fact.unix, lang);
    case "when":
      return formatHourBucket(fact.bucket, lang);
    case "wallet":
      return <ChainAddress address={fact.address} source={source} linkLabel={t.explorerAddress} empty={t.unreadable} full />;
    default:
      return DASH;
  }
}

export function ProofCard({
  lang,
  source,
  entity,
  snap,
}: {
  lang: Lang;
  source: "arkiv" | "memory";
  entity: EntityProof;
  snap: Snapshot;
}) {
  const t = proof[lang];
  const verdict = trustVerdict(entity, snap);
  const trusted = verdict.trusted;
  const kind = entity.kind === "centre" || entity.kind === "stock" || entity.kind === "report" ? entity.kind : "other";
  const facts = proofFacts(entity, snap.centres);
  const createdUnix = blockToUnix(entity.createdAtBlock, snap);
  const expiresUnix = blockToUnix(entity.expiresAtBlock, snap);
  const createdBlock = formatBlock(entity.createdAtBlock);
  const expiresBlock = formatBlock(entity.expiresAtBlock);
  const creator = displayAddress(entity.creator);
  const rows: { id: string; label: string; value: ReactNode }[] = [
    ...facts.map((fact) => ({ id: fact.id, label: t.rows[fact.id], value: <FactValue fact={fact} lang={lang} source={source} /> })),
    {
      id: "created",
      label: t.created,
      value: (
        <>
          <span>{createdBlock ? t.block(createdBlock) : DASH}</span>
          <span className="mt-1 block text-ink-2">{formatUnixIst(createdUnix, lang)}</span>
        </>
      ),
    },
    {
      id: "expires",
      label: t.expires,
      value: (
        <>
          <span>{formatExpiry(expiresUnix, snap.nowSec, lang)}</span>
          <span className="mt-1 block text-ink-2">{expiresBlock ? t.block(expiresBlock) : DASH}</span>
        </>
      ),
    },
  ];

  return (
    <article className="rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-ink-3">{t.kind[kind]}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h1>
      <div role="status" className={cx("mt-6 rounded-2xl border px-4 py-4 sm:px-5", trusted ? "border-in bg-in-soft" : "border-out bg-out-soft")}>
        <p className="text-xl font-bold leading-snug sm:text-2xl">
          <span aria-hidden className="mr-2">{trusted ? "✓" : "✗"}</span>
          {verdictText(verdict.code, t)}
        </p>
      </div>
      {entity.kind === "report" ? (
        <p className="mt-4 text-ink-2">{isAcknowledged(entity) ? t.acknowledged : t.notAcknowledged}</p>
      ) : null}
      <dl className="mt-6 divide-y divide-line">
        {rows.map((row) => (
          <div key={row.id} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-ink-3">{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="flags-heading" className="mt-6">
        <h2 id="flags-heading" className="text-base font-semibold">{t.flagsHeading}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-2">
          {entity.readonly ? <li>{t.readonlyFlag}</li> : null}
          {entity.permissionlessExtension ? <li>{t.extensionFlag}</li> : null}
          {!entity.readonly && !entity.permissionlessExtension ? <li>{t.noFlags}</li> : null}
        </ul>
      </section>
      <section aria-labelledby="creator-heading" className="mt-6">
        <h2 id="creator-heading" className="text-base font-semibold">{t.creator}</h2>
        <p className="mt-2">
          {creator ? (
            <ChainAddress address={creator} source={source} linkLabel={t.explorerAddress} empty={t.unreadable} full />
          ) : (
            <span className="text-ink-3">{t.unreadable}</span>
          )}
        </p>
      </section>
      {source === "memory" ? (
        <p role="note" className="mt-6 rounded-xl bg-paper px-4 py-3 text-sm text-ink-2">
          {t.offline}
        </p>
      ) : null}
      {source === "arkiv" && isProofKey(entity.key) ? (
        <p className="mt-6">
          <a href={entityUrl(entity.key)} className="font-medium text-brand underline underline-offset-4" rel="noreferrer">
            {t.explorerEntity}
          </a>
        </p>
      ) : null}
    </article>
  );
}
