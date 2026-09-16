"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { AppWindow, Button, Icon, Label, type StatusKind } from "@/components/dashboard/ui";
import WindowFrame, { type Crop } from "@/components/dashboard/WindowFrame";
import { themeOf } from "@/components/dashboard/worlds";
import { agents } from "@/lib/saguaro";
import { Chapter } from "../shared";

/**
 * The agents chapter, on the run's one dark band: the dashboard's Agents
 * page at 800 tall in the dashboard's dark colours (.dashboard-dark). The
 * roster is always at work on a slow loop (a running ring, work counting
 * up, one change every few seconds), but only while the chapter is on
 * screen. Its filters filter and a row opens its last run. The Core's
 * message box holds a typed request with its send button lit: Send hands it
 * to an email agent, which joins the top of the roster and works through
 * its steps while the Core answers; the draft arrives in the Core, and
 * approving sends it by email and to each person's own dashboard. Replay
 * resets it. A long crescent fade takes the window's bottom-left corner
 * from lg; on a phone the window is 640 tall and cropped to the Core's
 * column (PHONE, below), whole to its edges.
 */

/* Saguaro Capital on the dark band: the fern accent, its soft tint for text and the selected tab, a
   fern wash that reads on charcoal, and the mark in fern-soft */
const saguaro = themeOf("saguaro");
const dark = { ...saguaro, mark: "/demo/saguaro-mark-light.svg", accentDeep: "#93b393", accentWash: "#414b3e" };

const LOOP = 30;
const { recap } = agents;

/* A long crescent at the bottom-left, traced from a hand-drawn line: it comes off the left edge
   about a third of the way down, sweeps through the lower rows, and runs along the bottom until it
   meets the edge short of the Core column, then dives away so the column stays whole. The path
   keeps everything above the line and runs far past the window's edges, so the wide blur only
   works on the curve: the line itself sits at half strength, and the fade runs light to heavy
   over about 250px. Drawn on a 1440 by 800 window and stretched to the frame's width. */
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
/* the crescent is the desktop's: agents-crescent (globals.css) reads it from lg and drops it below */
const CRESCENT_VAR = { "--crescent": LIGHT } as CSSProperties;

/* the phone's crop: the Core's column whole, where the work is named and the
   draft comes back for a yes, with the roster's last columns running off the
   left of the screen so the window reads as continuing; the window is 640
   tall there, enough for the whole email draft to stand in the thread when it
   arrives, so the frame is about 400 at 0.63 on a phone, the column at 1:1
   on a tablet */
const PHONE: Crop = { x: 708, y: 0, width: 600, height: 640, bleed: "left", fade: 40 };

type Live = { kind: StatusKind; text: string; result: string; run: string };
type Row = { id: string; name: string; job: string; live: Live; log: string[]; fresh?: boolean };

const base = Object.fromEntries(agents.roster.map((a) => [a.id, a]));
const lastRun = (log: string[]) => log[log.length - 1].split("  ")[0];
const short = (name: string) => name.split(" ").slice(0, 2).join(" ");

