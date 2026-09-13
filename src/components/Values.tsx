import Reveal from "./Reveal";

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

export default function Values() {
  return (
    <section id="values" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <Reveal>
        <p className="type-label mb-3 text-fern-deep">Values</p>
        <h2 className="type-h2 max-w-3xl text-ink">
          To become the most sought after name in agentic AI by setting the
          standard for what a partner should be.
        </h2>
        <p className="type-body mt-5 max-w-2xl text-ink/80">
          That is what we are building toward. What we do every day is simpler:
          we help businesses become AI native.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-10 sm:grid-cols-3">
        {values.map((value, i) => (
          <Reveal key={value.name} delay={i * 120}>
            <div>
              <div className="mb-4 h-px w-10 bg-fern" />
              <h3 className="type-h3 text-ink">{value.name}</h3>
              <p className="type-text mt-2.5 text-ink/80">{value.line}</p>
              <p className="type-caption mt-4 font-medium text-fern-deep">What it costs</p>
              <p className="type-text mt-1 text-ink/70">{value.cost}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
