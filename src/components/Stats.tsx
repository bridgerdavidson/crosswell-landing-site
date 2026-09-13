import { CONTAINER, GRID, SECTION } from "./Band";
import Reveal from "./Reveal";

/* Both figures come from Max's fact-check ledger. The second citation is
   pending his reconciliation (his handoff note names Gallup; the source
   file names Microsoft and LinkedIn). A number without its printed source
   does not ship: if the ledger disagrees, pull the chip, never guess. */
const stats = [
  {
    figure: "75%",
    body: "of companies plan to deploy agentic AI within two years. Only 21% have mature governance for it.",
    source: "Deloitte, State of AI in the Enterprise, January 2026",
  },
  {
    figure: "78%",
    body: "of AI users bring their own tools to work, higher at small and mid-sized companies.",
    source: "Microsoft and LinkedIn, Work Trend Index, 2024",
  },
];

/* The quiet parchment band that sets up Why Crosswell (spec 6.5): it opens
   the band Why Crosswell sits in, on the page's beat, with the two figures
   on the grid's two column lines (the band's title column and its lede
   column). */
export default function Stats() {
  return (
    <section id="stats" className="border-t border-ink/8 bg-parchment">
      <div className={`${CONTAINER} ${SECTION}`}>
        <div className={`${GRID} gap-y-10 sm:max-lg:grid-cols-2 sm:max-lg:gap-x-6`}>
          {stats.map((stat, i) => (
            <Reveal key={stat.figure} delay={i * 80}>
              <div>
                <p className="type-h2 text-fern-deep">{stat.figure}</p>
                <p className="type-text mt-2 max-w-[40ch] text-ink/70">{stat.body}</p>
                <p className="type-caption mt-3 text-ink/60">{stat.source}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
