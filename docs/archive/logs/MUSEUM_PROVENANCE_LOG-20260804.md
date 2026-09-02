# MECHANIZE PROVENANCE — round log

**2026-08-04 · v48 · P1–P4 · autonomous single-agent Code-lane round on Mike's
remote-control brief. Push and deploy are Mike's.**

Companion deliverable: **`docs/PROVENANCE_RULINGS-20260804.md`** — five items
that need his word, none of them changed by this round.

---

## The problem, as Mike stated it

Doctrines 11 and 12 are rules, and a rule only catches what someone thinks to
look at. Doctrine 11 was written to stop meta-copy; *"436 records, kept since
January 2024"* **passed it** — a line about the collection, not about the work —
while being invented. Then twenty-seven strings were found, then ten more, then a
wireframe with room names baked into a JPEG. Every sweep finds the next
generation because the check is TEXTUAL. The structural cause: **any string can
enter the site and nothing at the boundary asks where it came from.**

---

## P1 — THE MODEL, AND WHY IT IS A REGISTER RATHER THAN A WRAPPER

**`provenance/register.json` — 2,089 rows, 620 KB, covering 2,528 visitor-facing
strings.** Each row: a class, a source or a reference, a file, a line, the text,
and the structural path it sits at.

**THE MECHANISM CHOSEN, AND WHAT IT BEAT.** Three were available:

- **A field on every content object.** Fails on arrival: content is not all
  objects. A third of it is JSX literals with nowhere to hang a field, and CSS
  `content:` has nowhere at all.
- **A wrapper — `M("…")`, `V("…", src)`.** Would touch every render site in
  16,000 lines, and buys nothing: nothing stops `M("an invented thing")`. It
  makes the declaration *syntactically* mandatory and *semantically* free.
- **A hash-keyed register plus an AST boundary sweep.** Chosen. It needs no
  edit to any rendered file, it enumerates the whole surface rather than the
  part someone remembered to wrap, and — the part that decided it — **the key is
  `sha256(file + " " + exact string)`, so editing a string invalidates its own
  declaration.** A one-time audit goes stale the next afternoon; this does not.

**THE CLASSES.** Mike's four — MIKE · VERIFIED · DERIVED · HOUSE — plus one this
round added and one holding pen.

**THE FIFTH CLASS IS `RESTATED`, AND IT IS FLAGGED FOR HIS RULING TOO.** His
four are ORIGINS. A museum also prints Ops-written connective prose that
originates nothing — a lead sentence introducing facts sourced two lines below
it, a Foundation answer rephrasing a charter clause. Calling that MIKE is false;
the sentence is not his. Calling it INVENTION is false too, and worse: 282 rows
of ordinary editorial would bury the three real findings and train everyone to
skim the list. **So it exists, and it has teeth** — `r` must RESOLVE, and the
gate resolves it every run:

1. a register key carrying a real origin, or
2. **a repo path that is not the file the string itself lives in.**

That second exclusion is the whole design. *"This sentence restates its own
file"* is the shrug the class would otherwise become, and **it is exactly the
shape "436 records, kept since January 2024" would have taken** — that line has
nothing to put in `r`, fails to RESTATED, and lands in INVENTION. The mechanism
was built against its own motivating failure and it catches it.

For the data files it goes further: `@face` resolves a RESTATED row to **the
sourced rows standing on the same face**. Prose on a face carrying no
MIKE/VERIFIED row is resting on nothing and falls to INVENTION. **Five rows hit
that during the backfill and were re-anchored rather than waved through.**

**THE EXTRACTION IS DEFAULT-DENY, and that is not a detail.** Every string in
authored source is content until a NAMED, COUNTED structural rule proves it is
machinery. A heuristic that decides what to LOOK AT reproduces the failure this
was built to fix; these heuristics only decide what to look AWAY from, and every
look-away is counted and sampleable (`--rules`, `--rule-sample=<name>`). An
over-broad rule shows up as a suspiciously large number rather than as silence.
6,449 raw string nodes → 2,528 on the boundary through sixteen named rules, the
largest three of which were read through before being trusted.

Two things a JS sweep would have missed and this one does not: **CSS `content:`
values** and **`index.html`'s title and meta tags**.

---

## P2 — MECHANIZED: IT FAILS THE GATE, AND IT WAS PROVED FAILING

`npm run provenance:gate` — exits 1 on: any undeclared string, a MIKE/VERIFIED/
DERIVED row with no source, a RESTATED row that does not resolve, an undeclared
image, an undeclared generated file, an unknown class, a parse failure, or an
INVENTION count above its ceiling.

**PROVED, NOT ASSERTED.** Two live tests against the working tree, both reverted:

| Test | Result |
|---|---|
| Append *"436 records, kept since January 2024."* to the booth's foot | **FAIL** — 1 UNDECLARED, exit 1 |
| Append *", since 2019"* to an existing sourced answer | **FAIL** — 1 UNDECLARED + 1 stale row, exit 1 |

