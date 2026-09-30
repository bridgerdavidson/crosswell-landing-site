import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONTAINER, GRID } from "@/components/Band";
import Canonical from "@/components/Canonical";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ArticleEnd from "@/components/insights/ArticleEnd";
import ArticleHeader from "@/components/insights/ArticleHeader";
import ArticleRail from "@/components/insights/ArticleRail";
import RelatedPosts from "@/components/insights/RelatedPosts";
import Takeaways from "@/components/insights/Takeaways";
import { articleJsonLd, faqJsonLd, jsonLdScript } from "@/lib/insights/jsonld";
import { getAllPosts, getPost } from "@/lib/insights/load";
import { cardPath, postPath, staticParams } from "@/lib/insights/paths";
import { relatedPosts } from "@/lib/insights/related";
import { renderBody } from "@/lib/insights/render";
import { pageMetadata } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/* every post is built at build time; any other address is the not-found page */
export const dynamicParams = false;

export function generateStaticParams() {
  return staticParams(getAllPosts().map((p) => p.slug));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadata({
    title: `${post.title} | Crosswell`,
    description: post.description,
    path: postPath(post.slug),
    article: { published: post.published, modified: post.updated, author: post.author.name, image: cardPath(post.slug) },
  });
}

/*
 * One post (spec section 6): the site's title band, the cover when there is
 * one, then the text in the left column beside the rail, then the author and
 * the call, then related posts. The body carries no scroll reveal: text
 * should not fade in while someone reads it.
 */
export default async function InsightPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const faq = faqJsonLd(post);
  return (
    <main>
      <Canonical path={postPath(post.slug)} />
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faq ? [articleJsonLd(post), faq] : [articleJsonLd(post)]) }}
      />
      <article id="insight" className={`${CONTAINER} pt-28 pb-24 sm:pt-40 sm:pb-32`}>
        <ArticleHeader post={post} />
        {post.cover && (
          <img
            src={post.cover.src}
            alt={post.cover.alt}
            className="insight-cover mt-16 aspect-[2/1] w-full rounded-2xl object-cover sm:mt-20"
          />
        )}
        <div className={`${GRID} mt-16 border-t border-ink/8 pt-12 sm:mt-20 sm:pt-14`}>
          <div className="min-w-0 max-w-[620px]">
            <Takeaways items={post.takeaways} />
            <div className={`article-body ${post.takeaways.length ? "mt-10" : ""}`}>{renderBody(post)}</div>
          </div>
          <ArticleRail post={post} />
        </div>
        <ArticleEnd post={post} />
        <RelatedPosts posts={relatedPosts(post, getAllPosts())} />
      </article>
      <Footer />
    </main>
  );
}
