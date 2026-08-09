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
   five judged fields — `what`, `quality`, `qualityNote`, `verdict`,
   `revealArc` — are carried across from the existing table and are never
   touched by a scan. A file that disappears from disk is kept with
   `missing: true` rather than deleted, because a verdict Mike gave is a record
   and not a cache.

   ═══ [C32 2026-08-05] AND UNTIL THIS ROUND, "CARRIED ACROSS" MEANT BY PATH ══
   Which meant a RENAME dropped every judgement on a file in silence. Found by
   doing one: v51/A7 renamed `jesse-welles-plate.jpg` to `.webp` and the next
   scan produced a fresh row with all five judged fields null, while the old row
   vanished with the old path. Nothing warned. That file's verdict happened to
   be unset so nothing of Mike's was lost — and the Record Approval Gate would
   have gone on to report a pass over a row nobody had inspected.

   THE CHOICE, WHICH MIKE LEFT OPEN (content hash, stable id, or both): BOTH,
   AND A THIRD THING THAT MATTERS MORE THAN EITHER.

     1. A STABLE `uid`, minted once and never rewritten. It is the row's real
        identity. `id` (repo:path) is now an ADDRESS — the thing that changes —
        and `uid` is the name. Judgements hang off the name.
     2. `sha256` OF THE CONTENT, measured every scan. A prior row and a new file
        that share a hash inside one repo are the SAME FILE MOVED: the scan
        carries the whole judgement across, keeps the `uid`, and says so.
     3. AND WHERE NEITHER CAN ANSWER, IT REFUSES TO GUESS AND SAYS SO LOUDLY.
        A rename that also re-renders the file — which is the ordinary case when
        a thing is renamed, because the name is usually IN the picture — changes
        the path AND the hash at once, and no amount of keying can infer that.
        So a judged row whose file has left the disk is now reported under its
        own banner, and `--rename` is the explicit human declaration that moves
        the judgement. Silence was the defect; a hash only shrinks how often it
        happens, it never removes it.

   USAGE
     node tools/asset-table.mjs              report to stdout
     node tools/asset-table.mjs --scan       re-walk both trees, merge, write
     node tools/asset-table.mjs --rename <old> <new>
                                            declare a rename the hash cannot
                                            see; carries the judgement, then
                                            behaves exactly like --scan
     node tools/asset-table.mjs --orphans    every row whose file is gone,
                                            graded judged / unjudged (D2)
     node tools/asset-table.mjs --unverdicted   list what still needs Mike
     node tools/asset-table.mjs --checklist [--room <slug>]
                                            an inspection checklist, per A6
     node tools/asset-table.mjs --json       the merged table, to stdout
   =========================================================================== */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import crypto from "node:crypto";
/* [C1 2026-08-06] the stage door's prefix, imported rather than typed — see the
   note at `usedBy` below and reveal/placement.mjs. */
import { STAGE_PREFIX } from "../reveal/placement.mjs";

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

/* [N8 2026-08-04] A PATH NAMED IN A COMMENT IS NOT A REFERENCE, and until this
   round the scanner thought it was. `usedBy` is a substring test over the raw
   text of every source file, so the moment a comment MENTIONED an asset path
   that asset counted as shipped — and orphan detection is exactly the check
   that must not be defeatable by prose.
   IT WAS CAUGHT BY BEING COMMITTED. N1 removed the face that used
   `parts_drawer.jpg` and wrote a comment naming the newly-orphaned file, in
   backticks, so that a future session would find it. The next scan reported the
   file as still shipped, cited by the very file that had just stopped using it.
   The finding is the mechanism, not the file: any orphan is invisible for as
   long as anybody has written its name down.
   A CHARACTER SCANNER RATHER THAN A REGEX, because the two things that break
   every regex attempt at this are both everywhere in this tree: `//` inside a
   string (every absolute URL) and `/*` inside one. String literals are walked
   and KEPT — a path is a reference precisely when it is quoted — and escapes
   are consumed in pairs so a `\"` cannot end a string early. CSS has no line
   comments and this is harmless there; JSON has no comments at all. */
