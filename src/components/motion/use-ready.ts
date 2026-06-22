"use client";

import { useSyncExternalStore } from "react";

// True only after hydration on the client; false during server render and the
// hydration snapshot. Lets the motion islands (Reveal, Hero entrance, AgentFlow)
// keep their hidden initial state out of server-rendered / no-JS output, so that
// content is always visible without JS. useSyncExternalStore is the SSR-safe
// primitive for client detection (no setState-in-effect).
const subscribe = () => () => {};

export function useReady(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot: ready
    () => false, // server snapshot: not ready
  );
}
