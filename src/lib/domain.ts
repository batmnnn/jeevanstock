// Pure domain logic. No I/O, no SDK, no React — everything here is unit-tested.
import type { Drug, Reason } from "./centres";

export type StockStatus = "in" | "low" | "out" | "stale" | "sent";

export const BLOCK_SECONDS = 2;
export const STOCK_TTL_HOURS = 6;
export const REPORT_TTL_HOURS = 48;
export const CONFIRMED_TTL_DAYS = 30;
export const LOW_THRESHOLD = 5;
export const MAX_VIALS = 999;

export const blocksForHours = (h: number) => (h * 3600) / BLOCK_SECONDS;
export const REPORT_TTL_BLOCKS = blocksForHours(REPORT_TTL_HOURS);

export interface Centre {
  key: string;
  centreId: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  /** Registered signing wallet; the only creator whose stock posts are trusted. */
  wallet: string;
  creator: string;
}

export interface StockPost {
  key: string;
  centreId: string;
  drug: Drug;
  vials: number;
  status: Exclude<StockStatus, "stale" | "sent">;
  postedAt: number; // unix seconds
  creator: string;
  createdAtBlock: number;
  expiresAtBlock: number;
}

export interface Report {
  key: string;
  centreId: string;
  drug: Drug;
  reason: Reason;
  hourBucket: number; // unix hours
  creator: string;
  createdAtBlock: number;
  expiresAtBlock: number;
}

/** Centre-signed acknowledgement. Lifetime of the report is not evidence — anyone may extend it. */
export interface Ack {
  key: string;
  centreId: string;
  reportKey: string;
  creator: string;
  createdAtBlock: number;
  expiresAtBlock: number;
}

export interface DrugStock {
  drug: Drug;
  status: StockStatus;
  vials: number | null;
  postedAt: number | null;
  postKey: string | null;
}

export const statusForVials = (vials: number): Exclude<StockStatus, "stale" | "sent"> =>
  vials <= 0 ? "out" : vials < LOW_THRESHOLD ? "low" : "in";

export function isValidVials(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= MAX_VIALS;
}

const sameAddr = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/**
 * Only posts whose on-chain creator equals the centre's registered wallet are trusted.
 * Anything else is a spoof attempt and is dropped.
 */
export function trustedPosts(centre: Pick<Centre, "centreId" | "wallet">, posts: StockPost[]): StockPost[] {
  return posts.filter((p) => p.centreId === centre.centreId && sameAddr(p.creator, centre.wallet));
}

/** Latest live trusted post per drug. A drug with no live post is "stale" (expired after 6h). */
export function latestStock(
  centre: Pick<Centre, "centreId" | "wallet">,
  posts: StockPost[],
  nowSec: number,
  drugs: readonly Drug[] = ["ASV", "ARV"],
): DrugStock[] {
  const trusted = trustedPosts(centre, posts);
  return drugs.map((drug) => {
    const live = trusted
      .filter((p) => p.drug === drug && nowSec - p.postedAt < STOCK_TTL_HOURS * 3600 && p.postedAt <= nowSec + 300)
      .sort((a, b) => b.postedAt - a.postedAt || b.createdAtBlock - a.createdAtBlock);
    const p = live[0];
    if (!p) return { drug, status: "stale", vials: null, postedAt: null, postKey: null };
    return { drug, status: statusForVials(p.vials), vials: p.vials, postedAt: p.postedAt, postKey: p.key };
  });
}

/** Centres listed on the board must have been created by the admin wallet. */
export function trustedCentres<T extends Pick<Centre, "creator">>(centres: readonly T[], admin: string): T[] {
  return centres.filter((c) => sameAddr(c.creator, admin));
}

/**
 * A report is acknowledged only when this centre's registered wallet created an ack
 * naming that report. A longer expiry is not enough: reports are permissionlessly extendable.
 */
export function isAcknowledged(
  reportKey: string,
  acks: readonly Pick<Ack, "reportKey" | "centreId" | "creator">[],
  centre: Pick<Centre, "centreId" | "wallet">,
): boolean {
  if (!reportKey) return false;
  const want = reportKey.toLowerCase();
  return acks.some(
    (a) => a.centreId === centre.centreId && a.reportKey.toLowerCase() === want && sameAddr(a.creator, centre.wallet),
  );
}

export function trustedReports(reports: Report[], payer: string): Report[] {
  return reports.filter((r) => sameAddr(r.creator, payer));
}

/** Great-circle distance in km. */
export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

const STATUS_RANK: Record<StockStatus, number> = { in: 0, low: 1, sent: 2, stale: 3, out: 4 };

/** Later ISO date first. A missing date sorts after a real one. */
export function compareSupplyDateDesc(a?: string | null, b?: string | null): number {
  const as = a && /^\d{4}-\d{2}-\d{2}$/.test(a) ? a : "";
  const bs = b && /^\d{4}-\d{2}-\d{2}$/.test(b) ? b : "";
  if (as === bs) return 0;
  if (!as) return 1;
  if (!bs) return -1;
  return as < bs ? 1 : -1;
}

/** Shelf count first, then the newest shipment, then no evidence, then a known empty shelf. */
export function rankCentres<T extends { name: string; status: StockStatus; distanceKm?: number | null; suppliedOn?: string | null }>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) =>
      STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
      compareSupplyDateDesc(a.suppliedOn, b.suppliedOn) ||
      (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity) ||
      a.name.localeCompare(b.name),
  );
}

/** Coarse "x min ago" bucket used in the UI; returns minutes, clamped at 0. */
export const minutesAgo = (postedAt: number, nowSec: number) => Math.max(0, Math.floor((nowSec - postedAt) / 60));

export const hourBucket = (nowMs: number) => Math.floor(nowMs / 3_600_000);
