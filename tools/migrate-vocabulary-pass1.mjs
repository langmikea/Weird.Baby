#!/usr/bin/env node
// ─── migrate-vocabulary-pass1.mjs ──────────────────────────────────────────
// B-1 step 2, Pass 1 of the two-pass vocabulary migration
// (per docs/canonical/B1_IMPLEMENTATION_PLAN.md §4.1 step 3 + §3.4 Q4).
//
// Reads MV's `tags` table; populates MV's (just-migrated, empty)
// `vocabulary` table with:
//   - one `namespace` entry per distinct `tags.category` in MV
//   - canonical-spec namespace entries for any Tier 1 / Tier 2 slug MV
//     does NOT currently have (so vocabulary is canonical-complete from
//     day one — `album` etc. exist even when MV has no `album` tag yet)
//   - one `value` entry per distinct (category, slug) pair in MV
//   - three `tab` entries (Artist / Formats / Deep Tracks)
//
// Pass 2 (separate session) will rewrite artifact tag references; this
// script does NOT touch artifacts, the `tags` table, MV's curation UI,
// the museum's `src/` tree, or git.
//
// Tier mapping (per docs/CANONICAL_VOCABULARY.md):
//   Tier 1 ARTIST: year, album, song, venue, people  (locked membership)
//   Tier 2 MEDIA:  source, type                       (locked membership)
//   Tier 3 DEEP DIVE: everything else                 (catch-all)
//
// Tab display_names follow CURRENT code (Artist / Formats / Deep Tracks),
// NOT canonical labels (ARTIST / MEDIA / DEEP DIVE). The label flip is
// B-7's job, through the vocabulary management UX once it exists. Pass 1
// reflects current state.
//
// Before running: stop MV (close the curation UI and any process holding
// the SQLite). This script opens the database for write; a concurrent MV
// process may either block the open ("database is locked") or, worse,
// produce inconsistent state. Restart MV after the commit prints.
//
// Usage (from the museum repo root):
//   node tools/migrate-vocabulary-pass1.mjs [flags]
//
//   --mv-db <path>       Explicit path to MV's SQLite file.
//                        Default: scan --mv-core for a single .sqlite/.db.
//   --mv-core <dir>      MV's core directory (where the SQLite lives).
//                        Default: C:\AI\Platform\MediaVault\core
//   --dry-run            Run every step including verification, then
//                        ROLLBACK (no commit). Useful for a first pass.
//   --verbose            Print SQL, every entry to be inserted, etc.
//   --help               Show this message.
//
// Exits 0 on a clean commit OR a clean dry-run rollback.
// Exits non-zero on any failure (backup, discovery, verification, write).
// Verification failures rollback the transaction before exit — no
// partial vocabulary state survives.
// ─────────────────────────────────────────────────────────────────────────────

import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import Database from "better-sqlite3";

const SCRIPT_NAME = "migrate-vocabulary-pass1";

// ─── Canonical tier membership (CANONICAL_VOCABULARY.md) ─────────────────────
// Locked design. Operator confirmed at 2026-05-13. Do not edit here without
// editing CANONICAL_VOCABULARY.md first.
const CANONICAL_TIER_1 = ["year", "album", "song", "venue", "people"];
const CANONICAL_TIER_2 = ["source", "type"];

// ─── Tab entries (Q6 lock per B1_IMPLEMENTATION_PLAN §3.6 / §6.4) ────────────
// Labels match current code, NOT canonical. B-7 handles the flip.
const TAB_ENTRIES = [
  { id: "vocab_tab_artist", slug: "artist", display_name: "Artist",      tier: 1 },
  { id: "vocab_tab_media",  slug: "media",  display_name: "Formats",     tier: 2 },
  { id: "vocab_tab_deep",   slug: "deep",   display_name: "Deep Tracks", tier: 3 },
];

const DEFAULT_MV_CORE = "C:\\AI\\Platform\\MediaVault\\core";

// ─── SQL ─────────────────────────────────────────────────────────────────────
// Discovery — runs against MV's existing `tags` table.
const SQL_DISCOVER_NAMESPACES =
  `SELECT DISTINCT category FROM tags WHERE category IS NOT NULL;`;

const SQL_DISCOVER_PAIRS =
  `SELECT DISTINCT category, slug FROM tags WHERE category IS NOT NULL;`;

