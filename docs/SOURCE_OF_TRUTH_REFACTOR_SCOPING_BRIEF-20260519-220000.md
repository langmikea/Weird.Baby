# Source-of-Truth Refactor — Scoping Brief

**Date:** 2026-05-19
**Trigger:** Operator decision 2026-05-19 (Decision Brief, Parked-items §
"Added 2026-05-19 — single-source-of-truth policy"). Three BUILD-phase
reports (Criteria 5, 6, 7) and one read-only audit (Criterion 8 deferral)
surfaced the same drift class: a definition lives in N places. Policy:
definitions are generated from one canonical source; copies are retired.
**Scope:** Read-only investigation. No code, schema, doc, or data change in
this session — the output is this brief. Implementation is a follow-on
work item, scoped here, executed later.
**Status:** SCOPING COMPLETE.

---

## §0 — How to read this brief

The brief mirrors the format of the `CRITERION*_RUN_REPORT` series: §1 is
the audit findings, §2 names the canonical source per definition, §3
specifies the build plumbing, §4 retires each duplicate, §5 sequences the
work, §6 calls out the Criterion 8 unblock.

Citations use `file:line` form. Quoted text is verbatim from the cited
location at the time of this audit; the verification pass (§7) confirmed
each citation against the live file.

The §0.5 / §1-principle-5 constraint from
`DATA_ARCHITECTURE_SPEC_v2.1-target.md` is the governing rule for all
candidate canonical-source assignments below: **the site build and the
prebuild hook never contact MV.** Therefore "from the registry" in §8.3
can only mean "from a committed file *generated from* the registry by a
build step." Every assignment in §2 respects this.

---

## §1 — Inventory of duplicated definitions

Six definitions are duplicated across the portfolio. Four were named in
the trigger (status enum, exhibit-badging path, pill-tier-by-namespace
map, legacy `tags` table registry data); two were surfaced by this audit
(media-type enum, known-exhibits bootstrap list).

### 1.1 Status / lifecycle enum *(Criterion 5 follow-up)*

Four copies, two of which agree, one which silently disagrees, one which
is dead text.

| # | Location | Says |
|---|---|---|
| (a) | `C:\AI\Platform\MediaVault\core\migrate_to_v04.py:267` (live schema DDL applied to `mediavault.sqlite`) | `CHECK(status IN ('inbox','vault','released','archived'))` |
| (b) | `C:\AI\Platform\MediaVault\SPEC.md:268` (column comment) and `:208`, `:463`, `:594` (prose) | `inbox\|vault\|released\|archived` (Criterion 5, 2026-05-19, corrected this) |
| (c) | `C:\AI\Platform\MediaVault\core\imgserver_extensions.py:113` | `STATUS_ENUM = {"vault", "released", "archived", "deleted"}` |
| (d) | `C:\AI\Platform\MediaVault\PROJECT.md:29` | `inbox → vault → released (or deleted). Archive is orthogonal: a nullable archived_at timestamp` |

**Where they disagree.** (a) and (b) agree after Criterion 5. (c)
**omits `inbox`** (the DB CHECK would accept it; the validator rejects it
from `/api/artifact-register` and `/api/artifact-update` body fields) and
**includes `deleted`** (the DB CHECK would reject it — a client sending
`status='deleted'` through the validator passes validation and then gets
an opaque IntegrityError from SQLite). (d) is dead text repeating the
retired `archived_at`-is-canonical model that Criterion 5 corrected in
SPEC.md but did not sweep through PROJECT.md / STATE.md / WORKFLOW.md.

**Readers of each copy.**
- (a) — read implicitly by every `INSERT` / `UPDATE` against
  `artifacts.status`, i.e. everything in `imgserver.py`,
  `imgserver_extensions.py`, `ingest_engine.py`, and `artifact_tags.py`
  that touches that column.
- (b) — read by humans only. Authoritative per Criterion 5.
- (c) — read by `validated("status", STATUS_ENUM, "vault")` at
  `imgserver_extensions.py:287` (artifact-register handler).
- (d) — read by humans only. Stale.

### 1.2 Exhibit-badging path *(Criterion 6 OPEN ITEM)*

This is a **spec wording duplication**, not a code duplication: two
phrases describe how badging happens, and Criterion 6's actual method
matched neither phrase literally while routing through the §4.5 single
writer.

| # | Location | Says |
|---|---|---|
| (a) | `DATA_ARCHITECTURE_SPEC_v2.1-target.md:327-330` (§4.5 — `exhibit:` badging before the GUI exists) | "badging is done through the **existing MV Inbox curation path** (per v1.1 §8.3), which is a legitimate writer (#2 above)" |
| (b) | `DATA_ARCHITECTURE_SPEC_v2.1-target.md:737-739` (§12.6 criterion) | "Released artifacts carry `exhibit:` tags (badged via the MV Inbox); `npm run export-artifacts` produces per-exhibit JSON containing real records." |
| (c) | `docs/CRITERION6_RUN_REPORT-20260519-154523.md:27-29` (method actually used) | "Badging was done via 17 scripted `POST /api/artifact-update` calls" — routes through `write_artifact_tags` (`core/artifact_tags.py:89`), the §4.5 single coordinated writer. |

**Where they disagree.** (a) and (b) name "the MV Inbox" as the badging
path; (c) used `/api/artifact-update` instead. Both (a)/(b) and (c) go
through `write_artifact_tags` — the §4.5 single-writer guarantee is
intact in either case. The disagreement is one of *method* (operator at
the Inbox UI vs. scripted HTTP), not of *correctness*. The spec wording
in (a)/(b) is narrower than the underlying §4.5 mechanism it relies on.

**Readers of each copy.**
- (a) and (b) — read by humans (operator + ops). Govern the meaning of
  "BUILD-done" for §12.6.
- (c) — recorded outcome; the §12.6 criterion is met "on outcome" but
  flagged as deferred-by-method.

### 1.3 Pill-tier-by-namespace map *(Criterion 7 OPEN ITEM)*

Three copies, all currently agreeing on tier membership, with no
generator linking them.

