// Durg and Balod buildings, CGMSCL issue lines, and warehouse on-hand.
// An issue quantity is never a shelf count. Shelf status comes only from a trusted stock post.
import directoryJson from "@/data/cg-durg-balod.json";
import type { Drug } from "@/lib/centres";
import { isAcknowledged, trustedReports, type Centre, type DrugStock } from "@/lib/domain";
import { CENTRE_ID_RE } from "@/lib/family/ids";
import { common, type Lang } from "@/lib/i18n";
import type { Snapshot } from "@/lib/repo/types";
import { buildCentreViews, findCentreView, type CentreView, type ReportView } from "@/lib/views";

export interface SupplyIssue {
  drug: Drug;
  itemCode: "D418" | "D42";
  qty: number;
  issuedOn: string;
  expiresOn: string;
  batch: string;
}

export interface DirectoryCentre {
  centreId: string;
  name: string;
  kind: "PHC" | "CHC" | "UPHC";
  district: "Durg" | "Balod";
  state: "CG";
  lat: number | null;
  lon: number | null;
  issues: { ASV: SupplyIssue | null; ARV: SupplyIssue | null };
}

export interface PublicCentreView extends CentreView {
  supply: { ASV: SupplyIssue | null; ARV: SupplyIssue | null };
}

export const DIRECTORY_SOURCES = directoryJson.sources;

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const BATCH_RE = /^[A-Za-z0-9./-]{1,40}$/;
const MONTHS = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
} as const;

function inBox(lat: number, lon: number): boolean {
  return lat >= 17.5 && lat <= 24.5 && lon >= 80 && lon <= 84.5;
}

