import { useState, useEffect } from "react";

/* RobotsExhibitFlow — the Robots exhibit's deck, riding Exhibit.jsx's
   documented extension seam (the same mechanism as HrExhibitFlow; walk-six
   structural rebuild, 2026-07-25, STAGED ONLY).

   Carries the Robots-specific surface the shared machinery has no opinion
   about: THE TWIN ARTIFACT (Run the machine + the museum-ink overlay,
   explicit close only per the W2 ruling) and the findings-log line
   ("come back here..."). Styled with the exhibit's own --hr-* tokens so it
   reads as the deck it is. Props from the seam (activeAlbumId etc.) are
   accepted per contract; only activeAlbumId is consumed today. */

export default function RobotsExhibitFlow({ activeAlbumId }) {
  const [twinOpen, setTwinOpen] = useState(false);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setTwinOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const S = {
    deck: {
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 18, padding: "10px 16px",
      background: "var(--hr-ink-soft, #101010)",
      borderTop: "1px solid var(--hr-gold-lo, #6a5520)",
    },
    log: {
      fontFamily: "'Courier Prime', monospace", fontSize: "0.58rem",
      letterSpacing: "0.16em", textTransform: "uppercase",
      color: "var(--hr-gold-mute, #8a7440)",
    },
    btn: {
      fontFamily: "'Courier Prime', monospace", fontSize: "0.62rem",
      letterSpacing: "0.2em", textTransform: "uppercase",
      background: "transparent", color: "var(--hr-gold, #b8974a)",
      border: "1px solid var(--hr-gold-lo, #6a5520)",
      padding: "8px 16px", cursor: "pointer",
    },
    overlay: {
      position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,10,9,0.9)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "3vh 3vw",
    },
    stage: {
      width: "min(96vw, 1080px)", height: "92vh", background: "#0b0b0a",
      border: "1px solid #3b3831", borderRadius: 4, position: "relative",
      boxShadow: "0 0 60px rgba(0,0,0,0.7)",
    },
    iframe: { width: "100%", height: "100%", border: 0, borderRadius: 4, background: "#0b0b0a" },
    close: {
      position: "absolute", top: -1, right: -1, zIndex: 2,
      fontFamily: "'Courier Prime', monospace", fontSize: "0.62rem",
      letterSpacing: "0.2em", textTransform: "uppercase",
      background: "var(--hr-gold, #b8974a)", color: "#0b0b0a",
      border: "1px solid #0b0b0a", padding: "7px 14px", cursor: "pointer",
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
        <span style={S.log}>
          {activeAlbumId === "robots"
            ? "Come back here for the updated log of latest findings."
            : "The artifact: the machine itself, running."}
        </span>
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
