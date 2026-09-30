import AuthorBlock from "./AuthorBlock";
import ArticleOutline from "./ArticleOutline";
import { formatDate } from "@/lib/insights/dates";
import type { Post } from "@/lib/insights/types";

/* From lg, the right column beside the text, held under the nav as the
   text scrolls: the author, the dates, and the outline when the post has
   more than one section. */
export default function ArticleRail({ post }: { post: Post }) {
  return (
    <aside data-rail aria-label="About this post" className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
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
