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
   A machine button dispatches `wb-portal-machine-control` and stops. The feed
   control owns the one channel resolver and the overlay owns the one forward to
   the twin, so there is never a second opinion about what a channel carries or
   about what a press reaches. These are window events and NOT postMessage: both
   ends are the museum's own components and the twin's iframe is out of that
   path entirely.

   ═══ [2026-08-27] AND THE CHANNEL BUTTONS ARE GONE, WHICH IS MIKE'S RULING ══
   **"You do not change channels, as there are none. The channels are inherent
   to the feed, not the bare terminal program."** The four digits and
   `wb-portal-select-channel` left together; the reasoning, and the measurement
   that showed the strip was changing nothing, is at the strip's own site below.
   **The [X] stays and has not moved** — S4's fifth position, and it was never a
   channel button.

   THE PARAGRAPH ABOVE ABOUT THE 2x2 STILL STANDS WHOLE. Mike's ruling that
   CH3's surface is the target for all four channels was about SCROLL, CLICK,
   POWER and SHAKE belonging to the SET, and nothing in this round touches it.
   What the August round called *"the strip"* in that argument is the thing that
   has since been ruled away; the argument's subject was the 2x2 and it survives
   its example.
   ═══════════════════════════════════════════════════════════════════════════ */
import { useEffect, useLayoutEffect, useRef } from "react";
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
   stack was built once and was not what he asked for.

   ═══ [2026-08-27] POWER IS OFF THE CONTROL SURFACE — MIKE'S RULING ══════════
   **"POWER COMES OFF the VIIIp's control surface."** So the word is gone from
   this table and the grid fills `[SCROLL][CLICK] / [SHAKE]`. **His order is
   preserved by deletion rather than rearranged** — the three that remain are in
   the positions they were already in, which is the whole of what P5's *no id
   moves when a legend is recut* is protecting here.

   **AND THE MACHINE IS STILL ON, WHICH WAS MEASURED BEFORE THE WORD WAS CUT.**
   `Power_Standby()` says the unit arrives OFF and the POWER control starts it,
   so removing POWER could have left channel 3 unreachable for ever. It does
   not: every bank that arms carries `power:"on"` in `PORTAL_RECIPES`, and on
   the served page with POWER never pressed the twin reports `unitPowered=true`
   and the museum's own mirror had the slug latched. **Two independent readings,
   taken before the deletion, because reading the recipe is not evidence.**

   WHAT WENT WITH IT: `unitOn`, the `ps-on` latch on this button, and the
   museum's `wb-portal-power` listener. **`twin.html` STILL POSTS THAT MESSAGE**
   from `Mon_Power_Sync` on its 200ms chrome tick — it is a single-file document
   that must work with no museum at all, and a `postMessage` into a room with no
   listener is harmless. It is named here so the next reader does not go looking
   for the receiver. */
const MON_CTL = [
  { id: "scroll", label: "SCROLL" },
  { id: "click",  label: "CLICK"  },
  { id: "shake",  label: "SHAKE"  },
];

