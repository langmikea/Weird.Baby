# THE ROBOTS SIMPLIFICATION — v56, 2026-08-05

**Cross-repo. Museum and robots.** Autonomous, drafting lane, one agent.
Gates: lint **11/9 = baseline** · build green · `provenance:gate` **PASS** ·
`reveal:check` **PASS** (it was RED at the start of this round) ·
`parity:gate` **PASS** (new) · browser lap run at desktop and 390px.

**This round DELETED more surface than it built and the deletions are the
point.** Three front-desk faces, six robot plates, two typographic cards, a
whole spread, ninety lines of SVG generator, and a shot from each of two video
cuts. What was added is four instruments, four cabinet plates and two eggs
nobody can see.

---

## G1 — THE GATE GOES GREEN, AND THE FIX IS A RULE RATHER THAN A PATH

**MIKE:** *the old 24-page manual is DEAD and its page numbering with it. 61 is
the current number — and **the manual is as long as the manual needs to be, and
not longer.** Page count is a consequence of content, never a target.*

T1 left `reveal:check` RED and refused to repoint it, on the correct reasoning
that page 7 of the 61 is not page 7 of the 24. Mike's ruling removes the
premise: there is no 24-page manual to be page 7 of.

**So the constant is gone, not moved.** `MANUAL_PAGES = 24` was a number in this
repository standing in for a fact about a document in another one, and T-A is
precisely what happens when the fact moves and the constant does not. The count
is now **read off the source tree** (`manualPages()`), so a regenerated manual of
any length cannot break it.

**The three ways it could break again, and each was broken on purpose:**

| break | what it reported |
|---|---|
| the tree **moves** | one named repo-level fault, not a stack trace — T1's fix kept, reworded so it no longer names the 24 as the thing lost |
| the count **shrinks** | `manualPageRow()` refuses at write time **and** `validate()` faults a row already in the ledger naming a page past the end |
| the count **grows** | nothing breaks and nothing needs to |

The count is printed on every `reveal:check` pass, so a change is **visible**
rather than merely survivable.

### It exposed a hole the transfer table had only described

The vessel's own self-test started failing the moment the gate ran again: a
manual page fell through the transfer table with *no transfer class and no
exemption*. `MANUAL_SPANS_CLASSES` has said since T1 that the pages are PACKAGE
— **in prose, enforced by nothing.** `doc.manual.page.NN` ids are built one at a
time by a vessel, so they cannot be typed into a literal list until they exist.

**One pattern rule, and deliberately only one** (`transfers.mjs` `PATTERNS`),
with a fault if a pattern ever also matches a row placed by hand. `record.NNN`
rows are derived too and are NOT patterned, because which transfer a week's
material rode in on is a judgement per entry and a pattern would erase it.

**And the self-test's expectation changed rather than the rule being waived.** A
PLACED page cannot validate today — PACKAGE has no named arrival week until T-B
is answered — so the test now REQUIRES exactly that one fault. Exempting the
specimen would have been the vessel proving itself against a rule it had been
excused from.

### And one thing on the glass

`public/robots/manual/working-copy-p1.png` was a copy of a page of the **retired**
document; a copied file cannot notice its source being deleted upstream. The
still is now page 1 of the live structure issue, renamed via the declared
`assets:rename` path, and its judgement **re-read** — because the picture changed
as well as the name, and carrying `quality: placeholder` across would have been
carrying a false reading.

