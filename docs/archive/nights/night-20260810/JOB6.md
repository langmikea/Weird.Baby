# JOB 6 — THE LEDGER MACHINERY FOR THE MANUAL'S PAGES

Read-only reconnaissance, 2026-08-10. Nothing was created, modified, moved, renamed or
deleted in either repo. **No script was executed in any mode** — `reveal/ledger-declare.mjs`,
`tools/reveal-ledger.mjs` and `reveal/day.mjs` were READ, never run. Every count below was
obtained by reading files, not by running the instruments that report them.

---

## THE SHORT VERSION

**WHAT NEEDS MIKE (short)**

1. **Does the four-stage `prod` arc survive the clean-PNG ruling?** If the manual is revealed
   as the clean PNGs — no printing, no shooting — then `printed` and `photographed` are stages
   nothing will ever pass through. §6d lays out the code evidence on both sides and stops there.
   **This is Mike's ruling; Ops has not picked and must not.**
2. **A `prod: "placed"` manual page CANNOT PASS THE GATE TODAY, and it is not the manual's
   fault.** Manual pages are class PACKAGE, PACKAGE has `week: null` because nobody has named
   the four Fridays, and transfer check (b) refuses any REVEALED row with no named arrival week.
   The vessel's own self-test *expects* that fault (`tools/reveal-ledger.mjs:404–410`). So the
   first page ever placed fails `reveal:check` until either the PACKAGE weeks are named (open
   register row **T-B**) or manual pages are reclassified. **A clean PNG that nobody printed or
   shipped may not be PACKAGE material at all — that reclassification is a ruling, not a fix.**
3. **Is a clean structure-render page a picture the pull-back governs?** If a page PNG is copied
   into `public/robots/…` it becomes governed material and must be named in a Record entry's
   `assets` or the build fails. If it is treated as the museum's own lettering it would need a
   `SIGNAGE` row. Neither is decided anywhere in the code.

**WHAT I COULD NOT DETERMINE (short)**

- Whether the 61 PNGs in `robots/mgk-viiip/manual/structure/pages/` ARE the "clean PNGs" of the
  ruling. Their asset-table rows say `role: "source"`, and the museum's own prose calls them the
  STRUCTURE ISSUE — *structure and arrangement only, text not supplied*. Job 4 is reading the
  document; I only counted and identified them.
- Whether `reveal:check` passes today. I did not run it (read-only).
- What page count the manual is *meant* to be. `manualPages()` returns the **maximum page number
  found**, not a file count; the two agree today at 61 and would silently disagree if a page in
  the middle were deleted.

---

## LEAD: WHAT IS ACTUALLY TRUE OF THE MACHINERY TODAY

- The ledger has **167 rows** (`reveal/ledger.json`), and **`"prod"` appears 167 times, every
  one of them `null`**. The brief's claim is confirmed exactly: no page has ever been called for.
- **`calledBy` is `[]` on all 167 rows.** Not one row in the table has ever named a caller.
- **Zero `doc.manual.page.NN` rows exist.** The vessel has never authored a row.
- The manual has **61 source renders**, `page-01.png` … `page-61.png`. `manualPages()` returns
  **61**.
- All **61 of those PNGs already have rows in `provenance/asset-table.json`** — uid-keyed,
  `repo: "robots"`, `ref: null`, `role: "source"`, `usedBy: []`, `verdict: null`, `bucket: null`.
  They are catalogued as FILES. They are not catalogued as REVEALABLE THINGS.
- Nothing in `src/` can see `prod` or `calledBy` at all: `reveal/public-view.mjs` strips every
  ledger row down to `{id, build, state, shown}` before the bundle sees it
  (`PUBLIC_FIELDS`, `public-view.mjs:42`).
- Stale prose finding, minor: `reveal/public-view.mjs:7`, `reveal/day.mjs:39` and `day.mjs:102`
  all say the ledger is **162 rows**. It is 167.

---

## 6a. THE CODE THAT AUTHORS MANUAL-PAGE ROWS

### The authoring block — `reveal/ledger-declare.mjs:434–470`

The block that constructs manual-page rows is §7b. It is a comment, a three-line constructor,
and a comment saying there are no calls.

```js
/* ═════════ 7b. THE MANUAL'S PAGES — THE VESSEL, EMPTY [R3 2026-08-05] ══════
   MIKE'S RULING, and it changes what this is FOR: the manual ARRIVED IN PIECES,
   so the museum needs only the specific pages the story reaches for — printed,
   marked, photographed, one at a time, as Record entries call for them.

   THAT IS A SUPPLY LINE, NOT A SCANNING PROJECT, and the difference is the
   whole design. `doc.manual.plates` above is one row for the WHOLE SET and can
   only ever read NOT_BUILT until all of it is done; every page but one would
   read exactly the same as none. A page that carries its own production stage,
   and names the entry that asked for it, can be finished on its own.
   [G1 2026-08-05] That sentence used to say "a set of 24" and "twenty-three
   photographed pages and one missing". Both numbers came from a document that
   no longer exists; the set-level row's argument never depended on its size.

   THE VESSEL IS `manualPageRow()` IN reveal/schema.mjs. It refuses a page the
   manual does not have, derives `build` from the production stage so a row
   cannot claim a state the world is not in, and validates `calledBy` against
   real `record.NNN` rows so nothing can be called for by an entry that does not
   exist.

   NOTHING IS POPULATED, BY INSTRUCTION: the story has not asked for a page yet,
   and a page row written before an entry calls for it would be Ops deciding
   which page the story reaches for. When one is called for, it is one line:

       MANUAL_PAGE(7, { prod: "needed", calledBy: ["record.013"] })

   THE VESSEL IS PROVED WITHOUT SHIPPING A ROW. `npm run reveal:check` builds a
   specimen at each of the four stages, runs it through the same validator this
   file uses, and asserts the derived build/state/reach — then throws it away.
   An untested container is the shape of C7 (the Record's inline doors, built
   at v45, still exercised by nothing); this one is exercised on the day it is
   written and no visitor is shown a page to achieve it. */
const MANUAL_PAGE = (page, opts) => {
  const { id, name, cls, where, build, reach, state, extra } = manualPageRow(page, opts);
  R(id, name, cls, where, build, reach, state, extra);
};
/* (no calls — see above) */
```

