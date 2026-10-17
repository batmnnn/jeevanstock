import { describe, expect, it } from "vitest";
import { parseConfig } from "@/lib/config";
import { decodeSession, encodeSession, staffCookieFlags } from "@/lib/session-core";

const DEV = "dev-only-insecure-session-secret-change-me-0000";
const SECRET = "production-session-secret-at-least-32";
const PINS = "1111,2222,3333";
const NOW = 1_800_000_000;

describe("SESSION_SECRET", () => {
  it("keeps local production memory bootable without a secret", () => {
    const c = parseConfig({ NODE_ENV: "production" });
    expect(c.sessionSecret).toBe(DEV);
    expect(c.showDemoPins).toBe(true);
  });

  it("refuses to boot on Vercel without a real secret, in either mode", () => {
    expect(() => parseConfig({ VERCEL: "1" })).toThrow(/SESSION_SECRET/);
    expect(() => parseConfig({ VERCEL: "1", NODE_ENV: "production", DATA_SOURCE: "memory" })).toThrow(/SESSION_SECRET/);
    expect(() => parseConfig({ VERCEL_ENV: "preview" })).toThrow(/SESSION_SECRET/);
    expect(() => parseConfig({ WEBSITE_SITE_NAME: "jeevanstock" })).toThrow(/SESSION_SECRET/);
  });

  it("refuses the dev secret and implicit pins when deployed", () => {
    expect(() => parseConfig({ VERCEL: "1", SESSION_SECRET: DEV, CENTRE_PINS: PINS })).toThrow(/dev default/);
    expect(() => parseConfig({ VERCEL: "1", SESSION_SECRET: SECRET })).toThrow(/CENTRE_PINS/);
  });

  it("hides demo pins on a deployed memory board unless asked to show them", () => {
    expect(parseConfig({ VERCEL: "1", SESSION_SECRET: SECRET, CENTRE_PINS: PINS }).showDemoPins).toBe(false);
    expect(parseConfig({ VERCEL: "1", SESSION_SECRET: SECRET, CENTRE_PINS: PINS, SHOW_DEMO_PINS: "1" }).showDemoPins).toBe(true);
  });
});

describe("session cookie", () => {
  it("rejects a signed token whose centre id is not a centre id", () => {
    const secret = "x".repeat(40);
    expect(decodeSession(encodeSession("../ADMIN", secret, NOW), secret, NOW)).toBeNull();
    expect(decodeSession(encodeSession("demo-rampur-1", secret, NOW), secret, NOW)).toBeNull();
    expect(decodeSession(encodeSession("DEMO-RAMPUR-1", secret, NOW), secret, NOW + 10)).toBe("DEMO-RAMPUR-1");
  });

  it("uses the same secure flags for login and logout", () => {
    expect(staffCookieFlags({ NODE_ENV: "production" })).toEqual({ httpOnly: true, sameSite: "strict", secure: true, path: "/" });
    expect(staffCookieFlags({}).secure).toBe(false);
    expect(staffCookieFlags({ VERCEL: "1" }).secure).toBe(true);
  });
});
