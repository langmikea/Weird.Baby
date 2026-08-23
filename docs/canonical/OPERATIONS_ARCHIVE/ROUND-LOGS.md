> Cut from `docs/canonical/OPERATIONS.md` — the round-log preamble (the `Last verified against live tree` chain) — at HEAD `b3812cc`.

**Last verified against live tree:** 2026-08-09 (THE RECORD EDITOR — five
instructions, all five done. Gates: lint **11/9 = baseline** · build green ·
**launch build green** · provenance **PASS** (13 stale rows pruned, 0 chains
broken, 0 rows changed) · `reveal:check` **PASS** · `parity:gate` **PASS** ·
`instory:gate` **PASS** · `assets:orphans` **0/0** · `reveal:day` **nothing to
move** · **the lap RAN at 390px and 1216px** on five museum routes and on the new
editor page, page overflow 0, console errors 0 · `lap:clean` done.
**MIKE RETIRED THE TWO-COLUMN WORKSHEET AND EDITS THE RECORD ITSELF** —
`docs/dictation-20260807/record.html` draws the museum's own `RecordEntry` and
`RecordIndexRow` through the preview bundle and makes the museum's own paragraphs
`contenteditable`, so **there is no second copy of his text anywhere on the
page.** **THE FIDELITY IS MEASURED AGAINST THE LIVE PAGE:** at 390px both give
`.vp-flat` **344.56px** and a body of **15.3408px**; at the operator's width both
give **838.66px** and **15.4031px**. **NOTES TO OPS ARE CURLY BRACES NOW** and the
`[MIKE-NOTE]`/`[OPS]` red-and-blue inline scheme is **deleted rather than left
dormant** on his ruling — *"that was Ops answering in the wrong place."* **TWO
GATES, BOTH PROVED BY BREAKING THEM:** `reveal:check` on every packet over the
Record's own strings, and `wb-ops-braces` on every launch build over every string
literal under `src/`. **The launch gate reads the SOURCE and not the bundle and
that is forced, not chosen** — compiled JavaScript is made of braces — and what
that costs is stated in the code. **HIS EIGHT NOTES LEFT `robots.js` WHOLE AND
VERBATIM** and are carried into the editor's seed in braces at the paragraph they
followed. **E3 IS A MEASUREMENT:** 11 of 13 answered worksheet slots were already
in the Record character for character, and the only lines that were not are
exactly those eight notes. **E4's CHANGES ARE NOT ON DISK** — `answers.json` and
the rescue dump are byte-identical — so the migration also runs IN THE PAGE
against the worksheet's own `localStorage` key, which a `file://` page shares.
**E5 WROTE INTO ALL 36 FIELDS AND COPIED:** 0 mismatches, 0 strings missing from
the paste, header and list both 39 notes, and `record:land --verify` round-trips
78 of 78 strings. **THE PROOF FOUND FIVE DEFECTS AND FOUR WERE INVISIBLE**, the
two worth carrying being that **`innerText` returns what CSS DISPLAYS** (a
`text-transform: uppercase` heading came back upper-cased and would have landed
in `robots.js` as an edit nobody made) and that **`requestAnimationFrame` does
not fire in a tab that is not being painted** (the editor drew perfectly in a
background frame and wired nothing, with no error anywhere). **Nothing was
deployed.** Round log: `docs/MUSEUM_RECORD_EDITOR_LOG-20260809.md`.)
Previously 2026-08-09 (THE RECORD LANDING + THE ALBUM
ART — seven instructions, all seven done. Gates: lint **11/9 = baseline** · build
green · **launch build green** · provenance **PASS** · `reveal:check` **PASS** ·
`parity:gate` **PASS** · `instory:gate` **PASS** · `assets:orphans` **0/0** ·
`reveal:day` **nothing to move** · **the lap RAN at 390px and 1228px** on five
routes, page overflow 0, broken images 0, console errors 0 · `lap:clean` done.
**RECORDS 001–005 ARE ON THE WALL**, dated from `recordDay(n)` off the one epoch,
and **013 is untouched**. **THE ENTRIES ARE GENERATED RATHER THAN RETYPED** —
`tools/dictation/emit-record-entries.mjs` cuts the rescued boxes by the
worksheet's own capitals rule and `--verify` strips the paragraphing back out and
compares: *every box round-trips, his characters unchanged.* There is no
transcription step for a character to go missing in. **001's BODY IS HIS LONGER
DRAFT** — it gains SATURDAY/SUNDAY and MONDAY DAY(0), and *"was made made"* is
*"was made"* in it, so **the doubled word was his and so is the correction.**
**HIS NOTES SHIP IN RED AND OPS' ANSWERS IN BLUE, INLINE, ON HIS RULING** —
`[MIKE-NOTE]` and `[OPS]` are whole-paragraph marks that never print, 5 red and 3
blue measured on the built bundle. **`[PAPA]` COULD NOT DO THIS AND THAT IS WHY
THERE ARE TWO SCHEMES:** a `[PAPA]` sentence is LIFTED OUT beneath the page; these
must stay where he wrote them, because a question and its answer four screens
apart is not an answer. **THE ENTRIES THEREFORE READ DIFFERENTLY IN THE TWO
STAGES — his instruction, not a defect** — and N3's identical-copy principle has
its first declared exception. **THREE MECHANISMS KEEP THEM OUT OF A LAUNCH
BUNDLE and the third cannot be reasoned wrong:** the renderer drops them, the AST
pass empties the literal, and **`wb-dev-mark-guard` reads the launch build's own
output and fails on a hit — proved by removing the strip and watching it name 13.**
Measured on the real launch bundle: zero literal markers, zero of his note text,
his story text intact. **TWO ENTRIES LANDED AND DREW NOTHING AT ALL, AND ONLY THE
LAP SAW IT:** `scrubFace`'s entry filter knew `line` and `lines` and **not
`sections`**, so 004 and 005 — no headline by his ruling, body entirely sections —
were filtered out and never drew an index row while every gate passed. S-c's shape
one floor down. **THE ALBUM ART IS MEASURED, NOT EYEBALLED:** Georgia 157 / track
17 identified by pixel IoU **0.945** against his own `NEW Robots.png`, Courier New
for the sub-line, and **the circle is closed with its own ink** — the three arcs
rotated about the fitted centre, 16,608 pixels painted in with six degrees of
overlap so the tapers are buried. No photograph. **The one collision is named
rather than absorbed:** MGK-VIIIp's descender clears his measured rule by **5px**
(`L-d`). **THE PRUNE HAZARD FIRED EXACTLY AS §9 DESCRIBES** — replacing 001's body
staled four rows and pruning them broke the approved index line's RESTATED chain,
repointed onto the same two paragraphs in the draft that replaced them. **And the
register nearly lost its own shape:** rows live under `.entries` and a first pass
wrote 43 at the top level — caught by the gate, then verified 43 added, **0 lost,
0 changed**. **Nothing was deployed.** Round log:
`docs/MUSEUM_RECORD_LANDING_LOG-20260809.md`.)
Previously 2026-08-09 (THE WORKSHEET EXPORT — five
instructions, all five done, and **the diagnosis did not land where the brief
pointed.** Gates: lint **11/9 = baseline** · build green · provenance **PASS** ·
`reveal:check` **PASS** · `parity:gate` **PASS** · `instory:gate` **PASS** ·
`assets:orphans` **0 judged, 0 unjudged** · `reveal:day` **nothing to move** ·
**the lap RAN at 390px and 1228px on all ten Ops pages**, 20 measurements, every
one clean. **THE EXTRACTOR WAS WRITTEN BEFORE ANYTHING WAS DIAGNOSED** —
`tools/dictation/RESCUE.md`, a console snippet that takes EVERY key in the store
without filtering, because a rescue that only takes what the rescuer expects to
find is not one. **ALL FOUR CANDIDATES IN THE BRIEF ARE FALSE OF THE BUILD ON
DISK, MEASURED:** 41 slots declared and 41 rendered, one key, and a timestamp
taken at the press (`captured 2026-08-09 10:00` on a full run). **THE ONE LINK
NOBODY HAD EVER MEASURED WAS THE CLIPBOARD** — `writeText` rejects with *Document
is not focused*, and the fallback then reported success on
`document.execCommand("copy")`'s return value, **which says the command was
ENABLED and not that the clipboard changed.** Three identical pastes days apart,
frozen at 2026-08-07 17:04, is exactly what an unverified write produces. **It is
stated as the cause the evidence supports and not as a certainty**; what is
certain is that the tool claimed a success it never checked, and that is now
impossible. **TWO MECHANISMS SO IT CANNOT RECUR:** `assertSlotsMatchPage()`
reads the generated HTML back and REFUSES to write a page whose textareas and
whose `SLOTS` array differ (proved by breaking it), and the collector walks
**file → store → live boxes**, printing a retired slot rather than dropping it.
**THE COPY BUTTON READS THE CLIPBOARD BACK** and never says *Copied* on an
unverified write. **THE BRIDGE IS BUILT** — a `Save to the repo` button writing
`docs/dictation-20260807/answers.json` through `showSaveFilePicker`, the handle
remembered in IndexedDB so it is one click after the first, falling back to a
download that says where it went (proved). **AND THE SECOND DEFECT WAS THE OTHER
DIRECTION:** a rebuild does NOT destroy his content (42 answers survived one,
measured) — the risk was that his words lived in ONE browser, so the generator
now bakes the answers file into the page and a wiped store still opens on all of
them. **Mike's own `file://` storage was never touched by this round**; every
test ran on a different origin. **Nothing was deployed.** Round log:
`docs/MUSEUM_WORKSHEET_EXPORT_LOG-20260809.md`.)
Previously 2026-08-09 (CLEANUP — four instructions,
all four done, and **nothing in the round is waiting on Mike.** Gates: lint
**11/9 = baseline** · build green · provenance **PASS** · `reveal:check` **PASS**
· `parity:gate` **PASS, 4 shared · 0 divergences** · `instory:gate` **PASS** ·
`assets:orphans` **0 judged, 0 unjudged** · `reveal:day` **nothing to move** ·
**the lap RAN at 390px and 1228px on all ten Ops pages** — 20 measurements, page
overflow 0, uncontained 0, leaf text overflow 0, broken images 0, console errors
0. Nothing in `src/` changed. **THE LAST COPY OF THE ELEVEN PHOTOGRAPHS IS
DELETED** — `C:\AI\Projects\_review\` removed whole, and a find across
`C:\AI\Projects` for all eleven filenames returns nothing (`L-b`). **THE ORPHAN
CHECK HAS NEVER REPORTED A ROW IN ITS LIFE, AND THAT IS SHARPER THAN EITHER ROW
THAT RAISED IT** — `--orphans` counted `missing && isJudged`; **no missing row in
this table has ever carried a judgement**, so its population was empty by
construction and a reading of 0 was indistinguishable from a clean table. It
counts `missing` now and GRADES the result: **JUDGED** (an inspection is at
stake — C32, unchanged) and **UNJUDGED** (dead bookkeeping). On the unchanged
table it went from **0** to **27**; `L-a` predicted 24 and `K-a` predicted 3, and
neither knew about the other. All 27 culled after inspection — 24 manual pages at
a path the re-rendered document left, 2 public-side twins behind the stage door,
and `faq-cover.png`, whose `role: shipped` and `usedBy` were **stale** and which
`src/` references nowhere. Table 277 → **250, every row on disk**. **DOCTRINE 26
IS THE ROUND'S RULE:** *lead with what he must do or decide* — the test is not
*is it true* and not *is it interesting*, it is *does this change what he does
next?* Measurements and craftsmanship go in the log; **an empty ask is a complete
report.** It is Doctrine 25 for prose and carries the same construction clause.
**THE REGISTER LOST SIX ROWS AND THREE SHORT-LIST LINES AND HAD SEVEN REPAIRED IN
PLACE** — and **two of the three short-list lines were still asking questions
that had answers** (8 → M25, closed at N4 by subtraction; 63 → M92, resolved at
N2 in a third direction), which with 15a is **four instances in two rounds of the
same failure: a row closes and leaves, and the short-list line that pulled it out
stays behind.** Seven `(orig)` rows had no parent left and were renamed to their
plain ids; two rows that are linked to carried no anchor. **Dead intra-file links
0.** **M99 CLOSES AND THE SECOND DECLARER IS GUARDED** —
`reveal/ledger-declare.mjs --write` now diffs `ledger.json`'s row ids against its
own and refuses, the same shape as `assets-declare.mjs`; **drift measured zero
before it was written**, which is the argument for adding it then rather than
after 45 rows, and it was **proved by injecting a hand-added row.** **M84 was not
closed by a fix but MOVED** — it carried *"nothing to decide"*, and a note is not
an open action; it is a §8 hazard now, where the round it warns will read it.
**Nothing was deployed.** Round log: `docs/MUSEUM_CLEANUP_LOG-20260809.md`.)
Previously 2026-08-08 (THE LIGHT TABLE — four
instructions, all four answered. Gates: lint **11/9 = baseline** · build green ·
provenance **PASS** · `reveal:check` **PASS** · `parity:gate` **PASS, 4 shared ·
0 divergences** · `instory:gate` **PASS** · `assets:orphans` **0** ·
`reveal:day` **nothing to move** · **the lap RAN at 390px and 1228px on all ten
Ops pages**, page overflow 0, uncontained 0, leaf text overflow 0. Nothing in
`src/` changed. **C-a IS RULED AND EXECUTED** — the 27 calibration frames,
`cal.json` and the `_cal` folder, 28 files and 3.20 MB, with the 27 asset-table
rows culled; **they were never in git** (`content/burps/.gitignore` covers the
whole burp tree), so a 3.20 MB deletion leaves a clean `git status` and no object
to restore from. **THE GLOVE QUESTION IS SHUT AND THE ANSWER REVERSES THE CULL
ROUND’S FINDING** — the three burp MP4s ARE the glove videos, so the KEEP clause
was satisfied all along and the footage survived as sources; the search failed
because it looked for a filename. **THE ARTIFACT TRACKER IS A LIGHT TABLE** —
250 tiles, a picture leading each one, a viewer that opens the real file from
disk at full size with every column the old page carried beside it; **the
population widened on Mike’s own sentence** (*"only what still exists"*), because
everything the cull touched has no public address and the old 47-row set could
not have shown a post-cull anything. **A FAILURE SAYS SO**: an unreadable file
prints the path it tried and falls back to the thumbnail, proved on purpose.
**DOCTRINE 25 IS THE ROUND’S RULE AND THE MEASUREMENT IS ITS ARGUMENT** — the
first usable control sat **2014px** down the tracker, 2474 down the spec sheet,
1524 down the worksheet and 1537 down the register at 390px; now 126 · 727 · 219
· 398. **Almost nothing struck was WRONG — what was wrong was where it was**, so
the rule carries a construction clause: on the field, in the footer, or on
`reference.html`, never above the work. **Doctrine 24 was applied inside the
instruments**: short-list row **15a was still asking him to rule on eleven
photographs he ruled deleted on 2026-08-07**, citing a `C-a` the cull round had
re-used for a different question. **TWO FINDINGS NOBODY ASKED FOR:** a **27px
page-level sideways scroll on the contact sheet that read as zero uncontained**,
because a box-based overflow check cannot see overflowing TEXT; and **24
asset-table rows pointing at a manual that moved**, invisible to
`assets:orphans` because it counts `missing && isJudged` and all 24 are unjudged
(`L-a`). **Nothing was deployed.** Round log:
`docs/MUSEUM_LIGHT_TABLE_LOG-20260808.md`.)
Previously 2026-08-08 (THE CULL — **two of four
instructions done completely and two not started, said first because it is the
honest part.** Gates: lint **11/9 = baseline** · build green · provenance
**PASS** · `reveal:check` **PASS** · `parity:gate` **PASS** · `instory:gate`
**PASS** · `assets:orphans` **0** · `reveal:day` **nothing to move**.
**ELEVEN VIDEO-DERIVED STILLS ARE DELETED** from the robots repo — six burp
frames and five 2021 plates, 725 KB — on Mike's mechanical rule, with `P01`
kept because an egg row references it. **THE FINDING IS WHAT THE RULE WOULD HAVE
DONE IF READ THE OBVIOUS WAY:** `usedBy` is **empty on all 139 robots-repo rows**
including the 61 manual pages, so a cull keyed on the asset table **would have
deleted the manual.** The scan was done from SOURCE across both repos (691 files)
instead. **27 calibration frames were NOT deleted and are listed for him** —
referenced only by their own sidecar manifest, which nothing reads; certain
origin, judged usage, so C1's safety clause applies (`C-a`). **THE GLOVE VIDEOS
ARE IN NEITHER REPOSITORY** — no `.MOV` anywhere and no file named for them.
**DOCTRINE 24 IS RECORDED AND WAS APPLIED THE SAME DAY:** `OPEN_ACTIONS.md` went
**801 → 386 lines**, 59 closed rows and 8 whole closed-round sections out of his
view into `docs/OPEN_ACTIONS_CLOSED.md`, which is **not on the Ops desk**; 67
dead intra-file links flattened rather than left dangling. **C3 (the light table)
and C4 (the preamble audit) are NOT STARTED** — a cull is irreversible and a
tracker is not, and half a light table is worse than none. Round log:
`docs/MUSEUM_CULL_LOG-20260808.md`.)
Previously 2026-08-08 (TIGHTEN THE RECORD — five
instructions, all answered, and **the largest finding is that the leading was
the smallest of the four costs he named.** Gates: lint **11/9 = baseline** ·
build green · provenance **PASS** · `reveal:check` **PASS** · `parity:gate`
**PASS, 4 shared · 0 divergences** · `instory:gate` **PASS** ·
`assets:orphans` **0** · `reveal:day` **nothing to move** · **the lap RAN at
390px and 1228px** on five routes, page overflow 0, uncontained past the edge 0,
console errors 0. **THE RECORD HAS ITS OWN RHYTHM LADDER NOW** — R1's
`--rh-*` paces every flat face, so tightening it would retune four wings to
answer a complaint about one; `--rec-hug/-para/-block/-sect` (0.30/0.40/0.55/
**1.15**, against the house's 2.6 for a section) are Record-only and inert
elsewhere. **THE FOUR COSTS HE NAMED, IN HIS ORDER:** dateline rule → headline
26.07 → **18.22px**, headline → first heading 40.03 → **17.70px**, paragraph to
paragraph 8.46 → **6.16px**, above/below a section heading 40.02 → **17.70** and
10.70 → **6.54px**. **LEADING 1.45 → 1.40, AND THE FLOOR IS 1.35 BECAUSE OF THE
MEASURE RATHER THAN THE FACE** — the eye returns along the leading and a
68-character line needs more of it than a 45-character one; the last 0.05 is in
hand (`A-b`). **RESULT, PAIRED IN ONE PAGE LOAD:** the opened entry **−15.0% at
1228px and −12.4% at 390px**, the dateline-to-first-word distance **−27%** at
both, and **characters per line UNCHANGED at 70.8 / 40.4** — 68ch is 68
characters whatever the leading. **THE A/B METHOD IS THE OTHER FINDING:** the old
rules were injected as a stylesheet into the same page and removed again, because
run-to-run wrap noise had already produced a before-figure wrong by a whole line
(126.73 against 110.68 for one build). **`A-a` CLOSES BOTH WAYS** — the typewriter
stays on the dateline, the stamp and the mark rail, because the Record's register
governs the writer's words and the machine's own marks are a different voice.
**Nothing was deployed.** Round log: `docs/MUSEUM_TIGHTEN_LOG-20260808.md`.)
Previously 2026-08-08 (ATTACHMENTS + THE EMAIL-LIKE
REGISTER — seven instructions, all answered, and **the first one is a boundary
that governed two decisions the rest of the brief would have pushed the other
way.** Gates: lint **11/9 = baseline** · build green · provenance **PASS** ·
`reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** ·
`instory:gate` **PASS** · `assets:orphans` **0** · `reveal:day` **nothing to
move** · **the lap RAN at 390px and 1228px** on five routes, page overflow 0,
uncontained past the edge 0, console errors 0. **THE RECORD IS EMAIL-LIKE AND IS
NOT AN EMAIL PROGRAM** — Mike's own boundary, and what is borrowed is the
register and the attachments-at-the-bottom convention and nothing else; a count
badge and a per-row open control were both considered and refused as mail chrome.
**S-c AND D-b CLOSE:** `wire`, `plates` and `docs` draw as ONE shape at the foot
of a long-form entry — a small preview icon, a name, a line of detail — with the
payload's own words (a transmission's lines, a document's extract) **inside** the
row rather than behind it, because R4 binds this surface too. **AND "nothing
drops silently ever again" IS A GATE:** `reveal:check` fails the packet by name
on any entry field nothing renders, proved by breaking it. **A3 IS LAW —
Doctrine 23** — plain Arial-class sans, bold at most, no display faces, no
ornament; `--wb-plain` is a system stack and loads no font. **THE DENSITY IS
MEASURED AND IT ANSWERS ONE HALF OF HIS COMPLAINT WITH NUMBERS AND THE OTHER WITH
HIS OWN CHOICE OF FACE:** +11.1% lines per screen at both widths, the opened
entry −6.8% at 1228px and −10.3% at 390px, index rows −4.9% to −16.6%, and
**characters per line UNCHANGED at 70.8** — R4's 68ch survives by construction
because `ch` is relative to the face. The one thing that moved against
readability is the leading (1.62 → 1.45) and it is named, not buried (`A-a`).
**A4's ANSWER IS THE SCOPING:** the index row is built from the SHARED
`.vp-fe-*` classes, so every new rule sits inside `.vp-rec-index` and the bare
rules are untouched — proved with a cascade probe in the live document (inside:
Arial; outside: Syne and Fraunces, unmoved). **AND THE FIRST CUT MADE THE INDEX
WORSE**: a padding rule reaching for density outranked `.vp-rec-row{padding:0}`
and added fourteen pixels to every row (93.13 → 102.6 → 88.66). **Nothing was
deployed.** Round log: `docs/MUSEUM_ATTACHMENTS_LOG-20260808.md`.)
Previously 2026-08-08 (THE DATE + THE LIVE PREVIEW —
six instructions, all six answered, and **one of them rests on a premise that is
not true of this tree.** Gates: lint **11/9 = baseline** · build green ·
provenance **PASS** · `reveal:check` **PASS** · `parity:gate` **PASS, 4 shared ·
0 divergences** · `instory:gate` **PASS** · `assets:orphans` **0** ·
`reveal:day` **nothing to move** · **the lap RAN at 390px and at the operator's
own 1228px** on four routes and all four Ops pages, page overflow **0**,
uncontained past the edge **0**, console errors **0**. **THE STORY RUNS ON REAL
DATES AND RECORD 001 IS 2026-08-17** — Mike's rule above his date: *an entry's
date is the actual calendar day it is published, not a fictional offset.* It is
**one constant**, `RECORD_EPOCH`, read by the entry's `date`, the face's
`recordEpoch` and every day of the worksheet's outline, **and the one-field claim
was proved rather than assumed** — one date-shaped literal in the file, both
consumers identifier references, and the two-literal failure demonstrated
(*"Week 2 · Monday · Record 001"* on day one, with nothing reporting it).
**C8 closes** after three rounds of being sharpened without moving; **the month
band did NOT turn on and that is stated** — `shouldBand` wants fourteen entries
across more than one month and the volume holds two (`C1`). **His own text
checks out**: the 17th is a Monday and his `FRIDAY DAY (-3)` lands on a Friday.
**D2 REMOVED `lead || line` AND RECORD 013 COULD NOT BE REACHED BY IT** — 013
declares both fields and always took the left-hand side, so 001 now opens on
Mike's own EXECUTIVE SUMMARY heading and 013 is byte-for-byte where it was
(measured: its lead still draws at 100.32px). **THE LIVE PREVIEW RENDERS THE
MUSEUM'S OWN COMPONENTS AND THE LAYOUT CHOICE IS ARITHMETIC** — the ramp is
`clamp(1.02rem, min(1.35vw, 4.4cqh), 1.28rem)`, a function of the VIEWPORT, so a
preview is exact only at the width the museum would have; a pane beside the form
is a different size, measure and wrap. **`RecordIndexRow.jsx` was extracted for
it**, because half of what he writes lands in a row that was JSX five levels deep
in a `.map()` and a copy of it would drift silently into a preview he has been
told to trust. **AND THE FIRST CUT WAS 0.4% WRONG UNTIL THE LAP MEASURED IT:** a
bar above and an editor below left the frame 368px tall, `4.4cqh` fell under
`1.35vw`, the clamp hit its floor, and the body drew at 15.3408px against the
live 15.4031px. The frame is the whole window now and the strips float over it.
**D6's PREMISE DOES NOT HOLD — there was no legibility round**; the previous
round touched no stylesheet, and the answer is the mechanism instead (the preview
is built FROM `Exhibit.css`, so A4's `.94` and R4's 68ch are both measured
present and any future change arrives free). **Two findings nobody asked for:**
the preview's first build config copied `public/held/` — the stage door's
sixteen photographs — into `docs/`, and its first bundle carried both copies of
React and would have thrown `process is not defined` on the first render.
**Nothing was deployed.** Round log: `docs/MUSEUM_DATE_PREVIEW_LOG-20260808.md`.
Fidelity note: `tools/dictation/preview/README-fidelity.md`.)
Previously 2026-08-08 (THE INDEX LINE + THE WARNING —
three instructions, all three answered. Gates: lint **11/9 = baseline** · build
green · provenance **PASS** · `reveal:check` **PASS** · `parity:gate` **PASS, 4
shared · 0 divergences** · `instory:gate` **PASS** · `assets:orphans` **0** ·
`reveal:day` **nothing to move** · **the lap RAN at 390px** on `/robots` and on
all four Ops pages, page overflow **0** everywhere and **0 uncontained** painting
past the edge, zero console errors. **RECORD 001's INDEX ROW HAS A SUMMARY AND
IT IS FILED RESTATED RATHER THAN MIKE, WHICH IS THE WHOLE OF I1'S HONESTY.** His
approval is not his authorship: every specific in the sentence is in two of his
own paragraphs two fields below it, so it resolves to them, and **a paraphrase
filed as his words is indistinguishable from something he said a week later.**
**THE MEASUREMENT S-b CARRIED FOR THREE ROUNDS IS NOW THE OTHER WAY ROUND** — at
the 1247px measure the budgets were taken at, 013 and 001 are **94.39px each,
0.00px apart**, which is R3's rule satisfied exactly; at 390px they are 24.24px
apart, one line of wrap, down from 73px, and **that residual is arithmetic
rather than a defect** (a budget makes a string fit a measure; it cannot
equalise two lengths at a narrower one — `I-b`). **I2's DEFECT WAS A MISSING
QUESTION AND NOT ONLY A MISSING COUNTER:** `EXEC` is unbounded and correct, the
constrained field is the index row's `line`, and **the worksheet never asked for
it at all** — so he wrote a 477-character paragraph, Ops had nothing to put in
the row, and a meter on `EXEC` would have policed a field with no limit while
still never asking for the one that has one. **THE NUMBERS ARE IMPORTED NOW** —
`reveal/record-shape.mjs`, three readers, no retyped copy — and the instrument
**warns without blocking**, with the over-limit number travelling into the paste.
**I3 IS SEVENTEEN CONSTRAINTS AND SIX OF THEM ARE SILENT**, the worst being the
date format, which now has its own format-checked slot and is the last thing
`C8` waits on. **AND THE LAP CAUGHT A BUG THAT WOULD HAVE MADE THE WHOLE FEATURE
INVISIBLE AT THE ONE MOMENT IT MATTERED** — the warning's class `over` was the
counter's own state class, so `.over{display:none}` hid the live count exactly
when it went over budget. Two correct declarations; the collision exists only in
the cascade. **Nothing was deployed.** Round log:
`docs/MUSEUM_INDEX_LINE_LOG-20260808.md`.)
Previously 2026-08-07 (THE NIGHT DESK — four
instructions, all four answered, and **the headline one asked for text that does
not exist anywhere this session can reach.** Gates: lint **11/9 = baseline** ·
build green · provenance **PASS** · `reveal:check` **PASS** · `parity:gate`
**PASS, 4 shared · 0 divergences** · `instory:gate` **PASS** · `assets:orphans`
**0** · `reveal:day` **nothing to move** · **the lap RAN at 390px on the built
bundle for `/robots` and on both new Ops pages**, zero page-level sideways
scroll, zero console errors. **S2 ASKED FOR MIKE'S DAY-ONE REPORT "EXACTLY AS HE
WROTE IT, VERBATIM" AND ONLY A PARENTHETICAL OF ITS TIMELINE REACHED OPS** — the
prose is not in the museum tree, not in the robots repo and not anywhere under
`C:\AI\Projects`. So the round did what K5 did: **built the frame, filled every
slot it genuinely had material for, left the rest empty, and printed the gap at
the top.** **RECORD 001 EXISTS**, carrying his headline and his eight timeline
beats and **no `line`, no `lead`, no `tomb` and no `date`** — every one of those
would be Ops writing his report for him, and a plausible executive summary of a
report nobody has read is *"436 records, kept since January 2024"* in a new coat.
**THE SECOND ENTRY TURNED ON THREE CONTROLS THAT HAVE NEVER DRAWN** —
`RecordJump`, the ‹ NEWER / OLDER › walk and the `2 of 2` count, all gated on
`list.length > 1` and dead since M5 — **which was not a goal and only the lap
could have seen it. AND THE LAP MEASURED THE COST OF THE MISSING SUMMARY RATHER
THAN ASSERTING IT:** 013's index row is **157px** and 001's is **84px**, against
Mike's own rule that all rows are the same height (`S-b`). **ONE QUESTION DECIDES
WHETHER THE ENTRY STAYS AND IT IS `S-a`:** whether the launch report is in-story
or is a real infrastructure report about deploying this website — the second is a
line whose subject is the making of the museum, which Doctrine 11 refuses however
true it is. Built on the first reading, **undeployed**, so a wrong reading costs
one deletion. **S1's DESK IS EIGHT INSTRUMENTS BEHIND ONE SHORTCUT** and its own
§5 row carries the rules; the one worth reading first is that **it refuses to
draw a link to a file that is not on disk.** **NOTHING WAS DEPLOYED AND THAT IS
S3:** the packet is sealed and the hand-off is one command. **AND THE ROUND
EXPOSED A DEFECT NOBODY ASKED ABOUT:** a Record entry that declares `sections`
**silently drops `wire`, `plates` and `docs`** — the long-form renderer draws
none of them and reports nothing (`S-c`), the same shape as the three
`deliveryFaults()` checks that all walked FILES. Round log:
`docs/MUSEUM_NIGHT_DESK_LOG-20260807.md`.)
Previously 2026-08-07 (THE REVEAL MECHANISM + THE
12-WEEK TABLE — four instructions, all four answered, and **the headline one asked
for a mechanism that already existed.** Gates: lint **11/9 = baseline** · build
green · provenance **PASS** · `reveal:check` **PASS** · `parity:gate` **PASS, 4
shared · 0 divergences** · `instory:gate` **PASS** · `assets:orphans` **0** ·
**the lap RAN, all seven Ops pages, at 390px and 1228px**, zero page-level
sideways scroll and zero console errors. **NOTHING IN `src/` CHANGED.**
**R1 IS H2's PULL-BACK RULE RESTATED FOR NINETY DAYS** — *an asset appears only
after the story has called for it* is what `delivered()`, `publicPlacements()`,
`placeRule()` and `deliveryFaults()` have enforced since 2026-08-06 — so the
ninety days need no new rule, no new stage and no schedule. **They need the
LAUNCH stage, which exists, and one step a day, which did not.** Mechanism **(b)
— the Record's own `assets` array IS the manifest — is the recommendation, and it
costs Mike ZERO ACTIONS beyond dictating the entry he was going to dictate.**
(a) was rejected on **duplication, not on the clock**: a dated manifest is a
second source of truth about what is public, and this repository has paid for
that shape four times. **A MISSED DAY IS (b)'s STRONGEST PROPERTY** — nothing
happens, because a missed day looks like a day with no entry, and it is one.
**THE STEP IS `npm run reveal:day`** (`--place` moves files both directions,
`--since <ref>` parses the Record out of a git blob and prints the delta); it
computes nothing new, it is **not a gate**, and it **deliberately draws no
transfer class** because that join is nine rows deep. **AND `deliveryFaults()`
GAINED A FOURTH CHECK WRITTEN FOR DAY 40:** the first three all walk FILES, so an
entry naming a picture that is at NEITHER address was invisible — the entry
publishes, the wall shows nothing, every gate passes. Zero instances today,
proved by breaking it on purpose. **R3 IS SCOPED AND UNBUILT, AND ITS FINDING IS
A THIRD GRADE OF SECRET** — material that is on the visitor's machine and useless
without a key that was never published, needing **no server and no state**, which
is what most of this story wants; the rule that decides the rest is *client-side
decryption needs a passphrase that survives an offline attack; the worker does
not.* **A story lock needs a THIRD door pair and must never reuse either
existing one.** **T1's TWELVE-WEEK TABLE CARRIES TWO AXES BECAUSE ONE COULD NOT
HOLD THE INSTRUCTION** — the rail says whose SENTENCE, Mike's band says what is
UNDER it, and week 1 is blue and DICTATED at once. **Week 2 stays gold** because
demoting a `headlineVerbatim` string would be the inverse error the rails exist
to prevent; **week 3 is the one Ops cannot settle (R-c).** **AND THE ROUND
PRODUCED TWO FINDINGS NOBODY ASKED FOR:** the worksheet was asking for weeks one
and two's headlines that the new page also asks for — one question, two stores,
neither able to see the other — and **removing the two slots exposed that
`save()` would have silently deleted whatever had been typed into them**, since
it wrote only the slots that still exist. It carries foreign keys through
untouched now, and the arc page carries the two answers across and marks the row.
The other finding was **the lap**: the first cut put the word OPS at the head of
the one column that on week 2 holds Mike's own sentence, and only a screenshot
could see it. **Surfacing unmoved at 20 spendable — the FIFTH packet running.**
Round log: `docs/MUSEUM_REVEAL_MECHANISM_LOG-20260807.md`. Scoping:
`docs/HIDDEN_LINKS_SCOPING-20260807.md`. Mike's own documents:
`docs/dictation-20260807/index.html`, rebuilt with `npm run dictation`.)
Previously 2026-08-07 (THE WORKSHEET — eight
instructions, all eight built, and **the round's largest finding is one the rail
scheme could not have stated the day before.** Gates: lint **11/9 = baseline** ·
build green · provenance **PASS** · `reveal:check` **PASS** · `parity:gate`
**PASS, 4 shared · 0 divergences** · `instory:gate` **PASS** · `assets:orphans`
**0** · **the lap RAN, all six pages, at 390px and 1228px**, zero page-level
sideways scroll and zero console errors. **THE PRIOR PAGE WAS A GOOD DOCUMENT AND
A BAD INSTRUMENT** — `week1.html` explained the rails, the provenance model, the
transfer classes, the bouncy ball law and five collisions BEFORE it showed a
single headline, and then had nowhere for Mike to write: *"if it is the firehose
I have to drink from to do anything, thanks, pass."* It is two files now,
`worksheet.html` (32 slots, Ops left / input right, saving as he types, one
button that gathers everything into plain text) and `reference.html` (everything
that explains the machine), and the generator **prunes `week1.html` by name**
rather than leave an orphan every other page still links past. **WEEK TWO
ARRIVED IN WRITING, WHICH MAKES IT QUOTABLE, AND THAT IS THE FINDING** — W1's
rule was built for a week Mike SPOKE, so gold-empty was a fact about week one
rather than a policy; carrying six written beats on the blue rail would have been
the INVERSE of the error the rails exist to prevent, because **his own sentence
left in blue gets quietly "improved" by the next round and nothing can tell it
was ever his.** `reveal/week-two.mjs` carries a `beat` field that **may be
deleted but never reworded**, and one structuring decision — two beats merged
into day 4 because they are one object — is named rather than smoothed.
**THE OUTLINE PRODUCED EXACTLY ONE COLLISION AND IT IS THE ROUND'S OPEN ITEM
(X-1):** week two's Friday is a box on a porch, `TRANSFERS.PACKAGE.opens` is
**3**, and that beat is the only one in either week outside its own window;
three ways out, all Mike's, and **the cheapest — rule that an unlabelled box is
not a package — is a change to the transfer model's own boundary, which Ops does
not make on an inference.** **THE SHELL WAS MOVED AND THE MOVE WAS PROVED:**
seven declarations left `prep.mjs` for `tools/dictation/shell.mjs` and the three
pages that did not change this round came out **byte-identical** to copies taken
before the split. **AND THE LAP FOUND A BUG NO GATE IN THIS REPOSITORY CAN SEE**
— `font: 14px/1.5 inherit` is invalid (the shorthand takes a family; `inherit` is
legal only as the whole value), so Chrome dropped it and every writing field on
the instrument came up in the UA's monospace, on the one page whose job is
writing. The same construction is in the shared `OPS_CSS` three times and is
noted rather than changed. **ONE THING IS UNMEASURED AND IS SAID PLAINLY:**
whether `clipboard.writeText` succeeds under a genuine user click — real mouse
input stopped reaching the page mid-session, so every test click was synthetic
and carried no user activation. The page's fallback (select the text, say so) was
observed working, and the button is useful either way. **Nothing in `src/`
changed.** **Surfacing unmoved at 20 spendable — the FOURTH packet running.**
Round log: `docs/MUSEUM_WORKSHEET_LOG-20260807.md`. Mike's own documents:
`docs/dictation-20260807/index.html`, rebuilt with `npm run dictation`.)
Previously 2026-08-07 (THE TWO BUCKETS + 013 — two
rulings and a register pass, and **the larger of the two corrected a rule this
repository had been measuring against for five days without anything being able
to notice.** Gates: lint **11/9 = baseline** · build green · provenance **PASS** ·
`reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** ·
`instory:gate` **PASS** · `assets:orphans` **0** · **the lap DID NOT RUN — the
Chrome extension is not connected in this session, said plainly rather than left
as a silence.** **THE BOUNCY BALL LAW CAPS POINTS OF FOCUS, NOT ASSETS**, and the
sentence it was carried as — *"never more than two or three offerings in a day"* —
**was never false.** Ops supplied the wrong UNIT twice: in the rule's own bearing
line, and in the tracker, which divided a count of PHOTOGRAPHS by a ceiling on
ATTENTION and printed **"16 pictures = 6–8 days of material"**. Every input was a
real measurement and the arithmetic was sound, which is exactly why a round of
review walked past it. **THE ASYMMETRY IS THE MECHANISM:** PRECIOUS has a ceiling
(two or three **a week** — the period moved with the unit) so it divides into
weeks; **DUMP has none, so it divides into nothing**, and `runways()` in
`reveal/focus.mjs` is structurally unable to print one for it, because a
symmetrical table would re-commit the original error in the other bucket.
**`bucket` is the sixth JUDGED field on the asset table, null on all 475 rows
(re-measured 2026-08-21 when QC_101 landed; the line said 315, then 385, then
404, then 459, then 460 — the table has grown, and the point of it has not:
still not one derived value on it), and
OPS DOES NOT DERIVE IT** — a heuristic calling every machine photograph precious
would make every tracker read as ANSWERED while nothing had been answered, which
is the void figure's own defect with better manners. So the 16 pictures behind the
stage door are **between nothing at all and 6–8 WEEKS**: the number survived and
the unit moved. **RECORD 013 IS THE PROTOTYPE AND IS KEPT, ON MIKE'S OWN
CRITERION** — he offered retire-or-mark and one test, *honest AND the machinery
exercised*, and retiring empties the volume: the entry renderer never mounts, the
index budgets police no string, the per-entry derivation loops over nothing, and
`delivered()` goes empty, **leaving the pull-back rule with no positive case
anywhere in the museum.** The mark is in the ledger and the dictation pages and
**nowhere on the glass**, because that line's subject is the making of the museum.
**W-1 CLOSED WITH A FOURTH ANSWER THAT WAS NOT ON ITS OWN LIST** — all three
readings assumed the entry in the tree and day one's entry had to be the same
entry, and Mike dissolved the premise. **M19 CLOSED, AND CLOSING IT EXPOSED THAT
C8's STATED BLOCKER WAS THE WRONG ONE**: `recordEpoch` is a DATE, not a number, so
C8 waits on Record 001's date and always did. Nothing in `src/` changed. Round
log: `docs/MUSEUM_TWO_BUCKETS_LOG-20260807.md`.)
Previously 2026-08-07 (THE DICTATION PREP — six
instructions, all six answered, and **the round's largest finding is that one
instruction's own premise was wrong.** Gates: lint **11/9 = baseline** · build
green · provenance **PASS** (0 undeclared · 0 stale · 0 invention) ·
`reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** ·
`instory:gate` **PASS** · `assets:orphans` **0** · the four new pages lapped at
**390px and 1228px** with N5's iframe recipe, zero page-level horizontal scroll
and zero console errors. **K5 ASKED FOR "WEEK 1 AS IT STANDS" AND NONE OF IT
EXISTS** — no day-by-day outline, no week headline, no topic list, no `weight`
field, in either repository — so the frame is built, **every content slot is
empty, and the finding is printed at the top of the page rather than buried**;
five plausible day headlines would have been unmistakable tomorrow and
unattributable next week, which is the one failure mode the instruction itself
named (K-b). **THE ELEVEN HELD PHOTOGRAPHS ARE KILLED AND THE PRECEDENT THEY SET
IS NOT REVERSED:** N1's rule reads *"a real photograph this museum owns is not
deleted on OPS' word"*, unchanged and exactly as written — C-a put the
irreversibility to Mike and he answered. **`egg.niac.operator` is left with three
plates, all upstream and all regenerable** from the 2021 build video under the
robots repo's own crop table; **the museum now holds nothing of the robot**, and
the ledger row says so. The manual's title page cost nothing at all: byte-identical
to page 1 of the sixty-one that repo generates. **THE NEW TRACKER FOUND A HOLE IN
AN OLD ONE ON ITS FIRST RUN, AND IT IS §8's TWO-ADDRESSES HAZARD IN ITS QUIETEST
FORM** — `assets:orphans` reports 0 while three rows carry `missing:true`, correct
by its own definition (`missing && isJudged`), and **two of the three are the
public-side twins of pictures that moved behind the stage door**, so the same
photograph is in the table twice, once at each address. The tracker's first cut
counted them and said 18; the true number is 16 (K-a). **K2 IS THE MISSING ITEM IN
N-g AND N-h AND IT IS ASSEMBLED, NOT WRITTEN** — 163 rows, 18 contradicted with
both readings printed, 20 absent, 8 flagged REAL-BUILD SOURCE under Doctrine 18;
**the manual's own twelve-section structure was the named candidate and does not
serve a one-sheet**, ten of the twelve being procedures, so the grouping is the
period specification's own and every heading carries its manual position instead
(K-d). Round log: `docs/MUSEUM_DICTATION_PREP_LOG-20260807.md`. Mike's own
documents: `docs/dictation-20260807/index.html`, rebuilt with `npm run dictation`.)
Previously 2026-08-06 (THE NIGHT ROUND — six
instructions, all six answered, and **two of them turned out to be the same
defect in two costumes: something true, verifiable and wrong, that no amount of
reading source could find.** Gates: lint **11/9 = baseline** · build green ·
provenance **PASS** (0 undeclared · **0 stale** · 0 invention) · `reveal:check`
**PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** · `assets:orphans`
**0** · **`instory:gate` PASS (new)** · **the lap ran at 390px AND at 1228px, on
the built bundle under `wrangler dev`, for the first time in five rounds.**
**THE PROVENANCE REGISTER WAS THE EVIDENCE FOR N2's DEFECT RATHER THAN THE
DEFENCE AGAINST IT** — every spec row struck this round was classed `VERIFIED`
with the source *"the unit's own `.ino` trees, read off the files"*, so the
boundary was working perfectly and recording in writing that a 1965 machine's
spec sheet came from an Arduino. **Doctrine 13 asks whether a string HAS an
origin; it cannot ask whether the origin belongs to the fiction** — that gap is
Doctrine 18 with `npm run instory:gate` under it. **N4's RULE WAS BEING BROKEN ON
THE AXIS NOBODY WOULD HAVE LOOKED AT:** every `<details>` in the museum is honest
vertically (0 of 24 above it in the booth, 0 of 47 in the wing FAQs) and what
moved was everything, SIDEWAYS — opening Record 013 grows the document past the
window, the scrollbar appears, the viewport goes 403 → 390 and **18 elements
above the change shift**, which nothing in the museum's code is doing. **A
RUNTIME FILTER SHIPS THE MATERIAL, FOUR FOR FOUR:** 35 `[PAPA]` markers were in
the public bundle including the Foundation's four unpublished ledger figures, and
the launch strip is an AST pass rather than a regex **because marker sentences
straddle concatenated literals and a per-literal rule would ship copy Mike never
approved**. **M97 IS CLOSED AFTER FOUR ROUNDS** — the window's size was never the
museum's viewport; a 403px same-origin iframe gives `innerWidth: 390` exactly,
and the recipe is COMMITTED this time because v50 solved it once and lost it with
a gitignored scratch file. Round log:
`docs/MUSEUM_NIGHT_ROUND_LOG-20260806.md`.)
Previously 2026-08-06 (THE VISIBILITY RULE + FORMAT
CONFORMANCE — five instructions, all five built, and **the round's largest
finding is that the launch build was building half the application and saying it
had finished.** Gates: lint **11/9 = baseline** · build green · provenance
**PASS** (0 undeclared · 0 stale · 0 invention) · `reveal:check` **PASS** ·
`parity:gate` **PASS, 4 shared · 0 divergences** · `assets:orphans` **0** · lap
on the built bundle under `wrangler dev`, **in both stages**, desktop only.
**MIKE REVERSED THE PULL-BACK FOR DEVELOPMENT AND GAVE THE REASON** — *"the
pull-back rule is a LAUNCH-STATE rule, not a development-state one. Mike cannot
direct what he cannot see."* H2's sentence and every mechanism enforcing it are
unchanged; what was wrong is that the rule had only ONE state, so the only way to
obey it was to be in it. `reveal/stage.mjs` is one word with two values,
**default DEVELOPMENT**, and the default's cost is stated rather than left to be
found: a deploy publishes the Portal and the twenty-six photographs.
[superseded — see §0 DEPLOY] **THE TWO
HOLDS ARE TWO DOORS NOW AND THAT IS THE LOAD-BEARING HALF** — `/assets/locked/`
+ `/locked/` is the PERMISSION hold (`/hr`, password in EVERY stage) and
`/assets/held/` + `/held/` is the STAGE hold, because one list guarding both
would have handed ninety-three of Hunter Root's tracks to a build flag; the
worker tests the permission door first and check 9 asserts its branch never
mentions the stage. **THE RUNTIME RESOLVER ALONE WAS NOT GOOD ENOUGH, FOR THE
THIRD TIME** — the first launch build still carried the public address of all
twenty-six withheld photographs in plain text, so `wb-placement` resolves the
literals at `enforce:"pre"`. **AND `npm run build:launch` BUILT ONLY THE CLIENT**:
vite's node `build()` API drives one of this project's two environments, so the
worker kept the previous DEVELOPMENT stage and both doors stood open on a
launched museum, with one word in `/api/held` as the only symptom. **F1's THIRD
RULING OF THE FAQ FORMAT IS THE FINDING** — R7 conformed the accordion and left
every face free to declare a blurb, a register, a still and a footer, so it is a
FACTORY now and the fields are absent rather than unset. **G1's QUESTION DOES NOT
BIND**: the old 30px cannot hold a wrap (37.11px composed), but no current entry
needs one — the longest clears a single line by **63.00px** — so the row is
MEASURED off the tallest signature and is **23px**, below the 30px he remembers.
**AND THE CULL'S OWN INSTRUMENTS WOULD HAVE CONDEMNED THE PHOTOGRAPHS V1 HAD JUST
RESTORED** — four of them broke on one cause: *a picture has two addresses now,
and anything that matches on one of them is wrong.* Round log:
`docs/MUSEUM_VISIBILITY_RULE_LOG-20260806.md`.)
Previously 2026-08-06 (THE PORTAL HOLD + THE PULL-BACK
— eight instructions, all eight built, and **the round's largest finding is a
consequence of trying to PROVE the first one rather than of doing it.** Gates:
lint **11/9 = baseline** · build green · provenance **PASS** (0 undeclared · 0
stale · 0 invention) · `reveal:check` **PASS** · `parity:gate` **PASS, 4 shared ·
0 divergences** · `assets:orphans` **0** · lap on the built bundle under
`wrangler dev`, **desktop only**. **H1 ASKED FOR A GATE THAT FAILS WHEN A HELD
THING BECOMES REACHABLE, AND BUILDING IT MEANT READING THE BUILT BUNDLE — WHICH
WAS SHIPPING THE WHOLE REVEAL LEDGER.** 162 rows, every `name`, `where`, `dep`
and `note`, out of one JSON import in `src/lib/reveal.js` that exists to draw a
single LIVE / NOT BUILT column: the file where this house writes down what it
holds and does not show, including both of the eggs whose ONLY written form is
that table. 64 KB in a chunk every visitor downloads. That file's own header says
in capitals that the ledger returns STATE and never WORDS — and the enforcement
was the FUNCTION SIGNATURE. **A bundle does not ship signatures; it ships the
file.** `reveal/public-view.mjs` is a four-field allowlist applied by a vite
plugin at `enforce:"pre"`, one rule and two callers, the same arrangement as
`stripVaultAudio`; the shared chunk went **184.57 KB → 120.84 KB**.
**THE REACHABILITY CHECK FOUND SEVEN THINGS THAT WERE ALREADY UNTRUE** —
`route.hr` and `route.hr.archive` still saying *"by URL only"* a round after the
password went on, `route.admin` saying HELD **and** how to reach it in one row,
`twin.scaffold` wearing a developer flag in the `reach` field, and
`phys.manual.original` treating BEING MENTIONED as being reachable. **Nine
deliberate breaches, nine caught**, every specimen on a copy. **THE PULL-BACK
RULE IS ONE SENTENCE WITH ONE WRITTEN EXCEPTION AND NO FALL-THROUGH** (H2): 26
pictures went dark and one stayed — the power switch, on the Record entry that
delivers it — and **the FILES MOVED behind the door**, because taking a picture
off a page does not take it off the server. **THE COVERLESS-SLEEVE PLACEHOLDER
HAD NEVER ONCE BEEN ON SCREEN** and drew two black rectangles: a dark-ground
component left standing after the ground stopped being dark, and only the lap
could have found it. **THIRTEEN `.vp-face-portal` RULES WERE STYLING A CLASS NO
ELEMENT HAS CARRIED SINCE P2** — and were still being cited, F0 having preserved
one of them "byte-for-byte" on a face that did not exist. **`face.presets` IS
READ BY TWO LIVE RENDERERS**, so each Image Archive face was drawing a dropdown
of photograph groupings wired to open the twin. **AND C32's CONTENT-MOVE CARRY
HAD NEVER FIRED** — a NUL keyed against a space, eighteen lines apart, invisible
because its failure mode is the one it was built to fix. **THE 390px HALF OF THE
LAP DID NOT RUN, FOR THE THIRD ROUND RUNNING** (M97): `window.innerWidth` reads
1228 and will not go below it. Round log:
`docs/MUSEUM_PORTAL_HOLD_LOG-20260806.md`.)
Previously 2026-08-06 (THE COMBINED BRIEF — twenty-two
instructions across defaults, aesthetics, the Lobby, the Foundation, Weird.Baby
Music, the poster and the artist pages. Twenty-one built, one answered as the
proposal it asked for, and **one struck string does not exist in this
repository**. Gates: lint **11/9 = baseline** · build green · provenance **PASS**
(0 undeclared · 0 stale · 0 invention) · `reveal:check` **PASS** ·
`parity:gate` **PASS, 4 shared · 0 divergences** · `assets:orphans` **0** · lap
**on the built bundle under `wrangler dev`**, eleven routes, **desktop only**.
**A1 DELETED ABOUT FORTY DECLARATIONS AND CHANGED NOTHING A VISITOR READS**, and
Mike's own diagnosis is the finding: the black poster border came from V1's
"paper card on a dark stage", which answered a DIFFERENT problem — text
unreadable on black — and the wing kept the scaffolding after the cause was gone.
The file records the arc: W6 dropped the house lights, P9 and R0 spent two rounds
moving that dark ground a stop at a time because TEXT ON IT GLARED, and V1
answered the glare properly by taking the text off the dark entirely — **at which
moment the dark ground had nothing left to do except be the border around the
card.** The stage re-pin, M0b's compensating ring, the mat and twelve re-pinned
tokens are gone; what replaces them is the three declarations /robots has had
since L5, re-scoped from a wing to `[data-flat="1"]`, which is A2 stated as a
selector. **FIVE FOLDED VALUES ALSO FIX /robots, WHICH V1's OWN NOTE PREDICTED
AND COULD NOT REACH** — it named the identical literals under the robots sheet
and said they were "not this round's to change"; under A2 they are, because a
rule scoped to a wing was the only reason there were two. **D1–D3 PUT THE ROOM ON
ONE SCREEN AND THE MEASUREMENT IS THE ANSWER**: /wb opened at 1229px inside an
810px window with a 832px contents column holding six song titles; it is 810 = the
window, at 521px, with the picture's left edge on the divider. The contents column
is MEASURED (`max-content`, read back, restored inside a layout effect) because a
row's `offsetWidth` is the width it was GRANTED. **IT REVERSES THIS FILE'S OWN
"THE SPLIT IS NOT A FIT LEVER" IN THE OPEN** — the finding under that rule stands
and the DIRECTION was what was wrong. Two things the measurement itself caught: a
STOWED document was being fitted like a picture (harmless at a 300px default,
fatal at 200), and the first cut of the column measurement CLIPPED ITS OWN TITLES,
because only the active album's rows are in the document. **A3's THIRD CLAUSE IS
THE DIAGNOSIS**: the covers it replaces are typographic on the museum's paper, and
the museum's paper is `--wb-bg`, which is also the carousel's ground — so they had
nothing to show but a keyline. `tools/make_house_covers.py` **proves** it is the
robots geometry by re-rendering that cover and comparing pixel for pixel, and it
FAILED on its first run in the strapline row alone, because the Foundation's
generator had silently tightened the line it copied. **THE FOUNDATION IS THREE
ALBUMS BY READING ORDER** (F4) and F7's three mechanisms are stated where they
landed; F5's cadence is PROPOSED as the Record's own machinery rather than a track
per update, built and empty. **AND `assets-declare.mjs` HAD DRIFTED FROM THE FILE
IT WRITES** — five rows existed in `assets.json` that the declarer did not know
about, and the next `--write` would have deleted all five in silence (M99).
**THE 390px HALF OF THE LAP DID NOT RUN AGAIN** — M97 re-confirmed, said plainly.
Round log: `docs/MUSEUM_COMBINED_BRIEF_LOG-20260806.md`.)
Previously 2026-08-06 (MIKE'S PAGE-BY-PAGE —
twenty-six instructions across the Lobby, the Record, the Portal and MGK-NIAC,
all twenty-six answered. **THE MOST USEFUL FINDING IS A MEASUREMENT THAT KILLED
THE THING IT MEASURED.** R4 asked whether there is a flatter better way than a
capped line with pane to spare and named two columns as a candidate; it was
BUILT, shipped to the built bundle and then read off the glass at **thirty-three
characters a column** — the pane is ~76% of the viewport, split in two it is
~430px a side, and after the mark rail and the gutter each column is 324px
against a readable band of 65–75. It becomes right past ~1650px of viewport and
the operator's screen tops out at 1228, so it is gone and **the number is the
answer**. What shipped instead is the direction nobody expected: the Record's
entry body was set at **56ch, BELOW the band**, so it was paying a narrow
measure's costs and collecting none of its benefits — it is 68ch now, and the
index row's reading matter is capped at the same measure. **R3's "that failure
disappears by construction" IS A MECHANISM, NOT A PROMISE**: every truncation in
the Record index is deleted (`-webkit-line-clamp`, the headline's ellipsis) and
`reveal:check` now REFUSES a headline past 62 characters or a summary past 130 —
render cannot clip and data cannot overflow, so there is no third state. **R7
CONFORMED EVERY WING FAQ TO `/booth`'s ACCORDION and reversed one of Ops' own
rulings in the open** — D7 flattened `/foundation`'s during the port, recorded it
as a judgement and put it to him as M70; he answered it for every wing at once,
so the flattening is undone rather than defended and four faces moved. **N3
BUILT NO NEW MACHINERY**: L6's Record document card already WAS a documentation
template, so it was lifted out of that renderer into one shared `DocList` with
one field added (`plates`, the plate wall's own shape). **R5's badge could not be
made to serve** — B9's model has no permitted class list and no object registry,
so the word opened nothing and giving it something would have been Doctrine 12
with a button on it; struck in all three places it drew, and `.vp-fe-class`
deleted rather than orphaned. **N9's groupings carry their own counts**, which is
what keeps a curated archive inside the no-hidden-information law, and the egg
consequence Mike named is `egg.presets` — ledgered, `shown:false`, not built.
**X1's honest answer is that the ledger held every egg and nobody could ask it**:
`npm run reveal:eggs`. **P1's "INSTRUMENT DIV." was the SECOND growth of a drift
he struck a fortnight earlier**, on a different object. **THE 390px HALF OF THE
LAP DID NOT RUN** — the window would not go below 1228 CSS px and Chrome refused
`resizeTo`; said plainly as M97 rather than left as a silence. Round log:
`docs/MUSEUM_PAGE_BY_PAGE_LOG-20260806.md`).
Previously 2026-08-06 (THE PRE-COMMENTARY ROUND —
eight instructions, all eight landed, and **the verification of the headline one
caught an outage that would have taken the whole back end down silently.**
`/hr` IS PRIVATE AND IT IS ENFORCED AT THE SERVER (H1): the wing is a dynamic
chunk parked under `assets/held/`, `src/worker.js` refuses that directory
without a cookie, and the cookie is minted only by a password on `/admin`
against `env.HR_KEY`, a wrangler secret with **no default**. **IT IS NOT A REACT
PASSWORD, AND THE REASON IS R5 ONE ROUND OLD** — a filter that stops the render
still ships the material, and a browser-side gate would have left the catalogue,
the deck and **107 vault image URLs** sitting in a public bundle behind a boolean
anybody can flip. Measured: public JS 724.8 KB → **536.6 KB**, held 189.1 KB,
vault image URLs in the public bundle **107 → 0**. **THE OUTAGE IS THE MOST
USEFUL THING IN THE ROUND:** gating the directory needs `run_worker_first` in
`wrangler.jsonc`, and **declaring that list changes the default for everything
not in it** — with only the held directory named, `/api/admin`, `/api/guestbook`,
`/api/visits` and `/api/presets` all stopped reaching the worker and were
answered by the asset store, which under `not_found_handling:
single-page-application` returned **index.html with a 200** to every one. Nothing
errors; the site just stops having a back end. Caught by running the gate against
`wrangler dev` on the built bundle rather than reasoning about it. **THE FORGED
FLAG WAS PROVED BY BREAKING IT ON PURPOSE** — held directory moved aside,
wrangler restarted, `/hr` loaded with the session flag set: it rendered the
Lobby, which is what an unmatched address renders, so the forger and the typo
land in the same place. **`robots.txt` IS DELIBERATELY NOT WRITTEN**, and that is
the opposite of what the instruction sounds like: a `Disallow: /hr` line is a
public list of what you are hiding and would be the only place on the site naming
the address. **THE PERMISSION AUDIT (H2) FOUND THE ITEM NOBODY HAD NAMED** — the
49 artifacts carry his own post text VERBATIM as museum data, which an embed
licence does not cover and which **survived every remedy so far**, going behind
the door only because it shares a file with the deck (M80). It also found the
sentence that stops *"/hr is private"* being read as *"his material is off the
site"*: **all 97 vault facts ship publicly in `/wal`'s chunk and two of his
images are served from the museum's own origin** (M81, M82). **There are no
lyrics anywhere in this repository**, and the 33 YouTube renditions are the one
item whose basis can be checked rather than asserted. Audit:
`docs/HR_PERMISSION_AUDIT-20260806.md`. **DOCTRINE 17 WAS APPLIED TO THIS
ROUND'S OWN NEW CODE**, twice, within the hour it was written. Round log:
`docs/MUSEUM_PRE_COMMENTARY_LOG-20260806.md`).
Previously 2026-08-06 (THE PORCH RULINGS — six
rulings, one research map, one register pass. **THE ONE HE CALLED CRITICAL AND
LIVE WAS AIMED AT THE WRONG PAGE, AND CORRECTING HIS PREMISE MADE THE PROBLEM
FORTY-SIX TIMES BIGGER.** R5 ruled that the museum does not have Hunter Root's
permission and must stop serving his material — naming *"his two songs"* on
`/wal`, which turned out to be **YouTube embeds of his own channel and always
had been** (oEmbed on both ids returns `youtube.com/@hunterrootmusic`, checked
rather than assumed). The verification he asked for found **`/hr` serving
ninety-three**: every track carries an `assets.weird.baby` mp3 rendition and
sixty also sit on the album containers as `primary_url` for the deck's own
`<audio>` element. **THE RULE IS WRITTEN ONCE AND ENFORCED TWICE, AND THE SECOND
TIME IS THE POINT** — `src/data/exhibits/vault-audio.js` holds `stripVaultAudio`
(pure, importless, idempotent, matching the vault's audio PATH not a file
extension); the RUNTIME caller is `hunter-root-served.js`, the only thing either
consumer imports now, and the BUILD caller is the `hr-vault-audio` plugin in
`vite.config.js` at `enforce: "pre"`. **The build pass exists because the first
attempt was not good enough and the bundle said so:** a runtime filter stops the
REQUESTS and still ships the ADDRESSES, and the first build carried 153 vault mp3
URLs in plain text. Now zero, and 22 KB smaller. **The cost is 60 of 93 tracks
with nothing playable** — Run With The Hunt and the Phone Recordings EP entirely
— drawn through `.tl-novid` and the overlay's *unavailable*, **both of which
already existed; no render path was invented.** What `/hr` should look like
without its audio is a design call and is **M71**, not Ops'. **R4 STRUCK THE
HOLDINGS SENTENCE AT SEVEN SITES** and Hunter Root's card now has **no
biography**, because both its paragraphs WERE the announcement (M72) — the second
time that slot has failed the same way, the first being when it described this
website. **ONE DELETION WAS DRAFTED, REVERSED, AND THE REVERSAL IS THE MORE
USEFUL FINDING:** striking the song cards' `Accession` rows for symmetry would
have broken the only on-glass provenance anchor two other passages on that same
card point at — **a citation is not a decoration**, Doctrine 11 ships accession
numbers, and the row went back with *Published by* and *Verified* added beside it.
**R2's blurbs were both DELETED rather than reconciled**, and `/booth` and
`/foundation` were checked rather than assumed — neither has an FAQ intro blurb;
a heading is not a blurb. **R6 RULED M37 = A (disclose)**, which makes the booth's
answer the whole of the remedy and therefore its accuracy the whole of the
remedy — re-measured, **and the Facebook half was wrong for the third time in the
museum's own favour**: the plugin frames are `loading="lazy"`, so `/hr` on arrival
requests Facebook **zero** times and sixteen only once they scroll into view.
`C34` closes ruled-against. **R7's number is thirteen**: Bandcamp adds 13 tracks
over YouTube for Hunter Root and **47 of his 93 are reachable through nothing**,
while Carsie Blanton (16 releases) and Jesse Welles (7 albums) are whole
catalogues the wing shows two songs of. Round log:
`docs/MUSEUM_PORCH_RULINGS_LOG-20260806.md`. Research:
`docs/AD_FREE_PLAYBACK_RESEARCH-20260806.md`).
Previously 2026-08-06 (CLEAR THE DECK — nine
instructions, all nine landed, and the biggest of them was found by looking for
something else. **THE SAME PASSAGE NO LONGER LIVES IN TWO ROOMS AND THE MAP IS
NOT A GREP:** it was built from `tools/provenance-sweep.mjs`'s own extractor, so
the population is exactly the population `provenance:gate` polices. Three exact
cross-file duplicates are hoisted — the keeper's answer into
`src/data/house-copy.js`, and the manual reader's FORMAT/NAV lines, the empty
reel's note and the shop answer into module constants in `robots.js`, all four
typed twice because parity is absolute and `npm run parity` polices the menu
ITEMS and cannot see the words inside them. **FOUR DIVERGED PAIRS ARE REPORTED
RATHER THAN MERGED** (M66–M69), which is what his instruction says to do with a
divergence. **THE FOUNDATION IS A WING** (M62, option A): `face.account`,
`face.register` and `face.ledger` are three new object kinds mounted on the
presence of a field exactly the way `InstrumentPanel` is,
`src/routes/exhibit/FoundationObjects.jsx` is **the sheet's own markup and the
sheet's own stylesheet MOVED rather than rewritten** — the cheapest guarantee
available that nothing was lost — the reveal-ledger wiring crossed untouched, and
`src/routes/Foundation.jsx` is deleted. **THE LAP CAUGHT THREE THINGS NO GATE
COULD:** the billionaires question printing with silence under it (the face
model's entry filter is an OR where the sheet's was an AND, so an answer held
whole came back as a published question with nothing beneath it, on the one page
whose subject is honesty), a player bar on a wing with nothing to play, and the
objects drawing above their own heading. **`/hr/archive` WAS CARRYING A WHOLE
SECOND CATALOGUE** — six containers against the vault's nine, two whole records
missing, four songs filed under the wrong record — and it is DELETED rather than
corrected, because a corrected mirror is a mirror that will drift again; the page
reads the spine now. **AND W1's OWN FIX CARRIED THE DEFECT IT WAS CURING:** 93 is
a count of TRACK ROWS and was printed as a count of SONGS, the same unit swap as
*78 songs*, one round later, by the round that named the class. The manual
**stays OFFLINE** (M61, RULED — HELD). The machine covers **spill out of the
oval**, and the two treatments are the SOURCE's doing rather than the effort's —
the VIIIp gets a real silhouette, the mainframe rides over the ring as a plate
because its frame was cut at the cabinet's own bounding box and three mattes each
damaged the object. The billed gift-shop tile **owns the top row, centred, at one
column's width**, measured 445×298 across all five. The viewer is at
`--face-zoom: .94`, **floors included**. Round log:
`docs/MUSEUM_CLEAR_THE_DECK_LOG-20260806.md`).
Previously 2026-08-05 (THE REMOTE-CONTROL ROUND
eleven instructions, **ten built and one handed back because it is blocked by
Mike's own ruling from the round before**. **PARITY IS ABSOLUTE AND THE PREVIOUS
ROUND'S OPS RULING IS REVERSED IN THE OPEN:** a holdings gap no longer resolves a
menu divergence, `menu-parity.mjs` fails on any difference, and the `JUSTIFIED`
table, its `kind` column and **the ledger read that faulted the day a named
holding arrived** are deleted — mourned in the file's own header with its commit
named, because under an absolute rule there is nothing left for it to guard. It
is **a PACKET GATE now**: it used to report a judgement and now reports a fact.
The mainframe gained **The Manual** and **FAQ**, and **THE STUB LAW IS OVERRIDDEN
FOR THOSE TWO ROWS AND ONLY THOSE TWO** on his reason — *a row is a promise only
when nothing is coming, and these are coming*. Doctrine 12 is untouched inside
them. **THE PORTAL IS ITS OWN ALBUM** (second in the deck), **THE NAME IS DELETED
IN TOTAL** (M59), and the Record sits above the FAQ — which moved the wing's
landing face from the FAQ to the Record, measured on the built bundle and
recorded as **M65** rather than absorbed. **THE ROBOTS FAQ IS MIKE'S, WORD FOR
WORD**, seven questions shipping and one printing nothing because it is marked in
both its title and its answer (M57). **THE FIRST PHOTOGRAPH OF THE MAINFRAME
WHOLE** was 58 seconds into a video this repository has been citing for two days;
what was ever withheld was the ROBOT, and the robot is out of every frame in this
wing. **THE RECORD'S NAVIGATION IS BUILT AND RENDERS NOTHING** on a one-record
volume, and so does the old ‹ NEWER / OLDER › walk, which had been drawing two
disabled halves and a count reading "1 of 1" since M5. **EVERY VIEW SETTING IS
SESSION-SCOPED IN EVERY WING** — it had been built for /wal alone since
2026-08-02 — and the booth's privacy answer changed first. **ADDING ONE FACE TO
/wb DROPPED THE MUSEUM'S LAST PAGER OUT OF IT.** The Foundation's invoice is a
**LEDGER**, its register takes back its own name, *"held, ever"* is gone and the
TONE RULING is recorded as standing; its albums and tracklist are **M62**. The
manual is **M61**. Round log: `docs/MUSEUM_REMOTE_CONTROL_LOG-20260805.md`).
Previously 2026-08-05 (MIKE'S READING PASS — ROUND ONE
— he read the Lobby and the Gift Shop and **every finding was real**. **THE
LOBBY WAS THE LAST PLACE IN THE BUILDING CALLING IT "The Museum"** — the sweep he
asked for found the share tags, the booth's credo and the Foundation's invoice
all already saying *Weird.Baby Museum*, so one string changed and it does NOT
reverse M-ID (that ruling struck names that fenced the museum to a class of
artist; a house name narrows nothing). **THE WATERMARK IS `Weird.Baby`**, which
also answers the morning rip's own M10 — closed CANNOT REPRODUCE on 2026-08-03
for want of a room, and Mike reading the Lobby gave it one. **EVERY GIFT SHOP
TILE IS ONE SIZE**, measured 445×298 and 338×386 across all four billing
branches: the billing law is not repealed, it is re-expressed as ORDER, because
it says who LEADS and never said who is BIG. **AND EVERY ARTIST TILE NOW OPENS
THE ARTIST'S OWN FRONT DOOR** — Hunter Root's fell through to Bandcamp while his
own site opens on *Official Merch Store*, Jesse Welles' went to the merch VENDOR,
and **Mikey Mike's opened a video feed**; `weekendatmikeys.com` was read directly
first and R-a's refusal of findmikeymike.com stands untouched (M54). **M50 IS
CLOSED AND ONE OF ITS OWN CLAIMS WAS WRONG:** the six figure sites are rebuilt
from a re-derived count (9 containers · 93 rows · 78 slugs), two release years
were being printed off `era-buckets.json`'s bucket START years and are corrected
from the vault and his own Bandcamp — **but "half of Crooked Home is about his
brother" IS in the vault**, `MV-HR-20260707-068`, in his own words, and stays.
The poke is the gate on every future egg (M1) and two rooms are ledgered and
unbuilt (M55, M56). Round log:
`docs/MUSEUM_READING_PASS_ROUND_ONE_LOG-20260805.md`). Previously 2026-08-05 (THE WAL POSTER EDIT — a
delete-only round on `/wal`'s ABOUT OUR CURRENT ARTISTS face, with one sentence
rebuilt from the vault. **Three true passages struck on Mike's ruling** that they
explain what the room already does or congratulate the house on its own process:
the curation label, the standard line and the bill's foot. **No render path was
touched** — `bill.standard` and `bill.foot` are still conditional and their CSS
still stands; the fields are simply not declared. **The one strike that costs
something is the per-act "Open the room" chip, which carried P6's ruling that
what is not readable must be written — striking it reverses P6 on this one
object and a coarse pointer now has no cue** (M51; doors verified live, all four
panels are still `<button>`). **HUNTER ROOT'S LINE WAS REBUILT FROM THE VAULT AND
EVERY FIGURE IN THE OLD ONE WAS WRONG:** *78 songs* counts only track rows
carrying a `song:` slug and drops the whole of Run With The Hunt (the vault holds
**93 tracks**); *nine records* counts CONTAINERS, of which **seven are records**,
one is an EP by its own title and one is a set by its own title; *whole
catalogue* is contradicted 400 lines up in the same file. **And Run With The Hunt
is a RECORD, not a band** — its ReverbNation page reads like a band's and
`era-buckets.json` files it under *The Band Years*, but vault fact
`MV-HR-20260707-004` settles it. Three findings left standing rather than
silently patched, per the surgical instruction: the same wrong figures on his own
card (**M50**), the blurb's *"none of them is ours"* now sitting above the panel
that says the museum holds his records (**M52**), and **a `[PAPA]` marker's
second sentence rendering as the last line on the poster** (**M53**) — the
scrubber cuts by sentence on purpose, so the question is the sentence, not the
scrubber. Round log: `docs/MUSEUM_WAL_POSTER_EDIT_LOG-20260805.md`). Previously
2026-08-05 (THE PARITY RULING + TRIM — **two rulings, one behaviour, one idea banked, and a defect that turned out to be four.** **PARITY IS THE DEFAULT AND A HOLDINGS GAP RESOLVES A FLAG RATHER THAN OVERRIDING IT** — Mike's ruling on M47, built as a `kind` on every justification plus the thing R2 could not do: a holdings gap must name the LEDGER ROW that would exist if the museum held the material, so `parity:gate` **faults the day it is built** and "it clears itself" stops being a promise. **THE MANUAL'S PLATE IS STRUCK**: a page reading TEXT NOT SUPPLIED was the museum admitting it had not written the manual wearing a fiction as cover, and either the plate shows a page actually written or there is no plate — M45 and M4 both close, and the face is better without it. **THE GUEST BOOK SCROLLS BY HAND** — drag with arrows as its keyboard half, the wheel refused with a reason, `↑` stopping at the first signature because a guest book has a beginning, and "resumes after a rest" implemented as ONE DEPENDENCY rather than a second clock, which is exactly what Q1 was. **THE POKE is ledgered, graded A+++++ and built not at all.** And C39's two NUL bytes were **six bytes in four files, one of them `keyOf` — the function that hashes every visitor-facing string in the museum**; the fix is proved to change nothing by the gate still passing. Round log: `docs/MUSEUM_PARITY_RULING_AND_TRIM_LOG-20260805.md`). Previously 2026-08-05 (v56 THE ROBOTS SIMPLIFICATION — a cross-repo round that **deleted more surface than it built**: three front-desk faces, six robot plates, a whole spread, two typographic cards and a shot from each of two video cuts, against four instruments, four cabinet plates and two eggs nobody can see. **`MANUAL_PAGES = 24` is gone rather than repointed** — Mike's standing rule is that the manual is as long as the manual needs to be and page count is a consequence of content, so the count is read off the source tree and T-A closes; a SHRINKING manual now faults rows already written past the end, which was invisible. **NIAC IS THE MAINFRAME**, and the finding is that its album named the mainframe in every sentence and photographed the ROBOT in every frame — V2's obfuscation ruling was working perfectly on the wrong object. The robot is now `egg.niac.operator`: LIVE, HELD, printed nowhere. **The Record moved to the wing's own front desk and got an address**, which is the first thing in this museum that can be deep-linked to a track. **The Portal's drum is numbered 1…8 and the reason is written once, in the ledger, and on no page.** Two new instruments: `npm run parity` (the two machines carry the same menu or somebody says why, in writing) and `npm run surfacing` (what is held and never shown, by wing, logged so it becomes a trend). Round log: `docs/MUSEUM_ROBOTS_SIMPLIFICATION_LOG-20260805.md`). Previously 2026-08-05 (v55 RECORD MACHINERY — a drafting-lane round that touched **nothing in `src/`** and built the vessels the Record's first two weeks will land in. The ledger is cut **one row per Record ENTRY** and the rows are **derived out of the Record rather than typed against it**, by a reader deliberately split so that the half the ledger builds from can see entry numbers and asset paths and **no words at all**; the constraint the audit only stated — the ledger must never become a second copy of the Record — is now enforced three ways and **all three were broken on purpose to prove they fire**. `doc.record` is the volume only, and an unnumbered entry fails the build rather than being handed an id. The audit §8b **cue cards are built** — `npm run reveal:cards`, 49 of them, one per held thing, one blank each — and the deck is 49 rather than 143 because asking what day a REVEALED thing came out invites an invention. **The manual is a supply line now**, on Mike's ruling that it arrived in pieces: a page vessel carrying its own production arc and the Record entry that called for it, **built, empty, and proved without inventing a page**. The stale ancestor in the robots repo is marked superseded and kept for the thing it is still the source of. And the fifth reveal class is put to Mike as **one question** with a second case nobody had noticed — `route.hr` is held permanently by his own ruling and its cue card asks what day it comes out. Round log: `docs/MUSEUM_RECORD_MACHINERY_LOG-20260805.md`). Previously 2026-08-05 (v54 THE FOUNDATION COPY — Mike answered `/foundation`'s questions himself and the round was almost all subtraction: fourteen questions become twelve and **eleven render**, because the billionaires answer is now marked in every sentence and the scrubber drops it whole — the first answer in the building to take that path to the end. Two questions deleted, one of them at a named cost (the four gifts of service lost their only list). **Two real households he supplied for the invoice did NOT ship** — consent to be named on a public page is not the museum's to assume — while his RULE about earmarked money and his MECHANISM for a cost carried by somebody else both did. Two link slots ship as named doors stamped NOT BUILT off the reveal ledger, with no `<a>` at all. The lobby board indents *Other Music Worth a Listen*, measured at 16px of slack. Round log: `docs/MUSEUM_FOUNDATION_COPY_LOG-20260805.md`). Previously 2026-08-05 (v53 THE BOOTH EDIT + THE MISSING LAP — the browser lap v52 sealed without has now run over eleven routes at desktop and 390px, and it found that `/hr` requests `www.facebook.com` sixteen times across seventeen iframes on arrival and that `/robots`, `/wal` and `/wb` request `www.youtube.com` three times each, none of it clicked; the booth's privacy answer is rewritten around the machine remembering a visitor when the museum does not, and its outbound clause — on its THIRD version, the first two both false — now names Google, YouTube and Facebook; two forced FAQ questions deleted under the Law of Subtraction and two more answers re-led). Previously 2026-08-05 (v52 THE REVEAL LEDGER — the guest book stops going blank and steps one name at a time; the MGK-VIII album is MGK-NIAC everywhere it is a LABEL and unchanged everywhere it is a FACT; `reveal/ledger.json` catalogues 151 revealable things across both repos and `/foundation` is the first surface reading it; C32 closed — the asset table is keyed by a uid a rename cannot touch, and a judged row whose file vanishes is now reported rather than dropped). Previously 2026-08-04 (v51 M23 RULED + THE ALBUM ROUND — both of M23's pairs are struck and both losers deleted, so `?hook=` and `?book=` no longer exist; the guest book steps; the two machine albums wear covers built on the ROBOTS template; the album band's title is centred and shorter; the face type ramp's top three steps came down; the 31½ card and the count with it, which emptied the provenance register's INVENTION class)
