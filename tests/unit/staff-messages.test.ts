import { describe, expect, it } from "vitest";
import { CONFIRMED_TTL_DAYS, STOCK_TTL_HOURS } from "@/lib/domain";
import { repoErrorCode, staffErrorText } from "@/lib/staff/errors";
import type { StaffErrorCode } from "@/lib/staff/form-state";
import { CONFIRM_LIMIT, CONFIRM_WINDOW_MS, POST_LIMIT, POST_WINDOW_MS } from "@/lib/staff/limits";
import { staff, type StaffMessages } from "@/messages/staff";

function shape(value: unknown): unknown {
  if (typeof value === "function") return "fn";
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, shape((value as Record<string, unknown>)[key])]),
    );
  }
  return typeof value;
}

const codes: StaffErrorCode[] = [
  "wrong",
  "tooMany",
  "unauthorized",
  "invalidVials",
  "invalidReport",
  "notFound",
  "forbidden",
  "invalid",
  "unavailable",
  "rate",
  "postedPartial",
];

describe("staff copy", () => {
  it("gives Hindi and English the same shape", () => {
    expect(shape(staff.hi)).toEqual(shape(staff.en));
  });

  it("uses Devanagari for the generic login error and plain English on the other side", () => {
    expect(staff.hi.wrong).toMatch(/[\u0900-\u097F]/);
    expect(staff.en.wrong).toBe("Wrong centre or PIN");
    expect(staff.hi.months).toHaveLength(12);
    expect(staff.en.months).toHaveLength(12);
  });

  it("mentions the 6 hour stock window and the 30 day confirmation", () => {
    expect(STOCK_TTL_HOURS).toBe(6);
    expect(CONFIRMED_TTL_DAYS).toBe(30);
    expect(staff.en.postHint).toContain("6 hours");
    expect(staff.en.postHint.toLowerCase()).toContain("post again each shift");
    expect(staff.hi.postHint).toContain("6");
    expect(staff.hi.postHint).toContain("शिफ्ट");
    expect(staff.en.ledgerPending).toBe("Writing to the public ledger… ~10 seconds");
    expect(staff.hi.ledgerPending).toMatch(/[\u0900-\u097F]/);
    expect(staff.en.confirmedOk).toContain("30 days");
    expect(staff.en.openHint).toContain("48 hours");
    expect(staff.hi.reason.no_doctor).toMatch(/डॉक्टर/);
  });

  it("locks the post and confirm budgets", () => {
    expect(POST_LIMIT).toBe(12);
    expect(POST_WINDOW_MS).toBe(10 * 60 * 1000);
    expect(CONFIRM_LIMIT).toBe(30);
    expect(CONFIRM_WINDOW_MS).toBe(10 * 60 * 1000);
  });
});

describe("repo and form errors", () => {
  it("maps repo codes and refuses to echo anything else", () => {
    expect(repoErrorCode("not_found")).toBe("notFound");
    expect(repoErrorCode("forbidden")).toBe("forbidden");
    expect(repoErrorCode("invalid")).toBe("invalid");
    expect(repoErrorCode("unavailable")).toBe("unavailable");
    expect(repoErrorCode("not_found; <script>")).toBe("unavailable");
    expect(repoErrorCode("signing key does not match")).toBe("unavailable");
    expect(repoErrorCode("")).toBe("unavailable");
  });

  it("renders every code in both languages without leaking the code", () => {
    for (const code of codes) {
      for (const lang of ["hi", "en"] as const) {
        const text = staffErrorText({ code, seconds: 12 }, staff[lang]);
        expect(text.length).toBeGreaterThan(0);
        expect(text).not.toContain(code);
        if (code === "tooMany" || code === "rate") expect(text).toContain("12");
      }
    }
    expect(staffErrorText({ code: "wrong" }, staff.hi)).toMatch(/[\u0900-\u097F]/);
    expect(staffErrorText({ code: "unavailable" }, staff.en)).toContain("108");
  });

  it("types the two catalogues as the same message shape", () => {
    const hi: StaffMessages = staff.hi;
    const en: StaffMessages = staff.en;
    expect(hi.signIn).not.toBe(en.signIn);
  });
});
