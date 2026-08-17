# THE PLAYER — 2026-08-16 (launch eve, second packet)

HEAD `b479069` at open. **Mike has committed and deployed the previous round:**
the live site now serves `tokens-AwoJSPWH.js` and `index-C1q1yc2z.js`, the exact
chunk hashes this tree builds.

---

## JOB 1 — THE ENGINE WAS ALWAYS THERE, AND SO WAS THE WIRING

### THE ANSWER FIRST: NEVER REMOVED, NEVER MISSING. NO GIT ARCHAEOLOGY REQUIRED.

`src/routes/exhibit/Exhibit.jsx`:

```
714   function useAudioPlayer({ onEnded })      the hook — `new Audio()`, preload
                                               "auto", ended → advanceQueue
3227  const audio = useAudioPlayer({ … })       called, once, unconditionally
3529  else if (v?.audioUrl) { yt.pause();       the play effect's audio branch
        audio.loadAudio(v.audioUrl); }
4144  onTogglePlay={isAudioSrc ? audio.…}       the banner transport
5749  onTogglePlay={isAudioSrc ? audio.…}       the player bar
```

Full surface: `loadAudio · pause · togglePlay · toggleMute · setVolume ·
getState`, and an unmount teardown. **It is not a stub and it is not orphaned.**

### FOUR PROBE FAILURES — NOT SITE DEFECTS, AND THEY ARE THE USEFUL PART

**MIKE'S RULING ON HOW THESE ARE FILED: "Ops was wrong about the player and the
four false negatives are the useful part. Record all four in the log as probe
failures, not as site defects."**

Nothing below describes anything wrong with the museum. Each row is a way of
LOOKING that returned a confident wrong answer, and each will do it again on the
next investigation that reaches for it. **They are §8 hazards now**, in
`docs/canonical/OPERATIONS.md`, so the next round meets them before it repeats
them.

| # | the probe | what it returned | why it was wrong |
|---|---|---|---|
| 1 | grep over `index-C1q1yc2z.js` | `new Audio` absent | **the wrong chunk** — that file is the DATA; `Exhibit.jsx` is in `tokens-AwoJSPWH.js` |
| 2 | search for `new Audio(` | no match | **a minified no-arg constructor has no parentheses** — it ships as `new Audio` |
| 3 | `document.querySelectorAll("audio")` | 0 elements | **cannot see a detached element** — `new Audio()` is never appended, and returns 0 whether the player exists or not |
| 4 | `performance.getEntriesByType("resource")` | no mp3 | **media loads do not reliably enter the Resource Timing buffer** — the element was loading at the time |

**AND A FIFTH THAT COST THIS ROUND MORE THAN THE OTHER FOUR:** `document.hidden
=== true`. A hidden tab defers media loading forever, stops synthetic pixel
clicks landing, and kills `requestAnimationFrame` (§8 already carries that
last one). Check it before believing any playback, click or animation reading.

Each in full, with the evidence:

**(1) THE WRONG CHUNK WAS SEARCHED.** The site ships FOUR javascript files.
`index-C1q1yc2z.js` holds the DATA; `Exhibit.jsx` and everything it contains is
in **`tokens-AwoJSPWH.js`**. Measured over the built bundle:

```
index-C1q1yc2z.js    new Audio: 0    audioUrl: 1   (the /wb track data)
tokens-AwoJSPWH.js   new Audio: 1    audioUrl: 1   (the hook)
```

**(2) `new Audio(` WOULD HAVE MISSED IT EVEN IN THE RIGHT CHUNK.** A no-argument
constructor minifies to `new Audio` with no parentheses. The literal bytes on
disk are `let e=new Audio;e.preload=\`auto\``. **A grep with a trailing paren
cannot find a minified no-arg constructor** — the pattern to search is
`new Audio` or `preload`.

**(3) `document.querySelectorAll("audio")` CAN NEVER SEE THIS PLAYER.**
`new Audio()` creates a **detached** element that is never appended to the
document. It is playing and it is not in the DOM. *"No `<audio>` element is ever
created on any page"* is what that query returns whether the player exists or
not — the query cannot answer the question it was asked.

**(4) AND MEDIA LOADS DO NOT SHOW UP IN `performance.getEntriesByType("resource")`
HERE.** With the element loading and `networkState = 2`, the mp3 is absent from
the Resource Timing buffer. **"No network request" measured this way is not
evidence of no network request.**

