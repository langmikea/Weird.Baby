"""THE MUSIC PALETTE — the beat under the reels, as a range he can play.

    python tools/music-palette.py            build the eight samples and the page
    python tools/music-palette.py --page     only the page, from the built samples
    python tools/music-palette.py --levels   print each sample's loudness and stop

Mike, 2026-09-18 (cleaned): "I have never heard any of this music ... the right thing would
have been to present a palette of music for me to choose and direct from." So: four limits,
two rough samples of each, all under the SAME reel (the day-one Q&A stand-in), one page with
play buttons. He points. Nothing here ships: every sample is a stand-in for a kind of sound.

    1  no music at all          A the reel as built        B the room: the machine's mains hum
    2  the machine's own sounds  A sparse, a clock          B busy, a drum pattern
    3  a period cue              A a 1923 record            B a lounge library cue
    4  a modern beat             A mellow synth             B hard electronic

The machine's sounds are the twin's own definitions (robots tools/viiip_twin.html: FX_tone,
FX_noise, the Select / Scroll / Connected cases, the die strike, the hum), rebuilt here in
numpy so the pattern can be laid on a grid. The grid starts on the cut out of the pop and puts
a downbeat on the short (the shake), so the reel's own hit lands in time.

The cues live outside the repo in OneDrive/WeirdBaby/reels/library/ (beds/ = the public-domain
78s of reels/beds.json; palette/ = Kevin MacLeod, incompetech.com, CC BY 4.0: a credit line is
owed if one ever ships). Output: OneDrive/WeirdBaby/reels/out/music-palette/ (media never in
the repo). The page carries the samples inside itself so it plays from anywhere.
"""
import base64, html, json, pathlib, subprocess, sys
import numpy as np
from scipy.signal import butter, sosfilt

REPO = pathlib.Path(__file__).resolve().parents[1]
REEL = pathlib.Path(r"C:\Users\macun\OneDrive\WeirdBaby\reels\out\qa\2026-10-31_qa.mp4")
LIB = pathlib.Path(r"C:\Users\macun\OneDrive\WeirdBaby\reels\library")
OUT = pathlib.Path(r"C:\Users\macun\OneDrive\WeirdBaby\reels\out\music-palette")
PAGE = OUT / "MUSIC-PALETTE.html"
SR = 48000
T_IN = 1.7333          # the cut out of the pop: every bed starts here, hard
T_SHORT = 7.85         # the short on the shake: the grid puts a downbeat on it
BEAT = (T_SHORT - T_IN) / 12          # twelve beats between them, about 118 to the minute
BED_RMS = 0.085        # a bed's level under the reel's own sound (09-17: the first beds could not be heard)
FX_GAIN = 3.0          # the twin's own

