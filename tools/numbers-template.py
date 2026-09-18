"""THE NUMBER'S TEMPLATE — what the line lays over a piece of a song.

Mike, 2026-09-17, on coconuts-w1-hook as cut: "pretty good as raw stock"; it will need a tighter
crop, a logo, chords and lyrics. The house rule of 09-16 already says the music reels show the chord
being played, in time, like captions: if you need it you see it; if not, it does not distract.

    imported by tools/numbers-pieces.py; run alone for the check file:
    python tools/numbers-template.py            times every piece's lines against the tape's words -> docs/desk/NUMBER-TEMPLATE-check.txt

What is laid over the picture (1080x1920, after the crop, before the pop):
  the branch     `\\MUSIC` top left, small, in the small type, white at half strength: there if you look for it
                 (the feature reel's `\\ROBOTS`, the same treatment).
  the mark       the Weird.Baby mark (public/images/wb/weird-baby-mark.png) top right, small, with a soft shadow.
                 Both sit below the apps' top chrome (the tabs, the title) and above his head.
  the lyric      the line being sung, Georgia Bold (the house's question type), white on a soft black box,
                 centred in the band under his feet, clear of the apps' caption area and the right-hand icons.
                 The words he has sung are full white; the words to come are dimmed, so the line reads as it is sung.
  the chord      the chord under his hand, in a small chip above the lyric box, in the small type. Changes on the
                 word the sheet puts it on. Spoken lines (the story, the talk between takes) carry no chord.
Timing: reels/numbers-lyrics.json names each piece's lines and chord anchors; the tape's words
(reels/transcripts/porch-20260824-words.json, faster-whisper with word times) give every word its
second. The lyric words are aligned to the tape's words (a plain sequence alignment; "cooking nuts"
is the model's hearing of coconuts and is merged first); a word the model missed takes its time from
its neighbours. A line shows a quarter second before its first word and leaves when the next line
arrives, or two seconds after its last word. If fewer than three words in five match, the piece
gets the marks and no words, and the check file says so.

The overlay is drawn in Python (PIL), one RGBA frame per video frame, piped to ffmpeg as PNGs and
laid over the levelled segment; the sound is copied through untouched.
"""
import difflib, json, pathlib, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

REPO = pathlib.Path(__file__).resolve().parents[1]
LYRICS = REPO / "reels/numbers-lyrics.json"
WORDS = REPO / "reels/transcripts/porch-20260824-words.json"
MARK = REPO / "public/images/wb/weird-baby-mark.png"
CHECK = REPO / "docs/desk/NUMBER-TEMPLATE-check.txt"
W, H, FPS = 1080, 1920, 30

FONT_LYRIC = r"C:\Windows\Fonts\georgiab.ttf"          # the house's question type (the Q&A reel)
FONT_SMALL = r"C:\Windows\Fonts\ArialNova-Bold.ttf"    # the small type: the branch, the chord

# the marks: below the apps' top chrome (about the first 200 px), above his head (from about 176 at the ruled crop)
BRANCH_TEXT, BRANCH_SIZE, BRANCH_XY, BRANCH_ALPHA = "\\MUSIC", 30, (44, 226), 140
MARK_W, MARK_XY = 132, (W - 44 - 132, 214)
# the lyric band: box bottom above the apps' caption area; box narrower than the frame so the right-hand icons miss it
LYRIC_SIZE, LYRIC_LEAD, LYRIC_TEXT_W, LYRIC_BOX_W, LYRIC_BOTTOM, LYRIC_PAD, LYRIC_RADIUS = 50, 60, 820, 880, 1580, 26, 24
LYRIC_BOX_ALPHA, SUNG_ALPHA, UNSUNG_ALPHA = 128, 255, 135
CHORD_SIZE, CHORD_PAD, CHORD_GAP, CHORD_RADIUS = 40, (18, 8), 12, 16
LEAD_IN, HOLD_AFTER, FADE_S = 0.25, 2.0, 0.2
MATCH_FLOOR = 0.6

def norm(t):
    t = t.lower().replace("’", "'"); t = re.sub(r"[^a-z']", "", t)
    return {"wanna": "wanna", "goin": "going", "getcha": "getyour", "gonna": "gonna"}.get(t, t)

