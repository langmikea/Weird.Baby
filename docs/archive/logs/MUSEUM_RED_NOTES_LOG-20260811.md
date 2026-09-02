# THE RED NOTES, AND THE LINES THAT ARE NOT TRUE (A · B · C)
2026-08-11 · write packet · not committed, not pushed, not deployed
HEAD at start: `ff0b45f`, working tree clean.

> **MIKE: "EVERYWHERE: Delete the comment boxes (red). Get rid of all of the red
> notes — all are stale and not useful."**

---

## A. THE RED NOTES ARE GONE

### A1 — every place they rendered, before

| what | file : line | seen on |
|---|---|---|
| the box, wing faces | `src/routes/exhibit/Exhibit.jsx:5134` | /robots · /wb · /wal · /foundation · /hr, on any face carrying a marker |
| the lift that filled it | `src/routes/exhibit/Exhibit.jsx:138` (`withOpsNotes`) + two call sites at 3474/3475 | — |
| the box, Information Booth | `src/routes/InfoBooth.jsx:430` | /booth |
| its lift | `src/routes/InfoBooth.jsx:360` | — |
| the heading string | `src/lib/visitor-prose.js:115` (`OPS_NOTES_HEAD` = "Not part of the UX · notes to Mike") | both |
| the lift functions | `src/lib/visitor-prose.js:131` (`opsSentences`), `:144` (`opsNotesOf`) | — |
| the four style rules | `src/index.css:62–83` | both |
| **the grey twin** | `src/routes/exhibit/Exhibit.jsx:5125` (`face.papa` → `.vp-face-papa`) | the mainframe wall, the portable wall, the Portal panel |

**The grey one was not in the ruling and went anyway, and the reason is that it
was the same object.** `face.papa` drew a muted Courier line under a face; every
`papa` field in the museum held exactly one `[PAPA]` sentence and nothing else,
so striking the notes emptied all three. A renderer for a field no face declares
is what Doctrine 16 is about.

**Seen before deleting, at 1280px on /booth:** one box, dashed scarlet border
(`rgb(210, 28, 28)`), heading `NOT PART OF THE UX · NOTES TO MIKE`, four notes,
sitting below `BACK TO THE LOBBY`. Capture `01`.

### A2 — the thirty-two notes, verbatim, on the record

**src/data/artists/foundation.js (12)**
1. `[PAPA] — the amounts on the four unpublished lines, and whether each is published at all.`
2. `[PAPA] — the two named lines Mike supplied are held until the people named have agreed to be named.`
3. `[PAPA] — whether Weird.Baby is ever formally incorporated, and as what, is Papa's call and is not settled.`
4. `[PAPA] — the part about the keeper and his own household already having enough is Papa's own and is still to come.`
5. `[PAPA] — the named organisations, the named people, and whether either list is ever published, are Papa's to state.`
6. `[PAPA] — the live costs, their numbers and their sponsors are Papa's to publish when the meters go up.`
7. `[PAPA] — the address that door points at.` *(on "Can I donate?")*
8. `[PAPA] — the address that door points at.` *(on "Can I send you something?")*
9. `[PAPA] — what the house does with anything its own shelf earns is Papa's to state.`
10. `[PAPA] — his raw material, held for his voice: the Illionaires.`
11. `[PAPA] — being remembered for the size of the pile is a strange thing to spend a life earning.`
12. `[PAPA] — we would rather make more pie than fight over the last piece.`

**src/data/artists/robots.js (3)**
13. `[PAPA] — the cabinet is shown whole now and the robot is not, how much further that goes and when, and that the uncropped originals are all on file and any of them can be published from this file alone.`
14. `[PAPA] — the artifact slot is Mike's to name, and the unit's own particulars: what an ABEAL spec sheet for this machine says.`
15. `[PAPA] — the caption wording, and whether any photograph earns a face of its own.`

**src/data/artists/weird-baby.js (5)**
16. `[PAPA] — where Weird.Baby is from.`
17. `[PAPA] — what the recordings sound like, in his words.`
18. `[PAPA] — one thing he has said about the music.`
19. `[PAPA] — one track to play first, and why that one.`
20. `[PAPA] — what he is working on.`

