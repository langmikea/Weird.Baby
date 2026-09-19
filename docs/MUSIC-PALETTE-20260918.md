# The music palette, 2026-09-18

**What it is.** The first gate of the `beat` deliverable (the beat under the reels): a range he
can play before any bed goes under a reel. Mike, 09-18 (cleaned): "I have never heard any of
this music ... the right thing would have been to present a palette of music for me to choose
and direct from."

**The page he plays:** https://claude.ai/artifact/NZSDXTrfkmnNNWEyduyCj7 (private to him; it
carries the samples inside itself, so it plays on the phone). The same file is
OneDrive › WeirdBaby › reels › out › music-palette › `MUSIC-PALETTE.html`, with the eight
`palette_<code>.mp4` beside it. Built by `python tools/music-palette.py` (`--page`, `--levels`).

## The range

The picture under every sample is the same: the day-one Q&A reel on stand-in words
(`out/qa/2026-10-31_qa.mp4`, 12.2 s). Every bed starts hard on the cut out of the pop (1.73 s)
and runs to the loop. No fades.

| code | limit | what plays | source |
|---|---|---|---|
| 1A | no music | the reel as built: the pop, the adult, the short | the Q&A line |
| 1B | no music | the same, the machine's mains hum under it | the twin's hum (60 Hz, the bite at 120), a 180 Hz partial added so a phone carries it |
| 2A | the machine's sounds | sparse, a clock: thump on the one, scroll tick on the beats, select tick before each bar | the twin's own `FX_tone` definitions |
| 2B | the machine's sounds | busy, a drum pattern: thump as kick, the die strike as snare, scroll ticks between, beeps into the shake, the hum under | the same |
| 3A | a cue of the period | The Gold Digger, Missouri Jazz Band, 1923 | public domain, `reels/beds.json` |
| 3B | a cue of the period | Local Forecast - Elevator, Kevin MacLeod: 1960s background music written now | incompetech.com, CC BY 4.0 |
| 4A | a modern beat | Chill Wave, Kevin MacLeod: mellow synthesizers, entered at 20.5 s where its drums are | incompetech.com, CC BY 4.0 |
| 4B | a modern beat | EDM Detection Mode, Kevin MacLeod: hard electronic, entered at 43.1 s | incompetech.com, CC BY 4.0 |

The machine patterns sit on a grid of about 118 beats a minute, chosen so a downbeat lands on
the reel's own hit (the short on the shake, 7.85 s).

## Honest limits

- **Ops cannot hear.** Every sample was checked by measurement only: loudness (all between
  -19 and -15 LUFS, so none is lost under the reel as the 09-17 beds were), where each cue's
  drums come in, the waveform against the reel's cuts. Whether any of it sounds good is his ear.
- Each cue is found and levelled by the band a phone speaker carries (200 Hz to 6 kHz), because
  Chill Wave is mostly sub bass and would otherwise be a silent sample on a phone.
- The MacLeod tracks stand for a KIND of sound. None is a proposal. If one ever shipped, CC BY
  4.0 owes a credit line in the caption; the 1923 record owes nothing.
- One composer supplies three of the four library cues. If he points into limit 3 or 4, the
  second palette widens the sources (Free Music Archive, Pixabay, the Internet Archive).
- The cues downloaded and not used are in `library/palette/` for that second palette:
  Lobby Time, Hep Cats, Funkorama, Hustle, Voxel Revolution, Bass Vibes, Cipher2.

## What his pointing causes

- A code (say `2B`): Ops builds the real thing in that direction into `tools/reels-qa.py`,
  settles licence and credit as an Ops call, re-cuts the day-one reel, sends one sample back.
  Task `beat-build`, 10-01, so the fifteen Q&As are cut once with the sound already ruled.
- "Between" two codes, or a code with a note: a second, narrower palette around that spot first.
- `1A`: the reels stay without music; the deliverable closes with no build.
- "None of these" and a sentence: a new palette.

One pointing covers the daily Q&A reel (and the hot lane, which is the same template). The ask
reel and the shoot reel follow the same ruling unless he says otherwise. The Number carries his
own music and is outside this.