| # | Location | Says |
|---|---|---|
| (a) | `docs/CANONICAL_VOCABULARY.md:13-36, 79-86` | Tier 1 ARTIST: `year, album, song, venue, people`. Tier 2 MEDIA: `source, type`. Tier 3 DEEP DIVE: every other namespace (dynamic, ordered by registry `sort_order` then hit count). |
| (b) | `C:\AI\Platform\MediaVault` `vocabulary` table — seeded by `_cowork/v10_add_vocabulary_table.py:79-91` schema; 92 rows in the live DB | Per `DATA_ARCHITECTURE_SPEC_v2.1-target.md:439-440`: "the 92 rows currently in the live table are abandoned seed data." Live schema carries `tier INTEGER` and `sort_order INTEGER` columns; values are seed, wired to nothing. |
| (c) | `C:\AI\Projects\weird-baby-museum\src\routes\hr\hr_dimensions.js:45-48` | `const TIER_BY_NAMESPACE = { year: 1, album: 1, song: 1, venue: 1, people: 1, source: 2, type: 2, };` Everything else → tier 3 via `?? 3` fallback at `:51`. |

**Where they disagree.** They currently agree on tier membership.
Drift risk is real but bounded: Tier 1 and Tier 2 membership is locked
in canon (§1.1 of `CANONICAL_VOCABULARY.md`). They disagree on whose
authority decides; that disagreement is the source-of-truth problem.

**Readers of each copy.**
- (a) — read by humans, ops, and code authors. Authoritative per the
  doc's own §"Authority" header.
- (b) — read by no MV-side code today. The 92 rows are abandoned seed
  data (per `DATA_ARCHITECTURE_SPEC_v2.1-target.md:439-440`).
- (c) — read by `tierForNamespace()` at `hr_dimensions.js:50-52`,
  consumed by `buildDimensions()` at `:108-118`, called from
  `HrExhibitFlow.jsx` (verified in Criterion 7).

Plus the **orphan prebuild output** (closely related): the
`build-deep-tags-vocabulary.mjs` hook at `tools/build-deep-tags-vocabulary.mjs`
reads `docs/deep-dive-vocabulary.csv` (6 rows, all `mood/theme/motif/texture`,
marked legacy) and writes `src/data/deep-dive-vocabulary.json`. Per
`docs/CRITERION7_RUN_REPORT-20260519-195552.md:154-159`, a repo-wide grep
finds **zero importers in `src/`** for the emitted JSON. The hook still
runs on every `npm run build` via `package.json:8`.

### 1.4 Legacy `tags` table registry-era columns *(Criterion 8 dependent)*

Two copies, by intent and provenance.

| # | Location | Says |
|---|---|---|
| (a) | `C:\AI\Platform\MediaVault\SPEC.md:302-310` and live MV schema (`migrate_to_v04.py:288-296`, plus `_cowork/v05_phase2_vocab.py` adds `is_proposed INTEGER NOT NULL DEFAULT 0`) | `tags(slug PK, display_name, description, category, is_proposed, is_exclusive, usage_count, created_at)` — a tag registry: who exists, in which `category`, with what display name, whether proposed, whether mutually exclusive, with usage count. 84 rows live. |
| (b) | `DATA_ARCHITECTURE_SPEC_v2.1-target.md:370-393` (§5.2) | The `tags` table is **demoted** to a per-value usage-count cache. Registry-era columns (`category`, `is_proposed`, `is_exclusive`, `description`) are dropped; namespace metadata moves to the `vocabulary` registry (§5.4). |

**Where they disagree.** (a) is the live schema and what every running
caller assumes. (b) is the target. They disagree on which columns
exist and on who owns the namespace/tier metadata that `category`
currently encodes (per `docs/CANONICAL_VOCABULARY.md:68`: MV's `tags.category`
uses `bands, content_kind, topic, platform, …`; the museum's pill columns
need namespace+tier instead — see §1.3 (a)).

**Readers of each copy (live).** Established by the Criterion 8 audit
(`docs/CRITERION8_DEFERRAL_NOTE-20260519-211529.md:18-32`):
- `imgserver.py:389` — `SELECT * FROM tags` (tag-list endpoint).
- `imgserver.py:732` — `display_name, category` (autocomplete /
  enrich-prompt vocab pull).
- `imgserver.py:1239-1438` — Vocab Admin sweeps (create / rename / merge
  / delete / accept / reject) depend on all four registry-era columns
  (`category`, `is_proposed`, `is_exclusive`, `description`).
- `imgserver_extensions.py:373-377` — INSERT writes
  `category, is_proposed, is_exclusive` during the YT-registration
  novel-slug auto-create.
- `ingest_engine.py:115-118` — `upsert_tag` writes the same during
  intake.
- `core/attention_rules.py:20` (referenced; not opened in this audit) —
  reads `vocab[slug] = {"category": ..., "is_proposed": ...}`.

