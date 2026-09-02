# JOB 5 — A SHAPE FOR THE ASSETS

**Read-only. Nothing was created, modified, moved, renamed or deleted in any source folder
or in either git repo. No repo script was executed. The only file written by this job is this
one. No file, in any tree, was proposed for `public/` or for any repo.**

This is a **proposal**. No code was written, no schema file was created, no migration script
exists. The field sketches below are illustrative prose, not deliverables.

Date: 2026-08-10 · Inputs: JOB1 · JOB2 · JOB3 · JOB4 · JOB6 · the orchestrator's groundwork ·
`provenance/asset-table.json` · `provenance/assets.json` · `tools/asset-table.mjs` ·
`reveal/ledger.json` · `docs/CANONICAL_VOCABULARY.md` · `docs/kind-governance-spec.md` ·
`weird-baby-robots/docs/canonical/OBFUSCATION_LAW.md` · `LINEAGE.md` · the four NIAC READMEs.

---

## LEAD — WHAT NEEDS MIKE (short form)

Nine rulings. The first four block the shape; the other five block a value in it.

1. **Ratify or refuse the shape below.** Five new fields on the asset table, one registry
   file, no storage move. Nothing else in this report can start without that word.
2. **`unit:` needs its member list.** I can prove four unit tokens exist in the tree
   (`MGK-VIIIp`, `MGK-NIAC`, `MGK-PHVDC`, `MGK-TWIN`) and I cannot tell you whether
   `MGK-TWIN` is a separate machine or a part of one you already have. Ops will not guess
   which of those is a machine.
3. **`The Everyman` vs `The Everyday`, and whether the 15 model names are a taxonomy or a
   brainstorm** (Job 3 Q-1/Q-2). Until you rule, `model:` does not open as a namespace and
   the 15 names go in nothing.
4. **Does the asset table widen past the two repos?** My recommendation is yes, selectively.
   It is a change to the table's own declared scope — *"every image, video and audio file in
   both repos"* — so it is yours, not Ops'.
5. **Naming real people in a data file.** The consent bar needs a `person:` value. Writing
   `person:carter-bookman` into a committed JSON is a decision about a named third party and
   I am not making it.
6. **There is no consent law to cite.** `OBFUSCATION_LAW.md` covers a photographic portrait
   appearing *inside a published asset of a machine*. It says nothing about 24 documentary
   photographs *of a person*, which is what Job 2 found. A bar with no law behind it is a
   note, not a bar.
7. **The nude-illustration brand call is still open** (`README_v3.txt`, verbatim in Job 1
   #5). It is the only `unruled` bar I would write on day one, and it stays unruled until you
   answer it.
8. **`mgk-niac-cover.psd` is a day NEWER than `NEW Robots.png`.** The first master/derivative
   link anyone would want to declare is the one whose dates run backwards. Which is current?
9. **Nobody may flatten `Weird.Baby Photos\`.** The seven expressions exist as folder names
   and in no byte of any file, in either tree. Until the tagging exists they are one `mv`
   from gone. This is not a request for a ruling; it is the one thing that can be destroyed
   by accident before you rule on anything.

## LEAD — WHAT I COULD NOT DETERMINE (short form)

- **Whether any master/derivative link in this tree is machine-provable.** The brief said the
  NIAC cover is pixel-identical to its PSD. I could not confirm that and the evidence points
  the other way (Job 1: MEDIUM confidence, dates reversed; Job 3: the museum's PNG matches
  nothing in GRAPHICS by hash). See item 2 — it changes who declares a link.
- **The `part:` value list.** I can see component words in layer names and in `what` prose;
  I cannot tell which are the machine's real parts and which are one designer's layer labels.
- **Whether widening the table would trigger OneDrive hydration.** Job 2 measured all 18,008
  `_MAL` files as locally hydrated placeholders *on that day*. That is not a guarantee.
- Everything in `WHAT I COULD NOT DETERMINE` at the foot.

---

# THE RECOMMENDATION, IN ONE PAGE

**One shape. Five new fields on the asset-table row, one new header block, one new registry
file, two new commands, one backfill run exactly once, three gate clauses. Zero of the 251
existing rows are re-judged.**

```
  subject     [ "unit:mgk-viiip", "part:faceplate", "expression:skeptical" ]
              namespaced, multi-valued, closed namespaces / declared values.
              HAND-WRITTEN. A scan never touches it.

  derivedFrom "A-9f1c22be04"        the uid of THIS row's master. Null by default.
                                    Child -> parent. One arrow per row.

  flatten     "A-3d7e10aa9c"        on the MASTER row: which of my derivatives is
                                    the one to use. This is Mike's "both the
                                    layered master and the best flatten", as data.

  bar         [ { law: "obfuscation", art: [1], scope: "W_PAIR, whole shot",
                  says: "FAILS Art. 1 by design (robot AND cabinet silhouettes).",
                  by: "CUT VIDEO - NIAC/README_v3.txt" } ]
              Records a publication bar. Carries the REASON and the GRANULARITY.
              Empty array means NOTHING IS RECORDED - it never means "cleared".

  store       "repo" | "mirror"     where the bytes live. `repo` is today's 251
                                    rows. `mirror` is material in OneDrive that
                                    git holds a manifest of and never holds.
```

Plus `_stores` in the table header (store name → root path, one line each), and
`provenance/subjects.json` — one row per legal subject value, with its display name and where
the value was found.

**What each of Mike's three sentences gets:**

| he says | the query | what answers it |
|---|---|---|
| *"all photos of the MGK-VIIIp"* | `kind=image AND subject contains unit:mgk-viiip` | 125 rows on the unchanged table today, before any new material is admitted |
| *"videos of Coconuts"* | `kind=video AND subject contains song:coconuts` | the six songs are already distinguishable by path; the field makes them askable |
| *"give me the PSD"* | row → `derivedFrom` → the master's `path` and `store` | one hop, and the reverse hop (`flatten`) hands back the export to publish |
| *"keep both"* | a row that is the target of any `derivedFrom`, or is named by any `flatten`, is **never a cull candidate** | this is where the pair-keeping actually happens — in the cull, not in the schema |

**What it does NOT do, deliberately:** it does not move a byte, does not add an R2 bucket,
does not add Git LFS, does not touch `role`, does not open a third door, does not build an
18,000-row inventory of OneDrive, and does not require you to look at 251 pictures.

---

# WHAT I TOOK FROM JOB 3

I read the `## ASSET TAG VOCABULARY` block, `## 3b — CONSOLIDATED VOCABULARY INDEX`, §3c (the
two `_mal` trees), §3a's duplicate resolution, and both closing lists. Specifically:

