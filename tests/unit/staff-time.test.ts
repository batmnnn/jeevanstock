import { describe, expect, it } from "vitest";
import { hourBucket } from "@/lib/domain";
import { hourBucketLabel, isHourBucket } from "@/lib/staff/time";

const sec = (y: number, m: number, d: number, hh = 0, mm = 0) => Math.floor(Date.UTC(y, m, d, hh, mm) / 1000);

describe("hourBucketLabel", () => {
  const bucketStart = sec(2026, 9, 17, 8, 0);
  const bucket = bucketStart / 3600;

  it("labels the bucket start in IST, which is 5:30 ahead of UTC", () => {
    expect(hourBucketLabel(bucket, sec(2026, 9, 17, 8, 30), "en")).toBe("today ~13:30");
    expect(hourBucketLabel(bucket, sec(2026, 9, 17, 8, 30), "hi")).toBe("आज ~13:30");
  });

  it("uses yesterday and a date when the IST day has moved on", () => {
    expect(hourBucketLabel(bucket, sec(2026, 9, 18, 8, 0), "en")).toBe("yesterday ~13:30");
    expect(hourBucketLabel(bucket, sec(2026, 9, 18, 8, 0), "hi")).toBe("कल ~13:30");
    expect(hourBucketLabel(bucket, sec(2026, 9, 20, 8, 0), "en")).toBe("17 Oct ~13:30");
    expect(hourBucketLabel(bucket, sec(2026, 9, 20, 8, 0), "hi")).toBe("17 अक्टूबर ~13:30");
  });

  it("treats the hour before IST midnight as yesterday", () => {
    const late = sec(2026, 9, 16, 18, 0) / 3600;
    expect(hourBucketLabel(late, sec(2026, 9, 16, 18, 40), "en")).toBe("yesterday ~23:30");
    expect(hourBucketLabel(late, sec(2026, 9, 16, 18, 40), "hi")).toBe("कल ~23:30");
  });

  it("crosses the new year in IST", () => {
    const nye = sec(2026, 11, 31, 18, 0) / 3600;
    expect(hourBucketLabel(nye, sec(2026, 11, 31, 18, 40), "en")).toBe("yesterday ~23:30");
    expect(hourBucketLabel(nye, sec(2027, 0, 5, 12, 0), "en")).toBe("31 Dec ~23:30");
    expect(hourBucketLabel(nye, sec(2027, 0, 5, 12, 0), "hi")).toBe("31 दिसंबर ~23:30");
  });

  it("shows 1 Jan 1970 05:30 IST for bucket 0, not UTC midnight", () => {
    expect(hourBucketLabel(0, sec(2026, 9, 17), "en")).toBe("1 Jan ~05:30");
    expect(hourBucketLabel(0, sec(2026, 9, 17), "hi")).toBe("1 जनवरी ~05:30");
  });

  it("agrees with the domain hour bucket for a known instant", () => {
    const ms = Date.UTC(2026, 9, 17, 8, 30, 0);
    expect(hourBucketLabel(hourBucket(ms), ms / 1000, "en")).toBe("today ~13:30");
  });

  it.each([-1, 1.5, 1e9, Number.NaN, Number.POSITIVE_INFINITY, 20_000_001])("rejects bucket %s", (bucketValue) => {
    expect(isHourBucket(bucketValue)).toBe(false);
    expect(hourBucketLabel(bucketValue, sec(2026, 9, 17), "en")).toBeNull();
  });

  it.each(["100", "1e9", null, undefined, true, [], {}])("rejects non-number bucket %j", (bucketValue) => {
    expect(hourBucketLabel(bucketValue, sec(2026, 9, 17), "en")).toBeNull();
  });

  it("rejects a bad clock or language", () => {
    expect(hourBucketLabel(bucket, Number.NaN, "en")).toBeNull();
    expect(hourBucketLabel(bucket, -1, "en")).toBeNull();
    expect(hourBucketLabel(bucket, 1e20, "en")).toBeNull();
    expect(hourBucketLabel(bucket, sec(2026, 9, 17), "fr" as "en")).toBeNull();
  });
});
