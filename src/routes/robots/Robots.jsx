import { useEffect, useMemo, useState } from "react";
import Exhibit from "../exhibit/Exhibit.jsx";
import { robotsExhibit } from "../../data/artists/robots.js";
import { heldOpen } from "../../lib/held.js";

/* /robots — walk-six structural rebuild (2026-07-25, STAGED ONLY):
   Robots IS the museum's shared exhibit machinery now — an artist config
   driving the SAME Exhibit.jsx as /hr and /wb (the HrSpine.jsx pattern,
   verbatim). The prior page was a lookalike, violating same-only-different;
   it is dead, and the walk-six-killed entry text block died with it
   (kill order executed — not preserved anywhere). Robots-specific surface
   (the twin artifact, the findings log) rides the exhibitFlow seam. */

/* [R1 2026-08-05] `open` IS PASSED STRAIGHT THROUGH AND THIS FILE DECIDES
   NOTHING. `/robots/record` is one route in App.jsx handing a TRACK ID to the
   shared exhibit; the mechanism lives in Exhibit.jsx and every wing inherits
   it, which is same-only-different read forward rather than a robots-shaped
   exception carved here. */

/* ═══ [H1 2026-08-06] THE HELD ALBUM IS ASKED FOR, NEVER ASSUMED ═════════════
   MIKE: **the Portal is HELD FROM LAUNCH and development continues** — online
   for him and for Ops, behind the password on `/admin`, in the same posture as
   `/hr`.
   THIS FILE IS NOT THE LOCK AND MUST NEVER BE MISTAKEN FOR ONE, exactly as
   `HeldWing.jsx` says of itself. The lock is `src/worker.js`, which refuses
   `/assets/held/*` and `/held/*` without the cookie the password mints. The
   flag below only decides whether the wing bothers to ASK for the chunk;
   forging it in a console buys a request the server refuses and a `catch` that
   leaves the deck at its four public albums.
   THE IMPORT IS DYNAMIC BECAUSE THAT IS WHAT PUTS THE MATERIAL BEHIND THE
   DOOR. A static import would land the album's eight engravings, its refusal
   lines and the twin's address in the public robots chunk, which is the whole
   defect H1 exists to prevent; `heldChunkGuard` in vite.config.js fails the
   build if that ever happens by accident. */
export default function Robots({ open = null }) {
  const [portal, setPortal] = useState(null);

  useEffect(() => {
    if (!heldOpen()) return undefined;
    let live = true;
    import("../../data/artists/portal.js")
      .then(m => { if (live) setPortal(m); })
      /* the worker refused it, or the network did. Either way the wing is the
         four public albums and nothing says otherwise — the forger and the
         flat tyre land in the same place, which is H1's own rule. */
      .catch(() => {});
    return () => { live = false; };
  }, []);

  const artist = useMemo(() => {
    if (!portal) return robotsExhibit;
    const spine = [...robotsExhibit.spine];
    spine.splice(Math.min(portal.PORTAL_AT, spine.length), 0, portal.PORTAL_ALBUM);
    return { ...robotsExhibit, spine };
  }, [portal]);

  return <Exhibit artist={artist} open={open} />;
}
