/* ═══════════════════════════════════════════════════════════════════════════
   THE FEED CONTROL — the feed panel's FUNCTION, with no opinion about form.
   [2026-08-26]
   ---------------------------------------------------------------------------
   MIKE: **"BIG CHANGE: Move the FUNCTIONALITY of the feed panel to the MONITOR,
   and IN MONITOR FORMAT AND CHARACTER. Do not map every control as-is to the
   monitor - that would be foolish. Make it MONITOR-esque."**

   **FUNCTIONALITY** is the word this file exists to honour. Everything the four
   bays DO is here — which bank is patched, which channels are routed to the
   aerial, whether the source is live, whether the thing arms, and the one
   resolver that says what a channel carries. **Nothing here knows what a knob,
   a lamp, a slider or a readout is.** The monitor draws it in the monitor's
   character; the panel used to draw it as hardware; neither is in this file.

   ═══ AND IT IS ALSO THE FIX FOR "TV - I CANNOT CHANGE CHANNELS" ════════════
   That defect was real, live, and mine. Measured on the served page:

     via the ALBUM panel's LATCH — the face stays mounted behind the overlay,
       so `openChannel` is still listening. Pressing 3 lit 3. **Worked.**
     via TERMINAL.EXE — the console IS the overlay's content, so latching REPLACED
       it and took its panel with it: `.ip` count went 1 -> **0** at the same
       instant the digit strip appeared. Pressing 3 left 1 lit. **Dead.**

   **THE DIGIT STRIP'S ONLY LISTENER WAS DESTROYED BY THE VERY ACT THAT SHOWED
   THE DIGIT STRIP.** `wb-portal-select-channel` was answered inside the panel
   component, and the panel was a page widget.

   So the state does not live in a component that the overlay can replace. It
   lives here, owned by `RobotsExhibitFlow`, which owns the overlay itself and
   is mounted for the whole visit to the wing. **The channel strip cannot
   outlive its listener any more, because the listener now outlives the strip.**

   ═══ EVERY RULE BELOW IS CARRIED, NOT RE-DECIDED ═══════════════════════════
   The arming rule, the session memory, the clamps, the resolver's priority and
   the wall-clock television join are `instrument-panel.jsx`'s, moved. Their
   reasoning travelled with them. **A behaviour does not change unless there is
   a stated reason** (Doctrine 7), and the only stated reason in this move is
   where the state lives.
   ═══════════════════════════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useState } from "react";

/* ═══ [2026-08-21] THE CHANNEL RESOLVER — ONE PRIORITY, ONE PLACE ═══════════
   Carried verbatim from the panel. Priority: television, then the machine
   assigned to the channel, then the test signal. */
function resolveChannel(chRow, bits, i) {
  if (!chRow) return "test";
  if (String(bits).charAt(i) === "1") return "television";
  return chRow.unit ? "machine" : "test";
}

/* THE BROADCAST IS A WALL CLOCK, NOT A PLAYLIST — carried verbatim. */
function televisionStart(tv, phaseIdx, phaseCount) {
  const len = Number(tv && tv.seconds) || 0;
  if (!len) return 0;
  const now = Math.floor(Date.now() / 1000);
  const offset = phaseCount > 1 ? Math.floor((len * phaseIdx) / phaseCount) : 0;
  return (now + offset) % len;
}

/* which of the live television channels this one is, and how many there are */
function televisionPhase(ant, bits, ch) {
  const rows = (ant && Array.isArray(ant.channels)) ? ant.channels : [];
  const live = rows.filter((r, i) => String(bits).charAt(i) === "1");
  const idx = live.findIndex(r => r.ch === ch);
  return { idx: idx < 0 ? 0 : idx, count: live.length || 1 };
}

/* THE PANEL REMEMBERS ITSELF FOR THE VISIT. sessionStorage, never local — a
   reload inside the visit keeps the switches and a new tab starts the puzzle
   again. Both ends wrapped: refused storage throws on the accessor itself. */
