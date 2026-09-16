"""THE PORTFOLIO — six flavors cut from one test set, to learn what the set can do.

Mike, 2026-09-16, ruling A: "Produce a portfolio of reels that demonstrates
many unique flavors (glitchy, buttery, gnashing, as examples only), which in
itself tells us our depth and points out must-have and like-to-have shots.
Think classic 1960s advertising and television; flavors, not brands. Like
MGK-VIIIp does: indirectly and discreetly."

    python tools/reels-portfolio.py             build all six into OneDrive/WeirdBaby/reels/out/portfolio
    python tools/reels-portfolio.py newsreel    one flavor

Every reel: the pop first, a question burned in with THE ADULT under it, a
middle cut ONLY from the 09-16 set (the fifty tray frames, their Live Photo
movies, the 4K turn of the Everyday), then the answer beat. THE GLASS IS NOT
BUILT YET (ruled C on 09-12: it waits for the plate), so the answer beat is a
STAND-IN CARD, marked as such on the frame. The question layer and the pop
come from tools/reels-build.py, so this is the reel line's own cut-list engine
in its first form, not a second line.

Same except data: a flavor is a name, a look (an ffmpeg filter chain), a shot
list, a question and an answer. Add a flavor by adding a row.
"""
import importlib, json, pathlib, shutil, subprocess, sys, tempfile, textwrap
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
RB = importlib.import_module("reels-build")

SRC = pathlib.Path(r"C:\Users\macun\OneDrive\Desktop - Laptop\Weird.Baby\New folder")
OUT = pathlib.Path(r"C:\Users\macun\OneDrive\WeirdBaby\reels\out\portfolio")
SHORT = pathlib.Path(r"C:\AI\Projects\weird-baby-robots\assets\audio\WB_electrical-short_v1.wav")
FONT_BOLD = pathlib.Path(r"C:\Windows\Fonts\arialbd.ttf")
FONT_MONO = pathlib.Path(r"C:\Windows\Fonts\cour.ttf")
W, H, FPS = 1080, 1920, 30
ANSWER_S = 2.6           # the stand-in card
HOLD = 5.0               # the question stays this long over the opening shots

# ── looks: an ffmpeg chain applied to every shot of a flavor ────────────────
LOOK = {
    "colour":   "eq=saturation=1.04:contrast=1.02",
    "handled":  "format=gray,curves=all='0/0.06 0.5/0.52 1/0.97',noise=alls=14:allf=t+u,vignette=PI/5,eq=contrast=1.04",
    "buttery":  "colorbalance=rs=.06:gs=.02:bs=-.06,eq=saturation=0.88:contrast=0.94:brightness=0.02",
    "glitch":   "eq=saturation=1.1,rgbashift=rh=7:bh=-7:enable='lt(mod(t,0.9),0.14)',negate=enable='lt(mod(t,0.9),0.07)'",
    "gnash":    "eq=saturation=1.08:contrast=1.12,unsharp=5:5:0.8",
}

