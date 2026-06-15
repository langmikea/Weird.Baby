#!/usr/bin/env node
// ─── add-topic-namespace.mjs ───────────────────────────────────────────────
// Discovery → MediaVault reconciliation, STEP 2 of the brief's §6 safe order
// of operations (discovery-mv-reconciliation-brief.docx, v2, 2026-06-14).
//
// Adds the single missing `topic` namespace row to MV's `vocabulary` table so
// the `topic:` facet tags written by `write-discovery-facets.mjs` render as a
// first-class Discovery facet on export. This is the ONLY vocabulary change
// the reconciliation requires: content_kind / era / format / source namespaces
// already exist; `topic` does not.
//
//   INSERT INTO vocabulary (namespace, display_name, tier, sort_order)
//   VALUES ('topic', 'Topic', 1, 8);
//
// tier=1, sort_order=8 places Topic immediately after the existing tier-1
// namespaces (year=1 … era=7). After it runs, vocabulary goes 18 → 19 rows.
//
// What this script does NOT touch: the `artifacts` table, the `tags` table,
// any other vocabulary row, MV's schema, the museum's src/ tree, or git.
// It does not re-export and it does not run itself — the operator runs it.
//
// GUARDS (per brief §6 step 2 "guarded script … dry-run + sqlite backup"):
//   1. Backs up the SQLite file before opening it for write; refuses to
//      proceed if the backup fails.
//   2. Idempotent: if a matching `topic` row already exists, exits 0 with no
//      write. If a `topic` row exists but DIFFERS from the expected values,
//      it aborts rather than silently mutating curatorial data.
//   3. Collision check: aborts if some OTHER namespace already occupies
//      tier 1 / sort_order 8.
//   4. All writes happen in a single transaction; --dry-run performs the
//      INSERT and verification, then ROLLS BACK (no commit).
//   5. Verifies the post-state (row present, expected values, count +1)
//      inside the transaction before committing.
//
// Before running: stop MV (close the curation UI / any process holding the
// SQLite) so the write isn't blocked by "database is locked".
//
// Usage (from the museum repo root):
//   node tools/add-topic-namespace.mjs --dry-run     # rehearse, rollback
//   node tools/add-topic-namespace.mjs               # commit
//
//   --mv-db <path>    Explicit path to MV's SQLite file.
//   --mv-core <dir>   MV core dir (default C:\AI\Platform\MediaVault\core);
//                     scanned for a single .sqlite/.db if --mv-db omitted.
//   --dry-run         Run every step incl. the INSERT, then ROLLBACK.
//   --verbose         Print extra detail.
//   --help            Show this message.
//
// Exits 0 on a clean commit OR a clean dry-run rollback OR a no-op (row
// already present and correct). Exits non-zero on any failure.
// ─────────────────────────────────────────────────────────────────────────────

import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import Database from "better-sqlite3";

const SCRIPT_NAME = "add-topic-namespace";
const DEFAULT_MV_CORE = "C:\\AI\\Platform\\MediaVault\\core";

// ─── The one row this script adds ──────────────────────────────────────────
const TOPIC_ROW = Object.freeze({
  namespace: "topic",
  display_name: "Topic",
  tier: 1,
  sort_order: 8,
  retired_at: null,
});

// ─── helpers ───────────────────────────────────────────────────────────────
function fail(msg) {
  process.stderr.write(`\n[${SCRIPT_NAME}] ERROR: ${msg}\n`);
  process.exit(2);
}

function printHelp() {
  process.stdout.write(
    [
      `${SCRIPT_NAME} — add the 'topic' namespace to MV's vocabulary table.`,
      "",
      "Usage (from the museum repo root):",
      "  node tools/add-topic-namespace.mjs --dry-run",
      "  node tools/add-topic-namespace.mjs",
      "",
      "  --mv-db <path>    Explicit path to MV's SQLite file.",
      "  --mv-core <dir>   MV core dir (default C:\\AI\\Platform\\MediaVault\\core).",
      "  --dry-run         Run every step (including the INSERT); ROLLBACK before commit.",
      "  --verbose         Print extra detail.",
      "  --help            Show this message.",
      "",
    ].join("\n")
  );
}

function parseArgs(argv) {
  const opts = { mvDb: null, mvCore: DEFAULT_MV_CORE, dryRun: false, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") { printHelp(); process.exit(0); }
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--verbose") opts.verbose = true;
    else if (a === "--mv-db") opts.mvDb = argv[++i];
    else if (a === "--mv-core") opts.mvCore = argv[++i];
    else fail(`unknown argument: ${a} (try --help)`);
  }
  return opts;
}

// Locate the MV SQLite file: explicit --mv-db, else scan --mv-core for a
// single .sqlite/.db (excluding backup and WAL/SHM/journal sidecars).
function resolveDbPath(opts) {
  if (opts.mvDb) {
    const p = resolve(opts.mvDb);
    if (!existsSync(p)) fail(`--mv-db not found: ${p}`);
    return p;
  }
  const core = resolve(opts.mvCore);
  if (!existsSync(core)) fail(`--mv-core not found: ${core} (pass --mv-db).`);
  const cands = readdirSync(core).filter((f) => {
    const lower = f.toLowerCase();
    if (lower.startsWith("bak_") || lower.includes(".bak")) return false;
    if (/(-wal|-shm|-journal)$/.test(lower)) return false;
    return lower.endsWith(".sqlite") || lower.endsWith(".sqlite3") || lower.endsWith(".db");
  });
  if (cands.length === 0) fail(`no .sqlite/.db file in ${core} (pass --mv-db).`);
  if (cands.length > 1) fail(`multiple DB candidates in ${core}: ${cands.join(", ")} (pass --mv-db).`);
  return join(core, cands[0]);
}

