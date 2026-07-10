// The one wire-approval note, shared by the dashboard tour and the brain-map
// section so the "same note" is enforced in code. No em dashes; middots only.
export const CORE_NOTE = {
  sourceLabel: "Meeting transcript · Wire approval policy",
  noteLabel: "Policy note · Wire approvals",
  summary:
    "Any wire over $250k requires sign-off from both a managing partner and operations.",
  context: "Context: a near miss in March with a mistyped account number.",
  tags: ["Operations", "Policy", "April"] as const,
  filedLinked: "Filed in Operations · Linked to Ops meeting · Mar 28",
  linkedTo: "Ops meeting · Mar 28",
  // Raw transcript excerpt, only used by the brain-map capture card.
  raw: [
    "...so on wires, anything over 250 we said two sign offs, a managing partner and ops, no exceptions...",
    "...right, after the March thing with the mistyped account number. document the reasoning so it sticks.",
  ],
} as const;
