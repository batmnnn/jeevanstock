import type { Centre } from "../domain";

const ADDR = /^0x[0-9a-fA-F]{40}$/;
const CENTRE_ID = /^[A-Z0-9-]{3,40}$/;

export type TrustCode =
  | "stock-centre"
  | "report-payer"
  | "centre-admin"
  | "ack-centre"
  | "unknown-kind"
  | "unknown-centre"
  | "creator-mismatch";

export interface TrustVerdict {
  trusted: boolean;
  code: TrustCode;
}

export interface TrustProof {
  kind: string;
  creator: string;
  attributes: Readonly<Record<string, string>>;
}

export interface TrustSnapshot {
  admin: string;
  payer: string;
  centres: readonly Pick<Centre, "centreId" | "wallet" | "creator">[];
}

function sameAddr(a: string, b: string): boolean {
  return ADDR.test(a) && ADDR.test(b) && a.toLowerCase() === b.toLowerCase();
}

const REPORT_KEY = /^0x[0-9a-fA-F]{64}$/;

/** A centre counts only when the admin wallet created the registry row. */
function registered(snapshot: TrustSnapshot, centreId: string) {
  return snapshot.centres.find((c) => c.centreId === centreId && sameAddr(c.creator, snapshot.admin));
}

export function displayAddress(value: string): string | null {
  return typeof value === "string" && ADDR.test(value) ? value : null;
}

/**
 * Trust for one raw entity, using the same rules as the board:
 * stock counts only from that centre's registered wallet, reports only from the payer,
 * centres only from the admin. Anything else is ignored.
 */
export function trustVerdict(proof: TrustProof, snapshot: TrustSnapshot): TrustVerdict {
  if (proof.kind === "stock") {
    const id = proof.attributes.centreId;
    if (typeof id !== "string" || !CENTRE_ID.test(id)) return { trusted: false, code: "unknown-centre" };
    const centre = registered(snapshot, id);
    if (!centre) return { trusted: false, code: "unknown-centre" };
    if (!sameAddr(proof.creator, centre.wallet)) return { trusted: false, code: "creator-mismatch" };
    return { trusted: true, code: "stock-centre" };
  }
  if (proof.kind === "report") {
    if (!sameAddr(proof.creator, snapshot.payer)) return { trusted: false, code: "creator-mismatch" };
    return { trusted: true, code: "report-payer" };
  }
  if (proof.kind === "centre") {
    if (!sameAddr(proof.creator, snapshot.admin)) return { trusted: false, code: "creator-mismatch" };
    return { trusted: true, code: "centre-admin" };
  }
  if (proof.kind === "ack") {
    const id = proof.attributes.centreId;
    const reportKey = proof.attributes.reportKey;
    if (typeof id !== "string" || !CENTRE_ID.test(id)) return { trusted: false, code: "unknown-centre" };
    if (typeof reportKey !== "string" || !REPORT_KEY.test(reportKey)) return { trusted: false, code: "unknown-kind" };
    const centre = registered(snapshot, id);
    if (!centre) return { trusted: false, code: "unknown-centre" };
    if (!sameAddr(proof.creator, centre.wallet)) return { trusted: false, code: "creator-mismatch" };
    return { trusted: true, code: "ack-centre" };
  }
  return { trusted: false, code: "unknown-kind" };
}

/** Shell snippet for the public read script. Refuses to echo a value that is not an address. */
export function readCommand(admin: string): string {
  if (displayAddress(admin)) return `ADMIN_ADDR=${admin} npm run read`;
  return "ADMIN_ADDR=0x… npm run read";
}
