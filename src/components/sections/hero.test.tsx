import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the single H1", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /holding your business back/i }),
    ).toBeInTheDocument();
  });

  it("renders the primary and secondary actions", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
    expect(screen.getByRole("link", { name: /see what we build/i })).toHaveAttribute(
      "href",
      "#what-we-do",
    );
  });

  it("renders the unnamed fund proof line", () => {
    render(<Hero />);
    expect(screen.getByText(/live private credit fund/i)).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Hero />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
