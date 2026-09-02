# SHORT PAGES — THE FIFTH THEORY, REFUTED
2026-08-12 · diagnostic packet · **nothing changed, nothing committed**
HEAD: `82ad00c`. Site live in LAUNCH stage.

---

## A1 — REFUTED, AND HERE IS THE MEASUREMENT

**The claim:** a hand scroll is clamped to the integer max while the document's
true extent is fractional, and that is why the top is unreachable.

**Half of it is true and it is the half that does not matter.** The clamp is
real — and it acts at the **BOTTOM**, not the top.

Mike's own test, run on the launch build (`scrollTop` set past the end, then to
zero, which is what a mouse does and what `scrollTo` does not):

```
/foundation @ 1280×800
  trueH 857.0781   innerH 800   trueMax 57.0781   intMax 57
  scrollTop = 99999  ->  rests at 57      (the integer max, NOT 57.0781)
  scrollTop = 0      ->  rests at  0      (exactly)
```

**The fractional remainder is unreachable at the FOOT of the page.** You cannot
see the last 0.0781px of the document. That is the whole of its effect.

### AND HIS 31.1111 IS EXPLAINED EXACTLY BY IT

At `dpr 2.25` a scroll position quantises to whole **device** pixels, i.e.
multiples of 1/2.25 = 0.4444 CSS px:

```
true max      31.4028 CSS px  ×2.25 = 70.656 device px
floor         70 device px    ÷2.25 = 31.1111 CSS px   ← his reading, to the digit
scrollHeight-innerHeight = 31 CSS px  = 69.75 device px — not a whole device pixel
```

So `31.1111` is **the correctly-clamped bottom of the page**, and `max 31` is an
integer arithmetic that does not correspond to any reachable position. Both
numbers are right; neither describes the top.

### THE TOP: 28 MEASUREMENTS, ALL ZERO

7 routes × 4 zoom levels, launch build, `scrollTop = 0` after a hand-scroll to
the bottom:

| zoom | result |
|---|---|
| 100% (1280×800) | **TOP = 0 on all 7** |
| 90% (1422×889) | **TOP = 0 on all 7** |
| 80% (1600×1000) | **TOP = 0 on all 7** |
| 67% (1910×1194) | **TOP = 0 on all 7** |

*(One run reported `/` at 80% resting at 218 with a `trueH` identical to
`/shop`'s. Re-measured in isolation: `trueH 1000, travel 0, TOP 0`. It was a
stale document caught mid-navigation after the extension reconnected — a
measurement artifact, recorded because a false positive left unexamined is how a
sixth theory would get born.)*

### AND THE OTHER READING OF "THE TOP OF THE SCREEN" IS ALSO CLEAR

"Cannot scroll to the top of the screen" is consistent with `scrollY = 0` if the
top of the page were **hidden under the fixed bar**. Tested on every route at
90%: the bar is 52.5px (52 on `/shop`), and **no page content sits under it**.
The one hit the probe returned was `wb-bar-brand` — the bar's own child, inside
the fixed element. `.ex-root`'s `padding-top: 54px` clears the 52.5px bar by
1.5px.

**So: nothing obstructs the top, on any route, at any zoom I can produce.**

---

## A2–A5 — NO FIX SHIPPED, AND WHY

A2 asks for height because the top is unreachable. **The top is reachable —
measured 28 times.** Adding min-height to every short page would be furniture
bought with a premise that does not hold, and the Law of Subtraction says what is
not needed goes rather than gets added.

**A3 — the affected set, reported anyway, because it is the real shape of the
site.** Document height against viewport, 90%:

| route | trueH | innerH | travel | screens |
|---|---|---|---|---|
| `/` | 889 | 889 | **0** | 0 |
| `/booth` | 889 | 889 | **0** | 0 |
| `/foundation` | 889 | 889 | **0** | 0 |
| `/wal` | 1874.25 | 889 | 985.25 | 1.11 |
| `/wb` | 889 | 889 | **0** | 0 |
| `/shop` | 1218 | 889 | 329 | 0.37 |
| `/robots` | 889 | 889 | **0** | 0 |

**Five of seven routes have ZERO travel at 90%** — they are exactly one viewport
tall and do not scroll at all. A page that does not scroll cannot be stuck at the
wrong scroll position. At 100% `/foundation` carries 57px and `/shop` 418px; at
67% `/shop` drops to 24px.

**This is the finding worth keeping:** the museum's pages are mostly exactly one
screen. That is why the symptom moves around with zoom and why it looked like a
short-page problem — the travel genuinely does collapse toward zero. It just does
not strand the viewport at the bottom.

---

## A6 — WHERE THE FRACTION COMES FROM, AND WHY IT SHOULD STAY

Walked the flow chain on `/foundation` (skipping the fixed bar, which
contributes no flow height):

```
html / body / #root / .ex-root      857.0781
  .ex-main                          473.0781
    .ex-main-inner                  471.0781
      .vr-dh / .vr-dh-line          471.0781   (align-self: stretch — inherits it)
```

`.vr-dh-line` **stretches** to its flex row, so it carries the fraction rather
than causing it. The origin is the row's tallest item — text laid out at the
museum's **fluid type ramp** with `line-height: normal`. A font size derived from
`clamp(…, min(1.35vw, 4.4cqh), …)` is fractional by construction, its line boxes
are fractional, and a flex row takes the height of its tallest child, so the
fraction propagates all the way to `documentElement`.

**Making it whole at the source means quantising the type ramp — and that ramp is
measured, not chosen.** It is the one the D-round fixed against the live page
(`.vp-flat` 344.56px, body 15.3408px, identical at both widths) and that
`OPERATIONS.md` protects because it reads **both** viewport axes. Rounding font
sizes to whole pixels to remove 0.0781px of document height would trade a
measured typographic fidelity for a rounding artifact that costs nothing.

**Chosen: leave it fractional.** It is not a defect; it is what fluid type looks
like when you measure it.

---

## WHAT I COULD NOT DETERMINE

**What Mike is actually seeing.** Five theories have now been tested and four
measured false. The scroll reaches 0 on every route at every zoom, nothing is
occluded, there are no inner scrollers, no snap targets, no anchoring, and the
smooth default is gone. His own probe agrees on the last point —
`afterImmediate 0`.

**What would settle it in one step:** the page in front of him, at the moment it
looks wrong, described or photographed. Not the numbers — *what he sees*. Every
number either of us has taken now says the page is at its top; if it still looks
wrong at `scrollY 0`, the thing that is wrong is not the scroll position, and no
further scroll measurement will find it.

## GATES

| gate | result |
|---|---|
| lint | 9 errors / 8 warnings — baseline |
| build · launch build | green · green |
| provenance:gate | PASS |
| reveal:check · parity · instory | PASS · PASS · PASS |
| reveal:day | nothing to move |

**Nothing in the tree changed this packet** — `git status` clean. The gates are
recorded to show the branch is where the last commit left it.
