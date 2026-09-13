import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type ChapterProps = {
  index: string;
  label: string;
  claim: ReactNode;
  body: string;
  layout?: "wide" | "split";
  dark?: boolean;
  /** a small site control that belongs beside the demo caption, e.g. Replay */
  controls?: ReactNode;
  children: ReactNode;
};

/**
 * One chapter of the product run. The band is one row in two columns: the
 * label and the claim on the left, the lede on the right with its cap
 * height on the claim's (the lede's top margin is 9 where the claim's is
 * 12, which lands the two cap tops within half a pixel), and nothing
 * stacked under the claim. The frame hangs
 * from the band by the chapter's biggest gap (96 at lg, 64 below) and is
 * the band's full width, so band and frame share both edges. Everything
 * that describes the product lives here, outside the frame; the frame only
 * ever shows the product. The demo caption and any control sit under the
 * frame, outside it, per the demo rules.
 *
 * The split layout keeps the same two columns: the claim column on the
 * left (label, claim, then the lede beneath it at the same measure) and
 * the frame in the lede's column on the right.
 */
export function Chapter({
  index,
  label,
  claim,
  body,
  layout = "wide",
  dark = false,
  controls,
  children,
}: ChapterProps) {
  const ink = dark ? "text-ivory" : "text-ink";
  const muted = dark ? "text-ivory/80" : "text-ink/80";
  const quiet = dark ? "text-ivory/60" : "text-ink/60";
  const labelEl = (
    <p className={`type-label ${dark ? "text-fern-soft" : "text-fern-deep"}`}>
      <span className={`type-label-index ${quiet}`}>{index}</span>
      {label}
    </p>
  );
  const caption = (
    <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
      <p className={`type-caption ${quiet}`}>Interactive demo · Sample data</p>
      {controls}
    </div>
  );

  if (layout === "split") {
    return (
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-x-20">
        <Reveal className="min-w-0">
          {labelEl}
          <h3 className={`type-h2 mt-3 max-w-2xl ${ink}`}>{claim}</h3>
          <p className={`type-body mt-5 max-w-xl ${muted}`}>{body}</p>
        </Reveal>
        <Reveal delay={120} className="min-w-0">
          {children}
          {caption}
        </Reveal>
      </div>
    );
  }

  return (
    <div>
      <Reveal className="grid min-w-0 lg:grid-cols-2 lg:gap-x-20">
        <div className="lg:col-start-1 lg:row-start-1">{labelEl}</div>
        <h3 className={`type-h2 mt-3 max-w-2xl lg:col-start-1 lg:row-start-2 ${ink}`}>{claim}</h3>
        <p
          className={`type-body mt-5 max-w-xl lg:col-start-2 lg:row-start-2 lg:mt-[9px] lg:self-start ${muted}`}
        >
          {body}
        </p>
      </Reveal>
      <Reveal delay={120} className="mt-16 min-w-0 lg:mt-24">
        {children}
        {caption}
      </Reveal>
    </div>
  );
}
