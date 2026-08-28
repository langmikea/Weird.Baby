# RULING A — THE CLOCK DRIVES FORWARD

**2026-08-27.** Built on HEAD `a716017`, clean tree. Nothing committed by Ops.
Mike reviews before anything commits.

---

## 0. THE RULING

> **MIKE: a key-holder may drive the clock FORWARD.**

It is the switch the deploy was made conditional on. His condition, in his own
words across three passes:

> *"I want the website updated so I can always see what it is I am actually
> getting. I understand that if anyone sees it they see everything. I do not
> care."*
> *"Deploy live site after we build the switch that lets me 'view everything'
> while still constraining users to the calendar driven config."*
> *"the 'see it all' is probably easier to rescope as 'see any date'."*

**OPS RULED NO CEILING.** A bound is a number somebody has to maintain, and it
is wrong the first time an entry moves. The honest answer is whatever the
entries say. Drive past the last entry and the museum shows what it has.

---

## 1. WHY BACKWARDS WAS NOT ENOUGH — THE ARITHMETIC

`?as-of=` landed backwards-only at `f2dc391` on 2026-08-24. Measured against
the tree three days later:

| | |
|---|---|
| `RECORD_EPOCH` | **2026-08-31** |
| the five entries | **2026-08-31, 09-01, 09-02, 09-03, 09-04** |
| `__WB_RECORD_FIRST_DAY__` | **2026-08-31** |
| governed asset rows | **7**, dated **2026-09-02** (six) and **2026-09-03** (one) |
| the real day | **2026-08-27** |

Every entry, the wing and all seven governed files sit in the FUTURE of every
day the old rule could reach. **The whole backwards range was one state, and
that state was *shut*.** It showed Mike nothing he could not already see.

---

## 2. WHAT CHANGED — ONE CHECK, AND THE PROSE THAT CLAIMED IT

`src/worker.js` only. No other source file was touched.

**THE BRIEF NAMED `worker.js:171` AND THE CHECK WAS AT `:318–325`.** Line 171
is the `Vary: Cookie` paragraph in the cache-key header. Recorded because a
later reader following the brief would land in the wrong block.

### The code

`badDay()` lost its third check and its second parameter:

```
-function badDay(day, realToday) {
+function badDay(day) {
     if (!ISO_DAY.test(day)) return "malformed — expected YYYY-MM-DD";
     if (!realCalendarDay(day)) return `not a real calendar day — …`;
-    if (day > realToday) {
-      return `forward-dated — ${day} is after ${realToday}. `
-           + "Backwards is honoured; forwards is refused, not clamped";
-    }
     return null;
   }
```

`realToday` then fell out of `resolveAsOf`'s signature and both of its call
sites, because `no-unused-vars` runs `args: after-used` and a dangling
parameter is a NEW lint error against a baseline whose whole job is to be a
tripwire. `realToday` is untouched everywhere it is still load-bearing: the one
clock read, `clock.realToday`, `drivenReadOnly`'s message, and `/api/record`.

**THE CLAMP HALF OF THE OLD REASONING STANDS AND NOTHING IS CLAMPED NOW
EITHER.** A clamp answers a question nobody asked and looks like it worked.
What fell is the direction.

### The prose

Four blocks in the same file stated the dead rule and were corrected in place,
each carrying what it used to say so a later round does not "restore" it:

1. **The opening line** — *"drive the museum to a past day"* → *any day*, plus a
   pointer to the new section.
2. **The two-cookie argument** — it justified two doors with *"they are opposite
   motions"*, and Ruling A pointed them the same way. **The rule survives on the
   reason underneath it: they answer different questions.** `wb_record` is *show
   me everything at once*; `wb_asof` is *show me one day*. Merging them leaves
   no way to ask the second — the one Mike made the deploy conditional on.
3. **`BACKWARDS ONLY`** → **`ANY DIRECTION, AND NO CEILING`**, carrying the
   ruling, the arithmetic, the no-ceiling reasoning and the old string verbatim.
4. **The cookie re-check comment** — it said the forward test *"cannot fire on an
   honest cookie"*. Now describes what actually guards the day: the digest.

### The register

