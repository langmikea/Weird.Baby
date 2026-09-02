# Derived-Era / Weighted-Date Model — v0.2 (SUPERSEDING)

**Weird.Baby Museum · Hunter Root exhibit**

- **Date:** 2026-06-16
- **Status:** APPROVED (Mike, 2026-06-16). Build authorized.
- **Owner:** Mike (UX/curation) · Claude (Ops/drafting)
- **Supersedes:** `derived-era-spec_v0.1.md` (paper-only — v0.1 was never built; no code to unwind).
- **Extends:** `discovery-metadata-spec.md` v0.2.1 §5 (era buckets inherited, not reopened).

> This Markdown is the machine-readable companion to `derived-era-spec_v0.2.docx`. The .docx is the human-render authority; this file is for repo/agent parsing. Keep them in sync.

---

## 0. Why this supersedes v0.1

v0.1 was drafted earlier the same day against the chat-only design. Mike's decisions this session move the model on three foundational axes. Per project truth-ranking, a new decision by Mike outranks a locked spec, so v0.1 is superseded — not amended. **v0.1 was never built**, so superseding is paper-only: the v0.1 doc gets a header, the codebase has nothing to unwind. This is a from-scratch build, not a migration.

| Axis | v0.1 (superseded) | v0.2 (this spec) |
|---|---|---|
| **Era cardinality** | Single value. Weighted vote + argmax collapses the date-set to exactly one bucket. "Between buckets" engineered out. | **Multi-membership.** The weighted date-set is preserved; an artifact belongs to every bucket its dates touch. Slider chooses depth. |
| **Weight direction** | Referenced/album date out-weights publish; piece lands in the album's era. | **Publish era is the heavy anchor.** Every dated aspect the content references gets a weight scaled to its centrality. Anchored in publish era; surfaces in referenced eras by centrality as the slider deepens. |
| **Where era is computed** | Baked into `hunter_root.json` by the export. Bucket change ⇒ re-run export, recompute every record. | Record carries the weighted date-set (normalized to year). Client maps dates→buckets at module load. Bucket change ⇒ edit one config + rebuild. No artifact recompute, no re-export. |

**Driver for the third reversal:** Mike expects ≥3 bucket revisions near-term, plus a future Medusa's Disco library import (Hunter Root was a founding member). Bake-at-export would force a full recompute and re-export on each revision. Storing the invariant (dates) and deriving the variant (era) at read makes bucket edits free of artifact churn.

---

## 1. One-line statement

Each leaf artifact carries a **weighted set of year-normalized dates** — its publish date (heavy anchor) plus the date of **any dated aspect the content references** (album, song, event, tour, dated person), each weighted by **how central that aspect is to the piece**. The record stores dates, not an era label. The client maps that weighted set to era buckets at render time. A **continuous depth slider** sets a single weight cutoff: keep every date at or above the cutoff, map those to buckets. Sliding the cutoff smoothly peels referenced eras off one at a time, in centrality order — from publish-only at the top to all-eras at the bottom. **Shallow / medium / deep are regions of one continuous axis, not discrete stops.** The slider defaults to **medium** on first load and is **sticky** — it persists the visitor's last setting across sessions.

---

## 2. Verified client contract (live tree)

Verified against the live tree this session via Cowork. Ground the design targets — not assumption.

### 2.1 The matcher is already multi-value
`matchFilter` (HrExhibitFlow.jsx L538–553) reads era as `item.tags.era` — a string array — and loops it for any match (L548–550). It already surfaces an artifact carrying two era values in both. **Multi-era membership requires zero matcher change.** The single-value constraint lives in the data the export bakes, not in the engine.

### 2.2 Dimensions are a module-load reduction over baked JSON
`buildDimensions(ARTIFACTS)` (called once at HrExhibitFlow.jsx L103) walks each artifact's tags and harvests the value set per namespace from `hunter_root.json`. Ordering/labels come from `vocabulary.json`. Both inputs are export-generated, committed, and bundled at build time. No live computation, and — confirmed — **no date-set→era derivation anywhere on the client today.**

### 2.3 Implication
Read-time mapping is reachable because `buildDimensions` is already the per-record reduction layer. The mapping slots into it. Three things must be added that the client lacks today: (a) the weighted date-set on each record, (b) the bucket config, (c) the dates→buckets mapping + slider threshold. None is a new architectural layer.

---

## 3. Data shape

### 3.1 On the record (export-baked)
The export bakes a weighted, year-normalized date-set per leaf into `hunter_root.json`, alongside the existing tag blob. It computes the set; it no longer computes an era label.

