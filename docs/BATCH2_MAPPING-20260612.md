# BATCH 2 — MASTER MAPPING (Bandcamp catalog → museum)
**2026-06-12** · Contract for the audio-ingest scripts. Source: full Bandcamp purchase
(26 releases, FLAC, in `intake\bandcamp\`; albums extracted to `_extracted\`).
Decisions locked (Mike): Option A (SINGLES & RARITIES pseudo-album) · Bandcamp audio layer YES ·
best-available-video exception YES · descriptor "MUSIC VIDEO" replaces "Official...".

## ARCHITECTURE (from export-artifacts.mjs + RWTH template)
- Tracks = released children of a `card_kind:album` container, **grouped by `tags.song[0]`**;
  members' renditions merge into one track's `videos[]`. Audio rendition = child with
  `primary_url` (mp3 on R2). Order = container `notes.track_order` (child ids).
- Attach audio to an existing track ⇒ new audio child + SAME song tag as its YT sibling.
- New track ⇒ new audio child + new song tag + extend track_order.
- **All tag writes via MV coordinated writer** (`core.artifact_tags.write_artifact_tags`,
  spec §4.5). (Note: preslink_tag.py wrote tags directly — works, but audit MV tag index
  and use the writer for all Batch 2 writes.)
- Masters: FLAC files stored as vault masters (proposed: alongside vault tree, path in
  `notes.master_path`); artifact primary file = transcoded mp3 (vaulted → R2-synced → served).
  Transcode: ffmpeg libmp3lame V0. Singles FLACs duplicating album tracks: prefer the ALBUM
  file; confirm by duration match; skip the duplicate single file.
- Album `cover.jpg/png` in every zip = authoritative hi-res art (compare vs current covers;
  upgrade where better).

## PER-ALBUM ACTIONS

### ARKANSAS (2023) — Bandcamp = 11 tracks; museum has 8
| # | Track | Action |
|---|-------|--------|
| 01 | Silver Lining | attach audio to existing track |
| 02 | Quicksand Sinking | attach audio |
| 03 | Town Rat Heathen | attach audio |
| 04 | Reverend | attach audio |
| 05 | Grain Of Rice | attach audio (live-video track) |
| 06 | Can't Outshine The Truth | attach audio |
| 07 | California Sober | attach audio |
| 08 | **Good On Paper** | NEW TRACK (museum-missing) |
| 09 | Few Steps Back | attach audio |
| 10 | **Run From The Devil** | NEW TRACK — ⚠️ verified Arkansas track, REMOVED from Rarities roster |
| 11 | Silver Lining (reprise) | NEW TRACK — distinct slug `silver_lining_reprise` |
Track order rewrite required: museum order ≠ album order (museum currently leads Reverend).

### CROOKED HOME (2025) — Bandcamp = 12; museum shows 14
All 12 Bandcamp tracks: attach audio ('94, Low, String up a Necklace, Hand in the Fire,
Flash in the Pan, Friendly Fire, The Devil is the Culprit, If the Body is a Temple,
The Keeper, Out of my Hands, Bad Sign, My Brother's Bones).
⚠️ **VERIFY-CH**: museum also shelves **Cookin' in the Bathroom** + **A Pot Song** under CH;
neither is on Bandcamp's CH. Check Apple/Spotify CH tracklist → if absent there too, they're
standalone singles mis-shelved → MOVE to SINGLES & RARITIES (audio = their single FLACs).

### LIFE INSIDE A WHEEL (2019) — Bandcamp = 12; museum has 2
Attach audio: People Are Programs. NEW TRACKS (11): Same Page, Talker With A Broken Jaw,
Killer To Killer, Brain Cell, Fix My Head, Free To Roam The Cage, With Great Pleasure,
The Water, Music On My Mind, What I Felt, Greek Fire.
⚠️ **VERIFY-SOH**: museum shelves **Sleight of Hand** under LIAW; not on Bandcamp's LIAW.
Same check as CH → likely SINGLES & RARITIES (audio = its single FLAC).
Note: Same Page + Brain Cell also exist on RWTH (different recordings/era) — separate
containers so song-slug overlap is harmless, but label renditions clearly.

### MIMICKING THE SUN LIKE DANDELIONS (2020) — Bandcamp = 10; museum has 5
Attach audio: Lampshade, Favorite Friend, Little Red Riding Hood, Homestead, Family Tree.
NEW TRACKS (5): Undertow, Tongue In Cheek, Norma Jean, Impossible Itch, Upper Hand.

### SKIPPING STONES… (2021) — Bandcamp = 10; museum has 3
Attach audio: Don't Blame The Breeze, Nothin' Wrong, Cusp Of The Mend.
NEW TRACKS (7): Cocoon, Patience In The Dark, Just For Kicks, Echo Calls Her Name,
The Shade, Shake It Off Of Me, Soul Sucker.

### THEY FINALLY CRACKED ME (2018) — Bandcamp = 11; museum has 1
Attach audio: Straitlaced (museum's live-video track; album version = studio).
NEW TRACKS (10): Cheap Wine, So Sick, Identity, Hook Or The Worm, Television Head,
Let The Rhythm, Silly Situation, Moving With The Storm (She's Not My Queen), Depresto, Puzzles.

### PHONE RECORDINGS EP — **ENTIRE NEW ALBUM** (5 tracks + cover.png)
Book Upon My Shelf · Vampire Song · Go Get It · Little Red Riding Hood (Sam The Sham &
The Pharaohs cover — fact now ON RECORD via Bandcamp's own title) · Officer.
New container + 5 new tracks. Release date: read FLAC DATE tag at transcode.

### RUN WITH THE HUNT — no Bandcamp zip; museum already complete (15 audio tracks). Untouched.

## SINGLES & RARITIES (Option A container — needs Mike-designed cover art)
Confirmed: **Chase The Dragon** · **Weathervane** · **Wildfire** · **Shapeshifter** (purchase
discovery) · **Highway Man Blues** (official YT; audio TBD — not in purchase; watch Bandcamp)
· **Charleston Girl** (cover; YT renditions only for now) · **Cocaine Cocaine** (slot
reserved; unreleased watch).
Pending VERIFY-CH / VERIFY-SOH: Cookin' in the Bathroom · A Pot Song · Sleight of Hand.
MD picks (embed-only pending July, band rights): Park Bench Pigeons (origin-story artifact,
`xO1g9qLdkuA` "Previously SEEDS") · Cellophane Snake.

## DUPLICATE SINGLE FLACS (use album file; verify by duration, then ignore)
'94, A Pot Song*, Cookin'*, Cusp, Don't Blame The Breeze, Friendly Fire, My Brother's Bones,
Nothin' Wrong, Quicksand, Reverend, Run From The Devil, Silver Lining, Sleight of Hand*,
TRH, Vampire Song.  (*unless VERIFY moves them to Rarities — then their single FLAC is primary.)

## VERIFICATION RESULTS (2026-06-12, same day — ALL GATES CLEARED)
- **VERIFY-CH ✅ CONFIRMED**: Apple Music Crooked Home = the same 12 tracks as Bandcamp;
  Apple lists Cookin' in the Bathroom (2024) and A Pot Song (2025) as standalone singles.
  → BOTH MOVE to SINGLES & RARITIES; single FLACs are their primary audio.
- **VERIFY-SOH ✅ CONFIRMED**: TIDAL lists Sleight of Hand as a standalone 2020 single
  (own Bandcamp track page; mastered by **Spencer Martin** — prime candidate for the
  dossier's anonymous "Reddit mastering engineer"; graphic design Westernsun Media).
  → MOVES to SINGLES & RARITIES.
- **Rarities release years (TIDAL chronology)**: Straitlaced single 2018 · People Are
  Programs single 2019 · Shapeshifter 2019 · Sleight of Hand 2020 · Vampire Song 2020 ·
  Chase the Dragon 2024 · Cookin' 2024 · Wildfire 2024 · A Pot Song 2025 · Weathervane 2025.
- **NEW RARITY CANDIDATE**: "Down Out Law" — Hunter's track on the Kevn Kinney tribute comp
  *'Let's Go Dancing' the songs of Kevn Kinney* (Apple/Amazon/sonichits all list it).
  Not in the Bandcamp purchase → audio TBD (comp purchase or embed); add to roster.
- **Museum-grade credits landed**: Crooked Home guests = Chad Cromwell (Neil Young/Mark
  Knopfler drummer), Marc Rogers (bass/keys), Lindsay Lou (2 tracks); label Tolok Records;
  recorded Addiction Studios Nashville w/ David Kalmuskey. → Pop Up Video fodder.

## SINGLES & RARITIES — FINAL ROSTER v2 (post-verification)
Chase The Dragon (2024) · Weathervane (2025) · Wildfire (2024) · Shapeshifter (2019) ·
**Cookin' in the Bathroom (2024)** ← moved off CH · **A Pot Song (2025)** ← moved off CH ·
**Sleight of Hand (2020)** ← moved off LIAW · Highway Man Blues (2026, audio TBD) ·
Charleston Girl (cover; YT renditions) · Down Out Law (comp track, audio TBD) ·
Cocaine Cocaine (slot reserved) · MD picks embed-only: Park Bench Pigeons, Cellophane Snake.
Crooked Home + LIAW containers: REMOVE the three mis-shelved tracks' YT children → re-parent
those children under the Rarities container (renditions follow the artifact).

## EXECUTION ORDER (next session, fresh context)
1. VERIFY-CH + VERIFY-SOH (two streaming-tracklist lookups) → finalize roster.
2. Transcode pass (ffmpeg V0) + duration-dedup report + FLAC DATE harvest.
3. Gated MV write (dry-run → snapshot → apply; coordinated tag writer).
4. R2 sync (~80 mp3s + any cover upgrades) → export → build → deploy → eyes.
5. Descriptor rename "Official…"→"MUSIC VIDEO" rides the same export/labels pass.
