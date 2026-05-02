# Phase 3 — Rename "dock" → "deck" and "tile" → "card" everywhere visible

**Filed:** 2026-05-02
**Scope:** Vocabulary correction. The user's UX language is "deck of cards,"
not "dock of tiles." Both legacy words removed from live code, live docs,
and user-visible strings. No structural or behavioral changes.

---

## 1. Inventory before rename

### `grep -rn "dock\|Dock\|DOCK" src/routes/hr/ --include="*.jsx" --include="*.css" --include="*.js"`

**`src/routes/hr/HrExhibitFlow.css`** (12 hits):
```
2:   Phase 1.5b. Static styles for the inline-section dock. Parameterized
3:   builders (per-pill, per-tab, dock height, etc.) stay inline as JS objects
43:/* ── Dock host ─────────────────────────────────────────────────────────── */
44:/* Sized so the dock can sit at its bottom via sticky positioning. Inside
46:   sticky-bottom dock. The panel scrolls; the dock is always reachable. */
47:.hr-section-dock-host {
54:/* ── Panel (artifact grid pane above the dock) ─────────────────────────── */
438:/* ── Dock body (the panel that opens upward) ───────────────────────────── */
439:.hr-dock-body {
663:/* Layout fits inside hr-content-body (the dock body's flex content). */
1009:/* Below 720px, hide the dock entirely and render the pill columns inline
1012:  .hr-section-dock-host { overflow: visible; min-height: auto; }
1020:  .hr-dock-body {
1023:  /* Hide the absolute dock chrome entirely. */
1027:  .hr-section .hr-section-dock-host > .animated:not(:first-child) {
```

**`src/routes/hr/HrExhibitFlow.jsx`** (43 hits): comments at lines
3, 8, 13, 18, 64; constants `DOCK_MIN_H`, `DOCK_MAX_FRAC`,
`DOCK_DEFAULT_H_SHARED` at 67–69; `STORAGE_KEY = "wb-hr-dock-height"` at
70; comments at 175, 178, 179, 184, 220; `S.dock` property at 186 + call
site at 1541; param `dockOpen` at 196; `dockPx` parameter / variable
across 180–188, 1469–1472, 1534, 1541; user-visible page title `<h1
className="hr-page-title">the artifact dock</h1>` at 810; comments at
1052, 1054, 1364, 1511, 1518, 1530–1531; `dockHeight` /
`setDockHeight` state at 1380, 1400, 1403, 1447, 1485, 1490, 1499; CSS
classes `hr-section-dock-host` at 1532 and `hr-dock-body` at 1573.

