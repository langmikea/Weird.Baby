# FB cards — remove redundant foot + close the trailing void — Run Report

**Date:** 2026-06-01 23:47 UTC
**Session:** Cowork (front-end build)
**Brief:** Two operator-confirmed problems on live FB cards (embeds mounted):
1. Remove the redundant foot (`⤢ Expand` control + `Open on Facebook ↗` link) — the
   embed already provides interaction (Share, link-through), so the foot is clutter.
2. Fix the large black void below the mounted FB embed before the card ends.
**Authority:** Operator directive. Two follow-up decisions taken via clarifying question:
- **FB lightbox:** *Drop it, use the embed only.* No expand affordance; rely on the
  embed's own Share + link-through. FacebookOverlay mothballed.
- **Content-kind chip:** *Remove the whole foot* on FB cards (chip included).
**Status:** BUILT (front-end only). Host build → deploy → incognito FB-mounted
live-verify → commit/push pending (runbook in §5).
**Scope:** FB embed cards only. Untouched: YT / gallery / album / IG / coverflow /
audio; the lattice fix (`grid-row-end: span 360`, already in the tree); span variety
(`pickSpan`); `useMasonryRowSpan` behavior. No data / MV / export change.

---

## 1. Diagnosis — why the void, and what actually fixes it

Grounded in the prior live diagnosis (`FB_MASONRY_OVERLAP_AND_SDK_DIAGNOSIS-20260601-210604.md`)
and a code read of the current working tree.

**The grid lattice was already corrected in the working tree.** `HrExhibitFlow.css:171`
now reads `grid-row-end: span 360` (not the old shorthand `grid-row: span 360`). That is
the one-line lattice fix the diagnosis recommended; with it in place, `useMasonryRowSpan`'s
per-card `grid-row-end` writes are **effective** (they were inert under the shorthand bug).
Per the task scope, that line was **left untouched** — it is the separate lattice fix.

**Does `useMasonryRowSpan` re-measure and shrink the FB card to the settled height? — Yes.**
The hook (HrExhibitFlow.jsx ~1219) measures `card.getBoundingClientRect().height` and writes
`grid-row-end: span (h + 14)` **whenever h changes — growing or shrinking** — and it re-runs on
every plausible FB trigger: (1) a per-card `ResizeObserver`; (2) the FB `postMessage` height
event itself; (3) nested iframe/image `load`; (4) window resize; (5) settle sweeps at
120/400/900/1800 ms. So once the lattice fix makes those writes effective, the grid reserves
exactly the card's measured box height — there is **no gap *below* the card**.

**So the remaining void was *inside* the card box: the foot.** The card box = embed vis box
(white, `#fff`) **+** `.hr-card-foot` (INK-black). Because the post.php embed (`show_text=true`)
already renders the caption **and** date inside the iframe, the foot held only the sparse
`⤢ Expand` / `Open on Facebook ↗` controls + the content-kind chip — a mostly-empty **black**
region sitting directly below the white embed. That is the "large black void below the embed
content before the card ends." Masonry faithfully reserved it (box = embed + foot), so it
could not "measure it away" — the height was real; the content was absent.

**Fix:** remove the foot. Card box becomes the embed vis box alone, so the settled card
height = the settled embed height (caption included, rendered inside the embed). Posts already
self-size to FB's reported height (`effH = postedH`, from `FB_POST_SELFSIZE_RUN_REPORT-20260601-194321.md`),
so the vis box already matches the embed content. Foot gone + lattice fix effective + posts
self-sizing ⇒ card height = settled embed, **no trailing void**.

## 2. The change

**`src/routes/hr/HrExhibitFlow.jsx`**

- **`FbEmbedCard`** — removed the entire `<div className="hr-card-foot">…</div>`: the
  `.hr-card-fb-actions` block (the `⤢ Expand` `<button>` + the `Open on Facebook ↗` `<a>`)
  **and** the `<ContentKindBadge>`. The card now renders only the `.hr-card-video-vis` embed
  box (inside the existing single-child fragment). A comment records why.
- **`onOpenFacebook` removed entirely** — it was the FB-lightbox entry, now orphaned. Dropped
  from `FbEmbedCard`'s params and its `ArtifactCard` call site, and un-threaded through
  `ArtifactCard` → `P3Panel` → root (`setOpenFacebook` no longer passed). No other card type
  used it.
- **FB lightbox state + render removed** — deleted the `openFacebook` `useState` and the
  `{openFacebook && <FacebookOverlay …/>}` render. Replaced with a revive-note comment.
- **`FacebookOverlay` mothballed** — the component is preserved (≈90 lines, yesterday's
  universal-lightbox build 2) for revival, marked `// eslint-disable-next-line no-unused-vars`
  with a MOTHBALLED note, per the repo's mothball convention (cf. Kaleidoscope / AuditStrip).

**`src/routes/hr/HrExhibitFlow.css`**

- Removed the now-dead FB foot rules: `.hr-card-fb-open` (+`:hover`), `.hr-card-fb-actions`,
  `.hr-card-fb-expand`, `.hr-card-fb-expand-icon`, `.hr-card-fb-expand-label`, and the expand
  hover rule. Left short comments in place of each block.
