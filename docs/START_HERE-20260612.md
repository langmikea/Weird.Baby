START_HERE — Weird.Baby Museum (Hunter Root exhibit) — session resume point
Updated 2026-06-12 PM (corrected: Stream A closed, /hr SPA fix shipped; prior
version of this file was a mis-copy of C:\AI\START_HERE.txt — this is the brief)

== OPERATING RULES (binding) ==
You handle Ops (scoping, scripts, verification, deploys-via-Mike); Mike handles UX calls and
host-side execution. Questions to Mike only when load-bearing and UX-facing — one at a time,
short, plain. No guessing: look it up via pwsh (Mike runs it, pastes back) or browser/Cowork
analysis (verify any file claim host-side). You lead the engineering; Mike is the UX call and
the hands. He is slow and error-prone — keep his steps small, one paste at a time.

== CRITICAL ENVIRONMENT LESSONS (hard-won; do not relearn) ==
1. The Cowork/sandbox FUSE mount CORRUPTS and MISREADS this repo — appends NUL/whitespace
   junk, reports phantom truncations. Host-side pwsh sees truth; the mount lies. ALL edits =
   host-side pwsh scripts Mike runs: read exact anchors -> build content in $env:TEMP ->
   copy onto repo -> verify (change present, NULs=0, expected dirty count, npm run build
   exit 0). Cowork OK for analysis only.
2. Every edit script: heredoc @'...'@ -> Set-Content $env:TEMP\x.ps1 -> pwsh -File. NEVER
   raw multi-line console pastes (they stick). Assert every anchor count == 1 BEFORE any
   write. Verify with the EXACT inserted strings only (inferred counts caused two false
   alarms). Newline-aware anchors ($nl detect CRLF/LF per file). NOTE: scripts that need
   to embed multi-line content cannot nest heredocs — ship content base64-encoded instead.
   NOTE: [System.IO.File] methods resolve relative paths against the PROCESS cwd, not
   PowerShell's cd — always Resolve-Path first.
3. Build and deploy are SEPARATE steps. Deploy: cd repo; npx wrangler@4.81.1 deploy
   (pin 4.81.1; npx outside repo prompts a global install — answer n and cd first).
   code:10001 auth -> Mike runs npx wrangler@4.81.1 login, then re-deploy (dist/ persists).
   Mike often deploys/commits between pastes silently — curl the live bundle hash to confirm
   state before declaring anything shipped.
4. Commit each verified phase immediately, explicit paths, never git add -A.
5. MediaVault DB: C:\AI\Platform\MediaVault\core\mediavault.sqlite · UI http://127.0.0.1:51822
   MV WRITES: gated scripts only (dry-run default -> --apply with MV CLOSED -> snapshot to
   core\backups\ first). MV must be RUNNING for npm run export-artifacts. Host Python needs
   encoding="utf-8" on open(). MV tags column = JSON ARRAY STRING — parse/serialize JSON,
   never string-append; route tag writes through MV's coordinated writer
   (core.artifact_tags.write_artifact_tags, spec §4.5) — one prior direct write
   (preslink_tag.py) needs a tag-index audit.
6. Browser extension on live /hr is flaky (tabs die on Mike's PC resets; recreate via
   tabs_context_mcp createIfEmpty). Aggressive scrolling froze CDP screenshots pre-relayout;
   gentle 3–4-tick scrolls + DOM measurement (javascript_tool) are ground truth; visual feel
   is Mike's eyes. YT fetches 429 from sandbox; curl youtube.com/oembed works for titles.
7. Truth ranking: live tree > git log > this brief > memory. Open with host-side git status
   + read the relevant file before editing. (This ranking caught two stale claims in the
   prior brief on 2026-06-12 — it earns its keep.)

