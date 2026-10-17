// Shared env loading for CLI scripts (Node 22 has process.loadEnvFile).
import { existsSync } from "node:fs";
import type { Hex } from "viem";
import { CENTRES } from "../src/lib/centres";

for (const f of [".env.chain", ".env"]) if (existsSync(f)) process.loadEnvFile(f);

export const need = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`missing ${k} (run npm run keygen, see .env.example)`);
  return v;
};

export function loadKeys() {
  const centreKeys = need("CENTRE_KEYS").split(",").map((s) => s.trim()) as Hex[];
  if (centreKeys.length !== CENTRES.length) throw new Error("CENTRE_KEYS count must match CENTRES");
  return { admin: need("ADMIN_KEY") as Hex, payer: need("PAYER_KEY") as Hex, centreKeys };
}
