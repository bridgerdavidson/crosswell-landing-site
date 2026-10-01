import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Insights from "@/components/Insights";
import { makePost } from "../helpers/post";

const count = (html: string, re: RegExp) => html.match(re)?.length ?? 0;
/* the words without the markup: the band holds a sentence's edges in spans */
const words = (html: string) => html.replace(/<[^>]+>/g, "");

describe("the insights index", () => {
  it("holds the slot while there are no posts", () => {
    const html = renderToStaticMarkup(<Insights posts={[]} />);
    expect(words(html)).toContain("First pieces in editing now, publishing this fall.");
    expect(count(html, /<article/g)).toBe(0);
    expect(html).toMatch(/<h1[^>]*>Insights<\/h1>/);
  });

  it("features a lone post with no list under it", () => {
    const html = renderToStaticMarkup(<Insights posts={[makePost()]} />);
    expect(count(html, /data-featured/g)).toBe(1);
    expect(count(html, /data-row/g)).toBe(0);
    expect(words(html)).not.toContain("publishing this fall");
  });

  it("features the newest and lists the rest", () => {
    const posts = [makePost({ published: "2026-09-25" }), makePost({ published: "2026-09-10" }, undefined, {}, "content/insights/older-post.md")];
    const html = renderToStaticMarkup(<Insights posts={posts} />);
    expect(count(html, /data-featured/g)).toBe(1);
    expect(count(html, /data-row/g)).toBe(1);
    expect(html).toContain('href="/insights/older-post"');
  });
});
