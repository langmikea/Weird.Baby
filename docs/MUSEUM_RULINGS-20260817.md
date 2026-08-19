# RULINGS — 2026-08-17

**Mike's decisions of this day, in one place, so a later round does not re-open
one of them as if it were an open question.** Seventeen of them - rulings 9 to 17 are dated 18 and 19 August, and six of
those are DOCTRINE rather than decisions about one page.

This file is a RECORD, not a tracker. Nothing here is waiting on anybody; every
row is settled. Where a ruling has an open remainder, the remainder is named and
pointed at its register row — **the ruling itself is closed either way.**

Round logs for the day: `docs/MUSEUM_WALKTHROUGH_LOG-20260817.md` (the live-site
walkthrough) and `docs/MUSEUM_COPY_AND_RECORD_LAYOUT_LOG-20260817.md` (the copy
round, the record layout, the photographs, and the share card).

---

## 1 — THE RECORD LAYOUT IS VARIANT **b**

> *"Indent the report so it reads as subtext under the headline."*

**RULED after a rendered comparison, not from a description.** Mike has
aphantasia and a described comparison is useless to him, so both of his options
were built as real CSS and photographed against Record 001's real content at
desktop width: `docs/record-layout-variants/compare.html`.

**a AND a+b ARE REJECTED**, and they are **deleted rather than left dormant** —
a stylesheet in `docs/` that still renders a rejected layout is one injection
away from being mistaken for the shipped one. What they were is written down
once, in `variants.css` beside the pictures.

WHAT SHIPPED: one declaration in `src/routes/exhibit/Exhibit.css` reading
`--rec-textcol` — the token the headline's own grid already reads, so the two
cannot drift. Measured after: headline and report on the same vertical, **out by
0** at 1280px, 390px and 1920px. The head is untouched, so J1's rule that the
index row carries into the opened record without change survives.

**THE ONE COST, NAMED:** at 390px the report loses 60.6px of measure and the
page grows 9.4%. Desktop costs nothing at all.

---

## 2 — HASHTAGS: **NO** ON MUSEUM PAGES

> Acknowledgement is already done better by linking each artist's own site,
> store and channel. **Hashtags belong in social posts.**

**IT IS A RULING ABOUT A SURFACE, NOT ABOUT HASHTAGS.** Nothing here says
hashtags are bad; it says the museum page is the wrong place for them, because
the museum already does the thing a hashtag gestures at — and does it with a
door the reader can walk through.

Scope: every museum page. Social posts are a different surface and this ruling
does not reach them.

---

## 3 — SEO: **DEFERRED TO ~30 RECORDS**, AND THE SPLIT IS THE POINT

**Not killed. Deferred with a trigger**, and split in two:

- **THE ROBOTS FICTION WILL NOT RANK AND CHASING IT IS WASTED.** Nobody searches
  for a machine that does not exist, so every hour spent making one rank is
  spent on an audience that cannot be looking. This half stays dismissed.
- **BUT THE NAMES SHOULD OWN THEMSELVES.** *"Papa Weird.Baby"*, *"Weird.Baby
  Foundation"* and **the album** are things a person HEARS and then types, and
  today there is no guarantee that typing one lands here. That is not ranking
  against competition; it is a name resolving to its own front door. Cheap and
  permanent.

**OPS DISMISSED THE WHOLE OF SEO AND WAS TOO BROAD.** Recorded that way on
purpose.

