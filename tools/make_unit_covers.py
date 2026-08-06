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
import math
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
    # [R4 2026-08-05] THE NIAC COVER IS RE-CUT FROM THE CABINET, NOT THE FIGURE.
    # MIKE: "NIAC IS THE MAINFRAME — the gutted-space-heater computer, the
    # helical core, the bar-graph output row. It is so complicated they needed a
    # robot to operate it. The robot is a HUGE EASTER EGG and is not the
    # subject. ALBUM ART AND ALL NIAC IMAGERY SHOW THE MAINFRAME ONLY."
    # The badge was `head_lens.jpg` — the robot's camera-body head, lens lit,
    # square on. It is the best portrait in the set and it is a portrait of the
    # wrong object: it put the easter egg in the disc on the front of the album.
    # `core_helical.jpg` is the blue helical core seen through the cage bars,
    # which is the mainframe's one unmistakable feature. Focal rides HIGH (0.36
    # against the old 0.48) because the plate is 380x820 and a centre square
    # would take the core's foot and the cable rather than the coil.
    # IT ALSO CLOSES M30. The old badge was the same photograph as the still on
    # the face one press below it; the cover and that face now carry different
    # plates, and neither carries the robot.
    # [P7 2026-08-05] AND NOW IT IS THE WHOLE CABINET, WHICH IS A DIFFERENT
    # BADGE TREATMENT AND NOT ONLY A DIFFERENT FILE.
    # MIKE: "NIAC ALBUM ART: capture THE ENTIRE MAINFRAME (the heater) — the
    # whole cabinet in frame, the robot still out of it."
    # `focal = None` MEANS FIT RATHER THAN CROP. Every badge before this one
    # was a square cut out of a photograph and scaled to FILL the disc, which
    # is right for a detail and cannot be right here: the cabinet is 858x1438,
    # so any square crop of it throws away two fifths of the machine — the
    # exact thing the instruction forbids. In fit mode the photograph is scaled
    # whole into the disc's inscribed box and the paper shows in the disc's
    # corners. THE DISC ITSELF DOES NOT MOVE: same diameter, same top, same
    # ring stroke, so the two covers still put the same circle in the same
    # place and the theme claim survives the change.
    # THE PLATE IS NEW AND IT IS THE FIRST PHOTOGRAPH OF THIS MACHINE WHOLE.
    # Cut from the 2021 build video (`IMG_1526.MOV`, 00:58.0, the source the
    # robots repo's own plate set comes from) at the cabinet's own bounding
    # box, 108,142 -> 966,1580 of the rotated 1080x1920 frame. No resample, no
    # retouch; a re-encode, so the source file's GPS tag does not travel.
    # THE ROBOT IS STILL OUT OF FRAME — it is on the same bench and it is not
    # in this shot, so the obfuscation law's real subject is untouched.
    ("MGK-NIAC", "reference/mgk-viii/cabinet_whole.jpg", "mgk-niac-cover.png", None),
    ("MGK-VIIIp", "reference/photos/front_full.png", "mgk-viiip-cover.png", 0.44),
    # [P2 2026-08-05] THE PORTAL IS AN ALBUM NOW AND ALBUMS HAVE COVERS.
    # It is not a unit, so Template A does not govern it — but it is a door into
    # a unit, and a cover built by any other hand would be the one album in the
    # wing that did not share the theme.
    # THE BADGE IS THE APERTURE ITSELF — the round glass on the front of the
    # portable, carrying the machine's own opening beat. `art/viiip.png` is the
    # composite this wing already shows as the ninth plate of the portable's
    # Image Archive: the framebuffer sampled at the labelled beat "the mark
    # lands" and placed into the front-view photograph at the measured portal
    # aperture. Cropped to the glass, it is a lit round door with the machine's
    # own words in it, inside the cover's own ring. Nothing about it is new.
    # TWO OTHER PLATES WERE RENDERED FOR THIS SLOT AND BOTH WERE REJECTED, which
    # is worth writing down because both look right in a file listing:
    #   · `front_screen.png`, the front glass lit — the firmware actually
    #     running. It is the plate OPEN_ACTIONS M2 flags as MIRRORED: the whole
    #     photograph is flipped, so every word on the screen reads backwards. At
    #     badge size that lettering is the only thing in the disc. The flip is
    #     one operation and it is M2, which is Mike's.
    #   · `MGK-TWIN_MONITOR_SCREEN_BEZEL.png`, the frame the Portal is met
    #     through. It is not a photograph of the object at all — it is a
    #     COMPOSITING ASSET, a bezel around a knocked-out white rectangle, which
    #     is exactly what OPEN_ACTIONS M7 says about it. In a disc it reads as a
    #     white square on black.
    ("PORTAL", "art/viiip.png", "portal-cover.png", (570, 365, 1030, 825)),
]


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def circle_badge(src_path, focal):
    """The photograph, greyed, fitted to the ring's inner disc and masked to
    it. Grey rather than colour because the base cover greys the mark and the
    wing's own law is B&W at the glass — a cover that arrives in colour and is
    filtered on the page is two answers to one question.

    `focal` is a number to CROP a square about that band (0.5 is centre, lower
    rides high) and `None` to FIT the whole photograph inside the disc. Crop
    fills the circle and is right for a detail; fit shows the object entire and
    leaves paper in the disc's corners. [P7] The mainframe is the one badge in
    the wing whose instruction is the object whole, so it is the one that
    fits."""
    im = ImageOps.grayscale(Image.open(src_path).convert("RGB")).convert("RGB")

    if focal is None:
        # the largest box of the photograph's own aspect that sits inside a
        # circle of diameter BADGE_D — its four corners land ON the arc, which
        # is the most of the machine the ring can hold and the least paper the
        # disc can show
        r = im.width / im.height
        h = BADGE_D / math.sqrt(1 + r * r)
        w = h * r
        plate = im.resize((round(w), round(h)), Image.LANCZOS)
        im = Image.new("RGB", (BADGE_D, BADGE_D), PAPER)
        im.paste(plate, ((BADGE_D - plate.width) // 2,
                         (BADGE_D - plate.height) // 2))
    elif isinstance(focal, tuple):
        # [P2] an explicit box in SOURCE pixels, for the one badge whose subject
        # is smaller than any band of the plate: a square crop about a focal
        # band can only ever take a full-width slice, and the Portal's subject
        # is a 400px aperture in a 1536px picture of the whole machine.
        im = im.crop(focal).resize((BADGE_D, BADGE_D), Image.LANCZOS)
    else:
        side = min(im.size)
        left = (im.width - side) // 2
        top = max(0, min(im.height - side, round(im.height * focal - side / 2)))
        im = im.crop((left, top, left + side, top + side))
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
