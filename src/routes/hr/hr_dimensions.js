// ─── HR_DIMENSIONS — active filter dimensions for the HR deck ───────────────
// Stage 3 (v28_3 deck shape — full column complement, sameness rule).
//
// MUSEUM UX ground rule, per docs/MUSEUM_UX.md and the visitor-consequence
// call: do not drop columns from v28_3, do not invent data. Every column
// in the prototype's three-tier dimension set is rendered. Where HR has
// vocab today (Era, Year, Type, Src), pills are live. Where v28_3 names a
// dimension HR has no vocab for yet (People, Venue, Format, Media,
// Provenance, Odds), the column renders with an empty value list — header
// only, no pills. Album and Song values are mirrored from the spine
// (src/data/artists/hunter-root.js) so visitors see the catalog's shape;
// no card carries an album / song slug today, so all those pills are
// zero-count and un-clickable per the locked sameness rule. Empty
// dimensions fill in pre-launch as artifacts get tagged.
//
// Vocabulary rule:
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
// HR has no card-level data yet for: album, song, people, venue, format,
// media, provenance, odds. Those columns render with the spine-derived
// vocab (album, song) or empty (the rest) until artifacts get tagged.
// ─────────────────────────────────────────────────────────────────────────────

// ─── DEEP DIVE vocabulary import ─────────────────────────────────────────
// Source of truth lives at docs/deep-dive-vocabulary.csv (operator-edited).
// tools/build-deep-tags-vocabulary.mjs runs at npm prebuild and writes the
// JSON below. Adding a new group to the CSV adds a new Tier 3 pill column
// on the next build — no further code changes required in this file.
import DEEP_VOCAB from "../../data/deep-dive-vocabulary.json";

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

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

// ─── ALBUM — mirrored from src/data/artists/hunter-root.js spine ────────────
// Six albums in chronological release order. Slug == spine entry's `id`,
// label == spine entry's `title`. KEEP IN SYNC with the spine: when a new
// album is added there, mirror it here, in the same chronological position.
// No HR card carries an album field today, so all pills render zero-count
// and un-clickable until artifacts get tagged.
const HR_ALBUM_OPTIONS = [
  { slug: "cracked",    label: "They Finally Cracked Me" },
  { slug: "wheel",      label: "Life Inside A Wheel" },
  { slug: "dandelions", label: "Mimicking the Sun Like Dandelions" },
  { slug: "skipping",   label: "Skipping Stones That Sink Before They're Thrown" },
  { slug: "arkansas",   label: "Arkansas" },
  { slug: "crooked",    label: "Crooked Home" },
];

// ─── YEAR — slugs are the numeric strings; labels match ────────────────────
const HR_YEAR_OPTIONS = [
  "2012", "2013", "2014", "2016", "2017", "2018", "2019",
  "2020", "2022", "2023", "2024", "2025", "2026",
].map(y => ({ slug: y, label: y }));

