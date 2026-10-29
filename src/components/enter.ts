import type { CSSProperties } from "react";

/**
 * The page's entrance, top to bottom. On a fresh load the nav drops in,
 * then the header, the subheader, and the buttons rise in turn (each
 * element carries `page-enter` and its time from here), and any other block
 * already in the first frame follows one beat after the last of them
 * (Reveal.tsx). A tab click plays the same cadence without the nav's head
 * start, since the nav is already in place (globals.css, --enter-lead).
 */
export const ENTER = { header: 0.45, sub: 0.75, buttons: 1 };

/** from the last part of the opening to the first block after it, in ms */
export const BEAT = 300;

/** one element's place in the entrance: when it rises (s), and over how long */
export const enter = (at: number, dur?: number) =>
  ({ "--enter-delay": `${at}s`, ...(dur ? { "--enter-dur": `${dur}s` } : {}) }) as CSSProperties;
