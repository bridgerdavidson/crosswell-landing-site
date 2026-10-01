import Link from "next/link";
import Reveal from "../Reveal";
import { formatMonth } from "@/lib/insights/dates";
import { postPath } from "@/lib/insights/paths";
import type { Post } from "@/lib/insights/types";

/* "Keep reading": up to three posts across from md, stacked below it; left
   out when there are no other posts. */
export default function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section aria-labelledby="keep-reading" className="mt-24 border-t border-ink/8 pt-14 sm:mt-32">
      <Reveal>
        <h2 id="keep-reading" className="type-label text-fern-deep">
          Keep reading
        </h2>
        <ul className="mt-6 grid gap-8 md:grid-cols-3 md:gap-6">
          {posts.map((p) => (
            <li key={p.slug} className="border-t border-ink/12 pt-5">
              <Link href={postPath(p.slug)} className="group block">
                <p className="type-accent text-ink transition-colors group-hover:text-fern-deep">{p.title}</p>
                <p className="type-text mt-2.5 text-ink/75">{p.description}</p>
                <p className="type-caption mt-3.5 text-ink/60">
                  {p.author.name} · {formatMonth(p.published)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
