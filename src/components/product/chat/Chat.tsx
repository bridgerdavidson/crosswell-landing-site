import { chat, today } from "@/lib/saguaro";
import { Chapter, Check, Dot, Frame, Rail, Receipt, SendButton, Tile, TopBar } from "../shared";

/**
 * Chapter 03, the one dark chapter, in its finished state: the first
 * exchange answered with receipts, the two follow-up chips waiting, the
 * input empty. The dashboard sits dimmed at the left edge so the panel
 * reads as docked over the product, not floating. The send mechanic
 * (pre-composed message, click to send, streamed answer) is design-loop
 * work; nothing here accepts typing.
 */
export default function Chat() {
  const [first, ...followUps] = chat.exchanges;
  return (
    <section className="bg-charcoal-deep text-ivory">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <Chapter
          index="03"
          label="The Core"
          dark
          claim="Ask it anything the business has written down. It answers with receipts."
          body="Decisions, meetings, files, and six years of loans. Every answer shows its work: ask where a number came from and the Core cites the meeting, the email, or the file it lives in."
        >
          <Frame dark fade="bottom" fit height="h-[580px]">
            <Rail active="chat" />
            <div className="flex min-w-0 flex-1 flex-col">
              <TopBar />
              <div className="flex min-h-0 flex-1">
                <div className="hidden min-w-0 flex-1 p-6 opacity-40 md:block" aria-hidden>
                  <p className="product-greeting">{today.greeting}</p>
                  <p className="mt-1.5 opacity-60">{today.subline}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {today.tiles.slice(0, 2).map((tile) => (
                      <Tile key={tile.label} {...tile} />
                    ))}
                  </div>
                </div>

                <div className="product-aside flex w-full flex-none flex-col md:w-[440px]">
                  <div className="product-topbar flex h-11 flex-none items-center gap-2 px-5">
                    <Dot tone="accent" />
                    <span className="font-medium">Core</span>
                  </div>
                  <div className="flex-1 space-y-4 overflow-hidden px-5 py-4">
                    <p className="product-bubble">{first.question}</p>
                    <ul className="space-y-1 opacity-60">
                      {first.working.map((line) => (
                        <li key={line} className="flex items-center gap-2">
                          <Check />
                          {line}
                        </li>
                      ))}
                    </ul>
                    <p className="leading-relaxed">{first.answer}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {first.receipts.map((r) => (
                        <Receipt key={r}>{r}</Receipt>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {followUps.map((e) => (
                        <button key={e.id} type="button" className="product-chip">
                          {e.question}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-none px-4 pb-4">
                    <div className="product-input">
                      <span className="flex-1 opacity-45">{chat.placeholder}</span>
                      <SendButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Frame>
        </Chapter>
      </div>
    </section>
  );
}
