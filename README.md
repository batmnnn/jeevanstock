# JeevanStock — जीवन स्टॉक
Is the anti-snake venom (ASV) or anti-rabies vaccine (ARV) in stock at the nearest health centre now? JeevanStock is a Hindi-first, tamper-evident stock board on [Arkiv](https://arkiv.network) (Tiramisu testnet). We built it for **Arkiv: Global Tour Stop**, 17–18 Oct 2026.

**Live:** https://jeevanstock.azurewebsites.net · **Answers by criterion:** [SUBMISSION.md](SUBMISSION.md) · **Schema:** [arkiv/schema.md](arkiv/schema.md) · **Friction:** [arkiv/friction.md](arkiv/friction.md)

## For judges (two minutes)
1. Open **/demo**. This page shows three demo centres. Their stock comes from Arkiv. The page also shows the staff PINs.
2. Open **Demo PHC Rampur-1**. Select "Not available here" and then select a reason.
3. Look at the receipt. Select **View proof** to see the entity on Tiramisu: creator (the payer wallet), readonly flag, expiry and an explorer link.
4. Select **Staff sign in**. Type the Rampur-1 PIN.
5. Post vials. One transaction posts both drugs.
6. Select **Confirm** on your report. The Rampur-1 wallet writes a readonly `ack` and extends your report to 30 days in one atomic transaction.
7. Open **/dashboard**. Your report shows as confirmed. "Verify it yourself" lists every wallet with explorer links.
8. Open **/live**. This board shows the real Durg and Balod centres from the public register of the state supplier (CGMSCL). It shows only the last shipment, not a shelf count, until a centre joins. There, 22 of 45 rural PHCs got no ASV since 1 Apr. But the district warehouse holds 3,867 vials.

Writes take about 8–12 seconds. Tiramisu makes a block every 2s, and the app waits for the receipt.

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
The workflow `.github/workflows/keepalive.yml` runs `npm run seed` again every 4 hours, so the demo stock does not become stale. The workflow reads the keys from repository secrets.

## Quality gates
```bash
npm run check          # TypeScript strict
npm test               # 550+ unit tests: trust rules, decoders, sessions, security (XSS, DoS, config)
npm run test:e2e       # Playwright: family, staff, public, axe accessibility, on 390px and 1440px
```

## Architecture
- `src/lib/domain.ts`, `src/lib/views.ts`: the trust rules, as pure functions. A stock post counts only if `$creator` is the registered wallet of the centre. A report counts only if the payer wallet wrote it. An ack counts only if the centre wallet wrote it. A stock post older than 6h is stale.
- `src/lib/repo/`: one `Repo` interface with two implementations. `ArkivRepo` uses SDK 0.8.1, keyless reads, signing wallets on the server, and `executeBatch` for shifts and confirms. `MemoryRepo` has the same semantics and works offline.
- `src/lib/directory.ts` and `src/data/cg-durg-balod.json`: CGMSCL facilities and issue history. This is public data, and we keep it off-chain on purpose.
- `src/app/`: the `/demo` and `/live` boards, the centre page, the report and receipt pages, `/staff`, `/dashboard`, the `/verify/[key]` proof cards, `/about` and the printable QR `/poster`.
- No personal data: the app does not store names, phone numbers, GPS, device IDs or IPs. Only the browser sorts centres by distance.

## Deploy (Azure App Service, Linux, Node 22)
Set these app settings: `DATA_SOURCE=arkiv`, `ARKIV_API_KEY`, `ADMIN_KEY`, `PAYER_KEY`, `CENTRE_KEYS`, `CENTRE_PINS`, `SESSION_SECRET`, `SHOW_DEMO_PINS=1`.

1. Build with `npm run build` (standalone output).
2. Start with `node server.js`.

We keep the deploy live until 23 Oct.

The license is MIT. Demo centres, staff and families are synthetic. The Durg and Balod facility data is public CGMSCL data.
