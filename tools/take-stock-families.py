"""TAKE STOCK, the families on one sheet: one frame per drop, cut from the contact sheets of
tools/take-stock.py, laid out a family to a row with the lead first. The sort is docs/TAKE-STOCK-20260918.md.

  python tools/take-stock-families.py        -> docs/desk/take-stock/FAMILIES.png
"""
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[1]
DIR = ROOT / "docs" / "desk" / "take-stock"
CW, CH, PAD, COLS, TOP = 256, 292, 10, 6, 30          # the contact sheet's own geometry
KEEP = CH - 30                                          # the two glasses, without the driver's caption

# family, then (drop id, frame on its sheet, day, name); the lead is first
FAMILIES = [
    ("1  THE ASK", [("engine.niac", 5, 1, "MGK-NIAC"), ("engine.v2", 5, 13, "MGK-v2.0")]),
    ("2  THE MACHINE ITSELF", [("twin.boot", 3, 2, "Starting"), ("twin.monitor", 0, 3, "The monitor at rest")]),
    ("3  SETTINGS", [("twin.app.user.name", 7, 4, "User, your name"), ("twin.app.polarity", 7, 5, "Polarity"), ("twin.app.clarity", 7, 6, "Clarity")]),
    ("4  DRAWS", [("twin.app.probabilities", 13, 7, "Probabilities"), ("twin.app.detectors", 8, 9, "Detectors"), ("twin.app.bs", 7, 10, "The Bullshit Detector"), ("twin.app.advice.panel", 11, 23, "The Career Chooser")]),
    ("5  READERS", [("twin.app.messages", 12, 8, "Messages, the inbox"), ("twin.app.tap", 7, 26, "Phone Tap")]),
    ("6  GAMES AND TOYS", [("twin.game.tictactoe", 7, 11, "Tic-Tac-Toe"), ("twin.game.snowglobe", 3, 12, "Snow Globe"), ("twin.app.radio", 2, 25, "Radio")]),
    ("7  SESSIONS", [("twin.app.eliza", 2, 14, "ELIZ"), ("twin.app.brain", 7, 15, "Brain Training"), ("twin.app.ink", 8, 16, "Inkblots")]),
    ("8  THE CASINO", [("twin.game.blackjack", 7, 18, "Blackjack"), ("twin.game.roulette", 6, 19, "Roulette"), ("twin.game.craps", 3, 20, "Craps"), ("twin.game.slots", 3, 21, "Slots")]),
]

def cell(rid, n):
    s = Image.open(DIR / f"{rid}.png"); x = PAD + (n % COLS) * (CW + PAD); y = TOP + (n // COLS) * (CH + PAD)
    return s.crop((x, y, x + CW, y + KEEP))

def main():
    try: big, small = ImageFont.truetype("arialbd.ttf", 20), ImageFont.truetype("arial.ttf", 15)
    except Exception: big = small = ImageFont.load_default()
    rowh = 34 + KEEP + 26; width = PAD + 4 * (CW + PAD)
    S = Image.new("RGB", (width, PAD + len(FAMILIES) * rowh), (0, 0, 0)); d = ImageDraw.Draw(S)
    for i, (fam, members) in enumerate(FAMILIES):
        y = PAD + i * rowh; d.text((PAD, y + 4), fam, fill=(255, 220, 120), font=big)
        for k, (rid, n, day, name) in enumerate(members):
            x = PAD + k * (CW + PAD); S.paste(cell(rid, n), (x, y + 34))
            d.text((x + 2, y + 34 + KEEP + 3), f"day {day}  {name}" + ("   (the lead)" if k == 0 else ""), fill=(255, 255, 255) if k == 0 else (170, 170, 170), font=small)
    S.save(DIR / "FAMILIES.png"); print(S.size)

if __name__ == "__main__":
    main()