def tape_words(a, b, pad=0.6):
    """the tape's words inside a window, 'cooking nuts' merged into coconuts"""
    ws = [w for w in json.load(open(WORDS, encoding="utf-8"))["words"] if a - pad <= w["s"] <= b + pad]
    out, i = [], 0
    while i < len(ws):
        w = ws[i]; n = norm(w["w"])
        if n == "cooking" and i + 1 < len(ws) and norm(ws[i + 1]["w"]).startswith("nut"):
            out.append({"n": "coconuts", "s": w["s"], "e": ws[i + 1]["e"]}); i += 2; continue
        if n == "coconut": n = "coconuts"
        out.append({"n": n, "s": w["s"], "e": w["e"]}); i += 1
    return out

def sim(a, b):
    if a == b: return 1.0
    r = difflib.SequenceMatcher(None, a, b).ratio()
    return r if r >= 0.72 else 0.0

def align(lyr, tape):
    """Needleman-Wunsch over normalised words; returns for each lyric word the tape index or None"""
    n, m = len(lyr), len(tape); GAP = -0.25
    S = [[0.0] * (m + 1) for _ in range(n + 1)]; B = [[None] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1): S[i][0] = i * GAP; B[i][0] = "u"
    for j in range(1, m + 1): S[0][j] = j * GAP; B[0][j] = "l"
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            s = sim(lyr[i - 1], tape[j - 1]["n"])
            d = S[i - 1][j - 1] + (s if s else -0.4); u = S[i - 1][j] + GAP; l = S[i][j - 1] + GAP
            S[i][j], B[i][j] = max((d, "d"), (u, "u"), (l, "l"))
    out = [None] * n; i, j = n, m
    while i > 0 or j > 0:
        b = B[i][j]
        if b == "d":
            if sim(lyr[i - 1], tape[j - 1]["n"]): out[i - 1] = j - 1
            i, j = i - 1, j - 1
        elif b == "u": i -= 1
        else: j -= 1
    return out

def time_piece(piece_id, start, end, lyr):
    """every line of a piece with its words timed; None if the tape's words do not carry it"""
    names = lyr["pieces"].get(piece_id)
    if not names: return None, "no lines named for this piece"
    lines = [{"name": nm, "text": lyr["lines"][nm]["text"], "chords": lyr["lines"][nm]["chords"]} for nm in names]
    words = [(li, w) for li, ln in enumerate(lines) for w in ln["text"].split()]
    tape = tape_words(start, end)
    hit = align([norm(w) for _, w in words], tape)
    matched = sum(1 for h in hit if h is not None)
    if matched < MATCH_FLOOR * len(words):
        return None, f"{matched} of {len(words)} words found on the tape; the marks only"
    # times: matched words take the tape's; the rest are spread between their matched neighbours
    t = [None] * len(words)
    for k, h in enumerate(hit):
        if h is not None: t[k] = (tape[h]["s"], tape[h]["e"])
    k = 0
    while k < len(words):
        if t[k] is not None: k += 1; continue
        j = k
        while j < len(words) and t[j] is None: j += 1
        left = t[k - 1][1] if k > 0 else (t[j][0] - 0.35 * (j - k) if j < len(words) else start)
        right = t[j][0] if j < len(words) else (left + 0.35 * (j - k))
        n = j - k; step = (right - left) / (n + 1) if right > left else 0.3
        for q in range(n): t[k + q] = (left + step * (q + 0.5), left + step * (q + 1.2))
        k = j
    for li, ln in enumerate(lines):
        ln["words"] = [{"w": w, "s": round(t[k][0] - start, 2), "e": round(t[k][1] - start, 2), "hit": hit[k] is not None}
                       for k, (l2, w) in enumerate(words) if l2 == li]
    # the chords: each anchor is the first occurrence of its word after the previous anchor, inside its line
    for ln in lines:
        at, pos = [], 0
        for chord, word in ln["chords"]:
            found = next((i for i in range(pos, len(ln["words"])) if norm(ln["words"][i]["w"]) == norm(word)), None)
            if found is None: found = pos
            at.append({"chord": chord, "s": ln["words"][found]["s"]}); pos = found + 1
        ln["chord_at"] = at
    # show/hide: a quarter second before the first word; until the next line arrives or two seconds after the last word
    for i, ln in enumerate(lines):
        ln["show"] = max(0.0, ln["words"][0]["s"] - LEAD_IN)
        nxt = lines[i + 1]["words"][0]["s"] - LEAD_IN if i + 1 < len(lines) else 1e9
        ln["hide"] = min(nxt, ln["words"][-1]["e"] + HOLD_AFTER)
    return lines, f"{matched} of {len(words)} words found on the tape"

