import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { HowWeWork } from "./how-we-work";

describe("HowWeWork", () => {
  it("renders the section heading", () => {
    render(<HowWeWork />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /we start with one workflow, not a year-long contract/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the three step titles and the fixed-scope detail", () => {
    render(<HowWeWork />);
    expect(screen.getByText("Find the pain")).toBeInTheDocument();
    expect(screen.getByText("Build and prove it")).toBeInTheDocument();
    expect(screen.getByText("Expand")).toBeInTheDocument();
    expect(screen.getByText("Fixed scope, fixed price")).toBeInTheDocument();
  });

  it("exposes a Book a call mailto action", () => {
    render(<HowWeWork />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<HowWeWork />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
