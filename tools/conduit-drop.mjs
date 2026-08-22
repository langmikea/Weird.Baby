#!/usr/bin/env node
/* ===========================================================================
   `npm run conduit` — THE DROP IS A COMMAND, NOT A COPY.
   [2026-08-22]
   ---------------------------------------------------------------------------
   WHY THIS EXISTS, AND IT IS TWO MEASURED FAILURES RATHER THAN A WORRY. On
   2026-08-22 two agents independently found the conduit lying: a STALE REVISION
   served under a fresh file's id, and an EMPTY RETURN that could not be told
   apart from an empty file. **Neither raised an error.** Nothing in the pipe
   knew when it was wrong, so being wrong cost a search each time instead of a
   line of output.

   THE FIX IS THAT EVERY BYTE THAT LEAVES CARRIES ITS OWN PROVENANCE, and that
   the drop refuses rather than half-succeeds. A partial drop is worse than no
   drop, because it looks complete.

   ═══ THE FOUR REFUSALS, AND WHY EACH ONE ABORTS THE WHOLE RUN ══════════════
     1. NO HEAD, NO DROP.       A stamp is the point; a file that cannot be
                                stamped may not travel.
     2. DIRTY TREE.             A stamp naming a HEAD that does not contain the
                                bytes is a lie with a citation on it — worse
                                than no citation, because it invites trust.
                                `--allow-dirty` stamps DIRTY in place of the
                                sha and says so loudly, for the case where the
                                sender knows.
     3. A LISTED SOURCE IS MISSING. Named, never skipped: a catalogue that
                                quietly drops a row is the failure this round
                                measured.
     4. NON-UTF8 OUT.           This morning `OPERATIONS.md` arrived with 60
                                bytes of binary in front of its first heading.
                                Every output is verified after writing — byte 0
                                must be the first byte of the stamp — so that
                                is not reproducible.

   ═══ IT CLEARS FIRST, AND THAT IS DELIBERATE ═══════════════════════════════
   The conduit is a TRANSFER PAYLOAD, not a reference copy, and it is
   disposable. A file that leaves the list must not linger and be read as
   current — which is failure one, arriving by a different road. So the
   destination is emptied before anything is written, and what was removed is
   printed.

   ═══ THE LIST IS ONE ARRAY PLUS ONE RESOLUTION ═════════════════════════════
   `DOCUMENTS` is hand-held: adding a file is a one-line edit. The canon is NOT
   hand-held — `docs/canon/INDEX.md` is read and its links resolved, because a
   catalogue that arrives without its contents is exactly what cost Ops an
   answer today, and a hand-typed list of fourteen goes stale the day the index
   grows to fifteen.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");

/* the destination, overridable — a hardcoded single option is a tool that
   cannot be tested anywhere but the machine it was written on. */
const DEST = process.env.WB_CONDUIT || "G:\\My Drive\\_conduit";

const ALLOW_DIRTY = process.argv.includes("--allow-dirty");

/* ── THE LIST ──────────────────────────────────────────────────────────────
   One array. Adding a document is one line. The canon INDEX is here because it
   is a document in its own right; the fourteen it links to are resolved below
   rather than typed. */
const DOCUMENTS = [
  "docs/canonical/OPERATIONS.md",
  "docs/MUSEUM_RULINGS-20260817.md",
  "docs/ARC.md",
  "docs/BACKLOG.md",
  "docs/THREADS.md",
  "docs/canon/INDEX.md",
];

const CANON_INDEX = "docs/canon/INDEX.md";

const die = (lines) => {
  console.error("\n" + lines.join("\n") + "\n");
  process.exit(1);
};

/* ── 1. THE STAMP'S INGREDIENTS ────────────────────────────────────────────
   `git rev-parse` rather than reading `.git/HEAD` by hand: a detached head, a
   packed ref and a worktree all resolve correctly through git and do not
   through a file read. If git cannot answer, nothing is dropped. */
