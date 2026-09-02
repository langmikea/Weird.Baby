# Phase B Run Report — Asset Delivery, sync + render

**Date:** 2026-05-21 (session ~18:00–21:00 UTC, report written 2026-05-22 01:00:01 UTC)
**Scope authorized:** §6 Phase B items 1-9 per
`docs/ASSET_DELIVERY_SCOPING_BRIEF-20260521-114500.md`, with the
Phase-A-driven prefix (audit-on-entry, apply §3.6 media_type decisions)
from `docs/PHASEA_RUN_REPORT-20260521-181906.md` §6.1.
**Status:** **COMPLETE.** All 9 Phase B items landed, with a **scope reversal
in §2.3 (Option A)** — 3 photo artifacts shipped end-to-end; 15
`media_type='mixed'` audio artifacts deferred to a follow-on scoping
brief. Three Museum commits (`4345551`, `29dcd40`, `bd50bc6`); zero MV
commits (by .gitignore design; MV DB writes are local-only state per
its `.gitignore` header).

---

## §0 — How to read this report

Mirrors the format of `docs/PHASEA_RUN_REPORT-20260521-181906.md`.
§1 audit-on-entry; §2 stop-and-ask events; §3 MV-side writes; §4 R2
mutations and Museum changes; §5 acceptance verification; §6
observed-but-not-actioned; §7 unique findings worth surfacing for
future operator/Claude sessions; §8 what's next.

Phase A was "Cloudflare-side configuration" — its §3 was Cloudflare
mutations. Phase B is "tools written, MV recurated, files committed"
— its §3 is MV-side writes, §4 is everything else.

The session ran ~3 hours active work plus debugging detours. The
detours (sharp HEIC limitation, better-sqlite3 binary mismatch, libuv
assertion) are documented honestly rather than sanitized; future
sessions will hit some of the same things.

---

## §1 — Audit-on-entry results

Per Phase A §6.1, audit-on-entry verified that the going-in state
was intact before any Phase B work started.

### 1.1 Asset inventory still matches brief §1

Direct query of `C:\AI\Platform\MediaVault\core\mediavault.sqlite`,
restricted to `status='released'`. Same shape as Phase A §1.1:

| storage_mode | media_type | n | with_path | with_thumb |
|---|---|---|---|---|
| referenced | mixed | 15 | 15 | 0 |
| url_only | link | 1 | 0 | 0 |
| vaulted | (NULL) | 3 | 3 | 0 |

19 released artifacts, 18 delivery-scope, NULL media_type trio still
NULL at audit time. **MATCH** to Phase A. Delivery scope held.

### 1.2 Repository HEADs match Phase A's exit state

- MV (`C:\AI\Platform\MediaVault`): `0a9e953887e54633019ed86b75b7772c9d9b73ab`. PASS.
- Museum (`C:\AI\Projects\weird-baby-museum`): `6f19057f86eea03f912a4faf2fd94eb70eb6089c`. PASS.
- HR (`C:\AI\Projects\Hunter Root`): `af1486a0b8af7583bff31c1e2fea1ab34a651f03`. PASS (HR untouched in Phase B).
- MV and Museum working trees clean for tracked-file changes;
  untracked residue matches Phase A §5.3 inventory.

### 1.3 Phase A setup intact

- `.env` exists at `C:\AI\Projects\weird-baby-museum\.env`, 422 bytes,
  6 expected keys present. Value lengths verified against Phase A
  §3.5: `R2_ACCOUNT_ID=32`, `R2_ACCESS_KEY_ID=32`,
  `R2_SECRET_ACCESS_KEY=64`, `R2_BUCKET=17`, `R2_PUBLIC_URL=25`,
  `R2_S3_ENDPOINT=65`. All match.
- `.env` is gitignored at `.gitignore:30`. PASS.
- `assets.weird.baby` DNS resolves (Cloudflare A records
  172.67.198.170 / 104.21.68.212 — proxied/flattened CNAME, expected
  shape). PASS.
