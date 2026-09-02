# THE SOCIAL SURVEY — what exists toward publishing video, reels and posts

**2026-08-28. READ-ONLY round. Nothing in either tree was changed.**
HEAD `ad0d73d`. Tree carries one untracked path, `docs/DEPLOYED.md` — the
deploy record itself, written by `tools/deploy-record.mjs` after the upload and
never committed. No tracked file is modified, staged or deleted.

**This is a survey. Nothing here is a proposal and nothing was built.**

---

## 0. THE ONE-LINE ANSWER

**The reel machinery is real, it works, and it produced three MP4s that are
still on disk. What does not exist is everything around it:** no account handle
anywhere in either repository, no schedule, no record of anything ever posted,
and **no gate between a recipe and a platform.** The pipeline reads held
material by construction — that is what it is *for* — and the only thing
standing between held content and YouTube is Mike deciding not to upload.

---

## 1. WHAT THE REEL MACHINERY IS

### The parts

| file | bytes | what it does |
|---|---:|---|
| `tools/shorts.mjs` | 12,104 | **THE BENCH.** Builds `docs/shorts/shorts.html`. Produces a recipe and a preview and nothing else. |
| `tools/shorts-recipe.mjs` | 12,599 | The shared vocabulary — shapes, eases, transitions, the flashbang curve. Imported by bench, compiler and verifier so all three answer the same. |
| `tools/shorts-compile.mjs` | 17,976 | **THE COMPILER.** A recipe becomes an MP4. `sharp` composes frames, raw rgb24 on a pipe into ffmpeg. |
| `tools/shorts-verify.mjs` | 9,956 | Reads the rendered file's luma back against the declared curve. |
| `tools/shorts-pad.mjs` | 3,092 | The pad-colour rule, its own module so compiler and verifier cannot disagree. |
| `tools/shorts.client.js` | 27,787 | The bench page's own script. |
| `tools/shorts.css` | 8,871 | The bench page's styles. |

Scripts: `shorts` · `shorts:render` · `shorts:flashbang` · `shorts:verify`.

### What it produced, and it survives

`docs/shorts/out/` is **gitignored** (`.gitignore:92`). The comment there is the
architecture, and it is a good one:

> *"A recipe is the durable artifact; the MP4 it compiles to is not — it is
> regenerable from the recipe by one command, it is megabytes, and it is a file
> Mike uploads to a platform rather than anything the museum serves."*

Three MP4s are on disk right now:

| file | bytes | written |
|---|---:|---|
| `docs/shorts/out/flashbang.mp4` | 529,225 | 2026-08-25 10:30 |
| `docs/shorts/out/teaser-15s.mp4` | 8,590,941 | 2026-08-13 17:11 |
| `docs/shorts/out/teaser-30s.mp4` | 20,634,340 | 2026-08-13 17:13 |

Plus nine sampled PNG frames under `flashbang-frames/`.

### The flashbang — what it actually looks like

**3.96 seconds, 119 frames at 30fps, 9:16, silent.** Two blocks:

1. **0.600s** — a tight black-and-white close-up of the Portal CRT: dial, lens
   barrel, the words `U.S.A. BY` around the bezel. Held still. The recipe's own
   note says this frame was chosen *by measurement*: the first render used
   manual page 56, mean luma 251, so the pop and the white hold were
   indistinguishable. This photograph measures 78. **78 → 255 → 216 is a curve
   you can see.**
2. **3.360s** — the flashbang: 10ms pop to full white, 350ms blind hold,
   3000ms dissolve on curve 6.0 (slow-then-fast), waver 0.5 decaying, revealing
   **the Weird.Baby mark** — the baby in the ring with the wordmark across it,
   whole and uncropped on white.

**The bang is at the front, not the end.** Mike remembered it as *"supposed to
end with a flash bang"*; what was built is a flashbang **transition** — the
recipe's own header calls it a TRANSITION template, and says that in a real
teaser block one is *"whatever the viewer was already looking at."* The
standalone flashbang is the proof of the mechanism, not the reel.

`fit: "contain"` on the reveal was **found by looking, not by reasoning** — the
mark is 2048×2048 in a 1080×1920 frame, and `cover` cropped it to read
`eird.Bab`. The comment in the recipe says so: *"Every luma number was correct
while the picture was wrong."*

### Does it still work — yes, and here is the evidence without running it

