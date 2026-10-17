import { describe, expect, it } from "vitest";
import {
  haversineKm,
  isAcknowledged,
  isValidVials,
  latestStock,
  rankCentres,
  REPORT_TTL_BLOCKS,
  statusForVials,
  trustedPosts,
  type StockPost,
} from "@/lib/domain";

const WALLET = "0x00000000000000000000000000000000000000C0";
const centre = { centreId: "DEMO-A", wallet: WALLET };
const NOW = 1_800_000_000;
const post = (p: Partial<StockPost>): StockPost => ({
  key: "k" + Math.random(), centreId: "DEMO-A", drug: "ASV", vials: 10, status: "in", postedAt: NOW - 60,
  creator: WALLET.toLowerCase(), createdAtBlock: 1, expiresAtBlock: 99, ...p,
});

describe("statusForVials", () => {
  it.each([[0, "out"], [1, "low"], [4, "low"], [5, "in"], [999, "in"]])("%i → %s", (v, s) => expect(statusForVials(v)).toBe(s));
});

describe("isValidVials", () => {
  it.each([0, 1, 999])("accepts %s", (v) => expect(isValidVials(v)).toBe(true));
  it.each([-1, 1000, 1.5, NaN, Infinity, "5", null, undefined])("rejects %s", (v) => expect(isValidVials(v)).toBe(false));
});

describe("trust", () => {
  it("drops posts from any creator other than the registered wallet (case-insensitive match)", () => {
    const good = post({});
    const spoof = post({ creator: "0x00000000000000000000000000000000000000ee", vials: 500 });
    expect(trustedPosts(centre, [good, spoof])).toEqual([good]);
  });
  it("drops posts for another centre even if signed by this wallet", () => {
    expect(trustedPosts(centre, [post({ centreId: "DEMO-B" })])).toEqual([]);
  });
});

describe("latestStock", () => {
  it("picks the newest trusted post per drug", () => {
    const old = post({ vials: 2, postedAt: NOW - 3000 });
    const fresh = post({ vials: 12, postedAt: NOW - 60 });
    const [asv, arv] = latestStock(centre, [old, fresh], NOW);
    expect(asv).toMatchObject({ status: "in", vials: 12, postKey: fresh.key });
    expect(arv).toMatchObject({ status: "stale", vials: null });
  });
  it("a newer spoofed post never overrides a trusted one", () => {
    const real = post({ vials: 0, postedAt: NOW - 600 });
    const spoof = post({ vials: 50, postedAt: NOW - 1, creator: "0x00000000000000000000000000000000000000ee" });
    expect(latestStock(centre, [real, spoof], NOW)[0]).toMatchObject({ status: "out", vials: 0 });
  });
  it("treats posts older than 6h as stale", () => {
    expect(latestStock(centre, [post({ postedAt: NOW - 6 * 3600 })], NOW)[0].status).toBe("stale");
    expect(latestStock(centre, [post({ postedAt: NOW - 6 * 3600 + 1 })], NOW)[0].status).toBe("in");
  });
  it("ignores posts dated in the future beyond clock skew", () => {
    expect(latestStock(centre, [post({ postedAt: NOW + 3600 })], NOW)[0].status).toBe("stale");
  });
});

describe("isAcknowledged", () => {
  it("is false for an untouched 48h report and true after a 30-day extension", () => {
    expect(isAcknowledged({ createdAtBlock: 100, expiresAtBlock: 100 + REPORT_TTL_BLOCKS })).toBe(false);
    expect(isAcknowledged({ createdAtBlock: 100, expiresAtBlock: 100 + 1_296_000 })).toBe(true);
  });
});

describe("haversineKm", () => {
  it("is ~0 for the same point and ~15.6 km for 0.1° lat+lon near 24°N", () => {
    expect(haversineKm({ lat: 24, lon: 80 }, { lat: 24, lon: 80 })).toBe(0);
    expect(haversineKm({ lat: 24.1, lon: 80.1 }, { lat: 24.2, lon: 80.2 })).toBeCloseTo(15.0, 0);
  });
});

describe("rankCentres", () => {
  it("orders by usable status, then distance, then name", () => {
    const rows = [
      { name: "Out near", status: "out" as const, distanceKm: 1 },
      { name: "In far", status: "in" as const, distanceKm: 30 },
      { name: "In near", status: "in" as const, distanceKm: 2 },
      { name: "Low", status: "low" as const, distanceKm: null },
      { name: "Stale", status: "stale" as const },
    ];
    expect(rankCentres(rows).map((r) => r.name)).toEqual(["In near", "In far", "Low", "Stale", "Out near"]);
  });
});
