# FINDING — the exact URL and the exact button

**Round:** the day-editor address. **Written:** 2026-08-30.
**Scope:** READ ONLY. Nothing was saved, nothing was clicked, `record:land` was
not run. The draft on disk was not touched.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.
**Written for Mike, who gets one shot.**

**Method notation.** **READ** — the tree states it, at a named file and line.
**RUN** — a command was executed and this is its output.

---

## 1 · THE URL

```
http://127.0.0.1:8899/day.html
```

**RUN and READ.** `record-serve.mjs:80` sets the port: `Number(process.argv.find(…) || 8899)`
— **8899 when no number is passed**, which is how `npm run day:serve` runs it
(`package.json`, no argument). READ. The server was started once on a spare port
to read its own banner and stopped again; the banner prints the same address with
whatever port it is given. RUN.

**The bare address works too and lands on the same page.** `record-serve.mjs:301-306`,
READ: `/` resolves to `/day.html` whenever `day.html` exists. **The explicit
`/day.html` is given here because it cannot be wrong** — see §5 for the one
condition under which the bare `/` serves something else.

---

## 2 · THE COMMAND THAT SERVES IT

```powershell
Set-Location C:\AI\Projects\weird-baby-museum; npm run day:serve
```

**Leave that window open.** It prints a line every time a save lands, and that
line is half the proof in §4.

**The page does not need rebuilding first.** RUN, checked today: the page on disk
was built on 2026-08-28 and carries the Record's fingerprint
`fa5cdcd9fcfa9112937f8ec373481594…`, which is **exactly** the fingerprint of
`src/data/artists/robots-record.js` as it stands now. Nothing has moved it since.
**The page is current and the save will be accepted.**

---

## 3 · THE CONTROL

**Its label is exactly:**

```
Save to the repo
```

**It is not ambiguous.** RUN — every button label on the page, counted: that
phrase appears **once**. The other controls are `+ add a section` (five of them,
one per day), `‹ previous day`, `next day ›`, `show it`, `discard it`,
`copy everything`, `× close`, and small `+` and `×` marks on individual rows.
**No other control has the word "Save" in it.**

**Where it sits.** Reading the page from the top down:

1. the day list, headed **`THE DAYS · 5`**
2. the bar with `‹ previous day` and `next day ›`
3. **the five days themselves, one after another** — this is the long middle
4. a box headed **`SAVE · your words and your marks, in one`**
5. one last panel below that

**So: scroll to the bottom, past all five days. The Save box is the
second-to-last block on the page, and `Save to the repo` is the first control
inside it.** `Ctrl+S` does the same thing from anywhere on the page, without
scrolling.

---

## 4 · WHAT TO SEE BEFORE, AND WHAT TO SEE AFTER

### Before — four things, and all four must be true

1. **The browser tab reads `The day`.** That is the whole title. If it says
   anything else, this is not the editor.
2. **There is no red block across the very top of the page.** If one is there it
   begins with the words **"THE RECORD MOVED AFTER THIS PAGE WAS BUILT. DO NOT
   SAVE."** — and if you see that, stop and tell Ops. Nothing is lost; the page
   is simply older than the thing it was made from.
3. **The list at the top says `THE DAYS · 5`.** Five days, because there are five
   entries. RUN — the page on disk says exactly that.
4. **The `Save to the repo` button is not greyed out.**

### After — two places, and they must agree

1. **On the page, immediately beside the button**, a line appears reading
   **`SAVED —`** then the number of records, the number of characters, and the
   time. It should say **5 records**.
2. **Underneath it**, a line beginning **`Written:`** naming the two files it
   wrote, and then the words **"The Record itself is not written"**. That is
   true and expected — writing the Record is a separate command and it is Ops'.
3. **In the terminal window you started**, one new line appears beginning with
   the word **`saved`**, with a size and a record count.

**If instead the page shows a block saying the server refused the save**, or
that it could not reach the server: **nothing was written.** Everything typed is
still on the screen, and the page offers it in a box to copy. Tell Ops rather
than pressing again.

---

