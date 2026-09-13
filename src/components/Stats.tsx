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

export default function Stats() {
  return (
    <section id="stats" className="border-y border-ink/8">
      <div className="mx-auto grid max-w-4xl gap-10 px-6 py-14 sm:grid-cols-2 sm:gap-14 sm:py-16">
        {stats.map((stat, i) => (
          <Reveal key={stat.figure} delay={i * 120}>
            <div>
              <p className="type-h2 text-fern-deep">{stat.figure}</p>
              <p className="type-text mt-2 max-w-[40ch] text-ink/75">{stat.body}</p>
              <p className="type-caption mt-3 text-ink/60">{stat.source}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
