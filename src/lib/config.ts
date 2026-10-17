import "server-only";
import { z } from "zod";
import { privateKeyToAccount } from "viem/accounts";
import type { Hex } from "viem";
import { CENTRES } from "./centres";

const hexKey = z.string().regex(/^0x[0-9a-fA-F]{64}$/, "must be a 0x-prefixed 32-byte hex private key");

const schema = z.object({
  DATA_SOURCE: z.enum(["arkiv", "memory"]).default("memory"),
  ADMIN_KEY: hexKey.optional(),
  PAYER_KEY: hexKey.optional(),
  CENTRE_KEYS: z.string().optional(),
  CENTRE_PINS: z.string().optional(),
  SESSION_SECRET: z.string().min(32).optional(),
  SHOW_DEMO_PINS: z.enum(["0", "1"]).default("0"),
});

export interface AppConfig {
  source: "arkiv" | "memory";
  adminKey?: Hex;
  payerKey?: Hex;
  /** centreId → signing key (server-side only). */
  centreKeys: Map<string, Hex>;
  /** centreId → staff PIN. */
  centrePins: Map<string, string>;
  sessionSecret: string;
  showDemoPins: boolean;
}

const DEV_SECRET = "dev-only-insecure-session-secret-change-me-0000";
const DEV_PINS = ["1111", "2222", "3333", "4444", "5555"];

/** Vercel and Azure App Service set these. Local `next start` does not, so the demo can boot without a secret. */
function isDeployed(env: Record<string, string | undefined>): boolean {
  return Boolean(env.VERCEL || env.VERCEL_ENV || env.WEBSITE_SITE_NAME);
}

export function parseConfig(env: Record<string, string | undefined>): AppConfig {
  const e = schema.parse(env);
  const isProd = env.NODE_ENV === "production";
  const deployed = isDeployed(env);
  const ids = CENTRES.map((c) => c.centreId);

  if ((deployed || (isProd && e.DATA_SOURCE === "arkiv")) && !e.SESSION_SECRET) {
    throw new Error("SESSION_SECRET (>=32 chars) is required when deployed or in production arkiv mode");
  }
  if (deployed && e.SESSION_SECRET === DEV_SECRET) throw new Error("SESSION_SECRET must not be the dev default when deployed");
  if (deployed && !e.CENTRE_PINS) throw new Error("CENTRE_PINS is required when deployed");

  const pins = e.CENTRE_PINS?.split(",").map((s) => s.trim()) ?? (e.DATA_SOURCE === "memory" && !deployed ? DEV_PINS.slice(0, ids.length) : []);
  if (pins.length !== ids.length) throw new Error("CENTRE_PINS count must match CENTRES");
  if (pins.some((p) => !/^\d{4,8}$/.test(p))) throw new Error("CENTRE_PINS must be 4–8 digits each");

  const centrePins = new Map(ids.map((id, i) => [id, pins[i]]));
  const centreKeys = new Map<string, Hex>();

  if (e.DATA_SOURCE === "arkiv") {
    if (!e.ADMIN_KEY || !e.PAYER_KEY || !e.CENTRE_KEYS) throw new Error("arkiv mode needs ADMIN_KEY, PAYER_KEY, CENTRE_KEYS");
    const keys = e.CENTRE_KEYS.split(",").map((s) => s.trim());
    if (keys.length !== ids.length) throw new Error("CENTRE_KEYS count must match CENTRES");
    keys.forEach((k, i) => centreKeys.set(ids[i], hexKey.parse(k) as Hex));
  }

  return {
    source: e.DATA_SOURCE,
    adminKey: e.ADMIN_KEY as Hex | undefined,
    payerKey: e.PAYER_KEY as Hex | undefined,
    centreKeys,
    centrePins,
    sessionSecret: e.SESSION_SECRET ?? DEV_SECRET,
    showDemoPins: e.SHOW_DEMO_PINS === "1" || (e.DATA_SOURCE === "memory" && !deployed),
  };
}

let cached: AppConfig | undefined;
export const config = () => (cached ??= parseConfig(process.env));

export const addressOf = (k: Hex) => privateKeyToAccount(k).address;
