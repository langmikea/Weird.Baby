<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# THE HANDLES CORRECTED · THE LOBBY REPORTED · THE VIDEOS BLOCKED

**2026-08-28.** HEAD at start `06191e5`. Nothing committed by Code; Mike commits.

**Three items. One built, one reported, one blocked — and the blocker is the
adoption rule doing its job.**

---

## 1. THE HANDLES — BUILT, AND OPS OWES A CORRECTION

### What is observed

| surface | handle | |
|---|---|---|
| TikTok | **`@papaweird.baby`** · display name **Weird.Baby**, bio empty **[2026-09-01: the bio is SET — see `release/README.md`; this row is what was observed on the day]** | **the account EXISTS.** Mike made it. |
| YouTube | **`@PapaWeirdBaby`** | observed |
| Instagram | unset | account itself unstated |
| Facebook | unset | account exists, handle not supplied |

**The two known handles are close but NOT identical** — different casing, and
only one carries the dot. **Recorded as two real handles rather than reconciled
into one**, and **neither unset handle is inferred from them**: a pattern across
two surfaces is not a fact about a third. `M60` stays open for the other two.

**And the handles he made carry `Papa`, which is in none of his three stated
preferences** (`Weird.Baby` · `WeirdBaby` · `weirdbaby`). So the preference list
is a record of what he asked for, **not a rule the observed handles break.**

### OPS WAS WRONG ABOUT THE DOT

**Ops told Mike that TikTok does not permit dots in handles. That is false** —
`@papaweird.baby` has one.

**The claim was asserted from memory as a platform fact and nothing checked it.**
Not measured, not looked up, not carried as unverified where it mattered. It
reached Mike as a constraint, and a whole recommendation was built on it: that
the dot must move out of the handle and into the display name. **He did not need
that advice and it was wrong.**

**THE LESSON, which is the half worth keeping: a platform's rules are not in
this repository and Ops cannot read them from memory.** They change, they differ
per surface, and they are exactly the class of fact this project already refuses
to invent — a handle is not something Ops may invent, and neither is the rule
about what a handle may contain. **If a platform constraint is load-bearing, it
is observed on the platform, or it is carried as UNVERIFIED and named as such.**

**The claim is kept, marked false, not deleted** — `HANDLE.retractedClaim` in
`release-shape.mjs`. A struck claim that is removed reads to a later round as a
claim nobody ever made, and this one reached Mike.

### What stayed

**The precondition MECHANISM stays** even though TikTok no longer trips it. It
is about any surface, not about TikTok: the gate still refuses a posting that
claims to be `out` on a surface whose account does not exist, and Instagram —
still unstated — is the row that exercises it now.

---

## 2. THE LOBBY — REPORTED, NOT BUILT, BECAUSE THE REVERT IS ALREADY LIVE

Mike: *"Lobby: Revert to 'We're not open yet...' version with countdown to 9/7.
Remove 'Weird.Baby birthday' guestbook entry."*

### The copy half needs no work. It is already what a visitor sees.

**Read off `https://weird.baby` this round, not off the source:**

```
09  DAYS   20  HOURS   59  MINUTES   45  SECONDS

We're not open yet.
But you found us —
which means something.

The people who sign the guest book now
will be remembered differently
than the ones who come later.
```

**That is his requested copy, verbatim, live now.** Nothing needs reverting.

**WHY IT IS ALREADY BACK, AND NOBODY DID IT ON PURPOSE.** `WbHome.jsx` has
carried both notes since 2026-08-11 as the two branches of `ROBOTS_OPEN`:

```
ROBOTS_OPEN = !launched() || recordEntriesForToday(RECORD_ENTRIES).length > 0
```

At launch stage `launched()` is true, so the wing opens only when **the Record
has an entry for today**. Ruling D moved `RECORD_EPOCH` to 2026-09-07, so there
is no entry for today, so `ROBOTS_OPEN` is false — **and the "not open yet"
branch is what renders.** The countdown is rendered *unconditionally* and
removes itself on the museum's clock, targeting `recordVisibleAt(RECORD_EPOCH)`
— **one constant, no second literal.**

**So the epoch move did the revert.** This is the shape the brief anticipated:
the revert is not what it sounds like, because it already happened as a
consequence of something else.

### The guest book half is NOT a code change and Ops cannot do it

The entry is real and live:

> **07 · Weird.Baby** — *"My birthday, I guess! Weird.Baby is open for
> business!"* — Aug 17, 2026

**It is a row in the production D1 database**, not a string in the tree.
Measured: the worker has **`GET /api/guestbook` and `POST /api/guestbook` and
nothing else** — **there is no DELETE route anywhere in `src/worker.js`.**

So there are two honest options and **both are Mike's, not Ops':**

