import type { CSSProperties, ReactNode, Ref } from "react";

type FrameProps = {
  children: ReactNode;
  /** which edges are cut and dissolve into the page */
  fade?: "corner" | "right" | "bottom";
  dark?: boolean;
  /** Tailwind height class for the frame box: 800 at lg, the product's own height below */
  height?: string;
  /** fill the frame's width instead of overflowing it; for the narrow split layout */
  fit?: boolean;
  /** below lg, lay the product out as one column that fits the frame */
  fitNarrow?: boolean;
  /** below 768px, lay the product out as one column that fits the frame */
  fitPhone?: boolean;
  /** scoped variable overrides, e.g. chapter 06's accent */
  style?: CSSProperties;
  className?: string;
  /** the frame box, for a chapter's scroll-in sequence */
  ref?: Ref<HTMLDivElement>;
};

/**
 * The cropping frame: a fixed-height box (800 at lg and above) that cuts a
 * full-size product shell and dissolves the cut edges into the page. The
 * shell has no fill of its own, so the frame has no edges but the ones the
 * product's chrome and its cuts make; a shell wider than the frame reads as
 * a corner of something larger, never as a screenshot scaled to fit.
 */
export function Frame({
  children,
  fade = "corner",
  dark = false,
  height = "h-[480px]",
  fit = false,
  fitNarrow = false,
  fitPhone = false,
  style,
  className = "",
  ref,
}: FrameProps) {
  return (
    <div
      ref={ref}
      className={`product-frame product-frame-${fade} ${fit ? "product-frame-fit" : ""} ${
        fitNarrow ? "product-frame-fitnarrow" : ""
      } ${fitPhone ? "product-frame-fitphone" : ""} ${height} ${className}`}
    >
      <div
        className={`product-shell ${dark ? "product-shell-dark" : ""} ${fit ? "product-shell-fit" : ""}`}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}
