/**
 * The one fictional world every product chapter reads from.
 *
 * Saguaro Capital is invented. Every person, company, number, and place is
 * invented and rounded. Nothing here derives from a real client, even
 * renamed. When the demo content changes (Max's pipeline reference, a new
 * exchange), change this file, never a chapter.
 */

export type Tile = { label: string; value: string; note: string; spark?: number[] };
/* `phone` is the same item in one line, for the window cropped on a phone (chapter 01), where a three-line body is grey at half scale */
export type NeedsYou = { id: string; title: string; body: string; phone?: string; receipts: string[]; action?: string };
export type AgendaItem = { time: string; title: string; ref?: string; done?: boolean };
export type TeamRow = { name: string; initials: string; items: { title: string; ref?: string; done?: boolean }[] };
export type Rock = { title: string; pct: number; note?: string; ref?: string; was?: number };
export type Exchange = { id: string; question: string; working: string[]; answer: string; receipts: string[] };
export type Card = { id: string; name: string; place: string; kind: string; amount: string; rate: string; note?: string; ref?: string };
export type Stage = { name: string; cards: Card[] };
export type Prompt = { label: string; answer: string; receipts: string[] };
export type Detail = { since: string; lastTouch: string; numbers: { label: string; value: string }[]; prompts: Prompt[] };
export type AgentStatus = { kind: "running" | "waiting" | "done" | "scheduled"; text: string };
/* `live` is what the roster showed before the status settled, in order: chapter 05's six-second moment plays through it */
export type Agent = { id: string; name: string; job: string; status: AgentStatus; lastResult: string; log: string[]; live?: AgentStatus[] };
export type Swatch = {
  id: string;
  company: string;
  user: { name: string; initials: string; greeting: string };
  accent: string;
  accentDeep: string;
  accentSoft: string;
  accentWash: string;
};

export const company = {
  name: "Saguaro Capital",
  user: { name: "Morgan Gray", initials: "MG", role: "Managing Partner" },
};

export const today = {
  greeting: "Good morning, Morgan.",
  subline: "Thursday, 9:40 am. Three things need you today, everything else is filed.",
  tiles: [
    { label: "Cash to deploy", value: "$4M", note: "bank feed, 6:00 am", spark: [3.2, 3.4, 3.1, 3.6, 3.8, 3.7, 4.0] },
    { label: "Assets under management", value: "$85M", note: "fund accounting" },
    { label: "Active loans", value: "60", note: "servicing" },
    { label: "Committed, undrawn", value: "$9M", note: "draw schedules" },
  ] satisfies Tile[],
  needsYou: [
    {
      id: "draw-4",
      title: "Draw approval",
      body: "Draw 4, the Palo Verde build. Computed and checked against budget: $130K, balance after $1.3M, LTC 79%. Inspection report attached. Ready for your yes.",
      phone: "Draw 4, Palo Verde. Checked and ready for your yes.",
      receipts: ["draw sheet", "inspection report"],
      action: "Approve",
    },
    {
      id: "cactus-wren",
      title: "New deal",
      body: "The Cactus Wren flip screened overnight. Passes borrower exposure at 4% of book, concentration inside limits. Full screen filed to the deal record.",
      phone: "Cactus Wren flip screened overnight. Inside limits.",
      receipts: ["exposure model", "deal screen"],
    },
    {
      id: "maturities",
      title: "Maturities",
      body: "Two loans mature inside 30 days. Payoff letters drafted for both. One borrower wants an extension, and the fee decision from August 12 is attached so nobody has to remember it.",
      phone: "Two loans mature inside 30 days. Payoff letters drafted.",
      receipts: ["servicing", "partner meeting, Aug 12"],
    },
  ] satisfies NeedsYou[],
  filedOvernight: 14,
  /* what the morning page lists under the status line; chapter 03 shows it behind the chat panel */
  filed: [
    { title: "Bank statement, Palo Verde", to: "loan file" },
    { title: "Insurance certificate, Redrock Flips", to: "deal record" },
    { title: "Draw 3 lien waivers, Ironline", to: "servicing" },
    { title: "Broker email, Canyon State", to: "deal record" },
    { title: "Appraisal invoice, Mesa Verde", to: "accounting" },
  ] satisfies { title: string; to: string }[],
  /* the one exchange chapter 01 shows in the Core's column, so the first
     dashboard a visitor sees already has the Core in it; chapter 03 asks
     its own question */
  ask: {
    question: "Which draws are due this week?",
    answer:
      "Three. Draw 4 on the Palo Verde build is checked against budget and waiting on your yes, $130K. Copper Sky’s third draw is set for Friday, and Cholla Creek’s seventh is waiting on Tuesday’s inspection.",
    receipts: ["draw schedules", "inspection report"],
    time: "9:38 am",
  },
  calendar: [
    { time: "8:30", title: "Approve Draw 4, Palo Verde" },
    { time: "9:00", title: "Partner standup" },
    { time: "11:00", title: "Call the borrower about the extension" },
    { time: "1:00", title: "Review the September report draft" },
    { time: "3:00", title: "Investor call, brief attached" },
  ],
};

