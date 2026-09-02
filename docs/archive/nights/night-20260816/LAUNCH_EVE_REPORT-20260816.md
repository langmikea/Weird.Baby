# REMOTE CONTROL — 2026-08-16 (launch eve)

Four jobs, in order, reported between each. **Nothing committed, pushed or
deployed.** HEAD at start `fd2657e`, lint 9/8 = baseline, working tree carrying
only Mike's own uncommitted `provenance/approvals.json` (his `npm run approve`
signature of `/`, dated 2026-08-16 — Ops never touches that file).

---

## JOB 1 — THE COPYRIGHT BREACH ON /wal's SCROLLER

### THE TWO NAMED QUOTES ARE FIXED

Both live in `src/data/exhibits/hunter_root.facts.json`, and they reached /wal
through `worth-a-listen-facts.js`'s `hunterFromVault` — which re-points **all 96**
Hunter Root vault facts into the /wal pool. **Verified live before touching
anything**: `assets/tokens-j7J3-KDh.js` on weird.baby holds both strings whole.

| id | was | is |
|---|---|---|
| `MV-HR-20260707-015` | 33-word verbatim quote, `— Hunter Root, Blue Harvest Beat, 2014` | *"Hunter Root named two albums that reward repeat listening: Queens Of The Stone Age's Like Clockwork and Incubus's A Crow Left Of The Murder."* · `— Blue Harvest Beat, 2014` |
| `MV-HR-20260707-014` | 21-word verbatim quote, `— Wynton Huddle, Blue Harvest Beat, 2014` | *"Wynton Huddle listed Queens of the Stone Age, Butthole Surfers, Nirvana, Primus, Syd Barrett-era Pink Floyd, Incubus and Miles Davis, and said the list could go on."* · `— Blue Harvest Beat, 2014` |

**THE SPEAKER MOVED OUT OF THE CREDIT AND INTO THE SENTENCE, AND THAT WAS NOT
COSMETIC.** A paraphrase under `— Hunter Root, …` reads as *his* words; the
credit line now names the publication, which is what it is a credit to, and the
sentence names who spoke. **-014's first draft said "He listed…" and would have
put Wynton Huddle's list in Hunter Root's mouth** on Hunter Root's own page —
caught by the audit tool, not by reading.

`speaker:` moved from the person to `blue_harvest_beat` on both, because the
tag's meaning is *whose words these are* and they are the house's now.

### THE EXPORT GUARD LEARNED A SECOND VERB

`tools/export-artifacts.mjs` already refused to run because MediaVault still
holds three hand-DELETED lyric records. **A guard that only knows about
deletions would have let a REWORDING straight back onto the glass** — MV still
has both quotes at `status = released`, verbatim. Two rows added; the refusal
now names five records and says which fix each needs.

### THE AUDIT — AND THE SURFACE IS MUCH BIGGER THAN THE TWO

`npm run facts` (new — `tools/scroller-facts.mjs`). **406 rows: 148 quotes, 174
paraphrase, 84 titles.**

| | |
|---|---:|
| quotes at or over fifteen words | **95** |
| sources quoted more than once on one artist page | **22** |

The concentration is Hunter Root: **67 of the 148 quotes on /wal are his page**,
and they come from ten publications — Americana Highways 11, The Country Note
11, MuzicNotez 10, Blue Harvest Beat 8, LancasterOnline 6, Whiskey Riff 6,
Chasing Destino 5, Shore Fire Media 3, NEPAudio 2, plus 3 with no nameable
source at all. Carsie Blanton 2, Jesse Welles 2, Mikey Mike 12.

**AND NO SCROLLER FACT ANYWHERE CARRIES A LINK.** The schema has no slot for
one. Under Mike's own 08-17 rule — *a quote a visitor cannot go and check is
decoration* — that is a fact about the whole surface, not about a row.

### WHY THIS SURFACE WAS MISSED

The August sweeps walked quote decks and pull-quote cards, which are `src/data/
artists/*.js`. The scroller's pool is assembled somewhere else and one of its
two halves is a **generated MediaVault export** that no sweep had ever read as
visitor-facing copy. It is 96 facts that reach the glass and were treated as
data.

---

## JOB 2 — THE LIST, ON THE DESK

`npm run facts` writes `docs/SCROLLER_FACTS.html`; the Ops desk has a card,
**The scroller facts**, linked straight (it is HTML, so the desk's own
download trap does not apply). Desk rebuilt: 11 instruments, 11 on disk.

Per row: route · artist · text (with its credit line) · word count · source ·
quote / title / paraphrase · link. Four filters at the top, then two tables:
every quote at or over fifteen words, and every source quoted twice on one page.

**THREE CLASSIFIER DEFECTS WERE FOUND BY MEASURING RATHER THAN BY READING**, and
each would have made the list lie:

1. **A single-quote branch matched apostrophes.** `wouldn't … didn't` returned
   the words between two contractions as the quoted span — six facts with a
   mangled quote and a wrong count. Double marks only now; nothing in either
   pool quotes with singles.
