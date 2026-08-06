# THE WAL POSTER EDIT — round log

**Date:** 2026-08-05 · **Scope:** `/wal`, the ABOUT OUR CURRENT ARTISTS face
(`HOUSE_ALBUM.tracks[0].face`), plus the one renderer and one stylesheet the
strike reaches. **Lane:** drafting. **Surgical by instruction:** delete only
what was listed, rewrite only what was named, leave everything else standing.

**Gates:** lint **11 errors / 9 warnings = baseline, zero new** · `npm run build`
green · `npm run provenance:gate` **PASS** · `npm run reveal:check` **PASS**
(ledger untouched) · `npm run parity:gate` **PASS** (neither machine album
touched) · lap run **on the built bundle** at desktop and at 386 CSS px, zero
console messages. `npm run surfacing`: **13 spendable · 13 promised · 15 idle —
unmoved**, because this round struck strings and moved no asset.

---

## W1 — THREE PASSAGES STRUCK, AND ALL THREE WERE TRUE

Mike named the fault himself: *all three explain what the room already does or
congratulate the house on its own process.* Doctrine 11. Every line below was
accurate, which is what let it survive four rounds of review.

| # | What was struck | Where it lived |
|---|---|---|
| a | *"They have nothing to do with each other… somebody here could not stop playing them."* | `face.label[]` — the whole field is gone, not emptied |
| b | *"The standard in this room is not chart position…"* | `face.bill.standard` |
| c | *"Press a name to open that artist's room. Every card in it was written from sources that were opened and read…"* | `face.bill.foot` |
| c | **"Open the room"** — the per-act chip | `Exhibit.jsx` `.vp-bill-go` span, and its CSS |

**Not one render path was touched.** `bill.standard` and `bill.foot` are still
conditional in `Exhibit.jsx` and their CSS still stands; the fields are simply
not declared, so a later face may declare either again. Only `.vp-bill-go` was
deleted outright, because its sole caller was deleted with it.

**The one that costs something is the chip.** `.vp-bill-go` carried **P6's
ruling** — *what is drawn must be readable, and what is not readable must be
written*, so the panel's affordance was a WORD rather than a chevron. Striking
it **reverses P6 on this one object.** Verified live: all four panels are still
`<button>`, still lift on hover, still take a pointer cursor, and pressing
Hunter Root still opens his room. On a coarse pointer there is now no written
cue at all. Named, not replaced — **M51**.

---

## W2 — HUNTER ROOT'S LINE, REBUILT FROM THE VAULT

Mike's instruction was to discard the sentence rather than edit it, establish
what is true and verifiable, **verify every figure**, and write the plainest
line the facts support.

**The old line carried three wrong things and one unverifiable one.**

> *Ours — the one artist here whose whole catalogue this museum holds:
> seventy-eight songs across nine records. Half of Crooked Home is about his
> brother.*

1. **"seventy-eight songs" counted the wrong rows.** 78 is the number of track
   rows in `src/data/exhibits/hunter_root.json` that carry a `song:` slug. The
   vault's own tracklists carry **93**, and the fifteen the figure silently
   drops are the whole of **Run With The Hunt**, which has no slugs on it.
   Thirteen of those fifteen appear on no other record.
2. **"nine records" counted containers, not records.** Nine is right for album
   *entries*; one of them is an **EP by its own title** (Phone Recordings EP)
   and one is a **set by its own title** (SINGLES & RARITIES). **Seven are
   records.**
3. **"whose whole catalogue this museum holds" is contradicted four hundred
   lines up in the same file** — *"Sixteen releases sit on his own Bandcamp;
   nine albums are on file in this museum's vault."*
4. **"Half of Crooked Home"** — the vault carries the dedication, the grief,
   *'94* and *My Brother's Bones*. It does not carry **the half**. The
   quantity is somebody's paraphrase, it is declared VERIFIED, and it is still
   printed on three other faces. Reported (**M50**), not patched from here.

**What the vault actually holds**, counted this round, nine containers as
configured in `src/data/artists/hunter-root.js`:

| | |
|---|---|
| **records (7)** | Run With The Hunt · They Finally Cracked Me · Life Inside A Wheel · Mimicking the Sun Like Dandelions · Skipping Stones That Sink Before They're Thrown · Arkansas · Crooked Home |
| **EP (1)** | Phone Recordings EP |
| **set (1)** | SINGLES & RARITIES |
| **tracks** | **93**, every one carrying at least one playable rendition (140 in all) |

