# MV Vocabulary Reconciliation — PLAN

**File:** `MV_VOCAB_RECONCILE_PLAN-20260624.md`
**Date:** 2026-06-24
**Author:** Ops (Claude, Cowork)
**Status:** PLANNING — decision-ready. **READ-ONLY. No data changed. No `fact` Kind added.**
**Prerequisite to:** adding the `fact` Kind (PUV_FACT_MODEL_SPEC §"Dependency: vocabulary drift MUST be reconciled first").

---

## 0. Scope, method, and reachability

**Goal.** Produce a complete, itemized, ordered plan to reconcile the MediaVault tag vocabulary
to a single canonical head, so the later host-side migration is mechanical and verifiable. Mike's
2026-06-24 decision: fix the **whole** vocabulary now, not just what facts need.

**Reachability check (required by brief):**

| Path | Readable? |
|---|---|
| `C:\AI\Platform\MediaVault` | **TRUE** |
| `C:\AI\Projects\weird-baby-museum` | **TRUE** |

`C:\AI` was connected for this read. All figures below come from **read-only** inspection
(`sqlite3` opened `file:mediavault.sqlite?mode=ro`; surgical file reads). Nothing was written to
the DB or any source file. The only artifact produced is this report.

**⚠ Missing authority source.** The brief cites `PUV_FACT_BUILDPREP-20260624.md` as the build-prep
read. **That file does not exist anywhere under `C:\AI`** (searched by name, by date stamp, and by
content). This plan therefore reconstructs the build-prep facts from (a) the brief's own summary of
§3.2/§3.4/§1.1 and (b) direct live-DB/code inspection. Where my live findings differ from the
brief's quoted build-prep numbers, I flag it. **OPEN FORK F0** (Part E) asks Mike to confirm whether
a build-prep doc exists that I should reconcile against, or whether this plan supersedes it.

**Sources inspected**

- Surface A: `Platform/MediaVault/core/tag_vocabulary.json`
- Surface B: `Platform/MediaVault/docs/taxonomy/TAXONOMY_v1.md` (+ `NORMALIZATION_MAP.md`, `COVERAGE_PROOF.md`)
- Surface C: `Platform/MediaVault/core/mediavault.sqlite` (`artifacts`, `vocabulary`, `tags`)
- `Platform/MediaVault/core/ingest_engine.py`, `core/imgserver.py`
- `Projects/weird-baby-museum/tools/export-artifacts.mjs`
- `Projects/weird-baby-museum/src/routes/hr/HrExhibitFlow.jsx`, `src/data/artists/hunter-root-spine.js`
- `Projects/weird-baby-museum/src/data/exhibits/hunter_root.json`, `src/data/vocabulary.json`
- `Projects/weird-baby-museum/docs/PUV_FACT_MODEL_SPEC.md`

**Ground-truth snapshot (live `mediavault.sqlite`, 2026-06-24):** 293 artifacts.

---

## 0.1 The drift in one paragraph (so the rest reads cleanly)

There are not three clean surfaces; there are **four**, and they disagree on **format, membership,
and authority**. Surface A (`tag_vocabulary.json`) declares itself the source of truth and uses
**hyphens** (`live-show`), but **no code actually reads it** — it is an orphaned file. Surface B
(`TAXONOMY_v1.md`) declares the **live DB** canonical and specifies a clean tiered **target** model
(rename `bands`→`band`, retire `content_kind`/`format`/etc.), but that model is only **partially
applied** and its membership lists are already **stale**. Surface C (the live DB) is a **hybrid**:
old namespaces (`content_kind`, `bands`, `format`, `card_kind`) and new v1 namespaces (`event`,
`lineup`, `attributes`) coexist, the `tags` registry's `usage_count`s have drifted from the actual
`artifacts.tags` payloads, and a "retired" namespace (`exhibit`) is used by **every** artifact and
is load-bearing for export. A fourth surface — the client's `src/data/vocabulary.json` — is a stale
exported copy of the DB registry. The reconciliation must pick one head and rewrite the other three
to match.

---

# PART A — Canonical head decision (the foundational fork)

Three surfaces each claim authority. Below, for each candidate head, what choosing it **implies** —
which other surfaces must be rewritten, and roughly how much.

### The candidates as they actually stand

| | Surface A `tag_vocabulary.json` | Surface B `TAXONOMY_v1.md` | Surface C live `mediavault.sqlite` |
|---|---|---|---|
| Self-declared authority | "UI and ingest engine both read from here" | "Source of truth: live DB (read-only)" | (no self-declaration; it just *is* the data) |
| **Actually loaded by code?** | **NO** — `VOCAB_PATH` is defined in `ingest_engine.py:40` and **never read**; no other file references it | N/A (a doc) | **YES** — `imgserver.py` reads the `vocabulary` registry; export + client read `artifacts.tags` |
| Value format | **hyphens** (`live-show`, `music-video`) | underscores (target) | **underscores** (de-facto; 0 hyphens live, 1383 underscore occurrences) |
| "Kind of content" model | `kind` category (mirrors column) + dead `content_type` category | retires `content_kind`; routes media-variant into `type`/`attributes` | `kind` column (CHECK) + `content_kind` tag (175) + dead `content_type` |
| State | static, drifted, **orphaned** | aspirational **target**, partially applied, stale lists | **operational reality**, internally inconsistent |

