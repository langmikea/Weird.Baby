# JOB 2 — THE APPROVAL MARK
2026-08-13 · WRITE · gates green.

---

## WHAT YOU NEED FROM ME

**Eleven pages are waiting for your signature and none of them can get one from
Ops.** Run `npm run approve` to see the list; `npm run approve -- /booth` to
sign one.

**Nothing is blocked tonight.** Two things worth knowing before you start
walking pages:

1. **Four files drop all eleven approvals at once** — `index.css`, `main.jsx`,
   `museum-tokens.css`, `sheet.css`. If a palette change is coming, do it
   *before* you start signing, not after. §2e has the numbers.
2. **`/p/:id` cannot be fingerprinted** and says so rather than pretending. Its
   component is declared inside `App.jsx`. One small move fixes it; it is on the
   list under WHAT NEEDS MIKE.

---

# 2a — WHAT WAS BUILT

The house mark, 34px, top-right corner, at 55% opacity, on a page you have
personally approved as it stands.

**Present = you approved this page and nothing it shows has changed since.
Absent = you have not, or it has.**

| file | what |
|---|---|
| `reveal/approval.mjs` | **the declaration** — routes, file graph, fingerprints. One reader for the CLI, the build and any future gate. |
| `tools/approve.mjs` | `npm run approve` — the walk-list, the signing, `--why`, `--blast`, `--check`. |
| `provenance/approvals.json` | **your signatures.** A file in the repo. |
| `src/components/ApprovalMark.jsx` | the mark. |
| `vite.config.js` | `__WB_APPROVALS__` — the map, and the reason it cannot ship. |
| `tools/approval-proof.mjs` | `npm run approval:proof` — the launch proof. |

**The corner was chosen by looking, not by taste.** It sat bottom-right for one
build and landed directly on top of `.wb-footer`, which already draws
"WB / Weird.Baby" — two house marks in one corner, the approval one covering the
museum's own. I probed all four corners of the Lobby: top-left and bottom-left
are the directory panel, bottom-right is that footer, **top-right holds nothing
but layout containers**.

---

# 2b — DEVELOPMENT ONLY, PROVED AGAINST A LAUNCH BUILD

**It is structural, not careful.** `__WB_APPROVALS__` is a build-time `define`.
At LAUNCH it is substituted with the literal `null`, so the component's first
line becomes `if (!null) return null;` — a constant condition rollup folds,
taking the component, its styles and the whole map out of the bundle. **There is
no runtime flag to forget and no stage to check.**

`npm run approval:proof` builds **both** stages and compares:

```
building DEVELOPMENT…   8 js files, 655 KB
building LAUNCH…        8 js files, 654 KB

  ok    the mark's tooltip       in development, absent at launch
  ok    the mark's z-index       in development, absent at launch
  ok    a signature from the map in development, absent at launch
  ok    the identifier "ApprovalMark" is not in the launch bundle
        (minification renames, so this is supporting evidence, not the proof)

PROVED — every tell of the approval mark is present in the development
bundle and absent from the launch bundle. It cannot reach a visitor.
```

**It compares both stages on purpose.** "Absent from the launch bundle" is only
evidence if the same term is *present* in the development one — otherwise a typo
in the search reads as a pass. That WEAK branch fired three times while I was
writing it, and every time the test was wrong rather than the build:

- **`WeirdBaby_PhotoID.png` reported FAIL.** It is in the launch bundle and
  always should be — it is the house mark, on the Lobby, the robots front desk
  and the /wb album cover (M63 names all three). Searching for it tested whether
  the museum has a logo.
- **`__WB_APPROVALS__` reported WEAK — in neither bundle.** Correct: `define`
  *substitutes* the identifier, so the name never survives to any output.
- **`2147483000` and `"/booth":"2026-08-13"` reported WEAK.** The minifier emits
  `zIndex:2147483e3` and turns string *values* into template literals while
  keeping object *keys* quoted. I read the bundle instead of guessing a fourth
  time; the tells are regexes now, and the WEAK branch means a term that stops
  matching reports INCONCLUSIVE rather than passing.

---

# 2c — THE APPROVAL LAW, AND HOW IT DROPS

**A fingerprint, not a flag.** You sign a hash of everything the page shows. The
moment the page shows something else the hash is different and your signature
matches nothing — **it is not revoked, it stops applying.** Nothing has to
remember to drop it.

