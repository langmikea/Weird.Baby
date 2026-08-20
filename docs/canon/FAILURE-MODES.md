# THE FOUR FAILURE MODES — recorded, and checked against the machine

> **Mike's ask (A++): the Portal should fail in a way that reflects WHICH switch
> is wrong. Not a clue — theatre.**

**NOTHING IS BUILT HERE AND NOTHING IS PROPOSED AS A DESIGN.** This page does
three things: it records Ops' reading of the four; it reports what the twin can
express today, measured against the file; and it names what each one would cost.

---

## 1 · THE FOUR, AS READ
<a id="the-four"></a>

**Ops' reading, recorded for Mike to rule on.**

| switch | wrong | what happens | the tell |
|---|---|---|---|
| **PARITY** | ODD where the far end is EVEN | Every character arrives. Every character fails its check. | **Data flowing, none trusted.** |
| **DUPLEX** | HALF where the far end is FULL | The near end echoes what it sends, and the far end echoes it back. | **Everything doubles.** |
| **WORD** | 8 BIT where the far end sends 7 | The receiver reads the parity bit as data. | **Every character shifted — consistently garbled, not randomly.** |
| **STOP** | 2 where the far end sends 1 | Framing error: the receiver looks for a stop bit, finds the next start bit, loses sync. | **Noise after the first character.** |

**THE FOUR ARE DISTINGUISHABLE BY EYE AND NONE OF THEM IS A LABEL.** That is the
whole of the idea: a person watching learns which switch is wrong from what the
glass does, and the machine never says a word about it.

**AND THE MANUAL ALREADY FORBIDS THE WORD**, which is what makes theatre the only
honest route:

> *"A disagreement in any one of the four is reported as a parity bias setting
> mismatch. The report names the condition and **does not name the setting at
> fault, there being no means at this end of knowing which of them is wrong.**"*
> — `BODY_B_1`, written, published as `scan-31-a.webp`

The instrument may not name the fault. **It may still behave differently.** The
theatre is not a loophole in that sentence — it is the only thing the sentence
leaves.

---

## 2 · WHAT THE TWIN CAN EXPRESS TODAY
<a id="what-the-twin-can-do"></a>

**Measured against `robots:tools/viiip_twin.html`, 10,802 lines.**

### 2.1 · The headline: none of it exists

**There is no communications-settings machinery in the twin at all.** The strings
`parity`, `duplex`, `stop bit`, `7 BIT`, `8 BIT`, `far end` and `Bell` return
**zero matches** in the whole file outside three unrelated comments about a
display-rate mismatch and a rasterizer bug.

Concretely, all of the following are absent:

- no PARITY / DUPLEX / WORD / STOP state, in any form;
- no far-end model, no far-end identity, no far-end anything;
- **no video link.** The manual's SP 7-14 subsystem is not built;
- no link-failure path of any kind, and no failure state that persists.

### 2.2 · The nearest existing thing is a different link

`monConn` is the twin's only link-shaped state, and it is a **download**
connection, not the video link:

- `Mon_StartConnection(records)` sets it; it steps through `MON_SET4` and clears
  itself (`viiip_twin.html:2666-2680`);
- while it is up, the graph window's SIGNAL is real and rides it (`:2738-2745`) —
  **which is exactly what SP 7-14 says signal does, for the wrong link**;
- the DOS window's `SYNC` command reports `LINK UP` or `NO LINK` off it
  (`:2789`).

**So the twin already has: a link that can be up or down, a signal graph fed by
it, and a status line that reports it.** It is pointed at downloads. Nothing
about it is parity-aware, and it has no failure state — it steps forward and
finishes.

### 2.3 · The F/T dance is a handshake that cannot fail
<a id="cannot-fail"></a>

`FT_Dance()` (`:8682-8783`) is the closest thing in the building to a link coming
up, and it is **authored to always succeed.** `FT_Seg_Plan()` (`:8669-8679`)
guarantees the shape every run: six segments, **exactly one stalls and resumes,
exactly one fails and is retried**, the last is always slow. Which segment does
which is drawn from the seed. **Every path recovers.** There is no branch in
which the two machines fail to agree.

Its Act 1 is a near miss and is worth naming because it is the existing idiom for
*nobody answered*: F calls `AUX CHANNEL OPEN 300 BAUD` into the dark, waits, gets
`T_Hiss(1100,"no answer")`, waits again, calls again — and then T stirs.

### 2.4 · The primitives that DO exist, and what each is good for

