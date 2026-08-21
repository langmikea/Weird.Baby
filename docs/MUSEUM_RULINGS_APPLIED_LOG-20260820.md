# THE RULINGS APPLIED — CHANNEL 3, THE DRUM, THE TRACKLIST, 004 AND 005
2026-08-20 · **not committed, not pushed, not deployed**
HEAD at start: `4323477`.

The channel-3 diagnosis and fix are logged separately in
`_night-20260820/CHANNEL_3_LOG-20260820.md`. This file is the round that applied
Mike's rulings on top of it.

---

## 1 — THE BEZEL IS BACK, BYTE FOR BYTE

`public/held/robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png`,
542,670 B. **sha256 `ca04f2ff…9398`, identical to the blob deleted in
`000a03c`** — a restore, not a substitute, and it matches the robots-repo copy
that was never deleted.

**THE OPTIONAL-LAYER FIX STAYS AND IS THE REAL PROTECTION.** `Portal_In`
required both layers and named a fallback that no longer existed; it now builds
the portal on the feed art alone and says `NO BEZEL ON FILE` in the machine's
own register. The file being present is not what keeps the Portal alive.

**`monitor_base.png` IS NOT RESTORED, AND THAT IS DELIBERATE.** After the tier-0
fix nothing loads it: it was the flattened composite (bezel + a white top-window
rectangle baked in) that `Portal_Build` has thrown away in favour of the clean
family art since [T7]. It is no longer load-bearing, so restoring it would put
back a superseded photograph and nothing else. **If Mike wants it back as a
picture that is a separate call**, and its asset-table row is still on the orphan
list where he can see it.

**Verified with a real latch:** `#portalbez` present, `naturalWidth` 3000 × 2400,
feed group built, machine powered, and the CRT frame composited over the feed
with the unit at its menu inside it.

---

## 2 — DOCTRINE 27, AND WHAT THE INSTRUMENT WOULD COST

`OPERATIONS.md` §7 **Doctrine 27**, mirrored in `STATE.md`: **an asset cull asks
what BUILDS from a file, not only what DISPLAYS it.**

**THE SHARP PART IS THAT AN INSTRUMENT ALREADY HELD THE FACT.**
`assets:orphans` reported `monitor_base.png` from the day it went — a row whose
file is not on disk. **It had the fact and could not say the consequence.** An
orphan reads as dead bookkeeping, and that is exactly what it looks like right up
until something is still loading the file.

**COSTED, NOT BUILT** (his instruction):

| mechanism | catches both files | cost |
|---|---|---|
| **reference check in `assets:cull`** — refuse a delete when any source tree names the basename | **yes** — each appears as a literal beside its consumer | **~half a round**: one walker with an extension allow-list, one refusal path, one proof that injects a reference and watches it refuse |
| manifest of build inputs | yes, once authored | **more than a round**, and it keeps the same hole — an input nobody declares is invisible to it |

**Recommended: the reference check.** It reads the code that actually loads the
file rather than a list somebody has to keep true. Its one hole is stated up
front: a filename **assembled** at runtime from pieces is invisible to a basename
search. Neither of the two that bit us was.

**Until it exists it is a human step:** grep the basename across both repos
before a cull; if anything outside the asset table names the file, **the cull is
a code change and not a cull.**

---

## 3 — THE DRUM, AND THE LEGEND THAT IS GONE

| ch | was | is |
|---:|---|---|
| 3 | `STANDARD` | **`MGK-VIIIp`** |
| 4 | `DETAIL` | **`MGK-VIIIp (zoom)`** |

**No `id` moved** — `standard` and `idling-updated` are what the latch puts in
the event and what a twin URL carries. That is the third recut (P5, CH4, this
one) in which no id moved. **`CH-a` closes with `DETAIL`.**

