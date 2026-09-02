# THE WORKSHEET EXPORT — round log, 2026-08-09

**Five instructions (U1–U5), all five done.** One of them — U2 — did not end
where the brief expected, and that is stated first because it is the honest part.

Gates: lint **11/9 = baseline** · build **green** · `provenance:gate` **PASS** ·
`reveal:check` **PASS** · `parity:gate` **PASS** · `instory:gate` **PASS** ·
`assets:orphans` **0 judged, 0 unjudged** · `reveal:day` **nothing to move** ·
**the lap RAN at 390px and 1228px on all ten Ops pages**, 20 measurements, every
one clean.

**Mike's own browser storage was never touched by this round.** Every test ran
against `http://127.0.0.1:8899`, a different origin from the `file://` one he
writes in, so nothing here could have read or overwritten his work.

---

## §1 — U1: THE EXTRACTOR, WRITTEN BEFORE ANYTHING WAS DIAGNOSED

`tools/dictation/RESCUE.md` — a console snippet he pastes once. It reads every
key in the browser's store, prints a per-key character count so he can see it
worked, and downloads `wb-rescue-<date>.json`. It writes nothing, deletes nothing
and changes nothing on the page. Two fallbacks are written under it for a blocked
download.

**It does not depend on any diagnosis, and that was the point of doing it first.**
It does not know which key is the worksheet's, does not filter, does not judge —
it takes everything, because a rescue that only takes what the rescuer expects to
find is not a rescue.

`node tools/dictation/rescue-import.mjs <file>` reads it back on the Ops side.

---

## §2 — U2: THE DIAGNOSIS, AND IT IS NOT WHERE THE BRIEF POINTED

**All four candidates in the brief were checked and all four are false of the
build on disk.** Measured, not reasoned:

| candidate | finding |
|---|---|
| the export walks a hardcoded slot list from before the LINE slots | **No.** The built page declares **41** slots and renders **41** textareas — same set, in both directions, zero difference. |
| it reads a different storage key than the page renders from | **No.** One key in the file, `wb.worksheet.2026-08-07`, used by the reader, the writer and the exporter. |
| the timestamp is baked at generation | **No.** It is `new Date()` inside `collect()`. Filling all 41 slots and pressing copy produced `captured 2026-08-09 10:00`, the real minute. |
| a rebuild changed the keys | **No.** `STAMP` is the hardcoded constant `"2026-08-07"` in `shell.mjs`, not a generation date, so every rebuild has produced the same key. Verified again in §5. |

**So the built page exports correctly: 41 of 41, timestamped at the press.** The
symptom is real and the page is not the thing producing it — which leaves exactly
one link in the chain that nobody had ever measured.

### The clipboard, and the message that reported success without checking

```
navigator.clipboard.writeText(...)
  → NotAllowedError: Failed to execute 'writeText': Document is not focused.
```

Measured in this Chrome. On that rejection the page fell to `legacy()`, which did
`document.execCommand("copy")` and printed **"Copied — 4,293 characters on the
clipboard"** on the strength of its return value. **That return value reports
whether the command was ENABLED, not whether the clipboard changed.**

So the page could say *Copied* while the clipboard still held whatever was last
successfully put there. **Three pastes, days apart, identical, frozen at
2026-08-07 17:04 with three slots in them is exactly and only what that
produces** — the artefact of the last copy that did work, re-pasted.

**This is stated as the cause the evidence supports, not as a certainty.** What
is certain is narrower and is enough to act on: *the tool claimed a success it
never verified*, and that claim is now impossible. What would settle the rest is
his rescue file — if it holds 40 answers, the storage was always fine and the
clipboard was the whole story.

**And the W-round had already flagged this exact link as unmeasured:** *"whether
`clipboard.writeText` succeeds under a genuine user click — real mouse input
stopped reaching the page mid-session, so every test click was synthetic."* An
unmeasured link in the one path that carries his work is where the defect was.

---

## §3 — U3: IT CANNOT RECUR, IN TWO PLACES

**(a) The export is derived from what the page renders, and the build proves it.**
`assertSlotsMatchPage()` reads the generated HTML back, extracts every
`data-slot`, and **refuses to write a page** whose textareas and whose `SLOTS`
array are not the same set — missing, extra and duplicated, all three.

