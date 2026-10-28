---
title: Can you put client data into ChatGPT? And four more questions to ask before AI touches the work
description: Compliance officers just named AI their top worry, and half of employees who use it hide that from their employer. Five questions test who controls the data.
author: max
published: 2026-10-28
takeaways:
  - 85 percent of investment adviser firms named AI the hottest compliance topic of 2026, the most dominant response in the survey's 21-year history (IAA and ACA Group).
  - More than half of employees who use AI at work admit to hiding it from their employer, and nearly half admit to policy-violating use (KPMG and University of Melbourne, 2025).
  - Five questions test four boundaries: who owns the context, where the data lives, what the system may do without a person, and whether you can leave.
  - Regulators have already moved. Reg S-P's compliance dates have passed, and the SEC has already brought AI-washing enforcement actions.
---

Short answer: client data does not belong in a personal account on a consumer chat tool. Not because the technology is bad, but because a personal chat account answers none of the questions a client, a regulator, or your own compliance calendar will eventually ask: where the data lives, what it trains, who can see it, and what happens when the employee leaves. The longer answer is that "can we use AI?" is the wrong question. The right ones are the five below. They test four boundaries: data, memory, action, and exit. Every one of them has an answer a vendor should be willing to put in writing.

## Is your team already using AI without telling you?

Your team is probably already using AI, whether or not the firm decided to. In 2024, Microsoft and LinkedIn's Work Trend Index found 78 percent of employees who use AI at work bring their own tools, with the share higher still at small and mid-sized companies, 80 percent ([Microsoft, 2024](https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part)). Worse, they hide it: 57 percent of employees who use AI admit to presenting AI-generated work as their own, and 48 percent admit to uses that violate policy, including feeding sensitive information into free public tools ([KPMG and University of Melbourne, 2025](https://kpmg.com/xx/en/media/press-releases/2025/04/trust-of-ai-remains-a-critical-challenge.html)).

The data flows confirm the self-reports. The data-monitoring firm Cyberhaven measured the sensitive share of corporate data going into AI tools at 34.8 percent, up from 10.7 percent two years earlier ([Cyberhaven, 2025](https://www.cyberhaven.com/resources/report/2025-ai-adoption-risk-report)).

```chart
type: line
title: Share of corporate data entered into AI tools classified as sensitive
unit: "%"
source: Cyberhaven, 2025
sourceUrl: https://www.cyberhaven.com/resources/report/2025-ai-adoption-risk-report
data:
  2023: 10.7
  2025: 34.8
```

Compliance has noticed. 85 percent of investment adviser firms named AI the hottest compliance topic of 2026, the most dominant single response in the survey's 21-year history ([Investment Adviser Association and ACA Group, 2026](https://www.acaglobal.com/news-and-announcements/survey-ai-dominates-compliance-priorities-at-historic-margin-as-firms-move-from-awareness-to-action/)).

A ban alone does not fix this. It mostly pushes the same behavior further out of sight, and the hiding numbers above suggest plenty of it is already there. What fixes it is giving the team a sanctioned place to do the same work, governed by real answers to the five questions below.

## Who owns the context it builds up?

Vendors talk about what models learn. The operative question for a firm is narrower and easier to check: who owns the conversations, the context, and the records that accumulate as your team works?

A personal chat account has one owner, and it is not the firm. Every conversation lives with the person who typed it, so the firm's accumulated judgment quietly becomes a private asset inside somebody's login. When your analyst leaves, that record leaves too. This is the memory boundary, and it doubles as the business question: the record of the firm's thinking should belong to the firm. Not to a vendor. Not to whoever happened to type it in.

## Where does the data live?

A vendor should answer this in one sentence. If they cannot, that is the answer.

Ask where the data sits, how it is encrypted in transit and at rest, whether it is pooled with other clients' data, and whether an actual data processing agreement backs the answer, one someone at your firm has actually read. Whatever architecture a vendor runs, they should be able to state it as plainly as that question demands. Regulators have already raised the floor: the SEC's amended Regulation S-P required incident response programs and customer breach notification, with compliance dates of December 3, 2025 for larger firms and June 3, 2026 for smaller ones, both now past ([FINRA](https://www.finra.org/rules-guidance/guidance/sec-regulation-s-p-compliance-date-reminder-20251114)).

## Does it train on you?

Ask directly: is any of our data used to train models, yours or anyone else's? Get the answer in writing, because this is the data boundary your clients care about even when they do not have the vocabulary for it. They will not ask about training runs. They will ask what happens to their information, and the firm needs to be able to answer in plain words, on the spot.

## What may it do without a person?

Agentic AI, meaning AI that does the work rather than just answering questions, is exactly why the action boundary has to be written down before the first agent runs. The pattern that holds up in practice is tiered approval, not blanket rules: routine, reversible work runs on its own and gets reviewed after; anything external, financial, or irreversible waits for a human yes. A firm that can say which tier a given action falls into has a governance model. A firm that cannot has an incident pending.

The industry is behind on this one. Deloitte found close to three-quarters of companies planning to deploy agentic AI within two years, while only 21 percent have a mature governance model for autonomous agents ([Deloitte, January 2026](https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html)).

## Can you leave?

This is the exit boundary, and it is vendor risk management with teeth. If your firm's knowledge lives in formats only the vendor can read, leaving is impossible, staying is not really a choice, and every future negotiation starts from that fact. Open, portable files that work without the vendor are what keep the relationship honest: continuity if the vendor stumbles, leverage while they do not, and a real answer when a client or an LP asks what happens to the records if the relationship ends.

## Is a firm memory the same thing as surveillance?

No, and the line is worth drawing early, inside your own walls. A firm memory exists to keep the work: the meetings, the decisions, the documents, the reasons why. It is not a camera pointed at your people.

The difference shows up in how it is built. A system shaped around how each person actually works, one that makes their day lighter, gets embraced. A system that reads as monitoring gets routed around, and it deserves to be. Given that a majority of AI users already hide their usage, building the trustworthy version is not idealism. It is the only version that gets adopted.

## What do you do with these five questions?

Put all five to every vendor touching client data, in writing. The good ones will already have the answers ready.

## Frequently asked questions

### Do AI meeting notes fall under SEC books and records requirements?

If they document your advisory business, assume recordkeeping rules such as Rule 204-2 can reach them, with multi-year retention. Industry coverage (Kitces.com has the best practitioner writeups) treats AI-generated notes as records to retain, not disposable convenience copies. Ask your compliance counsel before deploying, not after.

### What should a firm's AI policy actually include?

The five questions above, answered in writing: approved tools, where data may go, what may never be pasted into consumer apps, which actions run without approval and which wait for one, and how records are retained. Then give people a sanctioned tool, because policy without an alternative produces shadow AI. LPs are starting to ask too: due diligence questionnaires increasingly include whether the manager has a formal AI usage policy.

### What is AI washing?

Overstating what your AI actually does, to clients or investors. The SEC brought its first AI-washing enforcement actions in March 2024 against two advisers, and examiners now look at whether firms' AI claims match reality. The rule of thumb: describe what the system does today, in plain words, and nothing more.

### Is this legal advice?

No. It is an operator's checklist. Your compliance counsel gets the last word.
