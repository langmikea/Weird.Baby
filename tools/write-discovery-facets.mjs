#!/usr/bin/env node
// ─── write-discovery-facets.mjs ────────────────────────────────────────────
// Discovery → MediaVault reconciliation, STEP 3 of the brief's §6 safe order
// of operations (discovery-mv-reconciliation-brief.docx, v2, 2026-06-14).
//
// Moves the Discovery facets from the committed museum snapshot INTO MV (the
// source of truth) so the next export PRODUCES them instead of erasing them.
// For each of the 22 hunter_root artifacts it:
//
//   (a) reads the per-artifact facet values from the COMMITTED snapshot
//       hunter_root.json @ d482fd4 — tags.{content_kind,topic,era,format,
//       source} on each leaf (brief §5: "the tag writer READS them from that
//       committed file — no new curation needed"); and
//   (b) merges them into MV's artifacts.tags JSON array as "namespace:value"
//       strings (the format the exporter parses — export-artifacts.mjs "Parse
//       tags JSON array, group by namespace", split on first ':'); and
//   (c) applies the §2 locked kind-column resolutions:
//         • 7 conflict rows  → OVERWRITE artifacts.kind with the Discovery
//                              value (which is inside MV's CHECK list);
//         • 011 / 012        → COEXIST: kind UNCHANGED (stays 'candid'); only
//                              the content_kind tag (cover / press) is added,
//                              because cover/press are NOT in the kind CHECK
//                              list and live only as content_kind: tags;
//         • 6 MV-empty rows  → kind stays NULL, tag added;
//         • 7 agree rows     → kind unchanged, tags added.
//       Net: the kind COLUMN changes on exactly 7 rows (brief §3).
//
// SELF-CHECKING (brief §5): the script does not trust the brief blindly. The
// expected pre-state (current kind per row) and the resolution class per row
// are baked in below and ASSERTED against live MV before any write. If MV has
// drifted from the brief, the script aborts before opening the transaction.
//
// IDEMPOTENT: tag additions are a set-union (re-runs add nothing); the kind
// self-check accepts either the brief's pre-state OR the already-applied
// target, so a second run after a clean commit is a verified no-op.
//
// What this script does NOT touch: the `vocabulary` table (run
// add-topic-namespace.mjs first), the `tags` catalog table, MV's schema, the
// museum's src/ tree, or git. It does not re-export and it does not run
// itself — the operator runs it.
//
// GUARDS (per brief §6 step 3 "Guarded writer, dry-run + sqlite backup first"):
//   1. Backs up the SQLite before opening for write; refuses to proceed if the
//      backup fails.
//   2. Reads the source values from the committed git blob (read-only), not
//      the dirty working tree (which the brief notes may be stale/edited).
//   3. Validates EVERY assumption BEFORE the transaction opens — no writes if
//      anything is off.
//   4. All writes in a single transaction; --dry-run performs every UPDATE and
//      the verification, then ROLLS BACK.
//   5. Verifies post-state inside the transaction: every expected facet tag
//      present, kind column equals the expected post-value per row, and EXACTLY
//      7 kind-column changes vs the original baseline — else rollback.
//
// Before running: (1) run add-topic-namespace.mjs; (2) stop MV so the write
// isn't blocked by "database is locked".
//
// Usage (from the museum repo root):
//   node tools/write-discovery-facets.mjs --dry-run     # rehearse, rollback
//   node tools/write-discovery-facets.mjs               # commit
//
//   --mv-db <path>      Explicit path to MV's SQLite file.
//   --mv-core <dir>     MV core dir (default C:\AI\Platform\MediaVault\core).
//   --source-ref <ref>  Git ref to read hunter_root.json from (default d482fd4).
//   --source-path <p>   Path of the snapshot within the repo
//                       (default src/data/exhibits/hunter_root.json).
//   --source-file <p>   Read the snapshot from this file instead of git
//                       (escape hatch; bypasses the d482fd4 guarantee).
//   --dry-run           Run every step (incl. UPDATEs); ROLLBACK before commit.
//   --verbose           Print per-artifact detail.
//   --help              Show this message.
//
// Exits 0 on a clean commit OR a clean dry-run rollback. Non-zero on any
// failure (backup, source load, validation, verification, write).
// ─────────────────────────────────────────────────────────────────────────────

import { copyFileSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, join, resolve } from "node:path";
import Database from "better-sqlite3";

const SCRIPT_NAME = "write-discovery-facets";
const DEFAULT_MV_CORE = "C:\\AI\\Platform\\MediaVault\\core";
const DEFAULT_SOURCE_REF = "d482fd4";
const DEFAULT_SOURCE_PATH = "src/data/exhibits/hunter_root.json";

// The Discovery facet namespaces to lift from the snapshot into MV tags.
// (topic needs its vocabulary row added first — see add-topic-namespace.mjs.)
const FACET_NAMESPACES = ["content_kind", "topic", "era", "format", "source"];

// MV's kind CHECK list — values OUTSIDE this set cannot live in the kind
// column and must stay as content_kind: tags (brief §4).
const KIND_CHECK = new Set([
  "performance", "release", "announcement", "studio", "candid", "interview", "fan",
]);

// ─── Locked resolution table (brief §2 / §3) ───────────────────────────────
// For each of the 22 artifacts: its current MV kind (expected pre-state, used
// for the self-check) and its resolution class.
//   OVERWRITE — set kind to the snapshot's content_kind value.
//   COEXIST   — kind unchanged; content_kind tag added (value not in CHECK).
//   EMPTY     — kind null; tag added.
//   AGREE     — kind already equals content_kind; tags added.
const RESOLUTION = {
  // 9 conflicts → 7 overwrite + 2 coexist
  "MV-HR-20260405-006": { expectKind: "candid",       class: "OVERWRITE" },
  "MV-HR-20260405-008": { expectKind: "announcement", class: "OVERWRITE" },
  "MV-HR-20260405-009": { expectKind: "candid",       class: "OVERWRITE" },
  "MV-HR-20260405-010": { expectKind: "announcement", class: "OVERWRITE" },
  "MV-HR-20260405-011": { expectKind: "candid",       class: "COEXIST"   }, // cover
  "MV-HR-20260405-012": { expectKind: "candid",       class: "COEXIST"   }, // press
  "MV-HR-20260405-014": { expectKind: "candid",       class: "OVERWRITE" },
  "MV-HR-20260405-015": { expectKind: "studio",       class: "OVERWRITE" },
  "MV-HR-20260405-038": { expectKind: "candid",       class: "OVERWRITE" },
  // 6 MV-empty
  "MV-HR-20260405-005": { expectKind: null, class: "EMPTY" },
  "MV-HR-20260416-001": { expectKind: null, class: "EMPTY" },
  "MV-HR-20260416-003": { expectKind: null, class: "EMPTY" },
  "MV-HR-20260416-005": { expectKind: null, class: "EMPTY" },
  "MV-HR-20260416-009": { expectKind: null, class: "EMPTY" },
  "MV-HR-20260416-011": { expectKind: null, class: "EMPTY" },
  // 7 agree
  "MV-HR-20260405-004": { expectKind: "announcement", class: "AGREE" },
  "MV-HR-20260405-007": { expectKind: "studio",       class: "AGREE" },
  "MV-HR-20260405-013": { expectKind: "candid",       class: "AGREE" },
  "MV-HR-20260405-034": { expectKind: "announcement", class: "AGREE" },
  "MV-HR-20260405-035": { expectKind: "candid",       class: "AGREE" },
  "MV-HR-20260405-037": { expectKind: "announcement", class: "AGREE" },
  "MV-HR-20260405-003": { expectKind: "candid",       class: "AGREE" },
};
const TARGET_IDS = Object.keys(RESOLUTION);
const EXPECTED_KIND_CHANGES = 7;

// ─── helpers ───────────────────────────────────────────────────────────────
function fail(msg) {
  process.stderr.write(`\n[${SCRIPT_NAME}] ERROR: ${msg}\n`);
  process.exit(2);
}

