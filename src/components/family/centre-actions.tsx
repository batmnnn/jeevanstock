"use client";

import { btn, cx } from "@/components/ui";

export function CentreActions({
  name,
  directionsUrl,
  labels,
}: {
  name: string;
  directionsUrl: string | null;
  labels: { directions: string; call: string; demoNote: string; newTab: string };
}) {
  return (
    <div className="relative z-10 mt-3 flex flex-wrap gap-2">
      {directionsUrl ? (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${labels.directions} — ${name} (${labels.newTab})`}
          className={cx(btn.secondary, "min-w-0 flex-1")}
        >
          {labels.directions}
        </a>
      ) : null}
      <button
        type="button"
        aria-disabled="true"
        aria-label={`${labels.call} — ${name}, ${labels.demoNote}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        className="inline-flex min-h-12 min-w-0 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-line-2 bg-paper px-4 text-base font-semibold text-ink-3"
      >
        {labels.call}
        <span>· {labels.demoNote}</span>
      </button>
    </div>
  );
}
