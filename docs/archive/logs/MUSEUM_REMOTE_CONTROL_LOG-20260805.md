# THE REMOTE-CONTROL ROUND — P1–P11, 2026-08-05

**Eleven instructions from Mike, straight down the wire. Ten built, one handed
back with the reason, and the one handed back is blocked by a ruling he made
himself the round before.**

Gates: lint **11 errors / 9 warnings = baseline, zero new** · build green ·
`provenance:gate` **PASS** (0 undeclared strings · 0 undeclared assets ·
INVENTION 0) · `reveal:check` **PASS** · `parity:gate` **PASS** (and proved by
breaking it) · surfacing **13 · 13 · 15 — unmoved.**
Register: **P1–P11 closed as §5i; M36, M47 and M54 closed; M57–M64 opened.**

---

## THE HEADLINE FINDINGS

**1. HE REVERSED AN OPS RULING FROM THE PREVIOUS ROUND AND HE WAS RIGHT, AND
THE THING THAT MADE IT WRONG IS VISIBLE ONLY FROM OUTSIDE A SNAPSHOT.** P1 (the
parity ruling, that morning) held that a holdings gap RESOLVES a menu
divergence — *NIAC's menu shows what NIAC has* — and its argument was THE STUB
LAW's own: forcing parity would print a manual face with no manual behind it.
That argument is airtight about the holdings **as they are today** and blind to
the only thing that matters: **the material is coming.** A row is a promise
only when nothing is behind it and nothing is on the way. A menu that hides a
shelf until the day it fills is a menu that rearranges itself under a returning
visitor. The reversal is written into `tools/menu-parity.mjs`'s header, into
the data where the two new rows live, and into this log, because an Ops ruling
that quietly disappears is worse than one that was wrong.

**2. THE FIRST PHOTOGRAPH OF THE MAINFRAME WHOLE EXISTED ALL ALONG, 58 SECONDS
INTO A VIDEO THIS REPOSITORY HAS BEEN CITING FOR TWO DAYS.** The wing's own
tombstone said *"Withheld — no plate carries the whole cabinet"*, its blurb said
*"never shown whole"*, and its poster caption said *"shown nowhere whole"* —
three true sentences about the museum's HOLDINGS, all of which stopped being
true the moment somebody scrubbed the source file the six existing plates were
cut from. What was withheld was never really the cabinet; it was the ROBOT, and
the robot is still out of every frame in this wing.

**3. A FACE WAS ADDED TO /wb AND THE MUSEUM'S LAST PAGER FELL OUT OF IT.** M1's
no-hidden-information law — *card-advance buttons are a sneaky way of adding
pages* — was applied to /robots and /wal and not to /wb, for the honest reason
that **/wb had never declared a face**, so there was nothing for the packer to
cut up and the wing looked compliant by having no content. ABOUT THE ARTIST
came up as **"Page 1 of 4"** with the register, all three answers and the footer
behind a button whose label says nothing about what is behind it. The defect
would have been introduced BY this round. `faceFlow: "flat"`, and the Stage is
now mounted by nothing anywhere in the building.

**4. THE SIZE HALF OF "SESSION DEFAULTS" HAD BEEN BUILT FOR ONE WING OUT OF
FOUR SINCE 2026-08-02.** F3 gave `usePersist` a session scope and then handed it
out only to wings declaring `fitOnEntry` — which is /wal and nothing else. So
/hr, /wb and /robots have been restoring a dragged split and a dragged carousel
height **across visits, across months, and onto a different window on a
different machine** — which is precisely the failure F3's own note describes and
left true in three rooms out of four.

**5. TWO PLATES WERE RENDERED FOR THE PORTAL'S NEW COVER AND BOTH WERE
REJECTED, EACH BY A FINDING THE MUSEUM HAD ALREADY MADE ABOUT ITSELF.** The
obvious badge is the front glass lit — the firmware actually running — and it is
the plate **M2** says is mirror-reversed, so the one album cover in this wing
carrying readable words would have carried them backwards. The second-obvious
badge is the bezel, *"the frame the Portal is met through"* in the wing's own
words, and it is **M7**: not a photograph at all but a compositing asset with a
knocked-out white rectangle where the screen goes. Both were built, looked at,
and thrown away. The badge that shipped is the machine's own aperture carrying
its own opening beat.

---

## P1 — PARITY IS ABSOLUTE

