# HANDOFF — read this first

**2026-09-16, end of session (context full).** The Q&A template is ruled and
the Q&A line is built and dry-run proven. Read the memory file
`opening-day-20261030.md` first, then `docs/ELEMENTS-20260912.md` §13–§15.
State: `tools/reels-qa.py` (template; yellow; `--ahead`, `--date`, `--hot`),
`tools/reels-hot.py`, `tools/reels-queue.mjs --lane qa`, `reels/qa.json`
(five `test` rows), the workbook's Questions sheet (Mike types Q&A), the
06:08 run builds and queues a week ahead. Waiting on Mike: the approved Q&As
(fifteen by 10-09), the Buffer key. Open Ops: a glass finder the black body
cannot fool (then the top-down clip IMG_0250 joins the library); the beat
(music as element, separate); Sunday 09-20 sitting: the catalogue and the
Gambler-answers-too-wide question. Nothing is late.

**2026-09-16, later (the glass fit).** Sunday question 1 was re-measured and
reframed: the reveal font holds ~10 capitals / ~14 small letters a row, three
rows since B2; only 31 of 281 Release-1 cells fit as marked, 197 in sentence
case, 84 need a cut. `tools/glass-fit.py` renders the Gambler's twenty on the
glass (today vs Ops' re-cut, `docs/desk/GLASS-FIT-gambler.csv`) and writes
`docs/desk/GLASS-FIT.html`, served https://claude.ai/artifact/DfpetqdZQxXoNF16ccpj9g,
on the desk and on the 09-20 sitting's steps. Nothing changed in robots. Ops
recommends A (the glass rules the words). Still open: the glass finder for
IMG_0250; the beat.

**2026-09-16, later still (the finder).** The glass finder is rewritten
(bezel-and-plate sector test, ELEMENTS §16); three of sixteen library seeds
were sitting on the black body. IMG_0250 (top-down on white) joins the hold
library with ten windows. Open Ops: the beat.

**2026-09-16, night (the Feature of the Day reel).** Mike's brief (monitor,
channel 3 by cursor, the twin, the menu walk, the demo, game cuts, story
first, review first) is scripted in `docs/FEATURE-REEL-20260916.md` and built:
`tools/reels-feature.py` (Playwright + the installed Chrome drives the live
site's Portal headless: TERMINAL.EXE, ANTENNA 3 to CAB, RUN, the walk by the
Portal's own SCROLL/CLICK with a drawn cursor, the demo script; records the
monitor by CDP screencast and both glasses from the twin's canvases on one
clock) and `tools/reels_feature_cut.py` (the beat table → 1080x1920, monitor
on top, glass at 8x below, the name in the machine's font, the house sound,
the pop first). Data: `reels/features.json` (five rows, dates unset). First
cut reviewed: `OneDrive/WeirdBaby/reels/out/features/feature_tilt-drive.mp4`
(29 s) + its review sheet. Finding: the site's twin refuses Games (Mike's
08-20 "very limited" set) and the game pack is a parcel; the demo machine
lifts both; Sunday question 2 asks what the site does on a feature's day.
Needs the dev server running (`museum` in launch.json) and `pip install
playwright` (done on this PC). Open: the beat.

**2026-09-17, small hours (the second story).** Mike's eleven notes on the
first feature reel are the second story (`docs/FEATURE-REEL-20260916.md` §7)
and are built: no console, no cursor, boot into the noise, the walk at a
third of a second a press with the chyron blinking, the payload's pop and
sting, 1x then 2x then the crash into decelerating slow motion, the blinking
card, the loop; the zoom-in is channel 4's plate with the glass lit in its
aperture under the closed-circuit read; `\ROBOTS` small at the top. Second
cut 17 s, reviewed on its sheet, in OneDrive reels/out/features. His two
standing rules and the reel house rules are in memory. Open: the beat; the
branch indicator on the Q&A reel; chords on the music reels (logged).

**2026-09-17 (the third form).** Mike on the second cut: everything through
the front glass (inaccurate, not deceitful); the zoom-in is a zoom of the
monitor cropped to the unit alone, one position, no line; the end is a race
that accelerates into a car collision, WHAM, slow motion to a stop, GAME
OVER pops on, a beat, loop. Story §8, built, reviewed (a ghost of the
monitor's own glass under the drawn one was found on a full frame and
fixed: the glass is replaced, not lit over). Third cut 17 s in OneDrive
reels/out/features. The capture now drives the run to a collision (weave,
then hold the lane; restart if the road wins) and records the glass canvases'
page rects in index.json.

