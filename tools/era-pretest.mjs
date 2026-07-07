#!/usr/bin/env node
// ─── era-pretest.mjs ────────────────────────────────────────────────────────
// Derived-Era v0.2 · Step 8 (PRE-TEST GATE). Authority: docs/derived-era-spec_v0.2.md
// §6 + §8 sequence step 3. NO push, NO deploy — this only reads the live MV and
// reports. Runs the full derive chain against MV with the EXACT code paths the
// build ships: deriveDates() from tools/era-derivation.mjs (export side) and
// deriveEraSlugs()/eraForRecord() from src/routes/hr/hr_era.js (client side).
//
// Reads MV via Node's built-in node:sqlite (no native better-sqlite3 needed),
// so it runs anywhere Node 22+ is present. The MV file is opened READ-ONLY.
//
// Usage: node --experimental-sqlite tools/era-pretest.mjs --mv-file <path> [--write-preview]
// ─────────────────────────────────────────────────────────────────────────────

import { DatabaseSync } from "node:sqlite";
import { writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEraConfig, deriveDates } from "./era-derivation.mjs";
import { deriveEraSlugs, eraForRecord, bucketSlugForYear, eraSlug, ERA_SLUGS, DEPTH, PUBLISH_WEIGHT }
  from "../src/routes/hr/hr_era.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..");

function parseArgs(argv) {
  const o = { mvFile: null, exhibit: "hunter_root", writePreview: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--mv-file") o.mvFile = argv[++i];
    else if (a === "--exhibit") o.exhibit = argv[++i];
    else if (a === "--write-preview") o.writePreview = true;
  }
  if (!o.mvFile) { process.stderr.write("era-pretest: --mv-file <path> required\n"); process.exit(2); }
  return o;
}

function tagsByNamespace(tagsJson) {
  let raw = [];
  try { const p = JSON.parse(tagsJson || "[]"); if (Array.isArray(p)) raw = p.filter(t => typeof t === "string"); }
  catch { /* ignore */ }
  const out = {};
  for (const t of raw) {
    const colon = t.indexOf(":");
    if (colon <= 0) continue;
    const ns = t.slice(0, colon), v = t.slice(colon + 1);
    if (!v) continue;
    (out[ns] || (out[ns] = [])).push(v);
  }
  for (const k of Object.keys(out)) out[k] = [...new Set(out[k])].sort();
  return out;
}

