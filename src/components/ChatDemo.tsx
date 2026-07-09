"use client";

import { useEffect, useRef, useState } from "react";

type Exchange = {
  question: string;
  answer: string;
  sources: string[];
};

const exchanges: Exchange[] = [
  {
    question: "What would a new analyst need to know before Monday's investor call?",
    answer:
      "Three things. The Q2 letter promised an update on the two delayed originations, both closed last week. Two investors asked about reserve levels in May; the answer that satisfied them is saved. And the June committee agreed not to discuss the new vehicle until terms are final.",
    sources: ["Q2 letter", "Call notes · May 30", "Committee minutes · June"],
  },
  {
    question: "Where did we land on wire approvals over $250k?",
    answer:
      "Dual approval, decided in April. Any wire over $250k needs sign-off from both a managing partner and operations, and the reasoning is documented: a near miss in March with a mistyped account number.",
    sources: ["Policy note · Apr 8", "Ops meeting · Mar 28"],
  },
];

const TYPING_MS = 28;

export default function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [runId, setRunId] = useState(0);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");

  // step per exchange i: 3i+1 typing question, 3i+2 thinking, 3i+3 answer shown
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(exchanges.length * 3);
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const typeQuestion = (i: number) => {
      if (cancelled || i >= exchanges.length) return;
      setStep(3 * i + 1);
      setTyped("");
      const text = exchanges[i].question;
      let pos = 0;
      const tick = () => {
        if (cancelled) return;
        pos += 1;
        setTyped(text.slice(0, pos));
        if (pos < text.length) {
          timers.push(setTimeout(tick, TYPING_MS));
        } else {
          timers.push(
            setTimeout(() => {
              if (cancelled) return;
              setStep(3 * i + 2);
              timers.push(
                setTimeout(() => {
                  if (cancelled) return;
                  setStep(3 * i + 3);
                  timers.push(setTimeout(() => typeQuestion(i + 1), 2400));
                }, 1100)
              );
            }, 350)
          );
        }
      };
      timers.push(setTimeout(tick, 500));
    };

    typeQuestion(0);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [started, runId]);

  const replay = () => {
    setStep(0);
    setTyped("");
    setRunId((n) => n + 1);
  };

  return (
    <div ref={ref} className="w-full">
      <div className="overflow-hidden rounded-2xl border border-warmgray/40 bg-parchment shadow-lifted">
        <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-fern" />
            <span className="text-sm font-medium text-ink/80">
              Your firm&apos;s brain
            </span>
          </div>
          <button
            type="button"
            onClick={replay}
            className="text-xs font-medium text-fern-deep transition-colors hover:text-fern"
          >
            Replay
          </button>
        </div>

        <div className="flex min-h-[380px] flex-col gap-4 px-5 py-6 sm:px-7">
          {!started || step === 0 ? (
            <p className="m-auto text-sm text-ink/40">
              Ask anything about your firm.
            </p>
          ) : (
            exchanges.map((exchange, i) => {
              const base = 3 * i;
              if (step <= base) return null;
              const typing = step === base + 1;
              const thinking = step === base + 2;
              const answered = step >= base + 3;
              return (
                <div key={`${runId}-${i}`} className="flex flex-col gap-4">
                  <div className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-charcoal px-4 py-2.5 text-sm leading-relaxed text-ivory">
                    {typing ? typed : exchange.question}
                    {typing && <span className="chat-caret ml-0.5" />}
                  </div>
                  {thinking && (
                    <div className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-sm border border-warmgray/40 bg-ivory px-4 py-3.5">
                      <span className="chat-dot" />
                      <span className="chat-dot" />
                      <span className="chat-dot" />
                    </div>
                  )}
                  {answered && (
                    <div className="max-w-[92%] self-start rounded-2xl rounded-bl-sm border border-warmgray/40 bg-ivory px-4 py-3.5">
                      <p className="text-sm leading-relaxed text-ink/85">
                        {exchange.answer}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {exchange.sources.map((source) => (
                          <span
                            key={source}
                            className="rounded-full bg-fern-mist px-2.5 py-0.5 text-xs font-medium text-fern-deep"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-ink/45">
        Illustrative conversation. Your brain answers from your firm&apos;s
        actual records.
      </p>
    </div>
  );
}
