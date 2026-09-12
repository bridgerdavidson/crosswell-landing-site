import type { ReactNode } from "react";

export function Chip({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return <span className={`product-chip ${accent ? "product-chip-accent" : ""}`}>{children}</span>;
}

/** A source the product attaches to an answer or an item. */
export function Receipt({ children }: { children: ReactNode }) {
  return (
    <span className="product-chip product-chip-accent">
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <path d="M1 1h5l3 3v7H1z M6 1v3h3" />
      </svg>
      {children}
    </span>
  );
}

export function Dot({
  tone = "accent",
  className = "",
}: {
  tone?: "accent" | "watch" | "ink";
  className?: string;
}) {
  return <span aria-hidden className={`product-dot product-dot-${tone} ${className}`} />;
}

/** A done mark in the accent color. */
export function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="flex-none"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
