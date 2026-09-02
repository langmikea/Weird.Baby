# BROWSER RESCUE — two values out of Chrome's local store, 2026-08-25

**Written outside both repositories on purpose.** Museum HEAD `64359c1`, robots
HEAD `0f3acf5`, both `git status --short` empty before and after this round.
Nothing entered either tree: the site is frozen until Sunday 30 August, and
`docs/SUNDAY-20260830.md` step 1 stops the deploy on **any** line at all.

**This file is transit, not a home.** Both items below belong in the museum
tree; they land after Sunday with everything else. It exists so that neither
depends on a browser profile surviving until then.

---

## 1 · ARC.W4 — MIKE'S OWN WEEK-4 HEADLINE, UNPUBLISHED

### The sentence, verbatim

```
We know the machines, and the portal is up and running
```

**There is no typo in it and nothing in it is to be flagged.** An earlier read
of this round reported it ending `up trunning` and asked for that to be carried
under Doctrine 21. That word does not exist — see §3, THE METHOD. The line above
is the decoded value, character for character.

### Where it came from

- **Key** `wb.arc12.2026-08-07`, slot `ARC.W4` — the collector on
  `docs/dictation-20260807/arc.html`, the twelve-week table, built by
  `npm run dictation` from `reveal/arc-twelve.mjs`.
- **Store** Chrome, `Default` profile, the `file://` origin. On a `file://`
  page Chrome puts every local file in one storage origin, which is why the
  page could save there at all.
- **Record** newest is a PUT at sequence **2450275**, 121 characters, Latin-1,
  a complete and well-formed JSON object.
- **Read** 2026-08-25, by parsing the sstable directly (§3).

### The full value — two slots of twelve are answered, and only two

```json
{"ARC.W1":"THE WEEKEND THAT WASN'T SUPPOSED TO HAPPEN",
 "ARC.W4":"We know the machines, and the portal is up and running"}
```

The object closes after `ARC.W4`. There is no `ARC.W2`, `W3`, or `W5`–`W12`.
Checked against every sstable in the store, the write-ahead log, and Edge's
store — nothing else, nowhere else.

### ARC.W1 IS ALREADY CAPTURED AND NEEDS NOTHING

`THE WEEKEND THAT WASN'T SUPPOSED TO HAPPEN` is **byte-identical** to
`THREAD-002` in the museum's `docs/THREADS.md` and to `WEEK.headline` in
`reveal/week-one.mjs`. It is already canon, already verbatim, already filed.
**Do not re-land it.** It is recorded here only so that a later reader can see
the collector held two slots and that one of them was already home.

### ARC.W4 IS NOT ANYWHERE

Grepped both repositories for `We know the machines` and for
`portal is up and running` — **zero hits in either**, excluding
`node_modules` and build output.

### THREE THINGS IT DOES

**(1) IT ANSWERS OPEN ROW `K-b` — item 15g on `docs/OPEN_ACTIONS.md`'s SHORT
LIST.** That row's ask is *"Your own headline for each week and for each of the
ten days."* Week 4 is answered. The rest of the row stays open.

**(2) IT MAKES `arc.html`'s MARKING ON WEEK 4 FALSE.** `reveal/arc-twelve.mjs`
carries week 4 as `band: "SCAFFOLD"`, whose own stated meaning is:

> *"Nothing of yours is under this week. The headline is a shape to argue with,
> and arguing with a draft is faster than starting from a blank line — which is
> the only reason it exists."*

Something of his **is** under week 4, and has been since 2026-08-07. The page
still prints Ops' scaffold `IT BOOTS, AND IT HAS OPINIONS` in its place.
`docs/ARC.md`'s week 4 reads *"The workbook has a headline and no day titles"*
with SETS UP / PAYS OFF / TRUE BY THE END all *"(not written.)"*.

