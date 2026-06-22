import { ClipboardList, Terminal, FileCheck } from "lucide-react";
import { Section, Container, Eyebrow, Card, Icon, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const cards = [
  {
    title: "We know the workflow",
    detail:
      "Screening inbound deals, reading a data room line by line, building the IC memo, assembling the quarterly LP update. We have done these jobs, so we build for how they really run, not how a generic tool assumes they do.",
    icon: ClipboardList,
  },
  {
    title: "Production systems, not slideware",
    detail:
      "We ship working software your team uses on Monday, not a roadmap and a strategy deck. The proof is real: we are building the full AI operating layer for a private credit fund we work with.",
    icon: Terminal,
  },
  {
    title: "Fixed scope, fixed price",
    detail:
      "We start with one painful, visible workflow, agree the scope and the price up front, and deliver a tool that earns its keep. No open-ended retainer, no surprise invoice.",
    icon: FileCheck,
  },
] as const;

export function WhyUs() {
  return (
    <Section id="why-us" className="scroll-mt-24">
      <Container>
        <Reveal>
          <div className="max-w-[68ch]">
            <Eyebrow>Why Crosswell</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
              We have sat on your side of the table.
            </h2>
            <p className="mt-5 text-[1.1875rem] leading-[1.55]">
              One of our partners spent years as a fund analyst. We understand deal flow, diligence,
              the IC memo, and LP reporting from the inside, not from a deck about an industry. We
              learn a workflow before we automate it.
            </p>
            <p className="mt-6 border-l-2 border-accent-text pl-4 text-[1.1875rem] leading-[1.55]">
              We don't translate between finance and tech. We live in both. Most AI consultants can't
              say that.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <RevealItem key={card.title}>
              <Card className="p-6">
                <Icon icon={card.icon} size="md" />
                <h3 className="mt-4 font-sans text-base font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted">{card.detail}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 max-w-[68ch] text-muted">
          We learn a workflow from the inside before we build for it. That is what makes the work fit
          a fund, and what makes it fit any business we take on.
        </p>
        <div className="mt-6">
          <ButtonLink variant="link" href="mailto:hello@crosswellconsulting.com">
            Book a call
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
