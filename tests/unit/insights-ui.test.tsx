import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { renderBody } from "@/lib/insights/render";
import { makePost } from "../helpers/post";

const html = (body: string) => renderToStaticMarkup(<>{renderBody(makePost({}, body))}</>);

describe("footnotes in the rendered body", () => {
  const post = html("A claim[^1] and another[^2].\n\n## A section\n\nText.\n\n[^1]: The first note.\n[^2]: The second, with [a link](https://example.com/n).");

  it("keeps the reference and its target as plain links, so they work without JavaScript", () => {
    expect(post).toContain('<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref="true"');
    expect(post).toContain('<li id="user-content-fn-1">');
    expect(post).toContain('href="#user-content-fnref-1" data-footnote-backref=""');
  });

  it("shows the notes under a visible label instead of a hidden heading", () => {
    expect(post).toContain('<h2 id="footnote-label">Footnotes</h2>');
    expect(post).not.toContain("sr-only");
  });
});

describe("tables in the rendered body", () => {
  it("sit in a box that scrolls sideways rather than pushing the page", () => {
    const post = html("| a | b |\n| --- | --- |\n| 1 | 2 |");
    expect(post).toContain('<div class="table-scroll"><table>');
  });
});
