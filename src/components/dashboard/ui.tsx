import type { CSSProperties, ReactNode } from "react";

/*
 * The dashboard's shell and parts, shared by the prototype pages and the
 * site's chapters: one app window at a real laptop size (1440 by 900 by
 * default), drawn flat.
 *
 * The system, so every page is built from the same few decisions:
 * - One family in the product (Instrument Sans). Sizes 11, 12, 13, 14, 22;
 *   weights 400, 500, 600. 13 is the working size, as in most tools.
 * - Three text tones: ink, ink at 62 (secondary, still AA at 12), ink at 45
 *   (placeholders and quiet meta only).
 * - A 4 point grid. Rows are 36 (one line) or 52 (two lines).
 * - Radii 6 for controls and cards, 12 for the window. No shadows,
 *   gradients, fades, rings, or tinted rows.
 * - The accent only where a decision or a state lives: the one button
 *   that commits something, progress, the selected card, a running dot.
 *   Everything else is ink.
 * - The page title sits in the top bar with the page's own controls, so
 *   no page opens on a title, a sentence about itself, and a button.
 */

export type Theme = {
  company: string;
  initial: string;
  /** the company's own mark for the rail; without one the rail shows its initial */
  mark?: string;
  user: { name: string; initials: string; greeting: string };
  accent: string;
  accentDeep: string;
  accentSoft: string;
  accentWash: string;
};

const PATHS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  agenda: "M3.5 6.5 5 8l2.5-2.5M3.5 12.5 5 14l2.5-2.5M3.5 18.5 5 20l2.5-2.5M11 7h10M11 13h10M11 19h10",
  pipeline: "M4 4h4v14H4zM10 4h4v9h-4zM16 4h4v16h-4z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  files: "M3 6h6l2 2h10v11H3z",
  /* a loop: work that runs again and again on its own, not a robot */
  agents: "M17 2.5l3.5 3.5L17 9.5M3.5 11V10a4 4 0 0 1 4-4h13M7 21.5 3.5 18 7 14.5M20.5 13v1a4 4 0 0 1-4 4h-13",
  settings: "M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5",
  bell: "M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
  plus: "M12 5v14M5 12h14",
  filter: "M4 6h16M7 12h10M10 18h4",
  check: "M5 12.5 9.5 17 19 7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2",
  file: "M6 3h8l4 4v14H6zM14 3v4h4",
  clip: "M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8",
  at: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1",
  up: "M12 19V5M6 11l6-6 6 6",
  compose: "M12 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z",
  history: "M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 4v4.5H8M12 7.5V12l3 2",
  panel: "M4 4h16v16H4zM15 4v16",
  chat: "M4 5h16v11H9.5L5 19.5V16H4z",
  close: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  spin: "M12 3.5a8.5 8.5 0 1 0 8.5 8.5",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  sync: "M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4",
  chevron: "M9 6l6 6-6 6",
  back: "M15 6l-6 6 6 6",
  board: "M4 5h4v14H4zM10 5h4v14h-4zM16 5h4v14h-4z",
  orders: "M9 3.5h6v3H9zM7.5 5H5v15.5h14V5h-2.5M8.5 11.5h7M8.5 15.5h5",
  truck: "M2.5 5.5h11v10h-11zM13.5 9h4l3 3.5v3h-7M5 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0M15 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0",
  inventory: "M12 3 20 7.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  people: "M15.5 20v-1a4 4 0 0 0-4-4h-5a4 4 0 0 0-4 4v1M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21.5 20v-1a4 4 0 0 0-3-3.9M15.5 4.1a3.5 3.5 0 0 1 0 6.8",
  clients: "M3.5 7.5h17v12h-17zM9 7.5V5h6v2.5M3.5 12.5h17",
  deadlines: "M5.5 21V3.5M5.5 4h12l-2.5 4 2.5 4h-12",
  billing: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3",
  list: "M4 6h16M4 12h16M4 18h16",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 16, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-none ${className}`}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/* ---------- the window ---------- */

/* a business's own pages: the rail is built per company, like everything under it */
export type Page = { key: string; label: string; icon: IconName };

export const LENDER_PAGES: Page[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "agenda", label: "Agenda", icon: "agenda" },
  { key: "pipeline", label: "Pipeline", icon: "pipeline" },
  { key: "calendar", label: "Calendar", icon: "calendar" },
  { key: "files", label: "Files", icon: "files" },
  { key: "agents", label: "Agents", icon: "agents" },
];

export function AppWindow({
  theme,
  pages = LENDER_PAGES,
  active,
  title,
  controls,
  actions,
  main,
  core,
  draft,
  mainClassName = "",
  size = "h-[900px] w-[1440px]",
}: {
  /** half-typed text in the Core's message box */
  draft?: string;
  /** a class on the page's content, e.g. the chapter's fade into the app's ground */
  mainClassName?: string;
  /** what the Core's column holds; empty unless a chapter shows it at work */
  core?: ReactNode;
  /** the window's box; the site's chapters size it to their frame */
  size?: string;
  theme: Theme;
  /** the business's pages, in rail order */
  pages?: Page[];
  active: string;
  /** the page's title in the top bar; defaults to the rail's label */
  title?: string;
  /** the page's own view controls, beside the title */
  controls?: ReactNode;
  /** at most one action for the page, before search */
  actions?: ReactNode;
  main: ReactNode;
}) {
  const vars = {
    "--accent": theme.accent,
    "--accent-deep": theme.accentDeep,
    "--accent-soft": theme.accentSoft,
    "--accent-wash": theme.accentWash,
  } as CSSProperties;

  return (
    <div
      className={`flex ${size} overflow-hidden rounded-xl bg-chrome font-sans text-[13px] text-ink antialiased`}
      style={vars}
    >
      <Rail theme={theme} pages={pages} active={active} />
      <div className="flex min-w-0 flex-1 flex-col border-l border-ink/8 bg-parchment">
        <div className="flex h-12 flex-none items-center gap-3 border-b border-ink/8 pr-4 pl-7">
          <p className="text-[14px] font-semibold">{title ?? pages.find((n) => n.key === active)!.label}</p>
          {controls && <div className="ml-2 flex items-center gap-1">{controls}</div>}
          <div className="ml-auto flex items-center gap-2">
            {actions}
            <span className="flex h-7 w-[200px] items-center gap-2 rounded-md border border-ink/10 px-2 text-ink/45">
              <Icon name="search" size={14} />
              Search
              <kbd className="ml-auto font-sans text-[11px] text-ink/45">⌘K</kbd>
            </span>
            <span className="relative flex h-7 w-7 items-center justify-center text-ink/62">
              <Icon name="bell" size={16} />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </span>
          </div>
        </div>
        {/* static: a chapter shows the page, it never scrolls inside the frame */}
        <div className={`min-h-0 flex-1 overflow-hidden ${mainClassName}`}>{main}</div>
      </div>
      <CorePanel draft={draft}>{core}</CorePanel>
    </div>
  );
}

function Rail({ theme, pages, active }: { theme: Theme; pages: Page[]; active: string }) {
  return (
    <nav aria-label="Pages" className="flex w-14 flex-none flex-col items-center pt-3 pb-4">
      {theme.mark ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={theme.mark} alt={theme.company} width={32} height={32} className="h-8 w-8" />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] font-serif text-[17px] leading-none text-ivory">
          {theme.initial}
        </span>
      )}
      <div className="mt-5 flex flex-col gap-1">
        {pages.map((n) => {
          const on = n.key === active;
          return (
            <span
              key={n.key}
              title={n.label}
              aria-label={n.label}
              aria-current={on ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                on ? "bg-[var(--accent-wash)] text-[var(--accent-deep)]" : "text-ink/50"
              }`}
            >
              <Icon name={n.icon} size={18} />
            </span>
          );
        })}
      </div>
      <div className="mt-auto flex flex-col items-center gap-3">
        <span title="Settings" aria-label="Settings" className="flex h-9 w-9 items-center justify-center text-ink/50">
          <Icon name="settings" size={18} />
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 bg-parchment text-[11px] font-semibold text-ink/70">
          {theme.user.initials}
        </span>
      </div>
    </nav>
  );
}

