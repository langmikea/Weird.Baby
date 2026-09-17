"""THE GLASS FIT — does the answer table fit the machine's reveal font?

Measures every cell of the four Release-1 answer drafts (robots content/drafts/ANSWERS_*.csv)
against the reveal font (FreeSansBold9pt7b, the emulator's own glyph table) on the 128x64
glass: three rows at most (firmware B2 ruling 2026-07-30: rows 20/36/52, or 32/48 for two),
each row 128 px at most. Renders the Gambler's twenty as the firmware draws them today
(centred, GFX wrap ON, pixels past the edge dropped) beside Ops' re-cut, and writes
docs/desk/GLASS-FIT.html + docs/desk/GLASS-FIT-gambler.csv for the Sunday sitting.

  python tools/glass-fit.py
"""
import re, json, csv, base64, io, pathlib, html as H
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
ROBOTS = pathlib.Path(r"C:\AI\Projects\weird-baby-robots")
EMU = ROBOTS / "tools" / "viiip_display_emulator.html"
DRAFTS = ROBOTS / "robots" / "mgk-viiip" / "content" / "drafts"
OUT_HTML = ROOT / "docs" / "desk" / "GLASS-FIT.html"
OUT_CSV = ROOT / "docs" / "desk" / "GLASS-FIT-gambler.csv"
FW, FH, YADV = 128, 64, 22

html = EMU.read_text(encoding="utf-8")
GLYPHS = json.loads(re.search(r"const GLYPHS = (\[\[.*?\]\]);", html, re.S).group(1))
BITMAPS = list(base64.b64decode(re.search(r'const BITMAPS = Uint8Array\.from\(atob\("([^"]+)"\)', html).group(1)))

def text_w(s): return sum(GLYPHS[ord(c) - 0x20][3] for c in s if 0 <= ord(c) - 0x20 < len(GLYPHS))

def fb_print(fb, x, y, s):
    """Adafruit GFX print: wrap ON (the firmware never turns it off); a glyph that would cross x=128
    resets the cursor to x=0 and drops the baseline by yAdvance; pixels outside the buffer are dropped."""
    for ch in s:
        i = ord(ch) - 0x20
        if i < 0 or i >= len(GLYPHS): continue
        off, w, h, xa, xo, yo = GLYPHS[i]
        if ch != " " and x + xo + w > FW: x, y = 0, y + YADV
        bit = 0
        for yy in range(h):
            for xx in range(w):
                if BITMAPS[off + (bit >> 3)] & (0x80 >> (bit & 7)):
                    px, py = x + xo + xx, y + yo + yy
                    if 0 <= px < FW and 0 <= py < FH: fb[py, px] = 1
                bit += 1
        x += xa

