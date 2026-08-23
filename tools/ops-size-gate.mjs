#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   ops-size-gate.mjs — THE GROUND STATE STAYS READABLE WHOLE

   `docs/canonical/OPERATIONS.md` is the file every session reads FIRST. A
   ground state that cannot be returned through the conduit in one piece is
   not a ground state; it is an archive nobody has cut yet.

   THE CEILING IS 40,000 BYTES, AND THE NUMBER IS AN OBSERVATION, NOT A TASTE:
     · 291,683 bytes could not be returned through the conduit AT ALL.
     ·  43,956 bytes came back whole and intact.
   40,000 sits under a demonstrated pass and roughly seven times under a
   demonstrated fail. The test is whether it can be read whole — nothing else.

   Exit 1 over the ceiling. Run as `npm run ops:size`.
   ═══════════════════════════════════════════════════════════════════════════ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REL  = "docs/canonical/OPERATIONS.md";
const CEILING = 40_000;

/* Disk bytes, not git-blob bytes: this asks whether the file a reader picks
   up can be carried, and a reader picks up what is on disk. */
const bytes = fs.statSync(path.join(REPO, REL)).size;
const pct   = ((bytes / CEILING) * 100).toFixed(1);

console.log("");
console.log("  GROUND-STATE SIZE");
console.log("");
console.log(`    ${REL}`);
console.log(`    ${bytes.toLocaleString("en-US")} bytes  ·  ceiling ${CEILING.toLocaleString("en-US")}  ·  ${pct}% of ceiling`);
console.log("");

if (bytes > CEILING) {
  console.error(`FAIL — over the ceiling by ${(bytes - CEILING).toLocaleString("en-US")} bytes.`);
  console.error("Cut the oldest complete section to docs/canonical/OPERATIONS_ARCHIVE/,");
  console.error("leave its heading and a pointer behind, then run `npm run ops:archive`.");
  console.error("");
  process.exit(1);
}

console.log("PASS — the ground state can be read whole.");
console.log("");