/* ═══ [2026-08-27] THE BARREL, ON THE CONTROLS ONLY ════════════════════════
   MIKE: **barrel distortion ON "the clickable controls overlaid on the
   monitor"**, and OFF "YouTube video, the VIIIp, and the terminal itself —
   first pass, explicitly."

   THE CONTROLS ARE PAINTED ON THE GLASS AND THE GLASS IS CURVED, so each
   button is nudged along its own radius from the centre of the frame by an
   amount proportional to r-squared — which is what a lens does. It is a
   TRANSFORM and not a filter, and that is the load-bearing choice: a CSS
   `filter` moves the pixels and leaves the hit area where it was, so a warped
   button would be clickable somewhere it is not drawn. **`transform` moves
   both**, so the control stays under the finger.

   THE POSITIONS ARE CLIENT RECTS, MEASURED AFTER CLEARING EVERY TRANSFORM, AND
   THE FIRST CUT OF THIS USED `offsetLeft`/`offsetTop` AND WAS WRONG. The
   reasoning for `offset*` was that a transform does not change it, so the bend
   would be idempotent — true, and beside the point: **`offsetLeft` is relative
   to the nearest POSITIONED ancestor**, which for these buttons is `.ps-ctl` or
   `.ps-strip`, not the frame. Every button therefore measured a few dozen
   pixels from the top-left of its own little group, read as *up and left of
   centre* on a 1000-wide frame, and got pushed the wrong way. **Measured on the
   served page: SCROLL came out at `translate(-30.32px, -26.33px)` when it sits
   in the lower-RIGHT quadrant and should move down and right.**

   Rects give the right frame of reference, and the idempotence `offset*` was
   chosen for is bought back by clearing all the transforms before reading any
   of them — which is one extra line and cannot be got subtly wrong.

   ═══ [2026-08-27] THE FIRST CUT MOVED THE INK AND WARPED NOTHING ═══════════
   MIKE: **"The onscreen controls have no effect applied to them at all from
   what I can see. Inspect and advise."** Inspected before anything was changed,
   on the served page at a 1000 x 800 frame:

     the ink WAS moving          up to 12.33px at the [X]
     no button was reshaped      width and height changed by 0.000, all five
     across the whole group      9.27px of spread, 3.87px of tilt

   **SO IT WAS A RIGID TRANSLATION, AND A TRANSLATION IS NOT A DISTORTION.**
   Every button stayed a perfect axis-aligned square and merely sat a few pixels
   further out. Worse, **the group is entirely inside one quadrant** — the lower
   right — so a radial field gives it a nearly constant gradient: the five
   buttons all moved the same way by almost the same amount, which the eye reads
   as *the group is very slightly bigger*, not as *the glass is curved*. He is
   right, and the measurement says why.

   ═══ WHAT IT DOES NOW: THE SHAPE OF THE FIELD, NOT ITS OFFSET ══════════════
   **THE MEAN DISPLACEMENT IS SUBTRACTED AND ONLY THE RESIDUAL IS APPLIED.**
   That is the change that makes this work. The uniform part was doing nothing
   the eye could read AND was the part that would relocate the group off the
   coordinates the twin measured it into (`--strip-left`, `--grp-top`, S4's
   fifth position). Removing it lets the coefficient go up a long way while the
   group's centre stays exactly where it was placed.

   **AND EACH BUTTON NOW TILTS AND SCALES**, which is what a lens actually does
   to a small object off its axis. The tilt is the field's own shear term — the
   rate at which vertical displacement changes as you move sideways, which is
   what makes a row of buttons follow a curve instead of a straight line — and
   the scale is the falloff in magnification away from the centre. Both are
   `transform`s, so **the hit area travels with the ink**: nothing moves out
   from under his finger, which is the property the first cut got right and this
   one keeps.

   THREE COEFFICIENTS, EACH ONE HIS TO MOVE, AND THE MEASURED RESULT IS IN THE
   ROUND LOG. They are separate because they are three different visual
   claims — how far the row bows, how hard each key tilts, how much the edge
   shrinks — and one number driving all three would make two of them wrong.

   ═══ AND THE POSITIONAL TERM IS THE ONE THAT HAD TO BE HELD BACK ═══════════
   The first pass at making it visible set the bow to 0.34, which measured
   **70.05px of spread along the strip and 29.24px across it**. The bow was
   right and the spread was not: five keys that exactly fill a 311px box cannot
   fan out by 70px without stretching the row into a different object — and the
   2x2 above shares that box's edge by arithmetic, which is the twin's own
   geometry. **A lens bows a row of keys; it does not pull them apart.**

   So the position carries the bow only, and **the warp a visitor actually reads
   is the TILT and the SCALE** — those cost no layout at all, and a key that
   leans and shrinks toward the corner is what says *curved glass* far more
   plainly than a key that has moved. Numbers measured after the cut are in the
   round log. */
const BARREL_CONTROLS = 0.10;   /* the bow, after the mean is removed */
const BARREL_TILT     = 0.20;   /* the shear term: how hard a key rotates */
const BARREL_SHRINK   = 0.05;   /* magnification falloff toward the edge */

function sendControl(id) {
  window.dispatchEvent(new CustomEvent("wb-portal-machine-control",
    { detail: { id } }));
}

/* ═══ [2026-08-27] BETWEEN CHANNELS THERE IS SNOW, NOT BLACK ═══════════════
   MIKE: **"When changing channels go to noise instead of black during the
   transition."**

   ═══ AND THE FIRST CUT WAS TOO COARSE, WHICH HE SAW AT ONCE ════════════════
   MIKE: **"The noise is much too pixelated and coarse. Does not look at all
   analog."**

   **HE IS RIGHT AND THE ARITHMETIC IS BRUTAL.** The first cut painted a fixed
   160 x 120 buffer and let the browser blow it up to the whole picture. At his
   own viewport that made every grain **6.57 x 7.01 CSS px — 13.2 x 14.0 device
   pixels.** Snow made of fourteen-pixel squares is not snow, it is a mosaic.

   **THE HOUSE ALREADY KNEW THIS AND THE NOTE IS IN `twin.html`:** its own snow
   plane is 420 x 336 and says why — *"420x336 keeps the grain fine when it is
   blown up to a full-width stage - at 200x160 each 'grain' landed about 5px
   across and read as blocks."* **The first cut here was coarser than the
   version that document had already rejected**, which is what happens when a
   new surface re-derives a number the house has paid for once.

   ═══ THE GRAIN IS ONE CSS PIXEL NOW, AND THE SCANLINES ARE WHY THAT IS THE
   ═══ RIGHT SIZE RATHER THAN JUST A SMALLER ONE ══════════════════════════════
   The museum's tube texture is `repeating-linear-gradient(0deg, … 0 1px,
   transparent 1px 3px)` — **a 3px pitch in real CSS pixels, unscaled**, on the
   stage and on the controls. That is the house's grain vocabulary and it does
   not stretch with the frame. **Noise has to be FINER than the line structure
   it sits under**, or the picture reads as two grids fighting. One CSS pixel is
   a third of the pitch and is the first size that cannot be seen as a square.

   **SIZED FROM ITS OWN BOX, NOT FROM A CONSTANT.** The buffer is the element's
   own CSS-pixel size, re-taken when the box changes — so dragging the monitor
   changes how much noise there is and never how big a grain is. The cost falls
   out of that for free: it is proportional to the area, so a phone pays for a
   phone.

   `MAX_PX` IS A CEILING ON WORK, MEASURED RATHER THAN CHOSEN. Benchmarked on
   his own machine at his own frame: **1052 x 842 costs 6.6ms a frame** with the
   integer generator below (9.8ms with `Math.random`, which is why it is not
   used), and **the full device-pixel version — 2104 x 1684 — costs 15.0ms
   against a 16.7ms budget** and would drop frames for a grain nobody can
   resolve. Above 1.2M pixels the buffer scales down, so on a very large frame
   the grain grows past one pixel instead of the frame rate collapsing. At his
   size it is under the ceiling and the grain is exactly 1.

   **THE SMEAR IS THE OTHER HALF OF "ANALOG".** A tube's beam scans across, so
   its noise is correlated ALONG a line and independent between lines — that
   horizontal draw is what separates snow from digital salt-and-pepper. Each
   pixel is three parts fresh noise to one part the pixel left of it, which
   costs one shift and one add and gives the streak without softening the
   contrast enough to read as grey.

   **AND `image-rendering` IS DELIBERATELY NOT `pixelated` ANY MORE.** With the
   buffer at CSS-pixel size, a 2x display upscales each grain to a 2x2 block;
   hard-edged that is a square again, and smoothed it is film grain. The one
   place `pixelated` was load-bearing was when the buffer was small, which is
   exactly the thing that was wrong. */
