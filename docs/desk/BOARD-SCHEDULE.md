# THE SCHEDULE — derived, not typed (as of 2026-09-18)

Written by tools/board.mjs from docs/desk/BOARD-PLAN.json, baseline v3. Every date here falls out of gate durations, predecessors, the fixed events and the launch walls: a forward pass gives "can start" and the forecast, a backward pass gives "needed by", and float is the gap. Change a duration or a predecessor in the plan and the dates move; nobody edits a date.

## What is asked of Mike, as windows

Nothing is wanted from him before "can start" (the pilot on stand-ins comes first) and nothing is late until "needed by". An ask is one sitting's worth.

```
can start 10-10  needed by 10-09   -3d float   built: Buffer connected (the key, the channels)
can start 09-20  needed by 10-11   20d float   his real material in: The daily Q&A line
can start 09-20  needed by 10-11   21d float   pitch ruled: 23 things (Starting, The monitor at rest, ...)
can start 09-27  needed by 10-11   14d float   the shape pointed at, from a range: The feature-page template, The prologue, The reel's landing (deep link to the day's room)
can start 09-18  needed by 10-15    0d float   done: The real unit flashed and verified
can start 09-18  needed by 10-18   21d float   pointed at, from a palette: The beat under the reels: a palette he can play, then one, The launch run of show: what posts each day from the door (10-30) through the Number's first run, and where each lands
can start 09-18  needed by 10-18   21d float   the look pointed at, from a range: The sexy-shoot reel
can start 09-18  needed by 10-18   21d float   the shape pointed at, from a range: The song's page on /wb, and the caption line that points at it
can start 09-19  needed by 10-18   28d float   done: fifteen minutes: The shoot's pilot: one item through the grammar and the element takes
can start 09-20  needed by 10-18   28d float   pitch ruled: MGK-NIAC, the twenty
can start 09-23  needed by 10-21   27d float   shot: The Everyman
can start 09-23  needed by 10-21   27d float   shot: The CEO
can start 09-23  needed by 10-21   27d float   shot: The Informer
can start 10-04  needed by 10-21   16d float   shot: The Gambler
can start 09-30  needed by 10-22   21d float   his real material in: The sexy-shoot reel
can start 09-18  needed by 10-23   34d float   delivered: Words: the prologue's opening
can start 09-18  needed by 10-24   35d float   delivered: Words: About the Artist
can start 09-18  needed by 10-25   28d float   the look pointed at, from a range: The ask reel on MGK-NIAC
can start 09-18  needed by 10-25   36d float   his real material in: The ask reel on MGK-NIAC
can start 09-28  needed by 10-25   21d float   ruled: The Everyman, The CEO, The Informer
can start 10-09  needed by 10-25   14d float   ruled: The Gambler
can start 10-14  needed by 10-25   -3d float   launch volume in hand: The daily Q&A line
can start 10-22  needed by 10-29    0d float   held: The deploy for the door (it carries the song's page too)
can start 09-20  needed by 11-01   42d float   the look pointed at, from a range: Coconuts, the first run
can start 10-20  needed by 11-06   14d float   launch volume in hand: Coconuts, the first run
```

## The same, levelled: weeks that fit (one sitting of up to 6 items, 2 other asks)

Ops' suggestion, not a commitment: each ask sits in the earliest week with room inside its window. His own calendar rows move only by his word.

```
WEEK OF 09-14
  the Sunday sitting, 09-20: point at or rule
    - pitch ruled: 23 things (Starting, The monitor at rest, ...)
    - pitch ruled: MGK-NIAC, the twenty
    - the look pointed at, from a range: Coconuts, the first run
  his real material in: The daily Q&A line   (any day to 10-11)
  done: fifteen minutes: The shoot's pilot: one item through the grammar and the element takes   (any day to 10-18)
WEEK OF 09-21
  the Sunday sitting, 09-27: point at or rule
    - the shape pointed at, from a range: The feature-page template, The prologue, The reel's landing (deep link to the day's room)
    - pointed at, from a palette: The beat under the reels: a palette he can play, then one, The launch run of show: what posts each day from the door (10-30) through the Number's first run, and where each lands
    - the look pointed at, from a range: The sexy-shoot reel
    - the shape pointed at, from a range: The song's page on /wb, and the caption line that points at it
    - the look pointed at, from a range: The ask reel on MGK-NIAC
  shot: The Everyman   (any day to 10-21)
  shot: The CEO   (any day to 10-21)
WEEK OF 09-28
  the Sunday sitting, 10-04: point at or rule
    - ruled: The Everyman, The CEO, The Informer
  shot: The Informer   (any day to 10-21)
  shot: The Gambler   (any day to 10-21)
WEEK OF 10-05
  the Sunday sitting, 10-11: point at or rule
    - ruled: The Gambler
  built: Buffer connected (the key, the channels)   (any day to 10-09)
  his real material in: The sexy-shoot reel   (any day to 10-22)
WEEK OF 10-12
  done: The real unit flashed and verified   (fixed, 10-15)
  delivered: Words: the prologue's opening   (any day to 10-23)
  delivered: Words: About the Artist   (any day to 10-24)
  launch volume in hand: The daily Q&A line   (a run, from here to 10-25)
WEEK OF 10-19
  his real material in: The ask reel on MGK-NIAC   (any day to 10-25)
  launch volume in hand: Coconuts, the first run   (a run, from here to 11-06)
WEEK OF 10-26
  held: The deploy for the door (it carries the song's page too)   (fixed, 10-29)
```

