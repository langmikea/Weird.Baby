/* ===========================================================================
   THE RECORD, READ OUT OF THE RECORD. [R1 2026-08-05]
   ---------------------------------------------------------------------------
   The reveal ledger needs one row per Record ENTRY. This is the thing that
   tells it how many entries there are and what each one shows.

   ═══ WHY IT PARSES INSTEAD OF IMPORTING ════════════════════════════════════
   `src/data/artists/robots.js` imports a JSX component at its head, so node
   cannot import it and never will. It is parsed with the same acorn + acorn-jsx
   pair `tools/provenance-sweep.mjs` already uses, and the entries are read off
   the AST rather than off a regular expression — an entry is an object in an
   array, and that is a shape a parser knows and a pattern-match guesses at.

   ═══ THE CONSTRAINT THIS FILE EXISTS TO ENFORCE ════════════════════════════
   THE LEDGER MUST NEVER BECOME A SECOND COPY OF THE RECORD. Audit §8a states
   it: an entry's headline, dateline and sections live in the Record; the ledger
   row holds only what the ledger holds anywhere — is it reachable, should it be
   yet, what does it need first. The moment the two hold the same words they can
   disagree, and then one of them is lying and nobody knows which.

   So this module is split in two on purpose, and the split is the enforcement:

     entries()  returns NUMBERS and ASSET PATHS. Nothing else. This is what
                the ledger is built from, so the ledger is structurally
                incapable of carrying a headline — the generator never sees one.

     prose()    returns every sentence in the Record. NOTHING BUILDS FROM THIS.
                It exists for `reveal:check`, which uses it to police the rule
                above: any ledger row found holding six consecutive words of the
                Record fails the check.

   One reader can see the words and it is the one that forbids them; the reader
   that writes rows cannot see them at all.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import * as acorn from "acorn";
import jsxPlugin from "acorn-jsx";

const Parser = acorn.Parser.extend(jsxPlugin());
const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");

/* ═══ [M1 2026-08-11] THE RECORD MOVED OUT OF THE SPINE, AND THIS MOVED WITH
   IT — the sentence below said it would ══════════════════════════════════════
   The six entries are their own module now so that `record:land --write` can
   rewrite the whole file; see the note at the head of `robots-record.js`. That
   makes them a TOP-LEVEL array rather than a property four levels inside an
   album, which is a strictly easier thing to parse — but the old shape has to
   keep working, and not for tidiness: `reveal/day.mjs --since <ref>` reads the
   Record AS IT WAS at a git ref, and every ref before today has the entries
   inside `robots.js`. `entriesArrayOf` below accepts either, so a delta
   against last week still resolves. */
export const RECORD_SOURCE = "src/data/artists/robots-record.js";
/* where the entries lived before the split — read at old refs only */
export const RECORD_SOURCE_LEGACY = "src/data/artists/robots.js";
export const RECORD_ENTRIES_EXPORT = "RECORD_ENTRIES";
/* the epoch is its own module — see `record-epoch.js` */
export const RECORD_EPOCH_SOURCE = "src/data/artists/record-epoch.js";
export const RECORD_TRACK_ID = "record";

/* A path-shaped string: leading slash, a real extension. The Record's `still`
   is one; so is anything a future entry hangs off an evidence class. Read
   generically rather than by field name so an entry that carries a second
   photograph joins the asset table without this file being edited. */
const ASSET_LIKE = /^\/[\w\-./]+\.\w{2,5}$/;

/* ---- tiny AST helpers ----------------------------------------------------
   `strOf` folds the string concatenation this codebase writes everywhere —
   "a long sentence " + "continued on the next line" — into one value. A reader
   that only understood Literal would silently see half of every sentence, and
   half a sentence is exactly the failure mode the prose check is built to
   catch, so it would fail open. */
function strOf(node) {
  if (!node) return null;
  if (node.type === "Literal" && typeof node.value === "string") return node.value;
  if (node.type === "TemplateLiteral" && node.expressions.length === 0)
    return node.quasis.map(q => q.value.cooked).join("");
  if (node.type === "BinaryExpression" && node.operator === "+") {
    const l = strOf(node.left), r = strOf(node.right);
    return l !== null && r !== null ? l + r : null;
  }
  return null;
}

function propOf(obj, name) {
  if (!obj || obj.type !== "ObjectExpression") return null;
  const p = obj.properties.find(
    x => x.type === "Property" && !x.computed
      && (x.key.name === name || x.key.value === name));
  return p ? p.value : null;
}

