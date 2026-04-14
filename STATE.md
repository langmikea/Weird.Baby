================================================================================
Weird.Baby Museum — STATE.md
================================================================================
Always read this file first. Then read C:\AI\VISION.md and docs\COMPONENT_PHILOSOPHY.md.
Last updated: 2026-04-14 (r28 — gift shop live, Exhibit refactor landed, build time on admin)
================================================================================

WHAT THIS PROJECT IS
  The Weird.Baby Museum. An independent curatorial entity.
  Not a fan page. Not a promotional arm. A museum.
  Current featured artists: Hunter Root (/hr) and Carsie Blanton (/cb)
  Live at: https://weird.baby + https://www.weird.baby
  400+ visits as of April 13 2026, museum unannounced.
  GitHub: langmikea/Weird.Baby
  Cloudflare Worker: weird-baby (Langmikea@gmail.com)
  Cost: ~$50.20/yr

VISION AND PHILOSOPHY
  C:\AI\VISION.md                          — north star, read this
  docs\COMPONENT_PHILOSOPHY.md             — how everything looks and behaves

THE BUILDING — circulation architecture (from VISION.md, enforced in code)
  Lobby  ──► Exhibit A  ──┐
     │  ──► Exhibit B  ──┤
     │  ──► Exhibit C  ──┤
     │                   ▼
     │           Gift Shop  ──► Artist's external store (leaves site)
     │                   │
     │◄──────────────────┘
     │
     └──► [easter egg: grass field — not yet built, lobby-only]

  - Lobby → any exhibit (one per artist)
  - Each exhibit exits through the Gift Shop (no direct lobby exit from an exhibit)
  - Gift Shop exits back to the Lobby, OR out to the featured artist's store
  - The Gift Shop does NOT connect to the grass field. Only the Lobby does.
  - Direct URL arrivals at /shop are allowed; they see a random featured artist
  - Grass field is a future easter egg, reachable only from the lobby, unannounced

CURRENT ROUTE STRUCTURE
  /              -> WbHome — LIVE. Soft open. Guest book (D1). W.B. logo.
  /admin         -> WbAdmin — LIVE. Triggered by typing mmm anywhere.
                    Shows build time, guestbook, visits, page breakdown.
                    Jump buttons: /hr /cb /shop Refresh Back
  /hr            -> HrSpine — LIVE. Thin wrapper around <Exhibit artist={hunterRoot} />.
                    Full exhibit: coverflow, tracklist, player, facts, panels 2-4, journal.
  /hr/home       -> HrHome — preserved, not front door
  /hr/archive    -> HrArchive — LIVE. Full discography, expand/collapse
  /hr/workshop/lyric-map -> LyricMap — LIVE. 4-artist lyric analysis tool
  /hr/media      -> stub
  /hr/fan-wall   -> stub
  /hr/workshop   -> stub
  /hr/merch      -> HrMerch redirect (LEGACY — superseded by gift shop, safe to retire later)
  /cb            -> CbSpine — LIVE. Thin wrapper around <Exhibit artist={carsieBlanton} />.
                    Coverflow, tracklist, facts, player. No exhibit flow below (gap — see below).
  /shop          -> GiftShop — LIVE. Museum gift shop.
                    Featured artist (from ?from=<id> or random), W.B. merch (placeholder),
                    Friends wall (full roster), LOBBY exit.

INFRASTRUCTURE
  D1 Database: weird-baby-db (4db60094-122a-4618-b3c5-8664f74af222)
  Tables: guestbook, visits
  Code splitting: LyricMap isolated to lyricmap chunk (fixes deploy hash issues)
  Worker entry: src/worker.js — handles /api/guestbook, /api/visits, /api/admin
  DNS: managed in Cloudflare. www CNAME removed; www.weird.baby added as
       Worker custom domain directly. GoDaddy holds registrar only.
  Deploy: `npx wrangler deploy` (from project root, after vite build)
  Build: `npx vite build` — IMPORTANT: run `Remove-Item -Recurse -Force dist` first
         on Windows to avoid EPERM issues on the dist folder.
  Build time tracking: vite.config.js injects `__BUILD_TIME__` as ISO string at build time.
         Displayed on /admin header. Use this to verify deploy freshness.
  Favicon: public/favicon.ico (generated from W.B. logo)

