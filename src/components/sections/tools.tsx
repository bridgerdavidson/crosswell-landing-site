import { Inbox, FileSearch, FilePen, BarChart3, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, Container, Eyebrow, Card, Icon, ButtonLink } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

type Tool = {
  name: string;
  description: string;
  beforeAfter: { before: string; figure: string; after: string };
  icon: LucideIcon;
};

const TOOLS: Tool[] = [
  {
    name: "Deal Screening Engine",
    description:
      "Ingests inbound deals from email and CRM (Customer Relationship Management), scores them against the fund's criteria, and surfaces only the ones worth a partner's time.",
    beforeAfter: {
      before: "Before: hundreds of inbounds reviewed by hand. After: a ranked short list, roughly ",
      figure: "80%",
      after: " less screening time.",
    },
    icon: Inbox,
  },
  {
    name: "Diligence Document Agent",
    description:
      "Point it at a data room or a stack of PDFs and it extracts key terms, covenants, risks, and financials into a structured summary you can actually read.",
    beforeAfter: { before: "Before: a 3-day read. After: a ", figure: "20-minute", after: " review." },
    icon: FileSearch,
  },
  {
    name: "Memo & IC Deck Drafter",
    description:
      "Drafts first-pass investment memos and Investment Committee (IC) decks straight from the fund's data and its own template.",
    beforeAfter: {
      before: "Before: 6 to 10 hours per deal. After: a drafted first pass in ",
      figure: "minutes",
      after: ".",
    },
    icon: FilePen,
  },
  {
    name: "LP Reporting Automation",
    description:
      "Pulls portfolio numbers and auto-builds consistent, branded investor updates for the fund's Limited Partners (LPs).",
    beforeAfter: {
      before: "Before: a quarterly week of formatting. After: an ",
      figure: "afternoon",
      after: " of review.",
    },
    icon: BarChart3,
  },
  {
    name: "Portfolio & Pipeline Dashboard",
    description:
      "One live view across deals and holdings, replacing the scattered spreadsheets a team rebuilds by hand.",
    beforeAfter: { before: "Before: a day of data-pulling. After: ", figure: "real-time", after: " answers." },
    icon: LayoutDashboard,
  },
];

export function Tools() {
  return (
    <Section id="what-we-do" className="scroll-mt-24">
      <Container>
        <Reveal>
          <Eyebrow>What we build</Eyebrow>
          <h2 className="mt-3 max-w-[20ch] font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
            Five tools we built for funds, each aimed at one workflow a team dreads
          </h2>
          <p className="mt-4 max-w-[68ch] text-[1.1875rem] leading-[1.55]">
            Point solutions that drop into how a business already works. Every one replaces a
            specific manual job, and the before-and-after time is the proof.
          </p>
          <p className="mt-4 max-w-[68ch] text-base leading-[1.65] text-muted">
            Investment funds, the private equity, private credit, and family offices that run lean
            on roughly $25M to $500M+ in AUM (Assets Under Management), are where we go deepest. This
            is what that looks like there. The same approach fits whatever manual workflow is costing
            your team the most.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <RevealItem key={tool.name}>
              <Card className="flex h-full flex-col p-6">
                <Icon icon={tool.icon} size="md" className="text-accent-text" />
                <h3 className="mt-4 font-sans text-[1.375rem] font-semibold tracking-[-0.01em]">
                  {tool.name}
                </h3>
                <p className="mt-2 text-base leading-[1.65] text-muted">{tool.description}</p>
                <p className="mt-auto border-t border-border pt-4 text-sm text-muted">
                  {tool.beforeAfter.before}
                  <span className="font-medium text-accent-text">{tool.beforeAfter.figure}</span>
                  {tool.beforeAfter.after}
                </p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-6 text-sm text-muted">
          Numbers drawn from a private credit fund we work with.
        </p>
        <div className="mt-4">
          <ButtonLink variant="link" href="mailto:hello@crosswellconsulting.com">
            Book a call
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
