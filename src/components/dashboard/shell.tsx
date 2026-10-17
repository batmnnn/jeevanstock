import type { ReactNode } from "react";
import { cx } from "@/components/ui";

const WIDTH = {
  wide: "max-w-6xl",
  board: "max-w-5xl",
  proof: "max-w-2xl",
} as const;

export function Main({ width, children, className }: { width: keyof typeof WIDTH; children: ReactNode; className?: string }) {
  return <main id="main" className={cx("mx-auto w-full px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-10", WIDTH[width], className)}>{children}</main>;
}
