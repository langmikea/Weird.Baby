import { useEffect, useMemo, useState } from "react";
import Exhibit from "../exhibit/Exhibit.jsx";
import { robotsExhibit } from "../../data/artists/robots.js";

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
   `/assets/held/*` and `/held/*` at LAUNCH without the cookie the password
   mints. The flag below only decides whether the wing bothers to ASK for it;
   forging it in a console buys a request the server refuses and a `catch` that
   leaves the deck at its four public albums.
   THE IMPORT IS DYNAMIC BECAUSE THAT IS WHAT PUTS THE MATERIAL BEHIND THE
   DOOR. A static import would land the album's eight engravings, its refusal
   lines and the twin's address in the public robots chunk, which is the whole
   defect H1 exists to prevent; `heldChunkGuard` in vite.config.js fails the
   build if that ever happens by accident.

   ═══ [V1 2026-08-06] AND IN DEVELOPMENT IT IS ASKED FOR WITHOUT THE PASSWORD ══
   MIKE: **"THE PORTAL COMES BACK IMMEDIATELY; he said he needs to see it."**
   NOTHING ABOUT THE ARRANGEMENT ABOVE CHANGES — the album is still its own
   module, the chunk still lands under `assets/held/`, the guard still fails a
   build that lets it escape. The only thing the stage moves is whether
   `src/worker.js` opens that directory, and this line is the browser noticing
   that it will. At LAUNCH the condition falls back to exactly what H1 built:
   the session flag, minted by the password on `/admin`.
   THE `catch` IS STILL THE WHOLE ERROR PATH and it still matters more than it
   looks: a forged flag at LAUNCH buys a request the server refuses and a deck
   of four public albums, which is the same place a flat tyre lands. */
export default function Robots({ open = null }) {
  const [portal, setPortal] = useState(null);

  useEffect(() => {
    /* === [2026-08-22] THE GATE IS OFF — MIKE RULED THE PORTAL PUBLIC ======
       This read `if (launched() && !heldOpen()) return undefined;`, and it was
       the SECOND of the two things holding the Portal shut. Taking the module
       out of `HELD_PATHS` puts it in a public chunk; this line still decided
       whether the router bothered to ASK for it. **Without both changes a
       visitor gets nothing** — which is exactly the state Record 005 was
       published into, saying on the glass that the Portal is accessible.
       BOTH IMPORTS WENT WITH IT, rather than being left as a dead read: this
       was the only caller of `heldOpen` and of `launched` in this file, and an
       import kept "in case" is how a retired gate grows back.
       The `catch` below is unchanged and is still the whole error path. */
    let live = true;
    import("../../data/artists/portal.js")
      .then(m => { if (live) setPortal(m); })
      /* the worker refused it, or the network did. Either way the wing is the
         four public albums and nothing says otherwise — the forger and the
         flat tyre land in the same place, which is H1's own rule. */
      .catch(() => {});
    return () => { live = false; };
  }, []);

  /* ═══ [2026-08-26] THE RECORD ASKS; THIS FILE ANSWERS ══════════════════════
     Record 005's `TERMINAL.EXE` attachment dispatches `wb-portal-run-console`
     and nothing else. It has to: `robots-record.js` is a PUBLIC module and the
     console's declaration — the boot lines, the bezel, the whole panel — lives
     in `portal.js`, which this file loads as its own chunk and which nothing
     else imports. Naming that detail in the Record would pull the Portal's
     panel into the public entry and collapse the split.

     SO THIS IS THE ONE PLACE THAT CAN JOIN THEM, and it is the place that
     already holds both: the module is in state above, and the listener reads
     the console track's OWN action rather than a second copy of it. If the
     album is not loaded — a visitor whose chunk request failed — the press
     does nothing, which is the same place H1's forger and flat tyre land.

     IT REUSES THE TRACK'S DECLARATION AND DOES NOT RESTATE IT. One object
     describes TERMINAL.EXE; the track's RUN button and the Record's attachment both
     open it, so the two doors cannot drift into opening different things —
     which is `docs/BACKLOG.md` item 5's own rule, read one level out. */
  useEffect(() => {
    if (!portal) return undefined;
    function run() {
      /* [2026-08-26] IT READS THE TRACK'S `run`, WHICH IS WHERE THE
         DECLARATION MOVED WHEN THE ROW STOPPED HAVING A FACE. Mike ruled the
         click should RUN rather than open a page, so `face.action` went and
         `run` took its place; this re-dispatch follows the declaration rather
         than carrying a second copy of it. One object still describes TERMINAL.EXE
         and both doors still open exactly it. */
      const track = (portal.PORTAL_ALBUM.tracks || [])
        .find(t => t && t.run && t.run.detail
                && t.run.detail.kind === "console");
      if (!track) return;
      window.dispatchEvent(new CustomEvent(track.run.event,
        { detail: track.run.detail }));
    }
    window.addEventListener("wb-portal-run-console", run);
    return () => window.removeEventListener("wb-portal-run-console", run);
  }, [portal]);

  const artist = useMemo(() => {
    if (!portal) return robotsExhibit;
    const spine = [...robotsExhibit.spine];
    spine.splice(Math.min(portal.PORTAL_AT, spine.length), 0, portal.PORTAL_ALBUM);
    return { ...robotsExhibit, spine };
  }, [portal]);

  return <Exhibit artist={artist} open={open} />;
}
