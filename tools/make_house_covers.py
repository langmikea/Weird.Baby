#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A3 — every album carrying Weird.Baby's OWN art, on the robots gray template.

MIKE, A3: "THE ROBOTS GRAY ALBUM ART IS THE STANDARD — its size, spacing, and
the fact that it does NOT fade into the background at the carousel's edges. Make
it the Weird.Baby gray album standard and replace every equivalent: Foundation,
Weird.Baby Music, and anywhere else carrying Weird.Baby's own art."

THE THIRD CLAUSE IS THE DIAGNOSIS AND IT IS EXACT. The covers this replaces are
TYPOGRAPHIC on the museum's paper — and the museum's paper is `--wb-bg`, which is
also the carousel's own ground. A cover whose field is the page's field has
nothing to show but its keyline, so at ring 2 and beyond, tilted and hazed, there
is no card there at all; measured on /foundation, FAQ and CONTRIBUTE read as
outlines floating on the page. The robots cover does not do that because THE MARK
fills it with ink. That is the whole of the difference, and it is why the answer
is the mark rather than a darker paper: darkening the ground would fix the fade
and lose the theme, and the theme is what he asked for.

IT REVERSES `make_foundation_covers.py`'s ONE DEPARTURE, IN THE OPEN. That tool
put no mark on its three covers, and gave its reason: "Three albums in one deck
each carrying the same photograph of the same baby is the defect M30 was written
about … multiplied by three and sitting side by side." The reasoning was sound
and the result is the thing Mike is looking at. His ruling settles it the other
way — a house sleeve is SUPPOSED to repeat; that is what makes it a house sleeve
— so the departure is undone rather than defended, and that tool is superseded by
this one.

EVERY CONSTANT IS LIFTED FROM make_robots_cover.py, and the proof that it is
lifted rather than matched by hand is in this file: `--verify` re-renders the
ROBOTS cover through this tool's own layout and compares it pixel for pixel with
the shipped `wbr-cover-logo.png`. If the geometry has drifted by one pixel the
check fails. "One theme" is a claim about geometry and a hand-matched cover
drifts the first time either is re-rendered.

THE ONE THING THIS TOOL DOES THAT ITS ANCESTOR CANNOT: a word too long for one
line. "ROBOTS" is six glyphs; "ABOUT THE ARTIST" is sixteen, and Georgia caps at
0.132S cannot be tracked down far enough to fit. So a long name WRAPS, and the
extra line is taken out of THE MARK rather than out of the rule's drop — the
rule, the strapline and the border stay exactly where the template puts them,
which is the part a visitor reads as "the same cover". The house's own printed
card on /wal already wraps its name across three lines, so wrapping is the
building's own handling of a long album name and not a new idea.

    python tools/make_house_covers.py [--verify] [--dry-run]
"""
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
MARK = os.path.join(REPO, "public", "WeirdBaby_PhotoID.png")

# ---- constants lifted verbatim from make_robots_cover.py --------------------
S = 1200                      # square master; the deck reads it small
PAPER = (217, 213, 202)       # --wb-bg
INK = (33, 31, 28)            # --wb-gold (photo black)
DIM = (87, 84, 77)            # --wb-gold-lo
FONTS = r"C:\Windows\Fonts"

MARK_W = 0.58                 # of S
MARK_Y = 0.070                # of S
WORD_SZ = 0.132               # of S
WORD_TRACK = 0.016            # of S
WORD_GAP = 0.022              # of S, mark bottom -> word top
RULE_DROP = 0.152             # of S, word top -> rule
RULE_LEN = (0.25, 0.75)       # of S
STRAP_SZ = 0.0345             # of S
STRAP_TRACK = 0.010           # of S
STRAP_DROP = 0.034            # of S, rule -> strapline
MEASURE = 0.760               # of S — the widest a set word may run
# The strapline's own measure. make_robots_cover.py sets NO measure and simply
# centres; make_foundation_covers.py capped it at 0.66S for a 25-glyph line and
# in doing so tightened the 22-glyph robots line it had copied. 0.80S is inside
# the border with room and does not bind on either — which is what `--verify`
# checks, and it is the line that was failing it.
STRAP_MEASURE = 0.800         # of S
BORDER_INSET = 26 / 600       # of S


# ═══ THE ALBUMS ══════════════════════════════════════════════════════════════
# One row per album carrying Weird.Baby's own art. The WORD is the album's own
# name and the STRAPLINE is its wing's — which is `make_foundation_covers.py`'s
# convention, and the more general of the two the tree had (the robots cover's
# strapline is its wing's motto, which only works when the album IS the wing).
# Nothing here is authored: every string is a name already on the glass.
COVERS = [
    # /foundation — the three albums of the F4 restructure
    (["THE", "FOUNDATION"], "THE WEIRD.BABY FOUNDATION",
     "public/images/foundation/foundation-cover.png"),
    (["THE LEDGER"], "THE WEIRD.BABY FOUNDATION",
     "public/images/foundation/ledger-cover.png"),
    (["CONTRIBUTE"], "THE WEIRD.BABY FOUNDATION",
     "public/images/foundation/contribute-cover.png"),
    # /wb — Weird.Baby Music
    (["ABOUT THE", "ARTIST"], "WEIRD.BABY MUSIC",
     "public/images/wb/about-cover.png"),
    (["THE MAKING", "OF BOWB V1"], "WEIRD.BABY MUSIC",
     "public/images/wb/vol1-cover.png"),
    # /wal — the house's own printed card, on a wing of guests
    (["WORTH", "A LISTEN"], "WEIRD.BABY",
     "public/images/wal/worth-a-listen-cover.png"),
]


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def trim_alpha(im, thresh=8):
    """Bounding box of the mark's own ink, ignoring transparent margin."""
    a = im.split()[-1]
    bb = a.point(lambda v: 255 if v > thresh else 0).getbbox()
    return im.crop(bb) if bb else im


