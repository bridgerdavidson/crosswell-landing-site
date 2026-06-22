import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Problem } from "./problem";

describe("Problem", () => {
  it("renders the section heading", () => {
    render(<Problem />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /your sharpest people are buried in work a system should be doing/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and pain card copy", () => {
    render(<Problem />);
    expect(screen.getByText("The cost of busywork")).toBeInTheDocument();
    expect(screen.getByText("Data moved by hand")).toBeInTheDocument();
    expect(screen.getByText("Work that stalls on a person")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Problem />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
