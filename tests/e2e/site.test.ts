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
    expect(css).toMatch(/product-frame\{--fade-x:160px;--fade-y:120px;/);
    expect(css).toMatch(/product-frame\{--fade-x:120px;--fade-y:120px\}/);
  });
});

describe("page column", () => {
  it("caps the content and hangs only the frames past the words", async () => {
    const edges = async (width: number) =>
      withPage(
        async (page) => {
          await page.goto(site.url, { waitUntil: "networkidle" });
          return page.evaluate(() => {
            const left = (el: Element | null) => Math.round(el!.getBoundingClientRect().left);
            const right = (el: Element | null) => Math.round(innerWidth - el!.getBoundingClientRect().right);
            return {
              logo: left(document.querySelector("header img")),
              claim: left(document.querySelector("[data-chapter] h3, main h3.type-h2")),
              cards: left(document.querySelector("#why-crosswell .rounded-2xl")),
              footer: left(document.querySelector("footer img")),
              frame: [...document.querySelectorAll(".product-frame, [data-window], [data-core-stage]")].map((f) => [left(f), right(f)]),
              overflow: document.documentElement.scrollWidth - innerWidth,
            };
          });
        },
        { width }
      );
    const frames = (n: number) => Array(5).fill([n, n]);
    expect(await edges(1024)).toEqual({ logo: 48, claim: 48, cards: 48, footer: 48, frame: frames(48), overflow: 0 });
    expect(await edges(1440)).toEqual({ logo: 80, claim: 80, cards: 80, footer: 80, frame: frames(48), overflow: 0 });
    expect(await edges(1728)).toEqual({ logo: 224, claim: 224, cards: 224, footer: 224, frame: frames(192), overflow: 0 });
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
        filed: await run.getByText("Filed overnight").count(),
        window: await run.locator("[data-window]").filter({ hasText: "Good morning, Morgan." }).count(),
        captions: await page.getByText("Interactive demo · Sample data").count(),
      };
    });
    expect(r.leadIn).toBe("Here’s that screen at work, custom built for a sample private lending company.");
    expect(r.claim).toBe("Your morning, already assembled.");
    expect(r.labels).toBe(0);
    expect(r.greeting).toBe(1);
    expect(r.filed).toBe(1);
    expect(r.window).toBe(1);
    expect(r.captions).toBe(0);
  });
});

describe("chapter 02, ask the Core", () => {
  it("waits for each click and gives each question its own reply", async () => {
    const r = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        const chap = page.locator("[data-chapter='core']");
        const claim = await chap.locator("h3").first().textContent();
        const restChips = await chap.getByRole("button", { name: "Who is this?" }).count();
        await chap.getByRole("button", { name: "Ask the Core" }).click();
        await chap.getByRole("button", { name: "Who is this?" }).click();
        const who = await chap.getByText("Redrock Flips is a first-time borrower", { exact: false }).count();
        const sendAfterWho = await chap.getByRole("button", { name: "Send", exact: true }).count();
        await chap.getByRole("button", { name: "What’s our rule on first-time borrowers?" }).click();
        const rule = await chap.getByText("so its lock lapsed on September 10", { exact: false }).count();
        await chap.getByRole("button", { name: "What’s outstanding?" }).click();
        const outstanding = await chap.getByText("The signed loan documents and the entity’s operating agreement", { exact: false }).count();
        await chap.getByRole("button", { name: "Send", exact: true }).click();
        return {
          claim,
          restChips,
          who,
          sendAfterWho,
          outstanding,
          rule,
          nudged: await chap.getByText("Nudged today").count(),
          left: await chap.getByRole("button", { name: "Draft an update" }).count(),
        };
      },
      { reducedMotion: true }
    );
    expect(r.claim).toBe("Your whole business, a question away. The next step, a yes away.");
    expect(r.restChips).toBe(0);
    expect(r.who).toBe(1);
    expect(r.sendAfterWho).toBe(0);
    expect(r.outstanding).toBe(1);
    expect(r.rule).toBe(1);
    expect(r.nudged).toBe(1);
    expect(r.left).toBe(1);
  });
});

describe("the agenda chapter", () => {
  it("draws the day, the to-do list, and the team in the dashboard’s window", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const chap = page.locator("[data-chapter='agenda']");
      return {
        window: await chap.locator("[data-window]").count(),
        date: await chap.getByText("Thursday, September 17").count(),
        synced: await chap.getByText("Synced to Asana").count(),
        standup: await chap.getByText("Partner standup").count(),
        todo: await chap.getByText("Approve Draw 4, Palo Verde").count(),
        team: await chap.getByText("What the team is up to").count(),
      };
    });
    expect(r).toEqual({ window: 1, date: 1, synced: 1, standup: 1, todo: 1, team: 1 });
  });
});