function stripComments(src) {
  let out = "", i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    /* charCodeAt(10) rather than a "\n" literal: this function is edited by
       scripts often enough that an escape sequence is a liability. */
    if (c === "/" && d === "/") { while (i < n && src.charCodeAt(i) !== 10) i++; continue; }
    if (c === "/" && d === "*") {
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      out += c; i++;
      while (i < n) {
        if (src[i] === "\\") { out += src[i] + (src[i + 1] ?? ""); i += 2; continue; }
        out += src[i];
        if (src[i] === c) { i++; break; }
        i++;
      }
      continue;
    }
    out += c; i++;
  }
  return out;
}

/* [C32] the content hash. Whole-file, because these are small and a prefix hash
   would call two covers built from one template the same picture. */
function sha256(file) {
  try { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
  catch { return null; }
}

/* [C32] the row's real name, minted once. Derived rather than counted so two
   runs of the same scan on a fresh table agree, and salted with the path it was
   FIRST seen at so a later file arriving at a freed path cannot inherit a
   retired row's identity. Once written it is opaque and permanent — the whole
   point is that nothing about the file can change it. */
function mintUid(id, hash, taken) {
  const base = crypto.createHash("sha1").update(`${id}\0${hash || ""}`)
    .digest("hex").slice(0, 10);
  let uid = `A-${base}`, n = 1;
  while (taken.has(uid)) uid = `A-${base}-${++n}`;
  taken.add(uid);
  return uid;
}

/* [B1 2026-08-07] `bucket` JOINS THE JUDGED SET AND IT IS THE SIXTH, NOT A
   MEASURED SIXTH. Mike corrected the bouncy ball law — it caps POINTS OF FOCUS,
   not assets — and split what the museum can show into a PRECIOUS bucket with a
   ceiling of two or three a WEEK and a DUMP bucket with no ceiling at all
   (`reveal/focus.mjs`). Which bucket a given file is in is a judgement about
   whether a reader will remember it, so it is carried across a scan exactly as
   `verdict` is and Ops never writes it. `null` means UNASSIGNED, which is the
   state of every row in this table today and is not a third bucket. */
const JUDGED = ["what", "quality", "qualityNote", "verdict", "revealArc", "bucket"];
const isJudged = e => JUDGED.some(k => e && e[k] != null);

/* [D2 2026-08-09] AN ORPHAN IS A ROW WHOSE FILE IS GONE. THAT IS THE WHOLE
   DEFINITION, AND IT USED TO CARRY A SECOND CLAUSE THAT HID MOST OF THEM.

   `--orphans` counted `missing && isJudged` — and on 2026-08-08 that meant it
   reported ZERO while the table held TWENTY-SEVEN rows whose file had left the
   disk. Twenty-four were one document: the MGK-VIIIp manual, which moved from
   `manual/pages/` to `manual/structure/pages/` and was re-rendered on the way,
   so neither the path nor the hash could follow it. Every one was unjudged — so
   the one instrument whose job is to notice a row whose file is gone was
   structurally blind to 24 of the 27 rows in exactly that state.

   THE SECOND CLAUSE WAS NOT WRONG, IT WAS THE WRONG QUESTION. `isJudged` asks
   what would be LOST if the row were dropped, which is the right test for how
   LOUD to be and is the whole of C32. It is not a test for whether the row is an
   orphan. So it survives as a GRADE rather than as a filter:

     JUDGED    an inspection is at stake. `--rename` moves it; `--cull` throws it
               away and only a person may say so. C32, unchanged.
     UNJUDGED  nothing is at stake. Dead bookkeeping, and `--cull` is the fix.

   Both are orphans, both are reported, and the summary prints the two counts
   separately so a round's standing `assets:orphans` line keeps meaning what it
   meant. A tripwire that can only see the loud half is not a tripwire. */
const isOrphan = e => !!e.missing;

function scan(renames = []) {
  const prior = load();
  const priorRows = prior.entries || [];
  const priorById = new Map(priorRows.map(e => [e.id, e]));
  const srcs = sourceFiles().map(f => ({ f, text: stripComments(safeRead(f)) }));

  /* [C32] declared renames are applied to the PRIOR table before matching, so
     from here down an explicit rename is indistinguishable from a file that
     never moved. The judgement travels; every measured field is re-measured. */
  const declared = [];
  for (const [from, to] of renames) {
    const row = priorRows.find(e => e.path === from || e.id === from || e.ref === from);
    if (!row) { console.error(`! --rename: no row for ${from}`); continue; }
    priorById.delete(row.id);
    const moved = { ...row, id: row.id.replace(row.path, to), path: to };
    /* A target that ALREADY carries a judgement is not overwritten. It happens
       when an earlier round re-wrote the judgement onto the new path by hand and
       left the old row stranded — which is exactly what v51/A7 did — so the
       target is the CURRENT reading and the orphan only fills what is still
       null. Whichever way it lands is printed. */
    const at = priorById.get(moved.id);
    if (at) {
      for (const k of JUDGED) if (at[k] == null && moved[k] != null) at[k] = moved[k];
      const kept = JUDGED.filter(k => at[k] != null && at[k] !== moved[k]);
      declared.push([row.path, to, at.uid ? "merged into an existing row" +
        (kept.length ? `, which kept its own ${kept.join("/")}` : "") : "merged"]);
    } else {
      priorById.set(moved.id, moved);
      declared.push([row.path, to, "carried whole"]);
    }
  }

  const claimed = new Set();          // prior ids consumed by a live file
  const takenUids = new Set(priorRows.map(e => e.uid).filter(Boolean));
  const carried = [];                 // renames the hash resolved on its own

  /* [C32] prior rows that carry a judgement, indexed by content — the pool a
     moved file is matched against when its path no longer finds it. */
  /* ═══ [H2 2026-08-06] THE KEY IS ONE FUNCTION NOW, AND C32 HAD NEVER FIRED ══
     The pool was keyed on a NUL between repo and hash and read back with a
     SPACE between them, in two lines eighteen apart — so the content-move carry
     this whole mechanism exists for could not match anything, ever. It was
     invisible because its failure mode is the one it was built to fix: a moved
     file appears as a LOST JUDGEMENT, which is exactly what the C32 banner
     reports and exactly what everybody has read as "declare the rename by
     hand". This round moved 26 judged files at once and every one came up
     missing, which is the first time the shortfall was big enough to look twice
     at. One function, both callers — the same fix and the same reason as
     `reveal/schema.mjs`'s one validator. */
  /* the separator is written as the two-character escape and not as a literal
     NUL, because a literal one makes every grep over this file report "binary
     file matches" and nothing else — the defect class P5 found six of in
     tools/*.mjs, and this patch put a seventh in before the same grep caught
     it. Same value to JavaScript, plain text to everything else. */
  const hashKey = (repo, sha) => repo + "\u0000" + sha;
  const byHash = new Map();
  for (const e of priorRows) {
    if (!e.sha256 || !isJudged(e)) continue;
    const k = hashKey(e.repo, e.sha256);
    if (!byHash.has(k)) byHash.set(k, []);
    byHash.get(k).push(e);
  }

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
      const hash = sha256(abs);
      /* the public path a browser would ask for, where there is one */
      const ref = repo.key === "museum" && rel.startsWith("public/")
        ? "/" + rel.slice("public/".length) : null;
      /* ═══ [C1 2026-08-06] A HELD FILE IS NAMED BY ITS PUBLIC ADDRESS ════════
         AND THIS SCANNER WOULD HAVE CONDEMNED TWENTY-SIX PHOTOGRAPHS ON THE DAY
         MIKE ASKED TO SEE THEM. V1 made the pull-back a launch-state rule: the
         data declares `/robots/…`, the address a picture will have when the
         Record delivers it, and `src/lib/placement.js` computes the stage door's
         prefix. So a file sitting at `public/held/robots/x.png` has
         `ref = /held/robots/x.png` and NOTHING in `src/` contains that string —
         by design, because a held address in a public chunk is the leak the
         whole boundary exists to stop.
         The consequence lands here, on the one instrument whose output is a
         DELETION LIST. `--orphans` and `role: "unreferenced"` are what the cull
         reads, and they would have named every held photograph. Caught by
         running the cull against the round that created the condition; it is the
         same shape as C32's carry — a mechanism whose failure mode looks exactly
         like the thing it reports.
         So a reference is tested at BOTH addresses, and the rule that maps one
         to the other is imported rather than retyped. */
      const refs = ref
        ? [...new Set([ref, ref.startsWith(STAGE_PREFIX + "/") ? ref.slice(STAGE_PREFIX.length) : ref])]
        : [];
      const usedBy = refs.length
        ? srcs.filter(s => refs.some(r => s.text.includes(r.slice(1))))
              .map(s => path.relative(MUSEUM, s.f).split(path.sep).join("/"))
        : [];
      /* [C32] MATCHING, IN ORDER. Address first — the overwhelming case, and
         the only one that was ever handled. Then content, which resolves a pure
         move on its own. Whatever neither finds is a new row, and whatever is
         left over on the prior side is surfaced below rather than dropped. */
      let p = priorById.get(id);
      if (p) claimed.add(p.id);
      else {
        const pool = byHash.get(hashKey(repo.key, hash)) || [];
        const moved = pool.find(e => !claimed.has(e.id) && !fs.existsSync(
          path.join(repo.root, e.path.split("/").join(path.sep))));
        if (moved) {
          p = moved; claimed.add(moved.id);
          carried.push([moved.path, rel]);
        }
      }
      p = p || {};
      entries.push({
        id,
        /* [C32] the name, as against `id`, which is the address */
        uid: p.uid || mintUid(id, hash, takenUids),
        repo: repo.key,
        path: rel,
        ref,
        sha256: hash,
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
        /* --- the six judged fields. A scan carries them, never writes them. */
        what: p.what ?? null,
        quality: p.quality ?? null,
        qualityNote: p.qualityNote ?? null,
        verdict: p.verdict ?? null,
        /* [N8 2026-08-04] THE REVEAL ARC. Mike's canon, generalised by his own
           ruling from the Portal to every asset in the building: a thing is
           acknowledged when it ARRIVES, status-updated as it is UNDERSTOOD,
           brought online in stages (PARTIAL), and finally ONLINE — and a
           visitor experiences that sequence exactly as the house did, test
           patterns and noise included. It is a judged field, not a measured
           one: no scan can read a stage off a file's bytes, so it is carried
           across exactly as `verdict` is. `null` means UNSET, which is the
           honest state of most of this table and is not a stage. */
        revealArc: p.revealArc ?? null,
        /* [B1 2026-08-07] THE BOUNCY BALL BUCKET: "precious" | "dump" | null.
           See `reveal/focus.mjs` for the law and the two runways it feeds. A
           scan cannot read this off bytes any more than it can read a verdict,
           and DERIVING it would be worse than leaving it null — a heuristic
           that called every machine photograph precious would make the runway
           report look answered while nobody had answered anything. */
        bucket: p.bucket ?? null,
      });
    }
  }
  /* a file that left the disk keeps its row and its verdict */
  const live = new Set(entries.map(e => e.id));
  const orphaned = [];
  for (const [id, e] of priorById) {
    if (live.has(id) || claimed.has(e.id)) continue;
    entries.push({ ...e, missing: true });
    orphaned.push(e);   /* [D2] every one, graded at report time */
  }
  entries.sort((a, b) => a.id.localeCompare(b.id));

  /* [C32] THE PART THAT IS NOT A KEYING CHANGE. The two paragraphs above make a
     silent drop rarer; this is what makes it impossible for one to be silent. */
  if (declared.length) {
    console.log(`\n  DECLARED RENAMES — judgement carried by hand (${declared.length}):`);
    declared.forEach(([a, b, how]) => console.log(`    ${a}\n      -> ${b}   (${how})`));
  }
  if (carried.length) {
    console.log(`\n  RENAMES RESOLVED BY CONTENT — same bytes, new path (${carried.length}):`);
    carried.forEach(([a, b]) => console.log(`    ${a}\n      -> ${b}`));
  }
  if (orphaned.length) {
    const jd = orphaned.filter(isJudged), pl = orphaned.filter(e => !isJudged(e));
    console.log(`\n  !! ROWS WHOSE FILE IS GONE (${orphaned.length}) — ${jd.length} judged, ${pl.length} unjudged.`);
    console.log("     Every one is KEPT with missing:true. If one is a rename the content hash");
    console.log("     could not see (re-rendered as well as moved), declare it:");
    console.log("       npm run assets:rename -- <old> <new>");
    if (jd.length) {
      console.log(`\n     JUDGED (${jd.length}) — an inspection is at stake. C32.`);
      jd.forEach(e => console.log(
        `       ${e.uid || "(no uid)"}  ${e.path}\n         verdict=${e.verdict ?? "null"} quality=${e.quality ?? "null"} arc=${e.revealArc ?? "null"}`));
    }
    if (pl.length) {
      console.log(`\n     UNJUDGED (${pl.length}) — nothing is at stake; dead bookkeeping.`);
      console.log("     Drop them with:  npm run assets:cull -- <path> [more…]");
      pl.forEach(e => console.log(`       ${e.uid || "(no uid)"}  ${e.path}`));
    }
  }
  /* [N8] HEADER WINS OVER THE FILE'S OWN HEADER, and that is a fix rather than
     a preference. `{...prior, entries}` meant the underscore keys were whatever
     the table happened to already say, so `_revealArc` — added to HEADER this
     round — never reached the file, and any future correction to the legend
     would have needed a hand edit to a generated artifact. The legend is
     DOCUMENTATION and its source is this file; anything else prior carries is
     still preserved, because prior is spread first. */
  return { ...prior, ...HEADER, entries };
}

