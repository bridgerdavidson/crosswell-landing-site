/*
 * The one slug that can never be a post (a slug is lowercase letters,
 * digits, and hyphens). A static export refuses a dynamic route with no
 * params, so with zero posts the route builds this one, and its page is
 * the not-found page (spec section 5).
 */
export const NO_POSTS = "_none";

export const postPath = (slug: string) => `/insights/${slug}`;
export const mediaPath = (slug: string, file: string) => `/media/insights/${slug}/${file}`;
export const cardPath = (slug: string) => mediaPath(slug, "card.png");

/** the [slug] route's params: one per post, or the placeholder */
export function staticParams(slugs: string[]): { slug: string }[] {
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: NO_POSTS }];
}
