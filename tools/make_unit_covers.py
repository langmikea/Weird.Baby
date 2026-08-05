#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A1 — the two machine covers, built on the ROBOTS cover's own template.

MIKE (third revision): "use the ROBOTS art as the base — REPLACE the W.B logo
with an image of the unit, and REPLACE the word ROBOTS with the model number.
Same treatment for both albums so the wing shares one theme."

SO THIS TOOL IS make_robots_cover.py WITH TWO SUBSTITUTIONS AND NOTHING ELSE.
Same square, same paper, same 4px border at the same inset, the same Georgia
setting at the same size and the same tracking, the same rule at the same drop,
the same Courier strapline in the same dim ink. Every constant below is copied
from that file rather than re-chosen, because "one theme" is a claim about
geometry and a hand-matched cover drifts the first time either is re-rendered.

THE TWO SUBSTITUTIONS
  · THE BADGE. The base composites the WB mark — a photograph inside a drawn
    ring — onto the paper. Here the photograph is the UNIT and the ring is drawn
    around it, at the mark's own measured diameter, so the two covers put the
    same disc in the same place.
  · THE WORD. "ROBOTS" becomes the model number, set from the same font at the
    same size, and the tracking is solved per-cover so the word lands on the
    same centre and inside the same measure. Georgia's caps are wide; MGK-VIIIp
    is nine glyphs against six, so a fixed track would have run it into the
    border. The RULE below it does not move.

WHICH PHOTOGRAPH, AND THE ONE THAT IS NOT WHAT MIKE ASKED FOR
  · MGK-VIIIp gets `front_full.png` — the whole unit, square on, already the
    plate the wing shows first. This is exactly "an image of the unit".
  · MGK-VIII gets `head_lens.jpg`, WHICH IS A DETAIL, because this museum holds
    no photograph of that machine whole: its own archive is titled "DETAILS
    ONLY" and its tombstone says "Frame — Withheld: no plate carries the whole
    unit" (V2's metered-revelation ruling, and register rows M8/P4). The head
    square-on is the closest thing in the set to a portrait — a discrete object
    with a lit lens pointed out of the frame — and it keeps the withholding
    intact. IT IS ALSO THE PLATE THIS ALBUM'S OWN FIRST FACE SHOWS, so the deck
    and the panel below it carry the same photograph at once. `head_oblique.jpg`
    was rendered as the alternative for exactly that reason and is the weaker
    cover by a distance: off-centre, unlit, and a dark mass where the base cover
    puts a FACE looking out of the disc, which is the theme the whole series
    inherits. The duplication is the smaller cost and it is a row in
    docs/OPEN_ACTIONS.md rather than a decision taken quietly — which plate goes
    where is Mike's, and swapping the FACE's still to break the repeat would
    have re-argued a choice that face documents in its own note.
    Nothing was generated, extended or composited to make a whole machine
    appear; if Mike wants one there, it is a photograph he brings, and the
    question is a row in docs/OPEN_ACTIONS.md.

THE RULE DROPS 14px BELOW THE BASE COVER'S, ON BOTH. "ROBOTS" has no descender
and the base put the rule where a descender would be. "MGK-VIIIp" has one, and
at the base's drop the p's tail crosses the rule. The drop is applied to BOTH
unit covers rather than to the one that needs it, because the theme is the two
machines standing beside each other; a cover whose furniture moved to
accommodate its own name would be the only one in the deck that did.

    python tools/make_unit_covers.py
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
ART = os.path.join(REPO, "public", "robots", "art")

# ---- constants lifted verbatim from make_robots_cover.py --------------------
S = 1200                      # square master; the deck reads it small
PAPER = (217, 213, 202)       # --wb-bg
INK = (33, 31, 28)            # --wb-gold (photo black)
DIM = (87, 84, 77)            # --wb-gold-lo
FONTS = r"C:\Windows\Fonts"

