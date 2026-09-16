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
  it("links to the site's two other pages, sentence case, and marks the current one", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const home = {
        labels: await page.locator("header nav a").allTextContents(),
        hrefs: await page.locator("header nav a").evaluateAll((as) => as.map((a) => a.getAttribute("href"))),
        current: await page.locator("header nav a[aria-current='page']").count(),
      };
      await page.goto(`${site.url}/team`, { waitUntil: "networkidle" });
      const team = {
        current: await page.locator("header nav a[aria-current='page']").textContent(),
        wordmark: await page.locator("header a:has(img)").getAttribute("href"),
      };
      return { home, team };
    });
    expect(r.home.labels).toEqual(["Team", "Insights"]);
    expect(r.home.hrefs).toEqual(["/team", "/insights"]);
    expect(r.home.current).toBe(0);
    expect(r.team.current).toBe("Team");
    expect(r.team.wordmark).toBe("/");
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
              cards: left(document.querySelector("#how-we-start ol h3")?.closest("li")!),
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
        stats: await page.locator("#what-we-do #stats .type-h2").allTextContents(),
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
    expect(r.stats).toEqual(["75%", "78%"]);
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
      "The same product, built around how your business works.",
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
  it("rebuilds the page business by business, with nothing to click", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      const chap = page.locator("[data-chapter='06']");
      await chap.scrollIntoViewIfNeeded();
      const greeting = () => chap.locator("[data-morph='head'] p").first().textContent();
      const first = await greeting();
      const controls = await chap.locator("button, [role='button']").count();
      /* a business holds about four seconds and takes one more to rebuild,
         so two waits past five seconds cover all three */
      await page.waitForTimeout(5600);
      const second = await greeting();
      await page.waitForTimeout(5000);
      const third = await greeting();
      return {
        seen: [first, second, third],
        controls,
        marks: await chap.locator("img[data-chrome]").getAttribute("src"),
        pageAccent: await page.locator("body").evaluate((el) => getComputedStyle(el).getPropertyValue("--accent").trim()),
      };
    });
    expect(r.seen).toEqual(["Good morning, Morgan.", "Good morning, Nina.", "Good morning, Daniel."]);
    /* the window's own buttons are the product's; the chapter adds none */
    expect(r.marks).toBe("/demo/kestrel-mark.png");
    expect(r.pageAccent).toBe("");
    expect(r.controls).toBeLessThan(4);
  });

  it("carries no demo captions and the fictional line once", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        captions: await page.getByText("Interactive demo · Sample data").count(),
        fictional: await page.getByText("Kestrel & Vane are fictional", { exact: false }).count(),
        /* the Core's map, and its lead-in, are parked for a page of their own */
        bridge: await page.getByText("Behind the chat is the").count(),
        indexes: await page.locator(".type-label-index").count(),
      };
    });
    expect(r.captions).toBe(0);
    expect(r.fictional).toBe(1);
    expect(r.bridge).toBe(0);
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
    expect(r.order).toEqual(["top", "what-we-do", "who-its-for", "how-we-start"]);
  });
});

describe("the landing page after the run", () => {
  it("qualifies, says how we start, and asks, with nothing said twice", async () => {
    const r = await withPage(async (page) => {
      await page.goto(site.url, { waitUntil: "networkidle" });
      return {
        who: await page.locator("#who-its-for h2").textContent(),
        gap: await page.getByText("That gap is where we work").count(),
        start: await page.locator("#how-we-start h2").textContent(),
        cards: await page.locator("#how-we-start h3").allTextContents(),
        when: await page.locator("#how-we-start ol .type-caption").allTextContents(),
        art: await page.locator("#how-we-start ol svg").count(),
        retainer: await page.locator("#how-we-start").getByText("If something breaks, we fix it", { exact: false }).count(),
        audit: await page.getByText("You keep the map either way").count(),
        closing: await page.getByText("Your firm already knows the answers").count(),
        /* moved to /team, /insights, or parked: none of it on the landing page */
        gone: await page.locator("#the-brain, #why-crosswell, #what-you-lose, #beyond-core, #values, #team, #insights").count(),
        offShelf: await page.getByText("Off the shelf fits nobody").count(),
        loses: await page.getByText("What a business actually loses").count(),
        vision: await page.getByText("To become the most sought after name in agentic AI").count(),
      };
    });
    expect(r.who).toBe("Built for businesses that run on what they know.");
    expect(r.gap).toBe(1);
    expect(r.start).toBe("Start small, on purpose.");
    expect(r.cards).toEqual(["The audit", "Onboarding"]);
    expect(r.when).toEqual(["Two weeks, fixed scope", "Week three on"]);
    expect(r.art).toBe(0);
    expect(r.retainer).toBe(1);
    expect(r.audit).toBe(1);
    expect(r.closing).toBe(1);
    expect(r.gone).toBe(0);
    expect(r.offShelf).toBe(0);
    expect(r.loses).toBe(0);
    expect(r.vision).toBe(0);
  });
});

