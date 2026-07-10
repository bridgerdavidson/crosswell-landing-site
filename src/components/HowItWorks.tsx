import CoreDashboard from "./core-dashboard/CoreDashboard";
import Reveal from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Knowledge flows in",
    body: "Forward an email, drop a file, leave a voice note, or let the meeting bot listen. Capture happens inside the work your team already does, not as a second job.",
  },
  {
    number: "02",
    title: "Core organizes it",
    body: "Every piece gets sorted, tagged, and linked to the people, deals, and decisions it touches. No folders, no filing, no maintenance. The brain stays sharp on its own.",
  },
  {
    number: "03",
    title: "Anyone asks anything",
    body: "Plain-language questions, answers grounded in your firm's actual context, with the sources shown. A new hire can inherit the whole firm on day one.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <Reveal>
        <p className="type-kicker mb-4 text-fern-deep">How it works</p>
        <h2 className="type-h2 max-w-2xl text-ink">
          Your firm&apos;s memory, working for you.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
        {steps.map((step, i) => (
          <Reveal key={step.number} delay={i * 120}>
            <div className="flex gap-5">
              <span className="type-accent italic text-fern">{step.number}</span>
              <div>
                <h3 className="type-h3 text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {step.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16">
        <CoreDashboard />
      </div>
    </section>
  );
}
