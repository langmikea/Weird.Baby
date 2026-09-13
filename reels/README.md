# REELS — the daily determination, one row per weekday

**Ruled by Mike, 2026-09-03.** The daily question-and-answer reel is the
spine of the robots' short-form: one question put to the instrument, the
display answers, the machine's own sounds, Mike silent in frame, Weird.Baby
pops up at the end. Fifteen seconds. Every weekday. The full ruling, the
benchmarks and the pushbacks are in `C:\AI\PERSONA-20260903` (the served
page is `spine.html`).

```
npm run reels               this week's five rows and their state; next week's unwritten questions
npm run reels -- --week 3   a named week
```

| file | what it is |
|---|---|
| `reels/determinations.json` | the ledger: date, what the story reveals that day, the question, engine, persona, answer, status, one posting slot per surface, the numbers |
| `reels/numbers.json` | the musical number's ledger (Mike's rulings of 2026-09-03, `C:\AI\MUSIC-20260903\MUSIC.md`): one live performance a weekday from 2026-09-07, its own post, independent of the determination; one song at a time in pieces; a song runs a floor of two weeks and a ceiling of four while its sends and saves climb; Ops calls the week on Sundays; Coconuts first. Rows carry date, song, piece, status, postings, numbers |
| `tools/reels.mjs` | the report (the determination) |
| `tools/calendar.mjs` | reads both ledgers into the calendar's Determination and Number lanes |
| `tools/reels-build.py` | the reel line: intake clip → normalised, the pop appended → packet in OneDrive → row `shot` |
| `tools/reels-queue.mjs` | the queue (Mike's ruling 2026-09-03: Buffer): packet file → R2 at assets.weird.baby → Buffer createPost per channel at the lane's time → row `queued` with Buffer post ids |
| `reels/buffer-channels.json` | Buffer's channel ids, written by `reels-queue.mjs --channels`; not secret |

**Post times (Ops' call, 2026-09-03):** the Number at 12:00 New York; the
Determination at 17:00 New York, with the Record. **The Buffer key** lives
outside every repo at `C:\AI\PERSONA-20260903\.secrets\buffer.token`; Mike
makes and revokes it in Buffer (Settings → API). Public copies of the reels
sit in the R2 bucket under `reels/`; nothing links to them.

## How this relates to `release/`

`release/` holds reels that are **not** part of the museum's story (the
Coconuts single and its quarters). The determinations **are** the story: the
reel of the day carries the reveal of the day. They are kept apart so that
`release/`'s own rule ("not part of the story") stays true. The four
surfaces and their order are `release/README.md`'s ruling and apply here
unchanged: TikTok the door, Instagram the brand, YouTube the archive,
Facebook last. One video, 9:16, all four uncut.

## Who writes what

- **Mike writes the question.** On the Question of the Day page of the manual
  editing copy, or in chat. Ops carries it into `question` and sets `written`.
  The question is his editorial; Ops does not propose questions unless asked.
- **Mike chooses the answer.** It is recorded in `answer` for the recipe and
  for nothing else. No reel, caption or page shows or hints how an answer is
  arrived at. This file is private to the repository.
- **Ops keeps the rest:** `status` (`open` → `written` → `shot` → `posted`),
  `postings` (the address on each surface once out, or `null`), `numbers`
  (pulled by hand on Fridays), `note` (one line of what worked, for the
  recipe).

## The week, in order

| when | who | what | command |
|---|---|---|---|
| Sunday | Mike | five questions for next week (the Word page, a text file, or chat) | — |
| Sunday | Ops | carry them into the ledger | `npm run reels:questions -- --week N --file reels/questions/wN.txt` |
| any day, one sitting | Mike | shoot next week's ten clips, 9:16, phone; drop them in `OneDrive\WeirdBaby\reels\intake\<lane>\wN-mon.mp4` … | — |
| the day they land | Ops | build: normalise, append the pop, packet | `npm run reels:build -- --lane numbers --week N` (and `determinations`) |
| same day | Ops | queue: R2, then Buffer at each day's time; post ids into the ledger | `npm run reels:queue -- --lane numbers --week N` |
| Mon–Fri | Buffer | posts at 12:00 (Number) and 17:00 (Determination) New York | — |
| Sunday | Ops | pull the numbers, mark posted, read the recipe, call the song's week | `npm run reels:pull -- --lane numbers --week N` |
| any time | Mike | the calendar | `npm run calendar` or the served page |

**Cut-over, the weekend of 2026-09-05.** Mike: the six clicks in
`C:\AI\PERSONA-20260903\BUFFER-SETUP.md`. Then Ops, in order:
`npm run reels:channels` (records the channel ids) → `node tools/reels-queue.mjs --schema`
(checks Buffer's live field names against the metadata the queue sends) →
`npm run reels:queue -- --lane numbers --week 2 --dry` → the real queue →
Buffer's queue page shows four scheduled posts per channel → done. If a
channel refuses (TikTok privacy, YouTube title), the refusal is printed per
channel and recorded in the row; fix the metadata, re-queue that row.

## Rules

1. Nothing in `src/` reads this file and no string in it appears there. The
   canon line that governs `release/` governs here.
2. `scheduled` and `reveal_ids` follow `reveal/schedule.json`. When the
   schedule moves, re-seed those two fields and nothing else.
3. Week one is the Record; the machine is not yet shown. Its rows exist for
   seeding questions only.
4. Numbers are recorded, never typed into a standing document. The recipe is
   read off the rows on Sundays.

## Ruled 2026-09-12 — the question is burned in

Mike, on the first practice reel (A of A/B/C): **the question appears as
on-screen text, burned in by the reel line.** He shoots only the machine
answering: the shake or click, the answer on the glass, a two-second hold,
himself silent, the machine's own sounds on the Audigo. The line adds the
question line at the top and the pop at the end, identically every time.
Practice clips go to `intake/practice/practice-<date>.mp4`; the line builds
them like a Determination with no ledger row and nothing is posted.

What a practice reel is for, in order: the glass reads at phone size; the
machine is heard; the beat is there; one line of notes (room, light, time,
distance, the annoyance) comes with it; it goes back the same day, built,
with a three-line read. Nine of them, Tue/Thu/Sat, weeks 1 to 3; the room
and the framing are ruled on 10-04 from them.

## The question layer, built 2026-09-12

`python tools/reels-build.py --lane practice` builds every
`intake/practice/practice-*.mp4` into `out/practice/<name>_reel.mp4`: the
question burned in as large text over the opening beat (Georgia Bold, white
on a soft black box, top third, up for `--hold` seconds, default six), THE
ADULT speaking under it (`tools/reels-voice.py`: a muted mumble generated
from the sentence's syllables, rising at the end; never the machine's
voice), and the pop. `--question` sets the text; a Determination row's own
`question` is used on that lane. Nothing is posted from the practice lane.

**Ruled 2026-09-12: the pop opens the reel.** Mike: "In one second people
know exactly who we are, and one second later they know which lane of
Weird.Baby content they are in." The line puts the pop first, then the clip
with the question; nothing is appended at the end.

**The adult, second cut (2026-09-13, Mike's ruling A).** Not a mimic: a real
voice reads the actual question, then the line cuts the sound into short
grains and plays each backwards, band-limits it to the telephone range and
lays a light sweep over it. The cadence and the rising end survive; no word
does. The voice family is not the machine's. Readings are cached under
`OneDrive/WeirdBaby/reels/.adult-cache`; if the read cannot be made, the
09-12 trumpet stands in and the line says so.
