# B-1: Vocabulary-as-Data — Implementation Plan

**Status:** Cowork-drafted, awaiting operator review and lock. Not committed.
**Authored:** 2026-05-12, read-only investigation session.
**Authority:** This plan answers the design questions surfaced by the
canonical specs (`UX_LIFECYCLE_SPEC_v0.5.md §4.3`, §1 #1, §1 #9;
`DATA_WORKFLOW_SPEC_v0.2.md §2.10`, §3.3, §6) and proposes the concrete
shape of the B-1 refactor. The plan recommends; it does not unilaterally
decide. Operator locks the §6 questions before code begins.

---

## §0 — Scope

### What B-1 is

A single coordinated change across MV (MediaVault) and the museum that
turns the museum's pill-column vocabulary from a code-resident set of
hardcoded namespaces and slug-derived display names into **a data table
referenced by stable internal ID**. After B-1 lands:

- The museum no longer hardcodes which namespaces belong to which tier.
- The museum no longer derives display names by title-casing a slug.
- Artifacts reference vocabulary entries by stable internal ID, not by
  slug.
- A future operator UX in MV (B-2, not B-1) can add/rename/reorder/retire
  vocabulary entries without code changes; B-1 produces the table that
  UX edits.

### What B-1 is NOT

- **Not the MV-side editor UI.** B-1 produces the contract; B-2 builds
  the operator-editing surface.
- **Not the tab-label fix.** B-7 (tab labels) is unblocked by B-1 but
  ships separately so B-1 stays focused.
- **Not the variant taxonomy migration.** B-8 (Exhibit.jsx
  `TAG_SLOTS`/`TYPE_META`) is unblocked by B-1 but is a distinct
  surface — track-video variants live on the spine, not on artifact
  records. B-8 ships separately.
- **Not the card-shape work** (B-3). B-1 lays only the vocabulary half
  of the data contract; card-shape data shape is independent.
- **Not legacy CSV retirement.** `docs/deep-dive-vocabulary.csv` and the
  `build-deep-tags-vocabulary.mjs` prebuild stay for one release after
  B-1 ships, retired only when no consumer remains.
- **Not a UX change.** Visitors see no surface change at the moment B-1
  lands. Pill columns continue to surface dynamically from artifact
  tags; only the *labels and tier assignments* change source (data
  table instead of `TIER_BY_NAMESPACE` + `prettify`).

### One-sentence summary

Replace `TIER_BY_NAMESPACE` + `prettify` in `src/routes/hr/hr_dimensions.js`
with a lookup into a per-repo JSON vocabulary table whose entries carry
stable internal IDs, and switch MV's tag emission + the museum's filter
matcher to reference those IDs.

---

## §1 — Current State

### §1.1 — The drift in detail

The museum's deck currently composes pill columns through three layers
that all violate the §4.3 invariant (vocabulary-as-data):

**Layer A — tier assignment (`hr_dimensions.js:49-60`).**

```js
const TIER_BY_NAMESPACE = {
  // Tier 1 — Artist axis (who / when / where)
  author: 1, era: 1, year: 1, song: 1, venue: 1, people: 1, scope: 1,
  // Tier 2 — Formats axis (what kind of artifact / medium)
  platform: 2, source_platform: 2, content_kind: 2, media_type: 2,
  format: 2, provenance: 2, type: 2, src: 2,
  // Tier 3 — everything else falls through
};
```

This table:

- Misses `album` (canonical Tier 1 per CANONICAL_VOCABULARY.md, missing
  from this map → currently lands in Tier 3 by default).
- Contains `author`, `era`, `scope` in Tier 1 — none of which are
  canonical Tier 1 entries.
- Contains `platform`, `source_platform`, `content_kind`, `media_type`,
  `format`, `provenance` in Tier 2 — none of which are canonical Tier 2
  (`source`, `type` only).
- Is keyed by string namespace, with no notion of stable identity.

**Layer B — display-name derivation (`hr_dimensions.js:67-78`).**

```js
function prettify(s) {
  return String(s)
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(w => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}
```

Display names are derived deterministically from slugs by title-casing.
There is no lookup table. Renaming "Mood" → "Vibes" is not possible
without renaming the underlying slug everywhere it appears, which is
exactly what the §2.10 stable-ID invariant forbids: the slug *is* the
identity today, so the slug *is* what visitors see (modulo title-case),
and there is nothing in between.

**Layer C — tab labels (`HrExhibitFlow.jsx:124-130`).**

```js
const TABS = [
  { key: "artist",  label: "Artist",      kind: "tier",    tier: 1, ... },
  { key: "media",   label: "Formats",     kind: "tier",    tier: 2, ... },
  { key: "deep",    label: "Deep Tracks", kind: "tier",    tier: 3, ... },
  { key: "presets", label: "Presets",     kind: "special", ... },
  { key: "journal", label: "Journal",     kind: "special", ... },
];
```

Canonical labels per CANONICAL_VOCABULARY.md and UX_LIFECYCLE §1 #9 are
**ARTIST / MEDIA / DEEP DIVE**. Code says **Artist / Formats / Deep
Tracks**. Three labels, three mismatches.

### §1.2 — What's already aligned

The compare pass found several surfaces already consistent with the
vocabulary-as-data invariant — not perfectly, but enough that B-1 is
focused on the three layers above rather than a sprawling rewrite:

- **`exhibit:` namespace stripping (`hr_dimensions.js:104`).** Already
  filtered at dimension discovery, never rendered as a pill column.
  Matches `UX_LIFECYCLE §4.7`.
- **Dynamic namespace discovery (`hr_dimensions.js:96-126`).** Already
  data-driven — `buildDimensions(artifacts)` walks artifacts and emits
  one pill column per namespace it finds. Adding a new namespace in MV
  surfaces as a new pill column with no museum code change. The tier
  assignment is the broken half; the discovery is fine.
- **Per-namespace value ordering.** Already alphabetical within each
  namespace; matches CANONICAL_VOCABULARY's "by hit count, tiebreak
  alphabetical" for Tier 3 (ordering will swap from alphabetical to
  hit-count on the same data — not a B-1 blocker).
- **Export pipeline (`tools/export-artifacts.mjs:230-281`).** Already
  emits artifact records with `tags: { namespace: [values] }` grouped
  by namespace. The export reads MV's `artifacts.tags` JSON column,
  splits on first `:`, and groups by namespace. Already correct shape;
  what's missing is the ID-vs-slug distinction.
- **Filter matcher (`HrExhibitFlow.jsx:408-427`).** Already uniformly
  `kind: "multi"`; reads `item.tags[group]` as an array and checks
  membership. Whatever the keying scheme (slug or ID), the matcher's
  shape is correct.

### §1.3 — The legacy CSV/JSON path

`docs/deep-dive-vocabulary.csv` + `tools/build-deep-tags-vocabulary.mjs`
+ `src/data/deep-dive-vocabulary.json` form a vestigial vocabulary path:

- The CSV defines four "Deep Dive" groups (mood, theme, motif, texture)
  with six tags total.
- The prebuild emits a JSON file with `groups`, `groupOrder`,
  `generated_at`, `source_sha`.
