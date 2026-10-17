import Link from "next/link";
import type { Drug } from "@/lib/centres";
import { cx } from "@/components/ui";
import { homeHref } from "@/lib/family/routes";

export function NeedPills({
  need,
  copy,
}: {
  need: Drug | null;
  copy: { snakebite: string; snakebiteEn: string; dogbite: string; dogbiteEn: string; selected: string };
}) {
  const items: { drug: Drug; hi: string; en: string }[] = [
    { drug: "ASV", hi: copy.snakebite, en: copy.snakebiteEn },
    { drug: "ARV", hi: copy.dogbite, en: copy.dogbiteEn },
  ];
  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const active = need === item.drug;
        return (
          <Link
            key={item.drug}
            href={homeHref(item.drug)}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex min-h-[4.5rem] items-center justify-between gap-3 rounded-2xl border-2 px-5 py-3",
              active ? "border-brand bg-brand text-brand-ink" : "border-line-2 bg-surface text-ink",
            )}
          >
            <span>
              <span className="block text-lg font-bold leading-tight" lang="hi">
                {item.hi}
              </span>
              <span className={cx("block text-sm", active ? "opacity-90" : "text-ink-3")} lang="en">
                {item.en}
              </span>
            </span>
            {active ? (
              <span className="text-sm font-semibold">{copy.selected}</span>
            ) : (
              <span aria-hidden className="text-xl text-ink-3">
                →
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
