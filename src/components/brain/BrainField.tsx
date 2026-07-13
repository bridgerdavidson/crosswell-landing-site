"use client";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import NoteCard from "./NoteCard";
import { buildGraph, nodeHome, nodeSize, nodeAlpha, landPos, cardCenter, type GNode } from "./graph-data";
gsap.registerPlugin(ScrollTrigger);

// v3 "soft drop" (rev 2): the transcript card flies in, reads and sorts, then
// COMPACTS into the node; the node shrinks to normal size and glides to its
// spot; it drops in and the nearby dots part in a wave; only once it lands do
// its threads reach out to the core and neighbors; then the dots gather back in
// and settle as if it had always been there.
export default function BrainField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    const replay = replayRef.current;
    if (!canvas || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // leave the SSR still in place

    const stage = document.getElementById("brain-stage");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    stage?.setAttribute("data-mode", "live");

    const g = buildGraph();
    const { noteIndex } = g;
    const P = g.nodes.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, init: false }));
    const order = g.nodes.map((_, i) => i).sort((p, q) => g.nodes[p].z - g.nodes[q].z);

    // card DOM handles
    const inner = card.querySelector<HTMLElement>("[data-inner]");
    const badge = card.querySelector<HTMLElement>("[data-badge]");
    const rawEl = card.querySelector<HTMLElement>("[data-raw]");
    const sortedEl = card.querySelector<HTMLElement>("[data-sorted]");
    const phs = Array.from(card.querySelectorAll<HTMLElement>(".brain-ph"));
    const tags = Array.from(card.querySelectorAll<HTMLElement>(".brain-card-tag"));

    let W = 0, H = 0, DPR = 1, raf = 0, last = 0;
    let tAmb = 0; // continuous ambient time (brain keeps breathing)
    let clock = 0; // sequence clock (only runs during the beats)
    let playing = false, visible = true, replayShown = false;
    let cardW0 = 340, scaleMin = 0.12; // card unscaled width + collapse scale (set in resize)
    let noteHidden = true, noteScripted = true;
    let tagDeltas: { dx: number; dy: number }[] = [];
    let extractInit = false;

    const CONVERT_R = 20; // node radius the card collapses into
    const NORMAL_R = 5.5; // settled node radius

    // ---- timeline (~13s, roomier so each step reads) ----
    const T = {
      arriveA: 0.6, arriveB: 2.1,
      hlA: 2.8,
      sortA: 4.1, sortB: 5.2,
      convA: 6.0, convB: 7.0, // card compacts into the node
      placeEnd: 9.0, // one diagonal motion: shrink + glide + drop into place (no hover)
      connA: 9.1, connB: 10.1, // threads reach out once it lands
      gatherA: 10.1, gatherB: 12.5, // dots gather back + emphasis normalizes
      end: 12.9,
    };
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeIn = (t: number) => t * t; // gentle gravity for the drop
    const seg = (a: number, b: number) => Math.max(0, Math.min(1, (clock - a) / (b - a)));
    const lerpColor = (a: number[], b: number[], t: number) =>
      `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;

    // how much the field has parted into a circle around the drop (open on the
    // drop, hold through the connect, then close as the dots gather back)
    function partAmt() {
      // opens as the node drops into place at the end of its glide, holds through
      // the connect, then closes as the dots gather back
      if (clock < T.placeEnd - 0.6) return 0;
      if (clock < T.placeEnd + 0.1) return easeOut(seg(T.placeEnd - 0.6, T.placeEnd + 0.1));
      if (clock < T.gatherA) return 1;
      return 1 - easeInOut(seg(T.gatherA, T.gatherB));
    }
    // note node radius: big at convert, shrinks to normal over the single glide, then holds
    function noteR() {
      if (clock < T.convA) return 0;
      if (clock < T.convB) return CONVERT_R;
      if (clock < T.placeEnd - 0.3) return CONVERT_R + (NORMAL_R - CONVERT_R) * easeInOut(seg(T.convB, T.placeEnd - 0.3));
      return NORMAL_R;
    }
    // how far the note's threads have reached out (0 until it lands)
    function connectAmt() {
      if (clock < T.connA) return 0;
      if (clock < T.connB) return easeOut(seg(T.connA, T.connB));
      return 1;
    }
    // emphasis on the note's threads while it connects, fading to ordinary during gather
    function noteEmph() {
      if (clock < T.connA) return 0;
      if (clock < T.connB) return easeOut(seg(T.connA, T.connB));
      return 1 - easeInOut(seg(T.gatherA, T.gatherB));
    }

    function resize() {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas!.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas!.width = Math.round(W * DPR);
      canvas!.height = Math.round(H * DPR);
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      cardW0 = card!.offsetWidth || 340;
      scaleMin = (2 * CONVERT_R) / cardW0;
    }

    function col(c: number[], a: number) {
      return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    }

    // note is scripted (center -> hover -> land) until handoff, then springs at home == LAND
    function scriptNote() {
      const s = P[noteIndex];
      if (clock < T.convA) {
        noteHidden = true;
        noteScripted = true;
        return;
      }
      noteHidden = false;
      noteScripted = true;
      const cc = cardCenter(W, H);
      const ld = landPos(W, H);
      if (clock < T.convB) {
        s.x = cc.x; s.y = cc.y; // converting at center
      } else if (clock < T.placeEnd) {
        // one continuous diagonal motion: it shrinks and glides straight to its
        // spot and drops in, no hover and no mid-course hesitation
        const p = easeInOut(seg(T.convB, T.placeEnd));
        s.x = cc.x + (ld.x - cc.x) * p;
        s.y = cc.y + (ld.y - cc.y) * p;
      } else {
        noteScripted = false;
        if (!s.init) { s.x = ld.x; s.y = ld.y; }
      }
      s.init = true;
    }

    function step() {
      const k = 0.028, damp = 0.9;
      const pa = partAmt();
      const ld = landPos(W, H);
      const Rclear = 0.115 * Math.min(W, H);
      scriptNote();
      g.nodes.forEach((n, i) => {
        const s = P[i];
        if (n.note && (noteScripted || noteHidden)) return; // driven by scriptNote until handoff
        let h = nodeHome(n, W, H, tAmb);
        if (pa > 0 && !n.note && !n.core) {
          // smoothly open a circular clearing around the drop, then let it close
          const dx = h.x - ld.x, dy = h.y - ld.y, d = Math.hypot(dx, dy) || 1;
          if (d < Rclear) {
            const nd = d + (Rclear - d) * pa;
            h = { x: ld.x + (dx / d) * nd, y: ld.y + (dy / d) * nd };
          }
        }
        if (!s.init) { s.x = h.x; s.y = h.y; s.init = true; }
        s.vx = (s.vx + (h.x - s.x) * k) * damp;
        s.vy = (s.vy + (h.y - s.y) * k) * damp;
        s.x += s.vx; s.y += s.vy;
      });
    }

    function drawEdge(a: { x: number; y: number }, b: { x: number; y: number }, w: number, style: string) {
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      const off = Math.min(18, len * 0.07), nx = -dy / len, ny = dx / len;
      ctx!.beginPath();
      ctx!.moveTo(a.x, a.y);
      ctx!.quadraticCurveTo((a.x + b.x) / 2 + nx * off, (a.y + b.y) / 2 + ny * off, b.x, b.y);
      ctx!.lineWidth = w;
      ctx!.strokeStyle = style;
      ctx!.stroke();
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      // ordinary edges (thin); the note's own edges are drawn separately once it connects
      g.edges.forEach((e) => {
        if (e.kind === "note") return;
        const a = P[e.a], b = P[e.b];
        if (!a.init || !b.init) return;
        const za = (g.nodes[e.a].z + g.nodes[e.b].z) / 2;
        const style = e.kind === "ring" ? col([184, 178, 167], 0.2) : col(g.nodes[e.a].color, 0.09 + za * 0.18);
        drawEdge(a, b, e.kind === "spoke" ? 0.8 : 0.7, style);
      });
      // the note's threads reach out from the node once it lands, then normalize to ordinary
      const nc = connectAmt();
      if (!noteHidden && nc > 0.001) {
        const em = noteEmph();
        g.edges.forEach((e) => {
          if (e.kind !== "note") return;
          const ne = e.a === noteIndex ? P[e.a] : P[e.b];
          const tg = e.a === noteIndex ? P[e.b] : P[e.a];
          if (!ne.init || !tg.init) return;
          const ex = ne.x + (tg.x - ne.x) * nc;
          const ey = ne.y + (tg.y - ne.y) * nc;
          const za = (g.nodes[e.a].z + g.nodes[e.b].z) / 2;
          drawEdge(ne, { x: ex, y: ey }, 0.7, col([61, 99, 61], (0.09 + za * 0.18) * Math.min(1, nc * 1.4)));
          if (em > 0.01) drawEdge(ne, { x: ex, y: ey }, 1.6, col([78, 122, 78], 0.7 * em));
        });
      }
      // nodes back-to-front by depth
      order.forEach((i) => {
        const n: GNode = g.nodes[i], s = P[i];
        if (n.note && noteHidden) return;
        if (!s.init || !isFinite(s.x) || !isFinite(s.y)) return;
        if (n.note) {
          const r = noteR();
          // pulse when the card finishes becoming the node
          const cvp = seg(T.convB - 0.1, T.convB + 0.55);
          if (cvp > 0 && cvp < 1) {
            ctx!.beginPath(); ctx!.arc(s.x, s.y, r + cvp * 26, 0, 6.2832);
            ctx!.strokeStyle = col([78, 122, 78], 0.55 * (1 - cvp)); ctx!.lineWidth = 1.6; ctx!.stroke();
          }
          // pulse on touchdown
          const lr = seg(T.placeEnd - 0.05, T.placeEnd + 0.55);
          if (lr > 0 && lr < 1) {
            ctx!.beginPath(); ctx!.arc(s.x, s.y, r + 4 + lr * 30, 0, 6.2832);
            ctx!.strokeStyle = col([78, 122, 78], 0.4 * (1 - lr)); ctx!.lineWidth = 1.6; ctx!.stroke();
          }
          ctx!.beginPath(); ctx!.arc(s.x, s.y, r, 0, 6.2832); ctx!.fillStyle = col([61, 99, 61], 1); ctx!.fill();
          return;
        }
        if (n.core) {
          const grd = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, 30);
          grd.addColorStop(0, col(n.color, 0.16)); grd.addColorStop(1, col(n.color, 0));
          ctx!.fillStyle = grd; ctx!.beginPath(); ctx!.arc(s.x, s.y, 30, 0, 6.2832); ctx!.fill();
          const sz0 = nodeSize(n);
          ctx!.beginPath(); ctx!.arc(s.x, s.y, sz0 + 5, 0, 6.2832); ctx!.strokeStyle = col(n.color, 0.36); ctx!.lineWidth = 1.3; ctx!.stroke();
          ctx!.beginPath(); ctx!.arc(s.x, s.y, sz0, 0, 6.2832); ctx!.fillStyle = col(n.color, 1); ctx!.fill();
          return;
        }
        const sz = nodeSize(n);
        if (n.hub) {
          ctx!.beginPath(); ctx!.arc(s.x, s.y, sz + 4, 0, 6.2832); ctx!.strokeStyle = col(n.color, 0.3); ctx!.lineWidth = 1.1; ctx!.stroke();
        }
        ctx!.beginPath(); ctx!.arc(s.x, s.y, sz, 0, 6.2832); ctx!.fillStyle = col(n.color, nodeAlpha(n)); ctx!.fill();
      });
    }

    // ---- the card DOM, driven off the same clock so it stays in sync ----
    function driveDOM() {
      const cc = cardCenter(W, H);
      const corner = { x: W * 0.05, y: H * 0.05 };
      let op = 0, tx = cc.x, ty = cc.y, sc = 1, rad = 14;
      if (clock < T.arriveA) {
        op = 0;
      } else if (clock < T.arriveB) {
        const p = easeOut(seg(T.arriveA, T.arriveB));
        op = Math.min(1, p * 1.5);
        tx = corner.x + (cc.x - corner.x) * p;
        ty = corner.y + (cc.y - corner.y) * p - Math.sin(Math.PI * p) * 30;
        sc = 0.35 + 0.65 * p;
      } else if (clock < T.convA) {
        op = 1;
      } else if (clock < T.convB) {
        // COMPACT: the card shrinks + rounds + tints down into the node
        const q = easeInOut(seg(T.convA, T.convB));
        sc = 1 - (1 - scaleMin) * q;
        rad = 14 + (cardW0 - 14) * q; // round all the way to a disc
        card!.style.background = lerpColor([36, 34, 28], [61, 99, 61], q); // -> fern
        card!.style.boxShadow = `0 ${(26 * (1 - q)).toFixed(1)}px ${(54 * (1 - q)).toFixed(1)}px -30px rgba(26,25,21,${(0.85 * (1 - q)).toFixed(3)})`;
        if (inner) inner.style.opacity = String(1 - easeOut(Math.min(1, q / 0.5))); // text gone by mid-convert
        op = 1 - easeIn(Math.max(0, (q - 0.8) / 0.2)); // hand the shell off to the canvas node in the last 20%
      } else {
        op = 0;
      }
      card!.style.opacity = String(op);
      card!.style.borderRadius = rad + "px";
      card!.style.transform = `translate(-50%,-50%) translate(${tx}px,${ty}px) scale(${sc.toFixed(3)})`;

      // read: highlight phrases in sequence (no scan bar)
      if (phs[0]) phs[0].classList.toggle("hot", clock > T.hlA + 0.05);
      if (phs[1]) phs[1].classList.toggle("hot", clock > T.hlA + 0.6);
      if (phs[2]) phs[2].classList.toggle("hot", clock > T.hlA + 1.1);

      // sort: tags detach from their highlighted phrases and fly to the row; raw -> summary
      if (clock >= T.sortA) {
        if (!extractInit) {
          tagDeltas = tags.map((tg, i) => {
            const ph = phs[i]; // tags and phrases live in separate files; if counts drift, fall back to no-fly
            const pr = (ph ?? tg).getBoundingClientRect();
            const tr = tg.getBoundingClientRect();
            return { dx: pr.left + pr.width / 2 - (tr.left + tr.width / 2), dy: pr.top + pr.height / 2 - (tr.top + tr.height / 2) };
          });
          extractInit = true;
        }
        tags.forEach((tg, i) => {
          const d = i * 0.13;
          const tp = easeInOut(seg(T.sortA + d, T.sortA + 0.7 + d));
          tg.style.opacity = String(Math.min(1, tp * 1.4));
          const dd = tagDeltas[i] || { dx: 0, dy: 0 };
          tg.style.transform = `translate(${(dd.dx * (1 - tp)).toFixed(1)}px,${(dd.dy * (1 - tp)).toFixed(1)}px)`;
        });
        if (rawEl) rawEl.style.opacity = String(1 - easeInOut(seg(T.sortA + 0.5, T.sortA + 0.95)));
        if (sortedEl) sortedEl.style.opacity = String(easeInOut(seg(T.sortA + 0.8, T.sortB)));
        if (badge && clock > T.sortA + 0.6) badge.textContent = "Sorted";
      }
    }

    function reset() {
      clock = 0;
      playing = true;
      replayShown = false;
      extractInit = false;
      tagDeltas = [];
      noteHidden = true;
      noteScripted = true;
      P.forEach((s) => (s.init = false));
      if (badge) badge.textContent = "Capturing";
      phs.forEach((p) => p.classList.remove("hot"));
      if (rawEl) rawEl.style.opacity = "1";
      if (sortedEl) sortedEl.style.opacity = "0";
      if (inner) inner.style.opacity = "1";
      tags.forEach((tg) => { tg.style.opacity = "0"; tg.style.transform = "none"; });
      card!.style.opacity = "0";
      card!.style.borderRadius = "14px";
      card!.style.background = ""; // back to the CSS dark default
      card!.style.boxShadow = "";
      card!.style.transform = "";
      card!.style.willChange = "transform, opacity"; // promote only for the sequence window
      if (replay) {
        gsap.killTweensOf(replay); // cancel an in-flight fade-in so a fast replay stays hidden
        gsap.set(replay, { opacity: 0, pointerEvents: "none" });
        replay.tabIndex = -1;
        replay.setAttribute("aria-hidden", "true"); // out of the a11y tree until revealed
      }
    }

    function showReplay() {
      if (replayShown || !replay) return;
      replayShown = true;
      gsap.to(replay, { opacity: 1, duration: 0.4 });
      gsap.set(replay, { pointerEvents: "auto" });
      replay.tabIndex = 0;
      replay.removeAttribute("aria-hidden");
      card!.style.willChange = "auto"; // release the compositor layer once the sequence ends
    }

    function loop(ts: number) {
      raf = requestAnimationFrame(loop);
      if (!visible) { last = ts; return; } // freeze while offscreen (both clocks)
      if (!last) last = ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      tAmb += dt;
      if (playing) {
        clock += dt;
        if (clock >= T.end) { playing = false; showReplay(); }
        driveDOM();
      }
      step();
      draw();
    }

    resize();
    reset();
    playing = false; // wait for scroll-in
    card.style.willChange = "auto"; // release until the sequence actually starts on scroll-in

    // start the soft-drop sequence once the stage is comfortably in view (~60%
    // down) so the card fly-in is caught from the first frame, not mid-build
    const st = ScrollTrigger.create({ trigger: stage!, start: "top 62%", once: true, onEnter: reset });
    replay?.addEventListener("click", reset);

    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.01 });
    io.observe(canvas);
    let rt: number | undefined;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => { resize(); P.forEach((s) => (s.init = false)); }, 150);
    };
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
      st.kill();
      replay?.removeEventListener("click", reset);
      if (replay) gsap.killTweensOf(replay);
      stage?.setAttribute("data-mode", "still");
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="brain-field" aria-hidden="true" />
      <NoteCard ref={cardRef} />
      <button ref={replayRef} className="brain-replay" type="button" tabIndex={-1}>
        Replay
      </button>
    </>
  );
}
