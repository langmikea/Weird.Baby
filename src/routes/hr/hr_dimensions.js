// ─── HR_DIMENSIONS — active filter dimensions for the HR deck ───────────────
// Stage 2 (v28_3 deck shape adoption). Carries Phase 1.5b's HR-specific
// dimension reduction forward and applies the locked Hunter Root era
// vocabulary on top.
//
// Vocabulary rule (per docs/MUSEUM_UX.md):
//   Era display strings: Run With The Hunt · SEEDS · Medusa's Disco · Hunter Root
//   Stored as lowercase-hyphenated slugs via slugify(). Pill labels are the
//   canonical proper-case strings; slugs are derived from the pills.
//
// Legacy slugs in the existing data are preserved (medusas, solo) and paired
// here with their canonical display string. New options use slugify() of
// their label. matchFilter operates on the slug column; the deck's pill
// renderer reads the label column. See HR_LABELS at the bottom.
//
// HR has these populated fields across its three card sources:
//   era   — "seeds" | "medusas" | "solo"        ← legacy slugs, displayed re-mapped
//   type  — schema differs per source; 13 distinct slugs across the union
//   src   — varies per source; 6 distinct slugs across the union
//   date  — ISO-like strings; year is derivable via date.slice(0, 4)
//
// HR has NO data for the prototype's other dimensions:
//   album, song, people, venue, format, media, provenance, odds — dropped.
//
// Tier 3 (Deep Tracks) has no dedicated dimension column — its tab body is
// the search surface only, exactly as in the v28_3 prototype.
// ─────────────────────────────────────────────────────────────────────────────

// ─── slugify — canonical helper ─────────────────────────────────────────────
// Lowercase, strip apostrophes, collapse anything non-alphanumeric to single
// hyphens, trim leading/trailing hyphens. Used to derive a stable storage
// slug from a proper-case display string. Stable for ASCII inputs; the data
// the museum stores is ASCII-clean, so we don't normalize Unicode here.
export function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/['’]/g, "")           // strip straight + curly apostrophes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── ERA — locked vocabulary, in locked order ───────────────────────────────
// Display strings exactly as written in MUSEUM_UX.md. "Run With The Hunt"
// has no matching content in HR_CARDS today; per the locked rule its pill
// renders un-clickable. SEEDS, Medusa's Disco, Hunter Root are paired with
// their existing legacy slugs so historical data continues to filter
// correctly without a data-file rewrite.
const HR_ERA_OPTIONS = [
  { slug: "run-with-the-hunt", label: "Run With The Hunt" },
  { slug: "seeds",             label: "SEEDS" },           // slug == slugify(label)
  { slug: "medusas",           label: "Medusa's Disco" },  // legacy slug preserved
  { slug: "solo",              label: "Hunter Root" },     // legacy slug preserved
];

// ─── YEAR — slugs are the numeric strings; labels match ────────────────────
const HR_YEAR_OPTIONS = [
  "2012", "2013", "2014", "2016", "2017", "2018", "2019",
  "2020", "2022", "2023", "2024", "2025", "2026",
].map(y => ({ slug: y, label: y }));

// ─── TYPE — proper-case labels per slug; slugify(label) === slug for all ───
// Vocab spans the union of the three card sources:
//   HR_ARCHIVE   → historical | interview | rarity
//   HR_ARTIFACTS → video | photo (vocab also reserves: poster, setlist,
//                  fan-art, handwritten, ticket — kept here so growth is
//                  additive; pills read 0 until data lands)
//   HR_EXIT_FLOW → quick | deep | highlight
const HR_TYPE_OPTIONS = [
  { slug: "historical",  label: "Historical" },
  { slug: "interview",   label: "Interview" },
  { slug: "rarity",      label: "Rarity" },
  { slug: "video",       label: "Video" },
  { slug: "photo",       label: "Photo" },
  { slug: "poster",      label: "Poster" },
  { slug: "setlist",     label: "Setlist" },
  { slug: "fan-art",     label: "Fan Art" },
  { slug: "handwritten", label: "Handwritten" },
  { slug: "ticket",      label: "Ticket" },
  { slug: "quick",       label: "Quick" },
  { slug: "deep",        label: "Deep" },
  { slug: "highlight",   label: "Highlight" },
];

// ─── SRC — proper-case labels per slug ──────────────────────────────────────
// Two of the slugs are abbreviations from the original feeds — we promote
// them to recognizable proper-case names for the pill column. Storage slugs
// are unchanged (legacy preserved on fb / insta / youtube).
const HR_SRC_OPTIONS = [
  { slug: "archive", label: "Archive" },
  { slug: "press",   label: "Press" },
  { slug: "fb",      label: "Facebook" },
  { slug: "insta",   label: "Instagram" },
  { slug: "stage",   label: "Stage" },
  { slug: "youtube", label: "YouTube" },
];

// ─── HR_DIMENSIONS — same shape as the v28_3 prototype's DIMENSIONS array ──
// `values` is the ordered slug array, kept for API parity with the
// prototype's matchFilter / countForPill / pill column iteration.
// `options` carries the (slug, label) pairs and is used by the deck for
// display. Both are derived from the same source so they can never drift.
function dim(key, kind, tier, options) {
  return {
    key, kind, tier, options,
    values: options.map(o => o.slug),
  };
}

export const HR_DIMENSIONS = [
  dim("era",  "single", 1, HR_ERA_OPTIONS),
  dim("year", "single", 1, HR_YEAR_OPTIONS),
  dim("type", "single", 2, HR_TYPE_OPTIONS),
  dim("src",  "single", 2, HR_SRC_OPTIONS),
];

// ─── HR_GROUP_LABELS — column headers (Era / Year / Type / Source) ──────────
export const HR_GROUP_LABELS = {
  era: "Era",
  year: "Year",
  type: "Type",
  src: "Source",
};

// ─── HR_LABELS — slug → display lookup, keyed by group ──────────────────────
// The deck's prettyTag-equivalent reads from this map. Search matches
// against label.toLowerCase() so a fan typing "hunter root" finds the
// Hunter Root era pill even though the legacy slug is "solo".
export const HR_LABELS = Object.fromEntries(
  HR_DIMENSIONS.map(d => [
    d.key,
    Object.fromEntries(d.options.map(o => [o.slug, o.label])),
  ])
);

// ─── displayFor — canonical (group, slug) → label resolver ──────────────────
// Falls back to a hyphens-to-spaces transform if a slug isn't in the table,
// so Year (numeric) and any future un-mapped slug still renders something
// readable rather than throwing.
export function displayFor(group, slug) {
  return HR_LABELS[group]?.[slug] ?? String(slug).replace(/-/g, " ");
}