**Which rail it takes is not Ops' call.** `arc-twelve.mjs`'s own rule is that a
paraphrase wearing gold is indistinguishable from his sentence a week later, and
that the inverse error — his sentence left in blue and quietly "improved" — is
just as bad. This one is his characters, typed by him, so it is not blue. Ops
does not promote it without his word.

**(3) IT SURVIVES THE HARDWARE HOLD, AND THE PLANNED WEEK 4 MAY NOT.**
`docs/ARC.md` §4 records hardware on hold as of 2026-08-19 and marks week 4
**SUSPECT** — its workbook headline *STABLE VIIIp and PERSONALITY* *"reads as
the physical unit stabilising"*, and §4 could not confirm it because week 4 has
no day titles. **His own headline names the Portal, not the unit.** The Portal
is behind the door and running; it is not in a box that is not coming. That
reading needs no ruling — it is what the sentence says — but it is written down
here because the SUSPECT mark was placed without it.

---

## 2 · THE ASSIGN CAPTURE — ALL 22 IDS, BY RECORD

### Where it came from

- **Key** `wb.assign.week1.v1` — the day buttons on
  `docs/dictation-20260807/assign.html`, built by `npm run assign`, the lead
  card on the Ops Desk.
- **Record** newest is a PUT at sequence **2449285**, 1,205 characters,
  Latin-1, complete JSON. One earlier PUT survives at sequence 2448931 —
  25 characters, a single first press — and is superseded.
- **Shape** `{ "1": [id, …], … "5": [id, …] }`. Day number to a list of tile
  ids. No caption, no order within a day, no attachment title, no timestamp.

### The value, as read

| Record | ids | what he picked |
|---|---|---|
| **001** | 8 | robots `page-01` · `page-02` · `page-03` · `event:portal.album` · museum `/robots/manual/page-21.png` · `page-01` · `page-02` · `page-03` |
| **002** | 3 | robots `page-04` · `page-05` · `page-06` |
| **003** | 3 | robots `page-07` · `page-08` · `page-09` |
| **004** | 3 | robots `page-10` · `page-11` · `page-12` |
| **005** | 5 | robots `page-54` · `page-55` · `page-56` · `page-60` · `page-61` |

Raw, in full, so nothing here has to be trusted:

```json
{"1":["robots:robots/mgk-viiip/manual/structure/pages/page-01.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-02.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-03.png",
      "event:portal.album",
      "/robots/manual/page-21.png",
      "/robots/manual/page-01.png",
      "/robots/manual/page-02.png",
      "/robots/manual/page-03.png"],
 "2":["robots:robots/mgk-viiip/manual/structure/pages/page-04.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-05.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-06.png"],
 "3":["robots:robots/mgk-viiip/manual/structure/pages/page-07.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-08.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-09.png"],
 "4":["robots:robots/mgk-viiip/manual/structure/pages/page-10.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-11.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-12.png"],
 "5":["robots:robots/mgk-viiip/manual/structure/pages/page-54.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-55.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-56.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-60.png",
      "robots:robots/mgk-viiip/manual/structure/pages/page-61.png"]}
```

### EVERY ONE OF THE 22 RESOLVES

Checked against `provenance/asset-table.json`, `reveal/ledger.json`, the robots
working tree on disk, and a live `buildShelf()` run, all at museum `64359c1`.

**THE 4 MUSEUM PUBLIC PATHS — ALL FOUR ARE STILL TILES TODAY.**

| id | asset uid | on disk | tile today |
|---|---|---|---|
| `/robots/manual/page-21.png` | `A-08acc7e975` | yes | **yes** |
| `/robots/manual/page-01.png` | `A-a0c82628ef` | yes | **yes** |
| `/robots/manual/page-02.png` | `A-bb33c2b746` | yes | **yes** |
| `/robots/manual/page-03.png` | `A-cad1b3fe26` | yes | **yes** |

All four sit at `public/held/robots/manual/…` — present, behind the stage door,
`usedBy: []`, named by no Record.

