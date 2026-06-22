import "@testing-library/jest-dom/vitest";
import { expect, beforeAll } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom does not implement these. Motion (useReducedMotion, whileInView, useInView)
// and Lenis need them. The IntersectionObserver stub reports "intersecting"
// immediately so reveal and in-view logic resolves deterministically in tests.
beforeAll(() => {
  if (typeof window.matchMedia !== "function") {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }

  class MockIntersectionObserver {
    constructor(private cb: IntersectionObserverCallback) {}
    observe(target: Element) {
      this.cb(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
  window.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
  globalThis.ResizeObserver =
    MockResizeObserver as unknown as typeof ResizeObserver;
  window.ResizeObserver =
    MockResizeObserver as unknown as typeof ResizeObserver;
});
