/* ═══════════════════════════════════════════════════════════════════════════
   TERMINAL.EXE. [2026-08-26, rebuilt 2026-08-27]
   ---------------------------------------------------------------------------
   **MIKE: "stop calling it Mode A and Mode B. This one is TERMINAL.EXE."** The
   mode names are retired from this wing. There is the television, the machine
   on channel 3, the test signal, and this — a program the visitor runs from a
   filename that Record 004's cracked ZIP already carries.

   MIKE, defining what it does: **"Instead of the feed panel, I want to put the
   controls of the feed panel on a Portal screen."** And on seeing the first
   cut: **"BIG CHANGE: Move the FUNCTIONALITY of the feed panel to the MONITOR,
   and IN MONITOR FORMAT AND CHARACTER. Do not map every control as-is to the
   monitor - that would be foolish. Make it MONITOR-esque."**

   ═══ THREE PHASES, AND THE SCREEN CLEARS BETWEEN THE FIRST TWO ═════════════
   **MIKE: "Boot first — I like how the initial commands come up and the size
   they come up at. THEN CLEAR THE SCREEN and draw the interface."**

     BOOT    four lines, one every `BOOT_STEP`, in the register he approved.
     PANEL   the screen is EMPTY, then the launch panel is drawn on it.
     HALT    the boot backwards, quicker, then the overlay closes.

   **THE CLEAR IS A REAL CLEAR AND NOT A SCROLL.** The boot lines are removed
   from the document, not pushed up out of view — a terminal that clears leaves
   nothing behind it, and leaving them above the panel is what produced the
   thing he asked to be rid of: a panel reading as one more entry in a running
   log rather than as the program's own face.

   ═══ THE PANEL IS CGA-FAT, AND THAT REPLACED A DIFFERENT COMPLAINT ═════════
   MIKE: **"When you get to the point where you're launching into the launch
   panel, feel free to use more of a CGA fat graphic, then simple ASCII."** And
   what it settles: **"Using the CGA fat graphics on its freshly cleared screen
   will address the problem"** — the problem being that the first cut read as an
   inline menu of dimmed `>` prompts.

   SO THE `>` CARET IS OFF THE PANEL ROWS. It belongs to the boot, where it is
   `Mon_DOS`'s prompt and where he likes it. On the panel the legend itself is
   the row, drawn FAT — double-width, heavy, tracked, the way a CGA text mode
   draws forty columns where eighty would fit — with solid block rules above and
   below it. **The data beside each legend stays simple ASCII**, which is the
   second half of his sentence and the reason the panel reads at a glance: one
   weight for what a thing IS, another for what it is SET TO.

   **NOTHING IS BRIGHTER THAN ANYTHING ELSE AND THAT RULING IS UNTOUCHED.** He
   struck the old `[X]` partly for being *"bright instead of matching the other
   text on this screen"*. CGA-fat is a LETTERFORM and a BLOCK GRAPHIC, not a
   palette: there is one ink here, the twin's own `CARD_OFF`, and a live row is
   INVERTED rather than lit — the machine's own register for *this is the one*,
   and the same one the channel strip uses.

   ═══ SCROLL AND CLICK, AND HE ARRIVED AT IT HIMSELF ════════════════════════
   **MIKE: "In the spirit of the VIIIp it should simply be scroll and click.
   Scrolling takes you to the next changeable field and click changes it."**

   He had asked first for underlines or asterisks to mark which fields were
   live, then replaced his own idea and struck the marks with it: **"We don't
   have that problem now that we're going with scroll and click."** He is right,
   and the reason is worth writing down because it is a general one: **a cursor
   that can only stand on a changeable field IS the mark.** Nothing needs to
   advertise what it is when the only thing you can reach is the thing you can
   change.

   **SO THE STOPS ARE THE ONLY AFFORDANCE, AND A DEAD ROW IS NOT ONE.** He
   ruled the set right — *"The fields that were changing were the right
   fields"* — and named the defect as a non-changeable field being able to take
   the highlight. `stops()` below is therefore built from what can actually
   change at this instant, which is why RUN leaves the rotation when the feed
   will not start: it still SAYS `NOT READY`, in the open, and it cannot be
   selected. **Saying no and being unselectable are the same statement made
   twice, which is what a control that declines silently fails to do.**

   THE ROTARY DIAL IS THE VIIIp's OWN INPUT and this is it doing its own job.
   `devRotary` navigates the machine's menus in the emulated `5_INPUT.ino`;
   here it walks a field list. One meaning, two machines — which is what keeps
   the 2026-08-26 ruling (*"scroll only does what it was originally designed to
   do"*) intact rather than bent.

   ═══ IT HOLDS NO STATE THAT MATTERS ════════════════════════════════════════
   The feed's function is `feed-control.js`, owned by `RobotsExhibitFlow` so it
   survives this component being replaced by whatever the latch opens. What
   lives here is the phase, the cursor and the type-out clock — three things
   that are about the SCREEN and about nothing else.
   ═══════════════════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from "react";
import "./PortalConsole.css";

/* One line every STEP ms. The boot's figure is measured on the served page
   rather than computed — four lines at 420ms is 1.7s of arithmetic and the
   screen settles nearer 4s, the difference being mount and dev-mode's
   double-invoked effect. **The halt is deliberately faster**: his word for it
   is *"quick, but it happens"*, so it plays at nearly half the boot's interval
   and is over in well under a second. A press finishes the boot at any point,
   so neither figure is load-bearing. */
