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
SHORT = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\assets\audio\WB_electrical-short_v1.wav")
EMU = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\tools\viiip_display_emulator.html")
FONT_Q = r"C:\Windows\Fonts\georgiab.ttf"
FONT_CARD = r"C:\Windows\Fonts\arialbd.ttf"
W, H, FPS = 1080, 1920, 30

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
FLASH_S, CARD_S, GLITCH_S, LOOP_S = 1.2, 0.9, 0.25, 0.3
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

def composite_glass(frame, circle, fb):
    """darken the window, lay the lit screen in, keep a little of the real reflection"""
    cx, cy, r = circle; d = int(r * 2 * 0.96)
    if d < 8: return frame
    lit, mask = fb_image(fb, d)
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
def layout_words(words, font, maxw=880):
    """(word, x, y) positions, wrapped, for a block whose top-left is (0,0)"""
    pos = []; x = 0; y = 0; lh = int(font.size * 1.22); sp = font.getlength(" ")
    for w in words:
        ww = font.getlength(w)
        if x > 0 and x + ww > maxw: x = 0; y += lh
        pos.append((w, x, y)); x += ww + sp
    return pos, y + lh

def draw_question(frame, pos, block_h, shown, font):
    """words shown so far, on one soft box in the top third"""
    if shown == 0: return frame
    out = frame.convert("RGBA"); ov = Image.new("RGBA", out.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    bx, by = 90, 170; pad = 28
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
    dest = OUT / f"qa_{slug}.mp4"
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
            im.convert("L").save(outdir / f"{n:05d}.png"); n += 1
        # 1+2: the holds — idle glass, then the oscilloscope while the voice speaks; words appear as spoken
        hold_frames = [(f, c) for role, fr, cs in segs[:2] if role == "hold" for f, c in zip(fr, cs)]
        tri_total = int(0.8 * FPS)
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
            im = draw_question(im, pos, block_h, shown, fontq)
            if first_frame is None: first_frame = im.copy()
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
        ecu = ecu * (int(2.0 * FPS) // max(1, len(ecu)) + 1)                                   # one frame, pushed in digitally: no tracking to lose
        plate = Image.open(f0).convert("L")
        n_ecu = len(ecu)
        zmax = min(1.6, 0.86 * W / (2 * c0[2]))          # the whole glass stays inside the frame
        for k in range(n_ecu):
            fb = screen_triangle(k, tri_total) if k < tri_total else screen_answer(ANSWER)
            im = composite_glass(plate, c0, fb)
            z = 1.0 + (zmax - 1.0) * (k / max(1, n_ecu - 1)) ** 0.7
            cw, ch = int(W / z), int(H / z); cx, cy = int(c0[0]), int(c0[1])
            x0 = max(0, min(W - cw, cx - cw // 2)); y0 = max(0, min(H - ch, cy - ch // 2))
            im = im.crop((x0, y0, x0 + cw, y0 + ch)).resize((W, H), Image.LANCZOS)
            last_ecu = im; emit(im)
        # 5: the staccato flash between the glass and the card; 6: the card holds
        cd = card(ANSWER); per = 3
        for k in range(int(FLASH_S * FPS)): emit(cd if (k // per) % 2 == 0 else last_ecu)
        for k in range(int(CARD_S * FPS)): emit(cd)
        # 7: the glitch back; 8: the first frame, so it loops clean
        t_glitch = n / FPS
        for k in range(int(GLITCH_S * FPS)): emit(glitch(first_frame if k % 3 else cd, k))
        for k in range(int(LOOP_S * FPS)): emit(first_frame)
        middle_s = n / FPS
        print(f"  middle {middle_s:.2f}s, {n} frames; voice at {VOICE_AT}s for {voice_len:.2f}s; shake at {t_shake:.2f}s; glitch at {t_glitch:.2f}s")
        # the sound: silence + the adult + the short twice
        middle = td / "middle.mp4"
        fc = (f"[1:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={int(VOICE_AT*1000)}|{int(VOICE_AT*1000)},volume=1.0[v];"
              f"[2:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={int(t_shake*1000)}|{int(t_shake*1000)},volume=0.7[s1];"
              f"[2:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={int(t_glitch*1000)}|{int(t_glitch*1000)},volume=0.8[s2];"
              f"[3:a][v][s1][s2]amix=inputs=4:duration=first:normalize=0[a]")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", str(outdir / "%05d.png"), "-i", str(vwav), "-i", str(SHORT),
                        "-f", "lavfi", "-t", f"{middle_s:.3f}", "-i", "anullsrc=r=48000:cl=stereo",
                        "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-shortest", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", str(middle)], check=True)
        # the pop first (its own sound), then the middle
        vf = ("[0:v]scale=1080:1920,fps=30,format=gray,format=yuv420p,setsar=1[v0];[0:a]aformat=sample_rates=48000:channel_layouts=stereo[a0];"
              "[1:v]fps=30,format=yuv420p,setsar=1[v1];[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]")
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
