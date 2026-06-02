================================================================================
  ⛔ DO NOT "FIX" THIS WITHOUT READING — DECISION ON RECORD (2026-06-02) ⛔
================================================================================

  THE "COLUMN 3 FB POST CLIP" IS A KNOWN, DIAGNOSED, DELIBERATELY-ACCEPTED
  COSMETIC DEFECT. IT IS NOT AN OPEN BUG. DO NOT REOPEN IT AS A MYSTERY.

  WHAT IT IS:  A logged-out-only visitor sees the like/comment/share row of the
               ONE longest-caption FB post hang a few px below its white box.
  WHO SEES IT: Logged-out (public) visitors only. Logged-in users never see it.
  IS IT "COLUMN 3"?  NO. Column is incidental and NOT stable (the tall post
               dense-packs to a different column on different loads — observed
               col 3 -> col 4 across reloads). It is "the tallest post,"
               wherever the grid drops it.
  DECISION:    ACCEPTED AS-IS. Bounded, cosmetic, non-compounding. Operator
               accepted the hit for logged-out users on 2026-06-02.

  BEFORE YOU SPEND A DAY ON THIS, KNOW THESE DEAD ENDS (all chased, all wrong):
    ✗ "Settle timing / late FB re-collapse / coalesced ResizeObserver"
        -> that code NEVER RUNS. FB post.php sends NO height message. Dead code.
    ✗ "grid-auto-flow:dense backfill placement artifact"  -> column is random.
    ✗ "Column width"  -> ruled out; all post boxes are identical 280px.
    ✗ "Sub-pixel rounding of round(scale*effH)"  -> needs a posted height; none.
    ✗ "Logged-out adds login chrome that makes it taller"  -> FALSIFIED by
        incognito capture: no login strip; short posts fit, long post doesn't.

  THE ACTUAL CAUSE (confirmed by incognito screenshots 2026-06-02):
    Posts render in a FIXED-height box (overflow:hidden). The box does not
    grow to the post's real content height because the raw post.php iframe
    (no FB JS SDK) never reports its height. The single post with the longest
    caption (multi-line hashtags) is taller than the box, so its footer (the
    like row) is clipped. Short posts fit; the long one doesn't.

  IF YOU MUST ACTUALLY FIX IT (only if content drift makes it worse — see
  "Revisit trigger" at bottom): the ONLY root fix is to let the embed self-size
  (FB JS SDK / XFBML fb-post, which auto-resizes). Raising the fixed height or
  removing overflow:hidden are stopgaps, not fixes. See "Fix options" below.

================================================================================


# FINDING — FB post cards clip the "like line" (the "column 3" bug)

Date opened: 2026-06-02 · Investigated via Claude-in-Chrome on live (weird.baby/hr)
Status: CLOSED — ACCEPTED. Cause confirmed. Not an open defect.

---

## TL;DR (UX-speak)

Facebook posts sit in a fixed-height box. The box doesn't grow to fit a post's
real height, because the embed never tells the page how tall it is. The one post
with the longest caption is taller than the box, so its bottom — the
likes/comments/shares row — gets clipped. Only logged-out (public) visitors see
it; logged-in users (incl. the operator) never did, which is why it looked
intermittent and mysterious. It is NOT a "column 3" problem — column is random
per load. Decision: accept it; it's cosmetic, bounded, and doesn't compound.

---

## Findings (evidence)

1. CONFIRMED LOGGED-OUT, CONTENT-DRIVEN (incognito capture, 2026-06-02). Of
   three posts side by side: the two short-caption posts show their like row
   inside the box (fit); the one long-caption post (two wrapped hashtag lines)
   has its like row hanging below the box on black (clipped). The differentiator
   is caption/content height, nothing else.

2. THE EMBED REPORTS NO HEIGHT. On a fresh live load, a message listener saw
   ZERO postMessages from *.facebook.com over ~9s. All post frames stayed frozen
   at the placeholder height; postedH never left 0. The raw post.php iframe
   (no FB JS SDK) does not postMessage its content height. Consequence: the vis
   box keeps a fixed height, is overflow:hidden, and the masonry settle-watcher /
   postMessage handler / quiescence polling are DEAD CODE — they wait on an event
   that never fires.

3. FIXED BOX + TALLER CONTENT = CLIP. overflow:hidden on the post vis box clips
   any post whose real content exceeds the fixed height. The like row is last,
   so it's what's lost.

4. COLUMN IS INCIDENTAL AND NOT STABLE. Across two loads the post cards
   dense-packed to columns [2,2,2,3] then [2,2,4,2] — the tall post moved
   col 3 -> col 4. "Column 3 always clips" cannot be a column property.

5. LOGGED-OUT IS NOT TALLER VIA LOGIN CHROME. Incognito showed no
   "see more on Facebook" / login strip; logged-out short posts render the same
   height as logged-in and do NOT clip. (This falsified an earlier theory; left
   here so no one re-proposes it.)

---

## Decision (on record)

ACCEPTED AS-IS on 2026-06-02 by operator.
Rationale: bounded, cosmetic, logged-out-only, non-compounding (see Risk).
This is a deliberate trade, not an unresolved bug.

## Risk assessment — does it compound?

NO. It is static, bounded, and cosmetic:
  - does not cascade or break neighboring cards (masonry measures the box, not
    the overflow);
  - does not worsen over time on its own;
  - does not affect logged-in users, data, the guestbook, or other card types;
  - worst case is exactly what's observed: one post's like row half-hidden for
    logged-out visitors.

ONE NON-COMPOUNDING DRIFT to watch: WHICH posts clip depends on caption length
and post order. Longer future captions, or an export reordering posts, can make
MORE posts clip. The defect doesn't compound, but its frequency isn't fixed.

## Revisit trigger

Reopen ONLY if: more than the single longest post begins clipping (i.e. content
drift has spread it), OR a logged-out stakeholder flags it as not-acceptable.
Until then: leave it. Do not re-investigate as an unknown — the cause is above.

---

## Fix options (only relevant if the revisit trigger fires)

OPTION 1 — Native auto-height (the only ROOT fix; matches rule #1).
  Replace the mute raw post.php iframe with Facebook's official self-resizing
  embed (FB JS SDK / XFBML fb-post, or the SDK resize callback). The SDK sizes
  the embed to its own content, logged-in AND logged-out, so the box always
  matches. Also lets you delete the dead postMessage handler, settle/quiescence
  watcher, and POST_LOADING_H. Trade-off: adds the FB SDK async script; rework
  the masonry hook to read the SDK-sized height. Edit touches the ~3100-line
  HrExhibitFlow.jsx -> HOST-SIDE ONLY (rule #4; no Cowork read-modify-write).

OPTION 2 — Raise the fixed post box height (stopgap, fragile).
  Bump the post placeholder/fallback so the tallest current post clears the clip.
  Letterboxes short posts; the next longer post re-breaks it. Not a fix.

OPTION 3 — Remove overflow:hidden on the post vis box (do NOT do alone).
  A too-tall post then overlaps neighbors (masonry measured the box, not the
  content). Only viable combined with a real height source (Option 1).

---

## Investigation caveat (for completeness)

The live clip was reproduced via the operator's incognito screenshots, not by
automated instrumentation: Claude-in-Chrome ran on the logged-in profile and
could not attach to incognito; server fetch of post.php returned 400; in-page
fetch was blocked by CORS. The cause (Findings 1–5) is supported by the
incognito captures and the on-page zero-message measurement.
