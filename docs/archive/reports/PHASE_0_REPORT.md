# PHASE 0 REPORT — Make Weird.Baby Museum self-contained

**Filed:** 2026-05-02
**Phase:** 0 (structural; no code changes, no deletions, no commits)
**Status:** complete

---

## Step 1 — Dependency inventory (BEFORE)

Walked `src/`, root config files, root markdown, and `docs/`. Findings:

### Source code (`src/`) — clean
No imports leave the `src/` tree. No references to `C:\AI\` paths or
sibling projects. All relative imports resolve inside the project.
(One unrelated note: `src/routes/hr/workshop/LyricMap.jsx` imports
`bd_data.js` and `tp_data.js` from a path that doesn't appear to
exist in the inventory — flagged as a code-side anomaly for a later
phase, **not** an external dependency.)

### Config files — clean
`package.json`, `vite.config.js`, `wrangler.jsonc`, `deploy.ps1`: no
external paths. `wrangler.jsonc` references a Cloudflare D1 database
ID; that's an external service, not a filesystem dependency, and is
intentional.

### Root markdown + docs — load-bearing pointers found

The **load-bearing** external dependencies (i.e. references that a
fresh agent would have to follow to orient) were exactly the four
canonical docs flagged by the audit, plus pointers to them from
project docs. After the inventory, the following active in-project
files held `C:\AI\`-rooted pointers to the four canonical docs:

| File | Lines | Pointers |
|---|---|---|
| `STATE.md` | 4, 20, 21, 200 | VISION.md, VISION_LOCK_v0.3.md, UX_CONTROLS_SPEC_v0.3.md |
| `docs/DECISION_INDEX.md` | 55, 56, 66 | VISION_LOCK_v0.3.md, VISION.md, UX_CONTROLS_SPEC_v0.3.md |
| `docs/STATUS_SURFACE.md` | 126 | UX_CONTROLS_SPEC_v0.3.md |
| `docs/SESSION_CLOSE_v32.md` | 57 | VISION.md, VISION_LOCK_v0.3.md (historical) |

Other `C:\AI\` references found in active files but **not** load-bearing
for orientation/build/deploy of the museum:

* `docs/PROCESS_NOTES.md`, `docs/SESSION_INTENT_VOCABULARY.md` —
  reference `C:\AI\BUILD_LOCK.txt` and `C:\AI\START_HERE.txt` as
  session-coordination artifacts (per the new RESET_PROTOCOL §1,
  session artifacts live outside the project). Flagged below.
* `docs/MV_TAG_CLEANUP_DESIGN.md`, `docs/BITE2_INVENTORY_DIAGNOSIS.md`
  — reference `C:\AI\Platform\MediaVault\` as a cross-project
  companion. Informational, acceptable per RESET_PROTOCOL §3.
* `docs/DECISION_INDEX.md` (lines 168–174), `docs/GATE1_ACCEPTANCE_CRITERIA.md`
  line 109, `BACKLOG.md` line 188 — describe future cleanup of
  `C:\AI\` top-level orphans / OneDrive migration. Backlog items, not
  pointers.
* `docs/SESSION_CLOSE_v*.md`, `docs/V4*_OPEN_PROMPT.md`,
  `docs/PHASE1*_DESIGN.md`, `docs/COMPONENT_PHILOSOPHY.md` footer,
  `STATE.md` line 203 (prototype location), `docs/STATUS_SURFACE.md`
  line 125 — historical or self-referential paths. Updating would
  distort the historical record.

---

## Step 2 — Canonical-doc comparison

Compared each of the four audit-flagged docs at `C:\AI\` root vs.
in-project:

| Doc | C:\AI\ root | In-project | Authoritative |
|---|---|---|---|
| VISION.md | 10,306 B, 2026-04-27 | not present | **root** |
| VISION_LOCK_v0.3.md | 46,758 B, 2026-04-27 | not present | **root** |
| UX_SPEC_v0.3.md | 88,174 B, 2026-04-22 | not present | **root** |
| UX_CONTROLS_SPEC_v0.3.md | not present (only v0.1, 23,838 B) | `docs/UX_CONTROLS_SPEC_v0.3.md`, 33,010 B, 2026-04-24 | **in-project** |

**Anomaly flagged:** the audit description said
"`C:\AI\UX_CONTROLS_SPEC_v0.3.md` (note: differs from the in-project
copy)." The actual situation is different. There is no v0.3 at
`C:\AI\` root — only `UX_CONTROLS_SPEC_v0.1.md` (legacy). The v0.3
has only ever lived in-project (extracted in v27 per
`SESSION_CLOSE_v27.md`). All `C:\AI\UX_CONTROLS_SPEC_v0.3.md`
references in this project (in `STATE.md`, `DECISION_INDEX.md`,
`STATUS_SURFACE.md`) were therefore broken pointers to a
non-existent file. This is corrected in Step 3 — the in-project
copy was the canonical version all along; we're now both
co-locating it under `docs/canonical/` and fixing the broken
pointers to land there.

The first three docs are unambiguously root-authoritative; no
in-project copy existed to disagree with.

---

## Step 3 — Canonical docs pulled in

Created `docs/canonical/` and copied each authoritative version:

| Source | Destination | Bytes |
|---|---|---|
| `C:\AI\VISION.md` | `docs/canonical/VISION.md` | 10,306 |
| `C:\AI\VISION_LOCK_v0.3.md` | `docs/canonical/VISION_LOCK_v0.3.md` | 46,758 |
| `C:\AI\UX_SPEC_v0.3.md` | `docs/canonical/UX_SPEC_v0.3.md` | 88,174 |
| `docs/UX_CONTROLS_SPEC_v0.3.md` | `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` | 33,010 |

The `C:\AI\` root copies of the first three were left in place per
the no-deletion constraint. The original
`docs/UX_CONTROLS_SPEC_v0.3.md` is also still in place; the
`docs/canonical/` copy is currently a duplicate of it. A later phase
can resolve the duplication (likely by leaving the `canonical/` copy
authoritative and either deleting or stub-redirecting the original).

### Pointer updates made

`STATE.md`:
* line 4: `C:\AI\VISION.md` → `docs\canonical\VISION.md`
* line 20: `C:\AI\VISION.md` → `docs\canonical\VISION.md`
* line 21: `C:\AI\VISION_LOCK_v0.3.md` → `docs\canonical\VISION_LOCK_v0.3.md`
* line 200: `C:\AI\UX_CONTROLS_SPEC_v0.3.md` → `docs\canonical\UX_CONTROLS_SPEC_v0.3.md`

`docs/DECISION_INDEX.md`:
* line 55: `C:\AI\VISION_LOCK_v0.3.md` → `docs/canonical/VISION_LOCK_v0.3.md`
* line 56: `C:\AI\VISION.md` → `docs/canonical/VISION.md`
* line 66: `C:\AI\UX_CONTROLS_SPEC_v0.3.md` → `docs/canonical/UX_CONTROLS_SPEC_v0.3.md`

`docs/STATUS_SURFACE.md`:
* line 126: `C:\AI\UX_CONTROLS_SPEC_v0.3.md` → `docs/canonical/UX_CONTROLS_SPEC_v0.3.md`

`docs/SESSION_CLOSE_v32.md` was left unchanged: it's a frozen
session-close artifact describing what did and didn't happen in that
session. Updating its references would distort the historical
record. Lines 168–174 of `DECISION_INDEX.md` (a discussion of
`C:\AI\` top-level orphans as a future cleanup bite) were also left
unchanged — they describe `C:\AI\` as a topic, not as a load-bearing
target.

---

## Step 4 — RESET_PROTOCOL.md filed

Created at project root: `RESET_PROTOCOL.md`. States the
self-containment rule, lists the four canonical docs and their
in-project paths, and codifies the three rules from the spec
(session artifacts live outside the project; STATE.md describes
committed-and-deployed only; nothing at `C:\AI\` root may be
load-bearing).

---

## Step 5 — Dependency inventory (AFTER)

Re-ran the load-bearing-pointer search on active project files
(excluding `docs/archive/`, `docs/superseded/`, `*.bak_*` backups,
and `docs/SESSION_CLOSE_v*.md` historical artifacts):

```
grep -rn 'C:\\AI\\(VISION|UX_SPEC|UX_CONTROLS|VISION_LOCK)' \
  STATE.md BACKLOG.md README.md docs/*.md
```

Result: **zero hits** in active non-historical files. The only
remaining match is `docs/SESSION_CLOSE_v32.md:57`, which is a frozen
historical artifact and is documented as such in `RESET_PROTOCOL.md`'s
verification rubric.

### Before/after diff for the load-bearing list

| Reference | Before | After |
|---|---|---|
| `STATE.md` → VISION.md | `C:\AI\VISION.md` | `docs\canonical\VISION.md` |
| `STATE.md` → VISION_LOCK_v0.3.md | `C:\AI\VISION_LOCK_v0.3.md` | `docs\canonical\VISION_LOCK_v0.3.md` |
| `STATE.md` → UX_CONTROLS_SPEC_v0.3.md | `C:\AI\UX_CONTROLS_SPEC_v0.3.md` (broken — file not at root) | `docs\canonical\UX_CONTROLS_SPEC_v0.3.md` |
| `DECISION_INDEX.md` → VISION_LOCK_v0.3.md | `C:\AI\VISION_LOCK_v0.3.md` | `docs/canonical/VISION_LOCK_v0.3.md` |
| `DECISION_INDEX.md` → VISION.md | `C:\AI\VISION.md` | `docs/canonical/VISION.md` |
| `DECISION_INDEX.md` → UX_CONTROLS_SPEC_v0.3.md | `C:\AI\UX_CONTROLS_SPEC_v0.3.md` (broken) | `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` |
| `STATUS_SURFACE.md` → UX_CONTROLS_SPEC_v0.3.md | `C:\AI\UX_CONTROLS_SPEC_v0.3.md` (broken) | `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` |

Net: a fresh agent opening only this project folder can now read
`STATE.md`, follow every north-star pointer, and reach VISION,
VISION_LOCK_v0.3, and UX_CONTROLS_SPEC_v0.3 without leaving the
project. UX_SPEC_v0.3 is also now in-project at
`docs/canonical/UX_SPEC_v0.3.md`, although no active file currently
links to it directly (it is the parent doc of UX_CONTROLS_SPEC_v0.3
and is referenced by that doc's "ground truth" / "parent" rows; that
chain now resolves in-project).

---

## Anomalies / unresolved items

**A1. UX_CONTROLS_SPEC_v0.3 audit description was off.** The audit
said "differs from the in-project copy" implying both root and
in-project versions exist and disagree. Actual situation: no v0.3
at root; the in-project version is the only v0.3 and was already
canonical. Resolved in this phase by co-locating it under
`docs/canonical/` and fixing the broken `C:\AI\` pointers. Flagged
here for completeness; no action required.

**A2. Duplicate UX_CONTROLS_SPEC_v0.3.md.** After Phase 0,
`docs/UX_CONTROLS_SPEC_v0.3.md` and
`docs/canonical/UX_CONTROLS_SPEC_v0.3.md` are byte-identical
duplicates. Phase 0's no-deletion rule prevented removing one. A
later phase should pick one as canonical and either delete the other
or convert it to a redirect stub. Recommended: keep
`docs/canonical/UX_CONTROLS_SPEC_v0.3.md` (matches the canonical
pattern of the other three).

**A3. PROCESS_NOTES.md and SESSION_INTENT_VOCABULARY.md document a
session-coordination dependency on `C:\AI\BUILD_LOCK.txt` and
`C:\AI\START_HERE.txt`.** Per the new RESET_PROTOCOL §1, session
artifacts live outside the project and that's fine. But these docs
describe a *workflow* that requires the external file. Not load-
bearing for orient/build/deploy of the museum itself, but
load-bearing for the team's session-running convention. Out of
scope for Phase 0. A later phase can decide whether to (a) leave
as-is (workflow assumes external session storage), (b) migrate the
build-lock convention into the project (e.g. a project-local
`.lock` file), or (c) remove the convention. Flagged.

**A4. Historical session-close artifacts contain frozen `C:\AI\`
references.** `docs/SESSION_CLOSE_v*.md` and `docs/V4*_OPEN_PROMPT.md`
are immutable session records. They describe what happened and where
files lived at the time. Not modified in this phase. Verification
rubric in `RESET_PROTOCOL.md` whitelists them.

**A5. Cross-project references (MediaVault) remain in
`docs/MV_TAG_CLEANUP_DESIGN.md` and `docs/BITE2_INVENTORY_DIAGNOSIS.md`.**
Acceptable per RESET_PROTOCOL §3 — these are informational
descriptions of where a companion project's substrate lives, not
load-bearing dependencies for the museum. No action.

**A6. `STATE.md` line 203 references
`C:\Users\macun\Downloads\prototype_a_v28.html` as the canonical
prototype location.** Same shape as A3: load-bearing for the team's
prototype-iteration convention, not for orient/build/deploy of the
museum. Out of scope for Phase 0; flagged for a later phase.

**A7. `docs/DECISION_INDEX.md` lines 168–174** describe `C:\AI\`
top-level orphans as a future cleanup bite. Informational. Left
unchanged.

---

## Files changed in working tree

New:
* `docs/canonical/VISION.md` (copied from `C:\AI\VISION.md`)
* `docs/canonical/VISION_LOCK_v0.3.md` (copied from `C:\AI\VISION_LOCK_v0.3.md`)
* `docs/canonical/UX_SPEC_v0.3.md` (copied from `C:\AI\UX_SPEC_v0.3.md`)
* `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` (copied from `docs/UX_CONTROLS_SPEC_v0.3.md`)
* `RESET_PROTOCOL.md`
* `PHASE_0_REPORT.md` (this file)

Edited (pointer updates only):
* `STATE.md` (lines 4, 20, 21, 200)
* `docs/DECISION_INDEX.md` (lines 55, 56, 66)
* `docs/STATUS_SURFACE.md` (line 126)

Not deleted, not moved, not committed. No code (`.jsx`, `.js`, `.css`)
modified.
