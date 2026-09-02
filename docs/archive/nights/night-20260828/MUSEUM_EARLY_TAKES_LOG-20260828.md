# THE TWO EARLY TAKES LAND · THE FIFTH TYPE REPORTED · THE GUESTBOOK IS OPS' JOB

**2026-08-28, amended 2026-08-29.** HEAD at start `06191e5`. Nothing committed
by Code; Mike commits.

---

## 1. `RENDITION_TYPES` DOES NOT EXIST — THE ANCHOR IS `TYPE_META`

**Said first, because the brief named it and a wrong anchor propagates.**

```
grep RENDITION_TYPES  across the tree   → nothing
git log --all -S"RENDITION_TYPES"       → nothing
```

**It does not exist in the tree and never has, on any ref.** The real
declaration is **`TYPE_META`, `src/routes/exhibit/Exhibit.jsx:52`** — and
CLAUDE.md's own rule 1 is that every anchor in a packet is mapped before
anything is drafted.

### What `TYPE_META` actually holds

```
official · live · clip · lyrics · cover · audio · hr_cover · fan_cover
```

Eight keys; `hr_cover` and `fan_cover` normalize to `cover`, so **six distinct
chips.** Consumed in exactly two places — `typeLabel()` and `typeColor()`, lines
95–96. **Nothing else in the museum reads a rendition type.**

### What the gate does with an unknown value: NOTHING. There is no gate.

Checked across `tools/`, `reveal/` and `provenance/`: **no gate validates a
rendition type.** The only `.type` matches are AST node types inside the
parsers. **So an unknown value is caught by nothing, which is precisely why a
fifth type could arrive as a side effect and nobody would see it.**

### What happens at render — measured, not reasoned

| value | chip | colour | |
|---|---|---|---|
| `"official"` | `OFFICIAL` | gold | declared |
| `"early"` | `EARLY` | `#888` | **undeclared — renders, does not throw** |
| `undefined` | — | — | **THROWS `TypeError` in `toUpperCase()`** |
| `null` | — | — | **THROWS `TypeError`** |
| `""` | *(empty)* | `#888` | renders an empty chip |

**Omitting the field is not available.** `typeLabel` is
`TYPE_META[t]?.label ?? t.toUpperCase()` — the optional chain guards the lookup,
not the fallback.

### What the early takes would need — and the ruling this does NOT take

**A VALUE IN THE DATA IS NOT A FIFTH TYPE.** The vocabulary lives in one place
and a type is created only by adding a `TYPE_META` row. **Nothing in
`weird-baby.js` can create one, and this round adds none.**

**A fifth type IS a real decision, and it is Ops' to rule.** It would take:

1. a `TYPE_META` row — **which is `Exhibit.jsx`, a ROUTING file, off-limits to a
   data drop** (CLAUDE.md);
2. a **label** and a **colour** — both visitor-facing, so both Mike's;
3. an amendment to the **Official / Live / Lyrics / Cover** taxonomy he settled
   in **May 2026**;
4. and, if it is to mean anything, something that validates it — because today
   nothing would.

**WHY NO EXISTING KEY WAS USED.** Not `official` — there is already an official
video on each track and the chip would print OFFICIAL twice. Not `live` —
nothing says these were performed live, and inferring it from the words *Front
Porch* would be Ops asserting a fact about a recording it has not heard. Not
`clip` — CLAUDE.md's taxonomy ruling is *clips don't belong in tracklists*. Not
`audio` — they are video.

**So the videos land carrying `type: "early"`, which is undeclared: it renders
its own word in grey, claims nothing from the museum's vocabulary, and is one
line to change.** The decision stays open and un-taken, and it is named here
rather than arriving quietly.

---

## 2. THE TWO VIDEOS — LANDED AS WRITTEN

```
Coconuts    - Weird.Baby - Early Front Porch    YibpBtf9IU8
E.D. Yahdah - Weird.Baby - Early Instrumental   WOWS-RWywgA
```

**Verified in the built bundle**, not only in source. Three renditions per
track now:

```
1  official   Official Music Video
2  early      Early  /  Early Instrumental        <- the chips Mike ruled
3  audio      first pass
```

**The middle slot is the only one that leaves both existing rulings' ends where
they were** — video FIRST (2026-08-20), `first pass` beneath it. One line to
move, and no other row moves with it.

**`Yahdah` stands.** Mike confirmed the copyright; YouTube's title for
`WOWS-RWywgA` reads *Yadah*. **The channel is wrong, not the museum**, so the
title comes from him and never from the platform — written at the data site
because a later round syncing titles off YouTube would break it.

### THE CHIPS — MIKE RULED THEM, AND THE CHIP IS THE LABEL

