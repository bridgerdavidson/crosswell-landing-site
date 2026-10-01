/** Someone who can appear on the site: on the team page and as a post's author. */
export type Person = {
  id: string;
  name: string;
  role: string;
  /** one factual line on what they work on at Crosswell */
  line?: string;
  /** full URL */
  linkedin?: string;
  /** the team page's 4:5 photograph, public/team/<id>.jpg; absent until it exists */
  portrait?: string;
  /** the round author photo: a square crop of the same photograph framed
      tighter on the face, public/team/<id>-avatar.jpg; without it the round
      photo is cut from the portrait */
  avatar?: string;
};

/*
 * Everyone on the site, in the team page's order. Each photograph is two
 * files cut from the same picture with the same framing for all three: the
 * team page's 4:5 portrait (public/team/<id>.jpg, 720 by 900, the face a
 * third of the frame's height with the eyes 36% down) and the round author
 * photo (public/team/<id>-avatar.jpg, 288 square, tighter on the face). The
 * team page and every post's byline pick them up on the next build. Roles
 * set by Bridger on 2026-09-30.
 */
export const PEOPLE: Person[] = [
  {
    id: "max",
    name: "Max Marohn",
    role: "Founding partner",
    portrait: "/team/max.jpg",
    avatar: "/team/max-avatar.jpg",
  },
  {
    id: "bridger",
    name: "Bridger Davidson",
    role: "Founding partner, engineering",
    portrait: "/team/bridger.jpg",
    avatar: "/team/bridger-avatar.jpg",
  },
  {
    id: "michael",
    name: "Michael Zamora",
    role: "Founding partner",
    portrait: "/team/michael.jpg",
    avatar: "/team/michael-avatar.jpg",
  },
];
