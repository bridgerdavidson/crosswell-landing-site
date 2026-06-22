"use client";

import { useEffect, useState } from "react";

// True only after hydration on the client; false during server render and the
// hydration render. Lets the motion islands (Reveal, Hero entrance, AgentFlow)
// keep their hidden initial state out of server-rendered / no-JS output, so that
// content is always visible without JS, then flip on once the client takes over.
//
// IMPORTANT: this hook only reports "the client has hydrated." It does NOT, by
// itself, make an entrance animation play. Because the flip to true happens in a
// POST-mount effect, and Framer Motion reads `initial` only at the element's mount,
// a consumer that merely swaps `initial` from false to "hidden" when this flips will
// never animate: the hidden start state was never committed, so the entrance runs
// visible -> visible (a no-op). That was the real cause of the "nothing animates"
// bug, NOT this hook. The consumers fix it by remounting the motion element when
// animation enables (key={animate ? "motion" : "static"}), forcing a fresh mount
// that does read the hidden `initial`. See reveal.tsx / hero.tsx / agent-flow.tsx.
export function useReady(): boolean {
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-shot post-hydration flag to enable client-only motion; runs once after mount
  useEffect(() => setReady(true), []);
  return ready;
}
