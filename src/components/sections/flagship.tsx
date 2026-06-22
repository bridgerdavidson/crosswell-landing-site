import { Section, Container, Eyebrow, Card, ButtonLink } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";
import { AgentFlow } from "./agent-flow";

export function Flagship() {
  return (
    <Section dark id="flagship" className="scroll-mt-24">
      <Container>
        <Reveal className="mx-auto max-w-[48rem] text-center">
          <Eyebrow>The Fund Operating System</Eyebrow>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
            One system that runs the deal, not five tools that each do a piece of it
          </h2>
          <p className="mt-5 text-[1.1875rem] leading-[1.55] text-muted">
            The tools above each fix one job. The Fund Operating System connects them into agentic
            systems, software that runs multi-step work on its own, so a deal hits the inbox and the
            team gets a decision-ready package back without lifting a finger.
          </p>
        </Reveal>

        <AgentFlow />

        <Reveal className="mx-auto mt-12 max-w-[48rem] text-center">
          <p className="font-serif text-[1.375rem] leading-[1.4]">
            It collapses a multi-day, multi-person workflow into hours, and frees the team to do the
            one thing only people can: decide.
          </p>
        </Reveal>

        <div className="mt-12">
          <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-sans text-[1.375rem] font-semibold tracking-[-0.01em]">
                Custom Agents & Integrations
              </h3>
              <p className="mt-2 max-w-[60ch] text-muted">
                When the workflow eating your week is specific to your business, we build bespoke
                agents wired into your existing stack: CRM, email, data providers, and accounting. We
                start with whatever costs the most time.
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-12 flex justify-center">
          <ButtonLink href="mailto:hello@crosswellconsulting.com">Book a call</ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
