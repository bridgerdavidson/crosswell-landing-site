import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { serveOut } from "../helpers/serve";
import { withPage } from "../helpers/browser";

let site: Awaited<ReturnType<typeof serveOut>>;

beforeAll(async () => {
  site = await serveOut();
});
afterAll(() => site.close());

describe("smoke", () => {
  it("serves the home page", async () => {
    const title = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.title();
    });
    expect(title).toContain("Crosswell");
  });
});

describe("removals", () => {
  it("has no Security section and no dashboard tour", async () => {
    const counts = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        security: await page.locator("#security").count(),
        tour: await page.locator(".cwd-frame").count(),
        diagram: await page.locator(".trust-diagram").count(),
      };
    });
    expect(counts).toEqual({ security: 0, tour: 0, diagram: 0 });
  });
});

describe("type", () => {
  it("uses Instrument Sans and no uppercase text", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.evaluate(() => ({
        font: getComputedStyle(document.body).fontFamily,
        uppercase: [...document.querySelectorAll("header *, main *, footer *")].filter(
          (el) => getComputedStyle(el).textTransform === "uppercase"
        ).length,
        kicker: document.querySelectorAll(".type-kicker").length,
      }));
    });
    expect(r.font).toMatch(/Instrument Sans/);
    expect(r.uppercase).toBe(0);
    expect(r.kicker).toBe(0);
  });
});

describe("nav", () => {
  it("lists the five links, sentence case", async () => {
    const labels = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.locator("header nav a").allTextContents();
    });
    expect(labels).toEqual(["What we do", "Why Crosswell", "How we start", "Team", "Insights"]);
  });
});

describe("built css", () => {
  it("keeps the double stops in the product masks", () => {
    const dir = join("out", "_next", "static", "css");
    const css = readdirSync(dir).map((f) => readFileSync(join(dir, f), "utf8")).join("\n");
    // every fade is written with two black stops, "#000 0" and then
    // "#000 calc(100% - var(--fade-x|y))", so the solid region survives the
    // minifier (a lone stop gets collapsed to 0 and fades the whole frame,
    // as the hero mask once did); the fade lengths are pixel variables on
    // .product-frame so every frame dissolves over the same distance
    const stops = (axis: "x" | "y") => `#000 0,#000 calc\\(100% - var\\(--fade-${axis}\\)\\)`;
    const has = (selector: string, axis: "x" | "y") =>
      expect(css).toMatch(new RegExp(`${selector}\\{[^}]*${stops(axis)}`));
    has("product-frame-corner", "x");
    has("product-frame-corner", "y");
    has("product-frame-right", "x");
    has("product-frame-bottom", "y");
    // below lg a frame takes its product's height, so the only mask is the
    // right fade on a shell that still overflows the frame
    has("product-frame", "x");
    // chapter 04's phone scroller fades its own two edges; the minifier
    // keeps both black positions as one double-position stop
    expect(css).toMatch(/product-board\{[^}]*#000 24px calc\(100% - 40px\)/);
    expect(css).toMatch(/product-frame\{--fade-x:160px;--fade-y:120px;/);
    expect(css).toMatch(/product-frame\{--fade-x:120px;--fade-y:120px\}/);
  });
});

describe("what we do", () => {
  it("states what Crosswell does and draws the stack under it", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const stack = page.locator(".stack-scroll");
      return {
        label: await page.locator("#what-we-do .type-label").first().textContent(),
        statement: await page.locator("#what-we-do h2").textContent(),
        captions: await stack.locator("h3").allTextContents(),
        legend: await stack.locator("li").allTextContents(),
        layers: await stack.locator(".core-group, .agents-group, .dash-group").count(),
        tiles: await stack.locator(".tile").count(),
      };
    });
    expect(r.label).toBe("What we do");
    expect(r.statement).toBe(
      "AI is only as useful as what it knows about your business. So we start there. Crosswell brings everything your company knows into one place, then builds the agents and automations that use it."
    );
    expect(r.captions).toEqual([
      "Everything your company knows, in one place.",
      "The work, built on what you know.",
      "One screen for the whole team.",
      "Your team sees one screen. Everything under it is what makes it smart.",
    ]);
    expect(r.legend).toEqual(["Agent", "Automation", "Workflow"]);
    expect(r.layers).toBe(3);
    expect(r.tiles).toBe(3);
  });
});

describe("product run", () => {
  it("renders chapter 01 with the finished morning", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("main > section").filter({ has: page.getByText("Your morning, already assembled.") });
      return {
        leadIn: await run.locator(".type-accent").first().textContent(),
        claim: await run.locator("h3").first().textContent(),
        labels: await run.locator(".type-label").count(),
        greeting: await run.getByText("Good morning, Morgan.").count(),
        filed: await run.getByText("14 filed overnight").count(),
        captions: await page.getByText("Interactive demo · Sample data").count(),
      };
    });
    expect(r.leadIn).toBe("Here's that screen at work, inside a sample company.");
    expect(r.claim).toBe("Your morning, already assembled.");
    expect(r.labels).toBe(0);
    expect(r.greeting).toBe(1);
    expect(r.filed).toBe(1);
    expect(r.captions).toBeGreaterThanOrEqual(1);
  });
});

