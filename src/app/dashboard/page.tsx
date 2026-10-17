import type { Metadata } from "next";
import { Unavailable } from "@/components/unavailable";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { BoardScene } from "@/components/dashboard/scene";
import { Centres } from "@/components/dashboard/centres";
import { FooterNav } from "@/components/dashboard/footer-nav";
import { Reports } from "@/components/dashboard/reports";
import { Main } from "@/components/dashboard/shell";
import { Stats } from "@/components/dashboard/stats";
import { VerifyYourself } from "@/components/dashboard/verify-yourself";
import { CENTRES } from "@/lib/centres";
import { recentReports } from "@/lib/dashboard/feed";
import { DIRECTORY_SOURCES, asvGap, buildPublicBoard, describeWarehouse, type PublicCentreView } from "@/lib/directory";
import { trustedCentres } from "@/lib/domain";
import { getLang } from "@/lib/lang";
import { repo, RepoError } from "@/lib/repo";
import { buildCentreViews, dashboardStats } from "@/lib/views";
import { dashboard } from "@/messages/dashboard";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: dashboard[lang].metaTitle };
}

const isDemo = (centreId: string) => CENTRES.some((centre) => centre.centreId === centreId);

export default async function DashboardPage() {
  const lang = await getLang();
  const t = dashboard[lang];
  const r = repo();
  let snap;
  try {
    snap = await r.snapshot();
  } catch (e) {
    if (e instanceof RepoError && e.code === "unavailable") {
      return (
        <>
          <BoardScene />
          <Main width="wide" className="relative z-10">
            <Unavailable lang={lang} retryHref="/dashboard" />
          </Main>
        </>
      );
    }
    throw e;
  }
  const demo: PublicCentreView[] = buildCentreViews(snap)
    .filter((view) => isDemo(view.centre.centreId))
    .map((view) => ({ ...view, supply: { ASV: null, ARV: null } }));
  const live = buildPublicBoard(snap);
  const stats = dashboardStats(live);
  const gap = asvGap(lang);
  const wallets = trustedCentres(snap.centres, snap.admin).filter((centre) => isDemo(centre.centreId));
  return (
    <>
    <BoardScene />
    <Main width="wide" className="relative z-10">
      <AutoRefresh />
      <header className="max-w-3xl">
        <h1 className="font-display text-4xl font-normal leading-tight lg:text-5xl">{t.title}</h1>
        <p className="mt-3 text-lg text-ink-2">{t.lede}</p>
        <p className="mt-2 text-sm text-ink-3">{t.refreshNote}</p>
      </header>
      <Centres id="demo-heading" heading={t.demoHeading} lede={t.demoLede} views={demo} nowSec={snap.nowSec} lang={lang}>
        <Stats stats={dashboardStats(demo)} label={t.demoStatsLabel} lang={lang} />
      </Centres>
      <Reports items={recentReports(demo)} lang={lang} />
      <VerifyYourself source={r.source} admin={snap.admin} payer={snap.payer} centres={wallets} lang={lang} />
      <Centres
        id="live-heading"
        heading={t.liveHeading}
        lede={t.summary({ centres: stats.centres, asvOut: stats.byStatus.ASV.out, arvOut: stats.byStatus.ARV.out, open: stats.openReports })}
        views={live}
        nowSec={snap.nowSec}
        lang={lang}
      >
        <p className="mt-3 max-w-3xl text-lg font-medium text-ink">
          {t.gap(gap)}{" "}
          <a href={DIRECTORY_SOURCES.issues} className="text-base font-normal text-ink-3 underline underline-offset-4" rel="noreferrer">
            CGMSCL
          </a>
        </p>
        <div className="mt-4 max-w-3xl rounded-2xl bg-paper/85 px-3 py-2">
          <p className="text-sm text-ink-2">{describeWarehouse(lang)}</p>
          <p className="mt-1 text-sm text-ink-3">
            <a href={DIRECTORY_SOURCES.warehouse} className="underline underline-offset-4" rel="noreferrer">
              CGMSCL
            </a>
          </p>
        </div>
        <Stats stats={stats} label={t.statsLabel} reports={false} lang={lang} />
      </Centres>
      <FooterNav lang={lang} current="/dashboard" />
    </Main>
    </>
  );
}
