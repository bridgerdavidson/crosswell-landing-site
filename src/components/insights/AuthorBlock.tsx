import type { Person } from "@/lib/people";
import Portrait from "../Portrait";

/**
 * A post's author: round portrait, name, role in fern-deep, the one line,
 * and LinkedIn. The rail carries the small one beside the text; the end of
 * the post carries the larger one under "Written by", the name in the serif
 * accent.
 */
export default function AuthorBlock({ person, variant }: { person: Person; variant: "rail" | "end" }) {
  const end = variant === "end";
  return (
    <div className={`flex items-start ${end ? "gap-5" : "gap-3.5"}`}>
      <Portrait person={person} shape="round" className={`flex-none ${end ? "size-[72px]" : "size-12"}`} />
      <div className="min-w-0">
        {end && <p className="type-label text-ink/60">Written by</p>}
        <p className={end ? "type-accent mt-1 text-ink" : "type-text font-semibold text-ink"}>{person.name}</p>
        <p className="type-label text-fern-deep">{person.role}</p>
        {(person.line || person.linkedin) && (
          <p className="type-caption mt-2 max-w-sm text-ink/60">
            {person.line}
            {person.line && person.linkedin && " "}
            {person.linkedin && (
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fern-deep underline decoration-fern-deep/35 underline-offset-2 hover:decoration-current"
              >
                LinkedIn
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
