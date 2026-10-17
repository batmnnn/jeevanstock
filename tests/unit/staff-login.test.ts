import { describe, expect, it } from "vitest";
import { clientHash } from "@/lib/staff/client-hash";
import { centreName, isCentreId, parseLogin } from "@/lib/staff/login";
import { LOGIN_CENTRE_LIMIT, LOGIN_CLIENT_LIMIT, LOGIN_WINDOW_MS, loginRateKeys, retrySeconds, UNKNOWN_CENTRE_BUCKET } from "@/lib/staff/limits";

const CENTRE = "DEMO-RAMPUR-1";

describe("parseLogin", () => {
  it("accepts a known centre and a 4–8 digit PIN", () => {
    expect(parseLogin({ centreId: CENTRE, pin: "1111" })).toEqual({ ok: true, centreId: CENTRE, pin: "1111" });
    expect(parseLogin({ centreId: "DEMO-SONPUR-CHC", pin: "12345678" }).ok).toBe(true);
  });

  it("keeps the centre id when only the PIN is bad, and drops oversized PINs", () => {
    expect(parseLogin({ centreId: CENTRE, pin: "123" })).toEqual({
      ok: false,
      knownCentreId: CENTRE,
      pinAttempt: "123",
    });
    expect(parseLogin({ centreId: CENTRE, pin: "1".repeat(10_000) })).toEqual({
      ok: false,
      knownCentreId: CENTRE,
      pinAttempt: "",
    });
  });

  it.each([
    ["123", "too short"],
    ["123456789", "too long"],
    ["abcd", "letters"],
    ["1111 ", "trailing space"],
    [" 1111", "leading space"],
    ["11 11", "space inside"],
    ["०१११", "devanagari digits"],
    ["1111\n", "newline"],
    ["", "empty"],
    ["+1111", "sign"],
    ["0x111", "hex"],
  ])("rejects pin %j (%s)", (pin) => {
    const parsed = parseLogin({ centreId: CENTRE, pin });
    expect(parsed.ok).toBe(false);
  });

  it.each([null, undefined, 1111, true, ["1111"], { toString: () => "1111" }])("rejects non-string pin %j", (pin) => {
    expect(parseLogin({ centreId: CENTRE, pin }).ok).toBe(false);
  });

  it.each([
    "demo-rampur-1",
    "DEMO-RAMPUR-1 ",
    "../etc/passwd",
    "DEMO-RAMPUR-1' OR '1'='1",
    "DEMO-OTHER",
    "",
    "invalid",
  ])("does not treat %j as a known centre", (centreId) => {
    const parsed = parseLogin({ centreId, pin: "1111" });
    expect(parsed).toMatchObject({ ok: false, knownCentreId: null });
  });

  it.each([null, undefined, 1, true, [CENTRE], { centreId: CENTRE }])("rejects non-string centre %j", (centreId) => {
    expect(parseLogin({ centreId, pin: "1111" })).toMatchObject({ ok: false, knownCentreId: null });
  });

  it("rejects junk containers without throwing", () => {
    expect(parseLogin(null)).toMatchObject({ ok: false, knownCentreId: null, pinAttempt: "" });
    expect(parseLogin(undefined)).toMatchObject({ ok: false });
    expect(parseLogin("DEMO-RAMPUR-1")).toMatchObject({ ok: false });
    expect(parseLogin([])).toMatchObject({ ok: false });
    expect(parseLogin(Object.create(null))).toMatchObject({ ok: false, knownCentreId: null });
    const boom = Object.create(null) as { centreId?: string };
    Object.defineProperty(boom, "centreId", { get() { throw new Error("nope"); } });
    expect(parseLogin(boom)).toMatchObject({ ok: false, knownCentreId: null });
  });

  it("does not return anything except the centre and the pin", () => {
    const parsed = parseLogin({ centreId: CENTRE, pin: "1234", admin: true, role: "root" });
    expect(parsed).toEqual({ ok: true, centreId: CENTRE, pin: "1234" });
  });
});

describe("centre helpers", () => {
  it("resolves the public name and rejects unknown ids", () => {
    expect(isCentreId(CENTRE)).toBe(true);
    expect(isCentreId("x".repeat(10_000))).toBe(false);
    expect(centreName(CENTRE)).toBe("Demo PHC Rampur-1");
    expect(centreName("nope")).toBeNull();
  });
});

describe("login rate-limit keys", () => {
  it("uses the documented windows and keeps the centre bucket free of the client hash", () => {
    expect(LOGIN_CLIENT_LIMIT).toBe(5);
    expect(LOGIN_CENTRE_LIMIT).toBe(20);
    expect(LOGIN_WINDOW_MS).toBe(15 * 60 * 1000);
    const hash = clientHash("198.51.100.20");
    const keys = loginRateKeys(hash, CENTRE);
    expect(keys.client).toBe(`staff:login:${hash}:${CENTRE}`);
    expect(keys.centre).toBe(`staff:login:centre:${CENTRE}`);
    expect(keys.centre).not.toContain(hash);
    expect(keys.client).not.toContain("198.51.100.20");
    expect(keys.centre).not.toContain("198.51.100.20");
    expect(UNKNOWN_CENTRE_BUCKET).not.toBe(CENTRE);
  });
});

describe("retrySeconds", () => {
  it("clamps wild and fractional values into the window", () => {
    expect(retrySeconds(0, 15_000)).toBe(1);
    expect(retrySeconds(10.2, 60_000)).toBe(11);
    expect(retrySeconds(99_999, 15_000)).toBe(15);
    expect(retrySeconds(Number.NaN, 15_000)).toBe(15);
    expect(retrySeconds(Number.POSITIVE_INFINITY, 15_000)).toBe(15);
    expect(retrySeconds(-5, 15_000)).toBe(1);
    expect(retrySeconds(1e9, LOGIN_WINDOW_MS)).toBe(15 * 60);
  });
});
