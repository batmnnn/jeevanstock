import { common, type Lang } from "@/lib/i18n";
import { proof } from "@/messages/dashboard";
import { ButtonLink, btn } from "@/components/ui";

export function MissingProof({ lang }: { lang: Lang }) {
  const t = proof[lang];
  const c = common[lang];
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8">
      <p className="font-mono text-sm font-semibold text-ink-3">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{t.missingTitle}</h1>
      <p className="mt-3 text-ink-2">{t.missingBody}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/dashboard">{t.backToBoard}</ButtonLink>
        <a href="tel:108" className={btn.danger}>{c.call108}</a>
      </div>
    </section>
  );
}
