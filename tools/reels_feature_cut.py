"""THE FEATURE REEL, CUT — from a capture folder to the 9:16 reel, by the story's beat table.

Story: docs/FEATURE-REEL-20260916.md §7 (the second story, after Mike's notes). Reads index.json
(screencast shots with page times, glass frames with page times, the events), lays reel time over page
time as clips (a page-time window at a speed, or a decelerating hold), renders every frame:

  the branch label, small, over the black band at the top;
  the monitor as the site draws it;
  the split: one soft light rule in the monitor's own style;
  the zoom-in: the Portal's channel 4, the close-up plate of the machine with the live glass drawn
  into its aperture the way the site draws it (integer scale, the scanline gap baked into every row,
  bloomed), cropped to the screen the story is on, under the same closed-circuit read the monitor
  wears (scanlines, a slow roll, a breath of flicker, the vignette); the feature's name in yellow, in
  the machine's font, over the bezel band at the top of the plate;

then the house sound bed, and the pop first.
"""
import sys, re, json, math, wave, pathlib, subprocess, tempfile, importlib.util
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageChops

ROOT = pathlib.Path(__file__).resolve().parents[1]
POP = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\assets\video\WB_pop_v1.mp4")
PLATE = ROOT / "public" / "robots" / "reference" / "photos" / "MGK-TWIN_MONITOR_CLOSE_UP.png"
W, H, FPS, SR = 1080, 1920, 30, 48000
CRT = (60, 0, 1200, 900)         # the bezel inside the 1280x900 view
MON_Y = 28                        # the black band above the monitor carries the branch label
MON_H = int((CRT[3] - CRT[1]) * W / (CRT[2] - CRT[0]))   # 853
SPLIT_Y = MON_Y + MON_H + 16
ZOOM_Y = SPLIT_Y + 16
ZOOM_H = H - ZOOM_Y               # 1007
# channel 4's plate: the apertures are centred at the marker points (twin.html: front 28.78%/28.86%, top 71.32%/28.90%,
# 35.7% x 21.75% of 3000x2400). The zoom-in crops the plate to the screen the story is on, the plate's divider in shot.
APERTURE = {"front": (863.4, 692.6), "top": (2139.5, 693.6)}; AP_W, AP_H = 1071, 522
CROP = {"front": (250, 100, 1750, 1500), "top": (1250, 100, 2750, 1500)}   # 1500 x 1400 -> 1080 x 1008
GLASS_Z = 6
YELLOW = (255, 214, 10)
BRANCH = "\\ROBOTS"

def load_font():
    """the machine's font and framebuffer helpers, borrowed from the Q&A reel's template"""
    saved = sys.argv; sys.argv = ["reels-qa.py"]
    spec = importlib.util.spec_from_file_location("rq", ROOT / "tools" / "reels-qa.py"); rq = importlib.util.module_from_spec(spec); spec.loader.exec_module(rq)
    sys.argv = saved; return rq

def name_plate(rq, text, scale=5):
    """the feature's name in the machine's font, yellow, with the CRT halo the Q&A question has"""
    fb = np.zeros((20, 200), dtype=np.uint8)
    x = (200 - rq.text_w(text)) // 2
    for c in text:                       # the template's fb_char stops at the glass's 128 px; this plate is wider
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
        self._cache = {}
    def ev(self, name, last=False):
        ts = [e["t"] for e in self.events if e["name"] == name]
        return (ts[-1] if last else ts[0]) if ts else None
    def evs(self, name): return [e["t"] for e in self.events if e["name"] == name]
    def shot(self, t):
        i = int(np.searchsorted(self.st, t, side="right")) - 1; i = max(0, min(len(self.shots) - 1, i))
        k = ("s", i)
        if k not in self._cache:
            im = Image.open(self.dir / "shots" / self.shots[i][1]).convert("L").crop(CRT)
            self._cache[k] = im.resize((W, MON_H), Image.LANCZOS)
            if len(self._cache) > 40: self._cache.pop(next(iter(self._cache)))
        return self._cache[k]
    def fb(self, t, which):
        """the 128x64 framebuffer at page time t; dark before the twin's first frame"""
        if t < self.gt[0]: return Image.new("L", (128, 64), 0)
        i = int(np.searchsorted(self.gt, t, side="right")) - 1; i = max(0, min(len(self.glass) - 1, i))
        n = self.glass[i][1]
        im = Image.open(self.dir / "glass" / f"{n:05d}_{which}.png").convert("L")
        return im.resize((128, 64), Image.NEAREST) if im.width != 128 else im

