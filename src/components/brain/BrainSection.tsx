import BrainStill from "./BrainStill";
import BrainField from "./BrainField";
import Reveal from "../Reveal";
import { CONTAINER, SEAM, SECTION, Split } from "../Band";
import { tie } from "../tie";

export default function BrainSection() {
  return (
    <section id="the-brain" className={`${SEAM} ${CONTAINER} ${SECTION}`}>
      {/* the lead-in: the run's closing line opens this section, the beat
          (288, 192 on phones) under the run's last content and 64 (48 on
          phones) over the label, a space inside the section, so the line
          and the section read as one block. An accent line, roman at full
          ink, its one emphasis the serif italic in the accent colour */}
      <Reveal className="mb-12 sm:mb-16">
        <p className="type-accent text-ink">
          Behind the chat is the{" "}
          <span className="italic text-fern-deep">Core</span>.
        </p>
      </Reveal>
      {/* the band's split form: the words in the title column, the stage in
          the lede column. At lg the stage hangs from the section's top
          without adding to its height (the words set the row), lifted by
          its own drawing's inset (brain-stage in globals.css), so the
          split's first ink is its label, its last is the words' last line,
          and the drawing sits between them in every phase */}
      <Split
        label="This is the Core"
        title="Nothing your firm knows sits alone."
        asideClassName="lg:relative"
        aside={
          <Reveal delay={80} className="lg:absolute lg:inset-x-0 lg:top-0">
            <div id="brain-stage" className="brain-stage" data-mode="still">
              <p className="sr-only">
                Illustrative: a meeting transcript is captured, sorted into a tagged
                note, and connected into the firm’s knowledge graph across
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
          {tie("The Core is everything your firm knows, connected. Every meeting, email, and file becomes a memory linked to the people, deals, and decisions it touches.")}
        </p>
        <p className="type-text mt-4 max-w-md text-ink/70">
          {tie("Your questions search this, and it’s yours, compounding over time instead of walking out the door.")}
        </p>
        <p className="type-text mt-4 max-w-md text-ink/70">
          {tie("Everyone runs the same models now. What a competitor can’t copy is what your firm knows. We make that an asset you own.")}
        </p>
        <p className="type-caption mt-6 text-ink/60">
          Illustrative
        </p>
      </Split>
    </section>
  );
}
