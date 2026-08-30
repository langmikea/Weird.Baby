# FINDING — F7, the unguarded `/save` endpoint

**Round:** F7, the save endpoint. **Written:** 2026-08-30.
**Scope:** one guard in one tool file, plus a §8 lead line and this report.
Nothing that publishes was changed. The draft on disk was not written.
**Repository:** `C:\AI\Projects\weird-baby-museum`, branch `main`.
**Raised in:** [`FINDING-day-editor-save.md`](FINDING-day-editor-save.md) §7, F7.

**Method notation.** **READ** — the tree states it, at a named file and line.
**RUN** — a command was executed and this is its output.

> **IT WAS LOCAL-DEV ONLY, SO STEP 2 APPLIED AND STEP 3 DID NOT.** `/save` is in
> a tool, on loopback, and has never been on the wire. It is now closed with a
> 410 that names the road. **It was not alone** — §4.

---

## 0 · HEADROOM — NO CUT WAS NEEDED

| | bytes | of ceiling |
|---|---:|---:|
| `docs/canonical/OPERATIONS.md` before | **38,003** | 95.0% |
| the filed lead line | **308** | |
| after | **38,311** | **95.8%** |

RUN, `npm run ops:size`, PASS both sides. **The fifth cut was not taken and
`OPERATIONS_ARCHIVE/08-KNOWN-HAZARDS-V.md` was not created**, because 38,311 is
inside 40,000 with 1,689 bytes to spare.

**One correction to the packet's framing, because it will matter at the next
filing.** The figure is the **whole file**, not §8 — `tools/ops-size-gate.mjs`
measures `OPERATIONS.md` end to end. §8 is the part that grows, which is why it
is the part that gets cut, but the ceiling is the document's.

**A first draft of the lead line was 439 bytes and was cut to 308** before
filing. §8's own pointer block states the going rate — *"848 bytes for a bodied
entry against 102 for a lead-only one"* — and 439 was over four times the
lead-only cost. It is still three times, and that is the honest figure rather
than a rounded one.

---

## 1 · WHERE `/save` LIVES, AND WHO CAN REACH IT

**`tools/dictation/record-serve.mjs:254`** before this change, **`:285`** after it. READ.

**IT IS LOCAL-DEV ONLY. It has never been reachable over the wire.** Five
independent checks, RUN:

| # | question | command | answer |
|---:|---|---|---|
| 1 | does the worker route `/save`? | `grep -n '/save' src/worker.js` | **no output** |
| 2 | does the DEPLOYED worker? | `git show 3ccbad9:src/worker.js \| grep -c '"/save"'` | **`0`** |
| 3 | does the app bundle import `tools/`? | `grep -rn 'from ".*tools/' src/` | **no output** |
| 4 | does the built bundle mention it? | `grep -rl "record-serve\|/day/save" dist/client` | **no output** |
| 5 | what does Cloudflare ship? | `wrangler.jsonc:8-9` | `"main": "src/worker.js"` plus a static asset directory — **`tools/` is neither** |

**And it binds loopback.** `record-serve.mjs:314`, READ:
`server.listen(PORT, "127.0.0.1", …)` — not `0.0.0.0`, so it is not reachable
from the local network either. It runs only while `npm run day:serve` or
`npm run record:serve` is running, and only for the machine running it.

**The bridge to production, the way the timeline report did it.** The deployed
commit is `3ccbad9` (`docs/DEPLOYED.md`, READ). Check 2 above ran against that
commit's own worker, not the working tree, and found zero `/save` routes.
`wrangler.jsonc` at that commit carries the same `"main": "src/worker.js"` — RUN.
**This is an inference from matching inputs, not a wire measurement:** nothing
here asked production for `/save`. It is a stronger inference than usual,
because the route does not exist in the shipped file at all — there is no build
step that could add one.

**So step 3 did not apply and nothing was stopped.**

---

## 2 · THE CHANGE — REFUSED, NOT DELETED

### 2.1 · What it did before

`tools/dictation/record-serve.mjs`, before — the whole write path:

```js
      fs.writeFileSync(DRAFT, body);
      const where = path.relative(REPO, DRAFT).replace(/\\/g, "/");
      …
      res.end(JSON.stringify({ ok: true, path: where, bytes: body.length,
                               records: parsed.entries.length }));
```

**The request body, straight to disk.** It checked that the JSON parsed and that
`entries` was an array, and nothing else:

