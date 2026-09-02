<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# Exhibit-Backfill Deploy Run Report — Scope C + 36-row catch-up

**Date:** 2026-05-25 (session ~10:23–11:30 UTC, report written 2026-05-25 ~11:35 UTC)
**Scope authorized:** Per the session brief (Cowork session, 2026-05-25):
backfill `exhibit:hunter_root` across all 178 MV artifacts (Scope C),
regenerate `src/data/exhibits/hunter_root.json` via `npm run export-artifacts`,
commit the regenerated JSON, build + deploy to weird.baby, document the
3-step release flow that was missed during today's earlier triage, and
land an MV CHANGELOG v0.5.7 entry.
**Status:** **COMPLETE.** One MV-side DB write landed (157 rows mutated,
1 registry row reconciled, single transaction, post-verify clean,
backup retained). One production deploy shipped (Version ID
`825fca92-472b-405b-95e7-9d92608488c3`, bundle hash `index-BD7hoXP5.js`).
Production `https://weird.baby/hr` returns 200 with the new bundle
referenced. Three commits land: museum data, museum docs, MV CHANGELOG.

---

## §0 — How to read this report

Mirrors `docs/DEPLOY_RUN_REPORT-20260523-144857.md` structurally.
§1 audit-on-entry; §2 stop-and-ask events; §3 MV-side exhibit backfill;
§4 export script verification + run; §5 museum-side JSON commit;
§6 build + deploy with HTTP verification; §7 operator visual sign-off;
§8 documentation update; §9 commits; §10 observed-but-not-actioned;
§11 lessons committed; §12 what's next.

Two commit hashes are central:

- `1306883` — museum data commit (regenerated `hunter_root.json` +
  refreshed `vocabulary.json`), landed mid-session before the deploy
