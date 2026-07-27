/**
 * Single place to change contact wiring.
 * All CTAs are mailto links until the scheduler is picked (Max owns the pick);
 * per the messaging handoff, a mailto button says "Set up a call", never
 * "Book a call".
 */
export const CONTACT_EMAIL = "hello@crosswellconsulting.com";

export const AUDIT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Start with the audit"
)}&body=${encodeURIComponent(
  "Hi Crosswell team,\n\nWe'd like to start with the two-week knowledge audit.\n\nFirm:\nRole:\n"
)}`;

export const CALL_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Set up a call with Crosswell"
)}&body=${encodeURIComponent(
  "Hi Crosswell team,\n\nI'd like to set up a call.\n\nFirm:\nA few times that work:\n"
)}`;
