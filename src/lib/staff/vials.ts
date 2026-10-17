import { z } from "zod";
import { isValidVials, MAX_VIALS } from "../domain";

const vialNumber = z.number().finite().int().min(0).max(MAX_VIALS);
const vialString = z.string().regex(/^(0|[1-9]\d{0,2})$/);

/** Integer 0..999. Rejects floats, scientific notation, signs, leading zeros, and non-strings/numbers. */
export function parseVial(raw: unknown): number | null {
  if (typeof raw === "number") {
    const parsed = vialNumber.safeParse(raw);
    return parsed.success && isValidVials(parsed.data) ? parsed.data : null;
  }
  if (typeof raw !== "string" || raw.length > 3) return null;
  const parsed = vialString.safeParse(raw);
  if (!parsed.success) return null;
  const n = Number(parsed.data);
  return isValidVials(n) ? n : null;
}

export type StockParse =
  | { ok: true; ASV: number; ARV: number }
  | { ok: false; fields: Array<"asv" | "arv"> };

export function parseStockForm(raw: { asv: unknown; arv: unknown }): StockParse {
  const ASV = parseVial(raw.asv);
  const ARV = parseVial(raw.arv);
  const fields: Array<"asv" | "arv"> = [];
  if (ASV === null) fields.push("asv");
  if (ARV === null) fields.push("arv");
  if (fields.length > 0 || ASV === null || ARV === null) return { ok: false, fields };
  return { ok: true, ASV, ARV };
}

/** One step of a vial stepper. Anything other than ±1 is ignored. */
export function stepVial(current: number, delta: number): number {
  const base = isValidVials(current) ? current : 0;
  if (delta !== 1 && delta !== -1) return base;
  const next = base + delta;
  if (next < 0) return 0;
  if (next > MAX_VIALS) return MAX_VIALS;
  return next;
}