function printHelp() {
  process.stdout.write(
    [
      `${SCRIPT_NAME} — write Discovery facet tags + locked kind resolutions into MV.`,
      "",
      "Usage (from the museum repo root):",
      "  node tools/write-discovery-facets.mjs --dry-run",
      "  node tools/write-discovery-facets.mjs",
      "",
      "  --mv-db <path>      Explicit path to MV's SQLite file.",
      "  --mv-core <dir>     MV core dir (default C:\\AI\\Platform\\MediaVault\\core).",
      "  --source-ref <ref>  Git ref for hunter_root.json (default d482fd4).",
      "  --source-path <p>   Snapshot path in repo (default src/data/exhibits/hunter_root.json).",
      "  --source-file <p>   Read snapshot from a file instead of git (escape hatch).",
      "  --dry-run           Run every step (including UPDATEs); ROLLBACK before commit.",
      "  --verbose           Per-artifact detail.",
      "  --help              Show this message.",
      "",
    ].join("\n")
  );
}

function parseArgs(argv) {
  const opts = {
    mvDb: null, mvCore: DEFAULT_MV_CORE,
    sourceRef: DEFAULT_SOURCE_REF, sourcePath: DEFAULT_SOURCE_PATH, sourceFile: null,
    dryRun: false, verbose: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") { printHelp(); process.exit(0); }
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--verbose") opts.verbose = true;
    else if (a === "--mv-db") opts.mvDb = argv[++i];
    else if (a === "--mv-core") opts.mvCore = argv[++i];
    else if (a === "--source-ref") opts.sourceRef = argv[++i];
    else if (a === "--source-path") opts.sourcePath = argv[++i];
    else if (a === "--source-file") opts.sourceFile = argv[++i];
    else fail(`unknown argument: ${a} (try --help)`);
  }
  return opts;
}

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

function backupSqlite(dbPath) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const bak = `${dbPath}.bak_${stamp}`;
  copyFileSync(dbPath, bak);
  return bak;
}

