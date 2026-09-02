# End-to-End Workflow Map — Tag-Based Artifact Discovery

**Date:** 2026-05-11
**Scope:** Map of the workflow from artifact preparation in MediaVault to visitor-facing tag-filtered display in the museum, as currently implemented on `main` of both repos. Descriptive, not prescriptive — divergences are documented, not patched.

**Note on scope:** the brief asked for "all four PRIORITY4 verification reports." The folder `docs/deep-dive-review/` contains three: `PRIORITY4_VERIFICATION.md`, `PRIORITY4B_CARD_RENDERING.md`, `PRIORITY4C_CARD_IDENTITY.md`. No `PRIORITY4D` (or similarly-named fourth report) exists at the time of writing.

---

## The intended workflow (per operator's correction)

1. Operator prepares an artifact in MediaVault (adds a YouTube video, curates tags).
2. Operator releases the artifact in MediaVault.
3. Operator runs an export from their laptop. The export pulls released artifacts from MV and writes them to a JSON file in the museum repo.
4. Operator commits the JSON. Builds the museum. Deploys.
5. Visitor opens the museum, sees the artifacts displayed, filters by tag pills, the displayed set narrows.

This is the five-step flow under test. Every section below names what is actually wired on disk against that step.

---

## Step 1 — Artifact preparation in MV

**Intent:** Operator curates an artifact (YouTube video or other) and attaches tags.

**Current implementation:**

Two distinct code paths participate:

(a) **Standard intake and tagging.** A new artifact arrives via `handle_artifact_register` (POST `/api/artifact-register`) in `MediaVault/core/imgserver_extensions.py`. The handler accepts `source_url`, `source_platform`, `media_type`, `tags`, `notes`, and the rest of the `artifacts` schema (`SPEC.md §6`, `imgserver_extensions.py:196-374`) and writes one row to the `artifacts` table. For YouTube ingest specifically, this produces a parent (`media_type='link'`, `parent_artifact_id IS NULL`) plus two children (thumbnail `media_type='photo'`, transcript `media_type='text'`) all sharing one `source_url` (`PRIORITY4_VERIFICATION.md` Q1).

The operator then opens the Inbox/Vault pill wall (mediavault.html) and clicks pills to set tags. The pill wall is grouped by `category` (`bands | era | people | places | content_kind | topic | platform | rarity | NULL`, per `SPEC.md §2.1`). On save, all "on" and still-"suggested" pills are written into `artifacts.tags` (`SPEC.md §2.3`). A representative live row (`MV-20260510-001`, the Reverend test artifact) currently carries:

```
tags = ["author:hunter_root", "content_kind:official", "platform:youtube", "scope:hunter_root"]
```
(`PRIORITY4_VERIFICATION.md` Q1, full-row dump.)

(b) **Deep Dive curation tab** (Phase 4, commit-referenced as `d52e3ef` in the brief). A new "Deep Dive" tab in the Vault detail panel, implemented in `mediavault.html` (lines ~2007–2225) plus the two new handlers `handle_deep_dive_vocabulary` (GET `/api/deep-dive-vocabulary`) and `handle_artifact_deep_dive_save` (POST `/api/artifact-deep-dive-save`) in `imgserver_extensions.py:478-899`.

The tab fetches the vocabulary CSV from the museum repo at the hardcoded absolute path `C:\AI\Projects\weird-baby-museum\docs\deep-dive-vocabulary.csv` (`imgserver_extensions.py:497-499`), presents one collapsible `<details>` per group, lets the operator click pills, type free-form additions, and **requires the operator to enter a museum-side `card_id`** (e.g., `art-014`) into an explicit text field above the pill groups (`mediavault.html:2170-2192`).

On save (`handle_artifact_deep_dive_save`, `imgserver_extensions.py:673-896`), the handler:

- Rewrites `artifacts.tags`: keeps every existing tag that does **not** start with `deep:`, then appends `deep:<group>:<tag>` for each selected pair (`imgserver_extensions.py:803-806`). The non-deep prefix tags carried by the standard pill wall (e.g., `author:hunter_root`, `scope:hunter_root`) are preserved untouched.
- Rewrites `artifacts.notes` to a JSON-array string. Strips any prior `card_id:*` element, appends `card_id:<value>` if the operator typed one. Pre-existing free-form notes are wrapped as a single-element array on first touch (`imgserver_extensions.py:813-821` and `_parse_notes_array` at `:582-611`).
- Inserts vocabulary rows into MV's `tags` table for any selected `deep:<group>:<tag>` not already present, with `is_proposed=1` for free-form additions and `is_proposed=0` for CSV-sourced ones (`imgserver_extensions.py:823-865`). Note: `SPEC.md §2.5` says `is_proposed` was removed in v0.5; Phase 4 writes it anyway, implying the actual schema still has the column even though the spec text removed it.
- Bumps/decrements `usage_count` for changed `deep:*` slugs (`:867-878`).

