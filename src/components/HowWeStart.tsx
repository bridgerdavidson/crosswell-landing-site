import type { ReactNode } from "react";
import Band, { CONTAINER, GRID, HANG, SECTION } from "./Band";
import Reveal from "./Reveal";
import { AuditArt, OnboardArt } from "./StartArt";
import { AUDIT_MAILTO } from "@/lib/site";
import { tie } from "./tie";

/* No prices anywhere in this section, per the messaging handoff: "two weeks,
   fixed scope" is the only cost signal that ships. */
const steps: { name: string; when: string; art: ReactNode; body: string }[] = [
  {
    name: "The audit",
    when: "Two weeks, fixed scope",
    art: <AuditArt />,
    body: "We come in and ask questions. Where does your business keep what it knows, how does the work actually move, and where does it get dropped? We map that and design your system from it. You keep the map either way.",
  },
  {
    name: "Onboarding",
    when: "Week three on",
    art: <OnboardArt />,
    body: "We build the Core around what the audit found, provision it, and hand it over running, with your team onboarded. The agents and automations your team named come next, on top of it. If something breaks, we fix it. As new needs surface, we keep automating.",
  },
];

/**
 * How we start: two steps, as two rows on the band's own grid, so the
 * sequence reads down the page like the run and the step's words sit on
 * the lede column above them. Each row leads with its drawing, then the
 * step's name with its duration as a caption, then what happens. Hairlines
 * between, no cards: the cards were the page's last fragment-era material.
 */
export default function HowWeStart() {
  return (
    <section id="how-we-start" className="border-y border-ink/8 bg-parchment">
      <div className={`${CONTAINER} ${SECTION}`}>
        {/* the page's title band. Its right column holds the first call, the
            sentence that follows the title and so its lede (24, ink 80), and
            the audit button under it, the lede's cap height on the title's */}
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

        <ol className={`${HANG} border-t border-ink/8`}>
          {steps.map((step, i) => (
            <Reveal key={step.name} delay={i * 80}>
              <li className={`${GRID} gap-y-6 border-b border-ink/8 py-10 lg:py-12`}>
                <div className="flex items-start gap-6 sm:gap-8">
                  <span className="w-24 flex-none">{step.art}</span>
                  <div className="pt-1">
                    <h3 className="type-h3 text-ink">{step.name}</h3>
                    <p className="type-caption mt-1.5 font-medium text-fern-deep">{step.when}</p>
                  </div>
                </div>
                {/* the lede column, its cap height on the name's */}
                <p className="type-body max-w-xl text-ink/80 lg:pt-1">{tie(step.body)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
