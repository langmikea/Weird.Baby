#!/usr/bin/env node
/* ===========================================================================
   [N9 2026-08-04] DECLARE THIS ROUND'S 71 NEW STRINGS.
   ---------------------------------------------------------------------------
   A ONE-ROUND SCRIPT, and it is kept for the same reason `assets-declare.mjs`
   was: the classification of a batch is a judgement, and a judgement that only
   exists as a diff cannot be reviewed. It reads `provenance/_undeclared.json`
   (the gate's own emit) and merges a class onto every stub.

   IT IS NOT `backfill-20260804.mjs` AND MUST NOT BECOME IT. That file is the
   audit record of the first classification and is forbidden from re-running
   because its coarse rules would silently absorb anything new. This one names
   every key EXPLICITLY: a stub with no entry below is an error, not a default,
   so it cannot absorb a string nobody classified.
   =========================================================================== */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REG = path.join(HERE, "register.json");
const UND = path.join(HERE, "_undeclared.json");

/* ---- the sources cited more than once ------------------------------------ */
const ROBOTS_REPO =
  "the robots repo's own record — C:/AI/Projects/weird-baby-robots (STATE.md, " +
  "THE_RECORD.md, robots/mgk-viiip/sources/2022-proto-docs/README.md). External " +
  "to this repo; the sweep cannot re-check it.";
const PAPA =
  "a [PAPA] marker — Mike's own to-do list, kept in the data on purpose; " +
  "src/lib/visitor-prose.js scrubs it before render";
const N1 =
  'Mike\'s remote-control brief, N1, 2026-08-04: "The Plates becomes IMAGE ' +
  'ARCHIVE (Mike ruled; retire The Morgue). Robots wing: The Firmware becomes ' +
  'TECHNICAL SPECIFICATIONS; The Parts is REMOVED. Directory loses The: ' +
  'Weird.Baby Robots, Weird.Baby Music, Weird.Baby Foundation."';
const N3 =
  'Mike\'s remote-control brief, N3, 2026-08-04: "DOC CONTROL - a new robots ' +
  'surface: user manuals, originals, digital file storage. AND THE MANUAL\'S ' +
  'STORY: the manual came to us IN PIECES, like everything else - presumably ' +
  'to avoid detection. Spy shit. So there is no complete table of contents, no ' +
  'index, not every page, and therefore not every answer. What we have is ' +
  'assembled from various copies: preliminary, final, marked-up, stamped ' +
  'APPROVED. Stated plainly, and it is why the manual is incomplete."';
const N4 =
  'Mike\'s remote-control brief, N4, 2026-08-04: "WELCOME and CONTACT (robots ' +
  'wing) - BURN DOWN AND REIMAGINE. Contact is plain and simple: ' +
  'papa@weird.baby, no leading, no ceremony."';
const N5 =
  'Mike\'s remote-control brief, N5, 2026-08-04: "THE INFO BOOTH\'S TICKET ... ' +
  'ALSO add ARE YOU TRACKING ME? answered honestly - no login, what cookies ' +
  'do, what we keep (nothing), written against worker.js not against goodwill."';
const N7 =
  'Mike\'s remote-control brief, N7, 2026-08-04: "FOUNDATION LEDGER: add a ' +
  'DONATED BY column, with ANONYMOUS supported as a first-class value."';

/* the code this round\'s privacy answer was written against, clause by clause */
const TRACKING =
  "read clause by clause this session, and every clause is falsifiable from one " +
  "file: src/worker.js (no auth on any route; POST /api/visits inserts exactly " +
  "page + referrer + visited_at; POST /api/guestbook inserts name + note + a " +
  "fixed badge + a timestamp), index.html (the <link rel=stylesheet> to " +
  "fonts.googleapis.com and the two preconnects — the ONLY third party, and the " +
  "clause the previous answer was missing), src/lib/use-arrival.js and " +
  "src/routes/exhibit/Exhibit.jsx (sessionStorage / localStorage, never " +
  "transmitted), and the absence of any Set-Cookie in the worker or " +
  "document.cookie anywhere in src/.";

/* Welcome-face anchors that carry a real origin */
const WELCOME_R = ["3daefcb2e1402bb1", "66409c81eba92b40"];
/* Contact-face anchors */
const CONTACT_R = ["942336b29897a791", "907619cc1acfbdc7"];
/* The Manual face's VERIFIED rows — what Doc Control's PAGES rows restate */
const MANUAL_R = ["63e7db47db396b8e", "05cba6df40937f0e"];
/* Technical Specifications' VERIFIED tree names — what its FILES rows restate */
const TREES_R = ["1704f42e3c6387a8", "5380a42f65fa1a0e"];
/* Doc Control's own MIKE-class canon row */
const CANON_R = ["3574f06ef9c8737f"];

