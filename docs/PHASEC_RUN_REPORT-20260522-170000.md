# Phase C Run Report — Audio Delivery, sync + render

**Date:** 2026-05-22 (session ~14:00–17:00 UTC, report written 2026-05-22 17:00 UTC)
**Scope authorized:** §6 Phase 1 (11 steps) per
`docs/AUDIO_DELIVERY_SCOPING_BRIEF-20260522-013207.md`, executing the four
operator-locked decisions in §9 (APIC + glyph fallback for thumbnails,
custom-styled play button for in-card affordance, MV-side normalization
of media_type to 'audio', era:rwth tag addition).
**Status:** **COMPLETE.** All 11 brief steps landed. Four Museum commits
(`d14c13b`, `24d8720`, `d4d2db2`, plus this report); zero MV commits (by
.gitignore design — see PHASEB §4.3). 15 RWTH audio artifacts ship
end-to-end: MV recurated, R2-synced, exported, rendered with in-card
HTML5 playback at `http://127.0.0.1:8787/hr`. Deploy remains out of scope.

---

## §0 — How to read this report

Mirrors `docs/PHASEB_RUN_REPORT-20260522-010001.md`. §1 audit-on-entry;
§2 stop-and-ask events; §3 MV-side writes; §4 R2 mutations and Museum
changes; §5 acceptance verification; §6 observed-but-not-actioned;
§7 unique findings; §8 what's next.

The session ran ~3 hours active work. Phase C was less dramatic than
Phase B — no scope reversal, no HEIC decode crisis, no schema gaps —
but the visual-layout iteration in Step 4 surfaced an architectural
question (per-media-type aspect ratios) that consumed a meaningful
fraction of the session.

---

## §1 — Audit-on-entry results

### 1.1 MV scope intact

