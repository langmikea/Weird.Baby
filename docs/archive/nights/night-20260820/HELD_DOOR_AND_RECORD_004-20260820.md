# THE HELD DOOR IS DECORATIVE ON LAUNCH — and Record 004 posts at 17:00

**Report only. Nothing was fixed, nothing was committed, nothing was deployed.**
Written 2026-08-20 08:08 EDT.

---

## 0 · WHAT IS WAITING ON YOU

**ONE RULING BEFORE NOON: Record 004's two attachment rows.** They post at
17:00 with nothing behind either. **Ops' recommendation: strike both rows.**
It costs **zero characters of your prose** — measured, §5 — and it is the same
call you already made on Record 002's `_tmp/` line.

**ONE RULING WHENEVER: the held door.** Not urgent — nothing is leaking and
nothing is broken for a visitor. Ops' recommendation is **option A (ship the
files, let the worker refuse them)**, §3.

**NOTHING IS WAITING ON YOU FOR A PORTAL SCREENSHOT.** Ops can take one today
with no deploy and no ruling — §4, tested.

---

## 1 · CONFIRMED — the 144 are absent from the launch bundle

**Ops' reading is correct in every particular. Measured, not inferred.**

`npm run build:launch`, run just now, prints its own confession:

```
held out of the launch bundle: 144 files, 190.0 MB. The worker refuses them
in this stage, and reveal:day --place renames a delivered file out of held/
before the build, so nothing a Record delivers is affected.
```

| checked | result |
|---|---|
| `dist/client/held/` after a launch build | **does not exist** |
| files under `public/held/` | **144** |
| files under `dist/client/held/` | **0** |
| `dist/client/assets/held/portal-DBFRHXBk.js` | **2.77 kB — SHIPS** |
| addresses that chunk carries | `/held/robots/art/portal-cover.png` · `/held/robots/twin.html` · `/held/robots/art/viiip-v2.png` · `/held/robots/reference/photos/…` |

**So the code ships and the material does not.** `heldOpen()` grants permission
to serve files that were never uploaded, the worker calls
`env.ASSETS.fetch(request)`, `not_found_handling` is
**`single-page-application`**, and the miss returns the app HTML with **200**.

**Every symptom follows exactly, and each one has a different cause:**

| symptom | cause |
|---|---|
| the Portal album appears | `portal.js` is a **code chunk**; code chunks ship |
| its cover is missing | the **image** does not ship |
| launching the Portal renders the Lobby | `twin.html` misses → SPA fallback returns `index.html` → React routes it → Lobby |

**And the door has never worked on a launch deployment**, which §2 shows was not
possible rather than merely untried.

---

## 2 · WHAT `heldOpen()` IS FOR — it was not designed for a development deploy

**REFUTING one clause of Ops' reading, and it sharpens the finding rather than
softening it.** `heldOpen()` was **not** designed for a development deployment
that no longer happens. It was designed for a **launch** deployment in which the
files would be present — and a different round removed them one day later.

**THE CHRONOLOGY, from git:**

| date | commit | what happened |
|---|---|---|
| **2026-08-06** | `0724e3a` | `heldOpen()` built. **But every deploy at this date was DEVELOPMENT stage**, and the stage branch reads `if (__WB_STAGE__ === "launch" && !await heldOpen(...))` — so in development **no cookie was required at all.** The files were served to everybody. The door existed and was never the thing serving anything. |
| **2026-08-12** | `d15898a` | `tools/deploy-guard.mjs`. Its own header records the defect it fixed: *"every deploy this week published the DEVELOPMENT stage to weird.baby… `/held/robots/art/portal-cover.png` returns 200 **to anybody**."* From here a launch deploy is sayable — **and a launch deploy would have shipped the files AND required the cookie.** |
| **2026-08-13** | `b7390c6` | J6 strips the 144 files from the launch bundle. **Door dead.** |