ARCHITECTURE — Shared Exhibit Component (r27 refactor)
  All exhibit rendering logic lives in ONE place: src/routes/exhibit/Exhibit.jsx
  Each artist is a config object at src/data/artists/<id>.js with fields:
    id, name, spine, facts, defaultActiveIndex, splitKey, cfKey,
    visitPath, shopExitParam, exhibitFlow (optional)
  Route files (HrSpine.jsx, CbSpine.jsx) are 5-line thin wrappers:
    <Exhibit artist={config} />
  CSS uses neutral ex- prefixes (ex-root, ex-nav, ex-main, ex-left, ex-right, ex-snap).
  Adding a new artist =
    1. Create src/data/artists/<artist-id>.js with the config shape
    2. Create src/routes/<id>/<Id>Spine.jsx thin wrapper (5 lines)
    3. Add <Route> in App.jsx
    4. Add roster entry in src/data/wb_roster.js

ARCHITECTURE — Gift Shop (r28)
  One room, one URL, serves all exhibits. Never per-artist. Changes to the
  shop land in one place and reach everyone.
  Files:
    src/routes/shop/GiftShop.jsx    — the room
    src/routes/shop/GiftShop.css    — museum dark theme, single #b8974a accent
    src/data/wb_roster.js           — single source of truth for artist roster
    src/data/wb_merch.js            — W.B.'s own merch config (pipeline not built yet)
  Layout, top to bottom:
    1. GIFT SHOP signage (serif, gold-cream)
    2. FEATURED artist — photo or typography fallback, name, blurb, link out to store
    3. WEIRD.BABY merch — placeholder ("Museum merch coming soon")
    4. FRIENDS wall — all roster artists as cards linking to their stores
    5. LOBBY → exit (right-aligned, per VISION: always exit right)
  Featured artist selection:
    /shop?from=<id>  -> that artist (arrived via exhibit exit)
    /shop            -> random pick from roster (useMemo, stable per mount, reshuffles on refresh)
    /shop?from=junk  -> random fallback (unknown id is safe)
  Artist images: null for now. Typography fallback renders a gradient card with
    the artist's name in DM Serif Display. When real photos exist, set
    `image` field in wb_roster.js to the path and the photo will render.
  All external links open in new tabs (target=_blank, rel=noopener noreferrer).
  Walked-in bell audio: <audio> element points at /sounds/shop-bell.mp3 (file
    not yet present). Plays on mount, silently no-ops if missing.

PHASE 1 — COMPLETE
  Infrastructure, tools, databases, lyric intelligence, content archive,
  discography data, deployed scaffold. The backstage is built.

PHASE 2 — MUSEUM BUILD (current)
  Spine architecture LIVE
  Guest book LIVE — D1 backed, real persistence
  Admin LIVE — mmm key sequence, visits + guestbook data, build time display, jump buttons
  Exhibit Flow LIVE — unified P2/P3/P4 with sticky Journal (HR only)
  Gift Shop LIVE — museum-owned room with artist doors, exit-through pattern
  Exhibit component DEDUPLICATED — one <Exhibit /> component, per-artist configs
  *** NOW: Content curation, CB exhibit flow, Founding Visitor easter egg ***

