#!/usr/bin/env node
/* ===========================================================================
   THE ASSET TABLE — every image, video and audio file in both repos, as data.
   ---------------------------------------------------------------------------
   MIKE (A5, 2026-08-04): "every image/video/audio asset in both repos as data
   — what it is, where it lives, what it depends on, quality assessment, and
   MIKE'S VERDICT field (unset by default). Nothing ships without Mike's
   personal inspection, but he must NOT have to perfect assets in advance —
   things change, slots move, some assets are never needed. Design it to enable
   painless generation of UX items later: personal logs, inventories,
   checklists."

   WHY IT IS A SEPARATE FILE FROM `provenance/assets.json`, AND NOT A MERGE.
   That register answers ONE question — where did this picture come from — and
   it covers only the 33 images the authored source references. This table
   answers four others (what is it, what depends on it, is it any good, has
   Mike passed it) across every media file in both trees, referenced or not.
   Folding the two would put a scanner's output into a hand-curated file whose
   whole value is that a human wrote every row. They share a directory and
   nothing else. `ref` is the join key where a file appears in both.

   THE SCAN NEVER OVERWRITES A JUDGEMENT. `--scan` re-walks the trees and
   rewrites only the MEASURED fields (bytes, dimensions, format, usedBy). The
   four judged fields — `what`, `quality`, `qualityNote`, `verdict` — are
   carried across from the existing table by `id` and are never touched by a
   scan. A file that disappears from disk is kept with `missing: true` rather
   than deleted, because a verdict Mike gave is a record and not a cache.

   USAGE
     node tools/asset-table.mjs              report to stdout
     node tools/asset-table.mjs --scan       re-walk both trees, merge, write
     node tools/asset-table.mjs --unverdicted   list what still needs Mike
     node tools/asset-table.mjs --checklist [--room <slug>]
                                            an inspection checklist, per A6
     node tools/asset-table.mjs --json       the merged table, to stdout
   =========================================================================== */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const MUSEUM = path.resolve(HERE, "..");
const ROBOTS = path.resolve(MUSEUM, "..", "weird-baby-robots");
const TABLE = path.join(MUSEUM, "provenance", "asset-table.json");

const REPOS = [
  { key: "museum", root: MUSEUM, label: "weird-baby-museum" },
  { key: "robots", root: ROBOTS, label: "weird-baby-robots" },
];

const IMAGE = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".bmp", ".tif", ".tiff"]);
const VIDEO = new Set([".mp4", ".mov", ".webm", ".m4v", ".avi", ".mkv"]);
const AUDIO = new Set([".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg", ".aiff"]);

/* Directories that hold no ASSET — build output, dependencies, git internals,
   and the dated backup trees eslint.config.js already ignores for the same
   reason. Named and counted rather than pattern-guessed, the way the
   provenance sweep names its exclusions. */
const SKIP_DIR = [
  "node_modules", ".git", ".wrangler", "dist", "_cowork",
  ".phase1_retired_files", "coverage", ".vite",
];
const SKIP_DIR_PREFIX = ["dist.pre_", "backup_", "_MIRROR"];

function kindOf(ext) {
  if (IMAGE.has(ext)) return "image";
  if (VIDEO.has(ext)) return "video";
  if (AUDIO.has(ext)) return "audio";
  return null;
}

function walk(dir, root, out) {
  let ents;
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIR.includes(e.name)) continue;
      if (SKIP_DIR_PREFIX.some(pre => e.name.startsWith(pre))) continue;
      walk(p, root, out);
    } else if (e.isFile()) {
      const ext = path.extname(e.name).toLowerCase();
      if (kindOf(ext)) out.push(p);
    }
  }
  return out;
}

/* ---- what the file ACTUALLY is, and whether it is whole -------------------
   Read from the magic bytes, never from the name. The first pass of this table
   trusted extensions and got two files wrong: `vol1_cover_v0.png` is a JPEG and
   `jesse-welles-plate.jpg` is a WebP — the second one SHIPPED, on /wal. Browsers
   sniff and render them; every tool that trusts the name reads them wrong.
   The tail check is the other half: a PNG ends with IEND and a JPEG with FFD9,
   so a file that stops early is detectable without decoding it. That caught
   `WeirdBaby_PhotoID_backup.png` — 719 KB of truncated PNG sitting in public/. */
