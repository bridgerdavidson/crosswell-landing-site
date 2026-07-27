import Reveal from "./Reveal";
import { AUDIT_MAILTO, CALL_MAILTO } from "@/lib/site";

export default function FinalCta() {
  return (
    <section className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
        <Reveal>
          {/* deliberate reuse of the hero display scale as a closing bookend */}
          <h2 className="type-display">
            Your firm already knows the answers.{" "}
            <span className="italic text-fern-soft">Give it a memory.</span>
          </h2>
          <p className="type-body mx-auto mt-6 max-w-xl text-ivory/70">
            The Core is built alongside the firms it serves. Start with the
            two-week knowledge audit, or talk to us directly.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={AUDIT_MAILTO}
              className="rounded-lg bg-fern px-7 py-4 text-sm font-semibold text-ivory transition-colors hover:bg-fern-deep"
            >
              Start with the audit
            </a>
            <a
              href={CALL_MAILTO}
              className="rounded-lg border border-ivory/25 px-7 py-4 text-sm font-semibold text-ivory transition-colors hover:border-fern-soft hover:text-fern-soft"
            >
              Set up a call
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