**src/data/artists/worth-a-listen.js (7)**
21. `Title flagged, not corrected in silence — [PAPA] confirms.`
22. `[PAPA] — the card copy and the two answers.`
23.–26. `[PAPA] — one sentence on why Mike picked this artist.` *(four times: Carsie Blanton, Jesse Welles, Mikey Mike, and the fourth act)*
27. `[PAPA] — the promotional copy, the running order and the four house accents.`

**src/data/house-copy.js (2)**
28. `[PAPA] — the formal statement of that relationship, if one is ever needed, is Papa's to write.`
29. `[PAPA] — a plain licence for the museum's own images is Papa's to set.`

**src/data/artists/portal.js (1)**
30. `[PAPA] — the engraved legends: plate wording, switch names, and what the panel says when it refuses to arm.`

**src/routes/InfoBooth.jsx (2)**
31. `[PAPA] — whether the museum ever takes submissions, and on what terms, is Papa's call and is not settled.`
32. `[PAPA] — how often new work lands, and whether that is a promise, is Papa's to say.`

### A3 — how each one was cut

Two shapes, and they were not treated the same way.

**A note appended to real copy** — the sentence went, the copy stayed, character
for character. That is `visitorProse`'s own rule (cut by SENTENCE, never by
field), applied to the source permanently instead of at the render seam. Nine
answers on /foundation, /booth and in `house-copy.js` are in this class.

**A field that was ENTIRELY a note** — the field went with it, and in every case
**nothing changed on the glass, measured rather than hoped:**

- `/wb`'s five profile rows (*Where he is from*, *What he sounds like*, *In his
  own words*, *Start with*, *What he is doing now*) — `scrubFace` already
  filtered that list on `kept(label) && kept(body)`, so a row whose whole body
  was a marker had never drawn, in either stage. One row remains, the one this
  repository can actually fill.
- `/wal`'s four `pick:` slots and its two `papa` fields.
- The three `papa` fields on /robots and the Portal.
- `/foundation`'s **"What do you think about billionaires?"** — every sentence
  of its answer was a marker, so `visitorProse` returned an empty string and the
  `kept` filter has always dropped the whole question. His three ideas are
  printed at items 10–12 above, which is where a deleted thing is named exactly
  once (Doctrine 24).

### A4 — the launch plugin now has nothing to strip

`wb-ops-notes` (vite.config.js:142) removes `[PAPA]` sentences from the SOURCE
at launch. Measured after this round: **zero `[PAPA]` in any string literal under
`src/`**, so the pass returns `null` on every file and strips nothing.

**RECOMMENDATION: KEEP IT, and the decision is Mike's.**
- **37 `[PAPA]` comment blocks remain** in `src/`, and a comment is one edit from
  being a string. The moment one is, the plugin is what stops the MATERIAL
  shipping — the runtime scrub only stops the RENDER, which is the distinction
  that cost R5 (153 vault mp3 URLs), H1 (the whole reveal ledger) and V1 (the
  addresses of twenty-six withheld photographs).
- It costs one regex test per file and returns immediately.
- **What is true and should be said: it is now untested.** Nothing exercises it,
  so a future refactor could break it silently. If it stays it wants a fixture.

The launch bundle carries exactly **one** occurrence of the string, and it is
`PAPA_MARK` itself — the rule that removes them, which cannot remove itself.

### A5 — every `[PAPA]` marker left in `src/`

**Zero in string literals. 37 in comments, which never render:**

| file | comment blocks |
|---|---|
| `src/routes/exhibit/Exhibit.jsx` | 5 |
| `src/data/artists/robots.js` | 9 |
| `src/data/artists/foundation.js` | 8 |
| `src/lib/visitor-prose.js` | 6 |
| `src/routes/InfoBooth.jsx` | 3 |
| `src/data/artists/weird-baby.js` | 3 |
| `src/data/artists/worth-a-listen.js` | 2 |
| `src/data/house-copy.js` | 1 |

**Not deleted, per the packet.** They are the reasoning beside the code — why a
slot was left open, which ruling emptied it, what the scrubber is for. Five of
the 37 are notes this round wrote explaining the deletion.

---

## B. THE SIX LINES

### B1 — "Follow us on social media" — **REPORT ONLY**