- NULL-media_type trio still NULL at audit time (per §1.1). PASS.

### 1.4 SQLite tooling discovery

Phase A §1.1 quoted the SQLite blob but did not name the binary used.
For Phase B audit it was discovered that `sqlite3.exe` is on PATH via
WinGet (`SQLite.SQLite`); direct invocation works.

### 1.5 ID-column name corrected

Phase A's report referred to artifacts by `artifact_id` in §3.6's
text. The MV schema column is actually `id` (primary key). Not a
divergence — a colloquialism. All Phase B SQL uses the correct `id`
column name.

---

## §2 — Stop-and-ask events

Six stop-and-ask events surfaced during the session. All six resolved
without aborting Phase B.

### 2.1 SQLite query column name

Initial NULL-trio query used `artifact_id`, returned "no such column"
error. Resolved by `PRAGMA table_info(artifacts)` — column is `id`.
Re-ran successfully.

### 2.2 Option A — scope reversal from 18 → 3 artifacts

**The most significant decision of the session.** Phase B step 2's
on-disk inventory revealed that 15 of the 18 delivery-scope artifacts
were `.mp3` files, not images. Brief §1 had assumed delivery scope
was "mostly photos and HTML snapshots"; the actual breakdown was
**15 audio + 3 images**.

Brief §3.3's LOCKED thumbnail dispatch puts `mixed` in the image
branch (sharp resize). Running 15 MP3 files through sharp would fail
— sharp doesn't decode audio. The brief had no audio branch at all.

Investigation deepened the problem:

- All 15 MP3s are ReverbNation downloads from `runwiththehunt`
  (Hunter Root's discography). Curated, intentional, in-scope content
  — not archive residue.
- The museum's HR routes (`HrMedia.jsx`, `HrArchive.jsx`,
  `HrExhibitFlow.jsx`) have **zero audio playback code**. No
  `<audio>` elements, no playlist component, no audio render layer.
- The exhibit JSON already includes the MP3 records with rich
  metadata (title, bitrate, duration, tags) — they're plumbed to
  the data layer, just not rendered.

So brief §3.3 had a real LOCKED-decision gap (no audio thumbnail
strategy) AND brief §3.5 had a hidden assumption (that a render
layer for audio existed).

Four options presented (A defer all 15 audio; B sync without
thumbnails; C sync + minimal render; D sync + download-link). Option
A chosen. Effects:

- §3.6 decisions from Phase A still apply (the three trio artifacts
  remain `media_type='photo'`; no reversal there).
- Brief §7 "Out of scope" effectively expands: 15 `MV-HR-*` audio
  artifacts deferred to a follow-on scoping brief that handles
  storage shape, thumbnail strategy, AND render layer together.
- Brief §6 step 5 narrowed: sync filter uses `media_type='photo'`,
  not the full delivery scope.
- Phase B ships 3 artifacts proving the full pipeline end-to-end.
  Scaling to 18 is mechanical when audio scoping is settled.

This reversal contradicts Phase A §3.6's decision to include all 18
in delivery scope. Documented here because it IS a real reversal,
not just an implementation choice.

### 2.3 HEIC decode capability in sharp 0.34.5 on Windows

Dry-run revealed `sharp` could read HEIC container metadata but
failed to decode HEVC-compressed image bytes for MV-20260419-001:

```
source: bad seek to 1345203
heif: Error while loading plugin: Support for this compression format has not been built in (11.6003)
```

sharp 0.34.5 on Windows ships with libheif container support but
without the HEVC decoder plugin. The HEIC source is HEVC-compressed
(metadata `"compression":"hevc"`, iPhone 15 capture).

Four options presented (A null thumbnail for HEIC; B transcode
upstream; C dual-decoder fallback in sync script; D rebuild sharp
with full libheif). Option B chosen — see §3.2 for the MV-side
recuration that resolved it.

### 2.4 MV-20260419-001 and -004 had no exhibit badge

