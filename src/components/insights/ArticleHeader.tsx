import Link from "next/link";
import Band from "../Band";
import ArticleByline from "./ArticleByline";
import type { Post } from "@/lib/insights/types";

/* A post's title band: the site's own band, the title as the page's one h1
   and the description as its lede, the label back to the index. Below lg
   the byline follows, since the rail that carries the author there is
   hidden. */
export default function ArticleHeader({ post }: { post: Post }) {
  return (
    <div>
      <Band
        label={
          /* phones: negative margins cancel the padding in layout, so the
             thumb's target comes free without moving the label */
          <Link href="/insights" className="transition-colors hover:text-fern max-md:-m-3 max-md:inline-block max-md:p-3">
            Insights
          </Link>
        }
        title={post.title}
        titleAs="h1"
        lede={post.description}
      />
      <ArticleByline post={post} />
    </div>
  );
}
