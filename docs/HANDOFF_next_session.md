# HANDOFF — Weird.Baby Museum, presets + next steps (paste as opening message of a fresh session)

Working rules in effect (see `STATE.md` → Working Doctrine, committed):
- Mike owns UX-facing / UX-impactful calls. The engineer owns Ops.
- Verify against the live `weird-baby-museum` repo before scoping. Never trust Drive copies (they've served stale/retired trees) or memory. Don't guess — read the file with pwsh (read-only) or Cowork.
- Default to Cowork for repo reads, big-file edits, and multi-file scoping — faster, full repo reach, avoids the human paste relay's limits/errors.
- Drive the live UI by accessibility ref, not pixel coordinates (tiny dock targets + peek-to-open animation make pixel clicks miss silently).
- No load-bearing work inside if/else in line-by-line-pasted scripts (the `else` orphans and silently skips). Flat statements + explicit verify-or-abort.
- Durable = committed AND pushed AND (for UI) deployed. Sandbox has NO push/deploy creds; Mike pushes (`git push origin main`) and deploys (`npm run build && npx wrangler deploy`) from PowerShell. No CI.
- A behavior does not change unless there is a stated reason for it to change.
- One question at a time, plain syntax, only when genuinely load-bearing and undecidable; otherwise assume-and-state.

## Where things stand (all live on origin/main + deployed)
- **Presets feature is functionally complete, deployed, and verified live.** Save / Play / Show / Now Playing all confirmed by direct test on weird.baby/hr:
  - Save captures both scopes (player by stable id; deck filters — e.g. "Source: Reverbnation").
  - Play restores exact track + variant by id (survives reordering — id resolution, not index).
  - Show = deck-only peek, jukebox plays on (§8.4 honored), status ribbon + Now Playing return.
  - Now Playing clears peek → Active View, playback uninterrupted.
- **Data + adapter groundwork done:** every track has a `song` slug (15 audio-only backfilled); adapter surfaces stable `track.id` + derived `video.id` onto the spine (commit 49cd044). Capture/restore wired via prop-widening at the `<ExhibitFlow>` seam (commits ea49b32, 1b070f1, 8a4dec2, 55e230e).
- **Spec of record:** `docs/UX_PRESETS_SPEC.md` (v0.4). §8.2 LANDED, §9 IMPLEMENTED, §8.1 scoped (§8.1.1 note).
- **Doctrine + backlog committed** (4fb2007, dcd4f7e, 2d59f7d), pushed.

## Open work (top level)
UX-facing:
- **Mobile presets surface (§8.1)** — decided + scoped, not built. Mount `.hr-mobile-presets` before `.hr-mobile-pills` in the O11 `@media(max-width:720px)` block of `HrExhibitFlow.css`; hoist `applyFactoryPreset`; factory Show via existing `peekSelected`; no Save/Reset on mobile. Two files, no seam change. **Prerequisite:** factory presets currently carry no jukebox state — give them player state so Play behaves as it does everywhere (both scopes). Behavior does not change on mobile; the data gap is filled to honor the existing behavior.
- **Preset naming UI (§5 #4)** — name-on-save with default.
- **Shuffle/loop semantics (O9)** — toggles captured but display-only; wire to the jukebox.
- **Idle auto-return (§5 #3)** — after Show, drift to Active View on jukebox-advance + idle.
- **Brand-aligned aesthetic** (backlog) — W.B infrastructure mirrors the logo (1960s B&W-photo, logo-like font); content keeps full vibrancy/palette.

Required infrastructure (the next big lift):
- **Preset-as-artifact** (Lifecycle §4.5) — today localStorage snapshot; canon wants a first-class shareable/tagged artifact.
- **Shareable preset URLs** `weird.baby/p/<id>` — depends on artifact model.
- **Entry-state-as-preset** (Lifecycle §4.2) — "no preset-less state"; likely not yet implemented.

## Recommended next step
Build **§8.1 mobile presets** — last gap in the otherwise-complete-and-live presets feature, decided and scoped, contained to two files. Fill the factory-preset player-state gap first (so Play means the same thing on mobile as everywhere), then the mount + CSS. Do it as a Cowork task (big-file-adjacent, multi-file); Mike pushes + deploys; verify live by accessibility ref.

## Recovered hazard to watch
The working tree was once found with three files truncated mid-write (sync flakiness); Cowork restored from HEAD. Everything since is committed/pushed clean. If you see a truncated file, check HEAD before editing.
