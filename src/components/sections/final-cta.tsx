import { Section, Container, Eyebrow, ButtonLink } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta() {
  return (
    <Section dark id="final-cta" className="scroll-mt-24">
      <Container className="mx-auto max-w-[42rem] text-center">
        <Reveal>
          <Eyebrow>Start the conversation</Eyebrow>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
            Give your team back 10 to 20+ hours a week.
          </h2>
          <p className="mx-auto mt-5 max-w-[68ch] text-base leading-[1.65] text-muted">
            We find what is holding your business back and build the AI that moves it forward. Start
            with one workflow, fixed scope and fixed price. Book a call and we will walk through the
            work that is costing your team the most time, and what it would take to hand it off.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink variant="primary" href="mailto:hello@crosswellconsulting.com">
              Book a call
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted">
            A short call to scope the work. No pitch deck, no obligation.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
