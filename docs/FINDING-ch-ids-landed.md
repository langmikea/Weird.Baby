# FINDING — the six CH ids landed, and the class that made them

**Round:** landing the CH ids. **Written:** 2026-08-30.
**Scope:** six register rows, three published counts re-measured, one §8 lead
line, and this report. **No citation was edited. Nothing that publishes was
changed.** Record 005's headline and the public chunk were not touched — that is
Mike's, and it is on the seventh's list.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.
**Follows:** [`FINDING-ch5a.md`](FINDING-ch5a.md).

**Method notation.** **READ** — the tree states it, at a named file and line.
**RUN** — a command was executed and this is its output.

> **THE THREAD DOES NOT END AT SIX.** Two more ids — `N-c` and `V-B` — are cited
> live as register rows and have never been in either register in any commit.
> They are reported, not filed: Ops ruled on six. §5.

---

## 0 · HEADROOM — NO FIFTH CUT, AND THE NEXT ROUND WILL PROBABLY NEED ONE

| | bytes | of ceiling |
|---|---:|---:|
| `docs/canonical/OPERATIONS.md` before | **38,311** | 95.8% |
| the filed lead line | **373** | |
| after | **38,684** | **96.7%** |

RUN, `npm run ops:size`, PASS both sides. **The fifth cut was not taken and
`OPERATIONS_ARCHIVE/08-KNOWN-HAZARDS-V.md` was not created**, because 38,684 is
inside 40,000.

**But the margin is now 1,316 bytes.** At this round's measured rate — 308 bytes
last round, 373 this one — that is **three or four more lead lines**, not five.
Whichever round files the next two hazards should expect to take the cut first
rather than discover it at the ceiling.

---

## 1 · THE SIX ROWS

