/* ═══════════════════════════════════════════════════════════════════════════
   THE PORTAL SCREEN — the bezel and every control on the glass, drawn over
   whatever the channel resolves to. [2026-08-21, the 2x2 added 2026-08-26]
   ---------------------------------------------------------------------------
   MIKE: **"the bezel and the channel buttons belong to THE PORTAL, not to the
   machine. The screen is a television set; its frame and its buttons do not
   disappear because of what is on it."**

   ═══ THE DEFECT THIS EXISTS TO FIX ═════════════════════════════════════════
   The overlay draws the machine, the television and the test signal as
   MUTUALLY EXCLUSIVE branches of one ternary — which is correct and is what
   keeps a set from having two outputs. But the bezel and the strip lived inside
   `twin.html`, so **leaving the machine unmounted the document the buttons were
   in**: television arrived with no frame and no way back. A control that exists
   only on one of four screens is not the Portal's control.

   ═══ [2026-08-26] AND THE 2x2 IS THE SAME DEFECT, ONE ROW UP ═══════════════
   MIKE: **CH3's surface is the target for all four channels** — the same
   SCROLL, CLICK, POWER, SHAKE and channel strip on every one. **CH3 is the
   reference, not a special case.**

   The August round moved the digit strip and deliberately left the 2x2 behind,
   reasoning *"there is no machine to control while television is playing."*
   That reasoning was sound about the MACHINE and wrong about the SET: a
   television's controls do not vanish because the channel changed. So the 2x2
   follows the strip out, and `twin.html` suppresses its own `#monctl` exactly
   as it already suppressed its own `#monlayout`.

   **SCROLL, POWER AND SHAKE REACH THE MACHINE WHERE THERE IS ONE AND ARE
   IGNORED WHERE THERE IS NOT, AND THE IGNORING IS A RULING.** MIKE, after
   review: *"scroll only does what it was originally designed to do, and in all
   other instances is ignored."* The reasoning, and the warning to a later round
   that will read a dead control as an unfinished one, is at the site that does
   the ignoring — `RobotsExhibitFlow.jsx`, the `wb-portal-machine-control`
   listener. **CLICK always does something**: it is the shutter where there is a
   machine, and it tears on every channel.

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

   ═══ THE GROUP SITS WHERE THE TWIN'S SAT, TO THE SAME CONSTANTS ════════════
   `--chy-*`, `--dig-*` and the group origin are the twin's own numbers
   (`body.monbase` in `twin.html`), carried across so nothing moves when the
   picture changes. They are `cqw` of the FRAME, so this element opens a
   container — the same axis the twin resolves them against.
   **THE PANEL IS NOT FULL AND THAT WAS MEASURED THIS ROUND.** The blank
   lower-right quadrant is 37.77 x 28.57cqw; the whole group — 2x2 plus strip —
   is 31.10 x 20.46cqw, which is **59.0% of it by area**, leaving 3.33cqw of
   slack a side horizontally and 4.05cqw vertically. (An earlier survey called
   the quadrant full by quoting *"1.24cqw on every side"*, which is the P2 note
   of 2026-07-29 that P2b superseded hours later when the boxes were cut
   16.90 → 14.8cqw. The live figure is stated at `twin.html:903`.)

   ═══ THE BUTTONS ASK; THEY DO NOT ANSWER ═══════════════════════════════════
   A channel button dispatches `wb-portal-select-channel` and stops; a machine
   button dispatches `wb-portal-machine-control` and stops. The panel owns the
   one channel resolver and the overlay owns the one forward to the twin, so
   there is never a second opinion about what a channel carries or about what a
   press reaches. These are window events and NOT postMessage: both ends are the
   museum's own components and the twin's iframe is out of that path entirely.
   ═══════════════════════════════════════════════════════════════════════════ */
import "./PortalScreen.css";

/* ═══ THE SHIPPED CHYRON METRICS, MIRRORING `CHY_M` IN `twin.html` ══════════
   Two implementations on disk, the twin's as reference — MIKE's ruling, and it
   is forced rather than chosen: that document is **single-file, no-network by a
   standing constraint** and must work with no museum at all, so it cannot
   import this and this cannot import it. What they share is arithmetic, and
   these five numbers are the whole of it. They also feed `PortalScreen.css`;
   if the twin's group is ever re-measured, both come with it. */
const CHY_M = { w: 14.8, h: 6.0, fs: 3.10, wt: 700,
                dw: 5.26, dh: 5.26, dfs: 3.20, dwt: 700, line: 0.30 };

