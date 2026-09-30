import { SITE } from "@/lib/site";
import { cardPath, postPath } from "./paths";
import type { Post } from "./types";

/** schema.org Article for one post (spec section 9) */
export function articleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    author: { "@type": "Person", name: post.author.name, ...(post.author.linkedin ? { url: post.author.linkedin } : {}) },
    publisher: {
      "@type": "Organization",
      name: "Crosswell Consulting",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/xw-h-lockup-dark.svg` },
    },
    image: `${SITE}${cardPath(post.slug)}`,
    mainEntityOfPage: `${SITE}${postPath(post.slug)}`,
  };
}

/** schema.org FAQPage from the same parse as the visible FAQ, or null when the post has none */
export function faqJsonLd(post: Post) {
  if (!post.faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

/** JSON for a script tag: a "<" in a post's text can never close the tag early */
export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