> **Material correction to the brief.** The brief states Surface A is the head "the ingest engine
> actually loads." **It does not.** `tag_vocabulary.json` is referenced exactly once in the codebase
> — its own path definition — and is never opened or validated against. Ingest normalization
> (hyphen→underscore, `ingest_engine.py:169`) and pill categories run off the **DB `vocabulary`
> registry** via `imgserver.py`, not off Surface A. This is the single most important fact for
> Part A: Surface A's authority claim is **false in the running system**.

### What each choice implies

**Candidate A — make `tag_vocabulary.json` canonical.**
Implies: rewrite the live DB to match A's hyphenated values and A's category names (`content_type`,
no `event`/`lineup`/`attributes`), and rewrite TAXONOMY_v1 to abandon its tiered model. Cost:
**very high and backwards.** It would re-hyphenate 1383 underscore values, delete the partially
applied v1 work (`event`/`lineup`/`attributes`, 180 occurrences), resurrect a dead `content_type`,
and wire up the orphaned file so something actually reads it. It optimizes for the only surface no
code consults. **Not recommended.**

**Candidate B — make `TAXONOMY_v1.md` canonical.**
Implies: treat v1 as the spec and migrate the DB **to** it (rename `bands`→`band`, retire
`content_kind`/`format`/`card_kind`/`artifact_kind` by routing into `type`/`attributes`/reserved),
then regenerate Surface A and the client `vocabulary.json` from the result. Cost: **high but
forward.** This is the largest *data* migration, and v1's own membership lists are stale (it omits
`bandcamp`, miscounts `source`), so v1 must first be **corrected against live** before it can be
the head. It is also the most dangerous path for the client/export, which are coupled to exactly the
namespaces v1 retires (`content_kind`, `bands`, `format`, `card_kind`).

**Candidate C — make the live `mediavault.sqlite` canonical (corrected).**
Implies: declare the live DB the head, **clean it in place** (normalize, register the orphan v1
namespaces, reconcile registry counts, decide each retire/keep deliberately), then **regenerate
Surface A and the client `vocabulary.json` from the DB** and **revise TAXONOMY_v1 to describe the
reconciled DB** rather than an unapplied target. Cost: **moderate**, and it matches what code
already trusts. Every running consumer (`imgserver`, `export-artifacts`, client) already reads the
DB; making it the head means the surfaces that must change are the two that **no runtime depends
on** (the orphaned JSON and the docs), plus a controlled set of in-DB cleanups.

### Recommendation — **Candidate C, the live DB, as canonical head.**

Reasoning: (1) it is the only surface the running system actually trusts; (2) it already carries the
de-facto conventions (underscore) and the partially applied v1 namespaces; (3) the two surfaces it
forces to change — `tag_vocabulary.json` and the docs/client `vocabulary.json` — are **generated
artifacts with no runtime readers of their own** (Surface A is orphaned; the client copy is a stale
export), so rewriting them is cheap and low-risk; (4) it lets us adopt **TAXONOMY_v1's model
selectively** as the *direction* for the in-DB cleanup (rename, dedupe, route) without being bound to
v1's stale lists or to a big-bang retirement that breaks export/client.

In short: **head = live DB; v1 = the design we steer the DB toward; Surface A + client `vocabulary.json`
= regenerated downstream; TAXONOMY_v1 = rewritten to match the reconciled DB.** This is **OPEN FORK
F1** — Mike picks the head; C is the recommended default.

> Implication table for the recommended choice (C):
>
> | Surface | Action under head=C | Rough size |
> |---|---|---|
> | Live DB (head) | In-place clean: normalize, register v1 namespaces, reconcile registry, deliberate retires | the migration itself (Part D) |
> | `tag_vocabulary.json` (A) | **Regenerate** from reconciled DB; fix hyphens→underscore; drop dead `content_type`; either wire it into ingest or mark it explicitly non-authoritative | 1 file rewrite |
> | `TAXONOMY_v1.md` (B) | **Rewrite** to describe the reconciled DB (correct `source` list, mark which retirements actually happened) | 1 doc rewrite |
> | client `src/data/vocabulary.json` | **Re-export** from DB after migration | 1 regen (automated) |

---

# PART B — Itemized discrepancy ledger

All counts are live (`mediavault.sqlite`, 293 artifacts). "Occurrences" = count across
`artifacts.tags` JSON arrays unless noted. Proposed resolutions are **contingent on head = C**
(Part A); if Mike picks a different head, the direction flips but the inventory stands.

> **Convention used below:** "registry" = the `tags`/`vocabulary` tables; "payload" = the literal
> values inside `artifacts.tags`.

---

### D-a — Hyphen vs underscore value formatting
- **Disagrees:** Surface A uses hyphens (`live-show`, `tour-announcement`, `music-video`,
  `lyme-disease`, `pre-release`, …). Live DB + TAXONOMY_v1 use underscores.
- **Surface states:** A = hyphen. B = underscore (`lower_snake_case` mandated). C = **underscore,
  0 hyphenated values live** (1383 underscore occurrences; `ingest_engine.py:169` actively
  rewrites `-`→`_`).
- **Proposed resolution (head C):** Underscore is canonical. **No DB change needed** (already
  clean). **Regenerate Surface A with underscores** so it stops contradicting reality.
