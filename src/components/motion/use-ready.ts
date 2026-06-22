"use client";

import { useEffect, useState } from "react";

// True only after hydration on the client; false during server render and the
// hydration render. Lets the motion islands (Reveal, Hero entrance, AgentFlow)
// keep their hidden initial state out of server-rendered / no-JS output, so that
// content is always visible without JS, then flip on once the client takes over.
//
// This MUST flip to true after hydration or every useReady-gated animation stays
// off. A useEffect set-on-mount is the reliable way to do that: the effect runs
// once, unconditionally, after the client hydrates. (A useSyncExternalStore
// client/server-snapshot split reads cleaner and avoids the lint rule below, but
// its post-hydration snapshot flip did not fire in the Next.js static-prerender +
// React 19 build, leaving ready stuck false and all entrance/reveal animations
// dead. Do not "simplify" this back to that pattern without a real hydration test.)
export function useReady(): boolean {
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-shot post-hydration flag to enable client-only motion; runs once after mount
  useEffect(() => setReady(true), []);
  return ready;
}
