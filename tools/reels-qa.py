"""THE Q&A REEL — the unit in the gloved hands, the glass simulated, the answer revealed.

Mike, 2026-09-16 (cleaned): no tray views; the unit itself, handled in white
gloves or with the camera floating around it; the screen simulated by our
tooling in every case; an oscilloscope on the glass during the question; most
of the time the unit shows what it normally would; a proper reveal on the
VIIIp screen pushed to an extreme close-up; then the staccato flash to the
black big-text card and a glitch back to the first frame; black and white
throughout; short, close, iPod pace; the words appear as they are spoken; the
voice slower and androgynous; Ops reviews continuity before it is sent.

    python tools/reels-qa.py                      one reel -> OneDrive/WeirdBaby/reels/out/qa/qa_<slug>.mp4
    python tools/reels-qa.py --review             also writes a frame sheet beside it (every 0.25 s)

How it is made. Segments are cut from the 4K clips (frames extracted at 30 fps,
cropped 9:16 around the unit, greyscale). The glass, the upper round window of
the unit, is found per frame (a circle detector seeded per segment, smoothed),
and the machine's own screen is drawn into it: a 128x64 framebuffer rendered
with FreeSansBold9pt7b from the display emulator's glyph data, the firmware's
own centring and baselines, scaled into the window with a little bloom. The
screen states are: the fluidic suspension at rest (bubbles), the oscilloscope
of the actual voice, the shake, the triangle zoom-in (firmware §3, played
fast) and the two answer lines. The question is drawn word by word from the
reader's own word timings. Then the card, the flash, the glitch, the loop.
Audio: the pop first (its own sound), the adult under the question, the
short on the shake and the glitch. Everything else is silent; a beat is a
separate item.
"""
import importlib, json, math, pathlib, re, shutil, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
VOICE = importlib.import_module("reels-voice")

SRC = pathlib.Path(r"C:\Users\macun\OneDrive\Desktop - Laptop\Weird.Baby\New folder")
OUT = pathlib.Path(r"C:\Users\macun\OneDrive\WeirdBaby\reels\out\qa")
POP = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\assets\video\WB_pop_v1.mp4")
POP_LAST = pathlib.Path(r"C:\Users\macun\OneDrive\WeirdBaby\reels\.pop-last.png")
SHORT = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\assets\audio\WB_electrical-short_v1.wav")
EMU = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\tools\viiip_display_emulator.html")
FONT_Q = r"C:\Windows\Fonts\georgiab.ttf"
FONT_CARD = r"C:\Windows\Fonts\arialbd.ttf"
W, H, FPS = 1080, 1920, 30
# the question's colour trials (Mike, 09-16: white is boring; yellow, blue, the actual screen colour, others).
# "screen" is the pixel the emulator lights: #e6f2ff, the cool OLED white.
COLOURS = {"white": (255, 255, 255), "screen": (230, 242, 255), "yellow": (255, 214, 0), "blue": (90, 170, 255),
           "amber": (255, 176, 0), "green": (130, 255, 150), "cyan": (110, 240, 255)}
_ca = [a for a in sys.argv if a.startswith("--color=")]
TEXT_NAME = _ca[0].split("=", 1)[1] if _ca else "screen"
TEXT_RGB = COLOURS.get(TEXT_NAME, COLOURS["screen"])
PREVIEW = "--preview" in sys.argv

# ── the data of this reel ───────────────────────────────────────────────────
QUESTION = "Should I bet on the home team tonight?"
ANSWER = ("THE SMART MONEY", "LEFT AN HOUR AGO.")        # the Gambler, answer 9, as split in the table
# segments: (clip, start_s, seconds, seed circle in the clip's full frame (cx, cy, r), role)
SEGMENTS = [
    ("0247", 22.0, 1.7, (1964, 1028, 204), "hold"),
    ("0247", 25.0, 1.7, (1964, 1028, 204), "hold"),
    ("0247", 81.0, 0.5, (1656, 932, 312), "shake"),
    ("0247", 50.0, 0.1, (2104, 1176, 448), "ecu"),
]
BLACK_S = 0.2
SLIDE_S = 0.4          # the signature move: the logo slides off, the machine slides in
THEATRE_S, REDIRECT_S, TRI_S, ANSWER_S = 1.5, 0.5, 0.8, 3.4   # the machine works, redirects, reveals, holds
VOICE_AT = 0.3                                            # into the first hold

