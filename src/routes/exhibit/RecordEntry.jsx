import { useEffect, useRef, useState } from "react";
import { entryStamp, entryDateline } from "../../lib/record-model.js";
import RecordAttachments from "./RecordAttachments.jsx";

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
  entry, list, open, epoch, openLink, onOpen, onClose, twinEvent,
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
  const headRef = useRef(null);
  useEffect(() => {
    const el = headRef.current;
    if (!el || typeof window === "undefined") return;
    const top = el.getBoundingClientRect().top;
    if (top >= 0 && top < window.innerHeight * 0.5) return;
    const still = window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  }, []);

  const dateline = entryDateline(entry, epoch);
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
      {/* THE HEAD IS THE CONTROL, unchanged from M5: the thing that opened
          this record closes it, and there is no second shut button. What is
          new is what it carries — a stamp and the dateline.
          [R5 2026-08-06] THE CLASS BADGE WAS THE THIRD THING IT CARRIED AND IT
          IS STRUCK, with its twins on the index and on the short head. Mike:
          "I see no richness in it." It could not be made to serve — the word
          opened nothing and there is no object list behind it — and one badge
          in three places is one ruling in three places. */}
      <button key="head" ref={headRef} className="vp-rec-head vp-rec-head--long"
              onClick={onClose} title="close this record">
        {entryStamp(entry) && <span className="vp-fe-stamp">{entryStamp(entry)}</span>}
        <span className="vp-rec-dateline">
          {dateline.map((p, i) => (
            <span key={i} className="vp-rec-dateline-part">{p}</span>
          ))}
        </span>
      </button>

      {/* THE VISUAL HOOK (Mike's standing law), and it is a photograph we
          already own rather than a picture invented for the slot. Clicking it
          opens the wing's reader, so the hook is also a door. */}
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

      <h3 key="headline" className="vp-rec-headline">{entry.title}</h3>

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
      {list.length > 1 && (
      <nav key="nav" className="vp-rec-nav">
        <button className="vp-rec-step" disabled={open === 0}
                onClick={() => walk(open - 1)}>&lsaquo; NEWER</button>
        <span className="vp-rec-count">{open + 1} of {list.length}</span>
        <button className="vp-rec-step" disabled={open === list.length - 1}
                onClick={() => walk(open + 1)}>OLDER &rsaquo;</button>
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
