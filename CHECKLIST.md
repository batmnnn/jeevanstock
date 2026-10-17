# Submission checklist
Deadline: Sun 19 Oct 04:29 IST (= 18 Oct 23:59 London). Keep the deploy live until 23 Oct.

| Gate | Status |
|---|---|
| Public deployment, no access request | Azure App Service. See README |
| Public MIT repo | github.com/batmnnn/jeevanstock |
| `arkiv/schema.md`, `arkiv/friction.md` | done |
| Wallet addresses that create entities | SUBMISSION.md, schema.md, `/dashboard` → Verify it yourself |
| Reproducible steps | README → "Run it on Arkiv" and "For judges" |
| Demo video ≤ 3:00 | DEMO_SCRIPT.md shot list |
| Built 9–18 Oct | first commit `223f490`, 17 Oct; no earlier code |
| Devfolio form, all questions | SUBMISSION.md |
| Demo stock stays fresh | `.github/workflows/keepalive.yml`, every 4h |
| Tiramisu access key (the keyless budget runs out, F7) | `ARKIV_API_KEY` in app settings and repo secrets |

Rules:
1. Do not put real personal data anywhere.
2. Do not force-push after the deadline.