Net: **~30 call sites** read or write the registry-era columns (the
Criterion 8 audit's count). Re-pointing them is the prerequisite for the
schema operation §5.2 describes.

### 1.5 `media_type` enum *(surfaced by this audit)*

Three copies, with a known free-text / NULL mess on the live side.

| # | Location | Says |
|---|---|---|
| (a) | `C:\AI\Platform\MediaVault\core\imgserver_extensions.py:107` | `MEDIA_TYPE = {"photo", "video", "audio", "link", "text", "mixed", "other"}` |
| (b) | `C:\AI\Platform\MediaVault\SPEC.md:282` (column comment) | `media_type TEXT, -- photo\|video\|audio\|link\|text\|mixed\|other` |
| (c) | `DATA_ARCHITECTURE_SPEC_v2.1-target.md:500-513` (§6.1) | Target set: `link, mixed, photo, text, video, unknown`. BUILD normalizes `text-only`→`text`, `NULL`→`unknown`, and adds a CHECK. |

**Where they disagree.** (a) and (b) agree (7-value set with `audio`,
`other`). (c) drops `audio` and `other` and adds `unknown`. The live
column has **no CHECK** today (per §6.1, "free TEXT with seven distinct
values incl. NULL") so the database is a fourth informal copy that
contains values not in any of the three written copies.

**Readers of each copy.**
- (a) — `validated("media_type", MEDIA_TYPE, ...)` at
  `imgserver_extensions.py:321-322` (artifact-register handler).
- (b) — read by humans only.
- (c) — read by humans only; the BUILD migration / CHECK is not yet
  implemented. (`§6.1 (target)` is not the same as the live column.)
- Live values are read in:
  - `tools/export-artifacts.mjs:264-266` — checks
    `row.media_type === "link"` (YouTube thumbnail synthesis).
  - `src/routes/hr/HrExhibitFlow.jsx:849` — `card.media_type === "link"`
    (card dispatch).
  - `src/routes/hr/HrExhibitFlow.jsx:842` — fallback render
    `card.media_type || "(unknown)"`.

This was not in the trigger list because the museum side renders
correctly today — `mixed`, `link`, and `null` all reach a valid
renderer. But it is the same drift class: one value set, three written
copies, one live column with no enforcement.

### 1.6 Known-exhibits bootstrap list *(surfaced by this audit)*

One code copy plus an open spec direction; documenting now because §7.3
of the target spec names the planned canonical surface.

| # | Location | Says |
|---|---|---|
| (a) | `C:\AI\Projects\weird-baby-museum\tools\export-artifacts.mjs:57` | `const KNOWN_EXHIBITS = ["hunter_root"];` |
| (b) | `DATA_ARCHITECTURE_SPEC_v2.1-target.md:569-573` (§7.3, Appendix A G5) | "currently a hardcoded array `["hunter_root"]` inside `export-artifacts.mjs`. … BUILD relocates it to `src/data/exhibits.config.json` (or equivalent); extending that file is the documented way to introduce a new exhibit route." |

**Where they disagree.** (a) is in code, (b) is the documented plan.
The new canonical file does not exist yet. Only one copy today, but
this is the right time to address it: introducing the build plumbing in
§3 below has natural overlap.

**Readers of each copy.**
- (a) — `export-artifacts.mjs:324` — `Array.from(new Set([...discovered, ...KNOWN_EXHIBITS])).sort()`.
- (b) — read by humans only.

---

## §2 — Canonical source per definition

The §0.5 / §1-principle-5 constraint governs the assignments: the site
build and prebuild hook never contact MV. Anything the site reads must
be a **committed file** generated from the canonical source by a build
step the operator can re-run.

| Definition | Canonical source | Rationale |
|---|---|---|
| 1.1 Status / lifecycle enum | `C:\AI\Platform\MediaVault\SPEC.md` §4.1 + §6 (the SPEC) — already aligned with the live CHECK constraint by Criterion 5. | The SPEC.md text and the live `CHECK(status IN (...))` are the two surfaces operators reason against. SPEC.md is the human-readable home; the CHECK is the runtime guard. Code copies (1.1c) are retired; doc copies (1.1d) are corrected. No new file needed. |
| 1.2 Exhibit-badging path | `DATA_ARCHITECTURE_SPEC_v2.1-target.md` §4.5 — but reframed. The spec wording widens from "via the MV Inbox" to "**any §4.5 single-writer path**" (Criterion 6 OPEN ITEM, resolution path (a)). | The §4.5 single-writer rule is the actual invariant the system needs; "the MV Inbox" was the operator-facing UX, not the structural guarantee. Reframing satisfies (a) and (b) of the OPEN ITEM by ratifying scripted badging through any path that routes through `write_artifact_tags` — which is exactly what (c) did. No new mechanism, no migration. |
| 1.3 Pill-tier-by-namespace map | `docs/CANONICAL_VOCABULARY.md` (the canon doc), with the MV `vocabulary` table **regenerated from it** by a build step. The committed museum-side file is `src/data/vocabulary.json` (new), generated either directly from `CANONICAL_VOCABULARY.md` or from a `vocabulary`-registry export — Criterion 7 OPEN ITEM path (b). | Canon doc is the operator's single home for namespace/tier/display-name decisions. The `vocabulary` table is the registry shape MV expects (per §5.4 of v2.1-target: "regenerated from `CANONICAL_VOCABULARY.md` by a named build step"). The museum's committed JSON is the §0.5 / §1-principle-5-compliant downstream surface. This retires the JS const at `hr_dimensions.js:45-48`. Path (c) — embed registry in per-exhibit JSON — is rejected: it couples vocabulary to export cadence (every export rewrites every exhibit JSON's metadata) instead of to canon edits. |
| 1.4 Legacy `tags` table registry data | `C:\AI\Platform\MediaVault` `vocabulary` table — for namespace-level metadata (per §5.4 of v2.1-target). Plus the demoted `tags` table itself as the usage-count cache (per §5.2). | The whole point of the §5.4 replaced `vocabulary` table is to be the one home for namespace/tier/display-name. Once readers point there, the legacy `tags` columns are unreferenced and §5.2's drop is mechanical. The shared single source with 1.3 is intentional: 1.3 and 1.4 are the same definition seen from two sides — 1.3 is "the museum needs it"; 1.4 is "MV's running code needs it." Both should read the same registry. |
| 1.5 `media_type` enum | `DATA_ARCHITECTURE_SPEC_v2.1-target.md` §6.1 — already names the target set (`link, mixed, photo, text, video, unknown`) and prescribes a live CHECK. SPEC.md is then corrected to match. The Python `MEDIA_TYPE` set in `imgserver_extensions.py:107` is retired in favor of the CHECK. | The v2.1-target wording is the only place that captures the operator's actual intent (`text` not `text-only`; explicit `unknown` instead of NULL). SPEC.md's column comment becomes derivative. The Python set is redundant once the DB CHECK enforces the same set — defense-in-depth at app level can stay, but it then reads the CHECK rather than declaring its own list. (See §3.5 below for the plumbing option.) |
| 1.6 Known-exhibits bootstrap | `src/data/exhibits.config.json` (new, per §7.3 of v2.1-target). | The hardcoded array in `export-artifacts.mjs` becomes a committed config file the operator edits when introducing a new exhibit route. Site build and export both read this file directly — it is small, committed, and not generated from any further upstream source. |

Notes on candidates considered and not chosen:

- *A new "definitions" file at repo root.* Rejected. Each definition
  already has a natural home; introducing a meta-file adds a layer with
  no readers and is precisely the kind of orphan artifact the policy
  exists to retire.
- *MV's live schema as the canonical source for the status enum.*
  Rejected. The live CHECK is a runtime guard, not a place operators
  edit. SPEC.md is the human-readable home; the CHECK is one of its
  enforced surfaces.
- *Embedding the vocabulary registry in per-exhibit JSON
  (Criterion 7 OPEN ITEM path (c)).* Rejected — see 1.3 above.

---

## §3 — Build-step plumbing per canonical→committed surface

For each canonical source that needs to reach a non-canonical surface,
the build step that bridges them. **When it runs** distinguishes
*prebuild* (automatic on every `npm run build`) from *operator-run*
(invoked deliberately, like the existing `npm run export-artifacts`).

The site build and the prebuild hook still must not contact MV
(§0.5 / §1-principle-5). The committed-file pattern below preserves
that.

### 3.1 Status enum

**No build step needed.** Status enum has one machine-enforced surface
(the live CHECK constraint) and one human surface (SPEC.md). They are
already aligned; the work is retirement (§4.1), not plumbing.

### 3.2 Exhibit-badging path

**No build step needed.** Spec wording change in
`DATA_ARCHITECTURE_SPEC_v2.1-target.md` §4.5 / §12.6 — widen "via the MV
Inbox" to "any §4.5 single-writer path." Doc edit only.

### 3.3 Pill-tier-by-namespace map — the main plumbing work

Two build steps, both new. They convert one canonical doc into the
two committed downstream artifacts.

**Build step A — MV `vocabulary` registry regeneration.**
- *When:* operator-run, infrequent — only when canon changes. A
  candidate command: `python tools/regen_vocabulary.py` in the MV repo.
- *Reads:* `docs/CANONICAL_VOCABULARY.md` from the museum repo (paths
  are stable on the operator's machine; the MV script can resolve the
  museum path or accept it as a flag).
- *Writes:* rows in MV's `vocabulary` table (namespace, display_name,
  tier, sort_order, retired_at). Per §5.4 of v2.1-target, the
  structurally-replaced table is namespace-only.
- *Read by:* MV's call sites that today read `tags.category`
  (~30 sites listed in §1.4). After re-pointing (§4.4), those sites
  read `vocabulary` instead.

**Build step B — Museum committed-JSON regeneration.**
- *When:* prebuild hook — automatic on every `npm run build`. This
  replaces the orphan `build-deep-tags-vocabulary.mjs` step at
  `package.json:8`.
- *Reads:* `docs/CANONICAL_VOCABULARY.md` directly (option B1) **or**
  reads the `vocabulary` registry via the export's blob path
  (option B2 — only if the operator wants registry to be authoritative
  and the doc to derive from it instead).
- *Writes:* `src/data/vocabulary.json` (committed) — one entry per
  namespace with tier, display_name, sort_order, retired_at.
- *Read by:* `hr_dimensions.js` (replaces the `TIER_BY_NAMESPACE`
  const at `:45-48`), the dimension builder, and any future museum
  code needing display names by slug.

The recommended choice is **B1 (read canon directly)** for two reasons:
the canon doc is human-edited and committed; reading it keeps the
prebuild hook MV-free (§1-principle-5) without depending on an
operator-run export having happened first; and it preserves
"canon doc is authoritative, registry is descriptive" (§3.4 of
v2.1-target).

The new prebuild step parses canon (the markdown structure is
predictable: the Tier 1 list, the Tier 2 list, the Tier 3 catch-all
rule, the routing-tag callout, the display-name section) into a
machine-readable JSON. This is small surface area — under 100 lines.

### 3.4 Legacy `tags` table registry data

**No new build step for the cache itself.** The `tags`-table-as-cache
is refreshed by `write_artifact_tags` at `core/artifact_tags.py:172-181`
(the per-slug `usage_count` +/-1 already lives there) and is
recomputable from `artifacts.tags` at any time. The work for §1.4 is
re-pointing readers (§4.4), not new plumbing.

### 3.5 `media_type` enum

**Optional plumbing.** Two viable shapes:

- *Shape A — DB CHECK is the single source.* SPEC.md describes it; the
  Python `MEDIA_TYPE` set is retired and code reads
  `PRAGMA table_info`-style introspection (or a tiny shared module that
  declares the set once, derived by hand from the CHECK). No
  generation step.
- *Shape B — A generated `media_types.py` module.* A build step reads
  the CHECK constraint via `PRAGMA` and writes `core/media_types.py`
  with a `MEDIA_TYPE = {...}` constant. Code imports from there.

Shape A is simpler; Shape B is more "machine-derived." For one
seven-value set, Shape A's discipline (the CHECK is the authority; the
in-code set is by hand from the CHECK) is adequate. Recommended:
Shape A.

### 3.6 Known-exhibits bootstrap

**No build step needed.** Move `KNOWN_EXHIBITS = ["hunter_root"]` from
`export-artifacts.mjs:57` to `src/data/exhibits.config.json` (committed).
`export-artifacts.mjs` reads the JSON file at startup. The site build
can also read it directly if any route discovery is needed.

---

## §4 — Retirement plan per duplicate copy

Each row below names the duplicate, what removes it, and the
dependencies — which other retirement, build step, or migration must
already be in place. Numbering matches §1.

### 4.1 Status enum copies

| Copy | Retirement action | Dependency |
|---|---|---|
| 1.1 (c) `STATUS_ENUM` in `imgserver_extensions.py:113` | **Code edit.** Replace the set literal with one matching the live CHECK: `{"inbox", "vault", "released", "archived"}`. Verify validator behavior at `:287` is preserved (default `"vault"` is unchanged; `inbox` becomes a legal input value at register — confirm this is intended, since today the validator rejects it). | None — purely a code edit. May want a small validator test added. |
| 1.1 (d) `PROJECT.md:29` (and `STATE.md`, `WORKFLOW.md` if they repeat the retired `archived_at`-is-canonical claim — Criterion 5 follow-up logged this) | **Doc rewrite.** Sweep the three companion docs to match the post-Criterion-5 SPEC.md text. | None — doc-only. |

### 4.2 Exhibit-badging path

| Copy | Retirement action | Dependency |
|---|---|---|
| 1.2 (a) `DATA_ARCHITECTURE_SPEC_v2.1-target.md:327-330` | **Doc rewrite.** "via the existing MV Inbox curation path" → "via any §4.5 single-writer path (today: the MV Inbox UI **or** scripted callers of `write_artifact_tags`)." | None — doc-only. |
| 1.2 (b) `DATA_ARCHITECTURE_SPEC_v2.1-target.md:737-739` (§12.6) | **Doc rewrite.** "(badged via the MV Inbox)" → "(badged via any §4.5 single-writer path)." | None. Companion of 1.2 (a). |
| 1.2 (c) Criterion 6 deferred-by-method state | **Resolved by the (a)/(b) edits above.** Scripted badging is then a ratified method, not an unflagged divergence. | (a) and (b). |

### 4.3 Pill-tier-by-namespace map copies

| Copy | Retirement action | Dependency |
|---|---|---|
| 1.3 (b) The 92 abandoned seed rows in `vocabulary` table | **Schema migration + re-seed.** Per `DATA_ARCHITECTURE_SPEC_v2.1-target.md:413-440` (§5.4): DROP and re-CREATE the `vocabulary` table as namespace-only (columns: `namespace`, `display_name`, `tier`, `sort_order`, `retired_at`); re-seed from the new build step (§3.3 step A). | §3.3 build step A in place; SLUG_NAMESPACE_MAP work done (already complete per `docs/SLUG_NAMESPACE_MAP.md`). |
| 1.3 (c) `TIER_BY_NAMESPACE` const at `hr_dimensions.js:45-48` and `tierForNamespace()` at `:50-52` | **Code edit.** Replace with a load of `src/data/vocabulary.json` (committed by the new prebuild hook) and a lookup function over the loaded object. Display-name handling at `:63-70` (`prettify`) is preserved as a fallback when a slug has no entry in the registry (the spec's "registry is descriptive, never gating," §3.4). | §3.3 build step B in place; `src/data/vocabulary.json` committed. |
| Orphan: `tools/build-deep-tags-vocabulary.mjs` prebuild hook + `docs/deep-dive-vocabulary.csv` + `src/data/deep-dive-vocabulary.json` | **Code + doc retirement.** Remove the prebuild hook from `package.json:8`; remove the CSV from `docs/`; remove the generated JSON from `src/data/` (or repoint `package.json` to the new prebuild step that emits `src/data/vocabulary.json`). The legacy CSV has zero importers in `src/` (verified — Criterion 7 observation; this audit confirmed grep). | The replacement prebuild step (§3.3 B) lands first; only then is it safe to remove the old one (or repoint it). |
| Cosmetic: `vocabulary_csv_sha` in exhibit-JSON metadata (`export-artifacts.mjs:294-298, :345`) | **Code edit.** Either replace with `vocabulary_sha` (over the new committed `src/data/vocabulary.json`) or remove the field — the museum does not consume it (Criterion 7 observation). | The new committed JSON exists (§3.3 B). |

### 4.4 Legacy `tags` table registry-era columns

This is the largest retirement, and it is *the* Criterion 8 unblock.

| Step | Retirement action | Dependency |
|---|---|---|
| 1.4.A Re-point readers of `tags.category` / `tags.display_name` (autocomplete, enrich-prompt vocab pull) at the `vocabulary` registry. | **Code edit** in `imgserver.py:732-736` (and any siblings that use `category` for grouping). Read from `vocabulary` (`namespace`, `display_name`, `tier`, `sort_order`). | §3.3 build step A in place; `vocabulary` table re-seeded. |
| 1.4.B Re-point the tag-list endpoint at `:389`. | **Code edit.** `SELECT * FROM tags` becomes either a join against `vocabulary` (for display names per namespace) or a thin query over the demoted cache. | Same as 1.4.A. |
| 1.4.C Vocab Admin sweeps at `:1239-1438` — rewrite for the demoted schema. The `is_proposed` workflow is already retired conceptually (per `STATE.md:87`: "Removed. One-stage vocabulary."); the code hasn't caught up. The rename / merge / delete / reject paths each touch `is_proposed`, `category`, `is_exclusive`, `description` and need their behaviors reworked. | **Code edit, substantial.** Each handler needs reading from `vocabulary` (for namespace/tier/display-name authority) and a usage-count touch on the demoted `tags` cache. Several handlers (`tag-accept`, `tag-reject deprecate`) become no-ops or are removed outright. | 1.4.A, 1.4.B; plus an explicit operator confirmation that the conceptually-retired `is_proposed` workflow is also retired in the UI. |
| 1.4.D Re-point the auto-create-novel-slug path at `imgserver_extensions.py:373-377` and `ingest_engine.py:115-118`. | **Code edit.** Today both INSERT `category, is_proposed, is_exclusive` on novel-slug creation. After demotion, novel slugs are tracked in the cache only (usage_count starts at 0+) and namespace metadata never travels with the value. | 1.4.A. |
| 1.4.E `attention_rules.py:20` — confirm reader pattern, repoint if needed. | **Code edit (small).** Audit and convert the `vocab[slug] = {"category": ..., "is_proposed": ...}` shape to something derived from the new sources. | 1.4.A. |
| 1.4.F Reconcile the 15-row stale gap (84 `tags` rows vs. 69 distinct `artifacts.tags` slugs — `docs/CRITERION8_DEFERRAL_NOTE-20260519-211529.md:29-31`). | **Data cleanup.** Drop bare-slug residue from the demoted cache; leave the rest matched 1:1 with namespaced live slugs. The cache is recomputable from `artifacts.tags` so this is safe. | All earlier 1.4 steps; namespaced-tag migration (§5.5 of v2.1-target) has happened. |
| 1.4.G Drop the registry-era columns from `tags` (`category`, `is_proposed`, `is_exclusive`, `description`). | **Schema migration.** Once no reader references these columns, the drop is well-bounded and mirrors Criterion 5's shape. The cache columns that remain are `slug`, `usage_count`, and creation/update timestamps. | 1.4.A-F all complete. **This is §12 Criterion 8 itself.** |

### 4.5 `media_type` enum copies

| Copy | Retirement action | Dependency |
|---|---|---|
| 1.5 (b) `SPEC.md:282` column comment | **Doc rewrite.** Align with the v2.1-target set (`link, mixed, photo, text, video, unknown`). | The schema operation lands before SPEC.md is rewritten (otherwise SPEC drifts ahead of code again — the exact bug Criterion 5 fixed for the status enum). |
| 1.5 (a) `MEDIA_TYPE` set at `imgserver_extensions.py:107` | **Code edit.** Per §3.5 Shape A: align with the v2.1-target set; the live CHECK becomes the authority. | The live CHECK is added (the schema operation §6.1 of v2.1-target names). |
| Live column drift (`text-only`, NULL, etc.) | **Data migration + schema CHECK addition.** Per §6.1 of v2.1-target. Out of scope for this brief — that work is its own §12 item, named separately. Calling it out here only so the dependency chain is honest. | None on the source-of-truth side; this is a separate BUILD item that happens to share the same target set. |

### 4.6 Known-exhibits bootstrap

| Copy | Retirement action | Dependency |
|---|---|---|
| 1.6 (a) `KNOWN_EXHIBITS = ["hunter_root"]` at `export-artifacts.mjs:57` | **Code edit + new file.** Create `src/data/exhibits.config.json` (committed) with `{"known_exhibits": ["hunter_root"]}`. Repoint `export-artifacts.mjs` to read it. | None — independent of all other work. Good warm-up commit. |

---

## §5 — Sequencing

The retirements have natural dependencies; some run in parallel, others
must serialize. A commit-level sketch follows. Each numbered step is a
plausible commit; substeps are sub-commits within a topic.

**Phase 0 — Free wins.** No dependencies, low surface area, individually
shippable.

0.1 Status enum sweep (§4.1). One commit per file likely: edit
`imgserver_extensions.py:113`; doc-sweep `PROJECT.md`, `STATE.md`,
`WORKFLOW.md` for the retired `archived_at`-is-canonical claim.
*Commit point:* "STATUS_ENUM aligned with SPEC.md / live CHECK; companion
docs swept."

0.2 Exhibit-badging spec rewording (§4.2). Doc-only. Two short edits.
*Commit point:* "§4.5 / §12.6 widened to any §4.5 single-writer path;
Criterion 6 OPEN ITEM resolved."

0.3 Known-exhibits bootstrap relocation (§4.6). Adds
`src/data/exhibits.config.json`; trims `export-artifacts.mjs:57`.
*Commit point:* "exhibits bootstrap moved to committed config."

**Phase 0 is safe in parallel** — none of 0.1–0.3 share files or build
output. Three commits, three reviews, three small wins. They also serve
as a build-process sanity check before the larger work.

**Phase 1 — Tier map plumbing (the keystone).** Unblocks both 1.3 and
1.4.

1.1 Add the new prebuild step (§3.3 step B) that reads
`docs/CANONICAL_VOCABULARY.md` and writes `src/data/vocabulary.json`.
Wire it into `package.json:8` *alongside* the old hook initially (both
hooks run; both outputs committed). This is the safe rollout: prove the
new file is correct before removing the old one.
*Commit point:* "new vocabulary prebuild hook; old hook still runs."

1.2 Repoint `hr_dimensions.js:45-48` to read `src/data/vocabulary.json`.
The `TIER_BY_NAMESPACE` const goes away. Display names use the registry
when present, `prettify` fallback otherwise.
*Commit point:* "museum tier derivation reads the registry."

1.3 Add the MV-side `vocabulary` regeneration step (§3.3 step A). This
is an operator-run script (not a prebuild) that DROP / CREATE / re-seeds
the `vocabulary` table from `CANONICAL_VOCABULARY.md`. Run it once.
*Commit point:* "MV vocabulary table regenerated from canon."

1.4 Retire the old prebuild hook (`tools/build-deep-tags-vocabulary.mjs`)
and the legacy CSV (`docs/deep-dive-vocabulary.csv`) and the
unread JSON (`src/data/deep-dive-vocabulary.json`). Update the
`vocabulary_csv_sha` metadata field per §4.3.
*Commit point:* "legacy deep-dive-vocabulary prebuild retired."

Phase 1.2 depends on 1.1; 1.3 depends on 1.1 (canon parser is reused or
the same registry shape is targeted); 1.4 depends on 1.1 + 1.2 having
landed and been verified. The order 1.1 → (1.2 || 1.3) → 1.4 is the
minimum-risk path; 1.2 and 1.3 can be parallel commits since they touch
different repos and surfaces.

**Phase 2 — Legacy `tags` demotion (Criterion 8 itself).** All steps
depend on Phase 1 (because they re-point readers at the `vocabulary`
registry that Phase 1 creates). Within Phase 2, ordering is
finer-grained.

2.1 Repoint read-only call sites — tag-list endpoint (`:389`),
autocomplete / enrich-prompt vocab pull (`:732-736`),
`attention_rules.py:20` (§4.4 A, B, E). These are read-side only and
mutually independent.
*Commit point:* "MV read sites repointed at `vocabulary` registry."

2.2 Repoint write-side novel-slug auto-creation paths (§4.4 D):
`imgserver_extensions.py:373-377` and `ingest_engine.py:115-118`. These
no longer write `category`, `is_proposed`, `is_exclusive`.
*Commit point:* "novel-slug auto-create no longer writes registry-era
columns."

2.3 Rewrite Vocab Admin handlers (§4.4 C — `imgserver.py:1191-1438`).
This is the biggest sub-step. Several handlers become no-ops
(`tag-accept`, `tag-reject deprecate`) and may be removed entirely;
others (`tag-create`, `tag-update`, `tag-reject remove|replace`) are
rewritten to operate on the demoted cache plus the `vocabulary`
registry. Confirms with operator the conceptually-retired
`is_proposed` workflow is gone from the UI too.
*Commit point:* "Vocab Admin handlers rewritten for the demoted
schema."

2.4 Reconcile the 15-row stale gap and refresh the cache (§4.4 F).
*Commit point:* "tags cache reconciled with `artifacts.tags`."

2.5 Drop the registry-era columns from `tags` (§4.4 G — **the actual
Criterion 8 schema operation**). Mirrors Criterion 5's shape: a
well-bounded migration script with a pre-write backup.
*Commit point:* "Criterion 8 — legacy `tags` table demoted to a
usage-count cache."

Within Phase 2: 2.1 and 2.2 can be parallel. 2.3 depends on 2.1 (the
handlers need the new read patterns established). 2.4 depends on
2.1-2.3. 2.5 depends on all of 2.1-2.4.

**Phase 3 — `media_type` cleanup (separately scoped).** Not part of the
source-of-truth refactor proper; surfaces here only because it shares
the drift class. Recommended sequencing: do this **after** Phase 2, as
a standalone §12-style criterion, mirroring the Criterion 5 shape.

---

## §6 — Criterion 8 minimum unblock

**The question:** What is the smallest subset of the work above that
must complete before Criterion 8 (legacy `tags` table demotion per §5.2)
can run?

**The answer:** Phase 1 (in full) and Phase 2.1-2.4 must complete first.
Then 2.5 *is* Criterion 8.

Tracing it explicitly:

- Criterion 8 = §5.2 schema operation = "DROP `tags.category`,
  `tags.is_proposed`, `tags.is_exclusive`, `tags.description`; retain
  `slug`, `usage_count`."
- That DROP is safe only when **no live code reads** those columns.
  Today ~30 call sites do (per §1.4 above and the Criterion 8 audit).
- Repointing those readers requires a canonical replacement.
- The canonical replacement is the `vocabulary` registry table per §5.4
  of v2.1-target, regenerated from `CANONICAL_VOCABULARY.md`.
- Regenerating the `vocabulary` table from canon is **§3.3 build step
  A** — Phase 1 (specifically commit 1.3).
- Repointing the readers is **Phase 2 commits 2.1-2.4**.

Therefore the **minimum subset** is Phase 1 (specifically the build
step that re-seeds the `vocabulary` registry from canon — commit 1.3 —
plus enough of 1.1 to give the build step an artifact to work from) and
Phase 2 commits 2.1 through 2.4 inclusive.

Two surfaces explicitly *not* required:

- **Phase 0** items (status enum, badging-path doc rewording, exhibits
  bootstrap) are not on the Criterion 8 critical path. They are good
  parallel work that does not block §5.2.
- **Phase 1 commit 1.2** (`hr_dimensions.js` repointed) is not strictly
  required for Criterion 8 — that change is museum-side, and Criterion
  8 is MV-side schema. They are siblings, both downstream of Phase 1
  commit 1.1, but 1.2 does not block 2.x. The brief recommends running
  them in parallel because they share the same canonical generator
  (§3.3 step B), not because Criterion 8 depends on the museum read
  path.

Once Phase 2.5 lands, §12 of v2.1-target reads **8 of 8 complete**.

---

## §7 — Verification

Read-only verification pass: every `file:line` cited above was
re-opened during this session and the quoted text confirmed against the
live file. The cross-check covered:

- `core/imgserver_extensions.py:107` (`MEDIA_TYPE`), `:113`
  (`STATUS_ENUM`), `:287` (`validated("status", ...)`), `:321-322`
  (`media_type` validator), `:373-377` (novel-slug INSERT).
- `core/imgserver.py:389` (tag-list `SELECT *`), `:732-736` (autocomplete
  vocab pull), `:1191-1438` (Vocab Admin handlers spot-checked at
  `:1207-1257`, `:1260-1359`, `:1369-1373`, `:1376-1439`), `:382`
  (`is_proposed=1` filter), `:1250` and `:1305` (registry-era INSERTs).
- `core/ingest_engine.py:115-118` (`upsert_tag` INSERT).
- `core/artifact_tags.py:89-183` (single coordinated writer;
  `:172-181` usage-count cache).
- `core/migrate_to_v04.py:267` (live `CHECK(status IN ...)`), `:288-296`
  (live `tags` table DDL).
- `SPEC.md:208`, `:268`, `:282`, `:302-310`, `:463`, `:594`.
- `PROJECT.md:29`, `STATE.md:87-88`.
- `docs/CANONICAL_VOCABULARY.md:13-36`, `:68-86`.
- `src/routes/hr/hr_dimensions.js:45-48`, `:50-52`, `:63-70`, `:88-137`.
- `src/routes/hr/HrExhibitFlow.jsx:780-877` (card dispatch).
- `tools/export-artifacts.mjs:46-57`, `:264-266`, `:294-298`,
  `:324-353`.
- `tools/build-deep-tags-vocabulary.mjs:1-103`.
- `docs/deep-dive-vocabulary.csv` (8 lines, 6 data rows).
- `DATA_ARCHITECTURE_SPEC_v2.1-target.md` §0.5, §1, §3.4, §4.5, §5.2,
  §5.4, §6.1, §7.3, §8.3, §12 — read in full.
- `DECISION_BRIEF_target_data_architecture.md` Parked-items
  ("Added 2026-05-19") — read in full.
- `docs/CRITERION5_RUN_REPORT-20260519-151700.md`,
  `docs/CRITERION6_RUN_REPORT-20260519-154523.md`,
  `docs/CRITERION7_RUN_REPORT-20260519-195552.md`,
  `docs/CRITERION8_DEFERRAL_NOTE-20260519-211529.md` — read in full.

**Files written by this session:** exactly one — this brief, at
`docs/SOURCE_OF_TRUTH_REFACTOR_SCOPING_BRIEF-20260519-220000.md`. No
edit to any other file, no schema change, no data change.

---

## §8 — Open questions for the operator

Three questions that this brief did not decide because they are operator
calls, not Ops calls. Listing them here so they are visible before the
refactor starts and not surprised in the middle of Phase 2.3.

1. **Exhibit-badging path resolution.** §4.2 names the recommended
   resolution (widen the spec wording — Criterion 6 OPEN ITEM path
   (a)). The alternative (path (b)) is to disallow scripted badging
   and route everything through the MV Inbox UI in future. Path (a)
   ratifies what shipped in Criterion 6; path (b) marks it as
   unblessed and demands the Inbox UI thereafter. Path (a) is
   recommended; this brief assumes it.

2. **`is_proposed` UI workflow.** `STATE.md:87` says it is conceptually
   retired; `imgserver.py:1362-1373` still implements `tag-accept`.
   §4.4.C above assumes the UI workflow is also retired during Phase
   2.3. If the operator wants to keep the proposed-tag workflow alive
   in the UI for some other reason, the demoted schema needs a place
   for it — either a flag on the cache row or a separate small table.

3. **Tier 3 retired-namespace handling.** Per Criterion 7's
   observations, the museum currently surfaces Tier 3 namespaces
   present in the data regardless of `retired_at`. Once
   `hr_dimensions.js` reads the registry (commit 1.2), retired
   namespaces can be filtered out. This is a small UX change worth
   confirming explicitly before Phase 1.2 ships.

---

*End of original scoping brief. See §9 below for corrections issued
after the brief's first read.*

---

## §9 — Corrections (issued 2026-05-19, post-first-read)

The original brief above was written without reading
`docs/CRITERION4_RUN_REPORT-20260519-010641.md`. That run report
records work already completed that the brief mistakenly named as
future Phase 1 work. Verified by direct query of MV's
`mediavault.sqlite` `vocabulary` table on 2026-05-19. The corrections:

### 9.1 The MV-side `vocabulary` regeneration is DONE

`tools/build-vocabulary-registry.py` already exists, was run during
Criterion 4 (2026-05-19, 01:06:41 UTC), and writes the §5.4
namespace-only schema (`namespace` PK, `display_name`, `tier`,
`sort_order`, `retired_at`). The 92 abandoned seed rows referenced in
§1.3 (b) are gone — `DROP TABLE` happened in Criterion 4. Live state
verified by direct DB query: 14 rows, T1 (5) + T2 (2) visible, T3 (6)
+ `exhibit` (1) carry `retired_at='2026-05-19T01:06:41.000Z'`.

Companion verifier `tools/check-vocabulary-registry.py` is also
in-place and re-runnable.

**Consequence for Phase 1 sequencing.** Original commit 1.3 ("Add the
MV-side `vocabulary` regeneration step") is **a no-op — already
done.** The brief's Phase 1 collapses to three commits:

1.1 New museum-side step that emits `src/data/vocabulary.json` from
the MV `vocabulary` table.
1.2 Repoint `hr_dimensions.js` at the new committed JSON.
1.3 ~~(was: MV-side regeneration)~~ — **DELETED. Done by Criterion 4.**
1.4 Retire the orphan `build-deep-tags-vocabulary.mjs` prebuild + the
legacy CSV + the unread `src/data/deep-dive-vocabulary.json`.
*(renumbered from 1.4)*

### 9.2 The Phase 1.1 build-step shape changes — operator-run, not prebuild

The original brief §3.3 recommended path B1 (museum prebuild reads
`CANONICAL_VOCABULARY.md` directly). That recommendation is **wrong**
on closer look: the canon doc cannot enumerate Tier 3 namespaces with
retirement state, because Tier 3 is dynamic-from-data by canon's own
rule. The MV `vocabulary` table is the only artifact that carries the
*complete* registry (T1+T2 from canon + dynamic T3 from live tags +
retirement flags). So the committed museum JSON has to derive from
the MV table, not from canon directly.

The MV table can only be read by something that contacts MV. §0.5
forbids the prebuild from contacting MV. Therefore the JSON-emitting
step is **operator-run**, not prebuild.

Natural shape: **extend `tools/export-artifacts.mjs`** to emit
`src/data/vocabulary.json` alongside the per-exhibit JSON. One
operator command (`npm run export-artifacts`), two outputs, both
committed, both consumed by the build-time static import (§8.1).

### 9.3 §8 OPEN QUESTIONS — all three resolved, no operator input needed

- **Q1 (badging path):** Decided as Ops — Path (a), widen
  `DATA_ARCHITECTURE_SPEC_v2.1-target.md` §4.5 / §12.6 wording to
  "any §4.5 single-writer path." Ratifies Criterion 6.
- **Q2 (`is_proposed` UI workflow):** Decided as Ops — the UI already
  retired the ACCEPT/REJECT buttons in v0.6 (verified at
  `mediavault.html:2117-2118`: "Status column + ACCEPT/REJECT
  removed. Tags are tags."). The `tagAccept()` JS function at
  `:2178-2181` is defined but never called from any DOM trigger.
  Dead JS + dead Python `handle_tag_accept` at
  `imgserver.py:1362-1373` are removed as part of Phase 2.3
  (Vocab Admin handler rewrite). Nothing UX-facing changes.
- **Q3 (Tier 3 retired-namespace filtering):** Already decided by
  Criterion 4 — "DEEP DIVE launches empty. All six Tier 3 namespaces
  are marked `retired_at`, consistent with NAVIGATION.md ('DEEP DIVE
  tab will launch empty and be populated later by deliberate operator
  curation'). Operator promotes a namespace to visible by clearing
  `retired_at` during curation." (`CRITERION4_RUN_REPORT:45-48`.)
  Phase 1.2 (`hr_dimensions.js` reads the committed JSON) honors
  `retired_at`: rows where `retired_at IS NOT NULL` are dropped from
  the rendered pill columns. No new decision; this follows the
  Criterion 4 intent.

### 9.4 What still stands in the original brief

The corrections above touch Phase 1 and §8. The rest of the brief —
§1 inventory (except 1.3 (b) which is historical now), §2 canonical
sources, §4 retirement plan, §5 Phase 0 + Phase 2 sequencing, §6
Criterion 8 unblock — is unaffected. The Criterion 8 critical path
is still Phase 1 (now smaller, two commits + a delete) + Phase 2.1
through 2.4, with 2.5 being Criterion 8 itself.

### 9.5 Process note

The error was traceable to a specific gap: the brief was written
without reading `CRITERION4_RUN_REPORT-20260519-010641.md`. I read
the C5, C6, C7, and C8-deferral reports but not C4. Going forward
for portfolio-wide scoping: read every Criterion run report in the
series before drafting, not just the ones the trigger names.

---

*End of corrections. Phase 0 and the corrected Phase 1 are ready to
ship when the operator authorizes BUILD work to begin.*
