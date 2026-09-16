import type { Metadata } from "next";

/** the site's origin, title, and description, shared by every page's head */
export const SITE = "https://crosswellconsulting.com";
export const SITE_TITLE = "Crosswell | The operating layer your business actually runs on";
/* New copy, pending Max (spec section 12, item 7). */
export const SITE_DESCRIPTION =
  "Crosswell builds custom agentic AI around how your team actually works. The Core is the memory and operating layer your business runs on, and the workflows, automations, and agents we build run on it. Arizona.";

/**
 * A page's metadata: its title in the tab, its description, and Open Graph
 * and Twitter cards that name its own URL. The canonical link is not here:
 * Next's resolver drops the root's trailing slash, so each page renders
 * its own (components/Canonical.tsx).
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = `${SITE}${path}`;
  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      siteName: "Crosswell Consulting",
      title,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Crosswell" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
  };
}

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
  "Hi Crosswell team,\n\nWe’d like to start with the two-week knowledge audit.\n\nFirm:\nRole:\n"
)}`;

export const CALL_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Set up a call with Crosswell"
)}&body=${encodeURIComponent(
  "Hi Crosswell team,\n\nI’d like to set up a call.\n\nFirm:\nA few times that work:\n"
)}`;
