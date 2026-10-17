import type { Metadata } from "next";
import Link from "next/link";
import { FooterNav } from "@/components/dashboard/footer-nav";
import { Main } from "@/components/dashboard/shell";
import { Card } from "@/components/ui";
import { CENTRES } from "@/lib/centres";
import { getLang } from "@/lib/lang";
import { poster } from "@/messages/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: poster[lang].metaTitle };
}

export default async function PosterIndexPage() {
  const lang = await getLang();
  const t = poster[lang];
  return (
    <Main width="board">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">{t.indexTitle}</h1>
        <p className="mt-3 text-lg text-ink-2">{t.indexLede}</p>
      </header>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CENTRES.map((centre) => (
          <Card key={centre.centreId} as="li" className="h-full">
            <h2 className="text-lg font-semibold leading-snug">{centre.name}</h2>
            <p className="mt-1 text-sm text-ink-3">
              {centre.district}
              <span aria-hidden> · </span>
              {centre.state}
            </p>
            <p className="mt-4">
              <Link href={`/poster/${centre.centreId}`} className="font-semibold text-brand underline-offset-4 hover:underline">
                {t.open}
              </Link>
            </p>
          </Card>
        ))}
      </ul>
      <FooterNav lang={lang} current="/poster" />
    </Main>
  );
}
