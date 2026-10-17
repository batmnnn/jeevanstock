import { describe, expect, it } from "vitest";
import { DASH, formatBlock, formatExpiry, formatHourBucket, formatUnixIst, istParts } from "@/lib/dashboard/time";

const utc = (y: number, m: number, d: number, hh = 0, mm = 0) => Date.UTC(y, m - 1, d, hh, mm) / 1000;

describe("istParts", () => {
  it("shifts UTC by +5:30", () => {
    expect(istParts(utc(2026, 10, 16, 18, 30))).toEqual({ year: 2026, month: 10, day: 17, hour: 0, minute: 0 });
  });

  it.each([NaN, Infinity, -Infinity, Number.MAX_VALUE, utc(1990, 1, 1)])("rejects %s", (n) => {
    expect(istParts(n)).toBeNull();
  });
});

describe("formatUnixIst", () => {
  it("labels the anchor instant in both languages", () => {
    const unix = utc(2026, 10, 16, 18, 30);
    expect(formatUnixIst(unix, "en")).toBe("17 Oct 2026, 00:00 IST");
    expect(formatUnixIst(unix, "hi")).toBe("17 अक्टूबर 2026, 00:00 IST");
  });

  it("does not throw on hostile numbers", () => {
    expect(formatUnixIst(Number.NaN, "en")).toBe(DASH);
    expect(formatUnixIst(1e20, "hi")).toBe(DASH);
  });
});

describe("formatHourBucket", () => {
  it("renders one IST hour on the same civil day", () => {
    const bucket = utc(2026, 10, 16, 0, 0) / 3600;
    expect(formatHourBucket(bucket, "en")).toBe("16 Oct, 05:30–06:30 IST");
    expect(formatHourBucket(bucket, "hi")).toBe("16 अक्टूबर, 05:30–06:30 IST");
  });

  it("shows both dates when the hour crosses midnight in IST", () => {
    const bucket = utc(2026, 10, 16, 18, 0) / 3600;
    expect(formatHourBucket(bucket, "en")).toBe("16 Oct 23:30 – 17 Oct 00:30 IST");
  });

  it.each([1.5, -1, Number.NaN, Number.POSITIVE_INFINITY, 21_000_000, 1.0001])("rejects %s", (bucket) => {
    expect(formatHourBucket(bucket, "en")).toBe(DASH);
  });
});

describe("formatExpiry", () => {
  const now = utc(2026, 10, 17, 0, 0);

  it("uses a relative phrase inside the 48 hour window", () => {
    expect(formatExpiry(now + 5 * 3600, now, "en")).toBe("expires in ~5 h");
    expect(formatExpiry(now + 5 * 3600, now, "hi")).toBe("लगभग 5 घंटे में खत्म होगा");
    expect(formatExpiry(now + 30 * 60, now, "en")).toBe("expires in ~30 min");
    expect(formatExpiry(now + 48 * 3600, now, "en")).toBe("expires in ~48 h");
  });

  it("uses a calendar date once the record outlives 48 hours", () => {
    expect(formatExpiry(now + 30 * 86400, now, "en")).toBe("kept until ~16 Nov");
    expect(formatExpiry(now + 30 * 86400, now, "hi")).toBe("लगभग 16 नवंबर तक रखा जाएगा");
    expect(formatExpiry(now + 48 * 3600 + 1, now, "en").startsWith("kept until")).toBe(true);
  });

  it("includes the year when the expiry falls in another IST year", () => {
    const dec = utc(2026, 12, 20, 0, 0);
    expect(formatExpiry(dec + 30 * 86400, dec, "en")).toBe("kept until ~19 Jan 2027");
  });

  it("says when the record has already expired and stays calm on bad input", () => {
    expect(formatExpiry(now, now, "en")).toBe("Already expired");
    expect(formatExpiry(now - 10, now, "hi")).toBe("समय निकल चुका है");
    expect(formatExpiry(Number.NaN, now, "en")).toBe(DASH);
    expect(formatExpiry(now, Number.POSITIVE_INFINITY, "en")).toBe(DASH);
  });
});

describe("formatBlock", () => {
  it("groups a block number and rejects junk", () => {
    expect(formatBlock(1234567)).toBe("12,34,567");
    expect(formatBlock(-1)).toBeNull();
    expect(formatBlock(1.5)).toBeNull();
    expect(formatBlock(Number.NaN)).toBeNull();
  });
});