- **Touches:** `core/tag_vocabulary.json` only.
- **Blast radius:** 0 live occurrences to fix in data. Pure docs/file hygiene. **Low.**

---

### D-b — Three-way "kind of content" overlap — `kind` column vs `content_kind` tag vs `content_type` category  *(load-bearing for facts)*
- **Disagrees:** three different mechanisms encode "what kind of thing this is."
  1. **`artifacts.kind` COLUMN** — `CHECK(kind IN ('performance','release','announcement','studio','candid','interview','fan'))`. Live: 146 filled (`release` 107, `performance` 23, `candid` 9, `announcement` 6, `studio` 1), **147 NULL**.
  2. **`content_kind:` TAG** — 175 occurrences, values `studio`(79), `official`(28), `live`(20), `other`(10), `press`(7), `announcement`(6), `interview`(6), `performance`(5), `music`(5), `candid`(4), `lyrics`(3), `cover`(2).
  3. **`content_type` CATEGORY** — declared in Surface A only (`song`, `interview`, `press`, `live-show`, …). **0 live usage; not in registry; not in DB.** Dead.
- **Surface states:** A defines `kind` (mirrors column) **and** dead `content_type`. B retires
  `content_kind` (routes media-variant into `type`/`attributes`), keeps the column concept. C runs
  the column **and** the `content_kind` tag as two live, semantically overlapping axes
  (`studio`/`announcement`/`candid`/`interview`/`performance` appear in **both**).
- **Why load-bearing:** PUV_FACT_MODEL_SPEC decision #4 puts `fact` in the **Kind vocabulary
  alongside release/performance/…** — i.e. the **`kind` COLUMN** (and its Surface-A `kind` mirror),
  **not** `content_kind` and **not** `content_type`. So the column is the axis `fact` joins.
- **Proposed resolution (head C):**
  - **`content_type` (Surface A): delete.** Dead everywhere; its existence is pure drift.
  - **`kind` column: keep as the canonical "Kind" axis.** This is where `fact` will be added later
    (separate, post-approval rebuild — see Part D Stage 7).
  - **`content_kind` tag: keep as a *distinct, renamed* media-variant axis — do NOT merge into the
    column.** It answers a different question (media variant: official/live/lyrics/cover) and is
    load-bearing for export ordering and the client badge (Part C). **Recommend renaming it to a
    name that cannot be confused with the `kind` column** (candidate: `variant`) to end the
    "kind vs content_kind" collision — **but this is itself a fork (see D-c / F4)** because the
    rename is export- and client-coupled.
  - Net: facts live in the **column**; the media-variant tag survives under a clearer name; the dead
    category is removed.
- **Touches:** `artifacts.kind` (CHECK rebuild only when `fact` is added — Part D Stage 7);
  `content_kind:` payloads (only if renamed); `tag_vocabulary.json`; `TAXONOMY_v1.md`;
  `export-artifacts.mjs` (`KIND_RANK`/`kindOf`); client `HrExhibitFlow.jsx` (`ContentKindBadge`,
  `BOARD_TOTAL_KEYS`).
- **Blast radius:** column 146 filled / 147 NULL; `content_kind` tag 175 occurrences. **High —
  EXPORT-COUPLED + INGEST-COUPLED + CLIENT-COUPLED.** Treat carefully; see F4.

---

### D-c — Namespaces TAXONOMY_v1 retires but are still live — keep or actually retire?
TAXONOMY_v1 §"Retired namespaces" lists `content_kind`, `artifact_kind`, `card_kind`, `format`
(plus `unsorted`, `platform`) as retired/superseded. Live reality:

| Namespace | Live occurrences | Registry status | Actually safe to retire? |
|---|---|---|---|
| `content_kind` | **175** | tier 3, **not** retired | **NO** — export `KIND_RANK` + client badge/filter depend on it (Part C). EXPORT+CLIENT-COUPLED |
| `artifact_kind` | **55** (`thumbnail` 39, `transcript` 15, `cover` 1) | tier 3, not retired | Partially — denotes derived/child assets; v1 wants `thumbnail`/`transcript`→`type` (reserved). Check export does not read it (it does **not**) before routing |
| `card_kind` | **10** (`album` 9, `gallery` 1) | **not a registered vocabulary namespace at all** | **NO** — `export-artifacts.mjs` dispatches container logic on it (gallery/album); client reads `card.card_kind`. EXPORT+CLIENT-COUPLED — **hard blocker** |
| `format` | **24** (`video` 10, `web` 6, `text` 4, `photo` 2, `short` 2) | tier 2, not retired | Mostly — but client `BOARD_TOTAL_KEYS` includes `format`; re-export + client edit required first |
| `unsorted` | 0 live | retired 2026-05-19 | **Already done** — true retirement, no action |
| `platform` | 0 live | retired 2026-05-24 | **Already done** — folded into `source` |

- **Proposed resolution (head C):** Retire **deliberately, per namespace, only after its consumer
  is cut over** — not as a blanket doc statement. `unsorted`/`platform` are genuinely retired (leave
  as-is). `content_kind` and `card_kind` are **NOT retirable today** without breaking export and
  client; either keep them (recommended near-term) or schedule a coupled export+client change first
  (F4/F5). `artifact_kind` and `format` are retirable **after** routing their values and re-export.
  **TAXONOMY_v1's "retired" list is currently aspirational and must be corrected to reflect what is
  truly retired vs merely targeted.**
