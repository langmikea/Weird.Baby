"""THE FEATURE REEL, CUT — from a capture folder to the 9:16 reel, by the story's beat table.

Story: docs/FEATURE-REEL-20260916.md §3. Reads index.json (screencast shots with page times, glass
frames with page times, the press events), lays a reel-time timeline over page time in segments
(each: a page-time window, which glass is up, and whether it is a cut or a fold), renders every
output frame (monitor crop on top, the glass at eight times below, the feature's name between in the
machine's font, yellow), writes the house sound bed, and puts the pop first.
"""
import sys, re, json, math, wave, pathlib, subprocess, tempfile, importlib.util
import numpy as np
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[1]
POP = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\assets\video\WB_pop_v1.mp4")
W, H, FPS, SR = 1080, 1920, 30, 48000
CRT = (60, 0, 1200, 900)         # the bezel inside the 1280x900 view
MON_Y = 36                        # where the monitor sits in the frame
GLASS_SCALE = 8                   # 128x64 at eight times = 1024x512
GLASS_Y = 1180
NAME_Y = 1035
YELLOW = (255, 214, 10)

def load_font():
    """the machine's font and framebuffer helpers, borrowed from the Q&A reel's template"""
    saved = sys.argv; sys.argv = ["reels-qa.py"]
    spec = importlib.util.spec_from_file_location("rq", ROOT / "tools" / "reels-qa.py"); rq = importlib.util.module_from_spec(spec); spec.loader.exec_module(rq)
    sys.argv = saved; return rq

def name_plate(rq, text, scale=6):
    """the feature's name in the machine's font, yellow, on black, with the CRT halo the question has"""
    fb = np.zeros((20, 160), dtype=np.uint8)
    x = (160 - rq.text_w(text)) // 2
    for c in text:
        rq.fb_char(fb, x, 15, c); x += rq.GLYPHS[ord(c) - 0x20][3]
    im = Image.fromarray((fb * 255).astype(np.uint8), "L").resize((160 * scale, 20 * scale), Image.NEAREST)
    glow = im.filter(ImageFilter.GaussianBlur(scale * 1.2))
    rgb = Image.new("RGB", im.size, (0, 0, 0))
    y = Image.new("RGB", im.size, YELLOW); rgb.paste(y, (0, 0), Image.eval(glow, lambda v: int(v * 0.35))); rgb.paste(y, (0, 0), im)
    return rgb

class Src:
    def __init__(self, folder):
        self.dir = pathlib.Path(folder); ix = json.load(open(self.dir / "index.json"))
        self.shots = sorted(ix["shots"]); self.glass = sorted(ix["glass"]); self.events = ix["events"]
        self.st = np.array([s[0] for s in self.shots]); self.gt = np.array([g[0] for g in self.glass])
        self._cache = {}
    def ev(self, name, **match):
        for e in self.events:
            if e["name"] == name and all(e.get(k) == v for k, v in match.items()): return e["t"]
        return None
    def evs(self, name): return [e["t"] for e in self.events if e["name"] == name]
    def shot(self, t):
        i = int(np.searchsorted(self.st, t, side="right")) - 1; i = max(0, min(len(self.shots) - 1, i))
        k = ("s", i)
        if k not in self._cache:
            im = Image.open(self.dir / "shots" / self.shots[i][1]).convert("L").crop(CRT)
            self._cache[k] = im.resize((W, int(im.height * W / im.width)), Image.LANCZOS)
            if len(self._cache) > 40: self._cache.pop(next(iter(self._cache)))
        return self._cache[k]
    def glass_im(self, t, which):
        i = int(np.searchsorted(self.gt, t, side="right")) - 1; i = max(0, min(len(self.glass) - 1, i))
        n = self.glass[i][1]
        im = Image.open(self.dir / "glass" / f"{n:05d}_{which}.png").convert("L")
        if im.width != 128: im = im.resize((128, 64), Image.NEAREST)
        return im.resize((128 * GLASS_SCALE, 64 * GLASS_SCALE), Image.NEAREST)