describe("chapter 02", () => {
  it("renders the agenda with Draw 4 checked and synced", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("main > section").filter({ has: page.getByText("Your morning, already assembled.") });
      return {
        panels: await run.locator(".product-track > section").count(),
        synced: await run.getByText("synced to Asana").count(),
        rocks: await run.getByText("Deploy $6M into new loans").count(),
      };
    });
    expect(r.panels).toBe(3);
    expect(r.synced).toBe(1);
    expect(r.rocks).toBe(1);
  });
});

describe("chapter 03", () => {
  it("renders the dark chat with the first exchange answered", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const dark = page.locator("section.bg-charcoal-deep").first();
      return {
        exists: await dark.count(),
        // the first exchange's bubble; under JS the composed input carries
        // the same question until the sequence sends it
        question: await dark.locator(".product-bubble", { hasText: "What's at risk this week?" }).count(),
        followUps: await dark.locator("button.product-chip").count(),
        send: await dark.locator("button.product-send").count(),
        receipts: await dark.locator(".product-chip-accent").count(),
      };
    });
    expect(r.exists).toBe(1);
    expect(r.question).toBe(1);
    expect(r.followUps).toBe(2);
    expect(r.send).toBe(1);
    expect(r.receipts).toBeGreaterThanOrEqual(2);
  });
});

describe("chapter 04", () => {
  it("renders the board with the selected card's detail open", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("[data-chapter='04']");
      return {
        stages: await run.locator("[data-stage]").count(),
        active: await run.locator(".product-card-active").count(),
        who: await run.getByText("Who is this?").count(),
        answer: await run.getByText("Redrock Flips, a first-time borrower introduced by Canyon State Brokers").count(),
      };
    });
    expect(r.stages).toBe(5);
    expect(r.active).toBe(1);
    expect(r.who).toBe(2);
    expect(r.answer).toBe(1);
  });
});

describe("chapter 05", () => {
  it("renders five agents and the hand-off", async () => {
    // the settled roster; under motion the count opens on the live
    // moment's value and ticks down to this one
    const r = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        const run = page.locator("[data-chapter='05']");
        return {
          rows: await run.locator("[data-agent]").count(),
          running: await run.getByText("1 running").count(),
          handoff: await run.getByText("Hand it off").count(),
        };
      },
      { reducedMotion: true }
    );
    expect(r.rows).toBe(5);
    expect(r.running).toBe(1);
    expect(r.handoff).toBe(1);
  });
});

describe("chapter 06 and the whole run", () => {
  it("renders four swatches with Saguaro pressed and the accent scoped", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const run = page.locator("[data-chapter='06']");
      return {
        swatches: await run.locator("button[aria-pressed]").count(),
        pressed: await run.locator("button[aria-pressed='true']").textContent(),
        accent: await run.locator(".product-shell").evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--accent").trim()
        ),
        pageAccent: await page.locator("body").evaluate((el) =>
          getComputedStyle(el).getPropertyValue("--accent").trim()
        ),
      };
    });
    expect(r.swatches).toBe(4);
    expect(r.pressed).toContain("Saguaro Capital");
    expect(r.accent).toBe("#4e7a4e");
    expect(r.pageAccent).toBe("");
  });

  it("carries six captions and the fictional line once", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        captions: await page.getByText("Interactive demo · Sample data").count(),
        fictional: await page.getByText("Saguaro Capital is fictional").count(),
        bridge: await page.getByText("Behind the chat is the").count(),
        indexes: await page.locator(".type-label-index").count(),
      };
    });
    expect(r.captions).toBe(6);
    expect(r.fictional).toBe(1);
    expect(r.bridge).toBe(1);
    expect(r.indexes).toBe(0);
  });
});

describe("hero and the top of the company half", () => {
  it("carries the new headline, static subline, industries, and stats", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const body = await page.locator("main").textContent();
      return {
        h1: await page.locator("h1").textContent(),
        rotator: await page.locator(".swap-row").count(),
        marquee: await page.locator(".drift-slow").count(),
        stewards: body?.includes("financial stewards"),
        funds: body?.includes("worked inside funds"),
        industries: await page.locator("#who-its-for li").allTextContents(),
        stats: await page.locator("#stats .type-h2").allTextContents(),
        order: await page.evaluate(() =>
          [...document.querySelectorAll("main section[id]")].map((s) => s.id)
        ),
      };
    });
    expect(r.h1).toBe("The operating layer your business actually runs on.");
    expect(r.rotator).toBe(0);
    expect(r.marquee).toBe(0);
    expect(r.stewards).toBe(false);
    expect(r.funds).toBe(false);
    expect(r.industries).toEqual([
      "Manufacturing", "Healthcare", "Logistics", "Professional services", "Construction", "Private credit",
    ]);
    expect(r.stats).toEqual(["75%", "78%"]);
    expect(r.order.slice(0, 6)).toEqual([
      "top", "what-we-do", "the-brain", "who-its-for", "stats", "why-crosswell",
    ]);
  });
});

