# PACKET B — THE SHORTS BENCH, PASS TWO
2026-08-13 · WRITE · `npm run shorts` → `docs/shorts/shorts.html`

Captures: `C:\AI\_night-20260812\shorts-captures\`

---

## WHAT YOU NEED FROM ME

**One answer, and two things to look at.**

**1. THE COMPILE STEP NEEDS A RULING (C2), AND IT IS THE SAME RULING AS THE
THREE MP4s.** My recommendation is one line: **it runs on your Windows box with
ffmpeg, and the output never touches Cloudflare at all.** Reasoning in §C2. I
did not build it.

**2. `npm run shorts`, then double-click `docs\shorts\shorts.html`.** All five
of your notes are in it. It opens on the recipe I left there so you can see it
move before you build one.

**3. Two pictures on the shelf are not exhibit material** — `MGK TWIN MONITOR
CLOSE UP MARKERS` and `Monitor base markers` are red boxes on black, marker
files from a build. They are selectable as ingredients today. Ruling them out
is one line in `RULED_OUT`; it is your call and I did not make it.

Gates: lint **9/8 = baseline** · build green · **launch build green** ·
provenance **PASS** · `reveal:check` **PASS** · `reveal:build` byte-identical ·
`parity:gate` **PASS** · `instory:gate` **PASS** · `reveal:day` nothing to move ·
`assets:orphans` 13 (pre-existing).

---

# YOUR FIVE NOTES

| your words | what it is now |
|---|---|
| *"The ingredient settings all need tweaked, but the tool is there!"* | Every block has seconds · ease · fit · from/to x, y, scale, rotate · in/out transition. **And the default that made frame one black is fixed** — see B-DEFECT-1. |
| *"I would expect to be able to select any of our photos in the tool."* | 80 pictures, read from the museum's own shelf. Grouped exactly as the artifact tracker groups them, with its thumbnails. **What is NOT there and why is in B1.** |
| *"NOTE: The VIIIp is shown as broken link."* | Found the cause. **Zero broken images now, measured.** §B2. |
| *"Let me select which blocks to play (troubleshooting, etc)"* | `all` · `this block` · `range` (shift-click two cards). §B3. |
| *"Let me single step"* | ◀ ▶ one frame, ◀◀ ▶▶ ten, arrow keys the same, shift for ten. §B4. |
| *"Let me choose preview window, or show two."* | Four shapes; `show two` puts a second shape beside the first, **one recipe, one play head, both step together** — your answer. §B5. |

---

# B1 — REAL INGREDIENTS, AND HOW THEY WERE SOURCED

**Not a parallel list — literally the same function.**

The tracker's shelf logic lived inside `tools/dictation/assign.mjs` as
`buildRows()`. I moved it out whole into **`tools/dictation/shelf.mjs`** and
pointed both tools at it.

**The move is proved, not asserted:** `docs/dictation-20260807/assign.html` is
357 KB and regenerated **byte-identical** across the refactor — same 143 rows,
same eight sections, same drop counts. The generator was confirmed deterministic
first (two runs, same hash) so that the comparison meant something.

That matters because the shelf carries **`RULED_OUT`** — Doctrine 24 made
mechanical. A second tool re-deriving the shelf would offer you the monitor
bezel you killed on 2026-08-13, and it would look like a feature.

### What reaches the bench

```
143  the shelf, as the artifact tracker knows it
−63  not pictures (58 build-card recordings + 5 other sound)
────
 80  ingredients
