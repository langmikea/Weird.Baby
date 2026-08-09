#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""L6 2026-08-09 — the two machine covers, drawn on MIKE'S OWN BLANK TEMPLATE.

MIKE: "USE THE TEMPLATE for the remaining robot covers, NIAC and VIIIp. FINISH
DRAWING THE ROUND SHAPE - close the broken circle in the same weight and
character - then add the TITLE, the RULE and the SUBTITLE in exactly the
positions the Robots cover uses. DO NOT ADD A PHOTOGRAPH. Measure the Robots
cover's type, sizes and spacing from the file rather than eyeballing them."

═══ EVERY NUMBER BELOW WAS MEASURED OFF `NEW Robots.png`, NOT CHOSEN ═════════
His instruction was explicit about that, so the measuring is recorded here with
what it found rather than left in a scratch file:

    ground            rgb(217,213,202)   — identical in both his files
    border            x/y 52..1147, 4px, rgb(33,31,28) — identical in both
    TITLE ink         rows 913..1027 (cap height 115), x 242..958, centred 600
    RULE              rows 1061..1064 (4px), x 300..900
    SUBTITLE ink      rows 1089..1110 (height 22), x 203..998, rgb(87,84,77)

THE FACES WERE IDENTIFIED BY FITTING, NOT BY EYE. Candidates were rendered at
the size that reproduces the measured cap height, tracked to the measured ink
width, and scored against the real pixels by intersection-over-union:

    Georgia 157 / track 17.0   IoU 0.945   <- the title
    Georgia Pro 158            IoU 0.928
    Times 166                  IoU 0.712
    Bodoni MT 168              IoU 0.492
    Courier New 39 / 13.8      IoU 0.624   <- the subtitle (thin type scores low)

That is the same Georgia + Courier pairing `make_unit_covers.py` already uses.
**What moved on his new cover is the vertical position, not the setting:** the
rule sits at 1061 where the generated covers put it at 1024.

═══ THE CIRCLE IS CLOSED WITH ITS OWN INK ═══════════════════════════════════
"In the same weight and character" rules out drawing a geometric ellipse over
hand-drawn arcs — a perfect circle beside a wobbling one reads as a repair. So
the gaps are filled by ROTATING THE EXISTING ARCS about the fitted centre and
compositing them where the gaps are. The ink in the finished ring is the same
ink Mike drew: same brush, same weight variation, same tapered ends.

Fitted from the template's own 25,488 arc pixels (Kasa algebraic fit):
    centre (599.8, 517.9)   mean radius 321.7   stroke about 39
    gaps at 16-45, 113-161 and 252-306 degrees

═══ AND THE ONE COLLISION, NAMED RATHER THAN ABSORBED ═══════════════════════
"MGK-VIIIp" has a DESCENDER and "ROBOTS" does not, so his measured rule position
sits where the p's tail lands. `make_unit_covers.py` met the same thing and
dropped its rule 14px for it. This file does NOT move the rule — his instruction
was "exactly the positions the Robots cover uses" — it reports the clearance it
measures and fails if the descender would touch the rule, so the decision stays
his. See the CLEARANCE line each run prints.

    python tools/make_template_covers.py
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
SRC_ART = r"C:\Users\macun\OneDrive\Desktop - Laptop\ART"
OUT_DIR = os.path.join(REPO, "public", "held", "robots", "art")
FONTS = r"C:\Windows\Fonts"

S = 1200
PAPER = (217, 213, 202)
INK = (33, 31, 28)
DIM = (87, 84, 77)

# ── measured off NEW Robots.png ──────────────────────────────────────────────
TITLE_TOP = 913          # first ink row of the caps
TITLE_CAP = 115          # cap height in pixels
RULE_TOP, RULE_H = 1061, 4
RULE_X0, RULE_X1 = 300, 900
SUB_TOP, SUB_CAP = 1089, 22
MEASURE = round(S * 0.760)      # 912 — the widest the word may set
SUB_MEASURE = round(S * 0.660)  # 792
TRACK = 17                      # the title's measured tracking

