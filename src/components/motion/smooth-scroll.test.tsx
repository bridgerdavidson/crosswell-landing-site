import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SmoothScroll } from "./smooth-scroll";

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

describe("SmoothScroll", () => {
  it("renders children with momentum scroll enabled", () => {
    setReducedMotion(false);
    render(
      <SmoothScroll>
        <p>Page content</p>
      </SmoothScroll>,
    );
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders children directly under reduced motion", () => {
    setReducedMotion(true);
    render(
      <SmoothScroll>
        <p>Reduced content</p>
      </SmoothScroll>,
    );
    expect(screen.getByText("Reduced content")).toBeInTheDocument();
  });
});
