import Band, { CONTAINER, HANG, SEAM, SECTION } from "./Band";
import Reveal from "./Reveal";
import { tie } from "./tie";

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
    <section id="who-its-for" className={`${SEAM} ${CONTAINER} ${SECTION}`}>
      <Band
        label="Who it's for"
        title="Built for businesses that run on what they know."
        lede="Arizona first. If your business runs on knowledge and judgment, the Core fits."
        more={
          <p className="type-text mt-4 max-w-md text-ink/70">
            {tie("The platforms built for this sell multi-year enterprise contracts with no published price, no self-serve, and an implementation model that assumes an internal IT function you do not have. That gap is where we work.")}
          </p>
        }
      />
      <Reveal delay={80}>
        {/* the industries hang from the band by the section's hang, their
            rule at the hang and the row 32 under it, at the container's full
            width (at xl the six names spread from edge to edge of it); an
            accent line, roman at full ink */}
        <ul className={`type-accent ${HANG} flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/8 pt-8 text-ink xl:justify-between`}>
          {industries.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
