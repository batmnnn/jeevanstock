import { EmergencyCall } from "@/components/family/emergency-call";
import { ButtonLink, PageShell } from "@/components/ui";
import { common } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { family } from "@/messages/family";

export async function MissingPage() {
  const lang = await getLang();
  const t = family[lang];
  const c = common[lang];
  return (
    <PageShell>
      <h1 className="text-2xl font-bold leading-tight">{t.notFoundTitle}</h1>
      <p className="mt-2 text-lg text-ink-2">{t.notFoundBody}</p>
      <div className="mt-6 grid gap-3">
        <EmergencyCall label={c.call108} />
        <ButtonLink href="/" variant="secondary">
          {t.chooseCentre}
        </ButtonLink>
      </div>
    </PageShell>
  );
}
