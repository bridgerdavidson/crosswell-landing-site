import BrainStill from "./BrainStill";
import BrainField from "./BrainField";
import Reveal from "../Reveal";

export default function BrainSection() {
  return (
    <section id="the-brain" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      {/* the company half's one split grid: two equal columns 64 apart; the
          text column is the lede's measure, and it centers on the stage */}
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="type-label mb-3 text-fern-deep">This is the Core</p>
          <h2 className="type-h2">Nothing your firm knows sits alone.</h2>
          <p className="type-body mt-5 text-ink/80">
            The Core is everything your firm knows, connected. Every meeting,
            email, and file becomes a memory linked to the people, deals, and
            decisions it touches. Your questions search this, and it&apos;s
            yours, compounding over time instead of walking out the door.
          </p>
          <p className="type-text mt-4 text-ink/70">
            Everyone runs the same models now. What a competitor can&apos;t copy
            is what your firm knows. We make that an asset you own.
          </p>
          <p className="type-caption mt-6 text-ink/60">
            Illustrative
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div id="brain-stage" className="brain-stage" data-mode="still">
            <p className="sr-only">
              Illustrative: a meeting transcript is captured, sorted into a tagged
              note, and connected into the firm&apos;s knowledge graph across
              deals, people, meetings, operations, and investors.
            </p>
            <BrainStill />
            <BrainField />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
