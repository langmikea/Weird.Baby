# THE RHYTHM ROUND — before/after (2026-08-03)

Five frames from the glass lap. Everything is `/wal` on the V2 ground Mike
picked, at 1456×900 desktop and at a genuine 390px viewport (same-origin iframe
harness, the technique this repo standardised at v35).

The two artist-card frames are **the same page, in the same state, whole and
scaled to fit one frame** — the optometrist's own method, so the only variable
is the treatment. Both are Carsie Blanton → "About the Artist", the wing's
most text-per-square-inch surface.

| File | What it is |
|---|---|
| `BEFORE-desktop-artist-card.jpg` | The state at HEAD `9c41643`, reproduced by injecting the old values back at render time — the same throw-away injection the optometrist used. This is "humanly soup": one continuous grey texture from the lead to the footer. |
| `AFTER-desktop-artist-card.jpg` | The same page after R0–R4 and R6. |
| `AFTER-desktop-welcome.jpg` | R5a — "What this room is" is now WELCOME, spelled out to the three-masters doctrine, with the aligned register under it. |
| `AFTER-desktop-poster.jpg` | R5b — "Its place in the museum" is dead; this is the bill for the complete show. |
| `AFTER-390-artist-card.jpg` | The same card at 390px. Zero page-level horizontal scroll; register, record board and poster all stack. |

## What to look at, flipping between the two artist-card frames

1. **The hole under the title is gone.** Before: `.vp-face-head` is 216px tall
   because the plate is, and the text column inside it is 60px — **156px of
   nothing** between the artist's name and the first sentence about her, the
   largest single gap in the document. After: the plate floats and the words set
   beside it.
2. **The sections separate.** Before, the distance between the last line of the
   biography and the first row of the register is **0px** — `.vp-flat` was a
   plain block and supplied no gap at all. After, it is 2.6× the type size, and
   the ladder has four steps (tight / block / section / end) whose ratios are
   legible as ratios.
3. **The section heads exist.** Before they are `--fs-micro` mono at
   `--wb-gold-lo` — the same size, face, weight and ink as a caption. After they
   are Syne 800 at `--fs-small` in full ink, and the page has a top-to-bottom
   order again.
4. **The register lines up.** Before, the value column starts at five different
   x positions on one card. After, one.
5. **The reading face changed.** DM Serif Display → Fraunces at low optical
   size. Same 19.6px, same colour; the difference is entirely the drawing.
6. **The rules came off.** The deck's full-width hairline, the register block's
   and the log sheet's are gone. Space is doing that work now, which is what
   Mike asked for.

The document is **longer** after (3,772px against 3,002px, +26%). That is the
breathing room, bought and paid for, and it is the intended trade.
