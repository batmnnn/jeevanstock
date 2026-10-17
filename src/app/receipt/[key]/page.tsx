import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmergencyCall } from "@/components/family/emergency-call";
import { Unavailable } from "@/components/unavailable";
import { ButtonLink, Mono, PageShell } from "@/components/ui";
import { shortHex } from "@/lib/explorer";
import { isKnownCentreId } from "@/lib/family/ids";
import { readBoard } from "@/lib/family/read-board";
import { parseReceiptParams, receiptDetails } from "@/lib/family/receipt";
import { centreHref, homeHref, verifyHref } from "@/lib/family/routes";
import { common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { family } from "@/messages/family";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: family[lang].receiptTitle };
}

export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ c?: string | string[]; tx?: string | string[] }>;
}) {
  const { key } = await params;
  const sp = await searchParams;
  const parsed = parseReceiptParams({ key, c: sp.c, tx: sp.tx });
  if (!parsed) notFound();

  const lang = await getLang();
  const t = family[lang];
  const c = common[lang];
  const snap = await readBoard();
  if (!snap) {
    return (
      <PageShell>
        <Unavailable lang={lang} />
      </PageShell>
    );
  }

  if (!isKnownCentreId(parsed.centreId, snap.centres.map((centre) => centre.centreId))) notFound();
  const details = receiptDetails(snap.reports, parsed.key, parsed.centreId);
  if (details === "mismatch") notFound();
  const centre = snap.centres.find((item) => item.centreId === parsed.centreId);
  if (!centre) notFound();
  const proof = verifyHref(parsed.key);

  return (
    <PageShell>
      <div className="-mx-4 bg-brand px-6 py-8 text-center text-brand-ink sm:mx-0 sm:rounded-[var(--radius-card)]">
        <h1 className="text-2xl font-bold leading-tight">{t.receiptTitle}</h1>
        <p className="mt-4 text-base">{t.referenceLabel}</p>
        <p className="mt-1 text-3xl font-bold tracking-wide tabular">
          <Mono>{shortHex(parsed.key)}</Mono>
        </p>
      </div>

      <h2 className="mt-8 text-xl font-bold">{t.whatNext}</h2>
      <p className="mt-2 text-lg text-ink-2">{t.whatNextBody}</p>

      <h2 className="mt-8 text-lg font-bold">{centre.name}</h2>
      <p className="text-ink-2">
        {centre.district} · {centre.state}
      </p>
      {details ? (
        <dl className="mt-4 border-t border-line">
          <div className="grid grid-cols-1 gap-1 border-b border-line py-3">
            <dt className="text-ink-2">{t.reportedDrug}</dt>
            <dd className="font-semibold">{c.drug[details.drug]}</dd>
          </div>
          <div className="grid grid-cols-1 gap-1 border-b border-line py-3">
            <dt className="text-ink-2">{t.reportedReason}</dt>
            <dd className="font-semibold">{t.reason[details.reason]}</dd>
          </div>
        </dl>
      ) : null}

      <div className="mt-6 grid gap-3">
        {proof ? <ButtonLink href={proof}>{c.proof}</ButtonLink> : null}
        <ButtonLink href={centreHref(centre.centreId, details?.drug ?? null)} variant="secondary">
          {t.backCentre}
        </ButtonLink>
        <ButtonLink href={homeHref(details?.drug ?? null)} variant="secondary">
          {t.findAnother}
        </ButtonLink>
        <EmergencyCall label={c.call108} />
      </div>
    </PageShell>
  );
}
