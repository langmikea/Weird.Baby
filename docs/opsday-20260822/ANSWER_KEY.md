<!-- CONDUIT: HEAD 427140b · 2026-08-22T13:08:58Z -->

# OPS DAY — ANSWER KEY

Read-only across both repos. Nothing here changed the museum.
`READ` = I read the source. `RUN` = I executed or rendered something and
observed the result.

---

## Q1 · How does the site get published, and what happens if it is published the other way?

**MARK: RUN** (guard executed both ways) **+ READ.**

### The correct path

```
npm run deploy:launch
  = npm run build:launch                      (node tools/stage-build.mjs --launch)
  && node tools/deploy-guard.mjs --launch
  && wrangler deploy
```

`package.json` `scripts.deploy:launch`. **Mike runs it; Ops never does**
(`docs/canonical/OPERATIONS.md` §0 *MIKE IS THE LOCK*, §1).

### The other way, and what actually happens — this is not what the standing brief says

```
npm run deploy = npm run build && node tools/deploy-guard.mjs && wrangler deploy
```

`npm run build` is `vite build`, which builds `DEFAULT_STAGE`, and
`DEFAULT_STAGE = DEVELOPMENT` (`reveal/stage.mjs:77`, with `DEVELOPMENT` and
`LAUNCH` at `:72–73`).

**BUT IT DOES NOT PUBLISH. IT IS REFUSED.** `tools/deploy-guard.mjs` [CH5,
2026-08-12] sits between the build and `wrangler deploy` on **both** paths and
exits non-zero on four separate conditions:

| # | condition | line |
|---|---|---|
| 1 | no built worker at `dist/weird_baby/index.js` | `:52–59` |
| 2 | the worker does not state exactly one stage | `:64–72` |
| 3 | the built worker's stage ≠ the stage asked for | `:75–85` |
| 4 | `dist/` older than the newest file in `src`/`public`/`reveal` | `:88–108` |
| 5 | development requested without `--i-know-this-publishes-development` | `:110–126` |

**RUN, just now, against the current `dist/` (a launch build, mtime Aug 22 08:00):**

```
$ node tools/deploy-guard.mjs            # the plain-deploy path
deploy REFUSED — the built worker is LAUNCH and you asked to publish DEVELOPMENT.
exit=1

$ node tools/deploy-guard.mjs --launch
  deploy-guard OK — built worker is launch, and that is what you asked for.
exit=0
```

**I could not exercise condition 5** (the acknowledgement branch) without
producing a development build, which would write `dist/` and is outside this
brief. Condition 5 is **READ only**, from `:110–126`. What it says verbatim:

> deploy REFUSED — this publishes the DEVELOPMENT stage. … In DEVELOPMENT the
> pull-back rule is NOT applied. Publishing this puts the Portal, the held
> photographs and everything behind the stage door on weird.baby, readable by
> anyone. That is what every deploy this week did.

### The consequence in concrete terms, if the guard is answered rather than heeded

`npm run deploy -- --i-know-this-publishes-development` is the documented way
through. What it would put on weird.baby, measured on the tree at this HEAD:

```
$ find public/held -type f | wc -l      ->  137 files
$ du -sb public/held                    ->  186,888,028 bytes (178.2 MB)
     robots/manual      120,346,035
     robots/audio        62,074,934
     robots/art           2,474,398
     robots/reference     1,949,206
     robots/twin             25,683
     robots/plates           17,772
```

**The guard's own header records that this already happened**: *"every deploy
this week published the DEVELOPMENT stage to weird.baby"* (`:4–9`).

**The fix was deliberately not a flipped default** — `DEFAULT_STAGE` stays
`development` because that is Mike's word, and the guard says so at `:12–17`.
And it **reads the built artifact, not its own environment** (`:20–27`), because
the project has already shipped a launch client with a development worker.

**RUN, live now:** `curl -s https://weird.baby/api/held` →
`{"open":false,…,"stage":"launch"}`. The site is on the correct stage today.

### Files opened, in order
`package.json` → `tools/deploy-guard.mjs` → `tools/stage-build.mjs` (line count
only) → `reveal/stage.mjs` → `dist/weird_baby/index.js` (stat) → `public/held/**`
(count + bytes) → `src/routes/WbAdmin.jsx:138`, `src/worker.js:92,103` (for the
published figure of 144).