### WHAT IT ACTUALLY DOES, MEASURED ON THE DEPLOYED SITE

`window.Audio` wrapped to record every construction, then the museum's own
click path exercised on /wb, track 01, the row already focused:

```
Audio instances constructed          1
src        https://weird.baby/audio/wb/06_coconuts_2026-06-17.mp3
paused     false          ← play() was accepted, not rejected
error      null
networkState  2 (NETWORK_LOADING)
row         tl-track tl-active tl-playing
transport   .bt rendered
```

**The engine runs, builds the element, points it at the right file and starts
loading.** The mp3 itself is a real MP3 — `ID3\x03` header, 2,928,534 bytes,
`206`, `audio/mpeg`, and this browser answers `canPlayType("audio/mpeg") →
"probably"`.

### WHAT I COULD NOT CONFIRM, AND WHY IT IS THE ENVIRONMENT AND NOT THE SITE

The element sits at `readyState 0` and never buffers. **`document.hidden ===
true`** on every tab I can open — this Chrome window is not visible to me — and
Chrome defers media loading in hidden tabs.

**PROVED WITH A CONTROL RATHER THAN ASSERTED.** A bare `<audio>` element that I
created by hand in the same tab, pointed at the same URL, with no museum code
involved at all:

```
control      readyState 0 · networkState 2 · buffered none · error null
museum       readyState 0 · networkState 2 · buffered none · error null
```

**Identical.** The stall belongs to the hidden tab. The same hidden-tab state is
why synthetic pixel clicks stopped registering mid-session and why
`requestAnimationFrame` never fires — §8 already carries that hazard row.

**SO THE ONE THING NOT PROVED IS AUDIBLE SOUND, AND IT NEEDS A VISIBLE WINDOW.**

### NOTHING WAS BUILT, BECAUSE NOTHING IS MISSING

Mike's click rule is already implemented and is already his own words, twice
over: `handleTrackSelect`'s `alreadySelected` gate (2026-08-13, generalising
V3) plus `onDoubleClick` on the row. Verified live: **one click on an unfocused
row only focuses it; a second click plays; a double-click plays.**

**EVERY WING THAT DECLARES `audioUrl`** is `/wb` (six tracks,
`public/audio/wb/`) and `/hr` (vault renditions in `hunter_root.json`, behind the
password). One engine serves both; nothing is per-wing.

### THE ONE-OPTION SELECT — FOUND WHILE LOOKING, THEN RULED AND FIXED

**MEASURED ON THE DEPLOYED SITE**, /wb row 01: `.tl-typesel` spanned
**x 154.8–224.8 in a 430px row — 16% of it** — visible, `pointer-events:auto`,
holding exactly **one** option. A click there opened a one-item menu instead of
playing the track.

**MIKE: "Hide it. Ruled. When a track has exactly one version, `.tl-typesel`
must not occupy the row at all — no width, no hit area. Keep the mechanism for
tracks with more than one version, same as the 14 Aug ruling on the chevron.
That ruling hid the arrow and left the hit area; hiding the visible part is not
hiding the control."**

**IT IS ONE PROPERTY ON AN ATTRIBUTE THAT ALREADY EXISTED.**
`.tl-typewrap[data-single]{display:none}` replaces 14 August's arrow suppressor
and cursor override, both of which are **deleted rather than left standing** —
they can no longer fire, and a dead declaration is one the next reader has to
prove harmless. `display:none` is the single property that satisfies both halves
of the ruling: out of layout (no width, and the flex gap collapses with it) and
out of hit-testing (no hit area). The `<select>` and its `onChange` stay in the
component, so "keep the mechanism" is unchanged.

**VERIFIED BY PROBING THE FULL WIDTH OF EVERY ROW**, 41 points per row, /wb on
the built bundle:

```
every row   .tl-typewrap  display:none   ·   select box 0 x 0   ·   still in the DOM
41 of 41 points on all six rows reach  tl-track / tl-num / tl-tt / tl-selwrap
0 points reach tl-typesel or tl-typewrap
```

And **at x = 199 — the exact coordinate that used to open the one-item menu** —
two clicks now produce an `Audio` element on `06_coconuts_2026-06-17.mp3` with
the row `tl-playing` and the transport rendered.

