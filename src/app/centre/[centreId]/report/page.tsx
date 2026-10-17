import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fileFamilyReport } from "@/app/actions/report";
import { EmergencyCall } from "@/components/family/emergency-call";
import { ReportForm } from "@/components/family/report-form";
import { Unavailable } from "@/components/unavailable";
import { BackLink, PageShell } from "@/components/ui";
import { CENTRE_ID_RE } from "@/lib/family/ids";
import { parseNeed } from "@/lib/family/need";
import { readBoard } from "@/lib/family/read-board";
import { centreHref } from "@/lib/family/routes";
import { common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { findCentreView } from "@/lib/views";
import { family } from "@/messages/family";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: family[lang].reportTitle };
}

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ centreId: string }>;
  searchParams: Promise<{ drug?: string | string[] }>;
}) {
  const { centreId } = await params;
  const drug = parseNeed((await searchParams).drug);
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

  return (
    <PageShell>
      <BackLink href={centreHref(view.centre.centreId, drug)} label={c.back} />
      <h1 className="text-[1.75rem] font-bold leading-tight">{t.reportTitle}</h1>
      <p className="mt-2 text-lg text-ink-2">{t.reportLead}</p>
      <p className="mt-3 font-semibold">{view.centre.name}</p>
      <p className="text-sm text-ink-2">
        {view.centre.district} · {view.centre.state}
      </p>
      <ReportForm
        action={fileFamilyReport}
        centreId={view.centre.centreId}
        defaultDrug={drug}
        copy={{
          drugQuestion: t.drugQuestion,
          drugHint: t.drugHint,
          reasonQuestion: t.reasonQuestion,
          reasonHint: t.reasonHint,
          drugs: c.drug,
          reasons: t.reason,
          submit: t.submit,
          pending: t.pending,
          errorTitle: t.errorTitle,
          errorPrefix: t.errorPrefix,
          errors: t.errors,
        }}
      />
      <div className="mt-6">
        <EmergencyCall label={c.call108} />
      </div>
    </PageShell>
  );
}