def set_tracked(d, text, f, y, fill, measure, track):
    """Centre `text` at `track`, tightened only as far as the measure demands.
    Lifted from make_foundation_covers.py — CONTRIBUTE is ten glyphs against
    ROBOTS' six, so a fixed track runs the long one into the border."""
    widths = [d.textlength(c, font=f) for c in text]
    ink = sum(widths)
    gaps = len(text) - 1
    if gaps and ink + track * gaps > measure:
        track = max(0, (measure - ink) / gaps)
    total = ink + track * gaps
    x = (S - total) / 2
    for c, w in zip(text, widths):
        d.text((x, y), c, font=f, fill=fill)
        x += w + track


def build(lines, strap, mark_path=MARK):
    """The robots cover's layout, with the mark paying for any extra word line.

    For a ONE-LINE word this is make_robots_cover.py's arithmetic unchanged —
    which is what `--verify` proves. For a two-line word the mark is scaled down
    by exactly one line's height, so the word block still ends where a one-line
    word's does and the rule, strapline and border do not move."""
    canvas = Image.new("RGB", (S, S), PAPER)
    d = ImageDraw.Draw(canvas)

    inset = round(BORDER_INSET * S)
    d.rectangle([inset, inset, S - inset - 1, S - inset - 1], outline=INK, width=4)

    # ---- the mark ------------------------------------------------------
    mark = trim_alpha(Image.open(mark_path).convert("RGBA"))
    # greyscale it: the site is print-treated B&W and a cover is not an
    # exception. Keeps the alpha.
    g = mark.convert("L").convert("RGB")
    mark = Image.merge("RGBA", (*g.split(), mark.split()[-1]))

    target_w = round(S * MARK_W)
    scale = target_w / mark.width
    mark_h = round(mark.height * scale)

    # the extra lines come out of the mark, on both axes so it does not stretch
    line_h = round(S * RULE_DROP)
    extra = line_h * (len(lines) - 1)
    if extra:
        mark_h = max(1, mark_h - extra)
        target_w = max(1, round(mark.width * (mark_h / mark.height)))
    mark = mark.resize((target_w, mark_h), Image.LANCZOS)

    mx = (S - mark.width) // 2
    my = round(S * MARK_Y)
    canvas.paste(mark, (mx, my), mark)

    # ---- the word ------------------------------------------------------
    f_word = font("georgia.ttf", round(S * WORD_SZ))
    y = my + mark.height + round(S * WORD_GAP)
    for line in lines:
        set_tracked(d, line, f_word, y, INK, S * MEASURE, round(S * WORD_TRACK))
        y += line_h

    # ---- rule ----------------------------------------------------------
    ry = y - line_h + round(S * RULE_DROP)
    d.line([(S * RULE_LEN[0], ry), (S * RULE_LEN[1], ry)], fill=INK, width=4)

    # ---- strapline -----------------------------------------------------
    f_strap = font("cour.ttf", round(S * STRAP_SZ))
    set_tracked(d, strap, f_strap, ry + round(S * STRAP_DROP), DIM,
                S * STRAP_MEASURE, round(S * STRAP_TRACK))
    return canvas


def verify():
    """Re-render the ROBOTS cover through this tool and compare it with the one
    on disk. A single differing pixel is a drift in the template."""
    shipped = os.path.join(REPO, "public", "robots", "art", "wbr-cover-logo.png")
    want = Image.open(shipped).convert("RGB")
    got = build(["ROBOTS"], "PURVEYORS OF THE WEIRD")
    if want.size != got.size:
        print("FAIL  size %s != %s" % (want.size, got.size))
        return 1
    bbox = ImageChops.difference(want, got).getbbox()
    if bbox is not None:
        print("FAIL  pixels differ inside %s" % (bbox,))
        return 1
    print("OK    the template reproduces wbr-cover-logo.png exactly")
    return 0


def main():
    if "--verify" in sys.argv:
        sys.exit(verify())
    dry = "--dry-run" in sys.argv
    for lines, strap, rel in COVERS:
        out = os.path.join(REPO, *rel.split("/"))
        if dry:
            print("would write %s  (%s)" % (out, " / ".join(lines)))
            continue
        os.makedirs(os.path.dirname(out), exist_ok=True)
        build(lines, strap).save(out, optimize=True)
        print("wrote %s  (%dx%d, %.1f KB)"
              % (out, S, S, os.path.getsize(out) / 1024))


if __name__ == "__main__":
    main()
