import { describe, expect, it } from "vitest";
import { decodeCentre, decodeReport, decodeStock } from "@/lib/repo/decode";

const cell = (type: string, value: unknown) => ({ type, value });
const enc = (o: unknown) => new TextEncoder().encode(JSON.stringify(o));
const W = "0x00000000000000000000000000000000000000C0";
const base = { key: "0xabc", creator: W, owner: W, createdAt: 10n, expiresAt: 20n };

describe("decodeStock", () => {
  const good = {
    ...base,
    attributes: { app: cell("str", "jeevanstock-demo"), kind: cell("str", "stock"), centreId: cell("str", "DEMO-A"), drug: cell("str", "ASV"), vials: cell("u64", 12n), postedAt: cell("u64", 1_800_000_000n) },
  };
  it("decodes typed attribute cells and recomputes status from vials", () => {
    expect(decodeStock({ ...good, attributes: { ...good.attributes, status: cell("str", "in") } })).toMatchObject({ drug: "ASV", vials: 12, status: "in", postedAt: 1_800_000_000, createdAtBlock: 10 });
  });
  it("ignores a lying status attribute", () => {
    const lie = { ...good, attributes: { ...good.attributes, vials: cell("u64", 0n), status: cell("str", "in") } };
    expect(decodeStock(lie)?.status).toBe("out");
  });
  it.each([
    ["unknown drug", { drug: cell("str", "XYZ") }],
    ["vials over max", { vials: cell("u64", 100000n) }],
    ["missing postedAt", { postedAt: undefined }],
    ["vials as string", { vials: cell("str", "12") }],
  ])("drops %s", (_, patch) => {
    expect(decodeStock({ ...good, attributes: { ...good.attributes, ...patch } })).toBeNull();
  });
  it("drops entities missing block metadata", () => {
    expect(decodeStock({ ...good, createdAt: undefined })).toBeNull();
  });
  it("reads the snake_case names Tiramisu accepts", () => {
    const wired = {
      ...base,
      attributes: { centre_id: cell("str", "DEMO-A"), drug: cell("str", "ASV"), vials: cell("u64", 12n), posted_at: cell("u64", 1_800_000_000n) },
    };
    expect(decodeStock(wired)).toMatchObject({ centreId: "DEMO-A", vials: 12, postedAt: 1_800_000_000 });
  });
});

describe("decodeCentre", () => {
  const good = {
    ...base,
    attributes: { centreId: cell("str", "DEMO-A"), district: cell("str", "D"), state: cell("str", "MP"), wallet: cell("addr", W) },
    payload: enc({ name: "Demo PHC", lat: 24.1, lon: 80.1, phone: "demo" }),
  };
  it("decodes payload and attributes", () => {
    expect(decodeCentre(good)).toMatchObject({ centreId: "DEMO-A", name: "Demo PHC", lat: 24.1, wallet: W });
  });
  it.each([
    ["bad JSON", { payload: new TextEncoder().encode("{nope") }],
    ["bad wallet", { attributes: { ...good.attributes, wallet: cell("str", "0x123") } }],
    ["lat out of range", { payload: enc({ name: "x", lat: 200, lon: 1 }) }],
    ["lowercase/injected centreId", { attributes: { ...good.attributes, centreId: cell("str", "<script>") } }],
  ])("drops %s", (_, patch) => expect(decodeCentre({ ...good, ...patch })).toBeNull());
});

describe("decodeReport", () => {
  const good = {
    ...base,
    attributes: { centreId: cell("str", "DEMO-A"), drug: cell("str", "ARV"), reason: cell("str", "no_doctor"), hourBucket: cell("u64", 500000n) },
  };
  it("decodes", () => expect(decodeReport(good)).toMatchObject({ reason: "no_doctor", drug: "ARV", hourBucket: 500000 }));
  it("drops unknown reasons", () => expect(decodeReport({ ...good, attributes: { ...good.attributes, reason: cell("str", "bribe") } })).toBeNull());
});