## The three parts of "what a page shows"

| part | source | what moves it |
|---|---|---|
| **the words** | `sweep()` in `provenance-sweep.mjs` — the extractor the provenance gate itself uses | any visitor-facing string added, removed or edited |
| **the look** | every reachable `.css`, comments stripped and whitespace normalised | a colour, a size, a rule |
| **the pictures** | every asset-table row whose `usedBy` names a reachable file, by `sha256` | a photograph replaced at the same path |

## Comments are deliberately excluded, and that is the whole difference

This repository is more than half comment by character in places. A fingerprint
over raw file bytes would drop every approval in the building every time somebody
explained something, and **a mark that is always absent is a mark nobody reads.**

## Proved by breaking it

```
=== BASELINE ===
  ● /booth   approved    32 strings
  ● /        approved   106 strings

=== 1. change a COLOUR TOKEN in museum-tokens.css (--wb-bg) ===
  ○ /booth   dropped — then the look moved
  ○ /        dropped — then the look moved

=== 2. add a COMMENT to museum-tokens.css ===
  ● /booth   approved          ← correctly drops NOTHING
  ● /        approved

=== 3. change a VISITOR-FACING STRING in house-copy.js ===
  ○ /booth   dropped — then the words moved
  ● /        approved          ← correct: `/` does not import that file

=== RESTORED === (proved by sha256, both files identical)
```

**Test 3 is the one worth reading twice.** `/booth` dropped and `/` did not,
because `/` never imports `house-copy.js`. That is 2d working: approval is per
page, and a page unaffected by an edit keeps its signature.

## Two real defects the harness caught, both in my mechanism

**1. The first version read `register.json` and nothing dropped at all.** The
register is a *generated* file; it still held the old string's hash against the
same filename, so the word-set was identical and the fingerprint never moved.
The register would eventually catch up — the gate refuses undeclared strings —
but *"it drops once somebody regenerates a different file"* is not your law.
**It reads `sweep()` now**, the same extractor the gate uses, so the two can
never disagree about what a visitor-facing string is.

**2. The shell walk reached `App.jsx` and swallowed the museum.** `App.jsx`
imports every route component, so every page came out with the same 2,292
strings and all eleven would have dropped together on any edit anywhere. Only
`main.jsx`'s non-App imports are walked now.

**And a third that was the test's fault**: my first "change a string" test edited
`"How do I get in touch?"` in `house-copy.js` — which turned out to be a phrase
inside a *code comment*, explaining that line's deletion from the glass on
2026-08-11. It correctly dropped nothing. The test now takes its target from
`sweep()` itself.

## One limitation, stated rather than hidden

**CSS is not scoped by imports in this build.** Vite emits one stylesheet, so
every rule in `src/` is live on every page whatever the import graph says —
`Exhibit.css`'s own header records it. Measured: `/booth` reaches
`museum-tokens.css` through no chain at all and wears its colours anyway.

So `src/styles/` (the tokens and the shared sheet) is treated as shell and is in
every page's set. **What this still does not model:** a rule in `GiftShop.css` is
also technically live on `/booth` and will not drop it. That is a deliberate
floor — pricing every page-specific stylesheet into every page would drop all
eleven approvals on any CSS edit anywhere.

---

# 2d — PER PAGE, NOT PER FILE

A page is a **route in `App.jsx`**, parsed off the AST rather than listed —
a hand-kept copy would drift, and the first thing it would do is silently stop
covering a page you added.

What it shows is every source file that route can reach: its component,
everything that component imports, transitively, plus the shell.

**Measured, the sets are properly distinct** — `/booth` reaches 12 files and 32
strings; `/wal` reaches 1,388 strings. They are not the same page and they do
not share a fate.

---

# 2e — WHEN A SHARED THING CHANGES

**Several approvals dropping at once is correct. Here is how many, so it is not
a surprise.**

| file | pages it drops |
|---|---:|
| `src/index.css` | **11 — all of them** |
| `src/main.jsx` | **11** |
| `src/styles/museum-tokens.css` | **11** |
| `src/styles/sheet.css` | **11** |
| `src/lib/use-arrival.js` | 10 |
| `src/components/MuseumBar.css` | 8 |
| `src/components/MuseumBar.jsx` | 8 |
| `src/lib/placement.js` · `use-room.js` · `visitor-prose.js` | 7 |