**What Mike said.** *"PARITY IS ABSOLUTE (Mike overrules the Ops ruling of the
prior round — record the reversal plainly): NIAC and VIIIp carry THE SAME MENU
ITEMS, no more, no less. The three gaps are TEMPORARY HOLDINGS, not design —
NIAC will run on the Portal on channels 1/2 and it will have a manual. So NIAC's
rows exist and say plainly what is not there yet. This OVERRIDES THE STUB LAW
for these rows and only these; record the exception and its reason (a row is a
promise only when nothing is coming — these are coming). Rewire parity:gate:
divergence is a failure, holdings-gap justifications no longer resolve it."*

**What shipped.**

- **MGK-NIAC gained The Manual and FAQ.** Both machines now read
  *Image Archive · The Manual · Technical Specifications · FAQ* — same items,
  same order, four each.
- **The Manual row needed the exception; the FAQ row did not.** Every answer on
  the mainframe's FAQ was already asserted in this file about these machines:
  *"Both units power on and run their own firmware"* is the portable's own
  answer about the PAIR, printed until now on only one of them; *"Can I buy
  one?"* is that face's answer verbatim, written about the machines plural from
  the day it shipped; and *"Is the mainframe on the Portal?"* is read off the
  feed drum, where two channels are engraved for it and neither arms. **Nothing
  was written to fill a shape.**
- **The Manual row states what is NOT held and stops.** No section list, no
  date, no page count, no schedule — the portable's manual face has a contents
  page because its sections are attested, and inventing six headings for the
  mainframe is the exact failure Doctrine 12 exists for. The exception permits
  the ROW; it does not suspend the doctrine inside it.
- **`tools/menu-parity.mjs` rewritten.** The `JUSTIFIED` table, the
  HOLDINGS · PROPERTY · DESIGN `kind` column and the ledger read that faulted
  the day a named holding arrived are all **deleted**. That ledger read was the
  best thing in the old file — it turned *"the flag clears itself"* from a
  sentence into a mechanism — and under an absolute rule it has nothing left to
  guard. **It is mourned in the header, with its commit named (`eccb0b0`), so
  that whoever ever softens parity again knows the mechanism existed.**
- **A duplicate-title check was added**, because set arithmetic cannot see two
  rows called FAQ on one album against one on the other.
- **Status changed: it is a PACKET GATE now.** Under the old ruling it reported a
  judgement, and a judgement cannot be a build blocker. Under an absolute rule it
  reports a fact with one right answer, which is what lint and build report.

**Proved by breaking it.** A file copy, one title changed, gate → **2 faults,
exit 1**; restored → **0 faults, exit 0**; `git diff --stat` clean of the test.

---

## P2 — THE PAGE ORDER, THE PORTAL, AND THE NAME

**THE RECORD SITS ABOVE THE FAQ.** The same two objects at swapped positions;
not one character inside either changed with the move. The FAQ's own new first
answer is written for it — *"Finish the FAQ, then follow The Record"* sends a
visitor UP the list on purpose.

**THE PORTAL IS ITS OWN ALBUM, SECOND IN THE DECK.** Placed second because the
deck lands on the front desk at index 0 and the carousel's ramp closes up as it
goes (F4), so an album past the third position is a cover decking against the
edge: second is the only position that is both top-shelf and not the landing.
The two machines keep their canon order behind it.

- The track is **Feed Control** and the face heading is **FEED CONTROL**, because
  the album band now reads THE PORTAL and a heading repeating it is the second
  object saying what the first said.
- **The drum, its eight engraved channels, the two switches, the dial, the latch
  and every held reason moved whole rather than being retyped.**
- **What it costs, stated:** the p in MGK-VIIIp means PORTAL, so this album is
  where the object's own name argued for it to live. It is a property of the
  portable now sitting outside the portable's covers, and a visitor reading
  MGK-VIIIp top to bottom no longer meets it. That is the trade for visibility
  and it is his call.

**THE NAME IS DELETED IN TOTAL.** Track, face, five-row register, three entries.
Nothing was carried to another face. **Three things are now stated nowhere in
the wing** and they are [M59]: the two-names reconciliation, the
mainframe-against-portable comparison, and the reason the door reads MGK-NIAC
when the folder, the firmware and the parts all say MGK-VIII. The album title
still ANSWERS that last one; nothing EXPLAINS it. It closes **M36** by deletion
and it closed a parity divergence by subtraction — The Name was the one menu
item the mainframe had and the portable did not.