- **no sha256** against the Record the page was seeded from, so a page built
  hours earlier could overwrite a draft saved since;
- **no `saved` stamp and no `source` block**, so `record:land`'s guard 8 — which
  compares the STAMP, not the words — had nothing to read, and the draft it left
  could not be judged stale by anything downstream.

`/day/save` earns its write and does both: 409 by sha
(`record-serve.mjs:192-197`) and a normalised `saved` + `source`
(`:209-219`). READ.

### 2.2 · What it does now

```js
  if (req.method === "POST" && route === "/save") {
    res.writeHead(410, { "content-type": "text/plain", "cache-control": "no-store" });
    res.end("/save is closed (F7, 2026-08-30). …  Write through /day/save from day.html,
             which refuses a stale page by sha with a 409. …");
    console.log("  refused  POST /save — closed at F7; the road is /day/save");
    return;
  }
```

**43 insertions, 23 deletions, in one file, in one block** — RUN,
`git diff --stat`. The write path is gone; the route is not.

### 2.3 · Why refused rather than deleted — the choice, and the fact that decided it

**`record.html` is still on disk, still tracked, and still served by this file**
— RUN, `git ls-files` lists `docs/dictation-20260807/record.html`, and
`record-serve.mjs:129` sets `HAS_RECORD` from its existence.

**And its client still posts here.** `tools/dictation/record-edit.client.js:928`,
READ: `fetch("/save", { method: "POST", … })`.

**That corrects F7 as first written.** [`FINDING-day-editor-save.md`](FINDING-day-editor-save.md)
§7 called `/save` *"a door nobody uses"* on the grounds that the day page posts
to the guarded one. The day page does — and the mothballed editor does not, it
posts here. **The endpoint had a live caller and the flag said it had none.**

Deleting the route would have answered that caller with a 404: the same
fall-through, and not one word about why. **A refusal that names itself is the
smaller edit and the honest one.**

**NOTHING IS LOST BY REFUSING, AND THAT IS THE CLIENT'S OWN DESIGN.**
`record-edit.client.js:927-937`, READ — `saveViaServer` resolves `false` on any
non-ok response, and `saveToRepo` falls straight into `saveByPicker`, then into
a download. Its own header says so at `:868-872`: *"A bridge that fails must fail
into the old road, not into silence, so a refused picker downloads the same file
and says where it went."* His words still land in a file; they land through a
dialog instead of through this socket.

### 2.4 · Proof, RUN

The server was started on port 8912, exercised, and stopped. The draft's sha256
was taken before and after.

```
=== 1. POST /save (a hostile body: {"entries":[{"no":1,"title":"HOSTILE OVERWRITE"}]})
HTTP 410
/save is closed (F7, 2026-08-30). It wrote docs/dictation-20260807/record-draft.json
with no sha256 check against the Record it was seeded from and no `saved` stamp …
Write through /day/save from day.html, which refuses a stale page by sha with a 409.

=== draft after the hostile POST
f137379db3f040541006ab58bae7fe91fada21832de778632403cdb90e43ff5f  record-draft.json
    — identical to the hash taken before the server started

=== 2. /day/save with a STALE sha
HTTP 409
{"ok":false,"stale":true,"why":"THE RECORD MOVED AFTER THIS PAGE WAS BUILT. Nothing was written.",
 "detail":"The page was built against …robots-record.js at sha256 deadbeef… On disk now it is fa5cdcd9…

=== 3. /day/save with NO provenance
HTTP 400
{"ok":false,"why":"this save carries no record of which Record it was typed against, so there is
 no way to tell whether it is about to overwrite work that arrived after the page was built…
```

**`/day/save` is unaffected: both of its refusals still fire, by name.**

**Its ACCEPT path was deliberately not exercised**, and that is a decision rather
than an omission: a successful `/day/save` writes `record-draft.json` and
`readiness.json`, and the draft is the one guard 8 is currently holding
([`FINDING-day-editor-save.md`](FINDING-day-editor-save.md) §3). Proving the
guard by tripping the thing it guards would have been the wrong trade. The
accept path is byte-identical code — the diff touches only the `/save` block.

**Both files are untouched.** RUN, after the server stopped:

```
f137379db3f040541006ab58bae7fe91fada21832de778632403cdb90e43ff5f  record-draft.json
a1b65c0bfa0106b7436da60a9a2fddc62bf8afdd6bc1776ebfb671e036b98aa4  readiness.json
```

---

## 3 · STEP 3 — NOT REACHED

