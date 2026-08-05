# THE BOOTH EDIT + THE MISSING LAP — round log (v53, B1–B6)

**2026-08-05 · drafting lane · single agent · autonomous · no git until seal.**
Sealed against `07508a6` (`docs: THE GIVING RESEARCH — the material, not the call`).

Gates: lint **11 errors / 9 warnings = baseline, zero new** · build **green, 72
modules** · `provenance:gate` **PASS, UNDECLARED 0, INVENTION 0, stale 0** ·
**the browser lap RAN**, desktop and 390px, eleven routes, zero console
errors/warnings, zero horizontal scroll.

---

## B1 — THE BROWSER LAP THAT DIDN'T RUN

v52 sealed with its own gap named: the Chrome extension was unavailable, so
every rendered string was verified in the built bundle and nobody had seen
`/robots` with MGK-NIAC on it or watched the guest book step. It has now run.

### How it ran, stated because the method is not the obvious one

The Chrome window this session drives is **maximised and refuses programmatic
resize**, and it reports `document.hidden === true` throughout — the desktop is
present (a PowerShell screen grab shows it) but Chrome is behind another window,
so the tab is never the visible tab. Two consequences, both worked around and
both named rather than hidden:

1. **The 390px viewport is a 390×800 same-origin iframe rig**, not a 390px
   browser window. Chrome's own minimum window width bottoms out at a **540px**
   client area here, and a script-opened popup — which does go narrower — cannot
   be screenshotted by the extension. The rig gives a genuine 390px layout
   viewport: media queries, intrinsic sizing, `position: fixed`, `100vh` and
   overflow all resolve against it, which is everything this lap is asking. What
   it does not reproduce is a phone's overlay scrollbars, so the **content width
   is 373px, not 390** — the lap is 17px tighter than a real phone, which is the
   safe direction to be wrong in.
2. **The guest book will not advance while `document.hidden`**, which is the Q1
   fix doing its job and was confirmed first, unpatched: the book sat at offset 0
   for **40+ seconds** with `hidden === true`. To watch it move, `document.hidden`
   was overridden to `false` in the live page and `visibilitychange` dispatched.
   Nothing else was patched — the real component, real timers, real transitions.

### THE GUEST BOOK — it steps by one name, and it wraps

Observed on `/` against the 9-signature local book (`n = 9`, `copies = 2`):

| t | offset | rows in the window |
|---|---|---|
| 0.0s | 1 | Ada · Bram · Coretta |
| 5.9s | 2 | Bram · Coretta · Dinah |
| 11.9s | 3 | Coretta · Dinah · Elias |
| 17.9s | 4 | Dinah · Elias · Fen |
| … | 9 | **Ines · Ada · Bram** ← standing on the seam |
| +1.0s | 0 (`snap`) | Ada · Bram · Coretta ← the wrap, same pixels |

**One name per bounce, one bounce per five seconds, and the seam wrap is
invisible because the pixels either side of it are identical.** Every sample
across both probes showed **exactly three rows** — `blanks: 0`, `minCount: 3`.
The offset never exceeded `n`. At 390px the book is 92px tall and shows the same
three rows.

*The step interval reads ~6s rather than 5s because a hidden tab throttles
timers; the stride, the wrap and the row count are what this proves, not the
clock.*

### MGK-NIAC — the rename does not collide anywhere

- `/robots` desktop and 390px: the album band reads **MGK-NIAC**, and at 390px
  it is centred under its own cover to the pixel — **123px clear on the left,
  123px clear on the right**.
- The new cover renders: the ROBOTS-template square, the head-lens detail in the
  disc where the WB mark sits on the wing cover, MGK-NIAC set across the measure.
- The tracklist reads **01 The Name · 02 Image Archive · 03 Technical
  Specificatio…** (the third truncates at 390, which is the contents column
  behaving). The face heading is **THE NAME**, subtitle **MGK-NIAC · TWO NAMES,
  ONE MACHINE**.
- **M30 IS NOW CONFIRMED ON THE GLASS AND NOT ONLY IN THE ASSET TABLE.** The
  cover badge and the still on the face one press below it are the same
  photograph, visible in one screenshot without scrolling. The register row said
  this; nobody had seen it.

### What the bundle-only verification could not have caught

**1. `/hr` loads Facebook sixteen times, on arrival.** Read off
`performance.getEntriesByType('resource')` after a nine-second settle, nothing
clicked:

| room | third-party hosts requested on load |
|---|---|
| `/` · `/booth` · `/shop` · `/foundation` · `/hr/archive` | Google Fonts |
| `/robots` · `/wal` · `/wb` | + `www.youtube.com` ×3 |
| `/hr` | + `www.youtube.com` ×3 **+ `www.facebook.com` ×16, in 17 iframes** |

A grep of `src/` finds every one of those strings, and two rounds of readers
found them and still wrote *"the only outside party this site touches"*. What no
grep produces is the word **unprompted** — that sentence exists only in the
network panel. This is B2's material and it is written up there.

