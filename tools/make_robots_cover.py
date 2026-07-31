#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""S10 — the Robots album cover, logo variant.

The shipped WBR cover is a typographic placeholder: the "Weird.Baby" wordmark
over "ROBOTS" over a rule and a strapline. Mike's ruling: duplicate it with
the wordmark replaced by THE WB MARK — the smiling baby in the ring, from the
museum's own assets — and give the variant the far-left position in the deck.

Everything else is held constant on purpose. Same ground, same border, same
"ROBOTS" setting, same rule, same strapline, same square. The ONLY variable is
the wordmark-vs-mark, because that is the comparison Mike asked to see.

The mark carries alpha and a white halo; it is composited onto the paper
ground and its bounding box is trimmed to its own ink first, so the mark's
optical size is set by the mark and not by whatever margin the file happens
to carry.

    python tools/make_robots_cover.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
MARK = os.path.join(REPO, "public", "WeirdBaby_PhotoID.png")
OUT = os.path.join(REPO, "public", "robots", "art", "wbr-cover-logo.png")

S = 1200                      # square master; the deck reads it small
PAPER = (217, 213, 202)       # --wb-bg
INK = (33, 31, 28)            # --wb-gold (photo black)
DIM = (87, 84, 77)            # --wb-gold-lo
FONTS = r"C:\Windows\Fonts"


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def trim_alpha(im, thresh=8):
    """Bounding box of the mark's own ink, ignoring transparent margin."""
    a = im.split()[-1]
    bb = a.point(lambda v: 255 if v > thresh else 0).getbbox()
    return im.crop(bb) if bb else im


def main():
    canvas = Image.new("RGB", (S, S), PAPER)
    d = ImageDraw.Draw(canvas)

    # the house border, at the same inset the SVG placeholder uses (26/600)
    inset = round(26 / 600 * S)
    d.rectangle([inset, inset, S - inset - 1, S - inset - 1], outline=INK, width=4)

    # ---- the mark ------------------------------------------------------
    mark = trim_alpha(Image.open(MARK).convert("RGBA"))
    # greyscale it: the site is print-treated B&W and a cover is not an
    # exception. Keeps the alpha.
    g = mark.convert("L").convert("RGB")
    mark = Image.merge("RGBA", (*g.split(), mark.split()[-1]))

    target_w = round(S * 0.58)
    scale = target_w / mark.width
    mark = mark.resize((target_w, round(mark.height * scale)), Image.LANCZOS)

    mx = (S - mark.width) // 2
    my = round(S * 0.070)
    canvas.paste(mark, (mx, my), mark)

    # ---- ROBOTS --------------------------------------------------------
    f_robots = font("georgia.ttf", round(S * 0.132))
    txt = "ROBOTS"
    # letterspacing to match the placeholder's tracking
    track = round(S * 0.016)
    widths = [d.textlength(c, font=f_robots) for c in txt]
    total = sum(widths) + track * (len(txt) - 1)
    x = (S - total) / 2
    y = my + mark.height + round(S * 0.022)
    for c, w in zip(txt, widths):
        d.text((x, y), c, font=f_robots, fill=INK)
        x += w + track

    # ---- rule ----------------------------------------------------------
    ry = y + round(S * 0.152)
    d.line([(S * 0.25, ry), (S * 0.75, ry)], fill=INK, width=4)

    # ---- strapline -----------------------------------------------------
    f_strap = font("cour.ttf", round(S * 0.0345))
    strap = "PURVEYORS OF THE WEIRD"
    track2 = round(S * 0.010)
    ws = [d.textlength(c, font=f_strap) for c in strap]
    tot2 = sum(ws) + track2 * (len(strap) - 1)
    x2 = (S - tot2) / 2
    y2 = ry + round(S * 0.034)
    for c, w in zip(strap, ws):
        d.text((x2, y2), c, font=f_strap, fill=DIM)
        x2 += w + track2

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    canvas.save(OUT, optimize=True)
    print("wrote %s  (%dx%d, %.1f KB)"
          % (OUT, S, S, os.path.getsize(OUT) / 1024))


if __name__ == "__main__":
    main()
