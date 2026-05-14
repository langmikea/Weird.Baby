#!/usr/bin/env node
// ─── migrate-vocabulary-pass2.mjs ──────────────────────────────────────────
// B-1 step 3, Pass 2 of the two-pass vocabulary migration
// (per docs/canonical/B1_IMPLEMENTATION_PLAN.md §4.1 step 4 + §3.4 Q4).
//
// Reads MV's `artifacts` table and rewrites each row's `tags` JSON column
// from slug strings to vocabulary IDs. Pass 1 (committed earlier today)
// populated the vocabulary table; Pass 2 makes artifact tags reference the
// IDs Pass 1 minted.
//
//   in:  ["arkansas", "hunter_root", "reverend"]
//   out: ["vocab_album_arkansas", "vocab_people_hunter_root",
//         "vocab_song_reverend"]
//
// Pass 2 does NOT modify the `vocabulary` table, the `tags` table, MV's
// schema, the museum's `src/` tree, or git. It also does not run itself:
// the operator runs it in PowerShell.
//
// Architectural note (per B1 plan §6.4 Q3 lock, 2026-05-13):
// Once Pass 2 commits, MV's curation UI (imgserver.py) will display dead
// pills for every artifact tag — it still expects slug strings, but the
// tags column now stores vocabulary IDs. The operator has explicitly
// accepted this tradeoff: MV is not used for curation until a future
// MV-side update teaches it to render vocabulary IDs back as display
// names. The architecture is correct; the curation surface catches up
// later. Backups (and the museum's separate render layer) preserve the
// rollback path.
//
// Before running: stop MV (close the curation UI and any process holding
// the SQLite). This script opens the database for write; a concurrent MV
// process will either block ("database is locked") or — worse — produce
// inconsistent state. Restart MV (or don't, per the note above) after
// the commit prints.
//
// Pass 1 must have run cleanly first. Pass 2 reads vocabulary entries
// that Pass 1 minted; if any are missing (Pass 1 didn't run; Pass 1
// rolled back; a new MV tag was added between passes) the script aborts
// with the unresolvable (category, slug) pairs identified.
//
// Usage (from the museum repo root):
//   node tools/migrate-vocabulary-pass2.mjs [flags]
//
//   --mv-db <path>       Explicit path to MV's SQLite file.
//                        Default: scan --mv-core for a single .sqlite/.db.
//   --mv-core <dir>      MV's core directory (where the SQLite lives).
//                        Default: C:\AI\Platform\MediaVault\core
//   --dry-run            Run every step including UPDATEs and verification,
//                        then ROLLBACK (no commit). Useful for a first pass.
//   --verbose            Print per-artifact in→out conversion details.
//   --help               Show this message.
//
// Exits 0 on a clean commit OR a clean dry-run rollback.
// Exits non-zero on any failure (backup, discovery, resolution, verification,
// write). Resolution failures (orphans, ambiguous slugs, missing vocab) are
// detected BEFORE the transaction opens — no changes are attempted if any
// slug is unresolvable. Verification failures inside the transaction
// rollback before exit — no partial state survives.
// ─────────────────────────────────────────────────────────────────────────────

import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import Database from "better-sqlite3";

const SCRIPT_NAME = "migrate-vocabulary-pass2";

const DEFAULT_MV_CORE = "C:\\AI\\Platform\\MediaVault\\core";

// ─── SQL ─────────────────────────────────────────────────────────────────────
// Lookup builders.
const SQL_LOAD_VOCABULARY =
  `SELECT id, kind, slug, namespace_id FROM vocabulary
   WHERE kind IN ('namespace', 'value');`;

const SQL_LOAD_TAGS_CATALOG =
  `SELECT category, slug FROM tags
   WHERE category IS NOT NULL AND slug IS NOT NULL;`;

// Artifact discovery.
const SQL_DISCOVER_ARTIFACTS =
  `SELECT id, tags FROM artifacts
   WHERE tags IS NOT NULL AND tags != '[]';`;

// Pre-state count (used as the "before" baseline for verification).
const SQL_COUNT_ARTIFACTS_WITH_TAGS =
  `SELECT COUNT(*) AS n FROM artifacts
   WHERE tags IS NOT NULL AND tags != '[]';`;

