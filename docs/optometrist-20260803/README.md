# THE OPTOMETRIST — WAL artist page, five renders (2026-08-03)

**Information, not direction. Nothing here is committed to and nothing here is
in the repo's CSS.** Every variant was injected into the live page at render
time, screenshotted, and thrown away. `git diff` on this round contains none of
them.

Mike's brief (M12): *"produce 3–5 full-page rendered variations of a WAL artist
page exploring the black-behind-TEXT problem (too glaring; black behind PICTURES
reads well — the collage, the Polaroids), palette alternatives, general
elegance."* Plus the note that he *"never flinches at the landing page's left
side; it may legitimately differ from exhibits (lobby vs room)."*

## The page

All five are the same page in the same state, so the only variable is the
treatment: **/wal → Carsie Blanton → "About the Artist"**, at 1440px, rendered
whole and scaled to 0.58 so the card head, the lead, the tombstone and the top
of the records block are all in one frame. That card was chosen because it is
the most text-per-square-inch surface in the wing *and* it carries a picture
(her own site's poster) — so both halves of Mike's sentence are visible in one
shot.

## What each one does

| File | What it changes | The idea it tests |
|---|---|---|
| `V0-as-it-stands.jpg` | nothing | The baseline, for flipping against. W6's warm charcoal stage, cream text on it, edge to edge. |
| `V1-paper-card-on-the-dark-stage.jpg` | the face body takes the museum's print stock and floats on the stage with a real shadow | **The text stops standing on black.** The stage survives as a dark mat around a printed sheet. This is the robots wing's own sheet-on-mat (L5) brought across — so it is a move the building has already made once and liked. |
| `V2-house-lights-up-one-stop.jpg` | the stage ramp lifts from `#211d18` to `#3b352c`, text warms | **Keep the theatre, lose the glare.** The smallest possible change: still light-on-dark, still W6's ruling, one stop less contrast. |
| `V3-ink-on-linen.jpg` | the whole stage becomes paper; the picture keeps its frame ring | **No dark at all in the frame.** The artists' own imagery is then the only dark thing in the room, which is the spotlight doctrine read literally. |
| `V4-split-register.jpg` | V1, plus the plate / collage / recipe blocks get their own dark well inside the sheet | **Mike's sentence built as a rule.** Text on paper, pictures in the dark, alternating down the page — "black behind pictures reads well" as an actual mechanic rather than a coincidence of where the black happens to be. |

## What I noticed while making them, offered as observation only

- **V1 and V4 change the frame's job.** On the dark stage the frame is a room;
  on a paper sheet the frame is a document. That is a bigger decision than a
  palette — it is whether a WAL artist card is a *stage* or a *card*. The
  spotlight doctrine says stage; the collage and the Polaroids say the pictures
  should be the only lit thing. V4 is the only one of the five that lets both be
  true at once.
- **V2 is the cheapest and the least committal.** It is four token values. If
  the complaint is "too glaring" rather than "wrong idea", V2 answers the
  complaint exactly and changes nothing else in the wing.
- **V3 removes the thing W6 was built for.** Worth flipping to anyway, because
  it is the only one that shows what the room looks like with no dark in the
  frame at all — and the answer is that the artist's own poster gets *louder*,
  not quieter.
- **The lobby is untouched in all five** — per Mike's note that the landing
  page's left side is not in question. Nothing here would reach it.

## M4 — the logo, as evidence rather than as a change

Two classification renders of `public/WeirdBaby_PhotoID.png`, included here
because they are the reason M4 was **not** changed:

- `M4-logo-outline-classified-full.png` — the whole wordmark band, every pixel
  classified: **black** = ink (`v < 90`), **white** = flat opaque fill
  (`v > 250`), **pale blue** = transparent, **pink** = anything else (photo,
  antialiasing).
- `M4-logo-outline-classified-Baby.png` — "Baby" at 2× with a generous ink
  threshold (`v < 160`) so soft edges count as ink.

Read together they say the outline stroke is **continuous around every glyph** —
there is no hole in the asset. Where the outline *reads* as missing is where a
letter crosses the black ring behind it, and a black stroke on a black ring is
invisible whether or not it is there. That is a source-artwork decision (a light
halo outside the black stroke, or moving the wordmark clear of the ring), and
there is no layered source in this repository to make it from.

**Separately, and worth knowing regardless:**
`public/WeirdBaby_PhotoID_backup.png` **is corrupt** — libspng cannot decode it
(`pngload: libspng read error`). The only in-repo fallback copy of the logo is
unreadable.
