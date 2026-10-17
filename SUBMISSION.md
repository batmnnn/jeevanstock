# Devfolio answers — JeevanStock (जीवन स्टॉक)
Arkiv: Global Tour Stop. Tracks: **Best Indian Use Case** (main) · Security · Censorship Resistance · Open Source · Privacy. The team includes an Indian national.

- **Live:** https://jeevanstock.azurewebsites.net (no login; the staff PINs are on `/demo` and `/staff`)
- **Repo (MIT):** https://github.com/batmnnn/jeevanstock
- **Schema:** [arkiv/schema.md](arkiv/schema.md) · **Friction:** [arkiv/friction.md](arkiv/friction.md) · **Video:** ≤3 min, see [DEMO_SCRIPT.md](DEMO_SCRIPT.md)
- **Built:** 17–18 Oct 2026, inside the 9–18 Oct window. First commit `223f490` (17 Oct 05:38 IST). We wrote no code before that commit.

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
**Why India.** India has the highest number of snakebite deaths in the world: about 58,000 deaths each year (Million Death Study, *eLife* 2020). India also has more than one third of global rabies deaths (WHO). Usually the medicine exists, but families cannot see *where* it is.
- 4 Oct 2026: Sapna Bai, 19, died after Gunaur CHC (Panna, MP) had no doctor and no anti-venom (TOI).
- 8 Sep 2026: NHRC told every state to make sure of the "mandatory availability" of anti-snake venom (ASV).
- MP: 587 of 1,227 PHCs had zero ASV (TOI).
- Goa, 2026: people who need the rabies vaccine "do rounds of health centres".
- **Our own check of the public register of the Chhattisgarh state supplier (CGMSCL), 17 Oct:** the Durg warehouse holds **3,867 ASV vials ready to issue**. But **22 of 45 rural PHCs in Durg and Balod had no ASV issued since 1 Apr 2026**. The problem is distribution and visibility, not supply.

The app is Hindi-first with an English toggle. It works on a low-cost phone and needs no login. It never shows a crypto word to families. A family can scan a QR poster at a bus stand or panchayat. The app then shows the nearest centre that *posted* stock in the last 6 hours, with Call and Directions.

**Why Arkiv.** A shortage board needs three properties. Postgres and IPFS do not give us all three together:
1. *Fresh by design.* A stock count is an entity that expires in 6 hours. Nobody has to run a cron job to grey out the "12 vials" from yesterday. On Postgres, stale data is a bug that a developer can forget. On IPFS, content never expires.
2. *Attributable.* The chain sets `$creator`. The board counts stock only when the wallet that the registry assigned to that centre wrote it. A forwarded WhatsApp message or a false row on a server cannot impersonate that wallet.
3. *Complaints that nobody can erase.* A "not available here" report from a family is `readonly`. Nobody (the centre, the district or us) can edit or delete it. With Postgres, the person with the database password decides what happened. IPFS is immutable, but we cannot query it by centre, drug or time unless we run our own indexer.

**Data that we keep off Arkiv on purpose:**
- The CGMSCL directory and issue history. This is public government data. We ship it as a JSON file with source links.
- The location of any person. Only the browser sorts centres by distance.
- Names, phone numbers, IPs or device IDs. The app never collects them.
- Staff PINs and signing keys. These stay only in the server environment.

**How we use Arkiv.**
| Feature | Arkiv mechanism | Why |
|---|---|---|
| Centre registry | `centre` entity by the admin wallet, `readonly`, 14 days, `wallet` attribute | Links each centre to one signing wallet |
| Shift stock | `stock` by the centre wallet, 6h expiry, both drugs in **one `executeBatch`** (~7.8s) | The chain enforces staleness |
| Trusted read | `.where(eq("app"), eq("kind"), eq("centre_id")).createdBy(centreWallet)` | Ignores all data that the registered wallet did not sign |
| Family report | `report` by the payer, `readonly` + `permissionlessExtension`, 48h, coarse `hour_bucket` | Nobody can edit it. Anyone (NGO, journalist) can extend it |
| Staff confirm | `ack` (readonly, 30d) **and** a 30-day report extension, atomic in one `executeBatch` (~6.8s) | The `$creator` of the ack is the proof. The extension alone is not proof, because anyone can extend |
| Proof card | `getEntity` → creator, owner, flags, expiry block, explorer link on `/verify/[key]` | Anyone can check a receipt without trust in us |
| Public board | Keyless `createPublicClient` reads, refreshed every 30 seconds | An audit needs no backend |

