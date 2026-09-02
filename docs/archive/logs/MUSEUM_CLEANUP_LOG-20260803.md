# THE CLEANUP ROUND — run log

**2026-08-03 · autonomous single-agent Code-lane round on Mike's remote-control
brief · drafting lane, no git until seal · standing gates + vite build + desktop
and 390px browser lap.**

Frames: `docs/cleanup-round-20260803/`.
Prior round (the one this cleans up after): `docs/MUSEUM_FOUNDATION_LOG-20260803.md`.

---

## C1 — THE RECORD CARDS ARE OFF THE WALL

**Mike:** *"the per-song provenance cards (MAKER / MEDIUM / PUBLISHED BY / ALSO
AT / VERIFIED / FROM / RELEASED AS / PRODUCED BY / SOURCE) are OUR audit trail
dressed as content — useless to a visitor, without direction or purpose, and
redundant against the numbered paragraph that follows for the same song."*

### What was actually there

Every one of those nine labels is a `k` in a WAL song's `card.tombstone`, and
`aboutSongsTrack()` (`worth-a-listen.js`) turned each song's tombstone into a
`sideboxes` entry titled *"<song> — the record"*. So the register was generated,
not authored — one `sideboxes:` key produced all eight boxes across four
artists.

**The third charge is the one that settles it, and it is worse than stated.**
`Exhibit.jsx` draws `sideboxes` (:3268) BEFORE `entries` (:3358). On a two-song
face at 1706×900 that put two grey registers across the entire first screen, and
pushed every word written for a visitor below the fold. Measured on glass before
the change: the face LANDED on `'94 — THE RECORD / MAKER Hunter Root / FROM
Crooked Home / MEDIUM Official music video / ACCESSION MV-20260523-001 / SLEEVE
… / ALSO …`, and the numbered entries were not visible without scrolling.

The redundancy is literal: `FROM  Skipping Stones That Sink Before They're
Thrown` and `MEDIUM  Official music video` sat directly above a paragraph
explaining what the song is and why it is in the room.

### What changed

**One key deleted.** `sideboxes:` is gone from `aboutSongsTrack`. Nothing else in
the function moved.

**Every `card.tombstone` stays in the file, untouched** — that is the whole
shape of Mike's instruction ("KEEP the provenance in the config/ledger where it
belongs"). Verified after the edit: 15 `tombstone:` keys and 8 `k: "Maker"`
entries still in `worth-a-listen.js`. The accession ids, the oEmbed
`author_url` checks and the transposition ledger that caught two swapped
artist-pairs are all still the record; they have simply stopped being furniture
in a public room.

**It does NOT generalise to `aboutArtistTrack`.** Its four `sideboxes` are the
artists' own material — awards, catalogue, billing, chart positions — which is
content a visitor came for rather than a record of how we checked it. Left
alone, and the distinction is written into the file so the next session does not
"finish the job".

### The hook, re-applied

Mike named the risk in the same breath: *"it must not become a text-only
landing."* The entries already carried the song's own poster (F1's `entries[].img`),
so the face was never going to be pure type — but the plate was `clamp(96px,17%,168px)`,
sized for a face that had a second column of furniture competing with it. It no
longer does.

`.vp-fe-plate` → **`clamp(140px,26%,260px)`**. Measured after: 260px on desktop,
326px (full measure) in the 390px column stack. The face now lands on the song's
picture at a size a visitor reads as a picture.

**One consumer, checked rather than assumed:** `.vp-fe-plate` renders only where
an entry declares `img`, and About the Songs is the only face in the building
that does (`robots.js`'s `img:` hits are all collage tiles; the wing's Record,
FAQ, Contact and Firmware entry lists declare none). Zero bytes of robots-wing
markup change.

**Verified on all four artists:** `recordBoxes: 0`, `plates: 2`, zero broken
images — Carsie Blanton, Hunter Root, Jesse Welles, Mikey Mike.

---

## C2 — THE ROOM IS RENAMED, AND THE RENAME IS SWEPT

**Mike's ruling:** "Foundation" carries a legal expectation the charter
deliberately refuses, and he wants to stay entirely out of any space requiring
legal today.