Post-step-5 verification revealed only 1 of 3 photos had `primary_url`
in the exhibit JSON. Investigation: MV-20260419-001 (Hunter Root
performance photo) and MV-20260419-004 (Medusa's Disco logo, identified
visually) had `tags=[]` — no `exhibit:hunter_root` badge. Phase A §3.6
added their media_type but not their exhibit tag.

This was a curation gap, not a bug. Option C ("look at the files,
then decide") chosen. Visual review by operator confirmed:

- MV-20260419-001 — Hunter Root performance. Clear fit. Tag added.
- MV-20260419-004 — Medusa's Disco band logo. Per MV docs and source
  search, Medusa's Disco is Hunter Root's pre-solo band (canonical
  spine: Seeds → Medusa's Disco → RWTH → Hunter Root). Fit confirmed.
  Tag added.

Minimum-plan curation chosen: add only `exhibit:hunter_root` (not
the richer `era:medusas`, `album:medusas_disco`, etc.). See §3.3.

### 2.5 PowerShell escape damage in Python heredoc

Step 1b's Python script aborted at parse time with
`SyntaxError: unexpected character after line continuation character`.
Root cause: PowerShell double-quoted here-string `@"..."@` was
processing `\"` escapes in the Python f-string source. Fixed by
switching to single-quoted here-string `@'...'@` (no interpolation,
no escape processing) and using a `__TS__` placeholder for the
timestamp injection.

Lesson committed: all subsequent Python scripts written via
`@'...'@` heredoc + `.Replace('__TS__', $ts)` + `[System.IO.File]::WriteAllText`
with explicit `UTF8Encoding(false)` (no BOM). Same pattern carried
over to JavaScript edits in `export-artifacts.mjs` and
`HrExhibitFlow.jsx`.

### 2.6 PowerShell heredoc length limit when writing the report

A late-session bug: the initial run-report write attempt sent a
~14KB single-quoted heredoc as a single PowerShell command. The
terminal lost the heredoc state partway through; every subsequent
line was interpreted as a fresh command, producing hundreds of parse
errors. No file was written (state check confirmed `$reportPath`
was null at end of failure).

Resolved by writing the report content in a separate workspace and
handing the operator a complete file to save into `docs/`. This
report was produced that way.

Lesson for future long-document writes: prefer file-handoff over
PowerShell heredoc once content exceeds a few KB.

---

## §3 — MV-side writes (Phase B's "configuration changes")

Three writes against MV's `mediavault.sqlite`. All with rule 4 (per
session runbook) discipline: pre-flight verify-count + backup +
transactional UPDATE + abort-on-mismatch + post-verify. Each got its
own timestamped backup in `core/backups/`.

### 3.1 Step 1 — apply §3.6 media_type decisions

Phase A §6.1 step 2 directed: add `media_type='photo'` to the three
NULL-media_type vaulted artifacts.

| Artifact | Before | After |
|---|---|---|
| MV-20260419-001 | NULL | photo |
| MV-20260419-002 | NULL | photo |
| MV-20260419-004 | NULL | photo |

Script: `_cowork/phaseB_step1_apply_media_type.py`
Backup: `core/backups/bak_pre_phaseB_step1_media_type_20260521-143201.sqlite` (1953792 bytes)
Pre-flight match: 3, UPDATE changes: 3 (expected 3). Post-verify confirmed all three.

### 3.2 Step 1b — HEIC recuration

Resolution to §2.3's HEIC decode gap. Decoded
`MV-20260419-001.heic` with `pillow-heif 1.3.0` + libheif 1.21.2
(Python; HEVC decoder included), saved as `MV-20260419-001.jpg`
(quality 92, optimize, progressive, EXIF + ICC preserved). Updated
MV's `local_asset_path` from the .heic to the .jpg.

| Aspect | HEIC source | JPEG output |
|---|---|---|
| Size | 1,345,171 bytes | 1,552,860 bytes (HEVC more efficient than JPEG) |
| Dimensions | 3024×4032 | 3024×4032 (no resize) |
| Format | HEIF/HEVC | JPEG progressive |
| EXIF | 2870 bytes | preserved |
| ICC profile | 536 bytes | preserved |

Script: `_cowork/phaseB_step1b_recurate_heic.py`
Backup: `core/backups/bak_pre_phaseB_step1b_recurate_heic_20260521-145008.sqlite`

HEIC source NOT deleted; it remains on disk at its original path. MV's
`local_asset_path` simply points away from it. If a future curation
pass wants to re-derive the JPEG with different parameters, the HEIC
source is intact.

Pre-flight predicate strict (`id='MV-20260419-001' AND local_asset_path LIKE '%MV-20260419-001.heic'`)
— would have aborted cleanly if someone else had already touched it.
UPDATE changes: 1 (expected 1). Post-verify confirmed the new path
ends in `.jpg` and the JPEG decodes.

### 3.3 Step 1c — add exhibit:hunter_root tags

Resolution to §2.4's curation gap. Added `exhibit:hunter_root` to
the two photos that lacked an exhibit badge.

| Artifact | Before | After |
|---|---|---|
| MV-20260419-001 | `[]` | `["exhibit:hunter_root"]` |
| MV-20260419-004 | `[]` | `["exhibit:hunter_root"]` |

Used SQLite's `json_insert(tags, '$[#]', ?)` for array-append.
Minimum-plan curation: no other namespaces touched (era:, album:,
people:, type:). Other tagging is operator-judgment curation work and
out of Phase B's plumbing scope.

Script: `_cowork/phaseB_step1c_add_exhibit_tag.py`
Backup: `core/backups/bak_pre_phaseB_step1c_add_exhibit_tag_20260521-195000.sqlite`
Pre-flight count: 2, UPDATE changes: 2 (expected 2).

**MV running during write:** Step 1c executed while MV's HTTP loopback
was running (port 51822). No `database is locked` error — MV's SQLite
access cooperates with concurrent writes via standard shared-locking.
Worth knowing for future MV-side writes.

### 3.4 Read-only step 2a — on-disk inventory

Not a write; documented here for the audit trail. Computed SHA-256 hashes,
sizes, and per-artifact metadata for all 18 delivery-scope artifacts.
Output: `_cowork/phaseB_step2a_inventory.json`. Total 83,391,238 bytes
(79.53 MiB), zero missing files, zero hash collisions. The inventory
itself was a stop-and-ask trigger — the file-extension breakdown
revealed the 15-audio situation that drove Option A (see §2.2).

---

## §4 — R2 mutations and Museum changes

### 4.1 R2 objects created

Three Phase B steps wrote to R2:

| Step | Action | Object key prefix |
|---|---|---|
| Step 4a (`--limit 1`) | upload MV-20260419-001 primary + thumbnail | `assets/c1/...jpg` and `thumbnails/0e/...jpg` |
| Step 4b (full sync) | upload MV-20260419-002 + -004 primaries + thumbnails | `assets/a5/...png`, `assets/fc/...jpg`, `thumbnails/b3/...jpg`, `thumbnails/18/...jpg` |

Six objects in R2 at end of session. Total bytes: ~3.2 MB. All
deliveries verified via HEAD against `https://assets.weird.baby/...`
returning HTTP 200 with correct Content-Type and
`Cache-Control: public, max-age=31536000, immutable`.

Step 4b's full-sync correctly skipped MV-20260419-001 (HeadObject
returned 200; idempotency proven). `primary_skipped=1, primary_uploaded=2,
thumb_skipped=1, thumb_uploaded=2, thumb_failed=0`.

### 4.2 Museum source changes — three commits

Brief §6 step 8 disciplined increments:

**Commit `4345551` — `feat(asset-delivery): add R2 sync tool for delivery-scope artifacts`**
Files: `tools/sync-assets-to-r2.mjs` (new, 368 lines), `tools/sync-assets-to-r2-manifest.json` (new, 30 lines), `package.json` + `package-lock.json` (deps: `@aws-sdk/client-s3@^3.1051.0`, `sharp@^0.34.5`, `dotenv@^17.4.2`).

**Commit `29dcd40` — `feat(asset-delivery): plumb R2 manifest into export-artifacts`**
Files: `tools/export-artifacts.mjs` (manifest load + URL dispatch), `src/data/exhibits/hunter_root.json` (regen, 17 → 19 artifacts), `src/data/vocabulary.json` (regen incidental, `vocabulary_csv_sha` → null).

**Commit `bd50bc6` — `feat(asset-delivery): wire PhotoCard renderer for media_type='photo'`**
Files: `src/routes/hr/HrExhibitFlow.jsx` (PhotoCard component + ArtifactCard dispatch update).

**Phase B total diff:** 8 files, +1333/-24 lines. 790 of those insertions are `package-lock.json` (dep tree); actual source code is ~543 new lines of `sync-assets-to-r2.mjs` plus smaller edits elsewhere.

### 4.3 MV repository — zero commits

By design. MV's `.gitignore` explicitly ignores `core/mediavault.sqlite`,
`catalogs/`, `*.bak_pre_*`, and treats `_cowork/` as untracked-by-convention
(per Phase A §5.3). Phase B's MV-side work (3 DB writes, 1 HEIC → JPEG
transcode under `catalogs/`, 4 `_cowork/*.py` scripts, 1 inventory JSON,
3 SQLite backups under `core/backups/`) is entirely invisible to git.