const LEAF_COLS = `a.id, a.tags, a.description_short, a.description_long, a.extracted_text,
  a.post_date, a.parent_artifact_id, a.referenced_dates`;

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const eraConfig = loadEraConfig(resolve(REPO_ROOT, "era-config.json"));
  const db = new DatabaseSync(resolve(opts.mvFile), { readOnly: true });

  // Top-level records badged for this exhibit (mirrors PER_EXHIBIT_SQL).
  const topRows = db.prepare(`SELECT ${LEAF_COLS} FROM artifacts a
    WHERE a.status='released' AND a.archived_at IS NULL AND a.parent_artifact_id IS NULL
      AND EXISTS (SELECT 1 FROM json_each(a.tags) WHERE json_each.value = ?)`).all(`exhibit:${opts.exhibit}`);
  const childStmt = db.prepare(`SELECT ${LEAF_COLS} FROM artifacts a
    WHERE a.status='released' AND a.archived_at IS NULL AND a.parent_artifact_id = ? ORDER BY a.id`);

  // Build the LEAF set exactly as the export does: top-level non-containers,
  // plus every child of an album/gallery container (containers themselves are
  // exempt). Each leaf gets its baked `dates` via the real deriveDates().
  const leaves = [];     // { id, tags, handEra, dates, parent, isChildAlbum }
  function addLeaf(row, isChildAlbum) {
    const tags = tagsByNamespace(row.tags);
    const ck = tags.card_kind ? tags.card_kind[0] : null;
    if (ck === "album" || ck === "gallery") return { container: ck, album: tags.album ? tags.album[0] : null };
    const { dates } = deriveDates(row, tags, eraConfig, { isChildAlbum: isChildAlbum ?? null });
    leaves.push({
      id: row.id,
      handEra: tags.era || [],          // legacy/hand era: tags (the oracle truth)
      dates,
      parent: row.parent_artifact_id,
    });
    return null;
  }
  for (const row of topRows) {
    const c = addLeaf(row, null);
    if (c && c.container) {
      const kids = childStmt.all(row.id);
      for (const k of kids) addLeaf(k, c.container === "album" ? c.album : null);
    }
  }

  // ─── 1. Underivable leaves (warning guard, §4/§6) ──────────────────────────
  const underivable = leaves.filter(l => l.dates.length === 0).map(l => l.id);

  // ─── 2. rwth fold: all era:rwth -> Early Days at shallow (§6) ──────────────
  const rwth = leaves.filter(l => l.handEra.includes("rwth"));
  const rwthBad = rwth.filter(l => {
    const e = deriveEraSlugs(l.dates, DEPTH.shallow);
    return !(e.length === 1 && e[0] === "the_band_years");
  });

  // ─── 3. CORRECTNESS PROOF: derive-at-shallow == the hand era: tags (§8) ────
  // hand 'rwth' folds to 'early_days'. Every other hand value should equal the
  // single shallow-derived bucket.
  // v2 (7-bucket re-rule 2026-07-07): hand era: tags were applied against the
  // RETIRED 5-bucket set. They remain the human-judgment oracle as YEAR
  // RANGES: a hand tag asserts the leaf belongs in its old bucket's years
  // (rwth = the 2016 album anchor). Proof: every shallow-surviving year falls
  // inside the union of the hand tags' old ranges, and each hand tag is
  // witnessed by at least one shallow year. The NEW bucket then follows from
  // the year. Contradictions are FLAGGED, never forced.
  const OLD_ERA_RANGES = {
    early_days: [2016, 2018], finding_the_sound: [2019, 2020],
    breakthrough: [2021, 2022], on_the_road: [2023, 2024],
    recent: [2025, 2025], rwth: [2016, 2016],
  };
  const shallowYears = (dates) => {
    if (!dates.length) return [];
    const maxw = Math.max(...dates.map(d => d.weight));
    const thr = DEPTH.shallow * PUBLISH_WEIGHT;
    return [...new Set(dates.filter(d => d.weight >= thr || d.weight === maxw).map(d => d.year))];
  };
  const handLeaves = leaves.filter(l => l.handEra.length > 0);
  const mismatches = [];
  const remap = new Map();  // "oldTag -> newBucket" counts, for the report
  for (const l of handLeaves) {
    const years = shallowYears(l.dates);
    const derived = deriveEraSlugs(l.dates, DEPTH.shallow);
    const unknown = l.handEra.filter(h => !OLD_ERA_RANGES[h]);
    const inSomeRange = (y) => l.handEra.some(h => OLD_ERA_RANGES[h] && y >= OLD_ERA_RANGES[h][0] && y <= OLD_ERA_RANGES[h][1]);
    const witnessed = (h) => OLD_ERA_RANGES[h] && years.some(y => y >= OLD_ERA_RANGES[h][0] && y <= OLD_ERA_RANGES[h][1]);
    if (unknown.length || !years.length || !years.every(inSomeRange) || !l.handEra.every(witnessed)) {
      mismatches.push({ id: l.id, hand: l.handEra, years, derived });
      continue;
    }
    for (const h of l.handEra) {
      const y = years.find(yy => yy >= OLD_ERA_RANGES[h][0] && yy <= OLD_ERA_RANGES[h][1]);
      const k = `${h} -> ${bucketSlugForYear(y)}`;
      remap.set(k, (remap.get(k) || 0) + 1);
    }
  }

  // ─── 4. Weight-spread histogram (§5) ───────────────────────────────────────
  const allW = [];
  for (const l of leaves) for (const d of l.dates) allW.push(d.weight);
  const BIN = 0.1;
  const bins = new Map();
  for (const w of allW) { const b = (Math.floor(w / BIN) * BIN).toFixed(1); bins.set(b, (bins.get(b) || 0) + 1); }
  const distinct = new Set(allW.map(w => w.toFixed(2))).size;

  // ─── 5. Filtered in-MV preview: era membership + counts per depth ──────────
  const depths = [["shallow", DEPTH.shallow], ["medium", DEPTH.medium], ["deep", DEPTH.deep]];
  const countsByDepth = {};
  for (const [name, c] of depths) {
    const counts = Object.fromEntries(ERA_SLUGS.map(s => [s, 0]));
    let multi = 0;
    for (const l of leaves) {
      const e = deriveEraSlugs(l.dates, c);
      if (e.length > 1) multi++;
      for (const s of e) counts[s] = (counts[s] || 0) + 1;
    }
    countsByDepth[name] = { counts, multiEraLeaves: multi };
  }

  // ─── 4b. Glide profile + multi-date (glide-relevant) histogram ─────────────
  // Sweep the cutoff and count total era memberships: a smooth glide spreads
  // the membership growth across many cutoff steps rather than all at once.
  const glide = [];
  for (let cut = 1.0; cut >= -1e-9; cut -= 0.1) {
    let total = 0;
    for (const l of leaves) total += deriveEraSlugs(l.dates, Math.max(0, cut)).length;
    glide.push([cut.toFixed(1), total]);
  }
  // Reference weights ON multi-date leaves only (the population the slider acts
  // on — single-date leaves are inert: their lone date always survives).
  const multiW = [];
  for (const l of leaves) if (l.dates.length > 1) for (const d of l.dates) if (d.role !== "publish") multiW.push(d.weight);
  const mbins = new Map();
  for (const w of multiW) { const b = (Math.floor(w / BIN) * BIN).toFixed(1); mbins.set(b, (mbins.get(b) || 0) + 1); }

  // ─── REPORT ────────────────────────────────────────────────────────────────
  const L = [];
  const P = (s = "") => L.push(s);
  P("════════════════════════════════════════════════════════════════════");
  P(` Derived-Era v0.2 — PRE-TEST GATE   (exhibit: ${opts.exhibit})`);
  P(`   MV: ${opts.mvFile}`);
  P("════════════════════════════════════════════════════════════════════");
  P(`Leaves evaluated: ${leaves.length}  (top-level + album/gallery children; containers exempt)`);
  P("");
  P("── CORRECTNESS PROOF v2 (shallow-derived years honor the hand era: tags' old ranges) ──");
  P(`  Hand-tagged leaves checked: ${handLeaves.length}   Flagged (no clean map): ${mismatches.length}`);
  if (mismatches.length) {
    for (const m of mismatches) P(`    FLAG ${m.id}: hand=${JSON.stringify(m.hand)} shallowYears=${JSON.stringify(m.years)} derivedNew=${JSON.stringify(m.derived)}`);
  } else {
    P("  ✓ 0 flags — every hand tag remaps cleanly to the 7-bucket set.");
  }
  P("  Remap (old hand tag -> new bucket · leaf count):");
  for (const [k, n] of [...remap.entries()].sort()) P(`    ${k} · ${n}`);
  P("");
  P("── rwth fold (era:rwth → The Band Years, re-rule 2026-07-07) ──");
  P(`  era:rwth leaves: ${rwth.length}   not folding to the_band_years: ${rwthBad.length}`);
  if (rwthBad.length) for (const l of rwthBad) P(`    BAD ${l.id} -> ${JSON.stringify(deriveEraSlugs(l.dates, DEPTH.shallow))}`);
  else P("  ✓ all era:rwth leaves derive to ['the_band_years'] at shallow.");
  P("");
  P("── Underivable leaves (no derivable date; era is hard-required) ──");
  P(`  Count: ${underivable.length}   ${underivable.length ? "" : "(spec §6 expected 2 — see report note)"}`);
  for (const id of underivable) P(`    - ${id}`);
  P("");
  P(`── Weight-spread histogram  (n=${allW.length}, ${distinct} distinct values, range ${Math.min(...allW).toFixed(2)}-${Math.max(...allW).toFixed(2)}) ──`);
  for (let b = 0; b <= 2.0 + 1e-9; b += BIN) {
    const key = b.toFixed(1); const n = bins.get(key) || 0; if (!n) continue;
    P(`  ${key}-${(b + BIN).toFixed(1)}  ${"#".repeat(Math.min(70, n))} ${n}`);
  }
  P("");
  P(`── Glide profile (total era memberships as cutoff sweeps 1.0 -> 0.0) ──`);
  P("  " + glide.map(([c, t]) => `${c}:${t}`).join("  "));
  P("");
  P(`── Reference weights on multi-date leaves only (slider-active population, n=${multiW.length}) ──`);
  for (let b = 0; b <= 1.9 + 1e-9; b += BIN) {
    const key = b.toFixed(1); const n = mbins.get(key) || 0; if (!n) continue;
    P(`  ${key}-${(b + BIN).toFixed(1)}  ${"#".repeat(Math.min(60, n))} ${n}`);
  }
  P("");
  P("── Filtered preview: era membership counts per slider depth ──");
  P(`  bucket order: ${ERA_SLUGS.join(", ")}`);
  for (const [name] of depths) {
    const d = countsByDepth[name];
    P(`  ${name.padEnd(8)} cutoff=${DEPTH[name]}  counts=${JSON.stringify(d.counts)}  multi-era leaves=${d.multiEraLeaves}`);
  }
  P("");
  process.stdout.write(L.join("\n") + "\n");

  if (opts.writePreview) {
    const preview = {
      generated_at: new Date().toISOString(),
      exhibit: opts.exhibit,
      note: "Derived-Era v0.2 pre-test preview. NOT a deploy artifact. era_by_depth uses hr_era.deriveEraSlugs.",
      bucket_order: ERA_SLUGS,
      summary: {
        leaves: leaves.length,
        hand_leaves: handLeaves.length,
        mismatches: mismatches.length,
        rwth: rwth.length,
        underivable: underivable.length,
        weight_distinct_values: distinct,
      },
      counts_by_depth: countsByDepth,
      leaves: leaves.map(l => ({
        id: l.id,
        hand_era: l.handEra,
        dates: l.dates,
        era_shallow: deriveEraSlugs(l.dates, DEPTH.shallow),
        era_medium: deriveEraSlugs(l.dates, DEPTH.medium),
        era_deep: deriveEraSlugs(l.dates, DEPTH.deep),
      })),
    };
    const outPath = join(REPO_ROOT, "docs", "derived-era-pretest-preview.json");
    writeFileSync(outPath, JSON.stringify(preview, null, 2) + "\n");
    process.stdout.write(`Preview written: ${outPath}\n`);
  }

  db.close();
  const ok = mismatches.length === 0 && rwthBad.length === 0;
  return ok ? 0 : 1;
}

process.exit(main());
