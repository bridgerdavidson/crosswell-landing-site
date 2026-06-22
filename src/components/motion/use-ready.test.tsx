import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "react";
import { useReady } from "./use-ready";

function Probe() {
  return <span>{useReady() ? "ready" : "not-ready"}</span>;
}

describe("useReady", () => {
  // Asserts useReady's contract: false in SSR, true after the client hydrates.
  // The earlier tests only checked the SSR snapshot and a client-only render and
  // never exercised the hydration transition. NOTE: jsdom flips both the
  // useEffect and the useSyncExternalStore implementations correctly, so this
  // does NOT reproduce the production failure (a useSyncExternalStore snapshot
  // that never flipped under Next.js static prerender + React 19). It guards the
  // intended contract; the authoritative check is a real browser.
  it("is false on the server and flips to true after hydration", async () => {
    const ssrHtml = renderToString(<Probe />);
    expect(ssrHtml).toContain("not-ready"); // SSR/no-JS: hidden state stays out

    const container = document.createElement("div");
    container.innerHTML = ssrHtml;
    document.body.appendChild(container);

    await act(async () => {
      hydrateRoot(container, <Probe />);
    });

    // The whole point: after the client hydrates, ready must be true.
    expect(container.textContent).toBe("ready");
  });
});
