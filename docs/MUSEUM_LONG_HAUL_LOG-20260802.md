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

---

## L3 · THE TOKEN CONFORMANCE ROUND

**Ordered:** *"four visitor-facing surfaces use ZERO design tokens — 151
hard-coded colors, 96 byte-identical to an existing `--wb-*`. GiftShop.css cites
museum-tokens in its header while using none. Conform all four to the token
system; pixel-identity is the acceptance test. Anything NOT byte-identical to an
existing token: list it with what it is and what it should probably become — do
not invent palette."*

### The ledger is now a tool, not a table

`tools/token-audit.mjs` (new) parses the palette out of `museum-tokens.css`
itself — it does not re-type it, which would have been a third mirror — and
reports per surface: literals found, how many are byte-for-byte an existing
token, how many are not, and how many `var(--wb-*)` reads the surface already
makes. `--verbose` prints every unmatched value with its first site.

R1's table was reproducible only from a script in a run log. This one re-runs on
demand, so the next colour typed by hand is visible the day it lands.

**One correction it makes to R1's method:** an `rgba()` whose RGB triple matches
a token is NOT byte-identical to it — swapping it would drop the alpha. Those are
counted as decisions, never as mechanical. R1's "96" is unaffected (all 96 were
plain hex); the difference shows up on `Exhibit.css`, where 44 alpha-bearing
`rgba()` values had been counted as matches.

### Before / after

| surface | `var(--wb-*)` before → after | literals before → after |
|---|---|---|
| `GiftShop.css` | 1 → **41** | 44 → **4** |
| `WbHome.jsx` | 0 → **33** | 43 → **10** |
| `InfoBooth.jsx` | 1 → **23** | 27 → **5** |
| `WbAdmin.jsx` | 0 → **14** | 38 → **27** |

**96 substitutions**, exactly the count R1 predicted.

### Pixel-identity, proved statically rather than eyeballed

Every `var(--wb-*)` written this round was substituted back to its token's
literal value and the result diffed against `git HEAD`. Two of the three colour
surfaces round-trip **byte-for-byte identical**; the third differs in exactly one
character, and that character is a finding of its own (below). Nothing else in
those files moved.

That is a stronger acceptance test than a screenshot comparison, and it does not
depend on the **/shop nondeterminism** at all — which, worth noting, is now gone
anyway: B1 and J3 made billing a pure function of the URL, so `pickRandomArtist`
no longer runs on that page.

Live verification that the tokens actually resolve (they are not imported by the
inline-style surfaces): `/` `#d9d5ca` · `/booth` `#211f1c` / `#faf8f3` /
`#c6c2b7` · `/shop` all four probes · `/admin` accent `rgb(201,201,201)`.

### THREE THINGS THE SWEEP FOUND THAT THE SWEEP WAS NOT LOOKING FOR

**1 · The token file had a typo that made its own audit lie.**
`--wb-ink-soft: #e2deD3` — a capital D, from the day it was written. Identical to
a browser; a *different string* to any byte-for-byte audit. Every surface that
typed the lowercase form read as "not a token". Fixed to `#e2ded3` (the JS mirror
in `tokens.js` already had it lowercase, so this also closes a silent gap in the
H1 mirror contract). Pixel-identity is trivial: one colour.

**2 · The palette was being re-typed one level down, to escape a re-pin.**
`.hr-bar-pop` (the filter/preset popover) is a DOM child of the player bar, whose
rule re-pins the whole ramp dark. The popover is paper, so it had to undo that —
and CSS gives no way to say "revert this custom property to its root value"
(`initial` yields the guaranteed-invalid value, not the inherited one). So it
**wrote all twelve values out again**: a full second copy of the palette that
forks the first time a token moves. Fixed with `--wb-paper-*` aliases in the
token file — a `var()` inside a custom property is substituted where it is
DECLARED, so each alias freezes the `:root` value and every descendant inherits
it, including descendants standing inside a re-pin. Same values, one source.

**3 · The museum's dark scope lived inside one selector, so the second room that
wanted it had to copy seven values.** "Screens are dark" is a standing rule of
this building; the ramp expressing it was declared inline in `.pb`'s rule in
`Exhibit.css`, where it read as that bar's private business. It is not — and the
moment J1 sent the operator's room to it, the only way to adopt it was a copy.
Promoted to `--wb-booth-*` in the token file; `.pb` and `.adm` both read it.
Byte-for-byte the bar's own values, moved not chosen.

### THE DECISION LIST — values with no token

Ops does not invent palette. Each of these is stated with what it IS and what it
should PROBABLY become; the call is Mike's.

**The two strongest recommendations first, because each is a rung the ramp is
actually missing** — both appear on more than one surface, independently typed,
which is what a de-facto token looks like:

| value | where | what it is | should probably become |
|---|---|---|---|
| **`#6f6b62`** ×4 | shop merch price · lobby directory rows · booth buttons | a mid grey sitting between `--wb-gold-lo` `#57544d` and `--wb-gold-mute` `#9b978d` — the "secondary label" weight | a NEW rung, `--wb-gold-mid`. Three surfaces reached for it independently |
| **`#2b2924`** ×4 | lobby subtitle + two more · booth FAQ answers | body ink one step lighter than `--wb-gold` `#211f1c` — running text, not headline | a NEW rung, `--wb-ink-body`, or fold into `--wb-gold` |