The throw was **`asset file missing on disk`**, from 2026-08-22, for three days.
Cause: the Portal ruling moved `MGK-TWIN_MONITOR_CLOSE_UP.png` out from behind
the door, the asset table's `row.path` went stale, the uid resolved and the file
was not at the address the row named. Fixed at **`64359c1`** (2026-08-25
10:35:40) — a content-carry fix in `tools/asset-table.mjs` that let a uid
survive a rename for all 475 rows instead of only the 35 judged ones. Its commit
message names the flashbang as the proof of the round: *"It now renders 119
frames, 517 KB, and re-renders to an identical sha256."*

Re-checked this round, read-only, resolving the recipe exactly as the compiler
does:

```
fb-lead    uid A-127ca4b489  table path public/robots/reference/photos/MGK-TWIN_MONITOR_CLOSE_UP.png
           on disk YES · sha256 MATCHES recipe · public
fb-reveal  uid A-e951825925  table path public/WeirdBaby_PhotoID.png
           on disk YES · sha256 MATCHES recipe · public
total 3.960s → 119 frames at 30fps
```

119 frames matches the commit; the file on disk is 529,225 B = 517 KB. **Both
assets resolve, both are on disk, both hash to what the recipe recorded.** The
failure mode that broke it cannot fire today. It was not re-run — that would
overwrite `docs/shorts/out/`, and this round was read-only.

**One cosmetic staleness:** `flashbang.json` still records the block's `path` as
`public/held/robots/reference/photos/…`. Harmless — the compiler resolves by
`uid` through the asset table and ignores the recipe's `path` string — but a
reader of the recipe file is told the lead-in is held material, and it is not.

### Determinism is the contract

`shorts-compile.mjs` shuts four doors so the same recipe always produces the
same bytes: no wall clock in the render, no metadata clock (`-map_metadata -1`,
`+bitexact`, x264 pinned), no randomness (the waver is a sine), and alpha
quantised to 1/1000 before the lookup table. `--verify` renders twice and
compares sha256.

---

## 2. WHAT ELSE EXISTS TOWARD SOCIAL

Backlog item 3 reads: *"Social: accounts, handles, three schedules, content.
Robots 3×/week, Music fortnightly, the house silent. Everything else on this
page improves a museum nobody has found."* It links to register row **M60**.

**Measured against that sentence:**

| the item | state |
|---|---|
| accounts | **Not in the tree.** Mike tells Ops YouTube and Facebook exist as Weird.Baby. Neither repository knows it. |
| handles | **None.** M60 is still true. |
| three schedules | **Do not exist in any form.** No file, no data, no constant, no cron. |
| content | **Three MP4s and three recipes.** That is all of it. |
| Robots 3×/week | **A sentence in a backlog table.** Nothing reads it. |
| Music fortnightly | Same. |
| the house silent | Same. |

### The handle question, verified

`M60`, OPEN, owner Mike, raised **2026-08-05**:

> **"FOLLOW US ON SOCIAL MEDIA" IS ON THE GLASS AND THERE IS NO HANDLE BEHIND
> IT.**

The string is live at `src/data/artists/robots.js:598`, in the FAQ answer to
*Can I buy one?*: **"Monitor the website for availability. Follow us on social
media."** It is Mike's own P3 wording and ships as written.

Swept again this round: every social URL in the tree belongs to **other
artists** — `youtube.com/@CarsieBlanton`, `@hunterrootmusic`, `@hellswelles`,
`@findmikeymike`, and ~20 `facebook.com/…` and `instagram.com/…` source URLs in
`src/data/exhibits/hunter_root.json`. **Zero name a Weird.Baby account on any
platform.**

### What the museum does have on YouTube

It **consumes** YouTube; it does not publish to it. `src/data/artists/weird-baby.js`
carries `Coconuts` with two renditions, the video ruled first (Mike, 2026-08-20):

- `ytId: "c1vODrVXOg0"` — **Official Music Video**
- `/audio/wb/06_coconuts_2026-06-17.mp3` — the `first pass` audio

E.D. Yahdah gained the same shape on 2026-08-26. **Only the id crosses** — the
museum never writes an embed URL; `useYTPlayer` builds the player against
`youtube-nocookie.com` and drives it by id.

So the Coconuts reels Mike has started making on YouTube are being made
**against a track the museum already exhibits**, and the museum has no idea they
exist.

### The one social artifact that actually ships — and it has drifted

