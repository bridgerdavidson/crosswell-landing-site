import Band from "./Band";
import Reveal from "./Reveal";

const points = [
  {
    title: "Built around your work",
    body: "We start by learning how your team actually operates, then build the Core and the tools around that. No forcing your business through someone else's template, and no features nobody asked for.",
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
   band's bottom edge. The three points are content cards (spec 4.7), the
   same object as how-we-start's and the team's. */
export default function Edge() {
  return (
    <section id="why-crosswell" className="border-b border-ink/8 bg-parchment">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        {/* the page's title band; no lede, so its right column stays empty
            and the pull quote hangs below at the section's width. The second
            sentence holds together, so the balanced wrap breaks between the
            phrases instead of leaving "So" at a line's end */}
        <Band
          label="Why Crosswell"
          title={
            <>
              Off the shelf fits nobody.{" "}
              <span className="whitespace-nowrap">So we do not sell it.</span>
            </>
          }
        />

        <Reveal delay={80}>
          <blockquote className="mt-12 max-w-3xl border-l-2 border-fern pl-6 sm:mt-16 sm:pl-8">
            <p className="type-accent italic text-ink/85">
              When someone leaves, their knowledge does not. Every meeting,
              decision, and deal, remembered.
            </p>
          </blockquote>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-3">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-warmgray/40 bg-ivory p-7 shadow-whisper transition-shadow hover:shadow-lifted sm:p-8">
                <h3 className="type-h3 text-ink">{point.title}</h3>
                <p className="type-text mt-2.5 text-ink/70">
                  {point.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
