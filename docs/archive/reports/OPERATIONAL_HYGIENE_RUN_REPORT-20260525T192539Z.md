# Operational Hygiene Run Report

**Session:** Operational Hygiene Pass
**Date:** 2026-05-25 (UTC ~19:18 → 19:25)
**Repos touched:** Museum only (both commits).
**Brief:** Bank accumulated Cowork-environment lessons in Museum CLAUDE.md;
reconcile `docs/TAGGING_SYSTEM_AUDIT-20260524T155635Z.md` §6.1 to mark
T2/T5/T7/T8 as DONE and cross-reference §5.1.

---

## §1 — Audit-on-entry

| Repo | Expected HEAD | Observed HEAD | Match |
|---|---|---|---|
| Museum | `396ad77` (release-flow docs) | `396ad77` | ✓ |
| MV | `53d40f5` (v0.5.8) | `53d40f5` | ✓ |
| HR | `3fc7a09` (T8 yt_archive_capture branch) | `3fc7a09` | ✓ |

File baselines:

- `weird-baby-museum/CLAUDE.md` — 26,019 bytes / 324 lines.
  SHA256 `0f90df33…`. Past 16 KB boundary; anchor-based Python patch
  mandatory per M1 §7.3.
- `weird-baby-museum/docs/TAGGING_SYSTEM_AUDIT-20260524T155635Z.md` —
  71,860 bytes / 1,532 lines. SHA256 `2dad20b1…`. Well past boundary;
  multiple patches in one session compound risk → all five inserts
  driven by a single Python script with five anchor finds + offset-
  descending application.

§6.1 T1 supersession note from commit `3b781f7` confirmed present
(lines 1148-1154). No divergence; no operator surface required.

Folder mounts: all three repos requested and connected on session entry
(per CLAUDE.md hygiene §5 — confirmed reliable + idempotent).

Cowork delete permission for `C:\AI` was not pre-granted; granted
mid-session at GATE 2 prelude (see §2 below).

---

## §2 — Stop-and-ask events

**None.** Zero GATE 5 (UX-impactful) decisions surfaced. The session
was pure docs-write per the brief's prediction.

One **operational** prompt fired (not a GATE 5):

- Commit #2 (`git commit`) failed with `cannot lock ref 'HEAD': Unable
  to create '.git/HEAD.lock': File exists` — the orphan from commit
  #1's incomplete cleanup. Cowork file-delete permission was requested
  narrowly (`.git/HEAD.lock`), granted, the orphan + 7 other
  `tmp_obj_*` / lock files were swept, commit #2 retried successfully.
  Documented in §7 below as a generalisation of the per-session
  delete-permission rule.

Two operator-surface gates (GATE 1 commits #1 and #2) were standard
pre-commit reviews; both received "commit" in the same form, no
follow-up.

---

## §3 — CLAUDE.md additions

**Section:** `## Cowork environment quirks (operational hygiene)`

Inserted between the existing `## Cowork sandbox quirks (READ THIS)`
section and `## Things that are explicitly off-limits`.

**Six subsections:**

1. The 16 KB tail-truncation rule (M1 §7.3) — refines existing
   quirk #1 with the concrete boundary; detection / recovery / hard
   rule.
2. Virtiofs phantom-deletions in `git status` — specialised
   manifestation of quirks #6 + #8; HR commits run on host PowerShell
   only; includes idempotent recovery prelude.
3. Virtiofs COMMIT failure on SQLite writes (M1 §7.2 expanded) —
   `/tmp/` work-copy mandatory; 5-step pattern; `shutil.copy2` not
   `os.replace` (cross-device error).
4. Cowork delete permission is per-session — refines quirk #3.
5. Folder mounts are per-session too — audit-on-entry must request
   directory access for each repo.
6. The release flow (cross-reference) — points back to the existing
   4-step `### Release flow` section above; step 2
   (`npm run export-artifacts`) called out as the most-missed step.

