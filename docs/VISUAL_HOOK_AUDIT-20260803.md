# THE VISUAL HOOK AUDIT — every face, every page

**Round:** THE FOUNDATION ROUND (v40), 2026-08-03 · **Method:** every surface
opened on the LIVE BUILT bundle (`vite build` → `wrangler dev`), desktop and a
genuine 390×740 same-origin iframe. Nothing here is read off the source.

---

## THE LAW (Mike, this round — recorded in STATE.md as standing doctrine)

> Land on words alone and the visitor probably walks out. **EVERY surface needs
> something visually compelling besides written words** — not necessarily a
> photo; even words presented in a different FORMAT can be the hook.

**What counts as a hook.** A photograph, a plate, a collage, an instrument
panel, an artwork — or a typographic OBJECT (a ticket, a ledger, a poster, a
printed card). What does not count: a heading, a rule, a pull-quote, or a
register block. Those are typography *of* the words, not something besides them.

**What "landing" means.** The first thing a visitor sees on arriving at a room,
or on selecting an album inside one. A face three presses deep is audited but
its remedy is not urgent; a face you arrive on is.

---

## THE TABLE

`HOOK` = had one before this round · `FIXED` = given one this round ·
`WANT` = still text-only, named with what it needs.

### Rooms

| Route | Landing state | Verdict | What it is |
|---|---|---|---|
| `/` Lobby | logo plate, 380px | **HOOK** | the Weird.Baby photo-ID mark |
| `/booth` Information Booth | credo + 11 questions | **FIXED** | the **ADMIT ONE ticket** — inverted, torn stub, tilted. Words in a different format, built entirely from a sentence already on the page |
| `/foundation` The Foundation | *new this round* | **FIXED** | the **ACCOUNT ledger** — `$0.00 / held, ever`, over three ruled rows |
| `/shop` Gift Shop | banner + roster | **HOOK** | 5 images |
| `/wal` Worth A Listen | album 0, track 1 | **FIXED by F2** | was 280 words of house prose; is now the BILL — four artist covers, in colour, each a door |
| `/robots` Weird.Baby Robots | album 0, track 1 | **FIXED** | the **family shot** on Welcome — "three cartons of them arrived on a dock", as a picture |
| `/hr`, `/wb` | coverflow + player | **HOOK** | declare no faces; land on covers and a video |

### WAL faces — the house album

| Face | Verdict | What it is |
|---|---|---|
| About our current artists *(now #1)* | **HOOK** | 4 covers + colour-coded panels |
| The deal *(was "Welcome", now #2)* | **FIXED** | the house's own printed card as the head plate |

### WAL faces — per artist (×4)

| Face | Carsie | Hunter Root | Jesse | Mikey Mike |
|---|---|---|---|---|
| song ×2 | HOOK (video) | HOOK | HOOK | HOOK |
| About the Songs | **FIXED** | **FIXED** | **FIXED** | **FIXED** — each song's own poster beside its card |
| About the Artist | HOOK (poster) | **FIXED** (’94 sleeve) | HOOK (plate) | **FIXED** (channel portrait) |
| What they are up to | HOOK | HOOK | HOOK | HOOK — the collage wall |

### Robots faces

| Face | Verdict | Note |
|---|---|---|
| Welcome | **FIXED** | family shot |
| FAQ | **WANT** | six questions, no image. Not a landing. Wants a photograph of the unit answering one of them — or the FAQ's own device |
| Contact | **WANT** | four rows. Smallest surface in the wing; a plate may be more than it needs |
| The Plates | HOOK | 9-tile collage |
| The Record | **WANT** | ten dated entries. **The strongest remaining candidate in the building**: it is an evidence log, `evidence:` is already a field on every entry, and `.vp-fe-plate` (built this round) already renders a picture per entry. Wants the evidence photographed |
| The Manual | **WANT** | `kind:"plate"`, `plates: []` — the face is BUILT for imagery and the array is empty. Wants manual scans |
| The Firmware | **WANT** | two entries. Wants a screen photograph |
| The Portal | HOOK | the instrument panel |

---

## WHAT WAS FIXED, AND WHAT IT COST

Seven surfaces gained a hook. **Not one new asset was sourced and not one new
rights question was opened** — every picture used was already in the build:

| Fix | Source | Why it was already safe |
|---|---|---|
| Booth ticket | none — type | built from "No tickets, no tiers, no ads", six lines below it |
| Foundation ledger | none — type | four clauses of the charter's own Law, as figures |
| WAL bill first | none — reorder | R5b's own component, moved one row up |
| About the Songs ×4 | `i.ytimg.com/vi/<id>/hqdefault.jpg` | W3's ruling; the collage has drawn this exact URL since it was built |
| Hunter Root plate | `hunter-root-cover.jpg` | our own catalogue, MV-20260523-001 |
| Mikey Mike plate | `mikey-mike-cover.jpg` | logged in WAL_PHOTO_PROVENANCE as his channel portrait |
| Robots Welcome | `MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png` | already the MGK album's `viewerPoster` and tile 1 of The Plates |

**The one named trade:** Hunter Root's card opens on the same picture as his
coverflow cover, because no portrait of him exists in the vault. It is a
weaker hook than a portrait and a much stronger one than four paragraphs. One
string when a portrait arrives.

---

## THE FIVE THAT REMAIN, RANKED

1. **The Record** (`/robots`) — the machinery now exists (`.vp-fe-plate`); it
   needs photographs of evidence that is described but not shown.
2. **The Manual** (`/robots`) — `plates: []` is a built, empty slot.
3. **The Firmware** (`/robots`) — one screen photograph would do it.
4. **FAQ** (`/robots`) — a picture, or a device of its own.
5. **Contact** (`/robots`) — smallest; may not want one.

All five are in one wing, all five are ART-pending rather than code-pending, and
none of them is a landing. That is the honest shape of what is left.
