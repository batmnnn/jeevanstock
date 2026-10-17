import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui";
import { Unavailable } from "@/components/unavailable";
import { Main } from "@/components/dashboard/shell";
import { ProofCard } from "@/components/proof/proof-card";
import { isProofKey } from "@/lib/dashboard/keys";
import { common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { repo, RepoError, type EntityProof, type Snapshot } from "@/lib/repo";
import { proof } from "@/messages/dashboard";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: proof[lang].metaTitle };
}

export default async function VerifyPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isProofKey(key)) notFound();
  const lang = await getLang();
  const r = repo();
  let entity: EntityProof | null;
  let snap: Snapshot;
  try {
    [entity, snap] = await Promise.all([r.getEntity(key), r.snapshot()]);
  } catch (e) {
    if (e instanceof RepoError && e.code === "unavailable") {
      return (
        <Main width="proof">
          <Unavailable lang={lang} retryHref={`/verify/${key}`} />
        </Main>
      );
    }
    throw e;
  }
  if (!entity) notFound();
  return (
    <Main width="proof">
      <BackLink href="/dashboard" label={common[lang].back} />
      <ProofCard lang={lang} source={r.source} entity={entity} snap={snap} />
    </Main>
  );
}
