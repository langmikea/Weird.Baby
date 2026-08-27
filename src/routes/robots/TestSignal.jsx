/* ═══════════════════════════════════════════════════════════════════════════
   THE TEST SIGNAL — what a channel with no unit on it actually carries.
   [2026-08-21]
   ---------------------------------------------------------------------------
   MIKE'S RULING, and the sentence that governs every choice below:

     "The machine only hosts three TV signals at a time; the reason the fourth
      has a test signal is unknown. Maybe one of the switches needs flipped? Or
      maybe there is another module that will come on line? Innocent footholds
      for future claims of foreshadowing, and a bit of richness."

   SO IT IS A FACT ABOUT THE MACHINE, NOT AN ABSENCE. It has to read as *this is
   how it works* and never as *this is broken*. Nothing here explains it and
   nothing resolves it — the foothold is left standing, the same way R6 left the
   channel numbering unexplained on the drum.

   ═══ WHY THIS IS DRAWN HERE AND NOT OPENED IN THE TWIN ══════════════════════
   The twin has carried exactly this object since July — `body.portal.nosignal`,
   a test card on `#feedtest`, and `Hum_Start` / `Hum_Blip` / `Hum_Swell` /
   `Hum_Strain` in Web Audio — and reusing it was the first plan. It was
   rejected on a reading, not on effort, and the reading is worth keeping:

   **THE TWIN IS THE MACHINE.** Its no-signal card is MGK-VIIIp's own monitor
   showing nothing on one of ITS five feeds. The Portal's test signal is the
   opposite claim — that there is NO unit on this channel. Opening the twin to
   say it would put the machine on a channel the routing has just established it
   is not on, which is the one thing the whole puzzle turns on.

   Two smaller reasons, recorded because they would have cost a round each:
   the twin accepts `preset`, `day` and `user` and has no feed parameter, so it
   could not be told which feed to open on without editing a held 10,800-line
   document; and an iframe is a separate document with no user activation of its
   own, so its AudioContext would start suspended and the hum simply would not
   play. Drawn here, the latch press IS the gesture.

   ═══ THE HUM IS THE TWIN'S, TO THE PARAMETER ═══════════════════════════════
   Not invented and not approximated. `HUM_HZ 60`, `HUM_LEVEL 0.030`,
   `HUM_BITE 0.006`, wobble `0.09 Hz / 0.010`, drift `0.13 Hz / 0.55 Hz` are
   read straight off `Hum_Start()` in `public/held/robots/twin.html`, whose own
   note says what they are for: *"The bed is not a voice. It is 60Hz mains hum,
   slightly perturbed in volume and frequency — a BYPRODUCT of a machine being
   on."* A byproduct of a machine being on is exactly the right sound for a
   channel that is working and has nothing on it.

   ═══ IT ANSWERS THE RISK, WHICH IS THE POINT OF IT ═════════════════════════
   A channel routed to dead air and a channel whose video has died showed the
   same picture — nothing — and the museum cannot tell them apart from inside.
   The test signal gives the zero a BODY: a card and a hum. A dead source draws
   YouTube's own grey box or nothing at all, and neither looks like this.
   ═══════════════════════════════════════════════════════════════════════════ */
import React, { useEffect, useRef } from "react";
import "./TestSignal.css";

/* read off `Hum_Start()` in twin.html — do not tune these here. If the machine's
   bed ever changes, it changes there and is copied, so there is one sound in the
   building and one place it is described. */
const HUM_HZ = 60, HUM_LEVEL = 0.030, HUM_BITE = 0.006;
const HUM_WOBBLE_HZ = 0.09, HUM_WOBBLE = 0.010;
const HUM_DRIFT_HZ = 0.13, HUM_DRIFT = 0.55;

