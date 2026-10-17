import { describe, expect, it } from "vitest";
import { isKnownCentreId, parseHexId } from "@/lib/family/ids";
import { parseReceiptParams, receiptDetails, receiptPath } from "@/lib/family/receipt";

const KEY = `0x${"ab".repeat(32)}`;
const TX = `0x${"cd".repeat(32)}`;
const CENTRE = "DEMO-RAMPUR-1";

describe("parseHexId", () => {
  it("keeps a 32-byte hex id and normalises the prefix", () => {
    expect(parseHexId(KEY)).toBe(KEY);
    expect(parseHexId(`0X${"AB".repeat(32)}`)).toBe(`0x${"AB".repeat(32)}`);
    expect(parseHexId(`  ${KEY}\n`)).toBe(KEY);
  });

  it.each([
    "",
    "0x",
    `0x${"a".repeat(63)}`,
    `0x${"a".repeat(65)}`,
    `0x${"g".repeat(64)}`,
    KEY.slice(2),
    `javascript:${KEY}`,
    `${KEY}/../admin`,
    `<script>${KEY}</script>`,
    null,
    undefined,
    1,
    [KEY],
  ])("rejects %j", (value) => {
    expect(parseHexId(value)).toBeNull();
  });
});

describe("parseReceiptParams", () => {
  it("accepts a real receipt", () => {
    expect(parseReceiptParams({ key: KEY, c: ` ${CENTRE} `, tx: TX })).toEqual({ key: KEY, centreId: CENTRE, tx: TX });
  });

  it.each([
    { key: "javascript:alert(1)", c: CENTRE, tx: TX },
    { key: KEY, c: CENTRE, tx: "javascript:alert(1)" },
    { key: KEY, c: "demo-rampur-1", tx: TX },
    { key: KEY, c: "DEMO-RAMPUR-1/../admin", tx: TX },
    { key: KEY, c: ["DEMO-RAMPUR-1"], tx: TX },
    { key: [KEY], c: CENTRE, tx: TX },
    { key: KEY, c: CENTRE, tx: null },
    { key: "", c: "", tx: "" },
    { key: `0x${"a".repeat(63)}`, c: CENTRE, tx: TX },
    { key: KEY, c: "DEMO-रामपुर", tx: TX },
    { key: `${KEY}?x=1`, c: CENTRE, tx: TX },
  ])("rejects %j", (input) => {
    expect(parseReceiptParams(input)).toBeNull();
  });
});

describe("receiptPath", () => {
  it("is an internal path", () => {
    const path = receiptPath(KEY, CENTRE, TX);
    expect(path).toBe(`/receipt/${KEY}?c=${CENTRE}&tx=${TX}`);
    expect(path?.startsWith("/receipt/")).toBe(true);
    expect(path).not.toMatch(/https?:|javascript:|\.\./);
  });

  it("refuses to build a path from hostile ids", () => {
    expect(receiptPath("https://evil.example", CENTRE, TX)).toBeNull();
    expect(receiptPath(KEY, "../etc", TX)).toBeNull();
    expect(receiptPath(KEY, CENTRE, "//evil.example")).toBeNull();
  });
});

describe("receiptDetails", () => {
  const report = { key: KEY, centreId: CENTRE, drug: "ASV", reason: "out", creator: "0x" + "11".repeat(20), phone: "999" };

  it("returns only the medicine and the reason", () => {
    const details = receiptDetails([report], KEY.toUpperCase(), CENTRE);
    expect(details).toEqual({ drug: "ASV", reason: "out" });
    expect(JSON.stringify(details)).not.toContain("999");
    expect(JSON.stringify(details)).not.toContain("0x11");
    if (details && details !== "mismatch") expect(Object.keys(details).sort()).toEqual(["drug", "reason"]);
  });

  it("is missing when the key is not in the snapshot yet", () => {
    expect(receiptDetails([report], TX, CENTRE)).toBeNull();
  });

  it("mismatches when the key belongs to another centre", () => {
    expect(receiptDetails([report], KEY, "DEMO-SONPUR-CHC")).toBe("mismatch");
  });

  it("hides a row whose drug or reason is not one of ours", () => {
    expect(receiptDetails([{ ...report, drug: "POISON" }], KEY, CENTRE)).toBeNull();
    expect(receiptDetails([{ ...report, reason: "hacked" }], KEY, CENTRE)).toBeNull();
  });
});

describe("isKnownCentreId", () => {
  const ids = ["DEMO-RAMPUR-1", "DEMO-SONPUR-CHC"];
  it("matches only an exact listed id", () => {
    expect(isKnownCentreId("DEMO-RAMPUR-1", ids)).toBe(true);
    expect(isKnownCentreId("DEMO-KALAPUR-2", ids)).toBe(false);
    expect(isKnownCentreId("demo-rampur-1", ids)).toBe(false);
    expect(isKnownCentreId("constructor", ids)).toBe(false);
    expect(isKnownCentreId("__proto__", ids)).toBe(false);
  });
});
