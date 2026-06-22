import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Nav } from "./nav";

describe("Nav", () => {
  it("renders the wordmark and the primary links", () => {
    render(<Nav />);
    expect(screen.getByAltText("Crosswell Consulting")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "What we do" })).toHaveAttribute("href", "#what-we-do");
  });

  it("links Book a call to the mailto address", () => {
    render(<Nav />);
    const ctas = screen.getAllByRole("link", { name: /book a call/i });
    expect(ctas[0]).toHaveAttribute("href", "mailto:hello@crosswellconsulting.com");
  });

  it("toggles the mobile menu", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Nav />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
