import Link from "next/link";
import { parseReportKey } from "@/lib/staff/report-key";

export function ProofLink({ entityKey, label }: { entityKey: string; label: string }) {
  const key = parseReportKey(entityKey);
  if (!key) return null;
  return (
    <Link href={`/verify/${key}`} className="inline-flex min-h-12 items-center font-semibold text-brand underline underline-offset-4">
      {label}
    </Link>
  );
}
