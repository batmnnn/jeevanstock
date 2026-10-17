"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/components/ui";

export function NavLinks({ items, className }: { items: readonly { href: string; label: string }[]; className?: string }) {
  const pathname = usePathname();
  return (
    <ul className={cx("flex items-center gap-x-1 text-sm", className)}>
      {items.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={cx(
                "inline-flex min-h-12 items-center px-2 font-medium underline-offset-[6px] hover:text-ink hover:underline",
                current ? "text-ink underline decoration-2 decoration-brand" : "text-ink-2",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