# ---------------------------------------------------------------- drawing
_cache = {}
def font(path, size):
    k = (path, size)
    if k not in _cache: _cache[k] = ImageFont.truetype(path, size)
    return _cache[k]

def shadowed(layer, draw_fn, blur=6, offset=(0, 3), alpha=150):
    """draw_fn(draw, fill) draws onto a layer; the same drawn black and blurred sits under it"""
    sh = Image.new("RGBA", layer.size, (0, 0, 0, 0)); d = ImageDraw.Draw(sh); draw_fn(d, (0, 0, 0, alpha))
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    layer.alpha_composite(sh, dest=offset)
    d = ImageDraw.Draw(layer); draw_fn(d, None)

def marks_layer():
    """the branch and the mark; constant for the whole piece"""
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    f = font(FONT_SMALL, BRANCH_SIZE)
    shadowed(L, lambda d, fill: d.text(BRANCH_XY, BRANCH_TEXT, font=f, fill=fill or (255, 255, 255, BRANCH_ALPHA)), blur=4, alpha=120)
    m = Image.open(MARK).convert("RGBA"); m = m.resize((MARK_W, int(m.height * MARK_W / m.width)), Image.LANCZOS)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); a = m.split()[3]
    sh.paste((0, 0, 0, 150), (MARK_XY[0], MARK_XY[1] + 4), a)
    L.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8)))
    L.alpha_composite(m, dest=MARK_XY)
    return L

def wrap(words, f, width):
    rows, cur = [], []
    for w in words:
        trial = cur + [w]
        if cur and f.getlength(" ".join(x["w"] for x in trial)) > width: rows.append(cur); cur = [w]
        else: cur = trial
    if cur: rows.append(cur)
    return rows

def lyric_state(line, n_sung, chord):
    """the lyric box with n_sung words full white and the chord chip above it; cached per state"""
    k = (line["name"], line["text"], n_sung, chord)
    if k in _cache: return _cache[k]
    f = font(FONT_LYRIC, LYRIC_SIZE); rows = wrap(line["words"], f, LYRIC_TEXT_W)
    box_h = len(rows) * LYRIC_LEAD + 2 * LYRIC_PAD - (LYRIC_LEAD - LYRIC_SIZE)
    x0 = (W - LYRIC_BOX_W) // 2; y0 = LYRIC_BOTTOM - box_h
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle((x0, y0, x0 + LYRIC_BOX_W, LYRIC_BOTTOM), LYRIC_RADIUS, fill=(0, 0, 0, LYRIC_BOX_ALPHA))
    idx = 0
    for r, row in enumerate(rows):
        text = " ".join(w["w"] for w in row); rw = f.getlength(text); x = (W - rw) / 2; y = y0 + LYRIC_PAD + r * LYRIC_LEAD
        for w in row:
            a = SUNG_ALPHA if idx < n_sung else UNSUNG_ALPHA
            d.text((x, y), w["w"], font=f, fill=(255, 255, 255, a))
            x += f.getlength(w["w"] + " "); idx += 1
    if chord:
        fc = font(FONT_SMALL, CHORD_SIZE); tw = fc.getlength(chord)
        cw, ch = tw + 2 * CHORD_PAD[0], CHORD_SIZE + 2 * CHORD_PAD[1]
        cx, cy = x0, y0 - CHORD_GAP - ch
        d.rounded_rectangle((cx, cy, cx + cw, cy + ch), CHORD_RADIUS, fill=(0, 0, 0, LYRIC_BOX_ALPHA))
        d.text((cx + CHORD_PAD[0], cy + CHORD_PAD[1] - 4), chord, font=fc, fill=(255, 255, 255, 255))
    _cache[k] = L
    return L

