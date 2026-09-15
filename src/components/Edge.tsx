import Band, { CONTAINER, HANG, SECTION } from "./Band";
import Reveal from "./Reveal";
import { tie } from "./tie";

const points = [
  {
    title: "Built around your work",
    body: "We start by learning how your team actually operates, then build the Core and the tools around that. No forcing your business through someone else’s template, and no features nobody asked for.",
  },
  {
    title: "We sell trust",
    body: "Time saved is the easy part; any AI tool can promise it. What gets scarcer as agentic AI spreads is trust, and we built the company around protecting it. We put that in writing.",
  },
  {
    title: "You work directly with us",
    body: "No account managers, no ticket queues. The people who designed your Core are the people who answer when something needs attention.",
  },
];

/* The parchment band opens with the stats above; this section carries the
   seam hairline between them (they share the ground) and the band's
   bottom edge. The three points are content cards (spec 4.7), the
   same object as how-we-start's and the team's. */
export default function Edge() {
  return (
    <section id="why-crosswell" className="border-y border-ink/8 bg-parchment">
      <div className={`${CONTAINER} ${SECTION}`}>
        {/* the page's title band: the title and its lede, the line that
            follows it, in the lede's style like every other band. The
            second sentence of the title holds together, so the balanced
            wrap breaks between the phrases instead of leaving "So" at a
            line's end */}
        <Band
          label="Why Crosswell"
          title={
            <>
              {tie("Off the shelf fits nobody.")}{" "}
              <span className="whitespace-nowrap">So we do not sell it.</span>
            </>
          }
          lede="When someone leaves, their knowledge does not. Every meeting, decision, and deal, remembered."
        />

        {/* three across from 1064, where every card title holds its line and
            every body stays within six (with its sentence edges held, the
            first body runs seven up to 1057); below that the cards stack */}
        <div className={`${HANG} grid gap-6 min-[66.5rem]:grid-cols-3`}>
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-warmgray/40 bg-ivory p-7 shadow-whisper transition-shadow hover:shadow-lifted sm:p-8">
                <h3 className="type-h3 text-ink">{point.title}</h3>
                <p className="type-text mt-2.5 max-w-md type-text-balanced text-ink/70">
                  {tie(point.body)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
