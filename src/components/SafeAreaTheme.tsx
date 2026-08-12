"use client";

import { useEffect } from "react";

/**
 * Keeps the iOS Safari chrome (status bar, tab bar, home-indicator zone) in
 * sync with the surface touching it. Safari paints its expanded chrome with
 * meta[name="theme-color"], which Next renders once from the root viewport
 * export; this is the single runtime writer for that tag. On phones it
 * re-samples on scroll so the chrome follows the page's light and dark
 * sections, and the ink menu takeover overrides everything while open.
 * Desktop never leaves the static ivory base.
 */

const IVORY = "#f1eee6";
const INK = "#1a1915";

const state = { menuOpen: false, surface: IVORY };

function apply() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = state.menuOpen ? INK : state.surface;
  // theme-color only drives Safari's bottom chrome on iPhone; the top
  // status-bar band is painted from the page background. While the ink
  // takeover covers the screen, flip the root and body backgrounds with it
  // so that band goes ink too, and hand back to the stylesheet's ivory on
  // close. Nothing on the page itself can show these while the overlay is up.
  const root = document.documentElement;
  if (state.menuOpen) {
    root.style.backgroundColor = INK;
    document.body.style.backgroundColor = INK;
  } else {
    root.style.removeProperty("background-color");
    document.body.style.removeProperty("background-color");
  }
}

/** Nav flips this while the ink takeover owns the screen. */
export function setMenuInk(open: boolean) {
  state.menuOpen = open;
  apply();
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
        apply();
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
      apply();
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
      state.surface = IVORY;
      apply();
    };
  }, []);

  return null;
}
