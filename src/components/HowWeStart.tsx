import Band, { CONTAINER, HANG, SECTION } from "./Band";
import Reveal from "./Reveal";
import { AUDIT_MAILTO } from "@/lib/site";
import { tie } from "./tie";

/* No prices anywhere in this section, per the messaging handoff: "two weeks,
   fixed scope" is the only cost signal that ships. */
const engagements = [
  {
    title: "The knowledge audit",
    body: "Two weeks, fixed scope. We map where your firm’s information gets dropped and what it costs you. You keep the map either way.",
    note: "Where every firm starts",
  },
  {
    title: "The Core install",
    body: "Your firm’s memory, provisioned and handed over running, your team onboarded.",
  },
  {
    title: "The Core plus the custom layer",
    body: "We design, build, and run the agentic tools your firm names, on top of the Core. If something breaks, we fix it. As new needs surface, we keep automating, so your technology keeps improving without a hire.",
  },
];

export default function HowWeStart() {
  return (
    <section id="how-we-start" className="border-y border-ink/8 bg-parchment">
      <div className={`${CONTAINER} ${SECTION}`}>
        {/* the page's title band. Its right column holds the first call, the
            sentence that follows the title and so its lede (24, ink 80), and
            the audit button under it, the lede's cap height on the title's,
            so the section runs band, hang, cards */}
        <Band
          label="How we start"
          title="Start small, on purpose."
          aside={
            <div className="flex flex-col items-start gap-5">
              <p className="type-body text-ink/80">
                {tie("The first call is thirty minutes. We ask how your firm handles knowledge today, and we tell you straight whether the audit is worth it.")}
              </p>
              <a
                href={AUDIT_MAILTO}
                className="type-text rounded-lg bg-fern px-6 py-3 font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep"
              >
                Start with the audit
              </a>
            </div>
          }
        />

        {/* three across from 1200, where every card title holds one line
            ("The Core plus the custom layer" breaks to two up to 1192) and
            every body stays within six; below that the cards stack */}
        <div className={`${HANG} grid gap-6 min-[75rem]:grid-cols-3`}>
          {engagements.map((engagement, i) => (
            <Reveal key={engagement.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-warmgray/40 bg-ivory p-7 shadow-whisper transition-shadow hover:shadow-lifted sm:p-8">
                <h3 className="type-h3 text-ink">{engagement.title}</h3>
                <p className="type-text mt-2.5 max-w-md type-text-balanced text-ink/70">
                  {tie(engagement.body)}
                </p>
                {engagement.note && (
                  <p className="type-caption mt-4 font-medium text-fern-deep">{engagement.note}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
