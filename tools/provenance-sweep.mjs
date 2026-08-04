#!/usr/bin/env node
// tools/provenance-sweep.mjs
// ============================================================================
// THE PROVENANCE BOUNDARY SWEEP  [P1/P2, 2026-08-04]
// ============================================================================
// WHY THIS EXISTS. Doctrine 11 (the Law of the Visible Line) and Doctrine 12
// (Ops Does Not Invent Content) are RULES, and a rule only catches what a
// reader thinks to look at. "436 records, kept since January 2024" PASSED
// Doctrine 11 cleanly — its subject is the collection, not the making of the
// museum — and it was invented. Then twenty-seven meta strings were found, then
// ten more, then a wireframe with four room names painted into a JPEG. Every
// sweep found the next generation because every sweep was TEXTUAL: it searched
// for phrasings someone had already learned to distrust.
//
// The structural cause is not any of those strings. It is that a string could
// enter this codebase and NOTHING AT THE BOUNDARY ASKED WHERE IT CAME FROM.
//
// WHAT THIS DOES. It enumerates every visitor-facing string in the authored
// source, and requires each one to be ACCOUNTED FOR in provenance/register.json
// with an origin class. A string nobody has declared fails the gate. That is
// the whole mechanism: it does not judge content, it makes undeclared content
// impossible to ship quietly.
//
// WHAT IT DOES NOT DO — and this matters more than what it does, because a
// mechanism that overstates its coverage is worse than no mechanism:
//   * It CANNOT verify that a declaration is true. Nothing can. "MIKE" on a
//     line is a claim by whoever wrote the register line, reviewable by reading
//     it, not provable by a machine.
//   * It CANNOT see text baked into an image. That is what the /hr/home
//     wireframe was, and it is why provenance/assets.json exists beside this.
//   * It CANNOT see text assembled at runtime from parts, or arriving from the
//     D1 guest book, or typed by a visitor.
// The full honest boundary is in provenance/README.md §"What this cannot see".
//
// HOW THE HASH WORKS, and it is the load-bearing part. A declaration is keyed
// by sha256(relative file path + NUL + exact string). EDIT THE STRING AND THE
// KEY CHANGES, so the old declaration no longer covers it and the gate fails
// until someone re-declares. You cannot edit a sourced line into an invented
// one without the boundary noticing. That is the difference between this and a
// one-time audit.
//
// USAGE
//   node tools/provenance-sweep.mjs              report (human), exit 0
//   node tools/provenance-sweep.mjs --gate       CI/packet gate, exit 1 on fail
//   node tools/provenance-sweep.mjs --emit       write undeclared stubs to
//                                                provenance/_undeclared.json
//   node tools/provenance-sweep.mjs --rules      print exclusion-rule hit counts
//   node tools/provenance-sweep.mjs --class=X    list every entry in class X
//   node tools/provenance-sweep.mjs --prune      drop register rows whose
//                                                string is no longer in source
// ============================================================================

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as acorn from "acorn";
import jsxPlugin from "acorn-jsx";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const Parser = acorn.Parser.extend(jsxPlugin());

// ---------------------------------------------------------------------------
// THE CLASSES.  Anything that fits none of these cannot exist on the glass.
// ---------------------------------------------------------------------------
export const CLASSES = {
  MIKE: "supplied by the operator — his words, his facts, his rulings. `s` names where his supply is on record.",
  VERIFIED: "external and sourced. `s` is the citation.",
  DERIVED: "machine-computed from real data at read time — counts, dates, states. `s` names the computation.",
  HOUSE: "functional UI chrome — button labels, nav, form fields, separators, empty states.",
  // ---- THE FIFTH CLASS, WHICH MIKE'S BRIEF DID NOT NAME ---------------------
  // His four are ORIGINS. A museum also prints Ops-written connective prose that
  // originates nothing: a lead sentence introducing facts sourced two lines
  // below it, an answer rephrasing a charter clause. Calling that MIKE is false
  // (the sentence is not his). Calling it INVENTION is also false, and worse —
  // it would bury the real inventions under nine hundred rows of ordinary
  // editorial and train everyone to skim the list.
  // SO IT GETS ITS OWN CLASS, AND THE CLASS HAS TEETH: a RESTATED row must name
  // in `r` what it restates, and the gate RESOLVES those references — a register
  // key that exists and carries an origin, or a repo path that is on disk. It
  // cannot be a shrug.
  // THE TEST THAT EARNED IT: "436 records, kept since January 2024" has nothing
  // to put in `r`. It fails to RESTATED and lands in INVENTION, which is the
  // whole reason this file exists.
  RESTATED: "Ops prose that adds no specific. `r` must resolve to a sourced row or a repo path.",
  // Not an origin. A holding pen for what the backfill could not place, kept
  // visible and capped so it can only ever shrink. Mike rules on these.
  INVENTION: "no origin found — awaiting the operator's ruling, capped, never grows",
};
const ORIGIN_CLASSES = ["MIKE", "VERIFIED", "DERIVED", "HOUSE", "RESTATED"];
const NEEDS_SOURCE = new Set(["MIKE", "VERIFIED", "DERIVED"]);