1. **A one-off D1 statement, host-side.** Look first, then delete:
   ```
   npx wrangler d1 execute weird-baby-db --remote --command "SELECT id, name, note, signed_at FROM guestbook WHERE name = 'Weird.Baby'"
   npx wrangler d1 execute weird-baby-db --remote --command "DELETE FROM guestbook WHERE id = <the id that came back>"
   ```
   Binding `weird_baby_db`, database `weird-baby-db`, id `4db60094-…`.
2. **Build a delete route.** **Ops recommends against it**: a new mutating
   public endpoint on a live site, for one row, is a permanent surface bought to
   solve a one-time problem.

**Ops did not run either.** §0 — Mike alone runs anything host-side, and this is
a destructive write to live data.

**Worth noting why he wants it gone:** the entry says *"Weird.Baby is open for
business!"* and dates itself 17 August. **The museum is not open** — the same
page now says so three lines above it, and the countdown says nine days. The
entry contradicts the Lobby it sits under.

---

## 3. THE TWO VIDEOS — BLOCKED, AND THE BLOCK IS PROVED

```
E.D. Yahdah - Weird.Baby - Early Instrumental   WOWS-RWywgA
Coconuts    - Weird.Baby - Early Front Porch    YibpBtf9IU8
```

**NOT ADOPTED. NOT BUILT.** The adoption rule is that a source is not adopted
until it has been seen **PLAYING** in a real iframe on a real origin, read after
it settles — and **Ops could not see anything playing at all.**

### What was done

A harness at `docs/shorts/out/adopt.html` (gitignored), served over http by
`npm run mock` because §8 rules that Ops cannot see `file://`. One player per
load, `youtube-nocookie` host, muted with an explicit `playVideo()`, sampled
every second for fourteen seconds and read after settling.

### The readings, and the control that killed them

| video | states | error | duration | currentTime |
|---|---|---|---|---|
| `WOWS-RWywgA` | `unstarted` | none | 126.581 | 0 ×14 |
| `YibpBtf9IU8` | `unstarted` | none | 126.581 | 0 ×14 |
| **`c1vODrVXOg0` — THE CONTROL** | **`unstarted`** | **none** | 113.833 | **0 ×14** |

**`c1vODrVXOg0` is the Coconuts official video. It is already adopted, already
in `weird-baby.js`, and live on the museum.** It does not play in this harness
either.

**So the harness cannot tell a good video from a bad one, and every reading
above is about the harness.** §8, exactly: *a stalled harness and a stalled
ceremony look identical.*

### The cause, measured

```
document.hidden      true
visibilityState      "hidden"
innerWidth           0
innerHeight          0
```

**The Browser pane is hidden and zero-sized. A tab that is not painting does not
start media**, which is the same family as §8's `requestAnimationFrame` row and
the *circular size resolves to zero* row. **THE ONLY ORACLE FOR PLAYBACK IS A
PERSON IN A FOREGROUND TAB**, and this session does not have one.

**One earlier reading was nearly reported and was wrong.** The harness's first
cut built BOTH players on one page; the browser gave the media slot to one, so
`WOWS-RWywgA` sat at `unstarted` while `YibpBtf9IU8` played for 90ms and paused.
**That looked like one good video and one refusing video, and it was neither** —
it was two players competing. Caught by §8's *suspect the probe before the site*
and rebuilt to one player per load. **Without the control, the rebuilt version
would have produced a confident and false "both refuse".**

### What Mike (or any foreground browser) must do

```
npm run mock
```
then open, one at a time, and watch:
```
http://127.0.0.1:8899/shorts/out/adopt.html?v=WOWS-RWywgA
http://127.0.0.1:8899/shorts/out/adopt.html?v=YibpBtf9IU8
http://127.0.0.1:8899/shorts/out/adopt.html?v=c1vODrVXOg0
```
**Run the control third.** If the control does not play either, the browser is
the problem and the first two readings mean nothing — which is the whole reason
it is on the list.

**`ADVANCING: YES` on the first two is the adoption.** Anything else is not, and
Ops will not accept a substitute.

**The mock server was stopped** — §8's own hazard about a dev server left
running on Mike's machine, which cost a round when a live unmuted player sat in
a pane for twenty minutes.

### And one thing that is settled without playback

**E.D. Yahdah's spelling stands as `Yahdah`.** Mike confirmed the copyright.
YouTube's title reads *Yadah* and **the channel is wrong, not the museum** — so
when these are adopted, the museum's `title` is not taken from the platform.

---

## 4. GATES

```
release:check         PASS
lint                  9 errors / 7 warnings — BASELINE, zero new
build                 green
provenance:gate       PASS
reveal:check          PASS
instory:gate          PASS
docs:numbers:gate     PASS
```

**Nothing under `src/` changed.** `releases.json` is untouched — no posting was
added for TikTok, because the account existing is not the same as a video being
on it.

---

## 5. WHAT IS STILL OWED

1. **The guest book row.** Mike's, host-side, above.
2. **The two videos.** Blocked on a foreground browser. Not adopted, not built.
3. **Instagram and Facebook handles.** `M60`, and not inferrable from the two
   that are known.
4. **Instagram's account** — still unstated either way.
