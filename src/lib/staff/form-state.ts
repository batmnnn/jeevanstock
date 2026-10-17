// Serializable result of a staff Server Action. Codes only — never a PIN, key, or repo message.

export type StaffErrorCode =
  | "wrong"
  | "tooMany"
  | "unauthorized"
  | "invalidVials"
  | "invalidReport"
  | "notFound"
  | "forbidden"
  | "invalid"
  | "unavailable"
  | "rate"
  | "postedPartial";

export interface StaffFieldError {
  code: StaffErrorCode;
  href?: string;
  seconds?: number;
}

export interface StaffProof {
  kind: "ASV" | "ARV" | "report";
  key: string;
}

export interface StaffFormState {
  status: "idle" | "error" | "ok";
  errors: StaffFieldError[];
  /** Field ids that should be marked aria-invalid. */
  invalid: string[];
  proofs: StaffProof[];
  ok: "posted" | "confirmed" | null;
}

export const IDLE_STAFF_FORM: StaffFormState = {
  status: "idle",
  errors: [],
  invalid: [],
  proofs: [],
  ok: null,
};

export function staffError(errors: StaffFieldError[], invalid: string[] = []): StaffFormState {
  return { status: "error", errors, invalid, proofs: [], ok: null };
}

export function staffPartial(errors: StaffFieldError[], proofs: StaffProof[]): StaffFormState {
  return { status: "error", errors, invalid: [], proofs, ok: null };
}

export function staffOk(ok: "posted" | "confirmed", proofs: StaffProof[]): StaffFormState {
  return { status: "ok", errors: [], invalid: [], proofs, ok };
}
