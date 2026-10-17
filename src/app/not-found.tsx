import { Main } from "@/components/dashboard/shell";
import { ButtonLink, btn } from "@/components/ui";
import { common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { statusPages } from "@/messages/dashboard";

export default async function NotFound() {
  const lang = await getLang();
  const t = statusPages[lang];
  const c = common[lang];
  return (
    <Main width="proof">
      <section className="pt-8">
        <p className="font-mono text-sm font-semibold text-ink-3">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">{t.notFoundTitle}</h1>
        <p className="mt-3 text-lg text-ink-2">{t.notFoundBody}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/">{t.home}</ButtonLink>
          <ButtonLink href="/dashboard" variant="secondary">{t.board}</ButtonLink>
          <a href="tel:108" className={btn.danger}>{c.call108}</a>
        </div>
      </section>
    </Main>
  );
}