- **The JSON file is no longer imported anywhere in `src/`.** Grep for
  `import.*deep-dive-vocabulary` returns zero hits in the source tree.
  It's still imported by tooling (`export-artifacts.mjs` reads the CSV
  to compute `vocabulary_csv_sha` in exhibit metadata, purely
  informational).
- Per `CANONICAL_VOCABULARY.md` "Legacy" section: this file is retained
  for git-history continuity, no longer drives pill columns, future
  cleanup may retire.

B-1 should not retire the legacy CSV/JSON. They're inert relative to
pill columns already. Retire in a follow-up after B-1 + B-2 are
fully in production.

### §1.4 — The current artifact data

`src/data/exhibits/hunter_root.json` currently contains `"artifacts":
[]` — the export ran against an MV with no released, badged artifacts.
This is convenient for B-1: there are zero artifacts in production
carrying slug-keyed tags today, so the migration is technically a
greenfield from the museum's perspective. The migration concern is
**MV-side** — MV's artifact records do carry tags (whatever the
operator has been curating into MV), and B-1 needs to migrate those.

---

## §2 — Target State

After B-1 ships:

### §2.1 — There is a vocabulary table

A single JSON file at `src/data/vocabulary.json` (or similar — see §3
question 1) defines the museum's vocabulary entries. Each entry carries:

- `id` — stable internal ID, opaque, never reused, never edited.
- `namespace` — the slug-shaped string ("mood", "year", "album", ...).
- `slug` — operator-editable slug. May be renamed; renames do not
  change `id`.
- `display_name` — operator-editable visitor-facing label.
- `tier` — 1, 2, or 3.
- `sort_order` — optional, used for non-alphabetical group ordering.
- `kind` — "namespace" (Tier 1/2/3 group) or "tab" (the deck tab
  itself) or "value" (an individual pill within a namespace). See §3
  question 1 for the shape decision.
- `retired_at` — ISO timestamp or null. Retired entries don't surface
  in operator pick-lists or in pill columns going forward; artifacts
  that already carry them keep them per sovereign-tag-set invariant.

