import { describe, expect, it } from "vitest";
import { statusForVials } from "@/lib/domain";
import { DIRECTORY, buildPublicBoard, describeIssue, describeLastIssue, describeWarehouse, publicDrugStock, supplyChip } from "@/lib/directory";
import { buildFamilyList } from "@/lib/family/list";
import { orderFamilyList } from "@/lib/family/place";
import { common } from "@/lib/i18n";
import { MemoryRepo, MEMORY_ADMIN, memoryCentreWallet } from "@/lib/repo/memory";
import { family } from "@/messages/family";

const NOW_MS = Date.UTC(2026, 9, 17, 12);
const clock = () => () => NOW_MS;

describe("CGMSCL issues are not shelf stock", () => {
  it("marks an unexpired issue as sent and keeps the vial count empty", async () => {
    const entry = DIRECTORY.find((centre) => centre.centreId === "CG-BALOD-CHIKHLAKASA");
    expect(entry?.issues.ASV).toMatchObject({ qty: 100, itemCode: "D418", issuedOn: "2026-06-04" });
    expect(statusForVials(entry!.issues.ASV!.qty)).toBe("in");
    expect(supplyChip(entry!.issues.ASV, "2026-10-17")).toBe("sent");
    expect(supplyChip({ ...entry!.issues.ASV!, expiresOn: "2026-01-01" }, "2026-10-17")).toBe("stale");

    const board = buildPublicBoard(await new MemoryRepo(clock()).snapshot());
    const view = board.find((centre) => centre.centre.centreId === "CG-BALOD-CHIKHLAKASA");
    expect(view?.stock.ASV).toEqual({ drug: "ASV", status: "sent", vials: null, postedAt: null, postKey: null });
    expect(describeIssue(entry!.issues.ASV, "en")).toBe(
      "CGMSCL last issued 100 vials on 4 Jun 2026. The expiry date is 31 Oct 2028. This is not the shelf count.",
    );
    expect(describeWarehouse("en")).toContain("On 17 Oct 2026, the Durg warehouse had 3867 vials");
    expect(view?.stock.ARV).toMatchObject({ status: "sent", vials: null });
    expect(board.some((centre) => centre.centre.centreId.startsWith("DEMO-"))).toBe(false);
    expect(board.length).toBe(DIRECTORY.length);
  });

  it("lists the newest anti-venom shipment before an older one, and a centre with no shipment last", async () => {
    const snap = await new MemoryRepo(clock()).snapshot();
    const copy = {
      vials: common.en.vials,
      minutesAgo: common.en.minutesAgo,
      noUpdate: common.en.noUpdate,
      sentShelf: common.en.sentShelf,
      vialsUnknown: family.en.vialsUnknown,
      updated: family.en.updated,
    };
    const ordered = orderFamilyList(buildFamilyList(buildPublicBoard(snap), snap.nowSec, "ASV", copy, "en"), "ASV", null);
    const names = ordered.map((item) => item.name);
    const recent = names.findIndex((name) => name.includes("Mangchuwa"));
    const older = names.findIndex((name) => name.includes("Chikhlakasa"));
    const unseen = ordered.findIndex((item) => item.focus?.status === "stale");
    expect(recent).toBe(0);
    expect(older).toBeGreaterThan(recent);
    expect(unseen).toBeGreaterThan(older);
    expect(ordered[recent]?.focus).toMatchObject({ status: "sent", vialsLabel: "Unknown" });
    expect(ordered[recent]?.lastAsv).toEqual({ qty: 10, dateLabel: "16 Oct 2026" });
    expect(describeLastIssue(DIRECTORY.find((centre) => centre.name.includes("Chikhlakasa"))?.issues.ASV ?? null, "en")).toEqual({
      qty: 100,
      dateLabel: "4 Jun 2026",
    });
    expect(ordered.filter((item) => item.focus?.status === "sent")).toHaveLength(38);
    expect(ordered.filter((item) => item.focus?.status === "stale")).toHaveLength(37);
  });

  it("shows a shelf chip only after a trusted post, and still keeps the issue beside it", async () => {
    const repo = new MemoryRepo(clock(), { seed: false });
    const wallet = memoryCentreWallet(0);
    repo.insertCentre({
      key: "0x" + "ab".repeat(32),
      centreId: "CG-BALOD-CHIKHLAKASA",
      name: "PHC Chikhlakasa",
      district: "Balod",
      state: "CG",
      lat: 20.5,
      lon: 81.2,
      wallet,
      creator: MEMORY_ADMIN,
    });
    await repo.postStock("CG-BALOD-CHIKHLAKASA", "ASV", 2);

    const view = buildPublicBoard(await repo.snapshot()).find((centre) => centre.centre.centreId === "CG-BALOD-CHIKHLAKASA");
    expect(view?.stock.ASV).toMatchObject({ status: "low", vials: 2 });
    expect(view?.supply.ASV?.qty).toBe(100);
    expect(publicDrugStock(undefined, "ASV").vials).toBeNull();
  });

  it("accepts a family report for a directory centre and does not let that report set stock", async () => {
    const repo = new MemoryRepo(clock(), { seed: false });
    await repo.fileReport("CG-BALOD-CHIKHLAKASA", "ASV", "out");
    await expect(repo.postStock("CG-BALOD-CHIKHLAKASA", "ASV", 100)).rejects.toMatchObject({ code: "not_found" });

    const view = buildPublicBoard(await repo.snapshot()).find((centre) => centre.centre.centreId === "CG-BALOD-CHIKHLAKASA");
    expect(view?.openReports).toBe(1);
    expect(view?.stock.ASV).toMatchObject({ status: "out", vials: null });
  });

  it("does not turn any shipment quantity into a shelf vial count", async () => {
    const board = buildPublicBoard(await new MemoryRepo(clock()).snapshot());
    expect(board.length).toBeGreaterThan(60);
    expect(board.every((view) => view.stock.ASV.vials == null && view.stock.ARV.vials == null)).toBe(true);
    expect(board.some((view) => view.stock.ASV.status === "in" || view.stock.ARV.status === "in")).toBe(false);
  });
});
