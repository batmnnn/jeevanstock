import type { Metadata } from "next";
import { CentreList } from "@/components/family/centre-list";
import { EmergencyCall } from "@/components/family/emergency-call";
import { NeedPills } from "@/components/family/need-pills";
import { Unavailable } from "@/components/unavailable";
import { Card, PageShell } from "@/components/ui";
import { buildFamilyList } from "@/lib/family/list";
import { parseNeed } from "@/lib/family/need";
import { readBoard } from "@/lib/family/read-board";
import { homeHref } from "@/lib/family/routes";
import { common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { buildCentreViews } from "@/lib/views";
import { family } from "@/messages/family";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ need?: string | string[] }>;
}): Promise<Metadata> {
  const lang = await getLang();
  const need = parseNeed((await searchParams).need);
  const t = family[lang];
  return { title: need ? t.resultsTitle[need] : t.homeTitle };
}

export default async function Home({ searchParams }: { searchParams: Promise<{ need?: string | string[] }> }) {
  const lang = await getLang();
  const need = parseNeed((await searchParams).need);
  const t = family[lang];
  const c = common[lang];
  const snap = await readBoard();
  if (!snap) {
    return (
      <PageShell>
        <Unavailable lang={lang} retryHref={homeHref(need)} />
      </PageShell>
    );
  }

  const items = buildFamilyList(buildCentreViews(snap), snap.nowSec, need, {
    vials: c.vials,
    minutesAgo: c.minutesAgo,
    noUpdate: c.noUpdate,
    vialsUnknown: t.vialsUnknown,
    updated: t.updated,
  });

  return (
    <PageShell>
      <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight">{need ? t.resultsTitle[need] : t.homeTitle}</h1>
      <p className="mt-2 text-lg text-ink-2">{need ? t.resultsLead : t.homeLead}</p>
      <div className="mt-5">
        <NeedPills
          need={need}
          copy={{
            snakebite: t.snakebite,
            snakebiteEn: t.snakebiteEn,
            dogbite: t.dogbite,
            dogbiteEn: t.dogbiteEn,
            selected: t.selected,
          }}
        />
      </div>
      <div className="mt-4">
        <EmergencyCall label={c.call108} />
      </div>
      {items.length === 0 ? (
        <Card className="mt-6">
          <h2 className="text-lg font-bold">{t.emptyTitle}</h2>
          <p className="mt-2 text-ink-2">{t.emptyBody}</p>
        </Card>
      ) : (
        <CentreList
          items={items}
          need={need}
          statusText={{ status: c.status }}
          drugShort={c.drugShort}
          copy={{
            useLocation: t.useLocation,
            locationPrivacy: t.locationPrivacy,
            locationWorking: t.locationWorking,
            locationDenied: t.locationDenied,
            locationUnsupported: t.locationUnsupported,
            locationReady: t.locationReady,
            distanceUnit: t.distanceUnit,
            stockFirst: t.stockFirst,
            stockThenDistance: t.stockThenDistance,
            nearestFirst: t.nearestFirst,
            listNearby: t.listNearby,
            listAll: t.listAll,
            directions: t.directions,
            call: t.call,
            demoNote: t.demoNote,
            demoPhones: t.demoPhones,
            newTab: t.newTab,
          }}
        />
      )}
    </PageShell>
  );
}