/* a reply to one of chapter 02's questions: what the Core checked, what it
   says, where that came from, and anything it prepared for a yes */
export type CoreReply = {
  working: string[];
  answer: string;
  sources: string[];
  prepared?: { title: string; meta: string; body?: string; edit: string };
};

/* chapter 02, Ask the Core: Redrock Flips with its loan documents out and
   gone quiet, the one card lit on the board. The questions go from the deal,
   to the business around it (a rule set in a meeting, applied to this deal),
   to the work outstanding, to an action. */
export const core = {
  selected: "redrock",
  stage: "Docs out",
  note: "Quiet 21 days",
  numbers: [
    { label: "Loan amount", value: "$385K" },
    { label: "Rate", value: "12.25%" },
    { label: "Days at stage", value: "21" },
  ],
  questions: ["Who is this?", "What’s our rule on first-time borrowers?", "What’s outstanding?", "Draft an update"],
  replies: {
    "Who is this?": {
      working: ["Reading the borrower file", "Checking the broker’s notes"],
      answer:
        "Redrock Flips is a first-time borrower, introduced by Canyon State Brokers in July. This deal is a Tempe fix and flip, $385K at 12.25% on a three-bedroom rehab. The loan documents went out August 27 and haven’t come back signed.",
      sources: ["broker intro", "deal record"],
    },
    "What’s our rule on first-time borrowers?": {
      working: ["Searching partner meetings", "Reading the credit policy"],
      answer:
        "Two rules, set at the August 12 partner meeting: first-time borrowers sign a personal guarantee, and their loan documents come back within 14 days or the rate lock lapses. Redrock Flips is at 21 days, so its lock lapsed on September 10.",
      sources: ["partner meeting, Aug 12", "credit policy"],
    },
    "What’s outstanding?": {
      working: ["Reading the deal record", "Checking with the follow-up agent"],
      answer:
        "Two things. The signed loan documents and the entity’s operating agreement are both still out, 21 days after the docs went out. The follow-up agent has a check-in drafted and waiting for your yes.",
      sources: ["loan documents", "follow-up draft"],
      prepared: {
        title: "Check-in to Redrock Flips",
        meta: "Drafted by the follow-up agent. Asks for the signed documents and the operating agreement by Friday.",
        edit: "Review",
      },
    },
    "Draft an update": {
      working: ["Reading the deal record", "Writing it in your voice"],
      answer: "Here’s a short update for Redrock Flips. It picks up from the August 27 documents and asks for both signatures by Friday.",
      sources: ["deal record", "your sent mail"],
      prepared: {
        title: "Update to Redrock Flips",
        meta: "Draft, in your voice",
        body: "Hi, following up on the loan documents we sent August 27. Once they’re signed and we have the operating agreement, we can set a closing date. Could you send both back by Friday?",
        edit: "Edit",
      },
    },
  } satisfies Record<string, CoreReply>,
};

