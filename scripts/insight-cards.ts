// npm run cards (and the first step of npm run build): writes every post's
// share card to public/media/insights/<slug>/card.png, 1200 by 630. With a
// cover, the card is the cover cropped to fit; without one, the site's
// typographic card: ivory, the dark lockup, the title in Newsreader, the
// author under it. next/og renders it outside Next; the fonts are the
// Fontsource packages' .woff files, so no network is needed. The cards are
// git-ignored and rebuilt every build.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createElement as h, type ReactElement } from "react";
import { ImageResponse } from "next/og";
import { loadPosts, mediaRoot } from "@/lib/insights/load";
import { InsightError, type Post } from "@/lib/insights/types";

const OUT = process.env.CARDS_OUT ?? join("public", "media", "insights");
const SIZE = { width: 1200, height: 630 };

const woff = (pkg: string, file: string) => {
  const b = readFileSync(join("node_modules", "@fontsource", pkg, "files", file));
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
};
const fonts = [
  { name: "Newsreader", data: woff("newsreader", "newsreader-latin-400-normal.woff"), weight: 400 as const, style: "normal" as const },
  { name: "Instrument Sans", data: woff("instrument-sans", "instrument-sans-latin-500-normal.woff"), weight: 500 as const, style: "normal" as const },
];

const dataUrl = (file: string, type: string) => `data:${type};base64,${readFileSync(file).toString("base64")}`;
const LOCKUP = dataUrl(join("public", "xw-h-lockup-dark.svg"), "image/svg+xml");

function coverCard(post: Post, cover: NonNullable<Post["cover"]>): ReactElement {
  const type = /\.png$/i.test(cover.file) ? "image/png" : "image/jpeg";
  return h(
    "div",
    { style: { display: "flex", width: "100%", height: "100%" } },
    h("img", { src: dataUrl(join(mediaRoot(), post.slug, cover.file), type), width: 1200, height: 630, style: { objectFit: "cover" } })
  );
}

function typeCard(post: Post): ReactElement {
  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px 80px",
        background: "#f1eee6",
        color: "#1a1915",
        fontFamily: "Instrument Sans",
      },
    },
    // the lockup's viewBox is 295 by 36
    h("img", { src: LOCKUP, width: 328, height: 40 }),
    h(
      "div",
      { style: { display: "flex", fontFamily: "Newsreader", fontSize: post.title.length > 80 ? 56 : 66, lineHeight: 1.05, letterSpacing: -1.3, maxWidth: 1000 } },
      post.title
    ),
    h("div", { style: { display: "flex", fontSize: 24, color: "rgba(26,25,21,0.6)" } }, `${post.author.name} · Crosswell`)
  );
}

async function main() {
  const posts = loadPosts();
  for (const post of posts) {
    const card = post.cover ? coverCard(post, post.cover) : typeCard(post);
    const png = Buffer.from(await new ImageResponse(card, { ...SIZE, fonts }).arrayBuffer());
    mkdirSync(join(OUT, post.slug), { recursive: true });
    writeFileSync(join(OUT, post.slug, "card.png"), png);
  }
  console.log(`cards: ${posts.length} written to ${OUT}`);
}

main().catch((e) => {
  console.error(e instanceof InsightError ? e.message : e);
  process.exit(1);
});
