# JeevanStock — जीवन स्टॉक
"Is the anti-venom / rabies vaccine in stock at my nearest health centre, right now?"

## 1. Problem (verified sources)
1. **Sapna Bai Vanshkar, 19, Panna, MP (4 Oct 2026).** She was bitten at 2 am and taken to Gunaur CHC. Her family says the centre had no doctor and no anti-snake venom (ASV). She was referred on and died on the way. TOI: https://timesofindia.indiatimes.com/city/bhopal/newlywed-dies-after-snakebite-kin-allege-no-doc-or-anti-venom-at-panna-health-centre/articleshow/134678815.cms
2. **NHRC notice to all states/UTs (8 Sep 2026).** Ensure "mandatory availability" of ASV in snakebite-prone areas and map high-risk zones. https://www.newindianexpress.com/india/2026/Sep/08/ensure-availability-of-anti-snake-venom-identify-high-risk-snakebite-areas-nhrc-to-states · https://news.abplive.com/news/india/nhrc-notice-to-all-states-uts-after-youth-dies-of-snakebite-due-to-lack-of-facilities-at-up-hospital-1865848
3. **MP ASV distribution gaps (TOI).** 587 of 1,227 PHCs had zero ASV stock. https://timesofindia.indiatimes.com/city/bhopal/triple-surge-in-snakebite-cases-amid-gaps-in-anti-venom-supply-in-mp/articleshow/124278684.cms
4. **Goa anti-rabies vaccine (ARV) shortage (2026).** Victims "do rounds of health centres". https://timesofindia.indiatimes.com/city/goa/shortage-of-anti-rabies-vaccine-in-state-amid-rising-dog-bite-cases/articleshow/129594953.cms · https://www.heraldgoa.in/goa/anti-rabies-vaccine-shortage-reported-at-panaji-urban-health-centre/463730/

**Core insight.** Families lose hours driving between centres. Stock data exists inside the system but is not public, and it is not tamper-evident: a centre can silently "fix" what it reported yesterday.

## 2. Users and 3-tap flows (Hindi default, English toggle)
**Family (no login, no wallet, no crypto words)**
1. Open the QR/link and tap **"साँप ने काटा / Snakebite"** or **"कुत्ते ने काटा / Dog bite"**.
2. See the nearest centres with chips: 🟢 उपलब्ध In stock · 🟡 कम Low · 🔴 नहीं Out · ⚪ पुरानी जानकारी Stale (>6h). Tap **Call** or **Directions**.
3. Got there and none in stock? Tap **"यहाँ नहीं मिला / Not available here"**, then a reason (out / no doctor / closed). Done, with a receipt and a proof link.

**Centre staff (one synthetic login per centre; the server holds that centre's wallet)**
1. Open the staff link (PIN).
2. Use **ASV** and **ARV** steppers (vials) and tap **Post**. The post expires in 6h, so stale data greys out by itself.
3. A family report appears in the inbox. Tap **Confirm** — the centre wallet writes a readonly `ack` and extends the report to 30 days — or ignore it (it expires in 48h).

## 3. Architecture
- **Next.js 16 (App Router) on Azure App Service.** It must stay live until 23 Oct.
- **Server-held wallets.** One per *synthetic* centre (env `CENTRE_KEYS`), plus one `PAYER` wallet that writes family reports. Keys stay server-side only and never go in the repo.
- **Registry.** An admin wallet creates `centre` entities. The dashboard trusts stock only when `$creator` equals the centre's registered wallet (`createdBy()` filter). That stops spoofed stock posts.
- **Stock posts.** Created with a 6h lifetime (`ExpirationTime.fromHours(6)` = 10,800 blocks at 2s). One `executeBatch` per shift covers both drugs. A new post each shift, so history is append-only.
- **Reports.** `flags: { readonly: true, permissionlessExtension: true }`, 48h lifetime. Nobody can edit them, including us. Anyone can extend one, so a longer lifetime is not proof the centre agreed. On Confirm, the centre wallet writes a readonly `ack` whose `$creator` is that centre's registered wallet, and extends the report to 30 days in the same `executeBatch`, so the two can't come apart. The ack is the acknowledgement.
- **Two boards.** `/demo`: three synthetic centres whose stock, reports and acks are on Arkiv. `/live`: the real Durg and Balod centres from CGMSCL's public register (last shipment only, kept off-chain as public data), until a centre is onboarded.
- **Public dashboard.** Keyless reads (`createPublicClient`, no wallet): demo centres, recent reports and acks, every trusted wallet, and the CGMSCL supply gap.
- **No personal data, even hashed.** No names, phones, GPS of the person, device IDs or IP. Reports carry only centreId, drug, reason and a coarse hour bucket. Demo centres are synthetic ("Demo PHC Rampur-1"); Durg and Balod facility data is public CGMSCL data.
- **Stretch:** ICU bed counts (`beds` entity, same pattern).

## 4. Non-goals
Medical advice, writing to Arkiv on behalf of real centres before they join, user accounts, payments.
