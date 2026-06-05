## Decisions / closed

- COL3 FB post clip: CLOSED — ACCEPTED (2026-06-02). Logged-out-only cosmetic clip of the longest post's like/comment/share row. NOT a column bug (column is random per load); NOT an open defect. Cause = fixed-height box that never self-sizes because raw post.php sends no height. Dead-end theories + fix options recorded in docs/FINDING-fb-post-clip.md. Do NOT re-investigate as a mystery — read that doc first.

# Weird.Baby Museum — STATE

The durable reference for the Museum: stack, routes, mothballed-for-v1
decisions, and pointers to canonical specs. **Does NOT cover current
progress, deploy status, or what's next** — see `NAVIGATION.md` and
`git log` for that.

**Last refreshed:** 2026-06-05

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

## Presets — build prerequisites (BLOCKERS)

Recorded 2026-06-05 (presets design session + Cowork drift ledger).
Spec: `docs/UX_PRESETS_SPEC.md` (v0.2 draft). **Both items below BLOCK
any presets build** — do not start preset wiring until they clear.

- **[BLOCKER] Mobile presets surface.** The deck — including the
  Presets tab — is `display:none` at ≤720px, so factory presets are
  unreachable on a phone. This contradicts the mobile floor (player +
  factory presets must be usable on phone). UX-design decision needed:
  where do presets live on mobile when the dock is gone? Owner: Mike
  (UX call). Ref: `docs/UX_PRESETS_SPEC.md §8.1`.
- **[BLOCKER] Stable track + variant IDs.** Tracks carry no IDs and
  videos are positional in the spine contract, so per-song variant
  capture has nothing stable to reference. Data-contract change,
  upstream of all preset wiring. Ref: `docs/UX_PRESETS_SPEC.md §8.2`.

Implementation seam, for when the blockers clear: the single boundary
between the two scopes is `<ExhibitFlow activeAlbumId={album.id} />`;
capture/restore means widening that boundary or lifting state. The
verbs are mostly renames + scope-widening, not new machinery.
Ref: `docs/UX_PRESETS_SPEC.md §9`.

## Canonical docs

See `docs/canonical/` — VISION, VISION_LOCK_v0.3, UX_SPEC_v0.3,
UX_CONTROLS_SPEC_v0.4. These describe the design north-star and are
authoritative over any narrative in this file.

Child spec (draft, not yet locked): `docs/UX_PRESETS_SPEC.md` — the
presets spec that `UX_SPEC_v0.3 §C.5.0` named as forthcoming; child of
`UX_CONTROLS_SPEC_v0.4 §9` and `UX_LIFECYCLE_SPEC_v0.5 §4.5`.
