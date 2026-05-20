# TARGET-STATE DATA ARCHITECTURE SPEC — Weird.Baby Museum

**Version:** 2.1-target
**Date:** 2026-05-17
**Type:** Target-state data architecture / structure specification. Design document.
**Status:** Architecture decisions locked (§0.3). Passed adversarial review;
all 15 findings dispositioned in Appendix A. Not yet built.
**Supersedes:** v2.0-target (2026-05-17), which failed adversarial review.
**Audience:** Machine. The session(s) that will BUILD the pipeline.

---

## §0 — What this document is

### 0.1 Purpose and standing

This is the **target** data architecture for the Weird.Baby Museum portfolio:
the artifact data model, ingest contract, storage schema, export, and
consumption shape the system *will have* after the BUILD phase.

It is distinct from `DATA_ARCHITECTURE_SPEC_v1.1.md` (the verified *as-built*
system). v1.1 is "before"; this is "after." Differences between them are the
work BUILD will perform (§10).

### 0.2 Scope and sequence

Per the milestone plan: **design now (this document), BUILD the pipeline later,
GUI last.** This document is the design — data contracts, not build
instructions.

In scope: artifact data model; tag model; vocabulary registry; multi-platform
ingest contract; MV storage schema; MV→Museum export; exhibit-JSON shape;
museum consumption; lifecycle model.

Deferred / out of scope (named follow-ons, §11): asset *delivery* mechanism;
an MV read API; the GUI; identifying the current tag-overwrite bug's culprit.

Gating pre-BUILD task (§5.5): the **slug→namespace mapping** does not exist and
must be authored by the operator before BUILD can migrate data. This is a
content task, not a code task. It is the single most important precondition
this spec surfaces.

### 0.3 The seven locked decisions this spec implements

Decided by the operator 2026-05-17 via `DECISION_BRIEF_target_data_architecture.md`.

| # | Decision | Choice | Implemented in |
|---|---|---|---|
| 1 | Tag model | Namespaced strings (`namespace:value`) | §3 |
| 2 | Ingest scope | Formal multi-platform | §4 |
| 3 | Vocabulary table | Keep, as a registry | §3.4, §5.4 |
| 4 | MV→Museum interface | Whole-DB blob export (API = named upgrade) | §7, §11 |
| 5 | Exhibit membership | An `exhibit:` tag | §3.3 |
| 6 | Asset delivery | Deferred (R2 named as direction) | §6, §11 |
| 7 | Lifecycle model | Live four-state (`inbox/vault/released/archived`) | §5.3 |

**One decision beyond the seven** was raised by this spec and put to the
operator: the disposition of MV's legacy `tags` table (§5.2). The operator
decided the `vocabulary` table's fate (Decision 3) but was not originally asked
about the separate `tags` table. **Signed off 2026-05-17: demote** — the table
is kept, stripped to a per-value usage-count cache. §5.2 records this.

### 0.4 The shape of the target, honestly

A multi-platform artifact vault (MediaVault) is the single source of truth.
Every artifact, regardless of platform, conforms to one shape and carries
namespaced string tags. A vocabulary registry table describes the tag
namespaces. Exhibit membership is itself a tag. The Museum obtains data by a
deliberate operator-triggered export that writes per-exhibit JSON, which the
static site build consumes. The lifecycle is four states.

**This is mostly evolution, with two real schema changes.** It keeps: the
four-state lifecycle, the export mechanism, the registration contract, the
capture script's tag *format*, build/MV isolation. It **changes the schema in
two places**: the `vocabulary` table is structurally **replaced** (§5.4), and
the legacy `tags` table is **demoted** to a usage-count cache (§5.2, operator
signed off 2026-05-17). The `artifacts` table is structurally unchanged
(one CHECK added to `media_type`, §6.1). v2.0 of this spec wrongly called the
whole thing "no schema change / evolution, not demolition" — corrected here
(Appendix A, C1).

### 0.5 Glossary — component terms used precisely in this document

To prevent the loose use of "build" that v2.0 was faulted for (Appendix A, G2):

- **MV** — MediaVault: the SQLite database + loopback HTTP server. Source of
  truth.
- **adapter** — a per-platform ingest component (§4.2). Produces artifacts.
- **register endpoint** — MV's `POST /api/artifact-register`. The one entry
  point for new artifacts.
- **curation** — operator editing of artifacts (tags, status). Today: the
  existing **MV Inbox UI**. Later: the GUI (§11). Both are tag writers (§4.5).
- **export** — `export-artifacts.mjs`. Operator-run, manual, **contacts MV**.
  Produces per-exhibit JSON.
- **prebuild hook** — `build-deep-tags-vocabulary.mjs`, runs automatically
  before the site build. **Never contacts MV.**
- **site build** — `vite build`. Bundles the static site. **Never contacts
  MV.**
- **BUILD phase** — the future milestone that implements this spec.

When this document says "the build never contacts MV" (§1 principle 5) it means
the *site build* and the *prebuild hook*. The *export* does contact MV and is
not part of either.

---

## §1 — Architectural principles

1. **Artifacts are self-describing.** A tag carries its own structure
   (Decision 1). `mood:snarky` means "mood, snarky" with no other table
   present. The registry adds display polish; it is never required to
   *understand* a tag.