// Per-artifact rewrite.
const SQL_UPDATE_ARTIFACT_TAGS =
  `UPDATE artifacts SET tags = ? WHERE id = ?;`;

// Post-update verification: any tag-ID in any artifact that doesn't
// resolve to a vocabulary entry. Runs inside the transaction; rows here
// trigger rollback.
const SQL_FIND_UNRESOLVED_OUTPUT_IDS = `
SELECT a.id AS artifact_id, j.value AS tag_id
FROM artifacts a, json_each(a.tags) j
LEFT JOIN vocabulary v ON v.id = j.value
WHERE a.tags IS NOT NULL AND a.tags != '[]'
  AND v.id IS NULL;`;

// Post-update verification: per-artifact JSON array length (so we can
// confirm input slug count == output ID count without re-parsing in JS).
const SQL_ARTIFACT_TAGS_LENGTH =
  `SELECT id, json_array_length(tags) AS n FROM artifacts WHERE id = ?;`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fail(msg, code = 1) {
  process.stderr.write(`${SCRIPT_NAME}: ${msg}\n`);
  process.exit(code);
}

function logVerbose(verbose, ...args) {
  if (verbose) process.stderr.write(`${SCRIPT_NAME}: ${args.join(" ")}\n`);
}

function printHelp() {
  process.stdout.write([
    "Usage: node tools/migrate-vocabulary-pass2.mjs [flags]",
    "",
    "  --mv-db <path>     Explicit path to MV's SQLite file.",
    "  --mv-core <dir>    MV's core directory (default C:\\AI\\Platform\\MediaVault\\core).",
    "  --dry-run          Run every step (including UPDATEs); ROLLBACK before commit.",
    "  --verbose          Print per-artifact in→out conversion details.",
    "  --help             Show this message.",
    "",
    "Stop MV before running. The script writes directly to MV's SQLite.",
    "",
  ].join("\n"));
}

function parseArgs(argv) {
  const opts = {
    mvDb: null,
    mvCore: DEFAULT_MV_CORE,
    dryRun: false,
    verbose: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") { opts.help = true; }
    else if (a === "--dry-run") { opts.dryRun = true; }
    else if (a === "--verbose") { opts.verbose = true; }
    else if (a === "--mv-db") {
      opts.mvDb = argv[++i];
      if (!opts.mvDb) fail("--mv-db requires a value");
    }
    else if (a === "--mv-core") {
      opts.mvCore = argv[++i];
      if (!opts.mvCore) fail("--mv-core requires a value");
    }
    else if (a.startsWith("--mv-db=")) { opts.mvDb = a.slice("--mv-db=".length); }
    else if (a.startsWith("--mv-core=")) { opts.mvCore = a.slice("--mv-core=".length); }
    else { fail(`unknown flag: ${a}\nrun with --help for usage.`); }
  }
  return opts;
}

// Mirrors Pass 1's discoverMvDb exactly: refuses ambiguity, skips
// backup/journal/wal sidecars, errors with actionable hints.
function discoverMvDb(mvCore) {
  if (!existsSync(mvCore)) {
    fail(`MV core directory not found: ${mvCore}\n` +
         `Pass --mv-core <dir> or --mv-db <path> explicitly.`);
  }
  let entries;
  try { entries = readdirSync(mvCore); }
  catch (err) { fail(`Could not read ${mvCore}: ${err.message}`); }

  const candidates = entries
    .filter(name => /\.(sqlite|sqlite3|db)$/i.test(name))
    .filter(name => !name.startsWith("bak_"))
    .filter(name => !/-(journal|wal|shm)$/i.test(name))
    .map(name => join(mvCore, name))
    .filter(p => { try { return statSync(p).isFile(); } catch { return false; } });

  if (candidates.length === 0) {
    fail(`No SQLite file found in ${mvCore}.\n` +
         `Looked for *.sqlite, *.sqlite3, *.db (excluding bak_* and WAL/SHM/journal sidecars).\n` +
         `Pass --mv-db <path> explicitly.`);
  }
  if (candidates.length > 1) {
    fail(`Multiple SQLite candidates in ${mvCore}:\n` +
         candidates.map(c => `  ${c}`).join("\n") +
         `\nPass --mv-db <path> explicitly so the script doesn't pick the wrong one.`);
  }
  return candidates[0];
}

