import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Home from "./page";

describe("Home page", () => {
  it("renders exactly one h1", () => {
    render(<Home />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders the hero, flagship, and footer", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: /holding your business back/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /one system that runs the deal/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Crosswell Consulting, 2026\./)).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Home />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
