# THE ASSET TIMELINE — how every one of the 156 things got into the house,
# and the rule that none of them may be shown before it did

**Built 2026-08-05 (T1) on Mike's instruction. Read with `reveal/transfers.mjs`,
which is the machine half of this document; this is the half he reads.**

**Nothing was created** *at T1*. No asset, no row, no content, no date. Every one
of the 152 rows already existed; that round assigned each a transfer class, wrote
the exemptions out in full, and made the rule checkable. `npm run reveal:check`
and `npm run reveal:build` both enforce it.

> **AMENDED 2026-08-05 (v56, THE ROBOTS SIMPLIFICATION).** 152 rows → **156**.
> Three front-desk faces were struck and RETIRED, the Record moved album and its
> row moved with it, the Portal's drum gained two channels for the mainframe, and
> two eggs were planted and recorded. **§5.3 is new** — NIAC's story position,
> which is the first thing in this document that places one MACHINE on the arc
> rather than one class of paperwork. **§6's third finding is CLOSED** and the
> ruling that closed it is written into it.

---

## 1. THE FOUNDATION — Mike's insight, recorded first because everything follows

> **THE FIRST RECORD MUST PRODUCE THE FIRST IMAGES OF NIAC AND VIIIp so the site
> has images to post — which means THOSE IMAGES ARRIVED IN THE EMAIL BLAST. That
> is cover for everything else the site already shows, and it opens slots for
> foreshadowing, for specificity, and for setting scope.**

It does more than it looks like it does, and it is worth being explicit about
what it buys, because three separate problems close on this one sentence.

**One — it explains the museum's existence.** The site went live with
photographs on it. Photographs are material, and material has to have come from
somewhere. Once the blast is the answer for `face.niac.plates` (eight details of
the MGK-NIAC) and `face.viiip.plates` (nine plates of the VIIIp), it is the
answer for every other thing that was on the glass on day one — the faces, the
twin, the Portal, sixteen sounds, the Record's first entry. **Ninety-four rows
stop needing ninety-four explanations.**

**Two — it makes foreshadowing free.** A blast that carried *more* than was
published means a later reveal of already-built material needs **no new
arrival**. That is why class 1 is deliberately larger than the set of things the
site actually showed: 102 rows, of which 94 are on the glass and **8 are held
back** — the whole Hunter Root wing, the admin dashboard, the honest scaffold
screen, the charter, the sandbox replay, two sounds. Every one of those can be
spent whenever the story wants it, and the story never has to explain where it
came from.

**Three — it sets scope by exclusion.** If the blast is what the site shows,
then anything NOT in the blast has to arrive some other way — and that forces
the other three classes to be about specific, nameable events.

---

## 2. THE FOUR TRANSFER CLASSES

Ops-designed on Mike's instruction. Every row belongs to exactly one, or is
exempted in writing with a reason. There is no fifth class and no blank.

| # | class | window | what it carries | rows |
|---|---|---|---|---|
| 1 | **THE BLAST** | Friday → Sunday, **pre-launch (week 0)** | Everything the site already shows, plus material held and not shown | **102** |
| 2 | **THE PACKAGES** | **weeks 3–7**, four Fridays | Units, cases, objects, manual pieces. They *earn* their photographs — we can only show what we hold | **9** |
| 3 | **THE UNLOCKS** | throughout; **in hand from week 0** | Things already held that could not be opened: zips, folders, pages. No arrival needed | **13** |
| 4 | **THE LATER TRANSMISSIONS** | **months 2–3** (weeks 5–12) | Because they never stopped. The back half's knock at the door | **6** |
| — | *exempt, in writing* | — | What the transfer fiction does not describe | **22** |

