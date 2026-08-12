import { useEffect, useRef, useState } from "react";
/* [J1 2026-08-11] `entryDateline` is no longer imported: the dateline it built
   was deleted from the head on Mike's ruling, and it now has NO CALLER ANYWHERE
   — dead code, left in `record-model.js` and reported rather than deleted.
   `entryStamp` STAYS, and the lint caught the reason: the head was not its only
   caller here. The newspaper door's peek card still prints a target record's
   stamp, and `Exhibit.jsx`'s short head still draws one too.
   `entryWeekday` arrives for the rail — the same call `RecordIndexRow` makes,
   cut to three characters the same way and for the same reason. */
import { entryStamp, entryWeekday, evidenceOf } from "../../lib/record-model.js";
import RecordAttachments from "./RecordAttachments.jsx";
import RecordNav from "./RecordNav.jsx";

/* ===========================================================================
   [RC 2026-08-04] THE RECORD ENTRY — MIKE'S APPROVED CONTAINER, BUILT ONCE.
   ===========================================================================

   THE SHAPE, VERBATIM FROM THE RULING:

     a HEADLINE          the day's one thing, stated plainly, no theatre in
                         the syntax
     a DATELINE          WEEK n · DAY · Record nnn
     a LEAD              blockquote-weight, and it could stand alone
     4–7 SECTIONS        each holding ONE thought, each with a short all-caps
                         label and inline door icons
     a TOMBSTONE         closing, italic: where things stand when the lights
                         go off

   Scannable in fifteen seconds by headings alone; five minutes if read;
   deeper if clicked.

   WEIGHT VARIES BY WHAT HAPPENED, AND THAT IS WHY THERE IS NO GRID HERE.
   Mike's instruction is explicit — no formula, no fixed proportions: the
   day's main event gets the room, a minor item gets four lines. So a section
   is a label and a body and NOTHING ELSE. Nothing in this file equalises two
   sections, pads a short one, or caps a long one; the length of a section is
   a fact about the day, and the only way to keep that true is to build no
   machinery capable of overriding it.

   ==== WHY THIS IS A NEW FILE AND NOT A NEW `entriesMode` =================
   The Record's index, its open/close, its wire/plates/docs payloads and its
   ‹ NEWER / OLDER › walk all live in `Exhibit.jsx` and are unchanged. What
   arrives here is a LONG-FORM BODY for one opened record, and the switch is
   the house's own: AN ENTRY THAT DECLARES `sections` RENDERS THIS; AN ENTRY
   THAT DOES NOT IS BYTE-IDENTICAL TO BEFORE. Same rule as `img` on an entry
   (F1), `wire`/`plates` on a record (B9), `docs` (L6). No mode flag, no
   second species of Record, and the ten entries already written did not move.

   ==== THE DOORS (R2) =====================================================
   MIKE'S RULING ON THE SET, and the three laws that bind all four:
   INLINE, IN THE SENTENCE. NEVER A NEW WINDOW. ALWAYS AN OVERLAY THAT POPS
   IN PLACE AND CLOSES BACK TO EXACTLY WHERE YOU WERE.

     TV          the portal, preconfigured to that moment in the story. Fires
                 the wing's existing `wb-robots-open-twin` with a `record-day`
                 recipe and the entry's own date — the machinery that already
                 exists (latch → power → the right state → the portal comes
                 up). REAL: the recipe is in `twin.html` and the date seeds
                 the feed weather deterministically.
     FILM STRIP  video. HONEST PLACEHOLDER, and the reason is named on the
                 door: this wing has `videos: []` and `playerBar: false`, so
                 there is no in-place moving-picture surface to open into, and
                 the one clip this entry refers to is not cut. A door that
                 opened a new tab at a video would break the third law above,
                 so it does not; it opens a note saying what is not here.
     SAFE        the archive. **THE CHOICE IS STATED, PER THE RULING:** SAFE,
                 not LIBRARY. At the size these are drawn — about one line of
                 running text — a library reads as a rectangle with noise in
                 it, because its signature is columns and books and both are
                 sub-pixel here. A safe's signature is ONE CIRCLE ON ONE
                 RECTANGLE, which survives any size a browser will draw it at.
                 REAL: opens the wing's own reader (the same instrument a
                 plate off the wall opens in), in place, closing back here.
     NEWSPAPER   another record entry. REAL: pops the target's own head in
                 place — stamp, headline, lead — with the choice to go there
                 or to close back to the sentence you were reading. It is a
                 PEEK rather than a jump precisely because of the third law:
                 a door that navigated would lose the reader's place, and the
                 ruling says the way out is back to exactly where you were.

   ICONS ARE INLINE SVG ON `currentColor`, which is what keeps them inside the
   wing's B&W law without being touched by it — the law is `img { grayscale }`
   scoped to the wing, and these are not images. It is also why a door tints
   with its own text on hover instead of needing a second colour.

   A DOOR CARRIES A WORD, not only a glyph. Mike's bar is "intuitively obvious
   on first or second click", and an unlabelled 16px icon inside a sentence is
   a guess on the first click. Icon plus two or three words is a door you can
   read, and it still sets inline.

   ==== THE NO-HIDDEN-INFORMATION LAW (R4) ================================
   The sections are VISIBLE. Nothing here collapses, pages, truncates or hides
   behind a "more". The only thing that overlays is a door, and a door is a
   destination the reader chose. There is no inner scroll on this surface: the
   document scrolls, which is ordinary reading, and the two overlays are sized
   to their content rather than to a box.
   =========================================================================== */