// ---------------------------------------------------------------------------
// SCOPE.  What counts as authored source that can put words on the glass.
// ---------------------------------------------------------------------------
const SCAN_DIRS = ["src"];
const EXTRA_FILES = ["index.html"];
const SKIP_RE = /\.(pre-|old_v|bak_)|\.pre-[\w-]+$|node_modules|\.log$/;

// Files whose strings are MACHINE-GENERATED by a named tool from a named
// upstream. Declared in bulk at file level in provenance/register.json under
// `generated`, because re-hashing 1,900 rows on every export is noise that
// would train a reader to rubber-stamp the diff. The claim being made is about
// the PIPELINE, and the pipeline is the thing to review.
const GENERATED = new Set([
  "src/data/exhibits/hunter_root.json",
  "src/data/exhibits/hunter_root.facts.json",
  "src/data/vocabulary.json",
  "src/data/era-buckets.json",
]);

// JSX attributes that PUT TEXT ON THE GLASS. Everything else on a JSX element
// is plumbing (className, style, src, href, role, data-*, viewBox, d…).
const TEXT_ATTRS = new Set([
  "alt", "title", "placeholder", "label", "content", "aria-label",
  "aria-description", "aria-valuetext", "aria-placeholder", "download", "summary",
]);

// CSS property names, camelCased — used to recognise inline-style object values.
const CSS_PROPS = new Set(`alignContent alignItems alignSelf animation animationDelay animationDirection
animationDuration animationFillMode animationIterationCount animationName animationTimingFunction
appearance aspectRatio backdropFilter backfaceVisibility background backgroundAttachment
backgroundBlendMode backgroundClip backgroundColor backgroundImage backgroundOrigin backgroundPosition
backgroundRepeat backgroundSize blockSize border borderBottom borderBottomColor borderBottomLeftRadius
borderBottomRightRadius borderBottomStyle borderBottomWidth borderCollapse borderColor borderImage
borderLeft borderLeftColor borderLeftStyle borderLeftWidth borderRadius borderRight borderRightColor
borderRightStyle borderRightWidth borderSpacing borderStyle borderTop borderTopColor borderTopLeftRadius
borderTopRightRadius borderTopStyle borderTopWidth borderWidth bottom boxShadow boxSizing captionSide
caretColor clear clip clipPath color columnCount columnFill columnGap columnRule columnSpan columnWidth
columns content counterIncrement counterReset cursor direction display emptyCells fill filter flex
flexBasis flexDirection flexFlow flexGrow flexShrink flexWrap float font fontFamily fontFeatureSettings
fontKerning fontSize fontSizeAdjust fontStretch fontStyle fontVariant fontVariantNumeric fontWeight gap
grid gridArea gridAutoColumns gridAutoFlow gridAutoRows gridColumn gridColumnEnd gridColumnStart gridGap
gridRow gridRowEnd gridRowStart gridTemplate gridTemplateAreas gridTemplateColumns gridTemplateRows
height hyphens inset insetBlock insetInline isolation justifyContent justifyItems justifySelf left
letterSpacing lineHeight listStyle listStyleImage listStylePosition listStyleType margin marginBottom
marginLeft marginRight marginTop mask maskImage maskSize maxHeight maxWidth minHeight minWidth mixBlendMode
objectFit objectPosition opacity order outline outlineColor outlineOffset outlineStyle outlineWidth
overflow overflowAnchor overflowWrap overflowX overflowY padding paddingBottom paddingLeft paddingRight
paddingTop perspective perspectiveOrigin placeContent placeItems placeSelf pointerEvents position quotes
resize right rowGap scrollBehavior scrollMargin scrollPadding scrollSnapAlign scrollSnapType scrollbarWidth
shapeOutside stroke strokeWidth tabSize tableLayout textAlign textDecoration textDecorationColor
textDecorationLine textIndent textOverflow textRendering textShadow textTransform textUnderlineOffset
textWrap top touchAction transform transformOrigin transformStyle transition transitionDelay
transitionDuration transitionProperty transitionTimingFunction translate userSelect verticalAlign
visibility whiteSpace width willChange wordBreak wordSpacing writingMode zIndex zoom
WebkitBackdropFilter WebkitBoxOrient WebkitLineClamp WebkitMaskImage WebkitOverflowScrolling
WebkitTapHighlightColor WebkitTextFillColor WebkitTextStroke WebkitFontSmoothing MozOsxFontSmoothing`
  .split(/\s+/).filter(Boolean));

