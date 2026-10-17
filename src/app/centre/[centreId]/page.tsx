import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CentreActions } from "@/components/family/centre-actions";
import { EmergencyCall } from "@/components/family/emergency-call";
import { Unavailable } from "@/components/unavailable";
import { BackLink, ButtonLink, PageShell, StatusChip } from "@/components/ui";
import type { StockStatus } from "@/lib/domain";
import { CENTRE_ID_RE } from "@/lib/family/ids";
import { parseNeed } from "@/lib/family/need";
import { directionsUrl } from "@/lib/family/place";
import { readBoard } from "@/lib/family/read-board";
import { homeHref, reportHref, verifyHref } from "@/lib/family/routes";
import { describeStock } from "@/lib/family/stock-text";
import { common, type Common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { findCentreView } from "@/lib/views";
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

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-line py-3">
      <dt className="text-ink-2">{label}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  );
}

function DrugBlock({
  id,
  title,
  status,
  vialsLabel,
  updatedLabel,
  labels,
  statusText,
}: {
  id: string;
  title: string;
  status: StockStatus;
  vialsLabel: string;
  updatedLabel: string;
  labels: Pick<FamilyCopy, "statusLabel" | "vialsLabel" | "updatedLabel">;
  statusText: Pick<Common, "status">;
}) {
  return (
    <section className="mt-8" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="text-lg font-bold">
        {title}
      </h2>
      <dl className="mt-2 border-t border-line">
        <Row label={labels.statusLabel}>
          <StatusChip status={status} t={statusText} />
        </Row>
        <Row label={labels.vialsLabel}>{vialsLabel}</Row>
        <Row label={labels.updatedLabel}>{updatedLabel}</Row>
      </dl>
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

  const view = findCentreView(snap, centreId);
  if (!view) notFound();

  const phrases = {
    vials: c.vials,
    minutesAgo: c.minutesAgo,
    noUpdate: c.noUpdate,
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
      <BackLink href={homeHref(need)} label={c.back} />
      <h1 className="text-[1.75rem] font-bold leading-tight">{view.centre.name}</h1>
      <p className="mt-1 text-ink-2">
        {view.centre.district} · {view.centre.state}
      </p>
      <div className="mt-4">
        <EmergencyCall label={c.call108} />
      </div>
      <CentreActions
        name={view.centre.name}
        directionsUrl={directionsUrl(view.centre.lat, view.centre.lon)}
        labels={{ directions: t.directions, call: t.call, demoNote: t.demoNote, newTab: t.newTab }}
      />
      <p className="mt-2 text-sm text-ink-3">{t.demoPhones}</p>

      <DrugBlock
        id="asv"
        title={c.drug.ASV}
        status={view.stock.ASV.status}
        vialsLabel={asv.vialsLabel}
        updatedLabel={asv.updatedLabel}
        labels={t}
        statusText={{ status: c.status }}
      />
      <DrugBlock
        id="arv"
        title={c.drug.ARV}
        status={view.stock.ARV.status}
        vialsLabel={arv.vialsLabel}
        updatedLabel={arv.updatedLabel}
        labels={t}
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
        <ButtonLink variant="danger" href={reportHref(view.centre.centreId, need)} className="w-full">
          {t.notHere}
        </ButtonLink>
        <p className="mt-2 text-sm text-ink-3">{t.notHereHint}</p>
      </div>
    </PageShell>
  );
}