/* Every string literal anywhere under a node, concatenations folded. */
function stringsUnder(node, out = []) {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) { node.forEach(n => stringsUnder(n, out)); return out; }
  if (!node.type) return out;
  const s = strOf(node);
  if (s !== null) { out.push(s); return out; }        // don't descend into a folded concat
  for (const k of Object.keys(node)) {
    if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
    stringsUnder(node[k], out);
  }
  return out;
}

/* ---- the walk ------------------------------------------------------------ */
let CACHE = null;

/* [R2 2026-08-07] THE PARSE IS SEPARATED FROM THE READ, AND THAT IS THE WHOLE
   OF THE CHANGE. `reveal/day.mjs` has to answer "what does today's Record
   deliver that YESTERDAY'S did not", and yesterday's Record is a blob in git,
   not a file on disk. Everything below is the previous `read()` body verbatim
   with the source handed in rather than opened; the split adds no rule and
   removes none. The file's own split is untouched: this still returns numbers
   and asset paths, and the caller that can see words is still the one that
   forbids them. */
/* ── THE ENTRIES ARRAY, IN EITHER SHAPE ────────────────────────────────────
   POST-SPLIT: `export const RECORD_ENTRIES = [ … ]` at the top level of
   `robots-record.js`. PRE-SPLIT: `face.entries` on the track whose `id` is
   "record", four levels inside `robots.js`. Both are tried, new shape first,
   and a source carrying neither throws with both names in the message — the
   failure a reader that has been left behind should produce.
   THE OLD WALK IS KEPT VERBATIM rather than deleted, because it is what reads
   every commit before today and `reveal/day.mjs --since` depends on it. */
export function entriesArrayOf(ast) {
  let found = null;
  (function visit(n) {
    if (!n || typeof n !== "object" || found) return;
    if (Array.isArray(n)) { n.forEach(visit); return; }
    if (n.type === "VariableDeclarator" && n.id && n.id.name === RECORD_ENTRIES_EXPORT
        && n.init && n.init.type === "ArrayExpression") { found = n.init; return; }
    for (const k of Object.keys(n)) {
      if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
      visit(n[k]);
    }
  })(ast);
  if (found) return found;

  /* Find the track object whose `id` is "record" AND which carries a `face`.
     Both conditions, because "record" is also a tag value on that same track
     and a one-condition match would find the tags array's neighbourhood. */
  let track = null;
  (function visit(n) {
    if (!n || typeof n !== "object" || track) return;
    if (Array.isArray(n)) { n.forEach(visit); return; }
    if (n.type === "ObjectExpression") {
      const id = strOf(propOf(n, "id"));
      if (id === RECORD_TRACK_ID && propOf(n, "face")) { track = n; return; }
    }
    for (const k of Object.keys(n)) {
      if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
      visit(n[k]);
    }
  })(ast);
  const el = track ? propOf(propOf(track, "face"), "entries") : null;
  if (el && el.type === "ArrayExpression") return el;
  return null;
}

export function parseRecord(src) {
  const ast = Parser.parse(src, { ecmaVersion: "latest", sourceType: "module" });

  const entriesNode = entriesArrayOf(ast);
  if (!entriesNode)
    throw new Error(
      `reveal/record-entries.mjs: no \`${RECORD_ENTRIES_EXPORT}\` array and no track ` +
      `with id "${RECORD_TRACK_ID}" carrying a \`face.entries\` array. The Record has ` +
      `moved; this reader must move with it.`);

  const entries = [];
  const prose = [];
  for (const el of entriesNode.elements) {
    if (!el || el.type !== "ObjectExpression") continue;
    const noNode = propOf(el, "no");
    const no = noNode && noNode.type === "Literal" && typeof noNode.value === "number"
      ? noNode.value : null;
    const assets = [];
    for (const s of stringsUnder(el)) {
      if (ASSET_LIKE.test(s)) assets.push(s);
      else prose.push(s);
    }
    entries.push({ no, assets: [...new Set(assets)] });
  }

  return { entries, prose };
}

function read() {
  if (CACHE) return CACHE;
  CACHE = parseRecord(fs.readFileSync(path.join(REPO, RECORD_SOURCE), "utf8"));
  return CACHE;
}

/** NUMBERS AND ASSET PATHS. The only thing the ledger is allowed to build from.
 *  `no` is null for an entry the Record has not numbered — see M19. Callers
 *  must refuse to mint an id for one rather than inventing a number. */