function headSha() {
  try {
    const out = execFileSync("git", ["-C", REPO, "rev-parse", "--short", "HEAD"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    if (!/^[0-9a-f]{7,40}$/.test(out)) throw new Error("unrecognised: " + out);
    return out;
  } catch (e) {
    die([
      "conduit REFUSED — cannot read HEAD, so nothing can be stamped.",
      "  " + (e && e.message ? e.message : String(e)),
      "",
      "A drop with no provenance is the thing this tool exists to prevent.",
      "Nothing was written and the destination was not touched.",
    ]);
  }
}

/* which of the listed files differ from HEAD. `--` and the explicit path list
   keep the answer scoped: a dirty file somewhere else in the repo is not this
   drop's business and must not block it. */
function dirtyAmong(rels) {
  try {
    const out = execFileSync("git",
      ["-C", REPO, "status", "--porcelain", "--", ...rels],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return out.split("\n").map(l => l.slice(3).trim()).filter(Boolean)
      .map(p => p.replace(/^"|"$/g, ""));
  } catch (e) {
    die([
      "conduit REFUSED — cannot read the working tree's status.",
      "  " + (e && e.message ? e.message : String(e)),
      "",
      "Without it the stamp cannot promise that HEAD contains these bytes.",
    ]);
  }
}

const sha256of = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

/* ── 2. RESOLVE THE CANON ──────────────────────────────────────────────────
   Markdown links, fragments stripped, `.md` only, de-duplicated, in the order
   the index first names them so the drop reads the way the catalogue does.
   External links and anchors-into-self are not files and are skipped. */
function canonLinks() {
  const abs = path.join(REPO, CANON_INDEX);
  if (!fs.existsSync(abs)) return [];
  const md = fs.readFileSync(abs, "utf8");
  const dir = path.posix.dirname(CANON_INDEX.replace(/\\/g, "/"));
  const seen = new Set();
  const out = [];
  for (const m of md.matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = m[1].split("#")[0].trim();
    if (!target) continue;                              /* a pure anchor */
    if (/^[a-z]+:/i.test(target) || target.startsWith("//")) continue;  /* external */
    if (!target.toLowerCase().endsWith(".md")) continue;
    const rel = path.posix.normalize(dir + "/" + target);
    if (seen.has(rel)) continue;
    seen.add(rel);
    out.push(rel);
  }
  return out;
}

/* ── 3. THE COMMENT FORM THE TARGET SYNTAX REQUIRES ────────────────────────
   Markdown gets the HTML comment. The others are here so that adding a file
   with a different extension does not silently produce a stamp the format
   cannot carry — an unknown extension refuses rather than guessing. */
function commentFor(rel, body) {
  const ext = path.extname(rel).toLowerCase();
  if (ext === ".md" || ext === ".html" || ext === ".htm") return `<!-- ${body} -->`;
  if (ext === ".js" || ext === ".mjs" || ext === ".jsx" || ext === ".css") return `/* ${body} */`;
  if (ext === ".json") return null;                      /* JSON cannot carry one */
  return undefined;                                      /* unknown — refuse */
}

/* ═══ THE RUN ══════════════════════════════════════════════════════════════ */
const HEAD = headSha();
const NOW = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

const list = [...DOCUMENTS];
for (const c of canonLinks()) if (!list.includes(c)) list.push(c);

/* REFUSAL 3 — a listed source is missing. Named, all of them, not the first. */
const missing = list.filter(rel => !fs.existsSync(path.join(REPO, rel)));
if (missing.length) {
  die([
    `conduit REFUSED — ${missing.length} listed source file(s) are not on disk:`,
    ...missing.map(m => "      " + m),
    "",
    "A drop that skips a named file is the failure this tool exists to catch.",
    "Nothing was written and the destination was not touched.",
  ]);
}

/* REFUSAL 2 — a dirty tree among the listed files. */
const dirty = dirtyAmong(list);
if (dirty.length && !ALLOW_DIRTY) {
  die([
    `conduit REFUSED — ${dirty.length} file(s) in the drop differ from HEAD ${HEAD}:`,
    ...dirty.map(d => "      " + d),
    "",
    "The stamp would name a commit that does not contain these bytes — a lie",
    "with a citation on it, which is worse than no citation at all.",
    "",
    "  Commit them, or drop anyway with:   npm run conduit -- --allow-dirty",
    "Nothing was written and the destination was not touched.",
  ]);
}
if (dirty.length && ALLOW_DIRTY) {
  console.warn("\n  ############################################################");
  console.warn("  ##  WARNING — DIRTY DROP. " + dirty.length + " file(s) differ from HEAD.");
  console.warn("  ##  Their stamps read `sha256 DIRTY` and name no commit.");
  dirty.forEach(d => console.warn("  ##    " + d));
  console.warn("  ##  What arrives is NOT what " + HEAD + " contains.");
  console.warn("  ############################################################\n");
}
const isDirty = new Set(dirty);

/* read and stamp everything BEFORE touching the destination: refusal 1, 3 and
   the unknown-extension case must all fire while the conduit is still intact. */
const staged = [];
for (const rel of list) {
  const abs = path.join(REPO, rel);
  const raw = fs.readFileSync(abs);
  const sha = sha256of(raw);
  const short = isDirty.has(rel) ? "DIRTY" : sha.slice(0, 16);
  const line = `CONDUIT: HEAD ${HEAD} · ${NOW} · sha256 ${short} · ${rel}`;
  const comment = commentFor(rel, line);
  if (comment === undefined) {
    die([
      `conduit REFUSED — no stamp form is defined for \`${path.extname(rel)}\` (${rel}).`,
      "",
      "Every dropped file carries its provenance on line one. Rather than guess",
      "a comment syntax, this refuses: add the extension to `commentFor()`.",
      "Nothing was written and the destination was not touched.",
    ]);
  }
  /* REFUSAL 4, first half — the source must be valid UTF-8 before it can be
     re-emitted as UTF-8. A lossy decode is how binary reaches a text file. */
  const text = raw.toString("utf8");
  if (Buffer.compare(Buffer.from(text, "utf8"), raw) !== 0) {
    die([
      `conduit REFUSED — \`${rel}\` is not valid UTF-8.`,
      "",
      "Re-encoding it would change the bytes and the sha in its own stamp would",
      "describe a file nobody has. Nothing was written.",
    ]);
  }
  /* strip a BOM if the source carries one: it must not end up between the file
     start and the stamp, which is exactly the 60-bytes-of-garbage shape. */
  const clean = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  staged.push({
    rel, name: path.basename(rel), sha, short,
    out: Buffer.from(comment + "\n" + clean, "utf8"),
  });
}

/* ── CLEAR FIRST ───────────────────────────────────────────────────────────
   Files only, one level: the conduit is flat by construction and a recursive
   delete against an env-var path is a bigger weapon than this job needs. A
   subdirectory is reported and left alone rather than removed. */
if (!fs.existsSync(DEST)) {
  try { fs.mkdirSync(DEST, { recursive: true }); }
  catch (e) {
    die([
      `conduit REFUSED — the destination does not exist and cannot be created:`,
      "      " + DEST,
      "  " + (e && e.message ? e.message : String(e)),
    ]);
  }
}
let removed = [], kept = [];
try {
  for (const e of fs.readdirSync(DEST, { withFileTypes: true })) {
    if (e.isDirectory()) { kept.push(e.name + "/"); continue; }
    fs.unlinkSync(path.join(DEST, e.name));
    removed.push(e.name);
  }
} catch (e) {
  die([
    "conduit REFUSED — cannot clear the destination:",
    "      " + DEST,
    "  " + (e && e.message ? e.message : String(e)),
    "",
    "A drop over a directory it could not empty would mix old files with new,",
    "which is the stale-revision failure this tool was written for.",
  ]);
}

console.log(`\n  conduit  ->  ${DEST}`);
console.log(`  HEAD ${HEAD} · ${NOW}${ALLOW_DIRTY && dirty.length ? " · DIRTY DROP" : ""}`);
console.log(`  cleared: ${removed.length} file(s)${removed.length ? " — " + removed.join(", ") : ""}`);
if (kept.length) console.log(`  left alone (directories): ${kept.join(", ")}`);

/* ── WRITE, THEN VERIFY BYTE 0 ─────────────────────────────────────────────
   The verification is the point of refusal 4 and it reads the file back off
   the disk rather than trusting the write: what arrived is the only thing that
   matters, and this morning something got in front of the first heading. */
const written = [];
for (const f of staged) {
  const to = path.join(DEST, f.name);
  fs.writeFileSync(to, f.out);
  const back = fs.readFileSync(to);
  if (back.length === 0 || back[0] !== f.out[0] || Buffer.compare(back, f.out) !== 0) {
    die([
      `conduit REFUSED — \`${f.name}\` did not arrive as it was written.`,
      `      first byte written 0x${f.out[0].toString(16)}, read back 0x${(back[0] ?? 0).toString(16)}`,
      `      bytes written ${f.out.length}, read back ${back.length}`,
      "",
      "The drop is now incomplete and must not be trusted. Re-run it.",
    ]);
  }
  written.push({ ...f, bytes: back.length });
  console.log(`    ${String(back.length).padStart(7)}  ${f.name}`);
}

/* ── THE MANIFEST ──────────────────────────────────────────────────────────
   Half the value of the drop. It is what lets a reader detect an INCOMPLETE
   arrival instead of discovering it three searches later: a fresh Ops reads
   this first and knows what it should be able to see.
   ITS OWN sha IS OF ITS OWN SOURCE — there is none, so it names the count it
   is asserting instead, and the count is the thing to check. */
const manifestBody = [
  "# CONDUIT MANIFEST",
  "",
  `Dropped from \`weird-baby-museum\` at HEAD **${HEAD}**, ${NOW}.`,
  ALLOW_DIRTY && dirty.length
    ? `\n> **DIRTY DROP.** ${dirty.length} file(s) differ from HEAD and are stamped \`sha256 DIRTY\`.\n> What is here is NOT what ${HEAD} contains.\n`
    : "",
  "**Read this first.** If a file below is not in the folder beside it, the drop",
  "is incomplete and nothing here should be treated as current.",
  "",
  "| file | bytes | sha256-16 | source |",
  "|---|---:|---|---|",
  ...written.map(f => `| ${f.name} | ${f.bytes} | \`${f.short}\` | \`${f.rel}\` |`),
  "",
  `**${written.length} files.**`,
  "",
].filter(l => l !== "").join("\n") + "\n";

const manifestOut = Buffer.from(
  `<!-- CONDUIT: HEAD ${HEAD} · ${NOW} · sha256 MANIFEST · MANIFEST.md -->\n`
  + manifestBody, "utf8");
const mPath = path.join(DEST, "MANIFEST.md");
fs.writeFileSync(mPath, manifestOut);
const mBack = fs.readFileSync(mPath);
if (Buffer.compare(mBack, manifestOut) !== 0) {
  die([
    "conduit REFUSED — MANIFEST.md did not arrive as it was written.",
    "The payload is there and the index of it is not, which is the worse half.",
  ]);
}
console.log(`    ${String(mBack.length).padStart(7)}  MANIFEST.md`);
console.log(`\n  ${written.length} file(s) + manifest. ` +
  `${DOCUMENTS.length} listed, ${written.length - DOCUMENTS.length} resolved from ${CANON_INDEX}.\n`);
