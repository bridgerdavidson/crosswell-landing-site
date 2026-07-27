import BrainStill from "./BrainStill";
import BrainField from "./BrainField";
import Reveal from "../Reveal";

export default function BrainSection() {
  return (
    <section id="the-brain" className="px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.62fr_1.55fr] lg:gap-16">
        <Reveal>
          <p className="type-kicker text-fern-deep">This is the Core</p>
          <h2 className="type-h2 mt-3">Nothing your firm knows sits alone.</h2>
          <p className="type-body mt-5 max-w-[46ch] text-charcoal/80">
            The Core is everything your firm knows, connected. Every meeting,
            email, and file becomes a memory linked to the people, deals, and
            decisions it touches. Your questions search this, and it&apos;s
            yours, compounding over time instead of walking out the door.
          </p>
          <p className="type-body mt-4 max-w-[46ch] text-charcoal/80">
            Everyone runs the same models now. What a competitor can&apos;t copy
            is what your firm knows. We make that an asset you own.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.14em] text-warmgray">
            Illustrative
          </p>
        </Reveal>
        <Reveal delay={150}>
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