export function entries() { return read().entries.map(e => ({ ...e })); }

/** EVERY SENTENCE IN THE RECORD. Nothing builds from this; `reveal:check` uses
 *  it to prove no ledger row is holding any of them. */
export function prose() { return [...read().prose]; }

/* ═══ [A1 2026-08-08] EVERY FIELD AN ENTRY DECLARES, BY NAME ═════════════════
   MIKE, ruling D-b: **"Nothing drops silently ever again."**

   That is a sentence or it is a mechanism. The defect it closes (S-c) was not a
   bug in a renderer — it was a renderer that did not know about three fields
   and had no way to say so, and an author who got silence. A round can fix the
   three fields it knows about today; it cannot fix the fourth one somebody adds
   in November. So the check is inverted: the gate holds the list of fields the
   renderers DRAW, this returns the fields the Record actually DECLARES, and any
   entry carrying a field nobody draws **fails the packet**.

   IT RETURNS NAMES AND NOTHING ELSE, which keeps this module's own split
   intact: `entries()` sees numbers and asset paths, `prose()` sees words, and
   this sees neither — it cannot leak a headline into the ledger because it
   never reads one. */
export function entryFields() {
  return read2().map(e => ({ no: e.no, keys: e.keys }));
}

let KEYCACHE = null;
function read2() {
  if (KEYCACHE) return KEYCACHE;
  const src = fs.readFileSync(path.join(REPO, RECORD_SOURCE), "utf8");
  const ast = Parser.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  /* [M1 2026-08-11] the same dual-shape finder `parseRecord` uses — this walk
     was its twin, copied, and the split made keeping two of them a way to fix
     one and not the other. */
  const el = entriesArrayOf(ast);
  KEYCACHE = (!el || el.type !== "ArrayExpression" ? [] : el.elements)
    .filter(x => x && x.type === "ObjectExpression")
    .map(x => {
      const noNode = propOf(x, "no");
      return {
        no: noNode && noNode.type === "Literal" ? noNode.value : null,
        keys: x.properties
          .filter(p => p.type === "Property" && !p.computed)
          .map(p => p.key.name || p.key.value),
      };
    });
  return KEYCACHE;
}

/* ═══ [D4 2026-08-08] DAY ONE, READ OUT OF THE RECORD ════════════════════════
   D1 made the museum's story run on real dates and put day one in ONE place —
   `RECORD_EPOCH` in `src/data/artists/robots.js`, referenced by Record 001's
   `date` and by the face's `recordEpoch`, so that a launch slip is one line.
   The dictation worksheet needs the same day: every outline day derives its
   calendar date from it, which is the only reason its preview can print a real
   stamp and a real week number instead of inventing one.

   IT RESOLVES THE IDENTIFIER RATHER THAN RE-DECLARING THE DAY. A second literal
   in a tool would be the exact thing D1's one-field rule exists to prevent — and
   it would be the worse kind, because a worksheet showing last month's date
   looks like a worksheet.

   IT DOES NOT WIDEN `strOf`. Teaching the shared folder to resolve identifiers
   would change what `entries()` and `prose()` see across the whole file, on a
   round that needs one constant; this reads the one declaration it needs and
   says so if it is not there. `null` is a real answer — the Record carried no
   epoch at all until 2026-08-08 — and callers must handle it. */