- **Touches:** `vocabulary` table (`retired_at`), `artifacts.tags` payloads (only if values routed),
  `export-artifacts.mjs`, client, both vocab files, TAXONOMY_v1.
- **Blast radius:** see per-row counts. `content_kind`(175) and `card_kind`(10) are the dangerous
  ones despite small `card_kind` count — **coupling, not count, is the risk.** **High.**

---

### D-d — `bands` → `band` rename
- **Disagrees:** TAXONOMY_v1 renames the Tier-1 namespace `bands`→`band` (singular). Live DB still
  uses `bands`.
- **Surface states:** A has no band namespace (uses `subject:band` as a *value*, a different axis).
  B = `band`. C = **`bands`, 288 occurrences** (`bands:hunter_root` 284, `bands:medusas_disco` 4);
  **no `band:` namespace exists** in registry or payloads.
- **Proposed resolution (head C):** Adopt v1's rename to **`band`**. Rewrite 288 payload values
  `bands:*`→`band:*`, add `band` to `vocabulary` (tier 1) and rename/retire the `bands` registry row,
  re-export, and update the client (`BOARD_TOTAL_KEYS` lists `bands`; `card.tags.bands` reads).
  **Watch the collision TAXONOMY_v1 itself flags:** the Tier-3 `lineup` value `band` (full-band vs
  solo) is a *different* axis — the rename must not merge them.
- **Touches:** `artifacts.tags` (288), `vocabulary` (`bands`/`band` rows), `tags` registry (2 slugs),
  `export-artifacts.mjs` output, client `HrExhibitFlow.jsx` (`BOARD_TOTAL_KEYS`, `tags.bands` reads),
  client `vocabulary.json`, both vocab docs.
- **Blast radius:** **288 occurrences + CLIENT-COUPLED (filter board) + re-export required.** High.

---

### D-e — `source` / `source_platform` count mismatch (TAXONOMY_v1 flags 23/6 expected vs 3/0 live)
- **Disagrees:** TAXONOMY_v1 §`source` expected "23 disagreements / 6 unresolvable" between the
  `source:` tag and the `source_platform` column; it measured **3/0** live at authoring time (185
  artifacts) and flagged it as an open item. The DB has since grown to **293 artifacts**, so both
  numbers are **stale again**.
- **Surface states (re-measured live, 2026-06-24):**
  - `source:` **tag** — 239 occurrences: `youtube`(102), `bandcamp`(79), `reverbnation`(42),
    `web`(12), `instagram`(2), `tiktok`(1), `other`(1).
  - `source_platform` **column** — `youtube`(105), `bandcamp`(79), `reverbnation`(42), NULL(19),
    `facebook`(16), `press`(12), `local`(12), `other`(7), `instagram`(1).
  - TAXONOMY_v1's **allowed `source` set** = {youtube, reverbnation, facebook, instagram, distrokid,
    tiktok, local, other}. **It omits `bandcamp` (79 live!) and has no mapping for tag `web`(12) or
    column `press`(12)/`local`(12).** And it lists `distrokid` (registry slug exists, **usage 0**).
- **Two distinct problems here:** (1) the **tag-vs-column disagreement** v1 tried to resolve via the
  URL-host rule; (2) the **allowed-set is wrong** (missing `bandcamp`, unmapped `web`/`press`).
- **Proposed resolution (head C):**
  - **Re-run the disagreement count fresh at migration time** (do not trust 23/6 or 3/0). Apply v1's
    deterministic rule (URL host > column > tag) to collapse tag+column into one canonical `source`
    field per artifact.
  - **Correct the allowed set against live:** add `bandcamp`; decide `web`→`other` (or a new value)
    and `press`→`other`/keep (these look like *content* sources mis-filed under platform); drop or
    keep `distrokid` (0 usage). Each addition/mapping is a small fork (F6).
  - The "23/6 expected" figure appears to be a **build-prep expectation that the live data never
    matched** — treat it as a stale assumption, not a target.
- **Touches:** `artifacts.source_platform` column, `source:` payloads (239), `vocabulary`/`tags`
  registry for `source`, `export-artifacts.mjs` (emits `source_platform`, YouTube-thumbnail
  synthesis keys on `source_platform='youtube'`), client, vocab docs.
- **Blast radius:** 239 tag + ~274 column values; **EXPORT-COUPLED** (export reads/emits
  `source_platform`; YouTube thumbnail synthesis depends on it). Medium-high.

---

### D-f — EXPORT-coupled `card_kind` / `content_kind` dependency
- **Disagrees:** `export-artifacts.mjs` **dispatches on tags that TAXONOMY_v1 marks retired.**
  - `card_kind` — container detection: `sortedTags.card_kind` (line 415); sets `record.card_kind =
    "gallery"` (424) and `"album"` (498); drives `gallery[]`/`tracks[]` synthesis. Client mirrors:
    `hunter-root-spine.js` filters `a.card_kind === "album"`; `HrExhibitFlow.jsx` reads
    `card.card_kind` for gallery/album rendering.
  - `content_kind` — album track ordering: `KIND_RANK = {official:0, live:1, lyrics:2, cover:3}`,
    `kindOf = tags.content_kind[0] || "official"` (lines 456-472). Client `ContentKindBadge` renders
    `card.tags.content_kind`; `BOARD_TOTAL_KEYS` includes `content_kind`.
