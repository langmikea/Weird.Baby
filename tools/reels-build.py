"""THE REEL LINE — from a clip Mike shot to a packet he can post.

    python tools/reels-build.py --lane numbers --week 2
    python tools/reels-build.py --lane numbers --week 2 --dry
    python tools/reels-build.py --lane practice                      # every practice-*.mp4 in the intake
    python tools/reels-build.py --lane practice --question "Will it rain on the parade?" --hold 6

THE QUESTION LAYER [Mike, 2026-09-12]: the question is burned in as large,
readable text over the opening beat (sound-off viewers lose nothing) and is
voiced by THE ADULT (tools/reels-voice.py), a muted mumble generated from the
sentence, never the machine's voice. A Determination row's `question` is used
when it has one; `--question` overrides; the practice lane uses `--question`
or a stand-in line. `--hold` is how long the text stays (seconds; the ruled
shape keeps it up until the answer).

Reads clips from the intake folder, one per weekday, named by week and day:

    <intake>/numbers/w2-mon.mp4   (mp4, mov or m4v; case does not matter)
    <intake>/numbers/w2-tue.mp4   ...

For each clip: normalise to 1080x1920 at 30 fps with stereo 48 kHz sound,
append the pop (the ruled Weird.Baby ending, robots assets/video), write
the finished file to the week's packet folder, mark the ledger row `shot`
with the file and its length, and write the packet's captions and schedule.
Mike posts from the phone; nothing here touches an account.

Intake and packets live in OneDrive so the phone can drop and pick up:
    C:/Users/macun/OneDrive/WeirdBaby/reels/intake/<lane>/
    C:/Users/macun/OneDrive/WeirdBaby/reels/out/<lane>-w<week>/
The ledger is reels/<lane>.json in this repo. Media never enters the repo.
"""
import argparse, json, pathlib, re, subprocess, sys, datetime, tempfile, textwrap
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import importlib
VOICE = importlib.import_module("reels-voice")

REPO = pathlib.Path(__file__).resolve().parents[1]
ONE = pathlib.Path("C:/Users/macun/OneDrive/WeirdBaby/reels")
POP = pathlib.Path("C:/AI/Projects/weird-baby-robots/assets/video/WB_pop_v1.mp4")
LEDGER = {"numbers": REPO / "reels/numbers.json", "determinations": REPO / "reels/determinations.json"}
DAYS = ["mon", "tue", "wed", "thu", "fri"]
# Ops' call, 2026-09-03: the Number at noon New York, the Determination at five with the Record.
POST_TIMES = {"numbers": "12:00 America/New_York", "determinations": "17:00 America/New_York"}