**It also freed a photograph.** `column_lit.jpg` was that face's plate and would
have become this round's orphan; it is the mainframe FAQ's still now, the same
double duty the bezel does on the portable.

---

## P3 — THE FAQ IS MIKE'S

Every answer is his, word for word. **Seven questions ship. One prints nothing.**

| his question | what a visitor sees |
|---|---|
| Where do I start? | *Finish the FAQ, then follow The Record.* |
| What is Weird.Baby Robots? | **nothing** — see below |
| Is this stuff real? | *The hardware is — you can hold it at least, and it is heavier than you expect.* |
| Does it work? | *See "Is this stuff real?"* |
| Can I buy one? | *Monitor the website for availability. Follow us on social media — those platforms track you, this site does not, and following one out of here is leaving the building.* |
| Can I try one? | his sentence, whole |
| How do I get in touch? | *papa@weird.baby* |

**THE TWO SLOTS ARE MARKED IN BOTH FIELDS, AND THAT IS A MECHANISM RATHER THAN A
FLOURISH.** `scrubFace` keeps an entry whose TITLE survives even when its line
does not (`Exhibit.jsx` :116) — so marking only the answer would print the
question with nothing under it, which is *a question whose published answer is
that the answer has not been written yet*, the exact row this wing deleted at
CS. Marked in both, the entry renders **nothing** and the slot stays in the data
where Mike's list of what he owes actually lives. Same path /foundation's
billionaires answer takes to the same end. **M57.**

**"Is this stuff real?" keeps his first sentence and loses his second by
design.** *"Leave the slot, describe it, write nothing"* — so the marker sits
INSIDE the sentence naming what is missing, and the scrubber takes the whole
clause. The description of what belongs there is preserved for him and printed
nowhere.

**THE TRACKING WARNING IS WRITTEN AGAINST THE BOOTH'S PRIVACY ANSWER, CLAUSE FOR
CLAUSE** — those platforms know you turned up, this site sets no cookie and
carries no pixel, and a door out of the building is a door out of the building.
**And the house has no handle on file:** nothing in this repository names a
Weird.Baby account on any platform. The sentence is his so it ships as written;
a handle is not something Ops may invent. **M60.**

**WHAT THE ROUND COST THIS FACE.** Four real passages of the wing's own copy
went with the questions that held them — the purveyor posture, the order of
work, W.O., the manual's holes, the originals, why we bother. Most of that is on
the faces whose subject it is. **The one with nowhere else to go is the old
START row**, which was the only line in the wing that said which door is which.
**M58.**

---

## P4 — THE RECORD'S NAVIGATION

**The proposal was "cursor keys, buttons, both" and the answer is both**, for a
reason: buttons are the discoverable half — a visitor who has never met this
surface can see what it does — and keys are the half that makes a binge painless,
because forty records is forty reaches for a mouse otherwise.

- **`RecordJump`**: NEWEST · OLDEST · **UNREAD** · INDEX.
- **UNREAD means the OLDEST record not yet opened**, not the newest unseen one.
  A Record is followed forwards — the front desk's own first answer says so — so
  the first unread is where a visitor catching up left off. Disabled rather than
  hidden once everything is read, because a control that vanishes when you finish
  is a control you cannot learn the meaning of.
- **Keys**: `←` `→` walk, `Home`/`End` jump, `Escape` closes.
- **THE COVERFLOW YIELDS THE ARROWS WHILE A RECORD IS OPEN.** Two `document`
  listeners in one phase cannot be ordered reliably, so the priority is a guard
  and not a race. **The cost is real and stated:** with a record open, `←` `→`
  will not walk the carousel.
- **The index marks unread rows** with a rule down the left edge — not a dot,
  because the index is a register of ruled rows and a dot would be the one round
  thing on the page. This is the half that makes *"an approximate point in the
  story"* findable at sixty entries.
- **A record ARRIVES rather than appearing.** `key={open}` remounts on every
  walk, which is what lets the CSS entrance re-run and what makes the
  scroll-into-view a mount effect. It **only moves the page when it has to** —
  if the head is already comfortably on screen nothing scrolls — and the whole
  animation block lives inside `prefers-reduced-motion: no-preference`, so
  reduced motion is the ABSENCE of the rules rather than an override, and no
  element can be left at opacity 0.
