#!/usr/bin/env node
// ─── era-export-verify.mjs ──────────────────────────────────────────────────
// Derived-Era re-wire Stage 3 verification (DERIVED_ERA_REWIRE-20260707).
// Compares the freshly exported src/data/exhibits/hunter_root.json against
// the pretest oracle docs/derived-era-pretest-preview.json (regenerated in
// the same Stage 3 run by tools/era-pretest.mjs --write-preview, so both
// derive from the same live-MV state).
//
// Per the brief: the pretest report is the oracle — divergence = STOP.
// Checks, per exported leaf (top-level non-containers, gallery items, album
// track heads):
//   1. No baked tags.era anywhere (era derives client-side now).
//   2. dates[] present and EXACTLY equal to the oracle's dates for that id.
//   3. deriveEraSlugs(dates, depth) equals the oracle's era_shallow /
//      era_medium / era_deep for that id — using the same hr_era.js the
//      client ships.
//   4. Containers carry neither tags.era nor dates.
//   5. No leaf ships with an empty date-set (era is hard-required, spec §6).
// Exits 0 on PASS, 1 on any divergence (each divergence printed).
//
// Usage: node tools/era-export-verify.mjs
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deriveEraSlugs, DEPTH } from "../src/routes/hr/hr_era.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const exhibit = JSON.parse(readFileSync(resolve(ROOT, "src/data/exhibits/hunter_root.json"), "utf8"));
const preview = JSON.parse(readFileSync(resolve(ROOT, "docs/derived-era-pretest-preview.json"), "utf8"));

const oracle = new Map((preview.leaves || []).map(l => [l.id, l]));
const fails = [];

// Collect exported leaves. Album tracks GROUP several MV children under one
// head (variants) and exclude the cover child, so the exported leaf set is a
// strict SUBSET of the oracle's 187 DB leaves — every exported leaf must still
// match its oracle row exactly.
const leaves = [];
const containers = [];
for (const a of (exhibit.artifacts || [])) {
  if (a.card_kind === "gallery") {
    containers.push(a);
    for (const g of (a.gallery || [])) leaves.push(g);
    continue;
  }
  if (a.card_kind === "album") {
    containers.push(a);
    for (const t of (a.tracks || [])) leaves.push(t);
    continue;
  }
  leaves.push(a);
}

let checked = 0;
const mediumCounts = Object.create(null);
for (const l of leaves) {
  if (l.tags && l.tags.era) fails.push(`${l.id}: baked tags.era still present: ${JSON.stringify(l.tags.era)}`);
  if (!Array.isArray(l.dates)) { fails.push(`${l.id}: no dates[] baked`); continue; }
  if (l.dates.length === 0) fails.push(`${l.id}: EMPTY date-set (underivable leaf shipped era-less)`);
  const o = oracle.get(l.id);
  if (!o) { fails.push(`${l.id}: not present in pretest oracle`); continue; }
  checked++;
  const gotDates = JSON.stringify(l.dates);
  const wantDates = JSON.stringify(o.dates);
  if (gotDates !== wantDates) fails.push(`${l.id}: dates differ\n    got  ${gotDates}\n    want ${wantDates}`);
  for (const [field, cut] of [["era_shallow", DEPTH.shallow], ["era_medium", DEPTH.medium], ["era_deep", DEPTH.deep]]) {
    const got = JSON.stringify(deriveEraSlugs(l.dates, cut));
    const want = JSON.stringify(o[field] || []);
    if (got !== want) fails.push(`${l.id} ${field}: got ${got} want ${want}`);
  }
  for (const s of deriveEraSlugs(l.dates, DEPTH.medium)) mediumCounts[s] = (mediumCounts[s] || 0) + 1;
}

for (const c of containers) {
  if (c.tags && c.tags.era) fails.push(`${c.id}: CONTAINER carries tags.era (containers are era-exempt)`);
  if (c.dates) fails.push(`${c.id}: CONTAINER carries dates (containers are era-exempt)`);
}

if (checked === 0) fails.push("0 leaves checked — export or oracle empty; refusing to pass vacuously");

const out = [];
out.push("════════════════════════════════════════════════════════════════");
out.push(" Derived-Era re-wire — EXPORT vs PRETEST-ORACLE VERIFICATION");
out.push("════════════════════════════════════════════════════════════════");
out.push(`Exported leaves found: ${leaves.length} (top-level + gallery items + album track heads)`);
out.push(`Oracle leaves: ${oracle.size} (exported set is a subset: track grouping + album cover children)`);
out.push(`Leaves checked against oracle: ${checked}`);
out.push(`Containers checked era-exempt: ${containers.length}`);
out.push(`Era membership counts at FIXED depth 0.5 (medium), exported top-level+nested leaves: ${JSON.stringify(mediumCounts)}`);
out.push(`Metadata derived_era: ${exhibit.metadata && exhibit.metadata.derived_era ? "present" : "MISSING"}`);
if (!(exhibit.metadata && exhibit.metadata.derived_era)) fails.push("metadata.derived_era missing from export");
out.push("");
if (fails.length) {
  out.push(`RESULT: FAIL — ${fails.length} divergence(s). Per the brief this is a STOP, not a shrug.`);
  for (const f of fails) out.push(`  ✗ ${f}`);
} else {
  out.push("RESULT: PASS — every exported leaf matches the pretest oracle exactly; no baked era anywhere; containers exempt.");
}
process.stdout.write(out.join("\n") + "\n");
process.exit(fails.length ? 1 : 0);
// EOF-SENTINEL: era-export-verify.mjs v1 — if this line is missing, the file is truncated; do not run.