MV HEAD at session start: `0a9e953`. MV HEAD at session end: `0a9e953`. PASS.

### 4.4 Build verified

`npm run build` (Vite v8.0.7) completed cleanly: 45 modules transformed
in client bundle, 4 modules in weird_baby (Workers) bundle. Bundle
contains expected R2 URL strings: 6 occurrences of `assets.weird.baby`,
3 occurrences of `MV-20260419-`, 15 occurrences of `MV-HR-`. Build
size: `dist/client/assets/index-85TUKYWy.js` = 341,583 bytes (104 KB gzipped).

### 4.5 Visual verification

`npm run preview` served the production build at `http://127.0.0.1:8787/hr`.
Operator confirmed visually:

- MV-20260419-001 thumbnail renders (Hunter Root performing acoustic
  set, blue stage wash). End-to-end proof of the HEIC → JPEG → R2 →
  manifest → JSON → bundle → render pipeline — the most novel path of
  Phase B.
- MV-20260419-002 thumbnail renders (Cheech puppet FB reel).
- MV-20260419-004 thumbnail renders (Medusa's Disco logo).
- Click on a photo card opens the full-resolution R2 primary URL in
  a new browser tab.
- YouTube card (`MV-20260518-001`) still renders correctly via the
  preserved fallback synthesis path — no regression on existing
  dispatch.

---

## §5 — Acceptance verification

Brief §6 Phase B acceptance criteria:

| Step | Criterion | Status |
|---|---|---|
| 1 | Audit-on-entry verifies scope holds | PASS (§1) |
| 1a | §3.6 media_type decisions applied | PASS (§3.1) |
| 1b | HEIC recuration (added) | PASS (§3.2) |
| 1c | Exhibit tagging for -001 and -004 (added) | PASS (§3.3) |
| 2 | `tools/sync-assets-to-r2.mjs` written per brief §3.2 | PASS (§4.2 commit `4345551`) |
| 3 | Tested on `--dry-run` first | PASS (two dry-runs; second after HEIC recuration) |
| 4 | Real sync, first 1 artifact verified, then full | PASS (§4.1) |
| 5 | `tools/export-artifacts.mjs` updated per brief §3.4 | PASS (§4.2 commit `29dcd40`) |
| 6 | Render dispatch updated per brief §3.5 | PASS (§4.2 commit `bd50bc6`) |
| 7 | `npm run build` runs, verify visually | PASS (§4.4 + §4.5) |
| 8 | Disciplined commits | PASS (§4.2 three commits) |
| 9 | Run report | PASS (this document) |

---

## §6 — Observed but not actioned

Eleven items surfaced during this session that are out of Phase B's
authorized scope or deferred to future work.

### 6.1 Audio delivery — the deferred 15 artifacts

The 15 `media_type='mixed'` Hunter Root MP3s remain on disk, in MV's
released set, and untouched in R2. They are NOT exhibit-badged on the
museum side as photos — they fall through to `PlaceholderCard` in the
deck. A follow-on scoping brief should address — together —:

- Audio storage shape (R2? Different URL strategy? CDN?)
- Audio thumbnail strategy (generic icon? Album art? Waveform?)
- Audio render layer (player UI, playlist component, integration with
  `HrArchive` and/or new component)
- Reconcile MV's `album:medusas_disco` tag with the hand-coded `ALBUMS`
  constant in `HrArchive.jsx` (see §6.2)
- Whether `HrArchive` should consume the exhibit JSON instead of its
  hand-coded constant

### 6.2 HrArchive.jsx hand-coded vs MV-tagged albums

`src/routes/hr/HrArchive.jsx` carries a hand-coded `ALBUMS` constant
with 6 albums (2018–2025) and a single `SINGLES` array. The 15 MP3
artifacts in MV all carry `album:medusas_disco`, which doesn't appear
in HrArchive's hand-coded list. The "Medusa's Disco era" is documented
in `docs/canonical/UX_SPEC_v0.3.md` as part of the HR spine but isn't
reflected in HrArchive's render.

Not Phase B's to fix. Belongs in the audio scoping brief (§6.1) or
its own curation sweep.

### 6.3 `vocabulary_csv_sha` field could be removed

`tools/export-artifacts.mjs` still computes a SHA over
`docs/deep-dive-vocabulary.csv` and emits it in exhibit-JSON metadata.
The CSV was retired in commit `19e7f16 chore(phase-1.4): retire orphan
deep-dive-vocabulary prebuild`. The function gracefully returns null
when the CSV is absent, so this isn't broken — but the field is
permanently null going forward. The `vocabularyCsvSha()` helper and
its consumer line could be removed in a future cleanup pass.

### 6.4 libuv assertion at process exit on Node 24/Windows

`node tools/export-artifacts.mjs` (and `node tools/sync-assets-to-r2.mjs`
on some runs) prints at the end of execution:

```
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76
```

This is a libuv (Node's event-loop layer) assertion that fires
during process shutdown on Windows with Node 24.14.0. It fires AFTER
the script has completed its work (summary printed, file writes done
via atomic rename). The non-zero exit code might matter to downstream
tooling that branches on exit code; for interactive operator runs it's
noise. Reproduces both with and without my edits (verified via
`--help` not reproducing — the assertion is tied to fetch /
better-sqlite3 / temp-dir cleanup, not the user script logic).

Not Phase B's to fix. If it bothers a future automation, options
include downgrading Node, suppressing stderr after success, or
investigating a libuv patch.

### 6.5 `node --check` doesn't understand `.jsx`

`node --check src/routes/hr/HrExhibitFlow.jsx` errors with
`ERR_UNKNOWN_FILE_EXTENSION`. This is Node 24's ESM loader: it doesn't
recognize `.jsx`. Use `vite build` as the real syntax validator for
JSX files. The line-ending check + byte count from str_replace edits
gives meaningful pre-commit confidence; build is the real test.

### 6.6 better-sqlite3 binary platform mismatch

During step 2 (`npm install`), the existing
`node_modules/better-sqlite3/build/Release/better_sqlite3.node`
binary was a Linux ELF (header bytes `7F 45 4C 46`), not a Windows
PE binary. Likely artifact of a previous install run from inside WSL,
Docker, or another Linux environment that wrote into the Windows-side
`node_modules`. The deps audit had reported `better-sqlite3` as
"present" because the package metadata was correct; only loading the
binary surfaces the mismatch.

Fixed by `npm uninstall better-sqlite3 && npm install --save-dev better-sqlite3@^12.9.0`,
which forced prebuild-install to fetch the right platform binary
fresh. After fix: header bytes `4D 5A 90 00` (Windows PE/MZ). `:memory:`
load test successful.

Future-Mike: if you ever run npm in WSL or a container against the
same `node_modules`, expect this. Wipe `node_modules/` and reinstall
on the host platform before resuming Windows-side work.

### 6.7 sharp 0.34.5 on Windows lacks HEVC HEIC decode

Documented in §2.3. The libheif shipped with sharp's Windows prebuilt
binaries handles HEIF containers but not the HEVC compression that
iPhone HEIC files use. metadata() succeeds; resize() fails. Phase B
worked around it by transcoding upstream (step 1b via pillow-heif).
A future ImageMagick or libvips-with-HEVC build of sharp would obviate
the workaround, but rebuilding sharp from source needs Visual Studio
Build Tools (not present on this machine).

If future MV ingest brings more iPhone HEIC files: either transcode
at ingest time (operator-side hygiene) or build a HEIC-specific dual
decoder fallback in the sync script (Option C from §2.3's discussion).

### 6.8 CRLF line endings on new `tools/sync-assets-to-r2.mjs`

Git warned at staging: "warning: in the working copy of
'tools/sync-assets-to-r2.mjs', CRLF will be replaced by LF the next
time Git touches it". The new .mjs file was written with CRLF endings
(PowerShell `Set-Content` default on Windows) while the rest of the
repo uses LF. Git's `core.autocrlf` setting will normalize on next
touch. No action required; flagging for completeness.

Future: prefer `[System.IO.File]::WriteAllText` with explicit
`UTF8Encoding(false)` for new files matching repo convention, as was
done for the Python scripts and the in-place .mjs/.jsx edits.

### 6.9 Pre-Phase-A `weird-baby build token` still active

Phase A §5.2 noted a pre-existing User API token (`weird-baby build
token`, Admin R/W, all buckets, issued Apr 8 2026) and recommended
revocation after Phase B is settled. Phase B is now settled and
`wbm-asset-sync` is verified working end-to-end. Recommended follow-on
session: revoke the old token via Cloudflare dashboard.

### 6.10 No CORS policy on `weird-baby-assets`

Phase A §5.5 noted CORS not configured. Phase B's image delivery via
`backgroundImage` doesn't need CORS preflight. Defer remains
appropriate. If a future feature does browser-side `fetch()` against
`assets.weird.baby`, CORS will need configuration.

### 6.11 Pre-existing pip "invalid distribution ~ip" warning

During the pillow-heif install verification, pip warned:
`WARNING: Ignoring invalid distribution ~ip (C:\Users\macun\AppData\Local\Programs\Python\Python313\Lib\site-packages)`.
A leftover from a previous interrupted pip install — `~ip` is a
half-renamed `pip` directory. Harmless; pip continues to function. A
manual cleanup (Remove-Item on `~ip`) would silence the warning.

---

## §7 — Phase B unique findings worth surfacing

These are session-specific learnings that don't fit cleanly under
"observed but not actioned" but matter for future work.

### 7.1 The brief's "mostly photos" assumption was wrong

Brief §1's footnote ("expected to be small — roughly 18 files; mostly
photos and HTML snapshots") underestimated the audio content.
Implication for future brief authoring: file-extension audit at
scoping time would have caught this. The brief explicitly deferred
the on-disk audit to implementation ("File-system check needed in
implementation session"); that deferral is what allowed the surprise.

Recommendation: add a "format breakdown by file extension" line to
the §1 inventory of future scoping briefs that involve assets. Small
addition, would have flagged Option A's necessity at scoping time.

### 7.2 The `mixed` media_type is ambiguous

15 audio MP3s have `media_type='mixed'`. Per Phase A's deferred work
item (brief §3.1: "v2.1-target §6.1's future CHECK constraint on
media_type"), the live `media_type` taxonomy is unconstrained.
"mixed" appears to mean "media artifact with associated metadata"
rather than "mixed image+text" — but the term is interpretation-laden.

Future MV-side normalization (the deferred §6.1 work item) should
either define `audio` as a first-class media_type or define what
`mixed` actually means.

### 7.3 Brief §3.5's render-dispatch assumption was thin

Brief §3.5: "tile components consume them" assumed tile components
existed for all media_types in scope. For `media_type='link'` they
did (`LinkCard`). For `media_type='photo'` they didn't (no `PhotoCard`
existed; PlaceholderCard was the fallback). For `media_type='mixed'`
they didn't and don't (no `AudioCard` or `MixedCard`).

Phase B added `PhotoCard` (commit `bd50bc6`). The audio case is
unresolved per §6.1.

Recommendation for future scoping briefs that change render-layer:
audit the render layer's coverage of the media types in scope before
locking decisions like §3.5.

### 7.4 The Phase B-specific timestamp pattern for backup files

Phase B introduced a timestamp + sub-step pattern for MV backups:
`bak_pre_phaseB_step<N>_<description>_<UTCstamp>.sqlite`. Distinct,
sortable, traceable to a script. Consistent with MV's existing
`bak_pre_*` convention. Reusable in future MV-side write sessions.

### 7.5 Cooperative SQLite locking with MV running

Step 1c verified that MV's HTTP loopback can be running while Phase B
writes to the SQLite directly. No `database is locked` errors. Future
sessions can leave MV running during DB writes (subject to caveat that
heavier concurrent writes might surface contention).

### 7.6 Long-document writes via PowerShell heredoc are unreliable

The initial run-report write attempt sent a ~14KB single-quoted
heredoc as a single PowerShell command. The terminal lost the heredoc
state partway through, producing hundreds of parse errors. State
check confirmed no orphan file was written.

Future operator/Claude sessions: for documents larger than a few KB,
prefer file-handoff (Claude writes to its workspace, presents the
file, operator copies it into place) over PowerShell heredoc.

---

## §8 — What's next

### 8.1 Audio delivery scoping (§6.1)

The 15 audio artifacts are unblocked from a technical standpoint
(they're in MV, the sync script could handle them with a small
audio-branch addition). They're blocked from a UX standpoint: no
scoping brief exists for how they render. A fresh scoping session
should produce that brief.

### 8.2 Pre-existing token revocation (§6.9)

Cloudflare dashboard → R2 → API Tokens → User API Tokens table →
delete `weird-baby build token`. ~30 seconds of work.

### 8.3 Curation hygiene

MV-20260419-004 has empty `description_short`, `description_long`,
and `notes`. It's now in the museum render as `(untitled)` (per the
PhotoCard fallback). Future curation: assign a title and short
description. ("Medusa's Disco — band logo" would be the minimum.)

### 8.4 Optional cleanups (low priority)

- Remove `vocabularyCsvSha()` and the `vocabulary_csv_sha` field (§6.3)
- Clean up `~ip` directory in Python site-packages (§6.11)
- Update runbook reference to use this report's filename (the Phase A
  report noted a similar runbook typo — same issue may recur)

### 8.5 Deploy

Per brief §7, deploy is out of Phase B's scope. The current `dist/`
is built and verified locally; pushing it to weird.baby is a separate
work item.

---

*End of report. Three Museum commits (`4345551`, `29dcd40`, `bd50bc6`);
zero MV commits (by .gitignore design). Phase B's 18-artifact delivery
scope narrowed to 3 photos (Option A); the 15 audio artifacts await a
follow-on scoping brief. End-to-end pipeline (MV recuration → R2 sync
→ manifest → export → render) proven via visual verification at
`http://127.0.0.1:8787/hr`.*
