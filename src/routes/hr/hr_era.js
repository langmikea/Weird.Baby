// ─── hr_era — derive era buckets from a record's weighted date-set ──────────
// Derived-Era v0.2 · Step 6 (client). Authority: docs/derived-era-spec_v0.2.md
// §3.2, §4.2, §5, §6.
//
// The export bakes a weighted, year-normalized `dates` set per leaf and does
// NOT bake an era label. This module maps that set -> era bucket slugs at read
// time, gated by the depth-slider cutoff. It is the ONLY place dates become
// eras, and it is imported both by the deck (HrExhibitFlow.jsx) and by the
// Ops pre-test harness (tools/era-pretest.mjs) so derivation is proven against
// the live MV with the exact code the client runs.
//
// Bucket ranges come from the committed era-buckets.json (§3.2) — the one file
// Mike edits per revision. Editing it remaps eras with no artifact recompute.
// ─────────────────────────────────────────────────────────────────────────────

import BUCKETS_CONFIG from "../../data/era-buckets.json" with { type: "json" };

// The buckets, in canonical (chronological) order as committed.
export const ERA_BUCKETS = Array.isArray(BUCKETS_CONFIG && BUCKETS_CONFIG.buckets)
  ? BUCKETS_CONFIG.buckets : [];

// Label -> slug. Lowercase, runs of non-alphanumerics -> single underscore.
// "Early Days" -> "early_days", "On the Road" -> "on_the_road". This matches
// the existing MV era: slug convention exactly (so derived eras are tag-equal
// to any legacy/curated era values and flow through matchFilter unchanged).
export function eraSlug(label) {
  return String(label).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

// Era slugs in bucket order — the stable pill set for the Era column.
export const ERA_SLUGS = ERA_BUCKETS.map(b => eraSlug(b.label));

// Date-led display labels for era pills (gate ruling 2026-07-07): slug ->
// "<year range> · <soft descriptor>", sourced from the bucket config's
// optional `display` (fallback: "<years> · <label>"). DISPLAY ONLY — slugs,
// derivation, weights and overrides untouched. A bucket revision that moves
// the bounds updates the visible years in era-buckets.json alone.
export const ERA_DISPLAY = Object.fromEntries(ERA_BUCKETS.map(b => [
  eraSlug(b.label),
  b.display || `${b.start === b.end ? b.start : `${b.start}–${b.end}`} · ${b.label}`,
]));

// Map a year to its bucket slug (or null if outside every range).
export function bucketSlugForYear(year) {
  if (typeof year !== "number" || !Number.isFinite(year)) return null;
  for (const b of ERA_BUCKETS) {
    if (year >= b.start && year <= b.end) return eraSlug(b.label);
  }
  return null;
}

// The publish anchor's weight, mirrored from tools/era-derivation.mjs
// CENTRALITY.publishWeight. It is the heaviest possible weight, so the cutoff
// travels from 0 (keep everything) up to PUBLISH_WEIGHT (keep only the publish
// anchor). KEEP IN SYNC with the export if that constant ever changes.
export const PUBLISH_WEIGHT = 2.0;

// ─── deriveEraSlugs — the slider-gated dates -> era mapping (§4.2, §5) ───────
// cutoff in [0,1] (0 = bottom of travel = all referenced eras; 1 = top = publish
// era only). threshold = cutoff * PUBLISH_WEIGHT. A date survives if its weight
// is at or above the threshold OR it is the heaviest date present — the latter
// guarantees at least one era always survives (era is hard-required on leaves;
// it also carries the no-post_date rwth case, whose album anchor is the max).
// Surviving years map through era-buckets.json; duplicates collapse.
export function deriveEraSlugs(dates, cutoff) {
  if (!Array.isArray(dates) || dates.length === 0) return [];
  const c = Math.max(0, Math.min(1, typeof cutoff === "number" ? cutoff : 0.5));
  const threshold = c * PUBLISH_WEIGHT;
  let maxw = -Infinity;
  for (const d of dates) if (typeof d.weight === "number" && d.weight > maxw) maxw = d.weight;
  const out = [];
  for (const d of dates) {
    if (d.weight >= threshold || d.weight === maxw) {
      const s = bucketSlugForYear(d.year);
      if (s && !out.includes(s)) out.push(s);
    }
  }
  // keep bucket (chronological) order for stable rendering
  return ERA_SLUGS.filter(s => out.includes(s));
}

// ─── eraForRecord — curation-is-king wrapper (§6) ───────────────────────────
// A durable curator override (record.era_override, sourced from the
// referenced_dates column) wins outright; otherwise era is derived from the
// weighted date-set at the current cutoff.
export function eraForRecord(record, cutoff) {
  if (!record) return [];
  // 1. durable curator override wins (curation-is-king).
  if (Array.isArray(record.era_override) && record.era_override.length) {
    return record.era_override.slice();
  }
  // 2. derive from the weighted date-set when the export has baked it.
  if (Array.isArray(record.dates) && record.dates.length) {
    return deriveEraSlugs(record.dates, cutoff);
  }
  // 3. legacy fallback: a pre-v0.2 export baked tags.era directly. Keeps the
  //    deck working before Mike re-runs the export to bake `dates` (the slider
  //    is simply inert for such records until then).
  if (record.tags && Array.isArray(record.tags.era) && record.tags.era.length) {
    return record.tags.era.slice();
  }
  return [];
}

// Convenience: depth presets as cutoff values (regions of the one axis, §5).
export const DEPTH = { shallow: 1.0, medium: 0.5, deep: 0.0 };