**Where:** `src/data/artists/robots.js:554`, the FAQ answer to **"Can I buy
one?"**, on /robots. In full:

> "Monitor the website for availability. Follow us on social media."

**The museum holds no handle on any platform.** The file says so itself three
lines above, in a comment: *"names a Weird.Baby account on any platform, so the
sentence is his instruction and the address is his to supply. It is not invented
here and it is not quietly dropped either — M60."* So this is a KNOWN open item
with a register row, not a new discovery — and it is still on the glass.

**Ops cannot invent a handle and will not silently cut his sentence. The
options, for Mike:**
1. **Supply the handle(s)** — the sentence becomes true and gains a door.
2. **Strike the second sentence**, keep "Monitor the website for availability."
   The answer still answers the question. This is what USE_RIGHTS got on
   2026-08-11 when its address clause went.
3. **Leave it**, as a standing intention, knowing it is untrue today.

### B2 — the archive frame dates

**The nine that are not dates — FIXED.** They printed a slot label in
`.vp-collage-date`, the Courier-Prime letter-spaced line the museum uses for a
provenance stamp. `FRONT` set in that face does not read as a label; it reads as
a date that will not parse.

| tile | printed where a date goes | its caption, one line below |
|---|---|---|
| MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png | `FAMILY SHOT` | "The pair, front and top, as received" |
| front_full.png | `FRONT` | "The front, whole" |
| rear_power_switch.png | `REAR` | "The power switch, round the back" |
| front_screen.png | `SCREEN` | "The front glass, lit" |
| MGK-TWIN_MONITOR_SCREEN_BEZEL.png | `BEZEL` | "The bezel around the glass" |
| viiip-v2.png | `COVER` | "The cover image — the glass carries the BIOS beat" |
| top_monitor.png | `TOP` | "The top monitor" |
| monitor_base.png | `BASE` | "The base it stands on" |
| unit_new_base.png | `BASE, NEW` | "The unit on its new base" |

**The field is deleted, not corrected, and nothing is lost:** every one of the
nine already said the same thing in words directly underneath it. The caption
strip is conditional on there being something to print (A7), so the line simply
does not draw. 18 occurrences removed — nine tiles, each listed twice (its own
group and "Every photograph"). If a real capture date is ever known, `date` is
where it goes.

**The five MAR 2021 — REPORT ONLY.** `cabinet_whole.jpg`, `core_helical.jpg`,
`column_lit.jpg`, `output_row.jpg`, `core_meltdown.jpg`, on the mainframe's wall,
each `date: "MAR 2021"` (ten occurrences across four groups). These ARE dates,
so it is not a field misuse — it is a question about the story, whose Record
begins 2026-08-17. Mike's.

### B3 — front_screen.png — **FIXED, AND THE RULING'S OPERATION WAS THE WRONG ONE**

**The ruling said one horizontal flip. A horizontal flip does not fix it, and I
looked before believing it.** Applied first, exactly as instructed: the glass
came back with the words in the right ORDER and every glyph vertically inverted
— still unreadable. The file is **rotated 180°**, not mirrored. The asset table's
own diagnosis ("MIRROR-REVERSED … so the fix is a horizontal flip of the file")
was wrong, and the ruling was made from it.

**So the correction applied is a 180° rotation**, which is the one operation that
achieves what the ruling was for. Both renders are in the delivery folder;
if Mike wants the literal horizontal flip instead, it is one line.

| | sha256 | bytes |
|---|---|---|
| before | `a0800856de098168f1eb0f5d12d2cc3343019c9df640b61e0cc27cf175fe9727` | 1,476,381 |
| after | `3a6cb1b0f338374eb0c9983517ca400178ad6ffe9537a5f6659738d22af9db2a` | 1,297,574 |

2048×1536 RGBA, unchanged. It now reads `-(A)BEAL MGK-VIIIp )- / Please Select: /
MGK-VIIIp`, and the engraved lettering at the top of the frame reads the right
way up.

**The asset table was edited BY HAND for one row, and that is a finding.**
`npm run assets:scan` rewrote **249 rows** — it scans the robots repo too, and
that repo is mid-way through an unfinished 255MB manual rebuild the standing
brief says not to touch. The scan was reverted and the four fields of the one
museum row were edited directly: `sha256`, `bytes`, `quality` (`wrong` → `ok`)
and `qualityNote`. **No judged field was touched** — `verdict` and `bucket` are
`null` before and after. The robots-repo source row (`A-07ed830867`) still holds
the old hash and was deliberately left alone.

