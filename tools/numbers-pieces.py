"""THE NUMBER'S PIECES — a song cut into the ruled pieces (hook, verse, bridge, the story, hook again),
through the reel line, on the shelf in reels/numbers.json, for Mike to rule at the song's sitting.

    python tools/numbers-pieces.py                 cut every piece in reels/numbers.json `pieces` that has a `cut`
    python tools/numbers-pieces.py coconuts-w1-hook   one piece by id
    python tools/numbers-pieces.py --sheet         the review sheet only (first/middle/last frame of each built piece)

A piece is {"id", "song", "week", "slot", "title", "cut": {"src", "start", "end", "push": null | {"cx","cy","zoom"}}}.
  cut     lifted from the take frame-accurately (tools/material-cut.py's lift), then tools/reels-build.py's
          build(): 1080x1920, 30 fps, stereo 48 kHz, the pop first. Nothing is added: no question, no caption.
  push    optional: a centred crop of the take before the line (zoom 1.5 = the middle 720x1280 around cx,cy,
          in source pixels), for the one A/B sample of 09-17; the ruled shape is as shot.
  level   the porch takes sit at -24 LUFS integrated (the Audigo's own gain); the pop is -21; the platforms play at
          about -14. Each piece is measured (ebur128) and lifted by one fixed gain to TARGET_LUFS with a true-peak
          limiter, so the dynamics of the performance are untouched and every piece lands at the same level.
          The sound is eased in over 0.2 s and out over 0.5 s (the picture cuts): a piece is lifted out of a running take.
A piece with no `cut` is one the tape lacks: it names what the 10-20 sitting shoots, and is left alone here.
Output: OneDrive/WeirdBaby/reels/out/numbers-<song>/<id>.mp4 (media never in the repo); file and length written back.
"""
import importlib, json, pathlib, re, subprocess, sys, tempfile
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
RB = importlib.import_module("reels-build")
MC = importlib.import_module("material-cut")

REPO = pathlib.Path(__file__).resolve().parents[1]
LEDGER = REPO / "reels/numbers.json"
OUT_ROOT = pathlib.Path(r"C:\Users\macun\OneDrive\WeirdBaby\reels\out")

TARGET_LUFS, TP = -16.0, -1.5
FADE_IN, FADE_OUT = 0.2, 0.5                 # the sound only: a piece is lifted out of a running performance, so the edges are eased; the picture cuts

def measure(p):
    """integrated loudness of a file, ebur128"""
    out = subprocess.run(["ffmpeg", "-v", "info", "-i", str(p), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.search(r"I:\s+(-?[\d.]+) LUFS", out.rsplit("Summary", 1)[-1]); return float(m.group(1))

def level(seg, dest):
    """one fixed gain to TARGET_LUFS, limited at TP dBTP; the video copied through"""
    g = TARGET_LUFS - measure(seg)
    _, _, d = RB.probe(seg)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(seg), "-c:v", "copy",
                    "-af", f"volume={g:.2f}dB,alimiter=limit={10 ** (TP / 20):.4f}:attack=5:release=50:level=false,"
                           f"afade=t=in:d={FADE_IN},afade=t=out:st={max(d - FADE_OUT, 0):.2f}:d={FADE_OUT}", "-c:a", "pcm_s16le", str(dest)], check=True)
    return round(g, 1)

def slug(s): return "".join(ch if ch.isalnum() else "-" for ch in s.lower()).strip("-")

def lift_push(src, start, end, push, dest):
    """the segment with a centred crop: zoom z keeps the middle (W/z x H/z) around (cx,cy), scaled back to the source size"""
    W, H, _ = RB.probe(src)
    rot = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream_side_data=rotation", "-of", "csv=p=0", str(src)], capture_output=True, text=True).stdout.strip()
    if rot.lstrip("-") in ("90", "270"): W, H = H, W        # the phone's tape is stored on its side; the decoder turns it, so the crop is in the turned frame
    z = float(push["zoom"]); cw, ch = int(W / z) // 2 * 2, int(H / z) // 2 * 2
    cx = min(max(int(push["cx"]) - cw // 2, 0), W - cw); cy = min(max(int(push["cy"]) - ch // 2, 0), H - ch)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-to", str(end), "-i", str(src),
                    "-vf", f"crop={cw}:{ch}:{cx}:{cy},scale={W}:{H}:flags=lanczos",
                    "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-c:a", "pcm_s16le", str(dest)], check=True)

def cut(piece):
    c = piece["cut"]; out = OUT_ROOT / f"numbers-{slug(piece['song'])}"; out.mkdir(parents=True, exist_ok=True)
    dest = out / f"{piece['id']}.mp4"
    with tempfile.TemporaryDirectory() as td:
        seg = pathlib.Path(td) / "seg.mov"
        if c.get("push"): lift_push(c["src"], c["start"], c["end"], c["push"], seg)
        else: MC.lift(c["src"], c["start"], c["end"], seg)
        lev = pathlib.Path(td) / "lev.mov"; g = level(seg, lev)
        RB.build(lev, dest)
    _, _, d = RB.probe(dest)
    piece["file"] = str(dest); piece["length_s"] = round(d, 1); piece["gain_db"] = g
    print(f"{piece['id']}: {d:.1f} s, gain {g:+.1f} dB -> {dest}", flush=True)

def sheet(pieces, dest):
    """one row a piece: the first frame after the pop, the middle, the last; the review before Mike sees it"""
    built = [p for p in pieces if p.get("file") and pathlib.Path(p["file"]).exists()]
    if not built: return
    with tempfile.TemporaryDirectory() as td:
        rows = []
        for p in built:
            d = p["length_s"]; pop = RB.probe(RB.POP)[2]; frames = []
            for i, t in enumerate((pop + 0.4, (pop + d) / 2, max(d - 0.3, pop + 0.4))):   # the pop runs first; the first frame is the piece's own
                f = pathlib.Path(td) / f"{p['id']}-{i}.png"
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", p["file"], "-frames:v", "1", "-vf", "scale=216:384", str(f)], check=True)
                frames.append(f)
            row = pathlib.Path(td) / f"{p['id']}-row.png"
            subprocess.run(["ffmpeg", "-v", "error", "-y", *sum([["-i", str(f)] for f in frames], []),
                            "-filter_complex", f"hstack=3,drawtext=text='{p['id']}  {p['length_s']}s':x=8:y=8:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6",
                            str(row)], check=True)
            rows.append(row)
        subprocess.run(["ffmpeg", "-v", "error", "-y", *sum([["-i", str(r)] for r in rows], []),
                        "-filter_complex", f"vstack={len(rows)}" if len(rows) > 1 else "null", str(dest)], check=True)
    print("sheet ->", dest)

def main():
    args = sys.argv[1:]
    led = json.load(open(LEDGER, encoding="utf-8"))
    pieces = led.get("pieces", [])
    if "--sheet" in args:
        sheet(pieces, OUT_ROOT / "numbers-coconuts" / "REVIEW-SHEET.png"); return
    want = set(args)
    todo = [p for p in pieces if p.get("cut") and (not want or p["id"] in want)]
    if not todo: sys.exit("nothing to cut")
    for p in todo: cut(p)
    LEDGER.write_text(json.dumps(led, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    sheet(pieces, OUT_ROOT / f"numbers-{slug(todo[0]['song'])}" / "REVIEW-SHEET.png")

if __name__ == "__main__":
    main()