Proved by breaking it on purpose (by file copy, per §9): one slot removed from
the export list only.

```
Error: the worksheet: the export list and the rendered page disagree, so the copy
button would export a different set from the one he is looking at.
  rendered but not declared: REC.EPOCH
```

**(b) The collector walks the union, and prints what it cannot place.** Values are
now **file → store → live boxes**, weakest first. The old collector read the live
boxes only, so an answer to a slot a later round retires — which the SAVE path has
protected since R2 — would have been exported by nothing, in silence. A slot with
no metadata is printed as `A RETIRED SLOT`, never dropped.

### The proof Mike asked for

Every slot written into, then export:

```
41 textareas · 42 answers in the store (41 + one retired slot injected on purpose)
captured 2026-08-09 10:10  -  42 answer(s): 41 of 41 slots on this page,
                              plus 1 held in the store from a retired slot
42 exported blocks · retired slot travelled · labelled
```

**Count matches. Timestamp is the moment of the copy.**

### And the copy button no longer lies

It reads the clipboard back and compares. Three outcomes, three different
sentences: **"Copied and VERIFIED — N characters"**, **"!! THE CLIPBOARD DID NOT
TAKE IT"**, or — where the browser refuses to let the page read the clipboard —
*"NOT VERIFIED … the text is selected below; press Ctrl+C."* **It never says
"Copied" on an unverified write.** The text is also selected *before* the attempt,
so Ctrl+C works whatever happens.

---

## §4 — U4: THE BRIDGE

**A `Save to the repo` button, and it is the primary control now** — the copy
button is beside it in outline, the old road kept for a reader who wants text.

`showSaveFilePicker` writes the real file; the handle is remembered in IndexedDB
against the storage key, so it is a dialog **the first time** and **one click**
every time after. Point it once at:

```
docs/dictation-20260807/answers.json
```

It writes JSON rather than the paste text, because the paste is for a human and
this is for a program. `npm run dictation:import <file>` reads it — and reads a
rescue dump too, so both roads land in the same place.

**The fallback was proved rather than assumed.** A synthetic click carries no
transient activation, so the picker refused with `SecurityError` — and the page
downloaded `answers.json` and said exactly where it went and what to do with it.
That file was then fed through the importer: **42 answers, key intact, retired
slot included.** A bridge that fails must fail into the old road, not into
silence.

**Three rules the importer will not break**, because it handles work that exists
in one copy: it never shortens an answer without `--force` and printing the
conflict; it writes a dated backup before it writes at all; and it reports every
key it found *including the ones it did not use* — a dump may hold `wb.arc12.*`
and keys from older builds, and an importer that silently picked one would be the
original defect in a fix's clothes.

---

## §5 — U5: THE REBUILD, AND THE SECOND DEFECT THAT WAS NOT THERE

**A rebuild does not destroy his content.** Filled 42 answers, ran
`npm run dictation` under the open page, reloaded: **42 in the store, 41 boxes
filled** (the 42nd is the retired slot, which has no box). The key is a constant,
so this has always been true — but nobody had ever run it, which is why the
instruction was right to demand it.

**So the second defect was the other direction: the browser, not the rebuild.**
His words lived in exactly one place, and a browser is not a place work lives.
The generator now bakes `answers.json` into the page. With the store **wiped
entirely**, the worksheet opens on all his words, prints a green banner naming
the file they came from, and exports **42 of 42**.

Three rules on the bake: it never overwrites the store (a baked answer fills a
box only where the store is empty); it **says so**, because a silent pre-fill is
indistinguishable from something he typed; and the generator **only reads** that
file, so no rebuild can damage it.

The banner is green and not red — the same box as the storage warning, a calmer
colour. *A red panel saying your work was restored reads as your work was lost.*

---

## §6 — WHAT WAS TOUCHED

**New:** `tools/dictation/RESCUE.md` · `tools/dictation/rescue-import.mjs` ·
`npm run dictation:import`.

**Changed:** `tools/dictation/worksheet.mjs` — the collector, the verified copy,
the bridge, the build assertion, the bake-back and its banner.
`package.json`.

**Not committed on purpose:** `docs/dictation-20260807/answers.json`. It holds
his words and does not exist yet; absent is the normal state and the generator
handles it. The probe data used to test all of this was deleted before sealing.