SAMPLES = [
    dict(id="1A", limit=1, name="As built", what="No music. The pop, the voice under the question, the short on the shake. This is the reel as it stands today.", kind="none"),
    dict(id="1B", limit=1, name="The room", what="No music. The same, with the machine's mains hum under it from the cut to the end, as the twin hums on the site.", kind="hum"),
    dict(id="2A", limit=2, name="The machine, sparse", what="The machine's own ticks laid out like a clock: a low thump on the one, the scroll tick on the beats, the select tick before each bar.", kind="ticks"),
    dict(id="2B", limit=2, name="The machine, busy", what="The same sounds as a drum pattern: the thump as the kick, the die strike as the snare, scroll ticks running between, a burst of beeps into the shake.", kind="drums", trim=1.15),
    dict(id="3A", limit=3, name="A 1923 record", what="The Gold Digger, Missouri Jazz Band, 1923. A real 78 of the period, already in hand. Public domain, no credit owed.", kind="bed", file="beds/1923_the-gold-digger_missouri-jazz-band.mp3", credit="Public domain (US recording of 1923), Internet Archive 78rpm collection."),
    dict(id="3B", limit=3, name="A lounge library cue", what="Local Forecast - Elevator, Kevin MacLeod. Written now in the manner of 1960s background music: the waiting room, the industrial film.", kind="bed", file="palette/macleod_local-forecast-elevator.mp3", trim=1.2, credit="Kevin MacLeod (incompetech.com), CC BY 4.0: free to use, a credit line is owed."),
    dict(id="4A", limit=4, name="A modern beat, mellow", what="Chill Wave, Kevin MacLeod. Slow synthesizers and a soft drum machine.", kind="bed", file="palette/macleod_chill-wave.mp3", in_s=20.5, credit="Kevin MacLeod (incompetech.com), CC BY 4.0: free to use, a credit line is owed."),
    dict(id="4B", limit=4, name="A modern beat, hard", what="EDM Detection Mode, Kevin MacLeod. Loud electronic dance music, a heavy kick.", kind="bed", file="palette/macleod_edm-detection-mode.mp3", credit="Kevin MacLeod (incompetech.com), CC BY 4.0: free to use, a credit line is owed."),
]
LIMITS = {1: "No music at all", 2: "The machine's own sounds as the rhythm", 3: "A cue of the period", 4: "A modern beat"}


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, **kw)

def decode(path, extra=()):
    raw = run(["ffmpeg", "-v", "error", "-i", str(path), *extra, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()

def duration(path):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]).stdout)

def rms(x):
    return float(np.sqrt(np.mean(np.square(x)) + 1e-12))

PHONE = butter(4, [200, 6000], "bandpass", fs=SR, output="sos")
def phone(x):
    """what a phone speaker carries: a cue is found and levelled by this band, not by its sub bass"""
    return sosfilt(PHONE, x, axis=0)


# ── the machine's own sounds (the twin's definitions) ─────────────────────
def fx_tone(buf, at, f, dur, shape="square", gain=0.05):
    n = int((dur + 0.05) * SR); t = np.arange(n) / SR; ph = 2 * np.pi * f * t
    w = {"square": np.sign(np.sin(ph)), "sine": np.sin(ph), "triangle": 2 / np.pi * np.arcsin(np.sin(ph)),
         "sawtooth": 2 * (f * t % 1) - 1}[shape]
    env = np.where(t < dur * 0.75, 1.0, np.exp(-(t - dur * 0.75) / 0.02))      # setTargetAtTime(0, 0.75 dur, 0.02)
    put(buf, at, w * env * gain * FX_GAIN)

def fx_noise(buf, at, dur, gain, rng):
    put(buf, at, (rng.random(int(dur * SR)) * 2 - 1) * gain * FX_GAIN)

def put(buf, at, mono):
    i = int(at * SR)
    if i >= len(buf): return
    mono = mono[: len(buf) - i]; buf[i:i + len(mono)] += mono[:, None]

def scroll(b, t): fx_tone(b, t, 520, 0.028, "square", 0.04)
def select(b, t): fx_tone(b, t, 880, 0.035, "square", 0.05)
def thump(b, t): fx_tone(b, t, 110, 0.20, "sine", 0.09); fx_tone(b, t + 0.02, 220, 0.12, "sine", 0.04)      # PowerMaury
def connected(b, t): fx_tone(b, t, 660, 0.06, "square", 0.05); fx_tone(b, t + 0.07, 990, 0.06, "square", 0.05)
def strike(b, t, rng):                                                                                        # the die
    fx_noise(b, t, 0.045, 0.10, rng); fx_tone(b, t, 96, 0.20, "sine", 0.11)
    fx_tone(b, t + 0.012, 1450, 0.055, "triangle", 0.035); fx_tone(b, t + 0.022, 2180, 0.035, "triangle", 0.020)
def beeps(b, t, rng, n=4, step=0.08):
    for i in range(n): fx_tone(b, t + i * step, 300 + rng.random() * 800, 0.05, "square", 0.04)