# ── the zoom-in ─────────────────────────────────────────────────────────────
_plate = {}
def plate_crop(which):
    if which not in _plate:
        im = Image.open(PLATE).convert("L").crop(CROP[which]).resize((W, ZOOM_H), Image.LANCZOS)
        _plate[which] = im
    return _plate[which]

def glass_lit(fb, which):
    """the site's own treatment at an integer scale: a dark gap baked into every row (the top window progressive,
    2 lit + 1 dark at z=3; the front interlaced, coarser), then bloom"""
    g = fb.resize((128 * GLASS_Z, 64 * GLASS_Z), Image.NEAREST)
    a = np.asarray(g, dtype=np.float32)
    mask = np.ones(64 * GLASS_Z, dtype=np.float32)
    if which == "top":
        for r in range(64): mask[r * GLASS_Z + 4: r * GLASS_Z + 6] = 0.3
    else:
        for r in range(0, 64, 2): mask[r * GLASS_Z + 10: r * GLASS_Z + 12] = 0.3
    a = a * mask[:, None]
    lit = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "L")
    glow = lit.filter(ImageFilter.GaussianBlur(GLASS_Z * 0.7))
    return Image.fromarray(np.clip(np.asarray(lit, dtype=np.float32) * 0.92 + np.asarray(glow, dtype=np.float32) * 0.55, 0, 255).astype(np.uint8), "L")

def zoom_in(fb, which):
    """channel 4: the plate cropped to this screen, the glass lit in its aperture"""
    base = plate_crop(which).copy()
    cx, cy = APERTURE[which]; x0, y0 = CROP[which][:2]; k = W / (CROP[which][2] - CROP[which][0])
    ax, ay = (cx - x0) * k, (cy - y0) * k
    lit = glass_lit(fb, which)
    ap_w, ap_h = int(AP_W * k), int(AP_H * k)
    lit = lit.resize((ap_w, ap_h), Image.BILINEAR)
    box = (int(ax - ap_w / 2), int(ay - ap_h / 2))
    region = base.crop((box[0], box[1], box[0] + ap_w, box[1] + ap_h))
    dark = Image.eval(region, lambda v: int(v * 0.25))
    base.paste(ImageChops.lighter(dark, lit), box)
    return base

_scan = None
def secmon(im, frame_i, rng):
    """the closed-circuit read over the whole zoom-in: scanlines at 3 px, a slow roll, a breath of flicker, the vignette"""
    global _scan
    a = np.asarray(im, dtype=np.float32)
    if _scan is None:
        m = np.ones(a.shape[0], dtype=np.float32); m[::3] = 0.72
        yy, xx = np.mgrid[:a.shape[0], :a.shape[1]]
        v = 1 - 0.28 * (((xx - a.shape[1] / 2) / (a.shape[1] / 2)) ** 2 + ((yy - a.shape[0] / 2) / (a.shape[0] / 2)) ** 2) ** 1.2
        _scan = (m, np.clip(v, 0, 1).astype(np.float32))
    m, v = _scan
    roll = (frame_i * 4) % (a.shape[0] + 200) - 100
    band = np.exp(-((np.arange(a.shape[0]) - roll) / 60.0) ** 2) * 0.07
    breath = 1 + rng.normal(0, 0.012)
    a = a * (m + band)[:, None] * v * breath
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "L")

def tear(im, rng):
    """one torn frame: a band of the picture displaced sideways, the rest lifted"""
    a = np.asarray(im).copy(); h = a.shape[0]
    y0 = int(rng.uniform(0.2, 0.7) * h); y1 = min(h, y0 + int(rng.uniform(40, 140)))
    a[y0:y1] = np.roll(a[y0:y1], int(rng.uniform(-40, 40)), axis=1)
    return Image.fromarray(np.clip(a.astype(np.float32) * 1.12, 0, 255).astype(np.uint8))