> **THE ONE JUDGEMENT CALL, FLAGGED NOT BURIED.** The new page's own type reads
> **TEXT NOT SUPPLIED**. In the fiction that is an early issue circulated for
> arrangement — a fifth copy-state beside Mike's four, and DOC CONTROL's canon
> already says the manual was assembled out of copies caught at different
> stages. Read the other way it is the museum admitting it has not written the
> manual, which is Doctrine 11 printed **inside a picture where no string sweep
> can see it**. The caption is written to hold the first reading. If it is too
> thin, the still comes off — [M45](OPEN_ACTIONS.md#m45).

---

## R1 — THE RECORD MOVES TO THE ROBOTS PAGE

**MIKE:** *it applies to ALL things robots, not just the VIIIp.*

Moved whole from the MGK-VIIIp album to the wing's own front desk — **not a
sentence inside it changed**, and the block was moved by script rather than
retyped. `face.viiip.record` → `face.wbr.record` is **the only ledger id this
table has ever renamed**; nothing outside `reveal/` reads it, and leaving it on a
wing it no longer sits in would be the ledger keeping a filing decision the
museum reversed.

**And it got DIRECTORY-LEVEL BILLING, which needed an address to be honest.**
Nothing in this museum could be deep-linked to a track before: `defaultActiveIndex`
picks an album and the tracklist has always started closed. `Exhibit.jsx` now
takes an `open` prop (a track id), `/robots/record` passes `"record"`, and the
lobby board carries **The Record indented under Weird.Baby Robots** — reusing
`wb-dir-entry-sub`, the rule F7 built to say *and also these*, to say *and inside
that*. **A directory line that dropped a visitor on `/robots` and left them to
find the Record would be a control that does not do what its label says.**

It is the only line on that board that is not a room. That is deliberate: the
Record is the one thing in the wing that keeps happening, and a board of rooms
would never say so.

---

## R3 — THE FRONT DESK IS ONE FACE

**MIKE:** *remove DOC CONTROL, WELCOME and CONTACT. FAQ is the most important and
most encompassing surface — the comparison matrix I started imagining is itself a
FAQ ANSWER, not a room. Fold anything worth keeping; delete the rest.*

Four faces to two (FAQ, The Record). Eleven questions where there were four
rooms.

**WHAT CAME ACROSS:** Welcome's lead (now the blurb), its contents register (now
`lines`), WHERE TO START, the purveyor posture, the method, WHY WE BOTHER with
its `[PAPA]` intact, the family shot and the footer · DOC CONTROL's *came in
pieces* canon — Mike's own words, the single most load-bearing sentence that face
carried — and the originals-are-held statement with its `[PAPA]` · CONTACT's
address and all three subjects, compressed into one answer.

**WHAT WAS DELETED OUTRIGHT, each because a reachable face already says it:**
DOC CONTROL's FILES row (both Technical Specifications faces name the two
firmware trees in more detail) · its PAGES row (The Manual's own face says
*photographs of the printed pages* and *PLATES none on file*) · Welcome's TAGLINE
row (*Purveyors of the Weird* is set into the cover a visitor is looking at while
they read it) · CONTACT's ranking of the three reasons by how much each would
help us. **And both typographic cards** — `deskCard`, `CARD_STOCK`, `CARD_INK`,
`CARD_QUIET`, `CARD_ADDRESS`, `CARD_STAMP`, about ninety lines. The technique is
alive in three other files; only these two instances go.

**Welcome's WHAT and HOW were merged inside the fold** — two thin rows answering
one question became one answer, which is the Law of Subtraction applied to the
fold and not only to the faces.

### M29 CLOSES BY INHERITANCE, AND THAT IS NOT A5 BEING RE-ARGUED

The FAQ has shipped with no picture since the 31½ card was struck, held under
Mike's exception that *a page whose words are the hook needs no image* — granted
to a face in the **middle** of a wing. **This face is now the wing's LANDING.**
F1's argument is the one that applies and it was that the wing whose subject is a
physical object should not introduce itself in prose. The family shot comes
across **with the job it was doing**; nothing new is sourced and no object was
invented for the slot, which is the half of A5's ruling that still binds.

---

## R4 — NIAC IS THE MAINFRAME

**MIKE:** *NIAC is the gutted-space-heater computer — the helical core, the
bar-graph output row. It is so complicated **they needed a robot to operate it.**
The robot — camera-body head, brass tee shoulders, conduit limbs — is a HUGE
EASTER EGG and is not the subject. **ALBUM ART AND ALL NIAC IMAGERY SHOW THE
MAINFRAME ONLY** — the robot stays out of frame until deliberately spent.*

**WHAT THE ALBUM HAD BEEN DOING, stated plainly because it is the finding.** It
named the mainframe in every sentence of its prose and photographed the FIGURE in
every frame: eight plates, of which six were the robot, plus a bench shot with
its feet in it — and **the cover badge was the robot's face.** V2's obfuscation
ruling was withholding the whole silhouette while spending the egg one joint at a
time. **The rule was working perfectly on the wrong object.**

| | before | after |
|---|---|---|
| cover badge | `head_lens.jpg` — the robot's camera head | `core_helical.jpg` — the coil through the cage bars |
| poster | `chest_grille.jpg` — torso and shoulders | `core_meltdown.jpg` — the interior in trouble |
| THE NAME still | `head_lens.jpg` | `column_lit.jpg` — the lit column and the cabinet's edge |
| TECH SPECS still | `matrix_lit.jpg` — a breadboard | `output_row.jpg` — the machine's own bar bank |
| Image Archive | 8 plates, 2 spreads | **4 plates, all cabinet, one unheaded wall** |

