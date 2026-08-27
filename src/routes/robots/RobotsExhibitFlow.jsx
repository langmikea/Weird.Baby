import { useState, useEffect, useRef, useCallback } from "react";
import { T as MUSEUM } from "../../styles/tokens.js";
/* [2026-08-21] the drawn channel. Mounted on the payload's `kind`, the way
   `InstrumentPanel` and the Foundation's objects are mounted on a field: this
   file learns one more shape and no other wing can notice. */
import TestSignal from "./TestSignal.jsx";
import Television from "./Television.jsx";
import PortalConsole from "./PortalConsole.jsx";
import { useFeedControl } from "./feed-control.js";
import PortalScreen from "./PortalScreen.jsx";

/* gap before the tear (ms), then how tall it is (vh) and how far the picture
   slips (px). Walked in order, wrapping - a script, not a shuffle.
   [2026-08-26] HOISTED OUT OF THE COMPONENT, and not for tidiness: declared in
   the render body they were a fresh array every render, so the effect that
   walks them could not honestly list them as dependencies and the warning had
   to be silenced. **A suppressed warning is not a fixed one** - and silencing
   it would have moved this file's lint count while changing nothing, which is
   the tripwire-disabling failure CLAUDE.md's own baseline note describes. They
   are constants; at module scope the deps are satisfiable and the disable is
   gone. */
