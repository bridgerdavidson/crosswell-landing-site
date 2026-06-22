import { Section, Container, Eyebrow, Card, ButtonLink } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";

type Row = { workflow: string; before: string; after: React.ReactNode };

const FIGURE = "tabular-nums font-medium text-accent-text";

const ROWS: Row[] = [
  {
    workflow: "Deal screening",
    before: "Hundreds of inbounds reviewed by hand.",
    after: (
      <>
        A ranked short list, about <CountUp to={80} suffix="%" className={FIGURE} /> less time.
      </>
    ),
  },
  {
    workflow: "Diligence",
    before: "Three days reading a data room.",
    after: (
      <>
        A <CountUp to={20} suffix="-minute" className={FIGURE} /> structured review.
      </>
    ),
  },
  {
    workflow: "Memos",
    before: "Six to ten hours per deal writing.",
    after: "A drafted first pass in minutes.",
  },
  {
    workflow: "LP reporting",
    before: "A week of quarterly formatting.",
    after: "An afternoon of review.",
  },
];

export function Value() {
  return (
    <Section id="value" className="scroll-mt-24">
      <Container>
        <Reveal className="max-w-[68ch]">
          <Eyebrow>The math</Eyebrow>
          <h2 className="mt-3 font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
            Your people are expensive, and their judgment is what you pay for. We stop it going to
            manual work.
          </h2>
          <p className="mt-4 text-[1.1875rem] leading-[1.55] text-muted">
            A lean team does not have hours to spare on formatting and first drafts. Here is what
            changes when expert time stops going to the work a system should do.
          </p>
        </Reveal>

        <Reveal>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">
            Measured inside a private credit fund we work with:
          </p>
          <Card className="mt-4 p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    <th scope="col" className="p-4">Workflow</th>
                    <th scope="col" className="p-4">Before</th>
                    <th scope="col" className="p-4">After</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.workflow} className="border-b border-border align-top last:border-0">
                      <th scope="row" className="p-4 font-sans font-semibold">{row.workflow}</th>
                      <td className="p-4 text-muted">{row.before}</td>
                      <td className="p-4">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Reveal>

        <Reveal>
          <p className="mt-8 rounded-md bg-primary/10 p-5 text-[1.1875rem] leading-[1.55]">
            A system that gives a lean team back{" "}
            <CountUp to={20} prefix="10 to " suffix="+ hours a week" className={FIGURE} /> pays for
            itself in the first month, and lets them do more without hiring.
          </p>
        </Reveal>

        <div className="mt-8">
          <ButtonLink variant="secondary" href="mailto:hello@crosswellconsulting.com">
            Book a call
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