def fb_centered(fb, row, s):
    """SCREENS.ino 83-91: col = (128 - w) / 2, integer, may go negative, no clamp"""
    fb_print(fb, (FW - text_w(s)) // 2, row, s)

def render(lines):
    """Answer_Rows (M8BALL.ino, B2 2026-07-30): content chooses the geometry"""
    fb = np.zeros((FH, FW), dtype=np.uint8)
    ls = list(lines) + [""] * (3 - len(lines))
    if ls[2]:
        for y, l in zip((20, 36, 52), ls): fb_centered(fb, y, l)
    else:
        fb_centered(fb, 32, ls[0]); fb_centered(fb, 48, ls[1])
    return fb

def png(fb, scale=3):
    im = Image.fromarray((fb * 255).astype(np.uint8), "L").resize((FW * scale, FH * scale), Image.NEAREST)
    b = io.BytesIO(); im.save(b, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()

def wrap(text, maxw=FW):
    lines, cur = [], ""
    for t in text.split():
        c = (cur + " " + t).strip()
        if text_w(c) <= maxw or not cur: cur = c
        else: lines.append(cur); cur = t
    if cur: lines.append(cur)
    return lines

def sentence(s):
    s = s.lower()
    s = re.sub(r"(^|[.!?]\s+)([a-z])", lambda m: m.group(1) + m.group(2).upper(), s)
    s = re.sub(r"\bi\b", "I", s); s = re.sub(r"\bi'", "I'", s)
    return s.replace("juan", "Juan")

def fits(lines): return len(lines) <= 3 and all(text_w(l) <= FW for l in lines)

# Ops' re-cut of the Gambler's twenty: sentence case, three rows of the glass, his words kept where they fit
RECUT = {
    0: "Ask again._Some tables_read twice.",
    1: "Not yet. The_hand is still_being dealt.",
    2: "Even I don't_call a card_before it turns.",
    3: "Too much_smoke. Give_it a moment.",
    4: "Count your_money while_it's still yours.",
    5: "The house has_the odds._It always does.",
    6: "No. One day I_hope you_understand.",
    7: "Sources say_no. They know_the odds.",
    8: "Not good. I've_seen this_hand before.",
    9: "The smart_money left an_hour ago.",
    10: "As I see it, yes._And I see_plenty.",
    11: "It is certain._Don't bet_against it.",
    12: "It was done_the moment_you asked.",
    13: "Most likely._The table_likes you.",
    14: "The outlook is_good. Enjoy it_while it holds.",
    15: "Good signs._I've read them_all my life.",
    16: "Yes. Juan has_seen it a_hundred times.",
    17: "Yes, my friend._Remember_who told you.",
    18: "Rely on it_the way you_rely on me.",
    19: "No doubt. And_I've had my_share of them.",
}
LOST = {3: "tonight", 7: "my sources, twice", 10: "in this case", 11: "some things you", 12: "It is done.",
        13: "leans your way tonight", 15: "the signs are good", 17: "and when it happens", 18: "Completely."}

def load(name): return list(csv.DictReader(open(DRAFTS / f"ANSWERS_{name}.csv", encoding="utf8")))

counts = []
for name, label in [("gambler", "Gambler -21"), ("everyman", "Everyman -02"), ("ceo", "CEO -09"), ("informer", "Informer -07")]:
    rows = load(name)
    marked = sum(1 for r in rows if fits(r["text"].split("_")))
    rebroken = sum(1 for r in rows if fits(wrap(r["text"].replace("_", " "))))
    cased = sum(1 for r in rows if fits(wrap(sentence(r["text"].replace("_", " ")))))
    counts.append((label, len(rows), marked, rebroken, cased))

gam = load("gambler")
bad = []
for r in gam:
    ls = RECUT[int(r["answer_id"])].split("_")
    if not fits(ls): bad.append((r["answer_id"], [text_w(l) for l in ls]))
if bad: raise SystemExit(f"re-cut rows do not fit the glass: {bad}")

with open(OUT_CSV, "w", newline="", encoding="utf8") as f:
    w = csv.writer(f); w.writerow(["unit_ref", "unit_serial", "answer_id", "clarity_level", "clarity_name", "text", "was"])
    for r in gam: w.writerow([r["unit_ref"], r["unit_serial"], r["answer_id"], r["clarity_level"], r["clarity_name"], RECUT[int(r["answer_id"])], r["text"]])

def cell(r):
    aid = int(r["answer_id"]); now = r["text"].split("_"); new = RECUT[aid].split("_")
    ws_now = [text_w(l) for l in now]; ws_new = [text_w(l) for l in new]
    pol = "maybe" if aid < 4 else "no" if aid < 10 else "yes"
    lost = f'<p class="lost">gives up: {H.escape(LOST[aid])}</p>' if aid in LOST else ""
    return (f'<article class="row"><div class="id"><span class="n">a{aid}</span><span class="pol">{pol}</span></div>'
            f'<div class="side"><img src="{png(render(now))}" width="384" height="192" alt="a{aid} as the firmware draws it today">'
            f'<p class="txt">{"<br>".join(H.escape(l) for l in now)}</p><p class="px">{" &middot; ".join(f"{x} px" for x in ws_now)}</p></div>'
            f'<div class="side"><img src="{png(render(new))}" width="384" height="192" alt="a{aid} re-cut">'
            f'<p class="txt">{"<br>".join(H.escape(l) for l in new)}</p><p class="px">{" &middot; ".join(f"{x} px" for x in ws_new)}</p>{lost}</div></article>')

rows_html = "\n".join(cell(r) for r in gam)
count_rows = "\n".join(f"<tr><td>{H.escape(l)}</td><td class=num>{n}</td><td class=num>{m}</td><td class=num>{rb}</td><td class=num>{c}</td><td class=num>{n - c}</td></tr>" for l, n, m, rb, c in counts)
tot = [sum(x[i] for x in counts) for i in range(1, 5)]

CSS = """
:root{--paper:#f3f4f1;--card:#fbfbf9;--ink:#1c2026;--ink-2:#4a515a;--ink-3:#7a828c;--rule:#cfd3cc;--you:#6a4c93;--you-bg:#ebe4f3;--bad:#a4443a;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#171a1e;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--you:#c2a8e6;--you-bg:#2e2440;--bad:#e08a80;color-scheme:dark}}
:root[data-theme="dark"]{--paper:#171a1e;--card:#1c2025;--ink:#e6e8e4;--ink-2:#b4bac1;--ink-3:#7f878f;--rule:#343a41;--you:#c2a8e6;--you-bg:#2e2440;--bad:#e08a80;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Geist,system-ui,sans-serif;font-size:16px;line-height:1.5}.wrap{max-width:1040px;margin:0 auto;padding-block:40px 72px;padding-inline:24px}
.eyebrow{font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);margin:0 0 8px}h1{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:40px;line-height:1.05;margin:0 0 12px;text-wrap:balance}
.lede{color:var(--ink-2);max-width:66ch;margin:0 0 20px}h2{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:24px;margin:38px 0 10px}p{max-width:70ch}
table{border-collapse:collapse;width:100%;font-size:14.5px;font-variant-numeric:tabular-nums}th{text-align:left;font-weight:500;color:var(--ink-3);font-size:12.5px;padding:0 12px 6px 0;border-bottom:1px solid var(--ink-3)}td{padding:9px 12px 9px 0;border-bottom:1px solid var(--rule);vertical-align:top}td.num,th.num{text-align:right}
.tbl{overflow-x:auto}.note{margin-top:12px;font-size:14px;color:var(--ink-2)}
.row{display:grid;grid-template-columns:64px 1fr 1fr;gap:18px;padding:18px 0;border-bottom:1px solid var(--rule);align-items:start}.row .id{font-family:"Geist Mono",ui-monospace,monospace;font-size:13px;display:flex;flex-direction:column;gap:4px}.row .n{color:var(--ink)}.row .pol{color:var(--ink-3);font-size:11px}
.side img{display:block;max-width:100%;height:auto;width:100%;image-rendering:pixelated;border:1px solid var(--rule);background:#000}.txt{margin:8px 0 0;font-size:14px;line-height:1.35}.px{font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;color:var(--ink-3);margin:2px 0 0}.lost{font-size:12.5px;color:var(--bad);margin:4px 0 0}
.heads{display:grid;grid-template-columns:64px 1fr 1fr;gap:18px;margin-top:14px}.heads .eyebrow{margin:0}
@media (max-width:640px){.row,.heads{grid-template-columns:1fr}.heads .eyebrow:first-child{display:none}}
.qs{border:1px solid var(--you);border-radius:6px;padding:16px 20px;margin-top:34px;max-width:820px}.qs .eyebrow{color:var(--you)}.qs ol{margin:0;padding-left:1.3em}.qs li{margin:9px 0}footer{margin-top:48px;font-size:13px;color:var(--ink-3)}
"""

PAGE = f"""<title>The Glass Fit</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<style>{CSS}</style>
<div class="wrap">
<p class="eyebrow">Ops &middot; for the Sunday sitting of 2026-09-20 &middot; measured 2026-09-16</p>
<h1>The Glass Fit</h1>
<p class="lede">The machine reveals its answer in FreeSansBold9pt7b on a 128 by 64 glass. In that face a row holds about ten capitals or fourteen small letters, and the firmware draws three rows at most. The answer tables were fitted to a 32-character rule written for the small font, so most of them do not fit the reveal. Below, the Gambler's twenty as the firmware draws them today, beside a re-cut that fits.</p>

<h2>What fits, by persona</h2>
<div class="tbl"><table><thead><tr><th>Table</th><th class=num>cells</th><th class=num>fit as marked</th><th class=num>fit re-broken</th><th class=num>fit in sentence case</th><th class=num>need a cut</th></tr></thead>
<tbody>{count_rows}
<tr><td>all four</td><td class=num>{tot[0]}</td><td class=num>{tot[1]}</td><td class=num>{tot[2]}</td><td class=num>{tot[3]}</td><td class=num>{tot[0] - tot[3]}</td></tr></tbody></table></div>
<p class="note"><em>Fit as marked</em>: the cell's own line breaks, every row within 128 px. <em>Re-broken</em>: the same words, broken by the machine's font instead of the character count. <em>Sentence case</em>: re-broken with the capitals lowered, which is how the CEO and Informer tables were typed and why they mostly fit. <em>Need a cut</em>: words have to go.</p>

<h2>The Gambler's twenty</h2>
<p>Left, the cell as it stands (the samples were typed in capitals); the glass shows what the firmware would draw: text past the edge is cut and its tail drops a row. Right, Ops' re-cut in sentence case, three rows or fewer, every row measured in the machine's font. Where a word of his had to go it is named in red. The re-cut is a draft for the ruling; nothing has changed in the robots repo.</p>
<div class="heads"><p class="eyebrow"></p><p class="eyebrow">Today</p><p class="eyebrow">Re-cut</p></div>
{rows_html}

<div class="qs"><p class="eyebrow">The ruling, Sunday &middot; one letter</p>
<ol>
<li><strong>A. The glass rules the words.</strong> Every answer in every table is re-cut to three rows of the reveal font: this Gambler draft goes in as is or with your changes, and Ops re-breaks the other three tables by the font and drafts the cells that need a cut. The reels show exactly what the unit shows.</li>
<li><strong>B. The words rule the glass.</strong> The reveal font changes to the small face the fit rule was written for (about twenty-one characters a row); every cell fits as written, and the reviewed reveal look changes on the unit and in the reels.</li>
<li><strong>C. Two screens.</strong> The reels wrap freely, as they do now, up to four lines; the unit keeps the tables as written and clips until the bench trip. The reels and the unit no longer show the same thing.</li>
</ol></div>
<footer>Source: robots content/drafts/ANSWERS_*.csv, the emulator's glyph table (tools/viiip_display_emulator.html), M8BALL.ino Answer_Rows, SCREENS.ino screenPrintLnCentered. Built by museum tools/glass-fit.py; the re-cut is docs/desk/GLASS-FIT-gambler.csv.</footer>
</div>
"""
OUT_HTML.write_text(PAGE, encoding="utf-8")
for c in counts: print(c)
print("wrote", OUT_HTML, f"{OUT_HTML.stat().st_size // 1024} KB;", OUT_CSV.name)
