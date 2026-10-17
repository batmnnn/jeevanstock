// Registers the synthetic centres (idempotent) and posts fresh stock on Tiramisu.
// Usage: npm run seed            (re-run each shift to keep demo stock from going stale; CI does it every 4h)
import { loadKeys } from "./env";
import { CENTRES } from "../src/lib/centres";
import { walletFor, createCentre, postShift, listCentres } from "../src/lib/arkiv";
import { attrs, type RawEntity } from "../src/lib/repo/decode";

const keys = loadKeys();
const admin = walletFor(keys.admin);
const existing = await listCentres(admin.account.address);
const registered = new Map<string, string>();
for (const e of existing.entities) {
  const a = attrs(e as RawEntity);
  registered.set(String(a.centreId), String(a.wallet).toLowerCase());
}

const DEMO_STOCK: Record<string, [number, number]> = {
  "DEMO-RAMPUR-1": [0, 4],
  "DEMO-SONPUR-CHC": [12, 20],
  "DEMO-KALAPUR-2": [3, 0],
};

for (const [i, c] of CENTRES.entries()) {
  const w = walletFor(keys.centreKeys[i]);
  const known = registered.get(c.centreId);
  if (!known) {
    const reg = await createCentre(admin, c, w.account.address);
    console.log("registered", c.centreId, reg.entityKey, reg.txHash);
  } else if (known !== w.account.address.toLowerCase()) {
    throw new Error(`${c.centreId} is registered to ${known}, not ${w.account.address} — wrong CENTRE_KEYS order?`);
  } else {
    console.log("already registered", c.centreId);
  }
  const [asv, arv] = DEMO_STOCK[c.centreId] ?? [5, 5];
  const s = await postShift(w, c.centreId, [["ASV", asv], ["ARV", arv]]);
  console.log(`  stock ASV=${asv} ARV=${arv}`, s.createdEntities.join(" "), s.txHash);
}
console.log("done. Centres expire in 14 days; stock in 6h.");
process.exit(0);
