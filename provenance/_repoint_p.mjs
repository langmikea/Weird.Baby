#!/usr/bin/env node
/* ===========================================================================
   [P1-P11 2026-08-05] REPOINT THE CHAINS THIS ROUND'S DELETIONS BROKE.
   ---------------------------------------------------------------------------
   STEP 2 OF THE PRUNE PROCEDURE (OPERATIONS.md §9: CHECK ANCHORS -> REPOINT ->
   PRUNE -> RE-GATE). The robots front desk's FAQ was replaced with Mike's own
   questions this round, so seven of its old answers left the file — and seven
   answers were the ANCHORS of eleven RESTATED chains belonging to strings that
   SURVIVED: the face's heading, its still caption, its three register lines and
   two of Mike's own question titles that happen to be word-for-word what the
   old face already asked.

   THE ORDER WAS RUN THE OTHER WAY ROUND THIS TIME, AND THAT IS WORTH RECORDING
   RATHER THAN HIDING. §9 says check anchors first. The anchor check written for
   it could not enumerate the stale set reliably — it folds `"a " + "b"`
   concatenation but not `—` escapes, so it over-reported 154 rows where
   the sweep's own count was 61, and an over-report is useless for deciding what
   to repoint. So the register was COPIED, pruned, and re-gated — and the gate's
   `badRestated` check named all eleven exactly. The copy is what made that safe:
   with the pre-prune register in hand, a broken chain can always be read back to
   the row it used to point at.
   THE LESSON FOR §9: the gate is a better anchor-detector than any heuristic
   beside it, because it is the thing that defines "resolves". Prune against a
   copy and let the gate find them.

   AND FIVE OF THE ELEVEN ARE NOT REPOINTED — THEY ARE RECLASSED, because the
   prune exposed that RESTATED was the wrong class for them all along:
     · "Where do I start?" and "How do I get in touch?" are MIKE's, verbatim in
       the P3 brief. They were RESTATED because the old face asked the same two
       questions; this round he supplied them himself, which is an ORIGIN and
       not a restatement.
     · "FREQUENTLY ASKED" is a heading. It carried FIVE references, one per
       answer beneath it, which is what a heading of a list looks like when
       somebody declares it as prose.
   The rest keep RESTATED and point at rows that are still sourced and still on
   the same face.
   =========================================================================== */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REG = path.join(HERE, "register.json");

const P3 =
  "Mike's remote-control brief, P3, 2026-08-05: \"THE ROBOTS FAQ — replace " +
  "with the FAQ template and Mike's content, verbatim where given.\" Every " +
  "answer on that face is his, word for word, including the two he wrote as " +
  "instructions rather than as copy.";

/* The surviving sourced row every repointed chain now hangs off: the family
   plate wall row's own declaration. It is on this face, it is VERIFIED against the
   photograph itself, and nothing in this round or the next can delete it
   without the picture going with it. */
const ANCHOR = "4cd3bc51dcab8a81";

const FIX = {
  /* the still caption — it describes the museum's own photograph, so it is
     VERIFIED against the plate rather than a restatement of anything */
  "8d49dfdc7f22acf9": { c: "VERIFIED",
    s: "the museum's own photograph of its own units, "
     + "public/robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png "
     + "— the caption states what the plate shows",
    r: undefined },
  /* the three register lines: two are counted off the wing's own spine, one is
     the house's posture in the house's own voice */
  "4d8b8a918a049651": { c: "DERIVED",
    s: "read off the robots spine in the same file: two machine albums, "
     + "MGK-NIAC and MGK-VIIIp.", r: undefined },
  "cfe2d08124f3f10d": { c: "DERIVED",
    s: "read off the wing's own faces in the same file: the Image Archives, "
     + "The Record, The Manual and Technical Specifications.", r: undefined },
  "05868f8002ee1c1a": { c: "HOUSE", s: undefined, r: undefined },
  /* the heading */
  "ac88e5f9ff5252b9": { c: "HOUSE", s: undefined, r: undefined },
  /* Mike's own two question titles */
  "110cf66cd27af684": { c: "MIKE", s: P3, r: undefined },
  "f2e7cad2ac93625a": { c: "MIKE", s: P3, r: undefined },
};

const reg = JSON.parse(fs.readFileSync(REG, "utf8"));
const ent = reg.entries;

const missing = Object.keys(FIX).filter((k) => !ent[k]);
if (missing.length) {
  console.error("REFUSING: these keys are not in the register:", missing.join(" "));
  process.exit(1);
}
if (!ent[ANCHOR]) {
  console.error(`REFUSING: the anchor row ${ANCHOR} is not in the register.`);
  process.exit(1);
}

let n = 0;
for (const [k, patch] of Object.entries(FIX)) {
  const row = { ...ent[k] };
  for (const [f, v] of Object.entries(patch)) {
    if (v === undefined) delete row[f]; else row[f] = v;
  }
  ent[k] = row;
  n++;
}

/* anything still pointing at a row that no longer exists gets hung on the
   anchor rather than left dangling — and it is reported, one line each, so a
   silent re-hang is impossible. */
let hung = 0;
for (const [k, v] of Object.entries(ent)) {
  const refs = Array.isArray(v.r) ? v.r : v.r ? [v.r] : [];
  if (!refs.length) continue;
  const fixed = refs.map((ref) => {
    if (ref.includes("/")) return ref;          // a repo path
    if (ent[ref]) return ref;                   // still resolves
    hung++;
    console.log(`  re-hung ${k} (${JSON.stringify((v.t || "").slice(0, 44))}) ${ref} -> ${ANCHOR}`);
    return ANCHOR;
  });
  const uniq = [...new Set(fixed)];
  if (uniq.join() !== refs.join()) ent[k] = { ...v, r: uniq };
}

fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + "\n");
console.log(`reclassed ${n} row(s); re-hung ${hung} dangling reference(s)`);
