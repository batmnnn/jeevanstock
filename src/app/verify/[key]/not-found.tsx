import { Main } from "@/components/dashboard/shell";
import { MissingProof } from "@/components/proof/missing";
import { getLang } from "@/lib/lang";

export default async function VerifyNotFound() {
  const lang = await getLang();
  return (
    <Main width="proof">
      <MissingProof lang={lang} />
    </Main>
  );
}
