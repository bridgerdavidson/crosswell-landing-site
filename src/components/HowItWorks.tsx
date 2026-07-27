import CoreDashboard from "./core-dashboard/CoreDashboard";
import Reveal from "./Reveal";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 pt-24 sm:pt-32">
      <Reveal>
        <p className="type-kicker mb-4 text-fern-deep">More than a chat</p>
        <h2 className="type-h2 max-w-3xl text-ink">
          You&apos;re not talking to a chatbot. You&apos;re talking to your
          firm&apos;s mind.
        </h2>
      </Reveal>

      <div className="mt-12">
        <CoreDashboard />
      </div>

      <Reveal>
        {/* mirrors the brain section's top padding below it, so the line sits
            centered in the whitespace between the two sections */}
        <p className="mt-24 text-center type-accent text-charcoal sm:mt-32">
          Behind the chat is the{" "}
          <span className="font-semibold text-fern-deep">Core</span>.
        </p>
      </Reveal>
    </section>
  );
}
