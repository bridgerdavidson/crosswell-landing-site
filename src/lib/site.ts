/**
 * Single place to change contact wiring.
 * TODO: confirm the live email address with Max and Mikey before launch.
 */
export const CONTACT_EMAIL = "hello@crosswellconsulting.com";

export const WAITLIST_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Crosswell Core waitlist"
)}&body=${encodeURIComponent(
  "Hi Crosswell team,\n\nI'd like to join the waitlist for Crosswell Core.\n\nFirm:\nRole:\n"
)}`;

export const CALL_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Book a call with Crosswell"
)}&body=${encodeURIComponent(
  "Hi Crosswell team,\n\nI'd like to set up a call.\n\nFirm:\nA few times that work:\n"
)}`;
