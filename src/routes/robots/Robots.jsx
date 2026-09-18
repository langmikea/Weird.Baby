import { useEffect, useMemo, useState } from "react";
import Exhibit from "../exhibit/Exhibit.jsx";
import { robotsExhibitOn } from "../../data/artists/robots.js";
/* [L-e 2026-08-30] the museum's day, live — so a tab already open when the
   day turns gains that day's Record entry without a reload. The wing's own
   door moves with it in App.jsx; the two are one repair. */
import { useMuseumDay, useRunDay } from "../../lib/use-museum-day.js";

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
export default function Robots({ open = null, run = false }) {
  const [portal, setPortal] = useState(null);
  /* [2026-09-11] THE CHARACTER ALBUMS, asked for exactly as the Portal is: a
     dynamic import of a module parked in `HELD_PATHS`, so the four albums and
     their covers stay behind the stage door until Opening Day and are open in
     development. The `catch` is the whole error path, as it is for the Portal:
     no module, no albums, the deck as it was. Mike, 2026-09-11: "each robot as
     an album in the carousel on /robots". */
  const [albums, setAlbums] = useState(null);
  useEffect(() => {
    let live = true;
    import("../../data/artists/robots-albums.js")
      .then(m => { if (live) setAlbums(m); })
      .catch(() => {});
    return () => { live = false; };
  }, []);

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

  const day = useMuseumDay();
  /* [2026-09-18] day N of the launch run: which drops are tracks yet, and what
     `today` means. The albums module answers both; this file only asks. */
  const runDay = useRunDay();
  const at = open === "today"
    ? (albums && albums.todayTrackId ? albums.todayTrackId(runDay) : null)
    : open;
  const artist = useMemo(() => {
    /* [2026-09-18] NO DEAD ENDS, AT THE WING'S FIRST SCREEN. Ruling E opens the
       wing at the door (Sat 10-31, midnight) and the Records keep weekdays at
       five, so from the door until Record 001 on the Monday the wing's front
       track would read "Nothing has been entered in the Record yet." MIKE,
       09-18: "If a thing is not available, it should not be displayed." An
       empty Record is not displayed; it returns with its first entry, in an
       open tab too, because `day` is live. `/robots/record` then degrades to
       the wing's front page, which is `open`'s own stated fallback. */
    const withoutEmptyRecord = (ex) => ({
      ...ex,
      spine: ex.spine.map((album) => {
        const tracks = album && Array.isArray(album.tracks) ? album.tracks : null;
        if (!tracks) return album;
        const kept = tracks.filter((t) => !(t && t.id === "record"
          && t.face && Array.isArray(t.face.entries) && t.face.entries.length === 0));
        return kept.length === tracks.length ? album : { ...album, tracks: kept };
      }),
    });
    /* [L-e 2026-08-30] THE BASE IS ASKED ABOUT THE DAY BEFORE THE PORTAL IS
       SPLICED IN, and the order matters: the splice inserts an album, the day
       re-filters a track inside a different one, and doing the splice second
       means the Portal is never copied twice. `robotsExhibitOn` returns the
       module-load object unchanged when the day has not moved. */
    const base = withoutEmptyRecord(robotsExhibitOn(day));
    if (!portal && !albums) return base;
    const spine = [...base.spine];
    if (portal) spine.splice(Math.min(portal.PORTAL_AT, spine.length), 0, portal.PORTAL_ALBUM);
    /* the four land after the sleeve and the Portal, the Everyday first (Mike: "spot one") */
    if (albums) spine.splice(Math.min(albums.ALBUMS_AT, spine.length), 0, ...albums.characterAlbumsOn(runDay));
    return { ...base, spine };
  }, [portal, albums, day, runDay]);

  /* [2026-09-18] THE LANDING: `open` MAY NAME A TRACK IN AN ALBUM THAT ARRIVES
     LATE. The Portal and the character albums are dynamic imports, so on the
     first render the spine does not hold them yet, and Exhibit resolves `open`
     ONCE, as initial state (its own R1 note says why). A reel's caption that
     lands on `/robots/everyman-answers` would therefore open the wing's front
     page and stay there. The key below remounts the exhibit exactly once, at
     the moment the named track first exists in the spine; with no `open`, or
     with one the base spine already holds (`record`), the key never changes
     and nothing remounts. Exhibit.jsx is untouched. */
  const found = !!at && artist.spine.some((a) =>
    a && Array.isArray(a.tracks) && a.tracks.some((t) => t && t.id === at));

  /* [2026-09-18] `/robots/<track>/run` — THE SECOND ROUGH SHAPE, FOR POINTING AT.
     The first lands on the track and leaves RUN to the visitor; this one lands
     with the machine already coming up, the album behind it. It presses the
     track's own declared action, once, when the track first exists; it restates
     nothing, and a track with no action lands as the first shape does. */
  useEffect(() => {
    if (!run || !found) return undefined;
    let album = null, track = null;
    for (const a of artist.spine) {
      const t = a && Array.isArray(a.tracks) ? a.tracks.find((x) => x && x.id === at) : null;
      if (t) { album = a; track = t; break; }
    }
    const act = track && track.face && track.face.action;
    if (!act || !act.event) return undefined;
    const id = setTimeout(() => window.dispatchEvent(new CustomEvent(act.event, { detail: {
      album: album.id, src: act.src, frameTitle: act.frameTitle, bezel: act.bezel,
    } })), 0);
    return () => clearTimeout(id);
    /* once per landing: `found` and `at` are the landing; the spine's later
       re-filters (a day turning) must not press the button again */
  }, [run, found, at]);                     // eslint-disable-line react-hooks/exhaustive-deps

  return <Exhibit key={found ? `at:${at}` : "front"} artist={artist} open={at} />;
}
