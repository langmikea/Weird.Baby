# The Number's template: crop, logo, chords, lyrics

Ops, 2026-09-18, small hours, on Mike's note of 09-17 (he watched
coconuts-w1-hook as cut: "pretty good as raw stock"; it will need a tighter
crop, a logo, chords and lyrics) and the house rule of 09-16 (music reels show
the chord being played, in time, like captions). Queue item 1 of the 50,000 ft
page, ruled 3A. Supersedes "nothing added" in `docs/NUMBER-PIECES-20260917.md`
§6 and the frame A/B of its §5. The sixteen pieces on the shelf are re-cut
through it; the three story slots stay the 10-20 sitting's.

## 1. What the template lays over a piece

| layer | what | where |
|---|---|---|
| the branch | `\MUSIC`, the small type, white at half strength, a soft shadow | top left, below the apps' top chrome |
| the mark | the Weird.Baby mark (`public/images/wb/weird-baby-mark.png`), small, a soft shadow | top right, level with the branch |
| the lyric | the line being sung, Georgia Bold (the house's question type), white on a soft black box; the words he has sung full white, the words to come dimmed | centred in the band under his feet, above the apps' caption area, narrower than the frame so the right-hand icons miss it |
| the chord | the chord under his hand, in a small chip in the small type | above the lyric box, left; changes on the word the sheet puts it on |
| the crop | 1.6x on him (the middle 675x1200 of the turned frame around x 550, y 1320, scaled back up) | every piece, unless a piece carries its own frame |

The pop still opens the reel. The levelling and the eased sound edges of 09-17
are unchanged. A spoken line (the story slots, the talk between takes) carries
no chord. Everything is `tools/numbers-template.py`; the constants at its top
are the layout, with the reason beside each.

## 2. Why the crop is 1.6x and not tighter

The porch geometry sets it. He runs head to sandals over 770 source pixels.
The marks want the top 200 or so (the apps' tabs and titles sit over the first
200 too), and the lyric wants the bottom 340 (the apps' captions sit over the
last 300). What is left for him is about 1220 pixels of height, and 770 x 1.6
is 1232. Tighter than 1.6 either cuts his feet or puts the lyric on them.

The B sample is built at 2.0x (`coconuts-w1-hook-tight`): as tight as the tape
allows, and the lyric rides over his shins and feet. It is a phone upscale of
540 pixels of width; softer than A, and A is already softer than the tape.

## 3. Lyrics and chords: where the timing comes from

- `reels/numbers-lyrics.json`: each piece's lines, the sheet's words as he
  sings them on that take (take 3 drops "or" from "or so I'm told"; take 2
  sings "the song" for "this song" and loses a "when"; the broken verse of
  week three carries his spoken words as lines with no chord). Chord anchors
  name the word the sheet puts the chord on: D A E A, the key of A.
- `reels/transcripts/porch-20260824-words.json`: the tape's words with
  their seconds (faster-whisper medium on the GPU, ninety seconds; the
  09-17 CPU run took eleven minutes and was lost with the session). The
  model hears "coconuts" as "cooking nuts"; the template merges them before
  aligning.
- The lyric words are aligned to the tape's words by a plain sequence
  alignment; a missed word takes its time from its neighbours. A line shows
  a quarter second before its first word and leaves when the next line
  arrives or two seconds after its last word.
- Checked: `docs/desk/NUMBER-TEMPLATE-check.txt`, one row a line with its
  seconds and chord anchors; a `~` marks a word the aligner did not find.
  Every sung piece found all its words but one ("wanna", "I'll" at a
  piece's first frame). The take-3 talk B (`coconuts-w2-story-alt`) is
  the exception: the model skipped that stretch of the tape, so the piece
  carries the marks and no words.

## 4. What to look at

Finished reels › numbers-coconuts (OneDrive › WeirdBaby › reels › out ›
numbers-coconuts). `REVIEW-SHEET.png` beside them: one row a piece, the first
frame after the pop, the middle, the last. For the frame: `coconuts-w1-hook.mp4`
(A, the ruled template at 1.6x) beside `coconuts-w1-hook-tight.mp4` (B, 2.0x).
Sunday question 7 is re-cut to this A/B; C (as shot) stays on the sheet.

## 5. What changed

- `tools/numbers-template.py`: new; the overlay and the timing.
- `tools/numbers-pieces.py`: crops by the ledger's `template.frame` (or the
  piece's own `frame`), lays the template over the levelled segment, writes
  the check file; `push` is gone.
- `reels/numbers.json`: a `template` block (frame, marks, lyric, chord;
  `ruled: null` until Sunday); the push sample replaced by the 2.0x sample;
  every cut piece carries `frame_used` and its word count.
- `reels/numbers-lyrics.json`, `reels/transcripts/porch-20260824-words.json`: new.
- `docs/desk/NUMBER-TEMPLATE-check.txt`: the timings.
- `docs/desk/QUESTIONS-for-Sunday.md`: question 7 re-cut.

## 6. Not done, and why

The chord shapes (the fret box beside the name) are not drawn: the name is
what the rule asks for, and Sunday question 3 (where the tabs live) has not
been ruled. The story slots' captions wait for the sitting's footage. The
caption line and the song page on /wb (the backfill of the 50,000 ft page)
are separate items.
