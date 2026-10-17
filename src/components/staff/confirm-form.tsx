"use client";

import { useActionState } from "react";
import { confirmReportAction } from "@/app/actions/staff";
import type { Lang } from "@/lib/i18n";
import { IDLE_STAFF_FORM } from "@/lib/staff/form-state";
import { staff } from "@/messages/staff";
import { FormFeedback } from "./feedback";
import { PendingButton, PendingNote } from "./pending";
import { ProofLink } from "./proof-link";

export function ConfirmForm({
  lang,
  reportKey,
  ariaLabel,
  proofLabel,
}: {
  lang: Lang;
  reportKey: string;
  ariaLabel: string;
  proofLabel: string;
}) {
  const t = staff[lang];
  const [state, action] = useActionState(confirmReportAction, IDLE_STAFF_FORM);
  const errorId = `confirm-${reportKey.slice(2, 14)}`;

  return (
    <form action={action} className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="reportKey" value={reportKey} />
        <PendingButton idle={t.confirm} pending={t.ledgerPending} ariaLabel={ariaLabel} />
        <ProofLink entityKey={reportKey} label={proofLabel} />
      </div>
      <PendingNote label={t.ledgerPending} />
      <FormFeedback lang={lang} state={state} errorId={errorId} />
    </form>
  );
}
