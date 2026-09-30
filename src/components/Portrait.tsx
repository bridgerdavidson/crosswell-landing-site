import type { Person } from "@/lib/people";

type Shape = "frame" | "round";

/**
 * A person's photograph, the one file named in lib/people.ts, everywhere the
 * site shows them: the team page's 4:5 frame, and a round crop for a post's
 * author, focused on the upper third of the 4:5 photograph, where the face
 * sits. Until the photograph exists it draws the team page's placeholder.
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
  const round = shape === "round" ? "rounded-full" : "";
  if (!person.portrait) {
    return <div data-portrait aria-hidden className={`${round} border border-warmgray/40 bg-warmgray/25 ${className}`} />;
  }
  return (
    <img
      data-portrait
      src={person.portrait}
      alt=""
      className={`${round} object-cover ${shape === "round" ? "object-[50%_30%]" : ""} ${className}`}
    />
  );
}
