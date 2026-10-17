import type { Metadata } from "next";
import { FooterNav } from "@/components/dashboard/footer-nav";
import { Main } from "@/components/dashboard/shell";
import { ButtonLink } from "@/components/ui";
import { getLang } from "@/lib/lang";
import { about } from "@/messages/about";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: about[lang].metaTitle };
}

export default async function AboutPage() {
  const lang = await getLang();
  const t = about[lang];
  return (
    <Main width="board">
      <header className="max-w-3xl pt-4 lg:pt-8">
        <p className="text-sm font-semibold text-brand">{t.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.12]">{t.hero}</h1>
        <p className="mt-5 text-lg text-ink-2">{t.lede}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">{t.find}</ButtonLink>
          <ButtonLink href="/dashboard" variant="secondary">{t.board}</ButtonLink>
        </div>
        <p className="mt-4 text-sm text-ink-3">
          {t.notAdvice}{" "}
          <a href="tel:108" className="font-semibold text-out underline underline-offset-2">108</a>
        </p>
      </header>

      <section aria-labelledby="cases-heading" className="mt-16 border-t border-line pt-10 lg:mt-20">
        <h2 id="cases-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">{t.casesHeading}</h2>
        <p className="mt-3 max-w-2xl text-ink-2">{t.casesLede}</p>
        <ol className="mt-8 grid gap-8">
          {t.cases.map((item) => (
            <li key={item.title} className="border-l-2 border-line pl-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 max-w-2xl text-ink-2">{item.body}</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {item.sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} className="font-medium text-brand underline underline-offset-4" rel="noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="how-heading" className="mt-16 border-t border-line pt-10">
        <h2 id="how-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">{t.howHeading}</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {t.steps.map((step) => (
            <li key={step.kicker}>
              <p className="font-mono text-sm font-semibold text-brand">{step.kicker}</p>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-ink-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="trust-heading" className="mt-16 border-t border-line pt-10">
        <h2 id="trust-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">{t.trustHeading}</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {t.trust.map((item) => (
            <li key={item.title} className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-ink-2">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="privacy-heading" className="mt-16 max-w-2xl border-t border-line pt-10">
        <h2 id="privacy-heading" className="text-2xl font-bold tracking-tight">{t.privacyHeading}</h2>
        <p className="mt-3 text-ink-2">{t.privacy}</p>
      </section>

      <section aria-labelledby="source-heading" className="mt-12 max-w-2xl">
        <h2 id="source-heading" className="text-2xl font-bold tracking-tight">{t.sourceHeading}</h2>
        <p className="mt-3 text-ink-2">{t.source}</p>
        <p className="mt-8">
          <a href="/staff" className="text-sm text-ink-3 underline underline-offset-4 hover:text-ink">{t.staff}</a>
        </p>
      </section>

      <FooterNav lang={lang} current="/about" />
    </Main>
  );
}
