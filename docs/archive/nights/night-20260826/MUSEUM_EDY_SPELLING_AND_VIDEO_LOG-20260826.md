# E.D. YAHDAH — THE VIDEO LANDS, THE SPELLING STANDS
Round log, 2026-08-26. Base HEAD `c41ecae`, tree clean at start.
**Two files changed, 81 insertions, ZERO deletions.**
Nothing committed, nothing pushed, nothing deployed.

**This file replaces an earlier version of itself written under ruling B, which
Mike reversed. Nothing in it describes the reverted work as current.**

---

## 0 — THE RULING, AND THE REVERSAL

**Ruling B (issued, then reversed):** *"E.D. Yadah, no h. The museum's spelling
is wrong and YouTube is right."* Ops carried it out — the track title, a header
comment, the register row and the asset-table prose all moved to `Yadah`.

**Ruling A (STANDS):** **`E.D. Yahdah` is correct. The museum is right and the
channel is wrong.** Mike corrects the video's title on YouTube when convenient.

**THE REASON IS A RULE ABOUT THIS CLASS OF EDIT, NOT ABOUT THIS WORD, AND OPS
SURFACED IT WITHOUT ACTING ON IT.** The surface report named four references
carrying `yahdah` that **cannot move**:

| reference | why it cannot move |
|---|---|
| `id: "ed_yahdah"` | identity — §0, *no id moves when a legend is recut* |
| rendition `id: "audio_wb_05_..."` | **derived** from the path by `id = ytId ?? slug(audioUrl)` |
| `audioUrl` | must match the file on disk |
| `public/audio/wb/05_ed_yahdah_2026-06-16.mp3` | an asset-table row with a sha256 under it |

**So correcting the glass would have left the identity spelled the other way —
and if that spelling is what the recording was registered under, the identity is
the half that matters.** Changing the visible half and stranding four unmovable
references is the wrong half to change. Ops ruled B having listed those four in
the same report and not weighed them.

---

## 1 — THE REVERT, PROVED RATHER THAN ASSERTED

The three edited files were returned to HEAD with
`git checkout -- <the three paths>`, confirmed clean, and **only the video was
re-applied.** That makes the proof structural instead of a claim:

    git diff --stat
      provenance/register.json       |  7 ++++
      src/data/artists/weird-baby.js | 74 ++++++++++++++++++++++++++++++++++++++++++
      2 files changed, 81 insertions(+)

    git diff | grep '^-' | grep -v '^---'
      (no output)

**ZERO REMOVED LINES ANYWHERE IN THE DIFF.** No existing line was touched, which
includes every one of the eight `Yahdah` occurrences in `weird-baby.js` and both
in `register.json`. `provenance/asset-table.json` is **byte-identical to HEAD**
and is no longer in the changed set at all.

Confirmed on the built LAUNCH bundle: **`E.D. Yahdah` ×1, `E.D. Yadah` ×0.**
Register: row `cb1450869d5c1c42` is present and still reads `"E.D. Yahdah"`; row
`b8077554adf57f6b` (`E.D. Yadah`) does not exist.

---

## 2 — WHAT STANDS: THE VIDEO

`-IwcOSnyNBI` is the first rendition on `ed_yahdah`, `first pass` second —
Coconuts' ruled shape, his order. Nothing new was built: `hasVideo` was already
true from Coconuts, so the player and the picker were already drawing. Only the
id crosses; no embed URL is written anywhere.

### SEEN PLAYING BEFORE IT WAS WRITTEN

§8's adoption rule accepts one probe: *a real iframe, on a real origin, read
after it settles.* The probe was the museum's own `useYTPlayer` construction —
same nocookie host, same five playerVars — stood up inside live
`https://weird.baby/wb`. Nothing was written to disk to run it.

| | E.D. Yahdah `-IwcOSnyNBI` | CONTROL — Coconuts `c1vODrVXOg0` |
|---|---|---|
| state sequence | `-1` → `3` → **`1` PLAYING** | → **`1` PLAYING** |
| clock, read twice | **10.401s → 15.407s over 5.0s wall** | **4.867s → 8.875s over 4.0s** |
| duration | 87.941s | 113.833s |
| loaded fraction | 0.46 | — |
| `onError` | never fired | never fired |
| `isListed` | **false** | **true** |

**The clock advancing one to one with the wall is what playing means**, read
twice after the settle. **The control ran in the same page and the same minute**,
so a refusal would have been a property of this video rather than of the host.

---

## 3 — FLAGGED, NOT FIXED

1. **YOUTUBE'S TITLE READS `E.D. Yadah`. THE MUSEUM IS RIGHT; THE CHANNEL IS
   WRONG.** Mike's ruling A. He corrects it there when convenient. **A later
   round must not read the mismatch as a defect in this tree** — that is exactly
   what happened today. The flag is written into the comment above the track and
   into the register row's source, so it is found by whoever meets the mismatch
   next.

2. **AND THERE IS A THIRD SPELLING ALREADY IN THE TREE, PRE-EXISTING, WHICH MIKE
   MAY NOT HAVE WHEN HE GOES TO FIX YOUTUBE.** `src/data/artists/worth-a-listen.js`
   records, in two comments dated **2026-08-02**, that **`"E. D. Yadah"`** — no
   `h`, with a space — was one of **MIKE'S OWN SONG TITLES**, used as an example
   tracklist row and since ruled dead:

       :21    "Coconuts" and "E. D. Yadah" were MIKE'S OWN SONG TITLES used as
              EXAMPLES of tracklist rows
       :1605  "E. D. Yadah" is DEAD: it was one of MIKE'S OWN SONG TITLES used
              as an example row name

   Both are comments, neither is visitor-facing, and **neither was touched.**
   **This is not an argument against ruling A and is not offered as one** — the
   ruling is his and it stands. It is recorded because there are now **three
   spellings of this title on the record** (`E.D. Yahdah` on the glass,
   `E.D. Yadah` on YouTube, `E. D. Yadah` in his own 2026-08-02 examples), two of
   them without the `h`, and he is about to edit one of them. If the registration
   spelling is what settles it, that is the thing to check before typing.