**`src/routes/hr/hr_cards.js`** (3 hits): comment at line 1 ("input for
the HR dock"), line 7 ("limits the dock to two filter dimensions"),
line 239 ("the input to the dock's filter logic").

**`src/routes/hr/hr_dimensions.js`** (1 hit): comment at line 1
("active filter dimensions for the HR dock").

### `grep -rn "tile\|Tile\|TILE" src/routes/hr/ --include="*.jsx" --include="*.css" --include="*.js"`

```
src/routes/hr/HrExhibitFlow.css:172:/* ── Phase 1.5c — voice tiles (curatorial commentary; HR_EXIT_FLOW) ────── */
src/routes/hr/HrExhibitFlow.css:175:   the colder evidence tiles. */
src/routes/hr/hr_cards.js:42://                  entries remain null by design (voice tiles, non-clickable).
src/routes/hr/HrExhibitFlow.jsx:747:  // Phase 1.5c: voice tiles (HR_EXIT_FLOW) get a distinct visual treatment;
```

All four are comments referring to the card UI unit (specifically the
"voice" variant introduced in Phase 1.5c, whose CSS class is already
`.hr-card-voice` — only the doc text used "tiles"). No tile references
in JSX strings, no Tailwind/unrelated `.tile` classes.

### `grep -n "dock\|Dock\|DOCK\|tile\|Tile\|TILE" STATE.md BACKLOG.md README.md RESET_PROTOCOL.md`

```
BACKLOG.md:82:**ytId duplicate-tile question.** The `ytId` value `FbOoHjoSyec` appears on
BACKLOG.md:86:two tiles pointing at the same video?) is still open.
BACKLOG.md:88:**Mobile UX polish.** Inline scroll-snap dock + artifact grid haven't been
BACKLOG.md:90:viewports the gift shop covers and confirm tap targets and dock tab strip
BACKLOG.md:142:- v28 dock ported to HrExhibitFlow (Phase 1.5)
STATE.md:33:- Phase 1.5 — v28 dock ported to HrExhibitFlow (commit 21c62a5)
```

`README.md` and `RESET_PROTOCOL.md` had zero hits.

---

## 2. Renames applied

| File | dock→deck replacements | tile→card replacements |
|---|---|---|
| `src/routes/hr/HrExhibitFlow.jsx` | ~43 (constants, vars, params, CSS class refs, JSX page title, comments) | 1 (one comment line) |
| `src/routes/hr/HrExhibitFlow.css` | 14 (CSS class definitions and comments) | 2 (two comment lines) |
| `src/routes/hr/hr_cards.js` | 3 (comments) | 1 (one comment line) |
| `src/routes/hr/hr_dimensions.js` | 1 (one comment line) | 0 |
| `STATE.md` | 1 (the Phase 1.5 line in Recent Work) | 0 |
| `BACKLOG.md` | 3 (Mobile UX polish item × 2; Done-in-2a list × 1) | 2 (`ytId duplicate-tile question` heading and body) |

Specific rename categories applied to `HrExhibitFlow.jsx`:

- **Constants:** `DOCK_MIN_H`, `DOCK_MAX_FRAC`, `DOCK_DEFAULT_H_SHARED` →
  `DECK_MIN_H`, `DECK_MAX_FRAC`, `DECK_DEFAULT_H_SHARED`.
- **localStorage key:** `"wb-hr-dock-height"` → `"wb-hr-deck-height"`.
  No migration code; first-load fresh defaults are acceptable per brief.
- **State variables:** `dockHeight` / `setDockHeight` →
  `deckHeight` / `setDeckHeight`.
- **Layout variable:** `dockPx` → `deckPx` (parameter and call sites).
- **Style-builder property:** `S.dock(deckPx)` → `S.deck(deckPx)`
  (object property name and call site).
- **Function param:** `dockOpen` → `deckOpen` (in `S.tab(active,
  deckOpen, width, isClose)`).
- **CSS class names referenced from JSX:** `.hr-section-dock-host` →
  `.hr-section-deck-host`; `.hr-dock-body` → `.hr-deck-body`. Class
  definitions in `HrExhibitFlow.css` renamed in lockstep.
- **Section/comment headers:** `// ─── DOCK CONSTANTS ───` →
  `// ─── DECK CONSTANTS ───`; `{/* DOCK HOST … */}` → `{/* DECK HOST
  … */}`; CSS `/* ── Dock host ── */` and `/* ── Dock body ── */` →
  `/* ── Deck host ── */` and `/* ── Deck body ── */`.
- **User-visible page title:** `<h1>the artifact dock</h1>` →
  `<h1>the artifact deck</h1>`.
- **Tile→card:** `voice tiles` → `voice cards`; `evidence tiles` →
  `evidence cards`. All four sites were comment-only; the CSS classes
  themselves were already `.hr-card-voice` / `.hr-card-link`.

Pure rename — no structural, styling, or behavioral changes. Class
names changed; the styles inside them did not.

---

## 3. Anything intentionally left as-is

**Phase reports** (`PHASE_1_5*_REPORT.md`, `PHASE_2A_REPORT.md`, etc.)
were left untouched per the brief — they are historical records of
what was done at the time, when "dock" was the working vocabulary.
Editing them would falsify the record.

**`docs/canonical/`, `docs/archive/`, `docs/SESSION_CLOSE_v*.md`,
`docs/COMPONENT_PHILOSOPHY.md`, `docs/MUSEUM_DATA_CONTRACT.md`,
`docs/FILTER_*`, `docs/KALEIDOSCOPE_v3_DECISIONS.md`,
`docs/MV_TAG_CLEANUP_DESIGN.md`, `PHASE_1_5_MERGE_PLAN.md`** — out of
scope for this phase. The brief scoped Step 4 to `STATE.md` and
`BACKLOG.md` ("describes committed reality"). Canonical specs
(`UX_SPEC_v0.3.md`, `UX_CONTROLS_SPEC_v0.3.md`, `VISION_LOCK_v0.3.md`)
contain extensive "dock" / "tile" / "spine tile" usage and would need
their own deliberate revision pass — possibly a Phase 4 — since
"spine tile" is its own distinct concept (the album shelf, not the
artifact deck) and renaming requires care.

**`docs/canonical/UX_SPEC_v0.3.md`** uses "tile" throughout to mean
the album shelf's spine tiles (e.g., "9-tile spine," "spine tile shape
accepts any artist's discography"). That is a different concept from
the artifact-deck cards and is not in scope. Flagged for awareness.

**`RESET_PROTOCOL.md`** was inspected and contains no dock/tile
references.

---

## 4. "tile" hits that turned out not to be card-related

Inside `src/routes/hr/`: **none**. All four `tile` hits in `src/`
were comments describing the card UI unit (specifically the voice
variant) and were renamed to `card`.

**Outside scope but worth noting:** `docs/canonical/UX_SPEC_v0.3.md`
and `docs/canonical/VISION_LOCK_v0.3.md` use "tile" to mean spine tiles
on the album shelf — a separate concept that is not part of the artifact
deck. Not renamed (out of scope).

---

## 5. STATE.md / BACKLOG.md edits

**`STATE.md`** — 1 line (line 33):
```
- Phase 1.5 — v28 dock ported to HrExhibitFlow (commit 21c62a5)
```
→
```
- Phase 1.5 — v28 deck ported to HrExhibitFlow (commit 21c62a5)
```

The historical commit message itself (`21c62a5 Phase 1.5: Port v28
dock into HrExhibitFlow`) is unchanged in git history, but the
description of the current reality in STATE.md uses the new vocabulary.

**`BACKLOG.md`** — three blocks:

- The Tier-3 "ytId duplicate-tile question" item: `tile` → `card`,
  `tiles` → `cards`, heading and body.
- The Tier-3 "Mobile UX polish" item: two `dock` → `deck` substitutions
  ("scroll-snap deck + artifact grid" and "deck tab strip").
- The "Done in Phase 2a (removed from this list)" entry: `v28 dock
  ported` → `v28 deck ported`.

---

## 6. ESLint result

```
$ npx eslint src/routes/hr/HrExhibitFlow.jsx src/routes/hr/hr_cards.js src/routes/hr/hr_dimensions.js
EXIT=0
```

Clean. No warnings, no errors.

---

## 7. Post-rename inventory

```
$ grep -rn "dock\|Dock\|DOCK" src/routes/hr/ --include="*.jsx" --include="*.css" --include="*.js"
(no matches)

$ grep -rn "tile\|Tile\|TILE" src/routes/hr/ --include="*.jsx" --include="*.css" --include="*.js"
(no matches)

$ grep -n "dock\|Dock\|DOCK\|tile\|Tile\|TILE" STATE.md BACKLOG.md README.md RESET_PROTOCOL.md
(no matches)
```

Zero hits across the rename target set. No intentional exceptions
inside `src/routes/hr/`.

---

## 8. Open issues

**Vite build not run on the sandbox.** Per the brief, the rolldown
native binding mismatch on Linux means the build won't work in the
sandbox; Mike will run `npx vite build` on Windows to confirm.
Expected to pass — the rename is purely lexical and the JSX/CSS class
references are renamed in lockstep, so no missing-class or
undefined-identifier errors are anticipated.

**localStorage migration intentionally skipped.** Returning visitors
will see their stored deck height reset to the 480px default because
`wb-hr-deck-height` won't have their previously stored
`wb-hr-dock-height` value. Per brief — acceptable, no migration code
written.

**Canonical UX docs still say "dock" and "tile" extensively.**
`docs/canonical/UX_CONTROLS_SPEC_v0.3.md` and
`docs/canonical/UX_SPEC_v0.3.md` are out of scope for this phase. If
the vocabulary correction should propagate to the canonical spec, that
is its own deliberate revision (and would need to disambiguate "spine
tile" — a separate concept on the album shelf — from "card" in the
artifact deck). Flagged for a possible follow-up phase.

**Phase reports preserved.** No `PHASE_*_REPORT.md` was modified.
Reading them back, the "dock" vocabulary will be consistent with the
words in use at the time each phase was filed.

**No commit, no deploy.** Per brief.
