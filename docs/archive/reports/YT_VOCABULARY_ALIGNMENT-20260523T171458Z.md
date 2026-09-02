# YT / MV Vocabulary Alignment — Decision Brief

**Date:** 2026-05-23 (session ~17:00–?? UTC)
**Trigger:** The HR acquisition scoping brief
(`docs/HR_ACQUISITION_SCOPING_BRIEF-20260523-154141.md`) surfaced in
§1.4 and §7 a single un-resolved upstream question: the YT ingest
schema (`tools/youtube-ingest-schema.md` v1.1, 2026-05-08) specifies
pill namespaces that MV's `vocabulary` table retired on 2026-05-19.
The acquisition brief explicitly punted this to a separate MV-side
decision. This is that decision.
**Scope:** Scoping only. One operator decision. Read-only across the
three repos until the operator answers. No DB writes, no schema-doc
edits, no code changes in this session.
**Status:** §1–§4 + §7 drafted off live data. §5 resolved
in-session per GATE 5 (Option A). §6 drafted per the chosen option.

---

## §1 — Context

The HR acquisition brief's §6.4 first work item ("YT bulk channel-walk
acquisition v1") cannot start writing code until the implementation
session knows what tag namespaces to emit per the
`youtube-ingest-schema.md` v1.1 contract — because MV's vocabulary
registry no longer surfaces those namespaces as recommended.

Two upstream facts make the question binary:

- The schema document **specifies** five namespaces — `platform:`,
  `scope:`, `author:`, `content_kind:`, `artifact_kind:` (per §4 of
  the schema, "Pill conventions and the `content_kind` / `artifact_kind`
  split").
- MV's `vocabulary` table **retired** all five at
  `2026-05-19T01:06:41.000Z` (live read of `core/mediavault.sqlite`
  at MV HEAD `f08bfa0`, this session).

The acquisition brief left this open because it is an MV-side
data-shape question, not a UX-impactful binary about acquisition
behavior. It is now load-bearing because the implementation session
needs the answer before writing the orchestrator's `tags[]` payload.

Pointer to upstream brief: `docs/HR_ACQUISITION_SCOPING_BRIEF-20260523-154141.md`
§1.4 (vocabulary state inventory), §4.1 (per-source tag rules, drift
note), §7 (explicit OOS).

---

## §2 — Current state

### 2.1 What the schema says (verbatim)

`tools/youtube-ingest-schema.md` v1.1 §4, "Pill conventions and the
`content_kind` / `artifact_kind` split":

> The earlier draft of this schema used `content_kind:` for two
> different purposes — the museum's locked variant taxonomy on the
> parent (music_video / live / lyrics / cover) and the asset-type
> label on children (thumbnail / transcript / page_save). That
> collision is corrected here: each concept gets its own namespace.

Per-artifact pill assignments per the schema:

| Artifact type | `platform:` | `scope:` | `author:` | `content_kind:` | `artifact_kind:` |
|---|---|---|---|---|---|
| `youtube_video_page` (parent) | `youtube` | `hunter_root` | `hunter_root` | `official\|live\|lyrics\|cover` | — |
| `youtube_thumbnail` | `youtube` | `hunter_root` | `hunter_root` | — | `thumbnail` |
| `youtube_transcript` | `youtube` | `hunter_root` | `hunter_root` | — | `transcript` |
| `youtube_page_save` | `youtube` | `hunter_root` | `hunter_root` | — | `page_save` |
| `youtube_channel_card` | `youtube` | `hunter_root` | `hunter_root` | — | `channel_card` |

Design rationale in the schema (§4): `content_kind:` is *only* on
parents (museum's locked-May-2026 variant taxonomy); `artifact_kind:`
is *only* on children (asset-type label). The split was deliberate
and was made to correct a prior collision.

### 2.2 What MV's vocabulary contains (live)

Read live from `core/mediavault.sqlite` at MV HEAD `f08bfa0`:

| Namespace | Display | Tier | Sort | Retired |
|---|---|---|---|---|
| `year` | Year | 1 | 1 | — |
| `album` | Album | 1 | 2 | — |
| `song` | Song | 1 | 3 | — |
| `venue` | Venue | 1 | 4 | — |
| `people` | People | 1 | 5 | — |
| `source` | Source | 2 | 1 | — |
| `type` | Type | 2 | 2 | — |
| `exhibit` | Exhibit | — | — | **2026-05-19T01:06:41Z** |
| `unsorted` | Unsorted | 3 | 1 | **2026-05-19T01:06:41Z** |
| `author` | Author | 3 | 2 | **2026-05-19T01:06:41Z** |
| `platform` | Platform | 3 | 3 | **2026-05-19T01:06:41Z** |
| `scope` | Scope | 3 | 4 | **2026-05-19T01:06:41Z** |
| `artifact_kind` | Artifact Kind | 3 | 5 | **2026-05-19T01:06:41Z** |
| `content_kind` | Content Kind | 3 | 6 | **2026-05-19T01:06:41Z** |

All five flagged namespaces retired at the same instant; pre-retirement
they were tier-3 (the "specialized / proposed" tier). `exhibit` and
`unsorted` retired in the same batch.

### 2.3 Tag instance distribution (live)

Live counts via `json_each` over `artifacts.tags`, this session:

```
unsorted: 186 instances (47 distinct values)
people: 81 — hunter_root(80), nick_root(1)
type: 62 — audio(30), mp3(30), poster(1), video(1)
source: 47 — reverbnation(42), distrokid(2), tiktok(2), instagram(1)
album: 44 — run_with_the_hunt(35), medusas_disco(7), arkansas(2)
exhibit: 19 — hunter_root(19)
era: 15 — rwth(15)                            [not in vocabulary table; valid by §3.1 grammar]
scope: 3 — hunter_root(3)                     [retired]
platform: 3 — youtube(3)                      [retired]
author: 3 — hunter_root(3)                    [retired]
year: 2 — 2023(2)
song: 2 — reverend(2)
artifact_kind: 2 — thumbnail(1), transcript(1) [retired]
content_kind: 1 — official(1)                  [retired]
```

Total tag instances across the five flagged namespaces: **12**, all
on the 3 YT-cluster artifacts ingested 2026-05-18 (before the
retirement). No other corpus carries them.

### 2.4 The mismatch in concrete terms

The acquisition orchestrator, faced with a fresh YT video, must POST
five artifact rows per the schema. Each row's `tags[]` includes
`platform:youtube`, `scope:hunter_root`, `author:hunter_root`, and
one of `content_kind:*` or `artifact_kind:*`. These POSTs **will
succeed** — MV's `validate_artifact_tags` keys on the §3.1
namespace:value grammar, not on vocabulary registration. The 3 May-18
YT artifacts demonstrate this empirically.

But the vocabulary registry — the UI surface that recommends tier-1/2
namespaces in the pill picker, the documentation-of-record for which
namespaces are blessed — no longer lists these five. The
implementation session needs guidance: emit the tags as the schema
specifies (and accept the silent vocabulary divergence), or change
the contract.

This is not a runtime bug. It is a coherence question between
two contract documents that drifted apart.

---

## §3 — The two options

### Option A — Revive the five namespaces

Reverse the 2026-05-19 retirement for `platform`, `scope`, `author`,
`content_kind`, `artifact_kind`. The schema document stands unchanged.
MV's vocabulary regains the five tier-3 entries with their original
sort orders.

**Work scope to implement:**

- 5 `UPDATE vocabulary SET retired_at = NULL WHERE namespace IN (...)`
  statements. Sort orders and display names are preserved from the
  pre-retirement state (already present in the table).
- One vocabulary-table backup (per the standard
  `core/mediavault.sqlite.bak_<purpose>_<utcstamp>` pattern).
- One CHANGELOG.md entry citing this brief.
- Zero schema-document edits. Zero acquisition-tooling edits. The
  3 already-ingested YT artifacts continue to validate (they already
  do).

**Trade-offs:**

- Partially reverts a deliberate 2026-05-19 cleanup decision. The
  cleanup direction at that point was "simplify the vocabulary
  table" (same architectural pass demoted `category` /
  `is_proposed` / `is_exclusive` columns per CHANGELOG v0.5.3,
  Phase 2.5). Reviving five tier-3 namespaces re-broadens the
  surface the cleanup intentionally narrowed.
- Low pull-weight to overcome: the five retired namespaces hold
  12 total tag instances across 3 artifacts. The reversal touches
  a small slice of live data.
- Reinforces the operator-locked-rule precedent that the HR
  acquisition brief §9.3 just set with the new `credit:` namespace
  approval. Both decisions land tier-3 namespaces in the same
  posture.

**Downstream effects on other sources (IG / FB / TT / web):**

- The schema's pill model becomes the *template* for non-YT
  acquisition. IG ingest would mint analogous tags
  (`platform:instagram`, `scope:hunter_root`, `author:hunter_root`,
  `artifact_kind:reel_video`, etc.). The five revived namespaces
  carry the per-source acquisition pill model across all sources.
- The five tier-3 namespaces accept additional values without
  further vocabulary edits — `platform:instagram`, `platform:tiktok`,
  `artifact_kind:reel_video`, etc. land mechanically.

### Option B — Migrate the schema

Update `tools/youtube-ingest-schema.md` to use namespaces that
already exist in MV's live vocabulary. Map each retired namespace
to a live equivalent. The schema becomes a derived/mapped document;
the vocabulary table stays at its post-retirement shape.

**Mapping work (per-namespace):**

| Retired ns | Live-vocabulary mapping | Clean? |
|---|---|---|
| `platform:youtube` | `source:youtube` (already used 47x; value `youtube` already present via 3 May-18 captures via `source_platform` column) | **Clean** — semantic overlap; drop `platform:`, keep `source:`. |
| `author:hunter_root` | `people:hunter_root` (already used 80x with exactly this value) | **Clean** — semantic overlap; drop `author:`, keep `people:`. |
| `scope:hunter_root` | No clean live equivalent. Closest: `exhibit:hunter_root` (also retired, 19 uses) or inferable from `source:` + `people:`. | **Not clean** — concept is "project this artifact belongs to," which is orthogonal to source and people. Would require either reviving `exhibit:` (same shape as Option A), minting a new namespace (`project:`), or dropping the concept. |
| `content_kind:official\|live\|lyrics\|cover` | `type:` is the only candidate (tier 2). But `type` is already overloaded with media-shape values: `audio`, `mp3`, `poster`, `video`. | **Not clean** — pushing variant values into `type:` re-creates exactly the collision the schema's §4 split was authored to correct. Alternatives: mint a new `variant:` namespace, or extend `type:` with discipline (accept overload). |
| `artifact_kind:thumbnail\|transcript\|page_save\|channel_card` | `type:` is the only candidate. Same overload problem. | **Not clean** — same as above. Alternatives: mint a new `role:` or `asset:` namespace, or extend `type:`. |

**Work scope to implement:**

- Edit `tools/youtube-ingest-schema.md` §4 + §3 + §10 (example
  manifest) to use the chosen mappings. Bump schema to v1.2.
- Decide per-not-clean namespace (3 of 5): mint new live namespace,
  drop the concept, or overload `type:`. Each sub-decision is its
  own coherence question.
- Backfill the 3 already-ingested YT artifacts' `tags` arrays to
  the new shape (or accept that they carry the v1.1 shape forever
  while new captures carry v1.2).
- Update HR brief §0 / §1.4 / §2.1.3 / §4.1 references to the
  schema's namespace set.

**Trade-offs:**

- Respects the 2026-05-19 cleanup direction for `platform:` and
  `author:` (both have cleaner live homes).
- Doesn't actually simplify for `scope:`, `content_kind:`,
  `artifact_kind:` — minting new namespaces is isomorphic to
  reviving the retired ones (different slugs, same tier-3 model);
  dropping the concepts loses information; overloading `type:`
  recreates the prior collision.
- Schema-document edits ripple into existing references. The 3
  already-ingested YT artifacts' tags become legacy v1.1 shape
  unless explicitly backfilled.

**Downstream effects on other sources (IG / FB / TT / web):**

- Each non-YT source gets the same treatment: drop `platform:` in
  favor of `source:`, drop `author:` in favor of `people:`, and
  resolve the same `scope:` / `content_kind:` / `artifact_kind:`
  not-clean cases per the rules this brief lands. Possibly the
  per-source variant taxonomies (e.g. IG has reel / post / story;
  TT has video / live snippet / cover) need their own equivalents
  of the `content_kind:` decision.

---

## §4 — Recommendation + reasoning

**Recommended: Option A — revive the five namespaces.**

Reasoning:

1. **Option B is not actually simpler.** Two of the five namespaces
   (`platform:`, `author:`) have clean live equivalents and dropping
   them is straightforward. The other three (`scope:`,
   `content_kind:`, `artifact_kind:`) have no clean live home. The
   resolutions available for them are either (a) mint new namespaces
   under different slugs — semantically equivalent to Option A; (b)
   drop the concepts — loses tracked information including the
   museum's locked variant taxonomy; or (c) overload `type:` —
   recreates the precise collision the schema's §4 split was
   authored to correct.

2. **The schema author's §4 design rationale stands independent of
   the vocabulary state.** The split between `content_kind:` (variant
   taxonomy) and `artifact_kind:` (asset-type label) was made because
   the prior single-namespace shape collided. That collision returns
   under any Option-B path that pushes variant values into `type:`.

3. **The retirement was light-touch on these namespaces.** 12 tag
   instances total across 3 artifacts. The 2026-05-19 retirement
   was contemporaneous with a broader cleanup that demoted columns
   (`category`, `is_proposed`, `is_exclusive`) — the architectural
   thrust was "fewer concepts at the table level," not specifically
   "purge these five tier-3 namespaces." The retirement may have
   pre-dated the acquisition layer's needs becoming concrete; the
   YT schema v1.1 was published 2026-05-08 (11 days earlier), but
   was design-only at that point — the first 3 YT artifacts
   ingested 2026-05-18, one day before the retirement.

4. **Operator precedent is set.** The HR acquisition brief §9.3
   (2026-05-23) approved minting a new tier-3 `credit:` namespace
   for fan-content credit-handling. The "operator-locked rule"
   pattern accepts tier-3 namespaces as a legitimate posture when
   real concepts need tracking. Reviving five tier-3 namespaces is
   the same posture, executed via UPDATE rather than INSERT.

5. **Option A is reversible.** If the cleanup direction reasserts
   itself later, the same `UPDATE` flips the retirement back on.
   Option B requires schema-document edits that propagate through
   downstream brief references and ingested-artifact tag arrays.

The strongest argument for Option B is "honor the 2026-05-19 cleanup
direction." That argument has weight, but the cleanup direction was
broader-architectural (column demotion + slug uniqueness) and didn't
publish a rationale specifically for purging these five namespaces.
The implementation-time cost of pretending Option B is simpler than
it is (then discovering the three not-clean cases) is higher than the
cost of executing Option A.

**Mike can override.** If the 2026-05-19 retirement was load-bearing
in a way this brief didn't surface (a reason captured outside the
docs Cowork read), Option B may be right anyway.

