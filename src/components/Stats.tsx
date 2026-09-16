import { GRID } from "./Band";
import Reveal from "./Reveal";
import { tie } from "./tie";

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

/* The two figures under the what-we-do statement, on the band's two column
   lines (the title column and the lede column), with no heading of their
   own: read together they say AI is coming into the business either way,
   and mostly without its context, which is what the statement above them
   answers. They hang 64 under the statement (96 from lg). */
export default function Stats() {
  return (
    <div id="stats" className={`${GRID} mt-16 gap-y-10 sm:max-lg:grid-cols-2 sm:max-lg:gap-x-6 lg:mt-24`}>
      {stats.map((stat, i) => (
        <Reveal key={stat.figure} delay={i * 80}>
          <div>
            <p className="type-h2 text-fern-deep">{stat.figure}</p>
            <p className="type-text mt-2 max-w-[40ch] text-ink/70">{tie(stat.body)}</p>
            <p className="type-caption mt-3 text-ink/60">{stat.source}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
