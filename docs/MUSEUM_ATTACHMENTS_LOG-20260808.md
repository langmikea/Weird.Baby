# ATTACHMENTS + THE EMAIL-LIKE REGISTER — round log, 2026-08-08

**Seven instructions (A0–A6). All answered.** A0 is the boundary and it governed
two decisions that would otherwise have gone the other way.

Gates: lint **11/9 = baseline** · build **green** · `provenance:gate` **PASS** ·
`reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** ·
`instory:gate` **PASS** · `assets:orphans` **0** · `reveal:day` **nothing to
move** · **the lap RAN at 390px and at the operator's own 1228px** — five
routes, page overflow 0, uncontained past the edge 0, console errors 0.

---

## §0 — THE INSTRUCTION, VERBATIM

Cited by the provenance register.

> **A0.** THE BOUNDARY, and it is the most important line in this brief: THE
> RECORD IS EMAIL-LIKE. IT IS NOT AN EMAIL PROGRAM. Do NOT build mail chrome — no
> From, no To, no Subject line, no reply affordances, no inbox, no message
> headers, no envelope furniture of any kind. What is borrowed is the REGISTER
> ONLY: the plainness and the attachments-at-the-bottom convention. Everything
> else stays what it is.
>
> **A1.** D-b RULED — PAYLOADS BECOME ATTACHMENTS, BELOW THE LINE. An entry may
> carry both authored sections and payloads; the payloads sit at the BOTTOM,
> after the writing. Nothing drops silently ever again. Fix RecordEntry.jsx so
> sections and payloads coexist, and fix the preview to show them, since the
> preview renders the real component.
>
> **A2.** THE ATTACHMENTS ARE PREVIEW ICONS — the one modern convenience
> granted. Not fancy, not sleek, not a modern gallery: a plain list with small
> preview thumbnails, the way attachments appear at the foot of a message.
> Photographs, documents and transmissions all use the same shape — same only
> the data.
>
> **A3.** THE REGISTER (record it as law): it is modern times inside the story,
> so the writing may look modern — but the aesthetic is a SMOOTH TRANSITION FROM
> THE 1960s WORLD by way of being EXTREMELY SIMPLE. Plain Arial-class sans, BOLD
> AT MOST, no display faces, no ornament, no editorial typography. It should read
> like an engineer writing a progress report or keeping a log. This also buys
> back vertical space, which is the density fix Mike asked for.
>
> **A4.** RECONCILE HONESTLY … **A5.** Measure the density gain … **A6.** Verify
> the preview still matches the page exactly after all of this.

---

## §1 — A1/A2: THE ATTACHMENTS

`src/lib/record-model.js` gains `attachmentsOf()` — pure, framework-free, beside
`evidenceOf` — which flattens `wire`, `plates` and `docs` into one list of rows.
`src/routes/exhibit/RecordAttachments.jsx` draws them.
`RecordEntry.jsx` renders the block **after the sections and above the
tombstone**: the tombstone is where things stand when the lights go off, and a
list of files after a closing line is furniture after the end.

**One shape, three kinds, verified on the real component** by posting an entry
carrying all three to the preview frame:

| row | thumbnail | meta | its own words |
|---|---|---|---|
| Transmission | glyph, not openable | `transmission · 3 lines` | 3 lines, printed in the row |
| The power switch, round the back | **the photograph**, opens the reader | `photograph · MAR 2021` | — |
| REACT ruling, 23:30 | glyph | `document · Operations · 2026-08-14 · 2 pages` | the extract, printed in the row |
| The unphotographed page | glyph | `document · Unknown · 1 page · not here yet` | — |

**A transmission is ONE row and not N**, because `wire` is one printout written
on several lines. **Its lines print inside the row and are never behind it** —
R4's no-hidden-information law binds this surface, and a row that swallowed its
own words to look tidy is the half-sentence teaser Mike struck from the index,
one level down.

**A glyph is not a failure state.** A document with no photograph of its page has
no thumbnail because there is no photograph, and the row says *not here yet*.
That is `docState`'s empty-and-honest discipline drawn rather than described.

### "Nothing drops silently ever again" is a gate now

A sentence or a mechanism. S-c was not a bug in a renderer — it was a renderer
that did not know about three fields and **had no way to say so.** Fixing three
fields does not fix the fourth somebody adds in November.

So `reveal/record-entries.mjs` gained `entryFields()` (names only — it cannot
leak a headline into the ledger because it never reads one) and
`tools/reveal-ledger.mjs` holds `DRAWN_ENTRY_FIELDS`, the list of what is drawn.
**Any entry declaring a field nobody renders fails the packet, by name.** Proved
by breaking it on purpose:

```
Record 001: declares `transcript`, and nothing renders it. Either draw it
(RecordEntry.jsx / RecordAttachments.jsx) or, if it is deliberately undrawn,
add it to DRAWN_ENTRY_FIELDS with the ruling.
CHECK: FAIL — 1 fault(s)     (exit 1; source restored byte-identically after)
```

`evidence` is the one allow-listed exemption and it carries R5's ruling beside it.

### The preview shows them, and can be told to

The preview renders the real component, so attachments arrived free. What it
could not do is have any — Mike writes prose; Ops attaches files. So the
worksheet's stated conventions gain one line form: **`ATTACH: what it is`** puts
a row at the foot of the entry. It becomes a document with no scan, which is
`docState`'s HELD — a glyph, the name, *not here yet*. **That is the truth until
Ops supplies the file, and it is what the finished entry will show until then
too.** Nothing is faked to fill the row.

### A0 held twice

Two things were considered and refused: a count beside the ATTACHMENTS label
(a mail client's badge) and a per-row "open" affordance separate from the
thumbnail (a mail client's download control). The block is a rule, a word and a
list. There is no sender, no recipient, no subject and no envelope anywhere in
`RecordAttachments.jsx` or its CSS.

---

## §2 — A3/A4: THE REGISTER, AND WHAT IT REVERSES

New token `--wb-plain: Arial, 'Helvetica Neue', Helvetica, 'Segoe UI', system-ui,
sans-serif` in `museum-tokens.css`. **No webfont.** He said Arial-class; Arial is
the thing already on the machine, and *extremely simple* is the instruction. It
also costs nothing to load, which matters on the one surface built to grow to
hundreds of entries.

### What changed

| | was | is |
|---|---|---|
| headline | DM Serif Display 400, `--fs-display` (1.30×), 26ch | `--wb-plain` **700**, `--fs-head` (1.19×), 34ch |
| lead | Fraunces, `--fs-lead`, 46ch | `--wb-plain`, `--fs-body`, 60ch |
| section label | Syne 800, tracking .16em | `--wb-plain` 700, tracking .06em |
| section body | Fraunces, leading 1.62, 68ch | `--wb-plain`, leading **1.45**, 68ch |
| tombstone | Fraunces *italic*, 56ch | `--wb-plain` roman, 68ch |
| doors in a sentence | Fraunces | `inherit` — they take the sentence they sit in |
| the peek card | Syne 800 / Fraunces | `--wb-plain` |
| index row title + summary | Syne / Fraunces | `--wb-plain`, scoped to `.vp-rec-index` |

### What it reverses, named

- **P8's ruling stands and is not touched.** P8 took the display face off the
  artist pull-quote in favour of the house register (Syne); this takes Syne off
  the RECORD, which P8 never ruled on. `.vp-face-blurb` is unchanged.
- **R5b's sixth ramp step (`--fs-display`) loses its only Record use.** It was
  added for the poster's artist names and is still used there; the Record's
  headline drops one step to `--fs-head`, which is what a bold sans needs to
  outrank a bold-sans label without shouting.
- **R4's 68ch survives by construction**, and that is the useful half: `ch` is
  relative to the face, so 68ch is still 68 characters. Measured below: **70.8
  characters per line before and after.** The physical column narrowed (678 →
  582px) because Arial's `ch` is narrower; the reading measure did not move.
- **A4's paper-card treatment is NOT reversed.** The ground, the border, the
  chrome and the wing's own furniture are untouched — A3 is about type, A0 says
  everything else stays what it is, and when in doubt change less.
- **The register lines keep Courier Prime** — the dateline, the stamp and the
  index's mark rail. They are DATA, not prose, and a monospace timestamp is what
  an engineer's log looks like. It is a judgement and it is one word to reverse.

### The neighbours, and this is A4's real answer

The index row is built from `.vp-fe`, `.vp-fe-title` and `.vp-fe-line` — **shared
entry-list furniture** used by the robots FAQ, Worth A Listen's list and every
other face that prints entries. Restyling them bare would have retyped four faces
to serve one. **Every new rule is scoped inside `.vp-rec-index`**, and the bare
rules at `Exhibit.css:512` and `:516` are untouched.

Proved with a cascade probe in the live document — the same three classes, once
inside a Record index and once outside it:

```
inside  .vp-rec-index :  title Arial      · line Arial,    leading 22.24
outside .vp-rec-index :  title Syne       · line Fraunces, leading 25.28
```

**One neighbour IS inside the scope and it is named rather than discovered:** the
Foundation's *Happening now!* face is also `entriesMode:"log"`, so it will
inherit this register. It declares `entries: []` — nothing renders there today —
and inheriting is the right answer when it does: one component, one register. If
the Foundation is meant to read as a different kind of log, that is a ruling.

---

## §3 — A5: THE DENSITY, MEASURED

Built bundle under `wrangler dev`, Record 001 opened, the longest body paragraph
(283 characters). Lines-per-screen is at a fixed 900px frame height so the two
runs are comparable.

### At 1228px

| | before | after | change |
|---|---|---|---|
| body face | Fraunces | Arial | |
| body size | 15.393px | 15.395px | **unchanged** |
| line-height | 24.9366px | 22.3227px | **−10.5%** |
| **characters per line** | **70.8** | **70.8** | **unchanged** |
| body column width | 678.15px | 582.10px | −14.2% |
| **lines of body per screen** | **36** | **40** | **+11.1%** |
| whole opened entry, head to endmark | 720.37px | 671.23px | **−6.8%** |
| index row height | 93.13px | 88.60px | **−4.9%** |
| headline size | 20.011px | 18.320px | −8.5% |

### At 390px

| | before | after | change |
|---|---|---|---|
| line-height | 24.8521px | 22.2442px | **−10.5%** |
| **characters per line** | **40.4** | **40.4** | **unchanged** |
| **lines of body per screen** | **36** | **40** | **+11.1%** |
| whole opened entry | 968.78px | 869.13px | **−10.3%** |
| index rows (013 / 001) | 156.97 / 132.73 | 147.96 / 110.68 | −5.7% / **−16.6%** |

### Which half of his complaint this answers

**"Too big for its area" — answered, with numbers.** Eleven per cent more lines
in the same screen, the opened entry 7% shorter on a desktop and 10% shorter on a
phone, and the index rows 5–17% shorter.

**"Hard to read" — answered with the face he specified, and that half is his
judgement rather than a measurement.** What can be stated: the size did not
change, the measure did not change (70.8 characters, both), and the face is now
the plain sans he asked for instead of a high-contrast optical serif. **One thing
moved against readability and it is named:** the leading is 10.5% tighter, which
is where most of the vertical saving came from. It is one number — `1.45` on
`.vp-rec-sect-body` — and returning it to ~1.55 would give back roughly 4% of the
height if he finds it close.

### AND THE FIRST CUT MADE THE INDEX WORSE, WHICH ONLY THE MEASUREMENT CAUGHT

Reaching for density I wrote `.vp-rec-index .vp-fe{padding:7px 0}`. But
`.vp-rec-row{padding:0}` already zeroes the shared list's 9px, and a two-class
selector outranks it — **so a rule written to make rows shorter ADDED FOURTEEN
PIXELS to every one of them**: 93.13px before, **102.6px with the rule**, 88.66px
without it. Deleted, with the arithmetic written where it stood.

---

## §4 — A6: THE PREVIEW STILL MATCHES EXACTLY

Same browser window (`innerWidth` 1228), museum as a top-level document on the
built bundle, preview as the worksheet's full-window frame. Re-run after every
change in this round:

| | live `/robots` | preview |
|---|---|---|
| `100vw` / `100cqh` | 1213.8 / 583.36 | 1213.8 / 583.36 |
| `.vp-flat` width | 838.66px | 838.66px |
| headline size / `max-width` / family | 18.3297 / 346.598px / Arial | identical |
| section label size / tracking | 13.0927 / 0.785559px | identical |
| body size / leading / `max-width` | 15.4031 / 22.3345 / 582.463px | identical |
| dateline family / size | Courier Prime / 11.4304 | identical |
| index summary / title size | 15.4031 / 13.0927 | identical |
| attachments | same component | same component |

---

## §5 — WHAT WAS NOT DONE

- **Nothing was deployed.**
- **The short-form entry path keeps its old payload shapes** (`wire` as a
  register block, `plates` as a grid, `docs` through `DocList`). It has **zero
  payload instances** today, `DocList` is also the face-level document renderer
  and changing it would reach a neighbour, and A0 says change less. Every Record
  entry written from here is long-form.
- **013 and 001 carry no payloads**, so the attachment block does not render on
  the live site yet. It was exercised on the real component through the preview.
- **`--fs-display` is now unused by the Record** but still used by the poster;
  it was not removed.
- **Surfacing unmoved at 20 spendable — the ninth packet running.**
