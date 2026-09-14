"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chat, today } from "@/lib/saguaro";
import { Chapter, Dot, Frame, Mark, Rail, Receipt, SendButton, Tile, TopBar, inert } from "../shared";
import { CHUNK_EVERY, chunk, ease, grow, primeDraw, readyReplay, rise, tick } from "../shared/useSequence";

gsap.registerPlugin(ScrollTrigger);

const MOTION = "(prefers-reduced-motion: no-preference)";

type Ex = {
  root: HTMLElement;
  grows: HTMLElement[];
  bubble: HTMLElement;
  lines: HTMLElement[];
  ticks: HTMLElement[];
  paths: SVGPathElement[];
  lens: number[];
  answer: HTMLElement;
  chunks: HTMLElement[];
  receipts: HTMLElement[];
  chip?: HTMLButtonElement;
  question: string;
};

/**
 * Chapter 03's mechanic, Linear's send. The first question sits composed in
 * the input beside a live send button. When the frame reaches the unified
 * depth it waits one beat (1.0s) and sends itself, unless the visitor sends
 * it first. From the send (seconds):
 *
 *   0.00  the input's text goes (0.3s) and the placeholder returns; the
 *         bubble's row opens into the thread (0.6s) and the message lifts
 *         into it (0.7s, from 12px below, 0.2 after the row starts)
 *   0.60  the first working line's row opens and the line rises; its dot
 *         turns into a drawn check at 1.25 (0.45s); the second line 0.6
 *         later
 *   2.10  the answer's row opens to its full height and the answer streams
 *         in word chunks, one every 300ms (about 3.6s for the first)
 *   then  the receipts rise 80ms apart, and the follow-up chips 80ms apart
 *
 * A follow-up chip, clicked: it fades and its row collapses, its question
 * lands in the input, a 0.6s beat, and the same send; after the answer the
 * remaining chip rises back. Three exchanges in all, then the frame is
 * still (or after the first, if nothing is clicked). The panel hugs its
 * thread, so it grows from the composer as the exchange arrives (the send
 * happens in view, not below the fold); at lg the thread stops 24 above
 * the fade and scrolls, and below lg the frame is held at the finished
 * exchange's height so the band stays put. Replay, in the caption
 * row, collapses the thread and composes the first question again. Reduced
 * motion and no-JS get the finished first exchange with the chips inert;
 * the input is never a field: nothing accepts typing.
 */
