"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { pipeline, type Card } from "@/lib/saguaro";
import { Chapter, Frame, Rail, Receipt, TopBar, inert } from "../shared";
import { ease, grow, onEnter, readyReplay, rise, setLive, stream } from "../shared/useSequence";

type Prompt = { label: string; answer: string; receipts: string[] };

/* the lit card's parchment below lg, and the same with no alpha for its arrival */
const PANEL = "#faf8f2";
const CLEAR = "rgba(250, 248, 242, 0)";

const cards = pipeline.stages.flatMap((s) => s.cards.map((c) => ({ card: c, stage: s.name })));
const cardOf = (id: string) => cards.find((c) => c.card.id === id)!;
/** the three scripted cards answer in full; the rest get the one generic answer */
function promptsOf(id: string): Prompt[] {
  const d = pipeline.details[id as keyof typeof pipeline.details];
  const labels = pipeline.details[pipeline.selected].prompts.map((p) => p.label);
  return labels.map((label, i) => (d ? d.prompts[i] : { label, ...pipeline.generic }));
}

/**
 * Chapter 04's choreography, on scroll-in (seconds from the frame reaching
 * the unified depth):
 *
 *   0.30  the stage headers rise, 90ms apart
 *   0.40  the cards deal in column by column: column i starts at 0.40 +
 *         0.15 i, its cards rising 60ms apart (0.7s each); the last column
 *         lands at about 1.9
 *   1.20  the selected card's highlight arrives (its hairline goes warm
 *         gray, 0.6s; below lg the card's parchment surface arrives)
 *   1.30  the detail panel slides in from the right (40px, 0.8s); below lg
 *         it expands in place beneath the card instead
 *   2.30  "Who is this?" fires on its own: the prompt drops into the mini
 *         Core thread (the bubble's row opens and the bubble lifts in),
 *         the answer's row opens at 3.2 and the answer streams in word
 *         chunks every 300ms, the receipts rise 80ms apart; done at about
 *         6.7 for Redrock
 *
 * Any card opens its panel (the panel slides out 0.35s, takes the card's
 * detail, slides back 0.7s; below lg the detail collapses, moves beneath
 * the tapped card, and expands) and asks "Who is this?" after a 0.5s beat.
 * Any prompt button fires its prompt into the thread the same way; a
 * click while an exchange runs waits its turn. Replay resets the board to
 * Redrock and deals again. Reduced motion and no-JS get the finished
 * state: Redrock open with "Who is this?" answered, every control
 * presentation only.
 */
