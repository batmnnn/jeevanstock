# JeevanStock — जीवन स्टॉक
"Is the anti-venom / rabies vaccine in stock at my nearest health centre, right now?"

## 1. Problem (verified sources)
1. **Sapna Bai Vanshkar, 19, Panna, MP (4 Oct 2026).** A snake bit her at 2 am. Her family took her to Gunaur CHC. The family says that the centre had no doctor and no anti-snake venom (ASV). The centre referred her onward, and she died on the way. TOI: https://timesofindia.indiatimes.com/city/bhopal/newlywed-dies-after-snakebite-kin-allege-no-doc-or-anti-venom-at-panna-health-centre/articleshow/134678815.cms
2. **NHRC notice to all states/UTs (8 Sep 2026).** The notice tells states to make sure of the "mandatory availability" of ASV in snakebite-prone areas. It also tells them to map high-risk zones. https://www.newindianexpress.com/india/2026/Sep/08/ensure-availability-of-anti-snake-venom-identify-high-risk-snakebite-areas-nhrc-to-states · https://news.abplive.com/news/india/nhrc-notice-to-all-states-uts-after-youth-dies-of-snakebite-due-to-lack-of-facilities-at-up-hospital-1865848
3. **MP ASV distribution gaps (TOI).** 587 of 1,227 PHCs had zero ASV stock. https://timesofindia.indiatimes.com/city/bhopal/triple-surge-in-snakebite-cases-amid-gaps-in-anti-venom-supply-in-mp/articleshow/124278684.cms
4. **Goa anti-rabies vaccine (ARV) shortage (2026).** Victims "do rounds of health centres". https://timesofindia.indiatimes.com/city/goa/shortage-of-anti-rabies-vaccine-in-state-amid-rising-dog-bite-cases/articleshow/129594953.cms · https://www.heraldgoa.in/goa/anti-rabies-vaccine-shortage-reported-at-panaji-urban-health-centre/463730/

**Core insight.** Families lose hours when they drive from centre to centre. The stock data exists inside the health system, but it is not public. It is also not tamper-evident: a centre can silently "fix" the number that it reported yesterday.

## 2. Users and 3-tap flows (Hindi default, English toggle)
**Family (no login, no wallet, no crypto words)**
1. Open the QR code or the link. Then tap **"साँप ने काटा / Snakebite"** or **"कुत्ते ने काटा / Dog bite"**.
2. Look at the nearest centres and their status chips: 🟢 उपलब्ध In stock · 🟡 कम Low · 🔴 नहीं Out · ⚪ पुरानी जानकारी Stale (>6h). Tap **Call** or **Directions**.
3. If the centre has no stock when you arrive, tap **"यहाँ नहीं मिला / Not available here"**. Then tap a reason (out / no doctor / closed). The app shows a receipt and a proof link.

**Centre staff (one synthetic login per centre; the server holds the wallet of that centre)**
1. Open the staff link. Type the PIN.
2. Use the **ASV** and **ARV** steppers to set the number of vials. Tap **Post**. The stock post expires in 6h, so stale data greys out automatically.
3. Find the family report in the inbox. Tap **Confirm**, or ignore the report. On Confirm, the centre wallet writes a readonly `ack` and extends the report to 30 days. If you ignore the report, it expires in 48h.

## 3. Architecture
- **Next.js 16 (App Router) on Azure App Service.** The deploy must stay live until 23 Oct.
- **Server-held wallets.** There is one wallet for each *synthetic* centre (env `CENTRE_KEYS`). One more `PAYER` wallet writes family reports. Keys stay only on the server and never go in the repo.
- **Registry.** An admin wallet creates `centre` entities. The dashboard trusts a stock post only when `$creator` is the registered wallet of the centre (`createdBy()` filter). This stops spoofed stock posts.
- **Stock posts.** Each stock post has a 6h lifetime (`ExpirationTime.fromHours(6)` = 10,800 blocks at 2s). One `executeBatch` per shift covers both drugs. Each shift makes a new stock post, so the history is append-only.
- **Reports.** `flags: { readonly: true, permissionlessExtension: true }`, 48h lifetime. Nobody can edit a report, including us. Anyone can extend a report, so a longer lifetime is not proof that the centre agreed. On Confirm, the centre wallet writes a readonly `ack`, and the `$creator` of the ack is the registered wallet of that centre. The same `executeBatch` extends the report to 30 days, so one action cannot occur without the other. The ack is the acknowledgement.
- **Two boards.** `/demo` shows three synthetic centres. Their stock posts, reports and acks are on Arkiv. `/live` shows the real Durg and Balod centres from the CGMSCL public register. It shows only the last shipment, and we keep this public data off-chain. `/live` uses this data until a centre joins.
- **Public dashboard.** The dashboard uses keyless reads (`createPublicClient`, no wallet). It shows the demo centres, recent reports and acks, every trusted wallet, and the CGMSCL supply gap.
- **No personal data, even hashed.** The app stores no names, phone numbers, GPS location of the person, device IDs or IP. Reports carry only centreId, drug, reason and a coarse hour bucket. Demo centres are synthetic ("Demo PHC Rampur-1"). The Durg and Balod facility data is public CGMSCL data.
- **Stretch goal:** ICU bed counts (`beds` entity, same pattern).

## 4. Non-goals
- Medical advice.
- Writes to Arkiv for real centres before they join.
- User accounts.
- Payments.