---

## §5 — Operator decision

**DECISION (2026-05-23, GATE 5): Option A — revive the five namespaces.**

Mike resolved in-session: reverse the 2026-05-19 retirement for
`platform`, `scope`, `author`, `content_kind`, `artifact_kind`. The
YT ingest schema stands unchanged. MV's vocabulary regains the five
tier-3 entries with their pre-retirement display names and sort
orders.

Recommendation reasoning per §4 holds: the alternative (Option B)
only cleanly resolved 2 of 5 namespaces; the other 3 would have
needed either new tier-3 namespaces under different slugs
(isomorphic to A), dropping tracked concepts, or recreating the
collision the schema's §4 split was authored to correct.

---

## §6 — Implementation implications

Per Option A, scoped for the implementation session that follows
this brief.

### 6.1 Files touched

| File | Change | Size of change |
|---|---|---|
| `core/mediavault.sqlite` | 5-row `UPDATE` in `vocabulary` table (set `retired_at = NULL` for the five namespaces). | 5 row updates. |
| `core/mediavault.sqlite.bak_pre-yt-vocab-revive-<utcstamp>.sqlite` | New backup (standard MV pre-write backup pattern). | ~one DB-size copy. |
| `CHANGELOG.md` | New entry citing this brief + the HR acquisition brief §1.4 as the drift source. | ~15-line entry. |
| `tools/youtube-ingest-schema.md` (museum repo) | **No change.** Schema stands at v1.1. | Zero. |
| `tools/yt_archive_capture.py` (HR repo) | **No change.** Already emits the schema's pill set per the 3 May-18 captures. | Zero. |
| HR brief §1.4 / §4.1 drift notes | **No change required**, but a brief one-line follow-up note recording resolution-by-this-brief is welcome. Not blocking. | Optional. |