describe("company half, middle", () => {
  it("carries the Gen 6 copy in the right order", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        why: await page.locator("#why-crosswell h2").textContent(),
        cards: await page.locator("#why-crosswell h3").allTextContents(),
        loses: await page.locator("#what-you-lose h2").textContent(),
        firstSink: await page.locator("#what-you-lose .type-accent").first().textContent(),
        worthMore: await page.getByText("And a firm that keeps its memory is worth more").count(),
        audit: await page.getByText("Where every firm starts").count(),
        beyond: await page.locator("#beyond-core h3").allTextContents(),
      };
    });
    expect(r.why).toContain("Off the shelf fits nobody");
    expect(r.cards).toEqual(["Built around your work", "We sell trust", "You work directly with us"]);
    expect(r.loses).toContain("What a business actually loses");
    expect(r.firstSink).toContain("departing employee");
    expect(r.worthMore).toBe(1);
    expect(r.audit).toBe(1);
    expect(r.beyond).toEqual(["Custom tools and automations", "The support layer"]);
  });
});

describe("company half, bottom", () => {
  it("carries the values, the new bios, the Insights slot, and the footer line", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        vision: await page.getByText("To become the most sought after name in agentic AI").count(),
        values: await page.locator("#values h3").allTextContents(),
        costs: await page.locator("#values").getByText("What it costs").count(),
        heading: await page.locator("#values h2").textContent(),
        valuesText: await page.locator("#values").textContent(),
        stewardship: await page.getByText("leaves with you in open files on the day you go").count(),
        roles: await page.locator("#team h3 + p").allTextContents(),
        insights: await page.locator("#insights h2").textContent(),
        posts: await page.locator("#insights article").count(),
        footer: await page.locator("footer").textContent(),
        order: await page.evaluate(() =>
          [...document.querySelectorAll("main section[id]")].map((s) => s.id)
        ),
      };
    });
    expect(r.vision).toBe(1);
    expect(r.values).toEqual(["Trust", "Stewardship", "Continuity"]);
    expect(r.costs).toBe(3);
    // the vision line is the section's own title; no "Mission" or "Vision" heading
    expect(r.heading).toContain("To become the most sought after name");
    expect(r.valuesText).not.toMatch(/\b(Mission|Vision)\b/);
    expect(r.stewardship).toBe(1);
    expect(r.roles).toEqual(["Business & strategy", "Software & engineering", "Finance & operations"]);
    expect(r.insights).toBe("Insights");
    expect(r.posts).toBe(0);
    expect(r.footer).toContain("Custom agentic AI, built around how your team actually works. Arizona.");
    expect(r.order).toEqual([
      "top", "what-we-do", "the-brain", "who-its-for", "stats", "why-crosswell",
      "what-you-lose", "how-we-start", "beyond-core", "values", "team", "insights",
    ]);
  });
});

describe("metadata", () => {
  it("ships canonical, Open Graph, Twitter, JSON-LD, robots, and sitemap", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const head = await page.evaluate(() => ({
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content"),
        twitter: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
        ld: document.querySelector('script[type="application/ld+json"]')?.textContent,
      }));
      const robots = await (await page.request.get(`${site.url}/robots.txt`)).text();
      const sitemap = await (await page.request.get(`${site.url}/sitemap.xml`)).text();
      const og = await page.request.get(`${site.url}/og-image.jpg`);
      return { ...head, robots, sitemap, ogStatus: og.status() };
    });
    expect(r.canonical).toBe("https://crosswellconsulting.com/");
    expect(r.ogTitle).toContain("The operating layer your business actually runs on");
    expect(r.ogImage).toContain("/og-image.jpg");
    expect(r.twitter).toBe("summary_large_image");
    expect(JSON.parse(r.ld ?? "{}")["@type"]).toBe("Organization");
    expect(r.robots).toMatch(/Allow: \//);
    expect(r.robots).toContain("sitemap.xml");
    expect(r.sitemap).toContain("https://crosswellconsulting.com");
    expect(r.ogStatus).toBe(200);
  });
});

