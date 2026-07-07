<!-- ============================================================= -->
<!-- LIVE LEDGER — source of truth. Read this block first.          -->
<!-- Last updated: 2026-07-06. Below this block: durable reference. -->
<!-- ============================================================= -->

# Weird.Baby Museum — LIVE LEDGER

## Ops Rule 0 — THE GROUND CHECK (read before acting)

Before ANY state-changing action — writing a build brief, editing a file, declaring something "done", or any tool call that does more than read — STATE THIS:

> "Ground check: what fact am I acting on, and did I verify it THIS session?"

If the answer is "I remember" / "the log says" / "Cowork reported" / "the doc says" — **STOP. That is the off-ramp forming.** Verify against the live tree first.

Either party may say **"Follow the process"** at any time. It means: halt, verify against the live tree (live tree > git > docs > chat), THEN proceed.

Paid for by the 2026-06-17 derived-era incident: charging into the problem in front of us — building before verifying, trusting a build log over the live disk — produced a corrupted client build and a near-miss. This class of error has cost full weeks before. The trip-wire exists so the stop is an EVENT, not a hope.

Ops work takes top priority, based on the Ops need in the moment.

## LIVE (deployed, verified)

- Site: https://weird.baby — LIVE and CURRENT. Last deploy version `ffcf7fbd` (wrangler 4.81.1), 2026-07-07 ~02:00Z (verified via deploy output + Mike's incognito walk).
- Status: SOFT-LAUNCHED — visible but not advertised / not yet in search engines.
- Repo HEAD at deploy: `a7b8d62` + final migration docs commit follows same session.

## SHIPPED 2026-07-07 — FACT KIND + PUV PILOT (FACT_KIND_PUV_PILOT-20260707; DB-only, NO deploy)

Executed per `docs/FACT_KIND_PUV_PILOT_BRIEF-20260707.md`, every stage gated + committed (run log: `docs/FACT_KIND_PUV_PILOT_LOG-20260707.md` — paste-backs, hashes, gate verdicts, delegation arrangement on the record). Backup: `MediaVault/core/backups/mediavault_pre-fact-kind-20260707T020813Z.sqlite` (verified; gitignored, OneDrive mirror is the durable home). Site UNCHANGED — still `ffcf7fbd`; export proven content-idempotent, deploy no-op by design.

