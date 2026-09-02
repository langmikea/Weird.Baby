# BOTH MACHINES DOWN + THE LOOSE THREADS — 2026-08-17

Opened on HEAD `e91023f`, with /robots live and both units reachable.

---

## JOB 1 — MGK-NIAC AND MGK-VIIIp ARE DOWN

### HIS ROOT CAUSE WAS EXACTLY RIGHT

**"neither unit was ever held on its own condition. They were invisible only
because the wing was hidden. A hold that depends on another thing's hold is not
a hold."** `/robots` was shut by `ROBOTS_OPEN`, derived from the Record having
an entry. Record 001 posted at 00:00, the wing opened, and both machines walked
through the door with it.

### THE FILTER WAS THE FIRST CUT AND THE LEDGER REFUSED IT

Built exactly as briefed — `HELD_ALBUMS` in `robots.js`, the shape The Blog and
/wb's FAQ carry, not `HIDDEN_AT_LAUNCH`. Then `reveal:build`, and **the
declaration came back INVALID with the same sentence on nine rows at once:**

```
built, HELD, and carried by `src/data/artists/robots.js` — which is NOT in
`HELD_PATHS` (vite.config.js), so its code and every string in it ship in a
chunk the public fetches. A boolean in a public module stops the render and
publishes the material anyway.
```

**THE TWO HALVES OF HIS OWN INSTRUCTION COULD NOT BOTH BE MET BY A FILTER.** He
named the shape *and* he named the arbiter — *"a hiding ruling is not done until
a ledger row moves"* — and the row could not move while the material sat in a
public module. The ledger is the arbiter, so the material moved.

### WHAT WAS DONE INSTEAD: THE PORTAL'S ARRANGEMENT

`src/data/artists/robots-units.js` — both album objects, **byte-for-byte as they
stood in the public spine**, plus `FAQ_BUY_ONE`, which both machines' FAQs read
and nothing else in the wing did. `vite.config.js` parks the file under
`assets/held/`; `src/worker.js` refuses that directory without the cookie.

**IT WAS A CLEAN CUT BECAUSE IT WAS MEASURED FIRST.** The two albums reference
**exactly one** module-level name from `robots.js` (`FAQ_BUY_ONE`); everything
else they use is an import they can make themselves. That measurement is why a
977-line move at speed was safe.

**IT DIFFERS FROM THE PORTAL IN ONE WAY, DELIBERATELY: nothing imports it.** The
Portal is spliced back for Mike at `/admin` because he asked to keep developing
it. These are **held from Mike too** — his words — so there is no door and no
splice. Parked behind the right one anyway, so the day either is wired back for
development it is already in the correct place.

**THE PORTAL IS NOT DISTURBED and still lands second:** `PORTAL_AT` is 1 and the
splice clamps to the spine's length, which is now 1.

### THE LEDGER ROWS THAT WERE MISSING

**His diagnosis of the diagnosis was right too:** this table had seven faces for
the two machines and **no row for either machine.** Nothing said what an
MGK-NIAC or an MGK-VIIIp *was* in reveal terms, so nothing could say it was
held.

- **`album.niac`** and **`album.viiip`** — new, `LIVE / HELD`, carried by the
  held module.
- **Seven faces move REVEALED → HELD.** They read `reach: "a track on /robots"`
  and that sentence is now false — there is no track to be a track of.
- **Transfer class: BLAST**, not an exemption. The ten faces above them are
  already BLAST and they are faces OF these two machines; filing the machines
  elsewhere would say the units arrived by one route and their own plates and
  specifications by another. **Being held does not change the class** —
  `route.hr` and `route.admin` are HELD and BLAST four lines up.

### A GATE WAS WRONG AND IT IS THE FIFTH INSTRUMENT TO BE WRONG THE SAME WAY

Rule 2 of `reachability.mjs` then reported **seven photographs "served at a
public address"**. **Not one of them exists at a public address** — checked file
by file: all seven are under `public/held/robots/…` and have been since the
pull-back.

**§8's hazard row predicts this exactly: a governed picture has two addresses,
and anything that matches on one of them is wrong.** The data declares the
PUBLIC address and nothing else — that is the pull-back's design — and four
instruments broke on it in one round in August and were given `STAGE_PREFIX`.
This check is the fifth. **The test is the disk now, not the spelling:** a
governed reference is a leak when a file actually sits at its public address,
and is the pull-back working when the file sits behind the door instead. An
ungoverned reference is judged exactly as before. 25 faults → 2 → 0.

### VERIFIED ON THE BUILT LAUNCH BUNDLE, WHICH IS WHAT HE ASKED FOR

```
/robots            ONE album — "Weird.Baby Robots"
carousel arrows    pointer-events: none, opacity 0.15 — inert
page text          no "MGK", no "NIAC", no "VIIIp" anywhere
/robots/mgk-viiip  lands on the Lobby; no MGK on the page
/robots/mgk-viii   the same
tracks             The Record · FAQ
```

