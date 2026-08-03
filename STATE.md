<!-- ============================================================= -->
<!-- LIVE LEDGER — source of truth. Read this block first.          -->
<!-- Last updated: 2026-07-06. Below this block: durable reference. -->
<!-- ============================================================= -->

# Weird.Baby Museum — LIVE LEDGER

## Ops Rule 0 — THE GROUND CHECK (read before acting)

Before ANY state-changing action — writing a build brief, editing a file, declaring something "done", or any tool call that does more than read — STATE THIS:

> "Ground check: what fact am I acting on, and did I verify it THIS session?"

If the answer is "I remember" / "the log says" / "Cowork reported" / "the doc says" — **STOP. That is the off-ramp forming.** Verify against the live tree first.

Either party may say **"Follow the process"** at any time. It means: halt, verify against the live tree (live tree > git > docs > chat), THEN proceed.

Paid for by the 2026-06-17 derived-era incident: charging into the problem in front of us — building before verifying, trusting a build log over the live disk — produced a corrupted client build and a near-miss. This class of error has cost full weeks before. The trip-wire exists so the stop is an EVENT, not a hope.

Ops work takes top priority, based on the Ops need in the moment.

## SEALED 2026-08-03 — THE RHYTHM ROUND (v38; R0–R6. PUSH + DEPLOY ARE MIKE'S)

Autonomous single-agent Code-lane round on Mike's remote-control brief. Full
round log: `docs/MUSEUM_RHYTHM_LOG-20260803.md`. Before/after frames:
`docs/rhythm-20260803/`.

- **R0 V2 IS THE EXHIBIT GROUND.** Mike picked optometrist variation 2; it
  existed only as an injected screenshot, so it is now a real rule at the WAL
  stage re-pin. Measured: body ink **14.18:1 → 10.44:1** — one stop of glare
  gone, every step still clearing its job (quiet ink 6.11:1 AAA, mutest 4.83:1
  AA). `--wb-gold-mute` is lifted PAST a flat translation on purpose: the literal
  one (`#a49a83`) measures **4.19:1**, under AA for the register's small mono, so
  a palette lift would have cost legibility at the bottom while fixing it at the
  top. M0b's ring keeps its number (2.82 → **2.83:1**). **Scope verified live,
  not assumed:** `/robots` reports `--wb-ink:#ece9e0` — the paper ramp. It is a
  paper wing and shares no part of this.
- **R1 "HUMANLY SOUP" WAS ONE MISSING DECLARATION.** `.vp-flat` — the flat
  wing's top-level container, holding fifteen blocks of different kinds — was a
  PLAIN BLOCK while every other container on a face is a flex column with a gap.
  Measured distance from the last line of a biography to the first row of the
  register: **0px**. A four-step ladder derived from `--face-fs`
  (tight .55x / block 1.0x / **section 2.6x** / end 3.8x) replaces it; the ratios
  are the point, because 1 : 2.6 : 3.8 is legible AS a ratio and a flat 12px is
  legible as nothing. THE RULES CAME OFF to pay for it — the deck's full-width
  hairline, the register block's and the log sheet's — which is Mike's "not more
  rules and lines" applied by subtraction. Section heads were dressed as
  footnotes (`--fs-micro` mono at `--wb-gold-lo`, identical to a caption) and are
  now Syne 800 at `--fs-small`, full ink. **Found while measuring: the biggest
  hole on the page was in the HEAD** — `.vp-face-head` 216px, its text column
  60px, **156px of nothing** between the artist's name and the first sentence
  about her, left behind when L5 correctly moved the lead out of F1's two-column
  composition for the stage packer. The flat wing has no packer, so the plate
  floats and the words set beside it. Document +26% longer; that is the
  breathing room and it is the trade.
- **R2 IT WAS NEVER THE SIZE.** Measured before: the label already ran at
  **19.6px** — `--face-fs` at its ceiling — so the only dial P7 left raises the
  headline and the register too, the move P7 itself rules out. Four faults, all
  properties of the FACE and the LINE: DM Serif Display is a Didone-class
  DISPLAY serif (thins sub-pixel at reading size, counters closed); `ch` is the
  advance of ZERO and under-reports this line by a quarter, so 62ch was running
  ~80 characters; 1.5 leading is a sans number; light-on-dark blooms shut its own
  word spaces. Now `--wb-read` = **Fraunces** — already in the one font `<link>`,
  already loaded, already MIKE'S OWN PICK (v28_3, HR deck), and the only face in
  the bundle with an **optical-size axis**, which is the difference between a
  face that has been shrunk and one drawn to be small. 56ch = **67 characters,
  counted** (range rects), one off Bringhurst's 66. `--wb-serif` untouched.
- **R3 BOTH HALVES, AND (a) IS NOT THE SAME BUG AS M0a.** M0a's grip is
  `top:50%` OF THE HANDLE, and on a flat wing the handle is the document: at
  1456×900 the grip sits at viewport y=**1782** in an 811px window — **971px
  below the fold** — leaving a 1px line at **1.99:1** as the only visible
  affordance, the very number M0a measured and accepted on the assumption the
  grip was on screen. The grip is STICKY now, at mid-viewport, reachable at every
  scroll position; no DOM change, drag invariant preserved. (b) `.ex-left` was
  **433 × 2864px holding 133px of content — 95.4% empty paper** — because W7 made
  the grid row the document's height and the column stretched into it by default.
  `align-self:start` + sticky + a `max-height`/`overflow` BOUND; stands down at
  720px, the frame's own one-column threshold read off that rule.
- **R4 ALIGNED, AND IT IS NOT CLOSE.** Every row was its own grid, so the value
  column started at **x=597, 605, 561** on three consecutive rows and at five
  different positions on Carsie's seven-row card. Now **665, seven times**
  (`subgrid`, `max-content`, survives `data-stage-split` cloning). Judged at the
  real measure as asked: aligned wins because a ragged key column moves the eye's
  return point every line, turning one downward glance into seven searches.
