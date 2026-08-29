<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# Run Report — Render FB artifacts as post embeds (fix crop) + letterbox fallback

**Applied:** 2026-05-31 19:10 UTC
**Handoff:** `docs/FB_POST_EMBED_HANDOFF-20260531.md`
**Builds on:** `9f61e39` (feat(hr): add Facebook filter facet; per-video FB sizing groundwork). Branch `main`.
**Scope:** Front-end only — `src/routes/hr/HrExhibitFlow.jsx` + `src/routes/hr/HrExhibitFlow.css`. No data / export / MV change.
**Status:** Edits applied + in-sandbox verification passed. Host build/deploy/**live-verify**/commit/push still pending (operator runbook below).

---

## Edits applied

All three edits applied as exact-match replacements against the host file (LF line endings; no CRLF in this file, so the CRLF retry path was not needed).

**EDIT A — `HrExhibitFlow.jsx`: `fbEmbedFor` replaced** (was at line 1535).
All FB artifacts now route through `plugins/post.php?href=<original FB url>` — video (`watch?v=` / `/videos/`), reel (`/reel/`), and post (`/posts/`, `/permalink/`, `story.php`) alike. `kind` is retained only for grid span and the `data-fbkind` CSS hook. `fbEmbedDims` and the `ArtifactCard` dispatch are unchanged.

**EDIT B — `HrExhibitFlow.jsx`: `FbEmbedCard` replaced** (was at line 1566).
Added the `FB_FALLBACK_H = { video: 620, reel: 1040, post: 720 }` per-kind letterbox fallback. Added a `postMessage` listener (origin-checked to `*.facebook.com`, source-checked to this card's iframe window, tolerant multi-shape height parse) that sets `postedH`. Sizing precedence: export `dims` → measured `postedH` → per-kind fallback. Box height is held equal to the scaled frame height via `calc(var(--fb-w, 280) / 500 * effH px)`, so the frame can never overflow its box (never cropped; short content letterboxes). State is set only from the async message callback, not synchronously in the effect body.

**EDIT C — `HrExhibitFlow.css`: FB block comment refreshed** (block at line ~195).
Top comment line updated to `post.php + postMessage auto-height + letterbox fallback`, and the documentation note appended before `.hr-card-fbembed .hr-card-video-vis`. Functional CSS rules unchanged (the `.hr-fbembed-frame` scale/position rule and the vis `overflow:hidden; background:#fff` rule are retained; the per-kind `aspect-ratio` + frame-height rules now act as a pre-measurement hint only, overridden by the inline heights).

Hooks (`useState`, `useEffect`, `useRef`) were already imported at the top of the file — no import change needed. New locals (`kind`, `frameRef`, `postedH`, `effH`, `FB_FALLBACK_H`) are all consumed; no new unused-var lint constructs introduced.

---

## In-sandbox verification

1. **Classifier sanity (Node, standalone reimplementation of the new `fbEmbedFor`):** PASS.
   - `watch?v=` → `{kind:"video", src:.../plugins/post.php...}` ✓
   - `/videos/<id>` → `{kind:"video", src:post.php}` ✓
   - `/reel/<id>` → `{kind:"reel", src:post.php}` ✓
   - `/posts/` → `{kind:"post", src:post.php}` ✓
   - `/groups/<id>/permalink/<id>/` (true `/permalink/` path) → `{kind:"post", src:post.php}` ✓
   - `story.php` → `{kind:"post", src:post.php}` ✓
   - bare profile, non-FB url, empty string, null → `null` ✓
   - Every returned `src` contains `plugins/post.php`; none contain `video.php`.
   - Note: `permalink.php?story_fbid=...` resolves to `null` — this is **identical to the original `fbEmbedFor`** (both use `/\/permalink\//`, which requires the slash form), so it is not a regression.

2. **No live `video.php` call remains:** `grep fbPluginSrc("video` in `HrExhibitFlow.jsx` → no matches. The string `video.php` survives only in three explanatory comments (lines ~1518, ~1539, ~1583).

3. **Syntax:** `node --check` cannot parse `.jsx`, and `npx eslint` over the sandbox FUSE mount reports a single phantom `Parsing error: Unexpected token` at 2513:61 — this is the documented sandbox FUSE/virtiofs tail-truncation of this ~109 KB file (CLAUDE.md quirk #1; handoff verification §3 caveat), **not** a real defect:
   - The host `Read` tool returns the file's full, valid content through its true end (lines 2513–2531+ are intact, e.g. `selected[d.key] instanceof Set`).
   - `@babel/parser` (sourceType:module, jsx plugin) over the sandbox copy parses **cleanly through line 2512** — which fully covers both edited functions (`fbEmbedFor` and `FbEmbedCard`, lines ~1535–1660) — and only errors at the truncated tail. So the edited code is syntactically valid.
   - Full-repo `npm run lint` / `npm run build` therefore must be run on the **host** to confirm the documented 4 errors / 6 warnings baseline (the sandbox cannot read this file in full).

---

## Host runbook (operator / PowerShell) — build → deploy → live-verify → commit + push

Run on the Windows host from `C:\AI\Projects\weird-baby-museum`:

```powershell
# 1) build + deploy to weird.baby
npm run lint            # expect 4 errors / 6 warnings (baseline)
npm run build           # must pass (vite + rolldown + cloudflare)
npm run deploy          # vite build && wrangler deploy
```

**2) LIVE-VERIFY (operator eyes — embeds render blank in automated/logged-out browsers):** open https://weird.baby/hr and check:
- FB cards — **video, reel, and post** — render **fully, without cropping** (post-sized where FB reports height; letterboxed-to-fit with whitespace otherwise, never cut off).
- "Open on Facebook ↗" link present on every FB card; any FB-side "Unavailable" block still falls back to that link.
- FORMATS tab: **Facebook** Source pill still = **16** and selects exactly the 16 FB cards; Youtube (39) / Reverbnation / Tiktok (2) etc. unchanged.
- Gallery, album, coverflow, audio, photo, YouTube cards unchanged.

If a card is still cropped, capture the kind/URL and report back — `FB_FALLBACK_H` or the `postMessage` shape parse may need a tweak.

**3) commit (explicit paths) + push** — only after live-verify passes:

```powershell
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
git reset --mixed HEAD
git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css
git commit -m "fix(hr): render FB artifacts as post.php embeds; postMessage auto-height + letterbox fallback"
git push    # or open a PR per the CLAUDE.md workflow if preferred
```

---

## Open items / notes for the operator
- **Live-verify the `postMessage` height shape.** The listener parses `d.height ?? d.frameHeight ?? d.data.height ?? d.params.height` tolerantly; confirm FB still posts one of these. Even if no message ever arrives, the per-kind letterbox fallback guarantees full visibility (never cropped).
- The descriptive comment at `HrExhibitFlow.jsx` line ~1518 still says "via the plugins/video.php and plugins/post.php IFRAME endpoints." It is now slightly stale (video.php is no longer used) but was **out of scope** for this handoff (only the EDIT A/B/C blocks were specified), so it was left untouched. Optional one-line cleanup for a future pass.
