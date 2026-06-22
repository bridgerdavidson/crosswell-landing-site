import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

describe("Reveal", () => {
  it("renders the wrapped content", () => {
    render(
      <Reveal>
        <p>Revealed copy</p>
      </Reveal>,
    );
    expect(screen.getByText("Revealed copy")).toBeInTheDocument();
  });

  it("renders all grouped items", () => {
    render(
      <RevealGroup>
        <RevealItem>
          <span>One</span>
        </RevealItem>
        <RevealItem>
          <span>Two</span>
        </RevealItem>
      </RevealGroup>,
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Reveal>
        <p>Accessible content</p>
      </Reveal>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  // Regression for the "nothing animates" bug. The no-JS gate is
  // `initial={ready ? hidden : false}`, and `useReady` only flips to true in a
  // post-mount effect. Framer Motion reads `initial` exactly once, at mount, so the
  // hidden start state is never committed unless the element REMOUNTS when animation
  // turns on. Without a remount the entrance animates from the already-visible state
  // to the visible state (a no-op) and nothing moves. With animation enabled and the
  // element held out of view, the wrapper must therefore sit at its hidden start
  // (opacity:0), armed to reveal. This fails on the un-remounted gate and passes once
  // the gate forces a fresh mount.
  it("commits its hidden initial state once animation is enabled (out-of-view)", () => {
    const prevIO = globalThis.IntersectionObserver;
    class NeverIntersect {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [] as IntersectionObserverEntry[];
      }
    }
    globalThis.IntersectionObserver = NeverIntersect as unknown as typeof IntersectionObserver;
    window.IntersectionObserver = NeverIntersect as unknown as typeof IntersectionObserver;
    try {
      const { container } = render(
        <Reveal>
          <p>Reveal me</p>
        </Reveal>,
      );
      // useReady's post-mount effect has already run (RTL flushes effects), so
      // animation is enabled. The motion wrapper must be at its hidden start, not
      // already visible.
      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveStyle({ opacity: "0" });
    } finally {
      globalThis.IntersectionObserver = prevIO;
      window.IntersectionObserver = prevIO;
    }
  });
});
