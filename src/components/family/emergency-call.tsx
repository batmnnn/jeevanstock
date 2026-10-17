import { btn, cx } from "@/components/ui";

/** The only telephone link in the family flow. */
export function EmergencyCall({ label }: { label: string }) {
  return (
    <a href="tel:108" className={cx(btn.danger, "w-full")}>
      {label}
    </a>
  );
}
