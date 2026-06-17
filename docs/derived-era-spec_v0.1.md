> **SUPERSEDED by derived-era-spec_v0.2 (2026-06-16).** Paper-only — v0.1 was never built; no code to unwind.

# Derived-Era / Weighted-Date Spec — v0.1 (DRAFT for Mike)

**Date:** 2026-06-16
**Owner:** Mike (curation/decisions) · Claude (drafting/build support)
**Status:** DRAFT — proposed for Mike's confirmation. Nothing built or retagged here.
**Relation to existing specs:** extends `discovery-metadata-spec.md` v0.2.1 §5 (Era). Era buckets/ranges are inherited from there and are **not** re-opened by this doc.

---

## 0. One-line statement

Era stops being a hand-applied tag and becomes **derived** from a per-artifact **weighted set of dates** (its publish date plus any referenced/applicable dates — e.g. the album it discusses). A modern interview about a historical album lands in the **album's** era because the album reference out-weights the publish date. Album-vs-publish is just the 2-date degenerate case.

---

## 1. What is true today (grounded on live tree, 2026-06-16)

- **Era is a stored tag**, namespace `era:` inside `artifacts.tags` (a JSON string array). `tools/export-artifacts.mjs` **passes tags through verbatim** (groups by namespace, L340–373); it computes **no** era. So this is era logic to **add**, not replace.
- **The artifact carries exactly one usable content date today: `post_date`** (DATE, with `post_date_confidence` enum). *Correction to the 2026-06-16 handoff:* `released_at` is **not** a content date — it is the museum-release timestamp (e.g. `2026-05-25T13:30:56`, when the curator released the card). It is **not** a derivation input. (Truth ranking: live tree > docs.)
- **No album/event release dates exist anywhere structured.** 15 `album:` slugs, ~8 `event:` slugs, 9 coarse `year:` slugs — none carry a date. The referenced-date source must be **created**; that is the real gating work (§3).
- **Era distribution in MV today:** `era:rwth` 15, `on_the_road` 9, `recent` 4, `breakthrough` 3, `finding_the_sound` 3, `early_days` 3 — i.e. six values live, including the stray `rwth` the handoff flags for folding.
- **Era is `total` / single-value / hard-required on leaves; containers exempt** (spec §5, §3). Derived era must preserve this: exactly one bucket per leaf, none on containers.

---

## 2. Data shape — the core decision

The weighted date set splits into two layers. They live in different places for good reasons.

### Layer 1 — Entity date registry (`era-config.json`, read by export)

A single git-tracked config the export reads. Holds **both** the locked era buckets **and** the album/event → date registry. No schema migration; reference data (~23 rows) that changes rarely and belongs in version control next to the bucket ranges.

```jsonc
{
  "buckets": [
    { "id": "early_days",        "label": "Early Days",        "start": "2016-01-01", "end": "2018-12-31" },
    { "id": "finding_the_sound", "label": "Finding the Sound", "start": "2019-01-01", "end": "2020-12-31" },
    { "id": "breakthrough",      "label": "Breakthrough",      "start": "2021-01-01", "end": "2022-12-31" },
    { "id": "on_the_road",       "label": "On the Road",       "start": "2023-01-01", "end": "2024-12-31" },
    { "id": "recent",            "label": "Recent",            "start": "2025-01-01", "end": "2099-12-31" }
  ],
  "album_dates": {
    // slug : { date, confidence, note }  — see §5 for the drafted table
    "run_with_the_hunt": { "date": "2016-06-30", "confidence": "anchor" }
    // ...
  },
  "event_dates": {},          // optional, deferred (§5.3)
  "alias": {                  // slug variants → canonical (§5.1)
    "crooked": "crooked_home", "skipping": "skipping_stones_that_sink_before_theyre_thrown",
    "dandelions": "mimicking_the_sun_like_dandelions", "wheel": "life_inside_a_wheel",
    "cracked": "they_finally_cracked_me"
  }
}
```

### Layer 2 — Per-artifact overrides (`referenced_dates`, one new nullable column)

For the rare artifact whose weighted set isn't fully captured by "publish + tagged albums," add **one additive nullable JSON column** on `artifacts`, parsed in export exactly as `notes` already is:

```jsonc
referenced_dates = [
  { "date": "2017-06-30", "weight": 2.0, "role": "subject_album", "source": "rwth reissue piece" }
]
```

This is the smallest possible migration (one nullable column, no backfill, no CHECK change). Most leaves will leave it null and derive entirely from Layer 1 + their existing `album:` tags.

### Rejected alternatives (and why)

