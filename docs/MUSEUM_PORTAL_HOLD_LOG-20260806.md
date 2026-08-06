# THE PORTAL HOLD + THE PULL-BACK — round log

**2026-08-06 · H1–H8 · autonomous, single agent, drafting lane, sealed with one commit.**

Gates: `npm run lint` **11 errors / 9 warnings = baseline** · `npm run build`
**green** · `npm run provenance:gate` **PASS** (0 undeclared · 0 stale · 0
invention) · `npm run reveal:check` **PASS** · `npm run parity:gate` **PASS, 4
shared · 0 divergences** · `npm run assets:orphans` **0** · lap **on the built
bundle under `wrangler dev`**, desktop only.

---

## THE ONE-PARAGRAPH VERSION

Eight instructions, all eight built, and **the round's largest finding is a
consequence of trying to PROVE the first one rather than of doing it.** H1 asked
for a gate that fails when a held thing becomes reachable; building the gate
meant reading the built bundle to check what the gate could not see, and the
bundle turned out to be shipping **the whole reveal ledger** — 162 rows, every
`name`, `where`, `dep` and `note`, out of one JSON import in `src/lib/reveal.js`
that exists to draw a single LIVE / NOT BUILT column. That file is where this
house writes down what it holds and does not show. It included both of the eggs
whose only written form is that table, and the Portal's own engravings on the
day the Portal was held. 64 KB, in a chunk every visitor downloads.

---

## H1 — THE PORTAL IS HELD, AND THE GATE IS THE DELIVERABLE

**Mike:** *"a held thing must be UNREACHABLE BY A VISITOR and the gate must FAIL
if that stops being true."*

### What was built

- **The album left `robots.js`.** `src/data/artists/portal.js` is a module
  nothing public imports; `Robots.jsx` asks for it with a dynamic `import()` only
  when the browser flag is set, and splices it back at `PORTAL_AT` so the
  position Mike gave it survives the hold. `vite.config.js` parks the chunk under
  `assets/held/`; the build's own `heldChunkGuard` fails if it lands anywhere
  else. Measured: `assets/held/portal-*.js`, 2.88 KB.
- **A SECOND HELD DIRECTORY, and it is the half `/hr` did not need.**
  `/assets/held/` catches BUILT chunks. The Portal's material is not all built —
  the twin is a 620 KB hand-written HTML page, its cover and poster are PNGs, and
  all three are served straight off the asset store at addresses anybody can
  type. So `public/held/` is the public tree's own held directory, refused by the
  same cookie, named in `src/worker.js` (`HELD_DIRS`) and in `wrangler.jsonc`
  (`run_worker_first`).
- **The twin's address left the public bundle.** `RobotsExhibitFlow.jsx` used to
  hold `/robots/twin.html` as a literal, in a chunk fetched on every visit to
  `/robots`. The door now hands its own `src` and frame title across in the event
  detail, and **a listener handed no `src` opens nothing** — the only thing in
  this museum that can open the twin is the held album.
- **The public site stopped mentioning the Portal.** Two FAQ questions —
  *"Is the Portal the real machine?"* on the VIIIp and *"Is the mainframe on the
  Portal?"* on the NIAC — were the only two rows on the public site answering
  questions about a held room. **Moved, word for word**, onto the Portal's own
  FAQ. Two more clauses were struck where they pointed at the held track and the
  sentences around them survive whole.

### The gate — `reveal/reachability.mjs`, called from the one validator

Eight checks, and **not one of them reads a row's opinion of itself except to
contradict it**:

| | |
|---|---|
| 1 SELF-CONTRADICTION | a HELD row that says how a visitor gets there |
| 2 A LEAK OUTWARD | a held module pointing at a public file |
| 3 THE DOORS | worker + wrangler + vite still agree on the prefixes |
| 4 A LEAK INWARD | a public file pointing at held material |
| 5 THE CARRIER | a BUILT held row must live behind a door |
| 6 A PUBLIC ADDRESS | a held row naming a file outside the held tree |
| 7 THE ROUTE | a held route must be wrapped on the router |
| 8 THE PROJECTION | the ledger itself does not travel to the browser |

