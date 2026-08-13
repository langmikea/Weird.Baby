/* ===========================================================================
   THE APPROVAL — what a page shows, hashed, so a signature can expire itself.
   [2026-08-13]
   ---------------------------------------------------------------------------
   MIKE'S LAW: *"An approval is a signature on a page AS IT STOOD. Any change to
   what that page shows drops the approval, automatically. Ops never
   re-approves; Mike does."*

   That is a mechanism or it is a promise. The mechanism is a FINGERPRINT: a
   hash of everything the page shows. He signs a fingerprint. The moment the
   page shows something else, the fingerprint is different and the signature no
   longer matches anything — it does not have to be revoked, it simply stops
   applying. **Nothing has to remember to drop it**, which is the only version
   of this that survives a busy week.

   ═══ IT USES WHAT EXISTS, WHICH IS THE PROVENANCE REGISTER ══════════════════
   `provenance/register.json` is keyed by a 16-hex hash OF THE STRING, one row
   per visitor-facing string in `src/` and `index.html`, and the gate already
   refuses any undeclared string. So the register is, already, a complete and
   maintained hash of everything the museum says. This file does not build a
   second one; it groups the existing hashes by page.

   ═══ WHAT "A PAGE" IS, AND WHY IT IS NOT A FILE ═════════════════════════════
   MIKE, 2e: approval is PER PAGE. He approves what he sees. A page is a ROUTE
   in `src/App.jsx`, and what it shows is every string in every source file that
   route can reach — its component, everything that component imports, and so on
   down. `MuseumBar.jsx` is reached by eleven routes, so a word changed in the
   bar changes eleven pages, and eleven approvals drop. **That is correct and it
   is the thing to know before it happens** (`--blast`).

   ═══ THREE KINDS OF CHANGE COUNT, AND COMMENTS DO NOT ═══════════════════════
   A visitor sees three things, and the fingerprint is built from all three:

     1. THE WORDS — every register hash for a string declared in a reachable
        file. Comment-free by construction: the register holds string literals.
     2. THE LOOK — every reachable `.css` file, comments stripped and whitespace
        normalised. A colour token is a change to what the page shows; the
        paragraph of reasoning above it is not.
     3. THE PICTURES — every asset-table row whose `usedBy` names a reachable
        file, by `sha256`. Replacing a photograph with a different photograph at
        the same path changes what he approved.

   **COMMENTS ARE DELIBERATELY EXCLUDED and that is the difference between a
   mark that works and one that is always absent.** This repository is more than
   half comment by character in places; a fingerprint over raw file bytes would
   drop every approval in the building every time somebody explained something.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import crypto from "node:crypto";
import * as acorn from "acorn";
import jsxPlugin from "acorn-jsx";
import { sweep as sweepSource } from "../tools/provenance-sweep.mjs";

const Parser = acorn.Parser.extend(jsxPlugin());
const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const SRC = path.join(REPO, "src");
const APP = path.join(SRC, "App.jsx");
const REGISTER = path.join(REPO, "provenance", "register.json");
const ASSETS = path.join(REPO, "provenance", "asset-table.json");

export const APPROVALS_FILE = "provenance/approvals.json";
const APPROVALS = path.join(REPO, APPROVALS_FILE);

const sha = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");

/* ── THE ROUTE TABLE, READ OUT OF App.jsx ──────────────────────────────────
   PARSED, NEVER LISTED. A hand-kept copy of the routes would be a second list
   that drifts, and the first thing it would do is quietly stop covering a page
   Mike added — which is the one failure this whole mechanism exists to prevent.
   Every `<Route path="…" element={…}/>` is read off the AST, and the component
   names inside the element are resolved against the file's own imports. */
