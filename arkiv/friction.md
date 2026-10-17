# Arkiv friction report — JeevanStock
SDK `@arkiv-network/sdk` 0.8.1 · viem 2.x · Node 22 · Tiramisu (7738577) · dates in IST.
Format per issue: **Expected / Actual / Versions / Repro / Impact / Workaround**.

## F1. Faucet needs a browser wallet connection
- Expected: a scriptable faucet (or a CLI) for server-held throwaway keys.
- Actual: hub.arkiv.network/faucet shows "Connecting wallet". One claim per wallet per cooldown window.
- Repro: open the faucet with no injected wallet and try to fund an address generated in Node.
- Impact: CI and seeding scripts can't fund N centre wallets automatically.
- Workaround: fund one payer by hand, then send GLM from it to the centre wallets.

## F2. No sponsored / paymaster writes
- Expected: some way for a dApp to pay for its users' writes (the litepaper mentions account abstraction and multi-token gas).
- Actual: nothing in the docs or the SDK 0.8.1 typings for a paymaster or sponsor.
- Impact: a "no crypto words" UX forces server-held keys, which is a custody and trust trade-off.
- Workaround: server-held wallets plus `$creator` filtering.

## F3. No published fee formula
- Expected: a per-byte and per-block-of-lifetime price, plus the extend cost.
- Actual: the docs say pricing follows "storage work"; the litepaper says "size, expiry time, and current storage load". No numbers.
- Measured (Tiramisu, 17 Oct): gas price 1 gwei. Tx with 1.44 KB input / 128 B payload / 900-block expiry: 97,432 gas, fee 0.00009743 GLM (explorer tx 0xcebf5a21…283f9). ~228 B input: ~24.5k gas.
- Impact: we can't quote real cost per centre per month.

## F4. No mainnet
- arkiv.network: "currently available on testnet only". No mainnet price list.
- Impact: we can't state production cost or durability.

## F5. Public RPC is rate-limited; plain urllib got HTTP 403
- Actual: JSON-RPC without a User-Agent header returned 403. It worked with `user-agent: curl/8`.
- Repro: Python `urllib.request` POST eth_blockNumber to the Tiramisu RPC.

## F7. Keyless query budget runs out, and viem then hangs for half an hour
- Expected: a rate-limited read fails fast, or the SDK surfaces the quota.
- Actual (17 Oct, ~01:30 IST, after a day of local testing): every `arkiv_query` returned
  `429 {"error":"ANON_COST_LIMITED","message":"unauthenticated query budget exhausted; get an API key at https://hub.arkiv.network for a monthly quota"}`
  with `ratelimit: limit=10000, remaining=0, reset=1965` and `retry-after: 1965`. `eth_blockNumber` still answered 200.
  viem's `http()` transport honours `Retry-After`, so the SDK's `select()…` iterator slept ~33 min. Our pages hung (one request logged 6.1 min) instead of erroring.
- Repro:
  ```sh
  curl -s -D - -H 'content-type: application/json' \
    -d '{"jsonrpc":"2.0","id":1,"method":"arkiv_query","params":["kind = \"centre\"",{"includeData":{"key":true},"resultsPerPage":1}]}' \
    https://rpc.tiramisu.db-chain.testnet.arkiv.network
  ```
  Once the budget is spent this prints the 429 and headers above.
- Impact: a public demo on the keyless RPC dies quietly once judges start clicking. The `Arkiv-Cost` / `Arkiv-Quota-Used-Percent` headers exist but the SDK doesn't expose them, so we couldn't see the budget draining.
- Workaround: an access key from hub.arkiv.network/api-keys sent as `X-API-KEY` (`src/lib/rpc.ts`), `retryCount: 0` on the transport, and the repo serves its last good snapshot for up to 15 min when a read fails.

## F6. User attribute names reject uppercase
- Expected: the SDK 0.8.1 grammar (`[A-Za-z][A-Za-z0-9._-]*`) — `centreId` is a legal name, and the client accepts it.
- Actual: Tiramisu reverts `Ident32InvalidByte(6, 0x49)` on `centreId`. The "I" is outside the name the chain accepts. `$contentType` still works.
- Workaround: snake_case on the wire (`centre_id`, `posted_at`, `hour_bucket`, `report_key`). The app maps those back to camelCase when it reads.
- `ExpirationTime` also rejects durations that aren't whole multiples of 2s (by design; the error text is good).
