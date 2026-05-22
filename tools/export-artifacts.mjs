#!/usr/bin/env node
// ─── export-artifacts.mjs ───────────────────────────────────────────────────
// Phase v5-3 + v5-4 of Deep Dive (per docs/archive/SPEC_DRAFT_v5.md,
// docs/archive/SPEC_DRAFT_v5_1.md, docs/deep-dive-review/SPEC_DRAFT_v5_2.md). Replaces tools/export-deep-tags.mjs.
//
// Discovers exhibits dynamically from MediaVault's `exhibit:<name>` tags
// across released, non-archived artifacts. For each exhibit (discovered or
// listed in KNOWN_EXHIBITS), writes src/data/exhibits/<name>.json with the
// full artifact records the museum's deck consumes directly. No card_id
// concept: the museum displays MV's released artifacts, not authored cards.
//
// As of the source-of-truth refactor Phase 1.1 (2026-05-19), this script
// also emits src/data/vocabulary.json — a static snapshot of MV's
// `vocabulary` registry. The site build never contacts MV (§0.5 of
// DATA_ARCHITECTURE_SPEC_v2.1-target.md), so the JSON is the committed
// source-of-truth for pill-tier-by-namespace rendering. Re-run this
// command after curating retired_at flags on the MV side.
//
// Per Q-2: each record carries `title` (from description_short) AND
// `description` (from description_long) as separate fields.
// Per Q-3: every released artifact carrying the exhibit badge is exported;
// the museum's render layer dispatches on `media_type`. Non-link media types
// render a placeholder tile in the deck for this phase.
// Per Q-4 (updated 2026-05-21 by Phase B of Asset Delivery): URL dispatch
// per artifact:
//   1. tools/sync-assets-to-r2-manifest.json lookup wins if the artifact is
//      synced to R2 (provides primary_url AND thumbnail_url).
//   2. For media_type='link' + source_platform='youtube' without a manifest
//      entry, thumbnail_url is synthesized from the parsed YouTube video id.
//   3. Otherwise primary_url=null and thumbnail_url=null; placeholder renderer
//      handles it.
//
// Usage:
//   node tools/export-artifacts.mjs [flags]
//   --mv-base <url>       base URL for MV. default http://127.0.0.1:51822
//   --output-dir <path>   per-exhibit output directory. default src/data/exhibits
//   --dry-run             compute everything; print summary; do not write
//   --verbose             print SQL, row counts, per-artifact details
//   --help                show usage and exit
//
// Exits 0 on success (including the all-empty case). Non-zero on any error.
// ─────────────────────────────────────────────────────────────────────────────

