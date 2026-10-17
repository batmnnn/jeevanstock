import { describe, expect, it } from "vitest";
import { ipHeaderForLimit } from "@/lib/client-ip";
import { clientLimitKey } from "@/lib/family/client-key";
import { rateLimit, resetRateLimits } from "@/lib/ratelimit";
import { clientHash } from "@/lib/staff/client-hash";

describe("rate limit memory cap", () => {
  it("stops accepting new keys once the table is full, and reuses expired slots", () => {
    resetRateLimits();
    for (let i = 0; i < 10_000; i++) expect(rateLimit(`k${i}`, 5, 60_000, 0).ok).toBe(true);
    expect(rateLimit("overflow", 5, 60_000, 0)).toMatchObject({ ok: false });
    expect(rateLimit("k0", 5, 60_000, 0).ok).toBe(true);
    expect(rateLimit("fresh", 5, 60_000, 60_000).ok).toBe(true);
    resetRateLimits();
  });
});

describe("which address the limiter hashes", () => {
  it("uses x-real-ip on Vercel and ignores a spoofed forwarded header", () => {
    const read = { realIp: "203.0.113.9", forwardedFor: "198.51.100.1, 10.0.0.1" };
    expect(ipHeaderForLimit(read, { VERCEL: "1" })).toBe("203.0.113.9");
    expect(clientHash(ipHeaderForLimit(read, { VERCEL: "1" }))).toBe(clientHash("203.0.113.9"));
    expect(clientHash(ipHeaderForLimit(read, { VERCEL: "1" }))).not.toBe(clientHash("198.51.100.1"));
    expect(clientLimitKey(ipHeaderForLimit(read, { VERCEL: "1" }))).not.toContain("203.0.113.9");
  });

  it("does not trust x-real-ip off Vercel, and falls back to the forwarded hop", () => {
    const read = { realIp: "203.0.113.9", forwardedFor: "198.51.100.1, 10.0.0.1" };
    expect(ipHeaderForLimit(read, {})).toBe("198.51.100.1, 10.0.0.1");
  });

  it("uses the hop Azure App Service appends, not the client-supplied first one", () => {
    const azure = { WEBSITE_SITE_NAME: "jeevanstock" };
    expect(ipHeaderForLimit({ realIp: null, forwardedFor: "198.51.100.1, 203.0.113.9:51234" }, azure)).toBe("203.0.113.9");
    expect(ipHeaderForLimit({ realIp: null, forwardedFor: "[2001:db8::1]:443" }, azure)).toBe("2001:db8::1");
    expect(ipHeaderForLimit({ realIp: null, forwardedFor: null }, azure)).toBeNull();
  });

  it("shares one bucket on Vercel when the platform address is missing", () => {
    expect(ipHeaderForLimit({ realIp: null, forwardedFor: "1.2.3.4" }, { VERCEL: "1" })).toBeNull();
    expect(ipHeaderForLimit({ realIp: "  ", forwardedFor: "1.2.3.4" }, { VERCEL: "1" })).toBeNull();
  });
});
