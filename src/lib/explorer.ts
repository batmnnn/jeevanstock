export const EXPLORER = "https://tiramisu.explorer.arkiv.network";
export const txUrl = (hash: string) => `${EXPLORER}/tx/${hash}`;
export const addressUrl = (a: string) => `${EXPLORER}/address/${a}`;
export const entityUrl = (key: string) => `${EXPLORER}/entity/${key}`;
export const shortHex = (h: string, n = 6) => (h.length > 2 * n + 2 ? `${h.slice(0, n + 2)}…${h.slice(-n)}` : h);
