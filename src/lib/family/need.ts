import type { Drug } from "@/lib/centres";

/** `?need=` / `?drug=` → ASV or ARV. Anything else, including arrays, is no choice. */
export function parseNeed(v: unknown): Drug | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (s === "ASV" || s === "ARV") return s;
  return null;
}
