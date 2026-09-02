# MODE B — THE CONSOLE — 2026-08-26

**Built from `8d32319`, clean tree. Nothing committed, nothing pushed, nothing
deployed.** Served and driven before Mike: **`http://localhost:5173/robots`** →
the Portal album → track **`02 TERMINAL.EXE`** → **RUN**; and the same screen
from Record 005's attachment.

---

## 1 · WHAT THE LISTING CARRIES — reported before it was built with

Mike: **"use the filenames the Record already carries."** Record 004's
cracked-ZIP listing, verbatim from `robots-record.js:585–594`:

```
    ROOT
     /(many pwd protected folders)
     /PORTAL
       TERMINAL.EXE
       PORTAL_2v16.CFG
       /ANTENNA (PWD)
       /CHANNEL_SELECT(PWD)
       /INSTALL
          QC_101.TIF (hand written notes on form)
```

**THREE FILES. FIVE FOLDERS. NO `.bat`.**

| file | what it is | used as |
|---|---|---|
| **`TERMINAL.EXE`** | the only runnable file in the listing | **the file that runs** — the track's name, the boot's first line, the attachment |
| **`PORTAL_2v16.CFG`** | the config; canon ties it to the spec sheet's `VERSION … 2.16` | the boot's last line — *"maybe mention the cfg file"* |
| `QC_101.TIF` | already Record 004's shipped attachment | untouched; it is a form, not a program |

**HIS NOTE ASKED FOR A `.bat` AND THERE IS NONE.** Searched both repositories,
in-story and out: every `.bat` hit is real-world Ops tooling
(`launch_mediavault.bat`). **So the file that runs is the one that is there**,
and nothing was invented to stand in front of it — Doctrine 12 applied to a
filename. His own *"or whatever it was named"* is answered by the listing.

**`UNIX-6x Emulator` IS RECORD 005's, VERBATIM** — *"Portal is now up and
running on our UNIX-6x Emulator."* Canon 06-PORTAL §10.1 permits the name and
forbids the explanation: *"what UNIX-6x is, who made it, what it runs on,
whether it is period or modern … The line names it and stops."* **The screen
names it and stops.**

**AND THE LISTING ALREADY NAMED MODE A.** `/ANTENNA (PWD)` and
`/CHANNEL_SELECT(PWD)` are the two things the panel does, written into Record
004 before either shipped.

---

## 2 · THE BOOT — his shape, the Record's nouns

```
> TERMINAL.EXE
> UNIX-6x Emulator
> Loading......
> PORTAL_2v16.CFG
```

Against his: *"> program.bat_or_exe_or_? / > Loading...... / > maybe mention the
cfg file."* **`Loading......` is his, six dots, carried as typed.**

**MEASURED ON THE SERVED PAGE:** one line at a time, panel at **~4.0s** from the
press (sampled at 800ms — 0/1/2/3/4 lines, panel at 4.0s). The first comment
claimed *"under two seconds"* from `4 × 420ms`; **that was arithmetic rather
than a measurement and is corrected at the site** to the number the clock gave.
A press anywhere finishes the boot at any point, which is why the exact figure
is not load-bearing.

**IT RUNS ON `setInterval`, NOT `requestAnimationFrame`** — §8: rAF does not
fire in a tab the browser is not painting, and a harness that could not paint
once reported a boot as stalled.

---

## 3 · TWO DOORS, BOTH EXISTING SHAPES — and what each cost

### DOOR 1 · THE TRACK — `face.action`, which already existed

**Cost: three forwarded fields and a declaration.** `face.action` has been a
declared button dispatching a declared event since it was built, already
carrying `src` and `frameTitle`; `kind`, `boot` and `panel` ride it the same
way, and a fourth — `bezel` — was added after the served page caught its
absence (§6). An action declaring none of them dispatches what it always did.

`\Robots Track = filename`: **`id: "console"`, `title: "TERMINAL.EXE"`.** The id
is not the title on purpose — OPERATIONS §0, *NO ID MOVES WHEN A LEGEND IS
RECUT*.

### DOOR 2 · THE RECORD ATTACHMENT — and the blocker it hit

`docs/BACKLOG.md` item 5 scoped this and named what was missing: *"a `door`
field on a `docs` row (one branch)"*. **That half cost exactly one branch** in
`record-model.js` plus one in `RecordAttachments.jsx`, where the row's **name
becomes the control** — the name IS the file, and a separate RUN button beside
it would be two things to press for one act.

**ITS RECOMMENDED DESTINATION WAS NOT USED, AND THE REASON IS MEASURED.** Item 5
recommends `/robots?panel=<bankId>`; the survey found **nothing reads a `panel`
key** and that is still true. But the real blocker is different and is worth
recording:

