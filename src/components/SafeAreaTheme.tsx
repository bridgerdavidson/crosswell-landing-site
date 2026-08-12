"use client";

import { useEffect } from "react";

/**
 * Keeps the iOS Safari chrome (status bar, tab bar, home-indicator zone) in
 * sync with the surface touching it.
 *
 * How Safari actually picks those colors, per current behavior: iOS 26
 * dropped theme-color and derives bar colors from fixed or sticky elements
 * near the viewport edges, falling back to the body background (html is
 * ignored); older iOS still reads theme-color for the bottom bar. Critically,
 * Safari samples at moments of its own choosing rather than tracking JS
 * changes live, so any transition window can get the wrong color latched.
 *
 * The design rule here: every signal agrees within the same frame on every
 * state change, so WHENEVER Safari samples, it sees one consistent answer.
 * No timers, no fade windows.
 *
 * - meta theme-color follows the section at the bottom edge on scroll
 *   (older-iOS bottom bar), ink while the menu is open.
 * - body background flips ink/ivory with the menu, always written as
 *   explicit values (Safari ignores property removals).
 * - The overlay itself is display:none while closed (globals.css) so its
 *   ink can never be sampled behind a light page, and close is instant so
 *   no sampler can catch a half-faded ink panel.
 * - Scrolled away from the top Safari latches the tint, and only an event
 *   like a scroll re-evaluates it; close ends with a 1px instant scroll
 *   round-trip to provide that event once everything is already ivory.
 */

const IVORY = "#f1eee6";
const INK = "#1a1915";

const state = { menuOpen: false, surface: IVORY };
// last written values, so scroll-frequency repaints only touch the DOM on change
const written = { meta: "", body: "" };

function paint() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const metaColor = state.menuOpen ? INK : state.surface;
  if (meta && written.meta !== metaColor) {
    written.meta = metaColor;
    meta.content = metaColor;
  }
  const bodyColor = state.menuOpen ? INK : IVORY;
  if (written.body !== bodyColor) {
    written.body = bodyColor;
    document.body.style.backgroundColor = bodyColor;
  }
}

/** Nav flips this while the ink takeover owns the screen. */
export function setMenuInk(open: boolean) {
  state.menuOpen = open;
  paint();
  if (!open) {
    // Net movement is zero except at the exact page bottom, where the down
    // leg is a no-op and the drift is a single pixel.
    window.scrollBy({ top: 1, behavior: "instant" });
    window.scrollBy({ top: -1, behavior: "instant" });
  }
}

export default function SafeAreaTheme() {
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    // Sections are static for the life of the page, so query once. Light
    // sections have no background of their own (the body's ivory shows
    // through), so a transparent sample falls back to ivory.
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("section, footer"));
    let raf = 0;

    const sample = () => {
      raf = 0;
      if (!mobile.matches) {
        state.surface = IVORY;
        paint();
        return;
      }
      // Safari's bar sits on the bottom edge of the viewport; whatever
      // section is under that edge is the surface the chrome should match.
      const edge = window.innerHeight - 1;
      let color = IVORY;
      for (const el of blocks) {
        const r = el.getBoundingClientRect();
        if (r.top > edge || r.bottom < edge) continue;
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") color = bg;
      }
      state.surface = color;
      paint();
    };

    const queue = () => {
      if (!raf) raf = requestAnimationFrame(sample);
    };

    sample();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    mobile.addEventListener("change", queue);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      mobile.removeEventListener("change", queue);
      document.body.style.removeProperty("background-color");
      state.menuOpen = false;
      state.surface = IVORY;
      written.meta = "";
      written.body = "";
      const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (meta) meta.content = IVORY;
    };
  }, []);

  return null;
}