**TAKEN — and it is the spine of item 1.**

1. **The two `_mal` trees prove the expressions are a vocabulary, not a habit.** §3c is the
   single most load-bearing thing Job 3 found for me: the seven baby photographs are
   byte-identical across two independent trees, **every one of the seven was renamed**, and
   the expression names survive only on the `_MAL` side, only as folder names. Two trees
   carrying the same seven names, with the mapping recoverable only by hash, is exactly what
   a real controlled vocabulary looks like when nobody has written it down. It is why item 5
   gets a namespace rather than a `note`.
2. **The model-number FORMAT, adopted as a slug rule rather than as vocabulary.**
   `MGK-<PRODUCT>-<NN>`, and the casing fact that matters: `MGK-VIIIp` exactly, **never
   `MGK-VIIIP`, never `MGK-8p`, in all 4 files that carry it and in all 156-layer box
   documents.** That settles the display name; the slug is `mgk-viiip`, lowercased the way
   `media_type` lowercases `'photo'`, with the display string in the registry.
3. **The product codes as `unit:` candidates** — `MGK-VIIIp` and `MGK-PHVDC` are the only two
   product codes anywhere in the 36 files. That is a small, hard, found list, and it is why
   I am asking you about `MGK-TWIN` and `MGK-NIAC` rather than assuming them.
4. **The brands (4) as a `brand:` namespace** — `Weird.Baby`, `(A)BEAL`, `ScrapCo`, `MGK`.
   Found on artwork, four values, no ambiguity.
5. **The one genuine master/derivative case in the whole tree**, and its opposite: four
   flagged pairs turned out **byte-identical** — *"the same file at two addresses, not a
   master and a derivative"* — and only `MGK-VIIIp Box Graphics.psd` vs `MGK-VIIIp - BOX
   COVER (rev 2023_12_20).psd` is a real one, 16,346 bytes and two months apart. **One real
   pair in 36 files** is the number that tells me `derivedFrom` must be hand-declared, not
   scanned.
6. **The negative result that a hash cannot see a derivation.** Job 3 could hash 18,008 files
   and still could not answer *"was `mgk-viiip-cover.png` drawn from this artwork"* — *"a
   hash cannot answer that."* That is the whole argument for the `--link` command in item 2.
7. **`Q-5`: nothing in GRAPHICS has ever been in either repo, by hash, name, or byte-length.**
   That is a 1.19 GiB seam the table does not know exists, and it is the concrete case for
   the `store` field.

**DECLINED — and I want to be specific, because this is where a vocabulary proposal goes
wrong. A tagline is not a subject; a border weight is not a subject.**

| Job 3 gave me | I declined it as subject | why |
|---|---|---|
| **Taglines / slogans (7)** | yes | These are **copy printed inside a picture**. The house already has a home for that and it is not a tag: `provenance/assets.json` carries `textInImage` and a `text` field, and 34 rows use it today. Putting `THE MOST ADVANCED PORTABLE PREDICTION SYSTEM, EVER!` in a subject field would make a slogan a thing pictures are *of*. |
| **Border weights (6), border styles (4), circle variants (3), box faces (5+1)** | yes | These are **layer-group options inside one document** — a configurator, not a file property. A *file* does not have a border weight; a comp does. If a comp is ever exported, it becomes its own file and *then* a `variant:` namespace is a real question. Not today, and opening it today would give every value a population of zero. |
| **The 15 model / tier names** | yes, **pending your ruling** | Job 3's own Q-1 and Q-2 say the flagship's name is ambiguous (`The Everyman` on the list, `The Everyday` on every produced surface, and `Not for the Everyman!` used as a slogan *against* the product) and that nobody knows whether the 15 are a taxonomy or a page of rejected names. **Adopting an unruled list as a controlled vocabulary is precisely the "vocabulary inventions in spec sessions" failure CLAUDE.md names.** `The Informer` is already live in `provenance/assets.json` as read-off-the-faceplate text, which is where it belongs until you rule. |
| **Spec points (6), spec columns (3), units (4), the `1.75 x 3.25` faceplate dimension** | yes | This is the **content of an in-story specification**, governed by Doctrine 18 and by Job 3's own open Q-4. It is what a picture *says*, not what it is *of*. |
| **Typefaces (11)** | yes | Production metadata. Doctrine 11 says typography is meta and does not ship; it should not become a queryable facet of the collection either. |
| **The `00` vs `none` border inconsistency** | yes | Job 3 reported it as found and did not normalise it. Neither will I, and since the namespace is declined it does not arise. |

**ALSO TAKEN, from the other jobs, because it changed the answer:**

- **Job 1 B6 — the `a`/`b`/`c` suffix claim is falsified.** `003`/`003a` identical dimensions;
  `005a` *wider*; `001a` larger in both axes; `011` greyscale vs `011a` colour. And
  `1892×2042` is a **delivery rectangle** hit by five files from four different expression
  folders. **This is why `derivedFrom` is a hand-declared arrow and not a filename rule.** A
  schema that modelled the suffix as "crop" would have encoded a falsehood in 14 rows.
- **Job 1 B7 / B5 — the judgements that live only in folder names**, and the two clusters that
  are duplicates rather than derivatives (`HOW I SAVED THE WORLD` ×2, identical sha256, same
  minute).
- **Job 2 — the consent category.** 24 photographs of a named third party, raised unprompted.
  It is why `bar` carries a `law` and is not a boolean.
- **Job 6 — the manual pages are in the asset table already, joined to nothing:** all 61 page
  PNGs at `role: "source"`, `verdict: null`, `bucket: null`, `usedBy: []`, and zero
  `doc.manual.page.NN` ledger rows. **A finished 61-page deliverable sitting at `role:
  "source"` is item 2's collision in its purest form.**
- **Job 4 / Job 6 — `prod: "placed"` is bookkeeping about a placement it neither performs nor
  verifies.** I took the warning: a new field that *describes* a relation must not be mistaken
  for one that *enforces* it. Every field below is descriptive and I say so at each one.

---

# 1. SUBJECT

## The problem, stated exactly

`provenance/asset-table.json` has 251 rows and no subject field. `what` is free prose and is
**null on 215 of 251**; the 36 that are populated are good sentences that no query can use —
*"MGK-NIAC plate 1 of 4, and the album cover's badge — the helical core through the cage
bars."* That sentence contains three subjects and a role and none of them are extractable.

Mike's two query sentences are not one field's worth of question:

- *"all photos of the MGK-VIIIp"* — subject is **a machine**.
- *"videos of Coconuts"* — subject is **a song**.

A single closed enum cannot hold both without becoming a bag of unlike things. A `what` string
cannot answer either.

## The recommendation

**`subject`: an array of namespaced values, `ns:value`. Closed namespaces. Declared values.**

```
  subject: [ "unit:mgk-viiip", "part:faceplate" ]
  subject: [ "song:coconuts", "brand:weird-baby" ]
  subject: [ "person:<mike's word>", "expression:skeptical" ]