**TRIGGER: roughly 30 Records** — the point at which the museum has enough
written surface for a name to have something to resolve TO. Register row
[`Q-f`](OPEN_ACTIONS.md#q-f).

---

## 4 — THE SPAM NOTE IS STRUCK IN ALL THREE PLACES

> *"findmikeymike.com STAYS in the ledger, linked nowhere and described nowhere
> a visitor reads."*

The same content had survived in three different wordings on three surfaces.
All three are gone:

| surface | what it said |
|---|---|
| the artist card's `NOTE` line (`siteNote`) | "He does own findmikeymike.com, and it is currently serving injected spam — so it is named in the ledger and linked nowhere." |
| the fact scroller | "He does own the domain findmikeymike.com. / It is not linked here, and the reason is in the ledger." |
| the records block | "…and the domain he does own is currently serving injected spam, so this museum will not send you there." |

**AND A FOURTH, WHICH IS THE PART OF THE RULING WORTH CARRYING:** `aboutNote`'s
last sentence — *"His own domain is deliberately not linked — see the ledger"* —
reached no visitor, because the `SOURCES` row that printed it had been struck
earlier the same day. Mike struck it anyway: **DORMANT IS NOT GONE.** A string
one restored render away from the glass is a string on the glass with a delay.

**WHAT STAYS, AND WHERE.** The `[R-a 2026-08-02]` comment block in
`worth-a-listen.js` — the domain is his, it is serving an injected link farm, it
is linked from nowhere, and a future pass must not "close the gap" by adding it.
**That is the ledger, it is a source comment, and no visitor can read it.**
Proved after: `findmikeymike.com` and `injected spam` appear **nowhere in the
built bundle**. `@findmikeymike` — his verified YouTube channel, a different
object — is untouched and still on the card.

---

## 5 — THE FOUR ARTIFACT PHOTOGRAPHS ARE MUSEUM-OWNED

Four photographs of objects Mike owns, taken by him, one per existing
About-the-Artist tile:

```
public/images/wb/steven-tyler-setlist-harmonica.jpg   the framed Vegas setlist, harmonica below
public/images/wb/rod-stewart-signed-ball.jpg          the signed ball
public/images/wb/hunter-root-signed-setlist.jpg       the signed setlist, three signatures
public/images/wb/cb-west-1981-antler.jpg              the 1981 CB West ANTLER yearbook
```

- **CLASS `MIKE`** in `provenance/assets.json`, on the sentence the robots
  reference photographs already carry: *the museum's own photographs of its own
  things.* **This is the distinction, and the register already drew it** — the
  artists' covers on `/images/wal/` are `VERIFIED` against a citation because
  they are the artists'; these are the house's. No new class was invented.
- **NO GIFT SHOP** for any of them. Ruled.
- **NO OPS-WRITTEN CAPTIONS. MIKE WRITES THOSE.** The tiles carry his existing
  words unchanged; not one character of body copy moved when the pictures
  landed. `alt=""` is deliberate for the same reason — the label and body
  directly beneath each picture are the accessible content, and an alt string
  would be Ops writing a caption.
- **THE YEARBOOK IS NAMED FOR THE SCHOOL, NOT FOR P!NK** — `cb-west-1981-antler`
  — because the object on that tile is the school, which is Mike's own framing.

**They are public, not held.** `/held/` is the STAGE hold and is scoped to
`/robots/` — the machines' pictures the Record delivers one at a time. These are
memorabilia on a live public card.

**Still open and NOT part of this ruling:** they carry no verdict in
`assets:gate`, along with the 35 assets that already had none — register row
[`M22`](OPEN_ACTIONS.md#m22).

---

## 6 — THE LINK-PREVIEW COPY

**Ruled, and shipped in `index.html` on ALL THREE description tags — `og:`,
`twitter:` and the search-result `name="description"`:**

> **Title:** Weird.Baby Museum
>
> **Description:** A free museum of weird things worth keeping. Robots arriving
> one day at a time, music worth a listen, and a guest book that remembers who
> got here early.

**ONE STRING NOW SERVES ALL THREE**, which none of them did before: `og:` and
`twitter:` had already forked to two different lengths of the C4 wording, and the
search tag carried R1's, so the museum described itself three ways. **The
register proves it** — its key is file+text, so all three tags collapse to a
single row; if that row ever splits back into two, the strings have drifted.

What it replaces, named once (Doctrine 24): *"A museum of weird things worth
keeping. The MGK robots, and music worth a listen. No ads, no affiliate links,
no cut of anything you buy from an artist."*

**THE SEARCH SURFACE WAS BROUGHT ONTO THE SAME SENTENCE ON HIS RULING**, an hour
after this section first recorded it as left alone. What it carried until then,
named once (Doctrine 24): *"Weird.Baby Museum. Exhibiting the MGK robots and
Worth A Listen."* (R1, 2026-08-02 — which itself replaced a line advertising a
wing that is no longer listed, so that is **twice** this tag has gone stale by
naming exhibits). **The new sentence describes the museum's SHAPE rather than
its contents**, so a wing opening or closing cannot falsify it a third time.

**THE IMAGE IS RULED: `/share-card.png`.** Exact 1200x630, no crop, and already
what the tag pointed at. **DO NOT ALTER THE IMAGE.**

**A FLAG RECORDED AND DELIBERATELY NOT FIXED:** that card's own lettering reads
*NO ADS - NO AFFILIATE LINKS - NO CUT*, which is the old description. **The new
copy invites; the picture argues.** Mike owns the artwork and will redraw it.
Ops does not touch the file.

**AND THE SEARCH SURFACE JOINS THE SHARE SURFACE.** `name="description"` now
carries the same sentence, character for character, on his ruling - the two were
saying different things about the same museum, which is Doctrine 17's exact
failure mode. **All three description tags are one string and one register row
now**; the register keys on file+text, so if that row ever splits back into two,
the strings have drifted.

**WHAT WAS FIXED WITHOUT A RULING, BECAUSE IT WAS A DEFECT AND NOT A CHOICE:** — the options are in the round log and in the
report to Mike. What was fixed without a ruling is the URL FORM: the tag pointed
at a root-relative `/share-card.png`, which the Open Graph protocol does not
accept and the platforms drop, so a shared link had no picture. **The file was
never missing.** That is a defect, not a choice.

---

## 7 - THE FOUR CAPTIONS, AND WHERE THEY HAD TO GO

**Mike's words, verbatim:**

| tile | caption, as it ships |
|---|---|
| P!NK | 1981 C.B. West Antler Yearbook. (same century as P!NK) |
| Steven Tyler | Aerosmith setlist, Las Vegas, 31 January 2020, with the harmonica. |
| Rod Stewart | Will return ball for Dixie Toot Live. |
| Hunter Root | Signed setlist, Abbey Bar, 10 October 2025. |

**THE CARD HAS NO CAPTION SLOT** - it draws exactly three things: the optional
`img`, the `label`, and the `body`. **Mike ruled that four short lines do not
justify a fifth field on a component five wings share**, so each caption is the
FIRST LINE of its own tile's body.

**IT NEEDED NO CODE.** `.vp-prof-body` has been `white-space: pre-line` since
2026-08-16 for his four-achievement copy, so a typed newline draws as a line.
First rather than last is the one judged call: the picture is the card's first
element, so the line nearest it reads as its caption.

**NOT ONE CHARACTER OF THE EXISTING BODY COPY MOVED.**

**THE `Name -` PREFIX WAS STRIPPED THE SAME DAY, ON A SECOND RULING.** Each
caption arrived opening with the artist's name and an em dash, and the tile's own
label - set in caps directly above the body - already said it; the P!NK card
printed the name three times. Ops carried the prefixes AS TYPED for one round and
flagged them rather than dropping a word from a value Mike supplied. **He ruled;
they went.**

**`(same century as P!NK)` IS KEPT**, and his ruling says why: *that mention is
the joke, not the label.* The two look alike and only one of them is a duplicate.

**THE LOOP IS THE THING TO KEEP.** This is the third time in two days it has run
to completion - `is earning` -> `is learning`, the `Born` row, and now these four.
It works because the flag is raised where he can SEE the consequence on the
glass, rather than argued in advance.

---

## 8 - RECORDS POST AT 17:00, NOT AT MIDNIGHT

> **Records post at 17:00 America/New_York on their day. Record N becomes
> visible at 5pm on day N.**

**ONLY THE HOUR CHANGED.** `RECORD_TZ` is untouched and still
`America/New_York`; the ruling above it about WHERE the clock is still governs.
No date in the data moved, and every comparison in the system is still a string
comparison between ISO day strings - what moved is the instant at which
`todayInRecordTz()` starts returning the new day, so the page filter, the asset
withholding, the wing-open gate and `/api/record` all follow without any of them
learning about an hour.

**WHAT IT GOVERNS AND WHAT IT DOES NOT:**

- **002 onward.** Record 002 becomes visible **Tuesday 18 August 2026 at
  17:00:00 EDT = 2026-08-18T21:00:00Z**.
- **Record 001 already posted at 00:00 Monday. That happened and stays.** Not
  backdated, not hidden.
- **Record 001's own text says the site went live "at 12:00 am Monday
  morning". That is canon and is untouched.**
- **/robots opened at 00:00 Monday and stays open.**

**THE ONE THING THAT MADE THIS URGENT, MEASURED:** the new rule makes "today"
the previous calendar day between 00:00 and 17:00. Applied on Monday MORNING it
would have set today to 2026-08-16 - which is before Record 001's own date and
before `__WB_RECORD_FIRST_DAY__` - so **Record 001 would have vanished and the
/robots wing would have read as not yet open.** That window closed at 17:00
Monday. Deploying after it is safe and deploying before it would have blanked
the wing; both were proved by probing the function at ten instants.

**THE BOUNDARY IS READ OFF THE WALL CLOCK, NOT BY SUBTRACTING 17 HOURS**, and
that is not fussiness: on 8 March 2026 a flat subtraction posts the Record an
hour late, because the day is 23 hours long. Tested on both 2026 transition
days.

---

## 9 - WE DO NOT HOLD BACK WHAT WE SAY WE HAVE (2026-08-18)

> **"We do not hold back what we say we have. We hold back what we don't have
> yet."**

**DOCTRINE, not a note about one line.** The `_tmp/` entry in Record 002's
manifest promised something the museum cannot show - it sat in a list of names
with a marginal note saying its contents were readable, and there was nothing
behind it. **A Record names only what it can produce.**

**IT IS THE INVERSE OF THE PULL-BACK RULE AND THE TWO NOW MEET.** H2's rule
governs a thing the museum HAS and is not showing yet: the picture exists, it is
behind the stage door, and the Record's own entry is what publishes it. This
governs a thing the museum does NOT have: it may not be named as though it did.
Between them: **the Record may withhold, and the Record may not promise.**

**WHAT IT STRUCK, IN ONE PASS:**

- the `_tmp/` manifest line and its marginal note;
- the closing line that pointed at it - *"The last entry is the only one we can
  open. It is being reviewed."* It named "the last entry", which WAS `_tmp/`, so
  it could not survive it;
- from the DETAILED REPORT, the ZIP-index line, the per-file-header line, and
  the recovered-names line. **The invented count went with them** - it was a
  number for something the museum cannot produce, which is the doctrine's exact
  case, and it is written down once in the round log rather than left in the
  source where a later round could reinstate it believing it was data.

**RECORD 003 IS UNTOUCHED AND IS THE REASON THE DOCTRINE IS NOT A CONTRADICTION.**
It opens on *"One tmp folder unprotected - Contents attached"* - the day the
museum HAS the thing. Naming it then is not a promise; it is a delivery.

**[2026-08-19] THAT LINE IS GONE, AND THE PARAGRAPH ABOVE IS KEPT AS WRITTEN.**
Once the `_tmp/` line left Record 002, 003's opening line referred back to
something 002
never said, so Mike ruled it replaced: *"Outer layer opened - three manual pages
recovered, contents attached"*. The reasoning above is untouched because it is
still the reasoning - the day the museum HAS the thing is the day it is named.

**FLAGGED AND NOT CORRECTED:** Record 002's DETAILED REPORT now ends
"- Appendix 01" while the section heading below it reads "ADDENDUM 01". Both are
Mike's, both carried as typed.

---

## 10 - WHAT'S SAID MATCHES WHAT'S SHOWN (2026-08-19)

> **"What's said matches what's shown."**

**DOCTRINE.** Ops makes it true and asks Mike for what is missing, in accordance
with the UX and the story. **Ops does not hedge the Record's wording to cover a
gap.** A sentence that says eleven while three are on the glass is not fixed by
softening the sentence; it is fixed by showing eleven or by saying three.

**IT IS THE THIRD SIDE OF A TRIANGLE THE OTHER TWO ALREADY DREW.** Ruling 9 says
the Record may not promise what the museum does not have. H2's pull-back rule
says the museum may hold back what it has. This one closes it: **what the Record
does say must match what is on the wall, on the day it says it.**

**APPLIED THE SAME HOUR:** Record 003's DETAILED REPORT read *"Eleven manual
pages and four personnel folders"* against three attachments. **ELEVEN became
THREE.** If a later Record shows more, it says so then - and that is the whole
of the rule: the number follows the wall, not the other way round.

---

## 11 - THE SCAN NUMBERS ARE NOT PAGE NUMBERS (2026-08-19)

**T-A IS RESOLVED, AND THE ANSWER IS THAT THE QUESTION HAD A THIRD ANSWER.** The
register asked which number is the object - the 24-page manual on the glass or
the 61-page structure issue in the build. **Neither.** `07`, `11` and `31` are
**frame numbers from whoever filmed the manual.** They match nothing in the
document and they are not meant to.

**NO RENUMBERING ANYWHERE.** The document keeps its own page numbering, the
ledger keys its rows by the manual's page index, and the two never meet. The
delivered files are named `scan-NN`, so **no public address asserts a page of
the manual** - which is the practical half of the ruling and the reason the
names are what they are.

**THE VOCABULARY WENT WITH IT:** *manual pages*, never *plates*. `PLATE 07`
became `SCAN 07` in Record 003, and the museum's remaining uses of the word
were swept: two house strings and one of Mike's own Record 004 lines use it for
a PHOTOGRAPHIC plate and a MAKER'S plate, which is a different word, and they
stand.

---

## 12 - AN ATTACHMENT IS THE PAGES THAT WERE FILMED TOGETHER (2026-08-19)

> **"We show the things that need to be shown. Each page is a page, and if we
> need to include a couple more pages, fine. Those pages were in the outer
> layer for a reason. As we peel the onion that is the ZIP file, the story
> unfolds - plan and write for that."**

**RULED AGAINST A NARROWER OPS PROPOSAL, and the reframe is the content.** Ops
had asked whether a scan should be "one page plus its overflow". It is not.
**An attachment is the set of pages that were filmed together because they
belong together** - so a page is never cropped out of a set to tidy it, and
never padded in to make one even.

**WHAT IT MEANT IN PRACTICE:** the three scans Record 003 names are **four
manual pages**, delivered as five files. **One page is in two scans** - the leaf
that closes the video link also opens the power supply, so it was filmed into
both sets and carries both names.

**AND THE ZIP IS THE ARRIVAL, WHICH MOVED A TRANSFER CLASS.** The pages come out
of the outer layer as it is peeled, so `doc.manual.page.*` is **UNLOCK**, not
PACKAGE - in hand from week 0, opened later. The old class carried the premise
that *"a photographed page is a photograph of paper somebody is holding"*, which
is true of a manual nobody has and false of the one that arrived.

---

## 13 - THE PRODUCTION ARC ANSWERS *DOES THE MUSEUM HAVE IT* (2026-08-19)

**OPS' RULING, MADE UNDER MIKE'S INSTRUCTION TO DECIDE WHAT IT CAN DECIDE.** The
manual-page arc is `needed - printed - photographed - placed`, and it was
designed for paper. These pages are generated: nothing is printed and nothing is
photographed.

**THE STAGES ARE ANSWERS TO A QUESTION, NOT EVENTS IN A PIPELINE.** For a page
printed and photographed the four stages are four different answers. For a
generated page there are only two - the generator has not run, or it has and the
page is in the reader. `printed` and `photographed` describe a pipeline this
object does not have, so **they are skipped rather than faked**, and every row
says so in its own note.

**AND EVERY EARLIER STAGE WOULD BE FALSE ON THE GLASS:** a page attached to a
published entry is not NOT_BUILT and not HELD. `placed` is the only stage that
is true of it on the day.

**ONE INACCURACY IN THE VESSEL SURFACED ON ITS FIRST USE AND IS FIXED:**
`manualPageRow` hard-coded a placed page's `where` as `face.plates`, the only
delivery anyone had imagined. These are Record attachments, and it says so now.

---

## 14 - THE MUSEUM PUBLISHES A DERIVATIVE, THE ROBOTS REPO KEEPS THE MASTER (2026-08-19)

**OPS' RULING, APPROVED.** The 300-dpi PNG masters stay in the robots repo. What
the museum publishes is **1700x2200 WebP q82**.

**IT IS A MEASUREMENT, NOT A PREFERENCE.** The attachment thumbnail is 3.4em -
about 52px square - and the same file serves the thumbnail and the reader, so
the source masters would have cost a visitor **9.02 MB to paint five squares**.
The derivative costs **0.42 MB**, and legibility was checked at 1:1 rather than
assumed: the type is crisp and the strike variation and copier dirt survive.

---

## 15 - A CLOCK OVERRIDE IS NOT AN AS-OF QUERY (2026-08-19)

**DOCTRINE, and it is the real output of the clock investigation.** The museum's
data carries **no `valid-from` and no `superseded-at`** - the complete set of
fields an entry may hold is enforced by two gates and contains no version field
at all, the reveal ledger's `when` is null on all 174 rows by Doctrine 12, and
D1 holds only visits and the guest book. **So a date parameter shows TODAY'S
TEXT under an older date.**

**NEVER LABEL IT AS SEEING THE PAST.** *"The museum as of 19 August"* is a claim
this data cannot keep: the text under that date changes every time an entry is
rewritten, silently and with nothing recording that it moved.

**THE EVIDENCE IS NOT HYPOTHETICAL AND IT IS SEVEN HOURS WIDE.** Record 002's
DETAILED REPORT was rewritten in `97ab783` at **09:51 on 18 August** - the
ZIP-index line, the per-file-header line and the "1,046 names recovered" line all
struck. Record 002 **published at 17:00 that same day.** A post-publication edit
was missed by luck, not by design, and nothing in the system would have noticed
or recorded it.

**WHAT IS STILL TRUE AND STILL USEFUL:** for Mike and Ops, "what publishes
tomorrow" is a question about TODAY'S data, so an override answers it honestly
for them. The dishonesty only appears the moment a visitor is told they are
looking at the past.

---

## 16 - THE HONEST ANSWER TO "WALK THE MUSEUM AS IT STOOD" IS IMMUTABLE DEPLOYS (2026-08-19)

**RECORDED, COSTED PROPERLY LATER, NOT BUILT NOW.** Cloudflare's versioned
deploys give every upload its own permanent preview URL. **A past deploy is
genuinely past** - bundle and data together, the thing a date parameter over
live data can never be - and it needs **no data-layer rewrite**. This repo is on
wrangler 4.81.1, well past the feature, and versions are **already accumulating
on every deploy**.

**ITS REAL LIMITS, NAMED SO NOBODY DISCOVERS THEM LATER:**
- only as far back as versions are retained;
- granularity is **deploys, not days** - two deploys on one day are two points,
  and a day with no deploy is not a point at all;
- **the robots repo's manual pages are not versioned with it**, so a past museum
  deploy still reaches for whatever those files are today.

The alternative - bitemporal data, valid time against transaction time, the
SQL:2011 `AS OF SYSTEM TIME` shape - is the *correct* answer to the visitor
feature and is a data-layer rewrite. It is written down here so that it is
chosen, if it ever is, rather than drifted into.

---

## 17 - `__WB_NOW__` IS A SECOND SEAM (2026-08-19)

**THE MUSEUM HAS TWO REQUEST-TIME CLOCKS, NOT ONE, AND BOTH ARE IN
`src/worker.js`.**

- `worker.js:210` - `todayInRecordTz()` -> `recordToday`. **The day.** Everything
  about the Record hangs off this one call, and every consumer already takes the
  day as an argument, so the clock is a parameter already.
- `worker.js:180` - `window.__WB_NOW__=${Date.now()}` inside `injectClock`.
  **The instant**, for the lobby countdown, written inline and derived from
  nothing.

**ANY FUTURE DATE OVERRIDE MUST SET BOTH.** Move the day and leave the instant
and **the lobby countdown will contradict the Record on the same page** - the
counter running against the real clock while the entries run against the
supplied one. It is the only thing in the system that can visibly lie under a
date parameter, and it will not announce itself.

**ALSO WORTH HAVING:** `reveal:day` reads no clock at all - it reasons purely
from the Record's own `assets` arrays - and `browserToday()`/`museumNow()` fall
back to the visitor's clock ONLY when no worker injected anything, which is
every `npm run dev` and no deployment.

---

## HOW THIS FILE IS MEANT TO BE USED

**Read it before re-opening any of them.** Each ruling here cost a round to
reach, several of them cost more than one, and the failure this file exists to
prevent is the one `OPEN_ACTIONS.md` already records four instances of: a
question that has an answer being asked again because the answer was only ever
in a chat.

**A ruling is not an open action.** Nothing here goes in the register or on the
Ops desk. Where a ruling left a genuine remainder, that remainder has its own
row and is linked above.
