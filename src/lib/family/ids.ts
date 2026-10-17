/** Centre ids on the board. Uppercase demo ids only — no slashes, spaces, or unicode. */
export const CENTRE_ID_RE = /^[A-Z0-9-]{3,40}$/;

/** Arkiv entity keys and tx hashes are 32-byte hex. */
const HEX_64 = /^0x[0-9a-fA-F]{64}$/i;

/** Accept only a 0x + 64 hex id. Prefix is normalised to `0x`; hex case is kept. */
export function parseHexId(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!HEX_64.test(s)) return null;
  return `0x${s.slice(2)}`;
}

export function isKnownCentreId(id: string, ids: readonly string[]): boolean {
  return CENTRE_ID_RE.test(id) && ids.includes(id);
}
