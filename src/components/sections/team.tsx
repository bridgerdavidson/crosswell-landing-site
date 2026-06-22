import { Section, Container, Eyebrow, Card, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

type Person = {
  name: string;
  initials: string;
  role: string;
  bio: string;
  cardClassName?: string;
};

const PEOPLE: Person[] = [
  {
    name: "Michael Zamora",
    initials: "MZ",
    role: "Business & Strategy",
    bio: "Michael owns the relationship, scopes the problem with you, and makes sure what we build actually moves the work, not just demos well.",
  },
  {
    name: "Max Marohn",
    initials: "MM",
    role: "Ex-Fund Financial Analyst",
    bio: "The reason this is different. Max spent years as a fund financial analyst, so he has sat where our clients sit: screening deal flow, working diligence, and assembling LP reporting. He speaks the workflow, so we build for it instead of guessing at it.",
    cardClassName: "border-accent-text/40",
  },
  {
    name: "Bridger Davidson",
    initials: "BD",
    role: "AI Software Engineer",
    bio: "Bridger turns the workflow into the actual tools, integrations, and automations, and ships them into how a business already operates.",
  },
];

export function Team() {
  return (
    <Section id="team" className="scroll-mt-24">
      <Container>
        <Reveal>
          <div className="max-w-[68ch]">
            <Eyebrow>Who you work with</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
              A small team that has been on your side of the table.
            </h2>
            <p className="mt-4 text-[1.1875rem] leading-[1.55] text-muted">
              Three people, not a vendor org chart. One of us spent years as a fund analyst, so the
              work is built by people who already speak deal flow, diligence, and LP reporting.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {PEOPLE.map((person) => (
            <RevealItem key={person.name}>
              <Card className={`p-6 ${person.cardClassName ?? ""}`}>
                {/* Replace with a real headshot at public/team/<name>.jpg */}
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary/10 font-serif text-xl font-semibold text-accent-text">
                  {person.initials}
                </div>
                <p className="mt-4 font-serif text-[1.375rem] font-semibold">{person.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">
                  {person.role}
                </p>
                <p className="mt-3 text-sm text-muted">{person.bio}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 flex justify-center">
          <ButtonLink variant="secondary" href="mailto:hello@crosswellconsulting.com">
            Book a call
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
