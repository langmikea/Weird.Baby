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
  · THE BADGE. The base composites the WB mark onto the paper.
    [D5 2026-08-06] AND THE MARK IS NOW BEING COPIED PROPERLY, WHICH IT WAS NOT.
    MIKE: "let the unit spill out of the oval, the way the Weird.Baby logo does."
    Look at the mark and the difference is the whole composition: the ring is
    BEHIND the baby, and the head comes out of the top of it and the hands out of
    the bottom. Every unit badge until now was masked INTO the disc — a porthole
    with a machine inside it, which is the opposite arrangement wearing the same
    circle. So the ring is drawn FIRST and the unit stands over it, at the mark's
    own measured diameter and in the mark's own place. The disc did not move; the
    order did.
  · THE WORD. "ROBOTS" becomes the model number, set from the same font at the
    same size, and the tracking is solved per-cover so the word lands on the
    same centre and inside the same measure. Georgia's caps are wide; MGK-VIIIp
    is nine glyphs against six, so a fixed track would have run it into the
    border. The RULE below it does not move.

WHICH PHOTOGRAPH — and the two treatments, which are named in the UNITS table
  · MGK-VIIIp gets `front_full.png` — the whole unit, square on, already the
    plate the wing shows first. It is cut out of its counter and stands on the
    paper as its own silhouette.
  · MGK-NIAC gets `cabinet_whole.jpg` — the whole cabinet, and it rides over the
    ring AS A PLATE. Its frame is cropped to the machine's own bounding box, so
    there is no background in it to remove; three mattes were rendered and each
    one damaged the object. The instruction's other half — the ENTIRE mainframe —
    is what rules out the composition that would have cut cleanest.

HISTORICAL, AND THE PLATES IT EXPLAINS NO LONGER EXIST:
  [K1 2026-08-07] Mike killed `head_lens.jpg` and `head_oblique.jpg` with the
  other eight operator plates — *"none are very good, and if that view is ever
  needed it gets reshot."* The paragraph below is kept because it records WHY
  the badge moved off a portrait of the robot, which is R4's canon and is still
  load-bearing; it is no longer a recipe. Neither file is on disk, so nothing
  here can be re-rendered from it, and the alternative it names is gone too.
  · MGK-VIII once got `head_lens.jpg`, WHICH IS A DETAIL, because this museum held
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

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
ART = os.path.join(REPO, "public", "robots", "art")

# ═══ [2026-08-10] THE FOUR WING COVERS ARE HAND-AUTHORED. THIS TOOL IS FENCED.
#
# MIKE'S RULING, 2026-08-10: "all four wing covers are now hand-authored.
# make_unit_covers.py is retired for these paths."
#
# THE TOOL IS NOT DELETED, ON THE SAME RULING. Everything below it — the
# geometry lifted from make_robots_cover.py, the silhouette cut, the spill, the
# per-cover tracking solve — is the record of how the series was built and is
# the only written form of it. What is retired is its AUTHORITY over these four
# files, not its account of them.
#
# IT REFUSES RATHER THAN SKIPS, AND THAT IS THE WHOLE POINT OF THE FENCE. A skip
# prints a line nobody reads and exits 0, so a run looks like it worked and the
# hand-authored art is still on disk by luck. A raise stops the run and names
# the ruling, so the next person to reach for this tool finds out WHY before
# they find out THAT.
#
# `wbr-cover-logo.png` is in the list and is not in UNITS — it is
# make_robots_cover.py's output. It is fenced here anyway because the ruling
# names four covers, and a fence that only lists what a tool happens to write
# today stops being a fence the first time somebody adds a row to UNITS.
#
# ═══ [2026-08-26] THE SET MOVED TO `tools/cover_fences.py`; NOTHING ELSE DID.
#
# The paragraph directly above is the argument for the move, read one step
# further out: a fence that only guards the tool it happens to live in stops
# being a fence the first time somebody reaches for a DIFFERENT tool — and on
# 2026-08-26 that was already true of three of them. `make_robots_cover.py`,
# `make_template_covers.py` and `make_foundation_covers.py` write these exact
# paths and had no fence at all; `make_house_covers.py` would have destroyed a
# fifth file, `vol1-cover.png`, that was not hand-authored when this list was
# written and became so two days later.
#
# WHAT THIS FILE REFUSES IS UNCHANGED, AND HOW IT READS IS NOT. The same four
# names refuse, at the same point in `build()`, with the same ruling in the
# message, and `vol1-cover.png` joins the set without reaching anything this
# tool writes. Two things did change and are named rather than absorbed:
# `run_main()` prints the refusal instead of a nine-line traceback, and the
# exit code — which was already 1 — is now 1 by construction rather than by
# an uncaught exception. What is bigger is that the other four tools now
# refuse these names too, off this same set.
import cover_fences
from cover_fences import HAND_AUTHORED, HandAuthoredCover  # noqa: F401

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