**Data shape at this stage** (after a Deep Dive save against `MV-20260510-001`, assuming the operator typed `card_id: art-014` and selected mood:snarky + motif:pink-hats):

```
artifacts row, columns relevant to Deep Dive:
  id           = "MV-20260510-001"
  status       = "vault"                          (still vault; release is a separate click)
  source_url   = "https://www.youtube.com/watch?v=7Lttb_59EYw"
  source_platform = "youtube"
  parent_artifact_id = NULL
  tags         = JSON: ["author:hunter_root", "content_kind:official",
                        "deep:mood:snarky", "deep:motif:pink-hats",
                        "platform:youtube", "scope:hunter_root"]
                (sorted alphabetically by the save handler at :806)
  notes        = JSON: ["suggest_pill: era:arkansas", "card_id:art-014"]
                (the prior plain-text note got wrapped; the card_id appended)
  released_at  = NULL
```

**Where data flows next:** Stays in MV's SQLite. The next step in the operator's workflow is the explicit Release click (Step 2). The export (Step 3) only reads rows whose `status = 'released'`.

**Divergence from intent:**

The operator's framing for this step is "operator prepares an artifact in MV (e.g., adds a YouTube video, curates tags)." MV's job is artifact preparation. Phase 4's Deep Dive tab violates that scope in one specific way: **the `card_id` field**. The tab requires the operator to enter a museum-side card identifier (`art-014`, `arc-007`, etc.) as part of curating an artifact in MV. The save handler refuses the save without it (`imgserver_extensions.py:772-774` — `"card_id key required (empty string allowed to clear)"`). That card identifier is a museum concept — it names a card in `hr_artifacts.js` / `hr_archive.js` / `hr_exit_flow.js`. MV holds it inside `artifacts.notes` as a `card_id:<value>` token so the export can later read it back.

In the spec, this is `[locked: Ops]` Q-1 — the proposal that MV's `notes` is where the card-binding lives — surfaced because the architecture requires *some* place to remember which museum card a given MV artifact's Deep Dive curation attaches to (`SPEC_DRAFT_v3.md` Q-1, §3.2 step 7). In the operator's current correction, the answer is different: MV does not bind to cards. The card-binding-in-MV pattern is the divergence.

The rest of Step 1 — pill curation on `artifacts.tags`, the `deep:` prefix namespace, the vocabulary CSV lookup — matches the intent that MV is where tags get curated.

---

## Step 2 — Artifact release in MV

**Intent:** Operator releases the artifact.

**Current implementation:**

Standard MV release flow per `SPEC.md §9`. From the Inbox the **Save & Release** button flips `status` from `inbox` to `released` in one step; from a Vault detail row the **Release** toggle flips `vault` ↔ `released`. Either path sets `released_at` to a timestamp. Implemented in `imgserver.py`'s existing artifact-save endpoints (not touched by Phase 4).

`SPEC.md §9` also names Archive (`archived_at IS NOT NULL`) as the reversible "saved-but-hidden" signal, orthogonal to status. The export filter pays attention to `status='released'` but **does not** filter on `archived_at` (see Step 3 below) in the version of the export script that shipped.

**Data shape at this stage** — incremental change on the same row:

```
artifacts:
  status       = "released"
  released_at  = "2026-05-11T..."   (set by the release click)
  released_by  = (optional, set by the standard handler)
  (all other fields unchanged from Step 1)
```

**Where data flows next:** The released row becomes eligible for the export's SQL filter. No automatic export trigger; the next step is operator-initiated.

**Divergence from intent:** None at this step. Release is generic to all artifacts; it does nothing Deep-Dive-specific. The codebase's behavior matches the operator's framing exactly: a single click flips status, and the artifact is now ready for export.

---

## Step 3 — Export from MV to museum repo

