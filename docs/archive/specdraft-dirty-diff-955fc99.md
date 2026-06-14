# SPEC_DRAFT_v5_2.md — dirty working-copy characterization @ 955fc99

**Mode:** READ-ONLY. Nothing restored, committed, staged, or edited. This report is the only file written.
**File under review:** `docs/deep-dive-review/SPEC_DRAFT_v5_2.md`
**Baseline commit:** `955fc99` (HEAD)
**Date:** 2026-06-13

---

## Verdict (one line)

**SAFE-TO-RESTORE** — the working copy is a pure FUSE-mount *phantom* truncation. The on-disk (host) file is **intact and byte-identical to the committed `955fc99` version**. There are no real edits and no real damage. Nothing of value exists to salvage. (And strictly speaking, restoring is a harmless no-op — there is nothing actually wrong with the file on disk.)

---

## What the naive sandbox view says (the trap)

Run from the cowork sandbox, `git diff` reports the file as truncated mid-word:

```
@@ -114,10 +114,4 @@ Phase v5-7 (bulk ingest) remains operator-paced ...
 - It does not resolve Q-2, Q-3, or Q-4 — those remain for phase prompts.
 - It does not specify exact code shapes for any phase — that's the phase prompts' job.

-### Deferred — discovery data-model reconciliation (logged 2026-06-13)
-
-- Before any discovery data-model work, reconcile `discovery-filter-ux-spec.md` §9: `facet_type: total|partial` on every facet; split Kind from Format into two required tags.
-
----
-
-*End of SPEC_DRAFT_v5_2.md.*
\ No newline at end of file
+### Deferred — discovery data-m
\ No newline at end of file
```

`git diff --stat`: `1 insertion(+), 7 deletions(-)`. `--ignore-cr-at-eol` gives the same result (so this is **not** CRLF noise).

This view is **wrong**. It is the FUSE truncation quirk documented in `CLAUDE.md` (quirks #1, #6, #8, §14, and the lint phantom at line 365). `git diff`/`git hash-object` in the sandbox hash the truncated FUSE *view* of the working tree, not the real file on disk.

## What is actually on disk (host-direct truth)

Read host-direct via the Read tool (reads the Windows path directly, bypassing the FUSE/git working-tree view — the reliable layer per `CLAUDE.md` quirks #6/#8):

The working copy is **complete**. It runs cleanly through all 123 lines and ends properly:

```
121  ---
122
123  *End of SPEC_DRAFT_v5_2.md.*
```

Line-by-line, the host-direct working copy is **identical** to the committed `955fc99` blob — including the `### Deferred — discovery data-model reconciliation (logged 2026-06-13)` section, which was already committed (in ancestor `11e0450`) and is present in both. There is no mid-word `discovery data-m` cutoff on disk; that string only exists in the FUSE view.

## Line / byte counts

| Source | Lines | Bytes | Blob | Reliable? |
|---|---|---|---|---|
| Committed `955fc99` (object store: `git show`/`cat-file -s`) | 123* | 8498 | `a0b0e4c` | yes (object DB) |
| Working copy, **host-direct** (Read tool) | 123 | (intact) | — | yes (host) |
| Working copy, **FUSE/sandbox** (`wc`, `git diff`, `git hash-object`) | 116 | 8247 | `16589c1` | **NO — phantom** |

\* 122 by `wc -l` (the file has no trailing newline; the final line `*End of SPEC_DRAFT_v5_2.md.*` is unterminated), 123 by `cat -n` / the Read tool. Both the committed blob and the host working copy share this same no-trailing-newline ending.

**Where the FUSE view "cuts off":** at ~8247 bytes / 116 lines, mid-word inside the heading on line 117 — `### Deferred — discovery data-m`. This is the phantom truncation boundary, not a real one.

## Truncation vs. intentional edits

Neither, on disk. It is **not a real truncation** (host file is whole) and it contains **no intentional edits** (host file equals HEAD exactly). The "modified-uncommitted / truncated / corrupted" status is entirely a FUSE-mount artifact: the sandbox serves a stale/truncated view, and `git` flags the file `M` and would stage the truncated blob `16589c1`.

## Action guidance (informational — nothing was done)

- **Restore is a safe no-op.** `git checkout -- docs/deep-dive-review/SPEC_DRAFT_v5_2.md` (run on **host PowerShell**) restores content identical to what is already on disk. Nothing of value is lost either way.
- **The real hazard is the opposite of restoring: do NOT commit this file from the sandbox.** A sandbox-side `git add`/commit would stage the truncated FUSE blob `16589c1` (116 lines) and actually corrupt HEAD — exactly the failure mode the `CLAUDE.md` §14 commit-integrity guard exists to prevent. Per `CLAUDE.md` §2, commits for this mounted repo run on **host PowerShell only**.
- **Final confirmation Mike can run on host** (PowerShell, authoritative): `git status` should show the file clean (or `(Get-Item <path>).Length` = 8498). If host git shows it clean/8498 bytes, the sandbox `M` was pure phantom and no restore is needed at all.

---

*Read-only report. No files in the repo were restored, staged, committed, or edited; only this report was written to repo root.*
