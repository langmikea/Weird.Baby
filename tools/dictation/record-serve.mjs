#!/usr/bin/env node
/* ===========================================================================
   THE EDITORS, SERVED — so that Save lands in the repo.
   ===========================================================================

   ── [PIECE 4, 2026-08-26] IT SERVES THE DAY EDITOR TOO, AND IT ALWAYS DID ──
   `[MIKE, 2026-08-25 — RULING A] the day editor becomes where he writes.` This
   file's `ROOT` is `docs/dictation-20260807/`, which is where `day.mjs` writes
   `day.html`, **so the page has been reachable from this server since the day
   it was generated.** Piece 4 adds no second server and no second draft path:
   one endpoint family, one draft file, one lander. Two writing surfaces for
   one entry is how a question gets two answers, and two SERVERS for one
   surface is the same defect with a port number on it.

   WHAT IS NEW HERE IS THE REFUSAL, NOT THE ROAD. `/day/save` will not write a
   draft that was typed against a Record the tree no longer holds — see THE
   PROVENANCE REFUSAL below. That is the guard for the loss the day editor
   would otherwise have shipped with, and it is deliberately on the end that
   WRITES, because the page can be stale about anything including its own
   staleness.

     npm run day:serve        the day editor      (where he writes)
     npm run record:serve     the Record editor   (mothballed since 2026-08-12)

   Both start THIS file. It prints both addresses either way.
   ===========================================================================

   [N1 2026-08-11] MIKE PRESSED SAVE AND IT WENT TO Downloads, and he moved the
   file across by hand. That is the step this whole build existed to remove, so
   it is worth being exact about why it happened.

   `showSaveFilePicker` IS NOT AVAILABLE ON A `file://` PAGE. The File System
   Access API is gated on a SECURE CONTEXT, and `file://` is not one — the
   editor's own check (`typeof window.showSaveFilePicker !== "function"`) was
   therefore true every time he opened the page by double-clicking it, and it
   fell back to `download()`, exactly as designed. The fallback did the right
   thing and said so; the problem is that the road it falls back to ends in
   Downloads.

   TWO WAYS OUT, AND THIS IS THE CHEAPER ONE. Serving the page over
   `http://127.0.0.1` makes it a secure context, which brings the picker back —
   but a picker still asks him to choose a folder the first time and to grant
   permission after a restart. A LOCAL SERVER THAT ACCEPTS THE SAVE ITSELF
   asks nothing: the page POSTs the draft, this writes it to the one path the
   lander reads, and the page says where it went. No dialog, no Downloads, no
   move.

   WHAT IT COSTS MIKE: one command instead of a double-click.
       npm run record:serve      then open the URL it prints
   It replaces opening the .html file directly. Everything else is the same
   page, because it IS the same page — this serves the file `npm run record`
   already builds and does not generate a byte of its own.

   WHAT IT WILL NOT DO, DELIBERATELY:
     · It binds 127.0.0.1 ONLY. Not 0.0.0.0, not a LAN address. Nothing on the
       network can reach it, because this endpoint writes to the repo.
     · It writes ONE path — `docs/dictation-20260807/record-draft.json` — which
       is a constant here, not anything the request can influence. There is no
       filename in the protocol to traverse with.
     · It refuses a body that is not JSON with an `entries` array, so a stray
       POST cannot leave an unreadable draft where the lander expects one.
     · It serves only from `docs/dictation-20260807/`, resolved and checked, so
       a `..` in a URL cannot walk out of that directory.
   =========================================================================== */

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import url from "node:url";
import crypto from "node:crypto";

import { RECORD_SOURCE } from "../../reveal/record-entries.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const ROOT = path.join(REPO, "docs", "dictation-20260807");
const DRAFT = path.join(ROOT, "record-draft.json");
const MARKS = path.join(ROOT, "readiness.json");
const SOURCE = path.join(REPO, RECORD_SOURCE);
const PORT = Number(process.argv.find(a => /^\d+$/.test(a)) || 8899);

/* ═══ THE PROVENANCE REFUSAL ═══════════════════════════════════════════════
   **THE LOSS THIS EXISTS FOR, IN ORDER.** `day.html` is a GENERATED SNAPSHOT:
   `npm run day` bakes the entries into it from the tree. Nothing in the page
   knew which tree it came from, so:

     09:00  npm run day; he opens the page and leaves the tab open.
     14:00  the tree moves — a landing, a hand edit, a git checkout.
     16:00  he types in the still-open tab and saves. The POST stamps
            `saved` = 16:00, HONESTLY, because that is when he saved.
     then   record:land's guard 8 compares 16:00 to 14:00 and PASSES,
            and 09:00's words land on top of 14:00's.

   **GUARD 8 COMPARES STAMPS, NOT CONTENT, AND THE STAMP IS TRUE.** It cannot
   see this and it is not defective for not seeing it: it was built to catch a
   draft that is old, and this draft is new — it is the PAGE that is old.

   IT IS OPERATIONS §8's WORKBOOK HAZARD ONE SURFACE OVER, and that row is
   worth reading beside this one: `record:land`'s staleness guard is inert on
   the workbook path for exactly the same reason, because `workbook_to_draft.py`
   stamps `saved` with `now()`. A generated page that stamps at POST time has
   the identical defect. It was named before Piece 4 was built rather than
   after, which is the only reason this function exists.

   SO THE PAGE CARRIES THE STATE IT WAS BAKED FROM AND THIS COMPARES IT TO THE
   FILE ON DISK NOW. The sha256 is the test; the mtime is carried so the
   refusal can say WHEN it moved rather than only that it did.

   AND THE REFUSAL IS ON BOTH ENDS BY RULING, NOT BY BELT AND BRACES. The
   server refuses because it is the thing that writes. The page checks on focus
   because it can tell him before he has typed for an hour, and a page that
   only found out at Save would have let him write into a document that was
   already lost. */
