import Reveal from "@/components/Reveal";
import Today from "./today/Today";
import Agenda from "./agenda/Agenda";
import Chat from "./chat/Chat";
import Pipeline from "./pipeline/Pipeline";
import Agents from "./agents/Agents";
import Brand from "./brand/Brand";

/**
 * The product run: six chapters of the Core, each a claim plus a fragment.
 * Chapters 01 and 02 sit in the first container, chapter 03 is its own
 * full-bleed dark band, and 04 to 06 close the run before the fictional
 * line and the bridge into the brain section. The run's width follows the
 * viewport inside fixed 48px gutters at lg (1344 at 1440, 1632 at 1728), so
 * the product runs gutter to gutter at every width; the chapters fall on
 * one beat, 288 apart (192 on phones), with the dark band padded to match.
 */
export default function ProductRun() {
  return (
    <>
      <section
        id="how-it-works"
        className="px-6 pt-24 pb-24 sm:pt-32 sm:pb-32 lg:px-12"
      >
        <Reveal>
          <p className="type-label text-fern-deep">How it works</p>
          <h2 className="type-h2 mt-3 max-w-3xl text-ink">
            You&apos;re not talking to a chatbot. You&apos;re talking to your
            firm&apos;s memory.
          </h2>
          <p className="type-body mt-5 max-w-2xl text-ink/80">
            The Core is built on agentic AI (AI that does the work, not just
            answers questions) and managed for you. Six things it does on a
            Thursday morning.
          </p>
        </Reveal>
        <div className="mt-48 space-y-48 sm:mt-72 sm:space-y-72">
          <Today />
          <Agenda />
        </div>
      </section>

      <Chat />

      <section className="px-6 pt-24 pb-24 sm:pt-32 sm:pb-32 lg:px-12">
        <div className="space-y-48 sm:space-y-72">
          <Pipeline />
          <Agents />
          <Brand />
        </div>
        <p className="type-caption mt-12 text-ink/60">
          Saguaro Capital is fictional. Every number is invented, rounded demo data.
        </p>
        <Reveal>
          {/* mirrors BrainSection's top padding below it, so the line
              sits centered in the whitespace between the two sections */}
          <p className="mt-24 text-center type-accent text-charcoal sm:mt-32">
            Behind the chat is the{" "}
            <span className="font-semibold text-fern-deep">Core</span>.
          </p>
        </Reveal>
      </section>
    </>
  );
}
