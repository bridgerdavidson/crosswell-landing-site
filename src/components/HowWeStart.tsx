import Reveal from "./Reveal";
import { AUDIT_MAILTO } from "@/lib/site";

/* No prices anywhere in this section, per the messaging handoff: "two weeks,
   fixed scope" is the only cost signal that ships. */
const engagements = [
  {
    title: "The knowledge audit",
    body: "Two weeks, fixed scope. We map where your firm's information gets dropped and what it costs you. You keep the map either way.",
    note: "Where every firm starts",
  },
  {
    title: "The Core install",
    body: "Your firm's memory, provisioned and handed over running, your team onboarded.",
  },
  {
    title: "The Core plus the custom layer",
    body: "We design, build, and run the agentic tools your firm names, on top of the Core.",
  },
];

export default function HowWeStart() {
  return (
    <section id="how-we-start" className="border-b border-ink/8 bg-parchment">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <p className="type-label mb-3 text-fern-deep">How we start</p>
          <h2 className="type-h2 max-w-2xl text-ink">
            Start small, on purpose.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {engagements.map((engagement, i) => (
            <Reveal key={engagement.title} delay={i * 120}>
              <div className="flex h-full flex-col rounded-2xl border border-warmgray/40 bg-ivory p-7 shadow-whisper transition-shadow hover:shadow-lifted sm:p-8">
                <h3 className="type-h3 text-ink">{engagement.title}</h3>
                <p className="type-text mt-2.5 text-ink/70">
                  {engagement.body}
                </p>
                {engagement.note && (
                  <p className="type-caption mt-4 font-medium text-fern-deep">{engagement.note}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <div className="mt-10 flex flex-col items-start gap-5">
            <p className="type-text text-ink/70">
              The first call is thirty minutes. We ask how your firm handles
              knowledge today, and we tell you straight whether the audit is
              worth it.
            </p>
            <a
              href={AUDIT_MAILTO}
              className="type-text rounded-lg bg-fern px-6 py-3 font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep"
            >
              Start with the audit
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
