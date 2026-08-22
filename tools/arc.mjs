#!/usr/bin/env node
/* ===========================================================================
   `npm run arc` — KEEP `docs/ARC.md`'s PUBLISHED HEADLINES PINNED TO THE TREE.
   [2026-08-22]
   ---------------------------------------------------------------------------
   THE INSTRUCTION: *pull Record headlines from the tree so they cannot drift.*

   ═══ WHY THIS REWRITES ONE BLOCK AND NOT THE PAGE ══════════════════════════
   `docs/ARC.md` is **the file Mike writes into** this weekend. A generator that
   owns the whole page would overwrite his arc the first time anybody ran it,
   which is the one failure that would make the file useless. So this touches
   ONLY what is between the two markers and refuses if they are not both there.

   It is the same shape as `docs:numbers`: a published value is a tripwire, and
   the way to keep one honest is to derive it, not to remember it.

   ═══ IT READS THE RECORD, NOT A COPY OF IT ═════════════════════════════════
   Headlines come out of `src/data/artists/robots-record.js` — the entries as
   they ship. `--check` reads the file back and exits 1 if the block is stale,
   so it can stand beside the other gates without writing anything.

   THE DAY COLUMN IS DERIVED FROM THE ENTRY NUMBER, not typed: Record N falls on
   weekday N of the run, five to a week, off the same epoch the museum uses.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const ARC = path.join(REPO, "docs/ARC.md");
const SRC = path.join(REPO, "src/data/artists/robots-record.js");

const BEGIN = "<!-- RECORDS:BEGIN";
const END = "<!-- RECORDS:END -->";
const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const CHECK = process.argv.includes("--check");

/* the entries, in order, with the headline as published. Deliberately a small
   hand-rolled scan rather than a parser: this file must keep working when the
   Record's shape moves, and it says loudly when it cannot find anything. */
function published() {
  const src = fs.readFileSync(SRC, "utf8");
  const out = [];
  const re = /\{\s*no:\s*(\d+),/g;
  let m;
  while ((m = re.exec(src))) {
    const no = Number(m[1]);
    const rest = src.slice(m.index, m.index + 4000).replace(/\/\*[\s\S]*?\*\//g, "");
    const t = /\btitle:\s*"((?:[^"\\]|\\.)*)"/.exec(rest);
    if (t) out.push({ no, title: t[1] });
  }
  return out.sort((a, b) => a.no - b.no);
}

const rows = published();
if (!rows.length) {
  console.error("arc: found no Record entries in " + path.relative(REPO, SRC) +
    " — the Record has moved and this reader must move with it.");
  process.exit(1);
}

const table = [
  "",
  "| # | day | published headline |",
  "|---|---|---|",
  ...rows.map(r =>
    `| ${String(r.no).padStart(3, "0")} | ${DAYS[(r.no - 1) % 5]} | ${r.title} |`),
  "",
].join("\n");

const md = fs.readFileSync(ARC, "utf8");
const a = md.indexOf(BEGIN);
const b = md.indexOf(END);
if (a < 0 || b < 0 || b < a) {
  console.error("arc: the RECORDS markers are missing from docs/ARC.md.\n" +
    "     This tool rewrites ONLY what is between them and will not guess where\n" +
    "     that is — restore both markers rather than letting it own the page.");
  process.exit(1);
}
const head = md.slice(0, md.indexOf("-->", a) + 3);
const next = head + table + md.slice(b);

if (CHECK) {
  if (next === md) { console.log("arc: PASS — the published headlines match the tree."); process.exit(0); }
  console.error("arc: STALE — docs/ARC.md's headline block disagrees with the Record.\n" +
    "     Run `npm run arc` to bring it back.");
  process.exit(1);
}

if (next === md) console.log("arc: already current — " + rows.length + " Record(s).");
else { fs.writeFileSync(ARC, next); console.log("arc: wrote " + rows.length + " Record row(s) into docs/ARC.md."); }