**Intent:** Operator runs an export. The export pulls released artifacts from MV and writes them to a JSON file in the museum repo.

**Current implementation:**

`weird-baby-museum/tools/export-deep-tags.mjs`, invoked as `npm run export-deep-tags` from the operator's laptop.

The script (verbatim flow):

1. Reads the vocabulary JSON `src/data/deep-dive-vocabulary.json` to learn known group names. Fails fast if missing, suggesting `npm run prebuild`. (`export-deep-tags.mjs:94-106, 248-249`)
2. Fetches `GET http://127.0.0.1:51822/db`, which returns MV's whole SQLite database as one `application/octet-stream` blob. Loads it into a temp file and opens it via `better-sqlite3` read-only. (`:108-146, 251-252`)
3. Runs this SQL (`:40-48`):
   ```sql
   SELECT a.id, a.tags, a.notes
   FROM artifacts a
   WHERE a.status = 'released'
     AND a.parent_artifact_id IS NULL
     AND a.source_platform = 'youtube'
     AND EXISTS (
       SELECT 1 FROM json_each(a.tags)
       WHERE json_each.value = 'scope:hunter_root'
     );
   ```
   Note: `archived_at IS NULL` is **not** in the WHERE clause as shipped, despite SPEC v3 D7 calling for it. Operator should verify; this is one of the divergences I'm flagging.
4. For each row, calls `extractCardId(row.notes, ...)` (`:148-167`): JSON-parses `notes`, takes elements starting with `card_id:`, returns the **last** match (or `null` if none). Rows with no `card_id` are **skipped entirely** — they do not contribute to the output (`buildCardsMap` at `:198-204`).
5. For each non-skipped row, calls `extractDeepTags(row.tags, ...)` (`:169-190`): JSON-parses `tags`, keeps strings matching `^deep:[^:]+:.+$`, splits into `{group, tag}`. Strings that don't start with `deep:` are silently dropped.
6. Groups by `card_id` → group → array of tags. Deduplicates and sorts alphabetically (`:217-229`).
7. Writes `src/data/deep-tags.json` (`:255-269`):

   ```json
   {
     "metadata": {
       "exported_at": "<ISO>",
       "filter": "released, scope:hunter_root, youtube parents",
       "vocabulary_csv_sha": "<12-char sha256 prefix of the CSV>"
     },
     "cards": {
       "art-014": { "mood": ["snarky"], "motif": ["pink-hats"] }
     }
   }
   ```

**Data shape at this stage** (the on-disk artifact this step produces):

The shape above. Today, with no `deep:*` curations done yet, `src/data/deep-tags.json` on `main` is the placeholder:

```json
{ "metadata": { "exported_at": null, "filter": null, "vocabulary_csv_sha": null,
                "note": "This file is generated by tools/export-deep-tags.mjs..." },
  "cards": {} }
```

**Where data flows next:** The JSON is imported statically by the museum (`src/routes/hr/hr_cards.js:59` — `import DEEP_TAGS from "../../data/deep-tags.json"`). Build picks it up at the next `npm run build`.

**Divergence from intent:**

Three divergences, in order of how much they bend the operator's framing.

First, **the export's output is not "released artifacts."** It is a `cards` map: `{ card_id → { group → [tag, ...] } }`. The artifact identity that MV holds (`MV-20260510-001`) is **discarded** by the export — the artifact's `id`, `source_url`, `description_short`, `post_date`, `released_at`, and so on never appear in `deep-tags.json`. Only the `card_id` from `notes` and the `deep:*` slice of `tags` survive. Operator's framing was "released artifacts get written to a JSON file"; the code writes "per-card Deep Dive tag attachments" instead. If the operator's mental model is "the museum displays released artifacts," the export does not produce displayable artifacts — it produces a side-table that other data structures get joined against.

Second, **rows with no `card_id` are dropped silently.** A released YouTube artifact with `scope:hunter_root` and several `deep:*` tags but no `card_id:<value>` in its `notes` produces zero output (`export-deep-tags.mjs:200-204`). The Phase 4 save handler in MV enforces a `card_id` field, so the only way to get a released `deep:*`-tagged row without a `card_id` is to have curated tags through a different code path (e.g., direct DB edit, or pre-Phase-4 history). Still, the export's contract is "must have a `card_id` to be included," which is a stronger requirement than "released."