// Load the snapshot JSON: from git (default, the d482fd4 guarantee) or a file.
function loadSnapshot(opts) {
  let raw;
  if (opts.sourceFile) {
    const p = resolve(opts.sourceFile);
    if (!existsSync(p)) fail(`--source-file not found: ${p}`);
    raw = readFileSync(p, "utf8");
    process.stdout.write(`  source: file ${p} (escape hatch; NOT the d482fd4 guarantee)\n`);
  } else {
    try {
      raw = execFileSync("git", ["show", `${opts.sourceRef}:${opts.sourcePath}`],
        { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    } catch (e) {
      fail(`git show ${opts.sourceRef}:${opts.sourcePath} failed: ${e.message}\n` +
           `  Run from the museum repo root, or pass --source-file.`);
    }
    process.stdout.write(`  source: git ${opts.sourceRef}:${opts.sourcePath}\n`);
  }
  let data;
  try { data = JSON.parse(raw); }
  catch (e) { fail(`snapshot JSON did not parse: ${e.message}`); }
  return data;
}

// Flatten artifacts (recurse children, just in case the snapshot nests them).
function flattenArtifacts(data) {
  const out = [];
  const visit = (a) => { out.push(a); (a.children || []).forEach(visit); };
  (data.artifacts || []).forEach(visit);
  return out;
}

// Build the set of "namespace:value" facet tags for one snapshot leaf.
function facetTagsFor(leaf) {
  const tags = [];
  const t = leaf.tags || {};
  for (const ns of FACET_NAMESPACES) {
    const vals = t[ns];
    if (!Array.isArray(vals)) continue;
    for (const v of vals) {
      if (v == null || `${v}`.length === 0) continue;
      tags.push(`${ns}:${v}`);
    }
  }
  return tags;
}

// ─── main ──────────────────────────────────────────────────────────────────
function main() {
  const opts = parseArgs(process.argv.slice(2));
  const dbPath = resolveDbPath(opts);
  process.stdout.write(`[${SCRIPT_NAME}] MV DB: ${dbPath}\n`);
  if (opts.dryRun) process.stdout.write(`[${SCRIPT_NAME}] DRY RUN — will ROLLBACK, no commit.\n`);

  // ── STEP 1 — load + flatten the committed snapshot ─────────────────────────
  process.stdout.write(`STEP 1 — load committed snapshot\n`);
  const snapshot = loadSnapshot(opts);
  const leaves = flattenArtifacts(snapshot);
  const byId = new Map(leaves.map((l) => [l.id, l]));

  // Build the per-artifact write plan from the snapshot + resolution table.
  const plan = [];
  for (const id of TARGET_IDS) {
    const leaf = byId.get(id);
    if (!leaf) fail(`artifact ${id} not found in snapshot ${opts.sourceRef}.`);
    const res = RESOLUTION[id];
    const facetTags = facetTagsFor(leaf);
    const ck = (leaf.tags && leaf.tags.content_kind && leaf.tags.content_kind[0]) || null;
    if (!ck) fail(`artifact ${id} has no content_kind in snapshot — cannot resolve kind.`);
    plan.push({ id, res, facetTags, contentKind: ck });
  }

  // ── STEP 2 — backup ────────────────────────────────────────────────────────
  process.stdout.write(`STEP 2 — backup\n`);
  let bak;
  try { bak = backupSqlite(dbPath); }
  catch (e) { fail(`backup failed: ${e.message}\nRefusing to proceed without a backup.`); }
  process.stdout.write(`  backup → ${basename(bak)} (${statSync(bak).size} bytes)\n`);

  const db = new Database(dbPath, { fileMustExist: true });
  db.pragma("foreign_keys = ON");

  try {
    // ── STEP 3 — validate every assumption BEFORE any write ──────────────────
    process.stdout.write(`STEP 3 — validate against live MV (no writes yet)\n`);
    const selRow = db.prepare(`SELECT id, kind, tags FROM artifacts WHERE id = ?`);
    const problems = [];

    // Warn (don't abort) if the topic vocabulary row is missing.
    const topicVocab = db.prepare(`SELECT 1 FROM vocabulary WHERE namespace = 'topic'`).get();
    if (!topicVocab) {
      process.stdout.write(
        `  WARNING: vocabulary has no 'topic' namespace. topic: tags will be written\n` +
        `           but won't render as a tiered facet until add-topic-namespace.mjs runs.\n`
      );
    }

    for (const p of plan) {
      const row = selRow.get(p.id);
      if (!row) { problems.push(`${p.id}: not present in MV.`); continue; }

      const cur = row.kind ?? null;

      // (a/b) class-specific invariants + acceptable pre-state. The accepted
      // pre-state is idempotent-safe: a successfully-committed run leaves the
      // OVERWRITE rows at the target value, so a re-run must treat the target
      // as a valid (already-applied) starting point, not as drift.
      if (p.res.class === "OVERWRITE") {
        if (!KIND_CHECK.has(p.contentKind))
          problems.push(`${p.id}: OVERWRITE target '${p.contentKind}' is not in the kind CHECK list.`);
        if (p.contentKind === p.res.expectKind)
          problems.push(`${p.id}: OVERWRITE target '${p.contentKind}' equals the expected pre-state (brief inconsistency — nothing to overwrite).`);
        if (cur !== p.res.expectKind && cur !== p.contentKind)
          problems.push(`${p.id}: MV kind is ${JSON.stringify(cur)}, expected ${JSON.stringify(p.res.expectKind)} or already-applied ${JSON.stringify(p.contentKind)} (drift).`);
      } else {
        if (cur !== p.res.expectKind)
          problems.push(`${p.id}: MV kind is ${JSON.stringify(cur)}, brief expected ${JSON.stringify(p.res.expectKind)} (drift).`);
        if (p.res.class === "COEXIST") {
          if (KIND_CHECK.has(p.contentKind))
            problems.push(`${p.id}: COEXIST target '${p.contentKind}' IS in the CHECK list — should it overwrite instead?`);
        } else if (p.res.class === "AGREE") {
          if (p.contentKind !== cur)
            problems.push(`${p.id}: AGREE but content_kind '${p.contentKind}' != current kind ${JSON.stringify(cur)}.`);
        } else if (p.res.class === "EMPTY") {
          if (cur !== null)
            problems.push(`${p.id}: EMPTY but current kind is ${JSON.stringify(cur)} (not null).`);
        }
      }

      // (c) existing tags parse as an array.
      try {
        const arr = JSON.parse(row.tags || "[]");
        if (!Array.isArray(arr)) problems.push(`${p.id}: tags column is not a JSON array.`);
      } catch { problems.push(`${p.id}: tags column is not valid JSON.`); }
    }

    if (problems.length) {
      fail(`validation failed (${problems.length}); no changes attempted:\n` +
           problems.map((s) => `    - ${s}`).join("\n") +
           `\n  Backup preserved at: ${bak}`);
    }
    process.stdout.write(`  all ${plan.length} artifacts validated against the brief.\n`);

    // ── STEP 4 — apply (single transaction) ──────────────────────────────────
    process.stdout.write(`STEP 4 — apply (single transaction)\n`);
    const updTags = db.prepare(`UPDATE artifacts SET tags = ?, updated_at = ? WHERE id = ?`);
    const updKind = db.prepare(`UPDATE artifacts SET kind = ?, updated_at = ? WHERE id = ?`);
    const ROLLBACK = Symbol("dry-run-rollback");

    const tx = db.transaction(() => {
      const now = new Date().toISOString();
      let kindChanges = 0;
      let tagAdds = 0;

      for (const p of plan) {
        const row = selRow.get(p.id);
        const existing = JSON.parse(row.tags || "[]");
        const have = new Set(existing);
        const toAdd = p.facetTags.filter((t) => !have.has(t));
        if (toAdd.length) {
          const merged = [...new Set([...existing, ...toAdd])].sort(); // deterministic
          updTags.run(JSON.stringify(merged), now, p.id);
          tagAdds += toAdd.length;
        }
        let kindNote = "";
        if (p.res.class === "OVERWRITE") {
          const cur = row.kind ?? null;
          if (cur !== p.contentKind) {
            updKind.run(p.contentKind, now, p.id);
            kindChanges++;
            kindNote = ` kind:${cur}→${p.contentKind}`;
          } else {
            kindNote = ` kind:${p.contentKind} (already applied)`;
          }
        }
        if (opts.verbose) {
          process.stdout.write(`    ${p.id} [${p.res.class}] +tags:[${toAdd.join(", ") || "—"}]${kindNote}\n`);
        }
      }
      process.stdout.write(`  applied: ${kindChanges} kind overwrites, ${tagAdds} tag additions.\n`);

      // ── STEP 5 — verify post-state (still inside the transaction) ───────────
      process.stdout.write(`STEP 5 — verify post-state\n`);
      const verr = [];
      let kindChangedRows = 0;
      for (const p of plan) {
        const row = selRow.get(p.id);
        const arr = JSON.parse(row.tags || "[]");
        const set = new Set(arr);
        for (const t of p.facetTags) if (!set.has(t)) verr.push(`${p.id}: missing tag '${t}'`);

        const expectKindAfter = p.res.class === "OVERWRITE" ? p.contentKind : p.res.expectKind;
        const got = row.kind ?? null;
        if (got !== expectKindAfter)
          verr.push(`${p.id}: kind is ${JSON.stringify(got)}, expected ${JSON.stringify(expectKindAfter)}`);
        if ((row.kind ?? null) !== p.res.expectKind) kindChangedRows++;
      }
      if (kindChangedRows !== EXPECTED_KIND_CHANGES)
        verr.push(`kind column changed on ${kindChangedRows} rows, expected exactly ${EXPECTED_KIND_CHANGES}`);
      if (verr.length) throw new Error(`verification failed:\n` + verr.map((s) => `    - ${s}`).join("\n"));
      process.stdout.write(`  verified: facet tags present on all ${plan.length}; kind differs from baseline on exactly ${kindChangedRows}.\n`);

      if (opts.dryRun) throw ROLLBACK;
    });

    try {
      tx();
      process.stdout.write(`STEP 6 — committed.\n[${SCRIPT_NAME}] DONE.\n`);
      process.stdout.write(`  Next (brief §6 step 4): npm run export-artifacts, then read-only diff vs ${opts.sourceRef}.\n`);
    } catch (e) {
      if (e === ROLLBACK) {
        process.stdout.write(`STEP 6 — DRY RUN rolled back. No changes written.\n[${SCRIPT_NAME}] DRY RUN OK.\n`);
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
