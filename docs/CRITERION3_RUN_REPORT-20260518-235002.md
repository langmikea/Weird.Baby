# Criterion 3 Run Report — single coordinated writer for `artifacts.tags`

**Run:** 2026-05-18T23:50:02
**Spec:** `DATA_ARCHITECTURE_SPEC_v2.1-target.md` §4.5 / §4.5.1 / §12.3
**Operator green-light:** Mike, this session
**MV git HEAD (restore point):** `9b0190fe9bb51cf8c6c5a6fb0aa5c168419d4c2d`
**DB backup:** `core/backups/mediavault.pre-criterion3-20260518-201040.sqlite` (SHA256 verified equal to live DB)

## Outcome

Pass. `artifacts.tags` now has exactly one coordinated writer
(`core/artifact_tags.py::write_artifact_tags`); the §8.4 overwriter
path (the four Vocab Admin sweeps) is removed and rewired through the
shared routine; the §4.5.1(b) grep-check is checked in and passes
(exit 0 on the live tree, exit 1 on a synthetic violator). The
end-to-end verification — YouTube-style register, curation edit, and
Vocab Admin rename — all preserve tags correctly.

## What changed in code

### NEW — `core/artifact_tags.py` (183 lines, 7,178 bytes)

The single permitted writer. Three public symbols:

| Symbol | Purpose |
|---|---|
| `write_artifact_tags(conn, artifact_id, new_tags)` | The only SQL path that writes `artifacts.tags`. Validates strict §3.1, deduplicates, diffs added/removed against the current row, writes `tags + updated_at`, refreshes the per-slug `tags.usage_count` cache. One transaction on the caller-supplied connection (caller controls commit). |
| `validate_artifact_tags(tags) -> list` | Pre-validation helper for callers that want a canonical list before the write (e.g. to upsert novel vocab rows so the cache update lands on existing rows). Raises `TagValidationError` on any malformed tag; never silently drops. |
| `TagValidationError` | Raised on any §3.1 violation. Carries `.tag` and `.reason` so handlers can return a useful 400. |

