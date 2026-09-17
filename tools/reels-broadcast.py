"""THE BROADCAST LOOK — 1960s colour television captured to film, three styles on the Gambler set.

    python tools/reels-broadcast.py                 build all three samples, the review strips and the sheet
    python tools/reels-broadcast.py lateshow        one style
    python tools/reels-broadcast.py --sheet         only the strips and docs/desk/BROADCAST.html from the built files

Story: docs/BROADCAST-LOOK-20260917.md. The look is a stack of layers (plate, motion, grade,
television, film, titles, sound, the pop); a STYLE is one row of settings for that stack. The
artifact is the data: the shot list names tray frames of the 09-16 set. Add a style by adding
a row; add an artifact by changing the shots.
Output: OneDrive/WeirdBaby/reels/out/broadcast/ (media never in the repo).
"""
import importlib, json, pathlib, shutil, subprocess, sys, tempfile, base64
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
RB = importlib.import_module("reels-build")

REPO = pathlib.Path(__file__).resolve().parents[1]
SRC = pathlib.Path(r"C:\Users\macun\OneDrive\Desktop - Laptop\Weird.Baby\New folder")
OUT = pathlib.Path(r"C:\Users\macun\OneDrive\WeirdBaby\reels\out\broadcast")
BEDS = json.loads((REPO / "reels/beds.json").read_text(encoding="utf-8"))   # Mike, 09-17 (Q2, A): public-domain 78s, one a style; the files live in OneDrive
BED_DIR = pathlib.Path(BEDS["library"])
SHEET = REPO / "docs/desk/BROADCAST.html"
FONTS = pathlib.Path(r"C:\Windows\Fonts")
W, H, FPS = 1080, 1920, 30
LIVE_FRAMES_S = 11 / 30.0

# ── the styles ──────────────────────────────────────────────────────────────
STYLES = {
    "lateshow": dict(
        line="the late show: gambling, gaming. Warm, brown, faded, dark; the smoke in the room; Cooper Black; the bed pitched down.",
        story="gambling · gaming",
        grade="curves=all='0/0.07 0.5/0.44 1/0.80',colorbalance=rs=.14:gs=.04:bs=-.18:rm=.10:gm=.03:bm=-.14:rh=.08:bh=-.10,eq=saturation=0.74:contrast=0.94:gamma=1.04",
        tv=dict(bleed=6, weave=2.6, flicker=0.035, scan=0.20, fringe=3),
        grain=24, tint="0x1a120c",
        font="COOPBL.TTF", title="THE GAMBLER", title_size=112, card_size=128, spacing=2,
        bed=dict(rate=1.00, lp=3000, hp=140, wow=0.14, flutter=0.020, hiss=0.0, gain=0.90),
        card_first=False, xfade=0.5,
        shots=[("still", "0197", 3.4, "auto"), ("still", "0203", 2.8, "auto"), ("still", "0216", 2.4, "auto"),
               ("live", "0234", 2.2, None), ("still", "0208", 1.8, "auto")]),
    "showroom": dict(
        line="the showroom: automobiles, fun girls. Bright, saturated then faded to magenta, high key; Brush Script; the bed bright with a light wow.",
        story="automobiles · fun girls",
        grade="curves=r='0/0.06 0.5/0.56 1/0.92':g='0/0.04 0.5/0.50 1/0.88':b='0/0.12 0.5/0.50 1/0.84',colorbalance=rs=.05:bs=.03:rh=.10:gh=-.05:bh=.02,eq=saturation=1.22:contrast=1.06:brightness=0.03",
        tv=dict(bleed=8, weave=1.6, flicker=0.022, scan=0.13, fringe=5),
        grain=14, tint="0x1c1018",
        font="BRUSHSCI.TTF", title="the Gambler", title_size=168, card_size=184, spacing=0,
        bed=dict(rate=1.00, lp=4200, hp=120, wow=0.08, flutter=0.015, hiss=0.0, gain=0.95),
        card_first=False, xfade=0.0,
        shots=[("still", "0197", 2.6, "auto"), ("still", "0204", 2.0, "auto"), ("still", "0212", 2.0, "auto"),
               ("live", "0225", 2.0, None), ("still", "0235", 1.6, "auto"), ("still", "0199", 1.8, "auto")]),
    "boardroom": dict(
        line="the boardroom: business, insurance. Cool, flat, desaturated; the industrial film; Gill Sans in spaced capitals; a title card first; a sober bed.",
        story="business · insurance",
        grade="curves=all='0/0.06 0.5/0.48 1/0.86',colortemperature=temperature=7600:mix=0.8,eq=saturation=0.55:contrast=0.94:gamma=0.98,colorbalance=bs=.05:bm=.04:gm=.02",
        tv=dict(bleed=4, weave=1.0, flicker=0.014, scan=0.24, fringe=2),
        grain=18, tint="0x0e1216",
        font="GillSansBoNova.ttf", title="THE GAMBLER", title_size=104, card_size=112, spacing=14,
        bed=dict(rate=1.00, lp=3400, hp=160, wow=0.05, flutter=0.010, hiss=0.0, gain=0.85),
        card_first=True, xfade=0.0,
        shots=[("still", "0197", 3.0, "auto"), ("still", "0199", 2.4, "auto"), ("still", "0203", 2.2, "auto"),
               ("still", "0211", 2.2, "auto"), ("still", "0236", 2.0, "auto")]),
}
CARD_S = 1.8

