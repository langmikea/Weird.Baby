"""THE ADULT — the voice that asks the question. [Mike, 2026-09-12 and 09-13]

Mike, 09-12: the question's audio "must not be a robot: a human, or like the
adults in Charlie Brown, an indiscernible series of sounds that still leaves
the impression of spoken words. Not the Software Automated Mouth."
Mike, 09-13, on the first cut (a synthesised muted trumpet): "too muffled and
bassy. Instead of trying to mimic a voice, use the actual voice: have you read
the question in one of the voices, then process the crap out of it so it is no
longer intelligible."

So, ruled A: a real voice reads the ACTUAL question; the line then cuts the
sound into short grains and plays each grain backwards, band-limits it to the
telephone range so it is bright rather than bassy, and lays a light sweep over
it. The cadence, the breaths and the rising end survive; no word does. A
different voice family from the machine's, so nobody hears the machine asking.
Deterministic per sentence.

    python tools/reels-voice.py "Will it rain on the parade?" out.wav
    python tools/reels-voice.py --demo            # three questions -> adult-demo-*.wav beside this file

Needs edge-tts (pip install edge-tts) and ffmpeg for the read; numpy and
scipy for the processing. 48 kHz mono WAV out. If the read cannot be made
(no network), the old trumpet is used and the line says so.
"""
import asyncio, hashlib, math, pathlib, re, subprocess, sys, tempfile, wave, zlib
import numpy as np

SR = 48000
VOICE = "en-US-AvaMultilingualNeural"   # lowered and slowed toward androgynous (Mike, 09-16: slower, not nasal, aim androgynous)
RATE, PITCH = "-14%", "-28Hz"
GRAIN = (0.085, 0.14)                # seconds; each grain is reversed in place
XFADE = 0.012                        # seconds of crossfade between grains
BAND = (320.0, 3400.0)               # the telephone: bright, no bass
CACHE = pathlib.Path("C:/Users/macun/OneDrive/WeirdBaby/reels/.adult-cache")

# ── the read ────────────────────────────────────────────────────────────────
def read_aloud(text, tmpdir):
    """the real voice reading the actual question -> (mono float64 at SR, [(onset_s, dur_s, word)])"""
    import edge_tts
    mp3 = pathlib.Path(tmpdir) / "read.mp3"; words = []
    async def go():
        c = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH, boundary="WordBoundary")
        with open(mp3, "wb") as f:
            async for ch in c.stream():
                if ch["type"] == "audio": f.write(ch["data"])
                elif ch["type"] == "WordBoundary": words.append((ch["offset"] / 1e7, ch["duration"] / 1e7, ch["text"]))
    asyncio.run(go())
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp3), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype="<f4").astype(np.float64), words

# ── the processing ──────────────────────────────────────────────────────────
def trim(y, thresh=0.01):
    """tail only: the head is kept so the reader's word timings stay true to the sample"""
    idx = np.where(np.abs(y) > thresh)[0]
    return y[: idx[-1] + int(0.12 * SR)] if len(idx) else y

def reverse_grains(y, seed):
    rng = np.random.default_rng(seed)
    out = np.zeros_like(y); xf = int(XFADE * SR); i = 0
    while i < len(y):
        g = int(rng.uniform(*GRAIN) * SR)
        seg = y[i:i + g][::-1].copy()
        n = len(seg)
        if n == 0: break
        if n > 2 * xf:
            seg[:xf] *= np.linspace(0, 1, xf); seg[-xf:] *= np.linspace(1, 0, xf)
        out[i:i + n] += seg
        i += max(1, n - xf)
    return out

def band(y):
    from scipy.signal import butter, sosfilt
    sos = butter(4, [BAND[0] / (SR / 2), BAND[1] / (SR / 2)], btype="band", output="sos")
    return sosfilt(sos, y)

def sweep(y):
    """a light resonant peak drifting between 700 and 1600 Hz over the line: the plunger, gently"""
    from scipy.signal import iirpeak, sosfilt, tf2sos
    n = len(y); block = int(0.05 * SR); out = np.zeros_like(y)
    for s in range(0, n, block):
        frac = s / max(1, n)
        fc = 700 + 900 * (0.5 - 0.5 * math.cos(2 * math.pi * frac * 1.3))
        b, a = iirpeak(fc / (SR / 2), Q=2.2)
        out[s:s + block] = sosfilt(tf2sos(b, a), y[s:s + block])
    return 0.55 * y + 0.45 * out