# ── the circle, fitted off Template (prelim).png ─────────────────────────────
CX, CY, RAD = 599.8, 517.9, 321.7
GAPS = [(16, 45), (113, 161), (252, 306)]
# each gap is filled by rotating the arc that precedes it far enough to cover it
FILLS = [(31, (16, 45)), (67, (113, 161)), (90, (252, 306))]


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def close_circle(img):
    """Fill the arc gaps with rotated copies of the arcs themselves."""
    a = np.array(img.convert("RGB")).astype(np.int16)
    H, W, _ = a.shape
    lum = a.mean(axis=2)
    ink_mask = lum < 110
    # the 4px frame is not arc material
    frame = np.ones_like(ink_mask)
    frame[57:1143, 57:1143] = False
    ink_mask = ink_mask & ~frame

    ys, xs = np.mgrid[0:H, 0:W]
    dx, dy = xs - CX, ys - CY
    r = np.hypot(dx, dy)
    th = (np.degrees(np.arctan2(dy, dx)) + 360.0) % 360.0
    annulus = (r > RAD - 45) & (r < RAD + 45)

    out = a.copy()
    filled = 0
    for rot, (g0, g1) in FILLS:
        # OVERLAP THE ENDS RATHER THAN BUTT THEM. The arcs are brush strokes and
        # every end TAPERS; filling a gap edge-to-edge leaves the two tapers
        # nose to nose, which reads as a notch in the ring. Six degrees of
        # overlap on each side buries each taper under full-weight ink from the
        # rotated copy — same stroke, same radius, so there is nothing to
        # misalign.
        wedge = annulus & (th >= g0 - 6) & (th <= g1 + 6)
        # inverse map: for a pixel at angle t, read the source at t - rot
        t = np.radians(th - rot)
        sx = np.rint(CX + r * np.cos(t)).astype(int)
        sy = np.rint(CY + r * np.sin(t)).astype(int)
        ok = wedge & (sx >= 0) & (sx < W) & (sy >= 0) & (sy < H)
        src_is_ink = np.zeros_like(ok)
        src_is_ink[ok] = ink_mask[sy[ok], sx[ok]]
        take = ok & src_is_ink
        out[take] = a[sy[take], sx[take]]
        filled += int(take.sum())
    return Image.fromarray(out.astype(np.uint8)), filled


def set_tracked(d, text, f, top, fill, measure):
    """Centre `text` on the measured CAP-TOP row, tracked to fit `measure`.
    Returns (x0, x1, ink_top, ink_bottom) of what was actually drawn."""
    widths = [d.textlength(c, font=f) for c in text]
    ink = sum(widths)
    gaps = len(text) - 1
    track = TRACK
    if gaps and ink + track * gaps > measure:
        track = max(0.0, (measure - ink) / gaps)
    total = ink + track * gaps
    x = (S - total) / 2.0

    # PIL draws from the ascender box; solve the offset so the CAPS land on `top`
    probe = Image.new("L", (600, 400), 255)
    ImageDraw.Draw(probe).text((50, 100), "H", font=f, fill=0)
    pa = np.array(probe) < 110
    cap_off = int(np.where(pa.any(axis=1))[0].min()) - 100

    y = top - cap_off
    for c, w in zip(text, widths):
        d.text((x, y), c, font=f, fill=fill)
        x += w + track
    return (S - total) / 2.0, (S + total) / 2.0, track


def measure_ink(img, y0, y1):
    a = np.array(img.convert("L"))[y0:y1, 57:1143] < 160
    if not a.any():
        return None
    cols = a.any(axis=0)
    return 57 + int(np.argmax(cols)), 57 + int(len(cols) - 1 - np.argmax(cols[::-1]))


def build(title, out_name):
    base = Image.open(os.path.join(SRC_ART, "Template (prelim).png")).convert("RGB")
    canvas, filled = close_circle(base)
    d = ImageDraw.Draw(canvas)

    f_title = font("georgia.ttf", 157)
    x0, x1, track = set_tracked(d, title, f_title, TITLE_TOP, INK, MEASURE)

    d.rectangle([RULE_X0, RULE_TOP, RULE_X1, RULE_TOP + RULE_H - 1], fill=INK)

    f_sub = font("cour.ttf", 39)
    set_tracked(d, "WEIRD.BABY ROBOTS", f_sub, SUB_TOP, DIM, SUB_MEASURE)

    # ── the descender clearance, measured on the result ──────────────────────
    a = np.array(canvas.convert("L"))
    band = a[TITLE_TOP:RULE_TOP, 57:1143] < 110
    rows = np.where(band.any(axis=1))[0]
    deepest = TITLE_TOP + int(rows.max())
    clearance = RULE_TOP - deepest - 1

    out = os.path.join(OUT_DIR, out_name)
    canvas.save(out, optimize=True)
    print(f"  {out_name}")
    print(f"      arc pixels painted into the gaps : {filled}")
    print(f"      title track solved              : {track:.2f}px  (x {x0:.0f}..{x1:.0f})")
    print(f"      deepest title ink               : row {deepest}")
    print(f"      CLEARANCE to the rule           : {clearance}px", end="")
    if clearance < 0:
        print("   ** THE DESCENDER TOUCHES THE RULE — Mike's call, see the header **")
    elif clearance < 6:
        print("   (tight; ROBOTS has no descender and his rule is measured off it)")
    else:
        print("")
    return clearance


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print("building the two machine covers on Mike's blank template")
    build("MGK-NIAC", "mgk-niac-cover.png")
    build("MGK-VIIIp", "mgk-viiip-cover.png")


if __name__ == "__main__":
    main()