**THE WINDOW IN WHICH THE DOOR COULD HAVE WORKED IS ONE DAY WIDE — 12 to 13
August — and no launch deploy is recorded in it.** Every round log from the 17th
reports *"launch build green"*, which is a **build**, and the deploy line beside
it is `npm run deploy`, which is the development one.

**SO THE DOOR HAS BEEN EXERCISED IN EXACTLY ONE STATE: development, where it
does nothing, because development does not ask.**

### The one sentence that did it

J6's justification, verbatim:

> *"Hold held material out of the launch bundle. **It is refused by the worker
> anyway, so nothing is lost.**"*

and its own reasoning:

> *"A visitor never sees a byte of it either way; the cost is entirely at
> deploy."*

**BOTH ARE TRUE OF A VISITOR AND FALSE OF THE COOKIE HOLDER.** The round reasoned
only about the **deny** branch of a two-branch door and never about the **grant**
branch — which is the only branch the door exists for. The 190 MB was correctly
identified as waste **for everybody except the one person it was for.**

**IT IS NOT A CODING ERROR.** Every part works as written; two rounds a day apart
each did a correct thing, and the combination has no owner. That is worth
recording as its own class.

---

## 3 · THE OPTIONS, AND WHAT EACH LEAKS

### A · Ship the held files and let the worker refuse them — **Ops' recommendation**

**Revert J6: delete `heldOutOfLaunch` from the plugin list, or make its
`closeBundle` a no-op.**

| | |
|---|---|
| **What leaks** | **Nothing.** `run_worker_first` is `["/*"]` — **the worker sees every request**, so no `/held/*` path can reach the asset store without passing `heldOpen()`. A miss without the cookie is a plain 404, and a 404 is what a visitor already gets. |
| **What it costs** | **190 MB per launch deploy.** That is the entire cost, and it is deploy-time bandwidth, not visitor bandwidth. |
| **Precedent** | **This is exactly how `assetWithheld` works, and it is LIVE TODAY, not merely analogous.** The built worker carries a real schedule now — six manual pages, all dated `2026-08-19` — and those files **ship publicly** and are gated in the worker. *(Note: the worker's own comment still says the schedule is "EMPTY TODAY… built and unexercised". **That comment is stale** — Record 003's attachments populated it.)* |
| **The distinction worth keeping** | `assetWithheld` gates by **date**; this gates by **cookie**. Both are "ship it, refuse it at the edge". Only the date half has been exercised in production. |
| **Risk** | The 190 MB is the reason J6 existed. If deploy time is the real complaint, the honest fix is to ship **only what the door actually needs** — the Portal's cover, poster and `twin.html` are ~1.3 MB of the 190. |

**AND THAT LAST LINE IS THE VARIANT WORTH PUTTING IN FRONT OF YOU:**

### A′ · Ship the held files the Portal names, and strip the rest

The 190 MB is dominated by the manual masters and the build recordings — material
**no shipped code names**. The Portal chunk names four paths. Shipping those and
stripping the rest keeps **both** of J6's wins and the door.

**What it leaks: nothing** (same worker refusal). **What it costs: ~1.3 MB.**
**What it needs: a filter that reads the addresses out of the built chunks rather
than a hand-kept list** — a hand-kept list is the thing that would silently rot.
**Not built, not proposed as a design, named so it is not missed.**

### B · A second deployment at development stage

| | |
|---|---|
| **What leaks** | **EVERYTHING, TO ANYONE WITH THE URL, WITH NO KEY.** In development the stage branch is `__WB_STAGE__ === "launch" && …` — **the condition is false, so `heldOpen()` is never called.** All 144 files, the 240 dpi manual, the twin, the 26 photographs: open. **And `Robots.jsx` imports the Portal unconditionally** (`if (launched() && !heldOpen()) return`), so the wing lists itself. |
| **Verdict** | **This is not a held deployment with a door. It is a public one.** It is the exact state the deploy guard was written on 12 August to stop happening by accident; doing it deliberately is worse, because nothing would flag it. |
| **If it is ever taken** | it must be an unlisted preview URL, treated as published material, and it still breaks H1's own rule — *"a held thing must be UNREACHABLE BY A VISITOR — no route, no link, no listing, no share tag, no crawler path."* An unlisted URL is a route. |