- **Shared `.hr-card-foot` untouched** (used by YT/gallery/album/IG/voice card feet). **Lattice
  line `grid-row-end: span 360` (CSS:171) untouched.** Post vis `min-height: 120px` and the
  per-kind frame heights untouched.

## 3. Why this is FB-only / non-regressing

- The foot markup removed lives **only** in `FbEmbedCard`. The other five card types keep their
  own `.hr-card-foot` (with their own `<ContentKindBadge>`) byte-for-byte.
- `onOpenFacebook` / `openFacebook` / `FacebookOverlay` form a closed FB-only chain; removing it
  touches no other overlay (Gallery/Album/YouTube/Photo all unchanged).
- The removed CSS selectors are FB-prefixed (`.hr-card-fb-*`) and matched only the removed markup.
- No change to `pickSpan` / span variety, `useMasonryRowSpan`, the lattice line, data, or export.

## 4. Verification (sandbox — what could be checked here)

- **Edit integrity:** all edits made host-direct (Edit tool → Windows path, the reliable side;
  the sandbox FUSE view of this 3.1k-line file is the documented truncated cache, ~2588L, so
  whole-file bash lint/`node --check` is non-informative per CLAUDE.md §9 / quirk #1).
  Host-intact re-reads confirm every edited region is structurally balanced: `FbEmbedCard`
  closes its fragment cleanly; the root render block and `P3Panel`/`ArtifactCard` signatures are
  intact.
- **Reference sweep (host-intact):** **0** live references remain to `onOpenFacebook`,
  `openFacebook`, or `setOpenFacebook`; the only `FacebookOverlay` left is the mothballed
  (eslint-disabled) definition + comments. `<ContentKindBadge>` is still rendered by the 6 other
  card feet. CSS sweep: **0** live uses of `.hr-card-fb-actions` / `.hr-card-fb-expand` /
  `.hr-card-fb-open`; the lattice line is present and unchanged.
- **Lint reasoning:** the only dead-code risk (the now-unused `FacebookOverlay`) is suppressed
  with `eslint-disable-next-line no-unused-vars`; all removed identifiers were deleted at every
  site. Expected host baseline unchanged: **4 errors / 6 warnings**.
- **Deferred to host (sandbox can't do reliably):** `npm run lint`, `npm run build`
  (workerd-blocked in sandbox), `npm run deploy`, and the **FB-mounted** incognito live-verify
  (FB embeds render blank to logged-out/automated browsers, so this needs the operator's eyes).
  Commit + push run host-side per CLAUDE.md §2.

## 5. Host runbook (operator / PowerShell)

Run from `C:\AI\Projects\weird-baby-museum`:

```powershell
npm run lint            # expect 4 errors / 6 warnings (baseline; no new)
npm run build           # must pass (vite + rolldown + cloudflare)
npm run deploy          # vite build && wrangler deploy
```

**LIVE-VERIFY — the critical step (incognito; FB iframes MUST actually mount):**
Open an incognito `https://weird.baby/hr`, go to **FORMATS → the artifact deck**, and
**scroll the panel so the FB cards enter the viewport and lazy-mount** (the `IntersectionObserver`
`tileW>0` gate). Wait ~6 s for FB to load and post heights and for the settle sweeps. Then confirm:

- **FB foot gone:** no `⤢ Expand`, no `Open on Facebook ↗` below FB cards.
- **No void:** **no black gap below the embed before the card ends**, after the embed loads and
  settles. Check both a tall (caption-heavy) post and a short one.
- **No overlap:** FB cards don't bleed into the card below.
- **FB content still reachable:** clicking inside the embed (post title / author / timestamp)
  links through to Facebook; Share works in the embed.
- **Unregressed:** YT / gallery / album / IG / coverflow / audio cards unchanged; FORMATS →
  Facebook source-pill count unchanged.

> Why scroll-to-mount matters: a headless/never-scrolled measurement never mounts the FB iframes,
> so it measures the *un-mounted* case and reports 0 voids without testing the failing one. The
> void only exists once the iframe mounts, loads, and posts its settled height. Verify mounted.

**If a residual *within-embed* void remains** (embed itself shorter than its reported height on
some post/video): that is FB's own height handshake over-reporting — separate from card shape,
and the only deeper lever is the FB JS SDK, which the SDK assessment in
`FB_MASONRY_OVERLAP_AND_SDK_DIAGNOSIS-20260601-210604.md` advised against (weight, tracking, CSP,
350px width floor). Flag it as its own item; it is **not** part of this card-shape fix.

**Commit (explicit paths) + push — after live-verify:**

```powershell
if (Test-Path .git\index.lock) { Remove-Item .git\index.lock }
git reset --mixed HEAD
git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css `
        docs/FB_FOOT_REMOVAL_VOID_FIX_RUN_REPORT-20260601-234733.md
git commit -m "fix(hr): remove redundant FB card foot; close trailing void"
git push    # or open a PR per the CLAUDE.md workflow
```

## 6. Out of scope (untouched)

The lattice fix (`grid-row-end: span 360`); span variety (`pickSpan`); `useMasonryRowSpan`;
FB post/video self-sizing (already landed); YT / gallery / album / IG / coverflow / audio;
the FB JS SDK question; MV / export / deploy pipeline. No data change — no `export-artifacts`
needed.
