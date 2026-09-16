import { CONTAINER } from "@/components/Band";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import { tie } from "@/components/tie";
import CoreStack from "@/components/stack/CoreStack";
import Today from "./today/Today";
import Core from "./core/Core";
import Agenda from "./agenda/Agenda";
import Agents from "./agents/Agents";
import Custom from "./custom/Custom";

/**
 * What we do, then the product run. The statement opens the section and
 * the stack draws the system under it (the Core, the work layer, the
 * dashboard); its frame holds through the scroll, so the beat to the
 * statement above and to the run below comes from the frame's own air.
 * Then five chapters, each a claim plus the product: Today, Ask the Core,
 * and the agenda in the first container under a lead-in; the agents on the
 * run's one full-bleed dark band; and the custom chapter closing the run
 * before the fictional line and the bridge into the brain section. The run sits in the page column
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
        <Stats />
      </section>

      <CoreStack />

      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        {/* the lead-in into the run: it picks up the stack's last caption
            (one screen), says the chapters are a sample built for one kind
            of business, and names it, so a visitor outside lending reads
            the finance detail as an example rather than the audience; 96
            (64 on phones) over chapter 01's claim, the chapters' own hang */}
        <Reveal className="mb-16 lg:mb-24">
          <p className="type-accent text-ink">{tie("Here’s that screen at work, custom built for a sample private lending company.")}</p>
        </Reveal>
        <div className="space-y-48 sm:space-y-72">
          <Today />
          <Core />
          <Agenda />
        </div>
      </section>

      {/* the run's one dark band: the agents, working while you don't */}
      <section className="bg-charcoal-deep text-ivory">
        <div className={`${CONTAINER} py-24 sm:py-40`}>
          <Agents />
        </div>
      </section>

      <section className={`${CONTAINER} pt-24 pb-24 sm:pt-32 sm:pb-32`}>
        <div className="space-y-48 sm:space-y-72">
          <Custom />
        </div>
        {/* the run's last content, as fine print: it has to be there, not be
            read first, so it is the smallest size on the page at low ink */}
        <p className="mt-12 text-[12px] leading-[1.5] text-ink/45">
          Saguaro Capital, Juniper Row Supply, and Kestrel & Vane are fictional. Every number is invented, rounded demo data.
        </p>
      </section>
    </>
  );
}
