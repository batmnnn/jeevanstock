import { describe, expect, it } from "vitest";
import type { Drug } from "@/lib/centres";
import type { Centre, DrugStock, StockStatus } from "@/lib/domain";
import { buildFamilyList } from "@/lib/family/list";
import { orderFamilyList } from "@/lib/family/place";
import { describeStock, type StockPhrases } from "@/lib/family/stock-text";
import { common } from "@/lib/i18n";
import { MemoryRepo, MEMORY_PAYER, memoryCentreWallet } from "@/lib/repo/memory";
import type { CentreView } from "@/lib/views";
import { buildCentreViews } from "@/lib/views";
import { family } from "@/messages/family";

const HEX = `0x${"ab".repeat(32)}`;

function phrases(lang: "hi" | "en"): StockPhrases {
  const c = common[lang];
  const t = family[lang];
  return { vials: c.vials, minutesAgo: c.minutesAgo, noUpdate: c.noUpdate, vialsUnknown: t.vialsUnknown, updated: t.updated };
}

function stock(drug: Drug, over: Partial<DrugStock> = {}): DrugStock {
  return { drug, status: "in", vials: 10, postedAt: 1_700_000_000, postKey: HEX, ...over };
}

function view(over: Partial<Centre> = {}, asv: Partial<DrugStock> = {}, arv: Partial<DrugStock> = {}): CentreView {
  const centre: Centre = {
    key: HEX,
    centreId: "DEMO-RAMPUR-1",
    name: "Demo PHC Rampur-1",
    district: "Demo District A",
    state: "MP",
    lat: 24.1,
    lon: 80.1,
    wallet: "0x" + "c0".repeat(20),
    creator: "0x" + "ad".repeat(20),
    ...over,
  };
  return {
    centre,
    stock: { ASV: stock("ASV", asv), ARV: stock("ARV", { vials: 4, status: "low", ...arv }) },
    reports: [],
    openReports: 0,
  };
}

function keysDeep(value: unknown, out = new Set<string>()): Set<string> {
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      out.add(key);
      keysDeep(child, out);
    }
  }
  return out;
}

