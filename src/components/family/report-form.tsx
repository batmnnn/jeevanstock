"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import type { Drug, Reason } from "@/lib/centres";
import type { ReportErrorCode, ReportField, ReportFormState } from "@/lib/family/report-state";
import { IDLE_REPORT_STATE, reportErrorItems } from "@/lib/family/report-state";
import { btn, cx } from "@/components/ui";

type ErrorText = Record<ReportField | Exclude<ReportErrorCode, "validation">, string>;

export interface ReportFormCopy {
  drugQuestion: string;
  drugHint: string;
  reasonQuestion: string;
  reasonHint: string;
  drugs: Record<Drug, string>;
  reasons: Record<Reason, string>;
  submit: string;
  pending: string;
  errorTitle: string;
  errorPrefix: string;
  errors: ErrorText;
}

type ReportAction = (state: ReportFormState, formData: FormData) => Promise<ReportFormState>;

const DRUGS: Drug[] = ["ASV", "ARV"];
const REASONS: Reason[] = ["out", "no_doctor", "closed"];

function message(item: { field: ReportField | null; code: ReportErrorCode }, errors: ErrorText): string {
  if (item.field) return errors[item.field];
  if (item.code === "validation") return errors.invalid;
  return errors[item.code];
}

function SubmitRow({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" className={cx(btn.primary, "w-full")} disabled={pending}>
        {label}
      </button>
      <p role="status" aria-live="polite" className="mt-3 min-h-6 text-base text-ink-2">
        {pending ? pendingLabel : ""}
      </p>
    </>
  );
}

export function ReportForm({
  action,
  centreId,
  defaultDrug,
  copy,
}: {
  action: ReportAction;
  centreId: string;
  defaultDrug: Drug | null;
  copy: ReportFormCopy;
}) {
  const [state, formAction, pending] = useActionState(action, IDLE_REPORT_STATE);
  const summaryRef = useRef<HTMLDivElement>(null);
  const items = reportErrorItems(state);
  const drugError = items.some((item) => item.field === "drug");
  const reasonError = items.some((item) => item.field === "reason");

  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
  }, [state]);

  return (
    <form action={formAction} noValidate aria-busy={pending} className="mt-6">
      <input type="hidden" name="centreId" value={centreId} />
      {items.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="error-summary-title"
          className="mb-6 scroll-mt-20 border-l-4 border-out bg-out-soft p-4"
        >
          <h2 id="error-summary-title" className="text-lg font-bold text-out">
            {copy.errorTitle}
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {items.map((item) => {
              const text = message(item, copy.errors);
              const href = item.field && item.field !== "centreId" ? `#${item.field}` : undefined;
              return (
                <li key={`${item.code}-${item.field ?? "form"}`}>
                  {href ? (
                    <a href={href} className="font-semibold text-out underline underline-offset-4">
                      {text}
                    </a>
                  ) : (
                    <span className="font-semibold text-out">{text}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <fieldset
        id="drug"
        aria-invalid={drugError || undefined}
        aria-describedby={drugError ? "drug-error" : "drug-hint"}
        className={cx(drugError && "border-l-4 border-out pl-3")}
      >
        <legend className="text-xl font-bold">{copy.drugQuestion}</legend>
        <p id="drug-hint" className="mt-1 text-ink-2">
          {copy.drugHint}
        </p>
        {drugError ? (
          <p id="drug-error" className="mt-2 font-semibold text-out">
            <span className="sr-only">{copy.errorPrefix}</span>
            {copy.errors.drug}
          </p>
        ) : null}
        <div className="mt-3 grid gap-3">
          {DRUGS.map((drug) => (
            <label
              key={drug}
              htmlFor={`drug-${drug}`}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-line-2 bg-surface px-4 py-3 has-[:checked]:border-brand has-[:checked]:bg-brand-soft"
            >
              <input
                id={`drug-${drug}`}
                type="radio"
                name="drug"
                value={drug}
                defaultChecked={defaultDrug === drug}
                className="size-6 shrink-0 accent-brand"
              />
              <span className="text-base font-semibold">{copy.drugs[drug]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset
        id="reason"
        aria-invalid={reasonError || undefined}
        aria-describedby={reasonError ? "reason-error" : "reason-hint"}
        className={cx("mt-8", reasonError && "border-l-4 border-out pl-3")}
      >
        <legend className="text-xl font-bold">{copy.reasonQuestion}</legend>
        <p id="reason-hint" className="mt-1 text-ink-2">
          {copy.reasonHint}
        </p>
        {reasonError ? (
          <p id="reason-error" className="mt-2 font-semibold text-out">
            <span className="sr-only">{copy.errorPrefix}</span>
            {copy.errors.reason}
          </p>
        ) : null}
        <div className="mt-3 grid gap-3">
          {REASONS.map((reason) => (
            <label
              key={reason}
              htmlFor={`reason-${reason}`}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-line-2 bg-surface px-4 py-3 has-[:checked]:border-brand has-[:checked]:bg-brand-soft"
            >
              <input
                id={`reason-${reason}`}
                type="radio"
                name="reason"
                value={reason}
                className="size-6 shrink-0 accent-brand"
              />
              <span className="text-base font-semibold">{copy.reasons[reason]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8">
        <SubmitRow label={copy.submit} pendingLabel={copy.pending} />
      </div>
    </form>
  );
}
