import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Flagship } from "./flagship";

describe("Flagship", () => {
  it("renders the section heading", () => {
    render(<Flagship />);
    expect(
      screen.getByRole("heading", { level: 2, name: /one system that runs the deal/i }),
    ).toBeInTheDocument();
  });

  it("renders the custom agents block and the Book a call action", () => {
    render(<Flagship />);
    expect(screen.getByText(/Custom Agents & Integrations/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Flagship />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
