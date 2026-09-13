"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { agents, type AgentStatus } from "@/lib/saguaro";
import { Chapter, Check, Dot, Frame, Rail, TopBar, inert } from "../shared";
import { ease, grow, onEnter, primeDraw, readyReplay, rise, setLive, swapText } from "../shared/useSequence";

const ROW = "grid w-full grid-cols-1 gap-2 text-left sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:gap-6";
const LIT = agents.roster[0].id;

/**
 * Chapter 05's live moment, about six seconds from the frame reaching the
 * unified depth:
 *
 *   0.30  "Agents" and the running count rise
 *   0.45  the five rows slide in 80ms apart; the inbox agent is reading
 *         ("Reading 14 new", its ring turning), the follow-up agent is
 *         scheduled ("Runs at 6:10 am"), the screening agent's mark is a
 *         dot, the filing agent's ring turns (and keeps turning: the one
 *         loop the run allows)
 *   0.90  the inbox count ticks 14 down to 1 over 2.4s
 *   1.60  the follow-up agent goes running: its dot becomes a ring and its
 *         status reads "Checking 11 open deals"; the count reads 3 running
 *   2.60  the screening agent's check pops in (scale and draw)
 *   3.40  the inbox agent settles: its ring becomes a drawn check, its
 *         status reads "3 drafts ready for your yes", its last result
 *         rises; 2 running
 *   4.20  the follow-up agent settles: its ring becomes a dot, "1 draft
 *         waiting", its last result rises; 1 running
 *   4.80  the inbox row's log opens, its three lines rising 80ms apart
 *   5.80  still; Replay appears
 *
 * A row, clicked, opens its last run's log (one open at a time). "Hand it
 * off" adds a running row for the composed task under the roster, the
 * count ticks up, and the composer clears to its placeholder. Replay
 * resets the roster and plays the moment again. Reduced motion and no-JS
 * get the settled roster with the inbox log open and the composer holding
 * its task.
 */
