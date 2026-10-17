import type { Metadata } from "next";
import { Unavailable } from "@/components/unavailable";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { Centres } from "@/components/dashboard/centres";
import { FooterNav } from "@/components/dashboard/footer-nav";
import { Reports } from "@/components/dashboard/reports";
import { Main } from "@/components/dashboard/shell";
import { Stats } from "@/components/dashboard/stats";
import { VerifyYourself } from "@/components/dashboard/verify-yourself";
import { recentReports } from "@/lib/dashboard/feed";
import { getLang } from "@/lib/lang";
import { repo, RepoError } from "@/lib/repo";
import { buildCentreViews, dashboardStats } from "@/lib/views";
import { dashboard } from "@/messages/dashboard";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: dashboard[lang].metaTitle };
}

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
        <Main width="wide">
          <Unavailable lang={lang} retryHref="/dashboard" />
        </Main>
      );
    }
    throw e;
  }
  const views = buildCentreViews(snap);
  const stats = dashboardStats(views);
  return (
    <Main width="wide">
      <AutoRefresh />
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{t.title}</h1>
        <p className="mt-3 text-lg text-ink-2">{t.lede}</p>
        <p className="mt-4 text-base text-ink">
          {t.summary({
            centres: stats.centres,
            asvOut: stats.byStatus.ASV.out,
            arvOut: stats.byStatus.ARV.out,
            open: stats.openReports,
          })}
        </p>
        <p className="mt-2 text-sm text-ink-3">{t.refreshNote}</p>
      </header>
      <div className="mt-8">
        <Stats stats={stats} lang={lang} />
      </div>
      <Centres views={views} nowSec={snap.nowSec} lang={lang} />
      <Reports items={recentReports(views)} lang={lang} />
      <VerifyYourself source={r.source} admin={snap.admin} payer={snap.payer} lang={lang} />
      <FooterNav lang={lang} current="/dashboard" />
    </Main>
  );
}
