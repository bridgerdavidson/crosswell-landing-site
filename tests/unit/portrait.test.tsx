import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Team from "@/components/Team";
import AuthorBlock from "@/components/insights/AuthorBlock";
import { PEOPLE, type Person } from "@/lib/people";

const photographed: Person = {
  id: "sam",
  name: "Sam Tester",
  role: "Tester",
  line: "Writes the tests.",
  linkedin: "https://www.linkedin.com/in/example",
  portrait: "/team/sam.jpg",
};
const withAvatar: Person = { ...photographed, avatar: "/team/sam-avatar.jpg" };
const unphotographed: Person = { id: "ria", name: "Ria Tester", role: "Tester" };

/** every portrait <img> tag in a piece of markup */
const portraitImgs = (html: string) =>
  [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0]).filter((tag) => tag.includes("data-portrait"));
const src = (tag: string) => tag.match(/src="([^"]+)"/)?.[1];

describe("portraits", () => {
  it("shows the same photograph on the team page and in a post's author block", () => {
    const team = portraitImgs(renderToStaticMarkup(<Team people={[photographed]} />));
    const end = portraitImgs(renderToStaticMarkup(<AuthorBlock person={photographed} variant="end" />));
    const rail = portraitImgs(renderToStaticMarkup(<AuthorBlock person={photographed} variant="rail" />));
    expect(team.map(src)).toEqual(["/team/sam.jpg"]);
    expect(end.map(src)).toEqual(["/team/sam.jpg"]);
    expect(rail.map(src)).toEqual(["/team/sam.jpg"]);
  });

  it("shows the author's square crop in the round photo when there is one, and the portrait on the team page", () => {
    const team = portraitImgs(renderToStaticMarkup(<Team people={[withAvatar]} />));
    const end = portraitImgs(renderToStaticMarkup(<AuthorBlock person={withAvatar} variant="end" />));
    const rail = portraitImgs(renderToStaticMarkup(<AuthorBlock person={withAvatar} variant="rail" />));
    expect(team.map(src)).toEqual(["/team/sam.jpg"]);
    expect(end.map(src)).toEqual(["/team/sam-avatar.jpg"]);
    expect(rail.map(src)).toEqual(["/team/sam-avatar.jpg"]);
    // the square crop is already framed on the face, so it is not shifted
    expect(end[0]).toContain("rounded-full");
    expect(end[0]).not.toContain("object-[50%_30%]");
  });

  it("crops the author's photograph round and keeps the team's frame", () => {
    const [team] = portraitImgs(renderToStaticMarkup(<Team people={[photographed]} />));
    const [author] = portraitImgs(renderToStaticMarkup(<AuthorBlock person={photographed} variant="end" />));
    expect(author).toContain("rounded-full");
    expect(author).toContain("object-[50%_30%]");
    expect(team).not.toContain("rounded-full");
    expect(team).toContain("aspect-4/5");
  });

  it("draws the placeholder in both places until a photograph exists", () => {
    for (const html of [
      renderToStaticMarkup(<Team people={[unphotographed]} />),
      renderToStaticMarkup(<AuthorBlock person={unphotographed} variant="rail" />),
    ]) {
      expect(portraitImgs(html)).toEqual([]);
      expect(html).toMatch(/<div[^>]*data-portrait/);
    }
  });

  it("links LinkedIn only when the person has it", () => {
    expect(renderToStaticMarkup(<AuthorBlock person={photographed} variant="end" />)).toContain(
      'href="https://www.linkedin.com/in/example"'
    );
    expect(renderToStaticMarkup(<AuthorBlock person={unphotographed} variant="end" />)).not.toContain("LinkedIn");
  });

  it("lists the team in the people file's order", () => {
    const html = renderToStaticMarkup(<Team />);
    const names = [...html.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map((m) => m[1]);
    expect(names).toEqual(PEOPLE.map((p) => p.name));
  });
});
