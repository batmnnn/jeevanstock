import { describe, expect, it } from "vitest";
import { decodeSession, encodeSession, pinMatches, SESSION_TTL_SEC } from "@/lib/session-core";
import { rateLimit, resetRateLimits } from "@/lib/ratelimit";

const S = "x".repeat(40);
const NOW = 1_800_000_000;

describe("staff session tokens", () => {
  it("round-trips", () => expect(decodeSession(encodeSession("DEMO-A", S, NOW), S, NOW + 10)).toBe("DEMO-A"));
  it("expires", () => expect(decodeSession(encodeSession("DEMO-A", S, NOW), S, NOW + SESSION_TTL_SEC)).toBeNull());
  it("rejects a token signed with another secret", () => expect(decodeSession(encodeSession("DEMO-A", "y".repeat(40), NOW), S, NOW)).toBeNull());
  it("rejects a tampered payload (privilege escalation to another centre)", () => {
    const [, mac] = encodeSession("DEMO-A", S, NOW).split(".");
    const forged = Buffer.from(JSON.stringify({ c: "DEMO-B", e: NOW + 999 })).toString("base64url");
    expect(decodeSession(`${forged}.${mac}`, S, NOW)).toBeNull();
  });
  it.each([undefined, "", "abc", "a.b.c", "x".repeat(600)])("rejects garbage %#", (t) => expect(decodeSession(t, S, NOW)).toBeNull());
});

describe("pinMatches", () => {
  it("matches exact PINs only", () => {
    expect(pinMatches("1234", "1234")).toBe(true);
    expect(pinMatches("1235", "1234")).toBe(false);
    expect(pinMatches("12345", "1234")).toBe(false);
    expect(pinMatches("", "1234")).toBe(false);
  });
});

describe("rateLimit", () => {
  it("allows up to the limit then blocks until the window resets", () => {
    resetRateLimits();
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 1000, 0).ok).toBe(true);
    expect(rateLimit("k", 3, 1000, 10)).toMatchObject({ ok: false, retryAfterSec: 1 });
    expect(rateLimit("k", 3, 1000, 1000).ok).toBe(true);
  });
});
