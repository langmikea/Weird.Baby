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

   ═══ [FLAG 2026-08-24 · verified, placed not fixed] ════════════════════════
   **THE SECOND HALF OF THAT SENTENCE IS NOT TRUE OF THE CODE.** The day column
   is `DAYS[(r.no - 1) % 5]` at the table build below — a hard-coded MON…FRI
   cycle keyed on the entry number. **This file never reads `RECORD_EPOCH` and
   imports nothing that does.** Grep it: there is no `recordDay`, no
   `record-epoch.js`, no `Date` of any kind in this module.

   WHY IT MATTERS AND WHY IT IS NOT AN ACADEMIC POINT: move day one to a day
   that is not a Monday and `docs/ARC.md` goes on printing `MON` for Record 001
   — **and `npm run arc:check` goes on printing PASS**, because it compares the
   generated block to the file and both are wrong in the same way. It is
   OPERATIONS §8's own class: an instrument that returns healthy because it
   cannot see the failure mode.

   IT IS HARMLESS TODAY AND THAT IS LUCK, NOT DESIGN. Ruling D put day one on
   **2026-09-07**, which is a Monday, so the cycle and the calendar agree — the
   same luck the outline's ten `MON…FRI` rows are running on. The day either of
   them stops being a Monday is the day this is a defect and not a note.
   **[2026-08-28] THE EPOCH HAS NOW MOVED TWICE AND LANDED ON A MONDAY BOTH
   TIMES** (2026-08-24 → 08-31, 2026-08-28 → 09-07). That is two draws from the
   same lucky urn, not evidence the urn is safe: nothing in this file, and no
   gate anywhere, would have said a word if either had landed on a Tuesday.
   `npm run dictation` would have refused; `npm run arc:check` would have
   passed on a wrong table.

   **[D-a 2026-08-30] FIXED, AND IT WAS THE ONE IMPORT AND THE ONE CALL.** The
   day column is now the weekday of `recordDay(n)`, so it moves with the epoch;
   `DAYS` went from five entries to seven, because the old array could not have
   named a Saturday even once the arithmetic was right. Everything above this
   line is left exactly as it was written — it is the record of what was wrong
   and how long it stood, and the flag being answered does not make it untrue.
   THE READER IS UNCHANGED: `published()` still scrapes `no` and `title` by
   hand, so this file still survives the Record's shape moving. What is still
   assumed — that an entry's number is its offset — is written at the call and
   carried on D-a's row.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
/* [D-a 2026-08-30] THE ONE IMPORT. The museum has exactly one date
   declaration and this is it; the day column is now arithmetic on it rather
   than a cycle that happened to agree with it. */
import { recordDay } from "../src/data/artists/record-epoch.js";

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const ARC = path.join(REPO, "docs/ARC.md");
const SRC = path.join(REPO, "src/data/artists/robots-record.js");

const BEGIN = "<!-- RECORDS:BEGIN";
const END = "<!-- RECORDS:END -->";
/* [D-a 2026-08-30] SEVEN, NOT FIVE. The old five-day array could not name a
   Saturday or a Sunday, so an epoch that moved onto a weekend had nowhere to
   land even once the arithmetic was right. Indexed by `getUTCDay()`, which is
   0 = Sunday, so the array starts there. */
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
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
  /* [D-a 2026-08-30] THE ONE CALL, AND THE FLAG ABOVE IT IS ANSWERED.
     Was `DAYS[(r.no - 1) % 5]` — a fixed MON…FRI cycle that owed nothing to
     `RECORD_EPOCH` and was correct only while day one was a Monday, while
     `arc:check` compared a wrong table against a wrong file and printed PASS.
     Now the day is the weekday of the entry's own date, and that date is
     `recordDay()` — the same arithmetic `robots-record.js` dates itself with.
     Move the epoch to a Tuesday and this column moves with it.

     WHAT IS STILL ASSUMED, AND IT IS THE FILE'S OWN STATED MODEL: that an
     entry's NUMBER is its offset from the epoch. The header says so — *"Record
     N falls on weekday N of the run"* — and it is true of 001–005. It is NOT
     true in general: `record-epoch.js` rules that a gap in the numbers is not a
     defect, so 001–005 followed by 008 would date 008 as the eighth day whether
     or not it is. Reading each entry's real date needs the AST reader, and this
     file's whole virtue is that it is a small hand-rolled one that survives the
     Record's shape moving. **Narrowed, not closed — carried on D-a's row.** */
  ...rows.map(r =>
    `| ${String(r.no).padStart(3, "0")} | ${
      DAYS[new Date(recordDay(r.no) + "T00:00:00Z").getUTCDay()]} | ${r.title} |`),
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