2. **Sixty-six song and video titles in quote marks were counting as quotes** —
   *"Be Good"*, *"PEACE AND FREEDOM"*, *"Take Me Home, Country Roads"*. The
   fourteen real quotes among them were buried. Titles are judged **by case**;
   pronoun and length tests were both tried and both fail on this data. The test
   **errs towards calling a title a quote**, so two lower-case record titles are
   listed as quotes — a misfiled title costs a line on a review page, a misfiled
   quote costs the limit.
3. **One publication was in two buckets.** A slug fallback produced
   `shore fire media` beside `Shore Fire Media`, so an outlet quoted seven times
   read as two sources quoted three and four. One name per publication now.

`npm run facts:gate` exists and is **not wired into the packet gates**: it fails
today, 98 times over, and a gate that always fails is a gate nobody reads.
Register row `Q-b` says so out loud, so a future round does not read its absence
as an oversight and wire it in on a day it cannot pass.

### AND THE LIST GREW A SURFACE, BECAUSE THE LIMIT IS PER PAGE

Mike's rule counts a source **across the whole artist page, not per surface**, so
a list that stopped at the scroller would have understated every page it
described — and a Tuesday review made against an understated list is a review of
the wrong thing. The tool now also walks the `kind: "quote"` decks in
`worth-a-listen.js` (measured: **zero** such decks in `weird-baby.js`,
`foundation.js` and `robots.js`, so that one import is the whole population).

**FOUND WHILE LOOKING AT THE GLASS, NOT IN THE DATA.** Hunter Root's
`What Hunter said` deck carries **two** cards, both credited *Hunter Root · his
own channel · July 2026*, and the first is **17 words**. Across the four
artists: Mikey Mike **21**, Jesse Welles **17**, Hunter Root **17**, plus that
one repeated source. **The 2026-08-17 sweep re-measured this exact deck and
reported "no source quoted twice · zero text quotes at or over fifteen words
(longest is 12)".** That count was not stale — it was wrong when it was written,
and it was wrong because it was a reading. It comes out of a tool now.

**A SECOND THING ON THE SAME CARDS, FOR MIKE TO RULE ON.** `Exhibit.jsx:4933`
renders every quote-deck card wrapped in curly quotes. A card whose text is OPS'
OWN CAPTION is therefore set in quote marks under the artist's name — *"Her
Artist of the Year speech, in her own voice."* and *"There's A Hole — written
about that week, posted that week, two hundred thousand views in nine days."*
are the house's sentences printed as if the artist said them.

**ALL ELEVEN CARD LINKS WERE OPENED AND ANSWERED.** Link checking is opt-in
(`npm run facts -- --check-links`) and the page states which kind of run it got:
a generator that always reaches the network reports a dead door on a bad train.

### A FOURTH CLASSIFIER DEFECT, AND IT DECIDED A LIMIT

The word count split on whitespace and counted **a standalone em-dash as a
word**. *"A song built off a Mark Twain line — the more he learns about
people."* came back as fifteen and failed a limit it clears at **fourteen**. A
token with no letter and no digit is punctuation.

**Final counts: 417 rows — 159 quotes, 174 paraphrase, 84 titles · 98 quotes at
or over fifteen words · 23 artist-page/source pairs quoted more than once.**
Register rows **`Q-a`** (open, Mike rules Tuesday) and **`Q-b`** (recorded).

---

## JOBS 3 AND 4 — ONE DEFECT, AND IT IS NOT THE ONE THE ROW DESCRIBED

### REPRODUCED ON THE LIVE SITE FIRST

/wal, Hunter Root, 1280px, page at its foot, on weird.baby:

```
plate  .ex-album-banner-title   x 463 - 700    centre 582
room   .wb-bar-room             x 520 - 744    centre 632     -> 50px apart
```

**44px of WORTH A LISTEN's tail shows past the plate — his "HUNTER ROOT  ˙EN",
photographed.** And the plate's leftmost **57px (463-520) is over `.wb-bar` and
not over the room name**: `elementFromPoint` there returns the bar, so a click on
the visible "HU" of HUNTER ROOT does nothing. **Both complaints are one
measurement.**

### THE 08-17 FIX DID REACH /wal. ITS ASSUMPTION DID NOT.

`pointer-events:none` is on the plate in the deployed CSS — measured, not
assumed. It works by letting the click **fall through to whatever is beneath**,
which is correct only while the plate is inside the control.

**`.ex-banner-console{padding-right:var(--ex-flank)}` — added the same day, for
the transport-over-GIFT-SHOP collision — made the band's content box
`0 132px 0 32px`.** The centre grid column is centred in the CONTENT box; the
bar's room name is centred on the VIEWPORT. `(132-32)/2 = 50`.

**THE FIX AND ITS OWN REGRESSION SHIPPED IN THE SAME COMMIT**, and the
verification measured **the room name's own centre** — which still worked —
rather than the plate's edges. /wb has no *visible* transport most of the time,
so the offset was never looked for there and the fix read as complete.

