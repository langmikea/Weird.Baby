# SPEC — THE DOOR, THE OPERATING DEFINITION (rewritten whole, 2026-09-06)

**Handed to Mike 2026-09-06. Ops writes it; the line runs it.** This
replaces `SPEC-tiktok-operating-definition-20260901.md` whole, by the brief
rule: never a brief plus a correction. What changed since 09-01 is not a
number; it is that the lane, the cadence, the posting and the measurement
are now ruled and built, so the definition describes a thing that exists.

**The 09-01 readings stand as readings.** Every figure below that came from
the research round of 2026-09-01 is still `UNVERIFIED` against the platform
in the register's sense, and is not repeated here as fact. Where the 09-03
research (`C:\AI\PERSONA-20260903\reels.html`, sources 2025–2026) agreed
with a reading, it is said; where it did not, the newer source is named.

---

## THE DEFINITION

| | the rule | what it rests on |
|---|---|---|
| **THE LANES** | **Two reels a weekday: the Determination and the Number.** | Mike, 2026-09-03 (Q9, Q2 of the music leg). Not one lane, "the workshop", as 09-01 had it; two named segments a viewer learns. |
| **THE DETERMINATION** | A question put to the instrument; the display answers; the machine's own sounds; Mike silent in frame; the pop at the end. Fifteen seconds, twenty at most. | Mike's rulings Q9–Q12; the length is Ops' on the evidence (discovery under 30 s; completion beats duration). |
| **THE NUMBER** | A live performance to camera, unproduced; one song at a time, in pieces; a song runs two to four weeks while its sends and saves climb. About thirty seconds. | Mike's rulings, music leg Q1–Q5; the four Coconuts clips open week two. |
| **WHAT A REEL MAY SHOW** | The day's device feature as the machine's own content. Never a Record, the ZIP, an artifact, the portal, or the word chapter. | Mike, ruling B on the Never-Advertised law, 2026-09-06. `reveal/schedule.json` tags each row `reel: feature` or `reel: site`. |
| **CADENCE** | Five a week per lane, weekdays, from week two (2026-09-14). | Mike, 2026-09-03; agrees with 09-01 reading 1 and the 09-03 sources (three to four a week is the floor cited; five is the lanes' own shape). |
| **TIME** | The Number at 12:00 New York; the Determination at 17:00 New York, with the Record. Same times every day. | Ops' call, 2026-09-03; 09-01 reading 6 (same-time posting) agrees. |
| **THE FIRST THREE SECONDS** | The question as one line of text on screen, or the first bar of the song. No greeting, no title, no intro. Must work muted. | 09-01 reading 4; 09-03 sources (about half of Instagram video is watched muted). |
| **AUDIO** | Original only: the machine's sounds, Mike's voice, his songs. | 09-03 sources: a licensed track halves the Shorts share; TikTok pays only on original. |
| **THE ENDING** | The pop, `WB_pop_v1`, identical to the frame on every reel, appended by the line. | Mike, 2026-09-03 (Q15–Q18). |
| **FRAME** | Vertical 9:16, 1080×1920, 30 fps, stereo 48 kHz, one clean export, no watermark. | HOUSE: one video fits all four surfaces uncut (`release/README.md`); Instagram demotes watermarks. |
| **SURFACES AND ORDER** | TikTok the door, Instagram the brand, YouTube Shorts the archive, Facebook last. One file to all four. | `release/README.md`, unchanged. |
| **POSTING** | Through Buffer, fed by the line's queue at the ruled times. Mike posts nothing by hand once the channels are connected. | Mike, 2026-09-03: Buffer. `tools/reels-queue.mjs`. |
| **ACCOUNTS** | TikTok a Creator account, public. Instagram a Creator account. A Facebook Page. YouTube as is. | 09-03 sources: the creator fund excludes Business; tools cannot post to a personal Instagram. |
| **TAGS** | Two or three of the house's own, one or two broad, in the caption drafts the line writes; Mike may change them in Buffer. | 09-01 reading (the ranges); unchanged. |
| **PATIENCE** | No judgement of a lane before thirty reels. A song is judged on its own two-to-four-week run by sends and saves, which is a different question. | 09-01 reading 5 at the top of its range; Mike's music ruling Q4. |
| **REPLIES** | Comments are read daily; they are where the Determination's questions come from. Replies are in a voice and voices are Mike's: Ops drafts when asked, posts nothing unposed. | Mike, 2026-09-03 (the soapbox; the access model). |
| **WHAT COUNTS** | Sends and saves per view first, then replies, then views. Read on Sundays from Buffer into the ledgers. | 09-03 sources (Instagram's stated signals); `tools/reels-pull.mjs`. |

---

## WHAT IS MADE, AND WHAT IS NEVER MADE

- **Real footage of the real machine and the real man.** Never generated
  video. 09-01 reading 7 (AI video down-ranked) stands unverified and is
  obeyed anyway, because the pop is the only made thing and it is a logo.
- **Nothing the story has not released.** The queue refuses nothing by
  itself; the ledger's `frame` and `site_only` say what may be on camera
  that day, and Ops reads them before a clip is built.

## WHAT THIS SPEC DOES NOT DO

- It does not write a question or a caption's words as Mike's. Captions the
  line drafts are `HOUSE` until he changes them.
- It does not touch `release/releases.json`; the Coconuts single's own
  record there is a different object (reels that are not part of the story).
- It does not reach for a platform's API to verify a reading. The numbers
  above that matter are read from the ledgers, not from a rate card.

## THE STATE THIS SPEC WAS WRITTEN AGAINST

```
tiktok account        @papaweird.baby · Creator · public · observed 2026-08-28
youtube               @PapaWeirdBaby · observed
instagram             named in one tree (@papa_weird.baby), unconfirmed; must become Creator
facebook page         to confirm
buffer                not yet connected (Mike's six clicks, the weekend of 09-05)
week two, the Number  four Coconuts reels built and in the packet; Friday to shoot
week two, Determination  five questions not yet written
```

`npm run calendar` and `npm run reels` print the living version of this
block. If they disagree with it, the tree is right and this document is
stale.
