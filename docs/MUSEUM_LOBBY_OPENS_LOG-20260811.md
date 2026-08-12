# THE LOBBY OPENS, THE ADDRESS, AND WHAT THE RED NOTES TOOK
2026-08-11 · write packet · not committed, not pushed, not deployed
HEAD at start: `6897b5c`, working tree clean.

---

## A. THE LOBBY OPENS

### A1 — the copy that was there, and every not-open claim

**Replaced, verbatim** (`src/routes/WbHome.jsx:750–756`):

> We're not open yet.
> But you found us —
> which means *something.*
>
> The people who sign the guest book now
> will be remembered differently
> than the ones who come later.

**Every place the not-open-yet claim appears — there are three, and only one was
in the ruling:**

| # | where | the claim | status |
|---|---|---|---|
| 1 | `WbHome.jsx:750` — the lobby note | *"We're not open yet."* + the early-visitor sentence | **REPLACED** (A2) |
| 2 | `WbHome.jsx:627` — the lobby tagline, under WEIRD.BABY MUSEUM | **"something is being built here"** | **LEFT ALONE — waiting on Mike** |
| 3 | `WbHome.jsx:804` — the guest-book confirmation | *"You're in the book. Welcome, Founding Visitor."* | **LEFT ALONE** |

**#2 is the one to look at.** It is a second not-open sentence about 200px from
the new one, on the same screen, in the left column — *the museum is open* on the
right and *something is being built here* on the left. It was not named in the
ruling and rewriting it is a content decision, so it stands. Capture `01` shows
both at once.

**#3 is milder and may be intentional.** "Founding Visitor" is a reward for
arriving early; it survives the opening better than #2 does, because a museum
that opened today still has founding visitors. Named so it is not missed.

The three **share-card** descriptions are A5 and are report-only.

### A2 — replaced

`src/routes/WbHome.jsx`, Mike's two sentences, set as two lines:

> The museum is open.
> A new Record every day for ninety days.

The guest book beneath is untouched — it was never what made the room worth
arriving at, and the ruling did not reach it.

### A3 — can a stranger get from that line to the Record? **No.**

**Nothing on the lobby names the Record.** The directory is six rooms:
Weird.Baby Robots · Weird.Baby Music · Other Music Worth a Listen · Weird.Baby
Foundation · Gift Shop · Information Booth. Measured on the built page at 1280px.

**And that is a standing ruling, not an oversight.** `WbHome.jsx:658` records it —
**L1, 2026-08-06, MIKE: *"it is clutter here; visitors find it in Robots."*** The
row that used to be there was indented under Weird.Baby Robots. The file also
records what the ruling cost: *"the Record is the one thing in the wing that
keeps happening and a board listing rooms only would never say so."*

**The path today, for a stranger who has just read the promise:**

| step | what they must do | what tells them to |
|---|---|---|
| 1 | click **Weird.Baby Robots** | nothing — they must guess that a Record lives in a room called Robots |
| 2 | land on the wing's first album, *Weird.Baby Robots* | — |
| 3 | click track **01 The Record** in the tracklist | it is the first track, so it is at least at the top |

**Two clicks, and the first one is a guess.** `/robots/record` still exists as a
direct address and still opens the wing with the track selected, but nothing on
the lobby links it. A visitor who has just been promised a Record every day for
ninety days is given no route to one.

### A4 — the cheapest honest way, reported, **NOT BUILT**

Per the packet, this stops here for Mike.

**The cheapest is one word, not a new object: make the sentence itself the door.**
Set *"Record"* in the second sentence as the link to `/robots/record`. It costs
no new element, no banner, no call-to-action, and no line on the directory —
which is what L1 struck. The sentence already names the thing; a promise that
names a thing and does not open it is the odd part.

Two cheaper-looking options and why they are worse:

- **Restore the directory row.** It reverses L1 directly, and his reasoning
  ("a lobby directory that lists one wing's contents invites the next four")
  is untouched by this packet.
- **Leave it and rely on Robots.** Honest, and it makes the new sentence a
  promise the room does not keep for a first-time visitor.

**Nothing was added. Mike rules.**

### A5 — the three share-card descriptions, verbatim, not rewritten

`index.html`:

1. `<meta name="description">` — **"Weird.Baby Museum. Exhibiting the MGK robots and Worth A Listen."**
2. `<meta property="og:description">` — **"A museum of weird things worth keeping. The MGK robots, and music worth a listen. No ads, no affiliate links, no cut of anything you buy from an artist."**
3. `<meta name="twitter:description">` — **"A museum of weird things worth keeping. No ads, no affiliate links, no cut of anything you buy from an artist."**

