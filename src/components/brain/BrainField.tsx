"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NoteCard from "./NoteCard";
import { buildGraph, nodeHome, nodeSize, nodeAlpha, settled, CALM, type GNode } from "./graph-data";
gsap.registerPlugin(ScrollTrigger);

export default function BrainField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // leave the SSR still in place

    const stage = document.getElementById("brain-stage");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    stage?.setAttribute("data-mode", "live");

    // shared inject progress (0 = note hidden, 1 = note fully connected); read by draw()
    const chor = { inject: 0 };

    const g = buildGraph("dense");
    const pos = g.nodes.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, init: false }));
    let W = 0, H = 0, DPR = 1, raf = 0, start = 0, visible = true;

    function resize() {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas!.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas!.width = Math.round(W * DPR); canvas!.height = Math.round(H * DPR);
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function col(c: number[], a: number) { return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }

    function step(t: number) {
      const k = 0.02, damp = 0.9;
      g.nodes.forEach((n, i) => {
        const h = nodeHome(n, W, H, t, CALM);
        const s = pos[i];
        if (!s.init) { s.x = h.x; s.y = h.y; s.init = true; }
        s.vx = (s.vx + (h.x - s.x) * k) * damp;
        s.vy = (s.vy + (h.y - s.y) * k) * damp;
        s.x += s.vx; s.y += s.vy;
      });
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, W, H);
      // threads
      g.edges.forEach((e) => {
        const a = pos[e.a], b = pos[e.b];
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const off = Math.min(24, len * 0.09), nx = -dy / len, ny = dx / len;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.quadraticCurveTo((a.x + b.x) / 2 + nx * off, (a.y + b.y) / 2 + ny * off, b.x, b.y);
        const za = (g.nodes[e.a].z + g.nodes[e.b].z) / 2;
        ctx!.lineWidth = e.inter ? 0.7 : 0.8;
        ctx!.strokeStyle = e.inter ? col([184, 178, 167], 0.24) : col(g.nodes[e.a].color, 0.1 + za * 0.22);
        ctx!.stroke();
      });
      // lit threads reveal with the inject (gated by chor.inject)
      g.lit.forEach((e, i) => {
        if (chor.inject <= 0) return;
        const a = pos[e.a], b = pos[e.b];
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y);
        ctx!.lineWidth = 1.7; ctx!.strokeStyle = col([78, 122, 78], 0.85 * chor.inject); ctx!.stroke();
        if (chor.inject > 0.99) {
          const f = (t * 0.4 + i * 0.33) % 1;
          ctx!.beginPath(); ctx!.arc(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, 2.2, 0, 6.2832);
          ctx!.fillStyle = col([147, 179, 147], 0.9); ctx!.fill();
        }
      });
      // nodes back-to-front by depth
      const order = g.nodes.map((_, i) => i).sort((p, q) => g.nodes[p].z - g.nodes[q].z);
      order.forEach((i) => {
        const n: GNode = g.nodes[i], s = pos[i];
        if (!isFinite(s.x) || !isFinite(s.y)) return;
        if (n.note) {
          if (chor.inject <= 0) return;
          const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, 38);
          grad.addColorStop(0, col([78, 122, 78], 0.34 * chor.inject)); grad.addColorStop(1, col([78, 122, 78], 0));
          ctx!.fillStyle = grad; ctx!.beginPath(); ctx!.arc(s.x, s.y, 38, 0, 6.2832); ctx!.fill();
          if (chor.inject > 0.99) {
            const pulse = (t * 0.6) % 1;
            ctx!.beginPath(); ctx!.arc(s.x, s.y, 10 + pulse * 22, 0, 6.2832);
            ctx!.strokeStyle = col([78, 122, 78], 0.5 * (1 - pulse)); ctx!.lineWidth = 1.6; ctx!.stroke();
          }
          ctx!.beginPath(); ctx!.arc(s.x, s.y, 13, 0, 6.2832); ctx!.strokeStyle = col([78, 122, 78], 0.55 * chor.inject); ctx!.lineWidth = 1.4; ctx!.stroke();
          ctx!.globalAlpha = chor.inject;
          ctx!.beginPath(); ctx!.arc(s.x, s.y, 9.5, 0, 6.2832); ctx!.fillStyle = "#f1eee6"; ctx!.fill();
          ctx!.beginPath(); ctx!.arc(s.x, s.y, 7.5, 0, 6.2832); ctx!.fillStyle = col([78, 122, 78], 1); ctx!.fill();
          ctx!.globalAlpha = 1;
          return;
        }
        const sz = nodeSize(n);
        if (n.hub) { ctx!.beginPath(); ctx!.arc(s.x, s.y, sz + 5, 0, 6.2832); ctx!.strokeStyle = col(n.color, 0.34); ctx!.lineWidth = 1.3; ctx!.stroke(); }
        ctx!.beginPath(); ctx!.arc(s.x, s.y, sz, 0, 6.2832); ctx!.fillStyle = col(n.color, nodeAlpha(n)); ctx!.fill();
      });
    }

    function loop(ts: number) {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      step(t); draw(t);
    }

    resize();

    const card = cardRef.current;
    const replay = replayRef.current;
    const noteNode = g.nodes[g.noteIndex];

    function runInject() {
      if (!card) return;
      gsap.killTweensOf([card, chor]);
      chor.inject = 0;
      card.classList.remove("is-sorted");
      gsap.set(card, { clearProps: "transform,opacity" });
      gsap.set(card, { xPercent: -50, yPercent: -50, scale: 1, opacity: 0, y: 24 });
      if (replay) gsap.set(replay, { opacity: 0 });
      const tl = gsap.timeline();
      tl.to(card, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.2);       // rise
      tl.add(() => card.classList.add("is-sorted"), 2.6);                                // sort
      tl.addLabel("inject", 4.6);
      tl.add(() => {
        // compute the fly target: card center -> note screen position
        const cr = canvas!.getBoundingClientRect();
        const dr = card.getBoundingClientRect();
        const nHome = settled(noteNode, W, H);
        const tx = cr.left + nHome.x - (dr.left + dr.width / 2);
        const ty = cr.top + nHome.y - (dr.top + dr.height / 2);
        gsap.to(card, { x: `+=${tx}`, y: `+=${ty}`, scale: 0.12, opacity: 0, duration: 1.1, ease: "power2.inOut" });
      }, "inject");
      tl.to(chor, { inject: 1, duration: 1.1, ease: "power2.out" }, "inject");           // reveal note + threads
      tl.add(() => { if (replay) gsap.to(replay, { opacity: 1, duration: 0.4 }); }, "inject+=1.4");
    }

    const st = ScrollTrigger.create({ trigger: stage!, start: "top 70%", once: true, onEnter: runInject });
    replay?.addEventListener("click", runInject);

    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.01 });
    io.observe(canvas);
    let rt: number | undefined;
    const onResize = () => { window.clearTimeout(rt); rt = window.setTimeout(() => { pos.forEach((s) => (s.init = false)); resize(); }, 150); };
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
      st.kill();
      replay?.removeEventListener("click", runInject);
      gsap.killTweensOf([card, chor].filter(Boolean) as object[]);
      stage?.setAttribute("data-mode", "still");
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="brain-field" aria-hidden="true" />
      <NoteCard ref={cardRef} />
      <button ref={replayRef} className="brain-replay" type="button">Replay</button>
    </>
  );
}