The second is the one that matters. The line was *already declared*; changing it
changed its key, and the old declaration stopped covering it. **You cannot edit a
sourced line into an invented one without the boundary noticing.**

The gate also caught its own author: my first InfoBooth rule cited
`InfoBooth.jsx` as what its answers restate. The self-reference rule rejected 12
rows and I rewrote them to cite THE_CHARTER.

**INVENTION IS A CEILING, NOT A BLOCKER** — the lint-baseline discipline this
project already runs on. Today's ceiling is 3. It can only be lowered.

### What it cannot see — stated because overstating is worse than none

1. **It cannot verify a declaration is true.** Nothing can. The backfill records
   **the provenance this repository already states** — a fact's own `source:`
   tag, a card's `Verified` row, an accession number, a quoted ruling in a file
   header. It did **not** re-verify those sources.
2. **It cannot read text inside an image** — the `/hr/home` failure, structural.
   **Compensating check below.**
3. **It cannot detect a sourced number going stale.** *"78 songs on file in the
   museum's own vault"* is correctly cited to MediaVault and nothing here
   notices the day it stops being 78.
4. **It cannot see runtime-assembled text.** `"{} of {} in view"` is captured;
   the values are not, and cannot be.
5. **It cannot see visitor-supplied text** — the guest book, journal entries.
6. **It does not replace Doctrine 11.** Provenance catches a line whose CONTENT
   was made up. It does not catch a line whose SUBJECT is the making of the
   museum. The Portal's *"held — one entry state (C3)"* had a real origin and
   was still meta. **The two are complementary and both are required.**

### The image gap, and the check that covers it

**`provenance/assets.json` — 33 images, every one LOOKED AT on 2026-08-04**
(contact sheets at 420px/tile, plus a full-resolution crop where lettering was
the point). Each carries `textInImage`, a `text` field saying **what it says**,
and `inspected` saying how the claim was made. **Eighteen carry text.**

