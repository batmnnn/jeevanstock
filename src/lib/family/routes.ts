import { CENTRE_ID_RE, parseHexId } from "./ids";
import { parseNeed } from "./need";

/** Internal path only. Unknown choices go to the home list, never into the query string. */
export function homeHref(need: unknown): string {
  const parsed = parseNeed(need);
  return parsed ? `/?need=${parsed}` : "/";
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
