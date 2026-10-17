import type { Drug, Reason } from "../centres";
import type { Ack, Centre, Report, StockPost } from "../domain";

export interface WriteResult {
  entityKey: string;
  txHash: string;
}

export interface EntityProof {
  key: string;
  kind: string;
  creator: string;
  owner: string;
  createdAtBlock: number;
  expiresAtBlock: number;
  readonly: boolean;
  permissionlessExtension: boolean;
  attributes: Record<string, string>;
}

export interface Snapshot {
  centres: Centre[];
  stock: StockPost[];
  reports: Report[];
  /** Acks created by registered centre wallets. A longer report expiry is not an ack. */
  acks: Ack[];
  currentBlock: number;
  nowSec: number;
  /** Addresses the read side trusts. Public information. */
  admin: string;
  payer: string;
}

/** Everything the app needs from storage. Arkiv in production, in-memory for dev/tests. */
export interface Repo {
  readonly source: "arkiv" | "memory";
  snapshot(): Promise<Snapshot>;
  getEntity(key: string): Promise<EntityProof | null>;
  postStock(centreId: string, drug: Drug, vials: number): Promise<WriteResult>;
  /** One shift's counts in one write. Keys come back in the order given. */
  postShift(centreId: string, counts: readonly { drug: Drug; vials: number }[]): Promise<WriteResult[]>;
  fileReport(centreId: string, drug: Drug, reason: Reason): Promise<WriteResult>;
  /** Signed by the centre's own wallet; only reports about that centre may be confirmed. */
  confirmReport(centreId: string, reportKey: string): Promise<WriteResult>;
}

export class RepoError extends Error {
  constructor(
    public code: "not_found" | "forbidden" | "invalid" | "unavailable",
    message: string,
  ) {
    super(message);
  }
}
