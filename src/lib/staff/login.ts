import { z } from "zod";
import { CENTRES } from "../centres";

export type StaffCentreId = (typeof CENTRES)[number]["centreId"];

const pinSchema = z.string().regex(/^\d{4,8}$/);

export function isCentreId(v: unknown): v is StaffCentreId {
  if (typeof v !== "string" || v.length > 64) return false;
  return CENTRES.some((c) => c.centreId === v);
}

export function centreName(id: string): string | null {
  if (!isCentreId(id)) return null;
  return CENTRES.find((c) => c.centreId === id)?.name ?? null;
}

export type LoginParse =
  | { ok: true; centreId: StaffCentreId; pin: string }
  | { ok: false; knownCentreId: StaffCentreId | null; pinAttempt: string };

function readProp(raw: unknown, key: string): unknown {
  if (!raw || typeof raw !== "object") return undefined;
  try {
    return (raw as Record<string, unknown>)[key];
  } catch {
    return undefined;
  }
}

/**
 * Accept only a known centre and a 4–8 digit PIN string.
 * A failed parse still returns the centre id when it is real, so the caller can
 * rate-limit that centre. Oversized PINs are dropped and not returned.
 */
export function parseLogin(raw: unknown): LoginParse {
  const centreId = readProp(raw, "centreId");
  const pin = readProp(raw, "pin");
  const knownCentreId = isCentreId(centreId) ? centreId : null;
  const pinAttempt = typeof pin === "string" && pin.length <= 8 ? pin : "";
  if (!knownCentreId) return { ok: false, knownCentreId: null, pinAttempt };
  const parsed = pinSchema.safeParse(pin);
  if (!parsed.success) return { ok: false, knownCentreId, pinAttempt };
  return { ok: true, centreId: knownCentreId, pin: parsed.data };
}
