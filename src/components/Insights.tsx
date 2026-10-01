import Band, { CONTAINER } from "./Band";
import PostFeatured from "./insights/PostFeatured";
import PostRow from "./insights/PostRow";
import type { Post } from "@/lib/insights/types";

/* While there are no posts: the held slot, as it has stood since September. */
const HELD = "What we are learning building company memory for teams that run on what they know. First pieces in editing now, publishing this fall.";
/* New copy, pending Max (spec section 13): the lede once posts exist. */
const LEDE = "What we are learning building company memory for teams that run on what they know.";

/* The insights index: the band, then the newest post featured, then every
   older post as a row, newest first. */
export default function Insights({ posts }: { posts: Post[] }) {
  const [newest, ...older] = posts;
  return (
    <section id="insights" className={`${CONTAINER} pt-28 pb-24 sm:pt-40 sm:pb-32`}>
      <Band label="From the desk" title="Insights" titleAs="h1" lede={posts.length ? LEDE : HELD} />
      {newest && <PostFeatured post={newest} />}
      {older.length > 0 && (
        <ul className="mt-24 border-t border-ink/8 sm:mt-32">
          {older.map((post, i) => (
            <PostRow key={post.slug} post={post} delay={i * 80} />
          ))}
        </ul>
      )}
    </section>
  );
}