export const agenda = {
  yourDay: [
    { time: "8:30", title: "Approve Draw 4, Palo Verde", ref: "draw-4", done: true },
    { time: "9:00", title: "Partner standup, notes filed as they happen" },
    { time: "11:00", title: "Call the borrower about the extension" },
    { time: "1:00", title: "Review the September report draft" },
    { time: "3:00", title: "Investor call, brief already attached" },
    { time: "4:30", title: "Cholla Creek payoff letter, sign and send" },
    { time: "5:30", title: "Read the September report, second pass" },
  ] satisfies AgendaItem[],
  tomorrow: [
    { time: "8:30", title: "Partner standup" },
    { time: "10:00", title: "Cholla Creek payoff call" },
    { time: "1:00", title: "Underwriting call, Mesa Verde Devco" },
    { time: "3:30", title: "Sign the September report" },
    { time: "5:00", title: "Screen the Verde Valley lots" },
    { time: "6:00", title: "Draft the investor note" },
    { time: "6:30", title: "Cactus Wren site visit, confirm" },
  ] satisfies AgendaItem[],
  team: [
    {
      name: "Dana Whitfield",
      initials: "DW",
      items: [
        { title: "Draw 4 site walk, Palo Verde", ref: "draw-4", done: true },
        { title: "Two borrower calls, Tempe" },
        { title: "Palo Verde inspection report, filed" },
      ],
    },
    {
      name: "Marcus Lee",
      initials: "ML",
      items: [
        { title: "Term sheet review, Redrock Flips" },
        { title: "Broker intro, Canyon State" },
        { title: "Screen the Cactus Wren flip" },
      ],
    },
    {
      name: "Priya Shah",
      initials: "PS",
      items: [
        { title: "Underwriting call, Mesa Verde" },
        { title: "Servicing handoff, week two" },
        { title: "Order the Two Palms appraisal" },
      ],
    },
    {
      name: "Jordan Reyes",
      initials: "JR",
      items: [
        { title: "Builder’s risk renewals, October" },
        { title: "Investor brief, Thursday" },
        { title: "Rate lock review, Sandstone Villas" },
      ],
    },
  ] satisfies TeamRow[],
  unassigned: [
    { title: "Countersign the Ocotillo Commons term sheet" },
    { title: "Confirm the Sedona survey date" },
    { title: "Renew the Yucca Flats insurance" },
    { title: "Book the Pinnacle Peak appraisal" },
    { title: "File the Camelback title report" },
  ] satisfies { title: string }[],
  rocks: [
    /* the rock Draw 4 nudges in chapter 02: it reads `was` before the check propagates */
    { title: "Deploy $6M into new loans", pct: 70, was: 68, note: "on pace", ref: "draw-4" },
    { title: "Move servicing knowledge into the Core", pct: 80 },
    { title: "Fund report drafting itself by October", pct: 60 },
    { title: "Onboard the new loan ops hire", pct: 90 },
    { title: "Every loan file in the Core by December", pct: 45 },
  ] satisfies Rock[],
  lastQuarter: [
    { title: "Move servicing to the new platform", pct: 100 },
    { title: "Close the Ironline construction loan", pct: 100 },
    { title: "Hire the loan ops lead", pct: 100 },
    { title: "Close the Copper Sky loan", pct: 100 },
    { title: "Finish the servicing handbook", pct: 100 },
  ] satisfies Rock[],
  syncedTo: "Asana",
};

/* the agenda chapter's page: today on a clock at 9:40, a short to-do list,
   and what each teammate is in right now, with their day as busy spans */
export type AgendaBlock = { from: number; to: number; title: string; kind: "meeting" | "focus"; people?: string[]; note?: string };

