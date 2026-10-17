import { logout } from "@/app/actions/staff";
import { btn } from "@/components/ui";

export function LogoutButton({ label }: { label: string }) {
  return (
    <form action={logout}>
      <button type="submit" className={btn.secondary}>
        {label}
      </button>
    </form>
  );
}
