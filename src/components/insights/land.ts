/* where an in-page link lands its target: under the scrolled nav's 64,
   with 24 to spare */
export const LAND = 88;

/**
 * Take the reader to an element the way the nav does: scroll it to just
 * under the nav, writing no hash to the URL (Safari jumps back to a
 * persistent hash on every reload), and move focus to it, so a keyboard or
 * screen-reader user lands in the section and not back where the link was.
 * A target that cannot take focus (a heading, a list item) is given
 * tabindex -1 first.
 */
export function landOn(el: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - LAND, behavior: reduce ? "auto" : "smooth" });
  if (!el.hasAttribute("tabindex") && !(el instanceof HTMLAnchorElement)) el.tabIndex = -1;
  el.focus({ preventScroll: true });
}
