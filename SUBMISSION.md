# Devfolio answers (draft — edit before submitting; nothing submitted)
Tracks: Best Indian Use Case · Security · Censorship Resistance · Open Source (one prize per team). Requires an Indian-national team member for the India track (**Shubham to confirm**).

## Best Indian Use Case
- **Why India:** India has the world's highest snakebite toll. NHRC ordered all states (8 Sep 2026) to ensure ASV availability. Panna death 4 Oct 2026 (TOI); 587/1,227 MP PHCs had zero ASV (TOI); Goa ARV shortage 2026. Hindi-first, QR, no login.
- **Why Arkiv:** stock truth must be fresh (6h expiry), attributable (`$creator`) and un-erasable (readonly reports) without a central DB that one official can quietly edit.
- **How:** see arkiv/schema.md: centre/stock/report entities, createdBy filters, extendEntity on confirm, keyless public reads.
- **Friction:** arkiv/friction.md.

## Security
- **Why pillar:** stock data is spoofable today (phone calls, WhatsApp forwards). We bind every post to a registered centre wallet and drop anything else.
- **Why Arkiv:** `$creator` is set by the chain, not the client. Readonly flag + owner-only patch = no silent edits. Expiry limits the damage from stale data.
- **How:** registry by admin wallet → dashboard trusts `createdBy(centreWallet)` only; reports readonly; server keys never reach the client; no personal data stored.
- **Friction:** no paymaster forces server-held keys (F2); documented in the threat model.

## Censorship Resistance
- **Why pillar:** shortages are embarrassing, so reports get suppressed. A citizen's "not available here" must survive.
- **Why Arkiv:** readonly reports can't be edited by anyone; `permissionlessExtension` lets anyone (an NGO, a journalist) keep a report alive; data is replicated and anchored to Ethereum (docs).
- **How:** reports written by the payer, readonly + permissionlessExtension; the public dashboard reads straight from the RPC with no backend in between.
- **Caveat (honest):** block production is centralised on testnet (roadmap).

## Open Source
- **Why pillar:** any state or NGO can fork it for its own districts at near-zero infra cost.
- **Why Arkiv:** the open data layer is the product; anyone can build a different UI on the same entities.
- **How:** MIT repo, documented schema, seed script, keyless read client.
- **Friction:** faucet not scriptable (F1); no fee formula (F3).
