import { pipeline } from "@/lib/saguaro";
import { Chapter, Frame, Rail, Receipt, TopBar } from "../shared";

/**
 * Chapter 04, finished state: the board with every stage, one card
 * highlighted, and its detail panel open at the right with "Who is this?"
 * already asked and answered. The deal-in, the click-to-open, and the
 * other prompts firing are design-loop work. The board area carries its
 * own right fade so the columns dissolve under the panel instead of
 * hitting a hard edge; the frame itself fades at the bottom only, so the
 * panel stays fully readable.
 */
export default function Pipeline() {
  const selected = pipeline.stages
    .flatMap((s) => s.cards)
    .find((c) => c.id === pipeline.selected);
  const detail = pipeline.details[pipeline.selected];
  if (!selected || !detail) return null;
  const [who, ...rest] = detail.prompts;

  return (
    <div data-chapter="04">
      <Chapter
        index="04"
        label="Pipeline"
        claim="Every client, every stage, and the whole history one click away."
        body="Every deal the team is working, in the stage it is actually in, synced from the tool they already track it in. Open one and ask the Core about it in a click."
      >
        <Frame fade="bottom" height="h-[600px]">
          <Rail active="folder" />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />
            <div className="flex min-h-0 flex-1">
              <div className="product-board-fade flex min-w-0 flex-1 gap-4 overflow-hidden p-6">
                {pipeline.stages.map((stage) => (
                  <section key={stage.name} data-stage={stage.name} className="w-[200px] flex-none">
                    <div className="flex items-baseline justify-between">
                      <p className="font-semibold">{stage.name}</p>
                      <span className="opacity-60">{stage.cards.length}</span>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {stage.cards.map((card) => (
                        <li
                          key={card.id}
                          className={`product-card ${
                            card.id === pipeline.selected ? "product-card-active" : ""
                          }`}
                        >
                          <p className="font-medium">{card.name}</p>
                          <p className="product-label opacity-60">
                            {card.place} · {card.kind}
                          </p>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span>{card.amount}</span>
                            <span className="opacity-60">{card.rate}</span>
                          </div>
                          {card.note && <p className="product-label mt-1 opacity-70">{card.note}</p>}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <aside className="product-aside flex w-[360px] flex-none flex-col p-6">
                <p className="product-title">{selected.name}</p>
                <p className="mt-1 opacity-60">{detail.since}</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {detail.numbers.map((n) => (
                    <div key={n.label} className="product-tile p-3">
                      <p className="product-label opacity-60">{n.label}</p>
                      <p className="product-num-sm mt-1">{n.value}</p>
                    </div>
                  ))}
                </div>
                <p className="product-label mt-4 opacity-60">Last touch: {detail.lastTouch}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="product-button">
                    {who.label}
                  </button>
                  {rest.map((p) => (
                    <button key={p.label} type="button" className="product-button product-button-quiet">
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="product-hr mt-5 pt-4">
                  <p className="product-bubble">{who.label}</p>
                  <p className="mt-3">{who.answer}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {who.receipts.map((r) => (
                      <Receipt key={r}>{r}</Receipt>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Frame>
      </Chapter>
    </div>
  );
}
