export const EXPLORER = "https://tiramisu.explorer.arkiv.network";
const ADDR = /^0x[0-9a-fA-F]{40}$/;
const KEY = /^0x[0-9a-fA-F]{1,64}$/;

export const txUrl = (hash: string) => (KEY.test(hash) ? `${EXPLORER}/tx/${hash}` : EXPLORER);
export const addressUrl = (a: string) => (ADDR.test(a) ? `${EXPLORER}/address/${a}` : EXPLORER);
export const entityUrl = (key: string) => (KEY.test(key) ? `${EXPLORER}/entity/${key}` : EXPLORER);
export const shortHex = (h: string, n = 6) => (h.length > 2 * n + 2 ? `${h.slice(0, n + 2)}…${h.slice(-n)}` : h);