**The one thing that had to be looked up rather than assumed: Run With The Hunt
is a RECORD, not a band.** Its archived ReverbNation page reads like a band's —
*Jam, Grunge, Acoustic Rock — Manheim, PA* — and `era-buckets.json` folds it
into a bucket literally called **The Band Years**. The vault settles it:
`MV-HR-20260707-004`, *"Run With The Hunt was Hunter's first solo record."* His
band was SEEDS, which became Medusa's Disco (`MV-HR-20260707-003`), and not one
track of theirs is in the room. **Reading the era label instead of the fact
would have printed a band that is not there.**

**The line, as it ships:**

> *The one artist in this room whose records the museum holds in its own vault:
> seven of them, an EP and a set of singles and rarities — ninety-three tracks.*

One sentence, because that is the truest version. It claims **holdings and
nothing else**: not that the catalogue is complete, not a number of songs he has
written, not a comparison with the other three. Declared **VERIFIED** in
`provenance/register.json` with the count and its method as the citation.

---

## W3 — WHAT THE DELETIONS EXPOSE

Nothing was papered over and no replacement copy was written. Each of these is
a **described slot**, not a draft: a comment at the exact site in the source,
plus a row in `docs/OPEN_ACTIONS.md`, which is the one place Mike looks.

| Slot | What belongs there | Row |
|---|---|---|
| **The act panels have no written affordance** | Either a press cue, or a ruling that a photograph with a name under it and a coloured rule beneath is self-evidently a door. P6 says a cue; Mike's strike says otherwise; the two need reconciling on this one object. | **M51** |
| **The poster's blurb says the opposite of its fourth panel** | *"Every one of them is somebody's favourite record and none of them is ours"* now sits four inches above a panel that says the museum holds his records in its own vault. One of the two sentences has to move. It is **not** rewritten here: the blurb was not on the list. | **M52** |
| **A struck claim survives one line lower on the same face** | The `[PAPA]` marker's second sentence — *"Every claim about an artist here is already on that artist's own card, sourced there."* — **renders**. The scrubber drops only the sentence carrying the marker. It is the same claim W1(c) was struck for, it is now the last line on the poster, and it is a note to the operator printed on the glass. | **M53** |
| **The figures on his own card are the ones this round just corrected** | 78 · Nine · *whole catalogue* · *Half of Crooked Home* are still on the artist card, the metrics note, the records note, a song card and the fact scroller. Six sites, listed in the row. | **M50** |

---

## W4 — DOES THE FACE STILL STAND AS THE SHOW'S POSTER?

**Yes, and it stands better.** Verified on the built bundle at desktop and at
386 CSS px.

What is left is: the title, a one-sentence blurb, **four large photographs the
artists chose of themselves**, each with a name at display size, a role in
mono, three lines of pitch and its own accent rule — and each one a door. That
is a bill. What went was ~110 words in which the house talked about its own
taste, its own standard and its own research practice, none of which was ever
the promotion.

Measured: single column at 386px, panels 24…346, `scrollWidth` 370 against a
386px viewport — **no horizontal overflow**; two-up at desktop, panels 500…1055
and 1077…1632. Zero console messages on load. All four acts render as
`<button>`; pressing one still lands in that artist's room.

**The honest cost, stated rather than argued away:** the poster no longer says
*why* these four. That sentence was struck because it congratulated the house,
not because the question is illegitimate — and the blurb's *"somebody's
favourite record"* is what is left carrying it. Whether that is enough is
Mike's, and it is the same page as **M52**.

---

## WHAT THIS ROUND ALSO PROVED

**The four-step prune procedure worked, and this time there was nothing to
repoint.** Anchors were checked BEFORE pruning (`OPERATIONS.md` §9): the five
rows about to go stale — the four struck strings plus *"Open the room"* — were
the anchor of **zero** RESTATED chains, so no repointing was needed. Pruned,
re-gated, and re-checked: **0 broken key references across 2,058 rows**. The
`[PAPA]` anchor those four strings all pointed AT (`b8736efb2feb3ae0`) survives,
which is why its other nine dependents are untouched.

**And a register row is not the same as a verified number.** *"78 songs on file
in the museum's own vault"* is classed **VERIFIED** with a real citation and has
been on the glass since v25. The citation is genuine; the count is a machine
artifact of the export's `song:` tagging. `provenance/README.md` §4 already
names this hole — *it cannot detect a sourced number going stale* — and names
this very string as the example. **This is that hole, hit.** It was not stale:
it was never the number it claimed to be.
