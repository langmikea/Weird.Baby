#!/usr/bin/env node
/* ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. */
/* ===========================================================================
   `npm run mock` — SERVE `docs/` OVER HTTP SO OPS CAN LOOK BEFORE MIKE DOES.
   [2026-08-21]
   ---------------------------------------------------------------------------
   THE STANDING RULE THIS EXISTS FOR: **any mock, render or comparison built for
   Mike to judge is SERVED OVER HTTP and its URL goes in the report. Ops looks
   before Mike does. A rendered artefact with no URL cannot be checked by Ops
   and must not reach him.**

   WHY IT IS A TOOL AND NOT A HABIT. Ops drives Chrome through the extension and
   **the extension refuses `file://`** — it answers "Can't interact with
   browser-internal or unparseable URLs". So a mock written to disk is INVISIBLE
   to Ops by construction: it can be built, described and shipped to Mike
   without anyone on this side ever having seen it. That is what happened to the
   panel mock on 2026-08-21, and it is the same wall the test harness hit on
   15 August, where the fix was also "serve it over HTTP".
   A rule that depends on remembering costs a round every time it is forgotten;
   a one-word command does not.

   IT IS READ-ONLY AND IT IS SCOPED TO `docs/`. No writes, no directory
   listings outside the tree, and `..` cannot climb out — a static server is a
   small thing to get wrong in a way that serves the whole disk.

   IT IS NOT `public/`. The lap harness has to live in `public/` to be
   same-origin with the museum, which is why `npm run lap:clean` exists and why
   `public/` is one `npm run deploy` from being published. A mock has no such
   requirement, so it stays in `docs/` where nothing ships it.

     npm run mock            → http://127.0.0.1:8899/
     npm run mock -- 8123    → another port, if 8899 is busy
   ======================================================================== */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "docs");
const PORT = Number(process.argv[2]) || 8899;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif",
  ".woff2": "font/woff2", ".ico": "image/x-icon",
};

/* the one thing a static server must not get wrong: resolve first, then check
   that what came back is still inside the tree. Checking the RAW path for `..`
   is the version of this that keeps getting bypassed. */
function safe(rel) {
  const p = path.resolve(ROOT, "." + path.posix.normalize("/" + rel));
  return p === ROOT || p.startsWith(ROOT + path.sep) ? p : null;
}

function listing(dir, rel) {
  const rows = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !e.name.startsWith("."))
    .sort((a, b) => (b.isDirectory() - a.isDirectory()) || a.name.localeCompare(b.name))
    .map(e => {
      const href = path.posix.join("/", rel, e.name) + (e.isDirectory() ? "/" : "");
      return `<li><a href="${href}">${e.name}${e.isDirectory() ? "/" : ""}</a></li>`;
    }).join("\n");
  return `<!doctype html><meta charset=utf-8><title>docs/${rel}</title>` +
    `<style>body{font:14px/1.7 system-ui;margin:28px;background:#d8d6c8;color:#211f1c}` +
    `a{color:#3a3730}h1{font-size:15px;letter-spacing:.06em}ul{padding-left:18px}</style>` +
    `<h1>docs/${rel}</h1><ul>${rows}</ul>`;
}

http.createServer((req, res) => {
  const rel = decodeURIComponent((req.url || "/").split("?")[0]);
  const p = safe(rel);
  if (!p) { res.writeHead(403); res.end("outside docs/"); return; }
  try {
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      const idx = path.join(p, "index.html");
      if (fs.existsSync(idx)) {
        res.writeHead(200, { "content-type": TYPES[".html"] });
        res.end(fs.readFileSync(idx));
        return;
      }
      res.writeHead(200, { "content-type": TYPES[".html"] });
      res.end(listing(p, rel.replace(/^\/|\/$/g, "")));
      return;
    }
    res.writeHead(200, {
      "content-type": TYPES[path.extname(p).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(fs.readFileSync(p));
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not in docs/: " + rel);
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log(`docs/ served read-only at http://127.0.0.1:${PORT}/`);
  console.log("the panel mock:  http://127.0.0.1:" + PORT + "/panel-rebuild-20260821/panel.html");
});