- **Proposed resolution (head C):** **Flag both as retirement-blocking.** Neither `card_kind` nor
  `content_kind` may be retired or renamed until `export-artifacts.mjs` **and** the client are
  changed in the same coordinated step, followed by a re-export. Near-term recommendation:
  **keep both** (do not retire), optionally rename for clarity only via the coupled change in F4/F5.
- **Touches:** `export-artifacts.mjs`, `src/data/exhibits/hunter_root.json` (snapshot), client JSX,
  `artifacts.tags` payloads if renamed.
- **Blast radius:** `card_kind` 10, `content_kind` 175 — **EXPORT-COUPLED + CLIENT-COUPLED.**
  Highest-risk items in the ledger.

---

### Additional discrepancies found (not in §3.2 a–f)

### D-g — `tags` registry `usage_count` has drifted from actual payloads *(Surface C internal inconsistency)*
- The `tags` table `usage_count`s **do not match** the real `artifacts.tags` occurrence counts, and
  some **used values are not registered at all:**
  - `content_kind:studio` registry **78** vs payload **79**; `content_kind:other` **9** vs **10**;
    `bands:hunter_root` **283** vs **284**.
  - `content_kind:performance`(5), `content_kind:music`(5), `content_kind:announcement`(6) appear in
    payloads but are **absent from the registered `content_kind` slugs** (registry has 9 slugs;
    payload uses 12 distinct values).
  - `source:other`(1 payload) not registered; `source:distrokid` registered with usage **0**.
- **Resolution:** **Rebuild `tags.usage_count` from the live payloads** as a deterministic step
  (Part D Stage 5), and add the missing slugs / drop zero-usage stubs per fork F7. This is the DB
  disagreeing with **itself** — must be fixed regardless of which head is chosen.
- **Touches:** `tags` table only (counts + slug membership). **No payload change.**
- **Blast radius:** registry-only; consumers that trust `usage_count` = `imgserver.py` pill
  suggestions. Low-medium.

### D-h — v1 namespaces applied to data but never registered in `vocabulary` table
- `event`(32 occ), `lineup`(27), `attributes`(121) are **live in payloads and in the `tags`
  registry**, but **have no row in the `vocabulary` namespace table** (and no tier/sort/retire
  metadata). `presentation`(1) is a stray, unregistered namespace too. `card_kind`(10) is likewise
  **unregistered** in `vocabulary`.
- **Resolution:** **Register the kept v1 namespaces** (`event`, `lineup`, `attributes`) in
  `vocabulary` with proper tier/sort, so `imgserver.py`'s pill layer and the client `vocabulary.json`
  export see them. Decide `presentation`(1) — almost certainly noise to fold/remove (F8).
- **Touches:** `vocabulary` table; downstream `imgserver.py`, client `vocabulary.json` re-export.
- **Blast radius:** registry-only at first; affects pill display + client vocab snapshot. Medium.

### D-i — `exhibit` namespace is "retired" but used by every artifact and is load-bearing for export
- `vocabulary` marks `exhibit` **retired (2026-05-19)**, yet `exhibit:hunter_root` is on **all 293
  artifacts**, and `export-artifacts.mjs` **discovers exhibits from `exhibit:%` tags** (the entire
  per-exhibit export keys off it).
- **Resolution:** **Un-retire `exhibit` (clear `retired_at`)** — its "retired" flag is simply wrong
  and contradicts a load-bearing consumer. (F9; recommended default: un-retire.)
- **Touches:** `vocabulary` row only; corrects a flag the export already ignores.
- **Blast radius:** registry flag only; `imgserver.py` would otherwise tell the client to hide a
  universal, required namespace. Low effort, important correctness.

### D-j — Surface A (`tag_vocabulary.json`) is orphaned and internally stale
- Defined at `ingest_engine.py:40` and **never read**; declares categories (`content_type`,
  `release_stage`, `subject`, `rarity`, `preservation`, `permission`) that **have little or no live
  presence** and use hyphens. Its `kind` category is the **only** part synced to reality (mirrors the
  column CHECK).
- **Resolution:** Under head C, **regenerate it from the DB** (or explicitly demote it to a
  non-authoritative reference and remove the false "source of truth" claim). Decide whether ingest
  should *start* reading it or whether the DB registry remains the ingest authority (F3).
- **Touches:** `core/tag_vocabulary.json`; optionally `ingest_engine.py`/`imgserver.py`.
- **Blast radius:** no runtime reads today → safe to rewrite. Low.

### D-k — Fourth surface: client `src/data/vocabulary.json` is a stale DB export
- A committed snapshot of the `vocabulary` table (`row_count 19`, exported 2026-06-15). It still
  carries `bands`, `content_kind`, `format` with old tiers. The brief named three surfaces; this is a
  **fourth** that must be **re-exported** after the migration or the client renders stale namespaces.
- **Resolution:** Re-export from DB as the final client-sync step (Part D Stage 6/8).
- **Touches:** `src/data/vocabulary.json` (regen).
- **Blast radius:** client filter/pill metadata. Low effort (automated regen), but easy to forget.

---

# PART C — Blast-radius / coupling map

For each proposed change, every consumer that reads the affected namespace/value. **★ = EXPORT-COUPLED,
◆ = INGEST-COUPLED, ▲ = CLIENT-COUPLED.** Dangerous changes are those touching ★/◆/▲.

