"use client";

import { AddView } from "./AddView";
import { AnalyticsView } from "./AnalyticsView";
import { ChatView } from "./ChatView";
import { LibraryView } from "./LibraryView";
import { IconBars, IconChat, IconFolder, IconPlus } from "./shared";

const NAV = [
  { key: "add", label: "Add to the brain", short: "Add", Icon: IconPlus },
  { key: "chat", label: "Chat", short: "Chat", Icon: IconChat },
  { key: "library", label: "Library", short: "Library", Icon: IconFolder },
  { key: "analytics", label: "Analytics", short: "Analytics", Icon: IconBars },
] as const;

function NavItems({ variant }: { variant: "side" | "strip" }) {
  return (
    <>
      {NAV.map(({ key, label, short, Icon }) => (
        <div
          key={key}
          className={`cwd-nav-item cwd-nav-item-${key} relative z-10 flex items-center ${
            variant === "side"
              ? "h-9 gap-2 rounded-[10px] px-2.5 text-xs font-medium"
              : "h-8 gap-1.5 rounded-full px-3 text-[11px] font-medium"
          }`}
        >
          {key === "chat" && (
            <span className="cwd-nav-chat-static absolute inset-0 -z-10 rounded-[inherit] bg-fern/20" />
          )}
          <Icon />
          <span
            className={`cwd-nav-label ${
              key === "chat" ? "text-[#b5cbb5]" : "text-ivory/55"
            }`}
          >
            {variant === "side" ? label : short}
          </span>
        </div>
      ))}
    </>
  );
}

export default function CoreDashboard() {
  return (
    <div className="cwd-scope mx-auto max-w-5xl">
      <p className="sr-only">
        Product preview: the firm&apos;s brain ingests a meeting transcript
        automatically, a teammate asks about wire approvals and gets a cited
        answer, the citation opens the source note in the library, and a June
        report summarizes activity across the firm.
      </p>

      <div className="relative">
        <div
          aria-hidden="true"
          className="cwd-frame relative overflow-hidden rounded-2xl bg-ink text-ivory shadow-[0_24px_60px_rgba(26,25,21,0.25)]"
        >
          {/* Top bar (hairline 1 of 1) */}
          <div className="flex items-center gap-2.5 border-b border-ivory/10 px-4 py-3 sm:px-5">
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-md bg-fern text-[10px] font-bold text-ivory">
              ✕
            </span>
            <span className="text-[13.5px] font-semibold tracking-[0.01em]">
              Crosswell Core
            </span>
            <span className="text-xs text-ivory/45">· Your firm</span>
            <span className="flex-1" />
            <span className="hidden items-center gap-2 text-[11px] text-ivory/45 sm:mr-12 sm:flex">
              <span className="flex">
                <span className="flex h-[21px] w-[21px] items-center justify-center rounded-full border-2 border-ink bg-[#5c6b52] text-[8.5px] font-semibold text-ivory">
                  MB
                </span>
                <span className="-ml-2 flex h-[21px] w-[21px] items-center justify-center rounded-full border-2 border-ink bg-[#6b5f4c] text-[8.5px] font-semibold text-ivory">
                  JT
                </span>
                <span className="-ml-2 flex h-[21px] w-[21px] items-center justify-center rounded-full border-2 border-ink bg-[#4c5c6b] text-[8.5px] font-semibold text-ivory">
                  RS
                </span>
              </span>
              3 online
            </span>
          </div>

          {/* Mobile tab strip (below lg) */}
          <div className="cwd-nav relative flex gap-1 px-3 pt-3 lg:hidden">
            <span className="cwd-nav-pill invisible absolute left-0 top-0 rounded-full bg-fern/20" />
            <NavItems variant="strip" />
          </div>

          <div className="flex">
            {/* Sidebar (lg+) */}
            <div className="hidden w-[168px] flex-none px-2.5 py-3.5 lg:block">
              <div className="cwd-nav relative flex flex-col gap-0.5">
                <span className="cwd-nav-pill invisible absolute left-0 top-0 rounded-[10px] bg-fern/20" />
                <NavItems variant="side" />
              </div>
            </div>

            {/* Canvas: four stacked views */}
            <div className="relative min-h-[500px] min-w-0 flex-1 lg:min-h-[440px]">
              <AddView />
              <ChatView />
              <LibraryView />
              <AnalyticsView />
            </div>
          </div>

          {/* Cursor dot (playback only) */}
          <div className="cwd-cursor invisible absolute left-0 top-0 z-20 h-3.5 w-3.5 rounded-full bg-ivory/90 shadow-[0_0_0_5px_rgba(147,179,147,0.25),0_2px_8px_rgba(26,25,21,0.45)]" />
        </div>

        <button
          type="button"
          hidden
          aria-label="Replay the product preview animation"
          className="cwd-replay absolute right-4 top-3 z-10 cursor-pointer text-xs font-medium text-fern-soft transition-colors hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fern-soft sm:right-5"
        >
          Replay
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-ink/45">
        Product preview. Illustrative data.
      </p>
    </div>
  );
}
