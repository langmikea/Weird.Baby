# HANDOFF — window-resize width-clamp fix (`HrExhibitFlow.jsx`)

**Date:** 2026-06-10T00:00Z
**Scope:** WRITE — `src/routes/hr/HrExhibitFlow.jsx` ONLY. No other file touched.
**Commit:** none (do NOT commit — left in working tree).

## Gate result — PASS

- `git rev-parse --short origin/main` == `36b2182` ✓ (HEAD also `36b2182`, prior left-rail pass unstaged — expected).
- Within `src/`, only `HrExhibitFlow.jsx` and `HrExhibitFlow.css` are dirty ✓ (left-rail pass still in working tree, uncommitted). Other dirty paths are outside `src/` (`CLAUDE.md`, `docs/…`) and out of scope.

## Step 1 — handler extracted verbatim (pre-edit)

Window-resize handler, lines 3394–3401, with ±5 lines context:

```
3389	    };
3390	    window.addEventListener("keydown", onKey);
3391	    return () => window.removeEventListener("keydown", onKey);
3392	  }, [activeTab, hoverPeek]);
3393	
3394	  useEffect(() => {
3395	    const onResize = () => {
3396	      const vh = window.innerHeight;
3397	      setDeckWidth(prev => Math.max(DECK_MIN_H, Math.min(prev, vh * DECK_MAX_FRAC)));
3398	    };
3399	    window.addEventListener("resize", onResize);
3400	    return () => window.removeEventListener("resize", onResize);
3401	  }, []);
3402	
3403	  const scheduleHoverOpen = () => {
3404	    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
3405	    hoverTimerRef.current = setTimeout(() => { setHoverPeek(true); }, HOVER_DELAY_OPEN);
3406	  };
```

Axis reference — `startResize` (3435–3453), already correct on the width axis:

```
3438	    const startX = e.clientX, startW = deckWidth, vw = window.innerWidth;
3442	      next = Math.max(DECK_MIN_H, Math.min(next, vw * DECK_MAX_FRAC));
```

## Step 2 — patch (axis inversion, mirroring patch 7 / `startResize`)

Only the two lines inside `onResize`; `DECK_MAX_FRAC` multiplier unchanged; `startResize` untouched.

```diff
@@ onResize handler (HrExhibitFlow.jsx:3396-3397) @@
-      const vh = window.innerHeight;
-      setDeckWidth(prev => Math.max(DECK_MIN_H, Math.min(prev, vh * DECK_MAX_FRAC)));
+      const vw = window.innerWidth;
+      setDeckWidth(prev => Math.max(DECK_MIN_H, Math.min(prev, vw * DECK_MAX_FRAC)));
```

Applied via /tmp build + byte-count-verified copy back to the mount (no read-modify-write on the FUSE mount). Byte delta −1 (`innerHeight`→`innerWidth`); byte-count verify on mount: **OK** (165381 == 165381).

## Step 3 — verification (post-edit)

- `wc -l` = **3649** lines; `wc -c` = **165381** bytes. Tail intact past 16 KB (ends `  );\n}`).
- Handler now reads `const vw = window.innerWidth;` and clamps `vw * DECK_MAX_FRAC`.
- `grep innerHeight` → **none remaining** in the file.
- `grep innerWidth` → line 3396 (handler) **and** 3438 (`startResize`) — the two clamps now agree on the width axis.
- `git status -s` (src/ scope): still only `HrExhibitFlow.css` + `HrExhibitFlow.jsx` dirty.
- `git diff --stat`:
  ```
   CLAUDE.md                       |  3 +-
   docs/SCOPE-token-mirror.md      | 10 +----
   src/routes/hr/HrExhibitFlow.css | 17 +++++----
   src/routes/hr/HrExhibitFlow.jsx | 81 ++++++++++++++++++++---------------------
   4 files changed, 51 insertions(+), 60 deletions(-)
  ```
  (The `jsx | 81` figure is the cumulative working-tree diff vs HEAD including the prior left-rail pass; this task's contribution is the 2-line axis flip above.)

## Not touched
`startResize`, `DECK_MAX_FRAC`, and every other line. No commit performed.