// Legacy-pattern check: any slug containing ':' suggests a namespace prefix
// baked into the slug (e.g., a tag stored as `slug = "mood:snarky"` rather
// than category="mood", slug="snarky"). Reported but not transformed here.
// Pass 2 will surface these again with a decision point for the operator.
const SQL_DISCOVER_COLON_SLUGS =
  `SELECT DISTINCT category, slug FROM tags WHERE slug LIKE '%:%';`;

// Insert into the vocabulary table that B-1 step 1 (MV schema migration,
// committed 12:12 PM 2026-05-13) added.
const SQL_INSERT_VOCAB = `
INSERT INTO vocabulary (
  id, kind, slug, display_name, tier, namespace_id,
  sort_order, retired_at, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

// Verification queries.
const SQL_COUNT_BY_KIND =
  `SELECT kind, COUNT(*) AS n FROM vocabulary GROUP BY kind;`;

const SQL_TOTAL_ROWS =
  `SELECT COUNT(*) AS n FROM vocabulary;`;

const SQL_COUNT_BY_TIER =
  `SELECT tier, COUNT(*) AS n FROM vocabulary GROUP BY tier;`;

const SQL_LOOKUP_NAMESPACE_BY_SLUG =
  `SELECT id FROM vocabulary WHERE kind = 'namespace' AND slug = ?;`;

// Orphan check: every kind='value' row's namespace_id should resolve to an
// existing kind='namespace' row.
const SQL_ORPHAN_VALUES = `
SELECT v.id AS value_id, v.namespace_id
FROM vocabulary v
LEFT JOIN vocabulary n
  ON n.id = v.namespace_id AND n.kind = 'namespace'
