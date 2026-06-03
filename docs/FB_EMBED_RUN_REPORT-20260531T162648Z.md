# FB embed render change — run report

**Date:** 2026-05-31
**Session:** Render Facebook artifacts as inline embeds (not link/placeholder cards)
**Scope:** Front-end only. No MV write, no export regen, no app token. (FB artifacts already exist and are released.)
**Files changed:** `src/routes/hr/HrExhibitFlow.jsx`, `src/routes/hr/HrExhibitFlow.css`

---

## Investigation findings

**16 FB artifacts** in `src/data/exhibits/hunter_root.json` (of 89 total). By `media_type`: 10 `video`, 4 `link`, 2 `photo`. URL shapes: 10 `watch?ref=saved&v=<id>`, 4 `/<page>/posts/pfbid…`, 2 `/reel/<id>`. Two duplicate URLs (reel `1137424761619325` ×2; `watch?v=755734052557156` ×2) — the still-open BACKLOG "duplicate-card question"; left as-is per scope.

**Kickoff premise corrected.** The dispatch in `ArtifactCard` keys `isLink` on `media_type === "link"`. So today:
- 4 `media_type:"link"` FB artifacts rendered as `LinkCard` (clickable `<a>` opening FB in a new tab) — the "link card" behavior described.
- 10 `media_type:"video"` FB artifacts fell through every branch to `PlaceholderCard` — a **non-clickable grey "video" tile**, not a link card (worse than described).
- 2 `media_type:"photo"` FB artifacts rendered as `PhotoCard` (curated R2 frame).

## Feasibility verdict

- Graph **oEmbed** API requires an app access token since 2020 → out (hard stop, no credentials). Confirmed.
- **FB JS SDK / xfbml** also wants an `app_id` + async parse → avoided.
- **`plugins/video.php` (watch/reel) + `plugins/post.php` (posts) iframes** need no token, embed public content inline → chosen path.
- **No CSP blocker**: museum sets no Content-Security-Policy (no `_headers`, no meta; worker only sets CORS on API routes).
- **Canonical alignment**: UX_SPEC §C.5.2 mandates inline FB embeds; VISION_LOCK G-12 permits embedding historical FB artifacts. No conflict.
- **Live caveat**: FB iframes render only PUBLIC content; logged-out visitors may hit a login wall / blank frame. Cross-origin iframes give no load/error signal, so failure can't be auto-detected. Mitigation: an always-present "Open on Facebook ↗" escape hatch in every embed foot.

## Build (operator-approved scope: ALL 16 FB embed; reels tall 9:16)

- New `fbEmbedFor(url)` + `fbPluginSrc()` classifier: `watch?v=`/`/videos/` → video.php (kind `video`), `/reel/` → video.php (kind `reel`), `/posts/`,`/permalink/`,`story.php` → post.php (kind `post`). Canonicalizes watch/reel URLs (drops `ref=saved`).
- New `FbEmbedCard`: lazy iframe filling `.hr-card-video-vis`, `allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"`, `allowFullScreen`; foot keeps title/post_date/ContentKindBadge plus the "Open on Facebook ↗" link.
- `ArtifactCard` dispatch: `isFbEmbed` computed first and takes precedence; `isLink`/`isPhoto`/`isAudio` gained `!isFbEmbed` guards. FB video can lean wide (2-col); reels/posts forced 1-col so tall aspect doesn't blow up the grid.
- CSS: `.hr-card-fbembed` aspect-ratios by `data-fbkind` (video 16:9, reel 9:16, post 4:5); `.hr-fbembed-frame` fills; `.hr-card-fb-open` link in deck gold tokens.

## Verification (in-sandbox)

- `npx eslint src/routes/hr/HrExhibitFlow.jsx` → **0 errors / 1 warning** (the pre-existing documented warning; no phantom parse error — Python rm+write kept the file intact).
- `npx eslint .` → **4 errors / 6 warnings** = documented baseline, zero new.
- Classifier unit test over the 16 real FB URLs → all 16 embeddable (10 video / 4 post / 2 reel), none null.
- Degradation test → bare FB profile/group + non-FB URLs return null → falls through to normal `media_type` branch (non-FB cards unregressed).
- `HrExhibitFlow.jsx` confirmed the sole consumer of `hunter_root.json`.

## Remaining — host-side (PowerShell)

Build is workerd-blocked in sandbox (§9); commits must run host-side (§2); push needs GH creds. Order per task: build → deploy → live-verify → commit + push. See handoff block in chat. Live-verify which of the 16 actually embed for logged-out visitors; the rest show the "Open on Facebook ↗" fallback.
