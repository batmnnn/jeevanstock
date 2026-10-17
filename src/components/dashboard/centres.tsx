import Link from "next/link";
import type { ReactNode } from "react";
import type { Drug } from "@/lib/centres";
import { describeIssue, describeLastIssue, type PublicCentreView, type SupplyIssue } from "@/lib/directory";
import { minutesAgo, type DrugStock } from "@/lib/domain";
import { common, type Lang } from "@/lib/i18n";
import { isProofKey } from "@/lib/dashboard/keys";
import { dashboard } from "@/messages/dashboard";
import { Card, cx, StatusChip } from "@/components/ui";

const DRUGS: readonly Drug[] = ["ASV", "ARV"];
const COUNT = { in: "text-in", low: "text-low", out: "text-out", stale: "text-stale", sent: "text-sent" } as const;

function DrugLine({
  drug,
  stock,
  issue,
  nowSec,
  lang,
}: {
  drug: Drug;
  stock: DrugStock;
  issue: SupplyIssue | null;
  nowSec: number;
  lang: Lang;
}) {
  const c = common[lang];
  const issued = describeIssue(issue, lang);
  const last = describeLastIssue(issue, lang);
  const shelf = stock.vials !== null && stock.postedAt !== null ? c.vials(stock.vials) : null;
  const nowLabel = shelf ?? (last || stock.status === "sent" ? c.countUnknown : c.noUpdate);
  return (
    <div className="border-t border-line pt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink-2">{c.drug[drug]}</p>
        <StatusChip status={stock.status} t={c} />
      </div>
      <div className={cx("mt-2 flex items-start gap-4", last ? "justify-between" : "")}>
        <div className="min-w-0">
          {last ? <p className="text-sm text-ink-3">{c.countNow}</p> : null}
          <p className={cx("mt-1 font-mono text-3xl leading-none tabular-nums", COUNT[stock.status])}>{nowLabel}</p>
        </div>
        {last ? (
          <div className="shrink-0 text-right">
            <p className="text-sm text-ink-3">{c.countLast}</p>
            <p className="mt-1 font-mono text-3xl leading-none tabular-nums text-ink">{last.qty}</p>
            <p className="mt-2 text-sm font-medium text-ink-2">{last.dateLabel}</p>
          </div>
        ) : null}
      </div>
      {issued ? <p className="mt-2 text-sm text-ink-2">{issued}</p> : null}
      {stock.vials !== null && stock.postedAt !== null ? (
        <p className="mt-2 text-sm text-ink-3">{c.minutesAgo(minutesAgo(stock.postedAt, nowSec))}</p>
      ) : null}
      {stock.postKey && isProofKey(stock.postKey) ? (
        <Link href={`/verify/${stock.postKey}`} className="mt-1 inline-flex min-h-11 items-center text-sm font-medium text-brand underline-offset-4 hover:underline">
          {c.proof}
        </Link>
      ) : null}
    </div>
  );
}

export function Centres({
  id,
  heading,
  lede,
  children,
  views,
  nowSec,
  lang,
}: {
  id: string;
  heading: string;
  lede?: string;
  children?: ReactNode;
  views: PublicCentreView[];
  nowSec: number;
  lang: Lang;
}) {
  const t = dashboard[lang];
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="font-display text-3xl font-normal">
        {heading}
      </h2>
      {lede ? <p className="mt-2 max-w-3xl text-ink-2">{lede}</p> : null}
      {children}
      {views.length === 0 ? (
        <Card className="mt-4">
          <h3 className="text-lg font-semibold">{t.emptyTitle}</h3>
          <p className="mt-2 text-ink-2">{t.emptyBody}</p>
        </Card>
      ) : (
        <ul className="glass mt-4 overflow-hidden rounded-2xl">
          {views.map((view) => (
            <li key={view.centre.centreId} className="border-b border-line px-4 py-5 last:border-b-0">
              <h3 className="text-lg font-medium leading-snug">{view.centre.name}</h3>
              <p className="mt-1 text-sm text-ink-3">
                {view.centre.district}
                <span aria-hidden> · </span>
                {view.centre.state}
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {DRUGS.map((drug) => (
                  <DrugLine key={drug} drug={drug} stock={view.stock[drug]} issue={view.supply[drug]} nowSec={nowSec} lang={lang} />
                ))}
              </div>
              <p className={view.openReports > 0 ? "mt-4 text-sm font-medium text-out" : "mt-4 text-sm text-ink-3"}>
                {view.openReports > 0 ? t.openOnCentre(view.openReports) : t.noOpenOnCentre}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