export const agendaDay = {
  blocks: [
    { from: 9, to: 9.5, title: "Partner standup", kind: "meeting", people: ["MG", "DW", "ML", "PS", "JR"] },
    { from: 11, to: 11.5, title: "Extension call, Cholla Creek", kind: "meeting", note: "Brief attached" },
    { from: 13, to: 14, title: "September report, first read", kind: "focus", note: "Focus time" },
    { from: 15, to: 16, title: "Investor call", kind: "meeting", people: ["MG", "JR"], note: "Brief attached" },
    { from: 17, to: 18, title: "September report, second pass", kind: "focus", note: "Focus time" },
  ] satisfies AgendaBlock[],
  todo: [
    { title: "Approve Draw 4, Palo Verde", done: true, meta: "8:32 am" },
    { title: "Sign the Cholla Creek payoff letter", meta: "Drafted" },
    { title: "Countersign the Ocotillo Commons term sheet" },
    { title: "Confirm the Sedona survey date" },
  ] as { title: string; done?: boolean; meta?: string }[],
  team: [
    { initials: "DW", name: "Dana Whitfield", now: "Site walk, Palo Verde", until: 11.5, busy: [[9, 9.5], [9.5, 11.5], [13, 14], [14.5, 15.5]] },
    { initials: "ML", name: "Marcus Lee", now: "Term sheet review, Ocotillo Commons", until: 10.5, busy: [[9, 9.5], [9.5, 10.5], [11.5, 12.5], [15, 16]] },
    { initials: "PS", name: "Priya Shah", now: "Servicing handoff, week two", until: 11, busy: [[9, 9.5], [9.5, 11], [13, 14], [16, 17]] },
    { initials: "JR", name: "Jordan Reyes", now: "Investor brief for the 3:00 call", until: 12, busy: [[9, 9.5], [9.5, 12], [15, 16]] },
  ] as { initials: string; name: string; now: string; until: number; busy: number[][] }[],
};

export const chat = {
  placeholder: "Message the Core",
  exchanges: [
    {
      id: "risk",
      question: "What’s at risk this week?",
      working: ["Checking the borrower queue", "Cross-referencing draws and profiles"],
      answer:
        "Four flags. The one that matters: Cholla Creek matures inside 45 days with no payoff plan on file. The other three are a draw request overdue nine days, a borrower dormant at term sheet, and a builder’s risk policy expiring October 2.",
      receipts: ["servicing", "exposure model"],
    },
    {
      id: "maturing",
      question: "Which loans mature inside 60 days?",
      working: ["Reading the servicing ledger"],
      answer:
        "Two. Payoff letters are drafted for both, and one borrower has already asked about an extension, brief attached.",
      receipts: ["servicing"],
    },
    {
      id: "fees",
      question: "What did we decide about extension fees?",
      working: ["Searching partner meeting notes", "Checking the servicing policy"],
      answer:
        "One point for a 90 day extension, set at the August 12 partner meeting. Second extensions go to committee, and the wider pricing review is queued for Q4.",
      receipts: ["partner meeting, Aug 12", "servicing policy"],
    },
  ] satisfies Exchange[],
};

