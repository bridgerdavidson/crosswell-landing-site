import { Search, Wrench, TrendingUp, type LucideIcon } from "lucide-react";
import { Section, Container, Eyebrow, Card, ButtonLink, Icon } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

type Step = {
  numeral: string;
  title: string;
  detail: React.ReactNode;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    numeral: "01",
    title: "Find the pain",
    detail:
      "We start by identifying one painful, visible workflow, the task quietly costing your team the most hours.",
    icon: Search,
  },
  {
    numeral: "02",
    title: "Build and prove it",
    detail: (
      <>
        <span className="font-medium text-accent-text">Fixed scope, fixed price</span>. We deliver a
        working tool that handles the workflow, so you can measure the time saved against exactly
        what you paid.
      </>
    ),
    icon: Wrench,
  },
  {
    numeral: "03",
    title: "Expand",
    detail:
      "Once your team sees the time saved, we build out from there, one proven workflow at a time.",
    icon: TrendingUp,
  },
];

export function HowWeWork() {
  return (
    <Section id="how-we-work" className="scroll-mt-24">
      <Container>
        <Reveal>
          <div className="max-w-[68ch]">
            <Eyebrow>How we work</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
              We start with one workflow, not a year-long contract.
            </h2>
            <p className="mt-4 text-[1.1875rem] leading-[1.55] text-muted">
              Hiring an outside firm is a real decision. We make the first one small: you see a
              working tool and the hours it gives back on a single workflow before there is any talk
              of expanding.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <RevealItem key={step.numeral}>
              <Card className="p-6">
                <p className="font-serif text-[2rem] font-semibold text-accent-text">
                  {step.numeral}
                </p>
                <Icon icon={step.icon} size="md" className="mt-2 text-accent-text" />
                <h3 className="mt-2 font-serif text-[1.375rem] font-semibold tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{step.detail}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 text-muted">
          No long contract to start. Tell us the workflow that is costing you the most, and we will
          scope the first build.{" "}
          <ButtonLink variant="link" href="mailto:hello@crosswellconsulting.com">
            Book a call
          </ButtonLink>
        </p>
      </Container>
    </Section>
  );
}
