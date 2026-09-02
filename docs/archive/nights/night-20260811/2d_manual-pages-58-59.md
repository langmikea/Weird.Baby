# 2d — THE MANUAL, PAGES 58 AND 59

**Read-only. Nothing in the robots repo was written.** The fix is specified
below and deliberately NOT applied.

Repo: `C:\AI\Projects\weird-baby-robots`, HEAD `36d5e5b`.
File: `tools/manual_structure_build.py`.

---

## 0. FIRST, SOMETHING THE PACKET DID NOT KNOW

**The robots repo is not clean, and what is sitting in it is a manual rebuild.**

```
 M robots/mgk-viiip/manual/structure/MGK-VIIIp_OMI_STRUCTURE_v1.pdf     112.6 MB
 M robots/mgk-viiip/manual/structure/pages/page-01.png … page-61.png    131.0 MB  (61 files)
 M tools/manual_structure_build.py                                      +111 / −27
                                                                      ─────────
                                                                        243.6 MB
```

The last commit to touch `manual_structure_build.py` is `9e8daa0` (2026-08-05,
the typed-page tuning pass). So there is an **uncommitted** builder change of 111
added / 27 removed lines, plus its rendered output, already on disk.

This matters for the ruling the packet defers: the "255MB in git" collision is
**not hypothetical and not in the future** — a 243.6 MB rebuild is already in the
working tree waiting on a decision. The repo's `.git` is presently 79.6 MB, so
committing this once would roughly quadruple it, and every subsequent rebuild
adds another ~244 MB permanently (PNGs are already-compressed binaries; git
deltas them badly, and rewriting is the only way to remove them). There is **no
`.gitattributes` LFS configuration** — the only `.gitattributes` line is
`* text=auto eol=lf`, for line endings.

I did not inspect what the uncommitted builder change does. It is not this
report's subject and reading it would not change the fix below.

---

## 1. THE DEFECT, AND WHY THE CONTINUOUS-RULE FIX DOES NOT REACH IT

`tools/manual_structure_build.py:1030-1036`

```python
def emit_notes(doc, title):
    doc.new_page()
    doc.centre(title, bold=True, under=True)
    doc.blank(2)
    while doc.row <= BODY_BOT - 1:
        doc.line(0, "_" * COLS, dens=0.9)
        doc.blank(1)
```

Called twice, at `:1175-1176`, for `"OPERATOR'S NOTES"` and
`"RECORD OF SERVICE"` — pages 58 and 59.

**Line 1035 is the only `"_" * …` in the file.** Every other rule in the manual
is drawn by one of two primitives; this one is neither. It passes underscore
CHARACTERS as text with `under=False`, so it goes down the ordinary typing path
in `type_run` (`:1381-1411`), where each `_` is struck individually and each
strike gets its own ink:

```python
d = dens * (DENS_NOMINAL + seat + RIBBON_AMP * math.sin(phase + i * w))
d *= 1.0 + rnd.gauss(0, STRIKE_SIGMA)
u = rnd.random()
if   u < LIGHT_P: d *= rnd.uniform(*LIGHT_MUL)
elif u > HEAVY_P: d *= HEAVY_MUL
```

So a "rule" made of 78-odd independent strikes carries the ribbon wave, the
per-strike sigma, and the light/heavy lottery **across its own length** — which
is exactly what makes it read as broken dashes rather than as a line.

**The continuous-rule fix exists and is three lines away.** It is the `under=True`
branch at `:1412-1420`:

```python
if under and text:
    top, bot = underscore_band()
    f = min(1.0, max(DENS_FLOOR, dens * (DENS_NOMINAL + seat)))
    x0 = LEFT_STOP + col * CELL_W
    x1 = LEFT_STOP + (col + len(text)) * CELL_W - 1
    dr.rectangle((x0, yb + top, x1, yb + bot), fill=int(round(255 * f)))
```

One rectangle, one density (`seat` is per LINE, not per character), landing on
the band `underscore_band()` measures **from the font itself** — its docstring
says why: *"so the continuous rule lands exactly where the per-character
underscores used to and carries no jitter of its own."*

Pages 58/59 never reached it because they spell their rule with underscore
characters instead of asking for an underline. The fix was written for
`under=True` and these two lines do not set it.

**On the ink.** `doc.put`'s default is `dens=1.0` (`:710`), which is what all
body type uses. `dens=0.9` is therefore below every line of type in the manual.
It is not the numerically lowest value in the file — `0.84` and `0.80` also
appear — but those six sites are all placeholder markers (`RESERVED` =
`"[ TEXT REQUIRED ]"`, `"[ ENTRIES REQUIRED ]"`, `"[ ART REQUIRED ]"`), ink
deliberately set to read as *not really there*. Among marks that represent
something that IS there, `0.9` is the faintest on any page.

---

## 2. THE FIX, PRECISELY

**One line. `tools/manual_structure_build.py:1035`.**

```python
# from
        doc.line(0, "_" * COLS, dens=0.9)
# to
        doc.line(0, " " * COLS, under=True)
```