# ── the six flavors: what they are, what they use ───────────────────────────
# shot: ("still", frame, seconds, zoom?) · ("live", frame, seconds) · ("turn", start_s, seconds, speed, reverse?)
FLAVORS = {
    "catalogue": dict(
        line="the catalogue page: clean colour, one object at a time, the slow push of a product still",
        look="colour", zoom=True, xfade=0.0,
        shots=[("still", "0197", 2.4), ("still", "0203", 2.1), ("still", "0211", 2.1), ("still", "0241", 2.1), ("still", "0199", 2.0)],
        question="Should I buy the extended warranty?", answer="THE ODDS FAVOR\nTHE HOUSE.\nTHEY ALWAYS DO."),
    "newsreel": dict(
        line="the newsreel: black and white, the handled print, hard cuts, no shot longer than a breath",
        look="handled", zoom=False, xfade=0.0,
        shots=[("still", "0198", 1.4), ("still", "0205", 1.3), ("still", "0213", 1.3), ("still", "0208", 1.2), ("still", "0227", 1.4), ("still", "0236", 1.3), ("still", "0221", 1.4), ("still", "0217", 1.5)],
        question="Is my neighbor telling the truth about the fence?", answer="MY SOURCES SAY NO.\nMY SOURCES\nKNOW THE ODDS."),
    "demonstration": dict(
        line="the demonstration: hands in frame, the Live Photo's eleven frames stretched into slow motion, unhurried",
        look="colour", zoom=False, xfade=0.0,
        shots=[("live", "0234", 3.0), ("live", "0219", 2.7), ("live", "0225", 2.7), ("live", "0243", 2.7)],
        question="Will the check clear?", answer="NOT YET.\nTHE HAND IS STILL\nBEING DEALT."),
    "glitch": dict(
        line="the glitch: the electrical short as a rhythm, inversions and colour splits, the turn breaking in",
        look="glitch", zoom=False, xfade=0.0, hits=True,
        shots=[("still", "0197", 1.8), ("turn", 1.0, 1.2, 1.0, False), ("still", "0204", 1.8), ("turn", 4.0, 1.2, 1.0, False), ("still", "0212", 1.8), ("turn", 6.5, 1.4, 1.0, False), ("still", "0226", 1.6)],
        question="Is this the year I learn to play cards?", answer="MOST LIKELY, YES.\nTHE TABLE LEANS\nYOUR WAY TONIGHT."),
    "buttery": dict(
        line="the buttery drift: warm, slow zooms, long dissolves, nothing hurries",
        look="buttery", zoom=True, xfade=0.9,
        shots=[("still", "0230", 3.6), ("still", "0197", 3.6), ("still", "0215", 3.6), ("still", "0245", 3.6)],
        question="Do they miss me at the office?", answer="NO.\nONE DAY I HOPE\nYOU UNDERSTAND."),
    "gnashing": dict(
        line="the gnashing cut: the 4K turn in bursts, forward and back, coins and chips jammed between",
        look="gnash", zoom=False, xfade=0.0,
        shots=[("turn", 0.5, 0.5, 2.0, False), ("still", "0216", 0.35), ("turn", 3.0, 0.5, 2.0, True), ("still", "0207", 0.35), ("turn", 5.5, 0.6, 2.0, False), ("still", "0217", 0.35),
               ("turn", 7.5, 0.6, 2.0, True), ("still", "0218", 0.35), ("turn", 2.0, 0.7, 1.5, False), ("still", "0203", 0.4), ("turn", 6.0, 0.9, 1.0, False), ("still", "0211", 0.5), ("turn", 8.2, 1.0, 1.0, True), ("still", "0205", 0.4), ("turn", 1.5, 0.8, 2.0, False), ("still", "0209", 0.4), ("turn", 4.5, 1.2, 1.0, True), ("still", "0212", 0.4)],
        question="Should I bet on the home team tonight?", answer="THE SMART MONEY\nLEFT AN HOUR AGO."),
}

# ── the shots ───────────────────────────────────────────────────────────────
def frame_png(frame, td):
    """a tray frame, EXIF-righted, cropped INSIDE the tray (ruled 09-10) to 9:16, at 1080x1920"""
    from PIL import Image, ImageOps
    src = SRC / f"IMG_{frame}.JPG"
    im = ImageOps.exif_transpose(Image.open(src)); w, h = im.size
    cw = int(h * 0.72 * 9 / 16); box = (w // 2 - cw // 2, int(h * 0.14), w // 2 + cw // 2, int(h * 0.86))
    out = pathlib.Path(td) / f"f{frame}.png"
    im.crop(box).resize((W, H), Image.LANCZOS).save(out); return out

def run(cmd): subprocess.run(cmd, check=True)

def still_clip(frame, secs, look, zoom, td, i):
    png = frame_png(frame, td); out = pathlib.Path(td) / f"s{i:02d}.mp4"
    n = int(secs * FPS)
    vf = (f"zoompan=z='min(zoom+0.0009,1.14)':d={n}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS}," if zoom else f"fps={FPS},") + LOOK[look] + ",format=yuv420p,setsar=1"
    run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-t", str(secs), "-i", str(png), "-vf", vf, "-t", str(secs), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", str(out)]); return out

LIVE_FRAMES_S = 11 / 30.0   # measured 09-16: each Live Photo movie holds eleven video frames, not three seconds

def live_clip(frame, secs, look, td, i):
    """the Live Photo's eleven frames, stretched to the shot with motion interpolation: the slow hand"""
    src = SRC / f"IMG_{frame}.MOV"; out = pathlib.Path(td) / f"s{i:02d}.mp4"
    stretch = secs / LIVE_FRAMES_S
    vf = (f"crop=ih*9/16:ih,scale={W}:{H},setpts={stretch:.3f}*PTS,minterpolate=fps={FPS}:mi_mode=mci:mc_mode=aobmc:vsbmc=1,"
          + LOOK[look] + ",format=yuv420p,setsar=1")
    run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", vf, "-t", str(secs), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", str(out)]); return out

def turn_clip(start, secs, speed, rev, look, td, i):
    src = SRC / "IMG_0249.MOV"; out = pathlib.Path(td) / f"s{i:02d}.mp4"
    vf = f"crop=ih*9/16:ih,scale={W}:{H},setpts=PTS/{speed}" + (",reverse" if rev else "") + f",fps={FPS}," + LOOK[look] + ",format=yuv420p,setsar=1"
    run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-t", str(secs * speed), "-i", str(src), "-vf", vf, "-t", str(secs), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", str(out)]); return out

