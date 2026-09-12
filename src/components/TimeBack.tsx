import Reveal from "./Reveal";

/* Retention leads, hours land last (Website Direction v6, section 7). */
const sinks = [
  {
    pain: "The context a departing employee walks out with",
    fix: "stays in the firm forever.",
  },
  {
    pain: "The new hire's six months of catching up",
    fix: "becomes day one with the whole firm's memory.",
  },
  {
    pain: "The answer buried in a March email thread",
    fix: "comes back in seconds, with the thread attached.",
  },
  {
    pain: "The weekly report that eats four hours",
    fix: "runs itself. You get the four hours back.",
  },
];

export default function TimeBack() {
  return (
    <section id="what-you-lose" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="type-label mb-4 text-fern-deep">The value</p>
          <h2 className="type-h2 text-ink">What a business actually loses.</h2>
          <p className="type-body mt-5 text-ink/70">
            Almost everything your business knows never gets written down. It
            is scattered across inboxes, call recordings, files nobody opens
            again, and a few people&apos;s heads. You paid for all of it once.
            Most of it you never use twice. We take that whole pile, connect
            it, and put it back to work.
          </p>
        </Reveal>

        <div className="flex flex-col divide-y divide-ink/8">
          {sinks.map((sink, i) => (
            <Reveal key={sink.pain} delay={i * 110}>
              <div className="py-6 first:pt-0 last:pb-0">
                <p className="type-accent text-ink">
                  {sink.pain}{" "}
                  <span className="italic text-fern-deep">{sink.fix}</span>
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={480}>
            <p className="pt-6 leading-relaxed text-ink/70">
              The hours aren&apos;t the point. They go back where trust gets
              built: your people, in front of your customers.
            </p>
            <p className="mt-4 leading-relaxed text-ink/70">
              And a firm that keeps its memory is worth more. When an acquirer,
              investor, or auditor looks in, everything is in one place: every
              project, every decision, every reason why.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
