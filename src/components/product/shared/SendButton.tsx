import type { Ref } from "react";
import { inert } from "./inert";

/**
 * The send control. Presentation only until a chapter's mechanic makes it
 * live (chapter 03 lifts the inert props while a message is composed).
 */
export function SendButton({
  label = "Send",
  ref,
  ...rest
}: {
  label?: string;
  ref?: Ref<HTMLButtonElement>;
  [key: `data-${string}`]: string | undefined;
}) {
  return (
    <button ref={ref} type="button" aria-label={label} {...inert} {...rest} className="product-send">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
