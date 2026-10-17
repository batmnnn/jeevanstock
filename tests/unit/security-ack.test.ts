import { describe, expect, it } from "vitest";
import { trustVerdict, type TrustSnapshot } from "@/lib/dashboard/trust";
import { MEMORY_ADMIN, MEMORY_PAYER, MemoryRepo, memoryCentreWallet } from "@/lib/repo/memory";
import { RepoError } from "@/lib/repo/types";
import { buildCentreViews, findCentreView } from "@/lib/views";

const ATTACKER = "0x" + "ee".repeat(20);
const clock = (start = 1_800_000_000_000) => {
  let t = start;
  return { now: () => t, advance: (ms: number) => (t += ms) };
};

describe("acknowledgement is an ack from the centre wallet", () => {
  it("does not treat a permissionless lifetime extension as acknowledgement", async () => {
    const r = new MemoryRepo(clock().now, { seed: false });
    const { entityKey } = await r.fileReport("DEMO-RAMPUR-1", "ASV", "out");
    r.bumpExpiry(entityKey, 5_000_000);
    const open = findCentreView(await r.snapshot(), "DEMO-RAMPUR-1");
    expect(open?.openReports).toBe(1);
    expect(open?.reports[0]?.acknowledged).toBe(false);

    await r.confirmReport("DEMO-RAMPUR-1", entityKey);
    const acked = findCentreView(await r.snapshot(), "DEMO-RAMPUR-1");
    expect(acked?.openReports).toBe(0);
    expect(acked?.reports[0]?.acknowledged).toBe(true);
    const snap = await r.snapshot();
    expect(snap.acks).toEqual([
      expect.objectContaining({ reportKey: entityKey, creator: memoryCentreWallet(0), centreId: "DEMO-RAMPUR-1" }),
    ]);
  });

  it("ignores an ack written by any wallet other than the registered centre", async () => {
    const r = new MemoryRepo(clock().now, { seed: false });
    const { entityKey } = await r.fileReport("DEMO-RAMPUR-1", "ASV", "out");
    r.insertAck("DEMO-RAMPUR-1", entityKey, ATTACKER);
    expect(findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")?.openReports).toBe(1);
    await r.confirmReport("DEMO-RAMPUR-1", entityKey);
    expect(findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")?.reports[0]?.acknowledged).toBe(true);
  });

  it("will not confirm a report that was not created by the payer", async () => {
    const r = new MemoryRepo(clock().now, { seed: false });
    const { entityKey } = r.insertReport("DEMO-RAMPUR-1", ATTACKER);
    await expect(r.confirmReport("DEMO-RAMPUR-1", entityKey)).rejects.toMatchObject({ code: "forbidden" });
    expect(findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")?.reports).toHaveLength(0);
  });

  it("drops a centre entity that was not created by the admin", async () => {
    const r = new MemoryRepo(clock().now, { seed: false });
    const base = (await r.snapshot()).centres[0]!;
    const evil = {
      ...base,
      key: "0x" + "11".repeat(32),
      centreId: "DEMO-EVIL-1",
      name: "<script>alert(1)</script>",
      creator: ATTACKER,
      wallet: ATTACKER,
    };
    r.insertCentre(evil);
    expect((await r.snapshot()).centres.some((c) => c.centreId === "DEMO-EVIL-1")).toBe(false);

    const poisoned = await r.snapshot();
    poisoned.centres.push(evil);
    expect(buildCentreViews(poisoned).some((v) => v.centre.centreId === "DEMO-EVIL-1")).toBe(false);
    expect(buildCentreViews(poisoned).some((v) => v.centre.creator === MEMORY_ADMIN)).toBe(true);
  });
});

describe("ack trust on a proof", () => {
  const snap: TrustSnapshot = {
    admin: MEMORY_ADMIN,
    payer: MEMORY_PAYER,
    centres: [{ centreId: "DEMO-RAMPUR-1", wallet: memoryCentreWallet(0), creator: MEMORY_ADMIN }],
  };
  const reportKey = "0x" + "ab".repeat(32);

  it("trusts an ack only from the registered centre wallet", () => {
    expect(
      trustVerdict(
        { kind: "ack", creator: memoryCentreWallet(0), attributes: { centreId: "DEMO-RAMPUR-1", reportKey } },
        snap,
      ),
    ).toEqual({ trusted: true, code: "ack-centre" });
    expect(
      trustVerdict({ kind: "ack", creator: ATTACKER, attributes: { centreId: "DEMO-RAMPUR-1", reportKey } }, snap).trusted,
    ).toBe(false);
  });

  it("does not trust stock against a centre row the admin did not create", () => {
    const poisoned: TrustSnapshot = {
      ...snap,
      centres: [
        { centreId: "DEMO-RAMPUR-1", wallet: ATTACKER, creator: ATTACKER },
        ...snap.centres,
      ],
    };
    expect(trustVerdict({ kind: "stock", creator: ATTACKER, attributes: { centreId: "DEMO-RAMPUR-1" } }, poisoned).trusted).toBe(false);
    expect(trustVerdict({ kind: "stock", creator: memoryCentreWallet(0), attributes: { centreId: "DEMO-RAMPUR-1" } }, poisoned).code).toBe(
      "stock-centre",
    );
  });
});

describe("confirm errors stay coded", () => {
  it("rejects a second confirm", async () => {
    const r = new MemoryRepo(clock().now, { seed: false });
    const { entityKey } = await r.fileReport("DEMO-RAMPUR-1", "ASV", "out");
    await r.confirmReport("DEMO-RAMPUR-1", entityKey);
    await expect(r.confirmReport("DEMO-RAMPUR-1", entityKey)).rejects.toBeInstanceOf(RepoError);
  });
});
