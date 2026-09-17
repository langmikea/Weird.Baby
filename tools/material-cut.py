"""MATERIAL CUTS — pieces cut from the material in hand, through the reel line, for Mike to rule.

    python tools/material-cut.py                 build every piece in docs/MATERIAL-20260917.json (rows with `cut`)
    python tools/material-cut.py coconuts-0824-take1-hook   one piece by id

A `cut` on a catalogue row is {"src": <file>, "start": s, "end": s, "kind": "number" | "scope"}.
  number  the segment is lifted from the take (frame-accurate re-encode), then goes through
          tools/reels-build.py's build(): 1080x1920, 30 fps, stereo 48 kHz, the pop first.
          Nothing is added: no question, no adult, no caption. That is the Number's shape.
  scope   the audio-only shape that does not exist yet (the brief of 09-17: "the voice-only
          files, oscilloscope treatment"): the waveform of the sound, drawn in the machine's
          yellow at the glass's proportion (128x64 at 8x) on black, drawn in Python, then the pop first. A
          SKETCH of a missing template, marked as such in the catalogue, not a template.
Output: OneDrive/WeirdBaby/reels/out/material/<id>.mp4 (media never in the repo).
"""
import importlib, json, pathlib, subprocess, sys, tempfile
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
RB = importlib.import_module("reels-build")

REPO = pathlib.Path(__file__).resolve().parents[1]
CAT = REPO / "docs/MATERIAL-20260917.json"
OUT = pathlib.Path(r"C:\Users\macun\OneDrive\WeirdBaby\reels\out\material")
def lift(src, start, end, dest):
    """the segment, re-encoded so the cut lands on the frame; the phone's rotation is honoured by the decoder"""
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(start), "-to", str(end), "-i", str(src),
                    "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-c:a", "pcm_s16le", str(dest)], check=True)

def scope(src, start, end, dest):
    """the waveform on black, the glass's proportion, centred in the reel frame.
    Drawn here, not by ffmpeg's showwaves: on this build (8.0.1) showwaves' frames come out of
    the yuv conversion purple whatever the colour option says, so the frames are drawn in
    Python (numpy + PIL) and piped to ffmpeg as raw RGB; the sound is the source segment."""
    import numpy as np
    from PIL import Image, ImageDraw
    SR, FPS, W, H, GW, GH = 48000, 30, 1080, 1920, 1024, 512
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(start), "-to", str(end), "-i", str(src),
                          "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    a = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0
    per = SR // FPS; frames = len(a) // per
    x0, y0 = (W - GW) // 2, (H - GH) // 2
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                            "-ss", str(start), "-to", str(end), "-i", str(src), "-map", "0:v", "-map", "1:a",
                            "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", "-shortest", str(dest)], stdin=subprocess.PIPE)
    yellow = (255, 210, 63)
    for f in range(frames):
        win = a[f * per:(f + 1) * per]
        bins = np.abs(win[: (len(win) // GW) * GW].reshape(GW, -1)).max(axis=1) if len(win) >= GW else np.zeros(GW)
        amp = np.sqrt(np.clip(bins, 0, 1)) * (GH / 2 - 8)
        im = Image.new("RGB", (W, H), "black"); d = ImageDraw.Draw(im)
        cy = y0 + GH // 2
        pts = [(x0 + x, cy - amp[x]) for x in range(GW)] + [(x0 + x, cy + amp[x]) for x in range(GW - 1, -1, -1)]
        d.polygon(pts, fill=yellow)
        enc.stdin.write(im.tobytes())
    enc.stdin.close(); enc.wait()
    if enc.returncode: raise RuntimeError("scope encode failed")

def main():
    want = set(sys.argv[1:])
    rows = [r for r in json.load(open(CAT, encoding="utf-8"))["rows"] if r.get("cut") and (not want or r["id"] in want)]
    if not rows: sys.exit("nothing to cut")
    OUT.mkdir(parents=True, exist_ok=True)
    for r in rows:
        c = r["cut"]; dest = OUT / f"{r['id']}.mp4"
        with tempfile.TemporaryDirectory() as td:
            seg = pathlib.Path(td) / "seg.mov"
            (scope if c["kind"] == "scope" else lift)(c["src"], c["start"], c["end"], seg)
            RB.build(seg, dest)
        w, h, d = RB.probe(dest)
        r["file"] = str(dest); r["length_s"] = round(d, 1)
        print(f"{r['id']}: {d:.1f} s -> {dest}")
    if not want:
        cat = json.load(open(CAT, encoding="utf-8"))
        by = {r["id"]: r for r in rows}
        for r in cat["rows"]:
            if r["id"] in by: r["file"] = by[r["id"]]["file"]; r["length_s"] = by[r["id"]]["length_s"]
        json.dump(cat, open(CAT, "w", encoding="utf-8"), indent=1, ensure_ascii=False)

if __name__ == "__main__":
    main()
