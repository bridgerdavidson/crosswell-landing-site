"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { agents } from "@/lib/saguaro";
import { AppWindow, Button, Icon, Label, type StatusKind } from "../dashboard/ui";
import { themeOf } from "../dashboard/worlds";

/*
 * Prototype: the agents chapter's choreography, in the dashboard's dark
 * colours on the run's dark band. The roster is always at work on a slow
 * loop (a running ring, work counting up, one change every few seconds,
 * never more than one agent finishing at a time). The Core's message box
 * holds a typed request with its send button lit; Send hands it to an email
 * agent, which slides into the top of the roster and works through its
 * steps while the Core answers; the draft arrives in the Core to edit or
 * approve, and approving sends it by email and to each teammate's
 * dashboard. The filters filter, and a row opens its last run.
 */

const LOOP = 30;
const MESSAGE = "Send the team a recap of this morning's standup, with who owns what.";
/* a long crescent at the bottom-left, traced from a hand-drawn line: it comes off the left edge
   about a third of the way down, sweeps through the lower rows, and runs along the bottom until it
   meets the edge short of the Core column, then dives away so the column stays whole. The path
   keeps everything above the line and runs far past the window's edges, so the wide blur only
   works on the curve: the line itself sits at half strength, and the fade runs light to heavy
   over about 250px. */
const CRESCENT =
  "M-560 -260C-505 -205 -316 -5 -230 70C-144 145 -84 144 -46 190C-8 236 -21 298 -2 348" +
  "C17 397 40 444 68 487C96 530 129 575 167 608C206 641 250 664 300 686C350 708 408 724 468 739" +
  "C528 753 599 762 661 774C722 786 791 791 839 809C887 826 921 831 950 880C979 929 995 1013 1010 1100" +
  "C1025 1187 1035 1350 1040 1400L2400 1400L2400 -900L-900 -900L-900 -260Z";
const LIGHT_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 800' preserveAspectRatio='none'>" +
  "<filter id='soft' filterUnits='userSpaceOnUse' x='-900' y='-900' width='3300' height='2300'>" +
  "<feGaussianBlur stdDeviation='100'/></filter>" +
  `<path filter='url(#soft)' d='${CRESCENT}'/></svg>`;
const LIGHT = `url("data:image/svg+xml,${encodeURIComponent(LIGHT_SVG)}")`;

type Live = { kind: StatusKind; text: string; result: string; run: string };
type Row = { id: string; name: string; job: string; live: Live; log: string[]; fresh?: boolean };

const base = Object.fromEntries(agents.roster.map((a) => [a.id, a]));
const lastRun = (log: string[]) => log[log.length - 1].split("  ")[0];
const APPLICATIONS = ["Desert Vista Homes", "Mesquite Court", "Palo Brea Homes"];