### B4 — the empty wells — **REPORT ONLY**

**One nameplate exists in the museum**, on the Portal's instrument panel
(`src/data/artists/portal.js:231`, drawn by `Exhibit.jsx:1442`). It carries
three struck fields:

| field | value |
|---|---|
| `MODEL NO.` | `TYPE 8p` |
| `SER. NO.` | **empty** |
| `DATE` | **empty** |

**What an empty well looks like today:** `.ip-np-v` is `display: block; min-width:
6ch; min-height: 1.15em` in a lighter recess with the "hand" transform on it
(`rotate(-.8deg) translateY(.5px)`). So the field keeps its height and its width
and holds nothing — a stamped-in-place well with nothing struck into it, which
is what an unstamped plate looks like. It is deliberate and documented as
Doctrine 12: Ops may not mint a serial or a date.

**Ops may not fill them, and this is Mike's** (`OPEN_ACTIONS` P-a). One value each.

**Stated plainly: I could not photograph it.** The Portal album is a dynamic
import held behind the stage door and it did not load in the lap rig, so this is
read off the data and the stylesheet rather than off the glass.

### B5 — three plates that are not what their captions say — **REPORT ONLY**

All three are on /robots, the portable's IMAGE ARCHIVE. Captures 05–07.

| file | its caption | what the image actually shows |
|---|---|---|
| `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` | "The bezel around the glass" | **A compositing asset.** A black CRT/monitor frame graphic on transparency with a plain WHITE RECTANGLE punched out of the middle where a picture is meant to be dropped. Not the unit's bezel, and not a photograph of anything. |
| `monitor_base.png` | "The base it stands on" | **There is no base in the picture.** It is the family shot — the MGK-VIIIp front and the viewfinder assembly — dropped INSIDE the frame graphic above. Two subjects in a monitor. |
| `unit_new_base.png` | "The unit on its new base" | **Again no base.** The same two subjects on plain white, with the lens port and the viewfinder window MASKED OUT to blank white shapes: a masking intermediate from the compositing job. |

Two of the three are compositing assets; the third is a composite built from the
first. All three sit on a wall whose tombstone calls them plates of the machine.

### B6 — sentences pointing at something that no longer exists

**USE_RIGHTS is already repaired** (`src/data/house-copy.js:106`). Its clause
*"When in doubt, write; the address is at the bottom of this page"* was struck on
2026-08-11 when the address was deleted sitewide. Nothing to do.

**One live one remains, and it is the same defect USE_RIGHTS had:**
`src/data/artists/foundation.js:724`, the answer to **"Can I send you
something?"** —

> "…None of it exists today, so the honest answer is to write to **the address
> at the bottom of this page** and say what you have."

**There is no address at the bottom of that page, or of any page.** The ruling
that removed it removed every contact route in the building and said "no
replacement". The sentence is untrue as it stands.

**Left standing and reported rather than cut**, because cutting it is the same
content decision USE_RIGHTS got and it is Mike's, not Ops'. Its `[PAPA]` tail
went with the red notes; the sentence above it did not.

**Nothing else found.** The sweep looked for pointers at the deleted address, the
deleted sign-off and the two deleted booth questions.

---

## C. VERIFY AND LOOK

### C1 — provenance, chains checked FIRST

Editing a string breaks its declaration, because a row is keyed on the exact
text. Twelve strings lost their `[PAPA]` tail and went **UNDECLARED**.

**Every one was carried across rather than re-declared:** matched 1:1 to its
predecessor row on file + text prefix, and the predecessor's `c` and `s`/`r`
copied onto the new row. Seven RESTATED→`docs/canonical/THE_CHARTER.md`, one
VERIFIED with its citation, one HOUSE, one MIKE, two RESTATED on the booth.

**The chains, checked before anything was pruned:**

