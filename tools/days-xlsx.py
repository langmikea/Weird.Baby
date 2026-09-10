"""THE DAYS, AS A WORKBOOK — Mike's ruling of 2026-09-10: Excel, one file,
four sheets, plain. Ops regenerates it; Mike puts an x in Done.

    python tools/days-xlsx.py            build C:/Users/macun/OneDrive/WeirdBaby/WEIRD_BABY_DAYS.xlsx
    python tools/days-xlsx.py --marks    only read Mike's Done marks into docs/desk/TASKS.marks.json

Sheets:
  Calendar  month grids, S M T W T F S, white with gentle lines; a day cell
            lists its items by short name; Mike's red, Ops' grey, done ones
            struck through; each name links to its row on Tasks.
  Tasks     one row per item: date, who, name, the instruction, a link to its
            spec, Done (Mike types x). Everything else on the row is Ops'.
  Specs     one short block per kind of thing (from docs/desk/BLOCKS.json).
  Plan      the seven weeks and their counts.

Before writing, the existing workbook's Done column is read and kept, and a
file in the intake counts itself (the same checks tools/days.mjs runs).
If Excel has the file open the save fails; say so and try later.
"""
import json, pathlib, sys, datetime, calendar, re
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

REPO = pathlib.Path(__file__).resolve().parents[1]
ONE = pathlib.Path("C:/Users/macun/OneDrive/WeirdBaby")
XLSX = ONE / "WEIRD_BABY_DAYS.xlsx"
TASKS = json.loads((REPO / "docs/desk/TASKS.json").read_text(encoding="utf-8"))
BLOCKS = json.loads((REPO / "docs/desk/BLOCKS.json").read_text(encoding="utf-8"))
MARKS = REPO / "docs/desk/TASKS.marks.json"
TODAY = datetime.date.today()
OPEN = datetime.date.fromisoformat(TASKS["opening_day"])
MILESTONES = [("0", "2026-09-07", "alignment and the burn list", "this plan ruled; the burn list, ~40 rows"),
              ("1", "2026-09-14", "the catalogue", "≥50 features with a pitch and a day; the music launch on one page; the twin audit; 3 practice reels"),
              ("2", "2026-09-21", "the wing's shape", "5 mocks ruled; burn-down executed; Everyman and Gambler photographs; 3 practice reels"),
              ("3", "2026-09-28", "the wing built, the twin current", "≥25 feature pages; the prologue; the landing wired; the twin at full software; the bench date; the room fixed"),
              ("4", "2026-10-05", "content lock, first run", "15 launch days written three ways; 15 Number pieces; CEO and Informer photographs; Buffer connected"),
              ("5", "2026-10-12", "in the can", "10 teaser reels built and queued (if ruled); the real unit flashed; the distributor account"),
              ("6", "2026-10-19", "teasers out, dress rehearsal", "10 posted with no hand; one full run-through; the second week queued"),
              ("7", "2026-10-26", "open", "freeze Monday; the first launch week queued; the door flips Friday at five")]

# ── done: Mike's x, then the tree ──────────────────────────────────────────
def read_marks():
    marks = {}
    if XLSX.exists():
        try:
            wb = load_workbook(XLSX, read_only=True, data_only=True)
            if "Tasks" in wb.sheetnames:
                ws = wb["Tasks"]; head = None
                for row in ws.iter_rows(values_only=True):
                    if head is None:
                        head = [str(c).strip().lower() if c else "" for c in row]; continue
                    d = dict(zip(head, row))
                    tid = d.get("id"); done = str(d.get("done") or "").strip().lower()
                    if tid and done in ("x", "✓", "done", "yes", "y"): marks[str(tid)] = "x"
            wb.close()
        except Exception as e:
            print("could not read the existing workbook's marks:", e, file=sys.stderr)
    return marks

def files(sub, pred):
    try: return [f for f in (ONE / sub).iterdir() if pred(f.name)]
    except Exception: return []
