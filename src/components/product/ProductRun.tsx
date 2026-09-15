import { CONTAINER } from "@/components/Band";
import Reveal from "@/components/Reveal";
import { tie } from "@/components/tie";
import CoreStack from "@/components/stack/CoreStack";
import Today from "./today/Today";
import Agenda from "./agenda/Agenda";
import Chat from "./chat/Chat";
import Pipeline from "./pipeline/Pipeline";
import Agents from "./agents/Agents";
import Brand from "./brand/Brand";

/**
 * What we do, then the product run. The statement opens the section and
 * the stack draws the system under it (the Core, the work layer, the
 * dashboard); its frame holds through the scroll, so the beat to the
 * statement above and to the run below comes from the frame's own air.
 * Then six chapters of the Core, each a claim plus a fragment: 01 and 02
 * in the first container under a lead-in, chapter 03 its own full-bleed
 * dark band, and 04 to 06 closing the run before the fictional line and
 * the bridge into the brain section. The run sits in the page column
 * (never wider than 1344, its words on a 1280 measure from 1440 up), and
 * each frame hangs out to the column's edge; the chapters fall on one
 * beat, 288 apart (192 on phones), with the dark band padded to match.
 */
export default function ProductRun() {
  return (
    <>
      <section id="what-we-do" className={`${CONTAINER} pt-24 sm:pt-32`}>
        <Reveal>
          <p className="type-label text-fern-deep">What we do</p>
          <h2 className="type-h2 mt-3 max-w-5xl text-ink">
            {tie("AI is only as useful as what it knows about your business.")}{" "}
            <span className="text-ink/60">
              {tie("So we start there. Crosswell brings everything your company knows into one place, then builds the agents and automations that use it.")}
            </span>
          </h2>
        </Reveal>
      </section>

      <CoreStack />

      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        {/* the lead-in into the run: it picks up the stack's last caption
            (one screen), says the chapters are a sample built for one kind
            of business, and names it, so a visitor outside lending reads
            the finance detail as an example rather than the audience; 96
            (64 on phones) over chapter 01's claim, the chapters' own hang */}
        <Reveal className="mb-16 lg:mb-24">
          <p className="type-accent text-ink">{tie("Here's that screen at work, custom built for a sample private lending company.")}</p>
        </Reveal>
        <div className="space-y-48 sm:space-y-72">
          <Today />
          <Agenda />
        </div>
      </section>

      <Chat />

      <section className={`${CONTAINER} pt-24 pb-24 sm:pt-32 sm:pb-32`}>
        <div className="space-y-48 sm:space-y-72">
          <Pipeline />
          <Agents />
          <Brand />
        </div>
        {/* the run's last content; the next section's lead-in ("Behind the
            chat is the Core.") sits the beat below it */}
        <p className="type-caption mt-12 text-ink/60">
          Saguaro Capital is fictional. Every number is invented, rounded demo data.
        </p>
      </section>
    </>
  );
}