### The row constructor it feeds — `reveal/ledger-declare.mjs:111–125`

```js
const ROWS = [];
/* R(id, name, cls, where, build, reach, state, extra) */
function R(id, name, cls, where, build, reach, state, extra = {}) {
  ROWS.push({
    id, name, cls, where, build, reach, state,
    when: extra.when ?? null,
    deps: extra.deps || [],
    arc: extra.arc ?? null,
    shown: extra.shown === true,
    assets: resolve(extra.assets),
    prod: extra.prod ?? null,
    calledBy: extra.calledBy || [],
    note: extra.note || "",
  });
}
```

### The vessel itself — `reveal/schema.mjs:140–183`

(Included because "the block that constructs them" is really two halves: `MANUAL_PAGE` above is
three lines of glue; this is where a page row is actually built.)

```js
export function manualPageRow(page, {
  prod = "needed", calledBy = [], assets = [], when = null, note = "", deps,
} = {}) {
  const where = manualSourceState();
  if (where === "no-source")
    throw new Error(
      `manualPageRow: the manual's source renders are gone — ${MANUAL_SRC} does not ` +
      "exist in the robots repo. This is not a missing page, it is a moved tree; " +
      "see manualSourceState() above before repointing anything.");
  const n = manualPages();
  if (!Number.isInteger(page) || page < 1 || (n && page > n))
    throw new Error(`manualPageRow: page ${page} is not one of the manual's ${n} pages.`);
  if (!PROD.includes(prod))
    throw new Error(`manualPageRow: unknown production stage "${prod}" — one of ${PROD.join(" · ")}.`);
  const src = manualSourcePath(page);
  if (where === "ok" && !fs.existsSync(path.join(ROBOTS, src)))
    throw new Error(`manualPageRow: page ${page} has no source render at ${src}.`);

  const nn = String(page).padStart(2, "0");
  return {
    id: `doc.manual.page.${nn}`,
    name: `The Manual, page ${nn}.`,
    cls: "document",
    where: prod === "placed"
      ? "src/data/artists/robots.js face.plates"
      : `the physical world — printed from weird-baby-robots/${src}`,
    build: BUILD_FOR_PROD[prod],
    reach: prod === "placed" ? "a frame in THE MANUAL's reader, on /robots" : null,
    state: STATE_FOR_PROD[prod],
    extra: {
      when, prod, calledBy, assets, note,
      /* B8's shoot spec is the dependency, stated once here rather than copied
         onto every page: ≥2400px long edge, the whole page including margins,
         reel order = reading order. */
      deps: deps || (prod === "photographed" || prod === "placed"
        ? [] : ["P2 — Mike prints and photographs this page (≥2400px long edge, whole page including margins)"]),
      /* A single page is never named on the glass. The PLATES AS A SET are —
         DOC CONTROL and The Manual's own face both name them — and that promise
         is `doc.manual.plates`, which is where it belongs. A page row claiming
         `shown` would double-count the one promise the museum actually makes. */
      shown: false,
    },
  };
}
```

### BUILD_FOR_PROD and STATE_FOR_PROD — `reveal/schema.mjs:43–57`

```js
export const PROD = ["needed", "printed", "photographed", "placed"];

/* `build` is DERIVED from the production stage rather than authored, because
   the two cannot legally disagree: a page nobody has photographed is not built,
   and a page in `plates` is on the glass. Deriving it means the row cannot be
   written into a state the world is not in. */