- **Tag-convention** (`refdate:2019-06-01|w=0.5` inside the tags blob): looks migration-free but is the worse engineering choice. Every distinct date becomes a high-cardinality slug in the `tags` usage_count table, and `refdate:`/date slugs would have to be stripped from the discovery facets the way `exhibit:` is. String-encoded weights need parsing anyway. Net: more downstream cost than a clean column.
- **Full side table** `artifact_dates(...)`: the "correct" long-term shape if album/event dates grow into entities with their own lifecycle, but it forces a second query/join in export and two-table writes in every ingestion script — heavier than 22 leaves + 16 press need now. Revisit if the registry outgrows a config file.

---

## 3. The referenced-date source (open Q2, now answered as a plan)

"Tagged to an album is enough to put you in an era" works **only if albums carry dates.** The plan:

1. Albums get dates from the **`era-config.json` registry** (Layer 1), drafted in §5 from MV post_date anchors + public release dates, **Mike-confirmed**.
2. An artifact's existing `album:` tag is the **pointer** — no per-artifact date entry needed. The export joins `album:<slug>` → `album_dates[slug].date` at build time.
3. Only genuinely odd cases (a reference to something with no album tag) use the Layer-2 `referenced_dates` column.

So in the common case the weighted date set is **derived from tags that already exist** + the registry. Minimal hand-entry.

---

## 4. Derivation algorithm

Runs in `buildArtifactRecord` (`export-artifacts.mjs`), **leaves only** (skip when `isChild` or `cardKind` is a container — the builder already knows this).

**Step 1 — assemble the weighted date set** `D = {(date_i, weight_i)}`:

- **Publish contributor:** `(post_date, W_PUBLISH)`.
- **Album contributors:** for each `album:<slug>` tag (after alias-canonicalization) present in `album_dates`: `(album_date, W_ALBUM_REF)` — where `W_ALBUM_REF` depends on Kind (below).
- **Override contributors:** each entry in the `referenced_dates` column with its explicit weight.

**Step 2 — album weight, conditioned on Kind *and* on whether a publish date exists:**

| Case | `W_PUBLISH` | `W_ALBUM_REF` | Effect |
|---|---|---|---|
| Kind ∈ {interview, press, review} (commentary *about* music) | 1.0 (if dated) | **2.0** | album reference wins → lands in album's era |
| No `post_date` (album is the only date signal) — **fallback** | 0 | **1.0** | album seeds era when publish can't (covers dateless album tracks) |
| Primary kind (performance/release/studio/announcement/candid/fan) **with** a `post_date` | 1.0 | 0.0 | publish wins (publish ≈ album era anyway) |

Rationale: a press piece *about* a release is, by intent, of that release's era (consistent with the §5 "2025 retrospective about the early days belongs in Early Days" note and Mike's release-support tagging rule). A primary artifact published contemporaneously stays in its publish era. **But** an artifact with no `post_date` (e.g. an undated album track) must still get an era — there the album reference is the *only* signal and seeds it. This three-way rule was added after verification: 13 of the 15 `era:rwth` artifacts have **no `post_date`**, so a publish-only rule would have left them era-less and broken hard-required-on-leaves. Weights are config-tunable, not hard-coded.

> **Verification result (2026-06-16, simulated against live MV):** with this rule, **196 leaves resolve to exactly one bucket**; the derived era **matches every existing hand-applied era tag** (0 mismatches, excluding `rwth` which is the intended fold); **all 15 `era:rwth` → Early Days**; the bimodal case (2025 interview tagged `run_with_the_hunt` → Early Days) and its control (2025 *performance* tagged `run_with_the_hunt`, dated → Recent) both behave as intended. Only **2 leaves** are truly underivable (no date *and* no dated album) — see Step 5.

**Step 3 — bucket by weighted vote (NOT weighted mean):**

Each `(date_i, weight_i)` casts `weight_i` into the bucket its date falls in. `era = argmax(bucket_totals)`.

> Weighted **mean** is explicitly wrong for the bimodal case: a 2025 interview about a 2016 album would average to ~2020 (Finding the Sound) — between both, in neither. Weighted **vote** puts the full album weight into Early Days and the publish weight into Recent; argmax = Early Days. Correct, and it can never land an artifact "between" buckets.

**Tiebreak (deterministic):** if two buckets tie on total weight → the bucket containing the single highest-weighted date wins; if still tied → the **earlier** bucket wins (favors the referenced/subject era over the publish era). Documented so output is stable across runs.

**Step 4 — curation override wins.** If the MV artifact carries a **manual** `era:` tag (curator-set), that value **overrides** the derived one. Era remains curation-is-king (§7); derivation is the high-quality default/seed, not a straitjacket. (Mechanism for distinguishing "manual" from "previously-seeded" era tags is a build detail — simplest: a `era_locked` attribute tag or a `confidence_flags` marker; resolve at build time.)