VID = re.compile(r"\.(mp4|mov|m4v)$", re.I); IMG = re.compile(r"\.(jpe?g|png|heic|webp)$", re.I)
def checked(t):
    c = t.get("check")
    if not c: return False
    if c["type"] == "file": return len(files(c["dir"], lambda n: n.lower().startswith(c["prefix"].lower()) and VID.search(n))) > 0
    if c["type"] == "files": return len(files(c["dir"], lambda n: n.lower().startswith(c["prefix"].lower()) and VID.search(n))) >= c.get("min", 1)
    if c["type"] == "photos": return len(files(c["dir"], lambda n: bool(IMG.search(n)))) >= c.get("min", 4)
    if c["type"] == "buffer-token": return pathlib.Path("C:/AI/PERSONA-20260903/.secrets/buffer.token").exists()
    return False

marks = read_marks()
MARKS.write_text(json.dumps(marks, indent=1) + "\n", encoding="utf-8")
if "--marks" in sys.argv:
    print(f"marks: {len(marks)} x's read from the workbook -> docs/desk/TASKS.marks.json"); sys.exit(0)

tasks = []
for t in TASKS["tasks"]:
    done = t.get("done") is True or checked(t) or t["id"] in marks
    d = datetime.date.fromisoformat(t["date"])
    tasks.append({**t, "_done": done, "_late": (not done and d < TODAY), "_d": d})
tasks.sort(key=lambda t: (t["_d"], 0 if t["owner"] == "mike" else 1))

# ── styles ─────────────────────────────────────────────────────────────────
F = "Arial"
thin = Side(style="thin", color="D9D9D9"); box = Border(left=thin, right=thin, top=thin, bottom=thin)
RED, GREY, INK, DIM = "C00000", "7F7F7F", "1F1F1F", "A6A6A6"
f_body = Font(name=F, size=10, color=INK); f_head = Font(name=F, size=10, bold=True, color=INK)
f_title = Font(name=F, size=16, bold=True, color=INK); f_sub = Font(name=F, size=9, color=GREY)
f_mike = Font(name=F, size=9, color=RED, underline="single"); f_ops = Font(name=F, size=9, color=GREY, underline="single")
f_done = Font(name=F, size=9, color=DIM, strike=True, underline="single")
fill_today = PatternFill("solid", fgColor="FFF7D6"); fill_open = PatternFill("solid", fgColor="E3EFE4"); fill_head = PatternFill("solid", fgColor="F2F2F2")
wrap = Alignment(wrap_text=True, vertical="top"); center = Alignment(horizontal="center", vertical="center")

wb = Workbook()
# ── Tasks (built first so the calendar can link to rows) ───────────────────
ws_t = wb.active; ws_t.title = "Tasks"
cols = ["Date", "Day", "Who", "Item", "Do this", "Spec", "Done", "id"]
ws_t.append(cols)
for i, c in enumerate(cols, 1):
    cell = ws_t.cell(row=1, column=i); cell.font = f_head; cell.fill = fill_head; cell.border = box
widths = [11, 5, 6, 34, 80, 14, 7, 22]
for i, w in enumerate(widths, 1): ws_t.column_dimensions[get_column_letter(i)].width = w
ws_t.freeze_panes = "A2"
row_of = {}
SPEC_ROW = {}
for r, t in enumerate(tasks, 2):
    row_of[t["id"]] = r
    do = " ".join(f"{i+1}. {s}" for i, s in enumerate(t.get("do", []))) if t.get("do") else ""
    vals = [t["_d"], t["_d"].strftime("%a"), "Mike" if t["owner"] == "mike" else "Ops", t["title"], do, t.get("block", "ops") , ("x" if t["_done"] else ""), t["id"]]
    for c, v in enumerate(vals, 1):
        cell = ws_t.cell(row=r, column=c, value=v); cell.font = f_body; cell.border = box; cell.alignment = wrap
    ws_t.cell(row=r, column=1).number_format = "yyyy-mm-dd"
    who = ws_t.cell(row=r, column=3); who.font = Font(name=F, size=10, bold=True, color=(RED if t["owner"] == "mike" else GREY))
    if t["_done"]:
        for c in range(1, 9): ws_t.cell(row=r, column=c).font = Font(name=F, size=10, color=DIM, strike=(c in (4, 5)))
    elif t["_late"]:
        ws_t.cell(row=r, column=4).font = Font(name=F, size=10, bold=True, color=RED)
    ws_t.cell(row=r, column=7).alignment = center
    ws_t.cell(row=r, column=7).fill = PatternFill("solid", fgColor="FFFFFF")
