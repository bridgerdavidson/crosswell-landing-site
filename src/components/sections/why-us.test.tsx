import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { WhyUs } from "./why-us";

describe("WhyUs", () => {
  it("renders the section heading", () => {
    render(<WhyUs />);
    expect(
      screen.getByRole("heading", { level: 2, name: /we have sat on your side of the table/i }),
    ).toBeInTheDocument();
  });

  it("renders the differentiator and card copy", () => {
    render(<WhyUs />);
    expect(
      screen.getByText(/we don't translate between finance and tech\. we live in both\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/We know the workflow/i)).toBeInTheDocument();
    expect(screen.getByText(/Production systems, not slideware/i)).toBeInTheDocument();
  });

  it("renders the Book a call action as a mailto link", () => {
    render(<WhyUs />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<WhyUs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
