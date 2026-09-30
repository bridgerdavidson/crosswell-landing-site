/** Someone who can appear on the site: on the team page and as a post's author. */
export type Person = {
  id: string;
  name: string;
  role: string;
  /** one factual line on what they work on at Crosswell */
  line?: string;
  /** full URL */
  linkedin?: string;
  /** the one photograph, public/team/<id>.jpg; absent until it exists */
  portrait?: string;
};

/*
 * Everyone on the site, in the team page's order. A photograph is one file,
 * public/team/<id>.jpg, named here in portrait: the team page and every
 * post's byline pick it up on the next build. Roles set by Bridger on
 * 2026-09-30.
 */
export const PEOPLE: Person[] = [
  { id: "max", name: "Max Marohn", role: "Founding partner" },
  { id: "bridger", name: "Bridger Davidson", role: "Founding partner, engineering" },
  { id: "michael", name: "Michael Zamora", role: "Founding partner" },
];