`/save` was not in the deployed bundle, so the STOP branch did not apply.
Recorded here so the packet's two branches are both answered rather than one
silently dropped.

---

## 4 · IS F7 ALONE? — NO. THERE ARE THREE WRITERS AND TWO CHECK NO SHA

RUN — every writer of `record-draft.json` in the tree:

| writer | sha check | `saved` normalisation | state |
|---|---|---|---|
| `record-serve.mjs` `/day/save` (`:175`) | **yes** — 409 against `robots-record.js` | **yes** — server-stamped, plus a `source` block | the road |
| `record-serve.mjs` `/save` (`:285`) | **no** | **no** | **CLOSED by this packet** |
| `tools/dictation/workbook_to_draft.py` (`:635-644`) | **no** | stamps `saved` with **its own run time** | **open, and already carried in §8** |

**The third one is the interesting one.** `workbook_to_draft.py:631` is honest in
its own NOTE — *"`saved` below is when THIS READER RAN, not when he wrote"* — and
that is exactly what defeats guard 8, which compares the stamp and not the words.
`OPERATIONS.md` §8 already carries the consequence from the lander's end
(*"`record:land`'s STALENESS GUARD IS INERT ON THE WORKBOOK PATH"*, 2026-08-25).
**What was not written down until now is that it is the same shape as F7 seen
from the other side: a second writer of a file that one road guards.** It writes
no `source` block either, so a draft it produces cannot be sha-checked by
anything downstream.

**Not counted as a writer, and why:** `record-edit.client.js:905, 960` places
the file through the browser's own download or `showSaveFilePicker`. **The
person chooses the path**; no server writes, and no sha check is possible or
appropriate. It is the fall-through §2.3 depends on, not a fourth door.
`tools/dictation/record-edit.mjs:416` writes an `.html` file, not the draft —
its `DRAFT_FILE` const at `:81` is passed as data (`:288`) and never written to.

**`workbook_to_draft.py` is left exactly as it is.** Closing it is a different
decision — it is a road Mike actually uses, not a mothballed one — and this
packet was scoped to `/save`.

---

## 5 · THE §8 LEAD LINE

Filed, lead line only, no body:

> **A SECOND WRITER OF A FILE ONE ROAD GUARDS IS A DOOR NOBODY WATCHES: `/save`
> WROTE `record-draft.json` WITH NO SHA AND NO `saved`, BESIDE A `/day/save`
> THAT ANSWERS 409 (F7, 2026-08-30).** Dev-only, loopback, never on the wire;
> CLOSED. `workbook_to_draft.py` is the third writer and checks no sha either.

308 bytes. §0 for the arithmetic.

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
| 7 | `npm run docs:numbers:gate` | **0** | the §8 hazard — over two minutes |
| 8 | `npm run shellstop:gate` | **0** | |

**`day:proof`: 1 of 49, exit 1 — UNCHANGED.** RUN. P1.3 still reports *4 of 5
existing days accept an edit from this page today (001, 002, 003, 004)* with the
same residual: **Record 005, REFUSED by guard 6 — it carries standing
reasoning.** The count did not move, and it was not expected to: `day:proof`
reads `record-draft.json`, `readiness.json`, `day.html`, `day-collect.js`,
`emit-record-entries.mjs` and `moved-blocks.json`, and spawns the emitter. **It
does not read `record-serve.mjs`** — RUN, `day-proof.mjs:64-68`.

---

## 7 · EVERY COMMAND RUN

```
grep -n '/save' src/worker.js
git show 3ccbad9:src/worker.js | grep -c '"/save"'
git show 3ccbad9:wrangler.jsonc | grep -n '"main"'
grep -rn 'from ".*tools/' src/
grep -rl "record-serve|/day/save" dist/client
grep -rn "record-draft.json" tools/ src/ reveal/
grep -n 'fetch("/save"' tools/dictation/record-edit.client.js
git ls-files docs/dictation-20260807/ | grep record
sha256sum docs/dictation-20260807/record-draft.json docs/dictation-20260807/readiness.json   (before and after)
node tools/dictation/record-serve.mjs 8912   (started, exercised, stopped)
curl -X POST …/save          -> 410
curl -X POST …/day/save      -> 409 (stale sha) and 400 (no provenance)
npm run ops:size             (before and after the filing)
npm run lint build provenance:gate reveal:check parity:gate instory:gate docs:numbers:gate shellstop:gate
npm run day:proof
```

Everything else is READ, at the file and line named beside it.
