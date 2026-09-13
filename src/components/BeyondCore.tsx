import Reveal from "./Reveal";

const offerings = [
  {
    title: "Custom tools and automations",
    body: "Instant answers, document review, report drafting, dashboards. Whatever painful workflow your team names, we build it on top of the Core so it runs with full firm context.",
  },
  {
    title: "The support layer",
    body: "A hands-on retainer. If something breaks, we fix it. As new needs surface, we keep automating. Your technology keeps improving without a hire.",
  },
];

export default function BeyondCore() {
  return (
    <section id="beyond-core" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="type-label mb-3 text-fern-deep">Beyond the Core</p>
          <h2 className="type-h2 text-ink">
            Your outsourced technology arm.
          </h2>
          <p className="type-body mt-5 text-ink/80">
            Lean firms stay lean on purpose. You will never hire an in-house
            engineering team, and you should not have to.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6">
          {offerings.map((offering, i) => (
            <Reveal key={offering.title} delay={i * 80}>
              <div className="rounded-2xl border border-warmgray/40 bg-parchment p-7 shadow-whisper transition-shadow hover:shadow-lifted sm:p-8">
                <h3 className="type-h3 text-ink">{offering.title}</h3>
                <p className="type-text mt-2.5 text-ink/70">
                  {offering.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