function useAgentsMotion(frame: RefObject<HTMLDivElement | null>, replay: RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);
      const title = q<HTMLElement>("[data-seq='title']");
      const count = q<HTMLElement>("[data-running]")[0];
      const rows = q<HTMLElement>("[data-agent]");
      const rowButtons = q<HTMLButtonElement>("[data-row]");
      const logs = q<HTMLElement>("[data-log]");
      const handoffRow = q<HTMLElement>("[data-handoff-row]")[0];
      const handoffInner = handoffRow.firstElementChild as HTMLElement;
      const task = q<HTMLElement>("[data-task]")[0];
      const handoff = q<HTMLButtonElement>("[data-handoff]")[0];
      const rings = q<SVGSVGElement>(".product-ring");
      const settled = count.textContent ?? "1";
      const taskText = task.textContent ?? "";

      const rowOf = (id: string) => rows.find((r) => r.dataset.agent === id)!;
      const status = (id: string) => rowOf(id).querySelector<HTMLElement>("[data-status]")!;
      const lastOf = (id: string) => rowOf(id).querySelector<HTMLElement>("[data-last]")!;
      const face = (id: string, i: number) => rowOf(id).querySelector<HTMLElement>(`[data-face='${i}']`)!;
      const finalFace = (id: string) => rowOf(id).querySelector<HTMLElement>("[data-face='final']")!;
      const checkPath = (id: string) => finalFace(id).querySelector("path") as SVGPathElement;
      const inbox = agents.roster.find((a) => a.id === "inbox")!;
      const followUp = agents.roster.find((a) => a.id === "follow-up")!;
      const lens = { inbox: primeDraw(checkPath("inbox")), screening: primeDraw(checkPath("screening")) };
      const logOf = (row: HTMLElement) => row.querySelector<HTMLElement>("[data-log]")!;
      const lines = (log: HTMLElement) => Array.from(log.querySelectorAll<HTMLElement>("[data-seq='line']"));

      let openRow: HTMLElement | null = rowOf(LIT);
      const spins = new Map<Element, gsap.core.Tween>();
      let handedOff = false;
      let sequence: gsap.core.Timeline | null = null;

      /* the rings turn as long as their agents run: 1.2s a turn, linear */
      const ringIn = (face: Element) => face.querySelector(".product-ring")!;
      const spin = (ring: Element) => {
        spins.get(ring)?.kill();
        spins.set(ring, gsap.to(ring, { rotation: 360, duration: 1.2, ease: "none", repeat: -1, transformOrigin: "50% 50%" }));
      };
      const stopSpin = (ring: Element) => {
        spins.get(ring)?.kill();
        spins.delete(ring);
      };
      const stopSpins = () => {
        spins.forEach((s) => s.kill());
        spins.clear();
        gsap.set(rings, { clearProps: "transform" });
      };
      /* a face swaps for the next: the old one fades and shrinks, the new one lands */
      const turn = (tl: gsap.core.Timeline, from: HTMLElement, to: HTMLElement, at: number) => {
        tl.to(from, { opacity: 0, scale: 0.6, duration: 0.3 }, at);
        tl.fromTo(to, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45 }, at + 0.15);
      };
      const setCount = (tl: gsap.core.Timeline, n: number, at: number) => swapText(tl, count, String(n), at);
      const openLog = (tl: gsap.core.Timeline, row: HTMLElement, at: number) => {
        const log = logOf(row);
        tl.set(log, { display: "block", height: 0, overflow: "hidden" }, at);
        grow(tl, log, at);
        tl.fromTo(lines(log), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, at + 0.15);
      };
      const closeLog = (tl: gsap.core.Timeline, row: HTMLElement, at: number) => {
        const log = logOf(row);
        tl.to(lines(log), { opacity: 0, duration: 0.3 }, at);
        tl.to(
          log,
          {
            height: 0,
            duration: 0.5,
            onComplete: () => {
              gsap.set(log, { clearProps: "height,overflow" });
              gsap.set(log, { display: "none" });
            },
          },
          at + 0.1
        );
      };

      /* the roster before the moment: rows hidden, the live statuses on,
         every log closed, the hand-off row out of the flow, the composer full */
      const reset = () => {
        sequence?.kill();
        sequence = null;
        stopSpins();
        gsap.set(title, { opacity: 0, y: 14 });
        gsap.set(rows, { opacity: 0, x: -14 });
        gsap.set(q("[data-face]"), { clearProps: "opacity,transform" });
        gsap.set(finalFace("screening"), { opacity: 0 });
        gsap.set(checkPath("inbox"), { strokeDashoffset: lens.inbox });
        gsap.set(checkPath("screening"), { strokeDashoffset: lens.screening });
        status("inbox").textContent = inbox.live![0].text;
        status("follow-up").textContent = followUp.live![0].text;
        gsap.set([lastOf("inbox"), lastOf("follow-up")], { opacity: 0 });
        gsap.set([status("inbox"), status("follow-up"), count, task], { opacity: 1 });
        count.textContent = String(Number(settled) + 1);
        logs.forEach((log) => {
          gsap.set(log, { clearProps: "height,overflow" });
          gsap.set(log, { display: "none" });
        });
        rowButtons.forEach((b) => b.setAttribute("aria-expanded", "false"));
        openRow = null;
        gsap.set(handoffRow, { clearProps: "display" });
        gsap.set(handoffInner, { clearProps: "height,overflow" });
        handedOff = false;
        task.textContent = taskText;
        task.classList.add("is-composed");
        spin(ringIn(face("inbox", 0)));
        spin(ringIn(finalFace("filing")));
      };

      const build = () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: ease() } });
        tl.to(title, { opacity: 1, y: 0, duration: 0.6 }, 0.3);
        tl.to(rows, { opacity: 1, x: 0, duration: 0.7, stagger: 0.08 }, 0.45);
        /* the inbox reads its 14 new, one every 180ms */
        const n = { v: 14 };
        tl.to(n, { v: 1, duration: 2.4, ease: "steps(13)", onUpdate: () => (status("inbox").textContent = `Reading ${Math.round(n.v)} new`) }, 0.9);
        /* the follow-up agent goes running */
        turn(tl, face("follow-up", 0), face("follow-up", 1), 1.6);
        tl.add(() => spin(ringIn(face("follow-up", 1))), 1.6);
        swapText(tl, status("follow-up"), followUp.live![1].text, 1.6);
        setCount(tl, Number(settled) + 2, 1.9);
        /* the screening agent's check pops into its empty slot */
        tl.fromTo(finalFace("screening"), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45 }, 2.7);
        tl.fromTo(checkPath("screening"), { strokeDashoffset: lens.screening }, { strokeDashoffset: 0, duration: 0.45 }, 2.75);
        /* the inbox settles */
        tl.to(face("inbox", 0), { opacity: 0, scale: 0.6, duration: 0.3 }, 3.4);
        tl.fromTo(finalFace("inbox"), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45 }, 3.5);
        tl.fromTo(checkPath("inbox"), { strokeDashoffset: lens.inbox }, { strokeDashoffset: 0, duration: 0.45 }, 3.55);
        swapText(tl, status("inbox"), inbox.status.text, 3.4);
        tl.add(() => stopSpin(ringIn(face("inbox", 0))), 3.7);
        rise(tl, lastOf("inbox"), 3.9, 6);
        setCount(tl, Number(settled) + 1, 3.7);
        /* the follow-up agent settles */
        turn(tl, face("follow-up", 1), finalFace("follow-up"), 4.2);
        swapText(tl, status("follow-up"), followUp.status.text, 4.2);
        tl.add(() => stopSpin(ringIn(face("follow-up", 1))), 4.5);
        rise(tl, lastOf("follow-up"), 4.7, 6);
        setCount(tl, Number(settled), 4.5);
        /* the inbox row shows what it did */
        openLog(tl, rowOf(LIT), 4.8);
        tl.add(() => {
          rowOf(LIT).querySelector("[data-row]")!.setAttribute("aria-expanded", "true");
          openRow = rowOf(LIT);
        }, 4.8);
        tl.to({}, { duration: 0.2 }, 5.6);
        tl.eventCallback("onComplete", () => readyReplay(replay.current));
        return tl;
      };

      const onRow = (ev: Event) => {
        const row = (ev.currentTarget as HTMLElement).parentElement as HTMLElement;
        const tl = gsap.timeline({ defaults: { ease: ease() } });
        if (openRow === row) {
          closeLog(tl, row, 0);
          row.querySelector("[data-row]")!.setAttribute("aria-expanded", "false");
          openRow = null;
          return;
        }
        if (openRow) {
          closeLog(tl, openRow, 0);
          openRow.querySelector("[data-row]")!.setAttribute("aria-expanded", "false");
        }
        openLog(tl, row, openRow ? 0.2 : 0);
        row.querySelector("[data-row]")!.setAttribute("aria-expanded", "true");
        openRow = row;
      };
      const onHandoff = () => {
        if (handedOff) return;
        handedOff = true;
        setLive(handoff, false);
        const tl = gsap.timeline({ defaults: { ease: ease() } });
        tl.to(task, { opacity: 0, duration: 0.3 }, 0);
        tl.add(() => {
          task.textContent = agents.handoff.placeholder;
          task.classList.remove("is-composed");
        }, 0.3);
        tl.to(task, { opacity: 1, duration: 0.3 }, 0.3);
        tl.set(handoffRow, { display: "block" }, 0.1);
        tl.set(handoffInner, { height: 0, overflow: "hidden" }, 0.1);
        grow(tl, handoffInner, 0.1);
        tl.fromTo(handoffInner.firstElementChild, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.7 }, 0.3);
        tl.add(() => spin(handoffRow.querySelector(".product-ring")!), 0.3);
        setCount(tl, Number(count.textContent) + 1, 0.5);
      };
      const onReplay = () => {
        reset();
        setLive(handoff, true);
        sequence = build();
        sequence.play(0);
      };

      reset();
      sequence = build();
      rowButtons.forEach((b) => {
        setLive(b, true);
        b.addEventListener("click", onRow);
      });
      setLive(handoff, true);
      handoff.addEventListener("click", onHandoff);
      const btn = replay.current;
      btn?.addEventListener("click", onReplay);
      const off = onEnter(el, () => sequence?.play(0));

      return () => {
        off();
        sequence?.kill();
        stopSpins();
        rowButtons.forEach((b) => {
          setLive(b, false);
          b.removeEventListener("click", onRow);
          b.setAttribute("aria-expanded", b.parentElement?.dataset.agent === LIT ? "true" : "false");
        });
        setLive(handoff, false);
        handoff.removeEventListener("click", onHandoff);
        btn?.removeEventListener("click", onReplay);
        gsap.set([title, rows, logs, handoffRow, handoffInner, task, count, ...q("[data-face]"), ...q("[data-status],[data-last]"), ...q("[data-log] li")], { clearProps: "all" });
        status("inbox").textContent = inbox.status.text;
        status("follow-up").textContent = followUp.status.text;
        count.textContent = settled;
        task.textContent = taskText;
        task.classList.add("is-composed");
      };
    });

    return () => mm.revert();
  }, [frame, replay]);
}

