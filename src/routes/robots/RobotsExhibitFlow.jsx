import { useState, useEffect } from "react";
import { T as MUSEUM } from "../../styles/tokens.js";

/* RobotsExhibitFlow — the Robots exhibit's deck, riding Exhibit.jsx's
   documented extension seam (the same mechanism as HrExhibitFlow; walk-six
   structural rebuild, 2026-07-25, STAGED ONLY).

   Carries the Robots-specific surface the shared machinery has no opinion
   about: THE TWIN ARTIFACT (Run the machine + the museum-ink overlay,
   explicit close only per the W2 ruling) and the findings-log line
   ("come back here..."). Styled with the exhibit's own --wb-* tokens so it
   reads as the deck it is. Props from the seam (activeAlbumId etc.) are
   accepted per contract; NONE are consumed today - activeAlbumId's only
   reader was the findings-log branch, which R1 retired with the album. The
   parameter stays destructured because the seam's contract passes it and a
   future kind will want it; it is not dead code, it is an unused hook. */

/* THE PROJECTION BOOTH. These two are NOT museum tokens and must not become
   them: the overlay that holds the twin is deliberately a dark projection
   booth, per the standing rule "photos are paper; video is television". The
   museum palette is the paper; this is the room the screen lives in. Named
   here so they read as an intentional exception instead of as two more
   stray hexes for the next audit to flag. */
const PROJECTION_BLACK = "#0b0b0a";
const PROJECTION_EDGE  = "#3b3831";

