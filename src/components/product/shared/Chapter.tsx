import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type ChapterProps = {
  index: string;
  label: string;
  claim: ReactNode;
  body: string;
  dark?: boolean;
  /** a small site control that belongs beside the demo caption, e.g. Replay */
  controls?: ReactNode;
  children: ReactNode;
};

/**
 * One chapter of the product run, the one skeleton all six share. The band
 * is one row in two columns that span the run: the label and the claim on
 * the left (the claim at most 672 wide, so most claims hold to one or two
 * lines), the lede in a 576 column at the run's right edge with its cap
 * height on the claim's (the lede's top margin is 9 where the claim's is
 * 12), and nothing stacked under the claim. The frame hangs from the band
 * by the chapter's biggest gap (192 at lg, 128 below) and is the band's
 * full width, so band and frame share both edges; its reveal follows the
 * band's by the site's one 80ms step. Everything that describes the
 * product lives here, outside the frame; the frame only ever shows the
 * product. The demo caption and any site control (Replay, chapter 06's
 * swatches) sit under the frame in the caption row, outside it, per the
 * demo rules.
 */
export function Chapter({
  index,
  label,
  claim,
  body,
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

  return (
    <div>
      <Reveal className="grid min-w-0 lg:grid-cols-2 lg:gap-x-20 xl:grid-cols-[minmax(0,1fr)_36rem]">
        <div className="lg:col-start-1 lg:row-start-1">{labelEl}</div>
        <h3 className={`type-h2 mt-3 max-w-2xl lg:col-start-1 lg:row-start-2 lg:self-start ${ink}`}>{claim}</h3>
        <p
          className={`type-body mt-5 max-w-xl lg:col-start-2 lg:row-start-2 lg:mt-[9px] lg:self-start ${muted}`}
        >
          {body}
        </p>
      </Reveal>
      <Reveal delay={80} className="mt-32 min-w-0 lg:mt-48">
        {children}
        {caption}
      </Reveal>
    </div>
  );
}