### 6.2 SQL statement

```sql
UPDATE vocabulary
   SET retired_at = NULL
 WHERE namespace IN ('platform', 'scope', 'author',
                     'content_kind', 'artifact_kind');
-- expected: 5 rows affected
```

Sort orders and display names are preserved (already present in
the rows; the retirement only set `retired_at`).

### 6.3 Sort-order gap (minor)

Pre-retirement tier-3 sort orders were: `unsorted=1, author=2,
platform=3, scope=4, artifact_kind=5, content_kind=6`. Option A
leaves `unsorted` retired (out of scope for this brief — see §7);
the post-revive tier-3 set has a gap at sort 1. The implementation
session can either (a) renumber to 1-5 with a second UPDATE, or
(b) accept the gap. Either is fine; recommend (b) — gaps are
harmless and the renumber edits two unrelated tables (the picker
sort vs. the vocabulary table).

### 6.4 Verification queries (implementation session)

Pre-write:

```sql
SELECT namespace, tier, sort_order, retired_at
  FROM vocabulary
 WHERE namespace IN ('platform','scope','author','content_kind','artifact_kind');
-- expect: 5 rows, all retired_at = '2026-05-19T01:06:41.000Z'
```

Post-write:

```sql
SELECT namespace, tier, sort_order, retired_at
  FROM vocabulary
 WHERE namespace IN ('platform','scope','author','content_kind','artifact_kind');
-- expect: 5 rows, all retired_at = NULL
```

