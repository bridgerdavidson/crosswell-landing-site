import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ButtonLink } from "./button-link";

describe("ButtonLink", () => {
  it("renders an anchor with the fern primary styling by default", () => {
    render(<ButtonLink href="mailto:hello@crosswellconsulting.com">Book a call</ButtonLink>);
    const link = screen.getByRole("link", { name: "Book a call" });
    expect(link).toHaveAttribute("href", "mailto:hello@crosswellconsulting.com");
    expect(link).toHaveClass("bg-primary", "text-primary-foreground", "min-h-11");
  });

  it("applies the secondary outline variant", () => {
    render(
      <ButtonLink variant="secondary" href="#team">
        See the team
      </ButtonLink>,
    );
    expect(screen.getByRole("link")).toHaveClass("border", "border-control-border", "text-foreground");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ButtonLink href="#x">Book a call</ButtonLink>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