Third, **the filter is hardcoded to YouTube + scope:hunter_root.** Any released artifact whose `source_platform` is not `youtube`, or which lacks `scope:hunter_root` in its `tags` array, is filtered out. This is consistent with SPEC v3 D7 but worth noting: it means "released artifacts" in the export's sense is "released, parent, YouTube, HR-scoped" — a four-conjunction filter.

The export does match the operator's framing in two senses worth flagging on the positive side. It is operator-initiated (no build coupling). And the file it writes does live in the museum repo.

---

## Step 4 — Museum build & deploy

**Intent:** Operator commits the JSON, builds the museum, deploys.

**Current implementation:**

The `npm run build` flow (Vite + rolldown + Cloudflare plugin, per `CLAUDE.md`'s Pre-flight section) runs a `prebuild` step that invokes `tools/build-deep-tags-vocabulary.mjs`. That script reads `docs/deep-dive-vocabulary.csv` and writes `src/data/deep-dive-vocabulary.json` (the file Vite imports). This is the SPEC v3 Q-4 `[locked: Ops]` choice — CSV → JSON via a prebuild script — and is wired today; the JSON on disk has `generated_at: "2026-05-10T21:02:31.134Z"` and a `source_sha` referencing the CSV bytes.

Vite then bundles two Deep-Dive-related static imports into the museum bundle:

- `src/data/deep-dive-vocabulary.json` — imported by `src/routes/hr/hr_dimensions.js:42` and `src/routes/hr/hr_cards.js:58`. Provides `groupOrder: ["mood","theme","motif","texture"]` plus the per-group tag rows.
- `src/data/deep-tags.json` — imported by `src/routes/hr/hr_cards.js:59`. Provides `cards: { <card_id>: { <group>: [<tag>...] } }`.

`hr_dimensions.js:242-258` builds one `dim()` entry per group in `groupOrder`, placed on Tier 3:

```js
const DEEP_DIMENSIONS = DEEP_VOCAB.groupOrder.map(group =>
  dim(group, "multi", 3,
      (DEEP_VOCAB.groups[group] || []).map(({ tag }) => ({
        slug: tag, label: capitalize(tag),
      })),
  ),
);
```

And appends them to `HR_DIMENSIONS` after the existing `odds` Tier-3 column (`hr_dimensions.js:260-278`).

`hr_cards.js:63-69` defines `attachDeepTags(base)`, called inside every adapter (`hrArtifactToCardShape`, `hrArchiveItemToCardShape`, `hrExitFlowItemToCardShape`). For each group in `VOCAB_GROUPS`, it sets `base[group] = DEEP_TAGS.cards[base.id]?.[group] ?? []`. The lookup key is `base.id` — the explicit `id` field the entry carries (`art-001`, `arc-001`, `exit-001`, etc.).

The deploy story is standard Vite-on-Cloudflare-Workers via `worker.js`; no Deep-Dive-specific deploy step.

**Data shape at this stage** (per-card, after the adapters run, for a card `art-001` that the export named):

```js
{
  id: "art-001", render: "video",
  title: "Wishful Thinking — first show footage...",
  meta: "2012-10-12", credit: null,
  era: "medusas", year: "2012", type: "video", src: "archive",
  contentClass: "evidence",
  externalUrl: null,        // no ytId on this entry → null (per PRIORITY4B)
  span_w, span_h,
  // Deep Dive attachments — one field per group in vocab.groupOrder:
  mood:    [],              // empty if no entry in deep-tags.json for art-001
  theme:   [],
  motif:   [],
  texture: [],
}
```

If `deep-tags.json` had `cards["art-001"] = { mood: ["snarky"], motif: ["pink-hats"] }`, the `mood` and `motif` fields would carry those arrays; `theme` and `texture` would remain `[]`.

**Where data flows next:** `HR_CARDS` (the concatenation of all three adapted arrays) is imported by `src/routes/hr/HrExhibitFlow.jsx`, which is the deck rendered at the `/hr` route inside Exhibit.

**Divergence from intent:**

Two divergences worth naming.

First, **what the museum displays is authored card content, not MV artifacts.** `HR_CARDS` is built from `hr_artifacts.js` (10 entries), `hr_archive.js`, and `hr_exit_flow.js` (`hr_cards.js:265-269`):

```js
export const HR_CARDS = [
  ...HR_ARTIFACTS.map(hrArtifactToCardShape),
  ...HR_ARCHIVE.map(hrArchiveItemToCardShape),
  ...HR_EXIT_FLOW.map(hrExitFlowItemToCardShape),
];
```

None of these three files import anything from MV, from `deep-tags.json` (except via `attachDeepTags`'s tag-lookup), or from `hunter-root.js` (the SPINE). They are operator-authored JS data modules committed to the museum repo. The entries are static prose-bearing records with fields `date / era / type / src / fact1 / fact2 / credit / color / icon` — not derived from MV. `PRIORITY4B_CARD_RENDERING.md` confirms: `VideoCard` renders a static placeholder tile (color block, CSS-drawn play triangle, title, date), embeds no YouTube iframe, reads no `ytId`. Today `externalUrl` resolves to `null` on every card because none of the source entries carries `postUrl` / `url` / `link` / `href` / top-level `ytId`.

The operator's framing for Step 4 is "build the museum [and what the visitor sees comes from MV's released artifacts]." The current code displays cards from the three authored data files; MV's released artifacts contribute **tag annotations only**, via the `card_id`-keyed join in `attachDeepTags`. If MV had zero artifacts and `deep-tags.json` were empty, the museum would render exactly the same cards with empty Deep Dive tag arrays. The museum's deck content is authored, not exported.

Second, **a vocabulary group that the CSV declares produces an empty pill column even with no curated tags.** `DEEP_DIMENSIONS` always emits one column per `groupOrder` entry (`hr_dimensions.js:248-258`). Today that's `mood / theme / motif / texture`. Until the export populates `deep-tags.json`, every card's value in those fields is `[]`, so every pill in those columns has `count = 0`. Per `SPEC_DRAFT_v3.md` Q-3 this is the locked behavior (option (a)) and matches existing empty-column rendering. Not a divergence — just a behavior the operator should be aware of when looking at a live preview before the first export.

---

## Step 5 — Visitor-facing tag filtering

**Intent:** Visitor opens the museum, sees the artifacts displayed, filters by tag pills, the displayed set narrows.

**Current implementation:**

`/hr` renders `Exhibit.jsx` which composes the coverflow + tracklist + player surface plus the deck (`HrExhibitFlow`) as a sibling (`PRIORITY4B_CARD_RENDERING.md` "Relationship between deck cards and Exhibit.jsx's SPINE-driven video rendering"; quotes `Exhibit.jsx:803-804`).

The deck's data source for the cards it displays is `HR_CARDS` from `hr_cards.js`. The deck's pill columns come from `HR_DIMENSIONS` in `hr_dimensions.js`. Both files were described in Step 4.

Filtering happens via the existing `matchFilter` and `countForPill` functions in `HrExhibitFlow.jsx` (not modified by Phase 1; they iterate `HR_DIMENSIONS` generically). For each dimension on the deck:

- Tier-1 single-value columns like `era` match if `card[key] === selected_slug` (or no selection).
- Multi-value columns (Tier 3 Deep Dive groups are `"multi"` per `hr_dimensions.js:248-258`) match if any selected pill is present in `card[key]` (an array).

For the Deep Dive Tier-3 columns specifically: the deck reads `card.mood`, `card.theme`, `card.motif`, `card.texture`. Each is the array `attachDeepTags` populated in Step 4 — drawn from `DEEP_TAGS.cards[card.id]?.[group] ?? []`. The visitor sees pills under "Mood", "Theme", "Motif", "Texture" headers in the Deep Tracks tab; clicking one narrows the displayed cards to those whose corresponding field includes that pill's slug.

The search box (`DeepTracksContent` search input — `PHASE 0 Q1` per `PRIORITY4_VERIFICATION.md` reference, confirmed in `SPEC_DRAFT_v3.md §1.4`) iterates `HR_DIMENSIONS` generically; it picks up new Tier-3 columns automatically because `HR_DIMENSIONS` now contains them.

**Data shape at this stage:** The visitor never sees the underlying shape — they see a deck of clickable card tiles (placeholder colors + icons + titles + dates) under a tab strip with three tiers of pill columns. Beneath the surface, the rendered list is `HR_CARDS.filter(matchFilter)` and the pill counts are `countForPill(group, slug, HR_CARDS)`.

**Where data flows next:** Nowhere — this is the terminal step. Clicks open YouTube only via `card.externalUrl` (the `<a target="_blank">` wrapper in `ArtifactCard`, `PRIORITY4B_CARD_RENDERING.md`). Today every `externalUrl` is `null` because no source entry carries the necessary fields.

**Divergence from intent:**

The operator's framing for Step 5 is "visitor sees the artifacts displayed, filters by tag pills, the displayed set narrows." The narrowing mechanic itself matches: clicks → pill selection → `matchFilter` → fewer cards. The divergence is upstream — what the deck is showing in the first place.

What the visitor sees is the authored card catalog (`hr_artifacts.js` + `hr_archive.js` + `hr_exit_flow.js`), not MV's released artifacts. MV-released YouTube artifacts that didn't get a `card_id` typed into their Deep Dive tab don't appear in the deck and don't influence the filter. MV-released artifacts that did get a `card_id` cause specific cards to gain `mood / theme / motif / texture` array entries — but the **card itself**, including its title, date, render type, and `externalUrl`, comes from the authored data file referenced by that `card_id`. The Reverend music video, for example, is referenced from MV as `https://www.youtube.com/watch?v=7Lttb_59EYw` (`PRIORITY4_VERIFICATION.md` Q1); in the museum, the card whose id is whatever `card_id` the operator wrote into MV's `notes` will display whatever `fact1` / `fact2` / `date` the authored entry carries — not the YouTube video's metadata.

If the operator's mental model is "MV holds artifacts; the museum displays them; tags are how visitors filter," the current implementation inverts the dependency: the museum displays its own authored cards; MV-attached tags ride along as filter facets if and only if a card_id was used to bind them.

---

## Cross-cutting concerns

### "All tags are equal"

In **storage** all tags are equal: every tag is a string in a single JSON array on `artifacts.tags`. The schema doesn't distinguish `deep:mood:snarky` from `scope:hunter_root` or `author:hunter_root`. Filter SQL treats all of them as plain strings (`scope:hunter_root` is the unprefixed term the export searches for).

In **MV's curation surface** tags are *not* equal — Phase 4 introduces a special "Deep Dive" tab with its own vocabulary source (the museum's CSV), its own save handler (`/api/artifact-deep-dive-save`), and a write contract that rewrites only the `deep:*` slice of `tags` (`imgserver_extensions.py:803-806`). The Inbox pill wall and the Vault tag picker write into the same `tags` column but never produce `deep:*` strings.