// Backup next to the DB: <name>.bak_<ISO-ish timestamp>.
function backupSqlite(dbPath) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const bak = `${dbPath}.bak_${stamp}`;
  copyFileSync(dbPath, bak);
  return bak;
}

// ─── main ──────────────────────────────────────────────────────────────────
function main() {
  const opts = parseArgs(process.argv.slice(2));
  const dbPath = resolveDbPath(opts);
  process.stdout.write(`[${SCRIPT_NAME}] MV DB: ${dbPath}\n`);
  if (opts.dryRun) process.stdout.write(`[${SCRIPT_NAME}] DRY RUN — will ROLLBACK, no commit.\n`);

  // ── STEP 1 — backup ──────────────────────────────────────────────────────
  process.stdout.write(`STEP 1 — backup\n`);
  let bak;
  try { bak = backupSqlite(dbPath); }
  catch (e) { fail(`backup failed: ${e.message}\nRefusing to proceed without a backup.`); }
  process.stdout.write(`  backup → ${basename(bak)} (${statSync(bak).size} bytes)\n`);

  const db = new Database(dbPath, { fileMustExist: true });
  db.pragma("foreign_keys = ON");

  try {
    // ── STEP 2 — pre-flight checks (no writes) ─────────────────────────────
    process.stdout.write(`STEP 2 — pre-flight checks\n`);

    // Confirm vocabulary schema matches what we expect to write into.
    const cols = db.prepare(`PRAGMA table_info(vocabulary)`).all().map((c) => c.name);
    for (const need of ["namespace", "display_name", "tier", "sort_order", "retired_at"]) {
      if (!cols.includes(need)) fail(`vocabulary table missing column '${need}' (schema drift).`);
    }

    const before = db.prepare(`SELECT COUNT(*) n FROM vocabulary`).get().n;
    process.stdout.write(`  vocabulary rows before: ${before}\n`);

    // Idempotency: existing topic row?
    const existing = db.prepare(`SELECT * FROM vocabulary WHERE namespace = ?`).get(TOPIC_ROW.namespace);
    if (existing) {
      const same =
        existing.display_name === TOPIC_ROW.display_name &&
        existing.tier === TOPIC_ROW.tier &&
        existing.sort_order === TOPIC_ROW.sort_order &&
        (existing.retired_at ?? null) === TOPIC_ROW.retired_at;
      if (same) {
        process.stdout.write(`  'topic' already present and matches expected values — nothing to do.\n`);
        db.close();
        process.exit(0);
      }
      fail(
        `'topic' namespace already exists but DIFFERS from expected:\n` +
        `    have: ${JSON.stringify(existing)}\n` +
        `    want: ${JSON.stringify(TOPIC_ROW)}\n` +
        `  Refusing to overwrite an existing vocabulary row. Resolve by hand.`
      );
    }

    // Collision: is tier 1 / sort_order 8 taken by a live (non-retired) row?
    const clash = db
      .prepare(`SELECT namespace FROM vocabulary WHERE tier = ? AND sort_order = ? AND retired_at IS NULL`)
      .get(TOPIC_ROW.tier, TOPIC_ROW.sort_order);
    if (clash) {
      fail(
        `tier ${TOPIC_ROW.tier} / sort_order ${TOPIC_ROW.sort_order} is already used by ` +
        `namespace '${clash.namespace}'. Pick a free sort_order (edit TOPIC_ROW.sort_order).`
      );
    }
    if (opts.verbose) {
      const tier1 = db.prepare(
        `SELECT namespace, sort_order FROM vocabulary WHERE tier = 1 AND retired_at IS NULL ORDER BY sort_order`
      ).all();
      process.stdout.write(`  tier-1 namespaces: ${tier1.map((r) => `${r.namespace}@${r.sort_order}`).join(", ")}\n`);
    }

    // ── STEP 3 — insert + verify in one transaction ────────────────────────
    process.stdout.write(`STEP 3 — insert (single transaction)\n`);
    const ROLLBACK = Symbol("dry-run-rollback");
    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO vocabulary (namespace, display_name, tier, sort_order, retired_at)
         VALUES (@namespace, @display_name, @tier, @sort_order, @retired_at)`
      ).run(TOPIC_ROW);

      // Verify inside the transaction.
      const after = db.prepare(`SELECT COUNT(*) n FROM vocabulary`).get().n;
      if (after !== before + 1) throw new Error(`row count ${before} → ${after}, expected +1`);
      const row = db.prepare(`SELECT * FROM vocabulary WHERE namespace = ?`).get(TOPIC_ROW.namespace);
      if (
        !row ||
        row.display_name !== TOPIC_ROW.display_name ||
        row.tier !== TOPIC_ROW.tier ||
        row.sort_order !== TOPIC_ROW.sort_order ||
        (row.retired_at ?? null) !== TOPIC_ROW.retired_at
      ) {
        throw new Error(`post-insert verification failed: ${JSON.stringify(row)}`);
      }
      process.stdout.write(`  inserted + verified: ${JSON.stringify(row)}\n`);
      if (opts.dryRun) throw ROLLBACK; // force rollback on dry-run
    });

    try {
      tx();
      process.stdout.write(`STEP 4 — committed. vocabulary now ${before + 1} rows.\n`);
      process.stdout.write(`[${SCRIPT_NAME}] DONE.\n`);
    } catch (e) {
      if (e === ROLLBACK) {
        process.stdout.write(`STEP 4 — DRY RUN rolled back. No changes written.\n`);
        process.stdout.write(`[${SCRIPT_NAME}] DRY RUN OK.\n`);
      } else {
        throw e;
      }
    }
  } catch (e) {
    fail(`${e.message}\n  Backup preserved at: ${bak}`);
  } finally {
    db.close();
  }
}

main();
