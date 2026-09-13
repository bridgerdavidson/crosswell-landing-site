import type { CSSProperties } from "react";
import { AUDIT_MAILTO, CALL_MAILTO } from "@/lib/site";
import HeroCore from "./HeroCore";

export default function Hero() {
  return (
    /* Below lg the hero is the viewport's height. At lg it is the words'
       height on the page's beat: 80 under the fixed nav, 128 to the eyebrow,
       the words, 128 to the hero's edge, and the run's own 128 after that,
       so the buttons sit one section beat (256) above the run intro and the
       sphere dissolves under them instead of filling a band of its own. */
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-20 lg:min-h-0"
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
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center lg:py-32">
        <p
          className="hero-enter type-label mb-5 text-fern-deep"
          style={{ "--enter-delay": "0.2s" } as CSSProperties}
        >
          Crosswell Core
        </p>
        <h1
          className="hero-enter type-display text-ink"
          style={{ "--enter-delay": "0.45s", "--enter-dur": "0.95s" } as CSSProperties}
        >
          The operating layer your business actually runs on.
        </h1>
        <p
          className="hero-enter type-text mx-auto mt-6 max-w-3xl text-balance text-ink/70"
          style={{ "--enter-delay": "0.75s" } as CSSProperties}
        >
          We build the{" "}
          <span className="font-serif italic text-fern-deep">
            workflows, automations, sales systems, financial models, and agents
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
