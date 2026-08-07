#!/usr/bin/env node
// tools/lap.mjs — THE PHONE-WIDTH LAP RIG. [N5 2026-08-06]
//
// ═══ WHAT IT ENDS ═══════════════════════════════════════════════════════════
//
// **M97, four rounds running: the 390px half of the standing lap did not run.**
// The reason recorded each time was the same — the browser window on the
// operator's display will not go below **1228 CSS px** and Chrome refuses
// `window.resizeTo` — and each round said so honestly and shipped without half
// of a gate. A gate that quietly does not run is worse than one that fails.
//
// ═══ THE ANSWER, AND WHY IT IS THIS ONE ═════════════════════════════════════
//
// A SAME-ORIGIN IFRAME. The window's size is not the museum's viewport; the
// FRAME's is. A 403px iframe pointed at the dev server gives a document whose
// `innerWidth` is **390** exactly — measured, not assumed — and because it is
// same-origin the driver can reach `contentDocument` and take real
// measurements rather than read pixels off a screenshot.
//
// The 13px difference is the classic scrollbar. The harness asserts the real
// `clientWidth` on every route rather than trusting the arithmetic, because a
// route that does not scroll gets 403 and a lap that silently measured 403 and
// called it 390 would be the same defect in a new coat.
//
// WHY NOT the alternatives: headless Chrome is a second browser to install and
// keep in step; CDP device emulation needs a debugging port the extension does
// not expose. The iframe needs nothing that is not already here, and it is what
// this project used at v50 before the recipe was lost with the scratch file.
//
// ═══ WHY THE HARNESS IS COPIED IN AND DELETED AGAIN ═════════════════════════
//
// It has to be SAME-ORIGIN, so it has to be served by the museum, so it has to
// sit in `public/`. Anything in `public/` is in `dist/client` and a `npm run
// deploy` would publish it. So the file lives in `tools/lap/` where it is
// committed and durable, and this script copies it in for the run and takes it
// out again. `public/_lap.html` is gitignored as a second line of defence.
//
//   npm run lap        copy the harness in, print the URL
//   npm run lap:clean  take it out again
//
// A BUILD IS REQUIRED BETWEEN THEM: the harness is a static file, so it only
// reaches `dist/client` when vite copies `public/`. Run `npm run build` after
// `npm run lap`, then start `wrangler dev` — and remember that wrangler caches
// its asset manifest at startup (OPERATIONS.md §8).
//
// ═══ WHAT THE HARNESS MEASURES ══════════════════════════════════════════════
//
// `window.__lap` on the harness page: `go(route)`, `overflow()` (page-level and
// inner horizontal scroll, anything painting past the edge, broken images,
// `[data-not-ux]` blocks, console errors) and **`anchorTest(selector)`**, which
// is Doctrine 19's own instrument: it records the position of every element
// ABOVE an expander, toggles it, and reports what moved. Zero is the rule.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(REPO, "tools", "lap", "harness.html");
const DST = path.join(REPO, "public", "_lap.html");

if (process.argv.includes("--clean")) {
  if (fs.existsSync(DST)) { fs.unlinkSync(DST); console.log("removed public/_lap.html"); }
  else console.log("public/_lap.html is already absent");
  process.exit(0);
}

fs.copyFileSync(SRC, DST);
console.log(`copied  tools/lap/harness.html  ->  public/_lap.html

  next:  npm run build
         npx wrangler dev --port 8787
         open http://127.0.0.1:8787/_lap

  then in the harness page's console (or via a driver):
         await window.__lap.go("/robots"); window.__lap.overflow()
         await window.__lap.anchorTest("button.vp-rec-open")

  AND WHEN YOU ARE DONE:  npm run lap:clean`);