### C · Accept the door is development-only and say so on `/admin`

| | |
|---|---|
| **What leaks** | **Nothing.** |
| **What it costs** | **The door stops being a door and becomes a label.** `/api/held` would report `open:true` on a launch deploy while nothing opens — which is the present state, described rather than fixed. |
| **The honest version** | `/admin` must say **"the stage hold is not served on this deployment"**, not "open". A boolean that says `open` about a door with nothing behind it is the museum telling itself something false, which is the `_tmp/` failure one floor down. |
| **Where it is right** | If the answer to *"does Mike ever need the Portal on the live site?"* is **no** — he has it locally, §4 — then C is the truthful description and A is 190 MB spent on nothing. **That is your call, not Ops'.** |

### The fourth option nobody named

### D · Fix `/api/held` to report reachability, whichever of A/B/C is chosen

`GET /api/held` currently answers `{configured, open, stage}` — **three facts
about permission and none about presence.** It could stat one known held path and
report `served: true|false`. **Under any option that makes `/admin` stop lying,
and under C it is the whole of the fix.**

---

## 4 · WHAT OPS NEEDS FOR A PORTAL SCREENSHOT TODAY

**Nothing. `npm run dev`. Tested end to end just now.**

```
npm run dev            →  http://localhost:5173/robots
```

| probed on the dev server | result |
|---|---|
| `/robots` | **200** text/html |
| `/held/robots/art/portal-cover.png` | **200 image/png, 641,677 B — the real cover** |
| `/held/robots/twin.html` | **200 text/html, 620,858 B — the real twin** |

**And it renders.** Screenshot taken: the Portal album is **second in the deck**
with its cover drawn, exactly where `PORTAL_AT = 1` puts it. No cookie, no
deploy, no key — `launched()` is false in development, so `Robots.jsx` imports
the Portal unconditionally.

**WHY THIS IS THE CHEAPEST AND ALSO THE RIGHT ONE:** a screenshot is a picture of
a rendering. The dev server renders from the same data, the same components and
the same files a launch deployment would serve **if the files were there**. The
only thing a live deployment would add to the picture is the deployment, and the
deployment is the broken part.

**ONE CAVEAT, MEASURED:** the first probe read `naturalWidth === 0` on both
images and the screenshot then showed them drawn. **That is the unpainted-frame
hazard, not a failure** — an image measured before the frame paints reports zero.
**Trust the screenshot, not the probe.**

---

## 5 · RECORD 004 — the two attachment rows

**RULE BEFORE NOON. Posts 17:00 EDT today.**

### What will actually draw

The entry declares:

```js
docs: [
  { title: "View of the portal screen" },
  { title: "Manual ref to Portal" },
],
```

No `source`, no `date`, no `pages`, no `plates`, no `scan`, no `extract`, no
`note`. Traced through `docState()` and `attachmentsOf()` in
`src/lib/record-model.js`, both rows resolve to **`state: "held"`** and render as:

```
[document glyph]   View of the portal screen
                   not here yet

[document glyph]   Manual ref to Portal
                   not here yet
```

**and the index row carries `ATTACHMENTS 2`** — confirmed on the glass in
development just now.

### Three things wrong with them, in increasing order of seriousness

**1 · They fail Ruling 9, which is the ruling you already made on this exact
shape.** *"We do not hold back what we say we have. We hold back what we don't
have yet."* The `_tmp/` line was **a name in a list with nothing behind it**, and
you struck it. These are two names in a list with nothing behind them.

**2 · They claim a state whose own definition they do not meet.** `record-model.js`
defines `held` as *"its provenance is recorded and nothing else has arrived."*
**No provenance is recorded** — `source`, `date` and `pages` are all absent, so
the row's meta line contains the words `not here yet` **and nothing else.** They
are not *empty and honest*; they are **empty and unsourced**.