export default function RobotsExhibitFlow({ activeAlbumId }) {
  const [twinOpen, setTwinOpen] = useState(false);
  const [closeHot, setCloseHot] = useState(false);   /* [O1] inline styles have no :hover */
  /* [O4] the preset rides the src; default is the plain portal. */
  const [twinSrc, setTwinSrc] = useState("/robots/twin.html?user=1");

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setTwinOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* [E2 2026-07-30] THE BUTTON MOVED INTO A TRACK. The "Run the machine" face
     in the video panel fires this event; the overlay machinery below is
     unchanged and still owns explicit-close (the W2 ruling) and Escape.
     Exhibit.jsx dispatches a named event rather than calling in, so the shared
     engine never learns what a twin is — the seam stays a seam. */
  /* [O4 2026-07-30] THE PRESET CROSSES THE BOUNDARY IN THE URL.
     The portal track dispatches an id (and, for a Record day, a date); this
     turns it into a query string on the iframe. That is deliberate rather than
     postMessage: a query string survives the iframe boundary, a reload inside
     the overlay, and being copied into a link, and it means the museum and the
     twin share NO CODE — only a contract about two words.
     An unknown id is not filtered here. The twin ignores ids it does not know
     and opens plain, so a preset can be added to the exhibit before the
     machine learns it and the failure mode is "nothing special happened". */
  useEffect(() => {
    function open(e) {
      const d = (e && e.detail) || {};
      const q = new URLSearchParams({ user: "1" });
      if (d.preset) q.set("preset", String(d.preset));
      if (d.day) q.set("day", String(d.day));
      setTwinSrc(`/robots/twin.html?${q.toString()}`);
      setTwinOpen(true);
    }
    window.addEventListener("wb-robots-open-twin", open);
    return () => window.removeEventListener("wb-robots-open-twin", open);
  }, []);

  /* [R3, 2026-07-29] THE THIRD PALETTE IS GONE.
     These six values used to be written as var(--wb-x, #hardcoded), and the
     fallbacks were STALE: #b8974a / #101010 / #6a5520 are the pre-2026
     gold-on-dark scheme, not the photo-paper stock the museum has worn since
     the B&W rework. They never showed, because the tokens do resolve — so
     they were dead code that would have rendered the WRONG palette on the
     one day it mattered. Reading the shared JS source instead gives the
     identical computed values and removes the trap. */
  /* [E4] the deck's three style keys (deck / log / btn) went with it. What
     remains is the overlay the twin lives in. */
  const S = {
    overlay: {
      position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,10,9,0.9)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "3vh 3vw",
    },
    stage: {
      width: "min(96vw, 1080px)", height: "92vh", background: PROJECTION_BLACK,
      border: `1px solid ${PROJECTION_EDGE}`, borderRadius: 4, position: "relative",
      boxShadow: "0 0 60px rgba(0,0,0,0.7)",
    },
    iframe: { width: "100%", height: "100%", border: 0, borderRadius: 4, background: PROJECTION_BLACK },
    /* [O1 2026-07-30] THE BLACK RECTANGLE, DIAGNOSED.
       This control was not unstyled — it was styled on a stale assumption
       about one word. It asked for `MUSEUM.gold` on `PROJECTION_BLACK`, and
       since the B&W rework **--wb-gold is #211f1c: photo black, not gold.**
       So it rendered #211F1C on #0B0B0A — measured on glass, a contrast ratio
       of about 1.06:1. A black block with a black label on it.
       The irony is on the record: tokens.js carries a comment warning that the
       old gold-on-dark fallbacks were stale, and this button walked into the
       same trap from the other side.
       THE FIX READS AGAINST THE ROOM IT IS IN. The overlay is a projection
       booth (deliberately dark, and exempt from the paper palette by the
       standing rule "photos are paper; video is television"), so the control
       is drawn in PRINT STOCK — outline at rest, filling on hover, which is
       the same inversion `.vp-face-action` uses in the light. */
    close: {
      position: "absolute", top: -1, right: -1, zIndex: 2,
      fontFamily: MUSEUM.mono, fontSize: "0.62rem",
      letterSpacing: "0.2em", textTransform: "uppercase",
      background: "transparent", color: MUSEUM.ink,
      border: `1px solid ${MUSEUM.ink}`, padding: "7px 14px", cursor: "pointer",
      lineHeight: 1, transition: "background .18s, color .18s",
    },
    closeHover: {
      background: MUSEUM.ink, color: PROJECTION_BLACK,
    },
  };

  return (
    <>
      {/* ======== E4 2026-07-30: THE DECK IS RETIRED ======================
          MEASURED, not guessed. At 1600x1000 the deck sat at y 847..897 with
          z-index 500 while .ex-main ran y 417..922 — so it COVERED THE BOTTOM
          75px OF BOTH THE TRACKLIST AND THE VIEWER. `.ex-root{padding-bottom}`
          could not help: .ex-main is flex:1 inside .ex-root and grows to fill,
          so the padding moved the floor without moving the deck off it.
          That was half of Mike's "vertical resize is obstructed".
          AND IT HAD NOTHING LEFT TO DO. Its two contents were the log line —
          which R1 collapsed to a single string when the findings-log album
          left the deck — and the "Run the machine" button, which E2 moved into
          the track face where it has a still and a paragraph to earn the
          press. A fixed bar carrying one sentence and a duplicate button is
          not a deck, it is 50px of obstruction with a shadow.
          The OVERLAY machinery below is untouched and still owns the twin,
          explicit-close (W2) and Escape. Only its trigger moved. */}

      {/* [W2 walk-four] explicit close ONLY — the button or Escape. */}
      {twinOpen && (
        <div style={S.overlay}>
          <div style={S.stage}>
            <button
              style={closeHot ? { ...S.close, ...S.closeHover } : S.close}
              onMouseEnter={() => setCloseHot(true)}
              onMouseLeave={() => setCloseHot(false)}
              onFocus={() => setCloseHot(true)}
              onBlur={() => setCloseHot(false)}
              onClick={() => setTwinOpen(false)}
            >Close ✕</button>
            <iframe style={S.iframe} src={twinSrc} title="MGK-VIIIp digital twin — the Portal" />
          </div>
        </div>
      )}
    </>
  );
}