## 5 · CAN THE WRONG EDITOR BE REACHED BY ACCIDENT?

**Not from the page. Yes from the terminal, and here is exactly where.**

**From the page: no.** RUN — `record.html` appears **zero** times in `day.html`.
There is no link, no tab and no button anywhere on the day editor that leads to
the mothballed Record editor. Clicking cannot take you there.

**From the terminal: yes, and it is the last line of the banner.** RUN — the
banner `npm run day:serve` prints ends like this:

```
  The Record editor (mothballed) is at   http://127.0.0.1:8899/record.html

  Ctrl-C to stop.
```

**That address is the wrong one.** The right one is printed higher up, inside a
box of `═` characters, under the words **`THE DAY EDITOR — WHERE HE WRITES`**.

**Told apart without looking at either page: the wrong address ends in
`/record.html`. The right one ends in `/day.html`, or in nothing at all.**

**What happens if the wrong one is used:** its Save button posts to a road that
was closed on 2026-08-30 and now refuses every write by name. Nothing would be
damaged — it answers with a message saying the road is closed and which one to
use, and that page then offers the work as a file to download instead. **It
would waste the attempt, not the words.**

**And one condition under which the bare `/` would betray you, stated because it
is the only one.** `record-serve.mjs:302`, READ: `/` serves `day.html` **if that
file exists**, and serves `record.html` if it does not. The file exists today —
RUN, 1,308,295 bytes, built 2026-08-28. If it were ever missing, the banner would
say **`NOT BUILT YET`** in place of the address. **If you see those words, stop.**

---

## 6 · THE ADDENDUM 02 CONSTRAINT IS **NOT** ON THE PAGE

**Reported as absent, not fixed.**

RUN: the words `ADDENDUM 02` appear six times in `day.html`, and **every one of
them is a section label** — the name of a block in Record 003 and in Record 001,
in the day list and on the row buttons. RUN: there is **no warning text anywhere
on the page** about inserting, deleting or reordering a paragraph inside it.

**The constraint itself, for the record.** In Record 003's section headed
**`ADDENDUM 02 - Personnel Folders (empty, names only)`**, the box holds two
paragraphs that begin at different depths — one is indented four spaces, the
other two. Editing the words inside them is safe. **Adding a paragraph, deleting
one, or swapping their order is not**: the two indents are re-applied by
position, so the paragraphs would come back with each other's spacing.

**Where it is written today:** `docs/PREPARED-manual-hold.md` §6.1 and
`docs/FINDING-day-editor-save.md` §2.6 — **two documents Mike does not read, and
neither of them is the surface he will be standing on.** The one place the
constraint would do its job is the box itself.

**This report does not add it.** Putting a warning on a generated page means
editing `tools/dictation/day.mjs`, which is a change to the writing surface on
the eve of the round that uses it, and the packet is read-only. **Flagged as
F12.**

---

## 7 · FLAGGED, NOT FIXED

- **F12 — the ADDENDUM 02 constraint is written in two reports and not on the
  page where it applies.** §6. The box he will type into says nothing, and the
  transform is silent: his characters survive and his spacing does not.

---

## 8 · EVERY COMMAND RUN

Nothing here saved, clicked or landed anything.

```
sed -n … tools/dictation/record-serve.mjs      (the port, and what `/` resolves to)
sed -n … tools/dictation/day.mjs               (the save box, the messages, the page order)
sha256sum src/data/artists/robots-record.js    (fa5cdcd9…)
grep -oE '"sha256":"[a-f0-9]{64}"' docs/dictation-20260807/day.html   (the same fa5cdcd9…)
node tools/dictation/record-serve.mjs 8931     (started, banner read, stopped by PID)
grep -oE '<button[^>]*>…' docs/dictation-20260807/day.html | sort | uniq -c
grep -c "record\.html"  docs/dictation-20260807/day.html      -> 0
grep -c "ADDENDUM 02"   docs/dictation-20260807/day.html      -> 6, all section labels
ls -la docs/dictation-20260807/day.html
```

Everything else is READ, at the file and line named beside it.
