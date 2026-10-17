import type { Drug } from "@/lib/centres";
import { describeIssue, describeLastIssue, type LastIssueLabel, type PublicCentreView } from "@/lib/directory";
import type { StockStatus } from "@/lib/domain";
import type { Lang } from "@/lib/i18n";
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
  issueAsv: string | null;
  issueArv: string | null;
  lastAsv: LastIssueLabel | null;
  lastArv: LastIssueLabel | null;
  supplyOn: { ASV: string | null; ARV: string | null };
}

function chip(view: CentreView, drug: Drug, nowSec: number, copy: StockPhrases): FamilyDrugChip {
  const stock = view.stock[drug];
  return { status: stock.status, ...describeStock(stock, nowSec, copy), proofHref: verifyHref(stock.postKey) };
}

type ListedView = CentreView & Partial<Pick<PublicCentreView, "supply">>;

export function buildFamilyList(
  views: readonly ListedView[],
  nowSec: number,
  need: Drug | null,
  copy: StockPhrases,
  lang: Lang = "en",
): FamilyListItem[] {
  const safeNeed = need === "ASV" || need === "ARV" ? need : null;
  return views.map((view) => {
    const asv = chip(view, "ASV", nowSec, copy);
    const arv = chip(view, "ARV", nowSec, copy);
    const lat = Number.isFinite(view.centre.lat) ? view.centre.lat : Number.NaN;
    const lon = Number.isFinite(view.centre.lon) ? view.centre.lon : Number.NaN;
    return {
      centreId: view.centre.centreId,
      name: view.centre.name,
      district: view.centre.district,
      state: view.centre.state,
      lat,
      lon,
      href: centreHref(view.centre.centreId, safeNeed),
      directionsUrl: directionsUrl(lat, lon),
      focus: safeNeed === "ASV" ? asv : safeNeed === "ARV" ? arv : null,
      asv,
      arv,
      issueAsv: describeIssue(view.supply?.ASV ?? null, lang),
      issueArv: describeIssue(view.supply?.ARV ?? null, lang),
      lastAsv: describeLastIssue(view.supply?.ASV ?? null, lang),
      lastArv: describeLastIssue(view.supply?.ARV ?? null, lang),
      supplyOn: {
        ASV: view.supply?.ASV?.issuedOn ?? null,
        ARV: view.supply?.ARV?.issuedOn ?? null,
      },
    };
  });
}