# ── the machine's font, from the emulator ───────────────────────────────────
def load_font():
    html = EMU.read_text(encoding="utf-8")
    g = re.search(r"const GLYPHS = (\[\[.*?\]\]);", html, re.S).group(1)
    glyphs = json.loads(g)
    import base64
    b = re.search(r'const BITMAPS = Uint8Array\.from\(atob\("([^"]+)"\)', html)
    bitmaps = list(base64.b64decode(b.group(1)))
    return glyphs, bitmaps
GLYPHS, BITMAPS = load_font()
FW, FH, YADV = 128, 64, 22

def fb_new(): return np.zeros((FH, FW), dtype=np.uint8)
def fb_char(fb, x, y, ch):
    i = ord(ch) - 0x20
    if i < 0 or i >= len(GLYPHS): return
    off, w, h, xa, xo, yo = GLYPHS[i]; bit = 0
    for yy in range(h):
        for xx in range(w):
            if BITMAPS[off + (bit >> 3)] & (0x80 >> (bit & 7)):
                px, py = x + xo + xx, y + yo + yy
                if 0 <= px < FW and 0 <= py < FH: fb[py, px] = 1
            bit += 1
def text_w(s): return sum(GLYPHS[ord(c) - 0x20][3] for c in s if 0 <= ord(c) - 0x20 < len(GLYPHS))
def fb_centered(fb, y, s):
    """firmware SCREENS.ino 83-91: col = (128 - w) / 2, integer, may go negative"""
    x = (FW - text_w(s)) // 2
    for c in s:
        fb_char(fb, x, y, c); x += GLYPHS[ord(c) - 0x20][3]

# ── screen states ───────────────────────────────────────────────────────────
RNG = np.random.default_rng(7)
BUBBLES = [[RNG.uniform(10, 118), RNG.uniform(8, 56), RNG.uniform(1.5, 3.5), RNG.uniform(-0.15, 0.15), RNG.uniform(-0.08, 0.08)] for _ in range(5)]
def fb_circle(fb, cx, cy, r, fill=False):
    for yy in range(int(cy - r) - 1, int(cy + r) + 2):
        for xx in range(int(cx - r) - 1, int(cx + r) + 2):
            d = math.hypot(xx - cx, yy - cy)
            if (fill and d <= r) or (not fill and abs(d - r) < 0.6):
                if 0 <= xx < FW and 0 <= yy < FH: fb[yy, xx] = 1
def screen_idle(k, agitate=False):
    fb = fb_new()
    for b in BUBBLES:
        j = 3.0 if agitate else 1.0
        b[0] = (b[0] + b[3] * j + (RNG.uniform(-1.5, 1.5) if agitate else 0)) % FW
        b[1] = (b[1] + b[4] * j + (RNG.uniform(-1.5, 1.5) if agitate else 0)) % FH
        fb_circle(fb, b[0], b[1], b[2])
    return fb
def screen_scope(wave):
    fb = fb_new()
    pts = np.interp(np.linspace(0, len(wave) - 1, FW), np.arange(len(wave)), wave) if len(wave) else np.zeros(FW)
    prev = None
    for x in range(FW):
        y = int(round(FH / 2 - pts[x] * 26))
        y = max(0, min(FH - 1, y))
        if prev is not None:
            lo, hi = sorted((prev, y))
            for yy in range(lo, hi + 1): fb[yy, x] = 1
        else: fb[y, x] = 1
        prev = y
    return fb
OPCODES = ["dex","jmp","jsr","lda","ldx","ora","orx","rts","sta","stx","bne","beq","bcs","cmp","inx","inc","dec"]
OPERANDS = ["$00","$01","$07","$0A","$23","$24","$2A","$3B","$44","$4C","$5D","$68","$7F","$80","$A3","$A5","$A6","$A8","$B6","$B8","$C0","$C9","$D1","$D9","$F2","$FA","$FE","$FF","#00","#01","#02","#04","#08","#09","#16","#32","#64","#99","#FF"]
_mon = np.random.default_rng(11)
_mon_lines = [f"{_mon.choice(OPCODES)} {_mon.choice(OPERANDS)}" for _ in range(64)]
def screen_monitor(k, total):
    """the machine at work on the front glass: the twin's own faux-assembly scroller (opcodes and operands
    from viiip_twin.html) rolling one line every four frames, a load bar filling along the bottom"""
    fb = fb_new()
    step = k // 4
    for row in range(3):
        ln = _mon_lines[(step + row) % len(_mon_lines)].upper()
        x = 4
        for ch in ln:
            fb_char(fb, x, 14 + row * 17, ch); x += GLYPHS[ord(ch) - 0x20][3]
    fill = int(FW * min(1.0, k / max(1, total)))
    fb[60:63, 0:fill] = 1
    return fb