/* ---- THE ICON SET -------------------------------------------------------
   24×24, stroke-only, `currentColor`, round caps. Drawn as SILHOUETTES: at
   the size these run, the thing that identifies an object is its outline and
   its one distinguishing feature, not its detail. */
const ICONS = {
  /* a set, a control column with two dials, and rabbit ears */
  tv: (
    <>
      <path d="M7 7 11.5 2.6 16 7" />
      <rect x="2.2" y="7" width="14.6" height="14" rx="1.4" />
      <rect x="17.6" y="7" width="4.2" height="14" rx="1.2" />
      <circle cx="19.7" cy="11" r="0.95" />
      <circle cx="19.7" cy="15.4" r="0.95" />
    </>
  ),
  /* a strip with sprocket holes down both edges */
  film: (
    <>
      <rect x="2.6" y="4" width="18.8" height="16" rx="1.2" />
      <path d="M7.4 4v16M16.6 4v16" />
      <path d="M4.4 7.2h1.2M4.4 11.4h1.2M4.4 15.6h1.2
               M18.4 7.2h1.2M18.4 11.4h1.2M18.4 15.6h1.2" />
    </>
  ),
  /* SAFE, per the stated choice above: a box, a door inside it, a dial */
  archive: (
    <>
      <rect x="2.6" y="3.6" width="18.8" height="16.8" rx="1.4" />
      <rect x="5.2" y="6.2" width="13.6" height="11.6" rx="0.8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 8.2v7.6M8.2 12h7.6" />
      <path d="M2.6 20.4v1.6M21.4 20.4v1.6" />
    </>
  ),
  /* a front page: masthead bar, then two columns of type */
  record: (
    <>
      <rect x="2.6" y="4.4" width="18.8" height="15.2" rx="1" />
      <path d="M5.4 8.4h13.2" strokeWidth="2.4" />
      <path d="M5.4 12.4h5.6M5.4 15.6h5.6M13 12.4h5.6M13 15.6h5.6" />
    </>
  ),
};

/* What the door says it is, when its own label does not say it. Also the
   accessible name, so a screen reader is told the KIND and not just "button". */
const KIND_NAME = {
  tv: "the portal",
  film: "footage",
  archive: "the archive",
  record: "another record",
};

function DoorIcon({ kind }) {
  return (
    <svg className="vp-rec-door-ico" viewBox="0 0 24 24" aria-hidden="true"
         fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round">
      {ICONS[kind] || ICONS.record}
    </svg>
  );
}

/* ---- ONE DOOR ---------------------------------------------------------- */
function Door({ door, onFire }) {
  const kind = ICONS[door.kind] ? door.kind : "record";
  const name = KIND_NAME[kind];
  const title = door.label ? name + " — " + door.label : name;
  return (
    <button type="button"
            className={"vp-rec-door vp-rec-door--" + kind
                       + (door.held ? " vp-rec-door--held" : "")}
            title={title} aria-label={title}
            onClick={() => onFire(door)}>
      <DoorIcon kind={kind} />
      {door.label && <span className="vp-rec-door-lbl">{door.label}</span>}
    </button>
  );
}