/* the roster at a moment of the loop: t seconds into cycle n */
function rosterAt(t: number, n: number): Row[] {
  const inbox = base.inbox;
  const inboxLive: Live =
    t < 14
      ? { kind: "done", text: "3 drafts ready for your yes", result: inbox.lastResult, run: lastRun(inbox.log) }
      : t < 20
        ? { kind: "running", text: `Reading ${t < 17 ? 2 : 1} new`, result: inbox.lastResult, run: "now" }
        : { kind: "done", text: "3 drafts ready for your yes", result: "2 more read, both filed", run: "just now" };

  const apps = agents.applications;
  const app = apps[n % apps.length];
  const screen = base.screening;
  const screenLive: Live =
    t < 6
      ? n === 0
        ? { kind: "done", text: "Cactus Wren screened", result: screen.lastResult, run: lastRun(screen.log) }
        : { kind: "done", text: `${short(apps[(n + apps.length - 1) % apps.length])} screened`, result: screen.lastResult, run: "just now" }
      : t < 11
        ? { kind: "running", text: `Screening ${app}`, result: screen.lastResult, run: "now" }
        : { kind: "done", text: `${short(app)} screened`, result: "Passes exposure at 3% of book", run: "just now" };

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
const DRAFTED = 3.6;

/* the email agent, from the moment Send is pressed (s seconds ago) */
function emailRow(phase: Phase, s: number): Row | null {
  if (phase === "rest") return null;
  const row = { id: "email", ...recap.agent, fresh: true };
  if (phase === "approved") return { ...row, live: { kind: "done", text: "Sent, 9:52 am", result: "By email and to 4 dashboards", run: "just now" }, log: recap.log };
  const live: Live =
    s < 1.6
      ? { kind: "running", text: "Reading standup notes", result: "Started just now", run: "now" }
      : s < DRAFTED
        ? { kind: "running", text: "Drafting to 4 people", result: "Started just now", run: "now" }
        : { kind: "waiting", text: "Draft ready for your yes", result: recap.subject, run: "just now" };
  return { ...row, live, log: recap.log.slice(0, s < DRAFTED ? 1 : 2) };
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
const passes = (f: Filter, r: Row) =>
  f === "All" || (f === "Running" && r.live.kind === "running") || (f === "Waiting on you" && yours(r)) || (f === "Scheduled" && r.live.kind === "scheduled");

function Roster({ rows, filter, open, onOpen }: { rows: Row[]; filter: Filter; open: string | null; onOpen: (id: string) => void }) {
  const cols = "grid grid-cols-[minmax(0,1.2fr)_220px_minmax(0,1fr)_64px] gap-5";
  return (
    <div className="px-7 pt-3 pb-12">
      <div className={`${cols} h-9 items-center border-b border-ink/8 text-[12px] text-ink/62`}>
        <span>Agent</span>
        <span>Status</span>
        <span>Last result</span>
        <span>Last run</span>
      </div>
      <ul>
        {rows
          .filter((r) => passes(filter, r))
          .map((r) => (
            <li key={r.id} className={`border-b border-ink/8 ${r.fresh ? "core-rise" : ""}`}>
              <button type="button" onClick={() => onOpen(r.id)} aria-expanded={open === r.id} className={`${cols} w-full cursor-pointer items-start py-2.5 text-left`}>
                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-medium">
                    <span>{r.name}</span>
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

function CoreColumn({ phase, s, onSend, onApprove }: { phase: Phase; s: number; onSend: () => void; onApprove: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);

  /* the thread is a scrolling chat, as in chapter 02: whatever arrives keeps
     its newest line in view, and the visitor can scroll back through it. The
     observer is set once: this column re-renders on every tick of the
     roster's loop, and keeping the bottom on every render snapped the thread
     back the moment a visitor scrolled up */
  useLayoutEffect(() => {
    const b = box.current;
    const t = thread.current;
    if (!b || !t) return;
    const keep = () => {
      b.scrollTop = b.scrollHeight;
    };
    keep();
    const ro = new ResizeObserver(keep);
    ro.observe(t);
    return () => ro.disconnect();
  }, []);

  const replied = phase !== "rest" && s >= 0.7;
  const drafted = phase === "draft" || phase === "approved";

  return (
    /* below lg, where the column shows at about two thirds, its words run a size up */
    <aside className="flex w-[384px] flex-none flex-col border-l border-ink/8 bg-chrome max-lg:text-[16px]">
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

      <div ref={box} className="min-h-0 flex-1 overflow-y-auto px-5 [scrollbar-width:thin] motion-safe:[scroll-behavior:smooth]">
        <div ref={thread} className="flex flex-col gap-4 py-5">
          {phase !== "rest" && (
            <div className="core-rise flex justify-end">
              <p className="max-w-[88%] rounded-xl rounded-br-sm bg-[var(--accent-wash)] px-3 py-2 leading-[1.5] [text-wrap:balance]">{recap.request}</p>
            </div>
          )}
          {replied && <p className="core-rise leading-[1.6] text-ink/85 [text-wrap:pretty]">{recap.reply}</p>}
          {drafted && (
            <div className="core-rise rounded-lg border border-ink/10 bg-parchment">
              <div className="flex items-center gap-2 border-b border-ink/8 px-3 py-2">
                <Icon name="mail" size={13} className="text-ink/62" />
                <p className="font-semibold">Email draft</p>
                <span className="ml-auto text-[11px] text-ink/62 max-lg:text-[13px]">{recap.agent.name}</span>
              </div>
              <div className="px-3 pt-2.5 pb-3 text-[12.5px] leading-[1.55] max-lg:text-[14px]">
                <p className="flex items-center gap-2 text-ink/62">
                  To
                  <span className="flex gap-1">
                    {recap.to.map((t) => (
                      <span key={t} className="flex h-5 w-5 items-center justify-center rounded-full bg-ink/8 text-[9px] font-semibold text-ink/80">
                        {t}
                      </span>
                    ))}
                  </span>
                </p>
                <p className="mt-1.5 text-ink/62">
                  Subject <span className="text-ink">{recap.subject}</span>
                </p>
                <div className="mt-2.5 flex flex-col gap-1 text-ink/85">
                  <p>{recap.greeting}</p>
                  {recap.owners.map((o) => (
                    <p key={o.who}>
                      <span className="font-medium">{o.who}</span>: {o.line}
                    </p>
                  ))}
                </div>
              </div>
              <div className="border-t border-ink/8 px-3 py-2.5">
                {phase === "approved" ? (
                  <p className="flex items-center gap-2 text-[12px] text-ink/80 max-lg:text-[14px]">
                    <Icon name="check" size={13} className="text-[var(--accent-deep)]" />
                    Sent by email and to 4 dashboards
                  </p>
                ) : (
                  <>
                    <p className="flex items-center gap-1.5 text-[11.5px] text-ink/62 max-lg:text-[13px]">
                      <Icon name="mail" size={12} />
                      <Icon name="home" size={12} />
                      Goes by email and to each person’s dashboard
                    </p>
                    <div className="mt-2.5 flex justify-end gap-1.5">
                      {/* the product's Edit, shown but not part of the chapter's story */}
                      <button type="button" disabled className="inline-flex h-7 cursor-default items-center rounded-md border border-ink/12 px-2.5 text-[12px] font-semibold whitespace-nowrap text-ink/80 opacity-45">
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={onApprove}
                        className="tap-room inline-flex h-7 cursor-pointer items-center rounded-md bg-[var(--accent)] px-2.5 text-[12px] font-semibold whitespace-nowrap text-ivory hover:brightness-110 active:scale-[0.97]"
                      >
                        Approve and send
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {phase === "approved" && <p className="core-rise leading-[1.6] text-ink/85 [text-wrap:pretty]">{recap.sent}</p>}
        </div>
      </div>

      <div className="flex-none p-3">
        <div className={`rounded-lg border bg-parchment ${phase === "rest" ? "border-[var(--accent)]/50" : "border-ink/12"}`}>
          {phase === "rest" ? (
            <p className="px-3 pt-2.5 pb-5 leading-[1.5]">
              {recap.request}
              <span aria-hidden className="agents-caret ml-px inline-block h-[15px] w-[1.5px] translate-y-[3px] bg-ink" />
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
              className={`tap-room ml-auto flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
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

export default function Agents() {
  const root = useRef<HTMLDivElement>(null);
  const [clock, setClock] = useState(0);
  const [still, setStill] = useState(false);
  const [phase, setPhase] = useState<Phase>("rest");
  const [sentAt, setSentAt] = useState(0);
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<string | null>("inbox");

  /* the loop's clock runs only while the chapter is on screen, so it picks up where it left off */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    let id: number | undefined;
    let last = 0;
    const tick = () => {
      const now = performance.now();
      setClock((c) => c + (now - last) / 1000);
      last = now;
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && id === undefined) {
        last = performance.now();
        id = window.setInterval(tick, 250);
      } else if (!e.isIntersecting && id !== undefined) {
        clearInterval(id);
        id = undefined;
      }
    });
    io.observe(root.current!);
    return () => {
      io.disconnect();
      if (id !== undefined) clearInterval(id);
    };
  }, []);

  const t = still ? 0 : clock % LOOP;
  const n = Math.floor(clock / LOOP);
  const s = still ? DRAFTED : clock - sentAt;

  useEffect(() => {
    if (phase === "sent" && s >= DRAFTED) setPhase("draft");
  }, [phase, s]);

  const email = emailRow(phase, s);
  const rows = [...(email ? [email] : []), ...rosterAt(t, n)];
  const count = (f: Filter) => rows.filter((r) => passes(f, r)).length;

  const send = () => {
    setSentAt(clock);
    setPhase(still ? "draft" : "sent");
    setOpen("email");
    setFilter("All");
  };
  const replay = () => {
    setPhase("rest");
    setOpen("inbox");
    setFilter("All");
  };
  const done = phase !== "rest";

  return (
    <div ref={root} data-chapter="05">
      <Chapter
        dark
        claim={
          /* each sentence takes its own line, so the break never falls inside one */
          <>
            <span className="block">You name the work.</span>{" "}
            <span className="block">We build the agent that does it.</span>
          </>
        }
        body="Your team names the job. We build it as an agent, on top of everything the Core already knows about your business. Not one-off email tricks: the multi-step work your company runs on, custom to your steps. Each one reports what it did and waits for your yes before anything leaves the building."
        controls={
          <button type="button" onClick={replay} className={`product-replay ${done ? "is-ready" : ""}`} tabIndex={done ? 0 : -1}>
            Replay
          </button>
        }
      >
        <WindowFrame height={800} phone={PHONE}>
          <div className="dashboard-dark agents-crescent" style={CRESCENT_VAR}>
            <AppWindow
              theme={dark}
              active="agents"
              size="h-[640px] w-full lg:h-[800px]"
              controls={
                <span className="inline-flex h-7 items-center rounded-md border border-ink/10 p-0.5">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      aria-pressed={filter === f}
                      className={`inline-flex h-full cursor-pointer items-center gap-1.5 rounded px-2 text-[12px] font-medium tabular-nums ${filter === f ? "bg-ink/10 text-ink" : "text-ink/62 hover:text-ink"}`}
                    >
                      {f} <span className="text-ink/62">{count(f)}</span>
                    </button>
                  ))}
                </span>
              }
              actions={<Button icon="plus">New agent</Button>}
              main={<Roster rows={rows} filter={filter} open={open} onOpen={(id) => setOpen((o) => (o === id ? null : id))} />}
              coreColumn={<CoreColumn phase={phase} s={s} onSend={send} onApprove={() => setPhase("approved")} />}
            />
          </div>
        </WindowFrame>
      </Chapter>
    </div>
  );
}
