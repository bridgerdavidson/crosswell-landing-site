import type { ElementType, ReactNode } from "react";
import Reveal from "./Reveal";

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
  dark?: boolean;
};

/**
 * The page's one title band, shared by the product run's six chapters and
 * every titled company section so the two halves cannot drift apart. One row
 * in two columns: the label and the title on the left (the title at most 672
 * wide), the lede on the right, in two equal columns 80 apart at lg and a 576
 * column at the container's right edge at xl, with the lede's cap height on
 * the title's (the lede's top margin is 9 where the title's is 12). Nothing
 * stacks under the title; below lg the three stack. Whatever the band
 * introduces (a chapter's frame, a section's cards) hangs from it at the
 * container's full width.
 */
export default function Band({
  label,
  title,
  titleAs: Title = "h2",
  lede,
  more,
  dark = false,
}: BandProps) {
  const ink = dark ? "text-ivory" : "text-ink";
  const muted = dark ? "text-ivory/80" : "text-ink/80";
  const column = "lg:col-start-2 lg:row-start-2 lg:mt-[9px] lg:self-start";

  return (
    <Reveal className="grid min-w-0 lg:grid-cols-2 lg:gap-x-20 xl:grid-cols-[minmax(0,1fr)_36rem]">
      <div className="lg:col-start-1 lg:row-start-1">
        <p className={`type-label ${dark ? "text-fern-soft" : "text-fern-deep"}`}>{label}</p>
      </div>
      <Title className={`type-h2 mt-3 max-w-2xl lg:col-start-1 lg:row-start-2 lg:self-start ${ink}`}>
        {title}
      </Title>
      {lede &&
        (more ? (
          <div className={`mt-5 max-w-xl ${column}`}>
            <p className={`type-body ${muted}`}>{lede}</p>
            {more}
          </div>
        ) : (
          <p className={`type-body mt-5 max-w-xl ${column} ${muted}`}>{lede}</p>
        ))}
    </Reveal>
  );
}
