# THREE RULINGS APPLIED — 2026-08-20

**Ready to deploy. Not pushed, not deployed.** The deploy must be
**`npm run deploy:launch`**, and it must happen **before 17:00 EDT** so Record
004 posts without the two struck rows.

---

## 1 · RECORD 004 — BOTH ATTACHMENT ROWS STRUCK

**`src/data/artists/robots-record.js`. The `docs` field is removed entirely.**

**FOUR LINES DELETED, AND THEY ARE THE ONLY FOUR.** `git diff` on that file
shows exactly:

```
-              docs: [
-                { title: "View of the portal screen" },
-                { title: "Manual ref to Portal" },
-              ],
```

**NOT ONE CHARACTER OF PROSE MOVED.** The other 84 lines of the diff are the
comment recording why, per Doctrine 24 — a struck thing is named once, in the
place that struck it.

**VERIFIED, not assumed:**

| check | result |
|---|---|
| `RECORD_ENTRIES[3].docs` | **absent** — fields are now `no, date, title, line, sections` |
| `attachmentsOf()` on Record 004 | **0** — the `ATTACHMENTS 2` badge is gone |
| `attachmentsOf()` on Record 003 | **4**, unchanged — Scan 07, Scan 11, Scan 31, Marked copy 01 |
| `entries()[3].assets` | **`[]`** — the derived asset list emptied with the field |
| `reveal/ledger.json` after `reveal:build` | **byte-identical.** `record.004` already read `assets: 0, shown: false`; those are now TRUE rather than wrong |

**Recorded against Ruling 9 and the promise doctrine, in the file**, with all
three reasons — the `_tmp/` precedent, the `held`-with-no-provenance fault, and
the one you ruled on: *Manual ref to Portal* is SCAN 11, delivered Wednesday, so
Thursday would have said the museum does not have a thing it showed the day
before. **A contradiction, not a gap.**

---

## 2 · THE HELD FILES SHIP — J6 REVERSED

**`vite.config.js`. `heldOutOfLaunch` is deleted, not disabled.**

| before | after |
|---|---|
| `dist/client/held/` — **0 files** | **144 files, 191 MB** |
| `/held/robots/art/portal-cover.png` | **641,677 B, present** |
| `/held/robots/twin.html` | **620,858 B, present** |
| `/held/robots/art/viiip-v2.png` | **1,262,731 B, present** |

**PROVED ON A REAL LAUNCH BUILD, through `wrangler dev`, in both states:**

```
DOOR SHUT   open=False  served=None  probe=None  stage=launch
            cover, no cookie:  404
            twin,  no cookie:  404

DOOR OPEN   open=True   served=True  probe=/held/robots/art/portal-cover.png
            cover:  200 image/png            641,677 B
            twin:   200 text/html            620,858 B
```

**The `/hr` permission door is unaffected** — `/assets/locked/*` still 404s
without the cookie on the same launch build. Checked, because a change to one
door is the classic way to widen the other.

**`node:fs` and `node:path` went with the plugin.** They were imported for it
alone; a grep for either identifier returned only the two import lines. Law of
Subtraction, and it keeps lint at baseline.

**A′ is recorded as REJECTED IN THE FILE, in your words** — *"makes the door
work for the Portal and silently not for anything else… a mechanism that appears
to work and does not."*

**What J6 got right is kept, because it is a fact about the reveal mechanism
rather than about the strip:** `reveal:day --place` renames a delivered file out
of `held/` **before** the build, so nothing a Record delivers ever depended on
that plugin.

**One incidental finding, not a defect:** `twin.html` answers **307 → /held/robots/twin**
before serving. That is Cloudflare's `html_handling` dropping the extension; the
browser follows it and receives all 620,858 bytes. **Pre-existing, unchanged.**

### The stale comments are corrected

**`assetWithheld` is exercised, and the two places that said otherwise now say
so.** The built worker carries six real rows — the five scans and the marked
copy, all dated `2026-08-19` — and all six serve at public addresses today
(`200 image/webp`, checked). Corrected in `src/worker.js` and in
`vite.config.js`, and the worker's note says **why** the correction matters:
a comment claiming the mechanism had never run would have been the first thing
to contradict the argument for shipping the held files.

---

## 3 · `/api/held` REPORTS PRESENCE

**Two new fields, answered only to a browser that holds the door open.**

```json
{ "open": true, "served": true,
  "probe": "/held/robots/art/portal-cover.png", "stage": "launch" }
```

**`served` is `null` when the door is shut** — whether held material is on a
deployment is a fact about the work (Doctrine 11), and the key-holder is the only
party who can act on it.

### Why the probe is an image

`not_found_handling` is `single-page-application`, so **a miss returns the
application at 200**. A status check cannot tell a hit from a miss, and neither
can a content-type check on an HTML file, because the fallback IS HTML.

**Measured, both sides, with the cookie:**

```
/held/robots/art/does-not-exist.png   200  text/html   8,639 B   ← the app
/held/robots/art/portal-cover.png     200  image/png 641,677 B   ← the file
```