Filed in `docs/OPEN_ACTIONS.md`, immediately after [`L-e`](OPEN_ACTIONS.md#l-e).
**The ids were kept** — no id moves when a legend is recut, and twenty-two
citations point at these. Each is dated **Raised 2026-08-12**, the day it was
minted, rather than today: the row is late, the item is not new.

| id | status, measured | owner | citations |
|---|---|---|---:|
| [`CH5-a`](OPEN_ACTIONS.md#ch5-a) | **OPEN** | Mike + Ops | 10 |
| [`CH5-b`](OPEN_ACTIONS.md#ch5-b) | **OPEN** | Mike + Ops | 5 |
| [`CH5-c`](OPEN_ACTIONS.md#ch5-c) | **OPEN** — not answerable from the tree | Ops | 1 |
| [`CH6-a`](OPEN_ACTIONS.md#ch6-a) | **OPEN** | Ops | 3 |
| [`CH6-b`](OPEN_ACTIONS.md#ch6-b) | **OPEN** — not measurable from the tree | Mike | 1 |
| [`CH6-c`](OPEN_ACTIONS.md#ch6-c) | **CLOSED** | Ops | 1 |

RUN — all six parse at eight cells, like every row around them, and the
register's own status and owner vocabulary was used rather than a new one.

### 1.1 · How each status was established — from behaviour, not from the citations

**`CH5-a` — OPEN.** RUN, launch build: Record 005's own headline
`PORTAL CONNECTION ONLINE`, dated 2026-09-11, is in `dist/client/assets/index-*.js`
at a public address behind neither directory door — eleven days early. And the
fix the citations promise has not landed: `/api/record` (`src/worker.js:965`)
returns `today`, `tz`, `previewing`, `showingAll`, `configured`, `note`,
`maxAgeDays`, `realToday`, `driven` — **and no entries.**

**`CH5-b` — OPEN.** RUN, launch build: the Ledger room's own title string
`Money in, out` is in a public chunk behind neither door, while
`foundation.js:1074`'s `HIDDEN_AT_LAUNCH` hides the room from the page. **The
claim holds exactly as written eighteen days ago.**

**`CH5-c` — OPEN, and the tree cannot answer it.** `RECORD_KEY` is a deployment
secret; no file here knows whether it is set. The row names the one cookie-free
GET that would settle it (`/api/record` → `configured`) and records that it was
**not** probed, because `door:check` is this tree's sanctioned wire tool and does
not cover that endpoint. **Stating what would answer it is the answer available.**

**`CH6-a` — OPEN.** RUN: `HELD_PATHS` (`vite.config.js:325`) holds
`robots-units.js`, `use-overlay.js`, `vocabulary.json`, `era-buckets.json` and
`vault-audio.js`. **Neither `robots.js` nor `robots-record.js` is in it** — so the
fix the citations name has not been made. The ledger carries ten `face.*` rows,
4 REVEALED and 6 HELD.

**`CH6-b` — OPEN, and no gate can move it.** It asks for three console values
from Mike's own screen. Recorded as waiting on him.

**`CH6-c` — CLOSED, and it is the cheapest proof the class is real.** RUN:
`src/routes/WbHome.jsx:1286` records that *"Welcome, Founding Visitor."* was
STRUCK, with the reason, and what renders now is `You're in the book.`
**It was struck on 2026-08-11 and listed as open on 2026-08-12** — done the day
before the list that carried it was written, and nothing could close it, because
the only place it was filed was a snapshot.

### 1.2 · The disagreement is recorded, not resolved

`CH5-a`'s row carries both readings verbatim and picks neither:

> `record-clock.js` and `09-PUBLISHED.md` call it *"a known and accepted limit"*
> AND promise the endpoint move in the same sentence — accepted and outstanding
> at once — while `MUSEUM_COPY_AND_RECORD_LAYOUT_LOG-20260817.md:908` calls it
> *"the documented, accepted limit"* with nothing owed. **Ops is not picking
> which sentence was right.**

`CH5-b` carries the same shape by reference. What the rows add is a *Missing*
line naming the one ruling that would settle both.

---

## 2 · THE TWENTY-TWO CITATIONS ARE UNTOUCHED

**None was edited**, including the four in live code that still say *"Open row"*
about rows that, until this commit, did not exist. They are dated text, and four
of the twenty-two are in round logs that §0 rules are never edited.

**What changed is the other end.** The rows are now the ledger, and every one of
those citations resolves to something real for the first time since 2026-08-12.
A reader who follows *"Open row `CH5-a`"* now arrives somewhere.

---

## 3 · THE PUBLISHED COUNTS, RE-MEASURED

`docs/BACKLOG.md:311-312` — RUN, counted off the register's own rows:

| | before | after |
|---|---:|---:|
| rows | 164 | **170** |
| OPEN | 158 | **163** |
| owned by Mike | 131 | **132** |

Five of the six are `OPEN` (`CH6-c` is `**CLOSED**`), and one of the six is owned
by `Mike` alone (`CH6-b`) — the other five are `Ops` or `Mike + Ops`, which
`numbers-gate`'s exact-match on the owner cell does not count.

**RUN — no other published count moves.** A sweep for register counts elsewhere
in the tree returns only those two `BACKLOG.md` lines.

---

## 4 · THE §8 LEAD LINE

Filed, lead line only, no body:

> **A ROUND LOG'S `## OPEN` LIST READS LIKE A REGISTER AND IS NOT ONE: A ROW
> FILED THERE CAN NEVER BE CLOSED, BECAUSE THE LOG IS A SNAPSHOT (2026-08-30).**
> Six ids and 22 citations lived that way for eighteen days; one was already DONE
> the day before it was listed. `npm run desk`'s register check is
> one-directional, so nothing catches it. **File the row, cite the row.**

373 bytes. §0 for the arithmetic.

---

## 5 · DOES THE THREAD END? — NO. TWO MORE, AND ONE FALSE POSITIVE

**RUN** — every id cited in live code or canon as a *row*, diffed against all 202
anchors in both register files:

```
CH5-a  CH5-b  CH5-c  CH6-a  CH6-b  CH6-c     (this packet)
M40    N-c    V-B                            (not previously known)
```

**`M40` is a FALSE POSITIVE of my own method, and the method was mine to check.**
The sweep matched on `<a id="…">` anchors, and `M40` is properly recorded at
`docs/OPEN_ACTIONS_CLOSED.md:459` — *"CLOSED 2026-08-16 by THE REMOTE-CONTROL
ROUND"* — with a date and a reason. It simply carries no anchor, and the closed
register anchors only 45 of its rows. `src/data/artists/foundation.js:569`'s
citation resolves to a real, closed row. **Nothing is wrong with M40.**

**`N-c` and `V-B` are genuine, and they are the same class as the six.** RUN,
against the whole history:

```
git log --oneline -S "N-c" --all -- docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md   -> 0 commits
git log --oneline -S "V-B" --all -- docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md   -> 0 commits
```

Neither has ever been in either register, in any commit. Both are cited in live
code as register rows:

| id | citation | what it claims |
|---|---|---|
| `N-c` | `src/data/artists/robots-units.js:313` | *"it is register row `N-c` rather than a silence"* |
| `V-B` | `src/data/artists/worth-a-listen.js:1666` | *"Both are register row `V-B`: re-home the song copy, or strike…"* |

**They are reported and not filed.** Ops ruled on six; filing two more on my own
reading would be the same act that produced the problem — a row appearing
somewhere nobody ruled it should. **They need one sentence from Ops and they are
two rows.**

---

## 6 · THE §9 GATES

| # | gate | exit | note |
|---:|---|---:|---|
| 1 | `npm run lint` | 1 | **9 errors / 7 warnings — the baseline, zero new** |
| 2 | `npm run build` | **0** | |
| 3 | `npm run provenance:gate` | **0** | |
| 4 | `npm run reveal:check` | **0** | CHECK: PASS |
| 5 | `npm run parity:gate` | **0** | |
| 6 | `npm run instory:gate` | **0** | |
| 7 | `npm run docs:numbers:gate` | **0** | the gate that would have caught a forgotten `BACKLOG.md` |
| 8 | `npm run shellstop:gate` | **0** | |
| 9 | `npm run ops:size` | **0** | 38,684 / 40,000 |

**`day:proof`: 1 of 49, exit 1 — UNCHANGED, and the residual is the same one.**
RUN: `Record 005 REFUSED by guard 6 — it carries standing reasoning`. This packet
touches no file `day:proof` reads.

---

## 7 · EVERY COMMAND RUN

`npm run build:launch` writes only `dist/`, which is gitignored; the ordinary
build was restored after.

```
grep -rniE "open row|register row|row \`…\`" src/ reveal/ tools/ docs/canon/ CLAUDE.md docs/canonical/
grep -o '<a id="[a-z0-9-]*"' docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md    (202 anchors)
git log --oneline -S "<id>" --all -- docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md   (M40, N-c, V-B)
git show df33eca -- docs/OPEN_ACTIONS.md | grep -E "^[-+].*M40"
npm run build:launch  ·  grep -rlF "PORTAL CONNECTION ONLINE" dist/client/assets/
                          grep -rqF "Money in, out"          dist/client/assets/*.js
node -e "… ledger face.* rows by state"
grep -n "HELD_PATHS" vite.config.js  ·  sed -n '325,370p' vite.config.js
grep -rn "Founding Visitor" src/
node -e "… register rows / open / mike, before and after"
npm run ops:size    (before and after)
npm run lint build provenance:gate reveal:check parity:gate instory:gate docs:numbers:gate shellstop:gate day:proof
```

Everything else is READ, at the file and line named beside it.
