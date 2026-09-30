import { describe, expect, it } from "vitest";
import { articleJsonLd, faqJsonLd, jsonLdScript } from "@/lib/insights/jsonld";
import { pageMetadata } from "@/lib/site";
import { makePost } from "../helpers/post";

const FAQ_BODY = "Text.\n\n## Frequently asked questions\n\n### Is it real?\n\nNo.";

describe("structured data", () => {
  it("describes the article, its author, and its share card", () => {
    const post = makePost({ author: "sam", updated: "2026-09-25" });
    expect(articleJsonLd(post)).toEqual({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "A test post",
      description: "A line for the card.",
      datePublished: "2026-09-20",
      dateModified: "2026-09-25",
      author: { "@type": "Person", name: "Sam Tester", url: "https://www.linkedin.com/in/example" },
      publisher: {
        "@type": "Organization",
        name: "Crosswell Consulting",
        url: "https://crosswellconsulting.com",
        logo: { "@type": "ImageObject", url: "https://crosswellconsulting.com/xw-h-lockup-dark.svg" },
      },
      image: "https://crosswellconsulting.com/media/insights/a-test-post/card.png",
      mainEntityOfPage: "https://crosswellconsulting.com/insights/a-test-post",
    });
  });

  it("leaves out the author's url without LinkedIn and dates the change from published", () => {
    const data = articleJsonLd(makePost());
    expect(data.author).toEqual({ "@type": "Person", name: "Max Marohn" });
    expect(data.dateModified).toBe("2026-09-20");
  });

  it("builds FAQPage from the same questions the page shows, and nothing without an FAQ", () => {
    expect(faqJsonLd(makePost({}, FAQ_BODY))).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "Is it real?", acceptedAnswer: { "@type": "Answer", text: "No." } }],
    });
    expect(faqJsonLd(makePost())).toBeNull();
  });

  it("can never close its script tag early", () => {
    expect(jsonLdScript({ headline: "</script><script>alert(1)" })).not.toContain("<");
  });
});

describe("article metadata", () => {
  const meta = pageMetadata({
    title: "A test post | Crosswell",
    description: "A line for the card.",
    path: "/insights/a-test-post",
    article: { published: "2026-09-20", modified: "2026-09-25", author: "Max Marohn", image: "/media/insights/a-test-post/card.png" },
  });

  it("is an article with its own card, in Open Graph and on X", () => {
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.type).toBe("article");
    expect(og.publishedTime).toBe("2026-09-20");
    expect(og.modifiedTime).toBe("2026-09-25");
    expect(og.authors).toEqual(["Max Marohn"]);
    expect(og.images).toEqual([{ url: "/media/insights/a-test-post/card.png", width: 1200, height: 630, alt: "A test post | Crosswell" }]);
    expect((meta.twitter as Record<string, unknown>).images).toEqual(["/media/insights/a-test-post/card.png"]);
  });

  it("never names the site-wide share image", () => {
    expect(JSON.stringify(meta)).not.toContain("og-image.jpg");
  });

  it("leaves every other page as it was", () => {
    const page = pageMetadata({ title: "Team | Crosswell", description: "x", path: "/team" });
    expect((page.openGraph as Record<string, unknown>).type).toBe("website");
    expect(JSON.stringify(page)).toContain("/og-image.jpg");
  });
});