> **E.D. Yahdah — EARLY INSTRUMENTAL**
> **Coconuts — EARLY**

**Found the mechanism before changing anything.** `tidyDesc()` at
`Exhibit.jsx:643` is `(v.label || typeLabel(v.type))` uppercased — **the LABEL
wins wherever both exist.** So his two chips are a label question, not a type
question. Measured:

| track | label | chip |
|---|---|---|
| E.D. Yahdah | `Early Instrumental` | `EARLY INSTRUMENTAL` — **already exact, unchanged** |
| Coconuts | ~~`Early Front Porch`~~ → **`Early`** | `EARLY` |

**One string moved.** His supplied line called it *Early Front Porch*; the chip
he ruled is shorter, so the label changed and nothing else did. **Two different
chips, one shared `type`, and still no fifth type.**

`Early Front Porch` is now absent from the built bundle — confirmed, 0 files —
and its register row was retired with it.

### THE REGISTER — AND ONE CORRECTION OPS OWES BACK

**`MIKE` IS A REAL CLASS AND OPS DID NOT INVENT IT.** The brief said otherwise;
the tree disagrees, and this had to be checked before four rows were moved off
it:

```
HOUSE 933 · VERIFIED 840 · MIKE 205 · RESTATED 106 · DERIVED 16
ORIGIN_CLASSES = ["MIKE","VERIFIED","DERIVED","HOUSE","RESTATED"]   tools/provenance-sweep.mjs:92
```

**`provenance/README.md:40` defines it:** *"**MIKE** — Supplied by the operator:
his words, his facts, his rulings."* Against **VERIFIED — "External and
sourced."**

**So the four rows split, and the split is what the definitions require:**

| string | class | why |
|---|---|---|
| `YibpBtf9IU8` | **VERIFIED** | an external identifier, and **the citation is Mike's attestation** |
| `WOWS-RWywgA` | **VERIFIED** | same |
| `Early Instrumental` | **MIKE** | his words |
| `Early` | **MIKE** | his ruling of 2026-08-29 |

**The two ytIds are VERIFIED exactly as ruled**, and each `s` says what the
citation is:

> **VERIFIED ON MIKE'S ATTESTATION, WHICH IS WHAT THE CITATION IS.** §8 makes
> SEEN PLAYING the only probe it accepts, and Ops could not run it — pane
> `hidden`, `0×0`, and the control `c1vODrVXOg0` reading `unstarted` with
> `currentTime` flat for 14s. **Mike saw it play and ruled it landed on
> 2026-08-29; the observation is his and not Ops'.**

**The two labels stayed MIKE, and that is a flag rather than a refusal.**
Marking a word Mike chose as *external and sourced* would be false by the
register's own table — VERIFIED requires an external citation, and there is no
external source for a name he picked. **If he wants them VERIFIED anyway it is
two lines; Ops did not make that call silently.**

---

## 3. THE GUESTBOOK IS OPS' JOB — THE ABDICATION, NAMED

**Mike is right and the record should say so plainly.** Ops wrote *"the
Cloudflare console is the only path"* and filed the whole thing under his
errands. **That was an abdication, and it was worse than incomplete:**

> **`tools/backup-guestbook.ps1` ALREADY EXISTS.** Ops built it. It is
> Ops-owned, read-only, runs `wrangler` against the same remote D1, and has a
> scheduled sibling. **The precedent for an Ops-owned guestbook tool was already
> in the tree, written by Ops, and Ops answered "console or nothing" anyway.**

Claude built the guestbook. A wing with no maintenance tool is a gap Ops closes.

**REPORT ONLY. NOTHING BUILT. NOTHING DELETED. NO DATABASE COMMAND RUN.**

### What a READ tool would take

**Almost nothing — it is `backup-guestbook.ps1` minus the writing.** That script
already does `wrangler d1 execute --remote` read-only and formats rows. A
`guestbook:list` would be:

- one `SELECT id, name, note, badge, signed_at FROM guestbook ORDER BY signed_at DESC`
- printing **`id` first and prominently**, because the site prints POSITIONS
  (`01`–`07`) and the real ids have gaps (`1, 2, 5, …`) — **the `07` a visitor
  sees is not `id = 7`**, and that mismatch is the single most likely way a
  wrong row gets deleted
- read-only, no flag, safe to run any time

**This is the piece with no downside and it is the one to build first.**

### What a DELETE tool would take

Four things, and the first is not optional:

1. **A BACKUP IMMEDIATELY BEFORE, IN THE SAME COMMAND.** The newest backup
   holding the table is **2026-07-01 with 3 rows against 7 live** — **four live
   signatures are in no backup at all.** A delete tool that does not take a
   fresh dump first is a tool that destroys unbacked data.