**Settled it:** `tools/deploy-guard.mjs`, by being run.
**Expected to settle it and did not:** `CLAUDE.md` and the standing brief, which
both say plain `deploy` *would publish* the development stage. Since CH5 it does
not — it refuses. See INSTRUMENTATION.

---

## Q2 · A visitor downloads the quality-form attachment — what do they receive, and what is it called in the story?

**MARK: RUN** (live fetch, image decode, dimension read) **+ READ.**

### The museum offers no download at all — and this is the first half of the answer

**Proven absent, not assumed.** Commands run from the museum repo root:

```
grep -rn 'download=' src/                                     -> 0 hits
grep -rn 'Content-Disposition' src/                           -> 0 hits
grep -rni 'attachment' src/worker.js                          -> 0 hits
grep -rnE 'createObjectURL|saveAs|showSaveFilePicker' src/    -> 0 hits
grep -rn 'download' src/routes/exhibit/                       -> 2 hits, both prose in comments
grep -rn '<a ' src/routes/exhibit/RecordEntry.jsx             -> 0 hits
```

The two prose hits are `src/routes/exhibit/Exhibit.jsx:3447` and
`src/routes/exhibit/RecordAttachments.jsx:15`. The second is the design rule
itself: *"There is no sender, no recipient, no subject, no forward, **no
download-all**, no count badge, no envelope."*

An attachment row **opens** — `fire()` in `src/routes/exhibit/RecordEntry.jsx:505–531`
calls `openLink(set[…].img, …)` and the payload opens *"in the wing's own
reader"* (`RecordAttachments.jsx:39–41`). **So "downloads" can only mean the
browser's own Save Image on the rendered picture.**

### What the bytes are

**RUN:**

```
$ curl -s -o /dev/null -w '%{http_code} %{size_download} %{content_type}' \
       https://weird.baby/robots/portal/qc-101-a.webp
  200  77630  image/webp
```

Declared at `src/data/artists/robots-record.js:685` —
`{ img: "/robots/portal/qc-101-a.webp", label: "Final test and inspection, completed and passed" }`.
On disk: `public/robots/portal/qc-101-a.webp`, 77,630 bytes.
**RUN (PIL):** `1700 × 2200`, WEBP.

### Every step from the name in the story to those bytes

| step | what it is | where |
|---|---|---|
| 1 · in-story name | `QC_101.TIF (hand written notes on form)` — a line in the cracked ZIP's folder tree | `robots-record.js:531` |
| 2 · in-story title | `QC_101 - Final test and inspection` | `robots-record.js:681` |
| 3 · in-story source | `ABEAL FORM QC-101` | `robots-record.js:682` |
| 4 · the master | `robots/mgk-viiip/portal/install/QC_101.png`, **2,413,763 bytes, 2550 × 3300 at 299.9994 dpi** (= 8.5 × 11 in) | robots repo |
| 5 · the derivative | `/robots/portal/qc-101-a.webp`, 77,630 bytes, 1700 × 2200 | museum repo |

**Step 1 → 2 is governed by Ruling 19** (`docs/MUSEUM_RULINGS-20260817.md:538–560`):
*"the in-story name inside the archive (`.TIF`), the master the tooling actually
renders (`.png`, 300 dpi, robots repo), and the derivative a visitor downloads
(`.webp`, 1700x2200 q82, museum repo)"* — **three links, and only the middle one
is a real file.** Step 4 → 5 is governed by Ruling 14, cross-referenced at
`:428–429`.

**I verified the ruling's own load-bearing claim rather than inheriting it. RUN:**

```
$ find <museum>  -iname '*.tif' -o -iname '*.tiff'   ->  0 files
$ find <robots>  -iname '*.tif' -o -iname '*.tiff'   ->  0 files
```

**There has never been a TIF in either repository.** The `.TIF` a visitor reads
in the folder listing is a name in a story and nothing else.

Mike chose the title in-round; it is filed **HOUSE, not MIKE**, because selecting
an Ops-composed string is not authorship (`robots-record.js:648–660`).

