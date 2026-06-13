<!-- WRITE SCOPE — CREATES: docs/kind-governance-spec.md (new file, the only write). Touches nothing else: no schema change, no DB write, no retag, no edits to existing docs, no commit. -->

# Kind — Governance Spec (v1)

**Status:** Proposal for Mike to ratify and run host-side. Nothing in this
document has been applied. No DDL has run, no row has been written, no tag has
been changed, no existing file has been edited.

**Repo / commit:** weird-baby-museum @ `955fc99`.

**What this is:** the specification for promoting **Kind** — the visitor
*perusal axis* — from the unenforced `content_kind` tag soup into a **governed
scalar field on `artifacts`, modeled exactly on `media_type`/Format**. Kind
becomes the second governed field after `media_type`: closed vocabulary, a DB
`CHECK` constraint, and a required value emitted at ingest.

---

## 0. Architecture fit (ratified — stated as settled, not re-derived)

The browse model is fixed: **5 browse facets** — Kind, Topic, Era, Project,
Format — plus **5 partial Detail facets** — Album, Song, Venue, Source, People
— plus null-exempt scoping. **Format = `media_type`** (already governed, closed
set, `CHECK`-enforced 2026-05-23). **Kind = the perusal axis**: the visitor
browse label answering "what kind of thing is this?"

Kind is **single-select**, applied at **root/leaf level**, and **containers are
exempt**. This spec governs Kind the same way `media_type` governs Format.

---

## 1. The closed Kind vocabulary (v1)

Single-select. Five active values plus two reserved-for-inflow values that are
**defined now but not yet populated or emitted**. Slugs are lowercase (matching
the `media_type` value convention `'photo','video',…`); display names are
title-case.

### Active (5)

| Slug | Display | Visitor-facing definition — what you expect when you tap this |
|---|---|---|
| `performance` | Performance | Them playing live — a show, a set, an on-stage clip. *Tap this to watch them play.* |
| `release` | Release | A finished, published work — a track, single, album, or official music video, as it was put out into the world. *Tap this for the music itself.* |
| `announcement` | Announcement | News the band put out — a show date, a drop, a milestone, a statement. *Tap this for "here's what's happening."* |
| `studio` | Studio | The work behind the music — rehearsal, recording, writing, behind-the-scenes craft. *Tap this to see how it gets made.* |
| `candid` | Candid | Off-stage, unstaged moments — hanging out, travel, life around the band. *Tap this for the human, unposed side.* |

### Reserved for inflow (2) — defined, not yet populated

| Slug | Display | Visitor-facing definition |
|---|---|---|
| `interview` | Interview | The band asked and answering — Q&A, conversation, profile. *Tap this to hear them talk.* |
| `fan` | Fan | Fan-made or fan-sourced — covers, tributes, fan footage, fan art. *Tap this for what fans made and shared.* |

Reserved values are carried in the `CHECK` set from day one (see §2) so that
activating them later requires **no DDL** — only an ingest-emission change. Until
activated, ingest must **not** emit `interview` or `fan` (see §3).

---

## 2. Schema change — column + `CHECK`, mirroring `media_type`

### The existing pattern (quoted)

`media_type` is the governed-field precedent. As defined today on `artifacts`
(verified in `MediaVault/core/mediavault.sqlite` and `MediaVault/SPEC.md` §6.6):

```sql
media_type              TEXT NOT NULL
                            CHECK(media_type IN ('photo','video','audio','link','text','mixed','other')),
```

Per SPEC.md §6.6, the `CHECK` was retrofitted on 2026-05-23 via a SQLite
table-rebuild, with the explicit rationale "fail-loud on future bugs that forget
media_type." Before enforcement the live table held dirty values
(`text-only` ×22, `mixed` ×3, `NULL` ×4) that had to be normalized first because
the column already existed.

### Kind's parallel (proposal — Mike runs host-side)

`kind` is a **new** column, so unlike `media_type` it needs no table rebuild and
no pre-clean — a plain `ADD COLUMN` with the `CHECK` inline is sufficient:

```sql
ALTER TABLE artifacts ADD COLUMN kind TEXT
    CHECK(kind IN ('performance','release','announcement','studio','candid','interview','fan'));
```

**The one deliberate divergence from `media_type`: nullability.** `media_type`
is `TEXT NOT NULL` on every row. `kind` is **nullable at the column level**
because **containers are exempt** and must be allowed to hold `NULL`. The
"required" half of the rule — *non-null on leaf artifacts* — cannot be expressed
in a single-row `CHECK` (container-ness depends on whether other rows reference
the row as `parent_artifact_id`), so it is enforced at **ingest** instead (§3),
exactly as the leaf/container distinction is a runtime fact, not a column fact.

