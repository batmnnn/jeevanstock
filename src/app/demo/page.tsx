import type { Metadata } from "next";
import { FamilyBoard } from "@/components/family/board-page";
import { parseNeed } from "@/lib/family/need";
import { getLang } from "@/lib/lang";
import { family } from "@/messages/family";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ need?: string | string[] }>;
}): Promise<Metadata> {
  const lang = await getLang();
  const need = parseNeed((await searchParams).need);
  const t = family[lang];
  return { title: need ? t.resultsTitle[need] : t.demoTitle };
}

export default function DemoPage({ searchParams }: { searchParams: Promise<{ need?: string | string[] }> }) {
  return <FamilyBoard board="demo" searchParams={searchParams} />;
}