export const BUILD_FOR_PROD = {
  needed: "NOT_BUILT",        // the story has asked for it; nothing exists
  printed: "NOT_BUILT",       // paper exists; the museum holds no image
  photographed: "PARTIAL",    // an image exists and is on nobody's wall
  placed: "LIVE",             // it is a frame in the reader
};
export const STATE_FOR_PROD = {
  needed: "HELD", printed: "HELD", photographed: "HELD", placed: "REVEALED",
};
```

---

## 6b. THE VESSEL SELF-TEST

**"Vessel self-test" is not a literal name in the file.** The block is the function
**`vesselFaults()`** in `tools/reveal-ledger.mjs`, introduced by a comment headed
`R3: THE MANUAL-PAGE VESSEL, PROVED WITH NOTHING SHIPPED`. It is called only from `check()`
(line 638), i.e. only by `npm run reveal:check`. The comment is 347–367; the function is
368–480. Both are printed below.

`tools/reveal-ledger.mjs:347–480`

```js
/* ═══ R3: THE MANUAL-PAGE VESSEL, PROVED WITH NOTHING SHIPPED ══════════════
   The vessel is built and deliberately empty — the story has not asked for a
   page. An empty container that nobody has exercised is C7's shape (the
   Record's inline doors, built at v45, exercised by nothing since), so the
   vessel is proved HERE: specimens at all four production stages are built,
   validated against the real table, and thrown away. Nothing is written, and no
   page of the manual is invented to achieve it.

   The negative half matters more than the positive half: a vessel that accepts
   a page the manual does not have, or a caller that does not exist, is not a
   vessel. Each refusal is asserted to actually refuse.

   THE EXPECTED VALUES ARE WRITTEN OUT HERE AS LITERALS, and the first draft of
   this function did not do that — it compared the vessel's output against
   `BUILD_FOR_PROD`, which is the table the vessel derives FROM. That test could
   not fail: corrupting the mapping corrupted the expectation with it, and a
   deliberate break of `photographed → PARTIAL` was run through it and reported
   PASS. A self-test that reads its answer out of the thing under test is not a
   test, and this one was one until it was broken on purpose to find out. The
   stage names are asserted too, so renaming one in schema.mjs surfaces here
   rather than silently reducing the loop's coverage. */
