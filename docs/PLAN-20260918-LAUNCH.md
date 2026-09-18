# THE LAUNCH PLAN — the plan of record from 2026-09-18

Ops as project manager. This supersedes PLAN-20260910-OPENING-DAY.md (kept
as history: its picture, its SED blocks and its rulings stand where this
page does not replace them). The plan itself is data:
`docs/desk/BOARD-PLAN.json`. This page is the part data cannot hold: why,
what is in and out, what a week can carry, what could sink us, and how the
plan is kept. The method is in BOARD-PLAN-20260918.md.

Mike, 09-18: "Get me to the point where we've got a solid plan put
together that's measurable, trackable, that's modified as much as needed
and not more than that."

## 1. Objectives

Every quoted line is Mike's, with the question it answered
(docs/canonical/WHAT_WEIRD_BABY_IS.md). The intent and purpose lines are
Ops' drafts, ruled to stand on 09-18 (LAUNCH-20260918, 1A) until he writes
the paragraph.

| | intent | purpose | the day |
|---|---|---|---|
| The whole | everything points back to Mike; each piece stands alone | a stranger from "weird.baby?" to "Weird.Baby!" in sixty seconds (why does the site exist, reason one, 09-01) | none; it is what the launches add up to |
| /M the Number | one live performance a weekday; the show is the audition | promote his music (reason four, 09-01) | Mon 10-26, noon |
| /R the door | sell the machine: an infomercial wing, the story a prologue (the reset, 09-10) | robot sales (reason three, 09-01) | Fri 10-30, five |

**What this plan measures (ruled 1A):** readiness to launch, nothing after.
A plan for the daily running (DOPS) and its own board follow the door.

## 2. Scope

**In (ruled 2A): what the launches must have.** The list is
`BOARD-PLAN.json`: 51 deliverables in 11 columns. It is Ops' draft until the
09-20 sitting rules it; the draft rule for the product columns is "the
catalogue row has a launch-run day".

**Out until after the door (ruled 09-18, LAUNCH 2A):** /S the shop, /F the
foundation, /W, /hr. Game reels and artifact reels (parked, shelved). The
audio-only Number, the live single. The 29 catalogue rows marked later. The
per-voice backend. **There is no way to buy at the door**; the album's last
section runs the twin and carries "the line about having one" when the day
comes (ALBUMS-20260910). "Sell" at the door means pitch.

## 3. Outcomes, and what makes each true

| # | true on the day | made true by (columns) | things (a few serve two) |
|---|---|---|---|
| O1 | The Number posts a piece a weekday with no hand, and lands the viewer on the song. | Number reel; the song's page (The site); Buffer, the deploy before the Number (The system) | 5 |
| O2 | The wing sells the machine: four albums, a page per must-have program and game, the prologue, the door opens itself. | Albums; Shoot reel; The site | 13 |
| O3 | The daily Q&A posts with no hand, fifteen days in hand, and lands the viewer in a room. | Q&A reel; Ask reel; the landing (The site); Buffer | 5 |
| O4 | The machine matches its promotion: everything shown works on the twin and on the real unit. | Programs; Games; Engines and settings; The machine | 26 |
| O5 | The week runs without Mike. | The system | 7 |

Every deliverable names the tasks that serve it. A must-have deliverable
with no open task is red; a task that serves no deliverable is listed for
challenge (today: `burn-down`, housekeeping; `words-3`, the Foundation's
posture, which is out of scope until after the door).

## 4. The schedule: seven milestones

The full schedule, every open gate by week, is generated:
`docs/desk/BOARD-SCHEDULE.md`. Need-by dates are the latest a gate can pass,
planned backwards from the launches with the freeze (10-26) as the wall.

| week | milestone | what must be true by its Sunday |
|---|---|---|
| 09-14 | **M1 Scope ruled** (09-20) | the must-have list; the 24 pitches; Sunday Q1 (the glass), Q2 (refusals), Q7 (the frame) |
| 09-21 | **M2 Shapes ruled** (09-27) | the wing's shapes; the Number's template; the Everyman shot; the white treatment in the photo line |
| 09-28 | **M3 The wing built** (10-04) | prologue, feature pages, landing built in development; 23 programs and games final on the twin; the twin verified; the Gambler shot |
| 10-05 | **M4 Content lock** (10-11) | fifteen Q&As; his words; Buffer connected; song two; the CEO shot; the first album ruled |
| 10-12 | **M5 Machine and pipes proven** (10-18) | the unit flashed (10-15); one real queue through Buffer (10-16); the song's page built; the Informer shot |
| 10-19 | **M6 Rehearsed, in the can** (10-25) | the launch build (10-20); the rehearsal and the unit verified (10-22); the Number queued (10-23); the last albums ruled; the deploy before the Number (10-25) |
| 10-26 | **M7 Launch** | the Number, Monday noon; the freeze; the door, Friday at five |

## 5. Capacity: what a week can carry

Mike's stated rhythm (PLAN-20260910): one ruling sitting on Sunday, one
shoot when it suits, and his words and content as they come. Call it three
asks a week. The schedule counts asks (one sitting's worth; 24 pitches in
one sitting is one ask):

