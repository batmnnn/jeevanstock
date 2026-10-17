// Fixed-window in-memory limiter. Keys are transient and never persisted or logged.
// Per-instance on serverless — a cost/abuse brake for the demo, not a hard guarantee.
const g = globalThis as unknown as { __jeevanRL?: Map<string, { n: number; reset: number }> };
const buckets = (g.__jeevanRL ??= new Map());
const MAX_BUCKETS = 10_000;
const MAX_KEY = 200;

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): { ok: boolean; retryAfterSec: number } {
  const id = key.length > MAX_KEY ? key.slice(0, MAX_KEY) : key;
  if (buckets.size >= MAX_BUCKETS) for (const [k, b] of buckets) if (b.reset <= now) buckets.delete(k);
  const b = buckets.get(id);
  if (!b || b.reset <= now) {
    if (!buckets.has(id) && buckets.size >= MAX_BUCKETS) {
      return { ok: false, retryAfterSec: Math.max(1, Math.ceil(windowMs / 1000)) };
    }
    buckets.set(id, { n: 1, reset: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (b.n >= limit) return { ok: false, retryAfterSec: Math.ceil((b.reset - now) / 1000) };
  b.n += 1;
  return { ok: true, retryAfterSec: 0 };
}

export const resetRateLimits = () => buckets.clear();