In **the export** tags are not equal: only `deep:*` strings reach `deep-tags.json` (`export-deep-tags.mjs:180-189`). The other namespaces (`scope:`, `platform:`, `content_kind:`, `author:`) are used only inside the SQL filter; they do not surface as visitor-facing data.

In **the museum's pill columns** tags are not equal: `mood / theme / motif / texture` (the Deep Dive groups) come from `deep-tags.json`. The other columns (era, album, year, song, type, src, etc.) come from authored fields on the source entries in `hr_artifacts.js` / `hr_archive.js` / `hr_exit_flow.js`. Two unrelated tag substrates feed the same pill UI.

If the operator's statement "all tags are treated the same, all the time" is taken literally as a design constraint, the current code violates it at every layer except the database column itself.

### "Cards" as a concept

The codebase has card identity in three places.

The **museum data files** carry an explicit `id` field on every entry (per migration `c14267e`, referenced in `SPEC_DRAFT_v3.md` §2 "Architectural decisions" and verifiable in the data files themselves: `hr_artifacts.js` entries have `id: "art-001"`, `hr_archive.js` entries have `id: "arc-001"`, `hr_exit_flow.js` entries have `id: "exit-001"`). The adapters in `hr_cards.js` propagate this id onto each card object (`hr_cards.js:113, 176, 229`). The `attachDeepTags` adapter looks up `DEEP_TAGS.cards[base.id]` to attach tag arrays.