const BOOT_STEP = 420;
const HALT_STEP = 190;

/* [2026-08-27] THE `padEnd` COLUMN IS GONE AND THE GRID DOES IT. The legend is
   drawn CGA-fat with `scaleX`, and a stretched inline-block keeps its UNSCALED
   layout width — so a pad computed here would put the datum column several
   characters too far left, and compensating for it in CSS would make that file
   depend on a constant in this one. `PortalConsole.css` carries the reasoning at
   `.pc-row`. **The column is one declaration now, in the file that draws it.** */

/* ═══ THE STOPS — what SCROLL can land on, in the order it lands ════════════
   Built fresh on every render from the live feed, so a bank that disarms RUN
   removes it from the rotation in the same frame the legend changes. The
   aerial contributes one stop per position: each is independently switchable
   and is the whole of the puzzle QC_101 sets. */
function stops(feed) {
  const out = [{ k: "feed" }];
  for (let i = 0; i < feed.chRows.length; i++) out.push({ k: "ant", i });
  out.push({ k: "dial" });
  if (feed.armed) out.push({ k: "run" });
  return out;
}

/* ═══ A PANEL ROW — THE LEGEND FAT, THE DATUM SIMPLE ══════════════════════
   Declared at module scope rather than inside the render, which the linter
   asked for and was right to: a component built during render is a NEW
   component type on every pass, so React throws its subtree away and rebuilds
   it each time. On a screen whose whole job is a cursor sitting still, that is
   the one thing that must not happen.

   `live` is the cursor, and it inverts — ink and ground swap. Pressing a row
   both MOVES the cursor there and acts, so a mouse does in one press what
   SCROLL and CLICK do in several; the two paths end in the same call and
   neither is the "real" one. */
function Row({ live, label, value, onPress }) {
  return (
    <button type="button"
            className={"pc-row" + (live ? " pc-live" : "")}
            onClick={onPress}>
      <span className="pc-fat">{label}</span>
      <span className="pc-val">{value}</span>
    </button>
  );
}

