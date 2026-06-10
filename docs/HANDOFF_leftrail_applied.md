# HANDOFF — tabs→left-rail relayout APPLIED

**Freshness stamp:** 2026-06-09T23:54:19Z
**Scope:** `src/routes/hr/HrExhibitFlow.jsx` + `src/routes/hr/HrExhibitFlow.css` ONLY. No other path touched.
**Status:** Applied + verified. **NOT committed** (commit is Mike's host-side step).

---

## Gate (pre-flight)

| Check | Required | Actual | Result |
|---|---|---|---|
| `git rev-parse --short HEAD` | `36b2182` | `36b2182` | ✅ |
| `git rev-parse --short origin/main` | `36b2182` | `36b2182` | ✅ |
| branch | `main` | `main` | ✅ |
| `src/` clean before edits | clean | clean (`git status -s src/` → empty) | ✅ |

Gate passed. (Repo had pre-existing dirty files **outside** `src/` — see git-status note below — which the gate does not cover.)

---

## Per-patch applied / verified table

Each patch matched its exact anchor the expected number of times (asserted in-memory; nothing written to disk unless all asserts passed). Match counts shown.

| # | File | Patch | Anchor matches | Applied | Verified |
|---|---|---|---|---|---|
| P1 | jsx | `STORAGE_KEY` value `wb-hr-deck-height`→`wb-hr-deck-width` (new key) | 1 | ✅ | ✅ |
| P1 | jsx | doc-comment key reference (line 29) rekeyed for consistency † | 1 | ✅ | ✅ |
| P1 | jsx | `setDeckHeight`→`setDeckWidth` | 3 | ✅ | ✅ |
| P1 | jsx | `deckHeight`→`deckWidth` | 6 | ✅ | ✅ |
| P1 | jsx | `deckPx`→`deckW` (incl. comments) | 12 | ✅ | ✅ |
| P2 | jsx | `S.panelPos`: `bottom:deckW` → `left:deckW`; drop old `left:0`; keep `top:0,right:0,bottom:0` | 1 | ✅ | ✅ |
| P3a | jsx | `S.deck`: `left:0,right:0;height` → `top:0;width` ‡ | 1 | ✅ | ✅ |
| P3b | jsx | `S.deck` inline comment: bottom-note → left/player-bar note | 1 | ✅ | ✅ |
| P4a | jsx | `S.tab`: open edge → right (`borderLeft:none` + top/bottom-right radii); fixed rail width + `height:auto`; drop `minWidth`/`height` | 1 | ✅ | ✅ |
| P4b | jsx | `S.tab`: `marginRight`→`marginBottom` | 1 | ✅ | ✅ |
| P5 | jsx | active-tab sliver: `left/right/bottom/height:1` → `top/bottom/right/width:1` (right-edge seam) | 1 | ✅ | ✅ |
| P6 | jsx | `S.resizeHandle`: `ns-resize`→`ew-resize`; `top/-4 left right height` → `right/-4 top bottom width`; gradient `to bottom`→`to right` | 1 | ✅ | ✅ |
| P7 | jsx | `startResize`: Y→X axis (`startX`,`startW`,`vw`,`dx`,`next=startW+dx`, clamp `vw*FRAC`) | 1 | ✅ | ✅ |
| P8 | jsx | hide-panel glyph `▾`→`◂` | 1 | ✅ | ✅ |
| P9 | css | `.hr-deck`: add `left:0`; transition `bottom`→`left`; KEEP `body:has(.pb){bottom:60px}` | 1 | ✅ | ✅ |
| P10 | css | `.hr-tab-strip`: `top/left:12/right:12/height:30` → `left:0/top:12/bottom:12/width:30`; `flex-direction:column` | 1 | ✅ | ✅ |
| P11 | css | `.hr-deck-body`: `top:30/left:0/right:0/bottom:0` → `left:30/top:0/right:0/bottom:0`; `border-top`→`border-left` | 1 | ✅ | ✅ |
| P12 | css | `.animated` + `.animated.quick`: `height/bottom`→`width/left` (`.animated.resizing` has no axis props — unchanged) | 1 | ✅ | ✅ |

Post-apply stray-token sweep on jsx: `deckPx`, `wb-hr-deck-height`, `deckHeight`, `setDeckHeight` → **0 occurrences** each. ✅

---

## Post-edit file integrity

| File | `wc -l` | `wc -c` | Tail intact past 16 KB? | Install |
|---|---|---|---|---|
| `HrExhibitFlow.jsx` | 3649 | 165382 | ✅ closes with `  );\n}` | 1st attempt, byte-count verified |
| `HrExhibitFlow.css` | 1888 | 57191 | ✅ ends `.hr-jnl-btn { background:#f1eee6; }` | 1st attempt, byte-count verified |

(jsx is **−1 line** vs original 3650: P4a collapsed 4 style lines into 3. No truncation — full byte length confirmed against the in-memory build before and after the copy onto the mount. Edits were built in local `/tmp`, verified, then copied to the FUSE mount with a byte-count check + retry loop, per OPERATIONS §8 — no naive read-modify-write onto the mount.)

**Mobile `@media (max-width:720px)` (lines ~1198–1242):** verified untouched. Its hide rules key off `.hr-tab-strip` / `.hr-deck-body` by name; both class names preserved, so the block survives unchanged. ✅

---

## `git status -s`

```
 M CLAUDE.md
 M docs/SCOPE-token-mirror.md
 M src/routes/hr/HrExhibitFlow.css
 M src/routes/hr/HrExhibitFlow.jsx
?? docs/HANDOFF_relayout_scope.md
?? docs/SCOPE-tabs-leftrail-extract.md
```

**Note on scope:** the only `src/` changes are the two intended files. `CLAUDE.md`, `docs/SCOPE-token-mirror.md`, and the two `??` docs were **already dirty at gate time** (visible in the pre-flight `git status -s`) and are **not** part of this work — all outside `src/`. This handoff (`docs/HANDOFF_leftrail_applied.md`) will also appear as `??` once written.

## `git diff --stat` (the two src files)

```
 src/routes/hr/HrExhibitFlow.css | 17 ++++++--------
 src/routes/hr/HrExhibitFlow.jsx | 79 +++++++++++++++++------------------
 2 files changed, 39 insertions(+), 57 deletions(-)
```

---

## Deviations from the literal brief (flagged for review)

**‡ P3a — `S.deck` sets inline `top:0` + `width` only, NOT `bottom:0`.**
The brief text for patch 3 reads `top:0,bottom:0; width:deckW`. Setting `bottom:0` *inline* would override the stylesheet rule `body:has(.pb) .hr-deck{bottom:60px}` (inline styles beat selector rules without `!important`), which would **break the player-bar lift that patch 9 explicitly preserves** ("rail lifts off the full-width player bar"; "bottom is the player-bar-conditional edge"). Mirroring the original design — where `bottom` was deliberately left to CSS so it could stay conditional — the rail's `bottom` (and `left`) now come from `.hr-deck` CSS, while `top:0` and `width` are inline. This is the only reading consistent with **both** patch 3 and patch 9. The inline comment was updated to say so. If you instead want the literal `bottom:0` inline, it's a one-line change — but the conditional 60px lift will stop working.

**† P1 — doc comment at line 29 also rekeyed.** `// O7: localStorage key is \`wb-hr-deck-height\`` → `wb-hr-deck-width`, so the in-file documentation matches the new `STORAGE_KEY`. Within the two in-scope files; not a code change.

## Out-of-scope finding (NOT changed — your call)

**Window-resize clamp at jsx ~3397 still uses `vh` / `window.innerHeight`.**
```js
const vh = window.innerHeight;
setDeckWidth(prev => Math.max(DECK_MIN_H, Math.min(prev, vh * DECK_MAX_FRAC)));
```
The global rename made this `setDeckWidth(...)`, but the **logic** still clamps the deck *width* against viewport *height* (`vh * DECK_MAX_FRAC`). The brief's 12-item patch list did not include this site, so per the surgical mandate it was left as-is. For a horizontal rail it arguably should clamp against `window.innerWidth`. Flagging for a follow-up decision — intentionally untouched here.

## Notes left as-is (per brief)

Constants keep their height-flavoured names (`DECK_MIN_H`, `DECK_DEFAULT_H_SHARED`, `DECK_MAX_FRAC`) — brief renamed only `STORAGE_KEY` + the state vars. The `TABS` comment/literal mismatch, unused `deckOpen`, and the hidden-Journal quirk were left untouched as instructed.

---

## `_conduit` stamped copy

The Drive conduit is `G:\My Drive\_conduit\` (OPERATIONS §3), which is **not mounted** in this session (only `C:\AI` is). A stamped copy was written to the local cowork drop at `_cowork/HANDOFF_leftrail_applied_20260609T235419Z.md` — **move/sync it to `G:\My Drive\_conduit\` host-side** if you want chat sessions to self-orient on it.

## Next step (Mike, host-side)

Review the diff, then commit the two `src/` files. Not committed here.
