import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CentreActions } from "@/components/family/centre-actions";
import { EmergencyCall } from "@/components/family/emergency-call";
import { Unavailable } from "@/components/unavailable";
import { BackLink, ButtonLink, PageShell, StatusChip, cx } from "@/components/ui";
import type { StockStatus } from "@/lib/domain";
import { describeIssue, describeLastIssue, findShownCentre, isDirectoryCentreId, type LastIssueLabel } from "@/lib/directory";
import { CENTRE_ID_RE } from "@/lib/family/ids";
import { parseNeed } from "@/lib/family/need";
import { directionsUrl } from "@/lib/family/place";
import { readBoard } from "@/lib/family/read-board";
import { boardFor, boardHref, reportHref, verifyHref } from "@/lib/family/routes";
import { describeStock } from "@/lib/family/stock-text";
import { common, type Common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { family, type FamilyCopy } from "@/messages/family";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: family[lang].centreMeta };
}

function safeCount(n: number): number {
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) return 0;
  return Math.min(Math.floor(n), 10_000);
}

const COUNT: Record<StockStatus, string> = {
  in: "text-in",
  low: "text-low",
  out: "text-out",
  stale: "text-stale",
  sent: "text-sent",
};

function DrugBlock({
  id,
  title,
  status,
  vialsLabel,
  updatedLabel,
  issueNote,
  last,
  labels,
  statusText,
}: {
  id: string;
  title: string;
  status: StockStatus;
  vialsLabel: string;
  updatedLabel: string;
  issueNote: string | null;
  last: LastIssueLabel | null;
  labels: Pick<FamilyCopy, "statusLabel" | "vialsLabel" | "updatedLabel"> & Pick<Common, "countNow" | "countLast">;
  statusText: Pick<Common, "status">;
}) {
  return (
    <section className="glass relative mt-6 overflow-visible rounded-2xl" aria-labelledby={`${id}-heading`}>
      <img
        src={id === "asv" ? "/art/snake.png" : "/art/dog.png"}
        alt=""
        width={160}
        height={160}
        className="pointer-events-none absolute -top-4 right-2 z-10 h-20 w-20 object-contain drop-shadow-[0_8px_12px_rgb(20_27_45/0.16)]"
      />
      <div className="px-4 py-4">
        <h2 id={`${id}-heading`} className="pr-24 text-base font-medium">
          {title}
        </h2>
        <div className={cx("mt-8 flex items-start gap-4", last ? "justify-between" : "")}>
          <div className="min-w-0">
            <p className="text-sm text-ink-2">{last ? labels.countNow : labels.vialsLabel}</p>
            <p className={cx("mt-2 font-mono text-4xl leading-none tabular-nums", COUNT[status])}>{vialsLabel}</p>
          </div>
          {last ? (
            <div className="shrink-0 text-right">
              <p className="text-sm text-ink-2">{labels.countLast}</p>
              <p className="mt-2 font-mono text-4xl leading-none tabular-nums text-ink">{last.qty}</p>
              <p className="mt-2 text-sm font-medium text-ink-2">{last.dateLabel}</p>
            </div>
          ) : null}
        </div>
        <div className="mt-3">
          <StatusChip status={status} t={statusText} />
        </div>
        <p className="mt-3 text-sm text-ink-2">{updatedLabel}</p>
        {issueNote ? <p className="mt-2 text-sm text-ink-2">{issueNote}</p> : null}
      </div>
    </section>
  );
}

