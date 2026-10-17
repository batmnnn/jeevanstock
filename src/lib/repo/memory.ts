import type { Drug, Reason } from "../centres";
import { CENTRES } from "../centres";
import { isDirectoryCentreId } from "../directory";
import {
  blocksForHours,
  CONFIRMED_TTL_DAYS,
  hourBucket,
  isValidVials,
  REPORT_TTL_HOURS,
  statusForVials,
  STOCK_TTL_HOURS,
  BLOCK_SECONDS,
  type Ack,
  type Centre,
  type Report,
  type StockPost,
} from "../domain";
import { RepoError, type EntityProof, type Repo, type Snapshot, type WriteResult } from "./types";

type Row =
  | { kind: "centre"; data: Centre; createdAtBlock: number; expiresAtBlock: number; readonly: true; ple: false; owner: string }
  | { kind: "stock"; data: StockPost; createdAtBlock: number; expiresAtBlock: number; readonly: false; ple: false; owner: string }
  | { kind: "report"; data: Report; createdAtBlock: number; expiresAtBlock: number; readonly: true; ple: true; owner: string }
  | { kind: "ack"; data: Ack; createdAtBlock: number; expiresAtBlock: number; readonly: true; ple: false; owner: string };

const addr = (n: number) => "0x" + n.toString(16).padStart(40, "0");
export const MEMORY_ADMIN = addr(0xad);
export const MEMORY_PAYER = addr(0xba);
export const memoryCentreWallet = (i: number) => addr(0xc0 + i);