last_task_row = len(tasks) + 1
n = last_task_row + 2
ws_t.cell(row=n, column=1, value="Legend").font = f_head
ws_t.cell(row=n + 1, column=1, value="Done is yours: type x in the Done column when a thing is done. Files in the intake folders get their x from Ops. Everything else on a row is Ops' and is rewritten when the plan moves; nothing breaks if you edit it.").font = f_sub
ws_t.cell(row=n + 2, column=1, value="Red item = needs Mike; grey = Ops; struck = done; bold red = late. Spec links to the sheet that says what one of these is.").font = f_sub

# ── Specs ──────────────────────────────────────────────────────────────────
ws_s = wb.create_sheet("Specs")
ws_s.column_dimensions["A"].width = 24; ws_s.column_dimensions["B"].width = 100
ws_s["A1"] = "What one of each thing is"; ws_s["A1"].font = f_title
ws_s["A2"] = "One block per kind. Short on purpose. The task row links here."; ws_s["A2"].font = f_sub
r = 4
for b in BLOCKS["blocks"]:
    SPEC_ROW[b["id"]] = r
    ws_s.cell(row=r, column=1, value=b["name"]).font = f_head
    ws_s.cell(row=r, column=2, value=b["one"]).font = f_body; ws_s.cell(row=r, column=2).alignment = wrap
    ws_s.cell(row=r + 1, column=1, value="how many, by when").font = f_sub
    ws_s.cell(row=r + 1, column=2, value=f"{b['count']} by the door · {b['cadence']}").font = f_body
    ws_s.cell(row=r + 2, column=1, value="how it reaches Ops").font = f_sub
    ws_s.cell(row=r + 2, column=2, value=b["how"]).font = f_body; ws_s.cell(row=r + 2, column=2).alignment = wrap
    r += 4
SPEC_ROW["ops"] = r
ws_s.cell(row=r, column=1, value="an Ops task").font = f_head
ws_s.cell(row=r, column=2, value="Ops' own work toward the door: the catalogue, the pages, the twin, the queue, the grade. Listed so you can see when things land; nothing on these rows is yours to do.").font = f_body
ws_s.cell(row=r, column=2).alignment = wrap
# spec links on Tasks
for rr, t in enumerate(tasks, 2):
    key = t.get("block") if t["owner"] == "mike" else "ops"
    if key in SPEC_ROW:
        c = ws_t.cell(row=rr, column=6); c.hyperlink = f"#'Specs'!A{SPEC_ROW[key]}"; c.value = key; c.font = Font(name=F, size=10, color="2F5597", underline="single")

# ── Calendar ───────────────────────────────────────────────────────────────
ws_c = wb.create_sheet("Calendar", 0)
ws_c.sheet_view.showGridLines = False
for i in range(1, 8): ws_c.column_dimensions[get_column_letter(i)].width = 24
ws_c["A1"] = "Weird.Baby · the days to the door"; ws_c["A1"].font = f_title
ws_c["A2"] = f"Red needs you. Grey is Ops. Struck is done. Click a name for what to do. Opening Day {OPEN.isoformat()} · {(OPEN - TODAY).days} days from today ({TODAY.isoformat()})."; ws_c["A2"].font = f_sub
by_date = {}
for t in tasks: by_date.setdefault(t["_d"], []).append(t)
row = 4
months = [(2026, 9), (2026, 10), (2026, 11)]
calendar.setfirstweekday(calendar.SUNDAY)
for (y, m) in months:
    ws_c.cell(row=row, column=1, value=datetime.date(y, m, 1).strftime("%B %Y")).font = Font(name=F, size=13, bold=True, color=INK)
    row += 1
    for i, dn in enumerate(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 1):
        c = ws_c.cell(row=row, column=i, value=dn); c.font = f_head; c.alignment = center; c.fill = fill_head; c.border = box
    row += 1
    for week in calendar.monthcalendar(y, m):
        ws_c.row_dimensions[row].height = 16
        for i, dnum in enumerate(week, 1):
            c = ws_c.cell(row=row, column=i, value=(dnum or None)); c.font = Font(name=F, size=9, color=GREY); c.border = Border(left=thin, right=thin, top=thin); c.alignment = Alignment(horizontal="right")
            if dnum:
                d = datetime.date(y, m, dnum)
                if d == TODAY: c.fill = fill_today
                if d == OPEN: c.fill = fill_open; c.value = f"{dnum}  OPENING DAY"; c.alignment = Alignment(horizontal="left"); c.font = Font(name=F, size=9, bold=True, color="3F7A4F")
        # item lines under the day number: as many rows as the busiest day in the week
        items = {i: by_date.get(datetime.date(y, m, dnum), []) if dnum else [] for i, dnum in enumerate(week, 1)}
        depth = max([len(v) for v in items.values()] + [1])
        for k in range(depth):
            row += 1; ws_c.row_dimensions[row].height = 14
            for i in range(1, 8):
                c = ws_c.cell(row=row, column=i); c.border = Border(left=thin, right=thin, bottom=(thin if k == depth - 1 else Side(style=None)))
                c.alignment = Alignment(vertical="top", wrap_text=False, shrink_to_fit=True)
                lst = items[i]
                if k < len(lst):
                    t = lst[k]
                    c.value = t["title"] if len(t["title"]) <= 34 else t["title"][:33] + "…"
                    c.font = f_done if t["_done"] else (f_mike if t["owner"] == "mike" else f_ops)
                    if t["_late"]: c.font = Font(name=F, size=9, bold=True, color=RED, underline="single")
                    c.hyperlink = f"#'Tasks'!D{row_of[t['id']]}"
        row += 1
    row += 1

