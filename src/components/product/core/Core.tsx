"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AppWindow, Button, Icon, Sources, Status, Views } from "@/components/dashboard/ui";
import { themeOf } from "@/components/dashboard/worlds";
import { core, pipeline, type Card, type CoreReply } from "@/lib/saguaro";
import { Chapter } from "../shared";

/**
 * Chapter 02: Ask the Core. The pipeline dashboard is lowered from the first
 * frame (an even wash of the page's ground, and a curved fall-off toward its
 * bottom-left corner that takes the window's outline with it) except one
 * card, Redrock Flips in Docs out, so its "Ask the Core" button is the one
 * lit thing to click. Every step waits for the visitor: the click pulls the
 * Core up out of its own column toward the viewer, 6% larger and casting a
 * shadow, with the deal attached and three questions to tap; each question
 * gets its own reply (working lines, the answer with its sources, and
 * anything prepared); the questions not yet asked come back under each
 * reply; a Send closes the loop on the board. Interactive; Replay resets it.
 */

const WIN = { h: 800, core: 384, over: 24, room: 12, min: 1280, max: 1440 };
const LIFT = 1.06;
const FALLOFF = "radial-gradient(ellipse 118% 190% at 100% 0%, #000 0%, #000 54%, transparent 100%)";

type Question = keyof typeof core.replies;
type Stage = "idle" | "working" | "answer" | "done";

const QUESTIONS = core.questions as Question[];
const REPLIES: Record<Question, CoreReply> = core.replies;

/* the board as chapter 02 tells it: Redrock Flips first in Docs out, gone quiet */
const redrock: Card = { ...pipeline.stages.flatMap((st) => st.cards).find((c) => c.id === core.selected)!, note: core.note };
const STAGES = pipeline.stages.map((st) => ({
  ...st,
  cards: st.name === core.stage ? [redrock, ...st.cards] : st.cards.filter((c) => c.id !== core.selected),
}));

const thousands = (amount: string) => (amount.endsWith("M") ? parseFloat(amount.slice(1)) * 1000 : parseFloat(amount.slice(1)));
const money = (k: number) => (k >= 1000 ? `$${(k / 1000).toFixed(2).replace(/\.?0+$/, "")}M` : `$${k}K`);

function DealCard({ card }: { card: Card }) {
  return (
    <li className="rounded-md border border-ink/8 bg-parchment px-2.5 py-2">
      <p className="truncate font-medium">{card.name}</p>
      <p className="mt-0.5 truncate text-[12px] text-ink/62">
        {card.place}, {card.kind.toLowerCase()}
      </p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-semibold tabular-nums">{card.amount}</span>
        <span className="text-[12px] tabular-nums text-ink/62">{card.rate}</span>
      </div>
      {card.note && (
        <p className={`mt-1.5 text-[12px] ${card.note === "New" ? "font-medium text-[var(--accent-deep)]" : "text-ink/62"}`}>{card.note}</p>
      )}
    </li>
  );
}