`public/share-card.png`, 1200×630, 28,159 B, unchanged since 2026-08-02.
`index.html` carries the og/twitter block at lines 103–117.

`src/worker.js` holds **CH6** (landed `d966f8b`, 2026-08-12): while the Robots
wing is shut, the worker rewrites two descriptions to `CARD_WHILE_SHUT` so a
shared link does not promise a hidden wing. Its own comment reasons:

> *"`twitter:description` already says the true thing in both states and is
> REUSED verbatim rather than a third sentence being written."*

**That was true when it was written and is not true now.** At `d966f8b` the
three descriptions were genuinely different, and `twitter:description` named no
wings. On **2026-08-17**, commit `4e29e4f` ("Share card and description tags")
rewrote all three to one identical string:

> *"A free museum of weird things worth keeping. Robots arriving one day at a
> time, music worth a listen, and a guest book that remembers who got here
> early."*

The worker rewrites `meta[name="description"]` and
`meta[property="og:description"]`. It does **not** touch
`meta[name="twitter:description"]` — an exact attribute selector cannot match
it. So today, on any platform that reads the Twitter card, **weird.baby
advertises "Robots arriving one day at a time" for a wing that answers 404
until 2026-09-07.**

Two register rows are entangled with this and both are still OPEN, owner Mike,
from 2026-08-06:

- **M68** — *"THE SHARE CARD AND THE TWITTER CARD ARE TWO DIFFERENT DESCRIPTIONS
  OF ONE MUSEUM"*, asking *which description is the museum's*. It prints all
  three verbatim — **and those three are the pre-`4e29e4f` strings.** The
  question M68 asks was answered by a commit eleven days later, and M68 was
  never closed or updated.
- **M83** — three redrafted descriptions printed verbatim in a round log,
  `index.html` untouched at the time, asking whether a share card should carry
  the not-open-yet fact.

**Flagged, not fixed.** A share card is the museum introducing itself, which is
Mike's sentence and not Ops'.

### The rhythm that was built and then stopped

`tools/surfacing.mjs` (`npm run surfacing`) is Mike's own ask made mechanical:

> *"Every exhibit needs a RHYTHM OF SURFACING, plus periodic SHORTS, to keep
> asset utilization honest — right now assets get built and sit and nothing asks
> what has not been shown."*

It re-cuts the ledger and the asset table **by wing** and appends one dated line
to `docs/SURFACING_LOG.md`. It is explicitly not a gate and does not schedule —
its header says a cron nobody runs *"would be a mechanism that claims a rhythm
it does not have."*

**The log's last line is dated 2026-08-06.** Twenty-two days ago. It was meant
to run at every session close and has not run since. Sixteen rounds have closed
in between.

And its own header says the thing that matters most here:

> **"IT DOES NOT COUNT SHORTS, and cannot. A short is a CUT, the storyboard
> doctrine and the cutting both live in the robots repo, and nothing in this
> repository can see whether one was made."**

### The other reel — and it must never be posted

`weird-baby-robots/docs/MAGIC8_ACTION_REEL-20260803.md` records a **1:54.5
review cut** of the 2021 Magic 8 footage, eight shots, 66,745,503 B, plus eight
individual clips. Its second paragraph is the important one:

> *"It is a review cut, and it is exempt from the obfuscation law under the one
> exemption … delivered out of tree, and marked, per-shot, with what it would
> fail if it shipped. **Nothing here is publishable. Nothing here becomes
> publishable by being copied.**"*

The doc gives its address as
`C:\Users\macun\OneDrive\Desktop - Laptop\MAGIC8_ACTION_REEL\`. **That
directory is not there today**, and a search of `OneDrive` for `*MAGIC8*` and
`*REEL*` at depth 3 returns nothing. Per OPERATIONS §8 that is evidence about
that address and nothing else — it may have moved, and the doc says the reel is
fully re-derivable from `IMG_1526.MOV` plus its in/out table. **Not reported as
gone; reported as not where the document says.**

Related material in the robots repo, none of it read in full this round:
`MAGIC8_VIDEO_ROUND-20260803.md`, `MAGIC8_SIGNATURE_STORYBOARD` v1/v2/v3,
`BURP_DOCTRINE-20260804.md`, `BURP_STORYBOARD_01-20260804.md`,
`BURP_LIBRARY_01.md`, `BURP_CALIBRATION_01-20260804.md`.

---

## 3. WHAT A REEL IS MADE OF HERE — AND WHERE THE LEAK IS

### The shelf IS held content. That is not an accident.

Both the bench and the compiler draw on the museum's own shelf —
`buildShelf()` in `tools/dictation/shelf.mjs`, deliberately **the same function
the artifact tracker calls**, per the shorts packet's own instruction: *"It must
read the actual shelf … Not a parallel list."*

Measured this round:

```
shelf rows                          138
  held path                         132   (96%)
  public path                         6

