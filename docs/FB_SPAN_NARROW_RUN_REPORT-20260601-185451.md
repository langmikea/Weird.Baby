<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# Facebook Cards → Single-Column (Narrow) — Run Report

**Date:** 2026-06-01 18:54
**Session:** Cowork (front-end build)
**Brief:** Force all Facebook cards to single-column / narrow span, so FB post & video embeds render like proper FB posts instead of distorting when stretched to a 2-col (wide) span.
**Authority:** Operator directive (incognito visual review on weird.baby/hr): "all Facebook cards should be single-column / narrow."
**Builds on (uncommitted, adopted):** RC-A (FB embed render), RC-B (album-card collapse), IG photo lightbox — `docs/CARD_SHAPE_FIX_RUN_REPORT-20260601-175457.md`, `docs/IG_PHOTO_LIGHTBOX_RUN_REPORT-20260601-170622.md`.
**Status:** BUILT (front-end only). Operator live-verify + build + deploy + commit/push pending on Windows host.

---

## 0. Scope

One surgical front-end change in `src/routes/hr/HrExhibitFlow.jsx`:

- **FB-span fix** — every artifact with `source_platform === "facebook"` is forced to `span_w = 1` (single column / narrow), overriding the FNV-hash rolled span for FB only.
- **Out of scope:** RC-C (masonry / row-grid gutters) — separate. Other card types' spans — the operator-locked varied YouTube/link/photo/gallery/album spans are untouched.

Front-end only: no MediaVault write, no `hunter_root.json` / export change, no deploy-pipeline change.

## 1. What was wrong

FB post embeds have a portrait-ish natural shape. When a FB card landed (via the deterministic FNV-hash span roll in `pickSpan()`) in a 2-column **wide** span, the embed stretched and distorted. The 1-column **narrow** FB cards render correctly, like proper FB posts.

The prior rule (`isAudio || (isFbEmbed && !isFbVideo) ? 1 : rolledSpan`) only forced **non-video** FB embeds to narrow. FB **video** embeds — and any FB card whose URL failed to parse to an embed (falling through to the link path with its wide bias) — could still roll to a 2-col wide span.

## 2. The change

`ArtifactCard`, span assignment (HrExhibitFlow.jsx ~line 1994):

```js
// before
const span_w = isAudio || (isFbEmbed && !isFbVideo) ? 1 : rolledSpan;
// after
const span_w = card.source_platform === "facebook" || isAudio ? 1 : rolledSpan;
```

Keying directly on `source_platform === "facebook"` (rather than `isFbEmbed`) means **every** FB card is narrowed — video embeds, post/reel embeds, and any unparsed-URL FB card — not just non-video embeds. `isAudio`'s existing forced-narrow behavior is preserved. All non-FB, non-audio cards continue to use the FNV-hash `rolledSpan`, so the operator-locked varied YouTube/link/photo/gallery/album spans are unchanged.

The FNV `pickSpan()` rolled span is still computed for FB cards but discarded by the override; `isFbVideo` remains referenced in the `pickSpan` bias argument, so no unused-variable lint regression is introduced.

A rationale comment block was added above the line.

## 3. Verification

- **Edit integrity:** file edited via host-direct Edit tool (the sandbox FUSE view of this 3105-line file is a stale/byte-capped cache — quirk #1/#8 — so a bash read-modify-write was deliberately avoided to protect the ~380-line tail). Post-edit host-direct re-read confirms the edit at line 1994 and the file closing cleanly at line 3104 (3105 with trailing newline) — no truncation.
- **Isolated syntax + behavior:** `node --check` clean; a standalone replica of the edited expression run over 10 card categories — FB video, FB post, FB reel, FB unparsed, audio, YouTube, ReverbNation link, IG photo, gallery, album — yields span 1 for every FB card and audio, span "rolled" for all others. ALL PASS.
- **Lint safety:** `isFbEmbed`, `isFbVideo`, `rolledSpan` all still referenced; no new identifiers. Expected lint baseline unchanged (4 errors / 6 warnings; HrExhibitFlow.jsx's 1 warning).
- **Deferred to operator host (sandbox can't do reliably):** full `npm run lint`, `npm run build` (workerd-blocked in sandbox per CLAUDE.md §9), `npm run deploy`, incognito live-verify on weird.baby/hr, and the commit + push (commits run host-side per §2).

## 4. Operator host-side checklist

1. `npm run lint` — confirm baseline 4 err / 6 warn (no new).
2. `npm run build` — must pass.
3. `npm run deploy` — ships to weird.baby. (No `export-artifacts` needed: no MV/JSON change.)
4. Incognito → weird.baby/hr: every FB card is narrow/single-column and renders like a proper FB post; no wide FB cards remain; YouTube / album / IG / gallery unregressed.
5. Commit + push — one commit covering RC-A + RC-B + IG + this FB-span fix (see suggested message in the session handoff).
