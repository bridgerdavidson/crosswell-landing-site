import { forwardRef } from "react";
import { CORE_NOTE } from "@/lib/core-note";

// The one note, big and readable. `raw` and `sorted` layers crossfade via CSS
// (.is-sorted on the card root). Driven by the timeline in BrainField.
const NoteCard = forwardRef<HTMLDivElement>(function NoteCard(_, ref) {
  return (
    <div ref={ref} className="brain-card" aria-hidden="true">
      <div className="brain-card-raw">
        <div className="brain-card-head">
          <span className="brain-card-dot" /> {CORE_NOTE.sourceLabel}
          <span className="brain-card-badge">Capturing</span>
        </div>
        {CORE_NOTE.raw.map((line, i) => (
          <p key={i} className="brain-card-line">{line}</p>
        ))}
      </div>
      <div className="brain-card-sorted">
        <div className="brain-card-head">
          {CORE_NOTE.noteLabel}
          <span className="brain-card-badge">Sorted</span>
        </div>
        <p className="brain-card-summary">{CORE_NOTE.summary}</p>
        <p className="brain-card-context">{CORE_NOTE.context}</p>
        <div className="brain-card-tags">
          {CORE_NOTE.tags.map((t) => (
            <span key={t} className="brain-card-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
});
export default NoteCard;