**THE MECHANISM IS PROVED INTACT BY BREAKING IT ON PURPOSE.** Removing
`data-single` from one row live: `display` goes `none -> flex`, the box returns
at **83.8px**, the `▾` renders again, and the point hits `.tl-typesel`. Putting
the attribute back returns it to `none`. **A track that gains a second rendition
gets its control back with no code change.**

**/wal PROBED TOO** — 0 points reach the select on any of its four rows, and the
band/plate fix from the previous packet still measures 238 = 238, 0 offset,
0 dead.

**TWO CONSEQUENCES, NAMED RATHER THAN DISCOVERED LATER.**
1. **The rendition label goes with the control.** The `<select>` was what
   printed `FIRST PASS`, so /wb's six rows no longer carry it. It is not lost
   from the page: the transport prints the rendition type beside the title while
   a track plays (`Coconuts  AUDIO`), and `track.kind` — the row's other
   name-plate — is untouched.
2. **The tracklist got narrower**, because its default width is measured off the
   widest row on arrival: /wb rows **430.3px -> 365.1px**, /wal **296px**. The
   viewer gains what the list gives up.

**NO CUSTOMER-FACING TRACK HAS MORE THAN ONE RENDITION TODAY** — measured across
`/wal` and `/wb` — so the control is hidden everywhere a visitor can currently
reach. `/hr`, behind the password, is where the multi-version case lives.

---

## JOB 2 — ABOUT THE ARTIST ON /wb

His rewrite had been briefed and never sent, so the old copy was live. It is
replaced, and **Ops changed no word of it.**

### WHAT WENT

Named once, here (Doctrine 24), and nowhere else: the grid read `Born 7/3 63`
and `School CB West Doylestown, PA` with `'85` and `'00` on the two Studied
rows; the tiles read *"At least that's the rumor he's spreading."*, *"Steven
Tyler \"handed him\" his personal harmonica"*, *"He hopes that is OK."*, *"(Two
at once?!? He panicked.)"* and *"Learning to play acoustic guitar…"*.

**THE 2026-08-17 PRONOUN PASS WENT WITH THE SENTENCES IT ACTED ON, AND SO DID
ITS NOTE.** Eight substitutions and a cut `"Sorry,"` were recorded in the source
against strings that no longer exist. **A note that outlives its examples is a
tripwire pointing at empty ground** — the same defect this file's own preamble
was corrected for on 17 August. His new copy is third person as he wrote it.

### TWO FLAGS, CARRIED AS TYPED

Ops reports, he rules — the standing loop on this card:

1. **`is earning to play`** reads as `learning`. His own instruction named it.
2. **`Born  |  Born July 3, 1963`** — the value repeats the label, so the grid
   prints the word twice. His two columns as supplied.

`Class of 1981` and the four-digit years are new material; `School` becomes
`High School` because his own value now names the school. The labels are still
Ops', the values still his to the character, and `Studied` still appears twice
for 17 August's reason: two institutions, no degree level stated for either.

### `Melodic-Talker` — MEASURED BROKEN, THEN FIXED WITH ONE CHARACTER

**His instruction is about a result, so the result was measured first.** At
1280px a Range over the word returned **two client rects at different `top`
values** — `Melodic-` on one line, `Talker` on the next. A browser treats
U+002D as a break opportunity and **no CSS property turns that off for one word
inside a paragraph**: `white-space:nowrap` needs an element, and this field
renders as plain text with no markup.

So it is **one character — U+2011 NON-BREAKING HYPHEN**, the code point that
exists for exactly this and draws identically. After, at both widths:

```
1280px   one rect, 132.9px wide, unbroken   ·  blurb 4 lines
 390px   one rect, 127.0px wide, unbroken   ·  blurb 6 lines
```

**AND IT BREAKS `grep`, WHICH IS RECORDED AT THE STRING AND HERE.** Searching
this repository for `Melodic-Talker` with an ordinary hyphen now returns
**nothing**. Search for `Melodic`.

### MACUNGIE PA — PROPOSED, NOT ADDED, WITH THE NUMBERS

He suggested it "to use the space". **The space is real:** at 1280px the name
line uses **396.5px of 525.7 — 129.2px of slack.**

Measured with `(aka Mike Lang, Macungie PA)` spliced in live:

| width | lines before | lines after | name-line slack after | `Melodic‑Talker` |
|---|---:|---:|---:|---|
| 1280px | 4 | **4** | 52.5px | whole |
| 390px | 6 | **6** | 40.5px | whole |