# [D5 2026-08-06] THE SPILL. Mike: "let the unit spill out of the oval, the way
# the Weird.Baby logo does." The mark it names does exactly one thing: the ring
# is DRAWN FIRST and the subject sits OVER it, bigger than the disc, so the ring
# reads as two arcs behind a machine rather than as a porthole with a machine
# inside. Every badge before this one was masked INTO the disc, which is the
# opposite composition.
# THE TWO NUMBERS ARE SET BY THE WORD, NOT BY TASTE. `SPILL_FOOT` is where the
# unit's bottom lands, 28px clear of the model number's own box at WORD_Y — the
# lettering is the one thing on this cover that may not be crossed, because it
# is what tells the two machines apart. `SPILL_K` is then the largest height
# that still leaves the ring visible above the unit's shoulder. Together they
# put the unit through the top of the ring and a little past its foot, which is
# where the baby's head and hands sit on the mark.
# NOTHING ELSE MOVED. Same square, same paper, same border, same ring at the
# same diameter and the same top, same setting, same rule, same strapline. The
# theme claim is a claim about geometry and the geometry is untouched.
SPILL_K = 1.25                # the unit's height, as a multiple of the disc
SPILL_FOOT = WORD_Y - 28      # where its bottom edge lands

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
    # [D5 2026-08-06] THE MAINFRAME IS A PLATE, NOT A CUT-OUT, AND THE REASON IS
    # THE SOURCE. Mike's spill instruction wants the machine's own silhouette over
    # the ring; that needs the object separated from its room, and this frame has
    # no room in it to separate — P7 cut it AT THE CABINET'S OWN BOUNDING BOX, so
    # every edge of the file is already machine. Three mattes were rendered and
    # all three damaged the object: a luminance cut ate half the cabinet (the
    # grille and the wall are the same tone), a chroma cut took the red output row
    # with the wooden floor, and a per-column floor-line cut clipped the LED bank
    # and left the mains adapter hanging. So the whole plate rides over the ring
    # as a plate. IT IS STILL THE ENTIRE MAINFRAME, which is the half of the
    # instruction a crop would have broken: cropping to the cabinet body above the
    # feet composes better and throws the feet away, and "the entire mainframe" is
    # not a thing Ops gets to trade for a nicer edge. A true cut-out here wants a
    # frame with air around the machine — one photograph, and it is Mike's.
    ("MGK-NIAC", "reference/mgk-viii/cabinet_whole.jpg", "mgk-niac-cover.png", None),
    # [D5] the portable IS separable — a hard-edged dark body on a light counter —
    # so it gets a real photographic silhouette. `70` is the luminance below which
    # a pixel is the machine: the cast shadow on the counter bottoms out at 66, so
    # the cut takes the object and leaves the shadow, and the bright ABEAL plate
    # comes back as a filled hole rather than as a threshold exception.
    ("MGK-VIIIp", "reference/photos/front_full.png", "mgk-viiip-cover.png", 70),
    # ═══ [2026-08-10] THE PORTAL COVER IS HAND-AUTHORED AND THIS RULE IS DEAD.
    # MIKE'S RULING: the four wing covers were made by Mikey, UX has passed
    # them, and this tool is retired for those paths. THE COVER IS NOT DERIVED
    # FROM `art/viiip.png` AND NOTHING IS DERIVED FROM ANYTHING — each of the
    # four is its own picture, and THEY MAY DIFFER FROM ONE ANOTHER. That is
    # the substantive change, not a bookkeeping one: everything in this file
    # below the fence exists to stop the four drifting apart, because "one
    # theme" was a claim about shared geometry. A hand may now do what it likes
    # with any one of them, and no constant here has a vote.
    # THE PASSAGE THIS REPLACES CLAIMED THE BADGE WAS A CROP OF `art/viiip.png`
    # at (570, 365, 1030, 825) — the aperture with the machine's opening beat
    # in it. That was true of the generated cover and is false of Mikey's. The
    # same claim was on the Portal's provenance row and in `portal.js`, and all
    # three were struck together; the crop box is kept, commented, on the rule
    # below, because a retired recipe is worth more written down than deleted.
    # THE TWO REJECTED PLATES BELOW ARE KEPT AND ARE STILL WORTH READING: they
    # record two live defects in the plate set (M2's mirrored photograph, M7's
    # compositing asset), which is a finding about the ARCHIVE and does not
    # expire with the recipe that found it.
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
    # [2026-08-10] COMMENTED OUT, NOT DELETED — the recipe is the record of how
    # the generated Portal cover was made, and the fence above would refuse it
    # anyway. Restoring this line does not restore the tool's authority.
    # ("PORTAL", "art/viiip.png", "portal-cover.png", (570, 365, 1030, 825)),
]


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def circle_badge(src_path, focal):
    """The photograph, greyed, fitted to the ring's inner disc and masked to
    it. Grey rather than colour because the base cover greys the mark and the
    wing's own law is B&W at the glass — a cover that arrives in colour and is
    filtered on the page is two answers to one question.

    [D5 2026-08-06] THIS IS NOW THE PORTAL'S TREATMENT AND NOTHING ELSE'S. The
    two MACHINES spill over the ring (see `spilled_unit`); the Portal is not a
    machine, it is a door into one, and its badge's whole subject is a round lit
    aperture — a round thing masked to a round hole is the composition, not a
    compromise with one. `focal` is a tuple here, an explicit box in source
    pixels, for the one badge whose subject is smaller than any band of its
    plate: a square crop about a focal band can only ever take a full-width
    slice, and the Portal's subject is a 400px aperture in a 1536px picture of
    the whole machine."""
    im = ImageOps.grayscale(Image.open(src_path).convert("RGB")).convert("RGB")

    if isinstance(focal, tuple):
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


