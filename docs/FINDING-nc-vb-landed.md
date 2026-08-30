# FINDING — N-c and V-B landed, and the fifth cut

**Round:** N-c, V-B, and the fifth cut. **Written:** 2026-08-30.
**Scope:** the fifth §8 cut, two register rows, one published count re-measured,
and this report. **Neither citation was edited. The earlier four archives were
not touched.** Nothing that publishes was changed.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.
**Follows:** [`FINDING-ch-ids-landed.md`](FINDING-ch-ids-landed.md) §5.

**Method notation.** **READ** — the tree states it, at a named file and line.
**RUN** — a command was executed and this is its output.

> **THE THREAD ENDS.** With the corrected sweep — one that counts a bolded row
> without an anchor as a row, which is what made `M40` a false positive last
> round — **every id cited as a register row in `src/`, `tools/`, `reveal/` or
> `docs/canon/` now resolves to a real row.** §4.
>
> **AND THE FIFTH CUT IS THE LAST ONE OF ITS KIND.** It recovered 263 bytes,
> naming it cost 165 back, and the net is **98**. §0.

---

## 0 · THE FIFTH CUT — TAKEN, AND IT BOUGHT ALMOST NOTHING

**`docs/canonical/OPERATIONS_ARCHIVE/08-KNOWN-HAZARDS-V.md`, cut at HEAD
`3602915`**, named in §8's pointer block beside the other four. The earlier four
archives were not opened.

| step | bytes | of ceiling |
|---|---:|---:|
| `OPERATIONS.md` before | **38,684** | 96.7% |
| after moving the bodied entry | 38,421 | 96.1% |
| after naming the fifth archive in the pointer block | **38,586** | **96.5%** |
| **net recovered** | **98** | |

RUN, `npm run ops:size`, PASS at every step. **Headroom went from 1,316 bytes to
1,414 — about half a lead line at this round's rate.**

### 0.1 · Why it bought so little, measured

**There was exactly one bodied entry left to take.** RUN, §8 broken down:

```
section 8 total                 11,494 bytes
  the one bodied entry             389        <- all a fifth cut could take
  ten heading-only stubs         1,038        <- bodies already in archives I-IV
  42 lead lines                  7,253        avg 172, against §8's own quoted 102
```

The fourth cut moved **seven** bodied entries and **6,050 bytes**. It named what
was left — *"the one bodied entry left is 2026-08-29's"* — and it was right.
**§8's mass is no longer in bodies. It is in lead lines**, and this round's own
filings are part of why: 308 bytes last round, 373 the round before, against the
102 the pointer block quotes as the going rate.

**A SIXTH CUT OF BODIED ENTRIES HAS NOTHING TO TAKE.** That is recorded in the
fifth archive itself and in one sentence of the pointer block, so whoever meets
the ceiling next does not rediscover it there.

### 0.2 · A mistake made and corrected inside this step, because it is the point

My first pointer-block edit explained all of the above **in the pointer block**
— 621 bytes of analysis into the file the cut had just freed 263 bytes from.
Net effect measured at **−358 bytes: the file was bigger after the cut than
before it.**

It was rewritten to three lines naming the archive and the finding, with the
arithmetic left in the archive where it belongs. **The failure mode the ceiling
exists to catch is writing the explanation into the ground state**, and it
caught me one step after I had measured it.

---

## 1 · THE TWO ROWS

