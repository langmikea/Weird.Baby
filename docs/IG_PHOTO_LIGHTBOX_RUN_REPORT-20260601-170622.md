<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# Instagram Photo Lightbox — Run Report (Universal-Lightbox Build 4)

**Date:** 2026-06-01 17:06
**Session:** Cowork (front-end build)
**Brief:** "Instagram photo lightbox — finish the capstone (build 4)"
**Scoping authority:** `docs/UNIVERSAL_LIGHTBOX_EXPAND_SCOPING-20260531-204334.md` (§3.3, §3.5, §3.9, §5, §6)
**Builds on:** YouTube lightbox (`4335242`, build 1) + Facebook lightbox (`9928f3e`, build 2)
**Status:** BUILT (front-end only). Operator live-verify + build + deploy + commit/push pending on Windows host.

---

## 1. What was built

The single Instagram card (`MV-HR-20260405-037`) now opens its self-hosted photo
**in-site** in a lightbox overlay, instead of opening `primary_url` in a new browser
tab. The overlay shows the large hosted image plus the post caption (from
`description`), and keeps an always-present **"Open on Instagram ↗"** escape hatch.

This was the only remaining content-bearing card type still opening in a new tab, so
its conversion **closes the universal-lightbox capstone**: every card type that has
content to expand now expands in-site, and the remaining new-tab cards are intentional
link-outs (see §4).

### Mechanism

A new `PhotoOverlay` component was added, mirroring the existing
`GalleryOverlay`/`YouTubeOverlay`/`FacebookOverlay` shell contract verbatim:

- full-viewport `role="dialog" aria-modal="true"`, INK/GOLD/BORDER language;
- three close affordances — ✕ button, backdrop click (`onClick={onClose}` on the
  container, inner stage `e.stopPropagation()`), and Escape (keydown listener);
- body-scroll lock on mount, restored on unmount;
- open state held at the `HrExhibitFlow` root (`openPhoto` / `setOpenPhoto`), so the
  overlay layers above the deck + grid and survives grid reflows;
- `{openPhoto && <PhotoOverlay…/>}` conditional render unmounts the overlay on close.

The body is a large `FallbackImg` (the broken-preview-fallback `<img>` from 2026-05-30,
so a 404/empty asset degrades to the shared `MediaPlaceholder` instead of a broken-image
glyph) at `src = primary_url || thumbnail_url`, above a caption block: the full caption
text (`description`, falling back to `title`) and a meta line with `post_date` + the
"Open on Instagram ↗" link (`source_url`, `target="_blank" rel="noopener noreferrer"`).
The escape-hatch label derives from `source_platform` (capitalized), so a future
self-hosted photo on another platform reads correctly.

Since the asset is self-hosted, there is **no embed, no token, no third-party
dependency, and no player teardown** (no iframe/audio) — simpler than YouTube/Facebook.

### Card dispatch

The existing `isPhoto` predicate (`!isFbEmbed && media_type === "photo" && !!primary_url`)
already isolated exactly this one card (the only true `PhotoCard` in the export — all 16
Facebook cards route through `FbEmbedCard` first; scoping §2.1). Its render branch was
changed from an `<a target="_blank">` wrapper to a `<button onClick={() => onOpenPhoto(card)}>`
wrapper around the same `PhotoCard` tile — exactly mirroring how `isYouTube` / `isGallery`
/ `isAlbum` already dispatch to their overlays. The `onOpenPhoto` callback is threaded
root → `P3Panel` → `ArtifactCard` alongside the existing `onOpen*` props.

## 2. Files changed (front-end only)

| File | Change |
|---|---|
| `src/routes/hr/HrExhibitFlow.jsx` | New `PhotoOverlay` component; `isPhoto` branch `<a>` → `<button>`; `onOpenPhoto` threaded through `ArtifactCard` + `P3Panel` signatures + call; new `openPhoto`/`setOpenPhoto` root state; root render site; `P3Panel` prop pass. (~+89 lines net; file 2991 → 3080 lines.) |
| `src/routes/hr/HrExhibitFlow.css` | New `.hr-photo-ov*` block (shell + image + caption + escape-hatch link), mirroring `.hr-yt-ov` / `.hr-gallery-ov`. (~+78 lines.) |

No MediaVault write, no `hunter_root.json` / export change, no deploy-pipeline change.
No touch to YouTube / Facebook / gallery / album code. No TikTok renderer (zero cards,
scoping §3.4). All rendered from fields the export already carries (`primary_url`,
`thumbnail_url`, `description`, `source_url`, `source_platform`, `post_date`).

## 3. Verification performed (sandbox-side)

