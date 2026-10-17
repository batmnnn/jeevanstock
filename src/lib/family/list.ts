import type { Drug } from "@/lib/centres";
import type { StockStatus } from "@/lib/domain";
import type { CentreView } from "@/lib/views";
import { directionsUrl } from "./place";
import { centreHref, verifyHref } from "./routes";
import { describeStock, type StockPhrases } from "./stock-text";

export interface FamilyDrugChip {
  status: StockStatus;
  vialsLabel: string;
  updatedLabel: string;
  proofHref: string | null;
}

/** Public card fields only. No wallet, creator, or phone. */
export interface FamilyListItem {
  centreId: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  href: string;
  directionsUrl: string | null;
  focus: FamilyDrugChip | null;
  asv: FamilyDrugChip;
  arv: FamilyDrugChip;
}

function chip(view: CentreView, drug: Drug, nowSec: number, copy: StockPhrases): FamilyDrugChip {
  const stock = view.stock[drug];
  return { status: stock.status, ...describeStock(stock, nowSec, copy), proofHref: verifyHref(stock.postKey) };
}

export function buildFamilyList(views: readonly CentreView[], nowSec: number, need: Drug | null, copy: StockPhrases): FamilyListItem[] {
  const safeNeed = need === "ASV" || need === "ARV" ? need : null;
  return views.map((view) => {
    const asv = chip(view, "ASV", nowSec, copy);
    const arv = chip(view, "ARV", nowSec, copy);
    return {
      centreId: view.centre.centreId,
      name: view.centre.name,
      district: view.centre.district,
      state: view.centre.state,
      lat: view.centre.lat,
      lon: view.centre.lon,
      href: centreHref(view.centre.centreId, safeNeed),
      directionsUrl: directionsUrl(view.centre.lat, view.centre.lon),
      focus: safeNeed === "ASV" ? asv : safeNeed === "ARV" ? arv : null,
      asv,
      arv,
    };
  });
}
