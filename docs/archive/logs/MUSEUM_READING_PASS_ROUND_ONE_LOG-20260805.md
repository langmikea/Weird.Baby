# MIKE'S READING PASS — ROUND ONE

**2026-08-05 · single agent · drafting lane · museum repo only**

Mike read the Lobby and the Gift Shop and wrote down what he saw. This is what
happened to each finding, what was checked before anything was wired, and the
three things this round exposed that nobody asked for.

**Gates:** lint **11 errors / 9 warnings = baseline, zero new** · `npm run build`
green · `npm run provenance:gate` **PASS** (0 undeclared · 0 stale · 0 invention)
· `npm run reveal:check` **PASS** · `npm run parity:gate` **PASS** (2 shared · 4
divergences · 4 resolved · 0 standing) · lap run **on the built bundle** at
desktop and 386px, **zero console messages**, no horizontal overflow.
**Ledger 157 → 159. Surfacing 13 · 13 · 15 — unmoved.**

---

## L1 — THE LOBBY WAS THE LAST PLACE IN THE BUILDING CALLING IT SOMETHING ELSE

MIKE: *"'The Museum' becomes 'WEIRD.BABY MUSEUM' — it must match the Robots /
Music / Foundation branding. Sweep every instance."*

`SUBTITLE` in `src/routes/WbHome.jsx` is now `"Weird.Baby Museum"`. It is
written in title case and renders in caps, because `.wb-subtitle` carries
`text-transform: uppercase` — the glass says what Mike wrote and the source
matches the casing every other house name in the data is stored in.

**THE SWEEP HE ASKED FOR RETURNED ONE INSTANCE, AND THAT IS THE FINDING.** A
pass over every visitor-facing string in `src/` and `index.html` found the share
tags (`og:title`, `twitter:title`), the meta description, the booth's credo
(*"The Weird.Baby Museum is free."*) and the Foundation's invoice (`billTo`) all
already saying **Weird.Baby Museum**. The line under the wordmark was not one of
many; it was the holdout. Everything else that matched "The Museum" in the
codebase is a comment.

**IT DOES NOT REVERSE M-ID, and a future session must not read it as one.** That
ruling (2026-08-03) struck four candidate subtitles because each named a CLASS OF
ARTIST and so fenced the building in — *a name that has to shrink to stay
accurate is the wrong name*. A HOUSE name narrows nothing. It says whose museum
this is, which is the one fact the rest of the board already carried and this
line did not: read four inches down and it is WEIRD.BABY ROBOTS · WEIRD.BABY
MUSIC · WEIRD.BABY FOUNDATION.

---

## L2 — THE WATERMARK, AND A QUESTION THAT HAS BEEN OPEN SINCE AUGUST 3RD

MIKE: *"THE WATERMARK text becomes 'Weird.Baby'."*

`<span>weird.baby</span>` → `<span>Weird.Baby</span>` in the Lobby's bottom-right
corner stamp: a floating WB monogram and the wordmark beside it, 0.56rem,
gold-mute, right of the guest book.

**IT WAS SET IN LOWERCASE, WHICH IS A THIRD SPELLING.** The building already
spells the house name two ways for two reasons — WEIRD.BABY in caps wherever the
signage shouts, Weird.Baby in title case wherever it is spoken. `weird.baby` is
neither: it is the DOMAIN, and a domain is what you type, not what a museum
stamps in the corner of its own paper.

**AND IT CLOSES A ROW THAT WAS CLOSED CANNOT-REPRODUCE.** The morning rip of
2026-08-03 carried *"M10 | the watermark | **CANNOT REPRODUCE** — needs Mike"*,
with the note *"no element in the museum answers to 'the watermark' as
described."* It was never a phantom; it was a question with no room attached.
Mike reading the Lobby attached one.

**Two namespaces have now collided, and this is the first round where it
mattered:** the morning rip's M10 is the watermark, and `OPEN_ACTIONS.md`'s M10
is the Foundation's Q7 narrowing. Named in the register rather than left for
somebody to trip over.

**THE MONOGRAM IS LEFT ALONE, deliberately.** Mike named the TEXT; the WB in the
circle is the mark. It has said the same thing as the wordmark since the day it
was drawn, so the pairing is not new and striking it was not asked for.

---

## S1 — ALL GIFT SHOP TILES THE SAME SIZE

MIKE: *"ALL GIFT SHOP TILES THE SAME SIZE, including Weird.Baby's own. No tile
is larger than another."*