section        total   held
manual            61     61
photos             6      2
art                5      3
recordings        58     58
sound              2      2
tuning             3      3
plates             1      1
twin               2      2

mediaKind "image" — what the shorts bench offers:  78
  of those, held:                                  72   (92%)

drop: ruled 4 · neverPublished 3 · absent 8 · superseded 136 · elsewhere 76
```

**Six of the eight section tests match `public/held/robots/…` only.** The
shelf's ingredients are the held collection. A reel builder here is a machine
for pointing a camera at material that is behind the door.

### The four filters that exist

`buildShelf()` withholds, and counts what it withholds, because *"a silent
filter is indistinguishable from a bug"*:

1. **`RULED_OUT`** — 4 dropped. Keyed by **basename**, and each row carries
   Mike's words and a date. Doctrine 24 made mechanical: the CRT bezel, two
   red-marker construction plates, `monitor_base_markers.png`.
   **A warning that is written into the file itself:** this map records a ruling
   about a **USE**, not a list of forbidden **FILES** — on 2026-08-25 the
   Portal's bezel was reported as a public leak on exactly that misreading, and
   its publication is correct.
2. **`NEVER_PUBLISHED`** — 3 dropped. **The three WAV files.**
3. **`missing`** — 8 dropped, no file on disk.
4. **signage** — folded into `ruled`.

### The three WAVs, named

```
A-c91677cd90  public/held/robots/audio/burps/IMG_9766.wav   19,719,544 B
A-5a2157c5c1  public/held/robots/audio/burps/IMG_9767.wav   16,789,540 B
A-316b4575c1  public/held/robots/audio/burps/IMG_9768.wav   21,150,414 B
```

~57 MB. Mike talking while he shoots the burp clips. Ruling 2026-08-03(a), **NO
VOICE ON ROBOTS**: *"Mike's narration is a research artifact and is quoted as
text; nothing published anywhere in the robots wing carries his voice."*

Three things make this bar unusually well built, and they are worth knowing
before anyone touches it:

- **It is scoped to the CLASS, not to three filenames** — the test is
  `/^public\/held\/robots\/audio\/burps\//`. `BURP_LIBRARY_01.md` is numbered
  **01** and the doctrine expects more shoots; three basenames would be correct
  today and silently wrong at the fourth burp.
- **It is NOT in `RULED_OUT`, on purpose.** `RULED_OUT` means *Mike met this and
  said no*. He has never been asked about these. Filing them there would
  fabricate a ruling and put a date on it.
- **It is counted in its own bucket** (`drop.neverPublished`), never folded into
  `drop.ruled`, because they are different reasons.
- The rule lives in the **other** repository and the citation travels in the
  row rather than being imported, because that repo may not be beside this one.

**They cannot reach a reel by two independent routes.** The shelf drops them,
and the bench takes `mediaKind === "image"` only. Beyond that, **the pipeline
has no sound at all**: `audio` is reserved and `null` in the recipe format, and
`shorts-compile.mjs` never reads it. Every MP4 this machine makes is silent by
construction. Given ruling 2026-08-03(a), that is the right default and it
should be understood as load-bearing rather than unfinished.

### The obfuscation law governs a reel, and nothing enforces it

`docs/canon/10-LAWS.md` §THE OBFUSCATION LAW, adopted 2026-08-03, canonical text
at `robots:docs/canonical/OBFUSCATION_LAW.md`:

> **"It governs every image, clip, still, plate, thumbnail, poster, share card
> and preview the museum publishes of a physical MGK unit."**

**"clip", "preview" and "share card" are named. A reel is squarely inside it.**

Five articles: no full silhouette · every crop cut at a joint, panel or edge ·
enough to prove the machine is real, never enough to spend the reveal ·
**B&W is glass-level and never baked** · provenance establishable or it does not
ship. Plus: **the room is not the machine** (posters fair game, an identifiable
photographic portrait of a real person stays out, and *B&W does not cure a
portrait*); and **RE-ENCODE, ALWAYS** — the 2021 source files carry a GPS tag
locating a home address to ~65 m, so a source `.MOV` or camera-original `.JPG`
is **never published, under any circumstance, as any asset class**.

