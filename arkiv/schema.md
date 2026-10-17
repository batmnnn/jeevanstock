# Arkiv schema — JeevanStock
SDK: `@arkiv-network/sdk` **0.8.1** (method names checked against its `.d.ts`). Network: Tiramisu (chain 7738577). 1 block = 2s.
Every entity carries `app = "jeevanstock-demo"` and a `kind`. Centres and staff are synthetic. Attribute names are lowercase with underscores: Tiramisu rejects an uppercase byte in a user attribute name (`Ident32InvalidByte` on `centreId`, friction F6). The app maps them back to camelCase on read (`src/lib/chain-attrs.ts`).

| kind | Created by | Attributes | Payload (JSON) | Lifetime | Flags |
|---|---|---|---|---|---|
| `centre` | admin wallet | app, kind, centre_id (str), district (str), state (str), wallet (addr) | `{name, lat, lon, phone:"demo"}` (synthetic) | 14 days = 604,800 blocks (`fromDays(14)`) | readonly |
| `stock` | that centre's wallet | app, kind, centre_id, drug (`ASV`/`ARV`), vials (u64), status (`in`/`low`/`out`), posted_at (u64, unix s) | `{note}` | 6h = 10,800 blocks (`fromHours(6)`) | — |
| `report` | payer wallet | app, kind, centre_id, drug, reason (`out`/`no_doctor`/`closed`), hour_bucket (u64) | empty | 48h = 86,400 blocks; on confirm extended to 30d = 1,296,000 blocks | readonly, permissionlessExtension |
| `ack` | that centre's wallet | app, kind, centre_id, report_key (str, the report entity key) | empty | 30 days = 1,296,000 blocks (`fromDays(30)`) | readonly |

