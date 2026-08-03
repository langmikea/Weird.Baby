# THE LONG HAUL — round log (v36)

**Ordered by:** Mike, 2026-08-02. Autonomous single-agent Code-lane round, no git
until seal, standing gates (lint baseline + vite build + browser lap at desktop
and 390px). Items L1–L6.

**Method note that earned its place last round and earned it again:** the phone
lap runs in a **same-origin 390px iframe**, because the window manager refuses
`resize_window`. One correction to the technique this round — see §Harness.

---

## Harness — the 390px iframe, corrected

`public/_lap.html` (a scratch harness, removed before seal) frames the app at an
exact width so media queries genuinely fire. The addition this round:

> **The framed document will not scroll until `overflow-x:clip` is swapped for
> `overflow-x:hidden`.** `Exhibit.css:22` sets `html,body{overflow-x:clip}`. At
> top level the page still scrolls to a real wheel; inside a frame the viewport
> refuses every programmatic scroll (`scrollTop`, `scrollTo`, `scrollIntoView`
> all no-op at 0 while `scrollHeight − clientHeight` reports 11,327px). Injecting
> `html,body{overflow-x:hidden !important}` into the framed document restores
> scriptable scrolling with identical visual clipping.

Without that, a narrow lap can only see the first screen — which is exactly the
screen where none of this round's phone defects live.

---

## L1 · THE PUV SCROLLER OVERLAPS THE VIEWER — diagnosed, fixed, measured

**Reported:** *"the PUV scroller OVERLAPS the viewer."*

### The diagnosis — the same defect, the third time, in the frame nobody revisited

`.fs-wrap{flex:1}` gives the fact scroller an **equal share of the right column
with the viewer**. That has been fixed twice already and both fixes were scoped
to the wing in front of them:

| | rule | wing | date |
|---|---|---|---|
| R-c | `.ex-root[data-stage="1"] .fs-wrap{flex:0 0 auto;height:clamp(...)}` | staged | 2026-08-02 |
| F4/P2 | `.ex-root[data-flat="1"] .fs-wrap{flex:0 0 auto …}` | flat | 2026-08-02 |
| — | *nothing* | **the plain two-column frame — /hr and /wb** | — |

/hr is the museum's primary exhibit and is neither staged nor flat, so it kept
the original. This is the review's own pattern 1 (§0): a rule is written for the
frame in front of you and the next frame is never checked.

**And it was worse than an equal share.** `body:has(.pb) .fs-wrap{padding-bottom:76px}`
(E5) added 76px INSIDE the flex item, so the scroller ran 86px LARGER than the
viewer at every size.

### Measured, before

| | /hr @ 1400×900 | /hr @ 390×844 | /wb @ 390×844 |
|---|---|---|---|
| viewer (`.vp-area`) | **670 × 133** (5.0 : 1) | **340 × 79** (4.3 : 1) | **374 × 25** |
| scroller (`.fs-wrap`) | **218** of a 352px column | **164** of 244 | — (no facts) |

The /wb number is the one that settles the argument: **a twenty-five-pixel-tall
video player**, on a surface that has no fact scroller to blame. On /hr the
scroller's own share hid the same collapse behind a merely bad number.

At 390px the strip also guillotined its own content — the two-line quote was cut
mid-line by the fade-mask and landed on the credit line.

### E5's padding was written on a false premise and never did its job

The comment says `.fs-wrap` is an *"internally scrolled column of fixed height"*
needing *"room to scroll clear"* of the bar. It is not: `.fs-wrap` is
`overflow:hidden` and `.fs-viewport` is `overflow:hidden` behind a mask. **Nothing
in the scroller scrolls.** There was never a scroll position for the padding to
make reachable.

And it did not clear the bar either. Measured across window heights with the rule
in place:

| viewport height | column bottom vs bar top |
|---|---|
| 700px | **129px under the bar** (76 under-provisions by 53) |
| 811px | 18px under |
| 900px | 71px **above** — 76px clearing nothing |

A constant guarding a distance that is not constant.

### The fix

Scoped by what the frame **is**, not by exhibit name —
`.ex-root:not([data-flat]):not([data-stage])`:

- the scroller is a **strip**, sized in LINES OF THE FACT TYPE
  (`--fs-lines`), not an equal share;
- **three lines** on desktop, not the flat wing's two. Measured against all 97
  facts in the vault at this column's real width (792px): 12 quotes run one line,
  71 two, **13 three**, 1 four. Two lines would fade the last line off 14% of the
  vault. The flat wing's column is 1231px wide, which is why two was right there;
- the height is **fixed, not `auto`** — the viewer sits ABOVE this strip in a flex
  column, so an auto strip would resize the video every 7.5s as facts cycle. F4's
  original reasoning, applied to the frame it was written for;
- **at ≤720px the viewer is a ratio box again.** M-a retired the ratio box on the
  ground that *"a ratio box is the right tool when the CONTAINER is unknown — here
  the container is known"*. True of the two-column desktop frame; **false** below
  720px where the grid collapses and `.ex-right` has no height of its own. By
  M-a's own test the rule it replaced is the right one again there;
- **four lines at ≤720px**, because the same quote wraps further in a 340px column
  (measured: 2 of 97 fit in two lines, 23 in three, 55 in four) and the picture
  above is a ratio box, so the strip's height costs it nothing;
- E5's 76px is replaced by **24px** — the smallest that keeps the credit whole at
  laptop heights at or above ~805px, costing the picture 15px instead of 76.

### Measured, after

| | /hr @ 1400×900 | /hr @ 390×844 | /wb @ 390×844 |
|---|---|---|---|
| viewer | **670 × 222** (3.0 : 1) | **340 × 192** — exactly 16:9 | **357 × 201** — exactly 16:9 |
| scroller | 130 | 159 | — |