function panelLoad(key) {
  if (!key) return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function panelSave(key, v) {
  if (!key) return;
  try { window.sessionStorage.setItem(key, JSON.stringify(v)); } catch { /* refused */ }
}

export function useFeedControl(decl) {
  const D = decl || {};
  const banks   = useMemo(
    () => (Array.isArray(D.feed && D.feed.banks) ? D.feed.banks : []), [D.feed]);
  const dialPos = useMemo(
    () => (Array.isArray(D.dial && D.dial.positions) ? D.dial.positions : []), [D.dial]);
  const ANT     = D.antenna || null;
  const chRows  = useMemo(
    () => ((ANT && Array.isArray(ANT.channels)) ? ANT.channels : []), [ANT]);

  const REM = useMemo(() => panelLoad(D.store) || {}, [D.store]);

  /* THE FEED OPENS ON A BANK THAT ARMS. Two of the five do not (LAST STATE and
     TEST BENCH), and opening on one of those would greet a visitor with a dead
     latch on the one instrument in the wing that is actually running. Every
     clamp is against the DECLARATION rather than the stored value. */
  const initial = useCallback(() => {
    const r0 = Number(REM.bank);
    const bi = (Number.isInteger(r0) && r0 >= 0 && r0 < banks.length)
      ? r0 : Math.max(0, banks.findIndex(b => b.arms));
    const r1 = Number(REM.dial);
    const di = (Number.isInteger(r1) && r1 >= 0 && r1 < dialPos.length) ? r1 : 0;
    const n = chRows.length;
    const dflt = String((ANT && ANT.default) || "").padEnd(n, "1").slice(0, n);
    const rb = typeof REM.bits === "string" && REM.bits.length === n ? REM.bits : null;
    return { bank: bi, dial: di, bits: rb || dflt };
  }, [REM.bank, REM.dial, REM.bits, banks, dialPos, chRows.length, ANT]);

  const [bankIdx, setBankIdx] = useState(() => initial().bank);
  const [dialIdx, setDialIdx] = useState(() => initial().dial);
  const [bits, setBits] = useState(() => initial().bits);

  /* ═══ THE DECLARATION ARRIVES AFTER THE MOUNT, AND THE STATE HAS TO ADOPT IT
     ═══ THIS WAS A REAL DEFECT AND THE SERVED PAGE FOUND IT ══════════════════
     This hook is mounted by `RobotsExhibitFlow` for the whole visit, so on the
     first render there is no declaration at all — the console has not been run
     yet. `useState`'s initialiser runs ONCE, so every value was computed
     against an EMPTY declaration and then never revisited: `chRows` was `[]`,
     so `bits` initialised to `""` and stayed there.
     **MEASURED: the antenna read `0000` against a declared default of `1111`,
     so every channel resolved CAB and television could not appear at all.**
     Pressing RUN landed on the test signal where it should have landed on
     television. The strip worked; what it opened was wrong.
     THE FIX IS THE DOCUMENTED "ADJUST STATE WHEN A PROP CHANGES" PATTERN —
     during render, comparing identities — rather than an effect. An effect
     would be `react-hooks/set-state-in-effect`, which is the rule that already
     cost this round one correction, and it would also paint one frame of the
     wrong routing before fixing itself. */
  const [seen, setSeen] = useState(decl);
  if (seen !== decl) {
    const init = initial();
    setSeen(decl);
    setBankIdx(init.bank);
    setDialIdx(init.dial);
    setBits(init.bits);
  }

  useEffect(() => {
    panelSave(D.store, { bank: bankIdx, dial: dialIdx, bits });
  }, [D.store, bankIdx, dialIdx, bits]);

  const bank = banks[bankIdx] || {};
  const dial = dialPos[dialIdx] || {};

  /* ═══ [2026-08-27] WHICH CHANNEL THE FEED BRINGS UP ════════════════════════
     MIKE: **"You do not change channels, as there are none. The channels are
     inherent to the feed, not the bare terminal program."**

     THE HOLE HIS RULING CLOSES, MEASURED ON THE SERVED PAGE BEFORE ANY OF THIS
     WAS WRITTEN. The latch opened channel 1 and the four digits on the picture
     picked from there — his own 2026-08-21 design, *"The LATCH launches it, on
     channel 1. The four channel buttons pick which of four inputs shows."* But
     the aerial's declared default is `1111`, so **all four channels resolved to
     television** and pressing `3` lit the `3` and changed nothing a visitor
     could see. The strip was faithful to the ruling and the ruling had no
     channel behind any of the four buttons.

     **SO THE ROUTING IS THE SELECTION, AND THAT IS THE DECLARATION'S OWN
     SENTENCE RATHER THAN A NEW RULE.** `portal.js` says of the default: *"DEFAULT
     `1111` - every channel taken, nothing listening."* A `1` is ANT and a `0` is
     CAB, and CAB is the hardwired input — so switching a position to `0` is the
     visitor putting the set on THAT input. Nothing listening is the broadcast;
     one listening is the one you get. **The puzzle is untouched and is now the
     thing that pays**: QC_101 says `BROADCASTS ON ......... FEED NO. 3`, the
     visitor switches 3 to CAB, and the machine is what RUN opens.

     THE LOWEST-NUMBERED CAB POSITION WINS WHEN THERE ARE SEVERAL, and that is
     stated rather than hidden because it is the one part of this a visitor
     cannot read off the glass. A set has one output; two hardwired inputs
     selected at once is not a state the fiction has a picture for, so the feed
     takes them in order.

     `resolveChannel` IS UNTOUCHED AND STILL DECIDES WHAT A CHANNEL CARRIES.
     This decides WHICH channel; that decides WHAT IT IS. Two questions, still
     one answer each, still one place each. */
  const feedChannel = useMemo(() => {
    if (!chRows.length) return 1;
    const i = chRows.findIndex((r, k) => String(bits).charAt(k) === "0");
    return i < 0 ? chRows[0].ch : chRows[i].ch;
  }, [chRows, bits]);

  /* [Ruling 25] NO LOCK. A patch panel arms when it is LIVE, and when the bank
     it is showing is one this volume will start. */
  const armed = !!bank.arms && !!dial.arms;

  const stepBank = useCallback((d) => {
    const n = Math.max(banks.length, 1);
    setBankIdx(i => (i + d + n) % n);
  }, [banks.length]);
  const stepDial = useCallback(() => {
    setDialIdx(i => (i + 1) % Math.max(dialPos.length, 1));
  }, [dialPos.length]);
  const flipBit = useCallback((i) => {
    setBits(v => v.slice(0, i) + (v.charAt(i) === "1" ? "0" : "1") + v.slice(i + 1));
  }, []);

  /* ═══ ONE RESOLVER, AND THE LATCH IS NOW ITS ONLY CALLER ═══════════════════
     MIKE, 2026-08-21: **the LATCH launches it, on channel 1** — and the four
     buttons on the screen pick which of the four inputs shows after that.
     **[2026-08-27] THE SECOND HALF OF THAT IS RULED AWAY** — *"You do not
     change channels, as there are none"* — so the four buttons are gone and
     `feedChannel` above says which channel the latch launches. There is still
     exactly one place that decides what a channel carries and exactly one
     payload shape leaving it; there is now one caller instead of two, and a
     second resolver on the overlay side is still the thing this prevents.
     `chList` LEFT THE PAYLOAD WITH THE STRIP THAT READ IT. Nothing else ever
     did, and a field carried for a deleted reader is the next round's puzzle.
     [2026-08-26] `note` IS GONE FROM THE PAYLOAD. Mike: **"KILL all messages
     RE: signal present or not - unless I prescribed it."** The register classed
     both readouts HOUSE — *"Ops' own words"* — so `ANT.says` and the `.ps-note`
     it fed are struck rather than restyled. `PortalScreen` already drew nothing
     for an empty string, so what goes away is the element, not a blank line. */
  const openChannel = useCallback((ch) => {
    if (!armed) return;
    const i = chRows.findIndex(r => r.ch === ch);
    if (i < 0) return;
    const row = chRows[i];
    const kind = resolveChannel(row, bits, i);
    const L = D.latch || {};
    const ev = L.event || "wb-robots-open-twin";
    const base = { ch, chList: chRows.map(r => r.ch), bezel: L.bezel || null };
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
    window.dispatchEvent(new CustomEvent(ev, { detail: { ...base,
      preset: bank.id,
      src: row.src || L.src,
      picture: !!row.picture,
      /* [2026-08-27] the channel's own PLATE, carried like `picture` and
         `bezel` before it: data on the row, forwarded untouched, and nothing
         downstream learns what a channel is. Channel 4 declares `closeup` and
         channel 3 declares nothing, which is the whole of the difference
         between Mike's two photographs of one machine. */
      view: row.view || null,
      /* a plate cut on the bezel's own canvas is REGISTERED with the opening
         rather than fitted to it, so it must not be enlarged. Data on the row,
         like `view` and `picture` before it. */
      exact: !!row.exact,
      frameTitle: row.frameTitle || L.frameTitle } }));
  }, [armed, chRows, bits, D.latch, ANT, bank.id]);

  /* ═══ THE STRIP ASKS HERE, AND THIS IS WHY THE ORIGINAL DEFECT IS CLOSED ══
     The listener is registered by whoever owns this hook. `RobotsExhibitFlow`
     owns it and owns the overlay, so it is mounted for as long as any channel
     can be on screen — which the panel component never was, and which is the
     whole finding at the head of this file.

     ═══ [2026-08-27] IT WENT AND CAME BACK IN ONE DAY. BOTH RULINGS ARE HIS ══
     It was deleted on **"You do not change channels, as there are none. The
     channels are inherent to the feed, not the bare terminal program."** He
     then found himself **stuck on television with no way to change channel**,
     and scoped it: *there are no channels* was about **the bare terminal**, not
     about the set.

     **NOTHING ABOUT THE FIRST RULING IS UNDONE.** `feedChannel` above still
     decides which channel the feed brings up, the aerial is still the
     selection, and TERMINAL.EXE still carries no digits. What came back is the
     strip on the surfaces that have channels — which is what his correction
     says and no more.

     **THE ROUND TRIP COST ONE LINE EACH WAY, AND THAT IS THE ARGUMENT FOR
     DELETING BOTH ENDS TOGETHER RATHER THAN LEAVING A DEAD LISTENER.** A dead
     listener would have made this restoration invisible in the diff — the strip
     would simply have started working again, with nothing recording that a
     ruling had moved. */
  useEffect(() => {
    function onSel(e) {
      const ch = e && e.detail && e.detail.ch;
      if (typeof ch === "number") openChannel(ch);
    }
    window.addEventListener("wb-portal-select-channel", onSel);
    return () => window.removeEventListener("wb-portal-select-channel", onSel);
  }, [openChannel]);

  return { banks, bankIdx, bank, dialPos, dialIdx, dial, bits, chRows, armed,
           feedChannel, stepBank, stepDial, flipBit, openChannel };
}
