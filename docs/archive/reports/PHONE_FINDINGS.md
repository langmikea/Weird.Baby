# PHONE FINDINGS — first pass (2026-08-02, MUSEUM FIT ROUND)

Mike's framing, kept: the site is NOT to be optimized for phone yet. This
pass walked every route at 375×812, NAMED the classes of problem, fixed only
the ones with obvious mechanical cures, and banked the rest here for a future
focused session. Honest identification is the deliverable.

## Fixed this round (the mechanical cures)

1. **No feedback on tap** (the complaint that opened the item): tracklist
   rows, trail doors, collage tiles and lobby directory entries now flash on
   `:active` under coarse pointers — the finger is acknowledged the instant
   it lands, before anything else happens.
2. **Invisible selection**: at stacked widths the selected tracklist row was
   a whisper (a background barely distinguishable from paper); it now carries
   the lit gold left rule and a firmer ground.
3. **Invisible state change** (WAL, the worst case): tapping a card row
   changed a region BELOW the fold and read as "nothing happened". The wing
   now scrolls the viewer to the visitor on tap (flat wing, ≤720px only;
   desktop untouched). Verified: the assist fires with the correct target;
   the smooth animation itself cannot run in the dev pane (no compositing)
   and should be confirmed on Mike's real phone glass.

## The classes, identified (NOT fixed — future focused session)

### A. Tap targets under ~30px (every route)
- The title-bar buttons everywhere (`ex-nav-logo` / `ex-nav-return`,
  `booth-nav-*`, `gift-shop__nav-*`) are ~14–17px-tall text buttons.
- WAL/HR variant dropdowns (`tl-typesel`) are ~31px and narrow.
- /wb and /hr player-bar skip buttons and the volume slider are small and
  sit in a crowded 68px bar.
- /hr's filter deck holds ~105 sub-30px pill buttons on one phone page.

### B. Desktop furniture at phone widths
- /hr is a 10,336px-tall page at 375px width with a fixed player bar over
  it — the standing DECK-SCROLL-OCCLUSION applies with less room to spare.
- /robots keeps its staged viewer at phone width; the stage pager buttons
  (`stg-step`) are small, and the instrument panel scales down near its 0.6
  floor — legible but dense.
- Drag furniture (carousel/split handles) is pointer-first and effectively
  decorative on touch; the F3 fit makes the WAL entry state right without
  dragging, but /hr and /wb still assume a mouse.

### C. Density / legibility
- The fact scroller line (1.34rem) wraps long facts to 3+ lines at 375px and
  fades mid-sentence under the F4 two-line budget — acceptable for ambient
  copy, but worth a phone-size type ramp in the focused pass.
- WAL collage tiles run 2-up at ~163px; captions clamp to 2 lines — fine.
  On /shop the doubled tiles run 1-up full-width — fine.

### D. Verified NON-problems (do not re-fix)
- No horizontal overflow on any route at 375px (measured 0 on all seven).
- The lobby, /booth and /shop are naturally phone-shaped already.
- WAL fits one viewport on entry at phone (the F3 fit holds there too).

## Dev-pane caveat (for whoever verifies next)
Programmatic `behavior:"smooth"` scrolling does not animate in the
non-composited preview pane — it silently stays put. This looked exactly
like a broken scroll assist and cost real diagnosis time; it is the pane,
not the site (`scroll-behavior:auto` scrolls fine; real browsers composite).
Banked so the next session does not re-derive it.