**MV's Phase 4 save handler** requires the operator to enter a `card_id` field as part of every Deep Dive curation (`imgserver_extensions.py:772-774`). MV validates the value (`_validate_card_id` at `:614-637` — strips whitespace, rejects colons and newlines, caps at 128 chars; deliberately does not enforce the `art-/arc-/exit-` prefix), then writes it into `artifacts.notes` as `card_id:<value>`. MV's `mediavault.html` exposes the field via a text input (`mediavault.html:2170-2176`).

The **export** uses `card_id` as the output object's key (`export-deep-tags.mjs:148-167, 198-216`). The MV artifact id is discarded; only the card_id survives.

So card identity is a load-bearing concept in (a) the museum's authored data, (b) MV's Deep Dive write path, and (c) the data plumb between them. It is in the codebase as a deliberate design feature, not a leftover. Per the operator's correction ("MV's job is artifact preparation and the museum's job is display"), the binding of card identity into MV's storage layer is the visible artifact of the divergence.

### Tag vocabulary source

The Deep Dive vocabulary lives at `weird-baby-museum/docs/deep-dive-vocabulary.csv`. Today it contains six tags across four groups:

```
tag,group,notes
snarky,mood,
wistful,mood,
oops,theme,
lemonade,theme,
pink-hats,motif,recurring visual element
acoustic,texture,
```

