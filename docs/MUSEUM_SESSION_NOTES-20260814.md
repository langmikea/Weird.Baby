# MIKE'S SESSION NOTES — 14 AUGUST 2026

**THE SHORTS SPEC · THE EGG AUDIT · THE OPS DESK QUALITY BOX**

Filed 2026-08-15. **§1 is Mike's text, carried verbatim — no editing, no
smoothing, no reordering.** Everything under §2 is Ops' and is marked as such.

**NOTHING IN HERE WAS BUILT.** It was recorded, on his instruction, because it
existed only in chat. Film A is on **HOLD** — do not render (§2.1).

---

## §1 — THE NOTES, VERBATIM

> SHORTS. Two films: A = the portal monitor, B = a freestanding
> unit on a clean bench (B waits on bench plates). Plus a smash-up
> of the two. ONE RECIPE, SIX DATA FILES — identical objects,
> identical motions, identical line counts; only the strings
> change. First and last frame are the SAME frame, not adjacent,
> so the loop is invisible. The hard cut is declared vocabulary
> (`cut: black, frames: 2`), usable anywhere including before
> frame one. Local ffmpeg only; output never touches Cloudflare.
>
> FILM A STRUCTURE, ~28s, 1080x1920:

```
00.0 logo, white, full frame, dead still, 0.5s
00.5 hard cut, two frames black
00.6 handheld cross-pan across the portal bezel, screen off-axis
02.2 snap cut, hard jaggy horizontal tear, timing signal visible
02.4 dead-on tight on the screen, top and bottom edges just in
     frame; boot text begins
04.0-18.0 the monitor sequence; camera moves ON the glass, never
     cuts away
18.0 somebody's coming; hand jerks; frame leaves the screen
19.0 snap/snap/snap, three hard cuts back, each tighter
20.5 flashbang
21.0 logo, same frame as 00.0, hold
```

> THREE DATA FILES FOR FILM A:

```
A1 COLD START
  MGK-VIIIp   CH 3   STANDARD
  BIST . . . . . . . . . . no deviations
  f(Ump) = 100%
  carrier      present
  packets      3.1.4 / sec
  source       —
  [snap] source — / source — / source still —

A2 SECOND PASS  (f(Ump) line REMOVED; uptime 100% added at the
  bottom where it used to be at the top; everything else A1)
  MGK-VIIIp   CH 3   STANDARD
  BIST . . . . . . . . . . no deviations
  carrier      present
  packets      3.1.4 / sec
  source       —
  uptime       100%
  [snap] source — / source — / source still —

A3 THE ONE THAT ANSWERS  (A1 exactly, one word changed on the
  last frame before the flashbang)
  [snap] source — / source — / source ACKNOWLEDGED
```

> 314 is the packet rate in all three. f(Ump) in two of three.
>
> EGG AUDIT. It RECORDS, it does not REQUIRE — a gate would kill
> the eggs, because 314's meaning is in where it stops appearing
> and f(Ump)'s effect is bursts and droughts. One row per short:
> which eggs are in, which were considered and deliberately left
> out, who ruled. A log, not a lock.
>
> TRIPLE LOOP. Same short three times, the fourth pass different.
> The payload is the fourth pass; everything before it is patience
> being tested.
>
> A/B AND THE NINE-VARIANT. Two cuts of the same film, one with
> the egg. On the robots site, served per visit, so the same
> person gets a different film session to session. Nine-variant
> is the same idea turned up: one in nine is a rumour, not a
> discovery. In the drawer.
>
> OPS DESK QUALITY BOX. One box, three states. Green = clean.
> Yellow = things happened, contained, look when you like. Red =
> a problem, and Mike should already know before he sees the box.
> Needs a DURABLE REMINDER so the data is not collected and
> abandoned. Trends are pulled on request by Ops, not built as a
> dashboard.
>
> STANDING INSTRUCTION: consider the audit's application across
> other work. CONSIDER, not apply.

---

## §2 — OPS' NOTES ON THE FILING

**These are Ops' sentences and none of them is his.** They are kept apart from
§1 for the reason the three-marks rule gives: his own sentence left in Ops'
voice gets quietly "improved" by the next round, and an Ops paraphrase filed as
his is indistinguishable from something he said a week later.

### 2.1 — WHAT IS ON HOLD

**FILM A IS HOLD. DO NOT RENDER.** His instruction of 2026-08-15, given with
these notes: *"Film A: HOLD. Do not render today. Mike is writing."* Nothing in
§1 was built, scaffolded, or turned into a tool. No data file was written, no
ffmpeg was run, no recipe exists on disk.

**"IN THE DRAWER" IS HIS OWN WORD FOR THE NINE-VARIANT** and is carried as
written rather than converted into an open row. The triple loop and the A/B
carry no instruction to build either.

### 2.2 — WHAT THIS FILING DELIBERATELY DOES NOT DO

**IT DOES NOT APPLY THE STANDING INSTRUCTION.** His last line is *"consider the
audit's application across other work. CONSIDER, not apply."* Recording it is
the whole of the action taken. Nothing elsewhere in the museum was changed,
audited, or gated on the strength of it.

**IT INVENTS NO MECHANISM FOR THE QUALITY BOX.** He named one box, three states
and a durable reminder; how the reminder is made durable is not in the notes and
is not guessed here. Same for the egg audit's row shape beyond the four things
he names (which eggs are in, which were left out and deliberately, who ruled).

### 2.3 — WHAT REMAINS OPEN AND IS HIS

- **`W-a`** — `/wb`'s About the Artist copy. His words. Unchanged.
- **`W-b`** — `How to contact?`. An address, or his word that there will not be
  one. Unchanged; still collides with his 2026-08-11 ruling.

Neither was touched by this filing.
