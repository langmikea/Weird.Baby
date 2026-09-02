# v52 — THE REVEAL LEDGER · round log · 2026-08-05

**Lane:** drafting, autonomous, single agent. Mike off for the morning.
**Sealed:** all gates green. Register updated per Doctrine 14.
**The audit is the round's other deliverable:** `docs/REVEAL_LEDGER_AUDIT.md`.

---

## Q1 — THE GUEST BOOK WENT BLANK, AND THE ARITHMETIC WAS NEVER THE FAULT

Mike saw it empty out on the live site. The instruction guessed the cause —
*"the stepped advance almost certainly runs past the end of the list, or the
wrap arithmetic is off by the page size"* — and the first half is right about
the SYMPTOM and wrong about the MECHANISM, which is worth saying because the
wrong mechanism would have produced a fix that did not hold.

**The arithmetic was correct for every list length it could reach.** With n=6
and a page stride of 3 the offset runs 0 → 3 → 6, wraps at 6, and the lowest row
on screen is 8 against 12 available. It never overruns. I simulated it before
touching anything, and the steady state is clean.

**The fault is that the advance and the wrap ran on two different clocks, and
only one of them stops when the page stops being rendered.**

- The advance was a `setTimeout`.
- The wrap was a `transitionend`.

A hidden browser tab **throttles timers but suspends rendering**. So the
timeouts keep firing and adding to the offset; no frames are produced, so no
transition completes, so no `transitionend` ever arrives to subtract a copy back
off. Ten minutes in a background tab walks the offset hundreds of rows past the
end of a twelve-row track. Coming back, it recovers at one net copy per step —
minutes of empty box.

### The fix does not depend on any event arriving

A scheduling bug fixed by better scheduling is a scheduling bug with a longer
fuse. Two guarantees, both properties of the RENDER:

1. **The offset is clamped where it is used.** `offset = min(max(pos, 0), n)`.
   No accumulated state can move the track more than one whole copy, whatever
   the timers did while nobody was watching.
2. **The track is long enough for that clamp by construction.** `COPIES` is
   derived rather than fixed at two: the lowest row the window can show is
   `n + VISIBLE − 1`, so the track needs `1 + ceil(VISIBLE / n)` copies. At
   n ≥ 3 that is the two it already had; at n = 2 it is three, at n = 1 four.

**A blank row is now unreachable at any list length**, including lengths shorter
than the window — which `SCROLL_MIN` happens to exclude today and which a future
change to `SCROLL_MIN` must not be able to break.

### Proved, not asserted

An exhaustive simulation of the state machine, n = 1…40, with `transitionend`
and the wrap backstop both adversarially dropped:

```
n= 1 drop=YY copies=4 track=4  worstRow=3 distinctShown=1/1
n= 2 drop=YY copies=3 track=6  worstRow=4 distinctShown=2/2
n= 5 drop=YY copies=2 track=10 worstRow=7 distinctShown=5/5
n= 6 drop=YY copies=2 track=12 worstRow=8 distinctShown=6/6
PASS — no blank reachable, n=1..40, all drop modes.

OLD machine, n=6, transitionend dropped (a hidden tab):
  {"maxRow":119,"trackRows":12,"blankAt":4}
OLD machine, n=6, events delivered:
  {"maxRow":8,"trackRows":12,"blankAt":null}
```

The old machine goes blank at tick 4 and reaches row 119 of a 12-row track. The
new one never leaves the track under any drop mode, and still shows every
signature.

**The scheduling was fixed too**, and now only has to be RIGHT rather than SAFE:
the book pauses while `document.hidden` (the platform's own signal — and a book
nobody is looking at should not be advancing, which is the same reason it stops
under the cursor), and the wrap has a `MOVE_MS + slack` timeout backstop beside
the `transitionend`. Both paths run the same idempotent wrap.

## Q2 — ONE NAME PER BOUNCE

`STEP` is 1. Everything else about the rhythm is untouched, as instructed:
`REST_MS` 5.0s, the `cubic-bezier(.34,1.3,.64,1)` bounce, the 520ms move, the
hover/focus pause, the reduced-motion fallback. Verified in the shipped bundle:
`Zn=5, Qn=3, $n=1, er=5e3, tr=520, nr=260`.

The previous round's argument FOR a page-sized stop is **not** restated in the
code. It was a good argument for a behaviour that is no longer the behaviour,
and a comment defending a decision that has been reversed is a comment that will
mislead the next reader.

## Q3 — THE DOOR READS MGK-NIAC

**The sweep found a question this face was still printing.** The name track's
third entry was stamped OPEN, titled *"Which name goes on the door"*, and carried
`[PAPA] — whether the carousel reads MGK-NIAC or MGK-VIII`. Mike has now
answered it, so the marker is gone and the entry states the decision instead of
asking it. A face that keeps asking after the ruling is a dead control.