**THE 18 ROBOTS IDS — ALL PRESENT, NONE OFFERED.** Every one is in the asset
table, `missing: false`, and confirmed on disk in `weird-baby-robots`. **None is
a tile**, and that is a rule rather than a fault: `tools/dictation/shelf.mjs`
drops every `repo === "robots"` row —

> *"robots-repo rows never appear: a thing still only there cannot be shown by
> any Record this week, so offering it offers something he cannot have."*

Today's shelf is **138 rows**, dropping 136 `superseded` and **76 `elsewhere`**,
which is that rule counting itself.

**THE PAGE NUMBERS TRANSLATE — ALL SEVENTEEN.** Every distinct page number he
chose (01–12, 54, 55, 56, 60, 61) has a live museum tile today at
`/robots/manual/page-NN.png`, labelled `Page 1` … `Page 61`, among 64 manual
tiles on the shelf. **17 of 17.**

**AND THE TRANSLATION IS NOT AN IDENTITY.** The museum's copy is a different
file from the robots repo's render:

| page | museum `public/held/robots/manual/page-NN.png` | robots `…/structure/pages/page-NN.png` |
|---|---|---|
| 01 | `af4abdef0832` · 1,926,945 bytes | `6d0276faa168` · 2,218,869 bytes |
| 02 | `5f9e6105e909` · 1,768,812 bytes | `9894fbc4717e` · 2,029,034 bytes |
| 03 | `ba22dc7bd15a` · 1,931,336 bytes | `b97ba9d7ef66` · 2,242,966 bytes |

Same page, different render. Re-pointing an old id at the museum's copy decides
**which file the museum shows**, which is a UX call under §0 and not a lookup.

**THE ONE EVENT IS ALREADY OUT.** `event:portal.album` is a real ledger row and
is now **`REVEALED / LIVE`**, `when: null`. Whatever that assignment was for,
the museum has already spent it.

### THE DAY-1 DUPLICATE — OBSERVED, NOT RESOLVED

**Record 001 carries pages 1, 2 and 3 twice**, once as robots ids and once as
museum public paths. It is recorded here as it was read. **Ops has not
deduplicated it and should not**: the plain reading is two sittings across a
rebuild of the page, but that is a reading, and which of the two files he meant
is the same UX call as the row above. Deduplicating by page number would make
day 1 read *pages 1, 2, 3, 21 + `portal.album`* — **stated so that nobody has
to guess what a dedupe would produce, and performed by nothing.**

---

## 3 · THE METHOD — SO NOBODY REPEATS IT

**RESCUE.md's road was not available.** It requires the page's own console on a
`file://` origin in that profile. The available browser tool prepends `https://`
unconditionally: `file:///C:/…` became `https://file:///C:/…`, landed on
`chrome-error://chromewebdata/` with `origin: null`, and localStorage access was
denied. The tab was closed.

**`npm run record:serve` cannot substitute.** It serves `http://127.0.0.1`,
which is a **different origin** and cannot see the `file://` store. That is
precisely why RESCUE.md insists on the local page, and it is worth knowing
before somebody reaches for the server as a workaround.

**What was done instead.** The sstable was parsed directly: LevelDB footer →
index block → 110 data blocks → Snappy decode → internal keys unpacked for
sequence number and record type. Both values decode to complete, well-formed
JSON, which is the read validating itself.

**READING COMPRESSED BYTES AS TEXT IS WHAT PRODUCED A WORD MIKE NEVER WROTE.**
A grep over the raw file returned `up <01><15>trunning`. `<01><15>` is not text:
it is a Snappy copy element — copy 4 bytes from 21 back, which expands to
`"and "` — and the literal that followed it was transcribed one character wrong.
The result was a phantom typo, `trunning`, reported as his and nearly preserved
under Doctrine 21, **a rule about never paraphrasing his words, applied to a
word he never typed.** OPERATIONS §8's own line covers it: *if a result
surprises you, suspect the probe before the site.* A compressed block read as
text is a probe that cannot be trusted for a verbatim string, and a verbatim
string is the only thing it was being used for.