**Searched for a mechanical check. There is none.** Every hit for `obfuscat`,
`silhouette` or `article [1-5]` across `reveal/`, `provenance/` and `tools/` is
prose in a comment. **The obfuscation law is enforced entirely by human
discipline** — which puts it in exactly the company OPERATIONS §0 already names:
`provenance:gate`, `reveal:check`, `parity:gate`, `instory:gate`,
`docs:numbers`, `lap:clean`, **not one of which runs at deploy time.** The only
thing with teeth in this tree is `deploy-guard.mjs`, and it guards stage, not
content.

### THE LEAK, STATED PLAINLY

The compiler resolves an asset by uid straight out of `provenance/asset-table.json`
and reads the file off disk:

```js
const row = TABLE.find(r => r.uid === asset.uid);
const file = path.join(ROOT[row.repo] || REPO, row.path);
```

**There is no hold check, no publish check and no obfuscation check anywhere
between a recipe and an MP4.** The bench filters what Mike can *pick*; the
compiler filters nothing at all. A recipe that names a held uid compiles it.

**And this is not hypothetical — it has already happened.** Measured across the
committed recipes:

| recipe | blocks | held assets | public |
|---|---:|---:|---:|
| `teaser-30s` | 27 | **19** | 8 |
| `teaser-15s` | 12 | **7** | 5 |
| `the manual opens` (`recipes.json`) | 3 | **3** | 0 |
| `flashbang` | 2 | 0 | 2 |

`docs/shorts/out/teaser-30s.mp4` — **20.6 MB, on disk right now, ready to
upload** — is built from six held files:

```
public/held/robots/manual/page-01.png
public/held/robots/manual/page-12.png
public/held/robots/manual/page-38.png
public/held/robots/manual/page-44.png
public/held/robots/manual/page-56.png
public/held/robots/art/mgk-viiip-cover.png
```

Verified: **all six exist only at a held address. None has a public twin.**

```
manual/page-01.png        held:YES  public-twin:NO
manual/page-12.png        held:YES  public-twin:NO
manual/page-38.png        held:YES  public-twin:NO
manual/page-44.png        held:YES  public-twin:NO
manual/page-56.png        held:YES  public-twin:NO
art/mgk-viiip-cover.png   held:YES  public-twin:NO
```

`reveal:day` reports **152 governed pictures, 15 public, 137 behind the door**,
identical in DEVELOPMENT and LAUNCH.

**Two things must be said together, and neither on its own is honest:**

1. **Held is not the same as never-publishable.** Most of that 137 is scheduled
   to come out — the door changes, not the payload. A manual page in a teaser is
   a timing question, not automatically a violation.
2. **Nothing in the pipeline can tell the difference**, and the seven
   photographs that ARE in the teaser happen to be public ones. That is luck of
   the recipe, not a property of the machine. **A recipe naming a held
   photograph of the unit would compile exactly as readily**, and the law that
   would forbid it is enforced by nobody.

The good news, and it is real: **the output never touches Cloudflare.**
`docs/shorts/out/` is gitignored, nothing writes into `public/` or `dist/`, and
the compiler's header rules it explicitly. **The museum cannot leak this. Only
an upload can.**

---

## 4. WHAT SED MEANS FOR SOCIAL — WHERE THE SEAM IS

### There are two SEDs, and conflating them is a trap

**The narrow, older one — about the calendar.** Six uses in the tree, all this
meaning:

> **"SED: build for everyday drops, drop on the days you choose."** — Mike,
> 2026-08-24

Sites: `src/data/artists/record-epoch.js:140`,
`tools/dictation/emit-record-entries.mjs:195`, `vite.config.js:54`.

**The general one — ruled 2026-08-25**, and the tree had never carried it before
that day:

> **One shape, many instances, differing only in what fills it.**
> *"Don't build me a standalone turd; for god's sake at least put them all in
> one pile!"* — and its test: **the second instance is the test of the first.**

Written down first in `C:\AI\_night-20260825\DAY_EDITOR_SPEC-20260825.md`,
because *"the next project inherits it."*

### The seam is already drawn, and it is drawn in markers