function SelectedCard({ lifted, nudged, onAsk }: { lifted: boolean; nudged: boolean; onAsk: () => void }) {
  return (
    <li className="relative z-20 rounded-md border border-[var(--accent)] bg-parchment px-2.5 py-2.5 outline outline-1 outline-[var(--accent)]">
      <p className="truncate font-semibold">{redrock.name}</p>
      <p className="mt-0.5 truncate text-[12px] text-ink/62">
        {redrock.place}, {redrock.kind.toLowerCase()}
      </p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-semibold tabular-nums">{redrock.amount}</span>
        <span className="text-[12px] tabular-nums text-ink/62">{redrock.rate}</span>
      </div>
      <p className={`mt-1.5 inline-flex items-center gap-1.5 text-[12px] ${nudged ? "font-medium text-[var(--accent-deep)]" : "text-[#8a5d1c]"}`}>
        {nudged ? <Icon name="check" size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-[#b27a24]" />}
        {nudged ? "Nudged today" : redrock.note}
      </p>
      <button
        type="button"
        onClick={onAsk}
        disabled={lifted}
        className={`mt-2.5 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md text-[12.5px] font-semibold transition-colors duration-150 active:scale-[0.97] ${
          lifted ? "bg-[var(--accent-wash)] text-[var(--accent-deep)]" : "cursor-pointer bg-[var(--accent)] text-ivory hover:bg-[var(--accent-deep)]"
        }`}
      >
        <Icon name="chat" size={14} />
        {lifted ? "In the Core" : "Ask the Core"}
      </button>
    </li>
  );
}

function Board({ lifted, nudged, onAsk }: { lifted: boolean; nudged: boolean; onAsk: () => void }) {
  return (
    <div className="grid grid-cols-5 gap-2 px-4 pt-4">
      {STAGES.map((s) => (
        <div key={s.name} className="min-w-0 rounded-lg bg-ink/[0.035] p-1.5">
          <div className="flex h-8 items-center gap-1.5 px-1.5">
            <p className="font-semibold">{s.name}</p>
            <span className="tabular-nums text-ink/62">{s.cards.length}</span>
            <span className="ml-auto text-[12px] tabular-nums text-ink/62">{money(s.cards.reduce((k, c) => k + thousands(c.amount), 0))}</span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {s.cards.map((c) =>
              c.id === core.selected ? <SelectedCard key={c.id} lifted={lifted} nudged={nudged} onAsk={onAsk} /> : <DealCard key={c.id} card={c} />
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

function useStream(text: string, run: boolean, ms = 28) {
  const [n, setN] = useState(0);
  const words = text.split(" ");
  useEffect(() => {
    if (!run) return;
    setN(0);
    const id = setInterval(() => setN((v) => (v >= words.length ? v : v + 1)), ms);
    return () => clearInterval(id);
  }, [run, words.length, ms]);
  return run ? words.slice(0, n).join(" ") : text;
}

/* one question and the Core's reply to it; the latest plays, earlier ones stand finished */
function Turn({ q, stage, work, sent, onSend }: { q: Question; stage: Stage; work: number; sent: boolean; onSend: () => void }) {
  const reply = REPLIES[q];
  const streaming = stage === "answer";
  const text = useStream(reply.answer, streaming);
  const shown = stage === "answer" || stage === "done";

  return (
    <>
      <div className="core-rise flex justify-end">
        <p className="rounded-xl rounded-br-sm bg-[var(--accent-wash)] px-3 py-2">{q}</p>
      </div>

      {stage !== "idle" && (
        <ul className="flex flex-col gap-1">
          {reply.working.map((w, i) => {
            const done = work > i || shown;
            if (!done && work !== i) return null;
            return (
              <li key={w} className="flex items-center gap-2 text-[12px] text-ink/62">
                {done ? <Icon name="check" size={12} className="text-[var(--accent-deep)]" /> : <Icon name="spin" size={12} className="animate-spin" />}
                {w}
              </li>
            );
          })}
        </ul>
      )}

      {shown && (
        <div>
          <p className="leading-[1.6] text-ink/85">{streaming ? text : reply.answer}</p>
          {stage === "done" && (
            <div className="core-rise mt-2.5">
              <Sources items={reply.sources} />
            </div>
          )}
        </div>
      )}

      {stage === "done" && reply.prepared && (
        <div className="core-rise rounded-lg border border-ink/10 bg-parchment p-3">
          <p className="font-semibold">{reply.prepared.title}</p>
          <p className="mt-0.5 text-[12px] leading-[1.5] text-ink/62">{reply.prepared.meta}</p>
          {reply.prepared.body && <p className="mt-2.5 rounded-md bg-ivory px-2.5 py-2 text-[12.5px] leading-[1.55] text-ink/80">{reply.prepared.body}</p>}
          <div className="mt-3 flex items-center gap-2">
            {sent ? <Status kind="done" text="Sent, and logged to the deal" /> : <Status kind="waiting" text="Waiting for your yes" />}
            {!sent && (
              <div className="ml-auto flex gap-1.5">
                <Button>{reply.prepared.edit}</Button>
                <button
                  type="button"
                  onClick={onSend}
                  className="inline-flex h-7 cursor-pointer items-center rounded-md bg-[var(--accent)] px-2.5 text-[12px] font-semibold text-ivory hover:bg-[var(--accent-deep)] active:scale-[0.97]"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* the Core pulled up out of its column: the docked column's own box, lifted once asked */
function LiftedCore({
  lifted,
  asked,
  stage,
  work,
  sent,
  onAsk,
  onSend,
}: {
  lifted: boolean;
  asked: Question[];
  stage: Stage;
  work: number;
  sent: Question[];
  onAsk: (q: Question) => void;
  onSend: (q: Question) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const idle = asked.length === 0 || stage === "done";
  const remaining = QUESTIONS.filter((q) => !asked.includes(q));

  /* the thread keeps its newest line in view: once it outgrows the column it slides up, never scrolls */
  useLayoutEffect(() => {
    const b = box.current;
    const t = thread.current;
    if (!b || !t) return;
    const move = () => {
      const over = t.scrollHeight - b.clientHeight;
      t.style.transform = over > 0 ? `translateY(${-over}px)` : "none";
    };
    move();
    const ro = new ResizeObserver(move);
    ro.observe(t);
    return () => ro.disconnect();
  });

  return (
    <aside
      aria-hidden={!lifted}
      className={`absolute top-0 z-30 flex flex-col bg-chrome transition-[transform,box-shadow,border-radius] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        lifted ? "rounded-xl" : "pointer-events-none invisible rounded-r-xl opacity-0"
      }`}
      style={{
        right: WIN.room,
        width: WIN.core + 1,
        height: WIN.h,
        transform: lifted ? `scale(${LIFT})` : "none",
        boxShadow: lifted ? "0 2px 4px rgba(26,25,21,0.05), 0 30px 70px -20px rgba(26,25,21,0.35)" : "none",
      }}
    >
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
        <div ref={thread} className="flex flex-col gap-4 py-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none">
          <div
            className={`rounded-lg border border-ink/10 bg-parchment p-3 transition-[opacity,transform] duration-500 motion-reduce:transition-none ${lifted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
            style={{ transitionDelay: lifted ? "300ms" : "0ms" }}
          >
            <div className="flex items-baseline gap-2">
              <p className="font-semibold">{redrock.name}</p>
              <span className="ml-auto text-[12px] text-ink/62">{core.stage}</span>
            </div>
            <dl className="mt-2.5 grid grid-cols-3 gap-2">
              {core.numbers.map((n) => (
                <div key={n.label}>
                  <dt className="text-[11px] text-ink/62">{n.label}</dt>
                  <dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{n.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {asked.map((q, i) => {
            const last = i === asked.length - 1;
            return <Turn key={q} q={q} stage={last ? stage : "done"} work={last ? work : 2} sent={sent.includes(q)} onSend={() => onSend(q)} />;
          })}

          {lifted && idle && remaining.length > 0 && (
            <div className="core-rise flex flex-wrap gap-1.5" style={{ animationDelay: asked.length === 0 ? "450ms" : "150ms" }}>
              {remaining.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onAsk(q)}
                  className="cursor-pointer rounded-full border border-ink/12 bg-parchment px-2.5 py-1 text-[12px] text-ink/80 transition-colors duration-150 hover:border-[var(--accent)] hover:bg-[var(--accent-wash)] hover:text-[var(--accent-deep)]"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-none p-3">
        <div className="rounded-lg border border-ink/12 bg-parchment">
          {lifted && (
            <div className="flex px-2.5 pt-2.5">
              <span className="core-attach inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-wash)] px-2 py-1 text-[12px] font-medium text-[var(--accent-deep)]">
                <Icon name="pipeline" size={12} />
                {redrock.name}
                <Icon name="close" size={11} />
              </span>
            </div>
          )}
          <p className="px-3 pt-2.5 pb-6 text-ink/45">{lifted ? `Ask anything about ${redrock.name}, or tell the Core what to do` : "Ask the Core, or tell it what to do"}</p>
          <div className="flex items-center px-1.5 pb-1.5 text-ink/45">
            <span className="flex h-7 w-7 items-center justify-center">
              <Icon name="clip" size={15} />
            </span>
            <span className="flex h-7 w-7 items-center justify-center">
              <Icon name="at" size={15} />
            </span>
            <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-md bg-ink/8 text-ink/45">
              <Icon name="up" size={14} />
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/*
 * The stage: the window at its real size, taking the frame's width (never
 * under 1280 or over 1440) less 12 of room for the lifted Core to hang past
 * its right edge, with 24 above and below for it to hang past its top and
 * bottom. A frame narrower than that scales the whole stage down to fit, so
 * the Core is never cropped. It clips sideways only until it has measured
 * (and without JavaScript), when the unscaled stage could be wider than a
 * phone; once measured nothing overflows, and the lifted Core's shadow is
 * free to fall past the frame's edge.
 */
function Stage({ children, style }: { children: ReactNode; style: CSSProperties }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    const el = box.current!;
    const measure = () => {
      setScale(Math.min(1, el.clientWidth / (WIN.min + WIN.room)));
      setMeasured(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={box}
      data-core-stage
      className={`relative w-full ${measured ? "" : "overflow-x-clip"}`}
      style={{ height: (WIN.h + WIN.over * 2) * scale, ...style }}
    >
      <div
        className="absolute left-0 origin-top-left"
        style={{
          top: WIN.over * scale,
          width: scale < 1 ? WIN.min + WIN.room : `clamp(${WIN.min + WIN.room}px, 100%, ${WIN.max + WIN.room}px)`,
          height: WIN.h,
          transform: scale < 1 ? `scale(${scale})` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function Core() {
  const [lifted, setLifted] = useState(false);
  const [asked, setAsked] = useState<Question[]>([]);
  const [stage, setStage] = useState<Stage>("idle");
  const [work, setWork] = useState(0);
  const [sent, setSent] = useState<Question[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const theme = themeOf("saguaro");
  /* the lifted Core sits outside the window, so the business's accent is set on the stage both share */
  const vars = {
    "--accent": theme.accent,
    "--accent-deep": theme.accentDeep,
    "--accent-soft": theme.accentSoft,
    "--accent-wash": theme.accentWash,
  } as CSSProperties;

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const after = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  /* one tap, one whole reply: working, the answer streaming in, then its sources and anything prepared */
  const ask = (q: Question) => {
    if (asked.includes(q) || (asked.length > 0 && stage !== "done")) return;
    clear();
    setAsked((a) => [...a, q]);
    setWork(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWork(2);
      setStage("done");
      return;
    }
    const words = REPLIES[q].answer.split(" ").length;
    setStage("idle");
    after(400, () => setStage("working"));
    after(1100, () => setWork(1));
    after(1800, () => setWork(2));
    after(1900, () => setStage("answer"));
    after(1900 + words * 28 + 350, () => setStage("done"));
  };

  const replay = () => {
    clear();
    setLifted(false);
    setAsked([]);
    setStage("idle");
    setWork(0);
    setSent([]);
  };

  useEffect(() => clear, []);

  return (
    <div data-chapter="core">
      <Chapter
        claim={
          /* each sentence takes its own lines, so the break falls between them, never inside the second */
          <>
            <span className="block">Your whole business, a question away.</span>{" "}
            <span className="block">The next step, a yes away.</span>
          </>
        }
        body="Open a client, a project, or a file and the Core already has it in hand. It answers from everything your business has on record, from meeting notes to email threads, and shows where each answer came from. Then it takes the next step, drafting the follow-up and holding it for your yes."
        controls={
          <button type="button" onClick={replay} className={`product-replay ${lifted ? "is-ready" : ""}`} tabIndex={lifted ? 0 : -1}>
            Replay
          </button>
        }
      >
        <Stage style={vars}>
          {/* the dashboard falls away toward its bottom-left corner, its outline with it, strongest
              beside the Core: the fall-off is a mask on the whole window, so the page shows through */}
          <div className="relative h-full" style={{ marginRight: WIN.room, WebkitMaskImage: FALLOFF, maskImage: FALLOFF }}>
            <AppWindow
              theme={theme}
              active="pipeline"
              size="h-[800px] w-full"
              controls={
                <Views
                  items={[
                    { label: "Board", icon: "board" },
                    { label: "List", icon: "list" },
                  ]}
                  active="Board"
                />
              }
              actions={<Button icon="plus">New deal</Button>}
              main={<Board lifted={lifted} nudged={sent.length > 0} onAsk={() => setLifted(true)} />}
            />
            {/* and an even wash of the page's ground over all of it, border included; the lit card
                sits above it (the mask makes this wrapper the stacking context both share) */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-ivory/50" />
          </div>
          <LiftedCore
            lifted={lifted}
            asked={asked}
            stage={stage}
            work={work}
            sent={sent}
            onAsk={ask}
            onSend={(q) => setSent((s) => (s.includes(q) ? s : [...s, q]))}
          />
        </Stage>
      </Chapter>
    </div>
  );
}
