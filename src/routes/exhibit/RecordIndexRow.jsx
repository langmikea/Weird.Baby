import { entryStamp, evidenceOf } from "../../lib/record-model.js";

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
export default function RecordIndexRow({ entry, unread, onOpen }) {
  const en = entry;
  return (
    <li className={"vp-fe vp-rec-row" + (unread ? " vp-rec-row--unread" : "")}>
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
            THE DATE IS NOT DROPPED — it sits under the number the moment an
            entry carries one, derived by `entryStamp` exactly as before. An
            entry with both shows both; an entry with neither shows an empty rail
            that still holds the column, so the rows stay aligned either way.
            [D1 2026-08-08] AND RECORD 001 IS THE FIRST ENTRY TO SHOW BOTH: the
            rail was written for a day that had not been supplied, and the day
            has been supplied. */}
        <span className="vp-rec-mark" aria-hidden="true">
          {typeof en.no === "number" && (
            <b className="vp-rec-mark-no">
              {String(en.no).padStart(3, "0")}
            </b>
          )}
          {entryStamp(en) && (
            <i className="vp-rec-mark-day">{entryStamp(en)}</i>
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
          {/* [R3 2026-08-06] THE SUMMARY, WHOLE. `vp-rec-peek` was a one-line
              clamp with an ellipsis — the "half-sentence teaser" Mike struck.
              The class is gone rather than widened: a two-line clamp is the same
              failure with a longer fuse. The row is a fixed height and the
              summary is budgeted to fit it (gate: RECORD BUDGETS in
              reveal/record-shape.mjs), so nothing here can truncate. */}
          {en.line && <span className="vp-fe-line vp-rec-sum">{en.line}</span>}
        </span>
      </button>
    </li>
  );
}
