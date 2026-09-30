import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inflateSync } from "node:zlib";
import { afterAll, describe, expect, it } from "vitest";
import { source } from "../helpers/post";

const out = mkdtempSync(join(tmpdir(), "cards-"));
const content = mkdtempSync(join(tmpdir(), "cards-content-"));
afterAll(() => {
  rmSync(out, { recursive: true, force: true });
  rmSync(content, { recursive: true, force: true });
});

const render = (dir: string, media?: string) =>
  spawnSync("npx", ["tsx", "scripts/insight-cards.ts"], {
    encoding: "utf8",
    env: { ...process.env, INSIGHTS_DIR: dir, ...(media ? { INSIGHTS_MEDIA_DIR: media } : {}), CARDS_OUT: out },
  });

/** a PNG's width and height, from its header */
const pngSize = (file: string) => {
  const b = readFileSync(file);
  return { png: b.subarray(1, 4).toString() === "PNG", width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
};

/** the pixels of an 8-bit RGB or RGBA PNG (what the card renderer writes) */
function decodePng(file: string) {
  const b = readFileSync(file);
  const idat: Buffer[] = [];
  let width = 0, height = 0, depth = 0, type = 0, interlace = 0;
  for (let pos = 8; pos < b.length; ) {
    const len = b.readUInt32BE(pos);
    const kind = b.toString("ascii", pos + 4, pos + 8);
    const data = b.subarray(pos + 8, pos + 8 + len);
    if (kind === "IHDR") [width, height, depth, type, interlace] = [data.readUInt32BE(0), data.readUInt32BE(4), data[8], data[9], data[12]];
    else if (kind === "IDAT") idat.push(data);
    pos += 12 + len;
  }
  if (depth !== 8 || interlace !== 0 || (type !== 2 && type !== 6)) throw new Error(`unexpected PNG: depth ${depth}, type ${type}, interlace ${interlace}`);
  const bpp = type === 6 ? 4 : 3;
  const stride = width * bpp;
  const raw = inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const row = px.subarray(y * stride, (y + 1) * stride);
    const prev = y ? px.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? row[i - bpp] : 0, up = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = src[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += up;
      else if (filter === 3) v += (a + up) >> 1;
      else if (filter === 4) {
        const p = a + up - c, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? up : c;
      }
      row[i] = v & 255;
    }
  }
  const at = (x: number, y: number) => [px[y * stride + x * bpp], px[y * stride + x * bpp + 1], px[y * stride + x * bpp + 2]];
  return { width, height, at };
}

const IVORY = [241, 238, 230];
const isInk = (p: number[]) => p[0] !== IVORY[0] || p[1] !== IVORY[1] || p[2] !== IVORY[2];

/**
 * A typographic card holds together when nothing drew inside the outer
 * frame (the padding is 72 by 80, so text that wrapped or grew past the
 * edge shows up there), the title sits in the middle band, and the author
 * line still sits in the bottom band rather than pushed off the card.
 */
function expectTypeCardFits(file: string) {
  const { width, height, at } = decodePng(file);
  expect({ width, height }).toEqual({ width: 1200, height: 630 });
  const frame: string[] = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if ((x < 40 || x >= width - 40 || y < 40 || y >= height - 40) && isInk(at(x, y))) frame.push(`${x},${y}`);
    }
  }
  expect(frame.slice(0, 5), "ink inside the outer frame").toEqual([]);
  const ink = (x0: number, x1: number, y0: number, y1: number) => {
    let n = 0;
    for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) if (isInk(at(x, y))) n++;
    return n;
  };
  expect(ink(80, 1120, 180, 470), "the title in the middle band").toBeGreaterThan(200);
  expect(ink(80, 500, 515, 565), "the author line in the bottom band").toBeGreaterThan(50);
}

describe("share cards", () => {
  it("writes a 1200 by 630 PNG for every post, cover or not", () => {
    const r = render("tests/fixtures/insights", "tests/fixtures/insights/media");
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
    expect(r.stdout).toContain(`cards: 3 written to ${out}`);
    for (const slug of ["fixture-field-notes", "fixture-bar-chart", "fixture-plain-note"]) {
      expect(pngSize(join(out, slug, "card.png"))).toEqual({ png: true, width: 1200, height: 630 });
    }
    for (const slug of ["fixture-bar-chart", "fixture-plain-note"]) expectTypeCardFits(join(out, slug, "card.png"));
  });

  it("fits a title at the 120-character cap on the typographic card", () => {
    const title = "What does a business keep after the software, the consultants, and the fashionable toolkit have all finished their work?";
    expect(title.length).toBe(120);
    writeFileSync(join(content, "long-title-post.md"), source({ title, author: "bridger" }));
    const r = render(content);
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
    expectTypeCardFits(join(out, "long-title-post", "card.png"));
  });

  it("fails with the loader's message on a broken post", () => {
    const r = render("tests/fixtures/insights-bad");
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("broken-post.md: description: is missing.");
  });
});