**Size delta:** 26,019 → 30,061 bytes (+4,042). 324 → 383 lines (+59).
Below the 600-line ceiling per "Conventions for updating this file."

---

## §4 — Audit brief annotations

Five block-quote annotations, all matching the §6.1 T1 supersession
pattern from commit `3b781f7` (bullet body → blank → block-quote →
blank → next bullet).

| Location | Lines | Marker | Commit | Date |
|---|---|---|---|---|
| §5.1 (end of decision body) | 939-944 | §5.1 — partial implementation | HR `3fc7a09` | 2026-05-25 |
| §6.1 T2 | 1167-1170 | T2 DONE | MV `609b739` | 2026-05-24 |
| §6.1 T5 | 1184-1186 | T5 DONE | MV `609b739` | 2026-05-24 |
| §6.1 T7 | 1197-1199 | T7 DONE | MV `53d40f5` | 2026-05-25 |
| §6.1 T8 | 1206-1213 | T8 PARTIAL DONE | HR `3fc7a09` | 2026-05-25 |

**T8 precision:** marked PARTIAL DONE, not DONE. HR `3fc7a09`'s
commit body explicitly says "Implements C1's yt_archive_capture
branch only" — era + credit emission and the path-based exhibit rule
for non-YT intake paths remain pending. The annotation cites this
limitation in line.

**§5.1 precision:** §5.1's decision (auto-emit on every capture) was
the *pattern* T8 applied to ingest-audit C1's exhibit rule. The
`bands:hunter_root` / `people:hunter_root` half of the §9.1 decision
(T4 in §6.1) is independent and not yet shipped. The annotation
distinguishes these explicitly so future readers don't conflate them.

**Size delta:** 71,860 → 73,400 bytes (+1,540). 1,532 → 1,564 lines
(+32). All five inserts driven by one Python script; offset-descending
application kept anchors valid across all five patches.

---

## §5 — Commits

Two commits, both Museum-side, both single-file:

| Hash | Subject | Files | +/- |
|---|---|---|---|
| `af8e761` | docs(CLAUDE.md): bank Cowork environment quirks (operational hygiene) | `CLAUDE.md` | +59 / 0 |
| `d616b97` | docs(audit): mark T2/T5/T7/T8 DONE in §6.1; cross-reference §5.1 | `docs/TAGGING_SYSTEM_AUDIT-…md` | +32 / 0 |

Museum branch: `main`, +2 ahead of pre-session HEAD `396ad77`.
Pending push from operator's PowerShell.

---

## §6 — Observed but not actioned

Pre-existing working-tree drift in the Museum repo, all out-of-scope
per the brief:

- `src/data/exhibits/hunter_root.json` and `src/data/vocabulary.json`
  show `M` in `git status`. These are pending the next regen via
  `npm run export-artifacts` (CLAUDE.md release-flow step 2). Not
  touched.
- ~17 untracked `.pre-*` backup files in repo root and `docs/`. These
  are from prior session-recovery patterns; operator triage when
  convenient.
- Untracked `_cowork/`, `dist.pre_*/`, `.phase1_retired_files/`
  directories. Same shape — prior session debris.
- An untracked `C:\\AI\\Platform\\MediaVault/` directory inside the
  Museum repo — looks like an accidental sandbox-mount leakage from
  a prior session. Not touched this session.

None of the above blocks anything. They're cataloged here so the
next operator-triage pass can decide whether to commit, gitignore,
or delete.

**Pre-existing CHANGELOG v0.5.1 tail truncation** in MV (noted in
T7 run report §6): not addressed; brief explicitly listed as
out-of-scope.

---

## §7 — Lessons committed (recursive)

This pass's own findings, ready for the next hygiene update.

