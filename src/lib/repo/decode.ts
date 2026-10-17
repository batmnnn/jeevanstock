// Pure decoders from raw Arkiv entities into domain rows. Anything malformed is dropped, never thrown:
// the chain is public and anyone can write entities with our `app` attribute.
import type { Drug, Reason } from "../centres";
import { readAttrName } from "../chain-attrs";
import { isValidVials, statusForVials, type Ack, type Centre, type Report, type StockPost } from "../domain";

export interface RawEntity {
  key?: string;
  creator?: string;
  owner?: string;
  createdAt?: bigint;
  expiresAt?: bigint;
  attributes?: Readonly<Record<string, { type: string; value: unknown } | unknown>>;
  payload?: Uint8Array;
}

const DRUGS: readonly Drug[] = ["ASV", "ARV"];
const REASONS: readonly Reason[] = ["out", "no_doctor", "closed"];
const ID_RE = /^[A-Z0-9-]{3,40}$/;
const ADDR_RE = /^0x[0-9a-fA-F]{40}$/;
const KEY_RE = /^0x[0-9a-fA-F]{64}$/;
const LABEL_MAX = 80;

/** Unwrap `{type, value}` attribute cells to plain JS values. */
export function attrs(e: RawEntity): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(e.attributes ?? {})) {
    out[readAttrName(k)] = v && typeof v === "object" && "value" in (v as object) ? (v as { value: unknown }).value : v;
  }
  return out;
}

const str = (v: unknown) => (typeof v === "string" ? v : undefined);
/** Chain text is untrusted. Drop control characters and cap the length before it reaches the UI. */
const label = (v: unknown): string | undefined => {
  const s = str(v);
  if (!s) return undefined;
  const clean = s.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!clean) return undefined;
  return clean.slice(0, LABEL_MAX);
};
const num = (v: unknown): number | undefined => {
  if (typeof v === "bigint") return v <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(v) : undefined;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return undefined;
};
const base = (e: RawEntity) =>
  e.key && e.creator && e.createdAt !== undefined && e.expiresAt !== undefined
    ? { key: e.key, creator: e.creator, createdAtBlock: Number(e.createdAt), expiresAtBlock: Number(e.expiresAt) }
    : null;

export function decodeCentre(e: RawEntity): Centre | null {
  const a = attrs(e);
  const centreId = str(a.centreId), wallet = str(a.wallet), district = label(a.district), state = label(a.state);
  if (!e.key || !e.creator || !centreId || !ID_RE.test(centreId) || !wallet || !ADDR_RE.test(wallet) || !district || !state) return null;
  let p: { name?: unknown; lat?: unknown; lon?: unknown } = {};
  try {
    p = e.payload && e.payload.length ? JSON.parse(new TextDecoder().decode(e.payload)) : {};
  } catch {
    return null;
  }
  const name = label(p.name), lat = num(p.lat), lon = num(p.lon);
  if (!name || lat === undefined || lon === undefined || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { key: e.key, centreId, name, district, state, lat, lon, wallet, creator: e.creator };
}

export function decodeStock(e: RawEntity): StockPost | null {
  const b = base(e);
  const a = attrs(e);
  const centreId = str(a.centreId), drug = str(a.drug) as Drug | undefined, vials = num(a.vials), postedAt = num(a.postedAt);
  if (!b || !centreId || !drug || !DRUGS.includes(drug) || !isValidVials(vials) || postedAt === undefined) return null;
  return { ...b, centreId, drug, vials, status: statusForVials(vials), postedAt };
}

export function decodeAck(e: RawEntity): Ack | null {
  const b = base(e);
  const a = attrs(e);
  const centreId = str(a.centreId);
  const reportKey = str(a.reportKey);
  if (!b || !centreId || !ID_RE.test(centreId) || !reportKey || !KEY_RE.test(reportKey)) return null;
  return { ...b, centreId, reportKey };
}

export function decodeReport(e: RawEntity): Report | null {
  const b = base(e);
  const a = attrs(e);
  const centreId = str(a.centreId), drug = str(a.drug) as Drug | undefined, reason = str(a.reason) as Reason | undefined, hb = num(a.hourBucket);
  if (!b || !centreId || !drug || !DRUGS.includes(drug) || !reason || !REASONS.includes(reason) || hb === undefined) return null;
  return { ...b, centreId, drug, reason, hourBucket: hb };
}

export const compact = <T,>(xs: (T | null)[]): T[] => xs.filter((x): x is T => x !== null);
