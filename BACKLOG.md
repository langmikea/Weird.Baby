# Weird.Baby Museum — Backlog

**Last updated:** 2026-06-13 (Ops: backup + route-table items logged)

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

**Tracklist Queue Overhaul.** SUPERSEDED 2026-06-24 by TL-INTERACTION-2026-06-24
(see intake block). Queue mechanics (visible queue UI, interrupt+resume,
video-area render) remain valid as future work, but the click-model is now
defined by the new spec, not "single-click queues / double-click plays."
Touches the core of Exhibit.jsx — scope before building.

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

**Content polish.** Artist photos for gift shop roster (Hunter done; others
pending); walked-in bell audio for gift shop. [Featured blurb DONE 2026-06-23.]

---

## Tier 5 — Future / When Ready

**Top-pin revisit (player bar).** Parked by explicit decision 2026-06 (Phase
3b). Genuine layout problem: sticky containing block vs abs-grid scroll
decoupling. Do not reopen without a scoped tradeoff decision.

**Museum Merch Pipeline.** SHIPPED 2026-06-23 (Printful Quick Store live, sticker for sale, gift shop banners — deploy c12cffe5). Remaining: shirts + hats (new products), Big Cartel Platinum + shop.weird.baby at launch. See STATE.md "GIFT SHOP — SHIPPED LIVE".

**Content Archive Preservation.** Hard copies + Digital Archive Catalog
System. Needs scoping session.

---

## Outside museum (system-level, tracked elsewhere)

- OneDrive migration for C:\AI workspace
- Cancel Square Online subscription (manual)
- Cancel/disable GoDaddy site builder (manual)
- Off-GitHub repo backup: clone to an off-disk target (external drive or cloud-synced folder) + scheduled refresh — OPS-CHARTER §3.1, the #1 data-loss guard. Pursue 2026-06-17 or later (Mike traveling, no external-drive access). Can ride the OneDrive migration above.

---

## Ops / Infrastructure (Claude-owned, Ops-timed)

- Route-status table upgrade: promote STATE.md "Live routes" from a name list to LIVE / STUB / REDIRECT + powering component per route (OPS-CHARTER §1). Fold in when the route table is next touched (i.e., when `/drawing` or the Stacks surface lands). Ops decides exact timing.

---

## Deferred notes (extracted from museum-orientation-e1c2a20 before its deletion, 2026-06-13)

- DISCOVERY-DATAMODEL-RECONCILE: before any discovery data-model work, land a note in `docs/deep-dive-review/SPEC_DRAFT_v5_2.md` §7 ("What v5.2 does NOT do"), cross-ref §5: reconcile `discovery-filter-ux-spec.md` §9 — `facet_type: total|partial` on every facet; split Kind from Format into two required tags. (Feeds the filter-system build. v5.2 is the active discovery spec head; facet schema is spread across the v-spec line + CANONICAL_VOCABULARY.md.)
- ROUTE-TABLE-PLANNED: add a STATE.md "Planned routes" line for `/drawing` + the Stacks surface; reconcile STATE.md route table to `src/App.jsx` <Routes> (~lines 54–64; live: /, /admin, /hr, /hr/home, /hr/media, /hr/archive, /hr/fan-wall, /shop, /p/:id). Prereq = OPS-CHARTER §8 first-run checklist item 2 (confirm the one canonical STATE.md). Pairs with the Route-status table upgrade already in Ops/Infrastructure below.
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
## INTAKE 2026-06-24 (Mike) — post gift-shop-ship
### New exhibits / pages
- EXHIBIT-WEIRDBABY (Med): add a Weird.Baby exhibit (the museum as its own exhibit subject). Uses the shared Exhibit.jsx + per-artist config pattern (src/data/artists/). Scope content first.
- EXHIBIT-SONGS-ESSENTIAL (Med): add exhibit "songs everyone should hear at least once." Curatorial/content-driven; same Exhibit.jsx config pattern. Scope the song list + sourcing.
- LOBBY-DIRECTORY (Med): build the lobby page as the site directory — the front-door index to every exhibit + the shop. (Distinct from current WbHome lobby; this is the navigational directory surface.)

### PUV
- PUV-FACTS-FIX (Med, COWORK JOB): the PUV fact content is wrong/needs correction (data in src/routes/hr/hr_facts.js). Content fix, not the box-sizing fixes (those are PUV-HEIGHT-ADJUSTABLE + Tier-1 stretch fix). Cowork can read + draft corrected facts; Mike writes.

