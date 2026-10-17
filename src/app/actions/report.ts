"use server";

import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { ipHeaderForLimit } from "@/lib/client-ip";
import { clientLimitKey, centreLimitKey } from "@/lib/family/client-key";
import { FAMILY_LIMITS } from "@/lib/family/limits";
import { receiptPath } from "@/lib/family/receipt";
import { parseReportInput } from "@/lib/family/report-input";
import type { ReportFormState } from "@/lib/family/report-state";
import { rateLimit } from "@/lib/ratelimit";
import { repo, RepoError } from "@/lib/repo";

function fromRepo(error: RepoError): ReportFormState {
  if (error.code === "not_found") return { status: "error", code: "not_found", fields: ["centreId"] };
  if (error.code === "forbidden") return { status: "error", code: "forbidden", fields: [] };
  if (error.code === "invalid") return { status: "error", code: "invalid", fields: [] };
  return { status: "error", code: "unavailable", fields: [] };
}

export async function fileFamilyReport(_prev: ReportFormState, formData: FormData): Promise<ReportFormState> {
  const parsed = parseReportInput({
    drug: formData.get("drug"),
    reason: formData.get("reason"),
    centreId: formData.get("centreId"),
  });
  if (!parsed.ok) return { status: "error", code: "validation", fields: parsed.fields };

  try {
    const snap = await repo().snapshot();
    if (!snap.centres.some((centre) => centre.centreId === parsed.data.centreId)) {
      return { status: "error", code: "not_found", fields: ["centreId"] };
    }
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof RepoError) return fromRepo(error);
    return { status: "error", code: "unavailable", fields: [] };
  }

  // Hashed here and kept only in the in-memory limiter. The raw address is not logged.
  const headerList = await headers();
  const clientKey = clientLimitKey(
    ipHeaderForLimit({ realIp: headerList.get("x-real-ip"), forwardedFor: headerList.get("x-forwarded-for") }),
  );
  if (!rateLimit(clientKey, FAMILY_LIMITS.perClient.limit, FAMILY_LIMITS.perClient.windowMs).ok) {
    return { status: "error", code: "rate_client", fields: [] };
  }
  const centreKey = centreLimitKey(parsed.data.centreId);
  if (!centreKey) return { status: "error", code: "invalid", fields: ["centreId"] };
  if (!rateLimit(centreKey, FAMILY_LIMITS.perCentre.limit, FAMILY_LIMITS.perCentre.windowMs).ok) {
    return { status: "error", code: "rate_centre", fields: [] };
  }

  try {
    const written = await repo().fileReport(parsed.data.centreId, parsed.data.drug, parsed.data.reason);
    const path = receiptPath(written.entityKey, parsed.data.centreId, written.txHash);
    if (!path) return { status: "error", code: "invalid", fields: [] };
    redirect(path);
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof RepoError) return fromRepo(error);
    return { status: "error", code: "unavailable", fields: [] };
  }
}
