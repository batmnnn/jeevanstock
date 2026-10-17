// Pure domain logic. No I/O, no SDK, no React — everything here is unit-tested.
import type { Drug, Reason } from "./centres";

export type StockStatus = "in" | "low" | "out" | "stale";

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
  status: Exclude<StockStatus, "stale">;
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

export interface DrugStock {
  drug: Drug;
  status: StockStatus;
  vials: number | null;
  postedAt: number | null;
  postKey: string | null;
}

export const statusForVials = (vials: number): Exclude<StockStatus, "stale"> =>
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

/** A report whose lifetime exceeds the original 48h window was extended by the centre (acknowledged). */
export function isAcknowledged(r: Pick<Report, "createdAtBlock" | "expiresAtBlock">): boolean {
  return r.expiresAtBlock - r.createdAtBlock > REPORT_TTL_BLOCKS * 1.5;
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

const STATUS_RANK: Record<StockStatus, number> = { in: 0, low: 1, stale: 2, out: 3 };

/** Sort centres for a family: usable stock first, then by distance (if known), then by name. */
export function rankCentres<T extends { name: string; status: StockStatus; distanceKm?: number | null }>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) =>
      STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
      (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity) ||
      a.name.localeCompare(b.name),
  );
}

/** Coarse "x min ago" bucket used in the UI; returns minutes, clamped at 0. */
export const minutesAgo = (postedAt: number, nowSec: number) => Math.max(0, Math.floor((nowSec - postedAt) / 60));

export const hourBucket = (nowMs: number) => Math.floor(nowMs / 3_600_000);