export default function PortalConsole({ boot, halt, feed, decl,
                                        halting, onHalted }) {
  const bootLines = Array.isArray(boot) ? boot : [];
  const haltLines = Array.isArray(halt) ? halt : [];

  /* ═══ THE PHASE IS DERIVED, NOT STORED, AND THAT IS NOT TIDINESS ═══════════
     "boot" -> "panel" -> "halt". The first cut of this held `phase` in state
     and moved it to "halt" from inside an effect watching `halting`, which is
     `react-hooks/set-state-in-effect` — **the exact rule this wing corrected
     itself on once already**, when `setShown(0)` sat at the top of an effect in
     the 2026-08-26 round. The linter caught it again here, on a fresh file,
     which is the argument for the baseline being exact.

     SO THERE IS ONE PIECE OF STATE PER REAL FACT: has the boot finished
     printing, and how many lines are on the screen. The phase falls out of
     those and out of the `halting` prop, and cannot disagree with either.
     Resetting `shown` on the way into the halt is the documented
     adjust-state-when-a-prop-changes pattern — during render, comparing
     identities — which is what `feed-control.js` already uses for the same
     class of problem. */
  const [bootDone, setBootDone] = useState(false);
  const [shown, setShown] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [seenHalting, setSeenHalting] = useState(halting);
  if (seenHalting !== halting) { setSeenHalting(halting); setShown(0); }
  const phase = halting ? "halt" : (bootDone ? "panel" : "boot");

  /* THE BOOT TYPES ITSELF OUT, THEN THE SCREEN CLEARS.
     `setInterval` and not `requestAnimationFrame`: §8 — rAF does not fire in a
     tab the browser is not painting, and a harness that could not paint once
     reported a boot as stalled. The `setState` here is inside a TIMER
     CALLBACK — an external system reporting back, which is what an effect is
     for — and not in the effect's body, which is the distinction the rule
     above turns on. */
  useEffect(() => {
    if (phase !== "boot" || !bootLines.length) return undefined;
    const t = setInterval(() => {
      setShown(n => {
        if (n >= bootLines.length) { clearInterval(t); setBootDone(true); return n; }
        return n + 1;
      });
    }, BOOT_STEP);
    return () => clearInterval(t);
  }, [phase, bootLines.length]);

  /* THE HALT. It is entered from the outside — the [X] on the glass, or
     Escape — because the way out belongs to the screen and not to the program.
     `onHalted` is what actually closes the overlay, and `doneRef` is why it
     fires exactly once however many times this effect is re-run. */
  const doneRef = useRef(false);
  useEffect(() => {
    if (phase !== "halt") return undefined;
    const t = setInterval(() => {
      setShown(n => {
        if (n >= haltLines.length) {
          clearInterval(t);
          if (!doneRef.current) { doneRef.current = true; onHalted && onHalted(); }
          return n;
        }
        return n + 1;
      });
    }, HALT_STEP);
    return () => clearInterval(t);
  }, [phase, haltLines.length, onHalted]);

  /* ═══ SCROLL AND CLICK ARRIVE AS AN EVENT, NOT AS A PROP ═══════════════════
     The two words are drawn by `PortalScreen` on the glass, one layer out and
     in a different component; `RobotsExhibitFlow` re-dispatches them here when
     the terminal is the surface that is up. It is the same shape the channel
     strip and the latch already use — **the button asks, it does not answer** —
     and it is what lets the words live on the bezel while the fields live on
     the screen without either knowing about the other. */
  useEffect(() => {
    if (phase !== "panel") return undefined;
    function onInput(e) {
      const id = e && e.detail && e.detail.id;
      const list = stops(feed);
      if (!list.length) return;
      if (id === "scroll") { setCursor(c => (c + 1) % list.length); return; }
      if (id !== "click") return;
      const s = list[Math.min(cursor, list.length - 1)];
      if (!s) return;
      if (s.k === "feed") feed.stepBank(1);
      else if (s.k === "ant") feed.flipBit(s.i);
      else if (s.k === "dial") feed.stepDial();
      else if (s.k === "run") feed.openChannel(feed.feedChannel);
    }
    window.addEventListener("wb-portal-console-input", onInput);
    return () => window.removeEventListener("wb-portal-console-input", onInput);
  }, [phase, feed, cursor]);

  /* THE CURSOR CANNOT POINT PAST THE END. Stepping FEED onto a bank that does
     not arm removes RUN from the rotation, and if the cursor was ON it the
     index is now out of range. Clamped during render — the documented
     adjust-state-when-a-prop-changes pattern, not an effect, which would paint
     one frame of a cursor standing on a row that is not there. */
  const list = stops(feed);
  if (cursor > list.length - 1 && list.length) setCursor(list.length - 1);
  const at = list[Math.min(cursor, Math.max(0, list.length - 1))] || { k: "" };
  /* a direct press puts the cursor where it landed. `k` is enough for every row
     but the aerial, whose four positions are told apart by `i`. */
  const pick = (k, i) => {
    const j = list.findIndex(s => s.k === k && (i === undefined || s.i === i));
    if (j >= 0) setCursor(j);
  };

  const D = decl || {};
  const ANT = D.antenna || null;
  const bankLabel = [feed.bank.bank, feed.bank.state].filter(Boolean).join("  ");
  const lines = phase === "halt" ? haltLines : bootLines;


  return (
    <div className="pc-root">
      <div className="pc-scr" aria-live="polite">
        {phase !== "panel" && lines.slice(0, shown).map((l, i) => (
          <div className="pc-line" key={i}>{l}</div>
        ))}

        {phase === "panel" && (
          <div className="pc-panel">
            <div className="pc-rule" aria-hidden="true" />

            <Row live={at.k === "feed"} value={bankLabel}
                 label={(D.feed && D.feed.label) || "FEED"}
                 onPress={() => { pick("feed"); feed.stepBank(1); }} />

            {ANT && (
              <div className={"pc-row pc-row--static"
                              + (at.k === "ant" ? " pc-live-in" : "")}>
                <span className="pc-fat">{ANT.label}</span>
                <span className="pc-val pc-bits">
                  {feed.chRows.map((r, i) => (
                    <button type="button" key={r.ch}
                            className={"pc-bit"
                              + (at.k === "ant" && at.i === i ? " pc-live" : "")}
                            aria-label={"channel " + r.ch}
                            aria-pressed={feed.bits.charAt(i) === "1"}
                            onClick={() => { pick("ant", i); feed.flipBit(i); }}>
                      {feed.bits.charAt(i) === "1" ? "1" : "0"}
                    </button>
                  ))}
                </span>
              </div>
            )}

            {/* no `|| "SOURCE"` fallback: the dial's legend is declared in
                `portal.js` and a hard-coded stand-in would be Ops writing a
                legend for a panel that failed to declare one. The row draws
                what the declaration says, or nothing. */}
            <Row live={at.k === "dial"} value={feed.dial.label || ""}
                 label={(D.dial && D.dial.label) || ""}
                 onPress={() => { pick("dial"); feed.stepDial(); }} />

            <div className="pc-rule" aria-hidden="true" />

            {/* THE LATCH, AS A COMMAND. The panel's own rule stands — *a
                control that declines silently is the same defect as a menu
                that hides what it is not offering* — and it is met twice over:
                the state word says NOT READY in the open, and SCROLL cannot
                land on it while it is. **THIS IS NOT ONE OF THE MESSAGES MIKE
                KILLED.** His were about SIGNAL PRESENT — whether a routing
                found a machine. This is whether the console will run at all,
                which is the one thing a visitor cannot work out by looking. */}
            <Row live={at.k === "run"} label="RUN"
                 value={feed.armed ? "READY" : "NOT READY"}
                 onPress={() => { pick("run");
                   if (feed.armed) feed.openChannel(feed.feedChannel); }} />
          </div>
        )}
      </div>

      {/* the skip — invisible, over the text, and only while the boot is
          running. It is not drawn during the halt: a shutdown he asked to be
          VISIBLE is not something to offer a way past. */}
      {phase === "boot" && (
        <button type="button" className="pc-skip" aria-label="finish loading"
                onClick={() => { setShown(bootLines.length); setBootDone(true); }} />
      )}
    </div>
  );
}