**THE STORE COMPACTED MID-READ AND BOTH VALUES SURVIVED.** `050454.ldb` held
both values at the start of this round and **did not exist by the end of it** —
Chrome rewrote that level at 12:16 the same day. Both were re-found in
`050468.ldb`, at the same sequence numbers, byte-identical, and re-verified
after the rewrite.

**That is the durability argument, and it is not about him clearing a profile.**
The store rewrites itself on its own schedule with nobody asking, and a
compaction that drops a superseded record is the same machinery that moved these
two. A value in a browser store is not stored; it is currently present.

---

## 4 · WHAT IS STILL ONLY IN THE BROWSER

**Nothing of the two values.** Both are in this file, in full.

**Still only in Chrome's `file://` store, and not read this round:**

- `wb.record.2026-08-09` — the Record editor's working copy. Holds the
  **superseded** pre-2026-08-16 Record 001 (`INITIAL LAUNCH REPORT -
  Weird.Baby`). This is the draft guard 8 exists to refuse. **Not wanted.**
- `wb.worksheet.2026-08-07` — the retired two-column worksheet. The 2026-08-09
  measurement found every one of its answered slots already in Records 001–005
  character for character; `docs/dictation-20260807/wb-rescue-2026-08-09.json`
  is its dump on disk. **Believed fully landed; not re-verified this round.**
- `wb.shorts.2026-08-13` — the shorts bench. **Not examined.**
- `wb.probe` — a probe key. **Not examined.**
- `magnet.pile.v3` — recorded in `THREADS.md` as holding no text, two tiles,
  position and id only.

**A full sweep is one paste of RESCUE.md's snippet in that browser** and would
settle all five at once. It is a person's action, not a file scan.

---

*Read-only round. Nothing was written to either repository, no gate was run, no
flag was placed, and `workbook_to_draft.py` is untouched — the guard 8 finding
stands unfiled by decision, because filing it dirties a tree that must be clean
on Sunday.*

---
---

# APPENDIX — 2026-08-25, SECOND PASS

**Added after Mike ran RESCUE.md's snippet himself and four keys printed, not the
five this file's §4 named.** Everything below was measured this round. Both
repositories are untouched: museum `64359c1`, robots `0f3acf5`, both
`git status --short` empty. `tools/dictation/RESCUE.md` was **not edited** — it
is tracked, and the tree stays clean before Sunday.

---

## 5 · CORRECTION — THE LIVE KEY SET

**§4 of this file named five keys as "still only in the browser". Two of them
were wrong, in two different ways.**

| §4 said | what it is |
|---|---|
| `wb.probe` | **A DELETE TOMBSTONE.** Sequence **2455650** — the newest record in the entire store. There is no value. |
| `wb.shorts.2026-08-13` | **A DIFFERENT ORIGIN, AND ALSO DELETED.** It lives under `_http://127.0.0.1:8912`, not `file://`, and its newest record is a DELETE at sequence 2449315. |

**THE ROOT CAUSE, SAID ONCE: A BYTE GREP HAS NO CONCEPT OF KEY LIFETIME AND NO
CONCEPT OF ORIGIN.** It returns strings. A localStorage store is a set of
per-origin key spaces with tombstones in it, and a superseded or deleted record
sits in the file looking exactly like a live one. This is the same class as the
phantom typo in §3 — raw bytes read as though they were the thing they encode.

**The method that is correct**, and the one every statement below uses: walk
every sstable, unpack each internal key into `(user key, sequence, type)`, keep
the **highest sequence per key**, and **drop anything whose newest record is a
DELETE**.

**Read that way, the `_file://` origin holds 23 live keys, of which exactly four
are `wb.*`** — `wb.arc12.2026-08-07`, `wb.assign.week1.v1`,
`wb.record.2026-08-09`, `wb.worksheet.2026-08-07`. **That is Mike's four.**

---