### Files opened, in order
`src/data/artists/robots-record.js` → `public/robots/portal/` (listing) →
`src/routes/exhibit/RecordEntry.jsx` → `src/routes/exhibit/RecordAttachments.jsx`
→ robots repo `find` for masters → `docs/MUSEUM_RULINGS-20260817.md` §19.

**Settled it:** `robots-record.js:681–686` for the chain, the live `curl` for the
bytes, and Ruling 19 for why the two names differ.
**Expected to settle it and did not:** `RecordEntry.jsx` — I opened it looking
for a download control and found the opposite, which turned out to be the answer.

---

## Q3 · How many voices does the machine have?

**MARK: READ.** I did not run the twin's Voice menu; the count is read from the
menu table, the handler and an independent ledger row that agree.

### Eleven

`Preferences › Voice` carries `Voice 00` … `Voice 10` — eleven rows, plus
`< Back` and the `.end` sentinel, which are furniture and not voices.
Source: `MENU_TABLE_SRC`, `tools/viiip_twin.html:2077`, final block:

```
[["Voice","Voice 00"],["Voice","Voice 01"], … ,["Voice","Voice 10"],
 ["Voice","< Back"],["Voice",".end"]]
```

**Three independent corroborations, two of them outside the menu table:**

1. the handler comment — `tools/viiip_twin.html:2257`: *`case VOICE: /* [TWIN
   DELTA] one line, and 11 rows become real */`*
2. the twin's own dev note — `:1200`: *"Voice ×11 (one line)"*
3. **the museum's ledger, a different repository** —
   `reveal/ledger.json`, row `twin.app.voice`: *"Voice — **eleven slots**; one
   line sets the current one."* (`build: PARTIAL`, `state: REVEALED`).

### What is NOT the answer, recorded because it is the trap

- **The `Answers` menu has ~22 named personas** (`MGK-NIAC`, `The CEO`, `The
  Informer`, `The Gambler` …, `:2077`). Those are **answer engines**, a different
  axis from voice.
- **"8" appears three times and is an INDEX, not a count**:
  `let currentVoiceID=8; /* TESTING - default to CEO [main:140] */` (`:1855`),
  *"default voice 8 (CEO)"* (`:1196`), and the chip at `:2259`.

**CONTESTED — recorded, not resolved.** The chip string at `:2259` reads:

> `voice set to slot N (firmware hardcodes 8; per-engine voices override - spec s3)`

*"firmware hardcodes 8"* is genuinely ambiguous prose: it can be read as *the
firmware hardcodes voice 8* (consistent with `currentVoiceID=8` and eleven slots)
or as *the firmware hardcodes 8 voices* (which would contradict the eleven).
**Both readings sit in one sentence and nothing in either repo disambiguates
them.** I am not picking.

### An absence, with the search

**No in-story document states a voice count.**

```
grep -rin 'voice' robots/mgk-viiip/manual/  content/ \
     --include=*.md --include=*.csv --include=*.txt --include=*.json   ->  0 hits
```

And the spec the chip cites does not exist in the tree:

```
grep -rn 'spec s3' <robots>/docs/ <robots>/tools/viiip_twin.html   ->  1 hit,
    and it is the chip string itself (tools/viiip_twin.html:2259)
```

So the eleven is a **firmware/menu fact with no manual behind it**.

### Files opened, in order
robots `tools/viiip_twin.html` (grep for `voice`, then `:2077`, `:2255–2262`,
`:1196`, `:1200`, `:1855`) → robots `robots/mgk-viiip/manual/` + `content/`
(absence search) → museum `reveal/ledger.json` (`twin.app.voice`).

**Settled it:** `tools/viiip_twin.html:2077`.
**Inferred, because no file says it outright:** that `< Back` and `.end` are not
voices. Every other menu block in the same table carries the identical pair, so
they are structural — but nothing declares it.

---

## Q4 · The share card's lettering argues with the museum's self-description. What is Ops permitted to do about it?

**MARK: RUN** (image rendered and read; live meta fetched) **+ READ.**

### What the card says — RUN, by opening the image

`public/share-card.png`, 28,159 bytes, 1200 × 630 PNG. Rendered, it reads:

```
                    Weird.Baby
                     MUSEUM
        ─────────────────────────────
              PURVEYORS OF THE WEIRD
     NO ADS  ·  NO AFFILIATE LINKS  ·  NO CUT
```

Corroborated by `provenance/asset-table.json`, row `A-b675b62d27`
(`path: public/share-card.png`), whose `what` field is:
*"The link-preview card — WEIRD.BABY / MUSEUM / PURVEYORS OF THE WEIRD / NO ADS,
NO AFFILIATE LINKS, NO CUT, set on house paper in a ruled box."*
That row carries `role: shipped`, `usedBy: ["index.html"]`, `quality: usable`,
and **`verdict: null`, `bucket: null` — nobody has judged it.**

### What the museum currently says — RUN, off the live site

```
$ curl -s https://weird.baby/ | grep -oE '<meta …(og:|twitter:)?description…'
  name="description"        content="A free museum of weird things worth keeping. …"
  property="og:description" content="A free museum of weird things worth keeping. …"
  name="twitter:description" content="A free museum of weird things worth keeping. …"
```

All three identical, character for character:

> A free museum of weird things worth keeping. Robots arriving one day at a
> time, music worth a listen, and a guest book that remembers who got here early.

Declared at `index.html:49`, `:107` and the twitter tag; **Mike's copy, ruled
2026-08-17** (`index.html:85–97`).

### Where the argument is — two places, and only one is an orphan

1. **`NO ADS · NO AFFILIATE LINKS · NO CUT` is the clause Mike STRUCK.** The
   note at `index.html:85–90` names the replaced C4 wording once, per Doctrine
   24: *"A museum of weird things worth keeping. The MGK robots, and music worth
   a listen. **No ads, no affiliate links, no cut of anything you buy from an
   artist.**"* The sentence lost that clause on 17 Aug. **The card still carries
   it.**
2. **`PURVEYORS OF THE WEIRD`** — *purveyors* are sellers; the sentence now
   opens *"A free museum"*. **But this one is not an orphan:** the same phrase is
   live elsewhere as visitor-facing copy —
   `src/data/artists/robots.js:753`, `viewerPosterCaption: "Weird.Baby —
   purveyors of the weird."` — and `robots.js:469` records that it is *set into*
   the WELCOME tagline. The tension is real; the card is not alone in it.

**The no-ads clause is still true and still live in prose** — `foundation.js:918`,
`worth-a-listen-facts.js:568`. What changed is that it is no longer the sentence
the museum leads with.

### What Ops is permitted to do

**LOOK, MEASURE, REPORT. Nothing else.**

- **Both halves are visitor-facing copy, and copy is Mike's.**
  `docs/canonical/OPERATIONS.md` §0 *WHO DECIDES WHAT*: *"WHAT WE DO = UX, and
  that is Mike's."* §1: *"Claude … never decides UX."*
- **The card is lettering baked into an image, which is the case the doctrine
  singles out.** `CLAUDE.md`, THE LAW OF THE VISIBLE LINE: the largest
  placeholder in the building was *"marker lettering painted into a JPEG"* and
  *"it took a screenshot to find"*. Ops is expected to **lap the glass** — which
  is why this answer opened the PNG — and then stop.
- **FLAG, NEVER FIX** — §0 *VERBATIM*. Ops may not edit the sentence to match the
  card, and may not re-letter the card to match the sentence. Either is Ops
  writing museum copy.
- **There is no generator to re-run, so "regenerate it" is not an option that
  exists.** Proven:
  ```
  grep -rn 'share-card' tools/                                  -> 0 hits
  find . -iname '*share*card*' (excl node_modules/.git/dist)    -> 1 result:
        ./public/share-card.png
  ```
  The PNG is the only artefact; nothing in the repo builds it.
- **Ops may not even record a judgement on it.** `verdict` and `bucket` on the
  asset row are Mike's fields — `CLAUDE.md`, Doctrine 20: the judged field is
  *"Mike's, null on all 475 rows … and Ops does not derive it."*