export default async function CentrePage({
  params,
  searchParams,
}: {
  params: Promise<{ centreId: string }>;
  searchParams: Promise<{ need?: string | string[] }>;
}) {
  const { centreId } = await params;
  const need = parseNeed((await searchParams).need);
  const lang = await getLang();
  const t = family[lang];
  const c = common[lang];
  if (!CENTRE_ID_RE.test(centreId)) notFound();

  const snap = await readBoard();
  if (!snap) {
    return (
      <PageShell>
        <Unavailable lang={lang} />
      </PageShell>
    );
  }

  const view = findShownCentre(snap, centreId);
  if (!view) notFound();

  const phrases = {
    vials: c.vials,
    minutesAgo: c.minutesAgo,
    noUpdate: c.noUpdate,
    sentShelf: c.sentShelf,
    vialsUnknown: t.vialsUnknown,
    updated: t.updated,
  };
  const asv = describeStock(view.stock.ASV, snap.nowSec, phrases);
  const arv = describeStock(view.stock.ARV, snap.nowSec, phrases);
  const asvProof = verifyHref(view.stock.ASV.postKey);
  const arvProof = verifyHref(view.stock.ARV.postKey);
  const acknowledged = safeCount(view.reports.length - view.openReports);

  return (
    <PageShell>
      <BackLink href={boardHref(boardFor(view.centre.centreId), need)} label={c.back} />
      <div className="relative">
        <img
          src="/art/clinic.png"
          alt=""
          width={903}
          height={551}
          className="pointer-events-none absolute -right-2 -top-2 z-0 w-32 drop-shadow-[0_12px_16px_rgb(20_27_45/0.14)]"
        />
        <h1 className="relative z-10 max-w-[14ch] pr-16 font-display text-4xl font-normal leading-tight">{view.centre.name}</h1>
        <p className="relative z-10 mt-1 text-ink-2">
          {view.centre.district} · {view.centre.state}
        </p>
      </div>
      <div className="mt-4">
        <EmergencyCall label={c.call108} />
      </div>
      <CentreActions
        name={view.centre.name}
        directionsUrl={directionsUrl(view.centre.lat, view.centre.lon)}
        labels={{ directions: t.directions, call: t.call, demoNote: t.demoNote, newTab: t.newTab }}
      />
      {isDirectoryCentreId(view.centre.centreId) ? null : <p className="mt-2 text-sm text-ink-3">{t.demoPhones}</p>}

      <DrugBlock
        id="asv"
        title={c.drug.ASV}
        status={view.stock.ASV.status}
        vialsLabel={asv.vialsLabel}
        updatedLabel={asv.updatedLabel}
        issueNote={describeIssue(view.supply.ASV, lang)}
        last={describeLastIssue(view.supply.ASV, lang)}
        labels={{ ...t, countNow: c.countNow, countLast: c.countLast }}
        statusText={{ status: c.status }}
      />
      <DrugBlock
        id="arv"
        title={c.drug.ARV}
        status={view.stock.ARV.status}
        vialsLabel={arv.vialsLabel}
        updatedLabel={arv.updatedLabel}
        issueNote={describeIssue(view.supply.ARV, lang)}
        last={describeLastIssue(view.supply.ARV, lang)}
        labels={{ ...t, countNow: c.countNow, countLast: c.countLast }}
        statusText={{ status: c.status }}
      />

      <section className="mt-8" aria-labelledby="reports-heading">
        <h2 id="reports-heading" className="text-lg font-bold">
          {t.reportsTitle}
        </h2>
        <p className="mt-2">{t.openReports(safeCount(view.openReports))}</p>
        <p className="mt-2 text-ink-2">{t.acknowledged(acknowledged)}</p>
      </section>

      <section className="mt-8" aria-labelledby="proof-heading">
        <h2 id="proof-heading" className="text-lg font-bold">
          {t.proofTitle}
        </h2>
        {asvProof || arvProof ? (
          <ul className="mt-2 grid list-none gap-2 p-0">
            {asvProof ? (
              <li>
                <a href={asvProof} className="font-semibold text-brand underline underline-offset-4">
                  {t.proofAsv}
                </a>
              </li>
            ) : null}
            {arvProof ? (
              <li>
                <a href={arvProof} className="font-semibold text-brand underline underline-offset-4">
                  {t.proofArv}
                </a>
              </li>
            ) : null}
          </ul>
        ) : (
          <p className="mt-2 text-ink-2">{t.noProof}</p>
        )}
      </section>

      <div className="mt-8">
        {isDirectoryCentreId(view.centre.centreId) ? (
          <>
            <p className="text-ink-2">{t.liveSoonReport}</p>
            <ButtonLink href="/demo" variant="secondary" className="mt-3 w-full">
              {t.openDemo}
            </ButtonLink>
          </>
        ) : (
          <>
            <ButtonLink variant="danger" href={reportHref(view.centre.centreId, need)} className="w-full">
              {t.notHere}
            </ButtonLink>
            <p className="mt-2 text-sm text-ink-3">{t.notHereHint}</p>
          </>
        )}
      </div>
    </PageShell>
  );
}