**IT FOUND SEVEN THINGS THAT WERE ALREADY UNTRUE**, which is the answer to
whether the check was worth building:

- `route.hr` and `route.hr.archive` still carried *"by URL only"* — true until
  the previous round put the wing behind a password, false since.
- `route.admin` said HELD **and** *"by URL only"* in one row. `/admin` is a real
  page anybody who types it opens, and it has to stay that way because it is the
  door the held wings are opened THROUGH. **It is REVEALED with `shown: false`
  now** — register **P-c**.
- `twin.scaffold`'s reach was *"dev only: 'Show stubs'"*, which is a note wearing
  the wrong field: `reach` is how a VISITOR gets somewhere and a developer flag
  is the opposite of one.
- `phys.manual.original`'s was *"stated in the wing's FAQ"* — **being mentioned
  is not being reachable.**
- `egg.niac.operator` named `public/robots/reference/mgk-viii`, a public
  directory holding ten unpublished photographs of a figure nothing in the museum
  shows.

**The first cut of check 4 reported nine faults and every one was a COMMENT** —
`held.js` explaining what `/assets/held/` is, `HeldWing.jsx` explaining why it is
not the lock, this round's own headers. A gate whose output is nine false
positives is a gate somebody turns off, so the scan strips comments first.

### The deliberate breach — nine, on copies, all caught

| breach | caught by |
|---|---|
| a HELD row handed a reach | 1 |
| a HELD row naming a file outside `public/held/` | 6 |
| the Portal album moved back into a public module | 5 |
| the `/held/*` routing rule dropped from `wrangler.jsonc` | 3 |
| the worker stops refusing `/held/` | 3 |
| a public module handed a held address | 4 |
| an undelivered picture put back at a public address | delivery |
| the one DELIVERED picture hidden behind the door | delivery |
| a new picture arriving unclassified | delivery |

**9/9.** Every specimen ran against a file copy or an in-memory row patch and the
tree was restored in a `finally`.

### And it was verified on the wire

`wrangler dev` on the built bundle:

```
404  /held/robots/twin.html                              (no cookie)
404  /held/robots/art/portal-cover.png                   (no cookie)
404  /held/robots/reference/photos/front_full.png        (no cookie)
404  /assets/held/portal-Piw93Gxp.js                     (no cookie)
200  /robots/reference/photos/rear_power_switch.png      the one delivered picture
200  /robots/art/wbr-cover-logo.png                      the wing's own sign
200  /api/held · /api/guestbook                          JSON — the back end is alive
```

With the cookie: the chunk 200s at 2,862 bytes, the cover at 245,897, and the
twin at **620,858 through a 307 that preserves the query string** (Workers
Assets' own `html_handling` redirect; both the `.html` address and the redirect
target are under `/held/`, so the lock holds through it).

---

## H2 — THE PULL-BACK RULE

**Mike:** *"stated generally and enforced — this applies to images, the manual,
and probably more, so state it once rather than listing categories. **NOTHING
PUBLISHES UNTIL THE RECORD DELIVERS IT.**"*

### The sentence, and the boundary it draws

> **A picture of the objects does not appear on any public surface until a
> Record entry delivers it.**

The Record is the log of these machines arriving and being opened. A photograph
of one cannot honestly be on the site before the entry that brings it in — that
is not a policy about images, it is what the Record IS. **The one exception is
SIGNAGE**, declared in writing per file with a reason (`SIGNAGE` in
`reveal/delivery.mjs`, one row today), and **there is no fall-through**: a file
that is neither delivered nor signed-off fails, for the same reason
`transfers.mjs` has none.

### What went dark — exactly

