import type { Drug, Reason } from "@/lib/centres";
import { CENTRE_ID_RE, parseHexId } from "./ids";

export interface ReceiptParams {
  key: string;
  centreId: string;
  tx: string;
}

const DRUGS: readonly Drug[] = ["ASV", "ARV"];
const REASONS: readonly Reason[] = ["out", "no_doctor", "closed"];

/** entity key and tx must be 0x-hex; centre id must match the public id shape. */
export function parseReceiptParams(input: { key: unknown; c: unknown; tx: unknown }): ReceiptParams | null {
  const key = parseHexId(input.key);
  const tx = parseHexId(input.tx);
  if (!key || !tx) return null;
  if (typeof input.c !== "string") return null;
  const centreId = input.c.trim();
  if (!CENTRE_ID_RE.test(centreId)) return null;
  return { key, centreId, tx };
}

/** Path for the success redirect. Null when the chain result is not a safe id. */
export function receiptPath(key: unknown, centreId: unknown, tx: unknown): string | null {
  const parsed = parseReceiptParams({ key, c: centreId, tx });
  if (!parsed) return null;
  return `/receipt/${parsed.key}?c=${encodeURIComponent(parsed.centreId)}&tx=${encodeURIComponent(parsed.tx)}`;
}

export interface ReceiptDetails {
  drug: Drug;
  reason: Reason;
}

/**
 * What the family can be shown about their report.
 * "mismatch" means this key belongs to a different centre — do not render the page.
 * Returns only drug and reason, never creator or other fields.
 */
export function receiptDetails(
  reports: readonly { key: string; centreId: string; drug: string; reason: string }[],
  key: string,
  centreId: string,
): ReceiptDetails | "mismatch" | null {
  const hit = reports.find((r) => r.key.toLowerCase() === key.toLowerCase());
  if (!hit) return null;
  if (hit.centreId !== centreId) return "mismatch";
  if (!DRUGS.includes(hit.drug as Drug) || !REASONS.includes(hit.reason as Reason)) return null;
  return { drug: hit.drug as Drug, reason: hit.reason as Reason };
}