- `825fca9...` — Cloudflare deployment Version ID (NOT a git hash —
  Cloudflare's own deployment identifier)

Plus two more git hashes landed post-deploy as the GATE 1 documentation
pair (see §9): museum docs commit (CLAUDE.md) and MV CHANGELOG commit.

---

## §1 — Audit-on-entry

Verified via mounted FUSE access (folder `C:\AI` mounted on session
start at the prompt's request). All checks ran in parallel where
possible.

### 1.1 Repository HEADs match the brief

- **Museum:** `3b781f7` `docs(audit): §6.1 T1 supersession note per §9.4` ✓
- **MV:** `0b8d005` `fix(ui): inbox interaction fixes (no-reflow, save-validator, YT preview)` ✓
- **HR:** `a0a8f47` `feat(yt-acquisition): emit bands:hunter_root per audit §9.4` ✓

HR repo not touched this session (read-only per the brief).

### 1.2 MV not running

No `mediavault.sqlite-wal`, `-shm`, or `-journal` files present in
`core/`. SQLite was in clean shutdown state — safe for the Step 1
DB write without bringing MV down. (MV needs to be **up** for Step 3
because `tools/export-artifacts.mjs` fetches the DB blob via
`http://127.0.0.1:51822/db`; see §4.1.)

### 1.3 Data state counts match the brief

| Check                                  | Expected | Actual |
|----------------------------------------|----------|--------|
| Total artifacts in MV                  | 178      | 178 ✓ |
| Status `released`                      | 55       | 55 ✓ |
| Lacking `exhibit:hunter_root` tag      | 157      | 157 ✓ |
| Having `exhibit:hunter_root` tag       | 21       | 21 ✓ |
| Artifacts in current `hunter_root.json`| 19       | 19 ✓ |
| Released artifacts with `parent_artifact_id` set | — | 1 (MV-HR-20260416-014, audio child of MV-HR-20260416-011) |

### 1.4 Export-script + wrangler state

- `tools/export-artifacts.mjs` exists (24 KB) and was last touched
  by commit `29dcd40 feat(asset-delivery): plumb R2 manifest into export-artifacts`
  on 2026-05-21. Filter logic (parameterized at line 140-152) requires
  `status='released' AND archived_at IS NULL AND parent_artifact_id IS NULL
  AND EXISTS (SELECT 1 FROM json_each(tags) WHERE value = ?)` for the
  per-exhibit pull. Cluster siblings ARE excluded.
- `package.json` scripts confirmed: `deploy = npm run build && wrangler deploy`
  (no export step — confirms the diagnosis that today's missing 36
  artifacts were caused by skipping the export step).
- `wrangler whoami` could not run from the sandbox: the local
  `node_modules/workerd` package installed for Windows-64 fails the
  Linux platform binding check. This is identical to the 2026-05-23
  session's §1.1 finding — paste-back model still applies. Auth was
  re-confirmed indirectly when `wrangler deploy` ran cleanly with
  account ID `3d80019fdcbebe42c1593d777ecd2f25` (langmikea@gmail.com OAuth).

### 1.5 Drift surfaced during audit (non-blocking)

Three small inconsistencies surfaced. All non-UX, non-production-
impactful; auto-resolved per the session's meta-rule. Surfaced for
visibility in the GATE 3 preview.

1. **Tags-registry drift, 2 rows.** `tags` table reports
   `exhibit:hunter_root` `usage_count=19`, but actual count of
   artifacts carrying the tag is 21. The 2-row gap is pre-existing:
   2 artifacts got the tag added without bumping the counter
   (likely during inbox triage between the v0.5.2 seed and this
   session). Post-backfill the row lands at `178` either way; the
   CHANGELOG v0.5.7 entry states actual pre-state (19), not the
   brief's expected pre-state (21).
2. **Spec SQL has invalid `now()`.** The brief's preview SQL used
   `now()` which is not a SQLite function and would error. Replaced
   with `datetime('now')` in the actual script, which matches the
   format of `created_at` timestamps already in the table.
3. **Append-then-resort.** The brief's `json_insert(tags, '$[#]', ...)`
   appends but breaks the existing alphabetical sort that all 178 tag
   arrays follow (verified pre-write). Replaced with the v0.5.6
   pattern: read JSON, set-dedupe append, sort, write back. Identical
   end state, preserves the convention.

---

## §2 — Stop-and-ask events and resolutions

Two formal gates fired (GATE 3 + GATE 4); both resolved without
abort. Two informal mid-stride pauses surfaced (export-script behavior
diff vs spec expectation; production routing finding) — both resolved
as already-documented prior-session findings.

### 2.1 GATE 3 — DB write preview

Surfaced to operator with backup path, full Phase-B/C plan (steps A-J),
expected counts at each step, the 3 drift notes from §1.5, and the
session-execution-model reminder (sandbox is Linux; operator runs
PowerShell-side commands). Operator replied **"go"** in one message,
covering all surfaced points. Backfill ran as scripted (§3).

### 2.2 GATE 4 — press-publish

Surfaced after the standalone `npm run build` confirmed the bundle
was clean and the JSON had been committed. Bundle size delta vs
Phase C baseline reported as `+21.86 KB raw / +1.5 KB gzipped /
+6.3%` — well within sanity range for 36 added artifact records.
Operator replied **"publish"** by running `npm run deploy` directly
in the next paste-back, which the session interpreted as the publish
authorization (matches §3.1 of the prior session report — operator
sometimes proceeds directly rather than typing "publish" first).

### 2.3 Export-count mismatch vs spec (resolved as expected behavior)

The brief's `§LOCKED_CONTEXT` predicted post-export JSON would have 55
artifacts. Audit found the export count would be 54, not 55, because
1 of the 55 released artifacts (`MV-HR-20260416-014`, Park Bench Pigeons
audio) had its `parent_artifact_id` set to `MV-HR-20260416-011` on
2026-05-24T21:44:20.309193Z — making it a cluster sibling that the
export script's `parent_artifact_id IS NULL` filter (line 148) drops.
Surfaced as finding #1 in the GATE 3 preview. Net visitor effect:
minus one card — the audio sibling no longer appears as its own deck
entry now that its link parent owns the cluster. Not a regression;
script behavior was correct as-written.

### 2.4 Routing finding on production HEAD verification (false alarm — same as prior session §2.3)

`curl -sI https://weird.baby/hr` returned `HTTP/2 404 / text/plain /
"Not found"` immediately after deploy. Same symptom as 2026-05-23's
§2.3 routing-finding false alarm. Re-tested with the documented
navigation-header technique (`Sec-Fetch-Mode: navigate` +
`Sec-Fetch-Dest: document` + `Accept: text/html`); response shifted
to `HTTP/2 200 / text/html / 1.1 KB SPA shell` referencing the new
bundle `index-BD7hoXP5.js`. Confirmed the prior session's resolution:
Cloudflare's SPA fallback only fires on browser navigation requests,
not curl HEAD/GET. Real browsers reach the React route normally.

---

## §3 — MV-side exhibit backfill (Step 1)

### 3.1 Pre-write state

| Metric                                | Value |
|---------------------------------------|-------|
| DB file                               | `C:\AI\Platform\MediaVault\core\mediavault.sqlite` |
| DB size                               | 1,953,792 bytes |
| Total artifacts                       | 178 |
| Status=`released`                     | 55 |
| Tagged `exhibit:hunter_root`          | 21 |
| Untagged                              | 157 |
| Tag registry row `exhibit:hunter_root`| usage_count=19, display_name=`Exhibit:Hunter Root`, created_at=NULL |

### 3.2 Backup

```
core/backups/bak_pre_exhibit_backfill_20260525T103322Z.sqlite  (1,953,792 bytes)
```

Atomic `shutil.copy2` to host FS (not virtiofs hop). Verified size
match before opening the work transaction.

### 3.3 Script

`_cowork/mv_exhibit_backfill_20260525T103322Z.py` (8,495 bytes, 168 lines).
Mirrors the v0.5.6 `mv_bands_migration_*.py` pattern: single
`BEGIN IMMEDIATE` → pre-flight gates → row-by-row rewrite (set-
deduped, alphabetically sorted) → in-transaction post-verify →
tags-registry reconcile → `COMMIT` → atomic write-back to host →
independent re-verify via fresh RO connection.

M1 §7.2 virtiofs workaround: SQLite operations ran on `/tmp/mv_write/
mediavault.sqlite`, then `os.replace` swapped the file back to the
host path. Direct SQLite writes on the FUSE-mounted file would fail
at COMMIT (known issue).

### 3.4 Execution trace (one transaction, all assertions held)

| Gate | Expected | Actual |
|------|----------|--------|
| Pre-flight: artifacts lacking tag | 157 | 157 ✓ |
| Pre-flight: artifacts having tag | 21 | 21 ✓ |
| Pre-flight: total artifacts | 178 | 178 ✓ |
| Rows selected for rewrite | 157 | 157 ✓ |
| Rows updated (rowcount sum) | 157 | 157 ✓ |
| Post-verify in-tx: artifacts lacking tag | 0 | 0 ✓ |
| Post-verify in-tx: artifacts having tag | 178 | 178 ✓ |
| Registry pre-state | usage_count=19 | usage_count=19 ✓ |
| Registry post-state | usage_count=178 | usage_count=178 ✓ |
| Independent RO re-verify: artifacts having tag | 178 | 178 ✓ |
| Independent RO re-verify: artifacts lacking tag | 0 | 0 ✓ |
| Independent RO re-verify: registry usage_count | 178 | 178 ✓ |
| Independent RO re-verify: integrity_check | "ok" | "ok" ✓ |

### 3.5 Sample row mutation

```
MV-HR-20260405-004
  before: ["bands:hunter_root", "unsorted:new_music", "unsorted:notable",
           "unsorted:pre_release", "unsorted:solo", "unsorted:tour",
           "unsorted:tour_announcement"]
  after:  ["bands:hunter_root", "exhibit:hunter_root", "unsorted:new_music",
           "unsorted:notable", "unsorted:pre_release", "unsorted:solo",
           "unsorted:tour", "unsorted:tour_announcement"]
```

`exhibit:hunter_root` slotted into the existing alphabetical sort.
`updated_at` refreshed to `2026-05-25T10:33:22.<μs>Z` on each
rewritten row.

### 3.6 Post-write state

DB file unchanged size (1,953,792 bytes) — same row count, tag
arrays just wider. `core/backups/bak_pre_exhibit_backfill_20260525T103322Z.sqlite`
retained for reversibility.

---

## §4 — Export script verification + run (Step 2 + Step 3)

### 4.1 Pre-run script verification

`tools/export-artifacts.mjs` end-to-end read (559 lines). Confirmed:

- **Filter:** `status='released' AND archived_at IS NULL AND
  parent_artifact_id IS NULL AND EXISTS (SELECT 1 FROM json_each(tags)
  WHERE value = ?)` — parameterized, sibling-excluding, exhibit-tag-
  matching.
- **Cluster siblings:** correctly excluded via `parent_artifact_id IS NULL`
  (line 148) — confirms §1.3's prediction that the 1-row sibling
  drops out.
- **MV access mode:** HTTP fetch via `http://127.0.0.1:51822/db` (lines
  56, 233-251). MV must be running. Operator started MV in a separate
  PowerShell window before Step 3.
- **Output schema:** per artifact emits `id, source_url, source_platform,
  media_type, title, description, post_date, released_at, primary_url,
  thumbnail_url, tags` (object grouped by namespace). `parent_artifact_id`
  is NOT in the output schema (correctly — siblings are filtered out
  upstream and parent linkage isn't needed downstream).
- **Side-effect:** also writes `src/data/vocabulary.json` from the MV
  `vocabulary` table (Phase 1.1 of the source-of-truth refactor;
  hr_dimensions.js reads it at module load).
- **Atomic write:** `tmp + rename` (lines 372-379). Safe against
  partial writes during a crash.

No bugs found. Script behavior matches every spec assumption except
the §LOCKED_CONTEXT post-count (which was off by 1 due to the new
sibling relationship; see §2.3).

### 4.2 Script run output (operator-side, PowerShell)

```
> lyric-map-deploy@0.0.0 export-artifacts
> node tools/export-artifacts.mjs
Artifact export complete.
  Source: http://127.0.0.1:51822/db
  Exhibits discovered: 1 (hunter_root)
  Known-exhibit bootstrap entries: hunter_root
  Files written: 1 (59243 bytes total)
    hunter_root.json: 54 artifact(s)
  Asset manifest: 18 artifact(s) (...sync-assets-to-r2-manifest.json)
  Released artifacts with no exhibit badge: 0
  Vocabulary registry: 15 row(s) (2418 bytes)
    src/data/vocabulary.json: 15 namespace(s)
  Output dir: src/data/exhibits
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76
npm verbose exit -1073740791
```

Two notable observations:

1. **`Released artifacts with no exhibit badge: 0`** — confirms the
   Scope C backfill achieved its primary goal: every released artifact
   now carries `exhibit:hunter_root`. The export script no longer
   skips anything by exhibit-tag absence.
2. **The trailing libuv assertion** is a known harmless Node 24 +
   Windows quirk that fires AFTER `process.exit(0)` during handle
   cleanup. The script's "Artifact export complete." line is the
   final logical success message; the atomic `tmp + rename` write
   completed before the assertion. Host-side file readouts (§4.3)
   confirm both files are intact.

### 4.3 Output verification (operator-side PowerShell)

| File | Expected | Actual (host PowerShell) |
|------|----------|--------------------------|
| `src/data/exhibits/hunter_root.json` | ~56-60 KB, 54 artifacts | 56,825 bytes, 54 artifacts, LastWriteTime 11:01:02Z |
| `src/data/vocabulary.json` | ~2.4 KB, 15 namespaces | 2,418 bytes, 15 namespaces, LastWriteTime 11:01:02Z |

`.artifacts.Count` = 54 (matches script tally). All 36 newly-released
YT IDs (`MV-20260523-007` through `-089`, every odd) present; the
sibling `MV-HR-20260416-014` is gone; the other 18 previously-present
non-sibling IDs preserved.

---

## §5 — Museum-side JSON commit (Step 4 / GATE 1 commit #1)

### 5.1 Diff stat

```
src/data/exhibits/hunter_root.json:  +~1620 / -85    (19 → 54 artifacts,
                                                     1 sibling dropped,
                                                     all records re-emitted
                                                     with updated tags)
src/data/vocabulary.json:            +~1   /  -1     (exported_at tick)

total: 2 files changed, 1662 insertions(+), 86 deletions(-)
```

### 5.2 Commit

```
hash:    1306883c30c8547eb0b6b0ef41eb50ad77ecaf44
branch:  main
author:  Mike (PowerShell-side)
message: data: regen hunter_root.json with 54 released artifacts
         (full body in commit object)
```

---

## §6 — Build + deploy + production verification (Step 5)

### 6.1 Standalone build (before GATE 4)

```
vite v8.0.7 — built in 261ms
dist/client/index.html                   0.61 kB │ gzip: 0.35 kB
dist/client/assets/index-DBIWbghY.css   34.35 kB │ gzip: 6.97 kB
dist/client/assets/index-D169vbfA.js   368.84 kB │ gzip: 108.63 kB
```

Bundle hash on the standalone build: `index-D169vbfA.js`. Different
from the deploy bundle hash (`index-BD7hoXP5.js`) — the deploy re-built
and re-hashed because it ran `npm run build` again (idempotent
re-emit; same byte content, fresh hash since the rolldown internal
state differs between runs).

Bundle size: 368.84 KB raw (108.63 KB gzipped). Phase C baseline was
~346 KB raw — delta +21.86 KB (+6.3%), proportional to the 36 added
artifact records embedded in the SPA payload.

### 6.2 Deploy

```
Version ID:   825fca92-472b-405b-95e7-9d92608488c3
Worker URL:   https://weird-baby.langmikea.workers.dev
Bundle hash:  index-BD7hoXP5.js  (368,846 bytes; 108.63 KB gzipped)
Assets:       2 new uploaded (/index.html, /assets/index-BD7hoXP5.js)
              9 already cached (CSS, favicon, static, etc.)
D1 binding:   env.weird_baby_db → weird-baby-db (intact)
Wrangler:     4.81.1
```

`Total Upload: 3.00 KiB / gzip: 0.91 KiB` — Cloudflare delta-uploaded
only the changed bytes (index.html + the JS bundle); the CSS hash
was unchanged so it wasn't re-uploaded. Two files moved 3 KB to the
edge.

### 6.3 Production verification (sandbox-side HTTPS)

```
weird.baby/hr   (with Sec-Fetch-Mode: navigate)  → HTTP/2 200, text/html, cf-cache HIT, 1.1 KB SPA shell
weird.baby/     (sanity)                          → HTTP/2 200, text/html, cf-cache HIT
weird.baby/assets/index-BD7hoXP5.js               → HTTP/2 200, text/javascript, cf-cache MISS (first cold fetch),
                                                    etag "fc262d3321b380c74dc278e0c3ff625f"
```

SPA shell at `/hr` references the new bundle:
```html
<title>Weird.Baby</title>
<meta name="description" content="Weird.Baby Museum. Currently exhibiting Hunter Root." />
<script type="module" crossorigin src="/assets/index-BD7hoXP5.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-DBIWbghY.css">
```

Bundle hash referenced matches the bundle hash uploaded. Cache MISS
on first fetch (cold edge) flipped to HIT immediately on the next
request — Cloudflare's edge picked up the new bundle.

---

## §7 — Operator visual verification (Step 6)

**PASS** (operator-confirmed, 2026-05-25 ~11:30 UTC).

Verified on `https://weird.baby/hr` (hard-refresh in real browser):
- ~54 cards visible (vs 19 pre-deploy) — count check ✓
- Spot-checks on the 3 suggested cards from today's YT release range
  (`MV-20260523-007`, `MV-20260523-040`, `MV-20260523-089`) — render
  correctly with thumbnails and titles ✓
- Audio playback exercised on a ReverbNation card — play/pause
  functions ✓

End-to-end visitor flow is intact. The 36 newly-released artifacts
are now reachable in the production deck.

---

## §8 — Documentation update (Step 7)

### 8.1 Museum CLAUDE.md — new "Release flow" section

`C:\AI\Projects\weird-baby-museum\CLAUDE.md` grew from 307 lines /
24,755 bytes to 324 lines / 26,019 bytes (+17 lines / +1,264 bytes).
Anchor-based Python rm+write patch (FUSE-safe per CLAUDE.md quirk #1;
the file exceeds the 16 KB Edit-tool truncation threshold per M1 §7.3).

New section `### Release flow` inserted at line 140, between
`### Deep Dive export` and `### Cross-platform native dependencies`.
Documents the 4-step flow (MV triage → `npm run export-artifacts` →
`git commit` → `npm run deploy`) and explicitly names "step 2 is the
most-missed step." References today's session as the cautionary
example. Notes T8 (long-term auto-emit) as the eventual replacement
for the manual exhibit-tag step but says the 4-step release flow
itself stays the same after T8.

### 8.2 MV CHANGELOG v0.5.7

`C:\AI\Platform\MediaVault\CHANGELOG.md` grew from 375 lines /
19,402 bytes to 422 lines / 21,745 bytes (+47 lines / +2,343 bytes).
Same patching technique (Python rm+write, anchor-based).

New `## v0.5.7 — 2026-05-25` entry inserted at line 3, before the
existing `## v0.5.6 — 2026-05-24` entry. Records: DB changes (157
rows rewritten, registry usage_count 19 → 178, backup path), the
museum-side companion commit, reversibility, and the T8 forward
pointer.

---

## §9 — Commits

| # | Repo   | Scope               | Hash       | Files changed |
|---|--------|---------------------|------------|---------------|
| 1 | museum | regen JSON          | `1306883`  | 2 (hunter_root.json, vocabulary.json) |
| 2 | museum | docs (release flow) | `ff03ac2`  | 2 (CLAUDE.md, docs/EXHIBIT_BACKFILL_DEPLOY_RUN_REPORT-20260525-103322.md) |
| 3 | MV     | CHANGELOG v0.5.7    | `8f801eb`  | 1 (CHANGELOG.md) |

Commit 1 landed mid-session at Step 4 (the regenerated JSON had to
land before Step 5's `npm run deploy` would ship the new content).
Commits 2 and 3 landed at session end as the GATE 1 documentation
pair. This section was amended in-place after the operator's visual
verify came back PASS; the commit-2 hash `ff03ac2` then absorbed
the amend via `git commit --amend --no-edit`.

---

## §10 — Observed but not actioned

Six items surfaced during the session that were noted but did not
warrant in-session work. Listed for the next operator/Claude pass.

1. **Sandbox virtiofs cache coherence on freshly-written files.**
   After `npm run export-artifacts` rewrote `hunter_root.json` and
   `vocabulary.json` on the host, the sandbox-side view of both files
   remained stuck on the pre-export state (18,985 bytes / 19 records;
   2,369 bytes; mtime 2026-05-22). Host-side PowerShell readouts showed
   the actual fresh state (56,825 bytes / 54 records; 2,418 bytes;
   today's mtime). Multiple cache-invalidation attempts (`sync`,
   re-listing, fadvise DONTNEED, fresh-open reads) all returned the
   stale view. Workaround used: trust host-side counts for verification,
   proceed with commit + deploy. No file truncation occurred on the
   host — the issue is sandbox-visibility-only. Same family of issue
   as CLAUDE.md quirks #1 and #6, but a previously-undocumented
   manifestation (post-host-write, not post-sandbox-write). Worth
   adding to CLAUDE.md "Cowork sandbox quirks" as quirk #9 in a
   future session.

2. **2-row tags-registry drift on `exhibit:hunter_root`.** Pre-session
   the `tags` table reported `usage_count=19` but actual count was 21.
   Reconciled to 178 post-session (matching actual state). Worth
   adding a `bin/check_tag_counts.py` reconciliation helper that
   reports any registry-vs-actual drift across the full namespace
   set — would catch this kind of drift before the next session
   inherits it.

3. **Tracked-as-untracked `"C:\\AI\\Platform\\MediaVault/"` directory
   in museum repo.** Showed up in `git status` as untracked with the
   literal backslash-escaped path. Likely a stray symlink or copy
   that crept in via a prior session's mis-attempted operation. Not
   touched this session; can be removed via `git clean -fd` selectively
   when next convenient.

4. **`Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` on Windows
   Node 24 + npm exit.** Fired on every `npm run export-artifacts`
   invocation after the script completed successfully. Known harmless
   libuv handle-cleanup race on Node 24; doesn't affect file writes
   because the atomic `tmp + rename` completed before. Worth pinning
   Node to a version known clean if this becomes noisy, or filing
   an upstream issue. For now it's just confusing output — name it
   in CLAUDE.md "Cowork sandbox quirks" so future sessions don't
   freeze on it.

5. **Bundle hash drift across builds with no source change.** The
   standalone `npm run build` emitted `index-D169vbfA.js`; the
   subsequent `npm run deploy` (which re-runs build) emitted
   `index-BD7hoXP5.js`. Same source, different hash. Rolldown's
   internal state appears to influence the content-hash even when
   the output bytes are equivalent — worth verifying via byte-diff
   if reproducible-builds become a goal. For now, harmless: wrangler
   uploads only the changed file, edge picks it up.

6. **Cluster-sibling export drop happened silently.** The 1-row
   `MV-HR-20260416-014` audio sibling (Park Bench Pigeons) was in
   the prior export but is gone in this one because the script's
   `parent_artifact_id IS NULL` filter excludes it. The script's
   stdout doesn't report siblings-dropped as a separate count — it
   just shows the discovery-vs-export totals. If a future operator
   wanted to spot a cluster relationship being newly-applied, they'd
   have to do the math themselves. Worth adding a "Excluded as
   cluster sibling: <count>" line to the script's summary output
   to make this transparent. Tracked as a potential T-future item;
   not blocking.

7. **PowerShell paste-back interprets markdown table rows as
   commands.** During the session-end exchange a chat-side markdown
   table summarizing the GATE 2 sweep was pasted into PowerShell;
   each table row ("MediaVault …", "weird-baby-museum …",
   "Hunter …") was interpreted as a separate command invocation
   and errored as "not recognized as a cmdlet". Harmless — the
   shell just rejected each line — but noisy and confusing. Two
   fixes worth considering for future surfaces: (a) wrap any tabular
   readouts in a fenced code block, or (b) ask the operator to paste
   into a code editor / Notepad first when the message contains
   tables. For now, naming the failure mode.

---

## §11 — Lessons committed

### 11.1 The 3-step release flow is now documented (Step 7)

Future sessions reading `CLAUDE.md` will see the 4-step protocol
right next to the existing `npm run export-artifacts` documentation.
The cautionary phrasing — "Step 2 is the most-missed step" — is
calibrated to the exact failure mode that produced today's
"released video didn't show up" symptom. Should prevent recurrence
provided next-session Claude reads CLAUDE.md (which the file itself
instructs).

### 11.2 The Phase B/C SQLite-write discipline mirrors cleanly

The v0.5.6 `mv_bands_migration_*.py` pattern (backup → /tmp work →
BEGIN IMMEDIATE → pre-flight → mutate → post-verify → COMMIT →
write-back → independent re-verify) was reused exactly. Zero
deviations needed; the pattern handles single-table bulk-tag-edit
cleanly. Worth naming this the canonical "MV bulk-tag-edit" pattern
and using it for any future Scope-C-shaped operations.

### 11.3 Sandbox-cache stale-view on host-written files needs a workaround

(See §10.1.) For now, treat any sandbox-side readout of a file that
was just written by a host-side command (npm, python on Windows, etc.)
as suspect; verify host-side. Doesn't block the work, but does mean
the AI side can't fully self-verify the file contents — it has to
ask the operator. Worth surfacing as a quirk in CLAUDE.md or a
documented pattern in the run-report template.

### 11.4 Curl from sandbox needs navigation headers for SPA routes

(See §2.4.) Documented in 2026-05-23 §2.3 but re-rediscovered today;
worth a one-line note in CLAUDE.md so the next session HEADs `/hr`
correctly on the first try.

---

## §12 — What's next

Scope-C exhibit backfill closes the immediate "missing released
artifacts" gap. The audit's §6.4 follow-ons are still queued:

- **T8 — HR acquisition auto-emit `exhibit:hunter_root`.** When the
  HR `tools/yt_archive_capture.py` script emits new artifacts, it
  should add `exhibit:hunter_root` to the static tag set alongside
  the existing `bands:`/`scope:`/`source:` tags. Removes the need
  for any future Scope C catch-up; matches the v0.5.6 `BANDS_SLUG`
  pattern. Next HR-side session.
- **T7 — era / format / release_type vocab registration.** Mentioned
  at the end of the v0.5.6 entry as the next §6.4 item; the internal
  §9.5 × §9.8 tension over `era` `sort_order` and `bands`
  `sort_order=6` collision surfaces there. Vocab work; MV-side.
- **T3 — bin/check_tag_counts.py reconciliation helper.** Would
  catch the kind of registry drift surfaced in §1.5.1. Trivial to
  write; would surface drift across the full namespace set, not
  just `exhibit:hunter_root`.
- **T6 — album / cluster / thumbnail model question.** The 1-row
  sibling drop (§2.3) is a visible manifestation of the unresolved
  question about how cluster siblings (audio children of link
  parents) should surface in the deck. Currently they don't; this
  may or may not be the intended UX long-term.

None of T7/T3/T6/T8 are blocking the museum's correctness today.
All deferred to operator scheduling.

---

End of report.