WHERE v.kind = 'value' AND n.id IS NULL;`;

// Explicit duplicate check — the unique index would catch this at INSERT
// time, but verifying inside the transaction surfaces the failure with a
// clear list (vs. a bare UNIQUE-constraint error).
const SQL_FIND_DUPLICATES = `
SELECT kind, IFNULL(namespace_id, '') AS ns, slug, COUNT(*) AS n
FROM vocabulary
GROUP BY kind, IFNULL(namespace_id, ''), slug
HAVING COUNT(*) > 1;`;

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
    "Usage: node tools/migrate-vocabulary-pass1.mjs [flags]",
    "",
    "  --mv-db <path>     Explicit path to MV's SQLite file.",
    "  --mv-core <dir>    MV's core directory (default C:\\AI\\Platform\\MediaVault\\core).",
    "  --dry-run          Run everything; verify; ROLLBACK (no commit).",
    "  --verbose          Print SQL and per-entry details.",
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

// Scan an MV core directory for a single SQLite file. Refuses ambiguity.
// Skips obvious noise (WAL/SHM/journal sidecars, prior `bak_` backups).
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

// Copy MV's SQLite to a sibling timestamped backup, matching MV's
// bak_pre_<scriptname>_<timestamp> convention. Backup lives next to the
// original (i.e., in MV's core/ — this script reaches across from the
// museum repo to MV's directory by design).
function backupSqlite(dbPath) {
  const dir = dirname(dbPath);
  const orig = basename(dbPath);
  // Filename-safe ISO timestamp (no colons or dots, which Windows hates).
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const bakName = `bak_pre_${SCRIPT_NAME}_${stamp}__${orig}`;
  const bakPath = join(dir, bakName);
  copyFileSync(dbPath, bakPath);
  return bakPath;
}

function titleCase(slug) {
  return String(slug)
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 0)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function tierForNamespaceSlug(slug) {
  if (CANONICAL_TIER_1.includes(slug)) return 1;
  if (CANONICAL_TIER_2.includes(slug)) return 2;
  return 3; // Deep Dive catch-all — operator-locked 2026-05-13
}

// Frozen-initial-slug ID pattern, per B1_IMPLEMENTATION_PLAN §3.2 (Q2 lock).
// `vocab_<slug>` for namespaces; namespace-scoped `vocab_<ns>_<value>` for
// values to keep IDs unique across namespaces (a value `dark` under both
// `mood` and `theme` yields `vocab_mood_dark` and `vocab_theme_dark`).
function namespaceIdFor(nsSlug)        { return `vocab_${nsSlug}`; }
function valueIdFor(nsSlug, valueSlug) { return `vocab_${nsSlug}_${valueSlug}`; }

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
    // Match the v10 migration's PRAGMAs (per the brief / B-1 step 1 conventions).
    db.pragma("journal_mode = MEMORY");
    db.pragma("foreign_keys = OFF");

    // ─── STEP 2 — discover MV state ─────────────────────────────────────────
    process.stdout.write(`STEP 2 — discover MV state\n`);

    let nsRows, pairRows, colonRows;
    try {
      logVerbose(opts.verbose, "SQL:", SQL_DISCOVER_NAMESPACES);
      nsRows = db.prepare(SQL_DISCOVER_NAMESPACES).all();
      logVerbose(opts.verbose, "SQL:", SQL_DISCOVER_PAIRS);
      pairRows = db.prepare(SQL_DISCOVER_PAIRS).all();
      logVerbose(opts.verbose, "SQL:", SQL_DISCOVER_COLON_SLUGS);
      colonRows = db.prepare(SQL_DISCOVER_COLON_SLUGS).all();
    } catch (err) {
      const m = err && err.message ? String(err.message) : "";
      if (/no such table: tags/i.test(m)) {
        fail(`MV's \`tags\` table does not exist. Has B-1 step 1 (schema migration) run?\n` +
             `underlying error: ${m}`);
      }
      if (/no such column: (category|slug)/i.test(m)) {
        fail(`MV's \`tags\` table is missing an expected column.\n` +
             `Pass 1 expects \`category\` and \`slug\` columns.\n` +
             `underlying error: ${m}`);
      }
      throw err;
    }

    const mvNamespaces = Array.from(new Set(
      nsRows.map(r => r.category)
            .filter(c => typeof c === "string" && c.length > 0)
    )).sort();

    process.stdout.write(
      `  namespaces found: ${mvNamespaces.length}` +
      (mvNamespaces.length ? ` (${mvNamespaces.join(", ")})` : " (none)") + `\n`);

    const pairs = pairRows
      .filter(r => typeof r.category === "string" && r.category.length > 0)
      .filter(r => typeof r.slug === "string" && r.slug.length > 0);
    // De-dup defensively in case the underlying SELECT DISTINCT doesn't
    // collapse on identical Unicode normalizations.
    const seenPair = new Set();
    const uniquePairs = [];
    for (const p of pairs) {
      const k = `${p.category} ${p.slug}`;
      if (seenPair.has(k)) continue;
      seenPair.add(k);
      uniquePairs.push(p);
    }
    process.stdout.write(`  (namespace, value) pairs found: ${uniquePairs.length}\n`);

    const colonSlugs = colonRows
      .filter(r => typeof r.slug === "string" && r.slug.includes(":"));
    if (colonSlugs.length > 0) {
      process.stdout.write(
        `  WARNING: ${colonSlugs.length} slug(s) contain ':' (legacy namespace-in-slug pattern):\n` +
        colonSlugs.slice(0, 20)
          .map(r => `    category=${r.category} slug=${r.slug}`).join("\n") +
        (colonSlugs.length > 20 ? `\n    ... and ${colonSlugs.length - 20} more` : "") + `\n` +
        `  Pass 1 inserts these values as-is. Pass 2 will surface them again.\n`);
    } else {
      process.stdout.write(`  no namespace-shaped patterns in slug values\n`);
    }

    // ─── STEP 3 — build vocabulary entries ──────────────────────────────────
    process.stdout.write(`STEP 3 — build vocabulary entries\n`);

    const now = new Date().toISOString();

    const namespaceEntries = [];
    const seenNsSlug = new Set();

    for (const slug of mvNamespaces) {
      if (seenNsSlug.has(slug)) continue;
      seenNsSlug.add(slug);
      namespaceEntries.push({
        id: namespaceIdFor(slug),
        kind: "namespace",
        slug,
        display_name: titleCase(slug),
        tier: tierForNamespaceSlug(slug),
        namespace_id: null,
        sort_order: null,
        retired_at: null,
        created_at: now,
        updated_at: now,
        _source: "mv",
      });
    }

    // Canonical-completion: any Tier 1 or Tier 2 namespace MV does NOT have
    // gets inserted anyway so the vocabulary table is canonical-complete from
    // day one. CANONICAL_VOCABULARY.md is the source of truth for what must
    // exist; this is the "if MV has no album, insert album anyway" path.
    const canonicalAdded = [];
    for (const slug of [...CANONICAL_TIER_1, ...CANONICAL_TIER_2]) {
      if (seenNsSlug.has(slug)) continue;
      seenNsSlug.add(slug);
      namespaceEntries.push({
        id: namespaceIdFor(slug),
        kind: "namespace",
        slug,
        display_name: titleCase(slug),
        tier: tierForNamespaceSlug(slug),  // 1 or 2 by construction
        namespace_id: null,
        sort_order: null,
        retired_at: null,
        created_at: now,
        updated_at: now,
        _source: "canonical",
      });
      canonicalAdded.push(slug);
    }
    const fromMvCount = namespaceEntries.length - canonicalAdded.length;
    process.stdout.write(
      `  namespace entries: ${namespaceEntries.length}` +
      ` (${fromMvCount} from MV + ${canonicalAdded.length} canonical-added` +
      (canonicalAdded.length ? `: ${canonicalAdded.join(", ")}` : "") + `)\n`);

    // Value entries — one per unique (category, slug) pair from MV.
    const valueEntries = uniquePairs.map(({ category, slug }) => ({
      id: valueIdFor(category, slug),
      kind: "value",
      slug,
      display_name: titleCase(slug),
      tier: null, // values inherit through their namespace
      namespace_id: namespaceIdFor(category),
      sort_order: null,
      retired_at: null,
      created_at: now,
      updated_at: now,
    }));
    process.stdout.write(`  value entries: ${valueEntries.length}\n`);

    const tabEntries = TAB_ENTRIES.map(t => ({
      id: t.id,
      kind: "tab",
      slug: t.slug,
      display_name: t.display_name,
      tier: t.tier,
      namespace_id: null,
      sort_order: null,
      retired_at: null,
      created_at: now,
      updated_at: now,
    }));
    process.stdout.write(`  tab entries: ${tabEntries.length}\n`);

    const totalToInsert =
      namespaceEntries.length + valueEntries.length + tabEntries.length;
    process.stdout.write(`  total: ${totalToInsert}\n`);

    if (opts.verbose) {
      for (const e of namespaceEntries) {
        logVerbose(true,
          `  namespace[${e._source}]: id=${e.id} slug=${e.slug} tier=${e.tier}`);
      }
      const sample = valueEntries.slice(0, 50);
      for (const e of sample) {
        logVerbose(true,
          `  value: id=${e.id} slug=${e.slug} ns=${e.namespace_id}`);
      }
      if (valueEntries.length > sample.length) {
        logVerbose(true,
          `  ... and ${valueEntries.length - sample.length} more value entries`);
      }
      for (const e of tabEntries) {
        logVerbose(true,
          `  tab: id=${e.id} slug=${e.slug} tier=${e.tier}`);
      }
    }

    // ─── STEP 4 — insert in a single transaction ────────────────────────────
    process.stdout.write(`STEP 4 — insert (single transaction)\n`);
    process.stdout.write(`  inserting...\n`);

    const insertOne = db.prepare(SQL_INSERT_VOCAB);
    const lookupNs  = db.prepare(SQL_LOOKUP_NAMESPACE_BY_SLUG);

    // The transaction body runs ALL inserts then ALL verifications. Any
    // verification failure throws, which rolls back the transaction (per the
    // brief's "raise-to-rollback" convention). Dry-run uses the same path:
    // throws a sentinel error after verification passes.
    const DRY_RUN_SENTINEL = "__DRY_RUN_ROLLBACK__";

    const tx = db.transaction(() => {
      const insertEntry = (e) => insertOne.run(
        e.id, e.kind, e.slug, e.display_name, e.tier,
        e.namespace_id, e.sort_order, e.retired_at,
        e.created_at, e.updated_at,
      );
      for (const e of namespaceEntries) insertEntry(e);
      for (const e of valueEntries)     insertEntry(e);
      for (const e of tabEntries)       insertEntry(e);

      // ─── STEP 5 — verification (still inside the transaction) ────────────
      process.stdout.write(`STEP 5 — verification\n`);

      const countByKind = { namespace: 0, value: 0, tab: 0 };
      for (const r of db.prepare(SQL_COUNT_BY_KIND).all()) {
        countByKind[r.kind] = r.n;
      }
      process.stdout.write(
        `  count by kind: ` +
        `namespace=${countByKind.namespace}, ` +
        `value=${countByKind.value}, ` +
        `tab=${countByKind.tab}\n`);

      if (countByKind.namespace !== namespaceEntries.length) {
        throw new Error(
          `VERIFICATION FAILED: namespace count ${countByKind.namespace} ` +
          `!= expected ${namespaceEntries.length}`);
      }
      if (countByKind.value !== valueEntries.length) {
        throw new Error(
          `VERIFICATION FAILED: value count ${countByKind.value} ` +
          `!= expected ${valueEntries.length}`);
      }
      if (countByKind.tab !== tabEntries.length) {
        throw new Error(
          `VERIFICATION FAILED: tab count ${countByKind.tab} ` +
          `!= expected ${tabEntries.length}`);
      }

      const missingT1 = CANONICAL_TIER_1.filter(s => !lookupNs.get(s));
      if (missingT1.length > 0) {
        throw new Error(
          `VERIFICATION FAILED: missing canonical Tier 1 namespaces: ` +
          missingT1.join(", "));
      }
      process.stdout.write(`  canonical tier 1 namespaces present: ✓\n`);

      const missingT2 = CANONICAL_TIER_2.filter(s => !lookupNs.get(s));
      if (missingT2.length > 0) {
        throw new Error(
          `VERIFICATION FAILED: missing canonical Tier 2 namespaces: ` +
          missingT2.join(", "));
      }
      process.stdout.write(`  canonical tier 2 namespaces present: ✓\n`);

      const orphans = db.prepare(SQL_ORPHAN_VALUES).all();
      if (orphans.length > 0) {
        throw new Error(
          `VERIFICATION FAILED: ${orphans.length} value entry(s) with ` +
          `unresolved namespace_id:\n` +
          orphans.slice(0, 10)
            .map(o => `    ${o.value_id} -> ${o.namespace_id}`).join("\n") +
          (orphans.length > 10 ? `\n    ... and ${orphans.length - 10} more` : ""));
      }
      process.stdout.write(`  every value's namespace_id resolves: ✓\n`);

      const dups = db.prepare(SQL_FIND_DUPLICATES).all();
      if (dups.length > 0) {
        throw new Error(
          `VERIFICATION FAILED: ${dups.length} duplicate (kind, namespace_id, slug) row(s):\n` +
          dups.slice(0, 10)
            .map(d => `    kind=${d.kind} ns=${d.ns || "(null)"} slug=${d.slug} n=${d.n}`)
            .join("\n") +
          (dups.length > 10 ? `\n    ... and ${dups.length - 10} more` : ""));
      }
      process.stdout.write(`  no duplicate (kind, namespace_id, slug): ✓\n`);

      // Dry-run: throw to rollback. Verification already passed; no commit.
      if (opts.dryRun) {
        throw new Error(DRY_RUN_SENTINEL);
      }
    });

    let committed = false;
    try {
      tx();
      committed = true;
    } catch (err) {
      const m = err && err.message ? String(err.message) : "";
      if (m === DRY_RUN_SENTINEL) {
        process.stdout.write(
          `DRY-RUN ROLLBACK ✓\n` +
          `  Verification passed. No commit. Backup still at ${bak}.\n`);
        return 0;
      }
      // Any other throw: real verification or DB failure — rollback already
      // happened (better-sqlite3's transaction wrapper rolls back on throw).
      process.stderr.write(`${m}\nROLLBACK ✓\n`);
      process.stderr.write(`Backup is intact at ${bak}.\n`);
      process.exit(2);
    }

    if (committed) {
      process.stdout.write(`COMMIT ✓\n`);
    }

    // ─── Post-commit summary ────────────────────────────────────────────────
    const totalRow = db.prepare(SQL_TOTAL_ROWS).get();
    const byTier = { 1: 0, 2: 0, 3: 0, "no-tier": 0 };
    for (const r of db.prepare(SQL_COUNT_BY_TIER).all()) {
      const k = r.tier == null ? "no-tier" : String(r.tier);
      byTier[k] = r.n;
    }
    const drifted = namespaceEntries
      .filter(e => e._source === "mv" && e.tier === 3)
      .map(e => e.slug)
      .sort();

    process.stdout.write(`Post-commit summary:\n`);
    process.stdout.write(`  total vocabulary rows: ${totalRow.n}\n`);
    process.stdout.write(
      `  by tier: 1=${byTier[1]}, 2=${byTier[2]}, 3=${byTier[3]}, ` +
      `no-tier=${byTier["no-tier"]}\n`);
    process.stdout.write(
      `  drifted-to-tier-3 namespaces: ` +
      (drifted.length ? drifted.join(", ") : "(none)") + `\n`);
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