def chord_only(chord):
    """the chip alone, where a lyric box of two rows would put it, for the gap between lines"""
    k = ("chip", chord)
    if k in _cache: return _cache[k]
    L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    fc = font(FONT_SMALL, CHORD_SIZE); tw = fc.getlength(chord)
    cw, ch = tw + 2 * CHORD_PAD[0], CHORD_SIZE + 2 * CHORD_PAD[1]
    box_h = 2 * LYRIC_LEAD + 2 * LYRIC_PAD - (LYRIC_LEAD - LYRIC_SIZE)
    cx, cy = (W - LYRIC_BOX_W) // 2, LYRIC_BOTTOM - box_h - CHORD_GAP - ch
    d.rounded_rectangle((cx, cy, cx + cw, cy + ch), CHORD_RADIUS, fill=(0, 0, 0, LYRIC_BOX_ALPHA))
    d.text((cx + CHORD_PAD[0], cy + CHORD_PAD[1] - 4), chord, font=fc, fill=(255, 255, 255, 255))
    _cache[k] = L
    return L

def frame_at(t, lines, marks, chord_times, chord_end):
    """one RGBA frame at time t"""
    F = marks.copy()
    chord = None
    for s, c in chord_times:
        if s <= t: chord = c
    if t > chord_end: chord = None
    line = next((ln for ln in lines if ln["show"] <= t < ln["hide"]), None) if lines else None
    if line:
        n = sum(1 for w in line["words"] if w["s"] <= t + 0.05)
        L = lyric_state(line, n, chord)
        fade = min(1.0, (t - line["show"]) / FADE_S, (line["hide"] - t) / FADE_S)
        if fade < 1.0:
            L = L.copy(); a = L.split()[3].point(lambda v: int(v * max(fade, 0))); L.putalpha(a)
        F.alpha_composite(L)
    elif chord:
        F.alpha_composite(chord_only(chord))
    return F

def overlay(seg, dest, lines, duration):
    """lay the template over the levelled segment; sound copied through"""
    marks = marks_layer()
    chord_times, chord_end = [], -1.0
    for ln in (lines or []):
        for a in ln["chord_at"]: chord_times.append((a["s"], a["chord"]))
        if ln["chord_at"]: chord_end = max(chord_end, ln["hide"])
    chord_times.sort()
    n = int(duration * FPS + 0.999)
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(seg), "-f", "image2pipe", "-framerate", str(FPS), "-i", "-",
           "-filter_complex", "[0:v][1:v]overlay=0:0:format=auto,format=yuv420p[v]", "-map", "[v]", "-map", "0:a",
           "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-c:a", "copy", "-shortest", str(dest)]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    last = None
    for i in range(n):
        F = frame_at(i / FPS, lines, marks, chord_times, chord_end)
        if F is not last:
            import io; b = io.BytesIO(); F.save(b, "PNG", compress_level=1); png = b.getvalue(); last = F
        p.stdin.write(png)
    p.stdin.close(); p.wait()
    if p.returncode: raise RuntimeError("overlay encode failed")

# ---------------------------------------------------------------- the check file
def check(pieces):
    lyr = json.load(open(LYRICS, encoding="utf-8"))
    out = ["THE NUMBER'S TEMPLATE: every piece's lines timed against the tape's words (tools/numbers-template.py)",
           "A word marked ~ was not found on the tape by the aligner and takes its time from its neighbours.", ""]
    for p in pieces:
        if not p.get("cut"): continue
        c = p["cut"]; lines, note = time_piece(p["id"], c["start"], c["end"], lyr)
        out.append(f"{p['id']}  ({note})")
        for ln in (lines or []):
            chords = " ".join(f"{a['chord']}@{a['s']:.1f}" for a in ln["chord_at"])
            words = " ".join((w["w"] if w["hit"] else "~" + w["w"]) for w in ln["words"])
            out.append(f"   {ln['show']:5.1f}-{ln['hide']:5.1f}  {words}")
            if chords: out.append(f"                {chords}")
        out.append("")
    CHECK.write_text("\n".join(out) + "\n", encoding="utf-8")
    print("check ->", CHECK)

if __name__ == "__main__":
    led = json.load(open(REPO / "reels/numbers.json", encoding="utf-8"))
    check(led["pieces"])