**Friction.** We found seven reproducible issues. [arkiv/friction.md](arkiv/friction.md) gives the details. The most important issues are:
- F6: the chain reverts uppercase attribute names, but the SDK accepts them.
- F7: the keyless query budget runs out. Then viem sleeps ~33 min on `Retry-After`.
- F1: there is no faucet that a script can use.
- F2: there is no paymaster.
- F3: there is no published fee formula. The report includes measured gas.

## Security
**Why this pillar.** Today, stock information travels by phone call and forwarded message. Anyone can say "Rampur has vials". A wrong claim can cost the first hour after a bite, when treatment matters most.

**Why Arkiv.** Authorship is a chain fact (`$creator`). Our server does not fill it in as a column. `readonly` stops the attack where someone quietly changes the number from yesterday. Expiry limits how long a stale or wrong stock post can mislead.

**How.**
- Two-level trust. The admin wallet registers each centre and its centre wallet. The read side keeps only the `stock` and `ack` entities whose creator is that wallet. It keeps only the `report` entities from the payer wallet. It ignores all other entities on the chain under our `app` tag. Unit tests in `tests/unit/dashboard-trust.test.ts` cover these rules.
- The acknowledgement is a separate readonly `ack` from the centre wallet. We need it because `permissionlessExtension` lets anyone extend a report. Also, the expiry event records the owner, not the sender.
- Keys stay on the server. Staff sign in with a PIN (rate-limited, with a signed HTTP-only session cookie). The app sends Content-Security-Policy, HSTS and frame-deny headers, and no `X-Powered-By` header. Tests in `tests/unit/security-*.test.ts` cover XSS and DoS.
- **Caveat:** the demo server holds the centre keys, because Arkiv has no paymaster yet (F2). In a real rollout, each centre has its own key on its own device. The trust rules do not change.

## Censorship Resistance
**Why this pillar.** Shortages embarrass officials, so complaints disappear. A "not available here" report from a citizen must stay public, also when it embarrasses an official.

**Why Arkiv.** Nobody can edit or delete a `readonly` report. With `permissionlessExtension`, any wallet (an NGO, a reporter, a district collector) can extend a report past 48h. That wallet does not have to ask the centre or us. Reads need no key and no account.

**How.** Reports go directly from the server action to Tiramisu. The dashboard and `/verify` read them back from the public RPC. If our site stops, `npm run read` (or any SDK client) lists every report and ack from the wallets above. When a centre confirms a report, it adds an `ack`. A confirmation never gives the centre the power to remove the report.

**Caveat:** Tiramisu block production is centralised on testnet. This is an item on the Arkiv roadmap. An app cannot fix it.

## Open Source
**Why this pillar.** Every state has the same problem and a register like the CGMSCL register. A state health mission or an NGO can run this app for its districts. It does not have to ask us.

**Why Arkiv.** The data layer is public, and the schema is documented. Thus a different team can build a different UI (or an SMS bot) on the same entities and the same trust rules.

**How.**
- The repo has an MIT license.
- `npm run keygen && npm run fund && npm run seed` sets up a new copy on Tiramisu.
- `npm run dev` runs fully offline on an in-memory repo with the same semantics.
- The repo has 550+ unit tests and Playwright e2e tests (axe accessibility on mobile and desktop).
- A GitHub Action posts demo stock again every 4 hours.

## Privacy
**Why this pillar.** Health data about a family in a crisis is sensitive. A shortage board must not become a surveillance record of who got a bite and where.

**Why Arkiv.** All data on Arkiv is public, so we had to make the schema private by design. Anyone who reads the entities can see this discipline.

**How.** A report carries only `centre_id`, `drug`, `reason` and an hour bucket. It carries no name, phone number, GPS, device ID or IP, not even as a hash. The browser sorts centres by distance, so the location never leaves the phone. The rate limiter uses a salted hash as its key and keeps this hash only in memory. One shared payer wallet writes all reports, so nobody can link a report to a person.
