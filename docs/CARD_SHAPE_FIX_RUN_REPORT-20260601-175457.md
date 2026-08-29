<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# Card-Shape Fix — Run Report (RC-A + RC-B, IG build adopted)

**Date:** 2026-06-01 17:54
**Session:** Cowork (front-end build)
**Brief:** Fix FB cards rendering empty (RC-A) + album card collapse (RC-B); adopt pending IG photo-lightbox build.
**Authority:** `docs/CARD_SHAPE_AUDIT-20260601-173533.md` (§2 RC-A/RC-B, §5 Fix 1/Fix 2).
**Builds on (uncommitted, adopted):** Instagram photo lightbox, `docs/IG_PHOTO_LIGHTBOX_RUN_REPORT-20260601-170622.md`.
**Status:** BUILT (front-end only). Operator live-verify + build + deploy + commit/push pending on Windows host.

---

## 0. Scope

Two surgical front-end fixes from the card-shape audit, plus adoption of the
already-deployed-but-uncommitted IG photo-lightbox working-tree changes into
this session's single commit.

- **RC-A (urgent)** — 16 Facebook cards render as empty white boxes.
- **RC-B (trivial)** — the single album card collapses to a ~55px sliver.
- **IG build** — preserve + commit the pending `PhotoOverlay` work.
- **Out of scope:** RC-C (row-grid gutters / masonry) — deferred cosmetic follow-up. The grid was **not** restructured.

All changes are front-end only: no MediaVault write, no `hunter_root.json` /
export change, no deploy-pipeline change.

## 1. RC-A — Facebook inline embeds never mount (16 empty boxes)

**Root cause (per audit §2 RC-A, re-confirmed against current source).**
`FbEmbedCard`'s iframe is gated `{embed && tileW > 0 && (<iframe…/>)}`. `tileW`
comes from `useElementWidth()`, whose `ResizeObserver` callback only called
`setWidth(w)` `if (w)` — it discarded a 0-width initial reading and, in the
deck's mount sequence, never received a later non-zero callback. So `tileW`
stayed `0`, the gate was always false, and no Facebook iframe ever mounted —
for every viewer (upstream of FB auth; **not** the logged-out caveat). There
was also no fallback, so a non-mounting embed was a blank white box (the box
keeps its per-kind CSS aspect-ratio, so it occupies space but shows nothing).

**Fix (two parts), `src/routes/hr/HrExhibitFlow.jsx`:**

1. **Reliable width measurement.** Rewrote `useElementWidth()`. It now fires a
   first measurement from a `requestAnimationFrame` (AFTER layout), reading
   `getBoundingClientRect().width || offsetWidth` directly, and keeps a
   `ResizeObserver` for later resizes. The rAF guarantees a post-layout
   reading even when the RO's initial callback arrives at 0 and never fires
   again. `setState` happens **only inside the rAF / RO callbacks** (never
   synchronously in the effect body), preserving the existing lint posture
   (`react-hooks/set-state-in-effect`); a functional-update guard
   (`setWidth(prev => prev === w ? prev : w)`) makes an unchanged re-measure a
   no-op so it can't loop. With this, `tileW` becomes correct within one frame
   and all 16 iframes mount.

2. **No-blank fallback.** A titled `MediaPlaceholder variant="card"` is now
   rendered **behind** the iframe inside `.hr-card-video-vis` (the box is
   `position: relative`; the placeholder is `position:absolute; inset:0`). A
   slow / refused / not-yet-measured embed shows a styled INK/GOLD tile with
   the post title instead of a blank white box; the opaque FB embed paints
   over it once it loads. FB cards carry **no thumbnail** (`primary_url` and
   `thumbnail_url` are `null` in the export — verified in
   `hunter_root.json`), so the fallback is title-only, reusing the shared
   `MediaPlaceholder` (the 2026-05-30 broken-preview component) with no API
   change. Worst case is now a titled placeholder, never a blank box.