function vesselFaults() {
  const faults = [];

  /* [T1 2026-08-05] THE SOURCE TREE IS CHECKED ONCE, BEFORE ANY SPECIMEN.
     Without this the function threw on its first UNGUARDED specimen and
     `reveal:check` reported a Node stack trace instead of a fault — which is
     exactly what it did, unnoticed, from robots 4cd78ac (16:14) onward. A gate
     that crashes is not a gate: it cannot tell you the one thing it exists to
     tell you. With no renders to point at the specimens cannot run at all, so
     this names the real fault once and stops. */
  if (manualSourceState() === "no-source") {
    faults.push(
      `vessel: the manual's source renders are GONE — ${MANUAL_SRC_DIR} no longer\n` +
      "    exists in the robots repo. This is NOT a missing page; it is the document's\n" +
      "    whole tree having moved out from under this repository, which is what happened\n" +
      "    once before (robots 4cd78ac retired manual/pages under a path museum v55 had\n" +
      "    wired in three hours earlier, and the gate died on a stack trace rather than\n" +
      "    reporting it). Find where the generator now writes its pages and repoint\n" +
      "    MANUAL_SRC in reveal/schema.mjs. THE PAGE COUNT NEEDS NO EDIT — it is derived\n" +
      "    from this directory, by Mike's rule that the manual is as long as the manual\n" +
      "    needs to be.");
    return faults;
  }
  if (!manualPages())
    faults.push(
      `vessel: ${MANUAL_SRC_DIR} exists and holds no page-NN.png at all. The path is\n` +
      "    right and the document is empty, which no ledger row can be written against.");

  /* [G1 2026-08-05] `fault` IS PART OF THE EXPECTATION NOW, AND THAT IS THE
     TRANSFER RULE REACHING THE VESSEL RATHER THAN A DEFECT IN IT. A manual page
     is PACKAGE (transfers.mjs PATTERNS), PACKAGE has no named arrival week until
     T-B is answered, and check (b) says a row with no named arrival may not be
     REVEALED. So a PLACED page — one that is a frame in the reader — cannot
     validate today, and the honest test is to require exactly that one fault
     rather than to exempt the specimen from the rule. The day Mike names the
     four Fridays this expectation flips to null and the vessel is unchanged. */
  const EXPECT = {
    needed: { build: "NOT_BUILT", state: "HELD", reachable: false, fault: null },
    printed: { build: "NOT_BUILT", state: "HELD", reachable: false, fault: null },
    photographed: { build: "PARTIAL", state: "HELD", reachable: false, fault: null },
    placed: { build: "LIVE", state: "REVEALED", reachable: true,
      fault: "has no named arrival week" },
  };
  if (PROD.join(",") !== Object.keys(EXPECT).join(","))
    faults.push(`vessel: the production stages are ${PROD.join(" · ")}, and this test covers ${Object.keys(EXPECT).join(" · ")}.`);
  const flat = spec => ({
    id: spec.id, name: spec.name, cls: spec.cls, where: spec.where,
    build: spec.build, reach: spec.reach, state: spec.state,
    when: spec.extra.when ?? null, deps: spec.extra.deps || [], arc: null,
    shown: spec.extra.shown === true, assets: spec.extra.assets || [],
    prod: spec.extra.prod, calledBy: spec.extra.calledBy || [], note: spec.extra.note || "",
  });

  for (const prod of PROD) {
    const want = EXPECT[prod];
    if (!want) continue;                       // reported above
    let row;
    try {
      row = flat(manualPageRow(7, {
        prod, calledBy: ["record.013"],
        assets: prod === "placed" ? ["/robots/manual/working-copy-p1.png"] : [],
      }));
    } catch (err) {
      faults.push(`vessel: page 7 at "${prod}" would not build — ${err.message}`);
      continue;
    }
    if (row.build !== want.build)
      faults.push(`vessel: "${prod}" derived build ${row.build}, expected ${want.build}`);
    if (row.state !== want.state)
      faults.push(`vessel: "${prod}" derived state ${row.state}, expected ${want.state}`);
    if (Boolean(row.reach) !== want.reachable)
      faults.push(`vessel: "${prod}" reach is ${row.reach} — only a placed page is reachable`);
    const bad = validate([...ROWS, row]).filter(f => f.startsWith(row.id));
    if (!want.fault && bad.length)
      faults.push(`vessel: a valid "${prod}" page fails validation — ${bad[0]}`);
    if (want.fault && !bad.some(f => f.includes(want.fault)))
      faults.push(
        `vessel: a "${prod}" page did NOT fault on "${want.fault}".\n` +
        "    A page in the reader is a photograph of paper somebody is holding, so it is\n" +
        "    PACKAGE, and no package has a named arrival week until T-B is answered.");
    if (want.fault && bad.length > 1)
      faults.push(`vessel: a "${prod}" page faults on more than the arrival week — ${bad.join(" | ")}`);
  }
  /* the transfer class really is reaching the vessel's rows */
  if (validate([...ROWS, flat(manualPageRow(7, {}))])
    .some(f => f.startsWith("doc.manual.page.07") && f.includes("no transfer class")))
    faults.push("vessel: a manual page fell through the transfer table — the PACKAGE pattern is not matching.");

  /* the refusals */
  const refuses = (what, fn) => {
    try { fn(); faults.push(`vessel: it accepted ${what} — that refusal is the point of it.`); }
    catch { /* refused, as it must */ }
  };
  refuses(`page ${manualPages() + 1}, which the manual does not have`,
    () => manualPageRow(manualPages() + 1, {}));
  refuses("page 0", () => manualPageRow(0, {}));
  refuses("an unknown production stage", () => manualPageRow(7, { prod: "scanned" }));

  const called = flat(manualPageRow(7, { calledBy: ["record.999"] }));
  if (!validate([...ROWS, called]).some(f => f.includes("record.999")))
    faults.push("vessel: a page called for by an entry that does not exist passed validation.");

  const placed = flat(manualPageRow(7, { prod: "placed" }));   // no assets
  if (!validate([...ROWS, placed]).some(f => f.startsWith(placed.id)))
    faults.push("vessel: a page placed in the reader with no photograph passed validation.");

  const notAPage = { ...ROWS.find(r => r.id === "doc.manual"), prod: "needed" };
  if (!validate([...ROWS.filter(r => r.id !== "doc.manual"), notAPage])
    .some(f => f.includes("not a manual page")))
    faults.push("vessel: `prod` was accepted on a row that is not a manual page.");

  return faults;
}
```

Note for anyone touching the manual's page set: **the self-test hard-codes page 7.** Delete or
renumber `page-07.png` and `vesselFaults()` reports four "would not build" faults, and the
refusal assertions lose their subject.

---

## 6c. WHAT A MANUAL PAGE ROW MUST CARRY

### The fields, and who demands each

A manual-page row is not authored field by field — `manualPageRow()` builds all of it and
`R()` fills the rest. Only **five** things are ever passed in by a caller. Everything else is
derived or defaulted.

| field | required? | type / shape | who sets it | who demands it |
|---|---|---|---|---|
| `page` (the argument, not a field) | **REQUIRED** | integer `1 … manualPages()` (today 1–61) | caller | `manualPageRow` throws otherwise (`schema.mjs:150–151`) |
| `id` | derived | `doc.manual.page.NN`, NN zero-padded to 2 (`schema.mjs:158,160`) | vessel | `validate` uses the prefix as the *definition* of "is a manual page" (`schema.mjs:233,239,250`) |
| `name` | derived | `The Manual, page NN.` | vessel | nothing validates it; `recordProseFaults()` scans it for Record prose (`reveal-ledger.mjs:290`) |
| `cls` | derived | `"document"` | vessel | `--cards` groups by it; nothing validates the value |
| `where` | derived | `placed` → `"src/data/artists/robots.js face.plates"`; otherwise `"the physical world — printed from weird-baby-robots/<src>"` (`schema.mjs:163–165`) | vessel | `reachability.mjs` reads `where` to decide whether a built+held row is behind a door |
| `build` | **DERIVED, never authored** | one of `LIVE PARTIAL STUB NOT_BUILT` | `BUILD_FOR_PROD[prod]` | `validate` faults `bad build` (`schema.mjs:209`) and faults any disagreement with `prod` (`schema.mjs:235–236`) |
| `reach` | derived | `placed` → `"a frame in THE MANUAL's reader, on /robots"`, else `null` | vessel | `validate`: REVEALED with no reach faults (`schema.mjs:213`); RETIRED with a reach faults (215) |
| `state` | **DERIVED** | `HELD` for the first three, `REVEALED` for `placed` | `STATE_FOR_PROD[prod]` | `validate` (`schema.mjs:210`), `transferFaults` check (b), `reachabilityFaults` |
| `prod` | **REQUIRED for any `doc.manual.page.*` row** | exactly one of `"needed" "printed" "photographed" "placed"` | caller (defaults to `"needed"`) | `validate:231–241` — a manual page with `prod: null` faults; a non-manual-page row WITH `prod` faults |
| `calledBy` | optional; defaults `[]` | array of strings matching `/^record\.\d+$/` **and** present as row ids | caller | `validate:256–261` |
| `assets` | optional; **REQUIRED when `prod === "placed"`** | array of public refs → resolved to asset-table `uid`s by `resolve()` in the declaration | caller | `validate:237–238` ("placed in the reader with no asset"); `check()` re-verifies every uid resolves (`reveal-ledger.mjs:645–647`) |
| `when` | optional; defaults `null` | number (story week) or null | caller | `transferFaults` check (c): `when` may not precede the class's arrival week |
| `deps` | optional | array of strings; **auto-filled** for `needed`/`printed` with the P2 shoot spec, `[]` for `photographed`/`placed` (`schema.mjs:174–175`) | vessel unless overridden | `--audit` chains; nothing faults on it |
| `note` | optional; `""` | string | caller | scanned for Record prose and for `{ }` Ops notes |
| `shown` | **forced `false`** (`schema.mjs:180`) | boolean | vessel | `--audit` promised/quiet split |
| `arc` | never set by the vessel → `null` via `R()` | `arrived understood partial online` or null | — | `validate:211` |
| `transfer` / `transferWeek` | stamped after the fact | `"PACKAGE"` / `null` | `applyTransfers()` via the `PATTERNS` regex `/^doc\.manual\.page\.\d+$/` (`transfers.mjs:414–417`) | `transferFaults` (a)(b)(c) |
| any of `RECORD_FIELDS` | **FORBIDDEN** | — | — | `validate:226–228` — `headline dateline sections section lead line tomb tombstone body still stillCaption title evidence` are refused by name |

**Fields demanded by one reader and ignored by another** — three worth naming:

- **`calledBy` is validated and never displayed.** `validate()` (`schema.mjs:256–261`) is its
  only reader in the whole tree. `--cards` prints `prod` (`reveal-ledger.mjs:259`) and does not
  print `calledBy`; `report()` does not count it; `public-view.mjs` strips it before the bundle.
  It is a write-only field with a gate on it.
- **`prod` is invisible to the museum.** `PUBLIC_FIELDS = ["id","build","state","shown"]`
  (`public-view.mjs:42`) — `src/lib/reveal.js` cannot read `prod` even if a page ships.
- **`shown` is forced false by the vessel and is the field `--audit` uses to decide whether a
  gap is a promise.** So no individual page will ever appear in "PROMISED BUT NOT BUILT"; only
  the set-level `doc.manual.plates` row carries that promise.

### What `calledBy` is validated AGAINST

**Source of truth:** the `record.NNN` rows *in the same ledger row-set being validated* — which
are themselves derived, at `ledger-declare.mjs:541–565`, from `entries()` in
`reveal/record-entries.mjs`, which parses `RECORD_SOURCE` (`src/data/artists/robots.js`). It is
NOT validated against the Record data directly; it is validated against the ledger's own derived
mirror of it. A second check, `recordParityFaults()` (`reveal-ledger.mjs:335–345`), separately
proves that mirror and the Record are the same set.

**Exact function:** `validate()` in `reveal/schema.mjs`, lines 256–261:

```js
    for (const c of (r.calledBy || [])) {
      if (!/^record\.\d+$/.test(c))
        bad(r.id, `calledBy "${c}" is not a record entry id`);
      else if (!ids.has(c))
        bad(r.id, `calledBy "${c}" names a Record entry that does not exist`);
    }
