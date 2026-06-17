# Derived-Era v0.2 — Build + Pre-Test Report

**Date:** 2026-06-17 · **Mode:** Cowork (build + pre-test only) · **Authority:** `docs/derived-era-spec_v0.2.docx` / `derived-era-spec_v0.2.md`
**Hard rule honored:** NO push, NO deploy. Live MV migrated in place; nothing rendered or shipped. Stop at this report.

---

## 1. Headline — the two gates (report these first)

**CORRECTNESS PROOF — PASS.** Derive-at-shallow reproduces **all 37** hand-applied `era:` tags in live MV, **0 mismatches**. The model is not wrong: at the top of the slider every leaf lands in exactly the era a human assigned it.

**rwth fold — PASS.** All **15** `era:rwth` leaves derive to `['early_days']` at shallow (14 have no `post_date`; they reach Early Days via the `run_with_the_hunt` → 2016 album-reference fallback, exactly as spec §4.1 step 2 intends). Six era values collapse to five; `rwth` is gone.

```
── CORRECTNESS PROOF (derive-at-shallow reproduces hand era: tags) ──
  Hand-tagged leaves checked: 37   Mismatches: 0
── rwth fold (era:rwth → Early Days) ──
  era:rwth leaves: 15   not folding to early_days: 0
```

## 2. Weight-spread histogram (the calibration target, spec §5)

389 baked weights across 187 leaves, **70 distinct values**, range **0.77–2.00**:

```
0.7-0.8  # 1
0.9-1.0  ## 2
1.0-1.1  ####### 7
1.1-1.2  ######## 8
1.2-1.3  ###################### 22
1.3-1.4  ################ 16
1.4-1.5  ################################################## 50
1.5-1.6  ###################################################################### 97
1.6-1.7  ################ 16
1.7-1.8  ########## 10
1.8-1.9  ########## 10
1.9-2.0  ############################################################### 63
2.0-2.1  ###################################################################### 87   <- publish anchor (by design)
```

**Read this honestly:**
- The spike at **2.0 (87)** is the publish anchor — fixed-heavy by design (spec §3.1). It is *supposed* to be a spike; it is what makes the top of the slider resolve to publish-only.
- The remaining mass (302 references) spreads 0.77–1.9 with no single dominating value — a real continuous spread, not the "clumped to 2–3 values" failure mode the spec warns about.
- The bulge around **1.5–1.6 (97)** and **1.9–2.0 (63)** is the **album-track monoculture**: ~148 of the 187 leaves are album tracks, each a single own-album reference. They legitimately cluster near the top because every track is maximally central to its own album. **These are single-date leaves — behaviorally inert for the slider** (their lone date always survives any cutoff), so the cluster does not hurt the glide.

**Glide profile** (total era memberships as the cutoff sweeps 1.0 → 0.0): a smooth, gradual climb — references peel in a few at a time, not all at once:

```
1.0:187  0.9:195  0.8:202  0.7:207  0.6:210  0.5:216  0.4:217  0.3:217 ...
```

**Tuning flag (spec §5 explicitly leaves this to live-preview iteration):** the active region is the **upper ~60% of travel** (cutoff 1.0 → 0.4); the bottom 40% is currently inert because the lowest reference weight is ~0.77 (clears at cutoff ≈ 0.39). If you want the whole travel live, the lever is in `tools/era-derivation.mjs` `CENTRALITY`: lower `roleBase`/`richStep` so weak references (passing event/tour mentions) fall toward 0.2–0.4 and clear near the bottom. The medium detent (default 0.5) sits squarely in the active zone, so first-load feel is unaffected. I tuned for a defensible starting spread, not a final answer — per the spec, this is meant to be tuned against your rendered preview.

## 3. The "2 underivable leaves" — a truth-ranking divergence to know about

Spec §6 says "exactly 2 leaves have no post_date, no dated reference, no override," and the brief's warning guard "Expected: exactly 2." **Against live MV today the actual count is 0.** Every no-`post_date` leaf now carries a datable `album:` reference (the 2026-06-11/12 bulk track ingestion gave every previously-bare leaf an album tag, and the registry dates all 10 albums). The spec's "2" predates that ingestion. Per the project truth-ranking (**live tree > docs > brief**), I report the real number: **0 underivable** — every leaf ships with an era. The warning guard is built and will fire if that ever changes.

(If you decide `rarities` should "contribute no era" — the v0.1 report floated this for the singles/rarities grab-bag — set its `year` to `null` in `era-config.json`; that makes 7 undated rarities tracks underivable and the guard will list them. Your call; flagged below.)

## 4. Filtered in-MV preview (inspect before render)

Per-leaf dates + era at each depth: **`docs/derived-era-pretest-preview.json`**.
Full dated export (what `hunter_root.json` becomes after you re-export): **`docs/hunter_root.dated-preview.json`**.

Era membership counts per depth (Early Days / Finding the Sound / Breakthrough / On the Road / Recent):