**2. `/wal`'s title bar has 6px of air at 390px.** Measured between the text
boxes: `Weird.Baby` ends at 91, `Worth A Listen` starts at 97, `Gift Shop` starts
at 241 — **6px** on both sides. Nothing collides today. The same measurement on
the other rooms: `/booth` 9px, `/wb` 24px, `/foundation` 26px, `/robots` 42px.
**`Other Music Worth A Listen` is the longest room name the board carries and the
bar shortens it to `Worth A Listen`; there is no headroom left if a future room
name is longer.** Raised as [C36].

**3. `/wb`'s title bar prints "Weird.Baby" twice**, 24px apart — the brand at 16
and the room name at 115. Correct by construction (the room IS Weird.Baby Music
and the bar shortens it), and it reads as a stutter at 390px. Raised as [C37],
low.

**4. `/admin` is unusable narrow.** At a 390px viewport its jump buttons lay out
to x=633 and the page does not scroll horizontally, so **`/shop`, `↺ Refresh` and
`← Back` are clipped off the right edge and cannot be reached.** Dev-only route,
reached by typing `mmm`; raised as [C35] beside C33's other admin work.

**5. `/hr`'s Facebook cards render as blank blocks** — seventeen 706px-tall
`hr-card-fbembed` cards whose plugin iframes do not paint, so the artifact grid
below the player bar is a run of empty rectangles. That is the shape of
**[C12] DECKBUG-FBBLOCKS**, whose row has read *"Reproduction unconfirmed"* since
it was written. **It is NOT marked confirmed**, because this was measured on
`localhost` and Facebook's plugin endpoint may simply refuse that origin. C12's
row now carries the observation and what would settle it.

**6. `/admin` reports `D1_ERROR: no such table: visits`** against the local dev
D1. A dev-database gap, not a site defect; recorded so the next session does not
diagnose it twice.

Everything else laps clean. Eleven routes — `/`, `/robots`, `/wal`, `/wb`,
`/hr`, `/hr/archive`, `/booth`, `/foundation`, `/shop`, `/money`, an unmatched
path — at 390px and at desktop: **zero horizontal scroll, zero console errors,
zero console warnings.** The coverflow's off-strip covers report as
out-of-viewport and are clipped by `.cf-wrap { overflow: hidden }`, which is the
carousel working. `/wal`'s band title sits left at 390 rather than centred, which
is v51/A3's documented ≤720px fallback for the one wing carrying a transport.

---

## B2 — THE TRACKING ANSWER: THE MACHINE REMEMBERS YOU AND WE DON'T

Mike's brief: *"cookies and stored settings are different things — a cookie is
SENT TO THE SERVER on every request, which is what makes it tracking;
localStorage never leaves the browser unless code ships it, and ours doesn't.
Both are true at once. Say the stronger, truer thing."*

**N5's answer was true and it was underselling the truth.** It folded the
browser-side storage into eleven words — *"a panel width, whether you have
already walked through a room this visit"* — filed under things to reassure the
visitor about. It is the most interesting fact on the page: **the MGK holds a
visitor's NAME and BIRTH DATE, and it holds them somewhere the museum cannot
reach.** The new answer leads with that.

Every clause was checked against a file or a probe, and two were checked against
the running site because no file could answer them:

| clause | what establishes it |
|---|---|
| no login | `src/worker.js` — no auth on any route |
| no cookies | no `Set-Cookie` in the worker, no `document.cookie` in `src/`, **and none in `public/robots/twin.html` either** |
| three columns | `POST /api/visits` inserts `(page, referrer, visited_at)`; the only two callers are `WbHome.jsx:278` and `Exhibit.jsx:2163` |
| exactly what you typed | `POST /api/guestbook` — name, note, a fixed badge, a timestamp |
| the machine's record | `Rec_Keys_Local` = 7 localStorage keys, `Rec_Keys_Session` = 3 |
| it cannot send them | **ZERO `fetch` and ZERO `XMLHttpRequest` in the whole twin** |
| the register | `Preferences ▸ User ▸ GO>` in `MENU_TABLE_SRC`; `REC_PAGES = 5`; `Rec_Purge` removes all ten keys |
| what leaves the building | `performance.getEntriesByType('resource')`, every room, nine-second settle, nothing clicked |

**THE TWIN'S KEYS LIVE IN THE MUSEUM'S OWN ORIGIN.** `/robots/twin.html` is
served by this site, so its storage is `weird.baby`'s storage — confirmed by
reading `wbr_boot_level`, `wbr_health`, `wbr_parcel` and `wbr_son_best` back off
the museum's own `localStorage` in the browser. That is what makes the answer
the museum's to give rather than the machine's.

**THE COUNT IS TEN, NOT NINE.** Mike's brief says nine and the robots `STATE.md`
says seven-plus-two; `Rec_Keys_Session` returns **three** — FR2 added
`wbr_portal_session` and the register grew a THIS VISIT ONLY page for it. **No
number is printed on the glass**, because a count nothing gates goes stale the
first time the machine learns a key, and the answer names the things instead.