**2026-09-17 (A chosen; Mike's script, §10-§11).** The feature reel is now
the A layout only: monitor over the front-glass close-up (plate top through
the lettering to the window, the name on the plate's blank top), cutting to
the top-window close-up at the hand-off. The site gained the TILT CHYRONS
(PortalScreen.jsx/.css + both twin copies, robots 1df69fc): a cross beside
SHAKE, non-exclusive, lit from the twin's `tilt-state`, Up is gas (Tilt
Drive runs 1.8x). The capture's autopilot steers through them and counts the
cars passed; the reel overlays its own score (2740 + distance + 45 a car,
monotonic) and a NEW HIGH SCORE card; the race runs 5x to 10x from a
52-second run. Sunday question 2 still open. Open: the beat; the Q&A reel's
branch label.

**2026-09-17 (the click choreography, §12).** The twin (both copies) carries
a demo hook `Demo_Flash(y0,y1,ms,ph)` that inverts the selected front-glass
row and repaints while it lasts (robots 0c90db7, 194f140); the capture runs
Mike's choreography (arrive, beat, chyron lit + row inverted, silent click,
beat; the payload row flashes three times). The glass close-up is back to the
window filling the width; the cut picks the game over with the longest run;
the card's title is half size, the figure twice. Reviewed at 0.1 s over the
walk. Open: the beat; the Q&A reel's branch label; Sunday question 2.

**2026-09-17 (§13, four notes).** No redirect card (the payload's flashes cut
to the top window, name and pop land there); SCROLL lights 320 ms; the drawn
front glass follows the picture's jitter by phase correlation against a
reference frame and is clipped to the round window (disc r=70 view px,
feathered). Reviewed at 0.1 s over the walk and at full size on the glass.

**2026-09-17 (§14, ninety percent).** The top window's inside view is drawn
(darkness, grain, a recessed slab 1.25x the aperture, bevel, pixel pitch);
both drawn screens pass a barrel warp with a fringe (`lens()`); the autopilot
holds steering decisions 250 ms, eases off gas every few seconds and taps the
brake (the twin's Down is now a brake, robots 5548eb8). SED test: a second
feature, AvoidSteroids, captured and cut from the same template; findings in
the story's §14 follow-up.

**2026-09-17 evening: the game feature reels are PARKED** until the twin's
games are finalised (Mike). Punch list in the story §15 (barrel to a quarter,
glitch tracking on AvoidSteroids, top view higher, card jaggies, scripted
gameplay per story shape, gas display, the slab through the lens, slower
steering display). Suggested next: the `ask` story shape on MGK-NIAC (a
finished feature), which is also the mashup with the Q&A line.

<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# HANDOFF — 2026-09-10

## THE RESET (Mike, 2026-09-10) — read before anything below
Opening Day is **2026-10-30**. The site goes back to "not open yet" until
then (low priority; when the site is next touched). The robots wing becomes
an infomercial for the device; the story is a prologue. Ops writes the
Records and runs the calendar. Nothing built on the 60-day story is sacred:
a burn list, ruled in batches. The plan, with seven weekly milestones and
counted deliverables, is `docs/PLAN-20260910-OPENING-DAY.md` (served:
`docs/desk/PLAN.html`). Everything below that assumes week two starts 09-14
is superseded by it.

## LIVE
Museum `318cd81`, stage `launch`, deployed 2026-09-07T00:11:41.984Z by Mike
on clock day (`docs/DEPLOYED.md`). It carries his rewrite of Records 001
and 002. Door checked cookie-free after the deploy: held sample 404, stage
launch, open false. Nothing waits on a deploy.

## NEXT ON THE CLOCK
- **2026-09-07 17:00 America/New_York:** Record 001 posts and the wing opens
  itself. No deploy, no hand. `npm run reveal:day` reads nothing to move.
- **2026-09-09 17:00:** Record 003 posts. The five manual scans are off it and
  scan-31-a is dead; nothing that replaces them is built.
- **Week two (from the 14th):** two lanes, ruled 09-02: the Record (five
  entries, the site posts them) and Mike playing (five short reels, Mike
  posts them). No week-two Records, no calendar yet; the calendar can be built.
- **Sunday 09-06 is clock day** (Mike's rule): nothing is worked on before
  then because of the date. All six pillar briefs are ruled; the rulings and
  what each changes are in `docs/PILLARS_RULINGS-20260902.md`.

## MIKE OWES
- **This weekend (his word, 09-03): the Buffer setup**, six clicks in
  `C:\AI\PERSONA-20260903\BUFFER-SETUP.md`: Instagram to Creator, TikTok
  Creator and public, a Facebook Page, connect four channels in Buffer
  Essentials, an API key into `C:\AI\PERSONA-20260903\.secrets\buffer.token`.
  The queue (`tools/reels-queue.mjs`) is built and waits on the key; week
  two's four Coconuts reels are in the packet.
- Record 001 edits in the day editor, unlanded and expected; leave
  `docs/dictation-20260807/` alone and do not run `record:land` or `day:proof`.
- The paragraph that replaces the April vision; his words stand meanwhile in
  `docs/canonical/WHAT_WEIRD_BABY_IS.md`.
- After Sunday, in his words: the Foundation room's copy (a posture, no
  pipes; National Coalition), the robots FAQ's buying line (not for sale
  during the story), the About-the-Artist words on `/wb`.

