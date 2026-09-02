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

---

## L4 · THE ADVERSARIAL REVIEW'S REMAINING FINDINGS

**Ordered:** *"work the review's fix-list (the mechanical drift beyond what B7
already landed); list judgment items rather than guessing."*

R1 was L3. **R2, R3, R4, R5 and R6 are all done.** What is listed rather than
taken is named at the end, and it is a short list.

### R2 · The title bar was implemented three times — now once

`.ex-nav-*` (Exhibit.css), `.gift-shop__nav-*` (GiftShop.css, whose own comment
read *"Mirrors Exhibit.css .ex-nav … re-pinned to paper tones"*) and
`.booth-nav-*` (InfoBooth.jsx, inline) are retired. One `<MuseumBar>` +
`MuseumBar.css` in a new `src/components/`, rendered by all three rooms.

**The three copies were compared before merging, not assumed identical.** They
disagreed in four places, and every one of them is recorded in `MuseumBar.jsx`:

1. **The exhibit's bar had no narrow-width rule at all.** The shop dropped the
   room name at ≤720px and the booth at ≤680px; the exhibit kept 1.1rem at every
   width.
2. The booth's breakpoint was 680px for the same rule as the shop's 720px.
3. The exhibit navigated with `<button onClick={navigate}>`; the other two used
   `<Link>`. The merged bar is `<Link>` everywhere — a real anchor
   middle-clicks, opens in a tab and shows its target.
4. The room name was a `<div>` on the exhibit and an `<h1>` in the other two.
   `<h1>` won: it is the page's heading, and no other `<h1>` exists on any of
   these routes (checked).

**AND THE MERGE FOUND A LIVE DEFECT THE THIRD COPY HAD BEEN HIDING.** Measured
on `/hr` at 390px before this round: brand 16–94, room 111–262, exit 230–357 —
**32px of "HUNTER ROOT" printed on top of "GIFT SHOP".** The centred name is
absolutely positioned, so it cannot push its neighbours; it runs under them. The
shop's copy of the bar has had a mitigation since the day it was written and the
exhibit's never got one.