const MAGIC = [
  [Buffer.from([0x89, 0x50, 0x4e, 0x47]), 0, "png"],
  [Buffer.from([0xff, 0xd8, 0xff]), 0, "jpg"],
  [Buffer.from("GIF8"), 0, "gif"],
  [Buffer.from("WEBP"), 8, "webp"],
  [Buffer.from("ftyp"), 4, "mp4"],
  [Buffer.from("ID3"), 0, "mp3"],
  [Buffer.from("OggS"), 0, "ogg"],
  [Buffer.from("fLaC"), 0, "flac"],
  [Buffer.from("BM"), 0, "bmp"],
];
const FAMILY = { jpg: "jpg", jpeg: "jpg", tif: "tiff", tiff: "tiff", m4a: "mp4", m4v: "mp4", mov: "mp4" };
function inspect(file, ext) {
  const out = {};
  let fd;
  try { fd = fs.openSync(file, "r"); } catch { return out; }
  const head = Buffer.alloc(32), tail = Buffer.alloc(16);
  let size = 0;
  try {
    size = fs.fstatSync(fd).size;
    fs.readSync(fd, head, 0, 32, 0);
    if (size > 16) fs.readSync(fd, tail, 0, 16, size - 16);
  } catch { /* unreadable is reported, never guessed */ } finally { fs.closeSync(fd); }

  for (const [sig, off, name] of MAGIC) {
    if (head.subarray(off, off + sig.length).equals(sig)) { out.container = name; break; }
  }
  const named = FAMILY[ext.slice(1)] || ext.slice(1);
  if (out.container && out.container !== named && !(named === "svg" || named === "ico" || named === "wav")) {
    out.containerMismatch = `${ext} on disk, ${out.container} inside`;
  }
  if (out.container === "png" && size > 16 && !tail.includes(Buffer.from("IEND"))) out.truncated = true;
  if (out.container === "jpg" && size > 2 && !(tail[14] === 0xff && tail[15] === 0xd9)) out.truncated = true;
  return out;
}

/* ---- image dimensions, from the file header, no dependency ---------------- */
function dims(file, ext) {
  let fd;
  try { fd = fs.openSync(file, "r"); } catch { return null; }
  const buf = Buffer.alloc(65536);
  let n = 0;
  try { n = fs.readSync(fd, buf, 0, 65536, 0); } finally { fs.closeSync(fd); }
  const b = buf.subarray(0, n);
  try {
    if (ext === ".png" && b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
      return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), depth: b[24], colorType: b[25] };
    }
    if (ext === ".gif" && b.length > 10) return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
    if (ext === ".bmp" && b.length > 26) return { w: b.readInt32LE(18), h: Math.abs(b.readInt32LE(22)) };
    if ((ext === ".jpg" || ext === ".jpeg") && b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i + 9 < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
          return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7), components: b[i + 9] };
        }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
    if (ext === ".webp" && b.length > 30 && b.subarray(8, 12).toString() === "WEBP") {
      const f = b.subarray(12, 16).toString();
      if (f === "VP8X") return { w: (b.readUIntLE(24, 3) & 0xffffff) + 1, h: (b.readUIntLE(27, 3) & 0xffffff) + 1 };
      if (f === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
      if (f === "VP8L") {
        const bits = b.readUInt32LE(21);
        return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
    if (ext === ".svg") {
      const s = b.toString("utf8");
      const vb = /viewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/.exec(s);
      if (vb) return { w: Math.round(+vb[1]), h: Math.round(+vb[2]), vector: true };
      return { vector: true };
    }
  } catch { /* a header we cannot read is reported as unknown, never guessed */ }
  return null;
}

/* ---- who references it --------------------------------------------------- */
function sourceFiles() {
  const roots = [path.join(MUSEUM, "src"), path.join(MUSEUM, "public")];
  const out = [];
  const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".css", ".html", ".json", ".mjs"]);
  const rec = d => {
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!SKIP_DIR.includes(e.name)) rec(p); }
      else if (exts.has(path.extname(e.name).toLowerCase())) out.push(p);
    }
  };
  roots.forEach(rec);
  out.push(path.join(MUSEUM, "index.html"));
  return out.filter(f => fs.existsSync(f));
}

