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

/* The Record lives on a track in the robots wing's spine. If it ever moves,
   this constant moves with it and the check below says so loudly. */
export const RECORD_SOURCE = "src/data/artists/robots.js";
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

function read() {
  if (CACHE) return CACHE;
  const file = path.join(REPO, RECORD_SOURCE);
  const src = fs.readFileSync(file, "utf8");
  const ast = Parser.parse(src, { ecmaVersion: "latest", sourceType: "module" });

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

  if (!track)
    throw new Error(
      `reveal/record-entries.mjs: no track with id "${RECORD_TRACK_ID}" and a face in ` +
      `${RECORD_SOURCE}. The Record has moved; this reader must move with it.`);

  const face = propOf(track, "face");
  const entriesNode = propOf(face, "entries");
  if (!entriesNode || entriesNode.type !== "ArrayExpression")
    throw new Error(`reveal/record-entries.mjs: the Record face has no \`entries\` array.`);

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

  CACHE = { entries, prose };
  return CACHE;
}

/** NUMBERS AND ASSET PATHS. The only thing the ledger is allowed to build from.
 *  `no` is null for an entry the Record has not numbered — see M19. Callers
 *  must refuse to mint an id for one rather than inventing a number. */
export function entries() { return read().entries.map(e => ({ ...e })); }

/** EVERY SENTENCE IN THE RECORD. Nothing builds from this; `reveal:check` uses
 *  it to prove no ledger row is holding any of them. */
export function prose() { return [...read().prose]; }