Shrinking the type (what the shop's copy did) narrows the collision without
removing it — the geometry is the problem. So at ≤720px the bar becomes an
honest three-column flex row: the name takes the space its neighbours leave, is
centred in it, and ellipsises. Brand and exit are pinned `flex:0 0 auto` +
`nowrap`, without which the wordmark wraps to two lines and the bar grows 10px —
which happened on `/wal` in the first cut and would have quietly broken every
room's top padding.

**Measured after, at 390px: `/hr` `/shop` `/booth` `/wal` `/robots` `/wb` — zero
overlap and zero clipped characters on all six.** Below 390 the longest names
ellipsise and the numbers are on the record (at 320px: `/wal` −67px, `/hr` −47px,
`/booth` −43px); overlap stays 0 at every width tested.

Bar height unchanged: 46px desktop, 42px at ≤720 — which matters, because three
rooms clear it with hard-coded top padding.

### R3 · Six overlays, six Escape handlers — now one hook

`src/lib/use-overlay.js`. The six HR overlays (Gallery, Album, YouTube,
Facebook, Photo, FilterInstrument) each carried their own
`if (e.key === "Escape") onClose()` and five of them their own body-scroll lock.

**A hook, not the `<Overlay>` wrapper R3 sketched, and the reason is in the
file.** R3 wanted a primitive owning "ground, z-order, Escape and focus". Three
of those four are per-overlay by design — a gallery, a video, a Facebook post
and a filter panel have genuinely different grounds and separately-tuned CSS.
Wrapping them would either flatten that or make the wrapper a pass-through for
six class names. What they share is BEHAVIOUR, so behaviour is what was
extracted. **No markup changed, which is also why this cannot move a pixel.**

What lining the six up next to each other found:

- **`FilterInstrumentOverlay` was the one of six that never locked body scroll**
  — so the page moved behind the overlay a visitor is most likely to scroll at.
  Exactly the drift R3 predicted. It locks now.
- **None of the eight restored focus.** Open, press Escape, and the keyboard was
  back at the top of the document. The hook remembers the opener and puts focus
  back — the "focus" R3 named, in one place instead of eight.
- The old copies re-installed their `keydown` listener on every parent render
  (`onClose` was a dependency). The hook holds handlers in refs and installs
  once.

Verified live: the gallery opens, `→` steps 2/16 → 3/16, body locks to `hidden`
while open, Escape closes and the previous overflow is restored; the filter
overlay does the same and now locks where it did not.

### R4 · Six font imports — now one `<link>`

Six Google-font `@import`s across five files. **They had already drifted:** Syne
was requested at `400;600;800` in three rooms and `400;600;700;800` in two, so a
700 weight rendered synthetic-bold on whichever route loaded the shorter list
first; Fredoka was asked for at `500;600`, at `600`, and at `400;600`.

The union — Courier Prime · DM Serif Display · Fraunces · Fredoka · Geist · Syne,
alphabetical as the css2 API requires — is now requested **once**.

**Not where R4 suggested, and the reason is recorded in both places.** It first
went into `museum-tokens.css`, which is the file the type tokens live in and
looked like its home. It is not: that file is imported by three stylesheets, so
the built CSS carried **three identical `@import` lines**. It is now a single
`<link>` in `index.html`, which is also the faster mechanism by a real margin —
an `@import` is discovered only after the CSS containing it has been fetched and
parsed, while a `<link>` is found by the preload scanner on the first pass. Both
Google hosts get a `preconnect`.

Verified: **0** font requests in the built CSS, **1** stylesheet link in the
built HTML, and all seven faces present on all seven routes.

### R5 · Two stylesheet mechanisms — now one

`WbHome.css`, `InfoBooth.css`, `WbAdmin.css` are real files. The three inline
`<style>{…}</style>` template literals are gone.

**This is not only hygiene, and this round is the evidence.** A template literal
ends at the first backtick, so one backtick in a CSS comment is a build failure
at parse — **that happened twice in this round alone**, both times while writing
prose about the file. B7 recorded it happening once. Three times is a mechanism,
not bad luck.

**The one thing that was not a straight move.** An inline `<style>` is scoped BY
MOUNT: its `html, body` rules paint while the route is on screen and vanish when
React unmounts it. A `.css` file is global and permanent, so moving those rules
verbatim would have painted the operator room's `#050505` ground over the whole
museum. They are now scoped to `html[data-room="…"]`, set on mount and cleared on
unmount by `src/lib/use-room.js` — the same lifetime, said declaratively.

Verified: `/admin` black, `/` and `/booth` paper, `/hr` `/shop` `/wal` `/robots`
carrying no room attribute at all; and the lifetime itself — navigating from
`/admin` to `/` in-app flips the ground back with no reload.

The three duplicated global resets went too: `src/index.css` already declares it
and `main.jsx` imports it, so that one is guaranteed rather than bundled by luck.

### R6 · The dead event is deleted

`wb-robots-twin-closed` was dispatched by `RobotsExhibitFlow.closeTwin()` with no
listener anywhere in the tree — its receiver went with G1's retirement of the
live face. Removed rather than restored: there is no second machine to stand
down, and reviving the announcement is the job of whatever revives the live face.
B7 left it in place because behaviour does not change without a stated reason;
the reason is that an event nobody receives still has to be reasoned about, and
it cost that round a real minute deciding whether Escape could safely fire it.

### FOUND WHILE DOING THE ABOVE

- **`src/App.css` was dead.** 180 lines of the Vite starter template
  (`.hero`, `#next-steps`, `.counter`) imported by nothing. Deleted.
- **`--ex-true-h` is a variable nothing sets.** `.ex-root`'s `min-height` reads
  `max(100vh, calc(var(--ex-true-h, 0px) + 64px))`, and a grep of the whole tree
  finds no writer — so the expression is permanently `max(100vh, 64px)`. Left in
  place (removing it is a behaviour question about what the root's height should
  be, not a conformance one) and listed here.

### LISTED, NOT TAKEN — the judgment items

| # | item | why it is Mike's |
|---|---|---|
| 1 | **The wordmark points to two different rooms.** On an exhibit it goes to the GIFT SHOP; on the shop and the booth it goes to the LOBBY. The merge made this visible by putting all three in one component. It may be deliberate — an exhibit's wordmark and its exit deliberately landing together — so it is a prop, not a decision. | it is where the museum sends people |
| 2 | **The five sibling variant-type colours** (`live` green, `lyrics` purple, `cover` blue, `clip`/`audio` brown). J1 named the gold and the gold is gone; these are a whole pre-2026 colour vocabulary and already on Mike's own backlog. | palette |
| 3 | **163 hand-typed font stacks** (L3's table). Substituting the token changes the FALLBACK chain, so it is not byte-identical and fails the acceptance test this round was given. | a real decision about what happens when Syne does not load |
| 4 | **`WbAdmin`'s 27 remaining colours** — J4, listed in full in L3 with what each is and what it should probably become. | whether the operator's room joins the museum |
| 5 | **`--ex-true-h`** — dead variable, above. | what the exhibit root's height should actually be |

### Gates

- **lint 11 errors / 9 warnings** — HEAD baseline, zero new.
- **vite build green.**
- Lap: seven routes at 1200px and 390px; bar geometry measured on six rooms at
  320/360/390/1200; overlay behaviour driven from the keyboard; room-ground
  lifetime tested across an in-app navigation.

---

---

## L5 · THE ROBOTS WING, SECOND PASS

**Ordered:** *"the wing still lags the WAL quality bar. Structure and visuals
only — raise composition, typography, spacing, imagery presentation toward the
collage standard. Do NOT write Mike's [PAPA] text; make the frames worthy of
it."*

**Not one word of content was written, added or altered.** Every image and every
caption on the wing's new surfaces was already in the data.

### What "lags the bar" is, in numbers

Measured on `/robots` at 1400×900 before this pass:

| void | measurement |
|---|---|
| the stage's second column | **466 of 970px — 48% of the sheet — with ZERO children**, hard against the text |
| the contents column | **326 × 878 holding 214px of list — 664px, 76%, blank** |
| the sheet itself | face `#ece9e0` on a column `#e7e3d8` — **four units of luminance**, no edge, no shadow |

That is the wing: a two-column page printed on one side, a contents column that
is mostly margin, and no sheet at all — in a room about a photographed physical
object whose nine photographs appear in exactly one place.

### F1 · A one-column page is SET as one column

`stg-1up` already existed and already dropped the divider rule; its comment said
the empty column was kept for LINE LENGTH. That reasoning is right and was half
applied — it decided how WIDE the measure should be and never decided where it
should SIT. A single column of type on a wide sheet is centred, and has been
since there were pages.

The measure is pinned to exactly the width it already had (half the sheet less
half the gutter — the packer's own arithmetic) and the page centres it. **No
block moves, reflows or re-paginates**; verified page 1 of The Plates sits at
466px centred on a 970px sheet, dead on the axis.

### F2 · The contents column prints the object

`contentsPlate`, opt-in by config like `bodyKey` / `stage` / `playerBar` /
`fitOnEntry` before it. The album's own `viewerPoster` and
`viewerPosterCaption`, filed under the contents list.

**Nothing is chosen or written by the rule.** Every album here already declares
a poster picked on stated grounds and a caption already written — and on a
STAGED wing a face covers the viewer from the moment the room opens, so that
photograph was one **nobody ever reached**. It now stands where the room had a
hole.

Built from the collage's own materials, because the collage is the bar: warm
print stock, a hairline, a real two-part shadow. **What it does not take is the
tilt** — a wall of glued-up tiles is tilted because a wall is casual; a single
plate filed under a contents list is a document, and a crooked document reads as
an accident.

### F3 · The page is a SHEET, on a MAT

The one document surface in the museum that was not a print is now one:
`--wb-ink-card` stock, inset from its frame so the mat shows on four sides, with
the same shadow every other print in the building casts. Scoped to the staged
wing and, inside it, to the paper faces — the Portal and the panel declare a
dark ground on purpose and must not be given a sheet.

**The mat is PADDING on the face, not an inset, and that is not a preference.**
The first cut moved the face in with `inset:18px` and the room grew an **18px
black border on all four sides**. Cause: `useYTPlayer` builds its player eagerly
on mount (a fix for mobile first-click playback), so an opaque black YouTube
iframe fills `.vp-area` on **every** wing — including this one, which declares
`playerBar:false` and has no video at all. The face at `inset:0` had been the
lid over it. So the face keeps `inset:0`, the mat is its padding and the sheet is
the body inside it.

### F4 · The photo law is now written the way B4 said it wanted to be written

B4's own comment says a photo law written as a list of components is *"nine rules
that the tenth new surface quietly escapes"* — and then wrote a list of six
components. **The tenth surface arrived in this round, four hours later:** F2's
contents plate came up in colour, measured `filter: none`, exactly as B4
predicted and for exactly B4's reason.

The rule is now every photograph in the wing (`img`, which is what every image
here is; the interface is SVG and CSS and cannot be touched by it), with
`[data-colour]` as an escape a surface must ASK for rather than one it gets by
being new. Nothing declares it. Verified: every `img` on `/robots` computes
`grayscale(1) contrast(1.03)`.

### F5 · THE LEAD IS ITS OWN BLOCK — and the stage had been saying so, in words

The head held the title, the subtitle AND the lead paragraph as one indivisible
block. On a phone that block is taller than a whole page of the staged wing, and
the packer's own diagnostic said so on every load of `/robots` at 390px:

> `[stage] block 0 is 244px and a column holds 202px — it gets a column of its
> own and will overrun. Split it upstream, or mark it data-stage-full if it
> wants the page.`

**Measured clipping at 390px: The Firmware lost 83px off page 1, The Manual
39px.** B5/D7 fixed the WALL's phone overflow last round; these two TEXT faces
were still losing their first page, and the console had been reporting it.

Of the two remedies the message offers, `data-stage-full` is the wrong one — a
lead paragraph is not a wall and does not want the sheet. Splitting upstream is
right, and the seam was already in the data: `title`/`subtitle` are the page's
HEADING, `blurb` is its LEAD. Two things, two blocks, and the packer can page
between them.

**After: 0px clipped on every face at every width tested, and the `[stage]`
warning is gone from the console.** Firmware 4→5 pages, Manual 9→10 — content
that was being cut is now being turned to.

**And it moved something on the flat wing, which was caught and put back.** The
lead had been inside `.vp-face-headtext` (gap 10px); as a sibling it inherits
its container's gap, and `.vp-flat` — WAL's container — is a plain block with no
gap at all. Measured on `/wal`: 0px where there had been 10. Restored with one
rule scoped to the flat container.

### Both additions stand down at stacked widths, and the measurement is why

Below 720px the two columns are not columns — they stack inside a body of FIXED
height, so anything added to the contents column comes straight out of the
stage's frame. Measured at 390px with both in place: **206px of the page
clipped** — the plate accounting for 144 and the mat for 62. With both stood
down: zero, on all five pages of the wall.

That is the rule reading its own condition rather than a compromise. The plate
fills a void that exists only when the list is a narrow column beside a wide
stage; when the list is a full-width band above the stage there is no void,
there is a shortage. And a mat is the space a printed page sits in — on a phone
the page IS the screen.

### LISTED FOR MIKE — not taken

1. **The house album's poster is its own logo**, so on `/robots` → Weird.Baby
   Robots the contents plate is the same mark that is in the carousel 300px
   above it. The mechanism is right; that one album's chosen photograph is a
   portrait of the mark rather than of a thing. A distinct house photograph
   would earn the slot. Content, so it is Mike's.
2. **Per-face plates.** The face contract already supports a head still
   (`still` / `stillCaption`, which WAL uses); the wing owns nine captioned
   photographs and uses them on one face. Pairing a photograph to a page —
   the front to The Record, the lit glass to The Firmware — is curation, not
   framing, so it is listed rather than done.
3. **The carousel band** is 1367 × 300px for two tiles. Shrinking it makes the
   tiles smaller rather than the room fuller, so nothing was changed; a third
   album is the real answer and that is content.
4. **`useYTPlayer` builds a black YouTube iframe on a wing with no video** (F3,
   above). It is invisible today because a face covers it, which is a lid rather
   than a fix. Not touched: gating it is a change to the player's own lifecycle
   on every wing, which is not this brief.

### Gates

- **lint 11 errors / 9 warnings** — HEAD baseline, zero new. **vite build green.**
- `/robots` walked face by face and page by page at **390 / 760 / 1400px**, both
  albums, every page of every face: **worst overflow 0px**.
- `/hr` `/wb` `/wal` `/shop` `/booth` `/` `/admin` re-verified; `/wal`'s lead
  spacing measured back to 10px; `/hr` `/wb` `/wal` geometry unchanged (they
  carry no `data-stage`).
- **Console clean across nine route/width combinations — no errors and no
  `[stage]` overrun warnings**, which for this wing is the gate.

---

---

## L6 · BINGE PREP — the doctrine made concrete

**Ordered:** *"the Record must carry weeks of material at launch and accept
evidence classes beyond plates (photos, transmissions, documents). Build the
model + the surfaces that display each class, all data-driven, all
empty-and-honest until Mike's content arrives. Deliver a short docs note on
exactly what content shape each class expects, so Mike can produce against it."*

**The docs note is `docs/RECORD_CONTENT_SHAPES.md`.** It is written for Mike, not
for Ops: what to hand the Record, field by field, with the file rules and the
measured volume numbers.

### The model is a module now — `src/lib/record-model.js`

Pure, framework-free and unit-tested, the way `fact-select.js` is: the renderer
asks it questions and it never asks the renderer anything. It owns the date, the
bands, the payload manifest and the document state. **29 assertions, 29 passing**
— ISO parsing (including the calendar-vs-instant trap: `new Date("2024-01-01")`
is the 31st of December west of Greenwich, and a log that shifts its own dates by
timezone is not a record), stamp derivation, banding thresholds, payload counting
and the three document states.

### THE DATE — the thing D-WEEKLY-EVERYWHERE said was missing

That doctrine named it exactly: *"The Record's `stamp` is a display string, not a
date — it would need a real one."* Every entry now carries `date: "YYYY-MM-DD"`.

The ten dates are **transcriptions of the stamps that were already printed**, not
new facts. With them the index can band, an automation can ask what is new this
week, and a new entry needs only a date because the stamp derives from it. The
authored stamps stay and win, so nothing a visitor reads has moved.

### THE THIRD CLASS — `docs`

B9 gave the Record `wire` (transmissions) and `plates` (photographs) and had no
shape for the third thing Mike named. A **document is neither**, because a
document is a thing with a PROVENANCE first — who wrote it, when, how many pages
— and then, separately and later, an image of it and/or words taken out of it.

**Those three arrive at different times, which is exactly why they are three
fields.** A catalogue card can be written the day the document is found; the scan
waits on a camera; the extract waits on somebody reading it. A model demanding
all three at once would mean nothing about a document could be published until
everything about it was — and the Record is a log of a discovery *in progress*.

So the state is part of the model rather than an accident of which fields happen
to be filled:

| state | condition | surface |
|---|---|---|
| `imaged` | `scan` set | the page, opening in the same reader a plate off the wall opens; a set of scans on one entry opens as **its own reel** |
| `quoted` | no scan, `extract` set | the extract, set as a quotation of the document |
| `held` | neither | the provenance on a dashed card, saying plainly the page itself is not here |

**`held` is the honest half** — the same discipline as B8's reel, which ships
empty and prints "reel empty" rather than rendering nothing and hoping. A card
reading `held` is not a placeholder; it is a record of a thing the museum has and
has not photographed.

### THE INDEX AT VOLUME — bands, and a manifest per row

- **Month bands**, derived from the dates. Weeks are D-EPISODE's unit and are the
  obvious band — and at binge volume two years of weekly episodes is a hundred
  headings, which is a hundred rows of furniture in an index trying to be
  walkable. A month bands the same material into twenty-four and every entry
  still carries its own day. Bands appear only at **14+ entries spanning more
  than one month**, so today's ten-entry Record is byte-identical.
- **A payload manifest on each row** — `PLATES 3`, `WIRE 2`, `DOCS 1`. B9 put the
  CLASS on the index so a reader could see a week brought a transmission rather
  than another paragraph; the count is the other half. Three photographs and a
  transmission is a different Tuesday from one photograph, and at volume that
  difference *is* the navigation. Absent entirely on an entry with no payloads —
  which is every entry written so far.

### AN OPENED RECORD IS A RUN OF BLOCKS, NOT ONE BLOCK

Found by the volume proof, not by reading. `.vp-rec` was a single div, which the
stage sees as one indivisible thing — fine while every entry was a paragraph, not
fine the moment an entry carries the evidence the brief asks for. **Measured with
a synthetic entry holding three documents and a transmission: 32px off the bottom
of the page, clipped, no scrollbar** — the same shape of defect as D3's wall and
L5's head, one level further in.

The record's parts are now siblings and the packer pages them; the document list
carries `data-stage-split="row"` so a stack of ten divides by card rather than as
a lump. Same result: **0px clipped.**

**One React fact banked, because it cost real time:** `React.Children.toArray`
does **not** flatten a `<>Fragment</>` into separate children here — the packer
kept seeing one block while the DOM showed five, which looks like success and is
not. Returning a **keyed array** flattens correctly. Measured through the
packer's own measure layer: 8 blocks with a fragment, 10 with an array.

### THE VOLUME PROOF — 400 entries, run and reverted

A generated 390-entry tail was added to the Record, measured, and removed. The
tree is byte-identical to before the probe apart from the ten dates.

| | desktop 1400px | phone 390px |
|---|---|---|
| index at 400 entries | **33 pages, 0px clipped** | **242 pages, 0px clipped** |
| open entry, 3 docs + a transmission | **1 page, 0px clipped** | 0px clipped |

Bands verified rendering (`FEB 2031`, `DEC 2030` …), manifests verified counting,
and all three document states verified on glass — `held` dashed with its
provenance, `quoted` with its extract, `imaged` with its scan wired to the reader.

**The honest caveat, stated rather than buried:** 242 sheets on a phone is not
broken — nothing clips — but it is *long*. The month bands are what make it
walkable; if the Record ever reaches that size the next lever is a jump by period
rather than by sheet. **Named, not built** — inventing navigation is a UX call.

### Empty-and-honest, verified

The shipping Record is **unchanged for a visitor**: 10 rows, no bands (below the
threshold), no manifests (no payloads), the same stamps in the same newest-first
order, 0px overflow at 1400px and 390px. Every new surface is present in the code
and absent from the page until content arrives — which is the ask.

### Gates

- **lint 11 errors / 9 warnings** — HEAD baseline, zero new. **vite build green.**
- **record-model: 29/29 assertions.**
- `/robots` walked at 1400px and 390px, both albums, index and open entry, with
  and without the volume probe.

---

## THE ROUND, CLOSED

Five seals: L1+L2, L3, L4, L5, L6. Every gate held at the HEAD baseline
throughout — **lint 11 errors / 9 warnings, vite build green, console clean** —
and every claim in this log is a measurement taken this round, not a recollection.