def compose(S, t, which, plate, name_on, font, frame_i, rng, fx=None):
    f = Image.new("L", (W, H), 0)
    f.paste(S.shot(t), (0, MON_Y))
    # the split: a soft light rule in the monitor's own style
    d = ImageDraw.Draw(f); d.line([(0, SPLIT_Y), (W, SPLIT_Y)], fill=200, width=3)
    rule = f.crop((0, SPLIT_Y - 8, W, SPLIT_Y + 8)).filter(ImageFilter.GaussianBlur(2)); f.paste(rule, (0, SPLIT_Y - 8))
    z = zoom_in(S.fb(t, which), which)
    z = secmon(z, frame_i, rng)
    f.paste(z, (0, ZOOM_Y))
    out = f.convert("RGB")
    if name_on and plate is not None:
        col, alpha = plate; out.paste(col, ((W - col.width) // 2, ZOOM_Y + 40), alpha)
    d = ImageDraw.Draw(out); d.text((26, 6), BRANCH, fill=(112, 112, 112), font=font)
    if fx == "white": out = Image.blend(out, Image.new("RGB", (W, H), (255, 255, 255)), 0.75)
    elif fx == "tear": out = tear(out, rng)
    elif fx == "dim": out = Image.eval(out, lambda v: int(v * 0.72))
    return out

# ── the beat table as clips ─────────────────────────────────────────────────
def clips(S):
    """each clip: dict(t0, t1, speed | hold, glass, name, fx: {reel frame index -> effect})"""
    t_run, t_twin = S.ev("run"), S.ev("twin")
    t_reach, t_play, t_end = S.ev("reached"), S.ev("play"), S.ev("end")
    presses = sorted(S.evs("scroll") + S.evs("click"))
    t_walk = presses[0] if presses else S.ev("idle") + 800
    t_go = S.ev("gameover", last=True) or (t_end - 1500)
    runs = [t for t in S.evs("gamerun") if t < t_go - 5500]
    t_act = (runs[-1] if runs else t_play) + 800
    c = []
    c.append(dict(t0=t_run + 200, t1=t_run + 1150, speed=1, glass="front", name=False))               # 1 noise
    c.append(dict(t0=t_twin + 700, t1=t_twin + 2300, speed=1, glass="front", name=False))             # 2 the twin lands
    c.append(dict(t0=t_walk - 450, t1=t_reach - 40, speed=1, glass="front", name=False))              # 3 the walk
    c.append(dict(t0=t_reach - 40, t1=t_reach + 850, speed=1, glass="front", name=True, fx={0: "white", 1: "tear", 3: "tear"}))   # 4 the payload
    c.append(dict(t0=t_reach + 850, t1=t_reach + 1300, speed=1, glass="top", name=True))              #   the hand-off
    c.append(dict(t0=t_act, t1=t_act + 2400, speed=1, glass="top", name=True))                        # 5 the action at 1x
    last_run = max([t for t in S.evs("gamerun") if t < t_go] or [t_go - 5200])
    c.append(dict(t0=max(t_go - 5200, last_run + 400), t1=t_go - 700, speed=2, glass="top", name=True))   # 6 at 2x, inside the last run
    c.append(dict(t0=t_go - 700, t1=t_go - 30, hold=(66, 16), glass="top", name=True, fx={0: "tear", 1: "tear"}))   # 7 the crash: decelerate to a stop, freeze
    c.append(dict(t0=t_go + 700, t1=t_go + 2700, speed=1, glass="top", name=True, blink=8))           # 8 the card, blinking
    return c

def frames_of(c):
    """the page times this clip samples, one per output frame"""
    if "hold" in c:
        n, freeze = c["hold"]; span = c["t1"] - c["t0"]
        w = np.array([(1 - k / n) ** 2 for k in range(n)]); w = w / w.sum() * span
        ts = list(c["t0"] + np.cumsum(w) - w[0]); return ts + [ts[-1]] * freeze
    n = int(round((c["t1"] - c["t0"]) / 1000 * FPS / c["speed"]))
    return [c["t0"] + k * 1000 / FPS * c["speed"] for k in range(n)]

def sound(S, cl, total_s, black_s, td):
    """hum and hiss under the noise; relays under the boot; a tick per press; the sting at the payload; the game's
    blips (at 2x when the picture is); the thud at the crash and the hum falling away; silence under the card"""
    sfx = np.zeros(int(total_s * SR) + 1); rng = np.random.default_rng(3)
    def add(t0, sig):
        i = int(t0 * SR); j = min(len(sfx), i + len(sig)); sfx[i:j] += sig[:j - i]
    def tick(amp=0.35, ms=4, hz=2200):
        n = int(ms * SR / 1000); e = np.exp(-np.arange(n) / (n / 3)); return amp * e * np.sin(2 * np.pi * hz * np.arange(n) / SR)
    def tone(amp, ms, hz):
        n = int(ms * SR / 1000); e = np.minimum(1, np.arange(n) / 200) * np.exp(-np.arange(n) / (n / 1.6)); return amp * e * np.sin(2 * np.pi * hz * np.arange(n) / SR)
    # reel time of each clip's start, and a page->reel map
    starts = []; acc = 0.0
    for c in cl:
        starts.append(acc); acc += len(frames_of(c)) / FPS
    def reel_t(t):
        for c, s0 in zip(cl, starts):
            if "hold" in c: continue
            if c["t0"] <= t <= c["t1"]: return s0 + (t - c["t0"]) / 1000 / c["speed"]
        return None
    t_crash = starts[7]; t_card = starts[8]
    tt = np.arange(int(t_crash * SR)) / SR
    add(0, 0.016 * (np.sin(2 * np.pi * 55 * tt) + 0.5 * np.sin(2 * np.pi * 110 * tt)))                # the hum, until the crash
    n = int((starts[1] - starts[0]) * SR); add(starts[0], 0.05 * rng.standard_normal(n) * np.linspace(1, 0.3, n))   # the hiss under the noise
    tk = starts[1] + 0.1
    while tk < starts[2] - 0.1: add(tk, tick(0.18 + 0.15 * rng.random(), 3, 1800 + 900 * rng.random())); tk += 0.05 + 0.06 * rng.random()   # relays
    for e in S.events:
        if e["name"] in ("scroll", "click", "play-click", "play-shake"):
            r = reel_t(e["t"])
            if r is not None: add(r, tick(0.45 if "click" in e["name"] else 0.3, 5, 1500 if "click" in e["name"] else 2400))
    r = starts[3]                                                                                        # the sting: two notes and the thunk
    add(r, tone(0.35, 120, 660)); add(r + 0.11, tone(0.35, 220, 990))
    n_th = int(0.16 * SR); e = np.exp(-np.arange(n_th) / (n_th / 4)); add(r + 0.02, 0.5 * e * np.sin(2 * np.pi * 85 * np.arange(n_th) / SR))
    for c, s0 in zip(cl[5:7], starts[5:7]):                                                              # the game's blips
        tk = s0
        while tk < s0 + len(frames_of(c)) / FPS: add(tk, tick(0.16, 6, 1200 + 400 * rng.random())); tk += 0.31 / c["speed"]
    n_th = int(0.35 * SR); e = np.exp(-np.arange(n_th) / (n_th / 5))                                     # the thud, then the hum falls away
    add(t_crash, 0.8 * e * np.sin(2 * np.pi * 60 * np.arange(n_th) / SR) + 0.25 * e * rng.standard_normal(n_th))
    n_f = int((t_card - t_crash) * SR); k = np.arange(n_f) / SR
    add(t_crash, 0.02 * np.exp(-k / 0.9) * np.sin(2 * np.pi * (55 - 25 * np.minimum(1, k / 1.8)) * k))
    f = td / "sfx.wav"
    with wave.open(str(f), "wb") as wv:
        wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((np.clip(sfx, -1, 1) * 32767).astype("<i2").tobytes())
    return f

def assemble(folder, row, out_dir):
    S = Src(folder); rq = load_font()
    plate = name_plate(rq, row["feature"].upper()); font = small_font(21)
    cl = clips(S); BLACK_S = 0.4; rng = np.random.default_rng(11)
    td = pathlib.Path(tempfile.mkdtemp()); frames = td / "frames"; frames.mkdir()
    n = 0
    for c in cl:
        fx = c.get("fx", {}); blink = c.get("blink")
        for k, t in enumerate(frames_of(c)):
            e = fx.get(k)
            if blink and (k // blink) % 2 == 1: e = "dim"
            compose(S, t, c["glass"], plate, c["name"], font, n, rng, e).save(frames / f"{n:05d}.png"); n += 1
    for k in range(int(BLACK_S * FPS)): Image.new("RGB", (W, H), (0, 0, 0)).save(frames / f"{n:05d}.png"); n += 1
    total_s = n / FPS; print(f"  {len(cl)} clips, {n} frames, {total_s:.1f}s + the pop")
    sfx = sound(S, cl, total_s, BLACK_S, td)
    middle = td / "middle.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", str(frames / "%05d.png"), "-i", str(sfx),
                    "-filter_complex", "[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a]", "-map", "0:v", "-map", "[a]", "-shortest",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", str(middle)], check=True)
    out_dir.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", row["feature"].lower()).strip("-")
    dest = out_dir / f"feature_{slug}.mp4"
    vf = ("[0:v]scale=1080:1920,fps=30,format=gray,format=yuv420p,setsar=1[v0];[0:a]aformat=sample_rates=48000:channel_layouts=stereo[a0];"
          "[1:v]fps=30,format=yuv420p,setsar=1[v1];[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(POP), "-i", str(middle), "-filter_complex", vf, "-map", "[v]", "-map", "[a]",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(dest)], check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dest)], capture_output=True, text=True).stdout)
    print(f"  wrote {dest}  {dur:.1f}s"); return dest

if __name__ == "__main__":
    folder = sys.argv[1]; feat = sys.argv[2] if len(sys.argv) > 2 else "Tilt Drive"
    assemble(pathlib.Path(folder), {"feature": feat}, ROOT / "reels" / "out" / "features")