| | |
|---|---|
| **the mainframe's Image Archive** | 5 groupings, 5 photographs |
| **the portable's Image Archive** | 4 groupings, 9 photographs |
| **album covers** | MGK-NIAC, MGK-VIIIp (both composite a machine photograph) |
| **viewer posters** | both machines, with their captions |
| **face stills** | the front desk's family shot, the VIIIp's lit glass, both FAQ plates |
| **the manual** | `structure-issue-p1.png` |
| **files moved** | 28, under `public/held/` |
| **what stayed** | `rear_power_switch.png` — **the one picture a Record entry delivers**, on the entry that delivers it — and `wbr-cover-logo.png`, the wing's own wordmark sleeve |

**The files MOVED rather than being unreferenced**, and that is the load-bearing
half: taking a picture off a page does not take it off the server, and an
unlinked address is still an address.

### What the room looks like now

The carousel draws its own placeholder for a coverless album — **and that
placeholder had never once been on screen.** Every album in the museum carried
art, so `placeholderTile()` was code that was correct in 2026-06 and untested
since: the ground is `#0c0c0c → #050505` and the title is `--wb-gold`, which was
a pale gold when it was written and has been `#211f1c` since the house lights
went up. **Two black rectangles.** It is the A1 shape exactly — a dark-ground
component left standing after the ground stopped being dark, invisible because
nothing exercised it. It is a sleeve with no art on it now, in the museum's own
card and ink, and **only the browser lap could have found it.**

The archives **stay built and say so**. `ArchiveWall` returned `null` on an empty
wall, so the shelf VANISHED rather than emptying — the same defect `logEmpty` was
built for one round earlier. `archiveEmpty` is the third scrubbed scalar of that
kind.

---

## H3 — THE PORTAL'S BUILD WORK

### (a) The nameplate

**Mike's references were UNIVAC plates:** *"a raised chrome bezel; a black field
with brushed-metal letterforms sitting PROUD of it; stamped-in-place fields
(MODEL NO., SER. NO., DATE) with values struck into a lighter recess; an accent
panel beside the wordmark. Unmistakably a BADGE bolted to a machine."*

It reverses P2's plate, which reversed the one before it, and **each reversal
answered a different complaint.** The first plate was engraved steel and read as
a sixth control. P2 inverted it to bright metal with black ink, which is a DATA
PLATE and is unmistakably not a control — that complaint is answered and stays
answered. What it still was not is a maker's BADGE, and **the difference is not
colour, it is DEPTH**: a data plate is printed, so everything on it is at one
level; a badge is assembled, and every element is at a different one. Four
levels, from the machine outward: the formed bezel (with four fixings, because
two would read as a hinge) · the field, recessed BELOW it · the wordmark in
relief, cut from a real brushed gradient with `background-clip:text` · the data
struck INTO a lighter recess, off-square and off-baseline, because a hand-stamp
is a hand.

**Two of the three fields ship empty and that is Doctrine 12**, not an oversight
— register **P-a**. `MODEL NO.` reads `TYPE 8p` because the plate already said
it.

### (b) The panel floats

**DONE BY DELETION.** The face painted itself `#000`, zeroed its body padding and
re-coloured its heading for a dark ground — so the steel ran to all four edges of
the pane with a slab of black behind the head, hard against the museum's paper.
That arrangement was written when the panel was meant to stand on *"the same
black the portal view stands on"*, and **the portal view it was matching is
`kind:"portal"`, which nothing has declared since P2.**

**THIRTEEN `.vp-face-portal` RULES WERE STYLING A CLASS NO ELEMENT HAS CARRIED
FOR A FORTNIGHT**, and they were still being reasoned about: F0 spent a paragraph
on 2026-08-03 preserving `.vp-face-portal .vp-face-sub` at #8a857a
"byte-for-byte" on a face that did not exist, and A1's note three days ago named
the selector as one of two dark-ground faces that "override it already". **Dead
CSS does not announce itself; it gets cited.** The two
`:not(.vp-face-portal)` exclusions went with it, which is the half that actually
simplifies something.

The panel takes the house frame now — paper mat, card, a steel plate floating on
it with its own drop shadow, capped and centred so it does not stretch to the
card's edges. Measured on the built bundle: panel **743×508** inside a **796×550**
card inside an **832×586** face.

