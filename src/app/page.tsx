import type { Metadata } from "next";
import Link from "next/link";
import { EmergencyCall } from "@/components/family/emergency-call";
import { HomeScene } from "@/components/family/home-scene";
import { ButtonLink } from "@/components/ui";
import { asvGap } from "@/lib/directory";
import { common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { family } from "@/messages/family";
import { home } from "@/messages/home";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: family[lang].homeTitle };
}

function Door({ href, art, tag, title, body, meta }: { href: string; art: string; tag: string; title: string; body: string; meta: string }) {
  return (
    <Link
      href={href}
      className="glass group grid grid-cols-[4.5rem_1fr] items-start gap-4 rounded-3xl p-4 transition hover:bg-white/75 active:translate-y-px sm:p-5"
    >
      <img src={art} alt="" width={72} height={72} className="size-18 object-contain drop-shadow-[0_8px_10px_rgb(20_27_45/0.14)]" />
      <span className="min-w-0">
        <span className="inline-flex rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand-deep">{tag}</span>
        <span className="mt-2 flex items-center justify-between gap-2 text-xl font-medium">
          {title}
          <span aria-hidden className="text-ink-3 transition group-hover:translate-x-0.5 group-hover:text-ink">
            →
          </span>
        </span>
        <span className="mt-1 block text-sm text-ink-2">{body}</span>
        <span className="mt-2 block text-sm font-medium text-ink-3">{meta}</span>
      </span>
    </Link>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-line pt-3">
      <dt className="font-mono text-3xl leading-none tabular-nums text-ink">{value}</dt>
      <dd className="mt-2 text-sm text-ink-2">{label}</dd>
    </div>
  );
}

export default async function Home() {
  const lang = await getLang();
  const t = family[lang];
  const h = home[lang];
  const c = common[lang];
  const gap = asvGap(lang);
  return (
    <>
      <HomeScene />
      <main id="main" tabIndex={-1} className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-48 pt-5 lg:pt-12">
        <div className="relative lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
          <div>
            <p className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-ink-2">
              <span aria-hidden className="size-2 rounded-full bg-in" />
              {h.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[14ch] pr-20 font-display text-[2.65rem] font-normal leading-[1.12] text-balance lg:pr-0 lg:text-6xl">
              {t.homeTitle}
            </h1>
            <p className="mt-4 max-w-md text-xl font-medium text-ink">{h.subject}</p>
            <p className="mt-2 max-w-md text-lg text-ink-2">{t.homeLead}</p>
            <div className="mt-6 max-w-md">
              <EmergencyCall label={c.call108} />
            </div>
          </div>
          <img
            src="/art/vials.png"
            alt=""
            width={723}
            height={510}
            className="pointer-events-none absolute -right-2 top-10 w-28 drop-shadow-[0_14px_18px_rgb(20_27_45/0.16)] sm:w-36 lg:static lg:w-full lg:max-w-sm lg:justify-self-end"
          />
        </div>

        <nav aria-label={h.doorsLabel} className="mt-8 grid gap-3 sm:grid-cols-2">
          <Door href="/demo" art="/art/snake.png" tag={h.demoTag} title={t.demoDoor} body={h.demoBody} meta={h.demoMeta} />
          <Door href="/live" art="/art/clinic.png" tag={h.liveTag} title={t.liveDoor} body={t.liveDoorBody} meta={h.liveMeta(gap.centres)} />
        </nav>

        <section aria-labelledby="facts-heading" className="glass mt-6 rounded-3xl p-5 sm:p-6">
          <h2 id="facts-heading" className="font-display text-2xl font-normal">
            {h.factsHeading}
          </h2>
          <dl className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Fact value={h.gapValue(gap.none, gap.total)} label={h.gapLabel(gap.since)} />
            <Fact value={gap.warehouseAsv.toLocaleString("en-IN")} label={h.warehouseLabel} />
            <Fact value={h.expiryValue} label={h.expiryLabel} />
            <Fact value={h.privacyValue} label={h.privacyLabel} />
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/about" variant="secondary">
              {h.howLink}
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="ghost">
              {h.boardLink}
            </ButtonLink>
          </div>
        </section>
      </main>
    </>
  );
}