== REPO STATE ==
C:\AI\Projects\weird-baby-museum, branch main. Live: https://weird-baby.langmikea.workers.dev/hr
2026-06-12 PM baseline: 9b3def8 — worker.js final 404 was swallowing SPA deep links
(/hr returned a hard 9-byte 404); non-API paths now delegate to env.ASSETS.fetch
(ASSETS binding added to wrangler.jsonc). Verified live: /hr 200 + SPA shell, /api/*
guard intact, guestbook OK. NOTE: worker.js contains a presets feature
(/api/presets, UX_PRESETS_SPEC §0) that predates this brief's lineage — undocumented
elsewhere; be aware it exists when touching worker.js.

== STREAM A: CLOSED 2026-06-12 (Mike's call: "Bottom is fine") ==
Phase 3b never happened. f8a28bc (Jun 10, ~2h after Phase 3a 7b052b3) reverted .pb to
position:fixed;bottom:0 and removed the scroll-clamp machinery. Two days of UX polish
then shipped on the fixed-bottom bar (27f2bcb gold edge/68px, 925a806 fixed top nav,
010f692/e290e1a/9f6d585 rendition dropdown + typography, 2266c70 coverflow spread).
The fixed-bottom player bar is the design of record. PlayerBar JSX still renders at the
album/deck seam (line ~1046, Exhibit.jsx) — harmless, position:fixed ignores DOM
placement. The HrExhibitFlow.css:541 comment block describing the deck/:has() interplay
is stale (pre-Phase-2b). DO NOT REOPEN sticky/clamp work unless Mike asks.

== STREAM B (ACTIVE): Batch 2 — the catalog ingest (large, gated, data) ==
CONTEXT: Mike bought Hunter's ENTIRE Bandcamp catalog (26 releases, FLAC). Everything is
prepped; the MV write is the remaining build.
THE CONTRACT (read first): docs/BATCH2_MAPPING-20260612.md — 71 album tracks + Rarities
roster v2, verifications cleared (Cookin' in the Bathroom, A Pot Song, Sleight of Hand are
singles mis-shelved on CH/LIAW -> move to SINGLES & RARITIES, re-parent their YT children),
Arkansas gains Good On Paper + Run From The Devil + Silver Lining reprise (slug
silver_lining_reprise), Phone Recordings EP = entire new 5-track album.
MATERIALS ON DISK: intake\bandcamp\ = 26 FLAC purchases (masters) · _extracted\ = 7 albums
unzipped (+ authoritative cover.jpg/png each) · _mp3\ = 78 transcoded V0 mp3s +
transcode_manifest.json (title/album/track/date/duration per file).
ARCHITECTURE (from export-artifacts.mjs + tools/rwth_album_mvwrite.py, the template):
tracks = released children of card_kind:album containers, grouped by tags.song[0]; members'
renditions merge into one track's videos[]; audio rendition = child with primary_url (mp3 on
R2); order = container notes.track_order. Attach audio to existing track = new audio child +
SAME song tag as its YT sibling. New track = new child + new slug + extend track_order.
Masters: FLAC paths recorded in notes.master_path (proposal); artifact file = mp3.
EXECUTION (per contract §EXECUTION ORDER): gated MV write script (dry-run -> snapshot ->
apply, coordinated tag writer) -> node tools/sync-assets-to-r2.mjs (~78 mp3s + cover
upgrades) -> export (MV open) -> build -> deploy -> Mike's eyes -> commit. Result: museum
goes 48 -> ~80 tracks, audio everywhere. Descriptor rename "Official..."->"MUSIC VIDEO"
rides the same pass (render-side tidyDesc in Exhibit.jsx already normalizes; extend mapping).
Rarities container needs cover art — Mike's design moment; placeholder OK to ship.

== SMALLER OPEN ITEMS (BACKLOG.md is the full ledger) ==
- PUV (fact scroller) background doesn't match neighbors (Mike's eyes report) — next CSS cycle.
- BANNER-MATCH-NAV one-liner may be superseded by the relayout — re-check live first.
- FB export test on Mike's account: FB was laggy, retry pending (protocol in BACKLOG.md
  FB-EXPORT-RECON: JSON + High + all-time + Posts/Photos+Videos).
- WB color: direction approved (DuPont car-paint -> Fender Easter egg KEEPS), hue punch
  insufficient — Mike researching, will return with a spec. Background also non-sacred;
  satin-paper tile wallpaper concept queued for the same mock session.
- Watches: "Cocaine Cocaine" (unreleased single, IG bio) · "Highway Man Blues" (rJxOkf24BVI,
  official upload on no release list) · CPMA cycle each spring. Scour playbook:
  docs/YT_SCOUR-20260611.md. Research docs: NIGHT_RESEARCH-20260611.md,
  HR_DEEP_RESEARCH_DOSSIER-202606.md (partially verified).
- July: Mike sees Hunter — prep a one-pager of asks (FB DYI export; masters for produced
  videos; MD audio blessing for Park Bench Pigeons + Cellophane Snake in Rarities).

== RECOMMENDED OPENER ==
1. Host-side git status + live bundle curl (truth check).
2. Stream B: the Batch 2 MV write — the museum-tripling build. Read the contract first.
