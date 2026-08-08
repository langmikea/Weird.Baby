# THE NIGHT DESK — S1–S4, 2026-08-07

**Round type:** remote-control, autonomous, single agent, drafting lane.
**The constraint that shaped every decision:** *"Mike is done for the night and
PHONE-ONLY FOR 24 HOURS — he cannot run PowerShell, cannot open local files, and
cannot deploy."*

---

## 0. THE HEADLINE FINDING

**S2 ASKED FOR MIKE'S DAY-1 TEXT "EXACTLY AS HE WROTE IT, VERBATIM" AND THAT TEXT
IS NOT REACHABLE FROM THIS SESSION.** The instruction says it *"exists only as
text he pasted to Ops — it is NOT in the tree,"* which is correct and is also the
whole problem: it is not in the tree, it is not in the robots repo, it is not in
`C:\AI\Projects` anywhere (`Initial Launch Report` returns zero hits across the
whole drive tree), and the kickoff itself carries only a **parenthetical summary
of the timeline**, not the prose.

So the round did what K5 did on 2026-08-07 when it was asked for a week-one
outline that did not exist: **it built the frame, filled every slot it genuinely
had material for, left the rest empty, and printed the gap at the top rather than
burying it.** Doctrine 12 — Ops does not invent content — is not suspended by an
instruction that assumes the content is in hand.

**WHAT WENT IN, AND IT IS ALL OF WHAT WAS SUPPLIED:**

| Supplied in the instruction | Where it landed |
|---|---|
| Headline: *"Weird.Baby Initial Launch Report"* | `title` on Record 001 — 31 chars, inside the 62-char index budget |
| The eight-beat timeline block | one section, `label: "Timeline"`, eight lines |

**WHAT WAS NAMED AND DELIBERATELY LEFT EMPTY:**

- **the executive summary** (`line`) — Mike's own R3 rule is that every index row
  carries a headline *and* an executive summary. Record 001's row carries the
  headline alone, because writing the summary is writing his report for him.
- **the lead** (`lead`) — same reason.
- **the detailed report** — the instruction names it; nothing supplied it. The
  entry carries the timeline and stops.
- **the tombstone** (`tomb`) — 23:30's ruling is a timeline beat and stays one.
  Promoting it to the tombstone would be Ops deciding where his report ends.
- **the date** — no date was supplied, so the entry carries none, exactly as 013
  does, and `entryDateline` prints `Record 001` alone. **This is also why C8 is
  still blocked:** `recordEpoch` is a DATE and 001 has not brought one.

**THE SOURCE OF RECORD 001's STRINGS, ON THE RECORD.** The nine strings on that
entry are declared `MIKE` in `provenance/register.json` and their `s` points at
this section. What Mike supplied, relayed through the 2026-08-07 night kickoff,
verbatim as it reached Ops:

> Headline "Weird.Baby Initial Launch Report"; the executive summary and the
> detailed report as he wrote them, including the timeline block (15:00 server
> public, 15:01 BIST PASS, 15:14 first packet, 15:58 second packet, 16:00
> onslaught 86% vs threshold, 16:10 auto-shutdown and containment, 16:13 REACT
> convened, 23:30 ruling: restart with 50x resources, stress test).

The eight lines on the glass are those eight beats set as a register — the
time, a separator, and the beat's own words. **No beat gained a fact and no beat
lost one.** Any sentence that would have joined them up is Ops prose about an
event Ops did not witness, and there is none on the entry.

---

## 1. THE SECOND FINDING, AND IT IS A QUESTION ONLY MIKE CAN ANSWER

**IS THE LAUNCH REPORT IN-STORY, OR IS IT A REAL INFRASTRUCTURE REPORT ABOUT
DEPLOYING WEIRD.BABY?** The two readings are indistinguishable from the text:

- **In-story** — a server, a BIST pass (the machines' own Built-In Self Test
  vocabulary, straight out of the robots repo), packets, an onslaught, a
  containment, an emergency team. That is a Record entry: an event in the record,
  which is exactly what the Record is for, and it **ships** under Doctrine 11.
- **Real** — the actual launch of this website, its actual load, its actual
  auto-shutdown, and the actual 23:30 decision to restart with fifty times the
  resources. That is a line **whose subject is the making of the museum**, and
  Doctrine 11 refuses it at any live address, however true it is.

**It was built on the first reading and the question is open (`S-a`).** The
reasoning: the Record is the house's own log, Mike instructed it into the Record
by name, and the entry is in the DEVELOPMENT stage on an undeployed tree — so a
wrong reading costs one deletion and no visitor sees it in the meantime. **The
inverse — not building it and waiting — costs the whole instruction.**

One word closes it. If the answer is *real*, the entry comes off the glass and
the material belongs in `docs/`.

---

## 2. WHAT WAS BUILT