def hum(n):
    """the twin's idle: 60 Hz with a slow wobble and the transformer's bite at 120"""
    t = np.arange(n) / SR
    level = 0.030 + 0.010 * np.sin(2 * np.pi * 0.09 * t)
    m = (level * np.sin(2 * np.pi * 60 * t) + 0.006 * np.sin(2 * np.pi * 120 * t)) * FX_GAIN
    m += 0.25 * level * np.sin(2 * np.pi * 180 * t) * FX_GAIN        # a phone speaker cannot play 60 Hz; the third harmonic is what it will carry
    return np.repeat(m[:, None], 2, 1)

def beats(total):
    k = 0
    while T_IN + k * BEAT < total - 0.05:
        yield k, T_IN + k * BEAT
        k += 1

def ticks(n, total):
    b = np.zeros((n, 2), np.float32)
    for k, t in beats(total):
        if k % 4 == 0: thump(b, t)
        else: scroll(b, t)
        if k % 4 == 3: select(b, t + BEAT / 2)
    return b

def drums(n, total):
    rng = np.random.default_rng(1031); b = np.zeros((n, 2), np.float32)
    for k, t in beats(total):
        bar = k % 4
        if bar in (0,): thump(b, t)
        if bar == 2: thump(b, t + BEAT / 2)
        if bar in (1, 3): strike(b, t, rng)
        for s in range(4):                                   # sixteenths, the off ones quieter by the twin's own two ticks
            if s == 0 and bar in (0, 1, 3): continue
            (select if s == 2 else scroll)(b, t + s * BEAT / 4)
        if k in (7, 19): connected(b, t + BEAT / 2)
        if k == 11: beeps(b, t, rng, n=6, step=BEAT / 6)     # into the short
    start = int(T_IN * SR); b[start:] += hum(n - start) * 0.3
    return b


# ── a cue from the library ────────────────────────────────────────────────
def find_in(path, need):
    """where the cue is already going: the first loud stretch, entered on a strong onset"""
    x = phone(decode(path, ["-t", "150"]).mean(1)); h = SR // 50
    e = np.sqrt(np.add.reduceat(np.square(x), np.arange(0, len(x) - h, h)) / h)
    w = int(need * 50); run_e = np.convolve(e, np.ones(w) / w, "valid")
    ok = np.where(run_e >= 0.9 * np.percentile(run_e, 75))[0]
    i0 = int(ok[0]) if len(ok) else 0
    flux = np.diff(e, prepend=e[0]); lo, hi = max(0, i0 - 50), i0 + 100      # a strong onset within a second before, two after
    i = lo + int(np.argmax(flux[lo:hi]))
    return max(0.0, i / 50 - 0.02)

