import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Team } from "./team";

describe("Team", () => {
  it("renders the section heading", () => {
    render(<Team />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /a small team that has been on your side of the table/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders each team member and their distinguishing copy", () => {
    render(<Team />);
    expect(screen.getByText("Michael Zamora")).toBeInTheDocument();
    expect(screen.getByText("Max Marohn")).toBeInTheDocument();
    expect(screen.getByText("Bridger Davidson")).toBeInTheDocument();
    expect(screen.getByText(/spent years as a fund financial analyst/i)).toBeInTheDocument();
    expect(screen.getByText(/Three people, not a vendor org chart/i)).toBeInTheDocument();
  });

  it("exposes a Book a call action", () => {
    render(<Team />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Team />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
