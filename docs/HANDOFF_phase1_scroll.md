# HANDOFF — Phase 1 (scroll): collapse to continuous scroll + proximity snap

**Status: NOT STARTED — halted at precondition. No `src/` files edited.**
Stamp (UTC): 20260610-151436Z

## Outcome

The brief's opening precondition was not met, so per its own instruction
("If any `src/` file is dirty, STOP and report") no CSS edits were applied.
No build was run, no commit, no push, no deploy.

## Pre-flight checks (verbatim)

```
$ git rev-parse --short HEAD
8ce53e0

$ git rev-parse --abbrev-ref HEAD
main

HEAD == origin/main ?  -> YES (both 8ce53e0)
```

Base commit is correct (clean `8ce53e0`, in sync with `origin/main`).

## git status -s (verbatim)

```
 M CLAUDE.md
 M docs/SCOPE-token-mirror.md
 M docs/canonical/OPERATIONS.md
 M src/routes/exhibit/Exhibit.css
 M src/routes/exhibit/Exhibit.jsx
?? docs/HANDOFF_clamp_fix.md
?? docs/HANDOFF_jsx_recovery.md
?? docs/HANDOFF_leftrail_applied.md
?? docs/HANDOFF_phase1_deckrail_grab.md
?? docs/HANDOFF_relayout_scope.md
?? docs/HANDOFF_seam_scope.md
?? docs/HANDOFF_toprail_build.md
?? docs/HANDOFF_toprail_group_scope.md
?? docs/SCOPE-tabs-leftrail-extract.md
```

**Expected:** 0 dirty under `src/` (only untracked docs).
**Actual:** 2 tracked `src/` files dirty + 3 tracked non-src docs dirty.

## Why it failed — the dirty `src/` changes are junk, not work

Both dirty `src/` files contain only a single appended line of trailing
whitespace with no terminating newline — no real code change. This matches
the FUSE write-cap artifact the brief itself warns about.

```
diff --git a/src/routes/exhibit/Exhibit.css b/src/routes/exhibit/Exhibit.css
index 47f61d0..4f2c331 100644
--- a/src/routes/exhibit/Exhibit.css
+++ b/src/routes/exhibit/Exhibit.css
@@ -178,3 +178,4 @@ ...
   .tl-tags{grid-template-columns:repeat(5,40px)}
   .tl-tag-ghost{width:40px}
 }
+<~1400 trailing spaces>
\ No newline at end of file

diff --git a/src/routes/exhibit/Exhibit.jsx b/src/routes/exhibit/Exhibit.jsx
index f663db0..dc8267d 100644
--- a/src/routes/exhibit/Exhibit.jsx
+++ b/src/routes/exhibit/Exhibit.jsx
@@ -1012,3 +1012,4 @@ export default function Exhibit({ artist }) {
     </>
   );
 }
+<~2000 trailing spaces>
\ No newline at end of file
```

Also dirty (tracked, non-src — outside the `src/` gate but unexpected vs the
"only untracked docs" expectation): `CLAUDE.md`, `docs/SCOPE-token-mirror.md`,
`docs/canonical/OPERATIONS.md`.

## Decision

User was asked how to proceed and chose **"Stop here — just report."**
The tree was left exactly as found. No `git checkout`, no edits, no build.

## To resume Phase 1 later

1. Clean the two `src/` artifacts (e.g. `git checkout -- src/routes/exhibit/Exhibit.css src/routes/exhibit/Exhibit.jsx`)
   and decide what to do with the three tracked doc changes.
2. Re-run the pre-flight: `git rev-parse --short HEAD` == `8ce53e0`, `== origin/main`,
   `git status -s` shows 0 tracked-dirty under `src/`.
3. Then apply the CSS-only edits per the brief (proximity snap; keep `.ex-nav`
   snap; drop `.ex-main`/`.ex-snap`/`.hr-section` center snap; add
   `scroll-snap-align: start` at the deck-section top for the seam catch).
4. Build off-mount: `npx vite build --outDir <off-mount dir>`, must exit 0.
