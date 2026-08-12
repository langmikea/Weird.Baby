#!/usr/bin/env node
/* ===========================================================================
   THE RECORD EDITOR, SERVED — so that Save lands in the repo.
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

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const ROOT = path.join(REPO, "docs", "dictation-20260807");
const DRAFT = path.join(ROOT, "record-draft.json");
const PORT = Number(process.argv.find(a => /^\d+$/.test(a)) || 8899);

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2" };

if (!fs.existsSync(path.join(ROOT, "record.html"))) {
  console.error(`No editor at ${path.relative(REPO, path.join(ROOT, "record.html"))}.`);
  console.error("Build it first:  npm run record");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  /* ---- THE SAVE ---------------------------------------------------------- */
  if (req.method === "POST" && req.url.split("?")[0] === "/save") {
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

  /* ---- THE PAGE ---------------------------------------------------------- */
  const rel = decodeURIComponent(req.url.split("?")[0]);
  const file = path.resolve(ROOT, "." + (rel === "/" ? "/record.html" : rel));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain" }); res.end("not here"); return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  res.end(fs.readFileSync(file));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`
  THE RECORD EDITOR is at   http://127.0.0.1:${PORT}/

  Save writes straight to   docs/dictation-20260807/record-draft.json
  and this window prints a line every time it does.

  Then, to land it:         npm run record:land            (dry run)
                            npm run record:land -- --write

  Ctrl-C to stop.
`);
});
