"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { pipeline, type Card } from "@/lib/saguaro";
import { AppWindow, Button, Icon, Sources, Status, Views } from "../dashboard/ui";
import { themeOf } from "../dashboard/worlds";

/*
 * Prototype, fifth pass: the Core chapter's choreography. From the first
 * frame the dashboard is lowered (an even wash, plus a curved fall-off
 * toward its bottom-left corner, outline and all) except one card: Redrock
 * Flips, in Docs out, with its "Ask the Core" button, so the one lit thing
 * on the page is the thing to click. Every step waits for the visitor: the
 * click pulls the Core up out of its own column toward the viewer, a
 * little larger, casting a shadow, with the deal attached and three
 * questions to tap. Each question gets its own reply (working lines, the
 * answer with its sources, and, where there is one, the thing the Core
 * prepared); the questions not yet asked come back under each reply, and a
 * Send closes the loop on the board.
 */

const WIN = { w: 1440, h: 800, core: 384 };
const FALLOFF = "radial-gradient(ellipse 118% 190% at 100% 0%, #000 0%, #000 54%, transparent 100%)";
const LIFT = { scale: 1.06, x: 0 };

type Prepared = { title: string; meta: string; body?: string; edit: string };
type Reply = { working: string[]; answer: string; sources: string[]; prepared?: Prepared };

/* the deal, then the business around it, then the work outstanding, then an action */
const QUESTIONS = ["Who is this?", "What's our rule on first-time borrowers?", "What's outstanding?", "Draft an update"] as const;
type Question = (typeof QUESTIONS)[number];

const REPLIES: Record<Question, Reply> = {
  "Who is this?": {
    working: ["Reading the borrower file", "Checking the broker's notes"],
    answer:
      "Redrock Flips is a first-time borrower, introduced by Canyon State Brokers in July. This deal is a Tempe fix and flip, $385K at 12.25% on a three-bedroom rehab. The loan documents went out August 27 and haven't come back signed.",
    sources: ["broker intro", "deal record"],
  },
  "What's our rule on first-time borrowers?": {
    working: ["Searching partner meetings", "Reading the credit policy"],
    answer:
      "Two rules, set at the August 12 partner meeting: first-time borrowers sign a personal guarantee, and their loan documents come back within 14 days or the rate lock lapses. Redrock Flips is at 21 days, so its lock lapsed on September 10.",
    sources: ["partner meeting, Aug 12", "credit policy"],
  },
  "What's outstanding?": {
    working: ["Reading the deal record", "Checking with the follow-up agent"],
    answer:
      "Two things. The signed loan documents and the entity's operating agreement are both still out, 21 days after the docs went out. The follow-up agent has a check-in drafted and waiting for your yes.",
    sources: ["loan documents", "follow-up draft"],
    prepared: {
      title: "Check-in to Redrock Flips",
      meta: "Drafted by the follow-up agent. Asks for the signed documents and the operating agreement by Friday.",
      edit: "Review",
    },
  },
  "Draft an update": {
    working: ["Reading the deal record", "Writing it in your voice"],
    answer: "Here's a short update for Redrock Flips. It picks up from the August 27 documents and asks for both signatures by Friday.",
    sources: ["deal record", "your sent mail"],
    prepared: {
      title: "Update to Redrock Flips",
      meta: "Draft, in your voice",
      body: "Hi, following up on the loan documents we sent August 27. Once they're signed and we have the operating agreement, we can set a closing date. Could you send both back by Friday?",
      edit: "Edit",
    },
  },
};

type Stage = "idle" | "working" | "answer" | "done";

/* the prototype's own pipeline: Redrock Flips with its loan documents out and gone quiet */
const SELECTED = "redrock";
const redrock = { ...pipeline.stages.flatMap((st) => st.cards).find((c) => c.id === SELECTED)!, note: "Quiet 21 days" };
const STAGES = pipeline.stages.map((st) => ({
  ...st,
  cards: st.name === "Docs out" ? [redrock, ...st.cards] : st.cards.filter((c) => c.id !== SELECTED),
}));
const DETAIL = {
  stage: "Docs out",
  since: "First-time borrower, loan documents sent August 27",
  numbers: [
    { label: "Loan amount", value: "$385K" },
    { label: "Rate", value: "12.25%" },
    { label: "Days at stage", value: "21" },
  ],
};

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