KEY FILES
  src/routes/exhibit/Exhibit.jsx     — Shared exhibit component
  src/routes/exhibit/Exhibit.css     — All exhibit styling (ex- prefix)
  src/data/artists/hunter-root.js    — HR config + SPINE data lifted inline
  src/data/artists/carsie-blanton.js — CB config, imports SPINE from cb_discography
  src/routes/hr/HrSpine.jsx          — 5-line wrapper: <Exhibit artist={hunterRoot} />
  src/routes/cb/CbSpine.jsx          — 5-line wrapper: <Exhibit artist={carsieBlanton} />
  src/routes/hr/HrExhibitFlow.jsx    — Unified P2+P3+P4+Journal (HR only, CB has no equivalent)
  src/routes/hr/hr_facts.js          — HR contextual facts (NOTE: lives in routes/hr/, NOT src/data/)
  src/routes/cb/cb_discography.js    — CB spine data
  src/routes/cb/cb_facts.js          — CB facts
  src/routes/shop/GiftShop.jsx       — The gift shop room
  src/routes/shop/GiftShop.css       — Gift shop styling
  src/data/wb_roster.js              — Artist roster single source of truth
  src/data/wb_merch.js               — W.B. merch config (placeholder, pipeline not built)
  src/routes/WbHome.jsx              — Front page / lobby
  src/routes/WbAdmin.jsx             — Admin dashboard (build time, jump buttons, guestbook, visits)
  src/data/hr_archive.js             — Panel 2 data
  src/data/hr_artifacts.js           — Panel 3 data
  src/data/hr_exit_flow.js           — Panel 4 data
  src/data/hr_journal_prompts.js     — Journal prompts
  vite.config.js                     — Injects __BUILD_TIME__ for admin display
  public/WeirdBaby_PhotoID.png       — Front page + favicon source

