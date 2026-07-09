import Reveal from "./Reveal";

const points = [
  {
    title: "We know the workflow",
    body: "Deal flow, investor reporting, diligence, committee decisions. We have run these from the inside, so we name the problems before you say them and build for how the work actually happens.",
  },
  {
    title: "We sell trust",
    body: "The most valuable thing inside a firm that handles other people's money is trust. Everything we build is designed to protect it, and we put that in writing.",
  },
  {
    title: "You work directly with us",
    body: "No account managers, no ticket queues. The people who designed your brain are the people who answer when something needs attention.",
  },
];

export default function Edge() {
  return (
    <section id="why-crosswell" className="border-y border-ink/8 bg-parchment">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-fern-deep">
            Why Crosswell
          </p>
          <h2 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            We have worked inside funds. Most technology firms have not.
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <blockquote className="mt-14 max-w-3xl border-l-2 border-fern pl-6 sm:pl-8">
            <p className="font-serif text-2xl italic leading-snug text-ink/85 sm:text-3xl">
              When someone leaves, their knowledge does not. Every meeting,
              decision, and deal, remembered.
            </p>
          </blockquote>
        </Reveal>

        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={i * 120}>
              <div>
                <div className="mb-4 h-px w-10 bg-fern" />
                <h3 className="text-lg font-semibold text-ink">{point.title}</h3>
                <p className="mt-2.5 leading-relaxed text-ink/70">
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
