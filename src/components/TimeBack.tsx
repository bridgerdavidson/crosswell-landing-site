import { CONTAINER, SECTION, Split } from "./Band";
import Reveal from "./Reveal";
import { tie } from "./tie";

/* Retention leads, hours land last (Website Direction v6, section 7). */
const sinks = [
  {
    pain: "The context a departing employee walks out with",
    fix: "stays in the firm forever.",
  },
  {
    pain: "The new hire’s six months of catching up",
    fix: "becomes day one with the whole firm’s memory.",
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
    <section id="what-you-lose" className={`${CONTAINER} ${SECTION}`}>
      {/* the band's split form: the words in the title column, the ledger in
          the lede column from the title's row, its first line's cap height
          on the title's */}
      <Split
        label="The value"
        title="What a business actually loses."
        asideClassName="lg:pt-[30px]"
        aside={
          <div className="flex flex-col divide-y divide-ink/8">
            {/* each row sits alone in its reveal, so first: and last: would
                match every row; the first row's top padding and the last
                row's bottom padding are dropped by index, and every row
                keeps 24 on each side of its hairline.
                The fix clause carries the page's one emphasis, the serif
                italic in the accent colour */}
            {sinks.map((sink, i) => (
              <Reveal key={sink.pain} delay={i * 80}>
                <div className={i === 0 ? "pb-6" : i === sinks.length - 1 ? "pt-6" : "py-6"}>
                  {/* each clause is its own inline block, so a row breaks
                      between the ink clause and the fern clause wherever it
                      runs to more than one line, and each clause balances
                      within itself when it wraps */}
                  <p className="type-accent text-ink">
                    <span className="inline-block">{sink.pain}</span>{" "}
                    <span className="inline-block italic text-fern-deep">{sink.fix}</span>
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        }
      >
        {/* the lede is the first sentence; the rest follows as running
            text, so the lede lands in two lines. Every word of the section
            stacks here, the two closing paragraphs included, so the words
            and the ledger end near each other */}
        <p className="type-body mt-5 max-w-xl text-ink/80">
          {tie("Almost everything your business knows never gets written down.")}
        </p>
        <p className="type-text mt-4 max-w-md text-ink/70">
          {tie("It is scattered across inboxes, call recordings, files nobody opens again, and a few people’s heads. You paid for all of it once. Most of it you never use twice. We take that whole pile, connect it, and put it back to work.")}
        </p>
        <p className="type-text mt-4 max-w-md text-ink/70">
          {tie("The hours aren’t the point. They go back where trust gets built: your people, in front of your customers.")}
        </p>
        <p className="type-text mt-4 max-w-md text-ink/70">
          {tie("And a firm that keeps its memory is worth more. When an acquirer, investor, or auditor looks in, everything is in one place: every project, every decision, every reason why.")}
        </p>
      </Split>
    </section>
  );
}