// ─── SONG — mirrored from src/data/artists/hunter-root.js spine ─────────────
// 68 unique track titles across the six albums, in spine order, deduplicated
// (some titles like "The Shade" / "Soul Sucker" appear on more than one
// album; first-occurrence wins). Slug derived via slugify() applied to the
// title. KEEP IN SYNC with the spine: when tracks are added there, mirror
// them here. No HR card carries a song field today — pills are zero-count
// and un-clickable until artifacts get tagged.
const HR_SONG_OPTIONS = [
  { slug: "cheap-wine",                 label: "Cheap Wine" },
  { slug: "straitlaced",                label: "Straitlaced" },
  { slug: "so-sick",                    label: "So Sick" },
  { slug: "identity",                   label: "Identity" },
  { slug: "hook-or-the-worm",           label: "Hook Or The Worm" },
  { slug: "television-head",            label: "Television Head" },
  { slug: "let-the-rhythm",             label: "Let The Rhythm" },
  { slug: "silly-situation",            label: "Silly Situation" },
  { slug: "moving-with-the-storm",      label: "Moving With The Storm" },
  { slug: "soul-sucker",                label: "Soul Sucker" },
  { slug: "the-shade",                  label: "The Shade" },
  { slug: "same-page",                  label: "Same Page" },
  { slug: "talker-with-a-broken-jaw",   label: "Talker With A Broken Jaw" },
  { slug: "people-are-programs",        label: "People Are Programs" },
  { slug: "killer-to-killer",           label: "Killer To Killer" },
  { slug: "brain-cell",                 label: "Brain Cell" },
  { slug: "fix-my-head",                label: "Fix My Head" },
  { slug: "free-to-roam-the-cage",      label: "Free To Roam The Cage" },
  { slug: "with-great-pleasure",        label: "With Great Pleasure" },
  { slug: "the-water",                  label: "The Water" },
  { slug: "music-on-my-mind",           label: "Music On My Mind" },
  { slug: "what-i-felt",                label: "What I Felt" },
  { slug: "greek-fire",                 label: "Greek Fire" },
  { slug: "shapeshifter",               label: "Shapeshifter" },
  { slug: "lampshade",                  label: "Lampshade" },
  { slug: "favorite-friend",            label: "Favorite Friend" },
  { slug: "little-red-riding-hood",     label: "Little Red Riding Hood" },
  { slug: "homestead",                  label: "Homestead" },
  { slug: "undertow",                   label: "Undertow" },
  { slug: "family-tree",                label: "Family Tree" },
  { slug: "tongue-in-cheek",            label: "Tongue In Cheek" },
  { slug: "norma-jean",                 label: "Norma Jean" },
  { slug: "impossible-itch",            label: "Impossible Itch" },
  { slug: "upper-hand",                 label: "Upper Hand" },
  { slug: "wildfire",                   label: "Wildfire" },
  { slug: "dont-blame-the-breeze",      label: "Don't Blame The Breeze" },
  { slug: "nothin-wrong",               label: "Nothin' Wrong" },
  { slug: "cusp-of-the-mend",           label: "Cusp Of The Mend" },
  { slug: "cocoon",                     label: "Cocoon" },
  { slug: "patience-in-the-dark",       label: "Patience In The Dark" },
  { slug: "just-for-kicks",             label: "Just For Kicks" },
  { slug: "echo-calls-her-name",        label: "Echo Calls Her Name" },
  { slug: "shake-it-off-of-me",         label: "Shake It Off Of Me" },
  { slug: "silver-lining",              label: "Silver Lining" },
  { slug: "quicksand-sinking",          label: "Quicksand Sinking" },
  { slug: "town-rat-heathen",           label: "Town Rat Heathen" },
  { slug: "reverend",                   label: "Reverend" },
  { slug: "grain-of-rice",              label: "Grain Of Rice" },
  { slug: "cant-outshine-the-truth",    label: "Can't Outshine The Truth" },
  { slug: "california-sober",           label: "California Sober" },
  { slug: "good-on-paper",              label: "Good On Paper" },
  { slug: "few-steps-back",             label: "Few Steps Back" },
  { slug: "run-from-the-devil",         label: "Run From The Devil" },
  { slug: "silver-lining-reprise",      label: "Silver Lining (Reprise)" },
  { slug: "94",                         label: "'94" },
  { slug: "low",                        label: "Low" },
  { slug: "string-up-a-necklace",       label: "String Up a Necklace" },
  { slug: "hand-in-the-fire",           label: "Hand in the Fire" },
  { slug: "flash-in-the-pan",           label: "Flash in the Pan" },
  { slug: "friendly-fire",              label: "Friendly Fire" },
  { slug: "the-devil-is-the-culprit",   label: "The Devil is the Culprit" },
  { slug: "if-the-body-is-a-temple",    label: "If the Body is a Temple" },
  { slug: "the-keeper",                 label: "The Keeper" },
  { slug: "out-of-my-hands",            label: "Out of my Hands" },
  { slug: "bad-sign",                   label: "Bad Sign" },
  { slug: "my-brothers-bones",          label: "My Brother's Bones" },
  { slug: "cookin-in-the-bathroom",     label: "Cookin' in the Bathroom" },
  { slug: "a-pot-song",                 label: "A Pot Song" },
];

