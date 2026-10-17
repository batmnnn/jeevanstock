"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/staff";
import { CENTRES } from "@/lib/centres";
import type { Lang } from "@/lib/i18n";
import { IDLE_STAFF_FORM } from "@/lib/staff/form-state";
import { cx } from "@/components/ui";
import { staff } from "@/messages/staff";
import { FormFeedback } from "./feedback";
import { PendingButton, PendingNote } from "./pending";

const field =
  "mt-1 block min-h-12 w-full scroll-mt-24 rounded-xl border bg-surface px-3 text-base";

export function LoginForm({ lang }: { lang: Lang }) {
  const t = staff[lang];
  const [state, action] = useActionState(login, IDLE_STAFF_FORM);
  const badCentre = state.invalid.includes("centreId");
  const badPin = state.invalid.includes("pin");
  const described = state.status === "error" ? "pin-hint form-error" : "pin-hint";

  return (
    <form action={action} autoComplete="off" className="space-y-4">
      <fieldset className="space-y-4">
        <legend className="block w-full">
          <h1 className="text-2xl font-bold">{t.loginTitle}</h1>
        </legend>
        <p className="text-ink-2">{t.loginLead}</p>
        <FormFeedback lang={lang} state={state} />
        <div>
          <label htmlFor="centreId" className="block font-semibold">
            {t.centreLabel}
          </label>
          <select
            id="centreId"
            name="centreId"
            required
            defaultValue=""
            autoComplete="off"
            aria-invalid={badCentre || undefined}
            aria-describedby={badCentre ? "form-error" : undefined}
            className={cx(field, badCentre ? "border-out" : "border-line-2")}
          >
            <option value="" disabled>
              {t.centrePlaceholder}
            </option>
            {CENTRES.map((c) => (
              <option key={c.centreId} value={c.centreId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pin" className="block font-semibold">
            {t.pinLabel}
          </label>
          <p id="pin-hint" className="text-sm text-ink-3">
            {t.pinHint}
          </p>
          <input
            id="pin"
            name="pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={8}
            required
            aria-invalid={badPin || undefined}
            aria-describedby={described}
            className={cx(field, "tabular tracking-widest", badPin ? "border-out" : "border-line-2")}
          />
        </div>
      </fieldset>
      <PendingNote label={t.checking} reserve />
      <PendingButton idle={t.signIn} pending={t.checking} className="w-full" />
    </form>
  );
}
