import { Search } from "lucide-react";
import {
  Container,
  Section,
  Eyebrow,
  Button,
  TextLink,
  Input,
  Icon,
  Card,
} from "@/components/ui";

function Showcase() {
  return (
    <Container className="flex flex-col gap-10">
      <div>
        <Eyebrow>Type scale</Eyebrow>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
          Judgment is your edge
        </h1>
        <h2 className="font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold tracking-[-0.01em]">
          What we build for funds
        </h2>
        <h3 className="font-sans text-[1.375rem] font-semibold tracking-[-0.01em]">
          Deal Screening Engine
        </h3>
        <p className="text-[1.1875rem] leading-[1.55]">
          Lead paragraph. Software and automations that take manual work off
          your team.
        </p>
        <p className="text-base leading-[1.65] text-muted max-w-[68ch]">
          Body. Funds run lean. The people whose judgment is your edge spend
          their days on manual work.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button>Book a call</Button>
        <Button variant="secondary">See the tools</Button>
        <Button variant="link">Learn more</Button>
        <TextLink href="#">An inline link</TextLink>
      </div>

      <Card className="max-w-sm p-5">
        <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon icon={Search} size="sm" />
        </span>
        <h3 className="font-sans text-base font-semibold">Ranked, not piled</h3>
        <p className="mt-1 text-sm text-muted">
          Hundreds of inbound deals become a short list.
        </p>
      </Card>

      <div className="max-w-sm">
        <Input label="Work email" placeholder="you@fund.com" helperText="We never share this." />
      </div>
    </Container>
  );
}

export default function StyleguidePage() {
  return (
    <main>
      <Section>
        <Showcase />
      </Section>
      <Section dark>
        <Showcase />
      </Section>
    </main>
  );
}