| Change (discrepancy) | Ingest `ingest_engine.py` / `imgserver.py` | Export `export-artifacts.mjs` | Client `src/...` (+ exhibits snapshot) | Docs / vocab files |
|---|---|---|---|---|
| **Underscore canonical** (D-a) | ◆ ingest already normalizes `-`→`_` (no change) | none | none | rewrite `tag_vocabulary.json` |
| **Delete dead `content_type`** (D-b) | none (orphaned) | none | none | `tag_vocabulary.json`, TAXONOMY_v1 |
| **Keep `kind` column as Kind axis; add `fact` later** (D-b) | ◆ `imgserver` pill prompt references kinds | ★ export reads `content_kind` not column — no column dep | ▲ none on column directly | TAXONOMY_v1, `tag_vocabulary.json` |
| **Rename/keep `content_kind`** (D-b/D-c/D-f) | ◆ `imgserver.py` enrichment prompt category `content_kind` (values live_show/poster/tour_announcement) | ★ `KIND_RANK`/`kindOf` album ordering (lines 456-472) | ▲ `ContentKindBadge`, `BOARD_TOTAL_KEYS`, `card.tags.content_kind`; snapshot `hunter_root.json` | both vocab files, TAXONOMY_v1 |
| **Retire/keep `card_kind`** (D-c/D-f) | none | ★ container detection gallery/album (lines 415-498) | ▲ `hunter-root-spine.js` (`card_kind==="album"`), `HrExhibitFlow.jsx` gallery/album render; snapshot | TAXONOMY_v1 |
| **Route+retire `artifact_kind`** (D-c) | ◆ pill suggestions | (no read) | (no direct read found) | both vocab files |
| **Route+retire `format`** (D-c) | ◆ pill suggestions | (no direct read) | ▲ `BOARD_TOTAL_KEYS` includes `format` | both vocab files |
| **`bands`→`band` rename** (D-d) | ◆ `imgserver` pill category `bands` | ★ emits `tags.band(s)` grouped by namespace | ▲ `BOARD_TOTAL_KEYS` includes `bands`, `card.tags.bands`; snapshot | both vocab files, TAXONOMY_v1 |
| **`source` collapse + allowed-set fix** (D-e) | ◆ `imgserver` sets `source_platform`/pills | ★ emits `source_platform`; YouTube-thumbnail synthesis keys on `source_platform='youtube'` (line 387) | ▲ source facet in filter board; snapshot | both vocab files, TAXONOMY_v1, NORMALIZATION_MAP |
| **Rebuild `tags.usage_count`** (D-g) | ◆ `imgserver` pill ranking trusts `usage_count` | none | none | none |
| **Register `event`/`lineup`/`attributes`** (D-h) | ◆ `imgserver` `load_vocabulary_meta` emits to client | none | ▲ via re-exported `vocabulary.json` | none |
| **Un-retire `exhibit`** (D-i) | ◆ `imgserver` emits `namespace_retired_at` (would hide it) | ★ exhibit discovery keys on `exhibit:%` (lines 130-135) | ▲ via `vocabulary.json` | none |
| **Regenerate `tag_vocabulary.json`** (D-j) | (no reader today) | none | none | the file itself |
| **Re-export client `vocabulary.json`** (D-k) | source = `imgserver`/DB | none | ▲ client reads it | the file itself |

**The dangerous set (touch ★ and/or ▲): `content_kind`, `card_kind`, `bands`→`band`, `source`,
`exhibit`, `format`.** Each requires a coordinated export + client change and a **re-export** before
the client is correct. **`content_type` and `tag_vocabulary.json` are safe** (no runtime readers).
**Registry-only fixes (`usage_count`, namespace registration) are low-risk** but feed `imgserver`'s
pill layer and the client vocab snapshot.

---

# PART D — Ordered migration sequence (for a LATER host-side execution)

Staged, each stage independently verifiable and reversible. **Nothing here is executed by this plan.**
Ordering principle: **registry/flag cleanups first (cheap, reversible) → payload renames (coupled,
need re-export) → the CHECK-rebuild last, combined with the `fact` add.**

> **Re-export rule:** any stage that changes a namespace the client reads (`content_kind`, `card_kind`,
> `bands`/`band`, `source`, `format`, `exhibit`) is **not complete** until `export-artifacts.mjs` is
> re-run and the client snapshot (`src/data/exhibits/hunter_root.json`) + `src/data/vocabulary.json`
> are regenerated and verified.

### Stage 0 — Backup (mandatory first step)
- **Do:** fresh timestamped copy of `core/mediavault.sqlite` →
  `core/backups/mediavault_pre-vocab-reconcile-v2-<UTC>.sqlite`. Record row counts
  (`artifacts`=293) and a namespace-occurrence baseline (the Part B numbers).
- **Verify:** backup opens read-only; `PRAGMA integrity_check` = `ok`; counts match.
- **Rollback:** restore the copy. (Baseline for every later rollback.)

### Stage 1 — Registry flag corrections (no payload change)
- **Do:** un-retire `exhibit` (clear `retired_at`, D-i); register `event`/`lineup`/`attributes`
  (and resolve `presentation`) in `vocabulary` with tier/sort (D-h); register or formalize
  `card_kind` if it is being **kept** (D-c).
