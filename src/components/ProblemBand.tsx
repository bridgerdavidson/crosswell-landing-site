import Reveal from "./Reveal";

/* Gated per the messaging handoff: the four-sentence dark-data paragraph and
   the 90% chip carry the IDC figure, which ships only once Max pins the exact
   report name and year for the printed source. Until then the band leads with
   the 22% chip. A stat without a printed source does not ship. */
const stats = [
  {
    figure: "22%",
    body: "of family offices have automated operational tasks or use AI for investment analysis, up from 13% in 2024.",
    source: "Citi Wealth, AI in the Family Office, May 2026",
  },
  {
    figure: "70%",
    body: "of RIAs already use AI for meeting notes.",
    source: "Ezra Group, 2026",
  },
];

export default function ProblemBand() {
  return (
    <section className="border-y border-ink/8 bg-parchment">
      <div className="mx-auto grid max-w-4xl gap-10 px-6 py-14 sm:grid-cols-2 sm:gap-14 sm:py-16">
        {stats.map((stat, i) => (
          <Reveal key={stat.figure} delay={i * 120}>
            <div>
              <p className="type-h2 text-fern-deep">{stat.figure}</p>
              <p className="mt-2 max-w-[40ch] leading-relaxed text-ink/75">
                {stat.body}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-warmgray">
                {stat.source}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
