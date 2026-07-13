import CoreDashboard from "./core-dashboard/CoreDashboard";
import Reveal from "./Reveal";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
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
        <p className="mt-16 text-center type-accent text-charcoal">
          Behind the chat is the{" "}
          <span className="font-semibold text-fern-deep">Core</span>.
        </p>
      </Reveal>
    </section>
  );
}