Tag-instance sanity (should be unchanged):

```sql
SELECT substr(je.value, 1, instr(je.value,':')-1) AS ns, COUNT(*) AS n
  FROM artifacts, json_each(artifacts.tags) je
 WHERE substr(je.value, 1, instr(je.value,':')-1)
       IN ('platform','scope','author','content_kind','artifact_kind')
 GROUP BY ns;
-- expect (no change vs. pre-write):
--   platform        3
--   scope           3
--   author          3
--   artifact_kind   2
--   content_kind    1
-- total: 12
```

### 6.5 Downstream-session unblocks

With §6.2's SQL executed, the implementation session for the HR
acquisition brief's §6.4 first work item ("YT bulk channel-walk
acquisition v1") can write the orchestrator's `tags[]` payload
per the schema's locked pill set without coherence concerns. The
five revived namespaces are also the template the future non-YT
acquisition tooling (IG / TT / FB / web) extends — `platform:`
accepts `instagram` / `tiktok` / `facebook` values; `artifact_kind:`
accepts `reel_video` / `post_image` / etc. — without further
vocabulary edits.

### 6.6 Reversibility

The same UPDATE inverted (`retired_at = '<new-timestamp>Z'`)
re-retires all five. The cleanup direction can reassert later if
warranted; this decision does not lock-in.

---

## §7 — Out of scope

- **Implementation itself.** This brief decides the contract; the
  implementation session executes it (DB writes per §6.2; backup
  per §6.1; CHANGELOG entry per §6.1).
- **Other vocabulary drift** beyond the five flagged namespaces.
  `exhibit:` (19 uses, retired) and `unsorted:` (186 uses, 47
  distinct values, retired) carry their own coherence questions
  that don't belong in this decision.
- **`era` namespace's missing-vocabulary-row status.** `era:rwth`
  has 15 live instances but no row in `vocabulary`. Whether to
  register it as tier-1/2/3 is a separate cleanup item.
- **The `credit:` namespace approval from HR brief §9.3.** Ops
  prerequisite for the implementation session; tracked there, not
  re-decided here.
- **Schema v1.2 vs v1.1 versioning policy.** Not relevant under
  Option A (schema stands at v1.1).
- **Backfilling the 3 already-ingested YT artifacts.** Not needed
  under Option A — current tags remain valid against the revived
  vocabulary.
- **Acquisition-tool changes** for the HR YT bulk channel-walk
  work item. Tracked in the HR acquisition brief §6.4; the
  vocabulary decision here is upstream of it.
- **Sort-order renumbering** of the tier-3 vocabulary set (per
  §6.3). The gap at sort 1 (left by `unsorted` remaining retired)
  is cosmetic; the implementation session decides whether to close
  it.

---

*Brief drafted 2026-05-23T17:14:58Z. §5 resolved per GATE 5;
§6 drafted per chosen option. No code changes, no DB writes, no
schema edits in this session.*
