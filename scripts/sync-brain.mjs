#!/usr/bin/env node
// Pull key Crosswell brain files into docs/brain/ as a read-only, committed snapshot.
// The brain (Obsidian vault) is the live source of truth; this mirror is a convenience
// so the repo carries its own strategy/brand/copy context.
//
// Run: npm run sync:brain
// Override the brain location with the CROSSWELL_BRAIN_DIR env var.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEST = path.join(REPO_ROOT, 'docs', 'brain');

const BRAIN_PROJECT =
  process.env.CROSSWELL_BRAIN_DIR ||
  'C:\\AISecondBrain\\03 Projects\\Crosswell Consulting';

// Only mirror human-readable context and brand assets. Skip Obsidian/vault plumbing.
const COPY_EXT = new Set(['.md', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.pdf']);
const SKIP_DIR = new Set(['.obsidian', '.git', 'node_modules', '.trash']);
const KEEP_IN_DEST = new Set(['README.md']); // not removed when clearing the mirror

function fail(msg) {
  console.error(`sync-brain: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(BRAIN_PROJECT)) {
  fail(`brain project not found at:\n  ${BRAIN_PROJECT}\nSet CROSSWELL_BRAIN_DIR to override.`);
}

// Collect copyable files as paths relative to the brain project root.
function collect(dir, rel = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIR.has(entry.name)) continue;
      out.push(...collect(path.join(dir, entry.name), path.join(rel, entry.name)));
    } else if (entry.isFile() && COPY_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push(path.join(rel, entry.name));
    }
  }
  return out;
}

// Remove previously synced content so deletions in the brain propagate. Keep README.md.
function clearDest(dir, rel = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const r = path.join(rel, entry.name);
    if (entry.isDirectory()) {
      clearDest(abs, r);
      if (fs.readdirSync(abs).length === 0) fs.rmdirSync(abs);
    } else if (!KEEP_IN_DEST.has(r)) {
      fs.rmSync(abs);
    }
  }
}

const files = collect(BRAIN_PROJECT);

fs.mkdirSync(DEST, { recursive: true });
clearDest(DEST);

for (const rel of files) {
  const to = path.join(DEST, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(path.join(BRAIN_PROJECT, rel), to);
}

const manifest = {
  source: BRAIN_PROJECT,
  syncedAt: new Date().toISOString(),
  fileCount: files.length,
  files: files.map((f) => f.split(path.sep).join('/')).sort(),
};
fs.writeFileSync(path.join(DEST, '_synced.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(`sync-brain: copied ${files.length} file(s) from`);
console.log(`  ${BRAIN_PROJECT}`);
console.log('into docs/brain/');
for (const f of manifest.files) console.log(`  + ${f}`);