```

Grouped: **The Manual 61 · Photographs 8 · Covers and artwork 5 · Manual tuning
sheets 3 · Portal program artwork 2 · Plates 1.**

**Video is out of scope in the DATA, not only the UI** — `mediaKind === "image"`
is the only thing that reaches the shelf, so the three video rows could not be
chosen by accident.

### What is withheld, counted, and printed in the page's own footer

```
withheld: 8 with no file on disk · 1 ruled out or signage · 63 not pictures · 144 robots-repo rows
```

**The 144 robots-repo rows are the one I want you to see.** The tracker excludes
them for a stated reason: *"a thing still only there cannot be shown by any
Record this week."* That reasoning is about what the **museum** can publish — and
**a short video is not the museum.** It is compiled outside the browser and
posted to a platform; it never needs the picture to be museum-reachable.

So when you say *"any of our photos"*, those 144 rows are very likely what you
mean. **The packet scoped me to the 143, so that is what I built**, and this is
the tension named rather than guessed at. Opening it up is one line — a second
call to the shelf without the repo filter. **Ops' ruling, not mine.**

---

# B2 — THE BROKEN VIIIp LINK

## The cause, with evidence

The asset table holds **13 rows whose file is not on disk**, nine of them
museum rows:

```
public/held/robots/reference/mgk-viii/cabinet_whole.jpg      MISSING
public/held/robots/reference/mgk-viii/column_lit.jpg         MISSING
public/held/robots/reference/mgk-viii/core_helical.jpg       MISSING
public/held/robots/reference/mgk-viii/core_meltdown.jpg      MISSING
public/held/robots/reference/photos/front_full.png           MISSING
public/held/robots/reference/photos/monitor_base.png         MISSING
public/held/robots/reference/photos/unit_new_base.png        MISSING
public/images/wal/hunter-root-plate.jpg                      MISSING
public/robots/reference/photos/rear_power_switch.png         MISSING
```

**A tool that lists asset-table rows without asking `missing` emits an `<img>`
at a file that is not there.** Four of those nine are `mgk-viii` photographs.
That is a broken picture where a machine photograph should be.

**There is a second, independent way to produce the same symptom**, and it is
worth knowing because it will bite the next tool: OPERATIONS §8's *two
addresses* hazard. A governed picture has a PUBLIC address (`/robots/…`) and a
HELD address (`public/held/robots/…`). A page you open by **double-clicking** is
a `file://` document, and a public address resolves to nothing there.

## The fix, and it is two mechanisms

1. **The shelf withholds every `missing` row and counts them** — the footer
   prints `8 with no file on disk`. A silent filter is indistinguishable from a
   bug.
2. **Every href is `diskHref`** — a relative walk out of `docs/shorts/` into the
   repo — so it resolves with no server. The generator **asserts** the page sits
   exactly two directories below the repo root, because a third level would
   break every image at once and look like missing files.

## Measured on the built page

```
broken images (complete && naturalWidth === 0) : 0
ingredients with no thumbnail                  : 0
console errors                                 : none
```

**And the VIIIp artwork is present and draws.** All three files exist and I put
one in the demo recipe — block 3 is
`public/held/robots/art/mgk-viiip-cover.png`, visible in capture 03.

---

# B3 — BLOCK SELECTION · B4 — SINGLE STEP

Both exercised on the bench, through the real controls. Readings taken off the
page's own clock:

```
                                    clock after the action
home                    t 0.00 / 7.50s | frame 1 / 225 | block 1
▶ ▶  (two single steps) t 0.07 / 7.50s | frame 3 / 225
▶▶   (ten)              t 0.40 / 7.50s | frame 13 / 225
◀    (one back)         t 0.37 / 7.50s | frame 12 / 225
◀◀   (ten back)         t 0.03 / 7.50s | frame 2 / 225
→ key                   t 0.07 / 7.50s | frame 3 / 225
shift + → key           t 0.40 / 7.50s | frame 13 / 225

this block (block 2)    t 0.00 / 2.50s | frame 1 / 75  | block 2
range 2–3 (shift-click) t 0.00 / 5.00s | frame 1 / 150 | block 2   label "range 2–3", 2 cards lit
all                     t 0.00 / 7.50s | frame 1 / 225 | block 1
```

**Selecting a subset re-scopes the whole transport** — the timeline, the total,
the scrub bar and the frame count all become that subset's. Soloing block 2 gives
you a 75-frame timeline, not a play head skipping around a 225-frame one. That is
what makes it useful for troubleshooting one motion.

**Nothing correct is behind `requestAnimationFrame`.** rAF drives the play loop
only; every step you ask for draws synchronously. That is the trap from the
record editor — a page that draws perfectly in a background tab and wires
nothing, with no error anywhere.

---

# B5 — THE PREVIEW, AND WHAT TWO-UP MEANS

**You answered it: two output shapes, one recipe.** One timeline, one play head,
both windows step together.

