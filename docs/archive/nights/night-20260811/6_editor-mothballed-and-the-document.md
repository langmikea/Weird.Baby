# JOB 6 — THE EDITOR IS MOTHBALLED, AND HERE IS THE DOCUMENT
2026-08-11/12 · **WRITE** · not committed, not pushed, not deployed.

---

## THE DOCUMENT

# `C:\AI\_night-20260811\RECORD_days-2-to-6.xlsx`

**Excel. Six tabs: a READ ME FIRST, then one per day, Records 002 to 006.**
Double-click it.

---

## 6c — WHY EXCEL AND NOT WORD

**Two reasons, and the second is the honest one.**

1. **You asked for "a sheet or tab per day", and that is Excel's own model.**
   Word has no tabs. Days-as-tabs along the bottom is what you described.
2. **I could not make a real Word file.** This machine has `openpyxl` (Excel)
   and does not have `python-docx`. I could have written an HTML file named
   `.doc` and hoped Word opened it, or an `.rtf` and hoped Windows did not send
   it to a text editor. **Both are guesses about your machine, and you told me
   it must open by double-clicking.** An `.xlsx` from `openpyxl` is a genuine
   Excel file and there is nothing to guess about.

**One thing Excel gives you that Word could not:** the character limits are
**live**. Column D counts as you type and says `47 / 62`, and turns to
`TOO LONG` the moment you go over. That is the rule about a limit being shown
where the string is written — a formula does it properly, and Word would have
needed you to count.

---

## 6b — WHAT IS IN IT

**Each day's tab carries every field a Record needs, in plain words:**

| the label on the sheet | the field | the limit |
|---|---|---|
| **THE HEADLINE** | `title` | **62 characters**, counted live |
| **THE DECK — line 1** | first line of `line` | — |
| **THE DECK — line 2** | second line of `line` | **130 characters across both**, counted live |
| **Section 1–6 — LABEL** | `sections[].label` | none |
| **Section 1–6 — TEXT** | `sections[].body` | **none at all** |
| **ATTACHMENTS** | the payload rows | none |

- **A blank line between paragraphs is what splits them.** Alt+Enter for a new
  line inside a cell; that is on the READ ME sheet.
- **Six section slots a day.** Use what you need, leave the rest empty.
- **Curly braces are notes to me** and are named on the READ ME sheet, because
  the gate that catches a stray brace is invisible from a spreadsheet.

### What is pre-filled — cream cells, and you can overwrite any of them

| tab | what was already in the museum |
|---|---|
| **Day 2 · Record 002** | headline *"GENERAL STATUS UPDATE"*, both deck lines, 2 sections |
| **Day 3 · Record 003** | headline *"DATA EXTRACTED - Weekend Robots Anomaly"*, both deck lines, 2 sections |
| **Day 4 · Record 004** | **EXECUTIVE SUMMARY only** — carried in, exactly as you said. No headline, no deck. |
| **Day 5 · Record 005** | **EXECUTIVE SUMMARY only.** Same. |
| **Day 6 · Record 006** | **empty.** It does not exist in the museum yet. |

**Cream means already written, white means yours.** The dates are computed off
the one epoch — Day 2 is Tuesday 18 August, Day 6 is Saturday 22 August.

**Verified by reading the file back**, not by trusting the writer: six sheets,
the prefill lands in the right cells on the right tabs, and both counter
formulas point at the cells they are counting.

---

## 6a — THE EDITOR IS MOTHBALLED

**Nothing was deleted.** The generator, the client script, the CSS and the save
bridge are untouched, and `npm run record` still builds a working page.

**Two things changed:**

1. **The page says so in its own mouth.** A banner at the top of
   `docs/dictation-20260807/record.html`: it is mothballed, you write in the
   spreadsheet now, nothing here is broken, and if someone told you to run
   `npm run record` they were working from an old note.
   **The banner is built by the generator, not pasted into the file** — a note
   typed into `record.html` by hand would vanish the next time anybody ran the
   command, and a mothball a rebuild silently removes is not a mothball.