Direct query of `C:\AI\Platform\MediaVault\core\mediavault.sqlite` with
the brief's §1.1 predicate (`media_type='mixed' AND status='released'
AND tags LIKE '%exhibit:hunter_root%' AND tags LIKE '%type:audio%'`):
15 artifacts matching. Id list verified against brief §1.1 exactly.
Broader sanity (`media_type='mixed' AND status='released'` without
exhibit filter): also 15 — confirming the 15 audio artifacts are the
ONLY `mixed` set in the released catalog. **MATCH** to brief exit
state. Scope held.

### 1.2 Repository HEADs

- MV: `0a9e953` — matches Phase C scoping exit. PASS.
- Museum: `c44ee51` (the scoping brief commit on top of Phase B's
  `2248990`). PASS.
- HR: `af1486a` — matches Phase B exit. PASS.

### 1.3 Phase B tracked outputs + Phase C brief

All six paths Test-Path TRUE:
- `tools/sync-assets-to-r2.mjs`
- `tools/sync-assets-to-r2-manifest.json`
- `tools/export-artifacts.mjs`
- `src/data/exhibits/hunter_root.json`
- `src/routes/hr/HrExhibitFlow.jsx`
- `docs/AUDIO_DELIVERY_SCOPING_BRIEF-20260522-013207.md`

### 1.4 Working-tree state

Museum tracked changes: zero. Untracked residue matches Phase A §5.3 +
Phase B §6 inventory exactly (the disciplined-edit snapshots and
pre-Phase-1 dist dirs). No surprise modifications.

PASS. Going-in state intact.

### 1.5 On-disk audit of the 15 MP3s

Per brief §4.1 pre-migration audit. Each file Test-Path verified,
sized, SHA-256 hashed:

- Total: 76.76 MiB across 15 files (~5.1 MiB average)
- Range: 3.29 MiB ("Dead Man") to 8.31 MiB ("Northern Light Streaks")
- Zero missing files; zero hash collisions

Brief's "going-in state" estimated ~79 MiB; actual 76.76 MiB. Close
enough — discrepancy attributable to MiB vs MB or unit rounding in the
brief.

### 1.6 ID3 APIC inspection (Step 0c)

Per §9.1: implementation session checks ID3 hit rate as the first step
of generateAudioThumbnail design. `_cowork/phaseC_step0c_id3_audit.mjs`
ran music-metadata against all 15 MP3s. **Result: APIC hit rate 15 of
15**, no errors, no NO_APIC fallbacks.

Findings worth surfacing for §6:

- Every APIC payload is **exactly 53,745 bytes** with format
  `image/jpeg` and type `Cover (front)`. Identical bytes across all 15.
  ReverbNation embedded the same single album-art image into every
  track's ID3.
- Visual consequence: 15 R2 audio cards will show 15 identical
  thumbnails. The visitor-experience §9.1 reached for ("organic visual
  variety") doesn't materialize. The technical implementation is
  correct.
- Operator was informed of this before R2 sync. Decision:
  continue-as-planned. The decision is appropriate; APIC is the §9.1
  locked path, and the alternative (synthesized glyph) would produce
  *equally* identical thumbnails, just synthesized rather than sourced.
- Side observation: "Northern Light Streaks" has a trailing space in
  its ID3 title. MV's `description_short` does not carry the trailing
  space; the museum displays MV's metadata, not ID3, so the rendered
  title is unaffected. Logged for future curation hygiene.
- All 15 have `artist: "Run With The Hunt"` (the era/album name, not
  Hunter Root's real name) and `album: null` in ID3 — ReverbNation
  conventions, not consumed by Path A.

---

## §2 — Stop-and-ask events

Five stop-and-ask events surfaced during the session. All five resolved
without aborting Phase C.

### 2.1 mutagen not installed for inline ID3 audit

The initial Step 0c plan was a Python script using `mutagen.id3`. Python
on the operator's machine reported `No module named 'mutagen'`. Rather
than `pip install` an audit-only dep, the audit was rewritten as a node
ESM script using `music-metadata` — which was already going to be the
implementation-time dependency for `generateAudioThumbnail()` per brief
§9.1. One dependency for two purposes: the audit and the production
path use the same library, so the audit is a true preview of what the
sync will see.

The dep install (`npm install --save-dev music-metadata`) was pulled
forward from Step 2 to Step 0c. Operator confirmed before the install
ran. The dep + its 11 transitives committed in Step 2's commit
(`d14c13b`) as planned.

### 2.2 Filter-vs-playback UX clarification

Claude raised a multi-option UX question about what should happen when
a visitor toggles a pill while audio is playing (keep playing /
auto-pause / hybrid). Operator pushed back: brief §2.5's posture
already implied the answer (player state is sovereign; UI churn around
it must not disturb it), and the multi-option framing was a yellow
flag.

Operator-locked rule: **filters do not impact player state; another
player starting interrupts any active player**.

Implication for #3 (AudioCard ↔ canonical PlayerBar): the new rule
restates §3.6 (one AudioCard at a time) without overriding §2.5's
concurrent-with-PlayerBar permission. Path A AudioCard does not
coordinate with PlayerBar; Path B (source-agnostic player) handles
that when prioritized.

Lesson committed: **re-read the brief's stated postures before raising
binary UX questions**. The brief locked the answer by implication;
asking the question burnt operator attention on something already
decided.

### 2.3 ReverbNation APIC monotony (Step 0c surface)

15/15 tracks have identical APIC bytes. Surfaced to operator with three
options: continue-as-planned (ship APIC), switch to glyph anyway,
hybrid. Operator chose continue-as-planned. Recorded in §1.6.

### 2.4 file_handoff broken; switched to PowerShell patch approach

The first attempt at delivering the updated `sync-assets-to-r2.mjs` via
`present_files` returned "No file content available" on the operator
side, twice (including after a reboot). File-handoff transport was
unavailable for this session.

Operator chose Option 2 from a three-option menu: surgical
PowerShell patches against the existing file rather than full-file
replacement. The five-patch sequence ran cleanly with pre-flight
anchor checks per patch (Python `str.count(anchor) == 1` gates).

Lesson: file-handoff is the documented Phase B approach for documents
> 5 KB (PHASEB §7.6) but isn't a guarantee of delivery. The patch
approach scaled the delivery surface down: 5 patches × ~3-15 lines of
context each rather than one 17 KB drop. Worked.

### 2.5 Card layout iteration

The initial Step 4 visual check revealed the grid had no
aspect-ratio discipline — cards came out in random shapes (some
portrait, some landscape) because `pickSpan` rolled both column-span
AND row-span from the same seed, with no per-media-type constraint.

Operator surfaced four UX rules:
- Audio cards portrait, matching album art
- Image cards scale to fit a fixed aspect ratio
- Aspect ratio constant across viewport rescales
- Video cards use 16:9

Two design questions surfaced and were answered (per-card aspect locked
across rescales; 16:9 for video; option B = locked aspect + varying
column-span for size variation).

Implementation iterated through three states before landing:
1. First attempt put `aspect-ratio` on the card itself, which compounded
   with the footer and produced enormous cards filling the viewport.
2. Second attempt moved `aspect-ratio` to the vis element and capped
   column widths at 280px. Cards collapsed to thin horizontal bars
   because `grid-auto-rows: 8px` + no explicit `grid-row: span N`
   left cells at 8px height.
3. Third attempt changed `grid-auto-rows` from `8px` to `auto`. Cards
   correctly sized to their natural content (aspect-ratio'd vis + footer).

The third state is what shipped. The size variation from `pickSpan`'s
2-col bias produces a visually bumpy grid, which operator accepted as
"good enough for Path A" rather than spend more cycles polishing
layout that may get replaced in Path B's source-agnostic player work.

Lesson: when removing a structural CSS knob (here, `grid-row: span N`
from JS-driven `pickSpan`), check what was IMPLICITLY relying on it
(here, `grid-auto-rows: 8px` was paired with explicit row-spans;
removing the spans left the 8px rule producing 8px-tall cells).

---

## §3 — MV-side writes

One Python script wrote to MV's `mediavault.sqlite`. Batched per brief
§9.4 (single backup, two UPDATEs, separate post-verify each).

### 3.1 Step 1 — batched audio curation

Script: `_cowork/phaseC_step1_apply_audio_curation.py`
Backup: `core/backups/bak_pre_phaseC_step1_audio_curation_20260522-152728.sqlite` (1,953,792 bytes)
Pattern: PHASEB §3.1/§3.2/§3.3 discipline — pre-flight verify-count +
backup + transactional UPDATEs + post-verify each + abort-on-mismatch.

**§9.3: media_type normalization.** All 15 RWTH audio artifacts UPDATEd
from `media_type='mixed'` to `media_type='audio'`. Pre-flight count
matched expected 15. UPDATE changed 15 rows. Post-verify: 15 rows
with `media_type='audio'` in the captured id set.

**§9.4: era:rwth tag addition.** Same 15 artifacts gained `era:rwth`
in their tags JSON array via `json_insert(tags, '$[#]', 'era:rwth')`.
Idempotency guard: predicate excluded rows already carrying the tag
(prevents duplicate tagging on re-run). Pre-flight count matched
expected 15. UPDATE changed 15 rows. Post-verify: 15 rows with
era:rwth tag.

**Additional post-verify gates** (inside the transaction, before
COMMIT):
- No row in curated set still `media_type='mixed'` (leak check): 0 ✓
- All tag JSON still valid (`json_valid(tags) = 0` check): no failures ✓

Independent post-state sanity query (separate connection, after
script COMMITted):
- `media_type='mixed' AND status='released'`: 0 (was 15)
- `media_type='audio' AND status='released'`: 15 (was 0)
- `tags LIKE '%era:rwth%'` (any artifact): 15
- `media_type='audio' AND status='released' AND tags NOT LIKE '%era:rwth%'`: 0

Diff per artifact (uniform across all 15):
- `media_type`: `mixed → audio`
- `tags added`: `['era:rwth']`

No other artifact attributes touched. No other rows touched.

### 3.2 MV-running during write

PHASEB §7.5 logged that MV's HTTP loopback can be running during DB
writes via the cooperative SQLite shared-locking. Step 1 also ran with
MV running (port 51822). The script used `BEGIN IMMEDIATE` to acquire
the write lock immediately rather than at first write, sidestepping
any race window. No `database is locked` errors.

---

## §4 — R2 mutations and Museum changes

### 4.1 R2 objects created (Step 2 sync runs)

Two runs:
- `--limit 4` (smoke test): 1 audio primary uploaded (~6.3 MiB,
  Park Bench Pigeons) + 1 thumbnail uploaded (~40 KiB APIC).
  Phase B's 3 photos correctly HeadObject-skipped.
- Full sync (all 18 artifacts): 14 audio primaries uploaded
  (~70 MiB), 0 thumbnails uploaded (all 15 APIC thumbnails dedup
  to the same SHA — see §7.1).

Final R2 inventory:
- `assets/...jpg|png` (Phase B photos): 3 objects, unchanged
- `audio/...mp3` (Phase C audio): 15 objects, ~77 MiB total
- `thumbnails/...jpg`: 4 objects (3 from Phase B + 1 APIC shared
  across all 15 audio artifacts)

Total R2 inventory: 22 objects, well under R2 free tier on both
storage and Class A ops.

HEAD verification (3 random new audio URLs + the limit-4 audio + the
limit-4 thumbnail):
- All 200 OK
- `Content-Type: audio/mpeg` on .mp3 objects
- `Content-Type: image/jpeg` on .jpg thumbnail
- `Content-Length` matches local file bytes exactly
- `Cache-Control: public, max-age=31536000, immutable` on all

### 4.2 Museum source changes — three feature commits

**Commit `d14c13b` — feat(audio-delivery): widen R2 sync for audio + thumbnail dispatch**
Files: `tools/sync-assets-to-r2.mjs` (+145/-26), `tools/sync-assets-to-r2-manifest.json` (+146/-1), `package.json` (+1, music-metadata devDep), `package-lock.json` (+164, transitive deps).
Five patches applied via PowerShell + Python sequence:
- Add `music-metadata` import
- Widen `SCOPE_SQL` to `media_type IN ('photo','audio')`
- Add `.mp3 → audio/mpeg` to `MIME_BY_EXT`; add `AUDIO_EXTS`/`IMAGE_EXTS` sets
- Replace `primaryKey(hash, ext)` with `primaryKeyForExt(hash, ext)` that routes audio to `audio/<sha>/` and images to `assets/<sha>/`
- Replace `generateThumbnail()` with branched dispatcher; new `generateImageThumbnail` (Phase B path), `generateAudioThumbnail` (APIC via music-metadata + synthesized SVG glyph fallback), `AUDIO_GLYPH_SVG` constant
- Main-loop wiring: thumbnail call signature, stats counters, manifest fields, summary line
- Stale Phase B header comment refreshed

**Commit `24d8720` — feat(audio-delivery): regen exhibit JSON with 15 audio artifacts**
Files: `src/data/exhibits/hunter_root.json` (+87/-46 — 15 audio entries now carry real `primary_url`/`thumbnail_url`/era:rwth tag), `src/data/vocabulary.json` (timestamp refresh only, 14 vocabulary rows unchanged).
`tools/export-artifacts.mjs` not touched per brief §3.7. Phase B's
commit `29dcd40` already wired manifest-lookup dispatch.

**Commit `d4d2db2` — feat(audio-delivery): wire AudioCard renderer**
Files: `src/routes/hr/HrExhibitFlow.jsx` (+198/-14), `src/routes/hr/HrExhibitFlow.css` (+21/-3).
- New `AudioCard` component (~130 lines): custom play/pause button with
  SVG glyphs, hidden `<audio>` element behind ref, `preload="none"`,
  thumbnail as background, `aria-label` per state, two `useEffect`s
  (play/pause control + 'ended' auto-clear).
- `ArtifactCard` gains `isAudio` dispatch branch returning AudioCard in
  a `<div>` wrapper (not `<a>`).
- `playingAudioId` state lifted to `HrExhibitFlow` root, threaded
  through `P3Panel` to `ArtifactCard` to `AudioCard`.
- Audio cards' React key is `card.id` only (not the Phase B
  `filterKey-card.id` composite); non-audio keys unchanged. Filter
  changes don't remount audio cards.
- `pickSpan` simplified: `span_h` retired; per-media-type aspect
  ratios live in CSS.
- `spanStyle` returns only `gridColumn`.
- CSS adds per-vis aspect-ratio rules: audio 1:1, photo 4:5, link
  16:9 (all `flex: none` to prevent flex-grow override).
- `grid-template-columns: repeat(4, minmax(0, 280px))` + `justify-content: start` caps card width on wide viewports.
- `grid-auto-rows: 8px` → `auto`.

### 4.3 MV repository — zero commits

By design (PHASEB §4.3, MV's `.gitignore` ignores
`core/mediavault.sqlite`, `core/backups/`, `_cowork/`). Phase C's
MV-side work (1 backup, 1 Python script, 1 batched UPDATE) is
invisible to git.

MV HEAD at session start: `0a9e953`. MV HEAD at session end: `0a9e953`. PASS.

### 4.4 Build verified

`npx vite build` ran cleanly 5 times during the session (after each
significant patch). Final bundle: `dist/client/assets/index-*.js` =
346.97 kB (106 kB gzipped), up ~3 kB from Phase B's 341.58 kB
(AudioCard component + aspect-ratio rules). 45 modules transformed.

### 4.5 Visual verification

`npx wrangler dev` served the production build at
`http://127.0.0.1:8787/hr`. Operator confirmed visually:
- 15 audio cards render with APIC thumbnail + centered play button.
- Click play on card A → audio plays.
- Click play on card B while A is playing → A pauses, B plays.
  (One-card-at-a-time per §3.6.)