function parseIssue(drug: Drug, itemCode: "D418" | "D42", value: unknown): SupplyIssue | null {
  if (value == null || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (row.itemCode !== itemCode) return null;
  if (typeof row.qty !== "number" || !Number.isInteger(row.qty) || row.qty < 0 || row.qty > 100_000) return null;
  if (typeof row.issuedOn !== "string" || !DATE_RE.test(row.issuedOn)) return null;
  if (typeof row.expiresOn !== "string" || !DATE_RE.test(row.expiresOn)) return null;
  if (typeof row.batch !== "string" || !BATCH_RE.test(row.batch)) return null;
  return { drug, itemCode, qty: row.qty, issuedOn: row.issuedOn, expiresOn: row.expiresOn, batch: row.batch };
}

function parseCentre(value: unknown): DirectoryCentre | null {
  if (value == null || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.centreId !== "string" || !CENTRE_ID_RE.test(row.centreId)) return null;
  if (typeof row.name !== "string" || row.name.length < 3 || row.name.length > 80) return null;
  if (row.kind !== "PHC" && row.kind !== "CHC" && row.kind !== "UPHC") return null;
  if (row.district !== "Durg" && row.district !== "Balod") return null;
  if (row.state !== "CG") return null;
  const issues = row.issues as { ASV?: unknown; ARV?: unknown } | null;
  let lat: number | null = null;
  let lon: number | null = null;
  if (typeof row.lat === "number" && typeof row.lon === "number" && Number.isFinite(row.lat) && Number.isFinite(row.lon) && inBox(row.lat, row.lon)) {
    lat = row.lat;
    lon = row.lon;
  }
  return {
    centreId: row.centreId,
    name: row.name,
    kind: row.kind,
    district: row.district,
    state: "CG",
    lat,
    lon,
    issues: {
      ASV: parseIssue("ASV", "D418", issues?.ASV),
      ARV: parseIssue("ARV", "D42", issues?.ARV),
    },
  };
}

export const DIRECTORY: readonly DirectoryCentre[] = directoryJson.centres.flatMap((row) => {
  const centre = parseCentre(row);
  return centre ? [centre] : [];
});

const DIRECTORY_IDS = new Set(DIRECTORY.map((centre) => centre.centreId));

export const isDirectoryCentreId = (centreId: string) => DIRECTORY_IDS.has(centreId);

export function formatIsoDate(iso: string, lang: Lang): string | null {
  const match = DATE_RE.exec(iso);
  if (!match) return null;
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${day} ${MONTHS[lang][month - 1]} ${match[1]}`;
}

export interface LastIssueLabel {
  qty: number;
  dateLabel: string;
}

/** Words for a CGMSCL issue. Returns null when the row is not a real issue. Never a shelf status. */
export function describeIssue(issue: SupplyIssue | null, lang: Lang): string | null {
  if (!issue) return null;
  const on = formatIsoDate(issue.issuedOn, lang);
  const expires = formatIsoDate(issue.expiresOn, lang);
  if (!on || !expires) return null;
  return common[lang].issuedLine(common[lang].vials(issue.qty), on, expires);
}

/** Last shipment quantity and date, shown beside the shelf count. Never a shelf status. */
export function describeLastIssue(issue: SupplyIssue | null, lang: Lang): LastIssueLabel | null {
  if (!issue) return null;
  const dateLabel = formatIsoDate(issue.issuedOn, lang);
  if (!dateLabel) return null;
  return { qty: issue.qty, dateLabel };
}

export interface SupplyGap {
  none: number;
  total: number;
  since: string;
  /** Anti-venom vials ready to issue at the Durg warehouse, which also supplies Balod. */
  warehouseAsv: number;
  centres: number;
}

/** Rural PHCs with no anti-venom issue in the pulled window. UPHCs and CHCs are left out on purpose. */
export function asvGap(lang: Lang): SupplyGap {
  const phcs = DIRECTORY.filter((centre) => centre.kind === "PHC");
  return {
    none: phcs.filter((centre) => !centre.issues.ASV).length,
    total: phcs.length,
    since: formatIsoDate(directoryJson.issuesFrom, lang) ?? directoryJson.issuesFrom,
    warehouseAsv: directoryJson.warehouse.ASV.ready,
    centres: DIRECTORY.length,
  };
}

export function describeWarehouse(lang: Lang): string {
  const warehouse = directoryJson.warehouse;
  const on = formatIsoDate(warehouse.asOf, lang) ?? warehouse.asOf;
  const c = common[lang];
  return c.warehouseLine(c.vials(warehouse.ASV.ready), c.vials(warehouse.ARV.ready), on);
}

const BLANK = (drug: Drug): DrugStock => ({ drug, status: "stale", vials: null, postedAt: null, postKey: null });

export function isoDay(nowSec: number): string {
  if (!Number.isFinite(nowSec)) return "1970-01-01";
  return new Date(nowSec * 1000).toISOString().slice(0, 10);
}

/** An unexpired CGMSCL issue can mean the drug was sent. It is never a vial count. */
export function supplyChip(issue: SupplyIssue | null, today: string): "sent" | "stale" {
  if (!issue || !DATE_RE.test(issue.expiresOn) || !DATE_RE.test(today)) return "stale";
  return issue.expiresOn >= today ? "sent" : "stale";
}

function reportDay(hourBucket: number): string | null {
  if (!Number.isFinite(hourBucket)) return null;
  return new Date(hourBucket * 3_600_000).toISOString().slice(0, 10);
}

/**
 * Shelf chip for one drug.
 * A live centre post wins. A newer family report that the drug was missing beats an older shipment.
 * Otherwise an unexpired issue is "sent" and the vial count stays empty.
 */
export function presentDrug(
  posted: DrugStock | undefined,
  issue: SupplyIssue | null,
  reports: readonly Pick<ReportView, "drug" | "reason" | "acknowledged" | "hourBucket">[],
  drug: Drug,
  nowSec: number,
): DrugStock {
  if (
    posted &&
    posted.drug === drug &&
    (posted.status === "in" || posted.status === "low" || posted.status === "out") &&
    typeof posted.vials === "number" &&
    posted.postedAt != null
  ) {
    return posted;
  }
  const today = isoDay(nowSec);
  const denied = reports.some((report) => {
    if (report.drug !== drug || report.acknowledged || report.reason !== "out") return false;
    const day = reportDay(report.hourBucket);
    if (!day) return false;
    return day >= (issue?.issuedOn ?? "0000-01-01");
  });
  if (denied) return { drug, status: "out", vials: null, postedAt: null, postKey: null };
  if (supplyChip(issue, today) === "sent") return { drug, status: "sent", vials: null, postedAt: null, postKey: null };
  return BLANK(drug);
}

/** A missing post cannot invent a vial count. Issue evidence is applied in presentDrug. */
export function publicDrugStock(posted: DrugStock | undefined, drug: Drug): DrugStock {
  return presentDrug(posted, null, [], drug, 0);
}

function directoryCentre(entry: DirectoryCentre, admin: string): Centre {
  return {
    key: `directory:${entry.centreId}`,
    centreId: entry.centreId,
    name: entry.name,
    district: entry.district,
    state: entry.state,
    lat: entry.lat ?? Number.NaN,
    lon: entry.lon ?? Number.NaN,
    wallet: "0x" + "00".repeat(20),
    creator: admin,
  };
}

function reportsFor(entry: DirectoryCentre, snapshot: Snapshot, posted: CentreView | undefined): ReportView[] {
  if (posted) return posted.reports;
  const centre = directoryCentre(entry, snapshot.admin);
  return trustedReports(snapshot.reports, snapshot.payer)
    .filter((report) => report.centreId === entry.centreId)
    .map((report) => ({ ...report, acknowledged: isAcknowledged(report.key, snapshot.acks, centre) }))
    .sort((a, b) => b.createdAtBlock - a.createdAtBlock);
}

/** Public board: Durg and Balod only. Demo centres stay off this list. */
export function buildPublicBoard(snapshot: Snapshot): PublicCentreView[] {
  const live = new Map(buildCentreViews(snapshot).map((view) => [view.centre.centreId, view]));
  return DIRECTORY.map((entry) => {
    const posted = live.get(entry.centreId);
    const reports = reportsFor(entry, snapshot, posted);
    return {
      centre: posted
        ? { ...posted.centre, name: entry.name, district: entry.district, state: entry.state, lat: entry.lat ?? Number.NaN, lon: entry.lon ?? Number.NaN }
        : directoryCentre(entry, snapshot.admin),
      stock: {
        ASV: presentDrug(posted?.stock.ASV, entry.issues.ASV, reports, "ASV", snapshot.nowSec),
        ARV: presentDrug(posted?.stock.ARV, entry.issues.ARV, reports, "ARV", snapshot.nowSec),
      },
      reports,
      openReports: reports.filter((report) => !report.acknowledged).length,
      supply: entry.issues,
    };
  }).sort((a, b) => {
    const newer = (view: PublicCentreView) => {
      const asv = view.supply.ASV?.issuedOn ?? "";
      const arv = view.supply.ARV?.issuedOn ?? "";
      return asv > arv ? asv : arv;
    };
    const byDate = newer(b).localeCompare(newer(a));
    return byDate || a.centre.name.localeCompare(b.centre.name);
  });
}

/** Directory centre, or a demo centre when the id is one of the staff fixtures. */
export function findShownCentre(snapshot: Snapshot, centreId: string): PublicCentreView | null {
  const listed = buildPublicBoard(snapshot).find((view) => view.centre.centreId === centreId);
  if (listed) return listed;
  const demo = findCentreView(snapshot, centreId);
  if (!demo) return null;
  return { ...demo, supply: { ASV: null, ARV: null } };
}
