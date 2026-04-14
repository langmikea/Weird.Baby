================================================================================
Weird.Baby Museum — STATE.md
================================================================================
Always read this file first. Then read C:\AI\VISION.md and docs\COMPONENT_PHILOSOPHY.md.
Last updated: 2026-04-13 (Carsie Blanton exhibit wired — awaiting deploy)
================================================================================
WHAT THIS PROJECT IS
  The Weird.Baby Museum. An independent curatorial entity.
  Not a fan page. Not a promotional arm. A museum.
  Current featured artists: Hunter Root (/hr) and Carsie Blanton (/cb — built, awaiting deploy).
  Live at: https://weird.baby + https://www.weird.baby (both active April 11 2026)
  GitHub: langmikea/Weird.Baby
  Cloudflare Worker: weird-baby (Langmikea@gmail.com)
  Cost: ~50.20/yr

VISION AND PHILOSOPHY
  C:\AI\VISION.md                          — north star, read this
  docs\COMPONENT_PHILOSOPHY.md             — how everything looks and behaves

CURRENT ROUTE STRUCTURE
  /              -> WbHome — LIVE. Soft open. Guest book (D1). W.B. logo.
  /admin         -> WbAdmin — LIVE. Triggered by typing mmm anywhere.
  /hr            -> HrSpine — LIVE. Full exhibit: coverflow, tracklist, panels 2-4, journal.
  /hr/home       -> HrHome — preserved, not front door anymore
  /hr/archive    -> HrArchive — LIVE. Full discography, expand/collapse
  /hr/workshop/lyric-map -> LyricMap — LIVE. 4-artist lyric analysis tool
  /hr/media      -> stub
  /hr/fan-wall   -> stub
  /hr/workshop   -> stub
  /hr/merch      -> redirects to hunterroot.com/merch
  /cb            -> CbSpine — BUILT LOCALLY, awaiting deploy. Carsie Blanton exhibit
                    (coverflow, tracklist, facts, player — mirrors HrSpine architecture)

INFRASTRUCTURE
  D1 Database: weird-baby-db (4db60094-122a-4618-b3c5-8664f74af222)
  Tables: guestbook, visits
  Code splitting: LyricMap isolated to lyricmap chunk (fixes deploy hash issues)
  Worker entry: src/worker.js — handles /api/guestbook, /api/visits, /api/admin
  DNS: managed in Cloudflare. www CNAME removed; www.weird.baby added as
       Worker custom domain directly. GoDaddy holds registrar only.
  Deploy: npx wrangler deploy (from project root)
  Build: npx vite build (rm -rf dist first if EPERM issues)
  Favicon: public/favicon.ico (generated from W.B. logo)

