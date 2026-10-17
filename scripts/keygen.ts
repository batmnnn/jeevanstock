// Generates throwaway testnet keys + PINs + session secret into .env.chain (refuses to overwrite).
// Kept out of .env so local memory-mode dev/tests never pick up chain keys by accident.
// Usage: npm run keygen
import { existsSync, writeFileSync } from "node:fs";
import { randomBytes, randomInt } from "node:crypto";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { CENTRES } from "../src/lib/centres";

const ENV_FILE = ".env.chain";
if (existsSync(ENV_FILE)) {
  console.error(`${ENV_FILE} already exists — refusing to overwrite. Delete it first if you really want new keys.`);
  process.exit(1);
}
const admin = generatePrivateKey();
const payer = generatePrivateKey();
const centres = CENTRES.map(() => generatePrivateKey());
const pins = CENTRES.map(() => String(randomInt(100000, 1000000)));

writeFileSync(
  ENV_FILE,
  [
    "# Throwaway Tiramisu testnet keys. NEVER commit. NEVER reuse on mainnet.",
    "DATA_SOURCE=arkiv",
    `ADMIN_KEY=${admin}`,
    `PAYER_KEY=${payer}`,
    `CENTRE_KEYS=${centres.join(",")}`,
    `CENTRE_PINS=${pins.join(",")}`,
    `SESSION_SECRET=${randomBytes(48).toString("base64url")}`,
    "SHOW_DEMO_PINS=1",
    "",
  ].join("\n"),
  { mode: 0o600 },
);

console.log(`Wrote ${ENV_FILE} (mode 600; not auto-loaded by Next). Addresses (public):`);
console.log("  admin ", privateKeyToAccount(admin).address);
console.log("  payer ", privateKeyToAccount(payer).address, "  ← fund THIS one at https://hub.arkiv.network/faucet");
CENTRES.forEach((c, i) => console.log(`  ${c.centreId.padEnd(16)}`, privateKeyToAccount(centres[i]).address));
console.log("Then: npm run fund && npm run seed");