**Step 5 — underivable leaves (hard-required guard).** A leaf with no `post_date`, no dated album reference, and no `referenced_dates` override cannot derive an era. Live MV has exactly **2** such leaves. The export must **emit a warning listing them** (it must not silently drop them or emit a blank era, which would re-introduce the total-facet-gap bug §5 warns about). The curator sets a manual `era:` on those 2. `rarities` and `phone_recordings_ep` carry no registry date by design (§5.1), so a leaf whose only album is one of those falls here too.

**Output:** the single resolved bucket id is written as `era:<id>` into the record's grouped tags, replacing any stale/derived era. Containers emit no era.

---

## 5. Drafted album date registry — FOR MIKE TO CONFIRM

Anchored on MV `post_date` spread per `album:` tag (empirical) + public release dates where verified. `confidence`: **verified** = external release date found; **anchor** = MV post_date mode; **flag** = needs Mike.

### 5.1 Canonical albums (variants folded via `alias`)

| Canonical slug | Album | Registry date | Bucket | Confidence | Note |
|---|---|---|---|---|---|
| `run_with_the_hunt` | Run With The Hunt | 2016-06-30 | Early Days | anchor | Prior **band**, pre-solo. Folds the stray `era:rwth` (15) into Early Days automatically. |
| `they_finally_cracked_me` | They Finally Cracked Me | ~2018 | Early Days | flag | MV spread 2018–2024 (n=3) — likely early release w/ later rarities. Confirm date. |
| `mimicking_the_sun_like_dandelions` | Mimicking the Sun Like Dandelions | ~2020 | Finding the Sound | anchor | MV mode 2020 (min 2018). |
| `life_inside_a_wheel` | Life Inside A Wheel | 2019 | Finding the Sound | anchor | MV 2019; Bandcamp page exists. |
| `medusas_disco` | Medusa's Disco | 2019–2020 phase | Finding the Sound | **flag** | Prior **band**, not a single LP. Spec §5 anchors the *phase* to Finding the Sound; one web source shows a **2022** MD album, which would straddle into Breakthrough. **Mike: which date governs the slug?** |
| `skipping_stones_that_sink_before_theyre_thrown` | Skipping Stones That Sink Before They're Thrown | 2021 | Breakthrough | anchor | MV tight 2021. |
| `arkansas` | Arkansas | 2023 | On the Road | verified | Discogs/Whiskey Riff 2023; dedicated to late brother Nick. (One source: 2023-06-30.) |
| `crooked_home` | Crooked Home | 2025-10-17 | Recent | verified | Shore Fire / Apple Music; Tolok Records. |
| `phone_recordings_ep` | Phone Recordings EP | — | — | flag | No dated artifacts in MV. Confirm or exclude. |
| `rarities` | Rarities | — | **(no era contribution)** | flag | Compilation; MV spread 2020–2025. Proposed: rarities tag contributes **no** referenced date (grab-bag). Confirm. |

### 5.2 Two band-vs-album items needing a Mike call

`run_with_the_hunt` and `medusas_disco` are prior **bands** living as `album:` values (spec §6 flags this). For era purposes they still anchor cleanly (RWTH→Early Days; MD→Finding the Sound per §5). No promotion to Project needed for this work — flagged only so the dates are read as *phase anchors*, not LP release dates.

### 5.3 Events (deferred)

Event coverage is almost always contemporaneous (artifact published around the event), so publish-date already lands it correctly. Proposed: **no event_dates registry in v0.1** — add later only if retrospective event coverage appears. Confirm.

---

## 6. Build scope (what this becomes, after Mike confirms §5)

1. `era-config.json` — buckets (from §5 / spec §5) + confirmed `album_dates` + `alias`. **New file, git-tracked.**
2. One nullable `referenced_dates` TEXT column on `artifacts` (additive; no backfill). **Smallest migration.**
3. Derivation function in `buildArtifactRecord` — leaves-only; weighted-vote; Kind-conditioned weights; curation override; folds `era:rwth`. **One-file change in `export-artifacts.mjs`.**
4. Regenerate `hunter_root.json` + `vocabulary.json` via `npm run export-artifacts` (MV running). Preview filtered in MV. Then deploy.

**Not** a filter-engine change. **Not** a destructive migration. **Not** a retag of every artifact (era becomes derived; manual era tags become optional overrides).

---

## 7. Open items for Mike (load-bearing, plain bullets)

- **§5 registry dates** — confirm the table, especially the two **flags**: `medusas_disco` (Finding the Sound phase vs. a real 2022 album date that crosses into Breakthrough) and `rarities` (contributes no era — agree?).
- **Weights** — agree with `W_ALBUM_REF = 2.0` for interview/press/review and `0.0` for primary kinds? (Tunable in config; this is the dial that controls how hard a referenced album pulls era.)
- **Override mechanism** — how a *manual* era tag is distinguished from a derived one so curation still wins (proposed: an `era_locked` marker). Your call on the convention.

Nothing is built until you confirm these three.