The width-fill scaling design (2026-05-31, `FB_EMBED_WIDTH_FILL`) is
**unchanged** — the `tileW > 0` gate is retained (now reliably satisfied), so
the iframe still mounts once at the correct width with no wrong-width reflow /
double-load. The placeholder covers the pre-measurement window.

**Required follow-up (operator, per audit §5 Fix 2 / §6):** now that embeds
mount, **re-verify in a logged-out / incognito window** — the operator's
logged-in Chrome over-represents what a public visitor sees. This was moot
under the mount bug (nothing mounted either way); it becomes meaningful now.

## 2. RC-B — album card collapses to a ~55px sliver

**Root cause (per audit §2 RC-B).** `.hr-card-gallery .hr-card-video-vis` has
`aspect-ratio: 4/5; flex:none` (CSS), but there was **no equivalent
`.hr-card-album .hr-card-video-vis` rule** — so the album tile's media box had
no height to derive and collapsed (vis 1px tall → 55px row).

**Fix, `src/routes/hr/HrExhibitFlow.css`** (one rule next to the gallery rule):

```css
.hr-card-album .hr-card-video-vis { aspect-ratio: 1 / 1; flex: none; }
```

**Aspect choice — 1/1, not 4/5.** The audit's primary recommendation is `1/1`
("album art is square"), with `4/5` offered only "if matching the gallery tile
is preferred." The album card is explicitly the **audio analogue** of the
gallery container (JSX comment), and audio cards already use
`.hr-card-audio .hr-card-video-vis { aspect-ratio: 1/1 }`. Square is the
natural fit for album cover art and matches the existing audio tile, so `1/1`
is the most defensible choice. **It is a one-line flip to `4/5` at live-verify
if the operator prefers the gallery-matching look.**

## 3. IG photo-lightbox build — preserved + adopted

The uncommitted `PhotoOverlay` work (build 4,
`IG_PHOTO_LIGHTBOX_RUN_REPORT-20260601-170622.md`) was **not** discarded or
overwritten. Verified intact host-direct after my edits — all wiring present:

- `PhotoOverlay` component definition (~JSX L1903);
- `isPhoto` branch dispatches to a `<button onClick={onOpenPhoto}>` (L2041–2053);
- root state `openPhoto` / `setOpenPhoto` (L2763) + render site (`{openPhoto && <PhotoOverlay…/>}`, L2964);
- `onOpenPhoto` threaded `root → P3Panel → ArtifactCard` (L1956 / L2116 / L2170 / L2995).

My RC-A edit touches `FbEmbedCard` / `useElementWidth` only; my RC-B edit is a
CSS-only addition. Neither overlaps the IG code. The IG build is included in
this session's commit (§5).

## 4. Files changed (front-end only)

| File | Change |
|---|---|
| `src/routes/hr/HrExhibitFlow.jsx` | **RC-A:** rewrote `useElementWidth` (rAF + RO, lint-safe); added `MediaPlaceholder` behind the FB iframe. **(plus the adopted IG `PhotoOverlay` build.)** |
| `src/routes/hr/HrExhibitFlow.css` | **RC-B:** added `.hr-card-album .hr-card-video-vis { aspect-ratio:1/1; flex:none }`. **(plus the adopted IG `.hr-photo-ov*` block.)** |
| `docs/CARD_SHAPE_FIX_RUN_REPORT-20260601-175457.md` | this report. |

No `src/data/exhibits/hunter_root.json` edit, no MV write, no export/pipeline change.

## 5. Verification performed (sandbox-side / host-direct)

