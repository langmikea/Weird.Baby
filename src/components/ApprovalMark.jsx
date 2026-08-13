/* ===========================================================================
   THE APPROVAL MARK — the house mark, small, in a corner, when Mike has signed
   this page as it stands. [2026-08-13]
   ---------------------------------------------------------------------------
   PRESENT  = he approved this page, and nothing it shows has changed since.
   ABSENT   = he has not, or it has.

   ═══ IT CANNOT RENDER AT LAUNCH, AND THAT IS STRUCTURAL RATHER THAN CAREFUL ══
   `__WB_APPROVALS__` is a build-time `define` in `vite.config.js`. At the
   LAUNCH stage it is substituted with the literal `null`, so the first line of
   this component becomes `if (!null) return null;` — a constant condition that
   rollup folds, taking the mark, its styles and the whole map out of the
   bundle. **There is no flag to forget and no stage to check at runtime.**
   Proved against a real launch build rather than argued: `npm run
   approval:proof`.

   ═══ WHY IT DOES NOT READ THE ROUTE FROM THE ROUTER ═════════════════════════
   `useLocation()` would drag a react-router hook into a component that must
   compile to nothing at launch, and a hook cannot be dead-code-eliminated as
   cleanly as a constant. `window.location.pathname` is read once at render, in
   development only, where the router and the address bar agree by construction.
   =========================================================================== */

/* eslint-disable no-undef */
const APPROVALS = typeof __WB_APPROVALS__ === "undefined" ? null : __WB_APPROVALS__;
/* eslint-enable no-undef */

export default function ApprovalMark() {
  if (!APPROVALS) return null;                 /* LAUNCH: folded away entirely */

  const here = typeof window === "undefined" ? "" : window.location.pathname;
  /* the longest declared route that matches — `/robots/record` before `/robots` */
  const route = Object.keys(APPROVALS)
    .filter(r => here === r || (r !== "/" && here.startsWith(r + "/")) || here === r)
    .sort((a, b) => b.length - a.length)[0]
    || (here === "/" ? "/" : null);

  if (!route || !APPROVALS[route]) return null;

  return (
    <img
      src="/WeirdBaby_PhotoID.png"
      alt=""
      aria-hidden="true"
      title={`Approved by Mike on ${APPROVALS[route]} — development only`}
      /* TOP-RIGHT, AND THE CORNER WAS CHOSEN BY LOOKING RATHER THAN BY TASTE.
         It sat bottom-right for one build and landed straight on top of
         `.wb-footer`, which already draws "WB / Weird.Baby" — two house marks
         in one corner, the approval one hiding the museum's own. Probed all
         four corners of the Lobby: top-left is the directory panel, bottom-left
         is the directory panel, bottom-right is that footer, and top-right
         holds nothing but layout containers. */
      style={{
        position: "fixed",
        right: 10,
        top: 10,
        width: 34,
        height: 34,
        borderRadius: "50%",
        opacity: 0.55,
        zIndex: 2147483000,
        pointerEvents: "none",
        /* it must never be mistaken for something the museum draws */
        filter: "grayscale(0.15)",
      }}
    />
  );
}