def process(y, text):
    seed = zlib.crc32(text.strip().lower().encode("utf8"))
    y = trim(y)
    y = reverse_grains(y, seed)
    y = band(y)
    y = sweep(y)
    y = np.tanh(1.4 * y / (np.max(np.abs(y)) or 1.0))
    y = np.concatenate([y, np.zeros(int(0.25 * SR))])          # no head padding: timings hold
    return y / (np.max(np.abs(y)) or 1.0) * 0.8

# ── the fallback: the trumpet of 09-12, kept so the line never goes silent ──
def syllables(word):
    w = re.sub(r"[^a-z]", "", word.lower())
    if not w: return 0
    n = len(re.findall(r"[aeiouy]+", w))
    if w.endswith("e") and not w.endswith(("le", "ee", "ye")) and n > 1: n -= 1
    return max(1, n)

def trumpet(text):
    seed = zlib.crc32(text.strip().lower().encode("utf8")); rng = np.random.default_rng(seed)
    parts = []; words = text.split(); total = sum(syllables(w) for w in words) or 1; k = 0
    for w in words:
        for si in range(syllables(w)):
            frac = k / max(1, total - 1); hz = 175 - 18 * frac + (26 * (frac - 0.72) / 0.28 if frac > 0.72 else 0) + rng.uniform(-9, 9)
            n = int(rng.uniform(0.11, 0.21) * SR); t = np.arange(n) / SR
            tone = np.tanh(sum(a * np.sin(2 * math.pi * hz * h * t) for h, a in ((1, 1), (2, .55), (3, .42), (4, .28))))
            env = np.ones(n); atk = int(0.02 * SR); env[:atk] = np.linspace(0, 1, atk); env[-atk:] = np.linspace(1, 0, atk)
            parts += [tone * env, np.zeros(int(0.04 * SR))]; k += 1
        parts.append(np.zeros(int(0.1 * SR)))
    y = np.concatenate(parts); return y / (np.max(np.abs(y)) or 1.0) * 0.7

# ── the front door ──────────────────────────────────────────────────────────
def render_timed(text):
    """(samples, [(onset_s, dur_s, word)]) — the processed line and the reader's own word timings"""
    key = hashlib.sha256((VOICE + RATE + PITCH + "v2" + text.strip().lower()).encode("utf8")).hexdigest()[:16]
    cached = CACHE / f"{key}.npy"; cached_w = CACHE / f"{key}.json"
    if cached.exists() and cached_w.exists():
        import json; return np.load(cached), json.load(open(cached_w, encoding="utf-8"))
    try:
        with tempfile.TemporaryDirectory() as td:
            raw, words = read_aloud(text, td)
        y = process(raw, text)
        CACHE.mkdir(parents=True, exist_ok=True); np.save(cached, y)
        import json; json.dump(words, open(cached_w, "w", encoding="utf-8"))
        return y, words
    except Exception as e:
        print(f"  the adult could not read (\"{e}\"); the trumpet stands in", file=sys.stderr)
        y = trumpet(text); n = len(text.split()); step = len(y) / SR / max(1, n)
        return y, [(i * step, step, w) for i, w in enumerate(text.split())]

def render(text):
    return render_timed(text)[0]

def write_wav(path, y):
    pcm = (np.clip(y, -1, 1) * 32767).astype("<i2").tobytes()
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)

def main():
    if "--demo" in sys.argv:
        qs = ["Will it rain on the parade, or is the parade the rain?",
              "Should I tell my sister what her boyfriend said?",
              "Is Tuesday a good day to quit?"]
        for i, q in enumerate(qs, 1):
            out = pathlib.Path(__file__).with_name(f"adult-demo-{i}.wav"); y = render(q); write_wav(out, y)
            print(f"wrote {out.name}  {len(y)/SR:.2f}s  <- {q}")
        return
    if len(sys.argv) < 3: sys.exit(__doc__)
    text, out = sys.argv[1], pathlib.Path(sys.argv[2])
    y = render(text); write_wav(out, y)
    print(f"wrote {out}  {len(y)/SR:.2f}s")

if __name__ == "__main__":
    main()