/* ---- A SECTION'S BODY, WITH ITS DOORS SET INTO THE SENTENCE -------------
   `[[1]]` in the body text is door one of that section's own list. The text
   is split on the marker and the door is rendered where the marker stood,
   which is the only way a door is genuinely IN a sentence rather than under
   one.
   A DOOR THAT IS DECLARED BUT NEVER PLACED STILL RENDERS, at the end of the
   section. An affordance silently swallowed by a typo in a marker is the
   worst failure this could have, so it cannot happen: the renderer keeps a
   set of the ones it placed and prints the remainder. */
/* SPLIT, NOT `exec`. A capturing group makes `String.split` interleave the
   captures with the text around them — even positions are prose, odd ones are
   the door number — so the whole parse is one stateless call. The `exec` loop
   this replaces needed a module-level `lastIndex` reset, which is shared
   mutable state on a module constant and is exactly what a render must never
   touch (the compiler's immutability rule caught it, correctly). */
const MARK = /\[\[(\d+)\]\]/;

/* ═══ [E2 2026-08-09] ONE KIND OF PARAGRAPH, AGAIN ═══════════════════════════
   For one round this function had a second branch: a paragraph carrying
   `[MIKE-NOTE]` drew in red and one carrying `[OPS]` drew in blue, inline, in
   the published entry. MIKE STRUCK IT — *"the red/blue inline answers in the
   published entry are retired; that was Ops answering in the wrong place."*
   His notes are written in curly braces now and stay in his working copy, where
   Ops picks them up (`src/lib/visitor-prose.js`, OPS_BRACE). Nothing about a
   note is this renderer's business any more, so the branch, the two classes and
   the `launched()` filter are gone rather than left dormant. */
function SectionBody({ body, doors, onFire }) {
  const paras = Array.isArray(body) ? body : [body];
  const used = new Set();
  const out = paras.map((text, pi) => {
    const bits = String(text).split(new RegExp(MARK.source, "g")).map((piece, k) => {
      if (k % 2 === 0) return piece;
      const di = Number(piece) - 1;
      const door = doors && doors[di];
      if (!door) return null;
      used.add(di);
      return <Door key={"d" + pi + "-" + k} door={door} onFire={onFire} />;
    });
    return <p key={pi} className="vp-rec-sect-body">{bits}</p>;
  });
  const orphans = (doors || []).filter((_, i) => !used.has(i));
  if (orphans.length) {
    out.push(
      <p key="orphans" className="vp-rec-sect-body vp-rec-sect-doors">
        {orphans.map((d, i) => <Door key={i} door={d} onFire={onFire} />)}
      </p>
    );
  }
  return out;
}

