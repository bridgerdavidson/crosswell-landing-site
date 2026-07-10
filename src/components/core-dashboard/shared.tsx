export const QUESTION = "Where did we land on wire approvals over $250k?";
export const ANSWER =
  "Dual approval, decided in April. Any wire over $250k needs sign-off from both a managing partner and operations, and the reasoning is documented: a near miss in March with a mistyped account number.";

const iconProps = {
  viewBox: "0 0 24 24",
  className: "h-3.5 w-3.5 flex-none",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function IconChat() {
  return (
    <svg {...iconProps}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
export function IconPlus() {
  return (
    <svg {...iconProps}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
export function IconFolder() {
  return (
    <svg {...iconProps}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}
export function IconBars() {
  return (
    <svg {...iconProps}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}
export function IconCheck() {
  return (
    <svg {...iconProps} className="h-[11px] w-[11px] flex-none" strokeWidth={2.4}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
export function IconUp() {
  return (
    <svg {...iconProps} className="h-3 w-3 flex-none" strokeWidth={2.2}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function TagChip({ label }: { label: string }) {
  return (
    <span className="cwd-tag rounded-full bg-ivory/8 px-2 py-px text-[9.5px] font-semibold text-ivory/55">
      {label}
    </span>
  );
}
