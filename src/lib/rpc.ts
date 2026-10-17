import { http } from "viem";

/**
 * Tiramisu caps keyless queries and answers 429 with `Retry-After` in the tens of minutes once
 * the budget is spent. viem's retry sleeps for that long, so retries are off and callers fall
 * back to their last good read. ARKIV_API_KEY (hub.arkiv.network/api-keys) lifts the cap.
 */
export function arkivTransport() {
  const key = process.env.ARKIV_API_KEY?.trim();
  return http(undefined, {
    timeout: 12_000,
    retryCount: 0,
    fetchOptions: key ? { headers: { "X-API-KEY": key } } : undefined,
  });
}