function sourceState() {
  const buf = fs.readFileSync(SOURCE);
  return {
    file: RECORD_SOURCE,
    sha256: crypto.createHash("sha256").update(buf).digest("hex"),
    mtime: fs.statSync(SOURCE).mtime.toISOString(),
    bytes: buf.length,
  };
}

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

const HAS_DAY = fs.existsSync(path.join(ROOT, "day.html"));
const HAS_RECORD = fs.existsSync(path.join(ROOT, "record.html"));
if (!HAS_DAY && !HAS_RECORD) {
  console.error(`No editor in ${path.relative(REPO, ROOT)}.`);
  console.error("Build one first:  npm run day      (the writing surface)");
  console.error("                  npm run record   (the Record editor)");
  process.exit(1);
}

const json = (res, code, obj) => {
  res.writeHead(code, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
};
const readBody = (req, res, then) => {
  let body = "";
  req.on("data", c => { body += c; if (body.length > 8 * 1024 * 1024) req.destroy(); });
  req.on("end", () => {
    let parsed;
    try { parsed = JSON.parse(body); }
    catch (e) { json(res, 400, { ok: false, why: "not JSON: " + e.message }); return; }
    then(parsed, body);
  });
};

const server = http.createServer((req, res) => {
  const route = req.url.split("?")[0];

  /* ---- WHAT THE TREE READS RIGHT NOW ------------------------------------
     The page asks this on focus. It is a GET and it writes nothing, so a
     page left open overnight can find out it is stale without risking a
     byte. */
  if (req.method === "GET" && route === "/day/source") {
    try { json(res, 200, { ok: true, source: sourceState() }); }
    catch (e) { json(res, 500, { ok: false, why: String(e && e.message) }); }
    return;
  }

  /* ---- THE DAY EDITOR'S SAVE -------------------------------------------
     TWO FILES, AND THEY ARE WRITTEN OR REFUSED TOGETHER. His prose goes to
     the draft; his NOT READY / NOT REQUIRED marks go to `readiness.json`.
     They travel in one request on Ops' ruling: **a page where half the state
     is durable and half is a clipboard is the shape that loses work**, and the
     marks were on a clipboard until today.

     AND IT NEVER CLAIMS THE RECORD. This writes a working copy. The tree is
     written by `npm run record:land -- --write`, which is Mike's, behind its
     own eight guards. Every sentence this endpoint returns says so. */
  if (req.method === "POST" && route === "/day/save") {
    readBody(req, res, (parsed) => {
      if (!parsed || !Array.isArray(parsed.entries)) {
        json(res, 400, { ok: false, why: "no `entries` array — refusing to leave an unreadable "
          + "draft where the lander looks" });
        return;
      }
      if (!parsed.source || !parsed.source.sha256) {
        json(res, 400, { ok: false, why: "this save carries no record of which Record it was "
          + "typed against, so there is no way to tell whether it is about to overwrite work "
          + "that arrived after the page was built. Re-run `npm run day` and reopen the page." });
        return;
      }
      let now;
      try { now = sourceState(); }
      catch (e) { json(res, 500, { ok: false, why: `cannot read ${RECORD_SOURCE}: ${e.message}` }); return; }

      if (parsed.source.sha256 !== now.sha256) {
        json(res, 409, { ok: false, stale: true,
          why: `THE RECORD MOVED AFTER THIS PAGE WAS BUILT. Nothing was written.`,
          detail: `The page was built against ${RECORD_SOURCE} at sha256 `
            + `${String(parsed.source.sha256).slice(0, 16)}… (${parsed.source.mtime || "no mtime"}). `
            + `On disk now it is ${now.sha256.slice(0, 16)}… (${now.mtime}). Saving would send `
            + `this page's older copy of the Record to the lander with a fresh timestamp on it, `
            + `and the lander's staleness guard reads the timestamp, not the words — so it would `
            + `pass, and whatever arrived in between would be gone. Copy anything you have typed `
            + `since you opened this page, then re-run \`npm run day\` and paste it back in.`,
          source: now });
        return;
      }

      /* THE DRAFT — exactly the shape `record:land` reads, plus the provenance
         it was typed against. The lander ignores the extra key; a person
         reading the file a week later does not. */
      const draft = {
        _: "Mike's working copy of the Record. Written by docs/dictation-20260807/day.html "
         + "(tools/dictation/day.mjs), read by tools/dictation/emit-record-entries.mjs. "
         + "Curly braces are notes to Ops. Ops does not hand-edit this file.",
        key: parsed.key || "wb.day.2026-08-26",
        saved: new Date().toISOString(),
        epoch: parsed.epoch || null,
        source: now,
        entries: parsed.entries,
      };
      const draftText = JSON.stringify(draft, null, 1) + "\n";
      const marksText = JSON.stringify({ marks: (parsed.marks || {}) }, null, 2) + "\n";

      /* THE MARKS GO FIRST AND THE DRAFT SECOND, DELIBERATELY. If the second
         write fails, the file that is left behind is the small derived one and
         the words are still in the browser; the other order would leave his
         prose landed and his marks silently behind it. Either failure is
         reported by name rather than folded into one "save failed". */
      const wrote = [];
      try {
        fs.writeFileSync(MARKS, marksText); wrote.push(path.relative(REPO, MARKS));
        fs.writeFileSync(DRAFT, draftText); wrote.push(path.relative(REPO, DRAFT));
      } catch (e) {
        json(res, 500, { ok: false, wrote: wrote.map(w => w.replace(/\\/g, "/")),
          why: `the save failed after writing ${wrote.length} of 2 files: ${e.message}. `
             + `What is on your screen is still complete — do not close the tab.` });
        return;
      }

      const d = parsed.keys && Array.isArray(parsed.keys.gone) ? parsed.keys.gone : [];
      const rel = p => path.relative(REPO, p).replace(/\\/g, "/");
      console.log(`  saved  ${rel(DRAFT)}  ${draftText.length.toLocaleString()} bytes, `
        + `${parsed.entries.length} record(s)`);
      console.log(`  saved  ${rel(MARKS)}  ${Object.keys(parsed.marks || {}).length} day(s) marked`);
      if (d.length) console.log(`  GONE from this day: ${d.join("  ")}`);
      console.log(`  the Record itself is NOT written. npm run record:land -- --write  [MIKE]`);

      json(res, 200, { ok: true, draft: rel(DRAFT), marks: rel(MARKS),
        bytes: draftText.length, records: parsed.entries.length, gone: d,
        landing: "npm run record:land -- --write" });
    });
    return;
  }

  /* ---- THE RECORD EDITOR'S SAVE — UNCHANGED SINCE 2026-08-11 ------------ */
  if (req.method === "POST" && route === "/save") {
    let body = "";
    req.on("data", c => {
      body += c;
      if (body.length > 8 * 1024 * 1024) { req.destroy(); }
    });
    req.on("end", () => {
      let parsed;
      try { parsed = JSON.parse(body); }
      catch (e) { res.writeHead(400, { "content-type": "text/plain" }); res.end("not JSON: " + e.message); return; }
      if (!parsed || !Array.isArray(parsed.entries)) {
        res.writeHead(400, { "content-type": "text/plain" });
        res.end("no `entries` array — refusing to leave an unreadable draft where the lander looks");
        return;
      }
      fs.writeFileSync(DRAFT, body);
      const where = path.relative(REPO, DRAFT).replace(/\\/g, "/");
      console.log(`  saved  ${where}  ${body.length.toLocaleString()} bytes, `
        + `${parsed.entries.length} record(s)`);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true, path: where, bytes: body.length,
                               records: parsed.entries.length }));
    });
    return;
  }

  /* ---- THE PAGE ----------------------------------------------------------
     `/` IS THE DAY EDITOR NOW, and that is Ruling A landing on the door: the
     writing surface is what opens when he types the bare address. The Record
     editor keeps its own address and nothing about it changed. */
  const rel = decodeURIComponent(route);
  const HOME = HAS_DAY ? "/day.html" : "/record.html";
  const file = path.resolve(ROOT, "." + (rel === "/" ? HOME : rel));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain" }); res.end("not here"); return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});