const H = { c: "HOUSE" };
const mike = (s) => ({ c: "MIKE", s });
const ver = (s) => ({ c: "VERIFIED", s });
const re = (r) => ({ c: "RESTATED", r });

const DECL = {
  /* ---- robots front desk: the two typographic cards --------------------- */
  "447b29a75fb8b6d2": mike(N4 + " The address itself is Mike's own and is " +
    "already published as a live mailto: in src/routes/InfoBooth.jsx."),
  "b88e45a1ad68ab26": mike(N3 + " Every word on the card is from that ruling: " +
    "APPROVED is one of his four copy states and the four states are his list."),

  /* ---- Welcome, rebuilt -------------------------------------------------- */
  "3daefcb2e1402bb1": {
    c: "VERIFIED", s: ROBOTS_REPO,
    n: "SAME SOURCE AS THE SENTENCE IT REPLACES (register key e06b36c1dbe6faaf, " +
       "now stale). The ONLY change is the removal of the invented count 'three " +
       "cartons' — the number H4 struck from Record 013 and which had been left " +
       "standing here as register row M15. It is not replaced with another " +
       "number, because nobody supplied one.",
  },
  "2ee0cd99c5c1892c": re(WELCOME_R),
  "cfe2d08124f3f10d": re(WELCOME_R),
  "ade774db78c696dc": H,
  "cc54c355e65deeb2": re(WELCOME_R),
  "6c2d5fa4475b793e": re(WELCOME_R),

  /* ---- DOC CONTROL ------------------------------------------------------- */
  "2b0e18df150348ee": mike(N3),
  "80f3422cc95d3807": mike(N3),
  "1fe03a7a30e9aa3d": mike(N3 + " The three subjects are his, in his order."),
  "364a221a99938323": re(CANON_R),
  "2e8b1e4ef28c7ec5": re(CANON_R),
  "0d66fc5a33915872": re(CANON_R),
  "0599069405ee72d7": re(MANUAL_R),
  "09f83e5b34b96bb4": ver(ROBOTS_REPO + " STATE.md's custody table records the " +
    "11 MGK-VIIIp source originals as held in the OneDrive archive mirror and " +
    "NOT in any repository — which is exactly and only what this line claims."),
  "b4a90745bb08fc93": re(TREES_R),
  "e285e668b47d5de2": H,
  "27dc47a0cafccde9": mike(N3),
  "3574f06ef9c8737f": mike(N3 + " This row IS that ruling, written out. It is " +
    "the one entry on the face whose content is supplied rather than restated."),
  "5aa09bc82c8b6aff": mike(PAPA),
  "65a2f10da1c569a4": H,
  "cf7c4fffdb3f63fb": re(MANUAL_R),
  "9056d10ae88f17df": re(MANUAL_R),
  "50e246d6419338c0": H,
  "59f454f9c8823d25": ver(ROBOTS_REPO + " Same custody table as the ORIGINALS " +
    "register line above."),
  "138d289bdf0a12cc": ver(ROBOTS_REPO + " Same custody table. The second half " +
    "— that what is shown here is a copy and says which copy — is the museum's " +
    "own published state: The Manual's plate is captioned as the working copy."),
  "6c3ee158fff36b76": mike(PAPA),
  "edecc1150fa468a2": H,
  "08ebb8dcb229b863": re(TREES_R),
  "984f7a00b613f890": re(TREES_R),
  "d0da9854bf5291e5": H,

  /* ---- Contact, stripped to the address ---------------------------------- */
  "942336b29897a791": mike(N4),
  "3ac3865bc8e5ec53": re(CONTACT_R),
  "0c338291cbb7d98e": re(CONTACT_R),
  "e4915b278ab139c0": re(CONTACT_R),
  "cf8851b9d1b22afb": re(CONTACT_R),

  /* ---- the renames ------------------------------------------------------- */
  "effe4e52865bec59": mike(N1 + " This closes register row M6: A3 printed both " +
    "candidate names so the choice could be made by looking, and it was."),
  "b226f38f2927301f": mike(N1 + " Same ruling as the track title."),
  "d1a05dec1ff33dc5": H,
  "9f2d9e6d03ab181b": H,
  "45ccbd1ce53edf83": mike(N1 + " Applied to BOTH faces carrying the retired " +
    "name — see the note on the MGK-VIII face for why one would have been worse."),
  "732b964dcc8bd3a7": mike(N1 + " Same ruling as the track title."),
  "d142eb6340b37479": H,
  "5acaad7a32127b64": H,

  /* ---- the stowed-spread affordance and the archive's unit noun ---------- */
  "9a372787948aba1c": H,
  "bfeae30f83fd21cc": H,
  "dec6c9a1e86afd26": H,
  "7c78e89e0ff9d4df": H,
  "f6fdb4f6e4e37270": H,

  /* ---- the Foundation's DONATED BY column -------------------------------- */
  "e686b5874db4f6de": mike(N7),
  "1788f1c3831e529f": H,
  "97183c8889d30531": H,
  "8720dd0393451c69": H,
  "da531ce6fe2a315a": H,
  "168905c9490265b4": H,
  "c8a03d219c20b514": mike(N7 + " The column's name is his."),

  /* ---- the booth: the tracking answer and the two hooks ------------------ */
  "d0b8c905484201d2": mike(N5),
  "2db344c362f1b671": ver(TRACKING),
  "afe295a17f311053": H,
  "272e09d1e5412960": H,
  "252525bdcd981bc6": H,
  "1c87be8400888a60": re(["docs/canonical/THE_CHARTER.md"]),
  "2a88d53e3c98d487": H,
  "41dce02d608410fb": H,
  "1d65f1536386574f": H,

  /* ---- the lobby: the scrolling book and the board ----------------------- */
  "cf17b3389d31bc0e": H,
  "7e08d340d888dd16": H,
  "eb666c1ce6a0be8b": H,
  "4a1c34bfe692f609": H,
  "56f71c783927ab42": mike(N1 + " Only the DIRECTORY line changed; the room's " +
    "own name, title bar and heading are untouched."),
};

