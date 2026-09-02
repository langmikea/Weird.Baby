# JOB 3 — THE NUMBERS GATE
2026-08-13 · WRITE · gates green.

---

## WHAT YOU NEED FROM ME

**Nothing. It is built, wired and proved.**

One thing worth knowing: **on its first honest run it found a seventh stale
number** that this morning's hand sweep missed — the ledger's `when` field
published as null on **152** rows against a real **166**. Fixed. That is the
gate paying for itself before it was finished.

`npm run docs:numbers` any time. `npm run docs:numbers:gate` is in the seal
ritual now.

---

# 3a — WHAT IT DOES

`tools/numbers-gate.mjs` → `npm run docs:numbers` / `docs:numbers:gate`.

It **measures** the thing each published number counts, greps the governing
documents for the claim, and refuses on a mismatch — naming the document, the
line, and both values.

## What it measures

| value | measured from |
|---|---|
| lint errors / warnings | `npx eslint . -f json`, summed |
| asset-table rows (and missing, and bucketed) | `provenance/asset-table.json` |
| reveal ledger rows | `reveal/ledger.json` |
| register rows | `provenance/register.json` |
| manual pages | a count of `page-NN.png` on disk |
| Record entries | `reveal/record-entries.mjs` — the museum's own reader |

Tonight: **lint 9/8 · asset table 385 (13 missing, 0 bucketed) · ledger 166 ·
register 1,979 · manual 61 · Record 5.**

## What it checks

Seven published claims across `CLAUDE.md` and `docs/canonical/OPERATIONS.md`:
the lint baseline in two phrasings, the asset table's row count in two
phrasings, the ledger's row count, the ledger's all-null `when` claim, and the
manual's page count.

A check is a `find` regex, a `near` phrase that must be on the same line, and a
`measured` function. Adding one is four lines.

---

# 3b — HOW HISTORY IS TOLD FROM A TRIPWIRE

> **A published STANDING VALUE is a tripwire and must be current.
> A RECORDED MEASUREMENT in a round log is history and must never be rewritten.**

`STATE.md` carries `lint 11 err / 9 warn` **fourteen times** and every one must
stay: they record what the gates read *on the day that round sealed*. A
find-and-replace across this repository would falsify the record that makes the
tripwire legible in the first place.

**Two mechanisms, both structural — nothing guesses at prose.**

### 1. SCOPE — a document declares where its history starts

| document | rule |
|---|---|
| `STATE.md` | **excluded whole** — it is a round log almost end to end |
| `CLAUDE.md` | read down to `## Recent session log` (line 762); everything below is history |
| `OPERATIONS.md` | read whole — it has no round log |

### 2. SHAPE — a claim only counts where it is stated as a present fact

Each check carries a `near` phrase that must appear on the same line. So
`lint 11 err / 9 warn = HEAD baseline, zero new` inside a sealed round entry
cannot match a check anchored on the word "baseline" in a gates list.

### And a third the gate needed and I did not anticipate: a correction is not a claim

When a stale number is fixed, the fix carries a note saying what it used to be —
`**166 rows** (measured 2026-08-13; the row said 152)` — so a later reader can
see it was checked rather than guessed. **That parenthetical contains the old
number, on the same line as the new one, and the gate's first run failed on it.**

Deleting those notes to satisfy the gate would be the tail wagging the dog. So
the gate **blanks** them before scanning: `(measured …)`, `the row said N`,
`was N / N`. Blanked rather than removed, so every line number stays true.

**Anything the gate cannot classify is reported and not failed on.** A gate that
cries wolf about history gets switched off, and then it is not a gate.

---

# 3c — WHERE IT IS WIRED

**`docs/canonical/OPERATIONS.md` §9 step 0**, the seal ritual, at the end of the
gate chain and before the lap:

```
lint → build → provenance:gate → reveal:check → parity:gate → instory:gate
    → docs:numbers:gate → the lap
```

**It runs on EVERY packet, not conditionally**, for the same reason Doctrine
18's gate does: a number goes stale when somebody changes the thing it counts,
and *"did I change something a document publishes a count of"* is exactly the
question a session answers wrongly.

`package.json`: `docs:numbers` (report) and `docs:numbers:gate` (exit 1).

---

# 3d — PROVED BY BREAKING IT

