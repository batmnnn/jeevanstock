import type { Drug } from "@/lib/centres";
import type { StockStatus } from "@/lib/domain";
import type { DashboardStats } from "@/lib/views";
import { common, type Lang } from "@/lib/i18n";
import { dashboard } from "@/messages/dashboard";
import { StatusChip } from "@/components/ui";

const DRUGS: readonly Drug[] = ["ASV", "ARV"];
const STATUSES: readonly StockStatus[] = ["in", "low", "sent", "stale", "out"];

export function Stats({
  stats,
  label,
  reports = true,
  lang,
}: {
  stats: DashboardStats;
  label: string;
  /** Off where reports aren't open yet, so the tiles don't show a permanent zero. */
  reports?: boolean;
  lang: Lang;
}) {
  const t = dashboard[lang];
  const c = common[lang];
  return (
    <div role="group" aria-label={label} className="mt-6">
      <div className="grid gap-8 lg:grid-cols-3">
        {DRUGS.map((drug) => (
          <article key={drug}>
            <h3 className="text-base font-medium">{c.drug[drug]}</h3>
            <ul className="glass mt-2 overflow-hidden rounded-2xl">
              {STATUSES.map((status) => (
                <li
                  key={status}
                  className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 last:border-b-0"
                >
                  <StatusChip status={status} t={c} />
                  <span className="font-mono text-2xl leading-none tabular-nums">
                    {stats.byStatus[drug][status]}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
        {reports ? (
          <article>
            <h3 className="text-base font-medium">{t.reportsTile}</h3>
            <ul className="glass mt-2 overflow-hidden rounded-2xl">
              <li className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
                <p className="text-sm font-medium text-ink-2">
                  {t.openReports}
                </p>
                <p className="font-mono text-3xl leading-none tabular-nums">
                  {stats.openReports}
                </p>
              </li>
              <li className="flex items-baseline justify-between gap-3 px-4 py-3">
                <p className="text-sm font-medium text-ink-2">
                  {t.acknowledgedReports}
                </p>
                <p className="font-mono text-3xl leading-none tabular-nums">
                  {stats.acknowledgedReports}
                </p>
              </li>
            </ul>
          </article>
        ) : null}
      </div>
    </div>
  );
}
