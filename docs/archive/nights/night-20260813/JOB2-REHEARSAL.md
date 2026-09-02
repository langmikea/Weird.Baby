# JOB 2 — SATURDAY, REHEARSED END TO END
2026-08-13 · WRITE then revert · tree confirmed byte-identical to HEAD.

**The runbook is `C:\AI\_night-20260813\SATURDAY-RUNBOOK.md`.**

---

## WHAT YOU NEED FROM ME

**Nothing. The path runs.** It broke in four places and all four are fixed.

**Two you should know about:**

1. **The workbook does not contain Record 001** — it is *days 2 to 6* and 001
   predates it. A draft built from the workbook alone drops 001 and the landing
   is refused. Fixed: the reader now overlays the workbook onto the tree.
2. **Every em dash in the volume was being corrupted to `â€”`.** My reader
   decoded node's UTF-8 output using the Windows codepage. Record 001's deck came
   back mojibake. **Had that record not carried comment blocks, the landing would
   have written the corruption into the tree silently.** Fixed.

**One thing stays a human decision every Saturday:** each new Record needs a
transfer class in `reveal/transfers.mjs`. It cannot be automated — it is a
statement about how the material reached the house.

---

# 2a — THE DUMMY TEXT

A **copy** of the workbook: `C:\AI\_night-20260813\REHEARSAL-workbook.xlsx`.
**Mike's own file was not opened for writing at any point.**

Dummy headline, two deck lines and two sections (two paragraphs each) into
**Day 5 → Record 005** (which already exists in the tree — tests a *change*) and
**Day 6 → Record 006** (which does not — tests an *addition*).

---

# 2b — THE PATH, EVERY STEP, MEASURED

| # | step | command | time |
|---|---|---|---:|
| 1 | workbook → draft | `python tools/dictation/workbook_to_draft.py <xlsx>` | **0.6 s** |
| 2 | land | `npm run record:land -- --draft <json> --write` | **3.4 s** |
| 3 | transfer class | edit `reveal/transfers.mjs`, then `npm run reveal:build` | 0.6 s + **the decision** |
| 4 | declare strings | `npm run record:declare -- --source "…"` | **0.9 s** |
| 5 | `provenance:gate` | | 0.7 s |
| 5 | `reveal:check` | | 1.0 s |
| 5 | `parity:gate` | | 0.5 s |
| 5 | `instory:gate` | | 0.5 s |
| 5 | `docs:numbers:gate` | | **33.3 s** ← the slow one |
| 5 | `lint` | | 6.0 s |
| 5 | `build` | | 3.5 s |
| 5 | `build:launch` | | 3.7 s |
| 5 | `approval:proof` | | ~7 s |

**Machine total: about 62 seconds.**

The landing itself reported:

```
  carried through untouched: 001 002 003 004
  regenerated: 005
  new: 006
  comment characters: 10124 before, 10124 after
  18491 -> 19249 bytes
```

Final state: **records 1 2 3 4 5 6, comment characters 12,042 — unchanged.**

## The step that did not exist

**There was no workbook reader.** Nothing joined Mike's Excel file to the draft
JSON the lander eats; the join was a person retyping five records. I wrote
`tools/dictation/workbook_to_draft.py` — Python because `openpyxl` is installed
and no JavaScript xlsx library is, and adding a node dependency to read one file
a week is the worse trade.

It reads by **row position with the column-A labels checked**, so a workbook
whose rows have shifted refuses rather than landing the deck as a headline. It
derives each date from `RECORD_EPOCH` rather than the sheet's title bar, so a
launch slip still moves one line.

---

# 2c — EVERY PLACE IT BROKE

### 1. Record 001 was dropped — guard 3 refused

```
record:land --write REFUSED — the draft does not carry record(s) 1, which are in
src\data\artists\robots-record.js.
```

The workbook is `RECORD_days-2-to-6.xlsx`. **001 is not in it** because it was
written before the workbook existed. **The guard was right** — a draft is meant
to hold the whole volume.

**Fixed:** the reader reads the tree through the museum's own `draftEntries` and
overlays the workbook on top. A record the workbook does not mention passes
through untouched — which is also exactly what the emitter needs in order to
splice that record's comments through verbatim.

### 2. Every non-ASCII character was corrupted — **the dangerous one**

After the merge, Record 001 still read as CHANGED. The cause:

```
  tree : "Weird.Baby website is live\nAlert — Incoming Email Server Load (contained)"
  draft: "Weird.Baby website is live\nAlert â€” Incoming Email Server Load (contained)"
```

`subprocess.run(..., text=True)` on Windows decodes with the locale codepage
(cp1252), not UTF-8. **Every em dash, every `·` separator and every curly quote
in the volume was arriving mojibake.**

It surfaced only because Record 001 carries comment blocks, so the "changed
entry" path refused instead of writing. **A record without comments would have
landed corrupted and passed every gate** — the strings would have round-tripped
perfectly, because they round-trip whatever they are handed.

**Fixed:** `encoding="utf-8"`. Written up in the reader's own source so nobody
removes it.

### 3. `reveal:build` refused the new record — **not a bug, a decision**

```
THE DECLARATION IS INVALID — 1 fault(s):
  record.006: no transfer class and no exemption.
```

Every ledger row belongs to BLAST · PACKAGE · UNLOCK · TRANSMISSION or is
exempted in writing. **This is a real human decision per new Record** and it is
step 3 of the runbook. For a status-day Record the answer is BLAST on Records
002–005's own reading, but it must be read, not assumed.

### 4. Twelve undeclared strings per landed record

`provenance:gate` refused with **12 UNDECLARED visitor-facing strings**. Five
Records is about sixty rows, every one class `MIKE` with the same source.

**Sixty identical rows typed by hand is not care, it is an opportunity to make a
mistake.** I wrote `npm run record:declare`, which fills exactly the rows whose
file is `robots-record.js` and **refuses to touch anything else** — a string that
appeared elsewhere during a Record landing is a surprise, and a surprise is what
a gate is for.

### 5. `npm run lint` always exits 1 — a trap, not a break

The baseline is 9 errors, so the exit code is *always* non-zero. A runbook that
says "run the gates and check they pass" would stop Saturday dead on a gate that
is behaving. **The runbook says: read the count, not the exit code.**

---

# 2d — REVERTED

```
git checkout -- src/data/artists/robots-record.js reveal/transfers.mjs \
                provenance/register.json reveal/ledger.json

HEAD sha256: c95f6e3452a71a1d02366426fb2a5e2101d94ca8e87537fffbf0ca2b2855725a
disk sha256: c95f6e3452a71a1d02366426fb2a5e2101d94ca8e87537fffbf0ca2b2855725a
BYTE-IDENTICAL: true
```

The working tree holds only the intended new tools:

```
 M package.json
 M tools/dictation/emit-record-entries.mjs        (Job 1)
?? tools/dictation/record-land-proof.mjs          (Job 1)
?? tools/dictation/workbook_to_draft.py           (Job 2)
?? tools/dictation/declare-record-strings.mjs     (Job 2)
```

---

# 2f — THE HONEST TOTAL

**From "Mike says it's ready" to "the Records are in the tree and the gates are
green": about 12 minutes**, of which **60 seconds is the machine.**

| | |
|---|---|
| machine | ~1 min |
| the transfer-class decision | ~2 min per new Record — **the only real thinking** |
| reading the landing diff | ~2 min |
| walking the pages afterwards | ~5 min |
| writing the commit text | ~1 min |

**Budget 30 minutes if something surprises you.** Every refusal in the path
leaves the file untouched, so a surprise costs time and never damage.

---

## WHAT I COULD NOT DETERMINE

- **Whether Mike's real Saturday text will contain curly braces.** His notes
  convention is `{…}` and the lander refuses any draft carrying one. The
  rehearsal used clean dummy text. If he writes notes to Ops in the workbook,
  step 2 stops until they are acted on — which is correct, and slower than this
  rehearsal suggests.
- **Whether five Records fit six workbook sheets cleanly.** The workbook has
  Days 2–6 → Records 002–006. If he writes Records 006–010 as the packet
  implies, **the workbook is the wrong shape** and either it or the reader needs
  a pass. The reader keys on the record number in the sheet name, so renaming
  the sheets is enough.
- **How long the deploy takes.** The packet's path stops at "gates green"; I did
  not deploy and was not asked to.
- **Whether `--source` survives PowerShell quoting in every shell.** It worked
  here with double quotes; the runbook says to quote it.

## WHAT NEEDS MIKE

1. **Check the workbook covers the right days.** It is `days-2-to-6` →
   Records 002–006. If Saturday's five are 006–010, the sheets need renaming.
2. **Nothing else.** The path runs.
