import type { Drug, Reason } from "../centres";
import type { CentreView } from "../views";

export interface FeedItem {
  key: string;
  drug: Drug;
  reason: Reason;
  hourBucket: number;
  acknowledged: boolean;
  centreName: string;
  createdAtBlock: number;
}

/** Newest trusted reports first. `limit` is clamped so a noisy board cannot render unbounded rows. */
export function recentReports(views: readonly CentreView[], limit = 30): FeedItem[] {
  const cap = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 30;
  return views
    .flatMap((v) =>
      v.reports.map((r) => ({
        key: r.key,
        drug: r.drug,
        reason: r.reason,
        hourBucket: r.hourBucket,
        acknowledged: r.acknowledged,
        centreName: v.centre.name,
        createdAtBlock: r.createdAtBlock,
      })),
    )
    .sort((a, b) => b.createdAtBlock - a.createdAtBlock || b.hourBucket - a.hourBucket || a.key.localeCompare(b.key))
    .slice(0, cap);
}
