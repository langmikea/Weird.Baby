# THE RECORD — what to hand it

**For Mike.** This is the shape of every kind of thing the Record can display, so
content can be produced against it rather than fitted to it afterwards.

**Where it lives:** the entries are in `src/data/artists/robots.js`, on the
MGK-VIIIp album, the track called *The Record*, under `face.entries`.
**Nothing here is a template to fill.** An entry with only a date, a title and a
sentence is a complete entry; everything below is optional and appears only when
it is there.

The rules that make that true are in `src/lib/record-model.js`; the surfaces are
in `Exhibit.jsx`. Neither holds a list of permitted values, so a class invented
next month needs no code.

---

## 1 · The entry

```js
{
  date: "2024-01-05",        // REQUIRED for anything to work well. See §5.
  title: "Who is W.O.?",     // short. It is the line a reader scans.
  evidence: "record",        // ONE WORD. Any word. See §2.
  line: "The first entry. Three units are named on the boxing…",
  note: "the note's full text is in the archive",   // optional, quieter

  // …and then any combination of the three payloads in §3, or none.
}
```

- **`date`** is a plain `YYYY-MM-DD`. It is the spine: the index bands by month
  from it, the stamp is printed from it, and anything that ever asks "what is new
  this week" reads it. **A new entry does not need a `stamp`** — it is derived.
- **`stamp`** (`"05 JAN 24"`) is only for entries that already have one, or where
  the printed date should differ from the real one. An authored stamp always wins.
- **`line`** is the one true sentence. It shows in full when the entry is open and
  clamped to one line in the index, so put the substance first.
- **`note`** is an aside — provenance, a caveat, a pointer.

---

## 2 · `evidence` — the class

One word. It prints as a small chip beside the title, in the index and on the
open entry. It exists so a reader scanning a year can see that a week brought a
**transmission** rather than another paragraph.

Already in use: `document` · `record` · `correction` · `object` · `firmware` ·
`photograph`.

**There is no permitted list.** Write `telegram`, `invoice`, `tape`, `rumour` —
the renderer prints whatever the word is. Keep them lowercase and singular so
they read as a set.

---

## 3 · The three payloads

An entry may carry any of these, in any combination. **A payload is a set, so it
is always an array**, and an empty array is the same as leaving it out.

### `wire` — A TRANSMISSION

Machine output, cables, telemetry, anything that arrived as a message rather than
as a thing. Prints as the register block the machine's own pages use.

```js
wire: [
  "CHANNEL   14",
  "RECEIVED  1965-04-02 03:11",
  "BODY      the text, verbatim, however long — it wraps under the value",
]
```

**Format:** one string per line, `KEY` then spaces then the value.
**Pad the key column to 9 characters** (`"CHANNEL  "`) — the hanging indent is
set to 9, so a value that wraps lines up under itself instead of under the key.
Keys uppercase, values as written.

### `plates` — PHOTOGRAPHS

Photographs of a thing. Prints as a small contact sheet under the entry, and each
one opens in the same reader as a plate off the plate wall.

```js
plates: [
  { img: "/robots/reference/photos/front_full.png",
    label: "The front, whole",         // the caption. optional but wanted.
    date:  "APR 2024" },               // free text, prints in the reader
]
```

**Files:** put them under `public/robots/reference/photos/` and reference them by
that path. **Long edge ≥ 2400px** — the reader magnifies to 1:1 and that is the
one thing code cannot fix later. Colour is fine on disk; the wing prints
everything monochrome.

### `docs` — DOCUMENTS

A document is a thing with a **provenance** first, and then — separately, and
usually later — an image of it and/or words taken out of it. That is why these
are three fields and not one: the card can be written the day the document turns
up, the scan waits on a camera, the extract waits on somebody reading it.

```js
docs: [
  { title:   "ABEAL one-page ad, back cover",   // REQUIRED
    source:  "Popular Electronics, Nov 1965",   // who/where it came from
    date:    "1965-11",                          // free text
    pages:   2,                                  // a number; prints as "2pp"
    scan:    "/robots/reference/docs/ad-back.png",  // optional
    extract: "…the words you want quoted, verbatim…", // optional
    note:    "the ad is retro-fitted; the original is on file" },  // optional
]
```

**The card states which of three it is, and you do not set that — it is read off
the fields:**

| state | when | what shows |
|---|---|---|
| `imaged` | `scan` is set | the page, opening in the reader (a set of scans on one entry opens as its own reel) |
| `quoted` | no `scan`, `extract` is set | the extract, set as a quotation |
| `held` | neither | the provenance, on a dashed card, saying plainly that the page itself is not here yet |

**`held` is not a placeholder** — it is a real record of a thing the museum has
and has not photographed. Writing the card the day the document arrives is the
point.

**Files:** `public/robots/reference/docs/`, same ≥2400px rule as plates.

---

## 4 · What a reader sees, and what that means for writing

- **The index** shows: date · title · class · what it carries (`PLATES 3`,
  `WIRE 2`, `DOCS 1`) · the first line of `line`.
  So: **titles short, `line` front-loaded.**
- **The open entry** shows everything, paged across the sheet.
- **Bands** (month headings) appear once the Record has **14+ entries spanning
  more than one month**. Below that it stays a flat list, which reads better.
  Nothing to set — they come from `date`.

---

## 5 · Volume — what has been measured

The Record was tested with **400 entries** carrying a mix of all three payloads
and then reverted. What the measurements say:

| | desktop (1400px) | phone (390px) |
|---|---|---|
| index at 400 entries | **33 pages, 0px clipped** | **242 pages, 0px clipped** |
| an open entry with 3 documents + a transmission | **1 page, 0px clipped** | 0px clipped |

**Nothing clips at any volume**, which is the D-BINGE test. The honest caveat:
242 sheets on a phone is not broken, it is *long* — the month bands are what make
it walkable, and if the Record ever gets that big the next lever is a jump by
period rather than by sheet. That is named, not built.

---

## 6 · The shortest possible answer

Give an entry a **date**, a **title**, a **class word** and a **sentence**. Add
photographs as `plates`, machine output as `wire`, and paper as `docs` — and for
paper, write the card the day it arrives even if the scan is months away.
Everything else the Record does, it does on its own.
