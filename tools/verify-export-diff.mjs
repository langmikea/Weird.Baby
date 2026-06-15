#!/usr/bin/env node
// ─── verify-export-diff.mjs ─────────────────────────────────────────────────
// Discovery → MediaVault reconciliation, STEP 5 of the brief's §6 safe order
// of operations (discovery-mv-reconciliation-brief.docx, v2, 2026-06-14).
//
// READ-ONLY. Run AFTER `npm run export-artifacts` (step 4). It proves the
// migration worked without writing anything:
//
//   1. The regenerated exhibit snapshot (src/data/exhibits/hunter_root.json)
//      must MATCH the committed d482fd4 blob — ignoring only the volatile
//      metadata.exported_at timestamp. Identical artifacts prove MV now
//      PRODUCES the retag from its own tables (brief §1, §6 step 5), so a
//      future export can no longer erase it.
//
//   2. The regenerated vocabulary (src/data/vocabulary.json) must differ from
//      the committed d482fd4 blob by EXACTLY ONE added namespace row: `topic`
//      (tier 1, sort_order 8). Any other added / removed / changed namespace,
//      or a row_count delta other than +1, fails the check.
//
// This script reads files and git blobs only. It opens no database, runs no
// export, and writes nothing. Safe to run repeatedly.
//
// Usage (from the museum repo root):
//   node tools/verify-export-diff.mjs
//   node tools/verify-export-diff.mjs --verbose
//
//   --baseline-ref <ref>        Git ref of the committed reference (default d482fd4).
//   --exhibit-path <repo path>  Exhibit path in the repo/baseline
//                               (default src/data/exhibits/hunter_root.json).
//   --exhibit-regen <path>      Regenerated exhibit file to check
//                               (default = --exhibit-path in the working tree).
//   --vocab-path <repo path>    Vocabulary path (default src/data/vocabulary.json).
//   --vocab-regen <path>        Regenerated vocabulary file to check
//                               (default = --vocab-path in the working tree).
//   --ignore-exhibit-meta <a,b> Extra exhibit metadata keys to ignore
//                               (default exported_at).
//   --ignore-vocab-meta <a,b>   Extra vocabulary metadata keys to ignore
//                               (default exported_at,source).
//   --verbose                   Print the full difference list on failure.
//   --help                      Show this message.
//
// Exits 0 if BOTH checks pass; non-zero (and prints the diffs) otherwise.
// ─────────────────────────────────────────────────────────────────────────────

import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const SCRIPT_NAME = "verify-export-diff";
const DEFAULT_BASELINE_REF = "d482fd4";
const DEFAULT_EXHIBIT_PATH = "src/data/exhibits/hunter_root.json";
const DEFAULT_VOCAB_PATH = "src/data/vocabulary.json";

// The single namespace row the migration is allowed to add to vocabulary.json.
const EXPECTED_ADDED_NS = Object.freeze({
  namespace: "topic", display_name: "Topic", tier: 1, sort_order: 8, retired_at: null,
});

// ─── helpers ───────────────────────────────────────────────────────────────
function fail(msg) {
  process.stderr.write(`\n[${SCRIPT_NAME}] ERROR: ${msg}\n`);
  process.exit(2);
}

function printHelp() {
  process.stdout.write(
    [
      `${SCRIPT_NAME} — read-only check that the re-export matches d482fd4 + topic.`,
      "",
      "Usage (from the museum repo root):",
      "  node tools/verify-export-diff.mjs [--verbose]",
      "",
      "  --baseline-ref <ref>        Committed reference (default d482fd4).",
      "  --exhibit-path <repo path>  Exhibit path (default src/data/exhibits/hunter_root.json).",
      "  --exhibit-regen <path>      Regenerated exhibit file (default = working tree).",
      "  --vocab-path <repo path>    Vocabulary path (default src/data/vocabulary.json).",
      "  --vocab-regen <path>        Regenerated vocabulary file (default = working tree).",
      "  --ignore-exhibit-meta <..>  Extra exhibit metadata keys to ignore (default exported_at).",
      "  --ignore-vocab-meta <..>    Extra vocabulary metadata keys to ignore (default exported_at,source).",
      "  --verbose                   Print the full difference list on failure.",
      "  --help                      Show this message.",
      "",
    ].join("\n")
  );
}