BADGE_D = round(S * 0.500)    # the WB mark's ring, measured off the base cover
BADGE_Y = round(S * 0.145)    # its top, so the two discs sit on one line
RING_W = round(S * 0.021)     # the base ring's stroke
WORD_Y = round(S * 0.690)     # "ROBOTS"' baseline box on the base cover
WORD_SZ = round(S * 0.132)
RULE_Y = WORD_Y + round(S * 0.152) + 14   # +14: clears MGK-VIIIp's descender
STRAP_Y = RULE_Y + round(S * 0.034)
MEASURE = S * 0.760           # the widest the word may set

UNITS = [
    # (model number, source photograph, output file, focal crop)
    # [Q3 2026-08-05] MGK-VIII -> MGK-NIAC on Mike's ruling: the wing's canon is
    # MGK-VIII = MGK-8 = Magic 8, and NIAC is the name in use. The lettering and
    # the output filename both move; the SOURCE path does not, because the
    # photographs keep living under the folder the robots repo names them in.
    # Eight glyphs against nine, so set_tracked's per-cover solve absorbs it and
    # no constant below changes.
    ("MGK-NIAC", "reference/mgk-viii/head_lens.jpg", "mgk-niac-cover.png", 0.48),
    ("MGK-VIIIp", "reference/photos/front_full.png", "mgk-viiip-cover.png", 0.44),
]


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def circle_badge(src_path, focal):
    """The photograph, greyed, square-cropped about `focal` and masked to the
    ring's inner disc. Grey rather than colour because the base cover greys the
    mark and the wing's own law is B&W at the glass — a cover that arrives in
    colour and is filtered on the page is two answers to one question."""
    im = Image.open(src_path).convert("RGB")
    side = min(im.size)
    # crop a square about the focal band: 0.5 is centre, lower values ride high
    left = (im.width - side) // 2
    top = max(0, min(im.height - side, round(im.height * focal - side / 2)))
    im = im.crop((left, top, left + side, top + side))
    im = ImageOps.grayscale(im).convert("RGB")
    im = im.resize((BADGE_D, BADGE_D), Image.LANCZOS)

    mask = Image.new("L", (BADGE_D * 4, BADGE_D * 4), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, BADGE_D * 4 - 1, BADGE_D * 4 - 1], fill=255)
    im.putalpha(mask.resize((BADGE_D, BADGE_D), Image.LANCZOS))
    return im


def set_tracked(d, text, f, y, fill, measure):
    """Centre `text` with the base cover's tracking, tightened only as far as
    the measure demands. Returns nothing; the rule below it never moves."""
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


def build(model, src_rel, out_name, focal):
    canvas = Image.new("RGB", (S, S), PAPER)
    d = ImageDraw.Draw(canvas)

    inset = round(26 / 600 * S)
    d.rectangle([inset, inset, S - inset - 1, S - inset - 1], outline=INK, width=4)

    badge = circle_badge(os.path.join(ART, "..", src_rel), focal)
    bx = (S - BADGE_D) // 2
    canvas.paste(badge, (bx, BADGE_Y), badge)
    d.ellipse([bx, BADGE_Y, bx + BADGE_D - 1, BADGE_Y + BADGE_D - 1],
              outline=INK, width=RING_W)

    set_tracked(d, model, font("georgia.ttf", WORD_SZ), WORD_Y, INK, MEASURE)

    d.line([(S * 0.25, RULE_Y), (S * 0.75, RULE_Y)], fill=INK, width=4)

    set_tracked(d, "PURVEYORS OF THE WEIRD", font("cour.ttf", round(S * 0.0345)),
                STRAP_Y, DIM, S * 0.66)

    out = os.path.join(ART, out_name)
    canvas.save(out, optimize=True)
    print("wrote %s  (%dx%d, %.1f KB)"
          % (out, S, S, os.path.getsize(out) / 1024))


def main():
    for model, src, out, focal in UNITS:
        build(model, src, out, focal)


if __name__ == "__main__":
    main()