```

**Why namespaced-array and not a scalar enum, and not free tags:**

- **Not a scalar.** A photograph of the VIIIp's faceplate is of a machine *and* of a part.
  Forcing one loses the other; Job 3's `what` prose proves people naturally write two.
- **Not free tags.** Free tags in this house drift and then someone writes a heuristic to
  clean them up, and the heuristic becomes the vocabulary. That is the exact arc
  `CANONICAL_VOCABULARY.md` was written to reverse (`TIER_BY_NAMESPACE` heuristic vs the
  locked list) and the arc `kind-governance-spec.md` is trying to end (*"the unenforced
  `content_kind` tag soup"*).
- **Namespaced is the house's own tag grammar**, not a new idea: the museum's pill columns are
  built from `namespace:value` (`mood:snarky`, `motif:pink-hats`).

**The seven namespaces I would open, and where every one comes from:**

| namespace | values | provenance of the vocabulary |
|---|---|---|
| `unit:` | `mgk-viiip` · `mgk-niac` · `mgk-phvdc` · **`mgk-twin`?** | Job 3 §3b product codes; museum paths; **the fourth needs your word (Q-2 in the lead)** |
| `song:` | `coconuts` · `weird-baby-blues` · `pull-me-in-closer-blues` · `breakup-breakdown-blues` · `how-i-saved-the-world-blues` · `ed-yahdah` | the six tracks of *The Best of Weird.Baby Vol. 1*, already in `public/audio/wb/` filenames and in six populated `what` strings |
| `brand:` | `weird-baby` · `abeal` · `scrapco` · `mgk` · `robots` | Job 3 §3b brands (4) + the house's own `robots` mark |
| `expression:` | the seven | Job 1 B1 + Job 2 + Job 3 §3c — see item 5 |
| `person:` | **needs your word** | Job 2; the join point for the consent bar |
| `part:` | `faceplate` · `asset-tag` · `front-label` · `box` · `bar-logo` · `round-logo` · **candidates beyond these need review** | PSD filenames and layer names (Job 3); `what` prose (`the bezel around the glass`, `the base it stands on`). **This is the namespace with the most invention risk and I have deliberately under-filled it.** |
| `doc:` | `manual` · `storyboard` | Job 4/Job 6; the 61 manual pages |

**Closed namespaces, declared values.** No new *namespace* without a ruling — a namespace is a
claim about what kinds of things the collection is about. New *values* inside a namespace get a
row in `provenance/subjects.json` in the same commit that uses them. That is not a new
governance idea; it is **the provenance gate's own pattern, verbatim**: *"If you add content,
you add register rows in the same commit. `npm run provenance -- --emit` writes stubs for
whatever is undeclared."* A subject value used with no registry row is a gate failure and
`--emit` writes the stub.

**Who writes it — and the line I want drawn explicitly.**

`subject` is an **observation**, like `what` — not a **judgement**, like `verdict` and `bucket`
(*"Ops never writes this field"*). So Ops may write it, hand, never by scan. But there is a
sharper line inside that, and it is worth putting in the field's own self-doc:

> **Ops may TRANSCRIBE a subject that a path, a folder name, a layer name, a README or Mike's
> own words already state. Ops may not INFER one by looking at a picture and deciding what it
> is of.**

That is the same distinction the three-marks rule draws between his sentence and Ops'
sentence, applied to a data field. It also makes the backfill legal:

**The backfill is measured, not estimated. I ran it read-only against the unchanged table:**

> **142 of 251 rows (57%) receive at least one subject from a token their own path already
> contains** — `unit:mgk-viiip` ×125, `unit:mgk-viii` ×6, `unit:mgk-twin` ×4,
> `unit:mgk-niac` ×1, and one row for each of the six songs.

That is a transcription (the path segment *is* `robots/mgk-viiip/…`), it is one script run
once, and its output is a diff a human reads in a sitting. **It is run exactly once and never
again**, on the precedent the repo already set and stated as a rule:
*"Never re-run `provenance/backfill-20260804.mjs`. It is the audit record of the first
classification; its coarse rules would silently absorb anything new and the boundary would
stop being one."*

**Cost of this choice, stated plainly:**

- The other **109 rows get no subject from the backfill** and will sit at `subject: []` until
  someone writes one. `[]` means *nobody has said*, exactly as `quality: null` means *nobody
  has looked* and *"is not a passing grade"*.
- **A closed namespace list will be wrong at some point.** The first time a genuinely new kind
  of subject arrives (a place? an event?) it needs a ruling before it can be tagged, and that
  is friction on the day Mike is moving fast. I think that is the right side to be wrong on —
  the alternative failure is silent and permanent, and this one interrupts him once.
- **`part:` is the weak namespace** and I have said so rather than filling it to look complete.

## A correction to my own brief, which future work needs

My instructions named `docs/CANONICAL_VOCABULARY.md` as authority for museum tag vocabulary.
**That file declares itself SUPERSEDED and RETIRED as of 2026-06-14** — *"Do NOT orient to the
three-tier model below for new work"* — and points at `docs/kind-governance-spec.md`. That
successor is itself **a proposal awaiting Mike, not a live field**: *"Nothing in this document
has been applied. No DDL has run, no row has been written."*

So the honest position is: **there is no currently-ratified vocabulary authority in this repo.**
What survives from both files is a *method*, and it is the method I have followed —
closed set, one declaration file that every reader imports, a hard backstop that fails loud, and
display names in a lookup so a rename is an edit rather than a migration.

`CLAUDE.md` still instructs sessions to read `CANONICAL_VOCABULARY.md` as authority. **That is
an Ops repair, not a question for Mike**, and it is in the round-log list at the foot.

---

# 2. MASTER / DERIVATIVE

## The collision, named plainly

**`role` answers "can a browser reach it". It does not answer "is this the authoritative
file". The word `source` is doing the damage, because it reads as *the source file* and means
*not under `public/`*.**

The computation is one line in `tools/asset-table.mjs`:

```js
role: ref ? (usedBy.length ? "shipped" : "unreferenced") : "source",
```

`ref` is non-null only for museum files under `public/`. So `role: "source"` is the value
every file gets for having **no public address** — and it lands on **206 of 251 rows**,
covering, with no distinction between them:

- a layered PSD master,
- the 61 finished manual pages of a shipped deliverable (Job 6),
- and `docs/cleanup-round-20260803/C1-about-the-songs-cards-gone.jpg`, a round-log screenshot.

Three different kinds of thing, one word, and the word is the one a reader would use for "the
master". This is not a bug in `role` — `role` is *correct about what it measures* and three
instruments read it (`--orphans`, `--checklist`, `--unverdicted`, and the cull). It is a
naming collision, and the fix is not to rename it.

**I considered renaming `source` → `internal`/`offstage` and rejected it.** It is a scanned
field with three consumers and a cull downstream; a rename buys clarity and costs a
touch-everything migration for a word that stops being ambiguous the moment mastery has its own
field. **Leave `role` alone. Give mastery a field.**

## The recommendation — two fields and one command

**`derivedFrom`: the uid of this row's master. Null by default. Child → parent, one arrow per
row.**

Why child-side and single:
- A master with five exports would need a five-element array on the parent, and arrays go stale
  in one direction while the child's own arrow cannot.
- One arrow per row cannot contradict itself.
- **`uid` is the precedent and it is explicit**: *"Other tables may reference a row by uid;
  nothing may reference it by path and expect that to hold."* `reveal/ledger.json` already
  points into this table by uid via its `assets` array, and its `_join` states the pattern:
  *"one row per FILE … one row per REVEALABLE THING. Neither restates the other; they meet at
  `assets`."* A `derivedFrom` is the same join, inside one table.

**`flatten`: on the MASTER row, the uid of the derivative that is the one to use. Null by
default.**

This is Mike's sentence — *"best version of each image kept, both the layered master and the
best flatten"* — expressed as data. It goes on the **parent**, not as a `primary: true` on the
child, for one reason: **a parent-side pointer makes "exactly one best flatten" true by
construction.** Two children could both carry a boolean; a parent cannot point twice.

And it makes both of Mike's directions one hop:

- *"I want a new view in the Portal, give me the PSD"* → the shipped PNG's row →
  `derivedFrom` → the master's `path` + `store`.
- *"ship this one"* → the master's row → `flatten` → the export to publish.

## How links get declared, and what stops a wrong one

**First, a correction to the premise I was handed.** My brief said *"some links are
machine-provable (the NIAC cover is pixel-identical to its PSD)"*. **I could not confirm that
and the evidence runs against it:**

- Job 1 rates `mgk-niac-cover.psd → NEW Robots.png` **MEDIUM** on canvas identity and naming
  alone, did not decode the PSD composite, and found **the PSD is a day NEWER than the PNG**.
- Job 3 found the museum's shipped `mgk-niac-cover.png` matches **nothing** in GRAPHICS by
  hash or size, and said the visual question *"is not something a hash can answer."*
- Job 3's four byte-identical pairs are the opposite of a derivation: *"the same file at two
  addresses, not a master and a derivative."*

**So: a hash can DISPROVE a derivation (identical bytes = a duplicate, not a child). It can
never PROVE one, because a PSD and its PNG share no bytes at all.** What a machine can offer is
**corroboration** — canvas identity, mtime ordering, shared basename, a monotone size
relationship — and corroboration is not a declaration.

Therefore:

1. **A scan never writes `derivedFrom` or `flatten`.** They join the fields carried across
   untouched, alongside the six judged ones. This is the table's founding rule
   (*"The scan never overwrites a judgement"*), extended.
2. **A link is declared by an explicit command, `--link <child-uid> <parent-uid>`**, on the
   precedent the table already set for the case a hash cannot see:
   *"`--rename` is the explicit human declaration that moves the judgement. Silence was the
   defect; a hash only shrinks how often it happens, it never removes it."*
   The command **prints the corroboration it found and refuses the disproofs**:
   - identical `sha256` → **refuse**, with Job 3's sentence: these are the same file at two
     addresses.
   - child older than parent → **warn by name**, and cite the case: Job 1's cluster 4, where
     the PSD is a day newer than the PNG beside it.
   - no shared canvas, no shared basename, no mtime ordering → print *"nothing corroborates
     this"* and require the flag to be repeated. It still lands, because Mike can know things
     the bytes do not; it does not land quietly.
3. **Three gate clauses**, run beside the existing provenance gate:
   - every `derivedFrom` resolves to a uid in the table;
   - no cycle;
   - **a `flatten` must point at a row whose `derivedFrom` is this row.** Otherwise "my best
     flatten" points at a stranger.
4. **The `--link` call lives in a commit.** Who declared it, when, and against what evidence is
   in the round log, the way every judged change in this repo is.

## Where the pair-keeping actually happens — and it is not in the schema

Mike's rule is *keep both*. A field cannot keep anything; the **cull** is what deletes. So the
operative clause is:

> **A row that is the target of any `derivedFrom`, or is named by any `flatten`, is never a
> cull candidate and never an orphan.**

This matters now, not later. The D-round found `--orphans` had *"never reported a row in its
life"* because it counted `missing && isJudged` and no missing row had ever carried a
judgement — *"its population was empty by construction and a reading of 0 was indistinguishable
from a clean table."* Then it reported 27 and all 27 were culled. **An orphan check that is
blind to `derivedFrom` would eventually offer a master for deletion because nothing references
it — which is exactly what a master looks like from `public/`.**

## Cost

- **Two fields that will be null on almost every row for a long time.** Job 3 found *one*
  genuine master/derivative pair in 36 files; Job 1 found four master-involving clusters, of
  which one is a duplicate and one is MEDIUM. Realistically fewer than twenty links exist to
  declare. A reader will meet `derivedFrom: null` 230 times. I think that is acceptable —
  `verdict` is null on 251 of 251 today and nobody calls it dead weight — but it is a cost.
- **It does not touch `role`,** so the misreading survives in the word itself. What changes is
  that the question `role` was being asked wrongly now has a field that answers it.
- **`--link` is a manual act.** Every link is a person's minute. There is no version of this
  that is both honest and free.

---

# 3. WHERE 7.88 GiB LIVES

## What the repos do today — measured, not assumed

- **No Git LFS in use.** git-lfs 3.7.1 is installed on the machine; `git lfs ls-files` returns
  **empty in both repos**.
- **No R2 bucket binding.** The museum's `wrangler.jsonc` has `d1_databases` and
  `run_worker_first`; there are **no `r2_buckets`**.
- Binaries are plain git blobs. Largest tracked: 5.98 MB `public/audio/wb/05_ed_yahdah…mp3`
  (museum), 5.79 MB `MGK-VIIIp_OMI_STRUCTURE_v1.pdf` (robots). Museum pack: 1.61 MiB.
- The asset table's 251 rows total **0.91 GiB**, against roughly **7.88 GiB** of candidate
  material outside it.

## This is not an open question. It is a standing ruling.

**"Heavy media never in git"** — Mike + Ops, 2026-07-13, in the robots repo's `STATE.md` line
30, restated at line 25 (*"NEVER in git — LINEAGE-indexed in place per ruling"*) and in that
repo's `CLAUDE.md` (*"this repo is the index; heavy media stays in place in OneDrive, never in
git"*).

**And the mechanism already exists**, `LINEAGE.md` line 135, verbatim:

> **"## Mirror-class media (never in git; lives in place, indexed here)** … 2021 build videos
> (952 MB) · `Weird.Baby_Screen_Leak.MOV` (231 MB) · OPA PSD masters (up to 298 MB each) ·
> Takeout zips (3.8 GB) · SD-card audio images · `MGK_VIIIp Workbook.xlsx` (47.8 MB) and
> sibling originals (**git holds a MANIFEST with paths + SHA-256s instead**)."

Three custody locations are named, with location A — the git repo — carrying the words
**"Nothing heavy."** And `LINEAGE.md` line 5: *"If custody changes, this file changes in the
same commit."*

The NIAC READMEs cite the same rule from the other side: *"Heavy media, so not in git."*

## R2 and LFS as departures from that ruling, with their costs named

**Git LFS — departs from the ruling and does not even satisfy it.**
The bytes still live in a git-attached store: pointers in the tree, objects on the remote. Costs:
money (GitHub's LFS allowance is 1 GB before a paid data pack; 7.88 GiB is not free), a smudge
filter on every clone and every CI checkout, and a new failure mode in an environment whose
quirk list is already fourteen entries long — `CLAUDE.md` documents FUSE mangling `.git/index`,
`.git/HEAD` and `.git/config` on ordinary operations. **What it buys is versioned binaries, and
Mike has never asked for a version history of a PSD.** He asked to be handed one.

**R2 — a real option, solving a problem he did not state.**
No git involvement; roughly $0.015/GB-month (≈ $0.12/mo at this size) with no egress charge to
a Worker; the museum already has a Cloudflare account, a `wrangler.jsonc`, and a D1 binding, so
the wiring is small. The costs are not the money:

- **It makes the material REACHABLE**, and reachability is the thing this building is most
  careful about. There are already four hold prefixes in two pairs, named for their reasons,
  and `reveal/reachability.mjs` fails the gate if any loses an entry. A bucket is a **new
  address for a picture**, and §8's *a picture has two addresses* hazard becomes three.
- **It collides directly with the obfuscation law and with item 4.** A store whose whole
  purpose is serving bytes over HTTP is the last place the 18 fenced files should acquire an
  address.
- **It does not answer his sentence.** *"Give me the PSD"* means the file open in Photoshop on
  his machine. OneDrive already puts it there. **R2 solves delivery; his problem is
  retrieval.**

**Nothing (keep the ruling) — recommended.** Costs nothing, moves nothing, and the mechanism
is already written down and already being used.

> **Recommendation: no storage change. The bytes stay in OneDrive. What changes is the
> manifest.**

## The crux — does `asset-table.json` become that manifest?

This is the genuinely open part, and it is a change to the table's own declared scope:
**"every image, video and audio file in both repos."**

**The case FOR widening, and one argument is decisive:**

> **The master is in OneDrive and the derivative is in the repo. That is the ORDINARY case,
> not an edge case.** If mirror files live in a second manifest, then `derivedFrom` is a uid
> pointing across a file boundary into a table with its own id scheme, and item 2's whole
> shape breaks on the first link anyone wants to declare.

Supporting: the table is *already* the manifest shape (`path` + `sha256` + `uid` + `bytes` +
dimensions per file); one table means one query answers *"all photos of the MGK-VIIIp"* across
both the shipped 455 KB PNG and the 25 MB layered faceplate.

**The case AGAINST, and it is not weak:**

- **File count, not byte count, is the real hazard.** `_MAL` alone is **18,008 files, 17,011
  of them audio**. A naive widening turns a 251-row hand-curated JSON into an 18,000-row
  machine dump and destroys the property that makes it useful — that a human can read the diff.
- **`role` would be computed for every mirror file and every one would land on `source`,**
  inflating by thousands the exact bucket item 2 says is already overloaded.
- **`missing` becomes a lie.** The cull reads missing rows. A OneDrive placeholder that has
  been dehydrated, or an unmounted drive, would read exactly like a deleted file. Job 2
  measured all 18,008 `_MAL` files as locally hydrated **on the day it looked**; that is a
  measurement, not a guarantee.
- **`--scan` would need a root that is not a repo, not versioned, and not reachable from the
  cowork sandbox** — the same constraint that already forces `export-artifacts` to run
  host-only (quirk #11).

**The recommendation, which takes the FOR and pays for the AGAINST:**

1. **Widen the scope, selectively.** `store: "repo" | "mirror"`, plus a `_stores` block in the
   header mapping each store to its root path — the same self-documenting header pattern the
   table already uses for `_uid` and `_sha256`.
2. **A mirror row exists only when there is a reason for it.** Exactly three reasons: it is a
   master or derivative of something in the table; it is a candidate Mike will want to find by
   subject; or it carries a bar that must be recorded. **Everything else stays out.**
   Estimated size: Job 1's 84 + Job 2's ~68 non-Arduino media + Job 3's 36 ≈ **200 rows.
   The table roughly doubles, 251 → ~450.** It does not go to 18,000.
3. **`--scan` never walks the mirror.** A separate, opt-in `--scan-mirror` does, host-only.
4. **Three behaviours branch on `store`, and they are the hazard fixes:**
   - **`missing` on a mirror row is never an orphan and never a cull candidate.** It means
     *not hydrated / not mounted*, not *deleted*.
   - **`role` is `null` on mirror rows**, because reachability is meaningless for a file with
     no public address. This also stops the `source` bucket inflating.
   - **`usedBy` is not computed** for mirror rows.
5. **`LINEAGE.md` keeps the folder-level custody record and stays the authority on custody** —
   it already names three locations and requires a commit when custody changes. The two meet
   at `sha256`, the way `asset-table.json` and `assets.json` already meet at `ref` and share
   *"a directory and nothing else."*
6. **The exhaustive per-file layer already exists and does not need rebuilding.**
   `JOB1-manifest.json` (84 files), `JOB2-inventory.json` (997 rows with hashes),
   `JOB3-inventory.json` + `_work-MAL-hashes.json` (18,008 hashed) were written last night.
   If an exhaustive index is ever wanted, it is a copy, not a scan.

**What would change my mind:** if Mike says he wants the museum to *serve* this material —
big-image viewers, downloadable masters, video on the site — then R2 stops being an answer to
an unasked question and becomes the right one, and the ruling is his to revise. Nothing in
what he said tonight points that way.

---

# 4. UNPUBLISHABLE BY LAW

## What the evidence demands

Nothing in either repo records that a file is barred from publication. The material that needs
it is precise about three things, and a boolean loses all three:

**It is per-shot, and conditional.** From `RAW VIDEO - NIAC/README.txt`:
*"PASSES, near enough #7 the reel kicks"* · *"FAILS on the room #1, #2, #3"* ·
*"FAILS hard #4, #5, #6"* · *"FAILS everything #8 the finale — full-rig wide, whole bench,
floor, room. The best shot and the most illegal one."*

**It is per-ARTICLE, and the articles are numbered canon.** `OBFUSCATION_LAW.md` has exactly
five, and the READMEs cite them by number: *"W_MELT FAILS Art. 1 by design. x=140 is set by
the portrait at the left frame edge (x 0-110)."*

**It is scoped to a time window, a crop, or a whole file.** *"The 7.05-9.00 window of clip 02
is EXCLUDED because the portrait emerges from behind the cabinet at source x 90-190 in that
window and only that window."*

**And there are at least three different reasons, which must not share a channel.** The repo
has already proved this principle and paid for it: `/assets/locked/` is PERMISSION,
`/assets/held/` is STAGE, *"named for their reasons"*, and a story lock **needs a third door**.
Here: an obfuscation-law bar is not a consent bar (Job 2's 24 photographs of a named third
party) is not a licence question (Job 2's pixabay / ttsmp3 material) is not a stage hold.

## The field

**`bar`: an array of recorded bars. Empty by default. Each entry carries the law, the article,
the scope, the wording, and where the bar came from.**

```
bar: [
  { law:  "obfuscation",
    art:  [1],
    scope:"W_PAIR — whole shot",
    says: "FAILS Art. 1 by design (robot AND cabinet silhouettes).",
    by:   "Weird.Baby Files/CUT VIDEO - NIAC/README_v3.txt" }
]
```

- **`law`** is the closed part: `obfuscation` · `consent` · `licence` · `unruled`. Four values,
  three of them found in evidence and the fourth for the case the tree actually contains — the
  nude-illustration brand call, *"LEGAL BUT A BRAND CALL … Whether it belongs in a
  public-facing Weird.Baby short is yours."* A flagged-and-unruled bar is a real state and
  giving it a name stops it being recorded as a refusal or forgotten as a pass.
- **`art`** cites article numbers of the named law. Only `obfuscation` has articles today, and
  they are canon and numbered 1–5. **Found vocabulary, not invented.**
- **`scope`** is what makes it per-shot instead of per-file: a shot name, a time window, a crop
  rectangle, or `"whole file"`. The READMEs already write in exactly this grammar; the field
  transcribes it.
- **`says`** is the source document's own sentence, verbatim.
- **`by`** names the document the bar came from. This is Article 5's logic — *"an asset nobody
  can trace is a rumour"* — applied to the record of the bar itself.

## What it must NOT do — five rules, each with its evidence

1. **It must not be a permission mechanism or a stage mechanism, and must never grow a door.**
   It records; it does not gate a route. Nothing in `src/` reads it. The two existing prefixes
   are named for their reasons and a third reason needs its own door — a bar is a **fourth**
   kind of reason and it must not be smuggled into either pair. *(This is also why the field
   is on the asset table and not in `placement.js` or `worker.js`.)*
2. **An empty `bar` must never read as a clearance.** `bar: []` means *nothing is recorded*.
   There is no `"none"` value, because "cleared for publication" is a judgement Ops is not
   entitled to make. This mirrors the table's own most careful sentence: `quality: null`
   *"means NOBODY HAS LOOKED, and it is not a passing grade."* **This is the most important
   negative in this item.**
3. **It must not let a copy launder a file — and it must not be INHERITED to compensate.**
   The bar travels on the row; the row is keyed by `uid` and matched by `sha256`. So a barred
   file copied into `public/` produces a row with the same hash under a public path, and a
   gate clause can fail on exactly that: *a barred hash has appeared at a public address.*
   That is the mechanical form of *"A REVIEW CUT IS NEVER PROMOTED TO A PUBLISHED ASSET BY
   BEING COPIED."*
   **But `bar` must never be inherited along a `derivedFrom` arrow, in either direction**, and
   this is where items 2 and 4 collide:
   - inherited **downward**, a lawful re-derivation — *"it is re-derived under the law, or it
     does not ship"* — would arrive pre-condemned;
   - inherited **upward**, or clearable by declaring a derivation, someone could launder a bar
     by drawing an arrow.
   A re-derived file is a different file with a different hash and gets its own row and its own
   ruling. **Every bar is declared on its own row.**
4. **It must not become a second authority.** `OBFUSCATION_LAW.md` already carries *"Assets
   ruled under this law to date"* — a ruling table in prose, with eight rows. The field is an
   **index into that**, via `by`. Two records of one ruling drift; this repo has paid for that
   three times over (three copies of the album catalogue, kept in step by nothing).
5. **Ops may transcribe a bar; Ops may never author one, and may never remove one.** Same rule
   as `verdict`. A bar Ops invented would be Ops legislating; a bar Ops deleted would be Ops
   overruling.

## What it costs, and the gap it exposes

- **The 18 fenced files would get rows** — in `store: "mirror"`, at their OneDrive paths, with
  their per-shot bars transcribed from the four READMEs. **No destination is proposed for any
  of them and none is implied by having a row.** A row is the opposite of a destination: it is
  the record that says *this may not go anywhere*. Today nothing in either repo knows those
  files exist, which means nothing in either repo knows they are barred.
- **`law: "consent"` currently points at nothing.** There is no consent law in either repo.
  The obfuscation law's room clause governs *a portrait appearing inside a published asset of
  a machine*; Job 2's 24 photographs are documentary photographs *of a person*, which is a
  different situation and may well be publishable with permission. **A bar with no law behind
  it is a note.** Ruling 6 in the lead.
- **Transcribing the per-shot bars is a careful hour**, and it must be verbatim. The READMEs
  are long, precise, and partly superseded (v1 → v2 → v3, with v1 and v2 *"deliberately left
  in place for comparison"*). Getting the supersession right matters: `WB_SIGNATURE_A_WTF_rough.mp4`
  and its v3 carry different bars.

---

# 5. THE SEVEN EXPRESSIONS

**They are a facet of subject, and they live in their own namespace:
`expression:bored` · `holy-crap` · `in-love` · `infatuation` · `shock-and-awe` · `skeptical` ·
`yeah-yeah`.**

```
subject: [ "person:<mike's word>", "expression:skeptical", "brand:weird-baby" ]
```

**Why a namespace inside `subject`, and not its own field:**

- **They are not the subject** in the *what is this a picture of* sense — that is one person,
  in every one of the 31 photographs. The expression says *which of seven* of that one subject.
  So "a facet of subject" is the literally accurate description.
- **But they behave exactly like a subject operationally.** Mike will say *"give me SKEPTICAL"*
  the same way he says *"all photos of the MGK-VIIIp"*, and Job 2 named this set as the one
  asset natively suited to fast cutting *because* it is pre-sorted into seven beats.
- **A top-level `expression` field would be a namespace-of-one.** Next month `part:` wants the
  same treatment, and then `person:`, and you have five scalar fields answering one question.
  **The namespaced array absorbs it at zero marginal cost — which is the argument for the
  shape in item 1 in the first place.** If the answer to item 5 had needed a sixth field, that
  would have been evidence against the item 1 design.

**Why they are certainly a controlled vocabulary and not one folder's habit:**

Two independent trees carry the same seven names. Job 1 found them in `ADD TO REPOS`; Job 2
found them independently in `_MAL\Photos\`; Job 3 proved by sha256 that the underlying
photographs are byte-identical across both and that **every one of the seven was renamed** —
the expression names survive only on the `_MAL` side, only as folder names, and the mapping
between the two namings *"would not have been recoverable at all"* without the hash comparison.
Vocabulary that survives a rename in one tree and is recoverable only by content matching is
not a naming habit.

**Three traps, all of which would be sprung by a mechanical backfill:**

1. **The eighth string that is not an expression.** `Baby Weird.Baby_PHOTOS NOT YET USED` sits
   in the same slot in the tree as the seven, under the same prefix — **but it joins with an
   UNDERSCORE where all seven join with a SPACE.** One character separates a status from an
   expression. Any script that reads these folders must exclude it by that character, and Job 1
   recorded it as a status rather than folding it in.
2. **`NOT YET USED` maps to nothing, and should.** It is the default state of an untagged
   photograph. A `notYetUsed` boolean whose `false` means nothing is exactly what the Law of
   Subtraction refuses. **18 of the 31 photographs get `subject` with no `expression:` value,
   and that is the honest record** — *"empty and honest beats populated and false."* Nothing
   in either tree suggests which expression any of them would take.
3. **The casing is data.** All seven are ALL-CAPS with single internal spaces and no
   punctuation. Slugs are lowercase-hyphen (matching `media_type`'s `'photo','video'`
   convention); the exact string `SHOCK AND AWE` is the **display name** in
   `provenance/subjects.json`, on the display-name-lookup pattern the house already uses.

**And the standing warning, repeated from the lead because it is the only thing here that can
be lost by accident:** the expression is in the folder name and **in no byte of any file**, in
either tree. Until these rows exist, `Weird.Baby Photos\` may not be flattened, reorganised or
renamed. Job 1 called it *"the single most fragile judgement in the folder"* and it is right.

---

# THE HONEST ACCOUNTING

**What this proposal costs, in one place.**

| | |
|---|---|
| existing rows re-judged by hand | **0** |
| rows getting a subject from a one-time, reviewable backfill | **142 of 251** (measured, this table, tonight) |
| rows left at `subject: []` after the backfill | **109** |
| new fields on the row | **5** (`subject`, `derivedFrom`, `flatten`, `bar`, `store`) |
| new files | **1** (`provenance/subjects.json`) |
| new header keys | **1** (`_stores`) + a self-doc paragraph per new field |
| new commands | **2** (`--link`, `--scan-mirror`) |
| new gate clauses | **3** (undeclared subject value · `derivedFrom`/`flatten` integrity · barred hash at a public address) |
| bytes moved | **0** |
| money | **$0** |
| estimated new rows if the table widens to the mirror | **~200**, taking it to ~450. Not 18,000. |
| hand work that is genuinely unbounded | transcribing the per-shot bars (a careful hour, verbatim) and declaring links (fewer than twenty exist) |

**Where I would be wrong, and what would change my mind:**

- **If Mike wants the museum to SERVE this material** — masters downloadable, video on the
  site, a big-image viewer — then R2 is the right answer and the 2026-07-13 ruling is his to
  revise. Nothing he said tonight points that way; he asked to be *handed* a PSD.
- **If `part:` turns out to be the namespace he actually queries** — *"give me every shot of
  the faceplate"* — then the weakest namespace in my proposal is the load-bearing one and it
  needs Mike's list before anything else does.
- **If the 15 model names are a live taxonomy** (Job 3 Q-2), `model:` opens as an eighth
  namespace and it is a bigger deal than any other single value question here, because it
  would be the first namespace whose values are *tiers of a product* rather than things.
- **If he wants the fenced material to have no record at all in the repos** — a defensible
  position — then item 4 shrinks to a bar field that only ever describes files already in the
  table, and the 18 files stay entirely outside. I do not recommend it (nothing in a repo
  currently knows they are barred, which is the failure mode), but it is a coherent ruling and
  it is his.

**One thing for the round log rather than for Mike:** `CLAUDE.md` instructs every session to
treat `docs/CANONICAL_VOCABULARY.md` as vocabulary authority, and that file has declared itself
retired since 2026-06-14. Its named successor is an unratified proposal. Ops should reconcile
the orientation doc; it is not a decision anybody needs to make.

---

# WHAT I COULD NOT DETERMINE

1. **Whether any master/derivative pair in this material is machine-provable.** My brief said
   the NIAC cover is pixel-identical to its PSD. Job 1 rates that pairing MEDIUM on canvas and
   naming alone and found the PSD is a day newer; Job 3 found the museum's shipped PNG matches
   nothing in GRAPHICS by hash and said a hash cannot answer the visual question. **I did not
   open either file** — this job read no image. If the pixel-identity claim is true from
   somewhere I did not see, `--link` gets one more corroboration test and nothing else in the
   shape changes.
2. **The `part:` value list.** I can see component words in PSD layer names (`Model Field`,
   `OUTPUT Field`) and in `what` prose (`the bezel around the glass`, `the base it stands on`)
   and I cannot tell which are the machine's real parts and which are one designer's labels for
   boxes in a layout. I under-filled the namespace rather than guessing it full.
3. **Whether `MGK-TWIN` is a machine.** It appears in museum filenames
   (`MGK-TWIN_MONITOR_SCREEN_BEZEL.png`) and in a 360 MB PSD name in Job 1's tree
   (`MGK-TWIN MONITOR SCREENS_2.psd`), and the `what` prose treats those photographs as being
   of *the unit*. It could be a fourth product code or it could be a subsystem of one you have.
   The distinction decides whether it is a `unit:` or a `part:`.
4. **Whether widening the table would trigger OneDrive hydration or download.** Job 2 measured
   all 18,008 `_MAL` files as `ReparsePoint` placeholders with **0 Offline** on 2026-08-10, so
   its hashing read real bytes and downloaded nothing. That is a measurement of one day's
   state, not a property of the store. A `--scan-mirror` that hashes 200 files could behave
   differently on a machine that has evicted them.
5. **How many links actually exist to declare.** Job 1 found four master-involving clusters of
   which one is a byte-duplicate and one is MEDIUM; Job 3 found exactly one genuine case in 36
   files. I estimated "fewer than twenty" for the whole body of material and that is an
   estimate, not a count — nobody has looked at the 5.35 GiB in Job 1's tree with this question
   in hand.
6. **Whether `store: "mirror"` rows would break any existing consumer.** I read
   `tools/asset-table.mjs` and traced `role`, `--orphans`, `--checklist` and `--unverdicted`,
   and I read the ledger's `resolve()` path through Job 6. I did not trace every reader of
   `provenance/asset-table.json` in the tree, and I ran nothing.
7. **What the six spec rows pair with** (Job 3's own item 1) and **what `PHVDC` stands for**
   (its item 2) — both still open, and both would matter if `unit:mgk-phvdc` ever gets a face.
8. **Whether the 61 manual pages should be one subject or 61.** Job 6 shows them indexed and
   joined to nothing; under my shape they all take `unit:mgk-viiip` + `doc:manual` from their
   path, which makes them findable and does not make them distinguishable from each other. That
   may be right (they are pages of one document) or it may want a page number, and Job 6's
   ledger row already carries one. I did not resolve it.

---

# WHAT NEEDS MIKE

1. **Ratify or refuse the shape.** Five fields (`subject`, `derivedFrom`, `flatten`, `bar`,
   `store`), one registry file, two commands, three gate clauses, zero bytes moved, zero rows
   re-judged. Everything below is a value inside it and cannot be settled first.

2. **`unit:` — is `MGK-TWIN` a machine, or a part of one you already have?** And is `MGK-NIAC`
   a unit alongside `MGK-VIIIp` and `MGK-PHVDC`, or a name for something else? Those four
   tokens are the whole population of that namespace and I will not guess which are machines.

3. **`The Everyman` or `The Everyday`, and are the 15 model names a taxonomy or a brainstorm?**
   (Job 3 Q-1 and Q-2, unchanged — I am not re-asking, I am saying what turns on it: whether
   `model:` opens as a namespace at all. Until you rule, the 15 names go in nothing, and
   `The Informer` stays where it already is, as read-off-the-faceplate text in
   `provenance/assets.json`.)

4. **Does the asset table widen past the two repos?** Its own header says *"every image, video
   and audio file in both repos."* My recommendation is **yes, selectively** — a mirror row
   only where the file is a master, a findable candidate, or barred; roughly 200 rows, not
   18,000 — with `missing` on a mirror row explicitly never meaning *deleted*. **That is a
   change to the table's declared scope and it is yours.**

5. **Naming real people in a committed data file.** The consent bar needs a `person:` value to
   hang on. Writing a named third party's name into a JSON in a git repo is a decision about
   that person and I have not made it.

6. **There is no consent law to cite.** `OBFUSCATION_LAW.md`'s room clause governs a
   photographic portrait appearing *inside a published asset of a machine*. Job 2's 24
   photographs are documentary photographs *of a person* — a different situation, possibly
   publishable with permission, and covered by nothing in either repo. **A bar with no law
   behind it is a note, not a bar.** Either those photographs get a law, or they get
   `law: "unruled"` and wait.

7. **The nude-illustration brand call, still open.** `README_v3.txt`: *"FLAGGED FOR MIKE, LEGAL
   BUT A BRAND CALL: the red pin-up figure is a NUDE ILLUSTRATION and it is visible at the left
   edge of the wides in BOTH cuts… Whether it belongs in a public-facing Weird.Baby short is
   yours. Removing it costs a crop of roughly x >= 150 on W_PAIR."* It is the first
   `law: "unruled"` bar anyone would write, and it stays unruled until you answer.

8. **`mgk-niac-cover.psd` (2026-08-10 13:50) is a day NEWER than `NEW Robots.png`
   (2026-08-09 11:28)**, same folder, same 1200×1200 canvas. The very first master/derivative
   link anyone would want to declare is the one whose dates run backwards. Which is current —
   and if the PSD is, is the PNG a stale export?

9. **Nobody may flatten `Weird.Baby Photos\` — in either tree — until the expression tagging
   exists.** The seven names are folder names and appear in **no byte of any file**. This is
   not a ruling I need; it is the one thing in this whole report that can be destroyed by a
   tidy-up before you have ruled on anything.

---

*Job 5 wrote one file: `C:\AI\_night-20260810\JOB5.md`. No schema file, no `.mjs`, no migration
script, no JSON. Nothing on this machine was created, modified, moved, renamed or deleted
outside that path. No repo script was executed. No file in any tree was proposed for `public/`
or for either repo, and the 18 fenced media/timeline files under `CUT VIDEO - NIAC` and
`RAW VIDEO - NIAC` were read only for the bar language their READMEs carry — the field proposed
in item 4 records that they may not be published, and proposes no destination for any of them.*