- **The precedent for exactly this situation is on the record and it is
  report-only.** `docs/MUSEUM_LOBBY_OPENS_LOG-20260811.md:97` — *"A5 — the three
  share-card descriptions, verbatim, not rewritten"* — and at `:40`, *"The three
  share-card descriptions are A5 and are **report-only**."* The log's own verdict
  on that round: **"Nothing was added. Mike rules."** (`:95`).

**So: Ops writes it down and hands it over. That is the whole permission.**

### Files opened, in order
`index.html` → `public/share-card.png` (rendered) → `provenance/assets.json`
(grep, 0 hits) → `provenance/asset-table.json` (shape, then row `A-b675b62d27`)
→ `docs/MUSEUM_LOBBY_OPENS_LOG-20260811.md` → `src/data/artists/robots.js:469,553,753`
→ `src/worker.js:190–246` → live `curl`.

**Settled it:** the rendered PNG beside the live `curl`.
**Expected to settle it and did not:** `provenance/assets.json` — I assumed the
image register would carry a note about the lettering; it has **no** share-card
row at all (`grep -n 'share-card' provenance/assets.json` → 0). The description
lives in `asset-table.json` instead.
**A probe I got wrong first:** my initial read of `asset-table.json` reported
*"total rows: 10"* and *"share hits: 0"*. That was the probe, not the file — the
rows are under `.entries` (475 of them) and the ten top-level keys are metadata.
Re-measured; the row was there.

---

## Q5 · What has the museum promised a visitor and not yet delivered?

**MARK: RUN** (live pages walked) **+ READ.**

The tree answers this on **two different axes**, and they are not the same list.

### A · What the MUSEUM promised — the ledger has a field for exactly this

`reveal/ledger.json`, 176 rows. Its own definition: `shown` means *"a visitor can
READ THE LABEL of something not built — the difference between a gap and a
debt"* (`docs/canonical/OPERATIONS.md` §5, THE REVEAL LEDGER row).

**RUN, over the ledger:**

```
shown:true AND build != LIVE   ->  10 rows, all NOT_BUILT, all state HELD
state REVEALED AND build != LIVE -> 7 rows, all PARTIAL
```

The ten debts: `portal.feed.last-state` · `portal.feed.test-bench` ·
`portal.dial.seeded` · `doc.manual.plates` · `wal.artifacts` · `door.coalition` ·
`shop.friends` · `channel.qr` · `channel.supplies` · `channel.services`.

The seven partials: `route.admin` · `face.wbr.record` · `twin.app.messages` ·
`twin.app.voice` · `doc.record` · `sound.slosh` · `wal.banners`.

**CONTESTED, and recorded rather than resolved.** Two of the ten are marked
`state: HELD` — *a visitor cannot reach them* — and **a visitor can reach them.**

- **The ledger says HELD:** `portal.feed.last-state`, `portal.feed.test-bench`
  (`reveal/ledger.json`). The schema forces this: `NOT_BUILT` + `REVEALED` is
  refused outright — *"a visitor is being shown something that does not exist"*
  (`reveal/schema.mjs:217–218`), and `REVEALED` requires a `reach` (`:214–215`).
- **The live site says otherwise. RUN, `https://weird.baby/robots`, this
  session:** stepping the FEED readout through all five banks returns

  ```
  PATCHED    -> FEED ARMED (latch live)
  COLD START -> FEED ARMED (latch live)
  FIRST RUN  -> FEED ARMED (latch live)
  LAST STATE -> NOT ARMED (latch disabled)
  TEST BENCH -> NOT ARMED (latch disabled)
  ```

  Both labels are on the glass, on the public site, today.

**The Portal is deployed and anonymous. RUN:** the live index references
`assets/portal-vvKQR9pB.js` — a **public** path, not `assets/held/` — and

```
curl (no cookie) /assets/portal-vvKQR9pB.js  -> 200, 2203 bytes
curl (no cookie) /robots/twin.html           -> 307 -> /robots/twin -> 200, 646,634 bytes
grep 'wb-held-open' in the live index        -> 1 occurrence, and it is not on the
                                                portal import, which is a bare
                                                `import("./portal-vvKQR9pB.js")`
```

### B · Two rooms a visitor can walk into that are empty — RUN