// ─── EMPTY-VOCAB DIMENSIONS — header rendered, no pills until tagged ────────
// v28_3 names these dimensions; HR has no per-artist vocabulary for them
// today. Per the visitor-consequence call: render the column header so the
// shape of the museum is honest, leave the pill list empty, and let real HR
// data fill in pre-launch. Do not carry the prototype's fictional vocab
// forward (e.g., "josephine-reyes" is the prototype's fake band, not
// Hunter Root's).
const HR_PEOPLE_OPTIONS     = [];
const HR_VENUE_OPTIONS      = [];
const HR_FORMAT_OPTIONS     = [];
const HR_MEDIA_OPTIONS      = [];
const HR_PROVENANCE_OPTIONS = [];
const HR_ODDS_OPTIONS       = [];

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
// HR-specific column, not present in v28_3. v28_3 has a coarser
// `provenance` (band / fan / press / licensed); HR's `src` is finer
// (Archive / Press / Facebook / Instagram / Stage / YouTube) and HR has
// data for it today. Appended to Tier 2 after the v28_3 columns so nothing
// live gets dropped. Pre-launch, we may decide to fold src into provenance,
// but that's a data-model question for later.
const HR_SRC_OPTIONS = [
  { slug: "archive", label: "Archive" },
  { slug: "press",   label: "Press" },
  { slug: "fb",      label: "Facebook" },
  { slug: "insta",   label: "Instagram" },
  { slug: "stage",   label: "Stage" },
  { slug: "youtube", label: "YouTube" },
];

// ─── HR_DIMENSIONS — same shape as the v28_3 prototype's DIMENSIONS array ──
// Order matches v28_3 (era · album · year · song · people · venue for
// Tier 1, format · media · provenance · type for Tier 2, odds for Tier 3),
// with HR's `src` appended to Tier 2 after `type`.
//
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

// ─── DEEP DIVE — Tier 3 dim entries derived from the vocabulary JSON ──────
// One column per group label in DEEP_VOCAB.groupOrder. Pills derived from
// the tags inside each group: slug = tag, label = first-letter-capitalized
// tag. Per-card tag arrays are attached in hr_cards.js from
// src/data/deep-tags.json (Phase 1 ships an empty cards object — Phase 3's
// export CLI and Phase 4's MV curation UI populate it).
const DEEP_DIMENSIONS = DEEP_VOCAB.groupOrder.map(group =>
  dim(
    group,
    "multi",
    3,
    (DEEP_VOCAB.groups[group] || []).map(({ tag }) => ({
      slug: tag,
      label: capitalize(tag),
    })),
  ),
);

export const HR_DIMENSIONS = [
  // Tier 1 — Artist tab
  dim("era",        "single", 1, HR_ERA_OPTIONS),
  dim("album",      "single", 1, HR_ALBUM_OPTIONS),
  dim("year",       "single", 1, HR_YEAR_OPTIONS),
  dim("song",       "single", 1, HR_SONG_OPTIONS),
  dim("people",     "multi",  1, HR_PEOPLE_OPTIONS),
  dim("venue",      "single", 1, HR_VENUE_OPTIONS),
  // Tier 2 — Formats tab
  dim("format",     "single", 2, HR_FORMAT_OPTIONS),
  dim("media",      "single", 2, HR_MEDIA_OPTIONS),
  dim("provenance", "single", 2, HR_PROVENANCE_OPTIONS),
  dim("type",       "single", 2, HR_TYPE_OPTIONS),
  dim("src",        "single", 2, HR_SRC_OPTIONS),
  // Tier 3 — Deep Tracks tab
  dim("odds",       "multi",  3, HR_ODDS_OPTIONS),
  // Tier 3 — Deep Dive (one column per group in deep-dive-vocabulary.csv)
  ...DEEP_DIMENSIONS,
];

// ─── HR_GROUP_LABELS — column headers (Era / Album / Year / Song / etc.) ────
// Display labels for group headers, used by PillGroupColumn and by preset-
// summary text. Kept in sync with HR_DIMENSIONS keys.
export const HR_GROUP_LABELS = {
  era:        "Era",
  album:      "Album",
  year:       "Year",
  song:       "Song",
  people:     "People",
  venue:      "Venue",
  format:     "Format",
  media:      "Media",
  provenance: "Provenance",
  type:       "Type",
  src:        "Source",
  odds:       "Odds",
  // Deep Dive group labels — derived from DEEP_VOCAB.groupOrder so adding
  // a new group to the CSV automatically gets a sensible header.
  ...Object.fromEntries(
    DEEP_VOCAB.groupOrder.map(g => [g, capitalize(g)]),
  ),
};

// ─── HR_LABELS — slug → display lookup, keyed by group ──────────────────────
// The deck's prettyTag-equivalent reads from this map. Search matches
// against label.toLowerCase() so a fan typing "hunter root" finds the
// Hunter Root era pill even though the legacy slug is "solo". Empty-vocab
// dimensions produce empty maps; displayFor falls through to the
// hyphens-to-spaces default for any slug that isn't mapped.
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
