import type { CSSProperties } from "react";
import { AUDIT_MAILTO, CALL_MAILTO } from "@/lib/site";
import HeroCore from "./HeroCore";

export default function Hero() {
  return (
    /* Below lg the hero is the viewport's height. At lg it shares the first
       frame with the run intro: its least height is the viewport less 373
       (the intro's share and 31 under its last line), its words stay
       centred in that height on the woven core, and its edge sits at the
       buttons, set 32 into the run's own 128, so the run intro's label sits
       96 under them. With no label above it, the headline is the first
       thing in the frame. The sphere dissolves under the buttons instead of
       filling a band of its own. */
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-20 lg:-mb-8 lg:min-h-[calc(100svh_-_373px)]"
    >
      <HeroCore />
      <div
        aria-hidden
        className="hero-core-veil pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ivory via-ivory/70 to-transparent"
      />
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center lg:pt-32 lg:pb-0">
        <h1
          className="hero-enter hero-display type-display text-ink"
          style={{ "--enter-delay": "0.45s", "--enter-dur": "0.95s" } as CSSProperties}
        >
          The operating layer your business actually runs on.
        </h1>
        <p
          className="hero-enter type-body mx-auto mt-6 max-w-3xl text-ink/70"
          style={{ "--enter-delay": "0.75s" } as CSSProperties}
        >
          We build the{" "}
          <span className="font-serif italic text-fern-deep">
            workflows, automations, and agents
          </span>{" "}
          that run on it.
        </p>
        <div
          className="hero-enter mt-9 flex flex-wrap items-center justify-center gap-4"
          style={{ "--enter-delay": "1s" } as CSSProperties}
        >
          <a
            href={AUDIT_MAILTO}
            className="type-text rounded-lg bg-fern px-6 py-3 font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep"
          >
            Start with the audit
          </a>
          <a
            href={CALL_MAILTO}
            className="type-text rounded-lg border border-ink/15 px-6 py-3 font-semibold text-ink transition-colors hover:border-fern hover:text-fern-deep"
          >
            Set up a call
          </a>
        </div>
      </div>
    </section>
  );
}
