#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""D7 — the Foundation's three album covers.

M62's port gave /foundation albums and a tracklist like every other wing, and
every other wing's albums have covers. These are built on TEMPLATE B, which is
the robots wing's own rule for a cover whose subject is not an object:

    "The house card: the museum's paper ground, a ruled border, the mark, the
     wing's name in the serif, a strapline in tracked caps. Generated, not
     hand-composited. A room is not a machine and does not get photographed
     like one."

THE ONE DEPARTURE IS THE MARK, AND IT IS DELIBERATE. Template B puts the WB
mark on the card. Three albums in one deck each carrying the same photograph of
the same baby is the defect M30 was written about — a cover and the face one
press below it wearing one picture — multiplied by three and sitting side by
side where a visitor sees all of it at once. So the covers are TYPOGRAPHIC: the
album's name in the serif, at the size the robots covers set their model
numbers, over the same rule and the same strapline.

That is also the honest answer for this room specifically. It is the one wing in
the museum that owns no object and holds no photograph — its own hook is a
NUMBER, the $0.00 account card — and a cover borrowing an image from somewhere
else to avoid looking empty is the "empty and honest beats populated and false"
corollary read backwards.

EVERY CONSTANT IS LIFTED FROM make_unit_covers.py, which lifted them from
make_robots_cover.py. Same square, same paper, same 4px border at the same
inset, the same Georgia setting at the same size and tracking, the same rule at
the same drop, the same Courier strapline in the same dim ink. One theme is a
claim about geometry.

[2026-08-26] SUPERSEDED IN PROSE SINCE 2026-08-06; SUPERSEDED IN FACT NOW.
`make_house_covers.py`'s header already says this tool *"is superseded by this
one"*, on Mike's A3 ruling that the robots grey album art is the standard and
every equivalent is replaced. **A tool that is superseded in a docstring and
live in `package.json` is superseded in a docstring only** — `covers:foundation`
would overwrite two of the shipped house sleeves with the MARKLESS typographic
covers the ruling reversed, which is the fade at the carousel's edges that the
ruling was about. The departure this file defends at length was ruled the other
way; the argument is kept, the authority is not.

**AND ITS THIRD OUTPUT WOULD MANUFACTURE AN ORPHAN.** `faq-cover.png` was
culled on 2026-08-09 with its stale `role: shipped` row; `src/` references it
nowhere. Writing it would put the file back with nothing reading it.

    python tools/make_foundation_covers.py  <- refuses; see tools/cover_fences.py
"""
import os

import cover_fences
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
OUT_DIR = os.path.join(REPO, "public", "images", "foundation")

# ---- constants lifted verbatim from make_unit_covers.py ---------------------
S = 1200
PAPER = (217, 213, 202)       # --wb-bg
INK = (33, 31, 28)            # --wb-gold (photo black)
DIM = (87, 84, 77)            # --wb-gold-lo
FONTS = r"C:\Windows\Fonts"

WORD_SZ = round(S * 0.132)
MEASURE = S * 0.760
RULE_LEN = (S * 0.25, S * 0.75)

# The unit covers hang their word off a badge; there is no badge here, so the
# block is centred in the square instead and the rule/strapline keep their own
# spacing off the word. Same three elements, same order, same sizes.
WORD_Y = round(S * 0.430)
RULE_Y = WORD_Y + round(S * 0.152) + 14   # +14, the unit covers' descender clear
STRAP_Y = RULE_Y + round(S * 0.034)

ALBUMS = [
    ("LEDGER", "ledger-cover.png"),
    ("FAQ", "faq-cover.png"),
    ("CONTRIBUTE", "contribute-cover.png"),
]
STRAP = "THE WEIRD.BABY FOUNDATION"


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def set_tracked(d, text, f, y, fill, measure):
    """Centre `text` with the base cover's tracking, tightened only as far as
    the measure demands. CONTRIBUTE is ten glyphs against FAQ's three, so a
    fixed track would run the long one into the border and leave the short one
    marooned; solving per cover is what keeps the three on one centre."""
    widths = [d.textlength(c, font=f) for c in text]
    ink = sum(widths)
    track = round(S * 0.016)
    gaps = len(text) - 1
    if gaps and ink + track * gaps > measure:
        track = max(0, (measure - ink) / gaps)
    total = ink + track * gaps
    x = (S - total) / 2
    for c, w in zip(text, widths):
        d.text((x, y), c, font=f, fill=fill)
        x += w + track


def build(word, out_name):
    canvas = Image.new("RGB", (S, S), PAPER)
    d = ImageDraw.Draw(canvas)

    inset = round(26 / 600 * S)
    d.rectangle([inset, inset, S - inset - 1, S - inset - 1], outline=INK, width=4)

    set_tracked(d, word, font("georgia.ttf", WORD_SZ), WORD_Y, INK, MEASURE)
    d.line([(RULE_LEN[0], RULE_Y), (RULE_LEN[1], RULE_Y)], fill=INK, width=4)
    set_tracked(d, STRAP, font("cour.ttf", round(S * 0.0345)), STRAP_Y, DIM,
                S * 0.66)

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, out_name)
    canvas.save(out, optimize=True)
    print("wrote %s  (%dx%d, %.1f KB)"
          % (out, S, S, os.path.getsize(out) / 1024))


def main():
    # THE FENCE, before a single pixel is rendered. Every row this tool owns
    # was taken by make_house_covers.py, so this raises on every run.
    cover_fences.guard("make_foundation_covers.py", [o for _, o in ALBUMS])

    for word, out_name in ALBUMS:
        build(word, out_name)


if __name__ == "__main__":
    cover_fences.run_main(main)
