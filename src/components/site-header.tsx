import Link from "next/link";
import { setLang } from "@/app/actions/lang";
import { common, type Lang } from "@/lib/i18n";

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = common[lang];
  const other: Lang = lang === "hi" ? "en" : "hi";
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-bold tracking-tight">
          <span aria-hidden className="grid size-7 place-items-center rounded-lg bg-brand text-sm text-brand-ink">ज</span>
          <span>{t.appName}</span>
        </Link>
        <nav className="flex items-center gap-0.5 text-sm">
          <Link href="/dashboard" className="rounded-lg px-2 py-2 text-ink-2 hover:text-ink">{t.nav.dashboard}</Link>
          <Link href="/about" className="hidden rounded-lg px-2 py-2 text-ink-2 hover:text-ink sm:inline">{t.nav.about}</Link>
          <form action={setLang}>
            <input type="hidden" name="lang" value={other} />
            <button type="submit" aria-label={t.switchLabel} lang={other} className="min-h-10 rounded-lg border border-line-2 bg-surface px-3 font-semibold">
              <span aria-hidden className="mr-1 text-ink-3">{lang === "hi" ? "A" : "अ"}</span>
              {t.switchTo}
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

export function DemoBanner({ lang }: { lang: Lang }) {
  const t = common[lang];
  return (
    <div role="note" className="border-b border-line bg-low-soft/60 px-4 py-2 text-center text-sm text-ink-2">
      {t.demoBanner}{" "}
      <a href="tel:108" className="font-semibold text-out underline underline-offset-2">{t.call108}</a>
    </div>
  );
}