**It costs no extra line at either width.** It is not in the data — his call.
Register row `Q-c`.

### PROVENANCE

Ten strings replaced and one blurb string changed by a character: **11 rows
added to `register.json`, 11 stale rows pruned.** Nine of the eleven are `MIKE`;
`High School` is a `HOUSE` label, like every other label in the grid. **Inbound
chain references into the pruned set were checked before pruning and were
zero** — the §9 prune hazard, which cost a round in August when a `RESTATED`
chain repointed onto the wrong paragraph.


---

## JOB 3 — `FIRST PASS` IS BACK ON THE ROWS, AND IT NO LONGER DEPENDS ON A CONTROL

**MIKE: "Restore FIRST PASS on the rows. It was lost as a side effect, not ruled
away... Print the type on the row independently of the select, so the label does
not depend on a control that may be hidden."**

### THE CAUSE, STATED PLAINLY

**The `<option>` text WAS the label.** A rendition NAME and a variant PICKER
were one element, so hiding the picker on a single-version row took the name
with it. What went was his own 2026-08-13 ruling — `RECORDING - 2026-06` ->
`first pass`, set to match the approved blurb — and Ops removed it as a side
effect of a different fix without noticing it was content.

### A LABEL AND A CONTROL ARE TWO THINGS AND NOW THEY ARE TWO ELEMENTS

A static `<span class="tl-type">` draws exactly when the select does not, off
the same `videos.length` test and the same `tidyDesc()` string — so the row
reads identically either way and **neither can be hidden without the other
appearing.** The look is ONE declaration for both readers
(`.tl-typesel,.tl-type{...}` in Exhibit.css); only the select's own control
properties are added under it. A second copy of that ramp is how two readers
drift into two labels.

**THE SPAN SITS OUTSIDE `.tl-typewrap` ON PURPOSE.** That wrapper stops
propagation so the picker cannot play the track; a LABEL has no reason to eat a
click, so this one is part of the row's hit area — which is the whole of what
the previous fix was for.

### VERIFIED ON THE BUILT BUNDLE

```
/wb, all six rows      label "FIRST PASS" - 69.6px - 0 of 41 points reach the select
click on the LABEL     row 3 -> Audio element on 01_weird_baby_blues_2026-06-17.mp3,
                       tl-playing on row 3, transport up
invariant, every row   exactly ONE of (visible select, static label) is present
/wal, all four rows    no span at all, 0 of 31 points reach the select
```

### THE WIDTH, MEASURED — AND IT DOES NOT ALL COME BACK, WHICH IS RIGHT

`localStorage` was empty for both wings, so these are the fresh measured
defaults and not a stored split:

| /wb row | width |
|---|---:|
| deployed, with the one-option select | **430.3px** |
| select hidden, label gone with it | 365.1px |
| **label restored** | **415.1px** (tracklist 415.9px) |

**The 15.2px it does not get back is the SELECT'S OWN control padding** —
`padding: 9px 14px 9px 0`, the invisible near-miss hit area that existed so a
click just above or below the type would open the dropdown instead of playing.
A label does not want it. **The row is back to its type-bearing width; what is
gone is the part that was a control.**

### AND AN EMPTY TYPE NOW DRAWS NOTHING AT ALL

`tidyDesc()` strips a track's own title off the front of its label, so a
rendition named after its song returns `""` — which is every /wal song row. The
first cut rendered an empty span: invisible, but it still took the flex gap
(**/wal 296.0 -> 296.9px**) and left an empty element for a later round to
explain. It is guarded on the string now: **/wal has no span and no gap.**

### MACUNGIE PA IS NOT ADDED

His ruling: he sees it first. The measurement stands in `Q-c` — it costs no
extra line at 1280px or 390px.

---

## JOB 4 — THE TRANSPORT WAS UNREACHABLE, AND IT IS THE THIRD TIME TODAY

### THE CAUSE IS OURS AND IT IS ONE PROPERTY

`.ex-album-banner` carries a blanket `pointer-events:none` so the travelling
band cannot swallow the page beneath it. **The one `auto` inside that band was
on the title plate** — and the plate was the thing eating scroll-to-top, so
removing it was correct. **Nothing granted the transport, which lives in the
same band, a hit area of its own.** Measured on the live site with a track
playing, the chain read `none` from `.bt` all the way up, and
`elementsFromPoint` at every control's centre returned `ex-root visible`.

