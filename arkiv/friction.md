# Arkiv friction report — JeevanStock
SDK `@arkiv-network/sdk` 0.8.1 · viem 2.x · Node 22 · Tiramisu (7738577) · dates in IST.
Format per issue: **Expected / Actual / Versions / Repro / Impact / Workaround**. The versions above apply to all issues.

## F1. Faucet needs a browser wallet connection
- Expected: a faucet that a script can call (or a CLI), to fund throwaway keys on a server.
- Actual: hub.arkiv.network/faucet shows "Connecting wallet". Each wallet can claim one time per cooldown window.
- Repro:
  1. Generate an address in Node.
  2. Open the faucet with no injected wallet.
  3. Try to fund the address.
- Impact: CI and seed scripts cannot fund N centre wallets automatically.
- Workaround: fund one payer wallet by hand. Then send GLM from it to the centre wallets.

## F2. No sponsored / paymaster writes
- Expected: a method for a dApp to pay for the writes of its users. The litepaper mentions account abstraction and multi-token gas.
- Actual: the docs and the SDK 0.8.1 typings contain nothing for a paymaster or sponsor.
- Repro: look for a paymaster or sponsor in the docs and in the SDK 0.8.1 typings.
- Impact: a UX with "no crypto words" forces keys on the server. This is a trade-off in custody and trust.
- Workaround: wallets on the server, plus `$creator` filtering.

## F3. No published fee formula
- Expected: a price per byte and per block of lifetime, plus the cost to extend.
- Actual: the docs say that pricing follows "storage work". The litepaper says "size, expiry time, and current storage load". Neither gives numbers.
- Repro: look for a fee formula in the docs and in the litepaper.
- Measured (Tiramisu, 17 Oct): gas price 1 gwei. A tx with 1.44 KB input / 128 B payload / 900-block expiry used 97,432 gas, fee 0.00009743 GLM (explorer tx 0xcebf5a21…283f9). A tx with ~228 B input used ~24.5k gas.
- Impact: we cannot quote the real cost per centre per month.

## F4. No mainnet
- Expected: a mainnet with a price list.
- Actual: arkiv.network says "currently available on testnet only". There is no mainnet price list.
- Repro: open arkiv.network.
- Impact: we cannot state the production cost or durability.

## F5. Public RPC is rate-limited; plain urllib got HTTP 403
- Expected: JSON-RPC works without a User-Agent header.
- Actual: JSON-RPC without a User-Agent header returned 403. With `user-agent: curl/8`, it worked.
- Repro: use Python `urllib.request` to send a POST eth_blockNumber to the Tiramisu RPC.
- Workaround: send a User-Agent header, for example `user-agent: curl/8`.

## F7. Keyless query budget runs out, then viem hangs for half an hour
- Expected: a rate-limited read fails fast, or the SDK shows the quota.
- Actual (17 Oct, ~01:30 IST, after one day of local tests): every `arkiv_query` returned
  `429 {"error":"ANON_COST_LIMITED","message":"unauthenticated query budget exhausted; get an API key at https://hub.arkiv.network for a monthly quota"}`
  with `ratelimit: limit=10000, remaining=0, reset=1965` and `retry-after: 1965`. `eth_blockNumber` still answered 200.
  The viem `http()` transport obeys `Retry-After`, so the `select()…` iterator of the SDK slept ~33 min. Our pages hung instead of returning an error. One request took 6.1 min in the log.
- Repro:
  ```sh
  curl -s -D - -H 'content-type: application/json' \
    -d '{"jsonrpc":"2.0","id":1,"method":"arkiv_query","params":["kind = \"centre\"",{"includeData":{"key":true},"resultsPerPage":1}]}' \
    https://rpc.tiramisu.db-chain.testnet.arkiv.network
  ```
  After the budget runs out, this command prints the 429 and the headers above.
- Impact: a public demo on the keyless RPC stops with no error when judges start to click. The `Arkiv-Cost` / `Arkiv-Quota-Used-Percent` headers exist, but the SDK does not expose them. Thus we could not see the budget decrease.
- Workaround: we send an access key from hub.arkiv.network/api-keys as `X-API-KEY` (`src/lib/rpc.ts`). We set `retryCount: 0` on the transport. When a read fails, the repo serves its last good snapshot for up to 15 min.

## F6. User attribute names reject uppercase
- Expected: the chain accepts the names that the SDK 0.8.1 grammar allows (`[A-Za-z][A-Za-z0-9._-]*`). In that grammar, `centreId` is a legal name, and the client accepts it.
- Actual: Tiramisu reverts `Ident32InvalidByte(6, 0x49)` on `centreId`. The chain does not accept the "I" in the name. `$contentType` still works.
- Repro: on Tiramisu, create an entity with the attribute name `centreId`.
- Impact: the app cannot use the camelCase names that the SDK accepts.
- Workaround: use snake_case on the wire (`centre_id`, `posted_at`, `hour_bucket`, `report_key`). The app maps those names back to camelCase when it reads.
- Note: `ExpirationTime` also rejects durations that are not whole multiples of 2s. This is by design, and the error text is clear.
