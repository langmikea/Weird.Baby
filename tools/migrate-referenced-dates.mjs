#!/usr/bin/env node
// ─── migrate-referenced-dates.mjs ───────────────────────────────────────────
// Derived-Era v0.2 · Step 1 (schema). Authority: docs/derived-era-spec_v0.2.md §3.3.
//
// Adds ONE additive, nullable JSON column to `artifacts`:
//
//     referenced_dates   TEXT   (JSON; NULL on every existing row)
//
// Holds curator-set CENTRALITY OVERRIDES only (per-reference weight overrides
// and/or an explicit era override). Inferred weights are NEVER stored here —
// they are recomputed every export (spec §3.4). Most leaves stay NULL.
//
// Properties (spec hard rules):
//   • additive + nullable  → no backfill, existing rows untouched
//   • no CHECK change      → the column carries free-form JSON, validated by
//                            the export reader, not the DB
//   • idempotent           → re-running is a no-op if the column already exists
//
// SQLite note: ALTER TABLE ADD COLUMN with no NOT NULL / no non-constant
// default is an O(1) catalogue-only change — it does not rewrite rows and
// cannot fail on existing data. Every current row reads back NULL.
//
// Usage:
//   node tools/migrate-referenced-dates.mjs --db <path-to-mediavault.sqlite> [--dry-run]
//
// This script writes directly to the SQLite file (the export, by contrast,
// reads MV over HTTP). Take a backup first; this script also refuses to run
// without an explicit --db path so it can never touch the wrong file.
// ─────────────────────────────────────────────────────────────────────────────

import Database from "better-sqlite3";

function fail(msg) { process.stderr.write(`migrate-referenced-dates: ${msg}\n`); process.exit(1); }

function parseArgs(argv) {
  const o = { db: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") o.dryRun = true;
    else if (a === "--db") { o.db = argv[++i]; if (!o.db) fail("--db requires a path"); }
    else if (a.startsWith("--db=")) o.db = a.slice("--db=".length);
    else fail(`unknown flag: ${a}`);
  }
  if (!o.db) fail("a --db <path> to mediavault.sqlite is required (refusing to guess)");
  return o;
}

function columnExists(db, table, col) {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all();
  return rows.some(r => r.name === col);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const db = new Database(opts.db, { fileMustExist: true });
  try {
    const before = db.prepare(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name='artifacts'`
    ).get();
    if (!before) fail("no `artifacts` table in this database");

    if (columnExists(db, "artifacts", "referenced_dates")) {
      process.stdout.write("referenced_dates already present — nothing to do (idempotent no-op).\n");
      return 0;
    }

    process.stdout.write("BEFORE .schema artifacts:\n" + before.sql + "\n\n");

    if (opts.dryRun) {
      process.stdout.write("--dry-run: would run `ALTER TABLE artifacts ADD COLUMN referenced_dates TEXT;`\n");
      return 0;
    }

    db.exec("ALTER TABLE artifacts ADD COLUMN referenced_dates TEXT;");

    const after = db.prepare(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name='artifacts'`
    ).get();
    process.stdout.write("AFTER  .schema artifacts:\n" + after.sql + "\n\n");

    const nulls = db.prepare(
      `SELECT COUNT(*) c FROM artifacts WHERE referenced_dates IS NULL`
    ).get().c;
    const total = db.prepare(`SELECT COUNT(*) c FROM artifacts`).get().c;
    process.stdout.write(`Applied. referenced_dates IS NULL on ${nulls}/${total} rows (expected all).\n`);
    return 0;
  } finally {
    db.close();
  }
}

process.exit(main());