The `CHECK` therefore mirrors `media_type`'s **closed-set, fail-loud** idiom
(any value off the list is rejected) while permitting `NULL` for the exempt
containers. Reserved slugs `interview` and `fan` are inside the set already so
activation needs no further DDL.

**Note on the registry file.** `media_type`'s canonical set currently lives only
in `SPEC.md` §6.6 + the DB `CHECK` — it is *not* registered in
`MediaVault/core/tag_vocabulary.json`. Per the brief, Kind's closed vocabulary
**must register in `tag_vocabulary.json`** (whose `_meta` states "UI and ingest
engine both read from here … extend this file instead"). This is a small
enhancement over the `media_type` precedent: registering Kind there gives the UI
its label/order lookup and the ingest engine its validation list from one
source, with the DB `CHECK` as the hard backstop. Exact placement
(`governed_fields` block vs. a `tag_categories` entry flagged single-select) is
an open question — see §6. The registration edit, the DDL, and any SPEC.md
update are **separate later commits, not part of this write.**

---

## 3. Ingest rule — Kind required-non-null on leaves, emitted like `media_type`

### How `media_type` is emitted today (the model)

- Seeded mechanically at **queue time** by `_infer_media_type()`
  (`MediaVault/core/imgserver_extensions.py`) from the captured file's
  extension; `url_only` captures with no screenshot default to `'link'`. The
  operator can override in the inbox dropdown.
- Written as a **scalar column** inside the single `INSERT INTO artifacts(…)`
  (`imgserver.py` ≈ L1128 via the `ARTIFACT_FIELDS` tuple; mirrored in
  `imgserver_extensions.py` ≈ L399).
- It is **not** a tag. Tags are a separate JSON array (`artifacts.tags`, default
  `'[]'`) written *only* by `write_artifact_tags` — the single-writer property
  ("no `INSERT INTO artifacts(… tags …)` anywhere", Crit 3 §4.5). The `tags`
  table is just a per-slug usage-count cache; the `vocabulary` table registers
  tag namespaces.

### What ingest must assert for Kind

Kind follows the `media_type` path, **not** the tag path:

1. **Add `kind` to `ARTIFACT_FIELDS`** so it is written as a scalar in the same
   single `INSERT`/`UPDATE` as `media_type`. Kind is a field, never a tag — it
   does not go through `write_artifact_tags` and gets no `content_kind:`-style
   pill.
2. **Seed it mechanically**, mirroring `_infer_media_type()`: a parallel
   `_infer_kind()` proposes a default from available signals (`ingest_source`,
   `source_platform`, `media_type`); the operator confirms or overrides
   **single-select** in the inbox dropdown.
3. **Assert required-non-null on leaves before promotion `inbox → vault`:** if
   the artifact is a **leaf** (not a container — has no children), `kind` must be
   non-null and in the **active** set `{performance, release, announcement,
   studio, candid}`. **Containers may remain `NULL`** (exempt).
4. **Reject reserved values** at ingest until activated: `interview` and `fan`
   are valid in the DB `CHECK` but must not be emitted or accepted from the
   dropdown until reserved-Kind activation (§6).
5. **Fail loud**, matching `media_type` §6.6 rationale: a leaf artifact reaching
   `status='vault'` with `kind IS NULL` is a bug and ingest should refuse the
   promotion rather than write a null-Kind leaf.

---

## 4. Backfill plan for the existing 280 (plan only — no retag here)

**Scope (verified against the live DB at `955fc99`):** 280 artifacts total.
**69 are containers → exempt** (no Kind required). **211 are leaf artifacts →
each needs a Kind.**

**`content_kind` is not a usable source of truth for backfill.** Only 91 of the
211 leaves carry any `content_kind` tag, the values are incoherent
(`studio`/`official`/`live`/`other`/`lyrics`/`cover`), and the dominant value is
*wrong*: 78 bandcamp leaves are tagged `content_kind:studio` when a purchased
bandcamp track is a **Release**. Backfill is therefore driven primarily by
**source + `media_type` signals**, using `content_kind` only as a weak hint
where it happens to be coherent (`live → Performance`).

### Per-source seeding (leaf artifacts only; containers excluded)

| Source | Leaves | Mechanically seedable | Target | Needs curation |
|---|---|---|---|---|
| bandcamp | 79 | **79** — `ingest_source = bandcamp-purchase` + `media_type = audio` ⇒ **Release** (high confidence). Ignore the misleading `content_kind:studio` on 78 of them. | Release | 0 |
| youtube | 64 | **4** — `content_kind:live ⇒ Performance` | Performance | **60** — the rest (incl. `official` ×3, `cover` ×1, untagged ×56) mix Performance / Studio / Announcement / Fan; per-item curation |
| reverbnation | 23 | 0 firm | (Release, tentative) | **23** — audio; RN holds both releases and live captures. *Optional bulk-seed to Release pending a spot-check — see §6* |
| facebook | 16 | 0 | — | **16** — text/photo posts split across Announcement / Candid / Performance |
| local | 12 | **5** — `content_kind:live ⇒ Performance` | Performance | **7** — Studio / Candid |
| (null platform) | 9 | 0 | — | **9** — curation |
| other | 7 | 0 | — | **7** — curation |
| instagram | 1 | 0 | — | **1** — curation |

**Totals:** ≈ **88 leaves mechanically seedable** (79 bandcamp → Release; 9
`live` → Performance), **≈ 123 leaves need curation** (of which the 23
reverbnation could be bulk-seeded to Release first, pending spot-check, shrinking
hands-on curation to ≈ 100).

No tags or fields are written by this document. This is a plan; the retag/seed
pass is a later, separate operation.

---

## 5. Supersession — retire `content_kind`

This spec **supersedes `content_kind`** as the role/perusal field. `content_kind`
is retired: it is unenforced (140/280 artifacts, 6 incoherent values) and
incoherent across the codebase. Kind (governed scalar field, §2–§3) replaces it.

`content_kind` currently appears in, and must eventually be reconciled across,
the following — **none edited here:**

- **DB `vocabulary` table** — namespace row `content_kind` ("Content Kind", tier
  3, sort 6). To be retired (`retired_at`) in a later pass.
- **`artifacts.tags` JSON data** — `content_kind:*` values on 140 rows. Left
  **untouched**; the brief excludes retagging from this write.
- **`MediaVault/SPEC.md`** — field-list line (§ "kind of thing it is"), the
  category enum (`bands … content_kind … rarity`), the routing line, and
  attention-rule **R2** (`missing_category:content_kind`). To be updated in a
  later SPEC commit.
- **`docs/CANONICAL_VOCABULARY.md`** — `content_kind` is described there as a
  Tier-3 *dynamic* namespace, and the file states: "If a future spec requires
  promoting one of these to Tier 1 or Tier 2, canonical must be updated first;
  the code heuristic follows canonical, never leads it." Promoting Kind to a
  **browse facet** is exactly that case, so **`CANONICAL_VOCABULARY.md` must be
  marked superseded** with respect to the Kind/`content_kind` routing — **as a
  separate later commit, not in this write.**

---

## 6. Open questions for Mike

### Visitor-facing (label wording)

1. Are `Performance / Release / Announcement / Studio / Candid` the exact strings
   a visitor sees, or display aliases over the slugs?
2. **"Studio"** — does it read as *recordings* or as *photos* to a visitor?
   Candidate relabels: "In the Studio" / "Behind the Scenes."
3. **"Candid"** — keep, or warmer ("Off Stage" / "Life")?
4. **"Release"** — keep, or "Music" / "Releases" for a non-industry visitor?
5. Confirm single-select reads correctly to visitors: one Kind per artifact, no
   multi-Kind chips.

### Ingest-build (enforcement timing, reserved-Kind activation)

6. **Enforcement timing:** enforce non-null-Kind-for-leaves at the
   `inbox → vault` promotion (proposed), at `INSERT`, or warn-only until a
   cutover date?
7. **`CHECK` membership:** keep the two reserved values inside the `CHECK` set
   from day one (proposed — activation needs no DDL), or add them only on
   activation?
8. **Reserved-Kind activation:** what flips `interview` / `fan` from
   reserved to emittable — a vocab-version bump, an operator toggle, or first
   inflow of that material?
9. **`_infer_kind()` seed signals + ambiguous default:** which signals, and when
   ambiguous does it default to a Kind or leave `NULL` and force an operator
   pick?
10. **Container test for the exemption:** confirm "container" = any row
    referenced as another row's `parent_artifact_id` (≥1 child), and whether
    intermediate nodes count. Ingest needs the exact leaf/container test.
11. **`tag_vocabulary.json` placement:** register Kind as a new
    `governed_fields` block, or as a single-select `tag_categories` entry?
    (`media_type` isn't registered there at all today.)
12. **Backfill latitude:** bulk-seed reverbnation (23) to Release pending a
    spot-check, or send all 23 to full curation?

---

*End of spec. No file other than this one was created or modified; nothing was
committed. Mike commits host-side.*