**An image discriminates absolutely.** That is the whole basis of the check and
it is proved rather than assumed.

### The guard was proved by breaking it

The probe was temporarily aimed at `/held/robots/art/PROVE-THE-GUARD.png`, which
does not exist, and the endpoint answered:

```json
{ "open": true, "served": false, "probe": "/held/robots/art/PROVE-THE-GUARD.png" }
```

**It catches exactly the failure it was built for.** `src/worker.js` was then
restored and verified **byte-identical** against a pre-change copy, and rebuilt.

### It names what it tested

One probe cannot prove 144 files are present, so the answer carries `probe` and
claims nothing beyond it. **A smoke test that says which room it walked into,
not an inventory.** If that file is ever renamed the probe cries false — which
is the loud direction, and the right one: the fault it replaces was a false
ALL-CLEAR nobody investigated for a week.

### `/admin` now prints it

A second row beside `Showing`, **because they are two different facts and
reading one as the other was the whole failure**:

```
SHOWING      The launch state
HELD FILES   Served — the door has something behind it
```

and in the alarm state, in red, with the remedy:

```
HELD FILES   NOT ON THIS DEPLOYMENT — the door opens onto nothing

Probed /held/robots/art/portal-cover.png and the store answered with the
application, not the file. Held material was not uploaded with this build,
so every held address will render the Lobby. Rebuild and deploy.
```

**Five new strings, all declared `HOUSE` in `provenance/register.json`** — the
gate failed on them and now passes. **49 insertions, 0 deletions: no existing row
moved.**

---

## 4 · DOES `/api/record` CARRY THE SAME LIE? — PARTLY, AND IT IS LATENT

**Answered plainly, and recorded in the worker at the branch itself.**

`previewing:true` grants **two** things and they fail differently:

| what it grants | can it lie? |
|---|---|
| **Seeing a future entry's TEXT** | **No, ever.** The entries are static in the bundle; `__WB_RECORD_ALL__` only stops the client filtering. No file has to exist. |
| **Fetching a future entry's ASSET** | **Yes — identical mechanism.** The branch skips `assetWithheld` for a previewer and falls through to `env.ASSETS.fetch`. If the entry names a picture `reveal:day --place` has not moved out of `public/held/`, the store misses and returns the app at 200. |

**SO IT IS THE SAME FAULT WITH A SMALLER MOUTH.** `/api/held` had one grant and
it was entirely empty; this has two and only the second can be.

**IT IS LATENT TODAY, MEASURED NOT ASSUMED:** the schedule holds six paths, all
dated `2026-08-19`, all past, **all six present at their public paths.**
**Future-dated assets: ZERO.** There is no path today for which a previewer
would be handed the fallback.

**NOT FIXED, DELIBERATELY.** You ruled the probe for `/api/held` and asked only
for a statement here. **The fix is a different shape too**: a fixed probe path
cannot serve an endpoint whose asset set changes per entry, so the honest version
walks the FUTURE-DATED half of the schedule — today an empty walk costing
nothing, and on the day it is not empty the previewer is exactly the person who
needs the answer. **One ruling when you want it.**

---

## 5 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline** |
| `npm run build` | **PASS** |
| `npm run build:launch` | **green — 144 held files, 191 MB shipped** |
| `npm run reveal:check` | **PASS** — *"every HELD row is unreachable — no reach, no public file, and the 4 held prefixes are still refused by the worker and routed to it"* |
| `npm run provenance:gate` | **PASS** (5 new HOUSE rows) |
| `npm run parity:gate` | **PASS** |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers` | **PASS** |
| `reveal:build` ledger drift | **byte-identical** |

---

## 6 · NOT DONE, AND WHY

**THE PORTAL TRACKLIST IS UNTOUCHED.** Your ruling — the album drops `Portal`
and keeps `Portal Feed Controller` — is *"whenever the Portal is next touched"*,
and this round did not touch `portal.js`. **Logged, not applied.** It carries one
other open item for the same visit: the drum's sub still reads
`SELECT · ONE ARMED` and **two** positions arm.

---

## 7 · TEST SCAFFOLDING, ALL REMOVED

- A throwaway `HR_KEY=test-door-20260820` was added to `.dev.vars` to exercise
  the door locally. **`.dev.vars` is restored from a backup and contains no
  `HR_KEY`** — verified.
- Three `wrangler dev` servers stopped. Cookie jars and temp files deleted.
- `src/worker.js` restored byte-identical after the guard proof.
- **`dist/` currently holds a LAUNCH build**, which is what
  `npm run deploy:launch` expects. `deploy-guard.mjs` refuses a mismatch either
  way.

---

## 8 · THE DEPLOY

```
npm run deploy:launch
```

**It will upload about 191 MB more than the last one.** That is the ruled cost of
a door that opens.

**After it lands, the one-line check** — on `/admin`, with the door open, the
`HELD FILES` row must read **Served**. If it reads **NOT ON THIS DEPLOYMENT** in
red, the upload did not carry the held tree and every held address will render
the Lobby.
