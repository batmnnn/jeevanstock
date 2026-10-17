import { createHash } from "node:crypto";
import { CENTRE_ID_RE } from "./ids";

/** Fixed salt. Not a secret — it stops the limiter key from being the raw address. */
const SALT = "jeevanstock-family-report-v1";

/**
 * SHA-256 of the first X-Forwarded-For hop plus the salt.
 * The raw hop is not returned, logged, or stored. Only this hash is handed to the in-memory limiter.
 */
export function reportClientKey(forwardedFor: string | null | undefined): string {
  const raw = typeof forwardedFor === "string" ? forwardedFor : "";
  const first = raw.split(",")[0]?.trim().slice(0, 256) ?? "";
  return createHash("sha256").update(first, "utf8").update("\0", "utf8").update(SALT, "utf8").digest("hex");
}

/** Limiter bucket id. Contains the hash, never the address. */
export function clientLimitKey(forwardedFor: string | null | undefined): string {
  return `family-report:client:${reportClientKey(forwardedFor)}`;
}

/** Limiter bucket for one public centre id. Refuses anything that is not a centre id. */
export function centreLimitKey(centreId: string): string | null {
  if (!CENTRE_ID_RE.test(centreId)) return null;
  return `family-report:centre:${centreId}`;
}
