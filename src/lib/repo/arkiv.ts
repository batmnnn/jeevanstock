import "server-only";
import { createPublicClient, createWalletClient, ExpirationTime, jsonToPayload, NoEntityFoundError } from "@arkiv-network/sdk";
import { tiramisu } from "@arkiv-network/sdk/chains";
import { eq } from "@arkiv-network/sdk/query";
import { u64 } from "@arkiv-network/sdk/attr";
import { http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { APP, type Drug, type Reason } from "../centres";
import { CONFIRMED_TTL_DAYS, hourBucket, isValidVials, REPORT_TTL_HOURS, statusForVials, STOCK_TTL_HOURS } from "../domain";
import type { AppConfig } from "../config";
import { attrs, compact, decodeCentre, decodeReport, decodeStock, type RawEntity } from "./decode";
import { RepoError, type EntityProof, type Repo, type Snapshot, type WriteResult } from "./types";

const SNAPSHOT_TTL_MS = 5_000;
const MAX_ROWS = 1_000;
const SELECT = { key: true, creator: true, owner: true, attributes: true, createdAt: true, expiresAt: true } as const;

export class ArkivRepo implements Repo {
  readonly source = "arkiv" as const;
  private pub = createPublicClient({ chain: tiramisu, transport: http() });
  private admin: Hex;
  private payer: Hex;
  private cache: { at: number; value: Promise<Snapshot> } | null = null;

  constructor(private cfg: AppConfig) {
    if (!cfg.adminKey || !cfg.payerKey) throw new Error("ArkivRepo needs ADMIN_KEY and PAYER_KEY");
    this.admin = privateKeyToAccount(cfg.adminKey).address;
    this.payer = privateKeyToAccount(cfg.payerKey).address;
  }

  private wallet(key: Hex) {
    return createWalletClient({ account: privateKeyToAccount(key), chain: tiramisu, transport: http() });
  }

  private async all(build: () => AsyncIterable<RawEntity>): Promise<RawEntity[]> {
    const out: RawEntity[] = [];
    for await (const e of build()) {
      out.push(e);
      if (out.length >= MAX_ROWS) break;
    }
    return out;
  }

  private async load(): Promise<Snapshot> {
    const where = (kind: string) => [eq("app", APP), eq("kind", kind)];
    const [centres, stock, reports, timing] = await Promise.all([
      this.all(() => this.pub.select({ ...SELECT, payload: true }).where(where("centre")).createdBy(this.admin).limit(200)),
      // All stock posts; trust is enforced per centre by matching $creator to the registered wallet.
      this.all(() => this.pub.select(SELECT).where(where("stock")).limit(200)),
      this.all(() => this.pub.select(SELECT).where(where("report")).createdBy(this.payer).limit(200)),
      this.pub.getBlockTiming(),
    ]);
    return {
      centres: compact(centres.map(decodeCentre)),
      stock: compact(stock.map(decodeStock)),
      reports: compact(reports.map(decodeReport)),
      currentBlock: Number(timing.currentBlock),
      nowSec: Math.floor(Date.now() / 1000),
      admin: this.admin,
      payer: this.payer,
    };
  }

  snapshot(): Promise<Snapshot> {
    if (this.cache && Date.now() - this.cache.at < SNAPSHOT_TTL_MS) return this.cache.value;
    const value = this.load().catch((err) => {
      this.cache = null;
      throw new RepoError("unavailable", `Arkiv RPC unavailable: ${(err as Error).message}`);
    });
    this.cache = { at: Date.now(), value };
    return value;
  }

  private invalidate() {
    this.cache = null;
  }

  async getEntity(key: string): Promise<EntityProof | null> {
    if (!/^0x[0-9a-fA-F]{64}$/.test(key)) return null;
    try {
      const e = await this.pub.getEntity(key as Hex);
      const a = attrs(e as RawEntity);
      if (a.app !== APP) return null;
      const attributes: Record<string, string> = {};
      for (const [k, v] of Object.entries(a)) attributes[k] = String(v);
      return {
        key,
        kind: String(a.kind ?? "unknown"),
        creator: e.creator ?? "",
        owner: e.owner ?? "",
        createdAtBlock: Number(e.createdAt ?? 0n),
        expiresAtBlock: Number(e.expiresAt ?? 0n),
        readonly: e.creationFlags?.readonly ?? false,
        permissionlessExtension: e.creationFlags?.permissionlessExtension ?? false,
        attributes,
      };
    } catch (err) {
      if (err instanceof NoEntityFoundError) return null;
      throw new RepoError("unavailable", (err as Error).message);
    }
  }

  private async registeredCentre(centreId: string) {
    const snap = await this.snapshot();
    const c = snap.centres.find((x) => x.centreId === centreId);
    if (!c) throw new RepoError("not_found", "unknown centre");
    return c;
  }

  private centreKey(centreId: string): Hex {
    const k = this.cfg.centreKeys.get(centreId);
    if (!k) throw new RepoError("forbidden", "no signing key for centre");
    return k;
  }

  async postStock(centreId: string, drug: Drug, vials: number): Promise<WriteResult> {
    if (!isValidVials(vials)) throw new RepoError("invalid", "vials out of range");
    const c = await this.registeredCentre(centreId);
    const w = this.wallet(this.centreKey(centreId));
    if (w.account.address.toLowerCase() !== c.wallet.toLowerCase()) throw new RepoError("forbidden", "signing key does not match registered wallet");
    const r = await w.createEntity({
      payload: jsonToPayload({ note: "" }),
      contentType: "application/json",
      attributes: {
        app: APP, kind: "stock", centreId, drug, vials: u64(BigInt(vials)), status: statusForVials(vials),
        postedAt: u64(BigInt(Math.floor(Date.now() / 1000))),
      },
      expires: ExpirationTime.fromHours(STOCK_TTL_HOURS),
    });
    this.invalidate();
    return { entityKey: r.entityKey, txHash: r.txHash };
  }

  async fileReport(centreId: string, drug: Drug, reason: Reason): Promise<WriteResult> {
    await this.registeredCentre(centreId);
    const r = await this.wallet(this.cfg.payerKey!).createEntity({
      payload: new Uint8Array(),
      contentType: "application/octet-stream",
      attributes: { app: APP, kind: "report", centreId, drug, reason, hourBucket: u64(BigInt(hourBucket(Date.now()))) },
      expires: ExpirationTime.fromHours(REPORT_TTL_HOURS),
      flags: { readonly: true, permissionlessExtension: true },
    });
    this.invalidate();
    return { entityKey: r.entityKey, txHash: r.txHash };
  }

  async confirmReport(centreId: string, reportKey: string): Promise<WriteResult> {
    const proof = await this.getEntity(reportKey);
    if (!proof || proof.kind !== "report") throw new RepoError("not_found", "report not found or expired");
    if (proof.creator.toLowerCase() !== this.payer.toLowerCase()) throw new RepoError("forbidden", "untrusted report");
    if (proof.attributes.centreId !== centreId) throw new RepoError("forbidden", "report belongs to another centre");
    const r = await this.wallet(this.centreKey(centreId)).extendEntity({
      entityKey: reportKey as Hex,
      expires: ExpirationTime.fromDays(CONFIRMED_TTL_DAYS),
    });
    this.invalidate();
    return { entityKey: r.entityKey, txHash: r.txHash };
  }
}