**Conformed** — everything that LABELS the machine: album title · cover file
AND the lettering rendered into it · archive subtitle · archive tombstone
Subject row · poster caption · both face footers · the tracklist's first row ·
Welcome's own contents line.

**Not conformed, and this is the whole of it** — every sentence where MGK-VIII
is a FACT OF THE RECORD: *"SOLD AS MGK-VIII — ABEAL's 1965 rebrand"*, *"It was
built as MGK-NIAC and sold as MGK-VIII"*. Conforming those deletes the fact the
rename is DERIVED FROM and leaves the face saying a machine was built as
MGK-NIAC and sold as MGK-NIAC. The rename is a decision about the door; it is
not a claim that the second name never existed.

**Also deliberately not conformed:** `id: "mgk-viii"` and the eleven photographs
under `/robots/reference/mgk-viii/`. The id is a key nothing outside the file
reads and nothing prints; the folder is shared with the robots repo, where
`robots/mgk-viii/plates/` holds the originals. Renaming a directory across two
repositories to conform a string nobody sees is the change with all the risk and
none of the effect.

**The one judgement call, flagged as [M36]:** the rename collided with the
album's own first track, which was already titled MGK-NIAC — the band, the
tracklist's first row and the face's heading would all have read the same words
at once. The track took its own `id`, its own subtitle and its own subject:
**THE NAME**. One edit back if Mike wants it otherwise.

The cover was re-rendered by `tools/make_unit_covers.py` with the model number
changed and the output file renamed. **The VIIIp cover re-rendered
byte-identical**, which is the proof A1's "one theme" claim was a claim about
geometry rather than a hand-match.

---

## R1 — THE INVENTORY, DERIVED WHERE IT COULD BE

Mike's warning was specific: *"the DISPATCHER is truth — the CSVs have lied
twice."* So nothing about the twin was read out of a planning table.

- **The museum's surfaces** — 18 albums, 134 tracks, every face's kind and
  contents — were extracted by script from the four artist data files, not
  transcribed. A transcription of 134 rows is 134 chances to invent one.
- **The twin's apps** were read off `Run_EXE` in `tools/viiip_twin.html`. A row
  is a STUB **exactly when selecting it starts `SCAFFOLD_PROC`**, which is the
  same predicate the twin's own `STUB_ROWS` table mirrors — and the twin's own
  source records why: the scaffold CSV *"still calls Fortune, Horoscope and the
  Advice family scaffold although all of them were built. Stripping menus off
  that data hid three working features."*
- **The games** came from `Game_Init`'s switch: twelve branches, twelve games.
- **The sounds** came from `SOUND_AUDIT-20260726`, where every trigger was fired
  in a live browser and watched at the audio-graph node level.

## R2 — THE TABLE

`reveal/ledger.json` — **151 rows**, authored in `reveal/ledger-declare.mjs`,
validated as it builds.

**`build` and `state` are two axes and conflating them is the first mistake
anyone will make.** `build` is *does it exist*; `state` is *is a visitor meant
to get to it yet*. A thing can be finished and held (`egg.replay` — the sandbox
replay is wired, working and deliberately unexposed) and a thing can be
reachable and half-built (`face.viiip.record` — one entry, live, on the glass).

**`when` is null on all 151 rows and that is Doctrine 12.** Nobody supplied a
schedule; nothing here invents one. The field exists so that the day Mike gives
a date it is a field and not a rebuild. The consequence is stated in the audit
rather than hidden: the *"where do assets cluster on one day"* section is
structurally empty, and the tool says so rather than printing a reassuring zero.

**`shown` is the field that could not be derived** and is the reason §2 of the
audit means anything. It marks where a visitor can READ THE LABEL of something
that is not built — the difference between a gap and a debt. The twin's stub
rows are equally unbuilt and are NOT shown, because THE STUB LAW strips them
from the menus: *"a row that leads to 'not built' is not a destination, it is a
promise, and the menu is not the place to keep promises."*

### How it relates to the asset table, which was the explicit instruction

It is **not a rival and it restates nothing**. The asset table is one row per
FILE and stays the authority on files — no byte count, dimension, quality read
or verdict appears in the ledger. The ledger is one row per REVEALABLE THING,
and most of its rows are not files at all: a function, a menu row, a state, a
decision. They meet at `assets: [uid]`, and `ledger-declare.mjs` **fails at
build time** if a ref is not in the asset table, so a ledger row cannot quietly
reference a picture the museum does not hold.

