import type { Lang } from "../i18n";
import { staff } from "../../messages/staff";

/** IST is UTC+5:30 and does not observe daylight saving. */
const IST_OFFSET_SEC = 5 * 3600 + 30 * 60;
/** About year 4200. Far past any report this demo will store. */
const MAX_HOUR_BUCKET = 20_000_000;
const MAX_NOW_SEC = 10_000_000_000;

export function isHourBucket(v: unknown): v is number {
  return typeof v === "number" && Number.isSafeInteger(v) && v >= 0 && v <= MAX_HOUR_BUCKET;
}

function wallClock(unixSec: number) {
  const shifted = unixSec + IST_OFFSET_SEC;
  const d = new Date(shifted * 1000);
  return {
    dayIndex: Math.floor(shifted / 86400),
    hh: d.getUTCHours(),
    mm: d.getUTCMinutes(),
    date: d.getUTCDate(),
    month: d.getUTCMonth(),
  };
}

/**
 * Coarse IST label for a report hour bucket (unix hours).
 * Buckets start on UTC hours, so the local time lands on :30.
 * Returns null for junk input rather than guessing.
 */
export function hourBucketLabel(bucket: unknown, nowSec: number, lang: Lang): string | null {
  if (!isHourBucket(bucket)) return null;
  if (typeof nowSec !== "number" || !Number.isFinite(nowSec) || nowSec < 0 || nowSec > MAX_NOW_SEC) return null;
  if (lang !== "hi" && lang !== "en") return null;

  const t = staff[lang];
  const wall = wallClock(bucket * 3600);
  const now = wallClock(nowSec);
  const time = `${String(wall.hh).padStart(2, "0")}:${String(wall.mm).padStart(2, "0")}`;
  const delta = now.dayIndex - wall.dayIndex;
  if (delta === 0) return t.today(time);
  if (delta === 1) return t.yesterday(time);
  const month = t.months[wall.month] ?? "";
  return t.onDate(`${wall.date} ${month}`.trim(), time);
}
