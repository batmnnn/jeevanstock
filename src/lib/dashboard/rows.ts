import type { Drug, Reason } from "../centres";
import { isValidVials } from "../domain";

const CENTRE_ID = /^[A-Z0-9-]{3,40}$/;
const ADDR = /^0x[0-9a-fA-F]{40}$/;
const DRUGS: readonly Drug[] = ["ASV", "ARV"];
const REASONS: readonly Reason[] = ["out", "no_doctor", "closed"];
const STATUSES = ["in", "low", "out"] as const;

export interface RegistryCentre {
  key: string;
  centreId: string;
  name: string;
  district: string;
  state: string;
  wallet: string;
}

export interface ProofSource {
  key: string;
  kind: string;
  attributes: Readonly<Record<string, string>>;
}

export type ProofFact =
  | { id: "centre"; name: string }
  | { id: "centreId"; centreId: string }
  | { id: "district"; value: string }
  | { id: "state"; value: string }
  | { id: "drug"; drug: Drug }
  | { id: "vials"; vials: number }
  | { id: "status"; status: (typeof STATUSES)[number] }
  | { id: "reason"; reason: Reason }
  | { id: "posted"; unix: number }
  | { id: "when"; bucket: number }
  | { id: "wallet"; address: string };

function intIn(v: string | undefined, min: number, max: number): number | null {
  if (typeof v !== "string" || !/^\d+$/.test(v)) return null;
  if (v.length > 1 && v.startsWith("0")) return null;
  const n = Number(v);
  if (!Number.isSafeInteger(n) || n < min || n > max) return null;
  return n;
}

function matchCentre(proof: ProofSource, centres: readonly RegistryCentre[]): RegistryCentre | undefined {
  if (proof.kind === "centre") {
    const byKey = centres.find((c) => c.key.toLowerCase() === proof.key.toLowerCase());
    if (byKey) return byKey;
  }
  const id = proof.attributes.centreId;
  if (typeof id === "string" && CENTRE_ID.test(id)) return centres.find((c) => c.centreId === id);
  return undefined;
}

/**
 * Plain facts for a proof card. Names, district and wallet come from the trusted registry,
 * never from a free-text attribute. Unknown or hostile attributes are dropped.
 */
export function proofFacts(proof: ProofSource, centres: readonly RegistryCentre[]): ProofFact[] {
  const rows: ProofFact[] = [];
  const centre = matchCentre(proof, centres);
  const claimedId = proof.attributes.centreId;
  if (centre) {
    rows.push({ id: "centre", name: centre.name });
    if (centre.district) rows.push({ id: "district", value: centre.district });
    if (centre.state) rows.push({ id: "state", value: centre.state });
  } else if (typeof claimedId === "string" && CENTRE_ID.test(claimedId)) {
    rows.push({ id: "centreId", centreId: claimedId });
  }

  const a = proof.attributes;
  if (proof.kind === "stock" || proof.kind === "report") {
    const drug = DRUGS.find((d) => d === a.drug);
    if (drug) rows.push({ id: "drug", drug });
  }
  if (proof.kind === "stock") {
    const vials = intIn(a.vials, 0, 999);
    if (vials !== null && isValidVials(vials)) rows.push({ id: "vials", vials });
    if (STATUSES.some((s) => s === a.status)) rows.push({ id: "status", status: a.status as (typeof STATUSES)[number] });
    const posted = intIn(a.postedAt, 1_000_000_000, 4_102_444_800);
    if (posted !== null) rows.push({ id: "posted", unix: posted });
  }
  if (proof.kind === "report") {
    const reason = REASONS.find((r) => r === a.reason);
    if (reason) rows.push({ id: "reason", reason });
    const bucket = intIn(a.hourBucket, 0, 20_000_000);
    if (bucket !== null) rows.push({ id: "when", bucket });
  }

  if (proof.kind === "centre") {
    const wallet = centre && ADDR.test(centre.wallet) ? centre.wallet : ADDR.test(a.wallet ?? "") ? a.wallet : null;
    if (wallet) rows.push({ id: "wallet", address: wallet });
  }

  return rows;
}