```jsonc
"dates": [
  { "year": 2025, "weight": 2.0, "role": "publish",   "source": "inferred" },
  { "year": 2016, "weight": 1.4, "role": "album_ref", "source": "inferred" },
  { "year": 2023, "weight": 0.3, "role": "tour_ref",  "source": "curated"  }
]
```

- **year** — normalized to year (or finer if ever needed). The invariant that survives bucket redraws.
- **weight** — float, set by **centrality**: how central this dated aspect is to the piece. Publish is the heavy anchor; a referenced aspect the piece centers on weighs high; a passing mention weighs low. The spread across references is what makes the continuous slider glide (§5). Config-tunable, never hard-coded.
- **role** — provenance of the dated aspect (publish / album_ref / song_ref / event_ref / tour_ref / person_ref). Any dated aspect the content references, not albums alone.
- **source** — `inferred` (heuristic default, recomputed each export) or `curated` (curator-set, persisted, never clobbered — see §3.4).

### 3.2 The bucket config (committed, edited per revision)
A small committed `era-buckets.json`, imported next to `vocabulary.json`. Maps date-range → label. **This is the only file Mike edits on each of the ≥3 revisions.** Editing it changes nothing about the artifacts.

```jsonc
[
  { "label": "Early Days",        "start": 2016, "end": 2018 },
  { "label": "Finding the Sound", "start": 2019, "end": 2020 },
  { "label": "Breakthrough",      "start": 2021, "end": 2022 },
  { "label": "On the Road",       "start": 2023, "end": 2024 },
  { "label": "Recent",            "start": 2025, "end": 2025 }
]
```
`rwth` is dropped — it folds into Early Days by date.

### 3.3 Inputs, where they live and why

| Datum | Lives in | Rationale |
|---|---|---|
| Per-artifact weighted date-set | `hunter_root.json` record (export-baked) | Flows through existing `buildDimensions` reduction; multi-value matcher consumes it unchanged. |
| Reference dates (album / song / event / tour / person) | `era-config.json` registry, read by export | Broadened from album-only: carries dates for every reference type the content can cite. Changes rarely; version-controlled next to bucket ranges. |
| Bucket ranges | `era-buckets.json` (committed, client-imported) | Edited per revision; client maps at read, so edits never recompute artifacts. |
| Curated centrality weights (override) | `referenced_dates` nullable JSON column on `artifacts` | Smallest possible migration. Holds curator-set weights only; inferred weights are recomputed, not stored. Most leaves leave it null. |

### 3.4 Hybrid centrality: inferred default, curated override
Centrality weights are assigned **hybrid**, matching how era already works (derivation proposes, curation is king):

- **Inferred (default):** the ingestion pass infers a centrality weight for every dated reference from content signals (subject-vs-aside, mention frequency, position/headline). This is what makes "dump URLs at will" work — nothing blocks on a human. Inferred weights are ephemeral: recomputed on each export, not stored.
- **Curated (override):** the curator can set an explicit weight on the references that matter. Same authority as a manual `era:` tag. A curated weight is **durable** — persisted and never recomputed away.
- **Storage split:** curated weights live in the `referenced_dates` column (§3.3); inferred weights are not stored. Most leaves carry no override and ride the inferred set entirely.

---

## 4. Derivation and render flow

### 4.1 Export side (computes the set, not the era)
1. **Collect dates per leaf:** publish year from `post_date` (heavy anchor); the year of every dated aspect the content references — album, song, event, tour, dated person — sourced from the `era-config` registry. Each reference gets an **inferred centrality weight** from content signals. Then apply any curated weights from `referenced_dates`, which override the inferred values.
2. **Fallback:** if no `post_date`, the referenced aspects seed the set (carries the 13-of-15 rwth case that has no `post_date` — see §6).
3. **Bake the weighted date-set** onto the record, each entry tagged `source=inferred|curated`. Do NOT collapse to an era label.

### 4.2 Client side (maps at module load)
1. **In or beside `buildDimensions`:** for each artifact, read its weighted date-set, apply the current slider threshold, map surviving dates through `era-buckets.json`, and produce `tags.era = [...]` — one or more values.
2. **Slider threshold (continuous):** the slider sets one weight cutoff. Keep every date with weight ≥ cutoff; map those to buckets. High cutoff → only the publish anchor survives → one era. Low cutoff → all references survive → all touched eras. Smooth across its travel.
3. **Downstream unchanged:** `matchFilter` and `BOARD_COLUMNS` consume `tags.era` by the same string-set membership test as every other facet.