## 6 · THE RESCUE.md HOLE — THE REUSABLE FINDING

`RESCUE.md` says, correctly:

> *"Run it from **any** page in `docs/dictation-20260807/`: on a `file://` page
> every local file shares one storage origin, so they all see the same store."*

**True, and it is not the whole store.** A `localStorage` snippet can only ever
see the origin of the page it runs on. Anything saved while a dictation page was
**served over http** — which is what `npm run record:serve`, `npm run mock` and
every throwaway static server produce — lands in a **different** origin that a
`file://` paste cannot reach.

### EVERY ORIGIN IN THIS STORE HOLDING A `wb.*` RECORD — ELEVEN, NOT ONE

| origin | key | seq | state | chars |
|---|---|---|---|---|
| `_file://` | `wb.arc12.2026-08-07` | 2450275 | **LIVE** | 121 |
| `_file://` | `wb.assign.week1.v1` | 2449285 | **LIVE** | 1205 |
| `_file://` | `wb.record.2026-08-09` | 2446786 | **LIVE** | 5035 |
| `_file://` | `wb.worksheet.2026-08-07` | 2443676 | **LIVE** | 4928 |
| `_file://` | `wb.probe` | 2455650 | deleted | — |
| `_http://127.0.0.1:8788` | `wb.worksheet.2026-08-07` | 2442010 | **LIVE** | **757** |
| `_http://127.0.0.1:8788` | `wb.probe` | 2442078 | deleted | — |
| `_http://127.0.0.1:8899` | `wb.record.2026-08-09` | 2446789 | **LIVE** | **5299** |
| `_http://127.0.0.1:8899` | `wb.worksheet.2026-08-07` | 2443481 | deleted | — |
| `_http://127.0.0.1:8899` | `wb.probe` | 2446783 | deleted | — |
| `_http://127.0.0.1:8904` | `wb.assign.week1.v1` | 2448931 | **LIVE** | **25** |
| `_http://127.0.0.1:8901` | `wb.assign.week1.v1` | 2448813 | deleted | — |
| `_http://127.0.0.1:8905` | `wb.assign.week1.v1` | 2448941 | deleted | — |
| `_http://127.0.0.1:8910` | `wb.assign.week1.v1` | 2449264 | deleted | — |
| `_http://127.0.0.1:8915` | `wb.assign.week1.v1` | 2449276 | deleted | — |
| `_http://127.0.0.1:8912` | `wb.shorts.2026-08-13` | 2449315 | deleted | — |
| `_http://127.0.0.1:51877` | `wb.worksheet.2026-08-07` | 2440381 | deleted | — |
| `_http://127.0.0.1:51877` | `wb.probe` | 2440379 | deleted | — |
| `_http://127.0.0.1:8792` | `wb.arc12.2026-08-07` | 2441070 | deleted | — |
| `_http://127.0.0.1:8792` | `wb.worksheet.2026-08-07` | 2441076 | deleted | — |
| `_http://127.0.0.1:8792` | `wb.probe` | 2441075 | deleted | — |

**THREE LIVE `wb.*` VALUES SIT OUTSIDE `file://` AND MIKE'S PASTE DID NOT SEE
ANY OF THEM.** The port numbers are ephemeral — a static server takes a free one
— so the ten localhost origins are ten past sittings, not ten tools.

### WHAT A COMPLETE SWEEP ACTUALLY TAKES

**One paste settles one origin.** It does not settle the store, and a person who
runs it once and stops will believe otherwise, because it prints a confident
count of keys.

A complete sweep is one of two things:

1. **A paste per origin.** For each origin, the page must be *open at that
   origin* — which for a dead localhost port means starting a server on **that
   exact port** again. The ports are recorded nowhere, so this is only practical
   for origins somebody can still name.
2. **Read the store offline, which is what this round did.** Walk
   `…\Chrome\User Data\<profile>\Local Storage\leveldb`, parse the sstables,
   resolve newest-record-per-key, drop tombstones, and group by origin. It sees
   **every** origin at once and is the only method that can answer *"is that all
   of it?"*

