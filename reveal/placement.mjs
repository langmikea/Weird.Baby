/* ===========================================================================
   WHERE A PICTURE IS PLACED — ONE RULE, THREE CALLERS. [V1 2026-08-06]
   ---------------------------------------------------------------------------
   The rule the pull-back leaves behind once there are two stages. It is pure,
   importless and idempotent, for the same reason `stripVaultAudio` is: it has
   to run in a browser chunk, in a vite config and in a gate, and a rule that
   cannot run in all three ends up written three times (Doctrine 17).

     `src/lib/placement.js`      the RUNTIME caller — every governed image in
                                 the data goes through it before it is drawn.
     `reveal/delivery.mjs`       derives the tree layout from the same two
                                 constants, so "where the file is" and "where
                                 the page looks" cannot disagree.
     `reveal/reachability.mjs`   check 9 — calls it with a LAUNCH config and
                                 asserts the answer is nothing, which is how a
                                 gate tests a state the build is not in.

   ═══ THE DATA DECLARES THE PUBLIC ADDRESS AND ONLY THE PUBLIC ADDRESS ═══════
   And that is the decision that keeps check 4 meaningful. `robots.js` writes
   `/robots/reference/photos/front_full.png` — the address the picture WILL
   have the day the Record delivers it — and this rule computes the held
   address when it needs one. If the data carried held addresses instead, every
   public module in the wing would be naming the held prefix, check 4 ("a
   public file pointing at held material") would have to be switched off, and
   the museum would lose the only thing that notices a leak inward.
   So the held prefix is typed in exactly one place in `src/`, and that place
   is the module that owns the door.

   ═══ AND AT LAUNCH THERE IS NO ADDRESS, NOT A HIDDEN ONE ═══════════════════
   `placeRule` returns `null`, the renderer draws nothing, and the string never
   enters the bundle. R5's lesson, third application: a filter that stops the
   RENDER still ships the MATERIAL. The public set injected into the browser is
   the PUBLIC paths — never the held ones — so the launch bundle cannot carry a
   held address even as data it declines to use.
   =========================================================================== */

/* The tree the pull-back governs: the machines' own pictures. It is the same
   population `reveal/delivery.mjs` walks, expressed as a web path so the
   browser half can test it without a filesystem. */
export const GOVERNED_PREFIX = "/robots/";

/* The stage door's prefix in the public tree. `public/held/robots/...` ships
   to `/held/robots/...`; `src/worker.js` refuses it at LAUNCH. */
export const STAGE_PREFIX = "/held";

/**
 * @param webPath      the picture's PUBLIC address, as the data declares it
 * @param stage        "development" | "launch"
 * @param publicPaths  Set|Array of governed paths that are ALREADY public —
 *                     delivered by a Record entry, or declared signage
 * @returns the address to draw, or null for "draw nothing"
 */
export function placeRule(webPath, { stage, publicPaths }) {
  if (!webPath) return null;
  /* not a picture of the objects — the house's own sleeves, the lobby's
     photo ID, the artists' imagery. The pull-back does not govern it and this
     rule does not touch it. */
  if (!String(webPath).startsWith(GOVERNED_PREFIX)) return webPath;
  const has = publicPaths instanceof Set
    ? publicPaths.has(webPath)
    : Array.isArray(publicPaths) && publicPaths.includes(webPath);
  if (has) return webPath;
  return stage === "launch" ? null : STAGE_PREFIX + webPath;
}
