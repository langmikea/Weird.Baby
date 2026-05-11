#!/usr/bin/env node
// ─── export-deep-tags.mjs ───────────────────────────────────────────────────
// Phase 3 of Deep Dive (per docs/deep-dive-review/SPEC_DRAFT_v3.md §3.4, §5).
//
// Reads MediaVault's SQLite blob at GET <mv-base>/db, filters to released
// scope:hunter_root YouTube parents, extracts deep:<group>:<tag> tags from
// `artifacts.tags[]` and the museum-side card_id from `artifacts.notes[]`,
// and writes the grouped result to src/data/deep-tags.json.
//
// MV currently has no `deep:*` tagged artifacts (Phase 4 is what produces
// them); this is expected and the script writes `cards: {}` in that case.
// Empty result is success.
//
// Usage:
//   node tools/export-deep-tags.mjs [flags]
//   --mv-base <url>     base URL for MV. default http://127.0.0.1:51822
//   --output <path>     output path. default src/data/deep-tags.json
//   --dry-run           compute everything; print summary; do not write
//   --verbose           print SQL, row counts, per-card extraction details
//   --help              show usage and exit
//
// Exits 0 on success (including empty result). Non-zero on any error.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, statSync, mkdtempSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";
import Database from "better-sqlite3";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const DEFAULT_MV_BASE = "http://127.0.0.1:51822";
const DEFAULT_OUTPUT = "src/data/deep-tags.json";
const VOCAB_JSON_PATH = resolve(REPO_ROOT, "src/data/deep-dive-vocabulary.json");
const VOCAB_CSV_PATH = resolve(REPO_ROOT, "docs/deep-dive-vocabulary.csv");

const SQL_QUERY = `SELECT a.id, a.tags, a.notes
FROM artifacts a
WHERE a.status = 'released'
  AND a.parent_artifact_id IS NULL
  AND a.source_platform = 'youtube'
  AND EXISTS (
    SELECT 1 FROM json_each(a.tags)
    WHERE json_each.value = 'scope:hunter_root'
  );`;

function fail(msg, code = 1) {
  process.stderr.write(`export-deep-tags: ${msg}\n`);
  process.exit(code);
}

function logVerbose(verbose, ...args) {
  if (verbose) process.stderr.write(`export-deep-tags: ${args.join(" ")}\n`);
}

function printHelp() {
  process.stdout.write([
    "Usage: node tools/export-deep-tags.mjs [flags]",
    "",
    "  --mv-base <url>   base URL for MV (default http://127.0.0.1:51822)",
    "  --output <path>   output path (default src/data/deep-tags.json)",
    "  --dry-run         compute and report; do not write the file",
    "  --verbose         print SQL, row counts, per-card extraction details",
    "  --help            show this message",
    "",
  ].join("\n"));
}

function parseArgs(argv) {
  const opts = {
    mvBase: DEFAULT_MV_BASE,
    output: DEFAULT_OUTPUT,
    dryRun: false,
    verbose: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") { opts.help = true; }
    else if (a === "--dry-run") { opts.dryRun = true; }
    else if (a === "--verbose") { opts.verbose = true; }
    else if (a === "--mv-base") { opts.mvBase = argv[++i]; if (!opts.mvBase) fail("--mv-base requires a value"); }
    else if (a === "--output") { opts.output = argv[++i]; if (!opts.output) fail("--output requires a value"); }
    else if (a.startsWith("--mv-base=")) { opts.mvBase = a.slice("--mv-base=".length); }
    else if (a.startsWith("--output=")) { opts.output = a.slice("--output=".length); }
    else { fail(`unknown flag: ${a}\nrun with --help for usage.`); }
  }
  return opts;
}

function readVocabulary() {
  let json;
  try {
    json = JSON.parse(readFileSync(VOCAB_JSON_PATH, "utf8"));
  } catch (err) {
    fail(`could not read vocabulary JSON at ${VOCAB_JSON_PATH}: ${err.message}\n` +
         `(run \`npm run prebuild\` to regenerate from the CSV)`);
  }
  if (!Array.isArray(json.groupOrder)) {
    fail(`vocabulary JSON missing groupOrder array: ${VOCAB_JSON_PATH}`);
  }
  return json;
}

