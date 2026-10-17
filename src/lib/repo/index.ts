import "server-only";
import { config } from "../config";
import { ArkivRepo } from "./arkiv";
import { MemoryRepo } from "./memory";
import type { Repo } from "./types";

const g = globalThis as unknown as { __jeevanRepo?: Repo };

/** Process-wide repo. Memory state survives dev hot-reloads via globalThis. */
export function repo(): Repo {
  if (!g.__jeevanRepo) {
    const cfg = config();
    g.__jeevanRepo = cfg.source === "arkiv" ? new ArkivRepo(cfg) : new MemoryRepo();
  }
  return g.__jeevanRepo;
}

export { RepoError } from "./types";
export type { Repo, Snapshot, EntityProof, WriteResult } from "./types";
