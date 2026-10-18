import Link from "next/link";
import { setLang } from "@/app/actions/lang";
import { LogoMark } from "@/components/logo-mark";
import { NavLinks } from "@/components/nav-links";
import { common, type Lang } from "@/lib/i18n";

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = common[lang];
  const other: Lang = lang === "hi" ? "en" : "hi";
  const items = [
    { href: "/demo", label: t.nav.demo },
    { href: "/live", label: t.nav.soon },
    { href: "/dashboard", label: t.nav.dashboard },
    { href: "/about", label: t.nav.about },
  ];
  return (
    <header className="glass relative rounded-none border-x-0 border-t-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-surface focus:px-3 focus:py-2">
        {t.skip}
      </a>
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex min-h-14 shrink-0 items-center gap-2 text-lg font-medium text-brand">
          <LogoMark className="h-9 w-auto text-ink" />
          {t.appName}
        </Link>
        <NavLinks items={items} className="order-3 -mx-2 w-full justify-between border-t border-line/60 sm:order-none sm:mx-0 sm:ml-auto sm:w-auto sm:justify-end sm:border-0" />
        <form action={setLang} className="order-2 sm:order-none">
          <input type="hidden" name="lang" value={other} />
          <button type="submit" lang={other} className="glass min-h-12 rounded-full px-3 text-base font-medium text-accent">
            <span>{lang === "hi" ? "A" : "अ"}</span> {t.switchTo}
          </button>
        </form>
      </nav>
      <DemoBanner lang={lang} />
    </header>
  );
}

export function DemoBanner({ lang }: { lang: Lang }) {
  const t = common[lang];
  return (
    <div role="note" className="bg-out-soft px-4 py-2 text-center text-sm text-ink-2">
      {t.demoBanner}{" "}
      <a href="tel:108" className="-my-3.5 inline-flex min-h-12 items-center px-1 font-semibold text-out underline underline-offset-2">
        {t.call108}
      </a>
    </div>
  );
}
