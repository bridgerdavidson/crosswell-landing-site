import type { ReactNode } from "react";
import type { HomeWorld } from "./worlds";
import { AppWindow, Button, Icon, Label, Sources, Status } from "./ui";

/* ---------- Home: chapter 01 (and chapter 06 in another company's colours) ---------- */

function Spark({ points }: { points: number[] }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const d = points
    .map((p, i) => `${((i / (points.length - 1)) * 44).toFixed(1)},${(13 - ((p - min) / (max - min)) * 12).toFixed(1)}`)
    .join(" ");
  return (
    <svg aria-hidden width="44" height="14" viewBox="0 0 44 14" fill="none" className="flex-none">
      <polyline points={d} stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeMain({ home }: { home: HomeWorld }) {
  return (
    <div className="px-7 pt-7 pb-12">
      <p className="text-[22px] leading-tight font-semibold tracking-[-0.01em]">{home.theme.user.greeting}</p>
      <p className="mt-1 text-ink/62">{home.subline}</p>

      <dl className="mt-6 grid grid-cols-4 border-y border-ink/8">
        {home.tiles.map((t, i) => (
          <div key={t.label} className={`py-3.5 pr-5 ${i ? "border-l border-ink/8 pl-5" : ""}`}>
            <dt className="text-[12px] text-ink/62">{t.label}</dt>
            <dd className="mt-2 flex items-center gap-3">
              <span className="text-[22px] leading-none font-semibold tabular-nums">{t.value}</span>
              {t.spark && <Spark points={t.spark} />}
            </dd>
            <dd className="mt-2 text-[12px] text-ink/45">{t.note}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)_264px] gap-10">
        <section className="min-w-0">
          <Label count={home.needsYou.length}>Needs you today</Label>
          <ul className="border-t border-ink/8">
            {home.needsYou.map((n) => (
              <li key={n.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-8 border-b border-ink/8 py-3.5">
                <div className="min-w-0">
                  <p className="font-semibold">{n.title}</p>
                  <p className="mt-1 leading-[1.55] text-ink/80 [text-wrap:pretty]">{n.body}</p>
                  <div className="mt-2">
                    <Sources items={n.receipts} />
                  </div>
                </div>
                {n.action ? <Button commit>{n.action}</Button> : <Button>Review</Button>}
              </li>
            ))}
          </ul>

          <Label count={home.filedOvernight} className="mt-8">
            Filed overnight
          </Label>
          <ul className="border-t border-ink/8">
            {home.filed.map((f) => (
              <li key={f.title} className="flex h-9 items-center gap-2.5 border-b border-ink/8">
                <Icon name="file" size={14} className="text-ink/45" />
                <span className="truncate">{f.title}</span>
                <span className="ml-auto flex-none text-[12px] text-ink/62">{f.to}</span>
              </li>
            ))}
            <li className="flex h-9 items-center text-[12px] text-ink/62">{home.filedOvernight - home.filed.length} more</li>
          </ul>
        </section>

        <aside className="min-w-0">
          <Label>Today</Label>
          <ol className="border-t border-ink/8">
            {home.calendar.map((c, i) => (
              <li key={c.time} className="flex gap-3 border-b border-ink/8 py-2">
                <span className="w-10 flex-none tabular-nums text-ink/62">{c.time}</span>
                <span className={i === 0 ? "font-medium" : ""}>{c.title}</span>
              </li>
            ))}
          </ol>

          <Label className="mt-8">Agents</Label>
          <ul className="border-t border-ink/8">
            {home.overnight.map((a) => (
              <li key={a.name} className="border-b border-ink/8 py-2">
                <p className="font-medium">{a.name}</p>
                <p className="mt-0.5 text-[12px] text-ink/62">
                  <Status kind={a.status.kind} text={a.status.text} />
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

export function HomeScreen({ home, size, core }: { home: HomeWorld; size?: string; core?: ReactNode }) {
  return (
    <AppWindow
      theme={home.theme}
      size={size}
      core={core}
      active="home"
      actions={<Button icon="plus">{home.action}</Button>}
      main={<HomeMain home={home} />}
    />
  );
}