**AND THE STRINGS ARE GONE FROM BOTH BUNDLES, WHICH THE FILTER WOULD NOT HAVE
DONE.** `MGK-NIAC` **0 chunks** · `mgk-viiip` **0** · `TEST BENCH` **0**, in the
LAUNCH build *and* in the DEVELOPMENT build. No units chunk is emitted at all,
because nothing imports it. The hold does not depend on the stage — which is the
whole of what he asked for.

The one surviving `MGK-VIIIp` in the bundle is **Record 001's own addendum**, a
manifest of filenames inside a Record entry. That is the Record talking about
the machine, which is public and is meant to be.

### THE MOVE'S OWN WAKE, ALL OF IT MEASURED AND CLOSED

A 977-line file move breaks anything that reads that file by path:

| what broke | why | closed by |
|---|---|---|
| **provenance, 78 undeclared + 50 stale** | the register keys on `hash(file + text)`, so every moved string changed key | **55 rows re-keyed onto the new file, carrying their class and source** — not re-declared, which would have lost both |
| **6 RESTATED chains** | they pointed at parent keys that were themselves re-keyed | repointed by matching the parent's text |
| **`npm run parity` crashed** | it parses `robots.js` for the two albums by id | repointed at the held module. **It still runs on purpose:** parity is worth keeping true while they are held, so the day one comes back the check has been running all along |
| **`docs:numbers` FAIL** | the ledger went 168 → 170 rows, published twice on one line of OPERATIONS.md | both claims corrected |
| **2 lint errors** | `placedPresets` and `placedTiles` became unused imports | they left with the machines |

**FIVE ROWS WERE MOVED WRONGLY AND WERE PUT BACK.** The first re-key pass tested
`text in file`, which fails for strings the source builds with `+` across lines
— so five of the wing's own FAQ strings were carried out of `robots.js` with the
machines. They were restored from HEAD **with their original classes** (two
RESTATED, three MIKE) rather than re-declared. Caught because the gate then
reported them undeclared in a file they were not in.

---

## JOB 2 — LOOSE THREADS

`npm run desk` → `docs/THREADS.html`, a card on the desk, **the same renderer as
BACKLOG**. His words: *"no new machine"* — so the backlog's bespoke render block
became a two-entry `SIDE_PAGES` loop rather than gaining a copy. The register
keeps its own block; it is the source these pages point AT.

The four rules are on the page in his terms: **canon the moment it is written
down · Ops never rewrites a thread · WOVEN keeps it on the page, because a later
Record must not contradict it · a LOOSE thread is not a task.**

### TWO THREADS, AND THE SECOND CAME OUT OF THE SEARCH

**THREAD-001**, tonight's, verbatim: *"The guys worked the whole weekend and
knocked off just after midnight after the server clicked over and the incoming
server got quiet."*

**THREAD-002**: *"THE WEEKEND THAT WASN'T SUPPOSED TO HAPPEN"* — **week one's own
headline, in his words**, written 2026-08-07 as `ARC.W1` and `W1.SUM`. Week one
has since been written — Records 001 to 005 — and **the headline landed in none
of them**: measured against `reveal/record-entries.mjs`, no entry contains the
phrase. It is on two Ops instruments and nowhere a visitor can read.

**It qualifies where the rest of the arc does not** because the week it names is
already on the glass. The other eleven weeks are plans for weeks that have not
happened.

### WHAT THE SEARCH FOUND, AND WHAT IT REFUSED

Searched every round log, the handoffs, the dictation instruments and their
rescued browser stores, the magnet pile, `answers.json` and `robots-record.js`.
**Two threads, and only two.**

- **The logs are almost entirely PROCESS.** Every `MIKE: "…"` in them is a
  ruling about the museum — hide this, capitalise that. A ruling is not a fact
  in the story.
- **The magnet pile holds no text at all** — two tiles, position and id only.
- **Eleven of the thirteen answered worksheet slots are already in Records 001
  to 005 character for character**, which is what makes the twelfth worth
  noticing.

**Nothing was inferred and nothing was reworded.** A sentence that had to be
interpreted to become a thread is not a thread.

---

## GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline** |
| `npm run build` | green |
| `npm run build:launch` | green — 144 files, 190.0 MB held out |
| `npm run provenance:gate` | **PASS** — 0 undeclared, 0 stale, 0 broken chains |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers:gate` | **PASS** — 10 claims in 4 documents |
| `npm run reveal:day` | nothing to move |
| `npm run desk` | **13 instruments, 13 on disk** · every side-page link resolves |

**JOB 1 NEEDS A DEPLOY AND MIKE RUNS IT.** Nothing was committed, pushed or
deployed; `dist/` is in the development stage and no dev server is listening.
