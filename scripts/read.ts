// Keyless read: no wallet. Usage: ADMIN_ADDR=0x... npm run read
import type { Hex } from "viem";
import { publicClient, listCentres } from "../src/lib/arkiv";
console.log("block timing", await publicClient.getBlockTiming());
const admin = process.env.ADMIN_ADDR as Hex | undefined;
if (admin) { const p = await listCentres(admin); console.log("centres", p.entities.length); for (const e of p.entities) console.log(e.key, e.attributes); }
else console.log("set ADMIN_ADDR to list registered centres");
