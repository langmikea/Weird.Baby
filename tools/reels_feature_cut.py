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
    for ch in text:
        i = ord(ch) - 0x20
        if 0 <= i < len(rq.GLYPHS): rq.fb_char(fb, x, y, ch); x += rq.GLYPHS[i][3]
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
        a[:, :] = 0; fb_centered(rq, a, 20, "NEW HIGH"); fb_centered(rq, a, 38, "SCORE"); fb_centered(rq, a, 58, str(score))
    return Image.fromarray(a * 255, "L")

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
LEVELS = {"unit": dict(left=-202, right=232, top=-241), "mid": dict(left=-165, right=165, top=-241), "glass": dict(left=-128, right=128, top=-171),
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
        lit = Image.fromarray(np.clip(a * mask[:, None] * 0.78, 0, 255).astype(np.uint8), "L")   # cyan reads mid-bright in grey
        lit = lit.resize((rw, rh), Image.LANCZOS)
        pad = 10; box = (bx - pad, by - pad, bx + rw + pad, by + rh + pad + 12)   # the aperture runs a little below the canvas
        region = base.crop(box); ra = np.asarray(region, dtype=np.float32)
        ring = np.concatenate([ra[:pad].ravel(), ra[-pad:].ravel(), ra[:, :pad].ravel(), ra[:, -pad:].ravel()])
        m = Image.new("L", region.size, 0); ImageDraw.Draw(m).rectangle([pad // 2, pad // 2, region.width - pad // 2, region.height - pad // 2], fill=255)
        flat = Image.composite(Image.new("L", region.size, int(np.median(ring))), region, m.filter(ImageFilter.GaussianBlur(pad / 2)))
        full = Image.new("L", region.size, 0); full.paste(lit, (pad, pad))
        base.paste(ImageChops.lighter(flat, full), box[:2])                                    # the aperture flattened, the glass's reflections outside it kept
        return secmon(base, frame_i, rng)
    if t >= S.gt[0]:
        r = S.top if LEVELS[level].get("canvas") == "cvTop" else S.front
        pad = 14   # the site's canvas edge shows as a faint line in the photo of the glass: the patch is blended
        # into the glass around it (the ring's own grey), then only the lit pixels are added
        rw, rh = int(round(r[2] * k)), int(round(r[3] * k)); bx, by = int(round((r[0] - x0) * k)), int(round((r[1] - y0) * k))
        box = (bx - pad, by - pad, bx + rw + pad, by + rh + pad)
        region = base.crop(box); a = np.asarray(region, dtype=np.float32)
        ring = np.concatenate([a[:pad].ravel(), a[-pad:].ravel(), a[:, :pad].ravel(), a[:, -pad:].ravel()])
        fill = Image.new("L", region.size, int(np.median(ring)))
        m = Image.new("L", region.size, 0); ImageDraw.Draw(m).rectangle([pad // 2, pad // 2, region.width - pad // 2, region.height - pad // 2], fill=255)
        m = m.filter(ImageFilter.GaussianBlur(pad / 2))
        flat = Image.composite(fill, region, m)
        lit = glass_lit(fbi).resize((rw + 2 * pad, rh + 2 * pad), Image.LANCZOS)
        base.paste(ImageChops.lighter(flat, lit), box[:2])
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

def compose(S, t, which, plate, name_on, font, frame_i, rng, fx=None, k=0.0, layout="mon-glass", level="glass", rq=None, mode=None, fb_override=None):
    f = Image.new("L", (W, H), 0)
    f.paste(S.shot(t), (0, MON_Y))
    fbo = fb_override
    if mode and rq is not None: fbo = overlay(rq, fbo if fbo is not None else S.fb(t, which), mode, S.score_at(t))
    f.paste(render_zoom(S, t, which, "topglass" if which == "top" else "glass", H - ZOOM_Y, frame_i, rng, fbo), (0, ZOOM_Y))
    out = f.convert("RGB")
    if name_on and plate is not None:
        col, alpha = plate; out.paste(col, ((W - col.width) // 2, ZOOM_Y + 10), alpha)
    ImageDraw.Draw(out).text((26, 6), BRANCH, fill=(112, 112, 112), font=font)
    if fx == "white": out = Image.blend(out, Image.new("RGB", (W, H), (255, 255, 255)), 0.75)
    elif fx == "tear": out = tear(out, rng)
    elif fx == "boom": out = boom(out, k, rng)
    return out

# ── the beat table as clips ─────────────────────────────────────────────────
def clips(S):
    t_twin = S.ev("twin"); t_reach, t_end = S.ev("reached"), S.ev("end")
    presses = sorted(S.evs("scroll") + S.evs("click")); t_walk = presses[0] if presses else S.ev("idle") + 800
    t_sel = S.ev("click", last=True)                                                                   # the click that selects the feature
    t_go = S.ev("gameover", last=True) or (t_end - 1500)
    runs = [t for t in S.evs("gamerun") if t < t_go]; t_run0 = (runs[-1] if runs else S.ev("play")) + 300
    first_run = (S.evs("gamerun") or [S.ev("play") + 1200])[0]
    c = []
    c.append(dict(t0=t_twin + 1500, t1=t_twin + 2300, speed=1, glass="front", name=False))             # 1 the monitor booted; the glass's own noise, half a beat
    c.append(dict(t0=t_walk - 600, t1=t_sel - 30, speed=1, glass="front", name=False))                 # 2 the walk, deliberate
    c.append(dict(t0=t_sel - 30, t1=t_sel - 29, speed=1, glass="front", name=False, still=15, mode="select"))   # 3 the selection: the row in inverse video, half a second
    c.append(dict(t0=t_sel + 420, t1=t_sel + 1250, speed=1, glass="front", name=True, fx={0: "white", 1: "tear"}))   # 4 OUTPUT REDIRECTED, a beat, the name arrives
    c.append(dict(t0=first_run + 150, t1=first_run + 950, speed=1, glass="top", name=True, mode="score"))   # 5 the top window: the game, a beat to land
    c.append(dict(t0=t_run0, t1=t_go - 40, ramp=(5.0, 10.0), glass="top", name=True, mode="score"))    # 6 the race: five times, climbing to ten
    c.append(dict(t0=t_go - 480, t1=t_go - 30, hold=(56, 14), glass="top", name=True, boom=True, mode="score"))   # 7 WHAM: slow motion to a stop
    c.append(dict(t0=t_go + 300, t1=t_go + 1400, speed=1, glass="top", name=True, mode="highscore"))   # 8 NEW HIGH SCORE, a beat
    return c

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
    def reel_t(t):
        for c, s0 in zip(cl, starts):
            if "hold" in c or "ramp" in c or "still" in c: continue
            if c["t0"] <= t <= c["t1"]: return s0 + (t - c["t0"]) / 1000 / c["speed"]
        return None
    tt = np.arange(int(t_crash * SR)) / SR
    add(0, 0.016 * (np.sin(2 * np.pi * 55 * tt) + 0.5 * np.sin(2 * np.pi * 110 * tt)))                # the hum, until the crash
    n = int(lens[0] * SR); add(starts[0], 0.06 * np.convolve(rng.standard_normal(n), np.ones(4) / 4, mode="same"))   # the glass's own noise, half a beat
    add(starts[2], tone(0.3, 90, 880)); add(starts[2] + 0.09, tone(0.3, 160, 1320))                     # the selection, recognised
    for e in S.events:
        if e["name"] in ("scroll", "click", "play-click", "play-shake"):
            r = reel_t(e["t"])
            if r is not None: add(r, tick(0.45 if "click" in e["name"] else 0.3, 5, 1500 if "click" in e["name"] else 2400))
    r = starts[3]; add(r, tone(0.35, 120, 660)); add(r + 0.11, tone(0.35, 220, 990))                    # the sting: the payload
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
    plate = name_plate(rq, row["feature"].upper()); font = small_font(21)
    cl = clips(S); BLACK_S = 0.3; rng = np.random.default_rng(11)
    td = pathlib.Path(tempfile.mkdtemp()); frames = td / "frames"; frames.mkdir()
    n = 0
    for c in cl:
        fx = c.get("fx", {}); ts = frames_of(c)
        for k, t in enumerate(ts):
            e = fx.get(k); kk = 0.0
            if c.get("boom"): e = "boom"; kk = k / max(1, len(ts) - 1)
            compose(S, t, c["glass"], plate, c["name"], font, n, rng, e, kk, layout, c.get("level", "glass"), rq, c.get("mode")).save(frames / f"{n:05d}.png"); n += 1
    for k in range(int(BLACK_S * FPS)): Image.new("RGB", (W, H), (0, 0, 0)).save(frames / f"{n:05d}.png"); n += 1
    total_s = n / FPS; print(f"  {len(cl)} clips, {n} frames, {total_s:.1f}s + the pop")
    sfx = sound(S, cl, total_s, BLACK_S, td)
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