function scan() {
  const prior = load();
  const priorById = new Map((prior.entries || []).map(e => [e.id, e]));
  const srcs = sourceFiles().map(f => ({ f, text: safeRead(f) }));

  const entries = [];
  for (const repo of REPOS) {
    if (!fs.existsSync(repo.root)) {
      console.error(`! repo not found, skipped: ${repo.root}`);
      continue;
    }
    for (const abs of walk(repo.root, repo.root, [])) {
      const rel = path.relative(repo.root, abs).split(path.sep).join("/");
      const ext = path.extname(abs).toLowerCase();
      const id = `${repo.key}:${rel}`;
      const st = fs.statSync(abs);
      /* the public path a browser would ask for, where there is one */
      const ref = repo.key === "museum" && rel.startsWith("public/")
        ? "/" + rel.slice("public/".length) : null;
      const usedBy = ref
        ? srcs.filter(s => s.text.includes(ref.slice(1)))
              .map(s => path.relative(MUSEUM, s.f).split(path.sep).join("/"))
        : [];
      const p = priorById.get(id) || {};
      entries.push({
        id,
        repo: repo.key,
        path: rel,
        ref,
        kind: kindOf(ext),
        format: ext.replace(".", ""),
        bytes: st.size,
        ...inspect(abs, ext),
        /* dimensions are read for the container the bytes say it is, not the
           one the name claims — otherwise a WebP called .jpg reports nothing */
        ...(dims(abs, ext) || dims(abs, "." + (inspect(abs, ext).container || "")) || {}),
        /* shipped   — under public/ AND something in src references it
           unreferenced — under public/ and nothing references it
           source    — in the tree, never served by this site */
        role: ref ? (usedBy.length ? "shipped" : "unreferenced") : "source",
        usedBy,
        /* --- the four judged fields. A scan carries them, never writes them. */
        what: p.what ?? null,
        quality: p.quality ?? null,
        qualityNote: p.qualityNote ?? null,
        verdict: p.verdict ?? null,
      });
    }
  }
  /* a file that left the disk keeps its row and its verdict */
  const live = new Set(entries.map(e => e.id));
  for (const [id, e] of priorById) {
    if (!live.has(id)) entries.push({ ...e, missing: true });
  }
  entries.sort((a, b) => a.id.localeCompare(b.id));
  return { ...prior, entries };
}

function safeRead(f) { try { return fs.readFileSync(f, "utf8"); } catch { return ""; } }

function load() {
  try { return JSON.parse(fs.readFileSync(TABLE, "utf8")); }
  catch { return { ...HEADER, entries: [] }; }
}

const HEADER = {
  _: "THE ASSET TABLE — every image, video and audio file in both repos. Scanned fields are rewritten by `node tools/asset-table.mjs --scan`; the four judged fields (what · quality · qualityNote · verdict) are hand-written and a scan never touches them.",
  _purpose: "Nothing ships without Mike's personal inspection — and Mike must not have to perfect assets in advance. Slots move, things change, some of these are never needed. This table exists so an inspection can be generated on demand for whatever is actually about to ship, instead of demanding a verdict on everything up front.",
  _quality: "Ops' honest read of the FILE, never of the idea: usable | weak | wrong | placeholder | null. `null` means NOBODY HAS LOOKED, and it is not a passing grade. `wrong` means the file does not show what its slot says it shows.",
  _verdict: "MIKE'S, and unset by default. null = not inspected. Values are his to choose; `pass` and `reject` are what the checklist reads. Ops never writes this field.",
  _gate: "THE RECORD APPROVAL GATE (Mike, 2026-08-04): final sign-off on a Record is Mike personally inspecting EVERY thing presented in it. `--checklist` is how that inspection is produced; a Record with any presented asset at verdict null has not been signed off.",
};

/* ---- reports ------------------------------------------------------------- */
function fmtBytes(n) {
  if (n >= 1048576) return (n / 1048576).toFixed(1) + " MB";
  if (n >= 1024) return Math.round(n / 1024) + " KB";
  return n + " B";
}

function report(t) {
  const e = t.entries.filter(x => !x.missing);
  const by = (f) => e.reduce((m, x) => (m[x[f] ?? "—"] = (m[x[f] ?? "—"] || 0) + 1, m), {});
  const tot = e.reduce((s, x) => s + (x.bytes || 0), 0);
  console.log(`ASSET TABLE — ${e.length} files, ${fmtBytes(tot)}\n`);
  console.log("  by repo   ", JSON.stringify(by("repo")));
  console.log("  by kind   ", JSON.stringify(by("kind")));
  console.log("  by role   ", JSON.stringify(by("role")));
  console.log("  quality   ", JSON.stringify(by("quality")));
  console.log("  verdict   ", JSON.stringify(by("verdict")));
  const shipped = e.filter(x => x.role === "shipped");
  console.log(`\n  SHIPPED (referenced by the site): ${shipped.length}`);
  console.log(`    unassessed by Ops : ${shipped.filter(x => !x.quality).length}`);
  console.log(`    unverdicted by Mike: ${shipped.filter(x => !x.verdict).length}`);
  const bad = e.filter(x => x.quality === "wrong" || x.quality === "placeholder");
  if (bad.length) {
    console.log(`\n  FLAGGED wrong/placeholder (${bad.length}):`);
    bad.forEach(x => console.log(`    ${x.quality.padEnd(11)} ${x.ref || x.path}\n                ${x.qualityNote || ""}`));
  }
  const broke = e.filter(x => x.truncated || x.containerMismatch);
  if (broke.length) {
    console.log(`\n  FILE-INTEGRITY (read from the bytes, not the name) — ${broke.length}:`);
    broke.forEach(x => console.log(`    ${x.truncated ? "TRUNCATED " : ""}${x.containerMismatch || ""}  ${x.ref || x.path}`));
  }
  const unref = e.filter(x => x.role === "unreferenced");
  if (unref.length) {
    console.log(`\n  IN public/ AND REFERENCED BY NOTHING (${unref.length}):`);
    unref.forEach(x => console.log(`    ${x.ref}  ${fmtBytes(x.bytes)}`));
  }
}