**None of them says the museum is closed** — but none mentions the Record or the
ninety days either, so all three describe a museum where nothing in particular is
happening. The file's own note says why there is one card and not twelve: the SPA
is served from one shell and a static tag cannot vary by route.

---

## B. THE ADDRESS, IN MIKE'S OWN WORDS

### B1 — replaced

`src/data/artists/foundation.js`, the answer to **"Can I send you something?"**
The clause *"write to the address at the bottom of this page"* pointed at
something struck sitewide that morning. It now ends:

> …None of it exists today, so the honest answer is to say what you have.
> **Write to the guy currently running the place: papa@weird.baby**

**"currently" is intact and is noted in the code as load-bearing** — the role is
temporary by design and the word carries it. A future round that tightens this to
"the guy running the place" deletes the only part of the sentence that is about
the arrangement rather than the person.

**His sentence stands whole and last.** The clause it replaced was mid-sentence,
so folding his sentence in would have put two colons in one breath. The only
words lost are the dead clause and the "and" that joined it.

### B2 — it ships exactly where he put it, and nowhere else

| where | before | after |
|---|---|---|
| `src/` | 0 | **1** — `foundation.js`, the answer above |
| `public/` + `index.html` | 0 | 0 |
| the built dev bundle | 0 | **1** |
| the built **launch** bundle | 0 | **1** |

Measured by grep on the emitted chunks. Seen on the glass — capture `02`.

### B3 — where else it ought to carry it, **reported only**

Three places, in the order I would argue for them:

1. **The Information Booth's "How do I reach you?"** — deleted that morning
   *because its answer was the address*. `InfoBooth.jsx:299` says so in a
   comment. This is where Mike's sentence was FIRST ruled (D2, 2026-08-06) and
   the booth is the room a stranger goes to when the rooms did not answer them.
   Restoring the question restores a deleted row rather than inventing one.
2. **The robots front desk's "How do I get in touch?"** — deleted the same
   morning for the same reason (`robots.js:572`). It is the wing a visitor is
   most likely to have a provenance question about.
3. **`USE_RIGHTS`** (`house-copy.js`) — it says *"we are glad to be asked for
   those"* about the museum's own photographs and then gives no way to ask. It
   is the one surviving sentence in the building that invites a question it
   cannot receive.

**Nothing was added. All three are Mike's to rule.**

---

## C. THE SOURCES COME BACK

### C1 — what stopped rendering, verbatim

Four lines, one per artist, all in `src/data/artists/worth-a-listen.js`:

**Carsie Blanton** (`:334`)
> Sources: her own site and press page, read directly; Wikipedia for the biography; Shore Fire Media for “Shit List”; Folk Alliance International for the 2026 award; her own upload feed for everything dated 2026. Her politics are quoted from her songs and her own framing, not characterised for her.

**Hunter Root** (`:737`)
> Sourced from the museum's own foundation export and his own words in it. The store and the recent uploads were read directly off his own site and his own channel feed, 2026-08-02.

**Jesse Welles** (`:999`)
> Sources: wellesmusic.com read directly; Wikipedia for the biography, discography, charts and awards; Rolling Stone and Vulture for the reception; Farm Aid coverage for the Dave Matthews introduction; his own upload feed for everything dated 2026.

**Mikey Mike** (`:1283`)
> Sources: Faded Glamour's 2017 piece on “Doin' Me” (the Canon sync, the Rick Rubin involvement, the Rihanna and Universal credits); Apple Music and Deezer for the discography and the Salisbury origin; a 2020 Titusville interview for the 2019 European run. His own domain is deliberately not linked — see the ledger.

All four are still declared **VERIFIED** in the register — the data never moved
and the rows were never pruned. Only the route to the glass was cut.

### C2/C3 — where they went, and why there

**Into the card's own `lines` register**, as a `SOURCES` row.

```
lines: [ "NOTE     " + siteNote, "SOURCES  " + aboutNote ]
```

**Why that place and not a new block:**

- **It already exists and already does this job.** One artist (Mikey Mike)
  carries a `NOTE` row there today. The register is Courier Prime at
  `--fs-small` in `--wb-gold-lo`, with `padding-left: 9ch; text-indent: -9ch` so
  `KEY      value` keeps its column when it wraps (P23). `SOURCES` is padded to
  nine characters like `NOTE` because the indent is the device.
- **It is quiet by construction.** Measured on the glass: 13.64px, `rgb(87, 84,
  77)`, mono — the smallest and palest type on the card.