```

`ids` is `new Set(rows.map(r => r.id))` (`schema.mjs:201`).

**On a miss:** a fault string is pushed. Two consequences, both hard failures:

- from `reveal/ledger-declare.mjs:896–901` — `THE DECLARATION IS INVALID — n fault(s)` and
  **`process.exit(1)`**; `reveal/ledger.json` is not written.
- from `tools/reveal-ledger.mjs check()` (630–653) — `CHECK: FAIL — n fault(s)` and
  **`process.exit(1)`**, i.e. the packet gate refuses.

**A live trap in that regex:** ids are zero-padded (`record.013`, `ledger-declare.mjs:555`), but
the regex `/^record\.\d+$/` accepts `record.13`. `record.13` passes the shape test and then
fails the existence test with the *wrong* message — "names a Record entry that does not exist"
when the entry exists and the id was mistyped.

### `prod: "needed"` versus `prod: "placed"` — traced all the way through

**`prod: "needed"`**

| stage of the pipeline | what happens |
|---|---|
| `manualPageRow` | `build: "NOT_BUILT"`, `state: "HELD"`, `reach: null`, `where: "the physical world — printed from weird-baby-robots/robots/mgk-viiip/manual/structure/pages/page-NN.png"`, `deps: ["P2 — Mike prints and photographs this page …"]`, `shown: false` |
| `applyTransfers` | `transfer: "PACKAGE"`, `transferWeek: null` (pattern, `transfers.mjs:414`) |
| `validate` | passes. NOT_BUILT + HELD is coherent; check (b) only bites on REVEALED |
| `reveal:check` | **PASSES** |
| renders? | **NO.** Nothing in `src/` reads it. `src/lib/reveal.js` is the only importer of the ledger and only `/foundation` calls it, by `channel.*` id |
| `reveal:day` | **completely unaffected.** `plan()` (`day.mjs:166–189`) walks `public/robots` and `public/held/robots` and compares against `delivered()` — the Record's `assets`. It never opens the ledger. No file moves |
| `--audit` | lands in "NOT BUILT AND NOT PROMISED — the quiet gaps" (`shown:false`, and nothing deps on it) |
| `--cards` | appears as an undated HELD card, printing `production: needed` |

**`prod: "placed"`**

| stage of the pipeline | what happens |
|---|---|
| `manualPageRow` | `build: "LIVE"`, `state: "REVEALED"`, `reach: "a frame in THE MANUAL's reader, on /robots"`, `where: "src/data/artists/robots.js face.plates"`, `deps: []`, `shown: false` |
| `applyTransfers` | `transfer: "PACKAGE"`, `transferWeek: null` |
| `validate` — schema half | needs at least one entry in `assets` or it faults `"placed in the reader with no asset — a frame with no photograph"` (`schema.mjs:237–238`) |
| `validate` — asset resolution | `resolve()` in the declaration (`ledger-declare.mjs:103–109`) fails the whole build if the ref is not in `provenance/asset-table.json`, by `ref` or by `repo:path`. The 61 page PNGs are present as `robots:robots/mgk-viiip/manual/structure/pages/page-NN.png` with `ref: null`, so only the `repo:path` form resolves |
| `validate` — transfer half | **FAULTS.** `transferFaults` check (b), `transfers.mjs:481–484`: REVEALED + PACKAGE + `TRANSFERS.PACKAGE.week === null` → `"REVEALED, but PACKAGE has no named arrival week."` |
| `reveal:check` | **FAILS**, today, for that reason and no other. The self-test asserts exactly this (`reveal-ledger.mjs:404–410`) |
| `reveal:build` (`--write`) | also refuses — `ledger-declare.mjs:896–901` exits 1 on the same fault, so the row cannot even be written into `ledger.json` |
| renders? | **NO — not from the ledger.** `where` says `src/data/artists/robots.js face.plates`, and that is a claim about where the glass is, not a wiring. The Documentation card's `plates: []` (`robots.js:2077`) is what actually draws; it is edited by hand |
| `reveal:day` | still unaffected. A page renders only once a file exists under `public/robots/…`, and once it does the pull-back governs it: undelivered + public → **PULL** back behind the door, and `deliveryFaults()` fails the packet |

**The consequence worth stating plainly:** the ledger's `placed` stage is *bookkeeping about* a
placement it neither performs nor verifies. Four separate things must all be done by hand for a
page to actually appear — the PNG copied into the museum's public tree, a Record entry naming
its path in `assets`, `reveal:day --place`, and a `plates` entry on the Documentation card in
`robots.js`. The ledger row is a fifth, independent act.

---

## 6d. THE CLEAN PNG QUESTION — ASKED, NOT ANSWERED

**THE QUESTION FOR MIKE:**

> The manual is now to be revealed as the clean PNGs — no printing, no shooting.
> The `prod` arc has four stages: **needed → printed → photographed → placed**.
> Two of them describe acts that will never happen.
> **Does the arc stay as it is, with `printed` and `photographed` becoming stages
> nothing ever passes through — or does the arc change?**

I have not picked, and this section recommends nothing. Here is what the code says on each side.

**Evidence that the two stages become dead vocabulary**

- `PROD` (`schema.mjs:43`) is a **free enum, not an ordered sequence.** Nothing in either repo
  compares two stages, indexes into the array, checks a transition, or forbids a jump. The only
  operations performed on it anywhere are `PROD.includes(prod)` (`schema.mjs:152, 232`),
  `PROD.join(" · ")` in two error messages, and `for (const prod of PROD)` in the self-test.
  **A page may be authored directly as `placed` with no fault.** So the arc's "arc-ness" is
  documentation, not machinery.
- The three fields the two middle stages exist to distinguish collapse if they are unused:
  `BUILD_FOR_PROD` would only ever be read at `needed` (NOT_BUILT) and `placed` (LIVE), and
  `STATE_FOR_PROD` only at HELD and REVEALED — which is the ordinary `build`/`state` pair the
  other 167 rows already carry with no `prod` at all.
- `printed`'s and `needed`'s only distinguishing *behaviour* is the auto-filled `deps` string
  (`schema.mjs:174–175`), and that string is **"P2 — Mike prints and photographs this page
  (≥2400px long edge, whole page including margins)"** — an instruction to do the two things the
  ruling has just struck. Under the new ruling that default dependency is wrong on every row it
  would be written onto.
- `where` for any non-`placed` stage reads **"the physical world — printed from
  weird-baby-robots/…"** (`schema.mjs:165`). That is also a claim the ruling contradicts.
- `PARTIAL` — the build state — exists in `BUILD_FOR_PROD` **only** for `photographed`. Retire
  that stage and no manual page can ever be PARTIAL.
- `doc.manual.plates`'s own deps say `"Mike's camera — P2; ≥2400px long edge, whole page
  including margins, reel order = reading order"` (`ledger-declare.mjs:431`), and `face.viiip.manual`
  says the face has no picture pending "B8's photographs". Those are the same struck premise, one
  table over.