`tools/dictation/day.mjs` is the first thing built under the general rule, and
**every part of it is marked**: **21 `[SHAPE]` markers** and **7
`[WEIRD.BABY]`** in that one file. Same scheme in
`tools/dictation/day-collect.js` and `tools/dictation/lighttable.mjs`.

> *"`[SHAPE]` is the editor any project gets. `[WEIRD.BABY]` is what THIS
> project fills it with. A project that adopts this brings its own vocabulary
> and gets the editor."*

And the seam is **named down to the constants**:

> *"everything pinning the machinery here is an exported constant in three
> files (`RECORD_SOURCE`/`RECORD_ENTRIES_EXPORT`/`RECORD_TRACK_ID`,
> `GOVERNED_PREFIX`/`STAGE_PREFIX`, `RECORD_EPOCH`)."*

### The Record's four parts, and which half each is

| part | SHAPE | WEIRD.BABY |
|---|---|---|
| **the entry** | the field set, the budgets, the formats, what draws and what is silent — `reveal/record-shape.mjs` | Mike's words in the slots, verbatim, typos carried |
| **the day** | `epoch + (n − 1)`, dumb, no weekend logic ever | `RECORD_EPOCH = 2026-09-07` |
| **the shelf** | `buildShelf()` — the filters, the drop counts, the sections | which 138 rows this museum happens to hold |
| **the day editor** | the whole page, read-only, deriving nothing it can read | the vocabulary, the constants above |

### `record-shape.mjs` is the model to copy

It exists because *"the tool let him write a 477-character executive summary
against a 130-character index budget and said nothing until a gate caught it
three rounds later. He must never again discover a limit from a report."*

It is **plain data, no imports, no side effects**, so *"the thing that ENFORCES
a limit and the thing that WARNS about it read the same line."* It carries:

- **`BUDGETS`** — the hard limits. `RECORD_TITLE_MAX = 62`,
  `RECORD_LINE_MAX = 130`. Each row names its `enforcedBy`.
- **`FORMATS`** — `DATE_PATTERN`, exact `YYYY-MM-DD`, and the note that
  **nothing reports a null**: the entry renders and silently loses its dateline,
  week, band and newspaper-door target.
- **`CONSTRAINTS`** — everything an entry is bound by *including what no gate
  catches*. **Six rows are marked `silent: true`** — a constraint whose breach
  produces no error anywhere, so the entry just quietly loses something. Those
  are marked rather than mixed in.

> *"Nothing here invents a rule. Every row names the file that already enforces
> it, and a row whose `enforcedBy` says 'nothing' is a statement about the tree,
> not a wish."*

### Where a post's seam would fall

**Shape:** a slot set with declared budgets per platform, a live counter on the
field, an aspect/duration/format declaration, and a `silent: true` column for
everything no gate can catch. That is `record-shape.mjs` with different numbers.

**Weird.Baby's:** the caption text, the handle, the cadence, which asset,
which day.

**And there is a third thing that is neither, which is where this gets
interesting.** The Record's schedule mechanism is:

> **"Which days get a Record is decided by WHICH ENTRIES EXIST, and that is Mike
> writing or not writing."** … **"A GAP IN THE NUMBERS IS NOT A DEFECT** — 001–005
> followed by 008 means nobody wrote on three days — **and a later round must not
> 'fix' one."**

An entry is simultaneously **the plan and the receipt.** There is no second
place recording that Record 003 went out, because the entry's existence *is*
that record. That is the property a post needs and does not have, and it is
covered in §5.

---

## 5. WHAT IS MISSING ENTIRELY

Plainly. In the order that a relaunch on 2026-09-07 would meet them.

### 1. There is no post record. Nothing knows what went out.

**This is the largest hole and it is structural, not an oversight.**
`surfacing.mjs` says it in its own header: *"nothing in this repository can see
whether one was made."* There is no publish log, no posted-on field, no platform
id stored anywhere, no equivalent of `docs/SURFACING_LOG.md` for output. Files
in `docs/` matching post/publish/social are all about **embedding other artists'
Facebook posts** (`FB_POST_EMBED_*`, `FINDING-fb-post-clip.md`).

A schedule with no record of what went out is not a workflow — it is an
intention. **The Record already solves this and the solution is free:** the entry
IS the receipt. Whatever a post record turns out to be, it should have that
property.

### 2. There is no schedule of any kind, and nothing can run one.