const TEAR_SCRIPT = [
  { after: 26000, h: 2.4, slip:  7 },
  { after: 41000, h: 1.1, slip: -4 },
  { after: 33000, h: 3.6, slip: 11 },
  { after: 57000, h: 1.7, slip: -6 },
];
const TEAR_MS = 130;                 /* one or two frames of a real rip */

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
     ═══ [2026-08-27] READ THIS FIRST: THE SPAN IS REVERSED, BY MIKE ═════════
     **"Tears must only happen on the Monitor Screen (not bezel, background,
     etc)"**

     **THIS IS A REVERSAL AND NOT A CORRECTION**, and the paragraph it reverses
     is left standing directly below because its argument is the thing that was
     overruled — deleting it would leave a later round free to rebuild the
     view-wide rip from the same reasoning and think it was finishing something.

     WHAT THE OLD RULE CLAIMED, AND IT IS NOT REFUTED: a rip that crosses the
     ground and the portal together is the only way to show that both are one
     surface, so a rip confined to the picture proves nothing. **Mike has ruled
     that the museum does not make that argument this way.** The canon that the
     whole view is itself a screen is HIS and is untouched; what he has ruled on
     is whether the tear is its evidence.

     WHERE IT LIVES NOW: `.ps-tear`, inside `PortalScreen`'s feed box, drawn as
     a sibling of the slip and cropped by the opening — the same crop the
     picture gets, by the same mechanism, with nothing added to enforce it.
     Its height reads as a share of the PICTURE rather than of the window.
     **The two clocks below are untouched**, and so is every number in
     `TEAR_SCRIPT`.

     ═══ THE ORIGINAL RULE, OVERRULED 2026-08-27, KEPT FOR ITS ARGUMENT ══════
     Mike's canon: the whole portal view is ITSELF a screen, and the portal is
     a screen ON it. The evidence-in-fiction is a tear that rips through
     EVERYTHING AT ONCE - background and portal together - because a tear can
     only cross both if both are the same surface.
     SO IT IS DRAWN HERE, ABOVE THE IFRAME, AND NOT INSIDE THE TWIN. A tear
     inside the twin could only ever cross the twin; it would prove the
     opposite of what it is there to prove. One element spanning the whole
     view is the only honest place for it.
     [The two paragraphs above no longer describe the build. The half that
     still does is the second one's REASON for not putting the tear inside
     `twin.html`: it is still drawn by the museum and not by the machine, so a
     tear crosses whatever the channel is carrying — television, the test card,
     the photograph — rather than only the one channel that is a document.]
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

  /* ═══ [2026-08-26] THE FEED CONTROL IS OWNED HERE, AND THAT IS THE FIX ═════
     MIKE: **"BIG CHANGE: Move the FUNCTIONALITY of the feed panel to the
     MONITOR"** — and **"TV - I cannot change channels!"**, which was the same
     problem seen from the other end.

     THE DEFECT, MEASURED: `wb-portal-select-channel` used to be answered inside
     the panel COMPONENT. Reached through the album page that worked, because
     the face stayed mounted behind the overlay. Reached through TERMINAL.EXE it did
     not: the console IS the overlay's content, so latching replaced it and the
     `.ip` count went 1 -> 0 at the same instant the digit strip appeared.
     **The strip's only listener was destroyed by the act that showed the strip.**

     This component owns the overlay and is mounted for the whole visit to the
     wing, so the state cannot be replaced out from under the strip any more.
     `useFeedControl` registers the listener; nothing else does.

     IT READS THE DECLARATION OFF THE OPEN CONSOLE AND FALLS BACK TO NULL. The
     Portal album is a dynamic chunk, so this public component must not name it;
     the declaration arrives on the event, exactly as `bezel` and `boot` do.

     AND THE DECLARATION IS ITS OWN STATE, WHICH IS NOT TIDINESS. Reading it
     off `twin` directly was the first cut and it was wrong in exactly the way
     the defect was: latching from the console REPLACES `twin` with a television
     that carries no `panel`, so the hook would lose its declaration — and its
     bank, its bits and its resolver — at the same instant the digit strip
     appeared. It is set when a console opens and held for the visit. */
  const [feedDecl, setFeedDecl] = useState(null);
  const feed = useFeedControl(feedDecl);

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
  /* ═══ [2026-08-27] TERMINAL.EXE DOES NOT VANISH — IT SHUTS DOWN ═══════════
     MIKE: **"X RUNS A VISIBLE CLEAN SHUTDOWN — quick, but it happens — then
     lands back on the ALBUM."**

     So the way out has two shapes and the surface decides which. A television
     and a machine are PICTURES: turning the set off is instantaneous and
     nothing is owed. TERMINAL.EXE is a PROGRAM the visitor started from a
     filename, and a program that disappears mid-word has crashed. **The
     shutdown is the difference between closing a window and ending a run.**

     `consoleOpen` IS A REF AND NOT STATE, and that is load-bearing rather than
     an optimisation: the control listener above is registered once and reads
     this on every press. As state it would need to be a dependency, the
     listener would be torn down and rebuilt on every open, and a press landing
     in that gap is a dropped input on the one surface where every press is the
     interface. */
  /* ═══ [2026-08-27] THE MACHINE OUTLIVES THE CHANNEL ══════════════════════
     `machineSrc` is remembered the first time a machine channel opens and is
     NOT cleared when another channel shows, which is what keeps one document
     alive across every switch. It changes only when the PRESET changes, and
     that reload is deliberate — see the note at the element.
     `showingMachine` decides whether it is the picture or is covered by one. */
  const [machine, setMachine] = useState(null);   /* { src, title } | null */
  const machineSrc = machine && machine.src;
  const machineTitle = (machine && machine.title) || "";
  const showingMachine = !!(twin && (twin.kind === "machine" || twin.kind === "picture"));

  /* THE VIEW IS A MESSAGE, NOT AN ADDRESS. Which of Mike's two plates the
     machine is wearing is a runtime state of a running unit — the camera moved,
     the machine did not restart — so it is posted to the live document instead
     of being put in its URL where it would force a load. `twin.html` answers
     it by swapping `.monimg`'s src and toggling one class; nothing it does
     touches the emulator.
     IT ALSO FIRES ON MOUNT, because the first open has to establish the view
     even though the initial `?view=` already did: the frame may have been built
     for channel 3 and the visitor's first press may be 4. Posting the same
     value twice is a no-op at the other end. */
  useEffect(() => {
    if (!machineSrc) return undefined;
    const w = twinFrameRef.current && twinFrameRef.current.contentWindow;
    if (!w) return undefined;
    const view = (twin && twin.view) || "";
    try { w.postMessage({ wb: "portal-view", view }, "*"); } catch { /* gone */ }
    return undefined;
  }, [machineSrc, twin]);

  /* ═══ [2026-08-27] HEARD ONLY ON THE CHANNEL IT IS ON ═════════════════════
     MIKE: **"Sound from VIIIp is heard when on non-VIIIp channels. Fix pls."**

     **THE RUNNING IS NOT UNDONE AND MUST NOT BE.** He asked for one live unit
     that does not reboot when he looks away, and the frame therefore stays
     mounted for the whole visit — see the note at the element. What was wrong
     is that a machine nobody is watching was still audible over the television.
     **Covered is not off.** This mutes the OUTPUT and touches no clock: the
     emulator, the OLED buffers and every timer in that document carry on, which
     is the whole of what "running continuously" was worth.

     IT IS A MESSAGE FOR THE SAME REASON `portal-view` IS. A running machine is
     told things; it is not re-addressed. `twin.html` answers by suspending its
     three audio contexts and muting the DFPlayer's element — the reasoning and
     the list of voices are at `portalAudioOff` in that file.

     IT ALSO FIRES ON MOUNT, and it must: the machine is built the moment a
     machine channel first opens, and the visitor's next press may be
     television. Sending the same value twice is a no-op at the other end. */
  useEffect(() => {
    if (!machineSrc) return undefined;
    const w = twinFrameRef.current && twinFrameRef.current.contentWindow;
    if (!w) return undefined;
    try { w.postMessage({ wb: "portal-audio", on: showingMachine }, "*"); }
    catch { /* the frame is gone; nothing to silence */ }
    return undefined;
  }, [machineSrc, showingMachine]);

  /* ═══ [2026-08-27] THE CONTROLS RIDE THE PICTURE — T7, ONE LAYER OUT ══════
     MIKE, 2026-07-29: **"the stutter glitch moves everything EXCEPT the control
     panel - the control panel must move WITH the glitch (the controls are part
     of the feed; only the bezel is the real world)."** He raised it again on
     2026-08-27 about both machine channels.

     **IT IS HIS OWN T7 DEFECT, REINTRODUCED BY A MIGRATION.** T7's fix was
     structural: `#feedgroup` in `twin.html` was made to hold the picture, both
     glass apertures, the chyron and the snow plane, so every glitch moved one
     element and nothing could be left behind. **Then the chyron moved OUT of
     the twin and into the museum** on 2026-08-26 — the bezel and the buttons
     belong to the Portal — and the controls became siblings of the moving group
     again, which is exactly the state T7 was written to end.

     THE MUSEUM CANNOT SEE INSIDE THE FRAME, so the twin reports its own
     displacement: `{wb:"portal-jit", dx, dy}` on every bump, roll and machine
     jitter, and `0,0` when it settles. The two sources compose here — the
     twin's glitch and the museum's own tear slip — and `PortalScreen` applies
     the sum to both control groups. One number in, and the groups ride whatever
     the picture rides. */
  const [jit, setJit] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function onJit(e) {
      if (!e || !e.data || e.data.wb !== "portal-jit") return;
      const x = Number(e.data.dx) || 0, y = Number(e.data.dy) || 0;
      setJit(p => (p.x === x && p.y === y ? p : { x, y }));
    }
    window.addEventListener("message", onJit);
    return () => window.removeEventListener("message", onJit);
  }, []);
  /* a channel with no machine on it cannot be jittering; clear it so a stale
     offset cannot outlive the picture that caused it. */
  useEffect(() => {
    if (!showingMachine) setJit(p => (p.x === 0 && p.y === 0 ? p : { x: 0, y: 0 }));
  }, [showingMachine]);

  /* ═══ [2026-08-27] BETWEEN TWO CHANNELS THERE IS SNOW ════════════════════
     MIKE: **"When changing channels go to noise instead of black during the
     transition."**

     WHAT HE WAS SEEING, AND WHY IT IS TWO DIFFERENT WAITS. Switching to the
     machine or the test card is instant — the machine has been mounted the
     whole visit and the card is drawn — so the black there is one or two
     frames of an empty box. **Television is not instant**: a player has to be
     built and has to join a video mid-broadcast, and that is seconds, not
     frames. A fixed burst would have covered the first case and left the
     second doing exactly what he reported.

     SO IT IS A FLOOR AND A CEILING RATHER THAN A DURATION. The snow is up for
     at least `SNOW_MIN` on every channel change, and on television it stays up
     until the set is actually PLAYING — `Television` says so — or until
     `SNOW_MAX`, whichever comes first. **The ceiling is not a guess about
     speed; it is the refusal path.** A browser that blocks autoplay may never
     reach PLAYING at all, and snow for ever is a worse defect than the black
     it replaced.

     IT IS KEYED ON THE CHANNEL AND ON THE KIND, not on the payload identity. A
     press that lands on the channel already showing is not a transition and
     must not flash — and re-tuning the same television channel IS one, because
     the player is rebuilt. */
  const SNOW_MIN = 380, SNOW_MAX = 4000;
  const twinKind = twin && twin.kind;
  const twinCh = twin && twin.ch;
  const [snowFloor, setSnowFloor] = useState(false);
  const [tvSettled, setTvSettled] = useState(false);
  useEffect(() => {
    if (!twinOpen) { setSnowFloor(false); setTvSettled(false); return undefined; }
    setSnowFloor(true);
    setTvSettled(false);
    const a = setTimeout(() => setSnowFloor(false), SNOW_MIN);
    const b = setTimeout(() => setTvSettled(true), SNOW_MAX);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [twinOpen, twinKind, twinCh]);
  const snow = !!(twinOpen
                  && (snowFloor || (twinKind === "television" && !tvSettled)));

  const consoleOpen = useRef(false);
  const [halting, setHalting] = useState(false);
  useEffect(() => {
    consoleOpen.current = !!(twinOpen && twin && twin.kind === "console");
    if (!twinOpen) { setHalting(false); setMachine(null); }
  }, [twinOpen, twin]);

  function closeTwin() {
    if (consoleOpen.current) { setHalting(true); return; }
    setTwinOpen(false);
  }
  /* the terminal calls this when its halt has finished printing. It closes the
     overlay, which lands the visitor back on the album — his words. */
  function consoleHalted() {
    setHalting(false);
    setTwinOpen(false);
  }

  /* ═══ [2026-08-26] TWO TEARS, AND WHY THE SECOND DOES NOT COST THE FIRST ═══
     MIKE RULED BOTH: **"A: rare on its own, plus on demand."** CLICK now tears
     as well, and the scripted tear keeps its rarity.

     THE OBJECTION THIS ANSWERS IS OPS' OWN, AND IT WAS RIGHT: *"a tear that
     happens often is a texture."* A visitor can press CLICK as fast as they
     like, so if the two shared a clock the commanded rips would eat the
     scripted one's whole argument.

     **THEY ARE TWO OBJECTS DOING TWO JOBS, AND ONLY ONE OF THEM IS EVIDENCE.**
     The scripted tear is UNBIDDEN - it is the canon's proof that the whole view
     is one surface, and it only proves that because nobody asked for it. The
     commanded tear proves something else entirely: that the control on the
     glass does something. A press cannot make an unbidden event less unbidden,
     so the rarity that carries the meaning is untouched by any number of
     presses.

     **SO THE CLOCKS ARE SEPARATE AND NEITHER FEEDS THE OTHER.** A press does
     NOT advance `i`, does NOT reset `t1`, and does NOT consume a step. The
     script runs on its own timer exactly as it did, whether the visitor presses
     nothing or presses fifty times. If every scripted rip in a visit happens to
     land while the visitor is pressing, the script has still fired four times in
     four minutes and the presses have still fired on demand - the two counts are
     independent by construction rather than by tuning.

     **AND THE PRESSES STAY DETERMINISTIC, per the glitch-realism law.** No
     `Math.random` here either: a press walks the SAME four-step vocabulary of
     rips through its own index, so a commanded tear and a scripted one are the
     same kind of object and cannot be told apart by their shape - which is the
     point. Same session, same sequence.

     THE GUARD IS A TOKEN, not a boolean. Two rips can overlap - a press during
     a scripted tear is the ordinary case - and without it the first one's
     clear-timeout would end the second one early. Each fire claims the token;
     only the claimant clears. */
  const tearTok = useRef(0);
  const tearPress = useRef(0);
  const fireTear = useCallback((step, y) => {
    const tok = ++tearTok.current;
    setTear({ y, h: step.h, slip: step.slip });
    setTimeout(() => {
      if (tearTok.current === tok) setTear(null);
    }, TEAR_MS);
  }, []);

  useEffect(() => {
    if (!twinOpen) { setTear(null); tearPress.current = 0; return undefined; }
    let i = 0, alive = true, t1, t2;
    function schedule() {
      const step = TEAR_SCRIPT[i % TEAR_SCRIPT.length];
      t1 = setTimeout(() => {
        if (!alive) return;
        /* the y position walks too, so the rip does not always land in the
           same place - still scripted, still no randomness. */
        const y = 12 + ((i * 37) % 74);
        fireTear(step, y);
        t2 = setTimeout(() => { if (alive) { i++; schedule(); } }, TEAR_MS);
      }, step.after);
    }
    schedule();
    return () => { alive = false; clearTimeout(t1); clearTimeout(t2); };
  }, [twinOpen, fireTear]);

  /* ═══ [2026-08-26] THE FOUR MACHINE CONTROLS, AND WHAT THEY DO ON A CHANNEL
         WITH NO MACHINE ON IT ══════════════════════════════════════════════
     MIKE: **CH3's surface is the target for all four channels** — the same
     SCROLL, CLICK, POWER, SHAKE and channel strip on every one. So the 2x2 is
     drawn by `PortalScreen` now, over television and the test signal and the
     photograph as well, and `twin.html` suppresses its own `#monctl` exactly as
     it already suppressed its own digit strip. The button asks and stops; this
     answers — the same shape the channel strip has used since August.

     ═══ SCROLL IS IGNORED ON THREE CHANNELS OF FOUR, AND THE IGNORING IS THE
         RULING — IT IS NOT AN UNFINISHED BRANCH ══════════════════════════════
     MIKE, 2026-08-26, after review: **"scroll only does what it was originally
     designed to do, and in all other instances is ignored."**

     `devRotary` is MGK-VIIIp's ROTARY_DIAL — a real input device in the
     emulated `5_INPUT.ino`, edge-queued at depth 1, drained into
     `Device_Manager` with `PlaySound(Scroll)`. It navigates the machine's
     menus. **It was proposed that SCROLL should change channels and that
     proposal was withdrawn**, because it would have given one control two
     meanings depending on what was on the glass — which is the exact fault
     `docs/MUSEUM_PORTAL_CHANNEL_SELECTOR-20260821.md` §3 names: *"the same
     class of thing that made a `1` read as a channel this week."* Channels stay
     on the channel strip, where they have always been.

     **SO A LATER ROUND MUST NOT WIRE THIS UP.** A control that reaches nothing
     reads like a `TODO` and it is not one: on a channel carrying television
     there is no rotary dial to turn, and the honest thing for a dial to do is
     nothing. The dial stays the dial.

     ═══ CLICK IS THE ONE THAT ALWAYS DOES SOMETHING ══════════════════════════
     It stays the machine's SHUTTER where there is a machine — nothing was taken
     away from CH3 — and it tears on every channel, because the tear belongs to
     the whole view rather than to what is on it. See the H-TEAR block above for
     why a commanded tear does not cost the scripted one its point.
     THE TEAR FIRES FIRST AND UNCONDITIONALLY, before the forward: the forward
     can find no window and return, and the rip is not the machine's to refuse.

     ═══ THE FORWARD IS THE CONTRACT, NOT A REACH-IN ══════════════════════════
     `postMessage` to the twin's own window, `{wb:"portal-control", id}`, which
     `twin.html` maps onto the four global handlers and nothing else. It is the
     mirror of `portal-close` and it carries no code across the boundary — the
     standing constraint on that document is single-file, no-network, and it
     must work with no museum at all. A twin that has not finished loading has
     no listener yet, which is a dropped press and not an error: the machine
     refuses input while it boots anyway (`[X1]`). */
  const twinFrameRef = useRef(null);
  /* ═══ [2026-08-27] SCROLL AND CLICK REACH TERMINAL.EXE TOO, AND THAT IS THE
         SAME CONTROL DOING THE SAME JOB ═════════════════════════════════════
     MIKE: **"In the spirit of the VIIIp it should simply be scroll and click.
     Scrolling takes you to the next changeable field and click changes it."**

     **THE "SCROLL IS IGNORED" RULING IS NOT BROKEN BY THIS — IT IS SPENT.** Its
     wording was *"scroll only does what it was originally designed to do, and
     in all other instances is ignored"*, and the fault it was avoiding was one
     control meaning two things depending on what is on the glass. It does not
     mean two things now: the rotary dial moves a selection and a press takes
     it, on the machine and on the terminal alike. What HAS gone is the case the
     ruling was written for — television and the test signal do not draw SCROLL
     at all any more, so there is no longer a surface on which it reaches
     nothing. **A control that is absent cannot read as an unfinished one.**

     THE FORWARD IS UNCHANGED FOR THE MACHINE: `postMessage` to the twin's own
     window, `{wb:"portal-control", id}`, carrying no code across a boundary
     whose document must work with no museum at all.

     **CLICK TEARS WHERE IT IS THE SHUTTER, AND NOT ON THE TERMINAL.** On
     channel 3 CLICK is MGK-VIIIp's shutter and the rip is what proves the
     control on the glass did something. On TERMINAL.EXE the press visibly
     changes a field, so it proves itself — and a rip on every field change
     would be the texture the H-TEAR block exists to prevent. **The scripted
     tear is untouched on every surface**, which is the half that carries the
     meaning. */
  useEffect(() => {
    function onCtl(e) {
      const id = e && e.detail && e.detail.id;
      if (!id) return;
      if (consoleOpen.current) {
        /* the terminal's own two inputs. It owns its cursor; this only says
           which of the two was pressed. */
        window.dispatchEvent(new CustomEvent("wb-portal-console-input",
          { detail: { id } }));
        return;
      }
      if (id === "click") {
        const step = TEAR_SCRIPT[tearPress.current % TEAR_SCRIPT.length];
        const y = 12 + ((tearPress.current * 29) % 74);
        tearPress.current += 1;
        fireTear(step, y);
      }
      const w = twinFrameRef.current && twinFrameRef.current.contentWindow;
      if (!w) return;                    /* no machine on this channel: ignored */
      try { w.postMessage({ wb: "portal-control", id }, "*"); } catch { /* gone */ }
    }
    window.addEventListener("wb-portal-machine-control", onCtl);
    return () => window.removeEventListener("wb-portal-machine-control", onCtl);
  }, [fireTear]);

  /* [2026-08-27] THE POWER MIRROR IS GONE WITH THE CONTROL IT FED. Mike:
     **"POWER COMES OFF the VIIIp's control surface."** `unitOn`, the
     `wb-portal-power` listener and the clear-on-channel-change effect all
     existed to keep one slug honest, and there is no slug.
     **`twin.html` STILL POSTS `{wb:"portal-power"}`** from `Mon_Power_Sync` on
     its 200ms chrome tick, into a room with no listener. It is left posting:
     that document is single-file by a standing constraint and must work with no
     museum at all, so its own chrome sync is not the museum's to remove.
     **Named here because an event with no receiver is exactly what cost the B7
     round a real minute** — this one is deliberate and this sentence is the
     receipt.
     AND THE MACHINE IS STILL ON WITHOUT IT — measured before the cut, on the
     served page: `unitPowered=true` inside the frame with POWER never pressed,
     because every arming bank carries `power:"on"`. `PortalScreen.jsx`'s
     `MON_CTL` note carries both readings. */

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
  /* [2026-08-21] THE DOOR OPENS ONTO THREE KINDS NOW, AND THE SEAM IS
     UNCHANGED. The antenna selector made a channel resolve to television or to
     a test signal as well as to a machine, and all three arrive on the same
     event with the same one rule: the panel says what to open and this listener
     knows nothing about why.
       `kind: "test"`        — no address at all, because the signal is DRAWN.
                               A src would be a page that does not exist.
       `kind: "television"`  — an id and a second to join at. The channel is
                               DRIVEN through the museum's one player hook
                               rather than addressed, so there is no URL here
                               either. The twin's own contract is untouched.
     THE ORDER MATTERS: `kind` is tested before the `!d.src` guard, or a drawn
     channel would be refused for having no address — which is the thing that
     makes it drawn. */
  useEffect(() => {
    function open(e) {
      const d = (e && e.detail) || {};
      /* [2026-08-21] THE SCREEN'S OWN FIELDS RIDE EVERY KIND. `bezel`, `ch`
         and `note` describe the SET, not what is on it, so they are read off
         the detail before the kinds diverge and are the same lines for all of
         them. The engine still learns nothing: a frame declaration, a number
         and a string it prints.
         [2026-08-27] `chList` LEFT AND CAME BACK THE SAME DAY, AND THE ROUND
         TRIP IS WORTH ONE SENTENCE. It went when the four digits did, on
         *"You do not change channels, as there are none"*; it is back because
         Mike scoped that ruling to **the bare terminal** once he found himself
         with no way to change channel on the television. **The field is not
         restored on a guess — the strip that reads it is on the glass again.**
         `ch` never left: it is which channel is open, which is mechanism state
         the set genuinely has whether or not anything draws a digit. */
      const screen = { bezel: d.bezel || null, ch: d.ch,
                       chList: d.chList, note: d.note || "",
                       };
      if (d.kind === "test") {
        setTwin({ ...screen, kind: "test", title: d.frameTitle || "" });
        setTwinOpen(true);
        return;
      }
      /* ═══ [2026-08-26] TERMINAL.EXE — `kind: "console"`, AND IT IS DRAWN ═══
         MIKE: **"Instead of the feed panel, I want to put the controls of the
         feed panel on a Portal screen."** So this kind carries no address, for
         the same reason `test` carries none: what it opens is DRAWN, and a
         `src` would be a page that does not exist.
         **IT IS TESTED ABOVE THE `!d.src` GUARD** — the same ordering note the
         block above already states for `test` and `television`, and the same
         reason: a drawn kind refused for having no address would be refused
         for the thing that makes it drawn.
         `boot` and `panel` ride the detail exactly as `ytId` and `src` do. The
         listener still learns nothing: an array of strings it forwards and a
         declaration it forwards. */
      if (d.kind === "console") {
        if (d.panel) setFeedDecl(d.panel);
        setTwin({ ...screen, kind: "console", boot: d.boot, halt: d.halt,
                  panel: d.panel, title: d.frameTitle || "" });
        setTwinOpen(true);
        return;
      }
      if (d.kind === "television") {
        setTwin({ ...screen, kind: "television", ytId: d.ytId,
                  startSeconds: d.startSeconds, title: d.frameTitle || "" });
        setTwinOpen(true);
        return;
      }
      if (!d.src) return;                 /* [H1] no address, no door */
      /* [2026-08-26] A PICTURE IS AN `<img>`, AND IT IS TESTED BEFORE THE
         QUERY STRING FOR THE SAME REASON `kind` IS TESTED BEFORE THE `!d.src`
         GUARD: the preset and `user=1` are a contract with a DOCUMENT, and
         hanging them off a PNG addresses nothing. The channel declares this
         (`picture: true` in portal.js); this listener still knows nothing about
         what a channel is. */
      if (d.picture) {
        setTwin({ ...screen, kind: "picture", src: d.src,
                  title: d.frameTitle || "" });
        setTwinOpen(true);
        return;
      }
      const q = new URLSearchParams({ user: "1" });
      if (d.preset) q.set("preset", String(d.preset));
      if (d.day) q.set("day", String(d.day));
      /* [2026-08-27] THE VIEW IS NOT IN THE ADDRESS ANY MORE, AND THAT IS
         WHAT STOPS THE REBOOT. It was `q.set("view", ...)` here, which made
         channel 4's src differ from channel 3's by one parameter — and a
         changed `src` is a document load. Mike: **"Changing channels should not
         cause a VIIIp reboot."** The view is posted to the live machine instead
         (`portal-view`, above), and the address below is a function of the
         PRESET alone so a channel change cannot move it.
         `d.view` still rides the payload and is read by the poster; only its
         route changed, from the URL to a message. */
      /* [2026-08-26] this branch names itself `machine` now. It was the only
         one carrying no `kind` at all, which read as "the default" and is not:
         it is the one kind that is a live DOCUMENT, and the four machine
         controls are forwarded to it and to nothing else. A kind that has to be
         recognised by the absence of a field is a kind nobody can grep for. */
      const src = `${d.src}?${q.toString()}`;
      /* the machine is remembered here and never cleared — see the element. A
         preset change gives a different `src`, which is the one case that is
         meant to reload. */
      setMachine(m => (m && m.src === src ? m
        : { src, title: d.frameTitle || "" }));
      setTwin({ ...screen, kind: "machine", view: d.view || "",
                exact: !!d.exact,
                title: d.frameTitle || "" });
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
          {/* [2026-08-21] A DRAWN CHANNEL IS A NODE, NOT AN IFRAME. Everything
              else about the overlay is untouched — same ground, same inset 0,
              same deliberate absence of chrome (P1/S4), same Escape (W2).
              [2026-08-26] THE SECOND HALF OF THIS NOTE WAS STALE AND IS STRUCK.
              It said the way out of a drawn channel is Escape *"exactly as it
              already is for channel 4's photograph, which has carried no [X]
              since CH4"*. Untrue since the strip became the museum's: [X] is
              drawn on every kind, channel 4 included. `Television.css`'s header
              carried the same stale sentence and is corrected with it. */}
          {/* [2026-08-21] THE SET IS ONE OBJECT; ONLY THE PICTURE SWAPS.
              The three kinds stay mutually exclusive — that is what keeps a
              television from having two outputs — but the BEZEL and the
              CHANNEL BUTTONS are outside the ternary now, because they belong
              to the Portal and not to whichever of the three is showing.
              MIKE: "the screen is a television set; its frame and its buttons
              do not disappear because of what is on it." */}
          <div style={S.iframe}>
            {/* [2026-08-26] THE SLIP MOVED OFF THE `<iframe>` AND ONTO THE
                SCREEN, because it was only ever reaching one kind of picture.
                The band already spanned the whole view as the canon requires,
                but the transform sat on the iframe alone — so on television and
                the test signal the rip drew and NOTHING MOVED UNDER IT, which
                reads as a bar laid on a still rather than as a seam. Mike's
                ruling that CH3's surface is the target for all four channels
                covers this too. `PortalScreen` takes a number and applies it;
                it still knows nothing about tears. */}
            <PortalScreen bezel={twin && twin.bezel}
                          note={twin && twin.note}
                          /* [2026-08-26] THE CONSOLE JOINS THE FEED PLACEMENT,
                             AND IT IS A CORRECTION MADE ON A MEASUREMENT. On
                             `canvas` its box is 3200 canvas units wide against
                             the opening's 2539, so the hole is inset 98px a
                             side at the served size and the boot's first
                             characters drew UNDER THE BEZEL — measured, 46.3px
                             of every line hidden and the top line 20.3px high.
                             The feed rect is the opening's own rect and insets
                             by 87 units instead. It is the same placement the
                             test card takes, and for the same reason: a DRAWN
                             signal has no opinion about the canvas. */
                          place={(twin && (twin.kind === "test"
                                        || twin.kind === "console"
                                        || twin.kind === "television"))
                                 ? "feed" : "canvas"}
                          slip={tear ? tear.slip : 0}
                          /* [2026-08-27] THE RIP GOES IN WITH THE SLIP NOW.
                             MIKE: **"Tears must only happen on the Monitor
                             Screen (not bezel, background, etc)"** — so the
                             band is drawn inside the picture by `PortalScreen`
                             and cropped by the opening, instead of being a
                             sibling of this whole overlay. The reversal is
                             recorded at the H-TEAR block above. */
                          tear={tear}
                          /* [2026-08-27] the transition is snow and not black
                             — his words. The screen draws it; this file is the
                             one that knows a channel changed. */
                          snow={snow}
                          /* [2026-08-27] what the picture is doing, so the
                             controls can do it too — T7. The twin's own glitch
                             arrives by message and the museum's tear slip is
                             already here; they compose into one offset. */
                          jitX={jit.x} jitY={jit.y}
                          exact={!!(twin && twin.exact)}
                          /* ═══ [2026-08-27] THE THREE CONTROL SETS, HIS ══════
                             MIKE: **"it's OK for TV channels to have a
                             different control set than the VIIIp controls."**

                               Television     1 2 3 4 X
                               Channel 3      SCROLL, CLICK, SHAKE, 1 2 3 4 X
                               TERMINAL.EXE   SCROLL, CLICK, X

                             THE SETS ARE RESOLVED HERE BECAUSE THIS IS THE ONE
                             FILE THAT KNOWS WHICH SURFACE IS UP. `PortalScreen`
                             draws what it is handed and `portal.js` never
                             learns what a SCROLL is — the same seam the bezel
                             and the note already ride.

                             **THE TEST SIGNAL IS NOT ONE OF HIS THREE AND IS
                             READ AS TELEVISION'S**, stated so it can be
                             corrected in one word. It is what a channel with no
                             unit carries — a broadcast-shaped picture with no
                             machine behind it — so the controls that make sense
                             on it are the ones that change channel, and SCROLL
                             would reach nothing. A visitor who lands on it
                             needs a way off it more than any other surface.

                             `picture` KEEPS THE MACHINE'S SET because channel 4
                             is channel 3 by his ruling of the same day; if a
                             still is ever declared again it is a picture with
                             no machine behind it and this is the line that
                             decides what it carries. */
                          words={twin && twin.kind === "console"
                                   ? ["scroll", "click"]
                                   : (twin && (twin.kind === "machine"
                                            || twin.kind === "picture"))
                                     ? ["scroll", "click", "shake"] : []}
                          channels={twin && twin.kind === "console"
                                      ? null : (twin && twin.chList)}
                          ch={twin && twin.ch}
                          onClose={closeTwin}>
              {twin && twin.kind === "console" ? (
                /* [2026-08-26] TERMINAL.EXE, REBUILT IN MONITOR CHARACTER THE SAME
                   DAY. The first cut drew the album page's `InstrumentPanel`
                   on the glass and called it a placement; Mike named that the
                   foolish version — **"Do not map every control as-is to the
                   monitor"** — and he was describing exactly what it was.
                   The console now prints the boot and then writes the feed's
                   settings as terminal lines in `Mon_DOS`'s own register. The
                   FUNCTION is `feed-control.js`, owned above so it survives
                   this component being replaced by whatever the latch opens. */
                <PortalConsole boot={twin.boot} halt={twin.halt}
                               decl={twin.panel} feed={feed}
                               halting={halting} onHalted={consoleHalted} />
              ) : twin && twin.kind === "test" ? (
                <TestSignal title={twin.title} />
              ) : twin && twin.kind === "television" ? (
                /* keyed on the id AND the join second, so choosing a second
                   television channel builds a NEW set rather than reusing the
                   one that is playing. ONE OUTPUT — the old player is
                   destroyed on unmount before the new one is built. */
                <Television key={twin.ytId + ":" + twin.startSeconds}
                            ytId={twin.ytId} startSeconds={twin.startSeconds}
                            /* [2026-08-27] the set says when it is actually
                               playing, and the snow above comes down then. It
                               is the only kind whose arrival is not immediate,
                               and guessing a duration for it is what would put
                               the black back. */
                            onLive={() => setTvSettled(true)}
                            title={twin.title} />
              ) : twin && twin.kind === "picture" ? (
                /* [2026-08-26] A PHOTOGRAPH IS AN `<img>`. It is cut on the
                   bezel's own 3000x2400 canvas and registers with it (measured:
                   a 0px frame ring at nine of eleven rows across the opening),
                   so on `place:"canvas"` it lands edge to edge and the declared
                   `object-fit:cover` is a no-op rather than a crop. In an
                   `<iframe>` that rule was INERT — object-fit does not apply to
                   one — and what drew was the browser's own image viewer. */
                <img src={twin.src} alt="" />
              ) : null}

              {/* ═══ [2026-08-27] THE MACHINE IS MOUNTED ONCE AND NEVER
                  UNMOUNTED — MIKE'S RULING, AND IT IS A STORY FACT ═══════════
                  **"Changing channels should not cause a VIIIp reboot. These
                  are to be different camera views of the same live unit."** And
                  on whether that reaches the television channels too:
                  **"running regardless of how you spent your time."**

                  THE DEFECT, MEASURED FOUR TIMES BEFORE IT WAS TOUCHED. The
                  twin used to be the last branch of the same ternary as
                  television and the test card, with `src={twin.src}`. So a
                  switch to channel 4 CHANGED THE SRC (it carried `&view=`) and
                  a switch to television UNMOUNTED THE ELEMENT — both a full
                  document load. Stamping the frame's `window` and reading
                  `performance.timeOrigin` back: **a new origin, a new stamp and
                  an uptime of ~3.6s on every single channel change.** The unit
                  was rebooting every time he looked away.

                  SO IT LIVES OUTSIDE THE TERNARY. Once a machine channel has
                  been opened the element stays in the tree for the rest of the
                  visit, and the other kinds render OVER it — which is why the
                  branch above now ends in `null` rather than in this element.
                  **It is covered, not unmounted, and not `display:none`:** the
                  machine's clocks are `setInterval` (`osTick` at 50ms,
                  `refreshChrome` at 200ms, the feed glitch at 760ms), and a
                  frame that is still in the render tree keeps them. Hiding it
                  with `display:none` would have been the version that LOOKS
                  fixed while the machine quietly stops — which is the shape
                  CH3's resize was fixed in once before, and it came back.

                  **THE SRC IS A FUNCTION OF THE PRESET AND OF NOTHING ELSE**,
                  so a channel change cannot touch it. The VIEW is a message now
                  (`portal-view`), handled below. A PRESET change still reloads,
                  and that is correct rather than an oversight: a bank is a
                  START MODE — `PATCHED`, `COLD START`, `FIRST RUN` — and those
                  recipes exist to boot the machine differently. Changing the
                  camera must not reboot it; changing how it starts must. */}
              {machineSrc && (
                <iframe
                  ref={twinFrameRef}
                  key={machineSrc}
                  className={"ps-machine" + (showingMachine ? "" : " ps-machine--behind")}
                  src={machineSrc}
                  title={machineTitle} />
              )}
            </PortalScreen>
          </div>
          {/* [2026-08-27] THE RIP IS NO LONGER DRAWN HERE. It was an inline
              element at this level, `left:0;right:0` with its height in `vh`,
              sitting over the ground and the bezel and the picture together.
              Mike ruled it onto the monitor screen; it is `.ps-tear` inside
              `PortalScreen`'s feed box now, and its declaration went with it
              into `PortalScreen.css` rather than staying here as a style
              object one file away from the element it dresses. The reversal is
              argued at the H-TEAR block above, where the old rule was. */}
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
