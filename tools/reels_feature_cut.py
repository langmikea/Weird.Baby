"""THE FEATURE REEL, CUT — from a capture folder to the 9:16 reel, by the story's beat table.

Story: docs/FEATURE-REEL-20260916.md §8 (the third form). Reads index.json (screencast shots with page
times, glass frames with page times, the events, where the glass sits on the page), lays reel time over
page time as clips (a window at a speed, a speed ramp, or a decelerating hold), renders every frame:

  the branch label, small, over the black band at the top;
  the monitor as the site draws it;
  below it, no line: the zoom-in, the monitor's own picture of the machine cropped to the unit and
  nothing else, one position from first frame to last; EVERYTHING comes through its front glass (the
  framebuffer the story is on, drawn at the picture's own scale with the site's screen treatment),
  under the closed-circuit read the monitor wears; the feature's name in yellow over the unit's cap;

then the house sound bed, and the pop first.
"""
import sys, re, json, math, wave, pathlib, subprocess, tempfile, importlib.util
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageChops

ROOT = pathlib.Path(__file__).resolve().parents[1]
POP = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\assets\video\WB_pop_v1.mp4")
W, H, FPS, SR = 1080, 1920, 30, 48000
CRT = (60, 0, 1200, 900)         # the bezel inside the 1280x900 view
MON_Y = 28                        # the black band above the monitor carries the branch label
MON_H = int((CRT[3] - CRT[1]) * W / (CRT[2] - CRT[0]))   # 853
ZOOM_Y = MON_Y + MON_H + 6
ZOOM_H = H - ZOOM_Y
# the unit in the monitor's picture, measured from the front glass canvas: left, top, right, bottom offsets from its centre
UNIT = (-202, -241, 232, 176)
YELLOW = (255, 214, 10)
BRANCH = "\\ROBOTS"

def load_font():
    saved = sys.argv; sys.argv = ["reels-qa.py"]
    spec = importlib.util.spec_from_file_location("rq", ROOT / "tools" / "reels-qa.py"); rq = importlib.util.module_from_spec(spec); spec.loader.exec_module(rq)
    sys.argv = saved; return rq

def name_plate(rq, text, scale=5):
    """the feature's name in the machine's font, yellow, with the CRT halo the Q&A question has"""
    fb = np.zeros((20, 200), dtype=np.uint8)
    x = (200 - rq.text_w(text)) // 2
    for c in text:
        i = ord(c) - 0x20
        if 0 <= i < len(rq.GLYPHS):
            off, w, h, xa, xo, yo = rq.GLYPHS[i]; bit = 0
            for yy in range(h):
                for xx in range(w):
                    if rq.BITMAPS[off + (bit >> 3)] & (0x80 >> (bit & 7)):
                        px, py = x + xo + xx, 15 + yo + yy
                        if 0 <= px < 200 and 0 <= py < 20: fb[py, px] = 1
                    bit += 1
            x += xa
    im = Image.fromarray((fb * 255).astype(np.uint8), "L").resize((200 * scale, 20 * scale), Image.NEAREST)
    glow = im.filter(ImageFilter.GaussianBlur(scale * 1.3))
    alpha = ImageChops.lighter(im, Image.eval(glow, lambda v: int(v * 0.45)))
    return Image.new("RGB", im.size, YELLOW), alpha

def small_font(size):
    for name in ("cour.ttf", "consola.ttf", "DejaVuSansMono.ttf"):
        try: return ImageFont.truetype(name, size)
        except Exception: pass
    return ImageFont.load_default()