function usePipelineMotion(frame: RefObject<HTMLDivElement | null>, replay: RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(el);

    /* below lg the board is a snap scroller; open it on the selected
       card's stage, whatever the motion setting (Replay brings it back) */
    const homeBoard = () => {
      const board = q<HTMLElement>("[data-board]")[0];
      const col = q<HTMLElement>(`[data-stage='${cardOf(pipeline.selected).stage}']`)[0];
      if (board && col) board.scrollLeft = col.offsetLeft - parseFloat(getComputedStyle(board).paddingLeft);
    };
    mm.add("(max-width: 1023px)", homeBoard);

    mm.add({ motion: "(prefers-reduced-motion: no-preference)", lg: "(min-width: 1024px)" }, (ctx) => {
      const { motion, lg } = ctx.conditions as { motion: boolean; lg: boolean };
      if (!motion) return;

      const shell = el.firstElementChild as HTMLElement;
      const headers = q<HTMLElement>("[data-seq='header']");
      const columns = q<HTMLElement>("[data-stage]");
      const cardEls = q<HTMLElement>("[data-card]");
      const faces = q<HTMLButtonElement>("[data-card] > button");
      const detail = q<HTMLElement>("[data-detail]")[0];
      const name = detail.querySelector<HTMLElement>("[data-d='name']")!;
      const since = detail.querySelector<HTMLElement>("[data-d='since']")!;
      const tiles = detail.querySelector<HTMLElement>("[data-d='tiles']")!;
      const tileEls = Array.from(tiles.children) as HTMLElement[];
      const last = detail.querySelector<HTMLElement>("[data-d='last']")!;
      const buttons = Array.from(detail.querySelectorAll<HTMLButtonElement>("[data-prompt]"));
      const thread = detail.querySelector<HTMLElement>("[data-thread]")!;
      const template = detail.querySelector<HTMLElement>("[data-exchange]")!;
      const receiptTemplate = template.querySelector<HTMLElement>("[data-seq='r']")!.cloneNode(true) as HTMLElement;
      const home = cardOf(pipeline.selected);
      const homeEl = cardEls.find((c) => c.dataset.card === home.card.id)!;
      const homeAnswer = template.querySelector<HTMLElement>("[data-answer]")!.textContent ?? "";
      const homeReceipts = Array.from(template.querySelectorAll<HTMLElement>("[data-seq='r']"));
      const line = getComputedStyle(shell).getPropertyValue("--line").trim();
      const mark = () => getComputedStyle(homeEl).getPropertyValue("--mark").trim() || "#b8b2a7";

      let current = home.card.id;
      let state: "dealing" | "running" | "idle" = "dealing";
      let running: gsap.core.Timeline | null = null;
      let beat: gsap.core.Tween | null = null;
      let pending: (() => void) | null = null;
      let exchanges = 0;

      const follow = () => {
        if (lg) thread.scrollTop = thread.scrollHeight;
      };
      const setButtons = (on: boolean) => buttons.forEach((b) => setLive(b, on));

      /* an exchange's rows collapsed and its pieces hidden */
      const collapseExchange = (ex: HTMLElement) => {
        gsap.set(ex.querySelectorAll("[data-grow]"), { height: 0, overflow: "hidden" });
        gsap.set(ex.querySelectorAll("[data-seq]"), { opacity: 0 });
      };
      /* the thread back to its one collapsed exchange, Redrock's "Who is this?" */
      const resetThread = () => {
        Array.from(thread.querySelectorAll<HTMLElement>("[data-exchange]"))
          .filter((x) => x !== template)
          .forEach((x) => x.remove());
        const answer = template.querySelector<HTMLElement>("[data-answer]")!;
        answer.textContent = homeAnswer;
        template.querySelector<HTMLElement>("[data-receipts]")!.replaceChildren(...homeReceipts);
        template.querySelector<HTMLElement>("[data-seq='q']")!.textContent = promptsOf(home.card.id)[0].label;
        collapseExchange(template);
        exchanges = 0;
      };
      /* the panel's texts for a card: a scripted card's detail, or the card's own fields */
      const setPanel = (id: string) => {
        const { card } = cardOf(id);
        const d = pipeline.details[id as keyof typeof pipeline.details];
        name.textContent = card.name;
        since.textContent = d ? d.since : `${card.place} · ${card.kind}`;
        const numbers = d ? d.numbers : [{ label: "Loan amount", value: card.amount }, { label: "Rate", value: card.rate }];
        tileEls.forEach((t, i) => {
          const n = numbers[i];
          t.style.display = n ? "" : "none";
          if (!n) return;
          t.querySelector<HTMLElement>("[data-d='tlabel']")!.textContent = n.label;
          t.querySelector<HTMLElement>("[data-d='tvalue']")!.textContent = n.value;
        });
        tiles.dataset.tiles = String(numbers.length);
        last.textContent = d ? `Last touch: ${d.lastTouch}` : "";
        last.style.display = d ? "" : "none";
      };
      const setCurrent = (id: string) => {
        const from = cardEls.find((c) => c.dataset.card === current)!;
        const to = cardEls.find((c) => c.dataset.card === id)!;
        from.classList.remove("product-card-active", "product-lit-narrow", "product-card-open");
        to.classList.add("product-card-active", "product-lit-narrow", "product-card-open");
        to.appendChild(detail);
        current = id;
      };

      const finish = () => {
        running = null;
        state = "idle";
        readyReplay(replay.current);
        if (pending) {
          const next = pending;
          pending = null;
          beat = gsap.delayedCall(0.4, next);
        }
      };
      /* a prompt drops into the thread and its answer streams in */
      const fire = (i: number) => {
        if (state !== "idle") {
          pending = () => fire(i);
          return;
        }
        state = "running";
        const p = promptsOf(current)[i];
        let ex = template;
        if (exchanges) {
          ex = template.cloneNode(true) as HTMLElement;
          thread.appendChild(ex);
        }
        exchanges += 1;
        ex.querySelector<HTMLElement>("[data-seq='q']")!.textContent = p.label;
        const answer = ex.querySelector<HTMLElement>("[data-answer]")!;
        answer.textContent = p.answer;
        const receiptsRow = ex.querySelector<HTMLElement>("[data-receipts]")!;
        receiptsRow.replaceChildren(
          ...p.receipts.map((r) => {
            const node = receiptTemplate.cloneNode(true) as HTMLElement;
            node.querySelector(".product-chip")!.lastChild!.textContent = r;
            return node;
          })
        );
        collapseExchange(ex);
        const grows = Array.from(ex.querySelectorAll<HTMLElement>("[data-grow]"));
        const tl = gsap.timeline({ defaults: { ease: ease() }, onUpdate: follow, onComplete: finish });
        running = tl;
        grow(tl, grows[0], 0);
        rise(tl, ex.querySelector<HTMLElement>("[data-seq='q']")!, 0.2, 12);
        grow(tl, grows[1], 0.9);
        tl.set(answer, { opacity: 1 }, 0.9);
        const end = stream(tl, answer, 1.1);
        grow(tl, grows[2], end + 0.2);
        rise(tl, Array.from(receiptsRow.querySelectorAll<HTMLElement>("[data-seq='r']")), end + 0.4, 8, 0.08);
      };
      /* a card opens its panel and asks "Who is this?" */
      const open = (id: string) => {
        if (state !== "idle") {
          pending = () => open(id);
          return;
        }
        if (id === current) return;
        state = "running";
        const from = cardEls.find((c) => c.dataset.card === current)!;
        const to = cardEls.find((c) => c.dataset.card === id)!;
        const tl = gsap.timeline({
          defaults: { ease: ease() },
          onComplete: () => {
            running = null;
            state = "idle";
            beat = gsap.delayedCall(0.5, () => fire(0));
          },
        });
        running = tl;
        if (lg) {
          tl.to(detail, { x: 24, opacity: 0, duration: 0.35 }, 0);
          tl.to(from, { borderColor: line, duration: 0.35 }, 0);
          tl.add(() => {
            setCurrent(id);
            setPanel(id);
            resetThread();
            gsap.set(from, { clearProps: "borderColor" });
            gsap.set(to, { borderColor: line });
          }, 0.35);
          tl.to(to, { borderColor: mark(), duration: 0.6, clearProps: "borderColor" }, 0.4);
          tl.fromTo(detail, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, 0.4);
        } else {
          tl.to(detail, { opacity: 0, duration: 0.3 }, 0);
          tl.set(detail, { overflow: "hidden" }, 0.1);
          tl.to(detail, { height: 0, duration: 0.6 }, 0.1);
          tl.to(from, { backgroundColor: CLEAR, duration: 0.5 }, 0.2);
          tl.add(() => {
            setCurrent(id);
            setPanel(id);
            resetThread();
            gsap.set(from, { clearProps: "backgroundColor" });
            gsap.set(to, { backgroundColor: CLEAR });
          }, 0.7);
          tl.to(to, { backgroundColor: PANEL, duration: 0.6, clearProps: "backgroundColor" }, 0.75);
          tl.to(detail, { height: "auto", duration: 0.6, onComplete: () => gsap.set(detail, { clearProps: "height,overflow" }) }, 0.75);
          tl.to(detail, { opacity: 1, duration: 0.6 }, 0.85);
        }
      };

      /* the board before the deal: headers and cards hidden, the highlight
         and the panel not yet there, the thread collapsed, Redrock current */
      const reset = () => {
        beat?.kill();
        running?.kill();
        running = null;
        pending = null;
        state = "dealing";
        if (current !== home.card.id) {
          setCurrent(home.card.id);
          setPanel(home.card.id);
        }
        resetThread();
        gsap.set(cardEls, { clearProps: "borderColor,backgroundColor" });
        gsap.set(headers, { opacity: 0, y: 8 });
        /* the card fades on its item and rises on its face: a transform on
           the item would make it the panel's containing block */
        gsap.set(cardEls, { opacity: 0 });
        gsap.set(faces, { y: 14 });
        gsap.set(homeEl, { borderColor: line });
        gsap.set(detail, { clearProps: "height,overflow,transform" });
        if (lg) gsap.set(detail, { opacity: 0, x: 40 });
        else {
          gsap.set(homeEl, { backgroundColor: CLEAR });
          gsap.set(detail, { opacity: 0, height: 0, overflow: "hidden" });
        }
        setButtons(false);
      };
      const deal = gsap.timeline({
        paused: true,
        defaults: { ease: ease() },
        onComplete: () => {
          gsap.set(faces, { clearProps: "transform" });
          state = "idle";
          setButtons(true);
          fire(0);
        },
      });
      deal.to(headers, { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, 0.3);
      columns.forEach((col, i) => {
        const its = cardEls.filter((c) => col.contains(c));
        deal.to(its, { opacity: 1, duration: 0.7, stagger: 0.06 }, 0.4 + i * 0.15);
        deal.to(faces.filter((f) => col.contains(f)), { y: 0, duration: 0.7, stagger: 0.06 }, 0.4 + i * 0.15);
      });
      deal.to(homeEl, { borderColor: mark(), duration: 0.6, clearProps: "borderColor" }, 1.2);
      if (lg) {
        deal.to(detail, { opacity: 1, x: 0, duration: 0.8 }, 1.3);
      } else {
        deal.to(homeEl, { backgroundColor: PANEL, duration: 0.6, clearProps: "backgroundColor" }, 1.2);
        deal.to(detail, { height: "auto", duration: 0.6, onComplete: () => gsap.set(detail, { clearProps: "height,overflow" }) }, 1.3);
        deal.to(detail, { opacity: 1, duration: 0.6 }, 1.4);
      }
      deal.to({}, { duration: 0.2 }, 2.1);

      /* below lg the frame takes the product's height: hold the shell at the
         finished height so the band never moves as the detail expands */
      const held = lg ? 0 : el.offsetHeight;
      if (held) shell.style.minHeight = `${held}px`;

      reset();
      faces.forEach((f) => setLive(f, true));
      const onFace = (ev: Event) => open((ev.currentTarget as HTMLElement).parentElement!.dataset.card!);
      const onPrompt = (ev: Event) => fire(Number((ev.currentTarget as HTMLElement).dataset.prompt));
      const onReplay = () => {
        reset();
        if (!lg) homeBoard();
        deal.restart();
      };
      faces.forEach((f) => f.addEventListener("click", onFace));
      buttons.forEach((b) => b.addEventListener("click", onPrompt));
      const btn = replay.current;
      btn?.addEventListener("click", onReplay);
      const off = onEnter(el, () => deal.play(0));

      return () => {
        off();
        beat?.kill();
        running?.kill();
        deal.kill();
        faces.forEach((f) => f.removeEventListener("click", onFace));
        buttons.forEach((b) => b.removeEventListener("click", onPrompt));
        btn?.removeEventListener("click", onReplay);
        if (current !== home.card.id) {
          setCurrent(home.card.id);
          setPanel(home.card.id);
        }
        resetThread();
        gsap.set([headers, cardEls, faces, detail, ...template.querySelectorAll<HTMLElement>("[data-grow],[data-seq]")], { clearProps: "all" });
        const answer = template.querySelector<HTMLElement>("[data-answer]")!;
        answer.textContent = homeAnswer;
        faces.forEach((f) => setLive(f, false));
        setButtons(false);
        shell.style.minHeight = "";
      };
    });

    return () => mm.revert();
  }, [frame, replay]);
}

