# Devfolio answers — JeevanStock (जीवन स्टॉक)
Arkiv: Global Tour Stop. Tracks: **Best Indian Use Case** (main) · Security · Censorship Resistance · Open Source · Privacy. The team includes an Indian national.

- **Live:** https://jeevanstock.azurewebsites.net (no login; staff PINs are printed on `/demo` and `/staff`)
- **Repo (MIT):** https://github.com/batmnnn/jeevanstock
- **Schema:** [arkiv/schema.md](arkiv/schema.md) · **Friction:** [arkiv/friction.md](arkiv/friction.md) · **Video:** ≤3 min, see [DEMO_SCRIPT.md](DEMO_SCRIPT.md)
- **Built:** 17–18 Oct 2026, inside the 9–18 Oct window. First commit `223f490` (17 Oct 05:38 IST). No earlier code.

### Wallets that create entities on Tiramisu (chain 7738577)
| Role | Address | Writes |
|---|---|---|
| Admin (registry) | [`0xE0Fd8bFff3148D9BDA2fa3BbFAfFD9A117E3cD8F`](https://tiramisu.explorer.arkiv.network/address/0xE0Fd8bFff3148D9BDA2fa3BbFAfFD9A117E3cD8F) | `centre` |
| Payer (family reports) | [`0xb5B8ce16CebC22802a72204da4E9Fb58ec485705`](https://tiramisu.explorer.arkiv.network/address/0xb5B8ce16CebC22802a72204da4E9Fb58ec485705) | `report` |
| Demo PHC Rampur-1 | [`0x5F8b8520FfdBaBd4096Bc1b3ad9d57c0d4723975`](https://tiramisu.explorer.arkiv.network/address/0x5F8b8520FfdBaBd4096Bc1b3ad9d57c0d4723975) | `stock`, `ack` |
| Demo CHC Sonpur | [`0x1AB16c702008422EA2924DE60607bB81dcbF3014`](https://tiramisu.explorer.arkiv.network/address/0x1AB16c702008422EA2924DE60607bB81dcbF3014) | `stock`, `ack` |
| Demo PHC Kalapur-2 | [`0x9f13eF0aBCe7a6e37D612C35f629B12C212D0D33`](https://tiramisu.explorer.arkiv.network/address/0x9f13eF0aBCe7a6e37D612C35f629B12C212D0D33) | `stock`, `ack` |

---

## Best Indian Use Case
**Why India.** India has the world's worst snakebite toll — about 58,000 deaths a year (Million Death Study, *eLife* 2020) — and over a third of global rabies deaths (WHO). The medicine usually exists; families can't see *where*.
- 4 Oct 2026: Sapna Bai, 19, died after Gunaur CHC (Panna, MP) had no doctor and no anti-venom (TOI).
- 8 Sep 2026: NHRC told every state to ensure "mandatory availability" of anti-snake venom (ASV).
- MP: 587 of 1,227 PHCs held zero ASV (TOI). Goa, 2026: rabies-vaccine victims "do rounds of health centres".
- **Our own pull of the Chhattisgarh state supplier's (CGMSCL) public register, 17 Oct:** the Durg warehouse holds **3,867 ASV vials ready to issue**, yet **22 of 45 rural PHCs in Durg and Balod had no ASV issued since 1 Apr 2026**. The gap is distribution and visibility, not supply.

The app is Hindi-first with an English toggle, works on a cheap phone, needs no login, and never shows a crypto word to families. A QR poster at a bus stand or panchayat gets a family to the nearest centre that *posted* stock in the last 6 hours, with Call and Directions.

**Why Arkiv.** Three things a shortage board needs, which Postgres or IPFS don't give us together:
1. *Fresh by construction.* A stock count is an entity that expires in 6 hours. Nobody has to run a cron to grey out yesterday's "12 vials". On Postgres, staleness is a bug someone forgets; on IPFS, content never expires.
2. *Attributable.* `$creator` is set by the chain. The board only counts stock written by the wallet the registry assigned to that centre — a WhatsApp forward or a rogue server row can't impersonate it.
3. *Un-erasable complaints.* A family's "not available here" is `readonly`: no-one — the centre, the district, or us — can edit or delete it. With Postgres, whoever holds the DB password decides what happened; IPFS is immutable but not queryable by centre/drug/time without running our own indexer.

**Kept off Arkiv on purpose:** the CGMSCL directory and issue history (public government data, shipped as a JSON file with source links); anyone's location (sorting by distance happens in the browser only); names, phones, IPs or device IDs (never collected); staff PINs and signing keys (server env only).

**How we use Arkiv.**
| Feature | Arkiv mechanism | Why |
|---|---|---|
| Centre registry | `centre` entity by the admin wallet, `readonly`, 14 days, `wallet` attribute | Pins each centre to one signing wallet |
| Shift stock | `stock` by the centre wallet, 6h expiry, both drugs in **one `executeBatch`** (~7.8s) | Staleness is enforced by the chain |
| Trusted read | `.where(eq("app"), eq("kind"), eq("centre_id")).createdBy(centreWallet)` | Ignores anything not signed by the registered wallet |
| Family report | `report` by the payer, `readonly` + `permissionlessExtension`, 48h, coarse `hour_bucket` | Can't be edited; anyone (NGO, journalist) can keep it alive |
| Staff confirm | `ack` (readonly, 30d) **and** a 30-day report extension, atomic in one `executeBatch` (~6.8s) | The ack's `$creator` is the proof; extension alone isn't (anyone may extend) |
| Proof card | `getEntity` → creator, owner, flags, expiry block, explorer link on `/verify/[key]` | Anyone can check a receipt without trusting us |
| Public board | Keyless `createPublicClient` reads, refreshed every 30 seconds | No backend needed to audit |

**Friction:** seven reproducible issues in [arkiv/friction.md](arkiv/friction.md) — uppercase attribute names revert on chain though the SDK accepts them (F6), the keyless query budget runs out and viem then sleeps ~33 min on `Retry-After` (F7), no scriptable faucet (F1), no paymaster (F2), no published fee formula (F3, with measured gas).

## Security
**Why this pillar.** Stock information today travels by phone call and forwarded message; anyone can claim "Rampur has vials". A wrong claim costs the golden hour.
**Why Arkiv.** Authorship is a chain fact (`$creator`), not a column our server fills in. `readonly` removes the "quietly fix yesterday's number" attack. Expiry caps how long a stale or bad post can mislead.
**How.**
- Two-level trust: admin registers centre → centre wallet; the read side keeps only `stock`/`ack` whose creator equals that wallet, and only `report` from the payer. Everything else on the chain under our `app` tag is ignored (unit-tested in `tests/unit/dashboard-trust.test.ts`).
- Acknowledgement is a separate readonly `ack` by the centre wallet, because `permissionlessExtension` lets anyone extend a report and the expiry event records the owner, not the sender.
- Keys stay on the server; staff log in with a PIN (rate-limited, signed HTTP-only session cookie). Content-Security-Policy, HSTS and frame-deny headers, no `X-Powered-By`, XSS and DoS tests (`tests/unit/security-*.test.ts`).
- **Honest caveat:** the demo server holds the centre keys (no paymaster on Arkiv yet — F2). A real rollout gives each centre its own key on its own device; the trust rules don't change.

## Censorship Resistance
**Why this pillar.** Shortages embarrass officials, so complaints disappear. A citizen's "not available here" has to outlive the person it embarrasses.
**Why Arkiv.** `readonly` reports can't be edited or deleted by anyone. `permissionlessExtension` means any wallet — an NGO, a reporter, a district collector — can keep a report alive past 48h without asking the centre or us. Reads need no key and no account.
**How.** Reports go straight from the server action to Tiramisu; the dashboard and `/verify` read them back from the public RPC. If our site went down, `npm run read` (or any SDK client) lists every report and ack from the wallets above. Confirming a report adds an `ack`; it never gives the centre the power to remove the report.
**Caveat:** Tiramisu block production is centralised on testnet; that is Arkiv's roadmap, not something an app can fix.

## Open Source
**Why this pillar.** Every state has the same problem and a CGMSCL-like register. A state health mission or an NGO should be able to run this for its districts without asking us.
**Why Arkiv.** The data layer is public and schema-documented, so a different team can build a different UI (or an SMS bot) on the same entities and the same trust rules.
**How.** MIT repo; `npm run keygen && npm run fund && npm run seed` stands up a fresh copy on Tiramisu; `npm run dev` runs fully offline on an in-memory repo with identical semantics; 550+ unit tests and Playwright e2e (axe accessibility on mobile and desktop); a GitHub Action re-posts demo stock every 4 hours.

## Privacy
**Why this pillar.** Health data about a family in a crisis is sensitive; a shortage board must not become a surveillance log of who was bitten where.
**Why Arkiv.** Because everything on Arkiv is public, the schema itself had to be private by design — and that discipline is visible to anyone who reads the entities.
**How.** A report carries only `centre_id`, `drug`, `reason` and an hour bucket. No name, phone, GPS, device ID or IP — not even hashed. "Nearest centre" sorting runs in the browser; the location never leaves the phone. The rate limiter keys on a salted hash held in memory only. Reports are written by one shared payer wallet, so a report can't be linked to a person.