- Toggle a pill while audio is playing → audio continues. Filter
  reflows the grid; the playing card stays mounted.
- 3 photo cards render via PhotoCard (Phase B path) without regression.
- 1 YouTube link card renders via LinkCard without regression.

Layout note: card sizes vary because `pickSpan`'s 2-col bias rolls
randomly per card. Operator accepted as "good enough for Path A."

---

## §5 — Acceptance verification

Brief §6 Phase 1 acceptance, step by step:

| Step | Criterion | Status |
|---|---|---|
| 1 | Audit-on-entry verifies scope holds | PASS (§1) |
| 2 | Apply §9.3 + §9.4 MV writes per Phase B discipline | PASS (§3.1) |
| 3 | Widen `sync-assets-to-r2.mjs` per §3.2 + §3.3 | PASS (commit `d14c13b`) |
| 4 | Add music-metadata dep (§9.1 Option A) | PASS (commit `d14c13b`, pulled forward to Step 0c) |
| 5 | Test sync on `--dry-run` | PASS (18 artifacts scope; image=3 apic=15 glyph=0) |
| 6 | Real sync — `--limit` first, then full | PASS (§4.1) |
| 7 | `npm run export-artifacts` | PASS (commit `24d8720`) |
| 8 | Add AudioCard + lift state | PASS (commit `d4d2db2`) |
| 9 | Build + preview + visual verify | PASS (§4.4 + §4.5) |
| 10 | Disciplined commits | PASS (3 feature commits + this report) |
| 11 | Phase C run report | PASS (this document) |

