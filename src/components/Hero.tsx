import { CALL_MAILTO, WAITLIST_MAILTO } from "@/lib/site";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden pt-16"
    >
      <div
        aria-hidden
        className="hero-core-mask pointer-events-none absolute inset-0"
      >
        <div className="hero-core">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero-core.jpg" alt="" />
        </div>
      </div>
      <div
        aria-hidden
        className="hero-core-veil pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory"
      />
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-fern-deep">
          Crosswell Core
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
          The operating layer for{" "}
          <span className="italic text-fern-deep">financial stewards</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
          Crosswell Core is your firm&apos;s institutional memory, built on AI
          and managed for you. Knowledge flows in, anyone can ask it anything,
          and the busywork runs itself. Everything we build next stands on it.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
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
        <p className="mt-6 text-sm text-ink/55">
          Built by people who have worked inside funds.
        </p>
      </div>
    </section>
  );
}