3. **THE COVER GENERATOR IS STILL ARMED AGAINST HIS OWN ARTWORK.**
   `tools/make_house_covers.py` line 100 lists `public/images/wb/vol1-cover.png`
   with the word `["THE MAKING", "OF BOWB V1"]` — **a title he retired on
   2026-08-13** — while the file on disk is **his own supplied vinyl artwork**
   (2026-08-12, 1,375,277 bytes, from a 4506×4506 master, red lettering, no house
   mark). Running it overwrites his art with a template sleeve carrying a dead
   name, silently: §8's named class. **`docs/BACKLOG.md` §2 carries the bullet
   "regenerate the cover from `tools/make_house_covers.py`", aiming a future
   round straight at it. NOBODY RUNS IT.** Untouched.

4. **THE VIDEO IS UNLISTED; COCONUTS IS NOT.** `isListed: false` against
   `isListed: true`. It embeds identically — proved in the museum's own player —
   but it does not appear on the channel. Mike's call, not asked.

5. **THE MISSPELLING IS NOT INSIDE THE AUDIO.** Measured while the reverted work
   was being done, and worth keeping: the mp3 carries an ID3v2.3 tag holding only
   `TYER`/`TDAT`/`TIME`/`PRIV` — **no `TIT2` title frame at all** — and the ID3v1
   tail's title, artist and album fields are all NUL. Whatever the title is, it
   lives in the filename and nowhere inside the file.

6. **Register `l` line numbers are stale on Coconuts' two rows** (738 and 746
   against 810 and 811). The register keys on the string hash, not the line, so
   nothing is affected. The row written this round carries a correct number.

---

## 4 — GATES, ALL GREEN ON THE TREE THAT STANDS

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings — baseline, zero new** |
| `npm run build` | green, 634ms |
| `npm run build:launch` | green, 856ms |
| `npm run provenance:gate` | **PASS**, exit 0 |
| `npm run reveal:check` | **PASS**, exit 0 |
| `npm run parity:gate` | **PASS**, exit 0 |
| `npm run instory:gate` | **PASS**, exit 0 |
| `npm run docs:numbers:gate` | **PASS**, exit 0 — 11 claims in 8 documents |
| `npm run reveal:day` | nothing to move |
| `npm run assets:orphans` | **13** — unchanged (M9) |

**Stale register rows: 22 — the same count the pre-edit tree reports**, measured
against a stashed HEAD earlier in the round. This round added none.
Register rows **2060 → 2061**: one row, the video's id, class `VERIFIED`.

**No row was needed for the label.** `"Official Music Video"` is the same string
in the same file as Coconuts', so it hashes to the same key `c04feb054aca001b`
and one row covers both uses. Checked, not assumed. (The hash scheme —
`sha256(relpath + NUL + string).slice(0,16)`, forward slashes — was proved
against two live rows before any key was written; backslashes give a different
key and would have written a dead row.)

### THE LAUNCH BUNDLE

    E.D. Yahdah             1
    E.D. Yadah              0
    IwcOSnyNBI              2      the rendition id and the ytId
    c1vODrVXOg0             2      Coconuts, for shape
    Official Music Video    2      two rows, one register row
    ed_yahdah               3      track id, rendition id, audioUrl

### THE LAP, AT 390px

`npm run lap` copies a harness into `public/` and then wants `wrangler dev`. It
was copied, **`npm run lap:clean` removed it** (verified absent), and the
measurement was taken through §8's own recorded technique for this host — a
same-origin iframe sized until `innerWidth` **is** 390, because `resize_window`
does nothing here.

    innerWidth 390 exactly
    horizontal overflow       0     (scrollWidth 375 < clientWidth 390)
    all six row heights      36px   (the new select does not grow the row)
    E.D. Yahdah select    111.6px   \ byte-identical
    Coconuts   select     111.6px   /

The new control is the one the row above it already ships.

---

## 5 — TWO OF OPS' OWN PROBES WERE WRONG BEFORE THEY WERE RIGHT

Both are §8 doing its job — *suspect the probe before the site.*

1. **Reading the iframe's `src` for the video id returns nothing.** The IFrame
   API loads by `postMessage` and never rewrites the attribute; the src stays
   `embed/?autoplay=0&…` with an empty id forever.
2. **Patching `YT.Player.prototype.loadVideoById` caught zero calls — including
   on Coconuts, which ships and works today.** YouTube's API assigns player
   methods as **own properties on the instance**, so a prototype patch after
   construction is inert. A round that trusted that reading would have "found" a
   regression in a track nobody touched.

What settled it was the museum's own rendered state: the row reads
`tl-track tl-active tl-playing`, its picker sits on `OFFICIAL VIDEO`, the YouTube
surface is 816×459 and visible, no audio indicator, no thumbnail overlay — the
thumbnail's absence being the site behaving correctly, since `.vp-thumb` only
draws when nothing is playing.

**And four console 500s are not this change.** `POST /api/visits` ×4 under plain
`vite`, which has no worker; `/api/*` is `src/worker.js`. Pre-existing.

---

## 6 — NOT THIS ROUND

**"Mama Taught me the blues"** (`youtu.be/Az08EJCYaJs`, public, house channel,
title *"Mama Taught me the Blues"*). Not a track, not on Vol. 1, no audio in the
repo, and neither the title nor the id appears anywhere in either tree. Where it
goes is Mike's call and he has not been asked.