**AND IT IS PER PROFILE AND PER BROWSER.** `RESCUE.md` already says *"Do it once
for every browser or machine you have written in"*, and that instruction stands
unchanged — this finding sits underneath it, not instead of it. Edge's store was
checked this round and holds no `wb.*` record at all.

**RESCUE.md IS NOT EDITED.** It is a tracked file and the tree must be clean for
Sunday. This section is where the finding lives until the tree reopens.

### ONE THING THE SWEEP TURNED UP, RECORDED UNATTRIBUTED

The live worksheet at `_http://127.0.0.1:8788` (757 chars) carries **week-two
slots** that the `file://` copy does not:

```
W2.D5.HEAD  Four o'clock, and it is on the porch.
W2.D5.LINE  A box arrives unlabelled at four o'clock, and nobody saw it delivered.
W2.D5.EXEC  WHAT ARRIVED
            A box on the porch at four, with no label and no delivery record.
```

**`W2.D5.HEAD` is byte-identical to Ops' own `headline` for week two day five in
`reveal/week-two.mjs`.** The other two are in neither repository. **Whose they
are is not established** — the form carries Ops' left column, so a slot holding
Ops' sentence may be a prefill rather than an answer. **Doctrine 12: recorded as
found, attributed to nobody.** Mike's actual verbatim beat for that day is
`Friday 4pm: a box on the porch with no shipping label`, which is already carried
in `week-two.mjs` and in `docs/OPEN_ACTIONS.md`.

---

## 7 · RECORD 013 — RULED: IT NEEDS NOTHING

**013 IS ALREADY WHOLE IN GIT AND IS RECOVERABLE IN FULL FROM `8e67b5b^`.** It
was deleted deliberately by `8e67b5b` — *"Channel 4 arrives, 013 and nine
photographs go, and the export refuses"*, **2026-08-12 11:52:35 -0400**.
**Nothing about it is a rescue and nothing about it is owed.**

### The four section bodies, as they stood in the tree

| label | body |
|---|---|
| The bag | *"A sealed bag, modern, holding one USB-C adapter. It was packed differently from everything else that arrived with it."* |
| A conversation about the battery | *"The cell was discussed before anything was connected: whether it is deep-discharged rather than dead, and whether to hack it. It was not hacked. The unit is charging from the adapter that came in the bag."* |
| It came on, briefly | *"The unit powered on for a short time before the adapter was used."* |
| On charge | *"The charge is slow."* |

### WHOSE IS WHOSE

**HIS — the four facts**, listed in `docs/RECORD_013_QUESTIONS-20260804.md` as
*"the four facts you supplied, and the whole of what the page prints"*: the
sealed modern bag holding a USB-C adapter packed differently from everything
else · a conversation about deep-discharge and why it wasn't hacked · a brief
power-on before the adapter · a slow charge. **And the headline** *"The one thing
that wasn't packed like the rest"* — changed from *"packed in newspaper"* only
because the newspaper was invented, not because the phrasing was wrong
(question `G4`).

**OPS' — the four section labels and the four bodies as written.**
`docs/MUSEUM_HONEST_RECORD_LOG-20260804.md` records that two labels were renamed
by Ops that round: *"A conversation about batteries"* lost its plural, and
*"Charge status"* became *"On charge"*.

### THE BROWSER COPY IS A FIXED BUG'S ARTIFACT AND MUST NOT BE TREATED AS A SOURCE

`wb.record.2026-08-09` shows entry 13 with `line`, `lead`, `tomb`, `still` and
`stillCaption` written and **four section labels with empty bodies**. That is not
an outline he never filled and it is not a body that landed elsewhere. **It is
data loss, and the loss is already found, documented and fixed** —
`reveal/record-entries.mjs`, the block at lines 120–141:

> **MIKE: the editor showed Record 013 as four headings with nothing under them,
> and said nothing. FOUR PARAGRAPHS, ON THE SURFACE HE WRITES ON, GONE.**
>
> `draftEntries` read a body only when the AST node was an `ArrayExpression` and
> fell to `[]` for anything else — and 013's four bodies are written as plain
> concatenated strings, which is a shape the RENDERER has always accepted…
> **A renderer that accepts two shapes and a reader that accepts one is a
> data-loss machine with no error in it.**

**THE TIMING IS THE PROOF.** The fix landed in `deca773`, **2026-08-11 20:24:22
-0400**. The draft in the browser is stamped `saved: 2026-08-12T01:57:03.882Z` —
**2026-08-11 21:57 EDT, ninety-three minutes after the fix commit.** So the page
that wrote it was still running the pre-fix preview bundle, which is
`record-edit.mjs`'s own M1 hazard: *"`npm run record` wrote a fresh page around a
stale bundle."*

**A LATER ROUND MUST NOT READ THAT DRAFT AS EVIDENCE ABOUT 013**, and must not
"restore" four empty sections from it. The tree at `8e67b5b^` is the truth.

### WHAT IS IN THE WORKING TREE TODAY, AND WHAT IS ONLY IN GIT

**In tracked files today:** the headline (`RECORD_013_QUESTIONS-20260804.md`) ·
`stillCaption` *"The back of the unit."* (`STATE.md` and two logs) · all four
labels (`MUSEUM_HONEST_RECORD_LOG-20260804.md`) · the body *"The charge is
slow."* (`MUSEUM_RECORD_MACHINERY_LOG-20260805.md`) · the still's path
(seventeen museum files).

**Only in git history:** the `line`, the `lead`, and three of the four bodies.

---

## 8 · THE WORKSHEET — "BELIEVED FULLY LANDED" DOES NOT HOLD

### The three-copy measurement

| copy | stamp | slots | `W1.D1.NOTES` |
|---|---|---|---|
| `docs/dictation-20260807/answers.json` | saved `2026-08-09T15:46:39.274Z` | 14 | **1,708 chars** |
| `docs/dictation-20260807/wb-rescue-2026-08-09.json` | rescued `2026-08-09T14:21:48.435Z` | 14 | **1,708 chars — byte-identical to answers.json** |
| **the browser, `_file://`, today** | — | **15** | **2,288 chars** |

**Thirteen of fourteen content slots hold. One does not.** The delta is **580
characters** in `W1.D1.NOTES`. The fifteenth slot is
`REC.EPOCH: "2026-08-17"` — a mechanism value, superseded by `2026-08-31`, worth
nothing.

**On disk the line still reads his placeholder:**

```
we were able to read a few snippets of ASCII, including:
Robot, portal, ??, ??  (Claude - Get me some examples from the manual, etc)
```

**In the browser that placeholder is gone**, replaced by a brace block holding
two things by two different authors.

`tools/dictation/record-edit.mjs` predicted this and drew the wrong conclusion
from a true measurement:

> *"the two copies on disk (`answers.json` and the 2026-08-09 rescue dump) are
> byte-identical to each other and to what was landed, so nothing on disk records
> an edit since the landing."*

Both halves are true. **The inference — that there was therefore no edit — does
not follow, and there is one.**

### WHOSE IS WHOSE, AND THIS IS THE PART THAT MUST NOT BE READ WRONG LATER

**THE TWENTY WORDS ARE OPS' AND ARE NOT A RESCUE.**

```
PORTAL, FEED, LATCH, ARM, BOOT, POST, BIST, SEG, CHECKSUM, ACK, SYN,
AUX LINK, MEM TEST, VIDEO, NOMINAL, LISTENING, ERROR, READY, STANDBY, SANDBOX
```