Four shapes — **9:16 Reel · 4:5 feed · 1:1 square · 16:9 landscape**. `show two`
reveals a second selector; capture 02 is 9:16 beside 4:5 at t = 1.83s, capture 03
is 9:16 beside 1:1 at frame 1.

It is genuinely useful for the thing it looks useful for: on page 56 the 9:16
crop loses the abbreviation column's left edge and the 1:1 keeps it. You can see
that in one glance instead of two passes.

**The canvas is never the output size.** It fits its box; the recipe is
resolution-independent (§C1), so what you are judging is framing and timing, not
pixels.

---

# THREE DEFECTS THE INSPECTION FOUND

I opened it, built a sequence, played it, stepped it, soloed a block and swapped
an ingredient. These are what that found — none of them was visible from the code.

## DEFECT 1 — the tool's first impression was a black rectangle

`DEFAULT_BLOCK` shipped with `in: fade 0.2s`. **A fade's first frame is by
definition fully black**, the bench opens at frame 0, and Home returns to frame
0. So a brand-new block showed nothing.

**Measured before concluding** — centre luma across the six fade frames:

```
frame 0 → 0    frame 1 → 42   frame 3 → 126
frame 5 → 209  frame 6 → 252  frame 40 → 251
```

**The fade was perfect and the DEFAULT was the defect.** A tool whose opening
frame looks broken gets reported as broken — and this may well be part of what
*"the ingredient settings all need tweaked"* meant. `in` is now `cut`; a fade is
something you add. Verified after: frame 0 luma **252**.

## DEFECT 2 — the recipe was 70% thumbnail cache

Assigning an ingredient stored the **whole shelf item** on the block, including
`thumb` (a 240px WebP data URI) and `href` (a path relative to that page).

```
three-block recipe, before : 16,838 bytes   (11,865 of them base64 thumbnails)
three-block recipe, after  :  1,716 bytes
```

**That is the durable artifact.** It would have carried a rebuildable cache and a
page-local address into the one file meant to outlive the page. A block now
stores identity only — `uid`, `path`, `repo`, `sha256`, `w`, `h`, `label` — and
the page looks up pixels by uid at draw time.

**And it made a real behaviour possible:** a recipe outlives a shelf. A block
whose uid is no longer on the shelf now says **"NOT ON THE SHELF ANY MORE"** in
red, with the path, instead of drawing a blank.

## DEFECT 3 — the block card ran its own label together

`Page 72.5s · 1.00→1.12` — label and duration were inline spans. Now three
lines. Seen on the bench, not deduced.