2. **One artifact shape, all platforms.** Platform-specific logic lives only in
   the per-platform adapter (§4.2), never downstream.
3. **One coordinated writer for `tags`.** Exactly one *coordinated mechanism*
   may write an artifact's `tags`. The current system's tag-overwrite bug
   (v1.1 §8.4) is a violation of this. Enforcement is specified, not merely
   asserted — §4.5.
4. **MV is the single source of truth.** All artifact state lives in MV; the
   Museum holds only a derived export.
5. **The site build and prebuild hook never contact MV** (§0.5). Only the
   operator-run export does. The site build consumes committed JSON.
6. **Soft delete only.** `archived` is recoverable. No status change destroys
   data.

---

## §2 — The artifact: conceptual model

An **artifact** is one curated unit — a YouTube video page, a thumbnail, a
ReverbNation track, a Facebook post, a transcript, a local file. Every
artifact, whatever its platform, has: identity (a minted ID); provenance
(platform, source URL, capture/ingest dates); content (short + long
description, optional extracted text, optional asset pointers); structure (an
optional parent artifact); tags (§3); lifecycle (§5.3).

Artifacts form shallow trees: a parent with zero or more children. Exhibit
membership and all descriptive labelling are expressed through tags — there is
no separate membership mechanism (Decision 5).

---

## §3 — The tag model *(Decision 1; Decision 3; Decision 5)*

### 3.1 Tag form

A tag is a string `namespace:value`:

- `namespace` — slug, charset `[a-z0-9_]+` (no hyphen).
- `value` — slug, charset `[a-z0-9_-]+` (hyphen allowed).
- Separator is the first `:`.
- **A value MUST NOT contain `:`.** v2.0 gestured at an escaping mechanism and
  never defined one (Appendix A, G7). There is no escaping. All values are
  slugs; a colon in a value is invalid input. The first-colon split is
  defense-in-depth, not support for colons-in-values.

Note the deliberate asymmetry: namespaces forbid hyphens, values allow them.
A hyphenated live slug (e.g. `music-video`) can therefore be a *value* but
never a *namespace* — the migration mapping (§5.5) must respect this
(Appendix A, E3).

An artifact's `tags` is a JSON array of such strings:
```jsonc
["platform:youtube", "content_kind:official", "year:2023",
 "album:arkansas", "mood:snarky", "exhibit:hunter_root"]
```

### 3.2 Tag validity and its enforcement

A tag string with no `:`, an empty namespace, or an empty value is **invalid**.

**Enforcement is assigned, not merely hoped for** (Appendix A, B2). In the
target:
- The **register endpoint validates** every incoming tag against the §3.1
  form and **rejects** the registration call if any tag is malformed. This is
  a BUILD-phase change to the endpoint — see §4.4.
- **Curation** writers (MV Inbox, later the GUI) likewise reject malformed
  tags.
- Consumers (the export, the museum) still drop malformed tags defensively, as
  a backstop — but they are the backstop, not the guarantee.

