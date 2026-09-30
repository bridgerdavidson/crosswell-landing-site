import Link from "next/link";
import { GRID } from "../Band";
import Portrait from "../Portrait";
import Reveal from "../Reveal";
import { formatDate } from "@/lib/insights/dates";
import { postPath } from "@/lib/insights/paths";
import type { Post } from "@/lib/insights/types";

/* One older post: a hairline row on the grid, title and description in the
   left column, the author and the date in the right. */
export default function PostRow({ post, delay }: { post: Post; delay: number }) {
  return (
    <li className="border-b border-ink/8">
      <Reveal delay={delay}>
        <article data-row className={`${GRID} gap-y-4 py-8`}>
          <div className="min-w-0">
            <h2 className="type-accent text-ink">
              <Link href={postPath(post.slug)} className="transition-colors hover:text-fern-deep">
                {post.title}
              </Link>
            </h2>
            <p className="type-text mt-2.5 max-w-xl text-ink/75">{post.description}</p>
          </div>
          <div className="flex items-center gap-3 lg:self-start lg:pt-1">
            <Portrait person={post.author} shape="round" className="size-8 flex-none" />
            <div>
              <p className="type-text font-semibold text-ink">{post.author.name}</p>
              <p className="type-caption text-ink/60">{formatDate(post.published)}</p>
            </div>
          </div>
        </article>
      </Reveal>
    </li>
  );
}