- **R5a "WELCOME"**, not "Welcome to the Listening Room": the room's name is
  already printed TWICE on that page (title bar + subtitle), so the longer form
  invents a THIRD name for one room in the sentence whose job is to stop a
  stranger being confused. Written to the three-masters doctrine as ONE descent
  through the face's existing blocks — blurb=seconds, ¶1 what is here, ¶2 the
  standard, ¶3 what we are not, ¶4 the why, tombstone=the checkable version — no
  announced tiers. **No collapse, as a ruling:** 280 words; a control would hide
  the depth the doctrine asks for and save one flick. Every fact is checkable in
  this repo (the privacy line is a statement about `worker.js`'s `visits` table).
  M6's booth pointer moved here, following its own stated reason.
- **R5b THE BILL.** "Its place in the museum" is dead — it was the museum
  explaining its filing system to someone who came to hear music. Replaced by the
  poster: the standard, then a 2×2 block of acts in the artists' own colour, then
  the small print. **The names are DOORS** (`selectAlbum`), which is the one
  thing a printed bill cannot be. Two-up EXPLICITLY — `auto-fit` dealt four and
  broke every name over two lines, which is P10's lesson in this same wing.
  Acts are read off `ARTISTS` by a builder that throws on an unknown id, so
  **not one new fact about any artist enters here**. A sixth ramp step
  (`--fs-display`, 1.56×) was added the way P7 says to add one.
- **R6 THE RECORD BOARD**, between the register and the shelf because that is the
  order a fan reads in: who, what they have done, where to get it. Jesse 7 rows
  (three US AAA peaks, four Grammy nominations, the Americana award, Farm Aid,
  the label), Mikey 5 (**the Canon sync — Mike's own named model**, Rubin,
  *Unapologetic*, Universal, the London sell-out), Carsie 5, **Hunter Root 0 and
  it says why**. Nothing invented: every row was already sourced in the file;
  rows with a readable page keep it as a door, rows without stay plain type per
  P20. Kimmel and Colbert DROPPED — real, undated in this repo, and a board with
  a year column does not estimate. Three sideboxes moved rather than copied, so
  nothing is duplicated. **NO LIVE COUNTS.** The weekly-refresh candidates are
  named in the log: **37 baked `feed[].v` view counts** (the upload LIST is the
  half that actually rots), one tombstone row on Jesse's "There's A Hole", and an
  explicit warning that a chart PEAK is durable and must never be rewritten into
  a current position.
- Gates: **lint 11 err / 9 warn** (= HEAD baseline, zero new), vite build green,
  desktop 1456×900 + genuine 390px iframe lap. 390px: zero page-level horizontal
  scroll, poster/register/board all stack, plate unfloats, tracklist stands down.
  The lap harness `public/_lap.html` was created and removed before seal.

## SEALED 2026-08-03 — THE MORNING RIP (v37; M0–M12. PUSH + DEPLOY ARE MIKE'S)

Autonomous single-agent Code-lane round on Mike's remote-control brief, sealed in
seven parts. Full round log: `docs/MUSEUM_MORNING_RIP_LOG-20260803.md`. The
optometrist deliverable: `docs/optometrist-20260803/` (5 renders + notes).

- **M0 THE TWO LIVE DEFECTS, BOTH MISDIAGNOSED BY THEIR SYMPTOMS.** (a) Neither
  handle is dead — driven by synthetic pointer events the split drag moves the
  columns 363→559 and the carousel drag 160→240 with the viewer trading 439→359.
  Neither has a visible AFFORDANCE: `.cf-dh-line` 1.21:1, `.cf-dh-dot` 1.68:1,
  and **`.vr-dh-line` is 1px wide by ZERO PIXELS TALL** — an `align-items:stretch`
  item that also says `margin:auto`, and auto margins beat stretch, so the split
  handle has drawn nothing on every wing since it was written. (b) The strip is
  not z-overlapping: at six desktop sizes and on /hr, `.vp-area`'s bottom and
  `.fs-wrap`'s top are THE SAME NUMBER. On the charcoal stage the strip's ground,
  the frame's black and YouTube's letterbox are one field, so the quote reads as
  a caption burned into the video. Fixed with air + an edge — and the edge forced
  the picture to be fitted to the FRAME rather than to F3's letterbox slot.
  (c) **Found in diagnosis: the fit was lying about fitting.** F3 measured the
  live `.fs-wrap`, and on entry a face is stowed and P4 renders no scroller — so
  the measurement was ALWAYS 0 and the document ran 42–70px past the window at
  every desktop size. The fit now reserves the strip's ceiling from a CSS-declared
  `--fs-strip-reserve`; 0px overflow at all six sizes. **Price named for Mike:**
  the picture is smaller on short windows now (372×209 at 1280×660). Two levers
  to get it back are named in the log; both are UX calls.
- **M1 ONE PAGER IN THE WHOLE BUILDING.** Every button on /wal and /robots
  enumerated: `.stg-step` is on /robots and nowhere else. /robots swaps
  `stage:true` for `faceFlow:"flat"` (W7's mechanism, proven on WAL). Nine faces,
  both albums, desktop and 390px: zero clipped px, zero pagers, no `[stage]`
  warnings. L5's sheet-on-mat re-scoped to the WING so it survived.
- **M2** first-visit reset (`src/lib/use-arrival.js`): ONCE per room per session,
  ALWAYS for the lobby. Presets untouched BY CONSTRUCTION (the hook moves scroll
  only). Found: `window.scrollTo` is a **no-op on the lobby** — html and body both
  `height:100%; overflow:auto` makes BODY the scroll port.
- **M3 THE FAQ IS THE PAGE** — both buttons gone, eleven questions written in the
  front page's register, privacy answer written against `worker.js` rather than
  from goodwill. **P5's marker law had left the one file that could enforce it**:
  `visitorProse` was private to `Exhibit.jsx`, so the booth's first [PAPA] would
  have printed. Now `src/lib/visitor-prose.js`. Typography rebuilt on four
  measured causes.
- **M4 NOT CHANGED, WITH EVIDENCE.** The outline is continuous around every glyph
  (pixel classification at two thresholds, renders in the deliverable) and
  survives the 5.95× downscale intact. Where it READS as missing is where a
  letter crosses the black ring — a source-artwork call, and there is no layered
  source in the repo. **`public/WeirdBaby_PhotoID_backup.png` is CORRUPT** —
  libspng cannot decode it.
- **M5** the square cover was drawn in a rectangle (two percentages of two
  different bases): **137px of it gone at 1200×560, 138px on the phone**. **M6**
  the booth door goes from an 82px marquee to a 25px sentence (`quiet` on the
  existing trail seam). **M7** the WAL set is alphabetical always; "Six little
  blues from Papa." advertised six SONGS in a room that sells a STICKER and is
  gone. **M8** the directory names the exhibits properly.
- **M9** `:active` is not a promise on a touchscreen — Safari withholds it from an
  `<li>` with no listener of its own, and grants it too late and drops it too
  early. A delegated `pointerdown` holds a `data-pressed` mark for 160ms.
- **M10 COULD NOT REPRODUCE.** Every fixed/sticky element on all seven routes
  re-measured after scrolling: nothing moves. All four grain washes are
  viewport-anchored with no transformed ancestor. **Needs one sentence from Mike:
  which room.**
- **M11 FIRST PASS.** Robots front desk entire + two lead paragraphs; WAL house
  album's two pages. **Not one new fact** — register only. The per-artist
  documentation is deliberately NOT rewritten: it is sourced line by line, and
  rewriting sourced facts for register is how invented provenance gets into a
  museum. Wants its own pass with the sources open.
- Gates, every seal: **lint 11 err / 9 warn** (= HEAD baseline, zero new), vite
  build green, desktop + genuine 390px lap. Final lap: all seven rooms open at
  y=0, zero page-level horizontal scroll, zero [PAPA] anywhere, zero pagers.

## THE IDENTITY (Mike, 2026-08-03 — standing, outranks every prior naming pass)

**It is THE MUSEUM.** No singer-songwriter qualifier, no solo-artist
qualifier, nothing narrowing — all-encompassing.

F7c had rendered four candidates behind `/?subtitle=2..4` and asked Mike to
pick; he picked none of them, because all four named a CLASS OF ARTIST and
every one of them was a fence. The building already holds a machine wing and a
wing of other people's records — "a singer-songwriter museum" was untrue the
day the robots opened and would have to be re-argued at every new wing. A name
that has to shrink to stay accurate is the wrong name.

BUILT (M-ID): the lobby subtitle reads **"The Museum"**. The candidate array
and the `?subtitle=` preview are retired with it — a shown-then-asked device
that outlives the asking is four dead strings plus a live URL that still
renders a retired identity.

## THE PERSONALITY MAP (Mike, 2026-08-03 — standing, governs voice everywhere)

Each surface has its own register. Copy, imagery and tone answer to the room
they are standing in, not to a single house voice.

| Surface | Register |
|---|---|
| **FRONT PAGE** (`/`) | Short, concise. Don't scare anyone. Heavily philanthropic. |
| **ROBOTS** (`/robots`) | Liberal, artistic, creative, sci-fi. |
| **W.B MUSIC** (`/wb`) | Joyous celebration · complete silliness · political unrest. |
| **WAL** (`/wal`) | The ARTISTS shine. W.B does not overshadow. W.B is a listener in the room with everyone else — it just happens to be W.B's room. |
| **GIFT SHOPS** (`/shop`) | Trustworthy places to do business; the return to normalcy of the real world. |

Consistent with THE SPOTLIGHT DOCTRINE (below) for WAL, and it extends the same
logic to every other room: the frame takes the register of what it frames.

## THE NO-HIDDEN-INFORMATION LAW (Mike, 2026-08-03 — standing, site-wide)

**Everything visible at once, always.**

Card-advance and next-buttons are a sneaky way of adding pages. People will not
flick to discover whether something is interesting — a visitor who has to
operate a control before they can find out what is behind it mostly does not,
so paged content is hidden content wearing a button.

- **Links exist to take a visitor somewhere BIGGER, not to turn a page.**
- **The one exception is slideshows** (a reel is a reel; it declares itself).
- The original vision holds: **one page per exhibit, offsite links only,
  artifacts below the line.**

This SUPERSEDES the staged pager wherever the pager turns pages on the visitor
(`faceFlow` staged wings — robots; and any surviving card-advance on WAL). The
Stage's no-scroll law survives only in W7's reading: no inner scroll traps; the
DOCUMENT is the one thing that scrolls, which is ordinary reading.

## THE RELEASE DOCTRINES (Mike, 2026-08-02 — standing, govern what we build toward)

Three rulings about SHAPE OF RELEASE rather than shape of a page. They govern
what the museum is filled with and when, and they outrank a nice idea that does
not serve them.

**D-BINGE — launch with multiple weeks already in the Record. Design for the
binge-watcher.** A visitor who arrives on day one should find a body of work to
fall into, not a pilot and a promise. The consequence for BUILD is that every
container must read well at volume and must PAGE, not scroll and not truncate:
a Record of ten entries and a Record of four hundred are the same component, and
the one that breaks at four hundred is not finished. (This round's B5/B9 work is
directly downstream — the stage now pages a wall at any width, and the Record's
model takes evidence classes so there is more than paragraphs to binge.)

**D-EPISODE — the weekly rhythm.** Teasers, "on last week's episode", and shorts
during the week; then WHAM, a FULL EPISODE — not an "update". Across all
storyfronts at once: many plates spinning, most wobbling, are they adding more,
oh no — that was a close one. The register is serial television, not a changelog.
The consequence for BUILD: an episode needs a slot that can carry a WEEK
(something dated, something that accumulates, something a visitor can walk back
through) — which is what the Record is, and why it is the wing's spine rather
than one of its pages.

**D-WEEKLY-EVERYWHERE — new content surfaces WEEKLY across the entire W.B
domain, and information stays current. Handled by AUTOMATION, not humans.**
Recorded this round as doctrine; nothing is built for it yet. What automation
would need, noted while the ground is fresh so the next round is not scoping
from memory:

- **A source of truth per storyfront that is not a JSX file.** HR already has
  one (MediaVault → `npm run export-artifacts` → `hunter_root.json`). WAL and
  robots are hand-authored JS — an automation cannot write to them safely. Any
  weekly pipeline starts by giving those two wings a data file it can own.
- **A dated spine.** "What is new this week" is unanswerable without a date on
  every artifact. MV artifacts have one; WAL/robots faces mostly do not. The
  Record's `stamp` is a display string, not a date — it would need a real one.
- **An idempotent publish step.** The existing release flow is 4 manual steps
  and step 2 is the one always missed (see Release flow, below). Automation means
  that flow runs itself and PROVES it ran — the before/after artifact count rule
  already exists precisely because a silent shrink is invisible in a diff.
- **A currency check, not just a publish.** "Information stays current" is the
  harder half: something must notice a dead link, a delisted video, a stale
  "what they are up to". That is a crawler over the trail/door URLs the wings
  already declare, reporting rather than editing.
- **The blocker to name honestly:** MV runs on Mike's laptop and the sandbox
  cannot reach it (OPERATIONS §8 / CLAUDE.md quirk 11). Weekly automation that
  depends on MV needs MV reachable on a schedule, or an export that lives
  somewhere a scheduler can read. That is a hosting decision, not a code one, and
  it is the first real question of this workstream.

## SEALED 2026-08-02 — THE LONG HAUL (v36; L1–L6. DEPLOY IS MIKE'S)

Autonomous single-agent Code-lane round on Mike's long-haul brief, sealed and
pushed in five parts. Full round log: `docs/MUSEUM_LONG_HAUL_LOG-20260802.md`.
Content-shape note for Mike: `docs/RECORD_CONTENT_SHAPES.md`.

- **L1 THE PUV SCROLLER — one defect, its third appearance, in the frame nobody
  revisited.** `.fs-wrap{flex:1}` gave the scroller an EQUAL share of the right
  column; R-c fixed that for the staged wing and F4/P2 for the flat wing, each
  scoped to the wing in front of it, and the museum's primary exhibit — neither
  staged nor flat — kept the original. Worse than equal: E5's 76px bar padding
  was added INSIDE the flex item, so the scroller ran 86px LARGER than the
  picture. Measured: /hr **670×133 viewer against a 218px scroller** (a 5:1
  letterbox); at 390px **340×79**; and **/wb at 390px a TWENTY-FIVE-PIXEL-tall
  video player**, the same collapse with no scroller to blame. E5's padding was
  written on a false premise (`.fs-wrap` is `overflow:hidden` and does not
  scroll) and never cleared the bar anyway (129px under at a 700px window; 71px
  ABOVE at 900). Fixed: the scroller is a strip sized in LINES of the fact type —
  three on desktop, measured against all 97 vault facts at this column's width;
  two would fade the last line off 14% of them — and at stacked widths the viewer
  is a ratio box again by M-a's own test. After: /hr 670×222, and /hr and /wb at
  390px **both exactly 16:9**. /wal and /robots byte-identical.
- **L2 THE RULINGS** — recorded above; J1 and J3 built (30 gold sites retired,
  the WAL-set fallback named in code and in the DOM).
- **L3 THE TOKEN CONFORMANCE ROUND — 96 substitutions, exactly R1's count**, and
  pixel-identity proved STATICALLY: every `var(--wb-*)` written was substituted
  back to its token's literal and diffed against HEAD. `tools/token-audit.mjs`
  (new) parses the palette out of its own file and re-runs on demand. Three
  things the sweep was not looking for: **the token file had a typo that made its
  own audit lie** (`--wb-ink-soft: #e2deD3`); **the palette was being re-typed one
  level down** to escape the player bar's dark re-pin (now `--wb-paper-*`
  aliases); **the museum's dark scope lived inside one selector** so the second
  room that wanted it had to copy seven values (now `--wb-booth-*`). Full
  decision list — every value with what it is and what it should become — in the
  round log, including 27 in `WbAdmin` (J4, Mike's) and 163 hand-typed font
  stacks (not byte-identical, so not taken).
- **L4 THE REVIEW'S REMAINING FINDINGS — R2, R3, R4, R5 and R6 all done.** One
  `<MuseumBar>` replaces three title-bar families, and the merge exposed a live
  defect the third copy was hiding: **32px of "HUNTER ROOT" printed on top of
  "GIFT SHOP" at 390px**, now zero overlap on all six rooms. One `useOverlay`
  hook replaces six Escape handlers and five scroll locks — and found that
  `FilterInstrumentOverlay` was the one of six that never locked, and that none
  of the eight restored focus. Six font `@import`s (already drifted: Syne at two
  different weight lists) become one `<link>`. Three inline `<style>` template
  literals become real `.css` files, with their mount-scoped `html, body` rules
  preserved as `html[data-room="…"]`. `src/App.css` was 180 lines of Vite starter
  imported by nothing — deleted. Five judgment items listed, chief among them
  that **the wordmark points to two different rooms**.
- **L5 THE ROBOTS WING, SECOND PASS — not one word of content written.** The
  voids, measured: **48% of the sheet blank** (a two-column page printed on one
  side), **76% of the contents column blank**, and a "sheet" four units of
  luminance from its own column. Now: a single column is SET as one and centred;
  the contents column prints the album's own poster (a photograph that, on a
  staged wing, **nobody could ever reach**); and the page is a real print on a
  mat. B4's photo law is finally written the way B4 said it wanted — the tenth
  surface escaped it within four hours, exactly as B4 predicted. **The lead is
  its own block**, which the stage had been asking for in the console on every
  phone load (`block 0 is 244px and a column holds 202px`) while The Firmware
  lost 83px and The Manual 39px off page 1. Both additions stand down below
  720px, measured (206px clipped with them, 0 without).
- **L6 BINGE PREP — the model, the surfaces, and the note.**
  `src/lib/record-model.js` (29/29 assertions) owns the date, the bands, the
  payload manifest and the document state. **Every entry now carries a real
  `date`** — the thing D-WEEKLY-EVERYWHERE named as missing — transcribed from
  the stamps already printed. The third class Mike named is built: a **document**
  is provenance FIRST, then a scan and/or an extract, because those three arrive
  at different times; the card states `imaged` / `quoted` / `held`, and `held` is
  the honest half. The index bands by month and carries a payload manifest per
  row. **Proved at 400 entries and reverted: 33 pages desktop / 242 phone, 0px
  clipped anywhere**; the proof also found that an opened record was ONE
  indivisible block and clipped 32px once it carried real evidence — now a run of
  blocks. The shipping Record is unchanged for a visitor: every new surface is in
  the code and absent from the page until content arrives.
- Gates, every seal: **lint 11 err / 9 warn** (= HEAD baseline, zero new), vite
  build green, console clean, and a browser lap at desktop AND a genuine 390px
  viewport. **Harness note banked:** a framed document will not scroll until
  `overflow-x:clip` is swapped for `hidden` — without that the narrow lap can
  only ever see the first screen.

## THE PALETTE + SET RULINGS (Mike, 2026-08-02 — standing; answers B7's J1/J2/J3)

Three rulings closing the judgment calls the adversarial review listed rather
than guessed at (`docs/TEMPLATE_ADVERSARIAL_REVIEW.md` §3). J1 and J3 are BUILT
(THE LONG HAUL, v36); J2 is a ruling only, by Mike's own instruction.

**J1 — THE RETIRED 2025 GOLD IS RETIRED EVERYWHERE.** `#b8974a` is the pre-2026
gold-on-dark accent; the museum's `--wb-gold` has been photo black since the B&W
rework. It survived by inertia on thirty sites, **the player bar's play, volume
and CC buttons included** — the most-used control in the building. Mike's answer
to the review's "(a) leftover or (b) deliberate surviving accent" is (a):
**it goes, the player bar included, and every site conforms to the current
palette.** Built: all live sites now read the ramp (`var(--wb-gold*)`), which in
inline styles and in the bar's re-pinned dark scope resolves against whatever
ground the element stands on — no second palette is created. NOT touched and
listed for Mike: the other five variant-type colours (green/purple/blue/two
browns), which are a whole pre-2026 vocabulary already standing on his backlog.

**J2 — THE B&W LAW AND THE LIVE TWIN: no practical difference, and the twin is
already black and white.** No build, ruling recorded. The wing's law governs
PHOTOGRAPHS; the Portal's twin is the machine's own running screen (an iframe of
a separate application), and it is monochrome as it stands. Grayscaling it would
mean reaching into another application to change nothing a visitor can see.

**J3 — THE WAL SHOP PRESENCE IS THE SET OF FOUR, ALWAYS.** They are a set and
are sized as a set. **A WAL exit that resolves no individual owner shows the WAL
four with no W.B — THE SET IS THE FALLBACK.** This closes clause 6 of the billing
law below: the empty top slot on `?from=wal` with no (or an unresolvable)
`&owner=` is not an omission, it is the answer. Billing the house there would
break Clause 3, which is the original defect Mike reported. Built as a NAMED
branch (`walSetFallback` in `GiftShop.billing()`) and said out loud in the DOM
(`data-billing="wal-set"`), so it cannot be deleted by the next change to the
markup. All seven exit cases re-verified.

## THE SPOTLIGHT DOCTRINE (Mike, 2026-08-02 — standing, governs WAL and any celebration wing)

The museum is THE FRAME — it neither detracts nor distracts; done right it
enables the art to reach full potential. THE ARTISTS BRING THE COLOR — their
photos, videos and thumbnails ARE the color. WAL is NOT held to the robots
wing's technical voice; it is a colorful celebration. Set the stage, drop the
house lights, cue the music, spotlight — the only place to look. Cecil B.
energy. (The B&W site law does NOT apply to WAL — W8.)

## THE GIFT SHOP BILLING LAW (Mike, 2026-08-02 — standing, recorded on his order)

Governs who appears on `/shop` and in what order, on every exit and every
arrival. Implemented in `src/routes/shop/GiftShop.jsx` (`billing()`), driven by
`?from=<wing>` plus `&owner=<album-id>` where a wing's albums are artists.

1. **The exhibit's OWNER gets top billing on exit.** For a one-artist wing that
   is the wing (`/hr` → Hunter Root); for WAL it is the ARTIST whose album the
   visitor left, which is why the exit now carries `owner=`.
2. **Everyone else lists beneath by DATE STARTED WITH US, earliest first.**
   The dates live on the artist data (`since:`) and are read off this
   repository's own record — HR 2026-04-05 (first MV accession), W.B
   2026-07-06 (the house exhibit opened), the WAL trio 2026-07-30 (the wing's
   build). Ties break alphabetically.
3. **WEIRD.BABY IS LISTED ONLY WHEN THE EXHIBIT WAS WEIRD.BABY'S OWN**
   (`/wb`, `/robots`) — otherwise W.B does not appear at all. This is the
   clause Mike reported broken ("WAL is putting W.B on the gift shop page").
4. **Direct arrival at `/shop` — THE HOUSE TAKES TOP BILLING AND ALL ARE
   SHOWN.** [MIKE RULED 2026-08-02, B1.] P11 stated an Ops reading here —
   nobody billed, house merely listed — and invited an overrule; this is it.
   A direct arrival is not an absence of an owner, it is the HOUSE'S OWN ROOM,
   so Weird.Baby takes the top slot the way any wing's owner does on exit and
   the roster beneath is everybody. Applies to every no-exhibit-exit case.
5. **The view resets before every entry** [B1] — no stale billing, and no
   stale SIGHT of it: the browser's restored scroll offset could otherwise
   land a returning visitor below the top billing that is the room's whole
   message. `scrollRestoration:"manual"` + scroll-to-top on arrival and on any
   change of who is billed; the browser's own behaviour is restored on exit.
6. **The one case the law leaves unbilled** is a WAL exit that names no owner
   (`?from=wal` with no `&owner=`). It cannot bill the house without breaking
   Clause 3, so the slot stays empty. Unreachable in practice — the wing always
   sends `owner=` — but a stale link in the wild would land on it. Open for
   Mike (review J3).

## SEALED 2026-08-02 — THE BINGE + TEMPLATE ROUND (v35; D + B1–B9. DEPLOY IS MIKE'S)

Autonomous single-agent Code-lane round on Mike's binge/template brief. Full
round log: `docs/MUSEUM_BINGE_TEMPLATE_LOG-20260802.md`. The review deliverable:
`docs/TEMPLATE_ADVERSARIAL_REVIEW.md`. Collage wall protected and re-verified.

- **D — THE RELEASE DOCTRINES recorded** (above): D-BINGE, D-EPISODE,
  D-WEEKLY-EVERYWHERE. The third is doctrine only — nothing built — with five
  concrete notes on what automation would need, including the honest blocker
  (MV is laptop-local; no scheduler can reach it — a hosting decision).
- **B5 THE PLATES PAGER — one cause, two faces, both measured.** The wall is a
  grid that auto-fills 2-across in a 582px column: **1134px into a 758px column,
  376px clipped, three plates unreachable, no scrollbar.** The leftover footer
  then took a page to itself — 17px of type on an empty sheet, the "blank page
  2". Fixed by `data-stage-full` (a wall takes the PAGE at page width: 5-across
  × 2 rows, **0px clipped**) plus the footer riding the transport, whose prop had
  been neutered since it was written (`footer={face.footer ? null : null}`).
  **The lap then found the same defect at 387px** (223px sheet vs 823px wall, six
  of nine lost) — a full block now divides into as many full pages as it needs,
  measured off the grid's real ROW geometry (height ÷ page is wrong: three tiles
  across two columns is two rows). Phone: 5 wall pages, all nine reachable, worst
  overflow 0px. Desktop byte-identical to before the division path existed.