## The critical path: every open gate with three days of float or less, in forecast order

```
forecast 10-12  needed 10-09   -3d  Mike  built: Buffer connected (the key, the channels)
forecast 10-13  needed 10-10   -3d  Ops   proven once for real: Buffer connected (the key, the channels)
forecast 10-14  needed 10-11   -3d  Ops   one real post through the queue: The daily Q&A line
forecast 10-15  needed 10-15    0d  Mike  done: The real unit flashed and verified
forecast 10-22  needed 10-22    0d  Ops   held: The opening-day rehearsal (no stand-in survives it)
forecast 10-22  needed 10-25    3d  Ops   passed the rehearsal: 6 things (The album template, proven on stand-ins, The feature-page template, ...)
forecast 10-28  needed 10-25   -3d  Mike  launch volume in hand: The daily Q&A line
forecast 10-29  needed 10-29    0d  Mike  held: The deploy for the door (it carries the song's page too)
```

## Every open gate, by the week it is needed

### Week of 10-05: Mike 4 asks · Ops 2

```
10-09  Mike  built: Buffer connected (the key, the channels)   [can start 10-10, float -3d]
10-10  Ops   proven once for real: Buffer connected (the key, the channels)   [can start 10-12, float -3d]
10-11  Mike  his real material in: The daily Q&A line   [can start 09-20, float 20d]
10-11  Mike  the shape pointed at, from a range: The feature-page template, The prologue, The reel's landing (deep link to the day's room)   [can start 09-27, float 14d]
10-11  Mike  pitch ruled: 23 things (Starting, The monitor at rest, ...)   [can start 09-20, float 21d]
10-11  Ops   one real post through the queue: The daily Q&A line   [can start 10-13, float -3d]
```

### Week of 10-12: Mike 6 asks · Ops 3

```
10-15  Mike  done: The real unit flashed and verified   [can start 09-18, float 0d]
10-17  Ops   scripted: The shoot's pilot: one item through the grammar and the element takes   [can start 09-18, float 28d]
10-17  Ops   built: The photo line's white treatment, proven on frames in hand   [can start 09-18, float 27d]
10-18  Mike  pointed at, from a palette: The beat under the reels: a palette he can play, then one, The launch run of show: what posts each day from the door (10-30) through the Number's first run, and where each lands   [can start 09-18, float 21d]
10-18  Mike  the look pointed at, from a range: The sexy-shoot reel   [can start 09-18, float 21d]
10-18  Mike  done: fifteen minutes: The shoot's pilot: one item through the grammar and the element takes   [can start 09-19, float 28d]
10-18  Mike  the shape pointed at, from a range: The song's page on /wb, and the caption line that points at it   [can start 09-18, float 21d]
10-18  Mike  pitch ruled: MGK-NIAC, the twenty   [can start 09-20, float 28d]
10-18  Ops   proven once for real: The photo line's white treatment, proven on frames in hand   [can start 09-20, float 27d]
```

### Week of 10-19: Mike 8 asks · Ops 24