export function recordEpoch(src) {
  /* [M1 2026-08-11] IT READS `record-epoch.js` NOW, AND THAT IS WHERE THE
     CONSTANT WENT. The split moved `RECORD_EPOCH` out of the entries' file into
     its own module (two readers, belongs to neither), and this function kept
     reading the entries' file — so `npm run record` printed "day one null" and
     the editor could not resolve five `date:` fields. Caught by running it.
     A CALLER MAY STILL HAND IN A SOURCE, and one that does is reading an old
     ref where the constant lived elsewhere; that path is unchanged. */
  const text = src ?? fs.readFileSync(path.join(REPO, RECORD_EPOCH_SOURCE), "utf8");
  const ast = Parser.parse(text, { ecmaVersion: "latest", sourceType: "module" });

  /* module-level `const NAME = "…"` declarations, by name */
  const consts = new Map();
  for (const top of ast.body) {
    /* [M1 2026-08-11] `export const` IS NOT A VariableDeclaration — it is an
       ExportNamedDeclaration wrapping one, so this loop walked straight past
       `export const RECORD_EPOCH` in its new module and the epoch read null.
       Unwrapped here rather than special-cased at the call site. */
    const node = top.type === "ExportNamedDeclaration" && top.declaration
      ? top.declaration : top;
    if (node.type !== "VariableDeclaration") continue;
    for (const d of node.declarations) {
      if (d.id.type !== "Identifier") continue;
      const v = strOf(d.init);
      if (v !== null) consts.set(d.id.name, v);
    }
  }

  /* [M1 2026-08-11] THE BARE CONSTANT IS ACCEPTED FIRST, and this is what the
     split actually broke. This function was written to find the FACE PROPERTY
     `recordEpoch: RECORD_EPOCH` — which is still in `robots.js` — and after the
     move it was pointed at `record-epoch.js`, where there is no face and no
     property, only `export const RECORD_EPOCH = "…"`. It returned null and the
     editor printed "day one null" with five unresolved `date:` fields.
     Both shapes are read now: the declaration if the source has one, the face
     property otherwise. A source carrying neither still returns null, which is
     the honest answer and is what the caller is written to expect. */
  let found = consts.get("RECORD_EPOCH") ?? null;
  (function visit(n) {
    if (!n || typeof n !== "object" || found) return;
    if (Array.isArray(n)) { n.forEach(visit); return; }
    if (n.type === "Property" && !n.computed
        && (n.key.name === "recordEpoch" || n.key.value === "recordEpoch")) {
      const v = n.value;
      found = v.type === "Identifier" ? (consts.get(v.name) ?? null) : strOf(v);
      if (found) return;
    }
    for (const k of Object.keys(n)) {
      if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
      visit(n[k]);
    }
  })(ast);

  return found && /^\d{4}-\d{2}-\d{2}$/.test(found) ? found : null;
}

/* ═══ [R3 2026-08-06] THE INDEX ROW, AND IT IS A THIRD READER ════════════════
   MIKE: "every index row gets a headline and a summary beneath it, ALL
   CONSTRAINED TO THE SAME HEIGHT, and THE ENTIRE SUMMARY MUST FIT IN IT. No
   more half-sentence teasers ending in an ellipsis; THAT FAILURE DISAPPEARS BY
   CONSTRUCTION."
   "By construction" is a mechanism or it is a promise, and this is the
   mechanism's data half: the renderer can no longer truncate (the clamp is
   gone), so the only way a row can break is a string too long for the box —
   which `reveal:check` now refuses. See RECORD BUDGETS in
   tools/reveal-ledger.mjs for the numbers and how they were measured.

   IT DOES NOT BREACH THIS FILE'S OWN SPLIT, AND THE SPLIT IS WORTH RESTATING.
   `entries()` sees numbers and asset paths and NO WORDS AT ALL, and it is the
   only half the ledger builds from — that is what stops a headline having a
   route into `ledger.json`. This reader sees two fields and builds NOTHING; it
   exists so a check can police a rule, which is exactly what `prose()` above is
   for. A third reader that FEEDS something would be the breach. */
export function summaries() {
  const file = path.join(REPO, RECORD_SOURCE);
  const src = fs.readFileSync(file, "utf8");
  const ast = Parser.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  let track = null;
  (function visit(n) {
    if (!n || typeof n !== "object" || track) return;
    if (Array.isArray(n)) { n.forEach(visit); return; }
    if (n.type === "ObjectExpression") {
      const id = strOf(propOf(n, "id"));
      if (id === RECORD_TRACK_ID && propOf(n, "face")) { track = n; return; }
    }
    for (const k of Object.keys(n)) {
      if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
      visit(n[k]);
    }
  })(ast);
  if (!track) return [];
  const entriesNode = propOf(propOf(track, "face"), "entries");
  if (!entriesNode || entriesNode.type !== "ArrayExpression") return [];
  return entriesNode.elements
    .filter(el => el && el.type === "ObjectExpression")
    .map(el => {
      const noNode = propOf(el, "no");
      return {
        no: noNode && noNode.type === "Literal" && typeof noNode.value === "number"
          ? noNode.value : null,
        title: strOf(propOf(el, "title")),
        line: strOf(propOf(el, "line")),
      };
    });
}

