import Band, { CONTAINER, SEAM, SECTION } from "./Band";
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
        label="Who it’s for"
        title="Built for businesses that run on what they know."
        lede="Arizona first. If your business runs on knowledge and judgment, the Core fits."
        more={
          <p className="type-text mt-4 max-w-md text-ink/70">
            {tie("The platforms built for this sell multi-year enterprise contracts with no published price, no self-serve, and an implementation model that assumes an internal IT function you do not have. That gap is where we work.")}
          </p>
        }
      />
      <Reveal delay={80}>
        {/* from lg the industries hang from the band by the section's hang,
            their rule at the hang and the row 32 under it, at the container's
            full width (at xl the six names spread from edge to edge of it); an
            accent line, roman at full ink. Below lg a wrapped row ragged and
            the hang read as a hole, so the six sit as three rows of two on
            aligned columns, a hairline above and between the rows, hanging
            64 from the band */}
        <ul className="type-accent mt-16 grid grid-cols-2 gap-x-8 border-t border-ink/8 text-ink lg:mt-48 lg:flex lg:flex-wrap lg:gap-y-3 lg:pt-8 xl:justify-between">
          {industries.map((name) => (
            <li key={name} className="border-b border-ink/8 py-4 [&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:py-0">
              {name}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