- DB: artifacts table REBUILT — kind CHECK now 8 values (+`fact`, F10 closed); 293→297 artifacts: **4 pilot facts** `MV-HR-20260707-001..004` (kind=fact, media_type=text, **status=vault** — Mike's Flag-B call: no export, no wall tiles until display UI exists). Registry synced (211 slugs, 0-0-0); source tag==column 297/297.
- Facts carry Mike's wording verbatim + real in-vault breadcrumbs (Americana Highways / ReverbNation / Blue Harvest 2014). Two brief premises corrected at the wording gate: Nick Root death-year UNVERIFIED → omitted entirely; RWTH = Hunter's FIRST SOLO RECORD, not a band.
- Registry: `fact` registered in `tag_vocabulary.json` kind_column (MV `903d52d`); DB vocabulary/tags tables deliberately untouched (kind is a column, not a tag — no kind:* slugs exist for ANY kind value).
- Deferred to the FactScroller re-wire workstream (spec §Execution 4–5): weight signal (no schema home), sourceless-marker closed set, tag-based PUV matching, fact display UI (Mike-led). Harmonica rider: stays HELD (operator-list required; nothing registers at zero usage).

## SHIPPED 2026-07-07 — MV VOCABULARY MIGRATION (Stages 0-4, 6, 8; deploy ffcf7fbd)

Executed per `docs/MV_VOCAB_MIGRATION_BRIEF-20260624.md`, all 10 forks LOCKED per reconcile plan Part E, every stage gated + committed (run log: `docs/MV_VOCAB_MIGRATION_LOG-20260624.md` — full paste-backs, hashes, verdicts). Head = live MV DB. Backup: `MediaVault/core/backups/mediavault_pre-vocab-reconcile-v2-20260707T010514Z.sqlite` (integrity ok, gitignored; OneDrive mirror is the durable home).

- DB: exhibit un-retired; event/lineup/attributes registered (tier 3); presentation folded to attributes:link; tags registry rebuilt (210 slugs, 0 mismatch/0 unregistered/0 zero-usage); source collapsed (fresh disagreement=14; tag==column 293/293; 19 NULLs→local; youtube 105 unchanged); **bands→band renamed (288 payloads)** — lineup:band untouched.
- Client: `BOARD_TOTAL_KEYS` bands→band (HrExhibitFlow.jsx); exports regenerated (hunter_root.json, vocabulary.json 22 rows). Filter board renders Band; Medusa's Disco absent BY DATA (its 4 artifacts unreleased — appears on release, no code needed).
- Docs: `MediaVault/core/tag_vocabulary.json` regenerated v2.0 (demoted, non-authoritative per F3); `TAXONOMY_v1.md` rewritten as-built (MV repo `15e5bda`).
- Deferred (locked): content_kind/card_kind kept (F4/F5); artifact_kind/format routing = backlog; `fact` Kind + the one table rebuild = separate later workstream (F10/Stage 7).

## SHIPPED 2026-07-06 — WB_ARTIST_LOBBY_BOOTH-20260706 (deploy 676d20a9)

Brief executed via Cowork, stages 1–5, Mike gating each stage live. Now on weird.baby:

- **/wb — Weird.Baby house exhibit.** Hand-authored spine in `src/data/artists/weird-baby.js` (no MV; six Vol 1 recordings as repo assets `public/audio/wb/`, registration slot numbers in filenames). Display order Coconuts → E.D. Yahdah → registration order (Mike). Album display title "The Making of BoWB V1". Composed cover `public/images/wb/vol1_cover_v1.png` (gray field, red "the making of", white "The Best of"/"Vol. 1", Fredoka, logo centerpiece; generated via PIL, spec by Mike). `exhibitFlow` omitted — Exhibit.jsx:1065 guard renders player-only; `facts: []` safe. Holes by design.
- **Lobby directory** (WbHome.jsx): four rows — HUNTER ROOT / WEIRD.BABY / INFORMATION BOOTH / GIFT SHOP — replace the single explore button. Guestbook untouched.
- **/booth — Information Booth.** Placard in Lobby paper chrome, all-Fredoka, Mike's words v4 (short credo, thank-you + papa@weird.baby). FAQ button expands the card IN PLACE (native `<details>` accordion, collapsed; 2 Q&As from Mike's words). Subdued FAQ/Lobby buttons. NOTE: papa@weird.baby not yet set up — mail bounces until the Cloudflare email task (Deferred) lands.
- **Shop rework** (Mike's calls at preview): museum-standard title bar (brand / GIFT SHOP / Lobby — same format as exhibit nav, now the room convention), top billing only (no tail repeat), FEATURED/FRIENDS labels gone, standalone WB banner removed — WB rides the roster (sticker head image, blurb "Six little blues from Papa."). Big signage + corner exits absorbed into the bar.
- **Tracklist interaction (museum-wide, /hr too):** number/title click PLAYS; variant dropdown is a visible type-anchored select that always drops (even one option); hit target padded 9px vertically.
- Deferred (recorded in the brief + BACKLOG intake 2026-07-06): real Vol 1 cover art, MV ingestion of Vol 1, wb_merch live-flip, booth email, charter doc, FAQ-surface governance items, org-level credo.

## FULL-LAUNCH GATES (soft-launch -> advertised launch) — INCOMPLETE BY DESIGN

These must be true before driving traffic (Google search, advertising). This list is deliberately incomplete — ADD to it as gaps surface; do not treat as closed.

- [ ] Gift Shops hooked up (artist shops wired/functional, not just routes existing).
- [ ] Mike's gift shop built (Mike has source work to bring when scoped).
- [ ] Substantially more content (museum needs many more artifacts before traffic is worth driving).
- [ ] (more expected — capture as found)

## NEXT (ordered queue — pull from here)

1. [DONE 2026-06-17] Off-GitHub backup — OneDrive mirror `753b17e`.
2. [DONE 2026-06-17] STATE.md rebuilt as live ledger (this block).
3. Content expansion toward full-launch gate (largest lever for launch).
4. Gift shop wiring + Mike's gift shop build (gated on Mike bringing source).
5. Derived-era client re-wire — HOST-SIDE ONLY, fixed depth, no slider. Parked in docs/derived-era-WIP/. NOT a launch gate.
6. Press batch (16 URLs) — gated behind derived-era re-wire.

## KNOWN ISSUES (accepted, not yet fixed)

- DECK-SCROLL-OCCLUSION — player bar hides deck bottom. Confirmed reproducing 2026-06-17. Category: minor / infrequent / consistent annoyance. PIGGYBACK when deck-area work opens the file; not pulled standalone.
- DECKBUG-FBBLOCKS — FB embed renders as black/white block. Reproduction unconfirmed.
- Inbox photo MV-HR-20260405-036 — 1 of 6 unreleased (5 released).
- Video-panel YT-thumb fallback — unclassed full-bleed img; mostly moot since albums carry art.

## GIFT SHOP — MERCH PIPELINE (added 2026-06-23, verified this session)

Reality the ledger previously missed. Code (`src/data/wb_merch.js`) is correct as-is — `live:false`, "coming soon" is the accurate visitor state. This records the OPERATOR-side state behind it.

- **Printful account: LIVE.** Logged in as Mike. One store exists: "Weird.Baby", tagged **Live + QuickStore** (Printful's native storefront, US-only, $0/mo). NOT Big Cartel.
- **Stickers BUILT + SOLD.** Product "Weird.Baby Sticker", published, 3 kiss-cut white variants: 3"x3" (#15583638, $4.50), 4"x4" (#15583639, $4.50), 5.5"x5.5" (#15583640, $5.00). Mike test-bought 10 — print quality good, thin white border as expected.
- **Sticker size ceiling = 5.5" square.** Catalog kiss-cut sizes: 3"/4"/5.5"/15"x3.75". The 15" is a bumper strip — REJECTED by Mike (square only). No larger square exists. Sticker line is COMPLETE.
- **PARKED quality item:** the 3 sticker variants carry an OLD low-res file. Mike has a better 2400px master. Refresh = swap master into each variant's design, confirm no res warning. Deferrable; blocks nothing.

## GIFT SHOP — SHIPPED LIVE (2026-06-23, deploy c12cffe5)

The gift shop is LIVE on weird.baby/shop (verified incognito). Supersedes the "decision/parked" notes below for shop-render status.

- **WB sticker is for sale in-shop.** wb_merch.js: live:true, links to https://weird-baby.printful.me. Sticker image cropped tight (was whitespace-heavy), at public/images/wb-merch/sticker.png.
- **Layout: all sections are unified horizontal BANNERS** (Featured + Friends share the .featured-artist structure via a shared <Banner> component in GiftShop.jsx). No more square grids.
- **Page order:** one FEATURED section (top, enlarged label) -> FRIENDS (Weird.Baby banner first, then non-featured roster, then the FEATURED artist repeated last). Everyone appears once in Friends; featured artist shows top + tail. Logic: others/featuredInRoster split in GiftShop.jsx.
- **Removed:** all CTA buttons, the price line, and the no-cut blurb (Mike: kill all extra text/buttons).
- **Hunter Root:** image filled (Crooked Home art, public/images/wb-merch/hunter-root.png), blurb = "Records, prints, and road-worn merch from a songwriter worth following home." (timeless, no album count). Store link unchanged (hunterroot.com, correct).
- **WB Friends-banner bio:** "Stickers, shirts, and hats from the museum itself. Buy a little weirdness — and help us keep the lights on for the artists we love."
- Commit 16c76d4, deploy c12cffe5, wrangler 4.81.1.

### Still open (not done this session)
- Shirts + hats: not built. Next durable merch product work, storefront-agnostic.
- Sticker low-res refresh: the 3 Printful sticker VARIANTS still carry the old low-res master (the in-shop image is fine; this is the product print file on Printful's side). Deferrable.
- shop.weird.baby custom domain: deferred to launch (Big Cartel Platinum), per storefront decision above.
## STOREFRONT DECISION (settled 2026-06-23)

- **Long-term: custom domain `shop.weird.baby` wanted.** Today: URL not a factor.
- **Path:** use the existing free Quick Store now (pre-launch, near-zero traffic — no fee justified yet). Stand up **Big Cartel Platinum + attach `shop.weird.baby` at launch**, when traffic justifies the $15/mo.
- **Key fact:** Quick Store CANNOT take a custom domain ever (Printful confirmed). Big Cartel free also can't — needs Platinum ($15/mo). So custom URL = Big Cartel Platinum, full stop.
- **Durable asset insight:** the reusable work is the Printful PRODUCTS (designs/print files), portable to any storefront. The storefront is a thin wrapper, cheaply rebuilt. Quick-Store-now wastes nothing but a 10-min wrapper.
- **NEXT merch products (durable work, storefront-agnostic):** shirts, hats. Not yet built.

## BACKUP STATUS

- Off-GitHub: OneDrive mirror at `~\OneDrive\_backups\weird-baby-museum\`, `753b17e`, 2026-06-17. POINT-IN-TIME (does not auto-update).
- STANDING OPS ITEMS (not yet automated): (a) periodic re-mirror so backup stays current; (b) quarterly restore-drill per charter 3.4 — a backup nobody restored is a rumor.

## CANNOT-VERIFY-FROM-MUSEUM-SESSION (flag, separate pass)

- All MediaVault-repo items (C:\AI\Platform\MediaVault) — not reachable in a Museum session. Needs MV-side pass.
- Mobile UX, banner-match-nav, cover-pill render — need live narrow-width inspection.

<!-- ============================================================= -->
<!-- END LIVE LEDGER. Durable reference (pre-2026-06-17) follows.   -->
<!-- ============================================================= -->

## Decisions / closed

- COL3 FB post clip: CLOSED — ACCEPTED (2026-06-02). Logged-out-only cosmetic clip of the longest post's like/comment/share row. NOT a column bug (column is random per load); NOT an open defect. Cause = fixed-height box that never self-sizes because raw post.php sends no height. Dead-end theories + fix options recorded in docs/FINDING-fb-post-clip.md. Do NOT re-investigate as a mystery — read that doc first.

# Weird.Baby Museum — STATE

The durable reference for the Museum: stack, routes, mothballed-for-v1
decisions, and pointers to canonical specs. **Does NOT cover current
progress, deploy status, or what's next** — see `NAVIGATION.md` and
`git log` for that.

**Last refreshed:** 2026-06-07

## Working Doctrine (for any agent/session)

Canonical process manual: docs/canonical/OPERATIONS.md (read first; this section is mirrored there).

Standing Ops rules. Each one was paid for by a real failure; read before
any repo work, any session, any agent.

1. **Verify before scoping.** Read the actual file in the live
   `weird-baby-museum` working tree before reasoning about it. Never
   scope against memory, against Drive copies (Drive has served
   stale/retired trees), or against assumption. Past errors traced
   directly to this: scoping against the album-registry file instead of
   the foundation export; reading a retired repo from Drive.
2. **Don't guess — look it up.** Use pwsh (read-only) or Cowork to read
   real code/data. If a claim about the codebase isn't backed by a file
   just read, it is a guess and must not be acted on.
3. **Default to Cowork for repo work.** For repo reads, big-file edits
   (`HrExhibitFlow.jsx` ~152KB, `Exhibit.jsx` ~37KB), and multi-file
   scoping, prefer a Cowork task over chat-driven pwsh paste-back:
   Cowork has full repo reach, is faster, and avoids the human relay's
   buffer limits and paste errors.
4. **Drive the live UI by accessibility ref, not pixel coordinates.**
   The dock has tiny targets and a peek-to-open animation; pixel clicks
   miss silently. Use `find`/`read_page` refs. (A live verification
   session lost time to missed pixel-clicks that ref-based clicks fixed
   immediately.)
5. **Never put load-bearing work inside if/else in scripts that get
   pasted line-by-line** — the `else` orphans in the console and
   silently skips the body. Use flat statements with explicit
   verify-or-abort. (This silently skipped a real edit once; a commit
   message overclaimed as a result.)
6. **Durability.** Work isn't done until committed AND pushed AND (for
   UI changes) deployed: `npm run build && npx wrangler deploy` — there
   is no CI; deploy is manual. Scratch files and local commits are not
   durable.

## What this is

Weird.Baby Museum. A curatorial platform. Currently exhibiting Hunter Root.

## Live routes

- `/` — front door (lobby + guestbook)
- `/admin` — operator dashboard (`mmm` key sequence)
- `/hr` — Hunter Root exhibit
- `/hr/home`, `/hr/media`, `/hr/archive`, `/hr/fan-wall` — HR sub-routes
- `/wb` — Weird.Baby house exhibit (added 2026-07-06)
- `/booth` — Information Booth (added 2026-07-06)
- `/shop` — gift shop
- `/p/:id` — preset-share landing (resolves a shared preset, parks the snapshot, lands the visitor at the front door; unknown/broken ids degrade to a plain Lobby visit)

Planned routes when this table is next touched: `/drawing`, and the Stacks filter surface.

## Stack

React 19, Vite 8, Cloudflare Workers, D1 (`weird-baby-db`).
Build: `npx vite build`. Deploy: `npx wrangler deploy`.

## Mothballed for v1

The following code paths exist in source but are deliberately not
rendered in the v1 launch. They revive post-launch. Source comments
saying "MOTHBALLED for v1 per STATE.md" point at this section.

- **Kaleidoscope** — the audio-meter control surface (knobs, switches,
  VU meters). Code preserved in `src/routes/hr/HrExhibitFlow.jsx`
  (lines 84, 167–214, 617–754, 1474) and `HrExhibitFlow.css:853`
  (the `.hr-kal-*`, `.knob-wrap`, `.hr-vu-*` rules) but never mounted.
  Decision dates to the v28 controls-dock simplification pass; revives
  when the operator chooses to re-expose audio meters post-launch.

## Presets — capture/restore wiring (LANDED 2026-06-06)

The 2026-06-05 blockers cleared and the §8.2/§9 build landed. Spec:
`docs/UX_PRESETS_SPEC.md` (v0.4).

- **Stable ids** — the adapter surfaces stable ids onto the spine
  (49cd044): every track carries `id` (foundation id), every rendition
  carries `id = ytId ?? slug(audioUrl)`; `song` backfill in 9bbeb91.
- **Capture** — live player identity crosses the `<ExhibitFlow>` seam
  as props (`activeAlbumId` + `playingTrack` as `{ albumId, trackId,
  variantId }` stable ids). Snapshots record real state; the
  `useState(null)` stubs are gone.
- **Restore** — `onRestorePlayer` callback on the same seam;
  `Exhibit.jsx` resolves ids → current spine indices at apply-time and
  drives the player. Verbs per spec §3: Play / Show / Now Playing /
  Reset / Save, honoring controls §8.4 (only Play interrupts playback;
  Show is deck-only; Now Playing returns to the Active View).
- **State-crossing mechanism:** prop-widening at the existing seam —
  no context, no lifted state. Ref: `docs/UX_PRESETS_SPEC.md §9`.

Remaining (not blockers): §8.1 mobile presets phase 2 — factory Show +
mobile peek-return chip (phase 1 apply-only pills built + deployed
2026-06-07, 298b08f; factory presets stay deck-only, player fields
normalized explicitly neutral at apply — see spec §8.1.1) and the
preset-as-artifact model (operator tagging/featuring, entry-state-
as-preset; §0, UX_LIFECYCLE_SPEC §4.5/§4.2). Naming UI BUILT
2026-06-07 (Mike: inline, autopopulated — spec §5 #4). Sharing BUILT
2026-06-07 (Mike: Lobby-first — `/p/<shortid>` + Share verb + D1
`presets` table; spec §5 #5).
Idle auto-return BUILT 2026-06-07 (Mike: Option A — song change +
idle ≥ 8s clears a Show peek; spec §3/§5 #3; timing open to feel).

O9 shuffle/loop WIRED (2026-06-07, 524bf41, deployed + verified live):
shuffle randomizes the next-up queue (build time + live toggle-on,
Fisher–Yates); loop replays the current selection on end (controls
§9.2). State owned by the player in Exhibit.jsx, crossed to the deck
as props at the `<ExhibitFlow>` seam. Verified on weird.baby/hr: loop
wraps the album without stopping, loop-off exhausts and stops, shuffle
produces non-sequential order; snapshot capture unchanged.

## Backlog (durable design direction)

Standing items not yet started. Day-to-day sequencing lives in
`NAVIGATION.md` / `BACKLOG.md`; these are recorded here because they are
durable direction, not session-scoped tasks.

- **Brand-aligned museum aesthetic.** All Weird.Baby infrastructure (the
  museum shell: chrome, dock, controls, frames) should mirror the W.B
  logo — 1960s black-and-white-photo appeal, typeface akin to the
  logo's font. Content shown inside (album art, video, imagery) retains
  full vibrancy and palette. Principle: **brand frames the vessel;
  content stays vivid.** (Owner: Mike, UX. Status: PASS 2 BUILT
  2026-06-07. Pass 1 [dark silver] read flat — Mike: "try light, think
  outside the box." Pass 2 concept: THE PHOTO ALBUM PAGE — shell goes
  1960s photo-paper (mat-board ground, print-stock surfaces, photo-black
  accent ramp in museum-tokens + JS mirrors), cards read as prints with
  real shadows, card meta goes typewriter, film grain washes the room
  (Exhibit.css ::after, under the lightboxes), lightboxes stay a dark
  projection booth (scoped token re-pin), video placeholders stay dark
  screens ("photos are paper; video is television"), badges pinned light
  over imagery. Fredoka wordmark trial carries over. Pass 2 accepted by
  Mike ("close enough for this pass"); PASS 2b extends the album page to
  the LOBBY (WbHome inline styles — the B&W logo now sits on its native
  paper; grain wash added) and the GIFT SHOP (GiftShop.css remap + grain)
  so the whole building reads as one stock. Deliberately untouched,
  awaiting Mike's read: variant-pill type colors, journal semantic
  green/red, per-album accents, mothballed palettes.)

## Canonical docs

See `docs/canonical/` — VISION, VISION_LOCK_v0.3, UX_SPEC_v0.3,
UX_CONTROLS_SPEC_v0.4. These describe the design north-star and are
authoritative over any narrative in this file.

Child spec (draft, not yet locked): `docs/UX_PRESETS_SPEC.md` — the
presets spec that `UX_SPEC_v0.3 §C.5.0` named as forthcoming; child of
`UX_CONTROLS_SPEC_v0.4 §9` and `UX_LIFECYCLE_SPEC_v0.5 §4.5`.