The Cowork sandbox FUSE view of `HrExhibitFlow.jsx` is truncated and sandbox
`git` shows phantom mass-deletions (CLAUDE.md quirks #1/#6/#8 + env §2) — both
confirmed this session (`git diff` reported a 499-line phantom delete on the
intact file). Verification was therefore done host-direct via the Read tool,
which sees full current content:

- **Edits landed exactly** — re-read all three edit sites; content matches intent.
- **File integrity** — `HrExhibitFlow.jsx` ends cleanly at L3097 (`}` closing the component); CSS rule well-formed; no tail truncation introduced.
- **Scope** — `MediaPlaceholder` is module-scope and defined (L1183) before its FB use (L1716); `requestAnimationFrame`/`cancelAnimationFrame`/`ResizeObserver` are covered by `...globals.browser` in `eslint.config.js`, so no new `no-undef`.
- **Lint posture** — `setWidth` calls are inside async rAF/RO callbacks, not the synchronous effect body, matching the pattern the prior code documented as lint-clean. **No new errors expected; source baseline 4 err / 6 warn should hold** (authoritative `npm run lint` runs on the Windows host).
- **IG build** — wiring chain verified present and untouched (§3).

**Not done in sandbox** (CLAUDE.md §9 / §1): `npm run build`, `npm run lint`,
`node --check` against the mount — workerd/rolldown are Windows binaries and
the FUSE view is truncated (would give a phantom parse error, not a real one).
Authoritative build/lint + live-verify are the operator-host steps below.

## 6. Operator verify + ship (Windows host) — one commit, RC-A + RC-B + IG

Front-end only; build/lint/deploy/commit/push run on the Windows host.

1. **Build + deploy, then live-verify** `weird.baby/hr` after
   `npm run build && npm run deploy` (or local dev):
   - **RC-A:** all 16 Facebook cards render content again (not blank boxes) — **and re-check in an incognito / logged-out window** (audit §5/§6 caveat); a slow/refused embed shows a titled placeholder, never a blank box;
   - **RC-B:** the album card shows at proper height (square cover), no longer a ~55px sliver;
   - **IG:** the Instagram card opens its photo + caption in-site (PhotoOverlay), closes via ✕ / backdrop / Escape, "Open on Instagram ↗" opens a new tab;
   - **Unregressed:** YouTube player lightbox, Facebook lightbox, gallery, album, ReverbNation (5) + ticketing (1) still link out;
   - `npm run lint` at baseline (**4 errors / 6 warnings**, source-only).
   - (RC-C gutters/masonry are knowingly still present — deferred.)

2. **Commit + push** (hyphenated branch; PowerShell recovery prelude per CLAUDE.md env §2):

   ```powershell
   if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
   git reset --mixed HEAD
   git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css `
           docs/IG_PHOTO_LIGHTBOX_RUN_REPORT-20260601-170622.md `
           docs/CARD_SHAPE_AUDIT-20260601-173533.md `
           docs/CARD_SHAPE_FIX_RUN_REPORT-20260601-175457.md
   git commit -m "fix(hr): mount FB embeds reliably + album aspect; adopt IG lightbox"
   ```

   Suggested commit body:

   > RC-A: Facebook cards rendered as 16 empty boxes — useElementWidth's
   > ResizeObserver discarded the 0-width initial reading and never fired again,
   > so tileW stayed 0 and the gated iframe never mounted (all viewers, upstream
   > of FB auth). Measure via requestAnimationFrame after layout + keep the RO;
   > add a titled MediaPlaceholder behind the iframe so a slow/refused embed is
   > never a blank box.
   > RC-B: album card collapsed to ~55px — no .hr-card-album aspect-ratio rule;
   > add 1/1 (square album art, matching .hr-card-audio).
   > Also adopts the pending Instagram photo-lightbox build (PhotoOverlay,
   > build 4), deployed but uncommitted.
   > Out of scope: RC-C (row-grid gutters / masonry) — separate follow-up.
   > Front-end only; no MV/export change.

   Squash-merge per CLAUDE.md release discipline if routed through a PR/branch;
   a direct commit on `main` is fine since this is operator-confirmed shipping.

## 7. Hard stops honored

RC-A + RC-B only, plus IG adoption. No grid restructure (RC-C deferred). No MV
write, no export/schema change, no deploy-pipeline change. No commit or push
from the sandbox (host-side only). IG working-tree changes preserved, not
overwritten.
