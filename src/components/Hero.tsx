import { CALL_MAILTO, WAITLIST_MAILTO } from "@/lib/site";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 sm:pt-44">
      <div className="mx-auto max-w-4xl px-6 pb-20 text-center lg:pb-28">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-fern-deep">
          Crosswell Core
        </p>
        <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.5rem]">
          The operating layer for{" "}
          <span className="italic text-fern-deep">financial stewards</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
          Crosswell Core is a managed AI brain for funds and wealth managers.
          Your firm&apos;s knowledge flows in, anyone can ask it anything, and
          the busywork runs itself.
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
