import Reveal from "./Reveal";

const offerings = [
  {
    title: "Custom tools and automations",
    body: "Deal screening, diligence reading, memo and report drafting, dashboards. Whatever painful workflow your firm names, we build it on top of Core so it runs with full firm context.",
  },
  {
    title: "The support layer",
    body: "A hands-on retainer. If something breaks, we fix it. As new needs surface, we keep automating. Your technology keeps improving without a hire.",
  },
];

export default function BeyondCore() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="type-kicker mb-4 text-fern-deep">Beyond Core</p>
          <h2 className="type-h2 text-ink">
            Your outsourced technology arm.
          </h2>
          <p className="type-body mt-5 text-ink/70">
            Lean firms stay lean on purpose. You will never hire an in-house
            engineering team, and you should not have to. Core is where most
            engagements start; the tools and automations built on it are where
            the hours come back.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6">
          {offerings.map((offering, i) => (
            <Reveal key={offering.title} delay={i * 130}>
              <div className="rounded-2xl border border-warmgray/40 bg-parchment p-7 shadow-whisper transition-shadow hover:shadow-lifted sm:p-8">
                <h3 className="type-h3 text-ink">{offering.title}</h3>
                <p className="mt-2.5 leading-relaxed text-ink/70">
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
