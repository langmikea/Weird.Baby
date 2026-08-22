/* ===========================================================================
   THE DAY'S STEP — the ninety-day performance, run one command at a time.
   [R1/R2 2026-08-07, THE REVEAL MECHANISM]
   ---------------------------------------------------------------------------
   MIKE'S FRAMING, and it is the constraint that decided the answer rather than
   the requirement that opened it up:

     "During the first 90 days, as the story is told FOR THE FIRST TIME, an
     asset appears ONLY AFTER the story has called for it. This is a ONE-TIME,
     REAL-TIME PERFORMANCE. We never go backwards. We do not need on-demand
     reconfiguration — DAILY IS ENOUGH, for 90 days only. Brute force is
     acceptable if well planned. THE DECISION IS OPS'; the only hard
     requirement is that it IMPACTS MIKE MINIMALLY."

   ═══ THE FINDING, BEFORE THE PRICING: THE MECHANISM ALREADY EXISTS ══════════
   *An asset appears only after the story has called for it* is H2's pull-back
   rule, written on 2026-08-06 and enforced since:

     `delivered()`          the set of paths the Record's entries name
     `publicPlacements()`   that set, normalised to public addresses, plus the
                            signage exceptions
     `placeRule()`          at LAUNCH, a governed path not in that set has NO
                            ADDRESS AT ALL — not a hidden one, not a 404ing one
     `deliveryFaults()`     fails the build in BOTH directions

   So the ninety days do not need a new rule, a new stage or a new schedule.
   They need the LAUNCH stage, which exists, and they need somebody to take one
   step a day. What was actually missing is the step.

   ═══ THE THREE MECHANISMS, PRICED ══════════════════════════════════════════
   Mike named three and asked for one. What each costs is stated in ACTIONS,
   because that is the unit he asked for.

   (a) A DATED MANIFEST THE BUILD READS, ONE DEPLOY A DAY.
       A `schedule.json` of date → what is revealed; the build resolves "today"
       against it. COST: a date per asset, up to 315 of them, all of which are
       Mike's to supply and none of which exist (`when` is null on all 162
       ledger rows, by Doctrine 12). DEFECTS, and the second is fatal: it is a
       SECOND source of truth about what is public, sitting beside the Record
       and free to disagree with it — the museum has paid for that shape four
       times (three catalogue copies, the ledger-as-second-Record, the two
       assets declarations). And a build that reads a clock is a build whose
       output changes with no input changing: `reveal:check` passes on Tuesday
       and fails on Wednesday with no commit in between. Pinning the day as a
       build input fixes the second half and not the first.
       REJECTED — on the duplication, not the clock.

   (b) PER-ENTRY ASSET LISTS, VISIBILITY DRIVEN OFF THE RECORD ITSELF.
       An entry's `assets` array IS the manifest, and the day it publishes is
       the day the assets publish. COST TO MIKE: zero actions beyond dictating
       the entry, which is the thing he was going to do anyway. There is no
       second list to keep, no date to supply, and no schedule to fall behind.
       It cannot reveal early BY CONSTRUCTION and not by discipline: at LAUNCH
       an undelivered governed path is not in the bundle.
       RECOMMENDED, and it is what this file operates.

   (c) HAND-EDITED STATE PER DAY.
       A file somebody edits each morning. COST: one action a day, plus the
       judgement of which assets today's entry called for — which is (b)'s
       answer, re-derived by a human, every day, ninety times. It is (b) with
       the linkage broken and the accuracy made optional, and it is the only
       one of the three that can reveal early by typo.
       REJECTED.

   ═══ WHAT (b) COSTS MIKE PER DAY, IN ACTIONS ═══════════════════════════════
     1. Dictate the day's entry. (He was doing this.)
   That is the list. Everything else is Ops': write the entry into the Record
   with its `assets`, run this file with `--place`, run the standing gates, run
   `npm run deploy:launch`. Four commands, none of them his.

   ═══ THE THREE FAILURES HE ASKED ABOUT, ANSWERED PLAINLY ═══════════════════
   A DAY IS MISSED. Nothing happens. No entry, no publish, no gap to explain
   and no state to repair — the museum is exactly what it was yesterday. This
   is (b)'s strongest property and the reason it survives ninety steps: a
   missed day looks like a day with no entry, because it is one.

   A DAY IS WRONG — an entry publishes a picture it should not have. Strike the
   path from the entry's `assets`, run this file with `--place` (it moves the
   file back behind the door), deploy. Two edits, both mechanical. The gate
   catches the half-done state in either direction.

   AN ASSET MUST BE PULLED BACK AFTER IT HAS SHOWN. The same two edits, and
   THEY WORK AGAINST THIS MUSEUM AND AGAINST NOBODY ELSE. Anything served once
   at a public address may sit in a cache, an archive or on a visitor's disk,
   and nothing in this repository reaches those. So the honest statement is:
   the site stops serving it, immediately and provably; the internet does not
   forget it. Mike's own rule — WE NEVER GO BACKWARDS — is the better answer,
   and this is the repair path for the case where the rule is broken by
   accident rather than by choice.

   ═══ WHAT THIS FILE IS AND IS NOT ══════════════════════════════════════════
   IT COMPUTES NOTHING NEW AND IT IS A RIVAL TO NOTHING. It reads `delivered()`
   and the governed tree — the same two things `deliveryFaults()` reads — and
   turns the two faults that gate already reports into the two MOVES that clear
   them. The reveal ledger stays the authority on revealable things, the asset
   table on files, the transfer classes on how material arrived, and the Record
   on what the story has called for. This is the hand that moves the files.

   AND IT DELIBERATELY DOES NOT DRAW THE TRANSFER CLASS, WHICH IS THE ONE
   OMISSION WORTH DEFENDING. A transfer class is on a LEDGER ROW and this
   report is about FILES; the two tables meet at `assets: [uid]`, which is nine
   rows in a 162-row ledger against a 315-row asset table. A transfer column
   here would be blank on almost every line and read as *unclassified* when it
   means *not joined* — the same defect the dictation pages refused for the
   same reason. The class is enforced where it lives: `transferGuardFaults()`
   in `reveal/transfers.mjs`, called from `validate()`, which both gates run.

   IT IS NOT A GATE. `reveal:check` is the gate and it is unchanged; this exits
   non-zero when the tree is out of step so it can be put in front of a deploy,
   which is a different job from failing a packet.

   IT NEVER TOUCHES THE STAGE. Reading `WB_STAGE` tells you which state a build
   would come out in, and that reading is printed first, because in DEVELOPMENT
   the whole plan below is moot: everything PLACED renders and `npm run deploy`
   publishes the Portal and every photograph. The ninety days are `npm run
   deploy:launch`.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";
import { entries as recordEntries, parseRecord, RECORD_SOURCE,
         RECORD_SOURCE_LEGACY } from "./record-entries.mjs";
import { delivered, publicPlacements, deliveryFaults, SIGNAGE,
         PUBLISHED_BY_RULING } from "./delivery.mjs";
import { GOVERNED_PREFIX, STAGE_PREFIX } from "./placement.mjs";
import { readStage, LAUNCH } from "./stage.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const PUBLIC_TREE = "public" + GOVERNED_PREFIX.replace(/\/$/, "");
const HELD_TREE = "public" + STAGE_PREFIX + GOVERNED_PREFIX.replace(/\/$/, "");

/* The twin is a program and is held for the Portal's reason, not the
   pull-back's. Same exclusion as `delivery.mjs`, and it is imported in spirit
   rather than in code because that file keeps it private — restating one
   filename is cheaper than widening that module's surface for it. */