2. **Match on `id`, refuse a bare position**, and **print the full row and
   require it be confirmed** before acting — the `export-artifacts` shape: a
   typed flag, and the tool refuses without it.
3. **A written record** — see below.
4. **A restore path proved by using it**, or the backup in step 1 is a claim
   nobody has tested.

### What records that a row was removed — NOTHING, and that is the real gap

```sql
CREATE TABLE guestbook (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
                        note TEXT, badge TEXT DEFAULT 'Founding Visitor', signed_at TEXT)
```

**No audit table. No `deleted_at`. No `hidden`. No `visible`.** The worker does
`SELECT *` unfiltered. The backup log records backups, not mutations.

**A deleted row would leave no trace in the database, no trace in the tree, and
no document saying why** — and the next backup, if one ever runs again, would
simply not contain it. **Nobody could later tell a deletion from a signature
that was never made.**

### Does hiding beat deleting? — YES, and for a reason that is not caution

| | cost | reversible | leaves a record |
|---|---|---|---|
| **DELETE** | one statement | **no** | **none** |
| **HIDE** — `ALTER TABLE guestbook ADD COLUMN hidden INTEGER DEFAULT 0`, one `WHERE hidden = 0` in the worker, one deploy | small, one-time | **yes** | **yes — the row and its flag both survive** |

**Hiding is better because it is the only option that answers the question
"what happened to entry 07?" a year from now.** It costs one column, one `WHERE`
and one deploy, and after it exists every future removal is reversible and
recorded — including ones nobody has thought of yet.

**And it may not even be the row he objects to.** The entry is his own signature,
dated. The sentence inside it — *"Weird.Baby is open for business!"* — is what
Ruling D made false, and it sits three lines under a countdown reading nine days.
**An `UPDATE` to the note keeps the signature and removes the falsehood.**

### What Ops recommends, in order

1. **Run `tools/backup-guestbook.ps1` once, now.** Read-only, exists, captures
   four unbacked signatures. **This should happen whatever else is decided.**
2. **Fix or retire the scheduled backup** — failing silently since 2026-07-01,
   twice, with the only record a log nobody reads.
3. **Build `guestbook:list`.** No downside.
4. **Then rule on hide vs edit vs delete**, with a working backup behind it.

---

## 4. THE SEARCH RECORD — THREE MISSES AND ONE HIT

| | reported | actually |
|---|---|---|
| CH4's working version | never existed | **REAL** |
| the monitor drag-resize | never existed | **REAL** |
| the drag handles | never existed | **REAL** |
| **the Lobby wording** | **FOUND** | **FOUND** |

**The hit is the important half.** `git log --all -S"not open yet"` — the
pickaxe over all refs on CONTENT, step 2 of §8's own list — returned it in **one
command**: `"You are early. That is noted."`, shipped `abf628a` **2026-04-13**,
killed `30d9162` **2026-07-25**, whose message ends *"You-are-early killed."*

**Filing that as a fourth miss would have said the method does not work. It
worked.** The pattern is the search, not his memory: he was right four times out
of four, and what changed on the fourth is that Ops asked what the tree **has
been** instead of what it **is**.

**Mike ruled the Lobby stays. `WbHome.jsx` is untouched by this round**, and
`.wb-whisper` remains an orphan rule at `WbHome.css:113` — flagged, not fixed,
because removing it would be a change he did not ask for.

---

## 5. GATES

```
lint                  9 errors / 7 warnings — BASELINE, zero new
build                 green
build:launch          green
provenance:gate       PASS — 4 rows added, UNDECLARED 0
reveal:check          PASS
parity:gate           PASS — 4 shared, 0 divergences
instory:gate          PASS
release:check         PASS
docs:numbers:gate     PASS
```

Register **2,096 → 2,100**, all four under `.entries`. `_undeclared.json`
emitted, consumed, deleted. **`Exhibit.jsx` untouched — no `TYPE_META` row
added. `WbHome.jsx` untouched. No database command run.**

**This commit touches `src/` and the bundle, so it is the first in a while that
needs a deploy to reach visitors.**

---

## 6. OWED

| | whose |
|---|---|
| **Rule on a fifth `TYPE_META` type for `early`** — label and colour | **Mike** (visitor-facing) |
| Run `tools/backup-guestbook.ps1` once — four signatures unbacked | Mike runs; **Ops should have asked sooner** |
| Build `guestbook:list`; then hide-vs-edit-vs-delete | **OPS** |
| Fix or retire the scheduled backup, failing since 2026-07-01 | **OPS** scopes |
| Upgrade the two ytId rows to `VERIFIED` after a foreground reading | anyone with a real browser |
| Instagram + Facebook handles; Instagram's account | Mike · `M60` |
