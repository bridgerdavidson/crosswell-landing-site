import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";
import { parseBody } from "@/lib/insights/markdown";

/* the fixtures' media folder holds real images: a 1600 by 800 PNG cover and
   the long read's 600 by 800 portrait PNG and 900 by 450 landscape JPEG */
const MEDIA = "tests/fixtures/insights/media";
let before: string | undefined;
beforeAll(() => {
  before = process.env.INSIGHTS_MEDIA_DIR;
  process.env.INSIGHTS_MEDIA_DIR = MEDIA;
});
afterAll(() => {
  if (before === undefined) delete process.env.INSIGHTS_MEDIA_DIR;
  else process.env.INSIGHTS_MEDIA_DIR = before;
});

const img = (slug: string, md: string) => {
  const r = parseBody(md, { slug, mediaExists: () => true });
  expect(r.problems).toEqual([]);
  let found: Element | undefined;
  visit(r.value!.body as Root, "element", (node: Element) => {
    if (node.tagName === "img") found = node;
  });
  return found!.properties;
};

describe("a body image's size", () => {
  it("reserves a PNG's space with its width and height, so the text does not jump as it loads", () => {
    expect(img("fixture-field-notes", "![A cover](cover.png)")).toMatchObject({ width: 1600, height: 800, loading: "lazy" });
    expect(img("fixture-long-read", "![A portrait](portrait.png)")).toMatchObject({ width: 600, height: 800 });
  });

  it("reads a JPEG's size from its frame header", () => {
    expect(img("fixture-long-read", "![A landscape](landscape.jpg)")).toMatchObject({ width: 900, height: 450 });
  });

  it("leaves the size off when the file cannot be read, rather than failing the post", () => {
    const p = img("fixture-long-read", "![Gone](gone.png)");
    expect(p.width).toBeUndefined();
    expect(p.height).toBeUndefined();
    expect(p.loading).toBe("lazy");
  });
});