- **B6/B8 ARE ONE BUILD — THE READER.** Plates opened in a new tab showing a bare
  4.9MB PNG on white; they now open in place, on the room. That same reader IS
  B8's microfiche container, because a wall of plates is a reel with nine frames.
  **B8's ruling recorded in `robots.js`:** the manual must be ACTUAL SCANS via
  microfiche-class technology; the generated PDF/plates are **the source Mike
  prints and photographs**, not the artifact. Scan spec recorded with it —
  **≥2400px long edge** (the one thing code cannot fix later), whole page
  including margins, reel order = reading order, `label` + `date` per frame.
  Reel ships EMPTY and says so; both paths verified (temp data reverted, file
  confirmed clean).
- **B9 the Record takes evidence classes** — `evidence` (a word; **no permitted
  list in code or CSS**), `wire`, `plates` (the reader's own shape). No new
  species. Payloads ship empty deliberately: the only photographs in the repo are
  of the unit as received, and attaching them to entries about boxes and ads
  would be inventing provenance.
- **B1 gift shop**: direct arrival now bills the HOUSE and shows all five (Mike
  overruling P11's stated reading); view resets on every entry
  (`scrollRestoration:"manual"` — without it Chrome re-applies the old offset
  after the effect). All seven exit cases re-verified.
- **B2 the input-field template** — `.wb-field`, named so it is a thing in the
  stylesheet not a habit. Both fields one mechanic/face/size; name + Sign as
  **exactly equal halves** (369.667px each, grid not flex — flex could not do it)
  on one line below the note. P13's caption superseded. The /hr journal composer
  already conformed and was left alone.
- **B3** the post-it tilt formula `((ci*5)%5)-2` **could only ever return −2°** —
  every card in every deck identically tilted since it shipped. Now the collage's
  own coprime stride. **B4** the B&W law moves from per-component to **one rule
  scoped to the wing**, which is why the plate wall had escaped it.
- **B7 THE ADVERSARIAL REVIEW** — 8 drift fixed, 6 conformance items recommended
  with reproducible evidence, 4 judgment calls, 5 templates verified holding, and
  a 14-entry template register (drift cannot be measured without a baseline).
  **Two findings for Mike:** (J1) **the retired 2025 gold `#b8974a` is still
  painting on the player bar's play/volume/CC buttons** — 30 live sites, verified
  computing `rgb(184,151,74)` on /hr; listed not fixed because it is a palette
  decision on the most-used control. (R1) **four visitor-facing surfaces use ZERO
  tokens** — 151 hard-coded colours, 96 byte-for-byte identical to an existing
  `--wb-*`; tokens verified reachable on every route, so only the typing blocks
  it. One conformance fix taken: shop + booth wordmarks read `var(--wb-brand)`
  like the exhibit's, closing a live fork in an active brand trial.
- Gates: **lint 11 err / 9 warn** — errors match the 11/10 HEAD baseline exactly,
  **zero new findings** (sets normalised, sorted, compared with `comm`; the only
  delta is one warning HEAD had and this tree does not — a dead
  eslint-disable at the Stage's plan effect became a working one). A 12th error
  was caught AT the gate and fixed: a second `catch (e)` with an unused binding,
  added beside a pre-existing one that is documented debt. Vite build green. Console
  clean with **no `[stage]` overrun warnings**, which is itself the gate. Desktop
  lap across all seven routes + all six MGK tracks.
  **PHONE VERIFIED BY A GENUINE 387px VIEWPORT THIS TIME** — the window manager
  refused `resize_window` again (last round's hazard), so the lap ran in a
  same-origin 390px iframe where media queries genuinely fire. That is what
  caught the phone half of B5, which measurement alone would have missed;
  recommended as the standard technique for this repo.

## SEALED 2026-08-02 — THE POLISH ROUND (v34; P1–P23. DEPLOY IS MIKE'S)

Mike's glass session on v33, autonomous single-agent Code-lane round, 23 items.
Full round log: `docs/MUSEUM_POLISH_LOG-20260802.md`. Collage wall protected and
re-verified (11 tiles, tilt and shadow intact, captions up from 9px to 13px).

- **P1 "nothing resizes" — TWO independent causes, both measured.** (a) F2's
  console apron (`.ex-banner-console::before`, 16px at `bottom:100%`, z-index
  80) sat exactly on the 14px carousel drag handle; `elementsFromPoint` returned
  the banner first at every point of it. `pointer-events:none` — the apron was
  always paint. (b) Even with the handle back, F3's `--fit-area-max` was written
  once on entry and never revised, so the viewer was frozen. The carousel drag
  now TRADES height with the viewer (proven: cf 160→270, area 470→360, total 630
  preserved, session-persisted).
- **P2 scroller 105px → 48px** (content-sized, 2-line cap kept); **P3 title bar
  50px → 40px**; **P4 no scroller under a stowed face** (scoped to the state,
  not to the one card Mike named).
- **P5 [PAPA] scrubbed at the render seam, site-wide** (`scrubFace` in
  Exhibit.jsx). Cuts by SENTENCE so real provenance survives beside the marker.
  Data keeps its markers — they are Mike's to-do list; visitors never see one.
  Verified zero occurrences across all five WAL albums, /hr, /wb, /robots,
  /booth.
- **P6 arrow removed** (the door now states its function in words). **P7 one
  type ramp**: seventeen ad-hoc ratios of `--face-fs` replaced by five named
  steps with rem floors — the small end stopped shrinking with the viewport
  (was 8.3px at a 900px window). **P8 pull-quote leaves DM Serif Display** for
  the house Syne, sized as a LEAD so it no longer outsizes the title.
  **P9 warm charcoal stage** + a lit ellipse (was neutral #121110 under warm
  paper tiles). **P10 doors 2×2**, explicitly two, stacking below 820px.
- **P14** the two house questions left the artist cards (FAQ owns them).
  **P15** doors are Name + FUNCTION + a written scent. **P16/P22** the plain
  discographies died; a RECORDS block of doors replaced them, every link read
  off the platform's own catalogue page this round. **P17/P18/P19** three card
  decks (Said about them / What they said / Also) — post-it museum cards, video
  posters where the source is an upload, every card a link to its source.
  **P20** the tombstone gained doors. **P21** the Bandcamp line rewritten plain.
- **P23 robots**: THE PLATES — the wing's nine real photographs, glued up on the
  WAL collage renderer. Needed the link seam generalising (`artist.linkEvent`)
  or the tiles would have been beautifully dead — W4a's defect pre-built into
  the next wing. Register hanging-indent fixed; two `[PAPA]`-as-heading rows
  given real headings with the marker demoted to the note.
- **Found and fixed in the lap**: the door name "carsieblanton.com" is one
  unbreakable 367px token — 404px demanded inside a 391px phone. `overflow-wrap:
  anywhere`; worst min-content block on the page is now 184px.
- Gates: lint 11/10 (= HEAD baseline, zero new), vite build green, all five WAL
  albums × every face walked, /hr /wb /robots /shop /booth verified unregressed,
  billing law verified on all seven exit cases. **Phone verified by measurement,
  NOT by a narrow viewport** — the browser refused to resize (outerWidth 0), so
  the min-content probe stands in for a visual narrow-width walk. Flagged.

## SEALED 2026-08-02 — MUSEUM FIT ROUND (v33; DEPLOY IS MIKE'S — mirror/deploy pending)

Mike's refinement round on the spotlight wing, F1–F7. Round log:
`docs/MUSEUM_FIT_LOG-20260802.md`. Collage wall protected and re-verified.

- **F1 tracklist CORRECTED**: "Coconuts"/"E. D. Yadah" were Mike's own songs
  used as EXAMPLES — both rows dead. Structure now: 01..n songs → About the
  Songs → About the Artist (+ the doors out, rehomed) → What they are up to.
- **F2 bleed diagnosed**: the fixed nav is 45px, the sticky console pinned at
  a hard-coded top:52px — a 7px open strip where the collage painted raw.
  Closed with an opaque apron on the console (::before, covers ±16px of
  nav-height variance).
- **F3 fit on entry**: WAL sizes itself from measurement — carousel yields
  first (to its 160 floor), then the video frame's height caps and the player
  letterboxes on the dark stage; the split is not a fit lever (the first
  draft's 62%-empty tracklist was rejected). Session-sticky via
  sessionStorage (`fitOnEntry` + scoped usePersist); fresh visit re-fits.
- **F4** scroller tightened to a two-line budget (was 120px min with measured
  dead black). **F5** the ?-button and FactPopup RETIRED (revival: 7c3a231);
  factoids ride the scroller, ambient.
- **F6 phone first pass**: tap `:active` feedback (coarse pointers), stronger
  selected-row state at stacked widths, scroll-the-viewer-to-the-finger on
  card taps (flat wing ≤720 only). Everything else identified honestly in
  `docs/PHONE_FINDINGS.md` — NOT optimized, per Mike. Dev-pane caveat banked
  there: smooth-scroll cannot animate in the non-composited preview pane.
- **F7a** the wing's FIRST ALBUM is the house explaining itself (lands on
  "What this room is", [PAPA] throughout). **F7b** gift shop: HR full-width
  banner gone (he rides the artist tiles), tiles double height (two-up grid),
  whole page template-driven off the WAL artist data. **F7c** lobby subtitle
  live — default "A Singer-Songwriter Museum", candidates 2–4 at
  `/?subtitle=N`, MIKE PICKS. **F7d** sweep clean: only the live /hr route,
  its own config, and the admin jump remain — no visitor-facing pointers.
- Gates: lint 11/10 (= baseline), build green, zero console errors, desktop +
  375px walked, /hr /wb /robots /shop /booth verified.

## SEALED 2026-08-02 — WAL SPOTLIGHT ROUND (v32; pushed, origin-verified — DEPLOY still Mike's)

Mike's glass session on the finished wing, W1–W10, autonomous Code-lane round.
Full round log + interpretation flags: `docs/WAL_SPOTLIGHT_LOG-20260802.md`.

- **W1 video persistence**: navigation no longer stops the player (supersedes
  v30's M-b walk-away stop). A face lays OVER the running video — visual-only
  stow, audio continues, same iframe (element-identity proven in the lap);
  stopping is the transport's STOP, Escape, or queue end.
- **W10 tracklist**: Mike's category set verbatim — Coconuts (header over the
  numbered songs) / E. D. Yadah (the doors out) / About the Songs / About the
  Artist / What they are up to. Gift-shop row removed (title bar keeps the
  shop); the indented song-card sub-rows died. THREE INTERPRETATIONS FLAGGED
  for Mike in the data file + round log (Coconuts=songs; Yadah=links;
  up-to=feed+tour).
- **W7 flat**: WAL retires the staged pager + fixed body height
  (`faceFlow:"flat"`); faces run full length in the page's own flow, zero
  internal scrolling (measured 0 hidden px on every face, phone + desktop).
  The no-scroll law survives as "no inner scroll traps; the document scrolls".
  /robots keeps its stage.
- **W4 buttons**: root cause found + fixed — face `action` events carried no
  `href`, so every WAL door was dead while trail rows worked. Buttons redesigned
  to the spotlight register (marquee doors, lit left rule).
- **W2/W3 color via embeds**: cued songs show the video's own poster frame
  (maxres→hq); "What they are up to" is a glued-up tilted COLLAGE of the
  artist's own thumbnails, every tile opens the video.
- **W8 crayons**: real artist imagery vaulted at `public/images/wal/` (4 covers
  + 2 plates), provenance per image in `docs/WAL_PHOTO_PROVENANCE-20260802.md`,
  ALL PENDING Mike's permit-or-deny emails before go-live. Gift-shop WAL
  banners ride the same art (FLAGGED-FOR-ART closed).
- **W5**: money talk is off the artists' stages (lives in /booth's FAQ).
  **W9**: no HRRW — every /hr pointer removed from WAL; HR is a WAL artist
  served from our vault; his door out is hunterroot.com.
- **W6**: stage goes dark via a scoped token re-pin on `.ex-right` (the .pb
  projection-booth mechanism); frame quiet, imagery lit.
- Gates: lint at HEAD baseline (11 err/10 warn, all pre-existing), vite build
  green, /hr /wb /robots /shop verified unregressed, browser lap phone+desktop
  with zero console errors.

## LIVE (deployed, verified)

- Site: https://weird.baby — LIVE and CURRENT. Last deploy version `b89cfb91` (wrangler 4.81.1), 2026-07-07 (FactScroller re-plumb; verified via deploy output + Ops live Chrome checks: recipe cards cycle vault facts, credits right-aligned, no fact tiles on the wall, scroll-to-bottom clears the player bar).
- Status: SOFT-LAUNCHED — visible but not advertised / not yet in search engines.
- Repo HEAD at deploy: `af42808` + docs close commit follows same session.

## SHIPPED 2026-07-07 — FACTSCROLLER RE-PLUMB + FIRST RECIPE CARDS (FACTSCROLLER_REPLUMB-20260707; deploy b89cfb91)

Executed per `docs/FACTSCROLLER_REPLUMB_BRIEF-20260707.md`, all 4 stages gated (run log: `docs/FACTSCROLLER_REPLUMB_LOG-20260707.md` — paste-backs, gate verdicts, live-verify on the record). Backup: `MediaVault/core/backups/mediavault_pre-factscroller-20260707T202907Z.sqlite` (verified; gitignored — OneDrive mirror is the durable home, RE-MIRROR PENDING). MV DB writes host-side; WBM through `af42808` + docs close.

- **The 97 facts are LIVE.** DB: 97 `fact` artifacts flipped vault→released (`released_at` set); 2 recipe-card artifacts inserted `MV-HR-20260707-100` (Nick Root) / `-101` (Arkansas), kind NULL / media_type other / `card_kind:recipe` (NEW vocab value, registered at usage 2). 392→394 artifacts; registry 230→231, 0 mismatch / 0 zero-usage; id_sequence 20260707 stale-4 repaired → 101 (Flag D).
- **Export re-plumbed** (`tools/export-artifacts.mjs`): facts export to a SEPARATE `hunter_root.facts.json` (97); wall SQL structurally excludes `kind='fact'` (two independent locks) — facts NEVER tile the wall (Mike's standing ruling, enforced in SQL not convention). Recipe cards pass through with their baked recipe query; era-derivation exempts `recipe`. Wall = 49 (47 + 2 recipe); verify proved wall ∩ facts-payload = ∅.
- **Client** (`src/lib/fact-select.js` NEW + surgical edits to Exhibit.jsx / HrExhibitFlow.jsx / spine / config): player scroller + living recipe cards read the vault via a shared selector — tag-based CLIMB (song→album→era→artist, unsignaled, fountain never dries) + weight = per-session selection frequency (closes the PUV pilot's deferred weight signal, NO schema). `splitFact` puts the quote in the big box, the source breadcrumb in the small box (Mike's display ruling). `hr_facts.js` RETIRED from the live path (kept in-tree, unimported — it carried Nick's death year as 2020; vault truth is 2021-04-15).
- **Eyeball polish (Mike-gated):** player scroller keeps its bounce, gains overflow fade-mask + right-aligned breadcrumb; recipe cards = fixed-height body (no masonry reflow flash), soft cross-fade, desynced start, right-aligned credit, small eyebrow for identity. Scroll-to-bottom fixed: panel bottom padding → 5.5rem clears the 68px player bar (also eases the standing DECK-SCROLL-OCCLUSION). A **Recipe** pill now sits in the Card Kind filter group.
- Selector unit-tested (27/27 + splitFact 8/8); big-file edits compile-verified via git-HEAD reconstruction + esbuild (mount read-lag defeated per OPERATIONS §8); deployed bundle live-verified in Chrome.
- Deferred: fact COLLECTION beyond 97 + more recipe cards · `hr_facts.js` unique-seed salvage brief · strict critics-only Arkansas variant (BACKLOG low/low) · breadcrumb icon (spec §6) · font/motion polish once volume grows.

## SHIPPED 2026-07-07 — PRESS BATCH + FACT FACTORY RUN 1 (PRESS_BATCH_INGEST-20260707; deploy 2b1a853b)

Executed per `docs/PRESS_BATCH_INGEST_BRIEF-20260707.md`, every stage gated + committed (run log: `docs/PRESS_BATCH_INGEST_LOG-20260707.md`; Stage 1 delta + Stage 3 candidates docs alongside). Backup: `MediaVault/core/backups/mediavault_pre-press-batch-20260707T180632Z.sqlite` (verified; gitignored — OneDrive mirror is the durable home, RE-MIRROR PENDING). MV repo `9c95833`, museum through `eb8ec09`.

- Roster ground-truth: the brief's "16-URL list" existed in no tree; Mike ruled the found 15 (13 already vaulted 6/17 as `MV-20260617-001..013` + PA Musician + NEPAudio). Stage 2 was NORMALIZE+COMPLETE, not fresh ingest — no duplicates.
- DB: kind CHECK rebuilt +`press` (9 values, cf17d5c mold); reserved `interview` ACTIVATED (first inhabitants). 299→392 artifacts: 14 press/interview RELEASED (12 updated + 2 ingested `MV-HR-20260707-005/006`), fan-crash video stays vaulted (link dead/private, Mike browser-checked); **93 facts** `MV-HR-20260707-007..099` (kind=fact, ALL VAULT — hidden until FactScroller re-wire). Facts = every quote from every source + derived facts, wording gate PASS all-93 as worded.
- NEW `speaker:` tag axis (tier 3): quote-speaker on facts; values = persons AND outlets (Mike's amendment); 19 slugs registered at first use. Pilot fact 001 breadcrumb strengthened — Nick's death date now source-backed (Root via Whiskey Riff: 2021-04-15, age 27); wording unchanged.
- Corrections landed at gates: Substack (`-012`) is the ORIGINAL of the Americana Highways interview (post_date → 2025-10-16); Country Note date TZ artifact fixed (→ 2025-11-24). Watch-item on record: producer-credit conflict (Osborne/Kalmusky vs D'Ambrosio's "Kalmuskey") — facts worded per three-source majority.
- Export: 33→47 records; 0 underivable; facts excluded by status; vocabulary.json +speaker row (board unaffected — facet keys hardcoded). Filter board gains Interview/Press content-kind pills + Topic roots/release. HAZARD RECONFIRMED: mount read-lag served a truncated tag_vocabulary.json after host edit — false alarm, host file was whole; JSON validity checks now ride the scripts.
- Feeds unlocked: FactScroller Sequencing C DONE (vault filled, 97 facts); "Arkansas reviews" + "Nick Root" recipe cards now buildable; next brief = FactScroller re-plumb (Sequencing A/B).

## SHIPPED 2026-07-07 — DERIVED-ERA RE-WIRE (DERIVED_ERA_REWIRE-20260707; deploy 8fb3aab1)

Executed per `docs/DERIVED_ERA_REWIRE_BRIEF-20260707.md`, WIP-state-authoritative, every stage gated (run log: `docs/DERIVED_ERA_REWIRE_LOG-20260707.md`). NO DB write (referenced_dates already applied 6/17, all NULL — Stage 0 backup waived by Stage 1 verdict). The 6/17 parked implementation is LIVE, corrected per the incident: all client edits host-side via Mike-run scripts, everything re-verified against the live tree first.

- Export bakes weighted date-sets per leaf (`tools/era-derivation.mjs` + root `era-config.json` registry); era label NO LONGER baked; legacy hand `era:` tags stay in MV as curation inputs. Curator channel: `referenced_dates.era_override` bakes through, wins outright.
- Client derives era at module load at FIXED depth 0.5 — NO slider (locked; proximity filter = separate future workstream). `src/routes/hr/hr_era.js` + `src/data/era-buckets.json`; `hr_dimensions.js`/`matchFilter` untouched.
- Era pills: **7 album-anchored buckets** (re-ruled 2026-07-07, replacing the 5): 2013 Band Years / 2017 Going Solo / 2019 Wheel / 2020 Dandelions / 2021 Skipping Stones / 2022 Arkansas / 2024–now Crooked Home (open-ended, catches future-dated releases). Date-led display labels; CHRONOLOGICAL pill order (era only, other facets alphabetical). rwth folds to Band Years 15/15.
- Proofs: correctness v2 — 37 hand tags remap clean, 0 flags; export==oracle per-artifact; 0 underivable; pre-2013 check clear (DB min 2014). Deck pills at 0.5: 2/1/1/3/1/8/10, 3 multi-era cards, containers era-less by design.
- Bucket revisions = edit `src/data/era-buckets.json` alone (proven: the 5→7 redraw touched no artifact, export content-idempotent). Stage scripts: `docs/derived-era-WIP/derived_era_stage3/4/4b/4c/4d/5*.ps1`. Commits `30beff0` (Stage 3) + `420c6ba` (Stage 4).
## SHIPPED 2026-07-07 — FACT KIND + PUV PILOT (FACT_KIND_PUV_PILOT-20260707; DB-only, NO deploy)

Executed per `docs/FACT_KIND_PUV_PILOT_BRIEF-20260707.md`, every stage gated + committed (run log: `docs/FACT_KIND_PUV_PILOT_LOG-20260707.md` — paste-backs, hashes, gate verdicts, delegation arrangement on the record). Backup: `MediaVault/core/backups/mediavault_pre-fact-kind-20260707T020813Z.sqlite` (verified; gitignored, OneDrive mirror is the durable home). Site UNCHANGED — still `ffcf7fbd`; export proven content-idempotent, deploy no-op by design.

- DB: artifacts table REBUILT — kind CHECK now 8 values (+`fact`, F10 closed); 293→297 artifacts: **4 pilot facts** `MV-HR-20260707-001..004` (kind=fact, media_type=text, **status=vault** — Mike's Flag-B call: no export, no wall tiles until display UI exists). Registry synced (211 slugs, 0-0-0); source tag==column 297/297.
- Facts carry Mike's wording verbatim + real in-vault breadcrumbs (Americana Highways / ReverbNation / Blue Harvest 2014). Two brief premises corrected at the wording gate: Nick Root death-year UNVERIFIED → omitted entirely; RWTH = Hunter's FIRST SOLO RECORD, not a band.
- Registry: `fact` registered in `tag_vocabulary.json` kind_column (MV `903d52d`); DB vocabulary/tags tables deliberately untouched (kind is a column, not a tag — no kind:* slugs exist for ANY kind value).
- Deferred to the FactScroller re-wire workstream (spec §Execution 4–5): weight signal (no schema home), sourceless-marker closed set, tag-based PUV matching, fact display UI (Mike-led). Harmonica rider: stays HELD (operator-list required; nothing registers at zero usage).

## SHIPPED 2026-07-07 — MV VOCABULARY MIGRATION (Stages 0-4, 6, 8; deploy ffcf7fbd)

Executed per `docs/MV_VOCAB_MIGRATION_BRIEF-20260624.md`, all 10 forks LOCKED per reconcile plan Part E, every stage gated + committed (run log: `docs/MV_VOCAB_MIGRATION_LOG-20260624.md` — full paste-backs, hashes, verdicts). Head = live MV DB. Backup: `MediaVault/core/backups/mediavault_pre-vocab-reconcile-v2-20260707T010514Z.sqlite` (integrity ok, gitignored; OneDrive mirror is the durable home).

- DB: exhibit un-retired; event/lineup/attributes registered (tier 3); presentation folded to attributes:link; tags registry rebuilt (210 slugs, 0 mismatch/0 unregistered/0 zero-usage); source collapsed (fresh disagreement=14; tag==column 293/293; 19 NULLs→local; youtube 105 unchanged); **bands→band renamed (288 payloads)** — lineup:band untouched.
- Client: `BOARD_TOTAL_KEYS` bands→band (HrExhibitFlow.jsx); exports regenerated (hunter_root.json, vocabulary.json 22 rows). Filter board renders Band; Medusa's Disco absent BY DATA (its 4 artifacts unreleased — appears on release, no code needed).
- Docs: `MediaVault/core/tag_vocabulary.json` regenerated v2.0 (demoted, non-authoritative per F3); `TAXONOMY_v1.md` rewritten as-built (MV repo `15e5bda`).
- Deferred (locked): content_kind/card_kind kept (F4/F5); artifact_kind/format routing = backlog; `fact` Kind + the one table rebuild = separate later workstream (F10/Stage 7).

## SHIPPED 2026-07-06 — WB_ARTIST_LOBBY_BOOTH-20260706 (deploy 676d20a9)

Brief executed via Cowork, stages 1–5, Mike gating each stage live. Now on weird.baby:

- **/wb — Weird.Baby house exhibit.** Hand-authored spine in `src/data/artists/weird-baby.js` (no MV; six Vol 1 recordings as repo assets `public/audio/wb/`, registration slot numbers in filenames). Display order Coconuts → E.D. Yahdah → registration order (Mike). Album display title "The Making of BoWB V1". Composed cover `public/images/wb/vol1_cover_v1.png` (gray field, red "the making of", white "The Best of"/"Vol. 1", Fredoka, logo centerpiece; generated via PIL, spec by Mike). `exhibitFlow` omitted — Exhibit.jsx:1065 guard renders player-only; `facts: []` safe. Holes by design.
- **Lobby directory** (WbHome.jsx): four rows — HUNTER ROOT / WEIRD.BABY / INFORMATION BOOTH / GIFT SHOP — replace the single explore button. Guestbook untouched.
- **/booth — Information Booth.** Placard in Lobby paper chrome, all-Fredoka, Mike's words v4 (short credo, thank-you + papa@weird.baby). FAQ button expands the card IN PLACE (native `<details>` accordion, collapsed; 2 Q&As from Mike's words). Subdued FAQ/Lobby buttons. NOTE: papa@weird.baby not yet set up — mail bounces until the Cloudflare email task (Deferred) lands.
- **Shop rework** (Mike's calls at preview): museum-standard title bar (brand / GIFT SHOP / Lobby — same format as exhibit nav, now the room convention), top billing only (no tail repeat), FEATURED/FRIENDS labels gone, standalone WB banner removed — WB rides the roster (sticker head image, blurb "Six little blues from Papa."). Big signage + corner exits absorbed into the bar.
- **Tracklist interaction (museum-wide, /hr too):** number/title click PLAYS; variant dropdown is a visible type-anchored select that always drops (even one option); hit target padded 9px vertically.
- Deferred (recorded in the brief + BACKLOG intake 2026-07-06): real Vol 1 cover art, MV ingestion of Vol 1, wb_merch live-flip, booth email, charter doc, FAQ-surface governance items, org-level credo.

## FULL-LAUNCH GATES (soft-launch -> advertised launch) — INCOMPLETE BY DESIGN

These must be true before driving traffic (Google search, advertising). This list is deliberately incomplete — ADD to it as gaps surface; do not treat as closed.

- [ ] Gift Shops hooked up (artist shops wired/functional, not just routes existing).
- [ ] Mike's gift shop built (Mike has source work to bring when scoped).
- [ ] Substantially more content (museum needs many more artifacts before traffic is worth driving).
- [ ] (more expected — capture as found)

## NEXT (ordered queue — pull from here)

1. [DONE 2026-06-17] Off-GitHub backup — OneDrive mirror `753b17e`.
2. [DONE 2026-06-17] STATE.md rebuilt as live ledger (this block).
3. Content expansion toward full-launch gate (largest lever for launch).
4. Gift shop wiring + Mike's gift shop build (gated on Mike bringing source).
5. [DONE 2026-07-07] Press batch — SHIPPED as PRESS_BATCH_INGEST-20260707 (14 released, 93 facts vaulted; content-expansion gate progress: +14 visitor-facing artifacts, wall now 47).
6. [DONE 2026-07-07] FactScroller re-plumb — SHIPPED as FACTSCROLLER_REPLUMB-20260707 (deploy b89cfb91): 97 facts live via player scroller + 2 living recipe cards (Nick Root, Arkansas); climb + weight; facts structurally off the wall.
7. Fact collection beyond the pilot 97 (more recipe cards, more facts) + `hr_facts.js` unique-seed salvage — largest remaining content lever for the FactScroller surface.

## KNOWN ISSUES (accepted, not yet fixed)

- DECK-SCROLL-OCCLUSION — player bar hides deck bottom. Confirmed reproducing 2026-06-17. Category: minor / infrequent / consistent annoyance. PIGGYBACK when deck-area work opens the file; not pulled standalone.
- DECKBUG-FBBLOCKS — FB embed renders as black/white block. Reproduction unconfirmed.
- Inbox photo MV-HR-20260405-036 — 1 of 6 unreleased (5 released).
- Video-panel YT-thumb fallback — unclassed full-bleed img; mostly moot since albums carry art.

## GIFT SHOP — MERCH PIPELINE (added 2026-06-23, verified this session)

Reality the ledger previously missed. Code (`src/data/wb_merch.js`) is correct as-is — `live:false`, "coming soon" is the accurate visitor state. This records the OPERATOR-side state behind it.

- **Printful account: LIVE.** Logged in as Mike. One store exists: "Weird.Baby", tagged **Live + QuickStore** (Printful's native storefront, US-only, $0/mo). NOT Big Cartel.
- **Stickers BUILT + SOLD.** Product "Weird.Baby Sticker", published, 3 kiss-cut white variants: 3"x3" (#15583638, $4.50), 4"x4" (#15583639, $4.50), 5.5"x5.5" (#15583640, $5.00). Mike test-bought 10 — print quality good, thin white border as expected.
- **Sticker size ceiling = 5.5" square.** Catalog kiss-cut sizes: 3"/4"/5.5"/15"x3.75". The 15" is a bumper strip — REJECTED by Mike (square only). No larger square exists. Sticker line is COMPLETE.
- **PARKED quality item:** the 3 sticker variants carry an OLD low-res file. Mike has a better 2400px master. Refresh = swap master into each variant's design, confirm no res warning. Deferrable; blocks nothing.

## GIFT SHOP — SHIPPED LIVE (2026-06-23, deploy c12cffe5)

The gift shop is LIVE on weird.baby/shop (verified incognito). Supersedes the "decision/parked" notes below for shop-render status.

- **WB sticker is for sale in-shop.** wb_merch.js: live:true, links to https://weird-baby.printful.me. Sticker image cropped tight (was whitespace-heavy), at public/images/wb-merch/sticker.png.
- **Layout: all sections are unified horizontal BANNERS** (Featured + Friends share the .featured-artist structure via a shared <Banner> component in GiftShop.jsx). No more square grids.
- **Page order:** one FEATURED section (top, enlarged label) -> FRIENDS (Weird.Baby banner first, then non-featured roster, then the FEATURED artist repeated last). Everyone appears once in Friends; featured artist shows top + tail. Logic: others/featuredInRoster split in GiftShop.jsx.
- **Removed:** all CTA buttons, the price line, and the no-cut blurb (Mike: kill all extra text/buttons).
- **Hunter Root:** image filled (Crooked Home art, public/images/wb-merch/hunter-root.png), blurb = "Records, prints, and road-worn merch from a songwriter worth following home." (timeless, no album count). Store link unchanged (hunterroot.com, correct).
- **WB Friends-banner bio:** "Stickers, shirts, and hats from the museum itself. Buy a little weirdness — and help us keep the lights on for the artists we love."
- Commit 16c76d4, deploy c12cffe5, wrangler 4.81.1.

### Still open (not done this session)
- Shirts + hats: not built. Next durable merch product work, storefront-agnostic.
- Sticker low-res refresh: the 3 Printful sticker VARIANTS still carry the old low-res master (the in-shop image is fine; this is the product print file on Printful's side). Deferrable.
- shop.weird.baby custom domain: deferred to launch (Big Cartel Platinum), per storefront decision above.
## STOREFRONT DECISION (settled 2026-06-23)

- **Long-term: custom domain `shop.weird.baby` wanted.** Today: URL not a factor.
- **Path:** use the existing free Quick Store now (pre-launch, near-zero traffic — no fee justified yet). Stand up **Big Cartel Platinum + attach `shop.weird.baby` at launch**, when traffic justifies the $15/mo.
- **Key fact:** Quick Store CANNOT take a custom domain ever (Printful confirmed). Big Cartel free also can't — needs Platinum ($15/mo). So custom URL = Big Cartel Platinum, full stop.
- **Durable asset insight:** the reusable work is the Printful PRODUCTS (designs/print files), portable to any storefront. The storefront is a thin wrapper, cheaply rebuilt. Quick-Store-now wastes nothing but a 10-min wrapper.
- **NEXT merch products (durable work, storefront-agnostic):** shirts, hats. Not yet built.

## BACKUP STATUS

- Off-GitHub (repo): OneDrive mirror at `~\OneDrive\_backups\weird-baby-museum\`, `753b17e`, 2026-06-17. POINT-IN-TIME (does not auto-update).
- **DB backups (MediaVault): NOW MIRRORED — 2026-07-07.** Discovery found the OneDrive DB-backup home was EMPTY (the "durable home for DB backups" was aspirational — 34 local snapshots existed only on disk). All 34 `.sqlite` backups copied + sha256-verified to `~\OneDrive\_backups\MediaVault\core\backups\` (mirrors the source tree). Critical `mediavault_pre-factscroller-20260707T020813...T202907Z.sqlite` verified (`72BF738A…`). Re-run `C:\AI\mirror_db_backups.ps1` after any new backup — it is idempotent (copies only missing/changed, verifies each).
- STANDING OPS ITEMS (not yet automated): (a) periodic re-mirror so backups stay current — now a one-command step (`mirror_db_backups.ps1`); (b) quarterly restore-drill per charter 3.4 — a backup nobody restored is a rumor.

## CANNOT-VERIFY-FROM-MUSEUM-SESSION (flag, separate pass)

- All MediaVault-repo items (C:\AI\Platform\MediaVault) — not reachable in a Museum session. Needs MV-side pass.
- Mobile UX, banner-match-nav, cover-pill render — need live narrow-width inspection.

<!-- ============================================================= -->
<!-- END LIVE LEDGER. Durable reference (pre-2026-06-17) follows.   -->
<!-- ============================================================= -->

## Decisions / closed

- COL3 FB post clip: CLOSED — ACCEPTED (2026-06-02). Logged-out-only cosmetic clip of the longest post's like/comment/share row. NOT a column bug (column is random per load); NOT an open defect. Cause = fixed-height box that never self-sizes because raw post.php sends no height. Dead-end theories + fix options recorded in docs/FINDING-fb-post-clip.md. Do NOT re-investigate as a mystery — read that doc first.

# Weird.Baby Museum — STATE

The durable reference for the Museum: stack, routes, mothballed-for-v1
decisions, and pointers to canonical specs. **Does NOT cover current
progress, deploy status, or what's next** — see `NAVIGATION.md` and
`git log` for that.

**Last refreshed:** 2026-06-07

## Working Doctrine (for any agent/session)

Canonical process manual: docs/canonical/OPERATIONS.md (read first; this section is mirrored there).

Standing Ops rules. Each one was paid for by a real failure; read before
any repo work, any session, any agent.

1. **Verify before scoping.** Read the actual file in the live
   `weird-baby-museum` working tree before reasoning about it. Never
   scope against memory, against Drive copies (Drive has served
   stale/retired trees), or against assumption. Past errors traced
   directly to this: scoping against the album-registry file instead of
   the foundation export; reading a retired repo from Drive.
2. **Don't guess — look it up.** Use pwsh (read-only) or Cowork to read
   real code/data. If a claim about the codebase isn't backed by a file
   just read, it is a guess and must not be acted on.
3. **Default to Cowork for repo work.** For repo reads, big-file edits
   (`HrExhibitFlow.jsx` ~152KB, `Exhibit.jsx` ~37KB), and multi-file
   scoping, prefer a Cowork task over chat-driven pwsh paste-back:
   Cowork has full repo reach, is faster, and avoids the human relay's
   buffer limits and paste errors.
4. **Drive the live UI by accessibility ref, not pixel coordinates.**
   The dock has tiny targets and a peek-to-open animation; pixel clicks
   miss silently. Use `find`/`read_page` refs. (A live verification
   session lost time to missed pixel-clicks that ref-based clicks fixed
   immediately.)
5. **Never put load-bearing work inside if/else in scripts that get
   pasted line-by-line** — the `else` orphans in the console and
   silently skips the body. Use flat statements with explicit
   verify-or-abort. (This silently skipped a real edit once; a commit
   message overclaimed as a result.)
6. **Durability.** Work isn't done until committed AND pushed AND (for
   UI changes) deployed: `npm run build && npx wrangler deploy` — there
   is no CI; deploy is manual. Scratch files and local commits are not
   durable.

## What this is

Weird.Baby Museum. A curatorial platform. Currently exhibiting Hunter Root.

## Live routes

- `/` — front door (lobby + guestbook)
- `/admin` — operator dashboard (`mmm` key sequence)
- `/hr` — Hunter Root exhibit
- `/hr/home`, `/hr/media`, `/hr/archive`, `/hr/fan-wall` — HR sub-routes
- `/wb` — Weird.Baby house exhibit (added 2026-07-06)
- `/booth` — Information Booth (added 2026-07-06)
- `/shop` — gift shop
- `/p/:id` — preset-share landing (resolves a shared preset, parks the snapshot, lands the visitor at the front door; unknown/broken ids degrade to a plain Lobby visit)

Planned routes when this table is next touched: `/drawing`, and the Stacks filter surface.

## Stack

React 19, Vite 8, Cloudflare Workers, D1 (`weird-baby-db`).
Build: `npx vite build`. Deploy: `npx wrangler deploy`.

## Mothballed for v1

The following code paths exist in source but are deliberately not
rendered in the v1 launch. They revive post-launch. Source comments
saying "MOTHBALLED for v1 per STATE.md" point at this section.

- **Kaleidoscope** — the audio-meter control surface (knobs, switches,
  VU meters). Code preserved in `src/routes/hr/HrExhibitFlow.jsx`
  (lines 84, 167–214, 617–754, 1474) and `HrExhibitFlow.css:853`
  (the `.hr-kal-*`, `.knob-wrap`, `.hr-vu-*` rules) but never mounted.
  Decision dates to the v28 controls-dock simplification pass; revives
  when the operator chooses to re-expose audio meters post-launch.

## Presets — capture/restore wiring (LANDED 2026-06-06)

The 2026-06-05 blockers cleared and the §8.2/§9 build landed. Spec:
`docs/UX_PRESETS_SPEC.md` (v0.4).

- **Stable ids** — the adapter surfaces stable ids onto the spine
  (49cd044): every track carries `id` (foundation id), every rendition
  carries `id = ytId ?? slug(audioUrl)`; `song` backfill in 9bbeb91.
- **Capture** — live player identity crosses the `<ExhibitFlow>` seam
  as props (`activeAlbumId` + `playingTrack` as `{ albumId, trackId,
  variantId }` stable ids). Snapshots record real state; the
  `useState(null)` stubs are gone.
- **Restore** — `onRestorePlayer` callback on the same seam;
  `Exhibit.jsx` resolves ids → current spine indices at apply-time and
  drives the player. Verbs per spec §3: Play / Show / Now Playing /
  Reset / Save, honoring controls §8.4 (only Play interrupts playback;
  Show is deck-only; Now Playing returns to the Active View).
- **State-crossing mechanism:** prop-widening at the existing seam —
  no context, no lifted state. Ref: `docs/UX_PRESETS_SPEC.md §9`.

Remaining (not blockers): §8.1 mobile presets phase 2 — factory Show +
mobile peek-return chip (phase 1 apply-only pills built + deployed
2026-06-07, 298b08f; factory presets stay deck-only, player fields
normalized explicitly neutral at apply — see spec §8.1.1) and the
preset-as-artifact model (operator tagging/featuring, entry-state-
as-preset; §0, UX_LIFECYCLE_SPEC §4.5/§4.2). Naming UI BUILT
2026-06-07 (Mike: inline, autopopulated — spec §5 #4). Sharing BUILT
2026-06-07 (Mike: Lobby-first — `/p/<shortid>` + Share verb + D1
`presets` table; spec §5 #5).
Idle auto-return BUILT 2026-06-07 (Mike: Option A — song change +
idle ≥ 8s clears a Show peek; spec §3/§5 #3; timing open to feel).

O9 shuffle/loop WIRED (2026-06-07, 524bf41, deployed + verified live):
shuffle randomizes the next-up queue (build time + live toggle-on,
Fisher–Yates); loop replays the current selection on end (controls
§9.2). State owned by the player in Exhibit.jsx, crossed to the deck
as props at the `<ExhibitFlow>` seam. Verified on weird.baby/hr: loop
wraps the album without stopping, loop-off exhausts and stops, shuffle
produces non-sequential order; snapshot capture unchanged.

## Backlog (durable design direction)

Standing items not yet started. Day-to-day sequencing lives in
`NAVIGATION.md` / `BACKLOG.md`; these are recorded here because they are
durable direction, not session-scoped tasks.

- **Brand-aligned museum aesthetic.** All Weird.Baby infrastructure (the
  museum shell: chrome, dock, controls, frames) should mirror the W.B
  logo — 1960s black-and-white-photo appeal, typeface akin to the
  logo's font. Content shown inside (album art, video, imagery) retains
  full vibrancy and palette. Principle: **brand frames the vessel;
  content stays vivid.** (Owner: Mike, UX. Status: PASS 2 BUILT
  2026-06-07. Pass 1 [dark silver] read flat — Mike: "try light, think
  outside the box." Pass 2 concept: THE PHOTO ALBUM PAGE — shell goes
  1960s photo-paper (mat-board ground, print-stock surfaces, photo-black
  accent ramp in museum-tokens + JS mirrors), cards read as prints with
  real shadows, card meta goes typewriter, film grain washes the room
  (Exhibit.css ::after, under the lightboxes), lightboxes stay a dark
  projection booth (scoped token re-pin), video placeholders stay dark
  screens ("photos are paper; video is television"), badges pinned light
  over imagery. Fredoka wordmark trial carries over. Pass 2 accepted by
  Mike ("close enough for this pass"); PASS 2b extends the album page to
  the LOBBY (WbHome inline styles — the B&W logo now sits on its native
  paper; grain wash added) and the GIFT SHOP (GiftShop.css remap + grain)
  so the whole building reads as one stock. Deliberately untouched,
  awaiting Mike's read: variant-pill type colors, journal semantic
  green/red, per-album accents, mothballed palettes.)

## Canonical docs

See `docs/canonical/` — VISION, VISION_LOCK_v0.3, UX_SPEC_v0.3,
UX_CONTROLS_SPEC_v0.4. These describe the design north-star and are
authoritative over any narrative in this file.

Child spec (draft, not yet locked): `docs/UX_PRESETS_SPEC.md` — the
presets spec that `UX_SPEC_v0.3 §C.5.0` named as forthcoming; child of
`UX_CONTROLS_SPEC_v0.4 §9` and `UX_LIFECYCLE_SPEC_v0.5 §4.5`.