```
WEEK 09-14  Mike 1   Ops 0
WEEK 09-21  Mike 3   Ops 1
WEEK 09-28  Mike 4   Ops 11    OVER (Mike by 1); Ops' heaviest build week
WEEK 10-05  Mike 8   Ops 4     OVER: Q&As, two pieces of writing, Buffer, song two, a shoot, an album ruling
WEEK 10-12  Mike 3   Ops 8
WEEK 10-19  Mike 3   Ops 13    everything of Ops' converges on the rehearsal
WEEK 10-26  Mike 1   Ops 0
```

Findings:

1. **The week of 10-05 asks eight things of Mike.** It is where the plan
   breaks first. None of the eight is blocked from starting earlier. The
   fix is to pull, not to push: see the open ruling in section 9.
2. **Delivered so far on Mike's lane: 0 of 14** (the desk, 09-18). The
   board cannot see this yet because nothing of his is due before 09-20;
   the pace rule will. It is the largest risk in the plan (R1).
3. **Ops works only in sessions Mike starts** (and the 06:08 run). Eleven
   and thirteen Ops gates in the weeks of 09-28 and 10-19 mean more starts
   those weeks. Done 09-18: `twin-update` and `bench-plan` pulled a week
   earlier, since neither waits on a ruling.

## 6. The chains with no slack

```
THE INFORMER'S ALBUM   shot 10-18 > through the line 10-21 > filled 10-23 > ruled 10-25 > freeze 10-26     zero days
THE REAL UNIT          bench 10-15 > verified 10-22 > 24 programs and games proven on it by 10-22             seven days, on firmware never run on hardware
BUFFER                 key 10-10 > one real queue 10-16 > the Number queued 10-23                               blocks four lines; nothing is proven until the key
THE SHOOTS             four Sundays, four albums, 09-27 to 10-18                                               one missed Sunday moves every album after it
```

## 7. Risks

Reviewed each Sunday; a risk that fires becomes a red on the board and a
3C ruling.

| # | risk | sign it is firing | response ready |
|---|---|---|---|
| R1 | Mike's lane does not deliver at the rate the plan asks | the pace rule turns the Q&A line red; a shoot Sunday passes | level the asks now (section 9); if it fires, cut scope before dates: fewer Q&As in hand, fewer albums at the door |
| R2 | The 2026 firmware faults on the bench | the bench (10-15) ends in a rollback | the door opens on the twin; "proven on the real unit" moves to later by ruling; a second bench date held open |
| R3 | The games are not final, and have no date | still no date after 09-20 | games go to later (the door opens without them) or Mike names the date; six things, one ruling |
| R4 | Buffer is a single point of failure | the key is not in hand by 10-10 | pull the six clicks into the week of 09-21; nothing else in the plan waits on so little |
| R5 | A shoot Sunday is missed | an album's "shot" gate passes its date | the door opens with the albums that are ruled; the shelf was built to grow |
| R6 | Ops' heavy weeks get too few sessions | Ops gates late in the week of 09-28 | pull builds earlier as rulings allow; Mike starts a session a day those two weeks |
| R7 | The 09-20 sitting is too much for thirty minutes (61 pitches, five questions, the must-have list) | it runs out before the list is ruled | rule by exception: Ops' draft stands unless he marks a row; must-have ruled by column, not by row |
| R8 | The plan drifts from the truth | a gate is earned on disk but not in the plan | gates are evidence-only and updated in the session the evidence lands; the morning run grades daily; the Sunday sitting reads only the reds |

## 8. How the plan is kept (as much as needed, and not more)

- **One source.** `docs/desk/BOARD-PLAN.json` holds outcomes, columns,
  deliverables, gates, need-by dates, blockers, depends-on, tasks. The board,
  the grade, the schedule are generated from it. This page holds only what
  data cannot. Nothing is kept in two places.
- **Status at any point.** `npm run board` grades today;
  `node tools/board.mjs --as-of 2026-10-12` grades any day, which is also
  how a proposed change is tested before it is ruled. The 06:08 run grades
  every morning and puts one line in MORNING.md.
- **Who updates what.** Mike updates nothing. His deliveries are read from
  the tree, the ledgers and the workbook, or recorded by Ops from his word,
  with the evidence named. Ops marks a gate earned in the session the
  evidence lands, never on intention.
- **Cadence.** Daily: the grade, unattended. Sunday: the exception sitting.
  Only the reds are read; each is ruled under 3C (cut the scope, move the
  date, add effort, or accept it); each ruling is logged. Then the risks,
  one line each.
- **Change control.** Baseline v1 is set 09-18 and becomes firm when the
  must-have list is ruled. After that a need-by date, a must-have entry or
  a gate ladder changes only by a ruling in `docs/desk/BOARD-DECISIONS.md`,
  and the baseline version rises. Tasks are not the baseline: Ops adds
  them and moves its own earlier freely; Mike's task dates move only by
  his word.
- **What the exec sees.** One page, the board. Red only. How big (the
  height of the red), where (the column), who (the owner in the pop-up).

## 9. Open rulings, for the 09-20 sitting

Written into QUESTIONS-for-Sunday.md as 8, 9 and 10: the must-have list by
column; three dates the plan lacks (the games final, the ask reel's notes
and question, a deploy before the Number); and the levelling of the week of
10-05.

## 10. Where we stand, 09-18

9 of 51 not on track: the six games (no date), the ask reel (no date), the
song's page and the deploy before the Number (no deploy date). Everything
else is on track by the rules, with the week of 10-05 the place it will
break first if nothing is pulled forward.
