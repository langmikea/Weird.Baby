# Filter pop-over (v7_1 look) — Cowork run report

**Stamp:** 2026-06-16 · Cowork sandbox · repo HEAD at entry `8b9a897`
**Brief:** `filter-popover-v7-cowork-brief.docx` (visual-first revision)
**Status:** Built + pre-tested in-sandbox (static, lint-parity, logic, + standalone visual preview). **NOT committed, NOT deployed** — awaits Mike's host render + UX eyes per the brief's hard rule.

---

## What Mike gets

A **filter icon** in the deck strip (replacing the old "Filters" text tab) that opens a **centered pop-over overlay** above the static museum, painted in the v7_1 reference look and populated with the **live Hunter Root facet data**. This is the brief's visual-first deliverable: "a Filter Icon to open a pop-over screen that looks like v7 but with the correct information."

UX fork settled by Mike this session (the one genuine fork the brief left open): **filter icon → centered overlay** (vs. re-skinning the docked tab in place, or a floating museum icon).

---

## Files changed

| File | Change |
|------|--------|
| `src/routes/hr/HrExhibitFlow.jsx` | +`DETAIL_COLUMNS` / `HRFI_FORMAT_ICONS` derivations (module load); +`FilterInstrumentOverlay` component (the v7_1 skin); +`filterOpen` root state; +overlay render at root; rerouted the `board` tab to a filter **icon** that opens the overlay (was a text tab expanding the deck body); board tab width 120→56. |
| `src/routes/hr/HrExhibitFlow.css` | +119 selectors, all prefixed `.hrfi-` and namespaced under `.hrfi-overlay`. The 1883-line deck CSS above is untouched. |

**Backups (`.pre-<tag>` convention):**
`HrExhibitFlow.jsx.pre-v7popover-20260616T020045Z` and `…css.pre-v7popover-20260616T020045Z`.
Rollback = restore those two files.

---

## The real data it renders (verified live this session)

Resolved by the actual `buildDimensions()` against the committed `hunter_root.json` (HEAD). Every value + at-rest count below was machine-checked (38/38 count assertions pass in the preview's engine, which mirrors `matchFilter`):

**Basic board — the 5 TOTAL facets, in renderBoard order**

| Facet | Values (count) |
|-------|----------------|
| Kind (`content_kind`) | announcement 6 · candid 3 · cover 1 · music 5 · performance 5 · press 1 · studio 1 — **7, "other" suppressed** (container-only) |
| Topic | family 2 · gear 1 · influences 5 · recording 2 · songwriting 7 · touring 5 (6) |
| Era | breakthrough 3 · early days 3 · finding the sound 3 · on the road 9 · recent 4 (5) |
| Project / Band (`bands`) | Hunter Root 32 (1) |
| Format | photo 2 · text 4 · video 10 · web 6 (4) |

**Detail Filtering — the live partials** (`album`/`source`/`people`)

| Facet | Values |
|-------|--------|
| Album | 10 values (Arkansas, Crooked Home, Life Inside A Wheel, Medusas Disco 3, … Run With The Hunt 3, …) |
| Source / Platform | instagram 2 · other 1 · reverbnation 5 · tiktok 1 (4) |
| People | Nick Root 1 |

**Skipped:** `song` and `venue` are untagged in the live export → null-exempt, rendered as nothing (brief §3). **Note:** the brief listed a `facebook` source value; HEAD has none (only the four above) — the pop-over shows the live set.

---

## Verification done in-sandbox

- **Lint parity (apples-to-apples, single-file, same linter):** pre-edit backup = **2 errors / 2 warnings**; post-edit = **2 errors / 2 warnings**. Zero new. (Both errors — `deckW`, `totalCount` — are pre-existing and outside the edit.)
- **Parse:** eslint's espree accepts the edited file end-to-end (no parse error) → valid JSX.
- **CSS:** braces balanced (357/357); the v7_1 block appends cleanly after line 1883.
- **Engine untouched:** `matchFilter` / `itemHasTag` / `PillGroupColumn` / `countForPill` are byte-identical to the backup. The overlay is a presentation layer over `selected` + `toggle(group,value)` + `countForPill` — the proven plumbing.
- **Data/logic:** board order, "other" suppression on Kind, partials in the Detail zone, absent facets skipped — all confirmed against `buildDimensions(HEAD)`.
- **Standalone visual preview:** `filter-popover-v7_1-preview.html` (interactive, real data) — open it to eyeball the v7_1 look before the host render. Also rendered inline in the Cowork chat this session.

**Could NOT do in-sandbox:** the real `npm run dev` / `npm run build` render + screenshot (workerd + rolldown are Windows binaries; CLAUDE.md §9). That's yours to run — checklist below.

---

## Fidelity / engineering notes you may want to rule on

1. **Strict engine, honest copy.** The v7_1 reference's prose ("scopes … leaves the rest in view," the "held-safe" count) describes a *partial-exempt* match model the **live `matchFilter` does not implement** — it is strict (select a partial and non-matching items drop). The brief says never touch `matchFilter`. So I reproduced the v7_1 *look* but wrote the Detail banner copy accurately ("narrow to one specific item") and omitted the misleading "scopes" tag/notes. If you actually want partial-scoping behavior, that's an engine change — out of scope (landmine-class).
2. **Live selection, not a staged commit.** Toggling a chip updates the wall immediately (the deck's existing model). "apply" just closes; "cancel" reverts to the selection as it was when the pop-over opened. Player state is never touched.
3. **Mobile.** The deck strip (and the filter icon) is hidden below 720px by the existing O11 rule; mobile keeps its current inline-pills fallback. The v7_1 overlay is a desktop surface (its `@media` only adjusts it if shown). Flag if you want a mobile pop-over too.
4. **The icon's ✕** clears the 5 board facets (Stage A `clearTab` semantics); the pop-over's "clear all" clears everything including the Detail partials.

---

## Host-side checklist (Windows)

```
cd <repo>
git diff --stat -- src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css

npm run lint            # expect the repo baseline (4 err / 6 warn), zero new

npm run dev             # open /hr
#  - deck strip shows a FILTER ICON where "Filters" used to be
#  - click it -> centered v7_1 pop-over over the museum (dimmed backdrop)
#  - Basic board: Kind(7, no "other") Topic(6) Era(5) Project/Band(1) Format(4)
#  - "Detail Filtering" expands -> Album(10) Source(4) People(1)
#  - Threads: "Years past" / "Surprise me" (your two factory presets)
#  - toggle chips -> wall narrows live; counts update; the jukebox keeps playing
#  - Escape / ✕ / backdrop / cancel all dismiss; apply closes

npm run build           # must pass

# screenshot; if the look matches v7_1, commit + deploy (your call)
```

**Out of scope / untouched:** `matchFilter` + `itemHasTag` (engine), `PillGroupColumn`, `PresetsContent`, the existing 1883-line deck CSS, the mobile pill fallback. No commit, no push, no deploy performed.

---

## Sandbox note (for the next session)

The `Edit` tool truncated both files mid-build (FUSE byte-count-preserve quirk, CLAUDE.md §"sandbox quirks" #1). Recovered by reconstructing from the `.pre-v7popover` backups and writing via the `rm + write` Python pattern. Final files verified intact (`wc -c`, `tail`, eslint to EOF). For edits that grow these large files, prefer the rm+write pattern from the start.
