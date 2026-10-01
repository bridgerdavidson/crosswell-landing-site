import type { Person } from "@/lib/people";

type Shape = "frame" | "round";

/**
 * A person's photograph, as named in lib/people.ts, everywhere the site shows
 * them: the 4:5 portrait in the team page's frame, and the round author photo
 * from the square crop framed on the face (or, without one, from the portrait,
 * focused on its upper third). Until the photograph exists it draws the team
 * page's placeholder.
 * The caller sets the size. The name always sits beside it, so the image is
 * decorative (empty alt). A plain img: the static export serves images
 * unoptimized anyway, and it renders in unit tests.
 */
export default function Portrait({
  person,
  shape,
  className = "",
}: {
  person: Person;
  shape: Shape;
  className?: string;
}) {
  const round = shape === "round";
  // the round photo prefers the square crop framed on the face; cut from the
  // 4:5 portrait instead, it focuses on the upper third, where the face sits
  const src = round ? person.avatar ?? person.portrait : person.portrait;
  const focus = round && !person.avatar ? "object-[50%_30%]" : "";
  if (!src) {
    return <div data-portrait aria-hidden className={`${round ? "rounded-full" : ""} border border-warmgray/40 bg-warmgray/25 ${className}`} />;
  }
  return <img data-portrait src={src} alt="" className={`${round ? "rounded-full" : ""} object-cover ${focus} ${className}`} />;
}
