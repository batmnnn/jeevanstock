import type { Lang } from "../i18n";

export const DASH = "—";
const IST_OFFSET_SEC = 5 * 3600 + 30 * 60;
const REPORT_WINDOW_SEC = 48 * 3600;

const MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const MONTH_HI = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"] as const;

export interface IstParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Wall-clock parts in Asia/Kolkata (UTC+5:30, no DST). Null when the instant is not a sane civil time. */
export function istParts(unixSec: number): IstParts | null {
  if (typeof unixSec !== "number" || !Number.isFinite(unixSec)) return null;
  const shifted = Math.trunc(unixSec) + IST_OFFSET_SEC;
  if (!Number.isSafeInteger(shifted)) return null;
  const ms = shifted * 1000;
  if (!Number.isSafeInteger(ms)) return null;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return null;
  const year = d.getUTCFullYear();
  if (year < 2000 || year > 2100) return null;
  return { year, month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours(), minute: d.getUTCMinutes() };
}

function monthName(month: number, lang: Lang): string {
  return (lang === "hi" ? MONTH_HI : MONTH_EN)[month - 1] ?? DASH;
}

/** Absolute time for a created-block instant. */
export function formatUnixIst(unix: number, lang: Lang): string {
  const p = istParts(unix);
  if (!p) return DASH;
  const hm = `${pad(p.hour)}:${pad(p.minute)}`;
  return `${p.day} ${monthName(p.month, lang)} ${p.year}, ${hm} IST`;
}

/**
 * Coarse label for a report hour bucket (unix hours).
 * One IST hour-range, e.g. "16 Oct, 05:30–06:30 IST".
 */
export function formatHourBucket(bucket: number, lang: Lang): string {
  if (typeof bucket !== "number" || !Number.isSafeInteger(bucket) || bucket < 0 || bucket > 20_000_000) return DASH;
  const start = bucket * 3600;
  const a = istParts(start);
  const b = istParts(start + 3600);
  if (!a || !b) return DASH;
  const t1 = `${pad(a.hour)}:${pad(a.minute)}`;
  const t2 = `${pad(b.hour)}:${pad(b.minute)}`;
  if (a.year === b.year && a.month === b.month && a.day === b.day) {
    return `${a.day} ${monthName(a.month, lang)}, ${t1}–${t2} IST`;
  }
  return `${a.day} ${monthName(a.month, lang)} ${t1} – ${b.day} ${monthName(b.month, lang)} ${t2} IST`;
}

/**
 * Human expiry. Within the 48h report window: "expires in ~5 h".
 * Longer (an acknowledged report): "kept until ~16 Nov".
 */
export function formatExpiry(expiresAtUnix: number, nowSec: number, lang: Lang): string {
  if (typeof expiresAtUnix !== "number" || typeof nowSec !== "number") return DASH;
  if (!Number.isFinite(expiresAtUnix) || !Number.isFinite(nowSec)) return DASH;
  const delta = expiresAtUnix - nowSec;
  if (!Number.isFinite(delta)) return DASH;
  if (delta <= 0) return lang === "hi" ? "समय निकल चुका है" : "Already expired";
  if (delta > REPORT_WINDOW_SEC) {
    const parts = istParts(expiresAtUnix);
    const now = istParts(nowSec);
    if (!parts) return DASH;
    const month = monthName(parts.month, lang);
    const year = now && now.year !== parts.year ? ` ${parts.year}` : "";
    return lang === "hi" ? `लगभग ${parts.day} ${month}${year} तक रखा जाएगा` : `kept until ~${parts.day} ${month}${year}`;
  }
  if (delta < 3600) {
    const minutes = Math.max(1, Math.round(delta / 60));
    return lang === "hi" ? `लगभग ${minutes} मिनट में खत्म होगा` : `expires in ~${minutes} min`;
  }
  const hours = Math.max(1, Math.round(delta / 3600));
  return lang === "hi" ? `लगभग ${hours} घंटे में खत्म होगा` : `expires in ~${hours} h`;
}

export function formatBlock(n: number): string | null {
  if (typeof n !== "number" || !Number.isSafeInteger(n) || n < 0) return null;
  return new Intl.NumberFormat("en-IN").format(n);
}
