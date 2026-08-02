# THE VIEWER STANDARD — a proposal

**Status:** decision-ready. **Nothing here is built.** The build fires after
Mike rules.
**Evidence base:** `docs/UI_CENSUS-20260801.md` (measured, same run).
**Renders:** `docs/renders/stage-01..04.png` — mockups, not screenshots of the
app.

---

## 1. THE PROBLEM, IN NUMBERS

The viewer scrolls inside itself. When its content ends, the page behind it
still has scroll left, so the guest reaches the bottom of what they can see,
the page looks finished, and the wheel does something they did not ask for.

Measured on the built site, MGK-VIIIp, viewer at its 880px default:

| track | desktop 1582×904 | phone 504×804 |
|---|---|---|
| The Record | **182px hidden** | **533px hidden** |
| The Manual | **146px hidden** | **562px hidden** |
| The Firmware | fits | 289px hidden |
| The Portal | fits | 138px hidden |
| FAQ | fits | 270px hidden |

**On a phone every single track is trapped**, because the columns stack and the
panel's usable height collapses to 310px while the content does not shorten.
At laptop size (1262×624, viewer 460) the front desk traps too: FAQ 227px.

Two aggravations from the census, both structural:

- **A fixed player bar** (`.pb`, 68px, `z=100`) is pinned to the viewport floor
  on every exhibit route — **11% of a 624px screen** — covering space the panel
  believes it owns.
- **Three independent drags** (deck height, split %, viewer height) mean the
  guest can create a geometry no designer chose, and the trap gets worse in
  most directions.

**And it will get worse, not better.** The coming set is longer than anything
in there now: The Record (journal, 436 entries on file), Model 01-31, One Page
Ads, the User Manual (plates), the Fact List, the Summary.

---

## 2. THE RECOMMENDATION — **THE STAGE**

> **The viewer is a fixed stage. It never scrolls. Content is fitted to it and
> advanced as pages.**

This is Mike's deeper instinct, adopted whole, plus the two rules it needs to
survive real content.

### 2.1 The four laws

1. **THE STAGE NEVER SCROLLS.** No scrollbar, no wheel-capture, no inner
   scroll boundary anywhere in the viewer. If content does not fit, it is
   **paginated**, not hidden behind an edge.
2. **PAGES ARE FITTED, AND BALANCED.** Pagination measures the stage and packs
   to it. When content spills only slightly, pages are **balanced** rather than
   packed — 1.3 stages becomes two half-full pages, not one full page and a
   nearly empty one. *(Render 01 deliberately shows an unbalanced page so the
   rule has something to argue with — see §6.)*
3. **WIDTH BUYS A COLUMN, NOT A LONGER LINE.** The stage keeps one comfortable
   measure (~52–58 characters). When it is wider than one measure, it sets a
   **second column**. This is what resolves the narrow-measure question
   *inside* the standard rather than beside it. → **Render 04**
4. **SECTIONS EXPAND IN PLACE.** An expanded thing takes the stage; what it
   pushes is genuinely unreachable, because there is no scroll to reach it
   with; collapsing restores the page exactly as it was. **No
   jump-to-a-new-page feeling.** → **Render 03**

### 2.2 The transport

One row at the foot of the stage, in the house mono, carrying at most:
**‹ prev · a position readout · next ›**, plus a tick strip when the page count
is small enough to show. Keyboard: ← → and PgUp/PgDn. That is the entire
navigation vocabulary.

### 2.3 Period-true idioms, per surface

Researched against what these objects actually were, so the pagination reads as
the object rather than as a web control:

| surface | idiom | readout | render |
|---|---|---|---|
| **The Record** | a bound journal, one dated entry per page, closing on the tombstone endmark already built in M5 | `ENTRY 3 / 10` + tick strip | **01** |
| **The Manual** | a **microfiche carrier** — plates advance in a strip, the live frame lit | `PLATE 7 / 24 · section 2` | **02** |
| **One Page Ads** | a plate per page, full-bleed on the stage, no chrome | `PLATE n / m` | — |
| **Model 01-31** | a specimen card index — one unit per card | `UNIT 14 / 31` | — |
| **Fact List** | the **peephole**: exactly one fact in a window, advanced one at a time. No library, no list — the format Mike already named | `·····•····` dots only | — |
| **Summary** | a single standing page; if it grows past one stage it is not a summary any more | *(no transport)* | — |
| **FAQ / registers** | expand-in-place | `1 of 4 open` | **03** |

**Why microfiche for the Manual and not just "pages":** the manual's page
images are photographic plates of a physical document. A carrier gives the
guest a position in a physical strip, which a page number does not, and it
makes 24 plates feel like an object rather than a slideshow.

---

## 3. ALTERNATIVES CONSIDERED — with the honest trade

### A. Keep inner scroll, fix the seam
Give the panel a visible scroll affordance and stop the page scrolling while
the pointer is inside it.
- **For:** smallest change by a wide margin; no content work at all.
- **Against:** it makes the trap *legible*, not gone. Two scrolls in one
  gesture space remains two scrolls, and scroll-capture is exactly the
  behaviour that feels broken on a trackpad.
