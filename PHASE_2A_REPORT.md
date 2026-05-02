# Phase 2a Report — Reconcile working tree with git in four clean commits

**Date:** 2026-05-02
**Scope:** Four sequential commits landing Phases 0, 1, 1.5, and Cleanup, plus
working-tree light-cleanup. No deploy.
**Status:** All four commits landed. Working tree has expected leftovers
(see Open Issues). Build verification on Windows pending (Linux sandbox
can't run rolldown).

---

## 1. Pre-flight — `.git/index.lock`

Present at session start (0 bytes, dated 2026-04-14 03:11 — same lock the
Phase 1 report flagged). Direct removal from the Linux sandbox failed with
`Operation not permitted`; the in-product file-delete confirmation was
declined. Mike removed the lock manually from PowerShell:

```
PS C:\Users\macun> Remove-Item C:\AI\Projects\weird-baby-update\.git\index.lock -Force
PS C:\Users\macun> Test-Path C:\AI\Projects\weird-baby-update\.git\index.lock
False
```

After removal, the WSL/9P mount that backs the sandbox kept a stale dentry
for `.git/index.lock` — `ls -la` and `stat` reported the file as still
present, but `find`, `cat`, and (most importantly) `git` saw it as both
present-for-create-EXCL and absent-for-write. This made `git checkout`,
`git add`, and `git commit` all fail with "Unable to create
.git/index.lock: File exists" while the file was demonstrably gone on
the host. The mount cache could not be flushed from inside the sandbox.

**Workaround.** Copied `.git` into `/tmp/wb-git/.git` on the sandbox's real
ext4 filesystem and ran every git operation with `GIT_DIR=/tmp/wb-git/.git`
pointed at the host working tree. After all four commits were complete, the
new objects and refs were synced back: `rsync -a --ignore-existing` for
`objects/`, plain `cp -f` for `refs/heads/main`, `index`, `logs/HEAD`,
`logs/refs/heads/main`, and `COMMIT_EDITMSG`. `git log` against the host
`.git/` then showed all four new commits. (Object stores are content-
addressable, so `--ignore-existing` is safe — identical content lands at
identical paths.)

A second mount quirk surfaced during file edits: the sandbox could create
files in `.git/` and could overwrite working-tree files via `cp -f` (which
truncates+writes), but it could not `unlink` working-tree files. This
affected the Cleanup commit's working-tree deletions (see §4).

---

## 2. Four commits

| # | Hash       | Subject                                                  | Files | +/-                  |
|---|------------|----------------------------------------------------------|------:|----------------------|
| 1 | `dce3bb2`  | Phase 0: Make project self-contained                     |     9 | +4531 / −2           |
| 2 | `12d50da`  | Phase 1: Make the museum HR-only                         |    21 | +2709 / −1008        |
| 3 | `21c62a5`  | Phase 1.5: Port v28 dock into HrExhibitFlow              |     9 | +4663 / −450         |
| 4 | `3390709`  | Cleanup: Remove quarantine, .bak files, retire stale state |   21 | +168 / −7445         |

`git log --oneline -5`:

```
3390709 Cleanup: Remove quarantine, .bak files, retire stale state
21c62a5 Phase 1.5: Port v28 dock into HrExhibitFlow
12d50da Phase 1: Make the museum HR-only
dce3bb2 Phase 0: Make project self-contained
8b0d288 STATE.md: update to r28 — gift shop, exhibit refactor, build time on admin   ← prior HEAD
```

Branch `main` is now four commits ahead of `origin/main`; nothing pushed
(deploy belongs to Phase 2b).

### Per-commit notes

**Commit 1 (Phase 0).** Cleanly committed: `docs/canonical/{VISION.md,
VISION_LOCK_v0.3.md, UX_SPEC_v0.3.md, UX_CONTROLS_SPEC_v0.3.md}`,
`RESET_PROTOCOL.md`, `PHASE_0_REPORT.md`, `docs/DECISION_INDEX.md`,
`docs/STATUS_SURFACE.md`, and a 2-line modification to `STATE.md`. The
brief's escape hatch was used for `STATE.md`: revert to HEAD, re-apply only
the two `C:\AI\VISION.md` → `docs\canonical\VISION.md` substitutions, stage,
commit, then restore the working-tree version with `cp -f`. See Open Issue
#1 for `DECISION_INDEX.md` / `STATUS_SURFACE.md` discrepancy.

**Commit 2 (Phase 1).** `src/App.jsx`, `src/data/wb_roster.js`, `index.html`
were each rewritten from their HEAD versions plus only the Phase 1 deltas
(escape-hatch path again, because the working tree contained pre-Phase-1
noise on each of these files — see Open Issues #2, #3, #4). All 11
quarantined files registered as renames (`R079`–`R100` similarity index)
because git detected the move from `src/…` to `_quarantine/…/…`. The
`/hr/merch` route + `HrMerch` import removal was bundled into this commit
for build integrity (see Open Issue #2).

**Commit 3 (Phase 1.5).** `src/routes/hr/HrExhibitFlow.jsx` shows as a
72%-rewrite of the HEAD version (672 → 1620 lines). The intermediate
working-tree version (728 lines) that Phase 1.5b quarantined is preserved
at `_quarantine/hr_exhibit_flow_old/HrExhibitFlow.jsx` (88% similarity to
HEAD's HrExhibitFlow.jsx — note this isn't HEAD itself; see Open Issue #5).
New files `hr_dimensions.js`, `hr_cards.js`, `HrExhibitFlow.css`, and the
four 1.5 reports landed clean.

**Commit 4 (Cleanup).** `git rm --cached -r _quarantine/` removed all 17
quarantined files from the index. Two tracked `.bak` files (`HrSpine.jsx.bak`,
`HrSpine.jsx.r23.bak`) likewise removed via `--cached`. `STATE.md` rewritten
from scratch to the brief's structure. `BACKLOG.md` rewritten to drop done
items and add new ones. The eight untracked `.bak` files in `docs/` and
project root, plus the now-untracked `_quarantine/` directory tree, remain
in the working tree — the sandbox could not unlink them; Mike will need to
delete them manually (see Open Issue #6).

---

## 3. Pre-existing untracked, untouched

These files were untracked before Phase 0 and were not staged in any of the
four Phase 2a commits. They remain in the working tree, untracked, untouched.
This is the audit trail.

**Project root (4 items):**

```
STATE.md.bak_pre_v47_close_20260430_220854
deploy.ps1
facebook-post.md
runtime-check.mjs
syntax-check.mjs
```

**`docs/` — design / process / inventory docs (38 items):**

```
docs/BITE2_INVENTORY_DIAGNOSIS.md
docs/BITE3_TARGET_STATE_DESIGN.md
docs/BITE4_MIGRATION_PLAN.md
docs/BIT_MAN_NOTES.md
docs/BIT_MAN_NOTES_UPDATE_2026-04-25.md
docs/BREACH_LOG.md
docs/CLEANUP_1_EXECUTION_SPEC_v51.md
docs/CONTRACT_video_kind_fix.md
docs/CRUISE_NOTES_2026-05.md
docs/DECK_TALK_2026-04-24.md
docs/FEATURE_fan_playlists.md
docs/FILTER_LOGIC_DECISION.md
docs/FILTER_PROBLEM_BRIEF.md
docs/GATE1_ACCEPTANCE_CRITERIA.md
docs/HR_VIDEO_MIGRATION.md
docs/KALEIDOSCOPE_v3_DECISIONS.md
docs/MUSEUM_DATA_CONTRACT.md
docs/MV_INTAKE_REQUIREMENTS.md
docs/MV_TAG_CLEANUP_DESIGN.md
docs/MV_TAG_CLEANUP_DESIGN_v50_AMENDMENT.md
docs/PHASE1V02_DESIGN.md
docs/PHASE1V03_DESIGN.md
docs/PHASE1_PREFLIGHT_DESIGN.md
docs/PHASE2_STATUSSURFACE_DESIGN.md
docs/PHASE3_BOOTSTRAP_DESIGN.md
docs/PHASE4_LOCATABLE_DESIGN.md
docs/PROCESS_NOTES.md
docs/SESSION_INTENT_VOCABULARY.md
docs/STRATEGY_weird_baby_infrastructure.md
docs/SYSTEM_REVIEW_COMPLETE.md
docs/SYSTEM_REVIEW_METRICS.md
docs/SYSTEM_REVIEW_SCOPE_NOTES_2026-04-25.md
docs/UX_CONTROLS_SPEC_v0.3.md
docs/V45_OPEN_PROMPT.md
docs/V46_OPEN_PROMPT.md
docs/V47_OPEN_PROMPT.md
docs/V50_DRIFT_CATALOG.md
docs/V50_SWEEP_INVENTORY.md
docs/WRAP_PROBABILITY_ANALYSIS.md
```

(`docs/UX_CONTROLS_SPEC_v0.3.md` is a duplicate of the now-tracked
`docs/canonical/UX_CONTROLS_SPEC_v0.3.md` — Phase 0 anomaly A2 already
flagged this for resolution. Untouched here.)

**`docs/SESSION_CLOSE_v*.md` — session-close briefs (21 items):**

```
docs/SESSION_CLOSE_v27.md
docs/SESSION_CLOSE_v31.md
docs/SESSION_CLOSE_v32.md
docs/SESSION_CLOSE_v33.md
docs/SESSION_CLOSE_v34.md
docs/SESSION_CLOSE_v35.md
docs/SESSION_CLOSE_v36.md
docs/SESSION_CLOSE_v37.md
docs/SESSION_CLOSE_v38.md
docs/SESSION_CLOSE_v39.md
docs/SESSION_CLOSE_v40.md
docs/SESSION_CLOSE_v42.md
docs/SESSION_CLOSE_v43.md
docs/SESSION_CLOSE_v43_extension.md
docs/SESSION_CLOSE_v44.md
docs/SESSION_CLOSE_v44_post_close_amendment.md
docs/SESSION_CLOSE_v45.md
docs/SESSION_CLOSE_v46.md
docs/SESSION_CLOSE_v47.md
docs/SESSION_CLOSE_v48.md
docs/SESSION_CLOSE_v50.md
docs/SESSION_CLOSE_v51.md
docs/SESSION_CLOSE_v53.md
```

(That's 23 files — recount against the brief's "~30" estimate: closer to
23. Per RESET_PROTOCOL these belong in `C:\AI\_sessions\`; the move is
flagged for Phase 2.5.)

**Untracked subdirectories (3 items):**

```
docs/archive/
docs/superseded/
poc/
prototypes/
tools/
```

**Pre-existing untracked `.bak` files (8 items — see §5):**

```
STATE.md.bak_pre_v47_close_20260430_220854   (also listed under root)
docs/DECISION_INDEX.md.bak_v50_20260501_140237
docs/MV_TAG_CLEANUP_DESIGN.md.bak_pre_section3_20260430_215405
docs/MV_TAG_CLEANUP_DESIGN.md.bak_pre_section4_20260430_215906
docs/MV_TAG_CLEANUP_DESIGN.md.bak_pre_section5_20260430_220141
docs/MV_TAG_CLEANUP_DESIGN.md.bak_pre_section67_20260430_220712
docs/MV_TAG_CLEANUP_DESIGN.md.bak_v50_20260501_140237
docs/STATUS_SURFACE.md.bak_pre_v46_recon_20260430_205527
```

**Pre-existing modified tracked files (not staged in any Phase 2a commit):**

```
modified:   .gitignore
modified:   README.md
modified:   docs/COMPONENT_PHILOSOPHY.md
modified:   docs/PANEL3_ARTIFACTS_SPEC_v0.1.md
modified:   eslint.config.js
modified:   package-lock.json
modified:   package.json
modified:   public/_routes.json
modified:   public/icons.svg
modified:   src/App.css
modified:   src/assets/vite.svg
modified:   src/data/artists/hunter-root.js
modified:   src/data/hr_archive.js
modified:   src/data/hr_artifacts.js
modified:   src/data/wb_roster.js   (Lancaster blurb — see Open Issue #4)
modified:   src/main.jsx
modified:   src/routes/WbAdmin.jsx
modified:   src/routes/WbHome.jsx
modified:   src/routes/exhibit/Exhibit.css
modified:   src/routes/exhibit/Exhibit.jsx
modified:   src/routes/hr/HrFanWall.jsx
modified:   src/routes/hr/HrMedia.jsx
modified:   src/worker.js
modified:   vite.config.js
modified:   wrangler.jsonc
deleted:    docs/HOMESTEAD_INSTAGRAM_SPEC_v0.2.md
deleted:    docs/MUSEUM_STRUCTURE_SPEC_v0.1.md
deleted:    docs/SESSION_CAPTURE_PANEL2.md
deleted:    docs/SESSION_CAPTURE_PANEL2_INTEGRATION.md
```

These are the ~20 days of pre-Phase-0 work the brief flagged. They remain
uncommitted, in the working tree, exactly as they were at session start.

---

## 4. `_quarantine/` deletion

**Index:** all 17 quarantined files removed. The Cleanup commit
(`3390709`) records `delete mode 100644` for every entry under
`_quarantine/cb/`, `_quarantine/lyricmap/`, `_quarantine/hr_orphans/`, and
`_quarantine/hr_exhibit_flow_old/`. `git ls-tree HEAD _quarantine/` returns
empty.

**Working tree:** the directory tree and its files still exist on disk —
the Linux sandbox cannot `unlink` files on the Windows mount, only
overwrite them. `git status` reports `_quarantine/` as untracked. The
content is preserved in git history via the Phase 1 and Phase 1.5 commits
(per the original quarantine plan).

**Action required:** Mike to delete the `_quarantine/` tree manually:

```
PS C:\AI\Projects\weird-baby-update> Remove-Item _quarantine -Recurse -Force
```

After that, `git status` will show no `_quarantine/` entry at all.

---

## 5. `.bak` cleanup

**Tracked `.bak` files removed via `git rm --cached` (2):**

```
src/routes/hr/HrSpine.jsx.bak
src/routes/hr/HrSpine.jsx.r23.bak
```

These appear as `D` in commit `3390709`. The working-tree files still
exist (now untracked) — same sandbox-unlink limitation as `_quarantine/`.

**Untracked `.bak` files left in place (8):**

```
STATE.md.bak_pre_v47_close_20260430_220854
docs/DECISION_INDEX.md.bak_v50_20260501_140237
docs/MV_TAG_CLEANUP_DESIGN.md.bak_pre_section3_20260430_215405
docs/MV_TAG_CLEANUP_DESIGN.md.bak_pre_section4_20260430_215906
docs/MV_TAG_CLEANUP_DESIGN.md.bak_pre_section5_20260430_220141
docs/MV_TAG_CLEANUP_DESIGN.md.bak_pre_section67_20260430_220712
docs/MV_TAG_CLEANUP_DESIGN.md.bak_v50_20260501_140237
docs/STATUS_SURFACE.md.bak_pre_v46_recon_20260430_205527
```

The brief's classification check passed — every file matches one of the
patterns the brief enumerated. Per the brief, untracked `.bak` files
should be deleted with plain `rm`. The sandbox cannot do that; Mike to
delete manually:

```
PS C:\AI\Projects\weird-baby-update> Get-ChildItem -Recurse -File -Include *.bak,*.bak_* | Remove-Item -Force
```

(Adjust the include pattern if other dot-bak variants exist; the
audit-known set is the eight above.)

---

## 6. `STATE.md` — new content

Full file contents committed in `3390709`:

```markdown
# Weird.Baby Museum — STATE

**As of:** 2026-05-02
**Committed to:** main (see `git log` for the latest commit hash)
**Deployed:** Not yet — see Phase 2b. (Update after deploy.)

## What this is

Weird.Baby Museum. A curatorial platform. Currently exhibiting Hunter Root.

## Live routes

- `/` — front door (lobby + guestbook)
- `/admin` — operator dashboard (`mmm` key sequence)
- `/hr` — Hunter Root exhibit
- `/hr/home`, `/hr/media`, `/hr/archive`, `/hr/fan-wall` — HR sub-routes
- `/shop` — gift shop

## Stack

React 19, Vite 8, Cloudflare Workers, D1 (`weird-baby-db`).
Build: `npx vite build`. Deploy: `npx wrangler deploy`.

## Canonical docs

See `docs/canonical/` — VISION, VISION_LOCK_v0.3, UX_SPEC_v0.3,
UX_CONTROLS_SPEC_v0.3.

## Recent work

- Phase 0 — project self-contained (commit dce3bb2)
- Phase 1 — museum HR-only (commit 12d50da)
- Phase 1.5 — v28 dock ported to HrExhibitFlow (commit 21c62a5)
- Cleanup — quarantine removed, STATE/BACKLOG rewritten (this commit)

## Open backlog

See `BACKLOG.md`.
```

38 lines. The previous STATE.md (270 lines, narrating CB exhibits, Workshop
panels, the v28 prototype-cycle, etc.) is replaced — that history is
preserved in git via commit `8b0d288` (last `STATE.md` update before
Phase 2a).

---

## 7. `BACKLOG.md` — what changed

**Removed (work landed in Phase 2a or earlier and incorrectly listed):**

- "Carsie Blanton Exhibit Flow (Panels 2+)" — entire CB stack removed in Phase 1
- "Code cleanup: Delete orphaned files (HrPanel2, HrPanel3, HrSpine.jsx.bak,
  HrSpine.jsx.r23.bak)" — done in Phase 1 / Phase 2a Cleanup
- "Retire `/hr/merch` redirect" — done in Phase 1
- "video_kind Normalization Pass" — already done in v31 (the file even said
  "SUPERSEDED v31" — pure dead weight)
- Several backlog-internal cross-references to retired bites

**Kept (still genuinely open):**

- Tracklist Queue Overhaul (Tier 1)
- Hunter Root Links Enrichment (Tier 1)
- Founding Visitor Easter Egg (Tier 2)
- Persistent Guest Book Entries / Vote Counts (Tier 2)
- Fan Playlists (Tier 2)
- Infrastructure Sequencing (informational)
- SM Video/Audio Handoff, Real Auth, Weighted Journal (Tier 3)
- UI / Content polish (Tier 4)
- Museum Merch Pipeline, Content Archive Preservation (Tier 5)
- Outside-museum items (informational)
- MediaVault Tag Vocabulary cleanups

**Added (surfaced by Phase 2a):**

- Phase 2b — Deploy verification (Tier 2)
- Phase 2.5 — Move session-close briefs out of repo (Tier 2)
- ytId duplicate-tile question (Tier 3) — `FbOoHjoSyec` appears on two cards
- Mobile UX polish for the new dock + grid (Tier 3)
- "Done in Phase 2a" trailer section so readers can see what landed

---

## 8. Post-commit verification

**`git log --oneline -5`:**

```
3390709 Cleanup: Remove quarantine, .bak files, retire stale state
21c62a5 Phase 1.5: Port v28 dock into HrExhibitFlow
12d50da Phase 1: Make the museum HR-only
dce3bb2 Phase 0: Make project self-contained
8b0d288 STATE.md: update to r28 — gift shop, exhibit refactor, build time on admin
```

**`git status` (summary):** clean with respect to all Phase 0/1/1.5/Cleanup
work. Modified/deleted tracked files and untracked files remaining are all
either (a) pre-existing 20-days-of-uncommitted-work, (b) leftovers from
Phase 2a's inability to unlink working-tree files (see §4, §5), or (c)
other genuinely pre-existing untracked content (see §3). No Phase 2a work
is uncommitted.

**`npx vite build`:** could not be run in the Cowork Linux sandbox — same
rolldown native-binding issue Phase 1 reported (`@rolldown/binding-linux-
x64-gnu` missing because `node_modules/` was installed on Windows). This
is environmental, not code. The brief's Phase 2b will exercise the build
on Windows; if it fails there, that's a separate signal.

`node --check` exit 0 on `src/data/wb_roster.js` (representative ESM
file — node can't `--check` JSX without a transform).

---

## 9. Open issues

**1. `docs/DECISION_INDEX.md` and `docs/STATUS_SURFACE.md` were committed
whole.** Both files were untracked before Phase 0; Phase 0 only modified
3 lines in DECISION_INDEX.md and 1 line in STATUS_SURFACE.md, but the bulk
of each file (200+ lines) is pre-Phase-0 content. The brief's escape hatch
(revert + reapply) doesn't apply to untracked files (no HEAD version to
revert to). I committed them whole rather than skip them, because the brief
explicitly listed them as Phase 0 edits and the pre-written commit message
references all three docs. The pre-Phase-0 content rode along — that's
~440 lines of "20 days of work" landing in commit `dce3bb2`. Flagging in
case stricter phase isolation matters more than honoring the brief's file
list.

**2. App.jsx — `HrMerch` removal bundled.** HEAD's `App.jsx` had 12
imports / 12 routes including `HrMerch`. Phase 1's report shows a "before"
state with 11 imports / 11 routes (no `HrMerch`) — meaning the `HrMerch`
import + `/hr/merch` route had already been removed before Phase 1 ran (in
the 20 days of pre-Phase-0 work). Phase 1 then deleted `HrMerch.jsx`
itself. To keep `App.jsx` building at the Phase 1 commit boundary, I
included the `HrMerch` import/route removal in the Phase 1 commit's
`App.jsx`. This makes the Phase 1 commit slightly broader than the
report's "edited file" delta (4 imports + 4 routes removed instead of 3+3),
but it's necessary for build integrity — committing the file deletion
without the import removal would break the build at HEAD after commit 2.

**3. `index.html` — pre-Phase-1 CRLF conversion discarded.** The working-
tree `index.html` was CRLF (Windows line endings); HEAD was LF (Unix). The
working-tree file thus showed every line as changed in `git diff`. Only
the meta-description string was a Phase 1 change. I used the escape hatch:
reverted to HEAD (LF), changed the meta-description string only, committed.
The CRLF conversion (pre-Phase-0 work) was effectively discarded — the
new tracked `index.html` is LF. If line-ending normalization was an
intentional Windows-side workflow change, this should be revisited; if it
was an accidental editor side-effect, this is the right outcome.

**4. `wb_roster.js` — pre-Phase-1 HR blurb change preserved as
uncommitted.** HEAD has the old HR blurb ("Central PA songwriter. Six
albums. Aphantasic lyric cinema."). The working tree had a new blurb
("Lancaster, PA. Six albums from Medusa's Disco to Crooked Home. Songs
that arrive quietly and stay.") — clearly an intentional content edit
made at some point in the 20 days. The Phase 1 commit landed only the CB
removal, on top of HEAD's old blurb. I then restored the working tree to
the new blurb so the content edit isn't lost; it shows as `M` in
`git status` and is available for Mike to commit separately. (`BACKLOG.md`
notes this in Tier 4.)

**5. `_quarantine/hr_exhibit_flow_old/HrExhibitFlow.jsx` is not the HEAD
version.** It's a 728-line intermediate that was in the working tree right
before Phase 1.5b ran; HEAD's `HrExhibitFlow.jsx` is 672 lines. Phase 1.5b
preserved "what was there" in quarantine, not "what was last committed".
Both versions are now in git: HEAD's 672-line version reachable via
`git show 8b0d288:src/routes/hr/HrExhibitFlow.jsx`, the 728-line
intermediate via `git show 21c62a5:_quarantine/hr_exhibit_flow_old/
HrExhibitFlow.jsx` (and via `git show 21c62a5^:_quarantine/...` would also
work — the file lands in commit 3 and is deleted in commit 4). No content
is lost, but the "old" label is slightly misleading — it's the
intermediate, not the original.

**6. Working-tree leftovers from sandbox unlink limitation.** The Cowork
Linux sandbox can create and overwrite files on the Windows-mounted
project tree but cannot unlink them. The Cleanup commit therefore landed
all deletions in the git index, but eight untracked `.bak` files plus the
17 files / 4 subdirectories of `_quarantine/` plus the two now-untracked
`HrSpine.jsx.bak` files remain on disk in the working tree. They show as
untracked in `git status`. Mike to delete manually from PowerShell
(commands in §4 and §5). Once deleted, the working tree will exactly
match HEAD's intended state.

**7. Build verification deferred to Phase 2b.** The Linux sandbox can't
run `vite build` (rolldown Linux native binding missing — environmental,
not code). The Windows build is the source of truth and Phase 2b will
exercise it.

**8. Commit author is `Mike Lang <langmikea@gmail.com>`.** Set explicitly
on each commit via `git -c user.name=… -c user.email=…` because the
sandbox's `/tmp/wb-git/.git` doesn't carry Windows git config. If the
host's `.git/config` has a different identity for this project, future
commits made from Windows will show that identity instead — not a problem,
just a context-switch artifact.

---

## 10. What Mike needs to do next

In rough order:

1. **Clean the working tree on Windows** (PowerShell, from the project
   root):

   ```
   Remove-Item _quarantine -Recurse -Force
   Get-ChildItem -Recurse -File -Include *.bak,*.bak_* | Remove-Item -Force
   ```

   After that, `git status` will show only the pre-existing 20-days
   modifications + pre-existing untracked design docs.

2. **Verify the build:** `npx vite build`. Expected: clean, ~47 modules
   per Phase 1.5d's measurement.

3. **Phase 2b: deploy.** `npx wrangler deploy`. Verify `/hr` renders the
   new `HrExhibitFlow` and that no removed route (`/cb`, `/hr/workshop`,
   `/hr/workshop/lyric-map`, `/hr/merch`) is still being requested by an
   external link. Update `STATE.md` `Deployed:` line afterward.

4. **Phase 2.5:** move `docs/SESSION_CLOSE_v*.md` (23 files) out of the
   repo to `C:\AI\_sessions\` per `RESET_PROTOCOL`. Tackle the other
   ~38 untracked design docs in `docs/` at the same time — figure out
   which are still load-bearing (commit those) and which are session
   ephemera (move out). This deserves its own session.

5. **Decide what to do with the 20 days of pre-existing modifications.**
   Most of those tracked-file changes likely represent real work that
   should land in a follow-up commit; this Phase 2a-style discipline isn't
   strictly necessary for them since they're all "pre-Phase-0" content.
   A single "post-r28 working tree reconciliation" commit might be the
   cleanest path.
