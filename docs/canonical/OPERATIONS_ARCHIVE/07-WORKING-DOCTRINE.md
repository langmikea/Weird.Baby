> Cut from `docs/canonical/OPERATIONS.md` §7 Working Doctrine, at HEAD `b3812cc`.

## 7. Working Doctrine (process rules — paid for by real failures)

Mirrors STATE.md → Working Doctrine; this copy is canonical for process.

1. **Verify before scoping.** Read the actual file in the live working
   tree before reasoning about it. Never scope against memory, Drive
   copies, or assumption.
2. **Don't guess — look it up.** A claim about the codebase not backed by
   a file just read is a guess and must not be acted on.
3. **Default to Cowork for repo work** — repo reads, big-file edits
   (`HrExhibitFlow.jsx`, `Exhibit.jsx`), multi-file scoping. Host pwsh
   paste-back only for small reads; it burns Mike's time and buffer.
4. **Drive the live UI by accessibility ref, not pixel coordinates**
   (tiny dock targets + peek-to-open animation make pixel clicks miss
   silently).
5. **No load-bearing if/else in pasted scripts** (§4.2).
6. **Durability:** committed AND pushed AND (UI) deployed. Scratch files,
   sandbox files, and local commits are not durable.
7. **A behavior does not change unless there is a stated reason.**
8. **Prefer native/platform mechanics over custom logic.**
9. **Verify before commit; commit after every verified step** — never
   batch a day's work uncommitted. Platform embeds verified incognito.
10. **Understand the problem before acting.** Diagnose, then fix; don't
    chase the latest screenshot.
