const ICONS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
  list: "M4 6h16M4 12h16M4 18h10",
  chat: "M4 5h16v11H9l-5 4z",
  folder: "M3 6h6l2 2h10v11H3z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3",
} as const;

export type RailIcon = keyof typeof ICONS;

/** The product's left rail: 48 wide, icons only, no labels, one active. */
export function Rail({ active = "home" }: { active?: RailIcon }) {
  return (
    <aside aria-hidden className="product-rail flex w-12 flex-none flex-col items-center gap-3 py-4">
      {(Object.keys(ICONS) as RailIcon[]).map((key) => (
        <span
          key={key}
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            key === active ? "product-rail-active" : "product-rail-idle"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={ICONS[key]} />
          </svg>
        </span>
      ))}
    </aside>
  );
}
