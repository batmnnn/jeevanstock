// Keyless read: no wallet, no signing. Anyone can run this to audit the board.
// Usage: ADMIN_ADDR=0x... npm run read   (or with .env.chain present, the admin address is derived)
import type { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import "./env";
import { publicClient, listCentres } from "../src/lib/arkiv";

console.log("block timing", await publicClient.getBlockTiming());
const admin = (process.env.ADMIN_ADDR as Hex | undefined) ?? (process.env.ADMIN_KEY ? privateKeyToAccount(process.env.ADMIN_KEY as Hex).address : undefined);
if (admin) {
  const p = await listCentres(admin);
  console.log(`centres registered by ${admin}:`, p.entities.length);
  for (const e of p.entities) console.log(e.key, e.attributes);
} else console.log("set ADMIN_ADDR to list registered centres");
