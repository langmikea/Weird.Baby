/* [2026-08-10] `entryStamp` is no longer imported here — the date came out of
   the rail on Mike's ruling. It is NOT unused: `RecordEntry.jsx` (twice) and
   `Exhibit.jsx`'s non-log entry lists still call it, so nothing was deleted
   from `record-model.js`. */
import { evidenceOf, entryWeekday } from "../../lib/record-model.js";

/* ===========================================================================
   [D4 2026-08-08] ONE ROW OF THE RECORD'S INDEX, LIFTED OUT OF `Exhibit.jsx`
   SO THAT TWO SURFACES CAN RENDER THE SAME ONE.
   ---------------------------------------------------------------------------
   WHY IT MOVED, AND IT IS THE ONLY REASON. Mike asked to see, while he writes,
   **exactly what the Record will look like on the page** — and ruled that if
   true fidelity means rendering the actual component, render the actual
   component rather than reimplementing its look. Half of what he writes lands
   in the opened entry (`RecordEntry.jsx`, already a component) and the other
   half — the headline and the one-sentence summary — lands HERE, in the index.
   That half was JSX inlined in a `.map()` five levels deep inside `Exhibit.jsx`,
   so the dictation preview had exactly two options: copy the markup, or not show
   the row. A copy drifts the first time anybody edits the index, and it drifts
   SILENTLY, which is the failure mode a preview cannot have — he will trust it.

   NOTHING ABOUT THE ROW CHANGED IN THE MOVE. Same element, same classes, same
   order, same conditions; the three comment blocks that were inside it came with
   it word for word, because they are the reasoning for what the row prints and
   they belong beside the row rather than beside the loop. What stayed in
   `Exhibit.jsx` is everything that is about the LIST rather than the row — the
   banding, the unread computation, the open handler — and those arrive as props.

   THE BAND ROW DID NOT COME. It is a different element for a different thing (a
   month heading, `aria-hidden`), it has no entry behind it, and the preview has
   one entry and therefore never bands. Moving it would have been tidying rather
   than a reason.
   =========================================================================== */
/* [2026-08-26] `read` IS A SECOND PROP RATHER THAN `!unread`, AND THE PREVIEW
   IS WHY. Mike struck the unread rule and ruled the marking the other way
   round: a READ record has its number and day slightly dimmed. The obvious
   shape — style `:not(.vp-rec-row--unread)` — is wrong, because `unread` is
   `list.length > 1 && isUnread(...)` and the FIRST half of that is not about
   this row at all. It says *is there a list worth marking*. The dictation
   preview renders exactly one entry, so `unread` is false there for a reason
   that has nothing to do with reading, and `:not()` would have dimmed the row
   Mike writes into.
   So the caller computes both against the same guard and this prints what it is
   told. A row can be neither, which is correct: one entry on its own is not
   read and not unread, it is just the entry. */
