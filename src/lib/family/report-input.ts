import { z } from "zod";
import { CENTRE_ID_RE } from "./ids";
import { REPORT_FIELD_ORDER, type ReportField, type ReportInput } from "./report-state";

const schema = z.object({
  drug: z.enum(["ASV", "ARV"]),
  reason: z.enum(["out", "no_doctor", "closed"]),
  centreId: z.string().regex(CENTRE_ID_RE),
});

function asShortString(v: unknown, max: number): unknown {
  if (typeof v !== "string") return v;
  const trimmed = v.trim();
  if (trimmed.length === 0 || trimmed.length > max) return "";
  return trimmed;
}

export type ParsedReport =
  | { ok: true; data: ReportInput }
  | { ok: false; fields: ReportField[] };

/** Shape check only. The action still checks that the centre exists. */
export function parseReportInput(input: { drug: unknown; reason: unknown; centreId: unknown }): ParsedReport {
  const parsed = schema.safeParse({
    drug: asShortString(input.drug, 8),
    reason: asShortString(input.reason, 20),
    centreId: asShortString(input.centreId, 40),
  });
  if (!parsed.success) {
    const found = new Set<ReportField>();
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "drug" || key === "reason" || key === "centreId") found.add(key);
    }
    const fields = REPORT_FIELD_ORDER.filter((f) => found.has(f));
    return { ok: false, fields: fields.length > 0 ? [...fields] : [...REPORT_FIELD_ORDER] };
  }
  return {
    ok: true,
    data: { drug: parsed.data.drug, reason: parsed.data.reason, centreId: parsed.data.centreId },
  };
}
