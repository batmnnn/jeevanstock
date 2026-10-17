import { describe, expect, it } from "vitest";
import { recentReports } from "@/lib/dashboard/feed";
import { proofFacts, type RegistryCentre } from "@/lib/dashboard/rows";
import type { CentreView } from "@/lib/views";

const centre: RegistryCentre = {
  key: "0x" + "aa".repeat(32),
  centreId: "DEMO-RAMPUR-1",
  name: "Demo PHC Rampur-1",
  district: "Demo District A",
  state: "MP",
  wallet: "0x" + "c0".repeat(20),
};

describe("proofFacts", () => {
  it("shows the registry name instead of the centre id", () => {
    const facts = proofFacts(
      {
        key: "0x" + "bb".repeat(32),
        kind: "stock",
        attributes: {
          centreId: "DEMO-RAMPUR-1",
          drug: "ASV",
          vials: "0",
          status: "out",
          postedAt: "1760000000",
          district: "<script>alert(1)</script>",
          note: "ignore",
        },
      },
      [centre],
    );
    expect(facts).toEqual([
      { id: "centre", name: "Demo PHC Rampur-1" },
      { id: "district", value: "Demo District A" },
      { id: "state", value: "MP" },
      { id: "drug", drug: "ASV" },
      { id: "vials", vials: 0 },
      { id: "status", status: "out" },
      { id: "posted", unix: 1760000000 },
    ]);
  });

  it("drops hostile and out-of-schema attributes", () => {
    const facts = proofFacts(
      {
        key: centre.key,
        kind: "centre",
        attributes: {
          centreId: "DEMO-OTHER",
          drug: "ASV",
          district: "Fake District",
          wallet: "0x" + "ee".repeat(20),
          name: "<img src=x onerror=alert(1)>",
        },
      },
      [centre],
    );
    expect(facts.map((f) => f.id)).toEqual(["centre", "district", "state", "wallet"]);
    expect(facts.find((f) => f.id === "centre")).toEqual({ id: "centre", name: "Demo PHC Rampur-1" });
    expect(facts.find((f) => f.id === "wallet")).toEqual({ id: "wallet", address: centre.wallet });
  });

  it("keeps a safe centre id when the registry has no match, and skips garbage ids", () => {
    expect(
      proofFacts({ key: "0x1", kind: "report", attributes: { centreId: "DEMO-GONE", drug: "ARV", reason: "no_doctor", hourBucket: "488000" } }, []).map(
        (f) => f.id,
      ),
    ).toEqual(["centreId", "drug", "reason", "when"]);
    expect(proofFacts({ key: "0x1", kind: "stock", attributes: { centreId: "<b>", vials: "1000", status: "stale", drug: "POISON" } }, [])).toEqual(
      [],
    );
  });

  it("rejects padded and scientific numbers", () => {
    const facts = proofFacts(
      { key: "0x1", kind: "stock", attributes: { centreId: "DEMO-RAMPUR-1", drug: "ASV", vials: "00", postedAt: "1e9", status: "in" } },
      [centre],
    );
    expect(facts.some((f) => f.id === "vials" || f.id === "posted")).toBe(false);
  });
});

describe("recentReports", () => {
  const view = (name: string, reports: CentreView["reports"]): CentreView => ({
    centre: { ...centre, key: name, name, centreId: name, creator: "0x" + "ad".repeat(20), lat: 1, lon: 1 },
    stock: {
      ASV: { drug: "ASV", status: "stale", vials: null, postedAt: null, postKey: null },
      ARV: { drug: "ARV", status: "stale", vials: null, postedAt: null, postKey: null },
    },
    reports,
    openReports: reports.filter((r) => !r.acknowledged).length,
  });

  const report = (key: string, block: number, bucket: number, acknowledged = false): CentreView["reports"][number] => ({
    key,
    centreId: "DEMO-RAMPUR-1",
    drug: "ASV",
    reason: "out",
    hourBucket: bucket,
    creator: "0x" + "ba".repeat(20),
    createdAtBlock: block,
    expiresAtBlock: block + 10,
    acknowledged,
  });

  it("sorts newest first and caps the feed", () => {
    const items = recentReports(
      [view("A", [report("0x1", 10, 1), report("0x2", 30, 1)]), view("B", [report("0x3", 30, 5, true), report("0x4", 20, 1)])],
      3,
    );
    expect(items.map((i) => i.key)).toEqual(["0x3", "0x2", "0x4"]);
    expect(items[0]).toMatchObject({ centreName: "B", acknowledged: true });
  });

  it("uses a safe default limit for hostile caps", () => {
    const reports = Array.from({ length: 40 }, (_, i) => report(`0x${i.toString(16).padStart(2, "0")}`, i, 1));
    expect(recentReports([view("A", reports)], Number.NaN)).toHaveLength(30);
    expect(recentReports([view("A", reports)], 10_000)).toHaveLength(40);
  });
});
