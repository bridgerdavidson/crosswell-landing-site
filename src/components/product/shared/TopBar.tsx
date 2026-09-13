import { company } from "@/lib/saguaro";

/**
 * The product's top bar: the company name at the left, the user's initials
 * at the right. In a wide frame it runs past the right cut with the shell
 * and dissolves; in a fitted frame its rule stops 24 inside the edge. A
 * div, not a header: it is the product's chrome, not a page landmark, and
 * the loop's render tools hide the page's header.
 */
export function TopBar({
  name = company.name,
  initials = company.user.initials,
  lit = false,
  inset = false,
  cut = false,
}: {
  name?: string;
  initials?: string;
  /** the chapter's lit element is the bar itself (chapter 06): an inset card */
  lit?: boolean;
  /** a fitted frame: the rule stops 24 short of the frame's right edge */
  inset?: boolean;
  /** a lit bar in a cut-right frame ends before the fade */
  cut?: boolean;
}) {
  return (
    <div
      className={`product-topbar flex h-12 flex-none items-center justify-between px-5 ${
        lit ? "product-lit" : ""
      } ${inset && !lit ? "product-topbar-inset" : ""} ${cut && lit ? "product-topbar-cut" : ""}`}
    >
      <span className="product-strong">{name}</span>
      <span className="product-avatar">{initials}</span>
    </div>
  );
}
