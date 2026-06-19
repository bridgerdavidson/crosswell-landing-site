#!/usr/bin/env node
// Write a build milestone from this repo back into the Crosswell brain, so the
// strategy layer stays in the loop on what the site build has done.
//
// Run: npm run log:brain -- "what changed"
// Override the brain location with the CROSSWELL_BRAIN_DIR env var.

import fs from 'node:fs';
import path from 'node:path';

const BRAIN_PROJECT =
  process.env.CROSSWELL_BRAIN_DIR ||
  'C:\\AISecondBrain\\03 Projects\\Crosswell Consulting';

const LOG_FILE = path.join(BRAIN_PROJECT, 'Landing Site Build Log.md');

const message = process.argv.slice(2).join(' ').trim();
if (!message) {
  console.error('log-to-brain: provide a message, e.g. npm run log:brain -- "shipped hero section"');
  process.exit(1);
}
if (!fs.existsSync(BRAIN_PROJECT)) {
  console.error(`log-to-brain: brain project not found at:\n  ${BRAIN_PROJECT}\nSet CROSSWELL_BRAIN_DIR to override.`);
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const stamp =
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
  `${pad(now.getHours())}:${pad(now.getMinutes())}`;

const HEADER = `---
title: Landing Site Build Log
generated_by: crosswell-landing-site repo
note: Written automatically by the landing-site repo via "npm run log:brain". Each entry records a build milestone. Newest entries at the bottom.
---

# Landing Site Build Log

What the landing-site build has done, written back from the repo so the strategy layer stays in the loop.
`;

if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, HEADER);
}

fs.appendFileSync(LOG_FILE, `\n## ${stamp}\n\n${message}\n`);

console.log('log-to-brain: appended entry to');
console.log(`  ${LOG_FILE}`);
console.log(`  ## ${stamp}  ${message}`);
