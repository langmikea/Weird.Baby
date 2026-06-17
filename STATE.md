<!-- ============================================================= -->
<!-- LIVE LEDGER — source of truth. Read this block first.          -->
<!-- Last updated: 2026-06-17. Below this block: durable reference. -->
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

- Site: https://weird.baby — LIVE and CURRENT. Last deploy `67b3c7ec`, 2026-06-16 23:04 (verified via `wrangler deployments list`, 2026-06-17).
- Status: SOFT-LAUNCHED — visible but not advertised / not yet in search engines.
- Repo HEAD: `753b17e`, in sync with origin/main.

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