- **Verdict:** rejected. It is a label on the problem.

### B. Mike's stated candidate — height changes only indirectly
Remove the vertical drag; horizontal resize preserves aspect, so height follows
width.
- **For:** removes one of the three drags and the geometries it creates; keeps
  the stage a predictable shape, which pagination *needs*.
- **Against:** on its own it does not stop the trapping — a fixed aspect still
  produces a box too short for The Record on a phone. It is a **precondition**
  for the stage, not an alternative to it.
- **Verdict:** **adopt as part of the standard**, not instead of it. See §4.

### C. The stage — recommended
- **For:** the trap cannot exist, because the mechanism that causes it is gone.
  Serves every coming surface. Period-true. Makes the measure question answer
  itself.
- **Against:** **it is the most work**, and it moves cost from the renderer to
  the *content*: something has to decide where pages break. Long unbreakable
  blocks (a 900-word record entry with no natural seam) will need either
  authored breaks or a measured auto-paginator, and the auto-paginator is the
  hard part.
- **Verdict:** recommended.

### D. Full-page routes — one track, one URL
Abandon the viewer; each track becomes its own page.
- **For:** the browser's own scroll, which never traps; free deep links.
- **Against:** loses the deck-and-viewer form the museum is built on, and
  turns an exhibit into a website. It also throws away /hr and /wb's shape for
  a /robots problem.
- **Verdict:** rejected on identity, not on mechanics.

---

## 4. WHAT THE STANDARD REQUIRES OF THE GEOMETRY

Pagination needs a stage whose size it can predict. So the standard adopts
Mike's candidate as a rule:

- **The viewer's height is derived, not dragged.** `.bd-dh` retires; the stage
  takes its height from the width at a fixed aspect, clamped to the viewport
  minus the fixed furniture.
- **The split stays.** Horizontal resize is the guest's chair and it does not
  fight pagination — it changes the measure, and §2.1 law 3 already says what
  a wider measure buys.
- **The player bar must stop overlapping the stage.** 68px of fixed furniture
  over a fixed stage is a permanent lie about the available height. Either the
  stage reserves it or the bar stops being fixed on exhibit routes. **This is a
  prerequisite, and it is currently unbudgeted.**

---

## 5. MIGRATION COST, PER SURFACE

Honest estimates. "Renderer" = `Exhibit.jsx` + `Exhibit.css`; "content" =
artist config data.

| surface | work | risk |
|---|---|---|
| **the stage shell** (fixed frame, transport, keyboard) | renderer, ~1 round | low — it is a container and a control row |
| **the auto-paginator** (measure, pack, balance) | renderer, **1–2 rounds on its own** | **the whole risk of the proposal lives here** |
| **The Record** | content: entries already discrete; pagination is per entry | low |
| **FAQ / registers** | renderer: expand-in-place replaces the M5 index/open pair | low — M5 already proved the interaction |
| **The Manual** | content: plate images do not exist yet ([PAPA]); carrier is renderer | blocked on assets, not on code |
| **One Page Ads / Model 01-31** | content only, once the stage exists | low |
| **Fact List** | renderer: the peephole is a new, small kind | low |
| **/hr and /wb** | **none** | **none** — they declare zero faces; the face machinery is /robots-only, so this cannot touch them |

**The single most useful thing in this table:** /hr and /wb are immune. The
census confirmed `hunter-root-spine.js` declares no faces at all, so the entire
proposal is scoped to one route until someone opts another one in.

---

## 6. WHAT I AM NOT CONFIDENT ABOUT

Stated so the ruling is made on the real thing:

- **The auto-paginator is the hard part and I have not prototyped it.** Packing
  text to a measured box, balancing the last spread, and doing it again on
  every resize without flicker is real work. The renders are static mockups —
  **they demonstrate the target, they do not prove it is cheap.**
- **Render 01 shows a page that does not fill the stage.** That is law 2 being
  violated on purpose so the balancing rule has an example to argue against.
  Ruling wanted: balance pages, or let short pages be short the way a book
  does?
- **The player-bar overlap has no plan.** It is called a prerequisite in §4 and
  it is genuinely unscoped.
- **Nothing was tested on touch hardware.** The census's `touch-action:auto`
  observation on all three drags is a CSS reading, not a device result — and a
  paging gesture on a phone is a swipe, which is exactly where that matters.
- **The measure numbers (52–58ch) are inherited, not derived.** They came from
  a default I set when the faces were first built; the two-column rule makes
  them matter more, not less, so they deserve one real typographic pass.

---

## 7. THE ASK

1. **Rule on the standard** — the stage, as described, or one of the
   alternatives in §3.
2. **Rule on law 2** — balanced pages, or honest short pages.
3. **Rule on §4** — does `.bd-dh` retire, and what happens to the player bar.
4. If the standard is adopted, **the first build is the shell and the Record**,
   because the Record is the surface that both traps worst and paginates most
   naturally.