/**
 * Chapter 04. The board with every stage; one card highlighted and its
 * detail open with "Who is this?" already asked and answered. At lg the
 * panel is the lit element, a parchment card floating inset over the board
 * (the columns grow to fill the overflowing shell, so the last one is cut
 * by the frame's right edge and they run into the bottom cut, dissolving at
 * both); the panel lives in the selected card's list item, out of the flow.
 * Below lg the board is a snap scroller of columns at real scale (two in
 * view where the width allows, the next peeking past a short fade) and the
 * same detail sits in the flow beneath the selected card, which is the lit
 * element. Server-rendered: Redrock open, the first exchange complete.
 */
export default function Pipeline() {
  const frame = useRef<HTMLDivElement>(null);
  const replay = useRef<HTMLButtonElement>(null);
  usePipelineMotion(frame, replay);
  const selected = cardOf(pipeline.selected).card;
  const detail = pipeline.details[pipeline.selected];
  const [who, ...rest] = detail.prompts;

  return (
    <div data-chapter="04">
      <Chapter
        claim="Every client, every stage, and the whole history one click away."
        body="Every deal the team is working, in the stage it is actually in, synced from the tool they already track it in. Open one and ask the Core about it in a click."
        controls={
          <button ref={replay} type="button" className="product-replay" tabIndex={-1}>
            Replay
          </button>
        }
      >
        <Frame ref={frame} fade="corner" fitNarrow height="h-auto lg:h-[800px]">
          <Rail active="folder" />
          <div className="relative flex min-w-0 flex-1 flex-col">
            <TopBar />
            <div className="flex min-h-0 flex-1">
              <div className="product-board flex min-w-0 flex-1 gap-4 p-6" data-board>
                {pipeline.stages.map((stage) => (
                  <section key={stage.name} data-stage={stage.name} className="min-w-[200px] flex-1">
                    <div className="flex items-baseline justify-between" data-seq="header">
                      <p className="product-strong">{stage.name}</p>
                      <span className="product-t3">{stage.cards.length}</span>
                    </div>
                    <ul className="mt-3 flex flex-col gap-2">
                      {stage.cards.map((card) => (
                        <li
                          key={card.id}
                          data-card={card.id}
                          data-seq="card"
                          className={`product-card ${
                            card.id === pipeline.selected ? "product-card-active product-lit-narrow product-card-open" : ""
                          }`}
                        >
                          <CardFace card={card} />
                          {card.id === pipeline.selected && (
                            <div className="product-float product-lit product-detail" data-detail data-seq="panel">
                              <p className="product-title" data-d="name">
                                {selected.name}
                              </p>
                              <p className="product-t2 mt-1" data-d="since">
                                {detail.since}
                              </p>
                              <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-3" data-d="tiles" data-tiles="3">
                                {detail.numbers.map((n) => (
                                  <div key={n.label} className="product-tile p-3">
                                    <p className="product-label" data-d="tlabel">
                                      {n.label}
                                    </p>
                                    <p className="product-num-sm mt-1" data-d="tvalue">
                                      {n.value}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <p className="product-label mt-4" data-d="last">
                                Last touch: {detail.lastTouch}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-2">
                                <button type="button" {...inert} data-prompt="0" className="product-button">
                                  {who.label}
                                </button>
                                {rest.map((p, i) => (
                                  <button
                                    key={p.label}
                                    type="button"
                                    {...inert}
                                    data-prompt={i + 1}
                                    className="product-button product-button-quiet"
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                              <div className="product-thread product-hr mt-5 min-h-0 pt-1" data-thread>
                                <div data-exchange>
                                  <div data-grow>
                                    <p className="product-bubble mt-3" data-seq="q">
                                      {who.label}
                                    </p>
                                  </div>
                                  <div data-grow>
                                    <p className="mt-3" data-seq="a" data-answer>
                                      {who.answer}
                                    </p>
                                  </div>
                                  <div data-grow>
                                    <div className="mt-2 flex flex-wrap gap-1.5 pb-1" data-receipts>
                                      {who.receipts.map((r) => (
                                        <span key={r} data-seq="r">
                                          <Receipt>{r}</Receipt>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </Frame>
      </Chapter>
    </div>
  );
}

/** a card's face: what the board shows, and the control that opens it under JS */
function CardFace({ card }: { card: Card }) {
  return (
    <button type="button" {...inert} className="product-card-face">
      <span className="product-strong block">{card.name}</span>
      <span className="product-label block">
        {card.place} · {card.kind}
      </span>
      <span className="mt-2 flex items-baseline justify-between">
        <span>{card.amount}</span>
        <span className="product-t3">{card.rate}</span>
      </span>
      {card.note && <span className="product-label mt-1 block">{card.note}</span>}
    </button>
  );
}