### S1 — ONE DESKTOP ICON, ALL THE TOOLS

`tools/ops-desk.mjs` → `npm run desk` → **`docs/OPS_DESK.html`**, plus
`docs/OPEN_ACTIONS.html` rendered from the register's markdown.

Eight instruments behind one page:

| Instrument | File |
|---|---|
| The worksheet | `docs/dictation-20260807/worksheet.html` |
| The twelve-week table | `docs/dictation-20260807/arc.html` |
| The artifact tracker | `docs/dictation-20260807/artifacts.html` |
| The egg tracker | `docs/dictation-20260807/eggs.html` |
| The spec sheet | `docs/dictation-20260807/specsheet.html` |
| The reference page | `docs/dictation-20260807/reference.html` |
| The contact sheet | `docs/CONTACT_SHEET.html` |
| The open-actions register | `docs/OPEN_ACTIONS.html` |

**FOUR THINGS A FUTURE SESSION MUST HOLD.**

1. **IT IS A GENERATOR, NOT A PAGE.** Same doctrine row as every other Ops
   instrument (§5 *THE OPS INSTRUMENTS THAT RENDER TO `docs/`*): it reads and
   never writes anything but its own two outputs, and it renders to `docs/` and
   **never** to `public/`.
2. **IT REPORTS WHAT IS MISSING RATHER THAN LINKING PAST IT.** Every card is
   `fs.statSync`'d at generation. A file that is not on disk gets a red card
   saying so and no link — a dead link on a launcher is worse than an absent one,
   because the launcher is the thing you trust when you have stopped checking.
3. **IT PRINTS EACH INSTRUMENT'S OWN AGE AND THE COMMAND THAT REFRESHES IT.**
   *"Current"* is not a property of a launcher; it is a property of the last time
   the generator behind each page ran. So each card carries its file's mtime and
   the `npm run …` that rebuilds it.
4. **THE MARKDOWN RENDERER IS DELIBERATELY SMALL AND SAYS WHAT IT DOES NOT DO.**
   Headings, tables, lists, blockquotes, rules, links, anchors, `code`, bold and
   italic. It is not a Markdown implementation and must not grow into one — the
   register is the only document it renders and the register is the spec.

**The shortcut:** `Weird.Baby Ops.lnk` on the desktop, pointing at
`docs/OPS_DESK.html`. Created with `tools/ops-desk-shortcut.ps1`, which is
idempotent and re-runnable.

### S2 — RECORD 001

`src/data/artists/robots.js`, `face.entries`, **inserted before 013 and not
after**. Under Mike's own B2 ruling the volume numbers from 001, so 001 is the
lower number and the earlier entry; `entriesMode:"log"` reverses at render, so
the index reads **013, then 001**, and the Record still opens on the higher
number. Nothing about 013 moved — not its number, not its text, not its picture.

**ADDING THE SECOND ENTRY TURNED ON THREE MECHANISMS THAT HAVE NEVER RUN.**
`RecordEntry.jsx`'s ‹ NEWER / OLDER › walk, its `2 of 2` count and `RecordJump`
in `Exhibit.jsx` are all gated on `list.length > 1` and have rendered nothing
since M5. This is the first packet in which any of them draws. **That was not a
goal and it is worth saying out loud:** three controls went from unexercised to
live in a data edit, and the lap is the only thing that could have seen it.

### S3 — SEALED, NOT DEPLOYED

Nothing was deployed. `npm run deploy` is one command and it is **his**, per the
release-discipline rule that releases are operator-confirmed. The hand-off is a
single line at the foot of this document.

### S4 — THE REGISTER

See §4.

---

## 3. GATES

| Gate | Result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings — baseline, zero new** |
| `npm run build` | **green** |
| `npm run provenance:gate` | **PASS** — 10 new rows declared (9 MIKE, 1 HOUSE) |
| `npm run reveal:check` | **PASS** — *"the 2 Record row(s) match the Record's own entries exactly"* |
| `npm run reveal:build` | wrote `record.001`; **refused it first**, correctly (see §3a) |
| `npm run parity:gate` | **PASS — 4 shared · 0 divergences** |
| `npm run instory:gate` | **PASS** — the Record is exempt by Doctrine 18 and stays modern |
| `npm run assets:orphans` | **0** |
| `npm run reveal:day` | **nothing to move** — 2 entries, 18 governed pictures, 2 public, 16 behind the door, 0 to place, 0 to pull back |
| `npm run surfacing` | **20 spendable · 13 promised and unbuilt · 0 idle** — unmoved, the SIXTH packet running |
| the lap, 390px | `/robots` **page overflow 0**, no console errors, no broken images; `OPS_DESK.html` and `OPEN_ACTIONS.html` **page overflow 0**, 0 painting past the edge, all 23 register tables inside their own `overflow-x:auto` boxes |
| `npm run lap:clean` | run — `public/_lap.html` is gone, `git status` carries no stray |

