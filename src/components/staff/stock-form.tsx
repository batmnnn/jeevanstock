"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { postStockAction } from "@/app/actions/staff";
import { StatusChip, cx } from "@/components/ui";
import { MAX_VIALS, statusForVials } from "@/lib/domain";
import { common, type Lang } from "@/lib/i18n";
import { IDLE_STAFF_FORM } from "@/lib/staff/form-state";
import { parseVial, stepVial } from "@/lib/staff/vials";
import { staff } from "@/messages/staff";
import { FormFeedback } from "./feedback";
import { PendingButton, PendingNote } from "./pending";

const stepBtn =
  "glass inline-flex size-12 items-center justify-center rounded-2xl text-2xl font-medium leading-none text-ink hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50";

export function StockForm({ lang, initialAsv, initialArv }: { lang: Lang; initialAsv: number; initialArv: number }) {
  const t = staff[lang];
  const c = common[lang];
  const [state, action] = useActionState(postStockAction, IDLE_STAFF_FORM);
  const [asv, setAsv] = useState(String(initialAsv));
  const [arv, setArv] = useState(String(initialArv));

  useEffect(() => {
    setAsv(String(initialAsv));
    setArv(String(initialArv));
  }, [initialAsv, initialArv]);

  return (
    <form action={action} className="mt-4 space-y-5 border-t border-line pt-4">
      <fieldset className="space-y-5">
        <legend className="block w-full">
          <h2 id="post-heading" className="text-lg font-bold">
            {t.postLegend}
          </h2>
        </legend>
        <p className="text-ink-2">{t.postHint}</p>
        <FormFeedback lang={lang} state={state} />
        <VialStepper
          id="asv"
          label={c.drug.ASV}
          short={c.drugShort.ASV}
          text={asv}
          onText={setAsv}
          lang={lang}
          invalid={state.invalid.includes("asv")}
        />
        <VialStepper
          id="arv"
          label={c.drug.ARV}
          short={c.drugShort.ARV}
          text={arv}
          onText={setArv}
          lang={lang}
          invalid={state.invalid.includes("arv")}
        />
      </fieldset>
      <PendingNote label={t.ledgerPending} reserve />
      <PendingButton idle={t.postButton} pending={t.ledgerPending} className="w-full" />
    </form>
  );
}

function VialStepper({
  id,
  label,
  short,
  text,
  onText,
  lang,
  invalid,
}: {
  id: string;
  label: string;
  short: string;
  text: string;
  onText: (next: string) => void;
  lang: Lang;
  invalid: boolean;
}) {
  const { pending } = useFormStatus();
  const t = staff[lang];
  const n = parseVial(text);
  const described = invalid ? `${id}-hint ${id}-preview form-error` : `${id}-hint ${id}-preview`;

  function apply(next: string) {
    if (pending) return;
    onText(next);
  }

  return (
    <div>
      <label htmlFor={id} className="block font-semibold">
        {label}
      </label>
      <p id={`${id}-hint`} className="text-sm text-ink-3">
        {t.vialHint}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={stepBtn}
          aria-label={t.decrease(short)}
          disabled={pending || n === 0}
          onClick={() => apply(String(stepVial(n ?? 0, -1)))}
        >
          −
        </button>
        <input
          id={id}
          name={id}
          value={text}
          onChange={(e) => {
            const next = e.target.value;
            if (next.length <= 8) apply(next);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              apply(String(stepVial(n ?? 0, 1)));
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              apply(String(stepVial(n ?? 0, -1)));
            }
          }}
          inputMode="numeric"
          autoComplete="off"
          readOnly={pending}
          aria-invalid={invalid || (text !== "" && n === null) || undefined}
          aria-describedby={described}
          className={cx(
            "h-12 w-24 scroll-mt-24 border bg-surface text-center font-mono text-xl tabular-nums",
            invalid ? "border-out" : "border-line-2",
          )}
        />
        <button
          type="button"
          className={stepBtn}
          aria-label={t.increase(short)}
          disabled={pending || n === MAX_VIALS}
          onClick={() => apply(String(stepVial(n ?? 0, 1)))}
        >
          +
        </button>
        <span id={`${id}-preview`} aria-live="polite" className="inline-flex min-h-12 items-center gap-2">
          {n !== null && (
            <>
              <span className="text-sm text-ink-3">{t.preview}</span>
              <StatusChip status={statusForVials(n)} t={common[lang]} />
            </>
          )}
        </span>
      </div>
    </div>
  );
}
