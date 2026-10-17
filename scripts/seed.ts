// Seeds synthetic centres + stock + one report on Tiramisu. Needs funded throwaway keys in env.
import type { Hex } from "viem";
import { CENTRES } from "../src/lib/centres";
import { walletFor, createCentre, postStock, fileReport, publicClient } from "../src/lib/arkiv";

const need = (k: string) => { const v = process.env[k]; if (!v) throw new Error(`missing ${k} (see .env.example)`); return v; };
const admin = walletFor(need("ADMIN_KEY") as Hex);
const payer = walletFor(need("PAYER_KEY") as Hex);
const centreKeys = need("CENTRE_KEYS").split(",") as Hex[];
if (centreKeys.length !== CENTRES.length) throw new Error("CENTRE_KEYS count must match CENTRES");

for (const [i, c] of CENTRES.entries()) {
  const w = walletFor(centreKeys[i]);
  const reg = await createCentre(admin, c, w.account.address);
  console.log("centre", c.centreId, reg.entityKey, reg.txHash);
  const s1 = await postStock(w, c.centreId, "ASV", [0, 12, 3][i] ?? 0);
  const s2 = await postStock(w, c.centreId, "ARV", [4, 20, 0][i] ?? 0);
  for (const s of [s1, s2]) {
    const r = await publicClient.waitForTransactionReceipt({ hash: s.txHash });
    console.log("  stock", s.entityKey, "gasUsed", r.gasUsed, "effGasPrice", r.effectiveGasPrice);
  }
}
const rep = await fileReport(payer, CENTRES[0].centreId, "ASV", "out");
console.log("report", rep.entityKey, rep.txHash);
