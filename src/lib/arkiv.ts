import { createPublicClient, createWalletClient, ExpirationTime, jsonToPayload } from "@arkiv-network/sdk";
import type { Hex } from "viem";
import { tiramisu } from "@arkiv-network/sdk/chains";
import { eq } from "@arkiv-network/sdk/query";
import { u64, addr } from "@arkiv-network/sdk/attr";
import { http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { APP, type Drug, type Reason } from "./centres";

export const publicClient = createPublicClient({ chain: tiramisu, transport: http() });
export const walletFor = (key: Hex) =>
  createWalletClient({ account: privateKeyToAccount(key), chain: tiramisu, transport: http() });
type Wallet = ReturnType<typeof walletFor>;

export async function createCentre(admin: Wallet, c: { centreId: string; name: string; district: string; state: string; lat: number; lon: number }, wallet: Hex) {
  return admin.createEntity({
    payload: jsonToPayload({ name: c.name, lat: c.lat, lon: c.lon, phone: "demo" }),
    contentType: "application/json",
    attributes: { app: APP, kind: "centre", centreId: c.centreId, district: c.district, state: c.state, wallet: addr(wallet) },
    expires: ExpirationTime.fromDays(14),
    flags: { readonly: true },
  });
}

export async function postStock(centre: Wallet, centreId: string, drug: Drug, vials: number) {
  const status = vials === 0 ? "out" : vials < 5 ? "low" : "in";
  return centre.createEntity({
    payload: jsonToPayload({ note: "" }),
    contentType: "application/json",
    attributes: { app: APP, kind: "stock", centreId, drug, vials: u64(BigInt(vials)), status, postedAt: u64(BigInt(Math.floor(Date.now() / 1000))) },
    expires: ExpirationTime.fromHours(6),
  });
}

export async function fileReport(payer: Wallet, centreId: string, drug: Drug, reason: Reason) {
  const hourBucket = BigInt(Math.floor(Date.now() / 3_600_000));
  return payer.createEntity({
    payload: new Uint8Array(),
    contentType: "application/octet-stream",
    attributes: { app: APP, kind: "report", centreId, drug, reason, hourBucket: u64(hourBucket) },
    expires: ExpirationTime.fromHours(48),
    flags: { readonly: true, permissionlessExtension: true },
  });
}

export const confirmReport = (centre: Wallet, entityKey: Hex) =>
  centre.extendEntity({ entityKey, expires: ExpirationTime.fromDays(30) });

/** Keyless: registered centres (trusted only if created by the admin wallet). */
export const listCentres = (admin: Hex) =>
  publicClient.select({ key: true, attributes: true, payload: true })
    .where(eq("app", APP), eq("kind", "centre")).createdBy(admin).limit(100).fetch();

/** Keyless: stock posts for one centre, trusted only if $creator is that centre's wallet. */
export const stockFor = (centreId: string, centreWallet: Hex) =>
  publicClient.select({ key: true, attributes: true, createdAt: true, expiresAt: true })
    .where(eq("app", APP), eq("kind", "stock"), eq("centreId", centreId)).createdBy(centreWallet).limit(20).fetch();

export const reportsFor = (centreId: string, payer: Hex) =>
  publicClient.select({ key: true, attributes: true, expiresAt: true })
    .where(eq("app", APP), eq("kind", "report"), eq("centreId", centreId)).createdBy(payer).limit(50).fetch();
