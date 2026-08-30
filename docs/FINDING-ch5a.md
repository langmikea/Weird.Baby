# FINDING — F10, the `CH5-a` citation

**Round:** F10, the dangling row id. **Written:** 2026-08-30.
**Scope:** READ ONLY. No register row was created. None of the citations was
edited. Nothing that publishes was changed.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.
**Raised in:** [`FINDING-robots-open-consumers.md`](FINDING-robots-open-consumers.md) §7, F10.

**Method notation.** **READ** — the tree states it, at a named file and line.
**RUN** — a command was executed and this is its output.

> **THREE THINGS, AND THE THIRD IS THE ONE THAT MATTERS.** `CH5-a` never existed
> as a register row — proved from history, not from the tree's silence. The
> citations disagree about whether it is an OPEN action or a CLOSED accepted
> limit. And **it is not one dangling id: the whole `CH5-*` / `CH6-*` family is
> six ids and 22 citations with zero register presence.** §6.

---

## 1 · THE CITATIONS — THERE ARE TEN, NOT FOUR

**F10 said four. It undercounted, and the count was mine.** RUN —
`grep -rn "CH5-a"` across `.md`, `.js`, `.jsx`, `.mjs`, `.html`, excluding
`node_modules`, `dist/` and this round's own reports:

| # | file : line | kind | what it claims `CH5-a` says |
|---:|---|---|---|
| 1 | `src/lib/record-clock.js:26` | **live code** | a *"KNOWN AND ACCEPTED LIMIT, NOT AN OVERSIGHT"*, Mike's ruling of 2026-08-12 — **and** that *"the entries move out of the bundle to a worker-served endpoint as their own packet. Until that lands…"* |
| 2 | `src/data/artists/robots.js:408` | **live code** | *"the entries are still compiled into the bundle, so this governs what the page DRAWS and is not concealment."* |
| 3 | `src/data/artists/foundation.js:1073` | **live code** | names it as the peer of `CH5-b` — *"Open row `CH5-b`, and it is the same follow-on as `CH5-a`."* |
| 4 | `reveal/ledger-declare.mjs:257` | **live code** | uses it as a settled statement of fact: *"the gate immediately said what CH5-a already says … the Record's entries are in a PUBLIC chunk."* |
| 5 | `docs/canon/09-PUBLISHED.md:29` | **canon** | *"a known and accepted limit, ruled 2026-08-12, and the entries move to a worker-served endpoint as their own packet."* |
| 6 | `docs/canon/09-PUBLISHED.html:101` | **canon, generated** | the same sentence, in the rendered twin |
| 7 | `docs/MUSEUM_LAUNCH_SURFACE_LOG-20260812.md:216` | round log | under a heading literally reading `## OPEN`: *"future entries still in the bundle; the endpoint move is its own packet."* |
| 8 | `docs/MUSEUM_HIDDEN_WING_LOG-20260812.md:117` | round log | *"the gate said what `CH5-a` already says: the Record's text is in a public chunk."* |
| 9 | `docs/MUSEUM_HIDDEN_WING_LOG-20260812.md:158` | round log | in a status list: *"future Record entries still in the public bundle (unchanged)."* |
| 10 | `docs/MUSEUM_COPY_AND_RECORD_LAYOUT_LOG-20260817.md:908` | round log | *"This is the documented, accepted limit `CH5-a`"* |

**Four are in live code or canon** (1-6, counting the canon pair as one claim in
two files). **Four are in dated round logs**, which are snapshots and are not
edited — the same class `docs:numbers` refuses to read `STATE.md` for.

---

## 2 · DID `CH5-a` EVER EXIST? — NO, AND HERE IS THE PROOF

**A grep of the tree cannot see a deleted row, so the tree was not asked.** RUN,
against the whole history:

```
git log --oneline -S "CH5-a" --all -- docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md
(no output)

git log --oneline -S 'id="ch5-a"' --all
(no output)
```

**The token has never appeared in either register file in any commit, and the
anchor `id="ch5-a"` has never been committed anywhere in the repository.**

**And the register files have been at those paths since before the id was
minted** — so the search was not looking at the wrong place. RUN:

```
git log --follow --diff-filter=AR -- docs/OPEN_ACTIONS.md
  b86258d  Museum v49: THE REGISTER ROUND …
git log --follow --diff-filter=AR -- docs/OPEN_ACTIONS_CLOSED.md
  52ee199  Museum C1-C2: THE CULL …
```

Both predate 2026-08-12.

### 2.1 · Where it came from instead

**RUN — every commit that changed the count of `CH5-a` anywhere in the tree:**

```
7ca59f4  docs: register row L-e, and the four ROBOTS_OPEN consumers measured   (this week's F10)
7139749  handoff: rewritten at the close of the Cowork retirement round
4323477  Record 004 attachments struck; held files ship and the worker refuses them
6a7ab9f  Records post at 17:00 America/New_York from 002 onward
d966f8b  The wing waits for 001, the lobby goes back to early
d15898a  The Record keeps time, the stage cannot slip, and two rooms close
```

**`d15898a`, 2026-08-12, is the origin.** It introduced the id in four places at
once — RUN, `git show d15898a | grep "^+.*CH5-a"`:

```
+- **`CH5-a`** — future entries still in the bundle; the endpoint move is its own packet.
+   Open row `CH5-b`, and it is the same follow-on as `CH5-a`. */
+             DRAWS and is not concealment. Open row `CH5-a`. */
+// future"*, never *"the future is not there"*. Open row `CH5-a`.
```

**And that same commit added ZERO lines to `docs/OPEN_ACTIONS.md`** — RUN,
`git show d15898a -- docs/OPEN_ACTIONS.md | grep -c "^+"` returns `0`.

**So `CH5-a` was minted as a citation and as a bullet in its own round log, in
one commit, and was never carried into the register.** The four live citations
say *"Open row"* about a row that has never been opened. What they actually
point at is line 216 of a dated round log — a snapshot that by §0's own rule is
never edited, so it can never be closed either.

---

## 3 · DO THE CITATIONS AGREE? — ON THE FACT, YES. ON WHAT KIND OF THING IT IS, NO

**They agree completely on the substance**, and it is worth saying so before the
disagreement: every one of the ten says that future Record entries are compiled
into a public chunk, and that the date filter governs what is DRAWN rather than
what is present. Not one contradicts another on the mechanism.

**They disagree on whether `CH5-a` is an ACTION or a NOTE**, and the split runs
straight through the live code:

| reading | citations | wording |
|---|---|---|
| **an OPEN action** — an endpoint move that has to happen | 1 (`record-clock.js`), 5-6 (canon), 7 (`LAUNCH_SURFACE_LOG`, under `## OPEN`) | *"the entries move out of the bundle to a worker-served endpoint as their own packet. **Until that lands**…"* |
| **a CLOSED, accepted limit** — a documented fact and nothing owed | 10 (`COPY_AND_RECORD_LAYOUT_LOG`) | *"This is the **documented, accepted limit** `CH5-a`"* — no pending work named |
| **neither — a bare fact to cite** | 2, 4, 8, 9 | *"what CH5-a already says"*, *"(unchanged)"* |
| **a peer of another id in the same state** | 3 (`foundation.js`) | *"Open row `CH5-b`, and it is the same follow-on as `CH5-a`"* |

**THE SHARPEST PAIR IS INSIDE ONE SENTENCE.** `src/lib/record-clock.js:22-26`
and `docs/canon/09-PUBLISHED.md:28-29` both call it *"a known and accepted
limit"* **and** promise the endpoint move in the same breath. Read as a
register row, that is a row that is simultaneously accepted and outstanding.
The register would have had to pick one; because there is no row, nothing ever
did.

**That is the finding for step 3.** The citations are consistent about the world
and inconsistent about the ledger.

---

## 4 · IS THE THING DONE, OPEN, OR NEVER REAL? — **OPEN**, MEASURED

Answered from the tree's behaviour, not from any citation.

**RUN — build the LAUNCH bundle and ask whether a future entry's own words are
in it:**

