import { createPublicClient, createWalletClient, ExpirationTime, InvalidExpiryError, jsonToPayload } from "@arkiv-network/sdk";
import type { Hex } from "viem";
import { tiramisu } from "@arkiv-network/sdk/chains";
import { eq } from "@arkiv-network/sdk/query";
import { u64, addr } from "@arkiv-network/sdk/attr";
import { privateKeyToAccount } from "viem/accounts";
import { CHAIN } from "./chain-attrs";
import { arkivTransport } from "./rpc";
import { APP, type Drug, type Reason } from "./centres";

export const publicClient = createPublicClient({ chain: tiramisu, transport: arkivTransport() });
export const walletFor = (key: Hex) =>
  createWalletClient({ account: privateKeyToAccount(key), chain: tiramisu, transport: arkivTransport() });
type Wallet = ReturnType<typeof walletFor>;

export async function createCentre(admin: Wallet, c: { centreId: string; name: string; district: string; state: string; lat: number; lon: number }, wallet: Hex) {
  return admin.createEntity({
    payload: jsonToPayload({ name: c.name, lat: c.lat, lon: c.lon, phone: "demo" }),
    contentType: "application/json",
    attributes: { app: APP, kind: "centre", [CHAIN.centreId]: c.centreId, district: c.district, state: c.state, wallet: addr(wallet) },
    expires: ExpirationTime.fromDays(14),
    flags: { readonly: true },
  });
}

export async function postStock(centre: Wallet, centreId: string, drug: Drug, vials: number) {
  const status = vials === 0 ? "out" : vials < 5 ? "low" : "in";
  return centre.createEntity({
    payload: jsonToPayload({ note: "" }),
    contentType: "application/json",
    attributes: { app: APP, kind: "stock", [CHAIN.centreId]: centreId, drug, vials: u64(BigInt(vials)), status, [CHAIN.postedAt]: u64(BigInt(Math.floor(Date.now() / 1000))) },
    expires: ExpirationTime.fromHours(6),
  });
}

/** Both drugs for one centre in one transaction. */
export async function postShift(centre: Wallet, centreId: string, counts: readonly (readonly [Drug, number])[]) {
  const postedAt = u64(BigInt(Math.floor(Date.now() / 1000)));
  return centre.executeBatch({
    creates: counts.map(([drug, vials]) => ({
      payload: jsonToPayload({ note: "" }),
      contentType: "application/json",
      attributes: { app: APP, kind: "stock", [CHAIN.centreId]: centreId, drug, vials: u64(BigInt(vials)), status: vials === 0 ? "out" : vials < 5 ? "low" : "in", [CHAIN.postedAt]: postedAt },
      expires: ExpirationTime.fromHours(6),
    })),
  });
}

export async function fileReport(payer: Wallet, centreId: string, drug: Drug, reason: Reason) {
  const hourBucket = BigInt(Math.floor(Date.now() / 3_600_000));
  return payer.createEntity({
    payload: new Uint8Array(),
    contentType: "application/octet-stream",
    attributes: { app: APP, kind: "report", [CHAIN.centreId]: centreId, drug, reason, [CHAIN.hourBucket]: u64(hourBucket) },
    expires: ExpirationTime.fromHours(48),
    flags: { readonly: true, permissionlessExtension: true },
  });
}

/** Ack first (that is the proof), then extend so the report stays readable. A longer expiry alone is not an ack. */
export async function confirmReport(centre: Wallet, centreId: string, entityKey: Hex) {
  const ack = await centre.createEntity({
    payload: new Uint8Array(),
    contentType: "application/octet-stream",
    attributes: { app: APP, kind: "ack", [CHAIN.centreId]: centreId, [CHAIN.reportKey]: entityKey },
    expires: ExpirationTime.fromDays(30),
    flags: { readonly: true },
  });
  try {
    await centre.extendEntity({ entityKey, expires: ExpirationTime.fromDays(30) });
  } catch (err) {
    if (!(err instanceof InvalidExpiryError)) throw err;
  }
  return ack;
}

/** Keyless: registered centres (trusted only if created by the admin wallet). */
export const listCentres = (admin: Hex) =>
  publicClient.select({ key: true, attributes: true, payload: true })
    .where(eq("app", APP), eq("kind", "centre")).createdBy(admin).limit(100).fetch();

/** Keyless: stock posts for one centre, trusted only if $creator is that centre's wallet. */
export const stockFor = (centreId: string, centreWallet: Hex) =>
  publicClient.select({ key: true, attributes: true, createdAt: true, expiresAt: true })
    .where(eq("app", APP), eq("kind", "stock"), eq(CHAIN.centreId, centreId)).createdBy(centreWallet).limit(20).fetch();

export const reportsFor = (centreId: string, payer: Hex) =>
  publicClient.select({ key: true, attributes: true, expiresAt: true })
    .where(eq("app", APP), eq("kind", "report"), eq(CHAIN.centreId, centreId)).createdBy(payer).limit(50).fetch();