describe("resilience", () => {
  it("shows every chapter finished without JavaScript", async () => {
    const r = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return {
          greeting: await page.getByText("Good morning, Morgan.").first().isVisible(),
          captions: await page.getByText("Interactive demo · Sample data").count(),
          answer: await page.getByText("Four flags. The one that matters").isVisible(),
        };
      },
      { js: false }
    );
    expect(r.greeting).toBe(true);
    expect(r.captions).toBe(6);
    expect(r.answer).toBe(true);
  });

  it("holds chapters 02 and 03 finished under reduced motion, and composes them under motion", async () => {
    const read = () => ({
      pin: getComputedStyle(document.querySelector(".product-pin > .product-frame")!).position,
      hold:
        (document.querySelector(".product-pin") as HTMLElement).offsetHeight -
        (document.querySelector(".product-pin > .product-frame") as HTMLElement).offsetHeight,
      rock: document.querySelector("[data-rock='draw-4'] [data-rock-num]")!.textContent,
      checks: [...document.querySelectorAll("[data-seq='mark-day'], [data-seq='mark-team']")].map(
        (el) => getComputedStyle(el).opacity
      ),
      input: document.querySelector("[data-input]")!.textContent,
      send: (document.querySelector("[data-send]") as HTMLButtonElement).tabIndex,
    });
    const reduced = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return page.evaluate(read);
      },
      { reducedMotion: true }
    );
    expect(reduced.pin).toBe("relative");
    expect(reduced.hold).toBe(0);
    expect(reduced.rock).toBe("70");
    expect(reduced.checks).toEqual(["1", "1"]);
    expect(reduced.input).toBe("Message the Core");
    expect(reduced.send).toBe(-1);
    const motion = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.evaluate(read);
    });
    expect(motion.pin).toBe("sticky");
    expect(motion.hold).toBe(1800);
    expect(motion.rock).toBe("68");
    expect(motion.checks).toEqual(["0", "0"]);
    expect(motion.input).toBe("What's at risk this week?");
    expect(motion.send).toBe(0);
  });

  it("holds chapters 04 to 06 finished under reduced motion, and composes them under motion", async () => {
    const read = () => {
      const detail = document.querySelector("[data-chapter='04'] [data-detail]")!;
      const roster = document.querySelector("[data-chapter='05']")!;
      return {
        panel: getComputedStyle(detail).opacity,
        rows: [...detail.querySelectorAll("[data-grow]")].map((g) => g.getBoundingClientRect().height > 0),
        prompt: (detail.querySelector("[data-prompt]") as HTMLButtonElement).tabIndex,
        card: (document.querySelector("[data-chapter='04'] .product-card-face") as HTMLButtonElement).tabIndex,
        count: roster.querySelector("[data-running]")!.textContent,
        inbox: roster.querySelector("[data-agent='inbox'] [data-status]")!.textContent,
        inboxLog: getComputedStyle(roster.querySelector("[data-agent='inbox'] [data-log]")!).display,
        handoffRow: getComputedStyle(roster.querySelector("[data-handoff-row]")!).display,
        accent: getComputedStyle(document.querySelector("[data-chapter='06'] .product-shell")!).getPropertyValue("--accent").trim(),
        pressed: document.querySelector("[data-chapter='06'] button[aria-pressed='true']")!.textContent,
      };
    };
    const reduced = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return page.evaluate(read);
      },
      { reducedMotion: true }
    );
    expect(reduced.panel).toBe("1");
    expect(reduced.rows).toEqual([true, true, true]);
    expect(reduced.prompt).toBe(-1);
    expect(reduced.card).toBe(-1);
    expect(reduced.count).toBe("1");
    expect(reduced.inbox).toBe("3 drafts ready for your yes");
    expect(reduced.inboxLog).toBe("grid");
    expect(reduced.handoffRow).toBe("none");
    expect(reduced.accent).toBe("#4e7a4e");
    expect(reduced.pressed).toContain("Saguaro Capital");
    const motion = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.evaluate(read);
    });
    expect(motion.panel).toBe("0");
    expect(motion.rows).toEqual([false, false, false]);
    expect(motion.prompt).toBe(-1);
    expect(motion.card).toBe(0);
    expect(motion.count).toBe("2");
    expect(motion.inbox).toBe("Reading 14 new");
    expect(motion.inboxLog).toBe("none");
    expect(motion.handoffRow).toBe("none");
    expect(motion.accent).toBe("#4e7a4e");
    expect(motion.pressed).toContain("Saguaro Capital");
  });

  it("shows reveals immediately under reduced motion", async () => {
    const opacity = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return page.locator(".reveal").last().evaluate((el) => getComputedStyle(el).opacity);
      },
      { reducedMotion: true }
    );
    expect(opacity).toBe("1");
  });

  it("never scrolls horizontally on a phone", async () => {
    const overflow = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return page.evaluate(
          () => document.scrollingElement!.scrollWidth - document.documentElement.clientWidth
        );
      },
      { width: 390 }
    );
    expect(overflow).toBe(0);
  });
});
