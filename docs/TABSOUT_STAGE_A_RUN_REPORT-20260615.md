# TABS-OUT — Stage A run report (Board shell)

**Stamp:** 2026-06-15 · Cowork sandbox · repo HEAD at entry `8b9a897`
**Brief:** `tabs-out-board-cowork-brief.docx` (carried 2026-06-15)
**Scope of this report:** Stage A only — *Board shell (visible win)*. Stages B/C/D not started.
**Status:** Built + pre-tested in-sandbox (static + logic). **NOT committed, NOT deployed** — awaits Mike's render + UX eyes per the brief's guardrail.

---

## What changed

One file touched: `src/routes/hr/HrExhibitFlow.jsx`. The filter **engine, `PillGroupColumn`, and `PresetsContent` are untouched** — this is a layout-shell transform, not a rewrite.

| # | Edit | Effect |
|---|------|--------|
| 1 | `TABS` array | Removed the three tier-depth tabs (`artist`/`media`/`deep`); added one `board` special tab labelled **Filters**. `presets` + `journal` unchanged. |
| 2 | New `BOARD_TOTAL_KEYS` + `KIND_SUPPRESSED_VALUES` + `BOARD_COLUMNS` | Module-load derivation of the five TOTAL facets, in fixed renderBoard order: `content_kind`(Kind) · `topic` · `era` · `bands`(Project/Band) · `format`. Grouping is by **total/partial, not tier**. Kind drops the container-only `"other"` value (8→7). Empty facets are omitted. |
| 3 | New `BoardContent` component | Renders `BOARD_COLUMNS` as `PillGroupColumn`s in the existing `.hr-groups-row` layout (mirrors `TierContent`). |
| 4 | Deck body render | The `currentTab.kind === "tier"` per-tier block (DeepTracks/Tier render) replaced by a single `board` branch → `<BoardContent/>`. |
| 5 | `clearTab` / `tabHasSelection` | Board case added: the per-tab ✕ clears / reflects all five TOTAL facet keys. Dead tier branches removed. |
| 6 | `handleTabClick` | Removed the now-unreachable Deep-Tracks search auto-focus branch. |
| 7 | Mothballed for revival | `TierContent`, `DeepTracksContent` (incl. the cross-tier search), and parent search state (`query`, `searchFocusSignal`, `searchAutoFocusedRef`) preserved, not deleted — matching the repo's Kaleidoscope/AuditStrip convention. Lowercase orphans carry `eslint-disable`; the uppercase components are auto-ignored by `no-unused-vars varsIgnorePattern ^[A-Z_]`. |

**Backups (per `.pre-<tag>` convention):**
`src/routes/hr/HrExhibitFlow.jsx.pre-tabsout-A-20260615T154940Z` and `...css.pre-tabsout-A-20260615T154940Z`. (CSS unchanged this stage — backed up per guardrail only.)

---

## Verification done in-sandbox

- **Data guardrail:** `hunter_root.json` confirmed intact + structurally valid **on the host** (clean close at line 6335). (The sandbox FUSE view of it is truncated at line 6168 — a documented cache artifact, CLAUDE.md §8 — so the host-direct Read tool was used to confirm.)
- **Syntax:** eslint's parser (espree) accepts the edited file — no parse errors.
- **Lint baseline (apples-to-apples, single-file, same linter):** pre-edit backup = **2 errors / 2 warnings**; post-edit = **2 errors / 2 warnings**. **Zero new errors, zero new warnings.** (Both remaining errors — `deckW`@324, `totalCount`@2481 — are pre-existing and outside the edit.)
- **Logic test** (board derivation against a fixture mirroring the live facets): all pass —
  - board order == `Kind, Topic, Era, Project/Band, Format`
  - Kind column excludes `"other"` → 7 real kinds
  - partials (`album`/`source`/`people`) **not** on the board, but still discovered in `HR_DIMENSIONS` for Stage B
  - an absent facet (e.g. `bands`) is skipped, order preserved.

**Could NOT do in-sandbox:** the real `npm run build` / `npm run dev` render + screenshot (workerd + rolldown are Windows binaries; CLAUDE.md §9). The visual render is yours to run on Windows — see checklist.

---

## Decisions I made that you (Mike) own — please rule when you see the render

The v7_1 reference is a standalone full-page instrument; this deck is a fixed bottom strip, so a few integration calls weren't settled by the brief. I picked sensible, reversible defaults:

1. **Board sits behind the "Filters" tab** in the existing bottom deck (one click / hover to open), rather than the deck being always-expanded. Keep, or make the board always-visible?
2. **Tab label = "Filters."** OK, or prefer another word?
3. **Interim gap (Stage A→B):** partials (album/source/people) **and** the old Deep-Tracks global search are unreachable until Stage B's Detail zone lands. The brief says stages are independently deployable, so I treated this as acceptable — confirm you're OK shipping Stage A with that gap, or hold deploy until B.
4. The stale historical comment above `TABS` (old "Artist · Formats · Deep Tracks" order) was left untouched — flag if you want it tidied.

---

## Host-side checklist (Windows)

```
# 1. review
git diff -- src/routes/hr/HrExhibitFlow.jsx

# 2. lint — expect the documented baseline, zero new
npm run lint            # 4 errors / 6 warnings (all pre-existing)

# 3. render
npm run dev             # open /hr, click "Filters"
#   confirm: all 5 facets on ONE surface — Kind(7) Topic(6) Era(5) Project/Band(1) Format(4)
#   confirm: no "other" pill under Kind
#   toggle a Kind pill -> wall narrows; the Filters tab ✕ clears the board

# 4. screenshot; if good, commit + deploy (your call)
```

**Untouched / out of scope:** `matchFilter` + `itemHasTag` (engine), `PillGroupColumn`, `PresetsContent`, `HrExhibitFlow.css`, the mobile pill fallback, and all partial facets (Stage B). No commit, no push, no deploy performed.
