import BrainStill from "./BrainStill";
import BrainField from "./BrainField";
import Reveal from "../Reveal";
import { CONTAINER, SECTION, Split } from "../Band";

export default function BrainSection() {
  return (
    <section id="the-brain" className={`${CONTAINER} ${SECTION}`}>
      {/* the band's split form: the words in the title column, the stage in
          the lede column. At lg the stage hangs from the section's top
          without adding to its height (the words set the row), lifted by
          its own drawing's inset (brain-stage in globals.css), so the
          section's first ink is its label, its last is the words' last
          line, and the drawing sits between them in every phase */}
      <Split
        label="This is the Core"
        title="Nothing your firm knows sits alone."
        asideClassName="lg:relative"
        aside={
          <Reveal delay={80} className="lg:absolute lg:inset-x-0 lg:top-0">
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
        }
      >
        {/* the lede is the first two sentences, the first alone being short;
            the rest of the paragraph follows as running text */}
        <p className="type-body mt-5 max-w-xl text-ink/80">
          The Core is everything your firm knows, connected. Every meeting,
          email, and file becomes a memory linked to the people, deals, and
          decisions it touches.
        </p>
        <p className="type-text mt-4 max-w-md text-ink/70">
          Your questions search this, and it&apos;s yours, compounding over time
          instead of walking out the door.
        </p>
        <p className="type-text mt-4 max-w-md text-ink/70">
          Everyone runs the same models now. What a competitor can&apos;t copy
          is what your firm knows. We make that an asset you own.
        </p>
        <p className="type-caption mt-6 text-ink/60">
          Illustrative
        </p>
      </Split>
    </section>
  );
}
