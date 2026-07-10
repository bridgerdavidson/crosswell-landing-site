import { IconCheck, TagChip } from "./shared";
import { CORE_NOTE } from "@/lib/core-note";

const SOURCES = [
  { label: "Meeting bot · in today's ops meeting", live: true },
  { label: "Email · watching forwarded mail", live: false },
  { label: "Files · synced", live: false },
];

export function AddView() {
  return (
    <div className="cwd-view cwd-view-add invisible absolute inset-0 flex flex-col p-5 sm:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ivory/40">
        Connected sources
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {SOURCES.map((s) => (
          <span
            key={s.label}
            className="flex items-center gap-1.5 rounded-full bg-[#24221c] px-3 py-1.5 text-[11px] font-medium text-ivory/70"
          >
            <span
              className={`h-1.5 w-1.5 flex-none rounded-full ${
                s.live ? "cwd-live-dot bg-fern-soft" : "bg-ivory/25"
              }`}
            />
            {s.label}
          </span>
        ))}
      </div>

      <div className="cwd-feed mt-5 max-w-[480px] rounded-xl bg-[#24221c] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-ivory/90">
            {CORE_NOTE.sourceLabel}
          </p>
          <span className="flex-none rounded-full bg-fern/20 px-2 py-px text-[9.5px] font-semibold text-fern-soft">
            Ingested automatically
          </span>
        </div>
        <p className="cwd-feed-reading invisible mt-2 text-[11px] text-ivory/45 opacity-0">
          Reading…
        </p>
        <div className="cwd-feed-tags mt-2 flex flex-wrap gap-1">
          {CORE_NOTE.tags.map((t) => (
            <TagChip key={t} label={t} />
          ))}
        </div>
        <div className="cwd-feed-filed mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-fern-soft">
          <IconCheck />
          Filed
          <span className="ml-2 font-medium text-ivory/45 tabular-nums">
            <span className="cwd-brain-count">1,204</span> notes in the brain
          </span>
        </div>
      </div>

      <p className="mt-auto pt-4 text-[11px] text-ivory/40">
        Drop files or paste notes for anything the bots can&apos;t catch.
      </p>
    </div>
  );
}
