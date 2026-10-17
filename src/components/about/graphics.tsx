import type { SupplyGap } from "@/lib/directory";

/** Warehouse stock beside one dot per rural PHC. Filled and hollow dots differ in shape, not only colour. */
export function GapFigure({
  gap,
  warehouseLabel,
  caption,
  legendGot,
  legendNone,
  note,
}: {
  gap: SupplyGap;
  warehouseLabel: string;
  caption: string;
  legendGot: string;
  legendNone: string;
  note: string;
}) {
  const got = gap.total - gap.none;
  return (
    <figure className="glass mt-8 grid gap-6 rounded-3xl p-5 sm:p-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
      <div className="flex items-center gap-4">
        <img src="/art/vials.png" alt="" width={723} height={510} className="w-24 shrink-0 drop-shadow-[0_10px_14px_rgb(20_27_45/0.14)] sm:w-28" />
        <p>
          <span className="block font-mono text-4xl leading-none tabular-nums">{gap.warehouseAsv.toLocaleString("en-IN")}</span>
          <span className="mt-2 block text-sm text-ink-2">{warehouseLabel}</span>
        </p>
      </div>
      <div>
        <ul aria-hidden className="grid grid-cols-9 gap-1.5 sm:grid-cols-15 sm:gap-2">
          {Array.from({ length: gap.total }, (_, i) => (
            <li
              key={i}
              className={i < got ? "aspect-square rounded-full bg-in" : "aspect-square rounded-full border-2 border-out bg-paper/70"}
            />
          ))}
        </ul>
        <figcaption className="mt-4 text-base font-medium text-ink">{caption}</figcaption>
        <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-2">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-full bg-in" />
            {legendGot} ({got})
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-full border-2 border-out" />
            {legendNone} ({gap.none})
          </span>
        </p>
        <p className="mt-1 text-sm text-ink-3">{note}</p>
      </div>
    </figure>
  );
}

const MAX_HOURS = 24 * 30;

/** Log-scale bars, so six hours stays visible next to thirty days. The text carries the value. */
export function LifetimeBars({ heading, rows }: { heading: string; rows: readonly { label: string; value: string; hours: number }[] }) {
  return (
    <div className="glass mt-8 rounded-3xl p-5 sm:p-6">
      <h3 className="text-lg font-medium">{heading}</h3>
      <ul className="mt-4 grid gap-4">
        {rows.map((row) => (
          <li key={row.label}>
            <p className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-ink">{row.label}</span>
              <span className="font-mono tabular-nums text-ink-2">{row.value}</span>
            </p>
            <span aria-hidden className="mt-1.5 block h-2.5 overflow-hidden rounded-full bg-line">
              <span
                className="block h-full rounded-full bg-brand"
                style={{ width: `${Math.max(8, (Math.log(row.hours) / Math.log(MAX_HOURS)) * 100)}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