/** a status's mark: a turning ring while running, a check when done, a dot otherwise */
function Face({ kind }: { kind: AgentStatus["kind"] }) {
  if (kind === "running") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="product-ring flex-none" aria-hidden>
        <circle cx="7" cy="7" r="5" stroke="var(--line)" strokeWidth="1.5" />
        <path d="M7 2a5 5 0 0 1 5 5" stroke="var(--mark)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "done") return <Check />;
  return <Dot tone={kind === "waiting" ? "ink" : "watch"} />;
}

/**
 * A status mark's slot: the faces the live moment plays through exist only
 * under the .js gate (the first showing), and the settled face carries
 * data-seq so no-JS and reduced motion show it and nothing shifts.
 */
function StatusMark({ status, live }: { status: AgentStatus; live?: AgentStatus[] }) {
  return (
    <span className="product-mark">
      {live?.map((s, i) => (
        <span key={s.text} className={`product-face ${i === 0 ? "product-face-first" : ""}`} data-face={i} aria-hidden>
          <Face kind={s.kind} />
        </span>
      ))}
      <span className="product-face product-face-final" data-face="final" data-seq={live ? "face" : undefined}>
        <Face kind={status.kind} />
      </span>
    </span>
  );
}

/**
 * Chapter 05. The roster after the live moment (the inbox agent done, the
 * follow-up agent waiting, the filing agent still running), each row a
 * control that opens its last run's log (the inbox's open), the hand-off
 * composer with its task ready, and below it the spec's two spares, not
 * yet running, into the bottom fade. The lit element is the inbox agent's
 * row, the one the live moment lands on. The product fits the frame's
 * width, so the top bar's rule stops inside the right edge.
 */
