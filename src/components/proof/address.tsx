import { addressUrl, shortHex } from "@/lib/explorer";
import { displayAddress } from "@/lib/dashboard/trust";

export function ChainAddress({
  address,
  source,
  linkLabel,
  empty,
  full = false,
}: {
  address: string;
  source: "arkiv" | "memory";
  linkLabel: string;
  empty: string;
  full?: boolean;
}) {
  const shown = displayAddress(address);
  if (!shown) return <span className="text-ink-3">{empty}</span>;
  const short = shortHex(shown);
  const body =
    source === "arkiv" ? (
      <a href={addressUrl(shown)} className="font-mono text-sm font-medium text-brand underline-offset-4 hover:underline" rel="noreferrer" title={shown}>
        {short}
        <span className="sr-only"> ({linkLabel})</span>
      </a>
    ) : (
      <code className="font-mono text-sm" title={shown}>
        {short}
      </code>
    );
  return (
    <span className="inline-flex max-w-full flex-col gap-1">
      {body}
      {full ? <span className="break-all font-mono text-xs text-ink-3">{shown}</span> : null}
    </span>
  );
}
