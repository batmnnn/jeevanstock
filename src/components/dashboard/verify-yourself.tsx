import { readCommand } from "@/lib/dashboard/trust";
import { dashboard } from "@/messages/dashboard";
import type { Lang } from "@/lib/i18n";
import { DASH } from "@/lib/dashboard/time";
import { ChainAddress } from "@/components/proof/address";

export function VerifyYourself({
  source,
  admin,
  payer,
  lang,
}: {
  source: "arkiv" | "memory";
  admin: string;
  payer: string;
  lang: Lang;
}) {
  const t = dashboard[lang];
  const command = readCommand(admin);
  return (
    <section aria-labelledby="verify-heading" className="mt-14 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="verify-heading" className="text-2xl font-bold tracking-tight">
          {t.verifyHeading}
        </h2>
        <p className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">{source === "arkiv" ? t.sourceArkiv : t.sourceMemory}</p>
      </div>
      <p className="mt-3 max-w-2xl text-ink-2">{t.verifyLede}</p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-ink-3">{t.adminLabel}</dt>
          <dd className="mt-1">
            <ChainAddress address={admin} source={source} linkLabel={t.explorerAddress} empty={DASH} />
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-ink-3">{t.payerLabel}</dt>
          <dd className="mt-1">
            <ChainAddress address={payer} source={source} linkLabel={t.explorerAddress} empty={DASH} />
          </dd>
        </div>
      </dl>
      <h3 className="mt-8 text-base font-semibold">{t.rulesHeading}</h3>
      <ol className="mt-3 list-decimal space-y-3 pl-5 text-ink-2">
        <li>{t.ruleCentre}</li>
        <li>{t.ruleStock}</li>
        <li>{t.ruleReport}</li>
      </ol>
      <h3 className="mt-8 text-base font-semibold">{t.commandLabel}</h3>
      <p className="mt-1 text-sm text-ink-3">{t.commandHint}</p>
      <pre className="mt-3 overflow-x-auto rounded-xl bg-ink px-4 py-3 text-sm text-paper">
        <code>{command}</code>
      </pre>
    </section>
  );
}
