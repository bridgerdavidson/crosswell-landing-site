import { inert } from "./inert";

/** The send control; presentation only until the chat mechanic lands. */
export function SendButton({ label = "Send" }: { label?: string }) {
  return (
    <button type="button" aria-label={label} {...inert} className="product-send">
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
