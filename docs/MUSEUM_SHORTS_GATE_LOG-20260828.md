# THE SHORTS GATE — closing the leak between a recipe and a platform

**2026-08-28.** HEAD at start `ad0d73d`. Nothing committed by Code; Mike commits.

---

## 1. THE BRIEF NAMED THE WRONG FILE, AND THE CORRECTION IS THE FINDING

The instruction was:

> *"`tools/shorts.mjs` reads the asset table directly with no held check, no
> ruled-out check, no burp check. All three exist in `shelf.mjs` one file away."*

**`tools/shorts.mjs` does not read the asset table at all.** Measured:

```
$ grep -n "asset-table\|buildShelf" tools/shorts.mjs
19:   `buildShelf()` in tools/dictation/shelf.mjs — the SAME function the artifact
51:import { buildShelf, SECTIONS } from "./dictation/shelf.mjs";
81:const { rows, drop } = buildShelf();
```

It has carried the ruled-out bar and the never-published bar **since the day
each was written**, because it inherits both from `buildShelf()`. Giving it
"the same three protections" would have added a second copy of a filter it
already runs — which is the exact failure `shelf.mjs`'s own header exists to
prevent: *"A second tool that re-derived the shelf would be a parallel list on
the day it was written."*

**The three files that DO open `provenance/asset-table.json`:**

```
tools/shorts-compile.mjs      ← THE LEAK. Resolves a uid, reads the file, encodes it.
tools/shorts-verify.mjs       ← the quieter half. Resolves a uid and decodes the file.
tools/dictation/shelf.mjs     ← the one that was already doing it correctly.
```

**The leak was one file over, and the diagnosis was right about everything
except the address.** `sourceFor()` in the compiler was:

```js
const row = TABLE.find(r => r.uid === asset.uid);
const file = path.join(ROOT[row.repo] || REPO, row.path);
```

No question asked of the row. And a recipe is not required to have come from
the bench — `--recipe <path>` takes a file from anywhere — so *"the bench
already filtered it"* was never a property of the compiler's input, only a
habit of where its input came from.

### The count was also not six

The brief said *"the six ruled-out photographs."* Measured:

```
dropped by RULED_OUT: 3
    public/held/robots/reference/photos/MGK-TWIN_MONITOR_CLOSE_UP_MARKERS.png
    public/held/robots/reference/photos/monitor_base_markers.png
    public/robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png
dropped by signage : 1
    public/robots/art/wbr-cover-logo.png
```

**Three basenames, three rows, plus one signage row** — `drop.ruled` is 4 and
folds signage in. *"The six photographs"* is a different and unrelated thing:
OPERATIONS §8's RULING A of 2026-08-25, *"the six photographs stand"* — six
that are **published**, not six that are barred. Recorded because the two
readings are one word apart and point opposite ways.

---

## 2. WHAT WAS BUILT

### `tools/dictation/shelf.mjs` — the bars, exposed per row

`buildShelf()` answers *what may Mike pick from*, for the whole table at once.
**Nothing could ask about one asset**, which is why no downstream tool asked.
Added:

- **`ruledOut(path)`** — the RULED_OUT reason for a path's **basename**, or
  null. Keyed on basename deliberately: §8's *a governed picture has two
  addresses*, and a path test lets a ruled-out picture back in through its
  other one.
- **`publishRefusal(row)`** — the two hard bars asked about one row. Returns
  null, or `{ bar, reason, citation? }`.

**Held is deliberately not one of them**, and that is the load-bearing part:
six of the eight SECTIONS match `public/held/robots/…` only, the shelf is 132
held rows of 138, and the manual **is** the ingredients. A held bar here would
empty the bench and refuse every recipe in the tree.

`buildShelf()` now calls the same primitives instead of inlining the checks, so
*"the compiler asks the same question as the bench"* is provable. **The order is
copied rather than chosen** — ruled-out before never-published — so a row that
ever matched both could not change `drop` bucket by this refactor.

**Proved identical across the move**, the same way `shelf.mjs` itself was
proved when it was extracted from `assign.mjs`:

```
BEFORE  138 rows  {"ruled":4,"neverPublished":3,"absent":8,"superseded":136,"elsewhere":76}
        sha256 a72dc5eb63e31b75e3395ff63bde7d92
AFTER   138 rows  {"ruled":4,"neverPublished":3,"absent":8,"superseded":136,"elsewhere":76}
        sha256 a72dc5eb63e31b75e3395ff63bde7d92
```

