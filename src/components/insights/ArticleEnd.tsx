import { GRID } from "../Band";
import CallLink from "../CallLink";
import Reveal from "../Reveal";
import { tie } from "../tie";
import AuthorBlock from "./AuthorBlock";
import type { Post } from "@/lib/insights/types";

/* New copy, pending Max (spec section 13). */
const LINE = "Working through this at your own business? We’re glad to talk it over.";

/* The quiet ending: the author under "Written by" in the left column, one
   line and the call in the right. No closing band; the post teaches first. */
export default function ArticleEnd({ post }: { post: Post }) {
  return (
    <Reveal className={`${GRID} mt-24 gap-y-10 border-t border-ink/8 pt-14 sm:mt-32`}>
      <AuthorBlock person={post.author} variant="end" />
      <div className="lg:pt-5">
        <p className="type-text max-w-md text-ink/80">{tie(LINE)}</p>
        <CallLink className="type-text mt-4 inline-block rounded-lg bg-fern px-6 py-3 font-semibold text-ivory shadow-whisper transition-colors hover:bg-fern-deep" />
      </div>
    </Reveal>
  );
}
