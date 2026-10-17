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

## F6. (fill during build) SDK / query / expiry surprises
- e.g. `ExpirationTime` rejects durations that aren't whole multiples of 2s (by design; error text is good).
- ...
