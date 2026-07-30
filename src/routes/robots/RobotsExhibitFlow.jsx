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

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setTwinOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* [R3, 2026-07-29] THE THIRD PALETTE IS GONE.
     These six values used to be written as var(--wb-x, #hardcoded), and the
     fallbacks were STALE: #b8974a / #101010 / #6a5520 are the pre-2026
     gold-on-dark scheme, not the photo-paper stock the museum has worn since
     the B&W rework. They never showed, because the tokens do resolve — so
     they were dead code that would have rendered the WRONG palette on the
     one day it mattered. Reading the shared JS source instead gives the
     identical computed values and removes the trap. */
  const S = {
    deck: {
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 18, padding: "10px 16px",
      background: MUSEUM.inkSoft,
      borderTop: `1px solid ${MUSEUM.goldLo}`,
    },
    log: {
      fontFamily: MUSEUM.mono, fontSize: "0.58rem",
      letterSpacing: "0.16em", textTransform: "uppercase",
      color: MUSEUM.goldMute,
    },
    btn: {
      fontFamily: MUSEUM.mono, fontSize: "0.62rem",
      letterSpacing: "0.2em", textTransform: "uppercase",
      background: "transparent", color: MUSEUM.gold,
      border: `1px solid ${MUSEUM.goldLo}`,
      padding: "8px 16px", cursor: "pointer",
    },
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
    close: {
      position: "absolute", top: -1, right: -1, zIndex: 2,
      fontFamily: MUSEUM.mono, fontSize: "0.62rem",
      letterSpacing: "0.2em", textTransform: "uppercase",
      background: MUSEUM.gold, color: PROJECTION_BLACK,
      border: `1px solid ${PROJECTION_BLACK}`, padding: "7px 14px", cursor: "pointer",
    },
  };

  return (
    <>
      {/* [V2 walk-seven] deck / player-bar / scroll coordination: the deck
          lifts over the player bar (the exhibit's own :has pattern) and the
          page keeps clearance so the tracklist never hides under the deck.
          Scoped: this style exists only while /robots is mounted. */}
      <style>{`
        body:has(.pb) .rb-deck { bottom: 60px; }
        .rb-deck { transition: bottom 0.3s ease; }
        .ex-root { padding-bottom: 56px; }
      `}</style>
      <div className="rb-deck" style={S.deck}>
        {/* [R1, 2026-07-30] the two-branch log line collapses to one. The
            "robots" album it tested for was removed from the deck (real
            robots only), so the findings-log branch became unreachable —
            dead conditional dressed as a feature. The findings log itself is
            not lost; it lands below the line in the container model. */}
        <span style={S.log}>The artifact: the machine itself, running.</span>
        <button style={S.btn} onClick={() => setTwinOpen(true)}>
          Run the machine
        </button>
      </div>

      {/* [W2 walk-four] explicit close ONLY — the button or Escape. */}
      {twinOpen && (
        <div style={S.overlay}>
          <div style={S.stage}>
            <button style={S.close} onClick={() => setTwinOpen(false)}>Close ✕</button>
            <iframe style={S.iframe} src="/robots/twin.html?user=1" title="MGK-VIIIp digital twin" />
          </div>
        </div>
      )}
    </>
  );
}