**WHAT HE WAS LOOKING AT.** Top billing rendered a full-width banner with a 2rem
name in its own section; everybody else rendered half-tiles two-up beneath it.
On a direct arrival the house takes top billing (B1's own ruling), so the shop's
front door opened on a Weird.Baby plate at roughly four times the area of Carsie
Blanton's and Hunter Root's — **the house, in the room whose entire job is other
people's stores, shouting over its guests.** J3 had already ruled the guests *"a
set, sized as a set"*; this extends the same reading to everyone in the room.

**THE BILLING LAW IS NOT REPEALED. IT IS RE-EXPRESSED AS ORDER.** All three
clauses still run in `billing()`, `data-billing` still reports which branch
answered, and whoever is billed is still the FIRST tile a visitor reads. What
top billing loses is SIZE, which was never what the law asked for — it says who
leads, not who is big.

Verified on the built bundle across every branch the law has:

| entry | `data-billing` | order | tile size |
|---|---|---|---|
| `/shop` | `owner` | Weird.Baby · Carsie · Hunter · Jesse · Mikey | 445×298, all five |
| `/shop?from=wal` | `wal-set` | Carsie · Hunter · Jesse · Mikey | 445×298, all four |
| `/shop?from=wal&owner=jesse-welles` | `owner` | Jesse · Carsie · Hunter · Mikey | 445×298, all four |
| `/shop` at 386px | `owner` | five tiles, one column | 338×386, all five |

**THREE THINGS WENT WITH IT, each named rather than removed in silence.**
`.featured-artist--half` is deleted — its two rules were the tile's true
dimensions all along, and a modifier every instance carries is not a modifier.
`.featured-artist__cta` is deleted — **zero callers**, written for a design that
rendered a call-to-action and outliving it. And `.wal-banners__grid` is
**renamed** `.gift-shop__grid`, because it is no longer the WAL banners' grid: a
class naming four of the five things it holds sends the next reader looking for
the other container.

**One trap caught in the stylesheet.** The mobile rule set `.featured-artist__name`
to 1.6rem — smaller than the 2rem banner and BIGGER than the 1.05rem tile. That
was harmless while only one tile on the page could reach it and would have been
a phone full of oversized names the moment every tile is a tile. The name leaves
that rule; the two objects still in it are not shop tiles.

---

## S2 — THE TILE GOES TO THE ARTIST'S OWN FRONT DOOR

MIKE supplied four addresses and the instruction: *"wire each artist's shop tile
to their own place."*

**WHAT THE OLD FALLBACK WAS DOING, ARTIST BY ARTIST.** `storeUrl` resolved
`shop.url` → `listen.url` → `site`, and every one of the four came out somewhere
that was not the artist's own front door:

| artist | went to | now |
|---|---|---|
| Hunter Root | `hunterrootmusic.bandcamp.com` (`shop: null` fell through) | `hunterroot.com` — **which opens on "Official Merch Store", Merch first in its nav.** The shop was routing people past the shop. |
| Jesse Welles | `jessewelles.redstarmerch.com` — the merch VENDOR | `wellesmusic.com` — same stock, one door earlier, and the door is his |
| Carsie Blanton | `carsieblanton.com/shop/` | `carsieblanton.com` |
| Mikey Mike | `youtube.com/@findmikeymike` | `weekendatmikeys.com` — **a gift shop tile that opened a video feed** |

`shopExit` on the artist entry is read ahead of the old chain, which stays for
anyone with no declared exit. **Reordering the fallback to prefer `site` fixes
none of it** — Mikey Mike's `site` IS the video channel, and the day an artist's
`site` changes for an unrelated reason the shop's exits would change with it
silently. Four addresses Mike gave get four fields he can read.

### The one that had to be verified before it was wired

**weekendatmikeys.com is new, and this wing has already refused a domain of his.**
`[R-a 2026-08-02]` found that findmikeymike.com resolves and IS his — and that
its page body is stuffed with an injected SEO link farm (Indonesian gambling
domains, two dozen unrelated restaurant and veterinary sites). The door was shut
and the reason was written down *"so that a future pass does not close the gap by
adding it."*

**Read directly, 2026-08-05, before anything was written:**

- It resolves and it is **his** — the site is *The Family Ranch*, the heading is
  *STEP INTO THE WORLD OF MIKEY MIKE*, Nashville TN.
- The identity ties back to the one surface this wing had already verified the
  unfakeable way: **the site's Instagram is @findmikeymike**, which is the handle
  of the YouTube channel L1 confirmed by oEmbed from his own upload.
- It is named as his in the music press independently of the site itself.
- **No injected link farm.** The page body was read for exactly that; no gambling
  domains, no unrelated businesses.

**R-a's refusal stands, unreversed, and findmikeymike.com is still linked from
nowhere.** These are two different addresses and the note in the data says so, so
that the next reader does not "reconcile" them.

**THE TILE STOPPED CLAIMING A STORE.** The aria-label read *"Visit X's store"*,
which was true while every tile resolved to something selling something. Three of
these four front doors carry a shop one click in; weekendatmikeys.com does not.
It reads *"Visit X — opens in a new tab"* now, and the dead-tile fallback says
*no address on file* rather than *no store on file*. (That fallback is
unreachable today — all five entries carry an address — and is kept because it is
the honest way to show the fifth artist who arrives without one.)

---

## M1 — THE POKE'S PRECONDITION

MIKE: *"make sure it is TRACKED. Do not bother with a next-level egg until this
one at least catches on — record that as the condition."*

**It was already tracked** — `egg.lobby.poke` in the reveal ledger (NOT_BUILT ·
HELD · `shown: false`) and `C40` in the register, both from P4 yesterday. What
was new is the CONDITION, and it is now written in both places.

**It is a rule about the whole egg table, not about one row**, so it sits in the
block ABOVE the row in `reveal/ledger-declare.mjs` where the grade's reasons are.
Anyone reading the A+++++ as an invitation to design its sequel has read it
backwards.

**Two things stated rather than left to be inferred.** It is a condition on a
thing that does not exist yet, so it cannot be met by BUILDING the poke — it is
met by the poke being FOUND, by somebody nobody told. And **the museum cannot see
that today**: `/admin` counts visits and the guest book, no egg in the ledger
reports being tripped, and `egg.replay` — the one egg a visitor can already trip
— has never been instrumented either. So *"catches on"* is currently unmeasurable
and the condition is met by Mike's word. **That is not a proposal to build
analytics**; `/booth`'s privacy answer is why it would be a bigger decision than
it looks.

---

## F1 / F2 — TWO ROOMS LEDGERED, NOTHING BUILT

*"LEDGER (build nothing, record as future work)."* So: two rows, no route, no
component, no stub, `shown: false` on both — a room a visitor can read the name
of and not enter is a debt, not a plan.

They go in the reveal ledger AND in `OPEN_ACTIONS.md`, which is the same pair the
poke got and for the same division of labour: **the register is where Mike looks
for what is open; the ledger is what makes an unbuilt thing COUNTABLE**, because
`npm run surfacing` reads it and a room that sits unbuilt for months then shows
up in a number instead of in nobody's memory.

**`room.curtain` — BEHIND THE CURTAIN.** His words: a place where he tells the
real truth about things, why he really builds robots or anything else not in
character. **His own constraint is the hard part of the spec** — *NOT a clearing
house; a room used only when it is needed.* A room with a standing appetite for
content fills itself with filler, which this museum has paid for once already in
the Record's ten invented entries. **So the first entry has to exist before the
room does**, and building the vessel first would invert exactly the order he
specified. One collision named ahead of time: Doctrine 11 bars a line whose
subject is the making of this museum, and *"why I really build robots"* is a line
about the man and the machines. Thin enough to be worth knowing before the
writing starts.

**`room.slow` — WHEN THINGS GET SLOW.** Old photographs of him, from birth
onward, funny stuff; the room to open when there is nothing new. **The source
folder is recorded in the ledger row and nothing was read, copied or opened from
it**, on instruction. Two things a future round must hold before it does: the
folder's own name says it is **NOT GUARANTEED TO BE BACKED UP ANYWHERE ELSE**, so
the first act on it is a copy, never a move and never an edit in place — and the
path names two other people, so it is a family set and which frames may be
published is his call, the same consent rule that kept two real households off
the Foundation's invoice (M38).

Both are EXEMPT from the transfer classes under kind (iv) AUTHORSHIP. That is the
honest reason rather than a convenient one: **one has to be written and the other
has to be chosen, and neither is a transfer.**

---

## W1 — M50's FIGURES, REBUILT FROM THE VAULT

Mike: *"correct them from the vault the same way W2 was done."*

### The count, re-derived rather than carried forward

Counted this round from the museum's own export through
`buildSpineFromArtifacts`, not read off the previous round's log:

```
container                                          rows   with song:
Run With The Hunt                                    15        0
Arkansas                                             11       11
Crooked Home                                         12       12
Life Inside A Wheel                                  12       12
Mimicking the Sun Like Dandelions                    10       10
Skipping Stones That Sink Before They're Thrown      10       10
They Finally Cracked Me                              11       11
Phone Recordings EP                                   5        5
SINGLES & RARITIES                                    7        7
                                            9 containers · 93 rows · 78 slugs
```

**So "78 songs" was never stale. It was a count of the SLUGS reported as a count
of the SONGS, and the 15 it dropped are exactly one record.** And "Nine albums"
counted CONTAINERS: seven are records, one is an EP by its own title, one is a
set by its own title.

Six sites corrected — the tombstone's two rows, the card label, the metrics note,
the records note and the fact scroller. *"whose catalogue the museum holds
itself"* is gone with them: a reader takes it for all of it, and this wing's own
records note says sixteen releases sit on his Bandcamp against nine in the vault.

### The two years, and the mechanism that produced them

The records board dated Crooked Home **2024** and Arkansas **2022**. The comment
above the block is the confession: *"years from the museum's own era buckets."*
**`era-buckets.json` holds RANGES, and each bucket's START year was being printed
as its record's release year** — "The Arkansas Era" starts 2022, "Crooked Home"
starts 2024. An era is a span of time a record OPENS; it is not the day it came
out, and the two are equal only by accident.

- **Crooked Home 2024 → 2025.** Vault fact `MV-HR-20260707-053`: *"released
  October 17, 2025 via Tolok."* His own Bandcamp album page: *"released October
  17, 2025"*, read 2026-08-05.
- **Arkansas 2022 → 2023.** His own Bandcamp: *"released June 30, 2023"*, read
  2026-08-05. The vault's Arkansas material is all 2023 press, and
  `MV-HR-20260707-041` dates the record's viral single to January 2023.

Both corrected years also match the spine's own display years in
`hunter-root.js`, **which had disagreed with this board for as long as both have
existed.** Skipping Stones agreed and is untouched; Chase The Dragon carries no
year and none was invented for it.

### And one of M50's own claims was wrong

**This is the finding worth keeping from the whole round.** M50 recorded that
*"Half of Crooked Home is about his brother"* is a quantity **the vault does not
carry** — *"it carries the dedication, the grief, '94 and My Brother's Bones."*

**The vault carries it.** `MV-HR-20260707-068`, tagged to `crooked_home`, Hunter
Root's own words to Americana Highways in 2025:

> *Half the songs ended up being about my brother… '94' was almost the album
> title. It's the heart of it all.*

It stays on all three faces that print it. **A search that missed it is not an
absence** — and a register row is a claim like any other. This one was checked
against the vault before it was acted on, which is the only reason a true
sentence about a dead man is still on his brother's card this evening.

---

## THE PROVENANCE BOUNDARY — THE PRUNE PROCEDURE, RUN IN ORDER

Ten strings changed on the glass; eleven register rows went stale. **Two of the
eleven were anchors and both carried three RESTATED chains** —
`"78 songs on file in the museum's own vault"` and `"Nine"`.

Per `OPERATIONS.md` §9's four steps: **check anchors → repoint → prune →
re-gate.** One of the three chains was itself stale (the card label, rewritten
this round); the two survivors were repointed onto the replacement tombstone rows
BEFORE anything was pruned.

Ten rows added. Three of them are the holdings figures and all three cite the
same thing — **the count, the file and the method**, which is what the old
citation did not do: *"78 songs"* was classed VERIFIED against a citation that
pointed at the card's own tombstone rows. `provenance/README.md` §4 names that
exact string as its example of a hole, and this was the hole.

**Result: 0 undeclared · 0 stale · 0 invention · gate green.**

---

## WHAT THIS ROUND EXPOSED

1. **[M54] Mikey Mike's verified domain is in one room and not the other.** His
   gift-shop tile goes to his own site; his artist card still opens on the
   YouTube channel and his `siteNote` still explains why his other domain is
   linked nowhere. Not wrong — the channel is genuinely where his work lands
   first — but the museum now holds a verified front door for him and prints it
   in exactly one room. **Deliberately not widened: Mike named the shop tile.**

2. **[C41] `docs/SURFACING_LOG.md` dates its rows in UTC.** This round's reading
   was taken at 21:2x local on 2026-08-05 and logged as **2026-08-06**. It is a
   TREND file whose value is that rows line up with the packets that made them.
   **Deliberately not fixed inside a round that was reading the tool** — the
   file's own header says *do not hand-edit; a measurement somebody adjusted is
   not a measurement*, and quietly re-stamping a date while using it is the shape
   of exactly that. One line in `tools/surfacing.mjs`; the row already written
   stays.

3. **The surfacing number did not move: 13 spendable · 13 promised · 15 idle**,
   with the ledger up 157 → 159. That is the right reading rather than a lucky
   one — both new rows are NOT_BUILT and `shown: false`, so they are neither on
   the back shelf nor promised. **The shelf did not grow.** M49's complaint from
   last round is unaffected and unadjusted.

---

## WHAT WAS DELIBERATELY NOT DONE

- **M51, M52, M53 are untouched.** They are last round's open questions about the
  WAL poster and none was on this list.
- **Mikey Mike's artist card was not re-pointed** — see M54.
- **The photo folder was not opened**, by instruction.
- **Nothing was built for F1 or F2.** They are rows.
- **`tools/surfacing.mjs` was not edited** — see C41.
