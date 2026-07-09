import Reveal from "./Reveal";

const sinks = [
  {
    pain: "The weekly report that eats four hours",
    fix: "runs itself. You get the four hours back.",
  },
  {
    pain: "The answer buried in a March email thread",
    fix: "comes back in seconds, with the thread attached.",
  },
  {
    pain: "The context a departing analyst walks out with",
    fix: "stays in the firm forever.",
  },
  {
    pain: "The new hire's six months of catching up",
    fix: "becomes day one with the whole firm's memory.",
  },
];

export default function TimeBack() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-fern-deep">
            The value
          </p>
          <h2 className="font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            Where lean firms lose the week.
          </h2>
          <p className="mt-5 leading-relaxed text-ink/70">
            A fund runs on a handful of expensive people whose judgment is the
            product. Every hour they spend on manual reporting, hunting for
            context, or re-answering old questions is an hour of judgment the
            firm paid for and did not get.
          </p>
        </Reveal>

        <div className="flex flex-col divide-y divide-ink/8">
          {sinks.map((sink, i) => (
            <Reveal key={sink.pain} delay={i * 110}>
              <div className="py-6 first:pt-0 last:pb-0">
                <p className="font-serif text-xl leading-snug text-ink sm:text-2xl">
                  {sink.pain}{" "}
                  <span className="italic text-fern-deep">{sink.fix}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