- **Verify:** `SELECT namespace, tier, retired_at FROM vocabulary` shows expected rows; re-run
  `imgserver` vocab endpoint and confirm `exhibit` no longer flagged retired and new namespaces
  present.
- **Rollback:** restore Stage 0 backup (or reverse the specific `UPDATE`s).

### Stage 2 — Registry `usage_count` rebuild + slug reconciliation (D-g)
- **Do:** recompute every `tags.usage_count` from live `artifacts.tags`; add used-but-unregistered
  slugs; drop/keep zero-usage stubs per F7.
- **Verify:** for each slug, `usage_count` equals a `json_each` recount; no payload value lacks a
  registry slug.
- **Rollback:** restore Stage 0 backup.

### Stage 3 — `source` collapse + allowed-set correction (D-e)  ★EXPORT
- **Do:** apply v1's deterministic rule (URL host > `source_platform` column > `source:` tag) to set
  one canonical `source` per artifact; add `bandcamp`; map `web`/`press`/`local` per F6; **re-measure
  the tag-vs-column disagreement first and record it** (replaces the stale 23/6 vs 3/0).
- **Verify:** every artifact has exactly one resolved `source`; counts reconcile; **re-export** and
  confirm `source_platform` in `hunter_root.json` unchanged for YouTube thumbnail synthesis.
- **Rollback:** restore Stage 0 backup; re-export from backup.

### Stage 4 — `bands` → `band` rename (D-d)  ★EXPORT ▲CLIENT
- **Do:** rewrite payload `bands:*`→`band:*` (288); add `band` namespace, retire/rename `bands` row;
  update `tags` slugs. **Do not touch** the `lineup` value `band`.
- **Verify:** 0 remaining `bands:` payloads; 288 `band:` payloads; `lineup:band` intact; **re-export**;
  update client `BOARD_TOTAL_KEYS`/`tags.bands` reads; client filter board renders `band`.
- **Rollback:** restore Stage 0 backup; revert client edit; re-export.

### Stage 5 — `artifact_kind` / `format` routing + deliberate retirement (D-c)
- **Do (only for the namespaces Mike approves retiring, F5):** route `artifact_kind`
  (`thumbnail`/`transcript`→`type` reserved, else `attributes`) and `format`
  (`short`→`attributes`, media-ish values per F5), then set `retired_at` on the emptied namespaces.
  **Leave `content_kind` and `card_kind` in place unless F4 elected to change them** (those need the
  coupled export+client change below).
- **Verify:** retired namespaces have 0 live payloads before `retired_at` is set; update client
  `BOARD_TOTAL_KEYS` (drops `format` if retired); **re-export**.
- **Rollback:** restore Stage 0 backup; re-export.

### Stage 5b — *(only if F4 approves)* rename/retire `content_kind` + `card_kind`  ★EXPORT ▲CLIENT
- **Do:** the coordinated change — edit `export-artifacts.mjs` (`KIND_RANK`/`kindOf`, container
  detection) **and** client (`ContentKindBadge`, `hunter-root-spine.js`, `HrExhibitFlow.jsx`)
  **before** renaming payloads, then rename payloads, then re-export.
- **Verify:** album track ordering and gallery/album containers render identically post-change;
  diff `hunter_root.json` before/after for semantic equivalence.
- **Rollback:** restore Stage 0 backup; revert code; re-export. **(Recommended default: SKIP this
  stage near-term — keep `content_kind`/`card_kind` as-is. See F4/F5.)**

### Stage 6 — Regenerate downstream surfaces (D-a, D-j, D-k)
- **Do:** regenerate `core/tag_vocabulary.json` from the reconciled DB (underscores, no
  `content_type`); re-export client `src/data/vocabulary.json`; **rewrite `TAXONOMY_v1.md`** to
  describe the reconciled DB (correct `source` set; mark true retirements).
- **Verify:** all four surfaces agree on namespace membership and value format; client renders;
  no consumer references a removed value.
- **Rollback:** revert the regenerated files (they are derived; safe).

### Stage 7 — `artifacts` table REBUILD for the `kind` CHECK + `fact` add  *(combine to avoid two rebuilds)*
- **Why a rebuild:** per build-prep §1.1, the `kind` CHECK constraint
  (`CHECK(kind IN ('performance','release','announcement','studio','candid','interview','fan'))`)
  **cannot be altered in place** — SQLite requires recreating the table to change a column CHECK.
  This is the **only** stage needing a table rebuild.
- **Decision — combine with the `fact` add:** the vocabulary reconciliation (Stages 1-6) needs **no**
  `kind`-CHECK change, so it needs **no rebuild**. The **only** reason to rebuild is to widen the
  CHECK to include `fact`. **Therefore do not rebuild during reconciliation — do a single rebuild at
  the `fact`-Kind add, after Mike approves the forks.** This avoids two rebuilds entirely. (This stage
  is listed here for sequencing only; it executes in the **later** `fact` workstream, not the vocab
  migration.)
- **Do (later):** create `artifacts_new` with
  `CHECK(kind IN ('performance','release','announcement','studio','candid','interview','fan','fact'))`,
  copy rows, swap, recreate FKs/indexes; add `fact` to `tag_vocabulary.json` `kind` category.
- **Verify:** `integrity_check=ok`; row count 293 preserved; existing `kind` values intact; a test
  `fact` row inserts.
- **Rollback:** restore the pre-rebuild backup.

