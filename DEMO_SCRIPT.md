# 3-minute demo video — shot list
Record on the live site. Use a 390px (phone) width for the family part and a desktop width for the rest. Demo centres and staff are synthetic.

Before you record:
1. Run the keep-alive workflow (or `npm run seed`).
2. Make sure that Rampur-1 shows ASV 0 and Sonpur shows 12.

| Time | Screen | Say (short) |
|---|---|---|
| 0:00–0:20 | `/about`, the Panna headline | "On 4 October, Sapna Bai, 19, died after the health centre in Panna had no anti-venom. India loses about 58,000 people a year to snakebite. Families lose the golden hour as they drive from centre to centre." |
| 0:20–0:40 | `/live` (Hindi), then the gap line on `/dashboard` | "These are the real centres in Durg and Balod, from the public register of the state supplier. Since April, 22 of 45 rural PHCs got no anti-venom. But the district warehouse holds 3,867 vials. The medicine exists. Nobody can see where it is." |
| 0:40–1:05 | `/demo` on the phone: tap साँप ने काटा | "A family scans a QR poster. There is no login and no app, and Hindi comes first. Rampur-1 has no stock. Sonpur has 12 vials, posted 20 minutes ago. The family can call or get directions." |
| 1:05–1:35 | Rampur-1 → यहाँ नहीं मिला → reason → receipt → View proof | "Rampur had no anti-venom. One tap sends a report. The receipt is an Arkiv entity from our payer wallet. It is readonly. Nobody, including us, can edit or delete it." |
| 1:35–2:10 | `/staff`, PIN, post ASV 8, inbox → Confirm | "The nurse signs in with a PIN. She does not need a wallet. Her stock post is one transaction for both drugs. It expires in 6 hours, so stale stock greys out automatically. When she confirms the report, the Rampur wallet signs an acknowledgement. The same atomic batch extends the report to 30 days." |
| 2:10–2:35 | `/dashboard` → Verify it yourself → explorer tab showing the ack's creator | "The public board reads directly from Arkiv with no key. Stock counts only if the registered wallet of the centre wrote it. Here is the ack on the explorer. The creator is the Rampur wallet." |
| 2:35–3:00 | `arkiv/schema.md` table, then back to the phone | "Why Arkiv? Expiry keeps stock honest. `$creator` stops spoofing. Nobody can bury a readonly report. Personal data never goes on chain. It is MIT, so any state can run it for its own districts." |

Before you upload, make sure that:
1. The video is ≤ 3:00.
2. Captions are on.
3. No real names or phone numbers are on screen.
4. The explorer tab is already loaded.