- **The read register** is `src/lib/record-read.js`, keyed on the entry's own
  NUMBER (never its index — the Record reads newest-first and an index points at
  a different entry the day one is inserted). **It is the one setting
  deliberately NOT session-scoped**, and the reason is one sentence: an unread
  marker that forgets overnight is not an unread marker.

**IT RENDERS NOTHING TODAY, AND SO DOES THE OLD WALK.** The Record holds one
entry. Three buttons pointing at the record you are already reading are three
dead controls, and the in-record ‹ NEWER / OLDER › nav has been drawing two
permanently disabled halves and a count reading **"1 of 1"** since M5. Both are
gated at two. **The keyboard is not gated** — Escape closes whatever the volume
holds, and a key that does nothing costs no attention.

**Verified on a file copy with three records, then restored.** The walk stepped
3→2→1; NEWEST disabled at the newest and OLDEST at the oldest; UNREAD jumped to
the oldest unopened and greyed out when the register filled
(`wb-read-robots` → `["n13","n14","n15"]`); Escape returned to the index; and
**the album banner never moved**, which is the arrow yield working.

---

## P5 — SESSION DEFAULTS, SITE-WIDE

**The scroll half was already built** (M2's `useArrival`) **and the size half was
built for one wing.** See finding 4 above.

- `split`, `cfH` and `bodyH` are `sessionStorage` in **every** wing.
- **`bodyKey`'s READ moved too**, and that one matters: it is the read that
  decides whether the visitor has ALREADY CHOSEN a height, and it was still
  looking in the old store — so the fit would have fired over a height dragged
  five minutes earlier in the same visit. A store move is two edits.
- /hr's deck width is `sessionStorage`. The key name is unchanged on purpose: an
  old value in `localStorage` is simply never read again and nothing migrates.
- `useArrival` added to `/hr/archive` and `/admin` — **the two routes in the
  building that never called it.** The gift shop keeps its own always-reset
  (Clause 5); presets carry their own state and are never overridden (M2).
- **Two things stay in `localStorage`, and the distinction is the ruling's own: a
  SETTING expires with the visit; a thing the VISITOR MADE does not.** /hr's
  preset slots and the Record's read register.
- **THE BOOTH'S PRIVACY ANSWER CHANGED FIRST, BECAUSE IT HAD TO.** It said *"the
  panel you dragged wider is still wider tomorrow"* — a sentence this round made
  false. It now says most settings last the visit and names the two that outlast
  it. Verified by grep: `localStorage` appears in `src/` at exactly those two
  call sites.

---

## P6 — THE TITLE BLOCK

*"Too dark, too big, too bold, too padded top and bottom… THIS IS A COMMON
PROBLEM IN THAT POSITION ACROSS PAGES — fix it everywhere."*

**It is one rule and it is already everywhere.** `.vp-face-title` is the heading
at the top of every face in /hr, /wal, /wb and /robots, so the four adjectives
are four properties on one selector.

| his word | before | after |
|---|---|---|
| too big | `--fs-head` 24.4px | `--fs-lead` 22.3px |
| too bold | 800 | 600 |
| too dark | `--wb-gold` #211f1c | `--wb-gold-lo` #57544d — 5.15:1 on paper |
| (too tracked) | .22em | .15em |
| too padded, top | 30px of body padding | 18px |
| too padded, bottom | **53px** — the full section step | 20px, the block step |

**The bottom was not on the title at all.** The section step is right BETWEEN two
sections; a heading and the first thing under it are one movement, and on any
face with no blurb between them — which is where he was reading, because THE
RECORD's blurb was deleted at HR — the index sat a full section away from the
heading. Faces that DO carry a blurb are excluded and keep the tight lead.

**And the page name went up**: `.wb-bar-room` 1.1→1.2rem. That H1 is the ARTIST
NAME on an artist wing and the PAGE NAME everywhere else — one element, every
room. **The ≤720px branch is deliberately untouched**: it sets its own 0.8rem and
the overlap arithmetic recorded against it was measured at that size.

**The two dark-ground faces override the colour already** (`.vp-face-portal`,
`.vp-face-panel`), so the Portal and the panel are untouched by the change.

---

## P7 — THE ENTIRE MAINFRAME

*"capture THE ENTIRE MAINFRAME (the heater) — the whole cabinet in frame, the
robot still out of it."*

`IMG_1526.MOV` at **00:58.0**, cropped to the cabinet's own bounding box
(108,142 → 966,1580 of the rotated 1080×1920 frame), written as
`cabinet_whole.jpg`. A re-encode, so **the source file's GPS tag does not
travel**. Both feet, the full grille, the lit core, the red bar bank mid-pattern,
square on, and the room essentially cropped out.

**THE BADGE FITS RATHER THAN CROPS, and that is a new treatment rather than a new
file.** Every badge before this one was a square cut of a photograph scaled to
FILL the disc — right for a detail, and impossible here: any square crop of an
858×1438 cabinet throws away two fifths of the machine, which is the exact thing
the instruction forbids. In fit mode the photograph is scaled whole into the
disc's inscribed box, corners on the arc. **The disc, its diameter, its top and
its ring stroke do not move**, so the family claim survives the change.

**WHAT IT SPENDS, AND WHAT IT DOES NOT.** The withholding on the CABINET is
spent, and three strings that said so are corrected rather than left standing:
the tombstone's *Frame — Withheld* row, the blurb's *never shown whole*, and the
poster caption's *shown nowhere whole*. **R4's canon is untouched** — the
withholding that ever mattered was THE FIGURE, and the figure is out of every
frame in this wing. The wall leads with the whole machine now: five plates.

---

## P8 — THE MANUAL ONLINE — **NOT SHIPPED**

**The viewer is built and it was verified this round.** `RobotsExhibitFlow`'s
reader pages with ‹ Prev / Next ›, wraps at both ends, prints
`title · date · frame n of m` on its rail and toggles Fit ↔ Magnify. Everything
the Manual face's own `lines` claim about it is true. A reel is a data block and
nothing else moves.

**There is no page to put in it.** The museum holds exactly one manual document:
the **61-page STRUCTURE ISSUE**. Its cover reads
`STRUCTURE AND ARRANGEMENT ONLY / TEXT NOT SUPPLIED`; its interior pages read
`[ TEXT REQUIRED ]` and `[ ART REQUIRED ]`.

**Publishing it reverses his own ruling from the round before, at 61× the
scale.** P2 struck a single page of that same document from that same face:
*"it was the museum admitting it had not written the manual, wearing a fiction
as cover"* — with the rule **either the plate shows a page actually written, or
there is no plate until one exists**. And B8 stands beside it: the artifact is a
PHOTOGRAPH of a printed sheet, never a rendering, so even written pages need his
printer and his camera.

**Ops did not publish, and did not silently do nothing.** The reader is proved,
the pipeline is one data block, and this is the one question — **M61**.

---

## P9 — WEIRD.BABY MUSIC

ABOUT THE ARTIST is first in the wing. It carries **everything this museum
already publishes about this artist and not one clause more**: the Information
Booth's keeper answer verbatim, the holdings counted off the spine below it
(*one release, six tracks, June 2026*), **PORTRAIT — none on file** as a holdings
fact on the glass, and a biography slot marked in both fields so it prints
nothing. The cover is the house's own mark — the one image of this artist the
museum genuinely has.

**The list being short is the finding, not a shortcoming.** Doctrine 12 forbids
the obvious alternative: a paragraph about a musician nobody has described to
Ops would read true and be invented.

**"About the Songs" is ledgered and NOT scaffolded** — his instruction, and the
NO-COMING-SOON credo's own rule. **M64.**

**And it exposed the last pager in the building** — see finding 3.

---

## P10 — THE FOUNDATION — **TWO OF THREE**

**THE INVOICE IS A LEDGER.** He is right about the object rather than about the
word: an invoice is a DEMAND, addressed to somebody who then owes you something,
and this document demands nothing and never has — its total is $0.00 by
construction. What it does is keep an itemised account of what the museum costs
and who carried it. **Its own small print already said *"so the ledger is honest
and public"***, which is the tell that the document knew what it was before its
title did.

- The incoming table takes back **its own name — The register** — which is what
  the code has called it since E1 built it. The museum cannot carry two things
  called the ledger on one page.
- **Two prose pointers named the wrong one and were repointed**: *"That door is
  on the ledger above"* (it is on the register) and *"the invoice above is the
  whole of it"* (it is the ledger). A pointer that survives a rename by luck is a
  pointer that will be wrong next time.
- The class names and the constant stay `inv`, on exactly the reasoning that kept
  `id: "mgk-viii"` after that album was renamed.

**"HELD, EVER" IS DELETED** — the three rows under the figure already say what is
owned, kept and passed on, and the caption was the second object saying it, in
the one register that reads as an argument being pressed.

**THE TONE RULING IS RECORDED AS STANDING**, at the head of the wing, with four
tests to put any future line through — *does it ask · does it flatter the giver ·
does it argue the house's NEED · would it read differently if the reader were
richer than the house.* **Audited against the live copy: the wing already
passes**, and that is written down because a ruling that changed nothing on its
first day gets assumed decorative. Nothing was rewritten under it. What it does
is bind the next line.

**THE ALBUMS AND TRACKLIST ARE NOT BUILT — M62.** /foundation is not a `face`
wing; it is a sheet page carrying three bespoke objects the face model has no
equivalent for — the $0.00 ACCOUNT CARD (the room's only visual hook), the
two-sided REGISTER (whose LIVE / NOT BUILT column is read live off
`reveal/ledger.json` — the room's honesty mechanism) and the zero-cost LEDGER. A
straight port deletes all three, and two of them are mechanisms he specified
himself. **Ops chose to ship the corrections and hand the conversion back rather
than half-convert a room he wrote the copy for eight days ago.**

---

## P11 — THE CARD, AND THE LOGO

**M54 closes by adding a door rather than moving one.** The template already
carries both kinds — `site` is the artist's own place and `channel` is their
video channel, and `doorsFor` has drawn them as two doors since P15. Mikey Mike
was the one artist in this wing whose HOMEPAGE door was a YouTube channel, which
is why the gift shop tile had to be fixed separately at S2. **The oEmbed
verification is the unfakeable anchor for BOTH doors** — it ties @findmikeymike
to him, and weekendatmikeys.com's own Instagram is that same handle.
**R-a's refusal of findmikeymike.com is untouched.**

**The logo's missing thin black outline is ledgered and nothing was built or
asked for — M63.** Worth knowing when it matters: the mark is now on THREE
surfaces, and whatever the outline fixes is fixed in one file.

---

## THE PROVENANCE ROUND, AND A CORRECTION TO §9's OWN PROCEDURE

**72 new strings and 2 new assets declared** — `provenance/_declare_p.mjs`, one
explicit line per string with the text it classifies, refusing in both
directions. **61 stale rows pruned. 7 rows reclassed. 0 dangling references.**

**THE PRUNE PROCEDURE WAS RUN IN THE OTHER ORDER, AND IT SHOULD BE.** §9 says
CHECK ANCHORS → REPOINT → PRUNE → RE-GATE. The anchor check written for that
step **could not enumerate the stale set reliably**: it folds `"a " + "b"`
concatenation but not `—` escapes, so it reported 154 rows where the sweep's
own count was 61, and an over-report is useless for deciding what to repoint. So
the register was **copied, pruned, and re-gated — and the gate's own
`badRestated` check named all eleven broken chains exactly.**

**The lesson, and it is a correction to the procedure rather than a note beside
it: the gate is a better anchor-detector than any heuristic beside it, because
it is the thing that DEFINES "resolves". Prune against a copy and let the gate
find them.**

**And the prune exposed a mis-classification nobody would have found otherwise.**
Five of the eleven were not repointed but RECLASSED, because RESTATED was wrong
for them all along: *"Where do I start?"* and *"How do I get in touch?"* are
Mike's own, verbatim in this brief — they were RESTATED because the OLD face
happened to ask the same two questions, and a coincidence of wording is not a
restatement. And *"FREQUENTLY ASKED"* carried **five** references, one per answer
beneath it, which is what a heading of a list looks like when somebody declares
it as prose.

---

## WHAT THIS ROUND EXPOSED AND DID NOT FIX

Every one has a register row: **M57** the unwritten *What is Weird.Baby Robots?* ·
**M58** the wing's lost door-map · **M59** the three things The Name took with it ·
**M60** *follow us on social media* with no handle behind it · **M61** the manual ·
**M62** the Foundation's conversion · **M63** the logo outline · **M64** About the
Songs.

**Surfacing: 13 spendable · 13 promised and unbuilt · 15 idle files — unmoved.**
The round added two files and both are referenced, and it orphaned none: The
Name's deletion would have stranded `column_lit.jpg` and the mainframe's new FAQ
took it. **The shelf did not grow and it did not shrink**, which by the cadence's
own terms is a packet that neither spent nor added.

**[C41] `SURFACING_LOG.md` still stamps its rows in UTC** — this reading was
taken on 2026-08-05 and logged as 2026-08-06, for the second round running.
Reported, not fixed.
