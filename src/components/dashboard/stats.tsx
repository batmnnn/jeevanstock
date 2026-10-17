import type { Drug } from "@/lib/centres";
import type { StockStatus } from "@/lib/domain";
import type { DashboardStats } from "@/lib/views";
import { common, type Lang } from "@/lib/i18n";
import { dashboard } from "@/messages/dashboard";
import { Card, StatusChip } from "@/components/ui";

const DRUGS: readonly Drug[] = ["ASV", "ARV"];
const STATUSES: readonly StockStatus[] = ["in", "low", "out", "stale"];

export function Stats({ stats, lang }: { stats: DashboardStats; lang: Lang }) {
  const t = dashboard[lang];
  const c = common[lang];
  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        {t.statsLabel}
      </h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {DRUGS.map((drug) => (
          <Card key={drug} as="article" className="h-full">
            <h3 className="text-base font-semibold">{c.drug[drug]}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {STATUSES.map((status) => (
                <li key={status} className="rounded-xl bg-paper px-3 py-3">
                  <p className="text-3xl font-bold tabular leading-none">{stats.byStatus[drug][status]}</p>
                  <div className="mt-2">
                    <StatusChip status={status} t={c} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
        <Card as="article" className="h-full">
          <h3 className="text-base font-semibold">{t.reportsTile}</h3>
          <ul className="mt-4 grid flex-1 grid-cols-2 gap-2">
            <li className="rounded-xl bg-paper px-3 py-3">
              <p className="text-4xl font-bold tabular leading-none">{stats.openReports}</p>
              <p className="mt-2 text-sm font-semibold text-ink-2">{t.openReports}</p>
            </li>
            <li className="rounded-xl bg-paper px-3 py-3">
              <p className="text-4xl font-bold tabular leading-none">{stats.acknowledgedReports}</p>
              <p className="mt-2 text-sm font-semibold text-ink-2">{t.acknowledgedReports}</p>
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