function parseArgs(argv) {
  const opts = {
    baselineRef: DEFAULT_BASELINE_REF,
    exhibitPath: DEFAULT_EXHIBIT_PATH, exhibitRegen: null,
    vocabPath: DEFAULT_VOCAB_PATH, vocabRegen: null,
    ignoreExhibitMeta: ["exported_at"], ignoreVocabMeta: ["exported_at", "source"],
    verbose: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") { printHelp(); process.exit(0); }
    else if (a === "--verbose") opts.verbose = true;
    else if (a === "--baseline-ref") opts.baselineRef = argv[++i];
    else if (a === "--exhibit-path") opts.exhibitPath = argv[++i];
    else if (a === "--exhibit-regen") opts.exhibitRegen = argv[++i];
    else if (a === "--vocab-path") opts.vocabPath = argv[++i];
    else if (a === "--vocab-regen") opts.vocabRegen = argv[++i];
    else if (a === "--ignore-exhibit-meta") opts.ignoreExhibitMeta = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    else if (a === "--ignore-vocab-meta") opts.ignoreVocabMeta = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    else fail(`unknown argument: ${a} (try --help)`);
  }
  return opts;
}

function readBaseline(ref, repoPath) {
  try {
    return execFileSync("git", ["show", `${ref}:${repoPath}`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    fail(`git show ${ref}:${repoPath} failed: ${e.message}\n  Run from the museum repo root.`);
  }
}

function readRegen(path) {
  const p = resolve(path);
  if (!existsSync(p)) fail(`regenerated file not found: ${p}\n  Did you run \`npm run export-artifacts\` (step 4)?`);
  return readFileSync(p, "utf8");
}

function parseJson(label, raw) {
  try { return JSON.parse(raw); }
  catch (e) { fail(`${label} did not parse as JSON: ${e.message}`); }
}

// Recursive structural diff → array of { path, baseline, regen }.
function diffPaths(base, regen, path = "") {
  const diffs = [];
  if (base === regen) return diffs;
  const bt = Array.isArray(base) ? "array" : base === null ? "null" : typeof base;
  const rt = Array.isArray(regen) ? "array" : regen === null ? "null" : typeof regen;
  if (bt !== rt) { diffs.push({ path: path || "(root)", baseline: base, regen }); return diffs; }
  if (bt === "array") {
    if (base.length !== regen.length) diffs.push({ path: `${path}.length`, baseline: base.length, regen: regen.length });
    const n = Math.max(base.length, regen.length);
    for (let i = 0; i < n; i++) diffs.push(...diffPaths(base[i], regen[i], `${path}[${i}]`));
    return diffs;
  }
  if (bt === "object") {
    const keys = new Set([...Object.keys(base), ...Object.keys(regen)]);
    for (const k of keys) diffs.push(...diffPaths(base[k], regen[k], path ? `${path}.${k}` : k));
    return diffs;
  }
  diffs.push({ path: path || "(root)", baseline: base, regen });
  return diffs;
}

function stripKeys(obj, keys) {
  if (!obj || typeof obj !== "object") return obj;
  const copy = JSON.parse(JSON.stringify(obj));
  for (const k of keys) if (copy.metadata && k in copy.metadata) delete copy.metadata[k];
  return copy;
}

function showVal(v) {
  const s = JSON.stringify(v);
  return s.length > 120 ? s.slice(0, 117) + "..." : s;
}

// ─── check 1 — exhibit snapshot must equal baseline (minus volatile meta) ────
function checkExhibit(opts) {
  process.stdout.write(`CHECK 1 — exhibit snapshot vs ${opts.baselineRef}:${opts.exhibitPath}\n`);
  const base = parseJson("baseline exhibit", readBaseline(opts.baselineRef, opts.exhibitPath));
  const regen = parseJson("regenerated exhibit", readRegen(opts.exhibitRegen || opts.exhibitPath));

  const ignored = diffPaths(
    pick(base.metadata, opts.ignoreExhibitMeta),
    pick(regen.metadata, opts.ignoreExhibitMeta),
    "metadata"
  ).filter((d) => opts.ignoreExhibitMeta.some((k) => d.path === `metadata.${k}`));

  const diffs = diffPaths(stripKeys(base, opts.ignoreExhibitMeta), stripKeys(regen, opts.ignoreExhibitMeta));

  process.stdout.write(`  artifacts: baseline ${base.artifacts?.length ?? "?"} / regen ${regen.artifacts?.length ?? "?"}\n`);
  if (opts.verbose && ignored.length) {
    for (const d of ignored) process.stdout.write(`  (ignored) ${d.path}: ${showVal(d.baseline)} → ${showVal(d.regen)}\n`);
  }
  if (diffs.length === 0) {
    process.stdout.write(`  PASS — regenerated exhibit matches ${opts.baselineRef} (volatile meta ignored).\n`);
    return true;
  }
  process.stdout.write(`  FAIL — ${diffs.length} difference(s):\n`);
  for (const d of diffs.slice(0, opts.verbose ? diffs.length : 20)) {
    process.stdout.write(`    ${d.path}: baseline=${showVal(d.baseline)}  regen=${showVal(d.regen)}\n`);
  }
  if (!opts.verbose && diffs.length > 20) process.stdout.write(`    … and ${diffs.length - 20} more (use --verbose).\n`);
  return false;
}

function pick(obj, keys) {
  const out = {};
  if (obj) for (const k of keys) if (k in obj) out[k] = obj[k];
  return out;
}

// ─── check 2 — vocabulary must differ by exactly the added topic row ─────────
function checkVocabulary(opts) {
  process.stdout.write(`CHECK 2 — vocabulary vs ${opts.baselineRef}:${opts.vocabPath}\n`);
  const base = parseJson("baseline vocab", readBaseline(opts.baselineRef, opts.vocabPath));
  const regen = parseJson("regenerated vocab", readRegen(opts.vocabRegen || opts.vocabPath));

  const problems = [];

  // metadata: row_count must be baseline + 1; other (non-ignored) keys equal.
  const bRow = base.metadata?.row_count, rRow = regen.metadata?.row_count;
  if (typeof bRow === "number" && typeof rRow === "number") {
    if (rRow !== bRow + 1) problems.push(`metadata.row_count: ${bRow} → ${rRow} (expected +1 = ${bRow + 1}).`);
  } else {
    problems.push(`metadata.row_count missing/non-numeric (baseline=${showVal(bRow)}, regen=${showVal(rRow)}).`);
  }
  const ignore = new Set([...opts.ignoreVocabMeta, "row_count"]);
  const metaDiffs = diffPaths(base.metadata || {}, regen.metadata || {}, "metadata")
    .filter((d) => !ignore.has(d.path.replace(/^metadata\./, "")));
  for (const d of metaDiffs) problems.push(`${d.path}: baseline=${showVal(d.baseline)} regen=${showVal(d.regen)}`);

  // namespaces: compare as maps keyed by namespace.
  const bMap = new Map((base.namespaces || []).map((n) => [n.namespace, n]));
  const rMap = new Map((regen.namespaces || []).map((n) => [n.namespace, n]));
  const added = [...rMap.keys()].filter((k) => !bMap.has(k));
  const removed = [...bMap.keys()].filter((k) => !rMap.has(k));
  const changed = [...bMap.keys()].filter((k) => rMap.has(k) && JSON.stringify(bMap.get(k)) !== JSON.stringify(rMap.get(k)));

  if (removed.length) problems.push(`namespaces removed (none allowed): ${removed.join(", ")}`);
  if (changed.length) problems.push(`namespaces changed (none allowed): ${changed.join(", ")}`);
  if (added.length !== 1 || added[0] !== EXPECTED_ADDED_NS.namespace) {
    problems.push(`namespaces added = [${added.join(", ")}], expected exactly [${EXPECTED_ADDED_NS.namespace}]`);
  } else {
    const got = rMap.get(EXPECTED_ADDED_NS.namespace);
    const exp = EXPECTED_ADDED_NS;
    if (
      got.display_name !== exp.display_name || got.tier !== exp.tier ||
      got.sort_order !== exp.sort_order || (got.retired_at ?? null) !== exp.retired_at
    ) {
      problems.push(`added 'topic' row mismatch: got ${showVal(got)}, expected ${showVal(exp)}`);
    }
  }

  process.stdout.write(`  namespaces: baseline ${bMap.size} / regen ${rMap.size}; added=[${added.join(", ") || "—"}] removed=[${removed.join(", ") || "—"}] changed=[${changed.join(", ") || "—"}]\n`);
  if (problems.length === 0) {
    process.stdout.write(`  PASS — vocabulary gained only the 'topic' namespace (row_count +1).\n`);
    return true;
  }
  process.stdout.write(`  FAIL — ${problems.length} problem(s):\n`);
  for (const p of problems) process.stdout.write(`    - ${p}\n`);
  return false;
}

// ─── main ────────────────────────────────────────────────────────────────────
function main() {
  const opts = parseArgs(process.argv.slice(2));
  process.stdout.write(`[${SCRIPT_NAME}] read-only verification (no DB, no writes)\n`);
  const ok1 = checkExhibit(opts);
  const ok2 = checkVocabulary(opts);
  process.stdout.write(`\n[${SCRIPT_NAME}] ${ok1 && ok2 ? "ALL CHECKS PASSED ✓" : "CHECKS FAILED ✗"}\n`);
  if (ok1 && ok2) {
    process.stdout.write(`  The export reproduces d482fd4 from MV; safe to commit regenerated files (brief §6 step 6).\n`);
    process.exit(0);
  }
  process.exit(1);
}

main();