| primitive | where | what it can carry |
|---|---|---|
| `printText(row,col,text)` → `OLED.print` | `:2248` | Per-character rendering through a real GFX shim. **A string transformed before printing costs nothing.** |
| `T_Push(line)` / `T_Draw()` | `:8528`, `:8530` | T's log — five visible lines, whole strings pushed by the author. |
| `T_Says(line,hold,punct)` | `:8586` | One log line, with a beat and a hum blip. |
| `F_Says(action,pct,punct)` | `:8514` | F's install face — one action string and a percentage. |
| `T_Hiss(ms,label)` | `:8593` | *"the empty line: static, nothing"* — picture and sound together. |
| `Flick_Static(ms,withSound)` | `:2943` | The static generator itself. |
| `Glitch_Punctuate(screen,strength)` | `:9536` | An invert snap **or** a 6–16px horizontal band slipped 5px. **Whole-screen, not per-character.** |
| `Static_Voice_Enter/Leave/Kill` | `:1600-1622` | Holds the static voice for as long as the picture is up (THE STATIC-SOUND LAW). |
| `Hum_Strain()` / `Hum_Blip()` / `Hum_Swell()` | `:1738-1767` | *Something is not going well*, as a bed rather than a beep. |
| `PORTAL_RECIPES` | `:10459` | **Named state deltas as DATA.** Knobs today: `power`, `level`, `replay`, `day`, `dev`, `resume`. An unknown id is chipped and ignored. |
| `chip(kind,html)` | `:1512` | The dev rail's own reporting channel. |

### 2.5 · On the museum side

`museum:src/data/artists/portal.js` has a **refusal** mechanism and no failure
mechanism. A drum position, a switch or the dial carries `arms` / `armsWhen`; a
position that will not arm carries a `why` (printed under the latch) and a switch
carries a `held`. The latch reads `FEED ARMED` or `NOT ARMED`.

**That is a machine declining to open a door. It is not a machine opening a door
onto a broken link**, which is what all four of these are.

**And Record 005 — written, committed, posting at 17:00 on 2026-08-21 — says the
mismatch happens:**

```
  > The launch controls are intuitive looking, but the system fails to boot.
  > Error: Communications Parity Bias Setting Mismatch
  > Four toggles. Sixteen combinations. One of them is correct.
```

**That is prose in the Record. Nothing in either repo produces that state.**

---

## 3 · WHAT EACH WOULD COST
<a id="costs"></a>

**Ranked by cost, cheapest first.** Every estimate names the thing it depends on,
so a wrong estimate can be found.

### 3.1 · DUPLEX — the cheapest by a wide margin

**It is a string transform applied before print, and nothing else.**

Half-duplex local echo against a full-duplex far end is what genuinely produces
`HHEELLLLOO` on a real terminal — it is the classic period tell and the most
legible of the four to somebody who knows nothing about serial links.

- **Render:** double each character in the string handed to `T_Push` /
  `T_Says` / `printText`. No new drawing, no font work, no layout change.
- **Model:** none, if the far end's traffic is authored. The doubling does not
  need a receive path — it needs text going past.
- **Sound:** already right. `Hum_Blip` fires per line and would fire twice.
- **Risk:** line length. T's log fits five rows through `Fit_Row`, which budgets;
  a doubled line overflows and the existing fitter will truncate rather than
  wrap. **Legibility of a doubled line at 128px is a measurement nobody has
  taken.**

### 3.2 · STOP — two existing calls in sequence

*Noise after the first character* is, in the twin's own vocabulary: print one
character, then `T_Hiss`.

- **Render:** `printText` a single glyph, then `Play_Frames(Flick_Static(...))`
  on the same glass. Both exist.
- **Sound:** already exactly right — `Static_Voice_Enter` holds the voice for the
  length of the picture, which is what THE STATIC-SOUND LAW was written for.
- **Model:** none, for a single beat. Sustaining it (*the link is up and has been
  producing noise for a minute*) needs somewhere for the state to live, which is
  §3.5.
- **Risk:** it looks like the existing `T_Hiss` beat in Act 1 of the dance, which
  means *nobody answered*. **Two different meanings on one picture** — and the
  manual is explicit that they are not the same thing: *"Absence of signal is not
  in itself a fault; a far end that is not answering is not a far end that is not
  there."* The static would have to be distinguishable from silence, or the two
  readings collide.

### 3.3 · WORD — deterministic, and it hides a font problem

*Every character shifted, consistently garbled* is a fixed mapping, which is the
easiest kind to author and the easiest kind to verify.

- **Model:** a lookup or a bit operation. Trivial.
- **THE COST NOBODY WOULD ESTIMATE: the glyphs may not exist.** The twin's three
  faces are `FONT_TT` (TomThumb), the built-in `CLASSIC` 6×8, and `FONT_FS`
  (FreeSansBold). Their glyph tables are bitmap ranges cut for printable ASCII.
  **A garble that maps a character above 0x7F has nowhere to land**, and what a
  missing glyph draws is whatever the shim does at the end of its table — a
  blank, a repeat, or an index error. So the garble must either be **mapped back
  into the printable range** (a design choice: which wrong letter does `E`
  become?) or **the fonts must gain a high half** (real work, and it is asset
  work, not code).
- **And the mapping is a taste decision.** *Consistently garbled* is only legible
  as WORD-wrong if a reader can see that it is consistent — the same input letter
  always giving the same wrong letter. That is a property of the mapping, not of
  the render.

### 3.4 · PARITY — the render is cheap and the model is the whole cost

*Data flowing, none trusted* has no existing analogue anywhere in the twin,
because the twin has no notion of a check on anything it draws.