```
npm run build:launch                     exit 0

PORTAL CONNECTION ONLINE   PRESENT in the public chunk     (Record 005, dated 2026-09-11)
DATA RECOVERY              PRESENT in the public chunk     (Record 003, dated 2026-09-09)
INITIAL LAUNCH             PRESENT in the public chunk     (Record 001, dated 2026-09-07)
```

**The chunk is `dist/client/assets/index-DvhCLm18.js`, and it is at a PUBLIC
address** — RUN, it is under neither `/assets/held/` nor `/assets/locked/`, so
neither of the worker's directory doors refuses it. Record 005's headline is
fetchable today, eleven days before the day it belongs to, by anybody who reads
the JavaScript.

**And the fix the citations promise has not happened.** `/api/record` exists —
`src/worker.js:965` — and returns `today`, `tz`, `previewing`, `showingAll`,
`configured`, `note`, `maxAgeDays`, `realToday`, `driven`. READ. **No entries.**
It is the Record's *clock* endpoint, not the *entries* endpoint the citations
describe as *"a worker-served endpoint as their own packet."*

**So: the limit stands exactly as described on 2026-08-12, eighteen days ago,
and nothing has moved.** It is not DONE. It was a real item — the behaviour it
names is real, current and measurable. **It is OPEN, and it has never had a row.**

---

## 5 · NOT DONE, ON PURPOSE

**No register row was created.** The repair depends on §4's ruling — whether the
endpoint move is still wanted, or whether the limit is accepted and the four
live citations should stop saying *"Open row"* — and that ruling has not been
made. **None of the ten citations was edited**, including the two in live code
that carry the contradiction.

---

## 6 · IT IS NOT ONE DANGLING ID — IT IS SIX

**This is the part that outgrew F10.** RUN, the whole id family against both
register files:

```
id       register hits   tree citations
CH5-a          0               11
CH5-b          0                5
CH5-c          0                1
CH6-a          0                3
CH6-b          0                1
CH6-c          0                1
```

**Zero register presence for any of them; 22 citations between them.**
`git log -S "CH5-b" -- docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md` is also
empty — RUN — so `CH5-b` was never a row either, and `src/data/artists/foundation.js:1073`
and `src/data/artists/weird-baby.js:87` both call it one.

**The shape is one round's habit, not one typo.** `docs/MUSEUM_LAUNCH_SURFACE_LOG-20260812.md:214-218`
is a section headed `## OPEN` listing `CH5-a`, `CH5-b` and `CH5-c` as bullets;
`docs/MUSEUM_HIDDEN_WING_LOG-20260812.md:156-158` does the same for `CH6-b`,
`CH6-c` and `CH5-a`. **Both lists read exactly like a register and neither is
one.** Doctrine 14 says the register is maintained by every round; these ids were
maintained in the round's own log instead, where nothing can close them and
`npm run desk`'s register check — which proves every link points at a live row,
and nothing proves a row is reachable (§8, 2026-08-23) — never looks.

**Reported, not repaired.** Five more ids is five more instances of the same
ruling, and the ruling is the one §5 is waiting for.

---

## 7 · EVERY COMMAND RUN

Read-only throughout. `npm run build:launch` writes only `dist/`, which is
gitignored; the ordinary build was restored after.

```
grep -rn "CH5-a" --include=*.md --include=*.js --include=*.jsx --include=*.mjs --include=*.html .
grep -c "CH5-a" docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md
git log --oneline -S "CH5-a" --all -- docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md
git log --oneline -S 'id="ch5-a"' --all
git log --oneline -S "CH5-a" --all
git log --oneline -S "CH5-b" --all -- docs/OPEN_ACTIONS.md docs/OPEN_ACTIONS_CLOSED.md
git log --follow --diff-filter=AR -- docs/OPEN_ACTIONS.md
git log --follow --diff-filter=AR -- docs/OPEN_ACTIONS_CLOSED.md
git show d15898a --stat  ·  git show d15898a -- docs/OPEN_ACTIONS.md  ·  git show d15898a | grep "^+.*CH5-a"
npm run build:launch
grep -rlF "PORTAL CONNECTION ONLINE" dist/client/assets/
for id in CH5-a CH5-b CH5-c CH6-a CH6-b CH6-c … register hits vs tree citations
```

Everything else is READ, at the file and line named beside it.
