import { describe, expect, it } from "vitest";
import { distancesFrom, directionsUrl, formatDistance, isLatLon, lookupDistance, orderFamilyList } from "@/lib/family/place";
import type { StockStatus } from "@/lib/domain";

const item = (centreId: string, name: string, status: StockStatus, lat: number, lon: number) => ({
  centreId,
  name,
  lat,
  lon,
  focus: { status },
});

describe("isLatLon", () => {
  it("accepts real coordinates and rejects everything else", () => {
    expect(isLatLon({ lat: 24.1, lon: 80.1 })).toBe(true);
    expect(isLatLon({ lat: -90, lon: 180 })).toBe(true);
    expect(isLatLon({ lat: 90, lon: -180, name: "extra" })).toBe(true);
    for (const value of [null, undefined, [], "24,80", { lat: "24.1", lon: 80 }, { lat: Number.NaN, lon: 80 }, { lat: 91, lon: 0 }, { lat: 0, lon: 181 }, { lat: Number.POSITIVE_INFINITY, lon: 0 }]) {
      expect(isLatLon(value)).toBe(false);
    }
  });
});

describe("directionsUrl", () => {
  it("points at the centre and nothing else", () => {
    expect(directionsUrl(24.1, 80.1)).toBe("https://www.google.com/maps/dir/?api=1&destination=24.1,80.1");
    expect(directionsUrl(24.3, 80)).toBe("https://www.google.com/maps/dir/?api=1&destination=24.3,80");
    expect(directionsUrl(-12.5, -77.25)).toBe("https://www.google.com/maps/dir/?api=1&destination=-12.5,-77.25");
  });

  it.each([
    [Number.NaN, 80],
    [Number.POSITIVE_INFINITY, 80],
    [91, 80],
    [24, 181],
    [-91, 0],
  ])("rejects %s,%s", (lat, lon) => {
    expect(directionsUrl(lat, lon)).toBeNull();
  });
});

describe("formatDistance", () => {
  it("rounds kilometres", () => {
    expect(formatDistance(0, "km")).toBe("0 km");
    expect(formatDistance(4.44, "किमी")).toBe("4.4 किमी");
    expect(formatDistance(15.6, "km")).toBe("16 km");
  });

  it("rejects nonsense", () => {
    expect(formatDistance(Number.NaN, "km")).toBeNull();
    expect(formatDistance(-1, "km")).toBeNull();
    expect(formatDistance(Number.POSITIVE_INFINITY, "km")).toBeNull();
    expect(formatDistance(20_001, "km")).toBeNull();
    expect(formatDistance(3, "")).toBeNull();
    expect(formatDistance(3, "x".repeat(17))).toBeNull();
  });
});

describe("distancesFrom", () => {
  const origin = { lat: 19.123456, lon: 72.987654 };

  it("keeps kilometres and drops the family's coordinates", () => {
    const distances = distancesFrom(
      [
        { centreId: "DEMO-A", lat: 24.1, lon: 80.1 },
        { centreId: "../ETC", lat: 24, lon: 80 },
        { centreId: "demo-lower", lat: 24, lon: 80 },
        { centreId: "DEMO-B", lat: Number.NaN, lon: 80 },
      ],
      origin,
    );
    expect(distances).not.toBeNull();
    const json = JSON.stringify(distances);
    expect(json).not.toContain("19.123456");
    expect(json).not.toContain("72.987654");
    expect(json).not.toContain("..");
    expect(json).not.toContain("demo-lower");
    expect(distances && Object.keys(distances)).toEqual(["DEMO-A"]);
    expect(distances?.["DEMO-A"]).toBeGreaterThan(0);
  });

  it("returns null for a bad fix and does not invent distances", () => {
    const rows = [{ centreId: "DEMO-A", lat: 24, lon: 80 }];
    expect(distancesFrom(rows, null)).toBeNull();
    expect(distancesFrom(rows, { lat: 999, lon: 0 })).toBeNull();
    expect(distancesFrom(rows, { lat: Number.NaN, lon: 1 })).toBeNull();
  });

  it("is zero at the centre itself", () => {
    expect(distancesFrom([{ centreId: "DEMO-A", lat: 24, lon: 80 }], { lat: 24, lon: 80 })).toEqual({ "DEMO-A": 0 });
  });
});

describe("lookupDistance", () => {
  it("ignores inherited keys and bad numbers", () => {
    const inherited = Object.create({ "DEMO-A": 5 }) as Record<string, number>;
    expect(lookupDistance(inherited, "DEMO-A")).toBeNull();
    expect(lookupDistance({ "DEMO-A": Number.POSITIVE_INFINITY }, "DEMO-A")).toBeNull();
    expect(lookupDistance({ "DEMO-A": -2 }, "DEMO-A")).toBeNull();
    expect(lookupDistance({ "DEMO-A": 12.5 }, "DEMO-A")).toBe(12.5);
    expect(lookupDistance(null, "DEMO-A")).toBeNull();
  });
});

describe("orderFamilyList", () => {
  const rows = [
    item("DEMO-OUT", "Alpha Out", "out", 24.1, 80.1),
    item("DEMO-IN", "Zulu In", "in", 28, 80),
    item("DEMO-LOW", "Mid Low", "low", 24.2, 80.2),
  ];

  it("puts usable stock ahead of a closer empty centre", () => {
    const distances = distancesFrom(rows, { lat: 24.1, lon: 80.1 });
    const ordered = orderFamilyList(rows, "ASV", distances);
    expect(ordered.map((row) => row.centreId)).toEqual(["DEMO-IN", "DEMO-LOW", "DEMO-OUT"]);
    expect(ordered[2]?.distanceKm).toBeLessThan(ordered[0]?.distanceKm ?? 0);
  });

  it("sorts only by distance when no medicine is chosen", () => {
    const distances = distancesFrom(rows, { lat: 24.1, lon: 80.1 });
    const ordered = orderFamilyList(rows, null, distances);
    expect(ordered[0]?.centreId).toBe("DEMO-OUT");
  });

  it("does not mutate the list and does not keep the fix", () => {
    const origin = { lat: 11.111111, lon: 22.222222 };
    const before = JSON.stringify(rows);
    const distances = distancesFrom(rows, origin);
    const ordered = orderFamilyList(rows, "ASV", distances);
    expect(JSON.stringify(rows)).toBe(before);
    expect(JSON.stringify(ordered)).not.toContain("11.111111");
    expect(JSON.stringify(ordered)).not.toContain("22.222222");
    expect(ordered[0]).not.toHaveProperty("origin");
  });

  it("keeps the input order when there is no location", () => {
    expect(orderFamilyList(rows, null, null).map((row) => row.centreId)).toEqual(["DEMO-OUT", "DEMO-IN", "DEMO-LOW"]);
  });
});