def cue(path, n, total, in_s=None):
    need = total - T_IN; t_in = find_in(path, need) if in_s is None else in_s
    x = decode(path, ["-ss", f"{t_in:.3f}", "-t", f"{need + 0.5:.3f}", "-af", "loudnorm=I=-16:TP=-1.5:LRA=9"])
    b = np.zeros((n, 2), np.float32); i = int(T_IN * SR); x = x[: n - i]; b[i:i + len(x)] = x
    return b, t_in


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    total = duration(REEL); n = int(total * SR)
    base = decode(REEL); base = np.vstack([base, np.zeros((max(0, n - len(base)), 2), np.float32)])[:n]
    report = []
    for S in SAMPLES:
        bed = np.zeros_like(base); note = ""
        if S["kind"] == "hum":
            i = int(T_IN * SR); bed[i:] = hum(n - i)
        elif S["kind"] == "ticks": bed = ticks(n, total)
        elif S["kind"] == "drums": bed = drums(n, total)
        elif S["kind"] == "bed":
            bed, t_in = cue(LIB / S["file"], n, total, S.get("in_s")); note = f"cue entered at {t_in:.1f} s"
        if S["kind"] in ("ticks", "drums", "bed"):
            live = bed[int(T_IN * SR):]
            bed *= min(BED_RMS / rms(phone(live)), 1.4 * BED_RMS / rms(live)) * S.get("trim", 1.0) if S["kind"] == "bed" else S.get("trim", 1.3) * BED_RMS / rms(live)
        mix = base + bed
        peak = float(np.abs(mix).max())
        if peak > 0.97:                                                              # rough: a soft knee above 0.7, not a master
            a = np.abs(mix); mix = np.where(a < 0.7, mix, np.sign(mix) * (0.7 + 0.27 * np.tanh((a - 0.7) / 0.27)))
        wav = OUT / f"{S['id']}.f32"; mix.astype(np.float32).tofile(wav)
        mp4 = OUT / f"palette_{S['id']}.mp4"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(REEL), "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(wav),
             "-map", "0:v", "-map", "1:a", "-vf", "scale=540:960", "-c:v", "libx264", "-crf", "27", "-preset", "slow", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "-t", f"{total:.3f}", str(mp4)])
        wav.unlink()
        report.append(dict(id=S["id"], file=mp4.name, bytes=mp4.stat().st_size, bed_rms=round(rms(bed[int(T_IN * SR):]), 4), mix_peak=round(peak, 3), note=note))
        print(f"  {S['id']}  {S['name']:<24} {mp4.stat().st_size // 1024:>5} KB  bed rms {report[-1]['bed_rms']:.3f}  peak {peak:.2f}  {note}")
    (OUT / "build.json").write_text(json.dumps(dict(reel=str(REEL), beat_s=round(BEAT, 4), rows=report), indent=1), encoding="utf-8")


def levels():
    for S in SAMPLES:
        p = OUT / f"palette_{S['id']}.mp4"
        r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(p), "-af", "ebur128", "-vn", "-f", "null", "-"], capture_output=True, text=True).stderr
        i = [l for l in r.splitlines() if l.strip().startswith("I:")][-1].strip()
        print(f"  {S['id']}  {i}")


# ── the page ──────────────────────────────────────────────────────────────
CSS = """
:root{--bg:#d9d5ca;--card:#faf8f3;--ink:#211f1c;--soft:#57544d;--line:#c6c2b7;--hair:#9b978d;--chip:#211f1c;--chipink:#faf8f3;
--serif:'DM Serif Display',Georgia,serif;--read:'Fraunces','Source Serif 4',Georgia,serif;--mono:'Courier Prime','Courier New',monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1a1a1a;--card:#242321;--ink:#ededed;--soft:#b6b6b6;--line:#3e3e3e;--hair:#6b6962;--chip:#ededed;--chipink:#1a1a1a}}
:root[data-theme="dark"]{--bg:#1a1a1a;--card:#242321;--ink:#ededed;--soft:#b6b6b6;--line:#3e3e3e;--hair:#6b6962;--chip:#ededed;--chipink:#1a1a1a}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.55 var(--read)}
main{max-width:820px;margin:0 auto;padding-block:32px 72px;padding-inline:16px;display:flex;flex-direction:column;gap:18px}
.branch{font:700 13px/1 var(--mono);letter-spacing:.12em;color:var(--soft);margin:0}
h1{font:400 38px/1.08 var(--serif);margin:0;text-wrap:balance}
.lede{margin:0;max-width:62ch}
.how{margin:0;max-width:62ch;color:var(--soft)}
.limit{display:flex;flex-direction:column;gap:14px;border-top:1px solid var(--hair);padding-top:18px;margin-top:14px}
.limit h2{font:400 25px/1.15 var(--serif);margin:0;display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline;text-wrap:balance}
.limit h2 span{font:700 13px/1 var(--mono);letter-spacing:.12em;color:var(--soft)}
.pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.s{background:var(--card);border:1px solid var(--line);border-radius:4px;padding:14px;display:flex;flex-direction:column;gap:12px}
.s header{display:flex;gap:12px;align-items:center}
.id{font:700 22px/1 var(--mono);background:var(--chip);color:var(--chipink);padding:8px 10px 6px;border-radius:2px;letter-spacing:.04em}
.s h3{font:400 20px/1.15 var(--serif);margin:0}
.s video{width:100%;max-width:280px;aspect-ratio:9/16;background:#000;align-self:center;display:block}
.s video:focus-visible{outline:3px solid var(--ink);outline-offset:3px}
.s p{margin:0}.s .credit{font-size:14px;color:var(--soft)}
.end{margin-top:22px;border:2px solid var(--ink);padding:18px;display:flex;flex-direction:column;gap:10px}
.end h2{font:400 25px/1.15 var(--serif);margin:0}
.end p{margin:0;max-width:62ch}
.end dl{margin:0;display:grid;grid-template-columns:minmax(0,max-content) minmax(0,1fr);gap:8px 16px}
.end dt{font:700 16px/1.5 var(--mono)}.end dd{margin:0}
@media (max-width:520px){h1{font-size:31px}.end dl{grid-template-columns:1fr;gap:2px}.end dd{margin-bottom:8px}}
"""