# ── Plan ───────────────────────────────────────────────────────────────────
ws_p = wb.create_sheet("Plan")
ws_p.column_dimensions["A"].width = 8; ws_p.column_dimensions["B"].width = 14; ws_p.column_dimensions["C"].width = 34; ws_p.column_dimensions["D"].width = 90
ws_p["A1"] = f"Opening Day {OPEN.isoformat()} · seven weeks and a Friday"; ws_p["A1"].font = f_title
ws_p["A2"] = "Every deliverable is a count, graded each Sunday as done over total. Detail: docs/PLAN-20260910-OPENING-DAY.md in the museum repo."; ws_p["A2"].font = f_sub
for i, h in enumerate(["Week", "Monday", "Milestone", "Counted deliverables"], 1):
    c = ws_p.cell(row=4, column=i, value=h); c.font = f_head; c.fill = fill_head; c.border = box
for r, (w, mon, name, counts) in enumerate(MILESTONES, 5):
    for i, v in enumerate([w, mon, name, counts], 1):
        c = ws_p.cell(row=r, column=i, value=v); c.font = f_body; c.border = box; c.alignment = wrap
    if datetime.date.fromisoformat(mon) <= TODAY < datetime.date.fromisoformat(mon) + datetime.timedelta(days=7):
        for i in range(1, 5): ws_p.cell(row=r, column=i).fill = fill_today
ws_p.cell(row=14, column=1, value="Five things true at five o'clock on the 30th").font = f_head
for i, s in enumerate(["A wing that sells the machine: a page and a pitch for every feature, game, setting, character and artifact; the story one page, marked prologue.",
                       "A daily promotion already running: a Determination and a Number every weekday through Buffer, each pointing at the day's feature page.",
                       "A machine that matches: the twin at the full software, the real unit flashed and verified, four characters with their artifacts photographed.",
                       "A music launch on a schedule: the first song's run defined and shot, the live-single path ready, the second song behind it.",
                       "A system that runs the week without Mike: calendar, ledgers, the reel line, the costs, the desk, a Sunday grade."], 15):
    c = ws_p.cell(row=i, column=1, value=f"{i-14}."); c.font = f_body
    c = ws_p.cell(row=i, column=2, value=s); c.font = f_body; ws_p.merge_cells(start_row=i, start_column=2, end_row=i, end_column=4); c.alignment = wrap
    ws_p.row_dimensions[i].height = 30

wb.active = 0
try:
    wb.save(XLSX)
    print(f"wrote {XLSX} · {len(tasks)} tasks · {sum(1 for t in tasks if t['_done'])} done · {len(marks)} x's kept")
except PermissionError:
    print(f"could not save: {XLSX} is open in Excel. Close it and run again; nothing was lost.", file=sys.stderr); sys.exit(2)