def probe(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,duration", "-of", "json", str(p)], capture_output=True, text=True, check=True).stdout
    j = json.loads(out); v = next((s for s in j["streams"] if s["codec_type"] == "video"), {})
    return int(v.get("width", 0)), int(v.get("height", 0)), float(v.get("duration") or 0)

FONT_SRC = pathlib.Path("C:/Windows/Fonts/georgiab.ttf")   # copied beside the text file at build time; drawtext then sees plain relative names and no drive colon to escape
TEXT_LINE_CHARS = 18                      # Georgia Bold 76px on 1080 wide, with margins
VOICE_AT = 0.5                            # seconds in before the adult starts

def question_lines(q, tmpdir):
    """one text file per line: drawtext in this ffmpeg draws a line break as a box glyph,
    so each line is its own drawtext at its own y, over one shared box."""
    lines = textwrap.wrap(q.strip(), TEXT_LINE_CHARS) or [q.strip()]
    files = []
    for i, ln in enumerate(lines):
        f = pathlib.Path(tmpdir) / f"q{i}.txt"
        f.write_bytes(ln.encode("utf-8"))
        files.append(f.name)
    return files

def build(clip, dest, question=None, hold=6.0):
    """normalise the clip; burn the question in and lay the adult under it when there is one; append the pop"""
    with tempfile.TemporaryDirectory() as td:
        inputs = ["-i", str(clip), "-i", str(POP)]
        vchain = ("scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black,"
                  "fps=30,format=yuv420p,setsar=1")
        achain = "[0:a]aformat=sample_rates=48000:channel_layouts=stereo[a0]"
        if question:
            import shutil; shutil.copy(FONT_SRC, pathlib.Path(td) / "font.ttf")
            names = question_lines(question, td)
            nlines = len(names)
            size = 76 if nlines <= 3 else 64
            lead = size + 16
            box_x, box_y, box_w = 90, 170, 900
            box_h = nlines * lead + 44
            # one soft black box in the top third, then each line left-aligned inside it; up for `hold` seconds
            vchain += f",drawbox=x={box_x}:y={box_y}:w={box_w}:h={box_h}:color=black@0.55:t=fill:enable='between(t,0,{hold})'"
            for i, name in enumerate(names):
                vchain += (f",drawtext=fontfile=font.ttf:textfile={name}:fontsize={size}:fontcolor=white:"
                           f"x={box_x + 30}:y={box_y + 22 + i * lead}:enable='between(t,0,{hold})'")
            voice = pathlib.Path(td) / "adult.wav"
            VOICE.write_wav(voice, VOICE.render(question))
            inputs += ["-i", str(voice)]
            achain = ("[0:a]aformat=sample_rates=48000:channel_layouts=stereo[c0];"
                      f"[2:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={int(VOICE_AT*1000)}|{int(VOICE_AT*1000)},volume=0.9[q0];"
                      "[c0][q0]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[a0]")
        vf = (f"[0:v]{vchain}[v0];{achain};"
              "[1:v]fps=30,format=yuv420p,setsar=1[v1];"
              "[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];"
              "[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]")
        cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", vf,
               "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(dest)]
        subprocess.run(cmd, check=True, cwd=td)

PRACTICE_QUESTION = "Is this the right room for the machine?"

def practice(a):
    """the practice lane: no ledger, nothing posted. Every practice-*.mp4 in the intake becomes a
    reel in out/practice/ with the question layer and the pop, so Mike sees the whole shape."""
    intake = pathlib.Path(a.intake) if a.intake else ONE / "intake" / "practice"
    out = ONE / "out" / "practice"
    clips = sorted(f for f in intake.glob("*") if re.fullmatch(r"practice-.*\.(mp4|mov|m4v)", f.name.lower()))
    print(f"THE REEL LINE — practice. intake {intake}")
    if not clips: print("  nothing to build. Drop practice-<date>-N.mp4 into the intake folder."); return
    out.mkdir(parents=True, exist_ok=True)
    q = a.question or PRACTICE_QUESTION
    for c in clips:
        dest = out / (c.stem + "_reel.mp4")
        if dest.exists() and not a.force and dest.stat().st_mtime >= c.stat().st_mtime:
            print(f"  {c.name}  already built -> {dest.name}"); continue
        w, h, dur = probe(c)
        print(f"  {c.name}  {w}x{h} {dur:.1f}s  ->  {dest.name}")
        if a.dry: continue
        build(c, dest, question=q, hold=a.hold)
        _, _, total = probe(dest); print(f"        built {total:.1f}s")
    if a.dry: print("  dry run; nothing written")

def caption(lane, row):
    if lane == "numbers":
        head = f"{row['song']} — {row['piece']}."
        return f"{head} Papa Weird.Baby, live. The rest is at weird.baby\n#weirdbaby #originalsong #livemusic #blues #indie"
    q = row.get("question") or "the question of the day"
    return f"The Determination. {q}\nweird.baby\n#weirdbaby #mgk #fortune"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lane", choices=list(LEDGER) + ["practice"], required=True)
    ap.add_argument("--week", type=int, default=None)
    ap.add_argument("--question", default=None, help="burn this question in (overrides the ledger row's)")
    ap.add_argument("--hold", type=float, default=6.0, help="seconds the question text stays up")
    ap.add_argument("--force", action="store_true", help="practice lane: rebuild even if the reel is newer than the clip")
    ap.add_argument("--intake", default=None, help="override the intake folder (default OneDrive/…/intake/<lane>)")
    ap.add_argument("--dry", action="store_true", help="say what would happen; touch nothing")
    a = ap.parse_args()
    if a.lane == "practice": return practice(a)
    if a.week is None: sys.exit("--week is required for a ledger lane")
    intake = pathlib.Path(a.intake) if a.intake else ONE / "intake" / a.lane
    out = ONE / "out" / f"{a.lane}-w{a.week}"
    led_path = LEDGER[a.lane]; led = json.loads(led_path.read_text(encoding="utf-8"))
    rows = {r["day"].lower(): r for r in led["rows"] if r["week"] == a.week}
    if not rows: sys.exit(f"no week {a.week} in {led_path.name}")
    if not POP.exists(): sys.exit(f"the pop is missing: {POP}")
    clips = {}
    for f in sorted(intake.glob("*")):
        m = re.fullmatch(rf"w{a.week}-(mon|tue|wed|thu|fri)\.(mp4|mov|m4v)", f.name.lower())
        if m: clips[m.group(1)] = f
    print(f"THE REEL LINE — {a.lane}, week {a.week}. intake {intake}")
    if not clips:
        print(f"  nothing to build. Drop clips named w{a.week}-mon.mp4 … w{a.week}-fri.mp4 into the intake folder."); return
    out.mkdir(parents=True, exist_ok=True)
    caps, sched = [], []
    for day in DAYS:
        row = rows.get(day)
        if not row: continue
        if day not in clips:
            print(f"  {day.upper()}  {row.get('song') or row.get('question') or '-'} {row.get('piece','')}  [no clip in intake]"); continue
        w, h, dur = probe(clips[day])
        slug = re.sub(r"[^a-z0-9]+", "-", f"{row.get('song','')}-{row.get('piece','') or row.get('question','')}".lower()).strip("-") or a.lane
        dest = out / f"{row['date']}_{a.lane}_{slug}.mp4"
        print(f"  {day.upper()}  {clips[day].name}  {w}x{h} {dur:.1f}s  ->  {dest.name}")
        if a.dry: continue
        q = a.question or (row.get("question") if a.lane == "determinations" else None)
        build(clips[day], dest, question=q, hold=a.hold)
        _, _, total = probe(dest)
        row["status"] = "shot"; row["file"] = str(dest); row["length_s"] = round(total, 1); row["built"] = datetime.date.today().isoformat()
        caps.append(f"{row['date']} {day.upper()}  ({total:.1f}s)\n{caption(a.lane, row)}\n")
        sched.append(f"{row['date']}  {POST_TIMES[a.lane]}  {dest.name}  TikTok → Instagram → YouTube Shorts → Facebook")
        print(f"        built {total:.1f}s")
    if a.dry: print("  dry run; nothing written"); return
    if caps:
        (out / "CAPTIONS.txt").write_text("CAPTIONS — drafts for Mike to keep or change in the app. One per reel.\n\n" + "\n".join(caps), encoding="utf-8")
        (out / "SCHEDULE.txt").write_text("SCHEDULE — Mike posts from the phone; the order of surfaces is the release rule.\n\n" + "\n".join(sched) + "\n", encoding="utf-8")
        led_path.write_text(json.dumps(led, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"  packet: {out}\n  ledger updated: {led_path.name}")

if __name__ == "__main__":
    main()
