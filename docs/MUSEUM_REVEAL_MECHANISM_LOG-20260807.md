# THE REVEAL MECHANISM + THE 12-WEEK TABLE — round log

**2026-08-07 · R1 · R2 · R3 · T1 — four instructions, all four answered.**
Single agent, drafting lane, no git until seal, standing gates, Doctrine 12
absolute.

**Gates:** lint **11 errors / 9 warnings = baseline, zero new** · build **green**
· `provenance:gate` **PASS** · `reveal:check` **PASS** · `parity:gate` **PASS, 4
shared · 0 divergences** · `instory:gate` **PASS** · `assets:orphans` **0** ·
**the lap RAN, all seven Ops pages, at 390px and 1228px** — zero page-level
horizontal scroll, zero console errors · `lap:clean` clean (the harness was
never copied in; the docs pages needed a server of their own, in the
scratchpad).

**Nothing in `src/` changed.** Surfacing unmoved at **20 spendable — the fifth
packet running**, said plainly rather than left as a silence.

---

## THE HEADLINE FINDING: R1 ASKED FOR A MECHANISM THAT ALREADY EXISTS, AND SAYING SO IS THE ANSWER

Mike's framing was *"during the first 90 days, an asset appears ONLY AFTER the
story has called for it"*, with a list of three mechanisms to price. That
sentence is **H2's pull-back rule**, written on 2026-08-06 and enforced since —
`delivered()` reads the paths a Record entry names, `publicPlacements()`
normalises them, `placeRule()` gives an undelivered governed path **no address
at all** at LAUNCH, and `deliveryFaults()` fails the build in both directions.

So the ninety days need **no new rule, no new stage and no schedule**. They need
the LAUNCH stage, which exists, and one step a day. **What was actually missing
was the step**, and that is what got built.

### The three mechanisms, priced — and the rejection reason for (a) is not the obvious one