**Evidence that something depends on them / breaks**

- **The self-test would fail immediately if a stage were simply deleted from `PROD`.**
  `reveal-ledger.mjs:411–412` asserts `PROD.join(",") === Object.keys(EXPECT).join(",")` — the
  stage list and the test's expectation table must be identical, in the same order. Removing
  `printed` without editing `EXPECT` faults; editing `EXPECT` without removing it faults.
  This is a guard against silent coverage loss, and it means a vocabulary change is a two-file
  change with a gate on it.
- **`BUILD_FOR_PROD`/`STATE_FOR_PROD` are keyed maps, not exhaustive switches.** Deleting a key
  without deleting it from `PROD` produces `build: undefined`, which then faults downstream as
  `bad build "undefined"` (`schema.mjs:209`) rather than throwing at the point of the mistake.
- **Nothing else in either repo reads a stage name.** Grep for `PROD`, `.prod`, `BUILD_FOR_PROD`,
  `STATE_FOR_PROD` returns only `reveal/schema.mjs`, `reveal/ledger-declare.mjs` and
  `tools/reveal-ledger.mjs`. No page, no route, no gate outside `reveal:check`, and nothing in
  `src/` (the public projection strips `prod` entirely). **No build state and no reveal state is
  produced ONLY by `printed` or `photographed` that could not be produced another way** — except
  `PARTIAL`, above, which is produced by `photographed` alone.
