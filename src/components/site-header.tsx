import Link from "next/link";
import { setLang } from "@/app/actions/lang";
import { common, type Lang } from "@/lib/i18n";

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = common[lang];
  const other: Lang = lang === "hi" ? "en" : "hi";
  return (
    <header className="glass relative rounded-none border-x-0 border-t-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-lg font-medium text-brand">
          {t.appName}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/demo" className="font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline">
            {t.nav.demo}
          </Link>
          <Link href="/live" className="font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline">
            {t.nav.soon}
          </Link>
          <Link href="/dashboard" className="hidden font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline sm:inline">
            {t.nav.dashboard}
          </Link>
          <Link href="/about" className="hidden font-medium text-ink-2 underline-offset-4 hover:text-ink hover:underline sm:inline">
            {t.nav.about}
          </Link>
          <form action={setLang}>
            <input type="hidden" name="lang" value={other} />
            <button type="submit" lang={other} className="glass min-h-11 rounded-full px-3 text-base font-medium text-accent">
              <span>{lang === "hi" ? "A" : "अ"}</span> {t.switchTo}
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
    <div role="note" className="bg-out-soft px-4 py-2 text-center text-sm text-ink-2">
      {t.demoBanner}{" "}
      <a href="tel:108" className="font-semibold text-out underline underline-offset-2">
        {t.call108}
      </a>
    </div>
  );
}