class Src:
    def __init__(self, folder):
        self.dir = pathlib.Path(folder); ix = json.load(open(self.dir / "index.json"))
        self.shots = sorted(ix["shots"]); self.glass = sorted(ix["glass"]); self.events = ix["events"]
        self.st = np.array([s[0] for s in self.shots]); self.gt = np.array([g[0] for g in self.glass])
        self.gsc = np.array([(g[2] if len(g) > 2 else 0) for g in self.glass]); self.gpass = np.array([(g[3] if len(g) > 3 else 0) for g in self.glass])
        r = ix.get("rects", {}).get("cvFront", [314.5, 387, 131, 64]); self.front = r
        self.top = ix.get("rects", {}).get("cvTop", [814.3, 273.8, 131, 64])
        cx, cy = r[0] + r[2] / 2, r[1] + r[3] / 2
        self.unit = (int(cx + UNIT[0]), int(cy + UNIT[1]), int(cx + UNIT[2]), int(cy + UNIT[3]))
        self.k = W / (self.unit[2] - self.unit[0])
        self._cache = {}
    def ev(self, name, last=False):
        ts = [e["t"] for e in self.events if e["name"] == name]
        return (ts[-1] if last else ts[0]) if ts else None
    def evs(self, name): return [e["t"] for e in self.events if e["name"] == name]
    def shift(self, t):
        """the picture's jitter: the unit region's offset against a reference frame, in view px"""
        import cv2
        i = int(np.searchsorted(self.st, t, side="right")) - 1; i = max(0, min(len(self.shots) - 1, i))
        if not hasattr(self, "_ref"):
            t0 = (self.ev("idle") or self.st[0]) + 500; j = max(0, int(np.searchsorted(self.st, t0, side="right")) - 1)
            self._ref = np.float32(np.asarray(Image.open(self.dir / "shots" / self.shots[j][1]).convert("L").crop(self.unit))); self._shifts = {}
        if i not in self._shifts:
            cur = np.float32(np.asarray(Image.open(self.dir / "shots" / self.shots[i][1]).convert("L").crop(self.unit)))
            (dx, dy), _ = cv2.phaseCorrelate(self._ref, cur)
            self._shifts[i] = (dx, dy) if abs(dx) < 6 and abs(dy) < 6 else (0.0, 0.0)
        return self._shifts[i]
    def raw(self, t):
        i = int(np.searchsorted(self.st, t, side="right")) - 1; i = max(0, min(len(self.shots) - 1, i))
        k = ("r", i)
        if k not in self._cache:
            self._cache[k] = Image.open(self.dir / "shots" / self.shots[i][1]).convert("L")
            if len(self._cache) > 60: self._cache.pop(next(iter(self._cache)))
        return self._cache[k]
    def shot(self, t): return self.raw(t).crop(CRT).resize((W, MON_H), Image.LANCZOS)
    def zoom(self, t):
        u = self.unit; im = self.raw(t).crop(u)
        return im.resize((W, int((u[3] - u[1]) * self.k)), Image.LANCZOS)
    def gi(self, t):
        i = int(np.searchsorted(self.gt, t, side="right")) - 1; return max(0, min(len(self.glass) - 1, i))
    def score_at(self, t):
        """the reel's score: high to begin with, the game's own distance under it, a jump for every car passed"""
        i = self.gi(t); return int(2740 + (self.gsc[:i + 1].max() * 3 + self.gpass[:i + 1].max() * 45 if i >= 0 else 0))   # never falls: the run's best so far
    def fb(self, t, which):
        if t < self.gt[0]: return Image.new("L", (128, 64), 0)
        i = self.gi(t)
        n = self.glass[i][1]
        im = Image.open(self.dir / "glass" / f"{n:05d}_{which}.png").convert("L")
        return im.resize((128, 64), Image.NEAREST) if im.width != 128 else im

def fb_text(rq, fb, x, y, text):
    """the machine's font into any framebuffer width (the template's own writer stops at the glass's 128 px)"""
    H_, W_ = fb.shape
    for ch in text:
        i = ord(ch) - 0x20
        if 0 <= i < len(rq.GLYPHS):
            off, w, h, xa, xo, yo = rq.GLYPHS[i]; bit = 0
            for yy in range(h):
                for xx in range(w):
                    if rq.BITMAPS[off + (bit >> 3)] & (0x80 >> (bit & 7)):
                        px, py = x + xo + xx, y + yo + yy
                        if 0 <= px < W_ and 0 <= py < H_: fb[py, px] = 1
                    bit += 1
            x += xa