`/wal` and `/robots` measured byte-identical before and after (1017×523, 357×669,
1031×878, 357×383) — the `:not()` scope holds by construction.

### The honest limit, named not hidden

`.ex-main`'s height is **not fitted to the screen** — it is the TRACKLIST's
natural height (the grid row is max-content and `.ex-left` is the tall item) plus
that column's own 76px bar padding. So the column's bottom depends on how many
tracks the album has and not at all on how tall the window is: on Arkansas
(11 tracks) it lands at 761px and sits under a 68px bar at every viewport shorter
than 829px. **No constant can be right for that**, and E5's was the same guess
costing four times as much. Below ~805px the strip's last line goes under the bar
and is one flick from view — E5's own reading of `tl-track`.

**The real fix is a fit, not a padding.** F3's ruling ("the tracklist, the viewer
and the PUV scroller SNAP TO sizes where all of them fit on one screen") exists
and /hr does not declare `fitOnEntry`. That is a UX call about the carousel
yielding height, so it is named here rather than taken.

---

## L2 · THE RULINGS — recorded, and J1/J3 built

Recorded in `STATE.md` → *THE PALETTE + SET RULINGS*. Summary of the BUILD:

### J1 — the retired 2025 gold is retired everywhere

Every live `#b8974a` (and its `#d4af5e` hover and its `rgba(184,151,74,…)` washes)
now reads the accent ramp. Sites, all verified computing a ramp value afterwards:

| file | sites |
|---|---|
| `Exhibit.css` | `.pb` top rule · **`.pb-ctrl` play/volume/CC + hover** · `.tl-playing` gradient + rule · `.tl-rend:focus` · `.vp-record-door:hover` · `[data-exhibit="wal"] .vp-trail-go` rule + hover · `:active` tap feedback ×2 · `.tl-active` @≤720 |
| `Exhibit.jsx` | `TYPE_META.official` · the active album's hairline ring · `.tl-active` inline rule · `NpBars` ×3 · the placeholder tile ×3 |
| `HrExhibitFlow.css` | `.hr-bar-trig` hover + `.is-on` (FILTERS / PRESETS) |

Two things worth stating:

1. **The player bar already declared the ramp it was ignoring.** `.pb`'s own rule
   re-pins `--wb-gold` through `--wb-gold-hi` for its dark scope on its FIRST
   LINE, and then the two hottest controls in the bar typed a literal anyway.
   Reading the ramp is not a new palette; it is the palette that was already
   declared one selector to the left. Verified live: `.pb-ctrl` computes
   `rgb(201,201,201)` on `rgb(26,26,26)`, hovering to `#ededed`.
2. **`var()` in an inline style is the right tool, not a workaround.** It resolves
   against the ground the element is standing on, so `TYPE_META.official` and
   `NpBars` are photo black in the tracklist and near-white inside the bar —
   one declaration, two grounds, no JS mirror of the palette.

Also folded in, because it was the same defect: the **placeholder tile** gradient
was typed at three call sites and every copy carried the retired gold as the
`album.accent` fallback — which is the LIVE value, since every album in every
wing declares `accent: null`. One builder (`placeholderTile()`) now; alpha via
`color-mix`, because a `var()` cannot take a hex-alpha suffix and the old
`${accent}33` only ever worked on a literal.

**Listed for Mike, not taken:** the other five variant-type colours
(`live` green, `lyrics` purple, `cover` blue, `clip` + `audio` brown) are a whole
pre-2026 colour vocabulary. J1 named the gold; retiring its five siblings is a
palette decision, and it is already on Mike's own backlog ("variant-pill type
colors … awaiting Mike's read", STATE).

### J3 — the set is the fallback

`GiftShop.billing()` gains a NAMED branch: a WAL exit that resolves no individual
owner (`?from=wal` with no `&owner=`, **or an `&owner=` that names nobody** — a
stale link in the wild) bills nobody, shows the WAL four at one size, and keeps
W.B off the page per Clause 3.

Written as a named branch rather than left to fall out of `ownerKey === null`,
because a behaviour nobody declared is one the next change deletes — and deleting
this one puts W.B on a WAL page, which is the original defect Mike reported. The
branch is stated in the DOM (`data-billing`) so it is verifiable on glass instead
of inferable from an absence.

All seven exit cases re-run:

| exit | billed | roster beneath |
|---|---|---|
| direct `/shop` | Weird.Baby | Hunter Root, Carsie Blanton, Jesse Welles, Mikey Mike |
| `?from=hr` | Hunter Root | Carsie, Jesse, Mikey — **no W.B** |
| `?from=wb` | Weird.Baby | all four |
| `?from=robots` | Weird.Baby | all four |
| `?from=wal&owner=carsie-blanton` | Carsie Blanton | Hunter, Jesse, Mikey — **no W.B** |
| `?from=wal` (no owner) | **NOBODY** (`data-billing="wal-set"`) | **the WAL four — no W.B** |
| `?from=wal&owner=<unknown>` | **NOBODY** (`data-billing="wal-set"`) | **the WAL four — no W.B** |

### J2 — recorded, no build

Per Mike's instruction. Recorded in STATE.

---

## Gates

- **lint 11 errors / 9 warnings** — identical to the HEAD baseline. Zero new.
- **vite build green.**
- Browser lap: `/hr` `/wb` `/wal` `/robots` `/shop` at desktop and 390px; zero
  console errors; `/wal` and `/robots` geometry byte-identical before/after.

---

*(Sections for L3–L6 are appended as each is sealed.)*