### (c) Three tracks

**PORTAL · Portal Feed Controller · FAQ.** The FAQ's two questions were moved, not
written. **One judgement is Ops' and is flagged rather than buried** (**P-b**):
Mike named a row and did not say what stands behind it, and a row that opens
nothing is a dead control — so it is the door. The latch one row down keeps its
own job.

And the panel's own `title` is struck: as of (a) the instrument **names itself in
metal**, so a 22px heading saying FEED CONTROL above a badge saying FEED CONTROL
is the second object saying what the first already said, one round after the
first was built.

---

## H4 · H5 · H6

**H4 — the selected track is highlighted on entry, everywhere.** The room has
always opened on a track and has never said which: `activeTrack` is null until
somebody clicks while the viewer beside it is already drawing something.
**Derived, not set** — the highlight falls where the viewer already is, state
stays null, and nothing downstream changes what it draws. The fallback chain is
the viewer's own, and both wing kinds collapse to one rule (a playable track
beats a face on both).

**H5 — the year overlay, and the gradient under it.** Confirmed as an overlay by
reading the cover file: the art carries no lettering but its own. It was printing
on **two covers in the whole public museum** — the VIIIp's 1965 and Weird.Baby
Vol. 1's 2026 — every other album declaring `year: null`. `.cf-overlay` was an
empty div whose only job was to darken the foot of the active cover so the year
had a ground; **deleting the thing and keeping what compensated for it is A1's
exact mistake, one round old.** Cost, named: an album's year is no longer printed
on the carousel. It is still declared, and still printed by the PLACEHOLDER cover
— which is where it informs rather than defaces, because there is no picture to
lay it over.

**H6 — the shouty-caps sweep, and the data was only half of it.** The pattern is
**exactly ten pairs, all one shape**: a tracklist row in sentence case and its own
face heading holding the identical words SHOUTED — The Record / THE RECORD, Image
Archive / IMAGE ARCHIVE, Executive summary / EXECUTIVE SUMMARY, across four
wings. C1 ruled the ROWS into one case a fortnight ago and the faces were never
brought along. **And `.vp-face-title` carried `text-transform:uppercase`**, so
rewriting the strings alone would have changed nothing a visitor sees — which is
the Law of the Visible Line's own test applied to an edit rather than to a line.
Both halves moved together. `.vp-face-sub` keeps its caps: it is a tracked micro
label, a different object at a size where caps are a label rather than a raised
voice.

---

## H7 — THE CONTACT SHEET

`npm run contact-sheet` → **`docs/CONTACT_SHEET.html`**, 906 KB.

**257 images across both repositories · 85.6 MB of source · 27 on the glass · 28
referenced by nothing · 202 never served · 28 behind the door · 0 carry a
verdict · 27 rows point at a file that is not on disk.**

It computes nothing new — every column is read off `provenance/asset-table.json`,
because that table is already the authority on files. What it adds is the one
thing the table cannot be: **a picture on every row.** A path is not something
anybody can rule on. Filters for each role, the held tree and the gone-from-disk
rows; clicking the ✗ on a tile gathers a plain-text kill list to copy. **It writes
no verdict and cannot** (Doctrine 15).

---

## H8 — THE REGISTER, AND ONE ITEM REFUSED

- **[C39](../docs/OPEN_ACTIONS.md)'s NUL-byte class caught a seventh instance and
  prevented an eighth** — both in this round's own patches, one in
  `tools/asset-table.mjs` and one in `Exhibit.css`. The class is now three rounds
  old and still producing; a `grep` reporting *"binary file matches"* is the tell.
- **M99 is a mechanism instead of a note.** It recorded five drifted rows in
  `assets-declare.mjs`; this round moved 28 pictures and the drift is **45**. A
  `--write` would have deleted every artist cover, every Foundation sleeve, the
  house mark and every held plate, in silence. It **REFUSES** now, and names what
  it would have lost. Repairing the drift is a decision about which of the two
  files is the source — **H-b**, Mike's.
