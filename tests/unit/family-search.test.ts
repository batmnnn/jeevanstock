import { describe, expect, it } from "vitest";
import { SEARCH_LIMIT, searchCentres } from "@/lib/family/search";

const rows = [
  { name: "PHC, Mangchuwa", district: "Balod" },
  { name: "PHC BELODI", district: "Balod" },
  { name: "PHC Chikhlakasa", district: "Balod" },
  { name: "CHC, Gurur", district: "Balod" },
  { name: "CHC AHIWARA", district: "Durg" },
];

describe("centre search", () => {
  it("returns the ranked list when the box is empty", () => {
    expect(searchCentres(rows, "  ").items).toEqual(rows);
  });

  it("keeps the first ten centres whose name contains the search", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ name: `PHC Match ${String(i).padStart(2, "0")}`, district: "Durg" }));
    const found = searchCentres(many, "match");
    expect(found.loosened).toBe(false);
    expect(found.items).toHaveLength(SEARCH_LIMIT);
    expect(found.items[0]?.name).toBe("PHC Match 00");
    expect(found.items[9]?.name).toBe("PHC Match 09");
  });

  it("matches a centre when only the first letters still fit", () => {
    const found = searchCentres(rows, "Chikhlakasaaaa");
    expect(found.loosened).toBe(true);
    expect(found.items.map((item) => item.name)).toEqual(["PHC Chikhlakasa"]);
  });

  it("matches across punctuation and district", () => {
    expect(searchCentres(rows, "gurur").items.map((item) => item.name)).toEqual(["CHC, Gurur"]);
    expect(searchCentres(rows, "durg").items.map((item) => item.name)).toEqual(["CHC AHIWARA"]);
  });

  it("shows nothing when even one letter misses", () => {
    expect(searchCentres(rows, "qqq")).toEqual({ items: [], loosened: false });
  });
});
