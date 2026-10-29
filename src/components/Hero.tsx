import CallLink from "./CallLink";
import SeeHowItWorks from "./SeeHowItWorks";
import HeroCore from "./HeroCore";
import { ENTER, enter } from "./enter";

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
          className="page-enter hero-display type-display text-ink"
          style={enter(ENTER.header, 0.95)}
        >
          The operating layer your business actually runs on.
        </h1>
        <p
          className="page-enter type-body mx-auto mt-6 max-w-3xl text-ink/70"
          style={enter(ENTER.sub)}
        >
          We build the{" "}
          <span className="font-serif italic text-fern-deep">
            workflows, automations, and agents
          </span>{" "}
          that run on it.
        </p>
        <div
          className="page-enter mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          style={enter(ENTER.buttons)}
        >
          {/* one ask: the work is consulting, custom and personal, and its
              first step is always the call, so a button that starts with the
              audit skipped step one. Beside it, for the visitor not ready to
              ask, a quiet link down the page: company for the button without
              a second ask */}
          <CallLink className="type-text rounded-lg bg-fern px-6 py-3 font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep" />
          <SeeHowItWorks />
        </div>
      </div>
    </section>
  );
}
