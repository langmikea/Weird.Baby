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