def silhouette(im, thresh):
    """The machine's own outline, as alpha. `thresh` is the luminance below
    which a pixel is the object.

    IT IS A SEQUENCE OF FOUR OPERATIONS AND EACH ONE IS DOING A NAMED JOB, so
    that a future edit knows what it is deleting:
      CLOSE      welds the grille, the knurling and the strap catches into one
                 body instead of leaving a fringe of specks around the edge.
      FILL       returns the bright ABEAL plate, the lit glass and the lens
                 rings — every one of them is an interior HOLE in a dark body,
                 which is why one threshold can hold a machine whose front is
                 the lightest thing in the frame.
      LARGEST    drops whatever else in the room happens to be dark.
      OPEN       severs the cast shadow where it touches the base. The shadow
                 bottoms out at 66 against a 205 counter, so it survives the
                 threshold; it is a soft wide region and does not survive an
                 erosion the hard-edged body walks through.
    The 1.6px blur at the end is the antialiased edge. Without it the cut reads
    as a sticker, which is the exact failure the museum objects to in a
    composite."""
    g = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(2)),
                   dtype=np.float32)
    m = ndimage.binary_closing(g < thresh, np.ones((13, 13)))
    m = ndimage.binary_fill_holes(m)
    lab, n = ndimage.label(m)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = lab == (int(np.argmax(sizes)) + 1)
    m = ndimage.binary_fill_holes(ndimage.binary_opening(m, np.ones((9, 9))))
    a = (ndimage.gaussian_filter(m.astype(np.float32), 1.6) * 255)
    ys, xs = np.where(m)
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8)), box


