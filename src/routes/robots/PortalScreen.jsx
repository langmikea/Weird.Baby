/* ═══════════════════════════════════════════════════════════════════════════
   THE PORTAL SCREEN — the bezel and the channel buttons, drawn over whatever
   the channel resolves to. [2026-08-21]
   ---------------------------------------------------------------------------
   MIKE: **"the bezel and the channel buttons belong to THE PORTAL, not to the
   machine. The screen is a television set; its frame and its buttons do not
   disappear because of what is on it."**

   ═══ THE DEFECT THIS EXISTS TO FIX ═════════════════════════════════════════
   The overlay draws the machine, the television and the test signal as three
   MUTUALLY EXCLUSIVE branches of one ternary — which is correct and is what
   keeps a set from having two outputs. But the bezel and the strip lived inside
   `twin.html`, so **leaving the machine unmounted the document the buttons were
   in**: television arrived with no frame and no way back. A control that exists
   only on one of three screens is not the Portal's control.

   ═══ THE GEOMETRY IS READ, NOT EYEBALLED ═══════════════════════════════════
   Every number here comes from a measurement already on the record and is
   passed in as data (`latch.bezel` in `portal.js`) rather than typed:
     the bezel PNG is 3000 x 2400, its barrel-curved opening encloses
     x 227..2766, y 202..2213, and the FEED RECT is deliberately TALLER —
     y 194..2229 — because the picture OVERFILLS the opening and the curved
     inner edge crops it.
   **That overscan is the whole trick and it is why any picture is legal here.**
   0 hole pixels fall outside the feed rect, so nothing behind can leak into the
   picture; everything of the picture that is not in the hole is under opaque
   frame. MIKE: *"standard 60s CRT."* Television and the test card therefore get
   exactly the treatment the machine's own picture already gets — **cropped by
   the opening**, not letterboxed into it and not re-cut to fit.

   ═══ THE STRIP SITS WHERE THE TWIN'S SAT, TO THE SAME CONSTANTS ════════════
   `--dig-*` and the group origin are the twin's own numbers (`body.monbase` in
   `twin.html`), carried across so the buttons do not move when the picture
   changes. They are `cqw` of the FRAME, so this element opens a container —
   the same axis the twin resolves them against.
   **The 2x2 of machine controls did NOT come with them.** SCROLL / CLICK /
   SHAKE / POWER are the machine's, and there is no machine to control while
   television is playing.

   ═══ THE STRIP ASKS; IT DOES NOT ANSWER ════════════════════════════════════
   A button dispatches `wb-portal-select-channel` and stops. The panel owns the
   one resolver and replies with the same payload the latch already sends, so
   there is never a second opinion about what a channel carries. This is a
   window event and NOT a postMessage: both ends are the museum's own
   components now and the twin's iframe is out of the path entirely.
   ═══════════════════════════════════════════════════════════════════════════ */
import "./PortalScreen.css";

export default function PortalScreen({ bezel, ch, chList, note, place, onClose, children }) {
  const B = bezel || null;
  const list = Array.isArray(chList) ? chList : [];
  /* ═══ TWO PLACEMENTS, AND THE DIFFERENCE IS WHAT THE PICTURE *IS* ═════════
     `canvas` — the machine. `twin.html` draws the family art on the SAME
       3000x2400 canvas this bezel was cut from, so it is laid edge to edge and
       registers with the frame by construction. Nothing is scaled to fit and
       nothing has to be measured twice.
     `feed`   — television and the test signal. These are pictures with no
       opinion about the canvas, so they go on the measured feed rect and the
       curved opening crops them, exactly as it crops the family art.
     GETTING THIS BACKWARDS IS SILENT AND UGLY: the machine placed on the feed
     rect would be the whole canvas — bezel margin and all — shrunk into the
     hole, a picture of a monitor inside a monitor. */
  const rect = (B && B.feed && place === "feed") ? {
    left: `${(B.feed.x / B.w) * 100}%`,
    top: `${(B.feed.y / B.h) * 100}%`,
    width: `${(B.feed.w / B.w) * 100}%`,
    height: `${(B.feed.h / B.h) * 100}%`,
  } : { left: 0, top: 0, width: "100%", height: "100%" };

  /* no declaration, no frame: the screen falls back to the bare picture rather
     than drawing a box of the wrong shape around it. */
  if (!B) return <div className="ps-plain">{children}</div>;

  return (
    <div className="ps-wrap">
    <div className="ps"
         style={{ "--ar": `${B.w} / ${B.h}`, "--arn": B.w / B.h }}>
      {/* THE PICTURE, on the rect the bezel was measured against. It is
          `object-fit: cover` because the opening CROPS — a 16:9 broadcast and a
          drawn test card both fill the rect and lose their corners to the
          curve, which is what the machine's own picture has always done. */}
      <div className="ps-feed" style={rect}>{children}</div>

      {/* THE FRAME. It is drawn OVER the picture, which is what makes the
          curved opening a crop rather than a border. */}
      <img className="ps-bezel" src={B.src} alt="" aria-hidden="true" />

      {/* THE CHANNEL BUTTONS — the Portal's, not the machine's. */}
      <div className="ps-strip" role="group" aria-label="channel">
        {list.map(n => (
          <button key={n}
                  className={"ps-chy" + (n === ch ? " ps-on" : "")}
                  aria-pressed={n === ch}
                  aria-label={"channel " + n}
                  onClick={() => window.dispatchEvent(
                    new CustomEvent("wb-portal-select-channel", { detail: { ch: n } }))}>
            {n}
          </button>
        ))}
        {/* [S4 2026-07-30, Mike] THE FIFTH POSITION IS THE WAY OUT. It is the
            only close affordance besides Escape, it is inside the picture in
            the machine's own register, and it is learned in one press. It
            moved here with the rest of the strip for the reason the strip
            moved: an exit that disappears when the picture changes is not an
            exit. */}
        <button className="ps-chy ps-chy-x" aria-label="close the portal"
                onClick={onClose}>X</button>
      </div>

      {/* WHAT THE CHANNEL IS CARRYING. The panel used to say this under the
          latch, and the panel is behind a full-screen overlay at the moment it
          matters. It is mechanism state — the one thing that separates *this
          channel has no unit on it* from *this screen is broken*. */}
      {note && <div className="ps-note">{note}</div>}
    </div>
    </div>
  );
}