describe("describeStock", () => {
  const copy = phrases("en");
  const now = 1_700_000_000 + 40 * 60;

  it("says how many vials and when the post was made", () => {
    expect(describeStock(stock("ASV", { vials: 12, postedAt: now - 40 * 60 }), now, copy)).toEqual({
      vialsLabel: "12 vials",
      updatedLabel: "Updated 40 min ago",
    });
    expect(describeStock(stock("ASV", { vials: 0, status: "out", postedAt: now }), now, phrases("hi")).updatedLabel).toBe("अभी अपडेट");
  });

  it("uses the stale sentence and hides a missing count", () => {
    expect(describeStock(stock("ARV", { status: "stale", vials: null, postedAt: null }), now, copy)).toEqual({
      vialsLabel: "Unknown",
      updatedLabel: "No update in 6 hours",
    });
    expect(describeStock(stock("ARV", { status: "stale", vials: 9, postedAt: now }), now, copy).updatedLabel).toBe("No update in 6 hours");
  });

  it("does not format impossible vial counts", () => {
    for (const vials of [-1, 1000, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(describeStock(stock("ASV", { vials: vials as number }), now, copy).vialsLabel).toBe("Unknown");
    }
  });
});

describe("buildFamilyList", () => {
  it("matches the demo board for a snakebite", async () => {
    const repo = new MemoryRepo(() => 1_800_000_000_000);
    const snap = await repo.snapshot();
    const items = buildFamilyList(buildCentreViews(snap), snap.nowSec, "ASV", phrases("en"));
    const ordered = orderFamilyList(items, "ASV", null);
    const byId = Object.fromEntries(ordered.map((item) => [item.centreId, item]));

    expect(ordered.map((item) => item.centreId)).toEqual(["DEMO-SONPUR-CHC", "DEMO-KALAPUR-2", "DEMO-RAMPUR-1"]);
    expect(byId["DEMO-SONPUR-CHC"]?.focus).toMatchObject({ status: "in", vialsLabel: "12 vials", updatedLabel: "Updated 40 min ago" });
    expect(byId["DEMO-SONPUR-CHC"]?.focus?.proofHref).toMatch(/^\/verify\/0x[0-9a-fA-F]{64}$/);
    expect(byId["DEMO-KALAPUR-2"]?.focus?.status).toBe("low");
    expect(byId["DEMO-RAMPUR-1"]?.focus).toMatchObject({ status: "out", vialsLabel: "0 vials" });
    expect(byId["DEMO-KALAPUR-2"]?.arv).toMatchObject({ status: "stale", vialsLabel: "Unknown", updatedLabel: "No update in 6 hours", proofHref: null });
    expect(byId["DEMO-SONPUR-CHC"]?.href).toBe("/centre/DEMO-SONPUR-CHC?need=ASV");
    expect(byId["DEMO-SONPUR-CHC"]?.directionsUrl).toBe("https://www.google.com/maps/dir/?api=1&destination=24.2,80.2");

    const hindi = buildFamilyList(buildCentreViews(snap), snap.nowSec, "ASV", phrases("hi"));
    expect(hindi.find((item) => item.centreId === "DEMO-SONPUR-CHC")?.focus?.updatedLabel).toBe("40 मिनट पहले अपडेट");
    expect(JSON.stringify(items)).not.toContain(MEMORY_PAYER);
    expect(JSON.stringify(items)).not.toContain(memoryCentreWallet(0));
    expect(keysDeep(items).has("wallet")).toBe(false);
    expect(keysDeep(items).has("creator")).toBe(false);
    expect(keysDeep(items).has("phone")).toBe(false);
  });

  it("links a dog bite to ARV and leaves the compact list without a focus drug", async () => {
    const repo = new MemoryRepo(() => 1_800_000_000_000);
    const snap = await repo.snapshot();
    const views = buildCentreViews(snap);
    const arv = buildFamilyList(views, snap.nowSec, "ARV", phrases("en"));
    expect(arv.every((item) => item.href.endsWith("?need=ARV"))).toBe(true);
    expect(arv.find((item) => item.centreId === "DEMO-RAMPUR-1")?.focus?.status).toBe("low");
    const compact = buildFamilyList(views, snap.nowSec, null, phrases("en"));
    expect(compact.every((item) => item.focus === null && !item.href.includes("?"))).toBe(true);
    expect(orderFamilyList(compact, null, null).map((item) => item.name)).toEqual(views.map((item) => item.centre.name));
  });

  it("does not put a hostile centre id or a scriptable name into a URL", () => {
    const hostile = view({
      centreId: "../admin",
      name: "<img src=x onerror=alert(1)>",
      lat: Number.NaN,
      lon: 80,
    });
    const [item] = buildFamilyList([hostile], 1_700_000_000, "ASV", phrases("en"));
    expect(item?.href).toBe("/");
    expect(item?.directionsUrl).toBeNull();
    expect(item?.name).toBe("<img src=x onerror=alert(1)>");
    expect(item?.href).not.toContain("<");
    expect(JSON.stringify(item?.directionsUrl)).not.toContain("<");
  });

  it("returns an empty list when there are no centres", () => {
    expect(buildFamilyList([], 0, "ASV", phrases("en"))).toEqual([]);
  });

  it("orders by stock, not by a closer empty centre", () => {
    const rows = [
      view({ centreId: "DEMO-OUT", name: "Alpha", lat: 24.1, lon: 80.1 }, { status: "out" as StockStatus, vials: 0 }),
      view({ centreId: "DEMO-IN", name: "Zulu", lat: 30, lon: 80 }, { status: "in" as StockStatus, vials: 12 }),
    ];
    const items = buildFamilyList(rows, 1_700_000_000, "ASV", phrases("en"));
    const distances = { "DEMO-OUT": 0, "DEMO-IN": 400 };
    expect(orderFamilyList(items, "ASV", distances).map((item) => item.centreId)).toEqual(["DEMO-IN", "DEMO-OUT"]);
  });
});
