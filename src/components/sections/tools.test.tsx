import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Tools } from "./tools";

describe("Tools", () => {
  it("renders the section heading", () => {
    render(<Tools />);
    expect(
      screen.getByRole("heading", { level: 2, name: /five tools we built for funds/i }),
    ).toBeInTheDocument();
  });

  it("renders the five tool names", () => {
    render(<Tools />);
    expect(screen.getByText("Deal Screening Engine")).toBeInTheDocument();
    expect(screen.getByText("Diligence Document Agent")).toBeInTheDocument();
    expect(screen.getByText("Portfolio & Pipeline Dashboard")).toBeInTheDocument();
  });

  it("renders the source caption", () => {
    render(<Tools />);
    expect(
      screen.getByText(/numbers drawn from a private credit fund we work with/i),
    ).toBeInTheDocument();
  });

  it("renders the Book a call link with the mailto href", () => {
    render(<Tools />);
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Tools />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
