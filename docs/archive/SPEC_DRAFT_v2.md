# Deep Dive — Specification
**Date:** 2026-05-10
**Status:** Draft v2 for review
**Builds on (must read first):**
- `docs/DEEP_DIVE_PHASE0_AUDIT.md` (the audit; cited below as "Phase 0")
- `docs/STATUS_TAXONOMY_RESEARCH.md` (the lifecycle research; cited as "Status research")
This spec was rewritten after a v1 draft was reviewed and found to drift from the audit findings. Where v2 makes a decision, the audit citation is included so a future reader can verify the reasoning is grounded in what the codebase actually contains, not in what the spec author thought it contained.
---
## 1. What Deep Dive is
A **vocabulary of rich, evolving tags** ("Pink hats," "Oops," "Lemonade," "Snarky," etc.) plus the **per-video assignments** that make those tags meaningful — so that visitors can find museum content by selecting tags from a free-form thematic / mood / motif vocabulary rather than only from the standard pill columns (album, year, song, etc.).
The visitor experience is identical to how every other pill column already works on the HR exhibit deck. The one new affordance is **vocabulary breadth**: there will be far more Deep Dive tags than there are albums or years, so the existing search box becomes the practical way to find a tag.
### How a visitor uses it
1. Visitor opens the HR exhibit deck and the deck-body extends.
2. Visitor navigates to the **Deep Tracks** tab (where the search input lives — Phase 0 Q1).
3. Visitor types into the search box ("snar...").
4. Across **all three tiers** (Artist, Formats, Deep Tracks), every pill whose label matches surfaces as clickable in the corral. The search input is a *typeahead over the existing pill grid* — Phase 0 Q1 quotes this directly: "search is effectively a typeahead over the existing pill grid rather than a free-text content search." The search does not filter videos. It filters which pills are visible to click.
5. Visitor clicks a pill (e.g. `snarky`). The click toggles that pill into `selected` state, same as if the visitor had scrolled to the pill and clicked it directly.
6. The deck's content filter (`matchFilter` in `HrExhibitFlow.jsx`, lines 386–402 per Phase 0 Q2) intersects all selected pills. Videos matching all selected pills appear; others don't.
### What Deep Dive contributes
- A new pill column on the deck (the `deep` column, in Tier 3 alongside the existing `odds` column).
- A populated **vocabulary** of Deep Dive tags maintained as a flat editable file.
- **Per-video assignments** — the linkage between artifacts in MediaVault and the Deep Dive tags they carry — exported from MV to the museum on a deliberate operator-run step.
- **Nothing about the search-and-select mechanism itself.** That mechanism already exists and works generically over `HR_DIMENSIONS` (Phase 0 Q2). Adding a new column makes it searchable for free.
---
## 2. Decisions locked
Eight decisions were made in conversation before this draft. Citations to the audit/research are added where the decision is grounded in something the audit found.
| # | Decision | Value | Audit basis |
|---|---|---|---|
| D1 | Surface | One search box, in the Deep Tracks tab, scope is all tiers. "Deep Dive" and "Deep Tracks" are name drift for the same surface. | Phase 0 Q1 confirms the existing search is in `DeepTracksContent` and already searches all `HR_DIMENSIONS` slug/label pairs. |
| D2 | Vocabulary structure | Flat. Storage is one row per tag. "Group" is a property column on the row, not a hierarchy or a controlled enum. Renaming a group label rewrites every tag in that group. | Operator-stated principle: "easy to edit in a table" over "right the first time." |
| D3 | Vocabulary control | Hybrid. Suggested from a controlled list (the CSV); operator can add free-form during MV curation; novel free-form tags persist as `is_proposed=1` in MV. | Mirrors the existing pill mechanism in MV (`tags.is_proposed`), Phase 0 Q3. |
| D4 | Cardinality per video | Varies. UI handles few or many gracefully. | No constraint in the existing pill system. |
| D5 | Source of tags | Operator-curated for v1. Auto-suggest from transcript/description/`enrich_helper.py` is deferred to a future pass. | — |
| D6 | Search scope | Tags only (i.e., the existing pill labels). No fact-text search; `hr_facts.js` is not a search target. | Phase 0 Q1 + Constraints §7. The deck and `Exhibit.jsx` consume different data slices; bridging them is non-trivial. |
| D7 | Export filter | `status = 'released' AND archived_at IS NULL AND tags @> 'scope:hunter_root'` | Status research Findings 3 & 6 (released semantics + default vault filter pattern). Phase 0 Q3 confirms `/db` makes this query feasible. |
| D8 | Released-then-archived | Archive removes the artifact from the museum. Symmetric with MV's internal "archive = hidden" semantics. | Status research Finding 5 (WORKFLOW.md): "hides the row from default views until you toggle 'Show archived' on." |
### Two derived architectural decisions (also locked, but not numbered above)
- **Per-video tag assignments live in MV's `artifacts.tags[]` column with a new `deep:` prefix** to coexist with the existing pill namespaces (`scope:`, `platform:`, `content_kind:`, `artifact_kind:`, `author:`, `era:`).
- **Vocabulary lives in `weird-baby-museum/docs/deep-dive-vocabulary.csv`.** Three columns: `tag`, `group`, `notes`.
- **MV → museum data transfer is build-time export, operator-run CLI, committed JSON.** Not a Vite plugin, not a `prebuild` hook, not a runtime fetch. Phase 0 Q5 explicitly weighed all three shapes and concluded the operator-CLI shape best matches VISION_LOCK G-01's "deliberate export step" framing and the existing `tools/yt-ingest.mjs` pattern (CLI not in build scripts). The operator-CLI also sidesteps Phase 0 Constraint #5: MV binds `127.0.0.1:51822` only, so any build that doesn't run on Mike's laptop cannot reach MV. The operator-CLI runs only on Mike's laptop by design; the deploy build runs anywhere from the committed JSON.
---
## 3. Architecture
Three storage locations, three data flows. Each citation points to where the audit established the underlying mechanism.
### 3.1 Storage
**Vocabulary** — `weird-baby-museum/docs/deep-dive-vocabulary.csv`
- Three columns: `tag`, `group`, `notes`.
- Hand-edited (Excel, VS Code, anything that opens CSV).
- Versioned in git as part of the museum repo.
- Source of truth for what tags **exist** and how they're **grouped**.
**Per-video tag assignments** — MV's `artifacts.tags[]` column, with a new `deep:*` namespace prefix.
- Example tag set on a fully-curated artifact: `["scope:hunter_root", "platform:youtube", "content_kind:official", "author:hunter_root", "deep:snarky", "deep:pink-hats"]`.
- The `deep:` prefix prevents collision with other namespaces and lets the export script extract Deep Dive tags with a simple prefix filter.
**Museum-side snapshot** — `weird-baby-museum/src/data/deep-tags.json`
- Generated by export (data flow C below).
- Committed to git.
- Statically imported by the museum at build time.
### 3.2 Data flow A — operator curation
This flow describes what happens when the operator curates a single artifact in MV.
1. Operator pastes a YouTube URL (existing yt-ingest CLI) or otherwise creates an artifact.
2. Standard pill curation happens (existing flow; not changed by Deep Dive).
3. Operator opens MV's Deep Dive curation tab (built in Phase 4).
4. The tab shows the current vocabulary — read from `docs/deep-dive-vocabulary.csv` (museum repo, accessed by absolute path or a copy mirrored into MV; resolved in Phase 4).
5. Operator types to filter the vocabulary; clicks tags to add them; can add free-form tags.
6. Free-form tags persist in MV's `tags` table with `is_proposed=1` (matching D3 + the existing pill mechanism per Phase 0 Q3).
7. Operator clicks **Save & Release** (★) when ready. Status becomes `released`.
### 3.3 Data flow B — vocabulary maintenance
1. Operator edits `docs/deep-dive-vocabulary.csv` directly. Adding a tag = adding a row. Renaming a group = changing the `group` column on the affected rows. Removing a tag = deleting a row.
2. Operator commits and pushes the CSV.
3. The next build picks it up.
Tags already assigned to artifacts in MV remain on those artifacts even if removed from the vocabulary CSV. This is by design: the CSV describes what is **suggested** during curation, not what is **valid** at storage time. The export filter (data flow C step 4) decides what reaches the museum, not the CSV.
### 3.4 Data flow C — export to museum
1. Operator runs `npm run export-deep-tags` on their laptop.
2. The script makes one HTTP request to `GET http://127.0.0.1:51822/db` (Phase 0 Q3 confirms this returns the entire SQLite blob as `application/octet-stream`).
3. The script loads the blob into a local SQLite reader (Node's `better-sqlite3` or equivalent).
4. The script applies the locked filter (D7): `SELECT * FROM artifacts WHERE status = 'released' AND archived_at IS NULL AND tags LIKE '%"scope:hunter_root"%'`.
5. For each matching artifact, parse the `tags` JSON array, extract entries beginning with `deep:`, strip the prefix.
6. Parse `source_url` to extract the YouTube `ytId` (the museum's primary key).
7. Write `src/data/deep-tags.json`:
   ```json
   {
     "metadata": {
       "exported_at": "2026-05-10T18:42:00Z",
       "filter": "status = 'released' AND archived_at IS NULL AND tags @> 'scope:hunter_root'",
       "vocabulary_csv_sha": "<sha of docs/deep-dive-vocabulary.csv at export time>"
     },
     "videos": {
       "7Lttb_59EYw": {
         "tags": ["snarky", "pink-hats", "lemonade"]
       }
     }
   }
   ```
8. Operator commits the JSON. Build & deploy normally.
The `vocabulary_csv_sha` field exists for debug visibility: at deploy time, you can tell whether the exported tags were assigned against the current vocabulary or an older one.
### 3.5 Data flow D — museum render
1. At build time, Vite imports `src/data/deep-tags.json` (existing static-import pattern, Phase 0 Q5).
2. The vocabulary CSV is parsed at build time (either via a Vite loader or a small `prebuild` step that converts CSV → JSON; resolved in Phase 1).
3. A new `deep` column is added to `HR_DIMENSIONS` in `hr_dimensions.js` (Phase 0 Q2 documents the five-touch column-addition pattern).
4. The deck's existing filter logic (`matchFilter`, `itemHasTag`, `PillGroupColumn`) iterates `HR_DIMENSIONS` generically — no changes needed to the filter logic itself.
5. The deck's existing search input (Phase 0 Q1's `DeepTracksContent`) iterates `HR_DIMENSIONS` generically — no changes needed to the search logic itself.
6. The card-side data (`HR_CARDS` from `hr_cards.js`, which composes `HR_ARTIFACTS` + `HR_ARCHIVE` + `HR_EXIT_FLOW`) needs a `deep` field per card carrying the array of tags for that video. **This is where the museum's existing data files meet the export.** Resolved in Phase 1.
### 3.6 Why this architecture honors the locked decisions
- **D2 (flat, table-editable):** The CSV is literally a flat table. Group is a column, not a hierarchy. The "Oops becomes a group when I rename twelve rows" workflow is `find → replace` in any editor.
- **D4 (operator-CLI, not build-coupled):** Phase 0 Constraint #5 (loopback-only MV) makes any non-laptop build incompatible with reading MV. The operator-CLI fully sidesteps this.
- **D7 (released + scope filter):** Status research Finding 6 establishes that `status IN (vault, released) AND archived_at IS NULL` is MV's *internal* default. D7 narrows it further to `released` only — an explicitly tighter filter than what MV shows the operator, honoring VISION_LOCK G-01's "Mike's veto, nothing is visible until he decides it is."
- **The `deep:` namespace prefix:** Per the existing pill convention. Phase 0 Q3 + the yt-ingest schema doc confirm namespaced slugs are the existing pattern.
---
## 4. Pre-flight: drift in MV's status enum
Status research Finding 9 surfaced a real defect that the export depends on: MV's schema CHECK constraint, runtime `STATUS_ENUM`, and SPEC §4 each give different answers to "what can `status` be?"
- **Schema CHECK:** `('inbox','vault','released','archived')` — has `archived` (which SPEC retired) and lacks `deleted`.
- **Runtime `STATUS_ENUM`:** `{vault, released, archived, deleted}` — has `archived` and `deleted` but lacks `inbox`.
- **SPEC §4 canonical:** `inbox | vault | released | deleted`.
`STATE.md` defers this to a future v0.7 punchlist. It is not yet aligned.
**The export script in this spec depends on `status = 'released'`** which all three layers agree exists — so technically the export works today against the drift. But the situation is fragile: if MV ever produces a row with the wrong status value due to a code path that uses one layer's understanding (e.g., `archived` written to schema, then queried by the export which expects only `released`), behavior is undefined.
**Recommendation:** Phase 2 (per §6 below) aligns the three layers before Phase 3 (the export CLI) is built. This costs ~half a day of MV work and removes a category of future bug. The alternative — building Phase 3 first and accepting the drift — saves time today and pays it back later, with interest.
This recommendation is not itself a locked decision. Mike makes the call in §7 below.
---
## 5. Open architectural questions (for the spec author)
These are sub-decisions the audit surfaced that the v1 draft picked silently or didn't address. Each needs an explicit operator answer before the relevant Phase prompt can be written.
### Q-A — HR scoping slug
The yt-ingest CLI (built 2026-05-09) emits `scope:hunter_root` on every HR artifact. Phase 0 Q3 + the audit's Constraint #2 note that SPEC.md §2.1/§2.2 describe a `bands:hunter_root` *convention* — a different slug for the same concept.
Today's reality: **`scope:hunter_root` is what is actually written to artifacts.** D7's filter uses that.
The question: is this drift acceptable, or should the spec correct it now (rename the slug in MV, in the CLI, in already-ingested artifacts)?
**Recommendation:** Accept `scope:hunter_root` as the canonical slug going forward. Rationale: it's what shipped, it's used consistently in the YT ingest pipeline, and renaming retroactively is more work than updating SPEC.md to reflect what the code actually does. Mike confirms or overrides.
### Q-B — Phase 2 (status enum drift cleanup): in or out?
Per §4 above. **Recommendation: in.** Half a day, removes a class of latent bug, makes the export trustworthy. But Mike makes the call.
### Q-C — Vocabulary CSV access from MV's curation UI
When Phase 4 builds the Deep Dive tab in MV, the tab needs to read the vocabulary. Three options:
- **(a) MV reads the museum repo's CSV by absolute path** (`C:\AI\Projects\weird-baby-museum\docs\deep-dive-vocabulary.csv`). Simplest. Only works on Mike's laptop, which is fine since MV is local-only.
- **(b) The CSV is mirrored into MV** at session boundaries (committed copy in MV's repo). Decoupled but creates a sync burden.
- **(c) MV reads the CSV via a museum-side HTTP endpoint** that MV calls. Adds a runtime dependency.
**Recommendation: (a).** MV is local-only by design (Status research §10 default vault filter context); the museum repo is at a known path on the same machine. If we ever need to decouple, we revisit.
### Q-D — Phase 1 seed vocabulary
Phase 1 needs a starter CSV with 5–10 tags so the wiring can be tested. Operator suggests: `snarky`, `pink-hats`, `lemonade`, `oops` (your own examples earlier). Need 1–6 more, plus a few group labels. Suggested groups from those four examples: `mood` (snarky, oops), `motif` (pink-hats), `theme` (lemonade).
**Recommendation: I draft 8 seed tags with 3 group labels in the Phase 1 prompt and let Mike react to specific picks during review rather than gating the spec on this list.** Phase 1 doesn't ship without this list, but the list is small enough not to block the spec being committed.
### Q-E — Empty-column rendering on day one
Phase 0 Q2 documents that empty pill columns (`people`, `venue`, `format`, `media`, `provenance`, `odds`) currently render headers with no clickable pills. On day one of Phase 1, the `deep` column will be empty (the CSV has 8 seed tags but no per-video assignments yet). Two options:
- **(a) Ship Phase 1 with the column visible but empty** — header renders, no pills until at least one artifact has Deep Dive tags. Honest about state, matches existing column behavior.
- **(b) Hide the column when empty** — special-case Deep Dive to not render its header until it has content. Cleaner first-impression UX, but creates an inconsistency with how other empty columns behave.
**Recommendation: (a).** Consistency with existing column behavior matters more than first-impression polish. Phase 1's whole point is the wiring; the polish comes when content does.
### Q-F — Existing pre-existing untracked diffs in `tools/yt-ingest.mjs`
Both this audit and the prior YT-ingest sessions surfaced `git status` showing real-content drift on `tools/yt-ingest.mjs` (and once on `docs/ingest-log.md`) that turned out to be FUSE artifacts when checked from PowerShell. This is now happening reliably across sessions. **It is not a Deep Dive concern**, but it's adjacent.
**Recommendation: log this as a backlog item to investigate when Mike has 30 minutes.** It's not blocking and not Deep Dive's responsibility, but the pattern is worth understanding before it bites in a way that's harder to triage.
---
## 6. Implementation phases
Five phases, in dependency order. Each is its own Cowork session. Each will have its own prompt drafted from this spec.
**Phase 1 — Museum-side foundation.** Add the `deep` column to `HR_DIMENSIONS`. Create the seed CSV. Create the empty `deep-tags.json`. Wire the column into the deck via the five-touch addition pattern (Phase 0 Q2). Verify a hand-injected tag-and-assignment round-trips through the existing search and filter logic. PR + merge. **No MV involvement.**
**Phase 2 — MV status enum alignment** (contingent on Q-B answer). Migrate the schema CHECK constraint, update the runtime `STATUS_ENUM`, verify no existing rows violate the new constraint, run the existing test suite. MV-only commit on `main`. **Prerequisite to Phase 3.**
**Phase 3 — Export CLI.** Build `tools/export-deep-tags.mjs` (Node, minimal deps). Connects to MV's `/db`, queries with D7's filter, writes JSON. Add `npm run export-deep-tags`. Document in CLAUDE.md. Live test against the three Reverend artifacts already in MV. PR + merge.
**Phase 4 — MV Deep Dive curation UI.** Add a Deep Dive tab to MV's Inbox UI. Reads the vocabulary CSV (per Q-C). Operator can search vocabulary, click to add, free-form to propose. Persists `deep:*` tags on `artifacts.tags[]`. MV commit on `main`.
**Phase 5 — Live end-to-end test.** Mike pastes one new YouTube URL. Curates standard pills. Curates Deep Dive tags. Releases. Runs export. Builds museum locally. Verifies the new tags appear in the search, filter the deck correctly. Commits the updated `deep-tags.json`. (No PR needed; this is operator validation, not a code change.)
**Phase 6 — Bulk ingest of existing HR YouTube dataset.** Inventory SPINE's existing YouTube videos. For each, run yt-ingest, curate, release. Re-run export. Verify museum surface. Iterate.
---
## 7. What's deferred (and what triggers revisiting)
- **Auto-suggest from transcript / `enrich_helper.py`** (D5 future) — Triggered when 20+ videos are hand-curated and there's data to learn from.
- **MV `/api/intake-queue` endpoint** (from prior YT ingest punchlist) — Triggered when post-registration review feels insufficient at scale.
- **Vault-bytes-copy to `catalogs/_assets/`** (from prior punchlist) — Triggered when an artifact reference goes dangling.
- **Pill-states four-state shape leakage** (Phase 0 Constraint #4) — `enrichment_json` carries mixed shapes today. Not a Deep Dive blocker because the export script does not read `enrichment_json`. **Triggered if any future feature does.**
- **Asset delivery** (R2 / bundled / linked) — Not v1: search results are tags, tag-clicks filter the deck, the deck renders YouTube embeds (existing behavior). Triggered if a future surface needs MV-derived images.
- **Image rendering for Deep Dive results** — Same. Tag-search → tag-click → deck-filter → existing video embed.
- **Other artists** — v1 scope is HR only via D7. Other artists' export filters added when those artists are populated.
- **`hr_facts.js` as a search target** (Phase 0 Constraint #6, D6) — `hr_facts.js` is consumed by `Exhibit.jsx`, not the deck. The two surfaces consume different data. Bridging is non-trivial and out of v1 scope. Triggered if visitors specifically ask for fact-text search.
---
## 8. What this spec does NOT do
- It does not specify SQL or code. Phase prompts will.
- It does not specify pixel-level UX for the MV Deep Dive tab. Phase 4 will, with operator-side wireframes if needed.
- It does not address other artists, other media types, or runtime queries from museum to MV.
- It does not relitigate the eight locked decisions.
---
## Appendix A — Audit findings utilization map
For honest accountability, here is which Phase 0 / Status research findings made it into this spec and where.
| Finding | Used in | How |
|---|---|---|
| Phase 0 Q1 (DeepTracksContent search) | §1, §3.5, §6 Phase 1 | Establishes that the search box already exists and works generically. Phase 1 reduces to "add a column, search auto-picks-up." |
| Phase 0 Q2 (filter mechanics + 5-touch column add) | §3.5, §6 Phase 1 | Documents the addition pattern Phase 1 follows. |
| Phase 0 Q2 (none-selected = all-selected semantics) | §3.5 (implicitly) | Verified to match playbook description; Phase 1 inherits it. |
| Phase 0 Q2 (empty columns render headers only) | Q-E | Surfaces day-one rendering decision. |
| Phase 0 Q3 (`/db` returns whole blob) | §3.4 | Exact mechanism for export. |
| Phase 0 Q3 (`/api/tags` exists) | Not used | Considered as alternative to `/db` for vocabulary; rejected because we don't need full tag rows, just the artifact-to-tag mapping. `/db` carries that. |
| Phase 0 Q3 (`is_proposed` drift) | D3, §6 Phase 4 | D3 says exclude proposed at curation; Phase 4 honors. Export doesn't read tag rows directly so unaffected. |
| Phase 0 Q3 (loopback-only MV) | §2 derived decisions, §3.6, Q-C | Locks operator-CLI architecture. |
| Phase 0 Q4 (no museum→MV consumption today) | §2 derived decisions | Confirms greenfield; no existing pattern to extend. |
| Phase 0 Q5 (three export shapes weighed) | §2 derived decisions, §3.4 | Cited rationale for operator-CLI choice. |
| Phase 0 Constraint #1 (Deep Dive vs. Deep Tracks naming) | D1 | Settled. |
| Phase 0 Constraint #2 (HR scoping slug) | Q-A | Surfaced to Mike. |
| Phase 0 Constraint #3 (`is_proposed` rule) | D3, §6 Phase 4 | Settled. |
| Phase 0 Constraint #4 (pill-states 4-state leakage) | §7 | Deferred with trigger condition. |
| Phase 0 Constraint #5 (loopback-only MV) | §2 derived decisions, §3.6 | Used to lock operator-CLI. |
| Phase 0 Constraint #6 (asset delivery) | §7 | Deferred with trigger condition. |
| Phase 0 Constraint #7 (`hr_facts.js` as search target) | D6, §7 | Settled (no) and deferred. |
| Status research Findings 1-8 (lifecycle taxonomy) | D7, D8, §3.6 | Filter expression grounded in §4 SPEC + §8.1 default vault filter. |
| Status research Finding 9 (status enum drift) | §4, §6 Phase 2, Q-B | Surfaced with explicit phase + recommendation. |
| Status research Finding 10 ("ready" not a status) | §1 (not used; we never used "ready") | — |
| Status research Finding 11-12 (YT ingest release semantics) | §3.2 (implicitly) | Operator decides per artifact; matches existing flow. |
| Status research Finding 13 (VISION_LOCK G-01) | §3.4, §3.6, D7 | Cited as architectural anchor for "deliberate export step." |
| Status research Finding 14 (Phase-0 export-filter gap) | This spec is the resolution. | — |
