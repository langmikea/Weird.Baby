# THE BROADCAST LOOK — 1960s colour television captured to film (2026-09-17)

Mike's brief (NEXT-20260917.md, A2, cleaned): *the artifact reels look like
1960s colour television that was captured to film. Grainy, faded, off-tint,
warbly lo-fi music, in the style the story calls for (business, automobiles,
insurance, fun girls, gambling, gaming) or a blend. Fast-turn samples to
review and present.* Sunday question 4 asks: one style per story, or a blend.

Story first. The look is a template; the artifact is the data. Three samples
from the Gambler set of 09-16, one per style, reviewed on a sheet, then the
letter. Nothing here is a posting.

## 1. What an artifact reel is

The wing became an infomercial on 09-10: sell the features, the games, the
artifacts; the story is a prologue for those who want more. An artifact reel
is a fifteen-second spot for one album's kit and papers, cut from the tray
photographs, in the voice of the period the character comes from. It shows
the objects and the album's name. It never shows a Record, the ZIP, the
portal, or the word chapter (the never-advertised law's reading of 09-06
still governs the story; its "never an artifact" clause is superseded for
the kit by the 09-10 reset, which made the artifacts a thing to sell).

## 2. The look, as layers (same except data)

Every sample runs the same stack; a style is one row of settings.

| layer | what it does | the knobs a style sets |
|---|---|---|
| plate | a tray photograph, EXIF-righted, cropped as the shot wants (A3 of 09-17: at least the tray, mostly beyond, down to one element) | the crop per shot |
| motion | the slow push of a product still, or a Live Photo's eleven frames stretched; hard cuts or dissolves | pace, dissolve length |
| grade | the colour the period's stock left behind: warm and brown, or magenta-faded and bright, or cool and flat | the colour chain |
| television | what a colour set did to a picture: chroma bleeding past the edges, a soft horizontal resolution, the raster's lines, the frame breathing (gate weave) and the brightness flickering | bleed, weave, flicker, line strength |
| film | what the kinescope's film added: grain, a vignette, a warm-up at the top of the reel | grain |
| titles | the album's name in the period's type, once over a plate and once on the end card | typeface, case, placement |
| sound | a music bed with wow and flutter, band-limited; **ruled 09-17 (Q2, A): public-domain 78s from the Internet Archive's 78rpm collection, recordings of 1925 or earlier, one a style, logged in `reels/beds.json` with year and source** (the first cut used Mike's own Coconuts demo; his music is not applicable at present) | the record, low-pass, wow depth |
| the pop | first, as ruled 09-12 | none |

## 3. The three styles

| style | the story it serves | grade | television | type | bed |
|---|---|---|---|---|---|
| **the late show** | gambling, gaming | warm, brown, faded, dark; the smoke in the room | heavy bleed, the frame breathes, strong lines | Cooper Black, capitals | pitched down, dull, deep wow |
| **the showroom** | automobiles, fun girls | bright, saturated then faded to magenta; high key | strong bleed and fringing, quick flicker | Brush Script, lower case | bright, light wow |
| **the boardroom** | business, insurance | cool, flat, desaturated; the industrial film | mild bleed, fine lines, steady | Gill Sans, spaced capitals; a title card first | sober, narrow band |

## 4. The beats (fifteen seconds, the Gambler)

| time | beat | the late show | the showroom | the boardroom |
|---|---|---|---|---|
| 0.0 | the pop (prepended by the line) | | | |
| 0.0–0.6 | the set warms up: black to picture, a tear across the first frame | | | |
| 0.6–4.0 | the case, open, slow push | | | title card first, then the case |
| 4.0–6.8 | the chips | | quicker cut | |
| 6.8–9.2 | the coins, close | | | |
| 9.2–11.4 | the dice cup, the hand (Live Photo, stretched) | | | |
| 11.4–13.2 | the book | | | |
| 13.2–15.0 | the end card: the album's name, weird.baby under it, on the tinted black | | | |
| over 1.6–4.0 | the album's name over the first plate | | | (the card carries it) |

## 5. What the samples must show

- The three grades read as three periods at a glance, on the same plates.
- The television layer reads as television (bleed and lines), not as a
  filter on a photograph.
- The film layer reads as film (grain, breathing), and neither layer hides
  the objects.
- The type places each style in its story without a word of copy.
- The bed is unmistakably lo-fi and warbly, a record of the period, and costs nothing.

## 6. Built

`tools/reels-broadcast.py` — three samples into
`OneDrive › WeirdBaby › reels › out › broadcast`, a review strip per sample,
and the served sheet `docs/desk/BROADCAST.html` (the letter). Same engine as
the portfolio's (the pop and the normalise from `tools/reels-build.py`).

## 7. Mike's first reading (09-17, late) and what changed

- **"Showroom is best."** Noted; not yet the Q4 ruling (asked next).
- **"All tray content was shot in landscape, and you are showing it rotated
  90 degrees."** True: the phone tagged every frame of the 09-16 set as
  portrait (EXIF orientation 6) and the tool righted them by the tag. Every
  plate is now righted by the tag and turned back: the rule at the bottom,
  the objects upright, 4032 x 3024. The Live Photo movies are read without
  the tag for the same reason.
- **"The zoom needs improvement; look at the images."** Looked: on the tray
  the objects are small (the case a quarter of it, a bolt a speck). The
  push now goes into the object: **ruling C** (09-17): each shot opens on
  the whole tray as a 4:3 raster inside the tall frame and the push lands
  inside the object in 9:16, eased, one move. The object is found on the
  plate (the tray's extent first, then what is clearly darker or coloured
  inside it, the rule's band out).
- **"It sounds like a portrait reshoot is needed."** On the shot list: the
  kit shot in portrait, tripod, top-down, one object filling the frame,
  for the reels; the landscape tray set stays the album's record.
- **"My music is not readily applicable at the present time. Is there free
  audio to match our dashing gambler?"** Yes. **Question 2, ruled A:**
  public-domain 78s from the Internet Archive (recordings first published
  in 1925 or earlier are public domain in the US as of 2026). The beds:
  The Gold Digger (Missouri Jazz Band, 1923, a fox trot from the Scandals
  of 1923) under the late show; Shake It and Break It (Lanin's Southern
  Serenaders, 1921) under the showroom; Moon River (the Bar Harbor Society
  Orchestra, 1922, a waltz) under the boardroom. Ledger `reels/beds.json`;
  files in OneDrive › WeirdBaby › reels › library › beds. B (Creative
  Commons libraries, a credit line each) and C (the platforms' own sound at
  posting time) were declined; C stays open for the Q&A line.

## 8. Shelved (Mike, 09-17, late; cleaned)

**Question 3, ruled C:** the showroom as the base, one dial per story. Then:
*"The artifact reels need scripting and a reshoot. Zooming in over and over
is not theatre. This can shelf for now until I decide what I am producing.
A 1960s commercial? No, that does not make sense. A modern commercial or
product teaser, probably, but more of a 'WTF is this'. The silver half
dollars and the casino chips are awesome vintage stuff, valuable; the case
is snazzy. I have to write the script. Not a priority."*

So: the look stays as a template (the television and film layers, the
raster push, the 78s in `reels/beds.json`); the samples are a study; the
artifact reels wait for Mike's script and the portrait reshoot; the frame
they will take is a modern product teaser with a "what is this" turn, not a
period commercial. Sunday question 4 is answered by question 3 (C) and is
moot until the script exists. Second cut's one defect, no music coming
through, was the 78 transfers sitting twenty decibels under the pop: the
bed is now brought to reel level first.
