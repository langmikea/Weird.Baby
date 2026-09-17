"""THE HOT LANE — a Q&A now, ahead of the day's row. [Mike, 2026-09-16, Q3: A]

Mike sends the question and the answer in chat and says "hot"; Ops runs:

    python tools/reels-hot.py "Did the market just do what I think it did?" "COUNT YOUR MONEY WHILE IT'S STILL YOURS."

which builds today's extra reel from the template (tools/reels-qa.py --hot) and queues it on the
four surfaces ten minutes from now (tools/reels-queue.mjs --lane qa --date today --now). With no
Buffer key on the PC the queue prints a dry run and the file waits in Finished reels › qa.
"""
import datetime, pathlib, subprocess, sys
from zoneinfo import ZoneInfo

HERE = pathlib.Path(__file__).resolve().parent
if len(sys.argv) < 3: sys.exit(__doc__)
q, a = sys.argv[1], sys.argv[2]
today = datetime.datetime.now(ZoneInfo("America/New_York")).date().isoformat()
print(f"THE HOT LANE — {today}: {q}")
subprocess.run([sys.executable, str(HERE / "reels-qa.py"), "--hot", q, a], check=True)
subprocess.run(["node", str(HERE / "reels-queue.mjs"), "--lane", "qa", "--date", today, "--now"] + (["--dry"] if "--dry" in sys.argv else []), check=True, cwd=str(HERE.parent))
