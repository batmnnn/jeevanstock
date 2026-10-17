import { describe, expect, it } from "vitest";
import { parseNeed } from "@/lib/family/need";
import { boardHref, centreHref, homeHref, reportHref, verifyHref } from "@/lib/family/routes";

const HEX = `0x${"ab".repeat(32)}`;
const ATTACKS: unknown[] = [
  null,
  undefined,
  1,
  0,
  true,
  false,
  [],
  ["ASV"],
  ["ASV", "ARV"],
  {},
  { toString: () => "ASV" },
  "",
  " ",
  "asv",
  "Asv",
  "arv",
  "ASV ARV",
  "ASV,ARV",
  "ASV\nARV",
  "ASV/ARV",
  "<script>alert(1)</script>",
  "javascript:alert(1)",
  "https://evil.example",
  "//evil.example",
  "/\\evil",
  "../admin",
  "ASV%00",
  "\0ASV",
  "ASV<script>",
];

describe("parseNeed", () => {
  it("accepts the two medicines", () => {
    expect(parseNeed("ASV")).toBe("ASV");
    expect(parseNeed("ARV")).toBe("ARV");
    expect(parseNeed(" ASV ")).toBe("ASV");
    expect(parseNeed("ARV\n")).toBe("ARV");
  });

  it.each(ATTACKS)("rejects %j", (value) => {
    expect(parseNeed(value)).toBeNull();
  });
});

describe("family routes stay inside the app", () => {
  it("builds the happy paths", () => {
    expect(homeHref("ASV")).toBe("/");
    expect(homeHref(null)).toBe("/");
    expect(boardHref("live", "ASV")).toBe("/live?need=ASV");
    expect(boardHref("demo", "ARV")).toBe("/demo?need=ARV");
    expect(boardHref("live", null)).toBe("/live");
    expect(centreHref("DEMO-RAMPUR-1", "ARV")).toBe("/centre/DEMO-RAMPUR-1?need=ARV");
    expect(centreHref("DEMO-RAMPUR-1", null)).toBe("/centre/DEMO-RAMPUR-1");
    expect(reportHref("DEMO-SONPUR-CHC", "ASV")).toBe("/centre/DEMO-SONPUR-CHC/report?drug=ASV");
    expect(reportHref("DEMO-SONPUR-CHC", "nope")).toBe("/centre/DEMO-SONPUR-CHC/report");
    expect(verifyHref(HEX)).toBe(`/verify/${HEX}`);
    expect(verifyHref(`0X${"ab".repeat(32)}`)).toBe(`/verify/0x${"ab".repeat(32)}`);
  });

  it.each(ATTACKS)("does not reflect %j into a URL", (value) => {
    expect(homeHref(value)).toBe("/");
    expect(centreHref(value, "ASV")).toBe("/");
    expect(reportHref(value, "ASV")).toBe("/");
    expect(verifyHref(value)).toBeNull();
    for (const href of [homeHref(value), centreHref("DEMO-RAMPUR-1", value), reportHref("DEMO-RAMPUR-1", value)]) {
      expect(href.startsWith("/")).toBe(true);
      expect(href.startsWith("//")).toBe(false);
      expect(href).not.toMatch(/javascript:|https?:|<|>|\.\./);
    }
  });

  it("rejects centre ids and hex that are the wrong shape", () => {
    expect(centreHref("demo-rampur-1", "ASV")).toBe("/");
    expect(centreHref("DEMO-RAMPUR-1/../admin", "ASV")).toBe("/");
    expect(centreHref("../DEMO-RAMPUR-1", "ASV")).toBe("/");
    expect(centreHref(`${"A".repeat(41)}`, "ASV")).toBe("/");
    expect(centreHref("AB", "ASV")).toBe("/");
    expect(verifyHref(`0x${"a".repeat(63)}`)).toBeNull();
    expect(verifyHref(`0x${"a".repeat(65)}`)).toBeNull();
    expect(verifyHref(`0x${"g".repeat(64)}`)).toBeNull();
    expect(verifyHref(`${HEX}?next=https://evil.example`)).toBeNull();
  });
});
