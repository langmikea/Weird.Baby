<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# THE PORTAL IS PUBLIC
2026-08-22 · Record 005's claim is true now

## WHAT NEEDS MIKE

**Nothing blocks the deploy. `npm run deploy:launch`.**

One thing is filed rather than fixed, on his ruling: **the Portal FAQ ships with
a line he knows is false** — *"Two channels are engraved for it on the feed drum
and neither of them carries it."* There is no feed drum. It is `docs/BACKLOG.md`
row 0, it is on both `portal.feed.niac` ledger rows, and **a later round must not
quietly rewrite it.** It is his voice.

## THE PROOF THAT MATTERS

The launch build, served with the stage hold enforced exactly as the worker
enforces it, **no cookie and no session flag**:

```
cookie (none) · sessionStorage wb-held-open = null
/robots                     2 albums, right arrow LIVE
covers                      /robots/art/wbr-cover-logo.png
                            /robots/art/portal-cover.png
```

Then walked as a visitor: the panel drew (`ABEAL`, `NIAC/VIIIp / PATCHED`, DIP
`1111`, FEED ARMED) → switch 3 to CAB → `1101` → **LATCH → channel 1,
TELEVISION ON THIS CHANNEL** → press `3` → **`/robots/twin.html`, SIGNAL
PRESENT**, the twin `framed=true` with its own strip suppressed, the bezel
loaded from `/robots/reference/photos/…`. Track 02 renders both FAQ answers.

**And the door still shuts:** `/held/robots/twin.html` and
`/assets/held/anything.js` both refused.

## THE GATES

lint **9 / 8 = baseline** · build green · **launch build green** · provenance
**PASS** (1 row) · `reveal:check` **PASS** · `parity:gate` **PASS** ·
`instory:gate` **PASS** · `docs:numbers` **PASS** (ledger count corrected
174 → 176, twice on one line) · `reveal:day` **nothing to move** ·
`assets:orphans` **13, unchanged**.

---

## 1 · THE TWO DOORS, BOTH OPENED

`portal.js` out of `HELD_PATHS`, and the `heldOpen()` gate off the splice in
`Robots.jsx`. **Without the second a visitor gets nothing** — which is the state
Record 005 was published into. Both imports (`heldOpen`, `launched`) went with
the gate rather than being left as a dead read; this was their only caller here.

**`heldChunkGuard` said nothing, exactly as predicted, and that is not the same
as approval** — a module that is no longer shut is not the guard's business.

**A TRAP WORTH THE ROUND: `heldModulePrefixes()` READS QUOTED STRINGS OUT OF THE
ARRAY LITERAL, COMMENTS INCLUDED.** The comment recording the ruling quoted the
very path it was recording, and the regex put `/src/data/artists/portal.js`
straight back into the hold — the Portal was still held by its own epitaph.
Two more quoted phrases in the same comment became phantom prefixes. **A comment
inside a list that a regex parses is not a comment.** De-quoted; the prefix list
reads exactly six entries, all real.

## 2 · WHAT MOVED — 8 FILES, 12,871,972 BYTES (12.28 MiB)

`twin.html` · `art/portal-cover.png` · `art/viiip-v2.png` ·
`reference/photos/{MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT, MGK-TWIN_MONITOR_SCREEN_BEZEL, MGK-TWIN_MONITOR_CLOSE_UP, top_monitor}.png` ·
`reference/photos/unit_crt_base.webp`.

**The manual (120.3 MB) and the audio (62.1 MB) did not move.** `/held/` is
199.76 MB and 6.4% of it left.

Five literals repointed in `portal.js`. **The twin's loader base needed NO
change** — `CAND` is relative (`reference/photos/`), so it followed the file.

## 3 · THE PULL-BACK RULE HAD TO BE TAUGHT A SECOND WAY TO PUBLISH

Moving the seven pictures raised seven `deliveryFaults` at once: *a picture of
the objects at a PUBLIC address and no Record entry delivers it.* **The rule was
right to ask.** The pull-back answers one question — *has the Record delivered
this photograph yet?* — and it was built for the twenty-six reveal photographs.

**A ruling that publishes a whole exhibit is a different act.** No entry
delivers the Portal's fabric and none ever will.

**THE TEMPTING WRONG FIX WAS `SIGNAGE`**, and it would have been a lie: signage
is *the museum's own lettering*, and four of these are photographs of MGK-VIIIp.
Filing them there makes that list what its own header warns against — an
exception list nobody re-reads, which is a list of excuses.

So: **`PUBLISHED_BY_RULING`**, a second declared list beside it, same discipline,
**one row per file carrying the ruling that published it**. It is consulted by
`deliveryFaults()`, by `publicPlacements()` and by the day's step, and it fails
in both directions — a ruled file still behind the door, or one that is also
delivered by an entry, both fault. **The rule still bites everywhere else.**

## 4 · WHAT STAYS BEHIND THE DOOR — VERIFIED, NOT ASSERTED

**`robots-units.js` is untouched and still held.** Measured:

- still in the held prefix list ✔
- **nothing imports it** — the only three greps are comments in `robots.js` ✔
- **the launch build has no `assets/held/` directory at all** ✔
- `MGK-NIAC (1961)`, `Image Archive` and `mgk-niac-cover` appear in **no public
  chunk** ✔

**AND THE GATE FOUND THE ONE REAL OVERLAP, WHICH IS WORTH SAYING PLAINLY.**
`robots-units.js` names three of the files that just went public — `viiip-v2.png`,
the family shot and `top_monitor.png`. The two units' albums and the Portal
photograph the same machine. **The held module's strings still ship nowhere**, so
no visitor is handed the reference; what is true is that **three photographs of
MGK-VIIIp are now fetchable by URL because the Portal published them.** That is
inside what Mike ruled — the Portal publishes the twin — and it is recorded here
rather than smoothed over. The rule was taught to consult `PUBLISHED_BY_RULING`
rather than given a second list of its own, so the claim lives in one place.

## 5 · THE LEDGER — 16 ROWS MOVED, 12 CORRECTED, 2 ADDED, 2 RETIRED

**176 rows now** (was 174). REVEALED **88 → 102**, HELD **74 → 60**, RETIRED
**12 → 14**.

Corrected: `face.viiip.portal` no longer says *drum, two bat switches*; the two
NIAC rows are ANTENNA channels and say the engraving is gone; the five inert drum
positions are the FEED's banks with the recipe repointing named; channel 4's
photograph moved to the antenna. **Retired rather than deleted:** both bat
switches — a row that leaves without saying so is how a ledger stops being the
record of what was built. **Added:** `portal.antenna` and `portal.screen`.

**A SHOWN-BUT-NOT-BUILT ROW IS `HELD`, NOT `REVEALED`** — the schema refuses
`NOT_BUILT + REVEALED` (*a visitor is being shown something that does not
exist*), and it is right: LAST STATE and TEST BENCH are on the glass and refuse.

### THE M99 GUARD REFUSED THE WRITE, AND IT WAS RIGHT

The first cut **renamed** eight rows to match the new vocabulary
(`portal.feed.standard` → `portal.bank.standard`, and so on). The guard refused:
*writing would delete 8 rows that are not declared in this file.* `--drop-deleted`
cannot help — it only drops `record.NNN` rows whose entry is gone, by design.

**The guard was not the obstacle; it was the answer.** P5's rule is that **no id
moves when a legend is recut** — an id is identity, the `name` is what restates
the glass — and `boot-playback` and `off-first-boot` name the LEVER, not the
recipe behind it, which is exactly the case P5 was written for. The renames also
broke `reveal/transfers.mjs`, which addresses rows by id, and the validator said
so in eight more faults. **All ids restored; only names, `where`, `reach` and
state moved.** P5 holds for the fourth time.

## 6 · THE TWIN'S AUDIO — REPORTED, NOT FIXED

`AUDIO_BASE` is `"../robots/mgk-viiip/content/build/SD/"`, which from
`/robots/twin.html` resolves to `/robots/mgk-viiip/content/build/SD/`.
**That directory does not exist and never did in this tree.**

**IT IS A PATH-SHAPE MISMATCH, NOT A MISSING FOLDER.** The museum holds the audio
at `held/robots/audio/build/SD-18`, `SD-20`, `SD-23` — **63 files, 60 MB** — and
the twin was authored against the robots repo's own layout (`mgk-viiip/content/
build/SD/NN/`). The twin also pads the folder to two digits and joins with `/`,
where the tree uses an `SD-NN` suffix. So fixing it is **two edits** — the base
and the join — **plus publishing 60 MB**, which is five times what the whole
Portal just moved.

**CAN IT SHIP SILENT HONESTLY? YES, AND IT ALREADY DOES.** The audio messages are
a menu the visitor opens deliberately; nothing on the glass promises sound, the
failure is per-message, and the twin has been in exactly this state for every
day it has been open to Mike. **What changes today is the audience.** Ops'
reading: ship it, and treat the audio as its own decision with its own 60 MB
price rather than a defect discovered at deploy time. **It is not on the backlog
because nobody has asked for it** — say the word and it gets a row.

## 7 · THE THREE DELETED FILES — CONFIRMED, AND THE CHECK LIED FIRST

`front_full.png`, `monitor_base.png` and `unit_new_base.png` are still gone and
the twin's loader ladder still handles them at the public addresses.

**THE FIRST READING SAID THEY WERE FINE FOR THE WRONG REASON.** All three return
**HTTP 200** — on the live worker as well as on the test server — because a
missing governed path falls through to the SPA and gets `index.html` as
`text/html`. A status check would have called them present.

**The ladder depends on `img.onerror`, so the question is whether a 200 of HTML
still fires it. Measured, in the browser: it does** — the decode fails and
`onerror` runs, for all three, while the family shot at the same prefix returns
`onload` at 3000×2400. **The ladder holds.** Filed as a hazard: on this site a
missing image is a 200, and only the decode tells the truth.