**They are not the four REVEAL classes.** ANNOUNCED · HINTED · DISCOVERED · HELD
(named in the robots repo's `ASSET_REVEAL_CHECKLIST.md`) answer *how a thing is
shown*. These answer *how it got here*. An object has one of each,
independently: the Portal is BLAST and ANNOUNCED; the buffalo nickels are
PACKAGE and arguably shown never.

---

## 3. THE RULE, AND HOW IT IS CHECKED

> **An asset may only be SHOWN after it has been TRANSFERRED, and every asset
> belongs to exactly one class.**

Three checks, in `reveal/transfers.mjs`, run by both `reveal:build` and
`reveal:check`:

**(a) Every row is placed or exempted, in writing.** A row in neither table
fails the build. This is what makes the model exhaustive rather than decorative
— a classification with a silent default is a classification with a hole.

**(b) Nothing unarrived is on the glass.** A row whose material has no named
arrival week may not be `REVEALED`. Neither may an exempt row — exemption covers
what is *not* shown, and must never become the way round (b).

**(c) Nothing is shown before it lands.** Where a row has both a reveal week and
an arrival week, the reveal may not precede the arrival.

**All three were broken on purpose to confirm they refuse.** Disabling check (b)
makes the guard report two failures; dropping one real row out of the assignment
table fails the build with `face.niac.plates: no transfer class and no
exemption`; naming a row that does not exist fails with the drift guard. The
guard test uses literal expectations, not values read back out of the table it
tests — the lesson the manual-page vessel paid for at v55, applied rather than
re-learned.

**The consequence, and it is the model's spine: every one of the 94 rows a
visitor can reach today is BLAST**, because the blast is the only transfer that
had happened when the doors opened.

---

## 4. THE WEEKS — what the arc fixes and what it does not

Mike's arc: **twelve weeks. Month 1 the arrival. Month 2 the turn — the units
get understood and stop being the point. Month 3 the reckoning. Four Fridays
that carry packages. Transmissions that never stop.**

That fixes **two** arrival weeks and no more.

- **BLAST → week 0.** Stated outright: Friday to Sunday, pre-launch.
- **UNLOCK → week 0.** Derived by necessity, not guessed. An unlock is of a
  thing *already in hand*, and the only way it is already in hand is that the
  blast brought it. "No arrival needed" and "its arrival was week 0" are the
  same sentence. What stays open on an unlock is its *reveal* week.

And it fixes **neither** of the other two, so neither carries a week:

- **PACKAGE — five weeks, four Fridays.** Weeks 3–7 is five Fridays and Mike
  named four packages. **Which week goes empty is not in the arc.** Picking one
  would be Doctrine 12 exactly: a specific nobody supplied.
- **TRANSMISSION — "they never stopped" is a rhythm, not a schedule.** Months
  2–3 is the window; no week inside it is named.

`transferWeek: null` therefore means **exactly one thing** — this material has
no named arrival — and check (b) is what gives that meaning teeth.

**`when` is still null on all 152 rows.** The arc supplies *arrivals*, not
*reveals*. Mike has still never said what day anything comes out, and this round
did not start.

---

## 5. THE TWO KNOWN TENSIONS — resolved honestly, not hidden

### 5.1 The Manual spans classes 1 and 2 — and that is the fiction working

The volume `doc.manual` is **BLAST**: named, on the glass, readable from launch
— the cover and the first contents page inside the first 48 hours. Its pages
(`doc.manual.plates`, and every `doc.manual.page.NN` the v55 vessel will build)
are **PACKAGE**, because a photographed page is a photograph of paper somebody
is holding.

One object, two arrivals, and **no contradiction: nobody ever had the whole
manual in one piece.** That is precisely the no-single-copy fiction Mike ruled,
and the transfer model expresses it rather than arguing with it.

**A gap inside the tension, and it is real.** The v55 vessel is empty by
instruction (M44). So the class-1 half of the manual is carried by exactly
**one** row — the volume — and *the first-48-hours pages Mike describes have no
rows at all.* The model says two classes; the ledger currently has one row on
one side and one promise on the other. Nothing was created to fix this: minting
`doc.manual.page.01` would be Ops deciding which page the story reaches for,
which is the thing M44 exists to prevent.

### 5.2 The Portal arrived in the blast and could not be driven yet

The Portal is on the glass at launch, so by rule (b) it can only be class 1.
Which means, stated plainly: **the panel arrived complete and mostly dead.**

- `portal.feed.standard`, both bat switches and the live dial — **BLAST**, and
  they work.
- Five drum positions and the seeded dial — **UNLOCK**. They are *engraved where
  a visitor reads them* (`shown: true`) and they will not arm. Nothing has to
  arrive for them; they are in hand, in the panel, shut.

The same object in two classes, which is exactly the stuck-portal
maintenance-mode lore. It is the cleanest thing in the model: six of the eleven
promises the museum currently makes on its glass are these, and every one of
them is now backed by a class that says *we have it, it is closed.*

### 5.3 NIAC's story position — the third tension, and it is the useful one

**[v56/R5, Mike's canon.] Recorded here because it is the first thing in this
document that places one MACHINE on the arc rather than one class of paperwork,
and because it resolves a tension the transfer table could not see.**

His words, in four parts:

- **NIAC is found FROM DAY ONE.** *"There was a reason they sent what they sent,
  in the order they sent it."*
- **It shows PROGRESS ACROSS THE ARC.**
- **THE MOTHER LODE OF DETAIL IS VIIIp.** NIAC is not where the depth is.
- **NIAC is THE NEXT CHAPTER**, alongside continued rollout of new VIIIp units.
  **Someday NIAC runs on the Portal.**

**What it reconciles.** Part one is a statement about ARRIVAL and the table
already agrees with it: every `face.niac.*` row, and every plate behind them,
sits in **BLAST**. That was not chosen for NIAC — it fell out of rule (b),
because the album was on the glass at launch. Mike's canon and the mechanism
reached the same answer from opposite ends, which is the strongest form of
agreement this model can produce and is worth more than either statement alone.

**What it does NOT do, and the distinction is the whole of §4.** *"Progress
across the arc"* is a statement about REVEAL — the `when` field — and `when` is
null on all 156 rows because Mike has not supplied a schedule. Arrival and
reveal are different fields and this round did not conflate them. NIAC arrived in
week 0 with everything else; **when each piece of it comes out is exactly the
question `npm run reveal:cards` is holding open** (M32).

**What it changed on the glass, and it is one thing.** *"Someday NIAC runs on the
Portal"* is now VISIBLE: R6's renumbering engraves **channels 1 and 2 for the
mainframe** on the Portal's drum, and both are dark. That is a promise the
museum can now be held to — `portal.feed.niac.1` and `.2` are `shown: true`,
**UNLOCK**, waiting on a feed rather than on a delivery. It is the same
instrument §5.2 describes, pointed at the other machine.

**And what it makes true that was not.** *"The mother lode of detail is VIIIp"*
was contradicted by the wing itself until this round: the MGK-NIAC album carried
**eight** plates against the VIIIp's nine, and six of the eight were the ROBOT —
the album named for the mainframe was spending its depth on the easter egg. It
now carries **four**, all of the cabinet, and the robot's ten photographs are
held whole (`egg.niac.operator`). The ratio finally says what the canon says.

---

## 6. WHAT COULD NOT BE PLACED — 22 rows, four kinds

Not a waste bin. Each is written out in `reveal/transfers.mjs` with its reason,
and an exempt row may not be `REVEALED`.

| kind | rows | why |
|---|---|---|
| **(i) Withdrawn** | 9 — all `retired.*` | A transfer class describes how material arrives *to be shown*. These were struck *from* the glass, and several were never material: `retired.record.fictions` is eleven invented entries deleted at v47. Giving fiction an arrival would dignify it. |
| **(ii) Ops instruments, out of fiction** | 4 — `tool.provenance`, `tool.assettable`, `tool.reveal`, `tool.openactions` | They are how the museum is *made*. No in-story arrival because no in-story existence, and Doctrine 11 keeps them off the glass permanently. |
| **(iii) Not MGK material** | 7 — `wal.artifacts`, `shop.shirts`, `shop.domain`, `shop.mikes`, `channel.qr`, `channel.supplies`, `channel.services` | The transfer classes are a fiction about **one machine line's paperwork arriving**. Other artists' work, the house's merchandise and the Foundation's giving channels do not arrive from anywhere — the house makes or arranges them. |
| **(iv) The house's own unwritten words** | 2 — `doc.summary`, `doc.credo` | Not transferred, found or unlocked. **Written**, by Mike. No class covers authorship. |

### Two of these are findings about the ledger, not about the arc

**(ii) is a hole in the catalogue.** `reveal/README.md` §1 says a row is "a
revealable thing." The four `tool.*` rows are *not revealable* — they are
permanently off the glass by doctrine, not by schedule. They are the only rows
in the table that can never be spent. **Reported, not fixed:** deciding whether
Ops instruments belong in a reveal ledger at all is a structural call.

**(iii) is a boundary nobody had drawn.** The museum holds two kinds of thing at
once: MGK material, which has a provenance fiction, and everything else, which
has none. Their *live* counterparts (`wal.*`, `shop.sticker`, `channel.shop`,
`channel.music` — 8 rows) sit in BLAST **by necessity under rule (b)**: they
were on the glass on day one and the rule admits no other answer. That is
honest but it is not *meaningful* — the blast is an MGK event and Carsie
Blanton did not arrive in it. **Flagged rather than smoothed over.**

### And a third finding, which is a live breakage this round discovered

**THE MANUAL-PAGE VESSEL POINTS AT NOTHING, AND `reveal:check` HAS BEEN DEAD
SINCE 16:14 TODAY.** The robots repo's typewriter pass (`4cd78ac`) retired all
24 renders under `robots/mgk-viiip/manual/pages` and replaced them with a
**61-page structure issue** under `manual/structure/pages`. Museum v55 sealed at
13:38 — before that commit — with the old path wired into
`reveal/schema.mjs`. Nothing ran the check in between, so it went unnoticed;
it did not report a fault, it **died with a Node stack trace.**

Two repairs and one refusal:

- **Fixed:** the check now distinguishes *"this page is missing"* (the guard
  doing its job) from *"the whole source tree moved"* (a repo-level fault), and
  reports the latter as one clear named fault. **A gate that crashes is not a
  gate** — it cannot tell you the one thing it exists to tell you.
- **Refused:** the path was **not** repointed at the structure render. Page 7 of
  the 61 is not page 7 of the 24 — the structure issue renumbers everything — so
  aiming it there would make `doc.manual.page.07` quietly mean a different leaf.
- **For Mike:** the museum's canon, **on the glass**, is a *24-page* manual
  (`face.viiip.manual`, `doc.manual`). The robots repo now builds 61 pages and
  has retired the 24. **Reconciling 24 against 61 is a ruling, not a path edit**,
  and it is the same question the robots `STATE.md` already raised as *"whether
  61 pages is the right size for this object."*

> ### CLOSED 2026-08-05 (v56/G1) — and the ruling is bigger than the path
>
> **MIKE: the old 24-page manual is DEAD and its page numbering with it. 61 is
> the current number — and the standing rule is that THE MANUAL IS AS LONG AS THE
> MANUAL NEEDS TO BE, AND NOT LONGER. The page count is a consequence of content,
> never a target.**
>
> That is why the fix is not a repointed string. `MANUAL_PAGES = 24` is **gone**:
> the count is now **read off the source tree** every time it is asked for
> (`manualPages()` in `reveal/schema.mjs`). A constant standing in for a fact
> about a document in another repository is exactly what T-A was, and a constant
> cannot be kept in step by discipline. A count read off the tree cannot fall out
> of step at all. Re-run the generator at 58 pages or at 90 and the vessel simply
> refuses a different page number.
>
> **The three ways a future change could break it, and where each is caught now:**
>
> | what changes | what happens |
> |---|---|
> | the tree **moves** again | one named repo-level fault, not a stack trace — kept from T1, reworded so it no longer names the 24 as the thing that was lost |
> | the count **shrinks** | `manualPageRow()` refuses the page at write time, **and** `validate()` faults any row already in the ledger that names a page past the end. A shrink that stranded written rows used to be invisible in both directions. |
> | the count **grows** | nothing breaks and nothing needs to |
>
> **All three were broken on purpose and all three reported.** The count is also
> printed on every `reveal:check` pass, so a change is visible rather than merely
> survivable.
>
> **And it exposed one thing on the glass.** `public/robots/manual/working-copy-p1.png`
> was a copy of `manual/pages/page-01.png` — a page of the *retired* document,
> which a copied file cannot notice being deleted upstream. The Manual's still is
> now page 1 of the live structure issue, the file is renamed, and its judgement
> was carried across by the declared `assets:rename` path and then **re-read**,
> because the picture changed as well as its name. One judgement call is flagged
> rather than buried: the new page's own type reads **TEXT NOT SUPPLIED**, which
> is an early issue circulated for arrangement in the fiction and *the museum
> admitting it has not written the manual* read the other way. The caption is
> written to hold the first reading. It is Mike's if it is too thin.

---

## 7. WHAT THE ARC DEMANDS THAT NO ASSET SATISFIES

This is the section that matters most, and it is short because the finding is
sharp.

### 7.1 Month 3 — the reckoning — has six rows, and five are the same thing

| month | the arc | what the ledger supplies |
|---|---|---|
| **1 — the arrival** | weeks 1–4 | 102 BLAST rows landed at week 0, plus the first packages from week 3. **Oversupplied.** |
| **2 — the turn** | weeks 5–8 | packages through week 7, transmissions from week 5. **Thin.** |
| **3 — the reckoning** | weeks 9–12 | **TRANSMISSION only — 6 rows.** |

And those six are: five twin app stubs (`twin.app.advice.rest`,
`predictions.rest`, `user.security`, `codes`, `mgkmodel` — all of which read
*DATA NOT LOADED*) and `doc.ads`. **The reckoning is currently five menu rows
filling in and a set of advertising plates that do not exist.**

Nothing in the ledger is *about* a reckoning. There is no row for a conclusion,
a consequence, an answer, or a closing of the file — and the story arc's own Act
I thrust (*who was the previous owner of this unit, and what happened to them?*)
has **no row at all** in a 152-row catalogue of everything the museum holds.

### 7.2 The turn has one asset that is about understanding

Month 2 is *"the units get understood and stop being the point."* The ledger has
a `arc` field with exactly that vocabulary — and across 152 rows it is set on
**nine**, of which exactly **one** is `understood`: `face.niac.name`, the face
that reconciles MGK-NIAC against MGK-VIII.

**All nine arc-bearing rows are BLAST.** Every stage of the reveal arc the
museum can currently express is carried by material that arrived before launch.
The arc has no forward motion behind it because no new material is scheduled to
supply one.

### 7.3 Four promises on the glass are backed by no transfer at all

Eleven rows are `shown: true` — a visitor can read the label of something that
does not exist. Six are the Portal's dead positions (UNLOCK — *we have it, it is
closed*), one is `doc.manual.plates` (PACKAGE — *it is coming in a box*). **The
other four are exempt**: `wal.artifacts` and the three unbuilt giving channels.

Those four are promises the museum has already made and **no transfer class can
ever keep**, because nothing arrives to keep them. They are not gaps in the
timeline; they are outside it. That is the sharpest form of finding (iii).

---

## 8. WHERE A WEEK IS CARRYING TOO MUCH

**Week 0 carries 115 of 152 rows** — 102 BLAST plus 13 UNLOCK, all in hand
before the doors opened. That is 76% of everything the museum holds, arriving
in a 72-hour window.

**This is not a flaw and should not be "balanced."** It is the direct consequence
of Mike's own insight, and it is what buys the other three classes their
freedom: the site is already explained, so every later transfer can be *chosen*
for effect rather than *needed* for cover. A back half that has to keep
explaining the front half has no room to do anything else.

**What IS a problem is the other end.** Nine package rows across four Fridays is
**roughly two objects per package**, and three of those nine (`phys.nickels`,
`phys.time`, `phys.manual.original`) may never be publishable at all — the
nickels are deliberately unphotographed (the SEALED gap, M35), Time needs a
rights check, and whether an original manual is ever published is a `[PAPA]`.
**The realistic package inventory is six objects for four Fridays.**

So the shape is: **week 0 oversupplied, weeks 3–7 thin, weeks 9–12 nearly
empty.** The lever is not redistribution — it is that the back half needs
material that does not exist yet, and §7 says what kind.

---

## 9. TWO LAWS THAT SHOULD BE RECONCILED — flagged, NOT merged

The two repos govern invention with two different rules, and this round touched
both trees, so the divergence is worth naming. **Nothing was merged; that is
Mike's call.**

| | **Doctrine 12** (museum, `docs/canonical/OPERATIONS.md` §7) | **THE DRAFTING LAW** (robots, `docs/JOBONE_CAPTURE-enigma-words-20260719.md` §10) |
|---|---|---|
| **says** | "Ops does not invent content. Where a fact is missing, Ops ASKS." | "Claude-as-the-computer assembles from established canon ONLY — no coined catchphrases, signatures, gags, or terminology. All flavor is Papa's." |
| **governs** | **facts** — a date, a count, a measurement, a name, an ordering | **voice** — flavour, terminology, the machine's own idiom |
| **scope** | site-wide, every wing, every round | the words written into the machine |
| **remedy** | ask, in the one-question format | assemble from canon; nothing coined |

**They are not the same rule and neither contains the other.** Doctrine 12 would
permit a coined catchphrase that Mike had supplied the *fact* behind; the
Drafting Law would forbid it. The Drafting Law says nothing about inventing a
count. **A round working across both repos is currently governed by whichever
file it happened to read** — which is the same failure mode the museum fixed at
v55 for the ledger's validator ("a rule enforced in one of two places is
enforced at whichever moment the author happens to run").

**Recommendation, offered not taken:** the Drafting Law reads as the *voice*
specialisation of Doctrine 12's general form. If that is right, the fix is one
cross-reference in each file, not a merge — the robots law keeps its own text
and cites Doctrine 12 as the general case. **Not done unasked.**

---

## 10. QUESTIONS FOR MIKE — none blocking

Written in the one-question format Doctrine 12 prescribes. All five are recorded
in `docs/OPEN_ACTIONS.md` as **T-A** … **T-E**.

**T-A — THE MANUAL IS 24 PAGES ON THE GLASS AND 61 IN THE BUILD.**
*Known:* the museum's canon says a 24-page manual, twice, where visitors read
it. The robots typewriter pass retired the 24-page render and now builds 61.
*Missing:* which number is the object. *Why it matters:* `reveal:check` is RED
until this is ruled, and the manual-page vessel cannot name a page until it
knows which document it is naming.

**T-B — WHICH FOUR OF THE FIVE FRIDAYS IN WEEKS 3–7 CARRY PACKAGES?**
*Known:* four packages, window weeks 3–7. *Missing:* which week goes empty.
*Why it matters:* no package row can carry an arrival week until then, and check
(b) means an undated package can never be shown.

**T-C — WHAT DOES THE RECKONING ACTUALLY CONSIST OF?**
*Known:* month 3 is the reckoning. *Missing:* what arrives in it. *Why it
matters:* the ledger's entire back half is five twin menu rows filling in and one
unbuilt set of advertising plates (§7.1).

**T-D — DO THE NON-MGK ROWS BELONG IN THE TRANSFER MODEL AT ALL?**
*Known:* WAL, the shop and the giving channels have no provenance fiction; their
live rows are BLAST only because they were on the glass. *Missing:* whether the
museum wants a second, non-fiction provenance for house material, or whether
exemption is the right permanent answer. *Why it matters:* four promises already
on the glass are backed by nothing (§7.3).

**T-E — SHOULD DOCTRINE 12 AND THE DRAFTING LAW BE RECONCILED?**
*Known:* both exist, both govern invention, neither cites the other (§9).
*Missing:* whether the Drafting Law is the voice specialisation of Doctrine 12.
*Why it matters:* cross-repo rounds are governed by whichever file they read.

---

## 11. WHERE IT LIVES

```
reveal/transfers.mjs        the four classes, the assignment, the exemptions,
                            the three checks, and the two tensions in full
reveal/schema.mjs           calls transferFaults() from THE ONE VALIDATOR
reveal/ledger-declare.mjs   applyTransfers(ROWS) before validation
reveal/ledger.json          `transfer` and `transferWeek` on every row
tools/reveal-ledger.mjs     transferGuardFaults() — proves each refusal refuses
docs/ASSET_TIMELINE.md      this file
```

```
npm run reveal:build     rebuild; refuses an unplaced row
npm run reveal:check     integrity; refuses a thing shown before it arrived
```
