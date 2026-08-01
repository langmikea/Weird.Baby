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
/* [P1 2026-08-02] BOTH OLD CONSTANTS WENT WITH THE FRAMED STAGE.
   PROJECTION_EDGE drew a border there is no longer a border to draw, and
   PROJECTION_BLACK was left declared-and-unread the moment the frame stopped
   painting its own ground - dead either way, so neither stayed.
   [FORK A RULED, Mike 2026-08-02] THE GROUND IS BLACK.
   This briefly carried B9's measured bezel rim (#303030, 5,384 samples,
   median rgb(48,48,48)), chosen so the frame would stop ending - and Mike
   ruled the other way, which is a different intent rather than a corrected
   number: the portal is an object ON a surface, not continuous with it.
   The tone must match the TWIN'S OWN portal ground exactly, because the two
   meet with no seam anywhere across the full-bleed view; both are black, and
   both carry CR1's whisper of screen behind the picture. If one is ever
   changed the other has to move with it. */
const PORTAL_GROUND = "#000";

export default function RobotsExhibitFlow({ activeAlbumId }) {
  const [twinOpen, setTwinOpen] = useState(false);
  /* ======== [CR1 / FORK A (b) 2026-08-02] THE H-TEAR =====================
     Mike's canon: the whole portal view is ITSELF a screen, and the portal is
     a screen ON it. The evidence-in-fiction is a tear that rips through
     EVERYTHING AT ONCE - background and portal together - because a tear can
     only cross both if both are the same surface.
     SO IT IS DRAWN HERE, ABOVE THE IFRAME, AND NOT INSIDE THE TWIN. A tear
     inside the twin could only ever cross the twin; it would prove the
     opposite of what it is there to prove. One element spanning the whole
     view is the only honest place for it.
     DETERMINISTIC, PER THE GLITCH-REALISM LAW. No Math.random anywhere: the
     gaps and the heights come from a fixed script that is walked in order and
     wraps. The same session produces the same sequence, which is what makes
     it a scripted event rather than noise - and it is RARE by design, tens of
     seconds apart, because a tear that happens often is a texture. */
  const [tear, setTear] = useState(null);
  /* [O4] the preset rides the src; default is the plain portal. */
  const [twinSrc, setTwinSrc] = useState("/robots/twin.html?user=1");

  /* [L1 2026-07-31] CLOSING ANNOUNCES ITSELF. The Portal track's face runs a
     live twin and stands down while this overlay holds one — one machine at a
     time. It cannot know when it may come back unless the close says so, and
     an event keeps the seam a seam: the flow still tells the engine nothing
     about twins, it just says the twin is no longer up. */
  function closeTwin() {
    setTwinOpen(false);
    try { window.dispatchEvent(new CustomEvent("wb-robots-twin-closed")); } catch { /* no-op */ }
  }

  /* gap before the tear (ms), then how tall it is (vh) and how far the
     picture slips (px). Walked in order, wrapping - a script, not a shuffle. */
  const TEAR_SCRIPT = [
    { after: 26000, h: 2.4, slip:  7 },
    { after: 41000, h: 1.1, slip: -4 },
    { after: 33000, h: 3.6, slip: 11 },
    { after: 57000, h: 1.7, slip: -6 },
  ];
  const TEAR_MS = 130;                 /* one or two frames of a real rip */
  useEffect(() => {
    if (!twinOpen) { setTear(null); return; }
    let i = 0, alive = true, t1, t2;
    function schedule() {
      const step = TEAR_SCRIPT[i % TEAR_SCRIPT.length];
      t1 = setTimeout(() => {
        if (!alive) return;
        /* the y position walks too, so the rip does not always land in the
           same place - still scripted, still no randomness. */
        const y = 12 + ((i * 37) % 74);
        setTear({ y, h: step.h, slip: step.slip });
        t2 = setTimeout(() => { if (alive) { setTear(null); i++; schedule(); } }, TEAR_MS);
      }, step.after);
    }
    schedule();
    return () => { alive = false; clearTimeout(t1); clearTimeout(t2); };
  }, [twinOpen]);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") closeTwin(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* [S4 2026-07-30] THE PORTAL CLOSES ITSELF. Button 5 on the digit strip is
     now [X], and pressing it posts here. The close affordance is INSIDE the
     picture, in the machine's own register, which is what retires the
     museum-side button — a control floating outside the frame was the "lame
     close button" and it is gone.
     The origin is not checked because the twin is same-origin by
     construction (`/robots/twin.html`), and the only thing this listener can
     do is close a panel the visitor opened. */
  useEffect(() => {
    function onMsg(e) {
      if (e && e.data && e.data.wb === "portal-close") closeTwin();
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
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
    /* ======== [P1 2026-08-02] THE PORTAL VIEW IS THE WHOLE VIEW ==========
       Mike: a full-width empty dark frame with nothing in it but the floating
       portal. What was here was the opposite of that - a 1080px-wide panel,
       centred, with a border, a radius and a 60px drop shadow, sitting on a
       90%-opaque wash with the exhibit showing through at the edges. That is
       a LIGHTBOX: it says "here is a thing on a page". The portal is not a
       thing on a page; the page is supposed to stop existing.
       So the overlay IS the stage now: inset 0, no padding, no border, no
       radius, no shadow, nothing to centre because there is nothing beside
       it. The ground is opaque, not a wash, because a wash means the room
       behind it is still there and dimmed - and it is not still there.
       WHAT IS DELIBERATELY ABSENT: no controls, no chrome, no caption, no
       close button. The way out is [X] on the digit strip, inside the
       picture, in the machine's own register (S4) - plus Escape (W2).
       MOVE AND RESIZE ARE THE TWIN'S OWN and are untouched: the corner grip
       (T3) and the drag live inside the iframe and neither cares what shape
       this frame is. */
    overlay: {
      position: "fixed", inset: 0, zIndex: 1000,
      background: `var(--wb-portal-ground, ${PORTAL_GROUND})`,
    },
    iframe: {
      width: "100%", height: "100%", border: 0, display: "block",
      background: `var(--wb-portal-ground, ${PORTAL_GROUND})`,
    },
    /* [S4 2026-07-30] THE CLOSE CONTROL IS GONE FROM HERE. Its style keys
       and hover state went with it; the way out is [X] on the digit strip,
       inside the picture.
       O1'S FINDING IS KEPT, because it is about a trap and not about a
       button: this control used to ask for `MUSEUM.gold` on
       `PROJECTION_BLACK`, and since the B&W rework **--wb-gold is #211f1c,
       photo black, not gold** — it rendered ~1.06:1, a black label on a black
       block. Anything drawn on the projection ground must be checked against
       it, and "gold" is not a colour in this palette any more. */
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
            {/* [S4] THE OUTSIDE CLOSE BUTTON IS RETIRED. O1 fixed its
                contrast; this ruling removes the control entirely. The way
                out is [X] on the digit strip — inside the picture, in the
                machine's register, learned in one press — plus Escape, which
                W2 asked for and which costs nothing. */}
          <iframe
            style={tear ? { ...S.iframe, transform: `translateX(${tear.slip}px)` } : S.iframe}
            src={twinSrc} title="MGK-VIIIp digital twin — the Portal" />
          {/* the rip itself: a bright hairline with a smeared band under it,
              sitting OVER the whole view. The picture slips sideways for the
              same 130ms, so the band reads as the seam the slip happened at
              rather than as a bar laid on top of a still image. */}
          {tear && (
            <div aria-hidden="true" style={{
              position: "absolute", left: 0, right: 0,
              top: `${tear.y}%`, height: `${tear.h}vh`,
              pointerEvents: "none", zIndex: 2,
              background:
                "linear-gradient(180deg,rgba(255,255,255,.55) 0 1px," +
                "rgba(255,255,255,.10) 1px 40%,rgba(0,0,0,.35) 40% 100%)",
              backdropFilter: "brightness(1.45) contrast(.82)",
              WebkitBackdropFilter: "brightness(1.45) contrast(.82)",
            }} />
          )}
        </div>
      )}
    </>
  );
}