The last round saw the same tension and answered it by making *"there is no
fund"* the first sentence on the page. That was defensible and it was the wrong
trade: it left the museum arguing with its own signage. **A name that has to be
walked back in its own first paragraph costs a visitor something to read.**

### The three names considered

| name | verdict |
|---|---|
| **Where the Money Goes** | **CHOSEN.** Zero legal freight — a direction, not an entity. Says what is behind the door in the words a stranger would use to ask. And it is not invented for this round: it is **this house's own phrase for this exact subject** — the W5 ruling in `worth-a-listen.js` retired the where-does-the-money-go block from the artists' cards because it "lives in W.B's own FAQ", and this room is where that FAQ went. |
| The Ledger | Shortest, and it matches the room's own hook. **Cut:** it implies books, accounts and periods — the machinery the room exists to deny. A visitor arriving at "The Ledger" expects figures to check; that is "Foundation" wearing a different coat. |
| Nothing Is Kept | The charter's own sentence, maximum house voice, no freight at all. **Cut on the directory board:** a stranger scanning six lines cannot tell what room it is, and M8's law for that board is that the names say what KIND of thing each entry is. |

No `[PAPA]` on the name: it is a signpost, not a position, and the phrase is
already published in this building.

### The sweep — every reference, not just the visible string

| surface | before | after |
|---|---|---|
| route | `/foundation` | `/money` |
| files | `Foundation.jsx` / `Foundation.css` | `Money.jsx` / `Money.css` (old two deleted) |
| component | `Foundation` | `Money` |
| room attribute | `data-room="foundation"` | `data-room="money"` |
| CSS prefix | `.fnd-*` | `.mny-*` |
| title bar | "The Foundation" | "Where the Money Goes" |
| directory board | "The Weird.Baby Foundation" | "Where the Money Goes" |
| Q1 | "Is this a foundation?" | "Is this a charity?" |

**Share tags needed no change** — checked: `index.html` carries one site-wide
`og:`/`twitter:` set and the retired word never appeared in it.

### The redirect that was nearly not written — and the check that saved it

**`/foundation` → `/money`, `replace`.** This is the one place the retired word
survives on purpose, and the reasoning is worth recording because it went the
wrong way first.

The round was scoped against a fact that was true at session start: v40 was
**committed and unpushed**, so `/foundation` had never reached a deployed build,
so no link in the world could point at it, so a permanent alias would only keep
the retired word alive in the one place a rename is supposed to remove it from.
That argument was written into `App.jsx` and into this log.

**Then it was checked against the live site instead of trusted.** `curl
https://weird.baby/foundation` → **200**, and the deployed bundle
(`assets/index-DB9OIR29.js`) carries `/foundation`, `The Weird.Baby Foundation`
and `Is this a foundation` — **Mike pushed AND deployed v40 mid-round**, while
this rename was being written.

**Without the redirect, Mike's next deploy breaks a live URL** — and breaks it in
the worst available way: there is no catch-all route in `App.jsx`, so an
unmatched path renders the shell and nothing inside it. A blank page, not even a
404. Verified after the fix: `/foundation` → `/money`, title bar reads "Where the
Money Goes", the ledger renders.

**The lesson is Rule 0's, exactly.** The premise ("never deployed") was true when
the session started and false by the time it was acted on, and the only thing
that caught it was probing the live surface rather than reasoning from the
session's own opening state.

**Board casing:** the entry is set "Where the Money Goes", matching "Other Music
Worth a Listen" — every other line is title case and a lone sentence-case entry
reads as a typo, not as a voice.

### One regression the rename caused, caught on glass and fixed

At 390px the title bar gives the room name **196px** and "WHERE THE MONEY GOES"
needs **220px**, so it printed **"WHERE THE MONEY …"**. Every other room measured
0px over — booth, shop, `/wal`, `/hr`, `/robots` — which made this the only
truncated title in the building, and it was truncated by the rename rather than
by the bar.

MuseumBar's ellipsis is a deliberate mechanic and is **not** overridden in
general; its own note defends trailing-off at 320px as better than a name printed
over the exit, and that judgement stands. But a room whose whole identity is a
five-word phrase loses the phrase, not a tail — "WHERE THE MONEY …" is a
different sentence. So this room takes one further step down and **takes it
alone**: `html[data-room="money"] .wb-bar-room` at ≤430px, 0.7rem/0.04em,
measuring 188px against the 196px available. Re-measured after: `/money`
`truncated: false` at 11.2px; booth, shop, `/wal`, `/hr`, `/robots` all
unchanged at 12.8px.