export default function RecordIndexRow({ entry, unread, read, onOpen }) {
  const en = entry;
  return (
    <li className={"vp-fe vp-rec-row"
                   + (unread ? " vp-rec-row--unread" : "")
                   + (read ? " vp-rec-row--read" : "")}>
      <button className="vp-rec-open" onClick={onOpen}>
        {/* ═══ [R1 2026-08-06] THE MARK, FAR LEFT ══════════════════════════
            MIKE: "each entry needs a DATE and/or a DAY NUMBER — or something
            better — set to the FAR LEFT of the entry. Propose the form; he is
            open."
            THE PROPOSAL IS THE RECORD NUMBER, and it is chosen over a date for
            a reason this volume has already paid for: THE DATES WERE INVENTED
            AND MIKE DELETED THEM. The one surviving entry carries no `date` and
            no `stamp` by his own ruling, so a rail built on a date would be an
            empty rail today and an invented one tomorrow.
            THE NUMBER IS AUTHORED, HELD AND STABLE. It is what a bound volume
            actually files by; it does not renumber when an entry is inserted the
            way an index position does; and the entry's own dateline already
            prints `Record 013` inside, so the rail and the record agree by
            construction.

            ═══ [2026-08-10] THE DATE IS OUT OF THE RAIL. MIKE'S RULING. ══════
            The rail holds the number and nothing else. The paragraph that stood
            here said the date "sits under the number the moment an entry carries
            one" — it did, and at 390px it did not fit: `17 AUG 26` needs 71.97px
            of Courier Prime against a 44px rail, so it WRAPPED TO THREE LINES on
            every dated row and made the rail 39px tall. That was live on the
            glass and nothing reported it, because a wrap is not an overflow.
            THE DATE IS NOT LOST AND NOTHING ABOUT THE DATA MOVED. `date` is
            untouched on every entry, `entryStamp` is untouched and still has
            four callers, and `entryDateline` still prints `Week 1 · Monday ·
            Record 001` at the head of the opened record — which is where a
            reader who wants the day is already looking. */}
        {/* ═══ [C1 2026-08-11] THE WEEKDAY IS BACK, AND ONLY THE WEEKDAY ═════
            MIKE'S RULING. Matching the deck to the headline's size (B3) took
            height out of the row, and this is what the room is spent on.
            IT IS NOT THE DATE COMING BACK. `17 AUG 26` was struck on
            2026-08-10 for a measured reason — 71.97px of Courier Prime against
            a 44px rail, so it wrapped to three lines on every dated row — and
            it stays struck. `MON` is three characters against the four the
            rail already carries for `0001`, so it costs the rail nothing.
            THE FULL NAME IS CUT TO THREE HERE RATHER THAN IN THE MODEL:
            `entryWeekday` returns `Monday` and four callers rely on that,
            `entryDateline` among them — it prints `Week 1 · Monday · Record
            001` at the head of the opened record and must keep the whole word.
            The rail is the only surface that wants an abbreviation, so the
            rail is where the abbreviating happens. */}
        <span className="vp-rec-mark" aria-hidden="true">
          {typeof en.no === "number" && (
            <b className="vp-rec-mark-no">
              {String(en.no).padStart(3, "0")}
            </b>
          )}
          {entryWeekday(en) && (
            <i className="vp-rec-mark-day">
              {entryWeekday(en).slice(0, 3).toUpperCase()}
            </i>
          )}
        </span>
        <span className="vp-fe-body">
          {/* [B9] the class rides the INDEX, which is the point of classing at
              all: a reader scanning the register can see that a week brought a
              transmission rather than another paragraph, before opening it.
              IT SHARES THE TITLE'S LINE, and that is arithmetic rather than
              taste: measured on its own row it added ~20px to each of ten rows
              and pushed the index onto a second page — a class badge that costs
              a page of navigation is not paying for itself. Beside the title it
              costs nothing and reads as what it is, an attribute of the entry. */}
          <span className="vp-fe-titlerow">
            <span className="vp-fe-title">{en.title}</span>
            {/* [R5 2026-08-06] THE CLASS BADGE IS STRUCK FROM THE INDEX — see
                the note on the entry in robots.js. It printed a word ("object")
                that opened nothing, beside a count that means something. The
                count stays. */}
            {/* [L6] WHAT THE WEEK ACTUALLY BROUGHT, counted, on the row. B9 put
                the CLASS on the index so a reader could see a week brought a
                transmission rather than another paragraph. The count is the
                other half: three photographs and a transmission is a different
                Tuesday from one photograph, and at binge volume that difference
                is the whole navigation. Absent entirely on an entry with no
                payloads, which is every entry written so far — the index does
                not move until the evidence does. */}
            {evidenceOf(en).map(ev => (
              <span key={ev.kind} className="vp-fe-load">
                {ev.kind}<i>{ev.count}</i>
              </span>
            ))}
          </span>
        </span>
        {/* [R3 2026-08-06] THE SUMMARY, WHOLE. `vp-rec-peek` was a one-line
            clamp with an ellipsis — the "half-sentence teaser" Mike struck.
            The class is gone rather than widened: a two-line clamp is the same
            failure with a longer fuse. The row is a fixed height and the
            summary is budgeted to fit it (gate: RECORD BUDGETS in
            reveal/record-shape.mjs), so nothing here can truncate.

            ═══ [2026-08-10] THE DECK IS FULL WIDTH AND IT IS A GRID SIBLING NOW.
            MIKE'S RULING: the deck runs the whole row beneath the rail, and the
            rail indents the HEADLINE only. It was inside `.vp-fe-body`, in the
            second column, so it started where the headline starts and gave up
            60px of a 390px screen to a rail it did not need — 38 characters a
            line against 46 out here, measured.
            IT LEFT `.vp-fe-body` RATHER THAN THE BODY BEING DISSOLVED, which is
            the smaller change: `.vp-fe-body` is a SHARED class (`Exhibit.jsx`'s
            other entry lists use it) and it still wraps the headline row and
            still carries its 68ch cap. Only the deck moved out.
            The row is `display: grid` with two columns; this span sets
            `grid-column: 1 / -1` and drops to the second row. */}
        {en.line && <span className="vp-fe-line vp-rec-sum">{en.line}</span>}
      </button>
    </li>
  );
}
