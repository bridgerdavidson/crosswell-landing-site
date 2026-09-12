import { company } from "@/lib/saguaro";

export function TopBar({
  name = company.name,
  initials = company.user.initials,
}: {
  name?: string;
  initials?: string;
}) {
  return (
    <header className="product-topbar flex h-12 flex-none items-center justify-between px-5">
      <span className="font-medium">{name}</span>
      <span className="product-avatar">{initials}</span>
    </header>
  );
}
