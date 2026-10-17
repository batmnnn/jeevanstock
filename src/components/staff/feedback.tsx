"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { common, type Lang } from "@/lib/i18n";
import { shortHex } from "@/lib/explorer";
import { staffErrorText } from "@/lib/staff/errors";
import type { StaffFormState } from "@/lib/staff/form-state";
import { parseReportKey } from "@/lib/staff/report-key";
import { staff } from "@/messages/staff";

export function FormFeedback({
  lang,
  state,
  errorId = "form-error",
}: {
  lang: Lang;
  state: StaffFormState;
  errorId?: string;
}) {
  const t = staff[lang];
  const c = common[lang];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "error") ref.current?.focus();
  }, [state]);

  const proofs = state.proofs.flatMap((p) => {
    const key = parseReportKey(p.key);
    if (!key) return [];
    const label = p.kind === "report" ? t.reportWord : c.drugShort[p.kind];
    return [{ key, label }];
  });

  return (
    <>
      {state.status === "error" && state.errors.length > 0 && (
        <div
          ref={ref}
          id={errorId}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="rounded-r-xl border-l-4 border-out bg-out-soft px-4 py-3"
        >
          <p className="font-bold">{t.errorTitle}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {state.errors.map((err, i) => {
              const message = staffErrorText(err, t);
              return (
                <li key={`${err.code}-${i}`}>
                  {err.href ? (
                    <a className="font-semibold text-ink underline underline-offset-4" href={err.href}>
                      {message}
                    </a>
                  ) : (
                    message
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {state.status === "ok" && state.ok && (
        <div role="status" aria-live="polite" className="glass rounded-2xl px-4 py-4">
          <h2 className="text-lg font-bold">{state.ok === "posted" ? t.postedOk : t.confirmedOk}</h2>
          {state.ok === "posted" && <p className="mt-1">{t.postedNext}</p>}
          {proofs.length > 0 && <ProofList lang={lang} proofs={proofs} onBrand />}
        </div>
      )}
      {state.status === "error" && proofs.length > 0 && (
        <div className="glass rounded-2xl px-4 py-3">
          <ProofList lang={lang} proofs={proofs} />
        </div>
      )}
    </>
  );
}

function ProofList({
  lang,
  proofs,
  onBrand = false,
}: {
  lang: Lang;
  proofs: { key: string; label: string }[];
  onBrand?: boolean;
}) {
  const proof = common[lang].proof;
  return (
    <ul className="mt-3 space-y-2">
      {proofs.map((p) => (
        <li key={p.key}>
          <span className="font-semibold">{p.label} </span>
          <Link
            href={`/verify/${p.key}`}
            className={onBrand ? "underline underline-offset-4" : "font-semibold text-brand underline underline-offset-4"}
          >
            <span className="sr-only">{proof} </span>
            <span className="font-mono">{shortHex(p.key)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