`docs/MUSEUM_RECORD_LANDING_LOG-20260809.md` §*"OPS' THREE ANSWERS"* carries the
list as **Ops' answer** to Mike's own ask, derived *"from the firmware and the
twin's own screens"*. It landed in that log and in
`MUSEUM_RECORD_EDITOR_LOG-20260809.md`. **It is not on the glass** — no
occurrence in `src/data/artists/robots-record.js` — which is consistent with his
later ruling striking the arrangement: *"that was Ops answering in the wrong
place."*

**A LATER ROUND MUST NOT FILE THAT LIST AS HIS.** It sits inside his braces
because Ops answered there; the braces are his and the words between them are
not.

**WHAT IS RESCUED IS HIS DIRECTION AROUND THE LIST — 580 CHARACTERS, GONE FROM
DISK.** Verbatim, opening brace and all:

```
{CLAUDE display a histogram from the data.
```

and, after the list:

```
Histogram maybe overkill. Maybe a Venn diagram (I know showing what??! You'll
either find a way easily, or if not, make one up!) Or into categories depending
on frequency, or word interest). We want people to peruse the list, most of it
is meh, but there a a few foretelling gems in there that already start to
define the story in a way the user can appreciate.}
```

**CARRIED EXACTLY AS TYPED, AND TWO THINGS ARE FLAGGED RATHER THAN FIXED
(Doctrine 21):** `there a a few` doubles the article, and `word interest)` closes
a parenthesis that was never opened. **Both are his. A round that tidies either
has broken the instruction that put them here.**

Zero occurrences in either repository of `display a histogram from the data`,
`Histogram maybe overkill`, `Venn diagram`, `foretelling gems`, or
`most of it is meh`.

**WHAT IT IS, PLAINLY:** a direction for how a list of machine words should meet
a reader — not a histogram, probably not a Venn, possibly grouped by frequency or
by interest, and built so a visitor will *peruse* it and find the few lines that
foretell the story. That is a call about what a visitor sees, which is his by
§0, and it has never been on any surface Ops can read.

---

## 9 · ARC.W4 — THE WINDOW IS SIXTEEN DAYS

`docs/dictation-20260807/wb-rescue-2026-08-09.json` is tracked, in the
repository, and **already contains an `wb.arc12.2026-08-07` capture**. It reads:

```json
{"ARC.W1":"THE WEEKEND THAT WASN'T SUPPOSED TO HAPPEN"}
```

**One slot. `ARC.W4` is not in it.** The browser holds both today.

**So `ARC.W4` was typed after `2026-08-09T14:21:48Z` and has never been
rescued — sixteen days, and one Chrome compaction on 2026-08-25 alone.**

---

## 10 · OPEN, AND UNEXAMINED

**`wb.shorts.2026-08-13` — NOT AN OPEN READ. THERE IS NOTHING TO READ.** §4 of
this file listed it as unexamined, which left it looking like pending work. Its
newest record anywhere in the store is a **DELETE at sequence 2449315**, under
`_http://127.0.0.1:8912`. No origin holds a live value for it. **The shorts bench
state is gone, and no sweep will bring it back.** Whether it mattered is not
established and cannot now be established from this store.

**`magnet.pile.v3` — UNEXAMINED, AND FLAGGED BECAUSE A CLAIM MAY BE STALE.** It
is **live in the `file://` origin at 41,905 characters**. `docs/THREADS.md`
states the magnet pile *"holds no text at all — two tiles, both position-and-id
only."* Both can be true — 42KB of coordinates is possible — but that claim came
out of a search, not a measurement, and nobody has looked since. **Not opened
this round, on Ops' ruling. Recorded so it is not rediscovered as a surprise.**

**The other three live `wb.*` values outside `file://`** (§6) are read but not
reconciled: the `:8899` Record draft (5,299 chars), the `:8788` worksheet (757
chars), and the `:8904` assign state (25 chars, a single first press, superseded
by the `file://` value already in §2).

---

*Second pass, read-only. Nothing entered either repository, no gate was run, no
flag was placed, `RESCUE.md` and `workbook_to_draft.py` are both untouched, and
the guard 8 finding still stands unfiled by decision.*