def run(cmd, cwd=None): subprocess.run(cmd, check=True, cwd=cwd)
def probe_dur(p): return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True).stdout)

# ── plates ──────────────────────────────────────────────────────────────────
# Mike, 09-17: the tray was shot in landscape; the phone's tag says portrait. The tag is wrong for this
# set, so every plate is righted by the tag and then turned back: the rule at the bottom, the objects
# upright. Ruling C (09-17): each shot opens on the whole tray as a 4:3 raster inside the tall frame
# and the push lands inside the object in 9:16. A portrait re-shoot of the kit is on the shot list.
def plate(frame):
    from PIL import Image, ImageOps
    return ImageOps.exif_transpose(Image.open(SRC / f"IMG_{frame}.JPG")).rotate(90, expand=True)

def find_object(im, margin=1.35):
    """the object on the white tray (landscape). The tray's interior is found first (the longest bright run of
    columns and of rows, shrunk a little so the rim's shadow is out); inside it, what is clearly darker than the
    tray's level or coloured, eroded once so the tray's dimples and the rule's edge do not count, boxed with a
    margin; returns (cx, cy, bw, bh) as fractions of the plate"""
    import numpy as np
    w, h = im.size; small = im.convert("RGB").resize((w // 8, h // 8)); a = np.asarray(small).astype(int)
    lum = a.mean(axis=2); sat = a.max(axis=2) - a.min(axis=2); sh, sw = lum.shape
    tray = np.percentile(lum, 80)     # the tray is the brightest large thing in the frame; a central median fails when the object fills the centre (the case)
    bright = lum > tray * 0.72
    def run_of(frac):
        """the tray's extent: the first and last column (row) that is mostly tray; an object across the middle
        does not break it (the case fills rows to a tenth bright)"""
        idx = np.where(frac > 0.08)[0]
        return (int(idx[0]), int(idx[-1]) + 1) if len(idx) else (0, len(frac))
    x0, x1 = run_of(bright.mean(axis=0)); y0, y1 = run_of(bright.mean(axis=1))
    px, py = int((x1 - x0) * 0.10), int((y1 - y0) * 0.10)
    win = (slice(y0 + py, int(y1 - (y1 - y0) * 0.22)), slice(x0 + px, x1 - px))      # the rule's band along the bottom is out
    m = np.zeros_like(lum, dtype=bool); m[win] = (lum[win] < tray * 0.66) | (sat[win] > 55)   # proportional: the tray's own shading stays out, the objects come in
    e = m.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1): e &= np.roll(np.roll(m, dy, 0), dx, 1)
    ys, xs = np.where(e)
    if len(xs) < 6: return (0.5, 0.45, 0.4, 0.4)
    bx0, bx1 = np.percentile(xs, [4, 96]); by0, by1 = np.percentile(ys, [4, 96])
    return (float((bx0 + bx1) / 2 / sw), float((by0 + by1) / 2 / sh), float(max((bx1 - bx0) / sw, 0.05) * margin), float(max((by1 - by0) / sh, 0.05) * margin))

def raster_canvas(im, S, td, name):
    """the landscape plate as a 4:3 screen inside the tall frame, the style's tint above and below"""
    from PIL import Image
    pw, ph = im.size; CW, CH = pw, int(pw * 16 / 9)
    t = S["tint"]; tint = tuple(int(t[2 + k * 2:4 + k * 2], 16) for k in range(3))
    canvas = Image.new("RGB", (CW, CH), tint); canvas.paste(im, (0, (CH - ph) // 2))
    out = pathlib.Path(td) / f"{name}.png"; canvas.save(out); return out, CW, CH, (CH - ph) // 2

def push(cx, cy, bw, bh, pw, ph, CW, CH, top, n, zmax=6.0):
    """the zoompan expression for ruling C: from the whole raster (z=1) into the object's 9:16 window, eased"""
    ox = cx * pw; oy = top + cy * ph
    win_h = max(bh * ph, bw * pw * 16 / 9); z_end = min(max(CH / win_h, 1.4), zmax)
    z = f"1+({z_end:.4f}-1)*(1-cos(PI*on/{n}))/2"
    return f"zoompan=z='{z}':x='{ox:.1f}-iw/zoom/2':y='{oy:.1f}-ih/zoom/2':d={n}:s={W}x{H}:fps={FPS}"

def still_clip(frame, secs, crop, S, td, i):
    im = plate(frame); pw, ph = im.size
    cx, cy, bw, bh = find_object(im) if crop == "auto" else crop
    png, CW, CH, top = raster_canvas(im, S, td, f"c{frame}")
    out = pathlib.Path(td) / f"s{i:02d}.mp4"; n = int(secs * FPS)
    vf = push(cx, cy, bw, bh, pw, ph, CW, CH, top, n) + "," + S["grade"] + ",format=yuv420p,setsar=1"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(png), "-vf", vf, "-frames:v", str(n), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", str(out)]); return out

def live_clip(frame, secs, S, td, i):
    """the Live Photo's eleven frames stretched (the hand), read without the phone's rotation tag (landscape, as shot),
    on the same raster with the same push; the object is found on the photograph of the same frame.
    Copied beside first: OneDrive's cloud files do not decode in place."""
    src = pathlib.Path(td) / f"IMG_{frame}.MOV"; shutil.copy(SRC / f"IMG_{frame}.MOV", src)
    im = plate(frame); pw, ph = im.size; cx, cy, bw, bh = find_object(im)
    out = pathlib.Path(td) / f"s{i:02d}.mp4"; stretch = secs / LIVE_FRAMES_S; n = int(secs * FPS)
    t = S["tint"]
    # the movie is 1744x1308 (4:3); the canvas is its width by 16:9 of it, the plate centred, the tint around
    mw, mh = 1744, 1308; CW, CH = mw, int(mw * 16 / 9); top = (CH - mh) // 2
    vf = (f"setpts={stretch:.3f}*PTS,minterpolate=fps={FPS}:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
          f"scale={mw}:{mh},pad={CW}:{CH}:0:{top}:color={t},"
          + push(cx, cy, bw, bh, mw, mh, CW, CH, top, n).replace(f":d={n}", ":d=1").replace("on/", "in/") + ","
          + S["grade"] + ",format=yuv420p,setsar=1")
    run(["ffmpeg", "-v", "error", "-y", "-noautorotate", "-i", str(src), "-vf", vf, "-frames:v", str(n), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", str(out)]); return out


def title_png(text, S, size, td, name, y_frac, color=(244, 234, 217, 240), tag=None):
    """the title in the style's type, letter-spaced by hand (this ffmpeg's drawtext has no letter_spacing), on a transparent
    1080x1920 sheet; optional weird.baby tag under it in Gill Sans"""
    from PIL import Image, ImageDraw, ImageFont
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    font = ImageFont.truetype(str(FONTS / S["font"]), size); sp = S["spacing"]
    widths = [d.textlength(ch, font=font) for ch in text]; total = sum(widths) + sp * (len(text) - 1)
    x = (W - total) / 2; y = int(H * y_frac)
    for ch, w in zip(text, widths):
        d.text((x + 3, y + 3), ch, font=font, fill=(0, 0, 0, 120)); d.text((x, y), ch, font=font, fill=color); x += w + sp
    if tag:
        tf = ImageFont.truetype(str(FONTS / "GillSansNova.ttf"), 54); tw = sum(d.textlength(c, font=tf) for c in tag) + 6 * (len(tag) - 1)
        tx = (W - tw) / 2; ty = y + size + 70
        for c in tag: d.text((tx, ty), c, font=tf, fill=(217, 203, 182, 235)); tx += d.textlength(c, font=tf) + 6
    out = pathlib.Path(td) / f"{name}.png"; im.save(out); return out

def card_clip(S, td, i, secs=CARD_S, tag=True):
    """the end card (or the boardroom's opening card): the album's name in the style's type on the tinted black, weird.baby under it"""
    out = pathlib.Path(td) / f"s{i:02d}.mp4"
    png = title_png(S["title"], S, S["card_size"], td, f"card{i}", 0.43, tag="weird.baby" if tag else None)
    run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c={S['tint']}:s={W}x{H}:r={FPS}:d={secs}", "-loop", "1", "-t", str(secs), "-i", str(png),
         "-filter_complex", "[0:v][1:v]overlay=0:0:format=auto,format=yuv420p,setsar=1[v]", "-map", "[v]", "-t", str(secs), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", str(out)]); return out

# ── the set and the film: one pass over the assembled middle ────────────────
def scan_png(td, strength):
    """the raster: a dark line every fourth row at the style's strength"""
    from PIL import Image
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); px = im.load(); a = int(255 * strength)
    for y in range(0, H, 4):
        for x in range(W): px[x, y] = (0, 0, 0, a)
    out = pathlib.Path(td) / "scan.png"; im.save(out); return out

def television_and_film(middle, S, td, title_at):
    """chroma bleed and fringing, a soft horizontal resolution, gate weave, flicker, the raster, grain, vignette,
    the warm-up at the top, and the album's name over the first plate"""
    tv = S["tv"]; out = pathlib.Path(td) / "look.mp4"; scan = scan_png(td, tv["scan"])
    title = title_png(S["title"], S, S["title_size"], td, "title", 0.12)
    t0, t1 = title_at
    chain = (f"[0:v]boxblur=lr=1:lp=1:cr={tv['bleed']}:cp=1,chromashift=cbh={tv['fringe']}:crh=-{tv['fringe']},gblur=sigma=0.9:sigmaV=0.2,"
             f"crop=w=iw-16:h=ih-16:x='8+{tv['weave']}*sin(t*9.7)':y='8+{tv['weave']}*sin(t*6.3)',scale={W}:{H},"
             f"eq=brightness='{tv['flicker']}*sin(t*37)+{tv['flicker']*0.6}*sin(t*5.1)':eval=frame,"
             f"rgbashift=rh=26:bh=-26:enable='lt(t,0.45)',gblur=sigma=6:enable='lt(t,0.35)',fade=t=in:st=0:d=0.5[tvv];"
             f"[tvv][2:v]overlay=0:0:format=auto:enable='between(t,{t0},{t1})'[tt];"
             f"[tt][1:v]overlay=0:0:format=auto,noise=alls={S['grain']}:allf=t+u,vignette=PI/4.6,format=yuv420p[v]")
    dur = probe_dur(middle)   # the looped sheets are given the middle's length outright: -shortest with looped inputs hangs on this build
    run(["ffmpeg", "-v", "error", "-y", "-i", str(middle), "-loop", "1", "-t", f"{dur:.3f}", "-i", str(scan), "-loop", "1", "-t", f"{dur:.3f}", "-i", str(title),
         "-filter_complex", chain, "-map", "[v]", "-an", "-t", f"{dur:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "17", str(out)], cwd=td); return out

def bed_row(name):
    return next(r for r in BEDS["rows"] if r["style"] == name)

def bed(S, secs, td, name):
    """the style's 78 through the period's set: band-limited, wow and flutter (the shellac brings its own crackle;
    hiss is off unless a style asks), faded in and out"""
    b = S["bed"]; row = bed_row(name); src = BED_DIR / row["file"]; out = pathlib.Path(td) / "bed.wav"
    chain = (f"[0:a]atrim={row.get('in_s', 0)}:{row.get('in_s', 0)+secs+2},asetpts=PTS-STARTPTS,asetrate=48000*{b['rate']},aresample=48000,aformat=channel_layouts=stereo,"
             f"vibrato=f=0.55:d={b['wow']},vibrato=f=6.5:d={b['flutter']},lowpass=f={b['lp']},highpass=f={b['hp']},tremolo=f=0.35:d=0.10,"
             f"loudnorm=I=-16:TP=-1.5:LRA=9,volume={b['gain']},afade=t=in:st=0:d=0.6,afade=t=out:st={secs-1.2}:d=1.2[m];"   # the transfers sit around -26 dB RMS; brought to reel level first (Mike, 09-17: 'no music came through')
             f"[1:a]volume={b['hiss']}[n];[m][n]amix=inputs=2:duration=first:normalize=0[a]")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-f", "lavfi", "-i", "anoisesrc=c=pink:r=48000:a=1", "-filter_complex", chain, "-map", "[a]", "-t", str(secs), "-c:a", "pcm_s16le", str(out)]); return out

def build_style(name, S, td):
    clips = []; t = 0.0; title_at = None
    if S["card_first"]: clips.append(card_clip(S, td, 90, secs=1.6, tag=False)); t += 1.6
    for i, s in enumerate(S["shots"]):
        if s[0] == "still": clips.append(still_clip(s[1], s[2], s[3], S, td, i))
        elif s[0] == "live": clips.append(live_clip(s[1], s[2], S, td, i))
        if i == 0 and not S["card_first"]: title_at = (t + 1.0, t + s[2])
        t += s[2]
    clips.append(card_clip(S, td, 99))
    n = len(clips); ins = []
    for c in clips: ins += ["-i", str(c)]
    middle = pathlib.Path(td) / "middle.mp4"
    if S["xfade"]:
        d = S["xfade"]; durs = [probe_dur(c) for c in clips]; fc = ""; last = "[0:v]"; off = 0.0
        for k in range(1, n):
            off += durs[k - 1] - d; fc += f"{last}[{k}:v]xfade=transition=fade:duration={d}:offset={off:.3f}[x{k}];"; last = f"[x{k}]"
        fc += f"{last}format=yuv420p[v]"
    else:
        fc = "".join(f"[{k}:v]" for k in range(n)) + f"concat=n={n}:v=1:a=0,format=yuv420p[v]"
    run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", fc, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", str(middle)])
    look = television_and_film(middle, S, td, title_at or (0, 0))
    secs = probe_dur(look); wav = bed(S, secs, td, name)
    with_sound = pathlib.Path(td) / "with_sound.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-i", str(look), "-i", str(wav), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "pcm_s16le", "-shortest", str(with_sound)])
    OUT.mkdir(parents=True, exist_ok=True); dest = OUT / f"broadcast_{name}.mp4"
    RB.build(with_sound, dest)          # the pop first, 1080x1920, stereo 48 kHz
    return dest

# ── the sheet ───────────────────────────────────────────────────────────────
def strip(dest, name, every=0.5, cols=8):
    """frames every half second, a contact strip; the review surface (story first, review first)"""
    from PIL import Image
    dur = probe_dur(dest); n = int(dur / every); tw, th = 180, 320
    with tempfile.TemporaryDirectory() as td:
        run(["ffmpeg", "-v", "error", "-y", "-i", str(dest), "-vf", f"fps=1/{every},scale={tw}:{th}", str(pathlib.Path(td) / "f%03d.jpg")])
        frames = sorted(pathlib.Path(td).glob("f*.jpg")); rows = (len(frames) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * tw, rows * th), (12, 12, 12))
        for k, f in enumerate(frames): sheet.paste(Image.open(f), ((k % cols) * tw, (k // cols) * th))
        out = OUT / f"broadcast_{name}.strip.jpg"; sheet.save(out, quality=82); return out, len(frames)

def sheet(report):
    esc = lambda s: str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    b64 = lambda p: base64.b64encode(pathlib.Path(p).read_bytes()).decode()
    blocks = ""
    for name, r in report.items():
        S = STYLES[name]
        br = bed_row(name)
        blocks += f"""<section><h2>{esc(name)}<small>{esc(S['story'])} · {r['seconds']} s · {esc(pathlib.Path(r['file']).name)}</small></h2>
<p class="line">{esc(S['line'])} Bed: <a href="{esc(br['source'])}">{esc(br['title'])}</a>, {esc(br['performer'])}, {br['year']}, public domain.</p>
<div class="strip"><img src="data:image/jpeg;base64,{b64(r['strip'])}" alt="frames of the {esc(name)} sample, every half second"></div>
<p class="dec"><span class="opt">A this is the {esc(name)}: keep the style as it stands for its stories</span><span class="opt">B keep the style, turn the knobs: say which layer (grade, television, film, type, bed) and which way</span><span class="opt">C drop this style</span></p></section>"""
    html = f"""<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Broadcast Look</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"><style>
:root{{--paper:#f3f4f1;--paper-2:#e9ebe6;--ink:#1c2026;--ink-2:#4a515a;--ink-3:#7a828c;--rule:#cfd3cc;--gold-ink:#7a6122;--you:#6a4c93;--you-bg:#ebe4f3;--ok:#3f7a4f;--ok-bg:#e3efe4}}
@media(prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--paper:#171a1e;--paper-2:#1f2328;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold-ink:#dcc27f;--you:#c2a8e6;--you-bg:#2e2440;--ok:#8fcb9c;--ok-bg:#213827}}}}
:root[data-theme="dark"]{{--paper:#171a1e;--paper-2:#1f2328;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--gold-ink:#dcc27f;--you:#c2a8e6;--you-bg:#2e2440;--ok:#8fcb9c;--ok-bg:#213827}}
html{{color-scheme:light dark}}body{{margin:0;background:var(--paper);color:var(--ink);font-family:Geist,system-ui,-apple-system,"Segoe UI",sans-serif;font-size:15px;line-height:1.5}}
.wrap{{max-width:1500px;margin:0 auto;padding-block:36px 72px;padding-inline:24px}}
.eyebrow{{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);margin:0 0 8px}}
h1{{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:40px;line-height:1.05;margin:0 0 8px;letter-spacing:-.01em}}
.lede{{color:var(--ink-2);max-width:78ch;margin:0 0 10px;font-size:16px}}
.letter{{border-left:3px solid var(--you);background:var(--you-bg);padding:12px 18px;max-width:78ch;margin:0 0 26px}}.letter p{{margin:8px 0}}
h2{{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:28px;margin:38px 0 4px}}h2 small{{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3);margin-left:10px;font-weight:400}}
.line{{color:var(--ink-2);max-width:90ch;margin:0 0 12px}}
.strip{{overflow-x:auto;background:#0c0c0c;padding:6px;border-radius:3px}}.strip img{{display:block;max-width:100%;height:auto}}
.dec{{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 0}}.opt{{border-left:2px solid var(--rule);padding:4px 10px;color:var(--ink-2)}}
table{{border-collapse:collapse;font-size:13.5px;margin:10px 0 0}}th,td{{text-align:left;padding:6px 14px 6px 0;border-bottom:1px solid var(--rule);vertical-align:top}}th{{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3)}}
footer{{margin-top:30px;border-top:1px solid var(--rule);padding-top:12px;font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12px;color:var(--ink-3)}}
@media(max-width:700px){{h1{{font-size:30px}}.wrap{{padding-inline:16px}}}}
</style></head><body><div class="wrap">
<p class="eyebrow">Weird.Baby · Ops · the artifact reels · 2026-09-17</p>
<h1>The Broadcast Look</h1>
<p class="lede">1960s colour television captured to film, as a template: one stack of layers, a style per row. Three samples on the Gambler set of 09-16, fifteen seconds each, in the Finished reels folder under <b>broadcast</b>. Second cut (09-17, late): the plates landscape as shot, each shot opening on the whole tray as a 4:3 raster and pushing into the object (ruling C), public-domain 78s for beds. The strips below are every half second of each sample. Story: docs/BROADCAST-LOOK-20260917.md.</p>
<div class="letter"><p><b>Mike,</b></p>
<p>Three styles on the same five or six plates, so the grade and the type carry the difference, not the objects. Each runs the same stack: plate, motion, grade, television (chroma bleed and fringing, a soft horizontal resolution, the frame breathing, flicker, the raster), film (grain, vignette, the warm-up at the top), the title in the period's type, a bed with wow and flutter, the pop first.</p>
<p>The beds are public-domain 78s from the Internet Archive, one a style, as you ruled (question 2, A): a 1923 fox trot called The Gold Digger under the late show, a 1921 jazz fox trot under the showroom, a 1922 waltz under the boardroom. Each is logged in reels/beds.json with its year and source; nothing is owed on them.</p>
<p>Sunday question 4 stands: one style per story, or a blend. My read after building them: the <b>late show</b> is the Gambler's and would be the Everyday's; the <b>showroom</b> is the CEO's automobiles and fun girls; the <b>boardroom</b> is the Informer's insurance and business. Per story, then, with the television and film layers shared so the wing reads as one broadcast. The knobs are all in one file; a fourth style is one more row.</p>
<p>One law to name: the never-advertised reading of 09-06 says a reel never shows an artifact. The 09-10 reset made the artifacts a thing to sell, so these show the kit and the album's name and nothing of the Record, the ZIP or the portal. If you read it the other way, say so and the artifact reels stop here.</p>
<p>— Ops</p></div>
<table><thead><tr><th>style</th><th>story</th><th>grade</th><th>television</th><th>type</th><th>bed</th></tr></thead><tbody>
<tr><td>the late show</td><td>gambling, gaming</td><td>warm, brown, faded, dark</td><td>heavy bleed, the frame breathes, strong lines</td><td>Cooper Black, capitals</td><td>The Gold Digger, 1923, dull, deep wow</td></tr>
<tr><td>the showroom</td><td>automobiles, fun girls</td><td>bright, saturated then faded to magenta, high key</td><td>strong bleed and fringing, quick flicker</td><td>Brush Script, lower case</td><td>Shake It and Break It, 1921, light wow</td></tr>
<tr><td>the boardroom</td><td>business, insurance</td><td>cool, flat, desaturated</td><td>mild bleed, fine lines, steady</td><td>Gill Sans, spaced capitals, a title card first</td><td>Moon River, 1922, a waltz, narrow band</td></tr>
</tbody></table>
{blocks}
<footer>tools/reels-broadcast.py · the plates are the 09-16 Gambler set, landscape as shot, ruling C (the raster, then the push) · the beds are reels/beds.json · nothing here is a posting</footer>
</div></body></html>"""
    SHEET.write_text(html, encoding="utf-8")

def main():
    args = sys.argv[1:]
    want = [a for a in args if a in STYLES] or list(STYLES)
    rep_path = OUT / "BROADCAST.json"
    report = json.loads(rep_path.read_text(encoding="utf-8")) if rep_path.exists() else {}
    if "--sheet" not in args:
        for name in want:
            with tempfile.TemporaryDirectory() as td:
                dest = build_style(name, STYLES[name], td)
            report[name] = {"file": str(dest), "seconds": round(probe_dur(dest), 1), "line": STYLES[name]["line"]}
            print(f"  {name:10s} {report[name]['seconds']:5.1f}s  {dest.name}", flush=True)
    for name in report:
        s, n = strip(pathlib.Path(report[name]["file"]), name); report[name]["strip"] = str(s); report[name]["frames"] = n
    rep_path.write_text(json.dumps(report, indent=1), encoding="utf-8")
    sheet(report); print(f"  sheet -> {SHEET}")

if __name__ == "__main__":
    main()
