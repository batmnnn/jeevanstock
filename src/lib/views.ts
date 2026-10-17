// Pure view models built from a repo Snapshot. Every page uses these so trust rules live in one place.
import type { Drug } from "./centres";
import { isAcknowledged, latestStock, trustedReports, type Centre, type DrugStock, type Report, type StockStatus } from "./domain";
import type { Snapshot } from "./repo/types";

export interface ReportView extends Report {
  acknowledged: boolean;
}

export interface CentreView {
  centre: Centre;
  stock: Record<Drug, DrugStock>;
  reports: ReportView[];
  openReports: number;
}

export function buildCentreViews(s: Snapshot): CentreView[] {
  const reports = trustedReports(s.reports, s.payer);
  return s.centres
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((centre) => {
      const [asv, arv] = latestStock(centre, s.stock, s.nowSec);
      const mine = reports
        .filter((r) => r.centreId === centre.centreId)
        .map((r) => ({ ...r, acknowledged: isAcknowledged(r) }))
        .sort((a, b) => b.createdAtBlock - a.createdAtBlock);
      return { centre, stock: { ASV: asv, ARV: arv }, reports: mine, openReports: mine.filter((r) => !r.acknowledged).length };
    });
}

export const findCentreView = (s: Snapshot, centreId: string) => buildCentreViews(s).find((v) => v.centre.centreId === centreId) ?? null;

export interface DashboardStats {
  centres: number;
  byStatus: Record<Drug, Record<StockStatus, number>>;
  openReports: number;
  acknowledgedReports: number;
}

export function dashboardStats(views: CentreView[]): DashboardStats {
  const empty = (): Record<StockStatus, number> => ({ in: 0, low: 0, out: 0, stale: 0 });
  const byStatus: Record<Drug, Record<StockStatus, number>> = { ASV: empty(), ARV: empty() };
  let open = 0, ack = 0;
  for (const v of views) {
    byStatus.ASV[v.stock.ASV.status] += 1;
    byStatus.ARV[v.stock.ARV.status] += 1;
    open += v.openReports;
    ack += v.reports.length - v.openReports;
  }
  return { centres: views.length, byStatus, openReports: open, acknowledgedReports: ack };
}

/** Block number → approximate unix seconds, anchored on the snapshot's current block. */
export const blockToUnix = (block: number, s: Pick<Snapshot, "currentBlock" | "nowSec">) => s.nowSec + (block - s.currentBlock) * 2;