def spilled_unit(src_path, thresh):
    """The unit, greyed, at spill size, on transparency. `thresh` cuts the
    object out of its background; `None` keeps the plate whole — see the UNITS
    table for which machine takes which and why."""
    src = Image.open(src_path).convert("RGB")
    sub = ImageOps.grayscale(src).convert("RGBA")
    if thresh is not None:
        alpha, box = silhouette(src, thresh)
        sub.putalpha(alpha)
        sub = sub.crop(box)          # the unit's own bounds, not the frame's
    h = round(BADGE_D * SPILL_K)
    return sub.resize((round(sub.width * h / sub.height), h), Image.LANCZOS)


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
    # The fence, before a single pixel is rendered — see HAND_AUTHORED above.
    if out_name in HAND_AUTHORED:
        raise HandAuthoredCover(
            "REFUSED: %s is hand-authored and this tool may not write it.\n"
            "  Mike's ruling, 2026-08-10: \"all four wing covers are now "
            "hand-authored.\n"
            "  make_unit_covers.py is retired for these paths.\"\n"
            "  Fenced: %s\n"
            "  Nothing was written. If a cover genuinely needs re-generating, "
            "that is a\n"
            "  ruling to get first, not a line to delete."
            # ASCII separator deliberately: this message is read in a Windows
            # console at cp1252, where a middot prints as `?`.
            % (out_name, ", ".join(sorted(HAND_AUTHORED))))

    canvas = Image.new("RGB", (S, S), PAPER)
    d = ImageDraw.Draw(canvas)

    inset = round(26 / 600 * S)
    d.rectangle([inset, inset, S - inset - 1, S - inset - 1], outline=INK, width=4)

    src = os.path.join(ART, "..", src_rel)
    bx = (S - BADGE_D) // 2
    if isinstance(focal, tuple):
        # the Portal: the photograph goes INSIDE the disc and the ring is drawn
        # around it, which is the treatment every badge in this wing had until D5
        badge = circle_badge(src, focal)
        canvas.paste(badge, (bx, BADGE_Y), badge)
        d.ellipse([bx, BADGE_Y, bx + BADGE_D - 1, BADGE_Y + BADGE_D - 1],
                  outline=INK, width=RING_W)
    else:
        # [D5] a MACHINE: the ring goes down first and the unit stands over it
        d.ellipse([bx, BADGE_Y, bx + BADGE_D - 1, BADGE_Y + BADGE_D - 1],
                  outline=INK, width=RING_W)
        unit = spilled_unit(src, focal)
        canvas.paste(unit, ((S - unit.width) // 2, SPILL_FOOT - unit.height), unit)

    set_tracked(d, model, font("georgia.ttf", WORD_SZ), WORD_Y, INK, MEASURE)

    d.line([(S * 0.25, RULE_Y), (S * 0.75, RULE_Y)], fill=INK, width=4)

    # [R6 2026-08-06] THE SUB-LINE IS THE WING, NOT THE STRAPLINE. MIKE:
    # "'Purveyors of the Weird' belongs ONLY on the first album, where it
    # literally applies. Every other album in the wing reads 'Weird.Baby
    # Robots' as its sub-line."
    # HE IS DESCRIBING A CATEGORY ERROR, not a preference. The strapline is the
    # HOUSE's line about itself, and the base cover it was lifted from IS the
    # house — the front desk, first in the deck, where "purveyors of the weird"
    # is a claim its own album is making. Copied onto a photograph of a 1965
    # mainframe it stops being a claim and becomes a caption, and it captions
    # the machine as the weird thing purveyed. Three covers were saying it.
    # THE REPLACEMENT IS WHAT A SUB-LINE ON AN ALBUM IS FOR: whose wing this is.
    # Same font, same size, same tracking solve, same ink, same baseline — the
    # geometry claim this whole file rests on is untouched, one string moved.
    set_tracked(d, "WEIRD.BABY ROBOTS", font("cour.ttf", round(S * 0.0345)),
                STRAP_Y, DIM, S * 0.66)

    out = os.path.join(ART, out_name)
    canvas.save(out, optimize=True)
    print("wrote %s  (%dx%d, %.1f KB)"
          % (out, S, S, os.path.getsize(out) / 1024))


def main():
    for model, src, out, focal in UNITS:
        build(model, src, out, focal)


if __name__ == "__main__":
    cover_fences.run_main(main)
