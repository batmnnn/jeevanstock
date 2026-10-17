import Link from "next/link";
import { dashboard, poster } from "@/messages/dashboard";
import { common, type Lang } from "@/lib/i18n";

export function FooterNav({ lang, current }: { lang: Lang; current: string }) {
  const c = common[lang];
  const links = [
    ["/", c.nav.home],
    ["/dashboard", c.nav.dashboard],
    ["/about", c.nav.about],
    ["/poster", poster[lang].metaTitle],
    ["/staff", c.nav.staff],
  ] as const;
  return (
    <nav aria-label={dashboard[lang].footerLabel} className="mt-16 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6 text-sm">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={current === href ? "page" : undefined}
          className="min-h-11 py-2 text-ink-2 underline-offset-4 hover:text-ink hover:underline aria-[current=page]:font-semibold aria-[current=page]:text-ink"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
