/* ===========================================================================
   THE STAGE — WHAT THE MUSEUM IS SHOWING TODAY. [V1 2026-08-06]
   ---------------------------------------------------------------------------
   MIKE, reversing his own instruction of the round before and giving the
   reason: **"DURING DEVELOPMENT, SHOW EVERYTHING THAT IS PLACED, until asked
   to filter. The pull-back rule is a LAUNCH-STATE rule, not a
   development-state one. Mike cannot direct what he cannot see."**

   THAT IS NOT A REPEAL OF THE PULL-BACK RULE AND THIS FILE IS THE PROOF. H2's
   sentence still stands word for word — *a picture of the objects does not
   appear on any public surface until a Record entry delivers it* — and
   `reveal/delivery.mjs` still enforces it against the tree. What was wrong was
   that the rule had only ONE state, so the only way to obey it was to be in it.
   A museum that has not opened is not publishing; it is BUILDING, and the
   person building it has to be able to see the room.

   ═══ SO THERE ARE TWO STAGES AND THEY ARE ONE WORD ══════════════════════════
     DEVELOPMENT   everything PLACED renders. The Portal is in the deck, the
                   photographs are on the walls, the manual page is on its
                   card. The held/delivered state is unchanged in the data and
                   unchanged in the ledger; it is simply not being applied to
                   the view.
     LAUNCH        the pull-back rule is applied. An undelivered picture has no
                   address in the bundle at all — not a hidden one, not a
                   404ing one, NONE — and the Portal is behind the password it
                   has been behind since H1.

   ═══ THE DEFAULT IS DEVELOPMENT, AND THAT IS A DECISION WITH A COST ═════════
   The museum has not launched. Setting the default the other way would mean
   every ordinary `npm run build` produced the state Mike says he cannot work
   in, and he would have to remember a flag to see his own building. So the
   default is what the museum actually is today, and the LAUNCH state is one
   word away: `WB_STAGE=launch`, or `npm run build:launch` / `npm run
   deploy:launch`, which is the same thing spelled out.
   WHAT IT COSTS, SAID PLAINLY RATHER THAN LEFT TO BE DISCOVERED: while the
   default is DEVELOPMENT, a deploy publishes the Portal and the twenty-six
   photographs to anybody who visits weird.baby. That is the instruction — "the
   Portal comes back immediately; he said he needs to see it" — and it is not
   something a future session may quietly reverse by flipping this default. The
   day the answer changes, the default changes with it, in one line, here.

   ═══ WHAT THE STAGE DOES *NOT* TOUCH, AND THIS IS THE LOAD-BEARING HALF ═════
   `/hr` IS NOT STAGED. The Hunter Root wing is held for a PERMISSION reason —
   Mike's R5 ruling that the museum does not have his permission — and a
   permission hold does not expire when a museum opens; it expires when the
   permission arrives. Collapsing the two would mean this switch republishing
   ninety-three of his tracks and a hundred and seven vault image URLs the day
   somebody typed one word, which is the exact class of silent reversal every
   gate in `reveal/` exists to stop.
   SO THE TWO HOLDS HAVE TWO DOORS, NAMED FOR THEIR REASONS:
     `/assets/locked/` + `/locked/`   THE PERMISSION DOOR. Password, always,
                                      in every stage. Nothing here reaches it.
     `/assets/held/`   + `/held/`     THE STAGE DOOR. Open in DEVELOPMENT;
                                      password in LAUNCH.
   `src/worker.js` holds both lists and `reveal/reachability.mjs` check 3 reads
   them back out of the worker, the routing rules and vite's own chunking — so
   a door that stops being wired fails the gate rather than going quiet.

   ═══ AND THE GATES READ THE LAUNCH STATE, NOT THE VIEW ══════════════════════
   Mike: *"make the gate check the LAUNCH state rather than the current view."*
   It does, and mostly by construction rather than by a branch: every check in
   `reachability.mjs` and `delivery.mjs` reads SOURCE and the TREE, and neither
   moves when the stage does. `HELD_PATHS` still parks the Portal's chunk
   behind the door in both stages; the photographs still sit under
   `public/held/` in both; the ledger still says HELD in both. The stage moves
   exactly two things — whether the worker opens the stage door, and what
   `placed()` returns — and check 9 asserts the second one by CALLING the rule
   with a launch configuration, which is the only way to test a state you are
   not in.
   =========================================================================== */

export const DEVELOPMENT = "development";
export const LAUNCH = "launch";
export const STAGES = [DEVELOPMENT, LAUNCH];

/** THE DEFAULT, in one place. See the block above before changing it. */
export const DEFAULT_STAGE = DEVELOPMENT;

/* An unknown value THROWS rather than falling back to the default. A typo'd
   `WB_STAGE=lanuch` silently building the development state is the failure
   mode this whole file is about — a switch you believe you have flipped is
   worse than one you know you have not. */
export function readStage(env = {}) {
  const raw = String(env.WB_STAGE || "").trim().toLowerCase();
  if (!raw) return DEFAULT_STAGE;
  if (!STAGES.includes(raw)) {
    throw new Error(
      `WB_STAGE="${raw}" is not a stage. It is one of: ${STAGES.join(", ")}. ` +
      "Leave it unset for " + DEFAULT_STAGE + ".");
  }
  return raw;
}

export const isLaunch = (stage) => stage === LAUNCH;
