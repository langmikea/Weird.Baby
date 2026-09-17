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
BED = REPO / "public/audio/wb/06_coconuts_2026-06-17.mp3"     # his own song; a stand-in bed, marked in the story
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
        bed=dict(rate=0.93, lp=2600, hp=160, wow=0.22, flutter=0.025, hiss=0.030, gain=0.55),
        card_first=False, xfade=0.5,
        shots=[("still", "0197", 3.4, (0.50, 0.50, 0.80)), ("still", "0203", 2.8, "auto"), ("still", "0216", 2.4, "auto"),
               ("live", "0234", 2.2, None), ("still", "0208", 1.8, "auto")]),
    "showroom": dict(
        line="the showroom: automobiles, fun girls. Bright, saturated then faded to magenta, high key; Brush Script; the bed bright with a light wow.",
        story="automobiles · fun girls",
        grade="curves=r='0/0.06 0.5/0.56 1/0.92':g='0/0.04 0.5/0.50 1/0.88':b='0/0.12 0.5/0.50 1/0.84',colorbalance=rs=.05:bs=.03:rh=.10:gh=-.05:bh=.02,eq=saturation=1.22:contrast=1.06:brightness=0.03",
        tv=dict(bleed=8, weave=1.6, flicker=0.022, scan=0.13, fringe=5),
        grain=14, tint="0x1c1018",
        font="BRUSHSCI.TTF", title="the Gambler", title_size=168, card_size=184, spacing=0,
        bed=dict(rate=1.00, lp=4200, hp=140, wow=0.10, flutter=0.018, hiss=0.018, gain=0.60),
        card_first=False, xfade=0.0,
        shots=[("still", "0197", 2.6, (0.50, 0.50, 0.78)), ("still", "0204", 2.0, "auto"), ("still", "0212", 2.0, "auto"),
               ("live", "0225", 2.0, None), ("still", "0235", 1.6, "auto"), ("still", "0199", 1.8, "auto")]),
    "boardroom": dict(
        line="the boardroom: business, insurance. Cool, flat, desaturated; the industrial film; Gill Sans in spaced capitals; a title card first; a sober bed.",
        story="business · insurance",
        grade="curves=all='0/0.06 0.5/0.48 1/0.86',colortemperature=temperature=7600:mix=0.8,eq=saturation=0.55:contrast=0.94:gamma=0.98,colorbalance=bs=.05:bm=.04:gm=.02",
        tv=dict(bleed=4, weave=1.0, flicker=0.014, scan=0.24, fringe=2),
        grain=18, tint="0x0e1216",
        font="GillSansBoNova.ttf", title="THE GAMBLER", title_size=104, card_size=112, spacing=14,
        bed=dict(rate=0.97, lp=3200, hp=220, wow=0.06, flutter=0.012, hiss=0.022, gain=0.50),
        card_first=True, xfade=0.0,
        shots=[("still", "0197", 3.0, (0.50, 0.50, 0.82)), ("still", "0199", 2.4, "auto"), ("still", "0203", 2.2, "auto"),
               ("still", "0211", 2.2, "auto"), ("still", "0236", 2.0, "auto")]),
}
CARD_S = 1.8

def run(cmd, cwd=None): subprocess.run(cmd, check=True, cwd=cwd)
def probe_dur(p): return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True).stdout)

# ── plates ──────────────────────────────────────────────────────────────────
def frame_png(frame, crop, td):
    """a tray frame, EXIF-righted, cropped to 9:16 around (cx, cy) keeping `frac` of the height (A3: no artificial limit)"""
    from PIL import Image, ImageOps
    im = ImageOps.exif_transpose(Image.open(SRC / f"IMG_{frame}.JPG")); w, h = im.size
    if crop == "auto": crop = find_object(im)
    cx, cy, frac = crop
    ch = int(h * frac); cw = int(ch * 9 / 16)
    if cw > w: cw = w; ch = int(cw * 16 / 9)
    x0 = min(max(int(w * cx) - cw // 2, 0), w - cw); y0 = min(max(int(h * cy) - ch // 2, 0), h - ch)
    out = pathlib.Path(td) / f"f{frame}.png"
    im.crop((x0, y0, x0 + cw, y0 + ch)).resize((W, H), Image.LANCZOS).save(out); return out

def find_object(im, margin=1.5):
    """the object on the white tray: what is clearly darker than the tray's own level, or coloured, inside the tray's
    interior (the rim and the steel rule along the left edge are outside the window), boxed, then framed with a margin;
    returns (cx, cy, frac) for frame_png"""
    import numpy as np
    w, h = im.size; small = im.convert("RGB").resize((w // 8, h // 8)); a = np.asarray(small).astype(int)
    lum = a.mean(axis=2); sat = a.max(axis=2) - a.min(axis=2); sh, sw = lum.shape
    win = (slice(int(sh * 0.16), int(sh * 0.84)), slice(int(sw * 0.26), int(sw * 0.80)))
    tray = np.median(lum[win])
    mask = np.zeros_like(lum, dtype=bool); mask[win] = (lum[win] < tray - 55) | (sat[win] > 70)
    ys, xs = np.where(mask)
    if len(xs) < 20: return (0.5, 0.5, 0.6)
    x0, x1 = np.percentile(xs, [2, 98]); y0, y1 = np.percentile(ys, [2, 98])
    cx, cy = (x0 + x1) / 2 / sw, (y0 + y1) / 2 / sh
    bh = max((y1 - y0) / sh, (x1 - x0) / sw * 16 / 9) * margin
    return (float(cx), float(cy), float(min(max(bh, 0.22), 0.9)))

def still_clip(frame, secs, crop, S, td, i):
    png = frame_png(frame, crop, td); out = pathlib.Path(td) / f"s{i:02d}.mp4"; n = int(secs * FPS)
    vf = (f"zoompan=z='min(zoom+0.0010,1.16)':d={n}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS},"
          + S["grade"] + ",format=yuv420p,setsar=1")
    run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-t", str(secs), "-i", str(png), "-vf", vf, "-t", str(secs), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", str(out)]); return out

def live_clip(frame, secs, S, td, i):
    """the Live Photo's eleven frames stretched: the hand. Copied beside first: OneDrive's cloud files do not decode in place."""
    src = pathlib.Path(td) / f"IMG_{frame}.MOV"; shutil.copy(SRC / f"IMG_{frame}.MOV", src)
    out = pathlib.Path(td) / f"s{i:02d}.mp4"; stretch = secs / LIVE_FRAMES_S
    vf = (f"crop=ih*9/16:ih,scale={W}:{H},setpts={stretch:.3f}*PTS,minterpolate=fps={FPS}:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
          + S["grade"] + ",format=yuv420p,setsar=1")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", vf, "-t", str(secs), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", str(out)]); return out


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

