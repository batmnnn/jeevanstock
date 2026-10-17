// Framework-free session primitives (unit-tested). Cookie I/O lives in session.ts.
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_TTL_SEC = 12 * 3600;

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function encodeSession(centreId: string, secret: string, nowSec = Math.floor(Date.now() / 1000)): string {
  const payload = Buffer.from(JSON.stringify({ c: centreId, e: nowSec + SESSION_TTL_SEC })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function decodeSession(token: string | undefined, secret: string, nowSec = Math.floor(Date.now() / 1000)): string | null {
  if (!token || token.length > 512) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expected = Buffer.from(sign(payload, secret));
  const got = Buffer.from(mac);
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null;
  try {
    const { c, e } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof c !== "string" || typeof e !== "number" || e <= nowSec) return null;
    return c;
  } catch {
    return null;
  }
}

/** Constant-time PIN comparison (hash both sides so lengths match). */
export function pinMatches(given: string, expected: string): boolean {
  const h = (s: string) => createHmac("sha256", "pin").update(s).digest();
  return timingSafeEqual(h(given), h(expected));
}
