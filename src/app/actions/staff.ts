"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Drug } from "@/lib/centres";
import { config } from "@/lib/config";
import { rateLimit } from "@/lib/ratelimit";
import { repo, RepoError } from "@/lib/repo";
import { pinMatches } from "@/lib/session-core";
import { endStaffSession, getStaffCentre, startStaffSession } from "@/lib/session";
import { clientHash } from "@/lib/staff/client-hash";
import { repoErrorCode } from "@/lib/staff/errors";
import { staffError, staffOk, staffPartial, type StaffFormState, type StaffProof } from "@/lib/staff/form-state";
import { isCentreId, parseLogin } from "@/lib/staff/login";
import {
  CONFIRM_LIMIT,
  CONFIRM_WINDOW_MS,
  LOGIN_CENTRE_LIMIT,
  LOGIN_CLIENT_LIMIT,
  LOGIN_WINDOW_MS,
  POST_LIMIT,
  POST_WINDOW_MS,
  UNKNOWN_CENTRE_BUCKET,
  confirmRateKey,
  loginRateKeys,
  postRateKey,
  retrySeconds,
} from "@/lib/staff/limits";
import { parseReportKey } from "@/lib/staff/report-key";
import { parseStockForm } from "@/lib/staff/vials";

const DUMMY_PIN = "00000000";

function textField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

async function sessionCentre(): Promise<string | null> {
  const id = await getStaffCentre();
  return id && isCentreId(id) ? id : null;
}

/**
 * Count a failed login. Five failures per client+centre, and twenty per centre.
 * A correct PIN is not counted. The client hash is an in-memory key only.
 */
function rejectLogin(knownCentreId: string | null, hash: string): StaffFormState {
  const bucket = knownCentreId && isCentreId(knownCentreId) ? knownCentreId : UNKNOWN_CENTRE_BUCKET;
  const keys = loginRateKeys(hash, bucket);
  const client = rateLimit(keys.client, LOGIN_CLIENT_LIMIT, LOGIN_WINDOW_MS);
  if (!client.ok) {
    return staffError([{ code: "tooMany", seconds: retrySeconds(client.retryAfterSec, LOGIN_WINDOW_MS) }]);
  }
  if (bucket !== UNKNOWN_CENTRE_BUCKET) {
    const centre = rateLimit(keys.centre, LOGIN_CENTRE_LIMIT, LOGIN_WINDOW_MS);
    if (!centre.ok) {
      return staffError([{ code: "tooMany", seconds: retrySeconds(centre.retryAfterSec, LOGIN_WINDOW_MS) }]);
    }
  }
  return staffError([{ code: "wrong", href: "#centreId" }], ["centreId", "pin"]);
}

export async function login(_prev: StaffFormState, formData: FormData): Promise<StaffFormState> {
  const forwarded = (await headers()).get("x-forwarded-for");
  const hash = clientHash(forwarded);
  const parsed = parseLogin({
    centreId: textField(formData, "centreId"),
    pin: textField(formData, "pin"),
  });

  if (!parsed.ok) {
    pinMatches(parsed.pinAttempt, DUMMY_PIN);
    return rejectLogin(parsed.knownCentreId, hash);
  }

  const expected = config().centrePins.get(parsed.centreId);
  const matches = pinMatches(parsed.pin, expected ?? DUMMY_PIN);
  if (!expected || !matches) return rejectLogin(parsed.centreId, hash);

  await startStaffSession(parsed.centreId);
  redirect(`/staff/${parsed.centreId}`);
}

export async function logout(): Promise<void> {
  await endStaffSession();
  redirect("/staff");
}

export async function postStockAction(_prev: StaffFormState, formData: FormData): Promise<StaffFormState> {
  const centreId = await sessionCentre();
  if (!centreId) return staffError([{ code: "unauthorized" }]);

  const parsed = parseStockForm({ asv: formData.get("asv"), arv: formData.get("arv") });
  if (!parsed.ok) {
    const href = parsed.fields[0] ? `#${parsed.fields[0]}` : undefined;
    return staffError([{ code: "invalidVials", href }], parsed.fields);
  }

  const plan: { drug: Drug; vials: number }[] = [
    { drug: "ASV", vials: parsed.ASV },
    { drug: "ARV", vials: parsed.ARV },
  ];
  const proofs: StaffProof[] = [];

  for (const item of plan) {
    const gate = rateLimit(postRateKey(centreId), POST_LIMIT, POST_WINDOW_MS);
    if (!gate.ok) {
      const rate = { code: "rate" as const, seconds: retrySeconds(gate.retryAfterSec, POST_WINDOW_MS) };
      if (proofs.length) {
        revalidatePath(`/staff/${centreId}`);
        return staffPartial([{ code: "postedPartial" }, rate], proofs);
      }
      return staffError([rate]);
    }
    try {
      const result = await repo().postStock(centreId, item.drug, item.vials);
      const key = parseReportKey(result.entityKey);
      if (key) proofs.push({ kind: item.drug, key });
    } catch (err) {
      const code = repoErrorCode(err instanceof RepoError ? err.code : "");
      if (proofs.length) {
        revalidatePath(`/staff/${centreId}`);
        return staffPartial([{ code: "postedPartial" }, { code }], proofs);
      }
      return staffError([{ code }]);
    }
  }

  revalidatePath(`/staff/${centreId}`);
  return staffOk("posted", proofs);
}

export async function confirmReportAction(_prev: StaffFormState, formData: FormData): Promise<StaffFormState> {
  const centreId = await sessionCentre();
  if (!centreId) return staffError([{ code: "unauthorized" }]);

  const key = parseReportKey(formData.get("reportKey"));
  if (!key) return staffError([{ code: "invalidReport", href: "#inbox" }], ["reportKey"]);

  const gate = rateLimit(confirmRateKey(centreId), CONFIRM_LIMIT, CONFIRM_WINDOW_MS);
  if (!gate.ok) return staffError([{ code: "rate", seconds: retrySeconds(gate.retryAfterSec, CONFIRM_WINDOW_MS) }]);

  try {
    const result = await repo().confirmReport(centreId, key);
    const proof = parseReportKey(result.entityKey) ?? key;
    revalidatePath(`/staff/${centreId}`);
    return staffOk("confirmed", [{ kind: "report", key: proof }]);
  } catch (err) {
    return staffError([{ code: repoErrorCode(err instanceof RepoError ? err.code : "") }]);
  }
}
