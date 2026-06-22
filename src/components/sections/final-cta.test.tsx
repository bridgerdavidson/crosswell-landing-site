import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { FinalCta } from "./final-cta";

describe("FinalCta", () => {
  it("renders the closing heading", () => {
    render(<FinalCta />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /give your team back 10 to 20\+ hours a week/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and reassurance copy", () => {
    render(<FinalCta />);
    expect(screen.getByText(/start the conversation/i)).toBeInTheDocument();
    expect(
      screen.getByText(/a short call to scope the work\. no pitch deck, no obligation\./i),
    ).toBeInTheDocument();
  });

  it("links the Book a call action to the mailto address", () => {
    render(<FinalCta />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<FinalCta />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
