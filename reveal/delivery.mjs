/* ===========================================================================
   THE PULL-BACK RULE — NOTHING PUBLISHES UNTIL THE RECORD DELIVERS IT.
   [H2 2026-08-06]
   ---------------------------------------------------------------------------
   MIKE, and the first half of his instruction is about how to WRITE the rule as
   much as what it says: "stated generally and enforced — this applies to
   images, the manual, and probably more, so state it once rather than listing
   categories. Every asset stays held until a Record entry brings it into the
   story, at which point it is placed according to that entry."

   SO THE RULE IS ONE SENTENCE AND THE BOUNDARY IS ONE IDEA: **a picture of the
   objects does not appear on any public surface until a Record entry delivers
   it.** The Record is the log of these machines arriving and being opened. A
   photograph of one of them cannot honestly be on the site before the entry
   that brings it in — that is not a policy about images, it is what the Record
   IS. Anything else the museum happens to own is governed by the same sentence
   the moment the Record is its delivery mechanism, which is why the sentence
   does not name images.

   THE ONE EXCEPTION IS SIGNAGE, AND IT IS DECLARED IN WRITING PER FILE. The
   museum's own wordmark on its own sleeve is not delivered by anybody: nothing
   arrived, nothing was opened, and there is no entry that could ever bring it
   in. `SIGNAGE` below is that list, each row carrying its reason, and it is
   short on purpose. A file that is neither delivered nor signed-off FAILS —
   there is no default in either direction, for the same reason `transfers.mjs`
   has no fall-through: a default is a hole, and the hole would be exactly where
   the next photograph lands.

   FOUR CHECKS, AND THE SECOND IS THE ONE A FUTURE ROUND WILL TRIP.
     1  UNDELIVERED AND PUBLIC    a governed file at an address anybody can type
     2  DELIVERED AND HELD        the converse — an entry brought it in and the
                                  museum is still sitting on it, which is the
                                  rule applied backwards and is just as wrong
     3  NO FALL-THROUGH           every file in the tree is one or the other, in
                                  writing
     4  DELIVERED AND ABSENT      [R2 2026-08-07] an entry names a governed
                                  picture that is at NEITHER address, so the
                                  Record promises a thing the museum does not
                                  have. Checks 1–3 walk FILES and this one walks
                                  the ENTRY, which is why none of them could see
                                  it: a path with no file behind it is not in
                                  any tree to be walked. It has zero instances
                                  today and is written for the ninety daily
                                  steps, where the failure is silent — the entry
                                  publishes, the wall shows nothing, and every
                                  gate in this directory passes.

   WHAT IT CANNOT DO. It reads FILES, so a held photograph composited into a
   published one is invisible to it — the two machine covers were exactly that
   and they were pulled by a person looking, not by this. And "delivered" means
   "named in a Record entry's `assets`", which `reveal/record-entries.mjs` reads
   out of the Record itself; an entry that DESCRIBES a photograph without naming
   the file delivers nothing as far as this is concerned, and that is deliberate
   — the alternative is guessing which picture a sentence meant.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { entries as recordEntries } from "./record-entries.mjs";
import { GOVERNED_PREFIX, STAGE_PREFIX } from "./placement.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");

/* THE GOVERNED TREE — the machines' own pictures, wherever they are parked.
   Both halves are named because the rule is about the ADDRESS, and the same
   photograph is governed whether it is public or behind the door.
   [V1 2026-08-06] BOTH ARE DERIVED FROM `placement.mjs` RATHER THAN TYPED.
   The renderer decides where to LOOK from those two constants and this file
   decides where the file must LIVE; typed twice they would eventually disagree,
   and the symptom would be a picture that is correctly held and correctly
   drawn at an address nothing serves. */
const PUBLIC_TREE = "public" + GOVERNED_PREFIX.replace(/\/$/, "");
const HELD_TREE = "public" + STAGE_PREFIX + GOVERNED_PREFIX.replace(/\/$/, "");

/* Files under the governed tree that are the museum's own lettering rather than
   a picture of the objects. Each row carries the reason it is here; a row with
   no reason is not an exception, it is an oversight with a comma in it. */
export const SIGNAGE = {
  "art/wbr-cover-logo.png":
    "The wing's own sleeve: the WEIRD.BABY ROBOTS wordmark set on the house " +
    "paper with the house mark. There is no machine in the picture, nothing " +
    "about it arrived in a delivery, and no Record entry could ever deliver a " +
    "thing the museum made about itself.",
};

/* The twin is a program, not a picture, and it is held for a different reason
   (H1 — the Portal is held from launch). Naming it here rather than in SIGNAGE
   keeps the two rules from being read as one. */
const NOT_A_PICTURE = new Set(["twin.html"]);

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

/** every path a Record entry names, as a public web path */
export function delivered() {
  const out = new Set();
  for (const e of recordEntries()) for (const a of (e.assets || [])) out.add(a);
  return out;
}

