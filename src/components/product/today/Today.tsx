import { today } from "@/lib/saguaro";
import { Chapter, Dot, Frame, Rail, Receipt, Tile, TopBar } from "../shared";

/**
 * Chapter 01. The top-left of the dashboard in its finished state: the
 * greeting, the numbers, the three things that need a person, and the
 * calendar column fading out at the right edge. Motion comes later, from
 * the design loop; this is the state every visitor without JS sees.
 */
export default function Today() {
  return (
    <Chapter
      index="01"
      label="Today"
      claim="Your morning, already assembled."
      body="Before anyone sits down, the Core has read the night's mail, filed what is routine, and put the three things that need a person at the top."
    >
      <Frame fade="corner" height="h-[540px]">
        <Rail active="home" />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="grid flex-1 grid-cols-[minmax(0,1fr)_240px] gap-8 p-6">
            <div className="min-w-0">
              <p className="product-greeting">{today.greeting}</p>
              <p className="mt-1.5 opacity-60">{today.subline}</p>
              <div className="mt-6 grid grid-cols-4 gap-3">
                {today.tiles.map((tile) => (
                  <Tile key={tile.label} {...tile} />
                ))}
              </div>
              <p className="product-title mt-8">Needs you today</p>
              <ul className="product-rule mt-3">
                {today.needsYou.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4">
                    <Dot tone="ink" className="mt-2" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 leading-relaxed opacity-75">{item.body}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.receipts.map((r) => (
                          <Receipt key={r}>{r}</Receipt>
                        ))}
                      </div>
                    </div>
                    {item.action && (
                      <button type="button" className="product-button self-start">
                        {item.action}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12px] opacity-55">{today.filedOvernight} filed overnight</p>
            </div>
            <aside className="product-aside pl-6">
              <p className="text-[12px] font-medium opacity-60">Today</p>
              <ul className="mt-3 space-y-3">
                {today.calendar.map((slot) => (
                  <li key={slot.time} className="flex gap-3">
                    <span className="w-10 flex-none opacity-55">{slot.time}</span>
                    <span className="min-w-0">{slot.title}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </Frame>
    </Chapter>
  );
}