/* ═══ PHASE 2 — REPOINT THE ROWS WHOSE ANCHOR THIS ROUND DELETED ════════════
   THE PRUNE EXPOSED THIS AND THAT IS THE MECHANISM WORKING. `--prune` drops
   register rows whose string has left the source; fourteen surviving RESTATED
   rows were resting on two of the rows it dropped, and the gate refused. Every
   reference in an `r` array must resolve — not merely one of them — so a
   RESTATED row cannot quietly keep standing on a citation that has died.

   e06b36c1dbe6faaf — the Welcome face's blurb, EDITED rather than deleted (the
     invented "three cartons" count came out of it, M15). Its successor is
     3daefcb2e1402bb1, same class, same source, one count shorter. Ten rows on
     that face cited the old key and now cite the new one, which is the honest
     repair: the sentence they restate still exists and still says what they
     restate about it.
   8122f5082f6df421 — "[PAPA] — the address itself, and how much of it to
     publish", the note on the REACH entry that N4 DELETED OUTRIGHT. There is no
     successor, so those four rows are repointed at what is actually under them
     now: the address row itself (MIKE) and the surviving [PAPA] on the PURCHASE
     entry. A dead citation is not replaced with a plausible one — it is
     replaced with what is on the face. */
const REPOINT = {
  e06b36c1dbe6faaf: ["3daefcb2e1402bb1"],
  "8122f5082f6df421": ["942336b29897a791"],
};

const reg = JSON.parse(fs.readFileSync(REG, "utf8"));

let moved = 0;
for (const row of Object.values(reg.entries)) {
  if (row.c !== "RESTATED" || !Array.isArray(row.r)) continue;
  if (!row.r.some((x) => REPOINT[x])) continue;
  const next = [];
  for (const ref of row.r) {
    for (const out of REPOINT[ref] || [ref]) if (!next.includes(out)) next.push(out);
  }
  row.r = next;
  moved++;
}
if (moved) console.log(`repointed ${moved} RESTATED row(s) onto live anchors`);

if (!fs.existsSync(UND)) {
  fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + "\n");
  console.log("no _undeclared.json — phase 2 only");
  process.exit(0);
}
const und = JSON.parse(fs.readFileSync(UND, "utf8"));
const stubs = und.entries || und;
if (!Object.keys(stubs).length) {
  fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + "\n");
  console.log("no stubs to declare — phase 2 only");
  process.exit(0);
}

const missing = Object.keys(stubs).filter((k) => !DECL[k]);
if (missing.length) {
  console.error(`REFUSING: ${missing.length} stub(s) have no explicit classification:`);
  missing.forEach((k) => console.error(`  ${k}  ${stubs[k].f}:${stubs[k].l}  ${JSON.stringify(stubs[k].t).slice(0, 90)}`));
  process.exit(1);
}
const extra = Object.keys(DECL).filter((k) => !stubs[k]);
if (extra.length) {
  console.error(`REFUSING: ${extra.length} classification(s) match no stub — the source moved under this script:`);
  extra.forEach((k) => console.error(`  ${k}`));
  process.exit(1);
}

let n = 0;
for (const [k, stub] of Object.entries(stubs)) {
  const { c: _drop, ...rest } = stub;
  reg.entries[k] = { ...rest, ...DECL[k] };
  n++;
}
fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + "\n");
console.log(`declared ${n} row(s) into provenance/register.json`);