Before/after frames: `C2-390-title-truncated-BEFORE.jpg` → `lap-390px-money.jpg`.

---

## C3 — IT SHIPS, AND IT CLAIMS NOTHING

**Mike:** *"no one important is going to do real research on us right now; I
prefer viewing stuff online."* THE_CHARTER being DRAFT v0.3 is not a blocker.

Shipping raises the bar on one specific thing, so the room was audited line by
line against it: **nothing on the page claims a legal status, a registration, or
a tax treatment.**

Scanned every answer's `textContent` (including the collapsed `<details>`, which
`innerText` does not reach) for `501(c) | non-profit | registered | registration
| charity number | tax | deduct | incorporat | LLC | foundation | charitable`.
**Two sentences matched, and both are correct:**

1. Q1's denial — *"There is no registration, no charity number, and no receipt at
   the end of it that does anything to your taxes."* A disclaimer, which is the
   point.
2. Q4 — *"To established charitable organisations"* — describes the
   **recipients**, not us.

**Zero occurrences of the retired word anywhere in the room.**

**Q1 was rewritten**, not just retitled. "Is this a foundation?" only had to be
asked because the room used to be called one; "Is this a charity?" is the
question a stranger actually arrives with, and its answer is the room's licence
to ship — it denies the registration and the tax treatment in one breath, so
nobody can infer either from the museum's silence.

**One subtraction, stated rather than slipped in.** The charter's clause 3 lists
*"the design, the code, the shelf, the legal work"* as the gifts of service. **The
legal work is no longer listed in Q10's answer.** A room that tells a visitor in
Q1 that there is no registration and no entity, and then mentions its ongoing
legal work four questions later, is describing machinery it has just denied. The
clause is **unchanged in the charter**, which records what is accepted; this is
the room, which describes what is here.

**Marker discipline re-verified live after the rewrite:** twelve questions,
**zero `[PAPA]` leaks**, zero bracketed leaks of any kind, and every scrubbed
answer ends on a whole sentence.

---

## C4 — THE PORTRAIT EXISTED

**Mike:** *"fine as-is unless a better vault image exists; check and use the best
available."* Last round's own note had pre-committed the answer: *"When a
portrait exists this is one string."*

**The vault was checked, not assumed.** All 49 artifacts in
`src/data/exhibits/hunter_root.json`, of which exactly three carry
`media_type: "photo"` — and each was **fetched and looked at**, not filtered on
metadata:

| artifact | what it is | verdict |
|---|---|---|
| `MV-20260419-002` | a bearded puppet by ElmThree Productions; filed under the exhibit because the reel references Hunter Root | not a picture of him at all |
| `MV-HR-20260405-035` | him, grinning, holding a chip sandwich (Facebook, 2019-05-21) | real and characterful, but the capture is of the **post** — FB header, poster name and date, and a browser scrollbar down the right edge |
| `MV-HR-20260405-037` | Instagram capture whose photo panel is a clean front-facing smiling portrait: driver's seat, tie-dye Chet Vincent tee, daylight | **taken** |

Cropped out of the Instagram chrome at the capture's own resolution
(3840×1823 → panel 1197×1499 at 880,75–2077,1574 → resampled to 1100 wide, JPEG
q88) → `public/images/wal/hunter-root-plate.jpg`.

**Not a new rights decision:** same class as the file it replaces — our own
vaulted catalogue of our own house artist, released in MediaVault and exported by
our own tool. **Nothing was fetched from an outside surface**; the crop is of an
asset the museum already held. Logged in
`docs/WAL_PHOTO_PROVENANCE-20260802.md` with the other five, plus the two
rejections.

**And the coverflow gets its file back.** `art` and `plate` are no longer the
same image, so pressing the record and reading his card are now two different
pictures — which is exactly what the duplication cost.

### The defect C4 exposed, and fixed