Two readers:

- **`tools/build-deep-tags-vocabulary.mjs`** (museum-side prebuild step) reads the CSV and writes `src/data/deep-dive-vocabulary.json`. That JSON is the build-time input to `hr_dimensions.js` and `hr_cards.js`. Authority over what pill columns exist on the museum lives in this file. (Verified: `src/data/deep-dive-vocabulary.json` has `generated_at: 2026-05-10T21:02:31.134Z`, `source_sha: cd40f5a7...`)
- **`handle_deep_dive_vocabulary`** in `imgserver_extensions.py:538-579` (MV-side endpoint) reads the same CSV at the hardcoded path `C:\AI\Projects\weird-baby-museum\docs\deep-dive-vocabulary.csv` and serves it as JSON to MV's Deep Dive tab. Authority over what pills the operator can pick during curation lives in this file.

MV's own `tags` table (`SPEC.md §6, §2.2`) also stores vocabulary rows — Phase 4 inserts `deep:<group>:<tag>` rows there for `usage_count` tracking and to let `deep:*` slugs appear in the Vocab Admin tab (`imgserver_extensions.py:823-865`). But the curation-time suggestions come from the CSV, not from MV's `tags` table; MV's `tags` table is downstream from the CSV in the Deep Dive path. (This is the "CSV authoritative for curation suggestions; MV `artifacts.tags[]` authoritative for export" hybrid named in `SPEC_DRAFT_v3.md §2` architectural decisions.)

The CSV's hardcoded path `C:\AI\Projects\weird-baby-museum\docs\deep-dive-vocabulary.csv` is the binding point between the two repos. If the museum repo were ever moved on disk, MV's Deep Dive vocabulary endpoint would 404, blocking Phase 4 curation until the path is updated (`imgserver_extensions.py:562-570`).

---

## Honest summary

The current code, on `main` of both repos, does not implement the operator's intended workflow as plainly stated. The gap is foundational and concentrates at two seams.

Most foundational, **the museum's deck displays authored card content from `hr_artifacts.js` / `hr_archive.js` / `hr_exit_flow.js`, not released artifacts from MV.** MV-released artifacts contribute Deep Dive *tag annotations* by way of a `card_id` join, but the cards themselves — their titles, dates, render type, and (today universally `null`) external URLs — are committed JS objects in the museum repo, not exported records. If the operator's model is "MV holds artifacts; the museum displays them," the dependency is inverted in the code: the museum displays its own catalog and consults MV only for tag overlays.

Second, and downstream of the first, **the `card_id` field in Phase 4's MV save handler binds a museum concept ("card") into MV's storage layer.** The operator's correction names this as wrong: MV should not know about cards. The current shape is `artifacts.notes` carries a `card_id:<value>` token (`imgserver_extensions.py:813-821`), the export keys its output by it (`export-deep-tags.mjs:148-167`), and the museum's `attachDeepTags` joins by it (`hr_cards.js:63-69`). Removing the card_id concept from MV would require rethinking what the export keys by — today, without `card_id`, an MV row produces zero output.

Third, lesser but worth naming, **the export's filter ships without `archived_at IS NULL`** despite SPEC v3 D7 specifying it. A released-then-archived artifact would still surface in `deep-tags.json` (`export-deep-tags.mjs:40-48`). This is a one-line discrepancy and is independent of the larger conceptual gaps above.

Fourth, **`deep:` tags are treated differently from other tag namespaces at every layer except SQLite storage.** Whether that's a problem depends on whether the operator's "all tags are equal" statement is a design constraint or an observation about the bottom of the stack.

---

## What this map does NOT do

- It does not propose any specific fix.
- It does not relitigate locked decisions; it surfaces where decisions and reality diverge.
- It does not include any code changes.