The `text` field is prose and not a boolean because the boolean cannot hold the
distinction that matters: **lettering that is part of a real object** (a maker's
plate, a machine's own screen) **is evidence and a museum prints it**; museum
copy painted into a picture is the `/hr/home` failure. Only a reader can tell
them apart.

**Honest about the honesty:** this is a human looking at pictures. Nothing
automates it. What the gate enforces is that a NEW image fails until somebody
looks and says.

**It paid for itself on the first pass — two findings no text sweep could ever
have made**, both in R-file: the MGK-VIIIp's front glass is **mirror-reversed**
in the file the plate wall captions *"The front glass, lit"*, and the WAL
portrait of Hunter Root has **another band's name across the shirt**.

---

## P3 — THE BACKFILL: 2,528 STRINGS CLASSIFIED

**The default is INVENTION.** A string no rule matched was not blessed, it was
flagged. A backfill whose fallback is "probably fine" is the failure it was
written to fix.

| Class | Count | |
|---|---:|---|
| VERIFIED | 1,148 | external and sourced |
| HOUSE | 1,001 | chrome — labels, controls, empty states, a11y names |
| RESTATED | 282 | Ops prose, each resolved to a sourced row or a repo document |
| MIKE | 75 | his words, his rulings, his markers |
| DERIVED | 19 | computed at render |
| **INVENTION** | **3** | **on the glass, awaiting his ruling** |
| UNDECLARED | 0 | |

Plus 4 generated files bulk-declared at pipeline level, and 33 assets.

**Why VERIFIED is so large, said plainly:** the WAL wing carries the strictest
sourcing apparatus in the building — every card has its own `Verified` /
`Source` / `Accession` row, every artist card ends on a printed Sources line,
every fact in the vault carries a `source:` tag (`wiki` | `bc` | `yt` | `press`
| `vault`). The rules READ that apparatus rather than vouching for it. That
distinction is written into the register's own header and into the backfill's.

**THE INVENTION LIST — 3 strings, one claim, and it is live in the shipped
bundle** (`grep` on `dist/`: confirmed):

> **The unit count.** The glass says **thirty-one and a half** — on the front
> desk's 132pt tally card and in the FAQ. The robots repo's own canon says
> **thirty-one point four**, with a `[PAPA]` note reserving the `.4` as the Pi
> thread: *"no breadcrumbs until a story worthy of it."* `robots.js`'s own
> header lists the inherited claim as *"the 31.4"*, in a paragraph whose rule
> for that round was *"not one new fact."* **Nobody supplied a half.**

Full statement, in the one-question format, as **R1** in
`docs/PROVENANCE_RULINGS-20260804.md`, with R2–R5 for the mirrored plate, the
shirt, the manual render, and the two dead rooms. **Nothing was fixed.**

### What the register exposed on the way past

- **`hr_facts.js` is unreachable and carries 124 strings**, three of them
  flagged **unverified by the file's own BACKLOG comments** since before this
  round. `hr_journal_prompts.js` — 30 more, behind a dead tab. Both are one
  `import` from the glass, so both are declared, with the flag recorded. **R5.**
- **`HrArchive`'s `ALBUMS` is a hand-maintained mirror of a spine that is now
  GENERATED** from the MediaVault export. Nothing checks the two agree.
- **`AuditStrip` in `HrExhibitFlow.jsx` carries mojibake** — `ΓåÆ`, `┬╖`, `Γû╛`
  from a cp1252 round-trip. Dev-only and not mounted, so not on the glass;
  recorded in its rows' notes rather than fixed.
- **The register has 2,089 rows for 2,528 occurrences** — 439 strings appear
  more than once at the same text in the same file. Deliberate: one declaration
  per (file, text), not per occurrence.

---

## P4 — WHAT THIS MAKES IMPOSSIBLE, AND WHAT IT STILL DOES NOT

### Now impossible

- **A new visitor-facing string cannot ship without someone stating where it
  came from.** Not "should not" — the gate exits 1.
- **A declared string cannot be edited and keep its declaration.** The hash
  moves. Proved above.
- **A sourced-class row cannot exist without a source.** MIKE, VERIFIED and
  DERIVED all require `s`.
- **RESTATED cannot be a shrug.** Its reference must resolve, and it may not
  point at its own file.
- **A new image cannot ship without someone looking at it** and saying whether
  it carries text.
- **A count of what is unaccounted-for can no longer drift upward in silence.**
  It is a number in a gate, with a ceiling.

### Still not caught — and each of these is a way the museum could still print
### something untrue tomorrow

- **A false declaration.** Write `MIKE` on a line he never said and the gate
  passes. The register makes the claim *reviewable in one place*; it does not
  make it *true*. This is the single largest hole and there is no version of
  this mechanism that closes it.
- **A true source that has gone stale.** *"78 songs"*, *"Sixteen releases"*,
  view counts — all correctly cited, all able to rot silently.
- **Text painted into a NEW image, declared falsely.** The asset gate forces the
  declaration; it cannot check it.
- **Meta-copy.** A perfectly-sourced line whose subject is the making of the
  museum passes cleanly. Doctrine 11 is still the only thing standing there.
- **Anything outside `src/` and `index.html`** — the worker's D1 content, MV's
  own records, the robots repo.
- **A wrong rule in the sweep itself.** If an exclusion is over-broad, the
  strings it swallows never reach the register. `--rules` and `--rule-sample`
  exist so this is auditable by reading; nothing makes it automatic.

**The honest summary: this converts "did anyone check?" from a question nobody
can answer into a question with a file that answers it. It does not convert
"is it true?" into a machine check, and it must never be described as if it did.**

---

## Gates

| Gate | Result |
|---|---|
| `npm run lint` | **11 err / 9 warn — HEAD baseline, zero new** (three warnings introduced by the new files, all fixed properly, not suppressed) |
| `npm run build` | **green, 70 modules** — unchanged; this round touched no rendered source |
| `npm run provenance:gate` | **PASS**, exit 0 — 0 undeclared, 0 unresolved, 0 undeclared assets |
| Gate-fails-when-it-should | **2/2**, both reverted (table above) |
| Routes | **11/11 → 200**, including `/money` and an unmatched path |
| Desktop 1440×900 | `scrollWidth == clientWidth` on all 10 routes, **zero horizontal scroll** |
| Genuine 390×740 iframe | **zero page-level horizontal scroll on all 10 routes**; the only inner scrollers are `.cf-wrap`, the coverflow, which is one by design |
| Console | **zero errors** across the lap |

**Named honestly:** the lap was DOM measurement on the built bundle via
`wrangler dev`, not screenshots — the same load-bearing verification as v45–v47.
Screenshots were used for one thing only, and it was the thing they are for:
**looking at the 33 images**, which is how R2 and R3 were found.

**Rendered source changed: none.** `git diff` before commit was `package.json`
only — two script lines. Everything else this round is additive.

---

## Files

| Path | |
|---|---|
| `tools/provenance-sweep.mjs` | the boundary sweep + the gate |
| `provenance/register.json` | 2,089 rows |
| `provenance/assets.json` | 33 images, 18 carrying text |
| `provenance/README.md` | the model, and §4 What this cannot see |
| `provenance/backfill-20260804.mjs` | the one-shot classification, kept as the audit record. **Must not be re-run to absorb new content** — its rules would swallow it silently. |
| `provenance/assets-declare.mjs` | how the 33 declarations were made |
| `docs/PROVENANCE_RULINGS-20260804.md` | R1–R5, for Mike |
| `package.json` | `provenance`, `provenance:gate` |
