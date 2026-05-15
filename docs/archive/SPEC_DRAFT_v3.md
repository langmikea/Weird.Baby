# Deep Dive — Specification
**Date:** 2026-05-10
**Status:** Draft v3 for review
**Builds on (must read first):**
- `docs/DEEP_DIVE_PHASE0_AUDIT.md` (the audit; cited as "Phase 0")
- `docs/STATUS_TAXONOMY_RESEARCH.md` (lifecycle research; cited as "Status research")
- `docs/deep-dive-review/PRIORITY4_VERIFICATION.md` (MV's `source_url` column + the parent/child shape)
- `docs/deep-dive-review/PRIORITY4B_CARD_RENDERING.md` (cards do not preview YouTube content today)
- `docs/deep-dive-review/PRIORITY4C_CARD_IDENTITY.md` (the missing-card-id problem v3 addresses by migration)

**Foundation locked:** The card-identity migration shipped on `main` at commit `c14267e` (PR #11). Every entry in `hr_artifacts.js`, `hr_archive.js`, `hr_exit_flow.js` now has a stable, explicit `id` field. The Deep Dive export keys by this id, not by `ytId`.

This v3 supersedes v2. Where v3 makes a decision, it carries a **provenance tag** indicating who made it and how: `[locked: operator-direct]`, `[locked: operator-confirmed]`, `[locked: Ops]`, or `[verified: <report>]`. This visibility is per the v2 design review's request that the spec stop conflating operator decisions with Ops resolutions.

---

## 1. What Deep Dive is

A **vocabulary of rich, evolving tags** ("Pink hats," "Oops," "Lemonade," "Snarky," etc.) plus **per-card assignments** that make those tags meaningful. Visitors find content by filtering the existing HR exhibit deck on these tags — exactly the same mechanism as the existing Artist-tier and Formats-tier pill columns.

Deep Dive is Tier 3 of the deck's filter system. It is not a new surface, not a new search experience, not a new playback model. It is a new tier of pill columns that filter `HR_CARDS`.

### How a visitor uses it

1. Visitor opens the HR exhibit deck.
2. Visitor navigates to the Deep Tracks tab (the existing surface where Tier 3 columns live and where the search input lives — Phase 0 Q1).
3. Visitor either scrolls through Tier 3 pill columns or types into the search input to find pills by label.
4. The search input is the existing typeahead over `HR_DIMENSIONS` — it auto-picks up new tier-3 columns without code changes because it iterates `HR_DIMENSIONS` generically (Phase 0 Q1, Q2).
5. Visitor clicks a pill. Selection toggles. Deck content filters via the existing `matchFilter` logic (Phase 0 Q2).
6. The deck shows cards matching all selected pills, intersected across all tiers and all columns. Same behavior as today, with one additional tier.

### What Deep Dive contributes

- **Multiple new pill columns on Tier 3 (Deep Tracks tab)** — one column per "group" label in the Deep Dive vocabulary. Groups like "mood," "theme," "motif" each become a column. `[locked: operator-direct — D1, D2 clarification]`
- **A vocabulary** maintained as a flat CSV.
- **Per-card tag assignments** maintained in MediaVault and delivered to the museum via a deliberate export step.
- **Nothing about search, selection, or filtering mechanism** — that exists already and works generically.

---

## 2. Decisions

### The eight original locked decisions

| # | Decision | Value | Provenance |
|---|---|---|---|
| D1 | Surface | One search box, in the Deep Tracks tab, scope all tiers. "Deep Dive" and "Deep Tracks" are name drift for the same surface. | `[locked: operator-direct]` |
| D2 | Vocabulary structure | Flat storage (one row per tag). "Group" is a property column on the row, not a hierarchy or controlled enum. Renaming a group label rewrites every tag in that group. Tier 3 of the deck displays one column per group label. | `[locked: operator-direct]` (initial answer was "b grouped light"; elaboration "easy to edit in a table" + "I select these tags, change their 'group' labels to 'Oops'" refined this. The Ops author's interpretation of elaboration-as-refinement was implicitly endorsed by the operator's continued direction.) |
| D3 | Vocabulary control | Hybrid. Suggested from a controlled list (the CSV); operator can add free-form during MV curation; novel free-form tags persist as `is_proposed=1` in MV. | `[locked: operator-direct]`, with `[locked: Ops]` for the `is_proposed=1` mechanism choice |
| D4 | Cardinality per video | Varies. UI handles few or many gracefully. | `[locked: operator-direct]` |
| D5 | Source of tags during ingest | Operator-curated for v1. Auto-suggest deferred. | `[locked: operator-direct]` |
| D6 | Search scope | Tags only. No fact-text search. | `[locked: operator-confirmed]` — operator said "simplify," Ops author picked tags-only as the simplification. The operator did not override. |
| D7 | Export filter | `status = 'released' AND archived_at IS NULL AND tags @> 'scope:hunter_root'` | `[locked: operator-confirmed]` — operator endorsed option (c) "released + tag-scope"; Ops author added the `archived_at IS NULL` clause as a literal expression of D8's intent. |
| D8 | Released-then-archived | Archive removes the artifact from the museum. | `[locked: operator-confirmed]` |

### Architectural decisions locked during v2 review revisions

| Decision | Value | Provenance |
|---|---|---|
| Q-A: HR scoping slug | Accept `scope:hunter_root` as canonical. SPEC.md gets an MV-side edit to match shipped reality. | `[locked: operator-direct]` |
| Namespace prefix at storage | Vocabulary CSV stays flat (no prefix); MV storage uses `deep:<group>:<tag>` (e.g., `deep:mood:snarky`) so the export can identify Deep Dive tags by prefix and route each to its column. | `[locked: Ops]` — operator delegated this as Ops |
| CSV vs MV `tags` table | Hybrid (c). CSV authoritative for curation suggestions; MV `artifacts.tags[]` authoritative for export. Two vocabularies, intentionally allowed to diverge. | `[locked: Ops]` — operator said "this is Ops" and confirmed "there is no Museum to MV tag transfer" |
| Build-coupling principle | Build-time reads from the museum repo are fine. Build-time reads from MV are forbidden (MV is loopback-only and not always reachable from CI). The CSV lives in the museum repo, so its build-time parse is allowed. | `[locked: Ops]` — reconciliation of v2's internal contradiction |
| 5.1 Vocabulary file location | `weird-baby-museum/docs/deep-dive-vocabulary.csv` | `[locked: operator-direct]` |
| 5.3 Export output location | `weird-baby-museum/src/data/deep-tags.json` | `[locked: operator-direct]` |
| 5.4 Phase 2 (status enum drift) | Deferred to MV cleanup punchlist. Phase 3 proceeds without it. | `[locked: operator-direct]` |
| Card identity foundation | Every entry in `hr_artifacts.js`, `hr_archive.js`, `hr_exit_flow.js` now has explicit `id` field (`art-NNN`, `arc-NNN`, `exit-NNN`). Adapters use this. Migration shipped at `c14267e`. | `[verified: migration commit on main]` |
| Card-to-MV join key | Card `id` (the explicit field above), not `ytId`. The export from MV writes `deep-tags.json` keyed by card id. | `[locked: operator-direct]` — D1 clarification "Deep Dive filters the deck, just like the categories under Artist and Formats" |

---

## 3. Architecture

### 3.1 Storage

**Vocabulary** — `weird-baby-museum/docs/deep-dive-vocabulary.csv`

- Three columns: `tag`, `group`, `notes`.
- Hand-edited (Excel, VS Code, anything that opens CSV).
- Versioned in git as part of the museum repo.
- Source of truth for what tags exist and how they're grouped.
- A group label appearing on at least one row produces a corresponding pill column on Tier 3 of the deck. Renaming a group label renames the column on next build.
- Tags removed from the CSV are no longer suggested during curation but remain on artifacts already curated with them. The CSV is a curation aid, not a validation gate.

**Per-card tag assignments** — MV's `artifacts.tags[]` column, prefixed `deep:<group>:<tag>`.

- Example: `["scope:hunter_root", "platform:youtube", "content_kind:official", "author:hunter_root", "deep:mood:snarky", "deep:motif:pink-hats"]`
- The `deep:` prefix identifies the namespace. The `<group>` segment lets the export route the tag to the correct museum-side column.
- `[verified: PRIORITY4_VERIFICATION.md]` confirms `tags` is a JSON array column on `artifacts` and JSON-array containment querying is feasible via `json_each`.

**Museum-side snapshot** — `weird-baby-museum/src/data/deep-tags.json`

- Generated by export (data flow C below).
- Keyed by card `id` (the explicit ids established by the `c14267e` migration), not by `ytId`.
- Committed to git.
- Statically imported by the museum at build time.

### 3.2 Data flow A — operator curation

1. Operator pastes a YouTube URL into MV's "+ Add URL" (or runs the existing `yt-ingest.mjs` CLI for the richer four-artifact intake).
2. Standard pill curation happens.
3. Operator opens MV's Deep Dive curation tab (built in Phase 4).
4. Tab reads the vocabulary CSV from a known absolute path (resolved in Phase 4 — see "Open implementation questions" below).
5. Operator types to filter the vocabulary; clicks tags to add; can add free-form tags during curation.
6. Free-form tags persist in MV's `tags` table with `is_proposed=1`. Operator can promote them to confirmed later.
7. **Critical step**: operator records the card id this curation attaches to. The Deep Dive tab requires a `card_id` field — the explicit id from the museum's source-data files. Without a `card_id`, the curation doesn't produce a museum-visible attachment.
8. Operator clicks **Save & Release** (★). Status becomes `released`.

`[locked: Ops]` for the card_id-on-curation requirement. This is the join-discipline that makes the architecture work: in MV, you're not just tagging a YouTube video — you're tagging it *as it appears on a specific museum card*. The card_id is what makes that attachment durable.

### 3.3 Data flow B — vocabulary maintenance

1. Operator edits `docs/deep-dive-vocabulary.csv` directly.
2. Adding a tag: add a row. Renaming a group: change the `group` column value on all affected rows. Removing a tag: delete a row.
3. Commit and push the CSV.
4. Next museum build picks up the new vocabulary. MV's curation tab picks up the change next session.

### 3.4 Data flow C — export to museum

1. Operator runs `npm run export-deep-tags` on their laptop.
2. The script fetches the SQLite blob: `GET http://127.0.0.1:51822/db`. `[verified: PRIORITY4_VERIFICATION.md]` confirms `/db` returns the whole DB as `application/octet-stream`.
3. The script loads the blob into a local SQLite reader (e.g., `better-sqlite3`).
4. The script queries — using JSON-aware SQL to avoid the substring-match pitfall the v2 review identified:
   ```sql
   SELECT a.id, a.tags, a.notes
   FROM artifacts a
   WHERE a.status = 'released'
     AND a.archived_at IS NULL
     AND a.parent_artifact_id IS NULL
     AND a.source_platform = 'youtube'
     AND EXISTS (
       SELECT 1 FROM json_each(a.tags)
       WHERE json_each.value = 'scope:hunter_root'
     );
   ```
   `[verified: PRIORITY4_VERIFICATION.md]` confirms `parent_artifact_id IS NULL` + `source_platform = 'youtube'` correctly scopes to the parent artifact (the YT ingest produces a parent + thumbnail child + transcript child; only the parent's source_url is the watch URL, but for tag-attachment purposes we work off any parent identifier).
5. For each matching artifact, extract:
   - The `card_id` field from `notes` (where operator-curation deposits it — see Open implementation questions for the exact location, since MV's schema has multiple candidate columns).
   - Tags matching `deep:*` pattern. Parse each into `<group>` and `<tag>`. Strip the `deep:` prefix.
6. Group results by `card_id`. For each card, collect all Deep Dive tags grouped by group label.
7. Write `src/data/deep-tags.json`:
   ```json
   {
     "metadata": {
       "exported_at": "2026-05-10T18:42:00Z",
       "filter": "released, not archived, scope:hunter_root, youtube parents",
       "vocabulary_csv_sha": "<sha of docs/deep-dive-vocabulary.csv at export time>"
     },
     "cards": {
       "art-014": {
         "mood": ["snarky"],
         "motif": ["pink-hats"]
       }
     }
   }
   ```
8. Operator commits the JSON. Build & deploy normally.

The `vocabulary_csv_sha` provides debug visibility: at deploy time, you can tell whether the exported tags were assigned against the current vocabulary or an older one.

### 3.5 Data flow D — museum render

1. At build time, Vite imports `src/data/deep-tags.json` (existing static-import pattern, `[verified: Phase 0 Q5]`).
2. The vocabulary CSV is parsed at build time. Implementation TBD in Phase 1 (Vite loader, `prebuild` step, or static JSON regenerated by the export — operator's choice; doesn't affect the spec).
3. For each group label in the CSV, a new pill column is added to `HR_DIMENSIONS` in `hr_dimensions.js` for Tier 3. `[verified: Phase 0 Q2]` for the five-touch column-addition pattern.
4. The deck's existing filter logic and search input iterate `HR_DIMENSIONS` generically. **No changes to filter or search code required.**
5. The adapter in `hr_cards.js` reads `deep-tags.json` and attaches the corresponding tag arrays to each card by id during card construction. A card with `id: "art-014"` gets `mood: ["snarky"]` and `motif: ["pink-hats"]` fields from the JSON; a card with no entry in `deep-tags.json` gets empty arrays. **The deck's filter checks `card[group]` for each group; empty arrays simply never match the filter.**

### 3.6 Why this architecture honors the locked decisions

- **D2 (flat, table-editable):** The CSV is literally a flat table. Group is a column. Renaming a group is `find → replace`.
- **D2 Tier-3 column-per-group:** Each group label drives a column in `HR_DIMENSIONS`. Add a new group → new column appears on next build, no code changes.
- **D4 (operator-CLI, no build coupling for MV):** The build never touches MV. The CSV→JSON happens in the museum repo, not against MV. `[locked: Ops]` build-coupling reconciliation principle.
- **D7 (released + scope filter):** Filter expressed in JSON-aware SQL. `[verified: PRIORITY4_VERIFICATION.md]` confirms `parent_artifact_id IS NULL` + `source_platform = 'youtube'` scopes to parent.
- **Card-by-id join:** Migration `c14267e` establishes stable card ids. Export keys by card id. No `ytId` join required.

---

## 4. Open implementation questions

These are sub-decisions Phase prompts will need to resolve. Each is genuinely TBD; v3 doesn't pretend to settle them.

### Q-1 — Where in MV does the `card_id` get stored?

Data flow A step 7 requires the operator to attach a `card_id` to each Deep Dive curation. MV's existing schema has several candidate columns for this:

- `notes` (TEXT, JSON array per SPEC.md §6) — operator-flexible field; can carry `"card_id: art-014"` as a note string. Pro: no schema change. Con: parsing strings out of free-form notes is fragile.
- A new `card_id` column on `artifacts` — explicit, queryable. Con: schema migration on MV. Out of scope per "no MV code changes" in Phase 3.
- `description_short` or `description_long` — same fragility as `notes`.

**Recommendation: store in `notes` as a structured entry** like `"card_id:art-014"` parsed by the export. Phase 4's MV curation UI writes it; Phase 3's export reads it. No MV schema change.

`[locked: Ops]` proposed. Operator may override.

### Q-2 — Phase 1 seed vocabulary

Phase 1 needs a starter CSV with several tags so the wiring is testable end-to-end. From the operator's earlier examples and the elaboration:

Suggested seed CSV:

```csv
tag,group,notes
snarky,mood,
wistful,mood,
oops,theme,
lemonade,theme,
pink-hats,motif,recurring visual element
acoustic,texture,
```

Six tags, three groups (`mood`, `theme`, `motif`, `texture`). Operator will likely want to adjust during Phase 1 review.

`[locked: Ops]` proposed. Phase 1 prompt asks for confirmation before committing.

### Q-3 — Empty-column rendering on day one

`[verified: Phase 0 Q2]` confirms existing empty columns render headers only with no clickable pills. The `mood`/`theme`/`motif`/`texture` columns added in Phase 1 will be empty until cards get curated. Two choices:

- (a) Ship Phase 1 with the columns visible and empty. Consistent with existing empty-column behavior.
- (b) Hide the columns until any card has tags in that group. Cleaner first-impression.

**Recommendation: (a).** Consistency with existing empty columns. The polish comes when content does. `[locked: Ops]` proposed.

### Q-4 — Build-time CSV parse mechanism

Three options for getting CSV → into the museum bundle:

- Vite plugin reading CSV at build time.
- `prebuild` script converting CSV to JSON, committed JSON imported normally.
- Manual conversion to JSON, JSON is the source of truth (CSV becomes documentation).

**Recommendation: `prebuild` script that converts CSV to JSON.** Closest fit to the operator-CLI principle (the operator runs a command before deploy, just like `export-deep-tags`). `[locked: Ops]` proposed.

---

## 5. Implementation phases

Six phases, in dependency order. Each becomes its own Cowork session. Phase 0.5 (card-identity migration) is **done** as of `c14267e`.

### Phase 1 — Museum-side foundation

- Create `docs/deep-dive-vocabulary.csv` with Phase-1 seed (Q-2).
- Build CSV→JSON `prebuild` step (Q-4).
- Create empty `src/data/deep-tags.json` `{}`.
- Add pill columns to `HR_DIMENSIONS` for each group in the CSV (one column per group).
- Extend the card adapters in `hr_cards.js` to read `deep-tags.json` and populate `card[group]` arrays per card id.
- Verify hand-injected test: edit `deep-tags.json` to add tags for one card. Run dev server. Confirm the new column pills appear, search finds them, click filters the deck.
- PR + merge. **No MV involvement.**

### Phase 2 — Deferred

Status enum drift cleanup. `[locked: operator-direct]` to defer to MV cleanup punchlist. Phase 3 proceeds without.

### Phase 3 — Export CLI

- Build `tools/export-deep-tags.mjs` (Node).
- Connects to `http://127.0.0.1:51822/db`, applies the D7 filter via `json_each`.
- Parses `notes` for `card_id` entries (per Q-1).
- Extracts `deep:<group>:<tag>` patterns from `tags[]`.
- Writes `src/data/deep-tags.json` grouped by card id then by group.
- Add `npm run export-deep-tags` to `package.json`.
- Document in `CLAUDE.md`'s "Local tooling" section.
- Live test against the three Reverend artifacts (`MV-20260510-001..003`). Note: those artifacts currently have no `deep:*` tags and no `card_id` annotation, so the export will produce an empty `cards: {}` object — that's the expected output until Phase 4.
- PR + merge.

### Phase 4 — MV Deep Dive curation UI

- Add a "Deep Dive" tab to MV's Inbox/Vault detail panel.
- Tab reads the vocabulary CSV from the museum repo by absolute path (`C:\AI\Projects\weird-baby-museum\docs\deep-dive-vocabulary.csv`).
- Tab presents the vocabulary as a typeahead, grouped by group label.
- Operator can click to add tags, type free-form to propose.
- Tab also presents a `card_id` field — operator types or pastes the explicit card id this curation attaches to.
- On save: `deep:<group>:<tag>` strings get added to `artifacts.tags[]`; the `card_id` gets added to `notes` (per Q-1).
- MV commit on `main` (local-only repo).

### Phase 5 — Live end-to-end test

- Operator picks one existing card in the museum (e.g., `art-014`).
- Operator opens MV, finds the matching artifact, adds Deep Dive tags via the Phase-4 tab, sets `card_id: art-014`, releases.
- Operator runs `npm run export-deep-tags`. Verifies `deep-tags.json` contains a `cards.art-014` entry with the right group/tag structure.
- Operator commits the JSON. Builds the museum locally. Verifies the new tags appear as pills in the Deep Tracks tab, search finds them, click filters to show that card.
- No PR — this is operator validation.

### Phase 6 — Bulk ingest of existing HR YouTube dataset

- Inventory SPINE's existing YouTube videos (per CLAUDE.md, ~63 tracks across albums).
- For each, run the existing yt-ingest CLI to create MV artifacts.
- For each, identify the corresponding museum card by id, curate Deep Dive tags via Phase 4 tab, release.
- Periodically run export. Build, verify.
- Operator-driven; pace is operator's choice.

---

## 6. What's deferred (and what triggers revisiting)

- **Auto-suggest from transcript / enrich_helper.py** (D5 future) — Triggered when ~20+ videos are hand-curated and there's data to learn from.
- **MV status enum drift cleanup** (Phase 2 deferred per operator) — Triggered if an MV row appears with the wrong status value due to the schema/runtime/SPEC mismatch.
- **MV `/api/intake-queue` endpoint** (from prior YT ingest punchlist) — Triggered when post-registration review feels insufficient at scale.
- **Vault-bytes-copy to `catalogs/_assets/`** (prior punchlist) — Triggered when an artifact reference goes dangling.
- **Pill-states four-state shape leakage** (`[verified: Phase 0 Constraint #4]`) — Not a Deep Dive concern because export doesn't read `enrichment_json`. Triggered if any future feature does.
- **Asset delivery (R2 / bundled / linked)** — Not v1. Deep Dive doesn't render images; it filters cards that exist regardless of image state.
- **Card preview of YouTube content** (`[verified: PRIORITY4B_CARD_RENDERING.md]`) — Cards today do not preview video. This is a separate museum feature, orthogonal to Deep Dive. Triggered when operator decides to address card playback as its own feature.
- **Other artists** — v1 is HR only via D7. Other artists' export filters added as those artists are populated.
- **`hr_facts.js` as a search target** (`[verified: Phase 0 Q1]`) — D6 set scope to tags only. The deck and `Exhibit.jsx` consume different data slices anyway.
- **Schema reconciliation of the stray `hr_artifacts.js:170` entry** (`[verified: PRIORITY4C_CARD_IDENTITY.md]` + migration closure) — Anomalous row received an id like everything else; its other field schema remains anomalous. Out of scope for Deep Dive; would be a separate data-hygiene task.

---

## 7. What this spec does NOT do

- It does not specify code-level implementation. Phase prompts do.
- It does not pre-litigate the locked decisions. Open architectural questions (Q-1 through Q-4) are flagged for resolution at the relevant phase prompt.
- It does not address other artists or other media types.
- It does not change anything about how cards render YouTube content today (`[verified: PRIORITY4B_CARD_RENDERING.md]` confirmed cards don't preview; this stays as-is).

---

## Appendix A — How v3 differs from v2

For honest accountability:

- **Provenance tags added** to every decision in §2. Distinguishes operator-direct, operator-confirmed, Ops, and verified. (Per v2 review priority 2/3.)
- **§3.4 SQL rewritten** using `json_each` JSON-aware querying instead of `LIKE` substring matching. (Per v2 review priority 1.)
- **`source_url` → `ytId` parse removed.** No longer needed: the join is by card id, not `ytId`. (Per v2 review priority 4.)
- **Multi-column-per-group architecture explicit** (§1, §3.5, §3.6). v2 hid this by treating Tier 3 as a single column. Operator's D1 elaboration clarified this is multiple columns; v3 reflects.
- **MV `card_id` storage surfaced as Q-1** (open architectural question). v2 didn't address how MV remembers which card a curation targets.
- **CSV-vs-tags hybrid model explicit** in §3.1 and §3.6. Resolved per Conversation 3.
- **Build-coupling reconciliation** in §2 architectural decisions. v2 contradicted itself; v3 names the principle.
- **Card-identity foundation referenced as verified** rather than assumed. The `c14267e` migration is real.
- **Phase 0.5 (card-identity migration) marked done.** Phases renumbered: Phase 2 is the deferred status-enum work; Phase 3 is the export; Phase 4 is the MV UI; Phase 5 is live test; Phase 6 is bulk.
- **Q-A folded into §2 as a locked decision** rather than left as an open question that could invalidate D7. (Per v2 review priority 2.)
- **`tools/yt-ingest.mjs` working-tree corruption resolved** before v3 was drafted, removing a multi-session phantom diff. Not part of v3 content but a baseline-truth note.

---

## Appendix B — Source material utilization map

For traceability. Every decision should be locatable in either a source document or a labeled provenance.

| Source material | Used in v3 | Section |
|---|---|---|
| Phase 0 Q1 — DeepTracksContent search | §1, §3.5 step 4, §6 deferred items | "Search box auto-picks up new columns" |
| Phase 0 Q2 — filter mechanics, 5-touch column add, empty columns | §3.5 step 3 + Q-3 | Column addition pattern |
| Phase 0 Q3 — `/db` endpoint | §3.4 step 2 | Export reads `/db` |
| Phase 0 Q3 — loopback-only MV | §2 build-coupling principle | Locks operator-CLI architecture |
| Phase 0 Q5 — three export shapes weighed | §2 architectural decisions | Operator-CLI chosen |
| Status research Findings 3, 6 — `released` semantics, default vault filter | D7 | Filter foundation |
| Status research Finding 9 — status enum drift | Phase 2 deferred | Acknowledged, deferred |
| PRIORITY4 — `source_url` column + parent/child shape | §3.1 storage, §3.4 step 4 | Parent-only filter |
| PRIORITY4B — cards don't preview YouTube | §6 deferred items | Card preview deferred as separate concern |
| PRIORITY4C — no stable card id today | Card-identity foundation | Migration `c14267e` was the response |
| Migration commit `c14267e` | §2 + §3 throughout | Foundation for card-by-id join |

---

*End of Deep Dive Specification v3.*
