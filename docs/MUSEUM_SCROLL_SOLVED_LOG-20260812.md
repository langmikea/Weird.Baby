# THE SCROLL, SOLVED
2026-08-12 · write packet · **not committed, not pushed, not deployed**
HEAD at start: `e998d03`. Site live in LAUNCH stage.

---

## A1 — THE READING IS CONFIRMED, AND ONE CLAIM IN IT IS NOT

**The cause is `scroll-behavior: smooth` on the document. That is proven by the
probe and I agree with it.** The three samples are unambiguous:

```
afterImmediate  31.1111      scrollTo(0,0) has been called and nothing moved
afterTwoFrames  29.7778      it is easing
afterHalfSecond 0            it arrives
```

A scripted scroll that takes half a second to travel 31px is an animation, and
the only thing in the tree that animates scripted scrolls is that declaration.
`behavior: "SMOOTH"` is on the same probe line. **The page was never stuck; it
was easing, and 31px of ease is slow enough to read as stuck.**

The probe also eliminates the three theories ahead of it, on its own line:
`snap "none"`, `snapTargets: 0`, `anchor "none"`, and the visual viewport at
`scale 1, offsetTop 0` with `pageTop` equal to `scrollY`. The fractional pixel is
real — `rectH 841.4028` against `scrollH 841`, and `scrollY 31.1111` over a
`max` of `31` — **and it is not what held the page.** It is a rounding artifact
riding along.

### THE ONE PART I DO NOT AGREE WITH, SAID PLAINLY

> *"Every wheel tick starts a fresh smooth animation."*

**A wheel is not affected by `scroll-behavior`.** CSSOM-View is explicit: the
property governs scrolls from navigation and from the CSSOM APIs, and *"any
other scrolls, e.g. those performed by the user, are not affected."* Chrome
follows that — it smooths **keyboard** scrolling (arrows, PageUp/Down, Home/End)
and scrollbar clicks, and leaves wheel and trackpad alone.

So the mechanism is right and the input is not. What was easing was one of:
**Home/PageUp/arrow keys**, which Chrome does smooth; or the app's own
`window.scrollTo(0, 0)` on arrival (`use-arrival.js`), which inherited the
declaration and eased every entry into every room. Both are fixed by the same
change, which is why this does not alter what to do — **it alters what to write
down**, so the next person does not test with a wheel, see it work, and conclude
the fix failed.

**This theory does not get a free pass either. What is proven is the
declaration and the timing; the input path is inferred and is named as inferred.**

---

## A2 — REMOVED AS THE DEFAULT

`html{scroll-behavior:smooth}` is deleted from `Exhibit.css`. Instant is the
right default for a wheel, a keyboard, a link and a restore.

## A3 — EVERY DELIBERATE SCROLL, AND EACH ONE OPTS IN AT ITS CALL SITE

| site | what it is | behavior |
|---|---|---|
| `RecordEntry.jsx` glide | **Mike's ruling** — *"as if the waiter was seamlessly addressing my every need"* | **`smooth`**, already explicit — **survives** |
| `Exhibit.jsx` flat-wing face change (≤720px) | the stacked wing swapping face | **`smooth`**, already explicit — survives |
| `Exhibit.jsx` room click | back to the top | `auto`, already explicit |
| `RecordEntry.jsx` reduced-motion path | position without the journey | `instant`, already explicit |
| `use-arrival.js` | arriving in a room — a RESTORE | **now `instant`, explicit** |
| `GiftShop.jsx` | shop entry — a RESTORE | **now `instant`, explicit** |

The two restores were the ones inheriting the default. They now say what they
mean, **even though the default they were depending on is gone** — because the
next document-level declaration must not silently turn every arrival back into
an animation.

## A4 — REDUCED MOTION

`RecordEntry`'s glide already honoured it. **`Exhibit.jsx`'s did not, and now
does.** A reader who has asked the system for less movement should not get it
from one surface and not the other.

`RecordEntry`'s comment explaining *why* it used `instant` rather than `auto`
named the CSS default as its reason. That reason is gone; the line stays, and
the comment now says the real one — intent at the call site beats depending on
the absence of a rule somewhere else, which is the dependency that cost four
theories.

---