/* ═══ [E1 2026-08-09] THE WHOLE OF EVERY ENTRY — AND IT IS A FOURTH READER ═══
   MIKE retired the two-column worksheet: *"HE EDITS THE RECORD ITSELF,
   DIRECTLY."* An editor over the real Record has to be SEEDED with the real
   Record, which means one reader in this file finally has to see whole entries
   — headline, summary, lead, every section label and every paragraph.

   ═══ THE SPLIT IS NOT BREACHED, AND HERE IS THE TEST THAT SAYS SO ═══════════
   The rule this file has kept since it was written is not *nothing may read the
   words* — `prose()` reads every word in the Record. It is that **the half the
   LEDGER builds from must see no words**, so a headline has no route into
   `ledger.json`. `entries()` is that half and is untouched. This one FEEDS AN
   OPS PAGE THAT IS NOT IN THE MUSEUM'S BUILD and feeds nothing else; the check
   on any future reader is the same one — does anything the museum ships, or the
   ledger derives, call it? Nothing does.

   ═══ TWO CALLS ARE RESOLVED AND THE REST ARE REFUSED ════════════════════════
   `date: recordDay(3)` and `still: placed("/robots/…")` are the only two
   function calls in an entry today. `recordDay` is arithmetic on the epoch and
   is recomputed here from `recordEpoch()`; `placed` is the placement resolver
   and hands back the address it was given, so the argument IS the answer
   (OPERATIONS §8: a governed picture has two addresses, and the PUBLIC one is
   what an entry declares). Anything else returns `null` and is reported by the
   caller rather than guessed at — an editor that quietly seeded a field with
   the wrong value would be worse than one that admitted it could not read it. */
export function draftEntries(src) {
  const text = src ?? fs.readFileSync(path.join(REPO, RECORD_SOURCE), "utf8");
  const ast = Parser.parse(text, { ecmaVersion: "latest", sourceType: "module" });
  /* [M1 2026-08-11] `src` AND NOT `text`: `text` is the ENTRIES file, and the
     epoch is no longer in it. Passing `src` through means a caller reading an
     old ref still gets that ref's epoch, and the ordinary case (no src) lets
     `recordEpoch` read its own module. */
  const epoch = recordEpoch(src);

  /* [M1 2026-08-11] THE THIRD COPY OF THE WALK, AND THE ONE THAT PROVED THE
     POINT. `parseRecord` and `read2` each carried their own; this one carried a
     third, and after the split the first two were repointed and this was not —
     `npm run record` failed with "draftEntries found no Record track", which is
     the right failure and the wrong number of places to fix. All three read
     `entriesArrayOf` now. */
  const entriesNode = entriesArrayOf(ast);
  if (!entriesNode)
    throw new Error("reveal/record-entries.mjs: draftEntries found no `entries` array");

  const dayFrom = (n) => {
    if (!epoch || typeof n !== "number") return null;
    const d = new Date(epoch + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + (n - 1));
    return d.toISOString().slice(0, 10);
  };
  const call = (node) => {
    if (!node || node.type !== "CallExpression" || node.callee.type !== "Identifier") return undefined;
    if (node.callee.name === "recordDay") {
      const a = node.arguments[0];
      return a && a.type === "Literal" ? dayFrom(a.value) : null;
    }
    if (node.callee.name === "placed") return strOf(node.arguments[0]);
    return null;
  };
  const val = (node) => {
    if (!node) return undefined;
    const s = strOf(node);
    if (s !== null) return s;
    const c = call(node);
    if (c !== undefined) return c;
    if (node.type === "Literal") return node.value;
    return null;
  };

  const unreadable = [];
  const out = entriesNode.elements
    .filter(el => el && el.type === "ObjectExpression")
    .map(el => {
      const e = {};
      const noNode = propOf(el, "no");
      e.no = noNode && noNode.type === "Literal" && typeof noNode.value === "number" ? noNode.value : null;
      for (const k of ["date", "title", "line", "lead", "tomb", "still", "stillCaption"]) {
        const node = propOf(el, k);
        if (!node) continue;
        const v = val(node);
        if (v === null) unreadable.push(`Record ${e.no}: \`${k}\``);
        else e[k] = v;
      }
      const secs = propOf(el, "sections");
      e.sections = (secs && secs.type === "ArrayExpression" ? secs.elements : [])
        .filter(s => s && s.type === "ObjectExpression")
        .map(s => {
          const bodyNode = propOf(s, "body");
          const body = bodyNode && bodyNode.type === "ArrayExpression"
            ? bodyNode.elements.map(b => {
                const v = strOf(b);
                if (v === null) unreadable.push(`Record ${e.no}: a section paragraph`);
                return v === null ? "" : v;
              })
            : [];
          return { label: strOf(propOf(s, "label")), body };
        });
      return e;
    });
  return { entries: out, epoch, unreadable };
}