### `tools/shorts-gate.mjs` — NEW, and it is its own module for `shorts-pad.mjs`'s reason

> *"the pad rule is its own module so the compiler and the verifier cannot
> answer the question differently."*

Same argument, higher stakes: two implementations of *may this be published* is
two answers on the day one is edited. **The gate declares no rules.** The
judgement is `shelf.mjs`'s; this file walks a recipe and asks it.

Three outcomes, and they are not three grades of one thing:

| | |
|---|---|
| **`refusals`** | **The two hard bars.** No flag, no environment variable, no argument gets past them, and there must never be one — a bar with a documented way around it is a bar that gets walked around on a deadline. |
| **`held`** | **A declaration, not a bar.** Refuses by default, names every held asset and its address, proceeds on an explicit `--held-is-intended`. The shape `export-artifacts.mjs` already uses in this repo. **The point is that nobody compiles held material by accident; not that they may not compile it.** |
| **`missing`** | A uid the table does not hold — reported here in one list rather than thrown from the decoder one at a time. |

**It judges the whole recipe, not the first bad block.** A compiler that throws
on block 3 makes Mike run it five times to find five problems.

### The two callers

- **`shorts-compile.mjs`** — the gate runs before the first `sharp()`, before
  `fs.mkdirSync`, before ffmpeg is spawned.
- **`shorts-verify.mjs`** — same gate, same flag, placed **above the ffprobe
  block**. Nothing barred was ever opened with it lower down (ffprobe reads the
  `--mp4` argument, not the source), but a refusal printed under eight lines of
  healthy-looking report reads like a footnote.

**And one real defect was fixed on the way.** `shorts-verify.mjs` built its
path as `join(REPO, row.path)` while the compiler builds it as
`join(ROOT[row.repo], row.path)` — so a robots-repo asset resolved to a
museum-repo address and the two tools disagreed about which file they were
measuring. No recipe in the tree names one, which is why it never fired. It is
corrected rather than left as a trap.

---

## 3. EACH BAR PROVED BY TRIPPING IT

| # | trip | result | exit |
|---|---|---|---|
| 1 | recipe names `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` | **REFUSED — RULED OUT**, with Mike's 2026-08-13 reason printed | 1 |
| 2 | recipe names `IMG_9766.wav` | **REFUSED — NEVER PUBLISHED**, with ruling 2026-08-03(a) and its citation | 1 |
| 3 | the real `teaser-30s` | **STOPPED — 19 of 27 blocks are HELD**, every one named with its address | 1 |
| 4 | trips 1+2 **with `--held-is-intended`** | **REFUSED anyway**, and reports **both** offending blocks | 1 |
| 5 | recipe names a uid not in the table | **REFUSED — uid not held**, points at `assets:scan` | 1 |
| 6 | one held manual page **with the flag** | **HELD 1 of 1, compiled on --held-is-intended**, then rendered | 0 |
| 7 | `npm run shorts:flashbang` | **RENDERED**, unchanged | 0 |
| 8 | `npm run shorts:verify` | **PASS**, curve intact | 0 |
| 9 | verify against trip 4's recipe | **REFUSED**, refusal now leads the output | 1 |
| 10 | verify against `teaser.json` | **STOPPED on held** | 1 |

**Trip 3 caught exactly the file this round exists because of** —
`docs/shorts/out/teaser-30s.mp4`, 20.6 MB, which has been sitting compiled and
uploadable since 2026-08-13 carrying five held 1965 manual pages and the held
MGK-VIIIp cover. Nothing had ever said so.

### The working path is byte-for-byte unchanged

```
flashbang.mp4 BEFORE (2026-08-25, pre-gate)
  763eb4a3d79f6d40bf36958f219e67f275b9b539cf47cdb32ea0e9b27e3567ea   529,225 B
flashbang.mp4 AFTER  (2026-08-28, through the gate)
  763eb4a3d79f6d40bf36958f219e67f275b9b539cf47cdb32ea0e9b27e3567ea   517 KB
  DETERMINISM   second render sha256 763eb4a3…  IDENTICAL
```

**The gate changes what is refused and nothing about what is rendered.** The
determinism contract survives it, proved across three renders on two dates.

---