import {
  readFileSync, writeFileSync, mkdirSync, statSync,
  mkdtempSync, rmSync, renameSync, existsSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import Database from "better-sqlite3";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");
const DEFAULT_MV_BASE = "http://127.0.0.1:51822";
const DEFAULT_OUTPUT_DIR = "src/data/exhibits";
const VOCAB_CSV_PATH = resolve(REPO_ROOT, "docs/deep-dive-vocabulary.csv");
const EXHIBITS_CONFIG_PATH = resolve(REPO_ROOT, "src/data/exhibits.config.json");
const MANIFEST_PATH = resolve(REPO_ROOT, "tools/sync-assets-to-r2-manifest.json");

// ─── Known exhibits ─────────────────────────────────────────────────────────
// Files for these are written even if no released artifact currently carries
// the badge. This bootstraps a new exhibit's route in the museum before any
// artifact has been badged for it (v5.1 Patch 10 Gap A).
// Files for discovered-but-not-known exhibits also get written; this list
// only governs bootstrapping.
// Storage: src/data/exhibits.config.json (committed). Per
// DATA_ARCHITECTURE_SPEC_v2.1-target.md §7.3 / Appendix A G5, the bootstrap
// list was relocated from a hardcoded array here to a committed config file
// (Phase 0.3 of the source-of-truth refactor, 2026-05-19). Extending that
// file is the documented way to introduce a new exhibit route.
function loadKnownExhibits() {
  let raw;
  try {
    raw = readFileSync(EXHIBITS_CONFIG_PATH, "utf8");
  } catch (err) {
    fail(`could not read exhibits config at ${EXHIBITS_CONFIG_PATH}: ${err.message}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    fail(`exhibits config is not valid JSON (${EXHIBITS_CONFIG_PATH}): ${err.message}`);
  }
  const list = parsed && parsed.known_exhibits;
  if (!Array.isArray(list)) {
    fail(`exhibits config missing "known_exhibits" array (${EXHIBITS_CONFIG_PATH})`);
  }
  for (const name of list) {
    if (typeof name !== "string" || !EXHIBIT_NAME_RE.test(name)) {
      fail(`exhibits config "known_exhibits" contains invalid entry ${JSON.stringify(name)} ` +
           `(must match ${EXHIBIT_NAME_RE})`);
    }
  }
  return list;
}

function loadAssetManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    return { artifacts: {} };
  }
  let raw;
  try {
    raw = readFileSync(MANIFEST_PATH, "utf8");
  } catch (err) {
    fail(`could not read asset manifest at ${MANIFEST_PATH}: ${err.message}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    fail(`asset manifest is not valid JSON (${MANIFEST_PATH}): ${err.message}`);
  }
  if (!parsed || typeof parsed.artifacts !== "object" || parsed.artifacts === null) {
    fail(`asset manifest missing "artifacts" object (${MANIFEST_PATH})`);
  }
  return parsed;
}

// ─── Tag-key shape for validating exhibit names ─────────────────────────────
// MV stores tag values as plain ASCII slugs (lowercase, alnum, _, -). The
// discovery query returns whatever the operator typed; we sanity-check before
// using a value as a filename or in a parameter substitution.
const EXHIBIT_NAME_RE = /^[a-z0-9_-]+$/;

// ─── SQL ───────────────────────────────────────────────────────────────────
// Discover every exhibit name across released, non-archived artifacts.
// substr(value, 9) drops the literal "exhibit:" prefix (8 characters, 1-indexed).
const DISCOVER_EXHIBITS_SQL = `SELECT DISTINCT substr(value, 9) AS exhibit_name
FROM artifacts, json_each(tags)
WHERE status = 'released'
  AND archived_at IS NULL
  AND value LIKE 'exhibit:%'
ORDER BY exhibit_name;`;

// Per-exhibit artifact pull. Parameterized: the badge value is passed as a
// SQL parameter, not interpolated, so an exotic exhibit name can't break the
// query (the regex above also guards against weird shapes before we get here).
const PER_EXHIBIT_SQL = `SELECT a.id, a.source_url, a.source_platform, a.media_type,
       a.tags, a.description_short, a.description_long,
       a.post_date, a.post_date_confidence,
       a.released_at,
       a.parent_artifact_id
FROM artifacts a
WHERE a.status = 'released'
  AND a.archived_at IS NULL
  AND a.parent_artifact_id IS NULL
  AND EXISTS (
    SELECT 1 FROM json_each(a.tags)
    WHERE json_each.value = ?
  );`;

// Count released artifacts (parent only) that carry NO exhibit:* badge. These
// are surfaced in the summary so the operator can spot under-curated rows.
const NO_BADGE_COUNT_SQL = `SELECT COUNT(*) AS c
FROM artifacts a
WHERE a.status = 'released'
  AND a.archived_at IS NULL
  AND a.parent_artifact_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM json_each(a.tags)
    WHERE json_each.value LIKE 'exhibit:%'
  );`;

// Vocabulary registry pull. Phase 1.1 of the source-of-truth refactor
// (DATA_ARCHITECTURE_SPEC_v2.1-target.md §5.4; SOURCE_OF_TRUTH_REFACTOR
// _SCOPING_BRIEF §9.2). The MV `vocabulary` table is the only artifact
// that carries the complete registry (T1+T2 canon + dynamic T3 + retirement
// flags). The site build and prebuild hook never contact MV (§0.5), so the
// table has to be emitted into a committed JSON during this MV-contacting
// operator run, alongside the per-exhibit JSONs.
//
// Order: tier ascending with NULL tiers last (so `exhibit` and any future
// uncategorized rows sit at the bottom), then sort_order, then namespace.
// Within retired-only blocks the same order applies — the consumer
// (hr_dimensions.js) is what filters on retired_at.
const VOCABULARY_SQL = `SELECT namespace, display_name, tier, sort_order, retired_at
FROM vocabulary
ORDER BY (tier IS NULL), tier, sort_order, namespace;`;

// ─── Helpers ────────────────────────────────────────────────────────────────
function fail(msg, code = 1) {
  process.stderr.write(`export-artifacts: ${msg}\n`);
  process.exit(code);
}

function logVerbose(verbose, ...args) {
  if (verbose) process.stderr.write(`export-artifacts: ${args.join(" ")}\n`);
}

function printHelp() {
  process.stdout.write([
    "Usage: node tools/export-artifacts.mjs [flags]",
    "",
    "  --mv-base <url>      base URL for MV (default http://127.0.0.1:51822)",
    "  --output-dir <path>  per-exhibit output directory (default src/data/exhibits)",
    "  --dry-run            compute and report; do not write any files",
    "  --verbose            print SQL, row counts, per-artifact details",
    "  --help               show this message",
    "",
  ].join("\n"));
}

function parseArgs(argv) {
  const opts = {
    mvBase: DEFAULT_MV_BASE,
    outputDir: DEFAULT_OUTPUT_DIR,
    dryRun: false,
    verbose: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") { opts.help = true; }
    else if (a === "--dry-run") { opts.dryRun = true; }
    else if (a === "--verbose") { opts.verbose = true; }
    else if (a === "--mv-base") {
      opts.mvBase = argv[++i];
      if (!opts.mvBase) fail("--mv-base requires a value");
    }
    else if (a === "--output-dir") {
      opts.outputDir = argv[++i];
      if (!opts.outputDir) fail("--output-dir requires a value");
    }
    else if (a.startsWith("--mv-base=")) { opts.mvBase = a.slice("--mv-base=".length); }
    else if (a.startsWith("--output-dir=")) { opts.outputDir = a.slice("--output-dir=".length); }
    else { fail(`unknown flag: ${a}\nrun with --help for usage.`); }
  }
  return opts;
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

// Run a callback with a temp SQLite file initialized from `buf`. Cleans up on
// the way out regardless of whether the callback threw.
function withTempDb(buf, fn) {
  const tmp = mkdtempSync(join(tmpdir(), "export-artifacts-"));
  const tmpDb = join(tmp, "mv.sqlite");
  try {
    writeFileSync(tmpDb, buf);
    const db = new Database(tmpDb, { readonly: true, fileMustExist: true });
    try {
      return fn(db);
    } finally {
      db.close();
    }
  } finally {
    try { rmSync(tmp, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}

// Wrap a db call so the v5.1 Patch 8 diagnostic fires for the known-historical
// missing-column failure.
function runSchemaSensitive(fn) {
  try {
    return fn();
  } catch (err) {
    const m = err && err.message ? String(err.message) : "";
    if (m.includes("no such column: archived_at")) {
      fail("Your MediaVault schema does not have the `archived_at` column. " +
           "This column is referenced by the export's filter. Run " +
           "`db_migrate.py` in the MV repo, or contact ops to remove the " +
           "clause from the export script.");
    }
    throw err;
  }
}

// ─── YouTube ID parser ──────────────────────────────────────────────────────
// Per Q-4: parse the parent artifact's source_url to recover the YouTube
// video id. Three URL shapes seen in MV (per PRIORITY4_VERIFICATION.md):
// `watch?v=<id>`, `youtu.be/<id>`, `/embed/<id>` / `/shorts/<id>`. The CDN
// thumbnail URL is then synthesized from the id.
function parseYoutubeId(url) {
  if (!url || typeof url !== "string") return null;
  // ?v=<id> or &v=<id>
  let m = url.match(/[?&]v=([A-Za-z0-9_-]{11})(?:[&#]|$)/);
  if (m) return m[1];
  // youtu.be/<id>
  m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})(?:[?&#/]|$)/);
  if (m) return m[1];
  // /embed/<id> or /shorts/<id> or /v/<id>
  m = url.match(/\/(?:embed|shorts|v)\/([A-Za-z0-9_-]{11})(?:[?&#/]|$)/);
  if (m) return m[1];
  return null;
}

// ─── Row → artifact record ──────────────────────────────────────────────────
function buildArtifactRecord(row, manifest) {
  // Parse tags JSON array, group by namespace.
  let rawTags = [];
  if (typeof row.tags === "string" && row.tags) {
    try {
      const parsed = JSON.parse(row.tags);
      if (Array.isArray(parsed)) rawTags = parsed.filter(t => typeof t === "string");
    } catch { /* malformed JSON tag column -> treat as empty */ }
  }

  // Group by namespace. Split on FIRST `:` only — a value containing colons
  // (rare; not present today, but defensive) stays intact after that split.
  // The `exhibit:` namespace is preserved in the artifact record; the
  // museum's render layer strips it before passing to dimension discovery
  // (v5.2 §3).
  const tagsByNamespace = {};
  for (const t of rawTags) {
    const colon = t.indexOf(":");
    if (colon <= 0) continue;            // no namespace, or empty namespace
    const ns = t.slice(0, colon);
    const value = t.slice(colon + 1);
    if (!value) continue;
    if (!tagsByNamespace[ns]) tagsByNamespace[ns] = [];
    if (!tagsByNamespace[ns].includes(value)) tagsByNamespace[ns].push(value);
  }
  // Sort within each namespace, and sort namespaces themselves, for
  // deterministic output across runs.
  const sortedTags = {};
  for (const ns of Object.keys(tagsByNamespace).sort()) {
    sortedTags[ns] = [...tagsByNamespace[ns]].sort();
  }

  // URL dispatch (Phase B of Asset Delivery, 2026-05-21):
  //   1. Asset manifest lookup wins if present (R2-synced primary AND thumbnail).
  //   2. YouTube thumbnail synthesis (Q-4) for media_type='link' + source_platform='youtube'.
  //   3. Otherwise null; render layer falls back to placeholder.
  let primary_url = null;
  let thumbnail_url = null;
  const m = manifest && manifest.artifacts ? manifest.artifacts[row.id] : null;
  if (m) {
    primary_url = m.primary_url ?? null;
    thumbnail_url = m.thumbnail_url ?? null;
  }
  if (!thumbnail_url && row.source_platform === "youtube" && row.media_type === "link") {
    const ytId = parseYoutubeId(row.source_url);
    if (ytId) thumbnail_url = `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;
  }

  return {
    id: row.id,
    source_url: row.source_url,
    source_platform: row.source_platform,
    media_type: row.media_type,
    title: row.description_short ?? "",
    description: row.description_long ?? "",
    post_date: row.post_date ?? null,
    released_at: row.released_at ?? null,
    primary_url,
    thumbnail_url,
    tags: sortedTags,
  };
}

// ─── Atomic write (temp + rename, per v5 §6.1) ──────────────────────────────
function atomicWriteJson(outPath, data) {
  mkdirSync(dirname(outPath), { recursive: true });
  const json = JSON.stringify(data, null, 2) + "\n";
  const tmp = outPath + ".tmp";
  writeFileSync(tmp, json);
  renameSync(tmp, outPath);
  return Buffer.byteLength(json, "utf8");
}

// ─── Vocabulary CSV digest (metadata only) ──────────────────────────────────
function vocabularyCsvSha() {
  if (!existsSync(VOCAB_CSV_PATH)) return null;
  const bytes = readFileSync(VOCAB_CSV_PATH);
  return createHash("sha256").update(bytes).digest("hex").slice(0, 12);
}

// ─── Vocabulary registry → JSON payload ─────────────────────────────────────
// Phase 1.1 of the source-of-truth refactor. Mirrors the per-exhibit JSON
// shape ({ metadata, <body> }) so consumers parse them the same way.
// Each row is passed through verbatim; retired_at is preserved (downstream
// consumers — currently src/routes/hr/hr_dimensions.js — decide whether to
// filter retired rows from the rendered output).
function buildVocabularyPayload(rows, { sourceUrl, exportedAt }) {
  const namespaces = rows.map(r => ({
    namespace: r.namespace,
    display_name: r.display_name,
    tier: r.tier ?? null,
    sort_order: r.sort_order ?? null,
    retired_at: r.retired_at ?? null,
  }));
  return {
    metadata: {
      source: sourceUrl,
      exported_at: exportedAt,
      row_count: namespaces.length,
      schema: "vocabulary v1 — namespace, display_name, tier, sort_order, retired_at",
    },
    namespaces,
  };
}

// ─── main ──────────────────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { printHelp(); return 0; }

  // Load committed bootstrap list before contacting MV — if the config
  // is broken, fail early with a clear message instead of after a network
  // round-trip.
  const KNOWN_EXHIBITS = loadKnownExhibits();
  const ASSET_MANIFEST = loadAssetManifest();

  const { url, buf } = await fetchMvBlob(opts.mvBase, opts.verbose);

  const exportedAt = new Date().toISOString();
  const vocabSha = vocabularyCsvSha();

  const result = withTempDb(buf, (db) => {
    logVerbose(opts.verbose, "discover SQL:", DISCOVER_EXHIBITS_SQL.replace(/\s+/g, " "));
    const discovered = runSchemaSensitive(() => db.prepare(DISCOVER_EXHIBITS_SQL).all())
      .map(r => r.exhibit_name)
      .filter(name => typeof name === "string" && EXHIBIT_NAME_RE.test(name));
    logVerbose(opts.verbose, `discovered ${discovered.length} exhibit(s): ${discovered.join(", ") || "(none)"}`);

    const skippedNoBadgeRow = runSchemaSensitive(() => db.prepare(NO_BADGE_COUNT_SQL).get());
    const skippedNoBadge = skippedNoBadgeRow ? skippedNoBadgeRow.c : 0;
    logVerbose(opts.verbose, `released-but-no-badge count: ${skippedNoBadge}`);

    // Phase 1.1: pull the vocabulary registry from the same DB blob.
    // Fails loudly if the table is missing — the source-of-truth refactor
    // requires it (created/populated by MV Criterion 4, 2026-05-19).
    logVerbose(opts.verbose, "vocabulary SQL:", VOCABULARY_SQL.replace(/\s+/g, " "));
    let vocabularyRows;
    try {
      vocabularyRows = db.prepare(VOCABULARY_SQL).all();
    } catch (err) {
      const m = err && err.message ? String(err.message) : "";
      if (m.includes("no such table: vocabulary")) {
        fail("MV is missing the `vocabulary` table. It is created and " +
             "seeded by MV-side Criterion 4 work. Run the regeneration " +
             "step in the MV repo and retry. " +
             "(See SOURCE_OF_TRUTH_REFACTOR_SCOPING_BRIEF §9.1.)");
      }
      throw err;
    }
    logVerbose(opts.verbose, `vocabulary rows: ${vocabularyRows.length}`);

    // Union of discovered + known. Discovery is authoritative for what's
    // actually in MV; KNOWN_EXHIBITS makes sure empty bootstrap files exist
    // for routes the museum carries.
    const allExhibits = Array.from(new Set([...discovered, ...KNOWN_EXHIBITS])).sort();

    const perExhibit = db.prepare(PER_EXHIBIT_SQL);
    const counts = {};
    const filesToWrite = [];
    for (const name of allExhibits) {
      if (!EXHIBIT_NAME_RE.test(name)) {
        logVerbose(opts.verbose, `skip exhibit "${name}" (invalid shape)`);
        continue;
      }
      const rows = runSchemaSensitive(() => perExhibit.all(`exhibit:${name}`));
      logVerbose(opts.verbose, `  ${name}: ${rows.length} row(s)`);
      const artifacts = rows.map(row => buildArtifactRecord(row, ASSET_MANIFEST));
      counts[name] = artifacts.length;
      filesToWrite.push({
        name,
        payload: {
          metadata: {
            exhibit: name,
            exported_at: exportedAt,
            filter: "released, not archived, badged for this exhibit",
            vocabulary_csv_sha: vocabSha,
          },
          artifacts,
        },
      });
    }

    return { discovered, allExhibits, counts, filesToWrite, skippedNoBadge, vocabularyRows };
  });

  // Phase 1.1: build the vocabulary payload from the rows we pulled above.
  // The committed file is the static source-of-truth for the museum's
  // pill-tier rendering (hr_dimensions.js reads it at module load).
  const vocabularyPayload = buildVocabularyPayload(result.vocabularyRows, {
    sourceUrl: url,
    exportedAt,
  });

  const outDir = resolve(REPO_ROOT, opts.outputDir);
  // Committed location for the vocabulary registry JSON. Fixed path (not
  // configurable) because static imports in src/ resolve it at build time.
  const vocabularyOutPath = resolve(REPO_ROOT, "src/data/vocabulary.json");

  let totalBytes = 0;
  let filesWritten = 0;
  for (const f of result.filesToWrite) {
    const outPath = join(outDir, `${f.name}.json`);
    if (opts.dryRun) {
      const json = JSON.stringify(f.payload, null, 2) + "\n";
      totalBytes += Buffer.byteLength(json, "utf8");
    } else {
      totalBytes += atomicWriteJson(outPath, f.payload);
      filesWritten += 1;
    }
  }

  // Vocabulary registry write (Phase 1.1). One file, fixed path.
  let vocabularyBytes = 0;
  if (opts.dryRun) {
    const json = JSON.stringify(vocabularyPayload, null, 2) + "\n";
    vocabularyBytes = Buffer.byteLength(json, "utf8");
  } else {
    vocabularyBytes = atomicWriteJson(vocabularyOutPath, vocabularyPayload);
  }
  totalBytes += vocabularyBytes;

  // Summary
  const lines = [
    "Artifact export complete.",
    `  Source: ${url}`,
    `  Exhibits discovered: ${result.discovered.length}` +
      (result.discovered.length ? ` (${result.discovered.join(", ")})` : ""),
    `  Known-exhibit bootstrap entries: ${KNOWN_EXHIBITS.join(", ") || "(none)"}`,
    `  Files ${opts.dryRun ? "would write" : "written"}: ${opts.dryRun ? result.filesToWrite.length : filesWritten}` +
      ` (${totalBytes} bytes total)`,
  ];
  for (const name of result.allExhibits) {
    lines.push(`    ${name}.json: ${result.counts[name] ?? 0} artifact(s)`);
  }
  lines.push(`  Asset manifest: ${Object.keys(ASSET_MANIFEST.artifacts).length} artifact(s)` +
             (existsSync(MANIFEST_PATH) ? ` (${MANIFEST_PATH})` : " (absent — no R2 URLs)"));
  lines.push(`  Released artifacts with no exhibit badge: ${result.skippedNoBadge}`);
  lines.push(`  Vocabulary registry: ${result.vocabularyRows.length} row(s)` +
             ` (${vocabularyBytes} bytes)` + (opts.dryRun ? " (dry-run)" : ""));
  lines.push(`    src/data/vocabulary.json: ${result.vocabularyRows.length} namespace(s)`);
  lines.push(`  Output dir: ${opts.outputDir}` + (opts.dryRun ? " (dry-run)" : ""));
  lines.push("");
  process.stdout.write(lines.join("\n"));

  return 0;
}

main().then(
  (code) => process.exit(code ?? 0),
  (err) => fail(`unexpected error: ${err.stack || err.message || err}`),
);
