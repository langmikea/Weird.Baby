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

/* THE READER'S GROUND. Same reasoning as PORTAL_GROUND above and deliberately
   the same value: a plate under the reader is lit ON a dark bench, and the
   bench is the same bench the portal stands on. Named rather than repeated so
   the next audit reads one intention instead of two stray hexes. */
const READER_GROUND = "#000";

export default function RobotsExhibitFlow({ activeAlbumId }) {
  const [twinOpen, setTwinOpen] = useState(false);
  /* ======== [B6 / B8 2026-08-02] THE READER =============================
     MIKE, B6: "MGK panels spawning new windows: counter to our standard
     templates — fix to open in-place per the house pattern."
     MIKE, B8: the owner's manual must be ACTUAL SCANS of the ACTUAL manual,
     reached by microfiche-class technology — the real deal, not "in the
     style of".
     THOSE ARE ONE BUILD, WHICH IS WHY THEY ARE ONE COMPONENT. What B6 wants
     is that a plate opens HERE instead of throwing the visitor into a raw
     image on a browser tab; what B8 wants is a reader that pages and zooms a
     reel of photographed pages. A reader that does the second does the first
     for free — a wall of plates IS a reel with nine frames on it — so the
     wing gets ONE reader and two ways in, rather than a lightbox now and a
     microfiche viewer later that would do the same job twice.
     IT LIVES HERE, NOT IN THE ENGINE, for the same reason the twin does: the
     engine dispatches a door and knows nothing about what opens. WAL declares
     the same collage and gets its own behaviour (a new tab at YouTube),
     because these plates are OURS on OUR origin and those tiles are not. */
  const [reel, setReel] = useState(null);   /* { set, i, title } | null */
  const [zoom, setZoom] = useState(false);
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
  /* [O4] the preset rides the src; the door supplies the address.
     ═══ [H1 2026-08-06] THE ADDRESS IS NOT DECLARED IN THIS FILE ANY MORE ════
     It used to default to `/robots/twin.html?user=1`, which put a held thing's
     address — and the words naming it — in a chunk the public fetches on every
     visit to `/robots`. The Portal is held from launch, so the door now hands
     its own `src` and its own frame title across in the event detail
     (`src/data/artists/portal.js`), and this listener opens what it is given.
     WITH NO `src` IN THE DETAIL, NOTHING OPENS. That is the honest failure: the
     only thing in this museum that can open the twin is the held album, and if
     the held album is not loaded there is no twin to open. */
  const [twin, setTwin] = useState(null);   /* { src, title } | null */

  /* [L1 2026-07-31] CLOSING ANNOUNCED ITSELF, to nobody.
     The rule was: the Portal track's face runs a live twin and stands down
     while this overlay holds one — one machine at a time — so the close had to
     say when the face could come back, and an event kept the seam a seam.
     [R6 2026-08-02] THE LISTENER WENT WITH G1's RETIREMENT OF THE LIVE FACE and
     the dispatch stayed. B7 grepped the whole tree and found no listener for
     `wb-robots-twin-closed` anywhere; it survived only because a dispatch into
     an empty room is silent. It also cost a real minute in the B7 round, when
     the reader's Escape handling had to establish whether firing it could break
     anything — an event nobody receives still has to be reasoned about.
     Removed rather than restored: there is no second machine to stand down, and
     reviving the announcement is the job of whatever revives the live face. */
  function closeTwin() {
    setTwinOpen(false);
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

  /* [B6] ONE KEY HANDLER, AND IT KNOWS WHICH SURFACE IS UP. It used to call
     closeTwin() on every Escape anywhere in the wing, which fired the
     "twin closed" announcement when no twin had been open — harmless only
     because nothing listens to it today. With a second overlay in the room,
     "Escape closes the thing that is open" has to be stated rather than
     assumed: the reader is nearer the visitor, so it goes first. */
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (reel) { setReel(null); setZoom(false); return; }
        if (twinOpen) closeTwin();
        return;
      }
      if (!reel) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") step(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reel, twinOpen]);

  /* the reel wraps at both ends: a reader that stops dead at frame nine is
     asking the visitor to remember where they started. */
  function step(d) {
    setZoom(false);
    setReel(r => {
      if (!r || !r.set.length) return r;
      const n = r.set.length;
      return { ...r, i: (r.i + d + n) % n };
    });
  }

  /* [S4 2026-07-30] THE PORTAL CLOSES ITSELF. Button 5 on the digit strip is
     now [X], and pressing it posts here. The close affordance is INSIDE the
     picture, in the machine's own register, which is what retires the
     museum-side button — a control floating outside the frame was the "lame
     close button" and it is gone.
     The origin is not checked because the twin is same-origin by
     construction (`/held/robots/twin.html`), and the only thing this listener can
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
      if (!d.src) return;                 /* [H1] no address, no door */
      const q = new URLSearchParams({ user: "1" });
      if (d.preset) q.set("preset", String(d.preset));
      if (d.day) q.set("day", String(d.day));
      setTwin({ src: `${d.src}?${q.toString()}`, title: d.frameTitle || "" });
      setTwinOpen(true);
    }
    window.addEventListener("wb-robots-open-twin", open);
    return () => window.removeEventListener("wb-robots-open-twin", open);
  }, []);

  /* [P23 2026-08-02] THE WING GETS DOORS, SO IT NEEDS A DOORMAN.
     The plate wall (the album's own photographs, added this round) opens the
     full-size image; the engine dispatches a name and knows nothing else,
     exactly as it does for the twin above. The verb is this wing's own
     (`linkEvent` in robots.js) rather than WAL's — a collage that fired
     "wb-wal-open-link" here would have been a wall of dead pictures, which is
     the W4a defect arriving in a new room.
     [B6 2026-08-02] AND IT OPENED IN A NEW TAB, WHICH MIKE CAUGHT.
     "Counter to our standard templates — fix to open in-place per the house
     pattern." He is right and the old comment argues his case against
     itself: it reasoned that opening a plate "should not throw away the
     exhibit the visitor is standing in", then threw them into a browser tab
     showing a bare 4.9MB PNG on a white background — no caption, no next
     plate, no way back except the tab strip, and the museum's own chrome
     gone. The house pattern for looking closely at an object is an OVERLAY
     ON THE ROOM: this wing already had one for the twin, and now it has a
     reader for its plates.
     THE FALLBACK IS STILL A TAB, and stays deliberately: an event that
     carries no set is a door to somewhere else, and somewhere else is not
     ours to open in-place. Nothing in the wing fires that today; it is there
     so a future outbound link cannot land in a reader that has nothing to
     read. */
  useEffect(() => {
    function open(e) {
      const d = (e && e.detail) || {};
      if (!d.href) return;
      if (Array.isArray(d.set) && d.set.length) {
        setZoom(false);
        setReel({ set: d.set, i: Number(d.index) || 0, title: d.setTitle || "" });
        return;
      }
      try { window.open(d.href, "_blank", "noopener,noreferrer"); }
      catch { window.location.assign(d.href); }
    }
    window.addEventListener("wb-robots-open-link", open);
    return () => window.removeEventListener("wb-robots-open-link", open);
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

    /* ======== [B6/B8] THE READER ========================================
       DELIBERATELY NOT THE PORTAL'S OVERLAY, though it sits on the same
       ground. The portal's rule is "the page stops existing" — no chrome, no
       caption, no controls, because it is a doorway. A reader is the
       opposite kind of object: it is an INSTRUMENT you operate, so it wears
       its controls where a microfiche reader wears them — a rail under the
       glass with the frame counter, the transport and the magnifier on it.
       Hiding those would not be restraint, it would be a reader you cannot
       read with. */
    reader: {
      position: "fixed", inset: 0, zIndex: 1001,
      background: `var(--wb-portal-ground, ${READER_GROUND})`,
      display: "flex", flexDirection: "column",
    },
    /* the glass. `overflow:auto` ONLY once magnified — at fit there is
       nothing to pan and a scrollbar would be furniture with no function. */
    glass: (z) => ({
      flex: 1, minHeight: 0, position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: z ? "auto" : "hidden",
      cursor: z ? "zoom-out" : "zoom-in",
      background: `var(--wb-portal-ground, ${READER_GROUND})`,
    }),
    /* [B4] THE SITE-WIDE PHOTO LAW, ENFORCED AT THE GLASS. Mike: the robots
       wing is B&W ONLY, the plates included. A plate is grayscaled where it
       is SHOWN rather than where it is stored, so the negative on disk stays
       the negative and the law is one line instead of nine re-exports. */
    plate: (z) => (z
      ? { display: "block", maxWidth: "none", maxHeight: "none",
          filter: "grayscale(1) contrast(1.03)" }
      : { display: "block", maxWidth: "100%", maxHeight: "100%",
          objectFit: "contain", filter: "grayscale(1) contrast(1.03)" }),
    /* the rail: caption on the left, transport on the right, one hairline
       above it. Museum register — mono, spaced, quiet. */
    rail: {
      flexShrink: 0, display: "flex", alignItems: "center", gap: "18px",
      padding: "10px 18px",
      borderTop: "1px solid #2a2a2a", background: "#0a0a0a",
      fontFamily: "'Courier Prime','Courier New',monospace",
    },
    cap: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" },
    capMeta: {
      fontSize: ".62rem", color: "#8a877f", letterSpacing: ".16em",
      textTransform: "uppercase",
    },
    tp: { display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 },
    btn: {
      fontFamily: "'Courier Prime','Courier New',monospace",
      fontSize: ".62rem", letterSpacing: ".16em", textTransform: "uppercase",
      color: "#e8e6e0", background: "transparent",
      border: "1px solid #3a3a3a", padding: "7px 12px", cursor: "pointer",
    },
    /* [N6/N5 2026-08-06] `capTitle` AND `btnOn` ARE BOTH DELETED, and each
       lost its one caller in this round rather than being left declared.
       `capTitle` set the image description Mike struck off the rail; `btnOn`
       was the lit fill on a control that turned out not to be a toggle. A style
       key with no reader is the thing a later audit spends an hour proving is
       dead — and the second one would have been worse than dead, because it
       would have looked like the reader still HAS a pressed state. */
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
            src={twin ? twin.src : undefined} title={twin ? twin.title : ""} />
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

      {/* ======== [B6/B8] THE READER, IN PLACE ==========================
          A plate opens ON the room now, not in a browser tab. The frame is
          lit on the bench, the rail underneath says which frame it is and
          carries the transport, and the way out is the same two the wing
          already teaches: an explicit control, or Escape.
          MAGNIFY IS A REAL 1:1, not a scale factor. These are 3–5MP
          photographs of a physical object, and the whole reason to open one
          is to read the silkscreen on a switch — so the magnified state
          shows the file's own pixels and lets the visitor pan, which is
          what the bench under a real reader does. The no-inner-scroll law
          governs READING SURFACES; panning a magnified plate is the
          instrument working, not a trap swallowing a page. */}
      {reel && reel.set[reel.i] && (() => {
        const f = reel.set[reel.i];
        const many = reel.set.length > 1;
        return (
          /* [N8 2026-08-06] the reader's fallback noun follows the wing's word
             change, PLATE → IMAGE — it is the accessible name when a set
             arrives with no title of its own. */
          <div style={S.reader} role="dialog" aria-modal="true"
               aria-label={(reel.title || "Image") + " — reader"}>
            <div style={S.glass(zoom)} onClick={() => setZoom(z => !z)}>
              <img src={f.img} alt={f.label || ""} style={S.plate(zoom)} />
            </div>
            <div style={S.rail}>
              {/* ══ [N6 2026-08-06] THE DESCRIPTION IS OFF THE RAIL ══════════
                  MIKE: "the image descriptions in the viewer are POOR — remove
                  them all. They return judiciously, later, when Mike pulls each
                  image into the story and knows what it needs to say."
                  SO THE RAIL CARRIES IDENTITY AND POSITION AND NOTHING ELSE:
                  which archive you are in, the frame's own date, and which
                  frame of how many. That is what a microfiche reader's rail
                  says; the interpretation was the part he is striking.
                  THE STRIKE IS SCOPED TO THE VIEWER, WHICH IS WHERE HE READ IT
                  AND WHAT HE NAMED. The same `label` still captions the tile on
                  the wall, where it is how a visitor CHOOSES which photograph to
                  open — a wall of unlabelled pictures is a different instruction
                  from the one he gave. That the two surfaces now disagree about
                  whether a description is worth printing is reported rather than
                  resolved by Ops: OPEN_ACTIONS N-a. */}
              <span style={S.cap}>
                <span style={S.capMeta}>
                  {[reel.title, f.date,
                    "Frame " + (reel.i + 1) + " of " + reel.set.length]
                    .filter(Boolean).join("  ·  ")}
                </span>
              </span>
              <span style={S.tp}>
                {many && (
                  <button style={S.btn} onClick={() => step(-1)}
                          aria-label="Previous frame">&lsaquo; Prev</button>
                )}
                {many && (
                  <button style={S.btn} onClick={() => step(1)}
                          aria-label="Next frame">Next &rsaquo;</button>
                )}
                {/* ══ [N5 2026-08-06] THE CONTROL ACTS; IT NO LONGER REPORTS ══
                    MIKE: "FIT vs MAGNIFY is confusing and the button appears
                    not to work — it follows state rather than acting. Make it
                    ZOOM IN / ZOOM OUT and make the button act."
                    HE IS DESCRIBING A REAL AMBIGUITY AND IT WAS BUILT IN THREE
                    WAYS AT ONCE. The label said the action ("Fit" while
                    magnified) while `aria-pressed` and the inverted fill said
                    the STATE — so the same control was answering "what will
                    happen" and "where am I" in the same instant, in opposite
                    directions. Pressing it changed the picture and flipped the
                    word, which reads exactly like a button that did nothing
                    except rename itself.
                    SO IT IS ONE THING NOW: an ACTION. ZOOM IN when the plate is
                    fitted, ZOOM OUT when it is magnified, drawn the same way in
                    both states, with no `aria-pressed` and no lit fill, because
                    neither belongs on a control that is not a toggle. The
                    zoom-in / zoom-out CURSOR on the glass already says which
                    state you are in and it always did. */}
                <button style={S.btn}
                        onClick={() => setZoom(z => !z)}
                        aria-label={zoom ? "Zoom out to fit" : "Zoom in to full size"}>
                  {zoom ? "Zoom out" : "Zoom in"}
                </button>
                <button style={S.btn}
                        onClick={() => { setReel(null); setZoom(false); }}
                        aria-label="Close the reader">Close</button>
              </span>
            </div>
          </div>
        );
      })()}
    </>
  );
}
