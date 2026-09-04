"""THE REEL LINE — from a clip Mike shot to a packet he can post.

    python tools/reels-build.py --lane numbers --week 2
    python tools/reels-build.py --lane numbers --week 2 --dry

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
import argparse, json, pathlib, re, subprocess, sys, datetime

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

def build(clip, dest):
    """normalise the clip, append the pop, one pass"""
    vf = ("[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black,"
          "fps=30,format=yuv420p,setsar=1[v0];"
          "[0:a]aformat=sample_rates=48000:channel_layouts=stereo[a0];"
          "[1:v]fps=30,format=yuv420p,setsar=1[v1];"
          "[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];"
          "[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]")
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(clip), "-i", str(POP), "-filter_complex", vf,
           "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(dest)]
    subprocess.run(cmd, check=True)

def caption(lane, row):
    if lane == "numbers":
        head = f"{row['song']} — {row['piece']}."
        return f"{head} Papa Weird.Baby, live. The rest is at weird.baby\n#weirdbaby #originalsong #livemusic #blues #indie"
    q = row.get("question") or "the question of the day"
    return f"The Determination. {q}\nweird.baby\n#weirdbaby #mgk #fortune"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lane", choices=list(LEDGER), required=True)
    ap.add_argument("--week", type=int, required=True)
    ap.add_argument("--intake", default=None, help="override the intake folder (default OneDrive/…/intake/<lane>)")
    ap.add_argument("--dry", action="store_true", help="say what would happen; touch nothing")
    a = ap.parse_args()
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
        build(clips[day], dest)
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