`https://weird.baby/foundation` offers tracks `01 The Short Story`,
`02 The Long Story`, `03 FAQ`. Opening track 01, the **entire** body text of the
page is:

```
Weird.Baby | THE FOUNDATION | LOBBY | < | > | THE FOUNDATION |
01 | The Short Story | 02 | The Long Story | 03 | FAQ |
The Short Story | THE WEIRD.BABY FOUNDATION
```

**136 characters, and none of them is the Short Story.** The room is a heading.

Declared at `src/data/artists/foundation.js:1134–1138`; the FAQ points at both —
`:592` *"Read 'The Short Story'"*, `:593` *"If you want to know more, read 'The
Long Story'."* Register row **S-f** (`docs/OPEN_ACTIONS.md:193`) and backlog row
16a (`:40`) both record them as empty and as Mike's to write.

### C · What the STORY promised — the Records' own unfulfilled claims

`docs/ARC.md` §3 carries the derived list: **18 open promises** across Records
001–005, each marked with the Record that made it. The heaviest are the four
personnel folders (`PERSONNEL/CEO|INFORMER|EVERYDAY|GAMBLER`, named in Record 002's
manifest, described-but-unopened in Record 003), `00-FRONTMATTER.tif`,
`TERMINAL.EXE`, `PORTAL_2v16.CFG`, and the two password-protected folders
`/ANTENNA (PWD)` and `/CHANNEL_SELECT(PWD)` against Record 005's *"we have
reached the capability limit of brute force."*

**Sourced to the Records themselves**, not to the summary:
`src/data/artists/robots-record.js` — 002's ADDENDUM 01 manifest, 003's ADDENDUM
02 personnel block, 004's ZIP tree at `:528–531`, 005's detailed report at
`:746–752`.

**A precedent that belongs in the answer:** Record 002's `_tmp/ < password bit
not set` line and its closing *"! The last entry is the only one we can open"*
were **struck before publication** — `robots-record.js:350–359`, which records
the reason as *"Ops does not promise back what we do not have yet."* A named
thing in a list is a promise; deleting it before it ships is cheaper than owing
it.

### Files opened, in order
`reveal/ledger.json` → `reveal/schema.mjs:205–232` → live `https://weird.baby/robots`
(walked) → live index bundle (fetched, grepped) → anonymous `curl` of the portal
chunk and the twin → `src/data/artists/foundation.js` → live
`https://weird.baby/foundation` (walked) → `docs/OPEN_ACTIONS.md` →
`docs/BACKLOG.md` → `docs/ARC.md` §3 → `src/data/artists/robots-record.js`.

**Settled it:** the ledger for axis A, the live pages for axis B, the Records for
axis C. **No single file answers this question** — see INSTRUMENTATION.

---

# INSTRUMENTATION

## The shortest set of files that would have answered all five without exploring

Seven files, and **they do not exist as a set today** — this is the shape, not a
claim that reading them is enough:

| # | file | answers |
|---|---|---|
| 1 | `tools/deploy-guard.mjs` | Q1 entire — the header alone states the correct path, the wrong one, and why |
| 2 | `docs/MUSEUM_RULINGS-20260817.md` §19 | Q2's naming chain, all three links |
| 3 | `src/data/artists/robots-record.js` | Q2's bytes, Q5 axis C |
| 4 | `tools/viiip_twin.html:2077` | Q3 |
| 5 | `index.html:33–108` + `public/share-card.png` | Q4's two texts — **and the PNG must be opened, not read** |
| 6 | `docs/canonical/OPERATIONS.md` §0 | Q4's permission |
| 7 | `reveal/ledger.json` | Q5 axis A |

**Q5 has no shortest file.** Its three axes live in a ledger, a live page and a
Record, and nothing joins them. `docs/ARC.md` §3 joins axis C only, and it was
written yesterday.

## Contradictions found — recorded, not resolved

**C1 · The standing brief vs. the deploy guard.**
The brief and `CLAUDE.md` say plain `npm run deploy` *"builds the development
stage and would publish 144 held files."* Since CH5 (2026-08-12) it **refuses**
and publishes nothing without a typed acknowledgement flag.
Sources: the brief; `CLAUDE.md` *Release flow*; against
`tools/deploy-guard.mjs:110–126`, confirmed by running it.