export const pipeline = {
  stages: [
    {
      name: "Screened",
      cards: [
        { id: "agave", name: "Agave Trail Homes", place: "Phoenix", kind: "Fix and flip", amount: "$445K", rate: "12.00%", note: "New" },
        { id: "two-palms", name: "Two Palms Development", place: "Chandler", kind: "Bridge", amount: "$520K", rate: "11.90%" },
        { id: "palo-brea", name: "Palo Brea Homes", place: "Phoenix", kind: "Fix and flip", amount: "$515K", rate: "11.85%" },
        { id: "yucca", name: "Yucca Flats Storage", place: "Casa Grande", kind: "Bridge", amount: "$780K", rate: "11.60%" },
        { id: "mesquite", name: "Mesquite Court", place: "Glendale", kind: "Fix and flip", amount: "$410K", rate: "12.10%", note: "New" },
        { id: "dove-valley", name: "Dove Valley Duplexes", place: "Phoenix", kind: "Fix and flip", amount: "$470K", rate: "12.05%" },
        { id: "salt-river", name: "Salt River Lofts", place: "Tempe", kind: "Bridge", amount: "$1.05M", rate: "11.45%" },
      ],
    },
    {
      name: "Term sheet",
      cards: [
        { id: "redrock", name: "Redrock Flips", place: "Tempe", kind: "Fix and flip", amount: "$385K", rate: "12.25%", note: "Dormant 21 days" },
        { id: "peoria", name: "North Peoria Duplexes", place: "Peoria", kind: "Ground-up", amount: "$1.35M", rate: "11.10%" },
        { id: "ocotillo", name: "Ocotillo Commons", place: "Chandler", kind: "Bridge", amount: "$1.1M", rate: "11.30%" },
        { id: "camelback", name: "Camelback Duplexes", place: "Phoenix", kind: "Fix and flip", amount: "$560K", rate: "11.95%" },
        { id: "sunset-bluff", name: "Sunset Bluff Homes", place: "Surprise", kind: "Ground-up", amount: "$1.2M", rate: "11.05%" },
        { id: "ironwood", name: "Ironwood Crossing", place: "Queen Creek", kind: "Bridge", amount: "$830K", rate: "11.55%" },
      ],
    },
    {
      name: "Underwriting",
      cards: [
        { id: "mesa-verde", name: "Mesa Verde Devco", place: "Scottsdale", kind: "Horizontal development", amount: "$2.4M", rate: "10.50%" },
        { id: "gila-bend", name: "Gila Bend Storage", place: "Buckeye", kind: "Bridge", amount: "$890K", rate: "11.40%" },
        { id: "pinnacle", name: "Pinnacle Peak Custom", place: "Scottsdale", kind: "Ground-up", amount: "$1.9M", rate: "10.80%" },
        { id: "verde-valley", name: "Verde Valley Lots", place: "Cottonwood", kind: "Land", amount: "$650K", rate: "11.70%" },
        { id: "prickly-pear", name: "Prickly Pear Storage", place: "Goodyear", kind: "Bridge", amount: "$940K", rate: "11.20%" },
        { id: "granite-reef", name: "Granite Reef Custom", place: "Scottsdale", kind: "Ground-up", amount: "$2.1M", rate: "10.75%" },
      ],
    },
    {
      name: "Docs out",
      cards: [
        { id: "sonoran", name: "Sonoran Urban Infill", place: "Phoenix", kind: "Bridge", amount: "$975K", rate: "10.95%" },
        { id: "sandstone", name: "Sandstone Villas", place: "Sedona", kind: "Ground-up", amount: "$1.45M", rate: "10.90%" },
        { id: "superstition", name: "Superstition Flats", place: "Apache Junction", kind: "Bridge", amount: "$720K", rate: "11.35%" },
      ],
    },
    {
      name: "Funded",
      cards: [
        { id: "ironline", name: "Ironline Builds", place: "Phoenix", kind: "Ground-up", amount: "$1.6M", rate: "11.25%", note: "Draw 4 pending", ref: "draw-4" },
        { id: "copper-sky", name: "Copper Sky Homes", place: "Mesa", kind: "Fix and flip", amount: "$640K", rate: "11.75%", note: "2 of 4 draws" },
        { id: "cholla", name: "Cholla Creek Partners", place: "Gilbert", kind: "Ground-up", amount: "$1.22M", rate: "11.50%", note: "6 of 8 draws" },
        { id: "saguaro-ridge", name: "Saguaro Ridge Townhomes", place: "Mesa", kind: "Ground-up", amount: "$1.3M", rate: "11.15%", note: "1 of 6 draws" },
      ],
    },
  ] satisfies Stage[],
  selected: "redrock" as const,
  details: {
    ironline: {
      since: "Repeat borrower since 2024",
      lastTouch: "Draw 4 inspection, Tuesday",
      numbers: [
        { label: "Loan amount", value: "$1.6M" },
        { label: "Loan to cost", value: "80%" },
        { label: "Borrower exposure", value: "3%" },
      ],
      prompts: [
        {
          label: "Who is this?",
          answer:
            "Ironline Builds, a repeat borrower since 2024. Three loans with us, all current. The principal is Sam Ortega, and the last touch was Tuesday’s Draw 4 inspection.",
          receipts: ["borrower history", "inspection report"],
        },
        {
          label: "What’s outstanding?",
          answer: "Draw 4 is computed and waiting on your approval. Nothing else is open.",
          receipts: ["draw sheet"],
        },
        {
          label: "Draft an update",
          answer: "Drafted a two-paragraph update on Draw 4 timing in the fund’s voice. It is in your drafts, not sent.",
          receipts: ["drafts"],
        },
      ],
    },
    redrock: {
      since: "First-time borrower, term sheet out August 20",
      lastTouch: "Email from the borrower, 21 days ago",
      numbers: [
        { label: "Loan amount", value: "$385K" },
        { label: "Rate", value: "12.25%" },
        { label: "Days at stage", value: "21" },
      ],
      prompts: [
        {
          label: "Who is this?",
          answer: "Redrock Flips, a first-time borrower introduced by Canyon State Brokers. The term sheet went out August 20 and has not been countersigned.",
          receipts: ["broker intro", "term sheet"],
        },
        {
          label: "What’s outstanding?",
          answer: "The signed term sheet and the entity documents. The follow-up agent has a nudge drafted and waiting for your yes.",
          receipts: ["follow-up draft"],
        },
        {
          label: "Draft an update",
          answer: "Drafted a short check-in that references the August 20 terms and asks for a decision by Friday. In your drafts.",
          receipts: ["drafts"],
        },
      ],
    },
    "mesa-verde": {
      since: "In underwriting since August 28",
      lastTouch: "Underwriting call scheduled Tuesday",
      numbers: [
        { label: "Loan amount", value: "$2.4M" },
        { label: "Loan to cost", value: "72%" },
        { label: "Concentration after", value: "41%" },
      ],
      prompts: [
        {
          label: "Who is this?",
          answer: "Mesa Verde Devco, a horizontal development in Scottsdale. Second deal with this sponsor; the first paid off on schedule in 2025.",
          receipts: ["sponsor history", "payoff record"],
        },
        {
          label: "What’s outstanding?",
          answer: "The appraisal and the updated budget. Construction concentration would land at 41% after funding, inside the 50% limit.",
          receipts: ["exposure model", "appraisal request"],
        },
        {
          label: "Draft an update",
          answer: "Drafted a note to the sponsor listing the two open items ahead of Tuesday’s call. In your drafts.",
          receipts: ["drafts"],
        },
      ],
    },
  } satisfies Record<string, Detail>,
  /* a card with no full detail on file: its panel is built from the card's
     own fields, and every prompt gets this one answer */
  generic: {
    answer: "Only the deal record so far: the basics on the card, and no touches logged yet.",
    receipts: ["deal record"],
  },
};

