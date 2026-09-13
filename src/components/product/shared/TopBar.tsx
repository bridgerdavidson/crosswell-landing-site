import { company } from "@/lib/saguaro";

/**
 * The product's top bar: the company name at the left, the user's initials
 * at the right. A div, not a header: it is the product's chrome, not a page
 * landmark, and the loop's render tools hide the page's header.
 */
export function TopBar({
  name = company.name,
  initials = company.user.initials,
  lit = false,
}: {
  name?: string;
  initials?: string;
  /** the chapter's lit element is the bar itself (chapter 06) */
  lit?: boolean;
}) {
  return (
    <div
      className={`product-topbar flex h-12 flex-none items-center justify-between px-5 ${
        lit ? "product-lit" : ""
      }`}
    >
      <span className="product-strong">{name}</span>
      <span className="product-avatar">{initials}</span>
    </div>
  );
}