const SNOW_MAX_PX = 1200000;
function PortalSnow() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return undefined;
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return undefined;

    let img = null, buf = null, w = 0, h = 0;
    /* the buffer follows the box. `clientWidth` is 0 for one tick if this
       mounts before layout, so a zero is treated as "not yet" rather than as a
       size — a 0-wide canvas throws on `createImageData`. */
    const fit = () => {
      const bw = cv.clientWidth, bh = cv.clientHeight;
      if (!bw || !bh) return false;
      const k = Math.min(1, Math.sqrt(SNOW_MAX_PX / (bw * bh)));
      const nw = Math.max(1, Math.round(bw * k)), nh = Math.max(1, Math.round(bh * k));
      if (nw === w && nh === h) return true;
      w = nw; h = nh; cv.width = w; cv.height = h;
      img = ctx.createImageData(w, h);
      buf = new Uint32Array(img.data.buffer);
      return true;
    };

    /* xorshift32: the same uniform noise as `Math.random` and 1.5x cheaper at
       this call count, measured. The seed is fixed because a noise field has no
       identity to vary — nobody can tell two of these apart. */
    let seed = 0x9e3779b9;
    let raf = 0, alive = true;
    const paint = () => {
      if (!alive) return;
      if (fit()) {
        let i = 0;
        for (let y = 0; y < h; y++) {
          let prev = 128;
          for (let x = 0; x < w; x++) {
            seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
            /* three parts fresh to one part the pixel to its left: the beam's
               own horizontal draw. `>>> 0` because xorshift goes negative. */
            const v = ((((seed >>> 0) & 255) * 3 + prev) >> 2) & 255;
            prev = v;
            buf[i++] = 0xFF000000 | (v << 16) | (v << 8) | v;
          }
        }
        ctx.putImageData(img, 0, 0);
      }
      raf = requestAnimationFrame(paint);
    };
    paint();
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, []);
  return <canvas className="ps-snow" ref={ref} aria-hidden="true" />;
}

/* ═══ [2026-08-27] `words` AND `channels` — THE SET IS DECLARED, NOT BRANCHED ══
   **THE WORDS "MODE A" AND "MODE B" ARE RETIRED FROM THIS FILE AND FROM THE
   WING. MIKE: "stop calling it Mode A and Mode B. This one is TERMINAL.EXE."**
   There was never a Mode A — there is the television, the machine on channel 3,
   the test signal, and TERMINAL.EXE. Naming three of them after the fourth's
   absence is how a surface ends up with the wrong controls on it, which is
   precisely what happened.

   TWO DECLARATIONS, AND THEY ARE INDEPENDENT ON PURPOSE:
     `words`     which of SCROLL / CLICK / SHAKE this surface carries
     `channels`  the numbers on the strip, or null for none
   The `[X]` is on every set and is not declared — it is the way out, S4, and a
   surface without one is not a surface a visitor can leave.

   THE BOOLEAN THIS REPLACES COULD NOT SAY WHAT HE RULED. `controls` gated the
   word group and the digit strip together, so *"SCROLL, CLICK, X"* — a surface
   with words and no digits — was not expressible at all. **A flag that answers
   two questions with one bit is the defect**, and the three sets he ruled are
   the proof of it. */
