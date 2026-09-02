# THE MORNING RIP — round log (v37, 2026-08-03)

Autonomous single-agent Code-lane round on Mike's remote-control brief.
Seven seals, all committed, **not pushed** (push is Mike's).
Deliverable folder: `docs/optometrist-20260803/`.

Gates at every seal: **lint 11 err / 9 warn** (= HEAD baseline, zero new),
vite build green, browser lap at desktop AND a genuine 390px viewport via the
same-origin iframe technique this repo standardised at v35.

---

## Per item

| # | Item | Outcome |
|---|---|---|
| M0a | resize handle "gone or dead" on WAL | **FIXED** — and the drag was never dead |
| M0b | PUV strip overlaps the video | **FIXED** — plus the frame that made it necessary |
| M0c | *(found)* the F3 fit was lying about fitting | **FIXED** |
| M1 | kill the card pagers | **DONE** — robots; WAL had none, measured |
| M2 | first-visit reset | **DONE** |
| M3 | Information Booth rebuilt | **DONE** — 11 questions written |
| M4 | logo outline | **NOT CHANGED** — evidence + a separate real finding |
| M5 | W.B Music album art cropped | **FIXED** |
| M6 | WAL FAQ button too loud | **FIXED** |
| M7 | gift shop | **DONE** — both halves |
| M8 | directory names | **DONE** |
| M9 | tap feedback on iPhone | **FIXED** |
| M10 | the watermark | **CANNOT REPRODUCE** — needs Mike |
| M11 | burn down the copy | **FIRST PASS** — house voice done, artist documentation deliberately not |
| M12 | the optometrist | **DELIVERED** — 5 renders + notes |
| — | identity / personality map / no-hidden-information law | **RECORDED** in STATE.md |

---

## M0 — the two live defects, both misdiagnosed by their symptoms

**(a) Neither handle is dead.** Driven by synthetic pointer events on /wal at
1440×780: the split drag moved the columns 363→559; the carousel drag moved
160→240 with the viewer trading 439→359. P1 and F3 built them correctly and they
work. What is wrong is that **neither has a visible affordance**, which is why
Mike could not tell "gone or dead". Measured, in the manner of the earlier
`.cf-year` finding:

| | colour on ground | contrast |
|---|---|---|
| `.cf-dh-line` | `#c6c2b7` on `#d9d5ca` | **1.21:1** |
| `.cf-dh-dot` | `#a9a59a` on `#d9d5ca` | **1.68:1** |
| `.vr-dh-line` | — | **1px wide × ZERO pixels tall** |

The last one is the real answer and it is a plain CSS accident: the line is an
`align-items:stretch` flex item that also declares `margin:auto`, and auto
margins beat stretch, so it shrink-wrapped its empty content. **The split handle
has drawn nothing, on every wing, since it was written.** Fixed with a grip —
three dots from one node via `box-shadow`, ink ramp at 5.15:1 — with no DOM
change, so nothing that hit-tests these strips needs re-verifying.

**(b) Not a z-overlap, and I looked for one.** At six desktop sizes from
1280×660 to 1920×1080, and on /hr: `.vp-area`'s bottom edge and `.fs-wrap`'s top
edge are **the same number**, gap 0, every time. On paper wings that reads as a
seam; on the WAL stage it does not, because W6's charcoal, YouTube's own black
and the strip's ground are one continuous field — so the quote reads as a caption
burned into the bottom of the video, which is Mike's sentence exactly.

Fixed at the shared rule (12px of air) plus an **edge on the picture**. The ring
forced a second finding: F3's cap makes the *area* a letterbox **slot** — 1046×331
at 1440×780, 928×211 at 1280×660 — with ~230px of YouTube black down each side,
so a ring on the slot would have framed the bars. The inner box is now fitted to
the **picture**: same height, 16:9, centred, stage showing through. The picture
does not change size by one pixel; its edges are now our box's edges.

**(c) Found in diagnosis: the fit was lying.** F3 promises "tracklist, viewer and
scroller all fit on one screen" and measured the live `.fs-wrap` to size it — but
the fit fires on entry, entry lands on album 0, a face is stowed there, and P4
renders no scroller under a stowed face. **The measurement was always 0.**
Document ran 42–70px longer than the window at every desktop size tested. A live
measurement is wrong even when the element exists, because the strip breathes
with the fact showing in it (48px one line, 77px two, cycling every 7.5s). The
fit now reserves the strip's **ceiling** from `--fs-strip-reserve`, declared in
CSS beside the six rules it sums. After: **0px overflow at all six sizes.**

**Costed and named for Mike:** honesty has a price here. At 1280×660 the picture
is now 372×209 where it was 567×319, because 120px of the window went to the
strip's reserved room. That is F3's own ruling being kept rather than claimed.
Two levers exist if he wants the pixels back and neither is Ops': the 64px of
trailing `padding-bottom` on `.ex-root` (a bar-clearance on a wing that has no
bar), and `CF_MIN = 160`.

## M1 — one pager in the whole building

Every button on /wal and /robots was enumerated, on every album and every face.
`.stg-step` appears on **/robots and nowhere else** — WAL retired its pager at W7
and its tracklist rows are a table of contents, not a pager (each says what is
behind it, which is the thing "Next ›" can never do). So the law has one target.

/robots swaps `stage:true` for `faceFlow:"flat"` — W7's mechanism, shipped and
proven on WAL. Verified face by face, both albums, desktop and 390px: **nine
faces, zero clipped pixels, zero horizontal scroll, zero pagers**, console clean
with no `[stage]` overrun warnings (which is itself the gate — the packer used to
say those out loud on every phone load).

L5's sheet-on-mat was re-scoped `[data-stage="1"]` → `[data-exhibit="robots"]`
so the wing keeps its sheet: the sheet describes a **document wing**, never
pagination. `Stage` stays in-tree, mounted by nothing, with the reason on it.

## M3 — the booth

Eleven questions written in the front page's register. The privacy answer was
written **against `src/worker.js`**, not from goodwill: the `visits` table stores
page, referrer and a timestamp and nothing else, so "no accounts, no profiles,
nothing that follows you anywhere" is a statement about the code.

Also: **P5's marker law had left the one file that could enforce it.** "Hide all
[PAPA] markers site-wide" was enforced by a private const inside `Exhibit.jsx`.
The booth is not an exhibit — the first marker written into its copy would have
printed. `visitorProse`/`kept`/`PAPA_MARK` now live in `src/lib/visitor-prose.js`.

Typography: four causes, each measured — hand-placed `<br />` tags, a 592px
measure of Fredoka, one face doing three jobs, and centred paragraphs. Also
`justify-content:center` is gone from the room: it centres a *short* card, and a
page of questions is taller than the window, so centring pushed the heading a
visitor arrives for off the top of the screen.

## M4 — the logo, and why it was not changed

Verified about `public/WeirdBaby_PhotoID.png`: 2048², RGBA, a real alpha knockout
(counters transparent), outline a black stroke that **survives the 5.95×
browser downscale intact** (darkest pixel still 0 after resampling). Pixel
classification at two ink thresholds (`v<90` and `v<160`) shows the stroke
**continuous around every glyph** — renders in the deliverable folder.

Where the outline *reads* as missing is where a letter crosses the black ring
behind it, and a black stroke on a black ring is invisible whether or not it is
there. That is a source-artwork decision — a light halo outside the black stroke,
or moving the wordmark clear of the ring — and **there is no layered source in
this repository** to make it from.

**Separate real finding: `public/WeirdBaby_PhotoID_backup.png` is CORRUPT.**
libspng cannot decode it (`pngload: libspng read error`). The only in-repo
fallback copy of the logo is unreadable.

## M5 — two percentages of two different things

`width:min(88%,340px)` resolves its 88% against the viewer's **width**;
`height:min(88%,340px)` against its **height**. The box is square only by luck,
on windows tall enough that both land on the 340px cap.

| window | box | lost |
|---|---|---|
| 1440×780 | 340 × 340 | — *(why it was never caught)* |
| 1440×620 | 340 × 230 | 110px |
| 1200×560 | 340 × 203 | 137px |
| 390×844 | 313 × 175 | 138px |

Same pattern in three places (art, placeholder, idle thumb) = one defect, fixed
once. Verified square at five sizes.

## M9 — `:active` is not a promise on a touchscreen

F6's rules are correct CSS that mostly never runs, for two compounding reasons:
mobile Safari withholds `:active` from an `<li>` carrying no listener of its own
(React's are all at the root), and where it does grant it, it grants it after the
scroll-or-tap decision and takes it back when the finger lifts ~60ms later. A
delegated `pointerdown` on `.ex-root` now marks what is under the finger and
holds it for a floor of **160ms**. `pointercancel` is handled as carefully as
`pointerup` — it is what fires when the tap turns out to be a scroll, and without
it a flicked list leaves a lit row behind.

## M10 — could not reproduce, and what was ruled out

No element in the museum answers to "the watermark" as described. Ruled out by
measurement, on all seven routes: every `position:fixed`/`sticky` element
enumerated and re-measured after scrolling — **nothing moves** (`wb-bar`,
`ex-banner-console`, `pb`); all four film-grain washes are `position:fixed;
inset:0` on a pseudo-element with no transformed ancestor, so they are
viewport-anchored and cannot re-attach; the lobby's `.wb-footer` holds its corner
at 390×844 and 1200×560, before and after scrolling.

**Needs from Mike:** which room, and a screenshot. One sentence will do it.

**Found while looking, unrelated and real:** at ≤680px the lobby sets
`height:100%` + `overflow:auto` on *both* `html` and `body`, which makes **body**
the scroll port — `documentElement.scrollHeight` reports 844 while
`body.scrollHeight` reports 1063. Anything calling `window.scrollTo` on the lobby
is a no-op. M2's reset works around it by resetting all three candidate ports;
the underlying pattern is still worth straightening.

## M11 — what was rewritten and what was not

**Rewritten:** the robots front desk entire (Welcome, FAQ, Contact) plus the lead
paragraphs of THE PLATES and THE RECORD; the WAL house album's two pages.
Rule held throughout: **not one new fact.** Every claim already existed in the
file. Every `[PAPA]` marker is exactly where it was.

**Not rewritten, deliberately:** the per-artist material in `worth-a-listen.js`
(tombstones, song cards, quote decks, trail scents) and the machine album's
deeper faces (The Manual, The Firmware, The Portal, that album's six FAQ entries,
the ten Record entries). The artist material is **documentation of other people,
sourced line by line**, and rewriting sourced facts for register is how invented
provenance gets into a museum. It wants its own pass with the sources open.

---

## Open for Mike

1. **M10** — which room is the watermark in? (above)
2. **M0c's price** — the fit is honest now and the picture is smaller on short
   windows. Two levers named above; both are UX calls.
3. **M4** — the layered logo source, or a marked-up screenshot. And the corrupt
   backup PNG.
4. **M12** — five renders to flip between; `docs/optometrist-20260803/README.md`
   has what each one tests and what I noticed. Nothing committed to.
5. **The room bar still says "ROBOTS"** while the directory now says
   "Weird.Baby Robots" (M8 named the directory only). One word if he wants them
   to match.
6. **/hr's own fit** — at 1440×780 the /hr viewer is 894×195 against a 145px
   scroller. L1 named this and left it as a UX call about the carousel yielding
   height; it is still open and it is the worst frame in the building.