**The controls themselves were never broken.** Invoked from code, the toggle set
`paused=true` and flipped its own label, a second press resumed, Stop tore the
bar down. Only the hit-testing was dead.

### THE GRANT IS ON `.bt` AND NOWHERE ELSE

`.ex-banner-console .bt{pointer-events:auto}`. **Not the band and not the aux
track** — everything under either inherits, and the plate defect would come
straight back. `.bt` is the transport's own box, it exists only while something
is playing (`BannerTransport` returns null otherwise), and it is scoped to the
console class so a wing with no transport is untouched.

### PROVED THE WAY THE PLATE WAS PROVED — EVERY CONTROL, ITS FULL BOX

35 points per control (7 × 5 across the bounding box), on the built bundle:

| route | control | box | points reaching the control | reaching anything else |
|---|---|---|---:|---|
| /wb | Stop | 24×24 | **35 / 35** | 0 |
| /wb | Play/Pause | 24×24 | 23 / 35 | 12 → `.bt` |
| /wb | Volume | 74×16 | **35 / 35** | 0 |
| /wal | Stop | 24×24 | **35 / 35** | 0 |
| /wal | Play/Pause | 24×24 | 23 / 35 | 12 → `.bt` |
| /wal | Volume | 74×16 | **35 / 35** | 0 |

**THE TWELVE ARE GEOMETRY, NOT A DEFECT, AND THEY ARE REPORTED RATHER THAN
ROUNDED AWAY.** Stop is `border-radius:3px` and fills its box; play/pause is
`border-radius:50%`, so the corners of its *bounding box* fall outside the drawn
circle. Every point inside the drawn control reaches it, and the twelve that do
not land on **`.bt` — the transport's own group, inside the grant** — not on the
page beneath. Nothing falls through.

The chain, measured after: `.bt` **auto** · aux `none` · band `none` · **plate
`none`**.

### AND THE PLATE FIX STILL HOLDS WITH THE TRANSPORT LIVE

/wal, 1280×420, track playing, page at its foot: plate **238 = 238** room,
centres **0** apart, **0 of 21** points on the plate dead, and a click on the
plate's left edge took the page **552 → 0**.

Functional, through the hit test: a click at the toggle's centre landed **inside
the control** and set `paused: true`; a click on Stop landed inside the control
and the transport left the DOM.

### WHY VISIBLE IS NOT CLICKABLE — THE THIRD TIME TODAY

**Three controls today rendered perfectly and could not be used:** the title
plate (visible, `pointer-events:auto`, no handler — it ATE the click beneath),
the one-option select (visible, 16% of the row, opened a one-item menu instead
of playing), and the transport (visible, wired, `pointer-events:none` all the
way up — the click reached the page behind it).

**PAINT AND HIT-TESTING ARE TWO INDEPENDENT PASSES, AND NOTHING IN A SCREENSHOT
SHOWS THE SECOND ONE.** An element is drawn from its box, its background and its
z-index; it is HIT from `pointer-events`, from the boxes stacked over it, and
from whether anything above stops propagation. A control can be perfectly
painted and perfectly wired and still be unreachable, and it looks correct in
every screenshot, every DOM dump and every `getComputedStyle` on the element
itself — because the fault is usually in an ANCESTOR or in a SIBLING that lands
on top.

**THE PROBE THAT CATCHES IT IS `document.elementFromPoint` / `elementsFromPoint`
ACROSS THE CONTROL'S WHOLE BOX** — never at one point, and never on the element
you are asking about:

```
for every control:
  for a grid of points across its bounding box:
    hit = elementFromPoint(x, y)
    PASS only if hit === control || control.contains(hit)
report: points reaching the control · points reaching anything else · what
```

Three properties make it worth the trouble. It asks the BROWSER, so it accounts
for the whole stack rather than for the one rule you thought of. It walks the
box, so it finds a control that is live at its centre and dead at its edge — the
title plate's 57px dead strip, which a centre-point probe reported as working.
And it names what it DID hit, which is the diagnosis: `ex-root` means nothing
above is taking the click, `.bt` means something inside the control is, and a
sibling's class name is the swallower.

**A GREEN GATE, A SCREENSHOT AND A PASSING UNIT TEST ALL MISS THIS.** The live
page is the truth, and for a control the live page has to be *probed*, not
looked at.

---

## THE COPY — HIS WORDS, VERIFIED ON THE PAGE

