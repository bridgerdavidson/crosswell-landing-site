import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import Band from "@/components/Band";

type ChapterProps = {
  claim: ReactNode;
  body: string;
  dark?: boolean;
  /** a small site control that belongs beside the demo caption, e.g. Replay */
  controls?: ReactNode;
  children: ReactNode;
};

/**
 * One chapter of the product run, the one skeleton all six share. The band
 * is the page's one title band (`Band`, which every titled company section
 * shares): one row in two columns that span the run, the claim on the left
 * with no label over it (a number and a name there only cluttered the
 * band) (the claim at most 672 wide, so most claims hold to one or two
 * lines), the lede in a 528 column at the words' right edge with its cap
 * height on the claim's, and nothing stacked under the claim. The frame
 * hangs 96 under the band (64 below lg), close enough that the words and
 * the product share a screen, and from xl it runs 32 past the band on both
 * sides, out to the page column's own edge (`page-wide`), the one thing on
 * the page that does; its reveal follows the band's by the site's one 80ms
 * step. Everything that
 * describes the product lives here, outside the frame; the frame only ever
 * shows the product. The demo caption and any site control (Replay, chapter
 * 06's swatches) sit under the frame in the caption row, outside it, per
 * the demo rules.
 */
export function Chapter({
  claim,
  body,
  dark = false,
  controls,
  children,
}: ChapterProps) {
  const quiet = dark ? "text-ivory/60" : "text-ink/60";
  const caption = (
    <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
      <p className={`type-caption ${quiet}`}>Interactive demo · Sample data</p>
      {controls}
    </div>
  );

  return (
    <div>
      <Band
        titleAs="h3"
        dark={dark}
        title={claim}
        lede={body}
      />
      <Reveal delay={80} className="page-wide mt-16 min-w-0 lg:mt-24">
        {children}
        {caption}
      </Reveal>
    </div>
  );
}
