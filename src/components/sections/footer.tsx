import { Container, Eyebrow, TextLink } from "@/components/ui";

const pageLinks = [
  { label: "What we do", href: "#what-we-do" },
  { label: "Why us", href: "#why-us" },
  { label: "How we work", href: "#how-we-work" },
  { label: "Book a call", href: "#final-cta" },
];

export function Footer() {
  return (
    <footer data-section="dark" className="bg-bg text-foreground">
      <Container className="py-16">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <img src="/xw_logo_light.svg" alt="Crosswell Consulting" className="h-7 w-auto" />
            <p className="mt-4 max-w-[32ch] text-sm text-muted">
              Custom AI tools, software, and automations for businesses that want to run leaner.
            </p>
            <TextLink href="mailto:hello@crosswellconsulting.com" className="mt-4 block">
              hello@crosswellconsulting.com
            </TextLink>
          </div>
          <nav aria-label="Footer">
            <Eyebrow>On this page</Eyebrow>
            <ul className="mt-4 space-y-2 text-sm">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-sm text-muted">
          Crosswell Consulting, 2026.
        </div>
      </Container>
    </footer>
  );
}