// Call targets whose string arguments are machinery, never glass.
const SINK_ALL = new Set([
  "console.log", "console.warn", "console.error", "console.info", "console.debug",
  "localStorage.getItem", "localStorage.setItem", "localStorage.removeItem",
  "sessionStorage.getItem", "sessionStorage.setItem", "sessionStorage.removeItem",
  "addEventListener", "removeEventListener", "querySelector", "querySelectorAll",
  "getElementById", "getElementsByClassName", "getElementsByTagName", "closest",
  "matches", "createElement", "createElementNS", "getAttribute", "removeAttribute",
  "hasAttribute", "getPropertyValue", "removeProperty", "matchMedia", "fetch",
  "navigate", "JSON.parse", "encodeURIComponent", "decodeURIComponent", "atob", "btoa",
  "parseInt", "parseFloat", "Number", "split", "startsWith", "endsWith", "indexOf",
  "lastIndexOf", "charAt", "codePointAt", "normalize", "localeCompare", "toLowerCase",
  "toUpperCase", "test", "exec", "getComputedStyle", "requestAnimationFrame",
  "clearTimeout", "clearInterval", "assign", "hasOwnProperty", "getTime",
  "toISOString", "toLocaleDateString", "toLocaleTimeString",
]);
const SINK_FIRST_ARG = new Set([
  "setAttribute", "setProperty", "add", "remove", "toggle", "contains",
  "replace", "replaceAll", "on", "off", "emit", "postMessage",
]);

// Value shapes that CANNOT be prose. Narrow on purpose — each is a claim that
// the string is unreadable as a sentence, not a claim about where it lives.
const SHAPE_TOKEN = /^(--[\w-]+|var\(--[\w-]+\)?[\s\S]*|#[0-9a-fA-F]{3,8})$/;
const SHAPE_NUMERIC = /^-?[\d.]+(px|rem|em|%|vh|vw|vmin|vmax|s|ms|deg|fr|ch|ex|pt)?$/;
const SHAPE_ASSET = /^\.{0,2}\/?[\w\-./@ ]+\.(jpg|jpeg|png|webp|gif|svg|avif|ico|woff2?|ttf|otf|mp3|mp4|webm|wav|m4a|json)$/i;
const SHAPE_URL = /^(https?:\/\/|mailto:|tel:|data:|\/\/)/;
const SHAPE_SLUG = /^[a-z0-9]+(?:[-_:.][a-z0-9]+)*$/;
const SHAPE_SQL = /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|PRAGMA|BEGIN|COMMIT)\b/i;
const SHAPE_MIME = /^[a-z]+\/[a-z0-9.+-]+$/;
const SHAPE_METHODS = /^(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)(\s*,\s*(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD))*$/;
const SHAPE_SELECTOR = /^[.#][\w-]+(\s*[,>+~]?\s*[.#:[\]="'\w-]+)*$/;
// Keys whose values are vocabulary, NOT sentences — and the SHAPE_SLUG guard is
// what keeps this honest: `source: ["wiki"]` is a tag and drops out, while
// `source: "Shore Fire Media's release note"` under the same key is a citation
// printed on a card and stays on the boundary.
const SLUG_KEYS = new Set([
  "id", "slug", "key", "event", "ytId", "namespace", "room", "kind", "type",
  "accent", "ns", "code", "album", "albumId", "trackId", "exhibit", "media_type",
  "content_kind", "status", "flow", "tab", "field", "name_slug", "value",
  "source", "topic", "people", "venue", "song", "year", "era", "place", "subject",
]);

// ---------------------------------------------------------------------------
// Every look-away is counted AND sampled. `--rule-sample=<name>` prints what a
// rule actually swallowed, so an over-broad exclusion can be caught by reading
// rather than by waiting for it to hide something that matters.
const ruleHits = Object.create(null);
const ruleSamples = Object.create(null);
let sampleCtx = null;
function excluded(rule) {
  ruleHits[rule] = (ruleHits[rule] || 0) + 1;
  (ruleSamples[rule] ||= []);
  if (ruleSamples[rule].length < 60 && sampleCtx) ruleSamples[rule].push(sampleCtx);
  return true;
}

function listFiles(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP_RE.test(p)) continue;
    if (e.isDirectory()) listFiles(p, out);
    else out.push(p);
  }
  return out;
}

const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");
export function keyOf(file, text) {
  return crypto.createHash("sha256").update(`${file} ${text}`).digest("hex").slice(0, 16);
}

// ---------------------------------------------------------------------------
// EXTRACTION.  Default-DENY: every string in authored source is content until a
// NAMED, COUNTED structural rule proves it is machinery. The inversion is the
// point — a heuristic that decides what to LOOK at reproduces the failure this
// tool exists to fix, so the heuristics only decide what to look AWAY from, and
// every look-away is counted and printed by --rules so an over-broad rule shows
// up as a suspiciously large number rather than as silence.
// ---------------------------------------------------------------------------
function calleeName(node) {
  if (!node) return "";
  if (node.type === "Identifier") return node.name;
  if (node.type === "MemberExpression" && !node.computed) {
    const obj = node.object.type === "Identifier" ? node.object.name
      : node.object.type === "MemberExpression" && !node.object.computed && node.object.property.type === "Identifier"
        ? node.object.property.name : "";
    const prop = node.property.type === "Identifier" ? node.property.name : "";
    return obj ? `${obj}.${prop}` : prop;
  }
  return "";
}

