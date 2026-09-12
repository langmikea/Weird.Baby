"""THE ADULT — the voice that asks the question. [Mike, 2026-09-12, ruling A]

Mike: the question's audio "must not be a robot: a human, or like the adults
in Charlie Brown, an indiscernible series of sounds that still leaves the
impression of spoken words. Not the Software Automated Mouth; that would
confuse whether the machine is asking or answering."

So: a muted brass mumble, one note per syllable, generated from the question
itself. The rhythm is the sentence's (a syllable a note, a word a breath, a
comma a pause), the pitch drifts the way speech does and rises at the end
because it is a question, and no note is ever a word. Deterministic per
sentence: the same question always sounds the same.

    python tools/reels-voice.py "Will it rain on the parade?" out.wav
    python tools/reels-voice.py --demo            # writes adult-demo.wav beside this file

Pure numpy, 48 kHz mono WAV. The reel line mixes it under the clip.
"""
import math, pathlib, re, struct, sys, wave, zlib
import numpy as np

SR = 48000

def syllables(word):
    w = re.sub(r"[^a-z]", "", word.lower())
    if not w: return 0
    groups = re.findall(r"[aeiouy]+", w)
    n = len(groups)
    if w.endswith("e") and not w.endswith(("le", "ee", "ye")) and n > 1: n -= 1
    return max(1, n)

def plan(text):
    """[(kind, seconds, pitch_hz, level)] — notes and rests, from the sentence."""
    seed = zlib.crc32(text.strip().lower().encode("utf8"))
    rng = np.random.default_rng(seed)
    words = [w for w in re.split(r"\s+", text.strip()) if w]
    total = sum(syllables(w) for w in words) or 1
    base = 175.0 + rng.uniform(-10, 10)         # a low adult, off-camera
    out, k = [], 0
    for wi, w in enumerate(words):
        n = syllables(w)
        for si in range(n):
            frac = k / max(1, total - 1)
            # speech drifts down through a sentence, then a question lifts the tail
            drift = -18 * frac
            lift = 0.0
            if frac > 0.72: lift = 26 * (frac - 0.72) / 0.28
            stress = 6 if (si == 0 and n > 1) else 0
            pitch = base + drift + lift + stress + rng.uniform(-9, 9)
            dur = rng.uniform(0.11, 0.21) * (1.25 if (si == n - 1 and wi == len(words) - 1) else 1.0)
            out.append(("note", dur, pitch, rng.uniform(0.75, 1.0)))
            out.append(("rest", rng.uniform(0.02, 0.05), 0, 0))
            k += 1
        out.append(("rest", rng.uniform(0.06, 0.13), 0, 0))
        if w.endswith((",", ";", ":")): out.append(("rest", 0.22, 0, 0))
    return out

def note(dur, hz, level):
    n = int(dur * SR); t = np.arange(n) / SR
    # a pulse-ish tone with a slow vibrato, then a mute: a resonant band around 600 Hz
    vib = 1 + 0.012 * np.sin(2 * math.pi * 5.5 * t)
    ph = 2 * math.pi * np.cumsum(hz * vib) / SR
    tone = np.zeros(n)
    for h, a in ((1, 1.0), (2, 0.55), (3, 0.42), (4, 0.28), (5, 0.18), (6, 0.12), (7, 0.08)):
        tone += a * np.sin(h * ph)
    tone = np.tanh(1.8 * tone / 2.6)
    # the mute (a resonant low-pass), first order twice, cutoff sweeping like a plunger
    y = np.zeros(n); s1 = s2 = 0.0
    for i in range(n):
        fc = 520 + 380 * math.sin(math.pi * i / max(1, n - 1))
        a = 1 - math.exp(-2 * math.pi * fc / SR)
        s1 += a * (tone[i] - s1); s2 += a * (s1 - s2); y[i] = s2
    atk = min(n, int(0.02 * SR)); rel = min(n, int(0.045 * SR))
    env = np.ones(n)
    env[:atk] = np.linspace(0, 1, atk); env[n - rel:] = np.linspace(1, 0, rel)
    return y * env * level

def render(text):
    parts = []
    for kind, dur, hz, level in plan(text):
        parts.append(note(dur, hz, level) if kind == "note" else np.zeros(int(dur * SR)))
    y = np.concatenate(parts) if parts else np.zeros(SR // 10)
    y = np.concatenate([np.zeros(int(0.15 * SR)), y, np.zeros(int(0.25 * SR))])
    peak = np.max(np.abs(y)) or 1.0
    return (y / peak * 0.8)

def write_wav(path, y):
    pcm = (np.clip(y, -1, 1) * 32767).astype("<i2").tobytes()
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)

def main():
    if "--demo" in sys.argv:
        out = pathlib.Path(__file__).with_name("adult-demo.wav")
        write_wav(out, render("Will the machine ever tell me the truth about my sister's boyfriend?"))
        print("wrote", out); return
    if len(sys.argv) < 3: sys.exit(__doc__)
    text, out = sys.argv[1], pathlib.Path(sys.argv[2])
    y = render(text); write_wav(out, y)
    print(f"wrote {out}  {len(y)/SR:.2f}s  {sum(syllables(w) for w in text.split())} syllables")

if __name__ == "__main__":
    main()