def answer_card(answer, td, i):
    """THE STAND-IN for the glass: the answer, set large on black, marked as a stand-in on the frame"""
    out = pathlib.Path(td) / f"s{i:02d}.mp4"; lines = answer.split("\n")
    shutil.copy(FONT_BOLD, pathlib.Path(td) / "bold.ttf"); shutil.copy(FONT_MONO, pathlib.Path(td) / "mono.ttf")
    for k, ln in enumerate(lines): (pathlib.Path(td) / f"a{k}.txt").write_bytes(ln.encode("utf-8"))
    (pathlib.Path(td) / "mark.txt").write_bytes(b"THE GLASS  -  STAND-IN CARD UNTIL THE PLATE")
    size = 86; lead = size + 22; y0 = H // 2 - (len(lines) * lead) // 2
    vf = f"fps={FPS}"
    for k in range(len(lines)):
        vf += f",drawtext=fontfile=bold.ttf:textfile=a{k}.txt:fontsize={size}:fontcolor=white:x=(w-text_w)/2:y={y0 + k * lead}"
    vf += ",drawtext=fontfile=mono.ttf:textfile=mark.txt:fontsize=26:fontcolor=gray:x=(w-text_w)/2:y=h-140,fade=t=in:st=0:d=0.25,format=yuv420p,setsar=1"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:s={W}x{H}:r={FPS}:d={ANSWER_S}", "-vf", vf, "-t", str(ANSWER_S), "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", str(out)], check=True, cwd=td); return out

def build_flavor(name, F, td):
    clips = []
    for i, s in enumerate(F["shots"]):
        if s[0] == "still": clips.append(still_clip(s[1], s[2], F["look"], F["zoom"], td, i))
        elif s[0] == "live": clips.append(live_clip(s[1], s[2], F["look"], td, i))
        elif s[0] == "turn": clips.append(turn_clip(s[1], s[2], s[3], s[4], F["look"], td, i))
    clips.append(answer_card(F["answer"], td, 99))
    middle = pathlib.Path(td) / "middle.mp4"
    n = len(clips); ins = []
    for c in clips: ins += ["-i", str(c)]
    if F.get("xfade"):
        # long dissolves: chain xfade; offsets accumulate
        d = F["xfade"]; durs = [float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(c)], capture_output=True, text=True).stdout) for c in clips]
        fc = ""; last = "[0:v]"; off = 0.0
        for k in range(1, n):
            off += durs[k - 1] - d
            fc += f"{last}[{k}:v]xfade=transition=fade:duration={d}:offset={off:.3f}[x{k}];"; last = f"[x{k}]"
        fc += f"{last}format=yuv420p[v]"
        vmap = "[v]"
    else:
        fc = "".join(f"[{k}:v]" for k in range(n)) + f"concat=n={n}:v=1:a=0,format=yuv420p[v]"; vmap = "[v]"
    # a silent stereo bed so the reel line has an audio stream to mix the adult into; the glitch flavor gets the short as hits
    audio_in = ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo"]
    cmd = ["ffmpeg", "-v", "error", "-y", *ins, *audio_in, "-filter_complex", fc, "-map", vmap, "-map", f"{n}:a", "-shortest", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-b:a", "128k", str(middle)]
    run(cmd)
    if F.get("hits"):
        hit = pathlib.Path(td) / "hits.mp4"
        # the short lands on the first frame of every turn burst
        t = 0.0; delays = []
        for s in F["shots"]:
            if s[0] == "turn": delays.append(t)
            t += s[2]
        fc = "".join(f"[1:a]adelay={int(d*1000)}|{int(d*1000)},volume=0.6[h{k}];" for k, d in enumerate(delays))
        fc += "[0:a]" + "".join(f"[h{k}]" for k in range(len(delays))) + f"amix=inputs={len(delays)+1}:duration=first:normalize=0[a]"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(middle), "-i", str(SHORT), "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", str(hit)])
        middle = hit
    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / f"portfolio_{name}.mp4"
    RB.build(middle, dest, question=F["question"], hold=HOLD)
    return dest

def main():
    want = [a for a in sys.argv[1:] if a in FLAVORS] or list(FLAVORS)
    report = {}
    for name in want:
        F = FLAVORS[name]
        with tempfile.TemporaryDirectory() as td:
            dest = build_flavor(name, F, td)
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dest)], capture_output=True, text=True).stdout)
        used = sorted({str(s[1]) for s in F["shots"] if s[0] != "turn"} | ({"0249"} if any(s[0] == "turn" for s in F["shots"]) else set()))
        report[name] = {"file": str(dest), "seconds": round(dur, 1), "line": F["line"], "question": F["question"], "answer": F["answer"].replace("\n", " "), "frames": used}
        print(f"  {name:14s} {dur:5.1f}s  {dest.name}  frames {', '.join(used)}")
    (OUT / "PORTFOLIO.json").write_text(json.dumps(report, indent=1), encoding="utf-8")
    print(f"  wrote {OUT / 'PORTFOLIO.json'}")

if __name__ == "__main__":
    main()
