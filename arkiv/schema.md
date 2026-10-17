# Arkiv schema — JeevanStock
SDK: `@arkiv-network/sdk` **0.8.1** (method names checked against its `.d.ts`). Network: Tiramisu (chain 7738577). 1 block = 2s.
Every entity carries `app = "jeevanstock-demo"` and a `kind`. All data is synthetic.

| kind | Created by | Attributes | Payload (JSON) | Lifetime | Flags |
|---|---|---|---|---|---|
| `centre` | admin wallet | app, kind, centreId (str), district (str), state (str), wallet (addr) | `{name, lat, lon, phone:"demo"}` (synthetic) | 14 days = 604,800 blocks (`fromDays(14)`) | readonly |
| `stock` | that centre's wallet | app, kind, centreId, drug (`ASV`/`ARV`), vials (u64), status (`in`/`low`/`out`), postedAt (u64, unix s) | `{note}` | 6h = 10,800 blocks (`fromHours(6)`) | — |
| `report` | payer wallet | app, kind, centreId, drug, reason (`out`/`no_doctor`/`closed`), hourBucket (u64) | `{}` (empty) | 48h = 86,400 blocks; on confirm the centre extends to 30d = 1,296,000 blocks | readonly, permissionlessExtension |

## Calls used (all exist in 0.8.1)
```ts
import { createPublicClient, createWalletClient, ExpirationTime, jsonToPayload } from "@arkiv-network/sdk";
import { tiramisu } from "@arkiv-network/sdk/chains";
import { eq, and } from "@arkiv-network/sdk/query";
import { u64 } from "@arkiv-network/sdk/attr";

// create (centre wallet)
await wallet.createEntity({ payload: jsonToPayload({ note: "" }), contentType: "application/json",
  attributes: { app: "jeevanstock-demo", kind: "stock", centreId: "DEMO-RAMPUR-1", drug: "ASV", vials: u64(12n), status: "in", postedAt: u64(BigInt(now)) },
  expires: ExpirationTime.fromHours(6) });

// trusted latest stock for one centre: filter by $creator
await pub.select({ key: true, attributes: true, createdAt: true, expiresAt: true })
  .where(eq("app", "jeevanstock-demo"), eq("kind", "stock"), eq("centreId", "DEMO-RAMPUR-1"))
  .createdBy(centreWallet).limit(20).fetch();

// unacknowledged reports for a centre
await pub.select({ key: true, attributes: true }).where(and(eq("kind","report"), eq("centreId","DEMO-RAMPUR-1"))).createdBy(payer).fetch();

// confirm = extend (signed by the centre wallet; allowed by permissionlessExtension)
await centreWallet.extendEntity({ entityKey, expires: ExpirationTime.fromDays(30) });

// batch seeding
await wallet.executeBatch({ creates: [ /* CreateEntityParameters[] */ ] });
// live updates
pub.watchEntityEvents({ /* see WatchEntityEventsParameters */ });
```
Also available: `getEntity`, `query` (raw string), `getBlockTiming`, `patchEntity`, `deleteEntity`, `changeOwnership`.
Limits (from SDK source): MAX_ATTRIBUTES = 32, MAX_PAYLOAD_BYTES = 128 KiB.
`executeBatch` takes `{ creates, patches, deletes, extensions, ownershipChanges }` (verified in the typings). **Unverified:** The `watchEntityEvents` parameter shape has not been tested.
