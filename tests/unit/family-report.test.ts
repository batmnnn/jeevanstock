import { describe, expect, it } from "vitest";
import { parseReportInput } from "@/lib/family/report-input";
import { reportErrorItems } from "@/lib/family/report-state";

const ok = { drug: "ASV", reason: "out", centreId: "DEMO-RAMPUR-1" };

describe("parseReportInput", () => {
  it("accepts a real report", () => {
    expect(parseReportInput(ok)).toEqual({ ok: true, data: ok });
  });

  it("trims harmless whitespace and drops extra fields", () => {
    const parsed = parseReportInput({ drug: " ARV ", reason: " no_doctor ", centreId: " DEMO-SONPUR-CHC " });
    expect(parsed).toEqual({ ok: true, data: { drug: "ARV", reason: "no_doctor", centreId: "DEMO-SONPUR-CHC" } });
    if (parsed.ok) expect(Object.keys(parsed.data).sort()).toEqual(["centreId", "drug", "reason"]);
  });

  it.each(["out", "no_doctor", "closed"] as const)("accepts reason %s", (reason) => {
    expect(parseReportInput({ ...ok, reason }).ok).toBe(true);
  });

  it.each([
    "asv",
    "Asv",
    "ASV\nARV",
    "POISON",
    "",
    " ",
    "<script>",
    "javascript:alert(1)",
    "ASV;DROP",
    null,
    undefined,
    1,
    ["ASV"],
    { toString: () => "ASV" },
  ])("rejects drug %j", (drug) => {
    const parsed = parseReportInput({ ...ok, drug });
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.fields).toContain("drug");
  });

  it("accepts a trailing newline on an otherwise valid drug", () => {
    expect(parseReportInput({ ...ok, drug: "ASV\n" })).toEqual({ ok: true, data: ok });
  });

  it.each(["out ", " no_doctor", "closed\n"])("trims reason %j", (reason) => {
    expect(parseReportInput({ ...ok, reason }).ok).toBe(true);
  });

  it.each([
    "hacked",
    "out/../",
    "OUT",
    "no-doctor",
    "no doctor",
    "",
    null,
    0,
    ["out"],
    "<img>",
  ])("rejects reason %j", (reason) => {
    const parsed = parseReportInput({ ...ok, reason });
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.fields).toContain("reason");
  });

  it.each([
    "demo-rampur-1",
    "DEMO RAMPUR",
    "DEMO-RAMPUR-1/../admin",
    "../DEMO-RAMPUR-1",
    "../../etc/passwd",
    "DEMO-RAMPUR-1<script>",
    "DEMO-रामपुर",
    "AB",
    "A",
    "A".repeat(41),
    "__PROTO__",
    "constructor",
    "toString",
    "DEMO-RAMPUR-1\0",
    "DEMO-RAMPUR-1\nASV",
    "",
    null,
    12,
    ["DEMO-RAMPUR-1"],
    "javascript:alert(1)",
  ])("rejects centre id %j", (centreId) => {
    const parsed = parseReportInput({ ...ok, centreId });
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.fields).toContain("centreId");
  });

  it("accepts a 40-character id and rejects 41", () => {
    const id = `A${"B".repeat(39)}`;
    expect(parseReportInput({ ...ok, centreId: id })).toEqual({ ok: true, data: { ...ok, centreId: id } });
    expect(parseReportInput({ ...ok, centreId: `${id}C` }).ok).toBe(false);
  });

  it("names every field when the whole body is junk", () => {
    const parsed = parseReportInput({ drug: null, reason: { bad: true }, centreId: 1 });
    expect(parsed).toEqual({ ok: false, fields: ["drug", "reason", "centreId"] });
  });
});

describe("reportErrorItems", () => {
  it("is empty while idle", () => {
    expect(reportErrorItems({ status: "idle" })).toEqual([]);
  });

  it("lists field errors in drug, reason, centre order", () => {
    expect(reportErrorItems({ status: "error", code: "validation", fields: ["reason", "drug", "centreId"] })).toEqual([
      { field: "drug", code: "validation" },
      { field: "reason", code: "validation" },
      { field: "centreId", code: "validation" },
    ]);
  });

  it("falls back when validation names no field", () => {
    expect(reportErrorItems({ status: "error", code: "validation", fields: [] })).toEqual([{ field: null, code: "invalid" }]);
  });

  it.each(["rate_client", "rate_centre", "not_found", "forbidden", "invalid", "unavailable"] as const)("surfaces %s", (code) => {
    expect(reportErrorItems({ status: "error", code, fields: [] })).toEqual([{ field: null, code }]);
  });
});
