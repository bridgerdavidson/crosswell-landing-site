"use client";

import { useEffect } from "react";

/**
 * Keeps the iOS Safari chrome (status bar, tab bar, home-indicator zone) in
 * sync with the surface touching it. Two signals drive that chrome:
 * meta[name="theme-color"] paints the bottom bar, and the page background
 * (html/body) paints the top status-bar band. This is the single runtime
 * writer for all three. On phones the meta re-samples on scroll so the
 * bottom chrome follows the page's light and dark sections; the ink menu
 * takeover overrides everything while open. Desktop never leaves ivory.
 *
 * iPhone testing pinned two Safari quirks the write path has to respect:
 * the band tracks explicit background-color values, not property removals,
 * and restoring while the fading overlay still covers the page can get the
 * ink re-sampled and stuck. So values are always written outright, and on
 * close the root holds ink until the overlay fade (0.25s) has finished.
 */

const IVORY = "#f1eee6";
const INK = "#1a1915";

const state = { menuOpen: false, surface: IVORY, htmlBand: IVORY, bodyBand: IVORY };
// last written values, so scroll-frequency repaints only touch the DOM on change
const written = { meta: "", html: "", body: "" };
let htmlTimer: ReturnType<typeof setTimeout> | undefined;

function paint() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const metaColor = state.menuOpen ? INK : state.surface;
  if (meta && written.meta !== metaColor) {
    written.meta = metaColor;
    meta.content = metaColor;
  }
  if (written.html !== state.htmlBand) {
    written.html = state.htmlBand;
    document.documentElement.style.backgroundColor = state.htmlBand;
  }
  if (written.body !== state.bodyBand) {
    written.body = state.bodyBand;
    document.body.style.backgroundColor = state.bodyBand;
  }
}

/** Nav flips this while the ink takeover owns the screen. */
export function setMenuInk(open: boolean) {
  state.menuOpen = open;
  if (htmlTimer !== undefined) {
    clearTimeout(htmlTimer);
    htmlTimer = undefined;
  }
  if (open) {
    state.htmlBand = INK;
    state.bodyBand = INK;
    paint();
    return;
  }
  // The body and meta restore right away, invisibly under the still-covering
  // overlay. The root waits out the overlay fade so Safari re-evaluates the
  // band against ivory pixels; flipping it mid-fade left the band stuck ink.
  state.bodyBand = IVORY;
  paint();
  htmlTimer = setTimeout(() => {
    htmlTimer = undefined;
    state.htmlBand = IVORY;
    paint();
  }, 300);
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
      if (htmlTimer !== undefined) {
        clearTimeout(htmlTimer);
        htmlTimer = undefined;
      }
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      mobile.removeEventListener("change", queue);
      document.documentElement.style.removeProperty("background-color");
      document.body.style.removeProperty("background-color");
      state.menuOpen = false;
      state.surface = IVORY;
      state.htmlBand = IVORY;
      state.bodyBand = IVORY;
      written.meta = "";
      written.html = "";
      written.body = "";
      const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (meta) meta.content = IVORY;
    };
  }, []);

  return null;
}
