# THE LYRICS COME OFF THE GLASS
2026-08-12 · write packet · **not committed, not pushed, not deployed**
HEAD at start: `6897b5c`, plus the uncommitted lobby + mothball packet.

**MIKE'S RULING:** *delete it. The vault's own rule 5 — "NO LYRICS, EVER — not
ours to reprint." It is public on /wal now.*

---

## A1 — THE FACT, ON THE RECORD, THEN GONE

**`MV-HR-20260707-056`**, `src/data/exhibits/hunter_root.facts.json`, live on
`/wal` and served to `/hr`. Both lines, verbatim, so the removal is on the
record and the text exists exactly once more, here:

> Back in 1994 / Glad I woke up but I didn't wake up too sure / Back in 1993 /
> The devil made his way inside a kid and then he never broke free…
> — "'94", Hunter Root, 2025

Tags: `band:hunter_root · exhibit:hunter_root · song:94 · source:press ·
speaker:hunter_root`.

**Deleted whole.** The fact *was* the lyric — there is no fact underneath it to
keep. Vault **97 → 96**.

---

## A2 — THE SWEEP, AND IT FOUND TWO MORE

### Method, stated because the result depends on it

Two passes over **3,486 strings** — everything `sweep()` in
`tools/provenance-sweep.mjs` treats as visitor-facing (so the same boundary the
provenance gate uses), **plus** the three stores the boundary bulk-declares and
therefore does not itemise: `hunter_root.facts.json` (97 facts),
`hunter_root.json` (49 artifacts, title + description), `worth-a-listen-facts.js`
(311), `hr_facts.js` (51, retired).

**Pass 1 — four named detectors**, each reporting *why* it fired so a false
positive is dismissed on the reason rather than on a score:

- **ATTRIBUTED TO A SONG** — a breadcrumb whose speaker is a track title. The
  strongest signal: a quote credited to a song is by definition out of it.
- **VERSE LINE BREAKS** — two or more ` / ` separators.
- **QUOTE CREDITED TO A TRACK AND ARTIST**.
- **WEAK: long first-person run with no interview marker** — reported for human
  eyes, never treated as proof.

**Pass 2 — the shape a lyric hides in when nobody cites it:** every quoted run
of six or more words whose string names no person, outlet or date anywhere.
**41 hits, all 41 read.**

### THE FINDINGS — three lyric strings in three records

| # | id | where | what |
|---|---|---|---|
| 1 | `MV-HR-20260707-056` | vault fact | the '94 verse above |
| 2 | **`MV-HR-20260405-012`** | artifact | title **and** description |
| 3 | **`MV-HR-20260405-013`** | artifact | description |

**2 and 3 carry the same line**, and it is the second lyric in the building:

> "Dreaming up ways of gettin' outta this hellhole, shift your perspective, turn
> it all to rubble"

**`MV-HR-20260405-012` is deleted whole.** Its title was
`"Dreaming up ways of gettin' outta this hellhole" — Hunter Root lyric or quote post`
and its description was the longer line. **Strip the lyric and nothing remains** —
the record would have been a card saying a lyric post existed and showing
nothing. Artifacts **49 → 48**.

**`MV-HR-20260405-013` KEPT, its description removed.** That artifact is
*"Hunter Root tribute post for his brother Nick Root, who passed away at age
27"* — a real item with its own good title, and the lyric description looks like
a **cataloguing error**: it is byte-identical to 012's, on a different Facebook
post. `HrExhibitFlow.jsx:2401` reads `card.description || card.title`, so the
card now captions itself with its own title. **Checked before cutting, not
after.**

**Both deletion shapes are reversible and are named here so Mike can reverse
either.**

### VERIFIED AFTER

- `grep` for either lyric across **all of `src/` and `index.html`** — **nothing**.
- The sweep re-run: 3,479 strings, **5 flags, all WEAK false positives already
  read** (a caption about a live recording, Hunter discussing a song, and two
  interview quotes).
- `grep` across **`dist/`** after a rebuild — **nothing**.

### WHAT PASS 2 FLAGGED AND WHY IT IS NOT A LYRIC

All 41: song **titles** in quotes (`"Have You Ever Seen the Rain"`,
`"Yasmin You Will Never Hear This"`), **spoken** quotes (`"You got this, you're
going to do something special."`), **video** titles (`"Rick Rubin told me
something I'll never forget"`), and **review** lines. Not one is verse.

### FIVE COPIES SURVIVE OFF THE GLASS — REPORTED, NOT DELETED

| file | what it is |
|---|---|
| **`tools/press_batch_stage3_facts.json`** | **the one to look at.** Read by nothing — a dead staging input from the July press batch. It still holds 056. |
| `docs/PRESS_BATCH_STAGE3_CANDIDATES-20260707.md` | the candidate list 056 arrived on |
| `docs/PRESS_INGESTION_SCOPING_FINDINGS-20260616.md` | an audit that **correctly called 012 a lyric-quote post** |
| `docs/derived-era-WIP/hunter_root.dated-preview.json` | a WIP derived copy of the export |
| `docs/archive/facet-model-compare-955fc99.md` | one row of an archived table |

Four are audit history and rewriting them destroys the record of how this
happened. **`tools/press_batch_stage3_facts.json` is different** — it is not
history, it is a loaded input, and a future round re-running that batch
reintroduces the lyric. **Mike's call.**