/* ═══ [T4, ported 2026-07-29 → 2026-08-26] A REAL KNOCKOUT ═════════════════
   THE RULING THIS SATISFIES IS TWO RULINGS, BOTH OF THEM ALREADY IN THIS TREE
   AND NEITHER OF WHICH REACHED THIS FILE WHEN IT WAS BUILT ON 2026-08-21:

     T4 (2026-07-29) — *"the real finding is that **BLACK INK WAS NEVER A
       KNOCKOUT**, on either."* The strip shipped `color:#000` on a white slug,
       which is ink.
     S2 (2026-07-30) — *"a knockout that looks like ink has not knocked anything
       out as far as the eye is concerned."* The scrim was cut .62 → .34 so the
       feed's own texture carries through the letterform, and it MOVES, because
       the feed does.

   MIKE saw it in one shot: the `3` a white slug with black ink, sitting beside
   POWER carrying the proper hole. **The selected channel is a hole, not ink.**

   AND BLENDING CANNOT DO IT. `mix-blend-mode:screen` changes the glyph's COLOUR
   and not its ALPHA — the element still composites opaque — so nothing in that
   family can punch a hole. A hole needs a mask.

   THE LUMINANCE STEP HAPPENS INSIDE THE SVG, and that is the one non-obvious
   line. CSS `mask-image` defaults to `match-source`, which for an SVG *image*
   means ALPHA, not luminance; the artwork is opaque everywhere, so the mask
   would be opaque everywhere and nothing would ever be removed. `<mask>` has
   always meant luminance, so what comes out of here already has a transparent
   hole in it and is then just a `background-image` — no CSS masking anywhere,
   nothing to feature-detect, and it degrades to "no slug" rather than "solid
   slug" if it ever fails to parse.

   THE viewBox CARRIES THE PADDING BOX'S ASPECT, not the border box's. The slug
   is an `::before` at `inset:0`, which resolves against the padding box; with
   the border-box aspect the root SVG's default `xMidYMid meet` letterboxed it
   and the first cut came back with dark pillarbox bars down every word button.
   Both halves ship: the aspect is matched here AND `preserveAspectRatio` is
   `none`, so sub-pixel rounding cannot reopen a one-pixel gap and "none"
   stretches by a factor of 1.000. */