Spaces, not underscores; `under=True`; and `dens` dropped so it takes the 1.0
default.

Each of the three parts, and why:

**`" " * COLS` rather than `"_" * COLS`.** The `under` branch spans
`col … col + len(text)`, so the text's LENGTH is what sets the rule's width — its
content is irrelevant to the rule. Spaces keep the width at the full measure and
strike no glyph, so the rule is the rectangle and nothing else. Leaving the
underscores in place with `under=True` would draw both, at double ink.

**`under=True`.** This is the mechanism the packet calls the continuous-rule fix,
used unchanged. It is right for these pages specifically because a writing line
on a typed form is TYPED. The alternative primitive, `doc.rule(…)` (`:731`),
renders through `hand_line()` (`:1256`), whose docstring describes *"a line drawn
against a straightedge by a person: it wanders by a hair, its ink varies, and it
does not end exactly on the mark."* That is correct for the CAUTION box and the
running-head/foot rules, which are hand-ruled in the fiction — and wrong here. It
would put a pen line on a page where every other mark came from the machine.

**Dropping `dens=0.9`.** In the `under` branch the ink is
`min(1.0, max(DENS_FLOOR, dens * (DENS_NOMINAL + seat)))`. At `dens=1.0` that
sits at ≈0.925 ± `seat`, level with body type; at 0.9 it sits at ≈0.83, which is
placeholder ink. `seat` is drawn once per line (`rnd.gauss(0, SEAT_SIGMA)`), so
the rules will still vary slightly from line to line — correct for a typewriter,
and the variation is now BETWEEN lines instead of ALONG them.

### Blast radius, and it is smaller than it looks

`render_page` seeds per page:

```python
rnd = random.Random(SEED + pno * 7919)          # :1338
```

so consuming a different number of draws inside pages 58 and 59 **cannot** shift
pages 1–57 or 60–61. Within 58 and 59 the stream does shift — the `under` branch
adds one `rnd.randrange(NV)` per character (`:1409-1411`, kept deliberately so
the stream does not move when an underline is added to an existing line) that the
plain path does not consume. So the paper grain and wobble on those two pages
will differ from the current render. Nothing else in the document moves, and the
page count stays 61 (the line budget is unchanged: same `while` loop, same
`doc.blank(1)`).

`npm run reveal:check` in the museum asserts *"the manual is 61 pages, read off
`robots/mgk-viiip/manual/structure/pages`"*, so the page count must hold — it
does.

### Verification that would be owed, once it may be run

1. Render; confirm still 61 pages.
2. Pages 58 and 59: the rules are continuous, at body ink, one density per line.
3. Pages 1–57 and 60–61: **byte-identical** to the current render. This is the
   real check on the per-page seeding claim above, and it is cheap.
4. Build twice; confirm byte-identical (the standing determinism check).

---

## WHAT I COULD NOT DETERMINE

- **What the fix actually looks like.** I did not render it — the packet forbids
  applying it, and rendering is the applying. Everything above is read off the
  code paths; the claim that the result reads as a continuous rule rests on
  `underscore_band()`'s own docstring and on the same branch already being used
  for `doc.centre(title, bold=True, under=True)` two lines above, on the same
  pages, in the page titles.
- **Whether pages 58/59 currently look broken to the eye.** I did not open
  `page-58.png` / `page-59.png` (2.2 MB and 2.1 MB). The mechanism explains the
  reported symptom exactly, but I am taking the symptom from the packet rather
  than from the picture. **If this matters before the ruling, opening those two
  PNGs is the cheap check and needs nothing committed.**
- **What the 111 uncommitted lines in `manual_structure_build.py` do**, and
  therefore whether the rendered pages on disk still match the committed builder
  or the uncommitted one. If they were rendered by the uncommitted builder, the
  "byte-identical pages 1–57" check above must be run against a fresh baseline,
  not against what is on disk.
- **Whether `robots/…/pages/*.png` and the PDF were ever meant to be tracked.**
  They are tracked today (git reports them modified, not untracked), so the rule
  the packet calls unruled has already been broken once, before this round.

## WHAT NEEDS MIKE

**One ruling, and it is the one the packet already names:** heavy media in git.

It is more urgent than the packet assumed, because it is not a future cost — a
**243.6 MB rebuild is sitting uncommitted in the robots working tree right now**,
and the repo cannot be left in that state indefinitely. Three ways out, and they
are his to pick:

1. **Commit it.** `.git` goes 79.6 MB → ~320 MB, permanently, and again on every
   rebuild.
2. **Stop tracking the rendered manual** (`.gitignore` the `pages/` directory and
   the PDF) and treat the builder as the source of truth — the manual is
   deterministic, so it can be regenerated rather than stored. This is the option
   that fits *"heavy media never in git"*, and it means deciding where the
   rendered copy does live.
3. **Git LFS.** No `.gitattributes` LFS config exists today; adding one is its
   own decision and its own dependency.

**Until he rules, nothing in the robots repo should be written** — including this
one-line fix, which is correct and ready and would drag 243.6 MB of re-rendered
pages behind it the moment it is applied.
