import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { StockStatus } from "@/lib/domain";
import type { Common } from "@/lib/i18n";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export { cx };

const BTN_BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-base font-medium shadow-[var(--shadow-card)] disabled:cursor-not-allowed disabled:opacity-50";
export const btn = {
  primary: cx(BTN_BASE, "bg-brand text-brand-ink hover:bg-brand-deep"),
  secondary: cx(BTN_BASE, "glass text-ink shadow-none hover:bg-white/80"),
  danger: cx(BTN_BASE, "bg-out text-white hover:opacity-95"),
  ghost: cx(BTN_BASE, "text-brand shadow-none underline-offset-4 hover:underline px-2"),
};

export function ButtonLink({ variant = "primary", className, ...p }: ComponentProps<typeof Link> & { variant?: keyof typeof btn }) {
  return <Link {...p} className={cx(btn[variant], className)} />;
}

export function Card({ className, children, as: As = "div" }: { className?: string; children: ReactNode; as?: "div" | "section" | "article" | "li" }) {
  return <As className={cx("glass rounded-2xl p-4", className)}>{children}</As>;
}

const CHIP: Record<StockStatus, string> = {
  in: "bg-in-soft text-in",
  low: "bg-low-soft text-low",
  out: "bg-out-soft text-out",
  stale: "bg-stale-soft text-stale",
  sent: "bg-sent-soft text-sent",
};
const DOT: Record<StockStatus, string> = { in: "bg-in", low: "bg-low", out: "bg-out", stale: "bg-stale", sent: "bg-sent" };

/** Tinted badge plus the word. Colour is never the only signal. */
export function StatusChip({ status, t, className }: { status: StockStatus; t: Pick<Common, "status">; className?: string }) {
  return (
    <span data-status={status} className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium", CHIP[status], className)}>
      <span aria-hidden className={cx("size-2 shrink-0 rounded-full", DOT[status])} />
      {t.status[status]}
    </span>
  );
}

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main id="main" tabIndex={-1} className={cx("mx-auto w-full max-w-xl px-4 pb-16 pt-5", className)}>
      {children}
    </main>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-4 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-ink-2 hover:text-ink">
      <span aria-hidden>←</span> {label}
    </Link>
  );
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <code className={cx("break-all font-mono text-[0.85em]", className)}>{children}</code>;
}
