import Link from "next/link";
import { GRID, HANG } from "../Band";
import Portrait from "../Portrait";
import Reveal from "../Reveal";
import { formatDate } from "@/lib/insights/dates";
import { postPath } from "@/lib/insights/paths";
import type { Post } from "@/lib/insights/types";

/* The newest post on the index's stage: on the grid, its words in the left
   column and its cover at 4:3 in the right; without a cover the words take
   the width. */
export default function PostFeatured({ post }: { post: Post }) {
  return (
    <Reveal className={HANG}>
      <article data-featured className={post.cover ? `${GRID} items-center gap-y-10` : ""}>
        <div className="min-w-0">
          <p className="type-label text-ink/60">Newest</p>
          <h2 className="type-h2 mt-3 max-w-3xl text-ink">
            <Link href={postPath(post.slug)} className="transition-colors hover:text-fern-deep">
              {post.title}
            </Link>
          </h2>
          <p className="type-text mt-4 max-w-xl text-ink/75">{post.description}</p>
          <div className="mt-6 flex items-center gap-3">
            <Portrait person={post.author} shape="round" className="size-9 flex-none" />
            <p className="type-caption text-ink/60">
              <span className="font-semibold text-ink">{post.author.name}</span> · {formatDate(post.published)}
            </p>
          </div>
        </div>
        {post.cover && (
          <Link href={postPath(post.slug)} tabIndex={-1} aria-hidden>
            <img src={post.cover.src} alt="" className="insight-cover aspect-[4/3] w-full rounded-2xl object-cover" />
          </Link>
        )}
      </article>
    </Reveal>
  );
}
