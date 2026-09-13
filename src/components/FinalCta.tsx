import { CONTAINER } from "./Band";
import Reveal from "./Reveal";
import { AUDIT_MAILTO, CALL_MAILTO } from "@/lib/site";

/* The closing bookend: the hero's display, subline and two buttons again,
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
            Your firm already knows the answers.{" "}
            <span className="italic text-fern-soft">Give it a memory.</span>
          </h2>
          <p className="type-body mx-auto mt-6 max-w-2xl text-ivory/80">
            The Core is built alongside the firms it serves. Start with the
            two-week knowledge audit, or talk to us directly.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={AUDIT_MAILTO}
              className="type-text rounded-lg bg-fern px-7 py-3.5 font-semibold text-ivory transition-colors hover:bg-fern-deep"
            >
              Start with the audit
            </a>
            <a
              href={CALL_MAILTO}
              className="type-text rounded-lg border border-ivory/25 px-7 py-3.5 font-semibold text-ivory transition-colors hover:border-fern-soft hover:text-fern-soft"
            >
              Set up a call
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
