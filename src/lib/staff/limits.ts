/** Windows and keys for staff rate limits. Keys never contain a raw IP or PIN. */

export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_CLIENT_LIMIT = 5;
export const LOGIN_CENTRE_LIMIT = 20;

export const POST_WINDOW_MS = 10 * 60 * 1000;
export const POST_LIMIT = 12;

export const CONFIRM_WINDOW_MS = 10 * 60 * 1000;
export const CONFIRM_LIMIT = 30;

/** Shared bucket for attempts that do not name a real centre. Not a centre id. */
export const UNKNOWN_CENTRE_BUCKET = "invalid";

export function loginRateKeys(clientHashHex: string, centreId: string) {
  return {
    /** 5 failures per client hash + centre. */
    client: `staff:login:${clientHashHex}:${centreId}`,
    /** 20 failures per centre. Must not include the client hash. */
    centre: `staff:login:centre:${centreId}`,
  };
}

export const postRateKey = (centreId: string) => `staff:post:${centreId}`;
export const confirmRateKey = (centreId: string) => `staff:confirm:${centreId}`;

/** Clamp a limiter's retry hint so the UI never echoes a wild number. */
export function retrySeconds(sec: number, windowMs: number): number {
  const cap = Math.max(1, Math.ceil(windowMs / 1000));
  if (!Number.isFinite(sec)) return cap;
  return Math.min(cap, Math.max(1, Math.ceil(sec)));
}
