import BrainStill from "./BrainStill";
import BrainField from "./BrainField";

export default function BrainSection() {
  return (
    <section id="the-brain" className="px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.85fr_1.4fr] lg:gap-16">
        <div>
          <p className="type-kicker text-fern-deep">Behind the chat</p>
          <h2 className="type-h2 mt-3">Nothing your firm knows sits alone.</h2>
          <p className="type-body mt-5 max-w-[46ch] text-charcoal/80">
            Every meeting, email, and file becomes a connected memory, linked
            to the people, deals, and decisions it touches. Your firm&apos;s
            knowledge stops living in inboxes and in people&apos;s heads, and
            starts compounding.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.14em] text-warmgray">
            Illustrative
          </p>
        </div>
        <div id="brain-stage" className="brain-stage" data-mode="still">
          <p className="sr-only">
            Illustrative: a meeting transcript is captured, sorted into a tagged
            note, and connected into the firm&apos;s knowledge graph across
            deals, people, meetings, operations, and investors.
          </p>
          <BrainStill />
          <BrainField />
        </div>
      </div>
    </section>
  );
}