def screen_redirect():
    fb = fb_new()
    fb_centered(fb, 18, "REDIRECT"); fb_centered(fb, 38, "FLUIDIC"); fb_centered(fb, 58, "SUSPENSION")
    return fb

def screen_triangle(frame_i, total):
    """firmware 4_GRAPHICS.ino 92-111: stage 1 zoom 0->128 with rotation over 31 frames, stage 2 150->165 over 16"""
    fb = fb_new()
    f = frame_i * 47 / max(1, total)
    if f < 31: zoom = 128 * f / 31; ang = f * 0.21
    else: zoom = 150 + 15 * (f - 31) / 16; ang = 31 * 0.21
    cx, cy = FW / 2, FH / 2
    pts = [(cx + zoom / 2 * math.cos(ang + k * 2 * math.pi / 3), cy + zoom / 2 * math.sin(ang + k * 2 * math.pi / 3)) for k in range(3)]
    for a in range(3):
        (x0, y0), (x1, y1) = pts[a], pts[(a + 1) % 3]
        n = int(max(abs(x1 - x0), abs(y1 - y0))) + 1
        for s in range(n + 1):
            t = s / max(1, n); xx, yy = int(round(x0 + (x1 - x0) * t)), int(round(y0 + (y1 - y0) * t))
            if 0 <= xx < FW and 0 <= yy < FH: fb[yy, xx] = 1
    return fb
def wrap_glass(text, maxw=FW):
    """words into lines no wider than the glass, measured in the machine's own font"""
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if text_w(t) <= maxw or not cur: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def screen_answer(lines):
    """the answer on the glass. The firmware prints two lines at baselines 32 and 48 (M8BALL.ino 156-157);
    measured 09-16, no Gambler answer fits two lines of 128 px in FreeSansBold9pt7b, so under Mike's
    ruling that the screen is ours in every mode but NIAC, the text is wrapped to the glass: up to
    three lines, 20 px apart, centred as a block."""
    fb = fb_new()
    ls = wrap_glass(" ".join(lines))[:4]
    lead = 15 if len(ls) > 3 else 19
    block = lead * (len(ls) - 1) + 13                 # cap height of the face is 13 px; y is the BASELINE (yOffset -12)
    top = (FH - block) // 2
    for k, ln in enumerate(ls): fb_centered(fb, top + 12 + k * lead, ln)
    return fb

def fb_image(fb, diameter):
    """the framebuffer as a lit OLED disc: nearest-neighbour pixels, a soft bloom, a round mask"""
    scale = diameter * 0.78 / FW
    w, h = int(FW * scale), int(FH * scale)
    im = Image.fromarray((fb * 255).astype(np.uint8), "L").resize((w, h), Image.NEAREST)
    canvas = Image.new("L", (diameter, diameter), 0)
    canvas.paste(im, ((diameter - w) // 2, (diameter - h) // 2))
    glow = canvas.filter(ImageFilter.GaussianBlur(diameter * 0.012))
    lit = Image.fromarray(np.clip(np.asarray(canvas, dtype=np.float32) * 0.92 + np.asarray(glow, dtype=np.float32) * 0.55, 0, 255).astype(np.uint8), "L")
    mask = Image.new("L", (diameter, diameter), 0); ImageDraw.Draw(mask).ellipse([0, 0, diameter - 1, diameter - 1], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(diameter * 0.01))
    return lit, mask

def composite_glass(frame, circle, fb, angle=0.0):
    """darken the window, lay the lit screen in, keep a little of the real reflection"""
    cx, cy, r = circle; d = int(r * 2 * 0.96)
    if d < 8: return frame
    lit, mask = fb_image(fb, d)
    if abs(angle) > 0.2: lit = lit.rotate(-angle, resample=Image.BICUBIC)   # the screen lies on the unit's plane
    box = (int(cx - d / 2), int(cy - d / 2))
    region = frame.crop((box[0], box[1], box[0] + d, box[1] + d))
    dark = Image.eval(region, lambda v: int(v * 0.22))
    base = Image.composite(dark, region, mask)
    # the reflection stays, faint, UNDER the lit pixels, so the text is never washed out by it
    spec = Image.eval(region, lambda v: max(0, v - 150) * 2)
    m = np.asarray(mask, dtype=np.float32) / 255.0
    under = np.asarray(base, dtype=np.float32) + np.asarray(spec, dtype=np.float32) * 0.22 * m
    litf = np.asarray(lit, dtype=np.float32) * m
    screen = Image.fromarray(np.clip(under * (1 - litf / 255.0) + litf, 0, 255).astype(np.uint8), "L")
    out = frame.copy(); out.paste(Image.composite(screen, region, mask), box); return out

# ── frames from the clips, and the glass found in them ──────────────────────
def probe_size(clip):
    o = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:stream_side_data=rotation", "-of", "json", str(SRC / f"IMG_{clip}.MOV")], capture_output=True, text=True).stdout
    j = json.loads(o)["streams"][0]; w, h = j["width"], j["height"]
    rot = next((sd.get("rotation", 0) for sd in j.get("side_data_list", [])), 0)
    return (h, w) if abs(int(rot)) % 180 == 90 else (w, h)

def extract(clip, start, secs, seed, td, tag):
    """9:16 crop centred on the seed circle, scaled to 1080x1920, greyscale, 30 fps; returns frame paths and the crop transform"""
    fw, fh = probe_size(clip)
    cw = int(fh * 9 / 16); x0 = max(0, min(fw - cw, int(seed[0] - cw / 2)))
    k = W / cw
    d = pathlib.Path(td) / tag; d.mkdir()
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-t", str(secs), "-i", str(SRC / f"IMG_{clip}.MOV"),
                    "-vf", f"crop={cw}:{fh}:{x0}:0,scale={W}:{H},fps={FPS},format=gray", str(d / "%04d.png")], check=True)
    frames = sorted(d.glob("*.png"))
    seed_out = ((seed[0] - x0) * k, seed[1] * k, seed[2] * k)
    return frames, seed_out