---

## §6 — Observed but not actioned

### 6.1 Visual layout roughness (Step 4 visible bumpiness)

`pickSpan` rolls a 2-col-vs-1-col bias per card from the card.id hash.
With 19 cards and a 70% wide-bias roll, the grid produces a mix of
single-column and double-column cards in random positions, which
combined with CSS-grid `dense` packing looks visually noisy. Operator
accepted this as Path A's ship-as state.

Follow-on candidates if revisited:
- Uniform sizing (constant `span_w=1` for all audio, more visual rest)
- Per-media-type size policies (audio = always 1-col, photo = source-driven)
- Drop `grid-auto-flow: dense` so cards don't shuffle to fill gaps

Not Phase C's to fix. Probably belongs in Path B's layout pass when
the source-agnostic player work happens, or as its own visual-polish
session.

### 6.2 ReverbNation APIC monotony

15/15 audio artifacts share identical APIC bytes (53,745 bytes,
"Cover (front)", image/jpeg). The visitor sees 15 identical
thumbnails. §9.1's "ID3 APIC for visual variety" reasoning didn't pan
out for this source set. Continue-as-planned was the right call —
the alternative would be 15 identical synthesized glyphs.

If future content arrives with per-track APIC variety, the existing
code path picks it up automatically; if the operator ever wants to
override per-track to a per-album static, that's a sync-tool
extension, not a museum-side change.

