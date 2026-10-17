import { z } from "zod";

/** Public entity key shape used for report confirms and proof links. */
const reportKeySchema = z.string().regex(/^0x[0-9a-fA-F]{1,64}$/);

export function parseReportKey(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length < 3 || raw.length > 66) return null;
  const parsed = reportKeySchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}
