import { firstUnread } from "../../lib/record-read.js";

/* ===========================================================================
   [2026-08-11] THE RECORD'S TRANSPORT — FIVE CONTROLS, DRAWN, IN TWO PLACES
   ---------------------------------------------------------------------------
   MIKE'S RULING: family A, transport. Five controls — oldest, prev, next,
   unread, latest — the SAME set at the top-right of an opened record and again
   at its bottom-left, so a reader who has finished the entry does not have to
   go back up to move, and one who has just arrived does not have to go down.

   THEY REPLACE THE TEXT WALK. `‹ NEWER / OLDER ›` at the foot is gone: it was
   two controls where the ruling asks for five, and its labels were the half of
   the order flip most likely to end up lying — a word has to be re-read every
   time the order changes, a triangle does not.

   ═══ NO ICON LIBRARY, ON THE STANDING RULE ═════════════════════════════════
   The house sets its own type and its own rules, so it draws its own marks.
   These are the same construction as `RecordEntry`'s door icons and carry the
   same weight: a 24-unit box, `fill: none`, `stroke: currentColor`,
   `stroke-width: 1.5`, round caps and joins. Nothing is imported and nothing
   is fetched.

   THE UNREAD MARK IS THE HOUSE'S OWN NEWSPAPER, not a second drawing of one:
   it is the `record` glyph `RecordEntry` already uses for a door that opens
   another record — a masthead bar over two columns of type. One newspaper in
   the building, used twice, which is the same argument that struck the class
   badge from three places.

   ═══ THE ORDER IS OLDEST-FIRST AND THESE READ WITH IT ══════════════════════
   Index 0 is the FIRST record and `list.length - 1` is the LATEST, so `prev`
   is `open - 1` and walks BACK through the volume. That is the whole reason
   the arrows point the way they do; if the order is ever flipped again, this
   file and `record-read.js` are the two that have to be read together.
   =========================================================================== */

/* A 24-box, drawn to the house's weight. `oldest` and `latest` carry the stop
   bar that says "there is nothing past this"; `prev` and `next` are the bare
   triangle, so a step never reads as a jump. */
const MARKS = {
  oldest: (
    <>
      <path d="M6 5.5v13" />
      <path d="M19 5.5v13L9.5 12z" />
    </>
  ),
  prev: <path d="M16.5 5.5v13L7 12z" />,
  next: <path d="M7.5 5.5v13L17 12z" />,
  latest: (
    <>
      <path d="M5 5.5v13L14.5 12z" />
      <path d="M18 5.5v13" />
    </>
  ),
  /* the house's own front page — masthead bar, then two columns of type */
  unread: (
    <>
      <rect x="2.6" y="4.4" width="18.8" height="15.2" rx="1" />
      <path d="M5.4 8.4h13.2" strokeWidth="2.4" />
      <path d="M5.4 12.4h5.6M5.4 15.6h5.6M13 12.4h5.6M13 15.6h5.6" />
    </>
  ),
};

/* THE ACCESSIBLE NAME IS THE WHOLE NAME. A screen reader is told what the
   control reaches, not what it is shaped like — "the first record", never
   "skip back". `title` carries the same string so a pointer gets it too. */
const NAMES = {
  oldest: "the first record",
  prev:   "the record before this one",
  next:   "the record after this one",
  unread: "the oldest record you have not opened",
  latest: "the newest record",
};

const ALL_READ = "every record has been read";

function Mark({ kind }) {
  return (
    <svg className="vp-rec-nav-ico" viewBox="0 0 24 24" aria-hidden="true"
         fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round">
      {MARKS[kind]}
    </svg>
  );
}

function Step({ kind, disabled, name, onClick }) {
  return (
    <button type="button"
            className={"vp-rec-nav-btn vp-rec-nav-btn--" + kind}
            disabled={disabled}
            title={name} aria-label={name}
            onClick={onClick}>
      <Mark kind={kind} />
    </button>
  );
}

/* `place` is "top" or "foot" and only sets which way the row is pushed — the
   set, the order and the marks are identical, which is the ruling. */
export default function RecordNav({ list, open, read, onOpen, place = "top" }) {
  if (!Array.isArray(list) || list.length < 2) return null;
  const last = list.length - 1;
  const unread = firstUnread(list, read || new Set());
  return (
    <nav className={"vp-rec-nav5 vp-rec-nav5--" + place}
         aria-label="Move through the record">
      <Step kind="oldest" disabled={open === 0}
            name={NAMES.oldest} onClick={() => onOpen(0)} />
      <Step kind="prev" disabled={open === 0}
            name={NAMES.prev} onClick={() => onOpen(open - 1)} />
      <Step kind="next" disabled={open === last}
            name={NAMES.next} onClick={() => onOpen(open + 1)} />
      {/* THE ONE CONTROL THAT KNOWS SOMETHING THE PAGE DOES NOT: where this
          visitor stopped. Disabled rather than hidden once everything has been
          read, so it can still be learned — the same reasoning as the jump
          bar's UNREAD, which it now matches. */}
      <Step kind="unread" disabled={unread === null || unread === open}
            name={unread === null ? ALL_READ : NAMES.unread}
            onClick={() => unread !== null && onOpen(unread)} />
      <Step kind="latest" disabled={open === last}
            name={NAMES.latest} onClick={() => onOpen(last)} />
    </nav>
  );
}
