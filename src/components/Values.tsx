import Band, { CONTAINER, HANG, SEAM, SECTION } from "./Band";
import Reveal from "./Reveal";
import { tie } from "./tie";

/* The locked foundation, in business language. The vision line is the
   section's title itself; there is no "Mission" or "Vision" heading. Each
   value names what it costs; that line is the whole reason it reads as
   true rather than as marketing. */
const values = [
  {
    name: "Trust",
    line: "It is what we actually sell, and it is earned in the moments that cost us.",
    cost: "The best answer for a client is sometimes a tool they can buy for a fraction of our fee, and sometimes it is nothing at all. We say so, and we lose the work.",
  },
  {
    name: "Stewardship",
    line: "What we hold is never ours.",
    cost: "What your business knows leaves with you in open files on the day you go. That forfeits the switching costs most software firms are built on. We forfeit them deliberately.",
  },
  {
    name: "Continuity",
    line: "The people who build it are the people who answer.",
    cost: "No account managers, no handoffs. This limits how quickly we can grow, and we accept the limit.",
  },
];

/* The team page opens on this section, so it can sit under the nav with no
   seam above it (first): the nav's 80 plus 32, or 80 from sm, before the
   label. Anywhere else it keeps the page's seam and section padding. */
export default function Values({ first = false }: { first?: boolean }) {
  return (
    <section id="values" className={first ? `${CONTAINER} pt-28 pb-24 sm:pt-40 sm:pb-32` : `${SEAM} ${CONTAINER} ${SECTION}`}>
      <Band
        label="Values"
        title={
          /* the vision line breaks only between its phrases: "To become",
             "the most sought after", "name in agentic AI", "by setting the
             standard", "for what a partner", "should be." each hold together,
             so "sought after" never splits and the balanced wrap sets whole
             phrases per line (four lines at 1440 and up) */
          <>
            <span className="whitespace-nowrap">To become</span>{" "}
            <span className="whitespace-nowrap">the most sought after</span>{" "}
            <span className="whitespace-nowrap">name in agentic AI</span>{" "}
            <span className="whitespace-nowrap">by setting the standard</span>{" "}
            <span className="whitespace-nowrap">for what a partner</span>{" "}
            <span className="whitespace-nowrap">should be.</span>
          </>
        }
        lede="That is what we are building toward. What we do every day is simpler: we help businesses become AI native."
      />

      {/* three columns on five shared rows (rule, name, line, "What it
          costs", cost), so the labels sit on one line across the row
          whatever the lines above them wrap to; the rows' spacing lives on
          the elements, not in the grid's gap. The columns share the card
          rows' lines (three across the container, 24 apart) */}
      <div className={`${HANG} grid gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-0`}>
        {values.map((value, i) => (
          <Reveal
            key={value.name}
            delay={i * 80}
            className="md:grid md:grid-rows-subgrid md:row-span-5"
          >
            <div className="h-px w-10 bg-fern" />
            <h3 className="type-h3 mt-4 text-ink">{value.name}</h3>
            <p className="type-text mt-2.5 max-w-md type-text-balanced text-ink/70">{tie(value.line)}</p>
            <p className="type-caption mt-4 font-medium text-fern-deep">What it costs</p>
            <p className="type-text mt-1 max-w-md type-text-balanced text-ink/70">{tie(value.cost)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
