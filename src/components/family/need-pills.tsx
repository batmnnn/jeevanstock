import Link from "next/link";
import type { Drug } from "@/lib/centres";
import { cx } from "@/components/ui";
import { boardHref, type Board } from "@/lib/family/routes";

const FILL: Record<Drug, string> = {
  ASV: "bg-brand text-brand-ink",
  ARV: "bg-accent text-white",
};
const ART: Record<Drug, string> = {
  ASV: "/art/snake.png",
  ARV: "/art/dog.png",
};

export function NeedPills({
  need,
  board,
  copy,
}: {
  need: Drug | null;
  board: Board;
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
            href={boardHref(board, item.drug)}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex min-h-[4.75rem] items-center justify-between gap-3 rounded-2xl px-4 py-3",
              active ? FILL[item.drug] : "glass text-ink",
            )}
          >
            <span className="flex min-w-0 items-center gap-1">
              <img
                src={ART[item.drug]}
                alt=""
                width={160}
                height={160}
                className="pointer-events-none -my-5 h-[4.75rem] w-[4.75rem] shrink-0 object-contain drop-shadow-[0_8px_12px_rgb(20_27_45/0.16)]"
              />
              <span>
                <span className="block font-display text-2xl leading-tight" lang="hi">
                  {item.hi}
                </span>
                <span className={cx("mt-0.5 block text-sm", active ? "text-white" : "text-ink-3")} lang="en">
                  {item.en}
                </span>
              </span>
            </span>
            {active ? <span className="text-sm font-medium">{copy.selected}</span> : null}
          </Link>
        );
      })}
    </div>
  );
}
