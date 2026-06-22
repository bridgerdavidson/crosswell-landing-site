import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { axe } from "jest-axe";
import { CountUp } from "./count-up";

function setReducedMotion(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe("CountUp", () => {
  it("renders a number with its suffix", () => {
    setReducedMotion(false);
    render(<CountUp to={80} suffix="%" />);
    expect(screen.getByText(/%$/)).toBeInTheDocument();
  });

  it("shows the final value immediately under reduced motion", async () => {
    setReducedMotion(true);
    render(<CountUp to={80} suffix="%" />);
    expect(await screen.findByText("80%")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    setReducedMotion(false);
    const { container } = render(<CountUp to={20} suffix=" min" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("shows the final value in server output for no-JS", () => {
    const html = renderToStaticMarkup(<CountUp to={80} suffix="%" />);
    expect(html).toContain("80%");
  });
});