const NOT_A_PICTURE = new Set(["twin.html"]);

const ARGV = process.argv.slice(2);
const PLACE = ARGV.includes("--place");
const SINCE = (() => {
  const i = ARGV.indexOf("--since");
  return i >= 0 ? ARGV[i + 1] : null;
})();

/* ── the tree ───────────────────────────────────────────────────────────── */
function walk(dir, out = []) {
  const abs = path.join(REPO, dir);
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = dir + "/" + e.name;
    if (e.isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

/**
 * Every governed picture, in exactly one of four states. The first two need
 * nothing; the second two are the moves.
 *
 *   PUBLIC   delivered or signage, and at the public address
 *   HELD     undelivered, and behind the stage door — the rule working
 *   PLACE    delivered and still behind the door → move OUT
 *   PULL     undelivered and at a public address → move BACK
 */
export function plan() {
  const given = delivered();
  const rows = [];
  for (const rel of [...walk(PUBLIC_TREE), ...walk(HELD_TREE)]) {
    const isHeld = rel.startsWith(HELD_TREE + "/");
    const base = isHeld ? rel.slice(HELD_TREE.length + 1) : rel.slice(PUBLIC_TREE.length + 1);
    if (NOT_A_PICTURE.has(base)) continue;
    const webPublic = GOVERNED_PREFIX + base;
    const isDelivered = given.has(webPublic) || given.has(STAGE_PREFIX + webPublic);
    const isSignage = Object.prototype.hasOwnProperty.call(SIGNAGE, base);
    /* [2026-08-22] a file a RULING published belongs at a public address for
       the same reason signage does: no entry delivers it and none ever will.
       Without this the day's step reads the Portal's own fabric as seven
       pictures nobody delivered and offers to pull them all back — which is
       the rule working on a question it was not asked. */
    const isRuled = Object.prototype.hasOwnProperty.call(PUBLISHED_BY_RULING, base);
    const wantsPublic = isDelivered || isSignage || isRuled;
    const state = wantsPublic
      ? (isHeld ? "PLACE" : "PUBLIC")
      : (isHeld ? "HELD" : "PULL");
    rows.push({
      base, state, isHeld, isDelivered, isSignage,
      from: rel,
      to: (state === "PLACE" ? PUBLIC_TREE : HELD_TREE) + "/" + base,
      web: webPublic,
    });
  }
  rows.sort((a, b) => a.base.localeCompare(b.base));
  return rows;
}

/** Move the files the plan says must move. Both directions, nothing else. */
function place(rows) {
  const moves = rows.filter(r => r.state === "PLACE" || r.state === "PULL");
  if (!moves.length) return 0;
  for (const m of moves) {
    const from = path.join(REPO, m.from);
    const to = path.join(REPO, m.to);
    /* A destination that already exists means the same base name is at BOTH
       addresses — §8's two-addresses hazard as two real files rather than two
       rows. Refuse: one of them is stale and this cannot tell which. */
    if (fs.existsSync(to)) {
      console.error(
        `  REFUSED  ${m.base}\n` +
        `           the file is at BOTH addresses. Delete the wrong one by hand;\n` +
        `           nothing here can tell which copy is the live one.`);
      continue;
    }
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.renameSync(from, to);
    console.log(`  ${m.state === "PLACE" ? "placed " : "pulled "} ${m.base}`);
  }
  return moves.length;
}

/* ── the delta ──────────────────────────────────────────────────────────── */
/** What today's Record publishes that `ref`'s did not, and the converse. */
function deltaSince(ref) {
  /* [M1 2026-08-11] TWO PATHS, AND THE SECOND IS NOT A FALLBACK FOR A BUG.
     The entries moved to their own module today. Every ref before that has them
     inside `robots.js`, so a delta against last week must ask for the file that
     existed THEN — and `git show` fails outright on a path that did not exist at
     that ref rather than returning nothing. `parseRecord` reads either shape
     (see `entriesArrayOf`), so once the text is in hand the rest is unchanged.
     The error names BOTH paths, because "not found" here means the Record was
     at neither address and that is the useful thing to print. */
  let old;
  const tried = [];
  for (const p of [RECORD_SOURCE, RECORD_SOURCE_LEGACY]) {
    try {
      old = execFileSync("git", ["show", `${ref}:${p}`],
        { cwd: REPO, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
      break;
    } catch { tried.push(p); }
  }
  if (old === undefined) {
    return { error: `git could not read the Record at \`${ref}\` — tried ${tried.join(" and ")}.` };
  }
  const before = new Set();
  for (const e of parseRecord(old).entries) for (const a of (e.assets || [])) before.add(a);
  const then = publicPlacements(before);
  const now = publicPlacements();
  return {
    added: [...now].filter(p => !then.has(p)).sort(),
    removed: [...then].filter(p => !now.has(p)).sort(),
  };
}

/* ── the report ─────────────────────────────────────────────────────────── */
const stage = readStage(process.env);
const rows = plan();
const by = s => rows.filter(r => r.state === s);
const faults = deliveryFaults();

console.log("\nTHE DAY'S STEP — the Record is the manifest\n");

console.log(`  stage                 ${stage.toUpperCase()}`);
if (stage !== LAUNCH) {
  console.log("                        — in DEVELOPMENT everything PLACED renders and");
  console.log("                          `npm run deploy` publishes the Portal and every");
  console.log("                          photograph. The performance is `deploy:launch`.");
}
console.log(`  record entries        ${recordEntries().length}`);
console.log(`  governed pictures     ${rows.length}`);
console.log(`    public              ${by("PUBLIC").length}   (delivered by an entry, or signage)`);
console.log(`    behind the door     ${by("HELD").length}`);
console.log(`    to place            ${by("PLACE").length}   (an entry calls for it and it is still held)`);
console.log(`    to pull back        ${by("PULL").length}   (public and no entry calls for it)`);

if (SINCE) {
  const d = deltaSince(SINCE);
  console.log(`\n  THE DELTA against \`${SINCE}\``);
  if (d.error) console.log(`    ${d.error}`);
  else if (!d.added.length && !d.removed.length) console.log("    nothing changes. The Record delivers the same set.");
  else {
    for (const p of d.added) console.log(`    +  ${p}`);
    for (const p of d.removed) console.log(`    -  ${p}   (pulled back)`);
  }
}

const moves = by("PLACE").concat(by("PULL"));
if (moves.length) {
  console.log(`\n  ${PLACE ? "MOVING" : "TO MOVE"} — ${moves.length} file${moves.length === 1 ? "" : "s"}`);
  if (PLACE) {
    place(rows);
    console.log("\n  AND THREE THINGS THAT DO NOT FOLLOW AUTOMATICALLY:");
    console.log("    1. `npm run assets:scan` — the table is keyed on the path, and a");
    console.log("       moved file is matched back to its judgement by content hash.");
    console.log("       EXPECT A DEAD TWIN PER MOVE (register K-a): the old row stays,");
    console.log("       flagged `missing`, and `assets:orphans` will not count it.");
    console.log("    2. `npm run reveal:check` — the gate, which is the thing that");
    console.log("       proves the tree and the Record now agree.");
    console.log("    3. `npm run deploy:launch` — an ordinary deploy is DEVELOPMENT.");
  } else {
    for (const m of moves) console.log(`    ${m.state === "PLACE" ? "place " : "pull  "} ${m.base}`);
    console.log("\n    Run `npm run reveal:day -- --place` to move them.");
  }
} else {
  console.log("\n  Nothing to move. The tree and the Record agree.");
}

if (faults.length) {
  console.log(`\n  DELIVERY FAULTS — ${faults.length}`);
  for (const f of faults) console.log(`    ${f}`);
}

const after = PLACE ? plan().filter(r => r.state === "PLACE" || r.state === "PULL").length : moves.length;
console.log("");
process.exit(after || faults.length ? 1 : 0);
