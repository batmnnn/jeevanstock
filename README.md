# JeevanStock — जीवन स्टॉक
Is the anti-snake venom (ASV) or anti-rabies vaccine (ARV) in stock at the nearest health centre, right now? A Hindi-first, tamper-evident stock board on [Arkiv](https://arkiv.network) (Tiramisu testnet). Built for **Arkiv: Global Tour Stop**, 17–18 Oct 2026.

**Live:** https://jeevanstock.azurewebsites.net · **Answers by criterion:** [SUBMISSION.md](SUBMISSION.md) · **Schema:** [arkiv/schema.md](arkiv/schema.md) · **Friction:** [arkiv/friction.md](arkiv/friction.md)

## For judges: two minutes
1. Open **/demo**. Three practice centres whose stock comes from Arkiv. The staff PINs are on that page.
2. Open **Demo PHC Rampur-1** → "Not available here" → pick a reason. You get a receipt; **View proof** shows the entity on Tiramisu (creator = payer wallet, readonly, expiry) with an explorer link.
3. **Staff sign-in** with the Rampur-1 PIN. Post vials (one transaction for both drugs), then **Confirm** your report. That writes a readonly `ack` from the Rampur-1 wallet and extends your report to 30 days, atomically.
4. Open **/dashboard**. Your report shows as acknowledged; "Verify it yourself" lists every wallet with explorer links.
5. Open **/live**. The real Durg and Balod centres from the state supplier's (CGMSCL) public register: last shipment only, no shelf count, until a centre joins. 22 of 45 rural PHCs there got no ASV since 1 Apr while the district warehouse holds 3,867 vials.

Writes take about 8–12 seconds (Tiramisu blocks are 2s; the app waits for the receipt).

## Run it offline (no keys)
```bash
npm i
npm run dev            # http://localhost:3000 — in-memory data, staff PINs 1111 / 2222 / 3333
```

## Run it on Arkiv
```bash
npm run keygen         # throwaway keys, PINs and a session secret → .env.chain (git-ignored)
# fund the printed PAYER address at https://hub.arkiv.network/faucet (browser wallet — friction F1)
# optional but recommended: an access key from https://hub.arkiv.network/api-keys → ARKIV_API_KEY in .env.chain (friction F7)
npm run fund           # payer tops up admin + centre wallets (FUND_TARGET=0.02 GLM each by default)
npm run seed           # registers the 3 demo centres (idempotent) and posts a shift of stock
npm run dev:chain      # or: npm run build && npm run start:chain
npm run read           # keyless audit of everything the admin and centre wallets wrote
```
`.github/workflows/keepalive.yml` re-runs `npm run seed` every 4 hours so the demo stock never goes stale (keys as repository secrets).

## Quality gates
```bash
npm run check          # TypeScript strict
npm test               # 550+ unit tests: trust rules, decoders, sessions, security (XSS, DoS, config)
npm run test:e2e       # Playwright: family, staff, public, axe accessibility, on 390px and 1440px
```

## Architecture
- `src/lib/domain.ts`, `src/lib/views.ts` — pure trust rules: stock counts only if `$creator` is the centre's registered wallet, reports only if the payer wrote them, acks only from the centre wallet; stock older than 6h is stale.
- `src/lib/repo/` — one `Repo` interface. `ArkivRepo` (SDK 0.8.1, keyless reads, server-held signing wallets, `executeBatch` for shifts and confirms) and `MemoryRepo` (same semantics, offline).
- `src/lib/directory.ts` + `src/data/cg-durg-balod.json` — CGMSCL facilities and issue history (public data, kept off-chain on purpose).
- `src/app/` — `/demo` and `/live` boards, centre page, report and receipt, `/staff`, `/dashboard`, `/verify/[key]` proof cards, `/about`, printable QR `/poster`.
- No personal data: no names, phones, GPS, device IDs or IPs are stored. Distance sorting happens only in the browser.

## Deploy (Azure App Service, Linux, Node 22)
App settings: `DATA_SOURCE=arkiv`, `ARKIV_API_KEY`, `ADMIN_KEY`, `PAYER_KEY`, `CENTRE_KEYS`, `CENTRE_PINS`, `SESSION_SECRET`, `SHOW_DEMO_PINS=1`. Build with `npm run build` (standalone output) and start with `node server.js`. Kept live until 23 Oct.

MIT licensed. Demo centres, staff and families are synthetic; Durg and Balod facility data is public CGMSCL data.