/* ═══ [V1 2026-08-06] THE PUBLIC SET — WHAT THE BROWSER IS TOLD ═════════════
   The only thing `placeRule` needs to answer its question, and it is the
   POSITIVE half on purpose: the governed paths that are already at a public
   address, which is delivered ∪ signage. The negative half — what is behind
   the door — is never handed to the browser, in either stage, because at
   LAUNCH that list would be a directory of exactly what the museum is holding
   back, shipped in the chunk that is holding it back.
   A delivered path may be written either way round in the Record (`/robots/…`
   before delivery is authored, `/held/robots/…` while it is still behind the
   door), so both forms normalise to the public one here — the Record says WHAT
   arrived, not where the file is parked this week.
   [R2 2026-08-07] `given` is a parameter so `reveal/day.mjs` can ask the same
   question of YESTERDAY'S Record without a second copy of this normalisation.
   The default is today's, so every existing caller is unchanged. */
export function publicPlacements(given = delivered()) {
  const out = new Set();
  for (const a of given) {
    if (a.startsWith(STAGE_PREFIX + GOVERNED_PREFIX)) out.add(a.slice(STAGE_PREFIX.length));
    else if (a.startsWith(GOVERNED_PREFIX)) out.add(a);
  }
  for (const k of Object.keys(SIGNAGE)) out.add(GOVERNED_PREFIX + k);
  return out;
}

export function deliveryFaults() {
  const faults = [];
  const given = delivered();

  const files = [...walk(PUBLIC_TREE), ...walk(HELD_TREE)];
  for (const rel of files) {
    const base = rel.startsWith(HELD_TREE + "/")
      ? rel.slice(HELD_TREE.length + 1)
      : rel.slice(PUBLIC_TREE.length + 1);
    if (NOT_A_PICTURE.has(base)) continue;

    const isHeld = rel.startsWith(HELD_TREE + "/");
    const webPublic = "/robots/" + base;
    const webHeld = "/held/robots/" + base;
    const isDelivered = given.has(webPublic) || given.has(webHeld);
    const isSignage = Object.prototype.hasOwnProperty.call(SIGNAGE, base);

    if (isDelivered && isSignage) {
      faults.push(
        `delivery: \`${base}\` is BOTH declared signage and named by a Record ` +
        "entry. Signage is the museum's own lettering, which no entry delivers " +
        "— one of the two claims is wrong and neither is safe to guess at.");
      continue;
    }
    if (!isDelivered && !isSignage) {
      /* 3. NO FALL-THROUGH — but only report it once, as the state it is in */
      if (!isHeld) {
        faults.push(
          `delivery: \`${webPublic}\` is a picture of the objects at a PUBLIC ` +
          "address and no Record entry delivers it. Nothing publishes until the " +
          `Record delivers it — move the file to \`${HELD_TREE}/${base}\`, or, ` +
          "if it is the museum's own lettering rather than a picture of the " +
          "machines, add it to `SIGNAGE` in reveal/delivery.mjs with a reason.");
      }
      continue;               /* held + undelivered is the rule working */
    }
    if (isDelivered && isHeld) {
      faults.push(
        `delivery: \`${base}\` IS delivered — a Record entry names it — and it ` +
        "is still behind the door. The rule runs both ways: an entry brings a " +
        "thing into the story and the thing is then PLACED according to that " +
        `entry. Move it to \`${PUBLIC_TREE}/${base}\`.`);
    }
    if (isSignage && isHeld) {
      faults.push(
        `delivery: \`${base}\` is declared signage and is behind the door. ` +
        "Signage is not held material; either it is the museum's own lettering " +
        "and belongs at a public address, or the SIGNAGE row is wrong.");
    }
  }

  /* a SIGNAGE row naming a file that is not there is the same rot the transfer
     table's own drift guards catch, and for the same reason: an exception list
     nobody re-reads becomes a list of excuses. */
  const have = new Set(files.map(f =>
    f.startsWith(HELD_TREE + "/") ? f.slice(HELD_TREE.length + 1)
      : f.slice(PUBLIC_TREE.length + 1)));
  for (const k of Object.keys(SIGNAGE)) {
    if (!have.has(k)) {
      faults.push(`delivery: SIGNAGE names \`${k}\`, which is not in the tree.`);
    }
  }

  /* 4. DELIVERED AND ABSENT — see the header. Only GOVERNED paths are tested:
     an entry may name a picture the pull-back does not govern (the house's own
     artwork, an artist's image) and that is somebody else's business. */
  for (const a of given) {
    const base = a.startsWith(STAGE_PREFIX + GOVERNED_PREFIX)
      ? a.slice((STAGE_PREFIX + GOVERNED_PREFIX).length)
      : a.startsWith(GOVERNED_PREFIX) ? a.slice(GOVERNED_PREFIX.length) : null;
    if (base === null) continue;
    if (!have.has(base)) {
      faults.push(
        `delivery: a Record entry delivers \`${a}\`, and there is no such file ` +
        `at either address — not \`${PUBLIC_TREE}/${base}\` and not ` +
        `\`${HELD_TREE}/${base}\`. The entry brings a picture into the story and ` +
        "the museum does not have it. Either the path is wrong or the file was " +
        "never added; nothing here can tell which, and guessing would put a " +
        "different photograph on the wall than the entry describes.");
    }
  }

  return faults;
}