2. **It is no longer the lead card on the Ops desk.** It kept its row and lost
   `lead: true`, and the card now says what state it is in. **I did not remove
   it**: you ruled it *mothballed*, not *gone*, and an instrument that vanishes
   from the launcher is one nobody can find when it is wanted back.

---

## 6e — HOW YOUR TEXT GETS FROM THAT DOCUMENT INTO THE TREE

**You do one thing. I do the rest.**

| # | who | what happens |
|---|---|---|
| 1 | **you** | Type into the tabs. Save the file where it is. |
| 2 | **you** | Tell me it is ready. That is the whole of your part. |
| 3 | me | Read the workbook with `openpyxl` — same library that wrote it — and pull every filled cell into the entry shape: `title`, `line` (the two deck lines rejoined), `sections[{label, body[]}]`, attachments. |
| 4 | me | Split each section's text into paragraphs on the blank lines, exactly as the READ ME says. |
| 5 | me | Emit the JavaScript with `tools/dictation/emit-record-entries.mjs` and land it in `src/data/artists/robots-record.js`. |
| 6 | me | **`npm run record:land -- --verify`** — it strips the paragraphing back out and compares to what you typed. **Every box must round-trip your characters unchanged, or it does not land.** |
| 7 | me | `npm run reveal:check` — it refuses the packet if a headline is over 62 or a deck is over 130, so the live counters and the gate are saying the same thing. |
| 8 | me | The rest of the gates: lint, build, launch build, provenance, parity, in-story, orphans, `reveal:day`. |
| 9 | me | Report. You mirror and deploy. |

**Step 6 is the one that matters.** It is the same verifier that proved Record
001 landed verbatim, and it is why your typos ship as your typos.

**One thing I need from you before step 3 the first time:** whether an
attachment line should be a filename, a link, or a description. The sheet
accepts all three; the tree wants one shape. Nothing is blocked — I will ask
when I read your first filled tab.

---

## GATES

| gate | result |
|---|---|
| lint | **11 errors / 9 warnings — baseline** |
| build | green |
| launch build | green |
| provenance:gate | PASS |
| reveal:check | PASS |
| parity:gate | PASS |
| instory:gate | PASS |
| assets:orphans | 0 rows |
| reveal:day | nothing to move |

### One diff that looks alarming and is not

`npm run record` rebuilt the preview bundle, and
`docs/dictation-20260807/_preview/preview.css` came out **421 bytes smaller** —
it lost the four `.wb-ops-notes` rules.

**That is a correction, not damage, and it is proved rather than argued.** Those
four rules were deleted from `src/index.css` in HEAD itself — commit `6897b5c`,
*"The red notes are gone, and so are the boxes that showed them"*. The committed
`preview.css` still carried them because nobody had regenerated it since. **The
bundle was stale against its own source and now is not.**

---

## WHAT I COULD NOT DETERMINE

- **Whether Excel on your machine renders the two counter formulas.** They are
  plain `LEN()` and `IF()` — nothing exotic — but I wrote the file with a Python
  library and could not open it in Excel to watch them evaluate. **If column D
  shows `#NAME?` or stays blank, tell me and I will bake the numbers in as plain
  text instead.**
- **What shape an attachment should take.** Filename, link or description.
- **Whether six section slots per day is enough.** Record 001 used five;
  002–005 used one or two. If a day needs more, tell me and I will add rows.
- **Whether Day 6 should exist at all.** It is a Saturday, and the week-one
  outline is Monday to Friday. I built the tab because you asked for 002–006;
  I do not know what a Saturday entry is for.

## WHAT NEEDS MIKE

1. **Open `C:\AI\_night-20260811\RECORD_days-2-to-6.xlsx` and write.** Days 2
   and 3 already have a headline and a deck; 4 and 5 have only their executive
   summaries; 6 is blank.
2. **Tell me when it is saved.** I land it and verify it round-trips.
3. **Attachments: filename, link, or description?** One word.
4. **Is there a Day 6?** The outline runs Monday to Friday and Day 6 is a
   Saturday.
