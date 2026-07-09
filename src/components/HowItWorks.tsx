import ChatDemo from "./ChatDemo";
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
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-fern-deep">
          How it works
        </p>
        <h2 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          Your firm&apos;s memory, working for you.
        </h2>
      </Reveal>

      <div className="mt-16 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-10">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 120}>
              <div className="flex gap-6">
                <span className="font-serif text-2xl italic text-fern">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="lg:sticky lg:top-24">
          <ChatDemo />
        </Reveal>
      </div>
    </section>
  );
}
