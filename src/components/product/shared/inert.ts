/**
 * Props for a demo control that does nothing yet: presentation only, out of
 * the tab order and the accessibility tree, so no visitor lands on a dead
 * end. A chapter's own interaction replaces these when it lands.
 */
export const inert = { tabIndex: -1, "aria-hidden": true } as const;