## A5 — VERIFIED

**Launch build, 7 routes × 4 zoom levels = 28 measurements.** Scroll to the
bottom, then ask for the top, and read `scrollY` **with no wait at all**:

| zoom | result |
|---|---|
| 100% (1280 CSS px) | `immediate = 0`, `settled = 0` on all 7 |
| 90% (1422) | `immediate = 0`, `settled = 0` on all 7 |
| 80% (1600) | `immediate = 0`, `settled = 0` on all 7 |
| 67% (1910) | `immediate = 0`, `settled = 0` on all 7 |

`scrollBehavior` computes **`auto`** on every route. **`immediate = 0` is the
whole proof**: before this change the same call read `31.1111` at that instant
and needed half a second to land.

Short pages carried real travel and still landed instantly — `/foundation`
bottom `117 / 132.5 / 140.5` at the three wider zooms, `/booth` `378.5`,
`/shop` `478`.

### WHAT I COULD NOT VERIFY

**The Record's glide was not observed easing.** Two honest reasons, neither of
them a defect in the change: `/robots` is hidden at launch so it had to be
tested on a development build, and at 1280px the Record page's whole document is
**128px** tall — the glide's target is already in view, so there is nothing to
travel. Repeated attempts then hit CDP renderer timeouts and I stopped rather
than keep hammering it.

**What is known:** the call is `el.scrollIntoView({ behavior: "smooth" })` with
the behavior passed explicitly, which by CSSOM-View overrides the computed
property and is unaffected by removing the CSS default. The code path is
untouched by this packet. **But it is reasoning, not a measurement, and it is the
one thing in A5 that is.** It wants Mike opening a record on a tall window.

---

## A6 — WHY IT LOOKED LIKE A ZOOM PROBLEM

**Because the ease is a fixed duration and the journey is not.** Chrome's smooth
scroll takes roughly the same time whatever the distance. On `/wal` — a thousand
pixels of travel — half a second of easing reads as motion, which is what it is
for. On `/foundation` at 90% there were **31 pixels** of travel, and the same
half second spent crossing them reads as a page that will not move.

Zoom looked like the variable because **zoom changes the travel**. Zoom out and
the viewport holds more, so a short page's overflow shrinks toward zero; the
smaller the travel, the larger the fraction of the journey the ease occupies.
Mike's 90% was not triggering a zoom bug — it was shrinking `/foundation` to the
point where the animation was the entire scroll.

**That is also why two per-page fixes failed.** The pages were not different from
each other; they were different in HEIGHT, and the cause was one line in a
stylesheet none of them owned.

---

## GATES

| gate | result |
|---|---|
| lint | **9 errors / 8 warnings** — baseline, as updated in §D |
| build · launch build | green · green |
| provenance:gate | **PASS** — see below |
| reveal:check · parity · instory | PASS · PASS · PASS |
| assets:orphans | 13 (unchanged) |
| reveal:day | nothing to move |

**IT FAILED FIRST AND THE FAILURE IS ON THE RECORD.** Verbatim:

```
UNDECLARED (first 40 of 3):
  src/lib/use-arrival.js:66  "instant"
  src/routes/exhibit/Exhibit.jsx:3170  "instant"
  src/routes/shop/GiftShop.jsx:250  "instant"
GATE: FAIL
  · 3 UNDECLARED visitor-facing string(s)
```

Three occurrences of the scroll-behavior keyword this packet added. Declared
**HOUSE**, which is what `"instant"`, `"smooth"` and `"auto"` already are at
their existing sites — the standing law's *"if you add content, you add register
rows in the same commit"*, not a way around the gate.

## D — THE BASELINE

`CLAUDE.md` said **11 / 9**; it is **9 / 8** and has been since the player fix.
Updated, with the reason: the two `Cannot access variable before it is declared`
errors were raised by the unguarded eager `useEffect` and went with the code that
caused them. Nothing was suppressed. The note already in that line — that a
tripwire publishing the wrong number disables itself — is why it is corrected in
the same round that moved it.

---

## WHAT NEEDS MIKE

1. **Open a record on a tall window** and confirm the glide still glides. It is
   the one thing A5 could not measure.
2. Nothing else. The scroll is instant on every route at every zoom.
