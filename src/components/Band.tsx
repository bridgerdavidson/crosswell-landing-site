import type { ElementType, ReactNode } from "react";
import Reveal from "./Reveal";
import { tie } from "./tie";

/* strings are held at their sentence edges; anything already marked up
   passes through as it is */
const held = (node: ReactNode) => (typeof node === "string" ? tie(node) : node);

/**
 * The page's one grid, hero to footer. Every section sits in the run's
 * container (48 gutters at lg, so 1344 wide at 1440 and 1632 at 1728; 24
 * below lg) and every two-column arrangement lands on the same two column
 * lines: two equal columns 80 apart at lg, and at xl a 576 right column at
 * the container's right edge with the left column taking the rest (x 48 to
 * 736 and 816 to 1392 at 1440; 48 to 1024 and 1104 to 1680 at 1728).
 */
export const CONTAINER = "px-6 lg:px-12";
/**
 * The beat. Neighbouring sections' content sits 288 apart and a band hangs
 * what it introduces by 192, the run's own two numbers (192 and 128 below
 * sm and lg, as the run's are), so inside any section the hang is the
 * largest space and a band always groups with its own content. A company
 * section pads 160 above its content and 128 below it (96 and 96 on
 * phones), so any two neighbours add up to the beat, the run's last
 * section's 128 included.
 */
export const SECTION = "pt-24 pb-24 sm:pt-40 sm:pb-32";
/**
 * The seam. Every company section is bounded on both sides by a change of
 * ground or one ink 8 hairline; where two neighbours share a ground, the
 * later section's top edge carries the hairline, at the section boundary
 * inside the beat's space (128 under the previous content, 160 over the
 * next), exactly where a band's own edge hairline sits, and never beside
 * one.
 */
export const SEAM = "border-t border-ink/8";
export const HANG = "mt-32 lg:mt-48";
export const GRID =
  "grid min-w-0 lg:grid-cols-2 lg:gap-x-20 xl:grid-cols-[minmax(0,1fr)_36rem]";

type BandProps = {
  /** the label's content: the section's name, or a chapter's index and name */
  label: ReactNode;
  title: ReactNode;
  /** h2 for a page section, h3 for a chapter's claim inside the run */
  titleAs?: ElementType;
  /** the sentence that follows the title; a section with none leaves the right column empty */
  lede?: ReactNode;
  /** running text under the lede, in the lede's column */
  more?: ReactNode;
  /** something other than a lede in the lede's place (why Crosswell's pull quote) */
  aside?: ReactNode;
  dark?: boolean;
};

/**
 * The page's one title band, shared by the product run's six chapters and
 * every titled company section so the two halves cannot drift apart. One row
 * on the grid: the label and the title in the left column (the title at most
 * 672 wide), the lede in the right column with its cap height on the title's
 * (the lede's top margin is 9 where the title's is 12). Nothing stacks under
 * the title; below lg the three stack. Whatever the band introduces (a
 * chapter's frame, a section's cards) hangs from it at the container's full
 * width, by the largest space in the section.
 */
export default function Band({
  label,
  title,
  titleAs: Title = "h2",
  lede,
  more,
  aside,
  dark = false,
}: BandProps) {
  const ink = dark ? "text-ivory" : "text-ink";
  const muted = dark ? "text-ivory/80" : "text-ink/80";
  const column = "lg:col-start-2 lg:row-start-2 lg:mt-[9px] lg:self-start";

  return (
    <Reveal className={GRID}>
      <div className="lg:col-start-1 lg:row-start-1">
        <p className={`type-label ${dark ? "text-fern-soft" : "text-fern-deep"}`}>{label}</p>
      </div>
      <Title className={`type-h2 mt-3 max-w-2xl lg:col-start-1 lg:row-start-2 lg:self-start ${ink}`}>
        {held(title)}
      </Title>
      {aside ? (
        <div className={`mt-5 max-w-xl ${column}`}>{aside}</div>
      ) : (
        lede &&
        (more ? (
          <div className={`mt-5 max-w-xl ${column}`}>
            <p className={`type-body ${muted}`}>{held(lede)}</p>
            {more}
          </div>
        ) : (
          <p className={`type-body mt-5 max-w-xl ${column} ${muted}`}>{held(lede)}</p>
        ))
      )}
    </Reveal>
  );
}

type SplitProps = {
  label: ReactNode;
  title: ReactNode;
  /** the lede and whatever follows it in the text column */
  children: ReactNode;
  /** what the text introduces, in the right column (it carries its own reveals) */
  aside: ReactNode;
  /** the right column's top offset at lg, which lands its first edge or cap height on the title's */
  asideClassName?: string;
};

/**
 * The band's split form, for a section whose words sit beside what they
 * introduce (the brain section, what a business loses, beyond the Core): the
 * same grid and the same column lines, the label, the title, and the lede
 * stacked in the left column (the title at most 672, the lede at most 576),
 * and the section's content in the right column from the title's row. Below
 * lg the content hangs from the words by the section's hang (128).
 */
export function Split({ label, title, children, aside, asideClassName = "" }: SplitProps) {
  return (
    <div className={GRID}>
      <Reveal className="min-w-0 lg:col-start-1 lg:row-start-1">
        <p className="type-label text-fern-deep">{label}</p>
        <h2 className="type-h2 mt-3 max-w-2xl text-ink">{held(title)}</h2>
        {children}
      </Reveal>
      <div className={`mt-32 min-w-0 lg:col-start-2 lg:row-start-1 lg:mt-0 ${asideClassName}`}>
        {aside}
      </div>
    </div>
  );
}