> **`robots-record.js` IS A PUBLIC MODULE AND `portal.js` IS DELIBERATELY ITS
> OWN CHUNK.** `robots.js` imports the Record statically; `Robots.jsx` imports
> the Portal **dynamically and alone**. Naming the console's detail — boot,
> bezel, the whole panel — inside Record 005 would drag the Portal's
> declaration into the public entry and collapse that split.

**SO THE RECORD ASKS AND `Robots.jsx` ANSWERS.** The attachment dispatches
`wb-portal-run-console` and nothing else; the one file that already holds the
module listens and re-dispatches from **the console track's own action**. Same
seam the panel and the channel strip use: *the button asks; it does not answer.*

### ITEM 5's RULE, ONE LEVEL OUT — IT REACHES, AND IT IS SATISFIED BY CONSTRUCTION

> *"Both must open the same thing. Giving them different destinations would
> invent a difference the museum cannot produce."*

**IT WAS WRITTEN ABOUT TWO ATTACHMENTS ON ONE RECORD AND IT REACHES A RECORD AND
A TRACK, because its reasoning never mentioned Records** — it is about a
difference a visitor would read and the museum could not explain. A track and an
attachment named for the same file opening two different screens is that
difference exactly.

**AND IT IS NOT ENFORCED BY DISCIPLINE HERE — IT IS ENFORCED BY THERE BEING ONE
OBJECT.** The bridge reads the track's own `action`, so the two doors cannot
drift: there is nothing to keep in step.

---

## 4 · THE FOUR BAYS ON THE SCREEN — a placement, not a rebuild

**`InstrumentPanel` needed no change at all.** Its contract was already `decl`
in, a panel out, and it already scaled itself to its parent's height — so it did
not know whether it was on an album page or inside a CRT.

**WHAT IT COST WAS A MOVE.** Mode B's screen is drawn by
`RobotsExhibitFlow.jsx`, a second caller in a different file, and exporting the
component from `Exhibit.jsx` — which default-exports a component — costs
`react-refresh/only-export-components`. **A baseline is only a tripwire while it
is exact**, so the component went to `src/routes/exhibit/instrument-panel.jsx`,
which is the identical trade `use-yt-player.js` was extracted for on 2026-08-21.

**MEASURED BEFORE THE CUT:** `dialArc`, `resolveChannel`, `televisionStart`,
`televisionPhase`, `panelLoad`, `panelSave` and the three `DIAL_*` constants are
each referenced **exactly twice** in `Exhibit.jsx` — definition and one call —
and **nothing outside that file referenced any of them.** One closed set, moved
whole, unedited.

**AND THE PANEL IS ONE OBJECT NOW.** It was declared inline on the `portal`
track's face; both surfaces read `PORTAL_PANEL`. Two literals would be two
things to keep in step and one of them would eventually be wrong.

---

## 5 · MODE B IS ITS OWN SCREEN — verified, not asserted

`PortalScreen` gained one boolean, `controls`, defaulting to the old behaviour
so **every existing caller is unchanged to the character.**

| on Mode B's screen | |
|---|---|
| the bezel | **stays** — it is the SET |
| the 2×2 (SCROLL/CLICK/POWER/SHAKE) | **gone** — measured `0` |
| the 1 2 3 4 strip | **gone** — measured `0` |
| the channel note | **gone** |
| **the `[X]`** | **stays** — measured `1` |

**THE `[X]` IS NOT A MODE A CONTROL AND KEEPING IT IS S4's RULING**, not a
softening: *the fifth position is the way out*, and an exit that disappears when
the picture changes is not an exit. It is pushed to the same edge
(`.ps-strip--exit`) so it does not move a pixel between modes.

**AND THE LATCH STILL LAUNCHES MODE A.** Measured on the served page: pressing
LATCH on Mode B's screen opened television and Mode A's controls came back with
it — 2×2 present, four digits present. **The two modes are joined by the latch**,
which is the model canon §11 already carries: *THE LATCH — launches it.*

---

## 6 · WHAT LOOKING FOUND — four defects, all mine, all caught by measuring

**(1) THE `[X]` WAS MISSING AND SO WAS THE FRAME.** The action carried no
`bezel`, so `PortalScreen` took its bare-picture fallback — a console with no
frame and **no way out**. Caught by counting `.ps-chy-x` and reading **0**.

**(2) THE BOOT WAS DRAWING UNDER THE BEZEL.** On `place: "canvas"` the box is
3200 canvas units against the opening's 2539: **46.3px of every line hidden on
the left and the first line 20.3px above the opening.** The console joins the
feed placement, and it insets itself to the HOLE rather than the box — the feed
rect is deliberately bigger than the opening, which is the overscan that stops
the ground leaking in.