export function routeTable() {
  const src = fs.readFileSync(APP, "utf8");
  const ast = Parser.parse(src, { ecmaVersion: "latest", sourceType: "module" });

  /* local name -> resolved file, from both static and lazy imports */
  const imports = new Map();
  const addImport = (name, spec) => {
    const f = resolveImport(APP, spec);
    if (f) imports.set(name, f);
  };
  for (const node of ast.body) {
    if (node.type === "ImportDeclaration") {
      for (const s of node.specifiers) addImport(s.local.name, node.source.value);
    }
    /* `const X = lazy(() => import("./routes/…"))` */
    if (node.type === "VariableDeclaration") {
      for (const d of node.declarations) {
        const call = d.init;
        if (call && call.type === "CallExpression" && call.callee.name === "lazy") {
          const spec = findImportSpec(call);
          if (spec && d.id.name) addImport(d.id.name, spec);
        }
      }
    }
  }

  const routes = [];
  (function walk(n) {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) { n.forEach(walk); return; }
    if (n.type === "JSXElement" && n.openingElement
        && n.openingElement.name && n.openingElement.name.name === "Route") {
      let p = null, comps = [];
      for (const a of n.openingElement.attributes) {
        if (a.type !== "JSXAttribute") continue;
        if (a.name.name === "path" && a.value && a.value.type === "Literal") p = a.value.value;
        if (a.name.name === "element") comps = jsxComponentNames(a.value);
      }
      if (p) routes.push({ path: p, components: comps });
    }
    for (const k of Object.keys(n)) {
      if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
      walk(n[k]);
    }
  })(ast);

  /* ═══ A COMPONENT DEFINED IN App.jsx IS NOT AN UNRESOLVED IMPORT ══════════
     `/p/:id` renders `PresetLanding`, which is declared in App.jsx itself, so
     there is no import to resolve and the first cut filed the route as "shows
     nothing of its own". It happens to be true — PresetLanding returns null —
     and that is exactly why it was worth fixing: the NEXT local component will
     render something, and it would have been filed as a redirect and dropped
     out of the walk-list in silence. A locally-declared component's file is
     App.jsx, so App.jsx is its entry. */
  const localNames = new Set();
  for (const node of ast.body) {
    if (node.type === "FunctionDeclaration" && node.id) localNames.add(node.id.name);
    if (node.type === "VariableDeclaration")
      for (const d of node.declarations) if (d.id.name) localNames.add(d.id.name);
    if (node.type === "ExportDefaultDeclaration" && node.declaration
        && node.declaration.id) localNames.add(node.declaration.id.name);
  }
  /* names that come from a package (Navigate, Suspense) are not pages */
  const fromPackage = new Set();
  for (const node of ast.body)
    if (node.type === "ImportDeclaration" && !node.source.value.startsWith("."))
      for (const s of node.specifiers) fromPackage.add(s.local.name);

  return routes.map(r => {
    const entries = r.components.map(c => imports.get(c)).filter(Boolean);
    const local = r.components.filter(c => localNames.has(c) && !imports.has(c));
    return {
      path: r.path,
      entries: [...new Set(entries)],
      local,
      unresolved: r.components.filter(
        c => !imports.has(c) && !localNames.has(c) && !fromPackage.has(c)),
    };
  });
}

function findImportSpec(node) {
  let found = null;
  (function w(n) {
    if (!n || typeof n !== "object" || found) return;
    if (Array.isArray(n)) { n.forEach(w); return; }
    if (n.type === "ImportExpression" && n.source && n.source.type === "Literal")
      { found = n.source.value; return; }
    for (const k of Object.keys(n)) {
      if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
      w(n[k]);
    }
  })(node);
  return found;
}

function jsxComponentNames(value) {
  const out = [];
  (function w(n) {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) { n.forEach(w); return; }
    if (n.type === "JSXElement" && n.openingElement && n.openingElement.name) {
      const nm = n.openingElement.name.name;
      /* a lower-case tag is an HTML element, never a component */
      if (nm && /^[A-Z]/.test(nm)) out.push(nm);
    }
    for (const k of Object.keys(n)) {
      if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
      w(n[k]);
    }
  })(value);
  return out;
}

