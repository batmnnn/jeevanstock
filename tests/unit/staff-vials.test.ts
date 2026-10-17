import { describe, expect, it } from "vitest";
import { MAX_VIALS } from "@/lib/domain";
import { parseStockForm, parseVial, stepVial } from "@/lib/staff/vials";

describe("parseVial", () => {
  it.each([0, 1, 5, 999, 999.0])("accepts number %s", (v) => expect(parseVial(v)).toBe(v));
  it.each(["0", "7", "42", "999"])("accepts string %s", (v) => expect(parseVial(v)).toBe(Number(v)));

  it.each([
    -1,
    1000,
    1.5,
    1e9,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.MAX_SAFE_INTEGER,
    Number.MAX_VALUE,
  ])("rejects number %s", (v) => expect(parseVial(v)).toBeNull());

  it.each([
    "1e9",
    "1e2",
    "1.5",
    "10.0",
    "10.",
    ".5",
    "-1",
    "+1",
    "+10",
    " 1",
    "1 ",
    "08",
    "00",
    "0x10",
    "0b1",
    "0o7",
    "",
    "9999",
    "1".repeat(100),
    "१२",
    "12\n",
    " 12",
    "1e1",
  ])("rejects string %j", (v) => expect(parseVial(v)).toBeNull());

  it.each([null, undefined, true, false, [], {}, new Number(5), () => 5])("rejects non-numeric %j", (v) => {
    expect(parseVial(v)).toBeNull();
  });

  it("rejects a file upload and an oversized digit string", () => {
    expect(parseVial(new File(["12"], "v.txt"))).toBeNull();
    expect(parseVial("9".repeat(10_000))).toBeNull();
    expect(MAX_VIALS).toBe(999);
  });
});

describe("parseStockForm", () => {
  it("accepts both drugs", () => {
    expect(parseStockForm({ asv: "0", arv: "999" })).toEqual({ ok: true, ASV: 0, ARV: 999 });
    expect(parseStockForm({ asv: 12, arv: 4 })).toEqual({ ok: true, ASV: 12, ARV: 4 });
  });

  it("names only the fields that fail", () => {
    expect(parseStockForm({ asv: "1e9", arv: 12 })).toEqual({ ok: false, fields: ["asv"] });
    expect(parseStockForm({ asv: "5", arv: "1000" })).toEqual({ ok: false, fields: ["arv"] });
    expect(parseStockForm({ asv: -1, arv: 1.5 })).toEqual({ ok: false, fields: ["asv", "arv"] });
    expect(parseStockForm({ asv: "1".repeat(1000), arv: {} })).toEqual({ ok: false, fields: ["asv", "arv"] });
  });
});

describe("stepVial", () => {
  it("steps inside 0..999 and ignores other deltas", () => {
    expect(stepVial(0, -1)).toBe(0);
    expect(stepVial(999, 1)).toBe(999);
    expect(stepVial(4, 1)).toBe(5);
    expect(stepVial(5, -1)).toBe(4);
    expect(stepVial(10, 5)).toBe(10);
    expect(stepVial(10, 0)).toBe(10);
    expect(stepVial(Number.NaN, 1)).toBe(1);
    expect(stepVial(1.5, 1)).toBe(1);
    expect(stepVial(-3, -1)).toBe(0);
    expect(stepVial(1e9, -1)).toBe(0);
  });
});
