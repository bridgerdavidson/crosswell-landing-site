import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { niceStep } from "@/components/insights/Chart";
import { renderBody } from "@/lib/insights/render";
import { makePost } from "../helpers/post";

const BODY = [
  "Opening with [a source](https://example.com) and [the team](/team).",
  "## Why it's here",
  "```chart\ntype: line\ntitle: Notes per week\nunit: \"%\"\nsource: Test\nsourceUrl: https://example.com/s\ndata:\n  W1: 12\n  W2: 31\n```",
  '![A chart of notes](notes.png "Notes per week")',
  "A double hyphen -- stays.",
  "## Frequently asked questions",
  "### Is it real?",
  "No.",
].join("\n\n");

const html = renderToStaticMarkup(<>{renderBody(makePost({}, BODY))}</>);

describe("the rendered body", () => {
  it("draws the chart twice, wide and narrow, with its source", () => {
    expect(html.match(/<svg /g)).toHaveLength(2);
    expect(html).toContain('<figure class="chart">');
    expect(html).toContain('aria-label="Notes per week: W1, 12%; W2, 31%"');
    expect(html).toContain('Source: <a href="https://example.com/s" target="_blank" rel="noopener noreferrer">Test</a>');
  });

  it("renders the FAQ as rows", () => {
    expect(html).toMatch(/<div class="faq"><div class="faq-item"><h3 id="is-it-real">Is it real\?<\/h3><p>No\.<\/p><\/div><\/div>/);
  });

  it("renders a captioned image from the media folder", () => {
    expect(html).toContain('<img src="/media/insights/a-test-post/notes.png" alt="A chart of notes" loading="lazy"/>');
    expect(html).toContain("<figcaption>Notes per week</figcaption>");
  });

  it("keeps heading ids, safe outside links, and curled text, and never an em dash", () => {
    expect(html).toContain('<h2 id="why-its-here">Why it’s here</h2>');
    expect(html).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer">a source</a>');
    expect(html).toContain('<a href="/team">the team</a>');
    expect(html).not.toContain("\u2014");
  });
});

describe("chart scales", () => {
  it("steps the gridlines on round numbers", () => {
    expect([niceStep(50), niceStep(31), niceStep(12), niceStep(100), niceStep(0)]).toEqual([15, 8, 3, 25, 1]);
  });
});
