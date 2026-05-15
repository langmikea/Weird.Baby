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
// ─────────────────────────────────────────────────────────────────────────────

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

// Tier assignments locked by docs/CANONICAL_VOCABULARY.md. Do not add namespaces
// here without updating canonical first — vocabulary inventions are a known
// Ops failure mode.
const TIER_BY_NAMESPACE = {
  year: 1, album: 1, song: 1, venue: 1, people: 1,
  source: 2, type: 2,
};

function tierForNamespace(ns) {
  return TIER_BY_NAMESPACE[ns] ?? 3;
}

// ─── Display name derivation ────────────────────────────────────────────────
// Per v5.2 §3: human-readable labels come from a lookup that maps slugs to
// display names. v5.2 leaves the storage shape for the lookup to Phase v5-4;
// for the first pass we derive labels by simple transformation — replace
// underscores and hyphens with spaces, then title-case. `hunter_root` →
// "Hunter Root"; `pink-hats` → "Pink Hats"; `content_kind` → "Content Kind".
// A future enhancement adds a `display_name` column to the vocabulary CSV;
// this function will then consult that table and fall through to the
// transform for unmapped slugs.
function prettify(s) {
  return String(s)
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(w => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

// ─── buildDimensions — the only public surface besides slugify ──────────────
// Walks every artifact's tags object, collects the union of namespaces (minus
// `exhibit`), and for each namespace collects the union of values present in
// the artifact set. Returns the structures the deck consumes:
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
    namespaces.map(ns => [ns, prettify(ns)])
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
