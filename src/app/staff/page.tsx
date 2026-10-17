import type { Metadata } from "next";
import { LoginForm } from "@/components/staff/login-form";
import { LogoutButton } from "@/components/staff/logout-button";
import { ButtonLink, Card, Mono, PageShell } from "@/components/ui";
import { CENTRES } from "@/lib/centres";
import { config } from "@/lib/config";
import { getLang } from "@/lib/lang";
import { centreName, isCentreId } from "@/lib/staff/login";
import { getStaffCentre } from "@/lib/session";
import { staff } from "@/messages/staff";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: staff[lang].metaLogin };
}

export default async function StaffLoginPage() {
  const lang = await getLang();
  const t = staff[lang];
  const session = await getStaffCentre();
  const known = session && isCentreId(session) ? session : null;
  const name = known ? (centreName(known) ?? known) : null;
  const showPins = config().showDemoPins;

  return (
    <PageShell className="space-y-4">
      {session && (
        <Card>
          <p className="font-semibold">{t.already}</p>
          {known && name && (
            <>
              <p className="mt-1 text-sm text-ink-2">{t.switchHint}</p>
              <ButtonLink href={`/staff/${known}`} className="mt-3 w-full">
                {t.continueTo(name)}
              </ButtonLink>
            </>
          )}
          <div className="mt-3">
            <LogoutButton label={t.logout} />
          </div>
        </Card>
      )}
      {showPins && <DemoPins langTitle={t.demoTitle} langBody={t.demoBody} />}
      <Card>
        <LoginForm lang={lang} />
      </Card>
    </PageShell>
  );
}

function DemoPins({ langTitle, langBody }: { langTitle: string; langBody: string }) {
  const pins = config().centrePins;
  return (
    <aside aria-labelledby="demo-pins" className="rounded-[var(--radius-card)] border-2 border-low bg-low-soft p-4">
      <h2 id="demo-pins" className="font-bold">
        {langTitle}
      </h2>
      <p className="mt-1 text-sm text-ink-2">{langBody}</p>
      <ul className="mt-3 space-y-2">
        {CENTRES.map((centre) => {
          const pin = pins.get(centre.centreId);
          if (!pin) return null;
          return (
            <li key={centre.centreId} className="flex items-baseline justify-between gap-3 rounded-lg bg-surface px-3 py-2">
              <span className="font-medium">{centre.name}</span>
              <Mono className="text-lg font-bold tabular">{pin}</Mono>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
