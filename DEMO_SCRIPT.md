# 3-minute demo video — shot list
Record on the live site at 390px (phone) for the family part and desktop for the rest. Demo centres and staff are synthetic. Before recording: run the keep-alive (or `npm run seed`) so Rampur-1 shows ASV 0 and Sonpur shows 12.

| Time | Screen | Say (short) |
|---|---|---|
| 0:00–0:20 | `/about`, the Panna headline | "On 4 October, Sapna Bai, 19, died after the health centre in Panna had no anti-venom. India loses about 58,000 people a year to snakebite. Families lose the golden hour driving from centre to centre." |
| 0:20–0:40 | `/live` (Hindi), then the gap line on `/dashboard` | "These are the real centres in Durg and Balod, from the state supplier's public register. 22 of 45 rural PHCs got no anti-venom since April, while the district warehouse holds 3,867 vials. The medicine exists. Nobody can see where it is." |
| 0:40–1:05 | `/demo` on the phone: tap साँप ने काटा | "A family scans a QR poster. No login, no app, Hindi first. Rampur-1 is out, Sonpur has 12 vials, posted 20 minutes ago. Call or get directions." |
| 1:05–1:35 | Rampur-1 → यहाँ नहीं मिला → reason → receipt → View proof | "At Rampur there was none. One tap files a report. The receipt is an Arkiv entity: written by our reporter wallet, readonly — nobody, including us, can edit or delete it." |
| 1:35–2:10 | `/staff`, PIN, post ASV 8, inbox → Confirm | "The nurse signs in with a PIN — no wallet. Her post is one transaction for both drugs and expires in 6 hours, so stale stock greys out by itself. Confirming writes an acknowledgement signed by Rampur's own wallet and extends the report to 30 days, in one atomic batch." |
| 2:10–2:35 | `/dashboard` → Verify it yourself → explorer tab showing the ack's creator | "The public board reads straight from Arkiv with no key. Stock counts only if the centre's registered wallet wrote it. Here's the ack on the explorer — creator is the Rampur wallet." |
| 2:35–3:00 | `arkiv/schema.md` table, then back to the phone | "Why Arkiv: expiry keeps stock honest, `$creator` stops spoofing, readonly reports can't be buried. Personal data never goes on chain. It's MIT — any state can run it for its own districts." |

Checks before upload: ≤ 3:00, captions on, no real names or phone numbers on screen, the explorer tab already loaded.