/* the roster at a moment of the loop: t seconds into cycle n */
function rosterAt(t: number, n: number): Row[] {
  const inbox = base.inbox;
  const inboxLive: Live =
    t < 14
      ? { kind: "done", text: "3 drafts ready for your yes", result: inbox.lastResult, run: lastRun(inbox.log) }
      : t < 20
        ? { kind: "running", text: `Reading ${t < 17 ? 2 : 1} new`, result: inbox.lastResult, run: "now" }
        : { kind: "done", text: "3 drafts ready for your yes", result: "2 more read, both filed", run: "just now" };

  const app = APPLICATIONS[n % APPLICATIONS.length];
  const screen = base.screening;
  const screenLive: Live =
    t < 6
      ? { kind: "done", text: n === 0 ? "Cactus Wren screened" : `${APPLICATIONS[(n + APPLICATIONS.length - 1) % APPLICATIONS.length].split(" ").slice(0, 2).join(" ")} screened`, result: screen.lastResult, run: n === 0 ? lastRun(screen.log) : "just now" }
      : t < 11
        ? { kind: "running", text: `Screening ${app}`, result: screen.lastResult, run: "now" }
        : { kind: "done", text: `${app.split(" ").slice(0, 2).join(" ")} screened`, result: "Passes exposure at 3% of book", run: "just now" };

  const filing = base.filing;
  const filed = Math.min(9, 1 + Math.floor(t / 3));
  const filingLive: Live =
    t < 27
      ? { kind: "running", text: `Filing ${filed} of 9 decisions`, result: filing.lastResult, run: "now" }
      : { kind: "done", text: "Filed 9 decisions", result: "This morning: 9 decisions, 3 call notes", run: "just now" };

  const follow = base["follow-up"];
  const report = base.report;
  return [
    { id: "inbox", name: inbox.name, job: inbox.job, live: inboxLive, log: inbox.log },
    { id: "follow-up", name: follow.name, job: follow.job, live: { kind: "waiting", text: follow.status.text, result: follow.lastResult, run: lastRun(follow.log) }, log: follow.log },
    { id: "report", name: report.name, job: report.job, live: { kind: "scheduled", text: report.status.text, result: report.lastResult, run: lastRun(report.log) }, log: report.log },
    { id: "screening", name: screen.name, job: screen.job, live: screenLive, log: screen.log },
    { id: "filing", name: filing.name, job: filing.job, live: filingLive, log: filing.log },
  ];
}

type Phase = "rest" | "sent" | "draft" | "approved";

/* the email agent, from the moment Send is pressed (s seconds ago) */
function emailRow(phase: Phase, s: number): Row | null {
  if (phase === "rest") return null;
  const log = ["9:48 am  Read this morning's standup notes", "9:48 am  Drafted a recap to 4 people"];
  if (phase === "approved")
    return { id: "email", name: "Email agent", job: "Standup recap to the team", fresh: true, live: { kind: "done", text: "Sent, 9:52 am", result: "By email and to 4 dashboards", run: "just now" }, log: [...log, "9:52 am  Sent by email and to 4 dashboards"] };
  const live: Live =
    s < 1.6
      ? { kind: "running", text: "Reading standup notes", result: "Started just now", run: "now" }
      : s < 3.6
        ? { kind: "running", text: "Drafting to 4 people", result: "Started just now", run: "now" }
        : { kind: "waiting", text: "Draft ready for your yes", result: "Standup recap, Thursday", run: "just now" };
  return { id: "email", name: "Email agent", job: "Standup recap to the team", fresh: true, live, log: s < 3.6 ? log.slice(0, 1) : log };
}

function StatusMark({ kind }: { kind: StatusKind }) {
  if (kind === "running") return <Icon name="spin" size={13} className="animate-spin text-[var(--accent-deep)] motion-reduce:animate-none" />;
  if (kind === "waiting") return <span className="h-1.5 w-1.5 rounded-full bg-[#d09a45]" />;
  if (kind === "done") return <Icon name="check" size={13} className="text-ink/62" />;
  return <Icon name="clock" size={13} className="text-ink/45" />;
}

const FILTERS = ["All", "Running", "Waiting on you", "Scheduled"] as const;
type Filter = (typeof FILTERS)[number];
const yours = (r: Row) => r.live.kind === "waiting" || r.live.text.includes("your yes");
const passes = (f: Filter, r: Row) => f === "All" || (f === "Running" && r.live.kind === "running") || (f === "Waiting on you" && yours(r)) || (f === "Scheduled" && r.live.kind === "scheduled");

