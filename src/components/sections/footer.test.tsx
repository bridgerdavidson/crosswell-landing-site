import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders the identity descriptor", () => {
    render(<Footer />);
    expect(
      screen.getByText(
        /Custom AI tools, software, and automations for businesses that want to run leaner\./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the copyright line", () => {
    render(<Footer />);
    expect(screen.getByText(/Crosswell Consulting, 2026\./i)).toBeInTheDocument();
  });

  it("links the contact email via mailto", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /hello@crosswellconsulting\.com/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("links the on-page anchors", () => {
    const { getByRole } = render(<Footer />);
    const footerNav = screen.getByRole("navigation", { name: /footer/i });

    expect(screen.getByRole("link", { name: /what we do/i })).toHaveAttribute("href", "#what-we-do");
    expect(getByRole("link", { name: /why us/i }, { within: footerNav })).toHaveAttribute("href", "#why-us");
    expect(getByRole("link", { name: /how we work/i }, { within: footerNav })).toHaveAttribute("href", "#how-we-work");
    expect(getByRole("link", { name: /book a call/i }, { within: footerNav })).toHaveAttribute("href", "#final-cta");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
