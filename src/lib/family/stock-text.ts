import { MAX_VIALS, minutesAgo, type DrugStock } from "@/lib/domain";

export interface StockPhrases {
  vials: (n: number) => string;
  minutesAgo: (m: number) => string;
  noUpdate: string;
  sentShelf: string;
  vialsUnknown: string;
  updated: (when: string) => string;
}

export function describeStock(
  stock: Pick<DrugStock, "status" | "vials" | "postedAt">,
  nowSec: number,
  copy: StockPhrases,
): { vialsLabel: string; updatedLabel: string } {
  const vialsLabel =
    typeof stock.vials === "number" && Number.isInteger(stock.vials) && stock.vials >= 0 && stock.vials <= MAX_VIALS
      ? copy.vials(stock.vials)
      : copy.vialsUnknown;
  if (stock.status === "sent") return { vialsLabel, updatedLabel: copy.sentShelf };
  if (stock.status === "stale" || stock.postedAt == null || !Number.isFinite(stock.postedAt) || !Number.isFinite(nowSec)) {
    return { vialsLabel, updatedLabel: copy.noUpdate };
  }
  return { vialsLabel, updatedLabel: copy.updated(copy.minutesAgo(minutesAgo(stock.postedAt, nowSec))) };
}
