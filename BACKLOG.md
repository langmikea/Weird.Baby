# Weird.Baby Museum — Backlog

**Last updated:** 2026-06-11 (post design review + Batch 1 rendition enrichment)

This file holds aspirational work. When something here lands a commit,
remove the line. `NAVIGATION.md` describes current state. `STATE.md` is the
durable reference (stack, routes, mothballs).

---

## Tier 1 — Active (in flight or next session)

**Video-panel stretch fix.** Idle `.vp-thumb` overlay renders album art /
YT thumbs with a bare unclassed `<img>` that stretches to fill; the
`.vp-audio-only` / `.vp-ao-art` path sizes correctly. Mirror the ao-art fit
treatment onto the thumb overlay imgs (Exhibit.jsx ~line 1001–1012 +
Exhibit.css). Scoped 2026-06-11; waiting on Exhibit.css read.

**Batch 1b — album covers into MV.** Six covers acquired from Bandcamp
(1200×1200, authoritative): arkansas, crooked_home, life_inside_a_wheel,
mimicking_the_sun_like_dandelions, skipping_stones, they_finally_cracked_me.
Ingest as photo artifacts, parent to containers, set notes.cover_artifact_id,
R2 sync, export, deploy. Pattern: follow MV-20260419-003 (RWTH cover) row +
storage conventions. Fixes the empty carousel AND feeds the idle panel.

**Batch 2 — discography reconciliation.** See docs/BATCH2_SCOPING-20260611.md.
Arkansas missing 3 tracks, Life Inside A Wheel missing 10, Phone Recordings
EP + Sleight of Hand single + ~14 standalone singles unmodeled. GATED ON
operator decision: where do non-album releases live in the exhibit.

**Release the 6 inbox photos.** Harrisburg live shots (MV-HR-20260405-019/
020/023/024/025/036) sitting in inbox — release call + gallery placement.

---

## Tier 2 — Pre-Launch Required

**/hr deep-link 404.** Worker serves 404 for /hr hit directly (no SPA
fallback); route only works client-side from root. Breaks shared links and
refresh. Deploy-config change — own scoped task. (Found 2026-06-10 review.)

**Founding Visitor Easter Egg.** Timestamped badge for pre-announcement
visitors. D1 schema change. Must land before any external link.

**Persistent Guest Book Entries (D1).** Currently ephemeral.

**Persistent Vote Counts (D1).** Anonymous dedup via IP+UA hash, server-side.

**Fan Playlists.** Spec: docs/FEATURE_fan_playlists.md. SEQUENCE AFTER the
Tracklist Queue Overhaul — both touch the queue core.

---

## Tier 3 — Quality of Life

**Tracklist Queue Overhaul.** Single click queues, double click plays-now,
visible queue UI, interrupt+resume, video-area render changes. Touches the
core of Exhibit.jsx — scope before building. (Moved from old Tier 1: it's a
landmine-class change, not a quick win.)

**RWTH children: restore song: tags in MV.** Stripped MV-side between
2026-05-31 and 06-10 (origin unknown — possibly the fruitless session or tag
cleanup). Invisible today (id-fallback grouping works); breaks the moment a
RWTH track gains a second rendition. Also: investigate what stripped them.

**Cover-pill verify.** TAG_SLOTS includes "cover" so the pill should render
for the Violet Lempke cover on Cookin' — confirm on live; fix if absent.

**SM Video/Audio Handoff.** Fade/pause/resume song when a panel SM video plays.

**Real Auth for Entry Ownership/Delete.** Once journal entries persist.

**Weighted Journal Selection Tied to Live Vote Data.**

**ytId duplicate question.** FbOoHjoSyec now referenced 3x (HR_ARTIFACTS
art-8-2022-09-09, HR_ARCHIVE arc-20-2022-09-09, and rendition
MV-HR-20260610-004). Decide policy for multi-surface video reuse.