**L1 — Sandbox `.git/` orphans accumulate across commits within a
single session.** The first commit in a session may succeed despite
emitting `unable to unlink` warnings for `tmp_obj_*` files and
`HEAD.lock`. The second commit then fails outright on the leftover
`HEAD.lock`. The implication is that the per-session delete
permission grant (CLAUDE.md hygiene §4) is best made *before* the
first commit when a session expects two or more commits — or include
an inter-commit sweep step (`find .git -name '*.lock' -delete &&
find .git/objects -name 'tmp_obj_*' -delete`) as part of GATE 1's
post-commit ritual.

Recommendation: add a sub-bullet to CLAUDE.md hygiene §4 stating
"Multi-commit sessions need an inter-commit sweep, not just an
end-of-session GATE 2 sweep."

**L2 — `§5.1 C1` notation is ambiguous; resolved via HR commit
message.** The user brief's "§5.1 C1" wording matched the HR
`3fc7a09` commit subject ("per audit §5.1 C1"), but neither the
audit brief's §5.1 section nor any literal "§5.1 C1" substring
appears in the audit document. The disambiguation: §5.1 is the
*auto-emit pattern* decision; C1 (referring to *ingest-audit* C1,
documented at audit §4.4 line 873) is the path-based
`exhibit:hunter_root` *rule*. T8's HR work applies the pattern to
the rule. Future cross-section references should spell this out
("§5.1 [audit] + C1 [ingest-audit §4.4]") rather than collapsing
to "§5.1 C1".

**L3 — Anchor-based offset-descending application is the safe
pattern for multi-patch sessions on a single file.** This pass's
audit-brief patch made five independent inserts. Finding all five
anchors first, then applying in offset-descending order, keeps the
remaining anchors' offsets valid throughout. The Python pattern
worked first try with one cleanup pass needed only for stylistic
blank-line consistency with T1's precedent — no anchor-drift
recoveries.

**L4 — Style-precedent matching is worth a cleanup pass.**
The initial T2/T5/T7/T8 annotations were functionally correct but
diverged from T1's precise blank-line pattern (T1 has a blank
between bullet body and block-quote; my first patches did not).
One narrowly-scoped second-pass Python `replace()` script fixed
all four mismatches without disturbing content. The pattern: don't
over-engineer the first patch; do a quick style audit afterwards
and apply a targeted fix.

---

## §8 — What's next

Per the brief and current §6.1 / §6.4 sequencing:

- **T3 is now unblocked** by T7's vocab registration. Server-side:
  expose `tier` + `sort_order` in MV's `/api/tags` response.
  Client-side: replace `CATEGORY_ORDER` constant in MV's
  `mediavault.html` with sort by `(tier, sort_order, ns)`. One
  focused MV session; depends on §5.5 outcome (already resolved
  in §9.5).
- **T4** (people-emission fix) still pending. §9.1 decision
  (auto-emit `bands:hunter_root`) requires HR `yt_archive_capture.py`
  extension + one-shot backfill of the 38 in-inbox parents. Same
  shape as T8's exhibit branch; pairs naturally with the T8
  era + credit completion work in one HR session.
- **T6** (album/song sort-order export) gated on operator filling
  SPINE `release_date` per album (8 values). Pure-content task;
  no code blocked.
- **T8 era + credit completion** (the not-yet-shipped half of T8)
  pairs with T4 above.
- **Operator triage** of the Museum working-tree drift catalogued
  in §6: decide commit / gitignore / delete on the `.pre-*`
  backups, `_cowork/`, `dist.pre_*/`, the `MediaVault/` leakage,
  and the pending `src/data/exhibits/hunter_root.json` regen.

Suggested next session: **T3** (smallest blast radius now that T7
unblocked it). T4 / T8-completion (HR-side) is the next-largest
unblocked unit; runs entirely on host PowerShell per CLAUDE.md
hygiene §2.

---

*Session end: 2026-05-25T19:25:39Z. GATE 2 sweep follows this
report (orphan cleanup across all three repos).*
