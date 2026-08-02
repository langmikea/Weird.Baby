# WAL SPOTLIGHT ROUND — RUN LOG (2026-08-02, v32)

Autonomous single-agent Code-lane round on the finished WAL wing, per Mike's
W1–W10 order. Drafting lane held (no git until seal); sealed per OPERATIONS
§8 with explicit paths, push, and origin-verify. Deploy/mirror are MIKE'S and
were NOT run.

## The doctrine (W6, recorded in STATE.md)

The museum is THE FRAME — it neither detracts nor distracts; done right it
enables the art to reach full potential. THE ARTISTS BRING THE COLOR — their
photos/videos/thumbnails ARE the color. WAL is not held to the robots
technical voice; it is a colorful celebration. Set the stage, drop the house
lights, cue the music, spotlight — the only place to look. Cecil B. energy.

## What changed, by order item

| W | Ruling | What was built |
|---|---|---|
| W1 | Videos play until stopped or ended | `handleTrackSelect`'s face branch no longer calls `stopPlayback()` (supersedes v30 M-b — supersession commented at the site). A shown face lays OVER the stowed 16:9 frame; the iframe stays mounted and audible. Stop verbs: banner STOP, Escape, queue end. |
| W2 | Lately keeps its job, visual goes poster/collage | `face.collage` renderer: glued-up tilted paper tiles of the artist's OWN video thumbnails, each tile a door to its video. Lives on "What they are up to". |
| W3 | Embeds show their thumbnails | `thumbFromVideo` config: the cued song's poster is the video's own maxresdefault (hq fallback), full-bleed. Collage tiles are hqdefault. Both are the player's own poster surface, hotlinked, per Mike's ruling. |
| W4a | Buttons don't work | ROOT CAUSE: face `action` dispatches carried `{album}` and no `href`; WalExhibitFlow opens `detail.href` — every action door was dead. The href now rides the detail. Proven in the lap: trail click → `window.open("https://www.carsieblanton.com","_blank","noopener,noreferrer")`. |
| W4b | Button styling unbefitting | Trail rows restyled to marquee doors (Syne display face, lit gold left rule, raised hover, ↗). Scoped `[data-exhibit="wal"]`. |
| W5 | Kill money text on artists' stages | The three money Q&As gone from every artist card; "Where the money goes" sidebox retitled "In his own store"; money-flavored scents rewritten. The money answer lives in W.B's own FAQ (/booth). |
| W6 | The doctrine | Recorded in STATE.md; stage darkened via scoped token re-pin on `.ex-right` (the `.pb` projection-booth mechanism — album-page palette maps `--wb-ink` to paper, so the stage re-pins the ramp). Frame quiet; imagery lit; B&W filters off for WAL. |
| W7 | Cards flat, full length, no internal scrolling | `faceFlow:"flat"` config: WAL retires the staged pager and the fixed `bodyKey` height. Faces render in one full-length column in the page's own flow. Composition chosen (stated honestly): **the no-scroll law survives as "no inner scroll traps" — the DOCUMENT is the one thing that scrolls, which is ordinary reading**. Measured: 0 hidden px in every column on every face, phone + desktop. /robots keeps its stage untouched. |
| W8 | Artist photos — just do it | 4 covers + 2 plates vaulted at `public/images/wal/`, from the artists' own og:image/channel-art surfaces. Provenance per image: `docs/WAL_PHOTO_PROVENANCE-20260802.md` (source page, direct URL, size, use). ALL PENDING permit-or-deny emails before go-live. Gift-shop WAL banners ride the same art. findmikeymike.com (compromised) untouched; hunterroot.com og:image fetched, inspected, rejected (blank white-on-alpha logo). |
| W9 | No HRRW | "Go to The Hunter Root reference wing" button and every /hr pointer removed from WAL data. HR remains a WAL artist served from our vault; his door out is hunterroot.com (one row — his store lives at the same address). Verified on the rendered card: no "/hr", no "reference wing" anywhere. |
| W10 | The new category set | Tracklist per Mike verbatim: **Coconuts** (section header over the numbered songs) → songs → **E. D. Yadah** → **About the Songs** → **About the Artist** → **What they are up to**. Gift-shop row REMOVED (nav keeps the shop one press away). Sub-rows dead. Category rows are unnumbered (numbers mean "song" again). `kind` chips retired — the names are honest nouns now. |

## INTERPRETATION FLAGS — for Mike's confirmation (each is a one-string fix)

1. **Coconuts = the songs.** Read from the order's own hint ("songs presumably
   = Coconuts?"). Rendered as a section header above the numbered rows.
2. **E. D. Yadah = the yadda-yadah — the chatter row / doors out.** Their
   place, shows, the better listen, their store, their channel; each only
   where it exists. This absorbed the old Their Place / Shows / Listen rows.
3. **What they are up to = the upload feed + the tour door.** What they
   posted and where they are playing are both "up to". Absorbed old Lately
   and (for Welles) the tour link.

Flags also ride the live faces' [PAPA] slots, so they are visible on the
glass, not only in this log.

## Engine changes (all opt-in by config; /hr, /wb, /robots byte-identical paths)

- `Exhibit.jsx`: `track.header` + `track.unnumbered` rows; `selFace` /
  `fallbackFace` split with `faceFlow:"flat"` mode (FaceFlow wrapper beside
  StageChildren); `vp-area-flat` / `vp-area-stowed` states; W4a href on action
  dispatch; `thumbFromVideo` poster preference; `face.collage` renderer; W1
  supersession of M-b.
- `Exhibit.css`: `[data-flat="1"]` structural block (incl. neutralizing
  `container-type:size` which collapses static flow); `[data-exhibit="wal"]`
  spotlight register (dark-stage token re-pin, marquee trail doors, color
  plates); `.vp-collage`; `.tl-header`. Appended as one scoped section.
- `WalExhibitFlow.jsx`: dead `wb-wal-shop` listener retired with the Shop row.
- `GiftShop.jsx`: WAL banner `image` wired to the W8 art (FLAGGED-FOR-ART
  closed).
- `worth-a-listen.js`: full W10 rebuild; all verification ledgers (oEmbed,
  transposition, named trap domains, compromised-domain note) preserved.

## Gates

- Lint: 11 errors / 10 warnings — IDENTICAL to HEAD baseline (verified by
  linting `git show HEAD:` copies via stdin; Exhibit.jsx 7/7 before and
  after). The documented 4/6 baseline in CLAUDE.md is stale (predates the
  robots-wing rounds).
- Build: `vite build` green (419ms; chunk-size warning pre-existing).
- Browser lap (dev server, desktop + 375px phone): W1 sequence proven
  (transport survives the overlay, same iframe element, Escape stops); W4
  proven (window.open intercepted with the right URL + rel); all four covers
  + shop banners load; every face 0 hidden px; no horizontal overflow at
  375px; ZERO console errors on /wal, /robots, /hr, /shop.
- Unregressed: /robots still staged (`data-stage="1"`, pager present),
  /hr player bar + deck + numbering intact.

## Notes for the next session

- A stale vite dev server (PID 16528, this repo) was already holding :5173;
  this session attached to it rather than killing Mike's process.
- `.claude/launch.json` added (museum-dev config) for future preview laps.
- Collage tiles are eager-loaded on purpose (a wall that fills in as you
  watch reads as broken; a dozen poster frames are cheap).
- W8 permission-email checklist lives at the foot of the provenance doc.