describe("the agents chapter", () => {
  it("sits on the run’s one dark band", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        bands: await page.locator("main section.bg-charcoal-deep").count(),
        agents: await page.locator("section.bg-charcoal-deep [data-chapter='05']").count(),
        claim: await page.locator("section.bg-charcoal-deep [data-chapter='05'] h3").first().textContent(),
        order: await page.locator("main h3.type-h2").evaluateAll((hs) => hs.map((h) => h.textContent)),
      };
    });
    expect(r.bands).toBeGreaterThanOrEqual(1);
    expect(r.agents).toBe(1);
    expect(r.claim).toBe("You name the work. We build the agent that does it.");
    const run = r.order.slice(r.order.indexOf("Your morning, already assembled."));
    expect(run.slice(0, 5)).toEqual([
      "Your morning, already assembled.",
      "Your whole business, a question away. The next step, a yes away.",
      "Your day, and everyone else’s, without asking.",
      "You name the work. We build the agent that does it.",
      "It looks like your company, not ours.",
    ]);
  });

  it("draws the Agents page in the dashboard’s dark colours", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const chap = page.locator("[data-chapter='05']");
      const dark = chap.locator(".dashboard-dark");
      return {
        window: await chap.locator("[data-window]").count(),
        dark: await dark.count(),
        agents: await chap.getByText(/^(Inbox|Follow-up|Report|Screening|Filing) agent$/).count(),
        review: await chap.getByText("Review 3 drafts").count(),
        spares: await chap.getByText("Ready to add").count(),
        ink: await dark.evaluate((el) => getComputedStyle(el).getPropertyValue("--color-ink").trim()),
      };
    });
    expect(r).toEqual({ window: 1, dark: 1, agents: 5, review: 1, spares: 1, ink: "#f1eee6" });
  });

  it("hands the typed request to an email agent, which drafts and sends it", async () => {
    const r = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        const chap = page.locator("[data-chapter='05']");
        await chap.scrollIntoViewIfNeeded();
        const atRest = await chap.getByText("Email agent", { exact: true }).count();
        const replayAtRest = await chap.locator(".product-replay.is-ready").count();
        await chap.getByRole("button", { name: "Send", exact: true }).click();
        const drafted = {
          row: await chap.getByText("Email agent", { exact: true }).count(),
          draft: await chap.getByText("Email draft").count(),
          owner: await chap.getByText("finish the Ocotillo Commons term sheet review by Friday").count(),
          edit: await chap.getByRole("button", { name: "Edit" }).isDisabled(),
        };
        await chap.getByRole("button", { name: "Approve and send" }).click();
        const sent = {
          /* the Core's draft card and the agent's own log both say it */
          said: await chap.getByText("Sent by email and to 4 dashboards", { exact: true }).count(),
          row: await chap.getByText("By email and to 4 dashboards", { exact: true }).count(),
          told: await chap.getByText("each of their dashboards now shows their own item", { exact: false }).count(),
        };
        await chap.getByRole("button", { name: /^Waiting on you/ }).click();
        const waiting = await chap.locator("button[aria-expanded]").count();
        await chap.locator(".product-replay").click();
        return { atRest, replayAtRest, drafted, sent, waiting, back: await chap.getByRole("button", { name: "Send", exact: true }).count() };
      },
      { reducedMotion: true }
    );
    expect(r.atRest).toBe(0);
    expect(r.replayAtRest).toBe(0);
    expect(r.drafted).toEqual({ row: 2, draft: 1, owner: 1, edit: true });
    expect(r.sent).toEqual({ said: 2, row: 1, told: 1 });
    expect(r.waiting).toBe(2);
    expect(r.back).toBe(1);
  });
});

describe("the custom chapter and the whole run", () => {
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

  it("carries no demo captions and the fictional line once", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        captions: await page.getByText("Interactive demo · Sample data").count(),
        fictional: await page.getByText("Saguaro Capital is fictional").count(),
        bridge: await page.getByText("Behind the chat is the").count(),
        indexes: await page.locator(".type-label-index").count(),
      };
    });
    expect(r.captions).toBe(0);
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
          agents: await page.getByText("Inbox agent").first().isVisible(),
        };
      },
      { js: false }
    );
    expect(r.greeting).toBe(true);
    expect(r.captions).toBe(0);
    expect(r.agents).toBe(true);
  });

  it("draws the agenda still, with no pin, under motion and under reduced motion", async () => {
    const read = () => ({
      pins: document.querySelectorAll("[data-chapter='agenda'] .product-pin").length,
      height: Math.round((document.querySelector("[data-chapter='agenda'] [data-window]") as HTMLElement).getBoundingClientRect().height),
    });
    const reduced = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return page.evaluate(read);
      },
      { reducedMotion: true }
    );
    const motion = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.evaluate(read);
    });
    expect(reduced).toEqual({ pins: 0, height: 800 });
    expect(motion).toEqual({ pins: 0, height: 800 });
  });

  it("holds the custom chapter finished under reduced motion and under motion", async () => {
    const read = () => ({
      accent: getComputedStyle(document.querySelector("[data-chapter='06'] .product-shell")!).getPropertyValue("--accent").trim(),
      pressed: document.querySelector("[data-chapter='06'] button[aria-pressed='true']")!.textContent,
    });
    const reduced = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return page.evaluate(read);
      },
      { reducedMotion: true }
    );
    expect(reduced.accent).toBe("#4e7a4e");
    expect(reduced.pressed).toContain("Saguaro Capital");
    const motion = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return page.evaluate(read);
    });
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

  it("never scrolls horizontally, with motion, under reduced motion, or without JavaScript", async () => {
    const overflow = (opts: { width: number; reducedMotion?: boolean; js?: boolean }) =>
      withPage(async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        return page.evaluate(
          () => document.scrollingElement!.scrollWidth - document.documentElement.clientWidth
        );
      }, opts);
    for (const width of [390, 1024, 1280]) {
      expect(await overflow({ width }), `motion at ${width}`).toBe(0);
      expect(await overflow({ width, reducedMotion: true }), `reduced motion at ${width}`).toBe(0);
      expect(await overflow({ width, js: false }), `no JavaScript at ${width}`).toBe(0);
    }
  });
});
