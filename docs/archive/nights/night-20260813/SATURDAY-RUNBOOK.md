# SATURDAY RUNBOOK — WORKBOOK TO DEPLOYED RECORD

**This was rehearsed end to end on 2026-08-13 with dummy text and reverted.**
Every command below was actually run. The timings are measured, not estimated.

**Total: about 12 minutes**, of which ~1 minute is the machine. The rest is you
reading output and making one decision per new Record.

---

## BEFORE YOU START

- [ ] Mike says the workbook is ready.
- [ ] `git status --short` is clean. **If it is not, stop** — the landing
      rewrites `robots-record.js` and you want a clean revert if anything turns.
- [ ] `npm run record:proof` — 20 s. Proves the lander still carries his
      reasoning and all eight guards hold. **If this fails, do not land.**

---

## STEP 1 — THE WORKBOOK BECOMES A DRAFT · 1 s

```
python tools/dictation/workbook_to_draft.py "C:\AI\_night-20260811\RECORD_days-2-to-6.xlsx"
```

Writes `docs/dictation-20260807/record-draft.json`.

**Read the output.** It prints one line per record: how many sections, how many
paragraphs, and whether a headline and deck are present. A record Mike thinks he
wrote that shows `NO HEADLINE` is the cheapest possible place to catch it.

It also prints **`carried from the tree`** — records the workbook does not cover.
The workbook is *days 2 to 6*; **Record 001 is not in it**, so 001 is carried
from the tree unchanged. That is correct and expected.

> **If it says the workbook is not the shape it knows, STOP.** It refuses rather
> than reading the wrong cell into the wrong field. Somebody has moved a row.

## STEP 2 — LAND IT · 3 s

```
npm run record:land -- --write
```

**Read the diff it prints before it writes.** It names every record that changes
and how. Then it reports:

```
  carried through untouched: 001 002 003 004
  regenerated: 005
  new: 006
  comment characters: 10124 before, 10124 after
```

**The comment-character line is the one that matters.** Before and after must be
equal. They will be — but that is the number that says his reasoning survived.

### The three refusals you may meet, and what each means

| it says | what happened | what to do |
|---|---|---|
| `does not carry record(s) N` | the draft dropped a record the tree has | Step 1's merge failed. Re-run step 1 and read its output. |
| `an entry whose text CHANGED carries comment blocks` | Mike edited the words of Record 001 or 003 | **This is a hand edit.** Those two carry standing reasoning. Either splice by hand or move the comment blocks above the entry first. **Do not force it.** |
| `this draft is OLDER than the Record` | the tree moved after the draft was written | Re-run step 1. |
| `N note(s) to Ops are still in this draft` | Mike left `{curly braces}` in his text | Act on each one, take it out of the workbook, re-run step 1. |

## STEP 3 — DECLARE THE TRANSFER CLASS · 2 min · **THE ONE DECISION**

```
npm run reveal:build
```

For each NEW record it will say:

```
THE DECLARATION IS INVALID — 1 fault(s):
  record.006: no transfer class and no exemption.
```

**Add each new record to `reveal/transfers.mjs`.** For a status-day Record the
class is `BLAST` on Records 002–005's own reading — their subject is the same
week-0 event — but **read the entry before you assume it.** A Record that
describes a physical delivery is a `PACKAGE`.

The list is around line 223:

```js
  "doc.manual", "doc.record", "record.001", ... "record.005", "record.006",
```

**Write a one-line reason above it.** Then `npm run reveal:build` again; it
should exit 0.

> This is the only judgement in the whole path. It cannot be automated because
> it is a statement about how the material reached the house.

## STEP 4 — DECLARE HIS STRINGS · 1 s

```
npm run record:declare -- --source "Mike's dictation, RECORD_days-2-to-6.xlsx, 2026-08-16"
```

**Quote the source.** It is written verbatim into every row.

Five Records is about sixty register rows, all class `MIKE`. This fills exactly
the ones in `robots-record.js` and **refuses to touch anything else** — if it
reports strings outside the Record are still undeclared, those are a surprise
and somebody has to say where they came from.

## STEP 5 — THE GATES · 50 s

```
npm run provenance:gate      0.7 s
npm run reveal:check         1.0 s
npm run parity:gate          0.5 s
npm run instory:gate         0.5 s
npm run docs:numbers:gate     33 s   <- the slow one, be patient
npm run lint                   6 s
npm run build                  4 s
npm run build:launch           4 s
npm run approval:proof         7 s
```

> **`npm run lint` ALWAYS exits 1.** The baseline is **9 errors / 8 warnings**
> and a non-zero exit is normal. **Read the count, not the exit code.** Anything
> other than 9/8 is yours to explain.

## STEP 6 — LOOK AT IT

```
npm run dev     (or open the built site)
```

Walk `/robots/record`. **The approval mark is dev-only** — a page Mike has
signed carries the house mark top-right, and landing new Records will have
dropped `/robots` and `/robots/record`, because their words changed. That is the
mechanism working.

## STEP 7 — HAND THE COMMIT TO MIKE

Ops does not commit. Write the commit command out and give it to him.

---

# WHAT SATURDAY WILL ACTUALLY COST

| step | machine | human |
|---|---:|---|
| 1 workbook → draft | 1 s | read 6 lines |
| 2 land | 3 s | read the diff |
| 3 transfer class | 1 s | **~2 min per new record — the decision** |
| 4 declare strings | 1 s | type the source once |
| 5 gates | 50 s | wait; read the lint count |
| 6 look | — | 5 min walking pages |
| 7 commit text | — | 1 min |

**Machine time: about 60 seconds. Honest total: 12 minutes for five Records**,
if nothing surprises you. Budget 30 if something does.

---

# THE THINGS THAT BROKE IN REHEARSAL

All four are fixed. They are listed so that if one recurs you recognise it.

1. **Record 001 was dropped** — the workbook covers days 2–6 and 001 predates
   it. Guard 3 refused. *Fixed: the reader now overlays the workbook onto the
   tree.*
2. **Every em dash became `â€”`** — the reader decoded node's UTF-8 output using
   the Windows codepage. Record 001 came back mojibake and read as CHANGED.
   *Fixed: `encoding="utf-8"`.* **Had it not carried comments, it would have
   landed the corruption silently.**
3. **`reveal:build` refused the new record** — no transfer class. *Not a bug;
   it is step 3 and it is a real decision.*
4. **12 undeclared strings** per landed record. *Fixed: `record:declare`.*

---

# IF IT GOES WRONG

```
git checkout -- src/data/artists/robots-record.js reveal/transfers.mjs `
                provenance/register.json reveal/ledger.json
```

That returns the tree to HEAD. Nothing in this path touches anything else, and
**every refusal above leaves the file untouched** — the lander writes only after
all eight guards pass, and restores the original if the written file fails its
own round-trip check.