## Wallets and live entities (Tiramisu)
| Role | Address | Creates |
|---|---|---|
| Admin | [`0xE0Fd8bFff3148D9BDA2fa3BbFAfFD9A117E3cD8F`](https://tiramisu.explorer.arkiv.network/address/0xE0Fd8bFff3148D9BDA2fa3BbFAfFD9A117E3cD8F) | `centre` |
| Payer | [`0xb5B8ce16CebC22802a72204da4E9Fb58ec485705`](https://tiramisu.explorer.arkiv.network/address/0xb5B8ce16CebC22802a72204da4E9Fb58ec485705) | `report` |
| Demo PHC Rampur-1 | [`0x5F8b8520FfdBaBd4096Bc1b3ad9d57c0d4723975`](https://tiramisu.explorer.arkiv.network/address/0x5F8b8520FfdBaBd4096Bc1b3ad9d57c0d4723975) | `stock`, `ack` |
| Demo CHC Sonpur | [`0x1AB16c702008422EA2924DE60607bB81dcbF3014`](https://tiramisu.explorer.arkiv.network/address/0x1AB16c702008422EA2924DE60607bB81dcbF3014) | `stock`, `ack` |
| Demo PHC Kalapur-2 | [`0x9f13eF0aBCe7a6e37D612C35f629B12C212D0D33`](https://tiramisu.explorer.arkiv.network/address/0x9f13eF0aBCe7a6e37D612C35f629B12C212D0D33) | `stock`, `ack` |

Centre entities (expire ~1 Nov 2026; `npm run seed` re-registers):
- Rampur-1 [`0x1e0d5731…1861be`](https://tiramisu.explorer.arkiv.network/entity/0x1e0d57314c4d683a2759e30494a4dc925411db6bd794092f81d6e585da1861be)
- Sonpur [`0xbaf9f21f…e058c2`](https://tiramisu.explorer.arkiv.network/entity/0xbaf9f21f25e8e3a3068148d29a2366f416da74b22981d0fc388d6a6577e058c2)
- Kalapur-2 [`0x7c0e6400…886c38`](https://tiramisu.explorer.arkiv.network/entity/0x7c0e64007fbae8426cf1037fe06f69a9d735fb087fed02365b5ba71bc0886c38)

A family report written from the local app on 17 Oct: [`0x2d5dc58f…4c1e84`](https://tiramisu.explorer.arkiv.network/entity/0x2d5dc58f6884d30d54c6a0aab22a47ca217b0e34d99d25550d45d2c13c4c1e84). Every receipt on the site links to its own entity.

## What is not on Arkiv, and why
| Data | Where it lives | Why |
|---|---|---|
| Durg/Balod facility list and CGMSCL issue history | `src/data/cg-durg-balod.json`, with source URLs | Public government data we didn't author; signing it would imply we vouch for it |
| A family's location | The browser only | Distance sorting needs no server, so the location never leaves the phone |
| Names, phones, IPs, device IDs | Nowhere | Never collected. Arkiv data is public forever-ish; the schema is the privacy boundary |
| Staff PINs, signing keys, session secret | Server environment | Secrets |

## Calls used (all exist in 0.8.1)
```ts
import { createPublicClient, createWalletClient, ExpirationTime, jsonToPayload } from "@arkiv-network/sdk";
import { tiramisu } from "@arkiv-network/sdk/chains";
import { eq } from "@arkiv-network/sdk/query";
import { u64 } from "@arkiv-network/sdk/attr";

// one shift = one transaction for both drugs (centre wallet)
const r = await centreWallet.executeBatch({
  creates: [
    { payload: jsonToPayload({ note: "" }), contentType: "application/json", expires: ExpirationTime.fromHours(6),
      attributes: { app: "jeevanstock-demo", kind: "stock", centre_id: "DEMO-RAMPUR-1", drug: "ASV", vials: u64(12n), status: "in", posted_at: u64(BigInt(now)) } },
    { /* same for ARV */ },
  ],
});
// r.txHash, r.createdEntities (keys, in order)

// trusted latest stock for one centre: filter by $creator
await pub.select({ key: true, attributes: true, createdAt: true, expiresAt: true })
  .where(eq("app", "jeevanstock-demo"), eq("kind", "stock"), eq("centre_id", "DEMO-RAMPUR-1"))
  .createdBy(centreWallet).limit(50);

// family report (payer wallet): readonly, anyone may extend
await payer.createEntity({ payload: new Uint8Array(), contentType: "application/octet-stream",
  attributes: { app: "jeevanstock-demo", kind: "report", centre_id: "DEMO-RAMPUR-1", drug: "ASV", reason: "out", hour_bucket: u64(BigInt(hour)) },
  expires: ExpirationTime.fromHours(48), flags: { readonly: true, permissionlessExtension: true } });

// confirm: ack + 30-day extension, atomic. The extension is skipped when the report already
// outlives 30 days — anyone may extend it, and a redundant extension would revert the batch.
// Lifetime is NOT the proof: ExpiryExtended.owner is the entity owner, not the sender.
// Only an ack whose $creator is the centre's registered wallet counts.
await centreWallet.executeBatch({
  creates: [{ payload: new Uint8Array(), contentType: "application/octet-stream", expires: ExpirationTime.fromDays(30), flags: { readonly: true },
    attributes: { app: "jeevanstock-demo", kind: "ack", centre_id: "DEMO-RAMPUR-1", report_key: reportKey } }],
  extensions: [{ entityKey: reportKey, expires: ExpirationTime.fromDays(30) }],
});

// proof card
await pub.getEntity(key); // creator, owner, creationFlags, createdAt, expiresAt, attributes
```
Measured on Tiramisu (17 Oct, local server → RPC, including receipt wait): report 8.7s, shift post (2 creates, 1 tx) 7.8s, confirm (create + extend, 1 tx) 6.8s. Separate transactions took ~20s and ~18s.

Also used: `getBlockTiming` (for expiry maths). Limits (SDK source): MAX_ATTRIBUTES = 32, MAX_PAYLOAD_BYTES = 128 KiB.
Reads go through `src/lib/rpc.ts`: an `X-API-KEY` header when `ARKIV_API_KEY` is set, and no automatic retries (friction F7).