Two rows went stale — the two deleted strings — and were dropped with
`npm run provenance -- --prune`. **Deletions only; no id moved** (§5's rule).

    - "forward-dated — {} is after {}. "                        badDay{}.forward
    - "Backwards is honoured; forwards is refused, not clamped" badDay{}.forward

### WHAT STATED IT ELSEWHERE — NOTHING

`git grep` at HEAD: `?as-of=` and `wb_asof` appear in **`src/worker.js` and
`provenance/register.json` and nowhere else.** Zero hits in `docs/`, OPERATIONS,
STATE or the canon. **No document had to be corrected because no document ever
said it.** `docs/canon/09-PUBLISHED.md`'s *"A CLOCK OVERRIDE IS NOT AN AS-OF
QUERY"* is about `valid-from`/`superseded-at` and is unaffected — it was true
before and is true now.

---

## 3. WHAT ELSE ASSUMED BACKWARDS — EACH ONE MEASURED, NONE ASSUMED

| Thing | Under a FUTURE date | Verdict |
|---|---|---|
| **Entry filter** | `entryVisible` is `date <= today`, direction-free | drew **3** entries at 09-02, **5** at 12-25 |
| **Wing gate** | `ROBOTS_OPEN` counts visible entries | `\ROBOTS` **appeared** in the lobby directory |
| **Assets** | `assetWithheld` is `day > today`, direction-free | opened **exactly on each file's own day** |
| **Countdown** | target fixed at `recordVisibleAt(RECORD_EPOCH)`; origin is the driven instant | **already fired → renders `null`, and did** |
| **Share cards** | `wingOpenOn(today)` | follows the driven day |
| **Writes** | `drivenReadOnly` | **still 403** — forward needs it as much as backward |

**THE COUNTDOWN IS THE ONE WORTH SPELLING OUT.** `remainingAt` returns `null`
when the target has passed, and the component returns `null` on that — his own
ruling, *"AT ZERO IT REMOVES ITSELF"*. Driving past the epoch is not an edge
case that needed handling; it is that ruling arriving early. Measured:
`__WB_NOW__` at 2026-12-25 is `1798236000000`, the doors are `1788210000000`,
and the counter was gone from the page.

**AND BOTH CLOCKS MOVED TOGETHER**, which canon requires — *"Move the day and
leave the instant and the lobby countdown contradicts the Record on the same
page."* `__WB_NOW__` came back **exactly** `recordVisibleAt(driven day)`.

---

## 4. RAISED AND RULED IN THE SAME ROUND — BOTH CLOSED

Both were raised here as flagged-not-fixed. **Ops ruled both within the round
and both shipped**, so neither ever reached the open register: the rows are in
`docs/OPEN_ACTIONS_CLOSED.md` (Doctrine 24 — a closed row leaves Mike's view).

### (a) C-asof1 — THE DATE WINS

> **OPS:** *"Preview and `?as-of=` answer the same question, and letting the
> door override the clock shows a day that never existed. 'Open the door,
> drive, then close the door and keep driving' being the only way to see one
> day, written down nowhere, is the defect stating itself."*

**THE KEY CHECK WAS REPORTED BEFORE IT WAS TOUCHED, AND DID NOT NEED TOUCHING.**
Ops asked for the mechanism first. It is: one secret `RECORD_KEY`; `wb_record`
is `sha256("wb-record-v1:"+KEY)`, minted only by `POST /api/record {key}`;
`wb_asof` is `<day>.sha256("wb-asof-v1:"+KEY+":"+day)`. **Minting `wb_asof`
calls `previewOpen` and silently returns `{}` if it fails — that is the only
gate on minting.** The CARRY path never calls `previewOpen`; it re-derives the
digest. So the two cookies are siblings from one secret and `wb_record` is only
an admission ticket to the mint. The door must open to mint because the date
parameter has no secret of its own.

**So nothing about who may hold the cookie changed — only what it DOES once
held.** The rule is one line, `showEveryRecord` in `src/worker.js`, read by all
three consumers (Doctrine 17):

    const showEveryRecord = (previewing, clock) => previewing && !clock.driven;

  · not driven + door open  -> every entry           (unchanged)
  · DRIVEN   + door open    -> the driven day alone   (the change)
  · driven   + door shut    -> the driven day alone   (unchanged)

**SUSPENDED, NOT REVOKED.** Stop driving and the door is open again with
nothing to re-enter. **AND THE SEQUENCE COLLAPSED FROM THREE STEPS TO TWO:**
open the door, drive, look. The workaround is documented nowhere because it no
longer exists, which is the outcome to prefer over documenting it.

`src/lib/record-clock.js` was corrected but not re-taught: it still cannot see a
clock and has no driven flag to test. Its `PREVIEWING_ALL` no longer means
*holds the cookie*, and the comment now says so.

### (b) C-asof2 — /admin SAYS WHEN IT IS DRIVEN

> **OPS:** *"A page printing 'Museum day: 2026-12-25' as though it were today is
> lying, and a driven day is routinely a day that has not happened."*

`/api/record` had always sent `today`, `realToday` and `driven` together for its
own stated reason — *"`today` alone reads as the truth on any day it has been
driven"* — and `WbAdmin.jsx` destructured two of the three away. **This was the
reader half of that sentence, and it had never been written.**

**THE LABEL MOVES, NOT JUST THE VALUE**, because the label is where the eye
lands first: it reads `Museum day, driven`, and a second row carries `The real
day`. The `Showing` line now reads the worker's new `showingAll` field rather
than the door button's own state — after C-asof1 the button's state would print
the opposite of what the museum is drawing. **`previewing` deliberately still
means *holds the cookie***, because the open/close button is drawn from it.

## 5. THE PROOF — A LAUNCH BUILD, SERVED, DRIVEN

`npm run build:launch` → `__WB_STAGE__ = "launch"` in `dist/weird_baby/index.js`,
and the deleted refusal string **absent from the built worker**. Served with
`npx wrangler dev` on `http://127.0.0.1:8787`, `RECORD_KEY` bound from
`.dev.vars`.

**NOT `npm run preview`** — it runs the DEVELOPMENT `npm run build` first and
would have silently overwritten the launch bundle. That is `stage-build.mjs`'s
own hazard (*"a build that builds half the application looks like a build"*)
reached from the other side.

### A STRANGER STILL SEES THE CALENDAR — Mike's condition

| Probe (no cookies) | Result |
|---|---|
| `/?as-of=2026-12-25` | 200, **no `Set-Cookie`**, `__WB_TODAY__="2026-08-27"` |
| `/?as-of=2026-08-20` | 200, `__WB_TODAY__="2026-08-27"` |
| `/?as-of=banana` | **200** — Ruling B: a passer-by's typo is not an error page |
| `/api/record?as-of=…` | `"driven":false` |
| control, no parameter | byte-identical globals |

Four reasons it cannot move: the state is a session-scoped HttpOnly cookie; the
mint needs `wb_record`; every HTML response leaves `private, no-store`; a driven
session cannot write.

### DRIVING FORWARD

    POST /api/record {key}        -> ok
    GET  /?as-of=2026-12-25       -> 200, Set-Cookie: wb_asof=…, private, no-store
    GET  /api/record              -> today 2026-12-25 · realToday 2026-08-27 · driven true

    GET  /?as-of=2099-01-01       -> 200, today 2099-01-01     (NO CEILING)
    GET  /?as-of=banana           -> 400 "malformed — expected YYYY-MM-DD"
    GET  /?as-of=2026-02-30       -> 400 "not a real calendar day — 2026-02-30 does not exist"
    POST /api/guestbook  (driven) -> 403, names BOTH days
    GET  /?as-of=off   (no cookie)-> 200 + clearing Set-Cookie   (exit not behind the key)

### THE ASSET DOOR, PER DAY, WITH `previewing:false` THROUGHOUT

The clock alone — the preview key was closed for every row below.

    driven 2026-09-01   scan-07-a.webp [due 09-02] -> 404 text/plain 9B
                        qc-101-a.webp  [due 09-03] -> 404 text/plain 9B
    driven 2026-09-02   scan-07-a.webp             -> 200 image/webp 109,982B
                        qc-101-a.webp              -> 404 text/plain 9B
    driven 2026-09-03   scan-07-a.webp             -> 200 image/webp 109,982B
                        qc-101-a.webp              -> 200 image/webp  77,630B

**THE BYTES WERE CHECKED, NOT THE STATUS.** §8: on this site a missing image is
a 200. The served files carry real `RIFF…WEBP` magic, so this is the file and
not the SPA fallback. The 404s are 9 bytes of `text/plain` — the worker's own
refusal, not a fall-through.

**AND THE LATENT LIE DID NOT FIRE.** The worker's `/api/record` note warns a
previewer can be handed a 200 of app HTML when `reveal:day --place` has not
moved a file out of `public/held/`. Driving forward is the first thing that
exercises it. All seven are physically at their public paths.

### THE RENDERED ORACLE — Ops looked first

| State | today | previewingAll | countdown | directory | entries |
|---|---|---|---|---|---|
| stranger | 2026-08-27 | false | **03d 21h 41m** | no wing | — |
| driven | 2026-09-02 | **false** | **gone** | **`\ROBOTS` first** | **001 002 003** |
| driven + preview | 2026-09-02 | true | gone | `\ROBOTS` | 001…005 |
| driven | 2026-12-25 | **false** | **gone** | **`\ROBOTS` first** | **001…005** |
| after `?as-of=off` | 2026-08-27 | false | **03d 21h 39m** | no wing | — |

`document.cookie` read **empty** while driven — the live `wb_asof` is the
server's real HttpOnly cookie.

**ONE PROBE WAS WRONG AND THE SITE WAS RIGHT.** A check for the wing queried
only `a` elements and reported the row missing at 2026-12-25; the directory rows
match `a,button`. §8's rule held: suspect the probe first.

**WHAT THE RENDER DOES NOT COVER.** Two screenshots were captured (the
stranger's lobby, and the driven lobby with `\ROBOTS`); the pane then stopped
compositing and the rest is `innerText`, which is what CSS displays. Nobody has
looked at the driven Record at 2026-12-25 as a picture.

---

## 6. GATES

    npm run lint              9 errors / 7 warnings — BASELINE, zero new
    npm run build             green
    npm run provenance:gate   PASS  (2 stale rows pruned, deletions only)
    npm run reveal:check      exit 0
    npm run instory:gate      PASS
    npm run docs:numbers:gate PASS
    npm run parity:gate       not run — no album changed (§9's own condition)

---

## 7. WHAT IS STILL ABSENT

Ruling A closed the direction; C-asof1 and C-asof2 closed the overlap and the
lying label. **These three were not ruled and are not built:**

1. **NO CONTROL FOR THE DATE.** Driving is still URL-typing. `/admin` now SAYS
   when it is driven, and it still has no way to START driving — a button for
   the Record cookie and nothing for the date. That is the exact defect
   `RecordDoor` was built to fix, in its own words: *"the only way through was a
   fetch pasted into a console — a flow he has rejected."* **Half of it is now
   closed and the half that is left is the half he has already rejected once.**
2. **NO GATE.** Nothing in this tree tests `resolveAsOf` or `showEveryRecord`,
   and no gate reads a response header or counts `todayInRecordTz(` call sites
   (both standing §8 flags). **This round's proof is a transcript, not a
   tripwire** — and `showEveryRecord` is now a rule three call sites depend on,
   with nothing to catch a fourth reader that tests the cookie directly.
3. **DRIVING IS A NO-OP AT DEVELOPMENT STAGE.** `DEFAULT_STAGE` is
   `development`, where `showingAll()` is true and `wingOpenOn()` returns true
   unconditionally, so `npm run dev` cannot exercise any of this. **Only a
   `build:launch` bundle does.** Unchanged by this round and stated because it
   decides how the next session tests it.

**AND THE STANDING CAVEAT, WHICH IS IN THE COMMIT MESSAGE AS WELL AS HERE:**
none of this has run on a live deployment. `docs/DEPLOYED.md` has never existed
in git history and is not gitignored, so no `deploy:launch` has completed since
`tools/deploy-record.mjs` landed at `e08e2b4` — the same day as `f2dc391`.
Everything measured above is `wrangler dev` on a launch bundle. **After the
deploy, ask the wire.**
