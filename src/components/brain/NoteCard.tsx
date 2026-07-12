import { forwardRef } from "react";
import { CORE_NOTE } from "@/lib/core-note";

// The one note, big and readable. The header identity persists while the body
// transforms: raw transcript reads (phrases highlight in sequence), then the
// tags fly to the row and the sorted summary resolves in. All opacities and the
// phrase `.hot` class are driven by the clock in BrainField.
const NoteCard = forwardRef<HTMLDivElement>(function NoteCard(_, ref) {
  return (
    <div ref={ref} className="brain-card" aria-hidden="true">
      {/* content fades out as one unit while the shell collapses into the node */}
      <div className="brain-card-inner" data-inner>
        <div className="brain-card-head">
          <span className="brain-card-dot" />
          <span className="brain-card-title">{CORE_NOTE.sourceLabel.split(" · ")[0]}</span>
          <span className="brain-card-badge" data-badge>
            Capturing
          </span>
        </div>
        <div className="brain-card-body">
          <div className="brain-card-raw" data-raw>
            <p className="brain-card-line">
              ...so on wires, <span className="brain-ph" data-p="0">anything over 250 we said two sign offs</span>, a
              managing partner and ops, no exceptions...
            </p>
            <p className="brain-card-line">
              ...right, after the <span className="brain-ph" data-p="1">March</span> thing with the mistyped account
              number. <span className="brain-ph" data-p="2">document the reasoning</span> so it sticks.
            </p>
          </div>
          <div className="brain-card-sorted" data-sorted>
            <p className="brain-card-summary">{CORE_NOTE.summary}</p>
            <p className="brain-card-context">{CORE_NOTE.context}</p>
          </div>
          <div className="brain-card-tags" data-tags>
            {CORE_NOTE.tags.map((t) => (
              <span key={t} className="brain-card-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
export default NoteCard;