**THE OUTBOUND CLAUSE IS THIS ANSWER'S THIRD, AND THE FIRST TWO WERE BOTH
WRONG.** N5 caught *"that is the whole of it"* being false and replaced it with
*"Google … the only outside party this site touches"*, which is also false. The
answer now names **Google, YouTube and Facebook**, and says the second and third
arrive before a visitor presses anything. It stays the loudest clause, as Mike
asked; it names two more parties than he expected it to, which is B1's finding
and is [M37].

*Deviation from the brief, stated: Mike wrote "keep the Google Fonts disclosure
as the loudest clause — it is the only thing that leaves the building." It is
not. The clause is still the loudest and it is still first inside itself; it now
names three parties because naming one would have been the third wrong version
of the same sentence.*

---

## B3 — TWO QUESTIONS DELETED

Mike: *"both read as forced."* Struck under **THE LAW OF SUBTRACTION**, and both
for the same reason: the building already shows a visitor the answer.

- **"What are the rooms?"** — the DIRECTORY on the front page lists every room by
  name, above the fold, and each is one click.
- **"There is a gift shop. What is it?"** — the shop is one of those rows.

Neither is replaced. The FAQ is eleven questions down to nine.

**What went with them, named rather than dropped quietly:** the shop answer
carried a `[PAPA]` — *what the house does with anything its own shelf earns.*
That is a question about the Foundation rather than about the shop, and the
Foundation's own page is where it belongs, so it went with the paragraph instead
of being re-homed. **[M21]'s marker count moves by one.**

---

## B4 — "CAN I USE WHAT IS HERE?", LED FROM THE OTHER END

It opened on the museum's own photographs and then had to qualify itself in the
same breath — *"and we are glad to be asked"* arriving as a defence. Mike: *"lead
with THEIRS IS THEIRS, then fold ours in behind, simply and gladly."*

It now opens **"The artists' work is the artists'"**, gives the doors their
sentence, and the museum's half is one short clause behind it. Same facts, one
`[PAPA]` unchanged, shorter by a line.

---

## B5 — THE SWEEP, AND WHAT IT FOUND

Two faults to look for: copy that explains what the site already shows, and copy
that leads with the house where it should lead with the visitor or the artist.
Nine answers read. **Two hits, both fixed; seven left alone and the reason
recorded, because a sweep that changes everything it touches is not a sweep.**

**Hit 1 — "Is it really free?" restated the credo 400px above it.** The placard
says *"No tickets, no tiers, no ads."*; the answer opened *"Free. No ticket, no
tier, no account, no ads…"* — the page explaining what the page already says, in
smaller type. What survives is the part the credo does not carry: **no account,
nothing to unlock, nothing behind a wall, and this is an arrangement rather than
an offer.**

**Hit 2 — "What is this place?" led with ours.** *"Some of it is ours. Some of it
belongs to people we admire…"* Two sentences swapped, nothing else changed. The
room built the other way round is the larger half of what is here and it was
reading second in the museum's own first answer.

**Left alone, and why:**

| answer | the reading |
|---|---|
| "Who keeps this place?" | leads with the house because the question asks about the house |
| "How does something get in here?" | leads with somebody loving the object, not with the institution; accessioning practice is a museum's standing terms, not the making of this website |
| "Are you affiliated…?" | already leads with the artists |
| "Is it finished?" | about the collection growing, and it shows nothing a visitor can already see |
| "How do I reach you?" | leads with the visitor's own action |

---

## B6 — THE REGISTER

`docs/OPEN_ACTIONS.md` updated in this round's commit per Doctrine 14. Rows
added: [M37] (three third parties, two unprompted, one ever disclosed), [C35]
(`/admin` clipped at 390), [C36] (`/wal`'s 6px title bar), [C37] (`/wb`'s
doubled brand). Rows amended: [C12] (the FB-block observation and what would
settle it), [M21] (one marker gone with the shop answer), [M30] (confirmed on
the glass).

---

## WHAT THIS ROUND EXPOSES

1. **The museum's credo and its network panel disagree.** *"No tickets, no
   tiers, no ads"* is on the front page of the booth, and one exhibit ships
   seventeen Facebook iframes to a visitor who has clicked nothing. The FAQ now
   says so out loud, which is the honest floor; whether the embeds stay is
   [M37] and it is Mike's.
2. **A third-party embed is a provenance hole the gate cannot see.** `npm run
   provenance:gate` reads every string in `src/`; nothing in the boundary asks
   what a page REQUESTS. Three wrong outbound sentences in three rounds is not
   three careless readers — it is a class of claim the instrument does not cover,
   and `provenance/README.md` §4 is where it belongs if it is ever mechanised.
3. **The lap is the only instrument that produced any of this.** Every finding
   above — the Facebook requests, the 6px bar, the clipped admin, the blank FB
   cards, M30 on the glass — came from loading the pages. v52 sealed without one
   and named the gap; the gap was real and it was five findings deep.
