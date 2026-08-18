# RULINGS — 2026-08-17

**Mike's decisions of this day, in one place, so a later round does not re-open
one of them as if it were an open question.**

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

## HOW THIS FILE IS MEANT TO BE USED

**Read it before re-opening any of the six.** Each ruling here cost a round to
reach, several of them cost more than one, and the failure this file exists to
prevent is the one `OPEN_ACTIONS.md` already records four instances of: a
question that has an answer being asked again because the answer was only ever
in a chat.

**A ruling is not an open action.** Nothing here goes in the register or on the
Ops desk. Where a ruling left a genuine remainder, that remainder has its own
row and is linked above.