| Depth | early_days | finding_the_sound | breakthrough | on_the_road | recent | multi-era leaves |
|---|---|---|---|---|---|---|
| shallow (publish only) | 39 | 36 | 20 | 42 | 50 | 0 |
| medium (default) | 40 | 40 | 20 | 66 | 50 | 29 |
| deep (all eras) | 40 | 40 | 20 | 67 | 50 | 30 |

At shallow every leaf sits in exactly one era; as you deepen, ~30 press/interview leaves pick up the referenced eras their content points at (e.g. a 2025 interview about a 2020 album gains *Finding the Sound* alongside *Recent*).

---

## 5. What was built (all 8 steps)

| Step | Deliverable | Status |
|---|---|---|
| 1 | `referenced_dates` nullable JSON column on `artifacts` | **Applied to live MV** (backup `…bak-REFDATES-20260617…`; all 280 rows NULL; integrity ok). Re-runnable: `tools/migrate-referenced-dates.mjs`. |
| 2 | `era-config.json` reference-date registry (album/event/song/tour/person) | **Built** at repo root. 10/10 albums dated from MV's own `year:`/`post_date` signals; events dated (low-confidence, generic categories); songs inherit album; tour/person sparse (none in MV) — coverage table inline in the file. |
| 3 | `era-buckets.json` committed client config | **Built** at `src/data/era-buckets.json` — the 5 locked buckets. The one file you edit per revision. |
| 4 | Export bakes weighted `dates` (leaves only) | **Built** in `tools/export-artifacts.mjs` + `tools/era-derivation.mjs`. Era label no longer baked; `dates:[{year,weight,role,source}]` baked per leaf; containers exempt via cardKind; `released_at` confirmed NOT a date input; warning guard emits underivable leaves. |
| 5 | Centrality inference heuristic | **Built**, tunable (`CENTRALITY`), spread signals = role · headline position · mention frequency · subject-vs-aside · own-album subject · text-richness · crowding. Histogram above. |
| 6 | Client maps dates→buckets at module load | **Built** in `src/routes/hr/hr_era.js` + wired into `HrExhibitFlow.jsx`. `matchFilter` unchanged (confirmed it already loops `tags.era` as a string array). Curator `era_override` and legacy `tags.era` both honored. |
| 7 | Continuous depth slider | **Built** in the filter overlay — native continuous range, default medium, **sticky via `localStorage`** (key `wb-hr-era-depth`, the verified deployed-exhibit persistence path; guarded for SSR/sandbox). UX polish (resolution/detent/label) left to you per spec §5. |
| 8 | Pre-test gate | **This report** (`tools/era-pretest.mjs`). |

**Files added/changed (all on `origin/main` working tree, uncommitted, not pushed):**
`era-config.json`, `src/data/era-buckets.json`, `src/routes/hr/hr_era.js`, `tools/era-derivation.mjs`, `tools/migrate-referenced-dates.mjs`, `tools/era-pretest.mjs`, `tools/export-artifacts.mjs` (edited), `src/routes/hr/HrExhibitFlow.jsx` (edited), `src/routes/hr/HrExhibitFlow.css` (slider styles), plus the two preview JSONs in `docs/`. `vocabulary.json` and the committed `src/data/exhibits/hunter_root.json` were left **unchanged**.

## 6. Decisions I made that are yours to confirm

1. **Legacy era: tags are treated as derivable, not overrides.** The 37 existing `era:` tags are reproduced by derivation (proven, 0 mismatches), so the export strips them and derives instead — otherwise the slider would do nothing for those 22 leaves. Deliberate future overrides ride a new explicit channel (`referenced_dates.era_override`), which no live row uses yet. This resolves the v0.1 report's open "manual-override marker convention." If you want existing hand tags to stay frozen instead, say so.
2. **`rarities` is dated (2024, its plurality year), not era-less.** Keeps the build at 0 underivable. Flip to `null` in `era-config.json` if you prefer it contribute no era (per the v0.1 proposal).
3. **`medusas_disco` anchored to 2020 / Finding the Sound** (phase-anchor per spec), not the 2022 crossover.
4. **Calibration is a starting point**, tuned for spread but with an inert bottom-40% of slider travel — flagged above for your live-preview tuning.

## 7. To render + deploy (host-side, your steps)

1. Re-run the export against live MV to bake `dates` into the committed deck data: `node tools/export-artifacts.mjs` (your Windows `better-sqlite3` build; needs MV running) — or `node --experimental-sqlite tools/export-artifacts.mjs --mv-file <path>`. Until then the deck falls back to the legacy baked era (slider inert) — nothing breaks.
2. `npm run build` / dev-server, open the Hunter Root exhibit, open Filters, exercise the **Era depth** slider.
3. Verify the regression and feel; tune `CENTRALITY` if you want a livelier bottom half; deploy when satisfied.

*Environment note: this Cowork run is Linux; your `better-sqlite3` is a Windows binary, so the export and pre-test ran via Node's built-in `node:sqlite` (a fallback I added to the export — your native path is unchanged). The pre-test uses the exact `deriveDates` (export) and `deriveEraSlugs` (client) the build ships, so the proofs are against real code paths.*