export default function Agents() {
  const frame = useRef<HTMLDivElement>(null);
  const replay = useRef<HTMLButtonElement>(null);
  useAgentsMotion(frame, replay);
  const running = agents.roster.filter((a) => a.status.kind === "running").length;

  return (
    <div data-chapter="05">
      <Chapter
        index="05"
        label="Agents"
        claim="Each one has a single job. They run while you don't."
        body="Custom agents built for the work your team names: reading the inbox, chasing the silent deal, drafting the report. Each one reports what it did and waits for your yes before anything leaves the building."
        controls={
          <button ref={replay} type="button" className="product-replay" tabIndex={-1}>
            Replay
          </button>
        }
      >
        <Frame ref={frame} fade="bottom" fit height="h-auto lg:h-[800px]">
          <Rail active="settings" />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar inset />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-baseline gap-3" data-seq="title">
                <p className="product-title">Agents</p>
                <span className="product-t3">
                  <span data-running>{running}</span> running
                </span>
              </div>
              <ul className="product-rule mt-3">
                {agents.roster.map((agent) => {
                  const lit = agent.id === LIT;
                  return (
                    <li
                      key={agent.id}
                      data-agent={agent.id}
                      data-seq="row"
                      className={lit ? "product-lit -mx-3 rounded-xl px-3" : ""}
                    >
                      <button type="button" {...inert} aria-expanded={lit} data-row className={`product-row py-3.5 ${ROW}`}>
                        <span className="block min-w-0">
                          <span className="product-strong block">{agent.name}</span>
                          <span className="product-label mt-0.5 block">{agent.job}</span>
                        </span>
                        <span className="block min-w-0">
                          <span className="flex items-center gap-2">
                            <StatusMark status={agent.status} live={agent.live} />
                            <span data-status>{agent.status.text}</span>
                          </span>
                          <span className="product-label mt-0.5 block" data-last>
                            {agent.lastResult}
                          </span>
                        </span>
                      </button>
                      <div data-log className={`${ROW} ${lit ? "" : "hidden"}`}>
                        <ul className="product-label space-y-0.5 pb-3.5 sm:col-start-2">
                          {agent.log.map((line) => (
                            <li key={line} data-seq="line">
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
                <li data-handoff-row className="hidden">
                  <div>
                    <div className={`py-3.5 ${ROW}`}>
                      <span className="block min-w-0">
                        <span className="product-strong block">{agents.handoff.task}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="product-mark">
                          <span className="product-face product-face-final">
                            <Face kind={agents.handoff.status.kind} />
                          </span>
                        </span>
                        <span>{agents.handoff.status.text}</span>
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="product-input mt-6">
                <span className="product-input-text is-composed min-w-0 flex-1 truncate" data-task>
                  {agents.handoff.task}
                </span>
                <button type="button" {...inert} data-handoff className="product-button">
                  {agents.handoff.button}
                </button>
              </div>
              <p className="product-title mt-8">Available</p>
              <ul className="product-rule mt-3">
                {agents.spares.map((spare) => (
                  <li key={spare.id} data-spare={spare.id} className={`py-3.5 ${ROW}`}>
                    <div className="min-w-0">
                      <p className="product-strong">{spare.name}</p>
                      <p className="product-label mt-0.5">{spare.job}</p>
                    </div>
                    <p className="flex items-center gap-2">
                      <Dot tone="watch" />
                      <span>Not running</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Frame>
      </Chapter>
    </div>
  );
}
