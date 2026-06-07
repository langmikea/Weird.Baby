## Decisions / closed

- COL3 FB post clip: CLOSED — ACCEPTED (2026-06-02). Logged-out-only cosmetic clip of the longest post's like/comment/share row. NOT a column bug (column is random per load); NOT an open defect. Cause = fixed-height box that never self-sizes because raw post.php sends no height. Dead-end theories + fix options recorded in docs/FINDING-fb-post-clip.md. Do NOT re-investigate as a mystery — read that doc first.

# Weird.Baby Museum — STATE

The durable reference for the Museum: stack, routes, mothballed-for-v1
decisions, and pointers to canonical specs. **Does NOT cover current
progress, deploy status, or what's next** — see `NAVIGATION.md` and
`git log` for that.

**Last refreshed:** 2026-06-07

## Working Doctrine (for any agent/session)

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

Remaining (not blockers): mobile presets section build (§8.1 — design
resolved 2026-06-05: presets join the mobile vertical scroll,
view-and-apply only), idle auto-return (§5 #3), shuffle/loop player
semantics (O9), preset naming UI (§5 #4), and the larger
preset-as-artifact / shareable-`/p/<id>` infrastructure (§0;
UX_LIFECYCLE_SPEC §4.5/§4.2).

## Backlog (durable design direction)

Standing items not yet started. Day-to-day sequencing lives in
`NAVIGATION.md` / `BACKLOG.md`; these are recorded here because they are
durable direction, not session-scoped tasks.

- **Brand-aligned museum aesthetic.** All Weird.Baby infrastructure (the
  museum shell: chrome, dock, controls, frames) should mirror the W.B
  logo — 1960s black-and-white-photo appeal, typeface akin to the
  logo's font. Content shown inside (album art, video, imagery) retains
  full vibrancy and palette. Principle: **brand frames the vessel;
  content stays vivid.** (Owner: Mike, UX. Status: not started.)

## Canonical docs

See `docs/canonical/` — VISION, VISION_LOCK_v0.3, UX_SPEC_v0.3,
UX_CONTROLS_SPEC_v0.4. These describe the design north-star and are
authoritative over any narrative in this file.

Child spec (draft, not yet locked): `docs/UX_PRESETS_SPEC.md` — the
presets spec that `UX_SPEC_v0.3 §C.5.0` named as forthcoming; child of
`UX_CONTROLS_SPEC_v0.4 §9` and `UX_LIFECYCLE_SPEC_v0.5 §4.5`.