### Stage 8 — Final re-export + client verification
- **Do:** final `export-artifacts.mjs` run; regenerate client `vocabulary.json`; smoke-test the
  museum client (filter board, album/gallery containers, content-variant badge, source facet).
- **Verify:** client renders all reconciled namespaces; no console errors; snapshot diff reviewed.
- **Rollback:** restore prior committed client snapshots.

**Rebuild summary:** exactly **one** `artifacts` rebuild is required, and it is **deferred to the
`fact`-Kind add** (Stage 7) — the vocabulary reconciliation (Stages 0-6, 8) needs none.
**Re-export points:** Stages 3, 4, 5, 5b, 6, 8 (any namespace the client reads).

---

# PART E — Open forks for Mike

Each is a single decision with a recommended default. Walk them in order; F1 governs the rest.

**F0 — Build-prep source.** `PUV_FACT_BUILDPREP-20260624.md` is not on disk. Does it exist elsewhere
(and should this plan reconcile to it), or does this plan stand as the build-prep?
→ *Default: this plan stands; confirm the §3.2/§3.4 numbers herein supersede the brief's quotes.*

**F1 — Canonical head.** Which surface is authoritative?
→ *Default: **C, the live DB** (corrected), with TAXONOMY_v1 as the design direction, and
`tag_vocabulary.json` + client `vocabulary.json` regenerated from the DB.* (Part A.)

**F2 — Hyphen vs underscore.** Confirm **underscore** is canonical (matches 100% of live data).
→ *Default: underscore; regenerate Surface A to match.*

**F3 — Surface A's role.** Should `tag_vocabulary.json` (currently orphaned) be **wired into ingest**
as a real validator, or **demoted** to a non-authoritative reference regenerated from the DB?
→ *Default: demote + regenerate from DB; drop its false "source of truth" claim.* (Revisit wiring it
in as a later hardening task.)

**F4 — `content_kind`: keep, or rename to end the `kind`-column collision?**
→ *Default: **keep as-is near-term** (it is export- and client-coupled). Rename to `variant` only as
a later coordinated export+client change. Facts go in the **column**, not here, either way.*

**F5 — Which v1-"retired" namespaces actually get retired now?** `content_kind`(175),
`card_kind`(10), `artifact_kind`(55), `format`(24).
→ *Default: retire **none** in the vocab pass except confirming `unsorted`/`platform` (already done).
Route+retire `artifact_kind`/`format` only if you want them gone now; **keep `content_kind`/`card_kind`**
(hard export/client blockers). Correct TAXONOMY_v1's "retired" list to reflect reality.*

**F6 — `source` allowed-set additions/mappings.** Add `bandcamp` (79 live). Map tag `web`(12) and
column `press`(12)/`local`(12) → `other`, or give them their own values? Keep or drop `distrokid`
(usage 0)?
→ *Default: add `bandcamp`; map `web`→`other`; keep `press` and `local` as distinct values (they are
real); drop `distrokid`. Re-measure tag-vs-column disagreement fresh (ignore 23/6 and 3/0).*

**F7 — Registry stubs.** Drop zero-usage `tags` slugs (e.g. `source:distrokid`) and TAXONOMY_v1's
zero-usage album stubs (`cracked`, `crooked`, `dandelions`, `skipping`, `wheel`), or retain?
→ *Default: drop zero-usage stubs; rebuild `usage_count` from payloads.*

**F8 — Stray `presentation` namespace (1 occurrence).** Fold into `attributes`, reclassify, or remove?
→ *Default: inspect the single artifact and fold into `attributes` (noise).*

**F9 — `exhibit` retirement flag.** Un-retire `exhibit` (293 live, export depends on it)?
→ *Default: un-retire — the flag is simply wrong.*

**F10 — `fact` Kind placement (confirmation, not action here).** Confirm `fact` joins the **`kind`
column** CHECK set (per PUV spec #4), **not** `content_kind` and **not** the dead `content_type`,
and that its table rebuild is **combined with no other rebuild** (Stage 7).
→ *Default: confirm — `fact` → `kind` column; single rebuild at the `fact` add.*

---

## Appendix — verification log (read-only)

- DB opened `file:mediavault.sqlite?mode=ro`; **no writes issued**; no source file edited. Only output
  is this report.
- Counts cross-checked two ways where possible: `artifacts.tags` `json_each` occurrence counts vs the
  `tags` registry `usage_count` (the mismatch is itself logged as D-g).
- `artifacts` total = 293 (consistent across all queries). `kind` column: 146 filled / 147 NULL.
- `tag_vocabulary.json` reader search: `grep -rn "tag_vocabulary\|VOCAB_PATH"` across `Platform/MediaVault/**.py`
  → single hit (the definition); confirms Surface A is not read at runtime.
- `export-artifacts.mjs` coupling confirmed at lines 130-135 (exhibit discovery), 415-498 (`card_kind`),
  456-472 (`content_kind`/`KIND_RANK`), 387 (`source_platform` YouTube thumbnail).
- Client coupling confirmed in `HrExhibitFlow.jsx` (`BOARD_TOTAL_KEYS`, `ContentKindBadge`, `card_kind`)
  and `hunter-root-spine.js` (`card_kind === "album"`).

*End of plan. No data changed. The host-side migration and the `fact`-Kind add proceed only after Mike
resolves the forks above.*