/* the Core's column: empty until a chapter shows it at work */
function CorePanel({ children, draft }: { children?: ReactNode; draft?: string }) {
  return (
    <aside className="flex w-[384px] flex-none flex-col border-l border-ink/8 bg-chrome">
      <div className="flex h-12 flex-none items-center border-b border-ink/8 pr-3 pl-5">
        <p className="text-[14px] font-semibold">The Core</p>
        <div className="ml-auto flex items-center text-ink/50">
          {(["compose", "history", "panel"] as const).map((i) => (
            <span key={i} className="flex h-7 w-7 items-center justify-center">
              <Icon name={i} size={16} />
            </span>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-5 py-5">
        <div className="flex flex-col gap-4">{children}</div>
      </div>
      <div className="flex-none p-3">
        <div className="rounded-lg border border-ink/12 bg-parchment">
          {draft ? (
            <p className="px-3 pt-2.5 pb-6">
              {draft}
              <span aria-hidden className="ml-px inline-block h-[15px] w-[1.5px] translate-y-[3px] bg-ink" />
            </p>
          ) : (
            <p className="px-3 pt-2.5 pb-6 text-ink/45">Ask the Core, or tell it what to do</p>
          )}
          <div className="flex items-center px-1.5 pb-1.5 text-ink/45">
            <span className="flex h-7 w-7 items-center justify-center">
              <Icon name="clip" size={15} />
            </span>
            <span className="flex h-7 w-7 items-center justify-center">
              <Icon name="at" size={15} />
            </span>
            <span
              className={`ml-auto flex h-7 w-7 items-center justify-center rounded-md ${
                draft ? "bg-[var(--accent)] text-ivory" : "bg-ink/8 text-ink/45"
              }`}
            >
              <Icon name="up" size={14} />
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------- parts ---------- */

/* the Core's side of a conversation: the person's question on the accent's
   wash, the Core's answer as plain text, and where it came from */
export function Exchange({ question, answer, receipts, time }: { question: string; answer: string; receipts: string[]; time?: string }) {
  const who = (name: string) =>
    time && (
      <p className="mb-1.5 text-[11px]">
        <span className="font-medium text-ink/70">{name}</span>
        <span className="ml-1.5 tabular-nums text-ink/45">{time}</span>
      </p>
    );
  return (
    <>
      <div className="flex flex-col items-end">
        {who("You")}
        <p className="max-w-[85%] rounded-xl rounded-br-sm bg-[var(--accent-wash)] px-3 py-2 leading-[1.5] [text-wrap:balance]">
          {question}
        </p>
      </div>
      <div>
        {who("The Core")}
        <p className="leading-[1.6] text-ink/85 [text-wrap:pretty]">{answer}</p>
        <div className="mt-2.5">
          <Sources items={receipts} />
        </div>
      </div>
    </>
  );
}

/* a section's label: the working size, weight doing the work, a count in the
   secondary tone. Plain text, not a heading: the window sits inside the
   site's chapters, whose own headings carry the page's outline */
export function Label({ children, count, aside, className = "" }: { children: ReactNode; count?: number | string; aside?: ReactNode; className?: string }) {
  return (
    <div className={`flex h-8 items-center gap-2 ${className}`}>
      <p className="font-semibold">{children}</p>
      {count !== undefined && <span className="tabular-nums text-ink/62">{count}</span>}
      {aside && <div className="ml-auto text-[12px] text-ink/62">{aside}</div>}
    </div>
  );
}

/* the one button that commits something: accent; everything else is quiet */
export function Button({ children, icon, commit = false }: { children: ReactNode; icon?: IconName; commit?: boolean }) {
  return (
    <span
      className={`inline-flex h-7 flex-none items-center gap-1.5 rounded-md px-2.5 text-[12px] font-semibold ${
        commit ? "bg-[var(--accent)] text-ivory" : "border border-ink/12 text-ink/80"
      }`}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

/* a segmented view switch in the top bar */
export function Views({ items, active }: { items: { label: string; icon?: IconName }[]; active: string }) {
  return (
    <span className="inline-flex h-7 items-center rounded-md border border-ink/10 p-0.5">
      {items.map((v) => (
        <span
          key={v.label}
          className={`inline-flex h-full items-center gap-1.5 rounded px-2 text-[12px] font-medium ${
            v.label === active ? "bg-ink/6 text-ink" : "text-ink/62"
          }`}
        >
          {v.icon && <Icon name={v.icon} size={13} />}
          {v.label}
        </span>
      ))}
    </span>
  );
}

/* where an item's facts came from: quiet text, not chips */
export function Sources({ items }: { items: string[] }) {
  return (
    <p className="flex items-center gap-1.5 text-[12px] text-ink/62">
      <Icon name="clip" size={12} className="text-ink/45" />
      {items.join(", ")}
    </p>
  );
}

export type StatusKind = "running" | "waiting" | "done" | "scheduled";

/* state as a shape and a word, never colour alone */
export function Status({ kind, text }: { kind: StatusKind; text: string }) {
  const mark = {
    running: <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />,
    waiting: <span className="h-1.5 w-1.5 rounded-full bg-[#b27a24]" />,
    done: <Icon name="check" size={13} className="text-ink/62" />,
    scheduled: <Icon name="clock" size={13} className="text-ink/45" />,
  }[kind];
  return (
    <span className="inline-flex min-w-0 items-start gap-2">
      <span className="flex h-[1lh] w-3.5 flex-none items-center justify-center">{mark}</span>
      <span>{text}</span>
    </span>
  );
}

export function Bar({ pct }: { pct: number }) {
  return (
    <span className="relative block h-[3px] w-full rounded-full bg-ink/8">
      <span className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
    </span>
  );
}

export function Check({ done }: { done?: boolean }) {
  return done ? (
    <span className="flex h-3.5 w-3.5 flex-none items-center justify-center rounded-[4px] bg-ink/70 text-parchment">
      <Icon name="check" size={10} />
    </span>
  ) : (
    <span className="block h-3.5 w-3.5 flex-none rounded-[4px] border border-ink/30" />
  );
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-ink/6 text-[10px] font-semibold text-ink/70">
      {initials}
    </span>
  );
}
