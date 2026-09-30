import Band, { CONTAINER, HANG } from "./Band";
import Portrait from "./Portrait";
import Reveal from "./Reveal";
import { PEOPLE, type Person } from "@/lib/people";

/* Names and roles only. The bios came out in September 2026 and are not
   coming back. The people, their roles, and their photographs come from
   lib/people.ts, the file every post's author block reads, so a role or a
   photograph changes in one place. Roles are placeholders until they are
   decided, and each portrait is a 4:5 placeholder until its photograph
   exists. */

/**
 * The team. The page opens on it, under the nav with no seam above it (the
 * nav's 80 plus 32, or 80 from sm, before the label), and the values follow
 * with the page's seam. The band, then from md the three people across on
 * the values' three column lines below them (432 wide at 1440, 24 apart):
 * each a 4:5 portrait at most 360 wide from the column's left edge, so the
 * portraits sit 96 apart at 1440 and the names start on the values' lines;
 * the name in the serif accent under it, the role in the body size, fern
 * deep. Below md a hairline row per person, a 96-wide portrait beside the
 * name and role, so a phone reads the whole team in one screen. No cards
 * (the team's were the page's last) and no bios.
 */
export default function Team({ people = PEOPLE }: { people?: Person[] }) {
  return (
    <section id="team" className={`${CONTAINER} pt-28 pb-24 sm:pt-40 sm:pb-32`}>
      <Band
        label="The team"
        title="The people you’ll work with."
        lede="You work directly with the people who build and run your Core. Nobody stands between you and the work."
      />
      <ul className={`${HANG} border-t border-ink/8 md:grid md:grid-cols-3 md:gap-x-6 md:border-t-0`}>
        {people.map((person, i) => (
          <li key={person.id} className="border-b border-ink/8 py-5 md:border-b-0 md:py-0">
            <Reveal delay={i * 80} className="flex items-center gap-5 md:block">
              {/* the photograph, or its 4:5 placeholder until it exists */}
              <Portrait
                person={person}
                shape="frame"
                className="aspect-4/5 w-24 flex-none rounded-xl md:w-full md:max-w-[360px] md:rounded-2xl"
              />
              <div className="md:mt-5">
                <h3 className="type-accent text-ink">{person.name}</h3>
                <p className="type-text mt-1 font-medium text-fern-deep">{person.role}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