def lens_below(g, c):
    """the lower lens: a smaller circle roughly 1.7 radii below the glass; None if not seen"""
    import cv2
    cx, cy, r = c
    small = cv2.resize(g, (W // 2, H // 2)); small = cv2.medianBlur(small, 5)
    cs = cv2.HoughCircles(small, cv2.HOUGH_GRADIENT, dp=1.2, minDist=20, param1=110, param2=26, minRadius=int(r * 0.32 / 2), maxRadius=int(r * 0.62 / 2))
    if cs is None: return None
    best = None
    for x, y, rr in cs[0]:
        X, Y = x * 2, y * 2
        d = math.hypot(X - cx, Y - (cy + 1.7 * r))
        if d < r * 0.7 and (best is None or d < best[0]): best = (d, (X, Y, rr * 2))
    return best[1] if best else None

def plate_angle(g, c, prev=0.0):
    """degrees the unit leans, from the faceplate's own near-vertical edges around the glass (Hough lines,
    weighted by length); the lens-circle method was unreliable (Mike, 09-16: the text leaned when the unit did not)"""
    import cv2
    cx, cy, r = c
    x0, x1 = int(max(0, cx - 2.4 * r)), int(min(W, cx + 2.4 * r)); y0, y1 = int(max(0, cy - 2.2 * r)), int(min(H, cy + 3.2 * r))
    roi = g[y0:y1, x0:x1]
    edges = cv2.Canny(cv2.GaussianBlur(roi, (5, 5), 0), 60, 160)
    lines = cv2.HoughLinesP(edges, 1, np.pi / 360, threshold=60, minLineLength=int(r * 0.9), maxLineGap=12)
    if lines is None: return prev
    angs, wts = [], []
    for x_a, y_a, x_b, y_b in np.asarray(lines).reshape(-1, 4):
        dx, dy = x_b - x_a, y_b - y_a
        if abs(dy) < abs(dx): continue                       # near-vertical only
        a = math.degrees(math.atan2(dx if dy > 0 else -dx, abs(dy)))
        if abs(a) > 18: continue
        angs.append(a); wts.append(math.hypot(dx, dy))
    if not angs: return prev
    order = np.argsort(angs); angs = np.array(angs)[order]; wts = np.array(wts)[order]
    cum = np.cumsum(wts); med = float(angs[np.searchsorted(cum, cum[-1] / 2)])
    return med

def axis_angles(frames, circles):
    """per frame, the plate's lean in degrees; smoothed, and never more than 1.2 degrees of change a frame"""
    import cv2
    out = []; last = 0.0
    for f, c in zip(frames, circles):
        g = cv2.imread(str(f), cv2.IMREAD_GRAYSCALE)
        a = plate_angle(g, c, last)
        a = max(last - 1.2, min(last + 1.2, a)); last = a
        out.append(a)
    arr = np.array(out); sm = []
    for i in range(len(arr)):
        lo, hi = max(0, i - 4), min(len(arr), i + 5); sm.append(float(np.median(arr[lo:hi])))
    return sm

def track(frames, seed):
    import cv2
    circles = []; prev = seed
    for f in frames:
        g = cv2.imread(str(f), cv2.IMREAD_GRAYSCALE)
        small = cv2.resize(g, (W // 2, H // 2)); small = cv2.medianBlur(small, 5)
        r0 = prev[2] / 2
        cs = cv2.HoughCircles(small, cv2.HOUGH_GRADIENT, dp=1.2, minDist=20, param1=110, param2=28, minRadius=int(r0 * 0.75), maxRadius=int(r0 * 1.3))
        best = None
        if cs is not None:
            for x, y, r in cs[0]:
                dist = math.hypot(x * 2 - prev[0], y * 2 - prev[1])
                if dist < prev[2] * 0.6 and (best is None or dist < best[0]): best = (dist, (x * 2, y * 2, r * 2))
        prev = best[1] if best else prev
        circles.append(prev)
    # smooth: median over five
    arr = np.array(circles); out = []
    for i in range(len(arr)):
        lo, hi = max(0, i - 2), min(len(arr), i + 3)
        out.append(tuple(np.median(arr[lo:hi], axis=0)))
    return out

# ── the question, word by word ──────────────────────────────────────────────
QSCALE = 6   # the 9-pt face at six times: 13-px caps become 78 px
def glyph_line(text):
    """one line of text as a framebuffer strip in the machine's font"""
    w = text_w(text) + 2; fb = np.zeros((18, max(1, w)), dtype=np.uint8); x = 1
    for ch in text:
        i = ord(ch) - 0x20
        if i < 0 or i >= len(GLYPHS): continue
        off, gw, gh, xa, xo, yo = GLYPHS[i]; bit = 0
        for yy in range(gh):
            for xx in range(gw):
                if BITMAPS[off + (bit >> 3)] & (0x80 >> (bit & 7)):
                    px, py = x + xo + xx, 14 + yo + yy
                    if 0 <= px < fb.shape[1] and 0 <= py < 18: fb[py, px] = 1
                bit += 1
        x += xa
    return fb
def question_lines(words, maxw_fb=150):
    lines, cur = [], []
    for w in words:
        t = " ".join(cur + [w])
        if text_w(t) <= maxw_fb or not cur: cur.append(w)
        else: lines.append(cur); cur = [w]
    if cur: lines.append(cur)
    return lines
def question_block(words, shown):
    """the words spoken so far as one mask image (L), lines stacked and centred, in the machine's font"""
    strips = []; k = 0
    for line in question_lines(words):
        take = [w for w in line if k < shown and not (k := k + 1) < 0]
        if not take: break
        strips.append(glyph_line(" ".join(take)))
    if not strips: return None
    lh = 18 * QSCALE - 6
    bw = max(st.shape[1] for st in strips) * QSCALE
    block = Image.new("L", (bw, lh * (len(strips) - 1) + 18 * QSCALE), 0)
    for i, st in enumerate(strips):
        img = Image.fromarray((st * 255).astype(np.uint8), "L").resize((st.shape[1] * QSCALE, 18 * QSCALE), Image.NEAREST)
        block.paste(img, ((bw - img.width) // 2, i * lh))
    return block

def draw_question_machine(frame, words, shown, centre, angle_deg, rgb=None):
    """the question in colour with a CRT edge, centred on `centre`, rotated to the unit's plane. The frame is
    greyscale; the text is the one coloured thing. A dark halo under it separates it from the picture."""
    rgb = rgb or TEXT_RGB
    if shown == 0: return frame.convert("RGB")
    mask = question_block(words, shown)
    if mask is None: return frame.convert("RGB")
    pad = 60
    m = Image.new("L", (mask.width + 2 * pad, mask.height + 2 * pad), 0); m.paste(mask, (pad, pad))
    soft = m.filter(ImageFilter.GaussianBlur(2.0))                       # the CRT edge: no hard pixel
    glow = m.filter(ImageFilter.GaussianBlur(10))                         # the phosphor bloom
    halo = Image.fromarray(np.clip(np.asarray(m.filter(ImageFilter.GaussianBlur(30)), dtype=np.float32) * 2.2
                                   + np.asarray(m.filter(ImageFilter.GaussianBlur(5)), dtype=np.float32) * 1.2, 0, 255).astype(np.uint8), "L")   # a deep, wide, feathered dark under it: not a box
    soft = soft.rotate(-angle_deg, resample=Image.BICUBIC, expand=True)
    glow = glow.rotate(-angle_deg, resample=Image.BICUBIC, expand=True)
    halo = halo.rotate(-angle_deg, resample=Image.BICUBIC, expand=True)
    out = frame.convert("RGB")
    x = int(centre[0] - soft.width / 2); y = int(centre[1] - soft.height / 2)
    dark = Image.new("RGB", soft.size, (0, 0, 0))
    out.paste(dark, (x, y), halo.point(lambda v: int(min(255, v) * 0.92)))
    col = Image.new("RGB", soft.size, rgb)
    out.paste(col, (x, y), glow.point(lambda v: int(v * 0.6)))
    out.paste(col, (x, y), soft)
    return out

def layout_words(words, font, maxw=880):
    """(word, x, y) positions, wrapped, for a block whose top-left is (0,0)"""
    pos = []; x = 0; y = 0; lh = int(font.size * 1.22); sp = font.getlength(" ")
    for w in words:
        ww = font.getlength(w)
        if x > 0 and x + ww > maxw: x = 0; y += lh
        pos.append((w, x, y)); x += ww + sp
    return pos, y + lh

def draw_question(frame, pos, block_h, shown, font, by=1130):
    """words shown so far, on one soft box BELOW the glass (Mike, 09-16: covering the shutter is fine)"""
    if shown == 0: return frame
    out = frame.convert("RGBA"); ov = Image.new("RGBA", out.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    bx = 90; pad = 28
    d.rectangle([bx, by, bx + 900, by + block_h + pad * 2], fill=(0, 0, 0, 150))
    for w, x, y in pos[:shown]:
        d.text((bx + pad + x, by + pad + y), w, font=font, fill=(255, 255, 255, 255))
    return Image.alpha_composite(out, ov).convert("L")

def card(lines):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im); f = ImageFont.truetype(FONT_CARD, 86)
    lh = 108; y0 = H // 2 - len(lines) * lh // 2
    for k, ln in enumerate(lines):
        tw = d.textlength(ln, font=f); d.text(((W - tw) / 2, y0 + k * lh), ln, font=f, fill=255)
    return im

def glitch(frame, k):
    a = np.asarray(frame, dtype=np.int16).copy()
    rng = np.random.default_rng(100 + k)
    for _ in range(rng.integers(6, 12)):
        y = rng.integers(0, H - 40); hgt = rng.integers(6, 40); dx = rng.integers(-90, 90)
        a[y:y + hgt] = np.roll(a[y:y + hgt], dx, axis=1)
    if k % 2 == 0: a = 255 - a
    a += rng.integers(-25, 25, size=a.shape)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "L")

# ── the build ───────────────────────────────────────────────────────────────
def main():
    review = "--review" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", QUESTION.lower()).strip("-")[:40]
    dest = OUT / f"qa_{slug}_{TEXT_NAME}.mp4"
    if not POP_LAST.exists():
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.05", "-i", str(POP), "-frames:v", "1", "-vf", "format=gray", str(POP_LAST)], check=True)
    with tempfile.TemporaryDirectory() as td:
        td = pathlib.Path(td)
        # the voice and its word timings
        y, words = VOICE.render_timed(QUESTION)
        vwav = td / "adult.wav"; VOICE.write_wav(vwav, y)
        voice_len = len(y) / VOICE.SR
        # frames per segment, tracked
        segs = []
        for i, (clip, start, secs, seed, role) in enumerate(SEGMENTS):
            frames, seed_out = extract(clip, start, secs, seed, td, f"seg{i}")
            circles = track(frames, seed_out)
            segs.append((role, frames, circles))
            print(f"  seg{i} {role:5s} {clip} {start:>5}s {len(frames)} frames  glass r {circles[0][2]:.0f}->{circles[-1][2]:.0f}")
        fontq = ImageFont.truetype(FONT_Q, 72)
        qwords = QUESTION.split()
        pos, block_h = layout_words(qwords, fontq)
        onsets = [o for o, d, t in words]
        # assemble the middle, frame by frame
        outdir = td / "out"; outdir.mkdir(); n = 0; t = 0.0
        first_frame = None; last_ecu = None
        def emit(im):
            nonlocal n
            im.convert("RGB").save(outdir / f"{n:05d}.png"); n += 1
        # 1+2: the holds — idle glass, then the oscilloscope while the voice speaks; words appear as spoken
        hold_frames = [(f, c) for role, fr, cs in segs[:2] if role == "hold" for f, c in zip(fr, cs)]
        hold_angles = []
        for role, fr, cs in segs[:2]:
            if role == "hold": hold_angles += axis_angles(fr, cs)
        print(f"  plane: the unit leans {min(hold_angles):.1f} to {max(hold_angles):.1f} degrees through the holds")
        tri_total = int(0.8 * FPS)
        pop_last = Image.open(POP_LAST).convert("L").resize((W, H)) if POP_LAST.exists() else None
        n_slide = int(SLIDE_S * FPS)
        for k, (f, c) in enumerate(hold_frames):
            t = k / FPS
            speaking = VOICE_AT <= t < VOICE_AT + voice_len
            if speaking:
                s0 = int((t - VOICE_AT) * VOICE.SR); wave = y[s0:s0 + VOICE.SR // FPS]
                fb = screen_scope(wave * 1.6)
            else:
                fb = screen_idle(k)
            im = Image.open(f).convert("L")
            im = composite_glass(im, c, fb)
            shown = sum(1 for o in onsets if t >= VOICE_AT + o)
            a = hold_angles[k]; ar = math.radians(a)
            dist = c[2] * 1.05 + (18 * QSCALE - 6) * 1.5 / 2 + 60                  # from the glass centre down the unit's axis to the block's centre
            centre = (c[0] + dist * math.sin(ar), c[1] + dist * math.cos(ar))
            im = draw_question_machine(im, qwords, shown, centre, a)
            # the signature move: the logo slides off left as the machine slides in from the right, easing; then a soft push settles
            if pop_last is not None and k < n_slide:
                e = 1 - (1 - k / n_slide) ** 3
                canvas = Image.new("RGB", (W, H), (0, 0, 0))
                xin = int(W * (1 - e)); canvas.paste(pop_last.convert("RGB"), (xin - W, 0)); canvas.paste(im, (xin, 0)); im = canvas   # the two halves share one edge: no seam
            elif k < n_slide + int(1.0 * FPS):
                z = 1.0 + 0.05 * (1 - (k - n_slide) / (1.0 * FPS))
                cw, ch = int(W / z), int(H / z); im = im.crop(((W - cw) // 2, (H - ch) // 2, (W - cw) // 2 + cw, (H - ch) // 2 + ch)).resize((W, H), Image.LANCZOS)
            if first_frame is None: first_frame = im.copy()
            if PREVIEW and k == len(hold_frames) - 1:
                pv = OUT / f"preview_{TEXT_NAME}.png"; im.save(pv); print(f"  preview {pv}"); return
            emit(im)
        # 3: the shake — the suspension agitated, the short on the sound track
        t_shake = n / FPS
        jr = np.random.default_rng(3)
        for k, (f, c) in enumerate([(f, c) for role, fr, cs in segs if role == "shake" for f, c in zip(fr, cs)]):
            im = composite_glass(Image.open(f).convert("L"), c, screen_idle(k, agitate=True))
            dx, dy = int(jr.integers(-22, 22)), int(jr.integers(-16, 16))          # the jolt
            im = ImageOps.expand(im, border=30, fill=0).crop((30 + dx, 30 + dy, 30 + dx + W, 30 + dy + H))
            emit(im)
        # 4: the reveal on the glass, extreme close-up: the triangle fast, then the answer, with a slow push in
        ecu = [(f, c) for role, fr, cs in segs if role == "ecu" for f, c in zip(fr, cs)]
        f0, c0 = ecu[0]
        import cv2 as _cv
        ecu_angle = plate_angle(_cv.imread(str(f0), _cv.IMREAD_GRAYSCALE), c0, 0.0)
        print(f"  plane: the close-up leans {ecu_angle:.1f} degrees")
        n_theatre, n_redirect, n_tri, n_answer = int(THEATRE_S * FPS), int(REDIRECT_S * FPS), int(TRI_S * FPS), int(ANSWER_S * FPS)
        ecu = [ecu[0]] * (n_theatre + n_redirect + n_tri + n_answer)
        t_theatre = n / FPS                                   # one frame, pushed in digitally: no tracking to lose
        plate = Image.open(f0).convert("L")
        n_ecu = len(ecu)
        zmax = min(1.6, 0.86 * W / (2 * c0[2]))          # the whole glass stays inside the frame
        t_answer = t_theatre + (n_theatre + n_redirect + n_tri) / FPS
        for k in range(n_ecu):
            if k < n_theatre: fb = screen_monitor(k, n_theatre)
            elif k < n_theatre + n_redirect: fb = screen_redirect()
            elif k < n_theatre + n_redirect + n_tri: fb = screen_triangle(k - n_theatre - n_redirect, n_tri)
            else: fb = screen_answer(ANSWER)
            im = composite_glass(plate, c0, fb, angle=ecu_angle)
            z = 1.0 + (zmax - 1.0) * (k / max(1, n_ecu - 1)) ** 0.7
            cw, ch = int(W / z), int(H / z); cx, cy = int(c0[0]), int(c0[1])
            x0 = max(0, min(W - cw, cx - cw // 2)); y0 = max(0, min(H - ch, cy - ch // 2))
            im = im.crop((x0, y0, x0 + cw, y0 + ch)).resize((W, H), Image.LANCZOS)
            last_ecu = im; emit(im)
        # 5: stay on the VIIIp (Mike, 09-16: kill the card); the black beat closes the loop
        for k in range(int(BLACK_S * FPS)): emit(Image.new("L", (W, H), 0))
        middle_s = n / FPS
        print(f"  middle {middle_s:.2f}s, {n} frames; voice at {VOICE_AT}s for {voice_len:.2f}s; shake at {t_shake:.2f}s")
        # the sound: a hum under everything, a rattle at the shake, relays while it works, blips for the triangle,
        # a thunk at the answer, a hiss under the card, then silence for the black (the jump on the loop)
        sfx = np.zeros(int(middle_s * VOICE.SR) + 1)
        def add(t0, sig):
            i = int(t0 * VOICE.SR); j = min(len(sfx), i + len(sig)); sfx[i:j] += sig[:j - i]
        SRv = VOICE.SR; rng = np.random.default_rng(5)
        tt = np.arange(int((middle_s - BLACK_S) * SRv)) / SRv
        add(0, 0.018 * (np.sin(2 * np.pi * 55 * tt) + 0.5 * np.sin(2 * np.pi * 110 * tt)))          # the hum
        def tick(amp=0.35, ms=4, hz=2200):
            n = int(ms * SRv / 1000); e = np.exp(-np.arange(n) / (n / 3)); return amp * e * np.sin(2 * np.pi * hz * np.arange(n) / SRv)
        for m in range(3): add(t_shake + 0.06 * m, tick(0.5, 6, 900 + 300 * m))                        # the rattle
        tk = t_theatre
        while tk < t_theatre + THEATRE_S:
            add(tk, tick(0.22 + 0.2 * rng.random(), 3, 1800 + 900 * rng.random())); tk += 0.045 + 0.05 * rng.random()   # relays
        add(t_theatre + THEATRE_S, tick(0.5, 40, 1400))                                              # the redirect chime
        for q in range(n_tri // 4): add(t_theatre + THEATRE_S + REDIRECT_S + q * 4 / FPS, tick(0.3, 18, 1200 + 40 * q))   # the triangle blips
        n_th = int(0.16 * SRv); e = np.exp(-np.arange(n_th) / (n_th / 4))
        add(t_answer, 0.7 * e * np.sin(2 * np.pi * 85 * np.arange(n_th) / SRv) + 0.15 * e * rng.standard_normal(n_th))   # the thunk
        sfxwav = td / "sfx.wav"; VOICE.write_wav(sfxwav, np.clip(sfx, -1, 1))
        middle = td / "middle.mp4"
        fc = (f"[1:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={int(VOICE_AT*1000)}|{int(VOICE_AT*1000)},volume=1.0[v];"
              f"[2:a]aformat=sample_rates=48000:channel_layouts=stereo[x];"
              f"[3:a][v][x]amix=inputs=3:duration=first:normalize=0[a]")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", str(outdir / "%05d.png"), "-i", str(vwav), "-i", str(sfxwav),
                        "-f", "lavfi", "-t", f"{middle_s:.3f}", "-i", "anullsrc=r=48000:cl=stereo",
                        "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-shortest", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", str(middle)], check=True)
        # the pop first (its own sound), then the middle
        vf = ("[0:v]scale=1080:1920,fps=30,format=gray,format=yuv420p,setsar=1[v0];[0:a]aformat=sample_rates=48000:channel_layouts=stereo[a0];"
              "[1:v]fps=30,format=yuv420p,setsar=1[v1];[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]")
        # the pop is greyscale; the middle is colour only where the question is
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(POP), "-i", str(middle), "-filter_complex", vf, "-map", "[v]", "-map", "[a]",
                        "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(dest)], check=True)
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dest)], capture_output=True, text=True).stdout)
        print(f"  wrote {dest}  {dur:.1f}s")
        if review:
            sheet = OUT / f"qa_{slug}_review.jpg"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(dest), "-vf", "fps=4,scale=216:-1,tile=10x5", "-frames:v", "1", str(sheet)], check=True)
            print(f"  review sheet {sheet}")

if __name__ == "__main__":
    main()
