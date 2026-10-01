import type { Post } from "./types";

/**
 * The posts under "Keep reading": the post's own related list when it has
 * one, otherwise the newest other posts. Never the post itself, at most
 * three. `all` is newest first, as getAllPosts returns it.
 */
export function relatedPosts(post: Post, all: Post[]): Post[] {
  if (post.related.length) {
    return post.related.map((slug) => all.find((p) => p.slug === slug)).filter((p): p is Post => !!p);
  }
  return all.filter((p) => p.slug !== post.slug).slice(0, 3);
}
