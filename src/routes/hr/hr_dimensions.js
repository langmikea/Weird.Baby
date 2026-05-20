// ─── hr_dimensions — pill columns derived from artifact tag namespaces ──────
// Phase v5-3 + v5-4. Per docs/archive/SPEC_DRAFT_v5.md §4.4 and
// SPEC_DRAFT_v5_2.md §3.
//
// Before v5: this file declared the deck's pill columns statically — locked
// HR_ERA_OPTIONS, mirrored HR_ALBUM_OPTIONS / HR_SONG_OPTIONS from the spine,
// hardcoded HR_TYPE_OPTIONS / HR_SRC_OPTIONS, plus DEEP_DIMENSIONS built from
// docs/deep-dive-vocabulary.csv at prebuild time. Card data carried fields
// directly on the card object (card.era, card.type, card.src) and filter
// pills mirrored those fields.
//
// v5: under strict tag equality (v5 §3, v5.2 §3), every tag namespace the
// operator uses in MediaVault becomes a pill column on the museum. The
// vocabulary CSV is ordering/labeling guidance only. The artifact records
// the deck consumes (one per row in src/data/exhibits/<name>.json) carry
// their tags grouped by namespace, e.g. tags.mood = ["snarky", "wistful"].
//
// This module exports buildDimensions(artifacts) — the deck calls it once at
// module-load with the exhibit's artifact array and gets back the
// HR_DIMENSIONS / HR_GROUP_LABELS / displayFor structures it consumes.
//
// The `exhibit:` namespace is explicitly excluded from dimension discovery:
// it's a routing tag, not a content tag (v5.2 §3). The deck strips it before
// passing artifacts here? No — buildDimensions itself skips that namespace
// so artifact records can keep tags.exhibit in memory for any routing-layer
// use without it leaking into pill columns.
//
// Source-of-truth refactor Phase 1.2 (2026-05-19): tier-by-namespace and
// per-namespace display names are no longer hardcoded here. They are read
// from the committed src/data/vocabulary.json registry — emitted from the MV
// `vocabulary` table by tools/export-artifacts.mjs (Phase 1.1). The site
// build never contacts MV (§0.5 of DATA_ARCHITECTURE_SPEC_v2.1-target.md);
// the static import below is satisfied at build time from the committed JSON.
// Closes Criterion 7 OPEN ITEM: tier source is now the registry, not a
// hand-maintained const.
// ─────────────────────────────────────────────────────────────────────────────

import VOCABULARY from "../../data/vocabulary.json";