server.listen(PORT, "127.0.0.1", () => {
  let src = null;
  try { src = sourceState(); } catch { /* named below */ }
  console.log(`
  ═══════════════════════════════════════════════════════════════════════

     THE DAY EDITOR — WHERE HE WRITES

         http://127.0.0.1:${PORT}/

  ═══════════════════════════════════════════════════════════════════════
${HAS_DAY ? "" : "\n  NOT BUILT YET — run `npm run day` first.\n"}
  Save writes    docs/dictation-20260807/record-draft.json   (his words)
                 docs/dictation-20260807/readiness.json      (his marks)
  and this window prints a line every time it does.

  IT DOES NOT WRITE THE RECORD. That is one command and it is yours:

                 npm run record:land            (dry run, prints it)
                 npm run record:land -- --write [MIKE]

  The Record it was built against:
     ${src ? `${RECORD_SOURCE}` : `${RECORD_SOURCE} — COULD NOT BE READ`}
     ${src ? `sha256 ${src.sha256.slice(0, 32)}…  ${src.mtime}` : ""}
  A page built against a different one is REFUSED at the save, by sha.

  ${HAS_RECORD ? `The Record editor (mothballed) is at   http://127.0.0.1:${PORT}/record.html`
              : `The Record editor is not built.`}

  Ctrl-C to stop.
`);
});