function knock(label, wCqw, hCqw, fsCqw, weight, i) {
  const line = CHY_M.line;
  const W = +(((wCqw - 2 * line) * 10).toFixed(1));
  const H = +(((hCqw - 2 * line) * 10).toFixed(1));
  const FS = (fsCqw * 10).toFixed(1);
  const esc = String(label)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const mid = `k${i}`;
  const ls = (FS * 0.02).toFixed(2);
  /* ONE TEMPLATE LITERAL, DELIBERATELY, AND THE PROVENANCE GATE IS THE REASON.
     Assembled with `+` this is twenty-two separate string literals in authored
     source, and the sweep is DEFAULT-DENY — every one of them lands as an
     undeclared visitor-facing string. Twenty-two rows of SVG syntax in the
     origin register is exactly the noise its own header warns about: it would
     "train everyone to skim the list". **The fix is not a new exclusion rule.**
     The tool's whole argument is that a heuristic deciding what to LOOK at
     reproduces the failure it exists to fix, so widening the boundary to fit
     Ops' own code is the one move that is not available. Written as one quasi
     it is one declared row, and a reviewer reads the markup whole. */
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><mask id="${mid}"><rect width="${W}" height="${H}" fill="#fff"/><text x="${W / 2}" y="${H / 2}" fill="#000" text-anchor="middle" dominant-baseline="central" font-family="Helvetica Neue,Arial,Liberation Sans,sans-serif" font-weight="${weight}" font-size="${FS}" letter-spacing="${ls}">${esc}</text></mask></defs><rect width="${W}" height="${H}" fill="#fff" mask="url(%23${mid})"/></svg>`;
  /* `%23` is written literally into the SVG so the parser reads `url(#k1)`;
     encodeURIComponent turns its `%` into `%25`, hence the restore. */
  return `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/%2523/g, "%23")}")`;
}

/* [Mike 2026-07-29] THE 2x2, IN HIS ORDER. The grid fills row-major, so this
   lays out as   [SCROLL] [CLICK]
                 [POWER ] [SHAKE]   — his original arrangement. A vertical
   stack was built once and was not what he asked for. */
const MON_CTL = [
  { id: "scroll", label: "SCROLL" },
  { id: "click",  label: "CLICK"  },
  { id: "power",  label: "POWER"  },
  { id: "shake",  label: "SHAKE"  },
];

function sendControl(id) {
  window.dispatchEvent(new CustomEvent("wb-portal-machine-control",
    { detail: { id } }));
}

export default function PortalScreen({ bezel, ch, chList, note, place,
                                       slip, unitOn, onClose, children }) {
  const B = bezel || null;
  const list = Array.isArray(chList) ? chList : [];
  /* no declaration, no frame: the screen falls back to the bare picture rather
     than drawing a box of the wrong shape around it.
     [2026-08-26] IT MOVED ABOVE THE GEOMETRY, WHERE IT ALWAYS BELONGED. The
     rect used to be computed with a `B &&` guard on every read and the early
     return came after it, so the null case was handled twice and neither place
     said so. The crop-box arithmetic below reads `B.w`, `B.h` and `B.feed`
     directly; one guard, at the top, is what makes that safe to write. */
  if (!B) return <div className="ps-plain">{children}</div>;

  /* ═══ TWO PLACEMENTS, AND THE DIFFERENCE IS WHAT THE PICTURE *IS* ═════════
     `canvas` — the machine, and the photograph. `twin.html` draws the family
       art on the SAME 3000x2400 canvas this bezel was cut from, and the
       close-up plate is cut on it too (measured 2026-08-26: a 0px frame ring at
       nine of eleven rows across the opening), so both lie edge to edge and
       register with the frame by construction. Nothing is scaled to fit and
       nothing has to be measured twice.
     `feed`   — television and the test signal. These are pictures with no
       opinion about the canvas, so they go on the measured feed rect and the
       curved opening crops them, exactly as it crops the family art.
     GETTING THIS BACKWARDS IS SILENT AND UGLY: the machine placed on the feed
     rect would be the whole canvas — bezel margin and all — shrunk into the
     hole, a picture of a monitor inside a monitor. */
  const base = (B.feed && place === "feed")
    ? { x: B.feed.x, y: B.feed.y, w: B.feed.w, h: B.feed.h }
    : { x: 0, y: 0, w: B.w, h: B.h };

  /* ═══ [2026-08-26] THE CENTRE 4:3, AND IT IS ONE RULE RATHER THAN THREE ════
     MIKE: **"ENLARGE the screen BEHIND THE BEZEL to crop the screen to just
     the center 4:3 area."**

     THE APERTURE CANNOT BE MADE 4:3 AND THAT IS WHAT DECIDES THE READING.
     The opening measures 2532 x 2003 — **1.264** — and it is barrel-curved art
     on a plate Mike has shelved the replacement for, so no amount of code makes
     the visible hole 1.333. **So "the center 4:3 area" is a fact about the
     PICTURE, not about the hole**, and the instruction is exactly what it says:
     enlarge what is behind until the hole is framing the middle of it.

     A SURVEY OFFERED THREE CANDIDATES AND THE MECHANISM COLLAPSES THEM TO ONE.
     They differed only in which rectangle "the screen" meant — the canvas
     (3000 x 2250), the declared feed rect (2540 x 1905), or the measured
     opening (2532 x 1899), up to 75px of height apart. **Each placement already
     knows which rectangle it is fitted to**, so the rule is written once and
     each kind answers it with its own: the machine and the photograph against
     the canvas, television and the test card against the feed rect.

     **THE MEASURED OPENING IS THE ONE DELIBERATELY NOT USED**, and the overscan
     is why. The feed rect is *taller than the hole on purpose* — 0 hole pixels
     fall outside it — so that the curved inner edge crops the picture and no
     page ground can ever leak in. Cropping to the hole's own bounding box would
     put the picture's edge exactly on the hole's edge and hand that guarantee
     back, to buy 13px of height.

     THE BOX IS THE CENTRE 4:3 THAT *COVERS* THE RECT, never one inscribed in
     it. Inscribing would letterbox — it would shrink the picture to fit a
     shape, which is the opposite of ENLARGE. Both of our rects are narrower
     than 4:3, so the box grows sideways and the existing `object-fit: cover`
     does the rest: the picture fills it and loses the overflow to the opening.

       canvas   3000 x 2400  ->  3200 x 2400 at x -100     the art scales x16/15
       feed     2540 x 2036  ->  2714.67 x 2036 at x 139.67

     NOTHING LEAKS, CHECKED BOTH WAYS: the hole runs x 231..2762, y 206..2208,
     and sits inside both boxes with room. */
  const cw = Math.max(base.w, (base.h * 4) / 3);
  const chh = Math.max(base.h, (base.w * 3) / 4);
  const box = { x: base.x - (cw - base.w) / 2, y: base.y - (chh - base.h) / 2,
                w: cw, h: chh };
  const rect = {
    left: `${(box.x / B.w) * 100}%`,
    top: `${(box.y / B.h) * 100}%`,
    width: `${(box.w / B.w) * 100}%`,
    height: `${(box.h / B.h) * 100}%`,
  };

  return (
    <div className="ps-wrap">
    <div className="ps"
         style={{ "--ar": `${B.w} / ${B.h}`, "--arn": B.w / B.h }}>
      {/* THE PICTURE, on the rect the bezel was measured against. It is
          `object-fit: cover` because the opening CROPS — a 16:9 broadcast and a
          drawn test card both fill the rect and lose their corners to the
          curve, which is what the machine's own picture has always done. */}
      <div className="ps-feed" style={rect}>
        {/* [2026-08-26] THE SLIP IS ON A WRAPPER, SO IT REACHES EVERY KIND.
            It used to sit on the `<iframe>` alone, which meant the tear drew
            over television and the test signal with nothing moving under it —
            a bar laid on a still rather than a seam. The wrapper's box IS the
            feed rect, so at slip 0 nothing about the layout changes; the
            transform also makes it the containing block for the absolutely
            positioned drawn channels, which is what carries them along. */}
        <div className="ps-slip"
             style={slip ? { transform: `translateX(${slip}px)` } : undefined}>
          {children}
        </div>
      </div>

      {/* THE FRAME. It is drawn OVER the picture, which is what makes the
          curved opening a crop rather than a border. */}
      <img className="ps-bezel" src={B.src} alt="" aria-hidden="true" />

      {/* ═══ THE MACHINE'S FOUR CONTROLS — the Portal's now, on every channel.
          The knockout is built per button and parked in `--knock`, exactly as
          the twin builds its own. POWER wears the SAME LATCHED FILL the digit
          strip uses for the live channel (T6): the chyron has exactly one
          register for *this is the one that is currently on*, and POWER is a
          latching control, so it earns that register rather than a second
          vocabulary. `unitOn` is mirrored from the machine itself and is false
          wherever there is no machine — POWER latched over a television would
          be the set reporting somebody else's state. */}
      <div className="ps-ctl" role="group" aria-label="machine controls">
        {MON_CTL.map((c, i) => (
          <button key={c.id}
                  className={"ps-chy ps-chy-w"
                             + (c.id === "power" && unitOn ? " ps-on" : "")}
                  style={{ "--knock": knock(c.label, CHY_M.w, CHY_M.h,
                                            CHY_M.fs, CHY_M.wt, i) }}
                  aria-pressed={c.id === "power" ? !!unitOn : undefined}
                  onClick={() => sendControl(c.id)}>
            <span className="ps-chytxt">{c.label}</span>
          </button>
        ))}
      </div>

      {/* THE CHANNEL BUTTONS — the Portal's, not the machine's. */}
      <div className="ps-strip" role="group" aria-label="channel">
        {list.map((n, i) => (
          <button key={n}
                  className={"ps-chy" + (n === ch ? " ps-on" : "")}
                  style={{ "--knock": knock(String(n), CHY_M.dw, CHY_M.dh,
                                            CHY_M.dfs, CHY_M.dwt, 10 + i) }}
                  aria-pressed={n === ch}
                  aria-label={"channel " + n}
                  onClick={() => window.dispatchEvent(
                    new CustomEvent("wb-portal-select-channel", { detail: { ch: n } }))}>
            <span className="ps-chytxt">{n}</span>
          </button>
        ))}
        {/* [S4 2026-07-30, Mike] THE FIFTH POSITION IS THE WAY OUT. It is the
            only close affordance besides Escape, it is inside the picture in
            the machine's own register, and it is learned in one press. It
            moved here with the rest of the strip for the reason the strip
            moved: an exit that disappears when the picture changes is not an
            exit. */}
        <button className="ps-chy ps-chy-x" aria-label="close the portal"
                style={{ "--knock": knock("X", CHY_M.dw, CHY_M.dh,
                                          CHY_M.dfs, CHY_M.dwt, 20) }}
                onClick={onClose}>
          <span className="ps-chytxt">X</span>
        </button>
      </div>

      {/* WHAT THE CHANNEL IS CARRYING. The panel used to say this under the
          latch, and the panel is behind a full-screen overlay at the moment it
          matters. It is mechanism state — the one thing that separates *this
          channel has no unit on it* from *this screen is broken*.
          [2026-08-26] TELEVISION NOW CARRIES NO NOTE AT ALL. Mike struck
          `TELEVISION ON THIS CHANNEL.`; `says` has no entry for that kind, the
          string resolves empty and this element does not render — so the line
          does not go blank, it goes away. */}
      {note && <div className="ps-note">{note}</div>}
    </div>
    </div>
  );
}