**3 · The second row may be wrong on the facts as well.** *"Manual ref to
Portal"* is `SCAN 11 — VID-LINK`, and **Record 003 delivered it yesterday**, at a
public address, with a thumbnail that opens. Marking it `not here yet` on
Thursday says the museum does not have a thing it showed on Wednesday. That is
Ruling 10 — *what's said matches what's shown* — failing in the harder
direction.

### And the ledger already disagrees with them

`reveal/ledger.json` carries `record.004` with **`assets: 0`** and
**`shown: false`**. `shown` is defined as *"true where a VISITOR CAN SEE THE
LABEL of something that is not built."* **At 17:00 a visitor will see two.**
Either the rows go or that row is wrong.

**No gate catches this.** `reveal:check`, `provenance:gate`, `parity:gate`,
`instory:gate` and `docs:numbers` all **PASS** with the rows in place — the
DRAWN_ENTRY_FIELDS check asks whether a declared field is *drawn by something*,
and `docs` is. It does not ask whether the thing has contents.

### The options, cheapest first

| | option | cost | honest? |
|---|---|---|---|
| **1** | **STRIKE BOTH ROWS** | **Delete four lines. Zero characters of your prose.** | **Yes** |
| 2 | Give row 2 the already-published `scan-11` plates | ~6 lines | **No** — it re-shows Wednesday's delivery under a new title, and Ruling 12 says an attachment is the pages that were **filmed together**, not a second name for the same set |
| 3 | Add real provenance and leave them `held` | 2 lines each | **Only if the provenance is true** — and nobody has said what document *"View of the portal screen"* is, or where it is |
| 4 | Deliver something behind them | a picture, a ruling, a `reveal:day --place` | Yes, and **not by noon** |

### Why striking is free — measured

**Record 004's prose does not promise attachments.** Searched its whole entry for
`attach`, `contents`, `enclos`, `appendix`, `below`, `see ` — **zero hits.**

Its one backward reference is *"Excerpts from the Manual **earlier in the week**
indicate a bi-directional CNC Vid-Link"* — which points at **Record 003**, is
true, and is delivered.

**Contrast Record 003, which does promise and does deliver:** *"Outer layer
opened - three manual pages recovered, **contents attached**."*

**SO STRIKING BOTH ROWS REMOVES THE `ATTACHMENTS 2` BADGE AND CHANGES NOTHING
ELSE A READER SEES.** Not one word of yours moves, and the entry reads as what it
is: a status update with a bench description in it, which is already the best
thing in the week.

**AND IT COSTS NOTHING LATER.** A picture of the portal screen can arrive on any
future Record. Ruling 9's own words: *the Record may withhold, and the Record may
not promise.*

---

## 6 · RECORDED FOR WHENEVER THE PORTAL IS NEXT TOUCHED

**RULED: the Portal album's tracklist drops `Portal` and keeps
`Portal Feed Controller`.**

Logged against `src/data/artists/portal.js`. **Not done today** — the file is
untouched by this round.

**What it removes, so the next session knows what it is deleting:** the
`portal-door` track, whose whole job was to be the door itself. H3c's own note
records it as **the one Ops judgement in that album** — you named a row and did
not say what stood behind it, and Ops made it the door so it would not be a dead
control. **Your ruling supersedes that judgement**, and the LATCH on the Feed
Controller is already the door that opens the feed.

**It joins the other open Portal item:** the drum's sub still reads
`SELECT · ONE ARMED` and **two** positions arm (`standard` ch 3, `idling-updated`
ch 4). One word, same visit.

---

## 7 · HOUSEKEEPING

- **`dist/` currently holds a LAUNCH build** because this investigation ran
  `npm run build:launch`. `npm run deploy` rebuilds development first, so this is
  harmless — noted only because a bare `wrangler deploy` would publish launch,
  which is the case `deploy-guard.mjs` exists for.
- **The dev server and the browser tab are stopped and closed.**
- **Nothing was changed.** `git status` is exactly as this round found it.