// ─── slugify — preserved utility ────────────────────────────────────────────
// Lowercase, strip apostrophes, collapse non-alphanumerics to single hyphens.
// Not currently consumed inside this module but exported for parity with the
// pre-v5 surface area, since the v28-derived display logic in callers may
// still want a stable slug shape.
export function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/['’]/g, "")          // straight + curly apostrophes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Registry (from src/data/vocabulary.json, committed) ────────────────────
// Shape (per Phase 1.1 export schema): { metadata, namespaces: [...] } where
// each namespace row carries { namespace, display_name, tier, sort_order,
// retired_at }. We collapse it into a per-namespace lookup at module load,
// plus a Set of retired namespaces for fast filter.
//
// Retired-namespace handling (Criterion 4 / brief §9.3 Q3): rows where
// retired_at IS NOT NULL are dropped from rendered pill columns. The
// operator promotes a namespace to visible by clearing retired_at in MV
// and re-running `npm run export-artifacts`.
//
// Tier fallback: per docs/CANONICAL_VOCABULARY.md §1.1 ("every other
// namespace → Tier 3 DEEP DIVE"), a namespace not present in the registry
// falls through to tier 3. The registry is descriptive, never gating
// (DATA_ARCHITECTURE_SPEC_v2.1-target.md §3.4): an artifact may carry a
// namespace that isn't in the registry — it's just rendered with the
// catch-all tier and a prettified label.
const REGISTRY = Object.create(null);
const RETIRED_NAMESPACES = new Set();
for (const row of (VOCABULARY?.namespaces ?? [])) {
  if (!row || typeof row.namespace !== "string") continue;
  REGISTRY[row.namespace] = {
    tier: typeof row.tier === "number" ? row.tier : null,
    sort_order: typeof row.sort_order === "number" ? row.sort_order : null,
    display_name: typeof row.display_name === "string" ? row.display_name : null,
    retired_at: row.retired_at ?? null,
  };
  if (row.retired_at) RETIRED_NAMESPACES.add(row.namespace);
}

function tierForNamespace(ns) {
  const tier = REGISTRY[ns]?.tier;
  return typeof tier === "number" ? tier : 3;
}

// ─── Display name derivation ────────────────────────────────────────────────
// Per v5.2 §3: human-readable labels come from a lookup that maps slugs to
// display names. Group labels (pill-column headers) come from the registry
// (`display_name`) when present, falling back to prettify(slug). Value
// labels within a column have no registry entry today, so they always go
// through prettify(slug): `hunter_root` → "Hunter Root"; `pink-hats` →
// "Pink Hats"; `content_kind` → "Content Kind".
function prettify(s) {
  return String(s)
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(w => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function displayNameForNamespace(ns) {
  return REGISTRY[ns]?.display_name ?? prettify(ns);
}

// ─── buildDimensions — the only public surface besides slugify ──────────────
// Walks every artifact's tags object, collects the union of namespaces (minus
// `exhibit` and any namespace with retired_at set in the registry), and for
// each namespace collects the union of values present in the artifact set.
// Returns the structures the deck consumes:
//
//   HR_DIMENSIONS    — array of { key, kind, tier, options, values }.
//                      `kind` is always "multi" under v5 because every
//                      artifact's tags[ns] is an array (a single value just
//                      lives in a one-element array).
//   HR_GROUP_LABELS  — { [namespace]: "Display Label" }.
//   displayFor       — (group, slug) => display label, falling through to
//                      prettify(slug) when no mapping exists.
//
// Stable ordering: namespaces sorted alphabetically; values within each
// namespace sorted alphabetically. The same artifact set produces the same
// dimensions across runs.
export function buildDimensions(artifacts) {
  const valuesByNamespace = Object.create(null);

  for (const a of (artifacts || [])) {
    if (!a || typeof a.tags !== "object" || a.tags === null) continue;
    for (const ns of Object.keys(a.tags)) {
      // v5.2 §3: routing-only namespace. Lives on the artifact record for
      // routing-layer use but never becomes a pill column.
      if (ns === "exhibit") continue;
      // Phase 1.2 (brief §9.3 Q3): registry rows with retired_at IS NOT
      // NULL drop from rendered pill columns. Operator un-retires by
      // clearing retired_at in MV and re-running the export.
      if (RETIRED_NAMESPACES.has(ns)) continue;
      const vs = a.tags[ns];
      if (!Array.isArray(vs)) continue;
      const seen = valuesByNamespace[ns] || (valuesByNamespace[ns] = new Set());
      for (const v of vs) {
        if (typeof v === "string" && v.length > 0) seen.add(v);
      }
    }
  }

  const namespaces = Object.keys(valuesByNamespace).sort();

  const dimensions = namespaces.map(ns => {
    const slugs = [...valuesByNamespace[ns]].sort();
    const options = slugs.map(slug => ({ slug, label: prettify(slug) }));
    return {
      key: ns,
      kind: "multi",
      tier: tierForNamespace(ns),
      options,
      values: slugs,
    };
  });

  const groupLabels = Object.fromEntries(
    namespaces.map(ns => [ns, displayNameForNamespace(ns)])
  );

  const labelTable = Object.fromEntries(
    dimensions.map(d => [d.key, Object.fromEntries(d.options.map(o => [o.slug, o.label]))])
  );

  function displayFor(group, slug) {
    return labelTable[group]?.[slug] ?? prettify(slug);
  }

  return {
    HR_DIMENSIONS: dimensions,
    HR_GROUP_LABELS: groupLabels,
    displayFor,
  };
}