let counter = 0;
const randKey = () => {
  counter += 1;
  const rnd = Array.from({ length: 56 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return "0x" + counter.toString(16).padStart(8, "0") + rnd;
};

/**
 * In-memory stand-in for Arkiv with the same trust semantics:
 * blocks advance every 2s, entities expire, reports are readonly, only the centre wallet may extend.
 */
export class MemoryRepo implements Repo {
  readonly source = "memory" as const;
  private rows = new Map<string, Row>();
  private readonly t0: number;

  constructor(
    private now: () => number = () => Date.now(),
    opts: { seed?: boolean } = { seed: true },
  ) {
    this.t0 = now();
    for (const [i, c] of CENTRES.entries()) {
      const key = randKey();
      const data: Centre = { key, ...c, wallet: memoryCentreWallet(i), creator: MEMORY_ADMIN };
      this.rows.set(key, {
        kind: "centre", data, createdAtBlock: this.block(), expiresAtBlock: this.block() + blocksForHours(24 * 14),
        readonly: true, ple: false, owner: MEMORY_ADMIN,
      });
    }
    if (opts.seed !== false) {
      const seed: Array<[number, Drug, number]> = [[0, "ASV", 0], [0, "ARV", 4], [1, "ASV", 12], [1, "ARV", 20], [2, "ASV", 3]];
      for (const [i, drug, vials] of seed) this.insertStock(CENTRES[i].centreId, drug, vials, memoryCentreWallet(i), 40 * 60);
    }
  }

  private block(): number {
    return 1_000_000 + Math.floor((this.now() - this.t0) / 1000 / BLOCK_SECONDS);
  }
  private nowSec() {
    return Math.floor(this.now() / 1000);
  }
  private live(r: Row) {
    return r.expiresAtBlock > this.block();
  }
  private centreById(centreId: string): { c: Centre; idx: number } | null {
    const idx = CENTRES.findIndex((c) => c.centreId === centreId);
    for (const r of this.rows.values()) if (r.kind === "centre" && this.live(r) && r.data.centreId === centreId) return { c: r.data, idx };
    return null;
  }

  /** Test hook: a centre row with any creator. The snapshot keeps it only when the creator is the admin. */
  insertCentre(data: Centre): void {
    this.rows.set(data.key, {
      kind: "centre", data, createdAtBlock: this.block(), expiresAtBlock: this.block() + blocksForHours(24 * 14),
      readonly: true, ple: false, owner: data.creator,
    });
  }

  /** Test hook: a report with any creator. Only the payer is trusted, and only the payer's can be confirmed. */
  insertReport(centreId: string, creator: string): WriteResult {
    const key = randKey();
    const data: Report = {
      key, centreId, drug: "ASV", reason: "out", hourBucket: hourBucket(this.now()), creator,
      createdAtBlock: this.block(), expiresAtBlock: this.block() + blocksForHours(REPORT_TTL_HOURS),
    };
    this.rows.set(key, {
      kind: "report", data, createdAtBlock: data.createdAtBlock, expiresAtBlock: data.expiresAtBlock,
      readonly: true, ple: true, owner: creator,
    });
    return { entityKey: key, txHash: "0x" + key.slice(2).padEnd(64, "b") };
  }

  /** Test hook: an ack with any creator. Only the centre's registered wallet is trusted. */
  insertAck(centreId: string, reportKey: string, creator: string): WriteResult {
    const key = randKey();
    const data: Ack = {
      key, centreId, reportKey, creator, createdAtBlock: this.block(),
      expiresAtBlock: this.block() + blocksForHours(24 * CONFIRMED_TTL_DAYS),
    };
    this.rows.set(key, {
      kind: "ack", data, createdAtBlock: data.createdAtBlock, expiresAtBlock: data.expiresAtBlock,
      readonly: true, ple: false, owner: creator,
    });
    return { entityKey: key, txHash: "0x" + key.slice(2).padEnd(64, "a") };
  }

  /** Test hook: move expiry the way a permissionless extend would, without writing an ack. */
  bumpExpiry(entityKey: string, expiresAtBlock: number): void {
    const r = this.rows.get(entityKey);
    if (!r) return;
    r.expiresAtBlock = expiresAtBlock;
    if (r.kind !== "centre") r.data.expiresAtBlock = expiresAtBlock;
  }

  /** Test hook: insert a post with an arbitrary creator (used to prove spoofed posts are ignored). */
  insertStock(centreId: string, drug: Drug, vials: number, creator: string, ageSec = 0): WriteResult {
    const key = randKey();
    const data: StockPost = {
      key, centreId, drug, vials, status: statusForVials(vials), postedAt: this.nowSec() - ageSec, creator,
      createdAtBlock: this.block(), expiresAtBlock: this.block() + blocksForHours(STOCK_TTL_HOURS) - Math.floor(ageSec / BLOCK_SECONDS),
    };
    this.rows.set(key, { kind: "stock", data, createdAtBlock: data.createdAtBlock, expiresAtBlock: data.expiresAtBlock, readonly: false, ple: false, owner: creator });
    return { entityKey: key, txHash: "0x" + key.slice(2).padEnd(64, "0") };
  }

  async snapshot(): Promise<Snapshot> {
    const centres: Centre[] = [];
    const stock: StockPost[] = [];
    const reports: Report[] = [];
    const acks: Ack[] = [];
    for (const r of this.rows.values()) {
      if (!this.live(r)) continue;
      if (r.kind === "centre") {
        if (r.data.creator.toLowerCase() === MEMORY_ADMIN.toLowerCase()) centres.push(r.data);
      } else if (r.kind === "stock") stock.push(r.data);
      else if (r.kind === "report") reports.push({ ...r.data, expiresAtBlock: r.expiresAtBlock });
      else acks.push({ ...r.data, expiresAtBlock: r.expiresAtBlock });
    }
    return { centres, stock, reports, acks, currentBlock: this.block(), nowSec: this.nowSec(), admin: MEMORY_ADMIN, payer: MEMORY_PAYER };
  }

  async getEntity(key: string): Promise<EntityProof | null> {
    const r = this.rows.get(key);
    if (!r || !this.live(r)) return null;
    const attributes: Record<string, string> = {};
    for (const [k, v] of Object.entries(r.data)) if (k !== "key" && k !== "createdAtBlock" && k !== "expiresAtBlock" && k !== "creator") attributes[k] = String(v);
    return {
      key, kind: r.kind, creator: r.data.creator, owner: r.owner, createdAtBlock: r.createdAtBlock, expiresAtBlock: r.expiresAtBlock,
      readonly: r.readonly, permissionlessExtension: r.ple, attributes,
    };
  }

  async postStock(centreId: string, drug: Drug, vials: number): Promise<WriteResult> {
    if (!isValidVials(vials)) throw new RepoError("invalid", "vials out of range");
    const found = this.centreById(centreId);
    if (!found) throw new RepoError("not_found", "unknown centre");
    return this.insertStock(centreId, drug, vials, found.c.wallet);
  }

  async postShift(centreId: string, counts: readonly { drug: Drug; vials: number }[]): Promise<WriteResult[]> {
    if (counts.some((c) => !isValidVials(c.vials))) throw new RepoError("invalid", "vials out of range");
    const found = this.centreById(centreId);
    if (!found) throw new RepoError("not_found", "unknown centre");
    return counts.map((c) => this.insertStock(centreId, c.drug, c.vials, found.c.wallet));
  }

  async fileReport(centreId: string, drug: Drug, reason: Reason): Promise<WriteResult> {
    if (!this.centreById(centreId) && !isDirectoryCentreId(centreId)) throw new RepoError("not_found", "unknown centre");
    const key = randKey();
    const data: Report = {
      key, centreId, drug, reason, hourBucket: hourBucket(this.now()), creator: MEMORY_PAYER,
      createdAtBlock: this.block(), expiresAtBlock: this.block() + blocksForHours(REPORT_TTL_HOURS),
    };
    this.rows.set(key, { kind: "report", data, createdAtBlock: data.createdAtBlock, expiresAtBlock: data.expiresAtBlock, readonly: true, ple: true, owner: MEMORY_PAYER });
    return { entityKey: key, txHash: "0x" + key.slice(2).padEnd(64, "0") };
  }

  private trustedAck(centreId: string, reportKey: string, wallet: string): boolean {
    const want = reportKey.toLowerCase();
    for (const r of this.rows.values()) {
      if (r.kind !== "ack" || !this.live(r)) continue;
      if (r.data.centreId === centreId && r.data.reportKey.toLowerCase() === want && r.data.creator.toLowerCase() === wallet.toLowerCase()) return true;
    }
    return false;
  }

  async confirmReport(centreId: string, reportKey: string): Promise<WriteResult> {
    const r = this.rows.get(reportKey);
    if (!r || !this.live(r) || r.kind !== "report") throw new RepoError("not_found", "report not found or expired");
    if (r.data.creator.toLowerCase() !== MEMORY_PAYER.toLowerCase()) throw new RepoError("forbidden", "untrusted report");
    if (r.data.centreId !== centreId) throw new RepoError("forbidden", "report belongs to another centre");
    const found = this.centreById(centreId);
    if (!found) throw new RepoError("not_found", "unknown centre");
    const next = this.block() + blocksForHours(24 * CONFIRMED_TTL_DAYS);
    if (next > r.expiresAtBlock) r.expiresAtBlock = next;
    if (this.trustedAck(centreId, reportKey, found.c.wallet)) throw new RepoError("invalid", "already acknowledged");
    const ack = this.insertAck(centreId, reportKey, found.c.wallet);
    return { entityKey: reportKey, txHash: ack.txHash };
  }
}