The new plate rendered **letterboxed inside its own frame**. Measured, not
guessed: with `height:min(48cqh,210px)` fixed and the width left to the flex
line, the 1100×1377 portrait resolved to a **420×210 BOX**, so
`object-fit:contain` painted the picture at 168×210 and left **126px of empty
paper on each side, with the 1px border ringing the empty box** rather than the
photograph.

**Carsie's 1200×630 landscape escaped it** because its natural width at that
height already sat inside the clamp — which is why the defect was invisible until
a plate taller than it is wide arrived. **Jesse Welles's 1500×1878 was sitting in
it too, and has been since F1 placed it.**

Fix: stop fixing the height. Both axes become maxima
(`max-width:min(100%,420px); max-height:min(64cqh,300px)`, plus
`align-self:flex-start` so the flex column stops handing the image a cross-size
it never asked for), so the picture's own ratio decides the box on every plate.
Scoped to `[data-exhibit="wal"]`, which already had its own override line.

**Measured after, all three:**

| plate | natural | box | ratio nat → box |
|---|---|---|---|
| hunter-root-plate.jpg | 1100×1377 | 240×300 | 0.799 → 0.800 |
| carsie-blanton-poster.png | 1200×630 | 420×221 | 1.905 → 1.897 |
| jesse-welles-plate.jpg | 1500×1879 | 240×300 | 0.798 → 0.799 |

This is the same principle F1's own note states — *"the height sets the size and
the width follows the picture's own aspect"* — applied on the axis F1 could not
test, because until this round no WAL plate was taller than it was wide.

---

## GATES

| Gate | Result |
|---|---|
| `npm run lint` | **11 err / 9 warn** — identical to the HEAD baseline, zero new |
| `npm run build` | green (71 modules, 667.47 kB / 184.61 kB gzip) |
| Desktop lap | 1706×900 — `/`, `/money`, `/wal` × 4 artists × About the Songs + About the Artist |
| 390px lap | genuine 390×740 same-origin iframe (injected, nothing written to the repo) |
| Horizontal scroll @390 | **zero page-level** on `/`, `/booth`, `/money`, `/shop`, `/wal`, `/robots`, `/hr`, `/wb` (373 ≤ 390 on all but `/`, which is 390) |
| Title-bar truncation @390 | **zero** across all six named rooms, after the scoped step |
| `[PAPA]` leaks | **zero**; every scrubbed answer ends on a whole sentence |
| Legal-claim scan | **zero** claims; the only two matches are a disclaimer and a description of recipients |
| Retired-word sweep | zero live identifiers, routes, or visitor-facing strings; remaining hits are historical comments and the unrelated MediaVault "foundation export" sense |
| Repo hygiene | 390px harness was an injected same-origin iframe — nothing to remove before seal |

---

## CARRY-FORWARD, NAMED NOT FIXED

1. **`InfoBooth.css` is now furniture for two rooms while still named for one.**
   Carried from the last round and still true — `Money.jsx` imports it. Renaming
   it means touching the room Mike calls AWESOME to change nothing a visitor can
   see. Still a want, not this round's trade.
2. **Five text-only faces in the robots wing**, all ART-pending. Unchanged from
   the last round; The Record is still the strongest candidate and its renderer
   exists.
3. **`MV-HR-20260405-035`** (the chip sandwich) is a genuinely good picture of
   Hunter Root trapped in a Facebook screenshot. If the underlying photo is ever
   re-captured clean it is a second plate, or a better one.
4. **`THE_CHARTER.md` is still DRAFT v0.3, "not published."** C3 rules the room
   ships anyway; the document's own status is unchanged and is Papa's.
5. **The Billionaire's Credo stays unwritten** — Q8 carries `[PAPA]` on it and
   the scrubber drops it, as the 2026-08-02 pass recommended.
6. **`--wb-gold-mute` and `--wb-gold-lo` are still half a stop apart.** F0's
   finding, unchanged and still the ground's fault rather than the ramp's.
7. **`App.jsx` HAS NO CATCH-ALL ROUTE.** Surfaced by C2's redirect work, not
   caused by it: any path this table does not match renders the shell and
   nothing in it — a blank page rather than a 404. Pre-existing and untouched
   this round because it is a UX call (what a lost visitor should see), not a
   cleanup. Worth a `path="*"` next time somebody is in this file.

**PUSH AND DEPLOY ARE MIKE'S.**
