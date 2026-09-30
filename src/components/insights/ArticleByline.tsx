import Portrait from "../Portrait";
import { formatDate } from "@/lib/insights/dates";
import type { Post } from "@/lib/insights/types";

/* below lg, where the rail is hidden: the author and the date under the title */
export default function ArticleByline({ post }: { post: Post }) {
  return (
    <div data-byline className="mt-8 flex items-center gap-3 lg:hidden">
      <Portrait person={post.author} shape="round" className="size-9 flex-none" />
      <p className="type-caption text-ink/60">
        <span className="font-semibold text-ink">{post.author.name}</span> · {formatDate(post.published)}
      </p>
    </div>
  );
}