The table is **emitted by MV** during export (B-1's MV-side change) or
**maintained in the museum repo and read by MV** (alternative — see §3
question 1). Locked decision required before B-1 code begins.

### §2.2 — Artifacts reference IDs

The export emits each artifact's tag set as ID-keyed:

```json
{
  "id": "art_018",
  ...
  "tags": {
    "vocab_id_42": ["vocab_id_188", "vocab_id_193"],
    "vocab_id_7":  ["vocab_id_902"]
  }
}
```

…or equivalent ID form. (Concrete shape per §3 question 2.) The
namespace key is itself an ID; the values are IDs.

Alternative (also viable; see §3 question 3): both ID and slug emitted,
museum reads ID with slug fallback for safety during migration.

### §2.3 — Museum reads from the table

`hr_dimensions.js`:

- Imports `vocabulary.json` at module load.
- Replaces `TIER_BY_NAMESPACE` with `tierFor(id) → 1|2|3` reading from
  the table.
- Replaces `prettify` with `displayFor(id) → string` reading from the
  table, with `prettify` retained as a safety fallback only for IDs
  not in the table.
- `buildDimensions(artifacts)` consumes the table to derive
  HR_DIMENSIONS / HR_GROUP_LABELS / displayFor — same external API,
  data source swapped underneath.

### §2.4 — The deck doesn't change shape

Visitors see no immediate change. Pill columns surface and behave
identically. The change is internal: what was hardcoded is now data.

The B-1 ship moment is data plumbing, not a UX moment. UX-visible
follow-ups (correct tab labels per B-7, correct tier assignments now
that data is right, the future MV vocabulary editor per B-2) flow
through the table B-1 creates.

---

## §3 — Design Decisions

Each question gets the candidates, a recommendation, and an
operator-decision flag.

### §3.1 — Q1: Data shape

**Question:** What's the storage format for the vocabulary table?
File-based or DB-backed? Per-namespace or monolithic? Schema per entry?
Where does the file live?

**Candidate A — Monolithic JSON file in the museum repo.**

```
src/data/vocabulary.json
{
  "entries": [
    { "id": "ns_year",   "kind": "namespace", "slug": "year",
      "display_name": "Year",  "tier": 1, "sort_order": 1,
      "retired_at": null },
    { "id": "ns_album",  "kind": "namespace", "slug": "album",
      "display_name": "Album", "tier": 1, "sort_order": 2,
      "retired_at": null },
    { "id": "tab_tier1", "kind": "tab",
      "slug": "artist",  "display_name": "ARTIST",  "tier": 1,
      "retired_at": null },
    { "id": "v_album_runwiththehunt", "kind": "value",
      "namespace_id": "ns_album", "slug": "run-with-the-hunt",
      "display_name": "Run With The Hunt",
      "sort_order": 1, "retired_at": null },
    ...
  ],
  "generated_at": "2026-05-13T08:00:00Z",
  "source": "mediavault"
}
```

Committed to the museum repo. Emitted by MV during export OR maintained
by hand in the museum repo until MV-side editor (B-2) lands.

**Candidate B — Per-namespace files.**

```
src/data/vocabulary/year.json
src/data/vocabulary/album.json
src/data/vocabulary/mood.json
...
src/data/vocabulary/_tabs.json
```

One file per namespace plus a tabs file. Each contains the entries for
that namespace.

**Candidate C — DB-backed.** MV's SQLite gets a `vocabulary` table; the
museum reads it via a build-time export that produces JSON files anyway
(MV is loopback-only, the museum bundles static data — see
`DATA_WORKFLOW_SPEC §4.1`).

**Recommendation: Candidate A — monolithic JSON file at
`src/data/vocabulary.json`, emitted by MV's export.**

Rationale:
- Single file is the simplest thing that meets the invariants. Git
  diffs are legible. Operator can read it.
- Monolithic structure means cross-namespace queries (e.g., "show me
  every retired entry") are a single iteration; per-namespace files
  fragment that.
- MV's SQLite stays the source-of-truth for the operator; the museum
  bundles a JSON snapshot per the existing data flow (MV ↔ JSON ↔
  museum, identical to how artifacts already flow).
- DB-backed is correct in principle but adds a build dependency the
  museum doesn't currently have, for a payload that's <50KB at full
  scale.
- The `entries` array is queryable in obvious ways; the schema is
  uniform across `kind` to keep the lookup function simple.

**Per-entry schema (recommended):**

```js
{
  id: "vocab_<opaque>",     // stable
  kind: "namespace" | "value" | "tab",
  slug: "year" | "run-with-the-hunt" | "artist",
  display_name: "Year" | "Run With The Hunt" | "ARTIST",
  tier: 1 | 2 | 3,                            // for namespace + tab + value
  namespace_id: "vocab_..." | null,           // for kind=value only
  sort_order: number | null,
  retired_at: "ISO" | null,
}
```

**File location:** `src/data/vocabulary.json` (mirrors
`src/data/exhibits/<exhibit_name>.json` placement).

**Operator decision needed:** YES. Operator locks (a) file vs. DB, (b)
monolithic vs. per-namespace, (c) the entry schema above. The rest of
the plan assumes monolithic-file + recommended schema.

---

### §3.2 — Q2: Stable-ID scheme

**Question:** How are IDs generated? What shape are they?

**Candidate A — UUIDv4** (`a1b2c3d4-e5f6-...`). 36 chars. Universally
unique. Unreadable.

**Candidate B — ULID** (`01HJK3M2N0Q...`). 26 chars. Time-sortable.
Still unreadable.

**Candidate C — Slug-derived but frozen.** ID is `vocab_<slug>` at
creation; the ID is never changed when the slug renames. So if "mood"
later renames to "vibes", the ID stays `vocab_mood`. ID is legible in
JSON ("which entry is this? `vocab_mood`, oh that's the mood/vibes
group") but doesn't carry semantic weight after a rename.

**Candidate D — Autoincrement integer** (`1`, `2`, `3`). Compact. Order
is meaningful. Easy to collide if generated by multiple sources;
single-source generation is fine.

**Recommendation: Candidate C — slug-derived but frozen, with a
`vocab_` prefix.**

ID shape: `vocab_<initial_slug>` for entries created from a slug;
`vocab_<initial_slug>__<entropy>` for collisions (rare). For
non-slug-named entries (e.g., the tab entries), `vocab_tab_<n>`.

Rationale:
- Readability in JSON is a real benefit. Git diffs say `vocab_mood`
  not `01HJK3M2N0QABCDEFG`. The operator can find an entry by visual
  scan.
- Collisions are rare. The vocabulary is operator-curated; the
  operator doesn't create two `mood` entries.
- "ID = initial slug" makes the migration story (Q3) much easier:
  every existing artifact's `mood:snarky` already encodes the future
  ID `vocab_mood`. Migration is mostly mechanical.
- Renames are still true renames: edit `slug` and `display_name`, ID
  stays. Visitors see "Vibes"; artifacts still reference `vocab_mood`.
- The `vocab_` prefix avoids any collision with non-vocabulary string
  IDs in the codebase.
- UUID/ULID are correct in principle but the readability tax is real
  and the entropy is overkill for a single-MV-owned table.

**Operator decision needed:** YES. Operator locks the ID shape. The
plan's migration path (§4) assumes slug-derived frozen IDs.

---

### §3.3 — Q3: Artifact tag keying — by ID, slug, or both?

**Question:** Do artifacts reference vocabulary entries by ID, by slug,
or by both?

**Candidate A — IDs only.** Tag map keys + values are all IDs:

```json
"tags": { "vocab_mood": ["vocab_mood_snarky", "vocab_mood_wistful"] }
```

**Candidate B — Slugs only.** Status quo. Drift from §2.10 invariant
unless slugs are guaranteed immutable, which §4.3 explicitly forbids.

**Candidate C — Both.** Export emits both:

```json
"tags": {
  "mood": {
    "ns_id": "vocab_mood",
    "values": [
      { "id": "vocab_mood_snarky",   "slug": "snarky" },
      { "id": "vocab_mood_wistful",  "slug": "wistful" }
    ]
  }
}
```

Museum reads IDs; slug is informational for debugging / legacy
fallback.

**Candidate D — Sidecar resolution.** Tags stay slug-keyed in artifact
records; vocabulary.json has a `current_slug → id` map. Museum
resolves slugs to IDs at load time.

**Recommendation: Candidate A — IDs only, with the vocabulary table as
the sole resolution surface.**

Rationale:
- Single source of truth. `vocab_mood` is what artifacts reference;
  what visitors see comes from `vocabulary.json`. No drift possible.
- The export pipeline is already a transformation surface (MV slug
  → museum JSON). Adding ID resolution at that surface is one
  function call: when emitting a tag value, look up `(namespace, slug)
  → id` and emit the ID.
- Candidate D (sidecar) gives identical semantics to A but with an
  extra indirection at every read. A is simpler.
- Candidate C (both) doubles the JSON size, doubles the surface area
  for drift, and gives no benefit once the migration is past.

**Important nuance:** **During the migration window** (§4) the export
emits both keys for safety. Once the museum's matcher is verified to
read IDs correctly, the export stops emitting slugs. Sandbox-validated
before that flip.

**Operator decision needed:** YES. Operator locks (a) the steady-state
shape (recommended: IDs only) and (b) whether the migration window
emits both keys (recommended: yes, one release cycle).

---

### §3.4 — Q4: Migration path

**Question:** How do existing artifacts (with slug-keyed tags) get to
ID-keyed tags?

**Candidate A — One-shot migration script.** Runs once against MV's
SQLite, transforms every artifact's tags from slugs to IDs in place
(or in a duplicated `tags_v2` column), re-exports.

**Candidate B — In-place dual-lookup.** Museum's render code reads ID;
if no match in vocabulary table, falls back to slug-based lookup.
Temporary scaffolding, retired once all artifacts migrate.

**Candidate C — Both.** Run the script for the bulk migration; keep
the dual-lookup as a 1-release safety net.

**Recommendation: Candidate C — script for bulk, dual-lookup as safety
net for one release cycle.**

Rationale:
- The bulk migration must happen — `mood:snarky` in MV becomes
  `vocab_mood:vocab_mood_snarky` (or equivalent) in MV's `tags` JSON
  column. The script does this once.
- The dual-lookup catches anything the script missed (typo'd slug, a
  tag added between migration run and B-1 ship). Loud failure on
  unresolvable IDs is fine, but the failure surface is "operator sees a
  pill they don't recognize" — preferable that the museum renders the
  raw slug than that it renders nothing.
- After 1 release cycle of no-fallback-hits-logged, the dual-lookup is
  removed.

**Where the migration runs:** MV-side. The script reads MV's SQLite,
walks every artifact's `tags` JSON column, resolves each slug to its
vocabulary ID, writes the resolved tag list back. The vocabulary table
itself is generated as the first step of the script — walking every
unique `(namespace, slug)` across all artifacts and emitting one
vocabulary entry per unique pair. Operator then reviews the generated
vocabulary.json (slugs, display names, tier assignments) before
running the artifact-rewrite pass.

**Two-pass migration:**

1. **Pass 1 — generate vocabulary.json.** Script reads MV, emits a
   draft vocabulary table. Operator reviews and edits display names and
   tier assignments in MV's editor (or by hand-editing the JSON if B-2
   isn't built yet).
2. **Pass 2 — rewrite artifact tags.** Script reads the (now-locked)
   vocabulary table and rewrites every artifact's `tags` JSON to
   ID-keyed form. Atomic — pass 2 either succeeds or leaves MV
   unchanged.

**Operator decision needed:** YES. Operator locks (a) the two-pass
flow above, (b) whether the migration script lives in MV's repo or the
museum's repo (recommended: museum's `tools/`, since the museum owns
the vocabulary contract), and (c) the rollback procedure (recommended:
MV's `tags` column is backed up before pass 2; pass 2 is reversible).

---

### §3.5 — Q5: Render-layer changes

**Question:** What does `hr_dimensions.js` look like after refactor?

**Candidate A — Full rewrite.** New shape, new internals, same exports.

**Candidate B — Surgical replacement.** Keep `buildDimensions`,
`displayFor`, `slugify`. Replace only `TIER_BY_NAMESPACE` and
`prettify` with table-driven equivalents. `slugify` is preserved for
its callers but no longer load-bearing for tier/label logic.

**Recommendation: Candidate B — surgical replacement.**

The shape after B-1:

```js
import VOCAB from "../../data/vocabulary.json";

const ENTRIES_BY_ID = Object.fromEntries(
  VOCAB.entries.map(e => [e.id, e])
);

function entryFor(id) {
  return ENTRIES_BY_ID[id] ?? null;
}

function tierForNamespace(namespaceId) {
  return entryFor(namespaceId)?.tier ?? 3;
}

function displayForId(id, fallback) {
  return entryFor(id)?.display_name ?? prettify(fallback ?? id);
}

// prettify retained as fallback only — for IDs not in the table
// (broken data, mid-migration state). Loud-log in development.
function prettify(s) { /* unchanged */ }
```

`buildDimensions(artifacts)` becomes:

```js
export function buildDimensions(artifacts) {
  // Walk artifacts. For each tags key (namespace ID) and value (value ID),
  // collect.
  const valuesByNamespace = Object.create(null);
  for (const a of (artifacts || [])) {
    if (!a?.tags) continue;
    for (const nsId of Object.keys(a.tags)) {
      // exhibit: tag (now exhibit-namespace ID) still stripped.
      if (entryFor(nsId)?.slug === "exhibit") continue;
      const vs = a.tags[nsId];
      if (!Array.isArray(vs)) continue;
      const seen = valuesByNamespace[nsId] || (valuesByNamespace[nsId] = new Set());
      for (const valueId of vs) {
        if (typeof valueId === "string" && valueId.length > 0) seen.add(valueId);
      }
    }
  }

  // Order namespaces by their vocabulary sort_order, fall back to slug alpha.
  const namespaceIds = Object.keys(valuesByNamespace).sort((a, b) => {
    const ea = entryFor(a), eb = entryFor(b);
    return (ea?.sort_order ?? 999) - (eb?.sort_order ?? 999)
        || (ea?.slug ?? a).localeCompare(eb?.slug ?? b);
  });

  const dimensions = namespaceIds.map(nsId => {
    const valueIds = [...valuesByNamespace[nsId]].sort((a, b) => {
      const ea = entryFor(a), eb = entryFor(b);
      return (ea?.sort_order ?? 999) - (eb?.sort_order ?? 999)
          || (ea?.display_name ?? a).localeCompare(eb?.display_name ?? b);
    });
    const options = valueIds.map(id => ({
      slug: id,                                // ID is the key now
      label: displayForId(id, entryFor(id)?.slug),
    }));
    return {
      key: nsId,
      kind: "multi",
      tier: tierForNamespace(nsId),
      options,
      values: valueIds,
    };
  });

  const groupLabels = Object.fromEntries(
    namespaceIds.map(nsId => [nsId, displayForId(nsId, entryFor(nsId)?.slug)])
  );

  function displayFor(group, slug) {
    // `group` and `slug` are both IDs at the call site; preserve the param
    // names for callers' familiarity.
    return displayForId(slug, entryFor(slug)?.slug);
  }

  return { HR_DIMENSIONS: dimensions, HR_GROUP_LABELS: groupLabels, displayFor };
}
```

**What stays:**
- The `buildDimensions(artifacts)` external API. Callers
  (`HrExhibitFlow.jsx`) don't change.
- The `exhibit:` namespace stripping. Now keyed by the exhibit
  namespace entry's slug (or its known ID).
- The `slugify` export (used elsewhere for URL slug shaping, e.g.,
  generating MV-side slugs from display labels).
- The `prettify` fallback, kept as a safety net for IDs the table
  doesn't recognize. Dev-mode logs a warning when invoked.

**What goes:**
- `TIER_BY_NAMESPACE` — replaced by `tierForNamespace(id)` reading
  from `vocabulary.json`.
- Slug-derived `prettify` as the primary display path.

**`tier1Order` / `tier2Order` arrays** — the brief asks about these.
Neither currently exists as a named array in the code (grepped — no
hits). Ordering within a tier is currently alphabetical-by-namespace.
Under B-1, ordering moves into the vocabulary entry's `sort_order`
field. The data carries the order; no code-resident array.

**Operator decision needed:** NO. The §3.1, §3.2, §3.3 locks fully
determine §3.5's shape. The shape above is mechanical from the locks
upstream. Operator may eyeball the proposed code shape and flag any
specific change.

---

### §3.6 — Q6: Tab labels

**Question:** `TABS` in `HrExhibitFlow.jsx:124-130` currently hardcodes
"Artist" / "Formats" / "Deep Tracks". Canonical is "ARTIST" / "MEDIA"
/ "DEEP DIVE". Do labels move into the vocabulary table?

**Candidate A — Tab labels are vocabulary entries with `kind: "tab"`.**
One entry per tab. Looked up by `tier` (the visitor-facing index 1/2/3).

**Candidate B — Tab labels are a separate `tabs` section in
`vocabulary.json`.** Not a row alongside namespace entries; a
peer-level object.

**Candidate C — Tab labels stay in code, but the deck reads them from
a small constants object that's clearly intended for vocabulary
migration later.**

**Recommendation: Candidate A — tab labels are vocabulary entries with
`kind: "tab"`, looked up by tier.**

Rationale:
- F=ma. Tabs are a vocabulary concern. Putting them in the same table
  as namespaces and values keeps the F=ma promise.
- A future MV editor (B-2) presents one unified list of vocabulary
  rows; the operator can rename "ARTIST" → "Artist Info" by editing
  the same surface they use to rename a namespace.
- Same retire-vs-active semantics: an old tab name with `retired_at`
  set is preserved in the data, not surfaced.

**However: B-1 does not ship the corrected tab labels.** That's B-7.
B-1 ships the *capability* to label tabs from data; B-7 flips the
labels from "Artist/Formats/Deep Tracks" to "ARTIST/MEDIA/DEEP DIVE"
in the same act that the operator (or B-2's UI) edits the vocabulary
table. The reason to defer: B-1 is a data-plumbing PR; B-7 is a
visitor-facing UX change that should be reviewed as a labeling
decision on its own merits (with the operator confirming "ARTIST" is
still the locked label vs. potentially "ARTIST INFO" or similar).

**Operator decision needed:** YES — operator confirms tabs go in the
same table (recommended) and confirms the deferral of the actual
label change to B-7.

---

### §3.7 — Q7: Variant taxonomy (Exhibit.jsx `TAG_SLOTS`, `TYPE_META`)

**Question:** `Exhibit.jsx:6-18` hardcodes the music-variant taxonomy:

```js
const TAG_SLOTS = ["official", "live", "lyrics", "clip", "cover"];
const TYPE_META = {
  official: { label: "OFFICIAL", color: "#b8974a" },
  live:     { label: "LIVE",     color: "#4a8a6a" },
  clip:     { label: "CLIP",     color: "#a07840" },
  lyrics:   { label: "LYRICS",   color: "#7a6a9a" },
  cover:    { label: "COVER",    color: "#3a7a9a" },
  hr_cover: { label: "COVER",    color: "#3a7a9a" },
  fan_cover:{ label: "COVER",    color: "#3a7a9a" },
};
```

Per `CLAUDE.md`, clips were retired from spine data (commit `e4ea01b`)
but `"clip"` still appears in `TAG_SLOTS` and `TYPE_META`. Per F=ma,
should this become vocabulary?

**Candidate A — Yes, fold into vocabulary table.** A `track_variant`
namespace with values `official / live / lyrics / cover` (clip retired
properly).

**Candidate B — No, leave as a separate concern.** Track-video
variants live on the spine (`src/data/artists/hunter-root.js`'s
`videos: [{ type: "..." }]`), not on artifact records. They're a
spine-level concept, not a museum-tag concept. Variants govern player
behavior (queue ordering, label, color) — not pill columns.

**Candidate C — Yes, but in a sibling table.** A
`track_variant_taxonomy.json` that lives next to `vocabulary.json`,
identical shape. Acknowledges the F=ma intent without conflating
spine-level data with artifact-tag data.

**Recommendation: Candidate B for B-1; Candidate C for B-8.**

Rationale:
- The variant taxonomy is a different surface — it governs how track
  videos behave in the player, not how artifacts surface in pill
  columns. They share F=ma DNA (uniform data, not code) but they're
  not the same data.
- Conflating them risks the vocabulary table growing roles beyond
  "pill columns and tab labels" and becoming a junk drawer.
- B-1 should ship narrow. B-8 picks up variant taxonomy as a separate
  data-ification PR.
- Worth noting: `TAG_SLOTS` containing `"clip"` is a small drift bug
  that B-8 will fix incidentally. Not a B-1 concern.

**Operator decision needed:** NO. The recommendation is the
conservative default (don't widen B-1 scope); locking it requires only
operator agreement that B-8 picks this up later.

---

### §3.8 — Q8: Export pipeline impact

**Question:** Does `tools/export-artifacts.mjs` change? Does it write
vocabulary into per-exhibit JSON or bundle vocabulary separately? Does
the legacy CSV/JSON get retired?

**Candidate A — Vocabulary bundled separately.** Export writes
`src/data/exhibits/<name>.json` (artifacts only, ID-keyed) AND
`src/data/vocabulary.json` (vocabulary table). Two files, two
responsibilities.

**Candidate B — Vocabulary embedded in each exhibit's JSON.** Every
exhibit file carries its own copy of the vocabulary table.

**Candidate C — Vocabulary stays out of export; museum repo hand-edits
the table.** Export only emits artifacts.

**Recommendation: Candidate A — vocabulary as a sibling file, emitted
by the same export run.**

Rationale:
- Single export command remains the path. `npm run export-artifacts`
  produces both artifacts and vocabulary in one atomic operator
  action.
- Vocabulary changes flow through the same atomic-write semantics as
  artifact exports (temp file + rename).
- Per-exhibit embedding (B) duplicates the vocabulary 1:N. Wasteful;
  more importantly, opens the door to vocabulary drift across
  exhibits.
- Hand-editing the museum repo (C) defeats the purpose of MV-as-
  source-of-truth.
- Vocabulary table size at full scale (~50 namespaces × ~30 values =
  ~1500 entries × ~200 bytes/entry ≈ 300KB) is well under any size
  budget; bundling once is cheap.

**Export contract additions:**
- New CLI flag: `--vocabulary-out <path>` (default
  `src/data/vocabulary.json`).
- New atomic write: vocabulary JSON written via temp+rename.
- Per-artifact tag emission switches from slug-keyed to ID-keyed.
  Slug-keyed dual-emit during migration (per Q3 nuance).

**Legacy CSV/JSON disposition for B-1:**
- `docs/deep-dive-vocabulary.csv` — kept. Not in B-1's scope to
  retire.
- `tools/build-deep-tags-vocabulary.mjs` — kept. Still emits
  `src/data/deep-dive-vocabulary.json` for any consumer (currently
  none in `src/`, but the build script is still wired into `npm run
  prebuild` presumably).
- `src/data/deep-dive-vocabulary.json` — kept, unused by `src/` but
  present.
- `vocabulary_csv_sha` in exhibit metadata — kept, informational only.

These retire in a follow-up PR after B-1 + B-2 are operational, when
no consumer references them.

**Operator decision needed:** YES — operator locks (a) vocabulary in
separate file, (b) export emits both, (c) legacy CSV stays for now.

---

### §3.9 — Q9: Operator UX surface contract

**Question:** Per `DATA_WORKFLOW_SPEC §3.3`, vocabulary editing lives
inside MV. B-1 does not build that UI — but it must produce a
vocabulary table MV can later expose for editing. What contract does
B-1 expose? What invariants must B-2 maintain?

**Recommendation (contract that MV-side B-2 must honor):**

1. **`id` is immutable.** Once assigned to an entry, never changed,
   never reused if the entry retires. MV's editor must not expose an
   "edit ID" affordance.

2. **`slug` is operator-editable but **must be unique within
   namespace**.** Renaming `mood`'s `snarky` slug to `cheeky` is
   allowed iff no other value in `mood` already has slug `cheeky`.
   For namespace-kind entries, slug must be unique across all
   `kind: "namespace"` entries. For tab-kind entries, slug unique
   across `kind: "tab"`.

3. **`display_name` is operator-editable, uniqueness not required.**
   Two tags can share a display name if the operator decides (e.g.,
   "Cover" appears in both `track_variant:hr_cover` and
   `track_variant:fan_cover` historically).

4. **`tier` is operator-editable for namespace-kind entries only.**
   Value-kind and tab-kind entries inherit their namespace's or
   tab's tier. Changing a namespace's tier moves its pill column to a
   different tab on the next render.

5. **`namespace_id` is set at value creation and immutable.** A value
   belongs to one namespace; if the operator wants to "move" it,
   they retire the old entry and create a new one in the target
   namespace.

6. **`sort_order` is operator-editable; null means "default ordering"
   (alphabetical-by-display-name within tier).**

7. **`retired_at` is operator-toggleable.** Setting `retired_at` to
   the current ISO timestamp retires the entry. Setting it back to
   `null` un-retires.

8. **Retired entries persist in the table.** They are filtered out of
   operator pick-lists (for tagging new artifacts) and out of pill
   columns (per CANONICAL_VOCABULARY's catch-all-tier-membership
   rules), but the entry's `id` continues to resolve, so artifacts
   that still carry the retired tag continue to render labels
   correctly (per sovereign-tag-set invariant).

9. **The vocabulary table is the single source of truth.** MV's
   editor writes to MV's SQLite; export emits the JSON. Operator
   doesn't hand-edit `vocabulary.json` once B-2 ships.

10. **Adding a new entry assigns an ID immediately at creation.** The
    operator-visible name is `display_name`; the operator-typed
    short name (if requested) becomes `slug`; the ID is generated
    by MV from the initial slug (per Q2's slug-derived-but-frozen
    recommendation).

**Operator decision needed:** YES — operator locks the contract above.
This contract is what B-2 will be specified against; B-1 needs to know
it before emitting the table format.

---

### §3.10 — Q10: Sandbox testing strategy

**Question:** Per release discipline, B-1 must be sandbox-tested before
reaching the museum. What's the dev-side test plan?

**Recommendation — the following five test phases run in dev before
B-1 lands on `main`:**

**Phase 1 — Vocabulary table emission test.**
- Run the migration script's pass 1 against a non-trivial MV snapshot
  (operator selects an MV state with at least one artifact in every
  namespace).
- Verify: `vocabulary.json` has one entry per unique `(namespace, slug)`
  pair. Tier assignments default sensibly (operator inspects). All
  IDs are unique. No retired entries (pass 1 doesn't retire).

**Phase 2 — Artifact rewrite test.**
- Run pass 2 against the same MV snapshot.
- Verify: every artifact's `tags` JSON is now ID-keyed. Diff before/after
  shows mechanical slug→ID rewrites only, no semantic changes.
- Reversibility test: a separate "downgrade" script reverses the
  rewrite using the same vocabulary table. The diff before/after the
  round trip is empty.

**Phase 3 — Export pipeline test.**
- `node tools/export-artifacts.mjs --dry-run --verbose` against the
  migrated MV snapshot.
- Verify: dry-run summary reports the expected exhibit counts.
  Vocabulary emission count matches Phase 1's table size.
- Live export.
- Verify: `src/data/exhibits/hunter_root.json` is ID-keyed in `tags`.
  `src/data/vocabulary.json` exists with the expected entries.

**Phase 4 — Render test.**
- `npm run dev`. Open `/hr`.
- Verify: every pill column renders. Pill labels match
  `display_name` for each ID. Tier assignments are honored — Tier 1
  shows year/album/song/venue/people if any of those namespaces
  exist in the data.
- Verify the empty-vocab case: if `vocabulary.json` has an entry for
  `mood` but no artifacts carry `mood` tags, the column does not
  surface (per current dynamic-discovery semantics). The vocabulary
  table is a labeling and ordering layer; presence in the table
  alone does not create a pill column.
- Verify the unknown-ID case: hand-insert a tag ID into a test
  artifact that is NOT in `vocabulary.json`. Verify the museum
  surfaces the pill using `prettify(id)` as a fallback and logs a
  dev-mode warning.

**Phase 5 — Build + lint.**
- `npm run lint` — must remain at baseline (4 errors / 6 warnings per
  CLAUDE.md).
- `npm run build` — must pass.

**"Sandbox-validated" definition:** all five phases pass against a
fresh MV snapshot, with the operator personally walking the `/hr`
deck and confirming pill columns render correctly. Operator runs the
test in dev (Vite dev server) before B-1 is committed to `main`.

**Manual verification before release:**
- Operator opens MV, sees the curation surface still works (B-1 must
  not break MV's existing curation UI — it only changes what gets
  emitted at export).
- Operator runs export, sees the new files, scans them.
- Operator opens the dev museum, scans `/hr`.

**Operator decision needed:** NO (Cowork's recommendation stands).
Operator may add tests but the five-phase shape is defensible.

---

## §4 — Migration Path

### §4.1 — Sequencing (concrete order of operations)

1. **Operator locks §3 questions Q1, Q2, Q3, Q4, Q6 (deferral), Q8,
   Q9 in §6 of this plan.**
2. **MV-side: add a `vocabulary` table to MV's SQLite** (schema mirrors
   the JSON shape; `id`, `kind`, `slug`, `display_name`, `tier`,
   `namespace_id`, `sort_order`, `retired_at`, plus standard MV
   columns `created_at`, `updated_at`).
3. **MV-side: write the migration script** (separate file, `tools/`
   in the museum repo per Q4 lock).
   - Pass 1: walks artifacts, emits draft vocabulary rows into MV's
     new `vocabulary` table. Operator reviews.
   - Pass 2: walks artifacts again, rewrites each `tags` JSON column
     from slug-keyed to ID-keyed.
   - Backup: pass 2 writes the original `tags` to a sibling column
     `tags_v0` for one-shot reversibility.
4. **Museum-side: update `tools/export-artifacts.mjs`.**
   - Add `--vocabulary-out` flag (default `src/data/vocabulary.json`).
   - Read MV's new `vocabulary` table; atomic-write
     `vocabulary.json`.
   - Per-artifact tag emission: read MV's ID-keyed `tags`; emit ID-
     keyed JSON unchanged.
5. **Museum-side: update `src/routes/hr/hr_dimensions.js`** per §3.5.
6. **Museum-side: update `HrExhibitFlow.jsx`** — minimal changes. The
   `TABS` array stays string-labeled for B-1; only `displayFor` and
   `HR_GROUP_LABELS` consumers benefit immediately. (Tab label data-ization
   is B-7.) The `exhibit:` strip becomes an ID lookup (its namespace
   entry's slug is `"exhibit"`).
7. **Sandbox-validate** per §3.10's five phases.
8. **Commit.** Three coordinated commits across the museum repo:
   (a) `tools/export-artifacts.mjs` + new migration tool; (b)
   `src/routes/hr/hr_dimensions.js` + vocabulary import; (c)
   `src/data/vocabulary.json` + `src/data/exhibits/*.json` (the
   migrated outputs). MV-side changes ship in MV's repo
   (out-of-scope for the museum's CLAUDE.md flow but coordinated by
   the operator).
9. **Operator opens PR, pushes, reviews, merges per CLAUDE.md
   workflow.**

### §4.2 — Rollback procedure

If post-merge the museum surfaces are broken:

1. **Museum-side:** `git revert` the merge commit. Museum reverts to
   slug-keyed behavior on the next deploy.
2. **MV-side:** the migration script's pass 2 wrote `tags_v0` columns.
   A reverse-migration restores `tags` from `tags_v0`. Operator runs
   this in MV before re-attempting B-1.
3. **No data loss.** All MV records are preserved across migration
   and rollback by design (per `DATA_WORKFLOW_SPEC §2.2`
   edit-in-place + §2.3 sovereign-tag-set invariants).

### §4.3 — What B-1 leaves worse in the interim

Honest accounting of what gets uglier before it gets better:

- **`hr_dimensions.js` adds an import** from `src/data/vocabulary.json`.
  One more build-time dependency.
- **`vocabulary.json` adds ~5KB to bundle size** (initial HR-only data
  scale). At full multi-exhibit scale this grows to ~50–300KB.
  Probably worth a build-time inlining strategy at some point; not a
  B-1 concern.
- **The `prettify` fallback path remains** in `hr_dimensions.js`,
  marked clearly as a safety net. Some future cleanup PR removes it
  once the vocabulary table is verified complete.
- **MV's SQLite schema grows.** Schema migrations are MV's domain; the
  museum sees only the export output.
- **The dual-lookup (Q3 migration nuance) adds code complexity for
  one release cycle** before being retired. Worth it for safety.

Nothing about B-1 makes the visitor experience worse. The interim
costs are all on the dev side.

---

## §5 — Sandbox Testing Plan

(Already detailed in §3.10. Restated here for completeness with the
explicit pass/fail criteria.)

### §5.1 — Pass criteria

A B-1 candidate is sandbox-validated when:

1. **Migration pass 1 emits a clean vocabulary table.** No duplicate
   IDs. Every unique `(namespace, slug)` in MV has a corresponding
   entry. Operator inspects the table and confirms display names and
   default tier assignments are sensible.

2. **Migration pass 2 leaves MV's artifact data round-trippable.** A
   reverse-migration produces a byte-for-byte match against MV's
   pre-migration state (modulo `updated_at` timestamps).

3. **Export emits both files atomically.** `src/data/exhibits/*.json`
   and `src/data/vocabulary.json` both exist after a successful
   export. Crash mid-export leaves the previous files intact.

4. **Museum renders without error.** `/hr` loads. Every pill column
   shows the expected `display_name`. Tier assignments match
   `vocabulary.json` data. Console has no errors. Dev-mode warnings
   for unknown IDs are zero (or are explained by hand-introduced
   test artifacts).

5. **Filter behavior is preserved.** Selecting a pill narrows the
   artifact grid identically to the pre-B-1 behavior. Empty-group-
   silent still works. Count display updates correctly.

6. **Build is clean.** `npm run build` succeeds. `npm run lint`
   stays at baseline.

7. **The fallback path is exercised by test.** A hand-introduced
   artifact with an ID not in `vocabulary.json` renders with
   `prettify`-derived label and produces a dev-mode warning.

### §5.2 — Operator's pre-release checklist

Before pushing B-1 to `main`:

- [ ] §3 questions Q1, Q2, Q3, Q4, Q6, Q8, Q9 are locked in this
  document's §6 (or operator overrides documented inline).
- [ ] Migration pass 1 has been run and operator has reviewed the
  draft `vocabulary.json`.
- [ ] Migration pass 2 has been run; reverse-migration succeeds.
- [ ] `npm run export-artifacts` succeeds end-to-end.
- [ ] `npm run dev` produces a clean `/hr`.
- [ ] `npm run build` + `npm run lint` succeed at baseline.
- [ ] Operator has personally clicked through at least one pill in
  each tier and confirmed expected filtering.
- [ ] PR body documents the three-commit shape (or single-commit if
  squashed) and references this plan.

---

## §6 — Risks and Open Questions

These items need operator decision before code begins. Each is
recommended above; operator confirms or overrides.

### §6.1 — Questions requiring operator lock

| # | Question | Recommendation | Status |
|---|---|---|---|
| Q1 | Data shape — file vs DB, mono vs per-namespace, schema | Monolithic JSON, `src/data/vocabulary.json`, schema in §3.1 | locked-2026-05-13 |
| Q2 | Stable-ID scheme | Slug-derived but frozen, `vocab_<slug>` prefix | locked-2026-05-13 |
| Q3 | Artifact tag keying | IDs only steady-state; both during 1 migration cycle | locked-2026-05-13 |
| Q4 | Migration path | Two-pass script (pass 1 emit table, pass 2 rewrite artifacts); migration script lives in museum's `tools/` | locked-2026-05-13 |
| Q5 | Render-layer changes | Surgical replacement in `hr_dimensions.js` per §3.5 | recommended-and-clear |
| Q6 | Tab labels | Vocabulary entries with `kind:"tab"`; actual label fix deferred to B-7 | locked-2026-05-13 |
| Q7 | Variant taxonomy | Out of B-1 scope; folded into B-8 with its own data file | surfaced-and-deferred |
| Q8 | Export pipeline | Vocabulary as sibling file; legacy CSV stays | locked-2026-05-13 |
| Q9 | Operator UX contract | Ten invariants per §3.9 | locked-2026-05-13 |
| Q10 | Sandbox testing | Five-phase plan per §3.10 | recommended-and-clear |

### §6.2 — Risks beyond the questions

**R1 — MV schema migration is non-trivial.** MV must add a
`vocabulary` table, and its `artifacts.tags` JSON column's contents
must rewrite. MV's `db_migrate.py` (per `export-artifacts.mjs:202`)
must grow to handle this. The migration's reversibility (via
`tags_v0` backup column) is the safety net.

**R2 — Slug uniqueness during the operator-edit pass 1 review.** When
the operator reviews the draft `vocabulary.json` (after pass 1),
they may discover two artifacts have used the same slug for different
intents (e.g., a `mood:dark` from early curation that should now be
`mood:moody-dark` to avoid colliding with a `theme:dark`). Pass 1
must surface duplicate-slug-different-meaning candidates for operator
resolution before pass 2 runs.

**R3 — `exhibit:` namespace identity.** The strip-`exhibit:` logic in
`hr_dimensions.js:104` currently keys on the string `"exhibit"`. Under
B-1, it must key on the vocabulary entry whose slug is `"exhibit"`.
If `exhibit` is renamed (operator's prerogative under §4.3 of the UX
spec), the strip logic must follow. Recommendation: in
`hr_dimensions.js`, look up the entry by slug at load time and cache
its ID; the strip becomes an ID comparison. Operator-rename-safe.

**R4 — Per-exhibit vs cross-exhibit vocabulary.** The vocabulary
table is currently scoped to "the museum." If Carsie Blanton's
exhibit (UX_SPEC §E, deferred) wants different Tier 1 namespaces
than HR, the table needs an `exhibit_id` field or an "applies to
exhibits" predicate. Per `UX_CONTROLS_SPEC` Q12 (deferred), this is
acknowledged but unresolved. **B-1 ships single-exhibit vocabulary
(HR only).** Multi-exhibit vocabulary surfaces a follow-up question;
not a B-1 blocker.

**R5 — Bundle-size growth.** At HR-only scale, `vocabulary.json` is
~5KB. At museum-full scale it could reach 300KB. Bundle-size impact
is real if every visitor loads it. Not a B-1 blocker; mitigation
(lazy load, per-exhibit slicing) is a future concern.

**R6 — Cowork FUSE quirks during the actual code-write session.** Per
CLAUDE.md §quirk-1, the Edit tool can truncate. Per quirk-2, CRLF
line endings. Per quirk-3, `rm` requires permission. The future B-1
implementation session must observe these — not a planning concern,
but worth flagging so the code session doesn't re-discover them.

### §6.3 — Closed-during-planning items

These were surfaced and resolved during the read, not operator-blocking:

- The `tier1Order` / `tier2Order` arrays referenced in the brief do
  not exist as named variables in the code. Ordering is implicit
  (alphabetical-by-namespace at present). Under B-1, ordering moves
  into `sort_order`. No legacy arrays to migrate.
- `prettify` retains its callers (the search input lowercasing, the
  preset-summary fallback, the dev-mode warning fallback in
  `displayFor`). Kept as a utility.
- `slugify` is unused load-bearing-ly today (per its own comment)
  but exported for parity. B-1 leaves it alone.

### §6.4 — Closed-during-operator-review (2026-05-13)

Operator review session, 2026-05-13. Seven questions surfaced as
needing operator lock; all seven now locked. Audit trail below.
Cowork-facilitated walk-through; operator confirmed each lock in
turn. Where the operator's own framing collapsed an Ops question
back to "this isn't mine to decide," the lock follows the plan's
recommendation as-recommended.

- **Q1 — Data shape.** Locked at recommendation. Single JSON file at
  `src/data/vocabulary.json`, one flat list, every row tagged with
  `kind: namespace | value | tab`. MV writes during export; museum
  reads on load. Operator classified as Ops, not UX; recommendation
  accepted without modification.

- **Q2 — Stable-ID scheme.** Locked at recommendation. IDs shaped
  `vocab_<frozen_initial_slug>`, immutable from creation, opaque to
  the operator-facing surface (per §2.10). Survives slug and
  `display_name` renames. Readability tension flagged during review
  (the ID visibly preserves the original slug after renames, even
  when both slug and display_name change) and accepted as Ops-only
  debug concern. Operator classified as Ops; recommendation accepted.

- **Q3 — Artifact tag keying.** Locked at recommendation. Steady
  state: artifacts reference IDs only. During the one migration
  cycle, export dual-emits ID + slug; museum reads ID with slug
  fallback on miss. Slug emission drops after one clean release with
  zero fallback hits logged. Operator classified as Ops;
  recommendation accepted.

- **Q4 — Migration path.** Locked at recommendation. Two-pass script
  in museum `tools/`. Pass 1 emits draft vocabulary for operator
  review; pass 2 rewrites artifact tags to ID form. Original `tags`
  preserved as `tags_v0` column in MV for one-shot reversibility.
  Operator classified as Ops; recommendation accepted.

- **Q6 — Tab labels in vocabulary.** Locked at recommendation. Tabs
  are vocabulary entries with `kind:"tab"`. Forced by F=ma; not a
  real operator choice. Actual label correction (Artist/Formats/Deep
  Tracks → ARTIST/MEDIA/DEEP DIVE) deferred to B-7 as a scoped
  follow-up. Operator classified the data-shape half as Ops and the
  deferral half as sequencing; recommendation accepted.

- **Q8 — Export pipeline.** Locked at recommendation. Single
  `npm run export-artifacts` emits `src/data/vocabulary.json` and
  `src/data/exhibits/<name>.json` as siblings, each atomic
  (temp + rename). Legacy `docs/deep-dive-vocabulary.csv` and
  `tools/build-deep-tags-vocabulary.mjs` stay in place; retirement
  deferred to a cleanup PR after B-1 + B-2 are operational. Operator
  classified as Ops; recommendation accepted.

- **Q9 — Operator UX contract.** Locked at the ten invariants per
  §3.9. Walkthrough surfaced one genuine UX choice inside the
  contract: whether two vocabulary entries can share the same
  `display_name`. **Operator selected "allow duplicates"** — trusts
  the operator, matches the legacy `hr_cover` / `fan_cover` precedent
  where both rendered as "Cover" in the player. The remaining nine
  invariants accepted as forced by F=ma, the §2.10 stable-ID
  invariant, the sovereign-tag-set invariant, or basic data sanity —
  none were real operator choices on inspection.

Status of Q5, Q7, Q10 unchanged — already `recommended-and-clear` or
`surfaced-and-deferred` at planning time, with no operator decision
required.

Plan is ready for commit. Next session can begin B-1 implementation
scoping per §4 sequencing — MV-side `vocabulary` table + migration
script first, then museum-side export + render changes, with the
five-phase sandbox validation per §3.10 gating the merge to main.


---

## §7 — Sequencing

### §7.1 — What ships in B-1

- `src/data/vocabulary.json` (the table itself, generated by
  migration pass 1 + operator review).
- `src/data/exhibits/hunter_root.json` regenerated, ID-keyed.
- `src/routes/hr/hr_dimensions.js` updated per §3.5. Reads
  vocabulary.json. Replaces `TIER_BY_NAMESPACE` and `prettify`-as-
  primary with table lookups.
- `tools/export-artifacts.mjs` updated to emit the vocabulary
  sibling file and to read MV's ID-keyed tags.
- `tools/migrate-vocabulary.mjs` (new) — the two-pass migration
  script. Lives in the museum repo for git-history and discoverability;
  reaches into MV's loopback API for reads/writes.
- MV-side: `vocabulary` table added; `db_migrate.py` updated;
  artifacts' `tags` JSON migrated.

That's the ship. Tab labels stay wrong; variant taxonomy stays in
code; legacy CSV stays. Each of those is a separate, sequenced
follow-up.

### §7.2 — What B-1 unblocks

**B-7 — Tab labels (Artist → ARTIST, Formats → MEDIA, Deep Tracks →
DEEP DIVE).** After B-1 lands, the vocabulary table has
`kind:"tab"` rows with `display_name` strings. B-7 changes
`HrExhibitFlow.jsx`'s `TABS` array to read from `vocabulary.json`
(or computes tab labels at module load from the table) and fixes the
three labels. Small PR, narrow blast radius.

**B-8 — Variant taxonomy.** Track-video variants
(`Exhibit.jsx:TAG_SLOTS`, `TYPE_META`) become data. B-8 introduces a
sibling vocabulary file (`src/data/track_variants.json` or similar,
same schema shape as `vocabulary.json`) and updates `Exhibit.jsx` to
read from it. The B-1-built export pipeline can be extended to emit
this file too if MV grows a parallel table; or it stays
museum-repo-hand-edited if MV doesn't curate variants. B-8 decides.

**B-3 (partial) — Card shape.** Per `UX_LIFECYCLE §4.1`, cards are
curator-selectable in S/M/L for both axes. The card-shape data
field (per artifact: `card_shape: { w: "M", h: "L" }`) is independent
of vocabulary; B-1 doesn't ship it. But B-1's vocabulary table is the
template for any future per-artifact data field added through the
same data-driven lens: an additional namespace, a vocabulary entry
per shape value, ID-keyed tag on the artifact. B-3 inherits the
plumbing patterns B-1 establishes.

### §7.3 — What stays explicitly out of B-1

- Tab label correction (deferred to B-7).
- Variant taxonomy migration (deferred to B-8).
- Card-shape data field (deferred to B-3).
- Legacy CSV/JSON retirement (deferred to a cleanup PR after B-1+B-2).
- MV-side operator editor UI (deferred to B-2; B-1 produces the
  contract that B-2 honors).
- Multi-exhibit vocabulary scoping (deferred; HR-only for now).
- Bundle-size optimization (deferred; not currently a problem).

---

## §8 — How this plan was constructed

This plan was authored from a read-only investigation in a Cowork
session on 2026-05-12. The files read in order:

1. `CLAUDE.md` — release discipline, FUSE quirks, file layout.
2. `docs/canonical/UX_LIFECYCLE_SPEC_v0.5.md` — §4.3 vocabulary-as-
   data, §1 #1 + #9 invariants.
3. `docs/canonical/DATA_WORKFLOW_SPEC_v0.2.md` — §2.10 stable-ID,
   §3.3 vocabulary management surface, §6 closed decisions.
4. `docs/CANONICAL_VOCABULARY.md` — tier structure.
5. `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` — tier rendering context,
   §13 observed behaviors.
6. `src/routes/hr/hr_dimensions.js` — full file.
7. `src/routes/hr/HrExhibitFlow.jsx` — TABS array, dimension
   consumption, displayFor/HR_GROUP_LABELS consumers.
8. `src/routes/exhibit/Exhibit.jsx` — TAG_SLOTS + TYPE_META.
9. `tools/export-artifacts.mjs` — full file.
10. `tools/build-deep-tags-vocabulary.mjs` — full file.
11. `src/data/deep-dive-vocabulary.json` — actual contents.
12. `src/data/exhibits/hunter_root.json` — actual contents
    (artifacts: []).
13. `docs/deep-dive-vocabulary.csv` — actual contents.

Greps confirmed: no `tier1Order` / `tier2Order` arrays exist; no
`B-1` / `B-7` / `B-8` strings anywhere in the repo (the backlog
items are referenced abstractly in UX_LIFECYCLE_SPEC §6 closed
decisions only); `deep-dive-vocabulary.json` is no longer imported
by any source file under `src/`.

No code changes were made. No git operations were performed. No
commits to canonical docs. This plan document is the only artifact
produced.

---

*End of B1_IMPLEMENTATION_PLAN.md.*