### 3a. THE TRANSFER TABLE REFUSED THE ENTRY, WHICH IS THE TABLE WORKING

`reveal:build` failed its first run with *"record.001: no transfer class and no
exemption"* — a fall-through fails the build by design. **It is BLAST, beside
`record.013`, on the plainest reading in the file:** the entry's own subject is
the day the server went public, and BLAST *is* week 0. **An exemption was not
available, and that is the model too** — `validate()` refuses to let an exempt
row be `REVEALED`, and this entry is on the glass. The choice was a class or
nothing, and nothing fails the build.

### 3b. WHAT THE LAP MEASURED ON THE RECORD

Built bundle, `wrangler dev`, 403px same-origin iframe → `innerWidth` 390:

- index rows render **013 then 001**, 001 marked `--unread`
- **`RecordJump` (NEWEST / OLDEST / UNREAD) draws for the first time**
- opening 001: dateline **`Record 001`**, headline, one `TIMELINE` section, all
  eight beats in order, **no lead, no tombstone, no still** — as authored
- the walk reads **`2 of 2`**, also for the first time
- **index row heights: 013 = 157px · 001 = 84px** — this is `S-b`, measured

---

## 4. WHAT THIS ROUND EXPOSED

**`S-a` — is the launch report in-story or real?** §1 above. One word.

**`S-b` — RECORD 001 HAS NO EXECUTIVE SUMMARY AND MIKE'S OWN RULE SAYS EVERY
INDEX ROW HAS ONE.** The rule (R3, 2026-08-06) is *"every index row gets a
headline and a summary beneath it, ALL CONSTRAINED TO THE SAME HEIGHT, and THE
ENTIRE SUMMARY MUST FIT."* Record 001's row has the headline and nothing under
it, because the summary he wrote is not in the tree. **The gate cannot see this**
— `RECORD_LINE_MAX` polices a summary that exists and has no opinion about one
that does not. Budget: 130 characters.

**`S-c` — A RECORD ENTRY THAT DECLARES `sections` SILENTLY DROPS `wire`, `plates`
AND `docs`.** Found while placing the timeline. `Exhibit.jsx` renders all three
for an entry with no `sections`; the moment an entry declares `sections` it goes
to `RecordEntry.jsx`, **which renders none of them and reports nothing.** An
author attaching a transmission, a photograph set or a document to a long-form
entry gets silence — the exact failure shape as the four `deliveryFaults()`
checks that all walked FILES. It did not bite this round because the timeline is
rendered as a section body instead. **It is not fixed here on purpose:** where a
payload sits relative to four-to-seven authored sections is a layout ruling, and
that is Mike's.

**`S-d` — THE DESK IS A LOCAL FILE AND HE CANNOT OPEN LOCAL FILES FROM A PHONE.**
Stated rather than solved. Every instrument behind it renders to `docs/` by
doctrine and must not go to `public/`; publishing them would put the museum's own
housekeeping at a live address, which Doctrine 11 refuses. The desk is for the
machine; the phone gets this document and the Artifact named at the foot.

---

**`S-e` (not a register row — recorded here) — §8's NUL-BYTE HAZARD FIRED THROUGH
THE WRITE TOOL, NOT THROUGH A PATCH SCRIPT.** `tools/ops-desk.mjs` came off its
first write carrying **four literal NUL bytes**, where spaces inside template
literals should have been. The tell was the documented one: an `Edit` failed to
match a line that had just been read correctly, because the reader draws a NUL as
a space. Found with `sed -n '120p' | od -c`. All four stripped; the file's one
placeholder pair is built from `U+E000` / `U+E001` escapes and the reason is
written above it. **The hazard row says *a patch script*; it is wider than that.**

---

## 5. THE HAND-OFF — the one command

**NOTHING WAS DEPLOYED.** Release discipline says releases are operator-confirmed,
and S3 says nothing may be stranded behind a step Mike cannot take. So the packet
is sealed and complete, and the museum goes live on one command:

```powershell
npm run deploy
```

That is `vite build && wrangler deploy`. It publishes in the **DEVELOPMENT**
stage, which is the standing default and Mike's own instruction — so it also
publishes the Portal and the sixteen held photographs, exactly as `R-a` records.
**No `export-artifacts` is needed:** nothing in this packet touched MediaVault or
`src/data/exhibits/`.

**And two things that need no machine at all:**

1. **`Weird.Baby Ops`** is on the desktop. Double-click opens the desk; every
   instrument is one click from there. Verified by an actual double-click.
2. **`S-a` and `S-b` are one word and one paste**, and both can be answered from a
   phone. `S-a`: is the launch report **story** or **real**? `S-b`: the executive
   summary and the detailed report, as you wrote them.