/* ======================================================================== */
export default function RecordEntry({
  /* [2026-08-11] `read` arrives so the transport's UNREAD mark can be told
     which records this visitor has opened. It is the same Set the index marks
     its rows from, threaded down rather than re-read from `localStorage` here:
     one reader of the register per surface, and the entry is not one of them. */
  /* [J1 2026-08-11] `epoch` is no longer destructured. It fed `entryDateline`
     and nothing else here; the call sites still pass it and that is harmless —
     what would not be harmless is a name bound to nothing. */
  /* [K1 2026-08-11] `land` — did the reader arrive here from the INDEX?
     True only for an index row's click; false for every transport mark and
     every cursor key. See the effect below and `landOpen`/`walkTo` in
     `Exhibit.jsx`. Defaults false so a caller that has not been taught the
     distinction gets the STILL behaviour rather than the jumping one. */
  entry, list, open, openLink, onOpen, onClose, twinEvent, read, land = false,
}) {
  /* the one piece of state on this surface, and it is a door's overlay:
     { mode:"record", i } | { mode:"held", kind, label, note } */
  const [pop, setPop] = useState(null);

  /* THE RECORD BEING READ CHANGES → ANY OPEN DOOR CLOSES WITH IT, and it is
     done at the three places that can change it rather than in an effect
     watching `open`. A peek left standing over a record you have walked away
     from would describe the wrong page — and an effect that calls setState on
     a prop change is a cascading render for a state change this component
     already knows about at the moment it happens. `walk` is that moment. */
  function walk(i) { setPop(null); onOpen(i); }

  useEffect(() => {
    if (!pop) return;
    function onKey(e) { if (e.key === "Escape") setPop(null); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pop]);

  /* ── [P4 2026-08-05] THE NEW RECORD ARRIVES WHERE YOUR EYES ALREADY ARE ────
     Mike's word for the walk was DELIGHTFUL, and the thing that makes stepping
     through a log miserable is not the click — it is landing at the top of a
     page you are already scrolled past, or two thirds of the way down a record
     that started above you. This component is remounted on every walk
     (`key={open}` at the call site), so a mount effect IS the walk.

     IT ONLY MOVES THE PAGE WHEN IT HAS TO. If the head is already comfortably
     on screen — which is the case the first time a record is opened from the
     index — nothing scrolls, because a page that jumps when it did not need to
     is the opposite of graceful. `smooth` is dropped under
     `prefers-reduced-motion`, where the same instruction still has to work. */
  /* ═══ [2026-08-11] AND IT NO LONGER THROWS THE HEADING AWAY ════════════════
     MIKE: pressing a control walked the record and took the control he had just
     pressed — and the face heading above it — off the top of the screen.

     THE CAUSE WAS `block: "start"`. It puts the record's head at pixel zero of
     the viewport, and EVERYTHING THAT RENDERS ABOVE THE RECORD IS THEREFORE
     ABOVE THE VIEWPORT: the jump bar, the face heading, the new transport row.
     The effect was doing exactly what it said; what it said was too strong.

     THE FIX IS A STOP LINE ON THE TARGET, AND IT IS `scroll-margin-top`.
     `.vp-rec-head` carries one in `Exhibit.css`, so `block: "start"` now aims
     at a line that many pixels ABOVE the head — enough for the transport row
     and the heading it sits under to stay on screen.

     WHY NOT ARITHMETIC HERE. The obvious version reads the head's position and
     calls `window.scrollTo` with the margin subtracted. It was written that way
     first and it was wrong: it assumes the WINDOW is the scroller, and this
     surface is not guaranteed to be — the exhibit is a scroll-snap document and
     was measured, in the 390px rig, refusing `window.scrollTo` and
     `documentElement.scrollTop` alike. `scrollIntoView` finds whatever the
     scrolling ancestor actually is, which is the whole reason to keep it;
     `scroll-margin-top` is the platform's own way to say "stop short", and it
     travels with the element rather than with an assumption about the page.

     WHAT IS UNCHANGED: it still drops `smooth` under `prefers-reduced-motion`,
     and it is still a mount effect because the component is remounted on every
     walk. */
  /* ═══ [K1 2026-08-11] IT NO LONGER FIRES ON A WALK, WHICH IS THE WHOLE FIX ══
     MIKE: "When I go to next the screen jumps. It jumps EVERY TIME I change
     records."

     THE STILLNESS RULE IS ABOUT WALKING AND NOT ONLY ABOUT OPENING, and the
     reason a walk needs no scroll at all is a fact this round's predecessor
     established: THE HEAD IS INVARIANT ACROSS ENTRIES. `.vp-rec-openhead` is
     the index row's own box, at the index row's own position, with the same
     reserved height for every entry — so stepping 001 -> 002 the reader's eye
     is already exactly where the next headline appears. Scrolling to a place
     the page is already at is the jump.

     WHY IT WAS FIRING AT ALL. This is a MOUNT effect and the component is
     remounted on every change of `open`, so a walk and an open reach it by the
     identical path and it could not tell them apart. It still cannot — and it
     no longer has to, because the caller says so: `land` is true only when an
     index row was clicked (`landOpen` in `Exhibit.jsx`) and false for every
     transport mark and every cursor key (`walkTo`).

     THE OPEN KEEPS ITS LANDING, unchanged and for its own reason: the reader
     may have clicked a row far down a list of sixty, and the record they asked
     for must come to them. One movement, still smooth, still stopping short by
     `scroll-margin-top`.

     THE OLD "only moves the page when it has to" GUARD IS NOT WHAT THIS
     REPLACES — that guard was a visibility test and had already been removed
     from the code while its note stayed behind. This is a different question
     answered in a different place: not *is the head on screen* but *did the
     reader arrive here from the index*. */
  const headRef = useRef(null);
  useEffect(() => {
    if (!land) return;
    const el = headRef.current;
    if (!el || typeof window === "undefined") return;
    const still = window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* REDUCED MOTION GETS THE POSITION AND NOT THE JOURNEY, and it is `instant`
       rather than `auto` even though `auto` would now do the same thing.
       [CH9 2026-08-12] THE REASON THIS ORIGINALLY GAVE IS GONE AND THE LINE
       STAYS. It said `auto` would glide anyway because the document declared
       `scroll-behavior: smooth` — that declaration was the cause of the scroll
       bug and is deleted (Exhibit.css). `instant` is kept because it states the
       intent at the call site instead of depending on the absence of a rule
       somewhere else, which is exactly the dependency that just cost four
       wrong theories. */
    if (still) { el.scrollIntoView({ behavior: "instant", block: "start" }); return; }
    /* THE BEAT BETWEEN THE TWO MOVEMENTS. The effect already runs after React
       has committed the expanded record, so the layout is settled by the time
       we are here; this pause is not waiting for the DOM, it is the pause that
       makes the expansion and the glide read as two deliberate acts instead of
       one lurch. 140ms — long enough to see the record has opened, short enough
       that nobody is waiting for it.
       A TIMER RATHER THAN `requestAnimationFrame`, deliberately: rAF does not
       fire in a tab that is not being painted, and a record opened in a
       background tab would then sit un-glided with no error anywhere. */
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 140);
    return () => clearTimeout(t);
    /* `land` is fixed for this mount — the component is remounted per entry —
       so this is a mount effect either way; naming it in the deps is what makes
       that true by construction rather than by the caller's habit. */
  }, [land]);

  const sections = entry.sections || [];

  /* ---- WHAT A DOOR DOES -------------------------------------------------
     `held` FIRST AND DELIBERATELY: a door whose target does not exist says so
     however it is otherwise configured. That is what makes the placeholder
     honest instead of decorative — it cannot be half-wired and half-pretend. */
  function fire(door) {
    if (door.held) {
      setPop({ mode: "held", kind: door.kind, label: door.label, note: door.held });
      return;
    }
    if (door.kind === "tv") {
      /* the museum and the twin share NO CODE — only the two words on the
         query string (O4). An id the machine does not know opens a plain
         portal, which is why a preset may be named here before it is learned
         there. */
      window.dispatchEvent(new CustomEvent(twinEvent || "wb-robots-open-twin", {
        detail: { preset: door.preset || "record-day", day: door.day || entry.date },
      }));
      return;
    }
    if (door.kind === "archive") {
      const set = door.set || (door.img ? [{ img: door.img, label: door.label }] : []);
      if (!set.length || !openLink) {
        setPop({ mode: "held", kind: "archive", label: door.label,
                 note: "This door has no plate behind it yet." });
        return;
      }
      openLink(set[door.index || 0].img, {
        set, index: door.index || 0, setTitle: door.setTitle || entry.title,
      });
      return;
    }
    /* NEWSPAPER. `to` is a DATE, not an index: an index is a position in a
       list that reorders itself (the Record reads newest-first) and would
       point at a different entry the day one is inserted. A date points at
       the entry it names, forever. */
    const i = (list || []).findIndex(e => e && e.date === door.to);
    if (i < 0) {
      setPop({ mode: "held", kind: "record", label: door.label,
               note: "That record is not in this volume yet." });
      return;
    }
    setPop({ mode: "record", i });
  }

  const target = pop && pop.mode === "record" ? list[pop.i] : null;

  return (
    <>
      {/* [2026-08-11] THE TRANSPORT, TOP-RIGHT. Same five marks as the foot,
          same order, same icons — Mike's ruling is that the set does not change
          between the two positions, so there is one component and it is passed
          a side rather than a different list of controls. */}
      {/* ═══ [J1 2026-08-11] THE TRANSPORT MOVED UP TO THE FACE HEADING ══════
          It was rendered here, as the first thing inside the record. Mike put
          it level with "The Record", so it is rendered by `Exhibit.jsx` beside
          the heading now and this component draws only the FOOT group. Nothing
          about the group changed in the move — same component, same five marks,
          same order, now with INDEX at the front at both ends. */}

      {/* ═══ [J1 2026-08-11] THE DATELINE IS DELETED, WITH NO REPLACEMENT ════
          MIKE: "17 AUG 26 WEEK 1 · MONDAY · RECORD 001 — delete entirely, no
          replacement. Redundant once the block carries: the weekday is in the
          rail, the number is in the rail, and the full date was removed from
          the index deliberately."
          THE STAMP WENT WITH IT because the stamp WAS the `17 AUG 26` half of
          that line — one line on the glass, one ruling. `entryStamp` is
          untouched in `record-model.js` and still drawn by the short head in
          `Exhibit.jsx`; `entryDateline` now has NO CALLER ANYWHERE and is dead
          code, reported rather than deleted on Mike's instruction.
          AND THE HEAD IS STILL THE CONTROL. `.vp-rec-head` carried `onClose`
          and there is still no second shut button — the head block below is the
          same control, and INDEX in both transport groups is the same door. */}


      {/* ═══ [J1 2026-08-11] THE INDEX BLOCK, WHOLE, IN PLACE ════════════════
          MIKE: "Everything in the index row carries into the opened record, IN
          PLACE, WITHOUT CHANGE: the number, the weekday, the headline, the
          deck. All four, same position, same size, same weight."

          SO IT IS THE INDEX ROW'S OWN MARKUP AND THE INDEX ROW'S OWN CLASSES,
          NOT A SECOND THING TUNED TO LOOK LIKE IT. `.vp-rec-mark` /
          `-mark-no` / `-mark-day`, `.vp-fe-body` / `-titlerow` / `-title`,
          `.vp-fe-line vp-rec-sum` — the same six classes `RecordIndexRow`
          prints, inside a container that takes `.vp-rec-open`'s grid, so the
          two views' geometry agrees BY CONSTRUCTION rather than by two sets of
          numbers somebody has to keep equal. That is the same argument
          `--rec-textcol` was introduced on and it is the reason this is markup
          rather than a stylesheet full of matching values.

          WHAT THIS SOLVES BESIDES THE ASK: with the rail occupied, the headline
          and the deck stop reading as indented. The 71.5px they sit in was
          always the rail's column; until today the opened record left it empty
          and the page had two left edges.

          THE TWO OLD CLASSES ARE STILL ON THE TWO NODES, and that is not
          sentiment. `tools/dictation/record-edit.client.js` finds Mike's
          writing fields BY CLASS — `.vp-rec-headline` is how the editor knows
          which node is the headline — so dropping the class would have
          red-bannered the surface he writes Records on, silently, in launch
          week. The classes now carry no geometry of their own; they are
          handles. */}
      <div key="head" ref={headRef} className="vp-rec-openhead">
        <span className="vp-rec-mark" aria-hidden="true">
          {typeof entry.no === "number" && (
            <b className="vp-rec-mark-no">
              {String(entry.no).padStart(3, "0")}
            </b>
          )}
          {entryWeekday(entry) && (
            <i className="vp-rec-mark-day">
              {entryWeekday(entry).slice(0, 3).toUpperCase()}
            </i>
          )}
        </span>
        <span className="vp-fe-body">
          <span className="vp-fe-titlerow">
            <h3 className="vp-fe-title vp-rec-headline">{entry.title}</h3>
            {/* ═══ [K1 2026-08-11] THE PAYLOAD COUNTS CARRY ═════════════════
                MIKE: "Payload badges CARRY. No exception to the
                index-block-carries-unchanged rule."
                The fourth pass reported these as the one thing in the index row
                that did not survive the open, and offered the argument that the
                opened record lists its attachments at the foot so a count at
                the head would say it twice. He ruled the other way, and the
                ruling is the stronger one: the rule is that the block carries
                UNCHANGED, and a rule with one Ops-chosen exception in it is not
                a rule a future round can rely on.
                SAME CALL, SAME CLASS, SAME PLACE IN THE ROW as
                `RecordIndexRow` — `evidenceOf(entry)` on `.vp-fe-load`, inside
                `.vp-fe-titlerow`, after the title. Nothing draws today: no
                entry in this volume declares `wire`, `plates` or `docs`, so
                `evidenceOf` returns empty for all six and the glass is
                byte-identical. It draws the day one does, in both views, which
                is the whole of what he ruled. */}
            {evidenceOf(entry).map(ev => (
              <span key={ev.kind} className="vp-fe-load">
                {ev.kind}<i>{ev.count}</i>
              </span>
            ))}
          </span>
        </span>
        {/* THE DECK. Same field, same class, same face as the index — see the
            note above. An entry with both `lead` and `line` still prints both,
            in that order, and they are not two of anything: the deck is the
            index sentence and the lead is the opening paragraph. */}
        {entry.line && (
          <p className="vp-fe-line vp-rec-sum vp-rec-deck">{entry.line}</p>
        )}
      </div>

      {/* THE VISUAL HOOK (Mike's standing law), and it is a photograph we
          already own rather than a picture invented for the slot. Clicking it
          opens the wing's reader, so the hook is also a door.

          ═══ [J1 2026-08-11] IT SITS BELOW THE HEAD NOW, NOT BESIDE IT ════════
          IT MOVED BECAUSE OF MIKE'S OWN RULING, not to dodge a layout bug. A2
          asks that the index row's four parts land on the SAME PIXELS in both
          views; the head is a full-width row in the index, so a head squeezed
          into the space left by a floated picture would be a narrower row with
          a differently-wrapped deck — the one entry with a plate would be the
          one entry that failed the overlay.
          AND IT WAS ALSO DRAWING A HOLE. The head is a grid, a grid establishes
          its own formatting context, and a formatting context does not sit
          beside a float — so on 013 the whole head DROPPED BELOW the plate and
          left ~250px of empty paper to its left. Measured, not predicted: the
          picture is the only thing on this surface that could do it, and 013 is
          the only entry carrying one.
          NOTHING ABOUT THE PLATE ITSELF CHANGED. It still floats right and the
          lead and the sections still set beside it — which is what the note
          above has always described. What it no longer sets beside is a head
          that is now the index's row. */}
      {entry.still && (
        <figure key="still" className="vp-rec-still">
          <button type="button" className="vp-rec-still-go"
                  title="open this plate in the reader"
                  onClick={() => openLink && openLink(entry.still, {
                    set: [{ img: entry.still, label: entry.stillCaption }],
                    index: 0, setTitle: entry.title,
                  })}>
            <img src={entry.still} alt={entry.stillCaption || ""} loading="lazy" />
          </button>
          {entry.stillCaption && (
            <figcaption className="vp-rec-still-cap">{entry.stillCaption}</figcaption>
          )}
        </figure>
      )}

      {/* THE LEAD. Blockquote weight because it is the one paragraph that has
          to survive being read alone — in the index, in a share, or by a
          visitor who reads exactly one thing on the page.

          [D2 2026-08-08] IT IS `lead` AND ONLY `lead`. THE `|| entry.line`
          FALLBACK IS GONE, ON MIKE'S RULING: **the index sentence prints once,
          in the index.**

          WHY THE FALLBACK LOOKED RIGHT AND WAS NOT. `line` is *one true
          sentence* and a lead is *the one paragraph that survives being read
          alone*, so for one round the two looked like the same field seen from
          two places. They are not. `line` is written to a 130-character budget
          measured off the INDEX ROW; a lead is written for the top of the
          document. On Record 001 the difference was the whole of the problem —
          the fallback set an Ops-drafted summary in blockquote weight directly
          above Mike's own EXECUTIVE SUMMARY heading, which is two summaries of
          one report stacked, and the smaller one first.

          NOTHING MOVED ON RECORD 013, AND THAT WAS THE CONSTRAINT RATHER THAN
          THE LUCK. 013 declares BOTH `lead` and `line`, so it took the
          left-hand side of the fallback and never the right; removing the
          right-hand side cannot reach it. Measured before and after — see the
          round log's §2, which diffs the rendered entry.

          THE PEEK BELOW KEEPS `lead || line` AND THE ASYMMETRY IS DELIBERATE.
          A newspaper door pops another record's HEAD — stamp, headline, one
          line — which is an index row in a card, and the index row is exactly
          where the summary belongs. The rule Mike gave is about the LEAD
          PARAGRAPH of an opened entry; a card that is an index row is the one
          other place `line` is at home. */}
      {entry.lead && (
        <p key="lead" className="vp-rec-lead">{entry.lead}</p>
      )}

      {/* THE SECTIONS. `data-stage-split` because a run of sections is a LIST,
          and a list authored as one block is the case the mothballed packer
          overruns — the wing is flat today and this costs nothing, and it is
          correct the day anything pages again. */}
      <ol key="sects" className="vp-rec-sects" data-stage-split="row">
        {sections.map((s, i) => (
          <li key={i} className="vp-rec-sect">
            {s.label && <h4 className="vp-rec-sect-label">{s.label}</h4>}
            <SectionBody body={s.body} doors={s.doors} onFire={fire} />
          </li>
        ))}
      </ol>

      {/* [A1 2026-08-08] THE ATTACHMENTS, BELOW THE WRITING. Mike's ruling on
          D-b: an entry may carry both authored sections and payloads, and the
          payloads sit at the BOTTOM, after the writing. Until today this
          renderer drew `wire`, `plates` and `docs` NOWHERE and said nothing
          about it (S-c).
          IT IS ABOVE THE TOMBSTONE ON PURPOSE. The tombstone is where things
          stand when the lights go off — it is the last sentence of the day, and
          a list of files after it would be furniture after a closing line. The
          attachments are part of the record; the tombstone ends it. */}
      <RecordAttachments key="att" entry={entry} openLink={openLink} />

      {/* THE TOMBSTONE: where things stand when the lights go off. */}
      {entry.tomb && <p key="tomb" className="vp-rec-tomb">{entry.tomb}</p>}

      {entry.note && <p key="note" className="vp-fe-note">{entry.note}</p>}

      <div key="end" className="vp-rec-end" aria-hidden="true"><i /></div>

      {/* [P4 2026-08-05] THE WALK APPEARS WHEN THERE IS SOMEWHERE TO WALK. On a
          one-record volume both halves render permanently disabled and the count
          reads "1 of 1" — three objects saying the same nothing. The cursor keys
          (RecordJump, Exhibit.jsx) are the same walk and are not gated, because a
          key that does nothing costs no attention and Escape still closes. */}
      {/* ═══ [2026-08-11] FIVE MARKS, AND THE TEXT WALK IS GONE.
          `‹ NEWER` and `OLDER ›` are deleted rather than re-labelled. They were
          two controls where the ruling asks for five, and their words were the
          part of the order flip most likely to end up lying — the labels had to
          be re-read the moment the volume changed direction, which is exactly
          what has just happened to them. The count stays: it says WHERE YOU
          ARE, which no mark does.
          ═══ [J1 2026-08-11] BOTTOM-RIGHT NOW, AND WITH INDEX AT ITS FRONT.
          Mike's ruling is that the group is the SAME SET in both places and
          that both are right-aligned, so the count swaps to the left of the row
          and the marks take the right edge — the top group's exact geometry,
          which is what "same set in two places" has to mean to be checkable. */}
      {list.length > 1 && (
      <nav key="nav" className="vp-rec-nav">
        <span className="vp-rec-count">{open + 1} of {list.length}</span>
        <RecordNav list={list} open={open} read={read}
                   onOpen={walk} onIndex={onClose} place="foot" />
      </nav>)}

      {/* ==== THE DOOR'S OWN OVERLAY ======================================
          It pops on the page and closes back to exactly where you were —
          nothing behind it moves, nothing scrolls, no address changes. The
          backdrop, the Close and Escape are all the same way out. */}
      {pop && (
        <div className="vp-rec-pop" role="dialog" aria-modal="true"
             aria-label={pop.mode === "record" ? "Another record" : "Not here yet"}
             onClick={() => setPop(null)}>
          <div className="vp-rec-pop-card" onClick={e => e.stopPropagation()}>
            {pop.mode === "record" && target ? (
              <>
                <div className="vp-rec-pop-kind">
                  <DoorIcon kind="record" />
                  <span>{entryStamp(target)}</span>
                </div>
                <h4 className="vp-rec-pop-title">{target.title}</h4>
                <p className="vp-rec-pop-line">{target.lead || target.line}</p>
                <div className="vp-rec-pop-acts">
                  <button className="vp-rec-step"
                          onClick={() => walk(pop.i)}>
                    OPEN THIS RECORD
                  </button>
                  <button className="vp-rec-step" onClick={() => setPop(null)}>
                    BACK
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="vp-rec-pop-kind">
                  <DoorIcon kind={pop.kind} />
                  <span>{KIND_NAME[pop.kind] || "this door"}</span>
                </div>
                {pop.label && <h4 className="vp-rec-pop-title">{pop.label}</h4>}
                <p className="vp-rec-pop-line">{pop.note}</p>
                <div className="vp-rec-pop-acts">
                  <button className="vp-rec-step" onClick={() => setPop(null)}>
                    BACK
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