// A concat chain of string literals is ONE sentence a visitor reads, not five
// fragments; a template literal is one label. Coalescing them is not cosmetic —
// a register row holding `"named in it, and neither is a metaphor for "` cannot
// be reviewed for provenance by anyone, and a reviewer who cannot judge a row
// signs it anyway. Rows must be whole thoughts.
function concatLeaves(node, out = []) {
  if (node.type === "BinaryExpression" && node.operator === "+") {
    concatLeaves(node.left, out); concatLeaves(node.right, out); return out;
  }
  out.push(node); return out;
}
function isStringConcat(node) {
  if (node.type !== "BinaryExpression" || node.operator !== "+") return false;
  const leaves = concatLeaves(node);
  return leaves.some((l) => l.type === "Literal" && typeof l.value === "string")
    && leaves.every((l) => (l.type === "Literal" && typeof l.value === "string")
      || l.type === "Identifier" || l.type === "MemberExpression" || l.type === "CallExpression");
}

function extractFromJs(file, src) {
  const found = [];
  const assets = [];
  let ast;
  try {
    ast = Parser.parse(src, { ecmaVersion: "latest", sourceType: "module", locations: true });
  } catch (e) {
    throw new Error(`parse failed: ${file}: ${e.message}`);
  }

  const parents = new Map();
  const consumed = new Set();

  function visit(node, parent) {
    if (!node || typeof node.type !== "string") return;
    parents.set(node, parent);

    // -- coalesced units ----------------------------------------------------
    if (!consumed.has(node) && isStringConcat(node)) {
      const leaves = concatLeaves(node);
      const text = leaves.map((l) => (l.type === "Literal" ? String(l.value) : "{}")).join("");
      leaves.forEach((l) => consumed.add(l));
      take(node, text, parent);
      for (const l of leaves) if (l.type !== "Literal") visit(l, node);
      return;
    }
    if (node.type === "TemplateLiteral") {
      const text = node.quasis
        .map((q, i) => (q.value.cooked ?? q.value.raw) + (i < node.expressions.length ? "{}" : ""))
        .join("");
      take(node, text, parent);
      for (const e of node.expressions) visit(e, node);
      return;
    }

    if (node.type === "Literal" && typeof node.value === "string" && !consumed.has(node))
      take(node, node.value, parent);
    else if (node.type === "JSXText") take(node, node.value, parent);

    for (const k of Object.keys(node)) {
      if (k === "type" || k === "loc" || k === "start" || k === "end" || k === "range") continue;
      const v = node[k];
      if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") visit(c, node); }
      else if (v && typeof v.type === "string") visit(v, node);
    }
  }

  function ancestors(node) {
    const out = [];
    let p = parents.get(node);
    while (p) { out.push(p); p = parents.get(p); }
    return out;
  }

  function take(node, raw, parent) {
    const text = String(raw);
    const trimmed = text.trim();
    if (!trimmed) return excluded("empty-or-whitespace");
    const line = node.loc ? node.loc.start.line : 0;
    sampleCtx = `${file}:${line}  ${JSON.stringify(text.slice(0, 110))}`;

    // -- structural exclusions, in order, each named ------------------------
    if (parent) {
      if ((parent.type === "ImportDeclaration" || parent.type === "ExportNamedDeclaration"
        || parent.type === "ExportAllDeclaration" || parent.type === "ImportExpression")
        && parent.source === node) return excluded("module-specifier");
      if (parent.type === "Property" && parent.key === node && !parent.computed) return excluded("property-key");
      if (parent.type === "JSXAttribute") {
        const an = parent.name && (parent.name.name ?? `${parent.name.namespace?.name}:${parent.name.name?.name}`);
        if (!TEXT_ATTRS.has(String(an))) return excluded("jsx-plumbing-attribute");
      }
      if ((parent.type === "BinaryExpression" && /^[=!]==?$/.test(parent.operator))
        || parent.type === "SwitchCase") return excluded("comparison-operand");
      if (parent.type === "Property" && parent.value === node && !parent.computed) {
        const kn = parent.key.type === "Identifier" ? parent.key.name
          : parent.key.type === "Literal" ? String(parent.key.value) : "";
        if (CSS_PROPS.has(kn)) return excluded("inline-style-value");
        if (SLUG_KEYS.has(kn) && SHAPE_SLUG.test(trimmed)) return excluded("identifier-value");
      }
      // A slug inside an array that a slug-named key owns: `videos: [...]`,
      // `topic: ["origins"]`. Same claim as identifier-value, one level in.
      if (parent.type === "ArrayExpression" && SHAPE_SLUG.test(trimmed)) {
        const gp = parents.get(parent);
        if (gp && gp.type === "Property" && !gp.computed) {
          const kn = gp.key.type === "Identifier" ? gp.key.name
            : gp.key.type === "Literal" ? String(gp.key.value) : "";
          if (SLUG_KEYS.has(kn)) return excluded("identifier-value");
        }
        // An array of NOTHING BUT slugs is a vocabulary list wherever it lives
        // and whatever it is called. This is a claim about the array's SHAPE,
        // not about anyone remembering to name the key well.
        if (parent.elements.length > 1 && parent.elements.every(
          (e) => e && e.type === "Literal" && typeof e.value === "string" && SHAPE_SLUG.test(e.value.trim())
        )) return excluded("identifier-value");
      }
      if (parent.type === "ImportAttribute") return excluded("module-specifier");
      if (parent.type === "MemberExpression" && parent.computed && parent.property === node)
        return excluded("property-key");
    }
    // A string that ends up inside a JSX attribute that is not a text attribute
    // is plumbing however many helpers it passes through on the way —
    // `className={[...].filter(Boolean).join(" ")}` is the live case. The walk
    // stops at a function boundary, because a string inside a handler body is
    // no longer describing the attribute it is lexically under.
    for (const a of ancestors(node)) {
      if (a.type === "ArrowFunctionExpression" || a.type === "FunctionExpression"
        || a.type === "FunctionDeclaration") break;
      if (a.type === "JSXAttribute") {
        const an = a.name && (a.name.name ?? "");
        if (!TEXT_ATTRS.has(String(an))) return excluded("jsx-plumbing-attribute");
        break;
      }
      if (a.type === "JSXElement" || a.type === "JSXFragment") break;
    }
    for (const a of ancestors(node)) {
      // TAXONOMY. Everything under a `tags` key is filter/search vocabulary —
      // slugs a query matches on, not sentences a visitor reads. The wing's own
      // rule (robots.js B12) is that a tag is a word someone might TYPE.
      if (a.type === "Property" && !a.computed
        && ((a.key.type === "Identifier" && a.key.name === "tags")
          || (a.key.type === "Literal" && a.key.value === "tags"))) return excluded("taxonomy-tag");
    }
    for (const a of ancestors(node)) {
      if (a.type === "CallExpression" || a.type === "NewExpression") {
        const cn = calleeName(a.callee) || (a.callee?.name ?? "");
        const short = cn.includes(".") ? cn.split(".").pop() : cn;
        if (SINK_ALL.has(cn) || SINK_ALL.has(short)) return excluded("machinery-call");
        if ((SINK_FIRST_ARG.has(cn) || SINK_FIRST_ARG.has(short)) && a.arguments[0] === node)
          return excluded("machinery-call");
        if (cn === "CustomEvent" || cn === "Event" || cn === "URL" || cn === "URLSearchParams"
          || cn === "RegExp" || cn === "Date") return excluded("machinery-call");
        break;
      }
      if (a.type === "JSXAttribute") {
        const an = a.name && (a.name.name ?? "");
        if (!TEXT_ATTRS.has(String(an))) return excluded("jsx-plumbing-attribute");
        break;
      }
    }
    if (SHAPE_SQL.test(trimmed)) return excluded("sql-statement");
    if (SHAPE_MIME.test(trimmed) || SHAPE_METHODS.test(trimmed)) return excluded("http-protocol");
    if (SHAPE_TOKEN.test(trimmed)) return excluded("design-token-or-colour");
    if (SHAPE_SELECTOR.test(trimmed)) return excluded("css-selector");
    if (SHAPE_NUMERIC.test(trimmed)) return excluded("numeric-or-unit");
    if (SHAPE_URL.test(trimmed)) { assets.push({ file, line, ref: trimmed, kind: "url" }); return excluded("url"); }
    if (SHAPE_ASSET.test(trimmed)) { assets.push({ file, line, ref: trimmed, kind: "asset" }); return excluded("asset-path"); }

    found.push({
      file, line, text: node.type === "JSXText" ? trimmed : text,
      path: pathOf(node), ipath: pathOf(node, true),
    });
  }

  // A STABLE STRUCTURAL PATH for every string — `ARTISTS[].tracks[].face
  // .sideboxes[].v`, `<button>.title`, `<p>#text`. Array indices are dropped on
  // purpose so the path survives inserting an artist, and so a provenance rule
  // can be written against a POSITION IN THE SHAPE rather than a line number
  // that the next edit invalidates. It is also the review aid: a reader
  // scanning the register sees what each row IS, not just what it says.
  // `indexed` keeps the array subscripts. The stable form is what rules are
  // written against; the indexed form is what says WHICH artist, WHICH face —
  // which is how a RESTATED row finds the sourced rows standing beside it.
  function pathOf(node, indexed = false) {
    const parts = [];
    let cur = node;
    for (const a of ancestors(node)) {
      if (a.type === "Property" && a.value === cur && !a.computed) {
        parts.push(a.key.type === "Identifier" ? a.key.name : String(a.key.value));
      } else if (a.type === "ArrayExpression") {
        parts.push(indexed ? `[${a.elements.indexOf(cur)}]` : "[]");
      } else if (a.type === "VariableDeclarator" && a.init === cur && a.id.type === "Identifier") {
        parts.push(a.id.name);
      } else if (a.type === "JSXAttribute") {
        parts.push("@" + (a.name?.name ?? "?"));
      } else if (a.type === "JSXElement") {
        const n = a.openingElement?.name;
        parts.push("<" + (n?.name ?? (n?.property?.name) ?? "?") + ">");
      } else if (a.type === "CallExpression" && a.callee.type === "Identifier") {
        parts.push(a.callee.name + "()");
      } else if (a.type === "FunctionDeclaration" && a.id) {
        parts.push(a.id.name + "{}");
      }
      cur = a;
    }
    return parts.reverse().join(".").replace(/\.(\[[\d\]]*\])/g, "$1") || "#";
  }

  visit(ast, null);
  return { found, assets };
}

