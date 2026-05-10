#!/usr/bin/env node
// ─── build-deep-tags-vocabulary.mjs ─────────────────────────────────────────
// Phase 1 prebuild step for Deep Dive (per docs/deep-dive-review/SPEC_DRAFT_v3.md
// §3.5, Q-4: "prebuild script that converts CSV to JSON").
//
// Reads:  docs/deep-dive-vocabulary.csv         (operator-edited source of truth)
// Writes: src/data/deep-dive-vocabulary.json    (build artifact, committed)
//
// Output shape:
//   {
//     "groups":     { "<group>": [ { "tag": "<slug>", "notes": "..." }, ... ], ... },
//     "groupOrder": [ "<group>", ... ],     // first-seen order in the CSV
//     "generated_at": "<ISO timestamp>",
//     "source_sha":   "<sha256 of the CSV file bytes>"
//   }
//
// Idempotent: running it twice produces the same JSON modulo `generated_at`.
// Exits non-zero on any parse error.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const CSV_PATH = resolve(REPO_ROOT, "docs/deep-dive-vocabulary.csv");
const JSON_PATH = resolve(REPO_ROOT, "src/data/deep-dive-vocabulary.json");

function fail(msg) {
  process.stderr.write(`build-deep-tags-vocabulary: ${msg}\n`);
  process.exit(1);
}

// ─── parse: trivial CSV parser ─────────────────────────────────────────────
// The vocabulary CSV is fully under operator control and the format is
// constrained to three plain columns (tag, group, notes). Notes may contain
// spaces but must not contain commas, quotes, or newlines. Anything fancier
// belongs in a richer schema; we deliberately keep the format dumb so the
// operator can hand-edit it in any tool.
function parseCsv(text) {
  // Normalize line endings (CRLF tolerated — quirk #2 in CLAUDE.md).
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (raw === "") continue;
    const parts = raw.split(",");
    if (parts.length < 3) {
      fail(`line ${i + 1}: expected at least 3 comma-separated columns, got ${parts.length}: ${JSON.stringify(raw)}`);
    }
    // Re-join columns past index 2 in case `notes` ever contains a comma — but
    // warn loudly, since the format spec forbids it.
    const tag = parts[0].trim();
    const group = parts[1].trim();
    const notes = parts.slice(2).join(",").trim();
    if (parts.length > 3) {
      process.stderr.write(`build-deep-tags-vocabulary: warning — line ${i + 1} has more than 3 columns; treating extras as part of notes.\n`);
    }
    rows.push({ tag, group, notes, line: i + 1 });
  }
  if (rows.length === 0) fail("CSV is empty");
  const header = rows.shift();
  if (header.tag !== "tag" || header.group !== "group" || header.notes !== "notes") {
    fail(`expected header "tag,group,notes" on line 1, got ${JSON.stringify(`${header.tag},${header.group},${header.notes}`)}`);
  }
  return rows;
}

function buildVocab(rows, csvBytes) {
  const groups = {};
  const groupOrder = [];
  for (const row of rows) {
    if (!row.tag) fail(`line ${row.line}: empty tag`);
    if (!row.group) fail(`line ${row.line}: empty group for tag "${row.tag}"`);
    if (!groups[row.group]) {
      groups[row.group] = [];
      groupOrder.push(row.group);
    }
    groups[row.group].push({ tag: row.tag, notes: row.notes });
  }
  return {
    groups,
    groupOrder,
    generated_at: new Date().toISOString(),
    source_sha: createHash("sha256").update(csvBytes).digest("hex"),
  };
}

const csvBytes = readFileSync(CSV_PATH);
const rows = parseCsv(csvBytes.toString("utf8"));
const vocab = buildVocab(rows, csvBytes);
const json = JSON.stringify(vocab, null, 2) + "\n";
writeFileSync(JSON_PATH, json);
process.stdout.write(
  `build-deep-tags-vocabulary: wrote ${JSON_PATH} ` +
  `(${vocab.groupOrder.length} groups, ${rows.length} tags, source_sha ${vocab.source_sha.slice(0, 12)})\n`
);