**Live-clip curation sweep.** ~10 fan-corpus live clips (Wonder Bar, Acid
Palms, Nectar's, band versions) — operator taste pass, anytime.

**Mobile UX verify-pass.** Deck de-fix, proximity snap, and the fixed bottom
player bar (iOS safe-area, viewport-height quirks) have never been checked at
narrow widths since the Phases 1–3b relayout. Mostly operator thumbs.

**Shorts bucket.** ~140 channel shorts/promo posts in
yt_research/yt_bulk_triage_20260524T005805Z.md need a home-or-skip decision.

---

## Tier 4 — Polish & Cleanup

**UI polish.** Center HUNTER ROOT in nav; journal alignment (P2/P3); active
coverflow album larger.

**Content polish.** Artist photos for gift shop roster; rewrite wb_roster.js
featured blurb (the Lancaster revision was lost uncommitted — rewrite from
scratch); walked-in bell audio for gift shop.

---

## Tier 5 — Future / When Ready

**Top-pin revisit (player bar).** Parked by explicit decision 2026-06 (Phase
3b). Genuine layout problem: sticky containing block vs abs-grid scroll
decoupling. Do not reopen without a scoped tradeoff decision.

**Museum Merch Pipeline.** Big Cartel + Printful.

**Content Archive Preservation.** Hard copies + Digital Archive Catalog
System. Needs scoping session.

---

## Outside museum (system-level, tracked elsewhere)

- OneDrive migration for C:\AI workspace
- Cancel Square Online subscription (manual)
- Cancel/disable GoDaddy site builder (manual)

---

## MediaVault Tag Vocabulary — Targeted Cleanup

Per docs/MV_TAG_CLEANUP_DESIGN.md: platform category, unused-4 disposition,
rarity/scope depth check. NOTE: before running any further tag cleanup,
resolve the RWTH song-tag stripping (Tier 3) — a cleanup pass is a suspect.

---

## Done since last update (removed)

- Exhibit relayout Phases 1–3b (scroll snap, always-on player bar, deck
  de-fix, bar relocated + fixed to viewport bottom) — shipped f8a28bc
- Phase 2b deploy verification — long since deployed and verified
- Phase 2.5 session-brief move — SESSION_CLOSE files no longer tracked
- Batch 1 rendition enrichment (8 renditions + TFCM title fix) — 8fb0e86
- Design review 2026-06-10 — stable-base verdict, fragility inventory

---
## INTAKE 2026-06-11 PM (Mike) - pre-launch sweep
- CAROUSEL-DENSITY: use full carousel width, more albums visible at once.
- LOGO-TOPLEFT: tiny Weird.Baby logo mark in nav top-left (needs asset plumbing).
- NEWS-COLLECTOR: News of Today + News of This Day -> PUV material + deck filler cards for odd masonry shapes.
- CLAUDE-CERT + CLEAN-CERT (post-launch deep-clean track, NOT a launch gate): Claude certifies every artifact before Mike review; clean-cert = reviewed + unaltered since (updated_at tamper detection); MV filter to find/set; implementation = Ops proposal.
- TAG-AUDIT + RAWTEXT-AUDIT: how are artifacts actually tagged; is raw text retained everywhere for future search/tag-gen.
- TABS-OUT -> P&F POPOVERS: tabs removed; PRESETS & FILTERS popover editors over static museum; agile rapid prototyping; Claude proposes UX.
- FB-DOWNLOAD-TEST: never tested; test on Mike's own FB account before HR permission lands.

---
## INTAKE 2026-06-11 EVENING (Mike)
### Live defects (Cycle 2 in flight)
- DECKBUG-FBBLOCKS: FB embeds show black/white block at bottom (hardcoded frame heights vs actual).
- DECKBUG-SEAM: background seam where deck tabs lie; first artifact row crammed at exhibit bottom edge.
- DECKBUG-UNAVAILABLE-LEAD: first deck card is a rights-restricted FB video FB refuses to embed -> demote to link card or change leadoff (MV data decision).
- SNAP-DOUBLE: html+body both scroll-snap (fix in Cycle 2a); tap-to-top snap-captured (fix: instant).
### GUI
- TITLESEL: song title IS the dropdown; one option per rendition with descriptive label. Supersedes pill-cycling. (Cycle 2a; iterate on look.)
- SELECTION-MODEL note (needs clarification later): cycling multiples within a type; one of each type per category; a song from each category permitted.
- AUDIO-ONLY-RENDITIONS: [AUDIO] per track for screen-off playback (YT halts video). RWTH mp3-on-R2 pattern is the template.
### Features / platform
- EXPORT-PRESETS-SPOTIFY: export jukebox presets as Spotify (etc.) playlists.
- WALLPAPER-1960S: wallpaper = 1960s B&W photo feel (ISO grain, satin paper softness; reference Weird.Baby logo).
- CAPTURE-ALL-TO-DISK: vault every capturable asset (YT etc).
- LEGAL-NONCOMMERCIAL-REVIEW: noncommercial-only platform clauses vs free museum - needs proper review.
- SEO-GOOGLE (post-launch): when/how we appear in Google; readiness checklist.
### MediaVault
- MV-SIMPLE-ID: simple definitive artifact ID in detail pane ("ID ######").
- MV-DEDUP: cleanup/dedup pass (two Cheech & Chong artifacts spotted).
- MV-TEXT-REFRESH: tags + full source-page text re-pulled on most artifacts (pairs with TAG-AUDIT/CERT).
- MV-SHOW-ALBUM-ART: show album art in MV UI.
- MV-COUNT-LOGIC: "# of ##" when only # accessible - fix the denominator.
