# FINDING — the four `ROBOTS_OPEN` consumers

**Round:** the `ROBOTS_OPEN` consumers, read-only packet. **Written:** 2026-08-30.
**Scope:** READ ONLY except the register row and this report. Nothing that
publishes was changed. No repair was written. Every defect is flagged.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.
**Register:** filed as [`L-e`](OPEN_ACTIONS.md#l-e), Doctrine 14, this commit.
**Follows:** [`FINDING-autonomous-timeline.md`](FINDING-autonomous-timeline.md) §4.

**Method notation.** **READ** — the tree states it, at a named file and line.
**RUN** — a command was executed and this is its output.

> **THE SPLIT §4 ASKED FOR HAS AN EMPTY SECOND HALF, AND THAT IS THE ANSWER
> RATHER THAN A DODGE.** All three unruled consumers are routing and visibility
> of copy that already exists; none needs a word from Mike. The one that does is
> the **fourth** consumer, and not because of a string — because repairing it
> reverses a ruling he made. §4.

---

## 1 · THE CONST

`src/lib/wing-open.js:55-56`, READ:

```js
export const ROBOTS_OPEN =
  !launched() || recordEntriesForToday(RECORD_ENTRIES).length > 0;
```

**Evaluated once, at module load.** RUN — nothing re-evaluates it: no
`setInterval`, no `location.reload`, no re-render path, and **no context,
store or event target exists anywhere in `src/`** (`grep -rn
"createContext\|useSyncExternalStore\|EventTarget" src/` returns nothing).

It is not keyed on a date. It is keyed on **the Record having an entry today**,
and "today" is `TODAY` — `src/lib/record-clock.js:100`, itself a module-load
const reading the worker's injected `__WB_TODAY__`.

---

## 2 · THE FOUR CONSUMERS, EITHER SIDE OF 17:00

RUN — `grep -rn "ROBOTS_OPEN" src/` returns four use sites and two imports.

**Visitor A** loads the lobby fresh at 17:00:30 on 2026-09-07.
**Visitor B** opened the same page at 16:45 and has not touched it.

Both are on the same deployed bundle. The only difference is when the HTML was
fetched, and therefore what `__WB_TODAY__` said when the module graph ran.

| # | consumer | Visitor A — fresh after the hour | Visitor B — tab open since before it |
|---:|---|---|---|
| 1 | `src/routes/WbHome.jsx:1211` — the lobby note | *"Welcome. The first 100 people who sign the guest book…"* | **"We're not open yet."** |
| 2 | `src/routes/WbHome.jsx:1001` — the `\Robots` directory row | present, links to `/robots` | **absent — the wing has no door on the board** |
| 3 | `src/App.jsx:160` — `/robots` | `<Robots />` | **`<WbHome />` — the wing renders as the lobby** |
| 4 | `src/App.jsx:173` — `/robots/record` | `<Robots open="record" />` | **`<WbHome />` — the Record's own address renders the lobby** |

All READ, at the lines named.

**And the fifth thing on that page, which is NOT a `ROBOTS_OPEN` consumer:**

| | `src/routes/WbHome.jsx:88-131` — the countdown | already zero, `remainingAt` returns `null`, never renders | **removes itself live**, on the museum's clock, at the render that crosses zero |

**So Visitor B's lobby at 17:00:01 is:** the countdown gone, and every other
signal on the page saying the museum is shut. **The one element that knows the
time is the one that leaves.**

**Visitor A is correct in every particular.** Nothing here is a defect in what
the museum serves — the worker computes `recordToday` per request
(`src/worker.js:1039`), and every HTML response is `no-store`
(`src/worker.js:190-194`, `:523`), so **no cache can serve Visitor B's stale
page to anybody else, and a reload always fixes it.** The defect is bounded to
a tab already open, and nothing on that tab says to reload.

### 2.1 · It is not only opening night

`src/data/artists/robots.js:409` resolves `entries:
recordEntriesForToday(RECORD_ENTRIES)` **inside a top-level array literal**
(`const WBR_TRACKS = [` at `:330`), so it is eager too — READ. A visitor already
inside the wing with a tab open across 17:00 on **2026-09-08, 09-09, 09-10 or
09-11** does not gain that day's entry either. Where the frozen list is empty,
the face draws `logEmpty: "Nothing has been entered in the Record yet."`
(`robots.js:423`).

---

## 3 · IS THE MUSEUM'S CLOCK REACHABLE AT THE THREE UNRULED SITES?

**Yes, at all three, and without introducing a second clock.** The client-side
equivalent of the worker's request-time read already exists and is already in
use by the countdown:

| piece | what it gives | where |
|---|---|---|
| `museumNow()` | epoch-ms as the museum reckons it, **now** — the server's injected instant advanced by `performance.now()`, a monotonic counter the visitor's device clock cannot move | `src/lib/record-clock.js:130-133` |
| `todayInRecordTz(now)` | that instant as the museum's **day string**, 17:00 boundary included | `reveal/record-clock.mjs:104-113` — it already takes a `Date` argument |

So the live equivalent of the const is the same derivation with a live day
substituted for the frozen `TODAY`. **No new date literal, no second clock, no
round trip.**

| site | already imports | would additionally need |
|---|---|---|
| `WbHome.jsx:1001` | **`museumNow`** and `SERVER_NOW` (`:26`), for the countdown | `todayInRecordTz`, `RECORD_ENTRIES`, `visibleEntries`/`showingAll` — or one shared hook |
| `WbHome.jsx:1211` | same — same module, same import | same |
| `App.jsx:160` and `:173` | only `ROBOTS_OPEN` (`:17`) | the whole set above; `App` is `export default function App()` at `:66`, so state can live there |

**There is nothing to SUBSCRIBE to.** RUN — no context, no external store, no
event bus for the museum's day exists in `src/`. The only live-clock pattern in
the tree is the countdown's own poll: `setInterval(tick, 1000)` plus a
`visibilitychange` recompute, `WbHome.jsx:105-124`, written against the measured
hazard that a hidden tab's interval is throttled to about once a minute.

**So each site would either poll, or a shared hook would have to be written and
all four would read it.** Which of those it should be is a design call and is not
made here. **No change was written.**

---

## 4 · WHICH ARE OPS' AND WHICH ARE MIKE'S

### 4.1 · All three unruled consumers change NO visible string

| site | what a repair changes | new copy? |
|---|---|---|
| `App.jsx:160` | which element the route renders | **none** — `<Robots />` and `<WbHome />` are both already built |
| `App.jsx:173` | same | **none** |
| `WbHome.jsx:1001` | whether an existing button is in the DOM — `<span>\Robots</span>` plus the arrow, already written | **none** |

**All three are Ops', and all three move without him.** They are routing and
visibility, not authorship.

### 4.2 · The one that is Mike's is the FOURTH consumer, and not because of a string

`WbHome.jsx:1211`'s note also needs no new copy — **both branches already exist
in the ternary**, and both are his words. It is parked for a different reason:

**Making it live reverses a ruling.** `docs/MUSEUM_SITE_CHANGES_LOG-20260815.md`
§14.3 put four options for what happens at zero. Option 1 was *"The counter is
replaced by the open-state copy it was counting toward… needs the countdown to
trigger the same swap `ROBOTS_OPEN` performs, in-tab."* Option 3 was *"The
counter removes itself and leaves the copy beneath it standing."* **Option 3 is
what was built, and the source records it as Mike's** — `WbHome.jsx:78`, READ:
*"AT ZERO IT REMOVES ITSELF — **his ruling**."*

Repairing the note is switching from option 3 to option 1. **That is his call
and it is parked until the seventh.**

### 4.3 · THE THREE ARE COUPLED TO §2.1, AND THAT IS THE ONE TRAP HERE

Repairing consumers 3 and 4 (the routes) **without** `robots.js:409` lets
Visitor B into the wing with a Record list still frozen at module load — so the
wing would open onto *"Nothing has been entered in the Record yet."* **That is a
worse page than the one the stale route currently gives them.** The routes and
`robots.js:409` are one unit of work, not three plus one.

---

## 5 · WAS OPTION 3 APPLIED, OR ONLY RECOMMENDED?

**Applied. Commit `70fb390`, 2026-08-16 00:33:15 -0400** — *"WAL directory, gift
shop friend tiles, museum FAQ, nocookie embeds, self-hosted fonts, lobby
countdown"*. RUN:

```
git log --oneline -S "AT ZERO IT REMOVES ITSELF" -- src/routes/WbHome.jsx
70fb390 …

git show --stat 70fb390 -- src/routes/WbHome.jsx
 src/routes/WbHome.jsx | 115 +++++++++++++++++++++++++++++++++
 1 file changed, 115 insertions(+)
```

The countdown arrived whole in that commit, carrying `if (!left) return null;
/* AT ZERO IT REMOVES ITSELF */` at its line 98 — RUN, `git show
70fb390:src/routes/WbHome.jsx`. The string has never changed since; that commit
is the only hit. **Roughly eleven hours separate the analysis from the build.**

**The `ROBOTS_OPEN` ternary was already there and was not touched** — it stands
at line 1042 of the file as that commit left it. RUN. So option 3 was not
implemented *over* the note; the note was simply never in the change.

### 5.1 · The error travelled from the log into the source, and gained a ruling on the way

`MUSEUM_SITE_CHANGES_LOG-20260815.md:571-572`, READ:

> **Ops' note, not a ruling:** 1 and 3 are the only two that leave nothing stale
> on the glass, and 3 is the one that needs no new copy from Mike at all.

`src/routes/WbHome.jsx:78-82`, READ — the same claim, now in the code, now
attributed:

> AT ZERO IT REMOVES ITSELF — his ruling. `null` is returned, the component
> unmounts, and **the copy beneath stands with nothing stale on the glass** and
> no new copy needed. **It does this LIVE, in a tab left open across midnight**

**Those two sentences are in the same paragraph and they cannot both be true.**
The second describes exactly the case — a tab held open across the boundary — in
which the copy beneath is `ROBOTS_OPEN ? welcome : "We're not open yet."` with a
frozen `false`. **The half that is right is "no new copy needed."**

This report does not rule on whether option 3 was the right choice. It reports
that the sentence used to justify it is false in the case it names.

---

## 6 · IS THERE A FIFTH?

**Yes — one, and it is `src/data/artists/robots.js:409`.** §2.1.

RUN — every call site of the frozen-day function in the bundle:

```
grep -rn "recordEntriesForToday(" src/
  src/data/artists/robots.js:409      entries: recordEntriesForToday(RECORD_ENTRIES),
  src/lib/record-clock.js:139         export function recordEntriesForToday(entries) {
  src/lib/wing-open.js:56             !launched() || recordEntriesForToday(RECORD_ENTRIES).length > 0;
```

**Two eager call sites: `ROBOTS_OPEN` itself, and the Record's own entry list.**
Nothing else in `src/` imports `TODAY` either — RUN, every other match for the
token is prose in a comment.

### 6.1 · Same class, already ruled — not counted as a sixth

`PREVIEWING_ALL` (`src/lib/record-clock.js:53`) is a module-load const over an
injected global, exactly like `TODAY`. It goes stale the same way when Mike
enters or clears the preview code. **It is not an unlooked-at case:**
`src/worker.js:510-524` is written about precisely this — *"Mike enters the
preview code, reloads, and the page has not noticed the door moved"* — and the
answer taken was `no-store` on every HTML response so that a reload always
re-reads. **A reload is the designed path there, and it is stated.**

### 6.2 · Checked and cleared

`STAGE` and the placement set (`src/lib/placement.js:28-32`) are build-time
constants and cannot go stale against a clock. `SERVER_NOW` and `MONO_ORIGIN`
(`record-clock.js:119-127`) are module-load **by design** — they are the origin
the monotonic counter measures from, which is what makes `museumNow()` live.
`SERVER_TODAY` (`:40`) is the injected value `TODAY` derives from and is
correct at load by construction.

**So: four consumers of one const, plus one more site of the same class. No
sixth.**

---

## 7 · FLAGGED, NOT FIXED

- **F10 — `CH5-a` is cited as an open row and is not one.** RUN: it is referenced
  at `src/data/artists/robots.js:408`, `docs/canon/09-PUBLISHED.md:29`,
  `docs/MUSEUM_COPY_AND_RECORD_LAYOUT_LOG-20260817.md:908` and twice in
  `docs/MUSEUM_HIDDEN_WING_LOG-20260812.md`, but appears in neither
  `docs/OPEN_ACTIONS.md` nor `docs/OPEN_ACTIONS_CLOSED.md`. Four live citations
  pointing at a row that does not exist.
- **F11 — §5.1's contradiction is now in the source**, attributed as a ruling,
  where a future round meets it as settled.

---

## 8 · EVERY COMMAND RUN

Read-only throughout. No repair was written.

```
grep -rn "ROBOTS_OPEN" src/ docs/
grep -rn "recordEntriesForToday(" src/
grep -rn "\bTODAY\b" src/
grep -rn "createContext|useSyncExternalStore|EventTarget" src/
grep -rn "setInterval|location.reload" src/routes/WbHome.jsx src/App.jsx src/lib/wing-open.js src/lib/record-clock.js
git log --oneline -S "AT ZERO IT REMOVES ITSELF" -- src/routes/WbHome.jsx
git log -1 --format="%H %ad %s" --date=iso 70fb390
git show 70fb390:src/routes/WbHome.jsx
git show --stat 70fb390 -- src/routes/WbHome.jsx
grep -rn "CH5-a" docs/ src/
```

Everything else is READ, at the file and line named beside it.
