import Link from "next/link";
import { common, type Lang } from "@/lib/i18n";
import { formatHourBucket } from "@/lib/dashboard/time";
import { isProofKey } from "@/lib/dashboard/keys";
import type { FeedItem } from "@/lib/dashboard/feed";
import { dashboard } from "@/messages/dashboard";
import { cx } from "@/components/ui";

function Badge({ acknowledged, lang }: { acknowledged: boolean; lang: Lang }) {
  const t = dashboard[lang];
  return (
    <span className={cx("inline-flex rounded-full px-2.5 py-1 text-sm font-semibold", acknowledged ? "bg-in-soft text-in" : "bg-low-soft text-low")}>
      {acknowledged ? t.ackBadge : t.openBadge}
    </span>
  );
}

function ProofLink({ item, lang }: { item: FeedItem; lang: Lang }) {
  if (!isProofKey(item.key)) return null;
  return (
    <Link href={`/verify/${item.key}`} className="font-medium text-brand underline-offset-4 hover:underline">
      {common[lang].proof}
    </Link>
  );
}

export function Reports({ items, lang }: { items: FeedItem[]; lang: Lang }) {
  const t = dashboard[lang];
  const c = common[lang];
  return (
    <section aria-labelledby="reports-heading" className="mt-12">
      <h2 id="reports-heading" className="text-2xl font-bold tracking-tight">
        {t.reportsHeading}
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-ink-2">{t.noReports}</p>
      ) : (
        <>
          <ul className="mt-4 grid gap-3 lg:hidden">
            {items.map((item) => (
              <li key={item.key} className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{c.drugShort[item.drug]}</p>
                  <Badge acknowledged={item.acknowledged} lang={lang} />
                </div>
                <p className="mt-2 text-ink-2">{t.reason[item.reason]}</p>
                <p className="mt-1 text-sm text-ink-3">
                  {item.centreName}
                  <span aria-hidden> · </span>
                  {formatHourBucket(item.hourBucket, lang)}
                </p>
                <p className="mt-2">
                  <ProofLink item={item} lang={lang} />
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 hidden overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface lg:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">{t.reportsCaption}</caption>
              <thead>
                <tr className="border-b border-line text-sm text-ink-3">
                  <th scope="col" className="px-4 py-3 font-medium">{t.colDrug}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{t.colReason}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{t.colCentre}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{t.colWhen}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{t.colState}</th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    <span className="sr-only">{c.proof}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.key} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-semibold">{c.drugShort[item.drug]}</td>
                    <td className="px-4 py-3">{t.reason[item.reason]}</td>
                    <td className="px-4 py-3">{item.centreName}</td>
                    <td className="px-4 py-3 text-ink-2">{formatHourBucket(item.hourBucket, lang)}</td>
                    <td className="px-4 py-3">
                      <Badge acknowledged={item.acknowledged} lang={lang} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ProofLink item={item} lang={lang} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