- **It shows the work instead of talking about it.** A register line is a flat
  statement of where a fact came from; a paragraph about how carefully the museum
  checked is the museum advertising its diligence — the exact fault Mike struck a
  sentence for once already (the WAL poster's foot). The difference is the whole
  argument for this location.
- **It sits below the doors, last before the footer.** A visitor who wants the
  artist gets the artist and leaves by a door; a visitor who wants to know how
  the museum knows reads one more line. That is the order the card was already
  built in.
- **An artist with neither renders neither** — `lines` stays `undefined` and the
  block is not drawn empty.

### C4 — what else the `papa` field took: **nothing**

Measured against `6897b5c~1` rather than assumed. **Seven `papa` fields existed:**

| file | count | content |
|---|---|---|
| `robots.js` | 3 | `[PAPA]` sentences only |
| `portal.js` | 1 | `[PAPA]` sentence only |
| `foundation.js` | 1 | `[PAPA]` sentences only |
| `worth-a-listen.js` | 2 | one `[PAPA]`-only (the bill face); **one `aboutNote` + `[PAPA]`** (the per-artist card builder) |

**Six carried nothing but markers.** The seventh — `worth-a-listen.js:1460`,
`papa: (a.aboutNote ? a.aboutNote + "  " : "") + "[PAPA] — the card copy…"` — is
the single casualty, and it multiplied across four artists because it is a
builder. The sources lines were the only thing lost.

Worth stating: they were lost **in both stages**. At launch the strip runs
`visitorProse`, which cuts by sentence, so `face.papa` became the `aboutNote`
alone and still rendered. Deleting the field took them off the shipped site too.

---

## D. VERIFY AND LOOK

### D1 — provenance, chains checked FIRST

**Four new/changed strings, all declared:**

| string | class | how |
|---|---|---|
| the foundation answer (edited) | **RESTATED**, `r: docs/canonical/THE_CHARTER.md` | carried across from its predecessor row |
| `SOURCES  {}` | **HOUSE** | matched to its sibling `NOTE     {}` row, same `p` path, same class — it is label chrome; the value carries its own VERIFIED row |
| "The museum is open." | **MIKE** | his ruling, sourced to it |
| "A new Record every day for ninety days." | **MIKE** | same |

**The chains, checked before pruning. Eight stale rows, and every one is free:**

| row | inbound `r:` |
|---|---|
| `WbHome.jsx:163–168` — the seven fragments of the old lobby note (MIKE) | **none** |
| `foundation.js:717` — the old answer (RESTATED) | **none** |

Nothing resolved to any of the eight, so pruning cost no repair. Register
**1978 → 1970**. Gate **PASS**: 0 undeclared, 0 stale, 0 RESTATED failures.

### D2 — gates

| gate | result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings — baseline** |
| `npm run build` | green |
| `npm run build:launch` | green |
| `npm run provenance:gate` | **PASS** |
| `npm run reveal:check` | **PASS** |
| `npm run assets:orphans` | **0 — 0 judged, 0 unjudged** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** |
| `npm run reveal:day` | nothing to move |

### D3 — the lap at 1280px, and what I SAW

**The lobby.** "The museum is open. / A new Record every day for ninety days."
Page overflow 0. No trace of the old note anywhere in the text.
**And the tagline "something is being built here" is still on the same screen**,
in the left column under the museum's name — which is how A1's third finding was
found: by looking, not by grepping. The directory reads six rooms and **none of
them is the Record.**

**/foundation.** The answer is not on the FAQ face a visitor first meets — the
questions are split by an `on:` field, and this one lives on **The Ledger**'s FAQ,
two albums along. Opened it and read the sentence on the glass:
*"…None of it exists today, so the honest answer is to say what you have. Write
to the guy currently running the place: papa@weird.baby"* — with "currently"
intact. Capture `02`.

**Every /wal artist card.** All four walked and all four checked:

| card | NOTE | SOURCES |
|---|---|---|
| Carsie Blanton | — | **yes** |
| Hunter Root | — | **yes** |
| Jesse Welles | — | **yes** |
| Mikey Mike | yes | **yes** |

Mikey Mike carries both, which is why he is the card pictured. The hanging indent
holds the column across all four wrapped lines. Capture `03`.

### D4 — delivered

`C:\AI\_manual-samples-20260811\_FOR_CLAUDE\` — three frames and `FOLDER_KEY.txt`.

---

## FILES

```
src/routes/WbHome.jsx                 the lobby note — Mike's two sentences
src/data/artists/foundation.js        the address clause — Mike's sentence
src/data/artists/worth-a-listen.js    the SOURCES row in the lines register
provenance/register.json              4 rows declared, 8 stale pruned (no chains)
docs/MUSEUM_LOBBY_OPENS_LOG-20260811.md
```