### 6.3 libuv assertion at process exit on `export-artifacts.mjs`

PHASEB §6.4 documented this. Confirmed still present on Node 24 /
Windows / better-sqlite3 / tempdir-cleanup. Both `--dry-run` and real
runs printed `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`
AFTER the export completed cleanly, producing exit code -1073740791
on what was functionally a successful run.

Treating as known-noise per Phase B's precedent. Not Phase C's to fix.

### 6.4 dotenv banner mojibake in PowerShell

`dotenv@^17.x` prints a startup banner with Unicode glyphs (•, ⌘, ⌐).
PowerShell's default Windows console encoding renders these as
mojibake (`Γùç`, `Γîÿ`). The injection itself works correctly — the
6 env keys load with correct lengths. Visual noise only; first three
lines of every sync run output are unreadable.

Three options if revisited:
- Set `chcp 65001` in the shell before running node
- Pass `{ quiet: true }` to `dotenv.config()` (suppresses banner)
- Suppress noise as documented annoyance

Not Phase C's to fix.

### 6.5 Stale tracked-file snapshots

The pre-Phase-C snapshots created during the patch sequence
(`tools/sync-assets-to-r2.mjs.pre-phaseC-20260522-154711` etc.) remain
in the working tree as untracked files. Same convention as Phase A
§5.3 snapshots. Operator may quarantine or .gitignore as part of a
future hygiene sweep.