export default function PortalScreen({ bezel, note, place,
                                       slip, tear, snow, onClose, children,
                                       exact, jitX = 0, jitY = 0,
                                       words = [], channels = null, ch }) {
  const B = bezel || null;
  const list = Array.isArray(channels) ? channels : [];
  const wordSet = MON_CTL.filter(c => words.includes(c.id));

  /* the bend, applied to whatever buttons this screen happens to be drawing.
     One pass over `.ps-chy` inside this frame; see BARREL_CONTROLS above for
     why it is a transform and why it reads `offset*`. */
  const frameRef = useRef(null);

  /* ═══ [2026-08-27] DRAG THE CORNER TO SIZE THE MONITOR ════════════════════
     MIKE: **"I seem to have lost the ability to drag size the monitor itself,
     which would solve some problems."**

     ═══ IT DID EXIST, AND IT WAS DISABLED ON PURPOSE — BUT ONE LAYER DOWN ════
     `twin.html` has carried `Portal_Grip_In()` since `fc4cc80`, built to his own
     T3 ask (*"make the monitor CORNER-DRAGGABLE to scale"*). **`efc379f`,
     2026-08-22, stopped it working inside the museum**, and said so at the site:
     `body.framed #unitstage{max-width:none!important;width:100%!important}`,
     because *"a picture the visitor can resize underneath a frame that cannot
     resize with it would never register."* That was correct and it is not
     reversed. **Measured in a framed twin before anything was built:** the grip
     is still in the DOM and still visible, `Portal_Size_Set` still runs, and the
     stage reads 1185 x 948 before, after 140vh and after 50vh — **it moves
     nothing.**

     **SO THE GESTURE IS RESTORED WHERE IT WAS ALWAYS MISSING: ON THE MONITOR,
     NOT ON THE PICTURE INSIDE IT.** Dragging here scales `.ps` — the bezel, the
     picture, the controls and the way out together — which is exactly the
     object `efc379f` said had to move as one. The twin's own grip stays
     disabled framed, and is now HIDDEN framed as well: a control that is drawn
     and does nothing is the dead control Doctrine 11's corollary forbids, and
     it is the likeliest thing he was pulling on.

     ONE DEGREE OF FREEDOM, THE TWIN'S OWN MAPPING. The frame is aspect-locked,
     so `dx` is projected through the ratio and averaged with `dy` — dragging
     the true diagonal moves at the natural rate and either edge alone still
     works at half rate. Pointer capture, because the corner always leaves the
     cursor once the box starts growing. **Session-persisted on release, not per
     frame** — his T3 ruling was *"session-persist the result"*, and a write per
     pointermove is dozens a second for a value nobody reads until the next
     open. Double-click resets, the gesture a resize corner already teaches. */
  const SIZE_KEY = "wb-portal-screen-size";
  /* ═══ THE CEILING IS THE FIT, AND THAT IS A DELIBERATE STOP ════════════════
     At 1 the frame is already `min(100cqw, 100cqh * ratio)` — whichever axis
     binds, filled. **Anything above 1 does not make the monitor bigger; it
     pushes it past `.ps-wrap`, whose `overflow:hidden` then CROPS THE BEZEL.**
     The frame is the object — *"standard 60s CRT"* — and a monitor with its
     corners cut off to gain picture is a different object. So the drag stops at
     the fit. **If he wants past it, the crop is the cost and it is one number**;
     it is not taken on Ops' guess. */
  const SIZE_MIN = 0.35, SIZE_MAX = 1.00;
  const sizeRef = useRef(null);
  const readSize = () => {
    try {
      const v = parseFloat(window.sessionStorage.getItem(SIZE_KEY));
      return Number.isFinite(v) ? Math.min(SIZE_MAX, Math.max(SIZE_MIN, v)) : 1;
    } catch { return 1; }
  };
  const bendRef = useRef(null);
  /* ═══ THE DRAG MUST RE-BEND, AND THIS WAS MEASURED BEFORE IT WAS WRITTEN ═══
     The warp is computed from client rects. A drag writes a CSS variable — it
     does not re-render React and does not fire `window.resize` — so without
     this call the transforms stay the ones computed for the OLD frame.
     **MEASURED ON THE SERVED PAGE:** dragging 1000x800 down to 700x560 left the
     `[X]` carrying `translate(12.19px, 5.04px) rotate(6.43deg)` byte for byte —
     a bend sized for a frame 43% larger, applied to the small one. Named here
     rather than discovered later, which is the whole reason this consequence
     was looked for. */
  const setSize = (v, store) => {
    const s = Math.min(SIZE_MAX, Math.max(SIZE_MIN, v));
    sizeRef.current = s;
    if (frameRef.current) frameRef.current.style.setProperty("--ps-size", String(s));
    if (bendRef.current) bendRef.current();
    if (store) { try { window.sessionStorage.setItem(SIZE_KEY, String(s)); } catch { /* refused */ } }
    return s;
  };
  useLayoutEffect(() => {
    if (sizeRef.current === null) sizeRef.current = readSize();
    setSize(sizeRef.current, false);
  });

  function gripDown(e) {
    const el = frameRef.current;
    if (!el) return;
    e.preventDefault();
    const r = el.getBoundingClientRect();
    const start = { x: e.clientX, y: e.clientY, h: r.height,
                    s: sizeRef.current || 1, arn: r.width / r.height };
    const move = (ev) => {
      const dH = ((ev.clientX - start.x) / start.arn + (ev.clientY - start.y)) / 2;
      setSize(start.s * ((start.h + dH) / start.h), false);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      setSize(sizeRef.current, true);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return undefined;
    function bend() {
      const fr = el.getBoundingClientRect();
      /* a hidden pane has a zero-width viewport and every rect in it is 0.
         Bending against that would divide by zero and write NaN into a style. */
      if (!fr.width || !fr.height) return;
      /* ═══ THE BEND REACHES THE INK, AND THE CLICK TARGET NEVER MOVES ══════
         Each control group gets an `feDisplacementMap` whose map is built here
         and handed to it as a data URI. **A CSS `filter` moves PIXELS and does
         not touch hit testing**, so the button's box stays exactly on the
         twin's measured grid while its border, its label and its punched slug
         bend as glass would bend them. That is the property this is for: the
         first cut moved the whole element with a `transform`, which warped
         nothing — every key stayed a rigid square — and moved the target with
         it. Now the ink curves and the target has not moved at all.

         THE MAP IS THE REAL FIELD, NOT AN APPROXIMATION OF IT. Each pixel of a
         small raster is the barrel displacement at that point of the group's
         own box — `d = K * p * r²`, evaluated against the FRAME's centre, with
         the group's MEAN removed so the group does not travel. R carries x,
         G carries y, 0.5 is no displacement. `feDisplacementMap` reads them
         back as `scale * (channel - 0.5)`, so one `scale` in user units sets
         the amplitude for both axes. */
      const groups = [...el.querySelectorAll(".ps-ctl, .ps-strip")];
      const cx0 = fr.left + fr.width / 2, cy0 = fr.top + fr.height / 2;
      groups.forEach((g, gi) => {
        const gb = g.getBoundingClientRect();
        if (!gb.width || !gb.height) return;
        const N = 48, M = 24;                    /* the map's own resolution */
        const cvs = document.createElement("canvas");
        cvs.width = N; cvs.height = M;
        const px = cvs.getContext("2d");
        const img = px.createImageData(N, M);
        const dxs = new Float32Array(N * M), dys = new Float32Array(N * M);
        let sx = 0, sy = 0;
        for (let j = 0; j < M; j++) {
          for (let i = 0; i < N; i++) {
            const u = (i + 0.5) / N, v = (j + 0.5) / M;
            const dx = (gb.left + u * gb.width - cx0) / (fr.width / 2);
            const dy = (gb.top + v * gb.height - cy0) / (fr.height / 2);
            const r2 = dx * dx + dy * dy;
            const k = j * N + i;
            dxs[k] = dx * r2 * (fr.width / 2) * BARREL_CONTROLS;
            dys[k] = dy * r2 * (fr.height / 2) * BARREL_CONTROLS;
            sx += dxs[k]; sy += dys[k];
          }
        }
        const mx = sx / (N * M), my = sy / (N * M);
        let amp = 0;
        for (let k = 0; k < N * M; k++) {
          amp = Math.max(amp, Math.abs(dxs[k] - mx), Math.abs(dys[k] - my));
        }
        /* a flat field would divide by zero and is also nothing to draw */
        if (amp < 0.01) { g.style.filter = ""; return; }
        const S = 2 * amp;
        for (let k = 0; k < N * M; k++) {
          img.data[k * 4]     = Math.round(255 * (0.5 + (dxs[k] - mx) / S));
          img.data[k * 4 + 1] = Math.round(255 * (0.5 + (dys[k] - my) / S));
          img.data[k * 4 + 2] = 0;
          img.data[k * 4 + 3] = 255;
        }
        px.putImageData(img, 0, 0);
        const id = "ps-bend-" + gi;
        const fe = el.querySelector("#" + id + " feImage");
        const dm = el.querySelector("#" + id + " feDisplacementMap");
        if (!fe || !dm) return;
        fe.setAttribute("href", cvs.toDataURL());
        dm.setAttribute("scale", S.toFixed(2));
        g.style.filter = "url(#" + id + ")";
      });
    }
    bendRef.current = bend;          /* the drag calls this; see setSize */
    bend();
    window.addEventListener("resize", bend);
    return () => { window.removeEventListener("resize", bend);
                   if (bendRef.current === bend) bendRef.current = null; };
  });
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
  /* ═══ [2026-08-27] `exact` — A PLATE THAT CARRIES THE FRAME IS NOT ENLARGED
     MIKE: **"CH4 is showing two bezels."** He is right, and the cause is this
     arithmetic meeting a picture it was not written for.

     **HIS CLOSE-UP PLATE HAS THE MUSEUM'S BEZEL COMPOSITED INTO IT.** Measured
     on the two files at mid-height: where `MGK-TWIN_MONITOR_SCREEN_BEZEL.png`
     is opaque, the close-up's pixels are IDENTICAL to it — 31/31, 41/41, 18/18,
     26/26, 60/60, 20/20 — and its alpha matches the bezel's runs (`1..224`,
     `2769..2989`) to the pixel. The plate is the frame plus the picture, in one
     file, registered at 1:1.

     **SO THE 4:3 ENLARGEMENT PUT TWO FRAMES ON THE GLASS.** It scales the plate
     to 3200 wide at x -100 — 1.0667x — while `.ps-bezel` stays at 1.0, so the
     plate's copy of the frame no longer coincides with the museum's and both
     edges show. Nothing was wrong with either object; they were drawn at two
     scales.

     `exact` DRAWS THE PLATE ON THE CANVAS RECT UNTOUCHED, so its built-in frame
     lands exactly under the museum's and the two read as one. **The Portal's
     bezel is NOT suppressed** — that standing rule is untouched, and it does
     not need to be broken to fix this: the plate's copy simply stops being
     visible, because it is where the museum's is.

     THE 4:3 RULING IS NOT REVERSED. It exists for a picture that has no opinion
     about the canvas — television, the test card, the family shot — and every
     one of those still gets it. **A plate cut on the bezel's own canvas is not
     fitted to the opening; it is REGISTERED with it**, and enlarging a
     registered picture is the one thing that can only break it. */
  const cw = exact ? base.w : Math.max(base.w, (base.h * 4) / 3);
  const chh = exact ? base.h : Math.max(base.h, (base.w * 3) / 4);
  const box = { x: base.x - (cw - base.w) / 2, y: base.y - (chh - base.h) / 2,
                w: cw, h: chh };
  const rect = {
    left: `${(box.x / B.w) * 100}%`,
    top: `${(box.y / B.h) * 100}%`,
    width: `${(box.w / B.w) * 100}%`,
    height: `${(box.h / B.h) * 100}%`,
  };

  /* ═══ [2026-08-27] THE PICTURE IS CUT TO THE FRAME'S SHAPE, NOT TO ITS BOX ══
     MIKE: **"When I click on VIIIp I see screen tears extending outside the
     bezel"** and **"Vertical jitter looks crummy, and is also extending past
     the bezel."**

     ═══ THE EARLIER CLIP LANDED. IT WAS ANSWERING A DIFFERENT QUESTION ═══════
     The tear is still `.ps-tear` inside `.ps-feed`, still a sibling of the
     slip, still under the bezel by `z-index`, and the bezel still covers it
     everywhere the bezel is opaque — all of that was established and none of it
     came apart. What that round settled was *the tear is inside the picture
     box*. **Nobody asked whether the picture box is inside the frame's SHAPE**,
     and it is not: `.ps`'s `overflow:hidden` cuts to the plate's BOUNDING BOX,
     and the plate draws a rounded CRT on a transparent ground. See the `safe`
     block in `portal.js` for the alpha measurements — 1px of margin at the
     waist, **903px at the corner**.

     PROVED BEFORE IT WAS FIXED, ON THE SERVED PAGE. A plain red band at the
     tear's own coordinates, same parent and same z-index, photographed: a stub
     on the black ground beyond the frame's right edge on both machine
     channels, and — with the band at the top and bottom of the feed — **a
     full-width red bar above the set and another below it.**

     THE CLIP IS THE PLATE'S OWN `safe` RECTANGLE, CONVERTED INTO THIS BOX.
     It is expressed as an inset because `inset()` is in the element's own
     percentage space and the feed box is a different rectangle on every kind —
     the 4:3 enlargement on channel 3, the registered plate on channel 4, the
     feed rect for television. **One declaration, four boxes, no second set of
     numbers.** Clamped at 0 so a box already inside the safe rectangle is not
     handed a negative inset, which is invalid and would drop the whole rule. */
  const S = B.safe || null;
  const pc = (v) => `${Math.max(0, v)}%`;
  const clip = S ? {
    clipPath: "inset(" + [
      pc(((S.y - box.y) / box.h) * 100),
      pc((((box.x + box.w) - (S.x + S.w)) / box.w) * 100),
      pc((((box.y + box.h) - (S.y + S.h)) / box.h) * 100),
      pc(((S.x - box.x) / box.w) * 100),
    ].join(" ") + ")",
  } : null;

  /* ═══ [2026-08-27] THE CONTROLS RIDE THE PICTURE — T7 ════════════════════
     MIKE, 2026-07-29: **"the control panel must move WITH the glitch (the
     controls are part of the feed; only the bezel is the real world)."** Raised
     again 2026-08-27 about both machine channels.

     TWO SOURCES, ONE OFFSET. `slip` is the museum's own tear moving the picture
     sideways; `jitX/jitY` is the twin's internal glitch, which the museum
     cannot see and the machine therefore reports. They add, because on the
     glass they are the same thing happening to the same feed.

     **IT IS A TRANSFORM ON THE GROUP, NOT ON THE BUTTONS.** The buttons carry
     no transform at all — the barrel is a filter for exactly that reason — so
     this is the only transform in the chain and nothing composes wrongly. And
     because it is a transform, the hit areas travel with it: the controls stay
     under the finger while they shake, which is the whole point of them being
     part of the feed rather than painted on the frame.
     **THE BEZEL DOES NOT GET IT.** That is the PORTAL REVELATION in one line
     and it is the one thing that must never move. */
  const rideX = (slip || 0) + (jitX || 0), rideY = (jitY || 0);
  const ride = (rideX || rideY)
    ? { transform: `translate(${rideX}px,${rideY}px)` } : undefined;

  return (
    <div className="ps-wrap">
    <div className="ps" ref={frameRef}
         style={{ "--ar": `${B.w} / ${B.h}`, "--arn": B.w / B.h }}>
      {/* THE PICTURE, on the rect the bezel was measured against. It is
          `object-fit: cover` because the opening CROPS — a 16:9 broadcast and a
          drawn test card both fill the rect and lose their corners to the
          curve, which is what the machine's own picture has always done. */}
      <div className="ps-feed" style={clip ? { ...rect, ...clip } : rect}>
        {/* [2026-08-26] THE SLIP IS ON A WRAPPER, SO IT REACHES EVERY KIND.
            It used to sit on the `<iframe>` alone, which meant the tear drew
            over television and the test signal with nothing moving under it —
            a bar laid on a still rather than a seam. The wrapper's box IS the
            feed rect, so at slip 0 nothing about the layout changes; the
            transform also makes it the containing block for the absolutely
            positioned drawn channels, which is what carries them along. */}
        {/* [2026-08-27] THE `zoom` PROP IS GONE, AND SO IS THE MECHANISM.
            It scaled this box to make channel 4 a magnified crop of channel
            3's photograph — Ops' second wrong reading of *"two zooms of the
            same unit\"*. **Channel 4 has its own plate and its own marker
            file**, so the machine draws itself on the right one from
            `?view=closeup` and there is nothing here to scale. Deleted rather
            than left behind a falsy prop: a second geometry for the same
            channel is the next round's puzzle. The reasoning is at the
            channel-4 row in `portal.js`. */}
        <div className="ps-slip"
             style={slip ? { transform: `translateX(${slip}px)` } : undefined}>
          {children}
        </div>
        {/* [2026-08-27] THE RIP, INSIDE THE PICTURE. MIKE: **"Tears must only
            happen on the Monitor Screen (not bezel, background, etc)"** — so it
            is drawn here, a sibling of the slip, and the opening crops it the
            way the opening crops everything else in this box. The reversal it
            carries out is recorded at the H-TEAR block in
            `RobotsExhibitFlow.jsx`, which is where the old rule was argued;
            `PortalScreen.css`'s `.ps-tear` carries the mechanism. This file
            takes two numbers and draws a band — it still knows nothing about
            tears, which is the seam the last round drew for `slip`. */}
        {tear && (
          <div className="ps-tear" aria-hidden="true"
               style={{ top: `${tear.y}%`, height: `${tear.h}%` }} />
        )}
        {/* [2026-08-27] THE SNOW IS THE LAST THING IN THE BOX, and that is the
            whole of what "instead of black" means: it covers the picture, the
            slip and the rip together, because between two channels there is no
            picture to have a rip in. It is inside `.ps-feed`, so the clip above
            cuts it to the frame's own shape like everything else here. */}
        {snow && <PortalSnow />}
      </div>

      {/* THE FRAME. It is drawn OVER the picture, which is what makes the
          curved opening a crop rather than a border. */}
      <img className="ps-bezel" src={B.src} alt="" aria-hidden="true" />

      {/* ═══ THE TWO BEND FILTERS, ONE PER CONTROL GROUP ════════════════════
          Empty until the layout effect fills them: it measures where each
          group actually sits in the frame and writes that group's own
          displacement map into its `feImage`. **The filter region is grown to
          140% because a displaced pixel outside the default region is simply
          clipped away**, and the whole point is ink that leaves its box.
          `color-interpolation-filters="sRGB"` because the default, linearRGB,
          would re-interpret the map's channel values as light rather than as
          the numbers they are. */}
      <svg className="ps-defs" aria-hidden="true" focusable="false">
        <defs>
          {[0, 1].map(i => (
            <filter key={i} id={"ps-bend-" + i} colorInterpolationFilters="sRGB"
                    x="-20%" y="-20%" width="140%" height="140%">
              <feImage result="m" preserveAspectRatio="none" />
              <feDisplacementMap in="SourceGraphic" in2="m" scale="0"
                                 xChannelSelector="R" yChannelSelector="G" />
            </filter>
          ))}
        </defs>
      </svg>

      {/* ═══ [2026-08-27] EVERY SURFACE DECLARES ITS OWN CONTROL SET ═════════
          MIKE, ruling it in as many words: **"it's OK for TV channels to have a
          different control set than the VIIIp controls."** And the three sets:

            Television      1 2 3 4 X
            Channel 3       SCROLL, CLICK, SHAKE, 1 2 3 4 X
            TERMINAL.EXE    SCROLL, CLICK, X

          **THIS REPLACES A BOOLEAN THAT COULD ONLY EVER SAY ALL-OR-NOTHING.**
          `controls` gated the whole word group and the whole digit strip
          together, which is exactly the shape that cannot express his three
          sets. `words` and `channels` are two independent declarations and the
          caller decides; this file draws what it is handed and has no opinion
          about which surface is which. **DO NOT FORCE ONE STRIP EVERYWHERE** —
          his words, and the reason this is data rather than a branch.

          THE KNOCKOUT IS BUILT PER BUTTON and parked in `--knock`, exactly as
          the twin builds its own. The latched fill (T6) now has exactly one
          user, the live channel digit — POWER was the other and POWER is gone.
          The index passed to `knock` keeps each word's slug unique per screen;
          it is a cache key, not a position. */}
      {wordSet.length > 0 && (
      <div className="ps-ctl" role="group" aria-label="machine controls"
           style={ride}>
        {wordSet.map((c, i) => (
          <button key={c.id}
                  className="ps-chy ps-chy-w"
                  style={{ "--knock": knock(c.label, CHY_M.w, CHY_M.h,
                                            CHY_M.fs, CHY_M.wt, i) }}
                  onClick={() => sendControl(c.id)}>
            <span className="ps-chytxt">{c.label}</span>
          </button>
        ))}
      </div>
      )}

      {/* ═══ [2026-08-27] 1 2 3 4 RETURNS ON TELEVISION — MIKE'S RULING, AND
          IT IS THE SECOND HALF OF HIS OWN EARLIER ONE ══════════════════════
          He ruled on 2026-08-26 that **"You do not change channels, as there
          are none"**, the four digits came off every surface, and he then found
          himself **stuck: no way to change channel once he was in.**

          **HIS CORRECTION IS A SCOPE, NOT A REVERSAL, AND HE SAID SO:** *"there
          are no channels"* was about **the bare terminal**, not about the
          television. A terminal has no channels; a television set has four.
          **BOTH RULINGS STAND AND THIS IS WHAT THEY MEAN TOGETHER** — the strip
          is on the surfaces that carry a channel and absent from the one that
          does not.

          THE ROUTING RULE FROM THAT ROUND IS UNTOUCHED AND STILL DECIDES WHAT
          RUN OPENS. `feedChannel` reads the aerial; the strip moves between
          channels once a picture is up. They answer different questions and no
          longer contradict each other: the console says which channel the feed
          brings up, and the set says which channel you are watching.

          **THE MEASURED DEFECT THAT STARTED ALL OF THIS IS STILL FIXED.** At
          the declared default `1111` every position is aerial, so all four
          digits show television — that is the aerial's own state and not a dead
          control, and switching one to CAB on the console is what puts
          something else behind a digit. */}
      <div className="ps-strip" role="group" aria-label="channel" style={ride}>
        {list.map((n, i) => (
          <button key={n}
                  className={"ps-chy" + (n === ch ? " ps-on" : "")}
                  style={{ "--knock": knock(String(n), CHY_M.dw, CHY_M.dh,
                                            CHY_M.dfs, CHY_M.dwt, 10 + i) }}
                  aria-pressed={n === ch}
                  aria-label={"channel " + n}
                  onClick={() => window.dispatchEvent(new CustomEvent(
                    "wb-portal-select-channel", { detail: { ch: n } }))}>
            <span className="ps-chytxt">{n}</span>
          </button>
        ))}
        {/* [S4 2026-07-30, Mike] THE FIFTH POSITION IS THE WAY OUT. It is the
            only close affordance besides Escape, it is inside the picture in
            the machine's own register, and it is learned in one press. It
            moved here with the rest of the strip for the reason the strip
            moved: an exit that disappears when the picture changes is not an
            exit.
            [2026-08-27] IT IS ON ALL THREE SETS NOW, TERMINAL.EXE INCLUDED —
            and that is a reversal of his *"Once running, Kill the [X] lower
            right. I see no use for it here"*. **He has given it a use:** the
            [X] on TERMINAL.EXE runs a visible clean shutdown and lands back on
            the album. His second complaint about it — *"the format is poor
            (bright instead of matching the other text on this screen)"* — is
            answered by where it now sits: it is a chyron on the glass beside
            SCROLL and CLICK, in their register, not a bright mark over a
            terminal. With no digits beside it on that surface, `flex-end` keeps
            it on the same pixel as ever. */}
        <button className="ps-chy ps-chy-x" aria-label="close the portal"
                style={{ "--knock": knock("X", CHY_M.dw, CHY_M.dh,
                                          CHY_M.dfs, CHY_M.dwt, 20) }}
                onClick={onClose}>
          <span className="ps-chytxt">X</span>
        </button>
      </div>

      {/* THE CORNER GRIP. It sits on the bezel's own transparent outer corner —
          measured: the PNG is fully transparent for its last 9 columns — so it
          stands on the projection booth's black rather than on the monitor, and
          reads as furniture handling an object rather than as a fifth control.
          That is `twin.html`'s own reasoning for where it put the grip, carried
          one layer out to the thing that now moves. Drawn as a corner bracket
          in the same B&W grammar, not an icon. */}
      <div className="ps-grip" role="separator"
           aria-label="drag to size the monitor"
           onPointerDown={gripDown}
           onDoubleClick={(e) => { e.preventDefault(); setSize(1, true); }} />

      {/* WHAT THE CHANNEL IS CARRYING. The panel used to say this under the
          latch, and the panel is behind a full-screen overlay at the moment it
          matters. It is mechanism state — the one thing that separates *this
          channel has no unit on it* from *this screen is broken*.
          [2026-08-26] TELEVISION NOW CARRIES NO NOTE AT ALL. Mike struck
          `TELEVISION ON THIS CHANNEL.`; `says` has no entry for that kind, the
          string resolves empty and this element does not render — so the line
          does not go blank, it goes away. */}
      {list.length > 0 && note && <div className="ps-note">{note}</div>}
    </div>
    </div>
  );
}
