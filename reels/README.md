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
| `tools/reels.mjs` | the report |

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

## Rules

1. Nothing in `src/` reads this file and no string in it appears there. The
   canon line that governs `release/` governs here.
2. `scheduled` and `reveal_ids` follow `reveal/schedule.json`. When the
   schedule moves, re-seed those two fields and nothing else.
3. Week one is the Record; the machine is not yet shown. Its rows exist for
   seeding questions only.
4. Numbers are recorded, never typed into a standing document. The recipe is
   read off the rows on Sundays.