Because enforcement lives at the two writers, the §12.1 criterion ("no bare
slugs remain") is a property the system *maintains*, not merely a one-time
post-migration scan.

Tags are a *set*; deduplication is the responsibility of the single
coordinated `tags` writer (§4.5). The export's regroup (§8.2) also
deduplicates, as defense-in-depth, not as the authority.

### 3.3 The `exhibit:` namespace — membership *(Decision 5)*

Exhibit membership is a tag in the `exhibit:` namespace (`exhibit:hunter_root`).
An artifact may carry several. `exhibit:` is an ordinary tag for storage,
ingest, validation, and query. It is special only in *consumption*: the museum
strips `exhibit:` tags before deriving visitor pill columns (§8.3), because
membership is routing, not a filterable trait.

### 3.4 The vocabulary registry *(Decision 3)*

A `vocabulary` table in MV is the **registry of tag namespaces**. It does not
own tags; it describes the namespaces. Each row, for one namespace: tier,
display name, sort order, retirement flag. Schema in §5.4.

The registry is **descriptive, never gating** (§1 principle 1): a tag in an
unregistered namespace is still valid and self-describing — it simply renders
with its raw slug as display name and falls to the default tier (Tier 3).

The registry is the machine-readable expression of `CANONICAL_VOCABULARY.md`.
Their relationship is fixed by Decision G1 (Appendix A): the registry is
**generated from** `CANONICAL_VOCABULARY.md` by a named build step; the canon
doc is the single source of truth and the table is a build artifact, never
hand-edited. §5.4 and §12.4 specify this.

**Important scope limit — the registry is namespace-level only.** It records
which *namespaces* exist and their tier. It does **not** map *values* to
namespaces (it has no value-level rows). The value→namespace knowledge needed
to migrate the existing bare-slug data is a *separate artifact* that does not
exist yet — see §5.5.

### 3.5 Reserved namespaces

| Namespace | Meaning | Consumed by |
|---|---|---|
| `exhibit` | exhibit membership (§3.3) | export discovery, museum routing |
| `platform` | source platform | informational; mirrors `source_platform` |
| `content_kind` | media variant (`official/live/lyrics/cover`) | museum variant taxonomy |
| `artifact_kind` | child asset type (`thumbnail/transcript/page_save`) | museum render |
| `scope` | owning project | cross-project grouping |
| `author` | artist slug | museum |
| `unsorted` | migration fallback for un-classifiable slugs (§5.5) | flagged for later curation |

All other namespaces (`year`, `album`, `mood`, `venue`, …) are descriptive and
flow to the museum tier system per `CANONICAL_VOCABULARY.md`.

---

## §4 — Ingest: the multi-platform contract *(Decision 2)*

### 4.1 The model

One ingest contract; each source platform is served by a **platform adapter**
producing artifacts conforming to it. Adapters differ; everything downstream
does not.

```
YouTube adapter  ─┐
ReverbNation adptr─┤
Facebook adapter ─┼──> [common artifact shape §2/§3] ──> register endpoint ──> MV
local-file adptr ─┤
(future) adapter ─┘
```

### 4.2 The adapter contract

A platform adapter MUST: acquire source material for one logical unit; produce
one or more artifacts in the §2 shape with correct `source_platform`, a
`platform:` tag, namespaced tags only (§3.1), correct parent/child structure,
and `scope:`/`author:` tags; register each artifact via §4.4, parent first;
be idempotent on re-run (an already-registered unit is detected and skipped).

A platform adapter MUST NOT: emit bare-slug tags; write to MV by any path other
than the register endpoint; assume it is the only adapter.

### 4.3 Per-platform adapter status *(this subsection is status, not contract — Appendix A, A3)*

| Platform | Adapter | Status |
|---|---|---|
| YouTube | `yt-ingest.mjs` + `yt_archive_capture.py` | EXISTS; must be brought to §4.2 conformance and reconciled to §4.5 |
| ReverbNation | `rn_archive/v1` path | EXISTS in some form; must be formalised as a §4.2 adapter |
| Facebook | capture path exists | must be formalised as a §4.2 adapter |
| local files | drop-zone path exists | must be formalised as a §4.2 adapter |
| future | new adapter | a new platform is a new adapter; the contract is unchanged |

The contract is §4.2. This table is an inventory of BUILD work, not a spec.

### 4.4 The registration contract

Artifacts enter MV through the register endpoint (`POST /api/artifact-register`).
Properties the target requires:

- One artifact per call; parent before children. The call mints the ID
  (§4.6) and returns it; the adapter threads the parent's ID into each child's
  `parent_artifact_id`.
- **The endpoint validates tags against the §3.1 form and rejects malformed
  ones.** This is a **BUILD-phase change**. The current endpoint does not do
  this — verified 2026-05-17: it treats the whole tag string as an opaque slug
  and auto-inserts novel slugs into the `tags` table without parsing the
  namespace. (v2.0 wrongly claimed the endpoint "already preserves colons,
  per v1.1 §8.4" — v1.1 §8.4 actually lists endpoint behavior as *unverified*;
  Appendix A, C2.)
- **Colon handling — verified.** The current endpoint stores the artifact's
  `tags` array as given; it does not strip colons from the array. It does,
  however, copy each tag string verbatim into the `tags` registry table as an
  opaque slug. The BUILD change makes the endpoint namespace-aware:
  validate `namespace:value` form, reject malformed, and (if the legacy `tags`
  table is retained per §5.2) record the namespace correctly.
- `url_only` artifacts pass no local asset path.

### 4.5 The single coordinated writer for `tags` *(Appendix A, F1 + F2)*

The current system's defining bug (v1.1 §8.4): tags were registered correctly
and *something else* later overwrote them. The target forbids this — and, per
the review, does so with an **enforcement mechanism**, not a restated wish.

**Legitimate `tags` writers in the BUILD-phase target — the complete list:**
1. The **register endpoint**, at artifact creation.
2. **Curation** — today the **existing MV Inbox UI**; later the GUI (§11).

That is two code paths touching one column. "One coordinated writer" means they
are reconciled: both go through a **single shared tag-write routine** in MV
(the BUILD phase factors one out), which validates (§3.2) and deduplicates.
No third path may write `tags`.

**Enforcement — §4.5.1.** Prose forbidding a second writer is what failed
before. The target requires, at minimum, all three of:
- (a) **Structural:** only the register endpoint and the shared curation
  routine contain SQL that UPDATEs or writes `artifacts.tags`. This is a
  reviewable, greppable property.
- (b) **Verification:** a BUILD check (and a §12 criterion) greps the MV
  codebase for any `UPDATE artifacts ... tags` or equivalent outside those two
  paths, and fails if one exists.
- (c) **Provenance:** the BUILD phase adds nothing to the `artifacts` schema
  for this (§5.1 holds), but the export and any sync job are explicitly
  forbidden from writing `tags` and this is stated in their headers.

**`exhibit:` badging before the GUI exists.** §12.6 requires released
artifacts to carry `exhibit:` tags, but the GUI is deferred (§11). Resolution:
badging may be done through **any §4.5 single-writer path** — today that
includes the existing MV Inbox curation UI (writer #2 above) and any
scripted caller that routes through `write_artifact_tags`
(`core/artifact_tags.py`). Both inherit the §4.5 single-writer guarantee.
The GUI is not required for badging; the Inbox suffices for the BUILD
phase, and scripted badging via `write_artifact_tags` is equally
legitimate when a bulk operation is more practical than per-row UI work
(reframed 2026-05-19 — Criterion 6 ran scripted badging via
`/api/artifact-update`, which routes through `write_artifact_tags` and
preserves §4.5.1(b); this paragraph ratifies that method).

**Finding the current overwriter** is BUILD archaeology (§11 item 3) — but
removing it is a §12 criterion (§12.3), so it is BUILD-required work, not a
"someday" item.

### 4.6 ID format

MV mints `MV-YYYYMMDD-NNN` (date + daily sequence). Legacy
`MV-XX-YYYYMMDD-NNN` rows exist from a past migration. Any ID parser MUST
accept both; the authoritative regex is `^MV-(?:[A-Z]{2}-)?\d{8}-\d+$` (this is
v1.1 §3.1's regex with capture groups removed — same contract; Appendix A, G6).

---

## §5 — Storage: MediaVault schema (target)

MV remains a local SQLite database, loopback-only. Target schema = current
schema (v1.1 §4) with the **two structural changes** named in §0.4, stated
per-table below.

### 5.1 `artifacts` table — NO structural change

The `artifacts` table is structurally **unchanged** from current (v1.1 §4.2
DDL): no column add, drop, or rename. The current columns suffice.

The changes that touch `artifacts` are **data and discipline**, not schema:
- **Data:** every artifact's `tags` is migrated from bare slugs to namespaced
  form (§5.5).
- **Discipline:** the single-coordinated-writer rule and its enforcement
  (§4.5) apply.

`tags` remains a JSON array of strings, `NOT NULL DEFAULT '[]'`; the strings
become namespaced.

**Scope of the "no schema change" claim:** it applies to `artifacts` *only*.
The `vocabulary` table IS structurally changed (§5.4) and the legacy `tags`
table is dropped or demoted (§5.2). v2.0 let "no schema change" stand as if it
covered the whole database — corrected here (Appendix A, C1).

### 5.2 Legacy `tags` table — DEMOTE TO A USAGE-COUNT CACHE *(operator signed off 2026-05-17)*

The current `tags` table (v1.1 §4.3 — 69 rows, keyed `(slug, category)`) was a
tag registry. In the target the **`vocabulary` table is the namespace registry**
(§5.4), which makes the legacy `tags` table redundant as a registry.

**This was a decision beyond the seven** (Appendix A, A2). The operator decided
the `vocabulary` table's fate (Decision 3); the `tags` table is a *different*
object and was put to the operator separately.

**Decision (operator, 2026-05-17): demote.** The `tags` table is **kept**, but
stripped to a single job — a **per-value usage-count cache**: each row records
a tag value (or `namespace:value`) and how many artifacts currently use it, so
the museum or curation UI can show frequency / sort-by-popularity without
scanning all of `artifacts.tags`. It is **not** a registry and **not**
authoritative for anything — the authoritative namespace registry is
`vocabulary` (§5.4), and `artifacts.tags` remains the authority for which tags
an artifact has.

BUILD-phase consequences: the table's registry-era columns (`category`,
`is_proposed`, `is_exclusive`, `description`) are dropped or ignored; the cache
is recomputable at any time from `artifacts.tags` and must be refreshed whenever
tags change. The cache is **not** a `tags` writer in the §4.5 sense — it is
derived, read-only-derived data, and nothing reads *artifact* tags from it.

### 5.3 Lifecycle / status *(Decision 7)*

Four states, exactly as current live code:

| Status | Meaning |
|---|---|
| `inbox` | newly captured, not yet reviewed |
| `vault` | reviewed, curated, retained — not public |
| `released` | approved for the public museum |
| `archived` | soft-deleted — removed from view, recoverable |

`status` is `NOT NULL`, CHECK-constrained to these four (matches current).
`archived` is a soft delete (§1 principle 6) — recoverable to `vault`. There is
**no `deleted` status**; MV's own `SPEC.md` still proposes one and is the
out-of-sync document — BUILD corrects MV's `SPEC.md` (a doc fix). Soft-delete
is also marked by `archived_at`. The museum consumes only
`status='released' AND archived_at IS NULL` (§7.3).

### 5.4 `vocabulary` table — the namespace registry — STRUCTURALLY REPLACED

The `vocabulary` table is **structurally replaced** (Appendix A, C1): the live
table (v1.1 §4.5) has `id`/`kind`/`slug`/`namespace_id`/`created_at`/
`updated_at` and three indexes; a row could be a namespace, a value, or a tab.
The target table is namespace-only. This is a `DROP` + `CREATE` + re-seed, not
a re-scope. Naming it honestly: **schema change.**

Target schema — one row per tag namespace:

| Column | Meaning |
|---|---|
| `namespace` | namespace slug — primary key |
| `display_name` | human label for the pill group |
| `tier` | museum tier (1, 2, 3) — §8.3 |
| `sort_order` | ordering within the tier |
| `retired_at` | nullable; if set, retired from new tagging |

The registry is **descriptive only** (§3.4) — never gates tag correctness.

**Generated, not hand-maintained** (Appendix A, G1): the registry is
regenerated from `CANONICAL_VOCABULARY.md` by a named build step. The canon doc
is the single source of truth; the table is a build artifact. §12.4 makes "the
registry matches canon, and every namespace used in live tags has a row" a
verifiable criterion.

The 92 rows currently in the live table are abandoned seed data; BUILD discards
them and regenerates from canon.

### 5.5 The tag migration and the slug→namespace map — **GATING PRE-BUILD TASK**

Decision 1 is namespaced tags; the ~69 distinct slugs on the 85 current
artifacts are **bare**. BUILD must migrate every bare slug to `namespace:value`.

**The blocker, stated plainly (Appendix A, E1).** The migration needs a
**value→namespace map** — the fact that `snarky` is a `mood`, `2023` is a
`year`, `reverend` is a `song`. Verified 2026-05-17: **this map does not exist
anywhere.**
- `CANONICAL_VOCABULARY.md` defines namespace→*tier* (which column a namespace
  renders in). It does **not** map values to namespaces. It assumes tags
  arrive already namespaced.
- `docs/deep-dive-vocabulary.csv` is a slug→group map but has only **6 rows**
  (`snarky, wistful, oops, lemonade, pink-hats, acoustic`), is marked legacy,
  and covers under 10% of the live slugs.
- The target `vocabulary` registry (§5.4) is namespace-level and structurally
  cannot hold a value→namespace map.

**Therefore: authoring the complete slug→namespace map is a gating task that
must happen before BUILD can migrate data.** It is a *content* task requiring
the operator's taxonomy knowledge (is `reverend` a `song`? is `hunter_root`
`scope` or `author`? is `defiant` a `mood` or a `topic`?). It is not code and
this spec cannot write it.

**Required shape of the map:** a simple, version-controlled table — every
distinct slug currently in live `artifacts.tags`, paired with its target
namespace. It lives in the repo (recommended: `docs/SLUG_NAMESPACE_MAP.md` or
`.csv`). It MUST cover every live slug.

**Terminal fallback (Appendix A, E2).** A slug the operator genuinely cannot or
will not classify maps to the reserved `unsorted:` namespace (§3.5):
`defiant` → `unsorted:defiant`. This keeps every tag *syntactically* namespaced
so §12.1 is mechanically achievable, while flagging the value in the migration
run report for later curation. §12.1 is therefore: "no bare slugs remain;
residual unclassified values carry `unsorted:` and are listed in the report."

**§12 entry criterion:** the slug→namespace map exists and covers 100% of live
slugs *before* the BUILD migration step runs (§12, criterion 0).

### 5.6 Other tables

`ingest_queue`, `id_sequence`, `sqlite_sequence` — retained as-is from current
(v1.1 §4.4). Unaffected by these decisions.

---

## §6 — Assets *(Decision 6: delivery deferred)*

An artifact may have asset bytes — a thumbnail, photo, audio file, HTML
snapshot. This spec defines asset **metadata** and explicitly defers the asset
**delivery mechanism** (§11).

### 6.1 Asset metadata (in scope)

The `artifacts` schema carries the fields to *locate* an asset: `storage_mode`
(`vaulted` / `referenced` / `url_only`), `local_asset_path`, `thumbnail_path`.
These exist today and are retained.

**`media_type` (Appendix A, G3 + G4).** The museum's render dispatches on
`media_type` (§8.4). The live column is free TEXT with seven distinct values
(`link, mixed, photo, text, text-only, video, NULL`), including a likely
duplicate pair (`text` / `text-only`). The target:
- BUILD normalizes the column: `text-only` → `text`; NULL → an explicit value
  (recommended `unknown`).
- BUILD adds a CHECK constraint fixing the target set:
  `link, mixed, photo, text, video, unknown`.
- §8.4 defines the render fallback for every value including `unknown`.
- The unresolved `youtube_page_save` case (v1.1 §8 S9: `storage_mode: vaulted`
  but documented `media_type: link`) is resolved here: a stored HTML snapshot
  is `media_type: text` (it is a stored text/markup file, not a URL pointer).
  BUILD applies this to any such artifact.

This is a small schema change to `artifacts` (a CHECK on `media_type`). §5.1's
"no structural change to `artifacts`" stands for columns; this adds a
constraint, not a column. Noted for honesty.

### 6.2 Asset delivery (deferred — NOT defined here)

*How* asset bytes reach a visitor's browser is **not decided** (Decision 6C).
Recommended direction: a dedicated object store (Cloudflare R2), per the
project's `VISION_LOCK`. The mechanism is a separate milestone (§11).

**Plain-language consequence — for operator confirmation (Appendix A, D2).**
With asset delivery deferred, the first end-to-end run of the pipeline produces
a museum in which **no photo, thumbnail, or audio plays — every asset-bearing
artifact renders as a placeholder tile.** Of the 19 currently-released
artifacts, 18 are non-`link` and would render as placeholders; the one YouTube
`link` row may show a poster via §8.2's URL synthesis. A "BUILD-complete"
museum is therefore mostly gray tiles with correct text and filters. **If that
is not an acceptable definition of BUILD-done, asset delivery is not
deferrable** and Decision 6 must be revisited. The operator chose 6C; this
paragraph states what 6C visibly means so the choice is informed.

---

## §7 — Export: MV → Museum *(Decision 4)*

### 7.1 The mechanism

The Museum gets data by a deliberate, operator-triggered export
(`npm run export-artifacts`): pull MV's whole database via `GET /db`, query it
read-only, write per-exhibit JSON into the museum repo. Never automatic, never
part of the site build (§1 principle 5). Retained from current (v1.1 §5).

### 7.2 Why the blob, and the upgrade trigger *(Appendix A, A1)*

The whole-DB blob ships the entire vault to extract one exhibit's released
rows. Decision 4 keeps it for now. The Decision Brief required a **concrete
trigger** for the eventual upgrade to an MV read API; v2.0 gave only "grows
large" — a non-trigger. Corrected:

**The upgrade to an MV read API (§11 item 2) is triggered when either:**
- the MV database file exceeds **25 MB**, or
- a **second consumer** of MV data exists (any program besides
  `export-artifacts.mjs` that reads MV).

Whichever comes first. Until a trigger fires, the whole-DB blob stands. (If the
operator wants different thresholds, that is a one-line edit here; the point is
the trigger is now testable, not a vibe.)

### 7.3 What the export selects

Artifacts that are `status='released'`, `archived_at IS NULL`, top-level
(`parent_artifact_id IS NULL`), and carrying an `exhibit:<name>` tag (§3.3).
Exhibits are discovered dynamically from distinct `exhibit:` values across
released artifacts, unioned with a known-exhibits bootstrap list.

**The bootstrap list (Appendix A, G5):** currently a hardcoded array
`["hunter_root"]` inside `export-artifacts.mjs`. For a multi-exhibit portfolio
this should move to a named config file. BUILD relocates it to
`src/data/exhibits.config.json` (or equivalent); extending that file is the
documented way to introduce a new exhibit route.

### 7.4 Export failure behavior

Fail loud, never ship stale: if MV is unreachable or errors, the export aborts
non-zero and writes nothing. Export is decoupled from build, so a failed export
just means no new JSON is committed and the build proceeds on the last
committed JSON. Staleness shows in git, never in a half-built bundle. (Retained
from current — v1.1 §5.6.)

---

## §8 — Consumption: the Museum

### 8.1 Build-time static import

The Museum is a static site (Vite + React, Cloudflare Workers). It imports the
per-exhibit JSON at build time. **No runtime fetch of MV; no runtime fetch of
artifact data** (§1 principle 5).

### 8.2 The exhibit-JSON record shape

Each per-exhibit JSON file has a metadata block and an `artifacts` array. Each
record:

```jsonc
{
  "id": "MV-YYYYMMDD-NNN",
  "source_url": "...",
  "source_platform": "youtube",
  "media_type": "link",
  "title": "...",
  "description": "...",
  "post_date": "2023-...",
  "released_at": "2026-...",
  "thumbnail_url": "...",
  "tags": { "year": ["2023"], "album": ["arkansas"], "mood": ["snarky"],
            "platform": ["youtube"], "content_kind": ["official"] }
}
```

The export builds the `tags` object by splitting each namespaced tag on its
first `:` and grouping by namespace. Because Decision 1 guarantees namespaced
tags (enforced per §3.2), the regroup is total — no tag is dropped (contrast
the current system, v1.1 §6.4, where bare slugs are dropped). The `exhibit:`
namespace is stripped before render (§8.3).

**`thumbnail_url` (Appendix A, B1).** This field is populated by two distinct
mechanisms, and the spec is now explicit about both:
- **URL synthesis** — for `source_platform='youtube'` AND `media_type='link'`,
  the export computes `https://i.ytimg.com/vi/<id>/maxresdefault.jpg` by
  parsing `source_url`. This is pure string computation, **independent of the
  deferred asset-delivery mechanism**, and the target **retains** it.
- **Asset-store URL** — for all other asset-bearing artifacts, a real
  `thumbnail_url` requires the deferred asset-delivery mechanism (§6.2) and is
  therefore `null` until that milestone is built.

So `thumbnail_url` is: a synthesized YouTube URL where applicable; otherwise
`null` until §6.2. v2.0's flat "null until asset delivery" comment was wrong
for the YouTube case — corrected.

### 8.3 Pill tiers

The museum renders tag namespaces as filter-pill columns in three tiers, per
`CANONICAL_VOCABULARY.md`: Tier 1 ARTIST (`year, album, song, venue, people`);
Tier 2 MEDIA (`source, type`); Tier 3 DEEP DIVE / "Deep Signals" (every other
namespace, dynamic, ordered by registry `sort_order` then hit count). Tier
assignment comes from the `vocabulary` registry (§5.4). The `exhibit:`
namespace is stripped before tier assignment (§3.3).

### 8.4 Render dispatch

The museum dispatches on the normalized `media_type` (§6.1 — target set
`link, mixed, photo, text, video, unknown`):
- `link` with a `thumbnail_url` → poster tile.
- `link` without → placeholder tile.
- `photo`, `video`, `mixed` → asset tile *once §6.2 is built*; until then,
  placeholder tile.
- `text` → text rendering from `title`/`description`/`extracted_text`.
- `unknown` → placeholder tile; logged for curation.

Text fields always render regardless of `media_type`.

---

## §9 — End-to-end data contract summary

| Boundary | Shape | Set by |
|---|---|---|
| Platform → Adapter | platform-native source material | the platform |
| Adapter → MV | §2/§3 artifact shape, namespaced tags, via register endpoint | §4.2, §4.4 |
| MV storage | `artifacts` + `vocabulary` registry | §5 |
| MV → Export | whole-DB blob via `GET /db` | §7 |
| Export → Museum | per-exhibit JSON, record shape §8.2 | §7.3, §8.2 |
| Museum → Visitor | static bundle; pill tiers from registry | §8.3 |

---

## §10 — How the target differs from the as-built system

| Aspect | As-built (v1.1) | Target (this spec) |
|---|---|---|
| Tag model | three-way confusion | one model: namespaced strings (§3) |
| Tag conformance | 0 of 85 namespaced | all namespaced (migration §5.5) |
| Tag validity | unenforced | enforced at register endpoint + curation (§3.2) |
| Tag writers | ≥2 conflicting (the §8.4 bug) | one coordinated mechanism + enforcement (§4.5) |
| Slug→namespace map | does not exist | gating pre-BUILD task, operator-authored (§5.5) |
| Ingest scope | YouTube documented, others ad hoc | formal multi-platform adapter contract (§4) |
| `vocabulary` table | 92 rows, wired to nothing | structurally replaced; the namespace registry (§5.4) |
| legacy `tags` table | live, 69 rows, a registry | demoted to a usage-count cache (§5.2, signed off) |
| `media_type` | free TEXT, 7 values incl. NULL | normalized + CHECK-constrained (§6.1) |
| Exhibit membership | `exhibit:` tag on 0 artifacts | `exhibit:` tag, badged via MV Inbox (§3.3, §4.5) |
| Lifecycle | live 4-state; SPEC.md says `deleted` | 4-state; SPEC.md corrected (§5.3) |
| Export output | empty | per-exhibit JSON with real records (§7, §8) |
| MV interface | whole-DB blob | whole-DB blob; API upgrade has a concrete trigger (§7.2) |
| Asset delivery | undefined | metadata defined; delivery deferred (§6) |

**Schema changes in the target:** `vocabulary` replaced (§5.4); legacy `tags`
demoted to a usage-count cache (§5.2, signed off 2026-05-17); a CHECK added to
`media_type` (§6.1). `artifacts` columns are otherwise unchanged. This is mostly
evolution — but it is not "no schema change," and this spec no longer claims
that.

---

## §11 — Deferred / parked items

Re-labeled per Appendix A, D3 — two categories, not one flat list.

**Category A — BUILD-phase required work, detailed later (on the §12 path):**
- **A1. The slug→namespace map (§5.5).** Gating. Operator-authored. Must be
  complete before the BUILD migration runs (§12 criterion 0).
- **A2. Find and remove the tag-overwrite culprit (v1.1 §8.4).** Identifying it
  is archaeology; removing it is §12.3.
- **A3. The tag migration (§5.5)** — one-time data job; end-state specified,
  procedure is BUILD detail.

**Category B — later milestones, genuinely out of this spec's scope:**
- **B1. Asset delivery mechanism (Decision 6 / §6.2).** Recommended: R2.
- **B2. MV read API (Decision 4 upgrade / §7.2).** Triggered per §7.2.
- **B3. The GUI / curation UX.** The final milestone in the sequence.

---

## §12 — What "done" looks like for the BUILD phase

**Criterion 0 — entry gate.** The slug→namespace map (§5.5) exists, is in the
repo, and covers 100% of distinct slugs in live `artifacts.tags`. BUILD's
migration step MUST NOT run before this is true.

The BUILD phase has satisfied this spec when:

1. Every artifact in MV carries namespaced tags only; no bare slugs remain.
   Residual unclassifiable values carry `unsorted:` (§5.5) and are listed in
   the migration run report.
2. Each platform's ingest path is a §4.2-conforming adapter; none emits
   bare-slug tags.
3. Exactly one coordinated mechanism writes `artifacts.tags`; the §8.4
   overwriter is removed; the §4.5.1(b) grep-check passes.
4. The `vocabulary` table is regenerated from `CANONICAL_VOCABULARY.md` by a
   named build step, and a check confirms every namespace used in live artifact
   tags has a registry row.
5. MV's `SPEC.md` lifecycle section is corrected to the four-state model
   (§5.3).
6. Released artifacts carry `exhibit:` tags (badged via any §4.5
   single-writer path — see §4.5); `npm run export-artifacts` produces
   per-exhibit JSON containing real records.
7. The museum builds from that JSON and renders each artifact's text and
   metadata with correctly derived pill tiers (§8.3). **Asset-bearing
   artifacts render placeholder tiles pending §6.2 — this placeholder-only
   state is an accepted BUILD-done outcome** (operator confirmed via §6.2; if
   not confirmed, see §6.2's contingency).
8. The legacy `tags` table has been demoted per §5.2 (operator signed off
   2026-05-17): retained as a per-value usage-count cache, registry-era columns
   dropped, refreshed from `artifacts.tags`.

Asset delivery (§6.2 / §11 B1) and the GUI (§11 B3) are explicitly **not**
required for BUILD-done — they are subsequent milestones.

---

## Appendix A — Disposition of the v2.0 adversarial review

All 15 required-change items plus the minor findings, each with verdict and
resolution. Verdicts: ACCEPTED (v2.0 was wrong; fixed); ACCEPTED-REFRAMED
(valid, but the precise fact differs from the review's framing).

| # | Finding | Verdict | Resolution in v2.1 |
|---|---|---|---|
| C1 | "no schema change" false — `vocabulary` replaced, `tags` dropped | **ACCEPTED** | §0.4, §5.1, §5.4, §10 rewritten — claim scoped to `artifacts`; two real schema changes named. |
| E1 | migration end-state exemplified, not specified; no slug→namespace map | **ACCEPTED** | Verified: the map does not exist anywhere. §5.5 makes authoring it a gating pre-BUILD task; §12 criterion 0. |
| D1 | §12 can't complete with assets deferred | **ACCEPTED** | §12.7 rewritten — placeholder-only rendering explicitly stated as an accepted BUILD-done outcome. |
| B1 | `thumbnail_url` contradiction | **ACCEPTED** | §8.2 now distinguishes YouTube URL-synthesis (retained, asset-delivery-independent) from asset-store URLs (null until §6.2). |
| A1 | Decision 4 upgrade trigger is a vibe | **ACCEPTED** | §7.2 — concrete trigger: MV file > 25 MB, or a second consumer exists. |
| C2 | §4.4 misattributes "endpoint preserves colons" to v1.1 §8.4 | **ACCEPTED** | Verified 2026-05-17: endpoint is NOT namespace-aware (treats whole tag as opaque slug, auto-inserts into `tags` table). §4.4 corrected; namespace-aware validation is now stated BUILD scope. |
| A2 | `tags`-table disposition smuggled in as "BUILD detail" | **ACCEPTED** | §5.2 — promoted to an explicit decision, put to the operator, and **signed off 2026-05-17: demote** to a usage-count cache; §0.3 notes it as beyond the seven; §12.8. |
| F1 | single-writer rule asserted, no enforcement | **ACCEPTED** | §4.5.1 added — structural + verification + provenance enforcement; §12.3 grep-check. |
| F2 | writer list undercounts; omits MV Inbox; GUI deferred | **ACCEPTED** | §4.5 enumerates both writers (register endpoint + MV Inbox curation), reconciles them via a shared routine, and resolves `exhibit:` badging via the Inbox pre-GUI. |
| E2 | "no clear namespace" escape hatch breaks §12.1 | **ACCEPTED** | §3.5 + §5.5 — reserved `unsorted:` namespace as terminal fallback; §12.1 reworded to be mechanically achievable. |
| B2 | "all tags namespaced" invariant unenforced | **ACCEPTED** | §3.2 — enforcement assigned to register endpoint + curation; consumers are backstop only. |
| G1 | §12.4 "generated vs validated" undecided | **ACCEPTED** | §3.4, §5.4, §12.4 — decided: registry is *generated from* canon by a named build step. |
| G2 | "the build" used loosely; principle 5 at risk | **ACCEPTED** | §0.5 glossary added; §1 principle 5 reworded to name site-build + prebuild explicitly. |
| G3 | inherits v1.1 S9 `youtube_page_save` media_type defect | **ACCEPTED** | §6.1 — resolved: a stored HTML snapshot is `media_type: text`. |
| G4 | no `media_type` taxonomy; dispatch on free-text field | **ACCEPTED** | §6.1 — target enum + CHECK + normalization; §8.4 defines render fallback for every value incl. `unknown`. |
| D2 | operator never confronts the "gray museum" consequence | **ACCEPTED** | §6.2 — plain-language statement of the visible end state, routed to operator confirmation. |
| D3 | §11 conflates BUILD-required items with later milestones | **ACCEPTED** | §11 split into Category A (BUILD-required) and Category B (later milestones). |
| A3 | §4.3 is inventory, not contract | **ACCEPTED** | §4.3 explicitly labeled status/inventory; the contract is §4.2. |
| B3 | dedup authority ambiguous | **ACCEPTED** | §3.2 — dedup is the single tag-writer's job; export regroup dedup is defense-in-depth. |
| E3 | namespace/value hyphen asymmetry can break migration | **ACCEPTED** | §3.1 — asymmetry called out; §5.5 migration must respect it. |
| G5 | `KNOWN_EXHIBITS` hardcoded array unspecified | **ACCEPTED** | §7.3 — BUILD relocates it to a named config file. |
| G6 | §4.6 regex differs from v1.1's unremarked | **ACCEPTED** | §4.6 notes it is v1.1's regex with capture groups removed — same contract. |
| G7 | §3.1 alludes to an escaping rule it never defines | **ACCEPTED** | §3.1 — decided: values MUST NOT contain `:`; no escaping mechanism exists. |

**Nothing in the v2.0 review was rejected.** All 15 required changes and all
six minor findings are accepted and resolved above. The deepest finding (E1)
was confirmed *worse* than the review could verify — the slug→namespace map
does not exist in any form — and v2.1 surfaces that as a named gating task
rather than papering it.

---

*End of target-state specification v2.1-target. Every section traces to one of
the seven locked decisions (§0.3) or to a dispositioned review finding
(Appendix A). This is a design document; it is built when §12's criteria —
including entry-gate criterion 0 — are met. When a decision is revisited,
update the affected section, the §0.3 table, and the version.*