| checked | result |
|---|---|
| inbound `r:` onto the 12 predecessor rows | **1 chained** — the Mikey Mike "Doin' Me" note, with **8** rows resolving to it. Repointed to the new row id, then pruned. |
| inbound `r:` onto the 44 stale rows | **2 chained** — `9fc9ae5a62f96e60` (portal.js, MIKE, ← 4 rows) and `40bf733f0f6cdfb8` (robots.js, MIKE, ← 3 rows). Both were `[PAPA]` rows this round deleted. |

Those seven orphans are Ops prose whose declared origin was a marked slot of
Mike's — four Portal refusal legends, three lines on the firmware face. Their
origin did not become false; it moved. **They now resolve to this round log**,
which is a repo path that exists, is not their own file, and records what
happened to what they rested on.

Then 44 stale rows pruned. Register **2018 → 1974**. Gate **PASS**: 0 undeclared,
0 stale, 0 RESTATED failures.

**A defect of my own, worth keeping.** The first repoint iterated `r` as a list —
and 15 rows carry `r` as a bare STRING, so it split those into single characters
and produced `unresolvable reference "2"`, `"f"`, `"9"`… **467 RESTATED rows
failed at once.** The sweep itself reads `[].concat(row.r || [])` and tolerates
both. It is the same class of bug as the one the previous packet fixed in
`draftEntries` — *a field read by assuming one shape* — committed by the round
that fixed it, one file over. Reverted and redone handling both.

### C2 — gates

| gate | result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings — baseline** |
| `npm run build` | green |
| `npm run build:launch` | green |
| `npm run provenance:gate` | **PASS** |
| `npm run reveal:build` | green |
| `npm run reveal:check` | **PASS** |
| `npm run assets:orphans` | **0 — 0 judged, 0 unjudged** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** |
| `npm run reveal:day` | nothing to move |

Two lint errors appeared mid-round and were cleared: removing the boxes left
`launched` imported and unused in both render seams. Both imports deleted.

### C3 — the lap at 1280px, and what I SAW

Six routes through the same-origin rig at a true 1280 viewport:

| route | red boxes | `[data-not-ux]` | grey `papa` | `[PAPA]` on glass | page overflow | broken images |
|---|---|---|---|---|---|---|
| /booth | 0 | 0 | 0 | 0 | 0 | 0 |
| /foundation | 0 | 0 | 0 | 0 | 0 | 0 |
| /wal | 0 | 0 | 0 | 0 | 0 | 0 |
| /wb | 0 | 0 | 0 | 0 | 0 | 0 |
| /robots | 0 | 0 | 0 | 0 | 0 | 0 |
| /shop | 0 | 0 | 0 | 0 | 0 | 0 |

**Nothing was left hanging.** The empty-container sweep found 1–2 nodes per page
and every one was checked by hand: they are `vr-dh-line` (the 1px splitter rule)
and `pb-art pb-art-ph` (the player bar's art placeholder) — existing furniture,
not a gap where a box used to be.

**On /booth, where the box was:** the question list, the short rule, `BACK TO THE
LOBBY`, and the card ends 52.8px below it, which is the card's own padding. No
orphan rule, no double gap, nothing after the exit. Captures `01` (before) and
`02` (after) are the same page at the same width.

### C4 — delivered

`C:\AI\_manual-samples-20260811\_FOR_CLAUDE\` — seven frames plus `FOLDER_KEY.txt`.

---

## FILES

```
src/routes/exhibit/Exhibit.jsx      the box, withOpsNotes, face.papa, two imports
src/routes/InfoBooth.jsx            the box, the lift, two imports, two notes
src/index.css                       four style rules
src/lib/visitor-prose.js            OPS_NOTES_HEAD, opsSentences, opsNotesOf
src/data/artists/foundation.js      12 notes, one whole question
src/data/artists/robots.js          3 notes · 18 slot labels out of the date field
src/data/artists/weird-baby.js      5 notes, five whole profile rows
src/data/artists/worth-a-listen.js  7 notes, two papa fields
src/data/artists/portal.js          1 note
src/data/house-copy.js              2 notes
provenance/register.json            12 rows re-keyed, 15 chains repaired, 44 pruned
provenance/asset-table.json         one row: sha256, bytes, quality, qualityNote
public/held/robots/reference/photos/front_screen.png   rotated 180°
```

`visitorProse` and `wb-ops-notes` are untouched and stay — see A4.