Four instruments now, and the boundary is stated in `reveal/README.md` §2
because a fourth register with no stated boundary becomes a rival within a
round: register = a string · asset table = a file · OPEN_ACTIONS = an open item
· ledger = a revealable thing.

## R3 — C32, AND IT CAUGHT THE CASE THAT RAISED IT

**The choice Mike left open (content hash, stable id, or both): BOTH, and a
third thing that matters more than either.**

1. **`uid`** — minted once, never rewritten. It is the row's NAME; `id`
   (repo:path) is demoted to an ADDRESS. Judgements hang off the name.
2. **`sha256`** — measured every scan. A prior row and a new file sharing a hash
   inside one repo are the same file MOVED: the scan carries the judgement and
   the uid across and reports it.
3. **And where neither can answer, it refuses to guess and says so loudly.** A
   rename that ALSO re-renders the file — the ordinary case, because the name is
   usually IN the picture — changes the path and the hash at once, and no keying
   can infer that. So a judged row whose file has left the disk is reported under
   its own banner, and `--rename` is the explicit human declaration that moves
   the judgement.

**The silence was the defect. A hash only makes it rarer.**

The first run reported **two** orphans, not one:

```
  !! JUDGED ROWS WHOSE FILE IS GONE (2) — C32.
       public/images/wal/jesse-welles-plate.jpg   verdict=null quality=usable
       public/robots/art/mgk-viii-cover.png       verdict=null quality=usable
```

The first is **C14's own rename from v51**, still stranded a round later — the
exact case that raised C32, caught retroactively by the fix for it. Both carried
across with `--rename`; 255 rows → 253, no orphans left.

`--rename` also handles a target that already carries a judgement (which is what
A7 left behind): the target's reading wins, the orphan fills only the nulls, and
which way it landed is printed.

## R4 — THE AUDIT

`docs/REVEAL_LEDGER_AUDIT.md`, **generated** by `npm run reveal:audit` rather
than typed, so it can be re-run instead of believed.

The findings that matter:

- **Six of the eleven promises are one object.** The Portal's drum has six
  engraved feeds and five will not arm. Largest concentration of
  unbuilt-but-visible surface in the museum — and, read the other way, **the
  largest concentration of reveal levers**, because each is a boolean and a
  feed. [M33]
- **The back shelf is four eggs and two sounds**, not documents. All six are
  built and all six wait on a sentence rather than on work. Three of the four
  eggs are on the same trigger family (`ask_count_20 / 40 / 60`) — **they are
  already a sequence and nobody has decided it is one.**
- **`doc.manual.plates` is the only two-consumer bottleneck** in the table. Two
  live faces name plates the museum does not hold; one photograph session (P2)
  resolves both.
- **55 of 58 dependency chains terminate outside the table** — in a person, a
  ruling, a camera. That is the third independent instrument in four rounds to
  say the same thing, and the tool does not report it as a fault: *the museum is
  not blocked on code.*
- **Twelve games run in the twin and none runs on the unit.** [M34]

## R5 — ONE CONSUMER, AND WHY THAT ONE

`/foundation`'s LIVE / NOT BUILT column. It is literally hard-coded
availability — five rows typed into a file — on the one page in the building
whose entire argument is that the state must be TRUE. Mike's own constraint for
that room was that nothing may claim a mechanism that isn't built, and the column
exists so the tense cannot be softened in prose. A truth about what is built,
typed by hand into the page that makes the claim, is exactly the shape the
ledger is for.

**Proved by flipping a row.** `channel.qr` set to LIVE, rebuilt, and the change
read straight out of the built bundle:

```
{id:`channel.qr`, … build:`LIVE`, reach:`the shop`, state:`REVEALED` …}
```

Then reverted. The page now reads LIVE / LIVE / NOT BUILT / NOT BUILT /
NOT BUILT, from the table.

**THE LEDGER SUPPLIES THE STATE. THE PAGE KEEPS THE WORDS**, and that is the
load-bearing decision, not a style preference. `provenance:gate` sweeps `src/`
and `index.html`. A data file outside those two is not swept — so the moment a
ledger row supplied the actual letters printed on a page, every one of those
letters would have left the provenance boundary, in the same round that
mechanised asking where strings come from. The ledger returns `LIVE` /
`NOT_BUILT`; `Foundation.jsx` keeps `STATE_LABEL` in its own file where the
sweep can see it.

`isLive()` is strict — only `LIVE` is live, `PARTIAL` and `STUB` read as
not-built — because that register's own rule is that there is deliberately no
third state for "in progress".

**Only one consumer was converted.** Converting more is a per-surface decision.

## R6 — WHAT THE TABLE NEEDS WHEN THE RECORD GOES LIVE

Designed, not built, as instructed. Audit §8.