Remaining, per surface:

| surface | value | what it is | should probably become |
|---|---|---|---|
| `GiftShop.css` | `#211f1c14` ×2 | `--wb-gold` at 8% — top stop of the fallback-plate gradient | `color-mix(in srgb, var(--wb-gold) 8%, transparent)` (not byte-identical; rounds) |
| | `#8a867c` | placeholder-copy grey | `--wb-gold-mute` `#9b978d` |
| `WbHome.jsx` | `#f7f5ee` | the lit centre of the lobby's radial | `--wb-ink-card` `#faf8f3`, or a new `--wb-paper-lit` |
| | `#837f75` | the whisper line under the subtitle | `--wb-gold-mute` |
| | `#f5f3ec` | Sign-button label reversed out of black | `--wb-ink-card` |
| | `#f2efe6` | guest-book row hover ground | a new `--wb-ink-hover` — it is between `--wb-ink` and `--wb-ink-card` and there is no rung there |
| | `#b0aca1` | the footer credit | `--wb-border-hi` `#a9a59a` |
| `InfoBooth.jsx` | `#d8d4c9` | the rule between FAQ rows | `--wb-border` `#c6c2b7` |

**`WbAdmin.jsx` — all 27 remaining values, listed, none changed.** J4 asked
whether the operator's room joins the museum; that is Mike's, and the room is
still fully on the pre-2026 dark scheme. What was taken is J1, which he ruled:
eleven gold sites now read `--wb-booth-gold`.

| group | values | what they are | should probably become |
|---|---|---|---|
| grounds | `#050505` ×2 · `#0c0c0c` · `#0d0d0d` · `#0f0f0f` ×2 · `#141414` · `#161616` · `#1a1a1a` · `#222222` ×2 · `#2a2a2a` ×2 | an eleven-step near-black ladder — page, card, rule, hover, empty-state | the booth's `--wb-booth-ink-card` `#1a1a1a` + `--wb-booth-border` `#3e3e3e` cover the middle; the ladder wants three rungs, not eleven |
| type | `#d0cbc3` ×3 · `#e8e4dc` · `#aaaaaa` · `#555555` ×4 · `#444444` · `#333333` ×3 | body, name, table cell, label, muted, faint | `--wb-booth-dim` `#b6b6b6` · `--wb-booth-gold` `#c9c9c9` · `--wb-booth-gold-lo` `#8e8e8e` |
| gold residue | `#2a2218` | the FOUNDING badge's rule — the retired gold's own shadow | goes with the gold: `--wb-booth-border` |
| coincidence | `#1a1a1a` | a header rule that happens to equal `--wb-booth-ink-card` | do NOT substitute on the match alone — a rule is not a card ground. Named so the audit's "1 = a token" on this file is not read as a missed sweep |

### ALSO LISTED — the type half of the token system is not conformed either

The palette is not the only thing in `museum-tokens.css`. `--wb-serif`,
`--wb-sans` and `--wb-mono` exist, and the font stacks are typed by hand almost
everywhere:

| surface | `font-family` literals | reading a token |
|---|---|---|
| `GiftShop.css` | 16 | 1 |
| `WbHome.jsx` | 17 | 0 |
| `InfoBooth.jsx` | 9 | 1 |
| `WbAdmin.jsx` | 9 | 0 |
| `Exhibit.css` | 82 | 3 |
| `HrExhibitFlow.css` | 30 | 21 |

**Not taken this round, deliberately, because it is NOT byte-identical.** The
literals read `'Syne', sans-serif`; the token reads
`'Syne', system-ui, -apple-system, sans-serif`. Same pixels whenever Syne loads,
different pixels when it does not — so substituting is a fallback-behaviour
change, not a conformance one, and it fails the acceptance test this round was
given. It is a real 163-site drift and it wants its own decision.

### FOUND IN THE LAP — `/admin` white-screened on any API error

Not a palette bug; found because verifying the palette required the page to
render, and it did not.

`fetch("/api/admin").then(r => r.json())` **resolves happily on a 500** — the
worker answers `{"error":"D1_ERROR: no such table: guestbook"}` with a JSON body,
so `.catch` never fires and `data` becomes an object with no `guestbook`.
Downstream, `data.guestbook?.length === 0` is **false** for `undefined` (the
optional chain returns undefined, and `undefined !== 0`), so the render took the
TABLE branch and called `.map` on nothing. React unmounted the tree: **a blank
page, no message, on the one route whose whole job is to say what is going on.**
The `setError` state existed and was unreachable.

Reproduced exactly that way on the dev server. The same 500 in production gives
the same blank page. Fixed: honour the status, surface the error the server
already sent, and read `!length` (which covers absent, empty and zero alike, as
the sibling sections already did). Verified: `/admin` now renders its chrome and
prints *"Error: D1_ERROR: no such table: guestbook"*.

### And the build broke while writing this, which is R5's argument in one line

Adding a prose comment containing backticks to `WbAdmin.jsx`'s inline
`<style>` template literal ended the literal and failed the build at parse. R5
says a stylesheet that can be broken by punctuation belongs in a `.css` file; it
has now done it twice.

### Gates

- **lint 11 errors / 9 warnings** — HEAD baseline, zero new.
- **vite build green.**
- `/` `/booth` `/shop` `/admin` walked; token resolution verified live on each.

---

*(Sections for L4–L6 are appended as each is sealed.)*