CURRENT DEPLOYED VERSION: r25
  Deployed: 2026-04-13
  Architecture: Unified Exhibit Flow (HrExhibitFlow.jsx)
    - Panels 2, 3, 4 merged into single component with shared Journal
    - 60/40 CSS Grid: left column (scrolling sections), right column (sticky Journal)
    - ExhibitScroller: auto-advancing card viewer (7.5s, hover-pause, wrapping nav)
    - Scroll-snap: mandatory, center-aligned sections, smooth scroll
    - overflow-x: clip on html,body (not hidden — preserves sticky + snap)

  Panel 2 — "As It Happened" (archive timeline)
    Data: src/data/hr_archive.js
    Types: historical | interview | rarity
    20 entries (7 historical, 8 interview, 5 rarity) — loaded from KNOWLEDGE.md April 12 2026
    Spans: June 2012 (formation) through November 2025 (Crooked Home press)

  Panel 3 — "The Artifacts" (physical/ephemeral memories)
    Data: src/data/hr_artifacts.js
    Types: poster | setlist | photo | fan-art | handwritten | video | ticket
    13 entries — regrounded from KNOWLEDGE.md + channel_videos.json April 12 2026
    Videos: first show footage, Atomic 7, Summer Threestival, TRH, Reverend, QS, Zoetropolis, Cookin, A Pot Song
    Photos: SEEDS live (2013), SEEDS CD (2013), basement after show (2014), Harrisburg show (2025)
    Full spec: docs/PANEL3_ARTIFACTS_SPEC_v0.1.md

  Panel 4 — "That's a Wrap" (exit flow)
    Data: src/data/hr_exit_flow.js
    Types: quick (short punchy) | deep (curatorial reads) | highlight (exhibit details)
    24 entries (12 quick, 5 deep, 6 highlight, 1 closing) — factual fixes applied April 12 2026

  Journal — single sticky instance, shared across exhibit
    Data: src/data/hr_journal_prompts.js (10 prompts — expanded April 12 2026)
    13 seed entries, weighted random feed, voting, compose
    Filters by era context from coverflow

  hr_facts.js — spine contextual facts
    51 entries (7 artist, 44 album/track-level) — artist-002 corrected, 6 new entries April 12 2026
    BACKLOG flags added for 3 unverified claims (see file header comments)

  Player Bar — skip back/forward, play/pause, mute, volume slider, CC button
  Nav — WEIRD.BABY (home) | Hunter Root (exhibit name) | RETURN TO LOBBY (home)

  Spine / Coverflow:
    - Tag system: era (#534AB7), type (#0F6E56), src (#993C1D)
    - ALBUM_ERA map: all solo-era albums map to "solo"
    - Pills: tl-tag style, always-at-least-one-selected, tucked under image viewer

KEY FILES
  src/routes/hr/HrSpine.jsx          — Main exhibit component (coverflow, tracklist, player)
  src/routes/hr/HrExhibitFlow.jsx    — Unified P2+P3+P4+Journal
  src/routes/WbHome.jsx              — Front page
  src/data/hr_archive.js             — Panel 2 data (3 entries)
  src/data/hr_artifacts.js           — Panel 3 data (10 entries)
  src/data/hr_exit_flow.js           — Panel 4 data (20 entries)
  src/data/hr_journal_prompts.js     — Journal prompts (4 entries)
  public/WeirdBaby_PhotoID.png       — Front page + favicon source image

PHASE 1 — COMPLETE
  Infrastructure, tools, databases, lyric intelligence, content archive,
  discography data, deployed scaffold. The backstage is built.

PHASE 2 — MUSEUM BUILD (current)
  Spine architecture LIVE
  Guest book LIVE — D1 backed, real persistence
  Admin LIVE — mmm key sequence, visits + guestbook data
  Exhibit Flow LIVE — unified P2/P3/P4 with sticky Journal
  *** NOW: Load real content into panels ***

DESIGN DECISIONS
  - Each exhibit gets a single room (page). No separate landing pages.
    /hr (HrSpine) IS the Hunter Root exhibit. HrHome route preserved, not built.
  - Panels are auto-advancing card scrollers, not static prose.
  - Pills filter content types within each panel, always at least one selected.
  - Journal is curatorial, not social media. Weighted feed, not chronological.
  - "Every surface is satisfying in itself."

BACKLOG (cosmetic, deferred)
  - Center 'HUNTER ROOT' in nav bar
  - Add revision number (r##) to lobby/home page
  - Journal alignment fine-tuning (closer on P2, slightly off on P3)
  - Active album on coverflow should be larger
  - GoDaddy site builder still published at weirdbaby.godaddysites.com
  - Domain transfer: GoDaddy -> Cloudflare (EPP code needed)

ADDED THIS SESSION (CB EXHIBIT) — April 13 2026
  New files:
    src/routes/cb/CbSpine.jsx        — Second artist exhibit, mirror of HrSpine
    src/routes/cb/cb_discography.js  — 11 spine entries, 60 verified ytIds
    src/routes/cb/cb_facts.js        — 32 facts (10 artist, 1 meta, track/album)
  App.jsx:
    + import CbSpine and registered <Route path="/cb" element={<CbSpine />} />
  Build: `npx vite build` clean (43 modules transformed)
  Deploy: BLOCKED — CLOUDFLARE_API_TOKEN not available in this sandbox session.
    Mike: run `npx wrangler deploy` locally to ship.

HR-SIDE REPAIRS (needed so build would pass)
  src/routes/hr/HrSpine.jsx had been saved truncated (mid-<img>). Closing JSX
  + closing brace appended. HrExhibitFlow import + usage commented out because
  src/data/hr_archive.js and src/data/hr_artifacts.js are ALSO truncated in
  this working copy. Restore those data files, then re-enable HrExhibitFlow
  (two one-line changes in HrSpine.jsx, both marked with "disabled" comment).

ADDED PREVIOUS SESSION — April 13 2026
  HrSpine.jsx — Crooked Home tracklist:
    + Cookin' in the Bathroom (official MV, live acoustic, Violet Lempke cover)
    + A Pot Song (official clip, official audio, Cheech & Chong cover)
  hr_artifacts.js — new entries:
    + Covert Concert Series full session (2020, pre-viral)
    + Line Check Audio Sessions — Can't Outshine The Truth (2022, 214K views)
    + Violet Lempke — Cookin' in the Bathroom cover (2025)
  hr_archive.js — new entries:
    + Covert Concert Series (rarity, 2020)
    + Line Check Audio Sessions — Can't Outshine The Truth (rarity, 2022)
    + Line Check Audio Sessions — Quicksand Sinking (rarity, 2023)
    + Medusa's Disco — Hunter Root on collaborating with Alex Aument (interview, 2023)

RESEARCH CORPUS — collected April 13 2026
  C:\AI\Projects\Hunter Root\yt_research\
    channel_videos.json   — 125 official channel videos (with view counts)
    fan_yt.json           — 175 third-party YT vi