def page():
    rows = []
    for lim, title in LIMITS.items():
        cards = []
        for S in [s for s in SAMPLES if s["limit"] == lim]:
            b64 = base64.b64encode((OUT / f"palette_{S['id']}.mp4").read_bytes()).decode()
            credit = f'<p class="credit">{html.escape(S["credit"])}</p>' if S.get("credit") else ""
            cards.append(f'<article class="s"><header><span class="id">{S["id"]}</span><h3>{html.escape(S["name"])}</h3></header>'
                         f'<video controls playsinline loop preload="metadata" src="data:video/mp4;base64,{b64}"></video>'
                         f'<p>{html.escape(S["what"])}</p>{credit}</article>')
        rows.append(f'<section class="limit"><h2><span>LIMIT {lim}</span>{html.escape(title)}</h2><div class="pair">{"".join(cards)}</div></section>')
    doc = f"""<title>Music Palette</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@700&family=DM+Serif+Display&family=Fraunces:opsz,wght@9..144,400;9..144,600&display=swap">
<style>{CSS}</style>
<main>
<p class="branch">&#92;ROBOTS &middot; THE BEAT UNDER THE REELS</p>
<h1>The music palette</h1>
<p class="lede">What goes under the daily question and answer reel. Eight samples, and the same twelve seconds of picture under every one: the day-one reel, on stand-in words.</p>
<p class="how">Turn the sound on and press play on each. A sample loops until you pause it, and starting one pauses the others. Everything is rough on purpose: no sample is a finished mix, and no track here is a proposal to use that track. Each one stands for a kind of sound.</p>
{"".join(rows)}
<section class="end"><h2>What to say back</h2>
<p>Point with the codes. Any one of these is a complete answer.</p>
<dl><dt>2B</dt><dd>Build the real thing in that direction.</dd>
<dt>2B, but slower</dt><dd>Or &ldquo;between 2A and 4A&rdquo;. A second, narrower palette around that spot.</dd>
<dt>1A</dt><dd>The reels stay without music and this question is closed.</dd>
<dt>none of these</dt><dd>With one sentence about what is missing. A new palette.</dd></dl>
<p>One pointing covers the daily question and answer reel. The Number carries your own music and is not part of this.</p></section>
</main>
<script>
const v=[...document.querySelectorAll('video')];v.forEach(a=>a.addEventListener('play',()=>v.forEach(b=>{{if(b!==a)b.pause()}})));
</script>"""
    PAGE.write_text(doc, encoding="utf-8")
    print(f"  page  {PAGE}  {PAGE.stat().st_size // 1024} KB")


if __name__ == "__main__":
    if "--levels" in sys.argv: levels(); sys.exit()
    if "--page" not in sys.argv: build()
    page()