def compose(mon, glass, plate):
    f = Image.new("RGB", (W, H), (0, 0, 0))
    if mon is not None: f.paste(mon.convert("RGB"), (0, MON_Y))
    if plate is not None: f.paste(plate, ((W - plate.width) // 2, NAME_Y))
    if glass is not None:
        g = glass; glow = g.filter(ImageFilter.GaussianBlur(GLASS_SCALE * 0.6))
        lit = Image.fromarray(np.clip(np.asarray(g, dtype=np.float32) * 0.95 + np.asarray(glow, dtype=np.float32) * 0.5, 0, 255).astype(np.uint8), "L")
        f.paste(lit.convert("RGB"), ((W - g.width) // 2, GLASS_Y))
    return f

def timeline(S):
    """the beat table as segments: (src_t0, src_t1, glass, fold_s, name_on). Times in page ms."""
    t_term, t_con, t_run, t_twin, t_idle = S.ev("terminal"), S.ev("console"), S.ev("run"), S.ev("twin"), S.ev("idle")
    t_reach, t_play, t_end = S.ev("reached"), S.ev("play"), S.ev("end")
    seg = []
    seg.append((max(t_term, t_con - 1600), t_con + 100, None, 0, False))                 # 1 the CRT wakes
    t_ch3 = S.ev("ch3"); cs = S.evs("console-scroll")
    seg.append((t_con + 100, t_ch3 + 650, None, 0, False))                                # 2 the console: the arrow, channel 3
    seg.append(((cs[-1] if cs else t_run) - 380, t_run + 350, None, 0, False))            # 3 the last scroll onto RUN, CLICK (the walk between is folded)
    seg.append((t_twin + 150, t_twin + 2550, "front", 0, False))                         # 4 the twin lands: BIOS / POST
    first = (S.evs("scroll") + S.evs("click"))
    t_walk = min(first) if first else t_idle + 1000
    seg.append((t_walk - 1200, t_reach - 60, "front", 500, False))                        # fold to the idle menu, then the walk
    seg.append((t_reach - 60, t_reach + 1400, "front", 0, True))                          # 6 the feature's name arrives with its card
    # 7 the demo: three moments out of the play span, hard cuts
    span = t_end - t_play
    moments = [(t_play + 300, 2600), (t_play + max(2900, span * 0.42), 2800), (t_end - 3200, 3200)]
    for (t0, d) in moments: seg.append((t0, t0 + d, "top", 0, True))
    return seg

def sound(S, seg, total_s, black_s, td):
    """hum under everything; a tick at every press; relays under the boot; the chime at the feature; the thunk at the end"""
    sfx = np.zeros(int(total_s * SR) + 1); rng = np.random.default_rng(3)
    def add(t0, sig):
        i = int(t0 * SR); j = min(len(sfx), i + len(sig)); sfx[i:j] += sig[:j - i]
    def tick(amp=0.35, ms=4, hz=2200):
        n = int(ms * SR / 1000); e = np.exp(-np.arange(n) / (n / 3)); return amp * e * np.sin(2 * np.pi * hz * np.arange(n) / SR)
    tt = np.arange(int((total_s - black_s) * SR)) / SR
    add(0, 0.016 * (np.sin(2 * np.pi * 55 * tt) + 0.5 * np.sin(2 * np.pi * 110 * tt)))
    # map a page time to reel time through the segments
    def reel_t(t):
        acc = 0.0
        for (a, b, g, fold, nm) in seg:
            if a <= t <= b: return acc + (t - a) / 1000
            acc += (b - a) / 1000
        return None
    for e in S.events:
        if e["name"] in ("ch3", "console-scroll", "run", "scroll", "click", "play-click", "play-shake"):
            r = reel_t(e["t"])
            if r is not None: add(r, tick(0.45 if e["name"] in ("run", "click", "play-click") else 0.3, 5, 1500 if "click" in e["name"] or e["name"] == "run" else 2400))
    r = reel_t(S.ev("twin") + 200)
    if r is not None:
        tk = r
        while tk < r + 2.2: add(tk, tick(0.18 + 0.15 * rng.random(), 3, 1800 + 900 * rng.random())); tk += 0.05 + 0.06 * rng.random()
    r = reel_t(S.ev("reached"))
    if r is not None: add(r, tick(0.5, 40, 1400))
    n_th = int(0.16 * SR); e = np.exp(-np.arange(n_th) / (n_th / 4))
    add(total_s - black_s - 2.0, 0.6 * e * np.sin(2 * np.pi * 85 * np.arange(n_th) / SR) + 0.12 * e * rng.standard_normal(n_th))
    f = td / "sfx.wav"
    with wave.open(str(f), "wb") as wv:
        wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((np.clip(sfx, -1, 1) * 32767).astype("<i2").tobytes())
    return f

def assemble(folder, row, out_dir):
    S = Src(folder); rq = load_font()
    name = row["feature"].upper(); plate = name_plate(rq, name)
    seg = timeline(S); BLACK_S = 0.5
    td = pathlib.Path(tempfile.mkdtemp()); frames = td / "frames"; frames.mkdir()
    n = 0; prev_still = None
    for (a, b, glass, fold, name_on) in seg:
        count = max(1, int(round((b - a) / 1000 * FPS)))
        nfold = int(fold / 1000 * FPS)
        for k in range(count):
            t = a + k * 1000 / FPS
            mon = S.shot(t); g = S.glass_im(t, glass) if glass else None
            f = compose(mon, g, plate if name_on else None)
            if prev_still is not None and k < nfold:
                w = (k + 1) / (nfold + 1); f = Image.blend(prev_still, f, w)
            f.save(frames / f"{n:05d}.png"); n += 1
        prev_still = f
    for k in range(int(BLACK_S * FPS)): Image.new("RGB", (W, H), (0, 0, 0)).save(frames / f"{n:05d}.png"); n += 1
    total_s = n / FPS; print(f"  {len(seg)} segments, {n} frames, {total_s:.1f}s + the pop")
    sfx = sound(S, seg, total_s, BLACK_S, td)
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
