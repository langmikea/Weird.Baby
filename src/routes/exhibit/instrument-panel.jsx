/* ═══════════════════════════════════════════════════════════════════════════
   THE INSTRUMENT PANEL — its own module since 2026-08-26, and the move is a
   MOVE: every line below is `Exhibit.jsx`'s, carried across unedited.
   ---------------------------------------------------------------------------
   WHY IT LEFT `Exhibit.jsx`. TERMINAL.EXE puts the feed panel's four bays on a
   Portal screen, and that screen is drawn by `RobotsExhibitFlow.jsx` — a
   second caller, in a different file. Exporting `InstrumentPanel` from
   `Exhibit.jsx` would have cost `react-refresh/only-export-components` on a
   file that default-exports a component, and **a baseline is only a tripwire
   while it is exact** — the same trade `use-yt-player.js` was extracted for on
   2026-08-21, resolved the same way.

   WHAT CAME WITH IT AND WHY THAT IS THE WHOLE UNIT. `dialArc` and its three
   constants, `resolveChannel`, `televisionStart`, `televisionPhase`,
   `panelLoad` and `panelSave`. Measured before the cut: each is referenced
   exactly twice in `Exhibit.jsx` — its own definition and one call inside
   `InstrumentPanel` — and **nothing outside that file referenced any of
   them.** So the panel and its helpers are one closed set, and splitting it
   would have left `Exhibit.jsx` importing helpers for a component it no longer
   draws.

   THE PANEL STILL KNOWS NOTHING. Its contract is unchanged: `decl` in, a
   panel out, every legend and arming rule from the artist config. It does not
   know what a portal is, and it does not know whether it is being drawn on an
   album page or inside a CRT bezel — which is exactly what made TERMINAL.EXE a
   placement rather than a rebuild.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ═══ [2026-08-26, later the same day] NOTHING DECLARES `face.panel` NOW ════
   MIKE: **"BIG CHANGE: Move the FUNCTIONALITY of the feed panel to the MONITOR
   … KILL THE HW Feed Monitor."** The one track that drew this component — the
   Portal's `Launch the Portal` — was deleted by his ruling in the same breath,
   and its FUNCTION is `src/routes/robots/feed-control.js` while its FORM is the
   monitor's own. **So this component has no caller today.**

   IT IS KEPT, AND THE REASON IS THE ONE `make_unit_covers.py` AND THE
   MOTHBALLED `Stage` WERE KEPT FOR: everything below — the drum's cylinder
   geometry, the dial's detent arc, the fit-to-frame rule, the arming rule's
   one-place evaluation — is the record of how the hardware feed panel was
   built and is the only written form of it. **What was retired is its
   AUTHORITY over a surface, not its account of one.**

   AND THE MECHANISM IT MOUNTS ON IS STILL LIVE AND STILL CORRECT.
   `Exhibit.jsx` renders this on the presence of `face.panel`, which is the
   house's declared "mounted on a field" pattern — `FoundationObjects.jsx` and
   `RobotsExhibitFlow.jsx` both cite it by name. A wing that declares the field
   gets a panel; none does. **Revival is one declaration**, exactly as the
   mothballed `Stage`'s is one `stage: true`.

   IF A FUTURE ROUND FINDS THIS STILL UNMOUNTED, THAT IS THE ROUND THAT SHOULD
   DECIDE WHETHER IT GOES — the same sentence the `Stage` block carries, and it
   is not this round's call to make on the day the ruling landed. */
import { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from "react";

/* ======== [P2 2026-08-02] THE INSTRUMENT PANEL ==========================
   A renderer for `face.panel`, and DELIBERATELY NOTHING MORE. It knows how to
   draw a drum, a bat switch, an incandescent lamp, a rotary dial and a latch;
   it does not know what a portal is, what MGK-VIIIp is, or why maintenance
   would be non-interruptible. Every legend, every position and every arming
   rule arrives as data from the artist config — the same discipline `face`
   itself has carried since E2 — so /hr and /wb, which declare no faces at
   all, cannot notice this exists.

   ARMING IS ONE RULE, EVALUATED IN ONE PLACE. A panel is armed when the drum
   sits on a position that arms, the dial sits on a position that arms, and
   every switch matches its `armsWhen`. Anything else is not armed, and the
   panel says WHICH instrument is refusing and why — a control that declines
   silently is the same defect as a menu that hides what it is not offering.

   THE DRUM IS A REAL CYLINDER, not a list that cross-fades. The positions are
   laid around it in 3D and it rotates to bring one into the window, because
   that is the instrument Mike specified and a fade would be a picture of it
   rather than the thing — the same fault the ASK row carried in FR1.
   Geometry: with N faces of height h, the radius that makes them meet
   edge-to-edge is (h/2) / tan(pi/N).
   IT IS LIT ONLY WHEN ARMED. An unlit drum is still legible: you can read
   what the machine could do and see that it is not doing it. */
/* the detent arc: positions spread across a sweep to the RIGHT of the knob,
   so the labels read left-to-right and never cross the pointer. One position
   sits at the middle of the sweep rather than at its edge. */
const DIAL_SWEEP = 100, DIAL_FROM = 40, DIAL_R = 54;
function dialArc(i, n) {
  const a = n <= 1 ? DIAL_FROM + DIAL_SWEEP / 2
                   : DIAL_FROM + (DIAL_SWEEP * i) / (n - 1);
  const rad = a * Math.PI / 180;
  return {
    position: "absolute",
    left: `calc(50% + ${(DIAL_R * Math.sin(rad)).toFixed(2)}px)`,
    top: `calc(50% - ${(DIAL_R * Math.cos(rad)).toFixed(2)}px)`,
    transform: "translateY(-50%)",
    whiteSpace: "nowrap",
  };
}
/* ═══ [2026-08-21] THE CHANNEL RESOLVER — ONE PRIORITY, ONE PLACE ═══════════
   MIKE'S MECHANIC, and it is a PRIORITY PER CHANNEL rather than a fixed map:

     1. TELEVISION, if the routing gives that channel a 1. It overrules
        everything.
     2. THE MACHINE'S SIGNAL, if a machine is assigned to that channel and
        television is not on it.
     3. THE TEST SIGNAL, if neither.

   A MACHINE IS FIXED TO ITS CHANNEL. It does not appear on whichever channel
   happens to be free — it appears on its own, or not at all. That is the whole
   puzzle: get the zero onto the machine's channel and television stops being in
   the way.

   `arms: true` ON A DRUM POSITION IS WHAT "A MACHINE IS ASSIGNED" MEANS. The
   field's meaning widens for a governed channel and is untouched everywhere
   else, so no id moved and no legend was recut.

   THIS FUNCTION KNOWS NOTHING ABOUT PORTALS, MGK OR TELEVISION CONTENT. It is
   handed a position, an antenna declaration and an index, and it returns one of
   four words. A face that declares no `antenna` gets `machine` or `none`, which
   is exactly the behaviour every panel had before this existed. */
function resolveChannel(chRow, bits, i) {
  if (!chRow) return "none";
  if (String(bits || "").charAt(i) === "1") return "television";
  return chRow.unit ? "machine" : "test";
}

/* THE PANEL REMEMBERS ITSELF FOR THE VISIT. sessionStorage, never local — the
   twin's own weather note is the reasoning and Mike ruled it here: a reload
   inside the session keeps the state and a new tab starts again, so the antenna
   stays a puzzle per visit rather than being solved once for ever.
   ALL OF IT OR NONE OF IT. A routing that survived while the drum reset would
   be one instrument disagreeing with itself about whether anything happened.
   IT DEGRADES HONESTLY. Refused storage (private windows, blocked site data,
   thumbnail capture) throws on the accessor itself, so both ends are wrapped
   and a panel that cannot remember simply opens at its declared defaults. */
/* ═══ [2026-08-21] THE BROADCAST IS A WALL CLOCK, NOT A PLAYLIST ═══════════
   One source, three channels, evenly spaced: phases 0, d/3 and 2d/3, and the
   join is `(now + phase) mod duration`. Nothing is stored and nothing has to be
   kept in step — two visitors on two machines are on the same frame, which is
   what makes channel-surfing feel like REJOINING a broadcast rather than
   starting a playlist.

   THE PHASE IS POSITIONAL, NOT PER-CHANNEL. It is this channel's index among
   the channels the CURRENT routing has routed to television, so the three live
   channels are always a third of the reel apart whichever one is dark.

   `loop=1&playlist=<id>` IS LOAD-BEARING AND IS NOT DECORATION. Without it a
   join near the end of the reel runs out within seconds and YouTube draws its
   own end screen — related videos, on the Portal's glass. It is the one failure
   mode of this mechanism that will actually happen, so it is built in from the
   first commit rather than added after somebody sees it.
   `controls=0` and `disablekb=1` remove the scrub bar. A visitor who seeks is
   off the wall clock until the channel is reloaded, and the illusion does not
   come back on its own — and a 1965 television has no scrub bar either, so the
   fix and the period register want the same thing.

   ═══ [2026-08-21] IT COMPUTES A SECOND, NOT A URL, AND THAT IS THE RULING ═══
   MIKE ruled the hook parameterised rather than a hand-written iframe:
   *"Same/data… Small invest, pays back HUGE. That is why the thing is even
   there to be reparameterized."* So this returns the second to join at, and
   `routes/robots/Television.jsx` drives the player.
   IT WAS ALSO THE ONLY THING THAT WORKED. A hand-written iframe carries no
   `allow` attribute, so autoplay is never delegated to the cross-origin frame
   and the channel drew a POSTER instead of playing; the API writes its own
   iframe with `allow="…autoplay…"` on it. The first build proved that on the
   page, which is the only place it could have been proved. */
function televisionStart(tv, phaseIdx, phaseCount) {
  const dur = Math.max(1, Math.floor((tv && tv.seconds) || 1));
  const phase = (dur * phaseIdx) / Math.max(phaseCount, 1);
  return Math.floor((Date.now() / 1000 + phase) % dur);
}
/* which of the live television channels this one is, and how many there are */
function televisionPhase(ant, bits, ch) {
  const rows = (ant && ant.channels) || [];
  const on = rows.filter((r, i) => String(bits || "").charAt(i) === "1")
                 .map(r => r.ch);
  return { idx: Math.max(0, on.indexOf(ch)), count: on.length || 1 };
}

function panelLoad(key) {
  if (!key) return null;
  try {
    const raw = sessionStorage.getItem(key);
    const v = raw ? JSON.parse(raw) : null;
    return v && typeof v === "object" ? v : null;
  } catch { return null; }
}
function panelSave(key, v) {
  if (!key) return;
  try { sessionStorage.setItem(key, JSON.stringify(v)); } catch { /* refused */ }
}

export default function InstrumentPanel({ decl }) {
  const D = decl || {};
  /* [STAGE 2026-08-02] A PANEL IS SCALED TO FIT, NEVER CROPPED.
     The viewer no longer scrolls, so an instrument taller than its frame is
     not "scroll a bit" any more - it is a cropped panel, and a cropped panel
     can hide the latch. Tightening the spacing at narrow widths recovered
     most of it (100px over at 504 wide, down to 27px) but chasing the last
     pixels was starting to cost legibility, and it would have to be chased
     again for every new frame size.
     So the rule is exact instead: measure the panel against the frame and
     scale it down by whatever it is over. A real panel seen from further
     away is smaller and still whole, which is the honest reading of a fixed
     instrument in a fixed stage. Scaling only ever shrinks - a panel with
     room to spare is left at its true size rather than blown up. */
  const fitRef = useRef(null);
  const [fit, setFit] = useState(1);
  useLayoutEffect(() => {
    const el = fitRef.current;
    if (!el || !el.parentElement) return;
    function measure() {
      const avail = el.parentElement.clientHeight;
      if (!avail) return;
      const natural = el.scrollHeight;
      /* two pixels of headroom: sub-pixel rounding in the scaled rect left a
         2px residue at the frame's edge, and a hairline of slack costs
         nothing visible while making "nothing is cropped" exactly true. */
      setFit(natural > avail ? Math.max(0.6, (avail - 2) / natural) : 1);
    }
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro) { ro.observe(el.parentElement); ro.observe(el); }
    return () => { if (ro) ro.disconnect(); };
  }, []);
  /* [H3a, cut back 2026-08-21] the badge's declaration, read once. A panel
     that declares none draws none - the badge is an object the face asks for,
     not furniture. It is the maker's name and nothing else now (Ruling 24). */
  const NP = D.nameplate || null;
  const banks   = Array.isArray(D.feed && D.feed.banks) ? D.feed.banks : [];
  const dialPos = Array.isArray(D.dial && D.dial.positions) ? D.dial.positions : [];
  const ANT     = D.antenna || null;
  /* memoised because `openChannel` closes over it: a fresh `[]` on every render
     would rebuild the callback every render, and the callback is what the
     screen's channel strip is subscribed to. */
  const chRows  = useMemo(
    () => ((ANT && Array.isArray(ANT.channels)) ? ANT.channels : []), [ANT]);

  /* [2026-08-21] THE PANEL REMEMBERS ITSELF FOR THE VISIT, unchanged in kind
     from the drum it replaces: sessionStorage, never local, so a reload inside
     the visit keeps the switches and a new tab starts the puzzle again. Every
     clamp is against the DECLARATION rather than the stored value - a session
     that outlives a data change must not land on a bank that no longer exists.
     IT DEGRADES HONESTLY: refused storage throws on the accessor itself, both
     ends are wrapped, and a panel that cannot remember opens at its defaults. */
  const REM = useMemo(() => panelLoad(D.store) || {}, [D.store]);

  /* THE FEED OPENS ON A BANK THAT ARMS. Two of the five do not (LAST STATE and
     TEST BENCH), and opening on one of those would greet a visitor with a dead
     latch on the one instrument in the wing that is actually running - which is
     the R6 landing defect, in its second costume. */
  const [bankIdx, setBankIdx] = useState(() => {
    const r = Number(REM.bank);
    if (Number.isInteger(r) && r >= 0 && r < banks.length) return r;
    const i = banks.findIndex(b => b.arms);
    return i >= 0 ? i : 0;
  });
  const [dialIdx, setDialIdx] = useState(() => {
    const r = Number(REM.dial);
    return Number.isInteger(r) && r >= 0 && r < dialPos.length ? r : 0;
  });
  /* the four switches, as a string of ones and zeros - one character per
     channel, in `channels` order. A string rather than an array because it is
     what the resolver reads and what a stored value round-trips cleanly. */
  const [bits, setBits] = useState(() => {
    const dflt = String((ANT && ANT.default) || "").padEnd(chRows.length, "1");
    const r = typeof REM.bits === "string" ? REM.bits : null;
    return (r && r.length === chRows.length && /^[01]*$/.test(r)) ? r : dflt;
  });
  useEffect(() => {
    panelSave(D.store, { bank: bankIdx, dial: dialIdx, bits });
  }, [D.store, bankIdx, dialIdx, bits]);

  /* [N1 2026-08-02] THE POINTER POINTS AT THE LEGEND IT HAS CHOSEN, and the
     angle is MEASURED - knob centre to legend centre - rather than tabulated.
     A table is right until somebody adds a third source or restyles a label,
     and then it is confidently wrong; this cannot drift because it reads the
     layout it is pointing into. */
  const knobRef = useRef(null);
  const marksRef = useRef(null);
  const [angles, setAngles] = useState([]);
  useLayoutEffect(() => {
    const k = knobRef.current, m = marksRef.current;
    if (!k || !m) return;
    function measure() {
      const kb = k.getBoundingClientRect();
      if (!kb.width) return;
      const cx = kb.left + kb.width / 2, cy = kb.top + kb.height / 2;
      const out = [];
      for (const el of m.children) {
        const b = el.getBoundingClientRect();
        const dx = (b.left + b.width / 2) - cx;
        const dy = (b.top + b.height / 2) - cy;
        /* CSS rotate(0) puts the mark at 12 o'clock, so 0deg is -Y and the
           angle grows clockwise: atan2(dx, -dy). */
        out.push(Math.atan2(dx, -dy) * 180 / Math.PI);
      }
      setAngles(out);
    }
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro) { ro.observe(m); ro.observe(k); }
    return () => { if (ro) ro.disconnect(); };
  }, [dialPos.length]);

  const bank = banks[bankIdx] || {};
  const dial = dialPos[dialIdx] || {};
  /* [Ruling 25] NO LOCK. A patch panel arms when it is LIVE, and when the bank
     it is showing is one this volume will start. */
  const armed = !!bank.arms && !!dial.arms;

  /* ===== [2026-08-21] ONE RESOLVER, AND THE LATCH IS ONE OF ITS CALLERS =====
     MIKE: **the LATCH launches it, on channel 1** - and the four buttons on the
     screen pick which of the four inputs shows after that. Both arrive here, so
     there is exactly one place that decides what a channel carries and exactly
     one payload shape leaving this panel. A second resolver on the overlay side
     is the thing this function exists to prevent.
     THE ENGINE STILL LEARNS NOTHING. The event carries a kind, a picture frame
     and the list of channel numbers; nothing downstream knows what an antenna
     is, which is the seam R6 drew and this round did not move. */
  const openChannel = useCallback((ch) => {
    if (!armed) return;
    const i = chRows.findIndex(r => r.ch === ch);
    if (i < 0) return;
    const row = chRows[i];
    const kind = resolveChannel(row, bits, i);
    const L = D.latch || {};
    const ev = L.event || "wb-robots-open-twin";
    const base = {
      ch,
      chList: chRows.map(r => r.ch),
      bezel: L.bezel || null,
      note: (ANT && ANT.says && ANT.says[kind]) || "",
    };
    if (kind === "television" && ANT && ANT.television) {
      const ph = televisionPhase(ANT, bits, ch);
      window.dispatchEvent(new CustomEvent(ev, { detail: { ...base,
        kind: "television",
        ytId: ANT.television.ytId,
        startSeconds: televisionStart(ANT.television, ph.idx, ph.count),
        frameTitle: ANT.television.title || "" } }));
      return;
    }
    if (kind === "test" && ANT) {
      window.dispatchEvent(new CustomEvent(ev, { detail: { ...base,
        kind: "test",
        frameTitle: (ANT.test && ANT.test.title) || "" } }));
      return;
    }
    /* [2026-08-26] `picture` rides across on the row's own word. A channel
       whose signal is a PICTURE rather than a document is drawn with an
       `<img>`, because `object-fit` does not apply to an iframe and a
       photograph in one is scaled by the browser rather than by us. The engine
       still learns nothing: it is a boolean beside `src`, exactly as `bezel`
       is a frame declaration beside `ch`. */
    window.dispatchEvent(new CustomEvent(ev, { detail: { ...base,
      preset: bank.id,
      src: row.src || L.src,
      picture: !!row.picture,
      frameTitle: row.frameTitle || L.frameTitle } }));
  }, [armed, chRows, bits, D.latch, ANT, bank.id]);

  /* THE SCREEN'S FOUR BUTTONS COME BACK HERE. They are drawn by the overlay -
     they belong to the Portal and must survive television and the test signal,
     which the machine's own strip could not - but the panel is the only thing
     that can say what a channel carries, so the strip ASKS and this answers.
     It is a window event and not a postMessage: both ends are the museum's own
     components now, and the twin's iframe is no longer in the path at all. */
  useEffect(() => {
    function onSel(e) {
      const ch = e && e.detail && e.detail.ch;
      if (typeof ch === "number") openChannel(ch);
    }
    window.addEventListener("wb-portal-select-channel", onSel);
    return () => window.removeEventListener("wb-portal-select-channel", onSel);
  }, [openChannel]);

  function step(d) {
    const n = Math.max(banks.length, 1);
    setBankIdx(i => (i + d + n) % n);
  }
  function flip(i) {
    setBits(v => v.slice(0, i) + (v.charAt(i) === "1" ? "0" : "1") + v.slice(i + 1));
  }

  return (
    <div ref={fitRef} className={"ip" + (armed ? " ip-armed" : "")}
         style={fit < 1 ? { transform: `scale(${fit.toFixed(4)})`,
                            transformOrigin: "top center" } : undefined}>
      {/* [N2 2026-08-02] THE PANEL IS MOUNTED, NOT PRINTED. Four screws in the
          corners, each seated at a DIFFERENT angle - a screw that lines up with
          its neighbours is a logo, not a fastener, and the eye knows the
          difference without being told why. They are furniture, so they live in
          the renderer rather than in the artist config. */}
      <i className="ip-screw ip-screw-tl" aria-hidden="true" style={{ "--turn": "18deg" }} />
      <i className="ip-screw ip-screw-tr" aria-hidden="true" style={{ "--turn": "-42deg" }} />
      <i className="ip-screw ip-screw-bl" aria-hidden="true" style={{ "--turn": "71deg" }} />
      <i className="ip-screw ip-screw-br" aria-hidden="true" style={{ "--turn": "-7deg" }} />

      {/* THE BADGE - the maker's name, cast and raised on a formed bezel, and
          nothing else on it. */}
      {NP && NP.maker && (
        <div className="ip-np">
          <div className="ip-np-bezel">
            <span className="ip-np-riv ip-np-riv-a" aria-hidden="true" />
            <span className="ip-np-riv ip-np-riv-b" aria-hidden="true" />
            <span className="ip-np-riv ip-np-riv-c" aria-hidden="true" />
            <span className="ip-np-riv ip-np-riv-d" aria-hidden="true" />
            <div className="ip-np-field">
              <span className="ip-np-mark">{NP.maker}</span>
            </div>
          </div>
        </div>
      )}

      <div className="ip-deck">
        {/* ---- FEED: a lit readout with the steppers OUTSIDE it ---- */}
        <div className="ip-bay ip-bay-feed">
          <div className="ip-legend">{(D.feed && D.feed.label) || "FEED"}</div>
          <div className="ip-rd-row">
            <button className="ip-step" onClick={() => step(-1)} aria-label="previous bank">&#9650;</button>
            <div className="ip-rd">
              <b className="ip-rd-bank">{bank.bank || ""}</b>
              <small className="ip-rd-state">{bank.state || ""}</small>
            </div>
            <button className="ip-step" onClick={() => step(1)} aria-label="next bank">&#9660;</button>
          </div>
        </div>

        {/* ---- ANTENNA: four independent switches, numbered, no legend under
             them. What they select belongs in the manual. ---- */}
        {ANT && (
          <div className="ip-bay ip-bay-ant">
            <div className="ip-legend">{ANT.label}</div>
            <div className="ip-dip-wrap">
              <div className="ip-dip">
                {chRows.map((r, i) => (
                  <div className="ip-dip-cell" key={r.ch}>
                    <button className="ip-slot" data-on={bits.charAt(i) === "1" ? "1" : "0"}
                            onClick={() => flip(i)}
                            aria-label={"channel " + r.ch}
                            aria-pressed={bits.charAt(i) === "1"}>
                      <i className="ip-slider" />
                    </button>
                    <span className="ip-dip-n">{r.ch}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---- SOURCE ---- */}
        <div className="ip-bay ip-bay-dial">
          <div className="ip-legend">{D.dial && D.dial.label}</div>
          <div className="ip-dial">
            <button ref={knobRef} className="ip-knob"
                    style={{ transform: `rotate(${angles[dialIdx] ?? 0}deg)` }}
                    onClick={() => setDialIdx(i => (i + 1) % Math.max(dialPos.length, 1))}
                    aria-label={"source: " + (dial.label || "")}>
              <span className="ip-knob-mark" />
            </button>
            {/* [N1] the legends sit on an arc, which is what makes the pointer
                readable: stacked in a column two positions measured 16deg apart
                and the instrument looked broken while being exactly correct. */}
            <div ref={marksRef} className="ip-dial-marks">
              {dialPos.map((pp, i) => (
                <span key={pp.id || i}
                      style={dialArc(i, dialPos.length)}
                      className={"ip-dial-mark" + (i === dialIdx ? " ip-on" : "")}>
                  {pp.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ---- LATCH ---- */}
        <div className="ip-bay ip-bay-latch">
          <div className="ip-latchbay">
            <button className="ip-latch" disabled={!armed}
                    onClick={() => openChannel(chRows.length ? chRows[0].ch : 1)}>
              <span className="ip-latch-face">{(D.latch && D.latch.label) || "LATCH"}</span>
            </button>
            <div className="ip-state">
              <span className={"ip-lamp ip-lamp-green" + (armed ? " ip-lit" : "")} />
              <span className="ip-state-txt">
                {armed ? ((D.latch && D.latch.armed) || "ARMED")
                       : ((D.latch && D.latch.idle) || "NOT ARMED")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
