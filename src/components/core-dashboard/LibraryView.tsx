import { TagChip } from "./shared";
import { CORE_NOTE } from "@/lib/core-note";

const ROWS = [
  { title: "Ops meeting notes", date: "Mar 28" },
  { title: "Q2 investor letter draft", date: "Jun 12" },
  { title: "Committee minutes", date: "Jun 3" },
];

export function LibraryView() {
  return (
    <div className="cwd-view cwd-view-library invisible absolute inset-0 flex flex-col gap-3 p-5 sm:p-6 md:flex-row md:gap-5">
      <div className="flex flex-col gap-1 md:w-[218px] md:flex-none">
        <div className="rounded-[10px] bg-fern/20 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-semibold text-[#b5cbb5]">
              {CORE_NOTE.noteLabel}
            </p>
            <span className="text-[10px] text-ivory/40 tabular-nums">Apr 8</span>
          </div>
        </div>
        {ROWS.map((r) => (
          <div key={r.title} className="flex items-center justify-between gap-2 px-3 py-2">
            <p className="truncate text-xs text-ivory/60">{r.title}</p>
            <span className="text-[10px] text-ivory/35 tabular-nums">{r.date}</span>
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1 rounded-xl bg-[#24221c] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-ivory/90">{CORE_NOTE.noteLabel}</p>
          <span className="cwd-lib-cited rounded-full bg-fern/20 px-2 py-px text-[9.5px] font-semibold text-fern-soft">
            Cited just now
          </span>
        </div>
        <p className="relative mt-3 text-[12.5px] leading-relaxed text-ivory/85">
          <span className="cwd-lib-highlight absolute -inset-x-1 -inset-y-0.5 origin-left rounded-sm bg-fern/25" />
          <span className="relative">{CORE_NOTE.summary}</span>
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-ivory/60">
          {CORE_NOTE.context}
        </p>
        <p className="mt-3 text-[11px] text-ivory/40">{CORE_NOTE.filedLinked}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {CORE_NOTE.tags.map((t) => (
            <TagChip key={t} label={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