No cron in `wrangler.jsonc`, no scheduled worker, no queue, no CI in either
repo. OPERATIONS is emphatic that this is deliberate — the museum's own launch
fires because the deployed worker plays the bundle against **request time**,
with *"no cron, no queue, no scheduled job and no person in the loop."*

**So "Robots 3×/week" has nowhere to live.** Three schedules would need either a
mechanism this project has consistently refused, or the Record's answer: a
cadence that is *whether Mike wrote today*, with the gaps honest and not
"fixed".

### 3. No account, handle or platform id is known to either repository.

M60 has been open since **2026-08-05**. The accounts now exist in the world and
the tree still cannot name them. **A handle is not something Ops may invent** —
this is Mike's to supply, and it is the one item on this page that blocks
others: the FAQ sentence, any share card, any post that links back.

### 4. Nothing checks a reel before it is posted.

Between `docs/shorts/out/*.mp4` and YouTube there is **one human**. No gate reads
a recipe for held paths. No gate reads it for obfuscation articles. The
obfuscation law names clips and previews explicitly and is enforced by nothing
mechanical anywhere in either tree.

The cheap version of this is not a renderer — it is a **read of the recipe**:
every uid, its current `row.path`, held or public, and whether it is a
photograph of the unit. That is the same shape as `reveal:day` and it would
have printed the teaser's six held pages in one line. **Not built, and not
proposed here — named as the gap.**

### 5. The rhythm instrument stopped 22 days ago.

`docs/SURFACING_LOG.md` last ran 2026-08-06. It is supposed to run at every
session close beside the other gates, *"which is the only clock this repo
actually has."* Sixteen rounds have closed since. The trend it exists to produce
has a 22-day hole in it, which is most of the window between then and the
relaunch.

### 6. The Twitter card is advertising a shut wing. (§2 above.)

CH6's hold covers two of three descriptions; the third was silently unified into
the same wording on 2026-08-17 and is not rewritten. **M68 asks a question that
a later commit answered without closing the row.**

### 7. There is no bridge from a reel back to the museum.

The museum knows the Coconuts **video**. It does not know a reel exists, cannot
link one, and has no surface that would show one. Backlog item 3's own last
clause is the argument for caring: *"Everything else on this page improves a
museum nobody has found."*

---

## 6. THINGS A LATER ROUND SHOULD NOT GET WRONG

- **The MP4 is not the artifact. The recipe is.** `docs/shorts/out/` is
  gitignored on purpose and the reasoning is at `.gitignore:85–92`. Do not
  "fix" that by committing the videos.
- **`RULED_OUT` is a map of rulings about USES, keyed by basename. It is not a
  list of forbidden files.** Reading it the other way already produced one false
  leak report, on 2026-08-25.
- **The burp WAV bar belongs in `NEVER_PUBLISHED`, not `RULED_OUT`**, and it is
  scoped to the path class rather than three filenames. Both choices are argued
  in the file. Do not "tidy" them together.
- **The pipeline is silent by construction and that is correct** — ruling
  2026-08-03(a). `audio: null` is reserved, not unfinished.
- **The flashbang is a transition, not an ending.** Mike remembers it as ending
  with the bang. Building a reel that ends on the flashbang is a real option,
  but it is a change to what the template is, and it is his call.
- **`shorts.html` is 254 KB and tracked**; `docs/shorts/out/` is not. Running
  `npm run shorts` regenerates the page — and OPERATIONS §8 warns that a
  generator whose output was hand-edited deletes the edit silently.
- **A grep of HEAD cannot see lost work.** If a reel or a schedule is
  remembered and not found, the search that finds it is: the round log of the
  day it landed, then `git log --all -S` on **content**, then
  `--diff-filter=D`, then **the other repository**, then `git fsck`, then
  off-git disk. That is OPERATIONS §8's own list and it has already been paid
  for twice.

---

## 7. WHAT WAS RUN

All read-only. `reveal/day.mjs` and `tools/dictation/shelf.mjs` were executed as
reports; nothing was rendered, regenerated or written into either tree.
`npm run shorts:flashbang` was **deliberately not run** — it would overwrite
`docs/shorts/out/`. Its health was established from the resolved recipe, the
asset table, the files on disk, their sha256s, and the surviving output.

Two PNG frames were read as images:
`f0009_t0.300.png` (the lead-in) and `f0118_t3.933.png` (the reveal).

**Ops looked before Mike did.**