- **[C6](../docs/OPEN_ACTIONS.md) was looked at and left.** Policing `[[n]]` door
  markers needs a fourth reader in `reveal/record-entries.mjs`, whose reader
  split is a documented constraint. That is not unambiguous, and the instruction
  said unambiguous.

---

## THREE THINGS NOBODY WAS LOOKING FOR

### 1. `face.presets` is read by two renderers and both were live

L2 (2026-07-31) built the Portal's `ARRIVE AS` recipe selector on `face.presets`.
N9 (2026-08-06) built the Image Archive's groupings and took **the same field
name on a different object**. Both renderers were unconditional, so **each of the
two Image Archive faces was drawing its grouping strip AND, below the wall, a
control reading `ARRIVE AS · The whole cabinet [ENTER]`** — a dropdown of
photograph groupings wired to open the twin with `preset: "whole"` — and a still
on such a face was a portal door. Nothing in the tree declared it and neither
round's notes knew.

The recipes have had **no declaring face since P2** replaced the Portal's face
with the panel. Deleted, with `recipeIdx`, `enterRecipe`, `.vp-face-door` and six
CSS rules. The groupings keep the name because they are the only thing using it.

### 2. C32's content-move carry had never once fired

`tools/asset-table.mjs` keyed its hash pool with a NUL between repo and hash and
read it back with a SPACE, **eighteen lines apart**. So the mechanism whose whole
purpose is *"a prior row and a new file that share a hash inside one repo are the
SAME FILE MOVED"* could not match anything, ever.

**It was invisible because its failure mode is the one it was built to fix:** a
moved file appears as a lost judgement, which is exactly what the C32 banner
reports and exactly what everybody has read as *declare the rename by hand*. This
round moved 26 judged files at once and every one came up missing, which is the
first time the shortfall was big enough to look twice at. One key function, both
callers.

### 3. The reveal ledger was shipping whole

Described at the top. `src/lib/reveal.js`'s own header says, in capitals, that
the ledger returns STATE and never WORDS — and the enforcement was the FUNCTION
SIGNATURE. **A bundle does not ship signatures. It ships the file.**
`reveal/public-view.mjs` is a four-field allowlist (`id`, `build`, `state`,
`shown`), applied by a vite plugin at `enforce:"pre"` — one rule, two callers, the
same arrangement and the same reason as `stripVaultAudio`. Measured: the shared
chunk **184.57 KB → 120.84 KB**, and zero occurrences of the Portal's
engravings, the twin's address or either egg in any public chunk.

---

## THE LAP

On the built bundle under `wrangler dev`: `/` · `/admin` · `/robots` (public and
behind the door) · the NIAC album and its empty archive · the Portal's three
tracks and its nameplate · `/wal` · `/wb` · `/foundation`. Everything above that
is described as *measured* was measured there.

**THE 390px HALF DID NOT RUN, FOR THE THIRD ROUND RUNNING.** `resize_window`
reports success and `window.innerWidth` reads **1228** — the operator's window
will not go below it. Said plainly rather than left as a silence; it is **M97**
and it is unchanged.

**And the admin door needed a paragraph.** The lap is what showed it: the door
explains the Hunter Root wing and said nothing about the Portal, which has **no
address of its own** — opening the door does not take you anywhere, it makes
`/robots` a deck of four instead of three. Without a sentence saying so the only
way to know is to notice an album appear.

---

## WHAT IS OPEN

New rows: **H-a** (the front desk's picture is gone again — M29 re-opens by
consequence) · **H-b** (the 45-row declarer drift) · **H-c** (the stowed shelf and
`archiveUnit` are now exercised by nothing) · **P-a** (the two empty stamped
fields) · **P-b** (what stands behind the PORTAL row) · **P-c** (`/admin` is not
held).

Unchanged and worth re-reading before the next round: **M97** (the 390px lap),
**T-A** (24 pages against 61), **M61** (the manual stays offline).