DESIGN DECISIONS
  - Each exhibit gets a single room (page). No separate landing pages.
    /hr (HrSpine) IS the Hunter Root exhibit. HrHome route preserved, not built.
  - All exhibits are identical except for content. One component, one CSS,
    one color palette (#b8974a museum gold). Differentiation comes from
    content alone, not chrome.
  - Panels are auto-advancing card scrollers, not static prose.
  - Pills filter content types within each panel, always at least one selected.
  - Journal is curatorial, not social media. Weighted feed, not chronological.
  - "Every surface is satisfying in itself."
  - Exit through the gift shop: exhibits have no direct lobby link. Leaving
    an exhibit = going through the gift shop. Both top-corner buttons (logo
    top-left, "Gift Shop" top-right) route to /shop?from=<artist-id>.
  - Gift shop never takes a cut from artists. Artist stores are linked out,
    not embedded. Every external link opens in a new tab so the museum tab
    survives.

OPEN GAPS (known, not bugs)
  - CB exhibit has no exhibit flow below the main column. HR has
    HrExhibitFlow (P2/P3/P4/Journal); CB has nothing there. Future work:
    build cb_archive.js, cb_artifacts.js, cb_exit_flow.js, cb_journal_prompts.js
    and a cb-or-shared ExhibitFlow that CB's config can opt into.
  - Artist photos for the gift shop roster don't exist. Typography fallback
    renders in the meantime. Drop real JPGs at
    public/images/roster/hunter-root.jpg (etc.) and set `image` field in
    wb_roster.js to enable them.
  - Walked-in bell sound file /sounds/shop-bell.mp3 doesn't exist. The
    <audio> element is wired but silently no-ops on mount.
  - Featured blurbs in wb_roster.js are placeholder. Rewrite when ready.
  - Museum merch pipeline (Big Cartel + Printful) is not set up. The W.B.
    section of the gift shop shows "Museum merch coming soon" placeholder
    until wbMerch.live is flipped to true and featured items are populated.
  - /hr/merch route still exists as a redirect. Should be retired in a
    cleanup pass — gift shop architecture supersedes per-exhibit merch routes.
  - Orphaned files in routes/hr/: HrPanel2.jsx, HrPanel3.jsx, HrSpine.jsx.bak,
    HrSpine.jsx.r23.bak. Dead code preserved through refactor. Safe to
    delete in a cleanup commit.

BACKLOG
  - Founding Visitor easter egg (from VISION.md). Needs D1 schema change.
    Not urgent — 400+ visits so far are all Mike's own. Build this before
    any public mention of the museum, not before.
  - CB exhibit flow content + shared ExhibitFlow component (see Open Gaps)
  - Artist photos in gift shop roster
  - Walked-in bell audio file
  - Rewrite featured blurbs in wb_roster.js
  - Museum merch pipeline (Big Cartel + Printful)
  - Retire /hr/merch redirect
  - Delete orphaned files: HrPanel2/3.jsx, HrSpine.jsx.bak, HrSpine.jsx.r23.bak
  - Center 'HUNTER ROOT' in nav bar
  - Journal alignment fine-tuning (closer on P2, slightly off on P3)
  - Active album on coverflow should be larger
  - GoDaddy site builder still published at weirdbaby.godaddysites.com
  - Domain transfer: GoDaddy -> Cloudflare (EPP code needed)

EXHIBIT REFACTOR (r27) — April 13 2026
  Deduplicated HrSpine.jsx (~1075 lines) and CbSpine.jsx (~925 lines) into a
  single shared <Exhibit /> component driven by per-artist config objects.
  Net -822 lines. Artist #3 now takes minutes, not hours.
  Commit: 70377b8

GIFT SHOP + POLISH (r28) — April 13/14 2026 late-night session
  Session landmarks (chronological):
    1. Researched Carsie Blanton's storefront pattern (Shopify subdomain, artist-owned)
    2. Decided on exit-through-the-gift-shop architecture
    3. Built /shop with GiftShop.jsx, GiftShop.css, wb_roster.js, wb_merch.js
    4. Wired exhibit exits to /shop?from=<id>
    5. Discovered HrExhibitFlow was commented out; re-enabled
    6. Discovered STATE.md was way out of date on file locations
    7. Committed everything to git (first real safety net: abf628a)
    8. Ran Exhibit refactor via Cowork (landed as 70377b8)
    9. Added build time display to /admin
    10. Fixed Hunter and Carsie store URLs in wb_roster
    11. Added /hr /cb /shop jump buttons to /admin
    12. Rewrote GiftShop.css for museum dark theme
    13. Added typography fallback for missing artist photos
    14. Moved LOBBY exit to right-align (VISION: always exit right)
    15. Nulled image paths in wb_roster (stop trying to load files that don't exist)
  Seven user-reported issues addressed:
    ✓ HrExhibitFlow missing below tracklist
    ✓ Hunter URL correction (→ www.hunterroot.com/)
    ✓ Carsie URL correction (→ store.carsieblanton.com/collections/featured-merch)
    ✓ Gift shop too bright (dark theme now)
    ✓ Gift shop images broken (typography fallback)
    ✓ Exit always to the right (LOBBY → right-aligned)
    ✓ mmm page links to HR/CB/shop

OPERATIONAL NOTES
  - BUILD_LOCK protocol: C:\AI\BUILD_LOCK.txt must say UNLOCKED before file edits.
    Take the lock before a session, release after. Check with:
      Get-Content "C:\AI\BUILD_LOCK.txt"
  - Windows CRLF warnings on git add are cosmetic, ignore.
  - `npx wrangler deploy` must run from C:\AI\Projects\weird-baby-update\ — if
    you run it from elsewhere, npx will try to install the latest wrangler
    globally. Always `cd` first.
  - Fingerprint hashes in the build output (e.g. `index-BbjneHrM.js`) change
    whenever the bundle content changes. If a deploy uploads 0 new assets,
    nothing changed. If it uploads assets with different hashes, new code shipped.
  - Deploy freshness verification: after deploy, type `mmm` and check the
    build time on the /admin header against the timestamp of your last `npx
    vite build` run. If they match, you're looking at the latest.

GIT SAFETY POINTS
  abf628a — r26, museum live with HR + CB + gift shop slice, before Exhibit refactor
  70377b8 — r27, post-refactor + build time on admin
  (latest) — r28, gift shop complete (dark theme, fallbacks, exit-right, URL fixes)
  To roll back: `git reset --hard <hash>` then `git push -f origin main` (careful)

RESEARCH CORPUS
  C:\AI\Projects\Hunter Root\yt_research\
    channel_videos.json   — 125 official channel videos (with view counts)
    fan_yt.json           — 175 third-party YT videos (unverified, awaiting triage)