- **Keeping unused stages costs nothing mechanically.** They are two keys in two maps and two
  rows in a test table; the vessel is exercised at all four every packet, so they cannot rot
  silently. The cost is vocabulary — a future session reading `printed` and planning a print run.
- **Against a straight collapse to two stages:** there is at least one real intermediate state
  under the new ruling — *the clean PNG is chosen/prepared for this page but is not yet in the
  reader* — which today has no name. Whether that state deserves a stage, and what it is called,
  is part of the same ruling and is **not** something Ops should name.

**And a separate ruling that rides on the same decision** (stated, not answered):

> Manual pages are class **PACKAGE** by pattern (`transfers.mjs:414–417`) — *"a photographed page
> is a photograph of paper somebody is holding."* If no paper is photographed, is a manual page
> still PACKAGE material? It matters concretely: PACKAGE has **no named arrival week** (T-B), and
> transfer check (b) therefore **refuses any REVEALED manual page** — so the first page ever
> placed fails the packet gate. Naming the four Fridays fixes it; so would a different class.
> Both are Mike's.

---

## 6e. DOES ANYTHING TODAY KNOW THE 61 PAGES EXIST AS LEDGER ROWS?

**Short answer: nothing knows them as ledger rows, because there are none. Two other tables know
them as files, and one function knows them as a count.**

### `manualPages()` — `reveal/schema.mjs:108–120`

```js
/* THE LENGTH OF THE MANUAL, read off the manual. Returns 0 where the tree is
   unreachable — callers must ask `manualSourceState()` first, because 0 pages
   and "the repo is not on this disk" are different facts and only one of them
   is about the document. */
export function manualPages() {
  if (manualSourceState() !== "ok") return 0;
  let n = 0;
  for (const f of fs.readdirSync(path.join(ROBOTS, MANUAL_SRC))) {
    const m = PAGE_FILE.exec(f);
    if (m) n = Math.max(n, Number(m[1]));
  }
  return n;
}
```

**Where it reads from:** `path.join(ROBOTS, MANUAL_SRC)` where
`ROBOTS = path.resolve(REPO, "..", "weird-baby-robots")` (`schema.mjs:26`) and
`MANUAL_SRC = "robots/mgk-viiip/manual/structure/pages"` (`schema.mjs:88`) — i.e.
`C:\AI\Projects\weird-baby-robots\robots\mgk-viiip\manual\structure\pages`, filtered by
`PAGE_FILE = /^page-(\d{2,})\.png$/` (`schema.mjs:89`). It returns **61** today.

**It returns the MAXIMUM page number, not the count.** They agree today (61 files, `page-01` …
`page-61`, contiguous). Delete `page-30.png` and it still reports 61 — a hole in the middle is
invisible to it. Individual holes are caught only at authoring time, per page, by the
`fs.existsSync` at `schema.mjs:155–156`.

### Every caller of `manualPages()`

| caller | what it does with it |
|---|---|
| `reveal/schema.mjs:113` | itself (guard) |
| `reveal/schema.mjs:149` | upper bound in `manualPageRow`'s page-range refusal |
| `reveal/schema.mjs:203` | read once per `validate()` run, then used at 250–253 to fault any existing row naming a page past the end |
| `reveal/ledger-declare.mjs:428` | **prints the count into `doc.manual`'s `note`** — the ledger's only stored trace of "61" |
| `tools/reveal-ledger.mjs:93` | `report()` prints `manual pages : 0 of 61` |
| `tools/reveal-ledger.mjs:391` | self-test: faults if the directory holds no pages |
| `tools/reveal-ledger.mjs:461–462` | self-test: asserts page 62 is refused |
| `tools/reveal-ledger.mjs:668` | the PASS line: "the manual is 61 pages, read off …" |

That is the complete list. **No renderer, no route, no other gate.**

### The correspondence between the 61 PNGs and the ledger