---

## A3 — HOW IT PASSED. NO GATE COVERS IT, AND FOUR THINGS LINED UP

**1. The provenance gate cannot catch this, by construction.** It asks *is this
string declared?* — 056 was declared, class `press`, and a **declared** lyric
passes. `provenance/README.md` §4 already says the gate cannot verify a
declaration is TRUE. This is the neighbouring hole: **it cannot verify a
declared string is PERMITTED.** Origin is not permission.

**2. Nobody ever reviewed that string in a diff.** Both files are in the sweep's
`GENERATED` set and are **bulk-declared at file level** — deliberately, so that
1,900 rows do not re-hash on every export. The claim under review is the
pipeline. **The consequence is that no individual imported string has ever met a
human reviewer**, and 056 came in through that door.

**3. Rule 5 and the violation are in the same file and never met.** The rule is
a comment in `worth-a-listen-facts.js` — an authoring rule for facts authored
*there*. Forty lines below it that same file says *"Hunter Root's facts are NOT
re-researched here… they are imported and re-tagged"*. **The 97 vault facts were
explicitly exempted from the pass that would have applied the rule.** The rule
was written by the round that imported the thing it forbids.

**4. And the export told us.** `MV-HR-20260405-012`'s own title, written by
MediaVault's cataloguer, contains the words **"lyric or quote post"** — and
`docs/PRESS_INGESTION_SCOPING_FINDINGS-20260616.md` wrote it down again in June:
*"a 2023 Facebook lyric-quote post"*. **The museum labelled it, filed the label,
and shipped it anyway.** Nothing read the label back.

---

## A4 — CAN A GATE BE BUILT? YES, MOSTLY. HERE IS WHAT IT WOULD AND WOULD NOT SEE.

**Not built. Scoped only.**

### What is cheap and near-certain

| detector | false-positive risk |
|---|---|
| Breadcrumb attributing a quote to a **song title** (`— "'94", Hunter Root, 2025`) | ~zero. The title list derives from the spine and the vault's own `song:` tags — no new declaration to keep in step. |
| **Two or more ` / `** separators in one string | very low. One legitimate case exists (`"Whistle Boeing / Come As You Are"`, a single slash) and the threshold of two clears it. |
| Any `title`/`description` whose **own text contains "lyric"** | zero. This alone would have caught `MV-HR-20260405-012` in June. |

### The main cost, and it is the only real one

**Quoted song TITLES are the false-positive engine.** `"Have You Ever Seen the
Rain"` and a quoted lyric are the same shape to a machine. It needs a small
allowlist — the same pattern `instory-specs.mjs` already uses for its allowed
strings, so there is a precedent to copy rather than a design to invent.

### What NO gate can see, stated plainly

**A lyric with no citation, no slashes and no marker is undetectable.** There is
no computable difference between a line of verse and a line of prose. A gate
would have caught **all three** of tonight's, because all three carried a
marker — but it cannot promise a fourth.

### Cost

**About one packet.** A sibling of `menu-parity.mjs` and `instory-specs.mjs`:
reads the same file set the provenance sweep already walks, three detectors, one
allowlist file, `npm run lyrics:gate` beside the others. **Its own limits go in
its header**, the way `provenance/README.md` §4 carries the hole-list — a gate
that does not say what it cannot see teaches people to trust it too far.

---

## A5 — PROVENANCE: NOTHING STALED, AND THAT IS THE FINDING

`npm run provenance` after the deletions: **stale register rows 0 · UNDECLARED 0
· GATE PASS.**

**No prune was needed and no inbound `r:` chain was at risk**, because neither
deleted string had a register row of its own to stale — both files are
bulk-declared as `generated`. Checked rather than assumed: `grep` for both ids
across `provenance/register.json` and `provenance/asset-table.json` returns
**nothing**.

**That is the same fact as A3.2 seen from the other side.** A deletion that
stales no row is a deletion of a string the register never itemised — which is
exactly why nobody caught it going in.

---

## A6 — GATES

| gate | result |
|---|---|
| lint | **11 errors / 9 warnings — baseline** |
| build | green |
| launch build | green |
| provenance:gate | **PASS** — 0 undeclared, 0 stale |
| reveal:check | PASS |
| parity:gate | PASS — 4 shared, 0 divergences |
| instory:gate | PASS |
| assets:orphans | 0 rows |
| reveal:day | nothing to move |

---

## THE ONE THING THAT MAKES THIS UNDONE — READ IT

**Both files I edited are REGENERATED from MediaVault.**
`npm run export-artifacts` overwrites `src/data/exhibits/hunter_root.json` and
`hunter_root.facts.json` from MV's current released set. **The next export
brings all three lyrics back**, silently, and the release flow in `CLAUDE.md`
puts that command at step 2 of every publish.

**The durable fix is in MediaVault**, not here:

- unrelease or archive fact `MV-HR-20260707-056`
- unrelease or archive artifact `MV-HR-20260405-012`
- clear the description on artifact `MV-HR-20260405-013`

I cannot reach MV — it runs on the operator's machine and was not running, and
the packet did not authorise changes to it.

**Until MV is fixed, do not run `npm run export-artifacts` without re-checking
for these three.** This is the strongest argument for A4's gate: a gate would
catch the regression the moment the export reintroduced it.
