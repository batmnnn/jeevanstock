import { CENTRES } from "@/lib/centres";
import { CENTRE_ID_RE, parseHexId } from "./ids";
import { parseNeed } from "./need";

export type Board = "demo" | "live";

export function boardFor(centreId: string): Board {
  return CENTRES.some((centre) => centre.centreId === centreId) ? "demo" : "live";
}

/** Front door. A medicine choice belongs on a board, not on this path. */
export function homeHref(_need?: unknown): string {
  return "/";
}

/** Internal path only. Unknown choices never enter the query string. */
export function boardHref(board: Board, need: unknown): string {
  const base = board === "demo" ? "/demo" : "/live";
  const parsed = parseNeed(need);
  return parsed ? `${base}?need=${parsed}` : base;
}

export function centreHref(centreId: unknown, need: unknown): string {
  if (typeof centreId !== "string" || !CENTRE_ID_RE.test(centreId)) return "/";
  const base = `/centre/${encodeURIComponent(centreId)}`;
  const parsed = parseNeed(need);
  return parsed ? `${base}?need=${parsed}` : base;
}

export function reportHref(centreId: unknown, drug: unknown): string {
  if (typeof centreId !== "string" || !CENTRE_ID_RE.test(centreId)) return "/";
  const base = `/centre/${encodeURIComponent(centreId)}/report`;
  const parsed = parseNeed(drug);
  return parsed ? `${base}?drug=${parsed}` : base;
}

export function verifyHref(postKey: unknown): string | null {
  const hex = parseHexId(postKey);
  if (!hex) return null;
  return `/verify/${hex}`;
}
