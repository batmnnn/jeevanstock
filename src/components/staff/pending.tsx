"use client";

import { useFormStatus } from "react-dom";
import { btn, cx } from "@/components/ui";

export function PendingButton({
  idle,
  pending,
  variant = "primary",
  className,
  ariaLabel,
}: {
  idle: string;
  pending: string;
  variant?: keyof typeof btn;
  className?: string;
  /** Extra name for screen readers when several buttons share the same visible label. */
  ariaLabel?: string;
}) {
  const { pending: busy } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={busy}
      aria-disabled={busy}
      aria-busy={busy}
      aria-label={busy ? undefined : ariaLabel}
      className={cx(btn[variant], className)}
    >
      {busy ? pending : idle}
    </button>
  );
}

export function PendingNote({ label, reserve = false }: { label: string; reserve?: boolean }) {
  const { pending } = useFormStatus();
  const visible = pending || reserve;
  return (
    <p role="status" aria-live="polite" className={visible ? "min-h-6 text-sm font-medium text-ink-2" : "sr-only"}>
      {pending ? label : reserve ? "\u00a0" : ""}
    </p>
  );
}