**`SELECT · ONE ARMED` IS STRUCK, NOT CORRECTED.** `drum.sub` is undeclared and
`Exhibit.jsx` renders it conditionally, so nothing draws and no gap is left —
**measured on the page: `.ip-sub` is absent and `ONE ARMED` appears nowhere in
the rendered text.** [H-22](canon/HOLES.md#h-22) **half-closes**: its sub
complaint is gone, and channels 5–8 still wear Ops' words, so the hole stays open
for them.

**AND THE RECORD'S FOLDER NAMES DELIBERATELY DO NOT FOLLOW.** Record 002's
Tuesday manifest already published `PORTAL/CH3-STANDARD/` and
`PORTAL/CH4-DETAIL/`, and Record 004 prints the same tree. Those are the far
end's own directory names on a 1965 disk; these are the museum instrument's
engraved legends. **The collision was checked before it was shipped**, not after.

---

## 4 — THE TRACKLIST IS TWO

`Portal` (the panel, `id: portal`) · `FAQ`. The `portal-door` track is deleted;
its `id` was never the one that mattered, and the LATCH one row down was always
the better door. **P-b's judgement is superseded and named once in the file it
left**, per Doctrine 24. Measured on the page: `01 Portal 02 FAQ`.

---

## 5 — RECORDS 004 AND 005, AND THE LIMIT THE TREE FOUND

> **SUPERSEDED IN PART BY §9, THE SAME DAY.** The `{ pre }` shape survives;
> its RENDERING is no longer a `<pre>`, 004's `OTHER` section is struck, and
> 005's addendum is gone. Read §9 before trusting a mechanism claim here.

**`355113`.** His transposition corrected on his own ruling — 355/113 =
3.14159292, six decimals of Zu Chongzhi's ratio, which a transposed pair is not.

**THE FOLDER TREE WOULD HAVE ARRIVED FLAT, AND ONLY A MEASUREMENT SAYS SO.**
`.vp-rec-sect-body` is `white-space: pre-line` — chosen deliberately in
2026-08-10 so runs of spaces collapse, which is right for prose built out of
concatenated literals. **Measured on the built page: `A B` and `A    B` both
render at 29.97px.** His tree hangs `PORTAL.CFG` under `TERMINAL.EXE` at column
26; collapsed, that file belongs to nobody.

**THE FIX IS AN OPT-IN, NOT A RULE CHANGE.** A body item may now be
`{ pre: "…" }`, drawn as `<pre class="vp-rec-sect-pre">`. Switching the shared
class to `pre-wrap` would have made every incidental double space visible —
including `=  86%` in Record 001, which is **`S-e`, Mike's open question**, and
not a thing a folder tree may decide.

**THREE THINGS A FUTURE SESSION MUST HOLD.**

1. **`reveal:check` CAUGHT IT, WHICH IS THE GATE EARNING ITS KEEP.** The first
   cut failed with *"section 2 `body` is a list whose paragraph 2 is a
   ObjectExpression this reader cannot fold into a string."* `paragraphsOf` in
   `reveal/record-entries.mjs` now folds the shape and **reports `list+pre`
   rather than `list`** — "which shape did you find" is the question that
   function exists to answer.
2. **THE RECORD EDITOR CANNOT EDIT A LISTING.** It finds fields by
   `.vp-rec-sect-body` and a `<pre>` is not one. The editor is MOTHBALLED for
   week one (the writing is in the workbook), and the `list+pre` shape is how the
   next session is told **before** it re-opens that door.
3. **AN UNKNOWN SHAPE DRAWS RATHER THAN VANISHES.** A body item that is neither
   a string nor a `{pre}` is stringified into an ordinary paragraph, so a typo in
   the key shows on the page instead of deleting a sentence.

**MEASURED AT BOTH WIDTHS.** Desktop: box 1130.3px, scrollWidth 1130 — no
overflow. **390px: box 283.7px, content 437px, so the listing scrolls inside
itself and `documentElement.scrollWidth === clientWidth === 390` — the page does
not scroll sideways.** A phone reader sees about two thirds of the tree and drags
for the rest; the only way to remove that is to narrow his indentation, which is
editing his text.

**`OTHER`, AND ITS PLACEMENT IS OPS'.** After the DETAILED REPORT and before the
addenda, because an addendum is an appendix and `OTHER` is part of the report.
004 RAISES Req 0628 and 005 APPROVES it. **The RAISED wording is Ops' proposal
and is filed HOUSE, not MIKE** — his to change. The APPROVED line is his.

**005's two new lines are what the drum shows, counted:** eight positions, two
that arm, six that report no signal; the picture is channel 4 and the machine is
channel 3.

---

## 6 — THREAD-003

`docs/THREADS.md`, **LOOSE**, noted 2026-08-20, with his words in a blockquote
and the closing quote attributed: *"The story is over, but the seed exists to
grow another egg, chapter, etc."*

**IT IS ALREADY HALF-PUBLISHED**, which is the thing to notice: Record 004 prints
*"Quality has declared it unsafe to run in any sandbox; permanently
quarantined"* and both entries print *"No net increase in head count."* **A
reader has every visible piece and none of the meaning.** It is not waiting to be
introduced — it is waiting to be paid off.

**The 2026-08-17 "two threads, and only two" line is scoped rather than
rewritten**: it is a finding about that search, not a running total.

---

## 7 — THE REGISTER, AND ONE ROW THAT WAS NOT MINE

**8 rows added, 7 pruned, 0 surviving rows changed, 0 broken RESTATED chains**
(checked before and after the prune). The seven pruned are `STANDARD`, `DETAIL`,
`OPEN THE PORTAL`, `Portal Feed Controller`, 004's old detailed report, and the
two attachment titles struck last round.

**`assets:scan` SWEPT IN A FILE THAT IS NOT MINE AND NOT COMMITTED** —
`_incoming/PANEL_MOD.jpg`, dropped at 09:10 today. Untracked, so **a row for it
would be born an orphan**: the M9 class this repo's own `SKIP_PATH` note
describes. The row was removed. **`_incoming/` is a SKIP_PATH candidate and is
Mike's call, not a thing this round changes.**

One surviving row was re-derived by the scan and kept: `portal-cover.png` gained
`src/worker.js` in its `usedBy`. Nothing in this round touched the worker; the
scan simply found a reference an earlier scan had not.

**Row count 459 → 460**, and `docs:numbers` failed until `OPERATIONS.md` and
`CLAUDE.md` were corrected — the tripwire doing exactly what it is for.

---

## GATES

lint **9/8 = baseline** · build green · **launch build green** · provenance
**PASS** · `reveal:check` **PASS** · `parity:gate` **PASS** · `instory:gate`
**PASS** · `docs:numbers` **PASS** · `reveal:day` **nothing to move** (151
governed, 144 behind the door) · `assets:orphans` **13, unchanged**.

Canon HTML regenerated with `npm run desk`. `tools/viiip_twin.html` in the robots
repo is byte-identical to the museum copy.

---

## 8 — THE THREE FLAGS, RULED THE SAME DAY

> **THE FIRST OF THE THREE WAS REVERSED WITHIN THE HOUR — SEE §9.** Record
> 005's ADDENDUM 01 is struck entire, and the `{ pre }` case it added with it.

**RECORD 005's ADDENDUM 01 TAKES `{ pre }`.** MIKE: *"It says 'as printed'.
Printed means aligned. Collapsed it is a list; aligned it is a page from a
manual, which is what a visitor must recognise when they meet the same four
names on the panel."* **The string is unchanged to the character** — only its
wrapper — and it is the second and last opt-in. Measured: `white-space: pre`,
and at **390px the table FITS** (box 283.7px, content 284px, no scroll, page
does not overflow), unlike the folder tree at 437px which drags.

**`monitor_base.png` STAYS GONE.** *"Nothing loads it after the tier-0 fix and
it was the flattened composite the build already discards. Not a picture worth
keeping."* Its orphan row stands where he can see it.

**`_incoming/` IS ON `SKIP_PATH`** (`tools/asset-table.mjs`), beside
`docs/shorts/out` and the handwriting probe, with the reason on the entry: a
staging directory is not a holding, and a row minted from one is born an orphan
the moment the file moves on. **Proved by the scan that would otherwise have
re-added it** — a fresh `assets:scan` now adds the bezel and nothing else, and
the table holds at 460.


---

## 9 — RULED AGAIN, THE SAME DAY: THE RECORD EDITS

### 004

**`OTHER` IS STRUCK, AND THE CORRECTION IS THE ENTRY.** MIKE: *"NOW I SEE WHAT
YOU DID, YOU ADDED A THUR."* He proposed the requisition RAISED Thursday and
APPROVED Friday **as a sequence a reader could follow**; Ops put a Thursday
section into the Record on the strength of that and called it a proposal. **A
proposal about wording is not a ruling that a section exists.** The requisition
lives in 005 only, and the careful paragraph §5 spends on where `OTHER` belongs
was reasoning about a section that should not have been there.

**`ADDENDUM 01 - Bench Description` STRUCK ENTIRE**, both paragraphs, including
`! Nothing here postdates 1969. Everything here works.` Its subject is not lost
— the far end's console is described in `docs/canon/06-PORTAL.md`, which is
where a fact lives when the Record is not saying it.

**Deck line 2** — `> /Robots data analysis` → `> /Robots ZIP File Cracked`.

### THE TREE'S FONT — THE OBVIOUS ANSWER WAS WRONG, MEASURED

MIKE: *"This is the wrong font. This is not a paste in."* It must keep its
ALIGNMENT and lose the distinct face.

**A `<pre>` WITH THE FAMILY INHERITED DOES NOT WORK, AND THE NUMBERS ARE THE
WHOLE ARGUMENT.** Second-column x-positions of the five rows, measured on the
built page:

| mechanism | column 2 lands at | spread |
|---|---|---:|
| `<pre>`, Courier (first cut) | 783.74 ×5 | **0** |
| `<pre>`, `font-family: inherit` (Arial) | 739.24 / 650.76 / 713.89 / 709.57 / 696.26 | **88.48px** |
| **derived column grid, Arial** | 799.80 ×5 | **0** |

Space-alignment is an artefact of a **uniform advance width**. Arial's space is
narrower than its letters, so the padding a writer typed in a monospaced editor
stops measuring anything the moment the face changes. **Asking for both the
alignment and the Record's own type means the columns cannot come from the
spaces.**

**SO THEY ARE DERIVED FROM HIS TEXT AND HELD BY A GRID** (`Listing` in
`RecordEntry.jsx`, `.vp-rec-list` in `Exhibit.css`). The split is deterministic:
a field ends at a run of **two or more** spaces, so the single space inside
`Folder: PORTAL/` and `one form, filled in by hand` is text and never a break.
The value column is the **rightmost field start** in the block; a line with no
field there is a heading and spans — which is how `Folder: PORTAL/` stays a
heading and `PORTAL.CFG` stays a value with no name of its own. Leading indents
cross as a **number** and the `ch` unit lives in the stylesheet.

**Verified: same family and same size as `.vp-rec-sect-body`, spread 0, and the
page does not scroll sideways at either width.** At 390px the block is 349px
inside a 283.7px measure and scrolls **inside itself** — the house rule for a
wide block; `minmax(0,1fr)` was tried first and does not help, because the floor
is the indent plus the longest name plus the longest unbreakable word.

### THE VID-LINK LINE — HIS REWRITE LANDED, AND IT IS STILL THREE LINES

His shortened sentence is in. **It does not fit one line and the counts are his
to act on, not Ops':**

| line | chars | one line at desktop? |
|---|---:|---|
| `> It appears to be an unattended remote access terminal.` | 56 | **yes** |
| `> The Manual's bi-directional CNC Vid-Link …` | **187** | **no — 96 over** |
| `> Documentation looks proprietary…` | 70 | **yes** |
| `> NOTE: Quality has declared it unsafe…` | **86** | **no** |

The measure is `max-width: 68ch` = **727.96px** at 19.25px body; **91
characters** of that sentence fit before it turns. **The NOTE line is over too**
at 86 — he did not name it, and it is the other line in the same section that is
not one line.

**AND "ONE LINE" CAN ONLY MEAN DESKTOP.** At 390px the measure is 283.7px and
**40** characters fit; the section's *shortest* line is 56. Nothing in the
Record is one line on a phone.

### 005

Deck and EXECUTIVE SUMMARY **reordered** — Portal first, ZIP second, same
sentences. DETAILED REPORT replaced by its first line. **`ADDENDUM 01 - The Four
Settings, as printed` struck entire**, both closing lines with it.

**THE FOUR SETTINGS ARE STILL PUBLISHED** — Wednesday's marked manual page
carries them in pen, delivered by Record 003. 005 no longer repeats what the
museum has already shown, which is ruling 10 holding rather than being spent
twice.

**HIS DETAILED REPORT LINE ARRIVED CARRYING `{Mike to rewrite}` AND OPS STRIPPED
THE BRACES.** That is the only reason 005 can land: a curly brace is a note to
Ops, and `wb-ops-braces` refuses any that survive a launch build. **Flagged, not
acted on** — whether he rewrites the line before 17:00 on the 21st is his, and
nothing here guesses at what it would say. Verified on the built page: **no
brace anywhere in the rendered Record.**

### THE REGISTER

**5 added, 13 pruned, 0 surviving rows changed, 0 broken RESTATED chains.** The
thirteen are exactly the struck strings: both addenda and their closing lines,
004's `RAISED` row, 005's old deck, summary and detailed report, the four
settings, and the `Currently, the system` lines that landed earlier the same day.

### GATES

lint **9/8 = baseline** · build green · **launch build green** · provenance
**PASS** · `reveal:check` **PASS** · `parity:gate` **PASS** · `instory:gate`
**PASS** · `docs:numbers` **PASS** · `reveal:day` **nothing to move** ·
`assets:orphans` **13, unchanged**.

---

## 10 — COCONUTS GAINS A VIDEO (/wb)

> **SUPERSEDED IN PART BY §11.** The id changed, the video is 16:9, the
> pillarbox ruling and the backlog row it opened are both closed, and focus now
> cues. The label, the select findings and the hit-area numbers all stand.

### The label — the museum had already answered it

`type: "official"`, `label: "Official Music Video"`. `tidyDesc()` maps that
string explicitly to **OFFICIAL VIDEO**, which is what /hr's eleven video rows
read. **No new word.** MediaVault's `kind` vocabulary is a different axis and
was deliberately not used: `release`/"Music" classifies an ARTIFACT for the
deck's pill columns and is defined as *containing* "a track, single, album, or
official music video" — it contains this thing, it does not name it.

### The select is back, and the invariant holds by construction

**Measured on the page.** Coconuts: `display:flex`, no `data-single`, no static
label, two options — `OFFICIAL VIDEO` / `FIRST PASS`. The other five:
`display:none`, `data-single="1"`, static `FIRST PASS`, one option. Label and
control cannot both draw because one expression (`videos.length < 2`) drives
both, inverted.

**THE HIT TEST, with the corrected predicate** (`hit === control ||
control.contains(hit)` — not `hit.contains(control)`, which passes everywhere):

| row | wrap box | points | reached | dead |
|---|---|---:|---:|---:|
| Coconuts | 111.5 × 12 | 392 | **392** | **0** |
| the other five | 0 × 0 | 0 | 0 | 0 |

**Zero hit area on the five single-version rows**, which is the 16 August ruling
still holding. This is the first time the control has drawn with real options
anywhere in the museum — checked structurally across all three public spines
(`weird-baby.js` 8 video arrays, `foundation.js` 9, `worth-a-listen.js` 6):
**no track had two renditions before today.**

**ONE MEASUREMENT WORTH KEEPING AND NOT ACTING ON.** The `<select>`'s own box is
30px tall — the 9px invisible padding with a cancelling negative margin — but
scanning `elementFromPoint` down its centre line, **only 18 of those 30 rows
reach the control** (y 284…301 of 279…309). The top 5px and bottom 8px are
covered by the row. The enlarged target is real and is smaller than declared.
Pre-existing CSS, untouched here.

### The embed — nocookie, confirmed on the wire

**Only the id crosses.** He supplied a `/shorts/` URL; the museum never writes
an embed URL. `useYTPlayer` builds the player with
`host: "https://www.youtube-nocookie.com"` and calls `loadVideoById(ytId)`.
**Measured with the player up: one iframe, host `www.youtube-nocookie.com`, and
no `www.youtube.com` embed.**

### The vertical short — SHIPPED PILLARBOXED, AND THE PICTURE BAND IS NOT MEASURED

Ruled 2026-08-20: ship it, do not build the per-video ratio.

**What is measured:** `.vp-area` 1443.8 × 813 (ratio **1.776**), `.vp-inner`
1441.8 × 811, iframe 1441.8 × 811 — the iframe fills the box exactly, and
`object-fit` is `fill` on an element that has no intrinsic size, so **nothing in
the museum crops or stretches it.** The fit is YouTube's own player.

**WHAT IS NOT MEASURED, STATED PLAINLY: the picture band.** The player loaded,
showed its chrome and a 1:52 duration, and **sat at 0:00 with the spinner for
~20 seconds without ever rendering a frame** in this browser. So the black area
in the screenshots is a buffering player, not a pillarbox.

**THE "ROUGHLY A THIRD" FIGURE OPS GAVE MIKE IS A PREDICTION AND WAS NEVER A
MEASUREMENT.** It is arithmetic conditional on a 9:16 source: 811 × 9/16 =
456.2px of 1441.8 = **31.6%**. **The source aspect is also unconfirmed** —
`oardefault.jpg` (YouTube's original-aspect thumbnail) **404s** for this id, and
`maxresdefault`/`hq720` are 1280×720, which every video gets regardless of
shape. The `/shorts/` URL implies portrait; a 1:52 runtime is longer than a
classic Short. **Mike should look at it on his own machine before ruling.**

### Rows

- `provenance/assets.json` — **none.** It governs images the museum serves.
- `reveal/ledger.json` — **none.** 174 rows, zero YouTube.
- `provenance/register.json` — **two rows, and the earlier report said one.**
  **The correction matters:** the id was expected to drop out under `SLUG_KEYS`,
  which contains `ytId` — but `SHAPE_SLUG` requires **lowercase**, and
  `Z2T7VwXppQo` has capitals, so it stays on the boundary. Filed **VERIFIED**,
  matching the 49 existing ytId rows, and **actually verified**: YouTube's
  oEmbed returns title *"2026 08 17 Coconuts (Chords and Lyrics in Comments)
  #music #weird.baby"*, channel **Mike Lang / @PapaWeirdBaby** — the house's own
  channel. The label row is **HOUSE** on his ruling.
  **2 added, 0 pruned, 0 surviving rows changed, 0 broken chains.**

### Backlog

**A per-video aspect ratio** — `docs/BACKLOG.md`, IN PASSING, no row. `16/9` is
a constant in three places (the `aspect-ratio` rule, the fit that computes
`--fit-area-max`, the width-drag handler that preserves aspect), so it means a
field on the video row threaded to `.vp-area` with the fit and the drag reading
it. **About a round**, touching the handler already re-fixed twice (V2a, then W).


---

## 11 — THE ID SWAP, AND FOCUS CUES THE VIDEO

### The id, and the check that had to be run twice

`Z2T7VwXppQo` -> **`c1vODrVXOg0`**.

**It was refused once before it was written.** On its first probe the new id
answered oEmbed with **403 Forbidden**, three thumbnail sizes with **404**, and
its own watch page with `playabilityStatus: LOGIN_REQUIRED`, reason **"Private
video"**. It was not written, and the museum did not ship a row whose control
could not start.

**THE CONTROL IS THE PART WORTH KEEPING.** A 403 could have been the network,
the endpoint, or a rate limit — so the previous id and a known-public id were
probed **in the same run** and both returned 200. That is what made "the video
is private" a finding rather than a guess.

Re-probed after Mike made it public, at write time:

| probe | result |
|---|---|
| oEmbed | **200** — *"Coconuts - Weird.Baby (chords & lyrics in comments)"*, **Mike Lang / @PapaWeirdBaby** |
| watch page | `playabilityStatus: OK`, `playableInEmbed: true`, `isPrivate: false`, `isUnlisted: false` |
| source dimensions | **1920x1080** |

**Public, not unlisted.** Everything else about the rendition is unchanged: first
option, `type: "official"`, `label: "Official Music Video"`, the row reads
**OFFICIAL VIDEO**.

### The aspect — the backlog row is closed

The source is **1920x1080** and the box measures **1279.3 x 719.6, ratio
1.778** — 16:9 against 16:9, and nothing in the museum crops or stretches an
iframe. **It fills the box; the per-video ratio row is closed.**

**WHAT IS OBSERVED AND WHAT IS DERIVED, KEPT APART.** The source dimensions and
the box are both measured. **The rendered picture band is not** — the video
buffers indefinitely in this browser and never paints a frame, exactly as the
previous id did. Two 16:9 numbers and a renderer that does not reshape are
enough to close the row; a pixel reading of the frame is not available here.

### Focus cues the video — ruling A, path 1 only

`cueVideoById`, YouTube's own paired method. **No autoplay flag, no muted start,
no play-then-pause** — every one of those makes sound or motion for a frame,
which is why he chose A over B.

**ONE DEFECT THE WRITING FOUND, ON A PATH NOBODY WOULD HAVE TESTED.**
`pendingRef` held a bare id and `onReady` always **loaded** it, which plays. A
cue arriving before the player was ready would therefore have **started playing
the moment it became ready** — the exact autoplay the ruling forbids. It carries
`{id, cue}` now and the verb survives the wait.

**AND THE FIRST CUT MOVED THE LINT BASELINE FOR A COPY-PASTE.** `cueVideo`
written out beside `loadVideo` produced a **second** copy of the hook's existing
`initPlayer` exhaustive-deps warning — 9/8 became 9/9, a new warning for no new
behaviour. They are one body and a verb now: `requestVideo(ytId, cue)` carries
the existing debt, two named verbs sit over it, **and the baseline is 9/8
again.**

**THE INTERRUPTION GUARD, WHICH THE RULING NEEDED AND DID NOT NAME.** There is
one player instance, so cueing while a video plays would replace what is
playing — V3's interruption arriving through V3's own gate. Focus does nothing
to the player while a video runs. **Measured: a video playing, five other rows
focused in turn, the playing row never changed and no second iframe appeared.**

**Audio untouched** and **arrival un-cued**, both as ruled. The arrival
asymmetry is recorded in the code beside the change, with H4's reasoning
attached, so a later round does not "fix" it into a fetch on every page load in
every wing.

### Verified on the page

| check | result |
|---|---|
| fresh load, before any click | 1 iframe, `www.youtube-nocookie.com`, **empty embed**; 3 requests (API, widget, embed); no mp3 |
| first click on Coconuts | focus set, **nothing plays** — no player bar, no audio element, no motion |
| the cue itself | the iframe shows a **cued player**: play button, black ground, no progress, no sound |
| second click | **plays** — `.tl-playing` on Coconuts, poster gone |
| all six rows, one click each, fresh load | **1 iframe throughout, 0 audio elements, 0 mp3 fetches, nothing ever plays** |

**TWO PROBES OF MINE WERE BLIND AND SAID SO BEFORE THEY SAID ANYTHING ELSE.**
The iframe's `src` does not change on a cue (the API talks to the loaded embed
by postMessage) and the parent document's `performance` entries cannot see
fetches made **inside** a cross-origin iframe. Both read "nothing happened" when
the cue had in fact fired. Lifting the `.vp-thumb` overlay and looking is what
settled it. **Suspect the probe before the site.**

### One thing Mike should know, not a defect

**On /wb the visitor does not see the video's poster frame.** `.vp-thumb` draws
the **album cover** over the player whenever nothing is playing, because only
`/wal` declares `thumbFromVideo: true`. So the cue is **invisible on this wing**
and what it buys is that the second click starts instantly. Whether /wb should
show the video's own frame instead of the album cover is a ruling, not a bug,
and nothing here changed the draw path.

### Rows and gates

Register: **1 added** (`c1vODrVXOg0`, VERIFIED, oEmbed-checked), **1 pruned**
(the old id), **0 surviving rows changed, 0 broken chains**. No `assets.json`
row, no ledger row.

lint **9/8 = baseline** · build green · **launch build green** · provenance
**PASS** · `reveal:check` **PASS** · `parity:gate` **PASS** · `instory:gate`
**PASS** · `docs:numbers` **PASS** · `reveal:day` **nothing to move** ·
`assets:orphans` **13, unchanged**.
