import { createHash } from "node:crypto";

/**
 * Fixed salt mixed into the in-memory login limiter key.
 * Not a secret. The hash is never logged and never sent back to the browser.
 */
export const CLIENT_HASH_SALT = "jeevanstock-staff-rl-v1";

const MAX_HOP = 128;

/** First hop of X-Forwarded-For, trimmed and length-capped. Empty when the header is missing. */
export function firstForwardedHop(header: string | null | undefined): string {
  if (typeof header !== "string" || header.length === 0) return "";
  const first = header.split(",")[0] ?? "";
  return first.trim().slice(0, MAX_HOP);
}

/** SHA-256(first hop + fixed salt). Hex only, so the raw address cannot appear in the limiter key. */
export function clientHash(forwardedFor: string | null | undefined): string {
  const hop = firstForwardedHop(forwardedFor);
  return createHash("sha256").update(hop + CLIENT_HASH_SALT).digest("hex");
}