**(3) THE PANEL ESCAPED ITS BOX AT 375px, AND `align-items: center` WAS WHY.**
`InstrumentPanel` scales with `transform-origin: top center`, and **a transform
does not change the layout box** — so centring centred the UNSCALED height and
the drawing started 80.4px above the opening. `flex-start` closes it.

**(4) `PORTAL_2V16.CFG` — A FILENAME THE LISTING DOES NOT CONTAIN.** The first
cut put the cfg in the face's `subtitle`; `.vp-face-sub` is
`text-transform: uppercase`, so the lowercase `v` was uppercased on the glass.
Measured rather than assumed: `textContent` `PORTAL_2v16.CFG`, `innerText`
`PORTAL_2V16.CFG`. **A filename's casing is its identity.** Removed rather than
patched with a `text-transform: none`: the subtitle is a LABEL slot and
uppercasing labels is what it is for, and the cfg is named two seconds later in
the boot — in monospace, with no transform, `v` intact. Same class as the
`Worth a Listen` lowercase `a`.

**AND TWO LINT MOVES, BOTH FIXED RATHER THAN SUPPRESSED.** An
`eslint-disable-next-line` copied from a neighbouring component was reported
UNUSED and moved the baseline 9/7 → 9/8 for a suppression suppressing nothing;
and `setShown(0)` at the top of an effect was a real
`react-hooks/set-state-in-effect` — **and dead**, because the component mounts
fresh on every open.

---

## 7 · THE MEASUREMENTS

**DESKTOP** (`.ps` 900px, opening 761.7 × 603.3):

| | inside the opening? |
|---|---|
| first boot line | **yes** — 39.0 left · 38.6 right · 42.4 top |
| the boot block | **yes** |
| the panel | **yes** — 95.1 · 94.8 · 134.2 · 70.8 |

**375px** (`.ps` 375.2px, opening 317.5 × 251.5): the panel's natural height is
415 and its own fit clamps at its **0.60 legibility floor**, drawing **250.1px
into a 251.5px hole** — **1.4px of slack in the whole axis.** The done-boot is
hidden and the vertical safe area is zeroed; the panel still overhangs by
**1.0px top and 1.6px bottom**, and **the LATCH is inside**. Registered as
**MB-b**: this is the edge of what a CRT opening can hold, stated rather than
tuned until it passes.

**THE 0.60 FLOOR WAS NOT RAISED TO GET AROUND IT** — it is a legibility floor,
and beating it trades a clipped panel for an unreadable one.

---

## 8 · WHAT WAS NOT DONE

- **THE ALBUM PAGE'S PANEL IS UNTOUCHED.** His words were *"instead of the feed
  panel"*, and reading *instead* as *delete the existing surface* is a decision
  about what a visitor meets. **MB-a**, and it is one word from him. While both
  exist they read one object, so they cannot disagree.
- **NO PIXEL SCREENSHOT.** The Browser pane does not composite in this session —
  §8's rAF family; it timed out four times across two tabs. Every claim above is
  from painted-DOM reads and `getBoundingClientRect` geometry against the
  bezel's own coordinates, which is a strong oracle for **what is where** and no
  oracle at all for **how it looks. Mike is the first eye on the look.**

---

## 9 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` | green |
| `npm run provenance:gate` | **PASS** — 15 rows carried, 12 declared, 15 stale pruned |
| `npm run reveal:check` | **PASS** — after it caught the `door` field (below) |
| `npm run parity:gate` | **PASS** |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers:gate` | **PASS** — register 145 → 147 rows corrected |

**`reveal:check` CAUGHT A REAL ONE AND IT IS THE BEST THING IN THIS ROUND:**

> *Record 5: attachment 1 declares `door`, and the editor cannot carry it — it
> would be lost the first time he saved.*

The Record editor's reader did not know the field, so **Mike's first save from
the day editor would have silently deleted the door.** Fixed the way
`record-entries.mjs` itself rules: the reader carries it through **and** the set
is widened — *"widening this set ALONE would have silenced a true warning"*.
`door` is an OBJECT, so `val()` would have returned null and gone quiet; it is
read beside `plates`, the other object field.

**AND THE MOVE RE-KEYED THE REGISTER, WHICH IS WORTH KNOWING BEFORE THE NEXT
EXTRACTION.** A row is keyed on `sha256(file + " " + string)`, so moving 438
lines out of `Exhibit.jsx` staled **15 rows** and emitted 15 new stubs for the
same strings. **They were CARRIED, not re-declared** — each new row took the old
row's `c` and `s` verbatim, because a move must never become a re-classification.
Pruned with the sweep's own `--prune` after a hand probe disagreed with it
(22 against 15) — §0: *when a measurement is surprising, re-measure the
measurement*, and the sweep is the instrument that owns this question.