**Three plates came the other way**, out of the robots repo's own culled 2021 set
(Mike's cull, 2026-08-03, same obfuscation law): the core, the output row, the
meltdown. Nothing was deleted there and no crop was re-cut.

**Seven photographs left the glass and NONE was deleted from disk** — the call
N1 made on `parts_drawer.jpg`. They are register rows, not silences, and
`npm run surfacing` now counts them.

**THE CLAIM ABOUT THE ROBOT IS ON NO PAGE ANYWHERE.** *"So complicated they
needed a robot to operate it"* is the egg, and a face that says it has spent it.
It is `egg.niac.operator` in the reveal ledger: LIVE (the material exists and is
good), HELD (it is off the glass), `shown: false` (nothing hints at it) — ten
photographs in hand, in two repositories, published nowhere.

### What it cost, named

**The February 2013 spread is gone** and with it the museum's only stowed shelf.
MGK-NIAC was the ONE wall anywhere with more than one spread, so N2's `<details>`
mechanism is now **exercised by nothing** — that is [C29](OPEN_ACTIONS.md#c29)
getting worse. `matrix_lit.jpg` is orphaned by the Technical Specifications swap.

### THE REEL IS OUT OF THE DESIGN — robots repo

**MIKE:** *THE REEL IS NO LONGER PART OF THE DESIGN. Remove it from the design
record and show it nowhere.*

`LINEAGE.md` already said *the hardware is history* and **kept half of it back**:
that the control-room drum descends from the wheel *as an idiom*, and that **"the
idea is canon."** Struck. There is no surviving ancestry claim.

**It does not strike the Portal's drum** — a live control, renumbered the same
day. What is gone is the claim that it has a grandfather.

Conformed in the GENERATOR FIRST: `W_WHEEL` removed from `make_signature_short.py`'s
`SRC` map and `WIDE` set as well as from both cut tables, **because a shot id
nothing maps to fails loudly while a measured crop rectangle left in a table is
an invitation.** Cut A is 0.24 s shorter, cut B 0.78 s. **Cut A loses the beat
its own note described** — an unseen object arriving at the last possible moment
— and nothing replaces it; **cut B loses 1.23 s of its longest lull, so its trap
springs earlier**, which is the one place the deletion changes rhythm and not
just length. Both are re-cuts and re-cuts are Mike's.

---

## R5 — NIAC'S STORY POSITION

**MIKE:** *NIAC is found FROM DAY ONE — there was a reason they sent what they
sent, in the order they sent it — and it shows progress across the arc, but THE
MOTHER LODE OF DETAIL IS VIIIp. NIAC is the NEXT CHAPTER, alongside continued
rollout of new VIIIp units. Someday NIAC runs on the Portal.*

Recorded as `NIAC_STORY_POSITION` in `reveal/transfers.mjs` and as §5.3 of
`docs/ASSET_TIMELINE.md`.

**THE TABLE ALREADY AGREED, and that is worth more than either statement alone.**
Every `face.niac.*` row is BLAST — not chosen for NIAC, **forced** by rule (b),
because the album was on the glass at launch. The canon and the mechanism reached
the same answer from opposite ends.

**What was NOT read into it.** *Progress across the arc* is about REVEAL
(`when`), not ARRIVAL (`transferWeek`). Every `when` is still null on all 156
rows. NIAC arrived in week 0 with everything else; which piece comes out when is
`npm run reveal:cards` and it is Mike's.

**And the round made one half of it TRUE that was not.** *The mother lode of
detail is VIIIp* was contradicted by the wing itself: eight NIAC plates against
nine VIIIp, six of the eight spending the egg. Four against nine now says what
the canon says.

---

## R6 — THE CHANNEL EGG

**MIKE:** *the Portal's feed positions renumber — NIAC takes CHANNELS 1 AND 2,
VIIIp moves to CHANNELS 3 AND 4. The reason is the egg and it must not be
explained on the glass.*

Eight positions, engraved `1`…`8`: **1 · MGK-NIAC · 2 · MGK-NIAC**, then
**3 · STANDARD** (the one that arms) and the VIIIp's five held feeds at 4–8.

**NOTHING ON ANY PAGE EXPLAINS IT.** Not the drum's legend, not its sub, not a
caption. The engraving is a number. The reason is written down **once**, in
`reveal/ledger.json` as `egg.channels`, and nowhere else in either repository:
*a 1970s home device fed a television through an RF modulator and you tuned the
SET to channel 3 or 4 — the VIIIp is the portable, the one you take home, so it
starts where a machine like that has always started. And NIAC holds 1 and 2
because NIAC came first.*

**THE NIAC POSITIONS ARE NOT INVENTED FEEDS.** They carry the machine's name and
no state, no mode and no title, because nobody supplied one and a plausible one
is Doctrine 12's exact failure. Neither arms. They are `shown: true`, UNLOCK,
waiting on a **feed** rather than on a delivery — which is R5's *someday*, made
visible.

**M33's five levers are untouched.** Renumbering must not quietly destroy five
reveal levers, and it did not.

> ### AND THE LAP CAUGHT WHAT THE DATA COULD NOT
> Putting two dead channels at the top of the drum meant `useState(0)` landed
> every visitor on a position that will not arm: **the Portal — the one thing in
> the wing that is actually running — opened with NOT ARMED, "This feed is not
> available", and the latch two rolls away.** The numbering was right and the
> landing was wrong, and only a screenshot could have said so. The drum now opens
> on the first `arms:true` position, so the instrument presents itself in the
> state it can be used in and the channels above are found by rolling UP. A drum
> with no arming position falls back to 0, exactly as before.

---

## R2 — MENU PARITY, WITH TEETH

**MIKE:** *NIAC and VIIIp carry THE SAME MENU ITEMS BY DEFAULT — no more, no
less. Any difference is a YELLOW FLAG that must be justified in writing, not
absorbed silently.*

`npm run parity` / `parity:gate` — `tools/menu-parity.mjs`, reading both albums
out of `robots.js` with the acorn + acorn-jsx pair the provenance sweep uses.

**WHY IT NEEDED A TOOL AND NOT A HABIT:** a divergence is invisible from inside
either album. Read the VIIIp's tracklist and it looks complete; read the NIAC's
and it looks complete. Only a reader holding both at once sees that one has a
manual. **The default is parity, so the burden sits on the difference — and a
burden nothing enforces is a preference.**

Today: **2 shared · 4 declared divergences · 0 undeclared.**

| divergence | why, in one line | closes when |
|---|---|---|
| **The Name** (NIAC) | two names, one machine; the VIIIp has nothing to reconcile | **never** — a property of the objects |
| **The Manual** (VIIIp) | a HOLDINGS gap stated as one — no NIAC manual exists to catalogue | one reaches the museum |
| **The Portal** (VIIIp) | the `p` means PORTAL; and the asymmetry is already acknowledged on the glass by R6's two dark channels | `portal.feed.niac.*` arms |
| **FAQ** (VIIIp) | nothing to put in it; three invented questions to match a length is the opposite of what this checks | real questions exist |

**Both failure directions were broken on purpose:** an undeclared divergence
faults, **and so does a justification for a divergence that no longer exists** —
a table checked one way rots into a list of excuses with a real divergence hiding
in it. A missing album throws rather than reporting parity.

**IT IS NOT A PACKET GATE**, on the same reasoning as `assets:gate`: it reports a
JUDGEMENT, and a judgement as a build blocker turns every honest asymmetry into a
commit that will not land.

---

## R7 — PERIODIC REPORTING

**MIKE'S GAP:** *every exhibit needs a rhythm of surfacing, plus periodic SHORTS,
to keep asset utilization honest — right now assets get built and sit and nothing
asks what has not been shown. The reveal ledger's back-shelf list is exactly that
question with nobody scheduled to read it.*

**THE DIAGNOSIS IS SHARPER THAN "WE NEED A REPORT".** Three instruments already
knew the answer and none was ASKED. `reveal:audit` computes the back shelf and
buries it in four other sections; `assets:scan` computes `unreferenced` under a
heading nobody greps; `reveal:cards` prints 49 questions and waits. **The missing
thing was a number somebody looks at on a rhythm, and a record of what it was
last time.**

`npm run surfacing` — computes nothing new. It re-cuts the ledger and the asset
table **BY WING**, which is the only cut a person can act on: *the museum has
thirteen spendable things* is not a decision, *the robots wing has ten and Worth
A Listen has none* is.

**Today: 13 spendable · 13 promised and unbuilt · 14 idle files.** Ten of the
spendable are the robots wing's.

**THE CADENCE, and it is a proposal because a cadence is a decision:** ONE
SURFACING PER PACKET, and **the shelf should not grow two packets running** — one
round of building ahead is stock, two is a habit. It runs beside lint and build
because **the packet is the only clock this repository has**: there is no CI and
deploys are manual, so a cron nobody runs would claim a rhythm it does not have.

`--log` appends one dated line to `docs/SURFACING_LOG.md`. **That is what turns a
number into a trend**, and the trend is the whole point.

**IT WILL NOT COUNT SHORTS AND WILL NOT PRINT A ZERO.** A short is a CUT; the
storyboard doctrine and the cutting live in the robots repo, and nothing here can
see whether one was made. A zero would read as *none were made* when it means
*this tool cannot see*. The shorts cadence is [M46](OPEN_ACTIONS.md#m46).

**It does not pick what comes out next** — ranking the back shelf would be Ops
scheduling the story. And **it is not a gate**: an unshown thing is inventory,
not a defect. `--gate` does not exist on purpose.

---

## THE LEDGER

**152 → 156 rows.** +2 NIAC channels, +2 eggs, +3 retired faces, −1 face merged
away (`face.viiip.record` renamed rather than added).

```
by state    REVEALED 92 · HELD 52 · RETIRED 12
by transfer BLAST 101 · UNLOCK 15 · TRANSMISSION 6 · PACKAGE 9 · exempt 25
joined to assets 14   ·   with a story date 0
```

Every `when` is still null.

---

## WHAT THIS ROUND EXPOSES

1. **The robots wing holds 10 of the museum's 13 spendable things** and every
   other wing holds none. That is not a criticism of the wing — it is where the
   material is — but a back shelf that lives in one room is a room that is
   building faster than it is showing.
2. **Idle files went 5 → 14 in one round**, and this round put nine of them
   there deliberately. The surfacing log's first line records it, so the next
   round's number means something.
3. **Three of the four menu divergences are holdings gaps, not design.** The
   mainframe has no manual, no portal feed and no questions of its own. That is
   the same sentence three ways: **the museum knows far less about NIAC than
   about the VIIIp**, which is exactly what Mike's own canon says — and it now
   has an instrument that will say so every time it is run.
4. **`reveal:check` was dead for two hours and nothing noticed.** The lesson was
   already banked at T1 (*a gate that crashes is not a gate*); what this round
   adds is that **nothing ran it in between**. R7's report is beside the gates
   for the same reason.

---

## FILES

**museum · src:** `data/artists/robots.js` (the front desk, the NIAC album, the
drum) · `App.jsx` (`/robots/record`) · `routes/robots/Robots.jsx` ·
`routes/WbHome.jsx` (the directory line) · `routes/exhibit/Exhibit.jsx` (`open`,
the drum's channel span, the drum's start position) · `routes/exhibit/Exhibit.css`
(`.ip-drum-ch`)
**museum · instruments:** `tools/menu-parity.mjs` (new) · `tools/surfacing.mjs`
(new) · `tools/reveal-ledger.mjs` · `tools/make_unit_covers.py` ·
`reveal/schema.mjs` · `reveal/transfers.mjs` · `reveal/ledger-declare.mjs` ·
`provenance/assets-declare.mjs` · `package.json`
**museum · generated:** `reveal/ledger.json` · `provenance/register.json`
(+27 rows, −70 stale, 44 references repointed) · `provenance/assets.json` ·
`provenance/asset-table.json` · `public/robots/art/mgk-niac-cover.png`
**museum · assets:** +`core_helical.jpg` +`output_row.jpg` +`core_meltdown.jpg`
+`structure-issue-p1.png` · −`working-copy-p1.png`
**museum · docs:** `ASSET_TIMELINE.md` (§5.3 new, §6's third finding closed) ·
`SURFACING_LOG.md` (new) · `OPEN_ACTIONS.md` · `CLAUDE.md` ·
`canonical/OPERATIONS.md` · this log
**robots:** `docs/canonical/LINEAGE.md` · `docs/MAGIC8_SIGNATURE_STORYBOARD_v3-20260804.md`
· `robots/mgk-viii/plates/2021-03-19/PLATES.md` · `tools/make_signature_short.py`
· `STATE.md`