| population | count | key |
|---|---|---|
| PNGs on disk (`…/structure/pages/page-NN.png`) | **61** (`page-01` … `page-61`) | filename |
| `provenance/asset-table.json` rows for them | **61** | `uid` (e.g. `A-b395f75b2c`), with `id: "robots:robots/mgk-viiip/manual/structure/pages/page-01.png"` |
| `reveal/ledger.json` rows for them (`doc.manual.page.NN`) | **0** | — |
| ledger rows carrying any `prod` | **0** of 167 | — |
| ledger rows carrying any `calledBy` | **0** of 167 | — |

**How the correspondence WOULD be established, if a row existed:** by **page NUMBER, through the
filename**, in one function — `manualSourcePath(page)` (`schema.mjs:91–93`) turns page *n* into
`page-NN.png`, and `manualPageRow` turns the same *n* into id `doc.manual.page.NN`. There is no
uid link and no index; the join is arithmetic on a zero-padded number. Note that the ledger id
pads to **2** digits while `PAGE_FILE` accepts **2 or more** — a manual that ever reaches page 100
would produce id `doc.manual.page.100` from `padStart(2)` and still parse, but the museum's own
`page-100.png` naming and the 2-pad convention would have quietly diverged.

**Do the two populations disagree?** In count, no — nothing versus 61 is not a disagreement, it
is an empty vessel, and it is empty by written instruction (`ledger-declare.mjs:454`, "NOTHING IS
POPULATED, BY INSTRUCTION"). The finding is elsewhere: **the asset table already holds all 61 as
`role: "source"` rows with `verdict: null`, `bucket: null`, `usedBy: []`** — catalogued as files
nobody has judged, joined to nothing, referenced by no ledger row and by no page of the museum.
If the clean PNGs are to be the reveal, those 61 rows are the material and the ledger has never
heard of them.

Also relevant to §6e and not visible from the ledger: three tuning renders sit beside the pages
(`…/structure/tuning/compare-page-08.png`, `-46`, `-60`). They do not match `PAGE_FILE` and are
correctly ignored by `manualPages()`.

---

## WHAT I COULD NOT DETERMINE

1. **Whether the 61 structure renders ARE the "clean PNGs" of Mike's ruling.** Their asset-table
   rows say `role: "source"`; `ledger-declare.mjs:428` calls the tree "the STRUCTURE ISSUE —
   structure and arrangement only, text not supplied". If the ruling means *these* files, the
   museum would be revealing pages whose text was never supplied. Job 4 is reading the document
   itself; I did not open the PNGs.
2. **Whether `npm run reveal:check` passes on the tree as it stands today.** I did not run it,
   or any other script, by instruction. Everything above is read off source.
3. **Whether the manual's page count is intended to be 61.** `manualPages()` reports the maximum
   page number, not a file count. Today 61 files and max 61 agree; nothing in the repo asserts
   contiguity, so a mid-document hole would be invisible until a specific page was authored.
4. **Whether a clean PNG placed in the museum's public tree is "a picture of the objects"** for
   the pull-back rule's purposes. `reveal/delivery.mjs` governs everything under
   `public/robots/**` with no exception except the hand-written `SIGNAGE` list (one row today).
   Nothing in the code decides which side of that line a page of the manual falls on.
5. **What the `deps` string on a page row should say under the new ruling.** The current
   auto-fill (`schema.mjs:175`) instructs a print-and-shoot. I did not change it and did not
   invent a replacement.

## WHAT NEEDS MIKE

1. **6d — THE ARC. Does `needed → printed → photographed → placed` survive the clean-PNG ruling,
   or do `printed` and `photographed` become dead vocabulary?** The code evidence is in §6d,
   both directions. Key facts for the ruling: the arc is a **free enum with no ordering or
   transition checks**, so a page could already be authored straight to `placed`; nothing outside
   `reveal/` reads a stage name; `PARTIAL` is produced by `photographed` and by nothing else;
   and deleting a stage is a coordinated edit in exactly two places, guarded by
   `reveal-ledger.mjs:411`. **Ops has not chosen and will not.**
2. **A `prod: "placed"` manual page cannot pass `reveal:check` today.** Transfer check (b)
   refuses it: manual pages are PACKAGE by pattern, and PACKAGE has no named arrival week
   (register **T-B**, the four Fridays). The vessel's self-test expects this fault by name. So
   before any page ships, either the PACKAGE weeks are named, or manual pages get a different
   transfer class — and under a ruling where nothing is printed or shipped, "a photograph of
   paper somebody is holding" may no longer be the right description. **Both are rulings.**
3. **Is a clean page PNG governed by the pull-back rule?** If yes, each page must be delivered by
   a Record entry naming its path in `assets` before it can sit at a public address, and
   `reveal:day --place` moves it. If it is instead the museum's own material, it needs a `SIGNAGE`
   row with a reason. There is no default in either direction, by design.
4. **Which pages, and called for by which entries?** `calledBy` is the supply line and it is
   empty on all 167 rows. Under the instruction at `ledger-declare.mjs:454`, Ops writing a page
   row before an entry calls for it *is Ops deciding which page the story reaches for*. Nothing
   in this job did that.
5. **Minor, but his to rule since it touches the P2 shoot spec:** the auto-filled dependency on
   every unplaced page row is *"P2 — Mike prints and photographs this page (≥2400px long edge,
   whole page including margins)"*, and `doc.manual.plates` carries the same premise. Under the
   new ruling both are instructions to do something that has been struck.
