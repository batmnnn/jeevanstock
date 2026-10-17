import { describe, expect, it } from "vitest";
import { MemoryRepo, MEMORY_PAYER } from "@/lib/repo/memory";
import { RepoError } from "@/lib/repo/types";
import { buildCentreViews, dashboardStats, findCentreView } from "@/lib/views";

const clock = (start = 1_800_000_000_000) => {
  let t = start;
  return { now: () => t, advance: (ms: number) => (t += ms) };
};

describe("MemoryRepo + views", () => {
  it("seeds three synthetic centres with derived stock", async () => {
    const r = new MemoryRepo(clock().now);
    const views = buildCentreViews(await r.snapshot());
    expect(views).toHaveLength(3);
    expect(findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")?.stock.ASV.status).toBe("out");
    expect(findCentreView(await r.snapshot(), "DEMO-SONPUR-CHC")?.stock.ASV).toMatchObject({ status: "in", vials: 12 });
    expect(findCentreView(await r.snapshot(), "DEMO-KALAPUR-2")?.stock.ARV.status).toBe("stale");
  });

  it("stock posts expire after 6h and the drug goes stale", async () => {
    const c = clock();
    const r = new MemoryRepo(c.now, { seed: false });
    await r.postStock("DEMO-RAMPUR-1", "ASV", 8);
    expect(findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")?.stock.ASV.status).toBe("in");
    c.advance(6 * 3600 * 1000 + 2000);
    expect(findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")?.stock.ASV.status).toBe("stale");
  });

  it("spoofed posts are ignored by views", async () => {
    const r = new MemoryRepo(clock().now, { seed: false });
    r.insertStock("DEMO-RAMPUR-1", "ASV", 50, "0x00000000000000000000000000000000000000ee");
    expect(findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")?.stock.ASV.status).toBe("stale");
  });

  it("report lifecycle: open → confirmed (extended) → counted as acknowledged", async () => {
    const c = clock();
    const r = new MemoryRepo(c.now, { seed: false });
    const { entityKey } = await r.fileReport("DEMO-RAMPUR-1", "ASV", "out");
    let v = findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")!;
    expect(v.openReports).toBe(1);
    expect(v.reports[0].creator).toBe(MEMORY_PAYER);

    await r.confirmReport("DEMO-RAMPUR-1", entityKey);
    v = findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")!;
    expect(v.openReports).toBe(0);
    expect(v.reports[0].acknowledged).toBe(true);

    c.advance(49 * 3600 * 1000);
    expect(findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")!.reports).toHaveLength(1);
    expect(dashboardStats(buildCentreViews(await r.snapshot())).acknowledgedReports).toBe(1);
  });

  it("unconfirmed reports expire after 48h", async () => {
    const c = clock();
    const r = new MemoryRepo(c.now, { seed: false });
    await r.fileReport("DEMO-RAMPUR-1", "ARV", "closed");
    c.advance(48 * 3600 * 1000 + 2000);
    expect(findCentreView(await r.snapshot(), "DEMO-RAMPUR-1")!.reports).toHaveLength(0);
  });

  it("a centre cannot confirm another centre's report", async () => {
    const r = new MemoryRepo(clock().now, { seed: false });
    const { entityKey } = await r.fileReport("DEMO-RAMPUR-1", "ASV", "out");
    await expect(r.confirmReport("DEMO-SONPUR-CHC", entityKey)).rejects.toMatchObject({ code: "forbidden" });
  });

  it("double confirm is rejected; unknown centre/key rejected; invalid vials rejected", async () => {
    const r = new MemoryRepo(clock().now, { seed: false });
    const { entityKey } = await r.fileReport("DEMO-RAMPUR-1", "ASV", "out");
    await r.confirmReport("DEMO-RAMPUR-1", entityKey);
    await expect(r.confirmReport("DEMO-RAMPUR-1", entityKey)).rejects.toBeInstanceOf(RepoError);
    await expect(r.fileReport("NOPE", "ASV", "out")).rejects.toMatchObject({ code: "not_found" });
    await expect(r.confirmReport("DEMO-RAMPUR-1", "0xdead")).rejects.toMatchObject({ code: "not_found" });
    await expect(r.postStock("DEMO-RAMPUR-1", "ASV", -1)).rejects.toMatchObject({ code: "invalid" });
    await expect(r.postStock("DEMO-RAMPUR-1", "ASV", 1000)).rejects.toMatchObject({ code: "invalid" });
  });

  it("getEntity exposes proof fields", async () => {
    const r = new MemoryRepo(clock().now, { seed: false });
    const { entityKey } = await r.fileReport("DEMO-RAMPUR-1", "ASV", "no_doctor");
    expect(await r.getEntity(entityKey)).toMatchObject({ kind: "report", readonly: true, permissionlessExtension: true, creator: MEMORY_PAYER });
    expect(await r.getEntity("0xnothing")).toBeNull();
  });
});