## 4. WHAT THIS DOES NOT DO — SAID PLAINLY

- **It does not enforce the obfuscation law.** Articles 1–5 govern *"every
  image, clip, still, plate, thumbnail, poster, share card and preview the
  museum publishes of a physical MGK unit"*, and **no mechanical check for them
  exists anywhere in either repository** — every hit for `obfuscat`,
  `silhouette` or `article [1-5]` across `reveal/`, `provenance/` and `tools/`
  is prose in a comment. A recipe naming a public wide shot of the unit
  compiles today exactly as it did yesterday. **This gate is about the two
  lists that exist; the law is still human discipline.**
- **It does not stop an upload.** `docs/shorts/out/` is gitignored, nothing
  serves it, and the only thing between a compiled MP4 and YouTube is a person.
  The gate stops a barred file being *made*; it cannot stop one being *sent*.
- **It does not check media kind.** A recipe naming a non-image that is not in
  the never-published class would still fail inside `sharp` with a decoder
  error rather than a refusal. The burp WAVs are caught by path before they get
  there; nothing else in the table is at that risk today.

---

## 5. GATES

```
lint                  9 errors / 7 warnings — BASELINE, zero new
build                 green (1.50s)
provenance:gate       PASS
reveal:check          PASS
parity:gate           PASS — 4 shared, 0 divergences
instory:gate          PASS — 0 findings
docs:numbers:gate     PASS — 11 claims in 8 documents
reveal:day            nothing to move
shelf identity        138 rows, drop unchanged, sha256 unchanged
```

Nothing in `src/` changed. No visible string, no ledger row, no asset row, no
register row. `docs/shorts/out/` was rewritten by trips 6 and 7 and is
gitignored; the one scratch render made by trip 6 was deleted.

---

## 6. FOR THE COMMIT

```
tools/dictation/shelf.mjs      M   ruledOut() + publishRefusal(); buildShelf calls them
tools/shorts-compile.mjs       M   the gate, before the first decode
tools/shorts-verify.mjs        M   the same gate; row.repo honoured
tools/shorts-gate.mjs          ??  new
docs/MUSEUM_SHORTS_GATE_LOG-20260828.md   ??  this file
```

`docs/DEPLOYED.md` is also untracked and is not this round's — it is the deploy
record, written after the 2026-08-28 upload and never committed.

---

## 7. WHAT ACTUALLY LANDED — `6307286`, AND THE DEPLOY RECORD RODE WITH IT

**[2026-08-28, written after the commit.]** This section exists because §6 above
predicted two commits and one happened.

**`docs/DEPLOYED.md` WENT INTO `6307286`.** The runbook's step 15 says
otherwise, in the imperative: *"Do not batch it with anything. One file, one
commit, now,"* with its RIGHT condition being *"`docs/DEPLOYED.md` was the only
file listed."* **That condition was not met.** It stands as committed —
rewriting published history for a file placement is worse than the placement,
the same reading CLAUDE.md already applied to the trailer at `73179dc`.

**AND THE COMMIT MESSAGE DOES NOT ACCOUNT FOR IT.** `6307286`'s message is
entirely about the shorts gate and contains no occurrence of *deploy record* or
*DEPLOYED.md*; it even states *"nothing under `src/` changed"* while carrying a
32-line file whose subject is a deployment. **So the one commit in this
repository's history that finally lands the deploy record is the one commit
nobody searching for it would open.** Written here because that is what a
breadcrumb is for, and because §8's own lesson is that a search of HEAD is blind
to exactly this.

**THE FACT WORTH CARRYING FORWARD:** the deploy record for `ad0d73d` — launch,
`2026-08-28T14:03:16.142Z`, worker sha256 `ddd735e8d99d0f0b` — **first entered
git history at `6307286`**, batched, on the fourth deploy since the tool that
writes it landed on 2026-08-24.

**THE RUNBOOK IS NOW STALE IN ONE CLAUSE AND IS NOT EDITED HERE.**
`docs/THURSDAY-20260827.md` says *"`docs/DEPLOYED.md` has never existed in git
history"* and *"THE ONE THAT HAS NEVER ONCE BEEN DONE."* Both were true when
written and the first is now false. **Flagged, not fixed** — the runbook is a
dated document and OPERATIONS §8 already carries the row saying a dated
runbook's values are prose that goes stale; whoever runs it next reads this
line first.