/* ── THE IMPORT GRAPH ──────────────────────────────────────────────────────
   Only relative imports inside `src/` are followed. A bare specifier is a
   package, and a package is not something Mike approves. */
const EXTS = ["", ".jsx", ".js", ".json", ".css", "/index.jsx", "/index.js"];
function resolveImport(fromFile, spec) {
  if (!spec.startsWith(".")) return null;
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const e of EXTS) {
    const p = base + e;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}

const IMPORT_CACHE = new Map();
function importsOf(file) {
  if (IMPORT_CACHE.has(file)) return IMPORT_CACHE.get(file);
  let out = [];
  if (/\.(js|jsx)$/.test(file)) {
    const code = fs.readFileSync(file, "utf8");
    let ast = null;
    try { ast = Parser.parse(code, { ecmaVersion: "latest", sourceType: "module" }); }
    catch { ast = null; }
    const specs = [];
    if (ast) {
      (function w(n) {
        if (!n || typeof n !== "object") return;
        if (Array.isArray(n)) { n.forEach(w); return; }
        if (n.type === "ImportDeclaration") specs.push(n.source.value);
        if (n.type === "ImportExpression" && n.source && n.source.type === "Literal")
          specs.push(n.source.value);
        if (n.type === "ExportNamedDeclaration" && n.source) specs.push(n.source.value);
        if (n.type === "ExportAllDeclaration" && n.source) specs.push(n.source.value);
        for (const k of Object.keys(n)) {
          if (k === "type" || k === "start" || k === "end" || k === "loc") continue;
          w(n[k]);
        }
      })(ast);
    }
    out = specs.map(s => resolveImport(file, s)).filter(Boolean);
  } else if (/\.css$/.test(file)) {
    /* `@import "./x.css"` — the tokens sheet reaches the faces this way */
    const code = fs.readFileSync(file, "utf8");
    const specs = [...code.matchAll(/@import\s+(?:url\()?["']([^"')]+)["']/g)].map(m => m[1]);
    out = specs.map(s => resolveImport(file, s)).filter(Boolean);
  }
  IMPORT_CACHE.set(file, out);
  return out;
}

/* ═══ THE SHELL BELONGS TO EVERY PAGE ═══════════════════════════════════════
   Every route renders inside `main.jsx`, which imports `./index.css`. That
   stylesheet and anything it reaches is on the glass of every page, so it is in
   every page's file set — and the first cut missed it, which meant a change to
   the house's own base sheet would have dropped nothing anywhere.
   `App.jsx` IS DELIBERATELY EXCLUDED from the shell walk. It imports every
   route component, so following it would give every page the whole museum's
   file set and one edit anywhere would drop all twelve approvals. App.jsx's own
   strings are the router's and are not shown to anybody. */
const MAIN = path.join(SRC, "main.jsx");
let SHELL = null;
function shellFiles() {
  if (SHELL) return SHELL;
  /* MAIN IS NOT A WALK ROOT, AND THAT WAS A ONE-LINE BUG WORTH NAMING: walking
     from main.jsx reaches App.jsx (it imports it), App.jsx imports every route
     component, and so the "shell" became the entire museum — every page came
     out with the same 2,292 strings and every page would have dropped together
     on any edit anywhere. Only main.jsx's NON-App imports are walked; main.jsx
     itself contributes its own file and nothing further. */
  const roots = importsOf(MAIN).filter(f => path.resolve(f) !== path.resolve(APP));
  /* ═══ AND THE SHARED STYLE LAYER, BECAUSE CSS IS NOT SCOPED BY IMPORTS ═════
     Vite emits ONE stylesheet for the app, so every rule in `src/` is live on
     every page whatever the import graph says — `Exhibit.css`'s own header
     records that ("Vite bundles every…"). Measured: `/booth` does not import
     `museum-tokens.css` through any chain, and its colours come from it anyway.
     So the import graph UNDERSTATES the look, and a palette edit would have
     dropped nothing on most pages.
     `src/styles/` — the tokens and the shared sheet — is treated as shell. It
     is the layer every page genuinely wears.
     WHAT THIS STILL DOES NOT MODEL, stated rather than hidden: a rule in
     `GiftShop.css` is also technically live on `/booth` and will not drop it.
     That is a deliberate floor, not an oversight — pricing every page-specific
     stylesheet into every page would drop all eleven approvals on any CSS edit
     anywhere, and a mark that is always absent is a mark nobody reads. */
  const shared = fs.readdirSync(path.join(SRC, "styles"))
    .filter(n => n.endsWith(".css"))
    .map(n => path.join(SRC, "styles", n));
  SHELL = [MAIN, ...filesFor([...roots, ...shared], true)];
  return SHELL;
}

/** every source file a route can reach, including itself */
export function filesFor(entries, noShell = false) {
  const seen = new Set();
  const stack = [...entries];
  while (stack.length) {
    const f = stack.pop();
    if (!f || seen.has(f)) continue;
    if (!f.startsWith(SRC)) continue;          /* never leave src/ */
    seen.add(f);
    for (const n of importsOf(f)) stack.push(n);
  }
  if (!noShell) for (const f of shellFiles()) seen.add(f);
  return [...seen].sort();
}

/* ── THE FINGERPRINT ───────────────────────────────────────────────────────
   Words + look + pictures. Each part is listed rather than merged so that
   `--why` can say WHICH of the three moved. */
const cssBody = (code) => code
  .replace(/\/\*[\s\S]*?\*\//g, " ")     /* comments are not shown to anyone */
  .replace(/\s+/g, " ")
  .trim();

/* ═══ THE WORDS COME FROM THE SOURCE, NOT FROM THE REGISTER ══════════════════
   THE FIRST CUT READ `register.json` AND IT DID NOT WORK. Proved by breaking
   it: a visitor-facing string was edited in `src/data/house-copy.js` and NO
   approval dropped, because the register is a GENERATED file that still held
   the old string's hash against the same filename. The word-set was identical
   and the fingerprint never moved.

   The register would catch up — the provenance gate refuses an undeclared
   string, so it is regenerated in the same commit — but "it drops once somebody
   regenerates a different file" is not Mike's law. His law is that the change
   itself drops it.

   So the fingerprint reads `sweep()`, which is `provenance-sweep.mjs` EXTRACTING
   FROM SOURCE — the same extractor the gate uses, so the two can never disagree
   about what a visitor-facing string is. The register is left doing its own job:
   saying where each string CAME FROM. This says what the page currently SHOWS. */
let SWEPT = null;
function swept() {
  if (!SWEPT) SWEPT = sweepSource().strings;
  return SWEPT;
}

export function fingerprintOf(files) {
  const assets = JSON.parse(fs.readFileSync(ASSETS, "utf8")).entries;
  const set = new Set(files.map(rel));

  const words = swept()
    .filter(s => set.has(s.file))
    .map(s => s.key + ":" + sha(s.text))
    .sort();

  const look = files.filter(f => /\.css$/.test(f))
    .map(f => rel(f) + ":" + sha(cssBody(fs.readFileSync(f, "utf8"))))
    .sort();

  const pictures = assets
    .filter(a => (a.usedBy || []).some(u => set.has(u)))
    .map(a => a.uid + ":" + String(a.sha256 || "missing").slice(0, 16))
    .sort();

  return {
    fp: sha(["W", ...words, "L", ...look, "P", ...pictures].join("\n")),
    parts: {
      words: sha(words.join("\n")), nWords: words.length,
      look: sha(look.join("\n")), nLook: look.length,
      pictures: sha(pictures.join("\n")), nPictures: pictures.length,
    },
  };
}

/* ── THE PAGES ─────────────────────────────────────────────────────────────
   `/money` is a redirect and `*` renders the Lobby, which is `/`. Neither is a
   page he can approve — a redirect shows nothing and the catch-all shows a page
   that already has its own row. They are RETURNED and marked rather than
   filtered out, so nobody wonders where they went. */
export function pages() {
  return routeTable().map(r => {
    /* AN UNRESOLVED COMPONENT IS A FAULT, NOT A REDIRECT. It is reported rather
       than filed as "shows nothing": a page nobody can fingerprint must be
       loud, because the failure it hides is a page Mike never gets asked to
       approve. */
    const notAPage =
      r.unresolved.length ? `UNREADABLE — cannot resolve ${r.unresolved.join(", ")}`
      /* ═══ A ROUTE COMPONENT DECLARED INSIDE App.jsx CANNOT BE SCOPED ═══════
         `/p/:id` renders `PresetLanding`, declared in App.jsx. Its entry file
         would be App.jsx — which imports every other route component — so the
         walk reported 1,812 strings for a component that renders `null`. The
         first cut instead filed it as a redirect, which was true of this one
         and would have been a silent lie about the next one.
         NEITHER ANSWER IS EARNED, so it says so and names the fix. */
      : r.local.length ? `${r.local.join(", ")} is declared inside App.jsx, so this `
        + `walker cannot tell what it shows without reading the whole app. Move it `
        + `into its own file and it joins the list`
      : r.entries.length === 0 ? "a redirect — it shows nothing of its own"
      : r.path === "*" ? "the catch-all; it renders the Lobby, which is `/`"
      : null;
    const files = notAPage ? [] : filesFor(r.entries);
    return {
      route: r.path,
      notAPage,
      unresolved: r.unresolved,
      files: files.map(rel),
      ...(notAPage ? { fp: null, parts: null } : fingerprintOf(files)),
    };
  });
}

/* ── THE RECORD OF WHAT HE SIGNED ──────────────────────────────────────────
   A FILE IN THE REPO, never a browser store. It survives a cache clear because
   it was never in the cache; it survives a new machine because it is committed.
   One row per route he has ever approved, holding the fingerprint AS IT STOOD.
   Ops never writes `by`. */
export function readApprovals() {
  if (!fs.existsSync(APPROVALS)) {
    return { _: APPROVALS_DOC, version: 1, approvals: {} };
  }
  return JSON.parse(fs.readFileSync(APPROVALS, "utf8"));
}

export function writeApprovals(a) {
  a._ = APPROVALS_DOC;
  fs.writeFileSync(APPROVALS, JSON.stringify(a, null, 1) + "\n");
}

export const APPROVALS_DOC =
  "MIKE'S SIGNATURES. One row per page he has personally approved, holding the "
+ "fingerprint of what that page showed at the moment he signed. If the page "
+ "changes, its fingerprint changes and the signature stops matching — it is "
+ "not revoked, it stops applying. Ops must never add or edit a row here; "
+ "`npm run approve` writes it and only Mike runs it. See reveal/approval.mjs.";

/** the state of every page: approved / dropped / never */
export function state() {
  const rec = readApprovals().approvals || {};
  return pages().map(p => {
    if (p.notAPage) return { ...p, status: "n/a" };
    const sig = rec[p.route];
    if (!sig) return { ...p, status: "never", signed: null };
    if (sig.fp === p.fp) return { ...p, status: "approved", signed: sig };
    const moved = [];
    if (sig.parts) {
      if (sig.parts.words !== p.parts.words) moved.push("the words");
      if (sig.parts.look !== p.parts.look) moved.push("the look");
      if (sig.parts.pictures !== p.parts.pictures) moved.push("the pictures");
    }
    return { ...p, status: "dropped", signed: sig, moved };
  });
}

/** which routes a given source file appears on — the blast radius (2e) */
export function blastOf(file) {
  const f = String(file).replace(/\\/g, "/");
  return pages().filter(p => !p.notAPage && p.files.includes(f)).map(p => p.route);
}
