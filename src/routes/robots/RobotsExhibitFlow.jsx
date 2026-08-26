import { useState, useEffect, useRef, useCallback } from "react";
import { T as MUSEUM } from "../../styles/tokens.js";
/* [2026-08-21] the drawn channel. Mounted on the payload's `kind`, the way
   `InstrumentPanel` and the Foundation's objects are mounted on a field: this
   file learns one more shape and no other wing can notice. */
import TestSignal from "./TestSignal.jsx";
import Television from "./Television.jsx";
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
  const [unitOn, setUnitOn] = useState(false);
  useEffect(() => {
    function onCtl(e) {
      const id = e && e.detail && e.detail.id;
      if (!id) return;
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

  /* THE POWER SLUG MIRRORS THE MACHINE, and it is a mirror rather than a
     second opinion: the twin posts from `Mon_Power_Sync`, which already rides
     its 200ms chrome tick precisely because `unitPowered` is written from six
     places and hooking the call sites is how a state mirror falls out of step.
     It posts ONLY ON A CHANGE. A channel with no machine clears it, or POWER
     would sit latched over a television. */
  useEffect(() => {
    function onPower(e) {
      if (e && e.data && e.data.wb === "portal-power") setUnitOn(!!e.data.on);
    }
    window.addEventListener("message", onPower);
    return () => window.removeEventListener("message", onPower);
  }, []);
  useEffect(() => {
    if (!twinOpen || !twin || twin.kind !== "machine") setUnitOn(false);
  }, [twinOpen, twin]);

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
      /* [2026-08-21] THE SCREEN'S OWN FIELDS RIDE EVERY KIND. `bezel`, `ch`,
         `chList` and `note` describe the SET, not what is on it, so they are
         read off the detail before the kinds diverge and are the same three
         lines for all three. The engine still learns nothing: a frame
         declaration, a list of numbers and a string it prints. */
      const screen = { bezel: d.bezel || null, ch: d.ch,
                       chList: d.chList, note: d.note || "" };
      if (d.kind === "test") {
        setTwin({ ...screen, kind: "test", title: d.frameTitle || "" });
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
      /* [2026-08-26] this branch names itself `machine` now. It was the only
         one carrying no `kind` at all, which read as "the default" and is not:
         it is the one kind that is a live DOCUMENT, and the four machine
         controls are forwarded to it and to nothing else. A kind that has to be
         recognised by the absence of a field is a kind nobody can grep for. */
      setTwin({ ...screen, kind: "machine", src: `${d.src}?${q.toString()}`,
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
            <PortalScreen bezel={twin && twin.bezel} ch={twin && twin.ch}
                          chList={twin && twin.chList}
                          note={twin && twin.note}
                          place={(twin && (twin.kind === "test"
                                        || twin.kind === "television"))
                                 ? "feed" : "canvas"}
                          slip={tear ? tear.slip : 0}
                          unitOn={unitOn}
                          onClose={closeTwin}>
              {twin && twin.kind === "test" ? (
                <TestSignal title={twin.title} />
              ) : twin && twin.kind === "television" ? (
                /* keyed on the id AND the join second, so choosing a second
                   television channel builds a NEW set rather than reusing the
                   one that is playing. ONE OUTPUT — the old player is
                   destroyed on unmount before the new one is built. */
                <Television key={twin.ytId + ":" + twin.startSeconds}
                            ytId={twin.ytId} startSeconds={twin.startSeconds}
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
              ) : (
                <iframe
                  ref={twinFrameRef}
                  src={twin ? twin.src : undefined}
                  title={twin ? twin.title : ""} />
              )}
            </PortalScreen>
          </div>
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
