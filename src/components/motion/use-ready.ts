import { useEffect, useState } from "react";

// Only apply a hidden initial animation state after hydration, so server-rendered
// content (and no-JS / crawler views) is always visible. Shared by the motion
// islands (Reveal, Hero entrance, AgentFlow) so they degrade identically.
export function useReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}