**Also fixed:** tile labels are unreadable at 78px (*"MGK-NIAC plate 3 of 4, and
the still on TECHNICAL SPECIFICATIONS"* renders as about ten characters). Every
tile and block card now carries the full label plus path as a tooltip.

## AND TWICE I NEARLY REPORTED SOMETHING THAT WAS NOT THERE

The handoff's warning earned its keep. I read a black band under the app and a
ninth photo tile off the screenshots; **measured, the app filled the viewport
(673px of 673) and there were exactly 8 tiles with no overflow.** Both were the
JPEG capture, not the page. Every layout claim in this report is a measurement.

---

# C1 — THE RECIPE FORMAT

Declared once in **`tools/shorts-recipe.mjs`**, imported by the generator and by
any future compiler. Written to **`docs/shorts/recipes.json`**.

```json
{
 "_": "THE SHORTS BENCH — Mike's recipes … Positions are fractions of the asset, never pixels.",
 "version": 1,
 "saved": "2026-08-13T17:02:22.728Z",
 "recipes": [
  {
   "version": 1, "name": "the manual opens",
   "fps": 30, "shape": "9:16", "audio": null,
   "blocks": [
    {
     "id": "bmsrrmnun",
     "seconds": 3, "fit": "cover", "ease": "outCubic",
     "from": { "x": 0.5, "y": 0.22, "scale": 1.15, "rot": 0 },
     "to":   { "x": 0.5, "y": 0.55, "scale": 1.55, "rot": 0 },
     "in":   { "type": "cut", "seconds": 0 },
     "out":  { "type": "cut", "seconds": 0 },
     "asset": {
       "uid": "A-be5c1ebdab",
       "label": "Page 56",
       "path": "public/held/robots/manual/page-56.png",
       "repo": "museum",
       "sha256": "64b97a0e526a8966e74b5c7883a372cde9be50fd6c90f3b4dbdd40ff9f6feb6a",
       "w": 2040, "h": 2640
     }
    }
   ]
  }
 ]
}
```

## What a compiler needs, and why each field is there

- **NOTHING IS IN PIXELS except the output shape.** `x`/`y` are fractions of the
  asset, `scale` is a multiplier. The same recipe compiles at 1080×1920 or
  2160×3840 with identical framing. A recipe holding pixel offsets would be a
  recipe for one output size, silently.
- **`asset.uid`** — the asset table's own row name, minted once and never
  rewritten. A compiler resolves the file through the table rather than trusting
  a path a round may have changed.
- **`asset.sha256`** — so a compiler can **prove** it has the bytes the recipe
  was designed against. The path can move; the hash cannot lie.
- **`fps` explicit** — frame count is `seconds × fps`. A compiler assuming 30
  where the bench drew 24 produces different motion.
- **`ease` is a NAME, not a curve** — both readers implement the same five
  (`linear`, `inCubic`, `outCubic`, `inOutCubic`, `inOutQuad`), source in
  `shorts-recipe.mjs`. A bezier in the data would be a second declaration.
- **`audio: null` is reserved and deliberate.** The bench cannot author sound
  and does not pretend to. It is in v1 **on purpose**: a compiler written against
  a format with no audio key must be revised to accept one, and then two versions
  of the format exist. One null field now prevents that.
- **`fit`** — `cover` crops to fill, `contain` letterboxes. Without it a
  compiler must guess what a 690×240 picture does in a 9:16 frame.

## The exact compile, stated so it cannot be misread

For each block, for frame `f` of `round(seconds × fps)`:
`u = f / (n − 1)` → `e = ease(u)` → interpolate `from`→`to` linearly by `e`.
In `cover`, the source rect is the crop that fills the output aspect, divided by
`scale`, centred on `(x·w, y·h)` and clamped inside the image. Transitions draw
over the top: `fade` to black, `flash` to white, ramping across `in.seconds` /
`out.seconds`.

---

# B6 — DURABLE, AND PROVED BOTH WAYS

**No server. No build step. No clipboard API.** `npm run shorts` writes one
self-contained 253 KB file; you double-click it.

Three places your work lives, weakest first:

1. **`localStorage`, on every keystroke.** A refused store **raises a red banner
   across the page** rather than losing an afternoon quietly.
2. **`SAVE TO THE REPO`** → `showSaveFilePicker`, handle remembered — a dialog
   once, one click after.
3. **The generator bakes the last saved `recipes.json` back into the page**, so a
   wiped browser still opens on your work.

## Proved

**The failure path, end to end** — I made the picker unavailable and pressed the
real button:

> *"the save dialog was refused (Error) — DOWNLOADED to your Downloads folder
> instead. Move it to docs\shorts\recipes.json"*

A 2,560-byte `recipes.json` landed in Downloads. **A bridge that fails must fail
into the old road, never into silence.**

**The round trip** — I moved that file into `docs/shorts/`, rebuilt
(`recipes read back: 1`), then **wiped `localStorage` entirely** and reloaded:

```
status       : "opened from docs/shorts/recipes.json"
recipe       : "the manual opens"
blocks       : 3
broken images: 0
```

## Two guards, because a generator and its script are two lists

- **Build time:** `shorts.mjs` scans the client for every `$("#id")` it wires and
  **refuses to write the page** if one is not in the markup.
- **Run time:** the client audits itself at boot and red-banners any control it
  cannot find.

**And the CSS cannot collide.** `OPS_CSS` already owns `.wrap .bar .day .n
.rail` — `.rail` being a `nowrap` badge that puts horizontal scroll on any page
reusing the name. All **47** classes here are `sh-` prefixed; intersection with
`OPS_CSS` measured at **zero** (my first check reported five, which turned out to
be my own comment naming them — the check was wrong and the CSS was right).

**Nothing from the bench ships.** `dist/client/docs` is absent and no `shorts*`
or `recipes.json` appears anywhere in `dist` — `docs/` is not `public/`. Worth
stating because the page embeds 80 thumbnails of held material.

---

# C2 — WHERE THE COMPILE SHOULD RUN · RECOMMENDATION ONLY

**Recommendation: locally, on your Windows machine, with ffmpeg — and the output
never goes near Cloudflare.**

Reasoning:

1. **The masters are already there and they are large.** 61 manual pages at
   240 dpi are 112.6 MB; the shelf's held material is 190 MB. A remote compiler
   needs them uploaded. A local one already has them.
2. **Cloudflare is the wrong frame entirely, and that is the link to the three
   MP4s.** Workers assets refuse files over 25 MiB — which is why those three
   MP4s cannot be served. **But a short does not need serving.** It is a file you
   upload to a platform; the platform hosts it. The MP4 problem is "how do we
   publish this from the museum"; the shorts problem is "how do we make a file
   Mike posts". **They share a cause and not a solution**, and treating them as
   one question is how a compile step ends up in a Worker that cannot hold its
   own output.
3. **The recipe is already resolution-independent**, so a local render can emit
   1080×1920 today and 2160×3840 later with no change to the data.
4. **It is one script.** `tools/shorts-compile.mjs`: read `recipes.json`, resolve
   each `uid` through `provenance/asset-table.json`, verify `sha256`, emit frames
   with `sharp`, pipe to `ffmpeg -framerate <fps>`. Roughly an evening.

**Not recommended:** a Worker (cannot hold the masters or the output), a browser
`MediaRecorder` (you called video a trap and it is — real-time capture, no frame
guarantee, the automated Chrome here has no working media pipeline at all), or a
cloud service (uploading 190 MB of held material off this machine is a decision
nobody has made).

**I built none of it.**

---

# B7 — THE PROTOTYPE

**There is no prototype on this machine.** `C:\AI\_night-20260812\` holds seven
markdown reports and `attachment-shapes.html`; a name-and-content search across
`C:\AI` for shorts/reel/motion/recipe/storyboard tooling returns nothing, and
nothing in `C:\AI` was modified in the last 36 hours except this session's own
files. B7 called it optional and said to treat it as a sketch, so its absence did
not block anything — **but if Mike used a tool, it is somewhere I could not
find, and anything he typed into it is not in this build.**

---

# WHAT CHANGED

| file | what |
|---|---|
| `tools/dictation/shelf.mjs` | **new** — the shelf, moved out of `assign.mjs` whole |
| `tools/dictation/assign.mjs` | imports it; 33,163 → 28,106 bytes; **output byte-identical** |
| `tools/shorts-recipe.mjs` | **new** — the recipe format, declared once |
| `tools/shorts.mjs` | **new** — the generator |
| `tools/shorts.client.js` | **new** — the page's script |
| `tools/shorts.css` | **new** — 47 classes, all `sh-` prefixed |
| `docs/shorts/shorts.html` | **new** — the bench, 253 KB, double-clickable |
| `docs/shorts/recipes.json` | **new** — a worked example |
| `package.json` | `"shorts": "node tools/shorts.mjs"` |

---

## WHAT I COULD NOT DETERMINE

- **Whether `showSaveFilePicker` succeeds on Mike's Chrome.** I proved the
  fallback because invoking the real picker opens a native dialog that would
  block this session. The success path is the record editor's proven pattern,
  unchanged.
- **Whether "any of our photos" means the 144 robots-repo rows.** Named in B1 as
  a tension; not guessed at.
- **What Mike's existing recipes contain**, if the prototype held any (B7).
- **Whether four shapes are the right four.** 9:16 / 4:5 / 1:1 / 16:9 are the
  common social frames; nobody has ruled a list.

## WHAT NEEDS MIKE

1. **C2 — where the compile runs.** Recommendation above; Ops rules.
2. **Two marker files are selectable ingredients and are not exhibit material**
   (`MGK TWIN MONITOR CLOSE UP MARKERS`, `Monitor base markers`). One line in
   `RULED_OUT` if they should go.
3. **Whether the 144 robots-repo pictures should reach the bench** (B1).
4. **Look at it.** `npm run shorts`, then double-click
   `docs\shorts\shorts.html`.
