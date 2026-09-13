import { pipeline } from "@/lib/saguaro";
import { Chapter, Frame, Rail, Receipt, TopBar, inert } from "../shared";

/**
 * Chapter 04, finished state: the board with every stage, one card
 * highlighted, and its detail panel open with "Who is this?" already asked
 * and answered. The deal-in, the click-to-open, and the other prompts
 * firing are design-loop work. At lg the panel is the lit element, a
 * parchment card floating inset over the board, which runs past the
 * frame's right and bottom cuts and dissolves there. Below lg the board
 * is one column (the selected card's stage) at real scale, the panel is
 * out of the crop, and the selected card is the lit element; piece 4's
 * phone mechanic builds on that.
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
        <Frame fade="corner" fitNarrow height="h-auto lg:h-[800px]">
          <Rail active="folder" />
          <div className="relative flex min-w-0 flex-1 flex-col">
            <TopBar />
            <div className="flex min-h-0 flex-1">
              <div className="flex min-w-0 flex-1 gap-4 p-6">
                {pipeline.stages.map((stage) => (
                  <section
                    key={stage.name}
                    data-stage={stage.name}
                    className={`w-[200px] max-w-full flex-none ${
                      stage.cards.some((c) => c.id === pipeline.selected) ? "" : "hidden lg:block"
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <p className="product-strong">{stage.name}</p>
                      <span className="product-t3">{stage.cards.length}</span>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {stage.cards.map((card) => (
                        <li
                          key={card.id}
                          className={`product-card ${
                            card.id === pipeline.selected ? "product-card-active product-lit-narrow" : ""
                          }`}
                        >
                          <p className="product-strong">{card.name}</p>
                          <p className="product-label">
                            {card.place} · {card.kind}
                          </p>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span>{card.amount}</span>
                            <span className="product-t3">{card.rate}</span>
                          </div>
                          {card.note && <p className="product-label mt-1">{card.note}</p>}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <aside className="product-float product-lit hidden w-[360px] flex-none flex-col p-6 lg:flex">
                <p className="product-title">{selected.name}</p>
                <p className="product-t2 mt-1">{detail.since}</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {detail.numbers.map((n) => (
                    <div key={n.label} className="product-tile p-3">
                      <p className="product-label">{n.label}</p>
                      <p className="product-num-sm mt-1">{n.value}</p>
                    </div>
                  ))}
                </div>
                <p className="product-label mt-4">Last touch: {detail.lastTouch}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" {...inert} className="product-button">
                    {who.label}
                  </button>
                  {rest.map((p) => (
                    <button key={p.label} type="button" {...inert} className="product-button product-button-quiet">
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