function checklist(t, room) {
  const e = t.entries.filter(x => !x.missing && x.role === "shipped")
    .filter(x => !room || (x.usedBy || []).some(u => u.includes(room)) || (x.ref || "").includes(room));
  console.log(`# INSPECTION CHECKLIST${room ? " — " + room : ""}`);
  console.log(`# ${e.length} presented assets. A Record is signed off when every box below is.\n`);
  for (const x of e) {
    const mark = x.verdict === "pass" ? "x" : " ";
    console.log(`- [${mark}] ${x.ref}`);
    console.log(`      ${x.what || "(nobody has written what this is)"}`);
    console.log(`      ${x.w && x.h ? x.w + "x" + x.h + " " : ""}${fmtBytes(x.bytes)} · quality: ${x.quality || "NOT LOOKED AT"}${x.qualityNote ? " — " + x.qualityNote : ""}`);
    console.log(`      shown by: ${(x.usedBy || []).join(", ") || "—"}`);
  }
}

/* ---- A6: THE RECORD APPROVAL GATE ----------------------------------------
   MIKE (2026-08-04): "final sign-off on a Record is Mike personally inspecting
   EVERY thing presented in it. Ops ensures nothing escapes that inspection."
   THIS IS NOT A PACKET GATE AND MUST NOT BECOME ONE. lint, build and
   `provenance:gate` run on every commit because they check things Ops can fix.
   This one checks whether MIKE HAS LOOKED, so wiring it into the packet would
   block every commit on an inspection nobody has been asked for yet — which is
   the exact opposite of Mike's own condition, that he must not have to perfect
   assets in advance. It is run against ONE Record when that Record is being
   signed off, and it answers one question: is there anything on this page he
   has not seen? */
function gate(t, room) {
  const e = t.entries.filter(x => !x.missing && x.role === "shipped")
    .filter(x => !room || (x.usedBy || []).some(u => u.includes(room)) || (x.ref || "").includes(room));
  const open = e.filter(x => x.verdict !== "pass");
  console.log(`RECORD APPROVAL GATE${room ? " — " + room : " — WHOLE SITE"}`);
  console.log(`  presented assets in scope : ${e.length}`);
  console.log(`  passed by Mike            : ${e.length - open.length}`);
  console.log(`  NOT INSPECTED / not passed: ${open.length}`);
  if (!e.length) {
    console.log("\n  Nothing matched that scope. A gate that matches nothing has not passed —\n  check the filter before reading this as approval.");
    process.exit(1);
  }
  if (open.length) {
    console.log("\n  Not signed off. Each of these is presented and has no `pass` from Mike:");
    open.forEach(x => console.log(`    ${(x.verdict || "—").padEnd(8)} ${x.ref}  — ${x.what || "(nobody has written what this is)"}`));
    process.exit(1);
  }
  console.log("\n  Signed off: every presented asset in scope carries Mike's pass.");
}

const argv = process.argv.slice(2);
if (argv.includes("--gate")) {
  const i = argv.indexOf("--room");
  gate(load(), i >= 0 ? argv[i + 1] : null);
} else if (argv.includes("--scan")) {
  const t = scan();
  fs.writeFileSync(TABLE, JSON.stringify(t, null, 1) + "\n");
  console.log(`wrote ${path.relative(MUSEUM, TABLE)} — ${t.entries.length} rows`);
  report(t);
} else if (argv.includes("--json")) {
  console.log(JSON.stringify(load(), null, 1));
} else if (argv.includes("--checklist")) {
  const i = argv.indexOf("--room");
  checklist(load(), i >= 0 ? argv[i + 1] : null);
} else if (argv.includes("--unverdicted")) {
  const e = load().entries.filter(x => !x.missing && x.role === "shipped" && !x.verdict);
  console.log(`${e.length} shipped assets await Mike's verdict:`);
  e.forEach(x => console.log(`  ${x.ref}  — ${x.what || "(unwritten)"}`));
} else {
  report(load());
}
