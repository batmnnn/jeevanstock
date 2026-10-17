import type { Drug, Reason } from "@/lib/centres";

export const REPORT_FIELD_ORDER = ["drug", "reason", "centreId"] as const;
export type ReportField = (typeof REPORT_FIELD_ORDER)[number];

export type ReportErrorCode =
  | "validation"
  | "rate_client"
  | "rate_centre"
  | "not_found"
  | "forbidden"
  | "invalid"
  | "unavailable";

export interface ReportInput {
  drug: Drug;
  reason: Reason;
  centreId: string;
}

export type ReportFormState =
  | { status: "idle" }
  | { status: "error"; code: ReportErrorCode; fields: ReportField[] };

export const IDLE_REPORT_STATE: ReportFormState = { status: "idle" };

export interface ReportErrorItem {
  field: ReportField | null;
  code: ReportErrorCode;
}

/** Stable, user-facing error list. Empty validation falls back to a generic invalid message. */
export function reportErrorItems(state: ReportFormState): ReportErrorItem[] {
  if (state.status !== "error") return [];
  if (state.code === "validation") {
    const fields = REPORT_FIELD_ORDER.filter((f) => state.fields.includes(f));
    if (fields.length === 0) return [{ field: null, code: "invalid" }];
    return fields.map((field) => ({ field, code: "validation" as const }));
  }
  return [{ field: null, code: state.code }];
}