11. **THE LAW OF THE VISIBLE LINE (Mike, 2026-08-04 — STANDING, site-wide).**
    **If a line describes the work rather than doing the work, it does not
    ship.**

    The test is the line's SUBJECT, not its tone or its truth. Every line
    removed under this law was accurate; that is what made it survive.

    **A visible line FAILS if its subject is the making of this museum:** the
    drafting, the research, the revision history, what a round did, the form a
    page takes and why, the typography, the renderers, the plan for content not
    yet written, or any person building it named on the glass. Also fails: an
    internal decision code (`(C3)`, `held — storyline first`), an operator
    marker outside the scrubber's reach, and a draft-state stamp (`· v1`) on a
    visitor-facing label.

    **A visible line PASSES if its subject is the collection:** the objects,
    the artists, the events in the record, the institution's standing terms —
    **including honest statements of what is not held.** "No plate on file" is
    a holdings fact and ships. "Nobody has photographed this yet" is a
    production fact and does not. Same absence, different subject.

    Two adjacent traps, both paid for on 2026-08-04:
    - **Provenance is not meta.** A sources line, a citation, an accession
      number, "read at its source" — a museum prints those. What fails is the
      NARRATIVE of the checking ("the first research pass refused it for want
      of proof") and the JUSTIFICATION OF A DESIGN CHOICE ("so they are set as
      plain type", "the withholding is authored").
    - **Mechanism state is not meta.** The Foundation's LIVE / NOT BUILT
      column and "not through this page yet" are Mike's own standing rule that
      nothing may claim a mechanism that isn't built. That is a fact about the
      museum as an institution, not about the website's backlog.

    **The corollary Mike gave with it: empty and honest beats populated and
    false.** A placeholder, a sample, a demo entry, a dead control, a door to a
    room that does not exist, or an annotated wireframe at a live address is
    removed rather than left standing. If one must stay, the Ops reason is
    stated out loud — silence is not an option. What removal EXPOSES gets
    reported, not papered over.

12. **OPS DOES NOT INVENT CONTENT (Mike, 2026-08-04 — STANDING, site-wide).**

    **Where a fact is missing, Ops ASKS. Ops never fills the gap with
    plausible detail.**

    This binds every wing, every surface, every round, and it binds the
    drafting lane hardest — a lane whose job is to write is the lane most able
    to write something that reads true and is not. The existing rules against
    invented provenance, invented captions and invented sources are a SUBSET
    of this one; this is the general form.

    **What counts as invention.** Not only a false claim. Any specific the
    operator did not supply and the record does not hold: a date, a count, a
    time of day, a measurement, a material, a room, a colour, a name, a
    quotation, an ordering, a consequence, a person's reaction. Detail that is
    *consistent* with what is known is still invention if nobody supplied it —
    plausibility is the failure mode, not the defence. A round that produced
    sixty entries where one was supplied produced fifty-nine inventions
    however well they fit.

    **The one-question format**, which is what makes asking cheap enough to
    always be the choice:
    - WHAT IS KNOWN — the fact already in hand, stated back.
    - WHAT IS MISSING — the single gap, named precisely.
    - WHY IT MATTERS — what cannot be written, or what would be wrong, until
      it is answered.

    One gap per question. Questions go in a list Mike can answer one at a
    time, at his pace, in any order — not a paragraph he has to unpick, and
    never a blocking gate that stops the rest of the work.

    **What Ops does with the gap in the meantime.** It ships the surface
    WITHOUT it. A section that cannot survive without invention is CUT and
    named as cut; a field that cannot be filled honestly is DELETED rather
    than approximated; an entry with four known facts prints four facts and
    stops. The question list is the deliverable that replaces the invention —
    it is never printed on the glass, because a question to the operator is
    meta by Doctrine 11 and fails the visible-line test.

    Paid for by the Record: ten dated log entries, a 436-record source line, a
    register block and a header photograph's caption, all invented, all
    surviving four rounds of review because each was plausible. Mike had to
    hunt for the one real record in a pile of fictional ones — and the pile
    had been reported before and survived the report.

    **MECHANIZED 2026-08-04 (v48), and doctrines 11 and 12 are still both
    required.** See #13.

13. **EVERY VISIBLE STRING CARRIES ITS ORIGIN (v48, 2026-08-04 — STANDING).**

    Doctrines 11 and 12 are rules, and a rule only catches what a reader thinks
    to look at. "436 records, kept since January 2024" PASSED Doctrine 11 —
    its subject is the collection, not the making of the museum — and was
    invented. The structural cause was never any one string: **a string could
    enter the codebase and nothing at the boundary asked where it came from.**

    **The boundary now asks.** `npm run provenance:gate` enumerates every
    visitor-facing string in `src/` and `index.html` and fails if any is not
    declared in `provenance/register.json` with an origin class — MIKE ·
    VERIFIED · DERIVED · HOUSE · RESTATED, plus a capped INVENTION holding pen
    for what has no origin and awaits Mike. A row is keyed by a hash of the
    string, **so editing a declared line invalidates its own declaration** and
    fails the gate until it is re-declared.

    **It runs on every packet, beside lint and build.** A packet that adds
    content adds register rows in the same commit.

    **WHAT IT DOES NOT DO, and this must be repeated wherever it is described:
    it cannot verify that a declaration is TRUE.** Nothing can. It makes the
    claim reviewable in one file; it does not make it correct. It also cannot
    read text inside an image (that is `assets.json` plus a human looking),
    cannot detect a correctly-cited number going stale, and **does not replace
    Doctrine 11** — a perfectly-sourced line whose subject is the making of the
    museum still passes it cleanly.

    Full model, the exclusion rules, and the honest hole-list:
    `provenance/README.md` §4. Round log:
    `docs/MUSEUM_PROVENANCE_LOG-20260804.md`.

    **OPS RULING, 2026-08-04 (A10): THE `RESTATED` CLASS STAYS.** Mike's four
    classes are ORIGINS; 282 rows are Ops connective prose that originates
    nothing, and calling those MIKE would be false while calling them INVENTION
    would bury the three real findings under 282 non-findings. **It is kept
    because it has teeth, not because it is convenient:** a `RESTATED` row's `r`
    must RESOLVE, and it may not point at its own file — which is exactly the
    shape *"436 records, kept since January 2024"* would have taken, the failure
    the whole boundary was built against. It caught its own author on the day it
    was written: twelve rows citing `InfoBooth.jsx` as the thing `InfoBooth.jsx`
    restates were rejected. A class that rejects its author's own rows on the
    first run is doing work.

14. **THE OPEN-ACTION REGISTER IS MAINTAINED BY EVERY ROUND (Mike,
    2026-08-04 — STANDING).**

    **`docs/OPEN_ACTIONS.md` is the ONE place Mike looks for what is open**, and
    every round updates it in the commit it seals. A round that closes an item
    flips its status; a round that exposes one adds a row. Rows carry: what it
    is in one line · where it came from · status (OPEN / IN PROGRESS /
    RULED-AWAITING-BUILD / DONE) · owner (Mike / Ops / Code) · the date raised.

    **The failure it exists to end:** findings were being reported honestly and
    then buried. Every round since v40 has written a *"what this exposes"* or
    *"carry-forward"* section, faithfully, into a round log nobody re-opens —
    and the operator's own words for the state of it were *"Mike has no way to
    see what is already reported."* Reporting is not the same as recording. The
    round log stays the narrative; **the register is the ledger.**

    It is not a priority order and it does not say what to do next. Everything
    in it is open; sequencing is Mike's.

15. **THE RECORD APPROVAL GATE (Mike, 2026-08-04 — STANDING).**

    **Final sign-off on a Record is Mike personally inspecting EVERY thing
    presented in it. Ops ensures nothing escapes that inspection.**

    Wired to `provenance/asset-table.json`'s `verdict` field, which is **unset
    by default and is never written by Ops**:

    - `npm run assets:checklist -- --room <slug>` prints the inspection — every
      presented asset, what it is, its dimensions, Ops' quality read, and which
      file shows it.
    - `npm run assets:gate -- --room <slug>` exits 1 while any presented asset
      lacks a `pass`. A scope that matches nothing also fails, because a gate
      that matched nothing has not passed.

    **IT IS NOT A PACKET GATE AND MUST NOT BECOME ONE.** lint, build and
    `provenance:gate` run on every commit because they check things Ops can fix.
    This one checks whether MIKE HAS LOOKED, and putting it in the packet would
    block every commit on an inspection nobody has been asked for — the exact
    opposite of Mike's own condition, that **he must not have to perfect assets
    in advance.** Slots move, things change, some assets are never needed. The
    gate is run against one Record when that Record is being signed off.

    **What it cannot do:** it records that a verdict was given, not that the
    inspection was careful. And `provenance/assets.json` is keyed on the PATH,
    so an approved picture can be replaced under its own verdict and nothing
    fails. Both holes are stated in `provenance/README.md` §4.

16. **THE LAW OF SUBTRACTION (Mike, 2026-08-04 — STANDING, site-wide).**

    > **If it does not help, it hurts. If it does not need to be there, it needs
    > to not be there.**

    Given while striking the `/robots` tally card, with his reason attached:
    *"it speaks out loud about something not meant to be spoken out loud and
    dilutes the experience."*

    **IT IS NOT DOCTRINE 11 RESTATED, and the case that produced it is the
    proof.** Doctrine 11 tests a line's SUBJECT — does it describe the making of
    the museum rather than the collection. "Thirty-one and a half" is a fact
    about the collection. It passed the visible-line test on every reading, it
    was true, it was the wing's best line, and setting it at 132pt still made the
    loudest object on the front desk out of the one number whose entire value is
    that it is never explained. **Nothing was wrong with it except that it did
    not need to be there.** Doctrine 11 could not have caught it; this one is
    written so the next one gets caught.

    **The test is necessity, and the burden sits on KEEPING.** Ask of any object,
    control, count, caption, badge or line: what is lost if it goes? If the
    answer is "nothing a reader would miss", it goes. A thing that is merely
    harmless is not passing — harmless costs attention, and attention is the only
    currency a free museum takes.

    **Where it lands hardest:** a device built to show the operator a choice
    (see §5's routing row — three query-parameter variants have now been
    retired), a second object saying what the first already said, and any
    typographic set-piece whose size is doing work its content cannot carry.

    **Its neighbours.** Doctrine 11's corollary is *empty and honest beats
    populated and false*; this is the harder version — **empty beats
    unnecessary, even when the unnecessary thing is true.** Where 11 and 12 say
    do not INVENT, this says do not KEEP.

    **What it does not license.** It is a reason to delete, never a reason to
    delete QUIETLY. Everything struck under it is named in the round log and,
    if it leaves a gap, given a row in `docs/OPEN_ACTIONS.md` — the FAQ face lost
    its only picture to this law on the day it was written, and that is register
    M29 rather than a silence.

    Mirrored in `STATE.md` as THE LAW OF SUBTRACTION.

17. **ONE PASSAGE, ONE DECLARATION (Mike, 2026-08-06 — STANDING, site-wide).**

    > **If the same passage is in two rooms, one of them is the source and the
    > other one references it.**

    Given as the first and most structural of the CLEAR THE DECK instructions,
    with his reason attached: *"the same content exists in multiple rooms with no
    link between the copies, so fixing one never fixes the other and neither Mike
    nor Ops can tell from a screenshot which copy he is looking at. He edited the
    contact answer once and it survived elsewhere; that is the defect, not his
    memory."*

    **THE LAST SENTENCE IS THE DOCTRINE.** A duplicated passage does not fail on
    the day it is written — both copies are true then. It fails on the day
    somebody edits one, and the failure lands on the person who edited it, as a
    doubt about whether they remembered to. **The defect is not the drift; it is
    that the tree gives an editor no way to tell.**

    **WHAT COUNTS.** A sentence about the HOUSE that more than one room has to
    say — the keeper, the address, the standing terms — and any content one
    surface derives from another (a catalogue, a count, a menu). What does NOT
    count: a room's account of itself, an artist's own material, and repeated
    source citations, which are one citation per fact rather than one passage in
    many places.

    **HOW.** An import, not a copy. `src/data/house-copy.js` for cross-room
    passages; a module constant for twins inside one file;
    **derivation where the second copy is a mirror of data** — that is the
    stronger form, because it deletes the copy instead of linking it.

    **TWO CONSTRAINTS THAT ARE NOT OPTIONAL.**
    - **The hoisted string stays a plain literal.** `provenance:gate` sweeps for
      string literals, so a hoist keeps the passage inside the boundary and
      collapses N register rows into one. A passage assembled by interpolation
      falls OFF the boundary in silence, which is a worse defect than the
      duplication it was curing.
    - **Where two copies have DIVERGED, they are REPORTED and not merged.**
      Choosing between two live wordings is a decision about what the museum
      says, and that is Mike's. Four such pairs were found on the day the
      doctrine was given and all four are register rows.

    Paid for by a hand-typed mirror of Hunter Root's whole catalogue at
    `/hr/archive`, which survived six museum-wide figure sweeps — two whole
    records missing, four songs filed under the wrong record, every figure on the
    page a count of the mirror — because a sweep looks for FIGURES and this was a
    second COPY. It was deleted rather than corrected: **a corrected mirror is a
    mirror that will drift again.**

18. **IN-STORY TECHNICAL SPECIFICATIONS (Mike, 2026-08-06 — STANDING, site-wide).**

    > **"Technical Specifications" means THE IN-STORY SPECS, NEVER THE REAL
    > ONES.**

    Given as a global standard with the instruction to record it as law, and
    with his own forecast attached: ***"this drifts back easily."***

    **WHAT A SPECIFICATION SURFACE IS.** Any surface whose subject is *what the
    machine is* — its particulars, its capacities, its declared behaviour. Today
    that is the two `Technical Specifications` faces in `/robots` and the
    manual's Section II in the robots repo. It is defined by SUBJECT, not by
    heading: a face that starts listing the machine's components becomes one the
    moment it does, whatever it is called.

    **WHAT MAY NOT BE ON ONE.** The board's part number, the source-tree
    filenames, the module list, the bench sketch count, the count of lines of
    source, the I²C addresses, the pin numbers, the validation state of the
    workshop, and any calendar date of the real build. These are all TRUE. They
    are the provenance of a prop, and **a spec sheet is not a provenance
    record** — the museum has three other places that carry provenance properly
    (the asset table, the register, the accession lines) and every one of them
    is the right home for a fact this rule evicts.

    **WHAT IS NOT COVERED, AND THE DISTINCTION IS THE WHOLE OF IT.** The Record
    is this house's log of receiving the object THIS YEAR: a sealed modern bag,
    a USB-C adapter, a slow charge. All modern, all correct, all on a surface
    whose subject is *now*. The booth answers as the house. Accession numbers
    and sources lines are provenance, which Doctrine 11 explicitly ships. **The
    rule is about which machine a spec sheet is describing, not about banning
    the present tense.**

    **WHY IT DRIFTS BACK, WHICH IS THE PART WORTH KNOWING.** The real facts are
    the ones Ops can VERIFY. A session looking for something true to put on a
    spec sheet reaches for the firmware tree every time, because the firmware
    tree is the thing it can read — and it will feel like diligence while it
    does it. The face this rule was given about had a comment on it saying *"not
    one fact below is new"*, written in good faith, one round before the rule.
    **Recording the law does not stop it; a gate does.**

    **THE GATE.** `npm run instory:gate` (`tools/instory-specs.mjs`) reads the
    spec surfaces out of the album data — by walking it, not by grepping a file,
    so a face that moves file keeps its scope — and fails on seven classes of
    real-build tell. `npm run instory:all` widens the same scan to every face in
    the fiction and is an AUDIT, never a gate, for the reason above. The escape
    hatch is a declaration with a written reason per entry, the same arrangement
    as `reveal/delivery.mjs`'s signage carve-out; **an allow with no reason fails
    the gate.**

    **AND THE SUPPLY LINE IS CONTAMINATED AT THE SAME SEAM**, which is the
    finding the audit produced rather than the instruction. Six rows of the
    in-story manual's own SPECIFICATIONS section are marked `FITS` in
    `weird-baby-robots/docs/MANUAL_STRUCTURE_FIT-20260805.md` with the real
    Arduino firmware cited as their source — and one of them lets the firmware
    WIN a contradiction against the in-story manual (`NUM_PIXELS = 2` over the
    manual's *"one lamp"*). Under this doctrine that is backwards: the in-story
    manual is the authority for the in-story spec, and the real firmware is not
    evidence about a 1965 machine at all. Nothing in that repo was changed on
    Ops' word; it is register row **N-i**.

    Paid for by a spec sheet that answered *what does it do technically* with
    `BOARD Uno R4 WiFi` and `PROGRAM v0.1 · 2026-02-23 · 1,385 lines`, under a
    heading reading MGK-NIAC, on a machine the same wing dates to 1945.

19. **THE EXPANDER RULE (Mike, 2026-08-06 — STANDING, site-wide).**

    > **Opening or closing a record MOVES WHAT IS BENEATH IT; THE PERSISTENT
    > PART STAYS EXACTLY AS IT IS — no shift, no reflow, no scroll jump above
    > the change.** Apply everywhere a surface expands, not just the Record.

    **THE VERTICAL AXIS WAS ALREADY HONEST AND THE HORIZONTAL ONE WAS NOT**,
    which is the whole finding. Native `<details>` pushes what is below it and
    touches nothing above; the booth's accordion measured **0 of 24** elements
    above it moving, the wing FAQs **0 of 47**, open and closed. Two things were
    breaking it, both invisible to a reading and both found by measuring:

    - **The scrollbar.** Opening Record 013 takes the document from 780px to
      1347px, which crosses the viewport height, so the vertical scrollbar
      appears and the viewport goes **403 → 390**. Every centred thing shifts
      left 6.1px and every right-anchored thing 12.2px: **18 elements above the
      change**, including the title bar's exit and all four covers. Fixed by
      `html { scrollbar-gutter: stable }` in `src/index.css` — the platform's own
      mechanic (Doctrine 8), on the ROOT, because the defect belongs to the
      viewport and not to any expander. That is what makes it satisfy
      *"everywhere a surface expands"* without a single expander knowing.
    - **A shared grid row.** Stacked at ≤720px the exhibit's two rows shared
      slack, so when the viewer's content grew past the window the tracklist
      collapsed **140 → 80px** and everything under it — including the face's own
      heading — came up 60px. Fixed by `grid-template-rows: max-content 1fr`.

    **THE INSTRUMENT IS THE POINT, because this rule cannot be read off source.**
    `anchorTest` in `tools/lap/harness.html` records the position of every
    element above an expander, toggles it, and reports what moved. Run it on any
    new expander; **zero above is the rule, and movement below is the correct
    answer** rather than a second failure. After the two fixes: 0 of 35 above at
    scrollY 0, 200 and 400, open and closed, at 390px and at 1228px.

    **The cost is stated rather than absorbed:** a page short enough not to
    scroll is now ~13px narrower. A constant 13px nobody can see beats an
    intermittent 13px that moves the furniture.

20. **THE BOUNCY BALL LAW (Mike, named 2026-08-02 — CORRECTED 2026-08-07 —
    STANDING, site-wide).**

    > **It caps POINTS OF FOCUS, not ASSETS.** Humans remember one or two
    > things; ten things reduces the odds they keep the one that matters.
    > **IT DOES NOT MEAN WE MAY NOT SHOW MORE PICTURES.**

    **TWO BUCKETS, AND THEY ARE A PARTITION.** Everything the museum can put in
    front of a reader is in exactly one:

    - **THE PRECIOUS BUCKET** — genuine reveals, **two or three A WEEK**. These
      are what a reader remembers, and the ceiling is on THEM.
    - **THE DUMP BUCKET** — everything else. Fun to look at, part of the story,
      part of the pile. **NO CEILING.** Ten manual pages arriving is **ONE**
      point of focus — *we got more of the manual* — not ten.

    **THE CORRECTION IS A CHANGE OF UNIT AND OF PERIOD, AND THE ORIGINAL
    SENTENCE WAS NOT FALSE — WHICH IS WHY NOTHING CAUGHT IT.** The law was
    carried as *"never more than two or three offerings in a day"*. Ops supplied
    the wrong unit twice: once in the rule's own bearing line, and once in the
    tracker, which divided a count of **photographs** by a ceiling on
    **attention** and printed **"16 pictures = 6–8 days of material"**. Every
    input was a real measurement and the arithmetic was sound. **That figure is
    VOID** and is kept, with its cause, in `reveal/focus.mjs` `VOIDED` — a
    superseded number that is merely deleted comes back the next time somebody
    does the obvious arithmetic.

    **WHAT A TRACKER MAY SAY, AND THE ASYMMETRY IS THE MECHANISM.** Precious has
    a ceiling over it, so it divides into **weeks** and the weeks mean
    something. Dump has no ceiling, so it divides into **nothing** — it is a pile
    size. `runways()` in `reveal/focus.mjs` is structurally unable to print a
    runway for the dump bucket, because printing one would re-commit the
    original error in the other bucket.

    **AND THE BUCKET IS MIKE'S, UNSET, AND OPS DOES NOT DERIVE IT.** `bucket`
    (`precious` | `dump` | `null`) is the sixth JUDGED field on
    `provenance/asset-table.json`, beside `verdict` and `revealArc`, carried
    across a scan and never written by a scan. It is null on all 404 rows
(re-measured 2026-08-17; the line said 315, then 385), so
    every runway today is a **bound** rather than a number and says so. A
    heuristic — *a machine photograph is precious, a manual page is dump* —
    would make every tracker read as answered while nothing had been answered,
    which is the same class of defect as the void figure with better manners.
    Doctrine 12 governs it: the gap prints as a gap. Open row: `B-a`.

21. **EVERYTHING IN THE FORM IS STORY (Mike, 2026-08-08 — STANDING,
    site-wide).**

    > **"EVERYTHING IN THE FORM IS STORY. The worksheet is a story instrument,
    > not a project log — in-story always."**

    **IT IS A RULE ABOUT THE INSTRUMENT, NOT A RULING ON ONE ENTRY, AND THAT IS
    THE WHOLE POINT OF IT.** It was asked for as one word about Record 001 —
    open row `S-a` — and answered one level up. **Material that arrives through
    the dictation instruments** (`tools/dictation/` → `worksheet.html`, and the
    Record entries dictated into it) **is in-story by construction**, so
    Doctrine 11 is satisfied AT THE INSTRUMENT and is not re-adjudicated at each
    entry.

    **WHY THE GENERAL FORM IS WORTH MORE THAN THE ANSWER.** S-a was going to
    recur on every dictation. A launch, a server, a decision taken at 23:30 read
    two ways from the text alone — an event in the record, or a report about
    building this website — and under a per-entry test each one sits on the
    glass while Ops waits for a word. The instruments are in-story; what comes
    out of them is in-story; the question does not get asked again.

    **WHAT IT DOES NOT DO, STATED SO IT IS NOT OVER-READ. It does not exempt
    Ops' own prose, anywhere, including inside a Record entry.** A line whose
    subject is the drafting, the round, the renderer, the register or the form a
    page takes still fails Doctrine 11 at any visible address. The doctrine
    covers material that arrives THROUGH the instruments — not everything that
    ends up near it, and not the house's sentences about the house.

    **AND IT DOES NOT LOWER THE PROVENANCE BAR ONE STEP.** In-story is not
    unsourced: every string that comes through a form is still declared `MIKE`
    against a round log that quotes the dictation in full, because a class that
    says *this is story* would otherwise be a licence to write story. First
    application: `docs/MUSEUM_RECORD_001_LOG-20260808.md` §0.

22. **A LIMIT IS SHOWN WHERE THE STRING IS WRITTEN (Mike, 2026-08-08 —
    STANDING, every instrument).**

    > **"He must never again discover a limit from a report."**

    The case: the worksheet let him compose a **477-character** executive
    summary against a **130-character** index row, said nothing, and the
    mismatch surfaced **three rounds later** from a gate. Every part of that
    worked as designed. The row could not truncate, the gate refused the
    overflow, the number was correct and documented. **What none of them did was
    reach the person writing the string, at the time he was writing it.**

    **SO A CONSTRAINT NOW HAS THREE HALVES AND THE THIRD IS NEW.** A render that
    cannot lie; a gate that refuses; **and a live count on the field, at the
    moment of writing.** The first two both fire after the writing is finished,
    and two mechanisms that both fire late cost a rewrite.

    **THE HARD RULES.**

    - **ONE DECLARATION, EVERY READER.** A budget lives in one module and is
      IMPORTED by the gate, by the instrument and by any page that documents it
      (`reveal/record-shape.mjs`). A counter carrying its own copy of a number is
      a budget that quietly stops agreeing with its gate. If a constant cannot be
      imported because it lives in a script, **that is the defect** — move it.
    - **WARN, NEVER BLOCK.** No `maxlength`. An input that refuses the next
      character has made the decision for him mid-sentence and thrown the rest of
      the thought away. Show the count, show by how much, name the command that
      will refuse it.
    - **COUNT WHAT WOULD BE SAVED**, not the raw field. A meter that disagrees
      with the gate lies in the safest-looking direction.
    - **SAY WHERE THERE IS NO LIMIT.** An absent counter must read as *nothing to
      fit*, not as the oversight this doctrine exists to fix — one sentence per
      page is enough.
    - **THE WARNING TRAVELS.** An over-limit answer carries its own number into
      whatever leaves the instrument. A length problem visible only in his
      browser is the same failure one step later.
    - **AND THE AUDIT IS OF EVERY SLOT, NOT THE ONE THAT BIT.** His instruction
      said so explicitly. The audit that followed found the real defect was not a
      missing counter at all: **the constrained field had never been asked for.**
      A meter on the wrong field would have policed something unbounded and still
      never asked for the thing with a limit.

    Mechanism: `reveal/record-shape.mjs` (`BUDGETS`, `FORMATS`, `CONSTRAINTS`),
    the counters in `tools/dictation/worksheet.mjs`, the table at
    `reference.html#entry-shape`. **A constraint that no gate catches is marked
    `silent: true`** — six of the seventeen — because those are the expensive
    ones. Round log: `docs/MUSEUM_INDEX_LINE_LOG-20260808.md`.

23. **THE RECORD'S REGISTER — EMAIL-LIKE, NOT AN EMAIL PROGRAM (Mike,
    2026-08-08 — STANDING, the Record and anything that inherits it).**

    > **"THE RECORD IS EMAIL-LIKE. IT IS NOT AN EMAIL PROGRAM. Do NOT build mail
    > chrome — no From, no To, no Subject line, no reply affordances, no inbox,
    > no message headers, no envelope furniture of any kind. What is borrowed is
    > the REGISTER ONLY: the plainness and the attachments-at-the-bottom
    > convention. Everything else stays what it is."**

    > **"It is modern times inside the story, so the writing may look modern —
    > but the aesthetic is a SMOOTH TRANSITION FROM THE 1960s WORLD by way of
    > being EXTREMELY SIMPLE. Plain Arial-class sans, BOLD AT MOST, no display
    > faces, no ornament, no editorial typography. It should read like an
    > engineer writing a progress report or keeping a log."**

    **THE BOUNDARY IS THE LOAD-BEARING HALF AND IT IS FIRST FOR THAT REASON.**
    Two things were reached for while building the attachments and refused as
    mail chrome: a count beside the ATTACHMENTS label, and a per-row open
    control separate from the thumbnail. Neither is wrong as UI; both are a mail
    client. The test is not *is it useful* — it is *would a mail program have
    it*.

    **THE FACE IS A SYSTEM STACK AND LOADS NOTHING.** `--wb-plain` in
    `museum-tokens.css`: Arial first, literally. A designed face — even a plain
    one this museum already loads — is a choice, and *extremely simple* is the
    instruction. `--wb-read` and `--wb-serif` are untouched; every other surface
    reads as it did.

    **BOLD AT MOST IS A CEILING ON WEIGHT AND ON EVERYTHING ELSE.** No italic
    (the tombstone lost its), no display step, no tracking beyond what stops
    all-caps labels closing up.

    **SCOPE, AND THIS IS THE PART A FUTURE ROUND WILL GET WRONG.** The Record's
    index row is built from `.vp-fe`, `.vp-fe-title` and `.vp-fe-line`, which are
    the **shared** entry-list classes — the FAQ, Worth A Listen and every face
    that prints entries use them. **Every rule of this register is scoped inside
    `.vp-rec-index` or targets a `.vp-rec-*` class.** Restyling a bare `.vp-fe-*`
    rule retypes four faces to serve one. The check is a cascade probe: the same
    class inside and outside a Record index must compute different families.

    **AND THE MUSEUM'S CHROME IS NOT IN SCOPE.** The paper ground, the border,
    the wing furniture and the register lines that are DATA rather than prose
    (the dateline, the stamp, the index mark rail — still Courier Prime) were
    left alone. When in doubt, change less; the boundary says everything else
    stays what it is. The two open calls are `A-a`.

    **AND THE PLAINNESS IS SPACING AS WELL AS TYPE [T2 2026-08-08].** *"Tighten
    the line spacing further, and cut the WASTED WHITE SPACE GENERALLY — not just
    leading."* The Record has **its own rhythm ladder**, four steps, Record-only:
    `--rec-hug` .30 (a heading and the thing it labels) · `--rec-para` .40 · 
    `--rec-block` .55 · `--rec-sect` **1.15** (the house's is 2.6). R1's `--rh-*`
    is untouched and still paces every other flat block — tightening it would
    retune /wal and /foundation to answer a complaint about the Record.
    **AIR GOES ABOVE A HEADING, NEVER BELOW**, and a heading hugs its own text
    nearly four times closer than it sits from the section above it; that ratio is
    what lets a tight document still scan by its headings.
    **THE LEADING FLOOR IS 1.35 AND IT IS SET BY THE MEASURE, NOT THE FACE** —
    the eye returns along the leading and a 68-character line needs more of it
    than a 45-character one. The body sits at **1.40**, above the floor rather
    than on it (`A-b`). **A round that narrows the measure may spend some of
    that; a round that tightens leading without narrowing the measure may not.**
    **AND THE TYPEWRITER STAYS ON THE MACHINE'S OWN MARKS** — the dateline, the
    register stamp and the index mark rail keep Courier Prime, ruled 2026-08-08:
    *"those are the machine's own marks, not the writer's words."* The register
    governs the WRITER'S WORDS.

    Mechanism: `--wb-plain`; the `.vp-rec-*` block and the `.vp-rec-index` block
    in `Exhibit.css`; `RecordAttachments.jsx` + `attachmentsOf()`;
    `DRAWN_ENTRY_FIELDS` in `tools/reveal-ledger.mjs`. Round logs:
    `docs/MUSEUM_ATTACHMENTS_LOG-20260808.md` and
    `docs/MUSEUM_TIGHTEN_LOG-20260808.md`.


24. **ONCE IT IS RULED GONE, IT IS GONE FROM HIS VIEW (Mike, 2026-08-08 —
    STANDING, every surface Ops builds).**

    > **"Once he says get rid of something, HE NEVER WANTS TO SEE IT AGAIN.
    > Anything ruled crap or irrelevant is removed from his view for good — not
    > archived where it resurfaces, not listed in a tracker, not carried in a
    > register as a closed row he has to scroll past."**

    **IT BINDS THE TRACKERS AND REGISTERS, NOT ONLY THE FILES**, and that is the
    half a session will forget. Doctrine 14 said a round that closes an item
    flips its status in `OPEN_ACTIONS.md`. **That is now wrong**: a closed row
    LEAVES. The register carries only what is open, because it is the one page he
    was told is the one place he looks, and on 2026-08-08 **more than half of it
    was finished business** — 59 closed rows, 14 struck short-list rows and eight
    whole `CLOSED IN <round>` sections.

    **OPS' HISTORY STILL EXISTS AND IS NOT HIS VIEW.**
    `docs/OPEN_ACTIONS_CLOSED.md` answers *did we already rule on this* and is
    **deliberately absent from the Ops desk**. The test is not *is it archived*,
    it is *will he meet it again*. A link to it from any page he opens breaks the
    rule.

    **A DELETED THING IS NAMED ONCE AND NEVER AGAIN.** The round that kills
    something names it in its own log, because a report he asked for is not a
    surface he browses. Nothing else keeps the list: not a tracker, not a
    `PLATES.md`, not a struck row, not a "formerly" note.

    **AND THE PRUNE HAZARD APPLIES INSIDE ONE FILE.** Removing rows orphans the
    links that pointed at them; 67 were flattened to plain text on the day. Check
    anchors, flatten or repoint, then prune — §9's own procedure, one level down.

25. **THE TOOLS ARE FOR WORKING, NOT FOR BRIEFING (Mike, 2026-08-08 —
    STANDING).**

    > *"All the stuff at the top, I never read."*

    Every Ops instrument had grown an opening explanation. **The measurement is
    the argument:** at 390px, the first control a person could use on the
    artifact tracker was **2014px** down the page; on the spec sheet **2474**; on
    the worksheet **1524**; on the register **1537**. Those are three to six
    screens of prose before the tool starts.

    **IT IS NOT THE SAME RULE AS THE LAW OF SUBTRACTION AND THE WORKSHEET IS THE
    PROOF.** Doctrine 16 asks whether a line is NEEDED. Every paragraph struck
    here was needed by somebody — the syntax of a section heading, the format of
    a date, what a coloured band means. What was wrong was WHERE they were. So
    the rule has a construction clause and it is the whole of the fix:

      a thing worth knowing goes **ON THE FIELD**, **IN THE FOOTER**, or on
      **`reference.html`** — and never above the work.

    If it fits none of those three, **Ops raises it in conversation**. It does
    not go on a page he has to read past. `reference.html` exists because he
    ruled it into existence — *"if it is reference, write it as such"* — and a
    page that explains the machine is legitimate the moment it is opt-in.

    **A LEGEND IS NOT A BRIEFING, AND THE TEST IS WHETHER THE PAGE IS UNREADABLE
    WITHOUT IT.** The arc's three bands and the egg tracker's three states carry
    meaning printed on every row; they survive as ONE line of inline chips
    rather than a boxed note of five paragraphs.

    **AND THE PREAMBLE GROWS BACK.** `week1.html` was split into a worksheet and
    a reference page on 2026-08-07 for exactly this complaint. **Three rounds
    later the worksheet's masthead was seven paragraphs.** That is why this is a
    doctrine and not a cleanup: the pressure that writes a preamble is a round
    wanting credit for what it understood.

26. **LEAD WITH WHAT HE MUST DO OR DECIDE (Mike, 2026-08-09 — STANDING).**

    Every report to Mike opens with **what is waiting on him**: the decisions,
    the one-word rulings, the commands he has to run. Nothing else appears
    unless it changes something for him.

    **THE TEST IS NOT *is it true* AND IT IS NOT *is it interesting*. It is
    *does this change what he does next?*** Craftsmanship notes, measurements,
    before-and-after numbers, methodology, the finding a round is proudest of —
    all of it belongs in the round log. The log is where a future session reads
    it. He is not a future session.

    **IF A ROUND HAS NOTHING FOR HIM, SAY SO PLAINLY AND GIVE HIM THE COMMANDS.**
    *"Nothing here needs you. Mirror and deploy."* is a complete report; the
    command it names is in §0 DEPLOY — THE ONLY ACCOUNT. Padding it with what
    the round achieved converts an empty ask into a page he has to read to
    discover it is empty — which is the same
    cost Doctrine 25 measured on the instruments, charged to a message instead of
    a page.

    **IT IS DOCTRINE 25 FOR PROSE, AND THE SAME CONSTRUCTION CLAUSE APPLIES.**
    A thing worth keeping goes in **the round log**, in **`OPEN_ACTIONS.md`** if
    it needs him later, or in **`OPERATIONS.md`/`STATE.md`** if it binds future
    work. Never in the opening paragraphs of a report as evidence of effort.

    **AND A GATE TABLE IS NOT A DECISION.** Gate results are proof that the work
    is safe to accept, not a thing he acts on: one line at the end, or nothing if
    they all passed and he has been told they always run.

27. **AN ASSET CULL ASKS WHAT BUILDS FROM A FILE, NOT ONLY WHAT DISPLAYS IT
    (Mike, 2026-08-20 — STANDING).**

    A picture may have two jobs. Judging it on the one you can see is how a
    live surface gets deleted by a round that thought it was tidying a wall.

    **IT HAS BEEN PAID FOR TWICE, ON CONSECUTIVE DAYS.** `monitor_base.png`
    went on 2026-08-12 with the nine photographs; `MGK-TWIN_MONITOR_SCREEN_BEZEL.png`
    went on 2026-08-13 under M7 (*three of the nine plates do not show what
    their captions say*). Both rulings were right **about the wall** — as
    standalone pictures they were a flattened composite and a frame graphic
    with a hole in it. Neither round knew that `twin.html` **probes the first
    one to decide whether the Portal exists at all** and **composites the
    second one over the feed every time it draws**. The Portal was dead from
    12 August and nobody met it until 20 August.

    **THE TEST IS NOT *does a wall show it* — IT IS *does anything LOAD it*.**
    A file's row in `provenance/asset-table.json` records what the picture IS.
    Nothing in the table records what READS it, and that is the gap.

    **WHY NO EXISTING INSTRUMENT CAUGHT IT, WHICH IS THE SHARP PART.**
    `assets:orphans` reported `monitor_base.png` the whole time — a row whose
    file is not on disk. **It had the fact and could not say the consequence.**
    An orphan reads as dead bookkeeping, and dead bookkeeping is exactly what
    it looks like right up until something was still loading the file.

    **WHAT WOULD HAVE CAUGHT IT, AND WHAT IT COSTS — SCOPED, NOT BUILT.**

    - **A REFERENCE CHECK IN `assets:cull` (recommended).** Before deleting,
      search the source trees — `src/`, `index.html`, `public/**/*.html`,
      `tools/` — for the file's basename, and **refuse** with the hit list if
      anything names it. **It catches both files:** each appears as a literal
      basename beside its consumer (`base + "monitor_base.png"`,
      `base + "MGK-TWIN_MONITOR_SCREEN_BEZEL.png"`). Cost: **about half a
      round** — one walker with an extension allow-list, one refusal path, and
      a proof that injects a reference and watches it refuse. Its hole is
      stated up front: a filename **assembled** at runtime from pieces is
      invisible to a basename search. The two that bit us were not.
    - **A MANIFEST OF BUILD INPUTS (not recommended).** Every file a live
      surface loads, declared, with a gate that fails when a declared input
      leaves the disk. Cost: **more than a round**, and it carries the failure
      it is meant to remove — **an input nobody declared is invisible to it**,
      so it is only as good as the hand that keeps it, whereas a reference
      check reads the code that actually loads the file.

    **AND THE SAME QUESTION ASKED THE OTHER WAY ROUND HAS THE SAME ANSWER:
    READ THE GENERATORS, NOT THE OUTPUTS** (2026-08-20, the round mark).
    Asked whether a bare Weird.Baby mark existed, Ops opened the two COVERS
    that carry it, found the mark composited onto a beige ground with the baby
    breaking the circle, and reported that no separable mark existed anywhere.
    **It existed, at `public/WeirdBaby_PhotoID.png`, 2048x2048 RGBA with a
    transparent margin, and it is named on LINE 26 of `make_robots_cover.py`
    and line 54 of `make_house_covers.py` as `MARK`** — opened
    `.convert("RGBA")` and passed to a helper whose docstring reads *"Bounding
    box of the mark's own ink, ignoring transparent margin."* The transparency
    was declared in the code the whole time.
    **THE RULE IS MECHANICAL: a script that composites a thing onto a ground
    MUST have that thing as a separate input.** So when the question is *does
    this asset exist*, the generator's inputs are the answer and its outputs
    are not. It is Doctrine 27's own class read backwards — there, an asset was
    judged by how it looked standing alone and its role as a build INPUT was
    missed; here, an asset was judged by the OUTPUTS it appears in and its
    existence as an input was missed. **Both are the same failure to ask what
    builds from what.**
    **AND A CASE-SENSITIVE GREP IS NOT A SEARCH.** The same round then reported
    a tile "does not exist" on a grep for `Current Project`; it is
    `CURRENT PROJECTS`, in caps, in the file already open. Search
    case-insensitively before concluding absence.

    **UNTIL ONE IS BUILT, IT IS A HUMAN STEP AND IT IS ONE LINE:** grep the
    basename across both repos before a cull, and if anything outside the
    asset table names the file, the cull is a code change and not a cull.

