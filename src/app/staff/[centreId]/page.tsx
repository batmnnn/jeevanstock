import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Inbox } from "@/components/staff/inbox";
import { LogoutButton } from "@/components/staff/logout-button";
import { StockForm } from "@/components/staff/stock-form";
import { Unavailable } from "@/components/unavailable";
import { Card, Mono, PageShell, StatusChip } from "@/components/ui";
import type { Drug } from "@/lib/centres";
import { isValidVials, minutesAgo, type DrugStock } from "@/lib/domain";
import { common, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { repo } from "@/lib/repo";
import { getStaffCentre } from "@/lib/session";
import { findCentreView } from "@/lib/views";
import { staff } from "@/messages/staff";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: staff[lang].metaDash };
}

export default async function StaffDashboard({ params }: { params: Promise<{ centreId: string }> }) {
  const { centreId } = await params;
  const session = await getStaffCentre();
  if (!session || session !== centreId) redirect("/staff");

  const lang = await getLang();
  const t = staff[lang];

  let snap;
  try {
    snap = await repo().snapshot();
  } catch {
    return (
      <PageShell className="space-y-4">
        <Unavailable lang={lang} retryHref={`/staff/${encodeURIComponent(centreId)}`} />
        <LogoutButton label={t.logout} />
      </PageShell>
    );
  }

  const view = findCentreView(snap, centreId);
  if (!view) {
    return (
      <PageShell className="space-y-4">
        <h1 className="text-2xl font-bold">{t.centreMissingTitle}</h1>
        <p className="text-ink-2">{t.centreMissingBody}</p>
        <LogoutButton label={t.logout} />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t.dashTitle}</h1>
          <p className="mt-1 text-lg font-semibold">{view.centre.name}</p>
          <p className="text-ink-2">
            {view.centre.district}, {view.centre.state}
          </p>
          <p className="text-sm text-ink-3">
            <Mono>{view.centre.centreId}</Mono>
          </p>
        </div>
        <LogoutButton label={t.logout} />
      </div>

      <section aria-labelledby="board-heading">
        <Card>
          <h2 id="board-heading" className="text-lg font-bold">
            {t.currentTitle}
          </h2>
          <dl className="mt-2 divide-y divide-line">
            <StockRow lang={lang} drug="ASV" stock={view.stock.ASV} nowSec={snap.nowSec} />
            <StockRow lang={lang} drug="ARV" stock={view.stock.ARV} nowSec={snap.nowSec} />
          </dl>
          <StockForm lang={lang} initialAsv={prefill(view.stock.ASV)} initialArv={prefill(view.stock.ARV)} />
        </Card>
      </section>

      <Inbox lang={lang} reports={view.reports} nowSec={snap.nowSec} />
    </PageShell>
  );
}

function prefill(stock: DrugStock): number {
  if (stock.status === "stale" || stock.vials == null || !isValidVials(stock.vials)) return 0;
  return stock.vials;
}

function stockLine(stock: DrugStock, lang: Lang, nowSec: number): string {
  const c = common[lang];
  if (stock.status === "stale" || stock.postedAt == null || stock.vials == null) return c.noUpdate;
  return `${c.vials(stock.vials)} · ${c.minutesAgo(minutesAgo(stock.postedAt, nowSec))}`;
}

function StockRow({ lang, drug, stock, nowSec }: { lang: Lang; drug: Drug; stock: DrugStock; nowSec: number }) {
  const c = common[lang];
  return (
    <div className="py-3">
      <dt className="font-semibold">{c.drug[drug]}</dt>
      <dd className="mt-1 flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-2 tabular">{stockLine(stock, lang, nowSec)}</span>
        <StatusChip status={stock.status} t={c} />
      </dd>
    </div>
  );
}
