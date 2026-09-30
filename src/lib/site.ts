import type { Metadata } from "next";

/** the site's origin, title, and description, shared by every page's head */
export const SITE = "https://crosswellconsulting.com";
export const SITE_TITLE = "Crosswell | The operating layer your business actually runs on";
/* New copy, pending Max (spec section 12, item 7). */
export const SITE_DESCRIPTION =
  "Crosswell builds custom agentic AI around how your team actually works. The Core is the memory and operating layer your business runs on, and the workflows, automations, and agents we build run on it. Arizona.";

/** a post's Open Graph extras; its image is the post's own share card */
type ArticleMeta = { published: string; modified?: string; author: string; image: string };

/**
 * A page's metadata: its title in the tab, its description, and Open Graph
 * and Twitter cards that name its own URL. The canonical link is not here:
 * Next's resolver drops the root's trailing slash, so each page renders
 * its own (components/Canonical.tsx). A post passes `article`: its type is
 * article, and its own card replaces the site-wide og-image.jpg in both
 * cards (a page that sets no twitter images inherits the site's).
 */
export function pageMetadata({
  title,
  description,
  path,
  article,
}: {
  title: string;
  description: string;
  path: string;
  article?: ArticleMeta;
}): Metadata {
  const url = `${SITE}${path}`;
  if (article) {
    return {
      title,
      description,
      openGraph: {
        type: "article",
        url,
        siteName: "Crosswell Consulting",
        title,
        description,
        publishedTime: article.published,
        modifiedTime: article.modified ?? article.published,
        authors: [article.author],
        images: [{ url: article.image, width: 1200, height: 630, alt: title }],
      },
      twitter: { card: "summary_large_image", title, description, images: [article.image] },
    };
  }
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
 * Every call to action is the one call, a mailto link until the scheduler
 * is picked (Max owns the pick); per the messaging handoff, the button says
 * "Set up a call", never "Book a call". The work is consulting, custom and
 * personal, and its first step is always the call, so there is no second
 * ask (the audit button skipped step one and is gone).
 */
export const CONTACT_EMAIL = "hello@crosswellconsulting.com";

export const CALL_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Set up a call with Crosswell"
)}&body=${encodeURIComponent(
  "Hi Crosswell team,\n\nI’d like to set up a call.\n\nFirm:\nA few times that work:\n"
)}`;
