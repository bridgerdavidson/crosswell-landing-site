import { CONTAINER } from "./Band";
import Reveal from "./Reveal";
import { CALL_MAILTO } from "@/lib/site";
import { tie } from "./tie";

/* The closing bookend: the hero's display, subline and one button again,
   on the hero's own margins, centred in the page's container. A dark band,
   it pads 160 on both sides like the run's (96 on phones), so it sits the
   beat (288) under the insights' content. */
export default function FinalCta() {
  return (
    <section className="bg-charcoal text-ivory">
      <div className={`${CONTAINER} py-24 text-center sm:py-40`}>
        <Reveal>
          {/* deliberate reuse of the hero display scale as a closing bookend */}
          <h2 className="type-display mx-auto max-w-4xl">
            {tie("Your firm already knows the answers.")}{" "}
            <span className="italic text-fern-soft">{tie("Give it a memory.")}</span>
          </h2>
          <p className="type-body mx-auto mt-6 max-w-2xl text-ivory/80">
            {tie("The Core is built alongside the firms it serves. It starts with a thirty-minute call.")}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={CALL_MAILTO}
              className="type-text rounded-lg bg-fern px-7 py-3.5 font-semibold text-ivory transition-colors hover:bg-fern-deep"
            >
              Set up a call
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