/* ═══ [2026-08-27] THE BARREL — MIKE'S RULING, AND THE SIGN MATTERS ════════
   **ON: the test signal image.** OFF: the YouTube video, the VIIIp and the
   terminal, *"first pass, explicitly"*.

   THE CARD IS DRAWN IN A 400x300 BOX AND EVERY MARK IS EMITTED THROUGH
   `bend()`. Normalised coordinates put the box's centre at 0 and its own
   corners at r-squared = 2:

       f(r2) = (1 - K*r2) / (1 - K*RPIN)

   **THE MINUS SIGN IS THE WHOLE DIFFERENCE BETWEEN BARREL AND PINCUSHION, AND
   IT WAS GOT WRONG ONCE ON PAPER BEFORE IT WAS GOT RIGHT.** The intuitive
   `r' = r(1 + k r²)` moves the CORNERS further than the mid-edge points, which
   pulls every edge inward at its middle — that is PINCUSHION. Barrel is the
   other sign: corners drawn IN harder than edge centres, so each edge bows
   outward. Checked on the border's own numbers before a line was drawn: the top
   edge's centre sits at r2 = 0.64 and its corner at r2 = 1.28, and it is the
   ratio between those two displacements that decides which way the line bends.

   `RPIN` IS THE BORDER'S CORNER, SO THE COMPOSITION DOES NOT MOVE. Dividing by
   `f` at that radius pins the card's four corners exactly where they were and
   lets everything inside bow — the centre magnifies a little, the frame bulges,
   and the card still fills the same rectangle it always did. Without the pin
   the whole drawing would shrink and read as a smaller card rather than a bent
   one.

   K IS ONE NUMBER AND IT IS HIS TO MOVE. At 0.08 the card's mid-edges bow out
   by about 3% of its width and the centre magnifies by 9%. */
const BARREL_K = 0.08;
const RPIN = (160 / 200) ** 2 + (120 / 150) ** 2;   /* the border's own corner */

function bend(x, y) {
  const dx = (x - 200) / 200, dy = (y - 150) / 150;
  const f = (1 - BARREL_K * (dx * dx + dy * dy)) / (1 - BARREL_K * RPIN);
  return [200 + dx * 200 * f, 150 + dy * 150 * f];
}
/* a straight run becomes a sampled polyline. 12 segments is where the bow stops
   being visibly faceted at this card's size — measured by eye against 6 and 24,
   and 24 costs path length for no difference. */
const SEG = 12;
const pt = (x, y) => { const p = bend(x, y); return `${p[0].toFixed(2)},${p[1].toFixed(2)}`; };
function run(x1, y1, x2, y2) {
  let d = "";
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG;
    d += (i ? "L" : "") + pt(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
  }
  return d;
}
const bentLine = (x1, y1, x2, y2) => "M" + run(x1, y1, x2, y2);
const bentBox = (x, y, w, h) =>
  "M" + run(x, y, x + w, y) + "L" + run(x + w, y, x + w, y + h) +
  "L" + run(x + w, y + h, x, y + h) + "L" + run(x, y + h, x, y) + "Z";