export const agents = {
  roster: [
    {
      id: "inbox",
      name: "Inbox agent",
      job: "Reads the shared inbox, files the routine, drafts replies for approval",
      status: { kind: "done", text: "3 drafts ready for your yes" },
      lastResult: "14 messages read, 11 filed, 3 drafted",
      log: ["6:02 am  Read 14 new messages", "6:05 am  Filed 11 to their loans", "6:09 am  Drafted 3 replies, waiting"],
      live: [{ kind: "running", text: "Reading 14 new" }],
    },
    {
      id: "follow-up",
      name: "Follow-up agent",
      job: "Watches deals for silence and drafts the nudge",
      status: { kind: "waiting", text: "1 draft waiting" },
      lastResult: "Redrock Flips, quiet 21 days in docs out",
      log: ["6:10 am  Checked 11 open deals", "6:10 am  One past the 14 day mark", "6:12 am  Drafted a check-in, waiting"],
      live: [
        { kind: "scheduled", text: "Runs at 6:10 am" },
        { kind: "running", text: "Checking 11 open deals" },
      ],
    },
    {
      id: "report",
      name: "Report agent",
      job: "Assembles the monthly report overnight, every line sourced",
      status: { kind: "scheduled", text: "Runs tonight, 11:00 pm" },
      lastResult: "August report, 41 lines, 41 sources",
      log: ["Aug 31  Pulled servicing and accounting", "Aug 31  Drafted 41 lines with sources", "Sep 1  Delivered for review"],
    },
    {
      id: "screening",
      name: "Screening agent",
      job: "Runs every new deal against the limits before anyone is in",
      status: { kind: "done", text: "Cactus Wren screened, 6:12 am" },
      lastResult: "Passes exposure at 4% of book",
      log: ["6:11 am  New application received", "6:11 am  Ran exposure and concentration", "6:12 am  Filed the screen to the deal"],
    },
    {
      id: "filing",
      name: "Filing agent",
      job: "Sweeps chat decisions and call notes into the Core nightly",
      status: { kind: "running", text: "Filing 9 decisions" },
      lastResult: "Last night: 12 decisions, 4 call notes",
      log: ["11:00 pm  Read the loan channels", "11:04 pm  Found 9 decisions", "11:05 pm  Filing to their loans"],
    },
  ] satisfies Agent[],
  /* the spec's two spares: on the roster page below the composer, not yet running */
  spares: [
    { id: "meeting-prep", name: "Meeting-prep agent", job: "Pulls the file, the last notes, and the open items before every call" },
    { id: "expiry", name: "Expiry watcher", job: "Watches insurance, permits, and rate locks for the dates about to pass" },
  ] satisfies { id: string; name: string; job: string }[],
  /* chapter 05's request: typed in the Core's message box, handed to an email agent that joins the
     top of the roster, and approved to go out by email and to each person's own dashboard */
  recap: {
    request: "Send the team a recap of this morning’s standup, with who owns what.",
    reply: "The email agent is on it. It’s pulling this morning’s standup notes and writing a recap with owners and dates.",
    agent: { name: "Email agent", job: "Standup recap to the team" },
    log: ["9:48 am  Read this morning’s standup notes", "9:48 am  Drafted a recap to 4 people", "9:52 am  Sent by email and to 4 dashboards"],
    to: ["DW", "ML", "PS", "JR"],
    subject: "Standup recap, Thursday",
    greeting: "Morning, team. Here’s who owns what from standup:",
    owners: [
      { who: "Dana", line: "send the Palo Verde inspection report by Friday" },
      { who: "Marcus", line: "finish the Ocotillo Commons term sheet review by Friday" },
      { who: "Priya", line: "close out the servicing handoff by Tuesday" },
      { who: "Jordan", line: "send the investor brief before the 3:00 call" },
    ],
    sent: "Sent. Dana, Marcus, Priya, and Jordan have it by email, and each of their dashboards now shows their own item at the top.",
  },
  /* the applications the screening agent works through, one each time the roster's loop comes round */
  applications: ["Desert Vista Homes", "Mesquite Court", "Palo Brea Homes"],
};