// Backup convention identical to Pass 1: backup file lives next to the
// original in MV's core/ directory.
function backupSqlite(dbPath) {
  const dir = dirname(dbPath);
  const orig = basename(dbPath);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const bakName = `bak_pre_${SCRIPT_NAME}_${stamp}__${orig}`;
  const bakPath = join(dir, bakName);
  copyFileSync(dbPath, bakPath);
  return bakPath;
}

// ─── main ────────────────────────────────────────────────────────────────────
function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { printHelp(); return 0; }

  const dbPath = opts.mvDb ? resolve(opts.mvDb) : discoverMvDb(opts.mvCore);
  if (!existsSync(dbPath)) {
    fail(`MV SQLite file does not exist: ${dbPath}`);
  }
  logVerbose(opts.verbose, `MV db: ${dbPath}`);
  if (opts.dryRun) {
    process.stdout.write(`(DRY-RUN — will rollback before commit)\n`);
  }

  // ─── STEP 1 — backup ──────────────────────────────────────────────────────
  process.stdout.write(`STEP 1 — backup\n`);
  let bak;
  try { bak = backupSqlite(dbPath); }
  catch (err) {
    fail(`backup failed: ${err.message}\n` +
         `Refusing to proceed without a backup.`);
  }
  process.stdout.write(`  backed up to ${bak}\n`);

  // Open MV for write. Throw with a clear hint if it's locked.
  let db;
  try {
    db = new Database(dbPath);
  } catch (err) {
    fail(`Could not open ${dbPath} for write: ${err.message}\n` +
         `If "database is locked", stop MediaVault and try again.\n` +
         `Backup at ${bak} is intact.`);
  }

  try {
    // Match Pass 1's PRAGMAs / B-1 step 1 conventions.
    db.pragma("journal_mode = MEMORY");
    db.pragma("foreign_keys = OFF");

    // ─── STEP 2 — build slug→ID lookup ──────────────────────────────────────
    process.stdout.write(`STEP 2 — build slug→ID lookup\n`);

    let vocabRows;
    try {
      logVerbose(opts.verbose, "SQL:", SQL_LOAD_VOCABULARY);
      vocabRows = db.prepare(SQL_LOAD_VOCABULARY).all();
    } catch (err) {
      const m = err && err.message ? String(err.message) : "";
      if (/no such table: vocabulary/i.test(m)) {
        fail(`MV's \`vocabulary\` table does not exist. Has B-1 step 1 (v10 migration) run?\n` +
             `underlying error: ${m}`);
      }
      throw err;
    }

    // namespaceIdBySlug:  category slug → namespace vocab id
    //   e.g. "album" → "vocab_album"
    const namespaceIdBySlug = new Map();
    // valueIdByNsIdAndSlug: "${namespace_id}\t${slug}" → value vocab id
    //   e.g. "vocab_album\tarkansas" → "vocab_album_arkansas"
    const valueIdByNsIdAndSlug = new Map();

    let nsCount = 0;
    let valueCount = 0;
    for (const r of vocabRows) {
      if (r.kind === "namespace") {
        namespaceIdBySlug.set(r.slug, r.id);
        nsCount++;
      } else if (r.kind === "value") {
        if (!r.namespace_id) continue; // pathological; Pass 1 wouldn't emit this
        valueIdByNsIdAndSlug.set(`${r.namespace_id}\t${r.slug}`, r.id);
        valueCount++;
      }
    }
    process.stdout.write(`  vocabulary namespace entries loaded: ${nsCount}\n`);
    process.stdout.write(`  vocabulary value entries loaded: ${valueCount}\n`);
    process.stdout.write(`  total lookup entries: ${nsCount + valueCount}\n`);

    // Build slug → [categories] from MV's tags table. We expect 1:1 in
    // practice; >1 indicates a cross-namespace collision (per the v11 note:
    // schema allows; data may or may not realize). Detected as a per-slug
    // ambiguity below.
    let tagsRows;
    try {
      logVerbose(opts.verbose, "SQL:", SQL_LOAD_TAGS_CATALOG);
      tagsRows = db.prepare(SQL_LOAD_TAGS_CATALOG).all();
    } catch (err) {
      const m = err && err.message ? String(err.message) : "";
      if (/no such table: tags/i.test(m)) {
        fail(`MV's \`tags\` table does not exist.\n` +
             `underlying error: ${m}`);
      }
      throw err;
    }

    /** @type {Map<string, string[]>} */
    const categoriesBySlug = new Map();
    for (const r of tagsRows) {
      if (typeof r.slug !== "string" || r.slug.length === 0) continue;
      if (typeof r.category !== "string" || r.category.length === 0) continue;
      let arr = categoriesBySlug.get(r.slug);
      if (!arr) { arr = []; categoriesBySlug.set(r.slug, arr); }
      if (!arr.includes(r.category)) arr.push(r.category);
    }
    logVerbose(opts.verbose,
      `tags catalog: ${tagsRows.length} (category, slug) pairs across ` +
      `${categoriesBySlug.size} distinct slugs`);

    // ─── STEP 3 — discover artifacts with tags ──────────────────────────────
    process.stdout.write(`STEP 3 — discover artifacts with tags\n`);

    let artifactRows;
    try {
      logVerbose(opts.verbose, "SQL:", SQL_DISCOVER_ARTIFACTS);
      artifactRows = db.prepare(SQL_DISCOVER_ARTIFACTS).all();
    } catch (err) {
      const m = err && err.message ? String(err.message) : "";
      if (/no such table: artifacts/i.test(m)) {
        fail(`MV's \`artifacts\` table does not exist.\n` +
             `underlying error: ${m}`);
      }
      if (/no such column: tags/i.test(m)) {
        fail(`MV's \`artifacts\` table is missing the \`tags\` column.\n` +
             `underlying error: ${m}`);
      }
      throw err;
    }

    // Parse + count up front so STEP 3's totals are visible before STEP 4.
    /** @type {{ id: any, inputSlugs: string[] }[]} */
    const artifacts = [];
    let totalInputSlugs = 0;
    for (const r of artifactRows) {
      let parsed;
      try { parsed = JSON.parse(r.tags); }
      catch (err) {
        fail(`artifact ${r.id} has invalid JSON in tags column: ${err.message}\n` +
             `tags raw: ${String(r.tags).slice(0, 200)}\n` +
             `No changes written. Backup preserved at ${bak}.`);
      }
      if (!Array.isArray(parsed)) {
        fail(`artifact ${r.id} tags is not a JSON array (got ${typeof parsed}).\n` +
             `No changes written. Backup preserved at ${bak}.`);
      }
      if (parsed.length === 0) continue; // edge case C — defensive, query filtered
      artifacts.push({ id: r.id, inputSlugs: parsed.map(String) });
      totalInputSlugs += parsed.length;
    }
    process.stdout.write(`  artifacts to process: ${artifacts.length}\n`);
    process.stdout.write(`  total tag-slugs across all artifacts: ${totalInputSlugs}\n`);

    // Capture "before" count from SQL so the post-update comparison is
    // grounded in the DB's own answer rather than the in-memory parse.
    const beforeCount = db.prepare(SQL_COUNT_ARTIFACTS_WITH_TAGS).get().n;

    if (artifacts.length === 0) {
      process.stdout.write(`  nothing to do.\n`);
      if (opts.dryRun) {
        process.stdout.write(`DRY-RUN ROLLBACK ✓\n  No artifacts had tags. Backup at ${bak}.\n`);
      } else {
        process.stdout.write(`COMMIT ✓ (no-op)\n`);
      }
      return 0;
    }

    // ─── STEP 4 — resolve (pre-transaction; no writes yet) ──────────────────
    process.stdout.write(`STEP 4 — resolve and rewrite (single transaction)\n`);

    /** @type {{ id: any, inputSlugs: string[], outputIds: string[] }[]} */
    const resolved = [];
    /** @type {string[]} */
    const errors = [];

    for (const a of artifacts) {
      const outputIds = [];
      let bad = false;
      for (const slug of a.inputSlugs) {
        const cats = categoriesBySlug.get(slug);
        // Edge case A — orphan slug (no tags-table row for this slug).
        if (!cats || cats.length === 0) {
          errors.push(
            `  artifact ${a.id} contains slug '${slug}' — ` +
            `no matching (category, slug) in tags table`);
          bad = true;
          continue;
        }
        // Cross-namespace ambiguity — schema allows; abort if realized.
        // (Brief acknowledges the case ("arkansas" under both album and
        // era); architecture says count must be preserved 1:1; this is
        // the consistent interpretation.)
        if (cats.length > 1) {
          errors.push(
            `  artifact ${a.id} contains slug '${slug}' — ` +
            `ambiguous: matches categories [${cats.join(", ")}]`);
          bad = true;
          continue;
        }
        const category = cats[0];
        const nsId = namespaceIdBySlug.get(category);
        if (!nsId) {
          // Pass 1 should have minted a namespace entry for every distinct
          // tags.category. If it didn't, Pass 1 either didn't run or
          // rolled back.
          errors.push(
            `  artifact ${a.id} contains slug '${slug}' (category=${category}) — ` +
            `no vocabulary namespace entry for category '${category}'`);
          bad = true;
          continue;
        }
        const vocabId = valueIdByNsIdAndSlug.get(`${nsId}\t${slug}`);
        if (!vocabId) {
          // Edge case B — vocab value entry missing for a (category, slug)
          // that exists in the tags table. Pass 1 had a bug, or a new MV
          // tag was added between Pass 1 and Pass 2.
          errors.push(
            `  artifact ${a.id} contains slug '${slug}' (category=${category}) — ` +
            `no vocabulary entry for (${category}, ${slug})`);
          bad = true;
          continue;
        }
        outputIds.push(vocabId);
      }

      if (!bad) {
        // Defensive: edge case E (duplicates) is passed through; this
        // length equality should hold by construction.
        if (outputIds.length !== a.inputSlugs.length) {
          errors.push(
            `  artifact ${a.id} internal count mismatch: ` +
            `input=${a.inputSlugs.length}, output=${outputIds.length} ` +
            `(should not happen — bug in resolver)`);
        } else {
          resolved.push({ id: a.id, inputSlugs: a.inputSlugs, outputIds });
        }
      }
    }

    if (errors.length > 0) {
      process.stderr.write(`ABORT — unresolvable tag slugs found:\n`);
      for (const e of errors) process.stderr.write(`${e}\n`);
      process.stderr.write(`Total unresolvable: ${errors.length}\n`);
      process.stderr.write(`No changes written. Backup preserved at ${bak}.\n`);
      process.exit(2);
    }

    // ─── STEP 4 (cont'd) — execute UPDATEs in a single transaction ──────────
    const updateStmt = db.prepare(SQL_UPDATE_ARTIFACT_TAGS);
    const lenStmt    = db.prepare(SQL_ARTIFACT_TAGS_LENGTH);

    const DRY_RUN_SENTINEL = "__DRY_RUN_ROLLBACK__";

    const tx = db.transaction(() => {
      // Apply rewrites.
      const PROGRESS_EVERY = 25;
      let i = 0;
      for (const r of resolved) {
        if (opts.verbose) {
          process.stdout.write(
            `  processing artifact ${r.id}...\n` +
            `    in:  ${JSON.stringify(r.inputSlugs)}\n` +
            `    out: ${JSON.stringify(r.outputIds)}\n`);
        } else if ((i + 1) % PROGRESS_EVERY === 0) {
          process.stdout.write(`  processed ${i + 1}/${resolved.length} artifacts...\n`);
        }
        const res = updateStmt.run(JSON.stringify(r.outputIds), r.id);
        if (res.changes !== 1) {
          // The artifact id we just read should still match. If not,
          // something concurrent or unexpected happened — abort.
          throw new Error(
            `UPDATE for artifact ${r.id} changed ${res.changes} rows (expected 1)`);
        }
        i++;
      }
      const totalConverted = resolved.reduce((acc, r) => acc + r.outputIds.length, 0);
      process.stdout.write(
        `  resolved ${totalConverted} slugs across ${resolved.length} artifacts\n`);

      // ─── STEP 5 — verification (still inside the transaction) ────────────
      process.stdout.write(`STEP 5 — verification\n`);

      const afterCount = db.prepare(SQL_COUNT_ARTIFACTS_WITH_TAGS).get().n;
      process.stdout.write(
        `  artifacts with non-empty tags before: ${beforeCount}\n`);
      if (afterCount !== beforeCount) {
        throw new Error(
          `VERIFICATION FAILED: artifacts with non-empty tags went from ` +
          `${beforeCount} to ${afterCount} (expected unchanged)`);
      }
      process.stdout.write(
        `  artifacts with non-empty tags after: ${afterCount} ✓\n`);

      const unresolved = db.prepare(SQL_FIND_UNRESOLVED_OUTPUT_IDS).all();
      if (unresolved.length > 0) {
        throw new Error(
          `VERIFICATION FAILED: ${unresolved.length} output tag-id(s) do ` +
          `not resolve to vocabulary:\n` +
          unresolved.slice(0, 10)
            .map(u => `    artifact ${u.artifact_id} -> tag_id ${u.tag_id}`).join("\n") +
          (unresolved.length > 10 ? `\n    ... and ${unresolved.length - 10} more` : ""));
      }
      process.stdout.write(`  every output ID resolves to vocabulary: ✓\n`);

      // Per-artifact slug count check. We query json_array_length per
      // updated artifact and compare to the input length we captured
      // before the update.
      const lenMismatches = [];
      for (const r of resolved) {
        const row = lenStmt.get(r.id);
        const dbLen = row ? row.n : null;
        if (dbLen !== r.inputSlugs.length) {
          lenMismatches.push(
            `    artifact ${r.id}: input=${r.inputSlugs.length}, db=${dbLen}`);
          if (lenMismatches.length >= 10) break;
        }
      }
      if (lenMismatches.length > 0) {
        throw new Error(
          `VERIFICATION FAILED: per-artifact slug count mismatch:\n` +
          lenMismatches.join("\n"));
      }
      process.stdout.write(`  per-artifact slug count = output ID count: ✓\n`);

      if (opts.dryRun) {
        throw new Error(DRY_RUN_SENTINEL);
      }
    });

    let committed = false;
    let totalConvertedTop = 0;
    try {
      tx();
      committed = true;
      totalConvertedTop = resolved.reduce((acc, r) => acc + r.outputIds.length, 0);
    } catch (err) {
      const m = err && err.message ? String(err.message) : "";
      if (m === DRY_RUN_SENTINEL) {
        process.stdout.write(
          `DRY-RUN ROLLBACK ✓\n` +
          `  Verification passed. No commit. Backup still at ${bak}.\n`);
        return 0;
      }
      // Real failure: better-sqlite3's transaction wrapper has already
      // rolled back; report and exit.
      process.stderr.write(`${m}\nROLLBACK ✓\n`);
      process.stderr.write(`Backup is intact at ${bak}.\n`);
      process.exit(2);
    }

    if (committed) {
      process.stdout.write(`COMMIT ✓\n`);
    }

    // ─── Post-commit summary ────────────────────────────────────────────────
    process.stdout.write(`Post-commit summary:\n`);
    process.stdout.write(`  artifacts updated: ${resolved.length}\n`);
    process.stdout.write(`  total tag-slugs converted: ${totalConvertedTop}\n`);
    process.stdout.write(`  slug→ID resolution rate: 100%\n`);
  } finally {
    try { db.close(); } catch { /* ignore */ }
  }

  return 0;
}

try {
  const code = main();
  process.exit(code ?? 0);
} catch (err) {
  process.stderr.write(
    `${SCRIPT_NAME}: unexpected error: ${err.stack || err.message || err}\n`);
  process.exit(1);
}
