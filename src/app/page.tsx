import type { Metadata } from "next";
import Link from "next/link";
import { EmergencyCall } from "@/components/family/emergency-call";
import { HomeScene } from "@/components/family/home-scene";
import { PageShell } from "@/components/ui";
import { common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { family } from "@/messages/family";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: family[lang].homeTitle };
}

export default async function Home() {
  const lang = await getLang();
  const t = family[lang];
  const c = common[lang];
  return (
    <>
      <HomeScene />
      <PageShell className="relative z-10">
        <h1 className="max-w-[12ch] font-display text-[2.65rem] font-normal leading-[1.15] text-balance">{t.homeTitle}</h1>
        <p className="mt-3 max-w-md text-lg text-ink-2">{t.homeLead}</p>
        <div className="mt-5">
          <EmergencyCall label={c.call108} />
        </div>
        <div className="mt-4 grid gap-3">
          <Link href="/demo" className="glass block rounded-2xl px-4 py-4">
            <span className="block text-lg font-medium">{t.demoDoor}</span>
            <span className="mt-1 block text-sm text-ink-2">{t.demoDoorBody}</span>
          </Link>
          <Link href="/live" className="glass block rounded-2xl px-4 py-4">
            <span className="block text-lg font-medium">{t.liveDoor}</span>
            <span className="mt-1 block text-sm text-ink-2">{t.liveDoorBody}</span>
          </Link>
        </div>
      </PageShell>
    </>
  );
}
