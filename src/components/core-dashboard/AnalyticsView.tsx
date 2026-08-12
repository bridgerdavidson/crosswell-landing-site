const STATS = [
  { label: "Meetings captured", value: 41, sub: "" },
  { label: "Decisions logged", value: 12, sub: "" },
  { label: "Open items", value: 7, sub: "3 owners" },
];

const AREAS = [
  { label: "Deals", value: 18, height: "100%" },
  { label: "Investors", value: 9, height: "50%" },
  { label: "Operations", value: 14, height: "78%" },
];

export function AnalyticsView() {
  return (
    <div className="cwd-view cwd-view-analytics invisible absolute inset-0 flex flex-col p-5 sm:p-6">
      <p className="text-sm font-semibold text-ivory/90">June report</p>
      <p className="mt-0.5 text-[11px] text-ivory/45">
        Compiled from meetings, notes, and documents.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2 min-[400px]:grid-cols-3 sm:gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="cwd-stat-tile rounded-xl bg-[#24221c] px-3 py-3">
            <p className="text-[19px] font-semibold leading-none tabular-nums sm:text-[22px]">
              <span className="cwd-stat" data-count={s.value}>
                {s.value}
              </span>
            </p>
            <p className="mt-1.5 text-[10.5px] leading-tight text-ivory/50">
              {s.label}
              {s.sub ? <span className="text-ivory/35"> · {s.sub}</span> : null}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 max-w-[360px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ivory/40">
          Activity by area
        </p>
        <div className="mt-2.5 flex items-end gap-4">
          {AREAS.map((a) => (
            <div key={a.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-[72px] w-full items-end">
                <div
                  style={{ height: a.height }}
                  className="cwd-report-bar w-full origin-bottom rounded-t-[3px] bg-fern-soft/80"
                />
              </div>
              <p className="whitespace-nowrap text-[9px] text-ivory/50 min-[400px]:text-[10px]">
                {a.label} <span className="text-ivory/35 tabular-nums">{a.value}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
