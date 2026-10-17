import { common, type Lang } from "@/lib/i18n";
import { btn } from "./ui";

/** Honest RPC-down state. Always offers the emergency number. */
export function Unavailable({ lang, retryHref = "" }: { lang: Lang; retryHref?: string }) {
  const t = common[lang];
  return (
    <section role="alert" className="mt-6 rounded-[var(--radius-card)] border-l-4 border-out bg-surface p-5">
      <h1 className="text-xl font-bold">{t.unavailableTitle}</h1>
      <p className="mt-2 text-ink-2">{t.unavailableBody}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href="tel:108" className={btn.danger}>{t.call108}</a>
        <a href={retryHref || "."} className={btn.secondary}>{t.retry}</a>
      </div>
    </section>
  );
}