### 6.6 npm vulnerabilities flagged at music-metadata install

`npm install --save-dev music-metadata` reported "5 moderate severity
vulnerabilities" in the existing dep tree. These are pre-existing
(would have been flagged on any Phase B `npm install` too). Did not
action because: (a) the vulnerabilities aren't in music-metadata
itself, (b) `npm audit fix` could pull in breaking changes, (c)
scope-discipline says not now.

Candidate for a future hygiene sweep.

### 6.7 Pre-Phase-A `weird-baby build token` still active

PHASEB §6.9 + PHASEA §5.2 noted this. Phase C didn't revoke it (out
of scope, and operator still has it as a backstop in case
`wbm-asset-sync` ever needs to be rotated). Still pending.

### 6.8 Per-photo source aspect (Step 4 deferral)

PhotoCard's vis is hard-coded to `aspect-ratio: 4/5` in Phase C's CSS.
The intent of the operator-locked aspect rule ("image scales to fit
card-size, fixed aspect") is satisfied for the 3 current photo cards,
but a future PhotoCard refinement could key the aspect off each
photo's source dimensions (carried in MV per future curation) for a
more natural per-photo render.

Not Phase C's scope. Becomes its own work item if photos accumulate
and the 4:5 default looks wrong.

### 6.9 ID3 metadata title for "Northern Light Streaks" has trailing space

Curation hygiene item. ID3 title is "Northern Light Streaks ". MV's
`description_short` is "Northern Light Streaks" (no trailing space).
The museum renders MV's title, so the trailing space doesn't reach the
visitor. Logged for future MV curation if/when an MV-side cleanup
pass runs.

### 6.10 HrArchive.jsx ALBUMS reconciliation (PHASEB §6.2)

Per UX_SPEC §D.4, HrArchive is dormant for v1. The hand-coded ALBUMS
constant vs MV's `album:run_with_the_hunt` tag mismatch is still
real-but-moot. Recorded in Phase C brief §1.4. Not Phase C's to fix.

### 6.11 The `vocabulary_csv_sha` field still in export output

PHASEB §6.3 noted this. `tools/export-artifacts.mjs` still computes
the SHA over the now-retired `docs/deep-dive-vocabulary.csv` and emits
it (as null, since the CSV is absent). Cosmetic.

---

## §7 — Phase C unique findings

### 7.1 APIC same-SHA dedup as a free architectural win

ReverbNation embedding the same album-art bytes into all 15 tracks
turns out to be the cleanest possible outcome for content-addressed
storage. `generateAudioThumbnail()` processes each MP3's APIC
independently — but because the input bytes are identical, sharp's
deterministic pipeline produces identical output bytes, which hash to
the same SHA, which means **the thumbnail uploads exactly once to R2
and gets referenced 15 times in the manifest**.

The full-sync run reported: `thumb uploaded: 0, thumb skipped: 18`.
The `--limit 4` smoke test had already uploaded the shared thumbnail
(via Park Bench Pigeons); the remaining 14 audio artifacts'
thumbnails were HeadObject-skipped during full sync because their
output bytes matched.

Generalizes: any future audio set with shared album art also gets
dedup for free. Per-track art would still work (just N thumbnails
instead of 1).

### 7.2 The brief's §9.1 reasoning vs the §9.1 outcome

§9.1 reached for "organic visual variety in the grid" by choosing APIC
over synthesized glyph. The Step 0c audit revealed the variety
wouldn't materialize because all 15 tracks share one APIC. The brief's
decision was correct in shape (use ID3 when present), but the
expected visitor benefit didn't apply to this set.

Path forward (if monotony bothers the operator later): change the
APIC pipeline to also seed a per-track color/pattern overlay on the
shared art. ~30 lines in `generateAudioThumbnail`. Reversible.

### 7.3 Anchor-based patches scaled where file-handoff didn't

PHASEB §7.6 documented that long-document writes via PowerShell
heredoc are unreliable. Phase B settled on file-handoff via Claude's
workspace as the fix. Phase C couldn't use that path — `present_files`
returned "No file content available" twice, even after a reboot.

The fallback that worked: surgical patches against the existing file,
each patch wrapped in a Python script (written via single-quoted
PowerShell heredoc — `@'...'@` per PHASEB §2.5) with strict
`str.count(anchor) == 1` pre-flight gates. Five patches landed for
`sync-assets-to-r2.mjs`; nine more for `HrExhibitFlow.jsx`; one each
for cleanup. Every patch aborted cleanly on any anchor miss, with no
file written.

Lesson committed: **patch sequences with strict pre-flight gates are
a reliable fallback for file-handoff**. Worth keeping in the toolbox
even when file-handoff works.

Side effect: each patch is small enough to review inline in the chat,
which the operator preferred over reviewing one 17 KB drop.

### 7.4 The "operator-locked rule" pattern

Phase C produced three explicit operator-locked rules that the brief
hadn't fully anticipated:
- Filters do not impact player state
- Another player starting interrupts any active player
- Each media type has its own card aspect; aspect locked across rescales

Each one closed a class of questions Claude would have otherwise kept
raising. Documented at the point of decision and threaded into code
comments at every reference, so future-Claude can see *why* a
particular implementation choice exists.

Pattern worth carrying forward: when the operator locks a rule, code
comments at the affected sites should cite the rule + date, so
follow-on sessions don't re-litigate.

### 7.5 Re-read postures before raising binary questions

Phase B §7.3 lesson was "audit the render layer before locking
dispatch." Phase C produced an analogous lesson: **re-read the
brief's stated postures before raising binary UX questions to the
operator**.

The filter-vs-playback question (§2.2 above) wasn't actually open —
brief §2.5's "AudioCard plays independently... concurrent playback is
acceptable" already locked the player-is-sovereign posture. The
multi-option question framing burnt operator attention and triggered
operator pushback to "lean in and listen closer."

Specific check before any future binary UX question: scan the brief's
§2 and §9 for posture statements that bear on the question. If a
posture covers it, the question isn't open.

### 7.6 PowerShell escape gotcha — JS backticks vs PowerShell backticks

Patch 3c first attempt failed because the JS template literal in
`primaryKey()`'s body uses backticks (` `` `), which PowerShell
also uses as its escape character. The anchor string had to use
`[char]96` interpolated via `${bt}` rather than literal backticks
to match the file content.

Worth documenting because this pattern recurs anywhere JS string
literals get embedded in PowerShell anchors. The two-character
representation `[char]96` is unambiguous; literal-backtick-escaped
backtick (` `` ``) gets confusing fast.

### 7.7 `grid-auto-rows: 8px` was a hidden dependency

Removing `grid-row: span N` from JS-emitted card styles broke the
layout because `grid-auto-rows: 8px` was IMPLICITLY relied upon by
the JS row-spans to produce sensible heights. The CSS rule on its own
just means "each natural-flow row is 8px tall" — fine if you also
explicitly span rows, catastrophic if you don't.

Lesson: when removing a structural CSS knob, audit what else in the
codebase was depending on it. Even read-only stylesheets can have
non-obvious cross-coupling with JS-emitted styles.

---

## §8 — What's next

### 8.1 Deploy

Per brief §7 + PHASEB §8.5, deploy is its own work item. The current
`dist/` is built and verified locally; pushing to weird.baby is a
separate session.

### 8.2 Path B (source-agnostic player) when prioritized

Operator's instinct expressed in §2.2 — "I want the card-to-player-bar
relationship to mimic the track-player-to-player-bar relationship" —
matches Path B exactly. When the source-agnostic player work item
opens, that conversation continues. AudioCard's playback state is
already structured to lift up to a parent coordinator if/when one
exists.

### 8.3 Visual-layout polish (optional)

The size variation operator accepted as "good enough for Path A"
could be polished in a focused layout session. Candidates listed in
§6.1.

### 8.4 Per-photo source aspect (optional)

Per §6.8. Would need MV curation to carry per-photo width/height (or
sharp inspection at sync time to record the source aspect in the
manifest).

### 8.5 Curation hygiene (optional)

- ID3 trailing space on "Northern Light Streaks" title
- Pre-existing `weird-baby build token` revocation (PHASEB §6.9)
- `vocabulary_csv_sha` field removal (PHASEB §6.3)
- `npm audit` triage on the 5 moderate vulnerabilities

---

*End of report. Three feature commits (`d14c13b`, `24d8720`, `d4d2db2`);
zero MV commits (by .gitignore design). 15 RWTH audio artifacts shipped
end-to-end. Visual-verified at `http://127.0.0.1:8787/hr`. Deploy is its
own work item.*
