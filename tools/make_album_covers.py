#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""THE CHARACTER ALBUM COVERS — stand-ins, on the machine covers' own template.

Mike, 2026-09-11: each robot is an album in the /robots carousel; the cover is
the unit's FULL ARTIFACT photograph (the box for 01, the case, the attaché,
the spy kit), never the bare unit, "they all look the same". And, the same
day, ruling A on the stand-ins: the current tray photographs go in as covers
until the colour shoot lands. Forty-two of the forty-nine tray originals were
deleted from the PC before this ran (OneDrive's bin, not Windows'), so what
exists of the box is the black-and-white sample made from it on 09-10. It sits
in the ring on the Everyday's cover; the other three carry the ring empty and
the character's name, and say so in the strapline. Every constant is
`make_unit_covers.py`'s, imported rather than retyped, so the four read as the
same series as the machine covers.

Writes to public/held/robots/art/ — the STAGE hold — because the albums are
not on the glass before Opening Day. `placed()` computes the held address from
the public one the data declares.

    python tools/make_album_covers.py
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import make_unit_covers as U  # noqa: E402  (constants and drawing helpers)
import cover_fences            # noqa: E402
from PIL import Image, ImageDraw  # noqa: E402

REPO = os.path.dirname(HERE)
OUT = os.path.join(REPO, "public", "held", "robots", "art")
BOX_SAMPLE = r"C:\AI\PERSONA-20260903\scans\sample-tray-box.jpg"

ALBUMS = [
    # (word on the cover, output file, badge source or None, strapline)
    ("THE EVERYDAY", "album-everyday-cover.png", BOX_SAMPLE, "THE BOX  ·  STAND-IN UNTIL THE COLOUR SHOOT"),
    ("THE GAMBLER",  "album-gambler-cover.png",  None,       "THE CASE  ·  PHOTOGRAPH TO COME"),
    ("THE CEO",      "album-ceo-cover.png",      None,       "THE ATTACHÉ  ·  PHOTOGRAPH TO COME"),
    ("THE INFORMER", "album-informer-cover.png", None,       "THE SPY KIT  ·  PHOTOGRAPH TO COME"),
]


def build(word, out_name, badge_src, strap):
    if out_name in cover_fences.HAND_AUTHORED:
        raise cover_fences.HandAuthoredCover("REFUSED: %s is hand-authored." % out_name)
    S = U.S
    canvas = Image.new("RGB", (S, S), U.PAPER)
    d = ImageDraw.Draw(canvas)
    inset = round(26 / 600 * S)
    d.rectangle([inset, inset, S - inset - 1, S - inset - 1], outline=U.INK, width=4)
    bx = (S - U.BADGE_D) // 2
    if badge_src and os.path.exists(badge_src):
        # the box, centred square of the sample, greyed by the helper itself
        badge = U.circle_badge(badge_src, 0.5)
        canvas.paste(badge, (bx, U.BADGE_Y), badge)
    d.ellipse([bx, U.BADGE_Y, bx + U.BADGE_D - 1, U.BADGE_Y + U.BADGE_D - 1],
              outline=U.INK, width=U.RING_W)
    U.set_tracked(d, word, U.font("georgia.ttf", round(U.WORD_SZ * 0.78)), U.WORD_Y + 18, U.INK, U.MEASURE)
    d.line([(S * 0.25, U.RULE_Y), (S * 0.75, U.RULE_Y)], fill=U.INK, width=4)
    U.set_tracked(d, strap, U.font("cour.ttf", round(S * 0.026)), U.STRAP_Y, U.DIM, S * 0.80)
    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, out_name)
    canvas.save(out, optimize=True)
    print("wrote %s  (%dx%d, %.1f KB)" % (out, S, S, os.path.getsize(out) / 1024))


def main():
    for row in ALBUMS:
        build(*row)


if __name__ == "__main__":
    cover_fences.run_main(main)
