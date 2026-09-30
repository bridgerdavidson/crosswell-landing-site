import AuthorBlock from "./AuthorBlock";
import ArticleOutline from "./ArticleOutline";
import { formatDate } from "@/lib/insights/dates";
import type { Post } from "@/lib/insights/types";

/* From lg, the right column beside the text, held under the nav as the
   text scrolls: the author, the dates, and the outline when the post has
   more than one section. On a screen too short for a long outline the rail
   takes the height under the nav and scrolls inside itself, so no section
   is out of reach while it is pinned (the outline keeps the current link in
   view). The scroll box would clip a focus ring at its edges, so it runs 8
   wider on each side and pads the same back. */
export default function ArticleRail({ post }: { post: Post }) {
  return (
    <aside
      data-rail
      aria-label="About this post"
      className="hidden lg:sticky lg:top-24 lg:-mx-2 lg:block lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:px-2 lg:pb-6"
    >
      <AuthorBlock person={post.author} variant="rail" />
      <p className="type-caption mt-5 text-ink/60">
        Published {formatDate(post.published)}
        {post.updated && (
          <>
            <br />
            Updated {formatDate(post.updated)}
          </>
        )}
      </p>
      {post.outline.length > 1 && <ArticleOutline items={post.outline} />}
    </aside>
  );
}