function SelectedCard({ card, lifted, nudged, onAsk }: { card: Card; lifted: boolean; nudged: boolean; onAsk: () => void }) {
  return (
    <li className="relative z-20 rounded-md border border-[var(--accent)] bg-parchment px-2.5 py-2.5 outline outline-1 outline-[var(--accent)]">
      <p className="truncate font-semibold">{card.name}</p>
      <p className="mt-0.5 truncate text-[12px] text-ink/62">
        {card.place}, {card.kind.toLowerCase()}
      </p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-semibold tabular-nums">{card.amount}</span>
        <span className="text-[12px] tabular-nums text-ink/62">{card.rate}</span>
      </div>
      <p className={`mt-1.5 inline-flex items-center gap-1.5 text-[12px] ${nudged ? "font-medium text-[var(--accent-deep)]" : "text-[#8a5d1c]"}`}>
        {nudged ? <Icon name="check" size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-[#b27a24]" />}
        {nudged ? "Nudged today" : card.note}
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
              c.id === SELECTED ? <SelectedCard key={c.id} card={c} lifted={lifted} nudged={nudged} onAsk={onAsk} /> : <DealCard key={c.id} card={c} />
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

/* one question and the Core's reply to it; the last one plays, earlier ones stand finished */
function Exchange({ q, stage, work, sent, onSend }: { q: Question; stage: Stage; work: number; sent: boolean; onSend: () => void }) {
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
            const live = !done && work === i;
            if (!done && !live) return null;
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
                <button type="button" onClick={onSend} className="inline-flex h-7 cursor-pointer items-center rounded-md bg-[var(--accent)] px-2.5 text-[12px] font-semibold text-ivory hover:bg-[var(--accent-deep)] active:scale-[0.97]">
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

/* the Core pulled up out of its column: the docked column's own box, lifted once opened */
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
  const card = redrock;
  const detail = DETAIL;
  const box = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const idle = asked.length === 0 || stage === "done";
  const remaining = QUESTIONS.filter((q) => !asked.includes(q));

  /* the thread keeps its newest line in view: once it outgrows the column, it slides up (never a scroll) */
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
      className={`absolute top-0 right-0 z-30 flex flex-col bg-chrome transition-[transform,box-shadow,border-radius] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        lifted ? "rounded-xl" : "pointer-events-none rounded-r-xl opacity-0"
      }`}
      style={{
        width: WIN.core + 1,
        height: WIN.h,
        transformOrigin: "50% 50%",
        transform: lifted ? `translateX(${LIFT.x}px) scale(${LIFT.scale})` : "none",
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
        <div ref={thread} className="flex flex-col gap-4 py-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <div
            className={`rounded-lg border border-ink/10 bg-parchment p-3 transition-[opacity,transform] duration-500 ${lifted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
            style={{ transitionDelay: lifted ? "300ms" : "0ms" }}
          >
            <div className="flex items-baseline gap-2">
              <p className="font-semibold">{card.name}</p>
              <span className="ml-auto text-[12px] text-ink/62">{detail.stage}</span>
            </div>
            <dl className="mt-2.5 grid grid-cols-3 gap-2">
              {detail.numbers.map((n) => (
                <div key={n.label}>
                  <dt className="text-[11px] text-ink/62">{n.label}</dt>
                  <dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{n.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {asked.map((q, i) => {
            const last = i === asked.length - 1;
            return (
              <Exchange
                key={q}
                q={q}
                stage={last ? stage : "done"}
                work={last ? work : 2}
                sent={sent.includes(q)}
                onSend={() => onSend(q)}
              />
            );
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
                {card.name}
                <Icon name="close" size={11} />
              </span>
            </div>
          )}
          <p className="px-3 pt-2.5 pb-6 text-ink/45">{lifted ? `Ask anything about ${card.name}, or tell the Core what to do` : "Ask the Core, or tell it what to do"}</p>
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

export default function CoreDemo() {
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
    const words = REPLIES[q].answer.split(" ").length;
    setAsked((a) => [...a, q]);
    setStage("idle");
    setWork(0);
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
    <div className="pt-8">
      <style>{`
        @keyframes core-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .core-rise { animation: core-rise 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes core-attach { from { opacity: 0; transform: translateY(6px) scale(0.92); } to { opacity: 1; transform: none; } }
        .core-attach { animation: core-attach 0.45s 0.35s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
      <div className="relative" style={{ width: WIN.w, height: WIN.h, ...vars }}>
        {/* the dashboard falls away toward its bottom-left corner, its outline with it, strongest
            beside the Core: the fall-off is a mask on the whole window, so the page shows through */}
        <div className="relative" style={{ WebkitMaskImage: FALLOFF, maskImage: FALLOFF }}>
          <AppWindow
            theme={theme}
            active="pipeline"
            size="h-[800px] w-[1440px]"
            scroll={false}
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
          {/* and an even wash of the page's ground over all of it, border included; the selected
              card sits above it (the mask makes this wrapper the stacking context both share) */}
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
      </div>
      <div className="mt-14 flex items-center gap-4 text-[13px]">
        <button type="button" onClick={replay} className="cursor-pointer rounded-md border border-ink/15 px-3 py-1.5 font-medium">
          Replay
        </button>
        <span className="text-ink/60">
          {lifted ? `Asked: ${asked.join(", ") || "nothing yet"}; reply ${stage}` : "At rest"}
        </span>
      </div>
    </div>
  );
}