def bed(S, secs, td):
    """his own song through the period's radio: pitched, band-limited, wow and flutter, hiss under it"""
    b = S["bed"]; out = pathlib.Path(td) / "bed.wav"
    chain = (f"[0:a]atrim=0:{secs+2},asetrate=48000*{b['rate']},aresample=48000,aformat=channel_layouts=stereo,"
             f"vibrato=f=0.55:d={b['wow']},vibrato=f=6.5:d={b['flutter']},lowpass=f={b['lp']},highpass=f={b['hp']},tremolo=f=0.35:d=0.10,"
             f"acompressor=threshold=-18dB:ratio=3,volume={b['gain']},afade=t=in:st=0:d=0.6,afade=t=out:st={secs-1.2}:d=1.2[m];"
             f"[1:a]volume={b['hiss']}[n];[m][n]amix=inputs=2:duration=first:normalize=0[a]")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(BED), "-f", "lavfi", "-i", "anoisesrc=c=pink:r=48000:a=1", "-filter_complex", chain, "-map", "[a]", "-t", str(secs), "-c:a", "pcm_s16le", str(out)]); return out

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
    secs = probe_dur(look); wav = bed(S, secs, td)
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
        blocks += f"""<section><h2>{esc(name)}<small>{esc(S['story'])} · {r['seconds']} s · {esc(pathlib.Path(r['file']).name)}</small></h2>
<p class="line">{esc(S['line'])}</p>
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
<p class="lede">1960s colour television captured to film, as a template: one stack of layers, a style per row. Three samples on the Gambler set of 09-16, fifteen seconds each, in the Finished reels folder under <b>broadcast</b>. The strips below are every half second of each sample. Story: docs/BROADCAST-LOOK-20260917.md.</p>
<div class="letter"><p><b>Mike,</b></p>
<p>Three styles on the same five or six plates, so the grade and the type carry the difference, not the objects. Each runs the same stack: plate, motion, grade, television (chroma bleed and fringing, a soft horizontal resolution, the frame breathing, flicker, the raster), film (grain, vignette, the warm-up at the top), the title in the period's type, a bed with wow and flutter, the pop first.</p>
<p>The bed under all three is your June demo of Coconuts put through the period's radio. Original audio pays and a period library is a licensing question, so the sample says "his own song, treated" rather than guessing at a library. If the reels want a bed that is not a song of yours, that is its own question.</p>
<p>Sunday question 4 stands: one style per story, or a blend. My read after building them: the <b>late show</b> is the Gambler's and would be the Everyday's; the <b>showroom</b> is the CEO's automobiles and fun girls; the <b>boardroom</b> is the Informer's insurance and business. Per story, then, with the television and film layers shared so the wing reads as one broadcast. The knobs are all in one file; a fourth style is one more row.</p>
<p>One law to name: the never-advertised reading of 09-06 says a reel never shows an artifact. The 09-10 reset made the artifacts a thing to sell, so these show the kit and the album's name and nothing of the Record, the ZIP or the portal. If you read it the other way, say so and the artifact reels stop here.</p>
<p>— Ops</p></div>
<table><thead><tr><th>style</th><th>story</th><th>grade</th><th>television</th><th>type</th><th>bed</th></tr></thead><tbody>
<tr><td>the late show</td><td>gambling, gaming</td><td>warm, brown, faded, dark</td><td>heavy bleed, the frame breathes, strong lines</td><td>Cooper Black, capitals</td><td>pitched down, dull, deep wow</td></tr>
<tr><td>the showroom</td><td>automobiles, fun girls</td><td>bright, saturated then faded to magenta, high key</td><td>strong bleed and fringing, quick flicker</td><td>Brush Script, lower case</td><td>bright, light wow</td></tr>
<tr><td>the boardroom</td><td>business, insurance</td><td>cool, flat, desaturated</td><td>mild bleed, fine lines, steady</td><td>Gill Sans, spaced capitals, a title card first</td><td>sober, narrow band</td></tr>
</tbody></table>
{blocks}
<footer>tools/reels-broadcast.py · the plates are the 09-16 Gambler set · the beds are public/audio/wb/06_coconuts, treated · nothing here is a posting</footer>
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
