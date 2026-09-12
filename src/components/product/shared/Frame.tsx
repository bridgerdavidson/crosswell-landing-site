import type { CSSProperties, ReactNode } from "react";

type FrameProps = {
  children: ReactNode;
  /** which edges are cut and dissolve into the page */
  fade?: "corner" | "right" | "bottom";
  dark?: boolean;
  /** Tailwind height class for the frame box */
  height?: string;
  /** fill the frame's width instead of overflowing it; for the narrow split layout */
  fit?: boolean;
  /** scoped variable overrides, e.g. chapter 06's accent */
  style?: CSSProperties;
  className?: string;
};

/**
 * The cropping frame: a fixed-height box that cuts a full-size product shell
 * and dissolves the cut edges into the page. The shell is always wider than
 * the frame, so the product reads as a corner of something larger, never as
 * a screenshot scaled to fit.
 */
export function Frame({
  children,
  fade = "corner",
  dark = false,
  height = "h-[480px]",
  fit = false,
  style,
  className = "",
}: FrameProps) {
  return (
    <div className={`product-frame product-frame-${fade} ${height} ${className}`}>
      <div
        className={`product-shell ${dark ? "product-shell-dark" : ""} ${fit ? "product-shell-fit" : ""}`}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}