def fb_centered(rq, fb, y, text): fb_text(rq, fb, (128 - rq.text_w(text)) // 2, y, text)

def overlay(rq, fb, mode, score):
    """the reel's own marks on the drawn glass (inaccurate, not deceitful): the big score over the game's small one,
    the selected row in inverse video, the NEW HIGH SCORE card"""
    a = (np.asarray(fb, dtype=np.uint8) > 127).astype(np.uint8)
    if mode == "score":
        a[0:15, 78:128] = 0; s = str(score); fb_text(rq, a, 127 - rq.text_w(s), 13, s)
    elif mode == "select":
        a[38:58, :] = 1 - a[38:58, :]
    elif mode == "highscore":
        a[:, :] = 0
        title = np.zeros((32, 256), dtype=np.uint8); fb_text(rq, title, (256 - rq.text_w("NEW HIGH SCORE")) // 2, 14, "NEW HIGH SCORE")
        a[2:18, :] = (title.reshape(16, 2, 128, 2).sum(axis=(1, 3)) >= 2).astype(np.uint8)   # the title at half size, strokes kept thin
        num = np.zeros((20, 128), dtype=np.uint8); s_ = str(score); fb_text(rq, num, (128 - rq.text_w(s_)) // 2, 15, s_)
        big = np.kron(num, np.ones((2, 2), dtype=np.uint8))                       # the figure at twice: 40 x 256, centred
        a[22:62, :] = np.maximum(a[22:62, :], big[:, 64:192])
    return Image.fromarray(a * 255, "L")

def lens(im, k1=0.10, fringe=1.4):
    """the glass over the LCD: a barrel warp and a soft fringe, both growing toward the edges"""
    import cv2
    a = np.asarray(im, dtype=np.float32); h, w = a.shape
    yy, xx = np.mgrid[:h, :w].astype(np.float32)
    nx, ny = (xx - w / 2) / (w / 2), (yy - h / 2) / (h / 2); r2 = nx * nx + ny * ny
    f = 1 + k1 * r2
    mx, my = (w / 2 + nx * f * (w / 2)).astype(np.float32), (h / 2 + ny * f * (h / 2)).astype(np.float32)
    warped = cv2.remap(a, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    g = fringe * r2
    fx, fy = (w / 2 + nx * (f + 0.012) * (w / 2)).astype(np.float32), (h / 2 + ny * (f + 0.012) * (h / 2)).astype(np.float32)
    ghost = cv2.GaussianBlur(cv2.remap(a, fx, fy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0), (0, 0), 1.2)
    out = warped * (1 - 0.35 * np.clip(g, 0, 1)) + ghost * 0.35 * np.clip(g, 0, 1)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "L")

def inside_view(region, rw, rh, bx, by, lit, rng):
    """the top window's interior, drawn: darkness with a grain, a recessed slab a quarter larger than the aperture,
    a bevel lit on its upper edges and shadowed below, the module's face near black with its pixel pitch, the lit
    pixels through the lens, the whole feathered into the photograph"""
    W_, H_ = region.size
    a = np.full((H_, W_), 22, dtype=np.float32) + rng.normal(0, 2.5, (H_, W_))
    a *= np.linspace(1.15, 0.85, H_)[:, None]
    ow, oh = int(rw * 1.25), int(rh * 1.25); ox, oy = bx + rw // 2 - ow // 2, by + rh // 2 - oh // 2
    bev = 6
    a[oy - bev:oy + oh + bev, ox - bev:ox + ow + bev] = 34                       # the slab's rim
    a[oy - bev:oy, ox - bev:ox + ow + bev] = 96                                  # light on the top edge
    a[oy - bev:oy + oh + bev, ox - bev:ox] = 72                                  # and the left
    a[oy + oh:oy + oh + bev, ox - bev:ox + ow + bev] = 8                         # shadow below
    a[oy - bev:oy + oh + bev, ox + ow:ox + ow + bev] = 12                        # and right
    face = np.full((oh, ow), 10, dtype=np.float32)
    pitch = max(2, ow // 128); face[::pitch, :] += 4; face[:, ::pitch] += 4       # the module's pixel pitch, barely
    a[oy:oy + oh, ox:ox + ow] = face
    base = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "L")
    screen = lens(lit.resize((ow, oh), Image.LANCZOS), 0.10, 1.4)
    slab = base.crop((ox, oy, ox + ow, oy + oh)); base.paste(ImageChops.lighter(slab, screen), (ox, oy))
    m = Image.new("L", region.size, 0); ImageDraw.Draw(m).rectangle([18, 18, W_ - 18, H_ - 18], fill=255)
    return Image.composite(base, region, m.filter(ImageFilter.GaussianBlur(14)))

def glass_lit(fb):
    """the front glass as the site draws it: an integer scale with the interlace gap baked in, then bloom"""
    Z = 5
    g = fb.resize((128 * Z, 64 * Z), Image.NEAREST); a = np.asarray(g, dtype=np.float32)
    mask = np.ones(64 * Z, dtype=np.float32)
    for r in range(0, 64, 2): mask[r * Z + 2 * Z - 2: r * Z + 2 * Z] = 0.35
    lit = Image.fromarray(np.clip(a * mask[:, None], 0, 255).astype(np.uint8), "L")
    glow = lit.filter(ImageFilter.GaussianBlur(Z * 0.8))
    return Image.fromarray(np.clip(np.asarray(lit, dtype=np.float32) * 0.92 + np.asarray(glow, dtype=np.float32) * 0.5, 0, 255).astype(np.uint8), "L")

# the zoom levels: crops of the monitor's picture, in view px around the front glass canvas centre (cx, cy)
LEVELS = {"unit": dict(left=-202, right=232, top=-241), "mid": dict(left=-165, right=165, top=-241), "glass": dict(left=-95, right=95, centre=True),
          "topglass": dict(left=-95, right=95, centre=True, canvas="cvTop")}
CAP = dict(left=-202, right=232, top=-241, height=44)          # the ridged cap: the band the name sits on
BAND_H = 110

def view_crop(S, level, box_h):
    """the crop rectangle in view px for a level filling W x box_h"""
    L = LEVELS[level]; r = S.top if L.get("canvas") == "cvTop" else S.front; cx, cy = r[0] + r[2] / 2, r[1] + r[3] / 2
    x0, x1 = cx + L["left"], cx + L["right"]; k = W / (x1 - x0); h = box_h / k
    y0 = cy - h / 2 if L.get("centre") else cy + L["top"]
    return (x0, y0, x1, y0 + h), k

def render_zoom(S, t, which, level, box_h, frame_i, rng, fb_override=None):
    """the monitor's picture cropped to a level, the story's screen drawn into the glass, the read over it"""
    (x0, y0, x1, y1), k = view_crop(S, level, box_h)
    base = S.raw(t).crop((int(x0), int(y0), int(x1), int(y1))).resize((W, box_h), Image.LANCZOS)
    fbi = fb_override if fb_override is not None else S.fb(t, which)
    if t >= S.gt[0] and level == "topglass":
        r = S.top; rw, rh = int(round(r[2] * k)), int(round(r[3] * k)); bx, by = int(round((r[0] - x0) * k)), int(round((r[1] - y0) * k))
        Z = 4; g = fbi.resize((128 * Z, 64 * Z), Image.NEAREST); a = np.asarray(g, dtype=np.float32)
        mask = np.ones(64 * Z, dtype=np.float32); mask[3::4] = 0.55                       # a fine row gap, the OLED's own
        lit = Image.fromarray(np.clip(a * mask[:, None] * 0.82, 0, 255).astype(np.uint8), "L")
        lit = Image.fromarray(np.clip(np.asarray(lit, dtype=np.float32) + np.asarray(lit.filter(ImageFilter.GaussianBlur(3)), dtype=np.float32) * 0.25, 0, 255).astype(np.uint8), "L")
        pad = int(rw * 0.25) + 60; box = (max(0, bx - pad), max(0, by - pad), min(W, bx + rw + pad), min(box_h, by + rh + pad))
        region = base.crop(box)
        base.paste(inside_view(region, rw, rh, bx - box[0], by - box[1], lit, rng), box[:2])   # our own inside view
        return secmon(base, frame_i, rng)
    if t >= S.gt[0]:
        r = S.top if LEVELS[level].get("canvas") == "cvTop" else S.front
        pad = 14   # the site's canvas edge shows as a faint line in the photo of the glass: the patch is blended
        # into the glass around it (the ring's own grey), then only the lit pixels are added
        sx, sy = S.shift(t)                                                                       # the picture's own twitch
        rw, rh = int(round(r[2] * k)), int(round(r[3] * k)); bx, by = int(round((r[0] - x0 + sx) * k)), int(round((r[1] - y0 + sy) * k))
        box = (bx - pad, by - pad, bx + rw + pad, by + rh + pad)
        region = base.crop(box); a = np.asarray(region, dtype=np.float32)
        ring = np.concatenate([a[:pad].ravel(), a[-pad:].ravel(), a[:, :pad].ravel(), a[:, -pad:].ravel()])
        fill = Image.new("L", region.size, int(np.median(ring)))
        m = Image.new("L", region.size, 0); ImageDraw.Draw(m).rectangle([pad // 2, pad // 2, region.width - pad // 2, region.height - pad // 2], fill=255)
        m = m.filter(ImageFilter.GaussianBlur(pad / 2))
        flat = Image.composite(fill, region, m)
        lit = lens(glass_lit(fbi).resize((rw + 2 * pad, rh + 2 * pad), Image.LANCZOS), 0.08, 1.2)
        drawn = ImageChops.lighter(flat, lit)
        # clipped to the round window: a disc a little inside the bezel, feathered, so the corners fall away and the edge blends
        cx_, cy_ = region.width / 2, region.height / 2; rad = 70 * k
        disc = Image.new("L", region.size, 0); ImageDraw.Draw(disc).ellipse([cx_ - rad, cy_ - rad, cx_ + rad, cy_ + rad], fill=255)
        disc = disc.filter(ImageFilter.GaussianBlur(6))
        base.paste(Image.composite(drawn, region, disc), box[:2])
    return secmon(base, frame_i, rng)

def cap_band(S, t):
    r = S.front; cx, cy = r[0] + r[2] / 2, r[1] + r[3] / 2
    return S.raw(t).crop((int(cx + CAP["left"]), int(cy + CAP["top"]), int(cx + CAP["right"]), int(cy + CAP["top"] + CAP["height"]))).resize((W, BAND_H), Image.LANCZOS)

_scan = None
def secmon(im, frame_i, rng):
    """the closed-circuit read: scanlines at 3 px, a slow roll, a breath of flicker, the vignette"""
    global _scan
    a = np.asarray(im, dtype=np.float32)
    if _scan is None or _scan[0].shape[0] != a.shape[0]:
        m = np.ones(a.shape[0], dtype=np.float32); m[::3] = 0.74
        yy, xx = np.mgrid[:a.shape[0], :a.shape[1]]
        v = 1 - 0.22 * (((xx - a.shape[1] / 2) / (a.shape[1] / 2)) ** 2 + ((yy - a.shape[0] / 2) / (a.shape[0] / 2)) ** 2) ** 1.2
        _scan = (m, np.clip(v, 0, 1).astype(np.float32))
    m, v = _scan
    roll = (frame_i * 4) % (a.shape[0] + 200) - 100
    band = np.exp(-((np.arange(a.shape[0]) - roll) / 60.0) ** 2) * 0.07
    a = a * (m + band)[:, None] * v * (1 + rng.normal(0, 0.012))
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "L")

def tear(im, rng, lift=1.12):
    a = np.asarray(im).copy(); h = a.shape[0]
    y0 = int(rng.uniform(0.15, 0.75) * h); y1 = min(h, y0 + int(rng.uniform(40, 160)))
    a[y0:y1] = np.roll(a[y0:y1], int(rng.uniform(-48, 48)), axis=1)
    return Image.fromarray(np.clip(a.astype(np.float32) * lift, 0, 255).astype(np.uint8))

def boom(im, k, rng):
    """the collision: a white burst decaying, the picture shaken, torn now and then"""
    a = np.asarray(im, dtype=np.float32)
    burst = max(0.0, 0.85 * (1 - k) ** 2)
    a = a * (1 - burst) + 255 * burst
    dx = int(rng.uniform(-1, 1) * 22 * (1 - k) ** 1.5)
    a = np.roll(a, dx, axis=1)
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    return tear(out, rng, 1.0) if (k < 0.35 and rng.random() < 0.5) else out

def compose(S, t, which, plate, name_on, font, frame_i, rng, fx=None, k=0.0, layout="mon-glass", level="glass", rq=None, mode=None, fb_override=None, qlayer=None):
    f = Image.new("L", (W, H), 0)
    f.paste(S.shot(t), (0, MON_Y))
    fbo = fb_override
    if mode and rq is not None: fbo = overlay(rq, fbo if fbo is not None else S.fb(t, which), mode, S.score_at(t))
    f.paste(render_zoom(S, t, which, "topglass" if which == "top" else "glass", H - ZOOM_Y, frame_i, rng, fbo), (0, ZOOM_Y))
    out = f.convert("RGB")
    if name_on and plate is not None:
        col, alpha = plate; out.paste(col, ((W - col.width) // 2, ZOOM_Y + 4), alpha)
    if qlayer is not None: out = Image.alpha_composite(out.convert("RGBA"), qlayer).convert("RGB")
    ImageDraw.Draw(out).text((26, 6), BRANCH, fill=(112, 112, 112), font=font)
    if fx == "white": out = Image.blend(out, Image.new("RGB", (W, H), (255, 255, 255)), 0.75)
    elif fx == "tear": out = tear(out, rng)
    elif fx == "boom": out = boom(out, k, rng)
    return out

# ── the beat table as clips ─────────────────────────────────────────────────
def clips(S):
    t_twin = S.ev("twin"); t_reach, t_end = S.ev("reached"), S.ev("end")
    presses = sorted(S.evs("scroll") + S.evs("click")); t_walk = presses[0] if presses else S.ev("idle") + 800
    sels = [e["t"] for e in S.events if e["name"] == "click" and e.get("row") == "enter"]
    t_sel = sels[-1] if sels else S.ev("click", last=True)                                              # the click that enters the feature
    # the run: the game over with the longest run before it (a short restart after the mistake never wins)
    gos = S.evs("gameover") or [t_end - 1500]; runs_all = S.evs("gamerun") or [S.ev("play")]
    def run_len(g): return g - max([r for r in runs_all if r < g] or [S.ev("play")])
    t_go = max(gos, key=run_len)
    runs = [t for t in runs_all if t < t_go]; t_run0 = (runs[-1] if runs else S.ev("play")) + 300
    first_run = (S.evs("gamerun") or [S.ev("play") + 1200])[0]
    c = []
    c.append(dict(t0=t_twin + 1500, t1=t_twin + 2300, speed=1, glass="front", name=False))             # 1 the monitor booted; the glass's own noise, half a beat
    c.append(dict(t0=t_walk - 600, t1=t_sel + 200, speed=1, glass="front", name=False))               # 2 the walk, choreographed by the machine
    c.append(dict(t0=first_run + 150, t1=first_run + 1100, speed=1, glass="top", name=True, mode="score", fx={0: "white", 1: "tear"}))   # 3 the top window: the game lands, the name and the pop
    c.append(dict(t0=t_run0, t1=t_go - 40, ramp=(5.0, 10.0), glass="top", name=True, mode="score"))    # 6 the race: five times, climbing to ten
    c.append(dict(t0=t_go - 480, t1=t_go - 30, hold=(56, 14), glass="top", name=True, boom=True, mode="score"))   # 7 WHAM: slow motion to a stop
    c.append(dict(t0=t_go + 300, t1=t_go + 1400, speed=1, glass="top", name=True, mode="highscore"))   # 8 NEW HIGH SCORE, a beat
    return c

# ── the ask (story §16): the question put to the machine, the answer rising out of the murk ──────────
def clips_ask(S):
    t_twin = S.ev("twin"); presses = sorted(S.evs("scroll") + S.evs("click")); t_walk = presses[0] if presses else S.ev("idle") + 800
    sels = [e["t"] for e in S.events if e["name"] == "click" and e.get("row") == "enter"]; t_sel = sels[-1]
    t_card, t_q, t_shake = S.ev("ask-card"), S.ev("question"), S.ev("play-shake")
    t_ans = S.ev("answer") or (t_shake + 1600)
    c = []
    c.append(dict(t0=t_twin + 1500, t1=t_twin + 2300, speed=1, glass="front", name=False))                 # 1 the monitor booted; the glass's own noise, half a beat
    c.append(dict(t0=t_walk - 600, t1=t_sel + 200, speed=1, glass="front", name=False))                   # 2 the walk: Answers, ASK MGK, MGK-NIAC (the payload's flashes)
    c.append(dict(t0=t_sel + 200, t1=t_sel + 1300, speed=1, glass="front", name=False))                   # 3 the machine's own card: OUTPUT REDIRECTED TO FLUIDIC SUSPENSION
    c.append(dict(t0=t_card + 80, t1=t_q, speed=1, glass="top", name=True, fx={0: "white", 1: "tear"}))   # 4 cut to the top window: Ask question, then shake; the name lands
    c.append(dict(t0=t_q, t1=t_shake, speed=1, glass="top", name=True, question=True))                    # 5 the adult asks; the words as spoken
    c.append(dict(t0=t_shake, t1=t_ans + 250, speed=1, glass="top", name=True, question=True))            # 6 the shake; the die rises through the murk
    c.append(dict(t0=t_ans + 250, t1=t_ans + 2400, speed=1, glass="top", name=True, question=True))       # 7 the answer holds on its creep, before the machine's own hint; the question stays
    return c

def sound_ask(S, cl, total_s, black_s, td, voice):
    """the hum, the glass's noise, the flashes and ticks, the sting at the hand-off, the adult, the rattle, the relays, the landing"""
    sfx = np.zeros(int(total_s * SR) + 1); rng = np.random.default_rng(5)
    def add(t0, sig):
        i = int(t0 * SR); j = min(len(sfx), i + len(sig)); sfx[i:j] += sig[:j - i]
    def tick(amp=0.35, ms=4, hz=2200):
        n = int(ms * SR / 1000); e = np.exp(-np.arange(n) / (n / 3)); return amp * e * np.sin(2 * np.pi * hz * np.arange(n) / SR)
    def tone(amp, ms, hz):
        n = int(ms * SR / 1000); e = np.minimum(1, np.arange(n) / 200) * np.exp(-np.arange(n) / (n / 1.6)); return amp * e * np.sin(2 * np.pi * hz * np.arange(n) / SR)
    starts, lens = [], []; acc = 0.0
    for c in cl: starts.append(acc); lens.append(len(frames_of(c)) / FPS); acc += lens[-1]
    def reel_t(t):
        for c, s0 in zip(cl, starts):
            if c["t0"] <= t <= c["t1"]: return s0 + (t - c["t0"]) / 1000 / c["speed"]
        return None
    tt = np.arange(int(total_s * SR)) / SR
    add(0, 0.016 * (np.sin(2 * np.pi * 55 * tt) + 0.5 * np.sin(2 * np.pi * 110 * tt)) * np.minimum(1, tt / 0.3))     # the hum, faded in so the join cannot click
    n = int(lens[0] * SR); add(starts[0], 0.06 * np.convolve(rng.standard_normal(n), np.ones(4) / 4, mode="same"))     # the glass's own noise
    n_fl = len([x for x in S.events if x["name"].startswith("flash-")])
    for e in S.events:
        if e["name"].startswith("flash-"):
            r = reel_t(e["t"])
            if r is None: continue
            times = 3 if e["name"] == "flash-%d" % (n_fl - 1) else 1
            for k in range(times): add(r + k * 0.34, tone(0.3, 90, 880)); add(r + k * 0.34 + 0.09, tone(0.3, 160, 1320))
        if e["name"] in ("scroll", "click"):
            r = reel_t(e["t"])
            if r is not None: add(r, tick(0.45 if "click" in e["name"] else 0.3, 5, 1500 if "click" in e["name"] else 2400))
    r = starts[3]; add(r, tone(0.35, 120, 660)); add(r + 0.11, tone(0.35, 220, 990))                                    # the sting: the tube changes hands
    n_th = int(0.16 * SR); e = np.exp(-np.arange(n_th) / (n_th / 4)); add(r + 0.02, 0.5 * e * np.sin(2 * np.pi * 85 * np.arange(n_th) / SR))
    add(starts[4], voice * 0.9)                                                                                          # the adult asks
    r = starts[5]
    for m in range(3): add(r + 0.06 * m, tick(0.5, 6, 900 + 300 * m))                                                   # the rattle
    n_r = int(max(0.1, lens[5] - 0.3) * SR); k = np.arange(n_r) / SR                                                    # the relays while the die rises
    add(r + 0.3, 0.05 * np.sign(np.sin(2 * np.pi * 9 * k)) * np.exp(-k / 1.4) * rng.uniform(0.4, 1, n_r))
    add(starts[6], tick(0.4, 8, 1300)); add(starts[6] + 0.02, tone(0.25, 260, 440))                                     # the answer lands
    f = td / "sfx.wav"
    with wave.open(str(f), "wb") as wv:
        wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((np.clip(sfx, -1, 1) * 32767).astype("<i2").tobytes())
    return f

QFONT = r"C:\Windows\Fonts\georgiab.ttf"     # the house's question type (the Q&A reel)
QSIZE, QLEAD, QBOTTOM, QWIDTH = 56, 68, 1800, 960
_qcache = {}
def question_layer(words, shown):
    """the question as spoken: the words said so far, white with a dark halo, centred low in the zoom-in"""
    k = (tuple(words), shown)
    if k in _qcache: return _qcache[k]
    f = ImageFont.truetype(QFONT, QSIZE); rows, cur = [], []
    for w in words:
        if cur and f.getlength(" ".join(cur + [w])) > QWIDTH: rows.append(cur); cur = [w]
        else: cur = cur + [w]
    if cur: rows.append(cur)
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    y0 = QBOTTOM - len(rows) * QLEAD; idx = 0
    for r, row in enumerate(rows):
        text = " ".join(row); x = (W - f.getlength(text)) / 2; y = y0 + r * QLEAD
        for w in row:
            if idx < shown: d.text((x, y), w, font=f, fill=(255, 255, 255, 255))
            x += f.getlength(w + " "); idx += 1
    halo = L.split()[3].filter(ImageFilter.GaussianBlur(10)); halo = halo.point(lambda v: min(255, int(v * 1.6)))
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0)); out.paste((0, 0, 0, 200), (0, 0), halo); out.alpha_composite(L)
    _qcache[k] = out; return out

def frames_of(c):
    """the page times this clip samples, one per output frame"""
    if "still" in c: return [c["t0"]] * c["still"]
    if "hold" in c:
        n, freeze = c["hold"]; span = c["t1"] - c["t0"]
        w = np.array([(1 - k / n) ** 2 for k in range(n)]); w = w / w.sum() * span
        ts = list(c["t0"] + np.cumsum(w) - w[0]); return ts + [ts[-1]] * freeze
    if "ramp" in c:
        s0, s1 = c["ramp"]; span = c["t1"] - c["t0"]
        mean = s0 + (s1 - s0) / 3; n = max(2, int(round(span / 1000 * FPS / mean)))
        u = np.arange(n) / (n - 1); sp = s0 + (s1 - s0) * u ** 2
        ts = c["t0"] + np.concatenate([[0], np.cumsum(sp[:-1])]) * 1000 / FPS
        return list(np.minimum(ts, c["t1"]))
    n = int(round((c["t1"] - c["t0"]) / 1000 * FPS / c["speed"]))
    return [c["t0"] + k * 1000 / FPS * c["speed"] for k in range(n)]

def sound(S, cl, total_s, black_s, td):
    sfx = np.zeros(int(total_s * SR) + 1); rng = np.random.default_rng(3)
    def add(t0, sig):
        i = int(t0 * SR); j = min(len(sfx), i + len(sig)); sfx[i:j] += sig[:j - i]
    def tick(amp=0.35, ms=4, hz=2200):
        n = int(ms * SR / 1000); e = np.exp(-np.arange(n) / (n / 3)); return amp * e * np.sin(2 * np.pi * hz * np.arange(n) / SR)
    def tone(amp, ms, hz):
        n = int(ms * SR / 1000); e = np.minimum(1, np.arange(n) / 200) * np.exp(-np.arange(n) / (n / 1.6)); return amp * e * np.sin(2 * np.pi * hz * np.arange(n) / SR)
    starts, lens = [], []; acc = 0.0
    for c in cl:
        starts.append(acc); lens.append(len(frames_of(c)) / FPS); acc += lens[-1]
    def reel_t(t):
        for c, s0 in zip(cl, starts):
            if "hold" in c or "ramp" in c: continue
            if c["t0"] <= t <= c["t1"]: return s0 + (t - c["t0"]) / 1000 / c["speed"]
        return None
    i_boom = next(i for i, c in enumerate(cl) if c.get("boom")); t_crash = starts[i_boom]; t_card = starts[i_boom + 1]
    def reel_t(t):   # page time -> reel time through the clips (the ramp and the hold are not linear and are skipped)
        for c, s0 in zip(cl, starts):
            if "hold" in c or "ramp" in c or "still" in c: continue
            if c["t0"] <= t <= c["t1"]: return s0 + (t - c["t0"]) / 1000 / c["speed"]
        return None
    tt = np.arange(int(t_crash * SR)) / SR
    add(0, 0.016 * (np.sin(2 * np.pi * 55 * tt) + 0.5 * np.sin(2 * np.pi * 110 * tt)))                # the hum, until the crash
    n = int(lens[0] * SR); add(starts[0], 0.06 * np.convolve(rng.standard_normal(n), np.ones(4) / 4, mode="same"))   # the glass's own noise, half a beat
    for e in S.events:                                                                                    # the clicks, recognised
        if e["name"].startswith("flash-"):
            r = reel_t(e["t"])
            if r is None: continue
            times = 3 if e["name"] == "flash-%d" % (len([x for x in S.events if x["name"].startswith("flash-")]) - 1) else 1
            for k in range(times): add(r + k * 0.34, tone(0.3, 90, 880)); add(r + k * 0.34 + 0.09, tone(0.3, 160, 1320))
    for e in S.events:
        if e["name"] in ("scroll", "click", "play-click", "play-shake"):
            r = reel_t(e["t"])
            if r is not None: add(r, tick(0.45 if "click" in e["name"] else 0.3, 5, 1500 if "click" in e["name"] else 2400))
    r = starts[2]; add(r, tone(0.35, 120, 660)); add(r + 0.11, tone(0.35, 220, 990))                    # the sting: the payload lands
    n_th = int(0.16 * SR); e = np.exp(-np.arange(n_th) / (n_th / 4)); add(r + 0.02, 0.5 * e * np.sin(2 * np.pi * 85 * np.arange(n_th) / SR))
    for i, c in enumerate(cl):                                                                           # the engine, climbing with the speed
        if "ramp" in c and i < i_boom:
            s0, L = starts[i], lens[i]; n = int(L * SR); u = np.arange(n) / n
            sp = c["ramp"][0] + (c["ramp"][1] - c["ramp"][0]) * u ** 2
            ph = 2 * np.pi * np.cumsum(60 + 26 * sp) / SR
            drone = 0.07 * (np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph)) * (0.8 + 0.2 * np.sin(2 * np.pi * 7 * u * L))
            add(s0, drone * np.minimum(1, np.arange(n) / 2000))
    n_th = int(0.45 * SR); e = np.exp(-np.arange(n_th) / (n_th / 5))                                     # WHAM
    add(t_crash, 0.9 * e * np.sin(2 * np.pi * 55 * np.arange(n_th) / SR) + 0.5 * e * rng.standard_normal(n_th))
    n_f = int((t_card - t_crash) * SR); k = np.arange(n_f) / SR                                          # the low tone dying through the slow motion
    add(t_crash + 0.1, 0.03 * np.exp(-k / 1.1) * np.sin(2 * np.pi * (70 - 40 * np.minimum(1, k / 1.6)) * k))
    add(t_card, tick(0.4, 8, 1300))                                                                       # the card lands
    f = td / "sfx.wav"
    with wave.open(str(f), "wb") as wv:
        wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((np.clip(sfx, -1, 1) * 32767).astype("<i2").tobytes())
    return f

def assemble(folder, row, out_dir, layout="mon-unit"):
    S = Src(folder); rq = load_font()
    plate = name_plate(rq, row["feature"].upper(), 4); font = small_font(21)
    ask = row.get("story") == "ask"
    voice, qwords, onsets = None, [], []
    if ask:
        import importlib; V = importlib.import_module("reels-voice")
        qtext = row.get("question") or "Will it rain on the parade?"
        voice, timed = V.render_timed(qtext); qwords = qtext.split(); onsets = [o for o, d_, w_ in timed]
    cl = clips_ask(S) if ask else clips(S); BLACK_S = 0.3; rng = np.random.default_rng(11)
    td = pathlib.Path(tempfile.mkdtemp()); frames = td / "frames"; frames.mkdir()
    n = 0; t_q0 = None
    for c in cl:
        fx = c.get("fx", {}); ts = frames_of(c)
        if c.get("question") and t_q0 is None: t_q0 = n / FPS
        for k, t in enumerate(ts):
            e = fx.get(k); kk = 0.0
            if c.get("boom"): e = "boom"; kk = k / max(1, len(ts) - 1)
            ql = None
            if c.get("question"):
                shown = sum(1 for o in onsets if n / FPS - t_q0 >= o); ql = question_layer(qwords, shown)
            compose(S, t, c["glass"], plate, c["name"], font, n, rng, e, kk, layout, c.get("level", "glass"), rq, c.get("mode"), qlayer=ql).save(frames / f"{n:05d}.png"); n += 1
    for k in range(int(BLACK_S * FPS)): Image.new("RGB", (W, H), (0, 0, 0)).save(frames / f"{n:05d}.png"); n += 1
    total_s = n / FPS; print(f"  {len(cl)} clips, {n} frames, {total_s:.1f}s + the pop")
    sfx = sound_ask(S, cl, total_s, BLACK_S, td, voice) if ask else sound(S, cl, total_s, BLACK_S, td)
    middle = td / "middle.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", str(frames / "%05d.png"), "-i", str(sfx),
                    "-filter_complex", "[1:a]aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:d=0.03[a]", "-map", "0:v", "-map", "[a]", "-shortest",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", str(middle)], check=True)
    out_dir.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", row["feature"].lower()).strip("-")
    dest = out_dir / f"feature_{slug}_{layout}.mp4"
    vf = ("[0:v]scale=1080:1920,fps=30,format=gray,format=yuv420p,setsar=1[v0];[0:a]aformat=sample_rates=48000:channel_layouts=stereo[a0];"
          "[1:v]fps=30,format=yuv420p,setsar=1[v1];[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(POP), "-i", str(middle), "-filter_complex", vf, "-map", "[v]", "-map", "[a]",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(dest)], check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dest)], capture_output=True, text=True).stdout)
    print(f"  wrote {dest}  {dur:.1f}s"); return dest

if __name__ == "__main__":
    folder = sys.argv[1]; feat = sys.argv[2] if len(sys.argv) > 2 else "Tilt Drive"
    for layout in (sys.argv[3] if len(sys.argv) > 3 else "mon-unit").split(","):
        print(f"layout {layout}"); assemble(pathlib.Path(folder), {"feature": feat}, ROOT / "reels" / "out" / "features", layout)