export const brand = {
  swatches: [
    /* each fictional company has its own person at the top of the morning page */
    {
      id: "saguaro",
      company: "Saguaro Capital",
      user: { name: "Morgan Gray", initials: "MG", greeting: "Good morning, Morgan." },
      accent: "#4e7a4e",
      accentDeep: "#3d633d",
      accentSoft: "#93b393",
      accentWash: "#e4ead8",
    },
    {
      id: "bellwether",
      company: "Bellwether Logistics",
      user: { name: "Elena Marsh", initials: "EM", greeting: "Good morning, Elena." },
      accent: "#4f6d8a",
      accentDeep: "#3e5770",
      accentSoft: "#9db2c4",
      accentWash: "#dfe6ec",
    },
    {
      id: "northline",
      company: "Northline Health",
      user: { name: "Owen Castellano", initials: "OC", greeting: "Good morning, Owen." },
      accent: "#3f7a78",
      accentDeep: "#325f5e",
      accentSoft: "#8fb8b6",
      accentWash: "#dbe8e7",
    },
    {
      id: "copperfield",
      company: "Copperfield Construction",
      user: { name: "Ray Holloway", initials: "RH", greeting: "Good morning, Ray." },
      accent: "#9c5a3c",
      accentDeep: "#7e4630",
      accentSoft: "#c9a08d",
      accentWash: "#efe0d6",
    },
  ] satisfies Swatch[],
};