// CSS `content:` puts literal text on the glass and no JS sweep can see it.
function extractFromCss(file, src) {
  const found = [];
  const assets = [];
  const re = /(^|[;{}\s])content\s*:\s*(["'])((?:\\.|(?!\2)[\s\S])*)\2/g;
  let m;
  while ((m = re.exec(src))) {
    const text = m[3];
    if (!text.trim()) continue;
    const line = src.slice(0, m.index).split("\n").length;
    found.push({ file, line, text });
  }
  const urlRe = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
  while ((m = urlRe.exec(src))) {
    const line = src.slice(0, m.index).split("\n").length;
    assets.push({ file, line, ref: m[1].trim(), kind: "css-url" });
  }
  return { found, assets };
}

// index.html — the shell's own title, meta description and any body copy.
function extractFromHtml(file, src) {
  const found = [];
  const push = (text, idx) => {
    if (text && text.trim()) found.push({ file, line: src.slice(0, idx).split("\n").length, text: text.trim() });
  };
  let m;
  const titleRe = /<title[^>]*>([\s\S]*?)<\/title>/gi;
  while ((m = titleRe.exec(src))) push(m[1], m.index);
  const metaRe = /<meta[^>]*?(?:name|property)\s*=\s*["'](description|og:[\w:]+|twitter:[\w:]+|apple-mobile-web-app-title)["'][^>]*?content\s*=\s*["']([^"']*)["']/gi;
  while ((m = metaRe.exec(src))) push(m[2], m.index);
  const noscriptRe = /<noscript[^>]*>([\s\S]*?)<\/noscript>/gi;
  while ((m = noscriptRe.exec(src))) push(m[1].replace(/<[^>]+>/g, " "), m.index);
  return { found, assets: [] };
}

// ---------------------------------------------------------------------------
export function sweep() {
  const files = [];
  for (const d of SCAN_DIRS) if (fs.existsSync(path.join(REPO, d))) listFiles(path.join(REPO, d), files);
  for (const f of EXTRA_FILES) if (fs.existsSync(path.join(REPO, f))) files.push(path.join(REPO, f));

  const strings = [];
  const assetRefs = [];
  const generatedSeen = [];
  const parseErrors = [];

  for (const abs of files) {
    const r = rel(abs);
    const ext = path.extname(abs).toLowerCase();
    if (GENERATED.has(r)) { generatedSeen.push(r); continue; }
    let src;
    try { src = fs.readFileSync(abs, "utf8"); } catch { continue; }
    try {
      let res = null;
      if (ext === ".js" || ext === ".jsx" || ext === ".mjs") res = extractFromJs(r, src);
      else if (ext === ".css") res = extractFromCss(r, src);
      else if (ext === ".html") res = extractFromHtml(r, src);
      else if (ext === ".json") continue; // non-generated JSON in src/ is config
      if (res) { strings.push(...res.found); assetRefs.push(...res.assets); }
    } catch (e) { parseErrors.push(`${r}: ${e.message}`); }
  }

  for (const s of strings) s.key = keyOf(s.file, s.text);
  return {
    strings, assetRefs, generatedSeen, parseErrors,
    ruleHits: { ...ruleHits }, ruleSamples: { ...ruleSamples },
  };
}

// ---------------------------------------------------------------------------
const REGISTER_PATH = path.join(REPO, "provenance", "register.json");
const ASSETS_PATH = path.join(REPO, "provenance", "assets.json");

export function loadRegister() {
  if (!fs.existsSync(REGISTER_PATH)) {
    return { inventionCeiling: 0, generated: {}, entries: {} };
  }
  return JSON.parse(fs.readFileSync(REGISTER_PATH, "utf8"));
}
export function loadAssets() {
  if (!fs.existsSync(ASSETS_PATH)) return { entries: {} };
  return JSON.parse(fs.readFileSync(ASSETS_PATH, "utf8"));
}

function assetKeyOf(ref) { return crypto.createHash("sha256").update(ref).digest("hex").slice(0, 16); }

export function evaluate() {
  const s = sweep();
  const reg = loadRegister();
  const assetReg = loadAssets();

  const undeclared = [];
  const badVerified = [];
  const badRestated = [];
  const badClass = [];
  const counts = Object.fromEntries([...ORIGIN_CLASSES, "INVENTION"].map((c) => [c, 0]));
  const inventions = [];

  for (const str of s.strings) {
    const row = reg.entries[str.key];
    if (!row) { undeclared.push(str); continue; }
    const cls = row.c;
    if (!ORIGIN_CLASSES.includes(cls) && cls !== "INVENTION") { badClass.push({ ...str, cls }); continue; }
    counts[cls]++;
    if (NEEDS_SOURCE.has(cls) && !String(row.s || "").trim()) badVerified.push({ ...str, cls });
    // RESTATED must RESOLVE. Every reference is either a live register key
    // carrying an origin, or a path that exists in this repo. A dangling
    // reference is the class quietly becoming a shrug, so it fails the gate.
    if (cls === "RESTATED") {
      const refs = [].concat(row.r || []);
      if (!refs.length) badRestated.push({ ...str, why: "no `r` reference" });
      for (const ref of refs) {
        // Strongest form: a register key that carries a real origin.
        const asKey = reg.entries[ref];
        if (asKey && ORIGIN_CLASSES.includes(asKey.c) && asKey.c !== "RESTATED") continue;
        // Weaker but legal: a document in this repo. NOT the file the string
        // itself lives in — "this sentence restates its own file" is the shrug
        // this class exists to make impossible, and it is exactly the shape
        // "436 records, kept since January 2024" would have taken.
        const p = ref.split("#")[0].split(":")[0];
        if (p && p !== str.file && fs.existsSync(path.join(REPO, p))) continue;
        badRestated.push({ ...str, why: `unresolvable reference ${JSON.stringify(ref)}` });
      }
    }
    if (cls === "INVENTION") inventions.push({ ...str, note: row.n || "" });
  }

  // Register rows whose string is gone from source.
  const live = new Set(s.strings.map((x) => x.key));
  const stale = Object.keys(reg.entries).filter((k) => !live.has(k));

  // Generated files must each carry a pipeline declaration.
  const generatedUndeclared = s.generatedSeen.filter((f) => !reg.generated || !reg.generated[f]);

  // Assets: every referenced image must be declared, including whether it
  // carries text a string sweep cannot read.
  const seenAssets = new Map();
  for (const a of s.assetRefs) {
    if (a.kind === "url") continue;
    if (!/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(a.ref)) continue;
    const k = assetKeyOf(a.ref);
    if (!seenAssets.has(k)) seenAssets.set(k, { ...a, key: k });
  }
  const undeclaredAssets = [...seenAssets.values()].filter((a) => !assetReg.entries[a.key]);
  const textBearingAssets = [...seenAssets.values()].filter(
    (a) => assetReg.entries[a.key] && assetReg.entries[a.key].textInImage === true
  );

  const ceiling = Number(reg.inventionCeiling ?? 0);
  const failures = [];
  if (s.parseErrors.length) failures.push(`${s.parseErrors.length} file(s) failed to parse`);
  if (undeclared.length) failures.push(`${undeclared.length} UNDECLARED visitor-facing string(s)`);
  if (badClass.length) failures.push(`${badClass.length} row(s) carry an unknown class`);
  if (badVerified.length) failures.push(`${badVerified.length} sourced-class row(s) carry no source`);
  if (badRestated.length) failures.push(`${badRestated.length} RESTATED row(s) do not resolve`);
  if (generatedUndeclared.length) failures.push(`${generatedUndeclared.length} generated file(s) undeclared`);
  if (undeclaredAssets.length) failures.push(`${undeclaredAssets.length} UNDECLARED visual asset(s)`);
  if (inventions.length > ceiling)
    failures.push(`INVENTION count ${inventions.length} exceeds ceiling ${ceiling}`);

  return {
    ...s, reg, counts, undeclared, inventions, stale, badVerified, badRestated, badClass,
    generatedUndeclared, undeclaredAssets, textBearingAssets, ceiling, failures,
    assetsSeen: [...seenAssets.values()], unreachable: unreachableFiles(s.strings),
  };
}

// ---------------------------------------------------------------------------
// REACHABILITY, reported and never used as an excuse. Walks the import graph
// from `src/main.jsx`. A file the graph does not reach cannot put a word on the
// glass TODAY — but it is one `import` line from doing so, so its strings stay
// ON the boundary and still need declaring. The number is printed because dead
// content is worth seeing: `hr_facts.js` carries 124 strings and three of its
// own BACKLOG comments say its claims were never verified.
function unreachableFiles(strings) {
  const seen = new Set();
  const stack = [path.join(REPO, "src", "main.jsx")];
  const RESOLVE = ["", ".js", ".jsx", "/index.js", "/index.jsx"];
  while (stack.length) {
    const f = stack.pop();
    if (!f || seen.has(f) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) continue;
    seen.add(f);
    if (!/\.jsx?$/.test(f)) continue;
    let src; try { src = fs.readFileSync(f, "utf8"); } catch { continue; }
    for (const m of src.matchAll(/(?:from|import)\s*["']([^"']+)["']/g)) {
      const spec = m[1];
      if (!spec.startsWith(".")) continue;
      const base = path.resolve(path.dirname(f), spec);
      for (const ext of RESOLVE) if (fs.existsSync(base + ext)) { stack.push(base + ext); break; }
    }
  }
  const reached = new Set([...seen].map((f) => rel(f)));
  const files = [...new Set(strings.map((s) => s.file))];
  return files.filter((f) => /\.jsx?$/.test(f) && !reached.has(f))
    .map((f) => ({ file: f, strings: strings.filter((s) => s.file === f).length }));
}

// ---------------------------------------------------------------------------
function main() {
  const argv = process.argv.slice(2);
  const has = (f) => argv.includes(f);
  const r = evaluate();

  const sampleArg = argv.find((a) => a.startsWith("--rule-sample="));
  if (sampleArg) {
    const name = sampleArg.split("=")[1];
    console.log(`${name} — ${r.ruleHits[name] || 0} excluded, showing up to 60:\n`);
    for (const s of r.ruleSamples[name] || []) console.log("  " + s);
    return;
  }

  if (has("--rules")) {
    console.log("EXCLUSION RULES — how many strings each rule looked away from.");
    console.log("A rule with a suspiciously large count is an over-broad rule.\n");
    for (const [k, v] of Object.entries(r.ruleHits).sort((a, b) => b[1] - a[1]))
      console.log(`${String(v).padStart(6)}  ${k}`);
    console.log(`${String(r.strings.length).padStart(6)}  >> SURVIVED — must be declared`);
    return;
  }

  const clsArg = argv.find((a) => a.startsWith("--class="));
  if (clsArg) {
    const want = clsArg.split("=")[1].toUpperCase();
    for (const s of r.strings) {
      const row = r.reg.entries[s.key];
      if (row && row.c === want)
        console.log(`${s.file}:${s.line}  ${JSON.stringify(s.text.slice(0, 160))}${row.s ? `  << ${row.s}` : ""}`);
    }
    return;
  }

  if (has("--emit")) {
    const out = {};
    for (const s of r.undeclared) out[s.key] = { c: "", f: s.file, l: s.line, t: s.text };
    fs.mkdirSync(path.join(REPO, "provenance"), { recursive: true });
    fs.writeFileSync(path.join(REPO, "provenance", "_undeclared.json"), JSON.stringify(out, null, 1) + "\n");
    console.log(`wrote provenance/_undeclared.json — ${r.undeclared.length} stub(s)`);
    return;
  }

  if (has("--prune")) {
    const reg = loadRegister();
    for (const k of r.stale) delete reg.entries[k];
    fs.writeFileSync(REGISTER_PATH, JSON.stringify(reg, null, 1) + "\n");
    console.log(`pruned ${r.stale.length} stale row(s)`);
    return;
  }

  console.log("=".repeat(74));
  console.log("PROVENANCE BOUNDARY SWEEP");
  console.log("=".repeat(74));
  console.log(`visitor-facing strings on the boundary : ${r.strings.length}`);
  for (const c of [...ORIGIN_CLASSES, "INVENTION"])
    console.log(`  ${c.padEnd(10)} ${String(r.counts[c]).padStart(5)}   ${CLASSES[c]}`);
  console.log(`  ${"UNDECLARED".padEnd(10)} ${String(r.undeclared.length).padStart(5)}   no origin declared — the gate's whole job`);
  console.log(`\nvisual assets referenced               : ${r.assetsSeen.length}`);
  console.log(`  undeclared                             : ${r.undeclaredAssets.length}`);
  console.log(`  declared as carrying text in the image : ${r.textBearingAssets.length}`);
  console.log(`generated files (bulk-declared)          : ${r.generatedSeen.length}`);
  console.log(`stale register rows (string gone)        : ${r.stale.length}`);
  console.log(`INVENTION ceiling                        : ${r.ceiling}`);

  if (r.parseErrors.length) {
    console.log("\nPARSE ERRORS");
    for (const e of r.parseErrors) console.log("  " + e);
  }
  if (r.undeclared.length) {
    console.log(`\nUNDECLARED (first 40 of ${r.undeclared.length}):`);
    for (const s of r.undeclared.slice(0, 40))
      console.log(`  ${s.file}:${s.line}  ${JSON.stringify(s.text.slice(0, 120))}`);
  }
  if (r.undeclaredAssets.length) {
    console.log(`\nUNDECLARED ASSETS (${r.undeclaredAssets.length}):`);
    for (const a of r.undeclaredAssets) console.log(`  ${a.file}:${a.line}  ${a.ref}`);
  }
  if (r.badVerified.length) {
    console.log(`\nSOURCED CLASS WITH NO SOURCE (${r.badVerified.length}):`);
    for (const s of r.badVerified) console.log(`  [${s.cls}] ${s.file}:${s.line}  ${JSON.stringify(s.text.slice(0, 110))}`);
  }
  if (r.badRestated.length) {
    console.log(`\nRESTATED THAT DOES NOT RESOLVE (${r.badRestated.length}):`);
    for (const s of r.badRestated) console.log(`  ${s.file}:${s.line}  ${s.why}  ${JSON.stringify(s.text.slice(0, 90))}`);
  }
  if (r.unreachable.length) {
    console.log(`\nUNREACHABLE FROM src/main.jsx — declared anyway, one import from live:`);
    for (const u of r.unreachable) console.log(`  ${String(u.strings).padStart(4)}  ${u.file}`);
  }
  if (r.inventions.length) {
    console.log(`\nINVENTION — awaiting the operator's ruling (${r.inventions.length}):`);
    for (const s of r.inventions)
      console.log(`  ${s.file}:${s.line}  ${JSON.stringify(s.text.slice(0, 140))}${s.note ? `\n      ${s.note}` : ""}`);
  }

  console.log("\n" + "-".repeat(74));
  if (r.failures.length) {
    console.log("GATE: FAIL");
    for (const f of r.failures) console.log("  · " + f);
  } else {
    console.log("GATE: PASS — every visitor-facing string on the boundary is accounted for.");
  }
  console.log("What this cannot see is listed in provenance/README.md. Read it before");
  console.log("treating a PASS as proof that nothing on the glass is invented.");

  if (has("--gate") && r.failures.length) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("provenance-sweep.mjs")) main();