```
10-20  Ops   through the line: The shoot's pilot: one item through the grammar and the element takes   [can start 09-21, float 27d]
10-20  Ops   one built on stand-ins: 4 things (The feature-page template, The prologue, ...)   [can start 09-27, float 20d]
10-21  Mike  shot: 4 things (The Everyman, The Gambler, ...)   [can start 09-23, float 27d]
10-21  Ops   one through the whole pipe on stand-ins: The sexy-shoot reel   [can start 09-27, float 21d]
10-21  Ops   final on the twin: 23 things (Starting, The monitor at rest, ...)   [can start 09-20, float 26d]
10-22  Mike  his real material in: The sexy-shoot reel   [can start 09-30, float 21d]
10-22  Ops   one real post through the queue: The sexy-shoot reel   [can start 10-13, float 8d]
10-22  Ops   done: The twin at full software, served   [can start 09-18, float 32d]
10-22  Ops   planned on paper: The opening-day rehearsal (no stand-in survives it)   [can start 09-18, float 33d]
10-22  Ops   held: The opening-day rehearsal (no stand-in survives it)   [can start 09-19, float 0d]
10-23  Mike  delivered: Words: the prologue's opening   [can start 09-18, float 34d]
10-23  Ops   photographs through the line: 4 things (The Everyman, The Gambler, ...)   [can start 09-24, float 27d]
10-23  Ops   built for real: The album template, proven on stand-ins   [can start 09-18, float 31d]
10-24  Mike  delivered: Words: About the Artist   [can start 09-18, float 35d]
10-24  Ops   built for real: 5 things (The feature-page template, The prologue, ...)   [can start 09-30, float 20d]
10-24  Ops   one built on stand-ins: The song's page on /wb, and the caption line that points at it   [can start 09-27, float 24d]
10-24  Ops   placed: Words: the prologue's opening   [can start 09-19, float 34d]
10-25  Mike  launch volume in hand: The daily Q&A line   [can start 10-14, float -3d]
10-25  Mike  the look pointed at, from a range: The ask reel on MGK-NIAC   [can start 09-18, float 28d]
10-25  Mike  his real material in: The ask reel on MGK-NIAC   [can start 09-18, float 36d]
10-25  Mike  ruled: 4 things (The Everyman, The Gambler, ...)   [can start 09-28, float 21d]
10-25  Ops   one real post through the queue: The hot Q&A lane, The ask reel on MGK-NIAC   [can start 10-13, float 11d]
10-25  Ops   built in: The beat under the reels: a palette he can play, then one, The launch run of show: what posts each day from the door (10-30) through the Number's first run, and where each lands   [can start 09-27, float 26d]
10-25  Ops   launch volume in hand: The sexy-shoot reel   [can start 10-14, float 8d]
10-25  Ops   the real photographs in the album: 4 things (The Everyman, The Gambler, ...)   [can start 09-26, float 27d]
10-25  Ops   in the launch build: 6 things (The album template, proven on stand-ins, The feature-page template, ...)   [can start 09-22, float 32d]
10-25  Ops   passed the rehearsal: 6 things (The album template, proven on stand-ins, The feature-page template, ...)   [can start 10-22, float 3d]
10-25  Ops   placed: Words: About the Artist   [can start 09-19, float 35d]
10-25  Ops   verified against the audit: The twin at full software, served, The real unit flashed and verified   [can start 09-20, float 32d]
10-25  Ops   ran unattended a week: The morning run, The board and the Sunday exception sitting   [can start 09-18, float 30d]
10-25  Ops   its page live in development: 24 things (Starting, The monitor at rest, ...)   [can start 09-30, float 22d]
10-25  Ops   proven on the real unit: 24 things (Starting, The monitor at rest, ...)   [can start 10-15, float 6d]
```

### Week of 10-26: Mike 2 asks · Ops 4

```
10-28  Ops   built for real: The song's page on /wb, and the caption line that points at it   [can start 09-30, float 24d]
10-29  Mike  held: The deploy for the door (it carries the song's page too)   [can start 10-22, float 0d]
10-29  Ops   in the launch build: The song's page on /wb, and the caption line that points at it   [can start 10-04, float 24d]
10-29  Ops   passed the rehearsal: The song's page on /wb, and the caption line that points at it   [can start 10-22, float 7d]
10-29  Ops   planned on paper: The deploy for the door (it carries the song's page too)   [can start 09-18, float 40d]
11-01  Mike  the look pointed at, from a range: Coconuts, the first run   [can start 09-20, float 42d]
```

### Week of 11-02: Mike 1 ask · Ops 2

```
11-02  Ops   one through the whole pipe on stand-ins: Coconuts, the first run   [can start 09-20, float 42d]
11-03  Ops   one real post through the queue: Coconuts, the first run   [can start 10-13, float 20d]
11-06  Mike  launch volume in hand: Coconuts, the first run   [can start 10-20, float 14d]
```
