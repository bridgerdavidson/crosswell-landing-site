import { chat, today } from "@/lib/saguaro";
import { Chapter, Check, Dot, Frame, Rail, Receipt, SendButton, Tile, TopBar, inert } from "../shared";

/**
 * Chapter 03, the one dark chapter, in its finished state: the first
 * exchange answered with receipts, the two follow-up chips waiting, the
 * input empty. The dashboard sits dimmed at the left edge so the panel
 * reads as docked over the product, not floating. The send mechanic
 * (pre-composed message, click to send, streamed answer) is design-loop
 * work; nothing here accepts typing. The panel is the lit element: at lg a
 * charcoal card floating inset over the morning dashboard, which is
 * periphery at 40 and runs past the frame's right and bottom cuts; below
 * lg the panel takes the whole frame. The composer reads in full.
 */
export default function Chat() {
  const [first, ...followUps] = chat.exchanges;
  return (
    <section className="bg-charcoal-deep text-ivory">
      <div className="px-6 py-24 sm:py-40 lg:px-12">
        <Chapter
          index="03"
          label="The Core"
          dark
          claim="Ask it anything the business has written down. It answers with receipts."
          body="Decisions, meetings, files, and six years of loans. Every answer shows its work: ask where a number came from and the Core cites the meeting, the email, or the file it lives in."
        >
          <Frame dark fade="corner" fitNarrow height="h-auto lg:h-[800px]">
            <Rail active="chat" />
            <div className="relative flex min-w-0 flex-1 flex-col">
              <TopBar />
              <div className="flex min-h-0 flex-1">
                <div
                  className="product-periphery hidden min-w-0 flex-1 grid-cols-[minmax(0,1fr)_280px] gap-8 p-6 lg:grid"
                  aria-hidden
                >
                  <div className="min-w-0">
                    <p className="product-greeting">{today.greeting}</p>
                    <p className="product-t2 mt-1.5">{today.subline}</p>
                    <div className="mt-6 grid grid-cols-4 gap-3">
                      {today.tiles.map((tile) => (
                        <Tile key={tile.label} {...tile} />
                      ))}
                    </div>
                    <p className="product-title mt-8">Needs you today</p>
                    <ul className="product-rule mt-3">
                      {today.needsYou.map((item) => (
                        <li key={item.id} className="py-4">
                          <p className="product-strong">{item.title}</p>
                          <p className="product-t2 mt-1">{item.body}</p>
                        </li>
                      ))}
                    </ul>
                    <p className="product-label mt-3">{today.filedOvernight} filed overnight</p>
                    <ul className="product-rule mt-4">
                      {today.filed.map((f) => (
                        <li key={f.title} className="flex items-center justify-between gap-4 py-3">
                          <span>{f.title}</span>
                          <span className="product-t3 flex-none">{f.to}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <aside className="product-aside pl-6">
                    <p className="product-label">Today</p>
                    <ul className="mt-3 space-y-3">
                      {today.calendar.map((slot) => (
                        <li key={slot.time} className="flex gap-3">
                          <span className="product-t3 w-10 flex-none">{slot.time}</span>
                          <span className="min-w-0">{slot.title}</span>
                        </li>
                      ))}
                    </ul>
                  </aside>
                </div>

                <div className="product-float product-lit flex w-full flex-none flex-col lg:w-[440px]">
                  <div className="product-topbar flex h-11 flex-none items-center gap-2 px-5">
                    <Dot tone="accent" />
                    <span className="product-strong">The Core</span>
                  </div>
                  <div className="space-y-4 px-5 py-4">
                    <p className="product-bubble">{first.question}</p>
                    <ul className="product-t3 space-y-1">
                      {first.working.map((line) => (
                        <li key={line} className="flex items-center gap-2">
                          <Check />
                          {line}
                        </li>
                      ))}
                    </ul>
                    <p>{first.answer}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {first.receipts.map((r) => (
                        <Receipt key={r}>{r}</Receipt>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {followUps.map((e) => (
                        <button key={e.id} type="button" {...inert} className="product-chip">
                          {e.question}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-2">
                    <div className="product-input">
                      <span className="product-t3 flex-1">{chat.placeholder}</span>
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
