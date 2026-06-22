import { Repeat2, FileSearch, LineChart, Hourglass } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, Container, Eyebrow, Card, Icon } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

type Pain = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

const PAINS: Pain[] = [
  {
    title: "Data moved by hand",
    detail:
      "The same numbers get rekeyed from one tool to another, and the hours and the errors pile up.",
    icon: Repeat2,
  },
  {
    title: "Documents read line by line",
    detail:
      "Contracts, reports, and filings get read manually and slowly, with real risk of missing what matters.",
    icon: FileSearch,
  },
  {
    title: "The same reports, rebuilt every time",
    detail:
      "Recurring updates and dashboards get assembled from scratch instead of generated on demand.",
    icon: LineChart,
  },
  {
    title: "Work that stalls on a person",
    detail:
      "Multi-step processes wait on someone to push them forward, so everything moves at the speed of the busiest person.",
    icon: Hourglass,
  },
];

export function Problem() {
  return (
    <Section id="problem" className="scroll-mt-24">
      <Container>
        <Reveal>
          <Eyebrow>The cost of busywork</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
            Your sharpest people are buried in work a system should be doing.
          </h2>
          <p className="mt-6 max-w-[68ch] text-[1.1875rem] leading-[1.55] text-muted">
            Most teams run leaner than they would like. The people who cost the most and decide the
            most lose hours every week to manual work: rekeying the same data between systems,
            chasing documents, rebuilding the same reports, and assembling updates by hand.
          </p>
          <p className="mt-4 max-w-[68ch] text-[1.1875rem] leading-[1.55] text-muted">
            The cost is not only hours. It is slower decisions, missed opportunities, and your
            team's real edge, their judgment, spent on tasks that never needed a person in the first
            place.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAINS.map((pain) => (
            <RevealItem key={pain.title}>
              <Card className="p-5">
                <Icon icon={pain.icon} size="md" className="text-accent-text" />
                <h3 className="mt-4 font-sans text-base font-semibold">{pain.title}</h3>
                <p className="mt-2 text-sm text-muted">{pain.detail}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
