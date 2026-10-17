import type { Metadata } from "next";
import { GapFigure, LifetimeBars } from "@/components/about/graphics";
import { FooterNav } from "@/components/dashboard/footer-nav";
import { Main } from "@/components/dashboard/shell";
import { ButtonLink } from "@/components/ui";
import { asvGap } from "@/lib/directory";
import { getLang } from "@/lib/lang";
import { about } from "@/messages/about";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: about[lang].metaTitle };
}

export default async function AboutPage() {
  const lang = await getLang();
  const t = about[lang];
  const gap = asvGap(lang);
  return (
    <Main width="board">
      <header className="grid gap-6 pt-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:pt-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-ink-3">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-[16ch] font-display text-4xl font-normal leading-tight text-balance sm:text-5xl lg:text-6xl">{t.hero}</h1>
          <p className="mt-5 text-lg text-ink-2">{t.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/">{t.find}</ButtonLink>
            <ButtonLink href="/dashboard" variant="secondary">{t.board}</ButtonLink>
          </div>
          <p className="mt-4 text-sm text-ink-3">
            {t.notAdvice}{" "}
            <a href="tel:108" className="font-semibold text-out underline underline-offset-2">108</a>
          </p>
        </div>
        <div aria-hidden className="relative mx-auto hidden h-72 w-full max-w-sm sm:block">
          <div className="absolute inset-x-6 bottom-0 top-8 rounded-[2.5rem] bg-gradient-to-b from-brand-soft to-white/40" />
          <img src="/art/snake.png" alt="" className="absolute left-0 top-0 w-40 drop-shadow-[0_14px_18px_rgb(20_27_45/0.16)]" />
          <img src="/art/dog.png" alt="" className="absolute bottom-2 right-0 w-36 drop-shadow-[0_14px_18px_rgb(20_27_45/0.16)]" />
          <img src="/art/vials.png" alt="" className="absolute bottom-6 left-10 w-40 drop-shadow-[0_14px_18px_rgb(20_27_45/0.16)]" />
        </div>
      </header>

      <section aria-labelledby="gap-heading" className="mt-16 border-t border-line pt-10 lg:mt-20">
        <h2 id="gap-heading" className="font-display text-3xl font-normal sm:text-4xl">{t.gapHeading}</h2>
        <p className="mt-3 max-w-2xl text-ink-2">{t.gapLede}</p>
        <GapFigure
          gap={gap}
          warehouseLabel={t.warehouseLabel}
          caption={t.gapCaption(gap.none, gap.total, gap.since)}
          legendGot={t.legendGot}
          legendNone={t.legendNone}
          note={t.gapNote}
        />
      </section>

      <section aria-labelledby="cases-heading" className="mt-16 border-t border-line pt-10">
        <h2 id="cases-heading" className="font-display text-3xl font-normal sm:text-4xl">{t.casesHeading}</h2>
        <p className="mt-3 max-w-2xl text-ink-2">{t.casesLede}</p>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {t.cases.map((item) => (
            <li key={item.title} className="glass rounded-2xl border-l-4 border-l-out p-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-ink-2">{item.body}</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {item.sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} className="inline-flex min-h-12 items-center font-medium text-brand underline underline-offset-4" rel="noreferrer">
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
        <h2 id="how-heading" className="font-display text-3xl font-normal sm:text-4xl">{t.howHeading}</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {t.steps.map((step) => (
            <li key={step.kicker} className="glass flex flex-col rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-2xl leading-none text-ink-3">{step.kicker}</p>
                <img src={step.art} alt="" className="h-20 w-auto object-contain drop-shadow-[0_10px_12px_rgb(20_27_45/0.14)]" />
              </div>
              <h3 className="mt-3 text-xl font-medium">{step.title}</h3>
              <p className="mt-2 text-ink-2">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="trust-heading" className="mt-16 border-t border-line pt-10">
        <h2 id="trust-heading" className="font-display text-3xl font-normal sm:text-4xl">{t.trustHeading}</h2>
        <div className="lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <ul className="glass mt-8 overflow-hidden rounded-2xl">
            {t.trust.map((item) => (
              <li key={item.title} className="border-b border-line px-5 py-5 last:border-b-0">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-2 max-w-2xl text-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
          <LifetimeBars heading={t.lifeHeading} rows={t.lifetimes} />
        </div>
      </section>

      <section aria-labelledby="privacy-heading" className="mt-16 max-w-2xl border-t border-line pt-10">
        <h2 id="privacy-heading" className="font-display text-3xl font-normal">{t.privacyHeading}</h2>
        <p className="mt-3 text-ink-2">{t.privacy}</p>
      </section>

      <section aria-labelledby="source-heading" className="mt-12 max-w-2xl">
        <h2 id="source-heading" className="font-display text-3xl font-normal">{t.sourceHeading}</h2>
        <p className="mt-3 text-ink-2">{t.source}</p>
        <p className="mt-8">
          <a href="/staff" className="text-sm text-ink-3 underline underline-offset-4 hover:text-ink">{t.staff}</a>
        </p>
      </section>

      <FooterNav lang={lang} current="/about" />
    </Main>
  );
}