**Net per bucket revision:** edit `era-buckets.json` → rebuild. No MV write, no export recompute, no artifact churn. When Medusa's Disco lands, its records carry their own date-sets and flow through the identical mapping; buckets absorb them without touching Hunter Root's records.

---

## 5. The depth slider (net-new UX surface)

**Flag:** the only piece of the design with no governing spec and no prior art. Verified — the only sliders in canon are Kaleidoscope's Depth (deep-cuts-vs-hits) and Weirdness (visual intensity); neither governs era. This control is new and is Mike's to shape.

- **Function:** a continuous control setting one weight cutoff on the date-set before bucket mapping. Not stepped — the cutoff moves smoothly; references drop out one at a time in centrality order as it travels.
- **Travel:** top of travel → publish era only (only the heavy anchor clears the cut). Bottom → all referenced eras. "Shallow / medium / deep" name regions of this single axis, not discrete modes.
- **Default + sticky:** opens at medium (mid-travel) on first load; persists the visitor's last setting across sessions.

**What makes it glide is the weight SPREAD, not the widget.** A continuous slider only produces continuous behavior if the centrality weights are spread across the range. If every reference shares one weight, the slider is continuous but the result snaps — nothing changes until the cutoff crosses that single value, then everything drops at once. The hybrid centrality model (§3.4) supplies the spread: each reference is weighted by how central it is, so distinct references clear the cut at distinct cutoffs. **Calibrating the inference heuristic to produce well-spread weights is the Ops job that delivers the "Dolby knob" feel** — specced as a requirement here (§7), tuned against a live preview, not pinned to constants now.

- **Open for Mike at build time (not blocking this spec):** slider resolution/granularity, exact medium detent position, label. Continuous, medium default, and sticky are decided.

---

## 6. Verified facts carried forward (live MV, this session)

- **rwth fold:** the stray `era:rwth` value (15 artifacts) folds into Early Days. Six era values collapse to five. 13 of the 15 have no `post_date`, so the album-reference fallback (§4.1 step 2) is what gives them a date at all.
- **Two underivable leaves:** exactly 2 leaves have no `post_date`, no dated reference, no override. The export MUST emit a warning listing them — era is hard-required on leaves, so they cannot ship silently era-less.
- **`released_at` correction:** `released_at` is the museum-release timestamp, NOT a content date. Not a derivation input. `post_date` is the only real content date today — which is why the reference-date registry is the gating data work.
- **Curation override:** a manual `era:` tag set by the curator overrides the derived set. Era stays curation-is-king; derivation is the high-quality default, not a straitjacket.
- **Containers exempt:** derivation is leaves-only; the 10 album/gallery containers carry no era.

---

## 7. Open items before build

**Ops-resolvable (Claude, via Cowork — not blocking Mike):**
- Exact insertion point: extend `buildDimensions` in-place vs a sibling transform it calls.
- Reference-date registry population: source years for every dated aspect (album, song, event, tour, dated person), broadened from album-only (`era-config.json`).
- Centrality inference heuristic: build the ingest-time pass that infers a centrality weight per reference from content signals (subject-vs-aside, mention frequency, position/headline). Calibrate so weights are well-SPREAD across the range — this is what makes the continuous slider glide rather than snap (§5). Tuned against a live preview, not pinned to constants.
- Curated-override plumbing: ensure the export reads `referenced_dates` weights and lets them override the inferred values without being recomputed away (§3.4).
- Sticky-persistence mechanism: confirm where the slider's last value is stored in the deployed exhibit. Browser storage is unavailable in the artifact sandbox, but the deployed Worker path may differ — verify against the live tree before speccing the store. Do not assume localStorage.

**UX-facing (Mike — when reviewing the slider build, not now):**
- Slider resolution/granularity, exact medium detent, label (§5). Continuous, medium default, and stickiness are decided.

---

## 8. Sequence

1. Place v0.2 authority (.docx + this .md) in `docs/`; mark v0.1 .md superseded (paper-only). — host, Mike.
2. Build (from scratch — no v0.1 code exists): schema column + `era-config` broaden + `era-buckets.json` + export bakes weighted date-set + inference heuristic + client mapping + slider.
3. Pre-test gate (Cowork, no push/deploy): the 2 underivable leaves; all 15 rwth → Early Days; **derive-at-shallow reproduces the 37 existing hand-applied `era:` tags (0 mismatches) — correctness proof**; weight-spread histogram; filtered in-MV preview for Mike.
4. Mike renders preview, deploys host-side.
5. Then run the 16-URL press batch through the finished pipeline.
6. Medusa's Disco import (gated behind Hunter Root streaming approval) plugs into the same mapping later — flagged, not blocking.