### Tracklist — TL-INTERACTION-2026-06-24 (SUPERSEDES all prior TITLESEL / queue click-model)
This is the single source of truth for tracklist click behavior. Replaces TITLESEL (06-11), SELECTION-MODEL (06-13), and the click-model half of Tracklist Queue Overhaul.
- Single click on SONG TITLE -> FOCUS the track (select/highlight; does NOT play).
- Double click on SONG TITLE -> PLAY the track.
- Click on SONG DESCRIPTION (the descriptor text) -> open a DROPDOWN. (Carries forward the prior "descriptor has-dropdown-data flag" idea: descriptors with dropdown data are interactive.)
- Track NUMBERS: darker (currently too light).
- CURRENTLY-PLAYING track: make it MUCH more visually obvious.
- All of the above live in the shared Exhibit.jsx tracklist (TrackList) — landmine-class, shared across exhibits now. Scope before building.

### iPhone / mobile
- IPHONE-CLEANUP (Low — LAST step before launch): clean up iPhone/narrow-width views. Folds together with the existing Tier-3 "Mobile UX verify-pass" + STATE.md mobile-UX flag. Do last.
## INTAKE 2026-06-13 (Mike)
### New items
- PUV-HEIGHT-ADJUSTABLE: adjustable height of the PUV->Video box, scaling both (PUV and video) proportionally along the way. (New; distinct from the Tier-1 video-panel stretch/img-fit fix.)
- DECK-SCROLL-OCCLUSION (live defect): cannot scroll to the bottom of the deck — the fixed player bar hides it. Bottom deck content is unreachable. (Related to Tier-5 top-pin + DECKBUG-SEAM but distinct: functional occlusion, not just seam cosmetics.)
### Refinements to open threads
- WB-COLOR / COLOR-VERDICT resolution (Mike's "specific request" promised 2026-06-12): Mike prefers the colors AND fonts of `docs/filter-instrument-reference.html` (the v7_1 filter instrument). Use it as the color+font design source for the WB-COLOR live mock. (Source file also at C:\Users\macun\Downloads\filter-instrument-v7_1.html.)
- TITLESEL / SELECTION-MODEL: [SUPERSEDED 2026-06-24 by TL-INTERACTION — see latest intake. The descriptor->dropdown idea and the per-descriptor has-dropdown-data flag carry forward into the new spec.]
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
- TITLESEL: [SUPERSEDED 2026-06-24 by TL-INTERACTION — see latest intake. Original: song title IS the dropdown.]
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

### DECISION 2026-06-11 (late): FB/YT content strategy reaffirmed
- FB-DIMS measurement batch CANCELLED before execution - conflicted with plan of record.
- Plan of record: HR requests FB data export -> DL link -> Mike downloads -> vault + serve real files. Embeds are interim only; no further investment in embed fidelity beyond disposable cosmetics.
- Remaining interim FB work: demote the rights-blocked Unavailable leadoff card (tiny MV presentation change); optional one-rule CSS so letterbox reads as deliberate screen.
- YT: EMBED at launch (licensed, robust). Long-term archive of Hunter-owned content = source files FROM HUNTER via same pipeline, NOT YT ripping (ToS + rights). Third-party content (reactions/covers/Topic audio) stays embed-only pending LEGAL-NONCOMMERCIAL-REVIEW / creator permission. Metadata/transcripts/thumbnails archiving continues - the defensible preservation layer.

### INTAKE 2026-06-11 NIGHT (wrap-up notes, Mike)
- CAROUSEL-ARROWS: larger arrow hit targets (real or virtual).
- CAROUSEL-SWIPE: more visual reaction/feedback to a swipe.
- CONTENT-MINIMUM-STANDARD: every song on every album carries AT MINIMUM an AUDIO + OFFICIAL VIDEO rendition; gap analysis folds into Batch 2.
- PER-SONG-WEB-SCOUR: eventually search the web for ANY mention of each song and follow the clues (extends playbook rule 6 from reactions to all mentions).
- BANNER-MATCH-NAV: album banner title same size as HUNTER ROOT nav title (~1.1rem Syne) - one-line CSS, rides next punch-list cycle.
- WB-COLOR: define 'Weird.Baby {color_name}' - one brand accent that pairs with B&W 1960s photos on satin paper; cool, timeless, for the ages. Claude to bring proposals.
- YT-ARCHIVE-LEGAL: archival-only download question folded into LEGAL-NONCOMMERCIAL-REVIEW; interim stance unchanged (source files from Hunter for his content).
- NEXT SESSION OPENERS: Mike's two launch decisions (Batch 2 in/out + placement; tabs->P&F timing) + deck-zone eyes verdict.

### INTAKE 2026-06-12 EARLY (Mike, post-midnight)
- TL-BOLD-FACE: tracklist dropdown closed face = BOLD song title + lighter descriptor. Needs overlay-face pattern (native select popup kept). Cycle 3 opener.
- TL-TIGHT-DESCRIPTORS: normalize rendition descriptors - 'AUDIO' not 'audio recording'; tight uppercase type + qualifier (LIVE - place/date). Render-side munging.
- TL-BIGGER-TEXT: tracklist font size up (~.88rem -> ~1rem) + row breathing.
- BG-NON-SACRED + WALLPAPER-TILE: background color also clean slate; Mike suggests a TILED textured-photo wallpaper (satin paper texture, possibly tinted) to carpet the look incl. color. Fold into WB-COLOR live mock session: trial accent + bg/tile together.

### COLOR VERDICT 2026-06-12 (Mike): trio compelling but HUNTER ROOT/album titles BLEND when they should STAND OUT at those values. Mike researching, will return with specific request. Easter-egg backstory (DuPont car paint -> Fender -> museum) APPROVED - keep regardless of final hue.

### FB-EXPORT-RECON 2026-06-12 (Claude, pre-test research)
Mechanism: Accounts Center -> Your information -> 'Download Your Information'. Options: HTML or JSON format; media quality High/Medium/Low; date range; per-category selection (Posts, Photos and Videos, Messages, etc.); deliver as ZIP download or transfer to Google Drive/Dropbox. Big accounts can exceed 12GB / multiple ZIPs; narrowing date range avoids timeouts. Link arrives by notification/email when ready.
FOR OUR PIPELINE: request JSON + High + all-time + (Posts, Photos and Videos) - JSON is the machine-readable shape MV ingest wants; skip Messages.
KEY CAVEAT: even 'High' media is RECOMPRESSED by Facebook - the export yields FB's copies, NOT originals. Implication: the FB export is the right source for FB-NATIVE content (reels, post videos, photos), but produced music videos still want Hunter's actual source files. TWO asks for Hunter, not one: (a) run DYI export, (b) share masters for produced work.
TEST PROTOCOL (Mike's account): request JSON+High, all-time, Posts + Photos and Videos only -> when ZIP arrives: map structure (folder layout, how video files pair with their JSON metadata; which fields exist - timestamps, captions, locations) -> report -> Claude designs the MV ingest mapping from the real shape.

### GAP-ANALYSIS 2026-06-12 (Claude): CONTENT-MINIMUM-STANDARD vs reality
0 of 48 museum tracks meet AUDIO+OFFICIAL. Split: RWTH 15/15 audio-only; other 33 video-only (29 have officials; 4 Arkansas live-cuts + Straitlaced likely have NO official - standard needs 'best-available video' exception clause).
KEY RECOMMENDATION - BANDCAMP AUDIO LAYER: buy Hunter's catalog on Bandcamp (FLAC quality, legal, pays the artist) -> vault -> R2 -> attach audio renditions via RWTH pattern. One move closes the 33-track AUDIO gap, advances CAPTURE-ALL-TO-DISK legitimately, satisfies screen-off playback, and moots YT-audio archival questions. Cost: tens of dollars. Folds into Batch 2 as its biggest component.

### RJJ-ENUMERATION 2026-06-12 (Claude, browser pass) - scour playbook item D9 CLOSED
RJJ's Reactions (@rjjsreactions-rk7zh, 15.7K subs) 'Hunter Root' playlist PLogTP8PTFkYxhg_lPBmgUxUz85xu96D1l + channel = 5 HR reactions total:
- Town Rat Heathen reaction - DLQtthJbRRI (15:51, ~2023)
- Reverend reaction - cua9sQd_FTE (12:17, ~2023)
- Charleston Girl (Tyler Childers cover) reaction - uSeO_9-TPHg (7:22, ~2024) <- reaction to Hunter's COVER, new find
- Chase the Dragon reaction - 8SlYEOijcTo (9:47, ~2025)
- Cookin' in the Bathroom reaction - tOzREHZp7g0 (10:42, ~2025; on channel, not yet in his playlist)
Candidates for a future 'the internet reacts' deck section; all embed-only per content strategy.

### BOOTH-SESSION INTAKE 2026-07-06 (Mike, via Cowork session; CAPTURE ONLY — timing TBD by Ops, per Mike "don't let me hijack the train")
- FAQ SURFACE (format: FAQ per Mike). Capture + display the governance constraints for all to see. Mike's clarification, near-verbatim: the one-person line ("One person keeps this place, and the job pays nothing. That's the deal, and it never changes.") refers to the ROLE of Papa Weird.Baby and the overarching Weird.Baby org — one day it "may be false" as written for the museum itself. Standing constraints to display: he will never pay to have it managed; only zero-invoice services accepted. Context: booth v4 cut the money + one-person paragraphs (placard went short); the FAQ is where the full deal lives.
- ORG-LEVEL CREDO: "We need similar [words] for Weird.Baby in general at some point" — a Weird.Baby-wide statement beyond the museum's booth. Related to, but not the same as, the full charter workstream already recorded in WB_ARTIST_LOBBY_BOOTH-20260706 Deferred.
