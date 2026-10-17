import "server-only";
import { unstable_rethrow } from "next/navigation";
import { repo, RepoError, type Snapshot } from "@/lib/repo";

/** Null means the stock network is down. Other failures propagate. */
export async function readBoard(): Promise<Snapshot | null> {
  try {
    return await repo().snapshot();
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof RepoError && error.code === "unavailable") return null;
    throw error;
  }
}