| | cost | verdict |
|---|---|---|
| **(a) a dated manifest the build reads** | a date per asset (315 of them, all Mike's, none of which exist — `when` is null on all 162 ledger rows) | **REJECTED** |
| **(b) per-entry asset lists off the Record** | **zero actions beyond dictating the entry** | **RECOMMENDED** |
| **(c) hand-edited state per day** | one action a day, plus re-deriving (b)'s answer by hand, ninety times | **REJECTED** |

**(a) was rejected on DUPLICATION, not on the clock.** The clock objection — a
build that reads *today* is a build whose output changes with no input changing,
so `reveal:check` passes on Tuesday and fails on Wednesday — is real and is
fixable by pinning the day as a build input. What is not fixable is that a
manifest is a **second source of truth about what is public, sitting beside the
Record and free to disagree with it.** This repository has paid for that shape
four times: three copies of Hunter Root's catalogue, the ledger becoming a
second Record, and the two assets declarations drifting forty-five rows apart.

**(c) is (b) with the linkage broken and the accuracy made optional**, and it is
the only one of the three that can reveal early by typo.

### What (b) costs Mike per day, in actions

**One: dictate the day's entry.** He was doing that. Everything else is Ops' —
write the entry with its `assets`, `npm run reveal:day -- --place`, the gates,
`npm run deploy:launch`. Four commands, none of them his.

### The three failures he asked about

- **A DAY IS MISSED — nothing happens.** No entry, no publish, no gap to explain,
  no state to repair. This is (b)'s strongest property and the reason it
  survives ninety steps: a missed day *looks like* a day with no entry, because
  it is one.
- **A DAY IS WRONG** — strike the path from the entry, `--place` moves the file
  back behind the door, deploy. Two edits, both mechanical, and the gate catches
  the half-done state in either direction.
- **A PULL-BACK AFTER SHOWING** — the same two edits, **and they work against
  this museum and against nobody else.** The site stops serving it, immediately
  and provably; caches, crawlers, archives and a visitor's disk are outside this
  repository's reach. Mike's own *we never go backwards* is the better answer;
  this is the repair path for when the rule is broken by accident.

---

## R2 — WHAT WAS BUILT

### `reveal/day.mjs` · `npm run reveal:day` · `-- --place` · `-- --since <ref>`

Every governed picture in exactly one of four states — **PUBLIC** (delivered or
signage, at the public address) · **HELD** (undelivered, behind the stage door —
the rule working) · **PLACE** (delivered and still held → move out) · **PULL**
(public and no entry calls for it → move back). `--place` performs the moves in
both directions and refuses anything it cannot account for. `--since <ref>`
parses the Record out of a git blob and prints what today publishes that the
ref's did not.

**It computes nothing new and it rivals nothing.** It reads `delivered()` and
the governed tree — the same two things `deliveryFaults()` reads — and turns the
two faults that gate already reports into the two moves that clear them.

**And it deliberately does not draw the transfer class**, which is the one
omission worth defending: a transfer class is on a LEDGER row and this report is
about FILES, and the two tables meet at nine rows in a 162-row ledger against a
315-row asset table. A transfer column would be blank on almost every line and
read as *unclassified* when it means *not joined*.

**It is not a gate.** `reveal:check` is the gate and is unchanged; this exits
non-zero when the tree is out of step, so it can sit in front of a deploy.

**It never touches the stage, and it prints the stage first**, because in
DEVELOPMENT the whole plan is moot: everything PLACED renders and an ordinary
`npm run deploy` publishes the Portal and every photograph.

### A FOURTH DELIVERY CHECK, WRITTEN FOR DAY 40 — *DELIVERED AND ABSENT*

`deliveryFaults()` had three checks and all three **walk FILES**. So an entry
naming `/robots/foo.png` with no file at either address was invisible: the entry
publishes, the wall shows nothing, and **every gate in `reveal/` passes.** Over
ninety daily steps that is the failure that costs a day and reports nothing.

Check 4 walks the ENTRY instead. **Zero instances today**, and it was **proved
by breaking it on purpose** — the one delivered picture moved aside, the fault
fired with its full sentence, the file restored, zero faults.

### Two small edits that made it possible, both proved inert

- `record-entries.mjs` — the parse is separated from the read (`parseRecord(src)`),
  because yesterday's Record is a blob in git and not a file on disk. **The
  file's own split is untouched:** it still returns numbers and asset paths, and
  the reader that can see words is still the one that forbids them.
- `delivery.mjs` — `publicPlacements(given = delivered())` takes a parameter, so
  the delta asks the same question of an old Record **without a second copy of
  the normalisation rule.** Every existing caller is unchanged.

### Proved end to end, both directions, on real files

| test | result |
|---|---|
| delivered file moved behind the door → `--place` | **placed**, tree and Record agree, `git status` clean |
| held file moved to a public address → `--place` | **pulled**, tree and Record agree, `git status` clean |
| the same file at BOTH addresses | **REFUSED**, named, exit non-zero — *nothing here can tell which copy is live* |
| `--since 60c4b8d` (before Record 013 named its picture) | `+ /robots/reference/photos/rear_power_switch.png` |
| `--since <bad ref>` | reported as a git failure, not a silent empty delta |

---

## R3 — THE HIDDEN LINKS, SCOPED. NOTHING BUILT.

Full document: **`docs/HIDDEN_LINKS_SCOPING-20260807.md`**.

**THE FINDING IS A THIRD GRADE OF SECRET THAT EVERYONE FORGETS EXISTS, AND IT IS
THE ONE THIS STORY IS ACTUALLY BUILT FOR.**

- **GRADE A — GENUINELY SECRET.** The material is not on the visitor's machine.
  Only the worker can supply this. *Today: `/hr`.*
- **GRADE B — SEALED IN THE OPEN.** The material **is** on their machine and is
  useless without a key that was never published. **No server, no state, no
  daily step.** An encrypted archive served as an ordinary static file is
  exactly as secret as its passphrase. *Today: nothing uses it.*
- **GRADE C — THEATRICALLY SECRET.** The lock is a check in the bundle.
  Legitimate as ceremony; never for a reveal.

**AND THE STORY'S OWN DEVICE IS ALSO THE CORRECT ENGINEERING.** A standard zip
encrypts the contents **and not the file list** — an AES zip still tells you the
names and sizes of everything inside. Nesting is the only thing that hides the
inner manifest. *Zips inside zips* is not decoration.

**THE ONE RULE THAT DECIDES MOST OF THE DESIGN:** *anything decrypted
client-side needs a passphrase strong enough to survive an offline attack;
anything checked by the worker may be short.* The worker can rate-limit; a
shipped ciphertext cannot.

Other load-bearing points: **ZipCrypto is broken** (known-plaintext) and AES
zips **do not open in Windows Explorer or macOS Archive Utility**, which is an
audience cost and Mike's call — WebCrypto in the browser avoids it entirely.
*Codes that fail when typed directly* is the cheapest build in the document if
the transform lives in the worker. *Owner-unlock becomes community property* is
**the only one of the four that cannot be static**, needs a fourth D1 table, and
must not cache its open set — **a mechanism whose staleness window cannot be
named should not guard a reveal.**

**AND A THIRD DOOR PAIR, NEVER EITHER EXISTING ONE.** `/assets/locked/` +
`/locked/` is PERMISSION and `/assets/held/` + `/held/` is STAGE — named for
their reasons. A story lock is a third reason; collapsing it into either would
put a puzzle on the same switch as ninety-three of Hunter Root's tracks.

---

## T1 — THE TWELVE-WEEK TABLE

`reveal/arc-twelve.mjs` (the data) → `docs/dictation-20260807/arc.html` (the
page, built by `tools/dictation/worksheet.mjs`, the same form and the same
collector as the worksheet — literally the same three declarations, not a
resemblance).

### TWO AXES, AND THEY ARE NOT THE SAME AXIS

The instruction asked for a marking the standing rail scheme **cannot express**,
so the page carries both and says on its own masthead that they answer different
questions.

- **`rail` — whose sentence is this?** The column's own label: **Ops**, or
  **your words** in gold.
- **`band` — is there anything of yours under it?** Mike's own marking:
  DICTATED (weeks 1–3) · SCAFFOLD (weeks 4–12) · plus **INVENTED STRUCTURE
  AWAITING YOUR STORY** on month 3.

Week 1 is **blue and DICTATED at once** — he spoke the shape and Ops wrote every
word of the headline — which is exactly why one mark could not carry both.

### ELEVEN ROWS BLUE, ONE GOLD, AND ONE OPEN

Mike presented all twelve as *"Ops' left column"*, so blue is the default.
**Week 2 is the exception and it is not a judgement made this round:** its
headline is `headlineVerbatim: true` in `week-two.mjs`, put there by the round
before from a written instruction, and the string in this instruction is
byte-identical. Demoting it because a later instruction listed it under a blue
heading would be the **inverse error the rails exist to prevent** — *his own
sentence left in blue gets quietly "improved" by the next round.*

**WEEK 3 IS THE ONE OPS CANNOT SETTLE.** *"IT IS BEAUTIFUL AND IT DOES NOTHING"*
arrives in his characters, and he groups week 3 with 1 and 2 — but those two
carry **different rails**, so the grouping does not say which. It is blue,
because a paraphrase wearing gold is indistinguishable a week later from
something he said. **One word moves it. Row `R-c`.**

### SIX CHECKS AGAINST THE TREE, ONE UNRESOLVED

- **A-1 (OPEN) — THE HEADLINES ANSWER A QUESTION THE TRANSFER MODEL SAYS IS NOT
  IN THE ARC.** PACKAGE opens at 3 and closes at 7 — five weeks, four Fridays —
  and `transfers.mjs` states that *which week goes empty is not in the arc*, so
  no package row carries a week. But week 6 says the **fourth** box is already in
  the hallway and week 7 says the fourth one finishes something. Read straight,
  the arrivals fall on weeks 3–6 and **week 7 is the empty one.** Ops will not
  pick: `transferWeek` is the field the whole show-before-it-lands check is built
  on.
- **A-2 — WEEK 3 IS ABOUT A THING YOU ALREADY HAVE**, which is X-1's third
  reading arriving from a second direction. No fourth way out; the third one now
  has two arguments.
- **A-3 — 12 weeks × 2–3 a week = 24 TO 36 GENUINE REVEALS IN THE WHOLE ARC.**
  Twelve weeks is the first period long enough to give the bouncy ball law an
  arc figure. **This is not the voided arithmetic:** it multiplies a CEILING by a
  PERIOD and never touches an asset count. And nothing is priced against it —
  `bucket` is null on all 315 rows (B-a).
- **A-4** — week 8 is transmission-shaped and four weeks inside the window.
  Agrees.
- **A-5** — two of twelve weeks have days under them; ten do not. **That is why
  this page asks only for headlines**; asking for fifty more days would be
  asking him to fill in a form Ops built out of nothing.
- **A-6** — the instruction's week 1 and week 2 headlines were compared
  **character for character** against the two week files, apostrophe included.
  Both match, and the module now IMPORTS them so it cannot start to drift.

---

## THE TWO FINDINGS THE ROUND PRODUCED THAT NOBODY ASKED FOR

### 1. A QUESTION ASKED ON TWO PAGES GETS TWO ANSWERS — AND WOULD HAVE SILENTLY EATEN ONE

The worksheet's first section was **`W1.SUM` and `W2.SUM`**: the headline of
weeks one and two. The twelve-week page asks for the headline of all twelve,
**including those two.** Two pages, two `localStorage` keys, neither able to see
the other's — and nothing on either would say they disagreed.

**They are deleted from the worksheet.** It is thirty slots of DAYS now; the arc
page owns week headlines; both pages say so in their own leads.

**AND REMOVING THEM EXPOSED A REAL LOSS PATH IN A MECHANISM THAT HAD SHIPPED THE
DAY BEFORE.** `save()` wrote `JSON.stringify(values())`, and `values()` only
sees textareas **that still exist** — so the first blur after this round would
have **silently deleted whatever had been typed into the two retired slots.** A
generator may remove a field; it may not remove the answer that was in it.

Two mechanisms, both proved in the browser:

- **`save()` now owns only its own slots.** Foreign keys in the store are
  carried through untouched. *Proved:* seeded `W1.SUM`, typed into a day field,
  blurred — `W1.SUM` survived the write.
- **A CARRY.** The arc page declares that `ARC.W1`/`ARC.W2` inherit from the
  worksheet's `W1.SUM`/`W2.SUM`. It fills **only an empty box** and it **marks
  the row in amber**, because a silent pre-fill is indistinguishable from
  something he typed there. *Proved:* seeded `W1.SUM`, loaded the page, week 1
  pre-filled with the amber note, week 2 left empty.

### 2. THE LAP FOUND THE PAGE PUTTING THE WORD *OPS* AT THE HEAD OF MIKE'S OWN SENTENCE

The first cut printed the shared **Ops** column label above the headline **and** a
rail tag beside the band — which read as "OPS" twice on eleven rows and, worse,
labelled the one column that on week 2 **contains his own words**. It is one
mark now, in the place the reader already looks, and it cannot mislabel the row
it sits on. **Only a screenshot found it**; every string was correct.

---

## WHAT WAS DELIBERATELY NOT DONE

- **No third stage.** The ninety days ARE the launch stage. A `performance`
  stage would have been a third value on a switch whose whole safety property is
  that it has two.
- **No transfer column on the day report** — see above; the join is nine rows.
- **No hidden-links code.** R3 said scoping is the deliverable, and three of its
  decisions are Mike's.
- **No `weight`, no `bucket`, no resolved collision.** Same reason as every
  round since K-b: a made-up ranking makes a page read as answered while nothing
  has been answered.
- **Week 3's rail was not promoted to gold on an inference**, and `X-1` was not
  resolved by A-2.
- **`CLAUDE.md`'s twelve standing rules were not consolidated.** Two more round
  entries were archived under that file's own ~600-line rule and it is still
  **~720 lines** — because the log is now ~145 of them and the rest is ~575, of
  which **five `N STANDING RULES ADDED` headings carry twelve rules that every
  one also has an `OPERATIONS.md` §5 row for.** K1 collapsed a forty-line pointer
  chain on exactly that argument. It is **named in that file's own log rather
  than acted on**: collapsing twelve standing rules is a real edit with a real
  chance of losing a load-bearing pointer, and it is not a thing to do on the way
  past a four-instruction round.

---

## THE ONE THING THAT IS STILL UNMEASURED, SAID PLAINLY

**Whether `clipboard.writeText` succeeds under a genuine user click** — unchanged
from the round before. Every test click this session was synthetic and carried
no user activation, so the browser refused the clipboard and the **fallback was
observed working**: the assembled text is written into the box, selected, and
the page says *"the browser refused the clipboard — press Ctrl+C."* The button
is useful either way. **`navigator.clipboard.readText()` was not called**, per
the standing note: it raises a tab-modal prompt that freezes the renderer.

---

## FILES

**New:** `reveal/day.mjs` · `reveal/arc-twelve.mjs` ·
`docs/HIDDEN_LINKS_SCOPING-20260807.md` · `docs/dictation-20260807/arc.html`
**Changed:** `reveal/delivery.mjs` (check 4, parameterised `publicPlacements`) ·
`reveal/record-entries.mjs` (`parseRecord`) · `tools/dictation/worksheet.mjs`
(the arc page, the non-destructive save, the carry, two slots removed) ·
`tools/dictation/prep.mjs` (writes `arc.html`, index cards) · `package.json`
(`reveal:day`) · the regenerated dictation pages · `docs/OPEN_ACTIONS.md` ·
`docs/canonical/OPERATIONS.md` · `CLAUDE.md`
**Unchanged:** everything in `src/`.
