#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""THE PRINTS — every artifact photograph, from the manifest, as the handled print.

Ruled 2026-09-10 (docs/PHOTOS-20260910-TRAY-SET.md) and corrected 09-17:
the originals are never edited; one manifest row per original; a script
reads the manifest and writes every processed set, so a changed crop or a
changed filter is a re-run. The look is strength 3, "the handled print"
(Mike, from the PC, 09-10: "I like the handled version"): grey scale, faded
and warm, visible grain, a soft vignette, corner wear, a hair of softness,
a cream print border with its edge line, on an off-white scanner bed.

THE CROP (corrected 09-17): the tray shots were never meant to be used as
they are. Crop at least to the tray's floor and, in most cases, far beyond
it, down to one element of one artifact. No artificial limit. So a row's
`crop` is one of:
    "auto"      the subject inside the tray, found by the tool, padded, and
                squared up to a 4:5 or 5:4 print; clamped to the tray floor
    "subject"   the same, not clamped (the slate is held above the tray)
    "tray"      the tray floor, whole (big and enclosed things)
    [x0,y0,x1,y1]  a box in the original's pixels, as it lies after EXIF
                rotation (the phone's portrait frame is 3024x4032)
and `pad` (fraction of the subject's longer side, default 0.32) opens the
auto crop out.

LAYERS, IN ORDER: original → crop → tone and grain → border and bed →
annotation (Mike's handwriting, white on the print; the field is in the
manifest and the layer is reserved; nothing draws until he sends samples).

WHAT IT WRITES
    public/held/robots/photos/<character>/<id>.jpg        the print, 1600 px
    public/held/robots/photos/<character>/<id>-tile.jpg   the wall tile, 640 px
    public/held/robots/photos/<character>/cover-source.jpg  the plain grey crop
                of the row marked `cover`, for tools/make_album_covers.py
    src/data/photos/<character>.json   one row a print, the PUBLIC address
                (`/robots/photos/...`); `placed()` computes the held one
The prints go under public/held/ because the albums are behind the stage
door until Opening Day; `placed()` in src/lib/placement.js does the rest.

    python tools/photos-build.py                  every character in the manifest
    python tools/photos-build.py --character gambler
    python tools/photos-build.py --only 0197,0203  a few rows, by id suffix
    python tools/photos-build.py --sheet out.jpg   a contact sheet of the prints
    python tools/photos-build.py --out DIR         write somewhere else (a proof)
"""
import argparse
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
MANIFEST = os.path.join(REPO, "photos", "manifest.json")
OUT_ROOT = os.path.join(REPO, "public", "held", "robots", "photos")
DATA_ROOT = os.path.join(REPO, "src", "data", "photos")
PUBLIC_PREFIX = "/robots/photos"

PRINT_LONG = 1600
TILE_LONG = 640
JPEG_Q = 84

# the handled print — strength 3
PAPER = (241, 235, 214)      # the cream of the print border
EDGE = (208, 196, 150)       # the border's edge line, a hair darker and yellower
BED = (232, 230, 221)        # the scanner bed
BORDER = 0.045               # of the print's shorter side
BED_W = 0.022
FADE_BLACK, FADE_WHITE = 26, 234
WARM = (1.04, 1.0, 0.93)     # per channel, after grey
GRAIN = 7.5                  # sigma, 8-bit levels, at print size
VIGNETTE = 0.16
SOFT = 0.55                  # gaussian radius at print size
MIN_SHORT = 1000             # the crop's short side, in the original's pixels, at least


# ── the crop ────────────────────────────────────────────────────────────────

def load_original(path):
    return ImageOps.exif_transpose(Image.open(path)).convert("RGB")


def tray_floor(im, scale=8):
    """The tray's floor as a box in original pixels: the largest bright,
    unsaturated region, inset past the rim."""
    small = im.resize((im.width // scale, im.height // scale), Image.BOX)
    a = np.asarray(small).astype(int)
    lum = a.mean(-1)
    sat = a.max(-1) - a.min(-1)
    tray = (lum > 150) & (sat < 45)
    rows = np.where(tray.mean(1) > 0.5)[0]
    cols = np.where(tray.mean(0) > 0.5)[0]
    if not len(rows) or not len(cols):
        return (0, 0, im.width, im.height)
    x0, x1 = cols.min() * scale, (cols.max() + 1) * scale
    y0, y1 = rows.min() * scale, (rows.max() + 1) * scale
    ix, iy = round((x1 - x0) * 0.07), round((y1 - y0) * 0.06)
    return (x0 + ix, y0 + iy, x1 - ix, y1 - iy)


def subject_box(im, floor, scale=8, drop_rule=True):
    """The things on the tray: pixels that are not the tray's own colour,
    in connected patches, the steel rule dropped, dust dropped."""
    small = im.resize((im.width // scale, im.height // scale), Image.BOX)
    a = np.asarray(small).astype(int)
    fx0, fy0, fx1, fy1 = [v // scale for v in floor]
    region = a[fy0:fy1, fx0:fx1].astype(np.float32)
    # the tray's own shading is a slow gradient; a thing on it is a local
    # departure from that gradient, or a colour, or plainly dark
    lum = region.mean(-1)
    sat = region.max(-1) - region.min(-1)
    L = Image.fromarray(lum.astype(np.uint8), "L")
    bg = np.asarray(L.filter(ImageFilter.MedianFilter(31)).filter(ImageFilter.GaussianBlur(6))).astype(np.float32)
    mask = (np.abs(lum - bg) > 16) | (sat > 40) | (lum < bg - 45)
    # a little closing so a page's texture reads as one patch; the rim band off
    m = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(3))
    mask = np.asarray(m) > 0
    band = max(2, round(0.035 * min(mask.shape)))
    mask[:band, :] = mask[-band:, :] = False
    mask[:, :band] = mask[:, -band:] = False
    # connected components, 4-way, by a simple flood
    h, w = mask.shape
    labels = np.zeros((h, w), dtype=np.int32)
    boxes = []
    n = 0
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not labels[y, x]:
                n += 1
                stack = [(y, x)]
                labels[y, x] = n
                bx0, by0, bx1, by1, area = x, y, x, y, 0
                while stack:
                    cy, cx = stack.pop()
                    area += 1
                    bx0, bx1 = min(bx0, cx), max(bx1, cx)
                    by0, by1 = min(by0, cy), max(by1, cy)
                    for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not labels[ny, nx]:
                            labels[ny, nx] = n
                            stack.append((ny, nx))
                boxes.append((bx0, by0, bx1 + 1, by1 + 1, area))
    keep = []
    rule = None
    for bx0, by0, bx1, by1, area in boxes:
        bw, bh = bx1 - bx0, by1 - by0
        if area < 0.0006 * h * w:
            continue                                   # dust, a shadow's edge
        edge = round(0.12 * min(h, w))
        touches = bx0 < edge or by0 < edge or bx1 > w - edge or by1 > h - edge
        if touches and (bw < 0.15 * w or bh < 0.15 * h):
            continue                                   # a strip of the tray's rim
        if drop_rule and bh > 3 * bw and bw < 0.14 * w and (bx0 + bx1) / 2 < 0.27 * w:
            rule = ((bx0 + fx0) * scale, (by0 + fy0) * scale, (bx1 + fx0) * scale, (by1 + fy0) * scale)
            continue                                   # the steel rule, left of centre
        keep.append((bx0, by0, bx1, by1))
    if not keep:
        return None, rule
    x0 = min(b[0] for b in keep); y0 = min(b[1] for b in keep)
    x1 = max(b[2] for b in keep); y1 = max(b[3] for b in keep)
    return ((x0 + fx0) * scale, (y0 + fy0) * scale, (x1 + fx0) * scale, (y1 + fy0) * scale), rule


def square_up(box, pad, bounds, clamp):
    """Pad the subject and open the box to 4:5 or 5:4, whichever is nearer,
    inside `bounds` when clamped."""
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    bw, bh = bounds[2] - bounds[0], bounds[3] - bounds[1]
    p = max(min(round(max(w, h) * pad), round(0.13 * min(bw, bh))), 90)
    x0, y0, x1, y1 = x0 - p, y0 - p, x1 + p, y1 + p
    w, h = x1 - x0, y1 - y0
    target = 0.8 if w / h < 1 else 1.25
    if w / h < target:
        nw = h * target; x0 -= (nw - w) / 2; x1 = x0 + nw
    else:
        nh = w / target; y0 -= (nh - h) / 2; y1 = y0 + nh
    # never a print made from a sliver: the short side is at least MIN_SHORT
    w, h = x1 - x0, y1 - y0
    if min(w, h) < MIN_SHORT:
        k = MIN_SHORT / min(w, h)
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        w, h = w * k, h * k
        x0, x1, y0, y1 = cx - w / 2, cx + w / 2, cy - h / 2, cy + h / 2
    if clamp:
        bx0, by0, bx1, by1 = bounds
        w, h = x1 - x0, y1 - y0
        if w > bx1 - bx0: x0, x1 = bx0, bx1
        elif x0 < bx0: x0, x1 = bx0, bx0 + w
        elif x1 > bx1: x0, x1 = bx1 - w, bx1
        if h > by1 - by0: y0, y1 = by0, by1
        elif y0 < by0: y0, y1 = by0, by0 + h
        elif y1 > by1: y0, y1 = by1 - h, by1
    else:
        x0, y0 = max(0, x0), max(0, y0)
    return tuple(int(round(v)) for v in (x0, y0, x1, y1))


def resolve_crop(im, row):
    crop = row.get("crop", "auto")
    pad = float(row.get("pad", 0.32))
    floor = tray_floor(im)
    if isinstance(crop, (list, tuple)) and len(crop) == 4:
        return tuple(int(v) for v in crop), "box"
    if crop == "tray":
        return floor, "tray"
    clamp = crop != "subject"
    bounds = floor if clamp else (0, 0, im.width, im.height)
    sub, rule = subject_box(im, floor if clamp else (0, 0, im.width, im.height), drop_rule=clamp)
    if sub is None:
        return floor, "tray (no subject found)"
    # THE RULE IS KEPT OR DROPPED, NEVER HALF (09-10). A subject standing clear
    # of the rule is printed without it: the crop starts right of the rule. A
    # subject that overlaps it (a laid-out group beside it) keeps it whole.
    if rule and clamp:
        gap = 60
        if sub[0] > rule[2] + gap:
            bounds = (rule[2] + gap, bounds[1], bounds[2], bounds[3])
            how = "auto, rule dropped"
        else:
            sub = (min(sub[0], rule[0]), min(sub[1], rule[1]), max(sub[2], rule[2]), max(sub[3], rule[3]))
            how = "auto, rule kept"
    else:
        how = crop
    box = square_up(sub, pad, bounds, clamp)
    box = (max(0, box[0]), max(0, box[1]), min(im.width, box[2]), min(im.height, box[3]))
    return box, how


# ── the treatment ───────────────────────────────────────────────────────────

def handled_print(im):
    """Strength 3. Grey, faded and warm, a hair soft, grained, vignetted,
    the corners worn; then the cream border with its edge line on the bed."""
    long = max(im.size)
    s = PRINT_LONG / long
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    g = ImageOps.grayscale(im)
    if SOFT > 0:
        g = g.filter(ImageFilter.GaussianBlur(SOFT))
    a = np.asarray(g).astype(np.float32) / 255.0
    a = np.power(a, 0.94)                                   # the print's own curve
    a = FADE_BLACK / 255.0 + a * (FADE_WHITE - FADE_BLACK) / 255.0
    h, w = a.shape
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = (w - 1) / 2, (h - 1) / 2
    r = np.sqrt(((xx - cx) / cx) ** 2 + ((yy - cy) / cy) ** 2) / np.sqrt(2)
    a *= 1 - VIGNETTE * np.clip(r, 0, 1) ** 2.2
    rng = np.random.default_rng(int.from_bytes(bytes(str(im.size), "utf8"), "big") % 2**32)
    grain = rng.normal(0, GRAIN, (h, w))
    g8 = Image.fromarray(np.clip(grain * 2 + 128, 0, 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.4))
    grain = (np.asarray(g8).astype(np.float32) - 128) / 2 / 255.0
    a += grain
    # corner wear: a pale bloom in each corner, uneven
    for (px, py) in ((0, 0), (w, 0), (0, h), (w, h)):
        d = np.sqrt((xx - px) ** 2 + (yy - py) ** 2) / (0.28 * min(w, h))
        wear = np.clip(1 - d, 0, 1) ** 2 * (0.10 + 0.06 * rng.random())
        a += wear * (0.75 - a) * 0.9
    a = np.clip(a, 0, 1)
    rgb = np.stack([a * WARM[0], a * WARM[1], a * WARM[2]], -1)
    rgb = (np.clip(rgb, 0, 1) * 255).astype(np.uint8)
    p = Image.fromarray(rgb, "RGB")
    # the border and the bed
    b = round(min(p.size) * BORDER)
    bed = round(min(p.size) * BED_W)
    W, H = p.width + 2 * b + 2 * bed, p.height + 2 * b + 2 * bed
    out = Image.new("RGB", (W, H), BED)
    d = ImageDraw.Draw(out)
    d.rectangle([bed, bed, W - bed - 1, H - bed - 1], fill=PAPER)
    d.rectangle([bed + 1, bed + 1, W - bed - 2, H - bed - 2], outline=EDGE, width=max(2, b // 9))
    # the print's own edge, slightly soft into the paper
    out.paste(p, (bed + b, bed + b))
    return out


# ── the run ─────────────────────────────────────────────────────────────────

def label_of(row):
    return row.get("label") or row.get("item") or row["id"]


def build(rows, shoots, out_root, data_root, only=None, sheet=None):
    by_char = {}
    for row in rows:
        if only and not any(row["id"].endswith(o) for o in only):
            continue
        by_char.setdefault(row["character"], []).append(row)
    sheet_tiles = []
    for character, crows in by_char.items():
        out_dir = os.path.join(out_root, character)
        os.makedirs(out_dir, exist_ok=True)
        data = []
        for row in crows:
            shoot = shoots[row["shoot"]]
            src = os.path.join(shoot["source"], row["file"])
            if not os.path.exists(src):
                print("MISSING", src); continue
            im = load_original(src)
            box, how = resolve_crop(im, row)
            crop = im.crop(box)
            print_im = handled_print(crop)
            name = row["id"]
            p_path = os.path.join(out_dir, name + ".jpg")
            t_path = os.path.join(out_dir, name + "-tile.jpg")
            print_im.save(p_path, quality=JPEG_Q, optimize=True, progressive=True)
            tile = print_im.copy(); tile.thumbnail((TILE_LONG, TILE_LONG), Image.LANCZOS)
            tile.save(t_path, quality=JPEG_Q - 2, optimize=True)
            if row.get("cover"):
                c = ImageOps.grayscale(crop); c.thumbnail((1400, 1400), Image.LANCZOS)
                c.convert("RGB").save(os.path.join(out_dir, "cover-source.jpg"), quality=92)
            print("%-14s %-8s crop=%s  %dx%d  %.0f KB" % (name, how, list(box), print_im.width, print_im.height,
                                                       os.path.getsize(p_path) / 1024))
            data.append({
                "id": name, "file": row["file"], "shoot": row["shoot"],
                "img": "%s/%s/%s-tile.jpg" % (PUBLIC_PREFIX, character, name),
                "href": "%s/%s/%s.jpg" % (PUBLIC_PREFIX, character, name),
                "label": label_of(row), "item": row.get("item", ""), "group": row.get("group", ""),
                "page": row.get("page", "plates"), "state": row.get("state", ""),
                "date": shoot.get("date_label", ""), "crop": list(box),
            })
            if sheet is not None:
                sheet_tiles.append((name, tile))
        os.makedirs(data_root, exist_ok=True)
        with open(os.path.join(data_root, character + ".json"), "w", encoding="utf-8") as f:
            json.dump({"_": "WRITTEN BY tools/photos-build.py FROM photos/manifest.json — do not edit; change the manifest and re-run.",
                       "character": character, "rows": data}, f, indent=1, ensure_ascii=False)
        print("wrote %s (%d rows)" % (os.path.join(data_root, character + ".json"), len(data)))
    if sheet is not None and sheet_tiles:
        tw, th, cols = 320, 360, 8
        n = len(sheet_tiles); rws = (n + cols - 1) // cols
        S = Image.new("RGB", (cols * tw, rws * (th + 22)), "white")
        d = ImageDraw.Draw(S)
        for i, (name, t) in enumerate(sheet_tiles):
            t = t.copy(); t.thumbnail((tw - 8, th - 8))
            x, y = (i % cols) * tw, (i // cols) * (th + 22)
            S.paste(t, (x + (tw - t.width) // 2, y + (th - t.height) // 2))
            d.text((x + 6, y + th + 4), name, fill="black")
        S.save(sheet, quality=80)
        print("sheet", sheet)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--character")
    ap.add_argument("--only", help="comma-separated id suffixes")
    ap.add_argument("--sheet")
    ap.add_argument("--out", help="output root instead of public/held/robots/photos")
    ap.add_argument("--data", help="data root instead of src/data/photos")
    args = ap.parse_args()
    with open(MANIFEST, encoding="utf-8") as f:
        m = json.load(f)
    rows = [r for r in m["rows"] if not args.character or r["character"] == args.character]
    build(rows, m["shoots"], args.out or OUT_ROOT, args.data or DATA_ROOT,
          only=args.only.split(",") if args.only else None, sheet=args.sheet)


if __name__ == "__main__":
    main()