- **Per-entry asset references:** ledger rows at `record.013` granularity. The
  schema does not change — only the granularity — and the join, audit and check
  all work unaltered on a hundred rows. **The constraint that matters:** the
  ledger must never become a second copy of the Record. An entry's headline,
  dateline and sections live in the Record; the ledger holds only what it holds
  anywhere. The temptation at sixty entries will be to duplicate, and the moment
  it does the two disagree.
- **The cue-card input view:** one row, one question, the same format Doctrine 12
  already specifies for gaps. An OPS instrument, never a route. The cheapest
  honest form is a generated checklist, exactly as `assets:checklist` already is
  for the approval gate. **Not built, because R5 did not need it and because
  building an input for a schedule nobody has started is the same mistake as a
  menu row that leads to "not built."** It is [M32].

---

## TWO THINGS THIS ROUND FOUND BY DOING IT

**Pruning a stale provenance row can break a RESTATED chain that pointed at it.**
`--prune` dropped the superseded *"MGK-VIII, on the bench"* row; the archive
blurb's `r` chain had been resolving through it, and the gate failed on the next
run with an unresolvable reference. Repointed to the renamed row. Worth
recording as a property of the boundary: **a rename and a prune are two safe
operations that are unsafe in sequence**, and the only thing that noticed was
the RESTATED class's own requirement that a reference must resolve. That class
has now caught its author twice.

**The provenance sweep counts an identifier passed to a lookup as a
visitor-facing string.** Seven ledger row ids and enum values tripped the gate.
They are keys and are never rendered — but the sweep is default-deny and cannot
tell an identifier from a label, **which is the correct bias.** They are
DECLARED rather than EXCLUDED: adding an exclusion rule to absorb them would
have widened the boundary for everything, to save seven rows.

---

## GATES

| gate | result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings = baseline**, zero new |
| `npm run build` | **green, 72 modules** (was 70; +`src/lib/reveal.js`, +`reveal/ledger.json`) |
| `npm run provenance:gate` | **PASS** — 0 undeclared, 0 stale, INVENTION **0**, ceiling 0 |
| `npm run assets:scan` | **253 rows**, 0 orphaned judgements, 44 shipped |
| `npm run reveal:check` | **PASS** — every row consistent, every asset uid resolves |

**THE BROWSER LAP DID NOT RUN, AND THAT IS A REAL GAP IN THIS SEAL.** The Chrome
extension was not connected for the whole session and repeated attempts failed
with *"Browser extension is not connected."* No page was looked at.

The substitute, named as a substitute: **every rendered string was verified in
the BUILT BUNDLE** rather than on the glass — nine MGK-NIAC strings present,
seven retired MGK-VIII strings absent, the three record-of-fact MGK-VIII
sentences correctly still present, the guest book's clamp / derived copies /
visibility handler / backstop / easing / constants all present, and the
Foundation's five channel states reading correctly off the ledger.

**What that CANNOT catch is exactly what the lap exists for:** layout, overflow,
a name that collides visually with the one above it, and anything painted into a
picture. The MGK-NIAC cover was rendered and looked at as an image, and the
band's centring arithmetic is unchanged from A2/A3 — but **nobody has seen
`/robots` with the new name on it, and nobody has watched the guest book step.**
That is the one thing in this round that wants a person before it is trusted.

## PATHS

```
CHANGED
  src/routes/WbHome.jsx                     Q1/Q2 — the guest book
  src/data/artists/robots.js                Q3 — the rename
  tools/make_unit_covers.py                 Q3 — MGK-NIAC lettering + filename
  src/routes/Foundation.jsx                 R5 — reads the ledger
  tools/asset-table.mjs                     R3 — C32: uid + sha256 + refuse-to-guess
  provenance/asset-table.json               R3 — re-keyed, 253 rows
  provenance/assets-declare.mjs             Q3 — cover declaration renamed
  provenance/assets.json                    regenerated
  provenance/register.json                  Q3 + R2 — 19 rows in, 12 pruned, 1 repointed
  package.json                              assets:rename · assets:orphans · reveal*
  docs/OPEN_ACTIONS.md                      Doctrine 14

NEW
  reveal/ledger-declare.mjs                 the authored source
  reveal/ledger.json                        151 rows
  reveal/README.md                          the model + the honest hole-list
  src/lib/reveal.js                         the only reader in src/
  tools/reveal-ledger.mjs                   report · audit · check
  docs/REVEAL_LEDGER_AUDIT.md               R4
  docs/MUSEUM_REVEAL_LEDGER_LOG-20260805.md this file
  public/robots/art/mgk-niac-cover.png      the renamed cover

DELETED
  public/robots/art/mgk-viii-cover.png      renamed, not orphaned
```