Filed in `docs/OPEN_ACTIONS.md` after [`CH6-c`](OPEN_ACTIONS.md#ch6-c). Same
shape as the six: **ids kept**, **raised at the date each was minted**, status
measured from the tree.

| id | raised | status, measured | owner | citations |
|---|---|---|---|---:|
| [`N-c`](OPEN_ACTIONS.md#n-c) | **2026-08-17** | **RECORDED** | Mike | 1 |
| [`V-B`](OPEN_ACTIONS.md#v-b) | **2026-08-06** | **OPEN** | Mike | 1 |

### 1.1 · `N-c` — RECORDED, because the citation asked for a record and not a fix

`src/data/artists/robots-units.js:313`, READ:

> *"it is the third face in this wing left without one deliberately (M29, M48
> are the others) and **it is register row `N-c` rather than a silence**."*

**The citation exists precisely to stop this being a silence — and the row it
named did not exist, so it was a silence, for thirteen days.**

**Measured 2026-08-30:** the two peers it names are real — `M29` and `M48` are
both in the register (RUN). This id has never been in either register in any
commit (RUN, `git log -S "N-c" --all` over both files: 0 commits). **The
citation was right about everything except itself.**

Status is **RECORDED**, not OPEN: the face is deliberately without a picture on
Mike's instruction, so there is nothing to do. The row is the record.
`RECORDED` is the register's own existing status word, not a new one.

### 1.2 · `V-B` — OPEN, and it has waited twenty-four days

`src/data/artists/worth-a-listen.js:1666`, READ:

> *"Both are **register row `V-B`**: re-home the song copy, or strike it. Until
> he rules, nothing in `src/` prints it."*

**Measured 2026-08-30, and the claim holds exactly:**

- `aboutSongsTrack` survives only as two comments — `:1658` and `:1887`
  (*"`aboutSongsTrack(a)` was here"*). The builder is gone, not left uncalled.
- **Nothing in `src/` prints `card.label`** — RUN, zero hits.
- The data still carries **28** `label:` paragraphs.

So twenty-eight authored paragraphs sit in the tree, rendered by nothing, on a
decision that was correctly deferred to Mike and filed nowhere he would see it.
**Minted 2026-08-06 in `551f2b7`; this is day twenty-four.**

**The disagreement question does not arise for either.** Each has a single
citation, so there is nothing for two citations to disagree about — stated
rather than left as an empty section.

---

## 2 · NEITHER CITATION WAS EDITED

Both still read *"register row"* about rows that, until this commit, did not
exist. They are dated text. What changed is the other end.

---

## 3 · THE PUBLISHED COUNTS

`docs/BACKLOG.md:311-312` — RUN, counted off the register's own rows:

| | before | after |
|---|---:|---:|
| rows | 170 | **172** |
| OPEN | 163 | **164** |
| owned by Mike | 132 | **134** |

`V-B` is `OPEN`; `N-c` is `RECORDED`, so OPEN moves by one and rows by two. Both
are owned by `Mike` exactly, so the Mike count moves by two.

**RUN — no other register count moves.** A sweep for published row counts
returns only those two `BACKLOG.md` lines.

---

## 4 · DOES THE THREAD END? — **YES**

**The sweep was rebuilt first, because last round's version produced `M40`.**
That false positive came from matching only `<a id="…">` anchors: the closed
register anchors 45 of its rows and records the rest as bolded names. **The
corrected sweep counts a bolded `**M40**` row as a row**, in both files.

RUN:

```
register knows 351 ids  (anchored OR bolded, both files)
ids cited as a row in src/ tools/ reveal/ docs/canon/:  22

STILL UNRESOLVED:
  Casino  MAY  Mike  ROLLBACK  SAYS  THERE  WILL
```

**All seven are my own regex catching ordinary prose after the word "row", and
each was read to confirm it** — RUN:

| token | the line it came from |
|---|---|
| `Casino` | *"a four-**row Casino** behind code 212"* |
| `MAY` | *"An exempt **row MAY** NOT BE REVEALED"* |
| `Mike` | *"has to draw the same **row Mike** will"* |
| `ROLLBACK` | `throw ROLLBACK;` — not the word *row* at all |
| `SAYS` | *"and the **row SAYS** SO"* |
| `THERE` | *"created by adding a **row THERE**"* |
| `WILL` | *"says what a **row WILL** be"* |

**No id remains.** Every id cited as a register row in live source or canon
resolves to a row in `OPEN_ACTIONS.md` or `OPEN_ACTIONS_CLOSED.md`. **The thread
that started at one dangling `CH5-a` ends at eight rows filed and zero left.**

**What this does NOT claim:** the sweep reads `src/`, `tools/`, `reveal/` and
`docs/canon/` — the four the packet named. Dated round logs were not swept, and
they are where the class was born; a `## OPEN` list in a 2026-08-12 log can still
name an id nobody carried. §8's new lead line is the guard against that shape
recurring, and it is a rule rather than a check.

---

## 5 · THE §9 GATES

| # | gate | exit | note |
|---:|---|---:|---|
| 1 | `npm run lint` | 1 | **9 errors / 7 warnings — baseline, zero new** |
| 2 | `npm run build` | **0** | |
| 3 | `npm run provenance:gate` | **0** | |
| 4 | `npm run reveal:check` | **0** | CHECK: PASS |
| 5 | `npm run parity:gate` | **0** | |
| 6 | `npm run instory:gate` | **0** | |
| 7 | `npm run docs:numbers:gate` | **0** | it reads both files this round moved |
| 8 | `npm run shellstop:gate` | **0** | |
| 9 | `npm run ops:size` | **0** | 38,586 / 40,000 · 96.5% |

**`day:proof`: 1 of 49, exit 1 — as expected, same residual.** RUN:
`Record 005 REFUSED by guard 6 — it carries standing reasoning`. This packet
touches no file it reads.

---

## 6 · EVERY COMMAND RUN

```
python  … §8 measured: section total, the one bodied entry, the ten stubs, the 42 lead lines
python  … the fifth cut: archive written at HEAD 3602915, body removed, heading left
python  … pointer block: five archives named; first draft 621 bytes, rewritten to 165
python  … the two rows filed; register recounted
python  … BACKLOG.md 170/163/132 -> 172/164/134
python  … the corrected sweep: 351 known ids vs 22 cited, both files, anchored OR bolded
git log --oneline -S "N-c" --all -- docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md   -> 0
git log --oneline -S "V-B" --all -- docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md   -> 0
git log -1 --date=short 3f60d77   (N-c minted 2026-08-17)  ·  551f2b7  (V-B minted 2026-08-06)
grep -rn "aboutSongsTrack" src/   ·   card.label print sites in src/   ·   28 label: in the data
npm run ops:size  (four times)
npm run lint build provenance:gate reveal:check parity:gate instory:gate docs:numbers:gate shellstop:gate day:proof
```

Everything else is READ, at the file and line named beside it.