async function fetchMvBlob(mvBase, verbose) {
  const url = `${mvBase.replace(/\/+$/, "")}/db`;
  logVerbose(verbose, `fetching ${url}`);
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    fail(`Could not reach MediaVault at \`${url}\`. Is MV running? ` +
         `(Start it via \`launch_mediavault.bat\` in \`C:\\AI\\Platform\\MediaVault\\\`.)\n` +
         `underlying error: ${err.message}`);
  }
  if (!res.ok) {
    fail(`MV returned HTTP ${res.status} for ${url}. ` +
         `Expected 200 with the SQLite blob as application/octet-stream.`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  logVerbose(verbose, `received ${buf.length} bytes from ${url}`);
  return { url, buf };
}

function runQuery(buf, verbose) {
  // better-sqlite3 reads from disk, so write the blob to a temp file.
  const tmp = mkdtempSync(path.join(tmpdir(), "deep-tags-"));
  const tmpDb = path.join(tmp, "mv.sqlite");
  try {
    writeFileSync(tmpDb, buf);
    const db = new Database(tmpDb, { readonly: true, fileMustExist: true });
    try {
      logVerbose(verbose, "SQL:", SQL_QUERY.replace(/\s+/g, " "));
      const rows = db.prepare(SQL_QUERY).all();
      logVerbose(verbose, `query returned ${rows.length} row(s)`);
      return rows;
    } finally {
      db.close();
    }
  } finally {
    try { rmSync(tmp, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}

function extractCardId(notesText, artifactId, verbose) {
  if (notesText == null || notesText === "") return null;
  let arr;
  try {
    arr = JSON.parse(notesText);
  } catch {
    logVerbose(verbose, `  ${artifactId}: notes is not valid JSON; skipping`);
    return null;
  }
  if (!Array.isArray(arr)) return null;
  const matches = arr
    .filter((s) => typeof s === "string" && s.startsWith("card_id:"))
    .map((s) => s.slice("card_id:".length).trim())
    .filter(Boolean);
  if (matches.length === 0) return null;
  if (matches.length > 1) {
    logVerbose(verbose, `  ${artifactId}: multiple card_id entries (${matches.join(", ")}); using last`);
  }
  return matches[matches.length - 1];
}

function extractDeepTags(tagsText, artifactId, verbose) {
  if (tagsText == null || tagsText === "") return [];
  let arr;
  try {
    arr = JSON.parse(tagsText);
  } catch {
    logVerbose(verbose, `  ${artifactId}: tags is not valid JSON; skipping`);
    return [];
  }
  if (!Array.isArray(arr)) return [];
  const deeps = [];
  for (const t of arr) {
    if (typeof t !== "string" || !t.startsWith("deep:")) continue;
    const parts = t.split(":");
    if (parts.length !== 3 || !parts[1] || !parts[2]) {
      logVerbose(verbose, `  ${artifactId}: malformed deep tag "${t}"; skipping`);
      continue;
    }
    deeps.push({ group: parts[1], tag: parts[2] });
  }
  return deeps;
}

function buildCardsMap(rows, knownGroups, verbose) {
  const cards = {};
  const skipped = [];
  const unknownGroups = new Set();
  let totalDeepTags = 0;

  for (const row of rows) {
    const cardId = extractCardId(row.notes, row.id, verbose);
    if (!cardId) {
      skipped.push(row.id);
      logVerbose(verbose, `  ${row.id}: no card_id in notes; skipping row`);
      continue;
    }
    const deeps = extractDeepTags(row.tags, row.id, verbose);
    logVerbose(verbose, `  ${row.id} -> ${cardId}: ${deeps.length} deep tag(s)`);
    if (!cards[cardId]) cards[cardId] = {};
    for (const { group, tag } of deeps) {
      if (!knownGroups.has(group)) unknownGroups.add(group);
      if (!cards[cardId][group]) cards[cardId][group] = [];
      if (!cards[cardId][group].includes(tag)) {
        cards[cardId][group].push(tag);
        totalDeepTags += 1;
      }
    }
  }
  // Stable, alphabetical ordering inside each group.
  for (const cardId of Object.keys(cards)) {
    for (const group of Object.keys(cards[cardId])) {
      cards[cardId][group].sort();
    }
  }
  // Sort cards object alphabetically by id for deterministic output.
  const sortedCards = {};
  for (const cardId of Object.keys(cards).sort()) {
    const groupKeys = Object.keys(cards[cardId]).sort();
    sortedCards[cardId] = {};
    for (const g of groupKeys) sortedCards[cardId][g] = cards[cardId][g];
  }
  return {
    cards: sortedCards,
    skipped,
    unknownGroups: [...unknownGroups].sort(),
    totalDeepTags,
    cardCount: Object.keys(sortedCards).length,
  };
}

function vocabularyCsvSha() {
  const bytes = readFileSync(VOCAB_CSV_PATH);
  return createHash("sha256").update(bytes).digest("hex").slice(0, 12);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { printHelp(); return 0; }

  const vocab = readVocabulary();
  const knownGroups = new Set(vocab.groupOrder);

  const { url, buf } = await fetchMvBlob(opts.mvBase, opts.verbose);
  const rows = runQuery(buf, opts.verbose);
  const result = buildCardsMap(rows, knownGroups, opts.verbose);

  const output = {
    metadata: {
      exported_at: new Date().toISOString(),
      filter: "released, scope:hunter_root, youtube parents",
      vocabulary_csv_sha: vocabularyCsvSha(),
    },
    cards: result.cards,
  };

  const outputPath = resolve(REPO_ROOT, opts.output);
  const json = JSON.stringify(output, null, 2) + "\n";
  let fileSize = Buffer.byteLength(json, "utf8");

  if (!opts.dryRun) {
    writeFileSync(outputPath, json);
    try { fileSize = statSync(outputPath).size; } catch { /* keep computed */ }
  }

  const unknownText = result.unknownGroups.length === 0
    ? "none"
    : result.unknownGroups.join(", ");
  const outputDisplay = opts.dryRun
    ? `${opts.output} (dry-run; ${fileSize} bytes would be written)`
    : `${opts.output} (${fileSize} bytes)`;

  process.stdout.write([
    "Deep Dive export complete.",
    `  Source: ${url}`,
    `  Artifacts matching filter: ${rows.length}`,
    `  Skipped (no card_id): ${result.skipped.length}`,
    `  Cards with tags: ${result.cardCount}`,
    `  Total deep tags: ${result.totalDeepTags}`,
    `  Unknown groups: ${unknownText}`,
    `  Output: ${outputDisplay}`,
    "",
  ].join("\n"));

  return 0;
}

main().then(
  (code) => process.exit(code ?? 0),
  (err) => fail(`unexpected error: ${err.stack || err.message || err}`),
);
