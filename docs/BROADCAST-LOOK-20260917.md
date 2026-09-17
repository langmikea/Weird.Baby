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
| sound | a music bed with wow and flutter, band-limited, hiss under it; the sample beds are Mike's own June demo of Coconuts, treated (original audio pays; a period library is a licensing question, not a look question) | pitch, low-pass, wow depth |
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
- The bed is unmistakably lo-fi and warbly, and it is his own song.

## 6. Built

`tools/reels-broadcast.py` — three samples into
`OneDrive › WeirdBaby › reels › out › broadcast`, a review strip per sample,
and the served sheet `docs/desk/BROADCAST.html` (the letter). Same engine as
the portfolio's (the pop and the normalise from `tools/reels-build.py`).