function useChatMotion(frame: RefObject<HTMLDivElement | null>, replay: RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION, () => {
      const q = gsap.utils.selector(el);
      const thread = q<HTMLElement>("[data-thread]")[0];
      const input = q<HTMLElement>("[data-input]")[0];
      const send = q<HTMLButtonElement>("[data-send]")[0];
      const grows = q<HTMLElement>("[data-grow]");
      const seqs = q<HTMLElement>("[data-seq]");
      const chipsRow = q<HTMLElement>("[data-chips]")[0];
      const chips = q<HTMLButtonElement>("[data-chip]");
      const pres = q<HTMLElement>(".product-mark-pre");
      const answers = q<HTMLElement>("[data-answer]");
      const originals = answers.map((a) => a.textContent ?? "");
      const allChunks: HTMLElement[] = [];
      answers.forEach((a, i) => {
        a.textContent = "";
        chunk(originals[i]).forEach((c) => {
          const s = document.createElement("span");
          s.textContent = c;
          a.appendChild(s);
          allChunks.push(s);
        });
      });
      const exchanges: Ex[] = chat.exchanges.map((e) => {
        const root = q<HTMLElement>(`[data-exchange='${e.id}']`)[0];
        const ticks = Array.from(root.querySelectorAll<HTMLElement>("[data-seq='tick']"));
        const paths = ticks.map((t) => t.querySelector("path") as SVGPathElement);
        const answer = root.querySelector<HTMLElement>("[data-answer]")!;
        return {
          root,
          grows: Array.from(root.querySelectorAll<HTMLElement>("[data-grow]")),
          bubble: root.querySelector<HTMLElement>("[data-seq='q']")!,
          lines: Array.from(root.querySelectorAll<HTMLElement>("[data-seq='w']")),
          ticks,
          paths,
          lens: paths.map(primeDraw),
          answer,
          chunks: Array.from(answer.querySelectorAll<HTMLElement>("span")),
          receipts: Array.from(root.querySelectorAll<HTMLElement>("[data-seq='r']")),
          chip: chips.find((c) => c.dataset.chip === e.id),
          question: e.question,
        };
      });

      let state: "composed" | "running" | "idle" | "done" = "composed";
      let composed: Ex | null = null;
      let running: gsap.core.Timeline | null = null;
      let beat: gsap.core.Tween | null = null;
      const used = new Set<HTMLButtonElement>();
      const remaining = () => chips.filter((c) => !used.has(c));

      const live = (btn: HTMLButtonElement, on: boolean) => {
        btn.tabIndex = on ? 0 : -1;
        if (on) btn.removeAttribute("aria-hidden");
        else btn.setAttribute("aria-hidden", "true");
      };
      const follow = () => {
        thread.scrollTop = thread.scrollHeight;
      };
      const setInput = (text: string, isComposed: boolean) => {
        input.textContent = text;
        input.classList.toggle("is-composed", isComposed);
      };
      const compose = (e: Ex) => {
        composed = e;
        state = "composed";
        setInput(e.question, true);
        live(send, true);
      };
      const armBeat = (delay: number) => {
        beat?.kill();
        beat = gsap.delayedCall(delay, sendNow);
      };
      /* the empty thread: every row collapsed, every piece hidden, the
         later exchanges out of the flow, the marks on their dots */
      const collapse = () => {
        gsap.set(grows, { height: 0, overflow: "hidden" });
        gsap.set(seqs, { opacity: 0 });
        gsap.set(allChunks, { opacity: 0 });
        exchanges.forEach((e, i) => {
          if (i) gsap.set(e.root, { clearProps: "display" });
          e.paths.forEach((p, j) => gsap.set(p, { strokeDashoffset: e.lens[j] }));
        });
        gsap.set(pres, { opacity: 1, scale: 1 });
        chips.forEach((c) => {
          gsap.set(c, { clearProps: "display" });
          live(c, false);
        });
        used.clear();
        live(send, false);
        setInput(chat.placeholder, false);
      };

      const finish = () => {
        running = null;
        const rest = remaining();
        state = rest.length ? "idle" : "done";
        rest.forEach((c) => live(c, true));
        readyReplay(replay.current);
      };
      const playExchange = (e: Ex) => {
        state = "running";
        composed = null;
        live(send, false);
        chips.forEach((c) => live(c, false));
        if (e.root.classList.contains("hidden")) gsap.set(e.root, { display: "block" });
        const tl = gsap.timeline({ defaults: { ease: ease() }, onUpdate: follow, onComplete: finish });
        running = tl;
        tl.to(input, { opacity: 0, duration: 0.3 }, 0);
        tl.add(() => setInput(chat.placeholder, false), 0.3);
        tl.to(input, { opacity: 1, duration: 0.3 }, 0.3);
        let t = 0;
        grow(tl, e.grows[0], t);
        rise(tl, e.bubble, t + 0.2, 12);
        t = 0.6;
        e.lines.forEach((line, i) => {
          grow(tl, e.grows[1 + i], t);
          rise(tl, line, t + 0.2, 8);
          tick(tl, e.ticks[i], e.paths[i], e.lens[i], t + 0.65);
          t += 0.6;
        });
        t += 0.3;
        grow(tl, e.grows[1 + e.lines.length], t);
        tl.set(e.answer, { opacity: 1 }, t);
        e.chunks.forEach((c, i) => tl.set(c, { opacity: 1 }, t + 0.2 + i * CHUNK_EVERY));
        t += 0.2 + e.chunks.length * CHUNK_EVERY + 0.2;
        grow(tl, e.grows[2 + e.lines.length], t);
        rise(tl, e.receipts, t + 0.2, 8, 0.08);
        t += 0.8;
        const rest = remaining();
        if (rest.length) {
          grow(tl, chipsRow, t);
          rise(tl, rest, t + 0.2, 8, 0.08);
        }
      };
      const sendNow = () => {
        beat?.kill();
        beat = null;
        if (!composed || state !== "composed") return;
        playExchange(composed);
      };
      const onChip = (ev: Event) => {
        if (state !== "idle") return;
        const chip = ev.currentTarget as HTMLButtonElement;
        const e = exchanges.find((x) => x.chip === chip);
        if (!e) return;
        used.add(chip);
        state = "running";
        chips.forEach((c) => live(c, false));
        const tl = gsap.timeline({
          defaults: { ease: ease() },
          onUpdate: follow,
          onComplete: () => {
            running = null;
            compose(e);
            send.focus({ preventScroll: true });
            armBeat(0.6);
          },
        });
        running = tl;
        tl.to(chip, { opacity: 0, duration: 0.3 }, 0);
        tl.set(chip, { display: "none" }, 0.3);
        tl.to(chipsRow, { height: 0, duration: 0.6 }, 0.1);
        tl.to(input, { opacity: 0, duration: 0.3 }, 0);
        tl.add(() => setInput(e.question, true), 0.3);
        tl.to(input, { opacity: 1, duration: 0.3 }, 0.3);
      };
      const onReplay = () => {
        beat?.kill();
        running?.kill();
        running = null;
        state = "running";
        live(send, false);
        chips.forEach((c) => live(c, false));
        const tl = gsap.timeline({
          defaults: { ease: ease() },
          onComplete: () => {
            running = null;
            collapse();
            compose(exchanges[0]);
            gsap.fromTo(input, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: ease() });
            armBeat(1.0);
          },
        });
        running = tl;
        tl.to(seqs, { opacity: 0, duration: 0.3 }, 0);
        tl.to(grows, { height: 0, duration: 0.6 }, 0.1);
        tl.to(input, { opacity: 0, duration: 0.3 }, 0.2);
      };

      /* below lg the frame takes the product's height; hold the shell at
         the finished exchange's height, with the panel at the top of its
         row, so the band never moves as the panel grows inside it (at lg
         the frame is 800 regardless) */
      const shell = el.firstElementChild as HTMLElement;
      const panel = q<HTMLElement>(".product-float")[0];
      const held = window.matchMedia("(min-width: 1024px)").matches ? 0 : el.offsetHeight;
      if (held) {
        shell.style.minHeight = `${held}px`;
        panel.style.alignSelf = "flex-start";
      }
      collapse();
      compose(exchanges[0]);
      ScrollTrigger.create({ trigger: el, start: "top 70%", once: true, onEnter: () => armBeat(1.0) });
      send.addEventListener("click", sendNow);
      chips.forEach((c) => c.addEventListener("click", onChip));
      const btn = replay.current;
      btn?.addEventListener("click", onReplay);
      return () => {
        beat?.kill();
        running?.kill();
        send.removeEventListener("click", sendNow);
        chips.forEach((c) => c.removeEventListener("click", onChip));
        btn?.removeEventListener("click", onReplay);
        answers.forEach((a, i) => {
          a.textContent = originals[i];
        });
        setInput(chat.placeholder, false);
        live(send, false);
        chips.forEach((c) => live(c, false));
        shell.style.minHeight = "";
        panel.style.alignSelf = "";
      };
    });

    return () => mm.revert();
  }, [frame, replay]);
}

