// ─── HR_DIMENSIONS — active filter dimensions for the HR deck ───────────────
// Phase 1.5b. Derived from src/data/hr_archive.js, src/data/hr_artifacts.js,
// src/data/hr_exit_flow.js, and src/data/artists/hunter-root.js.
//
// O1 = (b): use HR's existing data fields. Drop prototype dimensions HR has
// no data for. Drop dimensions with <3 distinct values across the cards
// HR_CARDS will render.
//
// HR has these populated fields across its data sources:
//   era   — "seeds" | "medusas" | "solo"
//   type  — schema differs per source; 8 distinct values across the union
//   src   — varies per source; 6 distinct values across the union
//   date  — ISO-like strings; year is derivable via date.slice(0, 4)
//
// HR has NO data for the prototype's other dimensions:
//   album, song, people, venue, format, media, provenance, odds — dropped.
//
// Distinct counts across HR_CARDS (the union HR_CARDS includes HR_ARTIFACTS
// + HR_ARCHIVE + HR_EXIT_FLOW per the Step 2 broadening — see report):
//   era:   3 values  → KEEP, tier 1 (Artist)
//   year: 14 values  → KEEP, tier 1 (Artist)
//   type:  8 values  → KEEP, tier 2 (Formats)
//   src:   6 values  → KEEP, tier 2 (Formats)
//
// Tier 3 (Deep Tracks) has no dedicated dimension column — its tab body is
// the search surface only, exactly as in the v28 prototype.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Distinct values harvested from HR data ─────────────────────────────────
// Order matters for pill display — we order eras chronologically, types by
// "narrative" weight, src by frequency.
const HR_ERAS = ["seeds", "medusas", "solo"];

// Years span the union of HR_ARCHIVE + HR_ARTIFACTS + HR_EXIT_FLOW dates
// (date.slice(0, 4) — handles HR_EXIT_FLOW's suffixed dates like "2026-04-08b").
const HR_YEARS = [
  "2012", "2013", "2014", "2016", "2017", "2018", "2019",
  "2020", "2022", "2023", "2024", "2025", "2026",
];

// Type values across the three sources:
//   HR_ARCHIVE      → historical | interview | rarity
//   HR_ARTIFACTS    → video | photo
//                     (schema also lists poster, setlist, fan-art, handwritten,
//                      ticket — kept in the dimension vocab so growth is
//                      additive; pills will read 0 until data lands)
//   HR_EXIT_FLOW    → quick | deep | highlight
const HR_TYPES = [
  "historical", "interview", "rarity",
  "video", "photo",
  "poster", "setlist", "fan-art", "handwritten", "ticket",
  "quick", "deep", "highlight",
];

// Source values across the three sources:
//   HR_ARCHIVE   → fb | insta | press | archive
//   HR_ARTIFACTS → archive | stage | youtube
//   HR_EXIT_FLOW → archive
const HR_SRCS = ["archive", "press", "fb", "insta", "stage", "youtube"];

// ─── HR_DIMENSIONS — shape matches prototype's DIMENSIONS array ─────────────
export const HR_DIMENSIONS = [
  { key: "era",  kind: "single", values: HR_ERAS,  tier: 1 },
  { key: "year", kind: "single", values: HR_YEARS, tier: 1 },
  { key: "type", kind: "single", values: HR_TYPES, tier: 2 },
  { key: "src",  kind: "single", values: HR_SRCS,  tier: 2 },
];

// ─── HR_GROUP_LABELS — subset of prototype's GROUP_LABELS ───────────────────
// Prototype labels kept verbatim per O15. "src" is HR-specific so we add a
// fresh label ("Source").
export const HR_GROUP_LABELS = {
  era: "Era",
  year: "Year",
  type: "Type",
  src: "Source",
};
