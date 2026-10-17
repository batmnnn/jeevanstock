import type { Drug } from "@/lib/centres";
import { compareSupplyDateDesc, haversineKm, rankCentres, type StockStatus } from "@/lib/domain";
import { CENTRE_ID_RE } from "./ids";

export function isLatLon(v: unknown): v is { lat: number; lon: number } {
  if (typeof v !== "object" || v === null) return false;
  const lat = (v as { lat?: unknown }).lat;
  const lon = (v as { lon?: unknown }).lon;
  return inRange(lat, -90, 90) && inRange(lon, -180, 180);
}

function inRange(n: unknown, min: number, max: number): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= min && n <= max;
}

function coord(n: number): string | null {
  const s = n.toFixed(6).replace(/\.?0+$/, "");
  return /^-?\d+(\.\d{1,6})?$/.test(s) ? s : null;
}

/** Google Maps directions to a centre. Destination is the centre, never the family's position. */
export function directionsUrl(lat: number, lon: number): string | null {
  if (!isLatLon({ lat, lon })) return null;
  const a = coord(lat);
  const b = coord(lon);
  if (!a || !b) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${a},${b}`;
}

/** "12.4 किमी" — null when the number is not a real distance. */
export function formatDistance(km: number, unit: string): string | null {
  if (typeof km !== "number" || !Number.isFinite(km) || km < 0 || km > 20_000) return null;
  if (typeof unit !== "string" || unit.length === 0 || unit.length > 16) return null;
  const rounded = km < 10 ? (Math.round(km * 10) / 10).toString() : String(Math.round(km));
  if (!/^\d+(\.\d)?$/.test(rounded)) return null;
  return `${rounded} ${unit}`;
}

export interface DistancePoint {
  centreId: string;
  lat: number;
  lon: number;
}

/**
 * Kilometres from a one-off GPS fix to each centre.
 * The fix is not copied into the result — only public centre ids and distances.
 */
export function distancesFrom(items: readonly DistancePoint[], origin: { lat: number; lon: number } | null): Record<string, number> | null {
  if (!isLatLon(origin)) return null;
  const out: Record<string, number> = {};
  for (const item of items) {
    if (!CENTRE_ID_RE.test(item.centreId) || !isLatLon(item)) continue;
    const km = haversineKm(origin, item);
    if (Number.isFinite(km) && km >= 0 && km <= 20_000) out[item.centreId] = km;
  }
  return out;
}

export function lookupDistance(distances: Readonly<Record<string, number>> | null, centreId: string): number | null {
  if (!distances || !Object.prototype.hasOwnProperty.call(distances, centreId)) return null;
  const km = distances[centreId];
  if (typeof km !== "number" || !Number.isFinite(km) || km < 0 || km > 20_000) return null;
  return km;
}

type Sortable = {
  centreId: string;
  name: string;
  focus: { status: StockStatus } | null;
  supplyOn?: { ASV: string | null; ARV: string | null };
};

function newerSupply(supply: { ASV: string | null; ARV: string | null } | undefined): string | null {
  const asv = supply?.ASV ?? "";
  const arv = supply?.ARV ?? "";
  const newer = asv > arv ? asv : arv;
  return newer || null;
}

/** Stock first when a drug is chosen, then distance, then name. Without a drug, distance only. */
export function orderFamilyList<T extends Sortable>(
  items: readonly T[],
  need: Drug | null,
  distances: Readonly<Record<string, number>> | null,
): Array<T & { distanceKm: number | null }> {
  const located = items.map((item) => ({ ...item, distanceKm: lookupDistance(distances, item.centreId) }));
  if (need === "ASV" || need === "ARV") {
    return rankCentres(
      located.map((item) => ({ ...item, status: item.focus?.status ?? "stale", suppliedOn: item.supplyOn?.[need] ?? null })),
    );
  }
  if (distances) {
    return [...located].sort(
      (a, b) =>
        (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY) ||
        compareSupplyDateDesc(newerSupply(a.supplyOn), newerSupply(b.supplyOn)) ||
        a.name.localeCompare(b.name),
    );
  }
  if (located.some((item) => newerSupply(item.supplyOn))) {
    return [...located].sort(
      (a, b) => compareSupplyDateDesc(newerSupply(a.supplyOn), newerSupply(b.supplyOn)) || a.name.localeCompare(b.name),
    );
  }
  return located;
}
