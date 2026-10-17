import { Card } from "@/components/ui";
import type { Drug, Reason } from "@/lib/centres";
import { common, type Lang } from "@/lib/i18n";
import { hourBucketLabel } from "@/lib/staff/time";
import { parseReportKey } from "@/lib/staff/report-key";
import type { ReportView } from "@/lib/views";
import { staff } from "@/messages/staff";
import { ConfirmForm } from "./confirm-form";
import { ProofLink } from "./proof-link";

export function Inbox({ lang, reports, nowSec }: { lang: Lang; reports: ReportView[]; nowSec: number }) {
  const t = staff[lang];
  const open = reports.filter((r) => !r.acknowledged);
  const ack = reports.filter((r) => r.acknowledged);

  return (
    <section id="inbox" aria-labelledby="inbox-heading" className="scroll-mt-24 space-y-6">
      <div>
        <h2 id="inbox-heading" className="text-lg font-bold">
          {t.inboxTitle}
        </h2>
      </div>
      <div>
        <h3 className="font-bold">
          {t.openTitle} <span className="tabular text-ink-3">({open.length})</span>
        </h3>
        <p className="mt-1 text-sm text-ink-2">{t.openHint}</p>
        {open.length === 0 ? (
          <p className="mt-3 text-ink-2">{t.emptyOpen}</p>
        ) : (
          <ul className="mt-3 list-none space-y-3 p-0">
            {open.map((r, i) => (
              <ReportCard key={r.key} report={r} index={i} lang={lang} nowSec={nowSec} open />
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="font-bold">
          {t.ackTitle} <span className="tabular text-ink-3">({ack.length})</span>
        </h3>
        {ack.length === 0 ? (
          <p className="mt-3 text-ink-2">{t.emptyAck}</p>
        ) : (
          <ul className="mt-3 list-none space-y-3 p-0">
            {ack.map((r, i) => (
              <ReportCard key={r.key} report={r} index={i} lang={lang} nowSec={nowSec} open={false} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ReportCard({
  report,
  index,
  lang,
  nowSec,
  open,
}: {
  report: ReportView;
  index: number;
  lang: Lang;
  nowSec: number;
  open: boolean;
}) {
  const t = staff[lang];
  const c = common[lang];
  const headingId = `report-${open ? "open" : "ack"}-${index}`;
  const when = hourBucketLabel(report.hourBucket, nowSec, lang) ?? t.timeUnknown;
  const drug = c.drug[report.drug as Drug];
  const reason = t.reason[report.reason as Reason] ?? t.timeUnknown;
  const keyOk = parseReportKey(report.key);

  return (
    <Card as="li">
      <h4 id={headingId} className="font-semibold">
        {drug}
      </h4>
      <p className="mt-1">{reason}</p>
      <p className="mt-1 text-sm text-ink-3 tabular">{when}</p>
      {open && keyOk ? (
        <ConfirmForm lang={lang} reportKey={keyOk} ariaLabel={t.confirmNamed(c.drugShort[report.drug])} proofLabel={c.proof} />
      ) : (
        <div className="mt-3">
          {!open && <p className="text-sm font-semibold text-in">{t.ackNote}</p>}
          <ProofLink entityKey={report.key} label={c.proof} />
        </div>
      )}
    </Card>
  );
}
