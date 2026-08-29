<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# Run With The Hunt — Album Card Runbook (Path 2)

**Date:** 2026-05-30
**Scope source:** `docs/REVERBNATION_PARITY_SCOPE-20260530-224748.md` (Path 2)
**Author:** Cowork build session
**Status:** Museum-side code built + verified in sandbox. MV writes + R2 sync + build + deploy are **host-side, operator-run, gated**.

---

## What was built (museum-side, already in the working tree)

A new `card_kind:"album"` container — the audio analogue of the gallery container — renders the
Run With The Hunt album as a cover-bearing deck tile that opens an ordered, numbered tracklist with
sequential mp3 playback (auto-advance), reusing the existing `<audio>` path (no new player subsystem).

| File | Change |
|---|---|
| `src/routes/hr/HrExhibitFlow.jsx` | `AlbumCard` + `AlbumOverlay` components; `stripAudioSuffix`/`albumCover` helpers; `isAlbum` dispatch in `ArtifactCard`; `onOpenAlbum` threaded through `P3Panel`; `openAlbum` state + overlay at the root. |
| `src/routes/hr/HrExhibitFlow.css` | `.hr-album-card-badge` + `.hr-album-ov-*` styles (mirror the gallery overlay; INK/GOLD/BORDER tokens; mobile fallback). |
| `tools/export-artifacts.mjs` | `card_kind:"album"` branch in `buildArtifactRecord`: derives ordered `tracks[]` from live released audio children, excludes the cover child, orders by `notes.track_order`, assigns `track_no`, resolves the container thumbnail from the cover child. |

**Sandbox verification done:** Babel parse OK; `npx eslint src/routes/hr/HrExhibitFlow.jsx` → 0 err / 1 warn
(the pre-existing documented warning); full-repo `eslint .` → **4 err / 6 warn = the documented baseline,
zero new**; `node --check` on the export tool OK; export album-branch ordering unit-tested; and a full
pipeline dry-run (MV-write script applied to a throwaway DB copy → export queries reproduced against it
with the real R2 manifest) confirmed: 1 album container, cover resolves + excluded from tracks, 15 tracks
all with mp3 URLs, order == `track_order`, no stray top-level RWTH audio tiles.

`npm run build` was **not** run (workerd is Windows-bound; sandbox can't build). Run it host-side.

---

## Scope correction surfaced during build (read this)

The scope doc's "13 RN tracks" was **stale**. MV actually holds **all 15** RWTH songs already — **no ingest
is needed**:

- **Whiskey to the Sun** = `MV-HR-20260417-025` — clean top-level mp3 artifact, but status `vault`
  (that's why "13 released" excluded it). The script **releases** it.
- **Park Bench Pigeons** = `MV-HR-20260416-014` — released, but it is the **audio child of archived-page
  artifact `MV-HR-20260416-011`** (there is also a duplicate PBP page family at `-005`/`-008`). The script
  **re-parents** `-014` onto the album container, detaching it from `-011`. The page card `-011` stays
  released (it just loses its audio child). If you'd rather not disturb that page archive, drop PBP and
  build a 14-track album (remove its line from the script's `ORDER`).

The other 13 are clean top-level `MV-HR-20260417-*` mp3 artifacts.

---

## Gated steps — host-side, in order

### GATE: before any MV write
- Snapshot is automatic (step 1 below), but confirm you have the backup.
- **MediaVault must be CLOSED** before `--apply` (no process holding `core/mediavault.sqlite`).
- Review `rwth_album_mvwrite.py` and its `--dry-run` output first.

### 1. MV writes (script — MV CLOSED)
```powershell
# dry-run first (writes nothing):
python rwth_album_mvwrite.py
# then apply (snapshots to core\backups\ first):
python rwth_album_mvwrite.py --apply
```
Does: release Whiskey (`-025`); re-release cover `MV-20260419-003` + parent to the new container;
create the album container (`card_kind:album`, `notes.cover_artifact_id` + 15-track `track_order`);
re-parent all 15 tracks + the cover under it. All tag writes go through `core.artifact_tags.write_artifact_tags`.

### 2. R2 sync (MV running)
```powershell
# launch MV first: C:\AI\Platform\MediaVault\launch_mediavault.bat
node tools\sync-assets-to-r2.mjs
```
Ensures Whiskey (`-025`) and the cover (`-003`) — now released — stay in the manifest; all 15 mp3s + the
cover were already R2-synced, so this mostly confirms/refreshes.

### 3. Export (MV running)
```powershell
npm run export-artifacts
```
**Expected count change (per CLAUDE.md quirk #10): top-level hunter_root cards 76 → 64**
(−13 `-417` audio now nested as album tracks, +1 album container). This is the intended Path-2 shift,
**not** a regression. If the after-count differs materially from 64, stop and investigate before committing.

### 4. Build + live-verify
```powershell
npm run build
npm run deploy        # only AFTER local/sandbox verify per release discipline
```
**Verify on weird.baby/hr:** album tile shows the cover + "15 tracks" badge; clicking opens the overlay;
tracklist is in the order above; a track plays and auto-advances to the next; deck / gallery / coverflow
unregressed.

### 5. Commit (host-side PowerShell, explicit paths — never `-A`)
```powershell
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
git reset --mixed HEAD
git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css `
        tools/export-artifacts.mjs `
        src/data/exhibits/hunter_root.json src/data/vocabulary.json `
        docs/RWTH_ALBUM_RUNBOOK-20260530.md docs/REVERBNATION_PARITY_SCOPE-20260530-224748.md
git commit -m "feat(hr): Run With The Hunt album card (card_kind:album)"
```
(Push / PR per CLAUDE.md workflow when ready.)

### Suggested CLAUDE.md session-log entry (paste host-side)
```
### 2026-05-30 → RWTH album card (card_kind:album, Path 2)
- HrExhibitFlow.jsx/.css: AlbumCard + AlbumOverlay (cover tile → ordered numbered tracklist,
  sequential mp3 auto-advance, reuses the AudioCard <audio> path; no new player). export-artifacts.mjs:
  card_kind:album branch (ordered tracks[] from notes.track_order, cover child excluded, track_no, cover
  thumbnail). Lint at baseline (4/6, zero new). Build+deploy host-side.
- MV (one batched session, snapshot bak_pre_rwth_album_*): cover MV-20260419-003 re-released + parented;
  Whiskey MV-HR-20260417-025 released; album container MV-HR-<date>-NNN created; 15 tracks re-parented.
  Scope-doc "13" was stale — all 15 RWTH songs already in MV. PBP MV-HR-20260416-014 detached from page
  -011. Export top-level 76→64 (−13 audio nested, +1 container), intended.
```

---

## Rollback
If anything looks wrong after step 1: close MV, restore the snapshot
`core\backups\bak_pre_rwth_album_*__mediavault.sqlite` over `core\mediavault.sqlite`, reopen MV.
Museum-side code is reverted with `git checkout -- <files>` (pre-deploy) or a follow-up revert commit.