The Cowork sandbox FUSE view of `HrExhibitFlow.jsx` is truncated (bash sees ~2665 of
3080 lines, ending mid-statement) and the CSS view is stale + truncated — confirmed this
session (CLAUDE.md sandbox quirks #1/#8). So `node --check` / `eslint` against the mount
would choke at the artificial cutoff (the documented phantom parse error), not report
real issues, and sandbox `git` is unreliable. Verification was therefore done via the
host-direct Read tool, which sees full, current content:

- **File integrity:** `HrExhibitFlow.jsx` ends cleanly at line 3080 (`}` closing
  `HrExhibitFlow`); CSS block well-formed, FB grid-tile block intact after it. No
  tail-truncation introduced by the edits.
- **Wiring chain (grep, host-direct):** `setOpenPhoto` (root state) → `onOpenPhoto`
  prop on `P3Panel` → passed to `ArtifactCard` → button `onClick` → `PhotoOverlay`
  render gated on `openPhoto`. All 8 sites present and consistent.
- **Pattern parity:** `PhotoOverlay` and the `isPhoto` button branch are near-verbatim
  mirrors of the lint-clean `YouTubeOverlay` / `isYouTube` code (build 1). No new imports
  (`useEffect` already imported), no new hook patterns, no new unused vars — so the
  **source lint baseline of 4 errors / 6 warnings is expected to hold** (authoritative
  `npm run lint` runs on the Windows host).

## 4. Link-out confirmation (no build — verify + report, scoping §3.5 / §5)

Confirmed from `src/data/exhibits/hunter_root.json` that the remaining new-tab cards are
**intentional archival link-outs, not accidental gaps**:

- **5 ReverbNation cards** (`MV-HR-20260416-001/003/...`): `source_platform:"reverbnation"`,
  `media_type:"link"`, `primary_url:null` → fall through `ArtifactCard` to `isLink` →
  `<a target="_blank">`. Correct. The real RWTH audio these pages represent is **already
  in-site** as self-hosted mp3s via the album overlay (`AlbumOverlay`); the RN page links
  are archival provenance (scoping §2.3 / §3.5 — RN is live/BandLab-owned, default (a)
  link-out recommended; no RN widget built, per scoping §3.5(b) flagged flaky/unverified).
- **1 "other" ticketing card** (`MV-HR-20260405-010`, theticketing.co):
  `source_platform:"other"`, `media_type:"link"`, `primary_url:null` → `isLink` →
  `<a target="_blank">`. Correct link-out (scoping §5 row 5).

These behaviors are unchanged by this build and are the intended end-state.

## 5. Capstone closure

With Instagram converted, **every content-bearing card type now expands in-site**:

| Card type | In-site expand | Mechanism |
|---|---|---|
| YouTube (39) | ✅ | `YouTubeOverlay` (build 1) |
| Facebook (16) | ✅ | `FacebookOverlay` / `FbEmbedCard` (build 2) |
| Gallery (1) | ✅ | `GalleryOverlay` (Phase 3) |
| Album (1) | ✅ | `AlbumOverlay` (RWTH parity) |
| **Instagram (1)** | ✅ **(this build)** | **`PhotoOverlay`** |
| ReverbNation (5) | link-out (intentional) | `isLink` `<a>` — audio already in-site via album |
| Other / ticketing (1) | link-out (intentional) | `isLink` `<a>` |
| TikTok (0) | n/a | zero cards; forward-compat spec only (scoping §3.4) |

The universal-card → in-site-lightbox capstone is **complete**, modulo operator live-verify.

## 6. Operator verify + ship (Windows host)

Front-end only; build/lint/deploy/commit run on the Windows host (sandbox can't build —
workerd/rolldown are Windows binaries; sandbox git is unreliable — CLAUDE.md §1/§2/§9).

1. **Live-verify** `weird.baby/hr` after `npm run build && npm run deploy` (or local dev):
   - Instagram card opens the photo + caption **in-site** (not a new tab);
   - closes work — ✕ button, backdrop click, **Escape**;
   - "Open on Instagram ↗" opens the IG post in a new tab;
   - **unregressed:** YouTube player lightbox, Facebook lightbox, gallery, album;
   - ReverbNation cards + the ticketing card still open in a new tab (link-out);
   - `npm run lint` at baseline (**4 errors / 6 warnings**, source-only).
2. **Commit + push** (hyphenated branch name; PowerShell recovery prelude per CLAUDE.md §2):

   ```powershell
   if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
   git reset --mixed HEAD
   git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css `
           docs/IG_PHOTO_LIGHTBOX_RUN_REPORT-20260601-170622.md
   git commit -m "feat(lightbox): Instagram photo opens in-site (build 4)"
   ```

   Suggested commit body: closes the universal-lightbox capstone — the single
   self-hosted Instagram photo (`MV-HR-20260405-037`) now opens in a `PhotoOverlay`
   (large image + caption + "Open on Instagram ↗") instead of a new tab, mirroring the
   YouTube (build 1) / Facebook (build 2) overlay pattern. ReverbNation (5) + ticketing
   (1) confirmed intentional link-outs. Front-end only; no MV/export change.

## 7. Hard stops honored

Instagram only for the build. No touch to YouTube / Facebook / gallery / album. No
TikTok renderer. Front-end only — no MediaVault write, no export schema change, no
deploy-pipeline change. No commit or push performed from the sandbox (host-side only).
