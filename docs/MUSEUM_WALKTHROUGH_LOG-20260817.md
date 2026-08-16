# MIKE'S LIVE-SITE WALKTHROUGH — 2026-08-17

Six areas, walked on the deployed site and answered in order, with rulings
arriving between areas. **Nothing was committed, pushed or deployed.**

---

## WAITING ON MIKE

| row | what | what he must supply |
|---|---|---|
| `S-l` | **One double space** in Record 001's deck — `Load  (contained)`. In the data, **not on the glass** (`pre-line` collapses runs). | One word, or nothing. |
| `S-n` | **`Back in 94' — tee` and `Hat` have no home.** They went with the duplicate store list; the surviving lane is a discography. | One word: the gift shop, or gone. |
| `S-p` | **Hunter Root's record list shows 4 of 16**, and the other twelve are not in the repository. | The twelve with years and links — or nothing. **The Bandcamp door added this round is already a complete answer.** |

Nothing else is blocking. `S-m` is a record, not a question.

---

## GATES AT CLOSE

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline** |
| `npm run build` | green |
| `npm run provenance:gate` | **PASS** |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run docs:numbers:gate` | **PASS** |
| `npm run reveal:day` | nothing to move |

Backup: `C:\AI\_week01\_backup_Exhibit_before-reorder-20260817.jsx`

**Closed this round:** `F-a` · `S-e` · `S-i` · `S-o` · `W-b`.
**Opened:** `S-m` (a record) · `S-n` · `S-p`.

---

# ═══ THE THINGS A FUTURE ROUND WILL OTHERWISE GET WRONG ═══

## 1 — TWO REDUCTIONS, TAKEN KNOWINGLY. NEITHER IS A CLEANUP.

**Both are Mike's rulings, made after looking at the page. Both make the house
say LESS than it did. Do not "restore" either as a tidy-up.**

### (a) `SOURCES` is struck from all four /wal artists

It printed the whole of each artist's `aboutNote` as one long Courier line at
the foot of their card. **This reverses the 2026-08-11 ruling that put it
there**, and that ruling's own note says /wal *"is the one page whose
credibility rests on it"*.

**That reasoning was not wrong.** It is Ops' reasoning about the page. Mike has
now read four of those tails across four artists in one walk and ruled the
accumulation noise. **The page wins over the note about the page.**

`aboutNote` **is kept in the data** — it is the provenance record behind every
fact on those cards and the thing a later round would have to rebuild from
scratch. What is struck is the PRINTING of it.

Struck in the same breath and for the same reason: the `Source — Their own
channel feed, read 2 August 2026` tombstone on every artist's upload wall.
**What is lost there is real and is named: an undated wall of thumbnails no
longer says it is a snapshot, so a visitor cannot tell it is not live.**

### (b) `USE_RIGHTS` is deleted, and the house went quieter on purpose

Mike struck `Can I use what is here?` from /wal; that was the constant's only
consumer, so it went with its question. **The building no longer states what may
be done with the museum's own photographs of its own objects.** It also no
longer states that the artists' pictures *"come down the day any of them asks"*
(`Whose pictures are these?`, struck in the same instruction).

**His reasoning, recorded because it binds later work:** an unprompted statement
about what may be done with the house's own photographs is the envelope
furniture the house refuses. **Nobody has asked.** When someone does, he answers
them directly — which is what the address in the booth FAQ is for.

**THE UNDERTAKING TO THE FOUR ARTISTS STANDS AS PRACTICE.** What left is the
house announcing it to people who never asked. `USE_RIGHTS` also carried an open
`[PAPA]` on the licence; that question leaves the building with it.

Register row: **`S-m`**, filed RECORDED rather than OPEN — it asks him nothing.

---

## 2 — THE QUOTE RULE MIKE DREW

> **A quote a visitor cannot go and check is decoration. "From the museum's own
> vault" is the house citing itself, which is not a citation.**

A named publication with a live link is a reader following a trail; a tail with
nothing behind it is furniture wearing a trail's clothes.

**Three cards died on it** (after the four he named by hand):

| artist | card | tail |
|---|---|---|
| Hunter Root | the whole `Said about him` deck | Harrison Giza / Blue Harvest Beat · 2014 / *"From the museum's own vault"* |
| Mikey Mike | `What Mikey said` card 1 | Mikey Mike / a 2020 interview |
| Mikey Mike | `Also` → Little Lisa | Apple Music and Deezer / **read 2026** |

**The old comment on the Hunter Root card argued the opposite and is worth
knowing:** it said inventing a link to stand in for a print-era piece *"would be
worse than saying where it actually came from"*. **That is still true.** The
answer is not to fake a link — it is that an uncheckable quote does not go on
the wall at all. The Giza source is real and is in the vault
(`MV-HR-20260707-016`) for the day it can be pointed at.

---

## 3 — TWO COPYRIGHT LIMITS ARE NOW ENFORCED ON /wal

**Both were breached. Both are fixed. A future round must not reintroduce
either.** These are limits, not taste.

### ONE QUOTE PER SOURCE

**Ken Tucker (NPR *Fresh Air*) was quoted twice** on Carsie Blanton's card —
*"one of those hard-headed, open-hearted protesters"* (April 2021) and
*"delightfully surprising"* (March 2019). Two pieces, two dates, one writer, one
publication.

Mike chose which to keep **on what it says rather than on its date**: the
survivor says something about her; two words of praise say almost nothing and
were the ones costing the limit. `npr.org/2019/03/21/705424265` is named once in
the source and is gone from the page.

### EVERY QUOTE UNDER FIFTEEN WORDS

**One was 24** — Jesse Welles on his own Bandcamp: *"through the end of this
year (2025) all profits from downloads on bandcamp will be donated to No Kid
Hungry and Arkansas Food Bank."*

**It is DELETED rather than trimmed, and the reason matters:** its paraphrase was
already on the same page, one deck down, with the same door. Cutting the quote
and keeping the paraphrase is one card rather than two saying one thing. **The
paraphrase gained the two charity names**, because the quote had been the only
place naming them:

> Through the end of 2025 he sent all Bandcamp download profits to No Kid Hungry
> and the Arkansas Food Bank instead of to himself. He said so on his own store
> page, in his own lower case.

Classed **VERIFIED**, not RESTATED — it adds specifics, and its citation is his
own store page, which the card's door opens.

### RE-MEASURED AFTER

Every surviving quote card, with the source's string concatenation folded first:
**no source quoted twice · zero text quotes at or over fifteen words** (longest
is 12). The check is `scratchpad/quotecheck.py`'s method and is worth re-running
before any new quote lands.

**AND OPS' OWN COUNT WAS WRONG FIRST TIME.** The initial sweep reported *seven*
quotes with working citations; there were **eight** — the Jesse Bandcamp quote
was misclassified out of the set. It was the one that breached the word limit.
A classification that loses a member is a classification that cannot enforce a
limit.

---

## 4 — `W-b` IS CLOSED, AND THE REASON IS NOT THE ONE IN THE ROW

**`Papa@Weird.Baby` has been ruled since 15 August.** It is purpose-placed in
the booth FAQ, superseding the 2026-08-11 sitewide strike. `W-b` had been open
since 14 August saying the question could not be answered because the address
was struck — **and it had not been struck for two days.**

**So the ruling was never the blocker.** `How to contact?` on /wb's FAQ can be
answered whenever that track is wanted back.

**THE TRACK IS HELD BECAUSE ITS SECOND QUESTION IS EMPTY, NOT BECAUSE THE
ADDRESS IS STRUCK.** Mike: *"HIDE the FAQ track. It is empty and Mike has no
time for it."* The face declares TWO questions and drew ONE — `scrubFace` drops
a `[PAPA]` answer in every stage — so a one-question FAQ sat under its own album
row promising a room.

> **DO NOT UN-HIDE THAT TRACK ON THE STRENGTH OF THE ADDRESS EXISTING.**

---

## 5 — TWO TRACKS ARE HELD UNCONDITIONALLY, AND THAT IS NOT `HIDDEN_AT_LAUNCH`

| wing | track | id |
|---|---|---|
| /foundation | **The Blog** | `the-blog` |
| /wb | **FAQ** | `wb-faq` |

**`HIDDEN_AT_LAUNCH` IS THE STAGE HOLD AND IS THE WRONG INSTRUMENT FOR BOTH.** A
member of that set renders in DEVELOPMENT and vanishes at launch. Mike said
*for now* — which is neither stage. **These are held from him as well**, because
a track he can see is a track he has to keep deciding about.

So each wing has a `HELD_TRACKS` set, filtered unconditionally on the spine, and
**the track objects are kept whole where they were.** Each returns by taking one
id out of one set. The same mechanism in both wings on purpose, so two wings do
not grow two ways of holding a track.

The FAQ's first answer used to end *"…and follow the blog"*; his replacement
line went in with the hold. **Grep for `blog` before adding another.**

---

## 6 — THE TITLE-PLATE DEFECT: A PLATE WITH NO HANDLER WAS EATING A CONTROL

**MIKE: "Scroll to top does not work UNLESS the viewer is enlarged to fill the
page."**

The room name in the bar **is** the scroll-to-top control (`onRoomClick`).
`elementsFromPoint` at its centre, /wb Vol. 1, three scroll positions:

```
y = 0     ->  wb-bar-room              works
y = 150   ->  wb-bar-room              works
y = 282   ->  ex-album-banner-title    DEAD — the room name is second in the stack
```

The album band travels to `top: 0` at `z-index: 95` and comes to rest ON the bar
— the deliberate 2026-08-11 design, *"the wing title travels through the bar's
centre"*. **The travel is the feature; swallowing the click was not.**

**And it explains his "unless enlarged" exactly:** a taller viewer makes a
longer page, so the band spends most of its scroll un-pinned and the control
answers; a short page is pinned almost immediately and it never does.

**ONE PROPERTY, BECAUSE THE DEFECT IS ONE PROPERTY — the same shape as the P1
apron fix four hundred lines down in the same file, and for the same reason.**
`.ex-album-banner-title` is `<div className="ex-album-banner-title">{album.title}
</div>` and nothing else — **no click handler.** Its `pointer-events: auto`
existed only to undo the band's blanket `none`, and undoing it was never needed
for a plate that does nothing. It is `none` now and the click falls through to
the bar, which is the only thing that plate is ever over.

### THE SECOND DEFECT ON THE SAME PAGE HAD THE SAME ROOT

**MIKE: "When the viewer IS enlarged, the music controls overlap 'GIFT SHOP'."**

A gap in the flank rule rather than a new problem. `--ex-flank` reserves both
corners so a long TITLE can never run over the brand or the exit — and the
transport was then placed in grid column 3, **which IS the right flank**.
Measured at 1690px, page at its foot:

```
.bt    x 1391-1650, y 14-38
exit   x 1563-1658, y 18-34      ->  87px of overlap, both axes
```

Fixed in the band's own vocabulary — `.ex-banner-console { padding-right:
var(--ex-flank) }` — so the aux track ENDS where the reserved corner BEGINS.
Transport `x 1291-1550`; the exit starts at 1563.

**`top: 52px` ON THE BAND WAS THE OTHER CANDIDATE AND WAS REFUSED:** it stops
the title travelling at all and reverses his 11 August ruling to fix a collision
he described in the corner.

**Verified after, four scroll positions × two widths (1690px and 403px): the
room name is the hit target at every one, the transport overlaps the exit at
none, and a real pixel-dispatched click at the foot of the page took the page
from 282 to 0.**

---

# ═══ THE SIX AREAS ═══

## AREA 1 — /foundation FAQ

**THE SPACING WAS ONE DECLARATION.** Both rooms already set the same face,
weight and 1.62 leading. The booth draws an answer as ONE paragraph whose
newlines are real breaks; a wing FAQ drew one `<p>` PER LINE and added
`--rh-tight` on top of the leading. Same words, one extra step of air per line.

Taken to **zero, not smaller** — halving it leaves a third rhythm in a building
meant to have one — and applied **globally** (`/wal`, `/wb`, `/robots` too),
because the booth was ruled THE standard for FAQs on 16 August. Measured after:
`line-height 29.94px`, actual step `29.94px`, **extra gap 0**.

**THE ONE PARAGRAPH BREAK IN THE BUILDING IS RESTORED** (his ruling, an Ops
proposal he accepted): *"What happens when you stop?"* has two beats and the
second is the heaviest sentence on the page. **A line break and a paragraph
break are different objects — kill the first, keep the second.**

The mechanism is the booth's own rather than a second one: `.vp-faq-a p` takes
`white-space: pre-line`, the same declaration `.sheet-faq-a` has carried since
15 August, so **both rooms now answer "what does a newline mean" identically.**
Measured before adding it: **zero** answer strings in `worth-a-listen.js`,
`robots.js`, `weird-baby.js` or `foundation.js` contain a newline, so it draws
only where one is put on purpose.

**TYPE SIZE WAS LEFT ALONE ON HIS RULING** — booth 15.2px fixed, foundation
17.7px off the face ramp. He complained about spacing, not size, and the ramp
exists because a face sits in a resizable pane. Flagged for his next walk.

**The rest:** the donate Q&A is deleted one day old (`.vp-faq-a a` on the page →
**0**); `door.coalition` is HELD; *"If you want to know more, read 'The Long
Story'."*; The Blog held; *"We are not giving anything away. We are keeping what
we have."* as ONE line because he typed one; the Coalition line cut from *"Can I
contribute…"*.

**THE LEDGER GATE CORRECTED OPS AND WAS RIGHT.** `door.coalition` was first
written LIVE + HELD, and `reachability.mjs` refused it: *"REVEALED and exempted
— exemption covers what is NOT shown; a visitor can reach this"*, and then, when
held: a built-and-held row in a PUBLIC module ships its strings anyway. **That
rule does not describe this case — the answer is DELETED, not gated — so the fix
was to stop claiming LIVE.** What is not built is the DOOR; what survives is a
renderer with no caller, and a renderer is a container rather than a door.
`NOT_BUILT / HELD`.

`inlineDoor`, `.vp-faq-inline-link` and the `inline` field are **kept with zero
callers**, stated in the source so nobody reads their presence as use.

## AREA 2 — /wal FAQ

Two questions struck (see §1b and §2). The affiliation answer is the booth's,
exactly, two lines, neither broken — measured 74 chars → 1 visual line, 43 chars
→ 1 visual line.

**IT IS HOISTED RATHER THAN RETYPED, AND THAT CLOSES `F-a`.** His ruling makes
it a passage the house says in TWO rooms, which is Doctrine 17's own trigger —
the exact condition `AFFILIATION` was created for. `house-copy.js`'s
`AFFILIATION` **is** the booth's words now and both rooms read it. Not one
character changed on the booth page. `F-a` had been open since 15 August waiting
for precisely this ruling.

## AREA 3 — THE PULL-QUOTE SWEEP

Seven named kills plus three more under the rule in §2. All verified gone by
walking every artist page on the built bundle.

**THE GARBLED LINE: THE DATA WAS FINE AND THE RENDERING WAS NONSENSE.** The
card's four fields CONCATENATE on the glass — eyebrow + text + who + where — so
it drew as *"2026He was out through July 2026 and said so himself, on his own
channel, the week it started. hunterroot.com/tour his own tour page"*. **That is
why no gate saw it and a person reading the page did.** His tour page is not
lost: it is a door on "What are they up to?", where a door belongs.

**THE SCENT IS HOW ONE SENTENCE BECAME FALSE ABOUT SOMEBODY.** *"They play
constantly. This is where it is real."* was written as a flourish about touring
bands in general and then printed under EVERY artist's tour door. Mike: *"HR
does NOT tour constantly!"* The door stays.

**THE STORE LIST: `records` KEPT, THE SIDEBOX DELETED.** `records` has the
years, a reason per record and a door per record. Two items went with the
sidebox and are **not** to be lost — `S-n`.

## AREA 4 — HUNTER ROOT RELEASES

**The Bandcamp door is in**, using the block's own `vp-record-door` button, its
two-letter mark and its `openLink`. **Done for all three artists** with the
identical sentence, not only Hunter Root; every URL was already in the file on
the records above it.

**THE EXPANDER WAS NOT BUILT, AND THE PREMISE IS WHY.** Measured on the page:
`max-height: none`, `overflow: visible`, `scrollHeight === height`. **The
renderer draws every item it is given.** Carsie 4, Hunter Root 4, Jesse 5,
Mikey 0, each with a note saying where the rest are. **An expander over a
complete list is the dead control Doctrine 11's corollary forbids.**

The vault knows eleven album groupings for Hunter Root and **no years and no
URLs**. A record on this block is a DOOR, not a name, so they were deliberately
not chased. `S-p`.

## AREA 5 — /wb ABOUT THE ARTIST

FAQ track held (§4, §5). The fact grid is **`tombstone`** — the pattern he
pointed at (Mikey Mike's From / Based / Known for). Nothing new built.

**EVERY VALUE IS HIS LINE TO THE CHARACTER; EVERY LABEL IS OPS'.** `Studied`
appears twice on purpose — he listed two institutions and no degree level for
either, and inventing "Undergrad"/"Postgrad" would assert a fact about his
education he did not state.

**THE RENDERER WAS FIXED RATHER THAN WORKED AROUND, AND OPS' OWN COMMENT WAS
WRONG FIRST.** The first attempt drew blurb → tiles → grid, putting his
biography UNDER his achievements — the identical defect the 16 August round hit
with `lines` and dodged by parking the bio in the lead. The source comment had
claimed `tombstone` draws above `profile`; **the page contradicted it inside a
minute.** So the ORDER moved: `profile` now draws below `tombstone`.

**That is safe for one measured reason: `profile` is declared by EXACTLY ONE
FACE in the museum** (this one), while `tombstone` is on every /wal artist and
the robots wing. **The block with one caller is the one that can be moved.**

**THIRD PERSON: eleven substitutions, pronouns only.** Three things were not
smoothed because fixing them needs a word he did not write, and he ruled on all
three: *"must be his personal ball"* stays (ambiguity that resolves in the same
sentence is not ambiguity); *"Sorry,"* is cut so the tile reads *"He panicked."*
and matches the Steven Tyler tile exactly, making the repetition a joke rather
than a tic; and **the word ACHIEVEMENTS stays gone** — four tiles under a bio do
not need a label announcing that they are achievements.

## AREA 6 — /wb VOL. 1

See §6. Both defects, one root cause, both verified fixed at two widths.