- **Render:** available. A character printed and then struck — `printText` the
  glyph, then a `drawLine` or a `fillRect` at the cell, or `invertDisplay` per
  region. The GFX shim can do it.
- **Model: this one needs a receive path.** The other three can be authored as
  theatre over text that is already going past. *Every character fails its check*
  requires the machine to be **checking**, which means there has to be a thing
  arriving with a check on it. **The twin has no receive path at all.** That is
  the video link ([H-04](HOLES.md#h-04), [H-03](HOLES.md#h-03)) and it is not
  built.
- **It is also the mode that most nearly IS the manual's sentence**: the
  instrument holds its peace while data flows. **Which means it is the most
  faithful of the four and the most expensive.**

### 3.5 · THE COST ALL FOUR SHARE — where does the state live
<a id="where-state-lives"></a>

**A failure mode needs something to be wrong.** Three candidates, and one is
obviously cheapest:

| where | cost | note |
|---|---|---|
| **`PORTAL_RECIPES`** | Four new knobs and four branches in `Portal_Preset_Apply` | It is already **data**, it already carries named deltas, and Mike's own ruling on it is *"Recipes are DATA, so Mike can direct new ones in plain language."* The latch already puts `preset` in the URL. **Cheapest and already the museum's dispatch route.** |
| **The live menu** | A new menu table, four rows, four parameter rows | **And it may be wrong in-story.** B-1 says the values *"are entered on the installation record at the time the link is made"*, not set from the front panel. A menu row would contradict a published page. |
| **A physical control on the Portal panel** | Four positions on the museum-side panel | This is the object Record 005 describes — *"Four toggle switches sit under a hinged guard, unlabelled"* (Record 004, the bench, **published**) and *"Four toggles. Sixteen combinations."* (Record 005, **published**). **The story has already put the switches at the far end's bench, not on the instrument.** |

**THE THIRD ROW IS THE FINDING.** Two published Records place four unlabelled
toggles under a hinged guard **on the far end's console**, not on the MGK-VIIIp.
So the person setting them, in the story as published, is at the bench — which is
where the twin's user is. That is not a cost; it is a constraint that is already
decided and that a design would otherwise have to guess at.

---

## 4 · THE THREE LAWS THAT BEAR ON THIS
<a id="laws-that-bear"></a>

**Read these before designing anything, because two of them can kill a design
that is otherwise finished.**

### 4.1 · THE NO-DEAD-WOOD LAW — and it is the big one

> **"NO fake reports anywhere unless Mike specifically asks** — every claim the
> monitor/machine makes must be REAL machine truth; story-fakes only ever by
> explicit Papa direction."
> — canon, Mike, 2026-07-22 (`robots:STATE.md`; `STORY_BIBLE.html` ch. VIII).
> `TEST` is the one exemption, and it is Papa-placed.

**A garble that is not driven by a real setting mismatch is a fake report.** So
either the four settings become **real state** that the render reads, or the
theatre needs Mike's explicit direction to be staged.

**This is not an obstacle to the idea — the idea already satisfies it.** Mike is
asking for the failure to *reflect which switch is wrong*, which is the law
stated forward: the picture is true because the switch is really wrong. It is
recorded here because a cheaper implementation — a canned animation on a timer —
would break a standing law, and would look identical in a screenshot.

### 4.2 · FT8, THE GLITCH LAW — do not build this on the glitch layer

> *"Subtle tier only. Deterministic punctuation, not noise."* — 14 wired sites.

`Glitch_Punctuate` is **punctuation at a change of act**, and it is capped there
on purpose. A sustained garble built on it inherits the subtle-tier ceiling and
the ambient rate, and it would make every act transition in the boot read as a
link fault. **These four are a different animal and want their own machinery.**

### 4.3 · FT3, STATE-WORDS — and it does not bite here

> *Machine self-description never asserts checkable specifics.*

None of the four asserts anything. They are **behaviour, not statement**, which
is precisely why they clear FT3 where an error message naming a setting would
not. **The theatre is the FT3-safe route**, and that is worth writing down: the
constraint that would block a message does not block a picture.

---

## 5 · WHAT IS NOT KNOWN
<a id="not-known"></a>

- **Which end is "wrong".** All four modes above assume the near end is the one
  mis-set. The manual's own position is that there is **no means at this end of
  knowing which of them is wrong** — which is a statement about blame, not about
  the physics, and the physics is symmetric.
- **Whether a wrong setting produces a link at all.** B-1 says *"The link opens
  only where the communications settings of Appendix B agree"* and *"the
  instrument does not open the link."* **Read strictly, a mismatch means no link
  and therefore nothing to garble** — the theatre would have to happen at the far
  end's console, which is where the published toggles are. Read loosely, the
  instrument attempts and fails visibly. **The two readings produce two different
  builds and nobody has ruled.**
- **What the far end shows when the near end is wrong.** Absent
  ([H-03](HOLES.md#h-03)).
- **Whether these are one-shot or sustained.** A beat and a condition are
  different builds.
