import Reveal from "./Reveal";

const team = [
  {
    name: "Max Marohn",
    role: "Business & Strategy",
    line: "Runs operations inside a private lending fund. Finds the problem, owns the relationship, and speaks fund fluently because he lives there.",
  },
  {
    name: "Bridger Davidson",
    role: "Software & Engineering",
    line: "Builds Core and everything that runs on it: the tools, the integrations, the automations. The engineering arm of the operation.",
  },
  {
    name: "Michael Zamora",
    role: "Finance & Fund Operations",
    line: "Fund and family-office finance. Knows deal flow, investor reporting, and how a fund actually runs from the inside.",
  },
];

export default function Team() {
  return (
    <section id="team" className="border-t border-ink/8 bg-parchment">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Reveal>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-fern-deep">
            The team
          </p>
          <h2 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            Three people. Both worlds.
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-ink/70">
            Crosswell lives in finance and technology at the same time. That is
            the whole point.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {team.map((person, i) => (
            <Reveal key={person.name} delay={i * 120}>
              <div className="flex h-full flex-col rounded-2xl border border-warmgray/40 bg-ivory p-7 shadow-whisper">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-fern font-serif text-lg italic text-ivory">
                  {person.name.charAt(0)}
                </span>
                <h3 className="text-lg font-semibold text-ink">{person.name}</h3>
                <p className="mt-0.5 text-sm font-medium text-fern-deep">
                  {person.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {person.line}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
