/** A proof key is `0x` plus 1–64 hex digits. Arkiv entity keys are 32 bytes (64 hex digits). */
const PROOF_KEY = /^0x[0-9a-fA-F]{1,64}$/;

export function isProofKey(key: unknown): key is string {
  return typeof key === "string" && PROOF_KEY.test(key);
}