/**
 * Chapter 03, the one dark chapter. The dashboard sits dimmed at the left
 * edge so the panel reads as docked over the product, not floating. The
 * panel is the lit element: at lg a charcoal card floating inset over the
 * morning dashboard, which is periphery at 40 and runs past the frame's
 * right and bottom cuts; below lg the panel takes the whole frame. The
 * composer reads in full. Server-rendered: the first exchange complete
 * (question, checked working lines, answer, receipts) and the two
 * follow-up chips, the input on its placeholder; the later exchanges are
 * in the markup, hidden, for the mechanic to play.
 */
export default function Chat() {
  const frame = useRef<HTMLDivElement>(null);
  const replay = useRef<HTMLButtonElement>(null);
  useChatMotion(frame, replay);
  const followUps = chat.exchanges.slice(1);

  return (
    <section className="bg-charcoal-deep text-ivory">
      <div className="px-6 py-24 sm:py-40 lg:px-12">
        <Chapter
          dark
          claim="Ask it anything the business has written down. It answers with receipts."
          body="Decisions, meetings, files, and six years of loans. Every answer shows its work: ask where a number came from and the Core cites the meeting, the email, or the file it lives in."
          controls={
            <button ref={replay} type="button" className="product-replay" tabIndex={-1}>
              Replay
            </button>
          }
        >
          <Frame ref={frame} dark fade="corner" fitNarrow height="h-auto lg:h-[800px]">
            <Rail active="chat" />
            <div className="relative flex min-w-0 flex-1 flex-col">
              <TopBar />
              <div className="flex min-h-0 flex-1">
                <div
                  className="product-periphery hidden min-w-0 flex-1 grid-cols-[minmax(0,1fr)_280px] gap-8 p-6 lg:grid"
                  aria-hidden
                >
                  <div className="min-w-0">
                    <p className="product-greeting">{today.greeting}</p>
                    <p className="product-t2 mt-1.5">{today.subline}</p>
                    <div className="mt-6 grid grid-cols-4 gap-3">
                      {today.tiles.map((tile) => (
                        <Tile key={tile.label} {...tile} />
                      ))}
                    </div>
                    <p className="product-title mt-8">Needs you today</p>
                    <ul className="product-rule mt-3">
                      {today.needsYou.map((item) => (
                        <li key={item.id} className="py-4">
                          <p className="product-strong">{item.title}</p>
                          <p className="product-t2 mt-1">{item.body}</p>
                        </li>
                      ))}
                    </ul>
                    <p className="product-label mt-3">{today.filedOvernight} filed overnight</p>
                    <ul className="product-rule mt-4">
                      {today.filed.map((f) => (
                        <li key={f.title} className="flex items-center justify-between gap-4 py-3">
                          <span>{f.title}</span>
                          <span className="product-t3 flex-none">{f.to}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <aside className="product-aside pl-6">
                    <p className="product-label">Today</p>
                    <ul className="mt-3 space-y-3">
                      {today.calendar.map((slot) => (
                        <li key={slot.time} className="flex gap-3">
                          <span className="product-t3 w-10 flex-none">{slot.time}</span>
                          <span className="min-w-0">{slot.title}</span>
                        </li>
                      ))}
                    </ul>
                  </aside>
                </div>

                <div className="product-float product-lit flex w-full flex-none flex-col lg:w-[440px]">
                  <div className="product-topbar flex h-11 flex-none items-center gap-2 px-5">
                    <Dot tone="accent" />
                    <span className="product-strong">The Core</span>
                  </div>
                  <div className="product-thread px-5 pb-4" data-thread>
                    {chat.exchanges.map((e, i) => (
                      <div key={e.id} data-exchange={e.id} className={i ? "hidden" : undefined}>
                        <div data-grow>
                          <p className="product-bubble mt-4" data-seq="q">
                            {e.question}
                          </p>
                        </div>
                        {e.working.map((line, j) => (
                          <div key={line} data-grow>
                            <p className={`product-t3 flex items-center gap-2 ${j ? "mt-1" : "mt-4"}`} data-seq="w">
                              <Mark seq="tick" />
                              {line}
                            </p>
                          </div>
                        ))}
                        <div data-grow>
                          <p className="mt-4" data-seq="a" data-answer>
                            {e.answer}
                          </p>
                        </div>
                        <div data-grow>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {e.receipts.map((r) => (
                              <span key={r} data-seq="r">
                                <Receipt>{r}</Receipt>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div data-grow data-chips>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {followUps.map((e) => (
                          <button key={e.id} type="button" {...inert} data-chip={e.id} data-seq="c" className="product-chip">
                            {e.question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-2">
                    <div className="product-input">
                      <span className="product-input-text flex-1" data-input>
                        {chat.placeholder}
                      </span>
                      <SendButton data-send="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Frame>
        </Chapter>
      </div>
    </section>
  );
}
