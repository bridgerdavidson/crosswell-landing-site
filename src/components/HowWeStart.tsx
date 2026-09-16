import Band, { CONTAINER, GRID, HANG, SECTION } from "./Band";
import Reveal from "./Reveal";
import { CALL_MAILTO } from "@/lib/site";
import { tie } from "./tie";

/* No prices anywhere in this section, per the messaging handoff: "two weeks,
   fixed scope" is the only cost signal that ships. */
const steps = [
  {
    name: "The first call",
    when: "Thirty minutes",
    body: "We ask how your firm handles knowledge today and how the work actually moves. Then we tell you straight whether the audit is worth it.",
    action: { label: "Set up a call", href: CALL_MAILTO },
  },
  {
    name: "The audit",
    when: "Two weeks, fixed scope",
    body: "We come in and sit with your team. Where does your business keep what it knows, how does the work actually move, and where does it get dropped? We map that and design your system from it. You keep the map either way.",
  },
  {
    name: "Build and setup",
    when: "Week three on",
    body: "We build the Core around what the audit found, install it, and hand it over running, with your team onboarded. The agents and automations your team named come next, on top of it. If something breaks, we fix it. As new needs surface, we keep automating.",
  },
];

/**
 * How we start: three steps, as three rows on the band's own grid, so the
 * sequence reads down the page like the run and each step's words sit on
 * the lede column above them. The first call is a step, not a note about
 * the audit (it sat in the band's aside and read that way), so it leads
 * the rows and carries the one action that starts everything. Each row is
 * the step's name with its duration as a caption, then what happens.
 * Hairlines between, no cards (the cards were the page's last
 * fragment-era material) and no drawings (two were tried beside the names
 * and read badly; the words carry it).
 */
export default function HowWeStart() {
  return (
    <section id="how-we-start" className="border-y border-ink/8 bg-parchment">
      <div className={`${CONTAINER} ${SECTION}`}>
        <Band label="How we start" title="Start small, on purpose." lede="Three steps, each small enough to stop after." />

        <ol className={`${HANG} border-t border-ink/8`}>
          {steps.map((step, i) => (
            <Reveal key={step.name} delay={i * 80}>
              <li className={`${GRID} gap-y-6 border-b border-ink/8 py-10 lg:py-12`}>
                <div>
                  <h3 className="type-h3 text-ink">{step.name}</h3>
                  <p className="type-caption mt-1.5 font-medium text-fern-deep">{step.when}</p>
                </div>
                {/* the lede column, its cap height on the name's; the first
                    step's action sits under its words, since that is where
                    the process starts */}
                <div className="max-w-xl">
                  <p className="type-body text-ink/80">{tie(step.body)}</p>
                  {step.action && (
                    <a
                      href={step.action.href}
                      className="type-text mt-6 inline-block rounded-lg bg-fern px-6 py-3 font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep"
                    >
                      {step.action.label}
                    </a>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
