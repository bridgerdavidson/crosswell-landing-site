import Reveal from "./Reveal";

const industries = [
  "Manufacturing",
  "Healthcare",
  "Logistics",
  "Professional services",
  "Construction",
  "Private credit",
];

export default function WhoItsFor() {
  return (
    <section id="who-its-for" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <Reveal>
        <p className="type-label text-fern-deep">Who it&apos;s for</p>
        <h2 className="type-h2 mt-3 max-w-3xl text-ink">
          Built for businesses that run on what they know.
        </h2>
        <p className="type-body mt-5 max-w-2xl text-ink/80">
          Arizona first. If your business runs on knowledge and judgment, the
          Core fits.
        </p>
        <p className="type-text mt-4 max-w-2xl text-ink/70">
          The platforms built for this sell multi-year enterprise contracts with
          no published price, no self-serve, and an implementation model that
          assumes an internal IT function you do not have. That gap is where we
          work.
        </p>
      </Reveal>
      <Reveal delay={80}>
        <ul className="type-accent mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/8 pt-8 text-ink/80">
          {industries.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