**C2 · The ledger says HELD; the live site shows the label.**
`portal.feed.last-state` and `portal.feed.test-bench`, `state: "HELD"` in
`reveal/ledger.json`, against the live `/robots` FEED readout stepping to both,
observed this session. `reveal/schema.mjs:214–218` is why the rows cannot say
otherwise, so the contradiction is structural rather than a typo.

**C3 · "firmware hardcodes 8" vs. eleven voice slots.**
`tools/viiip_twin.html:2259` against `:2077` and `:2257`. Count or index — the
sentence supports both and nothing settles it.

**C4 · The Blog.**
`docs/OPEN_ACTIONS.md` S-f and `docs/BACKLOG.md` 16a both describe **three**
empty Foundation tracks — *The Short Story · The Long Story · The Blog* — and
`foundation.js:1104` names all three. The live `/foundation` deck carries
`01 Short Story · 02 Long Story · 03 FAQ`. **No Blog track is on the site.**

## Stale

**S1 · `144 held files` is now 137.**
`src/worker.js:92` and `:103`, `src/routes/WbAdmin.jsx:138` all publish 144.
Measured at this HEAD: `find public/held -type f` → **137**. Eight files moved to
public addresses when the Portal was published on 2026-08-22.

**S2 · `CARD_WHILE_SHUT` is dead code carrying a retired sentence.**
`src/worker.js:205–207` holds *"A museum of weird things worth keeping. No ads,
no affiliate links, no cut of anything you buy from an artist."* — the pre-17-Aug
wording. It is applied only when `!wingOpen` (`:233–241`), and the wing opened
with Record 001. Its own comment (`:204`) says *"the day the wing arrives the
worker stops touching it."* That day has passed. **It would also now override
only two of the three tags**, leaving a fourth wording live if the wing ever shut.

**S3 · `delivery.mjs`'s note on the twin was overtaken.**
`reveal/delivery.mjs` `NOT_A_PICTURE` — I corrected its comment yesterday; the
underlying point is that a rule about pictures had been carrying a hold's reason.
Recorded here because the pattern recurs.

**S4 · A path that has moved.** `src/data/artists/portal.js` addressed
`/held/robots/twin.html` until 2026-08-22; it is `/robots/twin.html` now, and the
platform 307-redirects that to `/robots/twin`.

## Findings that are neither stale nor contested, but nobody has written down

**F1 · The worker injects its clock into the twin.**
Now that `twin.html` is served as public HTML, `injectClock` (`src/worker.js:210+`)
prepends to its `<head>`. **RUN, byte-diff of disk against served:** first
difference at char 1755 —

```
SERVED: <html><head><script>window.__WB_TODAY__="2026-08-21";
        window.__WB_NOW__=1787404076996;window.__WB_RECORD_ALL__=false;</script><meta charset…
DISK  : <html><head><meta charset…
```

646,521 bytes on disk, 646,634 served. The twin receives three globals it never
asked for. Nothing appears to break; it is simply undeclared.

**F2 · A probe I nearly filed as a bug.** `__WB_TODAY__` reads `2026-08-21` while
today is the 22nd. That is **correct**: the Record day turns over at **17:00
America/New_York**, not midnight — `reveal/record-clock.mjs:46` and `:52–56`. I
re-measured before writing it down. Rule 6 earned its place.

**F3 · The one absence that is a hole rather than a design.** The chip at
`tools/viiip_twin.html:2259` cites *"spec s3"*. That string appears exactly once
in the robots repo, in the chip itself. There is no s3.

## Anything inferred because no file said it outright

- **Q3** — that `< Back` and `.end` are furniture and not voices. Every menu
  block in `MENU_TABLE_SRC` carries the same pair; nothing declares it.
- **Q2** — that "downloads" means the browser's own Save Image. The museum
  provides no download control (proven above), so the question's premise can only
  be satisfied that way. **No file says this.**
- **Q1** — that the guard's condition 5 fires as written. **Not run**, because
  exercising it needs a development build.
- **Q5** — that axes A, B and C are the same question. Nothing in the tree joins
  them; the grouping is mine.