**EXCEPT IT WAS NOT COMPLETE THERE EITHER, AND THAT IS MEASURED.** /wb also
declares a banner transport, so it carries `.ex-banner-console` too. On the
deployed site, /wb at 1690x700 with the band pinned:

```
plate "About the Artist"  300.2px      room "Weird.Baby"  165.1px
centres 50px apart · 10 of 21 points across the pinned plate are DEAD
```

**The page Mike reported on 17 August is still half-broken on the live site
tonight.** That is the recurrence, and it is why the fix below is not another
correction of one padding.

### THE FIX: THE TWO BOXES ARE MADE EQUAL

**(1) The offset moves off the band and onto the aux.** The aux is
`justify-self:end` in the right-hand track, so a right margin on IT pulls the
transport in by exactly the flank while the band's box stays symmetric — the
corner is still reserved, the centre column is back on the viewport's axis.
**Above 720px only:** below that the console band is two columns with the title
hard left (A2's ruling), and swapping padding for margin there cost the title
6.1px — HUNTER ROOT went 183.4 -> 177.3 at 390px and began to ellipsise. The
phone keeps the padding it shipped with, and is byte-identical to the live site
again (183.4px, not clipped).

**(2) `--wb-title-w`: one number, both boxes.** An effect in `Exhibit.jsx`
measures the room name's own glyphs and the plate's glyphs plus its padding,
takes the larger, and both elements carry it as a `min-width`. Equal and
concentric means the plate covers the room name **completely at any two
lengths**, and **every pixel of the plate is over `onRoomClick`** — neither
property depends on which string is longer, so the class of defect is closed
rather than one instance of it.

**MEASURED WITH A RANGE OVER THE TEXT, NOT `offsetWidth`** — the box is what the
effect SETS, so measuring the box would feed its own output back in. **The cap is
the bar's own arithmetic** (what is left after the wider of wordmark and exit),
so the side tracks stay equal and the pair stays centred on the viewport rather
than between two unequal neighbours; capped again by the band's flank allowance.
**It stands down where the plate is not over the room name**, tested on that
layout's own `justify-self` rather than on a width guess.

### VERIFIED, ON THE BUILT BUNDLE

Every /wal album at 1280x420, page at its foot:

| album | plate | room | centres | uncovered L/R | dead points | clipped |
|---|---:|---:|---:|---:|---:|---|
| Worth A Listen | 275 | 275 | 0 | 0 / 0 | 0 of 21 | no |
| Carsie Blanton | 278 | 278 | 0 | 0 / 0 | 0 of 21 | no |
| Jesse Welles | 244 | 244 | 0 | 0 / 0 | 0 of 21 | no |
| Mikey Mike | 225 | 225 | 0 | 0 / 0 | 0 of 21 | no |
| Hunter Root | 238 | 238 | 0 | 0 / 0 | 0 of 21 | no |

**Mikey Mike is the case the concentricity fix alone would not have covered** —
its plate is naturally 200.7px against a 224.1px room name, so it would still
have left 11.7px of tail at each end. It is 225 now.

Other wings, band fully pinned: **/robots** 1280x400, room *Robots* (six
letters) against plate *Weird.Baby Robots* — **295 = 295, 0 dead** (the largest
latent version of this defect in the building, and the third page it could have
returned on). **/wb** 1690x700 — **301 = 301, 0 dead**, against 300.2 vs 165.1
and 10 dead on the live site. **/foundation** — the page is too short for the
band to reach the bar at all; widths equal, nothing to cover.

**The transport still clears the corner**, which is what the 08-17 rule was for:
1690px, playing, page at its foot — `.bt` ends **1501.3**, the exit starts
**1546.4**, **45.1px of clearance**. Band padding `0px 32px`, aux margin-right
132px.

**And a dispatched click at five points across the pinned plate — including 2%
from the left edge, the previously dead zone — took the page from 1151 to 0 at
every one.**

---

## RECORDED, NOT BUILT

**The viewer and the pop-up video scroller should fit onscreen together as the
DEFAULT tracklist/viewer sizing.** Mike's ask, tonight is not the night. Nothing
was designed or measured for it this round.

---

## GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline** |
| `npm run build` | green |
| `npm run build:launch` | green — 144 files, 190.0 MB held out |
| `npm run provenance:gate` | **PASS** |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run docs:numbers:gate` | **PASS** |
| `npm run reveal:day` | nothing to move |
| `npm run assets:orphans` | **13 rows — 8 judged, 5 unjudged** |

**THE ORPHAN COUNT IS NOT THIS ROUND'S AND IS REPORTED RATHER THAN TOUCHED.**
Nothing in this round's diff is an asset; the rows are under
`public/held/robots/reference/` and `reference/photos/`. The last count on record
is 0/0 from 2026-08-09. Left alone — a cull is Mike's word under Doctrine 24.

**Nothing was committed, pushed or deployed. No dev server is left listening.**
`provenance/approvals.json` was already dirty when this round opened: it is
Mike's own `npm run approve` signature of `/`, and Ops does not touch that file.
