import type { CSSProperties } from "react";
import { CALL_MAILTO, WAITLIST_MAILTO } from "@/lib/site";
import HeroCore from "./HeroCore";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden pt-20"
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
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
        <p
          className="hero-enter type-kicker mb-5 text-fern-deep"
          style={{ "--enter-delay": "0.2s" } as CSSProperties}
        >
          Crosswell Core
        </p>
        <h1
          className="hero-enter type-display text-ink"
          style={{ "--enter-delay": "0.45s", "--enter-dur": "0.95s" } as CSSProperties}
        >
          The operating layer for{" "}
          <span className="italic text-fern-deep">financial stewards</span>.
        </h1>
        <p
          className="hero-enter type-body mx-auto mt-6 max-w-2xl text-ink/70"
          style={{ "--enter-delay": "0.75s" } as CSSProperties}
        >
          Crosswell Core is your firm&apos;s institutional memory, built on AI
          and managed for you. Knowledge flows in, anyone can ask it anything,
          and the busywork runs itself. Everything we build next stands on it.
        </p>
        <div
          className="hero-enter mt-9 flex flex-wrap items-center justify-center gap-4"
          style={{ "--enter-delay": "1s" } as CSSProperties}
        >
          <a
            href={WAITLIST_MAILTO}
            className="rounded-lg bg-fern px-6 py-3.5 text-sm font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep"
          >
            Join the Core waitlist
          </a>
          <a
            href={CALL_MAILTO}
            className="rounded-lg border border-ink/15 px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-fern hover:text-fern-deep"
          >
            Book a call
          </a>
        </div>
        <p
          className="hero-enter mt-6 text-sm text-ink/55"
          style={{ "--enter-delay": "1.3s" } as CSSProperties}
        >
          Built by people who have worked inside funds.
        </p>
      </div>
    </section>
  );
}