Distribution across all 70 files that reach a page:

```
  11 pages  <-   4 files      ← the shared shell and the palette
  10 pages  <-   1 file
   8 pages  <-   2 files
   7 pages  <-   3 files
   6 pages  <-  13 files
   5 pages  <-   8 files
   3 pages  <-   3 files
   2 pages  <-  12 files
   1 page   <-  24 files
```

**The median edit drops two pages.** A third of the files (24 of 70) drop
exactly one. **Four files drop everything** — and those four are the ones to
change *before* a signing session, never after.

`npm run approve -- --blast src/components/MuseumBar.jsx` answers this for any
file before you touch it.

---

# 2f — HOW YOU APPROVE

```
npm run approve                  the list: what is signed, what dropped, what never was
npm run approve -- /wal          sign that page as it stands now
npm run approve -- /wal --why    what moved since you last signed it
npm run approve -- --check       exit 1 if any page is unapproved (for a gate)
```

**It survives a cache clear because it was never in a cache.**
`provenance/approvals.json` is a file in the repo, committed, one row per page
holding the fingerprint as it stood, the date, and `by: "Mike"`.

**`--why` is the part that makes a dropped approval actionable** — it names which
of the three parts moved and shows both hashes, so "why has this gone" takes five
seconds instead of a hunt.

**Ops must never run the signing form**, and that rule is written into the tool's
own mouth rather than left in a document. **I cleared the two test signatures I
made while proving the mechanism** — they were Ops' signatures on your pages,
which is exactly the thing this is built to prevent. The file ships empty.

---

# 2g — THE PAGES, AND THEIR STATE TONIGHT

```
  · /                  never      106 strings
  · /admin             never       63 strings
  · /hr                never      672 strings
  · /hr/archive        never      135 strings
  · /wb                never      245 strings
  · /booth             never       32 strings
  · /foundation        never      345 strings
  · /shop              never    1,191 strings
  · /robots            never      507 strings
  · /robots/record     never      507 strings
  · /wal               never    1,388 strings

    /money             n/a  — a redirect; it shows nothing of its own
    /p/:id             n/a  — PresetLanding is declared inside App.jsx
    *                  n/a  — the catch-all; it renders the Lobby, which is `/`

  0 approved   0 dropped   11 never signed
```

**Suggested order, cheapest first:** `/booth` (32) · `/admin` (63) · `/` (106) ·
`/hr/archive` (135) · `/wb` (245) · `/foundation` (345) · `/robots` and
`/robots/record` (507 each, same component) · `/hr` (672) · `/shop` (1,191) ·
`/wal` (1,388).

**`/robots` and `/robots/record` are the same component with a different tab
open**, so they carry identical fingerprints — but they are two addresses a
visitor can arrive at and they get two signatures.

---

## WHAT I COULD NOT DETERMINE

- **Whether `/hr` and `/robots` should be on the opening-day list at all.**
  `/hr` is password-held in every stage and `/robots` does not open until Record
  001 posts on 17 August. Both are pages a visitor can reach on some day, so
  both are on the list; whether they belong in the opening-day walk is yours.
- **Whether a page can be approved when its own content is stage-dependent.**
  `/robots` renders the Lobby before 17 August and the wing after. The
  fingerprint is computed from the source and does not vary by stage, so one
  signature covers both — which is probably right and is not something I ruled.
- **Whether the asset half is complete.** Only 44 of 385 asset-table rows carry
  a `usedBy`, so a picture used by a file that has never been scanned into that
  field will not move a fingerprint. That is an asset-table gap, not an approval
  one, and it is in Job 4.

## WHAT NEEDS MIKE

1. **Walk the eleven pages and sign them.** `npm run approve` is the list.
2. **`/p/:id` needs `PresetLanding` moved out of `App.jsx`** into its own file —
   about four lines of cut and paste — and it joins the list. Until then it is
   the one route nobody can approve. **Say the word and it is a packet.**
3. **Do palette work before signing, not after.** Four files drop all eleven.
4. **Whether `npm run approve -- --check` should join the gate run.** It exists
   and is not wired in: making it a gate would fail every packet until all
   eleven are signed, which is a decision about pace and is yours.