function safeRead(f) { try { return fs.readFileSync(f, "utf8"); } catch { return ""; } }

function load() {
  try { return JSON.parse(fs.readFileSync(TABLE, "utf8")); }
  catch { return { ...HEADER, entries: [] }; }
}

const HEADER = {
  _: "THE ASSET TABLE — every image, video and audio file in both repos. Scanned fields are rewritten by `node tools/asset-table.mjs --scan`; the six judged fields (what · quality · qualityNote · verdict · revealArc · bucket) are hand-written and a scan never touches them.",
  _purpose: "Nothing ships without Mike's personal inspection — and Mike must not have to perfect assets in advance. Slots move, things change, some of these are never needed. This table exists so an inspection can be generated on demand for whatever is actually about to ship, instead of demanding a verdict on everything up front.",
  _quality: "Ops' honest read of the FILE, never of the idea: usable | weak | wrong | placeholder | null. `null` means NOBODY HAS LOOKED, and it is not a passing grade. `wrong` means the file does not show what its slot says it shows.",
  _verdict: "MIKE'S, and unset by default. null = not inspected. Values are his to choose; `pass` and `reject` are what the checklist reads. Ops never writes this field.",
  _revealArc: "THE REVEAL ARC (Mike, 2026-08-04): arrived | understood | partial | online | null. The house's canon for how a thing is revealed — acknowledged when it arrived, status-updated as it was understood, brought online in stages — applied to every asset so a visitor can be given the sequence the house actually lived, test patterns and noise included. `null` means UNSET and is not a stage: it is the honest state of an asset whose arc nobody has established. Ops populates only what the record already attests.",
  _bucket: "THE BOUNCY BALL BUCKET (Mike, 2026-08-07): precious | dump | null. The law caps POINTS OF FOCUS, not assets — humans remember one or two things, and ten things reduces the odds they keep the one that matters. PRECIOUS is a genuine reveal, two or three A WEEK, and those are what a reader remembers. DUMP is everything else: fun to look at, part of the story, part of the pile, and there is NO CEILING on it — ten manual pages arriving is one point of focus, not ten. `null` means UNASSIGNED and is not a third bucket. Ops never writes this field, and deliberately does not derive it: a heuristic here would make the runway report look answered when nothing had been answered. The law and the two runways live in `reveal/focus.mjs`.",
  _gate: "THE RECORD APPROVAL GATE (Mike, 2026-08-04): final sign-off on a Record is Mike personally inspecting EVERY thing presented in it. `--checklist` is how that inspection is produced; a Record with any presented asset at verdict null has not been signed off.",
  _uid: "[C32 2026-08-05] THE ROW'S NAME, minted once and never rewritten. `id` is repo:path and is an ADDRESS — it changes when a file moves. `uid` does not, so a judgement hangs off something a rename cannot touch. Other tables may reference a row by uid; nothing may reference it by path and expect that to hold.",
  _sha256: "[C32 2026-08-05] The content hash, re-measured every scan. A prior row and a new file sharing a hash inside one repo are the same file MOVED: the scan carries the judgement and the uid across and reports it. Where a rename ALSO changed the content — the ordinary case, because the name is usually in the picture — no hash can see it, so the judged row is surfaced under its own banner and `--rename` is the explicit declaration that moves it. The silence was the defect; the hash only makes it rarer.",
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
  console.log("  revealArc ", JSON.stringify(by("revealArc")));
  /* [B1 2026-08-07] the bouncy ball bucket. `—` is UNASSIGNED, and while it is
     the whole table that is the report: the two runways cannot be computed from
     an unassigned population, only bounded. See `reveal/focus.mjs`. */
  console.log("  bucket    ", JSON.stringify(by("bucket")));
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

function writeTable(t) {
  fs.writeFileSync(TABLE, JSON.stringify(t, null, 1) + "\n");
  console.log(`wrote ${path.relative(MUSEUM, TABLE)} — ${t.entries.length} rows`);
}

const argv = process.argv.slice(2);
if (argv.includes("--gate")) {
  const i = argv.indexOf("--room");
  gate(load(), i >= 0 ? argv[i + 1] : null);
} else if (argv.includes("--rename")) {
  /* [C32] the escape hatch for a rename no hash can see. It is deliberately a
     command a person types, not a heuristic: carrying a verdict onto a file
     whose bytes changed is a claim that the inspection still applies, and only
     a human can make it. */
  const i = argv.indexOf("--rename");
  const from = argv[i + 1], to = argv[i + 2];
  if (!from || !to) {
    console.error("usage: --rename <old path|ref|id> <new path>");
    process.exit(1);
  }
  const t = scan([[from, to]]);
  writeTable(t);
  report(t);
} else if (argv.includes("--cull")) {
  /* ═══ [C1 2026-08-06] THE DELIBERATE COUNTERPART OF `--rename` ═════════════
     MIKE'S STANDING RULE: *"if we are not using it, get rid of it."* So a cull
     is a thing this repository will do again, and until now there was no way to
     tell this table that a file is gone ON PURPOSE. C32 keeps a judged row whose
     file has vanished and REPORTS it, which is exactly right for a loss — a
     verdict is an inspection somebody did and it must not evaporate with a bad
     `git mv`. But it means every deliberate deletion leaves a permanent row in
     `--orphans`, and an orphan report that is never zero is a tripwire nobody
     reads. That is the disease this file's own baseline caught in CLAUDE.md.
     IT IS A COMMAND A PERSON TYPES, for the same reason `--rename` is: dropping
     a judged row drops an inspection, and only a person can say that the
     inspection is not wanted any more.
     IT REFUSES A FILE THAT IS STILL THERE. Culling a row whose file exists would
     make the table lie about the tree, and the tree is what this instrument is
     for.  Read the register row for what was culled and why — this only forgets
     the bookkeeping. */
  const i = argv.indexOf("--cull");
  const names = argv.slice(i + 1).filter(a => !a.startsWith("--"));
  if (!names.length) {
    console.error("usage: --cull <path|ref|uid> [more…]   (the file must already be deleted)");
    process.exit(1);
  }
  const t = load();
  const keep = [], dropped = [], refused = [];
  for (const e of t.entries) {
    const hit = names.some(n => n === e.uid || n === e.id || n === e.path || n === e.ref);
    if (!hit) { keep.push(e); continue; }
    const root = e.repo === "museum" ? MUSEUM : ROBOTS;
    if (fs.existsSync(path.join(root, e.path.split("/").join(path.sep)))) {
      refused.push(e.path); keep.push(e);
    } else dropped.push(e.path);
  }
  const unknown = names.filter(n => ![...dropped, ...refused].some(p => p.endsWith(n) || n.endsWith(p)));
  if (refused.length) {
    console.error("REFUSED — still on disk:\n  " + refused.join("\n  "));
    process.exit(1);
  }
  t.entries = keep;
  writeTable(t);
  console.log(`culled ${dropped.length} row(s):\n  ` + dropped.join("\n  "));
  if (unknown.length) console.error("not found in the table: " + unknown.join(", "));
} else if (argv.includes("--orphans")) {
  const all = load().entries.filter(isOrphan);
  const jd = all.filter(isJudged), pl = all.filter(x => !isJudged(x));
  console.log(`${all.length} rows whose file is no longer on disk — ${jd.length} judged, ${pl.length} unjudged.`);
  if (jd.length) {
    console.log(`\nJUDGED (${jd.length}) — an inspection is at stake. Move it with --rename, or`);
    console.log("throw it away with --cull, which only a person may decide.");
    jd.forEach(x => console.log(
      `  ${x.uid || "(no uid)"}  ${x.path}\n    ${x.what || "(unwritten)"}\n    verdict=${x.verdict ?? "null"} quality=${x.quality ?? "null"} arc=${x.revealArc ?? "null"}`));
  }
  if (pl.length) {
    console.log(`\nUNJUDGED (${pl.length}) — nothing is at stake. Dead bookkeeping; drop with --cull.`);
    pl.forEach(x => console.log(`  ${x.uid || "(no uid)"}  ${x.path}`));
  }
  if (!all.length) console.log("Every row in the table points at a file that is on disk.");
} else if (argv.includes("--scan")) {
  const t = scan();
  writeTable(t);
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