function Roster({ rows, filter, open, onOpen }: { rows: Row[]; filter: Filter; open: string | null; onOpen: (id: string) => void }) {
  const cols = "grid grid-cols-[minmax(0,1.2fr)_220px_minmax(0,1fr)_64px] gap-5";
  const shown = rows.filter((r) => passes(filter, r));
  return (
    <div className="px-7 pt-3 pb-12">
      <div className={`${cols} h-9 items-center border-b border-ink/8 text-[12px] text-ink/62`}>
        <span>Agent</span>
        <span>Status</span>
        <span>Last result</span>
        <span>Last run</span>
      </div>
      <ul>
        {shown.map((r) => (
          <li key={r.id} className={`border-b border-ink/8 ${r.fresh ? "core-rise" : ""}`}>
            <button type="button" onClick={() => onOpen(r.id)} className={`${cols} w-full cursor-pointer items-start py-2.5 text-left`}>
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-medium">
                  {r.name}
                  {r.fresh && <span className="rounded bg-[var(--accent-wash)] px-1.5 py-px text-[11px] font-medium text-[var(--accent-deep)]">New</span>}
                </span>
                <span className="mt-0.5 block text-[12px] text-ink/62 [text-wrap:pretty]">{r.job}</span>
              </span>
              <span className="flex items-start gap-2">
                <span className="flex h-[1lh] w-3.5 flex-none items-center justify-center">
                  <StatusMark kind={r.live.kind} />
                </span>
                <span className="tabular-nums">{r.live.text}</span>
              </span>
              <span className="text-ink/80 [text-wrap:pretty]">{r.live.result}</span>
              <span className={`text-[12px] whitespace-nowrap tabular-nums ${r.live.run === "now" ? "font-medium text-[var(--accent-deep)]" : "text-ink/62"}`}>{r.live.run}</span>
            </button>
            {open === r.id && (
              <div className="core-rise mb-2.5 flex items-end gap-6 rounded-md bg-ink/[0.04] px-3 py-2.5">
                <ol className="flex flex-col gap-1">
                  {r.log.map((l) => {
                    const [time, ...rest] = l.split("  ");
                    return (
                      <li key={l} className="flex gap-3 text-[12px]">
                        <span className="w-14 flex-none tabular-nums text-ink/62">{time}</span>
                        <span className="text-ink/80">{rest.join(" ")}</span>
                      </li>
                    );
                  })}
                </ol>
                {r.id === "inbox" && (
                  <span className="ml-auto">
                    <Button commit>Review 3 drafts</Button>
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <Label className="mt-8">Ready to add</Label>
      <ul className="border-t border-ink/8">
        {agents.spares.map((s) => (
          <li key={s.id} className="flex items-center gap-6 border-b border-ink/8 py-2.5">
            <div className="min-w-0">
              <p className="font-medium">{s.name}</p>
              <p className="mt-0.5 text-[12px] text-ink/62">{s.job}</p>
            </div>
            <span className="ml-auto">
              <Button>Set up</Button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const TEAM = ["DW", "ML", "PS", "JR"];
const RECAP = [
  { who: "Dana", line: "send the Palo Verde inspection report by Friday" },
  { who: "Marcus", line: "finish the Ocotillo Commons term sheet review by Friday" },
  { who: "Priya", line: "close out the servicing handoff by Tuesday" },
  { who: "Jordan", line: "send the investor brief before the 3:00 call" },
];

function CoreColumn({ phase, s, editing, onSend, onEdit, onApprove }: { phase: Phase; s: number; editing: boolean; onSend: () => void; onEdit: () => void; onApprove: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);

  /* the thread keeps its newest line in view: it slides up, never scrolls */
  useLayoutEffect(() => {
    const b = box.current;
    const t = thread.current;
    if (!b || !t) return;
    const over = t.scrollHeight - b.clientHeight;
    t.style.transform = over > 0 ? `translateY(${-over}px)` : "none";
  });

  const replied = phase !== "rest" && s >= 0.7;
  const drafted = phase === "draft" || phase === "approved";

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

      <div ref={box} className="min-h-0 flex-1 overflow-hidden px-5">
        <div ref={thread} className="flex flex-col gap-4 py-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          {phase !== "rest" && (
            <div className="core-rise flex justify-end">
              <p className="max-w-[88%] rounded-xl rounded-br-sm bg-[var(--accent-wash)] px-3 py-2 leading-[1.5] [text-wrap:balance]">{MESSAGE}</p>
            </div>
          )}
          {replied && (
            <p className="core-rise leading-[1.6] text-ink/85 [text-wrap:pretty]">
              The email agent is on it. It&apos;s pulling this morning&apos;s standup notes and writing a recap with owners and dates.
            </p>
          )}
          {drafted && (
            <div className={`core-rise rounded-lg border bg-parchment ${editing ? "border-[var(--accent)]" : "border-ink/10"}`}>
              <div className="flex items-center gap-2 border-b border-ink/8 px-3 py-2">
                <Icon name="mail" size={13} className="text-ink/62" />
                <p className="font-semibold">Email draft</p>
                <span className="ml-auto text-[11px] text-ink/62">Email agent</span>
              </div>
              <div className="px-3 pt-2.5 pb-3 text-[12.5px] leading-[1.55]">
                <p className="flex items-center gap-2 text-ink/62">
                  To
                  <span className="flex gap-1">
                    {TEAM.map((t) => (
                      <span key={t} className="flex h-5 w-5 items-center justify-center rounded-full bg-ink/8 text-[9px] font-semibold text-ink/80">
                        {t}
                      </span>
                    ))}
                  </span>
                </p>
                <p className="mt-1.5 text-ink/62">
                  Subject <span className="text-ink">Standup recap, Thursday</span>
                </p>
                <div className="mt-2.5 flex flex-col gap-1 text-ink/85">
                  <p>Morning, team. Here&apos;s who owns what from standup:</p>
                  {RECAP.map((r) => (
                    <p key={r.who}>
                      <span className="font-medium">{r.who}</span>: {r.line}
                    </p>
                  ))}
                  {editing && <span aria-hidden className="inline-block h-[15px] w-[1.5px] translate-y-[3px] bg-ink" />}
                </div>
              </div>
              <div className="border-t border-ink/8 px-3 py-2.5">
                {phase === "approved" ? (
                  <p className="flex items-center gap-2 text-[12px] text-ink/80">
                    <Icon name="check" size={13} className="text-[var(--accent-deep)]" />
                    Sent by email and to 4 dashboards
                  </p>
                ) : (
                  <>
                    <p className="flex items-center gap-1.5 text-[11.5px] text-ink/62">
                      <Icon name="mail" size={12} />
                      <Icon name="home" size={12} />
                      Goes by email and to each person&apos;s dashboard
                    </p>
                    <div className="mt-2.5 flex justify-end gap-1.5">
                      <button type="button" disabled className="inline-flex h-7 cursor-default items-center rounded-md border border-ink/12 px-2.5 text-[12px] font-semibold whitespace-nowrap text-ink/80 opacity-45">
                        Edit
                      </button>
                      <button type="button" onClick={onApprove} className="inline-flex h-7 cursor-pointer items-center rounded-md bg-[var(--accent)] px-2.5 text-[12px] font-semibold whitespace-nowrap text-ivory hover:brightness-110 active:scale-[0.97]">
                        Approve and send
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {phase === "approved" && (
            <p className="core-rise leading-[1.6] text-ink/85 [text-wrap:pretty]">
              Sent. Dana, Marcus, Priya, and Jordan have it by email, and each of their dashboards now shows their own item at the top.
            </p>
          )}
        </div>
      </div>

      <div className="flex-none p-3">
        <div className={`rounded-lg border bg-parchment ${phase === "rest" ? "border-[var(--accent)]/50" : "border-ink/12"}`}>
          {phase === "rest" ? (
            <p className="px-3 pt-2.5 pb-5 leading-[1.5]">
              {MESSAGE}
              <span aria-hidden className="core-caret ml-px inline-block h-[15px] w-[1.5px] translate-y-[3px] bg-ink" />
            </p>
          ) : (
            <p className="px-3 pt-2.5 pb-5 text-ink/45">Ask the Core, or tell it what to do</p>
          )}
          <div className="flex items-center px-1.5 pb-1.5 text-ink/45">
            <span className="flex h-7 w-7 items-center justify-center">
              <Icon name="clip" size={15} />
            </span>
            <span className="flex h-7 w-7 items-center justify-center">
              <Icon name="at" size={15} />
            </span>
            <button
              type="button"
              onClick={onSend}
              disabled={phase !== "rest"}
              aria-label="Send"
              className={`ml-auto flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                phase === "rest" ? "cursor-pointer bg-[var(--accent)] text-ivory hover:brightness-110 active:scale-[0.95]" : "bg-ink/8 text-ink/45"
              }`}
            >
              <Icon name="up" size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function AgentsDemo() {
  const [clock, setClock] = useState(0);
  const [phase, setPhase] = useState<Phase>("rest");
  const [sentAt, setSentAt] = useState(0);
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<string | null>("inbox");
  const [editing, setEditing] = useState(false);
  const still = useRef(false);

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still.current) return;
    const start = performance.now();
    const id = setInterval(() => setClock((performance.now() - start) / 1000), 250);
    return () => clearInterval(id);
  }, []);

  const t = clock % LOOP;
  const n = Math.floor(clock / LOOP);
  const s = clock - sentAt;

  useEffect(() => {
    if (phase === "sent" && s >= 3.6) setPhase("draft");
  }, [phase, s]);

  const email = emailRow(phase, still.current && phase !== "rest" ? 99 : s);
  const rows = [...(email ? [email] : []), ...rosterAt(still.current ? 0 : t, n)];
  const count = (f: Filter) => rows.filter((r) => passes(f, r)).length;

  const saguaro = themeOf("saguaro");
  const theme = { ...saguaro, mark: "/demo/saguaro-mark-light.svg", accentDeep: "#93b393", accentWash: "#414b3e" };

  const send = () => {
    setSentAt(clock);
    setPhase(still.current ? "draft" : "sent");
    setOpen("email");
    setFilter("All");
  };
  const replay = () => {
    setPhase("rest");
    setEditing(false);
    setOpen("inbox");
    setFilter("All");
  };

  return (
    <div>
      <style>{`
        @keyframes core-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .core-caret { animation: core-blink 1.1s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) { .core-caret { animation: none; } }
      `}</style>
      <div
        className="dashboard-dark"
        style={{ WebkitMaskImage: LIGHT, maskImage: LIGHT, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" } as CSSProperties}
      >
        <AppWindow
          theme={theme}
          active="agents"
          size="h-[800px] w-[1440px]"
          scroll={false}
          controls={
            <span className="inline-flex h-7 items-center rounded-md border border-ink/10 p-0.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`inline-flex h-full cursor-pointer items-center gap-1.5 rounded px-2 text-[12px] font-medium tabular-nums ${filter === f ? "bg-ink/10 text-ink" : "text-ink/62 hover:text-ink"}`}
                >
                  {f} <span className="text-ink/62">{count(f)}</span>
                </button>
              ))}
            </span>
          }
          actions={<Button icon="plus">New agent</Button>}
          main={<Roster rows={rows} filter={filter} open={open} onOpen={(id) => setOpen((o) => (o === id ? null : id))} />}
          coreColumn={
            <CoreColumn
              phase={phase}
              s={s}
              editing={editing}
              onSend={send}
              onEdit={() => setEditing((e) => !e)}
              onApprove={() => {
                setEditing(false);
                setPhase("approved");
              }}
            />
          }
        />
      </div>
      <div className="mt-6 flex items-center gap-4 text-[13px] text-ivory/80">
        <button type="button" onClick={replay} className="cursor-pointer rounded-md border border-ivory/25 px-3 py-1.5 font-medium">
          Replay
        </button>
        <span className="text-ivory/60">Phase: {phase}</span>
      </div>
    </div>
  );
}