Seven bends. Each edit made, gate run, edit reverted, **reversion proved by
sha256**.

```
=== BASELINE ===                                          gate exit 0

1. LINT BASELINE, OPERATIONS.md §9   9/8 -> 11/9     exit 1 REFUSED  correct
      named: docs/canonical/OPERATIONS.md:1875
2. LINT BASELINE, CLAUDE.md          9/8 -> 4/6      exit 1 REFUSED  correct
      named: CLAUDE.md:164
3. LEDGER ROW COUNT, OPERATIONS.md   166 -> 152      exit 1 REFUSED  correct
      named: docs/canonical/OPERATIONS.md:1051
4. ASSET ROW COUNT, OPERATIONS.md    385 -> 315      exit 1 REFUSED  correct
      named: docs/canonical/OPERATIONS.md:498
5. MANUAL PAGE COUNT                 (no such claim in either document — skipped)

6. CONTROL — a ROUND LOG reading in STATE.md
      11 err / 9 warn -> 77 err / 77 warn            exit 0 passed   correct
7. CONTROL — a reading in CLAUDE.md's Recent session log
      lint 11/9 -> lint 88/88                        exit 0 passed   correct

=== RESTORED === all three files sha256-identical; gate exit 0
```

**The two controls are the half that matters.** A gate that catches stale
numbers by also rewriting history is worse than no gate; bends 6 and 7 put
absurd values into round logs and the gate stayed silent, which is the
behaviour §3b requires.

## The break test found three defects in the gate itself

**1. Every regex was a document-wide wildcard.** They use `\s*` between parts,
and `\s` matches a newline — so run against the whole file, `null on all …rows`
matched the words "null on all" on one line and "152 rows" several lines below,
**inventing a claim nobody wrote**, while the real claims went unchecked because
`near` was tested against whichever line the match happened to start on. **Only
one of five bends was caught.** The scan walks lines now — each probe is a line
plus the one after it, because a published value legitimately wraps.

**2. One bracket cost a whole check.** `CLAUDE.md` writes `baseline (**9 errors`
and `OPERATIONS.md` writes `baseline **9 errors`. The pattern allowed `*` and
whitespace but not `(`, so **the CLAUDE.md lint claim matched nothing at all**
until bend 2 said so.

**3. "null on all N rows" is said about two different tables** — the asset
table's `bucket` (385) and the ledger's `when` (166). A single check reported
the ledger's claim as the asset table's: right that it was stale, **wrong about
what it counted**, which is the kind of finding that gets a gate distrusted. The
subject is part of the match now.

---

# THE SEVENTH STALE NUMBER

`docs/canonical/OPERATIONS.md:1051`:

> **`when` is STILL null on all ~~152~~ **166** rows**

The reveal ledger's `when` field. The claim is still true — no row carries a
story date, by Doctrine 12 — but the **count** was 14 rows behind.

**This morning's hand sweep did not find it**, because it read for the phrase
"ledger rows" and this one says "null on all N rows" about the ledger's `when`.
The gate found it in a second, on its first honest run, which is the argument for
the gate in one line.

---

## WHAT I COULD NOT DETERMINE

- **Whether `docs/canonical/`'s other nine documents publish standing values.**
  The gate reads the three governing documents this packet named. The specs
  (`UX_SPEC_v0.3.md`, `VISION_LOCK_v0.3.md` and seven more, ~228 KB) are not
  swept. Adding them is a line in `DOCS`, but somebody has to rule which of them
  are *live* and where their history starts — the same two questions §3b asks,
  and I could not answer them from the files alone.
- **Whether `CLAUDE.md`'s history boundary is safe long-term.** It is the
  `## Recent session log` heading. If a future round renames that heading the
  gate silently starts reading round logs as claims. It would then fail loudly
  rather than pass wrongly, which is the right direction, but it is a coupling
  worth knowing.
- **How many claims exist that no check covers.** The gate reports 7 checked; it
  cannot report what it does not have a pattern for. Every stale number found so
  far has produced a check, but absence of a finding is not proof of coverage —
  which is what the break test is for and why it should be re-run whenever a
  check is added.

## WHAT NEEDS MIKE

**Nothing.** One thing to rule on when convenient:

- **Should the gate sweep `docs/canonical/`'s specs too?** It would need a
  history boundary declared per document. Say the word and it is a small packet.