### /booth — three answers

| question | change |
|---|---|
| Are you tracking me? | gains `hosts no ads`; the NOTE becomes `Artists' policies` rather than `Artist site policies` — a policy belongs to the artist, not the site |
| Who keeps this place? | three lines become **two**; `The job pays nothing.` and `That's the deal, and it never changes.` join. **A JOIN, not a rewording** — same words, same order, one fewer break, and it was his break to remove |
| Does Weird.Baby 'take a cut'…? | `gift shop` → **`Gift Shop`**; it is the room's NAME here, as the bar's own exit reads it |

### /foundation — one killed, one rewritten, one retitled

**`Where do our donations go?` is DELETED**, question and answer, and named once
in the source (Doctrine 24): *"100% of every donation goes directly to Coalition
for the Homeless."* **It follows the day before rather than contradicting it** —
`Where's the donate button?` was struck on 17 August with the consequence stated
(*the museum publishes no route to giving*), so an answer about where a donation
goes was answering about a thing a visitor cannot do here. What survives is the
question about the house's OWN proceeds, which is a fact rather than a request.
`door.coalition` stays `NOT_BUILT / HELD`.

**`Why are you giving away your money?`** — his next pass, replacing yesterday's
one-liner (named once: *"We are not giving anything away. We are keeping what we
have."*). **It answers a different question and that is the point:** yesterday's
line ended on what the house keeps, this one says WHY. Still one line — he typed
no break.

**Retitled:** `Can I contribute something other than money?` →
**`Can I donate something besides money?`**, answer untouched.

**Measured on the page: 7 questions where there were 8**, the killed pair absent
from `textContent`, the new answer present character for character, and
`Yes. We will speak up when we have a need to fill.` unchanged.

### /wb — one word, his ruling

`is earning to play` → **`is learning to play`**. Raised as a flag, carried as
typed for one round, ruled by him. **That is the loop working**, and it is why
the flag rule exists: Ops reports, he rules. `Q-c`'s first item closes; the
`Born | Born July 3, 1963` flag and Macungie PA stay open.

### PROVENANCE

**6 rows added, 8 pruned.** Inbound chain references into the pruned set were
checked first and were **zero** (§9's prune hazard). The retitled question's
ANSWER is not re-declared, because it did not change — only the question's row
moved.

---

## RECORDED, NOT BUILT

| what | row |
|---|---|
| Build the manual from the program itself, with screenshots and composites — *"You can make SO MUCH of this!!!"* | `Q-d` |
| The light table: clutter out, audio does not belong in it, the manual collapsible, the manual thumbnails too faint to read the form | `Q-e` |
| The Foundation's Short Story and Long Story — **he writes them Tuesday** | `S-f`, updated with the day |

Nothing was scoped, scaffolded or half-built for any of the three.

---

## JOB 5 — THE PRUNED BACKLOG, ON THE DESK

**MIKE: "File the pruned backlog on the Ops Desk… Mike looks at the desk for
everything, so it belongs there."**

### `npm run desk` → `docs/BACKLOG.html`, THE FIRST CARD

His ranking is the spine, in his tiers and his words: **NOW · TUESDAY · NEXT ·
THEN · PARKED · IN PASSING**, then the SEO deferral and the closures. It leads
the desk rather than following the register, for Doctrine 26's reason: the
register answers *what is outstanding*, this answers *what is next*, and the
second is the question he opens the desk with.

**IT IS A SECOND MARKDOWN THROUGH THE SAME RENDERER — no second machine.**
`BACKLOG.md` is the source; the register is untouched as the full record.

### SEVEN CLOSED, AND FOUR OF THEM HAD NO ROW AT ALL

| item | had a row? | closed because |
|---|---|---|
| the approve tool | **no** | a stamp with no consumer — `npm run approve` writes a signature and nothing reads it back. **The Approval Law is not touched**; the TOOL returns when it feeds the quality box |
| the deploy card | **no** | superseded — a panel of the quality box, not a row |
| the nine-variant short | **no** | a note in the drawer, not a row. **M46 (shorts cadence) is a different question and stays open** — it was not folded in by proximity |
| **M33** | yes | folded into `PZ-a` — each drum position is a boolean and a feed, and what decides which arms IS the mechanism PZ-a waits on |
| the FEED ch-4 contradiction | **no** | folded into `PZ-a`, same reason |
| **S-i** | already closed | confirmed, not re-closed. His read was right and the register was already correct |
| **S-l** | yes | **not a defect** — the double space is in the data and cannot draw; `white-space: pre-line` collapses runs of spaces |
| the 314 rule | **no remnants** | searched the register: none. Film A's packet rate is a separate use and is untouched |

**THE FOUR WITH NO ROW ARE WRITTEN UP ANYWAY**, in `OPEN_ACTIONS_CLOSED.md`.
**An item with no row is precisely the one a later round re-raises as if it were
new** — naming a dead thing once is what stops it coming back, and that only
works if the naming happens whether or not there was ever a row to delete.

Register: **139 rows → 137**, plus the two SHORT LIST lines that pointed at the
two closed rows. **Dead intra-file links: 0** — checked, because §9 records that
a closed row leaves its SHORT LIST line behind, four times in two rounds.

### SEO IS DEFERRED WITH A TRIGGER, AND OPS WAS WRONG ABOUT HALF OF IT

Row **`Q-f`**. His split: **the robots fiction will not rank and chasing it is
wasted** — nobody searches for a machine that does not exist — **but *"Papa
Weird.Baby"*, *"Weird.Baby Foundation"* and the album should own their own
names**, so a person who HEARS the name and types it lands here. That half is
cheap and permanent. **Ops had dismissed the whole of SEO; that was too broad
and the row says so.** Trigger: **revisit at roughly 30 Records** — the point at
which there is enough written surface for a name to resolve TO something.

### TWO GUARDS, BECAUSE TWO FILES THAT POINT AT EACH OTHER DRIFT

**(1) EVERY REGISTER LINK ON THE BACKLOG IS CHECKED ON EVERY BUILD.** The desk's
own rule — *never draw a link to something that is not there* — one level down.
A backlog pointing at a row somebody closed reads as *still open* to the one
person who cannot check, which is exactly what this reconciliation was cleaning
up, and Doctrine 24 makes closures routine. **Proved by breaking it:** pointing
one link at `#zz-probe` named it on the console and red-flagged the page; put
back, `every register link on the backlog resolves to a live row`.

**(2) THE THREE COUNTS IT PUBLISHES ARE NOW A TRIPWIRE.** The closing section
says the register holds **137 rows, 132 OPEN, 114 owned by Mike** — the sentence
that makes the point that this page ranks the WORK and does not replace the
register. All three go stale the next time a row closes. `npm run docs:numbers`
measures them off `OPEN_ACTIONS.md` now: **10 published claims in 4 documents**,
up from 8 in 3. **Proved by breaking it:** `137` → `999` failed the gate with
the file, the line number and both numbers.

### AND THE `.md` LINK TRAP CAUGHT ITSELF

`BACKLOG.md` links to `OPEN_ACTIONS.md#id`, which is right for anyone reading
the markdown — and wrong in the rendering, where a browser handed a `.md` either
downloads it or draws 760 lines of pipe characters. **This file's own header
already says that**, about itself, which is how it was caught. The source keeps
its honest link; the rendering repoints at the rendering. Measured after: **zero
`.md` links in `BACKLOG.html`, 21 register links, and the anchor each one names
exists in `OPEN_ACTIONS.html`.**

**`OPEN_ACTIONS_CLOSED.md` IS DELIBERATELY NOT LINKED AND NOT ON THE DESK** —
Doctrine 24: the test is not whether a dead thing is archived, it is whether he
meets it again. The backlog names the seven closures in plain text and says
where the reasons are written, without putting them one click from his desk.

### WHAT THIS PAGE DOES NOT DO

**It does not replace the register and says so on itself.** 137 rows are still
there; his ranking names 21 of them. **A row not named in the ranking has not
been closed, dropped or demoted** — stated on the page, because a ranked list
that looks complete is how the other 116 quietly stop existing.

---

## GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline** |
| `npm run build` | green |
| `npm run build:launch` | green — 144 files, 190.0 MB held out |
| `npm run provenance:gate` | **PASS** — 0 undeclared, 0 stale |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run docs:numbers:gate` | **PASS** &mdash; **10 claims in 4 documents**, up from 8 in 3 |
| `npm run reveal:day` | nothing to move |
| `npm run desk` | **12 instruments, 12 on disk** &middot; every backlog link resolves |

**Nothing was committed, pushed or deployed. No dev server is left listening.**
