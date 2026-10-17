import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { BackLink } from "@/components/ui";
import { CENTRES } from "@/lib/centres";
import { boardUrl, originFromHeaders } from "@/lib/dashboard/origin";
import { safeQrSvg } from "@/lib/dashboard/svg";
import { common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { poster } from "@/messages/dashboard";
import { PrintButton } from "../print-button";

export const dynamic = "force-dynamic";

const PRINT_CSS = `
@media print {
  header, [role="note"], .no-print { display: none !important; }
  body { background: #fff !important; }
  @page { size: A4; margin: 14mm; }
}
`;

export async function generateMetadata({ params }: { params: Promise<{ centreId: string }> }): Promise<Metadata> {
  const { centreId } = await params;
  const centre = CENTRES.find((c) => c.centreId === centreId);
  const lang = await getLang();
  return { title: centre ? `${centre.name}` : poster[lang].metaTitle };
}

export default async function PosterPage({ params }: { params: Promise<{ centreId: string }> }) {
  const { centreId } = await params;
  const centre = CENTRES.find((c) => c.centreId === centreId);
  if (!centre) notFound();
  const lang = await getLang();
  const t = poster[lang];
  const c = common[lang];
  const h = await headers();
  const url = boardUrl(
    originFromHeaders({
      host: h.get("host"),
      forwardedHost: h.get("x-forwarded-host"),
      forwardedProto: h.get("x-forwarded-proto"),
    }),
  );
  const svg = safeQrSvg(await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" }));

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6">
      <style>{PRINT_CSS}</style>
      <div className="no-print">
        <BackLink href="/poster" label={c.back} />
      </div>
      <article className="mx-auto max-w-[190mm] bg-surface px-6 py-8 shadow-[var(--shadow-card)] sm:px-10 sm:py-12 print:max-w-none print:px-0 print:py-0 print:shadow-none">
        <p className="text-sm font-semibold text-brand">
          <span lang="hi">जीवन स्टॉक</span>
          <span aria-hidden> · </span>
          <span lang="en">JeevanStock</span>
        </p>
        <p className="mt-6 text-sm text-ink-3">
          {t.placedAt} <span className="font-semibold text-ink">{centre.name}</span>
          <span aria-hidden>, </span>
          {centre.district}
        </p>
        <h1 lang="hi" className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {t.headline}
        </h1>
        <p lang="en" className="mt-4 text-xl text-ink-2">
          {t.subline}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          {svg ? (
            <div className="w-56 [&_svg]:h-auto [&_svg]:w-full" role="img" aria-label={t.qrLabel} dangerouslySetInnerHTML={{ __html: svg }} />
          ) : (
            <p className="break-all font-mono text-sm">{url}</p>
          )}
          <p className="text-center text-base font-semibold">
            <span lang="hi">{t.scanHi}</span>
            <span aria-hidden> · </span>
            <span lang="en">{t.scanEn}</span>
          </p>
          <p className="max-w-sm text-center text-sm text-ink-3">
            <span lang="hi">{t.boardHi}</span> <span lang="en">{t.boardEn}</span>
          </p>
          <p className="break-all text-center font-mono text-xs text-ink-3">
            <span className="sr-only">{t.urlLabel}: </span>
            {url}
          </p>
        </div>
        <div className="mt-8 rounded-2xl border border-out bg-out-soft px-5 py-4 text-center">
          <p className="text-base font-semibold">
            <span lang="hi">{t.emergencyHi}</span>
          </p>
          <p lang="en" className="text-sm text-ink-2">{t.emergencyEn}</p>
          <a href="tel:108" className="mt-1 inline-flex min-h-12 items-center text-4xl font-bold tabular text-out">
            108
          </a>
        </div>
        <p className="mt-6 text-center text-xs text-ink-3">
          <span lang="hi">{t.syntheticHi}</span> <span lang="en">{t.syntheticEn}</span>
        </p>
      </article>
      <div className="no-print mt-6 flex flex-wrap gap-3">
        <PrintButton label={t.print} />
      </div>
    </main>
  );
}
