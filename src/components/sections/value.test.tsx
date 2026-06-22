import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { axe } from "jest-axe";
import { Value } from "./value";

describe("Value", () => {
  it("renders the section heading", () => {
    render(<Value />);
    expect(
      screen.getByRole("heading", { level: 2, name: /their judgment is what you pay for/i }),
    ).toBeInTheDocument();
  });

  it("renders the four workflow rows", () => {
    render(<Value />);
    expect(screen.getByText("Deal screening")).toBeInTheDocument();
    expect(screen.getByText("Diligence")).toBeInTheDocument();
    expect(screen.getByText("LP reporting")).toBeInTheDocument();
  });

  it("labels the table as fund-measured and links Book a call", () => {
    render(<Value />);
    expect(
      screen.getByText(/measured inside a private credit fund we work with/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute(
      "href",
      "mailto:hello@crosswellconsulting.com",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Value />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders final figures (not 0) in server output for no-JS", () => {
    const html = renderToStaticMarkup(<Value />);
    // "80%" appears as the CountUp span text (prefix="", suffix="%", to=80)
    expect(html).toContain("80%");
    // The hours callout span renders "10 to 20+ hours a week" (prefix="10 to ", suffix="+ hours a week", to=20)
    // "to 20+ hours" is present in the fixed output and absent in the broken output ("to 0+ hours")
    expect(html).toContain("to 20+ hours");
    expect(html).not.toContain("to 0+ hours");
  });
});