## THE REEL LINE AND THE DESK (built 09-03 evening, all committed)
- `reels/README.md` is the manual: questions → build → queue (Buffer) →
  pull. Week two's four Coconuts reels are built and in the OneDrive packet;
  the queue waits on Mike's Buffer key (his weekend). Cut-over steps are in
  the README. Post times: Number 12:00 NY, Determination 17:00 NY.
- `npm run costs` (ledger `ops/costs.json`); a scheduled task
  `weird-baby-monthly-costs` runs the review on the first of each month at
  09:00 and sends Mike the report. `npm run desk` is the clean desk
  (`docs/desk/DESK.json` holds the pillar lines; keep them current).

## OPS OWES
- The System, what remains: narrow the provenance gate to Mike's words and
  the scroller (after the 7th); source-file comments quoting old numbers
  (after the 7th). Done 09-02 late: the museum's STATE.md cut from 196 KB to
  7 KB; Mike's 23 unique standing rulings carried whole into
  `docs/canon/11-STANDING-RULINGS.md`; the ledger archived at
  `docs/archive/STATE-FULL-b0525f0.md`. Done 09-02: the robots round documents (53
  archived), the album mirror, the robots STATE.md cut from 608 KB to 11 KB
  (`robots:docs/archive/STATE-FULL-9655fa5.md`, Mike's words re-quoted in
  `STATE-mike-verbatim.md`).
- The arc, Mike 09-02 (`docs/ARC.md` §6): the story explains the device;
  every feature, program, adjustment, manual portion and artifact can be a
  day. Ops owes: once the manual is written, a pass that uses it as the
  publishing guide for the device Records, and a first fill of the ledger's
  `when` column by that rule.
- The reveal choreography is ruled (A, third cut): `reveal/schedule.json`
  is the ruling. Done 09-06: the ledger's `when` is filled from it; every
  schedule row is tagged `reel: feature | site` under Mike's ruling B on
  the Never-Advertised law (canon 11, ruling 24); the determination ledger
  carries each day's `frame` (on camera) and `site_only`; the TikTok
  operating definition is rewritten whole
  (`release/specs/SPEC-tiktok-operating-definition-20260906.md`). Still to
  brief: the ZIP browser (in-story surface, no download).
- The manual: Mike's ruling A (Ops drafts by section). The register test is
  served (`C:\AI\REVIEW-20260902\register-test.html`); his pick is pending.
  The facts sitting is CLOSED (rulings in `docs/PILLARS_RULINGS-20260902.md`,
  "The manual's facts sitting"): the firmware rules for the machine's facts;
  all 26 answered; the seven first-boot questions answered. Writing starts on
  his register pick: Sections IV, VI, VIII and Appendix B rewritten in that
  voice, then the unwritten sections drafted against the rulings, served as
  rendered pages. Masters regenerate after 09-09.
- After Sunday, robots repo: the Everyday takes serial −01 and the Housewife
  Nano moves to −02 (`unit_registry.csv`, the STATE registry, the built
  `units/02` directory); the twin's wake-order race is fixed (two awaits) so
  the front glass wakes first as canon says; the canon catalogue's CONFLICTS
  and HOLES entries touched by the sitting are marked ruled.
- Branch `zip-and-parcels` (pushed) holds the first two modules of the build
  brief (`docs/archive/burn-20260911/briefs/BUILD-BRIEF-day-gating-and-zip-20260902.md` (archived 09-11; the mechanism is burned)): `src/lib/schedule.js`
  and `src/lib/twin-keys.js`, unwired, lint clean. Next on it, after Sunday:
  per-row parcel keys in the twin, the query parameter, the ZIP browser route.
  Main carries none of it.
- Done 09-06: `R()` takes `when` from `reveal/schedule.json` by id; 47 rows
  carry a week; reveal:check passes. The 13 schedule entries with no ledger
  row (personas, engines, objects, appendices) are schedule-only. Pass 5 ruling (Mike, 2026-09-02): the desk stays for the Record editor;
  the light table stays; facts, assets and reveal instruments are Ops' to keep
  or drop.
- Guard 6 blocks four of five Record entries from landing; ruled a bug or a rule (Sunday).
- The week-two calendar: two rows, five columns, conversational; buildable now.
- Repoint the Foundation's roster entry and held donate link from the New
  York coalition to the National one (`nationalhomeless.org`; details in
  PILLARS_RULINGS 4bB). Src; after Sunday.
- `C:\AI\mirror_vol1_backup.ps1` mirrors the album folder to OneDrive with a
  manifest (first run 2026-09-02, 45 files, deposit set verified). Re-run after
  any change to the album folder; it is not scheduled.
- Later briefs, one each: the five April laws; the twin behind the door and
  which twin copy is master; the 489 asset verdict fields.
- `docs/ARC.md` prints MON for Record 001 whatever the epoch says (archive row D-a).
- `npm run desk` still renders the retired register.

The review and the one-page view: `C:\AI\REVIEW-20260902` (`pillars.html`).
Quarantine: `C:\AI\_QUARANTINE-20260902`, delete on or after 2026-10-02.