describe("the team page", () => {
  it("carries the values, their costs, and the three bios, then the closing call", async () => {
    const r = await withPage(async (page) => {
      await page.goto(`${site.url}/team`, { waitUntil: "networkidle" });
      return {
        title: await page.title(),
        vision: await page.getByText("To become the most sought after name in agentic AI").count(),
        values: await page.locator("#values h3").allTextContents(),
        costs: await page.locator("#values").getByText("What it costs").count(),
        heading: await page.locator("#values h2").textContent(),
        valuesText: await page.locator("#values").textContent(),
        stewardship: await page.getByText("leaves with you in open files on the day you go").count(),
        roles: await page.locator("#team h3 + p").allTextContents(),
        closing: await page.getByText("Your firm already knows the answers").count(),
        footer: await page.locator("footer").textContent(),
        h1: await page.locator("h1").count(),
        order: await page.evaluate(() => [...document.querySelectorAll("main section[id]")].map((s) => s.id)),
        /* the first band clears the fixed nav */
        top: await page.locator("#values").evaluate((el) => Math.round(el.getBoundingClientRect().top + parseFloat(getComputedStyle(el).paddingTop))),
      };
    });
    expect(r.title).toBe("Team | Crosswell");
    expect(r.vision).toBe(1);
    expect(r.values).toEqual(["Trust", "Stewardship", "Continuity"]);
    expect(r.costs).toBe(3);
    // the vision line is the section's own title; no "Mission" or "Vision" heading
    expect(r.heading).toContain("To become the most sought after name");
    expect(r.valuesText).not.toMatch(/\b(Mission|Vision)\b/);
    expect(r.stewardship).toBe(1);
    expect(r.roles).toEqual(["Business & strategy", "Software & engineering", "Finance & operations"]);
    expect(r.closing).toBe(1);
    expect(r.footer).toContain("Custom agentic AI, built around how your team actually works. Arizona.");
    expect(r.h1).toBe(0);
    expect(r.order).toEqual(["values", "team"]);
    expect(r.top).toBeGreaterThanOrEqual(112);
  });
});

describe("the insights page", () => {
  it("holds the slot for the blog", async () => {
    const r = await withPage(async (page) => {
      await page.goto(`${site.url}/insights`, { waitUntil: "networkidle" });
      return {
        title: await page.title(),
        heading: await page.locator("#insights h2").textContent(),
        posts: await page.locator("#insights article").count(),
        order: await page.evaluate(() => [...document.querySelectorAll("main section[id]")].map((s) => s.id)),
      };
    });
    expect(r.title).toBe("Insights | Crosswell");
    expect(r.heading).toBe("Insights");
    expect(r.posts).toBe(0);
    expect(r.order).toEqual(["insights"]);
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
      const canonicals = await page.locator('link[rel="canonical"]').count();
      const robots = await (await page.request.get(`${site.url}/robots.txt`)).text();
      const sitemap = await (await page.request.get(`${site.url}/sitemap.xml`)).text();
      const og = await page.request.get(`${site.url}/og-image.jpg`);
      /* each page names itself, in its canonical and its Open Graph url */
      const own = async (path: string) => {
        await page.goto(`${site.url}${path}`, { waitUntil: "networkidle" });
        return page.evaluate(() => ({
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
          inHead: document.querySelector('head link[rel="canonical"]') !== null,
          ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
        }));
      };
      return { ...head, canonicals, robots, sitemap, ogStatus: og.status(), team: await own("/team"), insights: await own("/insights") };
    });
    expect(r.canonical).toBe("https://crosswellconsulting.com/");
    expect(r.canonicals).toBe(1);
    expect(r.team).toEqual({ canonical: "https://crosswellconsulting.com/team", inHead: true, ogUrl: "https://crosswellconsulting.com/team" });
    expect(r.insights).toEqual({ canonical: "https://crosswellconsulting.com/insights", inHead: true, ogUrl: "https://crosswellconsulting.com/insights" });
    expect(r.sitemap).toContain("https://crosswellconsulting.com/team");
    expect(r.sitemap).toContain("https://crosswellconsulting.com/insights");
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

  it("holds the custom chapter on the first business under reduced motion", async () => {
    const read = () => ({
      greeting: document.querySelector("[data-chapter='06'] [data-morph='head'] p")!.textContent,
      mark: document.querySelector("[data-chapter='06'] img[data-chrome]")!.getAttribute("src"),
    });
    const reduced = await withPage(
      async (page) => {
        await page.goto(site.url, { waitUntil: "networkidle" });
        const chap = page.locator("[data-chapter='06']");
        await chap.scrollIntoViewIfNeeded();
        await page.waitForTimeout(5600);
        return page.evaluate(read);
      },
      { reducedMotion: true }
    );
    expect(reduced).toEqual({ greeting: "Good morning, Morgan.", mark: "/demo/saguaro-mark.svg" });
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