function bentCircle(cx, cy, r) {
  let d = "";
  const N = 72;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    d += (i ? "L" : "M") + pt(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  return d + "Z";
}

export default function TestSignal({ title }) {
  const humRef = useRef(null);

  /* THE BED. Built on mount and torn down on unmount, and every step is wrapped:
     a browser with no Web Audio, a refused context, or a context that never
     resumes must leave a silent test card rather than a broken overlay. The card
     is the half that carries the meaning; the hum is the half that makes it a
     machine. */
  useEffect(() => {
    let h = null;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return undefined;
      const c = new Ctx();
      /* the latch press is a user gesture in THIS document, so this resolves.
         It is still guarded: a page restored from bfcache has no fresh
         activation and the context stays suspended, which is silence and not an
         error. */
      if (c.state === "suspended") c.resume().catch(() => {});
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = HUM_HZ; g.gain.value = 0;
      const wob = c.createOscillator(), wobG = c.createGain();
      wob.frequency.value = HUM_WOBBLE_HZ; wobG.gain.value = HUM_WOBBLE;
      wob.connect(wobG); wobG.connect(g.gain);
      const dr = c.createOscillator(), drG = c.createGain();
      dr.frequency.value = HUM_DRIFT_HZ; drG.gain.value = HUM_DRIFT;
      dr.connect(drG); drG.connect(o.frequency);
      /* the transformer bite — the second harmonic, well under the fundamental */
      const o2 = c.createOscillator(), g2 = c.createGain();
      o2.type = "sine"; o2.frequency.value = HUM_HZ * 2; g2.gain.value = HUM_BITE;
      o.connect(g); g.connect(c.destination);
      o2.connect(g2); g2.connect(c.destination);
      o.start(); o2.start(); wob.start(); dr.start();
      /* it comes up slowly, exactly as the machine's does */
      g.gain.setTargetAtTime(HUM_LEVEL, c.currentTime, 0.9);
      h = { c, o, o2, wob, dr, g, g2 };
      humRef.current = h;
    } catch { /* no bed; the card stands alone */ }
    return () => {
      humRef.current = null;
      if (!h) return;
      try {
        h.g.gain.cancelScheduledValues(h.c.currentTime);
        h.g.gain.setTargetAtTime(0, h.c.currentTime, 0.25);
        h.g2.gain.setTargetAtTime(0, h.c.currentTime, 0.25);
        setTimeout(() => {
          try { h.o.stop(); h.o2.stop(); h.wob.stop(); h.dr.stop(); } catch { /* gone */ }
          try { h.c.close(); } catch { /* gone */ }
        }, 900);
      } catch { /* gone */ }
    };
  }, []);

  /* THE CARD. Drawn rather than photographed, in the wing's B&W, and
     deliberately a 1965 monoscope rather than the colour bars a reader would
     date to the seventies: a centre cross, a resolution wedge, a greyscale
     step ramp and the circle that says the geometry is right.
     IT CARRIES NO WORDS. A test card that said TEST SIGNAL would be the museum
     narrating the machine — Doctrine 11's corollary — and a 1965 monoscope
     carries a station's own mark, which this channel does not have.

     ═══ [2026-08-27] IT IS BENT NOW, AND ON A TEST CARD THAT IS THE POINT ════
     MIKE ruled barrel distortion **ON "the test signal image"** and OFF the
     YouTube video, the VIIIp and the terminal — *"first pass, explicitly"*.

     **THE GEOMETRY IS BENT, NOT FILTERED, AND THAT IS THE WHOLE OF WHY THIS
     LOOKS RIGHT.** A CSS or SVG filter over the finished card would resample
     hairlines that are already sub-pixel and turn a 0.7-wide grid rule into
     mush. Every mark here is drawn by us, so each one is emitted through
     `bend()` at the coordinates it should have on a curved tube — the lines
     stay one stroke wide and land where the glass would put them.

     **AND A MONOSCOPE IS THE ONE PICTURE THAT IS ABOUT THIS.** Its whole job is
     to show whether the geometry is right: the circle and the frame are there
     so an engineer can see the tube bowing them. A test card drawn flat on a
     curved screen is the only object in the wing that would have been actively
     saying something false. */
  return (
    <div className="ts-root" role="img" aria-label={title || "Test signal"}>
      <svg className="ts-card" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet"
           aria-hidden="true">
        <rect x="0" y="0" width="400" height="300" fill="#141311" />
        {/* the grid — the geometry check, and now it is a check that reports */}
        <g stroke="#4a4740" strokeWidth="0.7" fill="none">
          {[...Array(9)].map((_, i) => (
            <path key={"v" + i} d={bentLine(40 + i * 40, 30, 40 + i * 40, 270)} />
          ))}
          {[...Array(7)].map((_, i) => (
            <path key={"h" + i} d={bentLine(40, 30 + i * 40, 360, 30 + i * 40)} />
          ))}
        </g>
        <path d={bentCircle(200, 150, 120)} fill="none" stroke="#8d887a"
              strokeWidth="1.4" />
        <path d={bentBox(40, 30, 320, 240)} fill="none" stroke="#8d887a"
              strokeWidth="1.4" />
        {/* the greyscale step ramp */}
        {[...Array(8)].map((_, i) => (
          <path key={"s" + i} d={bentBox(80 + i * 30, 200, 30, 28)}
                fill={`rgb(${18 + i * 30},${18 + i * 30},${17 + i * 28})`} />
        ))}
        {/* the resolution wedge */}
        {[...Array(14)].map((_, i) => (
          <path key={"w" + i} d={bentBox(110 + i * 12, 72, 6 - i * 0.32, 26)}
                fill="#c9c4b6" />
        ))}
        {/* the centre cross */}
        <g stroke="#e6e1d4" strokeWidth="1.6" fill="none">
          <path d={bentLine(200, 128, 200, 172)} />
          <path d={bentLine(178, 150, 222, 150)} />
        </g>
      </svg>
      {/* the raster. A slow horizontal band and a fine scan texture over the
          card, so it reads as a signal on a tube rather than a diagram on a
          page. It is `pointer-events:none` and purely decorative. */}
      <div className="ts-scan" aria-hidden="true" />
      <div className="ts-band" aria-hidden="true" />
    </div>
  );
}
