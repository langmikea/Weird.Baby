# PROVENANCE — every visitor-facing string carries its origin

**Standing mechanism, built 2026-08-04. Read this before treating a PASS as
proof that nothing on the glass is invented.**

```
npm run provenance          # the report
npm run provenance:gate     # the packet gate — exits 1 on failure
```

---

## 1. Why this exists — the problem it was built for

Doctrine 11 (the Law of the Visible Line) and Doctrine 12 (Ops Does Not Invent
Content) are **rules**, and a rule only catches what a reader thinks to look at.

- *"436 records, kept since January 2024"* **passed Doctrine 11 cleanly.** Its
  subject is the collection, not the making of the museum. It was invented. It
  survived four rounds of review because it was plausible.
- Then twenty-seven meta strings were found. Then ten more. Then a wireframe
  with four room names **painted into a JPEG**.

Every sweep found the next generation, because every sweep was **textual**: it
searched for phrasings someone had already learned to distrust. The structural
cause is not any of those strings. It is that **a string could enter this
codebase and nothing at the boundary asked where it came from.**

This is the boundary asking.

---

## 2. The model

Every visitor-facing string in the authored source is enumerated and must be
**accounted for** in `register.json` with an origin class.

| Class | Means | Requires |
|---|---|---|
| **MIKE** | Supplied by the operator — his words, his facts, his rulings. | `s` — where his supply is on record (a doc, a quoted ruling in a file header). |
| **VERIFIED** | External and sourced. | `s` — the citation. |
| **DERIVED** | Machine-computed from real data at read time — counts, dates, states. | `s` — the computation. |
| **HOUSE** | Functional UI chrome: button labels, nav, form fields, separators, empty states. Not content. | — |
| **RESTATED** | Ops prose that adds no specific. | `r` — must **resolve** (below). |
| **INVENTION** | No origin found. Not an origin class: a holding pen, capped, awaiting Mike's ruling. | `n` — what is wrong and what he is being asked. |

**Anything that fits none of these cannot exist.** A string with no row fails
the gate.

### RESTATED is the fifth class and Mike's brief named four

His four are *origins*. A museum also prints Ops-written connective prose that
originates nothing — a lead sentence introducing facts sourced two lines below
it, an answer rephrasing a charter clause. Calling that MIKE is false; the
sentence is not his. Calling it INVENTION is also false, and worse — it would
bury the real inventions under hundreds of rows of ordinary editorial and train
everyone to skim the list.

**So the class has teeth.** `r` must resolve to one of:

1. a **register key** that carries a real origin (MIKE or VERIFIED) — the
   strongest form, because the gate re-checks it every run; or
2. a **repo path that exists and is not the file the string itself lives in.**

That second exclusion is the whole point. *"This sentence restates its own
file"* resolves to nothing, and it is exactly the shape
*"436 records, kept since January 2024"* would have taken. **The line would have
had nothing to put in `r`, and would have landed in INVENTION.**

The backfill's `@face` mechanism goes further for the data files: it resolves a
RESTATED row to **the sourced rows standing on the same face** — the tombstone,
the plate captions, the register lines that carry a citation. Prose on a face
with no sourced row on it is resting on nothing, and falls to INVENTION.

### The hash is the load-bearing part

A row is keyed by `sha256(file + " " + exact string)`, truncated to 16 hex.
**Edit the string and the key changes**, so the old declaration no longer covers
it and the gate fails until someone re-declares. You cannot quietly edit a
sourced line into an invented one. Proven on 2026-08-04: adding
*"436 records, kept since January 2024"* to the booth's foot, and separately
appending *", since 2019"* to an existing sourced answer, both failed the gate.

---

## 3. What is on the boundary, and what is looked away from

**The extraction is default-DENY.** Every string in authored source is content
until a **named, counted** structural rule proves it is machinery. The inversion
is deliberate: a heuristic that decides what to LOOK AT reproduces the failure
this exists to fix. The heuristics only decide what to look **away** from, and
every look-away is counted:

```
npm run provenance -- --rules                     # hit counts per rule
npm run provenance -- --rule-sample=<rule-name>   # what a rule swallowed
```

An over-broad rule shows up as a suspiciously large number rather than as
silence. Current exclusions: whitespace, module specifiers, property keys,
non-text JSX attributes, inline-style values, machinery calls, comparison
operands, identifier/slug values, taxonomy tags, asset paths, URLs, colours and
units, CSS selectors, SQL, HTTP protocol values.

Also swept, because a JS sweep would miss them: **CSS `content:` values** and
**`index.html`'s title and meta tags**.

**Generated files** (`hunter_root.json`, `hunter_root.facts.json`,
`vocabulary.json`, `era-buckets.json`) are declared **in bulk at file level**,
naming the pipeline. Re-hashing ~1,900 rows on every export would produce a diff
nobody reads; the claim being made is about the pipeline, so the pipeline is
what to review.

---

## 4. WHAT THIS CANNOT SEE

**A mechanism that overstates its coverage is worse than none.** These are the
holes, stated plainly.

1. **It cannot verify that a declaration is true.** Nothing can. `MIKE` on a row
   is a claim by whoever wrote the row, reviewable by reading it, not provable
   by a machine. The backfill records **the provenance this repository already
   states** — a fact's own `source:` tag, a card's own `Verified` row, an
   accession number, a quoted ruling in a file header. It did **not**
   independently re-verify those sources.

2. **It cannot read text inside an image.** This is the `/hr/home` failure and
   it is structural. **Compensating check: `assets.json`** — every referenced
   image is declared with `textInImage`, a `text` field saying what it says, and
   an `inspected` field saying how the claim was made. 33 assets declared on
   2026-08-04, **18 of them carry text**. That inspection is a human looking at
   a picture; nothing automates it, and a NEW image will fail the gate until
   somebody looks at it and says.

3. **It cannot detect a sourced number going stale.** *"78 songs on file in the
   museum's own vault"* is a count over MediaVault, correctly cited, and nothing
   here notices the day it stops being 78.

4. **It cannot see text assembled at runtime.** Template frames are captured as
   `"{} of {} in view"`; the values are not, and cannot be.

5. **It cannot see visitor-supplied text** — the D1 guest book, journal entries.

6. **It cannot see reachability as an excuse.** It reports which modules
   `src/main.jsx` does not reach, but still requires them declared — an
   unimported file is one `import` line from the glass.

7. **It does not replace Doctrine 11.** Provenance catches a line whose CONTENT
   was made up. It does not catch a line whose subject is the making of the
   museum. The Portal's *"held — one entry state (C3)"* had a real origin and
   was still meta. **The two mechanisms are complementary and both are required.**

---

## 5. Adding content

1. Write it.
2. `npm run provenance:gate` — it fails, naming your string as UNDECLARED.
3. `npm run provenance -- --emit` writes stubs to `provenance/_undeclared.json`.
4. Fill in `c`, and `s` or `r`. Move the rows into `register.json`.
5. Gate passes.

**Do not re-run `backfill-20260804.mjs`.** It is the record of how the register
was first made; its rules would silently swallow anything new, and the boundary
would stop being a boundary. New content gets a row written for it, one row at a
time, deliberately — that moment of writing it is the mechanism.

`--prune` drops rows whose string is no longer in the source.