Validation is **stricter than MV's legacy `slugify`** by design (§3.2):
bare slugs, empty namespaces/values, second colons, hyphens in
namespaces, and any non-`[a-z0-9_-]` characters are all hard-rejected.
A live-data sweep confirmed all 88 currently-stored artifacts pass
the strict validator (Crit 1's migration already produced fully
namespaced data, so the new gate doesn't trip on legitimate state).

### MODIFIED — `core/imgserver.py` (1,648 → 1,731 lines, 63,605 → 68,059 bytes — LF-normalized to match HEAD blob)

- Header docstring: stale "those modules are unchanged from v0.2 and
  the brief explicitly says NOT to modify them" guidance removed
  (Step 4); replaced with explicit "imgserver_extensions.py is a peer
  and is editable" plus a clear single-writer-rule block pointing at
  `core/artifact_tags.py`.
- New import: `from artifact_tags import (write_artifact_tags,
  validate_artifact_tags, TagValidationError)`.
- `handle_artifact_save` INSERT branch: `tags` removed from the
  column list; the schema default `'[]'` seeds the row, then
  `write_artifact_tags(conn, aid, tags)` sets the real set. The
  `adjust_tag_usage(conn, tags, [])` call is gone (the writer
  subsumes it).
- `handle_artifact_save` UPDATE branch: `tags=?` removed from the
  dynamic SET clause; tag-write goes through `write_artifact_tags`
  in the same connection / transaction.
- `handle_artifact_update`: rewritten — pre-validates strictly,
  upserts novel vocab rows (preserving the proposed-tag UX),
  performs the non-tag UPDATE if needed, then calls
  `write_artifact_tags`. Validation failures return 400 with no
  partial write.
- `handle_tag_update` (rename sweep, §8.4 violation #1): the
  `UPDATE artifacts SET tags=?` loop is gone. The sweep now builds
  the new tag list per artifact and calls `write_artifact_tags`.
  The new vocab row is seeded with `usage_count=0` — the writer
  increments per artifact, so the final cache value matches reality
  without the old manual carry-over.
- `handle_tag_reject` (remove/replace sweep, §8.4 violation #2):
  same pattern. Manual `usage_count` transfer for `replace` mode
  is gone — the writer's per-artifact diff handles it.
- `handle_tag_merge` (sweep, §8.4 violation #3): same pattern. The
  full-table `usage_count` recompute at the end is kept as §3.2
  defense-in-depth (no longer the authority).
- `handle_tag_bulk_delete` (sweep, §8.4 violation #4): same pattern.

### MODIFIED — `core/imgserver_extensions.py` (564 → 599 lines, 22,881 → 25,096 bytes — LF-normalized to match HEAD blob)

- Header rewritten: the "extends imgserver.py without rewriting it"
  framing is replaced with explicit "peer module, editable" language,
  noting that the April-2026 packaging-task convention is superseded
  by the v2.1-target spec. The single-writer rule block is added.
- v0.5 NOTES block trimmed to the parts that are still
  forward-relevant (tag-array shape, ID format, author tag
  convention); the dead per-domain enum history is dropped.
- New import: `from artifact_tags import write_artifact_tags,
  TagValidationError`.
- `handle_artifact_register`: loose `_coerce_tags` swapped for
  strict `validate_artifact_tags` (bare slugs now 400, never silent
  drops); `tags` removed from the INSERT column list (schema
  default seeds, then `write_artifact_tags` applies the real set);
  manual per-tag `usage_count` UPDATE loop removed (subsumed).

### NEW — `tools/check_single_tag_writer.py` (253 lines, 7,907 bytes)

§4.5.1(b) verification, checked in. Scans `.py`, `.html`, `.sql`,
`.mjs`, `.js`, `.ts` files under the repo root and matches:

```
UPDATE artifacts ... tags = ...
INSERT INTO artifacts(... tags ...) VALUES (...)
```

Excludes only the one permitted writer (`core/artifact_tags.py`),
this script itself, and runtime asset/sandbox directories
(`_cowork/`, `core/backups/`, `catalogs/`, etc.).

**Token-aware for Python.** A naive multi-line regex would
false-positive on `imgserver.py`'s dynamic SQL (e.g.
`UPDATE artifacts SET {','.join(sets)} WHERE id=?` where the
inserted column list deliberately omits `tags=?`). Because Python
has no `;` statement terminator to bound the regex, the lazy match
would drift past the dynamic SQL into an unrelated mention of
`tags`. The script uses `tokenize` to extract STRING tokens and
runs the patterns inside each literal independently, so a
violation must satisfy "UPDATE artifacts AND tag-write live in the
same string literal." For non-Python files a looser whole-file
regex is sufficient.

Exit code 0 on pass, 1 on any violation. Adopt in CI / pre-commit
to lock the rule in.

## The eight `artifacts.tags` writers, before and after

| # | File | Function | Before Crit 3 | After Crit 3 |
|---|---|---|---|---|
| 1 | `imgserver.py` | `handle_artifact_save` (INSERT) | inline INSERT with `tags` column | INSERT without `tags`; `write_artifact_tags` after |
| 2 | `imgserver.py` | `handle_artifact_save` (UPDATE) | inline `tags=?` in SET clause | `write_artifact_tags` in same txn |
| 3 | `imgserver.py` | `handle_artifact_update` | inline `tags=?` + manual `adjust_tag_usage` | `write_artifact_tags` |
| 4 | `imgserver_extensions.py` | `handle_artifact_register` | inline INSERT with `tags` column + manual usage-count loop | INSERT without `tags`; `write_artifact_tags` after |
| 5 | `imgserver.py` | `handle_tag_update` (rename sweep) | §8.4 violation: inline `UPDATE artifacts SET tags=?` loop | `write_artifact_tags` per artifact |
| 6 | `imgserver.py` | `handle_tag_reject` (remove/replace sweep) | §8.4 violation: inline loop + manual usage_count transfer | `write_artifact_tags` per artifact |
| 7 | `imgserver.py` | `handle_tag_merge` (sweep) | §8.4 violation: inline loop | `write_artifact_tags` per artifact |
| 8 | `imgserver.py` | `handle_tag_bulk_delete` (sweep) | §8.4 violation: inline loop | `write_artifact_tags` per artifact |

## Verification — Step 6 results

Run against a throwaway copy of the live DB (live DB untouched).

| Step | Path | Result |
|---|---|---|
| 6.1a | YouTube-style POST `/api/artifact-register` with 6 namespaced tags | Artifact `MV-20260518-004` registered; tags persisted: `[album:run_with_the_hunt, content_kind:official, exhibit:hunter_root, people:hunter_root, platform:youtube, year:2026]` |
| 6.1b | Same endpoint with a bare slug `bare_slug_bad` | 400: `invalid tag 'bare_slug_bad': bare slug (no namespace:) — §3.1 / §3.2` |
| 6.2a | Curation edit via POST `/api/artifact-update` adding `mood:snarky` | `added=['mood:snarky'], removed=[]`; tags survived correctly |
| 6.2b | Same endpoint with a bare slug `bare_bad` | 400; tag state unchanged (no partial write) |
| 6.3 | Vocab Admin rename via POST `/api/tag-update` from `mood:snarky` to `mood:cheeky` | Sweep updated the carrying artifact; new vocab row has `usage_count=1`; old vocab row deleted |
| 6.4 | `python tools/check_single_tag_writer.py` against live tree | 18 files scanned, 0 violations, exit 0 |
| 6.5 | Same script against a synthetic violator file | 1 violation reported, exit 1 — negative case caught |

Live-data §3.1 sweep before changes: 88 artifacts, 0 tag instances
failing the strict validator — Crit 1's migration outcome is
durable under the stricter gate.

### Artifact-count reconciliation (80 → 88)

Crit 1's report listed per-artifact diffs for 80 artifacts; the
Crit 3 sweep saw 88. The 8-artifact delta, confirmed by a read-only
DB query and cross-referenced against MV's git log (commits
`ff31e30`, `0ac1a59`), is benign:

| ID | Created | Status | Platform | Tags | Why not in Crit 1 report |
|---|---|---|---|---|---|
| `MV-20260419-001` | 2026-04-19 | released | local | `[]` | Empty tag set — nothing for Crit 1 to migrate |
| `MV-20260419-002` | 2026-04-19 | released | facebook | `[]` | Empty tag set |
| `MV-20260419-004` | 2026-04-19 | released | (none) | `[]` | Empty tag set |
| `MV-20260510-002` | 2026-05-10 | vault | youtube | `[]` | Empty tag set (YouTube thumbnail row, pre-tagging) |
| `MV-20260510-003` | 2026-05-10 | vault | youtube | `[]` | Empty tag set (YouTube watch row, pre-tagging) |
| `MV-20260518-001` | 2026-05-18 10:34 | released | youtube | 8 namespaced | Post-dates Crit 1 (08:41); Reverend YouTube video from v5-6 Ops seed |
| `MV-20260518-002` | 2026-05-18 10:34 | vault | youtube | 4 namespaced | Reverend thumbnail child |
| `MV-20260518-003` | 2026-05-18 10:34 | vault | youtube | 4 namespaced | Reverend transcript child |

All three Reverend artifacts were born fully namespaced (the v5-6 Ops
seed used canonical vocabulary directly — `album:arkansas`,
`song:reverend`, `exhibit:hunter_root`, etc.). They are the Crit 2
YouTube-capture-path artifacts mentioned in the prompt. The five
empty-tag rows are vacuously compliant. No action needed.

## §4.5.1 enforcement, per sub-clause

§12.3's literal completion criterion is: "Exactly one coordinated
mechanism writes `artifacts.tags`; the §8.4 overwriter is removed;
the §4.5.1(b) grep-check passes." It names (a) implicitly (via "one
coordinated mechanism") and (b) explicitly. **It does not require
(c).** Criterion 3 therefore closes with (c) deferred — that's a
spec-anticipated deferral, not a shortfall.

| Clause | Mechanism | Status |
|---|---|---|
| (a) Structural — only the shared writer contains SQL writing `artifacts.tags` | `core/artifact_tags.py::write_artifact_tags` is the only function with `UPDATE artifacts ... SET tags = ...`; no `INSERT INTO artifacts(... tags ...)` anywhere | pass |
| (b) Verification — greppable check | `tools/check_single_tag_writer.py`, checked in, exit non-zero on violation | pass |
| (c) Provenance — export / sync forbidden from writing `tags`, stated in their headers | n/a — no candidate writer in MV today (see below) | deferred — justified (not required by §12.3) |

On (c) specifically: no MV-side sync job exists. The museum's
`tools/export-artifacts.mjs` lives in a different repo, reads MV
via `GET /db`, and never writes back. There is no header on which
to place the prohibition because there is no candidate writer.
Clause (c) becomes required if and when an MV-side sync job is
introduced, or the museum-side export gains write authority; at
that point the new code's header MUST carry the §4.5.1(c)
prohibition explicitly. Tracked here for that future change. Crit 3
is genuinely complete under §12.3's wording even with (c) deferred.

## Working-tree state at restore-point

`git status` at HEAD `9b0190f` showed an empty modified-tracked list
and several untracked files (Mike-approved leave-as-is at Step 0):

- `_cowork/v10_add_vocabulary_table.py`, `_cowork/v11_cleanup_legacy_tag_patterns.py` — May-13 migration scripts
- `core/__deltest`, `core/__deltest-journal`, `core/__isotest`, `core/__test_sibling` — 0-byte sandbox probe files
- `core/backups/` — Crit 1 backup directory
- `core/bak_pre_migrate-vocabulary-pass{1,2}_*.sqlite` — May-13 migration backups

None were touched.

## Sandbox notes

CLAUDE.md FUSE quirks #1 and #8 fired hard on this session: bash's
view of the modified Windows files truncated at the original
byte-count, even though the Read tool / Windows host saw the full
updated content. The workaround was the rm+write Python pattern,
using `git show HEAD:core/imgserver.py` (and the matching extensions
file) as the source-of-truth original plus a deterministic
string-replace script in `outputs/apply_crit3_edits.py` and
`outputs/apply_crit3_extensions.py`. After those rewrites, bash
saw both files at the correct full size and Python import + tests
ran cleanly. Future sessions: for edits to MV runtime files larger
than the original byte-count, prefer the rm+write pattern from the
start rather than the Edit tool.

## What's NOT in this change

- No commit. Mike pushes from Windows; the diff is ready for his
  review.
- No touch on `tools/export-artifacts.mjs` in the museum repo
  (the §4.5.1(c) header note for a future sync-write path).
- No revisit of the 30-vs-35 routes mismatch in `imgserver.py`'s
  header docstring — pre-existing drift, unrelated to Crit 3.
- Criteria 4–8 untouched (per scope).

## Files in this change

```
core/artifact_tags.py                 NEW   (183 lines / 7,178 bytes, LF)
core/imgserver.py                     MOD   (1,648 → 1,731 lines, LF)
core/imgserver_extensions.py          MOD   (564 → 599 lines, LF)
tools/check_single_tag_writer.py      NEW   (253 lines / 7,907 bytes, LF)
core/backups/mediavault.pre-criterion3-20260518-201040.sqlite   NEW (backup)
```

`git diff --stat HEAD` after LF normalization: 209 insertions, 89
deletions across the two modified files — that's the real change
size. (Mid-session a CRLF rewrite briefly inflated this to 2,330/2,210
before normalization back to HEAD's LF convention.)

Restore point: `git checkout 9b0190f -- core/imgserver.py core/imgserver_extensions.py && rm core/artifact_tags.py tools/check_single_tag_writer.py` (the DB backup is the recovery for any data-side issue, but Step 6 confirms the live DB was never touched by this work).

---

## Task 1 follow-up — `_cowork/` allowlist tightening — 2026-05-19T00:23:52Z

`tools/check_single_tag_writer.py` updated to remove the wholesale
`_cowork/` exclusion. `_cowork/` is now scanned like any other
directory; five named historical migration scripts are allowlisted
by exact relative path:

- `_cowork/v05_phase1_migration.py`
- `_cowork/v05_phase2_vocab.py`
- `_cowork/v08_phase_v5_6_seed_reverend.py`
- `_cowork/v09_phase_v5_6_recanonicalize_reverend.py`
- `_cowork/v11_cleanup_legacy_tag_patterns.py`

Any other `.py` file in `_cowork/` writing `artifacts.tags` now fails
the check.

### Re-run against the live tree (expect exit 0)

~~~
º4.5.1(b) single-writer check
  root:                C:\AI\Platform\MediaVault
  permitted writer:    core\artifact_tags.py
  files scanned:       28
  violations found:    0

OK ù single coordinated writer for artifacts.tags holds.
~~~

Exit code: **0**

### Synthetic-violation test (expect exit 1)

Created `_cowork/_test_violation_DELETE_ME.py` containing a direct
`UPDATE artifacts SET tags = ?` and re-ran the check.

~~~
º4.5.1(b) single-writer check
  root:                C:\AI\Platform\MediaVault
  permitted writer:    core\artifact_tags.py
  files scanned:       29
  violations found:    1

VIOLATIONS ù second writer of artifacts.tags detected:

  _cowork\_test_violation_DELETE_ME.py:10  [UPDATE]  UPDATE artifacts SET tags =

º4.5 forbids any tag-write outside core/artifact_tags.py.
Route every artifacts.tags write through
  write_artifact_tags(conn, artifact_id, new_tags)
~~~

Exit code: **1**

Throwaway file deleted after the test.

### Status

Diff is uncommitted; backup of the pre-edit script at
`tools/check_single_tag_writer.py.bak_pre_allowlist`. No other files
were changed.

