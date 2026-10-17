import Link from "next/link";
import type { Drug } from "@/lib/centres";
import { minutesAgo, type DrugStock } from "@/lib/domain";
import type { CentreView } from "@/lib/views";
import { common, type Lang } from "@/lib/i18n";
import { isProofKey } from "@/lib/dashboard/keys";
import { dashboard } from "@/messages/dashboard";
import { Card, StatusChip } from "@/components/ui";

const DRUGS: readonly Drug[] = ["ASV", "ARV"];

function DrugLine({ drug, stock, nowSec, lang }: { drug: Drug; stock: DrugStock; nowSec: number; lang: Lang }) {
  const c = common[lang];
  return (
    <div className="border-t border-line pt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink-2">{c.drug[drug]}</p>
        <StatusChip status={stock.status} t={c} />
      </div>
      <p className="mt-1 text-sm text-ink-3">
        {stock.vials !== null && stock.postedAt !== null ? (
          <>
            <span className="tabular text-ink-2">{c.vials(stock.vials)}</span>
            <span aria-hidden> · </span>
            <span>{c.minutesAgo(minutesAgo(stock.postedAt, nowSec))}</span>
          </>
        ) : (
          c.noUpdate
        )}
      </p>
      {stock.postKey && isProofKey(stock.postKey) ? (
        <Link href={`/verify/${stock.postKey}`} className="mt-1 inline-flex min-h-11 items-center text-sm font-medium text-brand underline-offset-4 hover:underline">
          {c.proof}
        </Link>
      ) : null}
    </div>
  );
}

export function Centres({ views, nowSec, lang }: { views: CentreView[]; nowSec: number; lang: Lang }) {
  const t = dashboard[lang];
  return (
    <section aria-labelledby="centres-heading" className="mt-12">
      <h2 id="centres-heading" className="text-2xl font-bold tracking-tight">
        {t.centresHeading}
      </h2>
      {views.length === 0 ? (
        <Card className="mt-4">
          <h3 className="text-lg font-semibold">{t.emptyTitle}</h3>
          <p className="mt-2 text-ink-2">{t.emptyBody}</p>
        </Card>
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {views.map((view) => (
            <Card key={view.centre.centreId} as="li" className="h-full">
              <h3 className="text-lg font-semibold leading-snug">{view.centre.name}</h3>
              <p className="mt-1 text-sm text-ink-3">
                {view.centre.district}
                <span aria-hidden> · </span>
                {view.centre.state}
              </p>
              <div className="mt-3 grid gap-3">
                {DRUGS.map((drug) => (
                  <DrugLine key={drug} drug={drug} stock={view.stock[drug]} nowSec={nowSec} lang={lang} />
                ))}
              </div>
              <p className={view.openReports > 0 ? "mt-4 text-sm font-semibold text-out" : "mt-4 text-sm text-ink-3"}>
                {view.openReports > 0 ? t.openOnCentre(view.openReports) : t.noOpenOnCentre}
              </p>
            </Card>
          ))}
        </ul>
      )}
    </section>
  );
}
