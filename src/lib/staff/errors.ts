import type { StaffFieldError } from "./form-state";
import type { StaffMessages } from "../../messages/staff";

export type RepoErrorCode = "notFound" | "forbidden" | "invalid" | "unavailable";

/** Map a RepoError code to a stable UI code. Unknown codes become "unavailable" and are not echoed. */
export function repoErrorCode(code: string): RepoErrorCode {
  switch (code) {
    case "not_found":
      return "notFound";
    case "forbidden":
      return "forbidden";
    case "invalid":
      return "invalid";
    default:
      return "unavailable";
  }
}

export function staffErrorText(err: StaffFieldError, t: StaffMessages): string {
  const seconds = err.seconds ?? 1;
  switch (err.code) {
    case "wrong":
      return t.wrong;
    case "tooMany":
      return t.tooMany(seconds);
    case "unauthorized":
      return t.errors.unauthorized;
    case "invalidVials":
      return t.errors.invalidVials;
    case "invalidReport":
      return t.errors.invalidReport;
    case "notFound":
      return t.errors.notFound;
    case "forbidden":
      return t.errors.forbidden;
    case "invalid":
      return t.errors.invalid;
    case "unavailable":
      return t.errors.unavailable;
    case "rate":
      return t.errors.rate(seconds);
    case "postedPartial":
      return t.postedPartial;
  }
}
