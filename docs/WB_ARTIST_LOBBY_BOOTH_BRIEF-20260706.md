# BUILD BRIEF — WB Artist Exhibit + Lobby Rework + Info Booth
**ID:** WB_ARTIST_LOBBY_BOOTH-20260706 · **Status:** READY · **Gates:** Mike previews each stage before the next. Commit after every verified stage.

## Ground facts (verified 2026-07-06 against live tree)
- Exhibit.jsx refactor intact: `/hr` = 6-line wrapper + `hunter-root.js` config.
- Exhibit contract: `album={id,title,year,art,accent,tracks}`, `track={id,title,videos:[...]}`, `video={id,ytId,audioUrl,label,type}` — `audioUrl` path exists (RWTH pattern).
- Vol 1 source: `C:\AI\Projects\weird_baby_vol1\recordings\` (6 mp3s, slot-numbered) + logo `artwork\source\source_01_weirdbaby_photoid_logo.png`. Tracklist per vol1 README 2026-06-18 slot order.
- Lobby (`WbHome.jsx`): two-panel B&W guestbook page; left = logo + one explore button.
- Roster: append-only per its own header.

## Stage 1 — Assets
Copy 6 mp3s → `public/audio/wb/` (keep slot-numbered names). Copy logo → `public/images/wb/vol1_cover_v0.png` (serves as Vol 1 art, per Mike 2026-07-06). Verify sizes; commit.

## Stage 2 — Artist config + route (no visual change yet)
- `src/data/artists/weird-baby.js`: hand-authored spine, ONE album
  `{ id:"vol1", title:"Best of Weird.Baby — Vol 1", year:2026, art:"/images/wb/vol1_cover_v0.png", accent:null, tracks: 6 slots in README order, each one video rendition {audioUrl:"/audio/wb/<file>", label:"Recording — 2026-06", type:"audio"} }`
  Config mirrors hunterRoot minus MV: `facts: []`, `id:"wb"`, `visitPath:"/wb"`, `shopExitParam:"wb"`, distinct `splitKey`/`cfKey`.
  **exhibitFlow: OMIT — VERIFY Exhibit.jsx tolerates undefined exhibitFlow; if not, add null-guard (smallest possible edit).**
- `src/routes/wb/WbSpine.jsx`: 6-line wrapper (HrSpine pattern).
- App.jsx: `<Route path="/wb" ...>`.
- Roster entry: `{ id:"wb", name:"Weird.Baby", exhibitRoute:"/wb", storeUrl:"https://weird-baby.printful.me", storePlatform:"Printful", image:null, blurb: PAPA-VOICE ONE-LINER — Mike approves }`.
- GATE: Mike previews /wb locally. Holes/sparseness are BY DESIGN.

## Stage 3 — Lobby directory
Left panel, under the explore button: replace single button with a small directory — four entries, museum-typography, no images:
  HUNTER ROOT → /hr · WEIRD.BABY → /wb · INFORMATION BOOTH → /booth · GIFT SHOP → /shop
Keep guestbook panel untouched. Movie-theater booth-behind-glass = inspiration only, NOT literal design.
GATE: Mike previews. Layout is his call; iterate here, cheaply.

## Stage 4 — Information Booth (/booth)
New quiet room, Lobby chrome (B&W paper shell). Content = who-we-are words, Papa's voice. DRAFT v0 for Mike's ruling (edit freely):

> The Weird.Baby Museum is free. Equally free. Always.
> No tickets, no tiers, no ads. Every visitor is royalty.
> The museum owns nothing and takes nothing. Money that
> passes through here goes to making the world better — all
> of it, always. One person keeps this place, and keeping it
> pays nothing. That's the deal, and it never changes.
> Questions? papa@weird.baby *(pending email setup)*
> The gift shop is to your right.

Exits: LOBBY (right, per convention). GATE: Mike approves words + room.

## Stage 5 — Deploy
`Remove-Item -Recurse -Force dist`; build; preview; deploy; verify live; update STATE.md (LIVE + this brief's ID); session-close check (`git status --short` clean).

## Deferred (recorded, not built)
- Real Vol 1 cover art (logo is v0) · MV ingestion of Vol 1 (post-vocab-migration) · wb_merch live-flip + Vol 1 merch collection · booth email address (Reminders has Cloudflare steps) · full charter document (separate workstream; booth words are the visitor-facing tip only).
